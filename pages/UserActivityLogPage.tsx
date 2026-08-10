import React, { useState, useEffect, useMemo, useRef } from 'react';
import { collection, query, orderBy, onSnapshot, limit as fsLimit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useMockDB } from '../contexts/MockDatabaseContext';
import {
    LOG_ACTION_LABELS,
    LOG_ACTION_ICONS,
    LOG_ACTION_SEVERITY,
    LogSeverity,
} from '../lib/userActivityLogger';
import PlexusShape from '../components/PlexusShape';
import {
    ClockIcon,
    UserIcon,
    MagnifyingGlassIcon,
    ShieldCheckIcon,
    XIcon,
    ChevronDownIcon,
    ChevronRightIcon,
    DocumentTextIcon,
    ArrowDownTrayIcon,
} from '../components/icons';
import { cn } from '../lib/utils';

// ─── Types ─────────────────────────────────────────────────────────────────────

interface UserLogEntry {
    id: string;
    userId: string;
    userName: string;
    userRole: string;
    actionType: string;
    description: string;
    payload?: Record<string, any>;
    timestamp: string;
    read: boolean;
    // IP geolocation fields
    ipAddress?: string;
    city?: string;
    region?: string;
    country?: string;
    countryName?: string;
    latitude?: number | null;
    longitude?: number | null;
    timezone?: string;
}

// ─── Severity styles ───────────────────────────────────────────────────────────

const SEVERITY_STYLES: Record<LogSeverity, { badge: string; dot: string; row: string }> = {
    success: {
        badge: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
        dot: 'bg-emerald-400',
        row: 'hover:bg-emerald-500/5',
    },
    danger: {
        badge: 'bg-red-500/10 text-red-400 border border-red-500/20',
        dot: 'bg-red-400',
        row: 'hover:bg-red-500/5',
    },
    warning: {
        badge: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
        dot: 'bg-yellow-400',
        row: 'hover:bg-yellow-500/5',
    },
    info: {
        badge: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
        dot: 'bg-blue-400',
        row: 'hover:bg-blue-500/5',
    },
    muted: {
        badge: 'bg-gray-800 text-gray-400 border border-gray-700',
        dot: 'bg-gray-500',
        row: 'hover:bg-white/5',
    },
};

const getSeverity = (actionType: string): LogSeverity =>
    LOG_ACTION_SEVERITY[actionType] ?? 'muted';

const getLabel = (actionType: string): string =>
    LOG_ACTION_LABELS[actionType] ?? actionType.replace(/_/g, ' ');

const getIcon = (actionType: string): string =>
    LOG_ACTION_ICONS[actionType] ?? '🔔';

// ─── Time formatter ────────────────────────────────────────────────────────────

function formatTime(iso: string): { date: string; time: string; relative: string } {
    try {
        const d = new Date(iso);
        const now = new Date();
        const diffMs = now.getTime() - d.getTime();
        const diffSec = Math.floor(diffMs / 1000);
        const diffMin = Math.floor(diffSec / 60);
        const diffHr = Math.floor(diffMin / 60);
        const diffDay = Math.floor(diffHr / 24);

        let relative = '';
        if (diffSec < 60) relative = `${diffSec}s ago`;
        else if (diffMin < 60) relative = `${diffMin}m ago`;
        else if (diffHr < 24) relative = `${diffHr}h ago`;
        else if (diffDay < 7) relative = `${diffDay}d ago`;
        else relative = d.toLocaleDateString();

        return {
            date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            time: d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            relative,
        };
    } catch {
        return { date: '—', time: '—', relative: '—' };
    }
}

// ─── Stat Card ─────────────────────────────────────────────────────────────────

const StatCard: React.FC<{ label: string; value: number | string; icon: string; color: string }> = ({
    label, value, icon, color
}) => (
    <div className={cn(
        'relative overflow-hidden p-4 border border-gray-800 bg-black/60',
        'transition-all duration-200 hover:border-rhive-pink/30'
    )}
        style={{ clipPath: 'polygon(12px 0,100% 0,100% calc(100% - 12px),calc(100% - 12px) 100%,0 100%,0 12px)' }}
    >
        <div className="flex items-start justify-between mb-2">
            <span className="text-2xl">{icon}</span>
            <span className={cn('text-2xl font-black font-mono', color)}>{value}</span>
        </div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{label}</p>
    </div>
);

