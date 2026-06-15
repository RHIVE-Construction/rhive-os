import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useNavigation } from '../contexts/NavigationContext';
import { passwordResetService } from '../lib/firebaseService';
import {
    KeyIcon,
    ArrowLeftIcon,
    EnvelopeIcon,
    EyeIcon,
    EyeSlashIcon,
    ShieldCheckIcon,
    ExclamationTriangleIcon,
    CheckCircleIcon,
} from '../components/icons';

// ── OTP 6-box input ────────────────────────────────────────────────────────────
interface OtpInputProps {
    value: string;
    onChange: (val: string) => void;
    onComplete?: (val: string) => void;
    disabled?: boolean;
}

const OtpInput: React.FC<OtpInputProps> = ({ value, onChange, onComplete, disabled }) => {
    const refs = [
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
    ];

    const chars = value.split('');

    const handleChange = (idx: number, raw: string) => {
        const char = raw.replace(/\D/g, '').slice(-1);
        const next = chars.slice();
        next[idx] = char;
        // Trim to 6
        while (next.length < 6) next.push('');
        const newVal = next.slice(0, 6).join('').replace(/ /g, '');
        onChange(newVal);
        if (char && idx < 5) {
            refs[idx + 1].current?.focus();
        }
        const filled = newVal.replace(/\s/g, '');
        if (filled.length === 6) onComplete?.(filled);
    };

    const handleKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace') {
            if (!chars[idx] && idx > 0) {
                const next = chars.slice();
                next[idx - 1] = '';
                onChange(next.join(''));
                refs[idx - 1].current?.focus();
            } else {
                const next = chars.slice();
                next[idx] = '';
                onChange(next.join(''));
            }
        } else if (e.key === 'ArrowLeft' && idx > 0) {
            refs[idx - 1].current?.focus();
        } else if (e.key === 'ArrowRight' && idx < 5) {
            refs[idx + 1].current?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        onChange(pasted.padEnd(6, ' ').slice(0, 6));
        if (pasted.length > 0) {
            refs[Math.min(pasted.length, 5)].current?.focus();
        }
        if (pasted.length === 6) onComplete?.(pasted);
    };

    return (
        <div className="flex gap-2 justify-center" onPaste={handlePaste}>
            {[0, 1, 2, 3, 4, 5].map((idx) => {
                const digit = chars[idx] && chars[idx].trim() ? chars[idx] : '';
                const isFilled = digit !== '';
                return (
                    <div key={idx} className="relative">
                        {/* Chamfered border */}
                        <div
                            className={`absolute inset-0 transition-all duration-200 ${isFilled ? 'bg-rhive-pink/20 border border-rhive-pink' : 'bg-black/60 border border-gray-700'}`}
                            style={{
                                clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)',
                            }}
                        />
                        <input
                            ref={refs[idx]}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            disabled={disabled}
                            onChange={(e) => handleChange(idx, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(idx, e)}
                            className={`relative z-10 w-11 h-14 text-center text-2xl font-black font-mono bg-transparent outline-none transition-all duration-200
                                ${isFilled ? 'text-white' : 'text-gray-500'}
                                disabled:opacity-40 cursor-text`}
                            style={{ background: 'transparent' }}
                        />
                        {/* Bottom indicator */}
                        <div
                            className={`absolute bottom-0 left-0 right-0 h-0.5 transition-all duration-200 ${isFilled ? 'bg-rhive-pink shadow-[0_0_8px_rgba(236,2,139,0.8)]' : 'bg-transparent'}`}
                        />
                    </div>
                );
            })}
        </div>
    );
};

// ── Shared card frame ──────────────────────────────────────────────────────────
const ResetCard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const chamfer = '24px';
    const clip = `polygon(${chamfer} 0, 100% 0, 100% calc(100% - ${chamfer}), calc(100% - ${chamfer}) 100%, 0 100%, 0 ${chamfer})`;
    return (
        <div className="relative w-full max-w-md">
            {/* Border frame */}
            <div className="absolute inset-0" style={{ clipPath: clip }}>
                <div className="absolute inset-0 bg-gray-700" />
                <div className="absolute inset-[1px] bg-black" />
            </div>
            {/* Pink accent on TL chamfer */}
            <svg className="absolute top-0 left-0 w-6 h-6 z-20 overflow-visible pointer-events-none">
                <line x1="8" y1="16" x2="16" y2="8" stroke="#ec028b" strokeWidth="2" strokeLinecap="square"
                    className="drop-shadow-[0_0_3px_rgba(236,2,139,0.8)]" />
            </svg>
            {/* Pink accent on BR chamfer */}
            <svg className="absolute bottom-0 right-0 w-6 h-6 z-20 overflow-visible pointer-events-none">
                <line x1="8" y1="16" x2="16" y2="8" stroke="#ec028b" strokeWidth="2" strokeLinecap="square"
                    className="drop-shadow-[0_0_3px_rgba(236,2,139,0.8)]" />
            </svg>
            <div className="relative z-10 p-8">{children}</div>
        </div>
    );
};

