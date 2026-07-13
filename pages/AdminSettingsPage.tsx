import React, { useState } from 'react';
import PageContainer from '../components/PageContainer';
import Card from '../components/Card';
import Button from '../components/Button';
import CollapsibleSection from '../components/CollapsibleSection';
import { useMockDB } from '../contexts/MockDatabaseContext';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { cn } from '../lib/utils';
import { 
    UserIcon, 
    ShieldCheckIcon, 
    PencilSquareIcon,
    BoltIcon,
    KeyIcon
} from '../components/icons';

const PricingRow = ({ name, unit, cost, onEdit }: { name: string, unit: string, cost: string, onEdit: () => void }) => (
    <div className="grid grid-cols-3 items-center p-3 bg-gray-900/40 border border-gray-800/40 rounded-xl hover:bg-gray-800/30 transition-all">
        <span className="text-gray-300 font-medium text-sm">{name}</span>
        <span className="text-gray-400 text-xs font-mono">{unit}</span>
        <div className="flex items-center justify-end space-x-3">
            <span className="font-mono text-white text-sm font-bold">{cost}</span>
            <Button variant="secondary" size="sm" className="!p-2 hover:border-[#ec028b]/50" onClick={onEdit}>
                <PencilSquareIcon className="w-4 h-4 text-gray-400 hover:text-white" />
            </Button>
        </div>
    </div>
);

const AdminSettingsPage: React.FC = () => {
    const { users, currentUser } = useMockDB();
    const { theme } = useTheme();
    const { t } = useLanguage();
    const isDark = theme === 'dark';

    const [activeTab, setActiveTab] = useState<'users' | 'pricing' | 'api'>('users');
    const [editableUsers, setEditableUsers] = useState(users);
    
    // Hardcoded mock pricing defaults for local editing
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

    const handleRoleChange = (userId: string, newRole: any) => {
        setEditableUsers(prev => prev.map(u => 
            u.id === userId ? { ...u, role: newRole } : u
        ));
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

    return (
        <PageContainer 
            title="System Configuration" 
            description="Manage global operation controls, user authorizations, estimate pricing parameters, and system webhooks."
        >
            {/* Tabs Controller */}
            <div className="flex space-x-1.5 border-b border-gray-800 pb-4 mb-6">
                {[
                    { id: 'users', label: 'User Permissions', icon: <UserIcon className="w-4 h-4 mr-2" /> },
                    { id: 'pricing', label: 'Pricing Defaults', icon: <PencilSquareIcon className="w-4 h-4 mr-2" /> },
                    { id: 'api', label: 'API & Console Diagnostics', icon: <KeyIcon className="w-4 h-4 mr-2" /> }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={cn(
                            "flex items-center px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg border transition-all duration-300",
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

            {/* TAB: USERS */}
            {activeTab === 'users' && (
                <Card title="User Authorization Matrix">
                    <p className="text-xs text-gray-400 mb-6">Modify operational roles and credentials for internal and external platform access.</p>
                    <div className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-12 text-[10px] font-black uppercase tracking-wider text-gray-500 px-3 pb-2 border-b border-gray-800">
                            <div className="md:col-span-4">Operator Name</div>
                            <div className="md:col-span-4">Identity / Caching Email</div>
                            <div className="md:col-span-3">Role Authorization</div>
                            <div className="md:col-span-1 text-right">Status</div>
                        </div>
                        {editableUsers.map(user => (
                            <div 
                                key={user.id} 
                                className="grid grid-cols-1 md:grid-cols-12 items-center p-3 bg-gray-900/30 border border-gray-800/40 rounded-xl hover:bg-gray-800/20 transition-all gap-2 md:gap-0"
                            >
                                <div className="md:col-span-4 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-[#ec028b]/15 text-white flex items-center justify-center font-bold text-xs">
                                        {user.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-white">{user.name}</p>
                                        <p className="text-[10px] text-gray-500 font-mono mt-0.5">{user.id}</p>
                                    </div>
                                </div>
                                <div className="md:col-span-4 text-xs font-mono text-gray-400 truncate pr-2">
                                    {user.email || 'N/A'}
                                </div>
                                <div className="md:col-span-3">
                                    {user.id === currentUser?.id ? (
                                        <span className="text-xs bg-[#ec028b]/10 border border-[#ec028b]/30 text-[#ec028b] px-3 py-1 rounded-full font-bold">
                                            {user.role} (You)
                                        </span>
                                    ) : (
                                        <select 
                                            value={user.role}
                                            onChange={(e) => handleRoleChange(user.id, e.target.value as any)}
                                            className="bg-black border border-gray-800 rounded-lg text-xs px-3 py-1 text-gray-300 focus:outline-none focus:border-[#ec028b] cursor-pointer"
                                        >
                                            <option value="Admin">Admin</option>
                                            <option value="Employee">Employee</option>
                                            <option value="Customer">Customer</option>
                                            <option value="Contractor">Contractor</option>
                                            <option value="Supplier">Supplier</option>
                                        </select>
                                    )}
                                </div>
                                <div className="md:col-span-1 text-right">
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-green-900/35 border border-green-800 text-green-400">
                                        Active
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            )}

            {/* TAB: PRICING */}
            {activeTab === 'pricing' && (
                <div className="space-y-6">
                    <Card title="Live Estimate Calculations Base Model">
                        <p className="text-xs text-gray-400 mb-4">Edit baseline costs, task coefficients, and global business margins.</p>
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

            {/* TAB: API */}
            {activeTab === 'api' && (
                <div className="space-y-6">
                    <Card title="Payload Diagnostics Console">
                        <p className="text-xs text-gray-400 mb-4">View standard JSON data payloads dispatched for quotes.</p>
                        <div className="bg-black/60 p-4 rounded-xl border border-gray-800 font-mono text-[11px] text-green-400 overflow-x-auto shadow-inner">
                            <pre>{`{
  "project_id": "PROJ-12345",
  "survey_state": {
    "totalSq": 2500,
    "wasteFactor": 10,
    "pitch": "6/12",
    "roofLayers": "1",
    "upgrades": {
      "roof": "TruDefinition® Duration®",
      "gutters": "K-Style"
    },
    "features": {
      "chimneys": 1,
      "skylights": 0
    }
  },
  "pricing_context_version": "v2.1.0",
  "request_type": "CERTIFIED_QUOTE"
}`}</pre>
                        </div>
                    </Card>

                    <Card title="API Access Tokens">
                        <p className="text-xs text-gray-400 mb-4">Issue and rotate cryptographic keys for third-party service connections (Twilio, Zoho, Google Maps).</p>
                        <div className="space-y-3">
                            {[
                                { name: "Google Maps API Key", key: "gmaps_val_******************982A", status: "Connected" },
                                { name: "Twilio Gateway Auth Token", key: "twilio_auth_*****************481F", status: "Connected" },
                                { name: "Zoho CRM Connection Link", key: "zoho_oauth_******************773C", status: "Authorized" }
                            ].map((api, index) => (
                                <div key={index} className="flex items-center justify-between p-4 bg-gray-900/40 border border-gray-800/40 rounded-xl">
                                    <div>
                                        <p className="text-sm font-bold text-white">{api.name}</p>
                                        <p className="font-mono text-xs text-gray-500 mt-1">{api.key}</p>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <span className="text-[9px] font-black uppercase bg-green-950/40 border border-green-800 text-green-400 px-2 py-0.5 rounded">
                                            {api.status}
                                        </span>
                                        <Button variant="secondary" size="sm">Rotate</Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            )}
        </PageContainer>
    );
};

export default AdminSettingsPage;
