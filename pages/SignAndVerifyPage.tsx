
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { ProjectStageLayout } from '../components/ProjectStageLayout';
import Card from '../components/Card';
import Button from '../components/Button';
import { useMockDB } from '../contexts/MockDatabaseContext';
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
} from '../components/icons';
import { db } from '../lib/firebase';
import { doc, updateDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';

// ── File Upload Zone ──────────────────────────────────────────────────────────

interface FileUploadZoneProps {
    id: string;
    label: string;
    placeholder: string;
    accept?: string;
    file: File | null;
    onFile: (f: File | null) => void;
}

const FileUploadZone: React.FC<FileUploadZoneProps> = ({
    id, label, placeholder, accept = '.pdf,.jpg,.jpeg,.png', file, onFile,
}) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [dragOver, setDragOver] = useState(false);

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragOver(false);
        const dropped = e.dataTransfer.files[0];
        if (dropped) onFile(dropped);
    }, [onFile]);

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
                className={`relative cursor-pointer rounded-xl border-2 border-dashed p-6 flex flex-col items-center justify-center gap-3 transition-all duration-200
                    ${dragOver ? 'border-[#ec028b] bg-[#ec028b]/10 shadow-[0_0_20px_rgba(236,2,139,0.2)]'
                        : file ? 'border-emerald-500/60 bg-emerald-500/5'
                        : 'border-gray-700 bg-gray-900/40 hover:border-[#ec028b]/50 hover:bg-[#ec028b]/5'}`}
            >
                <input ref={inputRef} id={id} type="file" accept={accept} onChange={(e) => onFile(e.target.files?.[0] ?? null)} className="hidden" aria-label={label} />
                {file ? (
                    <>
                        <CheckCircleIcon className="w-8 h-8 text-emerald-400" />
                        <div className="text-center">
                            <p className="text-emerald-400 font-bold text-sm truncate max-w-[200px]">{file.name}</p>
                            <p className="text-gray-500 text-xs mt-0.5">{(file.size / 1024).toFixed(1)} KB — click to replace</p>
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

// ── Status Badge ──────────────────────────────────────────────────────────────

const StatusBadge: React.FC<{ ready: boolean; label?: string }> = ({ ready, label }) => (
    <span className={`text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded border ${
        ready ? 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10'
              : 'text-amber-400 border-amber-500/40 bg-amber-500/10'}`}>
        {label ?? (ready ? 'Received' : 'Pending')}
    </span>
);

// ── Purchase Permit Preview Modal ─────────────────────────────────────────────

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
                {/* Modal Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 shrink-0">
                    <div className="flex items-center gap-3">
                        <DocumentTextIcon className="w-5 h-5 text-[#ec028b]" />
                        <div>
                            <p className="text-white font-bold text-sm">Purchase Permit Document</p>
                            <p className="text-gray-500 text-xs truncate max-w-[300px]">{fileName}</p>
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

                {/* Modal Body */}
                <div className="flex-1 overflow-auto flex items-center justify-center p-6 bg-black/40">
                    {isImage ? (
                        <img src={url} alt="Purchase Permit" className="max-w-full max-h-[65vh] object-contain rounded-lg border border-gray-800" />
                    ) : isPdf ? (
                        <iframe src={url} title="Purchase Permit PDF" className="w-full h-[65vh] rounded-lg border border-gray-800 bg-white" />
                    ) : (
                        <div className="flex flex-col items-center gap-4 text-center py-12">
                            <DocumentTextIcon className="w-16 h-16 text-gray-600" />
                            <p className="text-gray-400 text-sm">Preview unavailable for this file type.</p>
                            <button onClick={handleDownload}
                                className="flex items-center gap-2 px-6 py-3 bg-[#ec028b] text-white rounded-xl font-bold hover:bg-[#d4017d] transition-all">
                                <DownloadIcon className="w-4 h-4" /> Download to View
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// ── Main Content ──────────────────────────────────────────────────────────────

const SignAndVerifyContent: React.FC<{ project: any }> = ({ project }) => {
    const { currentUser } = useMockDB();
    const isSuperAdmin = currentUser?.role === 'Super Admin';

    const [policyFile, setPolicyFile] = useState<File | null>(null);
    const [scopeFile, setScopeFile] = useState<File | null>(null);
    const [sending, setSending] = useState(false);
    const [linkSent, setLinkSent] = useState(false);
    const [generatedLink, setGeneratedLink] = useState<string>('');
    const [copyDone, setCopyDone] = useState(false);
    const [saveError, setSaveError] = useState('');

    // Live Firestore data
    const [firestoreData, setFirestoreData] = useState<any>(null);
    const [permitModalOpen, setPermitModalOpen] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const [permitVerified, setPermitVerified] = useState(false);

    useEffect(() => {
        if (!project?.id) return;
        const colPath = project._source === 'leads' ? 'leads' : 'projects';
        const unsub = onSnapshot(doc(db, colPath, project.id), (snap) => {
            if (snap.exists()) {
                const data = snap.data();
                setFirestoreData(data);
                setPermitVerified(!!data?.purchase_permit_verified);
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
    const hasPermit = !!permitUrl;

    const customerEmail = project?.contact?.email || project?.customer_email || project?.email || '';
    const customerName = project?.contact
        ? `${project.contact.first_name || ''} ${project.contact.last_name || ''}`.trim()
        : project?.name || 'Customer';

    const handleSendLink = async () => {
        if (sending) return;
        setSending(true);
        setSaveError('');
        try {
            const link = `${window.location.origin}/?page=CUSTOMER-SIGN-VERIFY&token=${project.id}`;
            setGeneratedLink(link);
            const colPath = project._source === 'leads' ? 'leads' : 'projects';
            await updateDoc(doc(db, colPath, project.id), {
                sign_verify_link: link,
                sign_verify_sent_at: serverTimestamp(),
                sign_verify_status: 'link_sent',
                updated_at: new Date().toISOString(),
            });
            try {
                await fetch('https://us-central1-rhive-os.cloudfunctions.net/sendSignVerifyEmail', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ projectId: project.id, customerEmail, customerName, projectName: project.name || 'Your Project', link }),
                });
            } catch { /* graceful fallback */ }
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
            const colPath = project._source === 'leads' ? 'leads' : 'projects';
            await updateDoc(doc(db, colPath, project.id), {
                purchase_permit_verified: true,
                purchase_permit_verified_by: currentUser?.name || currentUser?.email || 'Super Admin',
                purchase_permit_verified_at: serverTimestamp(),
                updated_at: new Date().toISOString(),
            });
            setPermitVerified(true);
        } catch { /* Firestore snapshot will update */ }
        finally { setVerifying(false); }
    };

    const handleCopy = async () => {
        try { await navigator.clipboard.writeText(generatedLink); setCopyDone(true); setTimeout(() => setCopyDone(false), 2000); }
        catch { /* clipboard unavailable */ }
    };

    return (
        <>
            {permitModalOpen && hasPermit && (
                <PermitModal url={permitUrl} fileName={permitFileName} onClose={() => setPermitModalOpen(false)} />
            )}

            <div className="p-6 md:p-8 space-y-6">

                {/* Status Banner */}
                <Card title="Contract & Signature Status">
                    <div className="flex items-start gap-6 p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl">
                        <ClockIcon className="w-10 h-10 text-amber-400 flex-none mt-1" />
                        <div>
                            <h3 className="font-bold text-white text-lg">{project.name}</h3>
                            <p className="text-gray-400 text-sm mt-1">
                                This project is in the Sign &amp; Verify stage. Upload insurance documents,
                                then send the customer their verification link to complete their portion.
                            </p>
                            {project.quote?.total && (
                                <p className="text-[#ec028b] font-mono font-bold mt-3 text-lg">
                                    Contract Value: ${project.quote.total.toLocaleString()}
                                </p>
                            )}
                        </div>
                    </div>
                </Card>

                {/* Checklist */}
                <Card title="Verification Checklist">
                    <div className="space-y-3">
                        {[
                            { label: 'Insurance Policy Claim File', ready: !!policyFile },
                            { label: 'Scope of Work File', ready: !!scopeFile },
                            { label: 'Customer Agreement (Portal)', ready: !!customerData?.agreed_to_terms },
                            { label: 'Policy Claim Number', ready: !!customerData?.policy_claim_number },
                            { label: 'Payment Method Selection', ready: !!customerData?.payment_method },
                            { label: 'Purchase Permit', ready: hasPermit },
                            { label: 'Permit Verified by Super Admin', ready: permitVerified },
                        ].map((item) => (
                            <div key={item.label} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-800">
                                <span className="text-gray-300 text-sm">{item.label}</span>
                                <StatusBadge ready={item.ready} />
                            </div>
                        ))}
                    </div>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Insurance Documents */}
                    <Card title="Insurance Documents">
                        <div className="space-y-5">
                            <FileUploadZone
                                id="sv-policy-claim-upload"
                                label="Insurance Policy Claim Document"
                                placeholder="Upload the insurance policy claim file. This should be the official carrier documentation confirming coverage and claim details."
                                file={policyFile}
                                onFile={setPolicyFile}
                            />
                            <FileUploadZone
                                id="sv-scope-of-work-upload"
                                label="Scope of Work / Supporting Documents"
                                placeholder="Upload the scope of work or any additional policy documentation. A scope of work can also serve as a supporting claim document."
                                file={scopeFile}
                                onFile={setScopeFile}
                            />
                        </div>
                    </Card>

                    <div className="space-y-6">

                        {/* Purchase Permit */}
                        <Card title="Purchase Permit">
                            <div className="space-y-4">
                                {hasPermit ? (
                                    <>
                                        {/* Clickable file preview trigger */}
                                        <button
                                            id="sv-permit-preview-btn"
                                            onClick={() => setPermitModalOpen(true)}
                                            className="w-full group flex items-center gap-4 p-4 bg-gray-900/50 border border-[#ec028b]/20 rounded-xl hover:border-[#ec028b]/60 hover:bg-[#ec028b]/5 transition-all duration-200 text-left"
                                            aria-label="View purchase permit document">
                                            <div className="w-10 h-10 flex-none rounded-lg bg-[#ec028b]/10 border border-[#ec028b]/20 flex items-center justify-center">
                                                <DocumentTextIcon className="w-5 h-5 text-[#ec028b]" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-white font-bold text-sm group-hover:text-[#ec028b] transition-colors truncate">{permitFileName}</p>
                                                <p className="text-gray-500 text-xs mt-0.5">Uploaded by customer · click to preview</p>
                                            </div>
                                            <span className="text-[10px] text-[#ec028b] font-bold uppercase tracking-widest border border-[#ec028b]/30 px-2 py-1 rounded-full">View</span>
                                        </button>

                                        {/* Super Admin verification */}
                                        {isSuperAdmin ? (
                                            permitVerified ? (
                                                <div className="flex items-center gap-3 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                                                    <CheckCircleIcon className="w-5 h-5 text-emerald-400 flex-none" />
                                                    <div>
                                                        <p className="text-emerald-400 font-bold text-sm">Payment Verified</p>
                                                        <p className="text-gray-500 text-xs">Confirmed by {firestoreData?.purchase_permit_verified_by || 'Super Admin'}</p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <Button
                                                    id="sv-verify-permit-btn"
                                                    className="w-full flex items-center justify-center gap-2"
                                                    onClick={handleVerifyPermit}
                                                    disabled={verifying}>
                                                    {verifying
                                                        ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                        : <ShieldCheckIcon className="w-4 h-4" />}
                                                    {verifying ? 'Verifying…' : 'Verify Payment Received'}
                                                </Button>
                                            )
                                        ) : (
                                            <div className="flex items-center justify-between p-3 bg-gray-900/40 rounded-lg border border-gray-800">
                                                <span className="text-gray-400 text-xs">Payment verification</span>
                                                <StatusBadge ready={permitVerified} label={permitVerified ? 'Verified' : 'Awaiting Admin'} />
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="p-6 flex flex-col items-center gap-3 text-center border border-dashed border-gray-700 rounded-xl bg-gray-900/20">
                                        <DocumentTextIcon className="w-8 h-8 text-gray-700" />
                                        <div>
                                            <p className="text-gray-500 text-sm font-semibold">No permit uploaded yet</p>
                                            <p className="text-gray-700 text-xs mt-1">The customer must upload their purchase permit through the verification portal.</p>
                                        </div>
                                        <StatusBadge ready={false} label="Awaiting Customer" />
                                    </div>
                                )}
                            </div>
                        </Card>

                        {/* Customer Portal Link */}
                        <Card title="Customer Verification Portal">
                            <div className="space-y-4">
                                <div className="p-3 bg-gray-900/50 rounded-lg border border-gray-800">
                                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Customer Email</p>
                                    <p className="text-white font-mono text-sm">{customerEmail || '—'}</p>
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
                                {saveError && <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg p-3">{saveError}</p>}
                                {linkSent ? (
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold">
                                            <CheckCircleIcon className="w-4 h-4" /> Link sent — awaiting customer
                                        </div>
                                        {generatedLink && (
                                            <div className="flex items-center gap-2">
                                                <input id="sv-generated-link" readOnly value={generatedLink}
                                                    className="flex-1 bg-black border border-gray-800 rounded-lg px-3 py-2 text-xs font-mono text-gray-300 focus:outline-none"
                                                    aria-label="Customer sign verify link" />
                                                <button id="sv-copy-link-btn" onClick={handleCopy}
                                                    className="px-3 py-2 border border-gray-700 rounded-lg text-xs font-bold text-gray-400 hover:text-white hover:border-[#ec028b]/50 transition-all">
                                                    {copyDone ? 'Copied!' : 'Copy'}
                                                </button>
                                            </div>
                                        )}
                                        <Button id="sv-resend-link-btn" variant="secondary"
                                            className="w-full flex items-center justify-center gap-2"
                                            onClick={() => { setLinkSent(false); setGeneratedLink(''); }}>
                                            <EnvelopeIcon className="w-4 h-4" /> Resend Link
                                        </Button>
                                    </div>
                                ) : (
                                    <Button id="sv-send-link-btn" className="w-full flex items-center justify-center gap-2"
                                        onClick={handleSendLink} disabled={sending}>
                                        {sending ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <EnvelopeIcon className="w-4 h-4" />}
                                        {sending ? 'Generating link…' : 'Send Sign & Verify Link'}
                                    </Button>
                                )}
                            </div>
                        </Card>
                    </div>
                </div>

                {/* Bottom Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card title="Deposit Confirmation">
                        <div className="space-y-4">
                            <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-800">
                                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Required Deposit (10%)</p>
                                <p className="text-2xl font-bold text-white font-mono">
                                    ${project.quote?.total ? (project.quote.total * 0.1).toLocaleString() : '—'}
                                </p>
                            </div>
                            <Button id="sv-confirm-payment-btn" variant="secondary" className="w-full flex items-center justify-center gap-2">
                                <DocumentCheckIcon className="w-4 h-4" /> Confirm Payment Received
                            </Button>
                        </div>
                    </Card>

                    <Card title="Signature Verification">
                        <div className="space-y-3">
                            {[
                                { icon: <PencilSquareIcon className="w-4 h-4 text-gray-500" />, label: 'Digital Contract', ready: false },
                                { icon: <ShieldCheckIcon className="w-4 h-4 text-gray-500" />, label: 'Customer Agreement', ready: !!customerData?.agreed_to_terms },
                                { icon: <DocumentTextIcon className="w-4 h-4 text-gray-500" />, label: 'Purchase Permit', ready: hasPermit },
                                { icon: <CheckCircleIcon className="w-4 h-4 text-gray-500" />, label: 'Permit Verified', ready: permitVerified },
                            ].map((item) => (
                                <div key={item.label} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-800">
                                    <div className="flex items-center gap-3">{item.icon}<span className="text-gray-300 text-sm">{item.label}</span></div>
                                    <StatusBadge ready={item.ready} />
                                </div>
                            ))}
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