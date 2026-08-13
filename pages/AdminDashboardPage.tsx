import React, { useState, useEffect } from 'react';
import PageContainer from '../components/PageContainer';
import { dashboardService, projectService, userService } from '../lib/firebaseService';
import { 
    UserIcon, 
    ChartPieIcon, 
    CommandLineIcon,
    ShieldCheckIcon,
    IdentificationIcon,
    ArrowUpIcon,
    ArrowDownIcon,
    PencilSquareIcon,
    SparklesIcon
} from '../components/icons';
import { cn } from '../lib/utils';
import Card from '../components/Card';
import Button from '../components/Button';
import { useMockDB } from '../contexts/MockDatabaseContext';

const PricingRow = ({ name, unit, cost, onEdit }: { key?: React.Key; name: string, unit: string, cost: string, onEdit: () => void }) => (
    <div className="grid grid-cols-3 items-center p-3 bg-gray-900/40 border border-gray-800/40 rounded-xl hover:bg-gray-800/30 transition-all">
        <span className="text-gray-300 font-medium text-xs md:text-sm">{name}</span>
        <span className="text-gray-400 text-xs font-mono">{unit}</span>
        <div className="flex items-center justify-end space-x-3">
            <span className="font-mono text-white text-xs md:text-sm font-bold">{cost}</span>
            <Button variant="secondary" size="sm" className="!p-1.5 hover:border-[#ec028b]/50" onClick={onEdit}>
                <PencilSquareIcon className="w-3.5 h-3.5 text-gray-400 hover:text-white" />
            </Button>
        </div>
    </div>
);

