import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage, Locale } from '../contexts/LanguageContext';
import { cn } from '../lib/utils';
import { getStagePageId } from '../lib/utils';
import { RhiveLogo, SunIcon2 as SunIcon, MoonIcon2 as MoonIcon, GlobeAlt as Globe, MagnifyingGlassIcon, BellIcon } from './icons';
import WeatherForecastStrip from './WeatherForecastStrip';
import { useMockDB } from '../contexts/MockDatabaseContext';
import { useNavigation } from '../contexts/NavigationContext';
import { User, Sparkles as SparklesIcon, Check, CheckCheck, RotateCcw, ExternalLink } from 'lucide-react';
import AIChatPanel from './AIChatPanel';
import { useNotifications, getActivityIcon, ActivityNotification } from '../contexts/NotificationContext';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const formatRelativeTime = (timestamp: string): string => {
    const now = Date.now();
    const then = new Date(timestamp).getTime();
    const diffMs = now - then;
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHrs = Math.floor(diffMins / 60);
    if (diffHrs < 24) return `${diffHrs}h ago`;
    const diffDays = Math.floor(diffHrs / 24);
    if (diffDays === 1) return 'yesterday';
    return `${diffDays}d ago`;
};

const groupByDay = (items: ActivityNotification[]) => {
    const today: ActivityNotification[] = [];
    const yesterday: ActivityNotification[] = [];
    const older: ActivityNotification[] = [];
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const startOfYesterday = startOfToday - 86400000;

    items.forEach(n => {
        const t = new Date(n.timestamp).getTime();
        if (t >= startOfToday) today.push(n);
        else if (t >= startOfYesterday) yesterday.push(n);
        else older.push(n);
    });
    return { today, yesterday, older };
};

// ─── Notification Bell Widget ────────────────────────────────────────────────

// Maps an actionType + payload to a navigation target { pageId, selectedId, selectedType }
const resolveNotificationTarget = (
    actionType: string,
    payload?: Record<string, any>
): { pageId: string; selectedId?: string; selectedType?: string } | null => {
    const at = actionType?.toLowerCase();

    // Project-related actions
    if (payload?.projectId || [
        'create_project', 'stage_change', 'save_quote', 'approve_quote',
        'lead_created', 'lead_updated', 'project_stage_changed',
        'estimate_created', 'estimate_updated', 'quote_saved', 'quote_approved',
        'quote_rejected', 'meeting_scheduled', 'meeting_updated',
        'document_uploaded', 'payment_recorded'
    ].some(k => at?.includes(k.replace(/_/g, ''))))
    {
        const projectId = payload?.projectId;
        if (!projectId) return null;

        // Use the canonical getStagePageId utility (same as EmployeePipelinePage)
        // Fall back to E-26 (Lead page) rather than E-15 so ProjectStageLayout can show the record
        const stage = payload?.newStage || payload?.stage || '';
        const resolvedPage = getStagePageId(stage);
        const pageId = (resolvedPage === 'E-15' || !resolvedPage) ? 'E-26' : resolvedPage;
        return { pageId, selectedId: projectId, selectedType: 'project' };
    }

    // Property-related actions
    if (payload?.propertyId || at?.includes('property')) {
        const propertyId = payload?.propertyId;
        if (!propertyId) return null;
        return { pageId: 'E-12', selectedId: propertyId, selectedType: 'property' };
    }

    // Contact-related actions
    if (payload?.contactId || at?.includes('contact')) {
        const contactId = payload?.contactId;
        if (!contactId) return null;
        return { pageId: 'E-10', selectedId: contactId, selectedType: 'contact' };
    }

    // Account-related actions
    if (payload?.accountId || at?.includes('account')) {
        const accountId = payload?.accountId;
        if (!accountId) return null;
        return { pageId: 'E-08', selectedId: accountId, selectedType: 'account' };
    }

    return null;
};

