import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage, Locale } from '../contexts/LanguageContext';
import { cn } from '../lib/utils';
import { RhiveLogo, SunIcon2 as SunIcon, MoonIcon2 as MoonIcon, GlobeAlt as Globe, MagnifyingGlassIcon } from './icons';
import WeatherForecastStrip from './WeatherForecastStrip';
import { useMockDB } from '../contexts/MockDatabaseContext';
import { useNavigation } from '../contexts/NavigationContext';
import { User } from 'lucide-react';

export const GlobalHeader: React.FC = () => {
    const { theme, setTheme } = useTheme();
    const { locale, setLocale, t } = useLanguage();
    const { currentUser, login, logout } = useMockDB();
    const { activePageId, setActivePageId } = useNavigation();
    const isDark = theme === 'dark';
    
    const [isProfileOpen, setIsProfileOpen] = React.useState(false);
    
    const roles = ['Admin', 'Employee', 'Customer', 'Contractor', 'Supplier'] as const;

    const handleRoleSwitch = async (role: string) => {
        setIsProfileOpen(false);
        const res = await login(role, 'bypass');
        if (res && res.success) {
            switch (role) {
                case 'Employee': setActivePageId('E-01'); break;
                case 'Customer': setActivePageId('C-01'); break;
                case 'Contractor': setActivePageId('CO-01'); break;
                case 'Supplier': setActivePageId('S-01'); break;
                case 'Admin': setActivePageId('A-01'); break;
                case 'Super Admin': setActivePageId('A-01'); break;
            }
        }
    };

    const languages: { code: Locale; label: string }[] = [
        { code: 'en', label: 'EN' },
        { code: 'es', label: 'ES' },
        { code: 'fr', label: 'FR' },
        { code: 'de', label: 'DE' },
    ];

    return (
        <header className={cn(
            "fixed top-0 left-0 w-full h-12 backdrop-blur-xl border-b z-[150] flex items-center justify-between px-6 select-none transition-colors duration-500",
            isDark ? "bg-black/40 border-white/5" : "bg-white/40 border-black/5"
        )}>
            <div className="flex items-center gap-4">
                <RhiveLogo className={cn("h-6 transition-colors", isDark ? "text-white" : "text-black")} />
                <div className={cn("h-4 w-[1px]", isDark ? "bg-white/10" : "bg-black/10")} />
                <span className={cn(
                    "text-[10px] font-black uppercase tracking-[0.3em]",
                    isDark ? "text-white/40" : "text-black/40"
                )}>
                    {t('system_title')}
                </span>
            </div>

            {/* Weather & Search Widgets */}
            <div className="flex items-center gap-2 sm:gap-4">
                <div className="hidden md:block">
                    <WeatherForecastStrip />
                </div>
                <button
                    onClick={() => window.dispatchEvent(new CustomEvent('open-customer-lookup'))}
                    id="header-search-btn"
                    className="p-1.5 bg-black/40 border border-gray-700/60 hover:border-[#ec028b]/50 rounded-full text-gray-400 hover:text-[#ec028b] hover:shadow-[0_0_8px_rgba(236,2,139,0.3)] transition-all flex items-center justify-center cursor-pointer outline-none"
                    title="Search Contacts & Properties"
                >
                    <MagnifyingGlassIcon className="w-4 h-4" />
                </button>
            </div>

            <div className="flex items-center gap-6">
                {/* Language Selection */}
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border bg-opacity-20 transition-all border-transparent">
                    <Globe className={cn("w-3.5 h-3.5", isDark ? "text-white/30" : "text-black/30")} />
                    <div className="flex items-center gap-1">
                        {languages.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => setLocale(lang.code)}
                                className={cn(
                                    "px-1.5 py-0.5 text-[8px] font-black tracking-widest transition-all rounded",
                                    locale === lang.code
                                        ? "bg-[#ec028b] text-white shadow-[0_0_10px_rgba(236,2,139,0.3)]"
                                        : (isDark ? "text-white/40 hover:text-white" : "text-black/40 hover:text-black")
                                )}
                            >
                                {lang.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Theme Toggle */}
                <button
                    onClick={() => setTheme(isDark ? 'light' : 'dark')}
                    className={cn(
                        "flex items-center gap-2 px-3 py-1 border transition-all hover:scale-105",
                        isDark
                            ? "bg-white/5 border-white/10 text-white/60 hover:border-[#ec028b]/50 hover:text-[#ec028b]"
                            : "bg-black/5 border-black/10 text-black/60 hover:border-[#ec028b]/50 hover:text-[#ec028b]"
                    )}
                    style={{ clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)' }}
                    title={isDark ? t('theme_light') : t('theme_dark')}
                >
                    {isDark ? <SunIcon className="w-3.5 h-3.5" /> : <MoonIcon className="w-3.5 h-3.5" />}
                    <span className="text-[9px] font-black uppercase tracking-widest">
                        {isDark ? 'LIGHT' : 'DARK'}
                    </span>
                </button>

                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_#22c55e]" />
                    <span className="text-[8px] font-black text-green-500/80 uppercase tracking-widest leading-none">{t('system_active')}</span>
                </div>

                <div className={cn("h-4 w-[1px]", isDark ? "bg-white/10" : "bg-black/10")} />

                {/* AVATAR / PROFILE DEVELOPER SWITCHER */}
                <div className="relative flex items-center">
                    <button
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center border transition-all bg-black/50 text-white/80 hover:brightness-110",
                            isProfileOpen ? "border-rhive-pink text-rhive-pink shadow-[0_0_10px_rgba(236,2,139,0.3)] scale-105" : "border-white/10 hover:border-rhive-pink/50"
                        )}
                        title={currentUser ? `Profile: ${currentUser.name}` : "Developer Quick Login"}
                    >
                        {currentUser?.avatarUrl ? (
                            <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-full h-full rounded-full object-cover" />
                        ) : (
                            <User size={14} />
                        )}
                    </button>

                    {isProfileOpen && (
                        <>
                            <div className="fixed inset-0 z-[498]" onClick={() => setIsProfileOpen(false)} />
                            <div 
                                className={cn(
                                    "absolute right-0 top-10 w-60 backdrop-blur-xl border p-4 flex flex-col z-[499] text-left animate-fade-in gap-3 rounded-xl",
                                    isDark ? "bg-black/95 border-rhive-pink/45 shadow-[0_0_25px_rgba(236,2,139,0.25)] text-white" : "bg-white/95 border-rhive-pink/45 shadow-[0_0_25px_rgba(236,2,139,0.15)] text-black"
                                )}
                                style={{
                                    clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)'
                                }}
                            >
                                <div className="border-b border-white/10 pb-2">
                                    <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest block">SESSION ACCOUNT</span>
                                    {currentUser ? (
                                        <div className="mt-1">
                                            <div className={cn("text-xs font-black uppercase truncate", isDark ? "text-white" : "text-black")}>{currentUser.name}</div>
                                            <div className="text-[9px] font-mono text-rhive-pink uppercase mt-0.5">{currentUser.role} Portal</div>
                                        </div>
                                    ) : (
                                        <div className="mt-1">
                                            <div className="text-xs font-black uppercase text-gray-400">Public Guest</div>
                                            <div className="text-[9px] font-mono text-gray-600 uppercase mt-0.5">Unauthenticated</div>
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col gap-1">
                                    <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest block mb-1">DEVELOPER BYPASS</span>
                                    {roles.map(r => (
                                        <button
                                            key={r}
                                            onClick={() => handleRoleSwitch(r)}
                                            className={cn(
                                                "w-full px-3 py-1.5 rounded-lg border text-[9px] font-extrabold uppercase tracking-widest text-left transition-all",
                                                currentUser?.role === r
                                                    ? "bg-rhive-pink/20 border-rhive-pink/45 text-white shadow-[0_0_8px_rgba(236,2,139,0.2)]"
                                                    : cn("border-transparent text-gray-400 hover:text-white", isDark ? "bg-white/5 hover:bg-white/10" : "bg-black/5 hover:bg-black/10")
                                            )}
                                        >
                                            {r} Portal
                                        </button>
                                    ))}
                                </div>

                                <div className="border-t border-white/10 pt-2 flex flex-col gap-1">
                                    <button
                                        onClick={() => {
                                            setIsProfileOpen(false);
                                            setActivePageId('P-00');
                                        }}
                                        className={cn(
                                            "w-full px-3 py-1.5 rounded-lg border text-[9px] font-extrabold uppercase tracking-widest text-left transition-all",
                                            activePageId.startsWith('P-') && activePageId !== 'P-06'
                                                ? "bg-rhive-blue/20 border-rhive-blue/40 text-white"
                                                : cn("border-transparent text-gray-400 hover:text-white", isDark ? "bg-white/5 hover:bg-white/10" : "bg-black/5 hover:bg-black/10")
                                        )}
                                    >
                                        Public Website
                                    </button>
                                    
                                    {currentUser ? (
                                        <button
                                            onClick={() => {
                                                setIsProfileOpen(false);
                                                logout();
                                            }}
                                            className="w-full px-3 py-1.5 bg-red-950/20 hover:bg-red-900/35 border border-red-900/40 hover:border-red-500/50 rounded-lg text-[9px] font-extrabold uppercase tracking-widest text-red-400 text-left transition-all"
                                        >
                                            Sign Out
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => {
                                                setIsProfileOpen(false);
                                                setActivePageId('P-06');
                                            }}
                                            className="w-full px-3 py-1.5 bg-rhive-pink/25 hover:bg-rhive-pink/35 border border-rhive-pink/40 hover:border-rhive-pink/60 rounded-lg text-[9px] font-extrabold uppercase tracking-widest text-white text-left transition-all"
                                        >
                                            Standard Login
                                        </button>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};
