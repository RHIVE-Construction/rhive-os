import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import { useMockDB } from '../contexts/MockDatabaseContext';
import {
    CheckCircleIcon,
    BuildingStorefrontIcon,
    MapPinIcon,
    CurrencyDollarIcon,
    SparklesIcon,
    ShieldCheckIcon,
    CalendarDaysIcon,
    Check,
} from '../components/icons';
import { projectService, firestoreService, userLogService } from '../lib/firebaseService';
import { PIPELINE, matchStageIndex } from '../components/ProjectStageLayout';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { cn } from '../lib/utils';
import {
    buildMilestonesForProject,
    PAYMENT_MODEL_LABELS,
    resolvePaymentModel,
} from '../lib/qosRules';

type PortalTab = 'projects' | 'properties' | 'payments' | 'abundance';

const DEFAULT_STAGE_SUBSTEPS: Record<string, string[]> = {
    Lead: ['Intake received', 'Property & roof profile verified', 'Specialist assigned'],
    Estimate: ['Aerial / LiDAR measurement complete', 'Building scope verified', 'Ballpark options prepared'],
    Quote: ['Certified inspection reviewed', 'Line-item quote finalized', 'Shopping cart & proposal ready'],
    'Sign & Verify': ['Digital agreement issued', 'Customer signature verified', 'Mobilization deposit confirmed'],
    Schedule: ['Municipal permit verified', 'Material PO confirmed', 'Certified crew scheduled'],
    'Pre-Installation': ['3-Day prep guide sent', 'Materials staged on site', 'Site & AC armor ready'],
    Install: ['Tear-off & deck inspection', 'Mid-roof inspection & underlayment', 'Primary roof system installed'],
    'Warranty Activation': ['Envelope QC audit passed', 'Triple magnetic nail sweep complete', 'Final inspection verified'],
    Invoicing: ['Mobilization deposit logged', 'Installation milestone verified', 'Final balance unlocks warranty'],
    Completed: ['Master Warranty certificate active', 'Paid-in-full receipt issued', 'Project archived'],
    'Past Customer': ['Annual roof health check active', 'Master Warranty active', 'Abundance Network ($500) active'],
};

const stageBadgeColor = (stage?: string) => {
    const s = (stage || '').toLowerCase();
    if (s.includes('lead')) return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
    if (s.includes('estimate')) return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    if (s.includes('quote')) return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30';
    if (s.includes('sign')) return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
    if (s.includes('schedule') || s.includes('pre-install')) return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
    if (s.includes('install')) return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
    if (s.includes('warranty') || s.includes('punch')) return 'bg-pink-500/20 text-pink-300 border-pink-500/30';
    if (s.includes('invoic')) return 'bg-green-500/20 text-green-300 border-green-500/30';
    if (s.includes('complet') || s.includes('past')) return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
    return 'bg-gray-700 text-gray-300 border-gray-600';
};

