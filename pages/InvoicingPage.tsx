import React, { useState, useEffect } from 'react';
import { ProjectStageLayout, PIPELINE } from '../components/ProjectStageLayout';
import Card from '../components/Card';
import Button from '../components/Button';
import { EnvelopeIcon, CreditCardIcon, CheckCircleIcon, ChevronRightIcon, ShieldCheckIcon } from '../components/icons';
import { projectService, userLogService } from '../lib/firebaseService';
import { useNavigation } from '../contexts/NavigationContext';
import { cn } from '../lib/utils';
import {
    buildMilestonesForProject,
    resolvePaymentModel,
    PAYMENT_MODEL_LABELS,
    PaymentModelKey,
    QosMilestone,
} from '../lib/qosRules';

const MODEL_PILLS: Array<{ key: PaymentModelKey; short: string }> = [
    { key: 'retail_50_40_10', short: '50% / 40% / 10%' },
    { key: 'commercial_50_50', short: '50% / 50% Commercial' },
    { key: 'repair_100', short: '100% Repair' },
    { key: 'insurance_acv_rcv', short: 'ACV / RCV Insurance' },
    { key: 'msa_net_30', short: 'Net-30 MSA / PO' },
];

const InvoicingContent: React.FC<{ project: any }> = ({ project }) => {
    const { setActivePageId } = useNavigation();

    const baseTotal = Number(project?.quote?.total || 15000);
    const awoTotal = Array.isArray(project?.awos)
        ? project.awos.reduce((sum: number, a: any) => sum + Number(a.amount || 0), 0)
        : 0;
    const [creditAdjustment, setCreditAdjustment] = useState<number>(
        Number(project?.invoicing?.creditAdjustment || 0)
    );
    const [paymentModel, setPaymentModel] = useState<PaymentModelKey>(resolvePaymentModel(project));
    const [finalPermitSentToCarrier, setFinalPermitSentToCarrier] = useState<boolean>(
        Boolean(project?.invoicing?.finalPermitSentToCarrier)
    );

    const grossTotal = baseTotal + awoTotal;
    const contractTotal = Math.max(0, grossTotal - creditAdjustment);

    const [milestones, setMilestones] = useState<QosMilestone[]>(() =>
        buildMilestonesForProject({ ...project, payment_model: resolvePaymentModel(project) }, contractTotal)
    );
    const [saving, setSaving] = useState(false);
    const [banner, setBanner] = useState('');

    useEffect(() => {
        const resolved = resolvePaymentModel(project);
        setPaymentModel(resolved);
        const cred = Number(project?.invoicing?.creditAdjustment || 0);
        setCreditAdjustment(cred);
        setFinalPermitSentToCarrier(Boolean(project?.invoicing?.finalPermitSentToCarrier));
        const net = Math.max(0, baseTotal + awoTotal - cred);
        setMilestones(buildMilestonesForProject({ ...project, payment_model: resolved }, net));
    }, [project?.id]);

    const handleSwitchModel = (nextModel: PaymentModelKey) => {
        setPaymentModel(nextModel);
        const rebuilt = buildMilestonesForProject(
            { ...project, invoicing: undefined, payment_model: nextModel },
            contractTotal
        );
        setMilestones(rebuilt);
        persistMilestones(rebuilt, false, nextModel, creditAdjustment, finalPermitSentToCarrier);
    };

    const paidAmount = milestones.reduce(
        (sum, m) => sum + (m.paid ? Number(m.amount || Math.round(contractTotal * m.pct)) : 0),
        0
    );
    const remainingBalance = Math.max(0, contractTotal - paidAmount);
    const allPaid = remainingBalance === 0 || milestones.every((m) => m.paid);

    const persistMilestones = async (
        nextMilestones: QosMilestone[],
        advance = false,
        nextModel = paymentModel,
        nextCredit = creditAdjustment,
        nextCarrierPermit = finalPermitSentToCarrier
    ) => {
        if (!project?.id || saving) return;
        setSaving(true);
        setBanner('');
        try {
            const netContract = Math.max(0, grossTotal - nextCredit);
            const normalized = nextMilestones.map((m) => ({
                ...m,
                amount: m.pct > 0 ? Math.round(netContract * m.pct) : m.amount,
                paid_at: m.paid ? m.paid_at || new Date().toISOString() : undefined,
            }));
            const isFullyPaid = normalized.every((m) => m.paid);

            const updates: Record<string, any> = {
                payment_model: nextModel,
                warranty_activated: isFullyPaid,
                invoicing: {
                    payment_model: nextModel,
                    milestones: normalized,
                    contractTotal: netContract,
                    awoTotal,
                    creditAdjustment: nextCredit,
                    finalPermitSentToCarrier: nextCarrierPermit,
                    status: isFullyPaid ? 'paid' : 'pending',
                    updatedAt: new Date().toISOString(),
                },
                pizza_tracker: advance
                    ? {
                          stage: 'Completed',
                          current_stage: 'Completed',
                          stageIndex: 9,
                          totalStages: PIPELINE.length,
                          subSteps: PIPELINE[9].defaultSubSteps.map((label) => ({ label, done: true })),
                          updatedAt: new Date().toISOString(),
                      }
                    : {
                          stage: 'Invoicing',
                          current_stage: 'Invoicing',
                          stageIndex: 8,
                          totalStages: PIPELINE.length,
                          subSteps: normalized.map((m) => ({ label: m.label, done: m.paid })),
                          updatedAt: new Date().toISOString(),
                      },
                updated_at: new Date().toISOString(),
            };

            if (isFullyPaid) {
                updates.warranty_certificate = {
                    active: true,
                    issuedAt: project?.warranty_certificate?.issuedAt || new Date().toISOString(),
                    referenceCode: project?.job_number || project?.project_code || 'RHIVE-CERTIFIED',
                };
            }

            if (advance) {
                updates.current_stage = 'Completed';
            }

            await projectService.updateRecord(project.id, updates, project._source);
            await userLogService.logAction(
                advance ? 'STAGE_CHANGE' : 'EDIT_RECORD',
                advance
                    ? `${project.name || 'Project'} final balance cleared — moved to Completed & Master Warranty Unlocked`
                    : `Updated milestone invoice ledger (${PAYMENT_MODEL_LABELS[nextModel]}) for ${project.name || 'Project'}`,
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
                setBanner('Milestone Invoice Ledger & Master Warranty status synced to Firebase & Client Portal.');
            }
        } finally {
            setSaving(false);
        }
    };

    const handleToggleMilestone = (id: string) => {
        const next = milestones.map((m) => (m.id === id ? { ...m, paid: !m.paid } : m));
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
        setBanner('Invoice reminder logged and queued for Client Portal notification.');
    };

    const handleConfirmFinalPayment = () => {
        const next = milestones.map((m) => ({ ...m, paid: true }));
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

            <Card title={`Milestone Invoice Ledger — ${project.name}`}>
                {/* Polymorphic Payment Structure Bar */}
                <div className="mb-6 pb-4 border-b border-gray-800 flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">
                            Active Payment Structure
                        </p>
                        <p className="text-xs text-gray-300 font-semibold">{PAYMENT_MODEL_LABELS[paymentModel]}</p>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                        {MODEL_PILLS.map((pill) => (
                            <button
                                key={pill.key}
                                id={`invoice-model-${pill.key}`}
                                type="button"
                                onClick={() => handleSwitchModel(pill.key)}
                                className={cn(
                                    'px-2.5 py-1.5 rounded-lg text-[11px] font-bold border transition-all',
                                    paymentModel === pill.key
                                        ? 'bg-[#ec028b] border-[#ec028b] text-white shadow-[0_0_12px_rgba(236,2,139,0.3)]'
                                        : 'bg-black/50 border-gray-800 text-gray-400 hover:border-gray-600'
                                )}
                            >
                                {pill.short}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    <div className="text-center md:text-left flex flex-col justify-center space-y-4">
                        <div>
                            <p className="text-gray-400 text-xs uppercase tracking-widest mb-2 font-bold">
                                Remaining Balance Due
                            </p>
                            <p className="text-5xl font-black text-[#ec028b] tracking-tighter font-mono">
                                ${remainingBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </p>
                        </div>

                        <div className="flex flex-wrap justify-center md:justify-start gap-2">
                            <span
                                className={cn(
                                    'text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border',
                                    allPaid
                                        ? 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10'
                                        : 'text-amber-400 border-amber-500/40 bg-amber-500/10'
                                )}
                            >
                                {allPaid ? 'Paid in Full' : 'Balance Open'}
                            </span>

                            <span
                                className={cn(
                                    'text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border flex items-center gap-1.5',
                                    allPaid
                                        ? 'text-cyan-300 border-cyan-500/40 bg-cyan-500/10'
                                        : 'text-gray-400 border-gray-700 bg-gray-900'
                                )}
                            >
                                <ShieldCheckIcon className="w-3.5 h-3.5" />
                                {allPaid ? 'Master Warranty Unlocked' : 'Warranty Locked Until $0 Balance'}
                            </span>
                        </div>

                        {paymentModel === 'insurance_acv_rcv' && (
                            <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-between gap-3 text-left">
                                <div>
                                    <p className="text-xs font-bold text-blue-300">
                                        Final Permit &amp; Completion Packet Sent to Carrier
                                    </p>
                                    <p className="text-[11px] text-gray-400">
                                        Required by carrier to release Recoverable Depreciation (RCV) &amp; Supplements.
                                    </p>
                                </div>
                                <button
                                    id="invoice-carrier-permit-toggle"
                                    type="button"
                                    onClick={() => {
                                        const next = !finalPermitSentToCarrier;
                                        setFinalPermitSentToCarrier(next);
                                        persistMilestones(milestones, false, paymentModel, creditAdjustment, next);
                                    }}
                                    className={cn(
                                        'px-3 py-1.5 rounded-lg text-xs font-bold uppercase border shrink-0',
                                        finalPermitSentToCarrier
                                            ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                                            : 'bg-black/60 border-gray-700 text-gray-300'
                                    )}
                                >
                                    {finalPermitSentToCarrier ? 'Sent' : 'Confirm'}
                                </button>
                            </div>
                        )}

                        <div className="p-3.5 rounded-xl bg-gray-900/60 border border-gray-800 text-left space-y-2">
                            <label className="block text-[10px] text-gray-400 uppercase font-bold tracking-widest">
                                Material Return / Prior Tarp Mitigation Credit ($)
                            </label>
                            <div className="flex gap-2">
                                <input
                                    id="invoice-credit-input"
                                    type="number"
                                    min="0"
                                    step="25"
                                    value={creditAdjustment}
                                    onChange={(e) => setCreditAdjustment(Math.max(0, Number(e.target.value) || 0))}
                                    className="flex-1 bg-black/60 border border-gray-700 rounded-lg px-3 py-1.5 text-xs font-mono text-white focus:border-[#ec028b] outline-none"
                                />
                                <Button
                                    id="invoice-apply-credit-btn"
                                    type="button"
                                    variant="secondary"
                                    size="sm"
                                    onClick={() =>
                                        persistMilestones(
                                            milestones,
                                            false,
                                            paymentModel,
                                            creditAdjustment,
                                            finalPermitSentToCarrier
                                        )
                                    }
                                >
                                    Apply
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col justify-center space-y-3">
                        {milestones.map((m) => {
                            const amount =
                                m.pct > 0 ? Math.round(contractTotal * m.pct) : Number(m.amount || 0);
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
                                            ${amount.toLocaleString()} ({m.percent}%)
                                        </p>
                                    </div>
                                    <span
                                        className={cn(
                                            'text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded border',
                                            m.paid
                                                ? 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10'
                                                : 'text-gray-300 border-gray-700 bg-black/60'
                                        )}
                                    >
                                        {m.paid ? 'Paid' : 'Confirm'}
                                    </span>
                                </button>
                            );
                        })}

                        <div className="bg-black/50 p-4 rounded-xl border border-gray-800 space-y-2 text-xs">
                            <div className="flex justify-between">
                                <span className="text-gray-400 uppercase font-bold">
                                    Net Contract{awoTotal > 0 ? ' (incl. AWOs)' : ''}
                                </span>
                                <span className="text-white font-mono font-bold">${contractTotal.toLocaleString()}</span>
                            </div>
                            {creditAdjustment > 0 && (
                                <div className="flex justify-between text-cyan-400">
                                    <span className="uppercase font-bold">Applied Credits</span>
                                    <span className="font-mono font-bold">-${creditAdjustment.toLocaleString()}</span>
                                </div>
                            )}
                            <div className="flex justify-between">
                                <span className="text-gray-400 uppercase font-bold">Collected to Date</span>
                                <span className="text-emerald-400 font-mono font-bold">
                                    ${paidAmount.toLocaleString()}
                                </span>
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
                            <span>Confirm</span>
                        </Button>
                    )}
                    <Button
                        id="invoice-advance-btn"
                        onClick={() => {
                            const paidAll = milestones.map((m) => ({ ...m, paid: true }));
                            setMilestones(paidAll);
                            persistMilestones(paidAll, true);
                        }}
                        disabled={saving}
                        className="flex items-center justify-center gap-2"
                    >
                        <span>{saving ? 'Saving…' : 'Confirm'}</span>
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
