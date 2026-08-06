
import React, { useState, useEffect } from 'react';
import PageContainer from '../components/PageContainer';
import Card from '../components/Card';
import Button from '../components/Button';
import { useNavigation } from '../contexts/NavigationContext';
import EditRecordModal from '../components/EditRecordModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import { 
    UserIcon, 
    CalculatorIcon, 
    DocumentTextIcon, 
    PencilSquareIcon,
    BriefcaseIcon,
    MapPinIcon,
    ClockIcon,
    PencilIcon,
    TrashIcon
} from '../components/icons';
import { projectService, firestoreService, userLogService } from '../lib/firebaseService';
import { session } from '../lib/session';
import { cn, getStagePageId } from '../lib/utils';

// The 4 early-stage tabs this page focuses on
const TABS = ['Lead', 'Estimate', 'Quote', 'Sign & Verify'] as const;
type Tab = typeof TABS[number];

// Maps tab labels to what the current_stage field might be in Firebase
const STAGE_MATCH: Record<Tab, string[]> = {
    'Lead':         ['lead'],
    'Estimate':     ['estimate'],
    'Quote':        ['quote'],
    'Sign & Verify': ['sign & verify', 'sign', 'signed'],
};

const SalesPipelinePage: React.FC = () => {
    const { setActivePageId, setSelectedProjectId } = useNavigation();
    const [activeTab, setActiveTab] = useState<Tab>('Lead');
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [editTarget, setEditTarget] = useState<any | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<any | null>(null);

    // Subscribe to Firebase real-time updates
    useEffect(() => {
        const unsubscribe = projectService.subscribe((data: any[]) => {
            setProjects(data);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const getProjectsByStage = (stage: Tab) => {
        const matchTerms = STAGE_MATCH[stage];
        return projects.filter(p => {
            const cs = (p.current_stage || p.status || '').toLowerCase().trim();
            return matchTerms.some(m => cs === m || cs.startsWith(m));
        });
    };

    const handleProjectAction = (projectId: string, action: 'estimate' | 'quote' | 'view') => {
        setSelectedProjectId(projectId);
        if (action === 'estimate') setActivePageId('E-EST-TOOL');
        else if (action === 'quote') setActivePageId('E-G-02');
        else if (action === 'view') setActivePageId('E-08');
    };

    const handleCardClick = (project: any) => {
        setSelectedProjectId(project.id);
        setActivePageId(getStagePageId(project.current_stage));
    };

    // --- EDIT HANDLER ---
    const handleEditSave = async (updates: Record<string, string>) => {
        if (!editTarget) return;
        const col = editTarget._source === 'leads' ? 'leads' : editTarget._source === 'deals' ? 'deals' : 'projects';
        await firestoreService.updateDocument(col, editTarget.id, updates);
        await userLogService.logAction(
            'EDIT_RECORD',
            `Record edited from pipeline (ID: ${editTarget.id})`,
            { recordId: editTarget.id, collection: col }
        );
        setEditTarget(null);
    };

    // --- SOFT DELETE HANDLER ---
    const handleSoftDelete = async (reason: string) => {
        if (!deleteTarget) return;
        const col = deleteTarget._source === 'leads' ? 'leads' : deleteTarget._source === 'deals' ? 'deals' : 'projects';
        const actor = session.read();
        await firestoreService.softDeleteDocument(col, deleteTarget.id, {
            deletion_reason: reason,
            deleted_by: actor?.name || actor?.email || 'Unknown',
        });
        await userLogService.logAction(
            'DELETE_RECORD',
            `Record moved to trash from pipeline (ID: ${deleteTarget.id})`,
            { recordId: deleteTarget.id, collection: col, reason }
        );
        setDeleteTarget(null);
    };

    const getAddress = (project: any): string => {
        if (project.property?.address) {
            return [project.property.address, project.property.city, project.property.state].filter(Boolean).join(', ');
        }
        return project.property_address || '';
    };

    const renderProjectCard = (project: any) => (
        <div key={project.id} className="relative group/card">
            <div onClick={() => handleCardClick(project)} className="bg-gray-900/50 border border-gray-700 p-5 rounded-xl hover:border-[#ec028b] transition-all duration-300 group shadow-lg cursor-pointer">
                <div className="flex justify-between items-start mb-3">
                    <div className="flex-1 min-w-0 pr-2">
                        <h3 className="text-white font-bold text-lg group-hover:text-[#ec028b] transition-colors truncate">
                            {project.name || 'Unnamed Project'}
                        </h3>
                        {getAddress(project) && (
                            <div className="flex items-center text-xs text-gray-500 mt-1">
                                <MapPinIcon className="w-3 h-3 mr-1 shrink-0" />
                                <span className="truncate">{getAddress(project)}</span>
                            </div>
                        )}
                        <p className="text-xs text-gray-600 font-mono mt-1">{project.id.slice(-12)} • {project.updated_at ? new Date(project.updated_at).toLocaleDateString() : ''}</p>
                    </div>
                    <div className="text-gray-300 bg-black/40 border border-gray-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shrink-0">
                        {project.project_type || 'N/A'}
                    </div>
                </div>
                
                <div className="mb-6 text-sm text-gray-400">
                    {activeTab === 'Lead' && "Status: New Opportunity. Needs Qualification."}
                    {activeTab === 'Estimate' && "Status: Awaiting AI Analysis."}
                    {activeTab === 'Quote' && (
                        <div className="flex items-center">
                            <span>Quote Value: </span>
                            <span className="ml-2 text-white font-bold font-mono">
                                {project.quote?.total ? '$' + project.quote.total.toLocaleString() : 'Drafting...'}
                            </span>
                        </div>
                    )}
                    {activeTab === 'Sign & Verify' && "Status: Pending Customer Signature."}
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-800">
                    {activeTab === 'Lead' && (
                        <>
                            <Button size="sm" onClick={(e) => { e.stopPropagation(); handleProjectAction(project.id, 'estimate'); }} className="flex-1">
                                <CalculatorIcon className="w-4 h-4 mr-2" />
                                Estimator
                            </Button>
                            <Button size="sm" variant="secondary" onClick={(e) => { e.stopPropagation(); handleProjectAction(project.id, 'view'); }} className="flex-1">
                                <UserIcon className="w-4 h-4 mr-2" />
                                Profile
                            </Button>
                        </>
                    )}
                    {activeTab === 'Estimate' && (
                        <>
                            <Button size="sm" onClick={(e) => { e.stopPropagation(); handleProjectAction(project.id, 'estimate'); }} className="flex-1">
                                <CalculatorIcon className="w-4 h-4 mr-2" />
                                Open Tool
                            </Button>
                            <Button size="sm" variant="secondary" onClick={(e) => { e.stopPropagation(); handleProjectAction(project.id, 'quote'); }} className="flex-1">
                                <DocumentTextIcon className="w-4 h-4 mr-2" />
                                Build Quote
                            </Button>
                        </>
                    )}
                    {activeTab === 'Quote' && (
                        <Button size="sm" onClick={(e) => { e.stopPropagation(); handleProjectAction(project.id, 'quote'); }} className="w-full">
                            <PencilSquareIcon className="w-4 h-4 mr-2" />
                            Edit / Send Quote
                        </Button>
                    )}
                    {activeTab === 'Sign & Verify' && (
                        <Button size="sm" variant="secondary" className="w-full cursor-default border-gray-700 text-gray-500 hover:bg-transparent hover:text-gray-500 flex items-center justify-center gap-2">
                            <ClockIcon className="w-4 h-4" />
                            Awaiting Signature...
                        </Button>
                    )}
                </div>
            </div>

            {/* Edit / Delete action buttons — appear on card hover */}
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover/card:opacity-100 transition-opacity duration-200 z-10">
                <button
                    id={`pipeline-edit-btn-${project.id}`}
                    onClick={(e) => { e.stopPropagation(); setEditTarget(project); }}
                    aria-label={`Edit ${project.name || 'record'}`}
                    className="w-7 h-7 flex items-center justify-center bg-[#0a0a0a] border border-[#ec028b]/40 text-[#ec028b] hover:bg-[#ec028b]/20 hover:border-[#ec028b] transition-all shadow-lg"
                    style={{ clipPath: 'polygon(5px 0, 100% 0, 100% calc(100% - 5px), calc(100% - 5px) 100%, 0 100%, 0 5px)' }}
                >
                    <PencilIcon className="w-3 h-3" />
                </button>
                <button
                    id={`pipeline-delete-btn-${project.id}`}
                    onClick={(e) => { e.stopPropagation(); setDeleteTarget(project); }}
                    aria-label={`Move ${project.name || 'record'} to trash`}
                    className="w-7 h-7 flex items-center justify-center bg-[#0a0a0a] border border-red-900/40 text-red-700 hover:bg-red-900/20 hover:border-red-600/60 hover:text-red-400 transition-all shadow-lg"
                    style={{ clipPath: 'polygon(5px 0, 100% 0, 100% calc(100% - 5px), calc(100% - 5px) 100%, 0 100%, 0 5px)' }}
                >
                    <TrashIcon className="w-3 h-3" />
                </button>
            </div>
        </div>
    );

    const tabProjects = getProjectsByStage(activeTab);

    return (
        <>
        <PageContainer title="Sales Pipeline" description="Manage customer acquisition from Lead to Contract — live from Firebase.">
            
            {/* Navigation Tabs */}
            <div className="flex space-x-1 mb-8 overflow-x-auto pb-1 border-b border-gray-800 items-center justify-between">
                <div className="flex space-x-1">
                    {TABS.map((stage) => (
                        <button
                            key={stage}
                            onClick={() => setActiveTab(stage)}
                            className={cn(
                                "px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 border",
                                activeTab === stage 
                                    ? 'bg-[#ec028b]/20 text-[#ec028b] border-[#ec028b]/50 shadow-[0_0_15px_rgba(236,2,139,0.2)]' 
                                    : 'text-gray-500 border-gray-800 hover:text-white hover:bg-gray-800'
                            )}
                        >
                            {stage}{' '}
                            <span className={`ml-3 text-xs px-2 py-0.5 rounded-full ${activeTab === stage ? 'bg-[#ec028b] text-white' : 'bg-gray-800 text-gray-400'}`}>
                                {loading ? '…' : getProjectsByStage(stage).length}
                            </span>
                        </button>
                    ))}
                </div>
                <div className={cn(
                    "flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest mr-1",
                    loading ? "text-yellow-400 animate-pulse" : "text-green-400"
                )}>
                    <span className={cn("w-1.5 h-1.5 rounded-full", loading ? "bg-yellow-400" : "bg-green-400")} />
                    {loading ? 'Syncing…' : 'Live'}
                </div>
            </div>

            {/* Project Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    [0, 1, 2].map(i => (
                        <div key={i} className="h-56 bg-gray-900 border border-gray-800 rounded-xl animate-pulse" />
                    ))
                ) : (
                    tabProjects.map(renderProjectCard)
                )}
                
                {!loading && tabProjects.length === 0 && (
                    <div className="col-span-full p-16 text-center border border-dashed border-gray-800 rounded-xl text-gray-600 bg-gray-900/20">
                        <BriefcaseIcon className="w-16 h-16 mx-auto mb-4 opacity-20" />
                        <p className="text-lg font-medium">No active projects in {activeTab}</p>
                        <p className="text-sm mt-2">Use Customer Input to create a new lead, or check Firebase.</p>
                    </div>
                )}
            </div>
        </PageContainer>

        {/* Edit Modal */}
        {editTarget && (
            <EditRecordModal
                record={editTarget}
                onClose={() => setEditTarget(null)}
                onSave={handleEditSave}
            />
        )}

        {/* Delete (Trash) Confirmation Modal */}
        {deleteTarget && (
            <DeleteConfirmModal
                recordName={deleteTarget.name || 'Unnamed Project'}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleSoftDelete}
            />
        )}
        </>
    );
};

export default SalesPipelinePage;
