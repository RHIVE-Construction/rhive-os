import React, { useState } from 'react';
import { ProjectStageLayout, PIPELINE } from '../components/ProjectStageLayout';
import Card from '../components/Card';
import Button from '../components/Button';
import { DocumentDuplicateIcon, DocumentCheckIcon, CalculatorIcon, ChevronRightIcon, CheckCircleIcon, ShieldCheckIcon } from '../components/icons';
import { projectService, userLogService } from '../lib/firebaseService';
import { useNavigation } from '../contexts/NavigationContext';
import { calculateDualMathFromRetailOrItems, PAYMENT_MODEL_LABELS, resolvePaymentModel } from '../lib/qosRules';
import { cn } from '../lib/utils';

const CompletedContent: React.FC<{ project: any }> = ({ project }) => {
    const { setActivePageId } = useNavigation();
    const [saving, setSaving] = useState(false);
    const [packetDownloaded, setPacketDownloaded] = useState(false);
    const [govCloseout, setGovCloseout] = useState({
        crwForm: Boolean(project?.gov_closeout?.crwForm ?? true),
        roofHistory: Boolean(project?.gov_closeout?.roofHistory ?? true),
        omManual: Boolean(project?.gov_closeout?.omManual ?? true),
    });

    const baseQuote = Number(project?.quote?.total || 15000);
    const awoTotal = Array.isArray(project?.awos)
        ? project.awos.reduce((sum: number, a: any) => sum + Number(a.amount || 0), 0)
        : 0;
    const creditAdj = Number(project?.invoicing?.creditAdjustment || 0);
    const totalRevenue = Math.max(0, baseQuote + awoTotal - creditAdj);

    // Admin-only Dual-Math Cost Floor (separated from customer-visible quote)
    const dualMath = calculateDualMathFromRetailOrItems(
        [{ name: project?.name || 'Project', price: totalRevenue }],
        project?.costs
    );
    const internalCost = dualMath.totalCost;
    const internalMargin = dualMath.grossProfit;
    const marginPct = Math.round(dualMath.marginPct);

    const isPaidInFull =
        project?.invoicing?.status === 'paid' ||
        (Array.isArray(project?.invoicing?.milestones) &&
            project.invoicing.milestones.length > 0 &&
            project.invoicing.milestones.every((m: any) => m.paid));

    const isGovernment = String(project?.project_type || '').toLowerCase() === 'government';
    const paymentModel = resolvePaymentModel(project);
    const jobNumber = project?.job_number || project?.project_code || 'RHIVE-CERTIFIED';

    const handleSettleBalanceNow = async () => {
        if (!project?.id || saving) return;
        setSaving(true);
        try {
            await projectService.updateRecord(
                project.id,
                {
                    warranty_activated: true,
                    invoicing: {
                        ...(project.invoicing || {}),
                        status: 'paid',
                        updatedAt: new Date().toISOString(),
                    },
                    warranty_certificate: {
                        active: true,
                        issuedAt: new Date().toISOString(),
                        referenceCode: jobNumber,
                    },
                },
                project._source
            );
            await userLogService.logAction(
                'EDIT_RECORD',
                `Confirmed Paid in Full & unlocked Master Warranty for ${project.name || 'Project'}`,
                {
                    recordId: project.id,
                    recordName: project.name || 'Project',
                    collection: project._source || 'projects',
                    stage: 'Completed',
                }
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDownloadCompletionPacket = async () => {
        const completedDate = new Date().toLocaleDateString();
        const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>RHIVE Construction — Warranty & Completion Packet (${project?.name || 'Project'})</title>
<style>
  body { font-family: Arial, sans-serif; background: #0a0a0a; color: #f3f4f6; padding: 40px; }
  .box { max-width: 720px; margin: 0 auto; border: 2px solid #ec028b; border-radius: 16px; padding: 32px; background: #111827; }
  .badge { display: inline-block; padding: 4px 12px; background: rgba(236,2,139,0.15); color: #ec028b; font-weight: bold; border-radius: 999px; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; }
  .row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #374151; }
</style>
</head>
<body>
  <div class="box">
    <span class="badge">Official RHIVE Master Warranty & Completion Certificate</span>
    <h1>${project?.name || 'Completed Roofing Project'}</h1>
    <p>Property Address: ${project?.property_address || 'Verified Site'}</p>
    <div class="row"><strong>Reference Code</strong><span>${jobNumber}</span></div>
    <div class="row"><strong>System Installed</strong><span>${project?.quote?.tierName || project?.project_type || 'RHIVE Certified Roof System'}</span></div>
    <div class="row"><strong>Color Selection</strong><span>${project?.color_lock || 'Verified Standard'}</span></div>
    <div class="row"><strong>Final Contract Value</strong><span>$${totalRevenue.toLocaleString()}</span></div>
    <div class="row"><strong>Payment Structure</strong><span>${PAYMENT_MODEL_LABELS[paymentModel]} (Paid in Full)</span></div>
    <div class="row"><strong>Warranty Activation Date</strong><span>${completedDate}</span></div>
    <p style="margin-top:24px; color:#9ca3af; font-size:13px;">Thank you for trusting RHIVE Construction. Your workmanship & manufacturer warranty is officially active (including 30-day ownership transfer eligibility for $150), and you are eligible for $500 rewards through the RHIVE Abundance Network.</p>
  </div>
</body>
</html>`;

        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `RHIVE-Completion-Packet-${(project?.name || 'Project').replace(/[^a-z0-9]+/gi, '-')}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setPacketDownloaded(true);

        if (project?.id) {
            await projectService.updateRecord(
                project.id,
                {
                    warranty_certificate: {
                        active: true,
                        issuedAt: project?.warranty_certificate?.issuedAt || new Date().toISOString(),
                        referenceCode: jobNumber,
                    },
                },
                project._source
            );
            await userLogService.logAction(
                'EDIT_RECORD',
                `Generated Completion & Master Warranty Packet for ${project.name || 'Project'}`,
                {
                    recordId: project.id,
                    recordName: project.name || 'Project',
                    collection: project._source || 'projects',
                    stage: 'Completed',
                }
            );
        }
    };

    const handleMoveToPastCustomer = async () => {
        if (!project?.id || saving) return;
        setSaving(true);
        try {
            await projectService.updateRecord(
                project.id,
                {
                    current_stage: 'Past Customer',
                    completed_at: project.completed_at || new Date().toISOString(),
                    gov_closeout: isGovernment ? govCloseout : undefined,
                    warranty_certificate: {
                        active: true,
                        issuedAt: project?.warranty_certificate?.issuedAt || new Date().toISOString(),
                        referenceCode: jobNumber,
                    },
                    pizza_tracker: {
                        stage: 'Past Customer',
                        current_stage: 'Past Customer',
                        stageIndex: 10,
                        totalStages: PIPELINE.length,
                        subSteps: PIPELINE[10].defaultSubSteps.map((label) => ({ label, done: true })),
                        updatedAt: new Date().toISOString(),
                    },
                },
                project._source
            );
            await userLogService.logAction(
                'STAGE_CHANGE',
                `${project.name || 'Project'} archived to Past Customer & Abundance Network`,
                {
                    recordId: project.id,
                    recordName: project.name || 'Project',
                    collection: project._source || 'projects',
                    stage: 'Past Customer',
                }
            );
            setActivePageId('E-37');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="p-6 md:p-8 space-y-6">
            <Card title={`Project Conclusion: ${project.name}`}>
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-4">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="flex-none w-20 h-20 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center">
                            <DocumentCheckIcon className="w-10 h-10 text-green-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-black text-white italic uppercase tracking-wider">
                                Project Complete
                            </p>
                            <p className="text-gray-400 mt-2 text-sm max-w-lg leading-relaxed">
                                {project.name} has completed technical QC, settled its milestone ledger, and unlocked
                                lifetime Past Customer care + $500 Abundance Network rewards.
                            </p>
                        </div>
                    </div>

                    <Button
                        id="completed-advance-btn"
                        onClick={handleMoveToPastCustomer}
                        disabled={saving}
                        className="flex items-center gap-2 shrink-0"
                    >
                        <span>{saving ? 'Updating…' : 'Confirm'}</span>
                        <ChevronRightIcon className="w-4 h-4" />
                    </Button>
                </div>

                {!isPaidInFull && (
                    <div className="mt-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2 text-xs text-amber-200">
                            <ShieldCheckIcon className="w-4 h-4 text-amber-400" />
                            <span>
                                Master Warranty Certificate requires <strong>Paid in Full ($0.00 balance)</strong>{' '}
                                confirmation before external release.
                            </span>
                        </div>
                        <Button
                            id="completed-settle-balance-btn"
                            variant="secondary"
                            size="sm"
                            disabled={saving}
                            onClick={handleSettleBalanceNow}
                        >
                            Confirm
                        </Button>
                    </div>
                )}

                {isGovernment && (
                    <div className="mt-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/30 space-y-3">
                        <p className="text-xs font-bold uppercase tracking-widest text-blue-300">
                            DFCM / Government Statutory Closeout Submittals
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                            {(
                                [
                                    { key: 'crwForm', label: 'DFCM CRWform Executed' },
                                    { key: 'roofHistory', label: 'Facility Roof History Filed' },
                                    { key: 'omManual', label: '20-Yr NDL O&M Manual Delivered' },
                                ] as const
                            ).map((item) => (
                                <button
                                    key={item.key}
                                    type="button"
                                    onClick={() =>
                                        setGovCloseout((prev) => ({ ...prev, [item.key]: !prev[item.key] }))
                                    }
                                    className={cn(
                                        'p-3 rounded-lg border text-xs font-bold text-left transition-all',
                                        govCloseout[item.key]
                                            ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                                            : 'bg-black/50 border-gray-700 text-gray-400'
                                    )}
                                >
                                    {govCloseout[item.key] ? '✓ ' : ''}
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <div className="mt-8 pt-6 border-t border-gray-800 grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card title="Master Warranty & Documentation Transfer">
                        <div className="flex flex-col gap-3">
                            <Button
                                id="completed-download-packet-btn"
                                size="lg"
                                disabled={!isPaidInFull}
                                onClick={handleDownloadCompletionPacket}
                                className={cn(
                                    'w-full flex items-center justify-center gap-3 shadow-[0_0_15px_rgba(236,2,139,0.2)]',
                                    !isPaidInFull && 'opacity-50 cursor-not-allowed'
                                )}
                            >
                                <DocumentDuplicateIcon className="w-5 h-5" />
                                <span>Save</span>
                            </Button>
                            {packetDownloaded && (
                                <p className="text-center text-xs font-bold text-emerald-400 flex items-center justify-center gap-1.5 mt-1">
                                    <CheckCircleIcon className="w-4 h-4" />
                                    <span>Master Warranty &amp; Completion Certificate downloaded</span>
                                </p>
                            )}
                            <p className="text-center text-[10px] uppercase font-bold text-gray-500 tracking-widest mt-1">
                                Includes Active Master Warranty ({jobNumber}), Paid-in-Full Receipt, &amp; Care Guide
                            </p>
                        </div>
                    </Card>

                    <Card title="Internal Profitability Report (Admin Only)" className="bg-gray-900/60 shadow-inner">
                        <div className="p-4 border border-gray-800 rounded-lg bg-black/50 space-y-3">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1 flex items-center gap-1">
                                        <CalculatorIcon className="w-3 h-3" />
                                        <span>Realized Gross Profit</span>
                                    </p>
                                    <p className="text-2xl font-black text-green-400 font-mono tracking-tighter">
                                        +${internalMargin.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-green-500 font-black text-3xl font-mono">{marginPct}%</p>
                                </div>
                            </div>
                            <div className="pt-3 border-t border-gray-800 grid grid-cols-3 gap-2 text-[11px] text-gray-400 font-mono">
                                <span>Rev: ${totalRevenue.toLocaleString()}</span>
                                <span>Mat/Lab: ${(dualMath.materials + dualMath.labor).toLocaleString()}</span>
                                <span>Floor: ${internalCost.toLocaleString()}</span>
                            </div>
                        </div>
                    </Card>
                </div>
            </Card>
        </div>
    );
};

const CompletedPage: React.FC = () => (
    <ProjectStageLayout stageLabel="Completed" stagePageId="E-36">
        {(project) => <CompletedContent project={project} />}
    </ProjectStageLayout>
);

export default CompletedPage;
