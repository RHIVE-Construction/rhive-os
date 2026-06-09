import React, { useState, useRef } from 'react';
import {
    UserIcon,
    BriefcaseIcon,
    BuildingStorefrontIcon,
    TruckIcon,
    RhiveLogo,
    ShieldCheckIcon,
    LockIcon,
    KeyIcon,
    XIcon,
    ArrowRightIcon,
    EnvelopeIcon,
    EyeIcon,
    EyeSlashIcon,
} from '../components/icons';
import { UserType } from '../types';
import { cn } from '../lib/utils';
import Button from '../components/Button';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigation } from '../contexts/NavigationContext';
import { passwordResetService } from '../lib/firebaseService';
import PlexusShape from '../components/PlexusShape';

interface LoginPageProps {
    onLogin: (role: UserType, password?: string, email?: string) => Promise<any>;
}

// ─── Clipped-corner portal card ───
const PortalButton: React.FC<{
    role: string;
    icon: React.ReactNode;
    label: string;
    selected: boolean;
    onClick: () => void;
}> = ({ role, icon, label, selected, onClick }) => {
    const c = 16;
    return (
        <div
            onClick={onClick}
            className={cn(
                'relative group cursor-pointer transition-all duration-300 flex flex-col items-center justify-center p-5 gap-3 isolate hover:scale-[1.03]',
                selected && 'scale-[1.03]'
            )}
        >
            {/* BG plate */}
            <div
                className={cn(
                    'absolute inset-0 transition-all duration-500 z-[-2] backdrop-blur-md border',
                    selected
                        ? 'bg-rhive-pink/20 border-rhive-pink'
                        : 'bg-white/5 border-white/10 group-hover:bg-white/12 group-hover:border-rhive-pink/40'
                )}
                style={{
                    clipPath: `polygon(${c}px 0, calc(100% - ${c}px) 0, 100% ${c}px, 100% calc(100% - ${c}px), calc(100% - ${c}px) 100%, ${c}px 100%, 0 calc(100% - ${c}px), 0 ${c}px)`,
                }}
            />
            {/* Corner SVG */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible">
                <g
                    stroke={selected ? '#ec028b' : '#374151'}
                    strokeWidth="1.5"
                    className={cn('transition-all duration-500', selected && 'drop-shadow-[0_0_8px_#ec028b]', !selected && 'group-hover:stroke-rhive-pink group-hover:drop-shadow-[0_0_6px_#ec028b]')}
                >
                    <line x1={`${c}px`} y1="0.5px" x2={`calc(100% - ${c}px)`} y2="0.5px" />
                    <line x1={`calc(100% - ${c}px)`} y1="0.5px" x2="calc(100% - 0.5px)" y2={`${c}px`} />
                    <line x1="calc(100% - 0.5px)" y1={`${c}px`} x2="calc(100% - 0.5px)" y2={`calc(100% - ${c}px)`} />
                    <line x1="calc(100% - 0.5px)" y1={`calc(100% - ${c}px)`} x2={`calc(100% - ${c}px)`} y2="calc(100% - 0.5px)" />
                    <line x1={`calc(100% - ${c}px)`} y1="calc(100% - 0.5px)" x2={`${c}px`} y2="calc(100% - 0.5px)" />
                    <line x1={`${c}px`} y1="calc(100% - 0.5px)" x2="0.5px" y2={`calc(100% - ${c}px)`} />
                    <line x1="0.5px" y1={`calc(100% - ${c}px)`} x2="0.5px" y2={`${c}px`} />
                    <line x1="0.5px" y1={`${c}px`} x2={`${c}px`} y2="0.5px" />
                </g>
            </svg>

            <div className={cn('relative z-10 flex flex-col items-center gap-2 transition-all duration-300', selected ? 'text-white' : 'text-rhive-pink group-hover:text-white')}>
                <div className="w-9 h-9 drop-shadow-[0_0_10px_rgba(236,2,139,0.35)]">{icon}</div>
                <span className="font-extrabold text-[9px] uppercase tracking-[0.3em] font-sans">{role}</span>
            </div>
        </div>
    );
};

// ─── Floating label input with 8px Chamfer border ───
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
    <div 
        className="relative group p-[1px] bg-gray-800 focus-within:bg-rhive-pink transition-colors duration-200"
        style={{
            clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
            WebkitClipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)'
        }}
    >
        <div 
            className="relative bg-black/90 flex items-center w-full"
            style={{
                clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
                WebkitClipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)'
            }}
        >
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-rhive-pink transition-colors z-10">
                {icon}
            </div>
            <input
                id={id}
                type={type}
                placeholder=" "
                value={value}
                onChange={(e) => onChange(e.target.value)}
                autoFocus={autoFocus}
                className="peer w-full bg-transparent outline-none text-white pl-12 pr-12 pt-7 pb-2 text-sm font-mono tracking-wide placeholder-transparent border-none focus:ring-0"
            />
            <label
                htmlFor={id}
                className="absolute left-12 top-2.5 text-[10px] font-bold uppercase tracking-widest text-gray-600 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-xs peer-focus:top-2.5 peer-focus:-translate-y-0 peer-focus:text-[10px] peer-focus:text-rhive-pink transition-all pointer-events-none"
            >
                {label}
            </label>
            {rightEl && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10">
                    {rightEl}
                </div>
            )}
        </div>
    </div>
);

