import React, { useState, useEffect, useCallback } from 'react';
import PageContainer from '../components/PageContainer';
import Card from '../components/Card';
import Button from '../components/Button';
import { CalendarDaysIcon, BoltIcon, PhoneIcon, MapPinIcon, ClockIcon, XIcon, PlusIcon, ArrowPathIcon, TrashIcon } from '../components/icons';
import { PAGE_GROUPS } from '../constants';
import { firestoreService } from '../lib/firebaseService';
import { cn } from '../lib/utils';
import { useMockDB } from '../contexts/MockDatabaseContext';
import {
    getUserCalendarEvents,
    syncUserGoogleCalendar,
    createRhiveEvent,
    deleteCalendarEvent,
    type RhiveCalendarEvent,
    type CreateEventPayload,
} from '../services/googleCalendarService';

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

// ─── Add Event Modal ──────────────────────────────────────────────────────────
interface AddEventModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (payload: CreateEventPayload) => Promise<void>;
    prefillDate?: string;
}

const toLocalInput = (d: Date) => {
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const AddEventModal: React.FC<AddEventModalProps> = ({ isOpen, onClose, onAdd, prefillDate }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [startDT, setStartDT] = useState('');
    const [endDT, setEndDT] = useState('');
    const [isAllDay, setIsAllDay] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!isOpen) return;
        const base = prefillDate ? new Date(prefillDate + 'T09:00') : (() => { const d = new Date(); d.setHours(d.getHours()+1, 0, 0, 0); return d; })();
        const end = new Date(base); end.setHours(end.getHours() + 1);
        setStartDT(toLocalInput(base));
        setEndDT(toLocalInput(end));
        setTitle(''); setDescription(''); setLocation(''); setIsAllDay(false); setError('');
    }, [isOpen, prefillDate]);

    const handleSubmit = async () => {
        if (!title.trim()) { setError('Title is required.'); return; }
        setSaving(true); setError('');
        try {
            await onAdd({
                title: title.trim(),
                description,
                location,
                startDateTime: new Date(startDT).toISOString(),
                endDateTime: new Date(endDT).toISOString(),
                isAllDay,
                color: '#ec028b',
            });
            onClose();
        } catch (e: any) {
            setError(e.message || 'Failed to save event.');
        } finally {
            setSaving(false);
        }
    };

    if (!isOpen) return null;

    const inputCls = 'w-full bg-black/60 border border-gray-700 focus:border-[#ec028b] text-white text-sm px-3 py-2.5 rounded-lg outline-none transition-colors placeholder:text-gray-600';

    return (
        <div className="fixed inset-0 z-[400] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
            <div className="relative z-10 w-full max-w-md bg-[#080808] border border-gray-800 rounded-2xl shadow-[0_0_60px_rgba(236,2,139,0.15)] overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#ec028b] to-transparent" />
                <div className="flex items-center justify-between p-5 border-b border-gray-800">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#ec028b]/10 rounded-lg border border-[#ec028b]/20">
                            <CalendarDaysIcon className="w-4 h-4 text-[#ec028b]" />
                        </div>
                        <h2 className="text-base font-black uppercase tracking-widest text-white">Add Event</h2>
                    </div>
                    <button onClick={onClose} className="text-gray-600 hover:text-white transition-colors">
                        <XIcon className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-5 space-y-4">
                    <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1.5 block">Event Title *</label>
                        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Site Inspection · 1927 Thompson St" className={inputCls} autoFocus />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-900/60 rounded-lg border border-gray-800">
                        <span className="text-xs font-bold text-white">All Day</span>
                        <button
                            type="button"
                            onClick={() => setIsAllDay(v => !v)}
                            className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${isAllDay ? 'bg-[#ec028b]' : 'bg-gray-700'}`}
                        >
                            <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-200 ${isAllDay ? 'left-5' : 'left-0.5'}`} />
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1.5 block">Start</label>
                            <input type={isAllDay ? 'date' : 'datetime-local'} value={isAllDay ? startDT.split('T')[0] : startDT} onChange={e => setStartDT(e.target.value)} className={inputCls} />
                        </div>
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1.5 block">End</label>
                            <input type={isAllDay ? 'date' : 'datetime-local'} value={isAllDay ? endDT.split('T')[0] : endDT} onChange={e => setEndDT(e.target.value)} className={inputCls} />
                        </div>
                    </div>

                    <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1.5 block">Location</label>
                        <input value={location} onChange={e => setLocation(e.target.value)} placeholder="Address or video link" className={inputCls} />
                    </div>

                    <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1.5 block">Notes</label>
                        <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Agenda, project details..." rows={2} className={`${inputCls} resize-none`} />
                    </div>

                    {error && <p className="text-[#ec028b] text-xs font-bold">{error}</p>}

                    <div className="flex gap-3 pt-1">
                        <button onClick={onClose} className="flex-1 h-10 text-xs font-black uppercase tracking-widest text-gray-500 rounded-lg border border-gray-800 hover:border-gray-600 transition-colors">
                            Cancel
                        </button>
                        <button onClick={handleSubmit} disabled={saving} className="flex-1 h-10 text-xs font-black uppercase tracking-widest text-white bg-[#ec028b] hover:bg-pink-600 disabled:opacity-50 rounded-lg transition-colors flex items-center justify-center gap-2">
                            {saving ? <ArrowPathIcon className="w-4 h-4 animate-spin" /> : <PlusIcon className="w-4 h-4" />}
                            {saving ? 'Saving…' : 'Add Event'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── Event detail popup ───────────────────────────────────────────────────────
const EventDetailPopup: React.FC<{
    event: RhiveCalendarEvent;
    onClose: () => void;
    onDelete: (event: RhiveCalendarEvent) => void;
}> = ({ event, onClose, onDelete }) => {
    const fmtTime = (iso: string) => iso ? new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
    const fmtDate = (iso: string) => iso ? new Date(iso).toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' }) : '';
    return (
        <div className="fixed inset-0 z-[350] flex items-center justify-center p-4" onClick={onClose}>
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
            <div className="relative z-10 w-full max-w-sm bg-[#080808] border border-gray-800 rounded-2xl shadow-[0_0_40px_rgba(236,2,139,0.1)] overflow-hidden" onClick={e => e.stopPropagation()}>
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#ec028b] to-transparent" />
                <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: event.color || '#ec028b' }} />
                            <h3 className="text-sm font-bold text-white">{event.title}</h3>
                        </div>
                        <button onClick={onClose} className="text-gray-600 hover:text-white ml-2 shrink-0"><XIcon className="w-4 h-4" /></button>
                    </div>
                    <div className="space-y-1.5 text-xs text-gray-400">
                        <div className="flex items-center gap-2">
                            <ClockIcon className="w-3.5 h-3.5 text-[#ec028b] shrink-0" />
                            <span>
                                {event.isAllDay
                                    ? `All day · ${fmtDate(event.startDateTime)}`
                                    : `${fmtDate(event.startDateTime)} · ${fmtTime(event.startDateTime)} – ${fmtTime(event.endDateTime)}`}
                            </span>
                        </div>
                        {event.location && (
                            <div className="flex items-center gap-2">
                                <MapPinIcon className="w-3.5 h-3.5 text-[#ec028b] shrink-0" />
                                <span className="truncate">{event.location}</span>
                            </div>
                        )}
                        {event.description && <p className="text-gray-500 text-[11px] border-t border-gray-800 pt-2 mt-2">{event.description}</p>}
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-800">
                        <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${event.source === 'google' ? 'text-pink-400 bg-[#ec028b]/10 border-[#ec028b]/20' : 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20'}`}>
                            {event.source === 'google' ? '⚡ Google' : '◈ RHIVE'}
                        </span>
                        <button onClick={() => { onDelete(event); onClose(); }} className="text-gray-700 hover:text-red-400 transition-colors">
                            <TrashIcon className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const EmployeeTimeoffPage: React.FC = () => {
    const page = PAGE_GROUPS.flatMap(g => g.pages).find(p => p.id === 'E-04');
    const { currentUser } = useMockDB();

    const [weatherAlerts, setWeatherAlerts] = useState<Record<string, WeatherAlert>>({});
    const [weatherLoading, setWeatherLoading] = useState(false);

    // Follow-ups from Firestore
    const [followUps, setFollowUps] = useState<FollowUp[]>([]);
    const [popupDate, setPopupDate] = useState<string | null>(null);

    // Google Calendar events
    const [gcalEvents, setGcalEvents] = useState<RhiveCalendarEvent[]>([]);
    const [gcalLoading, setGcalLoading] = useState(false);
    const [syncing, setSyncing] = useState(false);
    const [syncMsg, setSyncMsg] = useState<{ text: string; ok: boolean } | null>(null);
    const [selectedEvent, setSelectedEvent] = useState<RhiveCalendarEvent | null>(null);

    // Add event modal
    const [showAddModal, setShowAddModal] = useState(false);
    const [prefillDate, setPrefillDate] = useState<string>('');

    // Calendar nav state
    const now = new Date();
    const [viewYear, setViewYear] = useState(now.getFullYear());
    const [viewMonth, setViewMonth] = useState(now.getMonth());

    const monthName = new Date(viewYear, viewMonth, 1).toLocaleString('default', { month: 'long' });
    const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const todayStr = now.toISOString().slice(0, 10);

    const isAlreadySynced = !!(currentUser as any)?.googleCalendarLinked;

    // Navigate months
    const prevMonth = () => { if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); } else setViewMonth(m => m - 1); };
    const nextMonth = () => { if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); } else setViewMonth(m => m + 1); };

    // Subscribe to follow-ups
    useEffect(() => {
        const unsub = firestoreService.subscribeToDocuments('followups', (data: any[]) => {
            setFollowUps(data as FollowUp[]);
        });
        return () => unsub();
    }, []);

    // Load Google Calendar events from Firestore on mount
    useEffect(() => {
        if (!currentUser?.id) return;
        setGcalLoading(true);
        getUserCalendarEvents(currentUser.id).then(evs => {
            setGcalEvents(evs);
            setGcalLoading(false);
        });
    }, [currentUser?.id]);

    // Group follow-ups by date
    const followUpsByDate = React.useMemo(() => {
        const map: Record<string, FollowUp[]> = {};
        followUps.forEach(fu => { if (!map[fu.date]) map[fu.date] = []; map[fu.date].push(fu); });
        return map;
    }, [followUps]);

    // Group Google Calendar events by date
    const gcalByDate = React.useMemo(() => {
        const map: Record<string, RhiveCalendarEvent[]> = {};
        gcalEvents.forEach(ev => {
            const dateStr = ev.startDateTime.split('T')[0];
            if (!map[dateStr]) map[dateStr] = [];
            map[dateStr].push(ev);
        });
        return map;
    }, [gcalEvents]);

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

    // Google Calendar sync
    const handleSync = async () => {
        if (!currentUser) return;
        setSyncing(true); setSyncMsg(null);
        try {
            const result = await syncUserGoogleCalendar(currentUser.id, currentUser.email || '');
            if (result.success) {
                setGcalEvents(result.events);
                setSyncMsg({ text: `✓ Synced ${result.eventsCount} events from Google Calendar`, ok: true });
            } else {
                setSyncMsg({ text: result.error || 'Sync failed.', ok: false });
            }
        } catch (e: any) {
            setSyncMsg({ text: e.message || 'Unexpected error.', ok: false });
        } finally {
            setSyncing(false);
            setTimeout(() => setSyncMsg(null), 6000);
        }
    };

    // Add event (RHIVE-native, stored in Firestore)
    const handleAddEvent = async (payload: CreateEventPayload) => {
        if (!currentUser) return;
        const newEvent = await createRhiveEvent(currentUser.id, currentUser.email || '', payload);
        if (newEvent) {
            setGcalEvents(prev => [...prev, newEvent].sort((a, b) => a.startDateTime.localeCompare(b.startDateTime)));
        }
    };

    // Delete event
    const handleDeleteEvent = async (event: RhiveCalendarEvent) => {
        await deleteCalendarEvent(event.id);
        setGcalEvents(prev => prev.filter(e => e.id !== event.id));
    };

    const upcomingFollowUps = followUps
        .filter(fu => fu.date >= todayStr)
        .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
        .slice(0, 6);

    const popupItems = popupDate ? (followUpsByDate[popupDate] || []) : [];
    const popupDateLabel = popupDate
        ? new Date(popupDate + 'T12:00:00').toLocaleDateString('default', { weekday: 'long', month: 'long', day: 'numeric' })
        : '';

    return (
        <PageContainer title={page?.name || 'Calendar'} description="Track follow-up calls, site visits, time-off, and Google Calendar events.">

            {/* ── Google Calendar Sync Banner ─────────────────────────── */}
            <div className="mb-5 p-4 bg-gray-900/50 border border-gray-800 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <CalendarDaysIcon className="w-5 h-5 text-[#ec028b] shrink-0" />
                    <div>
                        <p className="text-sm font-bold text-white">Google Calendar</p>
                        <p className="text-[11px] text-gray-500">
                            {isAlreadySynced
                                ? `Synced · ${gcalEvents.filter(e => e.source === 'google').length} Google events loaded`
                                : 'Connect your Google Calendar to import events onto this calendar'}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                    {syncMsg && (
                        <p className={`text-[11px] font-bold ${syncMsg.ok ? 'text-green-400' : 'text-red-400'}`}>{syncMsg.text}</p>
                    )}
                    {/* Sync button — hidden when already synced */}
                    {!isAlreadySynced && (
                        <button
                            onClick={handleSync}
                            disabled={syncing}
                            className="flex items-center gap-2 px-4 h-9 text-[11px] font-black uppercase tracking-widest border border-gray-700 text-gray-400 hover:border-[#ec028b] hover:text-[#ec028b] disabled:opacity-40 rounded-lg transition-all"
                        >
                            <ArrowPathIcon className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
                            {syncing ? 'Syncing…' : 'Connect Google Calendar'}
                        </button>
                    )}
                    {isAlreadySynced && (
                        <button
                            onClick={handleSync}
                            disabled={syncing}
                            className="flex items-center gap-2 px-3 h-8 text-[10px] font-black uppercase tracking-widest border border-gray-800 text-gray-600 hover:border-gray-600 hover:text-gray-400 disabled:opacity-40 rounded-lg transition-all"
                        >
                            <ArrowPathIcon className={`w-3 h-3 ${syncing ? 'animate-spin' : ''}`} />
                            {syncing ? '…' : 'Re-sync'}
                        </button>
                    )}
                    <button
                        onClick={() => { setPrefillDate(''); setShowAddModal(true); }}
                        className="flex items-center gap-2 px-4 h-9 text-[11px] font-black uppercase tracking-widest bg-[#ec028b] text-white hover:bg-pink-600 rounded-lg transition-colors shadow-[0_0_12px_rgba(236,2,139,0.3)]"
                    >
                        <PlusIcon className="w-3.5 h-3.5" />
                        Add Event
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* ── Main Calendar ──────────────────────────────────────── */}
                <div className="lg:col-span-2">
                    <Card title="">
                        {/* Month nav */}
                        <div className="flex items-center justify-between mb-5">
                            <button onClick={prevMonth} className="w-8 h-8 rounded-lg border border-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:border-gray-600 transition-all">‹</button>
                            <h3 className="text-white font-black text-lg uppercase tracking-widest">{monthName} {viewYear}</h3>
                            <button onClick={nextMonth} className="w-8 h-8 rounded-lg border border-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:border-gray-600 transition-all">›</button>
                        </div>

                        {/* Day headers */}
                        <div className="grid grid-cols-7 text-center text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 pb-2 border-b border-gray-800">
                            {days.map(day => <div key={day}>{day}</div>)}
                        </div>

                        {/* Day cells */}
                        <div className="grid grid-cols-7 gap-1">
                            {/* Empty offset slots */}
                            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                                <div key={`empty-${i}`} className="h-24 bg-gray-950/20 border border-gray-900/20 rounded-lg" />
                            ))}

                            {Array.from({ length: daysInMonth }).map((_, i) => {
                                const dayNum = i + 1;
                                const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                                const alert = weatherAlerts[dateStr];
                                const dayFollowUps = followUpsByDate[dateStr] || [];
                                const dayGcal = gcalByDate[dateStr] || [];
                                const isToday = dateStr === todayStr;
                                const hasCalls = dayFollowUps.some(f => f.type === 'call');
                                const hasVisits = dayFollowUps.some(f => f.type === 'visit');
                                const hasGcal = dayGcal.length > 0;

                                return (
                                    <div
                                        key={dayNum}
                                        onClick={() => {
                                            if (dayFollowUps.length > 0 && dayGcal.length === 0) {
                                                setPopupDate(dateStr);
                                            } else if (dayGcal.length > 0 && dayFollowUps.length === 0) {
                                                setSelectedEvent(dayGcal[0]);
                                            } else if (dayGcal.length === 0 && dayFollowUps.length === 0) {
                                                setPrefillDate(dateStr);
                                                setShowAddModal(true);
                                            } else if (dayFollowUps.length > 0) {
                                                setPopupDate(dateStr);
                                            }
                                        }}
                                        className={cn(
                                            'h-24 p-1.5 rounded-lg border transition-all duration-300 relative group flex flex-col cursor-pointer',
                                            isToday
                                                ? 'bg-[#ec028b]/5 border-[#ec028b]/40 shadow-[0_0_12px_rgba(236,2,139,0.1)]'
                                                : 'bg-gray-900/40 border-gray-800/40 hover:border-gray-700',
                                            alert?.isStorm ? 'border-orange-500/40 bg-orange-500/5' : '',
                                        )}
                                    >
                                        {/* Day number */}
                                        <div className="flex justify-between items-start mb-1">
                                            <span className={cn('text-xs font-bold leading-none', isToday ? 'text-[#ec028b]' : 'text-gray-400')}>
                                                {dayNum}
                                            </span>
                                            {isToday && <div className="w-1.5 h-1.5 rounded-full bg-[#ec028b] animate-pulse" />}
                                        </div>

                                        <div className="flex flex-col gap-0.5 flex-1 overflow-hidden">
                                            {/* Google Calendar events */}
                                            {dayGcal.slice(0, 2).map((ev, ei) => (
                                                <div
                                                    key={ei}
                                                    onClick={e => { e.stopPropagation(); setSelectedEvent(ev); }}
                                                    className={`flex items-center gap-0.5 rounded px-1 py-0.5 cursor-pointer ${ev.source === 'google' ? 'bg-[#ec028b]/15 border border-[#ec028b]/25' : 'bg-yellow-500/15 border border-yellow-500/25'}`}
                                                >
                                                    <span className={`text-[7px] font-bold uppercase truncate ${ev.source === 'google' ? 'text-pink-300' : 'text-yellow-300'}`}>
                                                        {!ev.isAllDay && `${new Date(ev.startDateTime).getHours() % 12 || 12}${new Date(ev.startDateTime).getHours() >= 12 ? 'p' : 'a'} `}
                                                        {ev.title}
                                                    </span>
                                                </div>
                                            ))}
                                            {dayGcal.length > 2 && (
                                                <span className="text-[8px] text-gray-600 font-bold px-1">+{dayGcal.length - 2} more</span>
                                            )}

                                            {/* Follow-up badges */}
                                            {hasCalls && (
                                                <div className="flex items-center gap-0.5 bg-green-500/15 border border-green-500/25 rounded px-1 py-0.5">
                                                    <PhoneIcon className="w-2.5 h-2.5 text-green-400 shrink-0" />
                                                    <span className="text-[7px] font-bold text-green-300 uppercase truncate">
                                                        {dayFollowUps.filter(f => f.type === 'call').length}× Call
                                                    </span>
                                                </div>
                                            )}
                                            {hasVisits && (
                                                <div className="flex items-center gap-0.5 bg-purple-500/15 border border-purple-500/25 rounded px-1 py-0.5">
                                                    <MapPinIcon className="w-2.5 h-2.5 text-purple-400 shrink-0" />
                                                    <span className="text-[7px] font-bold text-purple-300 uppercase truncate">
                                                        {dayFollowUps.filter(f => f.type === 'visit').length}× Visit
                                                    </span>
                                                </div>
                                            )}

                                            {/* Weather */}
                                            {alert?.isStorm && (
                                                <div className="flex items-center gap-0.5 mt-auto">
                                                    <BoltIcon className="w-2.5 h-2.5 text-orange-400" />
                                                    <span className="text-[7px] text-orange-400 font-bold">Storm</span>
                                                </div>
                                            )}
                                            {alert && !alert.isStorm && !hasCalls && !hasVisits && !hasGcal && (
                                                <span className="text-[9px] opacity-40 mt-auto">
                                                    {alert.type === 'CLEAR' ? '☀️' : alert.type.includes('CLOUD') ? '⛅' : '☁️'}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* ── Inline Legend below calendar grid ── */}
                        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-5 pt-4 border-t border-gray-800">
                            <div className="flex items-center gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-sm bg-[#ec028b] shrink-0" />
                                <span className="text-[10px] font-bold text-gray-500">Today</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-sm bg-[#ec028b]/40 border border-[#ec028b]/50 shrink-0" />
                                <span className="text-[10px] font-bold text-gray-500">Google Event</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-sm bg-yellow-500/40 border border-yellow-500/50 shrink-0" />
                                <span className="text-[10px] font-bold text-gray-500">RHIVE Event</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <PhoneIcon className="w-2.5 h-2.5 text-green-400 shrink-0" />
                                <span className="text-[10px] font-bold text-gray-500">Follow-Up Call</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <MapPinIcon className="w-2.5 h-2.5 text-purple-400 shrink-0" />
                                <span className="text-[10px] font-bold text-gray-500">Site Visit</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <BoltIcon className="w-2.5 h-2.5 text-orange-400 shrink-0" />
                                <span className="text-[10px] font-bold text-gray-500">Storm</span>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* ── Sidebar ────────────────────────────────────────────── */}
                <div className="space-y-5">

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
                                            'p-3 rounded-xl border',
                                            fu.type === 'call' ? 'bg-green-500/5 border-green-500/15' : 'bg-purple-500/5 border-purple-500/15'
                                        )}
                                    >
                                        <div className="flex items-center gap-2 mb-1">
                                            {fu.type === 'call' ? <PhoneIcon className="w-3 h-3 text-green-400 shrink-0" /> : <MapPinIcon className="w-3 h-3 text-purple-400 shrink-0" />}
                                            <span className={cn('text-[9px] font-black uppercase tracking-widest', fu.type === 'call' ? 'text-green-400' : 'text-purple-400')}>
                                                {fu.type === 'call' ? 'Call' : 'Visit'}
                                            </span>
                                            <span className="ml-auto text-[9px] text-gray-600 font-mono flex items-center gap-0.5">
                                                <ClockIcon className="w-2.5 h-2.5" />{fu.time}
                                            </span>
                                        </div>
                                        <p className="text-white text-xs font-bold truncate">{fu.project_name}</p>
                                        <p className="text-gray-600 text-[10px] mt-0.5">
                                            {new Date(fu.date + 'T12:00:00').toLocaleDateString('default', { weekday: 'short', month: 'short', day: 'numeric' })} · {fu.stage}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
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

            {/* Google Calendar event detail */}
            {selectedEvent && (
                <EventDetailPopup
                    event={selectedEvent}
                    onClose={() => setSelectedEvent(null)}
                    onDelete={handleDeleteEvent}
                />
            )}

            {/* Add Event modal */}
            <AddEventModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                onAdd={handleAddEvent}
                prefillDate={prefillDate}
            />
        </PageContainer>
    );
};

export default EmployeeTimeoffPage;