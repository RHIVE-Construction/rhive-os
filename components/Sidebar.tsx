import React from 'react';
import { useMockDB } from '../contexts/MockDatabaseContext';
import { useNavigation } from '../contexts/NavigationContext';
import { useTheme } from '../contexts/ThemeContext';
import { PAGE_GROUPS } from '../constants';
import { PageGroup, Page } from '../types';
import { 
    RhiveLogo, 
    HomeIcon, 
    ChartBarIcon, 
    UserIcon, 
    CalendarDaysIcon, 
    MagnifyingGlassIcon, 
    CalculatorIcon, 
    PriceTagIcon, 
    DocumentTextIcon, 
    ListBulletIcon,
    BuildingStorefrontIcon,
    MapPinIcon,
    BriefcaseIcon,
    TruckIcon,
    WrenchIcon,
    BoltIcon,
    CurrencyDollarIcon,
    ShieldCheckIcon,
    SearchIcon,
    ClockIcon,
    KeyIcon,
    ChevronDownIcon,
    ChevronRightIcon,
    Squares2x2Icon,
    IdentificationIcon,
    ChartPieIcon,
    SparklesIcon
} from './icons';
import { cn } from '../lib/utils';
import { getWeatherData } from '../lib/weather';

// Helper to get icon by page ID
const getIconForPage = (id: string) => {
    // PUBLIC
    if (id === 'P-01') return <UserIcon className="h-5 w-5" />;
    if (id === 'P-02') return <BuildingStorefrontIcon className="h-5 w-5" />;
    if (id === 'P-03') return <ListBulletIcon className="h-5 w-5" />;
    if (id === 'P-04') return <CurrencyDollarIcon className="h-5 w-5" />;
    if (id === 'P-05') return <MapPinIcon className="h-5 w-5" />;
    if (id === 'P-07') return <KeyIcon className="h-5 w-5" />;
    if (id === 'P-09') return <IdentificationIcon className="h-5 w-5" />;
    if (id === 'P-10' || id === 'P-11') return <DocumentTextIcon className="h-5 w-5" />;
    if (id === 'P-12') return <CalculatorIcon className="h-5 w-5" />;
    if (id === 'P-Landing') return <SparklesIcon className="h-5 w-5" />;
    if (id === 'P-00') return <SparklesIcon className="h-5 w-5" />;
    if (id === 'P-00-V2') return <SparklesIcon className="h-5 w-5" />;
    if (id === 'P-00a') return <BoltIcon className="h-5 w-5" />;

    // ADMIN (A-Series)
    if (id === 'A-01') return <HomeIcon className="h-5 w-5" />;
    if (id === 'A-02') return <UserIcon className="h-5 w-5" />;
    if (id === 'A-03') return <CurrencyDollarIcon className="h-5 w-5" />;
    if (id === 'A-04') return <BoltIcon className="h-5 w-5" />;
    if (id === 'A-05') return <ListBulletIcon className="h-5 w-5" />;
    if (id.startsWith('A-')) return <ShieldCheckIcon className="h-5 w-5" />;
    
    // SUPER ADMIN (SA-Series)
    if (id === 'SA-01') return <ShieldCheckIcon className="h-5 w-5" />;
    if (id === 'SA-02') return <BoltIcon className="h-5 w-5" />;

    // EMPLOYEE (E-Series)
    if (id === 'E-01') return <HomeIcon className="h-5 w-5" />;
    if (id === 'E-02a') return <BriefcaseIcon className="h-5 w-5" />;
    if (id === 'E-03') return <BoltIcon className="h-5 w-5" />;
    if (id === 'E-04') return <CalendarDaysIcon className="h-5 w-5" />;
    if (id === 'E-05') return <ChartBarIcon className="h-5 w-5" />;
    if (id === 'E-06') return <MapPinIcon className="h-5 w-5" />;
    if (id === 'E-15') return <BriefcaseIcon className="h-5 w-5" />;
    if (id === 'E-16') return <CurrencyDollarIcon className="h-5 w-5" />;
    if (id === 'E-17') return <ChartBarIcon className="h-5 w-5" />;
    if (id === 'E-18') return <ChartPieIcon className="h-5 w-5" />;
    if (id === 'E-19') return <ListBulletIcon className="h-5 w-5" />;
    if (id === 'E-23') return <PriceTagIcon className="h-5 w-5" />;
    if (id === 'E-25' || id === 'E-24') return <BuildingStorefrontIcon className="h-5 w-5" />;
    if (id === 'E-27') return <CalculatorIcon className="h-5 w-5" />;
    if (id === 'E-38') return <BoltIcon className="h-5 w-5" />;
    if (id === 'E-39') return <SparklesIcon className="h-5 w-5" />;
    if (id === 'E-29') return <ShieldCheckIcon className="h-5 w-5" />;
    if (id === 'E-32') return <WrenchIcon className="h-5 w-5" />;
    if (id === 'E-34') return <CurrencyDollarIcon className="h-5 w-5" />;
    if (id === 'E-08') return <UserIcon className="h-5 w-5" />;
    if (id === 'E-10') return <UserIcon className="h-5 w-5" />;
    if (id === 'E-12') return <MapPinIcon className="h-5 w-5" />;
    if (id === 'E-14') return <Squares2x2Icon className="h-5 w-5" />;
    if (id === 'E-21') return <IdentificationIcon className="h-5 w-5" />;
    if (id === 'E-22') return <ClockIcon className="h-5 w-5" />;
    
    // CUSTOMER
    if (id === 'C-01') return <HomeIcon className="h-5 w-5" />;
    if (id === 'C-02') return <ListBulletIcon className="h-5 w-5" />;
    if (id === 'C-03') return <BriefcaseIcon className="h-5 w-5" />;
    if (id.startsWith('C-')) return <UserIcon className="h-5 w-5" />;

    // CONTRACTOR
    if (id === 'CO-01') return <HomeIcon className="h-5 w-5" />;
    if (id === 'CO-06') return <ListBulletIcon className="h-5 w-5" />;
    if (id === 'CO-08') return <MapPinIcon className="h-5 w-5" />;
    if (id.startsWith('CO-')) return <BuildingStorefrontIcon className="h-5 w-5" />;

    // SUPPLIER
    if (id === 'S-04') return <UserIcon className="h-5 w-5" />;
    if (id.startsWith('S-')) return <TruckIcon className="h-5 w-5" />;

    return <BriefcaseIcon className="h-5 w-5" />;
};

