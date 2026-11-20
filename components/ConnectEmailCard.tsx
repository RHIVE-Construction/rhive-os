import React, { useState, useEffect } from 'react';
import {
    UserEmailSettings,
    getUserEmailSettings,
    connectUserGoogleEmail,
    disconnectUserEmail,
    updateUserEmailSharing,
    syncConnectedUserGmail,
} from '../services/googleEmailService';
import { MailIcon, Check } from './icons';
import { cn } from '../lib/utils';

interface ConnectEmailCardProps {
    userId: string;
    userEmail?: string;
    compact?: boolean;
    onSynced?: (importedCount: number) => void;
}

export const ConnectEmailCard: React.FC<ConnectEmailCardProps> = ({
    userId,
    userEmail,
    compact = false,
    onSynced,
}) => {
    const [settings, setSettings] = useState<UserEmailSettings | null>(null);
    const [shareEmails, setShareEmails] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(true);
    const [working, setWorking] = useState<boolean>(false);
    const [syncing, setSyncing] = useState<boolean>(false);
    const [showLearnMore, setShowLearnMore] = useState<boolean>(false);
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

    useEffect(() => {
        let mounted = true;
        setLoading(true);
        getUserEmailSettings(userId).then((res) => {
            if (!mounted) return;
            setSettings(res);
            if (res) setShareEmails(res.shareEmails);
            setLoading(false);
        });
        return () => { mounted = false; };
    }, [userId]);

    const handleConnectGoogle = async () => {
        setWorking(true);
        setFeedback(null);
        try {
            const res = await connectUserGoogleEmail(userId, userEmail, shareEmails);
            if (res.success && res.settings) {
                setSettings(res.settings);
                setFeedback({
                    type: 'success',
                    message: `Connected ${res.settings.connectedEmail}. Syncing recent emails...`,
                });
                const syncRes = await syncConnectedUserGmail(userId, res.settings, res.accessToken, 15);
                if (syncRes.success) {
                    setFeedback({
                        type: 'success',
                        message: `Connected ${res.settings.connectedEmail} and synced ${syncRes.importedCount} new email(s).`,
                    });
                    onSynced?.(syncRes.importedCount);
                } else {
                    setFeedback({
                        type: 'info',
                        message: `Connected ${res.settings.connectedEmail}. (${syncRes.error || 'Enable Gmail API in Google Cloud to sync inbox.'})`,
                    });
                }
            } else {
                setFeedback({ type: 'error', message: res.error || 'Could not connect Google account.' });
            }
        } finally {
            setWorking(false);
        }
    };

    const handleSyncNow = async () => {
        if (!settings) return;
        setSyncing(true);
        setFeedback(null);
        try {
            const res = await syncConnectedUserGmail(userId, settings, undefined, 15);
            if (res.success) {
                setSettings(prev => prev ? { ...prev, lastSyncedAt: new Date().toISOString() } : prev);
                setFeedback({
                    type: 'success',
                    message: res.importedCount > 0
                        ? `Synced ${res.importedCount} new email(s) from ${settings.connectedEmail}.`
                        : `Inbox for ${settings.connectedEmail} is up to date.`,
                });
                onSynced?.(res.importedCount);
            } else {
                setFeedback({ type: 'error', message: res.error || 'Sync failed.' });
            }
        } finally {
            setSyncing(false);
        }
    };

    const handleDisconnect = async () => {
        setWorking(true);
        setFeedback(null);
        try {
            const res = await disconnectUserEmail(userId);
            if (res.success) {
                setSettings(null);
                setFeedback({ type: 'info', message: 'Email account disconnected.' });
            } else {
                setFeedback({ type: 'error', message: res.error || 'Failed to disconnect.' });
            }
        } finally {
            setWorking(false);
        }
    };

    const handleToggleShare = async () => {
        const nextVal = !shareEmails;
        setShareEmails(nextVal);
        if (settings) {
            const res = await updateUserEmailSharing(userId, nextVal);
            if (res.success) {
                setSettings(prev => prev ? { ...prev, shareEmails: nextVal } : prev);
                setFeedback({
                    type: 'info',
                    message: nextVal
                        ? 'Your synced emails are now shared with the RHIVE organization inbox.'
                        : 'Your synced emails are now private (only visible to you).',
                });
            }
        }
    };

    return (
        <div className={cn(
            "bg-black/70 border border-gray-800 rounded-xl",
            compact ? "p-4 space-y-4" : "p-6 space-y-5"
        )}>
            {/* Section Header */}
            <div className="flex items-center gap-3 pb-3 border-b border-gray-800">
                <div className="w-8 h-8 rounded-lg bg-rhive-pink/10 border border-rhive-pink/25 flex items-center justify-center text-rhive-pink shrink-0">
                    <MailIcon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="text-xs font-mono font-black uppercase tracking-widest text-white">
                        Connect Email
                    </h3>
                    <p className="text-[11px] font-mono text-gray-400">
                        Per-user Google Workspace 2-way email sync &amp; sharing preferences
                    </p>
                </div>
                {settings && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-green-500/10 text-green-400 border border-green-500/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                        Connected
                    </span>
                )}
            </div>

            {loading ? (
                <div className="py-4 text-xs font-mono text-gray-500">Loading email connection settings...</div>
            ) : (
                <div className="space-y-4">
                    {/* Connection Controls */}
                    {settings ? (
                        <div className="p-3.5 bg-gray-950/90 border border-gray-800 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                    <Check className="w-4 h-4 text-green-400 shrink-0" />
                                    <span className="text-sm font-bold text-white truncate">
                                        {settings.connectedEmail}
                                    </span>
                                </div>
                                <p className="text-[11px] font-mono text-gray-500 mt-0.5">
                                    Google Workspace • Connected {new Date(settings.connectedAt).toLocaleDateString()}
                                    {settings.lastSyncedAt && ` • Last synced ${new Date(settings.lastSyncedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                                </p>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                                <button
                                    type="button"
                                    disabled={syncing || working}
                                    onClick={handleSyncNow}
                                    className="px-3 py-1.5 rounded-lg bg-rhive-pink/15 border border-rhive-pink/40 text-rhive-pink hover:bg-rhive-pink hover:text-white text-xs font-mono font-bold transition-all disabled:opacity-50"
                                >
                                    {syncing ? 'Syncing...' : 'Sync Now'}
                                </button>
                                <button
                                    type="button"
                                    disabled={working}
                                    onClick={handleDisconnect}
                                    className="px-3 py-1.5 rounded-lg bg-gray-900 border border-gray-700 text-gray-300 hover:text-white hover:border-red-500/50 text-xs font-mono font-bold transition-all disabled:opacity-50"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-wrap items-center gap-3">
                            {/* Official-style Sign in with Google button */}
                            <button
                                type="button"
                                disabled={working}
                                onClick={handleConnectGoogle}
                                className="inline-flex items-center gap-3 bg-[#4285F4] hover:bg-[#3367D6] text-white font-sans font-bold text-sm pr-4 pl-1 py-1 rounded shadow-md transition-all disabled:opacity-60 cursor-pointer"
                            >
                                <span className="bg-white rounded-sm p-1.5 flex items-center justify-center">
                                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                                        <path fill="#EA4335" d="M12 5.04c1.94 0 3.51.68 4.75 1.81l3.51-3.51C18.14 1.35 15.32 0 12 0 7.31 0 3.25 2.69 1.28 6.6l4.08 3.17C6.33 6.95 8.94 5.04 12 5.04z"/>
                                        <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58l3.7 2.87c2.16-2 3.72-4.94 3.72-8.69z"/>
                                        <path fill="#FBBC05" d="M5.36 14.23A7.12 7.12 0 0 1 4.98 12c0-.78.14-1.54.38-2.23L1.28 6.6A11.98 11.98 0 0 0 0 12c0 1.94.46 3.77 1.28 5.4l4.08-3.17z"/>
                                        <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.7-2.87c-1.08.72-2.45 1.16-4.23 1.16-3.06 0-5.67-1.91-6.64-4.61l-4.08 3.17C3.25 21.31 7.31 24 12 24z"/>
                                    </svg>
                                </span>
                                <span>{working ? 'Connecting...' : 'Sign in with Google'}</span>
                            </button>

                            <span className="text-xs font-mono text-gray-500">or</span>

                            <button
                                type="button"
                                onClick={() => setFeedback({
                                    type: 'info',
                                    message: 'Microsoft 365 OAuth is available on request—RHIVE Construction uses Google Workspace, so Sign in with Google is recommended.',
                                })}
                                className="text-xs font-mono text-blue-400 hover:text-blue-300 underline cursor-pointer"
                            >
                                Microsoft 365
                            </button>
                        </div>
                    )}

                    {/* Description */}
                    <p className="text-xs font-mono text-gray-400 leading-relaxed">
                        We will use your email account to detect leads automatically, let you send, receive and manage email directly in RHIVE OS, sync email history with your leads, and track customer conversations.
                    </p>

                    {/* Share your emails — RHIVE Quantum Switch (NO HTML CHECKBOXES) */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-gray-800/80">
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                role="switch"
                                aria-checked={shareEmails}
                                onClick={handleToggleShare}
                                className={cn(
                                    "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                                    shareEmails ? "bg-rhive-pink shadow-[0_0_8px_rgba(236,2,139,0.5)]" : "bg-gray-800"
                                )}
                            >
                                <span
                                    className={cn(
                                        "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                                        shareEmails ? "translate-x-4" : "translate-x-0"
                                    )}
                                />
                            </button>
                            <span className="text-xs font-mono font-bold text-white">
                                Share your emails
                            </span>
                            <button
                                type="button"
                                onClick={() => setShowLearnMore(prev => !prev)}
                                className="px-2 py-0.5 rounded-full text-[10px] font-mono text-blue-400 border border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 transition-colors"
                            >
                                ⓘ Learn more
                            </button>
                        </div>
                        <span className="text-[10px] font-mono text-gray-500">
                            {shareEmails ? 'Visible to RHIVE team' : 'Private to your account'}
                        </span>
                    </div>

                    {showLearnMore && (
                        <div className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/20 text-[11px] font-mono text-gray-300 leading-relaxed">
                            When <strong className="text-white">Share your emails</strong> is turned ON, emails synced from your connected account appear in the shared RHIVE Communications Inbox so teammates can collaborate on leads and active jobs. Turn it OFF to keep your synced emails visible only to you.
                        </div>
                    )}

                    {/* Status Feedback */}
                    {feedback && (
                        <div className={cn(
                            "p-2.5 rounded-lg border text-xs font-mono",
                            feedback.type === 'success' && "bg-green-500/10 border-green-500/30 text-green-300",
                            feedback.type === 'error' && "bg-red-500/10 border-red-500/30 text-red-300",
                            feedback.type === 'info' && "bg-blue-500/10 border-blue-500/30 text-blue-300"
                        )}>
                            {feedback.message}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ConnectEmailCard;
