
import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage, Locale } from '../contexts/LanguageContext';
import { cn } from '../lib/utils';
import { RhiveLogo, SunIcon2 as SunIcon, MoonIcon2 as MoonIcon, GlobeAlt as Globe } from './icons';

export const GlobalHeader: React.FC = () => {
    const { theme, setTheme } = useTheme();
    const { locale, setLocale, t } = useLanguage();
    const isDark = theme === 'dark';

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
            </div>
        </header>
    );
};
