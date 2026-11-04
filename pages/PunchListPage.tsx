import React, { useState, useEffect } from 'react';
import { ProjectStageLayout, PIPELINE } from '../components/ProjectStageLayout';
import Card from '../components/Card';
import Button from '../components/Button';
import { CheckIcon, PlusIcon, ShieldCheckIcon, ChevronRightIcon, CheckCircleIcon } from '../components/icons';
import { projectService, userLogService } from '../lib/firebaseService';
import { useNavigation } from '../contexts/NavigationContext';
import { cn } from '../lib/utils';

interface WarrantyTask {
    id: string;
    task: string;
    assignedTo: string;
    completed: boolean;
}

const DEFAULT_WARRANTY_TASKS: WarrantyTask[] = [
    { id: 'envelope', task: 'Envelope, Penetration & Flashing QC Audit', assignedTo: 'RHIVE QC Lead', completed: true },
    { id: 'magnet', task: 'Triple Magnetic Perimeter Nail Sweep', assignedTo: 'Site Foreman', completed: true },
    { id: 'gutter', task: 'Gutter, Valley & Downspout Flow Clear', assignedTo: 'Site Foreman', completed: false },
    { id: 'certificate', task: 'Official RHIVE & Manufacturer Warranty Registered', assignedTo: 'Operations Admin', completed: false },
];

