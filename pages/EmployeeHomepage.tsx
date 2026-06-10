
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
    BellIcon,
} from '../components/icons';
import { PAGE_GROUPS } from '../constants';
import { useNavigation } from '../contexts/NavigationContext';
import { useMockDB } from '../contexts/MockDatabaseContext';
import { projectService, dashboardService, firestoreService } from '../lib/firebaseService';
import WeatherForecastStrip from '../components/WeatherForecastStrip';
import { getStagePageId, cn } from '../lib/utils';

// Stateful Notification Bell Widget
const NotificationBell: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([
        { id: '1', title: 'Emergency Tarping Required', message: 'Tarping request detected for property 4505 Industrial Parkway.', time: '5m ago', read: false },
        { id: '2', title: 'Address Collision Detected', message: 'Linda Hansen and Tyler Hansen duplicated record merge needed.', time: '20m ago', read: false },
        { id: '3', title: 'Boise Lead Routed', message: 'Lead from Boise region automatically flagged and held.', time: '1h ago', read: true }
    ]);
    const unreadCount = notifications.filter(n => !n.read).length;

    const toggleOpen = () => setIsOpen(!isOpen);
    const markAllRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    return (
        <div className="relative">
            <button 
                id="btn-notification-bell"
                onClick={toggleOpen} 
                className="relative p-2 text-gray-400 hover:text-white bg-black/40 border border-gray-850 hover:border-rhive-pink transition-all flex items-center justify-center rounded-xl shadow-[0_0_10px_rgba(236,2,139,0.05)] hover:shadow-pink-glow-sm cursor-pointer outline-none"
            >
                <BellIcon className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span 
                        id="notification-badge"
                        className="absolute -top-1 -right-1 w-4 h-4 bg-rhive-pink text-white font-mono text-[9px] font-black flex items-center justify-center rounded-full border border-black shadow-[0_0_5px_rgba(236,2,139,0.8)] animate-pulse"
                    >
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                    <div 
                        id="notification-dropdown"
                        className="absolute right-0 mt-2.5 w-80 bg-[#050505] border border-gray-800 shadow-2xl p-4 space-y-3 z-50 animate-fade-in"
                        style={{ clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)' }}
                    >
                        <div className="flex justify-between items-center border-b border-gray-850 pb-2">
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#ec028b]">System Alerts</span>
                            {unreadCount > 0 && (
                                <button 
                                    onClick={markAllRead} 
                                    className="text-[9px] font-bold uppercase tracking-wider text-gray-500 hover:text-white transition-colors cursor-pointer"
                                >
                                    Mark all read
                                </button>
                            )}
                        </div>
                        <div className="space-y-2.5 max-h-64 overflow-y-auto">
                            {notifications.map(n => (
                                <div 
                                    key={n.id} 
                                    className={cn(
                                        "p-2.5 border transition-colors flex flex-col gap-1",
                                        n.read ? "bg-black/20 border-gray-905 text-gray-400" : "bg-rhive-pink/5 border-[#ec028b]/20 text-white"
                                    )}
                                    style={{ clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)' }}
                                >
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-black uppercase tracking-wider truncate mr-2">{n.title}</span>
                                        <span className="text-[8px] font-mono text-gray-500 whitespace-nowrap">{n.time}</span>
                                    </div>
                                    <p className="text-[10px] leading-relaxed text-gray-400 font-medium">{n.message}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
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

// Avatar upload and cloud sync modal (local files, Google Drive, Google Photos)
interface AvatarUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectAvatar: (url: string) => void;
    currentAvatar: string;
}

const AvatarUploadModal: React.FC<AvatarUploadModalProps> = ({ isOpen, onClose, onSelectAvatar, currentAvatar }) => {
    const [selectedTab, setSelectedTab] = useState<'upload' | 'drive' | 'photos'>('upload');
    const [uploadError, setUploadError] = useState('');
    const [selectedMockImg, setSelectedMockImg] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            setUploadError('Invalid file type. Please upload an image.');
            return;
        }
        setUploadError('');
        const reader = new FileReader();
        reader.onload = (event) => {
            if (event.target?.result) {
                onSelectAvatar(event.target.result as string);
                onClose();
            }
        };
        reader.readAsDataURL(file);
    };

    const mockDriveFiles = [
        { id: 'd1', name: 'michael_headshot_pro.jpg', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200' },
        { id: 'd2', name: 'rhive_logo_badge.png', url: 'https://i.imgur.com/t0VcSgJ.png' },
        { id: 'd3', name: 'executive_portrait.png', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200' }
    ];

    const mockPhotos = [
        { id: 'p1', name: 'vacation_smile.jpg', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200' },
        { id: 'p2', name: 'office_profile.jpg', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200' },
        { id: 'p3', name: 'casual_weekend.jpg', url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200' }
    ];

    const filesToDisplay = selectedTab === 'drive' ? mockDriveFiles : mockPhotos;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[99999] flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
            <div 
                className="w-full max-w-md bg-black border border-rhive-pink/40 shadow-[0_0_30px_rgba(236,2,139,0.25)] p-6 relative flex flex-col gap-4 text-left"
                style={{ clipPath: 'polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)' }}
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center border-b border-gray-800 pb-3">
                    <div>
                        <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest block">IDENTITY MAPPING</span>
                        <h3 className="text-sm font-black text-white uppercase tracking-wider mt-0.5">Operator Avatar Sync</h3>
                    </div>
                    <button onClick={onClose} className="p-1 bg-black border border-gray-850 hover:border-rhive-pink/50 text-gray-400 hover:text-white rounded">
                        ✕
                    </button>
                </div>

                {/* Mode Tabs */}
                <div className="grid grid-cols-3 gap-1.5 bg-gray-900/40 p-1 border border-gray-850 rounded-lg">
                    {[
                        { id: 'upload', label: 'Local Upload' },
                        { id: 'drive', label: 'Google Drive' },
                        { id: 'photos', label: 'Google Photos' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => { setSelectedTab(tab.id as any); setSelectedMockImg(null); }}
                            className={cn(
                                "py-1.5 text-[9px] font-extrabold uppercase tracking-wider transition-all rounded",
                                selectedTab === tab.id
                                    ? "bg-rhive-pink/20 border border-rhive-pink/40 text-white font-black"
                                    : "text-gray-400 hover:text-white"
                            )}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Panels */}
                <div className="min-h-[160px] flex flex-col justify-center">
                    {selectedTab === 'upload' && (
                        <div className="flex flex-col items-center gap-3">
                            <div className="border border-dashed border-gray-800 hover:border-rhive-pink/50 transition-colors w-full p-6 text-center cursor-pointer relative group flex flex-col items-center justify-center rounded-lg bg-black/40">
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    onChange={handleFileChange} 
                                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" 
                                />
                                <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">📁</span>
                                <span className="text-xs font-bold text-gray-300 group-hover:text-white">Choose a local file...</span>
                                <span className="text-[9px] text-gray-500 uppercase font-mono mt-1">PNG, JPG or WebP</span>
                            </div>
                            {uploadError && <p className="text-[10px] text-red-500 font-bold uppercase">{uploadError}</p>}
                        </div>
                    )}

                    {(selectedTab === 'drive' || selectedTab === 'photos') && (
                        <div className="space-y-3">
                            <p className="text-[10px] text-gray-500 uppercase font-black tracking-wider mb-1.5 flex items-center gap-1.5">
                                <span>🌐</span>
                                <span>Connected to G-Suite: Select image file</span>
                            </p>
                            <div className="grid grid-cols-3 gap-2">
                                {filesToDisplay.map(file => (
                                    <div 
                                        key={file.id}
                                        onClick={() => setSelectedMockImg(file.url)}
                                        className={cn(
                                            "border p-1 bg-black hover:border-rhive-pink cursor-pointer transition-all flex flex-col items-center gap-1.5 rounded-lg group relative",
                                            selectedMockImg === file.url ? "border-rhive-pink shadow-[0_0_10px_rgba(236,2,139,0.3)] bg-rhive-pink/10" : "border-gray-800"
                                        )}
                                    >
                                        <img src={file.url} alt={file.name} className="w-16 h-16 object-cover rounded" />
                                        <span className="text-[8px] text-gray-400 font-mono tracking-tighter truncate w-full text-center group-hover:text-white">{file.name}</span>
                                        {selectedMockImg === file.url && (
                                            <div className="absolute top-1 right-1 bg-green-500 text-white w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-black">✓</div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Bottom Actions */}
                <div className="flex gap-2 border-t border-gray-900 pt-4 mt-2">
                    <Button variant="secondary" className="w-1/2" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button 
                        className="w-1/2 bg-rhive-pink text-white" 
                        disabled={selectedTab !== 'upload' && !selectedMockImg}
                        onClick={() => {
                            if (selectedMockImg) {
                                onSelectAvatar(selectedMockImg);
                            }
                            onClose();
                        }}
                    >
                        Sync Avatar
                    </Button>
                </div>
            </div>
        </div>
    );
};

// Compact Session Widget transformed into clocks logger
const SessionWidget = () => {
    const { currentUser } = useMockDB();
    const { setActivePageId } = useNavigation();

    // Clocking states
    const [clockStatus, setClockStatus] = useState<'in' | 'break' | 'out'>(() => {
        return (localStorage.getItem('rhive_clock_status') as any) || 'in';
    });
    const [elapsedTime, setElapsedTime] = useState(() => {
        const stored = localStorage.getItem('rhive_clock_elapsed') || '0';
        return parseInt(stored, 10);
    });
    const [shiftNotes, setShiftNotes] = useState(() => {
        return localStorage.getItem('rhive_clock_notes') || '';
    });

    const [isClockExpanded, setIsClockExpanded] = useState(false);
    const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

    // Live Local Time Clock
    const [localTime, setLocalTime] = useState(() => new Date().toLocaleTimeString());
    useEffect(() => {
        const timer = setInterval(() => {
            setLocalTime(new Date().toLocaleTimeString());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Avatar state
    const [avatarUrl, setAvatarUrl] = useState(() => {
        const stored = localStorage.getItem(`avatar_${currentUser?.id}`);
        return stored || currentUser?.avatarUrl || "https://i.pravatar.cc/150?u=employee";
    });

    // Live Shift Timer Effect
    useEffect(() => {
        let interval: any = null;
        if (clockStatus === 'in') {
            interval = setInterval(() => {
                setElapsedTime(prev => {
                    const next = prev + 1;
                    localStorage.setItem('rhive_clock_elapsed', String(next));
                    return next;
                });
            }, 1000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [clockStatus]);

    const handleStatusChange = (status: 'in' | 'break' | 'out') => {
        setClockStatus(status);
        localStorage.setItem('rhive_clock_status', status);
        if (status === 'out') {
            setElapsedTime(0);
            localStorage.setItem('rhive_clock_elapsed', '0');
        }
    };

    const formatTime = (totalSec: number) => {
        const hrs = Math.floor(totalSec / 3600);
        const mins = Math.floor((totalSec % 3600) / 60);
        const secs = totalSec % 60;
        return [
            hrs.toString().padStart(2, '0'),
            mins.toString().padStart(2, '0'),
            secs.toString().padStart(2, '0')
        ].join(':');
    };

    return (
        <div 
            className="bg-gray-900/60 border border-gray-700/50 p-5 flex flex-col gap-4 backdrop-blur-sm mb-6 shadow-lg relative overflow-hidden"
            style={{ clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)' }}
        >
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-rhive-pink/40 to-transparent"></div>
            
            {/* User Session Row */}
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <div 
                        className="relative group cursor-pointer" 
                        onClick={() => setIsAvatarModalOpen(true)} 
                        title="Click to open premium avatar upload/sync settings"
                    >
                        <img 
                            src={avatarUrl} 
                            alt="User" 
                            className="w-12 h-12 rounded-full border-2 border-[#ec028b] hover:brightness-110 transition-all shadow-[0_0_8px_rgba(236,2,139,0.3)] object-cover" 
                        />
                        <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center text-[8px] font-black uppercase text-white opacity-0 group-hover:opacity-100 transition-opacity">EDIT</div>
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border border-black rounded-full shadow-sm"></div>
                    </div>
                    <div className="ml-4 text-left">
                        <h3 
                            className="text-white font-bold cursor-pointer hover:text-rhive-pink transition-colors text-sm uppercase tracking-wider"
                            onClick={() => setActivePageId('E-03')}
                            title="Go to my profile"
                        >
                            {currentUser?.name}
                        </h3>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">{currentUser?.role}</p>
                    </div>
                </div>

                <div 
                    className="text-right cursor-pointer hover:text-[#ec028b] transition-colors group/time"
                    onClick={() => setIsClockExpanded(!isClockExpanded)}
                    title="Click to expand/toggle Time Clock controls"
                >
                    <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest block group-hover/time:text-[#ec028b]/80">LOCAL TIME</span>
                    <span className="font-mono text-white text-xs font-black mt-1 block flex items-center justify-end gap-1.5">
                        <span>⏰</span>
                        <span>{localTime}</span>
                    </span>
                </div>
            </div>

            {/* Collapsible Shift Controls */}
            {isClockExpanded && (
                <div className="flex flex-col gap-3 border-t border-gray-800/80 pt-3 animate-fade-in text-left">
                    <div className="flex justify-between items-center">
                        <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">SHIFT DURATION</span>
                        <span className="font-mono text-white text-xs font-black bg-black/50 border border-gray-850 px-2 py-0.5 rounded">{formatTime(elapsedTime)}</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                        {[
                            { id: 'in', label: 'Duty Active', color: 'bg-green-500/10 border-green-500/30 text-green-400' },
                            { id: 'break', label: 'On Break', color: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400' },
                            { id: 'out', label: 'Off Duty', color: 'bg-red-500/10 border-red-500/30 text-red-400' }
                        ].map(opt => (
                            <button
                                key={opt.id}
                                onClick={() => handleStatusChange(opt.id as any)}
                                className={cn(
                                    "py-1.5 border text-[9px] font-extrabold uppercase tracking-widest transition-all rounded",
                                    clockStatus === opt.id 
                                        ? opt.color + " shadow-[0_0_8px_rgba(236,2,139,0.15)] font-black"
                                        : "bg-black/30 border-gray-800 text-gray-500 hover:text-white hover:border-gray-700"
                                )}
                                style={{ clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)' }}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>

                    {/* Shift Logger Notes */}
                    <div className="flex flex-col gap-1.5 mt-1">
                        <label className="text-[8px] font-black text-gray-500 uppercase tracking-widest block">SHIFT LOG / NOTES</label>
                        <textarea
                            value={shiftNotes}
                            onChange={(e) => {
                                setShiftNotes(e.target.value);
                                localStorage.setItem('rhive_clock_notes', e.target.value);
                            }}
                            placeholder="Enter shift activity logs, dispatch details, or site notes..."
                            className="w-full bg-black border border-gray-800 focus:border-[#ec028b] px-3 py-2 outline-none text-xs text-white resize-none h-16 transition-colors"
                            style={{ clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)' }}
                        />
                        <div className="flex justify-between items-center text-[8px] font-mono text-gray-500 mt-1">
                            <span>LOGGER STATE:</span>
                            <span className="text-green-500 font-bold uppercase">{clockStatus === 'in' ? 'ACTIVE RECORDING' : clockStatus === 'break' ? 'PAUSED' : 'OFF DUTY'}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Avatar Upload Modal */}
            <AvatarUploadModal 
                isOpen={isAvatarModalOpen}
                onClose={() => setIsAvatarModalOpen(false)}
                onSelectAvatar={(url) => {
                    setAvatarUrl(url);
                    if (currentUser) currentUser.avatarUrl = url;
                    localStorage.setItem(`avatar_${currentUser?.id}`, url);
                }}
                currentAvatar={avatarUrl}
            />
        </div>
    );
};

// KPI Stat Card Component
const StatCard = ({ label, value, icon: Icon, trend, loading }: { label: string, value: string, icon: any, trend?: string, loading?: boolean }) => (
    <div 
        className="bg-gray-900/60 border border-gray-700/50 p-4 flex items-center justify-between backdrop-blur-sm hover:border-[#ec028b]/50 transition-all duration-300 group shadow-lg"
        style={{ clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)' }}
    >
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
        <div 
            className="h-12 w-12 bg-black/40 border border-gray-700 flex items-center justify-center text-gray-500 group-hover:text-[#ec028b] group-hover:border-[#ec028b]/30 transition-all"
            style={{ clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)' }}
        >
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
                ? 'p-4 flex items-center justify-between backdrop-blur-sm shadow-[0_0_20px_rgba(249,115,22,0.15)]'
                : 'p-4 flex items-center justify-between backdrop-blur-sm'
            }
            style={{
                background: hasStorm
                    ? 'rgba(18,8,2,0.85)'
                    : 'rgba(255,255,255,0.03)',
                border: hasStorm
                    ? '1px solid rgba(251,146,60,0.5)'
                    : '1px solid rgba(255,255,255,0.08)',
                transition: 'all 0.4s ease',
                clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)'
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
    const { 
        setActivePageId, 
        setSelectedContactId, 
        setSelectedAccountId, 
        setSelectedPropertyId, 
        setSelectedProjectId 
    } = useNavigation();
    const { currentUser, users, projects, setCurrentProjectId, properties } = useMockDB();

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
        const unsubscribe = projectService.subscribeToRecentActivity((firebaseProjects: any[]) => {
            const activeProjects = (firebaseProjects && firebaseProjects.length > 0) ? firebaseProjects : projects;
            
            // Map project activities
            const projectActivities = activeProjects.map((p: any, idx: number) => {
                const owner = users.find(u => u.id === (p.account_id || p.owner_id));
                const timestamp = new Date(p.updated_at || p.created_at || p.last_updated || Date.now()).getTime();
                const mockNames = ['Rick Vance', 'Jenny Miller', 'Robert Chen', 'Thomas Henderson', 'Arthur Pendleton'];
                return {
                    user: p.customer_name || p.contact_name || owner?.name || mockNames[idx % mockNames.length],
                    action: 'submitted project',
                    target: p.name || 'Unnamed Project',
                    timestamp,
                    time: timeAgo(p.updated_at || p.created_at || p.last_updated),
                };
            });

            // Map property registration activities
            const propertyActivities = properties.map((prop: any) => {
                const idParts = prop._id.split('-');
                const tsStr = idParts[1];
                let timestamp = 0;
                if (tsStr && /^\d{10,}$/.test(tsStr)) {
                    timestamp = parseInt(tsStr, 10);
                } else {
                    if (prop._id === 'PROP-1') timestamp = Date.now() - 3600000 * 2;
                    else if (prop._id === 'PROP-2') timestamp = Date.now() - 3600000 * 5;
                    else if (prop._id === 'PROP-3') timestamp = Date.now() - 3600000 * 12;
                    else timestamp = Date.now() - 3600000 * 24;
                }
                const owner = users.find(u => u.id === prop.owner_id);
                return {
                    user: owner?.name || 'System Operator',
                    action: 'registered property',
                    target: prop.address_full || 'Unnamed Property',
                    timestamp,
                    time: timeAgo(new Date(timestamp).toISOString()),
                };
            });

            // Merge, sort desc by timestamp, and take top 5
            const combined = [...projectActivities, ...propertyActivities]
                .sort((a, b) => b.timestamp - a.timestamp)
                .slice(0, 5);

            setActivity(combined);
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
    }, [projects, properties, users, setActivePageId, setSelectedContactId, setSelectedAccountId, setSelectedPropertyId, setSelectedProjectId, setCurrentProjectId]);

    const schedule = [
        { time: '09:00 AM', event: 'Team Standup', type: 'Meeting' },
        { time: '11:30 AM', event: 'Site Visit - Thompson', type: 'Site' },
        { time: '02:00 PM', event: 'Vendor Call - ABC Supply', type: 'Call' },
    ];

    return (
        <PageContainer
            title={page?.name || 'Employee Homepage'}
            description="Welcome back. Here is your daily command center."
            headerAction={<NotificationBell />}
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
                                onClick={() => window.dispatchEvent(new CustomEvent('open-customer-lookup'))}
                            >
                                <UserIcon className="w-6 h-6 mb-2 text-[#ec028b]" />
                                <span className="text-xs uppercase font-bold tracking-wide">New Project</span>
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
                                                    <span 
                                                        className="font-semibold text-white hover:text-rhive-pink cursor-pointer hover:underline transition-colors"
                                                        onClick={() => {
                                                            const foundUser = users.find(u => u.name.toLowerCase() === item.user.toLowerCase());
                                                            if (foundUser) {
                                                                const isCommercial = foundUser.name.includes('HOA') || 
                                                                                     foundUser.name.includes('Group') || 
                                                                                     foundUser.name.includes('Corp') || 
                                                                                     foundUser.name.includes('Supply') || 
                                                                                     foundUser.name.includes('Summit') || 
                                                                                     foundUser.name.includes('Apex') || 
                                                                                     foundUser.name.includes('Vanguard') || 
                                                                                     foundUser.name.includes('BuildWest');
                                                                if (isCommercial) {
                                                                    setSelectedAccountId(foundUser.id);
                                                                    setActivePageId('E-08');
                                                                } else {
                                                                    setSelectedContactId(foundUser.id);
                                                                    setActivePageId('E-10');
                                                                }
                                                            } else {
                                                                setActivePageId('E-24');
                                                            }
                                                        }}
                                                        title="View user profile"
                                                    >
                                                        {item.user}
                                                    </span> {item.action}{' '}
                                                    <span 
                                                        className="text-[#ec028b] font-medium hover:underline cursor-pointer"
                                                        onClick={() => {
                                                            const foundProject = projects.find(p => p.name.toLowerCase() === item.target.toLowerCase());
                                                            const foundProperty = properties.find(p => p.address_full.toLowerCase() === item.target.toLowerCase());
                                                            if (foundProject) {
                                                                setCurrentProjectId(foundProject._id);
                                                                if (foundProject.current_stage === 'Quote') {
                                                                    setActivePageId('E-28');
                                                                } else if (foundProject.current_stage === 'Estimate') {
                                                                    setActivePageId('E-27');
                                                                } else {
                                                                    setActivePageId('E-15');
                                                                }
                                                            } else if (foundProperty) {
                                                                setSelectedPropertyId(foundProperty._id);
                                                                setActivePageId('E-12');
                                                            } else {
                                                                setActivePageId('E-05');
                                                            }
                                                        }}
                                                    >
                                                        {item.target}
                                                    </span>.
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
                </div>
            </div>
        </PageContainer>
    );
};

export default EmployeeHomepage;
