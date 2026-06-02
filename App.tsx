
import React, { useEffect } from 'react';
import { PricingProvider } from './contexts/PricingContext';
import { MockDatabaseProvider, useMockDB } from './contexts/MockDatabaseContext';
import { NavigationProvider, useNavigation } from './contexts/NavigationContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { Sidebar } from './components/Sidebar';
import LoginPage from './pages/LoginPage';
import { GlobalHeader } from './components/GlobalHeader';
import RhiveHeader from './components/website/RhiveHeader';
import { pageComponentMap } from './pageRegistry';
import { CircuitryBackground } from './components/CircuitryBackground';
import { FloatingEstimator } from './components/FloatingEstimator';
import HunniChatWidget from './components/website/HunniChatWidget';
import { DevNavigator } from './components/DevNavigator';
import { GlobalCustomerLookupModal } from './components/GlobalCustomerLookupModal';
import { GlobalWeatherModal } from './components/GlobalWeatherModal';
import { cn } from './lib/utils';
import { session } from './lib/session';

const AppContentAuthenticated: React.FC = () => {
    const { activePageId, setActivePageId, showEditorMenu } = useNavigation();
    const { currentUser } = useMockDB();
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const mainRef = React.useRef<HTMLElement>(null);

    // Refresh the 24-hour session window on any user activity
    useEffect(() => {
        const refresh = () => session.refresh();
        window.addEventListener('click',   refresh, { passive: true });
        window.addEventListener('keydown', refresh, { passive: true });
        window.addEventListener('scroll',  refresh, { passive: true });
        return () => {
            window.removeEventListener('click',   refresh);
            window.removeEventListener('keydown', refresh);
            window.removeEventListener('scroll',  refresh);
        };
    }, []);

    useEffect(() => {
        console.log('App: activePageId changed to:', activePageId);
        if (mainRef.current) {
            mainRef.current.scrollTop = 0;
        }
    }, [activePageId]);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const pageCode = params.get('page');
        if (pageCode) {
            // If logged in and trying to go to login page P-06, redirect to dashboard directly
            if (currentUser && pageCode === 'P-06') {
                let target = 'E-01';
                switch (currentUser.role) {
                    case 'Customer': target = 'C-01'; break;
                    case 'Contractor': target = 'CO-01'; break;
                    case 'Supplier': target = 'S-01'; break;
                }
                setActivePageId(target);
                // Clean up query param immediately
                const newParams = new URLSearchParams(window.location.search);
                newParams.delete('page');
                const newSearch = newParams.toString();
                const newUrl = window.location.pathname + (newSearch ? '?' + newSearch : '');
                window.history.replaceState({}, '', newUrl);
                return;
            }

            if (pageCode !== activePageId) {
                setActivePageId(pageCode);
            } else {
                // Only clean up the page query param once activePageId matches it
                const newParams = new URLSearchParams(window.location.search);
                newParams.delete('page');
                const newSearch = newParams.toString();
                const newUrl = window.location.pathname + (newSearch ? '?' + newSearch : '');
                window.history.replaceState({}, '', newUrl);
            }
        }

        const handleCustomNav = (e: any) => {
            if (e.detail) setActivePageId(e.detail);
        };
        window.addEventListener('nav-page', handleCustomNav);
        return () => window.removeEventListener('nav-page', handleCustomNav);
    }, [activePageId, setActivePageId, currentUser]);

    useEffect(() => {
        if (currentUser && (!activePageId || activePageId === 'P-06')) {
            switch (currentUser.role) {
                case 'Super Admin': setActivePageId('SA-01'); break;
                case 'Admin': setActivePageId('E-01'); break; // Unified entry point
                case 'Employee': setActivePageId('E-01'); break;
                case 'Customer': setActivePageId('C-01'); break;
                case 'Contractor': setActivePageId('CO-01'); break;
                case 'Supplier': setActivePageId('S-01'); break;
                case 'Admin': setActivePageId('E-01'); break;
                case 'Super Admin': setActivePageId('E-01'); break;
                default: setActivePageId('P-00'); break;
            }
        }
    }, [currentUser, setActivePageId, activePageId]);

    const CurrentPage = pageComponentMap[activePageId] || (() => <div className="p-10 text-gray-400">Select a page from the menu.</div>);

    const isPublicRoute = (activePageId || '').startsWith('P-');

    return (
        <div className={cn(
            "fixed inset-0 w-screen h-screen overflow-hidden font-sans transition-colors duration-500",
            isDark ? "bg-black text-white" : "bg-[#F8F9FA] text-black"
        )}>
            <CircuitryBackground
                backgroundColor={isDark ? "#000000" : "#F8F9FA"}
                dotColor={isDark ? "#ec028b" : "#ec028b"}
                lineColor={isDark ? "236, 2, 139" : "236, 2, 139"}
            />
            {showEditorMenu && <GlobalHeader />}

            <div className={cn(
                "relative z-10 flex h-full w-full transition-all duration-300",
                showEditorMenu ? "pt-12" : "pt-0"
            )}>
                {showEditorMenu && <Sidebar />}
                <main className={cn(
                    "flex-1 h-full overflow-y-auto relative transition-colors duration-500",
                    showEditorMenu 
                        ? (isDark ? "border-l bg-black/20 border-white/5" : "border-l bg-white/20 border-black/5") 
                        : "border-l-0 bg-transparent"
                )}>
                    <CurrentPage />
                </main>
            </div>
            <FloatingEstimator />
            <HunniChatWidget />
            <GlobalCustomerLookupModal />
            <GlobalWeatherModal />
            {window.location.hostname === 'localhost' && <DevNavigator />}
        </div>
    );
};

