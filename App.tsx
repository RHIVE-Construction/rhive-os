
import React, { useEffect, useRef } from 'react';
import { logUserActivity, LOG_ACTIONS, PAGE_NAMES } from './lib/userActivityLogger';
import { PricingProvider } from './contexts/PricingContext';
import { MockDatabaseProvider, useMockDB } from './contexts/MockDatabaseContext';
import { NavigationProvider, useNavigation } from './contexts/NavigationContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { Sidebar } from './components/Sidebar';
import LoginPage from './pages/LoginPage';
import PasswordResetPage from './pages/PasswordResetPage';
import { GlobalHeader } from './components/GlobalHeader';
import RhiveHeader from './components/website/RhiveHeader';
import { pageComponentMap } from './pageRegistry';
import { CircuitryBackground } from './components/CircuitryBackground';
import { FloatingEstimator } from './components/FloatingEstimator';
import { GlobalChatWidget } from './components/chat/GlobalChatWidget';
import HunniChatWidget from './components/website/HunniChatWidget';
import PublicWebHeader from './components/website/PublicWebHeader';
import { DevNavigator } from './components/DevNavigator';
import { FloatingBackButton } from './components/FloatingBackButton';
import { GlobalCustomerLookupModal } from './components/GlobalCustomerLookupModal';
import { GlobalWeatherModal } from './components/GlobalWeatherModal';
import { cn } from './lib/utils';
import { session } from './lib/session';

// Check if the current URL is a password reset link (Firebase Auth or Firestore-based)
const isPasswordResetFlow = (): boolean => {
    const params = new URLSearchParams(window.location.search);
    const mode = params.get('mode');
    return (mode === 'resetPassword' && !!params.get('oobCode')) ||
           (mode === 'firestoreReset' && !!params.get('token'));
};

// ── Clean URL Path Registry ────────────────────────────────────────────────────
// Maps a URL pathname to a pageComponentMap key.
// Pages listed here are rendered as standalone website pages (no CRM chrome, no login required).
// To add a new public URL: add an entry below and deploy — no other changes needed.
const PATH_ROUTES: Record<string, string> = {
    '/estimate-tool': 'estimate-tool',
    '/map':           'INTERNAL-BPM',
    // Uncomment to add more public URL pages:
    // '/insurance':   'P-13',
    // '/maintenance': 'P-14',
};

// Resolved on module load — null means this is a normal app route
const CLEAN_PATH_PAGE: string | null = PATH_ROUTES[window.location.pathname] ?? null;

// Detect CUSTOMER-SIGN-VERIFY page (link-only, no auth, no sidebar)
const IS_SIGN_VERIFY_ROUTE = ((): boolean => {
    const params = new URLSearchParams(window.location.search);
    return params.get('page') === 'CUSTOMER-SIGN-VERIFY';
})();

// ── Customer Sign & Verify Full-Screen Renderer ——————————————————————————————————
const SignVerifyRenderer: React.FC = () => {
    const SignVerifyPage = pageComponentMap['CUSTOMER-SIGN-VERIFY'];
    return (
        <div className="fixed inset-0 w-screen h-screen overflow-hidden font-sans">
            {SignVerifyPage && <SignVerifyPage />}
        </div>
    );
};

// ── Clean Path Full-Screen Renderer ───────────────────────────────────────────
// Rendered when the URL pathname matches a PATH_ROUTES entry.
// COMPLETELY ISOLATED from the CRM provider tree:
//   - No NavigationContext, no MockDatabaseContext, no NotificationContext
//   - PricingProvider only (estimate tool needs pricing data)
//   - PublicWebHeader: context-free website nav (window.location.href links)
// A customer arriving via QR code will never touch or see any CRM state.
const CleanPathRenderer: React.FC<{ pageId: string }> = ({ pageId }) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const PageComponent = pageComponentMap[pageId];
    return (
        <PricingProvider>
            <div className={cn(
                'fixed inset-0 w-screen h-screen overflow-hidden font-sans transition-colors duration-500',
                isDark ? 'bg-black text-white' : 'bg-[#F8F9FA] text-black'
            )}>
                <CircuitryBackground
                    backgroundColor={isDark ? '#000000' : '#F8F9FA'}
                    dotColor="#ec028b"
                    lineColor="236, 2, 139"
                />
                {/* Website nav header — context-free, no CRM hooks */}
                <PublicWebHeader />
                <main className="relative z-10 w-full h-full overflow-y-auto pt-12">
                    {PageComponent ? <PageComponent /> : (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-gray-400 font-mono">Page not found.</p>
                        </div>
                    )}
                </main>
                <FloatingBackButton />
                {window.location.hostname === 'localhost' && <DevNavigator />}
            </div>
        </PricingProvider>
    );
};

