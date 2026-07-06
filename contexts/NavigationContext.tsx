
import React, { createContext, useContext, useState, useEffect } from 'react';

// Profile list pages — navigating to these clears the matched selectedId
const PROFILE_LIST_CLEAR_MAP: Record<string, string[]> = {
    'E-08': ['selectedAccountId'],
    'E-10': ['selectedContactId'],
    'E-11': ['selectedPropertyId'],
    'E-12': ['selectedPropertyId'],
    'E-15': ['selectedProjectId'],
    // Pipeline stage pages — clear selectedProjectId so list view is shown
    'E-26': ['selectedProjectId'],
    'E-27': ['selectedProjectId'],
    'E-28': ['selectedProjectId'],
    'E-29': ['selectedProjectId'],
    'E-30': ['selectedProjectId'],
    'E-31': ['selectedProjectId'],
    'E-32': ['selectedProjectId'],
    'E-33': ['selectedProjectId'],
    'E-34': ['selectedProjectId'],
    'E-35': ['selectedProjectId'],
    'E-36': ['selectedProjectId'],
};

interface NavigationContextType {
    activePageId: string;
    setActivePageId: (id: string) => void;
    /** Navigate to a page from the sidebar — clears related selectedIds so list view is shown */
    navigateToPage: (id: string) => void;
    selectedPropertyId: string | null;
    setSelectedPropertyId: (id: string | null) => void;
    selectedProjectId: string | null;
    setSelectedProjectId: (id: string | null) => void;
    selectedContactId: string | null;
    setSelectedContactId: (id: string | null) => void;
    selectedAccountId: string | null;
    setSelectedAccountId: (id: string | null) => void;
    showEditorMenu: boolean;
    setShowEditorMenu: (show: boolean) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

const SESSION_KEY = 'rhive_active_page';

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Restore last active page from URL first, then sessionStorage, then default
    const [activePageId, setActivePageIdRaw] = useState<string>(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const urlPage = params.get('page');
            if (urlPage) return urlPage;
        }
        try {
            return sessionStorage.getItem(SESSION_KEY) || 'P-00-V3';
        } catch {
            return 'P-00-V3';
        }
    });

    // Wrap setter to also persist to sessionStorage
    const setActivePageId = React.useCallback((id: string) => {
        try {
            sessionStorage.setItem(SESSION_KEY, id);
        } catch { /* ignore quota errors */ }
        setActivePageIdRaw(id);
    }, []);
    const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
    const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
    const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
    const [showEditorMenu, setShowEditorMenu] = useState<boolean>(true);

    /** Used by Sidebar: clears related selectedId(s) so profile pages show their list */
    const navigateToPage = React.useCallback((id: string) => {
        const toClear = PROFILE_LIST_CLEAR_MAP[id] || [];
        if (toClear.includes('selectedPropertyId')) setSelectedPropertyId(null);
        if (toClear.includes('selectedProjectId')) setSelectedProjectId(null);
        if (toClear.includes('selectedContactId')) setSelectedContactId(null);
        if (toClear.includes('selectedAccountId')) setSelectedAccountId(null);
        setActivePageId(id);
    }, []);

    // Automatically hide/show editor menu when changing pages
    React.useEffect(() => {
        if (activePageId.startsWith('P-')) {
            setShowEditorMenu(false);
        } else {
            setShowEditorMenu(true);
        }
    }, [activePageId]);

    return (
        <NavigationContext.Provider value={{
            activePageId,
            setActivePageId,
            navigateToPage,
            selectedPropertyId,
            setSelectedPropertyId,
            selectedProjectId,
            setSelectedProjectId,
            selectedContactId,
            setSelectedContactId,
            selectedAccountId,
            setSelectedAccountId,
            showEditorMenu,
            setShowEditorMenu,
        }}>
            {children}
        </NavigationContext.Provider>
    );
};

export const useNavigation = () => {
    const context = useContext(NavigationContext);
    if (!context) throw new Error("useNavigation must be used within NavigationProvider");
    return context;
};