interface SidebarProps {
    pageGroups?: PageGroup[];
}

const ROLE_HIERARCHY: Record<string, string[]> = {
    'Super Admin': ['Super Admin', 'Admin', 'Employee'],
    'Admin': ['Admin', 'Employee'],
    'Employee': ['Employee'],
    'Customer': ['Customer'],
    'Contractor': ['Contractor'],
    'Supplier': ['Supplier'],
    'Public': ['Public']
};

const BUCKET_ITEMS = {
    contacts: [
        { id: 'contact-1', name: 'Rick Vance', pageId: 'E-03' },
        { id: 'contact-2', name: 'Jenny Miller', pageId: 'E-03' },
        { id: 'contact-3', name: 'Robert Chen', pageId: 'E-03' }
    ],
    properties: [
        { id: 'prop-1', name: '1927 Thompson', pageId: 'E-15' },
        { id: 'prop-2', name: 'Valley View Complex', pageId: 'E-15' },
        { id: 'prop-3', name: 'Summit Ridge', pageId: 'E-15' }
    ],
    company: [
        { id: 'comp-1', name: 'RHIVE Main Office', pageId: 'E-24' },
        { id: 'comp-2', name: 'Warehouse West', pageId: 'E-24' }
    ],
    quotes: [
        { id: 'quote-1', name: 'Q-9402 Gutter Spec', pageId: 'E-16' },
        { id: 'quote-2', name: 'Q-9381 Shingle Flex', pageId: 'E-16' }
    ],
    buildings: [
        { id: 'build-1', name: 'Building A (Thompson)', pageId: 'E-15' },
        { id: 'build-2', name: 'Summit Hall', pageId: 'E-15' }
    ]
};

