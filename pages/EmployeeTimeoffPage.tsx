import React, { useState, useEffect, useCallback } from 'react';
import PageContainer from '../components/PageContainer';
import Card from '../components/Card';
import Button from '../components/Button';
import { CalendarDaysIcon, BoltIcon, PhoneIcon, MapPinIcon, ClockIcon, XIcon } from '../components/icons';
import { PAGE_GROUPS } from '../constants';
import { firestoreService } from '../lib/firebaseService';
import { cn } from '../lib/utils';

// --- Weather Config ---
const GOOGLE_WEATHER_API_KEY = (import.meta as any).env?.VITE_GOOGLE_WEATHER_API_KEY || '';
const WEATHER_BASE = 'https://weather.googleapis.com/v1';
const DEFAULT_LAT = 39.7392;
const DEFAULT_LON = -104.9903;

interface WeatherAlert {
    date: string;
    type: string;
    description: string;
    isStorm: boolean;
}

interface FollowUp {
    id: string;
    project_id: string;
    project_name: string;
    type: 'call' | 'visit';
    date: string;   // YYYY-MM-DD
    time: string;   // HH:MM
    notes: string;
    stage: string;
}

const STORM_TYPES = new Set([
    'THUNDERSTORM', 'TORNADO', 'HEAVY_RAIN', 'HAIL', 'FREEZING_RAIN',
    'HEAVY_SNOW', 'SLEET', 'SHOWERS', 'SCATTERED_SHOWERS',
]);

