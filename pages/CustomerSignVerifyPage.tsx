import React, { useState, useRef, useCallback, useEffect } from 'react';
import { CircuitryBackground } from '../components/CircuitryBackground';
import {
    RhiveLogo,
    ArrowUpTrayIcon,
    CheckCircleIcon,
    HomeIcon,
    ShieldCheckIcon,
} from '../components/icons';
import { db, storage } from '../lib/firebase';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ref as storageRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { resolvePaymentModel, PAYMENT_MODEL_LABELS, PaymentModelKey } from '../lib/qosRules';

type PaymentMethod =
    | 'deductible'
    | 'acv'
    | 'deposit_50'
    | 'financing_enhancify'
    | 'repair_100'
    | 'po_net_30'
    | null;

interface ProjectData {
    id: string;
    _source?: string;
    job_number?: string;
    project_code?: string;
    name?: string;
    project_type?: string;
    property_address?: string;
    property?: { address?: string; city?: string; state?: string };
    quote?: { total?: number; tierName?: string };
    insurance?: { carrier?: string; claimNumber?: string; claim_number?: string; deductible?: number };
    compliance?: { solicitation_num?: string };
    color_lock?: string;
    contact_name?: string;
    payment_model?: PaymentModelKey;
}

const SHINGLE_COLOR_OPTIONS = [
    'Onyx Black',
    'Estate Gray',
    'Driftwood',
    'Teak',
    'Brownwood',
    'Midnight Plum',
    'Williamsburg Gray',
    'White TPO / PVC Reflective Membrane',
    'Tan / Gray Commercial Membrane',
    'Match Existing Roof Profile (Repair)',
];

