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
import { cn } from '../lib/utils';

const PasswordResetPage: React.FC = () => {
    const { setActivePageId } = useNavigation();

    // Query parameters parsing
    const [token, setToken] = useState<string | null>(null);

    // Flow State
    const [isTokenFlow, setIsTokenFlow] = useState(false);
    const [verificationStatus, setVerificationStatus] = useState<'idle' | 'verifying' | 'valid' | 'invalid'>('idle');
    const [verifiedEmail, setVerifiedEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Request State (State A)
    const [requestEmail, setRequestEmail] = useState('');
    const [isRequested, setIsRequested] = useState(false);
    const [loadingRequest, setLoadingRequest] = useState(false);

    // Override State (State B)
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loadingReset, setLoadingReset] = useState(false);
    const [resetSuccess, setResetSuccess] = useState(false);

    // Auto Redirect Timer
    const [countdown, setCountdown] = useState(3);

    // Parse URL on mount
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const urlToken = params.get('token');
        if (urlToken) {
            setToken(urlToken);
            setIsTokenFlow(true);
            verifyToken(urlToken);
        } else {
            setIsTokenFlow(false);
            setVerificationStatus('idle');
        }
    }, [window.location.search]);

    // Token verification helper
    const verifyToken = async (tokenStr: string) => {
        setVerificationStatus('verifying');
        const res = await passwordResetService.verifyResetToken(tokenStr);
        if (res.success && res.email) {
            setVerifiedEmail(res.email);
            setVerificationStatus('valid');
        } else {
            setErrorMessage(res.error || 'The secure recovery token is invalid or expired.');
            setVerificationStatus('invalid');
        }
    };

    // Handler to request a recovery link
    const handleRequestLink = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!requestEmail) return;
        setLoadingRequest(true);
        setErrorMessage('');

        const res = await passwordResetService.createResetToken(requestEmail);
        setLoadingRequest(false);

        if (res.success) {
            // Email has been queued via Firestore `mail` collection.
            // The "Trigger Email from Firestore" extension delivers it.
            setIsRequested(true);
        } else {
            setErrorMessage(res.error || 'Failed to dispatch secure link. Verify registered status.');
        }
    };

    // Handler to execute password override
    const handlePasswordReset = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return;

        if (newPassword.length < 6) {
            setErrorMessage('Password must be at least 6 characters long.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setErrorMessage('New passwords do not match.');
            return;
        }

        setLoadingReset(true);
        setErrorMessage('');

        const res = await passwordResetService.completePasswordReset(token, newPassword);
        setLoadingReset(false);

        if (res.success) {
            setResetSuccess(true);
            userLogService.logAction(
                'USER_PASSWORD_RESET',
                `Password successfully reset via recovery link`,
                { email: verifiedEmail }
            );
        } else {
            setErrorMessage(res.error || 'Secure override transaction failed. Token might be expired.');
        }
    };

    // Countdown and clear URL query parameters on success redirect
    useEffect(() => {
        if (!resetSuccess) return;

        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    executeRedirect();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [resetSuccess]);

    const executeRedirect = () => {
        // Clear all query params in url for a clean landing state
        window.history.replaceState({}, document.title, window.location.pathname);
        setActivePageId('P-06'); // Redirect to LoginPage (or empty page, which defaults to Login)
    };

    return (
        <div className="h-full flex items-center justify-center p-6 bg-black/40 isolate font-sans selection:bg-[#ec028b]/40">
            <div className="w-full max-w-xl animate-fade-in">
                {/* STATE 1: Token Flow is present and completed successfully */}
                {resetSuccess ? (
                    <Card className="p-8 relative overflow-hidden text-center border-[#ec028b]/40 bg-black/80">
                        {/* Pink glowing accent bar */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-[#ec028b] shadow-[0_0_15px_#ec028b]" />

                        <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-gray-800 shadow-[0_0_15px_rgba(236,2,139,0.3)]">
                            <CheckCircleIcon className="w-8 h-8 text-[#ec028b] animate-pulse" />
                        </div>

                        <h2 className="text-2xl font-black text-white uppercase tracking-widest">Override Successful</h2>
                        <p className="text-gray-500 text-[10px] mt-2 uppercase font-black tracking-widest">Credentials Reprogrammed</p>

                        <div className="my-8 p-6 bg-gray-900/60 rounded-2xl border border-gray-800 text-sm font-mono max-w-md mx-auto leading-relaxed text-gray-300">
                            Your password override has been successfully completed in our secure database registry.
                            <div className="mt-4 flex items-center justify-center gap-2 text-[#ec028b] font-bold text-xs uppercase tracking-wider">
                                <ClockIcon className="w-4 h-4 animate-spin" />
                                Redirection in {countdown}s
                            </div>
                        </div>

                        <Button onClick={executeRedirect} className="w-full h-12 text-xs font-black tracking-[0.2em]">
                            Establish Login Gateway
                            <ArrowRightIcon className="w-4 h-4 ml-2" />
                        </Button>
                    </Card>
                ) : isTokenFlow ? (
                    /* STATE B: REDEMPTION (Token present in URL) */
                    <div>
                        {verificationStatus === 'verifying' && (
                            <Card className="p-8 text-center border-gray-800 bg-black/60">
                                <div className="py-12 flex flex-col items-center justify-center">
                                    <div className="relative w-14 h-14 border border-gray-800 rounded-xl flex items-center justify-center mb-6">
                                        <div className="absolute inset-2 border-t-2 border-r-2 border-[#ec028b] rounded-full animate-spin" />
                                    </div>
                                    <h3 className="text-lg font-bold text-white uppercase tracking-widest">Validating Override Token</h3>
                                    <p className="text-gray-500 text-xs font-mono mt-2">Checking Firestore secure registry...</p>
                                </div>
                            </Card>
                        )}

                        {verificationStatus === 'invalid' && (
                            <Card className="p-8 relative overflow-hidden border-red-500/30 bg-black/80">
                                {/* Red alert accent bar */}
                                <div className="absolute top-0 left-0 w-full h-1 bg-red-500 shadow-[0_0_15px_#ef4444]" />

                                <div className="text-center mb-8">
                                    <div className="w-16 h-16 bg-red-950/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-900/30 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                                        <ExclamationTriangleIcon className="w-8 h-8 text-red-500" />
                                    </div>
                                    <h2 className="text-2xl font-black text-white uppercase tracking-widest">Security Exception</h2>
                                    <p className="text-red-500 text-[10px] mt-2 uppercase font-black tracking-widest">Access Protocol Rejected</p>
                                </div>

                                <div className="p-6 bg-red-950/10 rounded-2xl border border-red-900/20 text-sm font-mono text-center text-red-200/80 mb-8">
                                    {errorMessage}
                                </div>

                                <Button 
                                    variant="secondary" 
                                    onClick={() => {
                                        window.history.replaceState({}, document.title, window.location.pathname);
                                        setActivePageId('P-06');
                                    }} 
                                    className="w-full h-12 text-xs font-black tracking-widest border-red-900/40 text-red-400 hover:bg-red-950/10 hover:border-red-500/50"
                                >
                                    <ArrowLeftIcon className="w-4 h-4 mr-2" />
                                    Back to Gateway
                                </Button>
                            </Card>
                        )}

                        {verificationStatus === 'valid' && (
                            <Card className="p-8 relative overflow-hidden border-[#ec028b]/30 bg-black/60">
                                {/* Pink accent bar */}
                                <div className="absolute top-0 left-0 w-full h-1 bg-[#ec028b] shadow-[0_0_15px_#ec028b]" />

                                <div className="text-center mb-8">
                                    <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gray-800 shadow-pink-glow-sm">
                                        <KeyIcon className="w-8 h-8 text-[#ec028b]" />
                                    </div>
                                    <h2 className="text-2xl font-black text-white uppercase tracking-widest">Update Password</h2>
                                    <p className="text-gray-500 text-[10px] mt-2 uppercase font-black tracking-widest">Enter your new credentials below to reprogram your security registry profile</p>
                                </div>

                                <form onSubmit={handlePasswordReset} className="space-y-6">
                                    {/* New Password Input */}
                                    <div className="space-y-2 relative group">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">
                                            New Secure Password
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

                                    {/* Confirm Password Input */}
                                    <div className="space-y-2 relative group">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">
                                            Confirm Secure Password
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
                                    </div>

                                    {errorMessage && (
                                        <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest text-center animate-pulse">
                                            {errorMessage}
                                        </p>
                                    )}

                                    <div className="pt-2">
                                        <Button
                                            type="submit"
                                            disabled={loadingReset}
                                            className="w-full h-12 text-xs font-black tracking-[0.2em] shadow-pink-glow"
                                        >
                                            {loadingReset ? 'Updating Password…' : 'Update Password'}
                                            <ArrowRightIcon className="w-4 h-4 ml-2" />
                                        </Button>
                                    </div>
                                </form>
                            </Card>
                        )}
                    </div>
                ) : (
                    /* STATE A: REQUEST LINK (No token in URL) */
                    <div className="space-y-6">
                        <Card className="p-8 relative overflow-hidden border-gray-800 bg-black/60">
                            {/* Pink accent bar */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-[#ec028b] shadow-[0_0_15px_#ec028b]" />

                            <div className="text-center mb-8">
                                <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gray-800 shadow-pink-glow-sm">
                                    <KeyIcon className="w-8 h-8 text-[#ec028b]" />
                                </div>
                                <h2 className="text-2xl font-black text-white uppercase tracking-widest">Access Recovery</h2>
                                <p className="text-gray-500 text-[10px] mt-2 uppercase font-black tracking-widest">QOS Secure Recovery Protocol</p>
                            </div>

                            {!isRequested ? (
                                <form onSubmit={handleRequestLink} className="space-y-6">
                                    <p className="text-gray-400 text-xs leading-relaxed text-center">
                                        Input your registered employee or portal email. A secure, high-clearance cryptographically generated override link will be dispatched.
                                    </p>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">
                                            Your Registered Email
                                        </label>
                                        <Input
                                            id="recovery-email"
                                            placeholder="employee@rhive.com"
                                            type="email"
                                            value={requestEmail}
                                            onChange={e => setRequestEmail(e.target.value)}
                                            required
                                        />
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
                                            disabled={loadingRequest}
                                            className="flex-1 h-12 text-xs font-black tracking-[0.2em] shadow-pink-glow"
                                        >
                                            {loadingRequest ? 'Dispatching…' : 'Generate Recovery Link'}
                                            <ArrowRightIcon className="w-4 h-4 ml-2" />
                                        </Button>
                                    </div>
                                </form>
                            ) : (
                                <div className="text-center py-4 space-y-6">
                                    <div className="w-12 h-12 bg-green-950/20 border border-green-500/30 rounded-xl flex items-center justify-center mx-auto mb-2 text-green-400 shadow-[0_0_12px_rgba(34,197,94,0.2)]">
                                        <ShieldCheckIcon className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-lg font-bold text-white uppercase tracking-widest">Email Sent</h3>
                                    <div className="space-y-3">
                                        <p className="text-gray-400 text-xs leading-relaxed max-w-sm mx-auto">
                                            A password reset link has been sent to:
                                        </p>
                                        <p className="text-[#ec028b] text-sm font-bold font-mono break-all">
                                            {requestEmail}
                                        </p>
                                        <p className="text-gray-500 text-[11px] leading-relaxed max-w-sm mx-auto">
                                            Check your inbox and follow the link to set a new password.
                                            The link expires in <strong className="text-gray-400">1 hour</strong>.
                                        </p>
                                    </div>
                                    <Button
                                        variant="secondary"
                                        onClick={() => { setIsRequested(false); setRequestEmail(''); }}
                                        className="w-full text-xs font-black tracking-widest"
                                    >
                                        Send to a Different Email
                                    </Button>
                                </div>
                            )}
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PasswordResetPage;
