import React, { useState, useEffect } from 'react';
import { ProjectStageLayout, PIPELINE } from '../components/ProjectStageLayout';
import Card from '../components/Card';
import Button from '../components/Button';
import { CheckIcon, ClockIcon, CheckCircleIcon } from '../components/icons';
import { projectService, userLogService } from '../lib/firebaseService';
import { useNavigation } from '../contexts/NavigationContext';
import { cn } from '../lib/utils';

const DEFAULT_COMMS = [
    { id: '3day', label: '3-Day Property Prep & Driveway Clearance Guide', sent: true },
    { id: '1day', label: 'Day-Before Crew Arrival Window Notification', sent: false },
    { id: 'weather', label: 'Wasatch Weather Window Verification', sent: false },
];

const DEFAULT_PREP_ITEMS = [
    { id: 'prep-ack', task: 'Customer prep guide acknowledged (vehicles & patio cleared)', done: true },
    { id: 'mat-drop', task: 'Materials delivered & staged on site', done: false },
    { id: 'crew-brief', task: 'Crew safety & multi-building scope briefing complete', done: true },
    { id: 'armor', task: 'Catch-all landscape & AC armor staged', done: false },
];

const PreInstallContent: React.FC<{ project: any }> = ({ project }) => {
    const { setActivePageId } = useNavigation();
    const [comms, setComms] = useState(project?.pre_install?.comms || DEFAULT_COMMS);
    const [checklist, setChecklist] = useState(project?.pre_install?.checklist || DEFAULT_PREP_ITEMS);
    const [saving, setSaving] = useState(false);
    const [banner, setBanner] = useState('');

    useEffect(() => {
        if (project?.pre_install?.comms) setComms(project.pre_install.comms);
        if (project?.pre_install?.checklist) setChecklist(project.pre_install.checklist);
    }, [project?.id]);

    const persistPreInstall = async (nextComms: typeof comms, nextChecklist: typeof checklist, advance: boolean = false) => {
        if (!project?.id || saving) return;
        setSaving(true);
        setBanner('');
        try {
            const updates: Record<string, any> = {
                pre_install: {
                    comms: nextComms,
                    checklist: nextChecklist,
                    updatedAt: new Date().toISOString(),
                },
                pizza_tracker: advance
                    ? {
                        stage: 'Install',
                        stageIndex: 6,
                        totalStages: PIPELINE.length,
                        subSteps: PIPELINE[6].defaultSubSteps.map((label, i) => ({ label, done: i === 0 })),
                        updatedAt: new Date().toISOString(),
                    }
                    : {
                        stage: 'Pre-Installation',
                        stageIndex: 5,
                        totalStages: PIPELINE.length,
                        subSteps: nextChecklist.map((c: any) => ({ label: c.task, done: c.done })),
                        updatedAt: new Date().toISOString(),
                    },
                updated_at: new Date().toISOString(),
            };

            if (advance) {
                updates.current_stage = 'Install';
            }

            await projectService.updateRecord(project.id, updates, project._source);
            await userLogService.logAction(
                advance ? 'STAGE_CHANGE' : 'EDIT_RECORD',
                advance
                    ? `${project.name || 'Project'} pre-installation complete — moved to Install`
                    : `Updated pre-installation checklist for ${project.name || 'Project'}`,
                {
                    recordId: project.id,
                    recordName: project.name || 'Unknown',
                    projectId: project.id,
                    stage: advance ? 'Install' : 'Pre-Installation',
                }
            );

            if (advance) {
                setActivePageId('E-32');
            } else {
                setBanner('Pre-installation status synced to Firebase & Client Portal.');
            }
        } finally {
            setSaving(false);
        }
    };

    const toggleComm = (id: string) => {
        const next = comms.map((c: any) => c.id === id ? { ...c, sent: !c.sent } : c);
        setComms(next);
        persistPreInstall(next, checklist, false);
    };

    const toggleChecklist = (id: string) => {
        const next = checklist.map((c: any) => c.id === id ? { ...c, done: !c.done } : c);
        setChecklist(next);
        persistPreInstall(comms, next, false);
    };

    return (
        <div className="p-6 md:p-8 space-y-6">
            {banner && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2">
                    <CheckCircleIcon className="w-4 h-4" />
                    {banner}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card title="Scheduled Customer Communications">
                    <ul className="space-y-3">
                        {comms.map((item: any) => (
                            <li
                                key={item.id}
                                onClick={() => toggleComm(item.id)}
                                className={cn(
                                    'flex items-center justify-between p-3.5 rounded-lg border cursor-pointer transition-all',
                                    item.sent
                                        ? 'bg-[#ec028b]/10 border-[#ec028b]/60 shadow-[0_0_12px_rgba(236,2,139,0.15)]'
                                        : 'bg-gray-900/50 border-gray-800 hover:border-gray-600'
                                )}
                            >
                                <span className={cn('text-sm font-medium pr-3', item.sent ? 'text-white' : 'text-gray-400')}>
                                    {item.label}
                                </span>
                                <span className={cn(
                                    'text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded border shrink-0',
                                    item.sent
                                        ? 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10'
                                        : 'text-gray-400 border-gray-700 bg-black/50'
                                )}>
                                    {item.sent ? 'Sent' : 'Send'}
                                </span>
                            </li>
                        ))}
                    </ul>
                </Card>

                <Card title="Site Prep & Staging Checklist">
                    <div className="space-y-3">
                        {checklist.map((item: any) => (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => toggleChecklist(item.id)}
                                className={cn(
                                    'w-full text-left flex items-center gap-3 p-3.5 rounded-lg border transition-all',
                                    item.done
                                        ? 'bg-[#ec028b]/10 border-[#ec028b]/60 shadow-[0_0_12px_rgba(236,2,139,0.15)]'
                                        : 'bg-gray-900/50 border-gray-800 hover:border-gray-600'
                                )}
                            >
                                <div className={cn(
                                    'w-5 h-5 rounded-full border flex items-center justify-center flex-none',
                                    item.done ? 'bg-[#ec028b] border-[#ec028b] text-white' : 'border-gray-600 bg-black'
                                )}>
                                    {item.done && <CheckIcon className="w-3 h-3" />}
                                </div>
                                <span className={cn('text-sm', item.done ? 'text-white font-semibold' : 'text-gray-400')}>
                                    {item.task}
                                </span>
                            </button>
                        ))}
                    </div>
                </Card>

                <Card title="Project Readiness Summary" className="md:col-span-2">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-800">
                            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">Project</p>
                            <p className="text-sm text-white font-bold truncate">{project.name}</p>
                        </div>
                        <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-800">
                            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">Scheduled Date</p>
                            <p className="text-sm text-cyan-400 font-mono font-bold">{project.ops_schedule?.installDate || 'Ready'}</p>
                        </div>
                        <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-800">
                            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">Prep Progress</p>
                            <p className="text-sm text-emerald-400 font-bold">
                                {checklist.filter((c: any) => c.done).length} / {checklist.length} Confirmed
                            </p>
                        </div>
                        <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-800">
                            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">Contract Value</p>
                            <p className="text-sm text-[#ec028b] font-bold font-mono">
                                {project.quote?.total ? `$${Number(project.quote.total).toLocaleString()}` : '—'}
                            </p>
                        </div>
                    </div>
                    <div className="mt-5 flex justify-end gap-3">
                        <Button
                            variant="secondary"
                            disabled={saving}
                            onClick={() => persistPreInstall(comms, checklist, false)}
                        >
                            Save
                        </Button>
                        <Button
                            id="preinstall-advance-btn"
                            disabled={saving}
                            onClick={() => persistPreInstall(comms, checklist, true)}
                            className="flex items-center gap-2 shadow-[0_0_18px_rgba(236,2,139,0.3)]"
                        >
                            <ClockIcon className="w-4 h-4" />
                            <span>{saving ? 'Saving…' : 'Confirm & Advance to Install'}</span>
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    );
};

const PreInstallationPage: React.FC = () => (
    <ProjectStageLayout stageLabel="Pre-Installation" stagePageId="E-31">
        {(project) => <PreInstallContent project={project} />}
    </ProjectStageLayout>
);

export default PreInstallationPage;