// ─── Follow-up detail popup ────────────────────────────────────────────────────
const FollowUpPopup: React.FC<{ items: FollowUp[]; onClose: () => void; dateLabel: string }> = ({ items, onClose, dateLabel }) => (
    <div className="fixed inset-0 z-[300] flex items-center justify-center" onClick={onClose}>
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
        <div
            className="relative z-10 w-full max-w-sm mx-4 bg-[#080808] border border-gray-800 rounded-2xl shadow-[0_0_60px_rgba(168,85,247,0.15)] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
        >
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
                <div>
                    <p className="text-[10px] text-purple-400 font-black uppercase tracking-widest mb-0.5">Follow-Ups</p>
                    <h3 className="text-white font-bold text-sm">{dateLabel}</h3>
                </div>
                <button
                    onClick={onClose}
                    className="w-7 h-7 flex items-center justify-center rounded-full border border-gray-800 text-gray-500 hover:text-white hover:border-gray-600 transition-all"
                >
                    <XIcon className="w-3.5 h-3.5" />
                </button>
            </div>
            <div className="p-4 space-y-3 max-h-80 overflow-y-auto">
                {items.map(fu => (
                    <div
                        key={fu.id}
                        className={cn(
                            'p-3 rounded-xl border',
                            fu.type === 'call'
                                ? 'bg-green-500/5 border-green-500/20'
                                : 'bg-purple-500/5 border-purple-500/20'
                        )}
                    >
                        <div className="flex items-center gap-2 mb-1">
                            {fu.type === 'call' ? (
                                <PhoneIcon className="w-3.5 h-3.5 text-green-400 shrink-0" />
                            ) : (
                                <MapPinIcon className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                            )}
                            <span className={cn(
                                'text-[10px] font-black uppercase tracking-widest',
                                fu.type === 'call' ? 'text-green-400' : 'text-purple-400'
                            )}>
                                {fu.type === 'call' ? 'Phone Call' : 'Site Visit'}
                            </span>
                            <span className="ml-auto text-[10px] text-gray-500 font-mono">{fu.time}</span>
                        </div>
                        <p className="text-white font-bold text-xs truncate">{fu.project_name}</p>
                        <p className="text-gray-500 text-[10px] mt-0.5">{fu.stage}</p>
                        {fu.notes && (
                            <p className="text-gray-400 text-[11px] mt-2 leading-relaxed border-t border-gray-800 pt-2">
                                {fu.notes}
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    </div>
);

const EmployeeTimeoffPage: React.FC = () => {
    const page = PAGE_GROUPS.flatMap(g => g.pages).find(p => p.id === 'E-04');

    const [weatherAlerts, setWeatherAlerts] = useState<Record<string, WeatherAlert>>({});
    const [weatherLoading, setWeatherLoading] = useState(false);

    // Follow-ups from Firestore
    const [followUps, setFollowUps] = useState<FollowUp[]>([]);
    const [popupDate, setPopupDate] = useState<string | null>(null);

    // Calendar state
    const now = new Date();
    const [viewYear, setViewYear] = useState(now.getFullYear());
    const [viewMonth, setViewMonth] = useState(now.getMonth());

    const monthName = new Date(viewYear, viewMonth, 1).toLocaleString('default', { month: 'long' });
    const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Navigate months
    const prevMonth = () => {
        if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
        else setViewMonth(m => m - 1);
    };
    const nextMonth = () => {
        if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
        else setViewMonth(m => m + 1);
    };

    // Subscribe to follow-ups
    useEffect(() => {
        const unsub = firestoreService.subscribeToDocuments('followups', (data: any[]) => {
            setFollowUps(data as FollowUp[]);
        });
        return () => unsub();
    }, []);

    // Group follow-ups by date
    const followUpsByDate = React.useMemo(() => {
        const map: Record<string, FollowUp[]> = {};
        followUps.forEach(fu => {
            if (!map[fu.date]) map[fu.date] = [];
            map[fu.date].push(fu);
        });
        return map;
    }, [followUps]);

    const fetchForecast = useCallback(async () => {
        if (!GOOGLE_WEATHER_API_KEY) return;
        setWeatherLoading(true);
        try {
            const res = await fetch(
                `${WEATHER_BASE}/forecast/days:lookup?key=${GOOGLE_WEATHER_API_KEY}` +
                `&location.latitude=${DEFAULT_LAT}&location.longitude=${DEFAULT_LON}&days=7&unitsSystem=METRIC`
            );
            if (!res.ok) throw new Error('API error');
            const data = await res.json();

            const alerts: Record<string, WeatherAlert> = {};
            data.forecastDays?.forEach((d: any) => {
                const dateStr = `${d.displayDate.year}-${String(d.displayDate.month).padStart(2, '0')}-${String(d.displayDate.day).padStart(2, '0')}`;
                const cond = d.daytimeForecast?.weatherCondition?.type || 'CLEAR';
                const desc = d.daytimeForecast?.weatherCondition?.description?.text || '';
                const thunderProb = d.daytimeForecast?.thunderstormProbability ?? 0;
                const isStorm = STORM_TYPES.has(cond) || thunderProb >= 40;
                alerts[dateStr] = { date: dateStr, type: cond, description: desc, isStorm };
            });
            setWeatherAlerts(alerts);
        } catch (err) {
            console.error('Weather fetch failed:', err);
        } finally {
            setWeatherLoading(false);
        }
    }, []);

    useEffect(() => { fetchForecast(); }, [fetchForecast]);

    // Count upcoming follow-ups
    const todayStr = now.toISOString().slice(0, 10);
    const upcomingFollowUps = followUps
        .filter(fu => fu.date >= todayStr)
        .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
        .slice(0, 6);

    const popupItems = popupDate ? (followUpsByDate[popupDate] || []) : [];
    const popupDateLabel = popupDate
        ? new Date(popupDate + 'T12:00:00').toLocaleDateString('default', { weekday: 'long', month: 'long', day: 'numeric' })
        : '';

    return (
        <PageContainer title={page?.name || 'Calendar'} description="Track follow-up calls, site visits, time-off, and weather alerts.">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* ── Main Calendar ──────────────────────────────────────── */}
                <div className="lg:col-span-2">
                    <Card title="">
                        {/* Month nav */}
                        <div className="flex items-center justify-between mb-5">
                            <button
                                onClick={prevMonth}
                                className="w-8 h-8 rounded-lg border border-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:border-gray-600 transition-all"
                            >
                                ‹
                            </button>
                            <h3 className="text-white font-black text-lg uppercase tracking-widest">
                                {monthName} {viewYear}
                            </h3>
                            <button
                                onClick={nextMonth}
                                className="w-8 h-8 rounded-lg border border-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:border-gray-600 transition-all"
                            >
                                ›
                            </button>
                        </div>

                        {/* Day headers */}
                        <div className="grid grid-cols-7 text-center text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 pb-2 border-b border-gray-800">
                            {days.map(day => <div key={day}>{day}</div>)}
                        </div>

                        {/* Day cells */}
                        <div className="grid grid-cols-7 gap-1">
                            {/* Empty offset slots */}
                            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                                <div key={`empty-${i}`} className="h-20 bg-gray-950/20 border border-gray-900/20 rounded-lg" />
                            ))}

                            {Array.from({ length: daysInMonth }).map((_, i) => {
                                const dayNum = i + 1;
                                const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                                const alert = weatherAlerts[dateStr];
                                const dayFollowUps = followUpsByDate[dateStr] || [];
                                const isToday = dateStr === todayStr;
                                const hasCalls = dayFollowUps.some(f => f.type === 'call');
                                const hasVisits = dayFollowUps.some(f => f.type === 'visit');

                                return (
                                    <div
                                        key={dayNum}
                                        onClick={() => dayFollowUps.length > 0 && setPopupDate(dateStr)}
                                        className={cn(
                                            'h-20 p-1.5 rounded-lg border transition-all duration-300 relative group flex flex-col',
                                            isToday
                                                ? 'bg-[#ec028b]/5 border-[#ec028b]/40 shadow-[0_0_12px_rgba(236,2,139,0.1)]'
                                                : 'bg-gray-900/40 border-gray-800/40 hover:border-gray-700',
                                            alert?.isStorm ? 'border-orange-500/40 bg-orange-500/5' : '',
                                            dayFollowUps.length > 0 ? 'cursor-pointer hover:border-purple-500/50 hover:shadow-[0_0_10px_rgba(168,85,247,0.15)]' : ''
                                        )}
                                    >
                                        {/* Day number */}
                                        <div className="flex justify-between items-start mb-1">
                                            <span className={cn(
                                                'text-xs font-bold leading-none',
                                                isToday ? 'text-[#ec028b]' : 'text-gray-400'
                                            )}>
                                                {dayNum}
                                            </span>
                                            {isToday && (
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#ec028b] animate-pulse" />
                                            )}
                                        </div>

                                        {/* Follow-up badges */}
                                        <div className="flex flex-col gap-0.5 flex-1 overflow-hidden">
                                            {hasCalls && (
                                                <div className="flex items-center gap-0.5 bg-green-500/15 border border-green-500/25 rounded px-1 py-0.5">
                                                    <PhoneIcon className="w-2.5 h-2.5 text-green-400 shrink-0" />
                                                    <span className="text-[8px] font-bold text-green-300 uppercase truncate">
                                                        {dayFollowUps.filter(f => f.type === 'call').length}× Call
                                                    </span>
                                                </div>
                                            )}
                                            {hasVisits && (
                                                <div className="flex items-center gap-0.5 bg-purple-500/15 border border-purple-500/25 rounded px-1 py-0.5">
                                                    <MapPinIcon className="w-2.5 h-2.5 text-purple-400 shrink-0" />
                                                    <span className="text-[8px] font-bold text-purple-300 uppercase truncate">
                                                        {dayFollowUps.filter(f => f.type === 'visit').length}× Visit
                                                    </span>
                                                </div>
                                            )}

                                            {/* Weather */}
                                            {alert && !hasCalls && !hasVisits && (
                                                <div className="mt-auto">
                                                    {alert.isStorm ? (
                                                        <div className="bg-orange-500/20 border border-orange-500/30 rounded p-0.5 flex items-center gap-0.5">
                                                            <BoltIcon className="w-2.5 h-2.5 text-orange-400" />
                                                            <span className="text-[7px] font-bold text-orange-200 uppercase truncate">Storm</span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-[9px] opacity-40">
                                                            {alert.type === 'CLEAR' ? '☀️' : alert.type.includes('CLOUD') ? '⛅' : '☁️'}
                                                        </span>
                                                    )}
                                                </div>
                                            )}

                                            {/* Weather also visible when there are follow-ups */}
                                            {alert?.isStorm && (hasCalls || hasVisits) && (
                                                <div className="flex items-center gap-0.5 mt-auto">
                                                    <BoltIcon className="w-2.5 h-2.5 text-orange-400" />
                                                    <span className="text-[7px] text-orange-400 font-bold">Storm</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Hover tooltip overlay for storm on follow-up day */}
                                        {alert?.isStorm && dayFollowUps.length > 0 && (
                                            <div className="absolute inset-0 bg-black/90 opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-center items-center z-10 rounded-lg pointer-events-none">
                                                <BoltIcon className="w-4 h-4 text-orange-500 mb-1" />
                                                <p className="text-[8px] font-bold text-orange-400 uppercase text-center">Storm Warning</p>
                                                <p className="text-[7px] text-gray-400 text-center mt-0.5">{dayFollowUps.length} follow-up{dayFollowUps.length > 1 ? 's' : ''} scheduled</p>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </Card>
                </div>

                {/* ── Sidebar ────────────────────────────────────────────── */}
                <div className="space-y-5">

                    {/* Legend */}
                    <Card title="Calendar Legend">
                        <div className="space-y-2">
                            <div className="flex items-center gap-3 p-2 bg-gray-900/50 rounded-lg border border-gray-800">
                                <div className="w-3 h-3 rounded bg-[#ec028b] shrink-0" />
                                <span className="text-xs text-gray-300">Today</span>
                            </div>
                            <div className="flex items-center gap-3 p-2 bg-green-900/20 rounded-lg border border-green-500/20">
                                <PhoneIcon className="w-3 h-3 text-green-400 shrink-0" />
                                <span className="text-xs text-gray-300">Follow-Up Call</span>
                            </div>
                            <div className="flex items-center gap-3 p-2 bg-purple-900/20 rounded-lg border border-purple-500/20">
                                <MapPinIcon className="w-3 h-3 text-purple-400 shrink-0" />
                                <span className="text-xs text-gray-300">Site Visit</span>
                            </div>
                            <div className="flex items-center gap-3 p-2 bg-orange-900/20 rounded-lg border border-orange-500/20">
                                <BoltIcon className="w-3 h-3 text-orange-400 shrink-0" />
                                <span className="text-xs text-gray-300">Storm Forecast</span>
                            </div>
                        </div>
                    </Card>

                    {/* Upcoming Follow-Ups */}
                    <Card title="Upcoming Follow-Ups">
                        {upcomingFollowUps.length === 0 ? (
                            <div className="text-center py-6">
                                <CalendarDaysIcon className="w-8 h-8 mx-auto text-gray-700 mb-2" />
                                <p className="text-gray-600 text-xs">No upcoming follow-ups.</p>
                                <p className="text-gray-700 text-[11px] mt-1">Schedule one from any pipeline record.</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {upcomingFollowUps.map(fu => (
                                    <div
                                        key={fu.id}
                                        className={cn(
                                            'p-3 rounded-xl border group',
                                            fu.type === 'call'
                                                ? 'bg-green-500/5 border-green-500/15 hover:border-green-500/30'
                                                : 'bg-purple-500/5 border-purple-500/15 hover:border-purple-500/30'
                                        )}
                                    >
                                        <div className="flex items-center gap-2 mb-1">
                                            {fu.type === 'call' ? (
                                                <PhoneIcon className="w-3 h-3 text-green-400 shrink-0" />
                                            ) : (
                                                <MapPinIcon className="w-3 h-3 text-purple-400 shrink-0" />
                                            )}
                                            <span className={cn(
                                                'text-[9px] font-black uppercase tracking-widest',
                                                fu.type === 'call' ? 'text-green-400' : 'text-purple-400'
                                            )}>
                                                {fu.type === 'call' ? 'Call' : 'Visit'}
                                            </span>
                                            <span className="ml-auto text-[9px] text-gray-600 font-mono flex items-center gap-0.5">
                                                <ClockIcon className="w-2.5 h-2.5" />
                                                {fu.time}
                                            </span>
                                        </div>
                                        <p className="text-white text-xs font-bold truncate">{fu.project_name}</p>
                                        <p className="text-gray-600 text-[10px] mt-0.5">
                                            {new Date(fu.date + 'T12:00:00').toLocaleDateString('default', {
                                                weekday: 'short', month: 'short', day: 'numeric'
                                            })}
                                            {' · '}{fu.stage}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>

                    {/* Balances */}
                    <Card title="Your Balances">
                        <div className="space-y-2">
                            <div className="flex justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-800">
                                <span className="text-gray-300 text-xs">Paid Time Off (PTO)</span>
                                <span className="font-bold text-white text-xs">80 hours</span>
                            </div>
                            <div className="flex justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-800">
                                <span className="text-gray-300 text-xs">Holidays</span>
                                <span className="font-bold text-white text-xs">5 days</span>
                            </div>
                        </div>
                    </Card>

                    <Button size="lg" className="w-full bg-[#ec028b] hover:bg-[#c00270] shadow-[0_0_20px_rgba(236,2,139,0.3)]">
                        <CalendarDaysIcon className="w-5 h-5 mr-2" />
                        Request Time Off
                    </Button>
                </div>
            </div>

            {/* Follow-up detail popup */}
            {popupDate && popupItems.length > 0 && (
                <FollowUpPopup
                    items={popupItems}
                    dateLabel={popupDateLabel}
                    onClose={() => setPopupDate(null)}
                />
            )}
        </PageContainer>
    );
};

export default EmployeeTimeoffPage;