
import React, { useState, useEffect } from 'react';
import PageContainer from '../components/PageContainer';
import Card from '../components/Card';
import CollapsibleSection from '../components/CollapsibleSection';
import StatusBadge from '../components/StatusBadge';
import { useNavigation } from '../contexts/NavigationContext';
import { projectService } from '../lib/firebaseService';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { BriefcaseIcon, MapPinIcon, UserIcon, CalculatorIcon, CalendarIcon } from '../components/icons';
import { getStagePageId } from '../lib/utils';
import Button from '../components/Button';
import EmployeePipelinePage from './EmployeePipelinePage';

const ProjectProfilePage: React.FC = () => {
    const { selectedProjectId, setActivePageId, setSelectedContactId, setSelectedPropertyId, setSelectedAccountId } = useNavigation();

    const [project, setProject] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!selectedProjectId) {
            setLoading(false);
            return;
        }

        const unsub = projectService.subscribe((projects) => {
            const found = projects.find(p => p.id === selectedProjectId);
            setProject(found || null);
            setLoading(false);
        });

        return () => unsub();
    }, [selectedProjectId]);

    if (loading) {
        return (
            <PageContainer title="Project" description="Loading record details...">
                <div className="flex justify-center py-20">
                    <div className="w-10 h-10 border-4 border-[#ec028b] border-t-transparent rounded-full animate-spin"></div>
                </div>
            </PageContainer>
        );
    }

    if (!selectedProjectId || !project) {
        return <EmployeePipelinePage hideLeads={true} />;
    }

    const handleOpenStage = () => {
        setActivePageId('E-05'); // Redirect to Sales Pipeline Board
    };

    return (
        <PageContainer 
            title={project.name || 'Unnamed Project'} 
            description={`Project Record • Last Updated: ${project.updated_at ? new Date(project.updated_at).toLocaleDateString() : 'N/A'}`}
        >
            <div className="flex items-center justify-between mb-6">
                <div className="flex gap-3 items-center">
                    <StatusBadge status={project.current_stage || 'lead'} />
                    {project._source === 'deals' && (
                        <span className="text-[10px] uppercase font-bold tracking-widest bg-[#ec028b]/10 border border-[#ec028b]/30 px-3 py-1 rounded text-[#ec028b]">
                            Deal
                        </span>
                    )}
                    <span className="text-[10px] uppercase font-bold tracking-widest bg-gray-900 border border-gray-800 px-3 py-1 rounded text-gray-400">
                        {project.project_type || 'General'}
                    </span>
                    <span className="text-xs text-gray-500 font-mono">
                        ID: {project.id?.slice(-8)}
                    </span>
                </div>
                <Button onClick={handleOpenStage} className="shadow-[0_0_15px_rgba(236,2,139,0.3)]">
                    Open Pipeline Stage View
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <Card title="Core Details">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-gray-900/40 rounded-xl border border-gray-800">
                                <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Status Phase</p>
                                <p className="text-white font-bold">{project.current_stage || 'Initiated'}</p>
                            </div>
                            <div className="p-4 bg-gray-900/40 rounded-xl border border-gray-800 border-l-[#ec028b]">
                                <p className="text-[10px] text-[#ec028b] font-black uppercase tracking-widest mb-1 flex items-center gap-1">
                                    <CalculatorIcon className="w-3 h-3" />
                                    Total Value
                                </p>
                                <p className="text-2xl font-black text-white font-mono tracking-tight">
                                    {project.quote?.total ? `$${project.quote.total.toLocaleString()}` : 'Pending Quote'}
                                </p>
                            </div>
                            <div className="p-4 bg-gray-900/40 rounded-xl border border-gray-800">
                                <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1 flex items-center gap-1">
                                    <CalendarIcon className="w-3 h-3" />
                                    Created Date
                                </p>
                                <p className="text-white font-bold text-sm">
                                    {project.created_at ? new Date(project.created_at).toLocaleDateString() : 'Unknown'}
                                </p>
                            </div>
                            <div className="p-4 bg-gray-900/40 rounded-xl border border-gray-800">
                                <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Source</p>
                                <p className="text-white font-bold text-sm">{project.lead_source || 'Direct Assignment'}</p>
                            </div>
                        </div>
                        
                        <div className="mt-6 pt-4 border-t border-gray-800/50">
                            <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-2">Internal Notes</p>
                            <div className="p-4 bg-black border border-gray-800 rounded-lg text-gray-400 text-sm italic">
                                {project.notes || 'No preliminary notes recorded for this project.'}
                            </div>
                        </div>
                    </Card>

                    <CollapsibleSection title="Associated Property" isOpen={true}>
                        {project.property_id || project.property_address ? (
                            <div 
                                onClick={() => {
                                    if (project.property_id) setSelectedPropertyId(project.property_id);
                                    setActivePageId('E-12');
                                }}
                                className="group p-5 bg-gray-900/40 rounded-xl border border-gray-800 cursor-pointer hover:bg-gray-900/60 hover:border-[#ec028b]/50 transition-all flex items-center gap-4"
                            >
                                <div className="w-12 h-12 bg-black border border-gray-800 rounded flex-none flex items-center justify-center text-gray-500 group-hover:text-[#ec028b] transition-colors">
                                    <MapPinIcon className="w-6 h-6" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-white font-bold text-lg group-hover:text-[#ec028b] transition-colors">
                                        {project.property_address || project.property?.address || 'View Linked Property Details'}
                                    </p>
                                    <p className="text-gray-500 text-xs mt-1">
                                        {project.city || project.property?.city || 'Unknown City'}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="text-gray-500 text-sm italic p-4 text-center">No assigned property found.</div>
                        )}
                    </CollapsibleSection>
                </div>

                <div className="space-y-6">
                    <Card title="Key Personnel">
                        {(project.account_id || project.user_id) && (
                            <div className="mb-6">
                                <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-2">Account Owner</p>
                                <div 
                                    onClick={() => {
                                        if (project.account_id || project.user_id) {
                                            setSelectedAccountId(project.account_id || project.user_id);
                                            setActivePageId('E-08');
                                        }
                                    }}
                                    className="group flex items-center gap-3 p-3 bg-gray-900/30 border border-gray-800 rounded-xl text-gray-300 cursor-pointer hover:border-[#ec028b]/50 hover:bg-gray-900/60 transition-all"
                                >
                                    <UserIcon className="w-5 h-5 text-gray-500 group-hover:text-[#ec028b]" />
                                    <span className="font-bold text-sm truncate group-hover:text-[#ec028b]">{project.account_id || project.user_id}</span>
                                </div>
                            </div>
                        )}

                        <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-2">Service Contacts</p>
                        {(!project.contacts || project.contacts.length === 0) ? (
                            <div className="text-gray-600 text-xs italic text-center py-4">No specific contacts mapped to log.</div>
                        ) : (
                            <ul className="space-y-2">
                                {project.contacts.map((c: any, i: number) => (
                                    <li 
                                        key={i} 
                                        onClick={() => {
                                            if (c.id) {
                                                setSelectedContactId(c.id);
                                                setActivePageId('E-10');
                                            }
                                        }}
                                        className={`flex items-center gap-3 p-3 bg-gray-900/50 border border-gray-800 rounded-lg ${c.id ? 'hover:border-[#ec028b]/40 cursor-pointer group' : ''}`}
                                    >
                                        <div className="w-8 h-8 rounded bg-black flex-none flex items-center justify-center text-xs font-bold text-gray-500 group-hover:text-[#ec028b]">
                                            {(c.name || c.firstName || '?')[0].toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-white text-sm font-bold group-hover:text-[#ec028b]">{c.name || c.firstName || 'Unknown'}</p>
                                            <p className="text-gray-500 text-[9px] uppercase tracking-widest font-bold">
                                                {c.role || 'Stakeholder'} {c.isPrimary ? '(Primary)' : ''}
                                            </p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </Card>
                </div>
            </div>
        </PageContainer>
    );
};

export default ProjectProfilePage;
