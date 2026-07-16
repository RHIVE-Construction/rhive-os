import React, { useState, useEffect, useRef } from 'react';
import { useNavigation } from '../contexts/NavigationContext';
import { smsOtpService, passwordResetService, authService } from '../lib/firebaseService';
import {
    KeyIcon,
    ArrowRightIcon,
    ArrowLeftIcon,
    EyeIcon,
    EyeSlashIcon,
    ShieldCheckIcon,
    ExclamationTriangleIcon,
    CheckCircleIcon,
    ClockIcon,
    EnvelopeIcon,
    LockIcon,
    CheckIcon,
} from '../components/icons';
import { cn } from '../lib/utils';

// Suppress unused-import warnings for services kept for future use
void passwordResetService;
void authService;

// ─── Floating label input ─────────────────────────────────────────────────────
const FloatingInput: React.FC<{
    id: string;
    type: string;
    label: string;
    value: string;
    onChange: (v: string) => void;
    icon: React.ReactNode;
    rightEl?: React.ReactNode;
    autoFocus?: boolean;
}> = ({ id, type, label, value, onChange, icon, rightEl, autoFocus }) => (
    <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-rhive-pink transition-colors z-10 pointer-events-none">
            {icon}
        </div>
        <input
            id={id}
            type={type}
            placeholder=" "
            value={value}
            onChange={(e) => onChange(e.target.value)}
            autoFocus={autoFocus}
            className="peer w-full bg-black/60 border border-gray-800 focus:border-rhive-pink outline-none text-white pl-12 pr-12 pt-7 pb-2 text-sm font-mono tracking-wide transition-all duration-200 placeholder-transparent"
            style={{ clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)' }}
        />
        <label
            htmlFor={id}
            className="absolute left-12 top-2.5 text-[10px] font-bold uppercase tracking-widest text-gray-600 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-xs peer-focus:top-2.5 peer-focus:-translate-y-0 peer-focus:text-[10px] peer-focus:text-rhive-pink transition-all duration-200 pointer-events-none"
        >
            {label}
        </label>
        {rightEl && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10">
                {rightEl}
            </div>
        )}
    </div>
);

// ─── Password strength indicator ─────────────────────────────────────────────
const PasswordStrength: React.FC<{ password: string }> = ({ password }) => {
    const checks = [
        { label: '8+ chars', pass: password.length >= 8 },
        { label: 'Uppercase', pass: /[A-Z]/.test(password) },
        { label: 'Number', pass: /[0-9]/.test(password) },
        { label: 'Symbol', pass: /[^A-Za-z0-9]/.test(password) },
    ];
    const score = checks.filter(c => c.pass).length;
    const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][score];
    const barColors = ['', 'bg-red-500', 'bg-yellow-500', 'bg-blue-400', 'bg-green-400'];
    const textColors = ['', 'text-red-500', 'text-yellow-500', 'text-blue-400', 'text-green-400'];
    if (!password) return null;

    return (
        <div className="space-y-2 animate-fade-in px-1">
            {/* Strength bar */}
            <div className="flex gap-1 h-1">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className={cn('flex-1 rounded-full transition-all duration-300', i <= score ? barColors[score] : 'bg-gray-800')} />
                ))}
            </div>
            {/* Requirements + label */}
            <div className="flex items-center justify-between">
                <div className="flex gap-3 flex-wrap">
                    {checks.map(c => (
                        <span key={c.label} className={cn('flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider transition-colors', c.pass ? 'text-gray-400' : 'text-gray-700')}>
                            <span className={cn('w-1.5 h-1.5 rounded-full', c.pass ? 'bg-rhive-pink' : 'bg-gray-700')} />
                            {c.label}
                        </span>
                    ))}
                </div>
                <span className={cn('text-[10px] font-black uppercase tracking-widest shrink-0 ml-3', textColors[score])}>
                    {strengthLabel}
                </span>
            </div>
        </div>
    );
};

// ─── Phone Icon (inline SVG) ────────────────────────────────────────────────
const PhoneIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
    </svg>
);

type Step = 'phone' | 'otp' | 'password' | 'success';

