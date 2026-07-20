import React, { useState, useEffect, useCallback, useRef } from 'react';
import PageContainer from '../components/PageContainer';
import Card from '../components/Card';
import Button from '../components/Button';
import { CalendarDaysIcon, BoltIcon, PhoneIcon, MapPinIcon, ClockIcon, XIcon, PlusIcon, ArrowPathIcon, TrashIcon, PencilIcon } from '../components/icons';
import { PAGE_GROUPS } from '../constants';
import { firestoreService } from '../lib/firebaseService';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { cn } from '../lib/utils';
import { useMockDB } from '../contexts/MockDatabaseContext';
import { useNotifications } from '../contexts/NotificationContext';
import {
    getUserCalendarEvents,
    syncUserGoogleCalendar,
    createRhiveEvent,
    createGoogleCalendarEvent,
    requestGoogleAccessToken,
    deleteCalendarEvent,
    fetchGoogleCalendarEvents,
    type RhiveCalendarEvent,
    type CreateEventPayload,
} from '../services/googleCalendarService';

// --- Weather Config ---
const GOOGLE_WEATHER_API_KEY = (import.meta as any).env?.VITE_GOOGLE_WEATHER_API_KEY || '';
const WEATHER_BASE = 'https://weather.googleapis.com/v1';
const DEFAULT_LAT = 39.7392;
const DEFAULT_LON = -104.9903;
const BIDI_POLL_MS = 5 * 60 * 1000; // 5 min bidirectional poll interval

interface WeatherAlert { date: string; type: string; description: string; isStorm: boolean; }
interface FollowUp {
    id: string; project_id: string; project_name: string;
    type: 'call' | 'visit'; date: string; time: string; notes: string; stage: string;
}

const STORM_TYPES = new Set([
    'THUNDERSTORM', 'TORNADO', 'HEAVY_RAIN', 'HAIL', 'FREEZING_RAIN',
    'HEAVY_SNOW', 'SLEET', 'SHOWERS', 'SCATTERED_SHOWERS',
]);

// ─── Custom Time Picker ────────────────────────────────────────────────────────
interface TimePickerProps { value: string; onChange: (val: string) => void; }
const HOURS = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
const MINUTES = ['00', '15', '30', '45'];

