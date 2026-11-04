import React, { useState, useEffect } from 'react';
import { ProjectStageLayout, PIPELINE } from '../components/ProjectStageLayout';
import Card from '../components/Card';
import Button from '../components/Button';
import { EnvelopeIcon, CreditCardIcon, CheckCircleIcon, ChevronRightIcon } from '../components/icons';
import { projectService, userLogService } from '../lib/firebaseService';
import { useNavigation } from '../contexts/NavigationContext';
import { cn } from '../lib/utils';

interface MilestoneRow {
    id: 'deposit_50' | 'completion_40' | 'warranty_10';
    label: string;
    pct: number;
    paid: boolean;
}

const DEFAULT_MILESTONES: MilestoneRow[] = [
    { id: 'deposit_50', label: '50% Material Deposit', pct: 0.5, paid: true },
    { id: 'completion_40', label: '40% Upon Roof Completion', pct: 0.4, paid: true },
    { id: 'warranty_10', label: '10% Upon Warranty Activation', pct: 0.1, paid: false },
];

const InvoicingContent: React.FC<{ project: any }> = ({ project }) => {
    const { setActivePageId } = useNavigation();

    const baseTotal = Number(project?.quote?.total || 15000);
    const awoTotal = Array.isArray(project?.awos)
        ? project.awos.reduce((sum: number, a: any) => sum + Number(a.amount || 0), 0)
        : 0;
    const contractTotal = baseTotal + awoTotal;

    const [milestones, setMilestones] = useState<MilestoneRow[]>(
        Array.isArray(project?.invoicing?.milestones) && project.invoicing.milestones.length === 3
            ? project.invoicing.milestones
            : DEFAULT_MILESTONES
    );
    const [saving, setSaving] = useState(false);
    const [banner, setBanner] = useState('');

    useEffect(() => {
        setMilestones(
            Array.isArray(project?.invoicing?.milestones) && project.invoicing.milestones.length === 3
                ? project.invoicing.milestones
                : DEFAULT_MILESTONES
        );
    }, [project?.id]);

    const paidAmount = milestones.reduce(
        (sum, m) => sum + (m.paid ? Math.round(contractTotal * m.pct) : 0),
        0
    );
    const remainingBalance = Math.max(0, contractTotal - paidAmount);
    const allPaid = remainingBalance === 0 || milestones.every(m => m.paid);

    const persistMilestones = async (nextMilestones: MilestoneRow[], advance = false) => {
        if (!project?.id || saving) return;
        setSaving(true);
        setBanner('');
        try {
            const isFullyPaid = nextMilestones.every(m => m.paid);
            const updates: Record<string, any> = {
                invoicing: {
                    milestones: nextMilestones,
                    contractTotal,
                    awoTotal,
                    status: isFullyPaid ? 'paid' : 'pending',
                    updatedAt: new Date().toISOString(),
                },
                pizza_tracker: advance
                    ? {
                        stage: 'Completed',
                        stageIndex: 9,
                        totalStages: PIPELINE.length,
                        subSteps: PIPELINE[9].defaultSubSteps.map((label) => ({ label, done: true })),
                        updatedAt: new Date().toISOString(),
                    }
                    : {
                        stage: 'Invoicing',
                        stageIndex: 8,
                        totalStages: PIPELINE.length,
                        subSteps: nextMilestones.map(m => ({ label: m.label, done: m.paid })),
                        updatedAt: new Date().toISOString(),
                    },
            };

            if (advance) {
                updates.current_stage = 'Completed';
            }

            await projectService.updateRecord(project.id, updates, project._source);
            await userLogService.logAction(
                advance ? 'STAGE_CHANGE' : 'EDIT_RECORD',
                advance
                    ? `${project.name || 'Project'} final balance cleared — moved to Completed`
                    : `Updated 50/40/10 invoice ledger for ${project.name || 'Project'}`,
                {
                    recordId: project.id,
                    recordName: project.name || 'Project',
                    collection: project._source || 'projects',
                    stage: advance ? 'Completed' : 'Invoicing',
                }
            );

            if (advance) {
                setActivePageId('E-36');
            } else {
                setBanner('50/40/10 Milestone Ledger saved to Firebase.');
            }
        } finally {
            setSaving(false);
        }
    };

    const handleToggleMilestone = (id: MilestoneRow['id']) => {
        const next = milestones.map(m => (m.id === id ? { ...m, paid: !m.paid } : m));
        setMilestones(next);
        persistMilestones(next, false);
    };

    const handleSendReminder = async () => {
        if (!project?.id) return;
        await userLogService.logAction(
            'EDIT_RECORD',
            `Sent final invoice payment link to ${project.name || 'Customer'}`,
            {
                recordId: project.id,
                recordName: project.name || 'Project',
                collection: project._source || 'projects',
                stage: 'Invoicing',
            }
        );
        setBanner('Invoice reminder logged and queued for customer portal notification.');
    };

    const handleConfirmFinalPayment = () => {
        const next = milestones.map(m => ({ ...m, paid: true }));
        setMilestones(next);
        persistMilestones(next, false);
    };

    return (
        <div className="p-6 md:p-8 space-y-6">
            {banner && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2">
                    <CheckCircleIcon className="w-4 h-4 flex-none" />
                    <span>{banner}</span>
                </div>
            )}

            <Card title={`50 / 40 / 10 Milestone Invoice — ${project.name}`}>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="text-center md:text-left flex flex-col justify-center">
                        <p className="text-gray-400 text-xs uppercase tracking-widest mb-2 font-bold">Remaining Balance Due</p>
                        <p className="text-5xl font-black text-[#ec028b] mb-4 tracking-tighter font-mono">
                            ${remainingBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </p>
                        <div className="flex justify-center md:justify-start">
                            <span className={cn(
                                'text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border',
                                allPaid
                                    ? 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10'
                                    : 'text-amber-400 border-amber-500/40 bg-amber-500/10'
                            )}>
                                {allPaid ? 'Paid in Full' : 'Balance Open'}
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col justify-center space-y-3">
                        {milestones.map((m) => {
                            const amount = Math.round(contractTotal * m.pct);
                            return (
                                <button
                                    key={m.id}
                                    id={`invoice-milestone-${m.id}`}
                                    type="button"
                                    onClick={() => handleToggleMilestone(m.id)}
                                    className={cn(
                                        'w-full flex items-center justify-between p-4 rounded-xl border text-left transition-all',
                                        m.paid
                                            ? 'border-[#ec028b] bg-[#ec028b]/10 shadow-[0_0_15px_rgba(236,2,139,0.2)]'
                                            : 'border-gray-800 bg-gray-900/60 hover:border-gray-600'
                                    )}
                                >
                                    <div>
                                        <p className={cn('text-sm font-bold', m.paid ? 'text-white' : 'text-gray-300')}>
                                            {m.label}
                                        </p>
                                        <p className="text-[11px] text-gray-400 font-mono mt-0.5">
                                            ${amount.toLocaleString()}
                                        </p>
                                    </div>
                                    <span className={cn(
                                        'text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded border',
                                        m.paid
                                            ? 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10'
                                            : 'text-gray-300 border-gray-700 bg-black/60'
                                    )}>
                                        {m.paid ? 'Paid' : 'Confirm'}
                                    </span>
                                </button>
                            );
                        })}

                        <div className="bg-black/50 p-4 rounded-xl border border-gray-800 space-y-2 text-xs">
                            <div className="flex justify-between">
                                <span className="text-gray-400 uppercase font-bold">Total Contract{awoTotal > 0 ? ' (incl. AWOs)' : ''}</span>
                                <span className="text-white font-mono font-bold">${contractTotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400 uppercase font-bold">Collected to Date</span>
                                <span className="text-emerald-400 font-mono font-bold">${paidAmount.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-800 flex flex-col sm:flex-row justify-end gap-3">
                    <Button
                        id="invoice-send-reminder-btn"
                        variant="secondary"
                        onClick={handleSendReminder}
                        className="flex items-center justify-center gap-2"
                    >
                        <EnvelopeIcon className="w-4 h-4" />
                        <span>Send</span>
                    </Button>
                    {!allPaid && (
                        <Button
                            id="invoice-confirm-payment-btn"
                            variant="secondary"
                            onClick={handleConfirmFinalPayment}
                            disabled={saving}
                            className="flex items-center justify-center gap-2"
                        >
                            <CreditCardIcon className="w-4 h-4" />
                            <span>Confirm Payment</span>
                        </Button>
                    )}
                    <Button
                        id="invoice-advance-btn"
                        onClick={() => {
                            const paidAll = milestones.map(m => ({ ...m, paid: true }));
                            setMilestones(paidAll);
                            persistMilestones(paidAll, true);
                        }}
                        disabled={saving}
                        className="flex items-center justify-center gap-2"
                    >
                        <span>{saving ? 'Saving…' : 'Confirm & Complete Project'}</span>
                        <ChevronRightIcon className="w-4 h-4" />
                    </Button>
                </div>
            </Card>
        </div>
    );
};

const InvoicingPage: React.FC = () => (
    <ProjectStageLayout stageLabel="Invoicing" stagePageId="E-34">
        {(project) => <InvoicingContent project={project} />}
    </ProjectStageLayout>
);

export default InvoicingPage;
