import React, { useState, useEffect } from 'react';
import PageContainer from '../components/PageContainer';
import Card from '../components/Card';
import Button from '../components/Button';
import { useMockDB } from '../contexts/MockDatabaseContext';
import { projectService, firestoreService, userLogService } from '../lib/firebaseService';
import { SparklesIcon, CheckCircleIcon, TruckIcon } from '../components/icons';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { cn } from '../lib/utils';

const SupplierHomepage: React.FC = () => {
    const { currentUser } = useMockDB();
    const [tab, setTab] = useState<'orders' | 'abundance'>('orders');
    const [projects, setProjects] = useState<any[]>([]);
    const [referrals, setReferrals] = useState<any[]>([]);
    const [optedIn, setOptedIn] = useState(false);
    const [refName, setRefName] = useState('');
    const [refPhone, setRefPhone] = useState('');
    const [banner, setBanner] = useState('');

    useEffect(() => {
        const unsubP = projectService.subscribe((docs: any[]) => setProjects(docs));
        const unsubR = firestoreService.subscribeToDocuments('referrals', (docs: any[]) =>
            setReferrals(docs.filter((d) => !d.deleted))
        );
        return () => {
            unsubP();
            unsubR();
        };
    }, []);

    const materialOrders = projects.filter(
        (p) =>
            p.ops_schedule?.poNumber ||
            ['Schedule', 'Pre-Installation', 'Install'].includes(String(p.current_stage || ''))
    );

    const myReferrals = referrals.filter(
        (r) =>
            r.referrer_id === currentUser?.id ||
            (currentUser?.email && (r.referrer_email || '').toLowerCase() === currentUser.email.toLowerCase())
    );

    const handleConfirmDelivery = async (project: any) => {
        if (!project?.id) return;
        await projectService.updateRecord(
            project.id,
            {
                ops_schedule: {
                    ...(project.ops_schedule || {}),
                    materials: true,
                    supplierConfirmedAt: new Date().toISOString(),
                },
            },
            project._source
        );
        await userLogService.logAction(
            'EDIT_RECORD',
            `Supplier confirmed rooftop material PO delivery for ${project.name}`,
            {
                recordId: project.id,
                recordName: project.name || 'Project',
                collection: project._source || 'projects',
                stage: project.current_stage,
            }
        );
        setBanner(`Confirmed material PO dispatch for ${project.name}`);
    };

    const handleSubmitReferral = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!refName.trim() || !refPhone.trim()) return;
        const refId = `ref-sup-${Date.now()}`;
        await setDoc(doc(db, 'referrals', refId), {
            id: refId,
            referrer_id: currentUser?.id || 'supplier',
            referrer_name: currentUser?.name || 'Supplier Partner',
            referrer_email: currentUser?.email || '',
            program_mode: 'Referral',
            friend_name: refName.trim(),
            friend_phone: refPhone.trim(),
            reward_amount: 500,
            status: 'Submitted — Verification Pending',
            created_at: new Date().toISOString(),
        });
        await userLogService.logAction('RECORD_CREATED', `Supplier referral submitted for ${refName.trim()}`, {
            recordId: refId,
            recordName: refName.trim(),
            collection: 'referrals',
        });
        setOptedIn(true);
        setRefName('');
        setRefPhone('');
        setBanner('Supplier Abundance Network ($500) referral submitted!');
    };

    return (
        <PageContainer
            title="Supplier Portal"
            description="Live RHIVE Purchase Orders, Rooftop Delivery Windows, and Abundance Network."
        >
            <div className="space-y-6">
                {banner && (
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2">
                        <CheckCircleIcon className="w-4 h-4" />
                        <span>{banner}</span>
                    </div>
                )}

                <div className="flex gap-2">
                    <button
                        id="supplier-tab-orders"
                        type="button"
                        onClick={() => setTab('orders')}
                        className={cn(
                            'px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all',
                            tab === 'orders'
                                ? 'border-[#ec028b] bg-[#ec028b]/15 text-white shadow-[0_0_12px_rgba(236,2,139,0.3)]'
                                : 'border-gray-800 bg-gray-900/50 text-gray-400'
                        )}
                    >
                        Active Material POs ({materialOrders.length})
                    </button>
                    <button
                        id="supplier-tab-abundance"
                        type="button"
                        onClick={() => setTab('abundance')}
                        className={cn(
                            'px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all',
                            tab === 'abundance'
                                ? 'border-[#ec028b] bg-[#ec028b]/15 text-white shadow-[0_0_12px_rgba(236,2,139,0.3)]'
                                : 'border-gray-800 bg-gray-900/50 text-gray-400'
                        )}
                    >
                        Abundance Network ($500)
                    </button>
                </div>

                {tab === 'orders' ? (
                    <Card title="Active RHIVE Purchase Orders & Rooftop Drop Schedule">
                        {materialOrders.length === 0 ? (
                            <p className="text-gray-400 text-sm py-8 text-center">
                                No open material purchase orders queued right now.
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {materialOrders.map((proj) => {
                                    const confirmed = Boolean(proj.ops_schedule?.materials);
                                    return (
                                        <div
                                            key={proj.id}
                                            className="flex flex-wrap items-center justify-between gap-4 bg-gray-900/50 p-4 rounded-xl border border-gray-800"
                                        >
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <TruckIcon className="w-4 h-4 text-[#ec028b]" />
                                                    <p className="font-bold text-white text-sm">{proj.name}</p>
                                                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black border border-gray-700 text-cyan-300">
                                                        {proj.ops_schedule?.poNumber || 'PO-PENDING'}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-400">
                                                    {proj.property_address || 'Utah Job Site'} · Drop Target:{' '}
                                                    <span className="font-mono text-white">
                                                        {proj.ops_schedule?.installDate || proj.install_date || 'TBD'}
                                                    </span>
                                                    {proj.color_lock ? ` · Color: ${proj.color_lock}` : ''}
                                                </p>
                                            </div>
                                            <Button
                                                id={`supplier-confirm-po-${proj.id}`}
                                                variant={confirmed ? 'secondary' : 'primary'}
                                                size="sm"
                                                onClick={() => handleConfirmDelivery(proj)}
                                            >
                                                {confirmed ? 'Confirmed' : 'Confirm'}
                                            </Button>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card title="Supplier Partner Abundance Network ($500)">
                            <div className="space-y-4">
                                <p className="text-sm text-gray-300">
                                    Refer commercial building owners, property managers, or homeowners to RHIVE
                                    Construction and earn <strong className="text-[#ec028b]">$500</strong> per completed
                                    replacement — or sponsor a community fundraiser.
                                </p>
                                {!optedIn && myReferrals.length === 0 ? (
                                    <Button
                                        id="supplier-abundance-optin-btn"
                                        onClick={() => setOptedIn(true)}
                                        className="flex items-center gap-2"
                                    >
                                        <SparklesIcon className="w-4 h-4" />
                                        <span>Confirm</span>
                                    </Button>
                                ) : (
                                    <p className="text-xs text-emerald-400 font-bold">
                                        ✓ Active in Supplier Abundance Network
                                    </p>
                                )}
                                <form onSubmit={handleSubmitReferral} className="space-y-3 pt-3 border-t border-gray-800">
                                    <input
                                        required
                                        type="text"
                                        value={refName}
                                        onChange={(e) => setRefName(e.target.value)}
                                        placeholder="Property Owner / Manager Name"
                                        className="w-full bg-black border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:border-[#ec028b] outline-none"
                                    />
                                    <input
                                        required
                                        type="text"
                                        value={refPhone}
                                        onChange={(e) => setRefPhone(e.target.value)}
                                        placeholder="Phone Number"
                                        className="w-full bg-black border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:border-[#ec028b] outline-none"
                                    />
                                    <Button type="submit" className="w-full">
                                        Send
                                    </Button>
                                </form>
                            </div>
                        </Card>

                        <Card title={`Abundance Network Updates (${myReferrals.length})`}>
                            {myReferrals.length === 0 ? (
                                <p className="text-xs text-gray-500 py-6 text-center">
                                    Your partner referral submissions and $500 reward payouts appear live here.
                                </p>
                            ) : (
                                <div className="space-y-2.5">
                                    {myReferrals.map((r) => (
                                        <div
                                            key={r.id}
                                            className="p-3 rounded-xl bg-gray-900/50 border border-gray-800 flex justify-between items-center text-xs"
                                        >
                                            <div>
                                                <p className="font-bold text-white">{r.friend_name}</p>
                                                <p className="text-gray-400">{r.status}</p>
                                            </div>
                                            <span className="font-mono font-bold text-[#e2ab49]">$500</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </Card>
                    </div>
                )}
            </div>
        </PageContainer>
    );
};

export default SupplierHomepage;
