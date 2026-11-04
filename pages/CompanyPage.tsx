import React, { useState, useEffect } from 'react';
import PageContainer from '../components/PageContainer';
import Card from '../components/Card';
import CollapsibleSection from '../components/CollapsibleSection';
import Button from '../components/Button';
import { useNavigation } from '../contexts/NavigationContext';
import { projectService, firestoreService } from '../lib/firebaseService';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { UserIcon, BriefcaseIcon, MailIcon, PhoneIcon, MapPinIcon, BuildingStorefrontIcon, PlusIcon } from '../components/icons';
import { getStagePageId } from '../lib/utils';
import AccountsListPage from './AccountsListPage';
import { useMockDB } from '../contexts/MockDatabaseContext';

const CompanyPage: React.FC = () => {
    const {
        selectedAccountId,
        setSelectedAccountId,
        setActivePageId,
        setSelectedProjectId,
        setSelectedPropertyId,
        setSelectedContactId,
    } = useNavigation();
    const { users } = useMockDB();

    const [account, setAccount] = useState<any>(null);
    const [projects, setProjects] = useState<any[]>([]);
    const [properties, setProperties] = useState<any[]>([]);
    const [contacts, setContacts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Subscribe to account info (with fallback to users collection)
    useEffect(() => {
        if (!selectedAccountId) {
            setAccount(null);
            setLoading(false);
            return;
        }

        setLoading(true);
        const docRef = doc(db, 'accounts', selectedAccountId);
        const unsub = onSnapshot(
            docRef,
            (snap) => {
                if (snap.exists()) {
                    setAccount({ id: snap.id, ...snap.data() });
                } else {
                    const fallbackUser = users.find((u) => u.id === selectedAccountId);
                    setAccount(fallbackUser ? { ...fallbackUser, accountType: fallbackUser.role } : null);
                }
                setLoading(false);
            },
            (err) => {
                console.warn('[RHIVE QOS] Accounts Firestore listener fallback:', err);
                const fallbackUser = users.find((u) => u.id === selectedAccountId);
                setAccount(fallbackUser || null);
                setLoading(false);
            }
        );

        return () => unsub();
    }, [selectedAccountId, users]);

    // Subscribe to projects for this account
    useEffect(() => {
        if (!selectedAccountId) return;
        const unsub = projectService.subscribe((allProjects) => {
            const accName = (account?.accountName || account?.name || '').toLowerCase().trim();
            const myProjects = allProjects.filter((p) => {
                if (p.user_id === selectedAccountId || p.account_id === selectedAccountId || p.owner_id === selectedAccountId) {
                    return true;
                }
                if (accName && (p.account_name || '').toLowerCase().trim() === accName) {
                    return true;
                }
                return false;
            });
            setProjects(myProjects);
        });
        return () => unsub();
    }, [selectedAccountId, account?.accountName, account?.name]);

    // Subscribe to properties linked to this account
    useEffect(() => {
        if (!selectedAccountId) return;
        const unsub = firestoreService.subscribeToDocuments('properties', (allProps: any[]) => {
            const linked = allProps.filter(
                (prop) =>
                    !prop.deleted &&
                    (prop.owner_id === selectedAccountId || prop.account_id === selectedAccountId || prop.client_id === selectedAccountId)
            );
            setProperties(linked);
        });
        return () => unsub();
    }, [selectedAccountId]);

    // Subscribe to contacts linked to this account
    useEffect(() => {
        if (!selectedAccountId) return;
        const unsub = firestoreService.subscribeToDocuments('contacts', (allContacts: any[]) => {
            const accName = (account?.accountName || account?.name || '').toLowerCase().trim();
            const linked = allContacts.filter((c) => {
                if (c.deleted) return false;
                if (c.account_id === selectedAccountId || c.company_id === selectedAccountId) return true;
                if (accName && (c.company || c.account_name || '').toLowerCase().trim() === accName) return true;
                return false;
            });
            setContacts(linked);
        });
        return () => unsub();
    }, [selectedAccountId, account?.accountName, account?.name]);

    const handleProjectClick = (p: any) => {
        setSelectedProjectId(p.id);
        setActivePageId(getStagePageId(p.current_stage));
    };

    const handleCreateProject = (targetProp?: any) => {
        const accName = account?.accountName || account?.name || '';
        const chosenProp = targetProp || properties[0];
        const category: 'Government' | 'Residential' | 'Commercial' = (account?.accountType || account?.type || '')
            .toLowerCase()
            .includes('gov')
            ? 'Government'
            : (account?.accountType || account?.type || '').toLowerCase().includes('res')
            ? 'Residential'
            : 'Commercial';

        const mappedContacts = contacts.map((c: any) => {
            const full = c.name || `${c.first_name || c.firstName || ''} ${c.last_name || c.lastName || ''}`.trim();
            return {
                firstName: c.first_name || c.firstName || full.split(' ')[0] || '',
                lastName: c.last_name || c.lastName || full.split(' ').slice(1).join(' ') || '',
                phone: c.phone || c.mobile || '',
                email: c.email || '',
                role: c.role || 'Property Owner',
            };
        });

        const prefillPayload = {
            accountId: selectedAccountId,
            parentCompany: category !== 'Residential' ? accName : '',
            projectCategory: category,
            propertyId: chosenProp?.id || chosenProp?._id || '',
            address: chosenProp?.property_address || chosenProp?.Property_Street || chosenProp?.address_full || account?.address || '',
            city: chosenProp?.city || chosenProp?.Property_City || account?.city || account?.billingCity || '',
            state: chosenProp?.state || chosenProp?.Property_State || account?.state || account?.billingState || 'UT',
            zip: chosenProp?.zip || chosenProp?.Property_Zip || account?.zip || '',
            latitude: Number(chosenProp?.latitude || chosenProp?.coordinates?.lat || 0),
            longitude: Number(chosenProp?.longitude || chosenProp?.coordinates?.lng || 0),
            propertyName: chosenProp?.name || chosenProp?.Property_Name || '',
            buildings: Array.isArray(chosenProp?.buildings) ? chosenProp.buildings : [],
            contacts: mappedContacts,
            contactName: mappedContacts[0] ? `${mappedContacts[0].firstName} ${mappedContacts[0].lastName}`.trim() : account?.contactName || '',
            contactEmail: mappedContacts[0]?.email || account?.email || '',
            contactPhone: mappedContacts[0]?.phone || account?.phone || '',
        };
        sessionStorage.setItem('rhive_prefill_intake', JSON.stringify(prefillPayload));
        if (category !== 'Residential' && accName) {
            sessionStorage.setItem('intakeParentCompany', accName);
        } else {
            sessionStorage.removeItem('intakeParentCompany');
        }
        window.dispatchEvent(new CustomEvent('rhive-apply-intake-prefill', { detail: { prefillPayload } }));
        setActivePageId('E-02a');
    };

    if (loading) {
        return (
            <PageContainer title="Account" description="Loading account data...">
                <div className="py-20 flex justify-center">
                    <div className="w-10 h-10 border-4 border-[#ec028b] border-t-transparent rounded-full animate-spin" />
                </div>
            </PageContainer>
        );
    }

    if (!selectedAccountId || (!account && !loading)) {
        return <AccountsListPage />;
    }

    const displayName = account?.accountName || account?.name || account?.displayName || 'Unnamed Account';
    const accountType = account?.accountType || account?.type || account?.role || 'Corporate Client';
    const accountCode = account?.accountId || account?.account_code || 'Verified Account';
    const accountEmail = account?.email || account?.email_1 || '';
    const accountPhone = account?.phone || account?.phone_1 || '';
    const accountAddress = [
        account?.billingStreet || account?.address || account?.projectAddress,
        account?.billingCity || account?.city || account?.projectCity,
        account?.billingState || account?.state || account?.projectState,
        account?.billingCode || account?.zip,
    ]
        .filter(Boolean)
        .join(', ');

    const totalBuildingsCount = properties.reduce(
        (sum, prop) => sum + (Array.isArray(prop.buildings) ? prop.buildings.length : 1),
        0
    );

    return (
        <PageContainer
            title={displayName}
            description={`${accountType} • ${properties.length} Propert${properties.length === 1 ? 'y' : 'ies'} • ${totalBuildingsCount} Building${totalBuildingsCount === 1 ? '' : 's'} • ${projects.length} Project${projects.length === 1 ? '' : 's'}`}
            headerAction={
                <div className="flex items-center gap-3">
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setSelectedAccountId(null)}
                    >
                        Back
                    </Button>
                    <Button
                        id="company-create-project-btn"
                        size="sm"
                        onClick={handleCreateProject}
                        className="flex items-center gap-2 shadow-[0_0_15px_rgba(236,2,139,0.25)]"
                    >
                        <PlusIcon className="w-4 h-4" />
                        Create
                    </Button>
                </div>
            }
        >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Account Details & Associated Contacts */}
                <div className="lg:col-span-1 space-y-6">
                    <Card title="Account Information">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <UserIcon className="w-4 h-4 text-[#ec028b] shrink-0" />
                                <span className="text-white text-xs uppercase font-black tracking-widest">{accountType}</span>
                            </div>
                            {accountEmail && (
                                <div className="flex items-center gap-3">
                                    <MailIcon className="w-4 h-4 text-gray-500 shrink-0" />
                                    <span className="text-gray-300 text-sm truncate">{accountEmail}</span>
                                </div>
                            )}
                            {accountPhone && (
                                <div className="flex items-center gap-3">
                                    <PhoneIcon className="w-4 h-4 text-gray-500 shrink-0" />
                                    <span className="text-gray-300 text-sm font-mono">{accountPhone}</span>
                                </div>
                            )}
                            {accountAddress && (
                                <div className="flex items-start gap-3">
                                    <MapPinIcon className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" />
                                    <span className="text-gray-300 text-xs leading-relaxed">{accountAddress}</span>
                                </div>
                            )}
                            <div className="mt-4 pt-4 border-t border-gray-800 flex items-center justify-between">
                                <span className="text-[10px] text-gray-500 uppercase font-bold">Account Reference</span>
                                <span className="text-xs font-mono text-[#ec028b] font-bold">{accountCode}</span>
                            </div>
                        </div>
                    </Card>

                    <Card title={`Associated Contacts (${contacts.length})`}>
                        {contacts.length === 0 ? (
                            <p className="text-xs text-gray-500 italic py-4 text-center">No contacts linked to this account yet.</p>
                        ) : (
                            <ul className="space-y-2.5">
                                {contacts.map((c) => {
                                    const cName =
                                        c.name ||
                                        `${c.first_name || c.firstName || ''} ${c.last_name || c.lastName || ''}`.trim() ||
                                        'Contact';
                                    return (
                                        <li
                                            key={c.id}
                                            onClick={() => {
                                                setSelectedContactId(c.id);
                                                setActivePageId('E-10');
                                            }}
                                            className="p-3 bg-gray-900/50 border border-gray-800 rounded-xl hover:border-[#ec028b]/50 cursor-pointer transition-all group flex items-center justify-between gap-3"
                                        >
                                            <div className="min-w-0">
                                                <p className="text-sm font-bold text-white group-hover:text-[#ec028b] truncate">
                                                    {cName}
                                                </p>
                                                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider truncate">
                                                    {c.role || 'Stakeholder'} {c.phone ? `• ${c.phone}` : ''}
                                                </p>
                                            </div>
                                            <span className="text-xs text-gray-600 group-hover:text-[#ec028b]">→</span>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </Card>
                </div>

                {/* Right Column: Properties/Buildings & Active Projects */}
                <div className="lg:col-span-2 space-y-6">
                    <CollapsibleSection title={`Properties & Campuses (${properties.length})`} isOpen={true}>
                        {properties.length === 0 ? (
                            <div className="p-6 text-center text-gray-500 italic text-sm">
                                No properties linked to this account yet.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-1">
                                {properties.map((prop) => {
                                    const propTitle =
                                        prop.name ||
                                        prop.Property_Name ||
                                        prop.property_address ||
                                        prop.Property_Street ||
                                        prop.address_full ||
                                        'Property';
                                    const propAddr = prop.address_full || [prop.property_address, prop.city, prop.state, prop.zip].filter(Boolean).join(', ');
                                    const bldgs = Array.isArray(prop.buildings) ? prop.buildings : [];
                                    return (
                                        <div
                                            key={prop.id}
                                            onClick={() => {
                                                setSelectedPropertyId(prop.id);
                                                setActivePageId('E-12');
                                            }}
                                            className="p-4 bg-gray-900/40 border border-gray-800 rounded-xl hover:border-[#ec028b]/60 cursor-pointer transition-all group"
                                        >
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="min-w-0">
                                                    <p className="text-white font-bold text-sm group-hover:text-[#ec028b] truncate">
                                                        {propTitle}
                                                    </p>
                                                    <p className="text-xs text-gray-500 font-mono truncate mt-0.5">{propAddr}</p>
                                                </div>
                                                <div className="flex items-center gap-1.5 shrink-0">
                                                    <span className="px-2 py-0.5 rounded bg-[#ec028b]/10 border border-[#ec028b]/30 text-[#ec028b] text-[10px] font-mono font-bold">
                                                        {bldgs.length || 1} Bldg{bldgs.length === 1 ? '' : 's'}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        id={`company-prop-create-btn-${prop.id}`}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleCreateProject(prop);
                                                        }}
                                                        className="px-2 py-0.5 rounded bg-[#ec028b] hover:bg-[#ec028b]/80 text-white text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer"
                                                        title="Create New Project for Property"
                                                    >
                                                        + Create
                                                    </button>
                                                </div>
                                            </div>
                                            {bldgs.length > 0 && (
                                                <div className="flex flex-wrap gap-1.5 mt-3 pt-2.5 border-t border-gray-800/70">
                                                    {bldgs.slice(0, 6).map((b: any, idx: number) => (
                                                        <span
                                                            key={b.id || idx}
                                                            className="text-[10px] px-2 py-0.5 bg-black/60 border border-gray-800 rounded text-gray-300 font-mono flex items-center gap-1"
                                                        >
                                                            <BuildingStorefrontIcon className="w-2.5 h-2.5 text-[#ec028b]" />
                                                            {b.name}
                                                        </span>
                                                    ))}
                                                    {bldgs.length > 6 && (
                                                        <span className="text-[10px] px-2 py-0.5 bg-gray-900 rounded text-gray-500 font-mono">
                                                            +{bldgs.length - 6} more
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </CollapsibleSection>

                    <CollapsibleSection title={`Projects (${projects.length})`} isOpen={true}>
                        {projects.length === 0 ? (
                            <div className="p-8 text-center text-gray-600 italic">No projects linked to this account yet.</div>
                        ) : (
                            <ul className="space-y-3 p-1">
                                {projects.map((p) => (
                                    <li
                                        key={p.id}
                                        onClick={() => handleProjectClick(p)}
                                        className="group cursor-pointer text-gray-300 p-4 bg-gray-900/40 border border-gray-800 rounded-xl flex justify-between items-center hover:border-[#ec028b]/50 transition-all hover:bg-gray-900/60"
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="w-9 h-9 rounded-lg bg-gray-900 border border-gray-800 flex items-center justify-center text-[#ec028b] group-hover:border-[#ec028b]/50 shrink-0">
                                                <BriefcaseIcon className="w-4 h-4" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-bold text-white group-hover:text-[#ec028b] truncate">
                                                    {p.name || 'Unnamed Project'}
                                                </p>
                                                <p className="text-xs text-gray-500 font-mono truncate">
                                                    {p.property_address || p.property?.address || p.project_type || 'Active Record'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 shrink-0">
                                            {p.quote?.total ? (
                                                <span className="text-xs font-mono font-bold text-[#e2ab49]">
                                                    ${Number(p.quote.total).toLocaleString()}
                                                </span>
                                            ) : null}
                                            <span className="text-[10px] bg-gray-900/50 border border-gray-800 px-2.5 py-1 rounded text-gray-400 uppercase font-bold tracking-wider group-hover:text-[#ec028b] group-hover:border-[#ec028b]/30">
                                                {p.current_stage || 'Lead'}
                                            </span>
                                            <div className="w-6 h-6 rounded-full bg-black border border-gray-700 flex items-center justify-center group-hover:bg-[#ec028b] group-hover:border-[#ec028b] group-hover:text-white transition-all text-gray-500">
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
