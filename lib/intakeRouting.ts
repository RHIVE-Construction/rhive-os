/**
 * Centralized Intake Form Routing Utility
 * Routes user Call-to-Actions (CTAs) and Search Prefills into the single unified
 * Intake Form flow (`pages/CustomerInputPage.tsx`, `E-02a`) without destructive full-page reloads.
 */

export interface IntakePreselectOptions {
    intent?: 'Certified Quote' | 'Instant Estimate' | 'Inspection' | 'Ready' | 'Exploring';
    category?: 'Commercial' | 'Residential' | 'Government';
    scope?: 'Repair' | 'Replacement';
    activeLeak?: boolean;
    address?: string;
    prefillPayload?: Record<string, any>;
}

export function navigateToIntake(options: IntakePreselectOptions = {}): void {
    try {
        if (options.category) {
            sessionStorage.setItem('intakeCategory', options.category);
        }

        if (options.intent) {
            if (options.intent === 'Certified Quote' || options.intent === 'Ready') {
                sessionStorage.setItem('intakePurchaseIntent', 'Ready');
            } else if (options.intent === 'Instant Estimate' || options.intent === 'Exploring') {
                sessionStorage.setItem('intakePurchaseIntent', 'Exploring');
            } else if (options.intent === 'Inspection') {
                sessionStorage.setItem('intakePurchaseIntent', 'Inspection');
            }
        }

        if (options.scope) {
            sessionStorage.setItem('intakeScopeType', options.scope);
        }

        if (options.activeLeak) {
            sessionStorage.setItem('intakeScopeType', 'Repair');
            sessionStorage.setItem('intakeActiveLeak', 'true');
        }

        if (options.address) {
            sessionStorage.setItem('globalSearchQuery', options.address);
            sessionStorage.setItem('globalSearchQueryType', 'Address');
        }

        if (options.prefillPayload) {
            sessionStorage.setItem('rhive_prefill_intake', JSON.stringify(options.prefillPayload));
        }

        sessionStorage.setItem('rhive_active_page', 'E-02a');
    } catch {
        // Ignore sessionStorage quota / availability issues
    }

    if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('nav-page', { detail: 'E-02a' }));
        window.dispatchEvent(new CustomEvent('open-intake', { detail: options }));
        // Notify an already-mounted CustomerInputPage to hydrate the latest prefill immediately
        window.dispatchEvent(new CustomEvent('rhive-apply-intake-prefill', { detail: options }));
    }
}
