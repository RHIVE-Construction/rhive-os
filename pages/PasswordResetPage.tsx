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
    };

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
                                placeholder="+63 956 021 3304"
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