const LoginBridge: React.FC = () => {
    const { currentUser, login } = useMockDB();
    const { activePageId, setActivePageId } = useNavigation();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    // Parse URL parameter on mount/popstate so direct links work
    useEffect(() => {
        const handleUrlChange = () => {
            const params = new URLSearchParams(window.location.search);
            const pageCode = params.get('page');
            if (pageCode && pageCode !== activePageId) {
                setActivePageId(pageCode);
            }
        };

        handleUrlChange();
        window.addEventListener('popstate', handleUrlChange);
        window.addEventListener('nav-page', handleUrlChange);
        return () => {
            window.removeEventListener('popstate', handleUrlChange);
            window.removeEventListener('nav-page', handleUrlChange);
        };
    }, [activePageId, setActivePageId]);

    // Force non-public pages back to login/empty if logged out
    useEffect(() => {
        if (!currentUser) {
            const params = new URLSearchParams(window.location.search);
            const pageCode = params.get('page');
            if (pageCode) {
                if (pageCode.startsWith('P-')) {
                    if (pageCode !== activePageId) {
                        setActivePageId(pageCode);
                    } else {
                        // Clean up page query param once activePageId matches it
                        const newParams = new URLSearchParams(window.location.search);
                        newParams.delete('page');
                        const newSearch = newParams.toString();
                        const newUrl = window.location.pathname + (newSearch ? '?' + newSearch : '');
                        window.history.replaceState({}, '', newUrl);
                    }
                } else {
                    setActivePageId('P-00');
                }
            } else if (!activePageId || !activePageId.startsWith('P-')) {
                setActivePageId('P-00');
            }
        }
    }, [currentUser, activePageId, setActivePageId]);

    if (!currentUser) {
        const isLoginPage = activePageId === 'P-06';
        const hasOwnHeader = activePageId === 'P-00' || activePageId === 'P-00a' || activePageId === 'P-00b' || !activePageId;
        const isPagePublic = activePageId && activePageId.startsWith('P-');
        const targetPageId = isPagePublic ? activePageId : 'P-00';
        const CurrentPage = pageComponentMap[targetPageId] || pageComponentMap['P-00'];

        return (
            <div className={cn(
                "fixed inset-0 w-screen h-screen overflow-hidden transition-colors duration-500",
                isDark ? "bg-black text-white" : "bg-[#F8F9FA] text-black"
            )}>
                <CircuitryBackground
                    backgroundColor={isDark ? "#000000" : "#F8F9FA"}
                    dotColor={isDark ? "#ec028b" : "#ec028b"}
                    lineColor={isDark ? "236, 2, 139" : "236, 2, 139"}
                />
                
                {/* Render RhiveHeader for public pages that don't embed it */}
                {!isLoginPage && !hasOwnHeader && <RhiveHeader />}

                <main className={cn(
                    "relative z-10 w-full h-full overflow-y-auto relative transition-colors duration-500",
                    !isLoginPage && !hasOwnHeader && "pt-12"
                )}>
                    {isLoginPage ? (
                        <div className="w-full h-full flex items-center justify-center p-4">
                            <LoginPage onLogin={login} />
                        </div>
                    ) : (
                        <CurrentPage />
                    )}
                </main>
                <FloatingEstimator />
                <HunniChatWidget />
                <GlobalCustomerLookupModal />
                <GlobalWeatherModal />
                {window.location.hostname === 'localhost' && <DevNavigator />}
            </div>
        );
    }

    return <AppContentAuthenticated />;
};

export default function App() {
    return (
        <ThemeProvider>
            <LanguageProvider>
                <MockDatabaseProvider>
                    <PricingProvider>
                        <NavigationProvider>
                            <LoginBridge />
                        </NavigationProvider>
                    </PricingProvider>
                </MockDatabaseProvider>
            </LanguageProvider>
        </ThemeProvider>
    );
}