const WarrantyActivationContent: React.FC<{ project: any }> = ({ project }) => {
    const { setActivePageId } = useNavigation();

    const [items, setItems] = useState<WarrantyTask[]>(
        Array.isArray(project?.warranty_tasks) && project.warranty_tasks.length > 0
            ? project.warranty_tasks
            : DEFAULT_WARRANTY_TASKS
    );
    const [newTaskText, setNewTaskText] = useState('');
    const [newAssignee, setNewAssignee] = useState('RHIVE QC Lead');
    const [saving, setSaving] = useState(false);
    const [banner, setBanner] = useState('');

    useEffect(() => {
        setItems(
            Array.isArray(project?.warranty_tasks) && project.warranty_tasks.length > 0
                ? project.warranty_tasks
                : DEFAULT_WARRANTY_TASKS
        );
    }, [project?.id]);

    const completedCount = items.filter(i => i.completed).length;

    const persistWarrantyTasks = async (nextItems: WarrantyTask[], advance = false) => {
        if (!project?.id || saving) return;
        setSaving(true);
        setBanner('');
        try {
            const updates: Record<string, any> = {
                warranty_tasks: nextItems,
                warranty_activated: nextItems.every(i => i.completed) || advance,
                pizza_tracker: advance
                    ? {
                        stage: 'Invoicing',
                        stageIndex: 8,
                        totalStages: PIPELINE.length,
                        subSteps: PIPELINE[8].defaultSubSteps.map((label, idx) => ({ label, done: idx < 2 })),
                        updatedAt: new Date().toISOString(),
                    }
                    : {
                        stage: 'Warranty Activation',
                        stageIndex: 7,
                        totalStages: PIPELINE.length,
                        subSteps: nextItems.map(i => ({ label: i.task, done: i.completed })),
                        updatedAt: new Date().toISOString(),
                    },
            };

            if (advance) {
                updates.current_stage = 'Invoicing';
                updates.warranty_activated_at = new Date().toISOString();
            }

            await projectService.updateRecord(project.id, updates, project._source);
            await userLogService.logAction(
                advance ? 'STAGE_CHANGE' : 'EDIT_RECORD',
                advance
                    ? `${project.name || 'Project'} Warranty Activated — moved to Invoicing (10% Final Balance)`
                    : `Updated Warranty Activation QC checklist for ${project.name || 'Project'}`,
                {
                    recordId: project.id,
                    recordName: project.name || 'Project',
                    collection: project._source || 'projects',
                    stage: advance ? 'Invoicing' : 'Warranty Activation',
                }
            );

            if (advance) {
                setActivePageId('E-34');
            } else {
                setBanner('Warranty Activation QC checklist synced to Firebase & Client Pizza Tracker.');
            }
        } finally {
            setSaving(false);
        }
    };

    const handleToggleItem = (id: string) => {
        const next = items.map(i => (i.id === id ? { ...i, completed: !i.completed } : i));
        setItems(next);
        persistWarrantyTasks(next, false);
    };

    const handleCreateTask = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTaskText.trim()) return;
        const next: WarrantyTask[] = [
            ...items,
            {
                id: `qc-${Date.now()}`,
                task: newTaskText.trim(),
                assignedTo: newAssignee.trim() || 'RHIVE QC Lead',
                completed: false,
            },
        ];
        setItems(next);
        setNewTaskText('');
        persistWarrantyTasks(next, false);
    };

    return (
        <div className="p-6 md:p-8 space-y-6">
            {banner && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2">
                    <CheckCircleIcon className="w-4 h-4 flex-none" />
                    <span>{banner}</span>
                </div>
            )}

            <Card title="Warranty Activation & Quality Audit">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-800">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#ec028b]/15 border border-[#ec028b]/30 flex items-center justify-center text-[#ec028b]">
                            <ShieldCheckIcon className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-white font-bold text-sm">
                                {completedCount} of {items.length} Warranty QC Gates Verified
                            </p>
                            <p className="text-xs text-gray-400">
                                Completing Warranty Activation unlocks the final 10% milestone invoice.
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleCreateTask} className="flex flex-wrap sm:flex-nowrap gap-2">
                        <input
                            id="warranty-new-task-input"
                            type="text"
                            value={newTaskText}
                            onChange={(e) => setNewTaskText(e.target.value)}
                            placeholder="Add QC or touch-up item..."
                            className="bg-black/60 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#ec028b]"
                        />
                        <input
                            id="warranty-new-assignee-input"
                            type="text"
                            value={newAssignee}
                            onChange={(e) => setNewAssignee(e.target.value)}
                            placeholder="Assignee"
                            className="w-36 bg-black/60 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#ec028b]"
                        />
                        <Button id="warranty-create-task-btn" type="submit" variant="secondary" size="sm" className="flex items-center gap-1.5">
                            <PlusIcon className="w-4 h-4" />
                            <span>Create</span>
                        </Button>
                    </form>
                </div>

                <ul className="space-y-3">
                    {items.map((item, idx) => (
                        <li key={item.id}>
                            <button
                                id={`warranty-task-${idx}`}
                                type="button"
                                onClick={() => handleToggleItem(item.id)}
                                className={cn(
                                    'w-full p-4 rounded-xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-left transition-all',
                                    item.completed
                                        ? 'border-[#ec028b] bg-[#ec028b]/10 shadow-[0_0_15px_rgba(236,2,139,0.2)]'
                                        : 'bg-gray-900/50 border-gray-800 hover:border-gray-600'
                                )}
                            >
                                <div className="flex items-start gap-4 flex-1">
                                    <div className={cn(
                                        'mt-0.5 flex-none w-5 h-5 rounded-full border flex items-center justify-center',
                                        item.completed
                                            ? 'bg-[#ec028b] border-[#ec028b] text-white'
                                            : 'border-gray-700 bg-black'
                                    )}>
                                        {item.completed && <CheckIcon className="w-3 h-3" />}
                                    </div>
                                    <div>
                                        <p className={cn('font-semibold text-sm', item.completed ? 'text-white' : 'text-gray-300')}>
                                            {item.task}
                                        </p>
                                        <p className="text-[11px] text-gray-400 mt-1 uppercase font-bold tracking-widest">
                                            Assigned to: {item.assignedTo}
                                        </p>
                                    </div>
                                </div>

                                <span className={cn(
                                    'text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded border shrink-0',
                                    item.completed
                                        ? 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10'
                                        : 'text-gray-300 border-gray-700 bg-black/60'
                                )}>
                                    {item.completed ? 'Verified' : 'Confirm'}
                                </span>
                            </button>
                        </li>
                    ))}
                </ul>

                <div className="mt-6 pt-5 border-t border-gray-800 flex justify-end">
                    <Button
                        id="warranty-advance-btn"
                        onClick={() => {
                            const completedAll = items.map(i => ({ ...i, completed: true }));
                            setItems(completedAll);
                            persistWarrantyTasks(completedAll, true);
                        }}
                        disabled={saving}
                        className="flex items-center gap-2"
                    >
                        <span>{saving ? 'Activating…' : 'Confirm Warranty & Advance to Invoicing'}</span>
                        <ChevronRightIcon className="w-4 h-4" />
                    </Button>
                </div>
            </Card>
        </div>
    );
};

const PunchListPage: React.FC = () => (
    <ProjectStageLayout stageLabel="Warranty Activation" stagePageId="E-33">
        {(project) => <WarrantyActivationContent project={project} />}
    </ProjectStageLayout>
);

export default PunchListPage;
