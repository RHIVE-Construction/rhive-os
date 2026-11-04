import React, { useState, useEffect } from 'react';
import { ProjectStageLayout, PIPELINE } from '../components/ProjectStageLayout';
import Card from '../components/Card';
import Button from '../components/Button';
import { CheckIcon, PlusIcon, ChevronRightIcon, CheckCircleIcon } from '../components/icons';
import { projectService, userLogService } from '../lib/firebaseService';
import { useNavigation } from '../contexts/NavigationContext';
import { cn } from '../lib/utils';
import { calculateOsbDeckingAllowance } from '../lib/qosRules';

interface InstallPhase {
    id: string;
    label: string;
    done: boolean;
}

interface AwoItem {
    id: string;
    title: string;
    amount: number;
    status?: 'Approved' | 'Pending';
    createdAt: string;
}

interface IncidentItem {
    id: string;
    description: string;
    resolved: boolean;
    createdAt: string;
}

const DEFAULT_INSTALL_PHASES: InstallPhase[] = [
    { id: 'tearoff', label: 'Tear-off Complete', done: true },
    { id: 'decking', label: 'Decking Inspected & Re-Nailed', done: true },
    { id: 'underlayment', label: 'Synthetic Underlayment & Valley Ice Shield', done: false },
    { id: 'midroof', label: 'Mid-Roof / Dry-In Municipal Inspection', done: false },
    { id: 'system', label: 'Primary Roof System Installed', done: false },
    { id: 'cleanup', label: 'Final Perimeter Site & Magnet Cleanup', done: false },
];