const TimePicker: React.FC<TimePickerProps> = ({ value, onChange }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const [selH, selM, selP] = React.useMemo(() => {
        if (!value) return ['09', '00', 'AM'];
        const [h, m] = value.split(':').map(Number);
        const period = h >= 12 ? 'PM' : 'AM';
        const hour12 = h === 0 ? '12' : h > 12 ? String(h - 12).padStart(2, '0') : String(h).padStart(2, '0');
        return [hour12, String(m).padStart(2, '0'), period];
    }, [value]);

    const commit = (h: string, m: string, p: string) => {
        let h24 = parseInt(h, 10);
        if (p === 'AM' && h24 === 12) h24 = 0;
        if (p === 'PM' && h24 !== 12) h24 += 12;
        onChange(`${String(h24).padStart(2, '0')}:${m}`);
    };

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    return (
        <div ref={ref} className="relative">
            <button
                type="button"
                onClick={() => setOpen(v => !v)}
                className="w-full flex items-center gap-2 bg-black/60 border border-gray-700 focus-within:border-[#ec028b] text-white text-sm px-3 h-10 rounded-lg hover:border-gray-600 transition-colors"
            >
                <ClockIcon className="w-3.5 h-3.5 text-[#ec028b] shrink-0" />
                <span className="font-mono">{selH}:{selM} {selP}</span>
            </button>
            {open && (
                <div className="absolute z-50 top-full mt-1 left-0 bg-[#0a0a0a] border border-gray-700 rounded-xl shadow-2xl p-3 min-w-[220px]">
                    {/* AM / PM */}
                    <div className="flex gap-2 mb-3">
                        {['AM', 'PM'].map(p => (
                            <button key={p} type="button" onClick={() => { commit(selH, selM, p); }}
                                className={`flex-1 h-8 text-xs font-black uppercase rounded-lg transition-colors ${selP === p ? 'bg-[#ec028b] text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
                                {p}
                            </button>
                        ))}
                    </div>
                    {/* Hours */}
                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-600 mb-1.5">Hour</p>
                    <div className="grid grid-cols-6 gap-1 mb-3">
                        {HOURS.map(h => (
                            <button key={h} type="button" onClick={() => { commit(h, selM, selP); }}
                                className={`h-8 text-xs font-bold rounded-lg transition-colors ${selH === h ? 'bg-[#ec028b] text-white shadow-[0_0_8px_rgba(236,2,139,0.4)]' : 'bg-gray-800/80 text-gray-300 hover:bg-gray-700'}`}>
                                {h}
                            </button>
                        ))}
                    </div>
                    {/* Minutes */}
                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-600 mb-1.5">Minute</p>
                    <div className="grid grid-cols-4 gap-1">
                        {MINUTES.map(m => (
                            <button key={m} type="button" onClick={() => { commit(selH, m, selP); setOpen(false); }}
                                className={`h-8 text-xs font-bold rounded-lg transition-colors ${selM === m ? 'bg-[#ec028b] text-white shadow-[0_0_8px_rgba(236,2,139,0.4)]' : 'bg-gray-800/80 text-gray-300 hover:bg-gray-700'}`}>
                                :{m}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

// ─── Follow-up popup ──────────────────────────────────────────────────────────
const FollowUpPopup: React.FC<{ items: FollowUp[]; onClose: () => void; dateLabel: string }> = ({ items, onClose, dateLabel }) => (
    <div className="fixed inset-0 z-[300] flex items-center justify-center" onClick={onClose}>
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
        <div className="relative z-10 w-full max-w-sm mx-4 bg-[#080808] border border-gray-800 rounded-2xl shadow-[0_0_60px_rgba(168,85,247,0.15)] overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
                <div>
                    <p className="text-[10px] text-purple-400 font-black uppercase tracking-widest mb-0.5">Follow-Ups</p>
                    <h3 className="text-white font-bold text-sm">{dateLabel}</h3>
                </div>
                <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-full border border-gray-800 text-gray-500 hover:text-white hover:border-gray-600 transition-all">
                    <XIcon className="w-3.5 h-3.5" />
                </button>
            </div>
            <div className="p-4 space-y-3 max-h-80 overflow-y-auto">
                {items.map(fu => (
                    <div key={fu.id} className={cn('p-3 rounded-xl border', fu.type === 'call' ? 'bg-green-500/5 border-green-500/20' : 'bg-purple-500/5 border-purple-500/20')}>
                        <div className="flex items-center gap-2 mb-1">
                            {fu.type === 'call' ? <PhoneIcon className="w-3.5 h-3.5 text-green-400 shrink-0" /> : <MapPinIcon className="w-3.5 h-3.5 text-purple-400 shrink-0" />}
                            <span className={cn('text-[10px] font-black uppercase tracking-widest', fu.type === 'call' ? 'text-green-400' : 'text-purple-400')}>
                                {fu.type === 'call' ? 'Phone Call' : 'Site Visit'}
                            </span>
                            <span className="ml-auto text-[10px] text-gray-500 font-mono">{fu.time}</span>
                        </div>
                        <p className="text-white font-bold text-xs truncate">{fu.project_name}</p>
                        <p className="text-gray-500 text-[10px] mt-0.5">{fu.stage}</p>
                        {fu.notes && <p className="text-gray-400 text-[11px] mt-2 leading-relaxed border-t border-gray-800 pt-2">{fu.notes}</p>}
                    </div>
                ))}
            </div>
        </div>
    </div>
);

// ─── Add / Edit Event Modal ───────────────────────────────────────────────────
interface EventModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (payload: CreateEventPayload & { pushToGoogle: boolean }) => Promise<void>;
    prefillDate?: string;
    isGoogleSynced: boolean;
    editEvent?: RhiveCalendarEvent | null;
}

const EventModal: React.FC<EventModalProps> = ({ isOpen, onClose, onSave, prefillDate, isGoogleSynced, editEvent }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [date, setDate] = useState('');
    const [startTime, setStartTime] = useState('09:00');
    const [endTime, setEndTime] = useState('10:00');
    const [isAllDay, setIsAllDay] = useState(false);
    const [pushToGoogle, setPushToGoogle] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const isEdit = !!editEvent;

    useEffect(() => {
        if (!isOpen) return;
        if (editEvent) {
            const start = new Date(editEvent.startDateTime);
            const end = new Date(editEvent.endDateTime);
            setTitle(editEvent.title);
            setDescription(editEvent.description || '');
            setLocation(editEvent.location || '');
            setIsAllDay(editEvent.isAllDay);
            setDate(editEvent.startDateTime.slice(0, 10));
            setStartTime(`${String(start.getHours()).padStart(2, '0')}:${String(start.getMinutes()).padStart(2, '0')}`);
            setEndTime(`${String(end.getHours()).padStart(2, '0')}:${String(end.getMinutes()).padStart(2, '0')}`);
            setPushToGoogle(isGoogleSynced && !!editEvent.googleEventId);
        } else {
            const base = prefillDate || new Date().toISOString().slice(0, 10);
            setTitle(''); setDescription(''); setLocation('');
            setDate(base); setStartTime('09:00'); setEndTime('10:00');
            setIsAllDay(false); setPushToGoogle(isGoogleSynced);
        }
        setError('');
    }, [isOpen, editEvent, prefillDate, isGoogleSynced]);

    const buildISO = (timeStr: string) => {
        const [h, m] = timeStr.split(':');
        return `${date}T${h.padStart(2, '0')}:${m.padStart(2, '0')}:00`;
    };

    const handleSave = async () => {
        if (!title.trim()) { setError('Title is required.'); return; }
        if (!date) { setError('Date is required.'); return; }
        setSaving(true); setError('');
        try {
            await onSave({
                title: title.trim(), description, location,
                startDateTime: isAllDay ? `${date}T00:00:00` : buildISO(startTime),
                endDateTime: isAllDay ? `${date}T23:59:00` : buildISO(endTime),
                isAllDay, color: '#ec028b', pushToGoogle,
            });
            onClose();
        } catch (e: any) {
            setError(e.message || 'Failed to save event.');
        } finally { setSaving(false); }
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
                            {isEdit ? <PencilIcon className="w-4 h-4 text-[#ec028b]" /> : <CalendarDaysIcon className="w-4 h-4 text-[#ec028b]" />}
                        </div>
                        <div>
                            <h2 className="text-base font-black uppercase tracking-widest text-white">{isEdit ? 'Edit Event' : 'Add Event'}</h2>
                            {isGoogleSynced && <p className="text-[10px] text-[#ec028b] mt-0.5">⚡ Syncs to Google Calendar</p>}
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-600 hover:text-white transition-colors"><XIcon className="w-5 h-5" /></button>
                </div>

                <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
                    <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1.5 block">Event Title *</label>
                        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Site Inspection · 1927 Thompson St" className={inputCls} autoFocus />
                    </div>

                    {/* Date */}
                    <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1.5 block">Date *</label>
                        <input type="date" value={date} onChange={e => setDate(e.target.value)} className={inputCls} />
                    </div>

                    {/* All Day toggle */}
                    <div className="flex items-center justify-between p-3 bg-gray-900/60 rounded-lg border border-gray-800">
                        <span className="text-xs font-bold text-white">All Day Event</span>
                        <button type="button" onClick={() => setIsAllDay(v => !v)}
                            className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${isAllDay ? 'bg-[#ec028b]' : 'bg-gray-700'}`}>
                            <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-200 ${isAllDay ? 'left-5' : 'left-0.5'}`} />
                        </button>
                    </div>

                    {/* Time pickers */}
                    {!isAllDay && (
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1.5 block">Start Time</label>
                                <TimePicker value={startTime} onChange={setStartTime} />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1.5 block">End Time</label>
                                <TimePicker value={endTime} onChange={setEndTime} />
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1.5 block">Location</label>
                        <input value={location} onChange={e => setLocation(e.target.value)} placeholder="Address or video link" className={inputCls} />
                    </div>

                    <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1.5 block">Notes</label>
                        <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Agenda, project details..." rows={2} className={`${inputCls} resize-none`} />
                    </div>

                    {/* Google toggle */}
                    {isGoogleSynced && (
                        <div className="flex items-center justify-between p-3 bg-[#ec028b]/5 rounded-lg border border-[#ec028b]/20">
                            <div>
                                <p className="text-xs font-bold text-white">{isEdit ? 'Update in Google Calendar' : 'Also add to Google Calendar'}</p>
                                <p className="text-[10px] text-gray-500 mt-0.5">Event will sync to your Google Calendar</p>
                            </div>
                            <button type="button" onClick={() => setPushToGoogle(v => !v)}
                                className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${pushToGoogle ? 'bg-[#ec028b]' : 'bg-gray-700'}`}>
                                <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-200 ${pushToGoogle ? 'left-5' : 'left-0.5'}`} />
                            </button>
                        </div>
                    )}

                    {error && <p className="text-[#ec028b] text-xs font-bold">{error}</p>}

                    <div className="flex gap-3 pt-1">
                        <button onClick={onClose} className="flex-1 h-10 text-xs font-black uppercase tracking-widest text-gray-500 rounded-lg border border-gray-800 hover:border-gray-600 transition-colors">
                            Cancel
                        </button>
                        <button onClick={handleSave} disabled={saving}
                            className="flex-1 h-10 text-xs font-black uppercase tracking-widest text-white bg-[#ec028b] hover:bg-pink-600 disabled:opacity-50 rounded-lg transition-colors flex items-center justify-center gap-2">
                            {saving ? <ArrowPathIcon className="w-4 h-4 animate-spin" /> : isEdit ? <PencilIcon className="w-4 h-4" /> : <PlusIcon className="w-4 h-4" />}
                            {saving ? 'Saving…' : isGoogleSynced && pushToGoogle ? (isEdit ? 'Update in Google Calendar' : 'Add to Google Calendar') : (isEdit ? 'Save Changes' : 'Add Event')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── Event Detail Popup ───────────────────────────────────────────────────────
const EventDetailPopup: React.FC<{
    event: RhiveCalendarEvent;
    onClose: () => void;
    onDelete: (event: RhiveCalendarEvent) => void;
    onEdit: (event: RhiveCalendarEvent) => void;
}> = ({ event, onClose, onDelete, onEdit }) => {
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
                            <span>{event.isAllDay ? `All day · ${fmtDate(event.startDateTime)}` : `${fmtDate(event.startDateTime)} · ${fmtTime(event.startDateTime)} – ${fmtTime(event.endDateTime)}`}</span>
                        </div>
                        {event.location && (
                            <div className="flex items-center gap-2">
                                <MapPinIcon className="w-3.5 h-3.5 text-[#ec028b] shrink-0" />
                                <span className="truncate">{event.location}</span>
                            </div>
                        )}
                        {event.description && <p className="text-gray-500 text-[11px] border-t border-gray-800 pt-2 mt-2">{event.description}</p>}
                    </div>

                    {/* Source badge */}
                    <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-800">
                        <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${event.source === 'google' ? 'text-pink-400 bg-[#ec028b]/10 border-[#ec028b]/20' : 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20'}`}>
                            {event.source === 'google' ? '⚡ Google' : '◈ RHIVE'}
                        </span>
                        <div className="ml-auto flex items-center gap-2">
                            {/* Edit button */}
                            <button
                                onClick={() => { onEdit(event); onClose(); }}
                                className="flex items-center gap-1.5 px-3 h-8 text-[10px] font-black uppercase tracking-widest text-gray-400 border border-gray-700 hover:border-[#ec028b] hover:text-[#ec028b] rounded-lg transition-all"
                            >
                                <PencilIcon className="w-3 h-3" />
                                Edit
                            </button>
                            {/* Delete button — now prominent red */}
                            <button
                                onClick={() => { onDelete(event); onClose(); }}
                                className="flex items-center gap-1.5 px-3 h-8 text-[10px] font-black uppercase tracking-widest text-white bg-red-600 hover:bg-red-500 rounded-lg transition-all shadow-[0_0_12px_rgba(220,38,38,0.4)]"
                            >
                                <TrashIcon className="w-3 h-3" />
                                Delete
                            </button>
                        </div>
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
    const { logActivity } = useNotifications();

    const [weatherAlerts, setWeatherAlerts] = useState<Record<string, WeatherAlert>>({});
    const [followUps, setFollowUps] = useState<FollowUp[]>([]);
    const [popupDate, setPopupDate] = useState<string | null>(null);

    const [gcalEvents, setGcalEvents] = useState<RhiveCalendarEvent[]>([]);
    const [gcalLoading, setGcalLoading] = useState(false);
    const [syncing, setSyncing] = useState(false);
    const [syncMsg, setSyncMsg] = useState<{ text: string; ok: boolean } | null>(null);
    const [selectedEvent, setSelectedEvent] = useState<RhiveCalendarEvent | null>(null);
    const [editEvent, setEditEvent] = useState<RhiveCalendarEvent | null>(null);
    const [accessToken, setAccessToken] = useState<string>('');

    const [showEventModal, setShowEventModal] = useState(false);
    const [prefillDate, setPrefillDate] = useState<string>('');

    const now = new Date();
    const [viewYear, setViewYear] = useState(now.getFullYear());
    const [viewMonth, setViewMonth] = useState(now.getMonth());
    const monthName = new Date(viewYear, viewMonth, 1).toLocaleString('default', { month: 'long' });
    const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const todayStr = now.toISOString().slice(0, 10);
    const isAlreadySynced = !!(currentUser as any)?.googleCalendarLinked;

    const prevMonth = () => { if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); } else setViewMonth(m => m - 1); };
    const nextMonth = () => { if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); } else setViewMonth(m => m + 1); };

    // ── Subscribe to follow-ups ───────────────────────────────────────────────
    useEffect(() => {
        const unsub = firestoreService.subscribeToDocuments('followups', (data: any[]) => setFollowUps(data as FollowUp[]));
        return () => unsub();
    }, []);

    // ── Load events from Firestore on mount ───────────────────────────────────
    useEffect(() => {
        if (!currentUser?.id) return;
        setGcalLoading(true);
        getUserCalendarEvents(currentUser.id).then(evs => { setGcalEvents(evs); setGcalLoading(false); });
    }, [currentUser?.id]);

    // ── Bidirectional polling (every 5 min when synced + token available) ─────
    const pollBidi = useCallback(async () => {
        if (!currentUser?.id || !accessToken || !isAlreadySynced) return;
        try {
            const googleEvs = await fetchGoogleCalendarEvents(accessToken);
            // Delete existing google-source events for this user then re-add fresh ones
            const snap = await getDocs(query(collection(db, 'calendar_events'), where('userId', '==', currentUser.id), where('source', '==', 'google')));
            await Promise.all(snap.docs.map(d => deleteDoc(doc(db, 'calendar_events', d.id))));
            for (const gev of googleEvs) {
                const isAllDay = !gev.start.dateTime;
                const n = new Date().toISOString();
                await addDoc(collection(db, 'calendar_events'), {
                    userId: currentUser.id, userEmail: currentUser.email || '',
                    googleEventId: gev.id, title: gev.summary || '(No title)',
                    description: gev.description || '', location: gev.location || '',
                    startDateTime: gev.start.dateTime || gev.start.date || '',
                    endDateTime: gev.end.dateTime || gev.end.date || '',
                    isAllDay, status: gev.status || 'confirmed',
                    googleLink: gev.htmlLink || '', organizer: gev.organizer?.email || currentUser.email || '',
                    syncedAt: n, created_at: n, updated_at: n, source: 'google', color: undefined,
                });
            }
            const allEvs = await getUserCalendarEvents(currentUser.id);
            setGcalEvents(allEvs);
        } catch (e) {
            console.warn('[BidiPoll] failed:', e);
        }
    }, [accessToken, currentUser?.id, isAlreadySynced]);

    // Set up polling interval
    useEffect(() => {
        if (!accessToken || !isAlreadySynced) return;
        const id = setInterval(pollBidi, BIDI_POLL_MS);
        return () => clearInterval(id);
    }, [accessToken, isAlreadySynced, pollBidi]);

    // ── Weather ───────────────────────────────────────────────────────────────
    const fetchForecast = useCallback(async () => {
        if (!GOOGLE_WEATHER_API_KEY) return;
        try {
            const res = await fetch(`${WEATHER_BASE}/forecast/days:lookup?key=${GOOGLE_WEATHER_API_KEY}&location.latitude=${DEFAULT_LAT}&location.longitude=${DEFAULT_LON}&days=7&unitsSystem=METRIC`);
            if (!res.ok) return;
            const data = await res.json();
            const alerts: Record<string, WeatherAlert> = {};
            data.forecastDays?.forEach((d: any) => {
                const dateStr = `${d.displayDate.year}-${String(d.displayDate.month).padStart(2, '0')}-${String(d.displayDate.day).padStart(2, '0')}`;
                const cond = d.daytimeForecast?.weatherCondition?.type || 'CLEAR';
                const desc = d.daytimeForecast?.weatherCondition?.description?.text || '';
                const isStorm = STORM_TYPES.has(cond) || (d.daytimeForecast?.thunderstormProbability ?? 0) >= 40;
                alerts[dateStr] = { date: dateStr, type: cond, description: desc, isStorm };
            });
            setWeatherAlerts(alerts);
        } catch {}
    }, []);
    useEffect(() => { fetchForecast(); }, [fetchForecast]);

    // ── Memos ─────────────────────────────────────────────────────────────────
    const followUpsByDate = React.useMemo(() => {
        const map: Record<string, FollowUp[]> = {};
        followUps.forEach(fu => { if (!map[fu.date]) map[fu.date] = []; map[fu.date].push(fu); });
        return map;
    }, [followUps]);

    const gcalByDate = React.useMemo(() => {
        const map: Record<string, RhiveCalendarEvent[]> = {};
        gcalEvents.forEach(ev => {
            const dateStr = ev.startDateTime?.split('T')[0];
            if (!dateStr) return;
            if (!map[dateStr]) map[dateStr] = [];
            map[dateStr].push(ev);
        });
        return map;
    }, [gcalEvents]);

    // ── Helpers: get or request access token ──────────────────────────────────
    const ensureToken = useCallback(async (): Promise<string> => {
        if (accessToken) return accessToken;
        const token = await requestGoogleAccessToken(currentUser?.email || '');
        setAccessToken(token);
        return token;
    }, [accessToken, currentUser?.email]);

    // ── SYNC ──────────────────────────────────────────────────────────────────
    const handleSync = async () => {
        if (!currentUser) return;
        setSyncing(true); setSyncMsg(null);
        try {
            const result = await syncUserGoogleCalendar(currentUser.id, currentUser.email || '');
            if (result.success) {
                setGcalEvents(result.events);
                setAccessToken(result.accessToken || '');
                setSyncMsg({ text: `✓ Synced ${result.eventsCount} events from Google Calendar`, ok: true });
                await logActivity('calendar_synced', `Google Calendar synced — ${result.eventsCount} events imported`, { eventsCount: result.eventsCount });
            } else {
                setSyncMsg({ text: result.error || 'Sync failed.', ok: false });
            }
        } catch (e: any) {
            setSyncMsg({ text: e.message || 'Unexpected error.', ok: false });
        } finally {
            setSyncing(false);
            setTimeout(() => setSyncMsg(null), 7000);
        }
    };

    // ── CREATE / EDIT ─────────────────────────────────────────────────────────
    const handleSaveEvent = async (payload: CreateEventPayload & { pushToGoogle: boolean }) => {
        if (!currentUser) return;
        let newEvent: RhiveCalendarEvent | null = null;

        if (editEvent) {
            // ── UPDATE path ──────────────────────────────────────────────────
            // 1. Push to Google Calendar if applicable
            if (payload.pushToGoogle && isAlreadySynced && editEvent.googleEventId) {
                try {
                    const token = await ensureToken();
                    const body: any = {
                        summary: payload.title,
                        description: payload.description || '',
                        location: payload.location || '',
                    };
                    if (payload.isAllDay) {
                        body.start = { date: payload.startDateTime.slice(0, 10) };
                        body.end = { date: payload.endDateTime.slice(0, 10) };
                    } else {
                        body.start = { dateTime: payload.startDateTime, timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone };
                        body.end = { dateTime: payload.endDateTime, timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone };
                    }
                    await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${editEvent.googleEventId}`, {
                        method: 'PATCH',
                        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
                        body: JSON.stringify(body),
                    });
                } catch (e) { console.warn('Google update failed:', e); }
            }
            // 2. Update in Firestore (using static imports from top of file)
            const now = new Date().toISOString();
            await updateDoc(doc(db, 'calendar_events', editEvent.id), {
                title: payload.title, description: payload.description || '',
                location: payload.location || '', startDateTime: payload.startDateTime,
                endDateTime: payload.endDateTime, isAllDay: payload.isAllDay, updated_at: now,
            });
            // 3. Update local state
            setGcalEvents(prev => prev.map(e => e.id === editEvent.id ? { ...e, ...payload, updated_at: now } : e));
            await logActivity('calendar_event_updated', `Updated event: "${payload.title}"`, { eventId: editEvent.id, title: payload.title, source: editEvent.source });
            setEditEvent(null);
            return;
        }

        // ── CREATE path ──────────────────────────────────────────────────────
        if (payload.pushToGoogle && isAlreadySynced) {
            try {
                const token = await ensureToken();
                newEvent = await createGoogleCalendarEvent(token, currentUser.id, currentUser.email || '', payload);
            } catch { /* fall through */ }
        }
        if (!newEvent) {
            newEvent = await createRhiveEvent(currentUser.id, currentUser.email || '', payload);
        }
        if (newEvent) {
            setGcalEvents(prev => [...prev, newEvent!].sort((a, b) => a.startDateTime.localeCompare(b.startDateTime)));
            await logActivity('meeting_scheduled', `Added event: "${payload.title}"`, { title: payload.title, startDateTime: payload.startDateTime, source: newEvent.source });
        }
    };

    // ── DELETE ────────────────────────────────────────────────────────────────
    const handleDeleteEvent = async (event: RhiveCalendarEvent) => {
        // 1. Delete from Google Calendar if applicable
        if (event.googleEventId && accessToken) {
            try {
                await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${event.googleEventId}`, {
                    method: 'DELETE',
                    headers: { Authorization: `Bearer ${accessToken}` },
                });
            } catch (e) { console.warn('Google delete failed:', e); }
        } else if (event.googleEventId && isAlreadySynced) {
            try {
                const token = await ensureToken();
                await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${event.googleEventId}`, {
                    method: 'DELETE',
                    headers: { Authorization: `Bearer ${token}` },
                });
            } catch (e) { console.warn('Google delete failed (fresh token):', e); }
        }
        // 2. Delete from Firestore
        await deleteCalendarEvent(event.id);
        // 3. Update local state
        setGcalEvents(prev => prev.filter(e => e.id !== event.id));
        await logActivity('calendar_event_deleted', `Deleted event: "${event.title}"`, { eventId: event.id, title: event.title, source: event.source });
    };

    const upcomingFollowUps = followUps.filter(fu => fu.date >= todayStr)
        .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time)).slice(0, 6);
    const popupItems = popupDate ? (followUpsByDate[popupDate] || []) : [];
    const popupDateLabel = popupDate ? new Date(popupDate + 'T12:00:00').toLocaleDateString('default', { weekday: 'long', month: 'long', day: 'numeric' }) : '';

    return (
        <PageContainer title={page?.name || 'Calendar'} description="Track follow-up calls, site visits, time-off, and Google Calendar events.">

            {/* ── Sync Banner ──────────────────────────────────────────── */}
            <div className="mb-5 p-4 bg-gray-900/50 border border-gray-800 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <CalendarDaysIcon className="w-5 h-5 text-[#ec028b] shrink-0" />
                    <div>
                        <p className="text-sm font-bold text-white">Google Calendar</p>
                        <p className="text-[11px] text-gray-500">
                            {isAlreadySynced
                                ? `Synced · ${gcalEvents.filter(e => e.source === 'google').length} Google events · auto-polls every 5 min`
                                : 'Connect your Google Calendar to enable bidirectional sync'}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                    {syncMsg && <p className={`text-[11px] font-bold ${syncMsg.ok ? 'text-green-400' : 'text-red-400'}`}>{syncMsg.text}</p>}
                    {!isAlreadySynced && (
                        <button onClick={handleSync} disabled={syncing}
                            className="flex items-center gap-2 px-4 h-9 text-[11px] font-black uppercase tracking-widest border border-gray-700 text-gray-400 hover:border-[#ec028b] hover:text-[#ec028b] disabled:opacity-40 rounded-lg transition-all">
                            <ArrowPathIcon className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
                            {syncing ? 'Connecting…' : 'Connect Google Calendar'}
                        </button>
                    )}
                    {isAlreadySynced && (
                        <button onClick={handleSync} disabled={syncing}
                            className="flex items-center gap-2 px-3 h-8 text-[10px] font-black uppercase tracking-widest border border-gray-800 text-gray-600 hover:border-gray-600 hover:text-gray-400 disabled:opacity-40 rounded-lg transition-all">
                            <ArrowPathIcon className={`w-3 h-3 ${syncing ? 'animate-spin' : ''}`} />
                            {syncing ? '…' : 'Re-sync'}
                        </button>
                    )}
                    <button onClick={() => { setPrefillDate(''); setEditEvent(null); setShowEventModal(true); }}
                        className="flex items-center gap-2 px-4 h-9 text-[11px] font-black uppercase tracking-widest bg-[#ec028b] text-white hover:bg-pink-600 rounded-lg transition-colors shadow-[0_0_12px_rgba(236,2,139,0.3)]">
                        <PlusIcon className="w-3.5 h-3.5" />
                        Add Event
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* ── Main Calendar ─────────────────────────────────────── */}
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
                            {days.map(d => <div key={d}>{d}</div>)}
                        </div>
                        {/* Day cells */}
                        <div className="grid grid-cols-7 gap-1">
                            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                                <div key={`e-${i}`} className="h-24 bg-gray-950/20 border border-gray-900/20 rounded-lg" />
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

                                return (
                                    <div key={dayNum}
                                        onClick={() => {
                                            if (dayFollowUps.length > 0 && dayGcal.length === 0) { setPopupDate(dateStr); }
                                            else if (dayGcal.length > 0 && dayFollowUps.length === 0) { setSelectedEvent(dayGcal[0]); }
                                            else if (dayGcal.length === 0 && dayFollowUps.length === 0) { setPrefillDate(dateStr); setEditEvent(null); setShowEventModal(true); }
                                            else { setPopupDate(dateStr); }
                                        }}
                                        className={cn(
                                            'h-24 p-1.5 rounded-lg border transition-all duration-300 relative group flex flex-col cursor-pointer',
                                            isToday ? 'bg-[#ec028b]/5 border-[#ec028b]/40 shadow-[0_0_12px_rgba(236,2,139,0.1)]' : 'bg-gray-900/40 border-gray-800/40 hover:border-gray-700',
                                            alert?.isStorm ? 'border-orange-500/40 bg-orange-500/5' : '',
                                        )}>
                                        <div className="flex justify-between items-start mb-1">
                                            <span className={cn('text-xs font-bold leading-none', isToday ? 'text-[#ec028b]' : 'text-gray-400')}>{dayNum}</span>
                                            {isToday && <div className="w-1.5 h-1.5 rounded-full bg-[#ec028b] animate-pulse" />}
                                        </div>
                                        <div className="flex flex-col gap-0.5 flex-1 overflow-hidden">
                                            {dayGcal.slice(0, 2).map((ev, ei) => (
                                                <div key={ei}
                                                    onClick={e => { e.stopPropagation(); setSelectedEvent(ev); }}
                                                    className={`flex items-center gap-0.5 rounded px-1 py-0.5 cursor-pointer ${ev.source === 'google' ? 'bg-[#ec028b]/15 border border-[#ec028b]/25' : 'bg-yellow-500/15 border border-yellow-500/25'}`}>
                                                    <span className={`text-[7px] font-bold uppercase truncate ${ev.source === 'google' ? 'text-pink-300' : 'text-yellow-300'}`}>
                                                        {!ev.isAllDay && `${new Date(ev.startDateTime).getHours() % 12 || 12}${new Date(ev.startDateTime).getHours() >= 12 ? 'p' : 'a'} `}{ev.title}
                                                    </span>
                                                </div>
                                            ))}
                                            {dayGcal.length > 2 && <span className="text-[8px] text-gray-600 font-bold px-1">+{dayGcal.length - 2} more</span>}
                                            {hasCalls && (
                                                <div className="flex items-center gap-0.5 bg-green-500/15 border border-green-500/25 rounded px-1 py-0.5">
                                                    <PhoneIcon className="w-2.5 h-2.5 text-green-400 shrink-0" />
                                                    <span className="text-[7px] font-bold text-green-300 uppercase truncate">{dayFollowUps.filter(f => f.type === 'call').length}× Call</span>
                                                </div>
                                            )}
                                            {hasVisits && (
                                                <div className="flex items-center gap-0.5 bg-purple-500/15 border border-purple-500/25 rounded px-1 py-0.5">
                                                    <MapPinIcon className="w-2.5 h-2.5 text-purple-400 shrink-0" />
                                                    <span className="text-[7px] font-bold text-purple-300 uppercase truncate">{dayFollowUps.filter(f => f.type === 'visit').length}× Visit</span>
                                                </div>
                                            )}
                                            {alert?.isStorm && (
                                                <div className="flex items-center gap-0.5 mt-auto">
                                                    <BoltIcon className="w-2.5 h-2.5 text-orange-400" />
                                                    <span className="text-[7px] text-orange-400 font-bold">Storm</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Inline legend */}
                        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-5 pt-4 border-t border-gray-800">
                            {[
                                { color: 'bg-[#ec028b]', label: 'Today' },
                                { color: 'bg-[#ec028b]/40 border border-[#ec028b]/50', label: 'Google Event' },
                                { color: 'bg-yellow-500/40 border border-yellow-500/50', label: 'RHIVE Event' },
                            ].map(({ color, label }) => (
                                <div key={label} className="flex items-center gap-1.5">
                                    <div className={`w-2.5 h-2.5 rounded-sm shrink-0 ${color}`} />
                                    <span className="text-[10px] font-bold text-gray-500">{label}</span>
                                </div>
                            ))}
                            {[
                                { icon: <PhoneIcon className="w-2.5 h-2.5 text-green-400 shrink-0" />, label: 'Follow-Up Call' },
                                { icon: <MapPinIcon className="w-2.5 h-2.5 text-purple-400 shrink-0" />, label: 'Site Visit' },
                                { icon: <BoltIcon className="w-2.5 h-2.5 text-orange-400 shrink-0" />, label: 'Storm' },
                            ].map(({ icon, label }) => (
                                <div key={label} className="flex items-center gap-1.5">
                                    {icon}
                                    <span className="text-[10px] font-bold text-gray-500">{label}</span>
                                </div>
                            ))}
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
                                    <div key={fu.id} className={cn('p-3 rounded-xl border', fu.type === 'call' ? 'bg-green-500/5 border-green-500/15' : 'bg-purple-500/5 border-purple-500/15')}>
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

                    {/* Upcoming Calendar Events */}
                    <Card title="Upcoming Events">
                        {gcalLoading ? (
                            <div className="flex items-center gap-2 text-gray-600 text-xs py-4">
                                <ArrowPathIcon className="w-4 h-4 animate-spin" /> Loading events…
                            </div>
                        ) : gcalEvents.filter(e => e.startDateTime >= todayStr).length === 0 ? (
                            <div className="text-center py-4">
                                <CalendarDaysIcon className="w-7 h-7 mx-auto text-gray-700 mb-1.5" />
                                <p className="text-gray-600 text-xs">No upcoming events.</p>
                            </div>
                        ) : (
                            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                                {gcalEvents
                                    .filter(e => e.startDateTime >= todayStr)
                                    .slice(0, 8)
                                    .map(ev => (
                                        <button key={ev.id} onClick={() => setSelectedEvent(ev)}
                                            className="w-full text-left p-2.5 rounded-lg border border-gray-800 hover:border-gray-700 bg-gray-900/40 hover:bg-gray-900/70 transition-all group">
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${ev.source === 'google' ? 'bg-[#ec028b]' : 'bg-yellow-400'}`} />
                                                <span className="text-xs font-bold text-white truncate">{ev.title}</span>
                                            </div>
                                            <p className="text-[10px] text-gray-500 ml-3.5">
                                                {new Date(ev.startDateTime).toLocaleDateString('default', { month: 'short', day: 'numeric' })}
                                                {!ev.isAllDay && ` · ${new Date(ev.startDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                                            </p>
                                        </button>
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

            {/* Popups & Modals */}
            {popupDate && popupItems.length > 0 && (
                <FollowUpPopup items={popupItems} dateLabel={popupDateLabel} onClose={() => setPopupDate(null)} />
            )}
            {selectedEvent && (
                <EventDetailPopup
                    event={selectedEvent}
                    onClose={() => setSelectedEvent(null)}
                    onDelete={handleDeleteEvent}
                    onEdit={ev => { setEditEvent(ev); setShowEventModal(true); setSelectedEvent(null); }}
                />
            )}
            <EventModal
                isOpen={showEventModal}
                onClose={() => { setShowEventModal(false); setEditEvent(null); }}
                onSave={handleSaveEvent}
                prefillDate={prefillDate}
                isGoogleSynced={isAlreadySynced}
                editEvent={editEvent}
            />
        </PageContainer>
    );
};

export default EmployeeTimeoffPage;