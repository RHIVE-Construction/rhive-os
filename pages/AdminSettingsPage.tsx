import React, { useState, useEffect } from 'react';
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
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

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

    const [activeTab, setActiveTab] = useState<'users' | 'pricing' | 'api' | 'oauth'>('users');
    const [editableUsers, setEditableUsers] = useState(users);

    // ── Google OAuth Settings ──────────────────────────────────────────────────
    const [oauthClientId, setOauthClientId] = useState('');
    const [oauthSaving, setOauthSaving] = useState(false);
    const [oauthLoading, setOauthLoading] = useState(false);
    const [oauthStatus, setOauthStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const [oauthConfigured, setOauthConfigured] = useState<boolean | null>(null);

    // Load existing client_id from Firestore on mount
    useEffect(() => {
        const loadOAuthSettings = async () => {
            setOauthLoading(true);
            try {
                const ref = doc(db, 'settings', 'google_oauth');
                const snap = await getDoc(ref);
                if (snap.exists() && snap.data()?.client_id) {
                    const existing = snap.data().client_id as string;
                    // Mask the client ID for display — show last 12 chars
                    setOauthClientId(existing);
                    setOauthConfigured(true);
                } else {
                    setOauthConfigured(false);
                }
            } catch {
                setOauthConfigured(false);
            } finally {
                setOauthLoading(false);
            }
        };
        loadOAuthSettings();
    }, []);

    const handleSaveOAuth = async () => {
        const trimmed = oauthClientId.trim();
        if (!trimmed) {
            setOauthStatus({ type: 'error', message: 'Client ID cannot be empty.' });
            return;
        }
        if (!trimmed.endsWith('.apps.googleusercontent.com')) {
            setOauthStatus({ type: 'error', message: 'Invalid Client ID format. It must end with .apps.googleusercontent.com' });
            return;
        }
        setOauthSaving(true);
        setOauthStatus(null);
        try {
            const ref = doc(db, 'settings', 'google_oauth');
            await setDoc(ref, { client_id: trimmed }, { merge: true });
            setOauthConfigured(true);
            setOauthStatus({ type: 'success', message: 'Google OAuth Client ID saved successfully. Calendar sync is now enabled.' });
        } catch (err: any) {
            setOauthStatus({ type: 'error', message: err?.message || 'Failed to save. Check Firestore permissions.' });
        } finally {
            setOauthSaving(false);
        }
    };
    
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
                    { id: 'api', label: 'API & Console Diagnostics', icon: <KeyIcon className="w-4 h-4 mr-2" /> },
                    { id: 'oauth', label: 'Google OAuth', icon: (
                        <svg className="w-4 h-4 mr-2 shrink-0" viewBox="0 0 24 24" fill="none">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                    )},
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

            {/* TAB: GOOGLE OAUTH */}
            {activeTab === 'oauth' && (
                <div className="space-y-6">
                    <Card title="Google OAuth 2.0 Configuration">
                        <p className="text-xs text-gray-400 mb-6">
                            Configure the Google OAuth Client ID used for Calendar Sync. This is stored securely in Firestore
                            at <span className="font-mono text-gray-300">settings/google_oauth</span> and is read at runtime — no environment variables required.
                        </p>

                        {/* Current Status */}
                        <div className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-xl border mb-6",
                            oauthConfigured === true
                                ? "bg-green-900/10 border-green-700/40"
                                : oauthConfigured === false
                                    ? "bg-red-900/10 border-red-700/40"
                                    : "bg-gray-900/40 border-gray-800"
                        )}>
                            {oauthLoading ? (
                                <span className="w-3 h-3 rounded-full border-2 border-gray-600 border-t-white animate-spin" />
                            ) : (
                                <span className={cn(
                                    "w-2.5 h-2.5 rounded-full shrink-0",
                                    oauthConfigured === true ? "bg-green-400 shadow-[0_0_8px_#4ade80]" :
                                    oauthConfigured === false ? "bg-red-400" : "bg-gray-600"
                                )} />
                            )}
                            <div>
                                <p className={cn(
                                    "text-xs font-black uppercase tracking-widest",
                                    oauthConfigured === true ? "text-green-400" :
                                    oauthConfigured === false ? "text-red-400" : "text-gray-500"
                                )}>
                                    {oauthLoading ? 'Checking Firestore…' :
                                     oauthConfigured === true ? 'Google OAuth Configured — Calendar Sync Enabled' :
                                     oauthConfigured === false ? 'Not Configured — Calendar Sync Will Fail' : 'Unknown'}
                                </p>
                                {oauthConfigured === false && (
                                    <p className="text-[10px] text-red-400/70 mt-0.5">Save a valid Client ID below to enable calendar sync for all users.</p>
                                )}
                            </div>
                        </div>

                        {/* Input */}
                        <div className="space-y-3">
                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500">Google OAuth Client ID</label>
                            <input
                                id="google-oauth-client-id-input"
                                type="text"
                                value={oauthClientId}
                                onChange={(e) => { setOauthClientId(e.target.value); setOauthStatus(null); }}
                                placeholder="xxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com"
                                className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-xs font-mono text-gray-200 placeholder-gray-700 focus:outline-none focus:border-[#ec028b]/60 focus:shadow-[0_0_0_1px_rgba(236,2,139,0.2)] transition-all"
                                disabled={oauthSaving}
                            />
                            <p className="text-[10px] text-gray-600">
                                Find this in{' '}
                                <a
                                    href="https://console.cloud.google.com/apis/credentials"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-400 hover:text-blue-300 underline"
                                >
                                    Google Cloud Console → APIs & Services → Credentials
                                </a>
                                {' '}under your OAuth 2.0 Client ID.
                            </p>
                        </div>

                        {/* Feedback */}
                        {oauthStatus && (
                            <div className={cn(
                                "mt-4 px-4 py-3 rounded-xl border",
                                oauthStatus.type === 'success'
                                    ? "bg-green-900/10 border-green-700/40"
                                    : "bg-red-900/10 border-red-700/40"
                            )}>
                                <p className={cn(
                                    "text-xs font-bold",
                                    oauthStatus.type === 'success' ? "text-green-400" : "text-red-400"
                                )}>
                                    {oauthStatus.type === 'success' ? '✓' : '✕'} {oauthStatus.message}
                                </p>
                            </div>
                        )}

                        {/* Save Button */}
                        <div className="mt-5">
                            <Button
                                id="save-google-oauth-btn"
                                onClick={handleSaveOAuth}
                                disabled={oauthSaving || oauthLoading}
                                className="bg-[#ec028b] hover:bg-[#d0027a] text-white border-transparent disabled:opacity-40 flex items-center gap-2"
                            >
                                {oauthSaving ? (
                                    <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving…</>
                                ) : (
                                    'Save Client ID'
                                )}
                            </Button>
                        </div>

                        {/* Instructions */}
                        <div className="mt-6 pt-5 border-t border-gray-800 space-y-3">
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-600">Setup Instructions</p>
                            <ol className="text-[11px] text-gray-400 space-y-2 ml-4 list-decimal">
                                <li>Go to <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">Google Cloud Console</a> and open your project.</li>
                                <li>Navigate to <span className="font-mono text-gray-300">APIs & Services → Credentials</span>.</li>
                                <li>Create or select an <span className="font-mono text-gray-300">OAuth 2.0 Client ID</span> (Web Application type).</li>
                                <li>Add your domain to <span className="font-mono text-gray-300">Authorized JavaScript Origins</span> (e.g. <span className="font-mono text-blue-300">https://rhive-os.web.app</span>).</li>
                                <li>Copy the Client ID and paste it above, then click <span className="font-mono text-gray-300">Save Client ID</span>.</li>
                            </ol>
                        </div>
                    </Card>
                </div>
            )}
        </PageContainer>
    );
};

export default AdminSettingsPage;
