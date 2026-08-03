import React, { useState, useEffect, useMemo } from 'react';
import PageContainer from '../components/PageContainer';
import { TrashIcon, ArrowLeftIcon, XIcon, CheckCircleIcon, MapPinIcon } from '../components/icons';
import { firestoreService, userLogService } from '../lib/firebaseService';
import { cn } from '../lib/utils';
import { onSnapshot, collection } from 'firebase/firestore';
import { db } from '../lib/firebase';

const TRASH_EXPIRY_DAYS = 90;

// â”€â”€â”€ Expiry helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const getDaysRemaining = (deletedAt?: string): number | null => {
    if (!deletedAt) return null;
    const deletedDate = new Date(deletedAt).getTime();
    const now = Date.now();
    const daysPassed = Math.floor((now - deletedDate) / (1000 * 60 * 60 * 24));
    return TRASH_EXPIRY_DAYS - daysPassed;
};

const ExpiryBadge: React.FC<{ deletedAt?: string }> = ({ deletedAt }) => {
    const days = getDaysRemaining(deletedAt);
    if (days === null) return null;

    if (days <= 0) {
        return (
            <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 bg-red-700/30 border border-red-600/60 text-red-300 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                Expiring now
            </span>
        );
    }
    if (days <= 7) {
        return (
            <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 bg-red-900/30 border border-red-800/60 text-red-400 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                {days}d left
            </span>
        );
    }
    if (days <= 30) {
        return (
            <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 bg-yellow-900/20 border border-yellow-700/40 text-yellow-500">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 shrink-0" />
                {days}d left
            </span>
        );
    }
    return (
        <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 bg-gray-900/40 border border-gray-700/40 text-gray-600">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-600 shrink-0" />
            {days}d left
        </span>
    );
};

// â”€â”€â”€ Hard-delete confirmation modal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
                            {loading ? 'Deletingâ€¦' : 'Delete'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// â”€â”€â”€ Stage badge â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

// â”€â”€â”€ Source badge â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const sourceBadge = (source?: string) => {
    if (source === 'leads') return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30';
    if (source === 'deals') return 'bg-blue-500/10 text-blue-500 border-blue-500/30';
    return 'bg-gray-800/60 text-gray-500 border-gray-700';
};

// â”€â”€â”€ Helper to resolve source collection â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const resolveCollection = (record: any): string => {
    if (record._source === 'leads') return 'leads';
    if (record._source === 'deals') return 'deals';
    return 'projects';
};

