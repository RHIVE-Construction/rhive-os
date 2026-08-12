
import React, { useState, useEffect } from 'react';
import PageContainer from '../components/PageContainer';
import Card from '../components/Card';
import Button from '../components/Button';
import { BriefcaseIcon, MapPinIcon } from '../components/icons';
import { useNavigation } from '../contexts/NavigationContext';
import { projectService } from '../lib/firebaseService';
import { cn } from '../lib/utils';

const stageBadgeColor = (stage?: string) => {
    const s = (stage || '').toLowerCase();
    if (s.includes('lead')) return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
    if (s.includes('estimate')) return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
    if (s.includes('quote')) return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';
    if (s.includes('sign')) return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
    if (s.includes('schedule') || s.includes('pre-install')) return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
    if (s.includes('install')) return 'bg-orange-500/10 text-orange-400 border-orange-500/30';
    if (s.includes('invoic')) return 'bg-green-500/10 text-green-400 border-green-500/30';
    if (s.includes('complet') || s.includes('past')) return 'bg-gray-500/10 text-gray-300 border-gray-600/30';
    return 'bg-gray-800 text-gray-400 border-gray-700';
};

const PropertyProjectsPage: React.FC = () => {
    const { selectedPropertyId, setActivePageId, setSelectedProjectId } = useNavigation();
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = projectService.subscribe((data: any[]) => {
            // If a property is selected, filter; otherwise show all projects
            const filtered = selectedPropertyId
                ? data.filter(p => p.property_id === selectedPropertyId)
                : data;
            setProjects(filtered);
            setLoading(false);
        });
        return () => unsubscribe();
    }, [selectedPropertyId]);

    const handleViewDetails = (projectId: string) => {
        setSelectedProjectId(projectId);
        setActivePageId('E-05'); // Go to pipeline
    };

    const timeAgo = (dateString: string) => {
        if (!dateString) return '';
        const diff = Date.now() - new Date(dateString).getTime();
        const hours = Math.floor(diff / 3600000);
        if (hours < 1) return 'Just now';
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        return `${days}d ago`;
    };

    return (
        <PageContainer
            title={selectedPropertyId ? 'Property Projects' : 'All Projects'}
            description={selectedPropertyId ? 'Projects linked to this property — live from Firebase.' : 'All active projects — live from Firebase.'}
        >
            <div className="flex justify-end mb-6">
                <Button onClick={() => setActivePageId('E-02a')}>
                    + Start New Lead
                </Button>
            </div>

            {loading ? (
                <div className="space-y-4 animate-pulse">
                    {[0, 1, 2].map(i => (
                        <div key={i} className="h-24 bg-gray-900 border border-gray-800 rounded-xl" />
                    ))}
                </div>
            ) : projects.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 border border-dashed border-gray-800 rounded-xl text-center bg-gray-900/20">
                    <BriefcaseIcon className="w-16 h-16 text-gray-700 mb-4" />
                    <p className="text-gray-500 text-lg font-bold uppercase tracking-widest">No Projects Found</p>
                    <p className="text-gray-600 text-sm mt-2">Projects added via Customer Input will appear here.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {projects.map(project => (
                        <Card key={project.id} className="hover:border-[#ec028b]/30 transition-all group">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center text-[#ec028b] group-hover:border-[#ec028b]/40 transition-all shrink-0"
                                        style={{ clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)' }}>
                                        <BriefcaseIcon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white group-hover:text-[#ec028b] transition-colors">
                                            {project.name || 'Unnamed Project'}
                                        </h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            {project.property_address && (
                                                <div className="flex items-center text-xs text-gray-500">
                                                    <MapPinIcon className="w-3 h-3 mr-1" />
                                                    <span>{project.property_address}</span>
                                                </div>
                                            )}
                                            {project.project_type && (
                                                <span className="text-[9px] bg-gray-900 border border-gray-800 px-2 py-0.5 rounded font-black uppercase text-gray-500">
                                                    {project.project_type}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-[10px] text-gray-600 font-mono mt-1">
                                            {timeAgo(project.updated_at || project.created_at)}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 shrink-0">
                                    {project.current_stage && (
                                        <span className={cn(
                                            'text-[10px] px-3 py-1 rounded border font-black uppercase tracking-wider',
                                            stageBadgeColor(project.current_stage)
                                        )}>
                                            {project.current_stage}
                                        </span>
                                    )}
                                    {project.quote?.total && (
                                        <span className="font-mono text-sm font-bold text-[#ec028b]">
                                            ${project.quote.total.toLocaleString()}
                                        </span>
                                    )}
                                    <Button variant="secondary" size="sm" onClick={() => handleViewDetails(project.id)}>
                                        View Details
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </PageContainer>
    );
};

export default PropertyProjectsPage;