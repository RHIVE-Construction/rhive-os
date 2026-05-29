
import React, { useState } from 'react';
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
import { Button } from '../components/ui/button';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigation } from '../contexts/NavigationContext';

interface LoginPageProps {
    onLogin: (role: UserType, password?: string, email?: string) => Promise<any>;
}

// ─── Clipped-corner portal card ──────────────────────────────────────────────
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
                'relative group cursor-pointer transition-all duration-400 flex flex-col items-center justify-center p-5 gap-3 isolate hover:scale-[1.03]',
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
                <span className="font-extrabold text-[9px] uppercase tracking-[0.3em] font-sans">{label}</span>
            </div>
        </div>
    );
};

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
            className="peer w-full bg-black/60 border border-gray-800 focus:border-rhive-pink outline-none text-white pl-12 pr-12 pt-7 pb-2 rounded-xl text-sm font-mono tracking-wide transition-all placeholder-transparent"
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
);

// ─── Main Login Page ──────────────────────────────────────────────────────────
const QuickBypassPanel: React.FC<{ onLogin: (role: any, password?: string, email?: string) => Promise<any> }> = ({ onLogin }) => {
    const roles = ['Admin', 'Employee', 'Customer', 'Contractor', 'Supplier'] as const;
    const colors: Record<string, string> = {
        Admin: 'hover:border-blue-500 hover:text-blue-400 bg-blue-950/20 border-blue-900/40',
        Employee: 'hover:border-green-500 hover:text-green-400 bg-green-950/20 border-green-900/40',
        Customer: 'hover:border-purple-500 hover:text-purple-400 bg-purple-950/20 border-purple-900/40',
        Contractor: 'hover:border-yellow-500 hover:text-yellow-400 bg-yellow-950/20 border-yellow-900/40',
        Supplier: 'hover:border-pink-500 hover:text-pink-400 bg-pink-950/20 border-pink-900/40',
    };

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
                        className={cn(
                            "px-3 py-1.5 border rounded-lg text-[9px] font-extrabold uppercase tracking-widest transition-all hover:scale-105 active:scale-95 text-gray-400",
                            colors[role]
                        )}
                    >
                        {role}
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

    // View state: 'gateway' | 'portal-login' | 'admin-login'
    const [view, setView] = useState<'gateway' | 'portal-login' | 'admin-login'>('gateway');

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

    const resetToGateway = () => {
        setView('gateway');
        setSelectedPortalRole(null);
        setPortalEmail('');
        setPortalPassword('');
        setInternalEmail('');
        setInternalPassword('');
        setInternalRole('Admin');
        setError('');
    };

    const publicPortals = [
        { role: 'Customer' as UserType, icon: <UserIcon className="w-full h-full" />, label: 'Customer' },
        { role: 'Contractor' as UserType, icon: <BuildingStorefrontIcon className="w-full h-full" />, label: 'Contractor' },
        { role: 'Supplier' as UserType, icon: <TruckIcon className="w-full h-full" />, label: 'Supplier' },
    ];

    return (
        <div className="flex items-center justify-center h-full p-4 font-sans selection:bg-rhive-pink/40">
            <div className="w-full max-w-xl flex flex-col items-center">
                <RhiveLogo className="h-20 w-auto mb-12 animate-fade-in" />

                <div className="w-full relative p-10 animate-fade-in isolate">
                    {/* Background Plate */}
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-md z-[-2]"
                        style={{ clipPath: `polygon(${mainC}px 0, calc(100% - ${mainC}px) 0, 100% ${mainC}px, 100% calc(100% - ${mainC}px), calc(100% - ${mainC}px) 100%, ${mainC}px 100%, 0 calc(100% - ${mainC}px), 0 ${mainC}px)` }}
                    />

                    <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible">
                        <g stroke={isDark ? "#4b5563" : "#D1D5DB"} strokeWidth="1" className="opacity-50 transition-colors">
                            <line x1={`${mainC}px`} y1="0.5px" x2={`calc(100% - ${mainC}px)`} y2="0.5px" />
                            <line x1={`calc(100% - ${mainC}px)`} y1="0.5px" x2="calc(100% - 0.5px)" y2={`${mainC}px`} />
                            <line x1="calc(100% - 0.5px)" y1={`${mainC}px`} x2="calc(100% - 0.5px)" y2={`calc(100% - ${mainC}px)`} />
                            <line x1="calc(100% - 0.5px)" y1={`calc(100% - ${mainC}px)`} x2={`calc(100% - ${mainC}px)`} y2="calc(100% - 0.5px)" />
                            <line x1={`calc(100% - ${mainC}px)`} y1="calc(100% - 0.5px)" x2={`${mainC}px`} y2="calc(100% - 0.5px)" />
                            <line x1={`${mainC}px`} y1="calc(100% - 0.5px)" x2="0.5px" y2={`calc(100% - ${mainC}px)`} />
                            <line x1="0.5px" y1={`calc(100% - ${mainC}px)`} x2="0.5px" y2={`${mainC}px`} />
                            <line x1="0.5px" y1={`${mainC}px`} x2={`${mainC}px`} y2="0.5px" />
                        </g>
                        <line x1="0" y1={mainC} x2={mainC} y2="0" stroke="#ec028b" strokeWidth="3" className="drop-shadow-[0_0_8px_#ec028b]" />
                        <line x1="calc(100% - 0.5px)" y1={`calc(100% - ${mainC}px)`} x2={`calc(100% - ${mainC}px)`} y2="calc(100% - 0.5px)" stroke="#ec028b" strokeWidth="3" className="drop-shadow-[0_0_8px_#ec028b]" />
                    </svg>

                    {/* ── TITLE ── */}
                    <div className="text-center mb-8 relative z-20">
                        <h2 className="text-3xl font-black text-white tracking-[0.2em] uppercase mb-2">
                            {view === 'gateway' && 'QOS Gateway'}
                            {view === 'portal-login' && 'Portal Login'}
                            {view === 'admin-login' && 'Internal Access'}
                        </h2>
                        <div className="flex items-center justify-center gap-4">
                            <div className="h-[1px] w-10 bg-gradient-to-r from-transparent to-gray-700" />
                            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.4em]">
                                {view === 'gateway' && 'Quantum Operating System v2.5'}
                                {view === 'portal-login' && 'Secure Client Authentication'}
                                {view === 'admin-login' && 'Admin Verification Protocol'}
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
                                className="w-full py-4 px-6 bg-gray-900/40 border border-gray-800 text-gray-500 text-[10px] font-bold uppercase tracking-[0.5em] hover:border-rhive-pink/50 hover:text-white transition-all rounded-full flex items-center justify-center gap-3 group"
                            >
                                <LockIcon className="w-4 h-4 group-hover:text-rhive-pink transition-colors" />
                                Internal Admin Access
                            </button>

                            <Button
                                onClick={() => onLogin('Public')}
                                className="w-full h-12 text-sm font-black tracking-[0.3em] transition-all duration-500 uppercase border-rhive-pink/30 bg-black/30 text-gray-500 hover:bg-rhive-pink/10 hover:text-rhive-pink hover:border-rhive-pink/50"
                            >
                                <span>Continue as Guest</span>
                                <ArrowRightIcon className="w-4 h-4 ml-2" />
                            </Button>

                            <QuickBypassPanel onLogin={onLogin} />
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
                                <div className="flex justify-end pr-2 -mt-2">
                                    <button
                                        type="button"
                                        onClick={() => setActivePageId('P-07')}
                                        className="text-[10px] font-black uppercase tracking-wider text-gray-500 hover:text-rhive-pink transition-colors bg-transparent border-none outline-none"
                                    >
                                        Forgot password?
                                    </button>
                                </div>

                                {error && (
                                    <p className="text-rhive-pink text-[10px] font-bold uppercase tracking-widest text-center animate-pulse">
                                        {error}
                                    </p>
                                )}

                                <div className="flex gap-3 pt-1">
                                    <Button
                                        type="button"
                                        onClick={resetToGateway}
                                        className="flex-none px-5 h-12 bg-gray-900 border-gray-800 text-gray-500 hover:bg-gray-800 hover:text-white rounded-xl uppercase tracking-widest text-[10px] font-black"
                                    >
                                        <XIcon className="w-4 h-4 mr-1" />
                                        Back
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={!selectedPortalRole || !portalEmail || !portalPassword || loading}
                                        className="flex-1 h-12 bg-rhive-pink hover:bg-[#ff039a] text-white rounded-xl uppercase tracking-widest text-[10px] font-black shadow-[0_0_30px_rgba(236,2,139,0.3)] disabled:opacity-40"
                                    >
                                        {loading ? 'Verifying…' : 'Sign In'}
                                        <ArrowRightIcon className="w-4 h-4 ml-2" />
                                    </Button>
                                </div>
                            </form>
                            <QuickBypassPanel onLogin={onLogin} />
                        </div>
                    )}

                    {/* ════════════════════════════════════════════════════════
                        VIEW: ADMIN/EMPLOYEE LOGIN (email + password)
                    ════════════════════════════════════════════════════════ */}
                    {view === 'admin-login' && (
                        <div className="relative z-20 animate-slide-up max-w-sm mx-auto">
                            {/* Role toggle */}
                            <div className="flex gap-3 mb-6 p-1 bg-gray-900/50 rounded-xl border border-gray-800">
                                {(['Admin', 'Employee'] as const).map(r => (
                                    <button
                                        key={r}
                                        type="button"
                                        onClick={() => setInternalRole(r)}
                                        className={cn(
                                            "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                                            internalRole === r
                                                ? r === 'Admin'
                                                    ? "bg-blue-500/20 border border-blue-500/50 text-blue-400"
                                                    : "bg-green-500/20 border border-green-500/50 text-green-400"
                                                : "text-gray-600 hover:text-gray-400"
                                        )}
                                    >
                                        {r === 'Admin' ? <ShieldCheckIcon className="w-3.5 h-3.5" /> : <BriefcaseIcon className="w-3.5 h-3.5" />}
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
                                            {showInternalPwd
                                                ? <EyeSlashIcon className="w-4 h-4" />
                                                : <EyeIcon className="w-4 h-4" />
                                            }
                                        </button>
                                    }
                                />
                                <div className="flex justify-end pr-2 -mt-2">
                                    <button
                                        type="button"
                                        onClick={() => setActivePageId('P-07')}
                                        className="text-[10px] font-black uppercase tracking-wider text-gray-500 hover:text-rhive-pink transition-colors bg-transparent border-none outline-none"
                                    >
                                        Forgot password?
                                    </button>
                                </div>

                                {error && (
                                    <p className="text-rhive-pink text-[10px] font-bold uppercase tracking-widest text-center animate-pulse">
                                        {error}
                                    </p>
                                )}

                                <div className="flex gap-3">
                                    <Button
                                        type="button"
                                        onClick={resetToGateway}
                                        className="flex-none px-5 h-12 bg-gray-900 border-gray-800 text-gray-500 hover:bg-gray-800 hover:text-white rounded-xl uppercase tracking-widest text-[10px] font-black"
                                    >
                                        <XIcon className="w-4 h-4 mr-1" />
                                        Back
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={!internalEmail || !internalPassword || loading}
                                        className="flex-1 h-12 bg-rhive-pink hover:bg-[#ff039a] text-white rounded-xl uppercase tracking-widest text-[10px] font-black shadow-[0_0_30px_rgba(236,2,139,0.3)] disabled:opacity-40"
                                    >
                                        {loading ? 'Verifying…' : 'Establish Link'}
                                        <ArrowRightIcon className="w-4 h-4 ml-2" />
                                    </Button>
                                </div>
                            </form>
                            <QuickBypassPanel onLogin={onLogin} />
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
    );
};

export default LoginPage;
