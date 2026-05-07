
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigation } from '../contexts/NavigationContext';
import PageContainer from '../components/PageContainer';
import Card from '../components/Card';
import Button from '../components/Button';
import FollowUpModal from '../components/FollowUpModal';
import { 
    BriefcaseIcon, 
    UserIcon, 
    ArrowRightIcon, 
    MapPinIcon, 
    ArrowLeftIcon,
    DocumentTextIcon,
    CalculatorIcon,
    CheckCircleIcon,
    XIcon,
    CalendarIcon
} from '../components/icons';
import { projectService, firestoreService } from '../lib/firebaseService';
import { cn, getStagePageId } from '../lib/utils';

// ─── Conversion Modal ─────────────────────────────────────────────────────────
interface ConvertModalProps {
    project: any;
    onClose: () => void;
    onConvert: (type: 'Estimate' | 'Quote') => Promise<void>;
}

const ConvertModal: React.FC<ConvertModalProps> = ({ project, onClose, onConvert }) => {
    const [converting, setConverting] = useState<null | 'Estimate' | 'Quote'>(null);

    const handleConvert = async (type: 'Estimate' | 'Quote') => {
        setConverting(type);
        await onConvert(type);
        setConverting(null);
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center" onClick={onClose}>
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

            {/* Modal Panel */}
            <div
                className="relative z-10 w-full max-w-lg mx-4 bg-[#0a0a0a] border border-gray-800 rounded-2xl shadow-[0_0_80px_rgba(236,2,139,0.15)] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Top accent line */}
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#ec028b] to-transparent" />

                {/* Header */}
                <div className="flex items-start justify-between p-6 border-b border-gray-800">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#ec028b] mb-1">
                            Lead Conversion
                        </p>
                        <h2 className="text-xl font-black text-white">Convert to Next Stage</h2>
                        <p className="text-sm text-gray-500 mt-1 font-mono truncate max-w-xs">
                            {project.name || 'Unnamed Project'}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-800 text-gray-500 hover:border-gray-600 hover:text-white transition-all"
                    >
                        <XIcon className="w-4 h-4" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-4">
                    <p className="text-gray-400 text-sm">
                        Choose how to convert this lead. The record's pipeline stage will be updated immediately in Firebase and you'll be routed to the corresponding workspace.
                    </p>

                    {/* Option Cards */}
                    <div className="grid grid-cols-2 gap-4 mt-4">
                        {/* Estimate Option */}
                        <button
                            onClick={() => handleConvert('Estimate')}
                            disabled={!!converting}
                            className="group relative flex flex-col items-center gap-3 p-6 bg-gray-900/60 border border-gray-800 rounded-xl hover:border-blue-500/60 hover:bg-blue-900/10 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)] transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none text-left"
                        >
                            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="w-14 h-14 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center group-hover:border-blue-500/50 group-hover:bg-blue-500/20 transition-all">
                                {converting === 'Estimate' ? (
                                    <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <CalculatorIcon className="w-7 h-7 text-blue-400" />
                                )}
                            </div>
                            <div className="text-center">
                                <p className="font-black text-white text-sm uppercase tracking-widest">Estimate</p>
                                <p className="text-gray-500 text-[11px] mt-1 leading-relaxed">
                                    Send to estimation tool for scoping &amp; pricing
                                </p>
                            </div>
                            <div className="mt-1 text-[9px] font-black uppercase tracking-widest text-blue-400 border border-blue-500/30 bg-blue-500/10 px-2 py-0.5 rounded">
                                Stage → Estimate
                            </div>
                        </button>

                        {/* Quote Option */}
                        <button
                            onClick={() => handleConvert('Quote')}
                            disabled={!!converting}
                            className="group relative flex flex-col items-center gap-3 p-6 bg-gray-900/60 border border-gray-800 rounded-xl hover:border-[#ec028b]/60 hover:bg-[#ec028b]/5 hover:shadow-[0_0_30px_rgba(236,2,139,0.1)] transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none text-left"
                        >
                            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#ec028b] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="w-14 h-14 rounded-xl bg-[#ec028b]/10 border border-[#ec028b]/20 flex items-center justify-center group-hover:border-[#ec028b]/50 group-hover:bg-[#ec028b]/20 transition-all">
                                {converting === 'Quote' ? (
                                    <div className="w-6 h-6 border-2 border-[#ec028b] border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <DocumentTextIcon className="w-7 h-7 text-[#ec028b]" />
                                )}
                            </div>
                            <div className="text-center">
                                <p className="font-black text-white text-sm uppercase tracking-widest">Quote</p>
                                <p className="text-gray-500 text-[11px] mt-1 leading-relaxed">
                                    Convert directly to a certified quote for signing
                                </p>
                            </div>
                            <div className="mt-1 text-[9px] font-black uppercase tracking-widest text-[#ec028b] border border-[#ec028b]/30 bg-[#ec028b]/10 px-2 py-0.5 rounded">
                                Stage → Quote
                            </div>
                        </button>
                    </div>

                    {/* Info row */}
                    <div className="flex items-start gap-3 p-4 bg-gray-900/40 border border-gray-800/50 rounded-xl mt-2">
                        <CheckCircleIcon className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
                        <p className="text-[11px] text-gray-500 leading-relaxed">
                            Conversion updates the pipeline stage in Firebase and moves the record into the active projects workflow. This action can be revisited from the pipeline board.
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end px-6 pb-5">
                    <button
                        onClick={onClose}
                        className="text-xs font-bold uppercase tracking-widest text-gray-600 hover:text-gray-400 transition-colors"
                    >
                        Cancel — Keep as Lead
                    </button>
                </div>
            </div>
        </div>
    );
};

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

const LeadPage: React.FC = () => {
    const { 
        selectedProjectId, 
        setSelectedProjectId, 
        setActivePageId, 
        setSelectedAccountId 
    } = useNavigation();
    
    // Check if we arrived here WITH a selected project.
    // If we did, and it is a "Lead" stage, we should show the Lead detail page.
    // If no project is selected, show the master List of Leads.
    const [mode, setMode] = useState<'list' | 'detail'>(selectedProjectId ? 'detail' : 'list');
    const [showConvertModal, setShowConvertModal] = useState(false);
    const [showFollowUp, setShowFollowUp] = useState(false);
    
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = projectService.subscribe((data: any[]) => {
            setProjects(data);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    // Sync mode with global states
    useEffect(() => {
        if (selectedProjectId) setMode('detail');
        else setMode('list');
    }, [selectedProjectId]);

    const handleClearProject = () => {
        setSelectedProjectId(null);
        setMode('list');
    };

    const handleProjectClick = (projectId: string, stage: string) => {
        setSelectedProjectId(projectId);
        
        const targetPage = getStagePageId(stage);
        
        // If it belongs in E-26, just switch to detail mode here
        if (targetPage === 'E-26') {
            setMode('detail');
        } else {
            // Navigate to the correct page for this specific pipeline stage
            setActivePageId(targetPage);
        }
    };

    const handleViewAccount = (userId: string) => {
        if (!userId || userId === 'unassigned') return;
        setSelectedAccountId(userId);
        setActivePageId('E-08');
    };

    /**
     * Convert a lead record to Estimate or Quote.
     * 1. Tries to update in 'leads' collection first (where new intakes live).
     * 2. Falls back to 'projects' collection.
     * 3. If the record was in 'leads', copies it to 'projects' with the new stage
     *    so it becomes part of the active pipeline.
     * 4. Navigates to the correct pipeline stage page.
     */
    const handleConvertLead = async (type: 'Estimate' | 'Quote') => {
        if (!selectedProjectId) return;
        const newStage = type; // 'Estimate' | 'Quote'
        const targetPageId = type === 'Estimate' ? 'E-27' : 'E-28';

        // Find the project data from local state
        const project = projects.find(p => p.id === selectedProjectId);

        try {
            // Try updating in 'leads' collection first
            const leadUpdate = await firestoreService.updateDocument('leads', selectedProjectId, {
                current_stage: newStage,
                status: 'Active',
                converted_at: new Date().toISOString(),
                converted_to: type,
            });

            if (leadUpdate.success) {
                // Also copy (promote) the record to 'projects' collection so
                // it shows up in the active pipeline
                if (project) {
                    const { id: _id, ...projectWithoutId } = project;
                    await firestoreService.addDocument('projects', {
                        ...projectWithoutId,
                        current_stage: newStage,
                        status: 'Active',
                        original_lead_id: selectedProjectId,
                        converted_at: new Date().toISOString(),
                    });
                }
            } else {
                // Wasn't in leads collection — update directly in projects
                await firestoreService.updateDocument('projects', selectedProjectId, {
                    current_stage: newStage,
                    status: 'Active',
                    converted_at: new Date().toISOString(),
                    converted_to: type,
                });
            }
        } catch (err) {
            console.error('Conversion error:', err);
        }

        setShowConvertModal(false);
        setActivePageId(targetPageId);
    };

    // --- LIST VIEW LOGIC ---

    /**
     * Group leads by ASSIGNED EMPLOYEE / SALES REP.
     * Priority of fields: assigned_to > rep_id > assigned_employee > employee_id
     * Display name priority: assigned_name > rep_name > assigned_employee_name > assigneeId
     * "unassigned" group is always pushed to the end.
     */
    const groupedProjects = useMemo(() => {
        const map = new Map<string, { assigneeId: string; assigneeName: string; projects: any[] }>();

        // Filter only lead-stage records
        const leadsOnly = projects.filter(p => {
            const cs = (p.current_stage || '').toLowerCase().trim();
            return cs === 'lead' || cs.includes('stage 1');
        });

        leadsOnly.forEach(p => {
            // Resolve the assigned employee key
            const assigneeId: string =
                p.assigned_to ||
                p.rep_id ||
                p.assigned_employee ||
                p.employee_id ||
                'unassigned';

            // Resolve a human-readable display name for the employee
            const assigneeName: string =
                p.assigned_name ||
                p.rep_name ||
                p.assigned_employee_name ||
                (assigneeId !== 'unassigned' ? assigneeId : 'Unassigned');

            if (!map.has(assigneeId)) {
                map.set(assigneeId, { assigneeId, assigneeName, projects: [] });
            }
            map.get(assigneeId)!.projects.push(p);
        });

        // Sort projects within each group newest-first
        const groups = Array.from(map.values()).map(g => ({
            ...g,
            projects: g.projects.sort((a, b) => {
                const dateA = new Date(a.updated_at || a.created_at || 0).getTime();
                const dateB = new Date(b.updated_at || b.created_at || 0).getTime();
                return dateB - dateA;
            }),
        }));

        // Assigned groups first, unassigned at bottom
        return [
            ...groups.filter(g => g.assigneeId !== 'unassigned'),
            ...groups.filter(g => g.assigneeId === 'unassigned'),
        ];
    }, [projects]);


    // --- RENDER DETAIL (LEAD STAGE) ---
    if (mode === 'detail' && selectedProjectId) {
        const currentProject = projects.find(p => p.id === selectedProjectId);

        // If the project has already been converted away from Lead, auto-redirect
        // to the correct stage page so it cannot be re-edited here.
        if (!loading && currentProject) {
            const cs = (currentProject.current_stage || '').toLowerCase().trim();
            const isStillLead = cs === 'lead' || cs.includes('stage 1') || cs === '';
            if (!isStillLead) {
                const targetPageId = getStagePageId(currentProject.current_stage);
                // Navigate to the actual stage page (not lead)
                setActivePageId(targetPageId);
                return null;
            }
        }


        return (
            <PageContainer 
                title="Lead Stage Processing" 
                description="Qualify and dispatch actions for this initial stage."
                headerAction={
                    <Button variant="secondary" onClick={handleClearProject}>
                        <ArrowLeftIcon className="w-4 h-4 mr-2" />
                        Back to Leads List
                    </Button>
                }
            >
                {loading ? (
                    <div className="h-64 bg-gray-900 animate-pulse rounded-xl border border-gray-800" />
                ) : !currentProject ? (
                    <div className="text-center p-20 bg-gray-900 border border-gray-800 rounded-xl">
                        <p className="text-gray-400">Project data could not be found or loaded.</p>
                        <Button className="mt-4" onClick={handleClearProject}>
                            <ArrowLeftIcon className="w-4 h-4 mr-2" />
                            Return
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-6 max-w-5xl mx-auto">
                        <div className="flex flex-col md:flex-row gap-6">
                            <Card className="flex-1" title="Lead Information">
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Project Name</p>
                                        <h2 className="text-2xl font-bold text-white transition-colors">
                                            {currentProject.name || 'Unnamed Project'}
                                        </h2>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-800">
                                            <p className="text-[10px] text-gray-500 uppercase font-bold">Property Address</p>
                                            <p className="text-sm text-gray-300 mt-1">
                                                {currentProject.property_address || currentProject.property?.address || 'Not Provided'}
                                            </p>
                                        </div>
                                        <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-800">
                                            <p className="text-[10px] text-gray-500 uppercase font-bold">Project Type</p>
                                            <p className="text-sm text-white font-bold mt-1 uppercase tracking-wider">
                                                {currentProject.project_type || 'Unknown'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-4 border-t border-gray-800 pt-4">
                                        <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-2">Stage Status</p>
                                        <span className={cn(
                                            'text-xs px-3 py-1.5 rounded-full border font-black uppercase tracking-wider',
                                            stageBadgeColor(currentProject.current_stage)
                                        )}>
                                            {currentProject.current_stage || 'Unknown'}
                                        </span>
                                    </div>
                                </div>
                            </Card>

                            <Card className="w-full md:w-80 shrink-0" title="Next Steps">
                                <p className="text-sm text-gray-400 mb-5">
                                    This record is currently in the Intake (Lead) stage. Push it forward by converting to an Estimate or Quote.
                                </p>
                                <div className="space-y-3">
                                    {/* PRIMARY: Convert Lead */}
                                    <button
                                        onClick={() => setShowConvertModal(true)}
                                        className="group relative w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#ec028b]/10 border border-[#ec028b]/40 rounded-xl text-[#ec028b] font-black text-sm uppercase tracking-wider hover:bg-[#ec028b]/20 hover:border-[#ec028b]/70 hover:shadow-[0_0_25px_rgba(236,2,139,0.25)] transition-all duration-300 overflow-hidden"
                                    >
                                        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#ec028b] to-transparent opacity-60"/>
                                        <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                        Convert Lead
                                    </button>

                                    {/* Divider */}
                                    <div className="flex items-center gap-2 py-1">
                                        <div className="flex-1 h-px bg-gray-800" />
                                        <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">or</span>
                                        <div className="flex-1 h-px bg-gray-800" />
                                    </div>

                                    <Button 
                                        className="w-full justify-center" 
                                        variant="secondary"
                                        onClick={() => setActivePageId('E-27')}
                                    >
                                        <CalculatorIcon className="w-5 h-5 mr-2" />
                                        Launch Estimator
                                    </Button>
                                    <Button 
                                        variant="secondary" 
                                        className="w-full justify-center"
                                        onClick={() => handleViewAccount(currentProject.user_id || currentProject.account_id)}
                                    >
                                        <UserIcon className="w-5 h-5 mr-2" />
                                        View Account
                                    </Button>

                                    {/* ── Schedule Follow-Up ── */}
                                    <button
                                        onClick={() => setShowFollowUp(true)}
                                        className="group relative w-full flex items-center justify-center gap-2 px-4 py-3 bg-purple-500/10 border border-purple-500/30 rounded-xl text-purple-400 font-black text-sm uppercase tracking-wider hover:bg-purple-500/20 hover:border-purple-500/60 hover:shadow-[0_0_20px_rgba(168,85,247,0.2)] transition-all duration-300 overflow-hidden"
                                    >
                                        <CalendarIcon className="w-4 h-4" />
                                        Schedule Follow-Up
                                    </button>
                                </div>
                            </Card>
                        </div>
                    </div>
                )}

                {/* Conversion Modal */}
                {showConvertModal && currentProject && (
                    <ConvertModal
                        project={currentProject}
                        onClose={() => setShowConvertModal(false)}
                        onConvert={handleConvertLead}
                    />
                )}

                {/* Follow-Up Modal */}
                {showFollowUp && currentProject && (
                    <FollowUpModal
                        project={currentProject}
                        onClose={() => setShowFollowUp(false)}
                    />
                )}
            </PageContainer>
        );
    }

    // --- RENDER LIST ---
    return (
        <PageContainer 
            title="Stage 1 — Leads"
            description="All intake leads grouped by assigned employee or sales rep. Unassigned leads appear at the bottom."
            headerAction={
                <div className={cn(
                    "flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest",
                    loading ? "text-yellow-400 animate-pulse" : "text-green-400"
                )}>
                    <span className={cn("w-1.5 h-1.5 rounded-full", loading ? "bg-yellow-400" : "bg-green-400 shadow-[0_0_8px_#4ade80]")} />
                    {loading ? 'Syncing…' : 'Live'}
                </div>
            }
        >
            <div className="space-y-8">
                {loading ? (
                    <div className="space-y-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-40 bg-gray-900 border border-gray-800 rounded-xl animate-pulse" />
                        ))}
                    </div>
                ) : groupedProjects.length === 0 ? (
                    <div className="text-center p-20 border border-dashed border-gray-800 rounded-xl bg-gray-900/20">
                        <BriefcaseIcon className="w-16 h-16 mx-auto mb-4 text-gray-700 opacity-50" />
                        <h3 className="text-xl font-bold text-gray-400">No projects found</h3>
                        <p className="text-gray-600 mt-2">Projects registered from Customer Input will appear grouped here.</p>
                    </div>
                ) : (
                    groupedProjects.map(group => {
                        const isUnassigned = group.assigneeId === 'unassigned';
                        return (
                        <div key={group.assigneeId} className="mb-8">
                            {/* Assignee Header */}
                            <div className="flex items-center gap-3 mb-4">
                                <div className={cn(
                                    "w-10 h-10 rounded-full border flex items-center justify-center shadow-lg shrink-0",
                                    isUnassigned
                                        ? "bg-gray-900 border-yellow-500/20 text-yellow-500/60 shadow-yellow-900/20"
                                        : "bg-gray-900 border-[#ec028b]/30 text-[#ec028b] shadow-[0_0_15px_rgba(236,2,139,0.1)]"
                                )}>
                                    <UserIcon className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h2 className="text-lg font-bold text-white tracking-wide">
                                            {isUnassigned ? 'Unassigned' : group.assigneeName}
                                        </h2>
                                        {isUnassigned ? (
                                            <span className="text-[9px] font-black uppercase tracking-widest border border-yellow-500/30 bg-yellow-500/10 text-yellow-500 px-2 py-0.5 rounded">
                                                Needs Assignment
                                            </span>
                                        ) : (
                                            <span className="text-[9px] font-black uppercase tracking-widest border border-[#ec028b]/30 bg-[#ec028b]/10 text-[#ec028b] px-2 py-0.5 rounded">
                                                Sales Rep
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-500 font-mono mt-0.5">
                                        {isUnassigned ? 'No rep assigned' : `ID: ${group.assigneeId}`}
                                        {' '}&bull;{' '}
                                        {group.projects.length} Lead{group.projects.length !== 1 ? 's' : ''}
                                    </p>
                                </div>
                            </div>
                            
                            {/* Project Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {group.projects.map(project => (
                                    <Card 
                                        key={project.id} 
                                        onClick={() => handleProjectClick(project.id, project.current_stage || 'lead')}
                                        className="cursor-pointer hover:border-[#ec028b] hover:shadow-[0_0_20px_rgba(236,2,139,0.1)] transition-all group p-5 bg-gray-900/40"
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="min-w-0 pr-4">
                                                <h3 className="text-white font-bold text-lg truncate group-hover:text-[#ec028b] transition-colors">
                                                    {project.name || 'Unnamed Project'}
                                                </h3>
                                                <div className="flex items-center text-xs text-gray-500 mt-1">
                                                    <MapPinIcon className="w-3 h-3 mr-1 shrink-0" />
                                                    <span className="truncate">
                                                        {project.property_address || project.property?.address || 'Location Unknown'}
                                                    </span>
                                                </div>
                                            </div>
                                            
                                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-black border border-gray-700 flex items-center justify-center group-hover:bg-[#ec028b] group-hover:border-[#ec028b] group-hover:text-white transition-all text-gray-500">
                                                <ArrowRightIcon className="w-4 h-4" />
                                            </div>
                                        </div>
                                        
                                        <div className="mt-4 flex items-center justify-between border-t border-gray-800 pt-3">
                                            <span className={cn(
                                                'text-[10px] px-2 py-1 rounded border font-black uppercase tracking-wider',
                                                stageBadgeColor(project.current_stage)
                                            )}>
                                                {project.current_stage || 'Lead'}
                                            </span>
                                            
                                            <span className="text-[10px] text-gray-600 font-mono">
                                                {project.updated_at ? new Date(project.updated_at).toLocaleDateString() : 'New'}
                                            </span>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>
                        );
                    })
                )}
            </div>
        </PageContainer>
    );
};

export default LeadPage;