// ─── Row detail popout ─────────────────────────────────────────────────────────

const PayloadViewer: React.FC<{ payload?: Record<string, any> }> = ({ payload }) => {
    if (!payload || Object.keys(payload).length === 0) return (
        <p className="text-gray-600 text-xs italic px-2">No additional details</p>
    );
    return (
        <div className="font-mono text-[11px] space-y-1 px-2">
            {Object.entries(payload).map(([k, v]) => (
                <div key={k} className="flex gap-2 flex-wrap">
                    <span className="text-rhive-pink font-bold min-w-[80px]">{k}</span>
                    <span className="text-gray-300 break-all">{typeof v === 'object' ? JSON.stringify(v) : String(v)}</span>
                </div>
            ))}
        </div>
    );
};

// ─── Log Row ───────────────────────────────────────────────────────────────────

const LogRow: React.FC<{ entry: UserLogEntry; isExpanded: boolean; onToggle: () => void }> = ({
    entry, isExpanded, onToggle
}) => {
    const severity = getSeverity(entry.actionType);
    const styles = SEVERITY_STYLES[severity];
    const { date, time, relative } = formatTime(entry.timestamp);

    return (
        <>
            <tr
                id={`log-row-${entry.id}`}
                onClick={onToggle}
                className={cn(
                    'cursor-pointer transition-colors duration-150 border-b border-gray-900',
                    styles.row,
                    isExpanded && 'bg-white/5'
                )}
            >
                {/* Time */}
                <td className="px-4 py-3 min-w-[120px]">
                    <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] font-mono text-gray-400">{time}</span>
                        <span className="text-[9px] font-mono text-gray-600">{date}</span>
                        <span className="text-[9px] text-rhive-pink/70">{relative}</span>
                    </div>
                </td>
                {/* User */}
                <td className="px-4 py-3 min-w-[140px]">
                    <div className="flex flex-col gap-0.5">
                        <span className="text-xs font-bold text-white">{entry.userName}</span>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-gray-500">{entry.userRole}</span>
                    </div>
                </td>
                {/* Action */}
                <td className="px-4 py-3 min-w-[160px]">
                    <div className="flex items-center gap-2">
                        <span className="text-sm">{getIcon(entry.actionType)}</span>
                        <span className={cn('text-[9px] font-black uppercase tracking-widest px-2 py-0.5', styles.badge)}>
                            {getLabel(entry.actionType)}
                        </span>
                    </div>
                </td>
                {/* Description */}
                <td className="px-4 py-3 text-xs text-gray-300 max-w-[280px]">
                    <span className="truncate block">{entry.description}</span>
                    {/* IP location badge — shown inline on the row for login events */}
                    {entry.ipAddress && entry.ipAddress !== 'unknown' && (
                        <span className="text-[9px] font-mono text-gray-500 mt-0.5 block">
                            🌐 {entry.ipAddress} &bull; {entry.city !== 'unknown' ? entry.city : ''}{entry.country && entry.country !== 'unknown' ? `, ${entry.country}` : ''}
                        </span>
                    )}
                </td>
                {/* Expand */}
                <td className="px-4 py-3 text-center">
                    {isExpanded
                        ? <ChevronDownIcon className="h-3 w-3 text-rhive-pink mx-auto" />
                        : <ChevronRightIcon className="h-3 w-3 text-gray-600 mx-auto" />
                    }
                </td>
            </tr>
            {isExpanded && (
                <tr className="border-b border-gray-900">
                    <td colSpan={5} className="px-6 py-4 bg-black/80">
                        <div className="flex gap-6 flex-wrap">
                            <div className="flex-1 min-w-[200px]">
                                <p className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-2">Event Details</p>
                                <PayloadViewer payload={entry.payload} />
                            </div>
                            {/* IP Location Panel */}
                            {entry.ipAddress && (
                                <div className="min-w-[200px]">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-2">🌐 IP Location</p>
                                    <div className="font-mono text-[11px] space-y-1 px-2">
                                        <div className="flex gap-2">
                                            <span className="text-rhive-pink font-bold min-w-[80px]">IP</span>
                                            <span className="text-gray-300">{entry.ipAddress}</span>
                                        </div>
                                        {entry.city && entry.city !== 'unknown' && (
                                            <div className="flex gap-2">
                                                <span className="text-rhive-pink font-bold min-w-[80px]">City</span>
                                                <span className="text-gray-300">{entry.city}</span>
                                            </div>
                                        )}
                                        {entry.region && entry.region !== 'unknown' && (
                                            <div className="flex gap-2">
                                                <span className="text-rhive-pink font-bold min-w-[80px]">Region</span>
                                                <span className="text-gray-300">{entry.region}</span>
                                            </div>
                                        )}
                                        {entry.countryName && entry.countryName !== 'unknown' && (
                                            <div className="flex gap-2">
                                                <span className="text-rhive-pink font-bold min-w-[80px]">Country</span>
                                                <span className="text-gray-300">{entry.countryName} ({entry.country})</span>
                                            </div>
                                        )}
                                        {entry.timezone && entry.timezone !== 'unknown' && (
                                            <div className="flex gap-2">
                                                <span className="text-rhive-pink font-bold min-w-[80px]">Timezone</span>
                                                <span className="text-gray-300">{entry.timezone}</span>
                                            </div>
                                        )}
                                        {entry.latitude != null && entry.longitude != null && (
                                            <div className="flex gap-2">
                                                <span className="text-rhive-pink font-bold min-w-[80px]">Coords</span>
                                                <span className="text-gray-300">{entry.latitude}, {entry.longitude}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                            <div className="text-[10px] text-gray-600 font-mono space-y-1 min-w-[180px]">
                                <p><span className="text-gray-500">ID:</span> {entry.id}</p>
                                <p><span className="text-gray-500">User ID:</span> {entry.userId}</p>
                                <p><span className="text-gray-500">Timestamp:</span> {entry.timestamp}</p>
                            </div>
                        </div>
                    </td>
                </tr>
            )}
        </>
    );
};

// ─── Main Page ─────────────────────────────────────────────────────────────────

const UserActivityLogPage: React.FC = () => {
    const { currentUser } = useMockDB();
    const [logs, setLogs] = useState<UserLogEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterAction, setFilterAction] = useState('all');
    const [filterRole, setFilterRole] = useState('all');
    const [filterSeverity, setFilterSeverity] = useState('all');
    const [maxRows, setMaxRows] = useState(200);
    const tableRef = useRef<HTMLDivElement>(null);

    // Access: Super Admin (owner), or explicitly allowlisted email (james.g@rhiveconstruction.com)
    const ALLOWLISTED_EMAILS = ['james.g@rhiveconstruction.com'];
    const isAdmin =
        currentUser?.role === 'Super Admin' ||
        (!!currentUser?.email && ALLOWLISTED_EMAILS.includes(currentUser.email.toLowerCase()));

    // ── Real-time Firestore subscription ──────────────────────────────────────
    useEffect(() => {
        setIsLoading(true);
        const q = query(
            collection(db, 'user_log'),
            orderBy('timestamp', 'desc'),
            fsLimit(500)
        );

        const unsub = onSnapshot(q, (snap) => {
            const docs = snap.docs.map(d => ({ id: d.id, ...d.data() } as UserLogEntry));
            setLogs(docs);
            setIsLoading(false);
        }, () => {
            setIsLoading(false);
        });

        return () => unsub();
    }, []);

    // ── Derived data ──────────────────────────────────────────────────────────

    const uniqueActions = useMemo(() =>
        [...new Set(logs.map(l => l.actionType))].sort(), [logs]);

    const uniqueRoles = useMemo(() =>
        [...new Set(logs.map(l => l.userRole))].sort(), [logs]);

    const filteredLogs = useMemo(() => {
        return logs
            .filter(l => {
                if (filterAction !== 'all' && l.actionType !== filterAction) return false;
                if (filterRole !== 'all' && l.userRole !== filterRole) return false;
                if (filterSeverity !== 'all' && getSeverity(l.actionType) !== filterSeverity) return false;
                if (searchQuery) {
                    const q = searchQuery.toLowerCase();
                    return (
                        l.userName.toLowerCase().includes(q) ||
                        l.description.toLowerCase().includes(q) ||
                        l.actionType.toLowerCase().includes(q) ||
                        l.userRole.toLowerCase().includes(q)
                    );
                }
                return true;
            })
            .slice(0, maxRows);
    }, [logs, filterAction, filterRole, filterSeverity, searchQuery, maxRows]);

    // ── Stats ─────────────────────────────────────────────────────────────────

    const stats = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayLogs = logs.filter(l => new Date(l.timestamp) >= today);
        const loginCount = logs.filter(l => l.actionType === 'USER_LOGIN' || l.actionType === 'LOGIN').length;
        const failedCount = logs.filter(l => l.actionType === 'FAILED_LOGIN').length;
        const uniqueUsers = new Set(logs.map(l => l.userId)).size;
        return { total: logs.length, today: todayLogs.length, logins: loginCount, failed: failedCount, users: uniqueUsers };
    }, [logs]);

    // ── CSV Export ────────────────────────────────────────────────────────────

    const exportCSV = () => {
        const header = ['Timestamp', 'User', 'Role', 'Action', 'Description', 'User ID', 'IP Address', 'City', 'Region', 'Country'];
        const rows = filteredLogs.map(l => [
            l.timestamp,
            `"${l.userName}"`,
            l.userRole,
            l.actionType,
            `"${l.description.replace(/"/g, '""')}"`,
            l.userId,
            l.ipAddress || '',
            l.city || '',
            l.region || '',
            l.country || '',
        ]);
        const csv = [header, ...rows].map(r => r.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `rhive-user-logs-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const chamferSize = '24px';
    const clipPath = `polygon(${chamferSize} 0,100% 0,100% calc(100% - ${chamferSize}),calc(100% - ${chamferSize}) 100%,0 100%,0 ${chamferSize})`;

    // ─── Guard: Admin only ────────────────────────────────────────────────────
    if (!isAdmin) {
        return (
            <div className="flex items-center justify-center h-full p-10">
                <div className="text-center">
                    <ShieldCheckIcon className="h-16 w-16 text-rhive-pink/40 mx-auto mb-4" />
                    <h2 className="text-xl font-black uppercase tracking-widest text-gray-400 mb-2">Access Restricted</h2>
                    <p className="text-sm text-gray-600">Owner or Super Admin access required to view activity logs.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-full bg-black text-white font-sans px-6 py-8">
            {/* ── Page Header ────────────────────────────────────────────────── */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-1">
                    <DocumentTextIcon className="h-6 w-6 text-rhive-pink" />
                    <h1 className="text-2xl font-black uppercase tracking-[0.25em] text-white">
                        User Activity Logs
                    </h1>
                </div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-9">
                    Real-time event stream · Firestore `user_log` collection
                </p>
                {/* Live indicator */}
                <div className="ml-9 mt-2 flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400">Live</span>
                </div>
            </div>

            {/* ── Stats Row ──────────────────────────────────────────────────── */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
                <StatCard label="Total Events" value={stats.total} icon="📋" color="text-white" />
                <StatCard label="Today" value={stats.today} icon="📅" color="text-blue-400" />
                <StatCard label="Logins" value={stats.logins} icon="🔐" color="text-emerald-400" />
                <StatCard label="Failed Attempts" value={stats.failed} icon="⛔" color="text-red-400" />
                <StatCard label="Unique Users" value={stats.users} icon="👥" color="text-rhive-pink" />
            </div>

            {/* ── Log Viewer Card ────────────────────────────────────────────── */}
            <div className="relative flex flex-col isolate">
                {/* Background */}
                <div className="absolute inset-0 bg-gray-800 transition-colors duration-300"
                    style={{ clipPath, WebkitClipPath: clipPath }} />
                <div className="absolute inset-[1px] bg-black z-0 overflow-hidden"
                    style={{ clipPath, WebkitClipPath: clipPath }}>
                    <div className="absolute inset-0 pointer-events-none">
                        <PlexusShape backgroundColor="#000000" dotColor="#ec028b" lineColor="236, 2, 139" density={20} className="h-full w-full" />
                        <div className="absolute inset-0 bg-black/80" />
                    </div>
                </div>

                {/* Borders */}
                <div className="absolute left-0 top-6 bottom-0 w-[1px] bg-gray-700 z-10" />
                <svg className="absolute top-0 left-0 w-6 h-6 z-10 overflow-visible pointer-events-none">
                    <line x1="0" y1="24" x2="24" y2="0" stroke="#374151" strokeWidth="1" strokeLinecap="square" />
                </svg>
                <svg className="absolute top-0 left-0 w-6 h-6 z-20 overflow-visible pointer-events-none">
                    <line x1="8" y1="16" x2="16" y2="8" stroke="#ec028b" strokeWidth="2" strokeLinecap="square" />
                </svg>
                <div className="absolute right-0 top-0 bottom-6 w-[1px] bg-gray-700 z-10" />
                <div className="absolute left-6 right-0 top-0 h-[1px] bg-gray-700 z-10" />
                <div className="absolute left-0 right-6 bottom-0 h-[1px] bg-gray-700 z-10" />
                <svg className="absolute bottom-0 right-0 w-6 h-6 z-10 overflow-visible pointer-events-none">
                    <line x1="0" y1="24" x2="24" y2="0" stroke="#374151" strokeWidth="1" strokeLinecap="square" />
                </svg>
                <svg className="absolute bottom-0 right-0 w-6 h-6 z-20 overflow-visible pointer-events-none">
                    <line x1="8" y1="16" x2="16" y2="8" stroke="#ec028b" strokeWidth="2" strokeLinecap="square" />
                </svg>

                {/* Content */}
                <div className="relative z-20 p-6">
                    {/* ── Toolbar ──────────────────────────────────────────── */}
                    <div className="flex flex-wrap gap-3 mb-5 items-center">
                        {/* Search */}
                        <div className="relative flex-1 min-w-[200px]">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                            <input
                                id="log-search"
                                type="text"
                                placeholder="Search user, action, description…"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="w-full bg-black/60 border border-gray-800 focus:border-rhive-pink outline-none text-white text-xs pl-9 pr-4 py-2 transition-colors"
                                style={{ clipPath: 'polygon(6px 0,100% 0,100% calc(100% - 6px),calc(100% - 6px) 100%,0 100%,0 6px)' }}
                            />
                            {searchQuery && (
                                <button
                                    id="log-search-clear"
                                    aria-label="Clear search"
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-rhive-pink transition-colors"
                                >
                                    <XIcon className="h-3.5 w-3.5" />
                                </button>
                            )}
                        </div>

                        {/* Action filter */}
                        <select
                            id="log-filter-action"
                            value={filterAction}
                            onChange={e => setFilterAction(e.target.value)}
                            className="bg-black/60 border border-gray-800 text-gray-300 text-[10px] font-bold uppercase tracking-wider px-3 py-2 outline-none focus:border-rhive-pink transition-colors"
                        >
                            <option value="all">All Actions</option>
                            {uniqueActions.map(a => (
                                <option key={a} value={a}>{getLabel(a)}</option>
                            ))}
                        </select>

                        {/* Role filter */}
                        <select
                            id="log-filter-role"
                            value={filterRole}
                            onChange={e => setFilterRole(e.target.value)}
                            className="bg-black/60 border border-gray-800 text-gray-300 text-[10px] font-bold uppercase tracking-wider px-3 py-2 outline-none focus:border-rhive-pink transition-colors"
                        >
                            <option value="all">All Roles</option>
                            {uniqueRoles.map(r => (
                                <option key={r} value={r}>{r}</option>
                            ))}
                        </select>

                        {/* Severity filter */}
                        <select
                            id="log-filter-severity"
                            value={filterSeverity}
                            onChange={e => setFilterSeverity(e.target.value)}
                            className="bg-black/60 border border-gray-800 text-gray-300 text-[10px] font-bold uppercase tracking-wider px-3 py-2 outline-none focus:border-rhive-pink transition-colors"
                        >
                            <option value="all">All Severity</option>
                            <option value="success">Success</option>
                            <option value="info">Info</option>
                            <option value="warning">Warning</option>
                            <option value="danger">Danger</option>
                            <option value="muted">Muted</option>
                        </select>

                        {/* Spacer */}
                        <div className="flex-1" />

                        {/* Result count */}
                        <span className="text-[9px] font-bold uppercase tracking-widest text-gray-500">
                            {filteredLogs.length} of {logs.length} events
                        </span>

                        {/* Export */}
                        <button
                            id="log-export-csv"
                            aria-label="Export as CSV"
                            onClick={exportCSV}
                            className="flex items-center gap-2 px-4 py-2 bg-rhive-pink/10 border border-rhive-pink/30 hover:bg-rhive-pink/20 hover:border-rhive-pink/50 text-rhive-pink text-[10px] font-black uppercase tracking-widest transition-all"
                            style={{ clipPath: 'polygon(6px 0,100% 0,100% calc(100% - 6px),calc(100% - 6px) 100%,0 100%,0 6px)' }}
                        >
                            <ArrowDownTrayIcon className="h-3.5 w-3.5" />
                            Export CSV
                        </button>
                    </div>

                    {/* ── Severity Legend ───────────────────────────────────── */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        {(['success', 'info', 'warning', 'danger', 'muted'] as LogSeverity[]).map(s => (
                            <button
                                key={s}
                                id={`severity-legend-${s}`}
                                aria-label={`Filter by ${s}`}
                                onClick={() => setFilterSeverity(filterSeverity === s ? 'all' : s)}
                                className={cn(
                                    'flex items-center gap-1.5 px-2 py-1 text-[9px] font-black uppercase tracking-widest transition-all',
                                    SEVERITY_STYLES[s].badge,
                                    filterSeverity === s && 'ring-1 ring-rhive-pink/50 scale-105'
                                )}
                            >
                                <div className={cn('h-1.5 w-1.5 rounded-full', SEVERITY_STYLES[s].dot)} />
                                {s}
                            </button>
                        ))}
                    </div>

                    {/* ── Table ─────────────────────────────────────────────── */}
                    <div ref={tableRef} className="overflow-x-auto overflow-y-auto max-h-[60vh] border border-gray-800">
                        {isLoading ? (
                            <div className="flex items-center justify-center py-20 gap-3">
                                <div className="h-4 w-4 border-2 border-rhive-pink border-t-transparent rounded-full animate-spin" />
                                <span className="text-xs text-gray-500 uppercase tracking-widest font-bold">Loading logs…</span>
                            </div>
                        ) : filteredLogs.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 gap-3">
                                <ClockIcon className="h-10 w-10 text-gray-700" />
                                <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">No events match your filters</p>
                            </div>
                        ) : (
                            <table className="w-full min-w-[700px] text-left">
                                <thead>
                                    <tr className="border-b border-gray-800 bg-black/80">
                                        <th className="px-4 py-3 text-[9px] font-black uppercase tracking-widest text-gray-500 whitespace-nowrap">
                                            <ClockIcon className="inline h-3 w-3 mr-1" />Timestamp
                                        </th>
                                        <th className="px-4 py-3 text-[9px] font-black uppercase tracking-widest text-gray-500">
                                            <UserIcon className="inline h-3 w-3 mr-1" />User
                                        </th>
                                        <th className="px-4 py-3 text-[9px] font-black uppercase tracking-widest text-gray-500">Action</th>
                                        <th className="px-4 py-3 text-[9px] font-black uppercase tracking-widest text-gray-500">Description</th>
                                        <th className="px-4 py-3 text-[9px] font-black uppercase tracking-widest text-gray-500 text-center">Details</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredLogs.map(entry => (
                                        <LogRow
                                            key={entry.id}
                                            entry={entry}
                                            isExpanded={expandedId === entry.id}
                                            onToggle={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
                                        />
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>

                    {/* ── Load More ──────────────────────────────────────────── */}
                    {filteredLogs.length >= maxRows && (
                        <div className="mt-4 text-center">
                            <button
                                id="log-load-more"
                                onClick={() => setMaxRows(prev => prev + 200)}
                                className="text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-rhive-pink transition-colors"
                            >
                                Load 200 more →
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserActivityLogPage;
