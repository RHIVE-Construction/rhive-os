import React, { useState, useEffect } from 'react';
import PageContainer from '../components/PageContainer';
import Card from '../components/Card';
import CollapsibleSection from '../components/CollapsibleSection';
import { useNavigation } from '../contexts/NavigationContext';
import { projectService } from '../lib/firebaseService';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { UserIcon, BriefcaseIcon, MailIcon } from '../components/icons';
import { getStagePageId } from '../lib/utils';
import AccountsListPage from './AccountsListPage';

const CompanyPage: React.FC = () => {
    const { selectedAccountId, setActivePageId, setSelectedProjectId } = useNavigation();

    const [account, setAccount] = useState<any>(null);
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Subscribe to account info
    useEffect(() => {
        if (!selectedAccountId) {
            setLoading(false);
            return;
        }

        const docRef = doc(db, 'accounts', selectedAccountId);
        const unsub = onSnapshot(
            docRef, 
            (snap) => {
                if (snap.exists()) {
                    setAccount({ id: snap.id, ...snap.data() });
                } else {
                    setAccount(null);
                }
                setLoading(false);
            },
            (err) => {
                console.warn("⚠️ [RHIVE QOS] Accounts Firestore listener failed (offline/mock):", err);
                setLoading(false);
            }
        );

        return () => unsub();
    }, [selectedAccountId]);

    // Subscribe to projects for this specific account
    useEffect(() => {
        if (!selectedAccountId) return;

        const unsub = projectService.subscribe((allProjects) => {
            const myProjects = allProjects.filter(p =>
                p.user_id === selectedAccountId || p.account_id === selectedAccountId
            );
            setProjects(myProjects);
        });

        return () => unsub();
    }, [selectedAccountId]);

    const handleProjectClick = (p: any) => {
        setSelectedProjectId(p.id);
        setActivePageId(getStagePageId(p.current_stage));
    };

    if (loading) {
        return (
            <PageContainer title="Account" description="Loading account data...">
                <div className="py-20 flex justify-center">
                    <div className="w-10 h-10 border-4 border-[#ec028b] border-t-transparent rounded-full animate-spin"></div>
                </div>
            </PageContainer>
        );
    }

    if (!selectedAccountId || (!account && !loading)) {
        return <AccountsListPage />;
    }

    return (
        <PageContainer title={account?.name || account?.displayName || 'Unnamed Account'} description={`${account?.role || 'Corporate Client'} Data • Live Sync`}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Column: Account Details */}
                <div className="md:col-span-1 space-y-8">
                    <Card title="Account Information">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <MailIcon className="w-4 h-4 text-gray-500" />
                                <span className="text-gray-300 text-sm truncate">{account?.email || 'N/A'}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <UserIcon className="w-4 h-4 text-gray-500" />
                                <span className="text-gray-300 text-sm uppercase font-bold tracking-widest">{account?.role || 'Customer'}</span>
                            </div>
                            <div className="mt-4 pt-4 border-t border-gray-800">
                                <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Account ID</p>
                                <p className="text-xs font-mono text-gray-400 truncate">{account?.id}</p>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Right Column: Projects List */}
                <div className="md:col-span-2 space-y-6">
                    <CollapsibleSection title={`Active Projects (${projects.length})`} isOpen={true}>
                        {projects.length === 0 ? (
                            <div className="p-8 text-center text-gray-600 italic">No projects linked to this account yet.</div>
                        ) : (
                            <ul className="space-y-3 p-1">
                                {projects.map(p => (
                                    <li
                                        key={p.id}
                                        onClick={() => handleProjectClick(p)}
                                        className="group cursor-pointer text-gray-300 p-4 bg-gray-900/40 border border-gray-800 rounded-xl flex justify-between items-center hover:border-[#ec028b]/50 transition-all hover:bg-gray-900/60"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded bg-gray-900 border border-gray-800 flex items-center justify-center text-[#ec028b] group-hover:border-[#ec028b]/50">
                                                <BriefcaseIcon className="w-4 h-4" />
                                            </div>
                                            <span className="font-bold">{p.name || 'Unnamed Project'}</span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="text-[10px] bg-gray-900/50 border border-gray-800 px-2 py-1 rounded text-gray-500 group-hover:text-[#ec028b] group-hover:border-[#ec028b]/30">
                                                {p.current_stage || 'Lead'}
                                            </span>
                                            <div className="w-6 h-6 rounded-full bg-black border border-gray-700 flex items-center justify-center group-hover:bg-[#ec028b] group-hover:border-[#ec028b] group-hover:text-white transition-all text-gray-500">
                                                {/* Arrow icon would go here but keep it simple */}
                                                →
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </CollapsibleSection>
                </div>
            </div>
        </PageContainer>
    );
};

export default CompanyPage;
