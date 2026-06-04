import React, { useState, useEffect } from 'react';
import PageContainer from '../components/PageContainer';
import { dashboardService, projectService, userService } from '../lib/firebaseService';
import { 
    HomeIcon, 
    UserIcon, 
    ChartPieIcon, 
    CommandLineIcon,
    ShieldCheckIcon,
    IdentificationIcon,
    ArrowUpIcon,
    ArrowDownIcon,
    PencilSquareIcon,
    KeyIcon,
    PlusIcon,
    TrashIcon,
    SparklesIcon
} from '../components/icons';
import { cn } from '../lib/utils';
import Card from '../components/Card';
import Button from '../components/Button';
import { useMockDB } from '../contexts/MockDatabaseContext';

const PricingRow = ({ name, unit, cost, onEdit }: { name: string, unit: string, cost: string, onEdit: () => void }) => (
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
    const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'pricing' | 'api' | 'general'>('overview');

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

    // 2. Webhooks State
    const [webhooks, setWebhooks] = useState([
        { id: 1, name: 'Zoho Estimate Sync', url: 'https://api.zoho.com/v2/webhooks/rhive', events: 'Estimate Created', active: true },
        { id: 2, name: 'Slack Alerts Hook', url: 'https://hooks.slack.com/services/T000/B000/XXXX', events: 'Project Status Changed', active: true }
    ]);
    const [webhookName, setWebhookName] = useState('');
    const [webhookUrl, setWebhookUrl] = useState('');
    const [webhookEvent, setWebhookEvent] = useState('Estimate Created');

    // 3. MCP Connections State
    const [mcpConnections, setMcpConnections] = useState([
        { id: 'mcp-1', name: 'Firebase Admin MCP', host: 'localhost:8080', tools: 'auth_user, list_databases', active: true },
        { id: 'mcp-2', name: 'Roofr Auto-Order Bot', host: 'localhost:9000', tools: 'place_order, get_measurements', active: true }
    ]);
    const [mcpName, setMcpName] = useState('');
    const [mcpHost, setMcpHost] = useState('');
    const [mcpTools, setMcpTools] = useState('');

    // 4. General Settings State (Toggles without Checkboxes)
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

    const handleAddWebhook = (e: React.FormEvent) => {
        e.preventDefault();
        if (!webhookName || !webhookUrl) return;
        setWebhooks(prev => [
            ...prev,
            { id: Date.now(), name: webhookName, url: webhookUrl, events: webhookEvent, active: true }
        ]);
        setWebhookName('');
        setWebhookUrl('');
    };

    const handleDeleteWebhook = (id: number) => {
        setWebhooks(prev => prev.filter(w => w.id !== id));
    };

    const handleAddMcp = (e: React.FormEvent) => {
        e.preventDefault();
        if (!mcpName || !mcpHost) return;
        setMcpConnections(prev => [
            ...prev,
            { id: String(Date.now()), name: mcpName, host: mcpHost, tools: mcpTools || 'all', active: true }
        ]);
        setMcpName('');
        setMcpHost('');
        setMcpTools('');
    };

    const handleDeleteMcp = (id: string) => {
        setMcpConnections(prev => prev.filter(m => m.id !== id));
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
            description="Manage global operations: baseline estimator pricing matrices, active webhook endpoints, MCP servers, and full application configurations."
        >
            {/* Tabs Controller */}
            <div className="flex flex-wrap gap-1.5 border-b border-gray-800 pb-4 mb-6">
                {[
                    { id: 'overview', label: 'Command Overview', icon: <ChartPieIcon className="w-3.5 h-3.5 mr-2" /> },
                    { id: 'pricing', label: 'Pricing Defaults', icon: <PencilSquareIcon className="w-3.5 h-3.5 mr-2" /> },
                    { id: 'api', label: 'API & Webhooks', icon: <KeyIcon className="w-3.5 h-3.5 mr-2" /> },
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
                                                    <p className="text-[10px] text-gray-500 font-mono italic">ID: {p.id.slice(-8)} • {p.current_stage || 'Intake'}</p>
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

            {/* TAB: API & WEBHOOKS */}
            {activeTab === 'api' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Webhook Registry */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Webhook Configuration Table */}
                        <div 
                            className="bg-gray-900/40 border border-gray-800 overflow-hidden"
                            style={{ clipPath: 'polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)' }}
                        >
                            <div className="p-4 border-b border-gray-800 bg-black/20">
                                <h3 className="text-xs font-black text-white uppercase tracking-widest">
                                    Outbound Event Webhooks
                                </h3>
                            </div>
                            <div className="divide-y divide-gray-800/50">
                                {webhooks.map((w) => (
                                    <div key={w.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-white/5 transition-all">
                                        <div>
                                            <p className="text-sm font-bold text-white leading-none mb-1">{w.name}</p>
                                            <p className="text-[10px] text-gray-500 font-mono truncate max-w-sm mt-1">{w.url}</p>
                                            <span className="inline-block mt-2 text-[8px] font-bold uppercase tracking-wide border border-rhive-pink/30 text-rhive-pink px-2 py-0.5 rounded">
                                                Event: {w.events}
                                            </span>
                                        </div>
                                        <div className="flex items-center space-x-3 self-end md:self-auto">
                                            <span className="text-[9px] font-black uppercase bg-green-950/40 border border-green-800 text-green-400 px-2 py-0.5 rounded">
                                                Active
                                            </span>
                                            <button 
                                                onClick={() => handleDeleteWebhook(w.id)}
                                                className="p-1.5 bg-black border border-gray-800 hover:border-red-500 text-gray-500 hover:text-red-500 rounded"
                                            >
                                                <TrashIcon className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Add Webhook Form */}
                        <div 
                            className="bg-gray-900/40 border border-gray-800 p-6"
                            style={{ clipPath: 'polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)' }}
                        >
                            <h4 className="text-xs font-black uppercase tracking-widest text-white mb-4">Register New Outbound Endpoint</h4>
                            <form onSubmit={handleAddWebhook} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 block mb-1">Webhook Name</label>
                                        <input 
                                            type="text" 
                                            placeholder="Zoho Forwarder..." 
                                            value={webhookName}
                                            onChange={e => setWebhookName(e.target.value)}
                                            className="w-full bg-black border border-gray-800 focus:border-[#ec028b] px-3 py-2 outline-none text-xs text-white"
                                            style={{ clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)' }}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 block mb-1">Trigger Event</label>
                                        <select 
                                            value={webhookEvent}
                                            onChange={e => setWebhookEvent(e.target.value)}
                                            className="w-full bg-black border border-gray-800 focus:border-[#ec028b] px-3 py-2 outline-none text-xs text-gray-300 cursor-pointer"
                                            style={{ clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)' }}
                                        >
                                            <option value="Estimate Created">Estimate Created</option>
                                            <option value="Project Status Changed">Project Status Changed</option>
                                            <option value="Lead Submitted">Lead Submitted</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 block mb-1">Target Endpoint URL</label>
                                    <input 
                                        type="url" 
                                        placeholder="https://yourserver.com/hooks/endpoint" 
                                        value={webhookUrl}
                                        onChange={e => setWebhookUrl(e.target.value)}
                                        className="w-full bg-black border border-gray-800 focus:border-[#ec028b] px-3 py-2 outline-none text-xs text-white"
                                        style={{ clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)' }}
                                    />
                                </div>
                                <Button type="submit" className="w-full h-10 text-[10px] font-black uppercase tracking-widest bg-rhive-pink/20 hover:bg-rhive-pink/40 border border-rhive-pink/40">
                                    <PlusIcon className="w-4 h-4 mr-1.5" /> Register Hook
                                </Button>
                            </form>
                        </div>
                    </div>

                    {/* Right: API Tokens & MCP Connections */}
                    <div className="space-y-6">
                        {/* MCP Connections */}
                        <div 
                            className="bg-gray-900/40 border border-gray-800 overflow-hidden"
                            style={{ clipPath: 'polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)' }}
                        >
                            <div className="p-4 border-b border-gray-800 bg-black/20">
                                <h4 className="text-xs font-black text-white uppercase tracking-widest">Active MCP Server Connections</h4>
                            </div>
                            <div className="divide-y divide-gray-800/50 p-4 space-y-3">
                                {mcpConnections.map((m) => (
                                    <div key={m.id} className="flex justify-between items-center p-3 bg-black/40 border border-gray-800 rounded-lg">
                                        <div>
                                            <p className="text-xs font-bold text-white">{m.name}</p>
                                            <p className="text-[10px] text-gray-500 font-mono mt-0.5">{m.host}</p>
                                        </div>
                                        <button 
                                            onClick={() => handleDeleteMcp(m.id)}
                                            className="p-1 bg-black border border-gray-800 hover:border-red-500 text-gray-500 hover:text-red-500 rounded"
                                        >
                                            <TrashIcon className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                ))}
                                
                                <form onSubmit={handleAddMcp} className="space-y-2.5 pt-3 border-t border-gray-800">
                                    <input 
                                        type="text" 
                                        placeholder="MCP Connection Name..." 
                                        value={mcpName}
                                        onChange={e => setMcpName(e.target.value)}
                                        className="w-full bg-black border border-gray-850 focus:border-[#ec028b] px-3 py-1.5 outline-none text-xs text-white"
                                        style={{ clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)' }}
                                    />
                                    <input 
                                        type="text" 
                                        placeholder="Endpoint Host (e.g. localhost:9000)..." 
                                        value={mcpHost}
                                        onChange={e => setMcpHost(e.target.value)}
                                        className="w-full bg-black border border-gray-850 focus:border-[#ec028b] px-3 py-1.5 outline-none text-xs text-white"
                                        style={{ clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)' }}
                                    />
                                    <button type="submit" className="w-full py-1.5 text-[9px] font-black uppercase bg-white/5 hover:bg-white/10 border border-white/10 hover:border-rhive-pink text-gray-300 hover:text-white transition-all rounded">
                                        Add MCP connection
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* Traditional Tokens */}
                        <div 
                            className="bg-black/60 border border-gray-800 p-6"
                            style={{ clipPath: 'polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)' }}
                        >
                            <h4 className="text-xs font-black text-white uppercase tracking-wider mb-4">Static API Access Keys</h4>
                            <div className="space-y-3">
                                {[
                                    { name: "Google Maps API Key", key: "gmaps_val_******************982A" },
                                    { name: "Twilio Gateway Auth Token", key: "twilio_auth_*****************481F" },
                                    { name: "Zoho CRM Connection Link", key: "zoho_oauth_******************773C" }
                                ].map((api, index) => (
                                    <div key={index} className="flex justify-between items-center p-3 bg-gray-900/40 border border-gray-800/40 rounded-lg">
                                        <div>
                                            <p className="text-[11px] font-bold text-white">{api.name}</p>
                                            <p className="font-mono text-[9px] text-gray-500 mt-1">{api.key}</p>
                                        </div>
                                        <button className="px-2 py-1 bg-black hover:bg-gray-900 border border-gray-800 hover:border-rhive-pink rounded text-[8px] font-bold text-gray-400 hover:text-white transition-all">Rotate</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
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
