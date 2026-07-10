
import React, { useState, useEffect } from 'react';
import { RhiveLogo, KeyIcon, LockIcon, EyeIcon, EyeSlashIcon, CheckIcon, XIcon, ArrowRightIcon, EnvelopeIcon, ShieldCheckIcon } from '../components/icons';
import { Button } from '../components/ui/button';
import React, { useState, useEffect, useRef } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useNavigation } from '../contexts/NavigationContext';
import { smsOtpService, passwordResetService, userLogService } from '../lib/firebaseService';
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
} from '../components/icons';
import { cn } from '../lib/utils';
import { passwordResetService, authService } from '../lib/firebaseService';

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

// ─── Main Page ────────────────────────────────────────────────────────────────
const PasswordResetPage: React.FC = () => {
    const params = new URLSearchParams(window.location.search);
    const mode = params.get('mode');
    const token = params.get('token') || '';
    const oobCode = params.get('oobCode') || '';

    const isFirestoreReset = mode === 'firestoreReset' && !!token;
    const isAuthReset = mode === 'resetPassword' && !!oobCode;

    type Stage = 'verifying' | 'ready' | 'expired' | 'success';
    const [stage, setStage] = useState<Stage>(isFirestoreReset || isAuthReset ? 'verifying' : 'expired');
    const [verifiedEmail, setVerifiedEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [showPwd, setShowPwd] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isFirestoreReset) {
            passwordResetService.verifyToken(token).then(result => {
                if (result.success && result.email) {
                    setVerifiedEmail(result.email);
                    setStage('ready');
                } else {
                    setErrorMsg(result.error || 'Invalid or expired link.');
                    setStage('expired');
                }
            });
        } else if (isAuthReset) {
            authService.verifyResetCode(oobCode).then(result => {
                if (result.success && result.email) {
                    setVerifiedEmail(result.email);
                    setStage('ready');
                } else {
                    setErrorMsg(result.error || 'Invalid or expired link.');
                    setStage('expired');
                }
            });
        } else {
            setStage('expired');
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
    // Must declare refs individually at top level — React hooks cannot be called inside Array.from()
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
    const [countdown, setCountdown] = useState(3);
    const [devCode, setDevCode] = useState<string | undefined>(undefined);
    const [otpExpired, setOtpExpired] = useState(false);
    const [otpTimerKey, setOtpTimerKey] = useState(0); // reset timer on resend

    const showError = (msg: string) => {
        setErrorMessage(msg);
        setTimeout(() => setErrorMessage(''), 5000);
    };

    // ── Step 1: Send OTP ───────────────────────────────────────────────────
    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!phone.trim()) return;
        setLoading(true);
        setErrorMessage('');

        const res = await smsOtpService.sendOtp(phone.trim());
        setLoading(false);

        if (res.success) {
            setDevCode(res.devCode); // Only in dev/simulation mode
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
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirm) { setErrorMsg('Passwords do not match.'); return; }
        if (password.length < 6) { setErrorMsg('Password must be at least 6 characters.'); return; }
        setErrorMsg('');
        setLoading(true);

        const result = isFirestoreReset
            ? await passwordResetService.applyNewPassword(token, password)
            : await authService.confirmPasswordReset(oobCode, password);

        setLoading(false);
        if (result.success) setStage('success');
        else setErrorMsg(result.error || 'Failed to reset password.');
    };

    const goToLogin = () => { window.location.href = window.location.origin; };

    // Chamfer value for main card
    const C = 32;
    const cardClip = `polygon(${C}px 0, calc(100% - ${C}px) 0, 100% ${C}px, 100% calc(100% - ${C}px), calc(100% - ${C}px) 100%, ${C}px 100%, 0 calc(100% - ${C}px), 0 ${C}px)`;

    return (
        <div className="w-full min-h-screen flex flex-col items-center justify-center py-12 px-4 font-sans">

            {/* Logo */}
            <RhiveLogo className="h-16 w-auto mb-10 opacity-90 hover:opacity-100 transition-opacity" />

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

                        {/* ── VERIFYING ── */}
                        {stage === 'verifying' && (
                            <div className="flex flex-col items-center gap-6 py-12 animate-fade-in">
                                <div className="relative w-20 h-20">
                                    <div className="absolute inset-0 rounded-full border-2 border-rhive-pink/20" />
                                    <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-rhive-pink animate-spin" />
                                    <div className="absolute inset-4 flex items-center justify-center">
                                        <ShieldCheckIcon className="w-8 h-8 text-rhive-pink opacity-60" />
                                    </div>
                                </div>
                                <div className="text-center">
                                    <p className="text-white font-black uppercase tracking-[0.25em] text-sm mb-1">Verifying Link</p>
                                    <p className="text-gray-600 text-[10px] font-bold uppercase tracking-widest">Authenticating security token…</p>
                                </div>
                            </div>
                        )}

                        {/* ── EXPIRED / INVALID ── */}
                        {stage === 'expired' && (
                            <div className="animate-fade-in">
                                {/* Header */}
                                <div className="text-center mb-8">
                                    <div
                                        className="w-16 h-16 mx-auto mb-5 flex items-center justify-center bg-red-500/10 border border-red-500/30"
                                        style={{ clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)' }}
                                    >
                                        <XIcon className="w-7 h-7 text-red-400" />
                                    </div>
                                    <h1 className="text-2xl font-black text-white uppercase tracking-[0.2em] mb-1">Link Expired</h1>
                                    <p className="text-gray-600 text-[10px] font-bold uppercase tracking-[0.3em]">Secure Reset Protocol</p>
                                </div>
                                <p className="text-gray-400 text-xs leading-relaxed text-center mb-8 px-2">
                                    {errorMsg || 'This password reset link is invalid or has expired. Reset links are valid for 1 hour and can only be used once.'}
                                </p>
                                <button
                                    type="button"
                                    onClick={goToLogin}
                                    className="w-full h-12 bg-rhive-pink hover:bg-[#ff039a] text-white font-black text-[10px] uppercase tracking-[0.25em] transition-all shadow-[0_0_25px_rgba(236,2,139,0.3)] hover:shadow-[0_0_35px_rgba(236,2,139,0.5)] flex items-center justify-center gap-2"
                                    style={{ clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)' }}
                                >
                                    Back to Login
                                    <ArrowRightIcon className="w-4 h-4" />
                                </button>
                            </div>
                        )}

                        {/* ── READY — set new password ── */}
                        {stage === 'ready' && (
                            <form onSubmit={handleSubmit} className="animate-fade-in">
                                {/* Header */}
                                <div className="text-center mb-8">
                                    <h1 className="text-2xl font-black text-white uppercase tracking-[0.2em] mb-1">Set New Password</h1>
                                    <p className="text-gray-600 text-[10px] font-bold uppercase tracking-[0.3em]">Secure access restoration</p>
                                </div>

                                {/* Account badge */}
                                <div
                                    className="flex items-center gap-3 px-4 py-3 mb-6 bg-rhive-pink/5 border border-rhive-pink/20"
                                    style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}
                                >
                                    <EnvelopeIcon className="w-4 h-4 text-rhive-pink flex-shrink-0" />
                                    <div className="min-w-0">
                                        <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest mb-0.5">Resetting access for</p>
                                        <p className="text-white text-xs font-bold font-mono truncate">{verifiedEmail}</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {/* New password */}
                                    <FloatingInput
                                        id="new-password"
                                        type={showPwd ? 'text' : 'password'}
                                        label="New Password"
                                        value={password}
                                        onChange={setPassword}
                                        icon={<LockIcon className="w-4 h-4" />}
                                        autoFocus
                                        rightEl={
                                            <button type="button" onClick={() => setShowPwd(p => !p)} className="text-gray-600 hover:text-rhive-pink transition-colors p-1">
                                                {showPwd ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                                            </button>
                                        }
                                    />

                                    {/* Strength meter */}
                                    <PasswordStrength password={password} />

                                    {/* Confirm password */}
                                    <FloatingInput
                                        id="confirm-password"
                                        type={showConfirm ? 'text' : 'password'}
                                        label="Confirm Password"
                                        value={confirm}
                                        onChange={setConfirm}
                                        icon={<KeyIcon className="w-4 h-4" />}
                                        rightEl={
                                            <button type="button" onClick={() => setShowConfirm(p => !p)} className="text-gray-600 hover:text-rhive-pink transition-colors p-1">
                                                {showConfirm ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                                            </button>
                                        }
                                    />

                                    {/* Match indicator */}
                                    {confirm.length > 0 && (
                                        <p className={cn('text-[10px] font-bold uppercase tracking-widest px-1 flex items-center gap-1.5', password === confirm ? 'text-green-400' : 'text-red-400')}>
                                            {password === confirm
                                                ? <><CheckIcon className="w-3 h-3" /> Passwords match</>
                                                : <><XIcon className="w-3 h-3" /> Passwords do not match</>}
                                        </p>
                                    )}

                                    {/* Error */}
                                    {errorMsg && (
                                        <p className="text-rhive-pink text-[10px] font-bold uppercase tracking-widest text-center px-1 animate-pulse">{errorMsg}</p>
                                    )}

                                    {/* Submit */}
                                    <button
                                        type="submit"
                                        disabled={!password || !confirm || password !== confirm || loading}
                                        className="w-full h-12 mt-2 bg-rhive-pink hover:bg-[#ff039a] disabled:opacity-40 disabled:cursor-not-allowed text-white font-black text-[10px] uppercase tracking-[0.25em] transition-all shadow-[0_0_25px_rgba(236,2,139,0.3)] hover:shadow-[0_0_40px_rgba(236,2,139,0.5)] flex items-center justify-center gap-2"
                                        style={{ clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)' }}
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
                                </div>
                            </form>
                        )}

                        {/* ── SUCCESS ── */}
                        {stage === 'success' && (
                            <div className="animate-fade-in">
                                {/* Header */}
                                <div className="text-center mb-8">
                                    <div
                                        className="w-16 h-16 mx-auto mb-5 flex items-center justify-center bg-green-500/10 border border-green-500/30 shadow-[0_0_20px_rgba(34,197,94,0.15)]"
                                        style={{ clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)' }}
                                    >
                                        <CheckIcon className="w-7 h-7 text-green-400" />
                                    </div>
                                    <h1 className="text-2xl font-black text-white uppercase tracking-[0.2em] mb-1">Password Updated</h1>
                                    <p className="text-gray-600 text-[10px] font-bold uppercase tracking-[0.3em]">QOS Access Restored</p>
                                </div>

                                <p className="text-gray-400 text-xs leading-relaxed text-center mb-4">
                                    Your password has been successfully changed. You can now log in with your new credentials.
                                </p>

                                {/* Security note */}
                                <div
                                    className="flex items-center gap-3 px-4 py-3 mb-6 bg-black/40 border border-gray-800"
                                    style={{ clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)' }}
                                >
                                    <ShieldCheckIcon className="w-4 h-4 text-gray-600 flex-shrink-0" />
                                    <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">This reset link is now permanently invalidated</p>
                                </div>

                                <button
                                    type="button"
                                    onClick={goToLogin}
                                    className="w-full h-12 bg-rhive-pink hover:bg-[#ff039a] text-white font-black text-[10px] uppercase tracking-[0.25em] transition-all shadow-[0_0_25px_rgba(236,2,139,0.3)] hover:shadow-[0_0_40px_rgba(236,2,139,0.5)] flex items-center justify-center gap-2"
                                    style={{ clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)' }}
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
    // ── Step 2: Verify OTP ─────────────────────────────────────────────────
    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (otp.length !== 6) { showError('Please enter the complete 6-digit code.'); return; }
        setLoading(true);
        setErrorMessage('');

        const res = await smsOtpService.verifyOtp(phone.trim(), otp);
        setLoading(false);

        if (res.success && res.resetToken) {
            setResetToken(res.resetToken);
            setVerifiedEmail(res.email || null);
            setStep('password');
        } else {
            showError(res.error || 'Invalid code. Please try again.');
        }
    };

    // ── Step 3: Reset Password ─────────────────────────────────────────────
    const handlePasswordReset = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword.length < 6) { showError('Password must be at least 6 characters.'); return; }
        if (newPassword !== confirmPassword) { showError('Passwords do not match.'); return; }
        setLoading(true);
        setErrorMessage('');

        const res = await passwordResetService.completePasswordReset(resetToken, newPassword);
        setLoading(false);

        if (res.success) {
            userLogService.logAction('USER_PASSWORD_RESET', `Password reset via SMS OTP`, { phone });
            setStep('success');
        } else {
            showError(res.error || 'Failed to update password. The session may have expired.');
        }
    };

    // ── Success: countdown redirect ────────────────────────────────────────
    useEffect(() => {
        if (step !== 'success') return;
        const t = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) { clearInterval(t); setActivePageId('P-06'); return 0; }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(t);
    }, [step]);

    // ─────────────────────────────────────────────────────────────────────────
    // Shared card wrapper
    const CardShell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
        <div className="h-full flex items-center justify-center p-6 bg-black/40 isolate font-sans selection:bg-[#ec028b]/40">
            <div className="w-full max-w-xl animate-fade-in">
                {children}
            </div>
        </div>
    );

    // ─────────────────────────────────────────────────────────────────────────
    // SUCCESS STATE
    if (step === 'success') {
        return (
            <CardShell>
                <Card className="p-8 relative overflow-hidden text-center border-[#ec028b]/40 bg-black/80">
                    <div className="absolute top-0 left-0 w-full h-1 bg-[#ec028b] shadow-[0_0_15px_#ec028b]" />
                    <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-gray-800 shadow-[0_0_15px_rgba(236,2,139,0.3)]">
                        <CheckCircleIcon className="w-8 h-8 text-[#ec028b] animate-pulse" />
                    </div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-widest">Override Successful</h2>
                    <p className="text-gray-500 text-[10px] mt-2 uppercase font-black tracking-widest">Credentials Reprogrammed</p>
                    <div className="my-8 p-6 bg-gray-900/60 rounded-2xl border border-gray-800 text-sm font-mono max-w-md mx-auto leading-relaxed text-gray-300">
                        Your password has been successfully updated.
                        <div className="mt-4 flex items-center justify-center gap-2 text-[#ec028b] font-bold text-xs uppercase tracking-wider">
                            <ClockIcon className="w-4 h-4 animate-spin" />
                            Redirecting in {countdown}s
                        </div>
                    </div>
                    <Button onClick={() => setActivePageId('P-06')} className="w-full h-12 text-xs font-black tracking-[0.2em]">
                        Go to Login
                        <ArrowRightIcon className="w-4 h-4 ml-2" />
                    </Button>
                </Card>
            </CardShell>
        );
    }

    // ─────────────────────────────────────────────────────────────────────────
    // STEP 1: PHONE NUMBER
    if (step === 'phone') {
        return (
            <CardShell>
                <Card className="p-8 relative overflow-hidden border-gray-800 bg-black/60">
                    <div className="absolute top-0 left-0 w-full h-1 bg-[#ec028b] shadow-[0_0_15px_#ec028b]" />

                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gray-800 shadow-pink-glow-sm">
                            <PhoneIcon className="w-8 h-8 text-[#ec028b]" />
                        </div>
                        <h2 className="text-2xl font-black text-white uppercase tracking-widest">Access Recovery</h2>
                        <p className="text-gray-500 text-[10px] mt-2 uppercase font-black tracking-widest">SMS Verification Protocol</p>
                    </div>

                    <form onSubmit={handleSendOtp} className="space-y-6">
                        <p className="text-gray-400 text-xs leading-relaxed text-center">
                            Enter the phone number linked to your account. A <strong className="text-white">6-digit verification code</strong> will be sent via SMS.
                        </p>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">
                                Phone Number
                            </label>
                            <Input
                                id="recovery-phone"
                                placeholder="+1 1234 567"
                                type="tel"
                                value={phone}
                                onChange={e => setPhone(e.target.value)}
                                required
                                autoFocus
                            />
                            <p className="text-[9px] text-gray-600 ml-1">Include country code (e.g. +63 for Philippines)</p>
                        </div>

                        {errorMessage && (
                            <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest text-center animate-pulse">
                                {errorMessage}
                            </p>
                        )}

                        <div className="flex gap-4">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => setActivePageId('P-06')}
                                className="flex-none px-5 h-12 bg-gray-900 border-gray-800 text-gray-500 hover:bg-gray-800 hover:text-white rounded-xl uppercase tracking-widest text-[10px] font-black"
                            >
                                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                                Back
                            </Button>
                            <Button
                                type="submit"
                                disabled={loading || !phone.trim()}
                                className="flex-1 h-12 text-xs font-black tracking-[0.2em] shadow-pink-glow"
                            >
                                {loading ? 'Sending Code…' : 'Send Verification Code'}
                                <ArrowRightIcon className="w-4 h-4 ml-2" />
                            </Button>
                        </div>
                    </form>
                </Card>
            </CardShell>
        );
    }

    // ─────────────────────────────────────────────────────────────────────────
    // STEP 2: OTP VERIFICATION
    if (step === 'otp') {
        return (
            <CardShell>
                <Card className="p-8 relative overflow-hidden border-[#ec028b]/30 bg-black/60">
                    <div className="absolute top-0 left-0 w-full h-1 bg-[#ec028b] shadow-[0_0_15px_#ec028b]" />

                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gray-800 shadow-pink-glow-sm">
                            <ShieldCheckIcon className="w-8 h-8 text-[#ec028b]" />
                        </div>
                        <h2 className="text-2xl font-black text-white uppercase tracking-widest">Enter Code</h2>
                        <p className="text-gray-500 text-[10px] mt-2 uppercase font-black tracking-widest">SMS OTP Verification</p>
                    </div>

                    <form onSubmit={handleVerifyOtp} className="space-y-6">
                        <div className="text-center space-y-1">
                            <p className="text-gray-400 text-xs leading-relaxed">
                                A 6-digit code was sent to:
                            </p>
                            <p className="text-[#ec028b] text-sm font-bold font-mono tracking-wider">{phone}</p>
                            <div className="flex items-center justify-center gap-2 mt-1">
                                <ClockIcon className="w-3 h-3 text-gray-500" />
                                <span className="text-[9px] text-gray-500 uppercase font-bold tracking-wider">Expires in:</span>
                                <CountdownTimer key={otpTimerKey} seconds={300} onExpired={() => setOtpExpired(true)} />
                            </div>
                        </div>

                        {/* Dev mode: show code hint */}
                        {devCode && (
                            <div className="text-center p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                                <p className="text-yellow-400 text-[10px] font-black uppercase tracking-widest">Dev Mode — No JustCall configured</p>
                                <p className="text-yellow-300 text-xl font-mono font-black mt-1 tracking-widest">{devCode}</p>
                                <p className="text-yellow-600 text-[9px] mt-1">This code won't appear in production</p>
                            </div>
                        )}

                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block text-center">
                                6-Digit Verification Code
                            </label>
                            <OtpInput value={otp} onChange={setOtp} disabled={loading || otpExpired} />
                        </div>

                        {errorMessage && (
                            <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest text-center animate-pulse">
                                {errorMessage}
                            </p>
                        )}

                        {otpExpired && (
                            <p className="text-orange-500 text-[10px] font-bold uppercase tracking-widest text-center">
                                Code expired — please request a new one
                            </p>
                        )}

                        <div className="flex gap-3">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => setStep('phone')}
                                className="flex-none px-5 h-12 bg-gray-900 border-gray-800 text-gray-500 hover:bg-gray-800 hover:text-white rounded-xl uppercase tracking-widest text-[10px] font-black"
                            >
                                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                                Back
                            </Button>
                            <Button
                                type="submit"
                                disabled={loading || otp.length !== 6 || otpExpired}
                                className="flex-1 h-12 text-xs font-black tracking-[0.2em] shadow-pink-glow"
                            >
                                {loading ? 'Verifying…' : 'Verify Code'}
                                <ArrowRightIcon className="w-4 h-4 ml-2" />
                            </Button>
                        </div>

                        <div className="text-center pt-2 border-t border-gray-800">
                            <button
                                type="button"
                                onClick={handleResendOtp}
                                disabled={loading}
                                className="text-[10px] font-black uppercase tracking-wider text-gray-500 hover:text-[#ec028b] transition-colors disabled:opacity-40 bg-transparent border-none outline-none cursor-pointer"
                            >
                                Didn't receive it? Resend Code
                            </button>
                        </div>
                    </form>
                </Card>
            </CardShell>
        );
    }

    // ─────────────────────────────────────────────────────────────────────────
    // STEP 3: NEW PASSWORD
    return (
        <CardShell>
            <Card className="p-8 relative overflow-hidden border-[#ec028b]/30 bg-black/60">
                <div className="absolute top-0 left-0 w-full h-1 bg-[#ec028b] shadow-[0_0_15px_#ec028b]" />

                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gray-800 shadow-pink-glow-sm">
                        <KeyIcon className="w-8 h-8 text-[#ec028b]" />
                    </div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-widest">Set New Password</h2>
                    <p className="text-gray-500 text-[10px] mt-2 uppercase font-black tracking-widest">
                        {verifiedEmail ? `Account: ${verifiedEmail}` : 'Enter your new credentials'}
                    </p>
                </div>

                <form onSubmit={handlePasswordReset} className="space-y-6">
                    <div className="space-y-2 relative group">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">
                            New Password
                        </label>
                        <div className="relative">
                            <Input
                                id="new-password"
                                type={showNewPassword ? 'text' : 'password'}
                                placeholder="••••••••••••"
                                value={newPassword}
                                onChange={e => setNewPassword(e.target.value)}
                                required
                                className="pr-12"
                            />
                            <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-rhive-pink transition-colors"
                            >
                                {showNewPassword ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2 relative group">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <Input
                                id="confirm-password"
                                type={showConfirmPassword ? 'text' : 'password'}
                                placeholder="••••••••••••"
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                                required
                                className="pr-12"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-rhive-pink transition-colors"
                            >
                                {showConfirmPassword ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                            </button>
                        </div>
                        {newPassword && confirmPassword && newPassword !== confirmPassword && (
                            <p className="text-red-500 text-[9px] font-bold uppercase tracking-wider ml-1">Passwords do not match</p>
                        )}
                    </div>

                    {errorMessage && (
                        <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest text-center animate-pulse">
                            {errorMessage}
                        </p>
                    )}

                    <div className="pt-2">
                        <Button
                            type="submit"
                            disabled={loading || !newPassword || !confirmPassword}
                            className="w-full h-12 text-xs font-black tracking-[0.2em] shadow-pink-glow"
                        >
                            {loading ? 'Updating Password…' : 'Update Password'}
                            <ArrowRightIcon className="w-4 h-4 ml-2" />
                        </Button>
                    </div>
                </form>
            </Card>
        </CardShell>
    );
};

export default PasswordResetPage;