// ─── OTP 6-box input ─────────────────────────────────────────────────────────
const OtpInput: React.FC<{
    value: string;
    onChange: (v: string) => void;
    disabled?: boolean;
}> = ({ value, onChange, disabled }) => {
    const ref0 = useRef<HTMLInputElement>(null);
    const ref1 = useRef<HTMLInputElement>(null);
    const ref2 = useRef<HTMLInputElement>(null);
    const ref3 = useRef<HTMLInputElement>(null);
    const ref4 = useRef<HTMLInputElement>(null);
    const ref5 = useRef<HTMLInputElement>(null);
    const refs = [ref0, ref1, ref2, ref3, ref4, ref5];

    const handleChange = (idx: number, char: string) => {
        const digit = char.replace(/\D/g, '').slice(-1);
        const arr = value.padEnd(6, ' ').split('');
        arr[idx] = digit || ' ';
        const next = arr.join('').trimEnd();
        onChange(next.replace(/ /g, ''));
        if (digit && idx < 5) refs[idx + 1].current?.focus();
    };

    const handleKey = (idx: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace') {
            const arr = value.padEnd(6, ' ').split('');
            arr[idx] = ' ';
            onChange(arr.join('').trimEnd().replace(/ /g, ''));
            if (idx > 0) refs[idx - 1].current?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        onChange(pasted);
        refs[Math.min(pasted.length, 5)].current?.focus();
        e.preventDefault();
    };

    return (
        <div className="flex gap-2 justify-center">
            {Array.from({ length: 6 }).map((_, idx) => (
                <input
                    key={idx}
                    ref={refs[idx]}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    disabled={disabled}
                    value={value[idx] || ''}
                    onChange={e => handleChange(idx, e.target.value)}
                    onKeyDown={e => handleKey(idx, e)}
                    onPaste={handlePaste}
                    className={cn(
                        'w-12 h-14 text-center text-xl font-black text-white bg-black border-2 outline-none transition-all duration-200 font-mono',
                        'focus:border-rhive-pink focus:shadow-[0_0_12px_rgba(236,2,139,0.4)]',
                        value[idx] ? 'border-rhive-pink/60 shadow-[0_0_6px_rgba(236,2,139,0.2)]' : 'border-gray-700',
                        disabled && 'opacity-40 cursor-not-allowed'
                    )}
                    style={{ clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)' }}
                />
            ))}
        </div>
    );
};

// ─── Countdown Timer ──────────────────────────────────────────────────────────
const CountdownTimer: React.FC<{ seconds: number; onExpired: () => void }> = ({ seconds, onExpired }) => {
    const [remaining, setRemaining] = useState(seconds);

    useEffect(() => {
        setRemaining(seconds);
    }, [seconds]);

    useEffect(() => {
        if (remaining <= 0) { onExpired(); return; }
        const t = setTimeout(() => setRemaining(r => r - 1), 1000);
        return () => clearTimeout(t);
    }, [remaining]);

    const mins = Math.floor(remaining / 60);
    const secs = remaining % 60;
    const expired = remaining <= 0;

    return (
        <span className={cn(
            'font-mono text-xs font-bold',
            expired ? 'text-red-500' : remaining < 60 ? 'text-orange-400' : 'text-gray-400'
        )}>
            {expired ? 'EXPIRED' : `${mins}:${secs.toString().padStart(2, '0')}`}
        </span>
    );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const PasswordResetPage: React.FC = () => {
    const { setActivePageId } = useNavigation();

    const [step, setStep] = useState<Step>('phone');
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [resetToken, setResetToken] = useState('');
    const [verifiedEmail, setVerifiedEmail] = useState<string | null>(null);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [countdown, setCountdown] = useState(5);
    const [devCode, setDevCode] = useState<string | undefined>(undefined);
    const [otpExpired, setOtpExpired] = useState(false);
    const [otpTimerKey, setOtpTimerKey] = useState(0);

    // ── Helpers ────────────────────────────────────────────────────────────
    const showError = (msg: string) => {
        setErrorMessage(msg);
        setTimeout(() => setErrorMessage(''), 5000);
    };

    const maskEmail = (email: string): string => {
        if (!email) return 'your registered email';
        const [user, domain] = email.split('@');
        if (!domain) return email;
        return `${user[0]}${'*'.repeat(Math.min(user.length - 1, 4))}@${domain}`;
    };

    const maskPhone = (p: string): string => {
        const digits = p.replace(/\D/g, '');
        if (digits.length < 4) return p;
        return `(***) ***-${digits.slice(-4)}`;
    };

    // ── Auto-redirect countdown on success ────────────────────────────────
    useEffect(() => {
        if (step !== 'success') return;
        setCountdown(5);
        const interval = setInterval(() => {
            setCountdown(c => {
                if (c <= 1) {
                    clearInterval(interval);
                    setActivePageId('login');
                    return 0;
                }
                return c - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [step, setActivePageId]);

    // ── Step 1: Send OTP ───────────────────────────────────────────────────
    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!phone.trim()) return;
        setLoading(true);
        setErrorMessage('');

        const res = await smsOtpService.sendOtp(phone.trim());
        setLoading(false);

        if (res.success) {
            setDevCode(res.devCode);
            setOtpExpired(false);
            setOtpTimerKey(k => k + 1);
            setOtp('');
            setStep('otp');
        } else {
            showError(res.error || 'Failed to send OTP. Check your phone number.');
        }
    };

    // ── Step 1b: Resend OTP ────────────────────────────────────────────────
    const handleResendOtp = async () => {
        setLoading(true);
        setErrorMessage('');
        const res = await smsOtpService.sendOtp(phone.trim());
        setLoading(false);
        if (res.success) {
            setDevCode(res.devCode);
            setOtpExpired(false);
            setOtpTimerKey(k => k + 1);
            setOtp('');
        } else {
            showError(res.error || 'Failed to resend OTP.');
        }
    };

    // ── Step 2: Verify OTP ─────────────────────────────────────────────────
    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (otp.length !== 6) { showError('Please enter the 6-digit code.'); return; }
        if (otpExpired) { showError('This code has expired. Please request a new one.'); return; }
        setLoading(true);
        setErrorMessage('');

        const res = await smsOtpService.verifyOtp(phone.trim(), otp);
        setLoading(false);

        if (res.success && res.resetToken) {
            setResetToken(res.resetToken);
            setVerifiedEmail(res.email ?? null);
            setNewPassword('');
            setConfirmPassword('');
            setStep('password');
        } else {
            showError(res.error || 'Invalid or expired code. Please try again.');
        }
    };

    // ── Step 3: Set new password ───────────────────────────────────────────
    const handleSetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) { showError('Passwords do not match.'); return; }
        if (newPassword.length < 8) { showError('Password must be at least 8 characters.'); return; }
        setLoading(true);
        setErrorMessage('');

        try {
            const FUNCTIONS_BASE_URL = `https://us-central1-rhive-os.cloudfunctions.net`;
            const res = await fetch(`${FUNCTIONS_BASE_URL}/completePasswordReset`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ resetToken, newPassword })
            });
            const data = await res.json() as { error?: string };
            setLoading(false);
            if (res.ok) {
                setStep('success');
            } else {
                showError(data.error || 'Failed to reset password. Please try again.');
            }
        } catch {
            setLoading(false);
            showError('Network error. Could not reach the password service.');
        }
    };

    const goToLogin = () => setActivePageId('login');

    // ── Step progress metadata ─────────────────────────────────────────────
    const stepOrder: Step[] = ['phone', 'otp', 'password', 'success'];
    const stepIndex = stepOrder.indexOf(step);
    const stepLabels = ['Phone', 'Code', 'Password', 'Done'];

    // ── Card chamfer geometry ─────────────────────────────────────────────
    const C = 32;
    const cardClip = `polygon(${C}px 0, calc(100% - ${C}px) 0, 100% ${C}px, 100% calc(100% - ${C}px), calc(100% - ${C}px) 100%, ${C}px 100%, 0 calc(100% - ${C}px), 0 ${C}px)`;
    const btnClip: React.CSSProperties = { clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)' };
    const badgeClip: React.CSSProperties = { clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' };
    const iconClip: React.CSSProperties = { clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' };

    return (
        <div className="w-full min-h-screen flex flex-col items-center justify-center py-12 px-4 font-sans">

            {/* Logo */}
            <img
                src="https://i.imgur.com/t0VcSgJ.png"
                alt="RHIVE"
                className="h-16 w-auto mb-10 opacity-90 hover:opacity-100 transition-opacity"
            />

            {/* Card */}
            <div className="w-full max-w-lg relative">

                {/* Outer glow */}
                <div
                    className="absolute inset-0 bg-rhive-pink/5 blur-2xl"
                    style={{ clipPath: cardClip }}
                />

                {/* Card background */}
                <div
                    className="relative bg-black/70 backdrop-blur-xl border border-gray-800 overflow-hidden"
                    style={{ clipPath: cardClip }}
                >
                    {/* Pink top accent bar */}
                    <div className="absolute top-0 left-[32px] right-[32px] h-[1px] bg-gradient-to-r from-transparent via-rhive-pink to-transparent" />
                    {/* Pink bottom accent bar */}
                    <div className="absolute bottom-0 left-[32px] right-[32px] h-[1px] bg-gradient-to-r from-transparent via-rhive-pink/40 to-transparent" />

                    {/* Corner accents */}
                    <div className="absolute top-0 left-0 w-8 h-8 overflow-hidden">
                        <div className="absolute top-0 left-0 w-[2px] h-6 bg-rhive-pink shadow-[0_0_8px_#ec028b]" />
                        <div className="absolute top-0 left-0 h-[2px] w-6 bg-rhive-pink shadow-[0_0_8px_#ec028b]" />
                    </div>
                    <div className="absolute bottom-0 right-0 w-8 h-8 overflow-hidden">
                        <div className="absolute bottom-0 right-0 w-[2px] h-6 bg-rhive-pink shadow-[0_0_8px_#ec028b]" />
                        <div className="absolute bottom-0 right-0 h-[2px] w-6 bg-rhive-pink shadow-[0_0_8px_#ec028b]" />
                    </div>

                    <div className="p-8 md:p-10">

                        {/* ── Step Progress Indicator ── */}
                        <div className="flex items-center justify-center mb-8 select-none">
                            {stepLabels.map((label, i) => {
                                const isCompleted = i < stepIndex;
                                const isActive = i === stepIndex;
                                return (
                                    <React.Fragment key={label}>
                                        <div className="flex flex-col items-center gap-1.5">
                                            <div
                                                className={cn(
                                                    'w-8 h-8 flex items-center justify-center text-xs font-black transition-all duration-300',
                                                    isCompleted
                                                        ? 'bg-rhive-pink text-white shadow-[0_0_12px_rgba(236,2,139,0.5)]'
                                                        : isActive
                                                            ? 'bg-rhive-pink text-white shadow-[0_0_20px_rgba(236,2,139,0.6)] ring-2 ring-rhive-pink/30'
                                                            : 'bg-gray-900 text-gray-600 border border-gray-700'
                                                )}
                                                style={{ clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)' }}
                                            >
                                                {isCompleted
                                                    ? <CheckIcon className="w-3.5 h-3.5" />
                                                    : <span>{i + 1}</span>}
                                            </div>
                                            <span className={cn(
                                                'text-[9px] font-bold uppercase tracking-widest transition-colors',
                                                isActive ? 'text-rhive-pink' : isCompleted ? 'text-gray-500' : 'text-gray-700'
                                            )}>{label}</span>
                                        </div>
                                        {i < stepLabels.length - 1 && (
                                            <div className={cn(
                                                'h-[1px] flex-1 mx-2 mb-5 transition-colors duration-500',
                                                i < stepIndex ? 'bg-rhive-pink/60' : 'bg-gray-800'
                                            )} />
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </div>

                        {/* ── STEP 1: PHONE ── */}
                        {step === 'phone' && (
                            <form onSubmit={handleSendOtp} className="animate-fade-in space-y-6">
                                <div className="text-center mb-6">
                                    <div
                                        className="w-14 h-14 mx-auto mb-4 flex items-center justify-center bg-rhive-pink/10 border border-rhive-pink/30 shadow-[0_0_20px_rgba(236,2,139,0.15)]"
                                        style={iconClip}
                                    >
                                        <PhoneIcon className="w-6 h-6 text-rhive-pink" />
                                    </div>
                                    <h1 className="text-2xl font-black text-white uppercase tracking-[0.2em] mb-1">Reset Password</h1>
                                    <p className="text-gray-600 text-[10px] font-bold uppercase tracking-[0.3em]">Secure SMS Verification</p>
                                </div>

                                <p className="text-gray-500 text-xs text-center leading-relaxed px-2">
                                    Enter your registered mobile number. We'll send a one-time verification code to confirm your identity.
                                </p>

                                <FloatingInput
                                    id="phone-input"
                                    type="tel"
                                    label="Mobile Number"
                                    value={phone}
                                    onChange={setPhone}
                                    icon={<PhoneIcon className="w-4 h-4" />}
                                    autoFocus
                                />

                                {errorMessage && (
                                    <div className="flex items-center gap-2 px-3 py-2 bg-red-500/10 border border-red-500/30">
                                        <ExclamationTriangleIcon className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                                        <p className="text-red-400 text-[10px] font-bold uppercase tracking-wider">{errorMessage}</p>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    id="send-code-btn"
                                    disabled={!phone.trim() || loading}
                                    className="w-full h-12 bg-rhive-pink hover:bg-[#ff039a] disabled:opacity-40 disabled:cursor-not-allowed text-white font-black text-[10px] uppercase tracking-[0.25em] transition-all shadow-[0_0_25px_rgba(236,2,139,0.3)] hover:shadow-[0_0_40px_rgba(236,2,139,0.5)] flex items-center justify-center gap-2"
                                    style={btnClip}
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Sending…
                                        </>
                                    ) : (
                                        <>Send Code <ArrowRightIcon className="w-4 h-4" /></>
                                    )}
                                </button>

                                <button
                                    type="button"
                                    id="back-to-login-phone"
                                    onClick={goToLogin}
                                    className="w-full text-center text-[10px] text-gray-600 hover:text-gray-400 font-bold uppercase tracking-widest transition-colors py-1"
                                >
                                    Back to Login
                                </button>
                            </form>
                        )}

                        {/* ── STEP 2: OTP ── */}
                        {step === 'otp' && (
                            <form onSubmit={handleVerifyOtp} className="animate-fade-in space-y-6">
                                <div className="text-center mb-6">
                                    <div
                                        className="w-14 h-14 mx-auto mb-4 flex items-center justify-center bg-rhive-pink/10 border border-rhive-pink/30 shadow-[0_0_20px_rgba(236,2,139,0.15)]"
                                        style={iconClip}
                                    >
                                        <ShieldCheckIcon className="w-6 h-6 text-rhive-pink" />
                                    </div>
                                    <h1 className="text-2xl font-black text-white uppercase tracking-[0.2em] mb-1">Enter Code</h1>
                                    <p className="text-gray-600 text-[10px] font-bold uppercase tracking-[0.3em]">SMS Verification</p>
                                </div>

                                <p className="text-gray-500 text-xs text-center leading-relaxed">
                                    A 6-digit code was sent to{' '}
                                    <span className="text-white font-mono font-bold">{maskPhone(phone)}</span>
                                </p>

                                {/* Dev mode hint */}
                                {devCode && (
                                    <div className="flex items-center gap-2 px-3 py-2 bg-rhive-gold/10 border border-rhive-gold/30" style={badgeClip}>
                                        <ExclamationTriangleIcon className="w-3 h-3 text-rhive-gold flex-shrink-0" />
                                        <p className="text-rhive-gold text-[9px] font-bold uppercase tracking-wider">
                                            Dev mode — Code: <span className="font-mono text-white">{devCode}</span>
                                        </p>
                                    </div>
                                )}

                                <OtpInput value={otp} onChange={setOtp} disabled={otpExpired || loading} />

                                {/* Timer + Resend row */}
                                <div className="flex items-center justify-between px-1">
                                    <div className="flex items-center gap-1.5 text-gray-600">
                                        <ClockIcon className="w-3 h-3" />
                                        <span className="text-[9px] font-bold uppercase tracking-widest">Expires in</span>
                                        <CountdownTimer
                                            key={otpTimerKey}
                                            seconds={300}
                                            onExpired={() => setOtpExpired(true)}
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        id="resend-code-btn"
                                        onClick={handleResendOtp}
                                        disabled={loading}
                                        className="text-[10px] font-bold uppercase tracking-widest text-rhive-pink hover:text-white disabled:opacity-40 transition-colors"
                                    >
                                        {loading ? 'Sending…' : 'Resend Code'}
                                    </button>
                                </div>

                                {errorMessage && (
                                    <div className="flex items-center gap-2 px-3 py-2 bg-red-500/10 border border-red-500/30">
                                        <ExclamationTriangleIcon className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                                        <p className="text-red-400 text-[10px] font-bold uppercase tracking-wider">{errorMessage}</p>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    id="verify-code-btn"
                                    disabled={otp.length !== 6 || otpExpired || loading}
                                    className="w-full h-12 bg-rhive-pink hover:bg-[#ff039a] disabled:opacity-40 disabled:cursor-not-allowed text-white font-black text-[10px] uppercase tracking-[0.25em] transition-all shadow-[0_0_25px_rgba(236,2,139,0.3)] hover:shadow-[0_0_40px_rgba(236,2,139,0.5)] flex items-center justify-center gap-2"
                                    style={btnClip}
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Verifying…
                                        </>
                                    ) : (
                                        <>Verify Code <ArrowRightIcon className="w-4 h-4" /></>
                                    )}
                                </button>

                                <button
                                    type="button"
                                    id="back-to-phone-btn"
                                    onClick={() => { setStep('phone'); setOtp(''); setErrorMessage(''); }}
                                    className="w-full flex items-center justify-center gap-1.5 text-[10px] text-gray-600 hover:text-gray-400 font-bold uppercase tracking-widest transition-colors py-1"
                                >
                                    <ArrowLeftIcon className="w-3 h-3" /> Back
                                </button>
                            </form>
                        )}

                        {/* ── STEP 3: PASSWORD ── */}
                        {step === 'password' && (
                            <form onSubmit={handleSetPassword} className="animate-fade-in space-y-4">
                                <div className="text-center mb-6">
                                    <div
                                        className="w-14 h-14 mx-auto mb-4 flex items-center justify-center bg-rhive-pink/10 border border-rhive-pink/30 shadow-[0_0_20px_rgba(236,2,139,0.15)]"
                                        style={iconClip}
                                    >
                                        <KeyIcon className="w-6 h-6 text-rhive-pink" />
                                    </div>
                                    <h1 className="text-2xl font-black text-white uppercase tracking-[0.2em] mb-1">Set New Password</h1>
                                    <p className="text-gray-600 text-[10px] font-bold uppercase tracking-[0.3em]">Secure Access Restoration</p>
                                </div>

                                {/* Account email badge */}
                                {verifiedEmail && (
                                    <div
                                        className="flex items-center gap-3 px-4 py-3 bg-rhive-pink/5 border border-rhive-pink/20"
                                        style={badgeClip}
                                    >
                                        <EnvelopeIcon className="w-4 h-4 text-rhive-pink flex-shrink-0" />
                                        <div className="min-w-0">
                                            <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest mb-0.5">Resetting access for</p>
                                            <p className="text-white text-xs font-bold font-mono truncate">{maskEmail(verifiedEmail)}</p>
                                        </div>
                                    </div>
                                )}

                                {/* New password */}
                                <FloatingInput
                                    id="new-password"
                                    type={showNewPassword ? 'text' : 'password'}
                                    label="New Password"
                                    value={newPassword}
                                    onChange={setNewPassword}
                                    icon={<LockIcon className="w-4 h-4" />}
                                    autoFocus
                                    rightEl={
                                        <button
                                            type="button"
                                            id="toggle-new-password"
                                            aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                                            onClick={() => setShowNewPassword(p => !p)}
                                            className="text-gray-600 hover:text-rhive-pink transition-colors p-1"
                                        >
                                            {showNewPassword ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                                        </button>
                                    }
                                />

                                <PasswordStrength password={newPassword} />

                                {/* Confirm password */}
                                <FloatingInput
                                    id="confirm-password"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    label="Confirm Password"
                                    value={confirmPassword}
                                    onChange={setConfirmPassword}
                                    icon={<KeyIcon className="w-4 h-4" />}
                                    rightEl={
                                        <button
                                            type="button"
                                            id="toggle-confirm-password"
                                            aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                                            onClick={() => setShowConfirmPassword(p => !p)}
                                            className="text-gray-600 hover:text-rhive-pink transition-colors p-1"
                                        >
                                            {showConfirmPassword ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                                        </button>
                                    }
                                />

                                {/* Match indicator */}
                                {confirmPassword.length > 0 && (
                                    <p className={cn(
                                        'text-[10px] font-bold uppercase tracking-widest px-1 flex items-center gap-1.5',
                                        newPassword === confirmPassword ? 'text-green-400' : 'text-red-400'
                                    )}>
                                        {newPassword === confirmPassword
                                            ? <><CheckCircleIcon className="w-3 h-3" /> Passwords match</>
                                            : <><ExclamationTriangleIcon className="w-3 h-3" /> Passwords do not match</>}
                                    </p>
                                )}

                                {errorMessage && (
                                    <div className="flex items-center gap-2 px-3 py-2 bg-red-500/10 border border-red-500/30">
                                        <ExclamationTriangleIcon className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                                        <p className="text-red-400 text-[10px] font-bold uppercase tracking-wider">{errorMessage}</p>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    id="set-password-btn"
                                    disabled={!newPassword || !confirmPassword || newPassword !== confirmPassword || loading}
                                    className="w-full h-12 mt-2 bg-rhive-pink hover:bg-[#ff039a] disabled:opacity-40 disabled:cursor-not-allowed text-white font-black text-[10px] uppercase tracking-[0.25em] transition-all shadow-[0_0_25px_rgba(236,2,139,0.3)] hover:shadow-[0_0_40px_rgba(236,2,139,0.5)] flex items-center justify-center gap-2"
                                    style={btnClip}
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Updating…
                                        </>
                                    ) : (
                                        <>Set New Password <ArrowRightIcon className="w-4 h-4" /></>
                                    )}
                                </button>
                            </form>
                        )}

                        {/* ── STEP 4: SUCCESS ── */}
                        {step === 'success' && (
                            <div className="animate-fade-in">
                                {/* Header */}
                                <div className="text-center mb-8">
                                    <div
                                        className="w-16 h-16 mx-auto mb-5 flex items-center justify-center bg-green-500/10 border border-green-500/30 shadow-[0_0_20px_rgba(34,197,94,0.15)]"
                                        style={{ clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)' }}
                                    >
                                        <CheckCircleIcon className="w-7 h-7 text-green-400" />
                                    </div>
                                    <h1 className="text-2xl font-black text-white uppercase tracking-[0.2em] mb-1">Password Updated</h1>
                                    <p className="text-gray-600 text-[10px] font-bold uppercase tracking-[0.3em]">QOS Access Restored</p>
                                </div>

                                <p className="text-gray-400 text-xs leading-relaxed text-center mb-5">
                                    Your password has been successfully changed. You can now log in with your new credentials.
                                </p>

                                {/* Email confirmation badge */}
                                <div
                                    className="flex items-start gap-3 px-4 py-3 mb-4 bg-gray-900/60 border border-gray-700"
                                    style={badgeClip}
                                >
                                    <EnvelopeIcon className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mb-1">Confirmation Email Sent</p>
                                        <p className="text-gray-400 text-xs leading-relaxed">
                                            A confirmation email has been sent to your registered email address. Please check your inbox.
                                        </p>
                                        {verifiedEmail && (
                                            <p className="text-gray-600 text-[10px] font-mono mt-1">
                                                {maskEmail(verifiedEmail)}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Security note */}
                                <div
                                    className="flex items-center gap-3 px-4 py-3 mb-5 bg-black/40 border border-gray-800"
                                    style={{ clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)' }}
                                >
                                    <ShieldCheckIcon className="w-4 h-4 text-gray-600 flex-shrink-0" />
                                    <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">This reset session has been permanently invalidated</p>
                                </div>

                                {/* Auto-redirect notice */}
                                <p className="text-center text-[10px] text-gray-700 font-bold uppercase tracking-widest mb-4">
                                    Redirecting to login in{' '}
                                    <span className="text-rhive-pink font-mono">{countdown}s</span>
                                </p>

                                <button
                                    type="button"
                                    id="back-to-login-success"
                                    onClick={goToLogin}
                                    className="w-full h-12 bg-rhive-pink hover:bg-[#ff039a] text-white font-black text-[10px] uppercase tracking-[0.25em] transition-all shadow-[0_0_25px_rgba(236,2,139,0.3)] hover:shadow-[0_0_40px_rgba(236,2,139,0.5)] flex items-center justify-center gap-2"
                                    style={btnClip}
                                >
                                    Back to Login
                                    <ArrowRightIcon className="w-4 h-4" />
                                </button>
                            </div>
                        )}

                    </div>
                </div>
            </div>

            {/* Footer */}
            <p className="mt-8 text-[9px] text-gray-700 font-bold uppercase tracking-[0.5em]">
                Restricted Access • RHIVE Industries © 2025
            </p>
        </div>
    );
};

export default PasswordResetPage;
