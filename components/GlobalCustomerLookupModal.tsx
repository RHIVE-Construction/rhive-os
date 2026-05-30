import React, { useState, useEffect, useRef } from 'react';
import { useMockDB } from '../contexts/MockDatabaseContext';
import { useNavigation } from '../contexts/NavigationContext';
import { useGoogleMapsApi } from '../hooks/useGoogleMapsApi';
import { cn } from '../lib/utils';

// Local inline search icon
const SearchIcon = (p: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...p}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 1 5.196 5.196a7.5 7.5 0 0 1 10.602 10.602Z" />
    </svg>
);

// Modern multicolored Google Maps Pin Icon
const GoogleMapsPinIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg className="w-3.5 h-3.5 inline-block mr-1.5 align-text-top" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M12 2C8.69 2 6 4.69 6 8C6 9.66 6.67 11.16 7.75 12.25L12 16.5L16.25 12.25C17.33 11.16 18 9.66 18 8C18 4.69 15.31 2 12 2Z" fill="#EA4335" />
        <path d="M12 16.5L7.75 12.25C6.67 11.16 6 9.66 6 8C6 7.68 6.03 7.37 6.08 7.07L12 16.5Z" fill="#34A853" />
        <path d="M12 2C13.25 2 14.41 2.38 15.38 3.03L12 7.5L8.62 3.03C9.59 2.38 10.75 2 12 2Z" fill="#F9BC05" />
        <path d="M12 16.5L16.25 12.25C17.33 11.16 18 9.66 18 8C18 7.68 17.97 7.37 17.92 7.07L12 16.5Z" fill="#4285F4" />
        <circle cx="12" cy="8" r="2.5" fill="#FFFFFF" />
        <circle cx="12" cy="8" r="1.2" fill="#4285F4" />
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

// Decipher search query types
const decipherQueryType = (q: string): 'Phone Number' | 'Address' | 'Name' | 'Note' | null => {
    const trimmed = q.trim();
    if (!trimmed) return null;
    
    // 1. Phone number
    if (/^[0-9\-\s\(\)\+\.]+$/.test(trimmed) && (trimmed.replace(/[^0-9]/g, '').length >= 3)) {
        return 'Phone Number';
    }
    
    // 2. Address
    const lower = trimmed.toLowerCase();
    const hasDigits = /\d+/.test(lower);
    const hasLetters = /[a-z]+/i.test(lower);
    
    const suffixes = [
        'st', 'street', 'ave', 'avenue', 'rd', 'road', 'ln', 'lane', 'way', 'blvd', 'boulevard', 
        'dr', 'drive', 'ct', 'court', 'pl', 'place', 'hwy', 'highway', 'pkwy', 'parkway', 'loop', 'ter', 'terrace'
    ];
    const words = lower.split(/\s+/);
    const hasSuffix = words.some(w => suffixes.includes(w));
    
    if ((hasDigits && hasLetters) || hasSuffix) {
        return 'Address';
    }
    
    // 3. Note
    if (words.length >= 5 || trimmed.length > 30) {
        return 'Note';
    }
    
    // 4. Name
    return 'Name';
};