const FileUploadZone: React.FC<{
    id: string;
    label: string;
    placeholder: string;
    accept?: string;
    file: File | null;
    onFile: (f: File | null) => void;
    disabled?: boolean;
    progress?: number | null;
}> = ({ id, label, placeholder, accept = '.pdf,.jpg,.jpeg,.png', file, onFile, disabled, progress }) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [dragOver, setDragOver] = useState(false);

    const handleDrop = useCallback(
        (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            if (disabled) return;
            setDragOver(false);
            const dropped = e.dataTransfer.files[0];
            if (dropped) onFile(dropped);
        },
        [onFile, disabled]
    );

    return (
        <div className="space-y-2">
            <label htmlFor={id} className="block text-xs font-bold uppercase tracking-widest text-gray-400">
                {label}
            </label>
            <div
                onDragOver={(e) => {
                    e.preventDefault();
                    if (!disabled) setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => !disabled && inputRef.current?.click()}
                className={`relative rounded-xl border-2 border-dashed p-6 flex flex-col items-center justify-center gap-3 transition-all duration-200
                    ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
                    ${
                        dragOver
                            ? 'border-[#ec028b] bg-[#ec028b]/10'
                            : file
                            ? 'border-emerald-500/60 bg-emerald-500/5'
                            : 'border-gray-700 bg-gray-900/40 hover:border-[#ec028b]/50 hover:bg-[#ec028b]/5'
                    }`}
            >
                <input
                    ref={inputRef}
                    id={id}
                    type="file"
                    accept={accept}
                    onChange={(e) => onFile(e.target.files?.[0] ?? null)}
                    className="hidden"
                    disabled={disabled}
                    aria-label={label}
                />
                {progress !== null && progress !== undefined && progress < 100 ? (
                    <div className="w-full space-y-2">
                        <p className="text-gray-400 text-xs text-center font-semibold">Uploading…</p>
                        <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
                            <div
                                className="bg-[#ec028b] h-1.5 rounded-full transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <p className="text-gray-500 text-xs text-center">{progress.toFixed(0)}%</p>
                    </div>
                ) : file ? (
                    <>
                        <CheckCircleIcon className="w-8 h-8 text-emerald-400" />
                        <div className="text-center">
                            <p className="text-emerald-400 font-bold text-sm truncate max-w-[240px]">{file.name}</p>
                            <p className="text-gray-500 text-xs mt-0.5">
                                {(file.size / 1024).toFixed(1)} KB · click to replace
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

const ToggleSwitch: React.FC<{
    id: string;
    checked: boolean;
    onChange: (val: boolean) => void;
    label: string;
    disabled?: boolean;
}> = ({ id, checked, onChange, label, disabled }) => (
    <div className="flex items-start gap-4">
        <button
            id={id}
            type="button"
            role="switch"
            aria-checked={checked}
            disabled={disabled}
            onClick={() => !disabled && onChange(!checked)}
            className={`relative flex-none w-12 h-6 rounded-full border-2 transition-all duration-200 focus:outline-none
                ${checked ? 'bg-[#ec028b] border-[#ec028b] shadow-[0_0_12px_rgba(236,2,139,0.4)]' : 'bg-gray-800 border-gray-600'}
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
            <span
                className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-md transition-all duration-200 ${
                    checked ? 'translate-x-6' : 'translate-x-0'
                }`}
            />
        </button>
        <label
            htmlFor={id}
            className={`text-sm leading-relaxed mt-0.5 ${disabled ? 'opacity-50' : 'text-gray-300 cursor-pointer'}`}
            onClick={() => !disabled && onChange(!checked)}
        >
            {label}
        </label>
    </div>
);

const PaymentTile: React.FC<{
    id: string;
    value: PaymentMethod;
    selected: PaymentMethod;
    onSelect: (v: PaymentMethod) => void;
    icon: string;
    title: string;
    description: string;
    disabled?: boolean;
}> = ({ id, value, selected, onSelect, icon, title, description, disabled }) => {
    const isSelected = selected === value;
    return (
        <button
            id={id}
            type="button"
            disabled={disabled}
            onClick={() => !disabled && onSelect(value)}
            className={`relative w-full text-left p-5 rounded-xl border-2 transition-all duration-200 focus:outline-none
                ${
                    isSelected
                        ? 'border-[#ec028b] bg-[#ec028b]/10 shadow-[0_0_20px_rgba(236,2,139,0.2)]'
                        : 'border-gray-700 bg-gray-900/40 hover:border-gray-600'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            aria-pressed={isSelected}
        >
            <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{icon}</span>
                <span className={`font-bold text-base ${isSelected ? 'text-[#ec028b]' : 'text-white'}`}>{title}</span>
                {isSelected && <CheckCircleIcon className="w-4 h-4 text-[#ec028b] ml-auto flex-none" />}
            </div>
            <p className="text-gray-400 text-xs leading-relaxed">{description}</p>
        </button>
    );
};

const CustomerSignVerifyPage: React.FC = () => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token') || '';

    const [project, setProject] = useState<ProjectData | null>(null);
    const [loadingProject, setLoadingProject] = useState(true);
    const [projectError, setProjectError] = useState('');

    // Polymorphic fields across Insurance, Retail, Commercial, Repair, and Gov/MSA
    const [signerName, setSignerName] = useState('');
    const [selectedColor, setSelectedColor] = useState(SHINGLE_COLOR_OPTIONS[0]);
    const [poNumber, setPoNumber] = useState('');
    const [policyClaimNumber, setPolicyClaimNumber] = useState('');
    const [policyFile, setPolicyFile] = useState<File | null>(null);
    const [scopeFile, setScopeFile] = useState<File | null>(null);
    const [permitFile, setPermitFile] = useState<File | null>(null);
    const [permitUploadProgress, setPermitUploadProgress] = useState<number | null>(null);
    const [permitUploadUrl, setPermitUploadUrl] = useState<string>('');
    const [fastTrackWaiver, setFastTrackWaiver] = useState(false);
    const [agreed, setAgreed] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null);

    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [submitError, setSubmitError] = useState('');

    useEffect(() => {
        if (!token) {
            setLoadingProject(false);
            setProjectError('No project token found in the link. Check your invitation link or contact RHIVE Construction.');
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
                    if (leadSnap.exists()) data = { id: leadSnap.id, _source: 'leads', ...leadSnap.data() } as ProjectData;
                }
                if (data) {
                    setProject(data);
                    const model = resolvePaymentModel(data);
                    setSignerName(data.contact_name?.replace(/^\[TEST\]\s*/i, '') || '');
                    if (data.color_lock) setSelectedColor(data.color_lock);
                    if (data.compliance?.solicitation_num) setPoNumber(data.compliance.solicitation_num);
                    const existingClaim = data.insurance?.claimNumber || data.insurance?.claim_number || '';
                    if (existingClaim) setPolicyClaimNumber(existingClaim);

                    if (model === 'insurance_acv_rcv') setPaymentMethod('deductible');
                    else if (model === 'repair_100') setPaymentMethod('repair_100');
                    else if (model === 'msa_net_30') setPaymentMethod('po_net_30');
                    else setPaymentMethod('deposit_50');
                } else {
                    setProjectError('Project record not found. Contact RHIVE Construction at (801) 441-0024 for assistance.');
                }
            } catch {
                setProjectError('Unable to load project details. Try refreshing or contact RHIVE Construction.');
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
            uploadTask.on(
                'state_changed',
                (snap) => setPermitUploadProgress((snap.bytesTransferred / snap.totalBytes) * 100),
                () => {
                    setPermitUploadProgress(null);
                    setSubmitError('Document upload failed. Please try again.');
                },
                async () => {
                    const url = await getDownloadURL(uploadTask.snapshot.ref);
                    setPermitUploadUrl(url);
                    setPermitUploadProgress(100);
                    const colPath = project._source === 'leads' ? 'leads' : 'projects';
                    await updateDoc(doc(db, colPath, project.id), {
                        purchase_permit_url: url,
                        purchase_permit_file_name: file.name,
                        purchase_permit_uploaded_at: serverTimestamp(),
                        updated_at: new Date().toISOString(),
                    });
                }
            );
        } catch {
            setPermitUploadProgress(null);
            setSubmitError('Document upload failed. Please try again.');
        }
    };

    const paymentModel: PaymentModelKey = project ? resolvePaymentModel(project) : 'retail_50_40_10';
    const isInsuranceFlow = paymentModel === 'insurance_acv_rcv';
    const isRepairFlow = paymentModel === 'repair_100';
    const isMsaFlow = paymentModel === 'msa_net_30';

    const isFormValid = isInsuranceFlow
        ? policyClaimNumber.trim().length > 0 && signerName.trim().length > 1 && agreed && paymentMethod !== null
        : signerName.trim().length > 1 &&
          agreed &&
          paymentMethod !== null &&
          (!isMsaFlow || poNumber.trim().length > 0);

    const isUploadReady = !permitFile || !!permitUploadUrl || (permitUploadProgress ?? 0) >= 100;

    const handleSubmit = async () => {
        if (!isFormValid || submitting || !project) return;
        if (!isUploadReady) {
            setSubmitError('Wait for your document upload to reach 100% before submitting.');
            return;
        }
        setSubmitting(true);
        setSubmitError('');
        try {
            const colPath = project._source === 'leads' ? 'leads' : 'projects';
            const payload: Record<string, any> = {
                contract_signed: true,
                color_lock: selectedColor,
                sign_verify_customer_data: {
                    signer_name: signerName.trim(),
                    color_selected: selectedColor,
                    payment_model: paymentModel,
                    payment_method: paymentMethod,
                    po_number: poNumber.trim() || null,
                    policy_claim_number: policyClaimNumber.trim() || null,
                    fast_track_waiver: fastTrackWaiver,
                    agreed_to_terms: true,
                    policy_file_name: policyFile?.name || null,
                    scope_file_name: scopeFile?.name || null,
                    permit_file_name: permitFile?.name || null,
                    submitted_at: new Date().toISOString(),
                },
                sign_verify_status: 'customer_submitted',
                updated_at: new Date().toISOString(),
            };
            if (isInsuranceFlow && policyClaimNumber.trim()) {
                payload.insurance = {
                    ...(project.insurance || {}),
                    claimNumber: policyClaimNumber.trim(),
                    claim_number: policyClaimNumber.trim(),
                };
            }
            await updateDoc(doc(db, colPath, project.id), payload);
            setSubmitted(true);
        } catch {
            setSubmitError('Submission failed. Check your connection and try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleBackToHome = () => {
        window.location.href = '/';
    };

    if (loadingProject) {
        return (
            <div className="fixed inset-0 bg-black flex items-center justify-center">
                <CircuitryBackground backgroundColor="#000000" dotColor="#ec028b" lineColor="236, 2, 139" />
                <div className="relative z-10 flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-2 border-[#ec028b] border-t-transparent rounded-full animate-spin" />
                    <p className="text-gray-400 text-sm font-mono uppercase tracking-widest">
                        Loading your RHIVE agreement…
                    </p>
                </div>
            </div>
        );
    }

    if (projectError || !project) {
        return (
            <div className="fixed inset-0 bg-black flex items-center justify-center px-6">
                <CircuitryBackground backgroundColor="#000000" dotColor="#ec028b" lineColor="236, 2, 139" />
                <div className="relative z-10 max-w-md w-full bg-gray-900/80 border border-gray-800 rounded-2xl p-8 text-center space-y-6 backdrop-blur-sm">
                    <RhiveLogo className="h-10 mx-auto" />
                    <h1 className="text-white font-bold text-xl">Verification Link Issue</h1>
                    <p className="text-gray-400 text-sm leading-relaxed">
                        {projectError || 'This link appears to be invalid or expired.'}
                    </p>
                    <p className="text-gray-500 text-xs">
                        Contact RHIVE Construction at{' '}
                        <a href="tel:+18014410024" className="text-[#ec028b] hover:underline">
                            (801) 441-0024
                        </a>
                    </p>
                    <button
                        id="csv-error-home-btn"
                        onClick={handleBackToHome}
                        className="flex items-center gap-2 mx-auto px-6 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white font-bold hover:border-[#ec028b]/50 transition-all"
                    >
                        <HomeIcon className="w-4 h-4" /> Back
                    </button>
                </div>
            </div>
        );
    }

    if (submitted) {
        return (
            <div className="fixed inset-0 bg-black flex items-center justify-center px-6">
                <CircuitryBackground backgroundColor="#000000" dotColor="#ec028b" lineColor="236, 2, 139" />
                <div className="relative z-10 max-w-lg w-full bg-gray-900/80 border border-[#ec028b]/30 rounded-2xl p-10 text-center space-y-6 backdrop-blur-sm shadow-[0_0_40px_rgba(236,2,139,0.1)]">
                    <CheckCircleIcon className="w-16 h-16 text-emerald-400 mx-auto" />
                    <RhiveLogo className="h-8 mx-auto" />
                    <h1 className="text-white font-extrabold text-2xl">Authorization Confirmed</h1>
                    <p className="text-gray-400 text-sm leading-relaxed">
                        Thank you, {signerName}. Your signed authorization and project selections ({selectedColor}) are
                        locked in with RHIVE Construction.
                    </p>
                    <div className="bg-black/40 border border-gray-800 rounded-xl p-4 text-left space-y-2">
                        <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Next Milestones</p>
                        <ul className="text-gray-300 text-xs space-y-1.5">
                            <li className="flex items-start gap-2">
                                <span className="text-[#ec028b] mt-0.5">→</span>
                                Operations confirms your permit, material PO, and certified crew window.
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-[#ec028b] mt-0.5">→</span>
                                Track every live step inside your Client Portal Pizza Tracker (including Wednesday updates).
                            </li>
                        </ul>
                    </div>
                    <button
                        id="csv-success-home-btn"
                        onClick={handleBackToHome}
                        className="flex items-center gap-2 mx-auto px-6 py-3 bg-[#ec028b]/10 border border-[#ec028b]/40 rounded-xl text-[#ec028b] font-bold hover:bg-[#ec028b]/20 transition-all"
                    >
                        <HomeIcon className="w-4 h-4" /> Back
                    </button>
                </div>
            </div>
        );
    }

    const contractTotal = Number(project.quote?.total || 0);
    const referenceCode = project.job_number || project.project_code || 'RHIVE-CERTIFIED';

    return (
        <div className="fixed inset-0 bg-black overflow-y-auto">
            <CircuitryBackground backgroundColor="#000000" dotColor="#ec028b" lineColor="236, 2, 139" />
            <div className="relative z-10 min-h-full py-12 px-4 sm:px-6 flex flex-col items-center">
                <div className="w-full max-w-2xl mb-8 flex items-center justify-between">
                    <RhiveLogo className="h-10" />
                    <button
                        id="csv-top-home-btn"
                        onClick={handleBackToHome}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-900/80 border border-gray-700 rounded-xl text-gray-400 text-sm font-bold hover:text-white hover:border-gray-600 transition-all"
                    >
                        <HomeIcon className="w-4 h-4" /> Back
                    </button>
                </div>

                {/* Project Summary Card */}
                <div className="w-full max-w-2xl mb-6 bg-gray-900/60 border border-gray-800 rounded-2xl p-5 backdrop-blur-sm">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">
                                Project Authorization
                            </p>
                            <p className="text-white font-extrabold text-lg">
                                {project.name || 'RHIVE Roofing Project'}
                            </p>
                            {getAddress(project) && (
                                <p className="text-gray-400 text-sm mt-0.5">{getAddress(project)}</p>
                            )}
                        </div>
                        {contractTotal > 0 && (
                            <div className="text-right">
                                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">
                                    Approved Investment
                                </p>
                                <p className="text-2xl font-black font-mono text-[#ec028b]">
                                    ${contractTotal.toLocaleString()}
                                </p>
                            </div>
                        )}
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                        <span className="text-[10px] text-amber-400 font-bold uppercase tracking-widest px-2 py-0.5 rounded border border-amber-500/30 bg-amber-500/10">
                            Sign &amp; Verify Stage
                        </span>
                        <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest px-2 py-0.5 rounded border border-cyan-500/30 bg-cyan-500/10">
                            {PAYMENT_MODEL_LABELS[paymentModel]}
                        </span>
                        <span className="text-[10px] text-gray-400 font-mono">Project Code: {referenceCode}</span>
                    </div>
                </div>

                {/* Single Page H1 */}
                <div className="w-full max-w-2xl mb-6 text-center">
                    <div className="flex items-center justify-center gap-3 mb-3">
                        <ShieldCheckIcon className="w-8 h-8 text-[#ec028b]" />
                        <h1 className="text-white font-extrabold text-2xl">
                            {isInsuranceFlow
                                ? 'Insurance Claim & Authorization'
                                : isRepairFlow
                                ? 'Fast-Path Repair Authorization'
                                : 'Project Sign & Verify Agreement'}
                        </h1>
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed max-w-lg mx-auto">
                        Confirm your material selection, payment structure, and digital signature below so our production
                        team can lock in your materials and schedule.
                    </p>
                </div>

                <div className="w-full max-w-2xl space-y-6">
                    {/* Card 1: Signer & Material Color Lock */}
                    <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 backdrop-blur-sm space-y-4">
                        <div className="flex items-center gap-2 text-white font-bold text-base">
                            <span className="w-6 h-6 rounded-full bg-[#ec028b]/20 border border-[#ec028b]/40 text-[#ec028b] text-xs font-black flex items-center justify-center">
                                1
                            </span>
                            <span>Authorized Signer &amp; System Color Lock</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label
                                    htmlFor="csv-signer-name"
                                    className="block text-xs font-bold uppercase tracking-widest text-gray-400"
                                >
                                    Full Legal Name (E-Signature) <span className="text-[#ec028b]">*</span>
                                </label>
                                <input
                                    id="csv-signer-name"
                                    type="text"
                                    value={signerName}
                                    onChange={(e) => setSignerName(e.target.value)}
                                    placeholder="Type full legal name"
                                    className="w-full bg-black/60 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#ec028b]/60"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label
                                    htmlFor="csv-color-select"
                                    className="block text-xs font-bold uppercase tracking-widest text-gray-400"
                                >
                                    Shingle / Membrane Color Selection
                                </label>
                                <select
                                    id="csv-color-select"
                                    value={selectedColor}
                                    onChange={(e) => setSelectedColor(e.target.value)}
                                    className="w-full bg-black/60 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#ec028b]/60"
                                >
                                    {SHINGLE_COLOR_OPTIONS.map((c) => (
                                        <option key={c} value={c}>
                                            {c}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {isMsaFlow && (
                            <div className="space-y-1.5 pt-2">
                                <label
                                    htmlFor="csv-po-number"
                                    className="block text-xs font-bold uppercase tracking-widest text-gray-400"
                                >
                                    Purchase Order / DFCM Solicitation Number <span className="text-[#ec028b]">*</span>
                                </label>
                                <input
                                    id="csv-po-number"
                                    type="text"
                                    value={poNumber}
                                    onChange={(e) => setPoNumber(e.target.value)}
                                    placeholder="e.g. PO-2026-4410 or DFCM-26184"
                                    className="w-full bg-black/60 border border-gray-700 rounded-xl px-4 py-3 text-white font-mono placeholder-gray-600 focus:outline-none focus:border-[#ec028b]/60"
                                />
                            </div>
                        )}

                        {!isRepairFlow && (
                            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-3.5 text-xs text-emerald-300">
                                <strong>Included QOS Decking Protection:</strong> Your contract includes up to{' '}
                                <strong>100 sq ft (3 sheets of 7/16&quot; OSB)</strong> of wood decking replacement at{' '}
                                <strong>$0.00</strong>. Any unseen structural wood rot beyond 3 sheets is documented with
                                crew photos at $72.50/sheet (+$250 wood dump trailer only if &gt;3 extra sheets are required).
                            </div>
                        )}
                    </div>

                    {/* Card 2 (Insurance Only): Claim & Carrier Documents */}
                    {isInsuranceFlow && (
                        <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 backdrop-blur-sm space-y-5">
                            <div className="flex items-center gap-2 text-white font-bold text-base">
                                <span className="w-6 h-6 rounded-full bg-[#ec028b]/20 border border-[#ec028b]/40 text-[#ec028b] text-xs font-black flex items-center justify-center">
                                    2
                                </span>
                                <span>Insurance Claim &amp; Carrier Scope</span>
                            </div>
                            <div className="space-y-2">
                                <label
                                    htmlFor="csv-claim-number"
                                    className="block text-xs font-bold uppercase tracking-widest text-gray-400"
                                >
                                    Insurance Claim Number <span className="text-[#ec028b]">*</span>
                                </label>
                                <input
                                    id="csv-claim-number"
                                    type="text"
                                    value={policyClaimNumber}
                                    onChange={(e) => setPolicyClaimNumber(e.target.value)}
                                    placeholder="e.g. CLM-2026-00123456"
                                    className="w-full bg-black/60 border border-gray-700 rounded-xl px-4 py-3 text-white font-mono placeholder-gray-600 focus:outline-none focus:border-[#ec028b]/60 transition-all"
                                />
                            </div>
                            <FileUploadZone
                                id="csv-policy-claim-file"
                                label="Carrier Loss Statement / Claim Document (Optional if sent to Rep)"
                                placeholder="Upload your carrier claim loss statement or declaration summary"
                                file={policyFile}
                                onFile={setPolicyFile}
                            />
                            <FileUploadZone
                                id="csv-scope-of-work-file"
                                label="Adjuster Xactimate Scope of Work (Optional)"
                                placeholder="Upload adjuster scope PDF if available"
                                file={scopeFile}
                                onFile={setScopeFile}
                            />
                            <FileUploadZone
                                id="csv-purchase-permit-file"
                                label="Carrier Purchase Permit / Mortgage Check Endorsement (Optional)"
                                placeholder="Upload purchase permit or mortgage check copy if applicable"
                                file={permitFile}
                                onFile={handlePermitFileChange}
                                progress={permitUploadProgress}
                            />
                        </div>
                    )}

                    {/* Payment Method Selection */}
                    <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 backdrop-blur-sm space-y-4">
                        <div className="flex items-center gap-2 text-white font-bold text-base">
                            <span className="w-6 h-6 rounded-full bg-[#ec028b]/20 border border-[#ec028b]/40 text-[#ec028b] text-xs font-black flex items-center justify-center">
                                {isInsuranceFlow ? '3' : '2'}
                            </span>
                            <span>
                                Payment Arrangement <span className="text-[#ec028b] text-xs ml-1">*</span>
                            </span>
                        </div>

                        {isInsuranceFlow ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <PaymentTile
                                    id="csv-payment-deductible"
                                    value="deductible"
                                    selected={paymentMethod}
                                    onSelect={setPaymentMethod}
                                    icon="🧾"
                                    title="Deductible + Carrier ACV"
                                    description="Pay policy deductible upon material mobilization; carrier ACV & RCV supplements fund remaining scope."
                                />
                                <PaymentTile
                                    id="csv-payment-acv"
                                    value="acv"
                                    selected={paymentMethod}
                                    onSelect={setPaymentMethod}
                                    icon="🛡️"
                                    title="ACV Check Endorsement"
                                    description="Apply initial Actual Cash Value (ACV) check now; RHIVE files final permit & completion photos to release RCV."
                                />
                            </div>
                        ) : isRepairFlow ? (
                            <div className="grid grid-cols-1 gap-4">
                                <PaymentTile
                                    id="csv-payment-repair"
                                    value="repair_100"
                                    selected={paymentMethod}
                                    onSelect={setPaymentMethod}
                                    icon="⚡"
                                    title="Fast-Path Repair (100% Upon Completion)"
                                    description="Single streamlined invoice settled immediately upon leak mitigation / repair verification."
                                />
                            </div>
                        ) : isMsaFlow ? (
                            <div className="grid grid-cols-1 gap-4">
                                <PaymentTile
                                    id="csv-payment-msa"
                                    value="po_net_30"
                                    selected={paymentMethod}
                                    onSelect={setPaymentMethod}
                                    icon="🏛️"
                                    title="Approved PO / Net-30 Schedule of Values"
                                    description="$0 mobilization deposit under executed Government / Corporate MSA Purchase Order; billed Net-30."
                                />
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <PaymentTile
                                    id="csv-payment-deposit50"
                                    value="deposit_50"
                                    selected={paymentMethod}
                                    onSelect={setPaymentMethod}
                                    icon="💳"
                                    title={
                                        paymentModel === 'commercial_50_50'
                                            ? '50% Mobilization / 50% Completion'
                                            : '50% / 40% / 10% Milestone Split'
                                    }
                                    description={
                                        paymentModel === 'commercial_50_50'
                                            ? '50% material mobilization deposit now and 50% final balance upon commercial QC sign-off.'
                                            : '50% material deposit now, 40% upon roof installation completion, and 10% final balance to unlock Master Warranty.'
                                    }
                                />
                                <PaymentTile
                                    id="csv-payment-financing"
                                    value="financing_enhancify"
                                    selected={paymentMethod}
                                    onSelect={setPaymentMethod}
                                    icon="🏦"
                                    title="Enhancify Monthly Financing"
                                    description="Lock in your project using pre-qualified monthly financing options coordinated with RHIVE administration."
                                />
                            </div>
                        )}
                    </div>

                    {/* Authorization Agreement */}
                    <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 backdrop-blur-sm space-y-4">
                        <div className="flex items-center gap-2 text-white font-bold text-base">
                            <span className="w-6 h-6 rounded-full bg-[#ec028b]/20 border border-[#ec028b]/40 text-[#ec028b] text-xs font-black flex items-center justify-center">
                                {isInsuranceFlow ? '4' : '3'}
                            </span>
                            <span>
                                Authorization &amp; Terms <span className="text-[#ec028b] text-xs ml-1">*</span>
                            </span>
                        </div>

                        <ToggleSwitch
                            id="csv-fast-track-toggle"
                            checked={fastTrackWaiver}
                            onChange={setFastTrackWaiver}
                            label="Active Leak / Emergency Fast-Track Request: Dispatch materials and crew immediately (waiving standard 3-day cool-down hold)."
                        />

                        <div className="border-t border-gray-800/70 pt-3">
                            <ToggleSwitch
                                id="csv-agreement-toggle"
                                checked={agreed}
                                onChange={setAgreed}
                                label="I confirm all selections above are accurate and authorize RHIVE Construction to proceed under the terms of my project proposal, including Master Warranty activation upon 100% final balance settlement."
                            />
                        </div>
                    </div>

                    {submitError && (
                        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm">
                            {submitError}
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-4 pb-12">
                        <button
                            id="csv-submit-btn"
                            type="button"
                            onClick={handleSubmit}
                            disabled={!isFormValid || submitting || !isUploadReady}
                            className={`flex-1 flex items-center justify-center gap-3 py-4 px-8 rounded-xl font-black text-base uppercase tracking-wider transition-all duration-200
                                ${
                                    isFormValid && !submitting && isUploadReady
                                        ? 'bg-[#ec028b] text-white shadow-[0_0_20px_rgba(236,2,139,0.3)] hover:bg-[#d4017d] cursor-pointer'
                                        : 'bg-gray-800 text-gray-600 border border-gray-700 cursor-not-allowed'
                                }`}
                        >
                            <ShieldCheckIcon className="w-5 h-5" />
                            <span>{submitting ? 'Submitting…' : 'Submit'}</span>
                        </button>
                        <button
                            id="csv-bottom-home-btn"
                            type="button"
                            onClick={handleBackToHome}
                            className="flex items-center justify-center gap-2 py-4 px-6 rounded-xl border border-gray-700 text-gray-400 font-bold text-sm hover:text-white hover:border-gray-600 transition-all"
                        >
                            <HomeIcon className="w-4 h-4" /> Back
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerSignVerifyPage;