const SidebarWeather: React.FC<{ isMinimized: boolean }> = ({ isMinimized }) => {
    const [city, setCity] = React.useState(() => localStorage.getItem('rhive_weather_city') || 'Salt Lake City, UT');

    React.useEffect(() => {
        const handleUpdate = (e: any) => {
            if (e.detail?.city) {
                setCity(e.detail.city);
            }
        };
        window.addEventListener('weather-update', handleUpdate);
        return () => window.removeEventListener('weather-update', handleUpdate);
    }, []);

    const weather = getWeatherData(city);

    return (
        <div 
            onClick={() => window.dispatchEvent(new CustomEvent('open-weather-forecast'))}
            className={cn(
                "cursor-pointer transition-all flex items-center justify-between group",
                isMinimized 
                    ? "mx-2 p-2 bg-black/40 border border-gray-850 hover:border-rhive-pink/40 hover:shadow-[0_0_8px_rgba(236,2,139,0.2)] rounded-lg flex-col gap-1.5"
                    : "mx-4 mb-4 p-3 bg-black/40 border border-gray-800 hover:border-rhive-pink/40 hover:shadow-[0_0_12px_rgba(236,2,139,0.15)] rounded-lg"
            )}
            style={{ clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)' }}
        >
            {isMinimized ? (
                <>
                    <span className="text-lg">
                        {weather.condition === 'Storm Alert' ? '🌨️' : weather.condition === 'Sunny' ? '🌤️' : '☁️'}
                    </span>
                    <span className="text-[10px] font-black text-white font-mono">{weather.temp.split('°')[0]}°</span>
                </>
            ) : (
                <>
                    <div className="flex items-center gap-2.5 overflow-hidden">
                        <span className="text-xl group-hover:scale-110 transition-transform">
                            {weather.condition === 'Storm Alert' ? '🌨️' : weather.condition === 'Sunny' ? '🌤️' : '☁️'}
                        </span>
                        <div className="overflow-hidden">
                            <p className="text-[10px] font-black text-white uppercase tracking-wider truncate">{weather.city}</p>
                            <p className="text-[8px] text-rhive-pink font-bold uppercase tracking-wider truncate">{weather.condition}</p>
                        </div>
                    </div>
                    <span className="text-sm font-black text-white font-mono">{weather.temp}</span>
                </>
            )}
        </div>
    );
};

export const Sidebar: React.FC<SidebarProps> = ({ pageGroups }) => {
    const { currentUser } = useMockDB();
    const { activePageId, navigateToPage } = useNavigation();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    // Minimized/collapsed sidebar state
    const [isMinimized, setIsMinimized] = React.useState(() => {
        return localStorage.getItem('rhive_sidebar_minimized') === 'true';
    });

    const [activeBucket, setActiveBucket] = React.useState<string | null>(null);

    const toggleMinimized = () => {
        const nextState = !isMinimized;
        setIsMinimized(nextState);
        localStorage.setItem('rhive_sidebar_minimized', String(nextState));
    };

    // State to track expanded categories
    const [expandedCategories, setExpandedCategories] = React.useState<Record<string, boolean>>({
        'Stages': true
    });

    React.useEffect(() => {
        if (!currentUser) return;
        const sourceGroups = pageGroups || PAGE_GROUPS;
        const allowedTypes = ROLE_HIERARCHY[currentUser.role] || [currentUser.role];
        const userGroups = sourceGroups.filter(group => 
            group.userType === 'All' || allowedTypes.includes(group.userType)
        );

        userGroups.forEach(group => {
            group.pages.forEach(page => {
                if (page.id === activePageId && page.category) {
                    setExpandedCategories(prev => ({ ...prev, [page.category!]: true }));
                }
            });
        });
    }, [activePageId, currentUser, pageGroups]);

    if (!currentUser) return null;

    const toggleCategory = (cat: string) => {
        setExpandedCategories(prev => ({ ...prev, [cat]: !prev[cat] }));
    };

    const sourceGroups = pageGroups || PAGE_GROUPS;
    const allowedTypes = ROLE_HIERARCHY[currentUser.role] || [currentUser.role];
    const userGroups = sourceGroups.filter(group => 
        group.userType === 'All' || allowedTypes.includes(group.userType)
    ).map(group => ({
        ...group,
        pages: group.pages.filter(page => page.id !== 'E-03')
    }));

    return (
        <aside 
            className={cn(
                "border-r backdrop-blur-md flex flex-col flex-shrink-0 h-full relative z-50 transition-all duration-300 select-none",
                isMinimized ? "w-16" : "w-64",
                isDark ? "bg-black/80 border-white/5" : "bg-white/80 border-black/5"
            )}
        >
            {/* Header / Brand Logo & Toggle */}
            <div className={cn("p-4 border-b flex items-center justify-between transition-colors duration-500", isDark ? "border-white/5" : "border-black/5")}>
                {!isMinimized && <RhiveLogo className={cn("h-6 transition-colors duration-500", isDark ? "text-white" : "text-black")} />}
                {isMinimized && (
                    <div className="w-8 h-8 rounded bg-rhive-pink/10 border border-rhive-pink/20 flex items-center justify-center font-bold text-[#ec028b] text-xs">
                        R
                    </div>
                )}
                <button 
                    onClick={toggleMinimized}
                    className="p-1 rounded bg-black border border-gray-800 hover:border-[#ec028b] text-gray-500 hover:text-white transition-all outline-none"
                    title={isMinimized ? "Expand Sidebar" : "Minimize Sidebar"}
                >
                    <span className="text-[10px] block px-1 font-bold">
                        {isMinimized ? '▶' : '◀'}
                    </span>
                </button>
            </div>

            {/* Navigation Body */}
            <div className="flex-1 overflow-y-auto py-4 scrollbar-hide">
                {userGroups.map((group, groupIdx) => {
                    const pagesByCategory = group.pages.reduce((acc: Record<string, Page[]>, page) => {
                        const cat = page.category || 'none';
                        if (!acc[cat]) acc[cat] = [];
                        acc[cat].push(page);
                        return acc;
                    }, {} as Record<string, Page[]>);

                    return (
                        <div key={groupIdx} className="mb-6 px-3">
                            {group.label && !isMinimized && (
                                <div className="px-3 mb-2">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">
                                        {group.label}
                                    </span>
                                </div>
                            )}

                            <div className="space-y-1">
                                {(Object.entries(pagesByCategory) as [string, Page[]][]).map(([cat, pages]) => {
                                    if (cat === 'none') {
                                        return pages.map(page => (
                                            <button
                                                key={page.id}
                                                onClick={() => {
                                                    if (page.id === 'E-02a') {
                                                        window.dispatchEvent(new CustomEvent('open-customer-lookup'));
                                                    } else {
                                                        navigateToPage(page.id);
                                                    }
                                                }}
                                                data-active={activePageId === page.id}
                                                className={cn(
                                                    "flex items-center w-full rounded-full text-sm font-medium transition-all duration-200",
                                                    isMinimized ? "justify-center p-2.5" : "px-4 py-2",
                                                    activePageId === page.id
                                                        ? "bg-[#ec028b]/20 text-[#ec028b] border border-[#ec028b]/30"
                                                        : "text-gray-400 hover:bg-gray-800 hover:text-white"
                                                )}
                                                title={isMinimized ? page.name : undefined}
                                            >
                                                <span className={cn("opacity-80", isMinimized ? "" : "mr-3")}>
                                                    {getIconForPage(page.id)}
                                                </span>
                                                {!isMinimized && <span className="truncate">{page.name}</span>}
                                            </button>
                                        ));
                                    }

                                    // Collapsible group categories
                                    const isExpanded = expandedCategories[cat];
                                    const isAnyActive = pages.some(p => p.id === activePageId);

                                    return (
                                        <div key={cat} className="space-y-1 mt-1">
                                            {isMinimized ? (
                                                pages.map(page => (
                                                    <button
                                                        key={page.id}
                                                        onClick={() => navigateToPage(page.id)}
                                                        className={cn(
                                                            "flex items-center justify-center w-full p-2.5 rounded-full transition-all",
                                                            activePageId === page.id
                                                                ? "bg-[#ec028b]/20 text-[#ec028b] border border-[#ec028b]/30"
                                                                : "text-gray-400 hover:bg-gray-800 hover:text-white"
                                                        )}
                                                        title={page.name}
                                                    >
                                                        {getIconForPage(page.id)}
                                                    </button>
                                                ))
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={() => toggleCategory(cat)}
                                                        className={cn(
                                                            "flex items-center justify-between w-full px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all",
                                                            isAnyActive ? "text-white" : "text-gray-500 hover:text-gray-300"
                                                        )}
                                                    >
                                                        <div className="flex items-center">
                                                            {cat === 'Website' ? (
                                                                <SparklesIcon className="h-4 w-4 mr-3 text-rhive-pink drop-shadow-[0_0_3px_rgba(236,2,139,0.4)] animate-pulse" />
                                                            ) : (
                                                                <BriefcaseIcon className="h-4 w-4 mr-3 opacity-50" />
                                                            )}
                                                            <span>{cat}</span>
                                                        </div>
                                                        <ChevronRightIcon className={cn(
                                                            "h-3 w-3 transition-transform duration-300",
                                                            isExpanded ? "rotate-90" : "rotate-0"
                                                        )} />
                                                    </button>
                                                    
                                                    {isExpanded && (
                                                        <div className="ml-4 pl-2 border-l border-gray-800 space-y-1 mt-1">
                                                            {pages.map(page => (
                                                                <button
                                                                    key={page.id}
                                                                    onClick={() => navigateToPage(page.id)}
                                                                    data-active={activePageId === page.id}
                                                                    className={cn(
                                                                        "flex items-center w-full px-4 py-1.5 rounded-full text-[13px] font-medium transition-all",
                                                                        activePageId === page.id
                                                                            ? "text-[#ec028b]"
                                                                            : "text-gray-500 hover:text-gray-200"
                                                                    )}
                                                                >
                                                                    <span className="truncate">{page.name}</span>
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}

                {/* --- File Buckets Section (Expanded or Minimized Icons) --- */}
                {!isMinimized ? (
                    <div className="mb-6 px-3 border-t border-gray-900 pt-4">
                        <div className="px-3 mb-3">
                            <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">File Vaults</span>
                        </div>
                        <div className="space-y-1.5">
                            {Object.entries(BUCKET_ITEMS).map(([key, items]) => {
                                const isOpen = activeBucket === key;
                                const Icon = key === 'contacts' ? UserIcon :
                                             key === 'properties' ? MapPinIcon :
                                             key === 'company' ? BuildingStorefrontIcon :
                                             key === 'quotes' ? DocumentTextIcon : BriefcaseIcon;
                                return (
                                    <div key={key} className="space-y-1">
                                        <button
                                            onClick={() => setActiveBucket(isOpen ? null : key)}
                                            className="flex items-center justify-between w-full px-3 py-2 bg-gray-900/30 border border-gray-850 hover:border-gray-700 rounded-lg text-xs font-bold text-gray-400 hover:text-white transition-all"
                                        >
                                            <div className="flex items-center gap-2.5">
                                                <Icon className="h-4 w-4 opacity-70 text-[#ec028b]" />
                                                <span className="capitalize">{key}</span>
                                            </div>
                                            <span className="text-[10px] text-gray-500 font-mono">
                                                {isOpen ? '▼' : '▶'}
                                            </span>
                                        </button>
                                        {isOpen && (
                                            <div className="pl-4 ml-2 border-l border-gray-800 space-y-1 mt-1 animate-fade-in">
                                                {items.map(item => (
                                                    <button
                                                        key={item.id}
                                                        onClick={() => navigateToPage(item.pageId)}
                                                        className="flex items-center w-full px-3 py-1.5 rounded-lg text-[11px] font-medium text-gray-500 hover:text-gray-200 text-left truncate"
                                                    >
                                                        {item.name}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-2.5 py-4 border-t border-gray-900 mt-4">
                        <span className="text-[8px] text-gray-600 font-black uppercase tracking-wider mb-1">VAULT</span>
                        {Object.entries(BUCKET_ITEMS).map(([key, items]) => {
                            const Icon = key === 'contacts' ? UserIcon :
                                         key === 'properties' ? MapPinIcon :
                                         key === 'company' ? BuildingStorefrontIcon :
                                         key === 'quotes' ? DocumentTextIcon : BriefcaseIcon;
                            return (
                                <button
                                    key={key}
                                    onClick={() => {
                                        setIsMinimized(false);
                                        setActiveBucket(key);
                                    }}
                                    className="p-2 rounded-lg bg-gray-900/30 border border-gray-850 hover:border-[#ec028b] text-gray-500 hover:text-[#ec028b] transition-all"
                                    title={`Open ${key} bucket`}
                                >
                                    <Icon className="h-4 w-4" />
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Permanent compact Dev Navigator trigger at the bottom */}
            <div className="border-t border-gray-900 p-4 flex flex-col items-center justify-center gap-2">
                <button 
                    onClick={() => window.dispatchEvent(new CustomEvent('toggle-dev-navigator'))}
                    className={cn(
                        "text-[9px] font-black tracking-widest text-gray-600 hover:text-rhive-pink hover:shadow-[0_0_8px_rgba(236,2,139,0.2)] transition-all uppercase outline-none focus:outline-none cursor-pointer",
                        isMinimized ? "px-1" : "px-3 py-1 bg-black/40 border border-gray-850 hover:border-rhive-pink/45 rounded-lg"
                    )}
                >
                    {isMinimized ? "[DEV]" : "[DEV NAVIGATOR]"}
                </button>
            </div>
        </aside>
    );
};
