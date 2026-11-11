/**
 * Centralized Intake Form Routing Utility
 * Routes user Call-to-Actions (CTAs) into the single unified Intake Form flow (pages/CustomerInputPage.tsx)
 * and pre-selects the requested Intent, Scope, and Property Category.
 */

export interface IntakePreselectOptions {
    intent?: 'Certified Quote' | 'Instant Estimate' | 'Inspection' | 'Ready' | 'Exploring';
    category?: 'Commercial' | 'Residential' | 'Government';
    scope?: 'Repair' | 'Replacement';
    activeLeak?: boolean;
    address?: string;
}

export function navigateToIntake(options: IntakePreselectOptions = {}): void {
    try {
        // 1. Property Category pre-selection
        if (options.category) {
            sessionStorage.setItem('intakeCategory', options.category);
        }

        // 2. Intent pre-selection:
        // 'Certified Quote' / 'Ready' -> 'Ready'
        // 'Instant Estimate' / 'Exploring' -> 'Exploring'
        // 'Inspection' -> 'Inspection'
        if (options.intent) {
            if (options.intent === 'Certified Quote' || options.intent === 'Ready') {
                sessionStorage.setItem('intakePurchaseIntent', 'Ready');
            } else if (options.intent === 'Instant Estimate' || options.intent === 'Exploring') {
                sessionStorage.setItem('intakePurchaseIntent', 'Exploring');
            } else if (options.intent === 'Inspection') {
                sessionStorage.setItem('intakePurchaseIntent', 'Inspection');
            }
        }

        // 3. Scope pre-selection (Repair vs Replacement)
        if (options.scope) {
            sessionStorage.setItem('intakeScopeType', options.scope);
        }

        // 4. Emergency Active Leak pre-selection
        if (options.activeLeak) {
            sessionStorage.setItem('intakeScopeType', 'Repair');
            sessionStorage.setItem('intakeActiveLeak', 'true');
        }

        // 5. Address pre-fill
        if (options.address) {
            sessionStorage.setItem('globalSearchQuery', options.address);
        }
    } catch {
        // Ignore sessionStorage quota / availability issues
    }

    // Dispatch custom navigation event for in-app reactive transitions
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('nav-page', { detail: 'E-02a' }));
        window.dispatchEvent(new CustomEvent('open-intake', { detail: options }));

        // If on an isolated/clean path or if nav-page doesn't transition within 50ms, update location
        const targetPath = '/intake';
        if (window.location.pathname !== targetPath && window.location.pathname !== '/portal/E-02A') {
            // Check if SPA handled it, otherwise fall back to route
            setTimeout(() => {
                const currentStored = sessionStorage.getItem('rhive_active_page');
                if (currentStored !== 'E-02a') {
                    window.location.href = targetPath;
                }
            }, 60);
        }
    }
}
