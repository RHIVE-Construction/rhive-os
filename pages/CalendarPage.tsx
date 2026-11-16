import React, { useState, useEffect, useMemo } from 'react';
import PageContainer from '../components/PageContainer';
import Button from '../components/Button';
import CircuitryCard from '../components/CircuitryCard';
import { useNavigation } from '../contexts/NavigationContext';
import { useMockDB } from '../contexts/MockDatabaseContext';
import { 
    CalendarDaysIcon, 
    ClockIcon, 
    PlusIcon, 
    ChevronRightIcon, 
    ChevronDownIcon, 
    ArrowRightIcon, 
    UserIcon, 
    PhoneIcon, 
    WrenchIcon, 
    ShieldCheckIcon,
    TasksIcon,
    XIcon,
    Check
} from '../components/icons';
import { cn } from '../lib/utils';
import type { CrmCalendarEvent, CalendarEventCategory, CrmTask } from '../types';

// Seed events demonstrating unified Inspections, Work/Installs, Tasks, and Calls
const SEED_EVENTS: CrmCalendarEvent[] = [
    {
        id: 'EVT-001',
        title: 'Roof Inspection & Drone Scan',
        category: 'inspection',
        date: '2026-11-16',
        startTime: '10:00 AM',
        endTime: '11:30 AM',
        isAllDay: false,
        client_name: 'Brad Baird',
        campus_name: 'Baird Residence',
        building_name: 'Main Residence',
        assigned_user: 'Chad Evenhuis',
        location: 'Salt Lake City, UT',
        description: 'High resolution aerial drone inspection for storm damage documentation.'
    },
    {
        id: 'EVT-002',
        title: 'Follow Up Call - Owens Corning Duration Signing',
        category: 'task',
        date: '2026-11-16',
        startTime: 'All day',
        isAllDay: true,
        client_name: 'UNPHC (Utah Non-Profit Housing Corp)',
        campus_name: 'Smith Apartments Campus',
        building_name: 'Building B',
        assigned_user: 'Kara',
        description: 'Call Dan Corkill regarding the board-approved commercial roofing contract.'
    },
    {
        id: 'EVT-003',
        title: 'Tear-Off & Underlayment Installation (Crew 1)',
        category: 'work',
        date: '2026-11-17',
        startTime: '7:30 AM',
        endTime: '4:00 PM',
        isAllDay: false,
        client_name: 'UNPHC (Utah Non-Profit Housing Corp)',
        campus_name: 'Willow Park Apartments Campus',
        building_name: 'Clubhouse Structure',
        assigned_user: 'Kara',
        location: 'West Valley City, UT',
        description: '6-man crew dispatch for complete shingle tear-off, synthetic underlayment, and ice/water barrier installation.'
    },
    {
        id: 'EVT-004',
        title: 'Check Supplier Delivery (TPO Membrane & Polyiso)',
        category: 'task',
        date: '2026-11-17',
        startTime: '3:00 PM',
        endTime: '3:30 PM',
        isAllDay: false,
        client_name: 'UNPHC (Utah Non-Profit Housing Corp)',
        campus_name: 'Smith Apartments Campus',
        building_name: 'Building A (Main)',
        assigned_user: 'Kara',
        description: 'Verify 60mil TPO roll delivery and polyiso insulation bundles.'
    },
    {
        id: 'EVT-005',
        title: 'Follow Up Call - Anthony & Chelsea Cox',
        category: 'call',
        date: '2026-11-18',
        startTime: '2:00 PM',
        endTime: '2:30 PM',
        isAllDay: false,
        client_name: 'Anthony & Chelsea Cox',
        campus_name: 'Cox Estate',
        assigned_user: 'Victor',
        description: 'Walkthrough of State Farm insurance adjustment items and heat trace cable specs.'
    },
    {
        id: 'EVT-006',
        title: 'Final Quality Punch List & Drone Certification',
        category: 'inspection',
        date: '2026-11-19',
        startTime: '1:00 PM',
        endTime: '2:30 PM',
        isAllDay: false,
        client_name: 'Jennifer Boulden',
        campus_name: 'Boulden Property',
        assigned_user: 'Chad Evenhuis',
        location: 'Sandy, UT',
        description: 'Pre-warranty signoff: flashing, pipe boots, ridge vent installation verification.'
    },
    {
        id: 'EVT-007',
        title: 'Flat Roof TPO Hot-Air Welding',
        category: 'work',
        date: '2026-11-20',
        startTime: '8:00 AM',
        endTime: '5:00 PM',
        isAllDay: false,
        client_name: 'UNPHC (Utah Non-Profit Housing Corp)',
        campus_name: 'Smith Apartments Campus',
        building_name: 'Building B',
        assigned_user: 'Chad Evenhuis',
        description: 'Heat welding field seams and flashing parapet walls.'
    }
];

