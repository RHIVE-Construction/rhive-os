import { db } from './firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';

export interface CustomFieldItem {
    id: string;
    label: string;
    type: 'Text' | 'Number' | 'Date' | 'Dropdown' | 'Phone' | 'URL';
    required: boolean;
    visibleOnContacts: boolean;
    options?: string[];
}

export interface CustomStageItem {
    id: string;
    name: string;
    category: 'Sales' | 'Production' | 'Closeout';
    color: string;
    active: boolean;
}

export interface CrmTagItem {
    id: string;
    name: string;
    color: 'pink' | 'gold' | 'blue' | 'green' | 'purple' | 'amber';
    usageCount: number;
    autoCreated?: boolean;
}

export interface AppointmentTypeItem {
    id: string;
    name: string;
    durationMinutes: number;
    color: string;
    stages: string[];
}

export interface CrmCustomizationConfig {
    customFields: CustomFieldItem[];
    customStages: CustomStageItem[];
    tags: CrmTagItem[];
    autoCreateTags: boolean;
    appointmentTypes: AppointmentTypeItem[];
    updatedAt?: string;
}

export const CRM_CUSTOMIZATION_STORAGE_KEY = 'rhive_crm_customization_v1';

export const DEFAULT_CRM_CUSTOMIZATION: CrmCustomizationConfig = {
    customFields: [
        { id: 'cf-1', label: 'Roof Age (Years)', type: 'Number', required: false, visibleOnContacts: true },
        { id: 'cf-2', label: 'Insurance Carrier', type: 'Text', required: false, visibleOnContacts: true },
        { id: 'cf-3', label: 'Gate / Property Access Code', type: 'Text', required: false, visibleOnContacts: true },
        { id: 'cf-4', label: 'Preferred Contact Method', type: 'Dropdown', required: false, visibleOnContacts: true, options: ['SMS Text', 'Email', 'Phone Call'] },
        { id: 'cf-5', label: 'HOA / Asset Manager Contact', type: 'Phone', required: false, visibleOnContacts: false },
    ],
    customStages: [
        { id: 'stg-1', name: 'Stage 1: Lead (Intake)', category: 'Sales', color: '#ec028b', active: true },
        { id: 'stg-2', name: 'Stage 2: Estimate (Property Data)', category: 'Sales', color: '#3b82f6', active: true },
        { id: 'stg-3', name: 'Stage 3: Quote (Pricing Options)', category: 'Sales', color: '#e2ab49', active: true },
        { id: 'stg-4', name: 'Stage 4: Sign & Verify', category: 'Sales', color: '#a855f7', active: true },
        { id: 'stg-5', name: 'Stage 5: Schedule & Permits', category: 'Production', color: '#06b6d4', active: true },
        { id: 'stg-6', name: 'Stage 7: Install (In Progress)', category: 'Production', color: '#f97316', active: true },
        { id: 'stg-7', name: 'Stage 10: Completed (Paid)', category: 'Closeout', color: '#10b981', active: true },
        { id: 'stg-8', name: 'Stage 11: Past Customer', category: 'Closeout', color: '#6b7280', active: true },
    ],
    tags: [
        { id: 'tag-1', name: 'Commercial CapEx', color: 'blue', usageCount: 14 },
        { id: 'tag-2', name: 'Hail Damage', color: 'pink', usageCount: 23, autoCreated: true },
        { id: 'tag-3', name: 'VIP / Multi-Campus', color: 'gold', usageCount: 6 },
        { id: 'tag-4', name: 'Insurance Claim', color: 'purple', usageCount: 19, autoCreated: true },
        { id: 'tag-5', name: 'Referral', color: 'green', usageCount: 11 },
        { id: 'tag-6', name: 'Urgent Leak', color: 'amber', usageCount: 4, autoCreated: true },
        { id: 'tag-7', name: 'TPO Flat Membrane', color: 'blue', usageCount: 9 },
        { id: 'tag-8', name: 'Heat Trace Defense', color: 'pink', usageCount: 7 },
    ],
    autoCreateTags: true,
    appointmentTypes: [
        {
            id: 'apt-1',
            name: 'Drone Roof Inspection',
            durationMinutes: 45,
            color: '#ec028b',
            stages: ['Scheduled', 'Confirmed', 'En Route', 'Completed', 'Rescheduled', 'No Show'],
        },
        {
            id: 'apt-2',
            name: 'On-Site Estimate Walkthrough',
            durationMinutes: 60,
            color: '#e2ab49',
            stages: ['Scheduled', 'Confirmed', 'Walkthrough Done', 'Proposal Sent', 'Cancelled'],
        },
        {
            id: 'apt-3',
            name: 'Contract Signing & Material Color Pick',
            durationMinutes: 30,
            color: '#3b82f6',
            stages: ['Scheduled', 'Signed', 'Deposit Verified', 'Rescheduled'],
        },
        {
            id: 'apt-4',
            name: 'Final QC Punch List & Magnetic Sweep',
            durationMinutes: 45,
            color: '#10b981',
            stages: ['Scheduled', 'Passed QC', 'Punch List Open', 'Signed Off'],
        },
    ],
};

export const TAG_COLOR_CLASSES: Record<CrmTagItem['color'], string> = {
    pink: 'bg-rhive-pink/15 text-rhive-pink border-rhive-pink/40',
    gold: 'bg-rhive-gold/15 text-rhive-gold border-rhive-gold/40',
    blue: 'bg-blue-500/15 text-blue-400 border-blue-500/40',
    green: 'bg-green-500/15 text-green-400 border-green-500/40',
    purple: 'bg-purple-500/15 text-purple-400 border-purple-500/40',
    amber: 'bg-amber-500/15 text-amber-400 border-amber-500/40',
};

export const loadCachedCrmCustomization = (): CrmCustomizationConfig => {
    try {
        const raw = localStorage.getItem(CRM_CUSTOMIZATION_STORAGE_KEY);
        if (raw) return { ...DEFAULT_CRM_CUSTOMIZATION, ...JSON.parse(raw) };
    } catch { /* ignore */ }
    return DEFAULT_CRM_CUSTOMIZATION;
};

export const subscribeToCrmCustomization = (
    callback: (config: CrmCustomizationConfig) => void
): (() => void) => {
    try {
        const ref = doc(db, 'crm_customization', 'config');
        return onSnapshot(
            ref,
            (snap) => {
                if (snap.exists()) {
                    const merged = { ...DEFAULT_CRM_CUSTOMIZATION, ...(snap.data() as Partial<CrmCustomizationConfig>) };
                    try { localStorage.setItem(CRM_CUSTOMIZATION_STORAGE_KEY, JSON.stringify(merged)); } catch { /* ignore */ }
                    callback(merged);
                } else {
                    callback(loadCachedCrmCustomization());
                }
            },
            (err) => {
                console.warn('[crmCustomizationService] Snapshot error:', err);
                callback(loadCachedCrmCustomization());
            }
        );
    } catch {
        callback(loadCachedCrmCustomization());
        return () => {};
    }
};

export const saveCrmCustomization = async (config: CrmCustomizationConfig): Promise<{ success: boolean; error?: string }> => {
    const stamped = { ...config, updatedAt: new Date().toISOString() };
    try { localStorage.setItem(CRM_CUSTOMIZATION_STORAGE_KEY, JSON.stringify(stamped)); } catch { /* ignore */ }
    try {
        await setDoc(doc(db, 'crm_customization', 'config'), stamped, { merge: true });
        return { success: true };
    } catch (err: any) {
        console.warn('[crmCustomizationService.saveCrmCustomization] Error:', err);
        return { success: false, error: err?.message };
    }
};
