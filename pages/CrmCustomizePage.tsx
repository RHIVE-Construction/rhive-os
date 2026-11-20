import React, { useState, useEffect } from 'react';
import PageContainer from '../components/PageContainer';
import Button from '../components/Button';
import { db } from '../lib/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import {
    PencilSquareIcon,
    BriefcaseIcon,
    CalendarIcon,
    PlusIcon,
    SearchIcon,
    Check,
    XIcon,
    SparklesIcon,
} from '../components/icons';
import { cn } from '../lib/utils';

type CustomizeSection = 'fields' | 'stages' | 'tags' | 'appointments';

interface CustomFieldItem {
    id: string;
    label: string;
    type: 'Text' | 'Number' | 'Date' | 'Dropdown' | 'Phone' | 'URL';
    required: boolean;
    visibleOnContacts: boolean;
    options?: string[];
}

interface CustomStageItem {
    id: string;
    name: string;
    category: 'Sales' | 'Production' | 'Closeout';
    color: string;
    active: boolean;
}

interface CrmTagItem {
    id: string;
    name: string;
    color: 'pink' | 'gold' | 'blue' | 'green' | 'purple' | 'amber';
    usageCount: number;
    autoCreated?: boolean;
}

interface AppointmentTypeItem {
    id: string;
    name: string;
    durationMinutes: number;
    color: string;
    stages: string[];
}

interface CrmCustomizationConfig {
    customFields: CustomFieldItem[];
    customStages: CustomStageItem[];
    tags: CrmTagItem[];
    autoCreateTags: boolean;
    appointmentTypes: AppointmentTypeItem[];
    updatedAt?: string;
}

