import React, { useState, useEffect } from 'react';
import PageContainer from '../components/PageContainer';
import Card from '../components/Card';
import Button from '../components/Button';
import { useMockDB } from '../contexts/MockDatabaseContext';
import { MapPinIcon, CameraIcon, BoltIcon, SparklesIcon, CheckCircleIcon } from '../components/icons';
import { projectService, firestoreService, userLogService } from '../lib/firebaseService';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { cn } from '../lib/utils';

const ContractorHomepage: React.FC = () => {
    const { currentUser } = useMockDB();
    const [tab, setTab] = useState<'deployments' | 'abundance'>('deployments');
    const [projects, setProjects] = useState<any[]>([]);
    const [referrals, setReferrals] = useState<any[]>([]);
    const [photoNote, setPhotoNote] = useState('');
    const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
    const [clockedInIds, setClockedInIds] = useState<Record<string, boolean>>({});
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

    const activeJobs = projects.filter((p) =>
        ['Schedule', 'Pre-Installation', 'Install', 'Warranty Activation', 'Punch List'].includes(
            String(p.current_stage || '')
        )
    );

    const activeJob = activeJobs.find((j) => j.id === selectedJobId) || activeJobs[0] || null;

    const myReferrals = referrals.filter(
        (r) =>
            r.referrer_id === currentUser?.id ||
            (currentUser?.email && (r.referrer_email || '').toLowerCase() === currentUser.email.toLowerCase())
    );

    const handleLogFieldPhoto = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!activeJob?.id || !photoNote.trim()) return;
        const existing = Array.isArray(activeJob.install_photos) ? activeJob.install_photos : [];
        const next = [...existing, photoNote.trim()];
        await projectService.updateRecord(activeJob.id, { install_photos: next }, activeJob._source);
        await userLogService.logAction('EDIT_RECORD', `Crew logged field photo note on ${activeJob.name}`, {
            recordId: activeJob.id,
            recordName: activeJob.name || 'Project',
            collection: activeJob._source || 'projects',
            stage: activeJob.current_stage,
        });
        setPhotoNote('');
        setBanner(`Logged photo milestone on ${activeJob.name}`);
    };

    const handleSubmitReferral = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!refName.trim() || !refPhone.trim()) return;
        const refId = `ref-crew-${Date.now()}`;
        await setDoc(doc(db, 'referrals', refId), {
            id: refId,
            referrer_id: currentUser?.id || 'contractor',
            referrer_name: currentUser?.name || 'Certified Crew Partner',
            referrer_email: currentUser?.email || '',
            program_mode: 'Referral',
            friend_name: refName.trim(),
            friend_phone: refPhone.trim(),
            reward_amount: 500,
            status: 'Submitted — Verification Pending',
            created_at: new Date().toISOString(),
        });
        await userLogService.logAction('RECORD_CREATED', `Contractor referral submitted for ${refName.trim()}`, {
            recordId: refId,
            recordName: refName.trim(),
            collection: 'referrals',
        });
        setOptedIn(true);
        setRefName('');
        setRefPhone('');
        setBanner('Abundance Network ($500) referral submitted!');
    };

    return (
        <PageContainer title="FIELD COMMAND" description="Live crew deployments, photo verification, and Abundance Network rewards.">
            <div className="space-y-6">
                {banner && (
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2">
                        <CheckCircleIcon className="w-4 h-4" />
                        <span>{banner}</span>
                    </div>
                )}

                <div className="flex gap-2">
                    <button
                        id="contractor-tab-deployments"
                        type="button"
                        onClick={() => setTab('deployments')}
                        className={cn(
                            'px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all',
                            tab === 'deployments'
                                ? 'border-[#ec028b] bg-[#ec028b]/15 text-white shadow-[0_0_12px_rgba(236,2,139,0.3)]'
                                : 'border-gray-800 bg-gray-900/50 text-gray-400'
                        )}
                    >
                        Field Deployments ({activeJobs.length})
                    </button>
                    <button
                        id="contractor-tab-abundance"
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

                {tab === 'deployments' ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                            <Card title="Current Crew Deployments">
                                {activeJobs.length > 0 ? (
                                    <div className="space-y-4">
                                        {activeJobs.map((project) => {
                                            const isClocked = Boolean(clockedInIds[project.id]);
                                            return (
                                                <div
                                                    key={project.id}
                                                    onClick={() => setSelectedJobId(project.id)}
                                                    className={cn(
                                                        'bg-black/80 border p-5 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 cursor-pointer transition-all',
                                                        activeJob?.id === project.id
                                                            ? 'border-[#ec028b] shadow-[0_0_15px_rgba(236,2,139,0.2)]'
                                                            : 'border-gray-800 hover:border-gray-600'
                                                    )}
                                                >
                                                    <div>
                                                        <p className="font-black text-white text-lg uppercase tracking-tight">
                                                            {project.name}
                                                        </p>
                                                        <div className="flex items-center text-gray-400 text-xs mt-1 font-mono">
                                                            <MapPinIcon className="w-4 h-4 mr-1.5 text-[#ec028b]" />
                                                            {project.property_address || project.address || 'Site Address Verified'}
                                                        </div>
                                                        <div className="mt-3 flex flex-wrap gap-2">
                                                            <span className="px-3 py-1 bg-[#ec028b]/20 text-[#ec028b] border border-[#ec028b]/40 rounded font-bold text-[10px] uppercase tracking-widest">
                                                                {project.current_stage}
                                                            </span>
                                                            <span className="px-3 py-1 bg-gray-900 text-gray-300 border border-gray-800 rounded font-mono text-[10px]">
                                                                {project.ops_schedule?.installDate || project.install_date || 'Ready'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <Button
                                                        id={`crew-checkin-${project.id}`}
                                                        variant={isClocked ? 'primary' : 'secondary'}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setClockedInIds((prev) => ({
                                                                ...prev,
                                                                [project.id]: !prev[project.id],
                                                            }));
                                                        }}
                                                    >
                                                        {isClocked ? 'Confirmed' : 'Confirm'}
                                                    </Button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="text-center py-16 bg-gray-950/50 border border-dashed border-gray-800 rounded-2xl">
                                        <BoltIcon className="w-10 h-10 text-gray-700 mx-auto mb-3" />
                                        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">
                                            No Active Deployments
                                        </p>
                                    </div>
                                )}
                            </Card>
                        </div>

                        <div className="space-y-6">
                            <Card title="Log Field Photo Milestone">
                                <form onSubmit={handleLogFieldPhoto} className="space-y-3">
                                    <p className="text-xs text-gray-400">
                                        Target Job: <strong className="text-white">{activeJob?.name || 'Select deployment'}</strong>
                                    </p>
                                    <input
                                        id="contractor-photo-note-input"
                                        type="text"
                                        value={photoNote}
                                        onChange={(e) => setPhotoNote(e.target.value)}
                                        placeholder="e.g. Valley ice shield & drip edge verified..."
                                        className="w-full bg-black/60 border border-gray-700 rounded-xl px-3 py-2.5 text-xs text-white focus:border-[#ec028b] outline-none"
                                    />
                                    <Button id="contractor-log-photo-btn" type="submit" className="w-full flex items-center justify-center gap-2">
                                        <CameraIcon className="w-4 h-4" />
                                        <span>Create</span>
                                    </Button>
                                </form>
                            </Card>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card title="Crew Partner Abundance Network ($500)">
                            <div className="space-y-4">
                                <p className="text-sm text-gray-300">
                                    Spot hail damage or a neighbor asking for a roof quote while on site? Refer them through the RHIVE Abundance Network to earn <strong className="text-[#ec028b]">$500</strong> upon completed roof replacement or direct it to a local youth fundraiser.
                                </p>
                                {!optedIn && myReferrals.length === 0 ? (
                                    <Button
                                        id="contractor-abundance-optin-btn"
                                        onClick={() => setOptedIn(true)}
                                        className="flex items-center gap-2"
                                    >
                                        <SparklesIcon className="w-4 h-4" />
                                        <span>Confirm</span>
                                    </Button>
                                ) : (
                                    <p className="text-xs text-emerald-400 font-bold">
                                        ✓ Enrolled in Crew Abundance Network Rewards
                                    </p>
                                )}
                                <form onSubmit={handleSubmitReferral} className="space-y-3 pt-3 border-t border-gray-800">
                                    <input
                                        required
                                        type="text"
                                        value={refName}
                                        onChange={(e) => setRefName(e.target.value)}
                                        placeholder="Neighbor / Property Owner Name"
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

                        <Card title={`Your Abundance Updates (${myReferrals.length})`}>
                            {myReferrals.length === 0 ? (
                                <p className="text-xs text-gray-500 py-6 text-center">
                                    Submitted neighbor referrals and $500 reward statuses appear live here.
                                </p>
                            ) : (
                                <div className="space-y-2.5">
                                    {myReferrals.map((r) => (
                                        <div key={r.id} className="p-3 rounded-xl bg-gray-900/50 border border-gray-800 flex justify-between items-center text-xs">
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

export default ContractorHomepage;
