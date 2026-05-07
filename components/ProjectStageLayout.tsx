
import React, { useState, useEffect } from 'react';
import { useNavigation } from '../contexts/NavigationContext';
import { projectService, firestoreService } from '../lib/firebaseService';
import { cn, getStagePageId } from '../lib/utils';
import { ArrowLeftIcon, MapPinIcon, BriefcaseIcon, ArrowRightIcon, CheckCircleIcon, CalendarIcon } from './icons';
import Button from './Button';
import FollowUpModal from './FollowUpModal';

interface ProjectStageLayoutProps {
    stageLabel: string;
    stagePageId: string;           // e.g. 'E-30' — used in back-link context
    children: (project: any) => React.ReactNode;
    headerActions?: (project: any) => React.ReactNode;
}

// ─── Full ordered pipeline ──────────────────────────────────────────────────
const PIPELINE: { stage: string; pageId: string; short: string }[] = [
    { stage: 'Lead',            pageId: 'E-26', short: 'Lead' },
    { stage: 'Estimate',        pageId: 'E-27', short: 'Est.' },
    { stage: 'Quote',           pageId: 'E-28', short: 'Quote' },
    { stage: 'Sign & Verify',   pageId: 'E-29', short: 'Sign' },
    { stage: 'Schedule',        pageId: 'E-30', short: 'Sched.' },
    { stage: 'Pre-Installation',pageId: 'E-31', short: 'Pre-Install' },
    { stage: 'Install',         pageId: 'E-32', short: 'Install' },
    { stage: 'Punch List',      pageId: 'E-33', short: 'Punch' },
    { stage: 'Invoicing',       pageId: 'E-34', short: 'Invoice' },
    { stage: 'Completed',       pageId: 'E-36', short: 'Done' },
];

function matchStageIndex(currentStage: string = ''): number {
    const s = currentStage.toLowerCase().trim();
    if (s.includes('lead'))        return 0;
    if (s.includes('estimate'))    return 1;
    if (s.includes('quote'))       return 2;
    if (s.includes('sign'))        return 3;
    if (s.includes('schedule'))    return 4;
    if (s.includes('pre-install')) return 5;
    if (s.includes('install'))     return 6;
    if (s.includes('punch'))       return 7;
    if (s.includes('invoic'))      return 8;
    if (s.includes('complet') || s.includes('past')) return 9;
    return -1;
}

const STAGE_COLORS: Record<string, string> = {
    lead:         'border-yellow-500/60 text-yellow-400 bg-yellow-500/10',
    estimate:     'border-blue-500/60 text-blue-400 bg-blue-500/10',
    quote:        'border-indigo-500/60 text-indigo-400 bg-indigo-500/10',
    sign:         'border-purple-500/60 text-purple-400 bg-purple-500/10',
    schedule:     'border-cyan-500/60 text-cyan-400 bg-cyan-500/10',
    'pre-install':'border-sky-500/60 text-sky-400 bg-sky-500/10',
    install:      'border-orange-500/60 text-orange-400 bg-orange-500/10',
    punch:        'border-amber-500/60 text-amber-400 bg-amber-500/10',
    invoic:       'border-green-500/60 text-green-400 bg-green-500/10',
    complet:      'border-emerald-500/60 text-emerald-400 bg-emerald-500/10',
    past:         'border-teal-500/60 text-teal-400 bg-teal-500/10',
};

export function getStageBadgeClass(stage: string = ''): string {
    const s = stage.toLowerCase();
    for (const [key, cls] of Object.entries(STAGE_COLORS)) {
        if (s.includes(key)) return cls;
    }
    return 'border-gray-700 text-gray-400 bg-gray-800';
}

