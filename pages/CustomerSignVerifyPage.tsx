
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { CircuitryBackground } from '../components/CircuitryBackground';
import { RhiveLogo } from '../components/icons';
import {
    ArrowUpTrayIcon,
    CheckCircleIcon,
    HomeIcon,
    ShieldCheckIcon,
} from '../components/icons';
import { db, storage } from '../lib/firebase';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ref as storageRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

type PaymentMethod = 'deductible' | 'acv' | null;

interface ProjectData {
    id: string;
    name?: string;
    property_address?: string;
    property?: { address?: string; city?: string; state?: string };
    quote?: { total?: number };
}

// ── File Upload Zone ──────────────────────────────────────────────────────────

const FileUploadZone: React.FC<{
    id: string; label: string; placeholder: string;
    accept?: string; file: File | null; onFile: (f: File | null) => void;
    disabled?: boolean; progress?: number | null;
}> = ({ id, label, placeholder, accept = '.pdf,.jpg,.jpeg,.png', file, onFile, disabled, progress }) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [dragOver, setDragOver] = useState(false);

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (disabled) return;
        setDragOver(false);
        const dropped = e.dataTransfer.files[0];
        if (dropped) onFile(dropped);
    }, [onFile, disabled]);

    return (
        <div className="space-y-2">
            <label htmlFor={id} className="block text-xs font-bold uppercase tracking-widest text-gray-400">{label}</label>
            <div
                onDragOver={(e) => { e.preventDefault(); if (!disabled) setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => !disabled && inputRef.current?.click()}
                className={`relative rounded-xl border-2 border-dashed p-6 flex flex-col items-center justify-center gap-3 transition-all duration-200
                    ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
                    ${dragOver ? 'border-[#ec028b] bg-[#ec028b]/10'
                        : file ? 'border-emerald-500/60 bg-emerald-500/5'
                        : 'border-gray-700 bg-gray-900/40 hover:border-[#ec028b]/50 hover:bg-[#ec028b]/5'}`}>
                <input ref={inputRef} id={id} type="file" accept={accept}
                    onChange={(e) => onFile(e.target.files?.[0] ?? null)}
                    className="hidden" disabled={disabled} aria-label={label} />
                {progress !== null && progress !== undefined && progress < 100 ? (
                    <div className="w-full space-y-2">
                        <p className="text-gray-400 text-xs text-center font-semibold">Uploading…</p>
                        <div className="w-full bg-gray-800 rounded-full h-1.5">
                            <div className="bg-[#ec028b] h-1.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
                        </div>
                        <p className="text-gray-600 text-xs text-center">{progress.toFixed(0)}%</p>
                    </div>
                ) : file ? (
                    <>
                        <CheckCircleIcon className="w-8 h-8 text-emerald-400" />
                        <div className="text-center">
                            <p className="text-emerald-400 font-bold text-sm truncate max-w-[240px]">{file.name}</p>
                            <p className="text-gray-500 text-xs mt-0.5">{(file.size / 1024).toFixed(1)} KB · click to replace</p>
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

// ── Toggle Switch ─────────────────────────────────────────────────────────────

const ToggleSwitch: React.FC<{
    id: string; checked: boolean; onChange: (val: boolean) => void;
    label: string; disabled?: boolean;
}> = ({ id, checked, onChange, label, disabled }) => (
    <div className="flex items-start gap-4">
        <button id={id} type="button" role="switch" aria-checked={checked} disabled={disabled}
            onClick={() => !disabled && onChange(!checked)}
            className={`relative flex-none w-12 h-6 rounded-full border-2 transition-all duration-200 focus:outline-none
                ${checked ? 'bg-[#ec028b] border-[#ec028b] shadow-[0_0_12px_rgba(236,2,139,0.4)]' : 'bg-gray-800 border-gray-600'}
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
            <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-md transition-all duration-200 ${checked ? 'translate-x-6' : 'translate-x-0'}`} />
        </button>
        <label htmlFor={id} className={`text-sm leading-relaxed mt-0.5 ${disabled ? 'opacity-50' : 'text-gray-300 cursor-pointer'}`}
            onClick={() => !disabled && onChange(!checked)}>{label}</label>
    </div>
);

// ── Payment Method Tile ───────────────────────────────────────────────────────

const PaymentTile: React.FC<{
    id: string; value: PaymentMethod; selected: PaymentMethod;
    onSelect: (v: PaymentMethod) => void; icon: string;
    title: string; description: string; disabled?: boolean;
}> = ({ id, value, selected, onSelect, icon, title, description, disabled }) => {
    const isSelected = selected === value;
    return (
        <button id={id} type="button" disabled={disabled} onClick={() => !disabled && onSelect(value)}
            className={`relative w-full text-left p-5 rounded-xl border-2 transition-all duration-200 focus:outline-none
                ${isSelected ? 'border-[#ec028b] bg-[#ec028b]/10 shadow-[0_0_20px_rgba(236,2,139,0.2)]' : 'border-gray-700 bg-gray-900/40 hover:border-gray-600'}
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            aria-pressed={isSelected}>
            <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{icon}</span>
                <span className={`font-bold text-base ${isSelected ? 'text-[#ec028b]' : 'text-white'}`}>{title}</span>
                {isSelected && <CheckCircleIcon className="w-4 h-4 text-[#ec028b] ml-auto flex-none" />}
            </div>
            <p className="text-gray-400 text-xs leading-relaxed">{description}</p>
        </button>
    );
};

// ── Main Page ─────────────────────────────────────────────────────────────────

const CustomerSignVerifyPage: React.FC = () => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token') || '';

    const [project, setProject] = useState<ProjectData | null>(null);
    const [loadingProject, setLoadingProject] = useState(true);
    const [projectError, setProjectError] = useState('');

    const [policyClaimNumber, setPolicyClaimNumber] = useState('');
    const [policyFile, setPolicyFile] = useState<File | null>(null);
    const [scopeFile, setScopeFile] = useState<File | null>(null);
    const [permitFile, setPermitFile] = useState<File | null>(null);
    const [permitUploadProgress, setPermitUploadProgress] = useState<number | null>(null);
    const [permitUploadUrl, setPermitUploadUrl] = useState<string>('');
    const [agreed, setAgreed] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null);

    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [submitError, setSubmitError] = useState('');

    useEffect(() => {
        if (!token) {
            setLoadingProject(false);
            setProjectError('No project token found in the link. Please check your email and try again.');
            return;
        }
        (async () => {
            try {
                let data: ProjectData | null = null;
                const projSnap = await getDoc(doc(db, 'projects', token));
                if (projSnap.exists()) {
                    data = { id: projSnap.id, ...projSnap.data() } as ProjectData;
                } else {
                    const leadSnap = await getDoc(doc(db, 'leads', token));
                    if (leadSnap.exists()) data = { id: leadSnap.id, ...leadSnap.data() } as ProjectData;
                }
                if (data) setProject(data);
                else setProjectError('Project not found. Please contact RHIVE Construction for assistance.');
            } catch {
                setProjectError('Unable to load project details. Please try again or contact RHIVE Construction.');
            } finally {
                setLoadingProject(false);
            }
        })();
    }, [token]);

    const getAddress = (p: ProjectData) => {
        if (p.property?.address) return [p.property.address, p.property.city, p.property.state].filter(Boolean).join(', ');
        return p.property_address || '';
    };

    const handlePermitFileChange = async (file: File | null) => {
        setPermitFile(file);
        if (!file || !project?.id) return;
        setPermitUploadProgress(0);
        setPermitUploadUrl('');
        try {
            const path = `sign-verify/${project.id}/purchase-permit/${Date.now()}_${file.name}`;
            const uploadTask = uploadBytesResumable(storageRef(storage, path), file);
            uploadTask.on('state_changed',
                (snap) => setPermitUploadProgress((snap.bytesTransferred / snap.totalBytes) * 100),
                () => { setPermitUploadProgress(null); setSubmitError('Permit upload failed. Please try again.'); },
                async () => {
                    const url = await getDownloadURL(uploadTask.snapshot.ref);
                    setPermitUploadUrl(url);
                    setPermitUploadProgress(100);
                    const colPath = (project as any)._source === 'leads' ? 'leads' : 'projects';
                    await updateDoc(doc(db, colPath, project.id), {
                        purchase_permit_url: url,
                        purchase_permit_file_name: file.name,
                        purchase_permit_uploaded_at: serverTimestamp(),
                        updated_at: new Date().toISOString(),
                    });
                },
            );
        } catch {
            setPermitUploadProgress(null);
            setSubmitError('Permit upload failed. Please try again.');
        }
    };

    const isFormValid = policyClaimNumber.trim().length > 0 && agreed && paymentMethod !== null && !!permitFile;
    const isUploadReady = !permitFile || !!permitUploadUrl || (permitUploadProgress ?? 0) >= 100;

    const handleSubmit = async () => {
        if (!isFormValid || submitting || !project) return;
        if (!isUploadReady) { setSubmitError('Please wait for the purchase permit to finish uploading.'); return; }
        setSubmitting(true);
        setSubmitError('');
        try {
            const colPath = (project as any)._source === 'leads' ? 'leads' : 'projects';
            await updateDoc(doc(db, colPath, project.id), {
                sign_verify_customer_data: {
                    policy_claim_number: policyClaimNumber.trim(),
                    payment_method: paymentMethod,
                    agreed_to_terms: true,
                    policy_file_name: policyFile?.name || null,
                    scope_file_name: scopeFile?.name || null,
                    submitted_at: new Date().toISOString(),
                },
                sign_verify_status: 'customer_submitted',
                updated_at: new Date().toISOString(),
            });
            setSubmitted(true);
        } catch {
            setSubmitError('Submission failed. Please check your connection and try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleBackToHome = () => { window.location.href = '/'; };

    // Loading
    if (loadingProject) return (
        <div className="fixed inset-0 bg-black flex items-center justify-center">
            <CircuitryBackground backgroundColor="#000000" dotColor="#ec028b" lineColor="236, 2, 139" />
            <div className="relative z-10 flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-2 border-[#ec028b] border-t-transparent rounded-full animate-spin" />
                <p className="text-gray-400 text-sm font-mono uppercase tracking-widest">Loading your verification form…</p>
            </div>
        </div>
    );

    // Error
    if (projectError || !project) return (
        <div className="fixed inset-0 bg-black flex items-center justify-center px-6">
            <CircuitryBackground backgroundColor="#000000" dotColor="#ec028b" lineColor="236, 2, 139" />
            <div className="relative z-10 max-w-md w-full bg-gray-900/80 border border-gray-800 rounded-2xl p-8 text-center space-y-6 backdrop-blur-sm">
                <RhiveLogo className="h-10 mx-auto" />
                <h1 className="text-white font-bold text-xl">Verification Link Issue</h1>
                <p className="text-gray-400 text-sm leading-relaxed">{projectError || 'This link appears to be invalid or has expired.'}</p>
                <p className="text-gray-500 text-xs">Contact RHIVE Construction at{' '}
                    <a href="tel:+18014410024" className="text-[#ec028b] hover:underline">(801) 441-0024</a></p>
                <button id="csv-error-home-btn" onClick={handleBackToHome}
                    className="flex items-center gap-2 mx-auto px-6 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white font-bold hover:border-[#ec028b]/50 transition-all">
                    <HomeIcon className="w-4 h-4" /> Back to Homepage
                </button>
            </div>
        </div>
    );

    // Success
    if (submitted) return (
        <div className="fixed inset-0 bg-black flex items-center justify-center px-6">
            <CircuitryBackground backgroundColor="#000000" dotColor="#ec028b" lineColor="236, 2, 139" />
            <div className="relative z-10 max-w-lg w-full bg-gray-900/80 border border-[#ec028b]/30 rounded-2xl p-10 text-center space-y-6 backdrop-blur-sm shadow-[0_0_40px_rgba(236,2,139,0.1)]">
                <CheckCircleIcon className="w-16 h-16 text-emerald-400 mx-auto" />
                <RhiveLogo className="h-8 mx-auto" />
                <h1 className="text-white font-extrabold text-2xl">You're All Set!</h1>
                <p className="text-gray-400 text-sm leading-relaxed">
                    Your insurance verification and purchase permit have been submitted to RHIVE Construction.
                    Our team will review your details and reach out to confirm next steps.
                </p>
                <div className="bg-black/40 border border-gray-800 rounded-xl p-4 text-left space-y-2">
                    <p className="text-[10px] text-gray-600 uppercase font-bold tracking-widest">What happens next</p>
                    <ul className="text-gray-400 text-xs space-y-1.5">
                        {[
                            'Your RHIVE rep will review your claim details & confirm your policy claim number.',
                            'Your purchase permit will be verified by our administration team.',
                            'We\'ll coordinate with your insurance carrier and schedule the installation.',
                        ].map((t) => (
                            <li key={t} className="flex items-start gap-2"><span className="text-[#ec028b] mt-0.5">→</span> {t}</li>
                        ))}
                    </ul>
                </div>
                <button id="csv-success-home-btn" onClick={handleBackToHome}
                    className="flex items-center gap-2 mx-auto px-6 py-3 bg-[#ec028b]/10 border border-[#ec028b]/40 rounded-xl text-[#ec028b] font-bold hover:bg-[#ec028b]/20 transition-all">
                    <HomeIcon className="w-4 h-4" /> Back to Homepage
                </button>
            </div>
        </div>
    );

    // Main Form
    return (
        <div className="fixed inset-0 bg-black overflow-y-auto">
            <CircuitryBackground backgroundColor="#000000" dotColor="#ec028b" lineColor="236, 2, 139" />
            <div className="relative z-10 min-h-full py-12 px-4 sm:px-6 flex flex-col items-center">

                {/* Header */}
                <div className="w-full max-w-2xl mb-8 flex items-center justify-between">
                    <RhiveLogo className="h-10" />
                    <button id="csv-top-home-btn" onClick={handleBackToHome}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-900/80 border border-gray-700 rounded-xl text-gray-400 text-sm font-bold hover:text-white hover:border-gray-600 transition-all">
                        <HomeIcon className="w-4 h-4" /> Homepage
                    </button>
                </div>

                {/* Project Banner */}
                <div className="w-full max-w-2xl mb-6 bg-gray-900/60 border border-gray-800 rounded-2xl p-5 backdrop-blur-sm">
                    <p className="text-[10px] text-gray-600 uppercase font-bold tracking-widest mb-1">Your Project</p>
                    <h2 className="text-white font-extrabold text-lg">{project.name || 'RHIVE Roofing Project'}</h2>
                    {getAddress(project) && <p className="text-gray-500 text-sm mt-0.5">{getAddress(project)}</p>}
                    <div className="mt-3 flex items-center gap-2">
                        <span className="text-[10px] text-amber-400 font-bold uppercase tracking-widest px-2 py-0.5 rounded border border-amber-500/30 bg-amber-500/10">Sign &amp; Verify Stage</span>
                        <span className="text-[10px] text-gray-600 font-mono">Ref: {project.id?.slice(-8).toUpperCase()}</span>
                    </div>
                </div>

                {/* Hero */}
                <div className="w-full max-w-2xl mb-6 text-center">
                    <div className="flex items-center justify-center gap-3 mb-3">
                        <ShieldCheckIcon className="w-8 h-8 text-[#ec028b]" />
                        <h1 className="text-white font-extrabold text-2xl">Insurance Verification Form</h1>
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed max-w-lg mx-auto">
                        Please complete all sections below to help us process your insurance claim accurately.
                        Your information is secure and used only for your roofing project.
                    </p>
                </div>

                <div className="w-full max-w-2xl space-y-6">

                    {/* Step 1: Claim Number */}
                    <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 backdrop-blur-sm space-y-4">
                        <h3 className="text-white font-bold text-base flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-[#ec028b]/20 border border-[#ec028b]/40 text-[#ec028b] text-xs font-black flex items-center justify-center">1</span>
                            Policy Claim Number
                        </h3>
                        <div className="space-y-2">
                            <label htmlFor="csv-claim-number" className="block text-xs font-bold uppercase tracking-widest text-gray-400">
                                Insurance Claim Number <span className="text-[#ec028b]">*</span>
                            </label>
                            <input id="csv-claim-number" type="text" value={policyClaimNumber}
                                onChange={(e) => setPolicyClaimNumber(e.target.value)}
                                placeholder="e.g. CLM-2024-00123456"
                                className="w-full bg-black/60 border border-gray-700 rounded-xl px-4 py-3 text-white font-mono placeholder-gray-600 focus:outline-none focus:border-[#ec028b]/60 transition-all"
                                aria-required="true" />
                            <p className="text-gray-600 text-xs">Find your claim number on your insurance company's claim confirmation letter or email.</p>
                        </div>
                    </div>

                    {/* Step 2: Insurance Documents */}
                    <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 backdrop-blur-sm space-y-5">
                        <h3 className="text-white font-bold text-base flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-[#ec028b]/20 border border-[#ec028b]/40 text-[#ec028b] text-xs font-black flex items-center justify-center">2</span>
                            Insurance Documents
                        </h3>
                        <FileUploadZone id="csv-policy-claim-file" label="Insurance Policy Claim Document *"
                            placeholder="Upload your official insurance policy claim document from your carrier confirming your claim number, coverage, and scope of loss."
                            file={policyFile} onFile={setPolicyFile} />
                        <div className="border-t border-gray-800/50" />
                        <FileUploadZone id="csv-scope-of-work-file" label="Scope of Work or Supporting Documents (Optional)"
                            placeholder="You may upload a scope of work document here. If your claim document already includes the full scope of loss, this is optional."
                            file={scopeFile} onFile={setScopeFile} />
                    </div>

                    {/* Step 3: Purchase Permit */}
                    <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 backdrop-blur-sm space-y-5">
                        <h3 className="text-white font-bold text-base flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-[#ec028b]/20 border border-[#ec028b]/40 text-[#ec028b] text-xs font-black flex items-center justify-center">3</span>
                            Purchase Permit <span className="text-[#ec028b] text-xs ml-1">*</span>
                        </h3>
                        <div className="bg-black/30 border border-gray-800 rounded-xl p-3">
                            <p className="text-gray-400 text-xs leading-relaxed">
                                Please upload your purchase permit document as proof that payment has been arranged.
                                This will be reviewed and verified by the RHIVE administration team before your project proceeds to scheduling.
                            </p>
                        </div>
                        <FileUploadZone id="csv-purchase-permit-file" label="Purchase Permit *"
                            placeholder="Upload your purchase permit. Required to verify your payment arrangement before scheduling can begin."
                            file={permitFile} onFile={handlePermitFileChange} progress={permitUploadProgress} />
                        {permitUploadUrl && (
                            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                                <CheckCircleIcon className="w-4 h-4" /> Purchase permit uploaded successfully
                            </div>
                        )}
                    </div>

                    {/* Step 4: Payment Method */}
                    <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 backdrop-blur-sm space-y-4">
                        <h3 className="text-white font-bold text-base flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-[#ec028b]/20 border border-[#ec028b]/40 text-[#ec028b] text-xs font-black flex items-center justify-center">4</span>
                            Payment Method Selection <span className="text-[#ec028b] text-xs ml-1">*</span>
                        </h3>
                        <p className="text-gray-500 text-xs">Select how you intend to fulfill your portion of the payment. This helps us align with your insurance arrangement.</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <PaymentTile id="csv-payment-deductible" value="deductible" selected={paymentMethod} onSelect={setPaymentMethod}
                                icon="🧾" title="Deductible Payment"
                                description="I will pay my insurance deductible amount directly to RHIVE Construction. My carrier will pay the remaining approved amount." />
                            <PaymentTile id="csv-payment-acv" value="acv" selected={paymentMethod} onSelect={setPaymentMethod}
                                icon="🛡️" title="ACV Payment"
                                description="I will pay the Actual Cash Value (ACV) as determined by my insurance carrier. A supplemental RCV claim may be filed after installation." />
                        </div>
                    </div>

                    {/* Step 5: Agreement */}
                    <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 backdrop-blur-sm space-y-4">
                        <h3 className="text-white font-bold text-base flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-[#ec028b]/20 border border-[#ec028b]/40 text-[#ec028b] text-xs font-black flex items-center justify-center">5</span>
                            Authorization Agreement <span className="text-[#ec028b] text-xs ml-1">*</span>
                        </h3>
                        <div className="bg-black/40 border border-gray-800 rounded-xl p-4 text-xs text-gray-500 leading-relaxed space-y-2">
                            <p className="font-bold text-gray-400 uppercase tracking-widest text-[10px]">Authorization &amp; Truth of Information Agreement</p>
                            <ul className="list-disc list-inside space-y-1 pl-2">
                                <li>All insurance policy information I have provided is <strong className="text-gray-300">true, accurate, and complete</strong> to the best of my knowledge.</li>
                                <li>I authorize <strong className="text-gray-300">RHIVE Construction</strong> to act as my authorized representative in matters related to the insurance claim for my roofing project.</li>
                                <li>I consent to RHIVE Construction sharing uploaded documentation with my insurance carrier as necessary to complete the claim process.</li>
                                <li>I understand that submitting false or misleading insurance claim information may result in denial of coverage and/or legal consequences.</li>
                            </ul>
                        </div>
                        <ToggleSwitch id="csv-agreement-toggle" checked={agreed} onChange={setAgreed}
                            label="I confirm that the information I have provided is true and correct, and I authorize RHIVE Construction to act on my behalf regarding this insurance claim." />
                    </div>

                    {/* Validation hints */}
                    {submitError && <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm">{submitError}</div>}
                    {!isFormValid && (
                        <div className="flex flex-wrap gap-2">
                            {!policyClaimNumber.trim() && <span className="text-[10px] text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-full px-3 py-1 font-bold uppercase tracking-widest">Enter claim number</span>}
                            {!permitFile && <span className="text-[10px] text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-full px-3 py-1 font-bold uppercase tracking-widest">Upload purchase permit</span>}
                            {!paymentMethod && <span className="text-[10px] text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-full px-3 py-1 font-bold uppercase tracking-widest">Select payment method</span>}
                            {!agreed && <span className="text-[10px] text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-full px-3 py-1 font-bold uppercase tracking-widest">Enable agreement toggle</span>}
                        </div>
                    )}

                    {/* Submit */}
                    <div className="flex flex-col sm:flex-row gap-4 pb-12">
                        <button id="csv-submit-btn" type="button" onClick={handleSubmit}
                            disabled={!isFormValid || submitting || !isUploadReady}
                            className={`flex-1 flex items-center justify-center gap-3 py-4 px-8 rounded-xl font-black text-base uppercase tracking-wider transition-all duration-200
                                ${isFormValid && !submitting && isUploadReady
                                    ? 'bg-[#ec028b] text-white shadow-[0_0_20px_rgba(236,2,139,0.3)] hover:shadow-[0_0_30px_rgba(236,2,139,0.5)] hover:bg-[#d4017d] cursor-pointer'
                                    : 'bg-gray-800 text-gray-600 border border-gray-700 cursor-not-allowed'}`}>
                            {submitting
                                ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Submitting…</>
                                : <><ShieldCheckIcon className="w-5 h-5" /> Submit Verification</>}
                        </button>
                        <button id="csv-bottom-home-btn" type="button" onClick={handleBackToHome}
                            className="flex items-center justify-center gap-2 py-4 px-6 rounded-xl border border-gray-700 text-gray-400 font-bold text-sm hover:text-white hover:border-gray-600 transition-all">
                            <HomeIcon className="w-4 h-4" /> Back to Homepage
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerSignVerifyPage;
