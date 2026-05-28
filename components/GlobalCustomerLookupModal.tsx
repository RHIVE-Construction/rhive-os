import React, { useState, useEffect } from 'react';
import { useMockDB } from '../contexts/MockDatabaseContext';
import { useNavigation } from '../contexts/NavigationContext';
import { cn } from '../lib/utils';

// Local inline close icon
const CloseIcon = (p: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...p}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
);

// Local inline search icon
const SearchIcon = (p: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...p}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 1 5.196 5.196a7.5 7.5 0 0 1 10.602 10.602Z" />
    </svg>
);

export const GlobalCustomerLookupModal: React.FC = () => {
    const { users, properties, projects, setCurrentProjectId, setCurrentPropertyId } = useMockDB();
    const { setActivePageId } = useNavigation();
    
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const handleOpen = () => {
            setSearchQuery('');
            setIsOpen(true);
        };
        window.addEventListener('open-customer-lookup', handleOpen);
        return () => window.removeEventListener('open-customer-lookup', handleOpen);
    }, []);

    if (!isOpen) return null;

    // --- DEEP SMART SEARCH LOGIC ---
    const searchLower = searchQuery.toLowerCase().trim();
    const matchedCustomerIds = new Set<string>();

    if (searchLower) {
        // 1. Search Users (Contacts)
        users.forEach(u => {
            if (u.role !== 'Customer') return;
            const matches = u.name.toLowerCase().includes(searchLower) ||
                            (u.email && u.email.toLowerCase().includes(searchLower)) ||
                            (u.phone && u.phone.includes(searchLower));
            if (matches) matchedCustomerIds.add(u.id);
        });

        // 2. Search Properties
        properties.forEach(p => {
            const matches = p.address_full.toLowerCase().includes(searchLower) ||
                            p.type.toLowerCase().includes(searchLower);
            if (matches) {
                matchedCustomerIds.add(p.owner_id);
            }
        });

        // 3. Search Projects (including stage/quote amount)
        projects.forEach(pr => {
            const matches = pr.name.toLowerCase().includes(searchLower) ||
                            pr.current_stage.toLowerCase().includes(searchLower) ||
                            pr.status.toLowerCase().includes(searchLower) ||
                            (pr.quote && pr.quote.total.toString().includes(searchLower));
            if (matches) {
                matchedCustomerIds.add(pr.account_id);
            }
        });
    }

    // Map matched IDs back to full User objects
    // If search query is empty, show all customers as a default list
    const searchResults = searchLower 
        ? users.filter(u => matchedCustomerIds.has(u.id))
        : users.filter(u => u.role === 'Customer');

    return (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-[9999] flex items-center justify-center p-4">
            <div 
                className="bg-[#050505] border border-gray-800 w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl relative"
                style={{ clipPath: 'polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)' }}
            >
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#ec028b] to-transparent"></div>
                
                {/* Header */}
                <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-gray-900/30">
                    <div>
                        <h3 className="text-lg font-black uppercase tracking-wider text-white">Global Command Search</h3>
                        <p className="text-xs text-gray-400 mt-0.5 font-semibold tracking-wide">Deep search contacts, properties, project profiles, or estimates</p>
                    </div>
                    <button 
                        onClick={() => setIsOpen(false)} 
                        className="text-gray-400 hover:text-white p-1 hover:bg-white/5 rounded-lg transition-colors"
                    >
                        <CloseIcon className="w-5 h-5" />
                    </button>
                </div>

                {/* Input Search */}
                <div className="p-6 space-y-4">
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                            <SearchIcon className="w-5 h-5" />
                        </span>
                        <input 
                            type="text" 
                            placeholder="Type to search (e.g. Thompson, Logan, Quote, Michael)..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-black/60 border border-gray-700 focus:border-[#ec028b] py-3.5 pl-12 pr-4 rounded-xl outline-none text-white text-xs font-semibold tracking-wide transition-all"
                            autoFocus
                        />
                    </div>

                    {/* Results list */}
                    <div className="space-y-3 max-h-[45vh] overflow-y-auto pr-1">
                        {searchResults.length > 0 ? (
                            searchResults.map((cust) => {
                                const custProperties = properties.filter(p => p.owner_id === cust.id);
                                const custProjects = projects.filter(pr => pr.account_id === cust.id);
                                
                                // Determine if account name implies commercial (e.g. HOA, Group, Corp, Co)
                                const isCommercial = cust.name.includes('HOA') || 
                                                     cust.name.includes('Group') || 
                                                     cust.name.includes('Corp') || 
                                                     cust.name.includes('Supply') || 
                                                     cust.name.includes('Miller');

                                return (
                                    <div key={cust.id} className="p-4 bg-white/5 rounded-xl border border-gray-800 space-y-3">
                                        {/* Contact Name Link */}
                                        <div>
                                            <span className="text-[9px] font-black uppercase tracking-widest text-[#ec028b] block mb-1">
                                                {isCommercial ? 'Commercial Account' : 'Residential Contact'}
                                            </span>
                                            <button 
                                                onClick={() => {
                                                    setIsOpen(false);
                                                    setActivePageId(isCommercial ? 'E-08' : 'E-10');
                                                }}
                                                className="text-sm font-bold text-white hover:text-[#ec028b] hover:underline transition-all text-left outline-none"
                                            >
                                                {cust.name}
                                            </button>
                                            <p className="text-[10px] text-gray-500 font-mono mt-0.5">{cust.email || 'No email'} | {cust.phone || 'No phone'}</p>
                                        </div>

                                        {/* Property Addresses Links */}
                                        {custProperties.length > 0 && (
                                            <div className="pt-2.5 border-t border-gray-900/60">
                                                <span className="text-[9px] font-black uppercase tracking-widest text-gray-500 block mb-1">Property Profile</span>
                                                <div className="space-y-1">
                                                    {custProperties.map(prop => (
                                                        <button
                                                            key={prop._id}
                                                            onClick={() => {
                                                                setIsOpen(false);
                                                                setCurrentPropertyId(prop._id);
                                                                setActivePageId('E-12');
                                                            }}
                                                            className="text-xs text-gray-300 hover:text-[#ec028b] hover:underline transition-all text-left block outline-none"
                                                        >
                                                            📍 {prop.address_full} ({prop.type})
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Projects Links */}
                                        {custProjects.length > 0 && (
                                            <div className="pt-2.5 border-t border-gray-900/60">
                                                <span className="text-[9px] font-black uppercase tracking-widest text-gray-500 block mb-1">Associated Projects</span>
                                                <div className="flex flex-wrap gap-x-4 gap-y-2">
                                                    {custProjects.map(proj => (
                                                        <button
                                                            key={proj._id}
                                                            onClick={() => {
                                                                setCurrentProjectId(proj._id);
                                                                setIsOpen(false);
                                                                // Redirect to quote or estimate details page if stage matches
                                                                if (proj.current_stage === 'Quote') {
                                                                    setActivePageId('E-28');
                                                                } else if (proj.current_stage === 'Estimate') {
                                                                    setActivePageId('E-27');
                                                                } else {
                                                                    setActivePageId('E-15');
                                                                }
                                                            }}
                                                            className="text-xs text-[#ec028b] hover:text-white hover:underline transition-all text-left outline-none font-bold"
                                                        >
                                                            💼 {proj.name}
                                                            <span className="ml-1.5 px-1.5 py-0.5 rounded text-[8px] bg-[#ec028b]/10 border border-[#ec028b]/20 font-mono font-bold uppercase tracking-wider">
                                                                {proj.current_stage}
                                                            </span>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        ) : (
                            <div className="p-8 text-center text-gray-500 border border-dashed border-gray-800 rounded-xl">
                                No records matched query "{searchQuery}"
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Action */}
                <div className="p-4 bg-black/40 border-t border-gray-800 flex justify-between items-center">
                    <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">New customer record needed?</span>
                    <button 
                        onClick={() => {
                            setIsOpen(false);
                            if (searchQuery) {
                                sessionStorage.setItem('globalSearchQuery', searchQuery);
                            }
                            setActivePageId('E-02a');
                        }}
                        className="px-5 py-2 bg-gradient-to-r from-[#ec028b] to-[#ec028b]/80 hover:from-[#c90276] text-white font-bold text-xs uppercase tracking-widest rounded-lg shadow-lg"
                    >
                        Register New Customer
                    </button>
                </div>
            </div>
        </div>
    );
};