export const ProjectStageLayout: React.FC<ProjectStageLayoutProps> = ({
    stageLabel,
    stagePageId,
    children,
    headerActions,
}) => {
    const { selectedProjectId, setSelectedProjectId, setActivePageId } = useNavigation();
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [advancing, setAdvancing] = useState(false);
    const [showFollowUp, setShowFollowUp] = useState(false);

    useEffect(() => {
        const unsub = projectService.subscribe((data: any[]) => {
            setProjects(data);
            setLoading(false);
        });
        return () => unsub();
    }, []);

    // ── If came from pipeline with a project, show that project record ──
    if (selectedProjectId) {
        const project = projects.find((p) => p.id === selectedProjectId);

        const handleBack = () => {
            setSelectedProjectId(null);
            setActivePageId('E-05'); // Back to pipeline kanban
        };

        const getAddress = (p: any) => {
            if (p?.property?.address) {
                return [p.property.address, p.property.city, p.property.state].filter(Boolean).join(', ');
            }
            return p?.property_address || 'Address not specified';
        };

        // ── Advance to next pipeline stage ──────────────────────────────
        const handleAdvanceStage = async () => {
            if (!project || advancing) return;
            const currentIdx = matchStageIndex(project.current_stage);
            if (currentIdx < 0 || currentIdx >= PIPELINE.length - 1) return;

            const next = PIPELINE[currentIdx + 1];
            setAdvancing(true);

            try {
                // Try updating in 'projects' collection first
                const projUpdate = await firestoreService.updateDocument('projects', project.id, {
                    current_stage: next.stage,
                    updated_at: new Date().toISOString(),
                });

                // If not found in projects, try leads collection
                if (!projUpdate.success) {
                    await firestoreService.updateDocument('leads', project.id, {
                        current_stage: next.stage,
                        updated_at: new Date().toISOString(),
                    });
                }

                // Navigate to next stage page (keep selectedProjectId intact)
                setActivePageId(next.pageId);
            } catch (err) {
                console.error('Stage advance error:', err);
            } finally {
                setAdvancing(false);
            }
        };

        if (loading) {
            return (
                <div className="p-10 space-y-4 animate-pulse">
                    <div className="h-8 bg-gray-800 rounded-lg w-1/3" />
                    <div className="h-4 bg-gray-800 rounded w-1/4" />
                    <div className="h-48 bg-gray-900 rounded-xl border border-gray-800 mt-6" />
                </div>
            );
        }

        if (!project) {
            return (
                <div className="p-10 flex flex-col items-center justify-center min-h-[50vh] text-center">
                    <BriefcaseIcon className="w-16 h-16 text-gray-700 mb-4" />
                    <p className="text-gray-400 font-bold text-lg">Project record not found</p>
                    <p className="text-gray-600 text-sm mt-1 mb-6">
                        The project may have been deleted or moved.
                    </p>
                    <Button onClick={handleBack}>
                        <ArrowLeftIcon className="w-4 h-4 mr-2" />
                        Back to Pipeline
                    </Button>
                </div>
            );
        }

        const currentIdx = matchStageIndex(project.current_stage);
        const nextStage = currentIdx >= 0 && currentIdx < PIPELINE.length - 1 ? PIPELINE[currentIdx + 1] : null;
        const isCompleted = currentIdx === PIPELINE.length - 1;

        return (
            <div className="h-full flex flex-col overflow-hidden">
                {/* ── Record Header Banner ── */}
                <div className="shrink-0 bg-black/60 backdrop-blur-sm border-b border-gray-800 px-6 py-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 min-w-0 flex-1">
                        <button
                            onClick={handleBack}
                            className="flex-none flex items-center gap-2 text-gray-500 hover:text-rhive-pink transition-colors text-xs font-bold uppercase tracking-widest group"
                        >
                            <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                            Pipeline
                        </button>

                        <div className="h-6 w-px bg-gray-800 flex-none" />

                        <div className="min-w-0">
                            <div className="flex items-center gap-3 flex-wrap">
                                <h1 className="text-lg font-extrabold text-white truncate">
                                    {project.name || 'Unnamed Project'}
                                </h1>
                                <span className={cn(
                                    'flex-none text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded border',
                                    getStageBadgeClass(project.current_stage)
                                )}>
                                    {project.current_stage || stageLabel}
                                </span>
                                {project.project_type && (
                                    <span className="flex-none text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border border-gray-700 text-gray-500 bg-gray-900">
                                        {project.project_type}
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                                <MapPinIcon className="w-3 h-3 flex-none" />
                                <span className="truncate">{getAddress(project)}</span>
                                <span className="text-gray-700 ml-2 font-mono text-[10px]">
                                    ID: {project.id?.slice(-8)}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 flex-none">
                        {headerActions?.(project)}

                        {/* ── Schedule Follow-Up button ── */}
                        <button
                            onClick={() => setShowFollowUp(true)}
                            className="group flex items-center gap-2 px-3 py-2 bg-purple-500/10 border border-purple-500/30 rounded-xl text-purple-400 font-black text-xs uppercase tracking-wider hover:bg-purple-500/20 hover:border-purple-500/60 hover:shadow-[0_0_15px_rgba(168,85,247,0.2)] transition-all duration-300"
                            title="Schedule a follow-up call or visit"
                        >
                            <CalendarIcon className="w-3.5 h-3.5" />
                            Follow-Up
                        </button>

                        {/* ── Advance stage button ── */}
                        {isCompleted ? (
                            <div className="flex items-center gap-2 text-emerald-400 px-4 py-2 border border-emerald-500/30 bg-emerald-500/10 rounded-xl text-xs font-black uppercase tracking-widest">
                                <CheckCircleIcon className="w-4 h-4" />
                                Completed
                            </div>
                        ) : nextStage ? (
                            <button
                                onClick={handleAdvanceStage}
                                disabled={advancing}
                                className="group relative flex items-center gap-2 px-4 py-2 bg-[#ec028b]/10 border border-[#ec028b]/40 rounded-xl text-[#ec028b] font-black text-xs uppercase tracking-wider hover:bg-[#ec028b]/20 hover:border-[#ec028b]/70 hover:shadow-[0_0_20px_rgba(236,2,139,0.2)] transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#ec028b] to-transparent opacity-60" />
                                {advancing ? (
                                    <div className="w-3.5 h-3.5 border-2 border-[#ec028b] border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <ArrowRightIcon className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                                )}
                                {advancing ? 'Advancing…' : `Advance to ${nextStage.short}`}
                            </button>
                        ) : null}
                    </div>
                </div>

                {/* ── Pipeline Progress Bar ── */}
                <div className="shrink-0 bg-black/40 border-b border-gray-800/50 px-6 py-2 overflow-x-auto scrollbar-hide">
                    <div className="flex items-center gap-0 min-w-max">
                        {PIPELINE.map((step, idx) => {
                            const isPast = idx < currentIdx;
                            const isCurrent = idx === currentIdx;
                            const isFuture = idx > currentIdx;
                            return (
                                <React.Fragment key={step.stage}>
                                    <div className={cn(
                                        "flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-black uppercase tracking-tighter transition-all",
                                        isPast && "text-emerald-500 opacity-70",
                                        isCurrent && "text-[#ec028b] bg-[#ec028b]/10 border border-[#ec028b]/30",
                                        isFuture && "text-gray-700"
                                    )}>
                                        {isPast && <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />}
                                        {isCurrent && <span className="w-2 h-2 rounded-full bg-[#ec028b] shadow-[0_0_6px_#ec028b] shrink-0 animate-pulse" />}
                                        {isFuture && <span className="w-2 h-2 rounded-full bg-gray-800 shrink-0" />}
                                        {step.short}
                                    </div>
                                    {idx < PIPELINE.length - 1 && (
                                        <div className={cn(
                                            "w-4 h-px mx-0.5 shrink-0",
                                            idx < currentIdx ? "bg-emerald-500/40" : "bg-gray-800"
                                        )} />
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </div>
                </div>

                {/* ── Stage Content ── */}
                <div className="flex-1 overflow-y-auto">
                    {children(project)}
                </div>

                {/* ── Follow-Up Modal ── */}
                {showFollowUp && (
                    <FollowUpModal
                        project={project}
                        onClose={() => setShowFollowUp(false)}
                    />
                )}
            </div>
        );
    }

    // ── No project selected: show a list of all projects for this stage ──
    const stageLower = stageLabel.toLowerCase();
    const stageProjects = projects.filter((p) => {
        const cs = (p.current_stage || '').toLowerCase().trim();
        return cs.includes(stageLower.split(' ')[0]) || cs.startsWith(stageLower.split('-')[0]);
    });

    const getAddress = (p: any) => {
        if (p?.property?.address) {
            return [p.property.address, p.property.city, p.property.state].filter(Boolean).join(', ');
        }
        return p?.property_address || '';
    };

    return (
        <div className="p-8 h-full overflow-y-auto">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-extrabold text-white uppercase tracking-tight">
                        {stageLabel} Records
                    </h1>
                    <p className="text-gray-500 text-xs mt-1 uppercase tracking-widest font-bold">
                        Click a record to open its detail view
                    </p>
                </div>
                <div className={cn(
                    'flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest',
                    loading ? 'text-yellow-400 animate-pulse' : 'text-green-400'
                )}>
                    <span className={cn('w-2 h-2 rounded-full', loading ? 'bg-yellow-400' : 'bg-green-400 shadow-[0_0_8px_#4ade80]')} />
                    {loading ? 'Syncing…' : 'Live'}
                </div>
            </div>

            {loading ? (
                <div className="space-y-4 animate-pulse">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-20 bg-gray-900 border border-gray-800 rounded-xl" />
                    ))}
                </div>
            ) : stageProjects.length === 0 ? (
                <div className="flex flex-col items-center justify-center border border-dashed border-gray-800 rounded-xl p-20 bg-gray-900/20 text-center">
                    <BriefcaseIcon className="w-16 h-16 text-gray-700 mb-4 opacity-30" />
                    <p className="text-gray-500 font-bold text-lg">No projects in {stageLabel}</p>
                    <p className="text-gray-700 text-sm mt-2">
                        Records will appear here when they reach this pipeline stage.
                    </p>
                    <Button
                        className="mt-6"
                        onClick={() => setActivePageId('E-05')}
                    >
                        <ArrowLeftIcon className="w-4 h-4 mr-2" />
                        Back to Pipeline
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {stageProjects.map(p => (
                        <div
                            key={p.id}
                            onClick={() => {
                                setSelectedProjectId(p.id);
                                setActivePageId(stagePageId);
                            }}
                            className="group cursor-pointer bg-gray-900/50 border border-gray-800 hover:border-rhive-pink/60 hover:shadow-[0_0_20px_rgba(236,2,139,0.08)] rounded-xl p-5 transition-all duration-300 flex items-center justify-between gap-4"
                        >
                            <div className="min-w-0">
                                <h3 className="text-white font-bold truncate group-hover:text-rhive-pink transition-colors">
                                    {p.name || 'Unnamed Project'}
                                </h3>
                                {getAddress(p) && (
                                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                                        <MapPinIcon className="w-3 h-3 flex-none" />
                                        <span className="truncate">{getAddress(p)}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2 mt-2">
                                    <span className={cn(
                                        'text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded border',
                                        getStageBadgeClass(p.current_stage)
                                    )}>
                                        {p.current_stage}
                                    </span>
                                    {p.project_type && (
                                        <span className="text-[9px] text-gray-600 font-bold uppercase tracking-wider">
                                            {p.project_type}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="flex-none w-8 h-8 rounded-full border border-gray-700 group-hover:bg-rhive-pink group-hover:border-rhive-pink flex items-center justify-center text-gray-500 group-hover:text-white transition-all">
                                <ArrowRightIcon className="w-3.5 h-3.5" />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProjectStageLayout;
