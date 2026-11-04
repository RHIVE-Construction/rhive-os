import React, { useState, useEffect } from 'react';
import { ProjectStageLayout, PIPELINE } from '../components/ProjectStageLayout';
import Card from '../components/Card';
import Button from '../components/Button';
import { DocumentCheckIcon, UserIcon, TruckIcon, ChevronRightIcon, CalendarIcon, CheckCircleIcon } from '../components/icons';
import { projectService, userLogService } from '../lib/firebaseService';
import { useNavigation } from '../contexts/NavigationContext';
import { cn } from '../lib/utils';

const CREW_OPTIONS = [
    'RHIVE Certified Shingle Crew Alpha',
    'RHIVE Certified Shingle Crew Bravo',
    'Apex Commercial TPO / PVC Membrane Team',
    'RHIVE Envelope & Repair Service Fleet',
];

const LogicGate = ({
    title,
    subtitle,
    isMet,
    icon: Icon,
    onToggle,
}: {
    title: string;
    subtitle: string;
    isMet: boolean;
    icon: any;
    onToggle: () => void;
}) => (
    <div
        onClick={onToggle}
        className={cn(
            'p-4 rounded-xl border transition-all duration-300 flex items-center justify-between cursor-pointer',
            isMet
                ? 'bg-[#ec028b]/10 border-[#ec028b] shadow-[0_0_15px_rgba(236,2,139,0.2)]'
                : 'bg-gray-900/50 border-gray-800 hover:border-gray-600'
        )}
    >
        <div className="flex items-center">
            <div className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center mr-4',
                isMet ? 'bg-[#ec028b]/20 text-[#ec028b]' : 'bg-gray-800 text-gray-500'
            )}>
                <Icon className="w-5 h-5" />
            </div>
            <div>
                <p className={cn('font-bold text-sm', isMet ? 'text-white' : 'text-gray-300')}>{title}</p>
                <p className="text-xs text-gray-400">{subtitle}</p>
            </div>
        </div>
        <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onToggle(); }}
            className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border transition-all',
                isMet
                    ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                    : 'bg-black/60 border-gray-700 text-gray-300 hover:border-[#ec028b]'
            )}
        >
            {isMet ? 'Confirmed' : 'Confirm'}
        </button>
    </div>
);