// â”€â”€â”€ Main Page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const TrashBinPage: React.FC = () => {
    const [allDeleted, setAllDeleted] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [restoringId, setRestoringId] = useState<string | null>(null);
    const [hardDeleteTarget, setHardDeleteTarget] = useState<any | null>(null);
    const [filterStage, setFilterStage] = useState<string>('All');
    const [autoExpiredCount, setAutoExpiredCount] = useState(0);

    // Auto-expire records past 90 days on mount
    useEffect(() => {
        firestoreService.autoExpireTrash(['projects', 'leads', 'deals'], TRASH_EXPIRY_DAYS)
            .then(async (expired) => {
                if (expired.length === 0) return;
                setAutoExpiredCount(expired.length);
                // Log each auto-expired record
                for (const r of expired) {
                    await userLogService.logAction(
                        'PERMANENT_DELETE',
                        `Record auto-deleted after ${TRASH_EXPIRY_DAYS} days in trash`,
                        { recordId: r.id, collection: r.collection, recordName: r.name }
                    );
                }
            });
    }, []);

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

    // Sorted soonest-to-expire first
    const sorted = useMemo(() => {
        return [...filtered].sort((a, b) => {
            const da = new Date(a.deleted_at || 0).getTime();
            const db_ = new Date(b.deleted_at || 0).getTime();
            return da - db_; // oldest deleted_at = nearest expiry
        });
    }, [filtered]);

    // Count records expiring within 7 days
    const expiringSoonCount = useMemo(() => {
        return allDeleted.filter(r => {
            const d = getDaysRemaining(r.deleted_at);
            return d !== null && d <= 7 && d > 0;
        }).length;
    }, [allDeleted]);

    const handleRestore = async (record: any) => {
        setRestoringId(record.id);
        const col = resolveCollection(record);
        await firestoreService.restoreDocument(col, record.id);
        await userLogService.logAction(
            'RESTORE_RECORD',
            `${record.name || 'Record'} was restored from trash`,
            { recordId: record.id, collection: col, recordName: record.name || 'Unknown' }
        );
        setRestoringId(null);
    };

    const handleHardDelete = async (record: any) => {
        const col = resolveCollection(record);
        await firestoreService.deleteDocument(col, record.id);
        await userLogService.logAction(
            'PERMANENT_DELETE',
            `${record.name || 'Record'} was permanently deleted`,
            { recordId: record.id, collection: col, recordName: record.name || 'Unknown' }
        );
        setHardDeleteTarget(null);
    };

    const formatDeletedAt = (iso?: string) => {
        if (!iso) return 'â€”';
        const d = new Date(iso);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) +
            ' Â· ' + d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <PageContainer
            title="Trash Bin"
            description="Deleted pipeline records. Records are automatically and permanently deleted after 90 days."
            headerAction={
                <div className={cn(
                    'flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest',
                    loading ? 'text-yellow-400 animate-pulse' : 'text-green-400'
                )}>
                    <span className={cn('w-1.5 h-1.5 rounded-full', loading ? 'bg-yellow-400' : 'bg-green-400 shadow-[0_0_8px_#4ade80]')} />
                    {loading ? 'Syncingâ€¦' : 'Live'}
                </div>
            }
        >
            {/* Auto-expired banner */}
            {autoExpiredCount > 0 && (
                <div className="flex items-center gap-3 mb-4 p-3 bg-red-900/10 border border-red-900/30 text-[11px] text-red-400"
                    style={{ clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)' }}
                >
                    <TrashIcon className="w-3.5 h-3.5 shrink-0" />
                    <span>
                        <span className="font-black">{autoExpiredCount} record{autoExpiredCount !== 1 ? 's' : ''}</span> were automatically and permanently deleted â€” they had been in the trash for over 90 days.
                    </span>
                </div>
            )}

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
                        <p className="text-lg font-black text-white">{loading ? 'â€”' : allDeleted.length}</p>
                    </div>
                </div>
                <div className="w-px h-8 bg-gray-800" />
                <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Showing</p>
                    <p className="text-lg font-black text-white">{loading ? 'â€”' : sorted.length}</p>
                </div>
                {expiringSoonCount > 0 && (
                    <>
                        <div className="w-px h-8 bg-gray-800" />
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-red-500">Expiring Soon</p>
                            <p className="text-lg font-black text-red-400 animate-pulse">{expiringSoonCount}</p>
                        </div>
                    </>
                )}
                <div className="ml-auto flex items-start gap-2 text-[11px] text-gray-600 leading-relaxed max-w-xs text-right">
                    <CheckCircleIcon className="w-3.5 h-3.5 text-gray-700 mt-0.5 shrink-0" />
                    <span>Records are permanently deleted after {TRASH_EXPIRY_DAYS} days in trash.</span>
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
                    {sorted.map(record => {
                        const daysLeft = getDaysRemaining(record.deleted_at);
                        const isUrgent = daysLeft !== null && daysLeft <= 7;
                        return (
                            <div
                                key={`${record._source}-${record.id}`}
                                id={`trash-record-${record.id}`}
                                className={cn(
                                    'relative bg-gray-900/40 border transition-all duration-300 group',
                                    isUrgent
                                        ? 'border-red-900/50 hover:border-red-700/70'
                                        : 'border-gray-800 hover:border-red-900/50'
                                )}
                                style={{ clipPath: 'polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)' }}
                            >
                                {/* Urgent glow for expiring soon */}
                                {isUrgent && (
                                    <div className="absolute inset-0 bg-red-900/5 pointer-events-none" />
                                )}
                                {/* Top accent */}
                                <div className={cn(
                                    'absolute top-0 left-4 right-0 h-[1px] bg-gradient-to-r from-transparent to-transparent transition-all',
                                    isUrgent ? 'via-red-600/30' : 'via-red-600/0 group-hover:via-red-600/40'
                                )} />

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

                                    {/* Stage + expiry + deleted info */}
                                    <div className="space-y-1.5 mb-4">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className={cn('text-[10px] px-2 py-0.5 border font-black uppercase tracking-wider', stageBadgeColor(record.current_stage))}>
                                                {record.current_stage || 'Unknown'}
                                            </span>
                                            <ExpiryBadge deletedAt={record.deleted_at} />
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
                                            {restoringId === record.id ? 'Restoringâ€¦' : 'Restore'}
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
                        );
                    })}
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