const AdminDashboardPage: React.FC = () => {
    const { users, currentUser } = useMockDB();
    const [stats, setStats] = useState<any>(null);
    const [recentProjects, setRecentProjects] = useState<any[]>([]);
    const [userCount, setUserCount] = useState(0);
    const [activeTab, setActiveTab] = useState<'overview' | 'pricing' | 'general'>('overview');

    // 1. Pricing State
    const [pricing, setPricing] = useState([
        { id: 1, category: 'materials', name: 'Architectural Shingles', unit: 'per Square', cost: '$120.00' },
        { id: 2, category: 'materials', name: 'Synthetic Underlayment', unit: 'per Roll', cost: '$85.00' },
        { id: 3, category: 'materials', name: 'Ice & Water Shield', unit: 'per Roll', cost: '$110.00' },
        { id: 4, category: 'labor', name: 'Shingle Installation', unit: 'per Square', cost: '$90.00' },
        { id: 5, category: 'labor', name: 'Tear-off (1 Layer)', unit: 'per Square', cost: '$50.00' },
        { id: 6, category: 'labor', name: 'Decking Replacement', unit: 'per Sheet', cost: '$75.00' },
        { id: 7, category: 'overhead', name: 'Standard Overhead', unit: 'Percentage', cost: '15%' },
        { id: 8, category: 'overhead', name: 'Standard Profit Margin', unit: 'Percentage', cost: '20%' },
    ]);

    // 2. General Settings State (Toggles without Checkboxes)
    const [debugMode, setDebugMode] = useState(false);
    const [guestSignup, setGuestSignup] = useState(true);
    const [droneSimulation, setDroneSimulation] = useState(true);
    const [syncInterval, setSyncInterval] = useState(30);
    const [serviceState, setServiceState] = useState(() => {
        return localStorage.getItem('service_boundary_state') || 'UT';
    });

    const handleServiceStateChange = (val: string) => {
        const uppercaseVal = val.toUpperCase().trim();
        setServiceState(uppercaseVal);
        localStorage.setItem('service_boundary_state', uppercaseVal);
    };

    const handleEditPricing = (id: number) => {
        const item = pricing.find(p => p.id === id);
        if (!item) return;
        const newCost = prompt(`Enter new value for ${item.name}:`, item.cost);
        if (newCost !== null) {
            setPricing(prev => prev.map(p => 
                p.id === id ? { ...p, cost: newCost } : p
            ));
        }
    };

    useEffect(() => {
        const fetchStats = async () => {
            const res = await dashboardService.getStats();
            if (res.success) setStats(res.data);
        };

        const unsubProjects = projectService.subscribe((data) => {
            setRecentProjects(data.slice(0, 5));
        });

        const unsubUsers = userService.subscribe((data) => {
            setUserCount(data.length);
        });

        fetchStats();
        return () => {
            unsubProjects();
            unsubUsers();
        };
    }, []);

    const statCards = [
        { label: 'Network Users', value: userCount, icon: UserIcon, trend: '+12%', color: 'text-blue-400' },
        { label: 'Active Projects', value: stats?.total_projects || 0, icon: ChartPieIcon, trend: '+5%', color: 'text-[#ec028b]' },
        { label: 'Pending Quotes', value: stats?.total_estimates || 0, icon: CommandLineIcon, trend: '-2%', color: 'text-yellow-400' },
        { label: 'System Health', value: '99.9%', icon: ShieldCheckIcon, trend: 'stable', color: 'text-green-400' },
    ];

    return (
        <PageContainer 
            title="Admin Command Center" 
            description="Manage global operations: baseline estimator pricing matrices and full application configurations."
        >
            {/* Tabs Controller */}
            <div className="flex flex-wrap gap-1.5 border-b border-gray-800 pb-4 mb-6">
                {[
                    { id: 'overview', label: 'Command Overview', icon: <ChartPieIcon className="w-3.5 h-3.5 mr-2" /> },
                    { id: 'pricing', label: 'Pricing Defaults', icon: <PencilSquareIcon className="w-3.5 h-3.5 mr-2" /> },
                    { id: 'general', label: 'General Options', icon: <ShieldCheckIcon className="w-3.5 h-3.5 mr-2" /> }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={cn(
                            "flex items-center px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg border transition-all duration-300",
                            activeTab === tab.id
                                ? "bg-[#ec028b]/20 border-[#ec028b]/50 text-[#ec028b] shadow-[0_0_12px_rgba(236,2,139,0.2)]"
                                : "bg-black/40 border-gray-800 text-gray-400 hover:text-white hover:border-gray-700"
                        )}
                        style={{ clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)' }}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* TAB: OVERVIEW */}
            {activeTab === 'overview' && (
                <>
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {statCards.map((cur, i) => (
                            <Card key={i} className="relative overflow-hidden group">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-[10px] uppercase font-black tracking-widest text-gray-500 mb-1">{cur.label}</p>
                                        <h3 className={cn("text-3xl font-black", cur.color)}>{cur.value}</h3>
                                        <div className="flex items-center gap-1 mt-2">
                                            {cur.trend.startsWith('+') ? <ArrowUpIcon className="w-3 h-3 text-green-500" /> : <ArrowDownIcon className="w-3 h-3 text-red-500" />}
                                            <span className={cn("text-[10px] font-bold uppercase", cur.trend.startsWith('+') ? "text-green-500" : "text-red-500")}>
                                                {cur.trend} vs last month
                                            </span>
                                        </div>
                                    </div>
                                    <div 
                                        className={cn("p-2 bg-gray-900 border border-gray-800", cur.color)}
                                        style={{ clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)' }}
                                    >
                                        <cur.icon className="w-6 h-6" />
                                    </div>
                                </div>
                                <div className="absolute -bottom-1 -right-1 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <cur.icon className="w-20 h-20" />
                                </div>
                            </Card>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* System Activity */}
                        <div className="lg:col-span-2 space-y-6">
                            <div 
                                className="bg-gray-900/40 border border-gray-800 overflow-hidden backdrop-blur-xl"
                                style={{ clipPath: 'polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)' }}
                            >
                                <div className="p-4 border-b border-gray-800 bg-black/20 flex justify-between items-center">
                                    <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                                        <CommandLineIcon className="w-4 h-4 text-[#ec028b]" />
                                        Recent Project Activity
                                    </h3>
                                    <button className="text-[10px] font-bold text-[#ec028b] uppercase tracking-tighter hover:underline">View All</button>
                                </div>
                                <div className="divide-y divide-gray-800/50">
                                    {recentProjects.map((p) => (
                                        <div key={p.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center font-bold text-gray-500 text-xs">
                                                    {p.name?.charAt(0) || 'P'}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-white leading-none mb-1">{p.name || 'Unnamed Project'}</p>
                                                    <p className="text-[10px] text-gray-500 font-mono italic">{p.current_stage || 'Intake'}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-[10px] font-black uppercase text-gray-500 border border-gray-800 px-2 py-0.5 rounded-full">
                                                    {p.project_type || 'N/A'}
                                                </span>
                                                <div className="w-2 h-2 rounded-full bg-green-500" title="Synchronized" />
                                            </div>
                                        </div>
                                    ))}
                                    {recentProjects.length === 0 && (
                                        <div className="p-10 text-center text-gray-600 font-mono text-xs italic uppercase tracking-widest">
                                            No active event streams detected.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Firewall and System Specs */}
                        <div className="space-y-6">
                            <div 
                                className="bg-gray-900/40 border border-gray-800 p-6 backdrop-blur-xl relative overflow-hidden h-80 flex flex-col items-center justify-center text-center"
                                style={{ clipPath: 'polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)' }}
                            >
                                <ChartPieIcon className="w-20 h-20 text-[#ec028b]/20 mb-4 animate-pulse" />
                                <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-2">Operational Analytics</h4>
                                <p className="text-xs text-gray-500 leading-relaxed max-w-[200px]">
                                    AI-driven performance metrics and regional penetration analysis currently initializing...
                                </p>
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#ec028b]/50 to-transparent shadow-[0_0_15px_#ec028b] animate-[scan_3s_linear_infinite]" />
                            </div>

                            <div 
                                className="bg-black/60 border border-gray-800 p-6"
                                style={{ clipPath: 'polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)' }}
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <IdentificationIcon className="w-5 h-5 text-blue-400" />
                                    <h4 className="text-sm font-bold text-white uppercase tracking-wider">System Status</h4>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-[10px]">
                                        <span className="text-gray-500 uppercase font-black">Firewall</span>
                                        <span className="text-green-500 font-bold">ACTIVE</span>
                                    </div>
                                    <div className="w-full bg-gray-900 h-1.5 rounded-full overflow-hidden">
                                        <div className="bg-[#ec028b] h-full w-[85%] shadow-[0_0_10px_#ec028b]" />
                                    </div>
                                    <div className="flex justify-between items-center text-[10px]">
                                        <span className="text-gray-500 uppercase font-black">Uptime</span>
                                        <span className="text-blue-400 font-bold">99.999%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* TAB: PRICING DEFAULTS */}
            {activeTab === 'pricing' && (
                <div className="space-y-6">
                    <Card title="Live Estimate Calculations Base Model">
                        <p className="text-xs text-gray-400 mb-6">Modify baseline raw material charges, crew assembly coefficients, and global business margin rates.</p>
                        <div className="space-y-6">
                            <div>
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-[#ec028b] mb-3">Materials Cost Config</h4>
                                <div className="space-y-2">
                                    {pricing.filter(p => p.category === 'materials').map(item => (
                                        <PricingRow 
                                            key={item.id} 
                                            name={item.name} 
                                            unit={item.unit} 
                                            cost={item.cost} 
                                            onEdit={() => handleEditPricing(item.id)}
                                        />
                                    ))}
                                </div>
                            </div>
                            
                            <div>
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-[#ec028b] mb-3">Labor Rates Config</h4>
                                <div className="space-y-2">
                                    {pricing.filter(p => p.category === 'labor').map(item => (
                                        <PricingRow 
                                            key={item.id} 
                                            name={item.name} 
                                            unit={item.unit} 
                                            cost={item.cost} 
                                            onEdit={() => handleEditPricing(item.id)}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-[#ec028b] mb-3">Margins & Coefficients</h4>
                                <div className="space-y-2">
                                    {pricing.filter(p => p.category === 'overhead').map(item => (
                                        <PricingRow 
                                            key={item.id} 
                                            name={item.name} 
                                            unit={item.unit} 
                                            cost={item.cost} 
                                            onEdit={() => handleEditPricing(item.id)}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            )}

            {/* TAB: GENERAL OPTIONS */}
            {activeTab === 'general' && (
                <div className="max-w-2xl">
                    <Card title="Global Application Settings">
                        <p className="text-xs text-gray-400 mb-6">Tweak platform parameters, background caches, and visualization tools. All configurations comply with zero-checkbox design system parameters.</p>
                        
                        <div className="space-y-6">
                            {/* Toggle: Debug Mode */}
                            <div className="flex items-center justify-between p-4 bg-gray-900/40 border border-gray-800/40 rounded-xl">
                                <div>
                                    <h4 className="text-sm font-bold text-white">Cryptographic Verbose Logger</h4>
                                    <p className="text-xs text-gray-500 mt-1">Output complete client and function stack executions directly into dev consoles.</p>
                                </div>
                                <button
                                    onClick={() => setDebugMode(!debugMode)}
                                    className={cn(
                                        "w-12 h-6 flex items-center p-1 cursor-pointer transition-colors duration-200 border rounded-full outline-none",
                                        debugMode ? "bg-[#ec028b] border-[#ec028b]/50 justify-end" : "bg-black border-gray-800 justify-start"
                                    )}
                                >
                                    <div className="w-4 h-4 bg-white rounded-full shadow-[0_0_5px_rgba(255,255,255,0.8)]" />
                                </button>
                            </div>

                            {/* Toggle: Guest Signup */}
                            <div className="flex items-center justify-between p-4 bg-gray-900/40 border border-gray-800/40 rounded-xl">
                                <div>
                                    <h4 className="text-sm font-bold text-white">Public Guest Estimator Entries</h4>
                                    <p className="text-xs text-gray-500 mt-1">Allow anonymous web leads to request roofing projections without standard email verification gates.</p>
                                </div>
                                <button
                                    onClick={() => setGuestSignup(!guestSignup)}
                                    className={cn(
                                        "w-12 h-6 flex items-center p-1 cursor-pointer transition-colors duration-200 border rounded-full outline-none",
                                        guestSignup ? "bg-[#ec028b] border-[#ec028b]/50 justify-end" : "bg-black border-gray-800 justify-start"
                                    )}
                                >
                                    <div className="w-4 h-4 bg-white rounded-full shadow-[0_0_5px_rgba(255,255,255,0.8)]" />
                                </button>
                            </div>

                            {/* Toggle: Drone Simulation */}
                            <div className="flex items-center justify-between p-4 bg-gray-900/40 border border-gray-800/40 rounded-xl">
                                <div>
                                    <h4 className="text-sm font-bold text-white">Simulation Intake Scan Mode</h4>
                                    <p className="text-xs text-gray-500 mt-1">Automatically generates coordinate points and slope angles when geocoding is selected.</p>
                                </div>
                                <button
                                    onClick={() => setDroneSimulation(!droneSimulation)}
                                    className={cn(
                                        "w-12 h-6 flex items-center p-1 cursor-pointer transition-colors duration-200 border rounded-full outline-none",
                                        droneSimulation ? "bg-[#ec028b] border-[#ec028b]/50 justify-end" : "bg-black border-gray-800 justify-start"
                                    )}
                                >
                                    <div className="w-4 h-4 bg-white rounded-full shadow-[0_0_5px_rgba(255,255,255,0.8)]" />
                                </button>
                            </div>

                            {/* Slider: Sync Interval */}
                            <div className="p-4 bg-gray-900/40 border border-gray-800/40 rounded-xl space-y-3">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h4 className="text-sm font-bold text-white">Live Data Synchronization Interval</h4>
                                        <p className="text-xs text-gray-500 mt-1">Frequency of outbound state queries dispatched to cloud databases.</p>
                                    </div>
                                    <span className="font-mono text-xs font-black text-[#ec028b]">{syncInterval} seconds</span>
                                </div>
                                <input 
                                    type="range" 
                                    min="5" 
                                    max="120" 
                                    step="5"
                                    value={syncInterval}
                                    onChange={e => setSyncInterval(Number(e.target.value))}
                                    className="w-full accent-[#ec028b] cursor-pointer bg-black/60 border border-gray-800 rounded-lg outline-none h-1.5"
                                    style={{ WebkitAppearance: 'none' }}
                                />
                            </div>

                            {/* Service State Boundary Limit */}
                            <div className="p-4 bg-gray-900/40 border border-gray-800/40 rounded-xl">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h4 className="text-sm font-bold text-white">Service State Boundary Limit</h4>
                                        <p className="text-xs text-gray-500 mt-1">Allowed region state code. Address intake and scheduling is blocked for other states.</p>
                                    </div>
                                    <input 
                                        type="text" 
                                        maxLength={2}
                                        value={serviceState}
                                        onChange={e => handleServiceStateChange(e.target.value)}
                                        className="w-16 bg-black border border-gray-850 focus:border-[#ec028b] rounded px-3 py-1.5 text-white font-bold text-center uppercase outline-none transition-colors"
                                        placeholder="UT"
                                    />
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            )}
        </PageContainer>
    );
};

export default AdminDashboardPage;
