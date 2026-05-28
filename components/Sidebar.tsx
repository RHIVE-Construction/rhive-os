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
    ArrowLeftIcon,
    SparklesIcon
} from './icons';
import { cn } from '../lib/utils';

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
    if (id === 'P-00') return <SparklesIcon className="h-5 w-5" />;
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
    if (id === 'E-02') return <SearchIcon className="h-5 w-5" />;
    if (id === 'E-02a') return <UserIcon className="h-5 w-5" />;
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

export const Sidebar: React.FC<SidebarProps> = ({ pageGroups }) => {
    const { currentUser, logout } = useMockDB();
    const { activePageId, navigateToPage } = useNavigation();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    
    // State to track expanded categories
    const [expandedCategories, setExpandedCategories] = React.useState<Record<string, boolean>>({
        'Stages': true // Keep Stages expanded by default
    });

    if (!currentUser) return null;

    const toggleCategory = (cat: string) => {
        setExpandedCategories(prev => ({ ...prev, [cat]: !prev[cat] }));
    };

    // Hierarchy mapping: Each role can see their own groups plus everything below them
    const roleHierarchy: Record<string, string[]> = {
        'Super Admin': ['Super Admin', 'Admin', 'Employee'],
        'Admin': ['Admin', 'Employee'],
        'Employee': ['Employee'],
        'Customer': ['Customer'],
        'Contractor': ['Contractor'],
        'Supplier': ['Supplier'],
        'Public': ['Public']
    };

    // Filter groups based on user role and hierarchy
    const sourceGroups = pageGroups || PAGE_GROUPS;
    const allowedTypes = roleHierarchy[currentUser.role] || [currentUser.role];
    const userGroups = sourceGroups.filter(group => 
        group.userType === 'All' || allowedTypes.includes(group.userType)
    );

    return (
        <aside className={cn(
            "w-64 border-r backdrop-blur-md flex flex-col flex-shrink-0 h-full relative z-50 transition-colors duration-500",
            isDark ? "bg-black/80 border-white/5" : "bg-white/80 border-black/5"
        )}>
            <div className={cn("p-6 border-b flex items-center justify-center transition-colors duration-500", isDark ? "border-white/5" : "border-black/5")}>
                <RhiveLogo className={cn("h-8 transition-colors duration-500", isDark ? "text-white" : "text-black")} />
            </div>

            <div className="flex-1 overflow-y-auto py-4 scrollbar-hide">
                {userGroups.map((group, groupIdx) => {
                    // Group pages by category
                    const pagesByCategory = group.pages.reduce((acc: Record<string, Page[]>, page) => {
                        const cat = page.category || 'none';
                        if (!acc[cat]) acc[cat] = [];
                        acc[cat].push(page);
                        return acc;
                    }, {} as Record<string, Page[]>);

                    return (
                        <div key={groupIdx} className="mb-8 px-4">
                            {group.label && (
                                <div className="px-4 mb-3">
                                    <span className="text-[10px] bg-gray-900/50 border border-gray-800 px-2 py-1 rounded-full text-gray-500 group-hover:text-[#ec028b] group-hover:border-[#ec028b]/30">
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
                                                onClick={() => navigateToPage(page.id)}

                                                className={cn(
                                                    "flex items-center w-full px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                                                    activePageId === page.id
                                                        ? "bg-[#ec028b]/20 text-[#ec028b] border border-[#ec028b]/30"
                                                        : "text-gray-400 hover:bg-gray-800 hover:text-white"
                                                )}
                                            >
                                                <span className="mr-3 opacity-80">
                                                    {getIconForPage(page.id)}
                                                </span>
                                                <span className="truncate">{page.name}</span>
                                            </button>
                                        ));
                                    }

                                    // Render grouped category (e.g., "Stages")
                                    const isExpanded = expandedCategories[cat];
                                    const isAnyActive = pages.some(p => p.id === activePageId);

                                    return (
                                        <div key={cat} className="space-y-1 mt-2">
                                            <button
                                                onClick={() => toggleCategory(cat)}
                                                className={cn(
                                                    "flex items-center justify-between w-full px-4 py-2 rounded-full text-sm font-bold transition-all",
                                                    isAnyActive ? "text-white" : "text-gray-500 hover:text-gray-300"
                                                )}
                                            >
                                                <div className="flex items-center">
                                                    <BriefcaseIcon className="h-4 w-4 mr-3 opacity-50" />
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
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className={cn("p-4 border-t transition-colors duration-500", isDark ? "border-white/5 bg-black/40" : "border-black/5 bg-white/40")}>
                <div className="flex items-center mb-4 px-2">
                    <div className={cn("w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border transition-colors", isDark ? "bg-gray-800 text-white border-gray-700" : "bg-gray-100 text-black border-gray-200")}>
                        {currentUser.name.charAt(0)}
                    </div>
                    <div className="ml-3 overflow-hidden">
                        <p className={cn("text-sm font-medium truncate transition-colors", isDark ? "text-white" : "text-black")}>{currentUser.name}</p>
                        <p className="text-xs text-[#ec028b] truncate">{currentUser.role}</p>
                    </div>
                </div>
                <button
                    onClick={logout}
                    className="w-full py-2 px-4 bg-gray-900 hover:bg-red-900/20 border border-gray-700 hover:border-red-500/50 rounded-full text-gray-400 hover:text-red-400 text-sm transition-all flex items-center justify-center gap-2"
                >
                    <ArrowLeftIcon className="w-4 h-4" />
                    Sign Out
                </button>
            </div>
        </aside>
    );
};
