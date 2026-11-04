import React, { useState, useEffect } from 'react';
import { ProjectStageLayout, PIPELINE } from '../components/ProjectStageLayout';
import Card from '../components/Card';
import Button from '../components/Button';
import { CheckIcon, PlusIcon, ChevronRightIcon, CheckCircleIcon } from '../components/icons';
import { projectService, userLogService } from '../lib/firebaseService';
import { useNavigation } from '../contexts/NavigationContext';
import { cn } from '../lib/utils';

interface InstallPhase {
    id: string;
    label: string;
    done: boolean;
}

interface AwoItem {
    id: string;
    title: string;
    amount: number;
    createdAt: string;
}

const DEFAULT_INSTALL_PHASES: InstallPhase[] = [
    { id: 'tearoff', label: 'Tear-off Complete', done: true },
    { id: 'decking', label: 'Decking Inspected & Re-Nailed', done: true },
    { id: 'underlayment', label: 'Synthetic Underlayment & Ice Shield', done: false },
    { id: 'system', label: 'Primary Roof System Installed', done: false },
    { id: 'cleanup', label: 'Final Perimeter Site Cleanup', done: false },
];

const PROGRESS_WIDTH_CLASS: Record<number, string> = {
    0: 'w-0',
    1: 'w-1/5',
    2: 'w-2/5',
    3: 'w-3/5',
    4: 'w-4/5',
    5: 'w-full',
};

