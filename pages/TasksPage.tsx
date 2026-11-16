import React, { useState, useEffect, useMemo } from 'react';
import PageContainer from '../components/PageContainer';
import Button from '../components/Button';
import CircuitryCard from '../components/CircuitryCard';
import { useNavigation } from '../contexts/NavigationContext';
import { useMockDB } from '../contexts/MockDatabaseContext';
import { 
    TasksIcon, 
    Check, 
    ClockIcon, 
    PlusIcon, 
    SearchIcon, 
    UserIcon, 
    PhoneIcon, 
    TruckIcon, 
    WrenchIcon, 
    BuildingStorefrontIcon, 
    MapPinIcon, 
    XIcon,
    ArrowRightIcon,
    ShieldCheckIcon
} from '../components/icons';
import { cn } from '../lib/utils';
import type { CrmTask, TaskCategory, CustomerClient } from '../types';

// Seed tasks demonstrating user tasks tied directly to Customer -> Campus -> Building
const SEED_TASKS: CrmTask[] = [
    {
        id: 'TSK-001',
        title: 'Call Dan Corkill to confirm Owens Corning contract signing',
        category: 'call',
        client_id: 'CLI-UNPHC',
        client_name: 'UNPHC (Utah Non-Profit Housing Corp)',
        campus_id: 'CAMP-UNPHC-1',
        campus_name: 'Smith Apartments Campus',
        building_id: 'BLDG-B',
        building_name: 'Building B',
        contact_name: 'Dan Corkill',
        contact_phone: '801-555-0192',
        contact_email: 'dcorkill@unphc.org',
        assigned_user: 'Kara',
        due_date: '2026-11-16', // Overdue
        due_time: 'All day',
        completed: false,
        priority: 'high',
        notes: 'Review board approval on the 50-year warranty options and ensure deposit invoice is sent.',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
    {
        id: 'TSK-002',
        title: 'Contact labor crew for tear-off dispatch at Willow Park site',
        category: 'labor',
        client_id: 'CLI-UNPHC',
        client_name: 'UNPHC (Utah Non-Profit Housing Corp)',
        campus_id: 'CAMP-UNPHC-2',
        campus_name: 'Willow Park Apartments Campus',
        building_id: 'BLDG-C',
        building_name: 'Clubhouse Structure',
        contact_name: 'Javier - Crew Lead',
        contact_phone: '801-777-4411',
        assigned_user: 'Kara',
        due_date: new Date().toISOString().split('T')[0], // Today
        due_time: '1:30 PM',
        completed: false,
        priority: 'high',
        notes: 'Confirm 6-man crew for flat roof membrane replacement and verify OSHA safety harnesses.',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
    {
        id: 'TSK-003',
        title: 'Check supplier for TPO membrane and polyiso insulation delivery',
        category: 'supplier',
        client_id: 'CLI-UNPHC',
        client_name: 'UNPHC (Utah Non-Profit Housing Corp)',
        campus_id: 'CAMP-UNPHC-1',
        campus_name: 'Smith Apartments Campus',
        building_id: 'BLDG-A',
        building_name: 'Building A (Main)',
        contact_name: 'Apex Commercial Building Supply',
        contact_phone: '801-888-2300',
        assigned_user: 'Kara',
        due_date: new Date().toISOString().split('T')[0], // Today
        due_time: '3:00 PM',
        completed: false,
        priority: 'normal',
        notes: 'Verify 60mil white TPO membrane roll stock and 2-inch polyiso boards are on schedule for Tuesday morning delivery.',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
    {
        id: 'TSK-004',
        title: 'Conduct drone roof inspection on residential estate',
        category: 'inspection',
        client_id: 'CLI-BAIRD',
        client_name: 'Brad Baird',
        campus_name: 'Baird Residence',
        building_name: 'Main Residence & Garage',
        contact_name: 'Brad Baird',
        contact_phone: '801-633-6901',
        assigned_user: 'Chad Evenhuis',
        due_date: '2026-11-20', // Future
        due_time: '10:00 AM',
        completed: false,
        priority: 'normal',
        notes: 'Perform high-res aerial drone orthomosaic scan and check valleys for wind damage.',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
    {
        id: 'TSK-005',
        title: 'Review insurance scope and deductible with Anthony Cox',
        category: 'quote',
        client_id: 'CLI-COX',
        client_name: 'Anthony & Chelsea Cox',
        campus_name: 'Cox Estate',
        building_name: 'Primary Residence',
        contact_name: 'Anthony Cox',
        contact_phone: '469-502-0499',
        assigned_user: 'Victor',
        due_date: '2026-11-22', // Future
        due_time: '2:00 PM',
        completed: false,
        priority: 'normal',
        notes: 'Walk homeowner through insurance claim adjustment line items and gutter quote.',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    }
];

export const TasksPage: React.FC = () => {
    const { setActivePageId, setSelectedAccountId } = useNavigation();
    const { currentUser } = useMockDB();

    // Tasks State with localStorage backing
    const [tasks, setTasks] = useState<CrmTask[]>(() => {
        try {
            const saved = localStorage.getItem('rhive_crm_tasks');
            if (saved) return JSON.parse(saved);
        } catch { /* ignore */ }
        return SEED_TASKS;
    });

    useEffect(() => {
        try {
            localStorage.setItem('rhive_crm_tasks', JSON.stringify(tasks));
        } catch { /* ignore */ }
    }, [tasks]);

    // Customers loaded from customer portal state for hierarchy selection
    const [availableClients, setAvailableClients] = useState<CustomerClient[]>([]);

    useEffect(() => {
        try {
            const saved = localStorage.getItem('rhive_customer_clients');
            if (saved) {
                setAvailableClients(JSON.parse(saved));
            }
        } catch { /* ignore */ }
    }, []);

    // Filter States: Tabs (Today, Overdue, Future, Completed)
    const [activeTab, setActiveTab] = useState<'today' | 'overdue' | 'future' | 'completed'>('today');
    const [selectedUserFilter, setSelectedUserFilter] = useState<string>('All Users');
    const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<'All' | TaskCategory>('All');
    const [searchQuery, setSearchQuery] = useState('');

    // Modal State for New Task
    const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
    const [newTaskForm, setNewTaskForm] = useState({
        title: '',
        category: 'call' as TaskCategory,
        client_name: 'UNPHC (Utah Non-Profit Housing Corp)',
        campus_name: 'Smith Apartments Campus',
        building_name: 'Building B',
        contact_name: 'Dan Corkill',
        contact_phone: '801-555-0192',
        contact_email: 'dcorkill@unphc.org',
        assigned_user: 'Kara',
        due_date: new Date().toISOString().split('T')[0],
        due_time: 'All day',
        priority: 'high' as 'low' | 'normal' | 'high',
        notes: ''
    });

    // Helper: Categorize date into Today, Overdue, or Future
    const todayStr = new Date().toISOString().split('T')[0];

    const getTaskTiming = (task: CrmTask): 'overdue' | 'today' | 'future' => {
        if (task.due_date < todayStr) return 'overdue';
        if (task.due_date === todayStr) return 'today';
        return 'future';
    };

    // Rollup Counts for Tabs
    const counts = useMemo(() => {
        const activeTasks = tasks.filter(t => !t.completed);
        return {
            today: activeTasks.filter(t => getTaskTiming(t) === 'today').length,
            overdue: activeTasks.filter(t => getTaskTiming(t) === 'overdue').length,
            future: activeTasks.filter(t => getTaskTiming(t) === 'future').length,
            completed: tasks.filter(t => t.completed).length,
        };
    }, [tasks, todayStr]);

    // Filtered tasks
    const filteredTasks = useMemo(() => {
        return tasks.filter(t => {
            // Tab filter
            if (activeTab === 'completed') {
                if (!t.completed) return false;
            } else {
                if (t.completed) return false;
                const timing = getTaskTiming(t);
                if (timing !== activeTab) return false;
            }

            // User filter
            if (selectedUserFilter !== 'All Users') {
                if (selectedUserFilter === 'Me') {
                    const currentName = currentUser?.name || 'Kara';
                    if (t.assigned_user.toLowerCase() !== currentName.toLowerCase()) return false;
                } else if (t.assigned_user !== selectedUserFilter) {
                    return false;
                }
            }

            // Category filter
            if (selectedCategoryFilter !== 'All' && t.category !== selectedCategoryFilter) {
                return false;
            }

            // Search query
            if (searchQuery) {
                const q = searchQuery.toLowerCase();
                const matchesTitle = t.title.toLowerCase().includes(q);
                const matchesClient = t.client_name.toLowerCase().includes(q);
                const matchesContact = t.contact_name.toLowerCase().includes(q);
                const matchesCampus = (t.campus_name || '').toLowerCase().includes(q);
                const matchesBuilding = (t.building_name || '').toLowerCase().includes(q);
                return matchesTitle || matchesClient || matchesContact || matchesCampus || matchesBuilding;
            }

            return true;
        });
    }, [tasks, activeTab, selectedUserFilter, selectedCategoryFilter, searchQuery, todayStr]);

    // Handle toggle task completed
    const handleToggleComplete = (taskId: string) => {
        setTasks(prev => prev.map(t => {
            if (t.id === taskId) {
                return {
                    ...t,
                    completed: !t.completed,
                    updated_at: new Date().toISOString()
                };
            }
            return t;
        }));
    };

    // Handle Clear Overdue
    const handleClearOverdue = () => {
        setTasks(prev => prev.map(t => {
            if (!t.completed && getTaskTiming(t) === 'overdue') {
                return {
                    ...t,
                    due_date: todayStr,
                    updated_at: new Date().toISOString()
                };
            }
            return t;
        }));
    };

    // Handle Create Task Form Submit
    const handleCreateTask = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTaskForm.title.trim()) return;

        const newTask: CrmTask = {
            id: `TSK-${Date.now()}`,
            title: newTaskForm.title,
            category: newTaskForm.category,
            client_name: newTaskForm.client_name,
            campus_name: newTaskForm.campus_name,
            building_name: newTaskForm.building_name,
            contact_name: newTaskForm.contact_name,
            contact_phone: newTaskForm.contact_phone,
            contact_email: newTaskForm.contact_email,
            assigned_user: newTaskForm.assigned_user,
            due_date: newTaskForm.due_date,
            due_time: newTaskForm.due_time,
            completed: false,
            priority: newTaskForm.priority,
            notes: newTaskForm.notes,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        setTasks(prev => [newTask, ...prev]);
        setIsAddTaskModalOpen(false);
        setNewTaskForm({
            title: '',
            category: 'call',
            client_name: 'UNPHC (Utah Non-Profit Housing Corp)',
            campus_name: 'Smith Apartments Campus',
            building_name: 'Building B',
            contact_name: 'Dan Corkill',
            contact_phone: '801-555-0192',
            contact_email: 'dcorkill@unphc.org',
            assigned_user: 'Kara',
            due_date: todayStr,
            due_time: 'All day',
            priority: 'high',
            notes: ''
        });
    };

    return (
        <PageContainer
            title="Tasks Manager"
            subtitle="Actionable follow-ups, labor coordination, and supplier checks tied to customer property buildings"
        >
            <div className="space-y-4">
                {/* ── TOP HEADER ACTION BAR ─────────────────────────────────────── */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-black/60 border border-gray-800 rounded-lg">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-rhive-pink/10 border border-rhive-pink/20 rounded-lg text-rhive-pink">
                            <TasksIcon className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-black text-white flex items-center gap-2">
                                Team Tasks
                                {counts.overdue > 0 && (
                                    <span className="px-2 py-0.5 text-xs font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full">
                                        {counts.overdue} Overdue
                                    </span>
                                )}
                            </h2>
                            <p className="text-xs text-gray-400 font-mono">
                                Assigned across Kara, Chad Evenhuis, Victor & RHIVE field crew
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {counts.overdue > 0 && (
                            <Button 
                                variant="secondary" 
                                size="sm"
                                onClick={handleClearOverdue}
                                className="text-xs font-mono"
                            >
                                Reschedule Overdue to Today
                            </Button>
                        )}
                        <Button 
                            variant="primary" 
                            size="sm"
                            onClick={() => setIsAddTaskModalOpen(true)}
                            className="flex items-center gap-1.5"
                        >
                            <PlusIcon className="w-4 h-4" />
                            Create Task
                        </Button>
                    </div>
                </div>

                {/* ── TABS & CONTROLS TOOLBAR ───────────────────────────────────── */}
                <div className="p-4 bg-black/40 border border-gray-800 rounded-lg space-y-3">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        
                        {/* Tabs (Today's Tasks, Overdue, Future, Completed) */}
                        <div className="flex flex-wrap items-center gap-2">
                            <button
                                onClick={() => setActiveTab('today')}
                                className={cn(
                                    "px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2",
                                    activeTab === 'today'
                                        ? "bg-rhive-pink text-white shadow-[0_0_10px_rgba(236,2,139,0.4)]"
                                        : "bg-gray-900/60 text-gray-400 hover:text-white border border-gray-800"
                                )}
                            >
                                Today's Tasks
                                {counts.today > 0 && (
                                    <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/40">
                                        {counts.today}
                                    </span>
                                )}
                            </button>

                            <button
                                onClick={() => setActiveTab('overdue')}
                                className={cn(
                                    "px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2",
                                    activeTab === 'overdue'
                                        ? "bg-amber-500 text-black font-black shadow-[0_0_10px_rgba(245,158,11,0.4)]"
                                        : "bg-gray-900/60 text-amber-400 hover:text-white border border-gray-800"
                                )}
                            >
                                Overdue ({counts.overdue})
                            </button>

                            <button
                                onClick={() => setActiveTab('future')}
                                className={cn(
                                    "px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2",
                                    activeTab === 'future'
                                        ? "bg-rhive-pink text-white shadow-[0_0_10px_rgba(236,2,139,0.4)]"
                                        : "bg-gray-900/60 text-gray-400 hover:text-white border border-gray-800"
                                )}
                            >
                                Future ({counts.future})
                            </button>

                            <button
                                onClick={() => setActiveTab('completed')}
                                className={cn(
                                    "px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2",
                                    activeTab === 'completed'
                                        ? "bg-green-600 text-white shadow-[0_0_10px_rgba(34,197,94,0.4)]"
                                        : "bg-gray-900/60 text-gray-400 hover:text-white border border-gray-800"
                                )}
                            >
                                Completed ({counts.completed})
                            </button>
                        </div>

                        {/* Search Bar */}
                        <div className="relative md:w-80">
                            <SearchIcon className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input 
                                type="text"
                                placeholder="Search task, contact, customer, campus..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="w-full bg-black/60 border border-gray-800 pl-9 pr-4 py-1.5 text-xs font-mono text-white placeholder-gray-600 rounded-full focus:outline-none focus:border-rhive-pink"
                            />
                        </div>
                    </div>

                    {/* Secondary Filter Row: Assignee User & Category Filter */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-800/80 text-xs font-mono">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1.5">
                                <span className="text-gray-500 font-bold uppercase text-[10px]">User:</span>
                                <select
                                    value={selectedUserFilter}
                                    onChange={e => setSelectedUserFilter(e.target.value)}
                                    className="bg-black/60 border border-gray-800 text-white font-bold rounded px-2.5 py-1 text-xs focus:outline-none focus:border-rhive-pink"
                                >
                                    <option value="All Users">All Users</option>
                                    <option value="Kara">Kara</option>
                                    <option value="Chad Evenhuis">Chad Evenhuis</option>
                                    <option value="Victor">Victor</option>
                                    <option value="Me">Me (Current User)</option>
                                </select>
                            </div>

                            <div className="flex items-center gap-1.5">
                                <span className="text-gray-500 font-bold uppercase text-[10px]">Category:</span>
                                <select
                                    value={selectedCategoryFilter}
                                    onChange={e => setSelectedCategoryFilter(e.target.value as any)}
                                    className="bg-black/60 border border-gray-800 text-white font-bold rounded px-2.5 py-1 text-xs focus:outline-none focus:border-rhive-pink"
                                >
                                    <option value="All">All Categories</option>
                                    <option value="call">Follow Up Calls</option>
                                    <option value="labor">Contact Labor</option>
                                    <option value="supplier">Check Supplier</option>
                                    <option value="inspection">Site Inspections</option>
                                    <option value="quote">Review Quote</option>
                                </select>
                            </div>
                        </div>

                        <div className="text-[11px] text-gray-500 font-mono">
                            Showing {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'}
                        </div>
                    </div>
                </div>

                {/* ── TASKS STREAM (FOLLOW UP BOSS STYLE CARDS) ───────────────────── */}
                <div className="space-y-3">
                    {filteredTasks.length === 0 ? (
                        <div className="p-12 text-center bg-black/40 border border-gray-800 rounded-lg text-gray-500 font-mono text-xs">
                            <TasksIcon className="w-10 h-10 mx-auto mb-2 opacity-30 text-gray-600" />
                            No tasks found in this section. Great job staying caught up!
                        </div>
                    ) : (
                        filteredTasks.map(task => {
                            const isOverdue = !task.completed && getTaskTiming(task) === 'overdue';
                            return (
                                <div
                                    key={task.id}
                                    className={cn(
                                        "p-4 bg-black/70 border rounded-lg transition-all group relative overflow-hidden",
                                        task.completed 
                                            ? "border-gray-800/60 opacity-60 bg-gray-950/40" 
                                            : isOverdue 
                                                ? "border-amber-500/40 bg-amber-950/10 hover:border-amber-500/60 shadow-[0_0_12px_rgba(245,158,11,0.08)]" 
                                                : "border-gray-800 hover:border-rhive-pink/40"
                                    )}
                                >
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                                        
                                        {/* Left Side: Quantum Switch Toggle & Contact Avatar & Title */}
                                        <div className="flex items-start gap-3 flex-1">
                                            {/* Quantum Completion Toggle (Strictly NO HTML checkboxes!) */}
                                            <button
                                                type="button"
                                                onClick={() => handleToggleComplete(task.id)}
                                                title={task.completed ? "Mark incomplete" : "Mark task completed"}
                                                className={cn(
                                                    "w-6 h-6 rounded border flex items-center justify-center transition-all mt-0.5 cursor-pointer shrink-0",
                                                    task.completed
                                                        ? "bg-green-500 border-green-400 text-black shadow-[0_0_8px_rgba(34,197,94,0.4)]"
                                                        : "bg-gray-900 border-gray-700 hover:border-rhive-pink text-transparent"
                                                )}
                                            >
                                                <Check className={cn("w-3.5 h-3.5 font-black", task.completed && "text-black")} />
                                            </button>

                                            {/* Contact Person Avatar */}
                                            <div className="w-8 h-8 rounded-full bg-rhive-pink/20 border border-rhive-pink/40 flex items-center justify-center font-bold text-xs text-rhive-pink font-mono shrink-0">
                                                {task.contact_name.charAt(0)}
                                            </div>

                                            {/* Task Details */}
                                            <div className="space-y-1 flex-1">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    {/* Contact Name Link */}
                                                    <span className="font-bold text-sm text-white font-sans hover:text-rhive-pink transition-colors">
                                                        {task.contact_name}
                                                    </span>

                                                    {/* Category Action Badge */}
                                                    <span className={cn(
                                                        "px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider border flex items-center gap-1",
                                                        task.category === 'call' && "bg-amber-500/10 text-amber-400 border-amber-500/30",
                                                        task.category === 'labor' && "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
                                                        task.category === 'supplier' && "bg-purple-500/10 text-purple-400 border-purple-500/30",
                                                        task.category === 'inspection' && "bg-blue-500/10 text-blue-400 border-blue-500/30",
                                                        task.category === 'quote' && "bg-green-500/10 text-green-400 border-green-500/30",
                                                        task.category === 'other' && "bg-gray-800 text-gray-300 border-gray-700"
                                                    )}>
                                                        {task.category === 'call' && <PhoneIcon className="w-2.5 h-2.5" />}
                                                        {task.category === 'labor' && <WrenchIcon className="w-2.5 h-2.5" />}
                                                        {task.category === 'supplier' && <TruckIcon className="w-2.5 h-2.5" />}
                                                        {task.category === 'inspection' && <ShieldCheckIcon className="w-2.5 h-2.5" />}
                                                        <span>
                                                            {task.category === 'call' && 'Follow Up Call'}
                                                            {task.category === 'labor' && 'Contact Labor'}
                                                            {task.category === 'supplier' && 'Check Supplier'}
                                                            {task.category === 'inspection' && 'Site Inspection'}
                                                            {task.category === 'quote' && 'Review Quote'}
                                                        </span>
                                                    </span>

                                                    {/* Assignee Badge */}
                                                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-gray-900 border border-gray-800 text-gray-300 flex items-center gap-1">
                                                        <UserIcon className="w-2.5 h-2.5 text-rhive-pink" />
                                                        {task.assigned_user}
                                                    </span>
                                                </div>

                                                {/* Task Title */}
                                                <h4 className={cn(
                                                    "text-sm font-medium text-gray-200 font-sans",
                                                    task.completed && "line-through text-gray-500"
                                                )}>
                                                    {task.title}
                                                </h4>

                                                {/* RHIVE Multi-Tier Hierarchy Breadcrumb */}
                                                <div className="flex items-center gap-1.5 text-[11px] font-mono text-gray-400 pt-1 flex-wrap">
                                                    <span className="text-rhive-pink font-bold">🏢 {task.client_name}</span>
                                                    {task.campus_name && (
                                                        <>
                                                            <span className="text-gray-600">›</span>
                                                            <span>📍 {task.campus_name}</span>
                                                        </>
                                                    )}
                                                    {task.building_name && (
                                                        <>
                                                            <span className="text-gray-600">›</span>
                                                            <span className="text-gray-300">🏗️ {task.building_name}</span>
                                                        </>
                                                    )}
                                                </div>

                                                {/* Notes */}
                                                {task.notes && (
                                                    <p className="text-xs text-gray-500 font-mono italic pt-1">
                                                        "{task.notes}"
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Right Side: Due Date & Action Buttons */}
                                        <div className="flex flex-row md:flex-col items-end justify-between md:justify-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-gray-800/80">
                                            {/* Due Date & Time */}
                                            <div className="text-right">
                                                <div className={cn(
                                                    "text-xs font-mono font-bold flex items-center gap-1 justify-end",
                                                    isOverdue ? "text-amber-400" : "text-gray-300"
                                                )}>
                                                    <ClockIcon className="w-3 h-3" />
                                                    <span>{task.due_date}</span>
                                                </div>
                                                <span className="text-[10px] font-mono text-gray-500 block">
                                                    {task.due_time || 'All day'}
                                                </span>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex items-center gap-1.5">
                                                {task.contact_phone && (
                                                    <a
                                                        href={`tel:${task.contact_phone}`}
                                                        title={`Call ${task.contact_name}`}
                                                        className="px-2.5 py-1 rounded bg-gray-900 hover:bg-gray-800 text-green-400 border border-gray-800 text-xs font-mono font-bold flex items-center gap-1 transition-colors"
                                                    >
                                                        <PhoneIcon className="w-3 h-3" />
                                                        Call
                                                    </a>
                                                )}

                                                <button
                                                    onClick={() => {
                                                        if (task.client_id) {
                                                            setSelectedAccountId(task.client_id);
                                                        }
                                                        setActivePageId('E-CUSTOMERS');
                                                    }}
                                                    title="View in Customer Portal"
                                                    className="px-2.5 py-1 rounded bg-gray-900 hover:bg-gray-800 text-rhive-pink border border-gray-800 text-xs font-mono font-bold flex items-center gap-1 transition-colors"
                                                >
                                                    Portal ↗
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* ── CREATE NEW TASK MODAL ────────────────────────────────────────── */}
            {isAddTaskModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-gray-950 border border-gray-700 rounded-xl w-full max-w-lg p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between border-b border-gray-800 pb-3 mb-4">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <PlusIcon className="w-5 h-5 text-rhive-pink" />
                                Create New Task
                            </h3>
                            <button onClick={() => setIsAddTaskModalOpen(false)} className="text-gray-400 hover:text-white">
                                <XIcon className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateTask} className="space-y-3.5">
                            {/* Task Action Type */}
                            <div>
                                <label className="block text-xs font-mono text-gray-400 mb-1">Task Type</label>
                                <select
                                    value={newTaskForm.category}
                                    onChange={e => setNewTaskForm({ ...newTaskForm, category: e.target.value as any })}
                                    className="w-full bg-black/60 border border-gray-800 px-3 py-2 text-xs font-mono text-white rounded focus:outline-none focus:border-rhive-pink"
                                >
                                    <option value="call">📞 Follow Up Call</option>
                                    <option value="labor">👷 Contact Labor Crew</option>
                                    <option value="supplier">📦 Check Supplier Delivery</option>
                                    <option value="inspection">🔍 Site Inspection</option>
                                    <option value="quote">📄 Review Quote / Agreement</option>
                                    <option value="other">📋 General Follow Up</option>
                                </select>
                            </div>

                            {/* Title */}
                            <div>
                                <label className="block text-xs font-mono text-gray-400 mb-1">Task Title / Action Description</label>
                                <input 
                                    type="text"
                                    required
                                    placeholder="e.g. Call Dan Corkill to confirm Owens Corning contract signing"
                                    value={newTaskForm.title}
                                    onChange={e => setNewTaskForm({ ...newTaskForm, title: e.target.value })}
                                    className="w-full bg-black/60 border border-gray-800 px-3 py-2 text-xs font-mono text-white rounded focus:outline-none focus:border-rhive-pink"
                                />
                            </div>

                            {/* RHIVE Multi-Tier Hierarchy Dropdowns */}
                            <div className="p-3 bg-gray-900/60 rounded border border-gray-800 space-y-2.5">
                                <span className="text-[10px] font-mono uppercase tracking-wider text-rhive-pink font-bold block">
                                    Property Hierarchy Placement
                                </span>

                                {/* Tier 1 Customer */}
                                <div>
                                    <label className="block text-[11px] font-mono text-gray-400 mb-0.5">Tier 1: Parent Customer / Company</label>
                                    <input 
                                        type="text"
                                        required
                                        value={newTaskForm.client_name}
                                        onChange={e => setNewTaskForm({ ...newTaskForm, client_name: e.target.value })}
                                        className="w-full bg-black/80 border border-gray-700 px-2.5 py-1.5 text-xs font-mono text-white rounded"
                                    />
                                </div>

                                {/* Tier 2 Campus */}
                                <div>
                                    <label className="block text-[11px] font-mono text-gray-400 mb-0.5">Tier 2: Property Campus</label>
                                    <input 
                                        type="text"
                                        value={newTaskForm.campus_name}
                                        onChange={e => setNewTaskForm({ ...newTaskForm, campus_name: e.target.value })}
                                        placeholder="e.g. Smith Apartments Campus"
                                        className="w-full bg-black/80 border border-gray-700 px-2.5 py-1.5 text-xs font-mono text-white rounded"
                                    />
                                </div>

                                {/* Tier 4 Building */}
                                <div>
                                    <label className="block text-[11px] font-mono text-gray-400 mb-0.5">Tier 4: Building Asset</label>
                                    <input 
                                        type="text"
                                        value={newTaskForm.building_name}
                                        onChange={e => setNewTaskForm({ ...newTaskForm, building_name: e.target.value })}
                                        placeholder="e.g. Building B"
                                        className="w-full bg-black/80 border border-gray-700 px-2.5 py-1.5 text-xs font-mono text-white rounded"
                                    />
                                </div>
                            </div>

                            {/* Contact Person */}
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="block text-xs font-mono text-gray-400 mb-1">Contact Person</label>
                                    <input 
                                        type="text"
                                        required
                                        placeholder="e.g. Dan Corkill"
                                        value={newTaskForm.contact_name}
                                        onChange={e => setNewTaskForm({ ...newTaskForm, contact_name: e.target.value })}
                                        className="w-full bg-black/60 border border-gray-800 px-3 py-2 text-xs font-mono text-white rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-mono text-gray-400 mb-1">Contact Phone</label>
                                    <input 
                                        type="text"
                                        placeholder="801-555-0192"
                                        value={newTaskForm.contact_phone}
                                        onChange={e => setNewTaskForm({ ...newTaskForm, contact_phone: e.target.value })}
                                        className="w-full bg-black/60 border border-gray-800 px-3 py-2 text-xs font-mono text-white rounded"
                                    />
                                </div>
                            </div>

                            {/* Assignee & Due Date */}
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="block text-xs font-mono text-gray-400 mb-1">Assigned User</label>
                                    <select
                                        value={newTaskForm.assigned_user}
                                        onChange={e => setNewTaskForm({ ...newTaskForm, assigned_user: e.target.value })}
                                        className="w-full bg-black/60 border border-gray-800 px-3 py-2 text-xs font-mono text-white rounded"
                                    >
                                        <option value="Kara">Kara</option>
                                        <option value="Chad Evenhuis">Chad Evenhuis</option>
                                        <option value="Victor">Victor</option>
                                        <option value="Me">Me</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-mono text-gray-400 mb-1">Due Date</label>
                                    <input 
                                        type="date"
                                        required
                                        value={newTaskForm.due_date}
                                        onChange={e => setNewTaskForm({ ...newTaskForm, due_date: e.target.value })}
                                        className="w-full bg-black/60 border border-gray-800 px-3 py-2 text-xs font-mono text-white rounded"
                                    />
                                </div>
                            </div>

                            {/* Notes */}
                            <div>
                                <label className="block text-xs font-mono text-gray-400 mb-1">Notes / Instructions</label>
                                <textarea
                                    rows={3}
                                    placeholder="Add instructions, checklist, or materials details..."
                                    value={newTaskForm.notes}
                                    onChange={e => setNewTaskForm({ ...newTaskForm, notes: e.target.value })}
                                    className="w-full bg-black/60 border border-gray-800 p-2.5 text-xs font-mono text-white rounded resize-none"
                                />
                            </div>

                            <div className="flex justify-end gap-2 pt-2 border-t border-gray-800">
                                <Button type="button" variant="secondary" size="sm" onClick={() => setIsAddTaskModalOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" variant="primary" size="sm">
                                    Create Task
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </PageContainer>
    );
};

export default TasksPage;