const ScheduleContent: React.FC<{ project: any }> = ({ project }) => {
    const { setActivePageId } = useNavigation();

    const [reqs, setReqs] = useState({
        permit: project?.ops_schedule?.permit ?? !!project?.purchase_permit_verified,
        materials: project?.ops_schedule?.materials ?? false,
        labor: project?.ops_schedule?.labor ?? false,
    });
    const [installDate, setInstallDate] = useState<string>(
        project?.ops_schedule?.installDate || new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10)
    );
    const [crewName, setCrewName] = useState<string>(project?.ops_schedule?.crewName || CREW_OPTIONS[0]);
    const [poNumber, setPoNumber] = useState<string>(project?.ops_schedule?.poNumber || 'PO-SRS-2026-104');
    const [saving, setSaving] = useState(false);
    const [banner, setBanner] = useState('');

    useEffect(() => {
        setReqs({
            permit: project?.ops_schedule?.permit ?? !!project?.purchase_permit_verified,
            materials: project?.ops_schedule?.materials ?? false,
            labor: project?.ops_schedule?.labor ?? false,
        });
        if (project?.ops_schedule?.installDate) setInstallDate(project.ops_schedule.installDate);
        if (project?.ops_schedule?.crewName) setCrewName(project.ops_schedule.crewName);
        if (project?.ops_schedule?.poNumber) setPoNumber(project.ops_schedule.poNumber);
    }, [project?.id]);

    const canAdvance = Object.values(reqs).every(Boolean) && !!installDate;

    const syncSchedule = async (nextReqs: typeof reqs, advance: boolean = false) => {
        if (!project?.id || saving) return;
        setSaving(true);
        setBanner('');
        try {
            const subSteps = [
                { label: 'Municipal Permit Approved', done: nextReqs.permit },
                { label: `Material Order Confirmed (${poNumber || 'PO Issued'})`, done: nextReqs.materials },
                { label: `Crew Scheduled (${installDate})`, done: nextReqs.labor },
            ];

            const updates: Record<string, any> = {
                ops_schedule: {
                    ...nextReqs,
                    installDate,
                    crewName,
                    poNumber,
                    updatedAt: new Date().toISOString(),
                },
                pizza_tracker: advance
                    ? {
                        stage: 'Pre-Installation',
                        stageIndex: 5,
                        totalStages: PIPELINE.length,
                        subSteps: PIPELINE[5].defaultSubSteps.map((label, i) => ({ label, done: i === 0 })),
                        installDate,
                        updatedAt: new Date().toISOString(),
                    }
                    : {
                        stage: 'Schedule',
                        stageIndex: 4,
                        totalStages: PIPELINE.length,
                        subSteps,
                        installDate,
                        updatedAt: new Date().toISOString(),
                    },
                updated_at: new Date().toISOString(),
            };

            if (advance) {
                updates.current_stage = 'Pre-Installation';
            }

            await projectService.updateRecord(project.id, updates, project._source);
            await userLogService.logAction(
                advance ? 'STAGE_CHANGE' : 'EDIT_RECORD',
                advance
                    ? `${project.name || 'Project'} scheduled for ${installDate} — moved to Pre-Installation`
                    : `Updated schedule & Client Pizza Tracker for ${project.name || 'Project'}`,
                {
                    recordId: project.id,
                    recordName: project.name || 'Unknown',
                    projectId: project.id,
                    stage: advance ? 'Pre-Installation' : 'Schedule',
                    installDate,
                    crewName,
                }
            );

            if (advance) {
                setActivePageId('E-31');
            } else {
                setBanner('Schedule & Customer Pizza Tracker updated in Firebase.');
            }
        } finally {
            setSaving(false);
        }
    };

    const toggleGate = (key: keyof typeof reqs) => {
        const next = { ...reqs, [key]: !reqs[key] };
        setReqs(next);
        syncSchedule(next, false);
    };

    return (
        <div className="p-6 md:p-8 space-y-6">
            {banner && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2">
                    <CheckCircleIcon className="w-4 h-4" />
                    {banner}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card title="Stage Logic Gates & Client Pizza Tracker Sync">
                        <div className="space-y-4">
                            <LogicGate
                                title="Permit Status: Municipal Building Permit"
                                subtitle={reqs.permit ? 'Permit approved & logged for inspection' : 'Click Confirm once municipal permit is cleared'}
                                isMet={reqs.permit}
                                icon={DocumentCheckIcon}
                                onToggle={() => toggleGate('permit')}
                            />
                            <LogicGate
                                title="Material Order: Supplier PO Confirmed"
                                subtitle={reqs.materials ? `Supplier PO ${poNumber} confirmed for rooftop delivery` : 'Click Confirm once supplier PO is dispatched'}
                                isMet={reqs.materials}
                                icon={TruckIcon}
                                onToggle={() => toggleGate('materials')}
                            />
                            <LogicGate
                                title="Labor Assignment: Certified Crew Accepted"
                                subtitle={reqs.labor ? `Assigned to ${crewName}` : 'Click Confirm once crew accepts work order'}
                                isMet={reqs.labor}
                                icon={UserIcon}
                                onToggle={() => toggleGate('labor')}
                            />
                        </div>

                        <div className="mt-6 pt-6 border-t border-gray-800 flex flex-wrap justify-between items-center gap-4">
                            <div className="text-sm text-gray-400">
                                Readiness Check:{' '}
                                {canAdvance
                                    ? <span className="text-emerald-400 font-bold">ALL GATES CONFIRMED</span>
                                    : <span className="text-amber-400 font-bold">CONFIRM ALL 3 GATES TO ADVANCE</span>}
                            </div>
                            <Button
                                id="sched-advance-btn"
                                disabled={!canAdvance || saving}
                                onClick={() => syncSchedule(reqs, true)}
                                className={cn('flex items-center gap-2', !canAdvance && 'opacity-50 cursor-not-allowed')}
                            >
                                <span>{saving ? 'Saving…' : 'Confirm & Advance to Pre-Install'}</span>
                                <ChevronRightIcon className="w-5 h-5" />
                            </Button>
                        </div>
                    </Card>

                    <Card title="Installation Dispatch & Supplier PO Details">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">
                                    Target Install Date
                                </label>
                                <div className="relative">
                                    <input
                                        type="date"
                                        value={installDate}
                                        onChange={e => setInstallDate(e.target.value)}
                                        className="w-full bg-black/60 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white font-mono focus:border-[#ec028b] outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">
                                    Assigned Certified Crew
                                </label>
                                <select
                                    value={crewName}
                                    onChange={e => setCrewName(e.target.value)}
                                    className="w-full bg-black/60 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white focus:border-[#ec028b] outline-none"
                                >
                                    {CREW_OPTIONS.map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">
                                    Supplier PO Number
                                </label>
                                <input
                                    type="text"
                                    value={poNumber}
                                    onChange={e => setPoNumber(e.target.value)}
                                    placeholder="PO-SRS-2026-..."
                                    className="w-full bg-black/60 border border-gray-700 rounded-lg px-3 py-2 text-sm font-mono text-white focus:border-[#ec028b] outline-none"
                                />
                            </div>
                        </div>
                        <div className="mt-4 flex justify-end">
                            <Button variant="secondary" size="sm" disabled={saving} onClick={() => syncSchedule(reqs, false)}>
                                <CalendarIcon className="w-4 h-4 mr-1.5" />
                                Save
                            </Button>
                        </div>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card title="Project & Pizza Tracker Preview">
                        <p className="font-bold text-white mb-1">{project.name}</p>
                        <span className="text-xs bg-blue-900/30 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded">
                            {project.project_type || 'Residential'}
                        </span>
                        <div className="mt-4 space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-400">Current Stage</span>
                                <span className="text-white font-bold">{project.current_stage}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Scheduled Date</span>
                                <span className="text-cyan-400 font-mono">{installDate}</span>
                            </div>
                            {project.quote?.total && (
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Contract Value</span>
                                    <span className="text-[#ec028b] font-mono font-bold">${Number(project.quote.total).toLocaleString()}</span>
                                </div>
                            )}
                        </div>

                        <div className="mt-5 pt-4 border-t border-gray-800 space-y-2">
                            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">
                                Live Client Portal Sub-Steps
                            </p>
                            {[
                                { label: 'Municipal Permit Approved', done: reqs.permit },
                                { label: `Material PO (${poNumber})`, done: reqs.materials },
                                { label: `Crew Scheduled (${installDate})`, done: reqs.labor },
                            ].map(s => (
                                <div key={s.label} className="flex items-center gap-2 text-xs">
                                    <span className={cn('w-2.5 h-2.5 rounded-full', s.done ? 'bg-emerald-400 shadow-[0_0_6px_#34d399]' : 'bg-gray-700')} />
                                    <span className={s.done ? 'text-emerald-300 font-semibold' : 'text-gray-500'}>{s.label}</span>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

const SchedulePage: React.FC = () => (
    <ProjectStageLayout stageLabel="Schedule" stagePageId="E-30">
        {(project) => <ScheduleContent project={project} />}
    </ProjectStageLayout>
);

export default SchedulePage;
