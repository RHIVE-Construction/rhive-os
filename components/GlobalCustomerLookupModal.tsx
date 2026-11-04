import React, { useState, useEffect, useRef } from 'react';
import { useMockDB } from '../contexts/MockDatabaseContext';
import { useNavigation } from '../contexts/NavigationContext';
import { useGoogleMapsApi } from '../hooks/useGoogleMapsApi';
import { cn, getStagePageId } from '../lib/utils';
import { accountService, projectService, firestoreService } from '../lib/firebaseService';
import { matchesPhoneQuery, normalizePhoneDigits } from '../lib/qosRules';
import { navigateToIntake } from '../lib/intakeRouting';

const SearchIcon = (p: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...p}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 1 5.196 5.196a7.5 7.5 0 0 1 10.602 10.602Z" />
    </svg>
);

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

const COMPANY_KEYWORDS = [
    'hoa', 'llc', 'inc', 'corp', 'group', 'management', 'apartments', 'apts',
    'properties', 'portfolio', 'services', 'construction', 'builders', 'dfcm',
    'state of utah', 'udot', 'theatres', 'megaplex', 'plaza', 'condos', 'condominiums',
    'estates', 'holdings', 'partners', 'commercial', 'retail', 'school', 'church',
];

const isCompanyLike = (q: string) => {
    const lower = q.toLowerCase().trim();
    return COMPANY_KEYWORDS.some((kw) => new RegExp(`\\b${kw}\\b`, 'i').test(lower));
};

const isAddressLike = (q: string) => {
    const normalized = q.toLowerCase().trim();
    if (!normalized || normalized.includes('@')) return false;
    if (/^[0-9\-\s\(\)\+\.]+$/.test(normalized)) return false;
    if (normalized.includes(',')) return true;
    if (/^\d+\s+[a-z0-9]/i.test(normalized)) return true;
    const suffixes = [
        'st', 'street', 'ave', 'avenue', 'rd', 'road', 'ln', 'lane', 'way', 'blvd', 'boulevard',
        'dr', 'drive', 'ct', 'court', 'pl', 'place', 'hwy', 'highway', 'pkwy', 'parkway', 'loop', 'ter', 'terrace',
        'suite', 'ste', 'apt', 'unit',
    ];
    const words = normalized.split(/[\s,]+/);
    if (words.some((w) => suffixes.includes(w)) && /\d/.test(normalized)) return true;
    const stateCodes = ['utah', 'idaho', 'boise', 'salt lake', 'south jordan', 'ogden', 'provo', 'logan', 'draper', 'sandy'];
    if (stateCodes.some((c) => normalized.includes(c))) return true;
    return false;
};

export type DetectedLookupQueryType = 'Phone Number' | 'Email' | 'Address' | 'Company' | 'Name' | 'Note' | null;

export const decipherQueryType = (q: string): DetectedLookupQueryType => {
    const trimmed = q.trim();
    if (!trimmed) return null;
    if (trimmed.includes('@') && /\.[a-z]{2,}$/i.test(trimmed)) return 'Email';
    if (/^[0-9\-\s\(\)\+\.]+$/.test(trimmed) && normalizePhoneDigits(trimmed).length >= 3) {
        return 'Phone Number';
    }
    if (isAddressLike(trimmed)) return 'Address';
    const words = trimmed.split(/\s+/);
    if (words.length >= 6 || trimmed.length > 42) return 'Note';
    if (isCompanyLike(trimmed)) return 'Company';
    return 'Name';
};