export const GlobalCustomerLookupModal: React.FC = () => {
    const { users, properties, projects, setCurrentProjectId } = useMockDB();
    const { setActivePageId, setSelectedPropertyId, setSelectedContactId, setSelectedAccountId } = useNavigation();
    
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [shouldRender, setShouldRender] = useState(false);
    const [isAnimatingIn, setIsAnimatingIn] = useState(false);

    useEffect(() => {
        const handleOpen = () => {
            setSearchQuery('');
            setIsOpen(true);
        };
        window.addEventListener('open-customer-lookup', handleOpen);
        return () => window.removeEventListener('open-customer-lookup', handleOpen);
    }, []);

    useEffect(() => {
        if (isOpen) {
            setShouldRender(true);
            const timer = setTimeout(() => {
                setIsAnimatingIn(true);
            }, 10);
            return () => clearTimeout(timer);
        } else {
            setIsAnimatingIn(false);
            const timer = setTimeout(() => {
                setShouldRender(false);
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    const isApiReady = useGoogleMapsApi();
    const inputRef = useRef<HTMLInputElement>(null);
    const autocompleteRef = useRef<any>(null);

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

    // Suppress Google Autocomplete pac-container dropdown if query is not address-like
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

    if (!shouldRender) return null;

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

    // Clear list when search query is empty
    const searchResults = searchLower 
        ? users.filter(u => matchedCustomerIds.has(u.id))
        : [];

    // Collision detection: check if typed query matches an existing property address in the DB
    const collisionProperty = searchLower ? properties.find(p => 
        p.address_full.toLowerCase().includes(searchLower)
    ) : null;
    const collisionOwner = collisionProperty ? users.find(u => u.id === collisionProperty.owner_id) : null;
    const collisionOwnerName = collisionOwner ? collisionOwner.name : '';

    // Decipher search queries and association status
    const queryType = decipherQueryType(searchQuery);
    const isAssociated = searchResults.length > 0 || !!collisionProperty;
    const associationStatus = isAssociated ? 'Associated' : 'New Record';

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            setIsOpen(false);
        }
    };

    return (
        <div 
            className={cn(
                "fixed inset-0 z-[9999] transition-all duration-300 flex flex-col items-center justify-start pt-2 px-4 bg-transparent",
                isAnimatingIn ? "bg-black/35 pointer-events-auto" : "pointer-events-none"
            )}
            onClick={handleBackdropClick}
        >
            <div 
                className={cn(
                    "w-full max-w-xl flex flex-col relative transition-all duration-300 transform",
                    isAnimatingIn ? "translate-y-12 opacity-100" : "-translate-y-full opacity-0"
                )}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Search Meta Info & Type Badge */}
                <div className="flex justify-between items-center mb-1.5 px-1">
                    <span className="text-[10px] text-gray-500 font-mono tracking-widest uppercase font-bold">Global Command Search</span>
                    {queryType && (
                        <span 
                            id="search-mode-badge"
                            className="px-2 py-0.5 text-[9px] font-black uppercase tracking-widest bg-rhive-pink/15 text-rhive-pink border border-rhive-pink/30 font-mono"
                        >
                            Detected: {queryType} ({associationStatus})
                        </span>
                    )}
                </div>

                {/* Input Search Container */}
                <div 
                    className="bg-[#050505] border border-gray-800 p-2 shadow-2xl relative"
                    style={{ clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)' }}
                >
                    <div className="relative">
                        <button 
                            id="btn-verify-lookup"
                            type="button"
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#ec028b] transition-colors outline-none z-10"
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
                            className="w-full bg-black/60 border border-gray-700 focus:border-[#ec028b] py-3.5 pl-12 pr-4 outline-none text-white text-xs font-semibold tracking-wide transition-all"
                            style={{ clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)' }}
                            autoFocus
                        />
                    </div>
                </div>

                {/* Dropdown Container */}
                {(searchQuery.trim() !== '' || collisionProperty) && (
                    <div 
                        className="mt-2 bg-[#050505] border border-gray-800 p-4 space-y-4 shadow-2xl max-h-[60vh] overflow-y-auto"
                        style={{ clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)' }}
                    >
                        {/* Collision banner alert (Flashing amber warning card) */}
                        {collisionProperty && (
                            <div 
                                id="search-collision-banner"
                                className="p-4 bg-amber-950/40 border border-amber-500/50 text-amber-400 text-xs font-bold flex flex-col gap-2 shadow-[0_0_15px_rgba(245,158,11,0.15)] animate-pulse"
                                style={{ clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)' }}
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
                                    className="w-fit mt-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-black uppercase tracking-widest text-[9px] transition-all"
                                    style={{ clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)' }}
                                >
                                    Merge / Relate to Existing
                                </button>
                            </div>
                        )}

                        {/* Results list */}
                        <div className="space-y-3">
                            {searchResults.length > 0 ? (
                                searchResults.map((cust) => {
                                    const custProperties = properties.filter(p => p.owner_id === cust.id);
                                    const custProjects = projects.filter(pr => pr.account_id === cust.id);
                                    
                                    const isCommercial = cust.name.includes('HOA') || 
                                                         cust.name.includes('Group') || 
                                                         cust.name.includes('Corp') || 
                                                         cust.name.includes('Supply') || 
                                                         cust.name.includes('Summit') || 
                                                         cust.name.includes('Apex') || 
                                                         cust.name.includes('Vanguard') || 
                                                         cust.name.includes('BuildWest');

                                    return (
                                        <div 
                                            key={cust.id} 
                                            className="p-4 bg-white/5 border border-gray-800 space-y-3"
                                            style={{ clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)' }}
                                        >
                                            {/* Contact Name Link */}
                                            <div>
                                                <span className="text-[9px] font-black uppercase tracking-widest text-[#ec028b] block mb-1">
                                                    {isCommercial ? 'Commercial Account' : 'Residential Contact'}
                                                </span>
                                                <button 
                                                    onClick={() => {
                                                        setIsOpen(false);
                                                        if (isCommercial) {
                                                             setSelectedAccountId(cust.id);
                                                            setActivePageId('E-08');
                                                        } else {
                                                            setSelectedContactId(cust.id);
                                                            setActivePageId('E-10');
                                                        }
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
                                                                <GoogleMapsPinIcon /> {prop.address_full} ({prop.type})
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
                            ) : !collisionProperty ? (
                                <div 
                                    id="search-success-banner"
                                    className="p-8 text-center text-gray-400 border border-dashed border-gray-800 bg-black/40"
                                    style={{ clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)' }}
                                >
                                    No matching record found. Database search returned zero collisions.
                                </div>
                            ) : null}
                        </div>

                        {/* Continue As New Record Button (Only shown when query is not empty and no record exists) */}
                        {searchQuery.trim() !== '' && searchResults.length === 0 && (
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
                                    className="px-5 py-2 bg-gradient-to-r from-[#ec028b] to-[#ec028b]/80 hover:from-[#c90276] text-white font-bold text-xs uppercase tracking-widest shadow-lg transition-all"
                                    style={{ clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)' }}
                                >
                                    Register New Customer
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
