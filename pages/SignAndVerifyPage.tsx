
import React, { useState, useRef, useCallback } from 'react';
import { ProjectStageLayout } from '../components/ProjectStageLayout';
import Card from '../components/Card';
import Button from '../components/Button';
import {
    DocumentCheckIcon,
    PencilSquareIcon,
    ClockIcon,
    ArrowUpTrayIcon,
    EnvelopeIcon,
    CheckCircleIcon,
    ShieldCheckIcon,
} from '../components/icons';
import { db } from '../lib/firebase';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';

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
    id,
    label,
    placeholder,
    accept = '.pdf,.jpg,.jpeg,.png',
    file,
    onFile,
}) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [dragOver, setDragOver] = useState(false);

    const handleDrop = useCallback(
        (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            setDragOver(false);
            const dropped = e.dataTransfer.files[0];
            if (dropped) onFile(dropped);
        },
        [onFile],
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0] ?? null;
        onFile(f);
    };

    return (
        <div className="space-y-2">
            <label
                htmlFor={id}
                className="block text-xs font-bold uppercase tracking-widest text-gray-400"
            >
                {label}
            </label>
            <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
                className={`
                    relative cursor-pointer rounded-xl border-2 border-dashed p-6 flex flex-col items-center justify-center gap-3 transition-all duration-200
                    ${dragOver
                        ? 'border-[#ec028b] bg-[#ec028b]/10 shadow-[0_0_20px_rgba(236,2,139,0.2)]'
                        : file
                            ? 'border-emerald-500/60 bg-emerald-500/5'
                            : 'border-gray-700 bg-gray-900/40 hover:border-[#ec028b]/50 hover:bg-[#ec028b]/5'
                    }
                `}
            >
                <input
                    ref={inputRef}
                    id={id}
                    type="file"
                    accept={accept}
                    onChange={handleChange}
                    className="hidden"
                    aria-label={label}
                />
                {file ? (
                    <>
                        <CheckCircleIcon className="w-8 h-8 text-emerald-400" />
                        <div className="text-center">
                            <p className="text-emerald-400 font-bold text-sm truncate max-w-[200px]">{file.name}</p>
                            <p className="text-gray-500 text-xs mt-0.5">
                                {(file.size / 1024).toFixed(1)} KB — click to replace
                            </p>
                        </div>
                    </>
                ) : (
                    <>
                        <ArrowUpTrayIcon className="w-8 h-8 text-gray-600" />
                        <div className="text-center">
                            <p className="text-gray-400 text-sm font-semibold">{placeholder}</p>
                            <p className="text-gray-600 text-xs mt-1">
                                Drag &amp; drop or click to browse · PDF, JPG, PNG
                            </p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

// ── Status Badge ──────────────────────────────────────────────────────────────

const StatusBadge: React.FC<{ ready: boolean }> = ({ ready }) => (
    <span
        className={`text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded border ${
            ready
                ? 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10'
                : 'text-amber-400 border-amber-500/40 bg-amber-500/10'
        }`}
    >
        {ready ? 'Received' : 'Pending'}
    </span>
);

// ── Main Content ──────────────────────────────────────────────────────────────

const SignAndVerifyContent: React.FC<{ project: any }> = ({ project }) => {
    const [policyFile, setPolicyFile] = useState<File | null>(null);
    const [scopeFile, setScopeFile] = useState<File | null>(null);
    const [sending, setSending] = useState(false);
    const [linkSent, setLinkSent] = useState(false);
    const [emailQueued, setEmailQueued] = useState<boolean | null>(null); // null = not attempted
    const [generatedLink, setGeneratedLink] = useState<string>('');
    const [copyDone, setCopyDone] = useState(false);
    const [saveError, setSaveError] = useState('');

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

    const handleSendLink = async () => {
        if (sending) return;
        setSending(true);
        setSaveError('');

        try {
            // Build the customer-facing sign & verify link
            const baseUrl = window.location.origin;
            const link = `${baseUrl}/?page=CUSTOMER-SIGN-VERIFY&token=${project.id}`;
            setGeneratedLink(link);

            // Persist link + timestamp to Firestore
            const colPath = project._source === 'leads' ? 'leads' : 'projects';
            const docRef = doc(db, colPath, project.id);
            await updateDoc(docRef, {
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
                    body: JSON.stringify({
                        projectId: project.id,
                        customerEmail,
                        customerName,
                        projectName: project.name || 'Your Project',
                        link,
                    }),
                });
                const fnData = await fnRes.json().catch(() => ({}));
                setEmailQueued(fnData.emailSent === true);
            } catch {
                // Cloud Function unavailable — link is still saved to Firestore
                setEmailQueued(false);
            }

            setLinkSent(true);
        } catch (err: any) {
            setSaveError('Failed to generate link. Please try again.');
        } finally {
            setSending(false);
        }
    };

    const handleCopy = async () => {
        if (!generatedLink) return;
        try {
            await navigator.clipboard.writeText(generatedLink);
            setCopyDone(true);
            setTimeout(() => setCopyDone(false), 2000);
        } catch {
            // Clipboard not available
        }
    };

    return (
        <div className="p-6 md:p-8 space-y-6">

            {/* ── Stage status banner ── */}
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

            {/* ── Checklist Overview ── */}
            <Card title="Verification Checklist">
                <div className="space-y-3">
                    {[
                        { label: 'Insurance Policy Claim File', ready: !!policyFile },
                        { label: 'Scope of Work File', ready: !!scopeFile },
                        { label: 'Customer Agreement (Portal)', ready: linkSent },
                        { label: 'Payment Method Selection (Portal)', ready: linkSent },
                    ].map((item) => (
                        <div
                            key={item.label}
                            className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-800"
                        >
                            <span className="text-gray-300 text-sm">{item.label}</span>
                            <StatusBadge ready={item.ready} />
                        </div>
                    ))}
                </div>
            </Card>

            {/* ── Document Upload Section ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    {/* ── Send customer link ── */}
                    <Card title="Customer Verification Portal">
                        <div className="space-y-4">
                            <div className="p-3 bg-gray-900/50 rounded-lg border border-gray-800">
                                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">
                                    Customer Email
                                </p>
                                <p className="text-white font-mono text-sm">
                                    {customerEmail || '—'}
                                </p>
                            </div>

                            <p className="text-gray-400 text-xs leading-relaxed">
                                Send the customer a secure link to complete their portion of the agreement —
                                including policy claim number entry, insurance agreement acceptance,
                                and payment method selection.
                            </p>

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

                    {/* ── Deposit Confirmation ── */}
                    <Card title="Deposit Confirmation">
                        <div className="space-y-4">
                            <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-800">
                                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">
                                    Required Deposit (10%)
                                </p>
                                <p className="text-2xl font-bold text-white font-mono">
                                    ${project.quote?.total
                                        ? (project.quote.total * 0.1).toLocaleString()
                                        : '—'
                                    }
                                </p>
                            </div>
                            <Button
                                id="sv-confirm-payment-btn"
                                variant="secondary"
                                className="w-full flex items-center justify-center gap-2"
                            >
                                <DocumentCheckIcon className="w-4 h-4" />
                                Confirm Payment Received
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>

            {/* ── Digital Signature ── */}
            <Card title="Signature Verification">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-800">
                        <div className="flex items-center gap-3">
                            <PencilSquareIcon className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-300 text-sm">Digital Contract</span>
                        </div>
                        <StatusBadge ready={false} />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-800">
                        <div className="flex items-center gap-3">
                            <ShieldCheckIcon className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-300 text-sm">Customer Agreement</span>
                        </div>
                        <StatusBadge ready={linkSent} />
                    </div>
                </div>
            </Card>
        </div>
    );
};

const SignAndVerifyPage: React.FC = () => (
    <ProjectStageLayout stageLabel="Sign & Verify" stagePageId="E-29">
        {(project) => <SignAndVerifyContent project={project} />}
    </ProjectStageLayout>
);

export default SignAndVerifyPage;