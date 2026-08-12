
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
    const [emailQueued, setEmailQueued] = useState<boolean | null>(null); // null = not attempted
    const [generatedLink, setGeneratedLink] = useState<string>('');
    const [copyDone, setCopyDone] = useState(false);
    const [saveError, setSaveError] = useState('');

    // Live Firestore data
    const [firestoreData, setFirestoreData] = useState<any>(null);
    const [permitModalOpen, setPermitModalOpen] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const [permitVerified, setPermitVerified] = useState(false);

    // Editable send-to email
    const [emailTo, setEmailTo] = useState<string>('');

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
    const isPermitImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(permitFileName);
    const hasPermit = !!permitUrl;

    // Resolve customer email across all schema variants:
    //  - contact_email  → normalizeLead() output (leads from CRM)
    //  - contact?.email → project intake sub-contact (projects collection)
    //  - customer_email → explicit field some records use
    //  - email          → raw top-level field on older lead docs
    //  - insurance?.claimant_email / billing?.email → additional fallbacks
    const customerEmail =
        project?.contact_email ||
        project?.contact?.email ||
        project?.customer_email ||
        project?.email ||
        project?.insurance?.claimant_email ||
        project?.billing?.email ||
        '';
    // Resolve customer name across all schema variants
    const customerName = (() => {
        if (project?.contact?.first_name || project?.contact?.last_name) {
            return `${project.contact.first_name || ''} ${project.contact.last_name || ''}`.trim();
        }
        if (project?.contact_name) return project.contact_name;
        if (project?.firstName || project?.lastName) {
            return `${project.firstName || ''} ${project.lastName || ''}`.trim();
        }
        return project?.name || 'Customer';
    })();

    // Initialise emailTo once customerEmail is resolved
    useEffect(() => {
        if (customerEmail && !emailTo) setEmailTo(customerEmail);
    }, [customerEmail]);


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

            // Call Cloud Function to queue email via Firestore 'mail' collection
            try {
                const fnUrl = `https://us-central1-rhive-os.cloudfunctions.net/sendSignVerifyEmail`;
                const fnRes = await fetch(fnUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ projectId: project.id, customerEmail: emailTo || customerEmail, customerName, projectName: project.name || 'Your Project', link }),
                });
                const fnData = await fnRes.json().catch(() => ({}));
                setEmailQueued(fnData.emailSent === true);
            } catch {
                // Cloud Function unavailable — link is still saved to Firestore
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

                    {/* Send Link Card */}
                    <Card title="Send Customer Link">
                        <div className="space-y-4">
                            {saveError && (
                                <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                                    {saveError}
                                </p>
                            )}

                            {linkSent ? (
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold">
                                        <CheckCircleIcon className="w-4 h-4" />
                                        Link sent — awaiting customer completion
                                    </div>

                                    {/* ═══ Email delivery status ═══ */}
                                    {emailQueued === true && customerEmail && (
                                        <div className="flex items-start gap-2 p-2.5 bg-emerald-500/5 border border-emerald-500/20 rounded-lg">
                                            <EnvelopeIcon className="w-4 h-4 text-emerald-400 flex-none mt-0.5" />
                                            <div>
                                                <p className="text-emerald-400 text-xs font-bold">Email sent</p>
                                                <p className="text-gray-500 text-[11px] mt-0.5">Verification link emailed to <span className="text-gray-400 font-mono">{customerEmail}</span></p>
                                            </div>
                                        </div>
                                    )}
                                    {emailQueued === false && customerEmail && (
                                        <div className="flex items-start gap-2 p-2.5 bg-amber-500/5 border border-amber-500/20 rounded-lg">
                                            <EnvelopeIcon className="w-4 h-4 text-amber-400 flex-none mt-0.5" />
                                            <div>
                                                <p className="text-amber-400 text-xs font-bold">Email queuing failed</p>
                                                <p className="text-gray-500 text-[11px] mt-0.5">Copy the link below and share with <span className="text-gray-400 font-mono">{customerEmail}</span></p>
                                            </div>
                                        </div>
                                    )}
                                    {!customerEmail && (
                                        <div className="flex items-start gap-2 p-2.5 bg-amber-500/5 border border-amber-500/20 rounded-lg">
                                            <EnvelopeIcon className="w-4 h-4 text-amber-400 flex-none mt-0.5" />
                                            <p className="text-amber-400 text-xs">No email on file — share the link below manually.</p>
                                        </div>
                                    )}

                                    {/* ═══ Copyable link fallback ═══ */}
                                    {generatedLink && (
                                        <div className="space-y-1">
                                            <p className="text-[10px] text-gray-600 uppercase font-bold tracking-widest">
                                                Customer Link
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
                                        Resend Link
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
                                    {sending ? 'Generating link…' : 'Send Sign & Verify Link'}
                                </Button>
                            )}
                        </div>
                    </Card>

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
                                        {/* Labelled document card */}
                                        <div className="bg-gray-900/60 border border-gray-800 rounded-xl overflow-hidden">
                                            {/* Document type header strip */}
                                            <div className="flex items-center gap-2 px-4 py-2 bg-[#ec028b]/8 border-b border-[#ec028b]/20">
                                                <DocumentTextIcon className="w-3.5 h-3.5 text-[#ec028b]" />
                                                <span className="text-[10px] font-black uppercase tracking-widest text-[#ec028b]">Purchase Permit</span>
                                                <span className="ml-auto text-[10px] text-gray-600 font-mono">Customer Upload</span>
                                            </div>
                                            {/* Image preview (if applicable) */}
                                            {isPermitImage && (
                                                <div className="relative border-b border-gray-800 bg-black/40 flex items-center justify-center" style={{ maxHeight: '180px', overflow: 'hidden' }}>
                                                    <img
                                                        src={permitUrl}
                                                        alt="Purchase Permit Preview"
                                                        className="object-contain w-full"
                                                        style={{ maxHeight: '180px' }}
                                                    />
                                                    <span className="absolute top-2 right-2 text-[10px] bg-black/70 border border-gray-700 text-gray-400 px-2 py-0.5 rounded font-mono">Preview</span>
                                                </div>
                                            )}
                                            {/* File info row */}
                                            <div className="flex items-center gap-3 px-4 py-3">
                                                <div className="w-9 h-9 flex-none rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center">
                                                    {isPermitImage
                                                        ? <img src={permitUrl} alt="" className="w-9 h-9 object-cover rounded-lg" />
                                                        : <DocumentTextIcon className="w-4 h-4 text-gray-400" />}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-white font-semibold text-sm truncate">{permitFileName}</p>
                                                    <p className="text-gray-600 text-xs mt-0.5">Purchase permit uploaded by customer</p>
                                                </div>
                                            </div>
                                            {/* Action row */}
                                            <div className="flex items-center gap-2 px-4 py-3 border-t border-gray-800 bg-black/20">
                                                <button
                                                    id="sv-permit-preview-btn"
                                                    onClick={() => setPermitModalOpen(true)}
                                                    className="flex items-center gap-2 px-4 py-2 bg-[#ec028b] text-white rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-[#d4017d] transition-all shadow-[0_0_12px_rgba(236,2,139,0.3)] hover:shadow-[0_0_18px_rgba(236,2,139,0.5)]"
                                                    aria-label="View purchase permit document">
                                                    <DocumentTextIcon className="w-3.5 h-3.5" />
                                                    View File
                                                </button>
                                                <button
                                                    id="sv-permit-download-card-btn"
                                                    onClick={() => { const a = document.createElement('a'); a.href = permitUrl; a.download = permitFileName; a.target = '_blank'; document.body.appendChild(a); a.click(); document.body.removeChild(a); }}
                                                    className="flex items-center gap-2 px-4 py-2 bg-gray-800 border border-gray-700 text-gray-300 rounded-lg text-xs font-bold uppercase tracking-widest hover:text-white hover:border-gray-600 transition-all"
                                                    aria-label="Download purchase permit">
                                                    <DownloadIcon className="w-3.5 h-3.5" />
                                                    Download
                                                </button>
                                            </div>
                                        </div>

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
                                            className="w-full bg-black/60 border border-gray-700 rounded-xl px-4 py-2.5 text-white font-mono text-sm placeholder-gray-600 focus:outline-none focus:border-[#ec028b]/60 focus:shadow-[0_0_10px_rgba(236,2,139,0.1)] transition-all"
                                            aria-label="Customer email address"
                                        />
                                        {emailTo !== customerEmail && customerEmail && (
                                            <button
                                                type="button"
                                                onClick={() => setEmailTo(customerEmail)}
                                                className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-500 hover:text-[#ec028b] font-bold uppercase tracking-widest px-2 py-1 transition-colors"
                                                aria-label="Reset to original email"
                                            >
                                                Reset
                                            </button>
                                        )}
                                    </div>
                                    {emailTo !== customerEmail && customerEmail && (
                                        <p className="text-[10px] text-amber-400">
                                            ⚠ Original: <span className="font-mono">{customerEmail}</span>
                                        </p>
                                    )}
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
                                            onClick={() => { setLinkSent(false); setGeneratedLink(''); setEmailQueued(null); }}>
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