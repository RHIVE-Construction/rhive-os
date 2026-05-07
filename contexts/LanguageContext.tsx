
import React, { createContext, useContext, useState } from 'react';

export type Locale = 'en' | 'es' | 'fr' | 'de';

interface LanguageContextType {
    locale: Locale;
    setLocale: (locale: Locale) => void;
    t: (key: string) => string;
}

const translations: Record<Locale, Record<string, string>> = {
    en: {
        'system_title': 'RHIVE OS',
        'system_active': 'System Active',
        'gateway_title': 'QOS Gateway',
        'login_zoho': 'Zoho Auth',
        'login_biometrics': 'Biometrics',
        'restricted_access': 'Restricted Access • RHIVE Industries © 2025',
        'theme_light': 'Switch to Light Mode',
        'theme_dark': 'Switch to Dark Mode',
        'logout': 'Logout',
        'back_to_os': 'Back to OS'
    },
    es: {
        'system_title': 'RHIVE OS',
        'system_active': 'Sistema Activo',
        'gateway_title': 'Pasarela QOS',
        'login_zoho': 'Zoho Auth',
        'login_biometrics': 'Biometría',
        'restricted_access': 'Acceso Restringido • RHIVE Industries © 2025',
        'theme_light': 'Cambiar a modo claro',
        'theme_dark': 'Cambiar a modo oscuro',
        'logout': 'Cerrar sesión',
        'back_to_os': 'Volver al SO'
    },
    fr: {
        'system_title': 'RHIVE OS',
        'system_active': 'Système Actif',
        'gateway_title': 'Passerelle QOS',
        'login_zoho': 'Zoho Auth',
        'login_biometrics': 'Biométrie',
        'restricted_access': 'Accès Restreint • RHIVE Industries © 2025',
        'theme_light': 'Passer en mode clair',
        'theme_dark': 'Passer en mode sombre',
        'logout': 'Déconnexion',
        'back_to_os': 'Retour à l\'OS'
    },
    de: {
        'system_title': 'RHIVE OS',
        'system_active': 'System Aktiv',
        'gateway_title': 'QOS Gateway',
        'login_zoho': 'Zoho Auth',
        'login_biometrics': 'Biometrie',
        'restricted_access': 'Eingeschränkter Zugriff • RHIVE Industries © 2025',
        'theme_light': 'In den hellen Modus wechseln',
        'theme_dark': 'In den dunklen Modus wechseln',
        'logout': 'Abmelden',
        'back_to_os': 'Zurück zum OS'
    }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [locale, setLocale] = useState<Locale>('en');

    const t = (key: string) => translations[locale][key] || key;

    return (
        <LanguageContext.Provider value={{ locale, setLocale, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
    return context;
};
