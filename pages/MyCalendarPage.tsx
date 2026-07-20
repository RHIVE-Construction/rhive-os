/**
 * MyCalendarPage — E-40
 * ──────────────────────────────────────────────────────────────────────────────
 * Full-featured interactive calendar with Google Calendar sync + RHIVE-native
 * event creation. Tech-Noir / Quantum OS aesthetic.
 *
 * Features:
 *  - Month / Week / Day view
 *  - Google Calendar sync (reads from Firestore cache, re-syncs on demand)
 *  - Add Event modal (RHIVE-native or push to Google)
 *  - Event detail popover
 *  - Chamfered edges, neon pink, glassmorphism design
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useMockDB } from '../contexts/MockDatabaseContext';
import {
    getUserCalendarEvents,
    syncUserGoogleCalendar,
    createRhiveEvent,
    createGoogleCalendarEvent,
    deleteCalendarEvent,
    requestGoogleAccessToken,
    type RhiveCalendarEvent,
    type CreateEventPayload,
} from '../services/googleCalendarService';
import {
    CalendarDaysIcon,
    PlusIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    XIcon,
    ArrowPathIcon,
    ClockIcon,
    MapPinIcon,
    TrashIcon,
    ExternalLinkIcon,
} from '../components/icons';
import PlexusShape from '../components/PlexusShape';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

const isoDate = (d: Date) => d.toISOString().split('T')[0];
const fmtTime = (iso: string) => {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};
const fmtDate = (iso: string) => {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
};

const toLocalInputDatetime = (iso: string): string => {
    const d = new Date(iso);
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const defaultStart = () => {
    const d = new Date();
    d.setMinutes(0, 0, 0);
    d.setHours(d.getHours() + 1);
    return toLocalInputDatetime(d.toISOString());
};
const defaultEnd = () => {
    const d = new Date();
    d.setMinutes(0, 0, 0);
    d.setHours(d.getHours() + 2);
    return toLocalInputDatetime(d.toISOString());
};

// Get weeks array for month view
function getMonthWeeks(year: number, month: number): Date[][] {
    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);
    const startDay = first.getDay();
    const weeks: Date[][] = [];
    let week: Date[] = [];

    // Pad beginning
    for (let i = 0; i < startDay; i++) {
        const d = new Date(year, month, 1 - (startDay - i));
        week.push(d);
    }

    for (let day = 1; day <= last.getDate(); day++) {
        week.push(new Date(year, month, day));
        if (week.length === 7) { weeks.push(week); week = []; }
    }

    // Pad end
    if (week.length > 0) {
        let extra = 1;
        while (week.length < 7) {
            week.push(new Date(year, month + 1, extra++));
        }
        weeks.push(week);
    }

    return weeks;
}

// Get 7-day window for week view
function getWeekDays(pivot: Date): Date[] {
    const start = new Date(pivot);
    start.setDate(pivot.getDate() - pivot.getDay());
    return Array.from({ length: 7 }, (_, i) => {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        return d;
    });
}

// Events on a specific date
function eventsOnDate(events: RhiveCalendarEvent[], date: Date): RhiveCalendarEvent[] {
    const dateStr = isoDate(date);
    return events.filter(e => {
        const start = e.startDateTime.split('T')[0];
        const end = e.endDateTime.split('T')[0];
        return start <= dateStr && end >= dateStr;
    });
}

// Color for event source
const eventColor = (e: RhiveCalendarEvent) => e.color || (e.source === 'google' ? '#ec028b' : '#e2ab49');
const eventBg = (e: RhiveCalendarEvent) => e.source === 'google' ? 'bg-rhive-pink/20 border-rhive-pink/40' : 'bg-yellow-500/20 border-yellow-500/40';
const eventText = (e: RhiveCalendarEvent) => e.source === 'google' ? 'text-pink-300' : 'text-yellow-300';

// ─── Add Event Modal ──────────────────────────────────────────────────────────

interface AddEventModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (payload: CreateEventPayload & { pushToGoogle: boolean }) => Promise<void>;
    prefillDate?: string;
    hasGoogleAccess: boolean;
}

const AddEventModal: React.FC<AddEventModalProps> = ({ isOpen, onClose, onAdd, prefillDate, hasGoogleAccess }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [startDateTime, setStartDateTime] = useState(defaultStart());
    const [endDateTime, setEndDateTime] = useState(defaultEnd());
    const [isAllDay, setIsAllDay] = useState(false);
    const [pushToGoogle, setPushToGoogle] = useState(hasGoogleAccess);
    const [color, setColor] = useState('#ec028b');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            if (prefillDate) {
                const d = new Date(prefillDate + 'T09:00');
                setStartDateTime(toLocalInputDatetime(d.toISOString()));
                const e = new Date(prefillDate + 'T10:00');
                setEndDateTime(toLocalInputDatetime(e.toISOString()));
            } else {
                setStartDateTime(defaultStart());
                setEndDateTime(defaultEnd());
            }
            setTitle('');
            setDescription('');
            setLocation('');
            setIsAllDay(false);
            setPushToGoogle(hasGoogleAccess);
            setError('');
        }
    }, [isOpen, prefillDate, hasGoogleAccess]);

    const handleSubmit = async () => {
        if (!title.trim()) { setError('Title is required.'); return; }
        if (!isAllDay && startDateTime >= endDateTime) { setError('End time must be after start time.'); return; }
        setSaving(true);
        setError('');
        try {
            await onAdd({
                title: title.trim(),
                description,
                location,
                startDateTime: new Date(startDateTime).toISOString(),
                endDateTime: new Date(endDateTime).toISOString(),
                isAllDay,
                color,
                pushToGoogle,
            });
            onClose();
        } catch (e: any) {
            setError(e.message || 'Failed to create event.');
        } finally {
            setSaving(false);
        }
    };

    if (!isOpen) return null;

    const chamfer = 'polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)';
    const inputCls = 'w-full bg-black/60 border border-gray-700 focus:border-rhive-pink text-white text-sm px-3 py-2.5 outline-none transition-colors duration-200 placeholder:text-gray-600';

    const COLOR_PRESETS = ['#ec028b', '#e2ab49', '#08137C', '#10b981', '#3b82f6', '#f97316'];

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
            <div className="relative z-10 w-full max-w-lg" style={{ clipPath: chamfer }}>
                {/* Plexus bg */}
                <div className="absolute inset-0 overflow-hidden" style={{ clipPath: chamfer }}>
                    <PlexusShape backgroundColor="#000000" dotColor="#ec028b" lineColor="236, 2, 139" density={25} className="w-full h-full" />
                    <div className="absolute inset-0 bg-black/75" />
                </div>
                {/* Border accents */}
                <div className="absolute left-0 top-4 bottom-0 w-px bg-gray-700" />
                <div className="absolute right-0 top-0 bottom-4 w-px bg-gray-700" />
                <div className="absolute left-4 right-0 top-0 h-px bg-gray-700" />
                <div className="absolute left-0 right-4 bottom-0 h-px bg-gray-700" />
                <svg className="absolute top-0 left-0 w-4 h-4 z-10 overflow-visible pointer-events-none"><line x1="0" y1="16" x2="16" y2="0" stroke="#ec028b" strokeWidth="1.5" /></svg>
                <svg className="absolute bottom-0 right-0 w-4 h-4 z-10 overflow-visible pointer-events-none"><line x1="0" y1="16" x2="16" y2="0" stroke="#ec028b" strokeWidth="1.5" /></svg>

                <div className="relative z-20 p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-5 pb-4 border-b border-gray-800">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-rhive-pink/10 border border-rhive-pink/20">
                                <CalendarDaysIcon className="w-5 h-5 text-rhive-pink" />
                            </div>
                            <h2 className="text-lg font-black uppercase tracking-widest text-white">Add Event</h2>
                        </div>
                        <button onClick={onClose} className="text-gray-600 hover:text-rhive-pink transition-colors">
                            <XIcon className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="space-y-4">
                        {/* Title */}
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1.5 block">Event Title *</label>
                            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Site Inspection — 1927 Thompson St" className={inputCls} autoFocus />
                        </div>

                        {/* All Day toggle */}
                        <div className="flex items-center justify-between">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">All Day</label>
                            <button
                                type="button"
                                onClick={() => setIsAllDay(v => !v)}
                                className={`relative w-10 h-5 transition-colors duration-200 ${isAllDay ? 'bg-rhive-pink' : 'bg-gray-800'}`}
                                style={{ clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' }}
                            >
                                <span className={`absolute top-0.5 w-4 h-4 bg-white transition-all duration-200 ${isAllDay ? 'left-5' : 'left-0.5'}`} style={{ clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' }} />
                            </button>
                        </div>

                        {/* Date/time row */}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1.5 block">Start</label>
                                <input type={isAllDay ? 'date' : 'datetime-local'} value={isAllDay ? startDateTime.split('T')[0] : startDateTime} onChange={e => setStartDateTime(e.target.value)} className={inputCls} />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1.5 block">End</label>
                                <input type={isAllDay ? 'date' : 'datetime-local'} value={isAllDay ? endDateTime.split('T')[0] : endDateTime} onChange={e => setEndDateTime(e.target.value)} className={inputCls} />
                            </div>
                        </div>

                        {/* Location */}
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1.5 block">Location</label>
                            <input value={location} onChange={e => setLocation(e.target.value)} placeholder="Address or video link" className={inputCls} />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1.5 block">Notes</label>
                            <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Meeting agenda, project notes..." rows={2} className={`${inputCls} resize-none`} />
                        </div>

                        {/* Color */}
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 block">Color</label>
                            <div className="flex gap-2">
                                {COLOR_PRESETS.map(c => (
                                    <button key={c} type="button" onClick={() => setColor(c)} className="w-7 h-7 flex-none transition-transform duration-150 hover:scale-110" style={{ backgroundColor: c, clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)', outline: color === c ? `2px solid ${c}` : 'none', outlineOffset: '2px' }} />
                                ))}
                            </div>
                        </div>

                        {/* Push to Google */}
                        {hasGoogleAccess && (
                            <div className="flex items-center justify-between p-3 bg-gray-900/60 border border-gray-800">
                                <div>
                                    <p className="text-xs font-bold text-white">Sync to Google Calendar</p>
                                    <p className="text-[10px] text-gray-500">Event will appear in your Google Calendar</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setPushToGoogle(v => !v)}
                                    className={`relative w-10 h-5 transition-colors duration-200 ${pushToGoogle ? 'bg-rhive-pink' : 'bg-gray-800'}`}
                                    style={{ clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' }}
                                >
                                    <span className={`absolute top-0.5 w-4 h-4 bg-white transition-all duration-200 ${pushToGoogle ? 'left-5' : 'left-0.5'}`} style={{ clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' }} />
                                </button>
                            </div>
                        )}

                        {error && <p className="text-rhive-pink text-xs font-bold animate-pulse">{error}</p>}

                        {/* Actions */}
                        <div className="flex gap-3 pt-1">
                            <button onClick={onClose} className="flex-1 h-11 text-[10px] font-black uppercase tracking-widest text-gray-500 border border-gray-800 hover:border-gray-600 transition-colors" style={{ clipPath: 'polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)' }}>
                                Cancel
                            </button>
                            <button onClick={handleSubmit} disabled={saving} className="flex-1 h-11 text-[10px] font-black uppercase tracking-widest text-white bg-rhive-pink hover:bg-pink-500 disabled:opacity-50 transition-colors flex items-center justify-center gap-2" style={{ clipPath: 'polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)' }}>
                                {saving ? <ArrowPathIcon className="w-4 h-4 animate-spin" /> : <PlusIcon className="w-4 h-4" />}
                                {saving ? 'Saving...' : 'Add Event'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── Event Detail Popover ─────────────────────────────────────────────────────

interface EventDetailProps {
    event: RhiveCalendarEvent;
    onClose: () => void;
    onDelete: (event: RhiveCalendarEvent) => void;
    anchorRef: React.RefObject<HTMLElement>;
}

const EventDetail: React.FC<EventDetailProps> = ({ event, onClose, onDelete }) => {
    const chamfer = 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)';
    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4" onClick={onClose}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <div className="relative z-10 w-full max-w-sm" style={{ clipPath: chamfer }} onClick={e => e.stopPropagation()}>
                <div className="absolute inset-0 bg-gray-950 border border-gray-800" style={{ clipPath: chamfer }} />
                <svg className="absolute top-0 left-0 w-3 h-3 z-10 overflow-visible pointer-events-none"><line x1="0" y1="12" x2="12" y2="0" stroke="#ec028b" strokeWidth="1.5" /></svg>
                <svg className="absolute bottom-0 right-0 w-3 h-3 z-10 overflow-visible pointer-events-none"><line x1="0" y1="12" x2="12" y2="0" stroke="#ec028b" strokeWidth="1.5" /></svg>
                <div className="relative z-20 p-5">
                    <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                            <div className="w-3 h-3 flex-none rounded-sm" style={{ backgroundColor: eventColor(event) }} />
                            <h3 className="text-sm font-bold text-white truncate">{event.title}</h3>
                        </div>
                        <button onClick={onClose} className="text-gray-600 hover:text-white ml-2 flex-none"><XIcon className="w-4 h-4" /></button>
                    </div>

                    <div className="space-y-2 text-xs text-gray-400">
                        <div className="flex items-center gap-2">
                            <ClockIcon className="w-3.5 h-3.5 text-rhive-pink flex-none" />
                            <span>
                                {event.isAllDay ? `All day · ${fmtDate(event.startDateTime)}` : `${fmtDate(event.startDateTime)} · ${fmtTime(event.startDateTime)} – ${fmtTime(event.endDateTime)}`}
                            </span>
                        </div>
                        {event.location && (
                            <div className="flex items-center gap-2">
                                <MapPinIcon className="w-3.5 h-3.5 text-rhive-pink flex-none" />
                                <span className="truncate">{event.location}</span>
                            </div>
                        )}
                        {event.description && (
                            <p className="mt-2 text-gray-500 text-[11px] leading-relaxed border-t border-gray-800 pt-2">{event.description}</p>
                        )}
                        <div className="flex items-center justify-between pt-2 border-t border-gray-800">
                            <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 ${event.source === 'google' ? 'text-pink-400 bg-rhive-pink/10 border border-rhive-pink/20' : 'text-yellow-400 bg-yellow-500/10 border border-yellow-500/20'}`}>
                                {event.source === 'google' ? '⚡ Google' : '◈ RHIVE'}
                            </span>
                            <div className="flex items-center gap-2">
                                {event.googleLink && (
                                    <a href={event.googleLink} target="_blank" rel="noreferrer" className="text-gray-600 hover:text-rhive-pink transition-colors" onClick={e => e.stopPropagation()}>
                                        <ExternalLinkIcon className="w-4 h-4" />
                                    </a>
                                )}
                                <button onClick={() => { onDelete(event); onClose(); }} className="text-gray-700 hover:text-red-400 transition-colors">
                                    <TrashIcon className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── Month View ───────────────────────────────────────────────────────────────

interface MonthViewProps {
    year: number;
    month: number;
    events: RhiveCalendarEvent[];
    today: Date;
    onDayClick: (date: Date) => void;
    onEventClick: (event: RhiveCalendarEvent, ref: React.RefObject<HTMLElement>) => void;
}

const MonthView: React.FC<MonthViewProps> = ({ year, month, events, today, onDayClick, onEventClick }) => {
    const weeks = getMonthWeeks(year, month);
    const todayStr = isoDate(today);

    return (
        <div className="flex flex-col h-full">
            {/* Day headers */}
            <div className="grid grid-cols-7 border-b border-gray-800">
                {DAYS.map(d => (
                    <div key={d} className="text-center text-[10px] font-black uppercase tracking-widest text-gray-600 py-2">{d}</div>
                ))}
            </div>
            {/* Weeks */}
            <div className="flex-1 grid" style={{ gridTemplateRows: `repeat(${weeks.length}, 1fr)` }}>
                {weeks.map((week, wi) => (
                    <div key={wi} className="grid grid-cols-7 border-b border-gray-800/50 last:border-b-0">
                        {week.map((date, di) => {
                            const dateStr = isoDate(date);
                            const isToday = dateStr === todayStr;
                            const isCurrentMonth = date.getMonth() === month;
                            const dayEvents = eventsOnDate(events, date);
                            return (
                                <div
                                    key={di}
                                    onClick={() => onDayClick(date)}
                                    className={`relative border-r border-gray-800/50 last:border-r-0 p-1.5 cursor-pointer group transition-colors duration-150 min-h-[80px]
                                        ${isCurrentMonth ? 'bg-transparent hover:bg-gray-900/40' : 'bg-gray-950/30'}
                                    `}
                                >
                                    {/* Day number */}
                                    <div className={`w-6 h-6 flex items-center justify-center text-xs font-bold mb-1 transition-colors
                                        ${isToday ? 'bg-rhive-pink text-white shadow-pink-glow-sm' : isCurrentMonth ? 'text-gray-300 group-hover:text-white' : 'text-gray-700'}
                                    `} style={isToday ? { clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' } : {}}>
                                        {date.getDate()}
                                    </div>
                                    {/* Events */}
                                    <div className="space-y-0.5">
                                        {dayEvents.slice(0, 3).map((ev, ei) => {
                                            const ref = React.createRef<HTMLDivElement>() as React.RefObject<HTMLElement>;
                                            return (
                                                <div
                                                    key={ei}
                                                    ref={ref as React.RefObject<HTMLDivElement>}
                                                    onClick={e => { e.stopPropagation(); onEventClick(ev, ref); }}
                                                    className={`text-[9px] font-bold truncate px-1.5 py-0.5 border cursor-pointer hover:brightness-125 transition-all ${eventBg(ev)} ${eventText(ev)}`}
                                                    style={{ clipPath: 'polygon(3px 0, 100% 0, calc(100% - 3px) 100%, 0 100%)' }}
                                                >
                                                    {!ev.isAllDay && <span className="opacity-70">{fmtTime(ev.startDateTime)} </span>}
                                                    {ev.title}
                                                </div>
                                            );
                                        })}
                                        {dayEvents.length > 3 && (
                                            <div className="text-[9px] text-gray-600 font-bold px-1">+{dayEvents.length - 3} more</div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
};

// ─── Week View ────────────────────────────────────────────────────────────────

interface WeekViewProps {
    pivot: Date;
    events: RhiveCalendarEvent[];
    today: Date;
    onEventClick: (event: RhiveCalendarEvent, ref: React.RefObject<HTMLElement>) => void;
    onSlotClick: (date: Date) => void;
}

const WeekView: React.FC<WeekViewProps> = ({ pivot, events, today, onEventClick, onSlotClick }) => {
    const days = getWeekDays(pivot);
    const todayStr = isoDate(today);

    return (
        <div className="flex flex-col h-full overflow-hidden">
            {/* Day headers */}
            <div className="grid border-b border-gray-800 flex-none" style={{ gridTemplateColumns: '48px repeat(7, 1fr)' }}>
                <div />
                {days.map((d, i) => {
                    const isToday = isoDate(d) === todayStr;
                    return (
                        <div key={i} className="text-center py-2 border-l border-gray-800/50">
                            <div className="text-[10px] font-black uppercase tracking-widest text-gray-600">{DAYS[d.getDay()]}</div>
                            <div className={`text-base font-black mt-0.5 mx-auto w-8 h-8 flex items-center justify-center ${isToday ? 'bg-rhive-pink text-white shadow-pink-glow-sm' : 'text-gray-300'}`} style={isToday ? { clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)' } : {}}>
                                {d.getDate()}
                            </div>
                        </div>
                    );
                })}
            </div>
            {/* Time grid */}
            <div className="flex-1 overflow-y-auto">
                <div className="relative" style={{ gridTemplateColumns: '48px repeat(7, 1fr)' }}>
                    {HOURS.map(h => (
                        <div key={h} className="grid" style={{ gridTemplateColumns: '48px repeat(7, 1fr)', height: '60px' }}>
                            <div className="text-[9px] text-gray-700 font-bold text-right pr-2 pt-0.5 border-r border-gray-800/50">
                                {h === 0 ? '' : `${h > 12 ? h - 12 : h}${h >= 12 ? 'pm' : 'am'}`}
                            </div>
                            {days.map((day, di) => {
                                const slotDate = new Date(day);
                                slotDate.setHours(h, 0, 0, 0);
                                const slotEvents = events.filter(e => {
                                    if (isoDate(new Date(e.startDateTime)) !== isoDate(day)) return false;
                                    const startH = new Date(e.startDateTime).getHours();
                                    return startH === h;
                                });
                                return (
                                    <div
                                        key={di}
                                        onClick={() => onSlotClick(slotDate)}
                                        className="border-l border-b border-gray-800/30 hover:bg-rhive-pink/5 cursor-pointer transition-colors relative px-0.5 pt-0.5"
                                    >
                                        {slotEvents.map((ev, ei) => {
                                            const ref = React.createRef<HTMLDivElement>() as React.RefObject<HTMLElement>;
                                            return (
                                                <div
                                                    key={ei}
                                                    ref={ref as React.RefObject<HTMLDivElement>}
                                                    onClick={e => { e.stopPropagation(); onEventClick(ev, ref); }}
                                                    className={`text-[9px] font-bold px-1 py-0.5 border truncate mb-0.5 cursor-pointer hover:brightness-125 ${eventBg(ev)} ${eventText(ev)}`}
                                                    style={{ clipPath: 'polygon(3px 0, 100% 0, calc(100% - 3px) 100%, 0 100%)' }}
                                                >
                                                    {ev.title}
                                                </div>
                                            );
                                        })}
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// ─── Day View ─────────────────────────────────────────────────────────────────

interface DayViewProps {
    date: Date;
    events: RhiveCalendarEvent[];
    onEventClick: (event: RhiveCalendarEvent, ref: React.RefObject<HTMLElement>) => void;
    onSlotClick: (date: Date) => void;
}

const DayView: React.FC<DayViewProps> = ({ date, events, onEventClick, onSlotClick }) => {
    const dayStr = isoDate(date);
    const dayEvents = events.filter(e => e.startDateTime.split('T')[0] === dayStr || e.isAllDay);

    return (
        <div className="flex flex-col h-full overflow-hidden">
            <div className="border-b border-gray-800 py-3 px-4 flex-none">
                <div className="text-xs font-black uppercase tracking-widest text-gray-500">
                    {date.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                </div>
                <div className="text-sm text-gray-400 mt-0.5">{dayEvents.length} event{dayEvents.length !== 1 ? 's' : ''}</div>
            </div>
            <div className="flex-1 overflow-y-auto">
                {HOURS.map(h => {
                    const slotEvents = dayEvents.filter(e => new Date(e.startDateTime).getHours() === h && !e.isAllDay);
                    const slotDate = new Date(date);
                    slotDate.setHours(h, 0, 0, 0);
                    return (
                        <div key={h} className="grid border-b border-gray-800/30 min-h-[56px]" style={{ gridTemplateColumns: '56px 1fr' }}>
                            <div className="text-[10px] text-gray-700 font-bold text-right pr-3 pt-1 border-r border-gray-800/50">
                                {h === 0 ? '' : `${h > 12 ? h - 12 : h}:00 ${h >= 12 ? 'PM' : 'AM'}`}
                            </div>
                            <div onClick={() => onSlotClick(slotDate)} className="hover:bg-rhive-pink/5 cursor-pointer transition-colors p-1 space-y-1">
                                {slotEvents.map((ev, i) => {
                                    const ref = React.createRef<HTMLDivElement>() as React.RefObject<HTMLElement>;
                                    return (
                                        <div
                                            key={i}
                                            ref={ref as React.RefObject<HTMLDivElement>}
                                            onClick={e => { e.stopPropagation(); onEventClick(ev, ref); }}
                                            className={`px-3 py-2 border cursor-pointer hover:brightness-125 transition-all ${eventBg(ev)}`}
                                            style={{ clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)' }}
                                        >
                                            <div className={`text-xs font-bold ${eventText(ev)}`}>{ev.title}</div>
                                            <div className="text-[10px] text-gray-500 mt-0.5">{fmtTime(ev.startDateTime)} – {fmtTime(ev.endDateTime)}{ev.location && ` · ${ev.location}`}</div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// ─── Main Page ────────────────────────────────────────────────────────────────

type ViewMode = 'month' | 'week' | 'day';

const MyCalendarPage: React.FC = () => {
    const { currentUser } = useMockDB();
    const today = new Date();
    const [view, setView] = useState<ViewMode>('month');
    const [pivot, setPivot] = useState(new Date());
    const [events, setEvents] = useState<RhiveCalendarEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);
    const [syncStatus, setSyncStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [syncMsg, setSyncMsg] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [prefillDate, setPrefillDate] = useState<string>('');
    const [selectedEvent, setSelectedEvent] = useState<RhiveCalendarEvent | null>(null);
    const [accessToken, setAccessToken] = useState<string>('');
    const [lastSync, setLastSync] = useState<string>('');

    // Load events from Firestore on mount
    useEffect(() => {
        if (!currentUser?.id) return;
        setLoading(true);
        getUserCalendarEvents(currentUser.id).then(evs => {
            setEvents(evs);
            if (evs.length > 0) {
                const latest = evs.reduce((a, b) => a.syncedAt > b.syncedAt ? a : b);
                setLastSync(latest.syncedAt);
            }
            setLoading(false);
        });
    }, [currentUser?.id]);

    // Navigation
    const navigate = (dir: 1 | -1) => {
        const d = new Date(pivot);
        if (view === 'month') d.setMonth(d.getMonth() + dir);
        else if (view === 'week') d.setDate(d.getDate() + 7 * dir);
        else d.setDate(d.getDate() + dir);
        setPivot(d);
    };

    const navLabel = () => {
        if (view === 'month') return `${MONTHS[pivot.getMonth()]} ${pivot.getFullYear()}`;
        if (view === 'week') {
            const w = getWeekDays(pivot);
            return `${w[0].toLocaleDateString([], { month: 'short', day: 'numeric' })} – ${w[6].toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}`;
        }
        return pivot.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });
    };

    // Google Calendar Sync
    const handleSync = useCallback(async () => {
        if (!currentUser) return;
        setSyncing(true);
        setSyncStatus('idle');
        setSyncMsg('');
        try {
            const result = await syncUserGoogleCalendar(currentUser.id, currentUser.email || '');
            if (result.success) {
                setEvents(result.events);
                setAccessToken(result.accessToken || '');
                setLastSync(new Date().toISOString());
                setSyncStatus('success');
                setSyncMsg(`Synced ${result.eventsCount} events from Google Calendar`);
            } else {
                setSyncStatus('error');
                setSyncMsg(result.error || 'Sync failed.');
            }
        } catch (e: any) {
            setSyncStatus('error');
            setSyncMsg(e.message || 'An unexpected error occurred.');
        } finally {
            setSyncing(false);
            setTimeout(() => setSyncStatus('idle'), 5000);
        }
    }, [currentUser]);

    // Add event
    const handleAddEvent = async (payload: CreateEventPayload & { pushToGoogle: boolean }) => {
        if (!currentUser) return;
        let newEvent: RhiveCalendarEvent | null = null;

        if (payload.pushToGoogle && accessToken) {
            newEvent = await createGoogleCalendarEvent(accessToken, currentUser.id, currentUser.email || '', payload);
        }

        if (!newEvent) {
            // Fallback to RHIVE-native event (or if pushToGoogle not requested)
            newEvent = await createRhiveEvent(currentUser.id, currentUser.email || '', payload);
        }

        if (newEvent) {
            setEvents(prev => [...prev, newEvent!].sort((a, b) => a.startDateTime.localeCompare(b.startDateTime)));
        }
    };

    // Delete event
    const handleDeleteEvent = async (event: RhiveCalendarEvent) => {
        await deleteCalendarEvent(event.id, event.googleEventId || undefined, accessToken || undefined);
        setEvents(prev => prev.filter(e => e.id !== event.id));
    };

    const handleDayClick = (date: Date) => {
        if (view === 'month') {
            setPivot(new Date(date));
            setView('day');
        } else {
            setPrefillDate(isoDate(date));
            setShowAddModal(true);
        }
    };

    const handleSlotClick = (date: Date) => {
        setPrefillDate(toLocalInputDatetime(date.toISOString()));
        setShowAddModal(true);
    };

    const handleEventClick = (event: RhiveCalendarEvent, _ref: React.RefObject<HTMLElement>) => {
        setSelectedEvent(event);
    };

    // Compact stats
    const upcomingCount = events.filter(e => new Date(e.startDateTime) >= today).length;
    const googleCount = events.filter(e => e.source === 'google').length;
    const rhiveCount = events.filter(e => e.source === 'rhive').length;

    const cardChamfer = 'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)';

    return (
        <div className="flex flex-col h-screen bg-black text-white overflow-hidden">
            {/* ── Header ──────────────────────────────────────────────────── */}
            <div className="flex-none px-6 pt-6 pb-4 border-b border-gray-900">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div>
                        <h1 className="text-2xl font-black uppercase tracking-widest text-white flex items-center gap-3">
                            <CalendarDaysIcon className="w-7 h-7 text-rhive-pink" />
                            My Calendar
                        </h1>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600 mt-0.5">
                            {currentUser?.name} · {upcomingCount} upcoming · {lastSync ? `Synced ${new Date(lastSync).toLocaleDateString()}` : 'Not synced yet'}
                        </p>
                    </div>

                    <div className="flex items-center gap-3 flex-wrap">
                        {/* Sync status */}
                        {syncStatus === 'success' && <p className="text-[10px] font-bold text-green-400 animate-pulse">✓ {syncMsg}</p>}
                        {syncStatus === 'error' && <p className="text-[10px] font-bold text-red-400 max-w-xs text-right">{syncMsg}</p>}

                        {/* Sync button */}
                        <button
                            onClick={handleSync}
                            disabled={syncing}
                            className="flex items-center gap-2 px-4 h-9 text-[10px] font-black uppercase tracking-widest border border-gray-700 text-gray-400 hover:border-rhive-pink hover:text-rhive-pink disabled:opacity-40 transition-all"
                            style={{ clipPath: 'polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)' }}
                        >
                            <ArrowPathIcon className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
                            {syncing ? 'Syncing…' : 'Sync Google'}
                        </button>

                        {/* Add event */}
                        <button
                            onClick={() => { setPrefillDate(''); setShowAddModal(true); }}
                            className="flex items-center gap-2 px-4 h-9 text-[10px] font-black uppercase tracking-widest bg-rhive-pink text-white hover:bg-pink-500 transition-colors shadow-pink-glow-sm"
                            style={{ clipPath: 'polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)' }}
                        >
                            <PlusIcon className="w-3.5 h-3.5" />
                            Add Event
                        </button>
                    </div>
                </div>

                {/* Stats strip */}
                <div className="flex items-center gap-6 mt-4">
                    <div className="text-[10px] text-gray-600 font-bold uppercase tracking-widest flex items-center gap-2">
                        <span className="w-2 h-2 bg-rhive-pink" style={{ clipPath: 'polygon(2px 0, 100% 0, calc(100% - 2px) 100%, 0 100%)' }} />
                        {googleCount} Google
                    </div>
                    <div className="text-[10px] text-gray-600 font-bold uppercase tracking-widest flex items-center gap-2">
                        <span className="w-2 h-2 bg-yellow-500" style={{ clipPath: 'polygon(2px 0, 100% 0, calc(100% - 2px) 100%, 0 100%)' }} />
                        {rhiveCount} RHIVE
                    </div>
                    <div className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">{events.length} Total</div>
                </div>
            </div>

            {/* ── Toolbar ─────────────────────────────────────────────────── */}
            <div className="flex-none flex items-center justify-between px-6 py-3 border-b border-gray-900">
                {/* View switcher */}
                <div className="flex border border-gray-800" style={{ clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)' }}>
                    {(['month', 'week', 'day'] as ViewMode[]).map(v => (
                        <button
                            key={v}
                            onClick={() => setView(v)}
                            className={`px-4 h-8 text-[10px] font-black uppercase tracking-widest transition-colors ${view === v ? 'bg-rhive-pink text-white' : 'text-gray-600 hover:text-gray-300'}`}
                        >
                            {v}
                        </button>
                    ))}
                </div>

                {/* Navigation */}
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate(-1)} className="w-8 h-8 flex items-center justify-center border border-gray-800 hover:border-gray-600 text-gray-500 hover:text-white transition-colors" style={{ clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' }}>
                        <ChevronLeftIcon className="w-4 h-4" />
                    </button>
                    <button onClick={() => setPivot(new Date())} className="px-3 h-8 text-[10px] font-black uppercase tracking-widest border border-gray-800 hover:border-rhive-pink hover:text-rhive-pink text-gray-500 transition-colors" style={{ clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' }}>
                        Today
                    </button>
                    <span className="text-sm font-black text-white min-w-[200px] text-center">{navLabel()}</span>
                    <button onClick={() => navigate(1)} className="w-8 h-8 flex items-center justify-center border border-gray-800 hover:border-gray-600 text-gray-500 hover:text-white transition-colors" style={{ clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' }}>
                        <ChevronRightIcon className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* ── Calendar Grid ────────────────────────────────────────────── */}
            <div className="flex-1 overflow-hidden mx-6 mb-6 mt-4 relative" style={{ clipPath: cardChamfer }}>
                {/* Frame bg */}
                <div className="absolute inset-0" style={{ clipPath: cardChamfer }}>
                    <PlexusShape backgroundColor="#000000" dotColor="#ec028b" lineColor="236, 2, 139" density={20} className="w-full h-full" />
                    <div className="absolute inset-0 bg-black/85" />
                </div>
                {/* Chamfer border accents */}
                <div className="absolute left-0 top-5 bottom-0 w-px bg-gray-800 z-10" />
                <div className="absolute right-0 top-0 bottom-5 w-px bg-gray-800 z-10" />
                <div className="absolute left-5 right-0 top-0 h-px bg-gray-800 z-10" />
                <div className="absolute left-0 right-5 bottom-0 h-px bg-gray-800 z-10" />
                <svg className="absolute top-0 left-0 w-5 h-5 z-20 overflow-visible pointer-events-none"><line x1="0" y1="20" x2="20" y2="0" stroke="#374151" strokeWidth="1" /><line x1="6" y1="14" x2="14" y2="6" stroke="#ec028b" strokeWidth="2" /></svg>
                <svg className="absolute bottom-0 right-0 w-5 h-5 z-20 overflow-visible pointer-events-none"><line x1="0" y1="20" x2="20" y2="0" stroke="#374151" strokeWidth="1" /><line x1="6" y1="14" x2="14" y2="6" stroke="#ec028b" strokeWidth="2" /></svg>

                <div className="relative z-10 h-full overflow-hidden">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-full gap-4">
                            <ArrowPathIcon className="w-8 h-8 text-rhive-pink animate-spin" />
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-600">Loading events…</p>
                        </div>
                    ) : events.length === 0 && !loading ? (
                        <div className="flex flex-col items-center justify-center h-full gap-6 text-center px-8">
                            <CalendarDaysIcon className="w-16 h-16 text-gray-800" />
                            <div>
                                <h3 className="text-base font-black uppercase tracking-widest text-gray-500 mb-2">No Events Yet</h3>
                                <p className="text-xs text-gray-700 max-w-sm">Connect your Google Calendar to import events, or create a new RHIVE event below.</p>
                            </div>
                            <div className="flex gap-3 flex-wrap justify-center">
                                <button onClick={handleSync} disabled={syncing} className="flex items-center gap-2 px-5 h-10 text-[10px] font-black uppercase tracking-widest border border-gray-700 text-gray-400 hover:border-rhive-pink hover:text-rhive-pink transition-all" style={{ clipPath: 'polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)' }}>
                                    <ArrowPathIcon className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} /> Sync Google Calendar
                                </button>
                                <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 px-5 h-10 text-[10px] font-black uppercase tracking-widest bg-rhive-pink text-white hover:bg-pink-500 transition-colors" style={{ clipPath: 'polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)' }}>
                                    <PlusIcon className="w-4 h-4" /> Add Event
                                </button>
                            </div>
                        </div>
                    ) : view === 'month' ? (
                        <MonthView
                            year={pivot.getFullYear()}
                            month={pivot.getMonth()}
                            events={events}
                            today={today}
                            onDayClick={handleDayClick}
                            onEventClick={handleEventClick}
                        />
                    ) : view === 'week' ? (
                        <WeekView
                            pivot={pivot}
                            events={events}
                            today={today}
                            onEventClick={handleEventClick}
                            onSlotClick={handleSlotClick}
                        />
                    ) : (
                        <DayView
                            date={pivot}
                            events={events}
                            onEventClick={handleEventClick}
                            onSlotClick={handleSlotClick}
                        />
                    )}
                </div>
            </div>

            {/* Modals */}
            <AddEventModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                onAdd={handleAddEvent}
                prefillDate={prefillDate}
                hasGoogleAccess={!!accessToken}
            />

            {selectedEvent && (
                <EventDetail
                    event={selectedEvent}
                    onClose={() => setSelectedEvent(null)}
                    onDelete={handleDeleteEvent}
                    anchorRef={React.createRef()}
                />
            )}
        </div>
    );
};

export default MyCalendarPage;