export const GlobalCustomerLookupModal: React.FC = () => {
    const { users: mockUsers, properties: mockProperties, projects: mockProjects, setCurrentProjectId, currentUser } = useMockDB();
    const { setActivePageId, setSelectedPropertyId, setSelectedContactId, setSelectedAccountId, setSelectedProjectId } = useNavigation();
    const [fsAccounts, setFsAccounts] = useState<any[]>([]);
    const [fsContacts, setFsContacts] = useState<any[]>([]);
    const [fsProperties, setFsProperties] = useState<any[]>([]);
    const [fsProjects, setFsProjects] = useState<any[]>([]);

    useEffect(() => {
        const u1 = accountService.subscribe((docs: any[]) => setFsAccounts(docs.filter((d) => !d.deleted)));
        const u2 = firestoreService.subscribeToDocuments('contacts', (docs: any[]) => setFsContacts(docs.filter((d) => !d.deleted)));
        const u3 = firestoreService.subscribeToDocuments('properties', (docs: any[]) => setFsProperties(docs.filter((d) => !d.deleted)));
        const u4 = projectService.subscribe((docs: any[]) => setFsProjects(docs));
        return () => { u1(); u2(); u3(); u4(); };
    }, []);

    // Unified live + mock directories with rich entity metadata preserved
    const users = React.useMemo(() => {
        const map = new Map<string, any>();
        mockUsers.forEach((u) =>
            map.set(u.id, {
                ...u,
                _entityKind: 'user',
                _accountType: isCompanyLike(u.name || '') ? 'Commercial' : 'Residential',
            })
        );
        fsAccounts.forEach((a) => {
            const name = a.accountName || a.name || '';
            if (!name) return;
            map.set(a.id, {
                id: a.id,
                name,
                role: 'Customer',
                email: a.email || a.email_1 || '',
                phone: a.phone || a.phone_1 || '',
                contactName: a.contactName || '',
                _entityKind: 'account',
                _accountType: a.accountType || a.type || (isCompanyLike(name) ? 'Commercial' : 'Residential'),
            });
        });
        fsContacts.forEach((c) => {
            const name = c.name || `${c.first_name || c.firstName || ''} ${c.last_name || c.lastName || ''}`.trim();
            if (!name || map.has(c.id)) return;
            map.set(c.id, {
                id: c.id,
                name,
                firstName: c.first_name || c.firstName || name.split(' ')[0] || '',
                lastName: c.last_name || c.lastName || name.split(' ').slice(1).join(' ') || '',
                role: 'Customer',
                contactRole: c.role || 'Property Owner',
                email: c.email || '',
                phone: c.phone || c.mobile || '',
                _entityKind: 'contact',
                _accountType: 'Residential',
                account_id: c.account_id || '',
                property_id: c.property_id || '',
            });
        });
        return Array.from(map.values());
    }, [mockUsers, fsAccounts, fsContacts]);

    const allContactsList = React.useMemo(() => {
        return fsContacts.map((c) => {
            const full = c.name || `${c.first_name || c.firstName || ''} ${c.last_name || c.lastName || ''}`.trim();
            return {
                id: c.id,
                firstName: c.first_name || c.firstName || full.split(' ')[0] || '',
                lastName: c.last_name || c.lastName || full.split(' ').slice(1).join(' ') || '',
                name: full,
                phone: c.phone || c.mobile || '',
                email: c.email || '',
                role: c.role || 'Property Owner',
                account_id: c.account_id || '',
                property_id: c.property_id || '',
            };
        });
    }, [fsContacts]);

    const properties = React.useMemo(() => {
        const map = new Map<string, any>();
        mockProperties.forEach((p) =>
            map.set(p._id, {
                ...p,
                name: (p as any).name || p.address_full,
                property_address: (p as any).property_address || p.address_full?.split(',')[0] || '',
                city: (p as any).city || '',
                state: (p as any).state || 'UT',
                zip: (p as any).zip || '',
                latitude: p.coordinates?.lat || 0,
                longitude: p.coordinates?.lng || 0,
                buildings: p.buildings || [],
                account_id: p.owner_id || '',
            })
        );
        fsProperties.forEach((p) => {
            const id = p.id || p._id;
            if (!id) return;
            const street = p.Property_Street || p.property_address || '';
            const city = p.Property_City || p.city || '';
            const state = p.Property_State || p.state || 'UT';
            const zip = p.Property_Zip || p.zip || '';
            map.set(id, {
                _id: id,
                id,
                name: p.Property_Name || p.name || street || 'Property',
                property_address: street || (p.address_full ? p.address_full.split(',')[0] : ''),
                city,
                state,
                zip,
                latitude: Number(p.latitude || p.coordinates?.lat || 0),
                longitude: Number(p.longitude || p.coordinates?.lng || 0),
                buildings: Array.isArray(p.buildings) ? p.buildings : [],
                address_full:
                    p.address_full ||
                    [street, city, state, zip].filter(Boolean).join(', ') ||
                    p.Property_Name ||
                    'Property',
                type: p.type || p.Property_Type || 'Residential',
                owner_id: p.owner_id || p.account_id || '',
                account_id: p.account_id || p.owner_id || '',
                account_name: p.account_name || '',
            });
        });
        return Array.from(map.values());
    }, [mockProperties, fsProperties]);

    const projects = React.useMemo(() => {
        const map = new Map<string, any>();
        mockProjects.forEach((pr) => map.set(pr._id, pr));
        fsProjects.forEach((pr) => {
            const id = pr.id || pr._id;
            if (!id) return;
            map.set(id, {
                ...pr,
                _id: id,
                id,
                name: pr.name || 'Project',
                job_number: pr.job_number || '',
                account_id: pr.account_id || pr.owner_id || pr.user_id || '',
                property_id: pr.property_id || '',
                current_stage: pr.current_stage || 'Lead',
                status: pr.status || 'Active',
            });
        });
        return Array.from(map.values());
    }, [mockProjects, fsProjects]);

    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
    const [shouldRender, setShouldRender] = useState(false);
    const [isAnimatingIn, setIsAnimatingIn] = useState(false);
    const [confirmedAddress, setConfirmedAddress] = useState<{
        lat: number;
        lng: number;
        label: string;
        addressData?: any;
    } | null>(null);

    useEffect(() => {
        const handler = setTimeout(() => setDebouncedSearchQuery(searchQuery), 120);
        return () => clearTimeout(handler);
    }, [searchQuery]);

    const [showSuggestions, setShowSuggestions] = useState(false);
    const [highlightedSuggestion, setHighlightedSuggestion] = useState(-1);

    useEffect(() => {
        const handleOpen = (e?: Event) => {
            if (!currentUser || !['Employee', 'Admin', 'Super Admin'].includes(currentUser.role)) {
                return;
            }
            const detail = (e as CustomEvent)?.detail;
            const prefill = detail?.prefill ?? detail?.query ?? '';
            setSearchQuery(prefill);
            setIsOpen(true);
        };
        window.addEventListener('open-customer-lookup', handleOpen);
        return () => window.removeEventListener('open-customer-lookup', handleOpen);
    }, [currentUser]);

    useEffect(() => {
        if (isOpen) {
            setShouldRender(true);
            const timer = setTimeout(() => setIsAnimatingIn(true), 10);
            return () => clearTimeout(timer);
        } else {
            setIsAnimatingIn(false);
            const timer = setTimeout(() => setShouldRender(false), 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    const isApiReady = useGoogleMapsApi();
    const inputRef = useRef<HTMLInputElement>(null);
    const autocompleteRef = useRef<any>(null);

    useEffect(() => {
        const styleId = 'pac-container-rhive-theme';
        if (!document.getElementById(styleId)) {
            const styleEl = document.createElement('style');
            styleEl.id = styleId;
            styleEl.innerHTML = `
                .pac-container {
                    background: #050505 !important;
                    border: 1px solid rgba(236, 2, 139, 0.35) !important;
                    border-top: none !important;
                    box-shadow: 0 8px 32px rgba(0,0,0,0.8), 0 0 20px rgba(236,2,139,0.12) !important;
                    border-radius: 0 !important;
                    clip-path: polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%) !important;
                    font-family: 'Rubik', sans-serif !important;
                    z-index: 99999 !important;
                    margin-top: 2px !important;
                }
                .pac-item {
                    background: transparent !important;
                    border-top: 1px solid rgba(255,255,255,0.04) !important;
                    padding: 8px 12px !important;
                    cursor: pointer !important;
                    display: flex !important;
                    align-items: center !important;
                    gap: 8px !important;
                }
                .pac-item:hover, .pac-item-selected { background: rgba(236, 2, 139, 0.08) !important; }
                .pac-item-query { color: #ffffff !important; font-size: 11px !important; font-weight: 700 !important; }
                .pac-matched { color: #ec028b !important; font-weight: 900 !important; }
                .pac-item span:last-child { color: #6b7280 !important; font-size: 10px !important; font-family: monospace !important; }
                .pac-logo:after { background-image: none !important; content: '' !important; }
            `;
            document.head.appendChild(styleEl);
        }
    }, []);

    useEffect(() => {
        if (!isOpen || !isApiReady || !inputRef.current) return;
        try {
            if (!window.google?.maps?.places?.Autocomplete) return;
            autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
                types: ['address'],
                fields: ['formatted_address', 'geometry', 'address_components'],
                componentRestrictions: { country: 'us' },
            });
            autocompleteRef.current.addListener('place_changed', () => {
                const place = autocompleteRef.current?.getPlace();
                if (place && place.formatted_address) {
                    setSearchQuery(place.formatted_address);
                    if (place.geometry) {
                        const lat = place.geometry.location.lat();
                        const lng = place.geometry.location.lng();
                        const comps = place.address_components || [];
                        let streetNumber = '', route = '', city = '', state = '', zip = '';
                        for (const c of comps) {
                            switch (c.types[0]) {
                                case 'street_number': streetNumber = c.long_name; break;
                                case 'route': route = c.short_name; break;
                                case 'locality': city = c.long_name; break;
                                case 'administrative_area_level_1': state = c.short_name; break;
                                case 'postal_code': zip = c.short_name; break;
                            }
                        }
                        const shortAddr = streetNumber && route ? `${streetNumber} ${route}` : place.formatted_address.split(',')[0];
                        const addressData = { address: shortAddr, city, state, zip, latitude: lat, longitude: lng };
                        sessionStorage.setItem('globalSearchAddressData', JSON.stringify(addressData));
                        setConfirmedAddress({ lat, lng, label: place.formatted_address, addressData });
                    }
                }
            });
        } catch {
            // Places autocomplete unavailable
        }
        return () => {
            if (autocompleteRef.current && window.google?.maps?.event) {
                window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
                autocompleteRef.current = null;
            }
        };
    }, [isOpen, isApiReady]);

    useEffect(() => {
        const styleId = 'pac-container-visibility';
        let styleEl = document.getElementById(styleId) as HTMLStyleElement | null;
        if (!styleEl) {
            styleEl = document.createElement('style');
            styleEl.id = styleId;
            document.head.appendChild(styleEl);
        }
        if (isOpen && searchQuery && !isAddressLike(searchQuery)) {
            styleEl.innerHTML = `.pac-container { display: none !important; }`;
        } else {
            styleEl.innerHTML = '';
        }
        return () => {
            if (styleEl) styleEl.innerHTML = '';
        };
    }, [searchQuery, isOpen]);

    if (!shouldRender) return null;

    const queryType = decipherQueryType(searchQuery);
    const suggestionsQuery = searchQuery.trim().toLowerCase();
    const autocompleteSuggestions: { label: string; sub?: string; type: string; id?: string }[] = [];

    if (suggestionsQuery.length >= 1) {
        users.forEach((u) => {
            if (u.role !== 'Customer') return;
            if (
                u.name.toLowerCase().includes(suggestionsQuery) ||
                (u.email && u.email.toLowerCase().includes(suggestionsQuery)) ||
                matchesPhoneQuery(u.phone, searchQuery)
            ) {
                autocompleteSuggestions.push({
                    label: u.name,
                    sub: [u.phone, u.email].filter(Boolean).join(' · '),
                    type: u._entityKind === 'account' ? 'Account' : 'Contact',
                    id: u.id,
                });
            }
        });

        properties.forEach((p) => {
            if (
                p.address_full.toLowerCase().includes(suggestionsQuery) ||
                (p.name && p.name.toLowerCase().includes(suggestionsQuery))
            ) {
                autocompleteSuggestions.push({
                    label: p.address_full,
                    sub: p.name !== p.address_full ? p.name : undefined,
                    type: 'Address',
                    id: p._id,
                });
            }
        });

        projects.forEach((pr) => {
            if (
                pr.name.toLowerCase().includes(suggestionsQuery) ||
                (pr.job_number && pr.job_number.toLowerCase().includes(suggestionsQuery))
            ) {
                autocompleteSuggestions.push({
                    label: pr.name,
                    sub: pr.job_number ? `${pr.job_number} · ${pr.current_stage}` : pr.current_stage,
                    type: 'Project',
                    id: pr._id,
                });
            }
        });
    }

    const seenLabels = new Set<string>();
    const uniqueSuggestions = autocompleteSuggestions
        .filter((s) => {
            const key = `${s.type}:${s.label.toLowerCase()}`;
            if (seenLabels.has(key)) return false;
            seenLabels.add(key);
            return true;
        })
        .slice(0, 6);

    const highlightMatch = (text: string, query: string) => {
        if (!query) return <>{text}</>;
        const idx = text.toLowerCase().indexOf(query.toLowerCase());
        if (idx === -1) return <>{text}</>;
        return (
            <>
                {text.slice(0, idx)}
                <span className="text-rhive-pink font-black">{text.slice(idx, idx + query.length)}</span>
                {text.slice(idx + query.length)}
            </>
        );
    };

    // Deep Smart Search Logic (Multi-format Phone + Email + Account + Campus + Project)
    const searchLower = debouncedSearchQuery.toLowerCase().trim();
    const matchedCustomerIds = new Set<string>();
    const matchedPropIds = new Set<string>();

    if (searchLower) {
        users.forEach((u) => {
            if (u.role !== 'Customer') return;
            const matches =
                u.name.toLowerCase().includes(searchLower) ||
                (u.contactName && u.contactName.toLowerCase().includes(searchLower)) ||
                (u.email && u.email.toLowerCase().includes(searchLower)) ||
                matchesPhoneQuery(u.phone, debouncedSearchQuery);
            if (matches) {
                matchedCustomerIds.add(u.id);
                if (u.account_id) matchedCustomerIds.add(u.account_id);
            }
        });

        properties.forEach((p) => {
            const bldMatch = Array.isArray(p.buildings)
                ? p.buildings.some((b: any) => String(b.name || '').toLowerCase().includes(searchLower))
                : false;
            const matches =
                p.address_full.toLowerCase().includes(searchLower) ||
                (p.name && p.name.toLowerCase().includes(searchLower)) ||
                p.type.toLowerCase().includes(searchLower) ||
                bldMatch;
            if (matches) {
                matchedPropIds.add(p._id);
                if (p.owner_id) matchedCustomerIds.add(p.owner_id);
                if (p.account_id) matchedCustomerIds.add(p.account_id);
            }
        });

        projects.forEach((pr) => {
            const matches =
                pr.name.toLowerCase().includes(searchLower) ||
                (pr.job_number && pr.job_number.toLowerCase().includes(searchLower)) ||
                pr.current_stage.toLowerCase().includes(searchLower) ||
                pr.status.toLowerCase().includes(searchLower) ||
                matchesPhoneQuery(pr.contact_phone, debouncedSearchQuery) ||
                (pr.contact_email && pr.contact_email.toLowerCase().includes(searchLower));
            if (matches && pr.account_id) {
                matchedCustomerIds.add(pr.account_id);
            }
        });
    }

    const searchResults = searchLower ? users.filter((u) => matchedCustomerIds.has(u.id)) : [];
    const shownOwnerIds = new Set(searchResults.map((u) => u.id));
    const orphanProperties = searchLower
        ? properties.filter((p) => matchedPropIds.has(p._id) && !shownOwnerIds.has(p.owner_id) && !shownOwnerIds.has(p.account_id))
        : [];

    const isAssociated = searchResults.length > 0 || orphanProperties.length > 0;
    const associationStatus = isAssociated ? 'Existing Match' : 'New Caller';

    // Launch New Project Input (E-02a) for a brand-new caller (Case A)
    const launchNewCallerIntake = (rawOverride?: string) => {
        const raw = (rawOverride ?? searchQuery).trim();
        const detected = decipherQueryType(raw);
        setIsOpen(false);
        if (!raw) {
            navigateToIntake({});
            return;
        }
        sessionStorage.setItem('globalSearchQuery', raw);
        sessionStorage.setItem('globalSearchQueryType', detected || 'Name');

        const prefillPayload: Record<string, any> = { isNewCaller: true };
        if (detected === 'Phone Number') {
            prefillPayload.contactPhone = raw;
        } else if (detected === 'Email') {
            prefillPayload.contactEmail = raw;
        } else if (detected === 'Company') {
            prefillPayload.parentCompany = raw;
            prefillPayload.projectCategory = raw.toLowerCase().includes('dfcm') || raw.toLowerCase().includes('udot') ? 'Government' : 'Commercial';
        } else if (detected === 'Note') {
            prefillPayload.projectNotes = raw;
        } else if (detected === 'Address') {
            if (confirmedAddress?.addressData) {
                Object.assign(prefillPayload, confirmedAddress.addressData);
            } else {
                prefillPayload.address = raw;
            }
        } else {
            prefillPayload.contactName = raw;
        }

        navigateToIntake({
            category: prefillPayload.projectCategory,
            address: detected === 'Address' ? raw : undefined,
            prefillPayload,
        });
    };

    // Launch New Project Input (E-02a) prefilled for an existing Account/Contact & optional Property (Case B)
    const launchExistingEntityProject = (cust: any, prop?: any) => {
        const accId = cust._entityKind === 'account' ? cust.id : cust.account_id || cust.id;
        const linkedContacts = allContactsList.filter(
            (c) =>
                c.account_id === accId ||
                c.id === cust.id ||
                (prop && c.property_id === prop._id)
        );
        const fallbackContacts =
            linkedContacts.length > 0
                ? linkedContacts
                : [
                      {
                          firstName: cust.firstName || (cust.contactName || cust.name || '').split(' ')[0] || 'Primary',
                          lastName: cust.lastName || (cust.contactName || cust.name || '').split(' ').slice(1).join(' ') || 'Contact',
                          phone: cust.phone || '',
                          email: cust.email || '',
                          role: cust.contactRole || 'Property Owner',
                      },
                  ];

        const rawType = String(prop?.type || cust._accountType || 'Residential').toLowerCase();
        const projectCategory: 'Residential' | 'Commercial' | 'Government' = rawType.includes('gov')
            ? 'Government'
            : rawType.includes('comm') || isCompanyLike(cust.name || '')
            ? 'Commercial'
            : 'Residential';

        const prefillPayload: Record<string, any> = {
            accountId: accId,
            parentCompany: projectCategory !== 'Residential' ? cust.name : '',
            projectCategory,
            contacts: fallbackContacts,
            contactName: fallbackContacts[0] ? `${fallbackContacts[0].firstName} ${fallbackContacts[0].lastName}`.trim() : cust.name,
            contactEmail: fallbackContacts[0]?.email || cust.email || '',
            contactPhone: fallbackContacts[0]?.phone || cust.phone || '',
        };

        if (prop) {
            prefillPayload.propertyId = prop._id;
            prefillPayload.propertyName = prop.name || prop.address_full;
            prefillPayload.address = prop.property_address || prop.address_full;
            prefillPayload.city = prop.city || '';
            prefillPayload.state = prop.state || 'UT';
            prefillPayload.zip = prop.zip || '';
            prefillPayload.latitude = prop.latitude || 0;
            prefillPayload.longitude = prop.longitude || 0;
            prefillPayload.buildings = Array.isArray(prop.buildings) ? prop.buildings : [];
        }

        setIsOpen(false);
        navigateToIntake({ category: projectCategory, prefillPayload });
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Tab' && searchQuery.trim() !== '') {
            const pacItems = document.querySelectorAll('.pac-item');
            if (pacItems && pacItems.length > 0) {
                e.preventDefault();
                (pacItems[0] as HTMLElement).click();
                setTimeout(() => {
                    const currentVal = inputRef.current?.value || searchQuery;
                    launchNewCallerIntake(currentVal);
                }, 260);
                return;
            }
            if (!isAssociated) {
                e.preventDefault();
                launchNewCallerIntake(searchQuery);
            }
        }
    };

    return (
        <div
            className={cn(
                'fixed inset-0 z-[9999] transition-all duration-300 flex flex-col items-center justify-start pt-2 px-4 bg-transparent',
                isAnimatingIn ? 'bg-black/55 backdrop-blur-xs pointer-events-auto' : 'pointer-events-none'
            )}
            onClick={(e) => {
                if (e.target === e.currentTarget) setIsOpen(false);
            }}
        >
            <div
                className={cn(
                    'w-full max-w-2xl flex flex-col relative transition-all duration-300 transform',
                    isAnimatingIn ? 'translate-y-12 opacity-100' : '-translate-y-full opacity-0'
                )}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-1.5 px-1">
                    <span className="text-[10px] text-gray-400 font-mono tracking-widest uppercase font-bold">
                        First-Call Omnisearch & Instant Intake
                    </span>
                    <div className="flex items-center gap-2">
                        {queryType && (
                            <span
                                id="search-mode-badge"
                                className="px-2 py-0.5 text-[9px] font-black uppercase tracking-widest bg-rhive-pink/15 text-rhive-pink border border-rhive-pink/30 font-mono"
                            >
                                Detected: {queryType} ({associationStatus})
                            </span>
                        )}
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="text-[10px] font-mono uppercase tracking-wider text-gray-500 hover:text-white px-2 py-0.5"
                        >
                            Close
                        </button>
                    </div>
                </div>

                <div
                    className="bg-[#050505] border border-gray-800 p-2.5 shadow-2xl relative"
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
                            placeholder="Type phone, email, caller name, company/HOA, or property address..."
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setShowSuggestions(true);
                                setHighlightedSuggestion(-1);
                                setConfirmedAddress(null);
                            }}
                            onKeyDown={(e) => {
                                if (uniqueSuggestions.length > 0 && showSuggestions) {
                                    if (e.key === 'ArrowDown') {
                                        e.preventDefault();
                                        setHighlightedSuggestion((h) => Math.min(h + 1, uniqueSuggestions.length - 1));
                                        return;
                                    }
                                    if (e.key === 'ArrowUp') {
                                        e.preventDefault();
                                        setHighlightedSuggestion((h) => Math.max(h - 1, -1));
                                        return;
                                    }
                                    if (e.key === 'Enter' && highlightedSuggestion >= 0) {
                                        e.preventDefault();
                                        setSearchQuery(uniqueSuggestions[highlightedSuggestion].label);
                                        setShowSuggestions(false);
                                        setHighlightedSuggestion(-1);
                                        return;
                                    }
                                }
                                if (e.key === 'Escape') {
                                    setIsOpen(false);
                                    return;
                                }
                                handleKeyDown(e);
                            }}
                            className="w-full bg-black/70 border border-gray-700 focus:border-[#ec028b] py-3.5 pl-12 pr-4 outline-none text-white text-xs font-semibold tracking-wide transition-all"
                            style={{ clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)' }}
                            autoFocus
                        />
                    </div>

                    {/* Autocomplete Suggestions */}
                    {showSuggestions && uniqueSuggestions.length > 0 && (
                        <div
                            className="mt-2 border border-rhive-pink/20 bg-[#050505] shadow-[0_0_20px_rgba(236,2,139,0.08)] overflow-hidden"
                            style={{ clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)' }}
                        >
                            <div className="px-3 py-1.5 border-b border-gray-900 flex items-center justify-between">
                                <span className="text-[8px] font-black uppercase tracking-widest text-rhive-pink">Instant Matches</span>
                                <span className="text-[8px] text-gray-600 font-mono">↑↓ select · Enter apply</span>
                            </div>
                            {uniqueSuggestions.map((s, i) => (
                                <button
                                    key={`${s.type}-${s.id || i}`}
                                    type="button"
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                        setSearchQuery(s.label);
                                        setShowSuggestions(false);
                                        setHighlightedSuggestion(-1);
                                    }}
                                    onMouseEnter={() => setHighlightedSuggestion(i)}
                                    className={cn(
                                        'w-full flex items-center justify-between px-4 py-2.5 text-left text-xs transition-all outline-none cursor-pointer border-b border-gray-900/60 last:border-0',
                                        i === highlightedSuggestion ? 'bg-rhive-pink/10 text-white' : 'text-gray-300 hover:bg-white/5 hover:text-white'
                                    )}
                                >
                                    <span className="flex items-center gap-2 min-w-0">
                                        <span
                                            className={cn(
                                                'text-[8px] font-black uppercase tracking-widest shrink-0 px-1.5 py-0.5 rounded border',
                                                s.type === 'Account'
                                                    ? 'bg-purple-500/10 text-purple-300 border-purple-500/30'
                                                    : s.type === 'Contact'
                                                    ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                                    : s.type === 'Address'
                                                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                                    : 'bg-rhive-pink/10 text-rhive-pink border-rhive-pink/20'
                                            )}
                                        >
                                            {s.type}
                                        </span>
                                        <span className="truncate font-medium">{highlightMatch(s.label, suggestionsQuery)}</span>
                                        {s.sub && <span className="text-[10px] text-gray-500 font-mono truncate">({s.sub})</span>}
                                    </span>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Google Maps Confirmed Address Preview */}
                    {confirmedAddress && (
                        <div
                            className="mt-2 border border-[#ec028b]/30 bg-[#050505] overflow-hidden shadow-[0_0_20px_rgba(236,2,139,0.1)] p-3 flex items-center justify-between gap-4"
                            style={{ clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)' }}
                        >
                            <div className="min-w-0">
                                <span className="text-[8px] font-black uppercase tracking-widest text-[#ec028b] block mb-0.5">
                                    Verified Parcel Coordinates
                                                                </span>
                                <p className="text-xs text-white font-semibold truncate">{confirmedAddress.label}</p>
                                <p className="text-[9px] text-gray-500 font-mono">
                                    {confirmedAddress.lat.toFixed(5)}, {confirmedAddress.lng.toFixed(5)}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => launchNewCallerIntake(confirmedAddress.label)}
                                className="px-3.5 py-2 bg-[#ec028b] hover:bg-[#ec028b]/90 text-white text-[10px] font-black uppercase tracking-widest shrink-0 shadow-[0_0_15px_rgba(236,2,139,0.3)]"
                            >
                                Create
                            </button>
                        </div>
                    )}

                    {/* CASE A: Brand-New Caller Action Card (Visible for Phone, Email, Name, Company, Address, Note) */}
                    {searchQuery.trim() !== '' && !isAssociated && (
                        <div className="mt-2.5 p-3.5 bg-[#ec028b]/10 border border-[#ec028b]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div id="search-success-banner" className="min-w-0">
                                <p className="text-xs font-bold text-white truncate">
                                    No existing match for "{searchQuery.trim()}"
                                </p>
                                <p className="text-[10px] text-gray-300 font-mono mt-0.5">
                                    Prefills {queryType || 'Caller'} directly into New Project Input (or press Tab)
                                </p>
                            </div>
                            <button
                                id="btn-initiate-project"
                                type="button"
                                onClick={() => launchNewCallerIntake(searchQuery)}
                                className="px-4 py-2 bg-[#ec028b] hover:bg-[#ec028b]/90 text-white text-[11px] font-black uppercase tracking-widest shrink-0 shadow-[0_0_18px_rgba(236,2,139,0.4)] cursor-pointer"
                            >
                                Create
                            </button>
                        </div>
                    )}
                </div>

                {/* CASE B: Existing Matches (Accounts, Contacts, Multi-Property Campuses & Open/Past Projects) */}
                {isAssociated && (
                    <div
                        className="mt-2 bg-[#050505] border border-gray-800 p-4 space-y-3 shadow-2xl max-h-[62vh] overflow-y-auto"
                        style={{ clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)' }}
                    >
                        {searchResults.map((cust) => {
                            const custProperties = properties.filter(
                                (p) =>
                                    p.owner_id === cust.id ||
                                    p.account_id === cust.id ||
                                    (cust.account_id && (p.owner_id === cust.account_id || p.account_id === cust.account_id))
                            );
                            const custProjects = projects.filter(
                                (pr) =>
                                    pr.account_id === cust.id ||
                                    (cust.account_id && pr.account_id === cust.account_id)
                            );

                            const accTypeRaw = String(cust._accountType || '').toLowerCase();
                            const badgeLabel = accTypeRaw.includes('gov')
                                ? 'Government Account'
                                : accTypeRaw.includes('comm') || isCompanyLike(cust.name || '')
                                ? 'Commercial Account'
                                : cust._entityKind === 'account'
                                ? 'Residential Account'
                                : 'Contact';

                            return (
                                <div
                                    key={cust.id}
                                    className="p-4 bg-white/5 border border-gray-800 hover:border-gray-700 space-y-3"
                                    style={{ clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)' }}
                                >
                                    <div className="flex flex-wrap items-start justify-between gap-3">
                                        <div>
                                            <span className="text-[9px] font-black uppercase tracking-widest text-[#ec028b] block mb-1">
                                                {badgeLabel}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setIsOpen(false);
                                                    if (cust._entityKind === 'account') {
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
                                            <p className="text-[10px] text-gray-400 font-mono mt-0.5">
                                                {cust.email || 'No email'} | {cust.phone || 'No phone'}
                                            </p>
                                        </div>

                                        <button
                                            id={`search-new-account-proj-${cust.id}`}
                                            type="button"
                                            onClick={() => launchExistingEntityProject(cust)}
                                            className="px-3 py-1.5 bg-[#ec028b]/15 hover:bg-[#ec028b] border border-[#ec028b]/60 text-[#ec028b] hover:text-white text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer"
                                            title="Start a new property or project for this customer"
                                        >
                                            + Create
                                        </button>
                                    </div>

                                    {custProperties.length > 0 && (
                                        <div className="pt-2.5 border-t border-gray-900/60 space-y-1.5">
                                            <span className="text-[9px] font-black uppercase tracking-widest text-gray-500 block">
                                                Linked Properties & Buildings ({custProperties.length})
                                            </span>
                                            {custProperties.map((prop) => {
                                                const bCount = Array.isArray(prop.buildings) ? prop.buildings.length : 0;
                                                return (
                                                    <div
                                                        key={prop._id}
                                                        className="flex items-center justify-between gap-2 bg-black/40 border border-gray-800/80 px-2.5 py-1.5 rounded"
                                                    >
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setIsOpen(false);
                                                                setSelectedPropertyId(prop._id);
                                                                setActivePageId('E-12');
                                                            }}
                                                            className="text-xs text-gray-200 hover:text-[#ec028b] hover:underline transition-all text-left truncate outline-none"
                                                        >
                                                            <GoogleMapsPinIcon />
                                                            {prop.address_full}
                                                            <span className="ml-1.5 text-[10px] text-gray-500 font-mono">
                                                                ({prop.type}{bCount > 0 ? ` · ${bCount} Bldgs` : ''})
                                                            </span>
                                                        </button>
                                                        <button
                                                            id={`search-new-prop-proj-${prop._id}`}
                                                            type="button"
                                                            onClick={() => launchExistingEntityProject(cust, prop)}
                                                            className="px-2.5 py-1 bg-black hover:bg-[#ec028b] border border-[#ec028b]/50 text-[#ec028b] hover:text-white text-[9px] font-black uppercase tracking-wider shrink-0 transition-all cursor-pointer"
                                                            title="Start new project on this property"
                                                        >
                                                            Create
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}

                                    {custProjects.length > 0 && (
                                        <div className="pt-2.5 border-t border-gray-900/60">
                                            <span className="text-[9px] font-black uppercase tracking-widest text-gray-500 block mb-1.5">
                                                Open & Past Projects ({custProjects.length})
                                            </span>
                                            <div className="flex flex-wrap gap-2">
                                                {custProjects.map((proj) => (
                                                    <button
                                                        key={proj._id}
                                                        type="button"
                                                        onClick={() => {
                                                            const pid = proj.id || proj._id;
                                                            setSelectedProjectId(pid);
                                                            setCurrentProjectId(pid);
                                                            setIsOpen(false);
                                                            setActivePageId(getStagePageId(proj.current_stage));
                                                        }}
                                                        className="text-xs text-[#ec028b] hover:text-white bg-[#ec028b]/5 hover:bg-[#ec028b]/20 border border-[#ec028b]/30 px-2.5 py-1 rounded transition-all text-left outline-none font-bold"
                                                    >
                                                        {proj.name}
                                                        <span className="ml-1.5 text-[9px] text-gray-300 font-mono uppercase">
                                                            [{proj.current_stage}]
                                                        </span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        {/* Standalone / Orphan Properties (when owner_id is unlinked) */}
                        {orphanProperties.map((prop) => (
                            <div
                                key={prop._id}
                                className="p-4 bg-white/5 border border-gray-800 flex items-center justify-between gap-3"
                            >
                                <div className="min-w-0">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-amber-400 block mb-1">
                                        Property Record ({prop.type})
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsOpen(false);
                                            setSelectedPropertyId(prop._id);
                                            setActivePageId('E-12');
                                        }}
                                        className="text-sm font-bold text-white hover:text-[#ec028b] hover:underline truncate block"
                                    >
                                        <GoogleMapsPinIcon /> {prop.address_full}
                                    </button>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsOpen(false);
                                        navigateToIntake({
                                            category: prop.type?.toLowerCase().includes('gov')
                                                ? 'Government'
                                                : prop.type?.toLowerCase().includes('comm')
                                                ? 'Commercial'
                                                : 'Residential',
                                            prefillPayload: {
                                                propertyId: prop._id,
                                                propertyName: prop.name || prop.address_full,
                                                address: prop.property_address || prop.address_full,
                                                city: prop.city || '',
                                                state: prop.state || 'UT',
                                                zip: prop.zip || '',
                                                latitude: prop.latitude || 0,
                                                longitude: prop.longitude || 0,
                                                buildings: prop.buildings || [],
                                            },
                                        });
                                    }}
                                    className="px-3 py-1.5 bg-[#ec028b] text-white text-[10px] font-black uppercase tracking-widest shrink-0"
                                >
                                    Create
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