const AppContentAuthenticated: React.FC = () => {
    const { activePageId, setActivePageId, showEditorMenu } = useNavigation();
    const { currentUser } = useMockDB();
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const mainRef = React.useRef<HTMLElement>(null);

    const pageVisitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

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

    // Log page navigation with 2-second debounce to reduce noise from rapid switching
    useEffect(() => {
        if (!activePageId || !currentUser) return;
        // Skip logging the Log viewer itself to prevent infinite feedback loops
        if (activePageId === 'A-LOGS') return;
        if (pageVisitTimer.current) clearTimeout(pageVisitTimer.current);
        pageVisitTimer.current = setTimeout(() => {
            const pageName = PAGE_NAMES[activePageId] || activePageId;
            logUserActivity(
                LOG_ACTIONS.PAGE_VISITED,
                `Visited: ${pageName}`,
                { pageId: activePageId, pageName }
            );
        }, 2000);
        return () => {
            if (pageVisitTimer.current) clearTimeout(pageVisitTimer.current);
        };
    }, [activePageId, currentUser]);

    useEffect(() => {
        if (mainRef.current) {
            mainRef.current.scrollTop = 0;
        }
        if (activePageId === 'P-00' || activePageId === 'P-00-V2' || activePageId === 'P-00-V3') {
            sessionStorage.setItem('lastHomepageId', activePageId);
        }
        
        // Sync to URL
        const params = new URLSearchParams(window.location.search);
        if (params.get('page') !== activePageId) {
            params.set('page', activePageId);
            const newUrl = window.location.pathname + '?' + params.toString();
            window.history.replaceState({ ...window.history.state, path: newUrl }, '', newUrl);
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
        // Only redirect to role dashboard from the login page (P-06) or when no page is set.
        // Do NOT redirect from other public pages like Estimate Tool (P-12).
        if (currentUser && (!activePageId || activePageId === 'P-06')) {
            switch (currentUser.role) {
                case 'Super Admin': setActivePageId('SA-01'); break;
                case 'Admin': setActivePageId('E-01'); break;
                case 'Employee': setActivePageId('E-01'); break;
                case 'Customer': setActivePageId('C-01'); break;
                case 'Contractor': setActivePageId('CO-01'); break;
                case 'Supplier': setActivePageId('S-01'); break;
                default: setActivePageId('P-00'); break;
            }
        }
    }, [currentUser, setActivePageId, activePageId]);

    const CurrentPage = React.useMemo(
        () => pageComponentMap[activePageId] || (() => <div className="p-10 text-gray-400">Select a page from the menu.</div>),
        [activePageId]
    );

    const isPublicRoute = activePageId?.startsWith('P-') ?? false;

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
            {!isPublicRoute && <GlobalHeader />}

            <div className={cn("relative z-10 flex h-full w-full", !isPublicRoute ? "pt-12" : "pt-0")}>
                {!isPublicRoute && <Sidebar />}
                <main 
                    ref={mainRef}
                    className={cn(
                    "flex-1 h-full overflow-y-auto relative transition-colors duration-500",
                    !isPublicRoute && "border-l",
                    isDark ? "bg-black/20 border-white/5" : "bg-white/20 border-black/5"
                )}>
                    <CurrentPage />
                </main>
            </div>
            <FloatingEstimator />
            <GlobalChatWidget />
            <FloatingBackButton />
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
    const mainRef = React.useRef<HTMLElement>(null);

    // Derive the public page target — computed unconditionally so useMemo is always at top level
    const isPagePublic = !!(activePageId && activePageId.startsWith('P-'));
    const targetPageId = isPagePublic ? activePageId : 'P-00';

    // Stable component reference — only recreated when the target page actually changes
    // MUST be at the top level (not inside an if-block) to satisfy Rules of Hooks
    const PublicCurrentPage = React.useMemo(
        () => pageComponentMap[targetPageId] || pageComponentMap['P-00'],
        [targetPageId]
    );

    // Parse URL parameter on mount/popstate so direct links work
    useEffect(() => {
        const handleUrlChange = () => {
            const params = new URLSearchParams(window.location.search);
            const pageCode = params.get('page');
            if (pageCode) {
                setActivePageId(pageCode);
            }
        };

        handleUrlChange();
        window.addEventListener('popstate', handleUrlChange);
        
        const handleCustomNav = (e: any) => {
            if (e.detail) setActivePageId(e.detail);
        };
        window.addEventListener('nav-page', handleCustomNav);

        return () => {
            window.removeEventListener('popstate', handleUrlChange);
            window.removeEventListener('nav-page', handleCustomNav);
        };
    }, [setActivePageId]);

    // Force non-public pages back to home if logged out
    useEffect(() => {
        if (!currentUser) {
            if (activePageId && !activePageId.startsWith('P-')) {
                setActivePageId('P-00-V3');
            }
        }
    }, [currentUser, activePageId, setActivePageId]);

    // ── Password reset link interceptor ──────────────────────────────────────
    // Firebase email links arrive as /?mode=resetPassword&oobCode=xxx
    // Render the reset page immediately, regardless of auth state.
    if (isPasswordResetFlow()) {
        return (
            <div className={cn(
                "fixed inset-0 w-screen h-screen overflow-auto transition-colors duration-500",
                isDark ? "bg-black text-white" : "bg-[#F8F9FA] text-black"
            )}>
                <CircuitryBackground
                    backgroundColor={isDark ? "#000000" : "#F8F9FA"}
                    dotColor={isDark ? "#ec028b" : "#ec028b"}
                    lineColor={isDark ? "236, 2, 139" : "236, 2, 139"}
                />
                <GlobalHeader />
                <main className="relative z-10 w-full min-h-full pt-12 flex items-center justify-center px-4 py-8">
                    <PasswordResetPage />
                </main>
            </div>
        );
    }
    // Sync browser URL bar with activePageId for unauthenticated users
    useEffect(() => {
        if (!currentUser && activePageId) {
            const isHomePage = activePageId === 'P-00' || activePageId === 'P-00-V2' || activePageId === 'P-00-V3';
            if (isHomePage) {
                if (window.location.search) {
                    window.history.replaceState({}, '', window.location.pathname);
                }
            } else {
                const params = new URLSearchParams(window.location.search);
                if (params.get('page') !== activePageId) {
                    const newUrl = `${window.location.pathname}?page=${activePageId}`;
                    window.history.pushState({ path: newUrl }, '', newUrl);
                }
            }
        }
    }, [activePageId, currentUser]);

    // Scroll to top when activePageId changes for public layout
    useEffect(() => {
        if (!currentUser) {
            if (mainRef.current) {
                mainRef.current.scrollTop = 0;
            }
            if (activePageId === 'P-00' || activePageId === 'P-00-V2' || activePageId === 'P-00-V3') {
                sessionStorage.setItem('lastHomepageId', activePageId);
            }
        }
    }, [activePageId, currentUser]);

    if (!currentUser) {
        const isLoginPage = activePageId === 'P-06';

        if (isPagePublic && !isLoginPage && PublicCurrentPage) {
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
                    <main ref={mainRef} className="relative z-10 w-full h-full overflow-y-auto relative">
                        <PublicCurrentPage />
                    </main>
                    <FloatingEstimator />
                    <FloatingBackButton />
                    {window.location.hostname === 'localhost' && <DevNavigator />}
                </div>
            );
        }

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
                    <LoginPage onLogin={login} />
                </main>
                <FloatingEstimator />
                <HunniChatWidget />
                <GlobalCustomerLookupModal />
                <GlobalWeatherModal />
                {window.location.hostname === 'localhost' && <DevNavigator />}
            </div>
        );
    }

    // ── Authenticated users on Estimate Tool ──────────────────────────────────
    // Render the estimate tool in the public layout when logged in to prevent the
    // double CircuitryBackground conflict that causes a black screen.
    if (currentUser && (activePageId === 'P-12' || activePageId === 'estimate-tool')) {
        const EstimatePageComponent = pageComponentMap['estimate-tool'] ?? pageComponentMap['P-12'];
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
                <main ref={mainRef} className="relative z-10 w-full h-full overflow-y-auto">
                    {EstimatePageComponent && <EstimatePageComponent />}
                </main>
                <FloatingBackButton />
                {window.location.hostname === 'localhost' && <DevNavigator />}
            </div>
        );
    }

    return <AppContentAuthenticated />;
};

export default function App() {
    // /sign-verify route — render customer form outside auth (link-only, no sidebar)
    if (IS_SIGN_VERIFY_ROUTE) {
        return (
            <ThemeProvider>
                <SignVerifyRenderer />
            </ThemeProvider>
        );
    }

    // Clean URL path routes (e.g. /estimate-tool, /map) — no auth, no CRM chrome
    if (CLEAN_PATH_PAGE) {
        return (
            <ThemeProvider>
                <CleanPathRenderer pageId={CLEAN_PATH_PAGE} />
            </ThemeProvider>
        );
    }

    return (
        <ThemeProvider>
            <LanguageProvider>
                <MockDatabaseProvider>
                    <NotificationProvider>
                        <PricingProvider>
                            <NavigationProvider>
                                <LoginBridge />
                            </NavigationProvider>
                        </PricingProvider>
                    </NotificationProvider>
                </MockDatabaseProvider>
            </LanguageProvider>
        </ThemeProvider>
    );
}
