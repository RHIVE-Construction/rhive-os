import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useNavigation } from '../contexts/NavigationContext';
import { passwordResetService, userLogService } from '../lib/firebaseService';
import {
    KeyIcon,
    ArrowRightIcon,
    ArrowLeftIcon,
    EnvelopeIcon,
    EyeIcon,
    EyeSlashIcon,
    ShieldCheckIcon,
    ExclamationTriangleIcon,
    CheckCircleIcon,
    ClockIcon
} from '../components/icons';

const PasswordResetPage: React.FC = () => {
    const { setActivePageId } = useNavigation();

    // ── URL token flow (user clicks link from email) ──────────────────────────
    const [urlToken, setUrlToken] = useState<string | null>(null);
    const [verificationStatus, setVerificationStatus] = useState<'idle' | 'verifying' | 'valid' | 'invalid'>('idle');
    const [verifiedEmail, setVerifiedEmail] = useState('');

    // ── Email entry / sent state ──────────────────────────────────────────────
    const [requestEmail, setRequestEmail] = useState('');
    const [loadingRequest, setLoadingRequest] = useState(false);
    const [emailSent, setEmailSent] = useState(false);

    // ── Password change state ─────────────────────────────────────────────────
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loadingReset, setLoadingReset] = useState(false);
    const [resetSuccess, setResetSuccess] = useState(false);
    const [countdown, setCountdown] = useState(3);

    // ── Shared error ──────────────────────────────────────────────────────────
    const [errorMessage, setErrorMessage] = useState('');

    const showError = (msg: string) => {
        setErrorMessage(msg);
        setTimeout(() => setErrorMessage(''), 6000);
    };

    // Parse URL token on mount (user clicked reset link from email)
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');
        if (token) {
            setUrlToken(token);
            setVerificationStatus('verifying');
            passwordResetService.verifyResetToken(token).then(res => {
                if (res.success && res.email) {
                    setVerifiedEmail(res.email);
                    setVerificationStatus('valid');
                } else {
                    setErrorMessage(res.error || 'Invalid or expired reset link.');
                    setVerificationStatus('invalid');
                }
            });
        }
    }, []);

    // Send reset link via Mailgun Cloud Function
    const handleSendLink = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!requestEmail) return;
        setLoadingRequest(true);
        setErrorMessage('');

        const res = await passwordResetService.sendResetLink(requestEmail);
        setLoadingRequest(false);

        if (res.success) {
            setEmailSent(true);
        } else {
            showError(res.error || 'Failed to send reset link. Please try again.');
        }
    };

    // Complete password reset using the token from the URL
    const handlePasswordReset = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!urlToken) return;
        if (newPassword.length < 6) { showError('Password must be at least 6 characters.'); return; }
        if (newPassword !== confirmPassword) { showError('Passwords do not match.'); return; }

        setLoadingReset(true);
        setErrorMessage('');
        const res = await passwordResetService.completePasswordReset(urlToken, newPassword);
        setLoadingReset(false);

        if (res.success) {
            setResetSuccess(true);
            userLogService.logAction('USER_PASSWORD_RESET', 'Password reset via email link', { email: verifiedEmail });
        } else {
            showError(res.error || 'Reset failed. The link may have expired.');
        }
    };

    // Countdown redirect after success
    useEffect(() => {
        if (!resetSuccess) return;
        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) { clearInterval(timer); executeRedirect(); return 0; }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [resetSuccess]);

    const executeRedirect = () => {
        window.history.replaceState({}, document.title, window.location.pathname);
        setActivePageId('P-06');
    };

    return (
        <div className="h-full flex items-center justify-center p-6 bg-black/40 isolate font-sans selection:bg-[#ec028b]/40">
            <div className="w-full max-w-xl animate-fade-in">

                {/* ── SUCCESS: password changed ────────────────────────────── */}
                {resetSuccess ? (
                    <Card className="p-8 relative overflow-hidden text-center border-[#ec028b]/40 bg-black/80">
                        <div className="absolute top-0 left-0 w-full h-1 bg-[#ec028b] shadow-[0_0_15px_#ec028b]" />
                        <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-gray-800 shadow-[0_0_15px_rgba(236,2,139,0.3)]">
                            <CheckCircleIcon className="w-8 h-8 text-[#ec028b] animate-pulse" />
                        </div>
                        <h2 className="text-2xl font-black text-white uppercase tracking-widest">Password Updated</h2>
                        <p className="text-gray-500 text-[10px] mt-2 uppercase font-black tracking-widest">Credentials Saved</p>
                        <div className="my-8 p-6 bg-gray-900/60 rounded-2xl border border-gray-800 text-sm font-mono text-gray-300 leading-relaxed">
                            Your password has been successfully updated.
                            <div className="mt-4 flex items-center justify-center gap-2 text-[#ec028b] font-bold text-xs uppercase tracking-wider">
                                <ClockIcon className="w-4 h-4 animate-spin" />
                                Redirecting in {countdown}s
                            </div>
                        </div>
                        <Button onClick={executeRedirect} className="w-full h-12 text-xs font-black tracking-[0.2em]">
                            Go to Login
                            <ArrowRightIcon className="w-4 h-4 ml-2" />
                        </Button>
                    </Card>

                ) : urlToken && verificationStatus === 'verifying' ? (
                    /* ── Verifying token from URL ─────────────────────────── */
                    <Card className="p-8 text-center border-gray-800 bg-black/60">
                        <div className="py-12 flex flex-col items-center justify-center">
                            <div className="relative w-14 h-14 border border-gray-800 rounded-xl flex items-center justify-center mb-6">
                                <div className="absolute inset-2 border-t-2 border-r-2 border-[#ec028b] rounded-full animate-spin" />
                            </div>
                            <h3 className="text-lg font-bold text-white uppercase tracking-widest">Validating Reset Link</h3>
                            <p className="text-gray-500 text-xs font-mono mt-2">Checking secure token...</p>
                        </div>
                    </Card>

                ) : urlToken && verificationStatus === 'invalid' ? (
                    /* ── Invalid / expired token ──────────────────────────── */
                    <Card className="p-8 relative overflow-hidden border-red-500/30 bg-black/80">
                        <div className="absolute top-0 left-0 w-full h-1 bg-red-500 shadow-[0_0_15px_#ef4444]" />
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-red-950/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-900/30">
                                <ExclamationTriangleIcon className="w-8 h-8 text-red-500" />
                            </div>
                            <h2 className="text-2xl font-black text-white uppercase tracking-widest">Link Expired</h2>
                            <p className="text-red-500 text-[10px] mt-2 uppercase font-black tracking-widest">This reset link is invalid or has already been used</p>
                        </div>
                        <div className="p-5 bg-red-950/10 rounded-xl border border-red-900/20 text-sm font-mono text-center text-red-200/80 mb-8">
                            {errorMessage || 'This reset link is invalid or has already been used.'}
                        </div>
                        <div className="flex gap-4">
                            <Button variant="secondary" onClick={() => { window.history.replaceState({}, document.title, window.location.pathname); setActivePageId('P-06'); }} className="flex-1 h-12 text-xs font-black tracking-widest border-gray-800 text-gray-400">
                                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                                Back to Login
                            </Button>
                            <Button onClick={() => { window.history.replaceState({}, document.title, window.location.pathname); setUrlToken(null); setVerificationStatus('idle'); }} className="flex-1 h-12 text-xs font-black tracking-widest">
                                Request New Link
                                <ArrowRightIcon className="w-4 h-4 ml-2" />
                            </Button>
                        </div>
                    </Card>

                ) : urlToken && verificationStatus === 'valid' ? (
                    /* ── PASSWORD CHANGE FORM (token validated) ──────────── */
                    <Card className="p-8 relative overflow-hidden border-[#ec028b]/30 bg-black/60">
                        <div className="absolute top-0 left-0 w-full h-1 bg-[#ec028b] shadow-[0_0_15px_#ec028b]" />
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gray-800 shadow-pink-glow-sm">
                                <KeyIcon className="w-8 h-8 text-[#ec028b]" />
                            </div>
                            <h2 className="text-2xl font-black text-white uppercase tracking-widest">Set New Password</h2>
                            {verifiedEmail && (
                                <p className="text-gray-500 text-[10px] mt-2 font-mono tracking-widest">{verifiedEmail}</p>
                            )}
                        </div>

                        <form onSubmit={handlePasswordReset} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">New Password</label>
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
                                    <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-rhive-pink transition-colors">
                                        {showNewPassword ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Confirm Password</label>
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
                                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-rhive-pink transition-colors">
                                        {showConfirmPassword ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            {errorMessage && (
                                <p className="text-red-400 text-[10px] font-bold uppercase tracking-widest text-center animate-pulse">{errorMessage}</p>
                            )}

                            <Button type="submit" disabled={loadingReset} className="w-full h-12 text-xs font-black tracking-[0.2em] shadow-pink-glow">
                                {loadingReset ? 'Saving…' : 'Save New Password'}
                                <ArrowRightIcon className="w-4 h-4 ml-2" />
                            </Button>
                        </form>
                    </Card>

                ) : emailSent ? (
                    /* ── EMAIL SENT confirmation ──────────────────────────── */
                    <Card className="p-8 relative overflow-hidden border-gray-800 bg-black/60 text-center">
                        <div className="absolute top-0 left-0 w-full h-1 bg-[#ec028b] shadow-[0_0_15px_#ec028b]" />
                        <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-gray-800 shadow-pink-glow-sm">
                            <ShieldCheckIcon className="w-8 h-8 text-[#ec028b]" />
                        </div>
                        <h2 className="text-2xl font-black text-white uppercase tracking-widest">Check Your Email</h2>
                        <p className="text-gray-500 text-[10px] mt-2 uppercase font-black tracking-widest">Reset Link Dispatched</p>

                        <div className="my-8 p-6 bg-gray-900/60 rounded-2xl border border-gray-800 text-sm text-gray-400 leading-relaxed">
                            <p>A password reset link has been sent to</p>
                            <p className="text-white font-mono font-bold mt-2 mb-3">{requestEmail}</p>
                            <p className="text-xs text-gray-500">Click the link in the email to set a new password. It expires in <span className="text-[#ec028b]">60 minutes</span>.</p>
                            <p className="text-xs text-gray-600 mt-3">Didn't get it? Check your spam folder or the email may not be registered in our system.</p>
                        </div>

                        <div className="flex gap-4">
                            <Button variant="secondary" onClick={() => setActivePageId('P-06')} className="flex-1 h-12 text-xs font-black tracking-widest border-gray-800 text-gray-400 hover:text-white">
                                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                                Back to Login
                            </Button>
                            <Button onClick={() => { setEmailSent(false); setErrorMessage(''); }} variant="secondary" className="flex-1 h-12 text-xs font-black tracking-widest border-gray-700 text-gray-300 hover:text-white">
                                Resend Link
                            </Button>
                        </div>
                    </Card>

                ) : (
                    /* ── EMAIL ENTRY (default first screen) ──────────────── */
                    <Card className="p-8 relative overflow-hidden border-gray-800 bg-black/60">
                        <div className="absolute top-0 left-0 w-full h-1 bg-[#ec028b] shadow-[0_0_15px_#ec028b]" />
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gray-800 shadow-pink-glow-sm">
                                <EnvelopeIcon className="w-8 h-8 text-[#ec028b]" />
                            </div>
                            <h2 className="text-2xl font-black text-white uppercase tracking-widest">Forgot Password</h2>
                            <p className="text-gray-500 text-[10px] mt-2 uppercase font-black tracking-widest">We'll email you a reset link</p>
                        </div>

                        <form onSubmit={handleSendLink} className="space-y-6">
                            <p className="text-gray-400 text-sm leading-relaxed text-center">
                                Enter the email address linked to your RHIVE account and we'll send you a password reset link.
                            </p>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">
                                    Your Email Address
                                </label>
                                <Input
                                    id="recovery-email"
                                    placeholder="you@rhiveconstruction.com"
                                    type="email"
                                    value={requestEmail}
                                    onChange={e => setRequestEmail(e.target.value)}
                                    required
                                    autoFocus
                                />
                            </div>

                            {errorMessage && (
                                <p className="text-red-400 text-[10px] font-bold uppercase tracking-widest text-center animate-pulse">{errorMessage}</p>
                            )}

                            <div className="flex gap-4">
                                <Button type="button" variant="secondary" onClick={() => setActivePageId('P-06')} className="flex-none px-5 h-12 bg-gray-900 border-gray-800 text-gray-500 hover:bg-gray-800 hover:text-white rounded-xl uppercase tracking-widest text-[10px] font-black">
                                    <ArrowLeftIcon className="w-4 h-4 mr-2" />
                                    Back
                                </Button>
                                <Button type="submit" disabled={loadingRequest || !requestEmail} className="flex-1 h-12 text-xs font-black tracking-[0.2em] shadow-pink-glow">
                                    {loadingRequest ? 'Sending…' : 'Send Reset Link'}
                                    <ArrowRightIcon className="w-4 h-4 ml-2" />
                                </Button>
                            </div>
                        </form>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default PasswordResetPage;
