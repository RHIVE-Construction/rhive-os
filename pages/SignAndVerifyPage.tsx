import React, { useState, useRef, useCallback, useEffect } from 'react';
import { ProjectStageLayout, PIPELINE } from '../components/ProjectStageLayout';
import Card from '../components/Card';
import Button from '../components/Button';
import { useMockDB } from '../contexts/MockDatabaseContext';
import { useNavigation } from '../contexts/NavigationContext';
import {
    DocumentCheckIcon,
    PencilSquareIcon,
    ClockIcon,
    ArrowUpTrayIcon,
    EnvelopeIcon,
    CheckCircleIcon,
    ShieldCheckIcon,
    DownloadIcon,
    XIcon,
    DocumentTextIcon,
    ChevronRightIcon,
} from '../components/icons';
import { db } from '../lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { projectService, userLogService } from '../lib/firebaseService';
import { cn } from '../lib/utils';
import { resolvePaymentModel, buildMilestonesForProject, PAYMENT_MODEL_LABELS } from '../lib/qosRules';

interface FileUploadZoneProps {
    id: string;
    label: string;
    placeholder: string;
    accept?: string;
    file: File | null;
    persistedName?: string;
    onFile: (f: File | null) => void;
}

const FileUploadZone: React.FC<FileUploadZoneProps> = ({
    id, label, placeholder, accept = '.pdf,.jpg,.jpeg,.png', file, persistedName, onFile,
}) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [dragOver, setDragOver] = useState(false);

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragOver(false);
        const dropped = e.dataTransfer.files[0];
        if (dropped) onFile(dropped);
    }, [onFile]);

    const activeName = file?.name || persistedName || '';

    return (
        <div className="space-y-2">
            <label htmlFor={id} className="block text-xs font-bold uppercase tracking-widest text-gray-400">
                {label}
            </label>
            <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
                className={cn(
                    'relative cursor-pointer rounded-xl border-2 border-dashed p-6 flex flex-col items-center justify-center gap-3 transition-all duration-200',
                    dragOver
                        ? 'border-[#ec028b] bg-[#ec028b]/10 shadow-[0_0_20px_rgba(236,2,139,0.2)]'
                        : activeName
                        ? 'border-emerald-500/60 bg-emerald-500/5'
                        : 'border-gray-700 bg-gray-900/40 hover:border-[#ec028b]/50 hover:bg-[#ec028b]/5'
                )}
            >
                <input
                    ref={inputRef}
                    id={id}
                    type="file"
                    accept={accept}
                    onChange={(e) => onFile(e.target.files?.[0] ?? null)}
                    className="hidden"
                    aria-label={label}
                />
                {activeName ? (
                    <>
                        <CheckCircleIcon className="w-8 h-8 text-emerald-400" />
                        <div className="text-center">
                            <p className="text-emerald-400 font-bold text-sm truncate max-w-[220px]">{activeName}</p>
                            <p className="text-gray-500 text-xs mt-0.5">
                                {file ? `${(file.size / 1024).toFixed(1)} KB — click to replace` : 'Saved on project — click to replace'}
                            </p>
                        </div>
                    </>
                ) : (
                    <>
                        <ArrowUpTrayIcon className="w-8 h-8 text-gray-600" />
                        <div className="text-center">
                            <p className="text-gray-400 text-sm font-semibold">{placeholder}</p>
                            <p className="text-gray-600 text-xs mt-1">Drag &amp; drop or click · PDF, JPG, PNG</p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

const StatusBadge: React.FC<{ ready: boolean; label?: string }> = ({ ready, label }) => (
    <span className={cn(
        'text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded border',
        ready
            ? 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10'
            : 'text-amber-400 border-amber-500/40 bg-amber-500/10'
    )}>
        {label ?? (ready ? 'Received' : 'Pending')}
    </span>
);

interface PermitModalProps {
    url: string;
    fileName: string;
    onClose: () => void;
}

const PermitModal: React.FC<PermitModalProps> = ({ url, fileName, onClose }) => {
    const isImage = /\.(jpg|jpeg|png|gif|webp)(\?|$)/i.test(url) || /\.(jpg|jpeg|png|gif|webp)$/i.test(fileName);
    const isPdf = /\.(pdf)(\?|$)/i.test(url) || /\.pdf$/i.test(fileName);

    const handleDownload = () => {
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName || 'purchase-permit';
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={onClose}>
            <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col bg-gray-950 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-[#ec028b]/15 border border-[#ec028b]/30 flex items-center justify-center flex-none">
                            <DocumentTextIcon className="w-5 h-5 text-[#ec028b]" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-0.5">
                                <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-[#ec028b]/15 border border-[#ec028b]/30 text-[#ec028b]">Purchase Permit</span>
                            </div>
                            <p className="text-white font-semibold text-sm truncate max-w-[280px]">{fileName}</p>
                            <p className="text-gray-600 text-xs">Uploaded by customer</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            id="sv-permit-download-btn"
                            onClick={handleDownload}
                            className="flex items-center gap-2 px-4 py-2 bg-[#ec028b]/10 border border-[#ec028b]/30 text-[#ec028b] rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-[#ec028b]/20 transition-all"
                            aria-label="Download permit document">
                            <DownloadIcon className="w-3.5 h-3.5" /> Download
                        </button>
                        <button
                            id="sv-permit-close-btn"
                            onClick={onClose}
                            className="p-2 text-gray-500 hover:text-white border border-gray-700 rounded-lg transition-colors"
                            aria-label="Close modal">
                            <XIcon className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-auto flex items-center justify-center p-6 bg-black/40">
                    {isImage ? (
                        <img src={url} alt="Purchase Permit" className="max-w-full max-h-[65vh] object-contain rounded-lg border border-gray-800" />
                    ) : isPdf ? (
                        <iframe src={url} title="Purchase Permit PDF" className="w-full h-[65vh] rounded-lg border border-gray-800 bg-white" />
                    ) : (
                        <div className="flex flex-col items-center gap-4 text-center py-12">
                            <DocumentTextIcon className="w-16 h-16 text-gray-600" />
                            <p className="text-gray-400 text-sm">Preview unavailable for this file type.</p>
                            <button
                                id="sv-permit-fallback-download-btn"
                                onClick={handleDownload}
                                className="flex items-center gap-2 px-6 py-3 bg-[#ec028b] text-white rounded-xl font-bold hover:bg-[#d4017d] transition-all">
                                <DownloadIcon className="w-4 h-4" /> Save
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const SignAndVerifyContent: React.FC<{ project: any }> = ({ project }) => {
    const { currentUser } = useMockDB();
    const { setActivePageId } = useNavigation();
    const isSuperAdmin = currentUser?.role === 'Super Admin' || currentUser?.role === 'Admin';

    const [policyFile, setPolicyFile] = useState<File | null>(null);
    const [scopeFile, setScopeFile] = useState<File | null>(null);
    const [sending, setSending] = useState(false);
    const [linkSent, setLinkSent] = useState(false);
    const [emailQueued, setEmailQueued] = useState<boolean | null>(null);
    const [generatedLink, setGeneratedLink] = useState<string>('');
    const [copyDone, setCopyDone] = useState(false);
    const [saveError, setSaveError] = useState('');
    const [actionBanner, setActionBanner] = useState('');

    const [firestoreData, setFirestoreData] = useState<any>(null);
    const [permitModalOpen, setPermitModalOpen] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const [permitVerified, setPermitVerified] = useState(false);
    const [depositConfirmed, setDepositConfirmed] = useState(false);
    const [contractSigned, setContractSigned] = useState(false);
    const [advancing, setAdvancing] = useState(false);

    const [emailTo, setEmailTo] = useState<string>('');

    useEffect(() => {
        if (!project?.id) return;
        const colPath = project._source === 'leads' ? 'leads' : project._source === 'deals' ? 'deals' : 'projects';
        const unsub = onSnapshot(doc(db, colPath, project.id), (snap) => {
            if (snap.exists()) {
                const data = snap.data();
                setFirestoreData(data);
                setPermitVerified(!!data?.purchase_permit_verified);
                setDepositConfirmed(!!data?.deposit_confirmed);
                setContractSigned(!!data?.contract_signed || !!data?.sign_verify_customer_data?.agreed_to_terms);
                if (data?.sign_verify_link) {
                    setGeneratedLink(data.sign_verify_link);
                    setLinkSent(true);
                }
            }
        });
        return () => unsub();
    }, [project?.id, project?._source]);

    const customerData = firestoreData?.sign_verify_customer_data;
    const permitUrl = firestoreData?.purchase_permit_url || '';
    const permitFileName = firestoreData?.purchase_permit_file_name || 'purchase-permit';
    const isPermitImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(permitFileName);
    const hasPermit = !!permitUrl;

    const customerEmail =
        project?.contact_email ||
        project?.contact?.email ||
        project?.contacts?.[0]?.email ||
        project?.customer_email ||
        project?.email ||
        project?.insurance?.claimant_email ||
        project?.billing?.email ||
        '';

    const customerName = (() => {
        if (project?.contact?.first_name || project?.contact?.last_name) {
            return `${project.contact.first_name || ''} ${project.contact.last_name || ''}`.trim();
        }
        if (project?.contacts?.[0]?.name) return project.contacts[0].name;
        if (project?.contact_name) return project.contact_name;
        if (project?.firstName || project?.lastName) {
            return `${project.firstName || ''} ${project.lastName || ''}`.trim();
        }
        return project?.name || 'Customer';
    })();

    useEffect(() => {
        if (customerEmail && !emailTo) setEmailTo(customerEmail);
    }, [customerEmail]);

    const paymentModel = resolvePaymentModel({ ...project, ...firestoreData });
    const isInsuranceFlow = paymentModel === 'insurance_acv_rcv';
    const isRepairFlow = paymentModel === 'repair_100';
    const isMsaFlow = paymentModel === 'msa_net_30';

    const quoteTotal = Number(project?.quote?.total || firestoreData?.quote?.total || 0);
    const milestones = buildMilestonesForProject({ ...project, ...firestoreData, payment_model: paymentModel });
    const firstMilestone = milestones[0] || { label: 'Initial Deposit', amount: Math.round(quoteTotal * 0.5) };
    const requiredMaterialDeposit = firstMilestone.amount;

    const [shingleColorLock, setShingleColorLock] = useState<string>(project?.color_lock || 'Onyx Black');
    const [permitResponsibility, setPermitResponsibility] = useState<'rhive_pulled' | 'client_pulled' | 'not_required'>(
        project?.permit_responsibility || (isRepairFlow ? 'not_required' : 'rhive_pulled')
    );

    useEffect(() => {
        if (firestoreData?.color_lock) setShingleColorLock(firestoreData.color_lock);
        if (firestoreData?.permit_responsibility) setPermitResponsibility(firestoreData.permit_responsibility);
    }, [firestoreData?.color_lock, firestoreData?.permit_responsibility]);

    const syncSignVerifyPizzaTracker = (overrides: { link?: boolean; signed?: boolean; deposit?: boolean }) => ({
        stage: 'Sign & Verify',
        stageIndex: 3,
        totalStages: PIPELINE.length,
        subSteps: [
            { label: 'Agreement Sent', done: overrides.link ?? linkSent },
            { label: 'Signature & Color Specs Verified', done: overrides.signed ?? contractSigned },
            { label: isMsaFlow ? 'PO / Notice to Proceed Confirmed' : `${firstMilestone.label} Confirmed`, done: overrides.deposit ?? depositConfirmed },
        ],
        updatedAt: new Date().toISOString(),
    });

    const handleFileSelect = async (kind: 'policy' | 'scope', file: File | null) => {
        if (kind === 'policy') setPolicyFile(file);
        else setScopeFile(file);
        if (!file || !project?.id) return;

        const field = kind === 'policy' ? 'insurance_policy_file_name' : 'scope_of_work_file_name';
        await projectService.updateRecord(project.id, { [field]: file.name }, project._source);
        await userLogService.logAction(
            'EDIT_RECORD',
            `Attached ${kind === 'policy' ? 'Insurance Policy' : 'Scope of Work'} file (${file.name}) for ${project.name || 'Project'}`,
            {
                recordId: project.id,
                recordName: project.name || 'Project',
                collection: project._source || 'projects',
                stage: 'Sign & Verify',
                changes: [field],
            }
        );
    };

    const handleSendLink = async () => {
        if (sending || !project?.id) return;
        setSending(true);
        setSaveError('');
        try {
            const link = `${window.location.origin}/?page=CUSTOMER-SIGN-VERIFY&token=${project.id}`;
            setGeneratedLink(link);
            await projectService.updateRecord(
                project.id,
                {
                    sign_verify_link: link,
                    sign_verify_sent_at: new Date().toISOString(),
                    sign_verify_status: 'link_sent',
                    pizza_tracker: syncSignVerifyPizzaTracker({ link: true }),
                },
                project._source
            );

            await userLogService.logAction(
                'EDIT_RECORD',
                `Sent Sign & Verify portal link for ${project.name || 'Project'}`,
                {
                    recordId: project.id,
                    recordName: project.name || 'Project',
                    collection: project._source || 'projects',
                    stage: 'Sign & Verify',
                    changes: ['sign_verify_link'],
                }
            );

            try {
                const fnUrl = `https://us-central1-rhive-os.cloudfunctions.net/sendSignVerifyEmail`;
                const fnRes = await fetch(fnUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        projectId: project.id,
                        customerEmail: emailTo || customerEmail,
                        customerName,
                        projectName: project.name || 'Your Project',
                        link,
                    }),
                });
                const fnData = await fnRes.json().catch(() => ({}));
                setEmailQueued(fnData.emailSent === true);
            } catch {
                setEmailQueued(false);
            }

            setLinkSent(true);
        } catch {
            setSaveError('Failed to generate link. Please try again.');
        } finally {
            setSending(false);
        }
    };

    const handleVerifyPermit = async () => {
        if (verifying || permitVerified || !project?.id) return;
        setVerifying(true);
        try {
            await projectService.updateRecord(
                project.id,
                {
                    purchase_permit_verified: true,
                    purchase_permit_verified_by: currentUser?.name || currentUser?.email || 'Super Admin',
                    purchase_permit_verified_at: new Date().toISOString(),
                },
                project._source
            );
            await userLogService.logAction(
                'EDIT_RECORD',
                `Verified Purchase Permit for ${project.name || 'Project'}`,
                {
                    recordId: project.id,
                    recordName: project.name || 'Project',
                    collection: project._source || 'projects',
                    stage: 'Sign & Verify',
                    changes: ['purchase_permit_verified'],
                }
            );
            setPermitVerified(true);
        } finally {
            setVerifying(false);
        }
    };

    const handleToggleDeposit = async () => {
        if (!project?.id) return;
        const nextVal = !depositConfirmed;
        setDepositConfirmed(nextVal);
        await projectService.updateRecord(
            project.id,
            {
                deposit_confirmed: nextVal,
                deposit_amount: requiredMaterialDeposit,
                deposit_confirmed_at: nextVal ? new Date().toISOString() : null,
                deposit_confirmed_by: nextVal ? (currentUser?.name || 'Admin') : null,
                pizza_tracker: syncSignVerifyPizzaTracker({ deposit: nextVal }),
            },
            project._source
        );
        await userLogService.logAction(
            'EDIT_RECORD',
            `${nextVal ? 'Confirmed' : 'Cleared'} 50% Material Deposit for ${project.name || 'Project'}`,
            {
                recordId: project.id,
                recordName: project.name || 'Project',
                collection: project._source || 'projects',
                stage: 'Sign & Verify',
                changes: ['deposit_confirmed'],
            }
        );
        setActionBanner(nextVal ? '50% Material Deposit confirmed & synced to Client Pizza Tracker.' : 'Deposit confirmation cleared.');
    };

    const handleToggleContractSigned = async () => {
        if (!project?.id) return;
        const nextVal = !contractSigned;
        setContractSigned(nextVal);
        await projectService.updateRecord(
            project.id,
            {
                contract_signed: nextVal,
                contract_signed_at: nextVal ? new Date().toISOString() : null,
                pizza_tracker: syncSignVerifyPizzaTracker({ signed: nextVal }),
            },
            project._source
        );
        await userLogService.logAction(
            'EDIT_RECORD',
            `${nextVal ? 'Confirmed' : 'Cleared'} Digital Contract signature for ${project.name || 'Project'}`,
            {
                recordId: project.id,
                recordName: project.name || 'Project',
                collection: project._source || 'projects',
                stage: 'Sign & Verify',
                changes: ['contract_signed'],
            }
        );
    };

    const handleAdvanceToSchedule = async () => {
        if (!project?.id || advancing) return;
        setAdvancing(true);
        try {
            await projectService.updateRecord(
                project.id,
                {
                    current_stage: 'Schedule',
                    contract_signed: true,
                    deposit_confirmed: true,
                    payment_model: paymentModel,
                    color_lock: shingleColorLock,
                    permit_responsibility: permitResponsibility,
                    pizza_tracker: {
                        stage: 'Schedule',
                        stageIndex: 4,
                        totalStages: PIPELINE.length,
                        subSteps: PIPELINE[4].defaultSubSteps.map((label, idx) => ({ label, done: idx === 0 })),
                        updatedAt: new Date().toISOString(),
                    },
                },
                project._source
            );
            await userLogService.logAction(
                'STAGE_CHANGE',
                `${project.name || 'Project'} moved to Schedule`,
                {
                    recordId: project.id,
                    recordName: project.name || 'Project',
                    collection: project._source || 'projects',
                    stage: 'Schedule',
                }
            );
            setActivePageId('E-30');
        } finally {
            setAdvancing(false);
        }
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(generatedLink);
            setCopyDone(true);
            setTimeout(() => setCopyDone(false), 2000);
        } catch {
            // clipboard unavailable
        }
    };

    return (
        <>
            {permitModalOpen && hasPermit && (
                <PermitModal url={permitUrl} fileName={permitFileName} onClose={() => setPermitModalOpen(false)} />
            )}

            <div className="p-6 md:p-8 space-y-6">
                {actionBanner && (
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2">
                        <CheckCircleIcon className="w-4 h-4 flex-none" />
                        <span>{actionBanner}</span>
                    </div>
                )}

                <Card title="Contract & Signature Status">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl">
                        <div className="flex items-start gap-4">
                            <ClockIcon className="w-10 h-10 text-amber-400 flex-none mt-1" />
                            <div>
                                <p className="font-bold text-white text-lg">{project.name}</p>
                                <p className="text-gray-400 text-sm mt-1">
                                    Verify signed agreement, Sheena Shopping Cart / Client Portal signature, and 50% Material Deposit before scheduling production.
                                </p>
                                {quoteTotal > 0 && (
                                    <p className="text-[#ec028b] font-mono font-bold mt-3 text-lg">
                                        Contract Value: ${quoteTotal.toLocaleString()}
                                    </p>
                                )}
                            </div>
                        </div>

                        <Button
                            id="sv-advance-schedule-btn"
                            onClick={handleAdvanceToSchedule}
                            disabled={advancing}
                            className="flex items-center justify-center gap-2 shrink-0"
                        >
                            <span>{advancing ? 'Updating…' : 'Confirm & Schedule'}</span>
                            <ChevronRightIcon className="w-4 h-4" />
                        </Button>
                    </div>
                </Card>

                <Card title={`Verification Checklist — ${PAYMENT_MODEL_LABELS[paymentModel]}`}>
                    <div className="space-y-3">
                        {[
                            { label: 'Customer Digital Agreement / Shopping Cart Signed', ready: contractSigned },
                            {
                                label: isMsaFlow ? 'Government / Corporate PO & Notice to Proceed ($0 Deposit)' : `${firstMilestone.label} ($${requiredMaterialDeposit.toLocaleString()})`,
                                ready: depositConfirmed || isMsaFlow,
                            },
                            { label: `Material / Membrane Color Locked (${shingleColorLock})`, ready: Boolean(shingleColorLock) },
                            { label: '100 sq ft Free 7/16" OSB Decking Clause Disclosed', ready: true },
                            ...(isInsuranceFlow
                                ? [
                                    { label: 'Policy Claim Number', ready: !!(customerData?.policy_claim_number || project?.insurance?.claimNumber || project?.insurance?.claim_number) },
                                    { label: 'Insurance Policy & Carrier Scope File', ready: !!(policyFile || firestoreData?.insurance_policy_file_name || scopeFile || firestoreData?.scope_of_work_file_name) },
                                  ]
                                : []),
                            ...(permitResponsibility !== 'not_required'
                                ? [{ label: `Municipal Building Permit (${permitResponsibility === 'rhive_pulled' ? 'RHIVE Pulled' : 'Client / GC Pulled'})`, ready: hasPermit || permitVerified || permitResponsibility === 'rhive_pulled' }]
                                : [{ label: 'Fast-Path Repair Scope (No Municipal Permit Required)', ready: true }]),
                        ].map((item) => (
                            <div key={item.label} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-800">
                                <span className="text-gray-300 text-sm">{item.label}</span>
                                <StatusBadge ready={item.ready} />
                            </div>
                        ))}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-gray-800">
                            <div>
                                <label className="block text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1.5">
                                    Locked Shingle / Membrane Color
                                </label>
                                <input
                                    id="sv-color-lock-input"
                                    type="text"
                                    value={shingleColorLock}
                                    onChange={(e) => setShingleColorLock(e.target.value)}
                                    onBlur={() => project?.id && projectService.updateRecord(project.id, { color_lock: shingleColorLock }, project._source)}
                                    className="w-full bg-black/60 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white focus:border-[#ec028b] outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1.5">
                                    Permit Responsibility
                                </label>
                                <div className="flex flex-wrap gap-1.5">
                                    {([
                                        { key: 'rhive_pulled', label: 'RHIVE Pulled' },
                                        { key: 'client_pulled', label: 'Client / GC' },
                                        { key: 'not_required', label: 'Repair (Exempt)' },
                                    ] as const).map((opt) => (
                                        <button
                                            key={opt.key}
                                            type="button"
                                            onClick={() => {
                                                setPermitResponsibility(opt.key);
                                                if (project?.id) projectService.updateRecord(project.id, { permit_responsibility: opt.key }, project._source);
                                            }}
                                            className={cn(
                                                'px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer',
                                                permitResponsibility === opt.key
                                                    ? 'bg-[#ec028b] border-[#ec028b] text-white'
                                                    : 'bg-gray-900/60 border-gray-700 text-gray-400 hover:text-white'
                                            )}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card title="Customer Verification Portal">
                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label htmlFor="sv-email-to" className="block text-[10px] text-gray-500 uppercase font-bold tracking-widest">
                                    Send Link To <span className="text-[#ec028b]">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        id="sv-email-to"
                                        type="email"
                                        value={emailTo}
                                        onChange={(e) => setEmailTo(e.target.value)}
                                        placeholder="customer@email.com"
                                        className="w-full bg-black/60 border border-gray-700 rounded-xl px-4 py-2.5 text-white font-mono text-sm placeholder-gray-600 focus:outline-none focus:border-[#ec028b]/60 transition-all"
                                        aria-label="Customer email address"
                                    />
                                    {emailTo !== customerEmail && customerEmail && (
                                        <button
                                            id="sv-reset-email-btn"
                                            type="button"
                                            onClick={() => setEmailTo(customerEmail)}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-500 hover:text-[#ec028b] font-bold uppercase tracking-widest px-2 py-1 transition-colors"
                                            aria-label="Reset to original email"
                                        >
                                            Reset
                                        </button>
                                    )}
                                </div>
                            </div>

                            {customerData && (
                                <div className="space-y-2 p-3 bg-gray-900/50 rounded-lg border border-gray-800">
                                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Customer Submission</p>
                                    {customerData.policy_claim_number && (
                                        <p className="text-xs text-gray-300">
                                            <span className="text-gray-600">Claim #:</span>{' '}
                                            <span className="font-mono">{customerData.policy_claim_number}</span>
                                        </p>
                                    )}
                                    {customerData.payment_method && (
                                        <p className="text-xs text-gray-300">
                                            <span className="text-gray-600">Payment:</span>{' '}
                                            {customerData.payment_method === 'acv' ? 'ACV Payment' : 'Deductible'}
                                        </p>
                                    )}
                                </div>
                            )}

                            {saveError && (
                                <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                                    {saveError}
                                </p>
                            )}

                            {linkSent ? (
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold">
                                        <CheckCircleIcon className="w-4 h-4" />
                                        <span>Link sent — awaiting customer completion</span>
                                    </div>

                                    {emailQueued === true && (emailTo || customerEmail) && (
                                        <div className="flex items-start gap-2 p-2.5 bg-emerald-500/5 border border-emerald-500/20 rounded-lg">
                                            <EnvelopeIcon className="w-4 h-4 text-emerald-400 flex-none mt-0.5" />
                                            <div>
                                                <p className="text-emerald-400 text-xs font-bold">Email sent</p>
                                                <p className="text-gray-500 text-[11px] mt-0.5">
                                                    Verification link emailed to <span className="text-gray-400 font-mono">{emailTo || customerEmail}</span>
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {generatedLink && (
                                        <div className="space-y-1">
                                            <p className="text-[10px] text-gray-600 uppercase font-bold tracking-widest">
                                                Customer Portal Link
                                            </p>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    id="sv-generated-link"
                                                    readOnly
                                                    value={generatedLink}
                                                    className="flex-1 bg-black border border-gray-800 rounded-lg px-3 py-2 text-xs font-mono text-gray-300 focus:outline-none focus:border-[#ec028b]/50"
                                                    aria-label="Customer sign verify link"
                                                />
                                                <button
                                                    id="sv-copy-link-btn"
                                                    type="button"
                                                    onClick={handleCopy}
                                                    className="px-3 py-2 border border-gray-700 rounded-lg text-xs font-bold text-gray-400 hover:text-white hover:border-[#ec028b]/50 transition-all"
                                                >
                                                    {copyDone ? 'Copied!' : 'Copy'}
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    <Button
                                        id="sv-resend-link-btn"
                                        variant="secondary"
                                        className="w-full flex items-center justify-center gap-2"
                                        onClick={() => { setLinkSent(false); setGeneratedLink(''); setEmailQueued(null); }}
                                    >
                                        <EnvelopeIcon className="w-4 h-4" />
                                        <span>Send Again</span>
                                    </Button>
                                </div>
                            ) : (
                                <Button
                                    id="sv-send-link-btn"
                                    className="w-full flex items-center justify-center gap-2"
                                    onClick={handleSendLink}
                                    disabled={sending}
                                >
                                    {sending ? (
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <EnvelopeIcon className="w-4 h-4" />
                                    )}
                                    <span>{sending ? 'Sending…' : 'Send Sign & Verify Link'}</span>
                                </Button>
                            )}
                        </div>
                    </Card>

                    <Card title="Insurance & Scope Documents">
                        <div className="space-y-5">
                            <FileUploadZone
                                id="sv-policy-claim-upload"
                                label="Insurance Policy Claim Document"
                                placeholder="Upload the insurance policy claim file confirming coverage."
                                file={policyFile}
                                persistedName={firestoreData?.insurance_policy_file_name}
                                onFile={(f) => handleFileSelect('policy', f)}
                            />
                            <FileUploadZone
                                id="sv-scope-of-work-upload"
                                label="Scope of Work / Supporting Documents"
                                placeholder="Upload the carrier scope of work or signed Shopping Cart PDF."
                                file={scopeFile}
                                persistedName={firestoreData?.scope_of_work_file_name}
                                onFile={(f) => handleFileSelect('scope', f)}
                            />
                        </div>
                    </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card title="50% Material Deposit Confirmation">
                        <div className="space-y-4">
                            <div className={cn(
                                'p-4 rounded-xl border transition-all',
                                depositConfirmed
                                    ? 'bg-[#ec028b]/10 border-[#ec028b] shadow-[0_0_15px_rgba(236,2,139,0.2)]'
                                    : 'bg-gray-900/50 border-gray-800'
                            )}>
                                <div className="flex items-center justify-between mb-1">
                                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">
                                        Required Material Deposit (50% of 50/40/10 Split)
                                    </p>
                                    <StatusBadge ready={depositConfirmed} label={depositConfirmed ? 'Confirmed' : 'Awaiting 50%'} />
                                </div>
                                <p className="text-2xl font-bold text-white font-mono">
                                    {requiredMaterialDeposit > 0 ? `$${requiredMaterialDeposit.toLocaleString()}` : '—'}
                                </p>
                            </div>
                            <Button
                                id="sv-confirm-payment-btn"
                                variant={depositConfirmed ? 'secondary' : 'primary'}
                                onClick={handleToggleDeposit}
                                className="w-full flex items-center justify-center gap-2"
                            >
                                <DocumentCheckIcon className="w-4 h-4" />
                                <span>{depositConfirmed ? 'Deposit Confirmed' : 'Confirm Deposit'}</span>
                            </Button>
                        </div>
                    </Card>

                    <Card title="Signature & Permit Verification">
                        <div className="space-y-3">
                            <button
                                id="sv-toggle-contract-btn"
                                type="button"
                                onClick={handleToggleContractSigned}
                                className={cn(
                                    'w-full flex items-center justify-between p-3 rounded-lg border text-left transition-all',
                                    contractSigned
                                        ? 'border-[#ec028b] bg-[#ec028b]/10 shadow-[0_0_12px_rgba(236,2,139,0.2)]'
                                        : 'border-gray-800 bg-gray-900/50 hover:border-gray-600'
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <PencilSquareIcon className={cn('w-4 h-4', contractSigned ? 'text-[#ec028b]' : 'text-gray-500')} />
                                    <span className={cn('text-sm font-semibold', contractSigned ? 'text-white' : 'text-gray-300')}>
                                        Digital Contract / Shopping Cart Signed
                                    </span>
                                </div>
                                <StatusBadge ready={contractSigned} label={contractSigned ? 'Signed' : 'Confirm'} />
                            </button>

                            <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-800">
                                <div className="flex items-center gap-3">
                                    <ShieldCheckIcon className="w-4 h-4 text-gray-500" />
                                    <span className="text-gray-300 text-sm">Customer Portal Agreement</span>
                                </div>
                                <StatusBadge ready={!!customerData?.agreed_to_terms || contractSigned} />
                            </div>

                            {hasPermit ? (
                                <div className="p-3 bg-gray-900/60 border border-gray-800 rounded-xl space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 min-w-0">
                                            <DocumentTextIcon className="w-4 h-4 text-[#ec028b] flex-none" />
                                            <span className="text-white text-sm font-semibold truncate">{permitFileName}</span>
                                        </div>
                                        <button
                                            id="sv-permit-preview-btn"
                                            type="button"
                                            onClick={() => setPermitModalOpen(true)}
                                            className="px-3 py-1 bg-[#ec028b] text-white rounded-lg text-xs font-bold uppercase tracking-wider"
                                        >
                                            Open
                                        </button>
                                    </div>
                                    {isPermitImage && (
                                        <div className="max-h-36 overflow-hidden rounded-lg border border-gray-800 bg-black/40 flex items-center justify-center">
                                            <img src={permitUrl} alt="Purchase Permit Preview" className="max-h-36 object-contain" />
                                        </div>
                                    )}
                                    {isSuperAdmin && !permitVerified && (
                                        <Button
                                            id="sv-verify-permit-btn"
                                            onClick={handleVerifyPermit}
                                            disabled={verifying}
                                            className="w-full flex items-center justify-center gap-2"
                                        >
                                            <ShieldCheckIcon className="w-4 h-4" />
                                            <span>{verifying ? 'Verifying…' : 'Confirm Permit'}</span>
                                        </Button>
                                    )}
                                </div>
                            ) : (
                                <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-800">
                                    <div className="flex items-center gap-3">
                                        <DocumentTextIcon className="w-4 h-4 text-gray-500" />
                                        <span className="text-gray-300 text-sm">Purchase Permit Upload</span>
                                    </div>
                                    <StatusBadge ready={false} label="Optional / Pending" />
                                </div>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </>
    );
};

const SignAndVerifyPage: React.FC = () => (
    <ProjectStageLayout stageLabel="Sign & Verify" stagePageId="E-29">
        {(project) => <SignAndVerifyContent project={project} />}
    </ProjectStageLayout>
);

export default SignAndVerifyPage;
