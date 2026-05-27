
import React, { useEffect } from 'react';
import { PricingProvider } from './contexts/PricingContext';
import { MockDatabaseProvider, useMockDB } from './contexts/MockDatabaseContext';
import { NavigationProvider, useNavigation } from './contexts/NavigationContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { Sidebar } from './components/Sidebar';
import LoginPage from './pages/LoginPage';
import { GlobalHeader } from './components/GlobalHeader';
import { pageComponentMap } from './pageRegistry';
import { CircuitryBackground } from './components/CircuitryBackground';
import { FloatingEstimator } from './components/FloatingEstimator';
import { DevNavigator } from './components/DevNavigator';
import { cn } from './lib/utils';
import { session } from './lib/session';

const AppContentAuthenticated: React.FC = () => {
    const { activePageId, setActivePageId } = useNavigation();
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
            setActivePageId(pageCode);
        }

        const handleCustomNav = (e: any) => {
            if (e.detail) setActivePageId(e.detail);
        };
        window.addEventListener('nav-page', handleCustomNav);
        return () => window.removeEventListener('nav-page', handleCustomNav);
    }, []); // Run only on mount

    useEffect(() => {
        if (activePageId) {
            const params = new URLSearchParams(window.location.search);
            if (params.get('page') !== activePageId) {
                const newUrl = `${window.location.pathname}?page=${activePageId}`;
                window.history.pushState({ path: newUrl }, '', newUrl);
            }
        }
    }, [activePageId]);

    useEffect(() => {
        if (currentUser && !activePageId) {
            switch (currentUser.role) {
                case 'Super Admin': setActivePageId('SA-01'); break;
                case 'Admin': setActivePageId('E-01'); break; // Unified entry point
                case 'Employee': setActivePageId('E-01'); break;
                case 'Customer': setActivePageId('C-01'); break;
                case 'Contractor': setActivePageId('CO-01'); break;
                case 'Supplier': setActivePageId('S-01'); break;
                case 'Public': setActivePageId('P-00'); break;
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
            <GlobalHeader />

            <div className="relative z-10 flex h-full w-full pt-12">
                <Sidebar />
                <main 
                    ref={mainRef}
                    className={cn(
                    "flex-1 h-full overflow-y-auto relative border-l transition-colors duration-500",
                    isDark ? "bg-black/20 border-white/5" : "bg-white/20 border-black/5"
                )}>
                    <CurrentPage />
                </main>
            </div>
            <FloatingEstimator />
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
            if (activePageId && !(activePageId || '').startsWith('P-')) {
                setActivePageId('');
            }
        }
    }, [currentUser, activePageId, setActivePageId]);

    if (!currentUser) {
        // If a public page is active (except P-06 which is LoginPage itself), render that page inside the public layout!
        const isPublicPage = (activePageId || '').startsWith('P-') && activePageId !== 'P-06' && activePageId !== '';
        const CurrentPublicPage = isPublicPage ? pageComponentMap[activePageId] : null;

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
                <GlobalHeader />
                <main className="relative z-10 w-full h-full pt-12 flex items-center justify-center overflow-auto px-4">
                    {CurrentPublicPage ? (
                        <CurrentPublicPage />
                    ) : (
                        <LoginPage onLogin={login} />
                    )}
                </main>
                <FloatingEstimator />
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