// ── Main Page ──────────────────────────────────────────────────────────────────
type Step = 'email' | 'otp' | 'password' | 'success';

const PasswordResetPage: React.FC = () => {
    const { setActivePageId } = useNavigation();

    const [step, setStep] = useState<Step>('email');
    const [email, setEmail] = useState('');
    const [otpValue, setOtpValue] = useState('');
    const [resetToken, setResetToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [resendTimer, setResendTimer] = useState(60);
    const [countdown, setCountdown] = useState(5);

    // Handle ?token= in URL for backward-compat direct-link flow
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');
        if (token) {
            setResetToken(token);
            setStep('password');
        }
    }, []);

    // Resend countdown when on OTP step
    useEffect(() => {
        if (step !== 'otp') return;
        setResendTimer(60);
        const t = setInterval(() => {
            setResendTimer((prev) => {
                if (prev <= 1) { clearInterval(t); return 0; }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(t);
    }, [step]);

    // Success redirect countdown
    useEffect(() => {
        if (step !== 'success') return;
        setCountdown(5);
        const t = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(t);
                    window.history.replaceState({}, document.title, window.location.pathname);
                    setActivePageId('P-06');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(t);
    }, [step]);

    // ── Step 1: Submit email ───────────────────────────────────────────────────
    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) return;
        setLoading(true);
        setError('');
        const res = await passwordResetService.createResetToken(email.trim());
        setLoading(false);
        if (res.success) {
            setOtpValue('');
            setStep('otp');
        } else {
            setError(res.error || 'Something went wrong. Please try again.');
        }
    };

    // ── Step 2: Verify OTP ─────────────────────────────────────────────────────
    const handleOtpSubmit = async () => {
        const code = otpValue.replace(/\s/g, '');
        if (code.length !== 6) {
            setError('Please enter the full 6-digit code.');
            return;
        }
        setLoading(true);
        setError('');
        const res = await (passwordResetService as any).verifyOtpCode(email.trim(), code);
        setLoading(false);
        if (res.success && res.token) {
            setResetToken(res.token);
            setStep('password');
        } else {
            setError(res.error || 'Invalid code. Please try again.');
        }
    };

    // Resend code
    const handleResend = async () => {
        if (resendTimer > 0) return;
        setLoading(true);
        setError('');
        await passwordResetService.createResetToken(email.trim());
        setOtpValue('');
        setLoading(false);
        setResendTimer(60);
    };

    // ── Step 3: Set new password ───────────────────────────────────────────────
    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        setLoading(true);
        setError('');
        const res = await passwordResetService.completePasswordReset(resetToken, newPassword);
        setLoading(false);
        if (res.success) {
            setStep('success');
        } else {
            setError(res.error || 'Failed to update password. Please try again.');
        }
    };

    // ── Renders ────────────────────────────────────────────────────────────────
    const renderEmail = () => (
        <ResetCard>
            <div className="mb-6 flex items-center gap-3">
                <div className="p-2 bg-rhive-pink/10 border border-rhive-pink/30 text-rhive-pink">
                    <EnvelopeIcon className="w-5 h-5" />
                </div>
                <div>
                    <p className="text-[10px] text-rhive-pink font-bold tracking-[0.3em] uppercase">Recovery Protocol</p>
                    <h1 className="text-lg font-black text-white tracking-tight uppercase">Reset Password</h1>
                </div>
            </div>

            <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div>
                    <label className="block text-xs font-bold text-gray-400 tracking-widest uppercase mb-2">
                        Registered Email
                    </label>
                    <Input
                        id="reset-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        required
                        autoComplete="email"
                        className="bg-black/60 border-gray-700 text-white placeholder:text-gray-600 focus:border-rhive-pink focus:ring-rhive-pink/20"
                    />
                </div>

                {error && (
                    <div className="flex items-start gap-2 p-3 bg-red-950/40 border border-red-800/60 text-red-400 text-xs">
                        <ExclamationTriangleIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                <Button
                    type="submit"
                    disabled={loading || !email.trim()}
                    className="w-full bg-rhive-pink hover:bg-rhive-pink/90 text-white font-black tracking-widest uppercase text-xs py-3 shadow-pink-glow disabled:opacity-50"
                >
                    {loading ? 'Sending...' : 'Send Verification Code →'}
                </Button>

                <button
                    type="button"
                    onClick={() => setActivePageId('P-06')}
                    className="w-full flex items-center justify-center gap-2 text-xs text-gray-500 hover:text-gray-300 transition-colors mt-2"
                >
                    <ArrowLeftIcon className="w-3 h-3" />
                    Back to Login
                </button>
            </form>
        </ResetCard>
    );

    const renderOtp = () => (
        <ResetCard>
            <div className="mb-6 flex items-center gap-3">
                <div className="p-2 bg-rhive-pink/10 border border-rhive-pink/30 text-rhive-pink">
                    <KeyIcon className="w-5 h-5" />
                </div>
                <div>
                    <p className="text-[10px] text-rhive-pink font-bold tracking-[0.3em] uppercase">Step 2 of 3</p>
                    <h1 className="text-lg font-black text-white tracking-tight uppercase">Enter Code</h1>
                </div>
            </div>

            <p className="text-xs text-gray-400 mb-6 leading-relaxed">
                A 6-digit code was sent from{' '}
                <strong className="text-white">support@rhiveconstruction.com</strong>{' '}
                to <strong className="text-white">{email}</strong>.
                Enter it below. Expires in 15 minutes.
            </p>



            <div className="mb-6">
                <OtpInput
                    value={otpValue}
                    onChange={setOtpValue}
                    onComplete={handleOtpSubmit}
                    disabled={loading}
                />
            </div>

            {error && (
                <div className="flex items-start gap-2 p-3 mb-4 bg-red-950/40 border border-red-800/60 text-red-400 text-xs">
                    <ExclamationTriangleIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            <Button
                onClick={handleOtpSubmit}
                disabled={loading || otpValue.replace(/\s/g, '').length !== 6}
                className="w-full bg-rhive-pink hover:bg-rhive-pink/90 text-white font-black tracking-widest uppercase text-xs py-3 shadow-pink-glow disabled:opacity-50 mb-4"
            >
                {loading ? 'Verifying...' : 'Verify Code →'}
            </Button>

            <div className="flex items-center justify-between">
                <button
                    type="button"
                    onClick={() => { setStep('email'); setError(''); }}
                    className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-300 transition-colors"
                >
                    <ArrowLeftIcon className="w-3 h-3" />
                    Change email
                </button>
                <button
                    type="button"
                    onClick={handleResend}
                    disabled={resendTimer > 0 || loading}
                    className={`text-xs transition-colors ${resendTimer > 0 ? 'text-gray-600 cursor-not-allowed' : 'text-rhive-pink hover:text-rhive-pink/80'}`}
                >
                    {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend code'}
                </button>
            </div>
        </ResetCard>
    );

    const renderPassword = () => (
        <ResetCard>
            <div className="mb-6 flex items-center gap-3">
                <div className="p-2 bg-rhive-pink/10 border border-rhive-pink/30 text-rhive-pink">
                    <ShieldCheckIcon className="w-5 h-5" />
                </div>
                <div>
                    <p className="text-[10px] text-rhive-pink font-bold tracking-[0.3em] uppercase">Step 3 of 3</p>
                    <h1 className="text-lg font-black text-white tracking-tight uppercase">New Password</h1>
                </div>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                    <label className="block text-xs font-bold text-gray-400 tracking-widest uppercase mb-2">
                        New Password
                    </label>
                    <div className="relative">
                        <Input
                            id="new-password"
                            type={showNew ? 'text' : 'password'}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Min. 6 characters"
                            required
                            autoComplete="new-password"
                            className="bg-black/60 border-gray-700 text-white placeholder:text-gray-600 focus:border-rhive-pink pr-10"
                        />
                        <button
                            type="button"
                            onClick={() => setShowNew(!showNew)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                        >
                            {showNew ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                        </button>
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-400 tracking-widest uppercase mb-2">
                        Confirm Password
                    </label>
                    <div className="relative">
                        <Input
                            id="confirm-password"
                            type={showConfirm ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Re-enter password"
                            required
                            autoComplete="new-password"
                            className="bg-black/60 border-gray-700 text-white placeholder:text-gray-600 focus:border-rhive-pink pr-10"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirm(!showConfirm)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                        >
                            {showConfirm ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                        </button>
                    </div>
                </div>

                {/* Password match indicator */}
                {confirmPassword && (
                    <div className={`flex items-center gap-2 text-xs ${newPassword === confirmPassword ? 'text-emerald-400' : 'text-red-400'}`}>
                        {newPassword === confirmPassword
                            ? <><CheckCircleIcon className="w-3.5 h-3.5" /> Passwords match</>
                            : <><ExclamationTriangleIcon className="w-3.5 h-3.5" /> Passwords do not match</>
                        }
                    </div>
                )}

                {error && (
                    <div className="flex items-start gap-2 p-3 bg-red-950/40 border border-red-800/60 text-red-400 text-xs">
                        <ExclamationTriangleIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                <Button
                    type="submit"
                    disabled={loading || !newPassword || !confirmPassword}
                    className="w-full bg-rhive-pink hover:bg-rhive-pink/90 text-white font-black tracking-widest uppercase text-xs py-3 shadow-pink-glow disabled:opacity-50"
                >
                    {loading ? 'Updating...' : 'Update Password →'}
                </Button>
            </form>
        </ResetCard>
    );

    const renderSuccess = () => (
        <ResetCard>
            <div className="text-center py-4">
                <div className="mx-auto mb-6 w-16 h-16 flex items-center justify-center bg-emerald-950/40 border border-emerald-700/60 text-emerald-400"
                    style={{ clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)' }}>
                    <CheckCircleIcon className="w-8 h-8" />
                </div>
                <p className="text-[10px] text-emerald-400 font-bold tracking-[0.3em] uppercase mb-2">Recovery Complete</p>
                <h1 className="text-xl font-black text-white uppercase tracking-tight mb-3">Password Updated</h1>
                <p className="text-xs text-gray-400 mb-6">
                    Your password has been successfully changed.<br />
                    Redirecting to login in{' '}
                    <strong className="text-white">{countdown}</strong> seconds.
                </p>
                <Button
                    onClick={() => {
                        window.history.replaceState({}, document.title, window.location.pathname);
                        setActivePageId('P-06');
                    }}
                    className="w-full bg-rhive-pink hover:bg-rhive-pink/90 text-white font-black tracking-widest uppercase text-xs py-3 shadow-pink-glow"
                >
                    Back to Login →
                </Button>
            </div>
        </ResetCard>
    );

    // ── Step progress indicator ────────────────────────────────────────────────
    const steps = [
        { id: 'email', label: 'Email' },
        { id: 'otp', label: 'Verify' },
        { id: 'password', label: 'Password' },
    ];
    const currentStepIdx = steps.findIndex((s) => s.id === step);

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4 py-12">
            {/* Logo */}
            <div className="mb-8 text-center">
                <span className="text-rhive-pink font-black text-2xl tracking-[0.2em] uppercase">RHIVE</span>
                <span className="text-gray-600 text-[10px] font-bold tracking-[0.4em] uppercase ml-2 align-middle">Quantum OS</span>
            </div>

            {/* Step progress (not on success) */}
            {step !== 'success' && (
                <div className="flex items-center gap-2 mb-8">
                    {steps.map((s, i) => (
                        <React.Fragment key={s.id}>
                            <div className="flex items-center gap-1.5">
                                <div className={`w-6 h-6 flex items-center justify-center text-[10px] font-black transition-all duration-300
                                    ${i < currentStepIdx ? 'bg-emerald-700 text-white' : i === currentStepIdx ? 'bg-rhive-pink text-white shadow-pink-glow-sm' : 'bg-gray-800 text-gray-600'}`}
                                    style={{ clipPath: 'polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)' }}
                                >
                                    {i < currentStepIdx ? '✓' : i + 1}
                                </div>
                                <span className={`text-[10px] font-bold tracking-widest uppercase hidden sm:block ${i === currentStepIdx ? 'text-white' : 'text-gray-600'}`}>
                                    {s.label}
                                </span>
                            </div>
                            {i < steps.length - 1 && (
                                <div className={`w-8 h-px transition-all duration-300 ${i < currentStepIdx ? 'bg-emerald-700' : 'bg-gray-800'}`} />
                            )}
                        </React.Fragment>
                    ))}
                </div>
            )}

            {/* Step content */}
            <div className="w-full max-w-md">
                {step === 'email' && renderEmail()}
                {step === 'otp' && renderOtp()}
                {step === 'password' && renderPassword()}
                {step === 'success' && renderSuccess()}
            </div>

            {/* Footer */}
            <p className="mt-8 text-[10px] text-gray-700 tracking-widest uppercase">
                RHIVE Industries © 2025 • Restricted Access
            </p>
        </div>
    );
};

export default PasswordResetPage;
