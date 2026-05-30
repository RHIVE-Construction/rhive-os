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
import Button from '../components/Button';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigation } from '../contexts/NavigationContext';
import PlexusShape from '../components/PlexusShape';

interface LoginPageProps {
    onLogin: (role: UserType, password?: string, email?: string) => Promise<any>;
}

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

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const showError = (msg: string) => {
        setError(msg);
        setTimeout(() => setError(''), 4000);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) return;
        setLoading(true);
        setError('');
        const result = await onLogin(undefined as any, password, email);
        setLoading(false);
        if (result && !result.success) {
            showError(result.error || 'Login failed.');
        }
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
                                QOS Gateway
                            </h2>
                            <div className="flex items-center justify-center gap-4">
                                <div className="h-[1px] w-10 bg-gradient-to-r from-transparent to-gray-700" />
                                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.4em]">
                                    Quantum Operating System v2.5
                                </p>
                                <div className="h-[1px] w-10 bg-gradient-to-l from-transparent to-gray-700" />
                            </div>
                        </div>

                        {/* ── CREDENTIALS FORM ── */}
                        <div className="relative z-20 animate-slide-up max-w-sm mx-auto">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <FloatingInput
                                    id="login-email"
                                    type="email"
                                    label="Email Address"
                                    value={email}
                                    onChange={setEmail}
                                    icon={<EnvelopeIcon className="w-5 h-5" />}
                                    autoFocus
                                />
                                <FloatingInput
                                    id="login-password"
                                    type={showPassword ? 'text' : 'password'}
                                    label="Password"
                                    value={password}
                                    onChange={setPassword}
                                    icon={<KeyIcon className="w-5 h-5" />}
                                    rightEl={
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="text-gray-600 hover:text-rhive-pink transition-colors"
                                        >
                                            {showPassword
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
                                        onClick={() => setActivePageId('P-00')}
                                        variant="secondary"
                                        className="flex-none px-5 h-12 bg-gray-900 border border-gray-800 text-gray-500 hover:bg-gray-800 hover:text-white uppercase tracking-widest text-[10px] font-black"
                                    >
                                        <XIcon className="w-4 h-4 mr-1" />
                                        Back
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={!email || !password || loading}
                                        className="flex-1 h-12 bg-rhive-pink/20 hover:bg-rhive-pink/40 border border-rhive-pink/40 hover:border-rhive-pink/60 backdrop-blur-md text-white uppercase tracking-widest text-[10px] font-black shadow-[0_0_30px_rgba(236,2,139,0.3)] disabled:opacity-40"
                                    >
                                        {loading ? 'Verifying…' : 'Sign In'}
                                        <ArrowRightIcon className="w-4 h-4 ml-2" />
                                    </Button>
                                </div>
                            </form>
                            
                            <QuickBypassPanel onLogin={onLogin} />
                        </div>

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