const InstallContent: React.FC<{ project: any }> = ({ project }) => {
    const { setActivePageId } = useNavigation();

    const [phases, setPhases] = useState<InstallPhase[]>(
        Array.isArray(project?.install_progress) && project.install_progress.length > 0
            ? project.install_progress
            : DEFAULT_INSTALL_PHASES
    );
    const [photoNotes, setPhotoNotes] = useState<string[]>(
        Array.isArray(project?.install_photos) && project.install_photos.length > 0
            ? project.install_photos
            : ['Decking & Valley Ice Shield Verified', 'Ridge Vent & Flashing Detail']
    );
    const [newPhotoNote, setNewPhotoNote] = useState('');
    const [awos, setAwos] = useState<AwoItem[]>(
        Array.isArray(project?.awos) ? project.awos : []
    );
    const [awoTitle, setAwoTitle] = useState('');
    const [awoAmount, setAwoAmount] = useState('');
    const [saving, setSaving] = useState(false);
    const [banner, setBanner] = useState('');

    useEffect(() => {
        setPhases(
            Array.isArray(project?.install_progress) && project.install_progress.length > 0
                ? project.install_progress
                : DEFAULT_INSTALL_PHASES
        );
        setPhotoNotes(
            Array.isArray(project?.install_photos) && project.install_photos.length > 0
                ? project.install_photos
                : ['Decking & Valley Ice Shield Verified', 'Ridge Vent & Flashing Detail']
        );
        setAwos(Array.isArray(project?.awos) ? project.awos : []);
    }, [project?.id]);

    const doneCount = phases.filter(t => t.done).length;
    const pct = Math.round((doneCount / phases.length) * 100);
    const widthClass = PROGRESS_WIDTH_CLASS[doneCount] || 'w-0';
    const awoTotal = awos.reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const baseContract = Number(project?.quote?.total || 0);

    const persistInstallState = async (
        nextPhases: InstallPhase[],
        nextPhotos: string[],
        nextAwos: AwoItem[],
        advance = false
    ) => {
        if (!project?.id || saving) return;
        setSaving(true);
        setBanner('');
        try {
            const updates: Record<string, any> = {
                install_progress: nextPhases,
                install_photos: nextPhotos,
                awos: nextAwos,
                pizza_tracker: advance
                    ? {
                        stage: 'Warranty Activation',
                        stageIndex: 7,
                        totalStages: PIPELINE.length,
                        subSteps: PIPELINE[7].defaultSubSteps.map((label, idx) => ({ label, done: idx === 0 })),
                        updatedAt: new Date().toISOString(),
                    }
                    : {
                        stage: 'Install',
                        stageIndex: 6,
                        totalStages: PIPELINE.length,
                        subSteps: nextPhases.map(p => ({ label: p.label, done: p.done })),
                        updatedAt: new Date().toISOString(),
                    },
            };

            if (advance) {
                updates.current_stage = 'Warranty Activation';
            }

            await projectService.updateRecord(project.id, updates, project._source);
            await userLogService.logAction(
                advance ? 'STAGE_CHANGE' : 'EDIT_RECORD',
                advance
                    ? `${project.name || 'Project'} installation completed — moved to Warranty Activation`
                    : `Updated installation progress (${Math.round((nextPhases.filter(p => p.done).length / nextPhases.length) * 100)}%) for ${project.name || 'Project'}`,
                {
                    recordId: project.id,
                    recordName: project.name || 'Project',
                    collection: project._source || 'projects',
                    stage: advance ? 'Warranty Activation' : 'Install',
                }
            );

            if (advance) {
                setActivePageId('E-33');
            } else {
                setBanner('Installation progress synced to Firebase & Client Pizza Tracker.');
            }
        } finally {
            setSaving(false);
        }
    };

    const handleTogglePhase = (id: string) => {
        const next = phases.map(p => (p.id === id ? { ...p, done: !p.done } : p));
        setPhases(next);
        persistInstallState(next, photoNotes, awos, false);
    };

    const handleAddPhotoNote = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPhotoNote.trim()) return;
        const nextPhotos = [...photoNotes, newPhotoNote.trim()];
        setPhotoNotes(nextPhotos);
        setNewPhotoNote('');
        persistInstallState(phases, nextPhotos, awos, false);
    };

    const handleCreateAwo = (e: React.FormEvent) => {
        e.preventDefault();
        if (!awoTitle.trim()) return;
        const nextAwos: AwoItem[] = [
            ...awos,
            {
                id: `awo-${Date.now()}`,
                title: awoTitle.trim(),
                amount: Number(awoAmount) || 0,
                createdAt: new Date().toISOString(),
            },
        ];
        setAwos(nextAwos);
        setAwoTitle('');
        setAwoAmount('');
        persistInstallState(phases, photoNotes, nextAwos, false);
    };

    return (
        <div className="p-6 md:p-8 space-y-6">
            {banner && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2">
                    <CheckCircleIcon className="w-4 h-4 flex-none" />
                    <span>{banner}</span>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card title="Installation Progress">
                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs text-gray-500 uppercase font-bold tracking-widest">Overall Crew Progress</span>
                                <span className="text-[#ec028b] font-bold font-mono text-sm">{pct}%</span>
                            </div>
                            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                                <div className={cn('h-full bg-gradient-to-r from-[#ec028b] to-pink-400 rounded-full transition-all duration-500', widthClass)} />
                            </div>
                        </div>

                        <div className="space-y-2.5">
                            {phases.map((task, idx) => (
                                <button
                                    key={task.id}
                                    id={`install-phase-${idx}`}
                                    type="button"
                                    onClick={() => handleTogglePhase(task.id)}
                                    className={cn(
                                        'w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition-all',
                                        task.done
                                            ? 'border-[#ec028b] bg-[#ec028b]/10 shadow-[0_0_15px_rgba(236,2,139,0.2)]'
                                            : 'border-gray-800 bg-gray-900/40 hover:border-gray-600'
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={cn(
                                            'w-5 h-5 rounded-full flex-none flex items-center justify-center border',
                                            task.done ? 'bg-[#ec028b] border-[#ec028b] text-white' : 'border-gray-700 bg-black'
                                        )}>
                                            {task.done && <CheckIcon className="w-3 h-3" />}
                                        </div>
                                        <span className={cn('text-sm font-semibold', task.done ? 'text-white' : 'text-gray-400')}>
                                            {task.label}
                                        </span>
                                    </div>
                                    <span className={cn(
                                        'text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded border',
                                        task.done
                                            ? 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10'
                                            : 'text-gray-400 border-gray-700 bg-black/50'
                                    )}>
                                        {task.done ? 'Complete' : 'Confirm'}
                                    </span>
                                </button>
                            ))}
                        </div>

                        <div className="mt-6 pt-5 border-t border-gray-800 flex justify-end">
                            <Button
                                id="install-advance-btn"
                                onClick={() => persistInstallState(phases, photoNotes, awos, true)}
                                disabled={saving}
                                className="flex items-center gap-2"
                            >
                                <span>{saving ? 'Saving…' : 'Confirm & Advance to Warranty'}</span>
                                <ChevronRightIcon className="w-4 h-4" />
                            </Button>
                        </div>
                    </Card>

                    <Card title="Crew Field Photo Log">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                            {photoNotes.map((note, idx) => (
                                <div key={`${note}-${idx}`} className="p-3 bg-gray-900/60 rounded-xl border border-gray-800 flex items-center justify-between gap-2">
                                    <span className="text-xs text-gray-200 font-medium truncate">{note}</span>
                                    <span className="text-[10px] font-mono text-emerald-400 uppercase">Logged</span>
                                </div>
                            ))}
                        </div>
                        <form onSubmit={handleAddPhotoNote} className="flex gap-2">
                            <input
                                id="install-photo-note-input"
                                type="text"
                                value={newPhotoNote}
                                onChange={(e) => setNewPhotoNote(e.target.value)}
                                placeholder="Log crew photo milestone (e.g. Chimney cricket flashed)..."
                                className="flex-1 bg-black/60 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#ec028b]"
                            />
                            <Button id="install-add-photo-btn" type="submit" variant="secondary" size="sm">
                                Create
                            </Button>
                        </form>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card title="Production Summary">
                        <div className="space-y-3 text-sm">
                            <div>
                                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-0.5">Project</p>
                                <p className="text-white font-bold">{project.name}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-0.5">Assigned Crew</p>
                                <p className="text-gray-200">{project?.ops_schedule?.crewName || 'RHIVE Certified Crew'}</p>
                            </div>
                            {baseContract > 0 && (
                                <div>
                                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-0.5">Base Contract</p>
                                    <p className="text-white font-mono font-bold">${baseContract.toLocaleString()}</p>
                                </div>
                            )}
                            {awoTotal > 0 && (
                                <div>
                                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-0.5">Approved AWOs</p>
                                    <p className="text-[#ec028b] font-mono font-bold">+${awoTotal.toLocaleString()}</p>
                                </div>
                            )}
                        </div>
                    </Card>

                    <Card title="Additional Work Orders (AWO)">
                        {awos.length === 0 ? (
                            <p className="text-gray-500 text-xs mb-4">No additional decking or wood replacement work orders logged.</p>
                        ) : (
                            <div className="space-y-2 mb-4">
                                {awos.map((item) => (
                                    <div key={item.id} className="flex items-center justify-between p-2.5 rounded-lg bg-gray-900/60 border border-gray-800 text-xs">
                                        <span className="text-gray-200 font-medium truncate pr-2">{item.title}</span>
                                        <span className="text-[#ec028b] font-mono font-bold shrink-0">${item.amount.toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        <form onSubmit={handleCreateAwo} className="space-y-2.5">
                            <input
                                id="install-awo-title-input"
                                type="text"
                                value={awoTitle}
                                onChange={(e) => setAwoTitle(e.target.value)}
                                placeholder="Decking / Fascia replacement item"
                                className="w-full bg-black/60 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#ec028b]"
                            />
                            <input
                                id="install-awo-amount-input"
                                type="number"
                                min="0"
                                step="1"
                                value={awoAmount}
                                onChange={(e) => setAwoAmount(e.target.value)}
                                placeholder="Amount ($)"
                                className="w-full bg-black/60 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white font-mono placeholder-gray-500 focus:outline-none focus:border-[#ec028b]"
                            />
                            <Button id="install-create-awo-btn" type="submit" variant="secondary" className="w-full flex items-center justify-center gap-2">
                                <PlusIcon className="w-4 h-4" />
                                <span>Create</span>
                            </Button>
                        </form>
                    </Card>
                </div>
            </div>
        </div>
    );
};

const InstallPage: React.FC = () => (
    <ProjectStageLayout stageLabel="Install" stagePageId="E-32">
        {(project) => <InstallContent project={project} />}
    </ProjectStageLayout>
);

export default InstallPage;
