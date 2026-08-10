
import React, { useState, useEffect } from 'react';
import { useNavigation } from '../contexts/NavigationContext';
import { CircuitryBackground } from '../components/CircuitryBackground';
import { BriefcaseIcon, MapPinIcon } from '../components/icons';
import { cn, getStagePageId } from '../lib/utils';
import Card from '../components/Card';
import { projectService } from '../lib/firebaseService';

// The 10-stage pipeline columns
const PIPELINE_STAGES = [
    { label: 'Lead',         match: ['Lead', 'lead'] },
    { label: 'Estimate',     match: ['Estimate', 'estimate'] },
    { label: 'Quote',        match: ['Quote', 'quote'] },
    { label: 'Sign',         match: ['Sign & Verify', 'Sign', 'sign'] },
    { label: 'Schedule',     match: ['Schedule', 'schedule'] },
    { label: 'Pre-Install',  match: ['Pre-Installation', 'Pre-Install', 'pre-install'] },
    { label: 'Install',      match: ['Install', 'install'] },
    { label: 'Punch-list',   match: ['Punch List', 'Punch-list', 'punch-list'] },
    { label: 'Invoicing',    match: ['Invoicing', 'invoicing'] },
    { label: 'Completed',    match: ['Completed', 'completed', 'Past Customer'] },
];

interface FirebaseProject {
    id: string;
    name?: string;
    current_stage?: string;
    project_type?: string;
    property_address?: string;
    property?: { address?: string; city?: string; state?: string };
    details?: { scopeType?: string };
    quote?: { total?: number };
    created_at?: string;
    updated_at?: string;
    [key: string]: any;
}

interface EmployeePipelinePageProps {
    hideLeads?: boolean;
}

const EmployeePipelinePage: React.FC<EmployeePipelinePageProps> = ({ hideLeads = false }) => {
    const { setActivePageId, setSelectedProjectId } = useNavigation();
    const [projects, setProjects] = useState<FirebaseProject[]>([]);
    const [loading, setLoading] = useState(true);

    // Subscribe to Firebase real-time project updates
    useEffect(() => {
        const unsubscribe = projectService.subscribe((data: any[]) => {
            setProjects(data as FirebaseProject[]);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleCardClick = (project: FirebaseProject) => {
        setSelectedProjectId(project.id);
        setActivePageId(getStagePageId(project.current_stage));
    };

    const getProjectsForStage = (stage: typeof PIPELINE_STAGES[number]) => {
        return projects.filter(p => {
            const cs = (p.current_stage || p.status || '').toLowerCase().trim();
            return stage.match.some(m => m.toLowerCase() === cs);
        });
    };

    const getAddress = (p: FirebaseProject): string => {
        if (p.property?.address) {
            const parts = [p.property.address, p.property.city, p.property.state].filter(Boolean);
            return parts.join(', ');
        }
        return p.property_address || 'Address not set';
    };

    const getQuoteTotal = (p: FirebaseProject): string | null => {
        const total = p.quote?.total;
        if (total && total > 0) return `$${total.toLocaleString()}`;
        return null;
    };

    return (
        <div className="relative h-screen w-full bg-black overflow-hidden flex flex-col">
            <CircuitryBackground />

            <header className="relative z-20 p-6 border-b border-gray-800 bg-black/60 backdrop-blur-md flex justify-between items-center shrink-0">
                <div>
                    <h1 className="text-2xl font-extrabold text-white tracking-tight uppercase">Sales Pipeline Board</h1>
                    <p className="text-gray-400 text-xs mt-1">10-Stage Project Lifecycle — Live from Firebase</p>
                </div>
                <div className="flex gap-6 items-center">
                    {loading && (
                        <div className="flex items-center gap-2 text-yellow-400 text-xs font-bold uppercase tracking-widest animate-pulse">
                            <span className="w-2 h-2 rounded-full bg-yellow-400" />
                            Syncing…
                        </div>
                    )}
                    {!loading && (
                        <div className="flex items-center gap-2 text-green-400 text-xs font-bold uppercase tracking-widest">
                            <span className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_8px_#4ade80]" />
                            Live
                        </div>
                    )}
                    <div className="text-right">
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Total Projects</p>
                        <p className="text-xl font-bold text-[#ec028b] leading-none">{projects.length}</p>
                    </div>
                </div>
            </header>

            <main className="relative z-20 flex-1 flex overflow-x-auto overflow-y-hidden p-6 gap-6 scrollbar-hide">
                {PIPELINE_STAGES.filter(stage => !hideLeads || stage.label !== 'Lead').map((stage) => {
                    const stageProjects = getProjectsForStage(stage);
                    return (
                        <div key={stage.label} className="flex-none w-72 flex flex-col h-full">
                            {/* Column header */}
                            <div className="flex items-center justify-between mb-4 px-2">
                                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center">
                                    <span className="w-2 h-2 rounded-full bg-[#ec028b] mr-2 shadow-[0_0_8px_#ec028b]" />
                                    {stage.label}
                                </h3>
                                <span className="bg-gray-900 border border-gray-700 text-gray-400 text-[10px] px-2 py-0.5 rounded-full font-mono">
                                    {stageProjects.length}
                                </span>
                            </div>

                            {/* Cards */}
                            <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-hide pb-10">
                                {stageProjects.map((project) => (
                                    <Card
                                        key={project.id}
                                        className="mb-4 cursor-pointer hover:border-[#ec028b]/80 group relative overflow-hidden active:scale-95 transition-transform"
                                    >
                                        <div onClick={() => handleCardClick(project)}>
                                            {/* Glow effect */}
                                            <div className="absolute top-0 right-0 w-16 h-16 bg-[#ec028b]/5 blur-2xl group-hover:bg-[#ec028b]/10 transition-colors pointer-events-none" />

                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="text-white font-bold text-sm truncate group-hover:text-[#ec028b] transition-colors pr-2">
                                                    {project.name || 'Unnamed Project'}
                                                </h4>
                                                <BriefcaseIcon className="w-3 h-3 text-gray-600 group-hover:text-[#ec028b] shrink-0" />
                                            </div>

                                            <div className="flex items-center text-[10px] text-gray-500 mb-3">
                                                <MapPinIcon className="w-2.5 h-2.5 mr-1 shrink-0" />
                                                <span className="truncate">{getAddress(project)}</span>
                                            </div>

                                            {project.project_type && (
                                                <div className="mb-3">
                                                    <span className="text-[9px] bg-gray-900 border border-gray-800 px-2 py-0.5 rounded font-black uppercase tracking-tighter text-gray-500">
                                                        {project.project_type}
                                                    </span>
                                                </div>
                                            )}

                                            <div className="flex items-end justify-between">
                                                <div className="font-mono text-xs font-bold text-[#ec028b] shadow-sm">
                                                    {getQuoteTotal(project) ?? '$—'}
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                ))}

                                {stageProjects.length === 0 && !loading && (
                                    <div className="border border-dashed border-gray-800 rounded-xl p-8 text-center bg-black/20">
                                        <p className="text-[10px] text-gray-600 uppercase font-bold tracking-widest italic">Clear</p>
                                    </div>
                                )}

                                {loading && stageProjects.length === 0 && (
                                    <div className="space-y-3 animate-pulse">
                                        {[0, 1].map(i => (
                                            <div key={i} className="h-24 bg-gray-900 border border-gray-800 rounded-xl" />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </main>
        </div>
    );
};

export default EmployeePipelinePage;
