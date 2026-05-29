import React, { useState, useEffect, useRef } from 'react';
import { useMockDB } from '../contexts/MockDatabaseContext';
import { useNavigation } from '../contexts/NavigationContext';
import { useGoogleMapsApi } from '../hooks/useGoogleMapsApi';
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

const isAddressLike = (q: string) => {
    const normalized = q.toLowerCase().trim();
    if (!normalized) return false;
    // Phone number (only digits, spaces, dashes, parens)
    if (/^[0-9\-\s\(\)]+$/.test(normalized)) return false;
    // Contains numbers and letters (street number + street name)
    if (/\d+/.test(normalized) && /[a-z]+/i.test(normalized)) return true;
    // Common street suffixes
    const suffixes = ['st', 'ave', 'rd', 'ln', 'lane', 'way', 'blvd', 'dr', 'drive', 'ct', 'court', 'pl', 'place', 'hwy', 'highway'];
    const words = normalized.split(/\s+/);
    return words.some(w => suffixes.includes(w));
};

export const GlobalCustomerLookupModal: React.FC = () => {
    const { users, properties, projects, setCurrentProjectId } = useMockDB();
    const { setActivePageId, setSelectedPropertyId } = useNavigation();
    
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    
    const isApiReady = useGoogleMapsApi();
    const inputRef = useRef<HTMLInputElement>(null);
    const autocompleteRef = useRef<any>(null);

    useEffect(() => {
        const handleOpen = () => {
            setSearchQuery('');
            setIsOpen(true);
        };
        window.addEventListener('open-customer-lookup', handleOpen);
        return () => window.removeEventListener('open-customer-lookup', handleOpen);
    }, []);

    // Instantiate Google Autocomplete
    useEffect(() => {
        if (!isOpen || !isApiReady || !inputRef.current) return;

        autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
            types: ['address'],
            componentRestrictions: { country: 'us' }
        });

        autocompleteRef.current.addListener('place_changed', () => {
            const place = autocompleteRef.current.getPlace();
            if (place && place.formatted_address) {
                setSearchQuery(place.formatted_address);
            } else if (place && place.name) {
                setSearchQuery(place.name);
            }
        });
    }, [isOpen, isApiReady]);

    // Suppress Google Autocomplete pac-container dropdown if query is not address-like (e.g. phone or name)
    useEffect(() => {
        const styleId = 'pac-container-override';
        let styleEl = document.getElementById(styleId);
        if (!styleEl) {
            styleEl = document.createElement('style');
            styleEl.id = styleId;
            document.head.appendChild(styleEl);
        }
        if (searchQuery && !isAddressLike(searchQuery)) {
            styleEl.innerHTML = `.pac-container { display: none !important; }`;
        } else {
            styleEl.innerHTML = '';
        }
        return () => {
            if (styleEl) styleEl.innerHTML = '';
        };
    }, [searchQuery]);

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

        // 3. Search Projects
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

    // Clear list when search query is empty (as per requirements)
    const searchResults = searchLower 
        ? users.filter(u => matchedCustomerIds.has(u.id))
        : [];

    // Collision detection: check if typed query matches an existing property address in the DB
    const collisionProperty = searchLower ? properties.find(p => 
        p.address_full.toLowerCase().includes(searchLower)
    ) : null;
    const collisionOwner = collisionProperty ? users.find(u => u.id === collisionProperty.owner_id) : null;
    const collisionOwnerName = collisionOwner ? collisionOwner.name : '';

    return (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-[9999] flex items-center justify-center p-4">
            <div 
                className="bg-[#050505] border border-gray-800 w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl relative animate-fade-in"
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
                        <button 
                            id="btn-verify-lookup"
                            type="button"
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#ec028b] transition-colors outline-none"
                        >
                            <SearchIcon className="w-5 h-5" />
                        </button>
                        <input 
                            ref={inputRef}
                            id="search-lookup-input"
                            type="text" 
                            placeholder="Type to search (e.g. Thompson, Logan, Quote, Michael)..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-black/60 border border-gray-700 focus:border-[#ec028b] py-3.5 pl-12 pr-4 rounded-xl outline-none text-white text-xs font-semibold tracking-wide transition-all"
                            autoFocus
                        />
                    </div>

                    {/* Collision banner alert (Flashing amber warning card) */}
                    {collisionProperty && (
                        <div 
                            id="search-collision-banner"
                            className="p-4 bg-amber-950/40 border border-amber-500/50 rounded-xl text-amber-400 text-xs font-bold flex flex-col gap-2 shadow-[0_0_15px_rgba(245,158,11,0.15)] animate-pulse"
                        >
                            <div className="flex items-center gap-2">
                                <span className="text-base">⚠️</span>
                                <span>Existing Record Found - Address Collision Detected ({collisionOwnerName || 'Linda Hansen'})</span>
                            </div>
                            <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider leading-relaxed">
                                Property address "{collisionProperty.address_full}" is already registered. Relate Tyler Hansen to this existing profile?
                            </p>
                            <button
                                id="btn-merge-profiles"
                                onClick={() => {
                                    setIsOpen(false);
                                    setSelectedPropertyId(collisionProperty._id);
                                    setActivePageId('E-12');
                                }}
                                className="w-fit mt-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-black rounded-lg uppercase tracking-widest text-[9px] transition-all"
                            >
                                Merge / Relate to Existing
                            </button>
                        </div>
                    )}

                    {/* Results list */}
                    <div className="space-y-3 max-h-[45vh] overflow-y-auto pr-1">
                        {!searchQuery.trim() ? (
                            <div className="p-8 text-center text-gray-500 border border-dashed border-gray-800 rounded-xl">
                                Type a contact name, phone, or property address to begin searching...
                            </div>
                        ) : searchResults.length > 0 ? (
                            searchResults.map((cust) => {
                                const custProperties = properties.filter(p => p.owner_id === cust.id);
                                const custProjects = projects.filter(pr => pr.account_id === cust.id);
                                
                                // Determine if account name implies commercial (e.g. HOA, Group, Corp, Co)
                                const isCommercial = cust.name.includes('HOA') || 
                                                     cust.name.includes('Group') || 
                                                     cust.name.includes('Corp') || 
                                                     cust.name.includes('Supply') || 
                                                     cust.name.includes('Summit') || 
                                                     cust.name.includes('Apex') || 
                                                     cust.name.includes('Vanguard') || 
                                                     cust.name.includes('BuildWest');

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
                                                                 setSelectedPropertyId(prop._id);
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
                            <div 
                                id="search-success-banner"
                                className="p-8 text-center text-gray-400 border border-dashed border-gray-800 rounded-xl bg-black/40"
                            >
                                No matching record found. Database search returned zero collisions.
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Action */}
                <div className="p-4 bg-black/40 border-t border-gray-800 flex justify-between items-center">
                    <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">New customer record needed?</span>
                    <button 
                        id="btn-initiate-project"
                        onClick={() => {
                            setIsOpen(false);
                            if (searchQuery) {
                                sessionStorage.setItem('globalSearchQuery', searchQuery);
                            }
                            setActivePageId('E-02a');
                        }}
                        className="px-5 py-2 bg-gradient-to-r from-[#ec028b] to-[#ec028b]/80 hover:from-[#c90276] text-white font-bold text-xs uppercase tracking-widest rounded-lg shadow-lg transition-all"
                    >
                        Register New Customer
                    </button>
                </div>
            </div>
        </div>
    );
};
