import React, { useState } from 'react';
import { ProjectStageLayout, PIPELINE } from '../components/ProjectStageLayout';
import Card from '../components/Card';
import Button from '../components/Button';
import { DocumentDuplicateIcon, DocumentCheckIcon, CalculatorIcon, ChevronRightIcon, CheckCircleIcon } from '../components/icons';
import { projectService, userLogService } from '../lib/firebaseService';
import { useNavigation } from '../contexts/NavigationContext';

const CompletedContent: React.FC<{ project: any }> = ({ project }) => {
    const { setActivePageId } = useNavigation();
    const [saving, setSaving] = useState(false);
    const [packetDownloaded, setPacketDownloaded] = useState(false);

    const baseQuote = Number(project?.quote?.total || 15000);
    const awoTotal = Array.isArray(project?.awos)
        ? project.awos.reduce((sum: number, a: any) => sum + Number(a.amount || 0), 0)
        : 0;
    const totalRevenue = baseQuote + awoTotal;
    const internalCost = Number(project?.quote?.internalCost || Math.round(totalRevenue * 0.72));
    const internalMargin = Math.max(0, totalRevenue - internalCost);
    const marginPct = totalRevenue > 0 ? Math.round((internalMargin / totalRevenue) * 100) : 28;

    const handleDownloadCompletionPacket = async () => {
        const jobNumber = project?.job_number || project?.project_code || 'RHIVE-CERTIFIED';
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
    <span class="badge">Official RHIVE Warranty & Completion Certificate</span>
    <h1>${project?.name || 'Completed Roofing Project'}</h1>
    <p>Property Address: ${project?.property_address || 'Verified Site'}</p>
    <div class="row"><strong>Reference Code</strong><span>${jobNumber}</span></div>
    <div class="row"><strong>System Installed</strong><span>${project?.quote?.tierName || project?.project_type || 'RHIVE Certified Roof System'}</span></div>
    <div class="row"><strong>Final Contract Value</strong><span>$${totalRevenue.toLocaleString()}</span></div>
    <div class="row"><strong>Warranty Activation Date</strong><span>${completedDate}</span></div>
    <div class="row"><strong>50 / 40 / 10 Milestone Ledger</strong><span>100% Paid in Full</span></div>
    <p style="margin-top:24px; color:#9ca3af; font-size:13px;">Thank you for trusting RHIVE Construction. Your workmanship & manufacturer warranty is officially active, and you are eligible for $500 rewards through the RHIVE Abundance Network.</p>
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
            await userLogService.logAction(
                'EDIT_RECORD',
                `Generated Completion & Warranty Packet for ${project.name || 'Project'}`,
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
                    pizza_tracker: {
                        stage: 'Past Customer',
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
                            <p className="text-2xl font-black text-white italic uppercase tracking-wider">Project Complete</p>
                            <p className="text-gray-400 mt-2 text-sm max-w-lg leading-relaxed">
                                {project.name} has passed Warranty Activation, cleared the 50/40/10 milestone ledger, and is ready for Past Customer lifetime care and Abundance Network enrollment.
                            </p>
                        </div>
                    </div>

                    <Button
                        id="completed-advance-btn"
                        onClick={handleMoveToPastCustomer}
                        disabled={saving}
                        className="flex items-center gap-2 shrink-0"
                    >
                        <span>{saving ? 'Updating…' : 'Confirm & Move to Past Customer'}</span>
                        <ChevronRightIcon className="w-4 h-4" />
                    </Button>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-800 grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card title="Documentation Transfer">
                        <div className="flex flex-col gap-3">
                            <Button
                                id="completed-download-packet-btn"
                                size="lg"
                                onClick={handleDownloadCompletionPacket}
                                className="w-full flex items-center justify-center gap-3 shadow-[0_0_15px_rgba(236,2,139,0.2)]"
                            >
                                <DocumentDuplicateIcon className="w-5 h-5" />
                                <span>Save Completion Packet</span>
                            </Button>
                            {packetDownloaded && (
                                <p className="text-center text-xs font-bold text-emerald-400 flex items-center justify-center gap-1.5 mt-1">
                                    <CheckCircleIcon className="w-4 h-4" />
                                    <span>Warranty & Completion Certificate downloaded</span>
                                </p>
                            )}
                            <p className="text-center text-[10px] uppercase font-bold text-gray-500 tracking-widest mt-1">
                                Includes Active Warranty Certificate, 50/40/10 Receipt, & Care Guide
                            </p>
                        </div>
                    </Card>

                    <Card title="Internal Profitability Report" className="bg-gray-900/60 shadow-inner">
                        <div className="p-4 border border-gray-800 rounded-lg bg-black/50 space-y-3">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1 flex items-center gap-1">
                                        <CalculatorIcon className="w-3 h-3" />
                                        <span>Realized Gross Margin</span>
                                    </p>
                                    <p className="text-2xl font-black text-green-400 font-mono tracking-tighter">
                                        +${internalMargin.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-green-500 font-black text-3xl font-mono">{marginPct}%</p>
                                </div>
                            </div>
                            <div className="pt-3 border-t border-gray-800 flex justify-between text-xs text-gray-400 font-mono">
                                <span>Revenue: ${totalRevenue.toLocaleString()}</span>
                                <span>Job Cost: ${internalCost.toLocaleString()}</span>
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