const CustomerDashboard: React.FC = () => {
    const { currentUser } = useMockDB();
    const [activeTab, setActiveTab] = useState<PortalTab>('projects');
    const [projects, setProjects] = useState<any[]>([]);
    const [properties, setProperties] = useState<any[]>([]);
    const [referrals, setReferrals] = useState<any[]>([]);
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // Abundance Network state
    const [abundanceOptIn, setAbundanceOptIn] = useState(false);
    const [programMode, setProgramMode] = useState<'Referral' | 'Fundraising'>('Referral');
    const [orgName, setOrgName] = useState('');
    const [refName, setRefName] = useState('');
    const [refPhone, setRefPhone] = useState('');
    const [refEmail, setRefEmail] = useState('');
    const [submittingRef, setSubmittingRef] = useState(false);
    const [toast, setToast] = useState<string | null>(null);

    useEffect(() => {
        const unsubProjects = projectService.subscribe((data: any[]) => {
            setProjects(data);
            setLoading(false);
        });
        const unsubProps = firestoreService.subscribeToDocuments('properties', (docs: any[]) => {
            setProperties(docs.filter((d) => !d.deleted));
        });
        const unsubRefs = firestoreService.subscribeToDocuments('referrals', (docs: any[]) => {
            setReferrals(docs.filter((d) => !d.deleted));
        });
        return () => {
            unsubProjects();
            unsubProps();
            unsubRefs();
        };
    }, []);

    if (!currentUser) return <div className="p-10 text-white">Sign in to view your Customer Portal.</div>;

    // Match projects strictly owned by or associated with the authenticated customer / corporate account
    const customerOwnedProjects = projects.filter((p) => {
        const uEmail = (currentUser.email || '').toLowerCase().trim();
        const uName = (currentUser.name || '').toLowerCase().trim();
        const pEmail = (p.email || p.customer_email || p.contact_email || p.primaryEmail || '').toLowerCase().trim();
        const pName = (p.name || p.customer_name || p.account_name || '').toLowerCase().trim();
        const contactMatch = Array.isArray(p.contacts)
            ? p.contacts.some((c: any) => uEmail && String(c.email || '').toLowerCase().trim() === uEmail)
            : false;
        return (
            p.owner_id === currentUser.id ||
            p.account_id === currentUser.id ||
            p.customer_id === currentUser.id ||
            contactMatch ||
            (uEmail && pEmail === uEmail) ||
            (uName && uName.length > 3 && pName.includes(uName))
        );
    });

    // Security Gate: Never expose non-test unrelated customer projects; allow [TEST] demo records only in local/bypass review
    const isDemoOrBypassSession =
        typeof window !== 'undefined' &&
        (window.location.hostname === 'localhost' ||
            window.location.search.includes('bypass=') ||
            String(currentUser.email || '').includes('rhive-test') ||
            String(currentUser.email || '').includes('example.com'));

    const visibleProjects =
        customerOwnedProjects.length > 0
            ? customerOwnedProjects
            : isDemoOrBypassSession
            ? projects.filter((p) => p.is_test || String(p.name || '').includes('[TEST]')).slice(0, 6)
            : [];

    const selectedProject =
        visibleProjects.find((p) => p.id === selectedProjectId) || visibleProjects[0] || null;

    // Associated properties (multi-property & multi-building ready)
    const ownedAccountIds = new Set<string>(
        [currentUser.id, ...visibleProjects.map((p) => p.account_id).filter(Boolean)]
    );
    const ownedPropIds = new Set<string>(visibleProjects.map((p) => p.property_id).filter(Boolean));
    const associatedProperties = properties.filter(
        (prop) =>
            ownedPropIds.has(prop.id) ||
            ownedAccountIds.has(prop.owner_id) ||
            ownedAccountIds.has(prop.account_id)
    );

    const activeQuoteProject = visibleProjects.find((p) => {
        const cs = (p.current_stage || '').toLowerCase();
        return cs.includes('quote') || cs.includes('sign');
    });

    const myReferrals = referrals.filter(
        (r) =>
            r.referrer_id === currentUser.id ||
            (currentUser.email && (r.referrer_email || '').toLowerCase() === currentUser.email.toLowerCase())
    );
    const isEnrolledInAbundance =
        abundanceOptIn ||
        myReferrals.length > 0 ||
        visibleProjects.some((p) => p.abundance_enrolled || p.abundance_network?.enrolled);

    const showBanner = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(null), 3500);
    };

    const handleApproveQuote = async (project: any) => {
        if (!project?.id) return;
        await projectService.updateRecord(
            project.id,
            {
                current_stage: 'Sign & Verify',
                quote: { ...(project.quote || {}), status: 'Approved' },
                pizza_tracker: {
                    ...(project.pizza_tracker || {}),
                    stage: 'Sign & Verify',
                    current_stage: 'Sign & Verify',
                    updated_at: new Date().toISOString(),
                },
            },
            project._source
        );
        await userLogService.logAction(
            'STAGE_CHANGE',
            `Customer approved quote for "${project.name}" from Client Portal`,
            {
                recordId: project.id,
                recordName: project.name || 'Project',
                collection: project._source || 'projects',
                stage: 'Sign & Verify',
            }
        );
        showBanner('Quote approved! Moving to Sign & Verify.');
    };

    const handleAbundanceEnroll = async () => {
        setAbundanceOptIn(true);
        if (selectedProject?.id) {
            const nowIso = new Date().toISOString();
            await projectService.updateRecord(
                selectedProject.id,
                {
                    abundance_enrolled: true,
                    abundance_mode: programMode,
                    abundance_org: orgName || undefined,
                    abundance_network: {
                        enrolled: true,
                        mode: programMode,
                        organization: orgName || '',
                        enrolledAt: nowIso,
                    },
                },
                selectedProject._source
            );
        }
        await userLogService.logAction(
            'EDIT_RECORD',
            `${currentUser.name} opted into Abundance Network (${programMode})`,
            {
                recordId: selectedProject?.id || currentUser.id,
                recordName: selectedProject?.name || currentUser.name,
                collection: 'projects',
                mode: programMode,
                organization: orgName,
            }
        );
        showBanner('Enrolled in the RHIVE Abundance Network!');
    };

    const handleSendReferral = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!refName.trim() || !refPhone.trim()) return;
        setSubmittingRef(true);
        try {
            const refId = `ref-${Date.now()}`;
            const nowIso = new Date().toISOString();
            await setDoc(doc(db, 'referrals', refId), {
                id: refId,
                project_id: selectedProject?.id || null,
                referrer_id: currentUser.id,
                referrer_name: currentUser.name,
                referrer_email: currentUser.email || '',
                program_mode: programMode,
                fundraising_org: programMode === 'Fundraising' ? orgName : '',
                friend_name: refName.trim(),
                friend_phone: refPhone.trim(),
                friend_email: refEmail.trim(),
                reward_amount: 500,
                status: 'Submitted — Verification Pending',
                created_at: nowIso,
            });
            await userLogService.logAction(
                'RECORD_CREATED',
                `Abundance Network referral submitted for ${refName.trim()}`,
                {
                    recordId: refId,
                    recordName: refName.trim(),
                    collection: 'referrals',
                    mode: programMode,
                }
            );
            setAbundanceOptIn(true);
            setRefName('');
            setRefPhone('');
            setRefEmail('');
            showBanner('Referral submitted! Track your $500 reward below.');
        } finally {
            setSubmittingRef(false);
        }
    };

    const getAddress = (project: any): string => {
        return (
            [project?.property_address || project?.property?.address, project?.property?.city, project?.property?.state]
                .filter(Boolean)
                .join(', ') || 'Address on file'
        );
    };

    // Polymorphic Payment Milestones (Customer-Safe: zero internal cost floor exposure)
    const baseContract = Number(selectedProject?.quote?.total || 0);
    const awoApproved = Array.isArray(selectedProject?.awos)
        ? selectedProject.awos
              .filter((a: any) => !a.status || a.status === 'Approved')
              .reduce((s: number, a: any) => s + Number(a.amount || 0), 0)
        : 0;
    const creditAdj = Number(selectedProject?.invoicing?.creditAdjustment || 0);
    const grandTotal = Math.max(0, baseContract + awoApproved - creditAdj);
    const paymentModel = resolvePaymentModel(selectedProject);
    const milestones = selectedProject ? buildMilestonesForProject(selectedProject, grandTotal) : [];
    const paidTotal = milestones.reduce((s, m) => s + (m.paid ? Number(m.amount || 0) : 0), 0);
    const remainingBalance = Math.max(0, grandTotal - paidTotal);
    const isWarrantyUnlocked =
        Boolean(selectedProject?.warranty_certificate?.active) ||
        selectedProject?.invoicing?.status === 'paid' ||
        (grandTotal > 0 && remainingBalance === 0 && matchStageIndex(selectedProject?.current_stage) >= 8);

    const activeStageIdx = Math.max(0, matchStageIndex(selectedProject?.current_stage));
    const activeStageLabel = PIPELINE[activeStageIdx]?.stage || 'Lead';

    // Hydrate live subSteps from ops stages (with done checkmarks) or fall back to stage defaults
    const rawSubSteps = selectedProject?.pizza_tracker?.subSteps;
    const normalizedSubSteps: Array<{ label: string; done: boolean }> =
        Array.isArray(rawSubSteps) && rawSubSteps.length > 0
            ? rawSubSteps.map((s: any, idx: number) =>
                  typeof s === 'string'
                      ? { label: s, done: idx === 0 }
                      : { label: String(s.label || s.task || `Step ${idx + 1}`), done: Boolean(s.done) }
              )
            : (
                  PIPELINE[activeStageIdx]?.defaultSubSteps ||
                  DEFAULT_STAGE_SUBSTEPS[activeStageLabel] ||
                  DEFAULT_STAGE_SUBSTEPS['Lead']
              ).map((label: string, idx: number) => ({ label, done: idx === 0 }));

    const scheduledInstallDate =
        selectedProject?.ops_schedule?.installDate ||
        selectedProject?.ops_schedule?.install_date ||
        selectedProject?.pizza_tracker?.installDate ||
        selectedProject?.install_date ||
        '';

    const customTrackerNote =
        selectedProject?.pizza_tracker?.note ||
        selectedProject?.ops_schedule?.permitNote ||
        selectedProject?.ops_schedule?.customer_note ||
        '';

    return (
        <div className="h-full flex flex-col text-white">
            <header className="p-4 md:px-8 flex flex-wrap justify-between items-center gap-4 border-b border-gray-800 bg-black/80 backdrop-blur-md shrink-0">
                <div>
                    <h1 className="text-xl font-bold tracking-tight">RHIVE Customer Portal</h1>
                    <p className="text-xs text-gray-400">
                        Simple Project Tracking, Properties, Payments &amp; Abundance Network
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <div
                        className={cn(
                            'flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest',
                            loading ? 'text-yellow-400 animate-pulse' : 'text-green-400'
                        )}
                    >
                        <span className={cn('w-1.5 h-1.5 rounded-full', loading ? 'bg-yellow-400' : 'bg-green-400')} />
                        {loading ? 'Syncing…' : 'Live'}
                    </div>
                    <span className="text-sm text-gray-300 font-medium">Welcome, {currentUser.name}</span>
                </div>
            </header>

            {toast && (
                <div className="mx-6 mt-4 p-3 rounded-xl bg-[#ec028b]/15 border border-[#ec028b] text-white text-xs font-bold flex items-center justify-between">
                    <span>{toast}</span>
                    <button onClick={() => setToast(null)} className="text-gray-300 hover:text-white">
                        Close
                    </button>
                </div>
            )}

            {/* KISS Navigation Tabs — Highlighted when selected, un-highlighted when not */}
            <div className="px-6 md:px-10 pt-5 border-b border-gray-800/80 bg-black/40 flex gap-2 overflow-x-auto pb-3 shrink-0">
                {[
                    {
                        id: 'projects' as PortalTab,
                        label: `Projects & Tracker (${visibleProjects.length})`,
                        domId: 'portal-tab-projects',
                    },
                    {
                        id: 'properties' as PortalTab,
                        label: `Properties & Buildings (${associatedProperties.length || 1})`,
                        domId: 'portal-tab-properties',
                    },
                    {
                        id: 'payments' as PortalTab,
                        label: 'Payments (50 / 40 / 10)',
                        domId: 'portal-tab-payments',
                    },
                    {
                        id: 'abundance' as PortalTab,
                        label: 'Abundance Network ($500)',
                        domId: 'portal-tab-abundance',
                    },
                ].map((tab) => {
                    const selected = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            id={tab.domId}
                            type="button"
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                'px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all whitespace-nowrap',
                                selected
                                    ? 'border-[#ec028b] bg-[#ec028b]/15 text-white shadow-[0_0_14px_rgba(236,2,139,0.35)]'
                                    : 'border-gray-800 bg-gray-900/40 text-gray-400 hover:text-white hover:border-gray-700'
                            )}
                        >
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            <main className="p-6 md:p-10 flex-1 overflow-y-auto space-y-8">
                {/* TAB 1: PROJECTS & LIVE PIZZA TRACKER */}
                {activeTab === 'projects' && (
                    <>
                        {visibleProjects.length === 0 && !loading && (
                            <Card title="No Active Projects Found">
                                <p className="text-sm text-gray-400">
                                    We could not find an active project linked to {currentUser.email || currentUser.name}.
                                    Contact RHIVE Construction at (801) 441-0024 to link your property profile.
                                </p>
                            </Card>
                        )}

                        {visibleProjects.length > 1 && (
                            <div className="space-y-2">
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                                    Select Active Project ({visibleProjects.length} Open)
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {visibleProjects.map((p) => {
                                        const isSel = selectedProject?.id === p.id;
                                        return (
                                            <button
                                                key={p.id}
                                                type="button"
                                                onClick={() => setSelectedProjectId(p.id)}
                                                className={cn(
                                                    'px-3.5 py-2 rounded-xl border text-left transition-all',
                                                    isSel
                                                        ? 'border-[#ec028b] bg-[#ec028b]/15 text-white shadow-[0_0_12px_rgba(236,2,139,0.3)]'
                                                        : 'border-gray-800 bg-gray-900/40 text-gray-400 hover:text-white'
                                                )}
                                            >
                                                <span className="text-xs font-bold block">{p.name || 'Project'}</span>
                                                <span className="text-[10px] font-mono text-gray-400">
                                                    {p.current_stage || 'Lead'}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {selectedProject && (
                            <Card
                                title={`Live Project Tracker: ${selectedProject.name || 'Roof Project'}`}
                                className="border-gray-800"
                            >
                                <div className="space-y-6">
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                        <p className="text-xs text-gray-400 font-mono flex items-center gap-1.5">
                                            <MapPinIcon className="w-4 h-4 text-[#ec028b]" />
                                            {getAddress(selectedProject)}
                                        </p>
                                        <div className="flex flex-wrap items-center gap-2">
                                            {selectedProject.job_number && (
                                                <span className="text-[10px] font-mono text-gray-400 px-2.5 py-1 rounded-full bg-gray-900 border border-gray-800">
                                                    {selectedProject.job_number}
                                                </span>
                                            )}
                                            <span
                                                className={cn(
                                                    'text-[10px] px-3 py-1 rounded-full border font-black uppercase tracking-widest',
                                                    stageBadgeColor(activeStageLabel)
                                                )}
                                            >
                                                Step {activeStageIdx + 1} of {PIPELINE.length}: {activeStageLabel}
                                            </span>
                                        </div>
                                    </div>

                                    {/* 11-Step Horizontal Pizza Tracker */}
                                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-11 gap-2">
                                        {PIPELINE.map((st, idx) => {
                                            const passed = idx < activeStageIdx;
                                            const current = idx === activeStageIdx;
                                            return (
                                                <div
                                                    key={st.pageId}
                                                    className={cn(
                                                        'p-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center min-h-[68px]',
                                                        current
                                                            ? 'border-[#ec028b] bg-[#ec028b]/15 text-white shadow-[0_0_12px_rgba(236,2,139,0.3)]'
                                                            : passed
                                                            ? 'border-green-500/40 bg-green-500/10 text-green-300'
                                                            : 'border-gray-800 bg-black/40 text-gray-500'
                                                    )}
                                                >
                                                    <div className="text-[10px] font-mono font-bold mb-1">
                                                        {passed ? '✓' : idx + 1}
                                                    </div>
                                                    <div className="text-[10px] font-bold leading-tight">{st.stage}</div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Current Stage Live Sub-Steps + Wednesday Heartbeat */}
                                    <div className="p-4 rounded-xl bg-gray-900/60 border border-gray-800 space-y-3">
                                        <div className="flex flex-wrap items-center justify-between gap-2">
                                            <p className="text-xs font-black uppercase tracking-widest text-[#ec028b]">
                                                Live Steps in {activeStageLabel}
                                            </p>
                                            {scheduledInstallDate && (
                                                <span className="text-xs font-mono text-cyan-300 flex items-center gap-1">
                                                    <CalendarDaysIcon className="w-3.5 h-3.5" />
                                                    Scheduled Window: {scheduledInstallDate}
                                                </span>
                                            )}
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                            {normalizedSubSteps.map((stepObj, idx) => (
                                                <div
                                                    key={`${stepObj.label}-${idx}`}
                                                    className={cn(
                                                        'p-3 rounded-lg border flex items-center gap-2.5 text-xs',
                                                        stepObj.done
                                                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                                                            : 'bg-black/50 border-gray-800 text-gray-300'
                                                    )}
                                                >
                                                    <span
                                                        className={cn(
                                                            'w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-bold shrink-0',
                                                            stepObj.done
                                                                ? 'bg-emerald-500 border-emerald-400 text-black'
                                                                : 'bg-[#ec028b]/20 border-[#ec028b] text-[#ec028b]'
                                                        )}
                                                    >
                                                        {stepObj.done ? '✓' : idx + 1}
                                                    </span>
                                                    <span>{stepObj.label}</span>
                                                </div>
                                            ))}
                                        </div>
                                        {customTrackerNote && (
                                            <div className="text-xs text-cyan-200 bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3 font-mono">
                                                Proactive RHIVE Update: {customTrackerNote}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        )}

                        {activeQuoteProject && activeQuoteProject.quote && (
                            <Card title={`Quote Ready: ${activeQuoteProject.name}`} className="border-[#ec028b]">
                                <div className="space-y-4">
                                    <p className="text-gray-400 text-sm">{getAddress(activeQuoteProject)}</p>
                                    <div className="bg-gray-900/60 p-5 rounded-xl border border-gray-800">
                                        <p className="text-base font-bold mb-1">Review Your Certified Proposal</p>
                                        <p className="text-gray-400 text-xs mb-4">
                                            Review line items below or open your interactive Shopping Cart link to
                                            customize options and e-sign.
                                        </p>
                                        <ul className="space-y-2 mb-5 border-t border-b border-gray-800 py-4">
                                            {(activeQuoteProject.quote.items || []).map((item: any, i: number) => (
                                                <li key={i} className="flex justify-between text-sm">
                                                    <span>{item.name || item.description || 'Roofing Scope'}</span>
                                                    <span className="font-mono">
                                                        $
                                                        {Number(
                                                            item.price ?? item.cost ?? item.total ?? 0
                                                        ).toLocaleString()}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                        <div className="flex flex-wrap justify-between items-center gap-4">
                                            <span className="text-2xl font-bold text-[#ec028b] font-mono">
                                                Total: ${Number(activeQuoteProject.quote.total || 0).toLocaleString()}
                                            </span>
                                            <div className="flex items-center gap-3">
                                                {activeQuoteProject.shopping_cart_url && (
                                                    <a
                                                        href={activeQuoteProject.shopping_cart_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="px-4 py-2 rounded-lg border border-gray-700 bg-black text-xs font-bold uppercase tracking-wider text-white hover:border-[#ec028b]"
                                                    >
                                                        Shopping Cart
                                                    </a>
                                                )}
                                                {activeQuoteProject.quote.status === 'Approved' ? (
                                                    <span className="px-4 py-2 bg-green-500/20 text-green-400 rounded-full border border-green-500/50 font-bold flex items-center gap-2 text-xs">
                                                        <CheckCircleIcon className="w-4 h-4" />
                                                        Approved
                                                    </span>
                                                ) : (
                                                    <Button
                                                        id="btn-approve-quote"
                                                        size="lg"
                                                        className="flex items-center gap-2"
                                                        onClick={() => handleApproveQuote(activeQuoteProject)}
                                                    >
                                                        <CheckCircleIcon className="w-5 h-5" />
                                                        Confirm
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        )}
                    </>
                )}

                {/* TAB 2: PROPERTIES & BUILDINGS */}
                {activeTab === 'properties' && (
                    <div className="space-y-6">
                        <p className="text-sm text-gray-400">
                            View every property and building associated with your account, along with active or
                            historical projects.
                        </p>
                        {associatedProperties.length === 0 ? (
                            <Card title={getAddress(selectedProject)}>
                                <p className="text-xs text-gray-400">
                                    {(selectedProject?.buildings || []).length || 1} building structure(s) registered
                                    under your project profile.
                                </p>
                            </Card>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {associatedProperties.map((prop) => {
                                    const propTitle =
                                        prop.name || prop.Property_Name || prop.address_full || 'Property';
                                    const bldgs = Array.isArray(prop.buildings) ? prop.buildings : [];
                                    const propProjects = visibleProjects.filter((p) => p.property_id === prop.id);
                                    return (
                                        <Card key={prop.id} title={propTitle}>
                                            <div className="space-y-4">
                                                <p className="text-xs text-gray-400 font-mono flex items-center gap-1.5">
                                                    <MapPinIcon className="w-3.5 h-3.5 text-[#ec028b]" />
                                                    {prop.address_full ||
                                                        [prop.property_address, prop.city, prop.state]
                                                            .filter(Boolean)
                                                            .join(', ')}
                                                </p>
                                                {bldgs.length > 0 && (
                                                    <div className="space-y-2">
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                                                            Buildings ({bldgs.length})
                                                        </p>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                            {bldgs.map((b: any, i: number) => (
                                                                <div
                                                                    key={b.id || i}
                                                                    className="p-2.5 rounded-lg bg-black/50 border border-gray-800 flex items-center justify-between text-xs"
                                                                >
                                                                    <span className="font-bold text-white flex items-center gap-1.5 truncate">
                                                                        <BuildingStorefrontIcon className="w-3.5 h-3.5 text-[#ec028b] shrink-0" />
                                                                        {b.name}
                                                                    </span>
                                                                    {b.roof_sqft && (
                                                                        <span className="text-[10px] font-mono text-gray-400">
                                                                            {Number(b.roof_sqft).toLocaleString()} sf
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                                {propProjects.length > 0 && (
                                                    <div className="pt-3 border-t border-gray-800 space-y-1.5">
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                                                            Open Projects ({propProjects.length})
                                                        </p>
                                                        {propProjects.map((pp) => (
                                                            <button
                                                                key={pp.id}
                                                                type="button"
                                                                onClick={() => {
                                                                    setSelectedProjectId(pp.id);
                                                                    setActiveTab('projects');
                                                                }}
                                                                className="w-full p-2 rounded bg-gray-900/60 border border-gray-800 hover:border-[#ec028b] flex items-center justify-between text-xs"
                                                            >
                                                                <span className="font-bold text-white">{pp.name}</span>
                                                                <span className="text-[#ec028b] font-mono text-[10px] uppercase">
                                                                    {pp.current_stage} →
                                                                </span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </Card>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {/* TAB 3: PAYMENTS & MASTER WARRANTY STATUS */}
                {activeTab === 'payments' && (
                    <div className="space-y-6">
                        <Card title={`Payment Schedule — ${selectedProject?.name || 'Active Project'}`}>
                            <div className="space-y-4">
                                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-gray-800">
                                    <span className="text-xs text-gray-400">
                                        Payment Structure:{' '}
                                        <strong className="text-white">{PAYMENT_MODEL_LABELS[paymentModel]}</strong>
                                    </span>
                                    <span
                                        className={cn(
                                            'px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border flex items-center gap-1.5',
                                            isWarrantyUnlocked
                                                ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40'
                                                : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                                        )}
                                    >
                                        <ShieldCheckIcon className="w-3.5 h-3.5" />
                                        {isWarrantyUnlocked
                                            ? 'Master Warranty Active (Paid in Full)'
                                            : 'Master Warranty Unlocks Upon $0.00 Balance'}
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="p-4 rounded-xl bg-gray-900/50 border border-gray-800">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                                            Base Contract
                                        </p>
                                        <p className="text-xl font-black font-mono text-white mt-1">
                                            ${baseContract.toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="p-4 rounded-xl bg-gray-900/50 border border-gray-800">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                                            Approved Change Orders / Credits
                                        </p>
                                        <p className="text-xl font-black font-mono text-[#e2ab49] mt-1">
                                            {awoApproved - creditAdj >= 0 ? '+' : '-'}$
                                            {Math.abs(awoApproved - creditAdj).toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="p-4 rounded-xl bg-gray-900/50 border border-[#ec028b]/40">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-[#ec028b]">
                                            Total Project Value
                                        </p>
                                        <p className="text-xl font-black font-mono text-white mt-1">
                                            ${grandTotal.toLocaleString()}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-3 pt-2">
                                    {milestones.map((m) => (
                                        <div
                                            key={m.key}
                                            className={cn(
                                                'p-4 rounded-xl border flex flex-wrap items-center justify-between gap-4',
                                                m.paid
                                                    ? 'border-green-500/40 bg-green-500/10'
                                                    : 'border-gray-800 bg-black/50'
                                            )}
                                        >
                                            <div className="flex items-center gap-3">
                                                <CurrencyDollarIcon
                                                    className={cn('w-5 h-5', m.paid ? 'text-green-400' : 'text-[#ec028b]')}
                                                />
                                                <div>
                                                    <p className="text-sm font-bold text-white">{m.label}</p>
                                                    <p className="text-xs text-gray-400 font-mono">
                                                        {m.paid ? 'Verified Paid' : `${m.percent}% Scheduled Milestone`}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-lg font-mono font-black text-white">
                                                    ${Number(m.amount || 0).toLocaleString()}
                                                </span>
                                                <span
                                                    className={cn(
                                                        'px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border',
                                                        m.paid
                                                            ? 'bg-green-500/20 text-green-300 border-green-500/40'
                                                            : 'bg-gray-900 text-gray-400 border-gray-700'
                                                    )}
                                                >
                                                    {m.paid ? 'Paid' : 'Pending'}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Card>
                    </div>
                )}

                {/* TAB 4: ABUNDANCE NETWORK ($500 REFERRAL & FUNDRAISING) */}
                {activeTab === 'abundance' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card title="RHIVE Abundance Network — $500 Per Roof">
                            <div className="space-y-5">
                                <p className="text-sm text-gray-300 leading-relaxed">
                                    Earn <strong className="text-[#ec028b]">$500</strong> for every completed roof
                                    replacement referral — or direct{' '}
                                    <strong className="text-[#e2ab49]">$500 per roof</strong> directly to a school,
                                    youth team, church, or local charity fundraiser.
                                </p>

                                <div className="grid grid-cols-2 gap-3">
                                    {(['Referral', 'Fundraising'] as const).map((mode) => {
                                        const active = programMode === mode;
                                        return (
                                            <button
                                                key={mode}
                                                type="button"
                                                onClick={() => setProgramMode(mode)}
                                                className={cn(
                                                    'p-3.5 rounded-xl border text-left transition-all',
                                                    active
                                                        ? 'border-[#ec028b] bg-[#ec028b]/15 text-white shadow-[0_0_12px_rgba(236,2,139,0.3)]'
                                                        : 'border-gray-800 bg-black/50 text-gray-400 hover:text-white'
                                                )}
                                            >
                                                <p className="text-xs font-black uppercase tracking-wider">
                                                    {mode === 'Referral'
                                                        ? 'Personal Affiliate ($500)'
                                                        : 'Youth / Charity Fundraising'}
                                                </p>
                                                <p className="text-[11px] text-gray-400 mt-1">
                                                    {mode === 'Referral'
                                                        ? 'Direct payout upon warranty activation.'
                                                        : 'Sponsor your local team, school, or cause.'}
                                                </p>
                                            </button>
                                        );
                                    })}
                                </div>

                                {programMode === 'Fundraising' && (
                                    <div>
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1">
                                            Organization / Team Name
                                        </label>
                                        <input
                                            type="text"
                                            value={orgName}
                                            onChange={(e) => setOrgName(e.target.value)}
                                            placeholder="e.g. Corner Canyon High Robotics / Local Charity"
                                            className="w-full bg-black border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:border-[#ec028b] focus:outline-none"
                                        />
                                    </div>
                                )}

                                {!isEnrolledInAbundance ? (
                                    <Button
                                        id="portal-abundance-optin-btn"
                                        onClick={handleAbundanceEnroll}
                                        className="w-full flex items-center justify-center gap-2"
                                    >
                                        <SparklesIcon className="w-4 h-4" />
                                        Confirm
                                    </Button>
                                ) : (
                                    <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/40 text-green-300 text-xs font-bold flex items-center gap-2">
                                        <ShieldCheckIcon className="w-4 h-4 shrink-0" />
                                        Active Member — Your Abundance Network tracker is live!
                                    </div>
                                )}

                                <form onSubmit={handleSendReferral} className="space-y-3 pt-4 border-t border-gray-800">
                                    <p className="text-xs font-black uppercase tracking-widest text-white">
                                        Submit a Referral
                                    </p>
                                    <input
                                        required
                                        type="text"
                                        value={refName}
                                        onChange={(e) => setRefName(e.target.value)}
                                        placeholder="Neighbor or Property Manager Name"
                                        className="w-full bg-black border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:border-[#ec028b] focus:outline-none"
                                    />
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <input
                                            required
                                            type="text"
                                            value={refPhone}
                                            onChange={(e) => setRefPhone(e.target.value)}
                                            placeholder="Phone Number"
                                            className="w-full bg-black border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:border-[#ec028b] focus:outline-none"
                                        />
                                        <input
                                            type="email"
                                            value={refEmail}
                                            onChange={(e) => setRefEmail(e.target.value)}
                                            placeholder="Email (Optional)"
                                            className="w-full bg-black border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:border-[#ec028b] focus:outline-none"
                                        />
                                    </div>
                                    <Button type="submit" disabled={submittingRef} className="w-full">
                                        {submittingRef ? 'Sending...' : 'Send'}
                                    </Button>
                                </form>
                            </div>
                        </Card>

                        <Card title={`Your Abundance Network Updates (${myReferrals.length})`}>
                            {!isEnrolledInAbundance ? (
                                <p className="text-xs text-gray-500 italic py-8 text-center">
                                    Opt in on the left to activate live referral &amp; fundraising payout tracking in
                                    your portal.
                                </p>
                            ) : myReferrals.length === 0 ? (
                                <div className="p-6 text-center space-y-2">
                                    <Check className="w-8 h-8 text-[#ec028b] mx-auto" />
                                    <p className="text-sm font-bold text-white">Account Enrolled &amp; Ready</p>
                                    <p className="text-xs text-gray-400">
                                        Submit your first referral to track inspection, installation, and your $500
                                        reward payout right here.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {myReferrals.map((r) => (
                                        <div
                                            key={r.id}
                                            className="p-4 rounded-xl bg-gray-900/50 border border-gray-800 flex items-center justify-between gap-3"
                                        >
                                            <div>
                                                <p className="text-sm font-bold text-white">{r.friend_name}</p>
                                                <p className="text-[11px] text-gray-400 font-mono">
                                                    {r.program_mode === 'Fundraising' && r.fundraising_org
                                                        ? `Fundraiser: ${r.fundraising_org}`
                                                        : 'Personal Referral'}
                                                </p>
                                                <p className="text-[10px] text-[#ec028b] font-bold uppercase mt-1">
                                                    {r.status || 'Submitted'}
                                                </p>
                                            </div>
                                            <span className="text-base font-mono font-black text-[#e2ab49]">
                                                ${Number(r.reward_amount || 500).toLocaleString()}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </Card>
                    </div>
                )}
            </main>
        </div>
    );
};

export default CustomerDashboard;