const InstallContent: React.FC<{ project: any }> = ({ project }) => {
    const { setActivePageId } = useNavigation();

    const [phases, setPhases] = useState<InstallPhase[]>(
        Array.isArray(project?.install_progress) && project.install_progress.length > 0
            ? project.install_progress
            : DEFAULT_INSTALL_PHASES
    );
    const [photoNotes, setPhotoNotes] = useState<string[]>(
        Array.isArray(project?.install_photos) && project.install_photos.length > 0
            ? project.install_photos
            : ['Decking & Valley Ice Shield Verified', 'Ridge Vent & Flashing Detail']
    );
    const [newPhotoNote, setNewPhotoNote] = useState('');
    const [awos, setAwos] = useState<AwoItem[]>(Array.isArray(project?.awos) ? project.awos : []);
    const [awoTitle, setAwoTitle] = useState('');
    const [awoAmount, setAwoAmount] = useState('');

    // QOS 100 sq ft (3 sheets) Free 7/16" OSB Decking Calculator
    const [osbSheetsUsed, setOsbSheetsUsed] = useState<number>(Number(project?.osb_sheets_used ?? 3));
    const [isSteepDeck, setIsSteepDeck] = useState<boolean>(Boolean(project?.osb_is_steep));

    // Site / Resident Incident Log (from UNPHC / HOA real Drive cases)
    const [incidents, setIncidents] = useState<IncidentItem[]>(
        Array.isArray(project?.incident_log) ? project.incident_log : []
    );
    const [incidentText, setIncidentText] = useState('');

    const [saving, setSaving] = useState(false);
    const [banner, setBanner] = useState('');

    useEffect(() => {
        setPhases(
            Array.isArray(project?.install_progress) && project.install_progress.length > 0
                ? project.install_progress
                : DEFAULT_INSTALL_PHASES
        );
        setPhotoNotes(
            Array.isArray(project?.install_photos) && project.install_photos.length > 0
                ? project.install_photos
                : ['Decking & Valley Ice Shield Verified', 'Ridge Vent & Flashing Detail']
        );
        setAwos(Array.isArray(project?.awos) ? project.awos : []);
        setOsbSheetsUsed(Number(project?.osb_sheets_used ?? 3));
        setIsSteepDeck(Boolean(project?.osb_is_steep));
        setIncidents(Array.isArray(project?.incident_log) ? project.incident_log : []);
    }, [project?.id]);

    const doneCount = phases.filter((t) => t.done).length;
    const pct = phases.length > 0 ? Math.round((doneCount / phases.length) * 100) : 0;
    const awoTotal = awos.reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const baseContract = Number(project?.quote?.total || 0);
    const osbCalc = calculateOsbDeckingAllowance(osbSheetsUsed, isSteepDeck);

    const persistInstallState = async (
        nextPhases: InstallPhase[],
        nextPhotos: string[],
        nextAwos: AwoItem[],
        advance = false,
        nextIncidents = incidents,
        nextSheets = osbSheetsUsed,
        nextSteep = isSteepDeck
    ) => {
        if (!project?.id || saving) return;
        setSaving(true);
        setBanner('');
        try {
            const updates: Record<string, any> = {
                install_progress: nextPhases,
                install_photos: nextPhotos,
                awos: nextAwos,
                osb_sheets_used: nextSheets,
                osb_is_steep: nextSteep,
                incident_log: nextIncidents,
                pizza_tracker: advance
                    ? {
                          stage: 'Warranty Activation',
                          current_stage: 'Warranty Activation',
                          stageIndex: 7,
                          totalStages: PIPELINE.length,
                          subSteps: PIPELINE[7].defaultSubSteps.map((label, idx) => ({ label, done: idx === 0 })),
                          updatedAt: new Date().toISOString(),
                      }
                    : {
                          stage: 'Install',
                          current_stage: 'Install',
                          stageIndex: 6,
                          totalStages: PIPELINE.length,
                          subSteps: nextPhases.map((p) => ({ label: p.label, done: p.done })),
                          updatedAt: new Date().toISOString(),
                      },
                updated_at: new Date().toISOString(),
            };

            if (advance) {
                updates.current_stage = 'Warranty Activation';
            }

            await projectService.updateRecord(project.id, updates, project._source);
            await userLogService.logAction(
                advance ? 'STAGE_CHANGE' : 'EDIT_RECORD',
                advance
                    ? `${project.name || 'Project'} installation completed — moved to Warranty Activation`
                    : `Updated installation progress (${Math.round(
                          (nextPhases.filter((p) => p.done).length / Math.max(1, nextPhases.length)) * 100
                      )}%) for ${project.name || 'Project'}`,
                {
                    recordId: project.id,
                    recordName: project.name || 'Project',
                    collection: project._source || 'projects',
                    stage: advance ? 'Warranty Activation' : 'Install',
                }
            );

            if (advance) {
                setActivePageId('E-33');
            } else {
                setBanner('Installation progress, AWOs, and Client Pizza Tracker synced to Firebase.');
            }
        } finally {
            setSaving(false);
        }
    };

    const handleTogglePhase = (id: string) => {
        const next = phases.map((p) => (p.id === id ? { ...p, done: !p.done } : p));
        setPhases(next);
        persistInstallState(next, photoNotes, awos, false);
    };

    const handleAddPhotoNote = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPhotoNote.trim()) return;
        const nextPhotos = [...photoNotes, newPhotoNote.trim()];
        setPhotoNotes(nextPhotos);
        setNewPhotoNote('');
        persistInstallState(phases, nextPhotos, awos, false);
    };

    const handleCreateAwo = (e: React.FormEvent) => {
        e.preventDefault();
        if (!awoTitle.trim()) return;
        const nextAwos: AwoItem[] = [
            ...awos,
            {
                id: `awo-${Date.now()}`,
                title: awoTitle.trim(),
                amount: Number(awoAmount) || 0,
                status: 'Approved',
                createdAt: new Date().toISOString(),
            },
        ];
        setAwos(nextAwos);
        setAwoTitle('');
        setAwoAmount('');
        persistInstallState(phases, photoNotes, nextAwos, false);
    };

    const handleApplyOsbOverageToAwo = () => {
        if (osbCalc.totalCharge <= 0) {
            persistInstallState(phases, photoNotes, awos, false, incidents, osbSheetsUsed, isSteepDeck);
            return;
        }
        const label = `OSB Decking Overage: ${osbCalc.billableSheets} billable sheet(s) beyond 3 free${
            osbCalc.trailerFee > 0 ? ' + $250 Wood Dump Trailer' : ''
        }`;
        const filtered = awos.filter((a) => !a.title.startsWith('OSB Decking Overage:'));
        const nextAwos: AwoItem[] = [
            ...filtered,
            {
                id: `awo-osb-${Date.now()}`,
                title: label,
                amount: osbCalc.totalCharge,
                status: 'Approved',
                createdAt: new Date().toISOString(),
            },
        ];
        setAwos(nextAwos);
        persistInstallState(phases, photoNotes, nextAwos, false, incidents, osbSheetsUsed, isSteepDeck);
    };

    const handleAddIncident = (e: React.FormEvent) => {
        e.preventDefault();
        if (!incidentText.trim()) return;
        const nextIncidents: IncidentItem[] = [
            ...incidents,
            {
                id: `inc-${Date.now()}`,
                description: incidentText.trim(),
                resolved: false,
                createdAt: new Date().toISOString(),
            },
        ];
        setIncidents(nextIncidents);
        setIncidentText('');
        persistInstallState(phases, photoNotes, awos, false, nextIncidents);
    };

    const handleToggleIncident = (id: string) => {
        const nextIncidents = incidents.map((inc) =>
            inc.id === id ? { ...inc, resolved: !inc.resolved } : inc
        );
        setIncidents(nextIncidents);
        persistInstallState(phases, photoNotes, awos, false, nextIncidents);
    };

    return (
        <div className="p-6 md:p-8 space-y-6">
            {banner && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2">
                    <CheckCircleIcon className="w-4 h-4 flex-none" />
                    <span>{banner}</span>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card title="Installation Progress & Mid-Roof Inspection">
                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs text-gray-500 uppercase font-bold tracking-widest">
                                    Overall Crew Progress
                                </span>
                                <span className="text-[#ec028b] font-bold font-mono text-sm">{pct}%</span>
                            </div>
                            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-[#ec028b] to-pink-400 rounded-full transition-all duration-500"
                                    style={{ width: `${pct}%` }}
                                />
                            </div>
                        </div>

                        <div className="space-y-2.5">
                            {phases.map((task, idx) => (
                                <button
                                    key={task.id}
                                    id={`install-phase-${idx}`}
                                    type="button"
                                    onClick={() => handleTogglePhase(task.id)}
                                    className={cn(
                                        'w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition-all',
                                        task.done
                                            ? 'border-[#ec028b] bg-[#ec028b]/10 shadow-[0_0_15px_rgba(236,2,139,0.2)]'
                                            : 'border-gray-800 bg-gray-900/40 hover:border-gray-600'
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={cn(
                                                'w-5 h-5 rounded-full flex-none flex items-center justify-center border',
                                                task.done
                                                    ? 'bg-[#ec028b] border-[#ec028b] text-white'
                                                    : 'border-gray-700 bg-black'
                                            )}
                                        >
                                            {task.done && <CheckIcon className="w-3 h-3" />}
                                        </div>
                                        <span
                                            className={cn(
                                                'text-sm font-semibold',
                                                task.done ? 'text-white' : 'text-gray-400'
                                            )}
                                        >
                                            {task.label}
                                        </span>
                                    </div>
                                    <span
                                        className={cn(
                                            'text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded border',
                                            task.done
                                                ? 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10'
                                                : 'text-gray-400 border-gray-700 bg-black/50'
                                        )}
                                    >
                                        {task.done ? 'Complete' : 'Confirm'}
                                    </span>
                                </button>
                            ))}
                        </div>

                        <div className="mt-6 pt-5 border-t border-gray-800 flex justify-end">
                            <Button
                                id="install-advance-btn"
                                onClick={() => persistInstallState(phases, photoNotes, awos, true)}
                                disabled={saving}
                                className="flex items-center gap-2"
                            >
                                <span>{saving ? 'Saving…' : 'Confirm'}</span>
                                <ChevronRightIcon className="w-4 h-4" />
                            </Button>
                        </div>
                    </Card>

                    <Card title="Crew Field Photo Log">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                            {photoNotes.map((note, idx) => (
                                <div
                                    key={`${note}-${idx}`}
                                    className="p-3 bg-gray-900/60 rounded-xl border border-gray-800 flex items-center justify-between gap-2"
                                >
                                    <span className="text-xs text-gray-200 font-medium truncate">{note}</span>
                                    <span className="text-[10px] font-mono text-emerald-400 uppercase">Logged</span>
                                </div>
                            ))}
                        </div>
                        <form onSubmit={handleAddPhotoNote} className="flex gap-2">
                            <input
                                id="install-photo-note-input"
                                type="text"
                                value={newPhotoNote}
                                onChange={(e) => setNewPhotoNote(e.target.value)}
                                placeholder="Log crew photo milestone (e.g. Chimney cricket flashed)..."
                                className="flex-1 bg-black/60 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#ec028b]"
                            />
                            <Button id="install-add-photo-btn" type="submit" variant="secondary" size="sm">
                                Create
                            </Button>
                        </form>
                    </Card>

                    <Card title="Site & Resident Protection Log">
                        {incidents.length === 0 ? (
                            <p className="text-xs text-gray-500 mb-3">
                                Zero site or resident property incidents reported. Log any AC line, window screen, or
                                stucco item here for documented sign-off prior to closeout.
                            </p>
                        ) : (
                            <div className="space-y-2 mb-3">
                                {incidents.map((inc) => (
                                    <button
                                        key={inc.id}
                                        type="button"
                                        onClick={() => handleToggleIncident(inc.id)}
                                        className={cn(
                                            'w-full flex items-center justify-between p-3 rounded-xl border text-left text-xs transition-all',
                                            inc.resolved
                                                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                                                : 'bg-amber-500/10 border-amber-500/40 text-amber-200'
                                        )}
                                    >
                                        <span>{inc.description}</span>
                                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded border border-current">
                                            {inc.resolved ? 'Resolved' : 'Confirm'}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        )}
                        <form onSubmit={handleAddIncident} className="flex gap-2">
                            <input
                                id="install-incident-input"
                                type="text"
                                value={incidentText}
                                onChange={(e) => setIncidentText(e.target.value)}
                                placeholder="Log site item (e.g. Unit 4 patio screen re-splined by foreman)..."
                                className="flex-1 bg-black/60 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#ec028b]"
                            />
                            <Button id="install-add-incident-btn" type="submit" variant="secondary" size="sm">
                                Create
                            </Button>
                        </form>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card title="Production Summary">
                        <div className="space-y-3 text-sm">
                            <div>
                                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-0.5">
                                    Project
                                </p>
                                <p className="text-white font-bold">{project.name}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-0.5">
                                    Assigned Crew
                                </p>
                                <p className="text-gray-200">
                                    {project?.ops_schedule?.crewName || 'RHIVE Certified Crew'}
                                </p>
                            </div>
                            {baseContract > 0 && (
                                <div>
                                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-0.5">
                                        Base Contract
                                    </p>
                                    <p className="text-white font-mono font-bold">${baseContract.toLocaleString()}</p>
                                </div>
                            )}
                            {awoTotal > 0 && (
                                <div>
                                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-0.5">
                                        Approved AWOs
                                    </p>
                                    <p className="text-[#ec028b] font-mono font-bold">+${awoTotal.toLocaleString()}</p>
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* QOS 100 sq ft (3 sheets) Free OSB Decking Allowance Engine */}
                    <Card title='QOS 7/16" OSB Decking Allowance'>
                        <div className="space-y-3 text-xs">
                            <p className="text-gray-400">
                                First <strong className="text-emerald-400">3 sheets (100 sq ft)</strong> included at{' '}
                                <strong className="text-emerald-400">$0.00</strong>. Extra sheets bill at{' '}
                                {isSteepDeck ? '$79.50' : '$72.50'}/sheet (+$250 wood trailer if &gt;3 billable sheets).
                            </p>
                            <div className="flex items-center justify-between gap-2">
                                <label className="text-[10px] uppercase font-bold text-gray-400">
                                    Total Sheets Installed
                                </label>
                                <input
                                    id="install-osb-sheets-input"
                                    type="number"
                                    min="0"
                                    max="200"
                                    value={osbSheetsUsed}
                                    onChange={(e) => setOsbSheetsUsed(Math.max(0, Number(e.target.value) || 0))}
                                    className="w-24 bg-black/60 border border-gray-700 rounded-lg px-2.5 py-1.5 text-right font-mono text-white focus:border-[#ec028b] outline-none"
                                />
                            </div>
                            <button
                                id="install-osb-steep-toggle"
                                type="button"
                                onClick={() => setIsSteepDeck(!isSteepDeck)}
                                className={cn(
                                    'w-full px-3 py-2 rounded-lg border text-left font-bold transition-all',
                                    isSteepDeck
                                        ? 'bg-[#ec028b]/15 border-[#ec028b] text-white'
                                        : 'bg-black/40 border-gray-800 text-gray-400'
                                )}
                            >
                                Steep Pitch (&ge; 8/12): {isSteepDeck ? 'Active ($79.50/sheet)' : 'Standard ($72.50/sheet)'}
                            </button>

                            <div className="p-3 rounded-xl bg-black/50 border border-gray-800 space-y-1 font-mono">
                                <div className="flex justify-between text-gray-400">
                                    <span>Free Included:</span>
                                    <span className="text-emerald-400">{osbCalc.freeSheets} sheet(s) ($0)</span>
                                </div>
                                <div className="flex justify-between text-gray-400">
                                    <span>Billable Extra:</span>
                                    <span className="text-white">{osbCalc.billableSheets} sheet(s)</span>
                                </div>
                                {osbCalc.trailerFee > 0 && (
                                    <div className="flex justify-between text-amber-300">
                                        <span>Wood Dump Trailer:</span>
                                        <span>+$250.00</span>
                                    </div>
                                )}
                                <div className="flex justify-between pt-1 border-t border-gray-800 font-bold text-[#ec028b]">
                                    <span>Net Decking AWO:</span>
                                    <span>${osbCalc.totalCharge.toFixed(2)}</span>
                                </div>
                            </div>

                            <Button
                                id="install-apply-osb-awo-btn"
                                type="button"
                                variant="secondary"
                                size="sm"
                                onClick={handleApplyOsbOverageToAwo}
                                className="w-full"
                            >
                                Apply
                            </Button>
                        </div>
                    </Card>

                    <Card title="Additional Work Orders (AWO)">
                        {awos.length === 0 ? (
                            <p className="text-gray-500 text-xs mb-4">
                                No additional decking or wood replacement work orders logged.
                            </p>
                        ) : (
                            <div className="space-y-2 mb-4">
                                {awos.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center justify-between p-2.5 rounded-lg bg-gray-900/60 border border-gray-800 text-xs"
                                    >
                                        <span className="text-gray-200 font-medium truncate pr-2">{item.title}</span>
                                        <span className="text-[#ec028b] font-mono font-bold shrink-0">
                                            ${Number(item.amount || 0).toLocaleString()}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}

                        <form onSubmit={handleCreateAwo} className="space-y-2.5">
                            <input
                                id="install-awo-title-input"
                                type="text"
                                value={awoTitle}
                                onChange={(e) => setAwoTitle(e.target.value)}
                                placeholder="Fascia / Cricket / Skylight curb item"
                                className="w-full bg-black/60 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#ec028b]"
                            />
                            <input
                                id="install-awo-amount-input"
                                type="number"
                                min="0"
                                step="1"
                                value={awoAmount}
                                onChange={(e) => setAwoAmount(e.target.value)}
                                placeholder="Amount ($)"
                                className="w-full bg-black/60 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white font-mono placeholder-gray-500 focus:outline-none focus:border-[#ec028b]"
                            />
                            <Button
                                id="install-create-awo-btn"
                                type="submit"
                                variant="secondary"
                                className="w-full flex items-center justify-center gap-2"
                            >
                                <PlusIcon className="w-4 h-4" />
                                <span>Create</span>
                            </Button>
                        </form>
                    </Card>
                </div>
            </div>
        </div>
    );
};

const InstallPage: React.FC = () => (
    <ProjectStageLayout stageLabel="Install" stagePageId="E-32">
        {(project) => <InstallContent project={project} />}
    </ProjectStageLayout>
);

export default InstallPage;
