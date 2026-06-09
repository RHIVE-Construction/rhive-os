
import React, { useState, useEffect } from 'react';
import { RhiveLogo, KeyIcon, LockIcon, EyeIcon, EyeSlashIcon, CheckIcon, XIcon, ArrowRightIcon, EnvelopeIcon, ShieldCheckIcon } from '../components/icons';
import { Button } from '../components/ui/button';
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
    );
};

export default PasswordResetPage;