const NotificationBell: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { notifications, unreadCount, markRead, markUnread, markAllRead, isLoading } = useNotifications();
    const { setActivePageId, setSelectedProjectId, setSelectedPropertyId, setSelectedContactId, setSelectedAccountId } = useNavigation();

    const groups = groupByDay(notifications);
    const hasAny = notifications.length > 0;

    const handleMarkRead = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        await markRead(id);
    };

    const handleMarkUnread = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        await markUnread(id);
    };

    const handleItemClick = async (n: ActivityNotification) => {
        // Mark as read
        if (!n.read) {
            await markRead(n.id);
        }

        // Resolve navigation target
        const target = resolveNotificationTarget(n.actionType, n.payload);
        if (!target) {
            setIsOpen(false);
            return;
        }

        // Set the selected record then navigate
        if (target.selectedType === 'project' && target.selectedId) {
            setSelectedProjectId(target.selectedId);
        } else if (target.selectedType === 'property' && target.selectedId) {
            setSelectedPropertyId(target.selectedId);
        } else if (target.selectedType === 'contact' && target.selectedId) {
            setSelectedContactId(target.selectedId);
        } else if (target.selectedType === 'account' && target.selectedId) {
            setSelectedAccountId(target.selectedId);
        }
        setActivePageId(target.pageId);
        setIsOpen(false);
    };

    const renderGroup = (label: string, items: ActivityNotification[]) => {
        if (items.length === 0) return null;
        return (
            <div key={label}>
                <div className="text-[8px] font-black uppercase tracking-widest text-gray-600 px-1 py-1.5">{label}</div>
                <div className="space-y-1.5">
                    {items.map(n => {
                        const target = resolveNotificationTarget(n.actionType, n.payload);
                        const isNavigable = !!target;
                        return (
                        <div
                            key={n.id}
                            onClick={() => handleItemClick(n)}
                            className={cn(
                                "p-2.5 border transition-all flex gap-2.5 group/item relative",
                                isNavigable ? "cursor-pointer" : "cursor-default",
                                n.read
                                    ? "bg-black/20 border-gray-800/60 text-gray-500 hover:bg-gray-900/40 hover:border-gray-700"
                                    : "bg-rhive-pink/5 border-[#ec028b]/20 text-white hover:bg-rhive-pink/10 hover:border-[#ec028b]/40"
                            )}
                            style={{ clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)' }}
                            title={isNavigable ? "Click to view record" : undefined}
                        >
                            {/* Icon */}
                            <span className="text-base leading-none mt-0.5 flex-shrink-0">
                                {getActivityIcon(n.actionType)}
                            </span>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start gap-1">
                                    <span className={cn(
                                        "text-[10px] font-black uppercase tracking-wide truncate",
                                        n.read ? "text-gray-500" : "text-white"
                                    )}>
                                        {n.description}
                                    </span>
                                    <div className="flex items-center gap-1 flex-shrink-0">
                                        {isNavigable && (
                                            <ExternalLink className="w-2.5 h-2.5 text-rhive-pink/40 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                                        )}
                                        <span className="text-[8px] font-mono text-gray-600 whitespace-nowrap">
                                            {formatRelativeTime(n.timestamp)}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between mt-1">
                                    <span className="text-[9px] font-mono text-rhive-pink/60 uppercase">
                                        {n.actionType.replace(/_/g, ' ')}
                                    </span>
                                    {/* Per-item action buttons */}
                                    {!n.read && (
                                        <button
                                            id={`btn-mark-read-${n.id}`}
                                            onClick={(e) => handleMarkRead(e, n.id)}
                                            title="Mark as read"
                                            className="flex items-center gap-0.5 text-[8px] font-bold uppercase tracking-wider text-gray-600 hover:text-green-400 transition-colors cursor-pointer opacity-0 group-hover/item:opacity-100 focus:opacity-100"
                                        >
                                            <Check className="w-3 h-3" />
                                            <span>Read</span>
                                        </button>
                                    )}
                                    {n.read && (
                                        <button
                                            id={`btn-mark-unread-${n.id}`}
                                            onClick={(e) => handleMarkUnread(e, n.id)}
                                            title="Mark as unread"
                                            className="flex items-center gap-0.5 text-[8px] font-bold uppercase tracking-wider text-gray-700 hover:text-yellow-400 transition-colors cursor-pointer opacity-0 group-hover/item:opacity-100 focus:opacity-100"
                                        >
                                            <RotateCcw className="w-2.5 h-2.5" />
                                            <span>Unread</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div className="relative">
            <button
                id="btn-notification-bell"
                onClick={() => setIsOpen(o => !o)}
                className={cn(
                    "p-1.5 border rounded-full text-gray-400 hover:text-[#ec028b] hover:shadow-[0_0_8px_rgba(236,2,139,0.3)] transition-all flex items-center justify-center cursor-pointer outline-none relative",
                    isOpen
                        ? "border-[#ec028b] text-[#ec028b] bg-[#ec028b]/10 shadow-[0_0_8px_rgba(236,2,139,0.3)]"
                        : "bg-black/40 border-gray-700/60 hover:border-[#ec028b]/50"
                )}
                title="Activity & Notifications"
            >
                <BellIcon className="w-4 h-4" />
                {unreadCount > 0 && (
                    <span
                        id="notification-badge"
                        className="absolute -top-1 -right-1 min-w-[14px] h-3.5 px-0.5 bg-rhive-pink text-white font-mono text-[8px] font-black flex items-center justify-center rounded-full border border-black shadow-[0_0_5px_rgba(236,2,139,0.8)] animate-pulse"
                    >
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-[199]" onClick={() => setIsOpen(false)} />
                    <div
                        id="notification-dropdown"
                        className="absolute right-0 mt-2.5 w-88 bg-black/95 border border-gray-800 shadow-2xl z-[200] animate-fade-in backdrop-blur-xl overflow-hidden"
                        style={{
                            width: '340px',
                            clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)'
                        }}
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center px-4 pt-3 pb-2.5 border-b border-gray-800">
                            <div className="flex items-center gap-2">
                                {unreadCount > 0 ? (
                                    <span className="text-[9px] font-mono bg-rhive-pink/20 text-rhive-pink border border-rhive-pink/30 px-1.5 py-0.5 rounded-full">
                                        {unreadCount} unread
                                    </span>
                                ) : (
                                    <span className="text-[9px] font-mono text-gray-600 uppercase tracking-widest">All caught up</span>
                                )}
                            </div>
                            {unreadCount > 0 && (
                                <button
                                    id="btn-mark-all-read"
                                    onClick={markAllRead}
                                    className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-gray-500 hover:text-green-400 transition-colors cursor-pointer"
                                >
                                    <CheckCheck className="w-3 h-3" />
                                    All read
                                </button>
                            )}
                        </div>

                        {/* Body */}
                        <div className="p-3 space-y-1 max-h-[420px] overflow-y-auto custom-scrollbar">
                            {isLoading ? (
                                <div className="flex items-center justify-center py-8 gap-2">
                                    <div className="w-1.5 h-1.5 bg-rhive-pink rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <div className="w-1.5 h-1.5 bg-rhive-pink rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <div className="w-1.5 h-1.5 bg-rhive-pink rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            ) : !hasAny ? (
                                <div className="text-center py-8">
                                    <div className="text-2xl mb-2">🔔</div>
                                    <p className="text-[10px] text-gray-600 font-mono uppercase tracking-wider">No activity yet</p>
                                </div>
                            ) : (
                                <>
                                    {renderGroup('Today', groups.today)}
                                    {renderGroup('Yesterday', groups.yesterday)}
                                    {renderGroup('Older', groups.older)}
                                </>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export const GlobalHeader: React.FC = () => {
    const { theme, setTheme } = useTheme();
    const { locale, setLocale, t } = useLanguage();
    const { currentUser, login, logout } = useMockDB();
    const { activePageId, setActivePageId } = useNavigation();
    const isDark = theme === 'dark';

    const [isProfileOpen, setIsProfileOpen] = React.useState(false);
    const [isAIChatOpen, setIsAIChatOpen] = React.useState(false);

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
                case 'Admin': setActivePageId('E-01'); break;
                case 'Super Admin': setActivePageId('E-01'); break;
            }
        }
    };

    const [isWeatherOpen, setIsWeatherOpen] = React.useState(false);
    const languages: { code: Locale; label: string }[] = [
        { code: 'en', label: 'EN' },
        { code: 'es', label: 'ES' },
        { code: 'fr', label: 'FR' },
        { code: 'de', label: 'DE' },
    ];

    return (
        <>
            <header className={cn(
                "fixed top-0 left-0 w-full h-12 backdrop-blur-xl border-b z-[150] flex items-center justify-between px-6 select-none transition-colors duration-500",
                isDark ? "bg-black/40 border-white/5" : "bg-white/40 border-black/5"
            )}>
                <div className="flex items-center gap-4">
                    <RhiveLogo className={cn("h-6 transition-colors", isDark ? "text-white" : "text-black")} />
                    <div className={cn("h-4 w-[1px]", isDark ? "bg-white/10" : "bg-black/10")} />
                    <span className={cn(
                        "text-base font-black uppercase tracking-[0.3em]",
                        isDark ? "text-white/40" : "text-black/40"
                    )}>
                        {t('system_title')}
                    </span>
                </div>

                {/* Weather, Search & AI Assistant Widgets */}
                <div className="flex items-center gap-2 sm:gap-4 relative">
                    {/* Compact Weather Button */}
                    <div className="relative">
                        <button
                            onClick={() => setIsWeatherOpen(!isWeatherOpen)}
                            id="header-weather-trigger-btn"
                            className={cn(
                                "px-3 py-1.5 bg-black/40 border border-gray-700/60 hover:border-[#ec028b]/50 rounded-full text-xs font-bold text-gray-300 hover:text-white flex items-center gap-1.5 cursor-pointer outline-none transition-all",
                                isWeatherOpen && "border-[#ec028b] text-white shadow-[0_0_8px_rgba(236,2,139,0.3)] bg-[#ec028b]/10"
                            )}
                        >
                            <span>🌤️</span>
                            <span className="hidden sm:inline">Salt Lake City</span>
                            <span className="font-mono text-[#ec028b]">78°F</span>
                        </button>
                        {isWeatherOpen && (
                            <>
                                <div className="fixed inset-0 z-[199]" onClick={() => setIsWeatherOpen(false)} />
                                <div
                                    className="absolute left-1/2 -translate-x-1/2 mt-2 p-3 bg-black/95 border border-[#ec028b]/40 rounded-xl shadow-[0_0_20px_rgba(236,2,139,0.25)] z-[200] backdrop-blur-xl"
                                    style={{ minWidth: '380px' }}
                                >
                                    <div className="text-[10px] font-black uppercase text-gray-400 tracking-wider mb-2 text-center border-b border-white/5 pb-1.5 flex justify-between items-center px-1">
                                        <span>7-Day Command Forecast</span>
                                        <span className="text-[8px] text-[#ec028b] font-mono">SLC Base</span>
                                    </div>
                                    <WeatherForecastStrip />
                                </div>
                            </>
                        )}
                    </div>

                    {/* Search Button */}
                    <button
                        onClick={() => window.dispatchEvent(new CustomEvent('open-customer-lookup'))}
                        id="header-search-btn"
                        className="p-1.5 bg-black/40 border border-gray-700/60 hover:border-[#ec028b]/50 rounded-full text-gray-400 hover:text-[#ec028b] hover:shadow-[0_0_8px_rgba(236,2,139,0.3)] transition-all flex items-center justify-center cursor-pointer outline-none"
                        title="Search Contacts & Properties"
                    >
                        <MagnifyingGlassIcon className="w-4 h-4" />
                    </button>

                    {/* AI Assistant Button + Notification Bell — hidden on login page and when unauthenticated */}
                    {activePageId !== 'P-06' && currentUser && (
                        <>
                            <button
                                onClick={() => setIsAIChatOpen(o => !o)}
                                id="header-ai-assistant-btn"
                                className={cn(
                                    "p-1.5 border hover:border-[#ec028b]/50 rounded-full text-gray-400 hover:text-[#ec028b] hover:shadow-[0_0_8px_rgba(236,2,139,0.3)] transition-all flex items-center justify-center cursor-pointer outline-none",
                                    isAIChatOpen ? "border-[#ec028b] text-[#ec028b] bg-[#ec028b]/10 shadow-[0_0_8px_rgba(236,2,139,0.3)]" : "bg-black/40 border-gray-700/60"
                                )}
                                title="AI Assistant — ARIA"
                            >
                                <SparklesIcon className="w-4 h-4" />
                            </button>
                            <NotificationBell />
                        </>
                    )}
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
                                        "px-1.5 py-0.5 text-base font-black tracking-widest transition-all rounded",
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
                        <span className="text-base font-black uppercase tracking-widest">
                            {isDark ? 'LIGHT' : 'DARK'}
                        </span>
                    </button>

                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_#22c55e]" />
                        <span className="text-base font-black text-green-500/80 uppercase tracking-widest leading-none">{t('system_active')}</span>
                    </div>

                    <div className={cn("h-4 w-[1px]", isDark ? "bg-white/10" : "bg-black/10")} />

                    {/* AVATAR / PROFILE DEVELOPER SWITCHER */}
                    <div className="relative flex items-center">
                        <button
                            onClick={() => {
                                if (!currentUser) {
                                    setActivePageId('P-06');
                                } else {
                                    setIsProfileOpen(!isProfileOpen);
                                }
                            }}
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
                                        {currentUser && (
                                            <button
                                                onClick={() => {
                                                    setIsProfileOpen(false);
                                                    setActivePageId('E-03');
                                                }}
                                                className={cn(
                                                    "w-full px-3 py-1.5 rounded-lg border text-[9px] font-extrabold uppercase tracking-widest text-left transition-all",
                                                    activePageId === 'E-03'
                                                        ? "bg-[#ec028b]/20 border-[#ec028b]/45 text-white"
                                                        : cn("border-transparent text-gray-400 hover:text-white", isDark ? "bg-white/5 hover:bg-white/10" : "bg-black/5 hover:bg-black/10")
                                                )}
                                            >
                                                My Profile
                                            </button>
                                        )}

                                        {currentUser && (currentUser.role === 'Admin' || currentUser.role === 'Super Admin') && (
                                            <button
                                                onClick={() => {
                                                    setIsProfileOpen(false);
                                                    setActivePageId('A-01');
                                                }}
                                                className={cn(
                                                    "w-full px-3 py-1.5 rounded-lg border text-[9px] font-extrabold uppercase tracking-widest text-left transition-all",
                                                    activePageId === 'A-01'
                                                        ? "bg-[#ec028b]/20 border-[#ec028b]/45 text-white"
                                                        : cn("border-transparent text-gray-400 hover:text-white", isDark ? "bg-white/5 hover:bg-white/10" : "bg-black/5 hover:bg-black/10")
                                                )}
                                            >
                                                Control Room
                                            </button>
                                        )}

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

            {/* AI Chat Panel — rendered outside header to avoid z-index clipping */}
            <AIChatPanel isOpen={isAIChatOpen} onClose={() => setIsAIChatOpen(false)} />
        </>
    );
};
