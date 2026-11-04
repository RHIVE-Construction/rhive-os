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
    { id: 'wednesday', label: 'Weekly Wednesday Customer Heartbeat Update', sent: false },
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
    const [wednesdayNote, setWednesdayNote] = useState('');
    const [wednesdayLog, setWednesdayLog] = useState<Array<{ id: string; note: string; sentAt: string }>>(
        Array.isArray(project?.pre_install?.wednesday_updates) ? project.pre_install.wednesday_updates : []
    );
    const [saving, setSaving] = useState(false);
    const [banner, setBanner] = useState('');

    useEffect(() => {
        if (project?.pre_install?.comms) setComms(project.pre_install.comms);
        if (project?.pre_install?.checklist) setChecklist(project.pre_install.checklist);
        setWednesdayLog(
            Array.isArray(project?.pre_install?.wednesday_updates) ? project.pre_install.wednesday_updates : []
        );
    }, [project?.id]);

    // Extract intake rooftop equipment flags so Ops never misses detach/reset coordination
    const detailedScope = project?.details?.detailedScope || project?.detailed_scope || {};
    const siteAlerts: string[] = [];
    if (detailedScope.solarAction && detailedScope.solarAction !== 'None') {
        siteAlerts.push(`Solar Panels: ${detailedScope.solarAction}`);
    }
    if (detailedScope.swampCoolerAction && detailedScope.swampCoolerAction !== 'None') {
        siteAlerts.push(`Swamp Cooler / HVAC: ${detailedScope.swampCoolerAction}`);
    }
    if (detailedScope.satelliteAction && detailedScope.satelliteAction !== 'None') {
        siteAlerts.push(`Satellite Dish: ${detailedScope.satelliteAction}`);
    }
    if (detailedScope.skylightCount && Number(detailedScope.skylightCount) > 0) {
        siteAlerts.push(`Skylights: ${detailedScope.skylightCount} unit(s)`);
    }
    if (project?.eave_ventilation && project.eave_ventilation !== 'Adequate Soffit Intake') {
        siteAlerts.push(`Ventilation Upgrade: ${project.eave_ventilation}`);
    }

    const persistPreInstall = async (
        nextComms: typeof comms,
        nextChecklist: typeof checklist,
        advance: boolean = false,
        nextWedLog = wednesdayLog
    ) => {
        if (!project?.id || saving) return;
        setSaving(true);
        setBanner('');
        try {
            const latestHeartbeat = nextWedLog.length > 0 ? nextWedLog[0].note : project?.pizza_tracker?.note || '';
            const schedDate =
                project?.ops_schedule?.installDate ||
                project?.ops_schedule?.install_date ||
                project?.install_date ||
                '';

            const updates: Record<string, any> = {
                pre_install: {
                    comms: nextComms,
                    checklist: nextChecklist,
                    wednesday_updates: nextWedLog,
                    updatedAt: new Date().toISOString(),
                },
                pizza_tracker: advance
                    ? {
                          stage: 'Install',
                          current_stage: 'Install',
                          stageIndex: 6,
                          totalStages: PIPELINE.length,
                          subSteps: PIPELINE[6].defaultSubSteps.map((label, i) => ({ label, done: i === 0 })),
                          installDate: schedDate,
                          install_date: schedDate,
                          note: latestHeartbeat,
                          updatedAt: new Date().toISOString(),
                      }
                    : {
                          stage: 'Pre-Installation',
                          current_stage: 'Pre-Installation',
                          stageIndex: 5,
                          totalStages: PIPELINE.length,
                          subSteps: nextChecklist.map((c: any) => ({ label: c.task, done: c.done })),
                          installDate: schedDate,
                          install_date: schedDate,
                          note: latestHeartbeat,
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
                    collection: project._source || 'projects',
                    projectId: project.id,
                    stage: advance ? 'Install' : 'Pre-Installation',
                }
            );

            if (advance) {
                setActivePageId('E-32');
            } else {
                setBanner('Pre-installation status & Wednesday Heartbeat synced to Client Portal.');
            }
        } finally {
            setSaving(false);
        }
    };

    const toggleComm = (id: string) => {
        const next = comms.map((c: any) => (c.id === id ? { ...c, sent: !c.sent } : c));
        setComms(next);
        persistPreInstall(next, checklist, false);
    };

    const toggleChecklist = (id: string) => {
        const next = checklist.map((c: any) => (c.id === id ? { ...c, done: !c.done } : c));
        setChecklist(next);
        persistPreInstall(comms, next, false);
    };

    const handleSendWednesdayUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!wednesdayNote.trim()) return;
        const entry = {
            id: `wed-${Date.now()}`,
            note: wednesdayNote.trim(),
            sentAt: new Date().toISOString(),
        };
        const nextLog = [entry, ...wednesdayLog];
        const nextComms = comms.map((c: any) => (c.id === 'wednesday' ? { ...c, sent: true } : c));
        setWednesdayLog(nextLog);
        setComms(nextComms);
        setWednesdayNote('');
        persistPreInstall(nextComms, checklist, false, nextLog);
    };

    return (
        <div className="p-6 md:p-8 space-y-6">
            {banner && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2">
                    <CheckCircleIcon className="w-4 h-4" />
                    {banner}
                </div>
            )}

            {siteAlerts.length > 0 && (
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 mr-2">
                        Intake Rooftop Coordination Alerts:
                    </span>
                    {siteAlerts.map((alert) => (
                        <span
                            key={alert}
                            className="text-xs font-bold px-2.5 py-1 rounded-lg bg-black/50 border border-amber-500/30 text-amber-200"
                        >
                            {alert}
                        </span>
                    ))}
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
                                <span
                                    className={cn(
                                        'text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded border shrink-0',
                                        item.sent
                                            ? 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10'
                                            : 'text-gray-400 border-gray-700 bg-black/50'
                                    )}
                                >
                                    {item.sent ? 'Sent' : 'Send'}
                                </span>
                            </li>
                        ))}
                    </ul>

                    <form onSubmit={handleSendWednesdayUpdate} className="mt-4 pt-4 border-t border-gray-800 space-y-2">
                        <label className="block text-[10px] text-gray-500 uppercase font-bold tracking-widest">
                            Wednesday Proactive Portal Update (Pushes Live to Client Pizza Tracker)
                        </label>
                        <div className="flex gap-2">
                            <input
                                id="preinstall-wednesday-input"
                                type="text"
                                value={wednesdayNote}
                                onChange={(e) => setWednesdayNote(e.target.value)}
                                placeholder="e.g. Shingles staged at SRS; crew confirmed for Monday 7:30 AM arrival"
                                className="flex-1 bg-black/60 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#ec028b]"
                            />
                            <Button id="preinstall-wednesday-send-btn" type="submit" variant="secondary" size="sm">
                                Send
                            </Button>
                        </div>
                        {wednesdayLog.length > 0 && (
                            <p className="text-[11px] text-emerald-400">
                                Latest Portal Note: &ldquo;{wednesdayLog[0].note}&rdquo;
                            </p>
                        )}
                    </form>
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
                                <div
                                    className={cn(
                                        'w-5 h-5 rounded-full border flex items-center justify-center flex-none',
                                        item.done ? 'bg-[#ec028b] border-[#ec028b] text-white' : 'border-gray-600 bg-black'
                                    )}
                                >
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
                            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">
                                Scheduled Date
                            </p>
                            <p className="text-sm text-cyan-400 font-mono font-bold">
                                {project.ops_schedule?.installDate || project.install_date || 'Ready'}
                            </p>
                        </div>
                        <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-800">
                            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">
                                Prep Progress
                            </p>
                            <p className="text-sm text-emerald-400 font-bold">
                                {checklist.filter((c: any) => c.done).length} / {checklist.length} Confirmed
                            </p>
                        </div>
                        <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-800">
                            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">
                                Contract Value
                            </p>
                            <p className="text-sm text-[#ec028b] font-bold font-mono">
                                {project.quote?.total ? `$${Number(project.quote.total).toLocaleString()}` : '—'}
                            </p>
                        </div>
                    </div>
                    <div className="mt-5 flex justify-end gap-3">
                        <Button
                            id="preinstall-save-btn"
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
                            <span>{saving ? 'Saving…' : 'Confirm'}</span>
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