// ─── Quick Bypass Panel with 6px Chamfer border ───
const QuickBypassPanel: React.FC<{ onLogin: (role: any, password?: string, email?: string) => Promise<any> }> = ({ onLogin }) => {
    const roles = ['Admin', 'Employee', 'Customer', 'Contractor', 'Supplier'] as const;

    return (
        <div className="mt-8 pt-6 border-t border-white/5 w-full">
            <p className="text-center text-[9px] font-black uppercase tracking-[0.35em] text-gray-500 mb-4">
                DEVELOPER BYPASS (QUICK SIGN IN)
            </p>
            <div className="flex flex-wrap justify-center gap-2">
                {roles.map(role => (
                    <button
                        key={role}
                        type="button"
                        onClick={() => onLogin(role, 'bypass')}
                        className="relative p-[1px] bg-white/10 hover:bg-rhive-pink/50 transition-all hover:scale-105 active:scale-95 group"
                        style={{
                            clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)',
                            WebkitClipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)'
                        }}
                    >
                        <div 
                            className="px-3 py-1.5 bg-black/60 group-hover:bg-black/90 text-gray-400 group-hover:text-white text-[9px] font-extrabold uppercase tracking-widest transition-colors duration-200"
                            style={{
                                clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)',
                                WebkitClipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)'
                            }}
                        >
                            {role}
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
    const { theme } = useTheme();
    const { t } = useLanguage();
    const { setActivePageId } = useNavigation();
    const isDark = theme === 'dark';
    const mainC = 40;

    // View state: 'gateway' | 'portal-login' | 'admin-login' | 'forgot-password'
    const [view, setView] = useState<'gateway' | 'portal-login' | 'admin-login' | 'forgot-password'>('gateway');

    // Portal (Customer / Contractor / Supplier)
    const [selectedPortalRole, setSelectedPortalRole] = useState<UserType | null>(null);
    const [portalEmail, setPortalEmail] = useState('');
    const [portalPassword, setPortalPassword] = useState('');
    const [showPortalPwd, setShowPortalPwd] = useState(false);

    // Admin / Employee (Internal)
    const [internalRole, setInternalRole] = useState<'Admin' | 'Employee'>('Admin');
    const [internalEmail, setInternalEmail] = useState('');
    const [internalPassword, setInternalPassword] = useState('');
    const [showInternalPwd, setShowInternalPwd] = useState(false);

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Forgot Password state
    const [forgotEmail, setForgotEmail] = useState('');
    const [forgotSent, setForgotSent] = useState(false);
    const [forgotOrigin, setForgotOrigin] = useState<'portal-login' | 'admin-login'>('portal-login');
    
    // Rate limiting: max 3 attempts per 10 minutes
    const forgotAttempts = useRef<number[]>([]);
    const RATE_LIMIT = 3;
    const RATE_WINDOW_MS = 10 * 60 * 1000;

    const showError = (msg: string) => {
        setError(msg);
        setTimeout(() => setError(''), 4000);
    };

    const handlePortalSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedPortalRole || !portalEmail || !portalPassword) return;
        setLoading(true);
        const result = await onLogin(selectedPortalRole, portalPassword, portalEmail);
        setLoading(false);
        if (result && !result.success) showError(result.error || 'Login failed.');
    };

    const handleInternalSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!internalEmail || !internalPassword) return;
        setLoading(true);
        const result = await onLogin(internalRole, internalPassword, internalEmail);
        setLoading(false);
        if (result && !result.success) showError(result.error || 'Invalid credentials.');
    };

    const handleForgotSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!forgotEmail.trim()) return;

        // Rate limit check
        const now = Date.now();
        forgotAttempts.current = forgotAttempts.current.filter(t => now - t < RATE_WINDOW_MS);
        if (forgotAttempts.current.length >= RATE_LIMIT) {
            showError('Too many requests. Please wait 10 minutes before trying again.');
            return;
        }
        forgotAttempts.current.push(now);

        setLoading(true);
        const result = await passwordResetService.requestReset(forgotEmail);
        setLoading(false);

        if (!result.success) {
            showError(result.error || 'Unable to send reset email. Please try again.');
        } else {
            setForgotSent(true);
        }
    };

    const resetToGateway = () => {
        setView('gateway');
        setSelectedPortalRole(null);
        setPortalEmail('');
        setPortalPassword('');
        setInternalEmail('');
        setInternalPassword('');
        setInternalRole('Admin');
        setError('');
        setForgotEmail('');
        setForgotSent(false);
        setForgotOrigin('portal-login');
    };

    const goToForgot = (origin: 'portal-login' | 'admin-login', prefillEmail: string) => {
        setForgotOrigin(origin);
        setForgotEmail(prefillEmail);
        setForgotSent(false);
        setError('');
        setView('forgot-password');
    };

    const chamferSize = "24px";
    const clipPathValue = `polygon(
        ${ chamferSize } 0,
        100% 0,
        100% calc(100% - ${ chamferSize }),
        calc(100% - ${ chamferSize }) 100%,
        0 100%,
        0 ${ chamferSize }
    )`;

    const publicPortals = [
        { role: 'Customer' as UserType, icon: <UserIcon className="w-full h-full" />, label: 'Customer' },
        { role: 'Contractor' as UserType, icon: <BuildingStorefrontIcon className="w-full h-full" />, label: 'Contractor' },
        { role: 'Supplier' as UserType, icon: <TruckIcon className="w-full h-full" />, label: 'Supplier' },
    ];

    return (
        <div className="flex items-center justify-center h-full p-4 font-sans selection:bg-rhive-pink/40">
            <div className="w-full max-w-xl flex flex-col items-center">
                <RhiveLogo className="h-20 w-auto mb-12 animate-fade-in" />

                {/* --- Circuitry Widget Frame Card Container (Following Branding) --- */}
                <div 
                    className="relative w-full flex flex-col group isolate p-10 animate-fade-in text-white"
                >
                    {/* 1. Background Layers (Clipped) */}
                    <div
                        className="absolute inset-0 bg-gray-800 transition-colors duration-300"
                        style={{ clipPath: clipPathValue, WebkitClipPath: clipPathValue }}
                    />
                    <div
                        className="absolute inset-[1px] bg-black z-0 overflow-hidden"
                        style={{ clipPath: clipPathValue, WebkitClipPath: clipPathValue }}
                    >
                        {/* Universal Dark Pink Plexus Background */}
                        <div className="absolute inset-0 z-0 pointer-events-none">
                            <PlexusShape
                                backgroundColor="#000000"
                                dotColor="#ec028b"
                                lineColor="236, 2, 139"
                                density={30}
                                className="h-full w-full relative z-0"
                            />
                            <div className="absolute inset-0 bg-black/75 z-10" />
                        </div>
                    </div>

                    {/* 2. BORDER CONSTRUCTION (Manual Placement for Perfect Control) */}
                    {/* Left Border (Gray) */}
                    <div className="absolute left-0 top-6 bottom-0 w-[1px] bg-gray-700 z-10" />

                    {/* Top-Left Chamfer (Gray Base) */}
                    <svg className="absolute top-0 left-0 w-6 h-6 z-10 overflow-visible pointer-events-none">
                        <line x1="0" y1="24" x2="24" y2="0" stroke="#374151" strokeWidth="1" strokeLinecap="square" />
                    </svg>

                    {/* TL Chamfer Accent (Pink Segment) */}
                    <svg className="absolute top-0 left-0 w-6 h-6 z-20 overflow-visible pointer-events-none">
                        <line x1="8" y1="16" x2="16" y2="8" stroke="#ec028b" strokeWidth="2" strokeLinecap="square" className="drop-shadow-[0_0_3px_rgba(236,2,139,0.8)]" />
                    </svg>

                    {/* Right Border (Gray) */}
                    <div className="absolute right-0 top-0 bottom-6 w-[1px] bg-gray-700 z-10" />

                    {/* Top Border (Gray) - Starts after chamfer */}
                    <div className="absolute left-6 right-0 top-0 h-[1px] bg-gray-700 z-10" />

                    {/* Bottom Border (Gray) - Ends before chamfer */}
                    <div className="absolute left-0 right-6 bottom-0 h-[1px] bg-gray-700 z-10" />

                    {/* Bottom-Right Chamfer (Gray Base) */}
                    <svg className="absolute bottom-0 right-0 w-6 h-6 z-10 overflow-visible pointer-events-none">
                        <line x1="0" y1="24" x2="24" y2="0" stroke="#374151" strokeWidth="1" strokeLinecap="square" />
                    </svg>

                    {/* BR Chamfer Accent (Pink Segment) */}
                    <svg className="absolute bottom-0 right-0 w-6 h-6 z-20 overflow-visible pointer-events-none">
                        <line x1="8" y1="16" x2="16" y2="8" stroke="#ec028b" strokeWidth="2" strokeLinecap="square" className="drop-shadow-[0_0_3px_rgba(236,2,139,0.8)]" />
                    </svg>

                    {/* 3. Card Content */}
                    <div className="relative z-20">
                        {/* ── TITLE ── */}
                        <div className="text-center mb-8 relative z-20">
                            <h2 className="text-3xl font-black text-white tracking-[0.2em] uppercase mb-2">
                                {view === 'gateway' && 'QOS Gateway'}
                                {view === 'portal-login' && 'Portal Login'}
                                {view === 'admin-login' && 'Internal Access'}
                                {view === 'forgot-password' && 'Account Recovery'}
                            </h2>
                            <div className="flex items-center justify-center gap-4">
                                <div className="h-[1px] w-10 bg-gradient-to-r from-transparent to-gray-700" />
                                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.4em]">
                                    {view === 'gateway' && 'Quantum Operating System v2.5'}
                                    {view === 'portal-login' && 'Secure Client Authentication'}
                                    {view === 'admin-login' && 'Admin Verification Protocol'}
                                    {view === 'forgot-password' && 'Secure Reset Protocol'}
                                </p>
                                <div className="h-[1px] w-10 bg-gradient-to-l from-transparent to-gray-700" />
                            </div>
                        </div>

                        {/* ════════════════════════════════════════════════════════
                            VIEW: GATEWAY (choose a portal)
                        ════════════════════════════════════════════════════════ */}
                        {view === 'gateway' && (
                            <div className="space-y-6 relative z-20 animate-fade-in">
                                <p className="text-center text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500 mb-2">Select Your Portal</p>
                                <div className="grid grid-cols-3 gap-4">
                                    {publicPortals.map((p) => (
                                        <PortalButton
                                            key={p.role}
                                            role={p.role}
                                            icon={p.icon}
                                            label={p.label}
                                            selected={false}
                                            onClick={() => {
                                                setSelectedPortalRole(p.role);
                                                setView('portal-login');
                                            }}
                                        />
                                    ))}
                                </div>

                                <div className="flex items-center gap-4 my-2">
                                    <div className="flex-1 h-[1px] bg-gray-800" />
                                    <span className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">or</span>
                                    <div className="flex-1 h-[1px] bg-gray-800" />
                                </div>

                                <button
                                    onClick={() => setView('admin-login')}
                                    className="w-full py-4 px-6 bg-gray-900/40 border border-gray-800 text-gray-500 text-[10px] font-bold uppercase tracking-[0.5em] hover:border-rhive-pink/50 hover:text-white transition-all rounded-[24px] flex items-center justify-center gap-3 group"
                                >
                                    <LockIcon className="w-4 h-4 group-hover:text-rhive-pink transition-colors" />
                                    Internal Admin Access
                                </button>

                                <Button
                                    onClick={() => onLogin('Public')}
                                    className="w-full h-12 text-[10px] font-black tracking-[0.3em] transition-all duration-500 uppercase border-rhive-pink/30 bg-black/30 text-gray-500 hover:bg-rhive-pink/10 hover:text-rhive-pink hover:border-rhive-pink/50 rounded-xl"
                                >
                                    <span>Continue as Guest</span>
                                    <ArrowRightIcon className="w-4 h-4 ml-2" />
                                </Button>
                            </div>
                        )}

                        {/* ════════════════════════════════════════════════════════
                            VIEW: PORTAL LOGIN (Customer / Contractor / Supplier)
                        ════════════════════════════════════════════════════════ */}
                        {view === 'portal-login' && (
                            <div className="relative z-20 animate-slide-up">
                                {/* Role switcher */}
                                <div className="grid grid-cols-3 gap-3 mb-6">
                                    {publicPortals.map((p) => (
                                        <PortalButton
                                            key={p.role}
                                            role={p.role}
                                            icon={p.icon}
                                            label={p.label}
                                            selected={selectedPortalRole === p.role}
                                            onClick={() => setSelectedPortalRole(p.role)}
                                        />
                                    ))}
                                </div>

                                <form onSubmit={handlePortalSubmit} className="space-y-4">
                                    <FloatingInput
                                        id="portal-email"
                                        type="email"
                                        label="Email Address"
                                        value={portalEmail}
                                        onChange={setPortalEmail}
                                        icon={<EnvelopeIcon className="w-5 h-5" />}
                                        autoFocus
                                    />
                                    <FloatingInput
                                        id="portal-password"
                                        type={showPortalPwd ? 'text' : 'password'}
                                        label="Password"
                                        value={portalPassword}
                                        onChange={setPortalPassword}
                                        icon={<KeyIcon className="w-5 h-5" />}
                                        rightEl={
                                            <button
                                                type="button"
                                                onClick={() => setShowPortalPwd(!showPortalPwd)}
                                                className="text-gray-600 hover:text-rhive-pink transition-colors"
                                            >
                                                {showPortalPwd
                                                    ? <EyeSlashIcon className="w-4 h-4" />
                                                    : <EyeIcon className="w-4 h-4" />
                                                }
                                            </button>
                                        }
                                    />

                                    {error && (
                                        <p className="text-rhive-pink text-[10px] font-bold uppercase tracking-widest text-center animate-pulse">
                                            {error}
                                        </p>
                                    )}

                                    <div className="flex gap-3 pt-1">
                                        <Button
                                            type="button"
                                            onClick={resetToGateway}
                                            variant="secondary"
                                            className="flex-none px-5 h-12 bg-gray-900 border-gray-800 text-gray-500 hover:bg-gray-800 hover:text-white uppercase tracking-widest text-[10px] font-black"
                                        >
                                            <XIcon className="w-4 h-4 mr-1" />
                                            Back
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={!selectedPortalRole || !portalEmail || !portalPassword || loading}
                                            className="flex-1 h-12 bg-rhive-pink/20 hover:bg-rhive-pink/40 border border-rhive-pink/40 hover:border-rhive-pink/60 backdrop-blur-md text-white uppercase tracking-widest text-[10px] font-black shadow-[0_0_30px_rgba(236,2,139,0.3)] disabled:opacity-40"
                                        >
                                            {loading ? 'Verifying…' : 'Sign In'}
                                            <ArrowRightIcon className="w-4 h-4 ml-2" />
                                        </Button>
                                    </div>

                                    {/* Forgot password link */}
                                    <div className="text-center pt-1">
                                        <button
                                            type="button"
                                            onClick={() => goToForgot('portal-login', portalEmail)}
                                            className="text-[10px] font-bold uppercase tracking-widest text-gray-600 hover:text-rhive-pink transition-colors"
                                        >
                                            Forgot Password?
                                        </button>
                                    </div>
                                </form>

                                {(window.location.hostname === 'localhost' || 
                                  window.location.search.includes('bypass') || 
                                  window.location.search.includes('dev')) && (
                                    <QuickBypassPanel onLogin={onLogin} />
                                )}
                            </div>
                        )}

                        {/* ════════════════════════════════════════════════════════
                            VIEW: FORGOT PASSWORD
                        ════════════════════════════════════════════════════════ */}
                        {view === 'forgot-password' && (
                            <div className="relative z-20 animate-fade-in max-w-sm mx-auto">
                                {!forgotSent ? (
                                    <>
                                        <div className="flex items-center justify-center gap-3 mb-6 p-4 border border-rhive-pink/20 bg-rhive-pink/5">
                                            <p className="text-gray-400 text-[10px] uppercase font-bold tracking-widest leading-relaxed">
                                                Enter your registered email. A secure, time-limited reset link will be dispatched.
                                            </p>
                                        </div>

                                        <form onSubmit={handleForgotSubmit} className="space-y-4">
                                            <FloatingInput
                                                id="forgot-email"
                                                type="email"
                                                label="Registered Email Address"
                                                value={forgotEmail}
                                                onChange={setForgotEmail}
                                                icon={<EnvelopeIcon className="w-5 h-5" />}
                                                autoFocus
                                            />

                                            {error && (
                                                <p className="text-rhive-pink text-[10px] font-bold uppercase tracking-widest text-center animate-pulse">
                                                    {error}
                                                </p>
                                            )}

                                            <div className="flex gap-3 pt-1">
                                                <Button
                                                    type="button"
                                                    onClick={() => { setView(forgotOrigin); setError(''); }}
                                                    variant="secondary"
                                                    className="flex-none px-5 h-12 bg-gray-900 border-gray-800 text-gray-500 hover:bg-gray-800 hover:text-white uppercase tracking-widest text-[10px] font-black"
                                                >
                                                    <XIcon className="w-4 h-4 mr-1" />
                                                    Back
                                                </Button>
                                                <Button
                                                    type="submit"
                                                    disabled={!forgotEmail.trim() || loading}
                                                    className="flex-1 h-12 bg-rhive-pink/20 hover:bg-rhive-pink/40 border border-rhive-pink/40 hover:border-rhive-pink/60 backdrop-blur-md text-white uppercase tracking-widest text-[10px] font-black shadow-[0_0_30px_rgba(236,2,139,0.3)] disabled:opacity-40"
                                                >
                                                    {loading ? 'Dispatching…' : 'Send Reset Link'}
                                                    <ArrowRightIcon className="w-4 h-4 ml-2" />
                                                </Button>
                                            </div>
                                        </form>
                                    </>
                                ) : (
                                    <div className="text-center py-4 animate-fade-in space-y-5">
                                        <p className="text-white font-black uppercase tracking-widest text-sm mb-2">Transmission Sent</p>
                                        <div className="flex gap-3">
                                            <Button
                                                type="button"
                                                onClick={() => { setView(forgotOrigin); setForgotSent(false); setForgotEmail(''); }}
                                                className="flex-1 h-11 bg-rhive-pink/10 border border-rhive-pink/30 text-rhive-pink hover:bg-rhive-pink/20 uppercase tracking-widest text-[10px] font-black"
                                            >
                                                Back to Login
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ════════════════════════════════════════════════════════
                            VIEW: INTERNAL LOGIN (email + password, Admin or Employee)
                        ════════════════════════════════════════════════════════ */}
                        {view === 'admin-login' && (
                            <div className="relative z-20 animate-slide-up max-w-sm mx-auto">
                                {/* Badge */}
                                <div className="flex items-center justify-center gap-3 mb-5 p-4 border border-rhive-pink/30 bg-rhive-pink/10"
                                     style={{ clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)' }}
                                >
                                    <ShieldCheckIcon className="w-8 h-8 text-rhive-pink" />
                                    <div>
                                        <p className="text-white text-xs font-black uppercase tracking-widest">Internal Access</p>
                                        <p className="text-gray-400 text-[10px] uppercase tracking-widest">Authorized Personnel Only</p>
                                    </div>
                                </div>

                                {/* Role toggle */}
                                <div className="grid grid-cols-2 gap-2 mb-5">
                                    {(['Admin', 'Employee'] as const).map(r => (
                                        <button
                                            key={r}
                                            type="button"
                                            onClick={() => setInternalRole(r)}
                                            className={cn(
                                                'py-2.5 px-4 border text-[10px] font-black uppercase tracking-widest transition-all',
                                                internalRole === r
                                                    ? 'bg-rhive-pink/20 border-rhive-pink text-rhive-pink'
                                                    : 'bg-black/40 border-gray-800 text-gray-500 hover:border-gray-600 hover:text-gray-300'
                                            )}
                                            style={{ clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)' }}
                                        >
                                            {r}
                                        </button>
                                    ))}
                                </div>

                                <form onSubmit={handleInternalSubmit} className="space-y-4">
                                    <FloatingInput
                                        id="internal-email"
                                        type="email"
                                        label="Email Address"
                                        value={internalEmail}
                                        onChange={setInternalEmail}
                                        icon={<EnvelopeIcon className="w-5 h-5" />}
                                        autoFocus
                                    />
                                    <FloatingInput
                                        id="internal-password"
                                        type={showInternalPwd ? 'text' : 'password'}
                                        label="Password"
                                        value={internalPassword}
                                        onChange={setInternalPassword}
                                        icon={<KeyIcon className="w-5 h-5" />}
                                        rightEl={
                                            <button
                                                type="button"
                                                onClick={() => setShowInternalPwd(!showInternalPwd)}
                                                className="text-gray-600 hover:text-rhive-pink transition-colors"
                                            >
                                                {showInternalPwd ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                                            </button>
                                        }
                                    />

                                    {error && (
                                        <p className="text-rhive-pink text-[10px] font-bold uppercase tracking-widest text-center animate-pulse">
                                            {error}
                                        </p>
                                    )}

                                    <div className="flex gap-3">
                                        <Button
                                            type="button"
                                            onClick={resetToGateway}
                                            variant="secondary"
                                            className="flex-none px-5 h-12 bg-gray-900 border-gray-800 text-gray-500 hover:bg-gray-800 hover:text-white uppercase tracking-widest text-[10px] font-black"
                                        >
                                            <XIcon className="w-4 h-4 mr-1" />
                                            Back
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={!internalEmail || !internalPassword || loading}
                                            className="flex-1 h-12 bg-rhive-pink hover:bg-[#ff039a] text-white uppercase tracking-widest text-[10px] font-black shadow-[0_0_30px_rgba(236,2,139,0.3)] disabled:opacity-40"
                                        >
                                            {loading ? 'Verifying…' : 'Establish Link'}
                                            <ArrowRightIcon className="w-4 h-4 ml-2" />
                                        </Button>
                                    </div>

                                    {/* Forgot password link */}
                                    <div className="text-center pt-1">
                                        <button
                                            type="button"
                                            onClick={() => goToForgot('admin-login', internalEmail)}
                                            className="text-[10px] font-bold uppercase tracking-widest text-gray-600 hover:text-rhive-pink transition-colors"
                                        >
                                            Forgot Password?
                                        </button>
                                    </div>
                                </form>

                                {(window.location.hostname === 'localhost' || 
                                  window.location.search.includes('bypass') || 
                                  window.location.search.includes('dev')) && (
                                    <QuickBypassPanel onLogin={onLogin} />
                                )}
                            </div>
                        )}

                        <div className="mt-10 text-center relative z-20">
                            <p className="text-[9px] text-gray-600 font-bold uppercase tracking-[0.5em] opacity-50">
                                Restricted Access • RHIVE Industries © 2025
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
