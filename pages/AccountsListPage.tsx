import React, { useState, useEffect } from 'react';
import PageContainer from '../components/PageContainer';
import Button from '../components/Button';
import { useNavigation } from '../contexts/NavigationContext';
import { accountService } from '../lib/firebaseService';
import { UserIcon, ChevronRightIcon, PlusIcon, MailIcon, PhoneIcon, MapPinIcon, BriefcaseIcon } from '../components/icons';
import { cn } from '../lib/utils';

/** Resolve account type label for badge */
const getAccountType = (a: any): string =>
    a.accountType || a.type || a.recordStatus || '';

const typeColor = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes('prospect'))  return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
    if (t.includes('customer'))  return 'bg-[#ec028b]/10 text-[#ec028b] border-[#ec028b]/30';
    if (t.includes('partner'))   return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
    if (t.includes('available')) return 'bg-green-500/10 text-green-400 border-green-500/30';
    if (t.includes('hoa') || t.includes('association')) return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    return 'bg-gray-800 text-gray-400 border-gray-700';
};

const AccountsListPage: React.FC = () => {
    const { setActivePageId, setSelectedAccountId } = useNavigation();

    const [accounts, setAccounts] = useState<any[]>([]);
    const [loading, setLoading]   = useState(true);
    const [search, setSearch]     = useState('');
    const [filterType, setFilterType] = useState('All');

    useEffect(() => {
        const unsub = accountService.subscribe((data: any[]) => {
            setAccounts(data);
            setLoading(false);
        });
        return () => unsub();
    }, []);

    const handleSelect = (id: string) => {
        setSelectedAccountId(id);
        setActivePageId('E-08');
    };

    // Build unique type filter chips
    const allTypes = Array.from(
        new Set(accounts.map(a => getAccountType(a)).filter(Boolean))
    ).sort();
    const filterOptions = ['All', ...allTypes];

    const filtered = accounts
        .filter(a => {
            if (filterType === 'All') return true;
            return getAccountType(a) === filterType;
        })
        .filter(a => {
            if (!search) return true;
            const name = (a.accountName || a.name || '').toLowerCase();
            return (
                name.includes(search.toLowerCase()) ||
                String(a.phone || '').includes(search) ||
                (a.email || a.email_1 || '').toLowerCase().includes(search.toLowerCase()) ||
                (a.billingCity || a.projectCity || '').toLowerCase().includes(search.toLowerCase()) ||
                (a.accountId || '').toLowerCase().includes(search.toLowerCase())
            );
        });

    if (loading) {
        return (
            <PageContainer title="Accounts" description="Loading account records...">
                <div className="flex justify-center py-20">
                    <div className="w-10 h-10 border-4 border-[#ec028b] border-t-transparent rounded-full animate-spin" />
                </div>
            </PageContainer>
        );
    }

    return (
        <PageContainer
            title="Accounts"
            description={`${accounts.length} account${accounts.length !== 1 ? 's' : ''} synced from Firestore`}
        >
            {/* Toolbar */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex flex-wrap items-center gap-3">
                    {/* Search */}
                    <div className="relative">
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search name, phone, email, city..."
                            className="w-72 pl-4 pr-4 py-2 bg-gray-900/50 border border-gray-800 rounded-full text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#ec028b]/50 transition"
                        />
                    </div>

                    {/* Type filter chips */}
                    <div className="flex gap-1 flex-wrap">
                        {filterOptions.slice(0, 7).map(opt => (
                            <button
                                key={opt}
                                onClick={() => setFilterType(opt)}
                                className={cn(
                                    'px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest border transition-all',
                                    filterType === opt
                                        ? 'bg-[#ec028b]/20 text-[#ec028b] border-[#ec028b]/40'
                                        : 'bg-gray-900/50 text-gray-500 border-gray-800 hover:text-white'
                                )}
                            >
                                {opt}
                            </button>
                        ))}
                    </div>

                    <span className="text-gray-500 text-sm font-mono">
                        {filtered.length} record{filtered.length !== 1 ? 's' : ''}
                    </span>
                </div>

                <Button className="flex items-center gap-2 shadow-[0_0_15px_rgba(236,2,139,0.2)]">
                    <PlusIcon className="w-4 h-4" />
                    New Account
                </Button>
            </div>

            {/* Empty state */}
            {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-16 border border-dashed border-gray-800 rounded-xl bg-gray-900/30">
                    <BriefcaseIcon className="w-16 h-16 text-gray-700 mb-4" />
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-lg">No Accounts Found</p>
                    <p className="text-gray-500 text-sm mt-2 text-center max-w-sm">
                        {search
                            ? `No accounts matching "${search}".`
                            : 'No accounts in Firestore yet. Run the import script to populate accounts.'}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filtered.map(account => {
                        const name = account.accountName || account.name || 'Unnamed Account';
                        const initials = name
                            .split(' ')
                            .map((n: string) => n[0])
                            .filter(Boolean)
                            .join('')
                            .toUpperCase()
                            .slice(0, 2);

                        const phone    = account.phone || '';
                        const email    = account.email || account.email_1 || '';
                        const city     = account.billingCity || account.projectCity || account.shippingCity || '';
                        const state    = account.billingState || account.projectState || account.shippingState || '';
                        const location = [city, state].filter(Boolean).join(', ');
                        const type     = getAccountType(account);
                        const rhiveId  = account.accountId || account.autoNumber_1 || '';

                        return (
                            <div
                                key={account.id}
                                onClick={() => handleSelect(account.id)}
                                className="group relative bg-gray-900/40 border border-gray-800 rounded-2xl p-6 cursor-pointer hover:border-[#ec028b]/60 transition-all duration-300 hover:shadow-[0_0_30px_rgba(236,2,139,0.1)] overflow-hidden"
                            >
                                {/* Hover top-line accent */}
                                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#ec028b] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                {/* Header */}
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-[#ec028b]/20 to-black border border-[#ec028b]/20 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <span className="text-[#ec028b] font-black text-sm">{initials || '?'}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-white font-bold text-base line-clamp-1 group-hover:text-[#ec028b] transition-colors">
                                            {name}
                                        </h3>
                                        {type && (
                                            <span className={cn(
                                                'text-[9px] px-2 py-0.5 rounded border font-black uppercase tracking-widest',
                                                typeColor(type)
                                            )}>
                                                {type}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Info rows */}
                                <div className="space-y-2">
                                    {email && (
                                        <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                                            <MailIcon className="w-3 h-3 shrink-0" />
                                            <span className="truncate">{email}</span>
                                        </div>
                                    )}
                                    {phone && (
                                        <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                                            <PhoneIcon className="w-3 h-3 shrink-0" />
                                            <span className="truncate">{phone}</span>
                                        </div>
                                    )}
                                    {location && (
                                        <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                                            <MapPinIcon className="w-3 h-3 shrink-0" />
                                            <span className="truncate">{location}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Footer */}
                                <div className="mt-4 pt-4 border-t border-gray-800/50 flex items-center justify-between">
                                    <span className="text-[10px] text-gray-600 font-mono">
                                        {rhiveId
                                            ? `# ${rhiveId}`
                                            : account.createdTime
                                            ? String(account.createdTime).slice(0, 10)
                                            : 'Imported'}
                                    </span>
                                    <div className="w-8 h-8 rounded-full border border-gray-700 flex items-center justify-center text-gray-500 group-hover:border-[#ec028b] group-hover:text-[#ec028b] group-hover:bg-[#ec028b]/10 transition-colors">
                                        <ChevronRightIcon className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </PageContainer>
    );
};

export default AccountsListPage;