export const CalendarPage: React.FC = () => {
    const { setActivePageId, setSelectedAccountId } = useNavigation();
    const { currentUser } = useMockDB();

    // Calendar events state
    const [events, setEvents] = useState<CrmCalendarEvent[]>(() => {
        try {
            const saved = localStorage.getItem('rhive_crm_events');
            if (saved) return JSON.parse(saved);
        } catch { /* ignore */ }
        return SEED_EVENTS;
    });

    useEffect(() => {
        try {
            localStorage.setItem('rhive_crm_events', JSON.stringify(events));
        } catch { /* ignore */ }
    }, [events]);

    // Current viewed date & navigation
    const [currentDate, setCurrentDate] = useState<Date>(new Date(2026, 10, 16)); // Nov 16, 2026
    const [viewMode, setViewMode] = useState<'day' | 'week' | 'month' | 'agenda'>('week');
    const [selectedUserFilter, setSelectedUserFilter] = useState<string>('All Users');

    // Category visibility toggles
    const [visibleCategories, setVisibleCategories] = useState<{
        inspection: boolean;
        work: boolean;
        task: boolean;
        call: boolean;
    }>({
        inspection: true,
        work: true,
        task: true,
        call: true
    });

    // Selected event for modal view
    const [selectedEvent, setSelectedEvent] = useState<CrmCalendarEvent | null>(null);

    // Add Event Modal
    const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);
    const [newEventForm, setNewEventForm] = useState({
        title: '',
        category: 'inspection' as CalendarEventCategory,
        date: '2026-11-16',
        startTime: '10:00 AM',
        endTime: '11:00 AM',
        isAllDay: false,
        client_name: 'UNPHC (Utah Non-Profit Housing Corp)',
        campus_name: 'Smith Apartments Campus',
        building_name: 'Building B',
        assigned_user: 'Kara',
        location: 'Salt Lake City, UT',
        description: ''
    });

    // Toggle Category
    const toggleCategory = (cat: CalendarEventCategory) => {
        setVisibleCategories(prev => ({ ...prev, [cat]: !prev[cat] }));
    };

    // Filter events by category and user
    const filteredEvents = useMemo(() => {
        return events.filter(evt => {
            // Category toggle
            if (!visibleCategories[evt.category]) return false;

            // User filter
            if (selectedUserFilter !== 'All Users') {
                if (selectedUserFilter === 'Me') {
                    const myName = currentUser?.name || 'Kara';
                    if (evt.assigned_user.toLowerCase() !== myName.toLowerCase()) return false;
                } else if (evt.assigned_user !== selectedUserFilter) {
                    return false;
                }
            }

            return true;
        });
    }, [events, visibleCategories, selectedUserFilter, currentUser]);

    // Week days calculation (Sunday to Saturday)
    const weekDays = useMemo(() => {
        const start = new Date(currentDate);
        const day = start.getDay();
        start.setDate(start.getDate() - day); // Sunday

        const days = [];
        for (let i = 0; i < 7; i++) {
            const d = new Date(start);
            d.setDate(start.getDate() + i);
            const iso = d.toISOString().split('T')[0];
            days.push({
                date: d,
                iso,
                dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
                dayNum: d.getDate(),
                isToday: iso === new Date().toISOString().split('T')[0],
                isSelected: iso === currentDate.toISOString().split('T')[0]
            });
        }
        return days;
    }, [currentDate]);

    // Month days calculation
    const monthDays = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const grid = [];
        // Empty slots for previous month
        for (let i = 0; i < firstDay; i++) {
            grid.push(null);
        }
        // Month days
        for (let d = 1; d <= daysInMonth; d++) {
            const dateObj = new Date(year, month, d);
            const iso = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            grid.push({
                dayNum: d,
                iso,
                date: dateObj,
                isToday: iso === new Date().toISOString().split('T')[0],
                isSelected: iso === currentDate.toISOString().split('T')[0]
            });
        }
        return grid;
    }, [currentDate]);

    // Format current title
    const headerTitle = useMemo(() => {
        return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }, [currentDate]);

    // Navigate Date
    const handlePrev = () => {
        const d = new Date(currentDate);
        if (viewMode === 'day') d.setDate(d.getDate() - 1);
        else if (viewMode === 'week') d.setDate(d.getDate() - 7);
        else d.setMonth(d.getMonth() - 1);
        setCurrentDate(d);
    };

    const handleNext = () => {
        const d = new Date(currentDate);
        if (viewMode === 'day') d.setDate(d.getDate() + 1);
        else if (viewMode === 'week') d.setDate(d.getDate() + 7);
        else d.setMonth(d.getMonth() + 1);
        setCurrentDate(d);
    };

    const handleToday = () => {
        setCurrentDate(new Date(2026, 10, 16));
    };

    // Category styling helper
    const getCategoryBadge = (category: CalendarEventCategory) => {
        switch (category) {
            case 'inspection':
                return {
                    bg: 'bg-cyan-500/10',
                    border: 'border-cyan-500/40',
                    text: 'text-cyan-400',
                    dot: 'bg-cyan-400',
                    label: 'Inspection'
                };
            case 'work':
                return {
                    bg: 'bg-orange-500/10',
                    border: 'border-orange-500/40',
                    text: 'text-orange-400',
                    dot: 'bg-orange-400',
                    label: 'Work / Install'
                };
            case 'task':
                return {
                    bg: 'bg-rhive-pink/10',
                    border: 'border-rhive-pink/40',
                    text: 'text-rhive-pink',
                    dot: 'bg-rhive-pink',
                    label: 'Task'
                };
            case 'call':
                return {
                    bg: 'bg-green-500/10',
                    border: 'border-green-500/40',
                    text: 'text-green-400',
                    dot: 'bg-green-400',
                    label: 'Call'
                };
        }
    };

    // Handle Create Event
    const handleCreateEvent = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newEventForm.title.trim()) return;

        const newEvt: CrmCalendarEvent = {
            id: `EVT-${Date.now()}`,
            title: newEventForm.title,
            category: newEventForm.category,
            date: newEventForm.date,
            startTime: newEventForm.isAllDay ? 'All day' : newEventForm.startTime,
            endTime: newEventForm.isAllDay ? undefined : newEventForm.endTime,
            isAllDay: newEventForm.isAllDay,
            client_name: newEventForm.client_name,
            campus_name: newEventForm.campus_name,
            building_name: newEventForm.building_name,
            assigned_user: newEventForm.assigned_user,
            location: newEventForm.location,
            description: newEventForm.description
        };

        setEvents(prev => [...prev, newEvt]);
        setIsAddEventModalOpen(false);
    };

    return (
        <PageContainer
            title="Calendar & Dispatch"
            subtitle="Unified scheduling for roof inspections, contractor installations, and client follow-ups"
        >
            <div className="space-y-4">
                {/* ── TOP HEADER ACTION BAR ─────────────────────────────────────── */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 bg-black/60 border border-gray-800 rounded-lg">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-rhive-pink/10 border border-rhive-pink/20 rounded-lg text-rhive-pink">
                            <CalendarDaysIcon className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-black text-white flex items-center gap-2">
                                {headerTitle}
                            </h2>
                            <p className="text-xs text-gray-400 font-mono">
                                Live dispatch timeline synchronized with Tasks & Stage Pipeline
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Navigation < Today > */}
                        <div className="flex items-center bg-gray-950 border border-gray-800 rounded-lg p-0.5 font-mono text-xs">
                            <button 
                                onClick={handlePrev}
                                className="px-2.5 py-1 text-gray-400 hover:text-white rounded hover:bg-gray-800 transition-colors"
                            >
                                ‹
                            </button>
                            <button 
                                onClick={handleToday}
                                className="px-3 py-1 font-bold text-white rounded hover:bg-gray-800 transition-colors"
                            >
                                Today
                            </button>
                            <button 
                                onClick={handleNext}
                                className="px-2.5 py-1 text-gray-400 hover:text-white rounded hover:bg-gray-800 transition-colors"
                            >
                                ›
                            </button>
                        </div>

                        {/* View Switchers: Day, Week, Month, Agenda */}
                        <div className="flex items-center bg-gray-950 border border-gray-800 rounded-lg p-0.5 font-mono text-xs">
                            {(['day', 'week', 'month', 'agenda'] as const).map(v => (
                                <button
                                    key={v}
                                    onClick={() => setViewMode(v)}
                                    className={cn(
                                        "px-3 py-1 rounded font-bold capitalize transition-all",
                                        viewMode === v ? "bg-rhive-pink text-white shadow-sm" : "text-gray-400 hover:text-white"
                                    )}
                                >
                                    {v}
                                </button>
                            ))}
                        </div>

                        {/* User Selector */}
                        <div className="flex items-center gap-1.5 bg-gray-950 border border-gray-800 px-2.5 py-1 rounded-lg text-xs font-mono">
                            <UserIcon className="w-3.5 h-3.5 text-rhive-pink" />
                            <select
                                value={selectedUserFilter}
                                onChange={e => setSelectedUserFilter(e.target.value)}
                                className="bg-transparent text-white font-bold focus:outline-none cursor-pointer"
                            >
                                <option value="All Users" className="bg-gray-950">All Users</option>
                                <option value="Kara" className="bg-gray-950">Kara</option>
                                <option value="Chad Evenhuis" className="bg-gray-950">Chad Evenhuis</option>
                                <option value="Victor" className="bg-gray-950">Victor</option>
                                <option value="Me" className="bg-gray-950">Me</option>
                            </select>
                        </div>

                        <Button 
                            variant="primary" 
                            size="sm"
                            onClick={() => setIsAddEventModalOpen(true)}
                            className="flex items-center gap-1.5"
                        >
                            <PlusIcon className="w-4 h-4" />
                            Add Event
                        </Button>
                    </div>
                </div>

                {/* ── 2-COLUMN MAIN LAYOUT: MINI CALENDAR & MAIN SCHEDULE ───────── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                    
                    {/* LEFT PANEL: MINI CALENDAR & CATEGORY FILTERS ────────────────── */}
                    <div className="lg:col-span-3 space-y-4">
                        
                        {/* Mini Calendar Card */}
                        <div className="p-4 bg-black/70 border border-gray-800 rounded-lg">
                            <div className="flex items-center justify-between font-mono text-xs mb-3 font-bold text-white">
                                <span>{headerTitle}</span>
                                <div className="flex items-center gap-1">
                                    <button onClick={handlePrev} className="px-1.5 py-0.5 text-gray-400 hover:text-white">‹</button>
                                    <button onClick={handleNext} className="px-1.5 py-0.5 text-gray-400 hover:text-white">›</button>
                                </div>
                            </div>

                            {/* Day Headers */}
                            <div className="grid grid-cols-7 gap-1 text-center font-mono text-[10px] text-gray-500 mb-1">
                                <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
                            </div>

                            {/* Day Grid */}
                            <div className="grid grid-cols-7 gap-1 text-center font-mono text-xs">
                                {monthDays.map((d, i) => {
                                    if (!d) return <div key={i} className="h-7" />;
                                    const hasEvents = events.some(e => e.date === d.iso);
                                    return (
                                        <button
                                            key={i}
                                            onClick={() => setCurrentDate(d.date)}
                                            className={cn(
                                                "h-7 rounded flex items-center justify-center transition-colors relative",
                                                d.isSelected ? "bg-rhive-pink text-white font-bold shadow-sm" : "hover:bg-gray-800 text-gray-300",
                                                d.isToday && !d.isSelected && "border border-rhive-pink text-rhive-pink"
                                            )}
                                        >
                                            <span>{d.dayNum}</span>
                                            {hasEvents && !d.isSelected && (
                                                <span className="w-1 h-1 rounded-full bg-rhive-pink absolute bottom-0.5" />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Category Visibility Toggles */}
                        <div className="p-4 bg-black/70 border border-gray-800 rounded-lg space-y-2.5 font-mono text-xs">
                            <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider block">
                                Event Categories
                            </span>

                            {[
                                { id: 'inspection', label: 'Inspections & Scans', icon: <ShieldCheckIcon className="w-3.5 h-3.5 text-cyan-400" />, dot: 'bg-cyan-400' },
                                { id: 'work', label: 'Work / Installations', icon: <WrenchIcon className="w-3.5 h-3.5 text-orange-400" />, dot: 'bg-orange-400' },
                                { id: 'task', label: 'Tasks (Follow Ups)', icon: <TasksIcon className="w-3.5 h-3.5 text-rhive-pink" />, dot: 'bg-rhive-pink' },
                                { id: 'call', label: 'Calls & Appointments', icon: <PhoneIcon className="w-3.5 h-3.5 text-green-400" />, dot: 'bg-green-400' },
                            ].map(cat => {
                                const active = visibleCategories[cat.id as CalendarEventCategory];
                                return (
                                    <button
                                        key={cat.id}
                                        type="button"
                                        onClick={() => toggleCategory(cat.id as CalendarEventCategory)}
                                        className={cn(
                                            "w-full flex items-center justify-between p-2 rounded border transition-all text-left cursor-pointer",
                                            active ? "bg-gray-900 border-gray-700 text-white font-bold" : "bg-black/40 border-gray-800/60 text-gray-500"
                                        )}
                                    >
                                        <span className="flex items-center gap-2">
                                            <span className={cn("w-2 h-2 rounded-full", active ? cat.dot : "bg-gray-700")} />
                                            {cat.icon}
                                            <span className="text-[11px]">{cat.label}</span>
                                        </span>
                                        {active && <Check className="w-3.5 h-3.5 text-rhive-pink" />}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Selected Day Agenda */}
                        <div className="p-4 bg-black/70 border border-gray-800 rounded-lg space-y-2">
                            <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider block font-mono">
                                {currentDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} Agenda
                            </span>

                            {filteredEvents.filter(e => e.date === currentDate.toISOString().split('T')[0]).length === 0 ? (
                                <p className="text-xs text-gray-500 font-mono italic">No events scheduled for this day.</p>
                            ) : (
                                filteredEvents.filter(e => e.date === currentDate.toISOString().split('T')[0]).map(evt => {
                                    const badge = getCategoryBadge(evt.category);
                                    return (
                                        <div
                                            key={evt.id}
                                            onClick={() => setSelectedEvent(evt)}
                                            className={cn(
                                                "p-2.5 rounded border text-left cursor-pointer transition-all font-mono",
                                                badge.bg, badge.border, "hover:opacity-90"
                                            )}
                                        >
                                            <div className="flex items-center justify-between text-[10px] text-gray-400 mb-0.5">
                                                <span className={badge.text}>{badge.label}</span>
                                                <span>{evt.startTime}</span>
                                            </div>
                                            <h5 className="font-bold text-xs text-white truncate">{evt.title}</h5>
                                            <span className="text-[10px] text-gray-400 block truncate">🏢 {evt.client_name}</span>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* RIGHT PANEL: MAIN SCHEDULE VIEW (WEEK / MONTH / DAY) ───────── */}
                    <div className="lg:col-span-9 bg-black/70 border border-gray-800 rounded-lg p-4 overflow-hidden">
                        
                        {/* ── WEEK VIEW (Follow Up Boss Style Grid) ────────────────── */}
                        {viewMode === 'week' && (
                            <div className="space-y-4">
                                {/* Week Days Header Columns */}
                                <div className="grid grid-cols-7 gap-2 border-b border-gray-800 pb-3">
                                    {weekDays.map((d, idx) => (
                                        <div 
                                            key={idx}
                                            onClick={() => setCurrentDate(d.date)}
                                            className={cn(
                                                "p-2 rounded text-center cursor-pointer transition-colors font-mono",
                                                d.isSelected ? "bg-rhive-pink/20 border border-rhive-pink/40" : "hover:bg-gray-900"
                                            )}
                                        >
                                            <span className="text-[10px] text-gray-500 uppercase block">{d.dayName}</span>
                                            <span className={cn(
                                                "text-lg font-bold block",
                                                d.isToday ? "text-rhive-pink" : "text-white"
                                            )}>
                                                {d.dayNum}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                {/* Events Columns Grid */}
                                <div className="grid grid-cols-7 gap-2 min-h-[500px]">
                                    {weekDays.map((d, colIdx) => {
                                        const dayEvents = filteredEvents.filter(e => e.date === d.iso);
                                        return (
                                            <div key={colIdx} className="border-r border-gray-800/60 last:border-r-0 pr-1 space-y-2">
                                                {dayEvents.map(evt => {
                                                    const badge = getCategoryBadge(evt.category);
                                                    return (
                                                        <div
                                                            key={evt.id}
                                                            onClick={() => setSelectedEvent(evt)}
                                                            className={cn(
                                                                "p-2.5 rounded border text-left cursor-pointer transition-all hover:scale-[1.02] shadow-sm",
                                                                badge.bg, badge.border
                                                            )}
                                                        >
                                                            <div className="flex items-center justify-between text-[9px] font-mono text-gray-400 mb-1">
                                                                <span className={cn("font-bold", badge.text)}>{badge.label}</span>
                                                                <span>{evt.startTime}</span>
                                                            </div>
                                                            <h5 className="font-bold text-xs text-white leading-tight font-sans mb-1 line-clamp-2">
                                                                {evt.title}
                                                            </h5>
                                                            {evt.client_name && (
                                                                <span className="text-[10px] font-mono text-gray-400 block truncate">
                                                                    🏢 {evt.client_name}
                                                                </span>
                                                            )}
                                                            <div className="mt-2 flex items-center justify-between text-[9px] font-mono text-gray-500 pt-1 border-t border-gray-800/80">
                                                                <span>👤 {evt.assigned_user}</span>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* ── MONTH VIEW ───────────────────────────────────────────── */}
                        {viewMode === 'month' && (
                            <div className="space-y-2 font-mono">
                                <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-gray-500 border-b border-gray-800 pb-2">
                                    <span>Sunday</span><span>Monday</span><span>Tuesday</span><span>Wednesday</span><span>Thursday</span><span>Friday</span><span>Saturday</span>
                                </div>
                                <div className="grid grid-cols-7 gap-1">
                                    {monthDays.map((d, i) => {
                                        if (!d) return <div key={i} className="min-h-[90px] bg-black/20 rounded border border-gray-900" />;
                                        const dayEvents = filteredEvents.filter(e => e.date === d.iso);
                                        return (
                                            <div
                                                key={i}
                                                onClick={() => setCurrentDate(d.date)}
                                                className={cn(
                                                    "min-h-[90px] p-1.5 rounded border text-left transition-colors cursor-pointer flex flex-col justify-between",
                                                    d.isSelected ? "border-rhive-pink bg-rhive-pink/10" : "border-gray-800/60 bg-black/40 hover:bg-gray-900/40"
                                                )}
                                            >
                                                <div className="flex items-center justify-between text-xs font-bold">
                                                    <span className={d.isToday ? "text-rhive-pink" : "text-white"}>{d.dayNum}</span>
                                                    {dayEvents.length > 0 && (
                                                        <span className="text-[10px] text-gray-500">{dayEvents.length}</span>
                                                    )}
                                                </div>

                                                <div className="space-y-1 mt-1">
                                                    {dayEvents.slice(0, 2).map(evt => {
                                                        const badge = getCategoryBadge(evt.category);
                                                        return (
                                                            <div 
                                                                key={evt.id}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setSelectedEvent(evt);
                                                                }}
                                                                className={cn("px-1 py-0.5 rounded text-[9px] font-mono truncate border", badge.bg, badge.border, badge.text)}
                                                            >
                                                                {evt.title}
                                                            </div>
                                                        );
                                                    })}
                                                    {dayEvents.length > 2 && (
                                                        <span className="text-[9px] text-gray-500 block">+{dayEvents.length - 2} more</span>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* ── DAY VIEW ─────────────────────────────────────────────── */}
                        {viewMode === 'day' && (
                            <div className="space-y-3 font-mono">
                                <h3 className="text-sm font-bold text-white border-b border-gray-800 pb-2">
                                    Schedule for {currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                                </h3>
                                {filteredEvents.filter(e => e.date === currentDate.toISOString().split('T')[0]).length === 0 ? (
                                    <div className="p-12 text-center text-gray-500 text-xs">
                                        No events scheduled on this day.
                                    </div>
                                ) : (
                                    filteredEvents.filter(e => e.date === currentDate.toISOString().split('T')[0]).map(evt => {
                                        const badge = getCategoryBadge(evt.category);
                                        return (
                                            <div
                                                key={evt.id}
                                                onClick={() => setSelectedEvent(evt)}
                                                className={cn("p-4 rounded-lg border text-left cursor-pointer", badge.bg, badge.border)}
                                            >
                                                <div className="flex items-center justify-between text-xs mb-1">
                                                    <span className={cn("font-bold uppercase", badge.text)}>{badge.label}</span>
                                                    <span className="text-gray-400">{evt.startTime} - {evt.endTime || 'End'}</span>
                                                </div>
                                                <h4 className="text-base font-bold text-white mb-1">{evt.title}</h4>
                                                <p className="text-xs text-gray-400 mb-2">{evt.description}</p>
                                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                                    <span>🏢 {evt.client_name}</span>
                                                    <span>👤 {evt.assigned_user}</span>
                                                    {evt.location && <span>📍 {evt.location}</span>}
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        )}

                        {/* ── AGENDA VIEW ──────────────────────────────────────────── */}
                        {viewMode === 'agenda' && (
                            <div className="space-y-3 font-mono">
                                <h3 className="text-sm font-bold text-white border-b border-gray-800 pb-2">
                                    All Upcoming Scheduled Work, Inspections & Tasks
                                </h3>
                                {filteredEvents.map(evt => {
                                    const badge = getCategoryBadge(evt.category);
                                    return (
                                        <div
                                            key={evt.id}
                                            onClick={() => setSelectedEvent(evt)}
                                            className={cn("p-3 rounded-lg border text-left cursor-pointer flex items-center justify-between gap-4", badge.bg, badge.border)}
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className={cn("w-2.5 h-2.5 rounded-full shrink-0", badge.dot)} />
                                                <div>
                                                    <h5 className="font-bold text-sm text-white">{evt.title}</h5>
                                                    <span className="text-xs text-gray-400">
                                                        {evt.date} • {evt.startTime} • 🏢 {evt.client_name}
                                                    </span>
                                                </div>
                                            </div>
                                            <span className={cn("px-2 py-0.5 rounded text-[10px] font-bold uppercase", badge.text, badge.bg)}>
                                                {badge.label}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ── EVENT DETAILS MODAL ──────────────────────────────────────────── */}
            {selectedEvent && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-gray-950 border border-gray-700 rounded-xl w-full max-w-lg p-6 shadow-2xl relative">
                        <div className="flex items-center justify-between border-b border-gray-800 pb-3 mb-4">
                            <span className={cn(
                                "px-2.5 py-0.5 rounded text-xs font-mono font-bold uppercase border",
                                getCategoryBadge(selectedEvent.category).bg,
                                getCategoryBadge(selectedEvent.category).border,
                                getCategoryBadge(selectedEvent.category).text
                            )}>
                                {getCategoryBadge(selectedEvent.category).label}
                            </span>
                            <button onClick={() => setSelectedEvent(null)} className="text-gray-400 hover:text-white">
                                <XIcon className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-3 font-mono">
                            <h3 className="text-lg font-bold text-white font-sans">{selectedEvent.title}</h3>
                            <div className="p-3 bg-gray-900/60 rounded border border-gray-800 space-y-1.5 text-xs text-gray-300">
                                <div>📅 <strong>Date:</strong> {selectedEvent.date} ({selectedEvent.startTime}{selectedEvent.endTime ? ` - ${selectedEvent.endTime}` : ''})</div>
                                <div>🏢 <strong>Customer:</strong> {selectedEvent.client_name}</div>
                                {selectedEvent.campus_name && <div>📍 <strong>Campus:</strong> {selectedEvent.campus_name}</div>}
                                {selectedEvent.building_name && <div>🏗️ <strong>Building:</strong> {selectedEvent.building_name}</div>}
                                <div>👤 <strong>Assigned User:</strong> {selectedEvent.assigned_user}</div>
                                {selectedEvent.location && <div>📌 <strong>Location:</strong> {selectedEvent.location}</div>}
                            </div>

                            {selectedEvent.description && (
                                <p className="text-xs text-gray-400 font-mono italic">
                                    "{selectedEvent.description}"
                                </p>
                            )}

                            <div className="flex justify-end gap-2 pt-3 border-t border-gray-800">
                                <Button 
                                    variant="secondary" 
                                    size="sm"
                                    onClick={() => setSelectedEvent(null)}
                                >
                                    Close
                                </Button>
                                <Button 
                                    variant="primary" 
                                    size="sm"
                                    onClick={() => {
                                        setSelectedEvent(null);
                                        setActivePageId('E-CUSTOMERS');
                                    }}
                                >
                                    View in Customer Portal ↗
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── ADD EVENT MODAL ──────────────────────────────────────────────── */}
            {isAddEventModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-gray-950 border border-gray-700 rounded-xl w-full max-w-lg p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between border-b border-gray-800 pb-3 mb-4">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <PlusIcon className="w-5 h-5 text-rhive-pink" />
                                Schedule Event
                            </h3>
                            <button onClick={() => setIsAddEventModalOpen(false)} className="text-gray-400 hover:text-white">
                                <XIcon className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateEvent} className="space-y-3.5 font-mono text-xs">
                            <div>
                                <label className="block text-gray-400 mb-1">Event Category</label>
                                <select
                                    value={newEventForm.category}
                                    onChange={e => setNewEventForm({ ...newEventForm, category: e.target.value as any })}
                                    className="w-full bg-black/60 border border-gray-800 px-3 py-2 text-white rounded"
                                >
                                    <option value="inspection">🔍 Site Inspection & Drone Scan</option>
                                    <option value="work">🛠️ Work / Installation Dispatch</option>
                                    <option value="task">📋 Project Task Follow Up</option>
                                    <option value="call">📞 Client Call / Meeting</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-gray-400 mb-1">Event Title</label>
                                <input 
                                    type="text"
                                    required
                                    placeholder="e.g. Roof Inspection & Drone Scan"
                                    value={newEventForm.title}
                                    onChange={e => setNewEventForm({ ...newEventForm, title: e.target.value })}
                                    className="w-full bg-black/60 border border-gray-800 px-3 py-2 text-white rounded"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="block text-gray-400 mb-1">Customer Client</label>
                                    <input 
                                        type="text"
                                        required
                                        value={newEventForm.client_name}
                                        onChange={e => setNewEventForm({ ...newEventForm, client_name: e.target.value })}
                                        className="w-full bg-black/60 border border-gray-800 px-3 py-2 text-white rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-400 mb-1">Campus / Building</label>
                                    <input 
                                        type="text"
                                        value={newEventForm.campus_name}
                                        onChange={e => setNewEventForm({ ...newEventForm, campus_name: e.target.value })}
                                        className="w-full bg-black/60 border border-gray-800 px-3 py-2 text-white rounded"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                                <div>
                                    <label className="block text-gray-400 mb-1">Date</label>
                                    <input 
                                        type="date"
                                        required
                                        value={newEventForm.date}
                                        onChange={e => setNewEventForm({ ...newEventForm, date: e.target.value })}
                                        className="w-full bg-black/60 border border-gray-800 px-3 py-2 text-white rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-400 mb-1">Start Time</label>
                                    <input 
                                        type="text"
                                        value={newEventForm.startTime}
                                        onChange={e => setNewEventForm({ ...newEventForm, startTime: e.target.value })}
                                        className="w-full bg-black/60 border border-gray-800 px-3 py-2 text-white rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-400 mb-1">Assigned User</label>
                                    <select
                                        value={newEventForm.assigned_user}
                                        onChange={e => setNewEventForm({ ...newEventForm, assigned_user: e.target.value })}
                                        className="w-full bg-black/60 border border-gray-800 px-3 py-2 text-white rounded"
                                    >
                                        <option value="Kara">Kara</option>
                                        <option value="Chad Evenhuis">Chad Evenhuis</option>
                                        <option value="Victor">Victor</option>
                                        <option value="Me">Me</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-400 mb-1">Description / Scope</label>
                                <textarea
                                    rows={3}
                                    placeholder="Enter event scope, instructions, or checklist..."
                                    value={newEventForm.description}
                                    onChange={e => setNewEventForm({ ...newEventForm, description: e.target.value })}
                                    className="w-full bg-black/60 border border-gray-800 p-2.5 text-white rounded resize-none"
                                />
                            </div>

                            <div className="flex justify-end gap-2 pt-2 border-t border-gray-800">
                                <Button type="button" variant="secondary" size="sm" onClick={() => setIsAddEventModalOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" variant="primary" size="sm">
                                    Schedule
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </PageContainer>
    );
};

export default CalendarPage;