const DEFAULT_CONFIG: CrmCustomizationConfig = {
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

const STORAGE_KEY = 'rhive_crm_customization_v1';

const TAG_COLOR_CLASSES: Record<CrmTagItem['color'], string> = {
    pink: 'bg-rhive-pink/15 text-rhive-pink border-rhive-pink/40',
    gold: 'bg-rhive-gold/15 text-rhive-gold border-rhive-gold/40',
    blue: 'bg-blue-500/15 text-blue-400 border-blue-500/40',
    green: 'bg-green-500/15 text-green-400 border-green-500/40',
    purple: 'bg-purple-500/15 text-purple-400 border-purple-500/40',
    amber: 'bg-amber-500/15 text-amber-400 border-amber-500/40',
};

// Reusable RHIVE Quantum Switch (NO HTML CHECKBOXES)
const QuantumSwitch: React.FC<{ checked: boolean; onChange: () => void; label?: string }> = ({
    checked,
    onChange,
    label,
}) => (
    <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={onChange}
        className={cn(
            'relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none',
            checked ? 'bg-rhive-pink shadow-[0_0_8px_rgba(236,2,139,0.5)]' : 'bg-gray-800'
        )}
    >
        <span
            className={cn(
                'pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                checked ? 'translate-x-4' : 'translate-x-0'
            )}
        />
    </button>
);

export const CrmCustomizePage: React.FC = () => {
    const [activeSection, setActiveSection] = useState<CustomizeSection>('fields');
    const [config, setConfig] = useState<CrmCustomizationConfig>(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) return { ...DEFAULT_CONFIG, ...JSON.parse(raw) };
        } catch { /* ignore */ }
        return DEFAULT_CONFIG;
    });
    const [saveToast, setSaveToast] = useState<string | null>(null);

    // Custom Fields form
    const [newFieldLabel, setNewFieldLabel] = useState('');
    const [newFieldType, setNewFieldType] = useState<CustomFieldItem['type']>('Text');
    const [newFieldRequired, setNewFieldRequired] = useState(false);

    // Custom Stages form
    const [newStageName, setNewStageName] = useState('');
    const [newStageCategory, setNewStageCategory] = useState<CustomStageItem['category']>('Sales');
    const [newStageColor, setNewStageColor] = useState('#ec028b');

    // Tags form
    const [tagSearch, setTagSearch] = useState('');
    const [newTagName, setNewTagName] = useState('');
    const [newTagColor, setNewTagColor] = useState<CrmTagItem['color']>('pink');

    // Appointment Stages form
    const [selectedAptId, setSelectedAptId] = useState<string>(DEFAULT_CONFIG.appointmentTypes[0].id);
    const [newAptTypeName, setNewAptTypeName] = useState('');
    const [newAptDuration, setNewAptDuration] = useState<number>(45);
    const [newAptStageLabel, setNewAptStageLabel] = useState('');

    // Real-time Firestore listener
    useEffect(() => {
        const ref = doc(db, 'crm_customization', 'config');
        const unsub = onSnapshot(
            ref,
            (snap) => {
                if (snap.exists()) {
                    const remote = snap.data() as Partial<CrmCustomizationConfig>;
                    setConfig((prev) => {
                        const merged = { ...prev, ...remote };
                        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(merged)); } catch { /* ignore */ }
                        return merged;
                    });
                }
            },
            (err) => console.warn('[CrmCustomizePage] Snapshot error:', err)
        );
        return () => unsub();
    }, []);

    const persistConfig = async (next: CrmCustomizationConfig, toastMsg = 'Saved customization changes') => {
        const stamped = { ...next, updatedAt: new Date().toISOString() };
        setConfig(stamped);
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(stamped)); } catch { /* ignore */ }
        setSaveToast(toastMsg);
        setTimeout(() => setSaveToast(null), 3000);
        try {
            await setDoc(doc(db, 'crm_customization', 'config'), stamped, { merge: true });
        } catch (err) {
            console.warn('[CrmCustomizePage] Firestore save warning:', err);
        }
    };

    // ── Custom Fields handlers ───────────────────────────────────────────────
    const handleAddField = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newFieldLabel.trim()) return;
        const item: CustomFieldItem = {
            id: `cf-${Date.now()}`,
            label: newFieldLabel.trim(),
            type: newFieldType,
            required: newFieldRequired,
            visibleOnContacts: true,
        };
        persistConfig(
            { ...config, customFields: [...config.customFields, item] },
            `Added field "${item.label}"`
        );
        setNewFieldLabel('');
        setNewFieldRequired(false);
    };

    const handleMoveField = (idx: number, dir: -1 | 1) => {
        const target = idx + dir;
        if (target < 0 || target >= config.customFields.length) return;
        const copy = [...config.customFields];
        [copy[idx], copy[target]] = [copy[target], copy[idx]];
        persistConfig({ ...config, customFields: copy }, 'Reordered contact fields');
    };

    const handleToggleFieldProp = (id: string, key: 'required' | 'visibleOnContacts') => {
        const updated = config.customFields.map(f => (f.id === id ? { ...f, [key]: !f[key] } : f));
        persistConfig({ ...config, customFields: updated }, 'Updated field setting');
    };

    const handleDeleteField = (id: string) => {
        persistConfig(
            { ...config, customFields: config.customFields.filter(f => f.id !== id) },
            'Removed custom field'
        );
    };

    // ── Custom Stages handlers ───────────────────────────────────────────────
    const handleAddStage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newStageName.trim()) return;
        const item: CustomStageItem = {
            id: `stg-${Date.now()}`,
            name: newStageName.trim(),
            category: newStageCategory,
            color: newStageColor,
            active: true,
        };
        persistConfig(
            { ...config, customStages: [...config.customStages, item] },
            `Added stage "${item.name}"`
        );
        setNewStageName('');
    };

    const handleMoveStage = (idx: number, dir: -1 | 1) => {
        const target = idx + dir;
        if (target < 0 || target >= config.customStages.length) return;
        const copy = [...config.customStages];
        [copy[idx], copy[target]] = [copy[target], copy[idx]];
        persistConfig({ ...config, customStages: copy }, 'Reordered workflow stages');
    };

    const handleToggleStageActive = (id: string) => {
        const updated = config.customStages.map(s => (s.id === id ? { ...s, active: !s.active } : s));
        persistConfig({ ...config, customStages: updated }, 'Updated stage status');
    };

    const handleDeleteStage = (id: string) => {
        persistConfig(
            { ...config, customStages: config.customStages.filter(s => s.id !== id) },
            'Removed workflow stage'
        );
    };

    // ── Tags handlers ────────────────────────────────────────────────────────
    const handleAddTag = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTagName.trim()) return;
        if (config.tags.some(t => t.name.toLowerCase() === newTagName.trim().toLowerCase())) return;
        const item: CrmTagItem = {
            id: `tag-${Date.now()}`,
            name: newTagName.trim(),
            color: newTagColor,
            usageCount: 0,
        };
        persistConfig({ ...config, tags: [item, ...config.tags] }, `Created tag "${item.name}"`);
        setNewTagName('');
    };

    const handleDeleteTag = (id: string) => {
        persistConfig(
            { ...config, tags: config.tags.filter(t => t.id !== id) },
            'Deleted tag'
        );
    };

    // ── Appointment Stages handlers ──────────────────────────────────────────
    const activeApt = config.appointmentTypes.find(a => a.id === selectedAptId) || config.appointmentTypes[0];

    const handleAddAppointmentType = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newAptTypeName.trim()) return;
        const item: AppointmentTypeItem = {
            id: `apt-${Date.now()}`,
            name: newAptTypeName.trim(),
            durationMinutes: newAptDuration || 45,
            color: '#ec028b',
            stages: ['Scheduled', 'Confirmed', 'Completed', 'Rescheduled'],
        };
        persistConfig(
            { ...config, appointmentTypes: [...config.appointmentTypes, item] },
            `Added appointment type "${item.name}"`
        );
        setSelectedAptId(item.id);
        setNewAptTypeName('');
    };

    const handleDeleteAppointmentType = (id: string) => {
        const next = config.appointmentTypes.filter(a => a.id !== id);
        persistConfig({ ...config, appointmentTypes: next }, 'Removed appointment type');
        if (selectedAptId === id && next[0]) setSelectedAptId(next[0].id);
    };

    const handleAddAptStage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!activeApt || !newAptStageLabel.trim()) return;
        const updated = config.appointmentTypes.map(a =>
            a.id === activeApt.id ? { ...a, stages: [...a.stages, newAptStageLabel.trim()] } : a
        );
        persistConfig({ ...config, appointmentTypes: updated }, `Added stage "${newAptStageLabel.trim()}"`);
        setNewAptStageLabel('');
    };

    const handleRemoveAptStage = (stageName: string) => {
        if (!activeApt) return;
        const updated = config.appointmentTypes.map(a =>
            a.id === activeApt.id ? { ...a, stages: a.stages.filter(s => s !== stageName) } : a
        );
        persistConfig({ ...config, appointmentTypes: updated }, `Removed stage "${stageName}"`);
    };

    const filteredTags = config.tags.filter(t =>
        !tagSearch.trim() || t.name.toLowerCase().includes(tagSearch.toLowerCase())
    );

    const cards: Array<{
        id: CustomizeSection;
        title: string;
        description: string;
        countLabel: string;
        icon: React.ReactNode;
    }> = [
        {
            id: 'fields',
            title: 'Custom Fields',
            description: 'Add & reorder the fields that show up on contacts.',
            countLabel: `${config.customFields.length} fields`,
            icon: <PencilSquareIcon className="w-5 h-5 text-rhive-gold" />,
        },
        {
            id: 'stages',
            title: 'Custom Stages',
            description: 'Build your dream workflow with the exact stages your team uses.',
            countLabel: `${config.customStages.filter(s => s.active).length} active`,
            icon: <BriefcaseIcon className="w-5 h-5 text-rhive-pink" />,
        },
        {
            id: 'tags',
            title: 'Tags',
            description: 'See all your tags, auto creation & delete unwanted tags.',
            countLabel: `${config.tags.length} tags`,
            icon: <SparklesIcon className="w-5 h-5 text-amber-400" />,
        },
        {
            id: 'appointments',
            title: 'Appointment Stages',
            description: 'Customize the type of appointments & stages for each type.',
            countLabel: `${config.appointmentTypes.length} types`,
            icon: <CalendarIcon className="w-5 h-5 text-blue-400" />,
        },
    ];

    return (
        <PageContainer
            title="CRM Customize"
            subtitle="Configure contact fields, pipeline stages, tags, and appointment workflows across RHIVE OS"
        >
            <div className="space-y-6">
                {/* Save Notification Bar */}
                {saveToast && (
                    <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-300 text-xs font-mono flex items-center justify-between">
                        <span className="flex items-center gap-2 font-bold">
                            <Check className="w-4 h-4 text-green-400" />
                            {saveToast}
                        </span>
                        <span className="text-[10px] text-green-400/70">Synced to Firestore</span>
                    </div>
                )}

                {/* ── TOP 4-CARD "CUSTOMIZE" HUB ──────────────────────────────── */}
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-sm font-mono font-black uppercase tracking-widest text-gray-300">
                            Customize
                        </h2>
                        <span className="text-[11px] font-mono text-gray-500">
                            Select a module below to configure
                        </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {cards.map(card => {
                            const isActive = activeSection === card.id;
                            return (
                                <button
                                    key={card.id}
                                    type="button"
                                    onClick={() => setActiveSection(card.id)}
                                    className={cn(
                                        'p-5 rounded-xl border text-left transition-all flex flex-col justify-between gap-3 cursor-pointer',
                                        isActive
                                            ? 'bg-rhive-pink/10 border-rhive-pink shadow-[0_0_16px_rgba(236,2,139,0.25)]'
                                            : 'bg-black/70 border-gray-800 hover:border-gray-600 hover:bg-gray-950'
                                    )}
                                >
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2.5">
                                                <span className="p-2 rounded-lg bg-gray-900 border border-gray-800">
                                                    {card.icon}
                                                </span>
                                                <h3 className="text-sm font-black text-white font-sans">
                                                    {card.title}
                                                </h3>
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-400 font-mono leading-relaxed">
                                            {card.description}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between pt-2 border-t border-gray-800/70 text-[10px] font-mono">
                                        <span className={cn('font-bold', isActive ? 'text-rhive-pink' : 'text-gray-500')}>
                                            {card.countLabel}
                                        </span>
                                        <span className={cn(isActive ? 'text-white font-bold' : 'text-gray-500')}>
                                            {isActive ? 'Editing ●' : 'Configure →'}
                                        </span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* ── ACTIVE SECTION EDITOR WORKSPACE ─────────────────────────── */}
                <div className="bg-black/70 border border-gray-800 rounded-xl p-6 space-y-5">
                    {/* 1. CUSTOM FIELDS */}
                    {activeSection === 'fields' && (
                        <>
                            <div className="border-b border-gray-800 pb-4">
                                <h3 className="text-base font-black text-white">Custom Contact Fields</h3>
                                <p className="text-xs font-mono text-gray-400 mt-0.5">
                                    Add &amp; reorder the custom fields that appear on customer and contact profiles.
                                </p>
                            </div>

                            <form onSubmit={handleAddField} className="grid grid-cols-1 md:grid-cols-12 gap-3 p-4 bg-gray-950/80 border border-gray-800 rounded-lg items-end">
                                <div className="md:col-span-5">
                                    <label className="block text-[10px] font-mono uppercase text-gray-400 mb-1">Field Label</label>
                                    <input
                                        type="text"
                                        required
                                        value={newFieldLabel}
                                        onChange={e => setNewFieldLabel(e.target.value)}
                                        placeholder="e.g. Roof Pitch, Policy Number, Square Footage..."
                                        className="w-full bg-black/70 border border-gray-800 px-3 py-2 text-xs font-mono text-white rounded-lg focus:outline-none focus:border-rhive-pink"
                                    />
                                </div>
                                <div className="md:col-span-3">
                                    <label className="block text-[10px] font-mono uppercase text-gray-400 mb-1">Field Type</label>
                                    <select
                                        value={newFieldType}
                                        onChange={e => setNewFieldType(e.target.value as any)}
                                        className="w-full bg-black/70 border border-gray-800 px-3 py-2 text-xs font-mono text-white rounded-lg focus:outline-none focus:border-rhive-pink"
                                    >
                                        <option value="Text">Text</option>
                                        <option value="Number">Number</option>
                                        <option value="Date">Date</option>
                                        <option value="Dropdown">Dropdown</option>
                                        <option value="Phone">Phone</option>
                                        <option value="URL">URL</option>
                                    </select>
                                </div>
                                <div className="md:col-span-2 flex items-center gap-2 pb-1.5">
                                    <QuantumSwitch
                                        checked={newFieldRequired}
                                        onChange={() => setNewFieldRequired(p => !p)}
                                        label="Required field"
                                    />
                                    <span className="text-xs font-mono text-gray-300">Required</span>
                                </div>
                                <div className="md:col-span-2">
                                    <Button type="submit" variant="primary" size="sm" className="w-full flex items-center justify-center gap-1.5">
                                        <PlusIcon className="w-4 h-4" />
                                        Save
                                    </Button>
                                </div>
                            </form>

                            <div className="border border-gray-800 rounded-lg divide-y divide-gray-800/70 overflow-hidden">
                                {config.customFields.map((field, idx) => (
                                    <div key={field.id} className="p-3.5 bg-black/40 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                                        <div className="flex items-center gap-3">
                                            <div className="flex flex-col gap-0.5">
                                                <button
                                                    type="button"
                                                    disabled={idx === 0}
                                                    onClick={() => handleMoveField(idx, -1)}
                                                    className="px-1.5 py-0.5 rounded bg-gray-900 border border-gray-800 text-[10px] text-gray-400 hover:text-white disabled:opacity-30"
                                                >
                                                    ↑
                                                </button>
                                                <button
                                                    type="button"
                                                    disabled={idx === config.customFields.length - 1}
                                                    onClick={() => handleMoveField(idx, 1)}
                                                    className="px-1.5 py-0.5 rounded bg-gray-900 border border-gray-800 text-[10px] text-gray-400 hover:text-white disabled:opacity-30"
                                                >
                                                    ↓
                                                </button>
                                            </div>
                                            <div>
                                                <div className="font-sans font-bold text-sm text-white flex items-center gap-2">
                                                    {field.label}
                                                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-gray-900 border border-gray-700 text-rhive-gold">
                                                        {field.type}
                                                    </span>
                                                    {field.required && (
                                                        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-rhive-pink/15 text-rhive-pink border border-rhive-pink/30">
                                                            Required
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-2">
                                                <QuantumSwitch
                                                    checked={field.visibleOnContacts}
                                                    onChange={() => handleToggleFieldProp(field.id, 'visibleOnContacts')}
                                                    label={`Show ${field.label} on contacts`}
                                                />
                                                <span className="text-[11px] text-gray-400">Show on Contacts</span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteField(field.id)}
                                                className="px-2.5 py-1 rounded bg-gray-900 border border-gray-800 text-gray-400 hover:text-red-400 hover:border-red-500/40 text-[11px] font-bold"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {/* 2. CUSTOM STAGES */}
                    {activeSection === 'stages' && (
                        <>
                            <div className="border-b border-gray-800 pb-4">
                                <h3 className="text-base font-black text-white">Custom Workflow Stages</h3>
                                <p className="text-xs font-mono text-gray-400 mt-0.5">
                                    Build and reorder the exact pipeline stages your sales and production teams use.
                                </p>
                            </div>

                            <form onSubmit={handleAddStage} className="grid grid-cols-1 md:grid-cols-12 gap-3 p-4 bg-gray-950/80 border border-gray-800 rounded-lg items-end">
                                <div className="md:col-span-5">
                                    <label className="block text-[10px] font-mono uppercase text-gray-400 mb-1">Stage Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={newStageName}
                                        onChange={e => setNewStageName(e.target.value)}
                                        placeholder="e.g. Insurance Supplement Review"
                                        className="w-full bg-black/70 border border-gray-800 px-3 py-2 text-xs font-mono text-white rounded-lg focus:outline-none focus:border-rhive-pink"
                                    />
                                </div>
                                <div className="md:col-span-3">
                                    <label className="block text-[10px] font-mono uppercase text-gray-400 mb-1">Phase Category</label>
                                    <select
                                        value={newStageCategory}
                                        onChange={e => setNewStageCategory(e.target.value as any)}
                                        className="w-full bg-black/70 border border-gray-800 px-3 py-2 text-xs font-mono text-white rounded-lg focus:outline-none focus:border-rhive-pink"
                                    >
                                        <option value="Sales">Sales</option>
                                        <option value="Production">Production</option>
                                        <option value="Closeout">Closeout</option>
                                    </select>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-[10px] font-mono uppercase text-gray-400 mb-1">Badge Color</label>
                                    <div className="flex items-center gap-1.5 py-1.5">
                                        {['#ec028b', '#e2ab49', '#3b82f6', '#10b981', '#a855f7', '#f97316'].map(hex => (
                                            <button
                                                key={hex}
                                                type="button"
                                                onClick={() => setNewStageColor(hex)}
                                                className={cn(
                                                    'w-5 h-5 rounded-full border-2 transition-transform',
                                                    newStageColor === hex ? 'border-white scale-110' : 'border-transparent'
                                                )}
                                                style={{ backgroundColor: hex }}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <div className="md:col-span-2">
                                    <Button type="submit" variant="primary" size="sm" className="w-full flex items-center justify-center gap-1.5">
                                        <PlusIcon className="w-4 h-4" />
                                        Save
                                    </Button>
                                </div>
                            </form>

                            <div className="border border-gray-800 rounded-lg divide-y divide-gray-800/70 overflow-hidden">
                                {config.customStages.map((stage, idx) => (
                                    <div key={stage.id} className="p-3.5 bg-black/40 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                                        <div className="flex items-center gap-3">
                                            <div className="flex flex-col gap-0.5">
                                                <button
                                                    type="button"
                                                    disabled={idx === 0}
                                                    onClick={() => handleMoveStage(idx, -1)}
                                                    className="px-1.5 py-0.5 rounded bg-gray-900 border border-gray-800 text-[10px] text-gray-400 hover:text-white disabled:opacity-30"
                                                >
                                                    ↑
                                                </button>
                                                <button
                                                    type="button"
                                                    disabled={idx === config.customStages.length - 1}
                                                    onClick={() => handleMoveStage(idx, 1)}
                                                    className="px-1.5 py-0.5 rounded bg-gray-900 border border-gray-800 text-[10px] text-gray-400 hover:text-white disabled:opacity-30"
                                                >
                                                    ↓
                                                </button>
                                            </div>
                                            <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: stage.color }} />
                                            <div>
                                                <span className="font-sans font-bold text-sm text-white">{stage.name}</span>
                                                <span className="ml-2 px-2 py-0.5 rounded text-[10px] bg-gray-900 border border-gray-800 text-gray-400">
                                                    {stage.category}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-2">
                                                <QuantumSwitch
                                                    checked={stage.active}
                                                    onChange={() => handleToggleStageActive(stage.id)}
                                                    label={`Toggle ${stage.name}`}
                                                />
                                                <span className="text-[11px] text-gray-400">{stage.active ? 'Active' : 'Hidden'}</span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteStage(stage.id)}
                                                className="px-2.5 py-1 rounded bg-gray-900 border border-gray-800 text-gray-400 hover:text-red-400 hover:border-red-500/40 text-[11px] font-bold"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {/* 3. TAGS */}
                    {activeSection === 'tags' && (
                        <>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-800 pb-4">
                                <div>
                                    <h3 className="text-base font-black text-white">CRM Tags &amp; Auto-Creation</h3>
                                    <p className="text-xs font-mono text-gray-400 mt-0.5">
                                        Manage all contact &amp; lead tags, control auto-creation rules, and delete unwanted tags.
                                    </p>
                                </div>
                                <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-gray-950 border border-gray-800">
                                    <QuantumSwitch
                                        checked={config.autoCreateTags}
                                        onChange={() =>
                                            persistConfig(
                                                { ...config, autoCreateTags: !config.autoCreateTags },
                                                !config.autoCreateTags ? 'Enabled tag auto-creation' : 'Disabled tag auto-creation'
                                            )
                                        }
                                        label="Auto-create tags"
                                    />
                                    <span className="text-xs font-mono font-bold text-white">Auto-Create Tags</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                                <div className="md:col-span-5 relative">
                                    <SearchIcon className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="text"
                                        placeholder="Search existing tags..."
                                        value={tagSearch}
                                        onChange={e => setTagSearch(e.target.value)}
                                        className="w-full bg-black/70 border border-gray-800 pl-9 pr-3 py-2 text-xs font-mono text-white rounded-lg focus:outline-none focus:border-rhive-pink"
                                    />
                                </div>
                                <form onSubmit={handleAddTag} className="md:col-span-7 flex flex-wrap items-center gap-2">
                                    <input
                                        type="text"
                                        required
                                        placeholder="New tag name (e.g. Metal Standing Seam)..."
                                        value={newTagName}
                                        onChange={e => setNewTagName(e.target.value)}
                                        className="flex-1 min-w-[180px] bg-black/70 border border-gray-800 px-3 py-2 text-xs font-mono text-white rounded-lg focus:outline-none focus:border-rhive-pink"
                                    />
                                    <select
                                        value={newTagColor}
                                        onChange={e => setNewTagColor(e.target.value as any)}
                                        className="bg-black/70 border border-gray-800 px-2.5 py-2 text-xs font-mono text-white rounded-lg"
                                    >
                                        <option value="pink">Pink</option>
                                        <option value="gold">Gold</option>
                                        <option value="blue">Blue</option>
                                        <option value="green">Green</option>
                                        <option value="purple">Purple</option>
                                        <option value="amber">Amber</option>
                                    </select>
                                    <Button type="submit" variant="primary" size="sm" className="flex items-center gap-1">
                                        <PlusIcon className="w-4 h-4" />
                                        Save
                                    </Button>
                                </form>
                            </div>

                            <div className="flex flex-wrap gap-2.5 pt-2">
                                {filteredTags.length === 0 ? (
                                    <div className="w-full p-8 text-center text-xs font-mono text-gray-500 border border-gray-800 rounded-lg">
                                        No tags match your search.
                                    </div>
                                ) : (
                                    filteredTags.map(tag => (
                                        <div
                                            key={tag.id}
                                            className={cn(
                                                'inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-mono font-bold',
                                                TAG_COLOR_CLASSES[tag.color]
                                            )}
                                        >
                                            <span>#{tag.name}</span>
                                            <span className="text-[10px] opacity-75">({tag.usageCount})</span>
                                            {tag.autoCreated && (
                                                <span className="text-[9px] uppercase px-1 rounded bg-black/40 border border-current/20">
                                                    Auto
                                                </span>
                                            )}
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteTag(tag.id)}
                                                title={`Delete ${tag.name}`}
                                                className="ml-1 hover:text-white opacity-70 hover:opacity-100"
                                            >
                                                <XIcon className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </>
                    )}

                    {/* 4. APPOINTMENT STAGES */}
                    {activeSection === 'appointments' && (
                        <>
                            <div className="border-b border-gray-800 pb-4">
                                <h3 className="text-base font-black text-white">Appointment Types &amp; Stages</h3>
                                <p className="text-xs font-mono text-gray-400 mt-0.5">
                                    Customize each appointment type (inspections, estimates, signings) and the outcome stages for each type.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                                {/* Left: Appointment Types */}
                                <div className="lg:col-span-5 space-y-3">
                                    <form onSubmit={handleAddAppointmentType} className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            required
                                            placeholder="New appointment type..."
                                            value={newAptTypeName}
                                            onChange={e => setNewAptTypeName(e.target.value)}
                                            className="flex-1 bg-black/70 border border-gray-800 px-3 py-2 text-xs font-mono text-white rounded-lg focus:outline-none focus:border-rhive-pink"
                                        />
                                        <input
                                            type="number"
                                            min={15}
                                            step={15}
                                            value={newAptDuration}
                                            onChange={e => setNewAptDuration(Number(e.target.value))}
                                            className="w-16 bg-black/70 border border-gray-800 px-2 py-2 text-xs font-mono text-white rounded-lg text-center"
                                            title="Duration in minutes"
                                        />
                                        <Button type="submit" variant="primary" size="sm">
                                            Save
                                        </Button>
                                    </form>

                                    <div className="border border-gray-800 rounded-lg divide-y divide-gray-800/70 overflow-hidden">
                                        {config.appointmentTypes.map(apt => {
                                            const isSelected = activeApt?.id === apt.id;
                                            return (
                                                <div
                                                    key={apt.id}
                                                    onClick={() => setSelectedAptId(apt.id)}
                                                    className={cn(
                                                        'p-3.5 cursor-pointer flex items-center justify-between gap-2 transition-colors',
                                                        isSelected ? 'bg-rhive-pink/10 border-l-2 border-rhive-pink' : 'bg-black/40 hover:bg-gray-900/50'
                                                    )}
                                                >
                                                    <div>
                                                        <div className="font-sans font-bold text-sm text-white flex items-center gap-2">
                                                            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: apt.color }} />
                                                            {apt.name}
                                                        </div>
                                                        <div className="text-[11px] font-mono text-gray-400 mt-0.5">
                                                            {apt.durationMinutes} min • {apt.stages.length} stages
                                                        </div>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDeleteAppointmentType(apt.id);
                                                        }}
                                                        className="px-2 py-1 rounded bg-gray-900 border border-gray-800 text-[10px] font-mono text-gray-400 hover:text-red-400"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Right: Stages for selected appointment type */}
                                <div className="lg:col-span-7 bg-gray-950/80 border border-gray-800 rounded-lg p-4 space-y-4">
                                    {activeApt ? (
                                        <>
                                            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                                                <div>
                                                    <span className="text-[10px] font-mono uppercase text-gray-500">Stages For</span>
                                                    <h4 className="text-sm font-black text-white">{activeApt.name}</h4>
                                                </div>
                                                <span className="px-2.5 py-1 rounded bg-rhive-pink/15 text-rhive-pink border border-rhive-pink/30 text-[11px] font-mono font-bold">
                                                    {activeApt.durationMinutes} min default
                                                </span>
                                            </div>

                                            <form onSubmit={handleAddAptStage} className="flex items-center gap-2">
                                                <input
                                                    type="text"
                                                    required
                                                    placeholder="Add stage (e.g. Drone Photos Uploaded, Confirmed)..."
                                                    value={newAptStageLabel}
                                                    onChange={e => setNewAptStageLabel(e.target.value)}
                                                    className="flex-1 bg-black/70 border border-gray-800 px-3 py-2 text-xs font-mono text-white rounded-lg focus:outline-none focus:border-rhive-pink"
                                                />
                                                <Button type="submit" variant="primary" size="sm">
                                                    Save
                                                </Button>
                                            </form>

                                            <div className="flex flex-wrap gap-2">
                                                {activeApt.stages.map((st, idx) => (
                                                    <div
                                                        key={`${st}-${idx}`}
                                                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/60 border border-gray-700 text-xs font-mono text-white"
                                                    >
                                                        <span className="text-rhive-pink font-bold">{idx + 1}.</span>
                                                        <span>{st}</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveAptStage(st)}
                                                            className="text-gray-500 hover:text-red-400"
                                                        >
                                                            <XIcon className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    ) : (
                                        <div className="p-8 text-center text-xs font-mono text-gray-500">
                                            Add an appointment type on the left to customize its stages.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </PageContainer>
    );
};

export default CrmCustomizePage;
