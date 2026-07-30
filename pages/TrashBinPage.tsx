
import React, { useState, useEffect, useMemo } from 'react';
import PageContainer from '../components/PageContainer';
import { TrashIcon, ArrowLeftIcon, XIcon, CheckCircleIcon, BriefcaseIcon, MapPinIcon } from '../components/icons';
import { firestoreService, userLogService } from '../lib/firebaseService';
import { cn } from '../lib/utils';
import { onSnapshot, collection } from 'firebase/firestore';
import { db } from '../lib/firebase';

// ─── Hard-delete confirmation modal ───────────────────────────────────────────
interface HardDeleteModalProps {
    recordName: string;
    onClose: () => void;
    onConfirm: () => Promise<void>;
}

const HardDeleteModal: React.FC<HardDeleteModalProps> = ({ recordName, onClose, onConfirm }) => {
    const [loading, setLoading] = useState(false);

    const handleConfirm = async () => {
        setLoading(true);
        await onConfirm();
        setLoading(false);
    };

    return (
        <div
            id="hard-delete-modal-backdrop"
            className="fixed inset-0 z-[400] flex items-center justify-center"
            onClick={onClose}
        >
            <div className="absolute inset-0 bg-black/90 backdrop-blur-md" />
            <div
                id="hard-delete-modal-panel"
                className="relative z-10 w-full max-w-sm mx-4 bg-[#0a0a0a] border border-red-900/50 shadow-[0_0_50px_rgba(239,68,68,0.2)]"
                style={{ clipPath: 'polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)' }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-red-600 to-transparent" />
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 flex items-center justify-center bg-red-600/15 border border-red-600/40 rounded-sm">
                            <TrashIcon className="w-5 h-5 text-red-500" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500 mb-0.5">Permanent Action</p>
                            <h2 className="text-base font-black text-white">Delete Forever</h2>
                        </div>
                    </div>
                    <p className="text-sm text-gray-400 leading-relaxed mb-5">
                        <span className="text-white font-bold">{recordName || 'This record'}</span> will be permanently deleted and cannot be recovered.
                    </p>
                    <div className="flex gap-3">
                        <button
                            id="hard-delete-cancel-btn"
                            onClick={onClose}
                            disabled={loading}
                            className="flex-1 py-2 text-xs font-black uppercase tracking-widest text-gray-500 hover:text-white border border-gray-800 hover:border-gray-600 transition-all rounded-sm"
                        >
                            Cancel
                        </button>
                        <button
                            id="hard-delete-confirm-btn"
                            onClick={handleConfirm}
                            disabled={loading}
                            className="flex-1 py-2 text-xs font-black uppercase tracking-widest bg-red-700/30 border border-red-600/60 text-red-400 hover:bg-red-700/50 hover:text-red-300 transition-all rounded-sm disabled:opacity-50 disabled:pointer-events-none"
                        >
                            {loading ? 'Deleting…' : 'Delete'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── Stage badge ──────────────────────────────────────────────────────────────
const stageBadgeColor = (stage?: string) => {
    const s = (stage || '').toLowerCase();
    if (s.includes('lead')) return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
    if (s.includes('estimate')) return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
    if (s.includes('quote')) return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';
    if (s.includes('sign')) return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
    if (s.includes('schedule') || s.includes('pre-install')) return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
    if (s.includes('install')) return 'bg-orange-500/10 text-orange-400 border-orange-500/30';
    if (s.includes('invoic')) return 'bg-green-500/10 text-green-400 border-green-500/30';
    if (s.includes('complet') || s.includes('past')) return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    return 'bg-gray-800 text-gray-400 border-gray-700';
};

// ─── Source badge ─────────────────────────────────────────────────────────────
const sourceBadge = (source?: string) => {
    if (source === 'leads') return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30';
    if (source === 'deals') return 'bg-blue-500/10 text-blue-500 border-blue-500/30';
    return 'bg-gray-800/60 text-gray-500 border-gray-700';
};

// ─── Helper to resolve source collection ─────────────────────────────────────
const resolveCollection = (record: any): string => {
    if (record._source === 'leads') return 'leads';
    if (record._source === 'deals') return 'deals';
    return 'projects';
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const TrashBinPage: React.FC = () => {
    const [allDeleted, setAllDeleted] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [restoringId, setRestoringId] = useState<string | null>(null);
    const [hardDeleteTarget, setHardDeleteTarget] = useState<any | null>(null);
    const [filterStage, setFilterStage] = useState<string>('All');

    // Subscribe to all 3 collections for deleted records
    useEffect(() => {
        let projectsDeleted: any[] = [];
        let leadsDeleted: any[] = [];
        let dealsDeleted: any[] = [];

        const notify = () => {
            setAllDeleted([...projectsDeleted, ...leadsDeleted, ...dealsDeleted]);
            setLoading(false);
        };

        const unsubProjects = onSnapshot(collection(db, 'projects'), (snap) => {
            projectsDeleted = snap.docs
                .map(d => ({ id: d.id, ...d.data(), _source: 'projects' } as any))
                .filter(r => r.deleted === true);
            notify();
        }, () => notify());

        const unsubLeads = onSnapshot(collection(db, 'leads'), (snap) => {
            leadsDeleted = snap.docs
                .map(d => ({ id: d.id, ...d.data(), _source: 'leads' } as any))
                .filter(r => r.deleted === true)
                .map(r => ({
                    ...r,
                    name: r.name || (r.firstName && r.lastName ? `${r.firstName} ${r.lastName}` : null) || r.projectName || 'Unnamed Lead',
                    property_address: r.property_address || r.projectAddress || r.projectStreet || '',
                    current_stage: r.current_stage || 'Lead',
                }));
            notify();
        }, () => notify());

        const unsubDeals = onSnapshot(collection(db, 'deals'), (snap) => {
            dealsDeleted = snap.docs
                .map(d => ({ id: d.id, ...d.data(), _source: 'deals' } as any))
                .filter(r => r.deleted === true)
                .map(r => ({
                    ...r,
                    name: r.name || r.Deal_Name || 'Unnamed Deal',
                    property_address: r.property_address || r.Property_Address || '',
                    current_stage: r.current_stage || r.Deal_Stage || 'Lead',
                }));
            notify();
        }, () => notify());

        return () => {
            unsubProjects();
            unsubLeads();
            unsubDeals();
        };
    }, []);

    // Distinct stages for filter tabs
    const stages = useMemo(() => {
        const all = new Set(allDeleted.map(r => r.current_stage || 'Unknown'));
        return ['All', ...Array.from(all).sort()];
    }, [allDeleted]);

    const filtered = useMemo(() => {
        if (filterStage === 'All') return allDeleted;
        return allDeleted.filter(r => (r.current_stage || 'Unknown') === filterStage);
    }, [allDeleted, filterStage]);

    // Sorted newest-deleted first
    const sorted = useMemo(() => {
        return [...filtered].sort((a, b) => {
            const da = new Date(a.deleted_at || 0).getTime();
            const db = new Date(b.deleted_at || 0).getTime();
            return db - da;
        });
    }, [filtered]);

    const handleRestore = async (record: any) => {
        setRestoringId(record.id);
        const col = resolveCollection(record);
        await firestoreService.restoreDocument(col, record.id);
        await userLogService.logAction(
            'RESTORE_RECORD',
            `Record restored from trash (ID: ${record.id}, Name: ${record.name || 'Unknown'})`,
            { recordId: record.id, collection: col }
        );
        setRestoringId(null);
    };

    const handleHardDelete = async (record: any) => {
        const col = resolveCollection(record);
        await firestoreService.deleteDocument(col, record.id);
        await userLogService.logAction(
            'PERMANENT_DELETE',
            `Record permanently deleted (ID: ${record.id}, Name: ${record.name || 'Unknown'})`,
            { recordId: record.id, collection: col }
        );
        setHardDeleteTarget(null);
    };

    const formatDeletedAt = (iso?: string) => {
        if (!iso) return '—';
        const d = new Date(iso);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) +
            ' · ' + d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <PageContainer
            title="Trash Bin"
            description="Soft-deleted pipeline records. Restore any record to bring it back into the active pipeline, or permanently delete it."
            headerAction={
                <div className={cn(
                    'flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest',
                    loading ? 'text-yellow-400 animate-pulse' : 'text-green-400'
                )}>
                    <span className={cn('w-1.5 h-1.5 rounded-full', loading ? 'bg-yellow-400' : 'bg-green-400 shadow-[0_0_8px_#4ade80]')} />
                    {loading ? 'Syncing…' : 'Live'}
                </div>
            }
        >
            {/* Stage filter tabs */}
            <div className="flex items-center gap-2 mb-6 flex-wrap">
                <div className="flex items-center gap-1.5 mr-2 shrink-0">
                    <TrashIcon className="w-4 h-4 text-red-400" />
                    <span className="text-xs font-black uppercase tracking-widest text-red-400">Filter:</span>
                </div>
                {stages.map(stage => (
                    <button
                        key={stage}
                        id={`trash-filter-${stage.replace(/\s/g, '-').toLowerCase()}`}
                        onClick={() => setFilterStage(stage)}
                        className={cn(
                            'px-3 py-1 text-xs font-bold uppercase tracking-wider border transition-all',
                            filterStage === stage
                                ? 'bg-red-600/20 border-red-600/50 text-red-400'
                                : 'bg-gray-900/40 border-gray-800 text-gray-500 hover:text-white hover:border-gray-600'
                        )}
                        style={{ clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)' }}
                    >
                        {stage}
                    </button>
                ))}
            </div>

            {/* Stats bar */}
            <div className="flex items-center gap-4 mb-6 p-4 bg-gray-900/30 border border-gray-800/60"
                style={{ clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)' }}
            >
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 flex items-center justify-center bg-red-500/10 border border-red-500/20 rounded-sm">
                        <TrashIcon className="w-4 h-4 text-red-400" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Total in Trash</p>
                        <p className="text-lg font-black text-white">{loading ? '—' : allDeleted.length}</p>
                    </div>
                </div>
                <div className="w-px h-8 bg-gray-800" />
                <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Showing</p>
                    <p className="text-lg font-black text-white">{loading ? '—' : sorted.length}</p>
                </div>
                <div className="ml-auto flex items-start gap-2 text-[11px] text-gray-600 leading-relaxed max-w-xs text-right">
                    <CheckCircleIcon className="w-3.5 h-3.5 text-gray-700 mt-0.5 shrink-0" />
                    <span>Records here are hidden from the pipeline but stored safely in Firebase.</span>
                </div>
            </div>

            {/* Records grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-48 bg-gray-900 border border-gray-800 animate-pulse"
                            style={{ clipPath: 'polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)' }}
                        />
                    ))}
                </div>
            ) : sorted.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-20 border border-dashed border-gray-800 bg-gray-900/20"
                    style={{ clipPath: 'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)' }}
                >
                    <div className="w-16 h-16 flex items-center justify-center bg-gray-900 border border-gray-800 rounded-full mb-4">
                        <TrashIcon className="w-7 h-7 text-gray-700" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-500">Trash is Empty</h3>
                    <p className="text-sm text-gray-700 mt-2 text-center max-w-xs">
                        {filterStage !== 'All'
                            ? `No deleted records in the "${filterStage}" stage.`
                            : 'No deleted records. Move pipeline records to trash to see them here.'}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {sorted.map(record => (
                        <div
                            key={`${record._source}-${record.id}`}
                            id={`trash-record-${record.id}`}
                            className="relative bg-gray-900/40 border border-gray-800 hover:border-red-900/50 transition-all duration-300 group"
                            style={{ clipPath: 'polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)' }}
                        >
                            {/* Red top accent on hover */}
                            <div className="absolute top-0 left-4 right-0 h-[1px] bg-gradient-to-r from-transparent via-red-600/0 to-transparent group-hover:via-red-600/40 transition-all" />

                            <div className="p-5">
                                {/* Record header */}
                                <div className="flex justify-between items-start mb-3">
                                    <div className="min-w-0 pr-2">
                                        <h3 className="text-white font-bold text-base truncate group-hover:text-red-400 transition-colors">
                                            {record.name || 'Unnamed Record'}
                                        </h3>
                                        {record.property_address && (
                                            <div className="flex items-center text-xs text-gray-600 mt-1">
                                                <MapPinIcon className="w-3 h-3 mr-1 shrink-0" />
                                                <span className="truncate">{record.property_address}</span>
                                            </div>
                                        )}
                                    </div>
                                    <span className={cn(
                                        'text-[9px] font-black uppercase tracking-widest px-2 py-0.5 border shrink-0',
                                        sourceBadge(record._source)
                                    )}>
                                        {record._source}
                                    </span>
                                </div>

                                {/* Stage + deleted info */}
                                <div className="space-y-1.5 mb-4">
                                    <div className="flex items-center gap-2">
                                        <span className={cn('text-[10px] px-2 py-0.5 border font-black uppercase tracking-wider', stageBadgeColor(record.current_stage))}>
                                            {record.current_stage || 'Unknown'}
                                        </span>
                                    </div>

                                    {record.deletion_reason && (
                                        <p className="text-[11px] text-gray-600 italic truncate">
                                            "{record.deletion_reason}"
                                        </p>
                                    )}

                                    <div className="flex items-center gap-1.5 text-[10px] text-gray-700 font-mono">
                                        <TrashIcon className="w-3 h-3 text-red-900" />
                                        <span>{formatDeletedAt(record.deleted_at)}</span>
                                    </div>

                                    {record.deleted_by && record.deleted_by !== 'unknown' && (
                                        <p className="text-[10px] text-gray-700 font-mono">
                                            By: <span className="text-gray-600">{record.deleted_by}</span>
                                        </p>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2 pt-3 border-t border-gray-800/60">
                                    {/* Restore */}
                                    <button
                                        id={`restore-btn-${record.id}`}
                                        onClick={() => handleRestore(record)}
                                        disabled={restoringId === record.id}
                                        aria-label={`Restore ${record.name || 'record'}`}
                                        className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-black uppercase tracking-widest bg-[#ec028b]/10 border border-[#ec028b]/30 text-[#ec028b] hover:bg-[#ec028b]/20 hover:border-[#ec028b]/60 transition-all disabled:opacity-50 disabled:pointer-events-none"
                                        style={{ clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)' }}
                                    >
                                        {restoringId === record.id ? (
                                            <div className="w-3 h-3 border border-[#ec028b] border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <ArrowLeftIcon className="w-3 h-3 rotate-[-90deg]" />
                                        )}
                                        {restoringId === record.id ? 'Restoring…' : 'Restore'}
                                    </button>

                                    {/* Permanent delete */}
                                    <button
                                        id={`hard-delete-btn-${record.id}`}
                                        onClick={() => setHardDeleteTarget(record)}
                                        aria-label={`Permanently delete ${record.name || 'record'}`}
                                        className="w-9 h-9 flex items-center justify-center bg-red-900/10 border border-red-900/30 text-red-700 hover:bg-red-900/25 hover:border-red-700/50 hover:text-red-400 transition-all"
                                        style={{ clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)' }}
                                    >
                                        <XIcon className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Hard-delete confirmation modal */}
            {hardDeleteTarget && (
                <HardDeleteModal
                    recordName={hardDeleteTarget.name || 'Unnamed Record'}
                    onClose={() => setHardDeleteTarget(null)}
                    onConfirm={() => handleHardDelete(hardDeleteTarget)}
                />
            )}
        </PageContainer>
    );
};

export default TrashBinPage;
