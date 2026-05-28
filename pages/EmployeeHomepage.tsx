
import React, { useState, useEffect, useRef, useCallback } from 'react';
import PageContainer from '../components/PageContainer';
import Card from '../components/Card';
import Button from '../components/Button';
import {
    BriefcaseIcon,
    CalendarDaysIcon,
    ListBulletIcon,
    UserIcon,
    MagnifyingGlassIcon,
    ChatBubbleLeftRightIcon,
    DocumentDuplicateIcon,
    DocumentTextIcon,
    BoltIcon,
    MapPinIcon,
    XIcon,
    ArrowRightIcon,
    ChartPieIcon,
    ShieldCheckIcon,
} from '../components/icons';
import { PAGE_GROUPS } from '../constants';
import { useNavigation } from '../contexts/NavigationContext';
import { useMockDB } from '../contexts/MockDatabaseContext';
import { projectService, dashboardService, firestoreService } from '../lib/firebaseService';
import WeatherForecastStrip from '../components/WeatherForecastStrip';
import { getStagePageId } from '../lib/utils';

// ─── Global Dispatch Inline Search ────────────────────────────────────────────
const GlobalDispatchSearch: React.FC = () => {
    const { setActivePageId, setSelectedContactId, setSelectedProjectId, setSelectedPropertyId } = useNavigation();
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [contacts, setContacts] = useState<any[]>([]);
    const [projects, setProjects] = useState<any[]>([]);
    const [properties, setProperties] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Subscribe to all three collections once
    useEffect(() => {
        const unsubContacts = firestoreService.subscribeToDocuments('contacts', (data) => {
            setContacts(data);
            setLoading(false);
        });
        const unsubProjects = projectService.subscribe((data) => {
            setProjects(data);
        });
        const unsubProps = firestoreService.subscribeToDocuments('properties', (data) => {
            setProperties(data);
        });
        return () => { unsubContacts(); unsubProjects(); unsubProps(); };
    }, []);

    // Close when clicking outside
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
                setOpen(false);
                setQuery('');
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const lq = query.toLowerCase().trim();

    const filteredContacts = lq
        ? contacts.filter(c => {
            const name = `${c.first_name || ''} ${c.last_name || ''} ${c.name || ''}`.toLowerCase();
            return name.includes(lq) || (c.email || '').toLowerCase().includes(lq) || (c.phone || '').includes(lq);
        })
        : contacts.slice(0, 4);

    const filteredProjects = lq
        ? projects.filter(p =>
            (p.name || '').toLowerCase().includes(lq) ||
            (p.current_stage || '').toLowerCase().includes(lq) ||
            (p.property_address || '').toLowerCase().includes(lq)
        )
        : projects.slice(0, 4);

    const filteredProperties = lq
        ? properties.filter(p =>
            (p.address_full || '').toLowerCase().includes(lq) ||
            (p.city || '').toLowerCase().includes(lq) ||
            (p.type || '').toLowerCase().includes(lq)
        )
        : properties.slice(0, 3);

    const hasResults = filteredContacts.length + filteredProjects.length + filteredProperties.length > 0;
    const totalCount = filteredContacts.length + filteredProjects.length + filteredProperties.length;

    const handleOpen = () => {
        setOpen(true);
        setTimeout(() => inputRef.current?.focus(), 50);
    };

    const go = (pageId: string) => {
        setOpen(false);
        setQuery('');
        setActivePageId(pageId);
    };

    const goContact = (id: string) => {
        setOpen(false);
        setQuery('');
        setSelectedContactId(id);
        setActivePageId('E-10');
    };

    const goProject = (id: string, stage?: string) => {
        setOpen(false);
        setQuery('');
        setSelectedProjectId(id);
        setActivePageId(getStagePageId(stage));
    };

    const goProperty = (id: string) => {
        setOpen(false);
        setQuery('');
        setSelectedPropertyId(id);
        setActivePageId('E-12');
    };

    const stageBadge = (stage?: string) => {
        const s = (stage || '').toLowerCase();
        if (s.includes('lead')) return '#eab308';
        if (s.includes('quote')) return '#60a5fa';
        if (s.includes('sign')) return '#c084fc';
        if (s.includes('install') || s.includes('progress')) return '#fb923c';
        if (s.includes('complet') || s.includes('paid')) return '#4ade80';
        return '#6b7280';
    };

    return (
        <div ref={wrapperRef} style={{ position: 'relative' }}>
            {/* ── Trigger Button (collapsed state) ── */}
            {!open && (
                <button
                    onClick={handleOpen}
                    id="global-dispatch-btn"
                    className="group flex items-center px-4 py-2 bg-black/40 border border-[#ec028b] rounded-full hover:bg-[#ec028b] hover:text-white text-[#ec028b] transition-all duration-300 shadow-[0_0_10px_rgba(236,2,139,0.2)] hover:shadow-[0_0_20px_rgba(236,2,139,0.5)]"
                >
                    <MagnifyingGlassIcon className="w-5 h-5 mr-2" />
                    <span className="font-semibold text-sm">Global Dispatch</span>
                </button>
            )}

            {/* ── Expanded Search Input ── */}
            {open && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{
                        display: 'flex', alignItems: 'center',
                        background: 'rgba(0,0,0,0.6)',
                        border: '1px solid rgba(236,2,139,0.6)',
                        borderRadius: 24,
                        padding: '6px 14px',
                        gap: 8,
                        boxShadow: '0 0 16px rgba(236,2,139,0.18)',
                        backdropFilter: 'blur(12px)',
                        minWidth: 280,
                    }}>
                        <MagnifyingGlassIcon style={{ width: 16, height: 16, color: '#ec028b', flexShrink: 0 }} />
                        <input
                            ref={inputRef}
                            id="global-dispatch-input"
                            type="text"
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            placeholder="Search contacts, projects, properties…"
                            style={{
                                background: 'transparent',
                                border: 'none',
                                outline: 'none',
                                color: '#ffffff',
                                fontSize: 13,
                                fontWeight: 500,
                                width: '100%',
                                letterSpacing: '0.01em',
                            }}
                        />
                        {query && (
                            <button
                                onClick={() => setQuery('')}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', display: 'flex', padding: 0 }}
                            >
                                <XIcon style={{ width: 14, height: 14 }} />
                            </button>
                        )}
                    </div>
                    <button
                        onClick={() => { setOpen(false); setQuery(''); }}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.35)', fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 4 }}
                    >
                        <XIcon className="w-3 h-3" />
                        Cancel
                    </button>
                </div>
            )}

            {/* ── Dropdown Results Panel ── */}
            {open && (
                <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 10px)',
                    right: 0,
                    width: 420,
                    maxHeight: 520,
                    overflowY: 'auto',
                    background: 'linear-gradient(140deg, rgba(6,4,14,0.98) 0%, rgba(12,6,22,0.98) 100%)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 16,
                    boxShadow: '0 24px 60px rgba(0,0,0,0.9), 0 0 20px rgba(236,2,139,0.08)',
                    backdropFilter: 'blur(24px)',
                    zIndex: 99999,
                    overflow: 'hidden',
                }}>

                    {/* Header */}
                    <div style={{
                        padding: '12px 16px 10px',
                        borderBottom: '1px solid rgba(255,255,255,0.07)',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    }}>
                        <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#ec028b' }}>
                            Global Dispatch
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <div style={{ width: 6, height: 6, borderRadius: '50%', background: loading ? '#eab308' : '#4ade80' }} />
                            <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                {loading ? 'Syncing' : `${totalCount} results`}
                            </span>
                        </div>
                    </div>

                    <div style={{ maxHeight: 460, overflowY: 'auto' }}>

                        {/* ── Contacts ── */}
                        {filteredContacts.length > 0 && (
                            <div>
                                <div style={{ padding: '8px 16px 4px', fontSize: 9, fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)' }}>
                                    👤 People &amp; Contacts
                                </div>
                                {filteredContacts.slice(0, 5).map((c: any) => {
                                    const name = c.first_name || c.last_name
                                        ? `${c.first_name || ''} ${c.last_name || ''}`.trim()
                                        : c.name || 'Unknown';
                                    return (
                                        <div
                                            key={c.id}
                                            onClick={() => goContact(c.id)}
                                            style={{
                                                display: 'flex', alignItems: 'center', gap: 12,
                                                padding: '10px 16px',
                                                cursor: 'pointer',
                                                borderBottom: '1px solid rgba(255,255,255,0.04)',
                                                transition: 'background 0.15s',
                                            }}
                                            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(236,2,139,0.07)')}
                                            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                                        >
                                            <div style={{
                                                width: 36, height: 36, borderRadius: 9, flexShrink: 0,
                                                background: 'rgba(236,2,139,0.1)', border: '1px solid rgba(236,2,139,0.25)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            }}>
                                                <UserIcon style={{ width: 16, height: 16, color: '#ec028b' }} />
                                            </div>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#fff', lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</p>
                                                <p style={{ margin: '2px 0 0', fontSize: 10, color: 'rgba(255,255,255,0.35)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                    {[c.role, c.email].filter(Boolean).join(' · ')}
                                                </p>
                                            </div>
                                            <ArrowRightIcon style={{ width: 14, height: 14, color: 'rgba(255,255,255,0.2)', flexShrink: 0 }} />
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* ── Projects ── */}
                        {filteredProjects.length > 0 && (
                            <div>
                                <div style={{ padding: '8px 16px 4px', fontSize: 9, fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)' }}>
                                    💼 Active Projects
                                </div>
                                {filteredProjects.slice(0, 5).map((p: any) => (
                                    <div
                                        key={p.id}
                                        onClick={() => goProject(p.id, p.current_stage)}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: 12,
                                            padding: '10px 16px',
                                            cursor: 'pointer',
                                            borderBottom: '1px solid rgba(255,255,255,0.04)',
                                            transition: 'background 0.15s',
                                        }}
                                        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(236,2,139,0.07)')}
                                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                                    >
                                        <div style={{
                                            width: 36, height: 36, borderRadius: 9, flexShrink: 0,
                                            background: 'rgba(96,165,250,0.1)', border: '1px solid rgba(96,165,250,0.25)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        }}>
                                            <BriefcaseIcon style={{ width: 16, height: 16, color: '#60a5fa' }} />
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#fff', lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name || 'Unnamed Project'}</p>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                                                {p.current_stage && (
                                                    <span style={{
                                                        fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em',
                                                        color: stageBadge(p.current_stage), border: `1px solid ${stageBadge(p.current_stage)}44`,
                                                        background: `${stageBadge(p.current_stage)}18`, borderRadius: 4, padding: '1px 5px',
                                                    }}>{p.current_stage}</span>
                                                )}
                                                {p.property_address && (
                                                    <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.property_address}</span>
                                                )}
                                            </div>
                                        </div>
                                        <ArrowRightIcon style={{ width: 14, height: 14, color: 'rgba(255,255,255,0.2)', flexShrink: 0 }} />
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* ── Properties ── */}
                        {filteredProperties.length > 0 && (
                            <div>
                                <div style={{ padding: '8px 16px 4px', fontSize: 9, fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)' }}>
                                    📍 Properties &amp; Sites
                                </div>
                                {filteredProperties.slice(0, 4).map((p: any) => {
                                    const addr = p.address_full || [p.property_address, p.city, p.state].filter(Boolean).join(', ') || 'Unknown Address';
                                    return (
                                        <div
                                            key={p.id}
                                            onClick={() => goProperty(p.id)}
                                            style={{
                                                display: 'flex', alignItems: 'center', gap: 12,
                                                padding: '10px 16px',
                                                cursor: 'pointer',
                                                borderBottom: '1px solid rgba(255,255,255,0.04)',
                                                transition: 'background 0.15s',
                                            }}
                                            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(236,2,139,0.07)')}
                                            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                                        >
                                            <div style={{
                                                width: 36, height: 36, borderRadius: 9, flexShrink: 0,
                                                background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            }}>
                                                <MapPinIcon style={{ width: 16, height: 16, color: '#4ade80' }} />
                                            </div>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#fff', lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{addr}</p>
                                                {p.type && (
                                                    <p style={{ margin: '2px 0 0', fontSize: 10, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{p.type}</p>
                                                )}
                                            </div>
                                            <ArrowRightIcon style={{ width: 14, height: 14, color: 'rgba(255,255,255,0.2)', flexShrink: 0 }} />
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* Empty state */}
                        {!loading && !hasResults && (
                            <div style={{ padding: '28px 16px', textAlign: 'center' }}>
                                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.25)', fontStyle: 'italic' }}>
                                    {lq ? `No results for "${query}"` : 'No records in Firebase yet.'}
                                </p>
                            </div>
                        )}

                        {/* View all link */}
                        {hasResults && (
                            <div
                                onClick={() => go('E-02')}
                                style={{
                                    padding: '10px 16px',
                                    borderTop: '1px solid rgba(255,255,255,0.07)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                                    cursor: 'pointer',
                                    fontSize: 11, fontWeight: 700, color: '#ec028b',
                                    letterSpacing: '0.06em', textTransform: 'uppercase',
                                    transition: 'background 0.15s',
                                }}
                                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(236,2,139,0.07)')}
                                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                            >
                                Open Full Dispatch &nbsp;→
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

// Task Item Component
const TaskItem = ({ label, initialStatus, badge }: { label: string; initialStatus: boolean; badge?: string }) => {
    const [done, setDone] = React.useState(initialStatus);
    return (
        <li
            onClick={() => setDone(d => !d)}
            className={`flex items-center justify-between gap-3 p-2.5 rounded-lg border cursor-pointer transition-all duration-200 ${
                done ? 'border-green-500/20 bg-green-500/5 opacity-60' : 'border-gray-800 bg-gray-900/40 hover:border-gray-700'
            }`}
        >
            <div className="flex items-center gap-3 min-w-0">
                <div className={`flex-none w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${done ? 'bg-green-500/30 border-green-500/50' : 'border-gray-600'}`}>
                    {done && <div className="w-2 h-2 rounded-full bg-green-400" />}
                </div>
                <span className={`text-sm truncate ${done ? 'line-through text-gray-500' : 'text-gray-300'}`}>{label}</span>
            </div>
            {badge && !done && (
                <span className="flex-none text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded border border-orange-500/40 text-orange-400 bg-orange-500/10">
                    {badge}
                </span>
            )}
        </li>
    );
};

// Compact Session Widget
const SessionWidget = () => {
    const { currentUser } = useMockDB();
    const { setActivePageId } = useNavigation();

    return (
        <div className="bg-gray-900/60 border border-gray-700/50 rounded-xl p-4 flex items-center justify-between backdrop-blur-sm mb-6 shadow-lg">
            <div className="flex items-center">
                <div className="relative">
                    <img src={currentUser?.avatarUrl || "https://i.pravatar.cc/150?u=employee"} alt="User" className="w-12 h-12 rounded-full border border-[#ec028b]" />
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-black border border-[#ec028b] rounded-full"></div>
                </div>
                <div className="ml-4">
                    <h3 className="text-white font-bold">{currentUser?.name}</h3>
                    <p className="text-xs text-[#ec028b] font-medium">Clocked In: 08:00 AM</p>
                </div>
            </div>
            <div className="flex space-x-2">
                <button
                    onClick={() => setActivePageId('E-03')}
                    className="px-3 py-1.5 bg-black hover:bg-gray-900 text-xs text-white rounded-full border border-gray-700 hover:border-gray-500 transition-colors"
                >
                    My Info
                </button>
                <button className="px-3 py-1.5 bg-black hover:bg-gray-900 text-xs text-gray-400 hover:text-white rounded-full border border-gray-800 hover:border-gray-600 transition-colors">
                    Clock Out
                </button>
            </div>
        </div>
    );
};

// KPI Stat Card Component
const StatCard = ({ label, value, icon: Icon, trend, loading }: { label: string, value: string, icon: any, trend?: string, loading?: boolean }) => (
    <div className="bg-gray-900/60 border border-gray-700/50 p-4 rounded-xl flex items-center justify-between backdrop-blur-sm hover:border-[#ec028b]/50 transition-all duration-300 group shadow-lg">
        <div>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-wider group-hover:text-[#ec028b] transition-colors">{label}</p>
            {loading ? (
                <div className="mt-2 h-8 w-16 bg-gray-700/60 rounded animate-pulse" />
            ) : (
                <p className="text-2xl font-bold text-white mt-1">{value}</p>
            )}
            {trend && !loading && <p className="text-xs text-gray-500 mt-1 font-medium">{trend}</p>}
            {loading && <div className="mt-1 h-3 w-24 bg-gray-800/60 rounded animate-pulse" />}
        </div>
        <div className="h-12 w-12 rounded-full bg-black/40 border border-gray-700 flex items-center justify-center text-gray-500 group-hover:text-[#ec028b] group-hover:border-[#ec028b]/30 transition-all">
            <Icon className="h-6 w-6" />
        </div>
    </div>
);

// --- Storm Alert Widget (always visible, location-aware) ---
const GOOGLE_WEATHER_API_KEY = (import.meta as any).env?.VITE_GOOGLE_WEATHER_API_KEY || '';
const WEATHER_BASE = 'https://weather.googleapis.com/v1';
const DEFAULT_LAT = 39.7392;
const DEFAULT_LON = -104.9903;
const DEFAULT_CITY = 'Denver';

const STORM_TYPES = new Set([
    'THUNDERSTORM', 'TORNADO', 'HEAVY_RAIN', 'HAIL', 'FREEZING_RAIN',
    'HEAVY_SNOW', 'SLEET', 'SHOWERS', 'SCATTERED_SHOWERS',
]);

const StormAlertWidget = () => {
    const [hasStorm, setHasStorm] = useState(false);
    const [stormDesc, setStormDesc] = useState('Hail expected in Denver Area');
    const [cityName, setCityName] = useState(DEFAULT_CITY);
    const { setActivePageId } = useNavigation();

    // Get browser GPS coords, fallback to Denver
    const getCoords = (): Promise<{ lat: number; lon: number }> =>
        new Promise(resolve => {
            if (!navigator.geolocation) { resolve({ lat: DEFAULT_LAT, lon: DEFAULT_LON }); return; }
            navigator.geolocation.getCurrentPosition(
                pos => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
                () => resolve({ lat: DEFAULT_LAT, lon: DEFAULT_LON }),
                { timeout: 6000 }
            );
        });

    // Free reverse-geocode → city name (no key needed)
    const getCity = async (lat: number, lon: number): Promise<string> => {
        try {
            const r = await fetch(
                `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
            );
            if (!r.ok) return DEFAULT_CITY;
            const d = await r.json();
            return d.city || d.locality || d.principalSubdivision || DEFAULT_CITY;
        } catch { return DEFAULT_CITY; }
    };

    useEffect(() => {
        const run = async () => {
            const { lat, lon } = await getCoords();
            const city = await getCity(lat, lon);
            setCityName(city);

            // Demo mode when no API key – always show a storm alert
            if (!GOOGLE_WEATHER_API_KEY) {
                setHasStorm(true);
                setStormDesc(`Hail expected in ${city} Area`);
                return;
            }

            try {
                const res = await fetch(
                    `${WEATHER_BASE}/forecast/days:lookup?key=${GOOGLE_WEATHER_API_KEY}` +
                    `&location.latitude=${lat}&location.longitude=${lon}&days=7&unitsSystem=METRIC`
                );
                if (!res.ok) return;
                const data = await res.json();
                const firstStorm = data.forecastDays?.find((d: any) => {
                    const cond = d.daytimeForecast?.weatherCondition?.type || '';
                    const thunderProb = d.daytimeForecast?.thunderstormProbability ?? 0;
                    return STORM_TYPES.has(cond) || thunderProb >= 40;
                });
                if (firstStorm) {
                    const desc = firstStorm.daytimeForecast?.weatherCondition?.description?.text || 'Storm Warning';
                    setHasStorm(true);
                    setStormDesc(`${desc} in ${city} Area`);
                } else {
                    setHasStorm(false);
                    setStormDesc(`No active alerts near ${city}`);
                }
            } catch { /* ignore */ }
        };
        run();
    }, []);

    // ── Always visible: active storm = bold red/orange; calm = muted ──
    return (
        <div
            className={hasStorm
                ? 'rounded-xl p-4 flex items-center justify-between backdrop-blur-sm shadow-[0_0_20px_rgba(249,115,22,0.15)]'
                : 'rounded-xl p-4 flex items-center justify-between backdrop-blur-sm'
            }
            style={{
                background: hasStorm
                    ? 'rgba(18,8,2,0.85)'
                    : 'rgba(255,255,255,0.03)',
                border: hasStorm
                    ? '1px solid rgba(251,146,60,0.5)'
                    : '1px solid rgba(255,255,255,0.08)',
                transition: 'all 0.4s ease',
            }}
        >
            {/* Icon box */}
            <div className="flex items-center" style={{ gap: 14 }}>
                <div style={{
                    width: 44, height: 44, flexShrink: 0,
                    borderRadius: '50%',
                    background: hasStorm ? 'rgba(234,88,12,0.22)' : 'rgba(255,255,255,0.05)',
                    border: hasStorm ? '1px solid rgba(251,146,60,0.45)' : '1px solid rgba(255,255,255,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 22,
                }}>
                    {hasStorm ? '🌨️' : '🌤️'}
                </div>

                {/* Text */}
                <div>
                    <p style={{
                        margin: 0,
                        fontSize: 13,
                        fontWeight: 700,
                        color: hasStorm ? '#fb923c' : 'rgba(255,255,255,0.45)',
                        lineHeight: 1.25,
                    }}>
                        {hasStorm ? '⚠ Storm Alert' : 'Storm Alert'}
                    </p>
                    <p style={{
                        margin: '3px 0 0',
                        fontSize: 11,
                        color: hasStorm ? 'rgba(255,255,255,0.65)' : 'rgba(255,255,255,0.28)',
                        lineHeight: 1.3,
                        maxWidth: 180,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                    }}>
                        {stormDesc}
                    </p>
                </div>
            </div>

            {/* View button — always shown */}
            <button
                onClick={() => setActivePageId('E-38')}
                style={{
                    flexShrink: 0,
                    padding: '6px 14px',
                    borderRadius: 999,
                    background: hasStorm ? 'rgba(251,146,60,0.15)' : 'rgba(255,255,255,0.06)',
                    border: hasStorm ? '1px solid rgba(251,146,60,0.4)' : '1px solid rgba(255,255,255,0.1)',
                    color: hasStorm ? '#fb923c' : 'rgba(255,255,255,0.35)',
                    fontSize: 12, fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = hasStorm ? 'rgba(251,146,60,0.28)' : 'rgba(255,255,255,0.12)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = hasStorm ? 'rgba(251,146,60,0.15)' : 'rgba(255,255,255,0.06)'; }}
            >
                View
            </button>
        </div>
    );
};

const EmployeeHomepage: React.FC = () => {
    const page = PAGE_GROUPS.flatMap(g => g.pages).find(p => p.id === 'E-01');
    const { setActivePageId } = useNavigation();
    const { currentUser } = useMockDB();

    const [activity, setActivity] = useState<{ user: string; action: string; target: string; time: string }[]>([]);
    const [activityLoading, setActivityLoading] = useState(true);

    const [dashboardStats, setDashboardStats] = useState({
        activeProjects: 0,
        activeProjectsTrend: '',
        tasksDue: 0,
        tasksOverdue: 0,
        pendingQuotesCount: 0,
        pendingQuotesValue: 0,
        unreadMessages: 0,
    });
    const [statsLoading, setStatsLoading] = useState(true);

    const formatQuoteValue = (val: number) => {
        if (val === 0) return '$0';
        if (val >= 1000) return `$${(val / 1000).toFixed(1)}k`;
        return `$${val.toLocaleString()}`;
    };

    const timeAgo = (dateString: string) => {
        if (!dateString) return 'Just now';
        const diff = Date.now() - new Date(dateString).getTime();
        const minutes = Math.floor(diff / 60000);
        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        return `${Math.floor(hours / 24)}d ago`;
    };

    useEffect(() => {
        const unsubscribe = projectService.subscribeToRecentActivity((projects: any[]) => {
            const sorted = [...projects].sort((a, b) =>
                new Date(b.updated_at || b.created_at || 0).getTime() -
                new Date(a.updated_at || a.created_at || 0).getTime()
            ).slice(0, 5);

            const mapped = sorted.map((p: any) => ({
                user: 'New Lead',
                action: 'submitted project',
                target: p.name || 'Unnamed Project',
                time: timeAgo(p.updated_at || p.created_at),
            }));

            setActivity(mapped);
            setActivityLoading(false);
        });

        const unsubStats = dashboardService.subscribeToStats((stats) => {
            setDashboardStats(stats);
            setStatsLoading(false);
        });

        return () => {
            unsubscribe();
            unsubStats();
        };
    }, []);

    const schedule = [
        { time: '09:00 AM', event: 'Team Standup', type: 'Meeting' },
        { time: '11:30 AM', event: 'Site Visit - Thompson', type: 'Site' },
        { time: '02:00 PM', event: 'Vendor Call - ABC Supply', type: 'Call' },
    ];

    return (
        <PageContainer
            title={page?.name || 'Employee Homepage'}
            description="Welcome back. Here is your daily command center."
            headerAction={
                <div className="flex items-center space-x-3">
                    {/* 7-Day Weather Strip */}
                    {/* Weather strip removed */}
                    {/* Divider */}
                    <div className="h-6 w-[1px] bg-gray-700/60" />
                    <button
                        onClick={() => setActivePageId('E-SIM-GUIDE')}
                        className="flex items-center px-4 py-2 bg-gray-900/50 border border-gray-700 text-gray-400 rounded-full hover:bg-[#ec028b]/10 hover:text-[#ec028b] hover:border-[#ec028b]/50 transition-all text-sm font-medium"
                    >
                        <BoltIcon className="w-5 h-5 mr-2" />
                        Simulation Guide
                    </button>
                    <GlobalDispatchSearch />
                </div>
            }
        >
            {/* --- STATS OVERVIEW --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard
                    label="Active Projects"
                    value={String(dashboardStats.activeProjects)}
                    icon={BriefcaseIcon}
                    trend={dashboardStats.activeProjectsTrend}
                    loading={statsLoading}
                />
                <StatCard
                    label="Tasks Due"
                    value={String(dashboardStats.tasksDue)}
                    icon={ListBulletIcon}
                    trend={dashboardStats.tasksOverdue > 0 ? `${dashboardStats.tasksOverdue} overdue` : 'All on track'}
                    loading={statsLoading}
                />
                <StatCard
                    label="Pending Quotes"
                    value={formatQuoteValue(dashboardStats.pendingQuotesValue)}
                    icon={DocumentTextIcon}
                    trend={`${dashboardStats.pendingQuotesCount} waiting`}
                    loading={statsLoading}
                />
                <StatCard
                    label="Unread Msgs"
                    value={String(dashboardStats.unreadMessages)}
                    icon={ChatBubbleLeftRightIcon}
                    loading={statsLoading}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* --- LEFT COLUMN (Main Feed) --- */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Quick Actions */}
                    <Card title="Quick Actions">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <Button
                                variant="secondary"
                                className="flex-col h-24 hover:bg-gray-900 hover:border-[#ec028b]/50 hover:shadow-[0_0_15px_rgba(236,2,139,0.15)] transition-all bg-black/40 border-gray-700"
                                onClick={() => setActivePageId('E-02a')}
                            >
                                <UserIcon className="w-6 h-6 mb-2 text-[#ec028b]" />
                                <span className="text-xs uppercase font-bold tracking-wide">New Intake</span>
                            </Button>
                            <Button
                                variant="secondary"
                                className="flex-col h-24 hover:bg-gray-900 hover:border-[#ec028b]/50 hover:shadow-[0_0_15px_rgba(236,2,139,0.15)] transition-all bg-black/40 border-gray-700"
                                onClick={() => setActivePageId('E-05')}
                            >
                                <BriefcaseIcon className="w-6 h-6 mb-2 text-[#ec028b]" />
                                <span className="text-xs uppercase font-bold tracking-wide">Pipeline Overview</span>
                            </Button>
                            <Button
                                variant="secondary"
                                className="flex-col h-24 hover:bg-gray-900 hover:border-[#ec028b]/50 hover:shadow-[0_0_15px_rgba(236,2,139,0.15)] transition-all bg-black/40 border-gray-700"
                                onClick={() => setActivePageId('E-06')}
                            >
                                <CalendarDaysIcon className="w-6 h-6 mb-2 text-[#ec028b]" />
                                <span className="text-xs uppercase font-bold tracking-wide">Project Map</span>
                            </Button>
                            <Button
                                variant="secondary"
                                className="flex-col h-24 hover:bg-gray-900 hover:border-[#ec028b]/50 hover:shadow-[0_0_15px_rgba(236,2,139,0.15)] transition-all bg-black/40 border-gray-700"
                                onClick={() => setActivePageId('E-18')}
                                disabled={currentUser?.role !== 'Admin' && currentUser?.role !== 'Super Admin'}
                            >
                                <ChartPieIcon className="w-6 h-6 mb-2 text-[#ec028b]" />
                                <span className="text-xs uppercase font-bold tracking-wide">Reports</span>
                            </Button>
                        </div>
                    </Card>

                    {/* Recent Activity */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card title="Recent Activity" className="h-full">
                            {activityLoading ? (
                                <div className="flex items-center justify-center py-8">
                                    <div className="w-5 h-5 border-2 border-[#ec028b] border-t-transparent rounded-full animate-spin"></div>
                                    <span className="ml-3 text-sm text-gray-500">Loading activity...</span>
                                </div>
                            ) : activity.length === 0 ? (
                                <p className="text-sm text-gray-500 italic text-center py-6">No recent activity found.</p>
                            ) : (
                                <ul className="space-y-4">
                                    {activity.map((item, index) => (
                                        <li key={index} className="flex items-start text-sm border-b border-gray-800 pb-3 last:border-0 last:pb-0">
                                            <div className="w-2 h-2 rounded-full bg-[#ec028b] mt-1.5 mr-3 flex-shrink-0 shadow-[0_0_5px_#ec028b]"></div>
                                            <div>
                                                <p className="text-gray-300">
                                                    <span className="font-semibold text-white">{item.user}</span> {item.action} <span className="text-[#ec028b] font-medium">{item.target}</span>.
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">{item.time}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </Card>

                        <Card title="My Tasks" className="h-full">
                            <ul className="space-y-3">
                                <TaskItem label="Follow up with 1927 Thompson" initialStatus={false} badge="Overdue" />
                                <TaskItem label="Submit Q2 Expense Report" initialStatus={false} />
                                <TaskItem label="Finalize material order" initialStatus={true} />
                            </ul>
                        </Card>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Session Widget */}
                    <SessionWidget />

                    {/* Admin Insights (Only for Admin/Super Admin) */}
                    {(currentUser?.role === 'Admin' || currentUser?.role === 'Super Admin') && (
                        <Card className="bg-[#ec028b]/10 border-[#ec028b]/30 group hover:border-[#ec028b]/60 transition-all cursor-pointer overflow-hidden p-6" onClick={() => setActivePageId('A-01')}>
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <ShieldCheckIcon className="w-6 h-6 text-[#ec028b]" />
                                    <h4 className="font-black text-white uppercase tracking-widest text-sm leading-none">Control Room</h4>
                                </div>
                                <ArrowRightIcon className="w-4 h-4 text-[#ec028b] group-hover:translate-x-1 transition-transform" />
                            </div>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider leading-relaxed">
                                Access organization-wide oversight protocols and system status.
                            </p>
                        </Card>
                    )}

                    {/* Agenda */}
                    <Card title="Today's Schedule">
                        <div className="space-y-4">
                            {schedule.map((item, i) => (
                                <div key={i} className="flex items-start">
                                    <div className="w-16 text-xs font-mono text-gray-500 pt-1">{item.time}</div>
                                    <div className="flex-1 pb-4 border-l border-gray-800 pl-4 relative">
                                        <div className={`absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full ${item.type === 'Meeting' ? 'bg-white' : item.type === 'Site' ? 'bg-[#ec028b]' : 'bg-gray-600'}`}></div>
                                        <p className="text-sm font-bold text-white">{item.event}</p>
                                        <p className="text-xs text-gray-500 uppercase">{item.type}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Button
                            variant="secondary"
                            size="sm"
                            className="w-full mt-2 flex items-center justify-center gap-2"
                            onClick={() => setActivePageId('E-04')}
                        >
                            <CalendarDaysIcon className="w-4 h-4" />
                            View Full Calendar
                        </Button>
                    </Card>

                    {/* Pinned/Weather Widget (Dynamic) */}
                    <StormAlertWidget />
                </div>
            </div>
        </PageContainer>
    );
};

export default EmployeeHomepage;
