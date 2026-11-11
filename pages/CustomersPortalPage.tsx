import React, { useState, useEffect, useMemo } from 'react';
import PageContainer from '../components/PageContainer';
import Button from '../components/Button';
import CircuitryCard from '../components/CircuitryCard';
import { useNavigation } from '../contexts/NavigationContext';
import { useMockDB } from '../contexts/MockDatabaseContext';
import { accountService, propertyService, projectService, userLogService } from '../lib/firebaseService';
import { 
    UserIcon, 
    UsersIcon, 
    BuildingStorefrontIcon, 
    BriefcaseIcon, 
    MapPinIcon, 
    PlusIcon, 
    ChevronRightIcon, 
    ChevronDownIcon, 
    SearchIcon, 
    CurrencyDollarIcon, 
    ClockIcon, 
    ArrowRightIcon, 
    XIcon, 
    ShieldCheckIcon,
    Check,
    WrenchIcon,
    Squares2x2Icon,
    ListBulletIcon
} from '../components/icons';
import { cn, formatCurrency, getStagePageId } from '../lib/utils';
import type { 
    CustomerClient, 
    PropertyCampus, 
    SubPropertyPhase, 
    BuildingAsset, 
    ProjectJob, 
    CustomerType 
} from '../types';

// ── Initial Relational Demonstration Records ────────────────────────────────────
// Seed data showcasing the exact 5-tier architecture:
// Tier 1: Client -> Tier 2: Campus -> Tier 3: Phase -> Tier 4: Building -> Tier 5: Job
const SEED_CLIENTS: CustomerClient[] = [
    {
        id: 'CLI-UNPHC',
        name: 'UNPHC (United Property Management)',
        customer_type: 'Commercial',
        account_code: 'UNPHC-CORP',
        billing_address: '123 Corporate Blvd, Salt Lake City, UT 84101',
        primary_contact: {
            name: 'Sarah Jenkins',
            email: 'sjenkins@unphc.com',
            phone: '(801) 555-8921',
            role: 'VP of Asset Management'
        },
        notes: 'Major commercial account with multi-family residential campuses across the Wasatch Front.',
        created_at: '2026-01-15T08:00:00.000Z',
        updated_at: '2026-10-12T14:30:00.000Z',
        campuses: [
            {
                id: 'CAMP-ESCALANTE',
                client_id: 'CLI-UNPHC',
                name: 'Escalante Park Campus',
                address: '1050 N 300 W',
                city: 'Salt Lake City',
                state: 'UT',
                zip: '84103',
                coordinates: { lat: 40.7892, lng: -111.9012 },
                manager_contact: {
                    name: 'Marcus Vance',
                    phone: '(801) 555-4301',
                    email: 'mvance@unphc-escalante.com'
                },
                notes: 'Gate code #4092. Dedicated commercial loading zone behind Building 3.',
                phases: [
                    {
                        id: 'PHASE-ESC-1',
                        campus_id: 'CAMP-ESCALANTE',
                        name: 'Escalante 1',
                        phase_number: 'Phase 1',
                        description: 'North residential quad completed in 2018.',
                        buildings: [
                            {
                                id: 'BLDG-ESC-3N',
                                phase_id: 'PHASE-ESC-1',
                                name: 'Building 3 - North',
                                building_code: 'ESC-B3-N',
                                roof_type: '.060MIL TPO Flat Membrane',
                                roof_sqft: 14434,
                                stories: 2,
                                pitch: '0.5/12 Low Slope',
                                year_installed: 2012,
                                condition: 'Under Replacement',
                                map_annotation: {
                                    pin_color: '#ec028b',
                                    notes: 'Drain sump ponding observed during winter freeze.',
                                    coordinates: { lat: 40.7895, lng: -111.9015 }
                                },
                                jobs: [
                                    {
                                        id: 'JOB-ESC-001',
                                        building_id: 'BLDG-ESC-3N',
                                        title: 'Flat Roof Replacement - 14,434 sqft',
                                        job_number: 'RC-2026-081',
                                        scope_type: 'Flat Roof Replacement',
                                        current_stage: 'Stage 7: INSTALL (In Progress)',
                                        contract_value: 118500,
                                        status: 'Active',
                                        assigned_contractor: 'Apex Commercial Roofing',
                                        target_completion: '2026-10-28',
                                        created_at: '2026-08-10T10:00:00.000Z',
                                        updated_at: '2026-10-12T16:00:00.000Z'
                                    },
                                    {
                                        id: 'JOB-ESC-002',
                                        building_id: 'BLDG-ESC-3N',
                                        title: 'Perimeter Heat Trace Defense System',
                                        job_number: 'RC-2026-084',
                                        scope_type: 'Heat Trace',
                                        current_stage: 'Stage 4: SIGN & VERIFY (Agreement)',
                                        contract_value: 14200,
                                        status: 'Under Review',
                                        assigned_contractor: 'RHIVE Certified Install',
                                        target_completion: '2026-11-05',
                                        created_at: '2026-09-02T11:00:00.000Z',
                                        updated_at: '2026-10-11T09:30:00.000Z'
                                    }
                                ]
                            },
                            {
                                id: 'BLDG-ESC-CLUB',
                                phase_id: 'PHASE-ESC-1',
                                name: 'Building 1 - Clubhouse & Leasing',
                                building_code: 'ESC-B1-CLUB',
                                roof_type: 'TruDefinition® Duration® Architectural Shingles',
                                roof_sqft: 5200,
                                stories: 1,
                                pitch: '6/12 Pitched',
                                year_installed: 2021,
                                condition: 'Good',
                                map_annotation: {
                                    pin_color: '#10b981',
                                    notes: 'Inspected Spring 2026. Zero granule loss.',
                                    coordinates: { lat: 40.7891, lng: -111.9009 }
                                },
                                jobs: [
                                    {
                                        id: 'JOB-ESC-003',
                                        building_id: 'BLDG-ESC-CLUB',
                                        title: 'Seamless Gutter Cleanout & Annual Inspection',
                                        job_number: 'RC-2026-012',
                                        scope_type: 'Gutter Defense',
                                        current_stage: 'Stage 10: COMPLETED (Paid)',
                                        contract_value: 3200,
                                        status: 'Completed',
                                        assigned_contractor: 'RHIVE Service Fleet',
                                        target_completion: '2026-04-15',
                                        created_at: '2026-03-20T08:00:00.000Z',
                                        updated_at: '2026-04-15T15:00:00.000Z'
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        id: 'PHASE-ESC-2',
                        campus_id: 'CAMP-ESCALANTE',
                        name: 'Escalante II',
                        phase_number: 'Phase 2',
                        description: 'South townhouse row completed in 2021.',
                        buildings: [
                            {
                                id: 'BLDG-ESC-5S',
                                phase_id: 'PHASE-ESC-2',
                                name: 'Building 5 - South Townhomes',
                                building_code: 'ESC-B5-S',
                                roof_type: 'TruDefinition® Duration® Flex SBS Polymers',
                                roof_sqft: 8800,
                                stories: 2,
                                pitch: '4/12 Pitched',
                                year_installed: 2021,
                                condition: 'Good',
                                jobs: [
                                    {
                                        id: 'JOB-ESC-004',
                                        building_id: 'BLDG-ESC-5S',
                                        title: 'Hail Impact Assessment & Drone Inspection',
                                        job_number: 'RC-2026-092',
                                        scope_type: 'Drone Assessment',
                                        current_stage: 'Stage 3: QUOTE (Pricing Options)',
                                        contract_value: 18500,
                                        status: 'Under Review',
                                        assigned_contractor: 'RHIVE Certified Install',
                                        target_completion: '2026-11-15',
                                        created_at: '2026-09-18T14:00:00.000Z',
                                        updated_at: '2026-10-08T10:15:00.000Z'
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: 'CLI-SLC-GOV',
        name: 'City of Salt Lake City',
        customer_type: 'Government',
        account_code: 'SLC-MUNI',
        billing_address: '451 S State St, Salt Lake City, UT 84111',
        primary_contact: {
            name: 'David Reynolds',
            email: 'david.reynolds@slcgov.com',
            phone: '(801) 535-6200',
            role: 'Facilities Director'
        },
        notes: 'Municipal facilities and public works buildings under state-contract pricing terms.',
        created_at: '2026-02-01T09:00:00.000Z',
        updated_at: '2026-10-11T12:00:00.000Z',
        campuses: [
            {
                id: 'CAMP-SLC-FLEET',
                client_id: 'CLI-SLC-GOV',
                name: 'Municipal Fleet Maintenance Campus',
                address: '1530 S Industrial Rd',
                city: 'Salt Lake City',
                state: 'UT',
                zip: '84104',
                coordinates: { lat: 40.7381, lng: -111.9320 },
                manager_contact: {
                    name: 'Elena Rostova',
                    phone: '(801) 535-7140',
                    email: 'elena.rostova@slcgov.com'
                },
                phases: [
                    {
                        id: 'PHASE-FLEET-A',
                        campus_id: 'CAMP-SLC-FLEET',
                        name: 'Heavy Equipment Maintenance Bay',
                        phase_number: 'Phase A',
                        description: 'Industrial vehicle bays with high thermal exposure.',
                        buildings: [
                            {
                                id: 'BLDG-FLEET-BAY1',
                                phase_id: 'PHASE-FLEET-A',
                                name: 'Building A - Main Heavy Repair Bay',
                                building_code: 'SLC-FL-A1',
                                roof_type: '.080MIL RhinoBond® Reinforced TPO',
                                roof_sqft: 28000,
                                stories: 1,
                                pitch: '0.25/12 Low Slope',
                                year_installed: 2015,
                                condition: 'Critical',
                                map_annotation: {
                                    pin_color: '#ef4444',
                                    notes: 'Puncture damage over compressor intake exhaust stack.',
                                    coordinates: { lat: 40.7384, lng: -111.9325 }
                                },
                                jobs: [
                                    {
                                        id: 'JOB-SLC-001',
                                        building_id: 'BLDG-FLEET-BAY1',
                                        title: 'High-Performance .080 TPO Re-Roof & Skylight Retrofit',
                                        job_number: 'RC-2026-065',
                                        scope_type: 'Commercial Membrane',
                                        current_stage: 'Stage 5: SCHEDULE (Queue)',
                                        contract_value: 168000,
                                        status: 'Active',
                                        assigned_contractor: 'Apex Commercial Roofing',
                                        target_completion: '2026-11-20',
                                        created_at: '2026-07-22T09:00:00.000Z',
                                        updated_at: '2026-10-10T11:45:00.000Z'
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: 'CLI-DOE-RES',
        name: 'John & Eleanor Doe',
        customer_type: 'Residential',
        account_code: 'DOE-RES-01',
        billing_address: '1428 Harvard Ave, Salt Lake City, UT 84105',
        primary_contact: {
            name: 'John Doe',
            email: 'john.doe@gmail.com',
            phone: '(801) 555-0199',
            role: 'Homeowner'
        },
        notes: 'East Bench estate property with detached garage and solar panel integration.',
        created_at: '2026-03-10T11:00:00.000Z',
        updated_at: '2026-10-10T16:00:00.000Z',
        campuses: [
            {
                id: 'CAMP-DOE-HARVARD',
                client_id: 'CLI-DOE-RES',
                name: 'Doe Harvard Residence Property',
                address: '1428 Harvard Ave',
                city: 'Salt Lake City',
                state: 'UT',
                zip: '84105',
                coordinates: { lat: 40.7345, lng: -111.8501 },
                phases: [
                    {
                        id: 'PHASE-DOE-MAIN',
                        campus_id: 'CAMP-DOE-HARVARD',
                        name: 'Primary Estate Grounds',
                        phase_number: 'Single Phase',
                        description: 'Main home and detached two-car garage.',
                        buildings: [
                            {
                                id: 'BLDG-DOE-HOUSE',
                                phase_id: 'PHASE-DOE-MAIN',
                                name: 'Primary Residence',
                                building_code: 'DOE-MAIN',
                                roof_type: 'TruDefinition® Duration® Storm Impact Resistant',
                                roof_sqft: 4800,
                                stories: 2,
                                pitch: '8/12 Steep',
                                year_installed: 2008,
                                condition: 'Fair',
                                jobs: [
                                    {
                                        id: 'JOB-DOE-001',
                                        building_id: 'BLDG-DOE-HOUSE',
                                        title: 'Full Architectural Shingle Replacement + Solar Re-Seat',
                                        job_number: 'RC-2026-077',
                                        scope_type: 'Residential Shingle',
                                        current_stage: 'Stage 2: ESTIMATE (Property Data)',
                                        contract_value: 27700,
                                        status: 'Active',
                                        assigned_contractor: 'RHIVE Certified Install',
                                        target_completion: '2026-11-01',
                                        created_at: '2026-08-01T10:00:00.000Z',
                                        updated_at: '2026-10-09T13:20:00.000Z'
                                    }
                                ]
                            },
                            {
                                id: 'BLDG-DOE-GARAGE',
                                phase_id: 'PHASE-DOE-MAIN',
                                name: 'Detached 2-Car Garage',
                                building_code: 'DOE-GAR',
                                roof_type: 'TruDefinition® Duration® Architectural Shingles',
                                roof_sqft: 2000,
                                stories: 1,
                                pitch: '6/12 Pitched',
                                year_installed: 2008,
                                condition: 'Fair',
                                jobs: []
                            }
                        ]
                    }
                ]
            }
        ]
    }
];

// Helper: Calculate rollups for any tier
export const computeClientRollup = (client: CustomerClient) => {
    let totalCampuses = client.campuses.length;
    let totalPhases = 0;
    let totalBuildings = 0;
    let totalSqft = 0;
    let totalJobs = 0;
    let totalContractValue = 0;
    let activeJobsCount = 0;

    client.campuses.forEach(campus => {
        totalPhases += campus.phases.length;
        campus.phases.forEach(phase => {
            totalBuildings += phase.buildings.length;
            phase.buildings.forEach(building => {
                totalSqft += building.roof_sqft || 0;
                totalJobs += building.jobs.length;
                building.jobs.forEach(job => {
                    totalContractValue += job.contract_value || 0;
                    if (job.status === 'Active') {
                        activeJobsCount++;
                    }
                });
            });
        });
    });

    return {
        totalCampuses,
        totalPhases,
        totalBuildings,
        totalSqft,
        totalJobs,
        totalContractValue,
        activeJobsCount
    };
};

export const CustomersPortalPage: React.FC = () => {
    const { setActivePageId, setSelectedAccountId, setSelectedProjectId } = useNavigation();
    const { currentUser } = useMockDB();

    // Clients state: loaded from localStorage with SEED_CLIENTS fallback
    const [clients, setClients] = useState<CustomerClient[]>(() => {
        try {
            const saved = localStorage.getItem('rhive_customer_clients');
            if (saved) return JSON.parse(saved);
        } catch { /* ignore */ }
        return SEED_CLIENTS;
    });

    // Save to localStorage whenever clients change
    useEffect(() => {
        try {
            localStorage.setItem('rhive_customer_clients', JSON.stringify(clients));
        } catch { /* ignore */ }
    }, [clients]);

    // Integrate with Firestore accounts in real-time
    useEffect(() => {
        const unsub = accountService.subscribe((firestoreAccounts: any[]) => {
            if (!firestoreAccounts || firestoreAccounts.length === 0) return;

            setClients(prevClients => {
                const existingNames = new Set(prevClients.map(c => c.name.toLowerCase().trim()));
                const newClientsToAdd: CustomerClient[] = [];

                firestoreAccounts.forEach(fa => {
                    const accName = (fa.accountName || fa.name || fa.company || '').trim();
                    if (!accName || existingNames.has(accName.toLowerCase())) return;

                    // Determine customer_type
                    let cType: CustomerType = 'Commercial';
                    const rawType = (fa.accountType || fa.type || fa.customer_type || '').toLowerCase();
                    if (rawType.includes('gov') || rawType.includes('city') || rawType.includes('state')) {
                        cType = 'Government';
                    } else if (rawType.includes('res') || rawType.includes('home') || rawType.includes('individual')) {
                        cType = 'Residential';
                    }

                    const newClient: CustomerClient = {
                        id: fa.id || `CLI-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
                        name: accName,
                        customer_type: cType,
                        account_code: fa.accountId || undefined,
                        billing_address: fa.billingAddress || fa.address || fa.projectAddress || undefined,
                        primary_contact: {
                            name: fa.contactName || `${fa.firstName || ''} ${fa.lastName || ''}`.trim() || 'Primary Contact',
                            email: fa.email || fa.email_1 || '',
                            phone: fa.phone || fa.phone_1 || '',
                            role: fa.role || 'Account Representative'
                        },
                        notes: fa.notes || 'Synced from RHIVE account repository.',
                        created_at: fa.created_at || new Date().toISOString(),
                        updated_at: fa.updated_at || new Date().toISOString(),
                        campuses: [
                            {
                                id: `CAMP-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
                                client_id: fa.id || '',
                                name: fa.propertyName || `${accName} Site`,
                                address: fa.projectAddress || fa.address || 'Address pending verification',
                                city: fa.city || 'Salt Lake City',
                                state: fa.state || 'UT',
                                zip: fa.zipCode || fa.zip || '',
                                phases: []
                            }
                        ]
                    };
                    newClientsToAdd.push(newClient);
                    existingNames.add(accName.toLowerCase());
                });

                if (newClientsToAdd.length > 0) {
                    return [...prevClients, ...newClientsToAdd];
                }
                return prevClients;
            });
        });

        return () => unsub();
    }, []);

    // Filter and Search States
    const [selectedTypeFilter, setSelectedTypeFilter] = useState<'All' | CustomerType>('All');
    const [searchQuery, setSearchQuery] = useState('');

    // Display & Sort states (persisted in localStorage)
    const [sortBy, setSortBy] = useState<'recent' | 'az' | 'za'>(() => {
        try {
            const saved = localStorage.getItem('rhive_customers_sort');
            if (saved === 'recent' || saved === 'az' || saved === 'za') return saved;
        } catch { /* ignore */ }
        return 'recent';
    });

    const [viewMode, setViewMode] = useState<'grid' | 'list'>(() => {
        try {
            const saved = localStorage.getItem('rhive_customers_view_mode');
            if (saved === 'grid' || saved === 'list') return saved;
        } catch { /* ignore */ }
        return 'grid';
    });

    // Save preferences
    useEffect(() => {
        try {
            localStorage.setItem('rhive_customers_sort', sortBy);
        } catch { /* ignore */ }
    }, [sortBy]);

    useEffect(() => {
        try {
            localStorage.setItem('rhive_customers_view_mode', viewMode);
        } catch { /* ignore */ }
    }, [viewMode]);

    // Selected Tier Drill-down state
    const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
    const [selectedCampusId, setSelectedCampusId] = useState<string | null>(null);
    const [selectedPhaseId, setSelectedPhaseId] = useState<string | null>(null);
    const [selectedBuildingId, setSelectedBuildingId] = useState<string | null>(null);
    const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

    // Modal State
    const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false);
    const [isAddCampusModalOpen, setIsAddCampusModalOpen] = useState(false);
    const [isAddPhaseModalOpen, setIsAddPhaseModalOpen] = useState(false);
    const [isAddBuildingModalOpen, setIsAddBuildingModalOpen] = useState(false);
    const [isAddJobModalOpen, setIsAddJobModalOpen] = useState(false);

    // Form inputs for modals
    const [newClientForm, setNewClientForm] = useState({
        name: '',
        customer_type: 'Commercial' as CustomerType,
        primaryName: '',
        primaryEmail: '',
        primaryPhone: '',
        billingAddress: '',
        notes: ''
    });

    const [newCampusForm, setNewCampusForm] = useState({
        name: '',
        address: '',
        city: 'Salt Lake City',
        state: 'UT',
        zip: '',
        managerName: '',
        managerPhone: '',
        notes: ''
    });

    const [newPhaseForm, setNewPhaseForm] = useState({
        name: '',
        phase_number: '',
        description: ''
    });

    const [newBuildingForm, setNewBuildingForm] = useState({
        name: '',
        roof_type: '.060MIL TPO Flat Membrane',
        roof_sqft: 5000,
        stories: 1,
        pitch: 'Flat / Low Slope',
        condition: 'Good' as 'Good' | 'Fair' | 'Critical' | 'Under Replacement',
        notes: ''
    });

    const [newJobForm, setNewJobForm] = useState({
        title: '',
        scope_type: 'Flat Roof Replacement',
        current_stage: 'Stage 1: LEAD (Intake)',
        contract_value: 25000,
        assigned_contractor: 'RHIVE Certified Install',
        target_completion: ''
    });

    // Resolve Active Tree Hierarchy based on selections
    const activeClient = useMemo(() => {
        return clients.find(c => c.id === selectedClientId) || null;
    }, [clients, selectedClientId]);

    const activeCampus = useMemo(() => {
        if (!activeClient) return null;
        return activeClient.campuses.find(cp => cp.id === selectedCampusId) || null;
    }, [activeClient, selectedCampusId]);

    const activePhase = useMemo(() => {
        if (!activeCampus) return null;
        return activeCampus.phases.find(ph => ph.id === selectedPhaseId) || null;
    }, [activeCampus, selectedPhaseId]);

    const activeBuilding = useMemo(() => {
        if (!activePhase) return null;
        return activePhase.buildings.find(b => b.id === selectedBuildingId) || null;
    }, [activePhase, selectedBuildingId]);

    const activeJob = useMemo(() => {
        if (!activeBuilding) return null;
        return activeBuilding.jobs.find(j => j.id === selectedJobId) || null;
    }, [activeBuilding, selectedJobId]);

    // Filtered clients list
    const filteredClients = useMemo(() => {
        return clients.filter(c => {
            if (selectedTypeFilter !== 'All' && c.customer_type !== selectedTypeFilter) {
                return false;
            }
            if (!searchQuery) return true;
            const q = searchQuery.toLowerCase();
            const matchesName = c.name.toLowerCase().includes(q);
            const matchesContact = (c.primary_contact?.name || '').toLowerCase().includes(q) ||
                                   (c.primary_contact?.email || '').toLowerCase().includes(q) ||
                                   (c.primary_contact?.phone || '').includes(q);
            const matchesCampus = c.campuses.some(camp => 
                camp.name.toLowerCase().includes(q) || 
                camp.address.toLowerCase().includes(q) ||
                camp.phases.some(ph => 
                    ph.name.toLowerCase().includes(q) ||
                    ph.buildings.some(b => 
                        b.name.toLowerCase().includes(q) ||
                        b.jobs.some(j => j.title.toLowerCase().includes(q))
                    )
                )
            );
            return matchesName || matchesContact || matchesCampus;
        });
    }, [clients, selectedTypeFilter, searchQuery]);

    // Sorted and Filtered clients based on user sort preference (recent, az, za)
    const sortedAndFilteredClients = useMemo(() => {
        const list = [...filteredClients];
        if (sortBy === 'az') {
            list.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
        } else if (sortBy === 'za') {
            list.sort((a, b) => b.name.localeCompare(a.name, undefined, { sensitivity: 'base' }));
        } else if (sortBy === 'recent') {
            list.sort((a, b) => {
                const timeA = new Date(a.updated_at || a.created_at || 0).getTime();
                const timeB = new Date(b.updated_at || b.created_at || 0).getTime();
                return timeB - timeA;
            });
        }
        return list;
    }, [filteredClients, sortBy]);

    // High level summary rollups across entire portfolio
    const portfolioSummary = useMemo(() => {
        let totalClients = clients.length;
        let totalCampuses = 0;
        let totalBuildings = 0;
        let totalValue = 0;
        let totalActiveJobs = 0;
        let totalSqft = 0;

        clients.forEach(c => {
            const roll = computeClientRollup(c);
            totalCampuses += roll.totalCampuses;
            totalBuildings += roll.totalBuildings;
            totalValue += roll.totalContractValue;
            totalActiveJobs += roll.activeJobsCount;
            totalSqft += roll.totalSqft;
        });

        return {
            totalClients,
            totalCampuses,
            totalBuildings,
            totalValue,
            totalActiveJobs,
            totalSqft
        };
    }, [clients]);

    // ── CRUD HANDLERS ───────────────────────────────────────────────────────────

    // Create Tier 1 Client
    const handleCreateClient = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newClientForm.name.trim()) return;

        const newClient: CustomerClient = {
            id: `CLI-${Date.now()}`,
            name: newClientForm.name.trim(),
            customer_type: newClientForm.customer_type,
            account_code: `ACC-${Math.floor(1000 + Math.random() * 9000)}`,
            billing_address: newClientForm.billingAddress || undefined,
            primary_contact: newClientForm.primaryName ? {
                name: newClientForm.primaryName,
                email: newClientForm.primaryEmail,
                phone: newClientForm.primaryPhone,
                role: 'Primary Account Contact'
            } : undefined,
            notes: newClientForm.notes || undefined,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            campuses: []
        };

        setClients(prev => [newClient, ...prev]);
        setSelectedClientId(newClient.id);
        setIsAddClientModalOpen(false);
        setNewClientForm({
            name: '',
            customer_type: 'Commercial',
            primaryName: '',
            primaryEmail: '',
            primaryPhone: '',
            billingAddress: '',
            notes: ''
        });

        userLogService.logAction(
            'CREATE_TIER1_CLIENT',
            `Created Tier 1 Client account "${newClient.name}" (${newClient.customer_type})`,
            { clientId: newClient.id, name: newClient.name, type: newClient.customer_type }
        );
    };

    // Create Tier 2 Property Campus
    const handleCreateCampus = (e: React.FormEvent) => {
        e.preventDefault();
        if (!activeClient || !newCampusForm.name.trim()) return;

        const newCampus: PropertyCampus = {
            id: `CAMP-${Date.now()}`,
            client_id: activeClient.id,
            name: newCampusForm.name.trim(),
            address: newCampusForm.address || 'Address pending verification',
            city: newCampusForm.city,
            state: newCampusForm.state,
            zip: newCampusForm.zip,
            manager_contact: newCampusForm.managerName ? {
                name: newCampusForm.managerName,
                phone: newCampusForm.managerPhone,
                email: ''
            } : undefined,
            notes: newCampusForm.notes || undefined,
            phases: []
        };

        setClients(prev => prev.map(c => {
            if (c.id === activeClient.id) {
                return {
                    ...c,
                    campuses: [...c.campuses, newCampus],
                    updated_at: new Date().toISOString()
                };
            }
            return c;
        }));

        setSelectedCampusId(newCampus.id);
        setIsAddCampusModalOpen(false);
        setNewCampusForm({
            name: '',
            address: '',
            city: 'Salt Lake City',
            state: 'UT',
            zip: '',
            managerName: '',
            managerPhone: '',
            notes: ''
        });

        userLogService.logAction(
            'CREATE_TIER2_CAMPUS',
            `Created Tier 2 Campus "${newCampus.name}" under Client ${activeClient.name}`,
            { campusId: newCampus.id, campusName: newCampus.name, clientId: activeClient.id }
        );
    };

    // Create Tier 3 Sub-Property Phase
    const handleCreatePhase = (e: React.FormEvent) => {
        e.preventDefault();
        if (!activeClient || !activeCampus || !newPhaseForm.name.trim()) return;

        const newPhase: SubPropertyPhase = {
            id: `PHASE-${Date.now()}`,
            campus_id: activeCampus.id,
            name: newPhaseForm.name.trim(),
            phase_number: newPhaseForm.phase_number || undefined,
            description: newPhaseForm.description || undefined,
            buildings: []
        };

        setClients(prev => prev.map(c => {
            if (c.id === activeClient.id) {
                return {
                    ...c,
                    campuses: c.campuses.map(camp => {
                        if (camp.id === activeCampus.id) {
                            return {
                                ...camp,
                                phases: [...camp.phases, newPhase]
                            };
                        }
                        return camp;
                    })
                };
            }
            return c;
        }));

        setSelectedPhaseId(newPhase.id);
        setIsAddPhaseModalOpen(false);
        setNewPhaseForm({
            name: '',
            phase_number: '',
            description: ''
        });

        userLogService.logAction(
            'CREATE_TIER3_PHASE',
            `Created Tier 3 Phase "${newPhase.name}" under Campus ${activeCampus.name}`,
            { phaseId: newPhase.id, phaseName: newPhase.name, campusId: activeCampus.id }
        );
    };

    // Create Tier 4 Building Asset
    const handleCreateBuilding = (e: React.FormEvent) => {
        e.preventDefault();
        if (!activeClient || !activeCampus || !activePhase || !newBuildingForm.name.trim()) return;

        const newBuilding: BuildingAsset = {
            id: `BLDG-${Date.now()}`,
            phase_id: activePhase.id,
            name: newBuildingForm.name.trim(),
            building_code: `BLD-${Math.floor(100 + Math.random() * 900)}`,
            roof_type: newBuildingForm.roof_type,
            roof_sqft: Number(newBuildingForm.roof_sqft) || 5000,
            stories: Number(newBuildingForm.stories) || 1,
            pitch: newBuildingForm.pitch,
            condition: newBuildingForm.condition,
            map_annotation: newBuildingForm.notes ? {
                pin_color: '#ec028b',
                notes: newBuildingForm.notes
            } : undefined,
            jobs: []
        };

        setClients(prev => prev.map(c => {
            if (c.id === activeClient.id) {
                return {
                    ...c,
                    campuses: c.campuses.map(camp => {
                        if (camp.id === activeCampus.id) {
                            return {
                                ...camp,
                                phases: camp.phases.map(ph => {
                                    if (ph.id === activePhase.id) {
                                        return {
                                            ...ph,
                                            buildings: [...ph.buildings, newBuilding]
                                        };
                                    }
                                    return ph;
                                })
                            };
                        }
                        return camp;
                    })
                };
            }
            return c;
        }));

        setSelectedBuildingId(newBuilding.id);
        setIsAddBuildingModalOpen(false);
        setNewBuildingForm({
            name: '',
            roof_type: '.060MIL TPO Flat Membrane',
            roof_sqft: 5000,
            stories: 1,
            pitch: 'Flat / Low Slope',
            condition: 'Good',
            notes: ''
        });

        userLogService.logAction(
            'CREATE_TIER4_BUILDING',
            `Created Tier 4 Building Asset "${newBuilding.name}" (${newBuilding.roof_sqft.toLocaleString()} sqft) under Phase ${activePhase.name}`,
            { buildingId: newBuilding.id, name: newBuilding.name, sqft: newBuilding.roof_sqft }
        );
    };

    // Create Tier 5 Project / Job
    const handleCreateJob = (e: React.FormEvent) => {
        e.preventDefault();
        if (!activeClient || !activeCampus || !activePhase || !activeBuilding || !newJobForm.title.trim()) return;

        const newJob: ProjectJob = {
            id: `JOB-${Date.now()}`,
            building_id: activeBuilding.id,
            title: newJobForm.title.trim(),
            scope_type: newJobForm.scope_type,
            current_stage: newJobForm.current_stage,
            contract_value: Number(newJobForm.contract_value) || 0,
            assigned_contractor: newJobForm.assigned_contractor || 'RHIVE Certified Install',
            target_completion: newJobForm.target_completion || undefined,
            status: 'Active',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        setClients(prev => prev.map(c => {
            if (c.id === activeClient.id) {
                return {
                    ...c,
                    campuses: c.campuses.map(camp => {
                        if (camp.id === activeCampus.id) {
                            return {
                                ...camp,
                                phases: camp.phases.map(ph => {
                                    if (ph.id === activePhase.id) {
                                        return {
                                            ...ph,
                                            buildings: ph.buildings.map(b => {
                                                if (b.id === activeBuilding.id) {
                                                    return {
                                                        ...b,
                                                        jobs: [...b.jobs, newJob]
                                                    };
                                                }
                                                return b;
                                            })
                                        };
                                    }
                                    return ph;
                                })
                            };
                        }
                        return camp;
                    })
                };
            }
            return c;
        }));

        setSelectedJobId(newJob.id);
        setIsAddJobModalOpen(false);
        setNewJobForm({
            title: '',
            scope_type: 'Flat Roof Replacement',
            current_stage: 'Stage 1: LEAD (Intake)',
            contract_value: 25000,
            assigned_contractor: 'RHIVE Certified Install',
            target_completion: ''
        });

        userLogService.logAction(
            'CREATE_TIER5_JOB',
            `Created Tier 5 Job "${newJob.title}" on Building ${activeBuilding.name} ($${newJob.contract_value.toLocaleString()})`,
            { jobId: newJob.id, title: newJob.title, value: newJob.contract_value, stage: newJob.current_stage }
        );
    };

    // Quick Connect to New Project (E-02a)
    const handleLaunchNewProject = (client?: CustomerClient, campus?: PropertyCampus) => {
        if (client) {
            sessionStorage.setItem('intakeParentCompany', client.name);
        }
        if (campus) {
            sessionStorage.setItem('intakePropertyName', campus.name);
            sessionStorage.setItem('globalSearchQuery', campus.address);
        }
        setActivePageId('E-02a');
    };

    return (
        <PageContainer 
            title="Customers" 
            description="5-Tier Relational Account Architecture: Client ➔ Campus ➔ Phase ➔ Building Asset ➔ Project"
        >
            <div className="space-y-6 pb-20">
                {/* ── TOP KPI ROLLUP BAR ───────────────────────────────────────── */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                    <div className="p-4 bg-black/60 border border-gray-800 rounded-lg relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-12 h-12 bg-rhive-pink/5 rounded-bl-full pointer-events-none" />
                        <span className="text-[10px] font-black uppercase tracking-wider text-gray-500 block">
                            Tier 1 Clients
                        </span>
                        <span className="text-2xl font-black font-mono text-white mt-1 block">
                            {portfolioSummary.totalClients}
                        </span>
                    </div>

                    <div className="p-4 bg-black/60 border border-gray-800 rounded-lg relative overflow-hidden group">
                        <span className="text-[10px] font-black uppercase tracking-wider text-gray-500 block">
                            Tier 2 Campuses
                        </span>
                        <span className="text-2xl font-black font-mono text-white mt-1 block">
                            {portfolioSummary.totalCampuses}
                        </span>
                    </div>

                    <div className="p-4 bg-black/60 border border-gray-800 rounded-lg relative overflow-hidden group">
                        <span className="text-[10px] font-black uppercase tracking-wider text-gray-500 block">
                            Tier 4 Buildings
                        </span>
                        <span className="text-2xl font-black font-mono text-white mt-1 block">
                            {portfolioSummary.totalBuildings}
                        </span>
                    </div>

                    <div className="p-4 bg-black/60 border border-gray-800 rounded-lg relative overflow-hidden group">
                        <span className="text-[10px] font-black uppercase tracking-wider text-gray-500 block">
                            Roof Asset Area
                        </span>
                        <span className="text-2xl font-black font-mono text-white mt-1 block">
                            {portfolioSummary.totalSqft.toLocaleString()} <span className="text-xs text-gray-500 font-sans">sqft</span>
                        </span>
                    </div>

                    <div className="p-4 bg-black/60 border border-gray-800 rounded-lg relative overflow-hidden group">
                        <span className="text-[10px] font-black uppercase tracking-wider text-gray-500 block">
                            Active Jobs
                        </span>
                        <span className="text-2xl font-black font-mono text-[#ec028b] mt-1 block">
                            {portfolioSummary.totalActiveJobs}
                        </span>
                    </div>

                    <div className="p-4 bg-black/60 border border-gray-800 rounded-lg relative overflow-hidden group">
                        <span className="text-[10px] font-black uppercase tracking-wider text-gray-500 block">
                            Portfolio Value
                        </span>
                        <span className="text-2xl font-black font-mono text-[#e2ab49] mt-1 block">
                            {formatCurrency(portfolioSummary.totalValue)}
                        </span>
                    </div>
                </div>

                {/* ── CONTROLS, SEARCH & DISPLAY TOOLBAR ───────────────────────── */}
                <div className="p-4 bg-black/40 border border-gray-800 rounded-lg space-y-3">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        {/* Filter Pills */}
                        <div className="flex flex-wrap items-center gap-2">
                            {(['All', 'Commercial', 'Government', 'Residential'] as const).map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setSelectedTypeFilter(tab)}
                                    className={cn(
                                        "px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all",
                                        selectedTypeFilter === tab
                                            ? "bg-rhive-pink text-white shadow-[0_0_10px_rgba(236,2,139,0.4)]"
                                            : "bg-gray-900/60 text-gray-400 hover:text-white border border-gray-800"
                                    )}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {/* Search & Add Action */}
                        <div className="flex items-center gap-3">
                            <div className="relative flex-1 md:w-80">
                                <SearchIcon className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input 
                                    type="text"
                                    placeholder="Search Client, Campus, Building, or Job..."
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    className="w-full bg-black/60 border border-gray-800 pl-9 pr-4 py-1.5 text-xs font-mono text-white placeholder-gray-600 rounded-full focus:outline-none focus:border-rhive-pink transition-colors"
                                />
                            </div>

                            <Button 
                                variant="primary" 
                                size="sm"
                                onClick={() => setIsAddClientModalOpen(true)}
                                className="whitespace-nowrap"
                            >
                                <PlusIcon className="w-4 h-4 mr-1.5" />
                                Create Client
                            </Button>
                        </div>
                    </div>

                    {/* Secondary Row: Sort Options & Display View Mode (Grid / List) */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-800/80">
                        {/* Sort Options: Most Recent, A to Z, Z to A */}
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-500">
                                Sort:
                            </span>
                            <div className="flex items-center gap-1 bg-black/60 border border-gray-800 p-0.5 rounded-lg">
                                <button
                                    onClick={() => setSortBy('recent')}
                                    className={cn(
                                        "px-2.5 py-1 rounded text-xs font-mono font-bold transition-all",
                                        sortBy === 'recent'
                                            ? "bg-rhive-pink text-white shadow-[0_0_8px_rgba(236,2,139,0.4)]"
                                            : "text-gray-400 hover:text-white hover:bg-gray-800/40"
                                    )}
                                >
                                    Most Recent
                                </button>
                                <button
                                    onClick={() => setSortBy('az')}
                                    className={cn(
                                        "px-2.5 py-1 rounded text-xs font-mono font-bold transition-all",
                                        sortBy === 'az'
                                            ? "bg-rhive-pink text-white shadow-[0_0_8px_rgba(236,2,139,0.4)]"
                                            : "text-gray-400 hover:text-white hover:bg-gray-800/40"
                                    )}
                                >
                                    A to Z
                                </button>
                                <button
                                    onClick={() => setSortBy('za')}
                                    className={cn(
                                        "px-2.5 py-1 rounded text-xs font-mono font-bold transition-all",
                                        sortBy === 'za'
                                            ? "bg-rhive-pink text-white shadow-[0_0_8px_rgba(236,2,139,0.4)]"
                                            : "text-gray-400 hover:text-white hover:bg-gray-800/40"
                                    )}
                                >
                                    Z to A
                                </button>
                            </div>
                        </div>

                        {/* Display View Mode: Grid vs List */}
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-500">
                                View:
                            </span>
                            <div className="flex items-center gap-1 bg-black/60 border border-gray-800 p-0.5 rounded-lg">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={cn(
                                        "flex items-center gap-1.5 px-3 py-1 rounded text-xs font-mono font-bold transition-all",
                                        viewMode === 'grid'
                                            ? "bg-rhive-pink text-white shadow-[0_0_8px_rgba(236,2,139,0.4)]"
                                            : "text-gray-400 hover:text-white hover:bg-gray-800/40"
                                    )}
                                >
                                    <Squares2x2Icon className="w-3.5 h-3.5" />
                                    Grid
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={cn(
                                        "flex items-center gap-1.5 px-3 py-1 rounded text-xs font-mono font-bold transition-all",
                                        viewMode === 'list'
                                            ? "bg-rhive-pink text-white shadow-[0_0_8px_rgba(236,2,139,0.4)]"
                                            : "text-gray-400 hover:text-white hover:bg-gray-800/40"
                                    )}
                                >
                                    <ListBulletIcon className="w-3.5 h-3.5" />
                                    List
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── BREADCRUMB NAVIGATION BAR ─────────────────────────────────── */}
                {selectedClientId && (
                    <div className="flex flex-wrap items-center gap-2 p-3 bg-gray-900/40 border border-gray-800/80 rounded-lg text-xs font-mono">
                        <button 
                            onClick={() => {
                                setSelectedClientId(null);
                                setSelectedCampusId(null);
                                setSelectedPhaseId(null);
                                setSelectedBuildingId(null);
                                setSelectedJobId(null);
                            }}
                            className="text-gray-400 hover:text-white hover:underline flex items-center gap-1 font-bold"
                        >
                            <UsersIcon className="w-3.5 h-3.5 text-rhive-pink" />
                            All Clients
                        </button>

                        {activeClient && (
                            <>
                                <ChevronRightIcon className="w-3 h-3 text-gray-600" />
                                <button 
                                    onClick={() => {
                                        setSelectedCampusId(null);
                                        setSelectedPhaseId(null);
                                        setSelectedBuildingId(null);
                                        setSelectedJobId(null);
                                    }}
                                    className={cn(
                                        "font-bold transition-colors",
                                        !selectedCampusId ? "text-rhive-pink" : "text-gray-400 hover:text-white"
                                    )}
                                >
                                    Tier 1: {activeClient.name}
                                </button>
                            </>
                        )}

                        {activeCampus && (
                            <>
                                <ChevronRightIcon className="w-3 h-3 text-gray-600" />
                                <button 
                                    onClick={() => {
                                        setSelectedPhaseId(null);
                                        setSelectedBuildingId(null);
                                        setSelectedJobId(null);
                                    }}
                                    className={cn(
                                        "font-bold transition-colors",
                                        !selectedPhaseId ? "text-rhive-pink" : "text-gray-400 hover:text-white"
                                    )}
                                >
                                    Tier 2: {activeCampus.name}
                                </button>
                            </>
                        )}

                        {activePhase && (
                            <>
                                <ChevronRightIcon className="w-3 h-3 text-gray-600" />
                                <button 
                                    onClick={() => {
                                        setSelectedBuildingId(null);
                                        setSelectedJobId(null);
                                    }}
                                    className={cn(
                                        "font-bold transition-colors",
                                        !selectedBuildingId ? "text-rhive-pink" : "text-gray-400 hover:text-white"
                                    )}
                                >
                                    Tier 3: {activePhase.name}
                                </button>
                            </>
                        )}

                        {activeBuilding && (
                            <>
                                <ChevronRightIcon className="w-3 h-3 text-gray-600" />
                                <button 
                                    onClick={() => setSelectedJobId(null)}
                                    className={cn(
                                        "font-bold transition-colors",
                                        !selectedJobId ? "text-rhive-pink" : "text-gray-400 hover:text-white"
                                    )}
                                >
                                    Tier 4: {activeBuilding.name}
                                </button>
                            </>
                        )}

                        {activeJob && (
                            <>
                                <ChevronRightIcon className="w-3 h-3 text-gray-600" />
                                <span className="text-white font-bold">
                                    Tier 5: {activeJob.title}
                                </span>
                            </>
                        )}
                    </div>
                )}

                {/* ── MAIN CONTENT WORKSPACE ────────────────────────────────────── */}
                {!selectedClientId ? (
                    viewMode === 'list' ? (
                        /* ── LIST VIEW (HIGH DENSITY TABLE) ───────────────────────── */
                        <div className="bg-black/60 border border-gray-800 rounded-lg overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-gray-800 bg-gray-900/60 text-[10px] font-mono font-black uppercase tracking-wider text-gray-400">
                                            <th className="py-3.5 px-4">Client / Company</th>
                                            <th className="py-3.5 px-4">Type</th>
                                            <th className="py-3.5 px-4">Primary Contact</th>
                                            <th className="py-3.5 px-4 text-center">Campuses</th>
                                            <th className="py-3.5 px-4 text-center">Buildings</th>
                                            <th className="py-3.5 px-4 text-center">Active Jobs</th>
                                            <th className="py-3.5 px-4 text-right">Portfolio Value</th>
                                            <th className="py-3.5 px-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-800/60 text-xs font-mono">
                                        {sortedAndFilteredClients.map(client => {
                                            const roll = computeClientRollup(client);
                                            return (
                                                <tr 
                                                    key={client.id}
                                                    onClick={() => setSelectedClientId(client.id)}
                                                    className="hover:bg-gray-900/40 transition-colors cursor-pointer group"
                                                >
                                                    <td className="py-3.5 px-4">
                                                        <div className="font-bold text-sm text-white group-hover:text-rhive-pink transition-colors font-sans">
                                                            {client.name}
                                                        </div>
                                                        {client.account_code && (
                                                            <div className="text-[10px] text-gray-500 font-mono mt-0.5">
                                                                {client.account_code}
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="py-3.5 px-4 whitespace-nowrap">
                                                        <span className={cn(
                                                            "px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border",
                                                            client.customer_type === 'Commercial' && "bg-blue-500/10 text-blue-400 border-blue-500/30",
                                                            client.customer_type === 'Government' && "bg-amber-500/10 text-amber-400 border-amber-500/30",
                                                            client.customer_type === 'Residential' && "bg-green-500/10 text-green-400 border-green-500/30"
                                                        )}>
                                                            {client.customer_type}
                                                        </span>
                                                    </td>
                                                    <td className="py-3.5 px-4">
                                                        {client.primary_contact ? (
                                                            <div>
                                                                <div className="text-white font-medium">
                                                                    {client.primary_contact.name}
                                                                </div>
                                                                <div className="text-[11px] text-gray-400 truncate max-w-xs">
                                                                    {client.primary_contact.phone || client.primary_contact.email}
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <span className="text-gray-500 italic">No contact</span>
                                                        )}
                                                    </td>
                                                    <td className="py-3.5 px-4 text-center">
                                                        <span className="inline-block px-2 py-0.5 bg-gray-900 rounded border border-gray-800 text-white font-bold">
                                                            {roll.totalCampuses}
                                                        </span>
                                                    </td>
                                                    <td className="py-3.5 px-4 text-center">
                                                        <span className="inline-block px-2 py-0.5 bg-gray-900 rounded border border-gray-800 text-white font-bold">
                                                            {roll.totalBuildings}
                                                        </span>
                                                    </td>
                                                    <td className="py-3.5 px-4 text-center">
                                                        <span className={cn(
                                                            "inline-block px-2 py-0.5 rounded font-bold border",
                                                            roll.activeJobsCount > 0 
                                                                ? "bg-rhive-pink/10 text-rhive-pink border-rhive-pink/30" 
                                                                : "bg-gray-900 text-gray-500 border-gray-800"
                                                        )}>
                                                            {roll.activeJobsCount}
                                                        </span>
                                                    </td>
                                                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                                                        <span className="font-bold text-[#e2ab49]">
                                                            {formatCurrency(roll.totalContractValue)}
                                                        </span>
                                                        {roll.totalSqft > 0 && (
                                                            <div className="text-[10px] text-gray-500">
                                                                {roll.totalSqft.toLocaleString()} sqft
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="py-3.5 px-4 text-right whitespace-nowrap" onClick={e => e.stopPropagation()}>
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button
                                                                onClick={() => handleLaunchNewProject(client)}
                                                                title="Start in New Project"
                                                                className="px-2.5 py-1 text-[11px] font-bold text-gray-300 hover:text-white bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded transition-colors"
                                                            >
                                                                + Project
                                                            </button>
                                                            <button
                                                                onClick={() => setSelectedClientId(client.id)}
                                                                className="px-2.5 py-1 text-[11px] font-bold text-rhive-pink hover:text-white bg-rhive-pink/10 hover:bg-rhive-pink border border-rhive-pink/30 hover:border-rhive-pink rounded flex items-center gap-1 transition-all"
                                                            >
                                                                Navigate <ChevronRightIcon className="w-3.5 h-3.5 ml-0.5" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {sortedAndFilteredClients.length === 0 && (
                                <div className="py-16 text-center bg-black/40 border-t border-gray-800">
                                    <UsersIcon className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                                    <p className="text-gray-400 font-mono text-sm">No clients found matching query.</p>
                                    <Button 
                                        variant="secondary" 
                                        size="sm" 
                                        onClick={() => { setSelectedTypeFilter('All'); setSearchQuery(''); }}
                                        className="mt-4"
                                    >
                                        Clear Filters
                                    </Button>
                                </div>
                            )}
                        </div>
                    ) : (
                        /* ── GRID VIEW (CARDS DIRECTORY) ─────────────────────────── */
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {sortedAndFilteredClients.map(client => {
                                const roll = computeClientRollup(client);
                                return (
                                    <div 
                                        key={client.id}
                                        className="p-[1px] bg-gray-800 hover:bg-rhive-pink transition-all duration-300 group cursor-pointer"
                                        style={{ clipPath: 'polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)' }}
                                        onClick={() => setSelectedClientId(client.id)}
                                    >
                                        <div 
                                            className="bg-black/90 p-6 h-full flex flex-col justify-between"
                                            style={{ clipPath: 'polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)' }}
                                        >
                                            <div>
                                                {/* Type Badge & Code */}
                                                <div className="flex items-center justify-between mb-3">
                                                    <span className={cn(
                                                        "px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border",
                                                        client.customer_type === 'Commercial' && "bg-blue-500/10 text-blue-400 border-blue-500/30",
                                                        client.customer_type === 'Government' && "bg-amber-500/10 text-amber-400 border-amber-500/30",
                                                        client.customer_type === 'Residential' && "bg-green-500/10 text-green-400 border-green-500/30"
                                                    )}>
                                                        Tier 1 • {client.customer_type}
                                                    </span>

                                                    <span className="text-[10px] font-mono text-gray-500">
                                                        {client.account_code || 'Account'}
                                                    </span>
                                                </div>

                                                {/* Client Name */}
                                                <h3 className="text-lg font-bold text-white group-hover:text-rhive-pink transition-colors">
                                                    {client.name}
                                                </h3>

                                                {/* Primary Contact */}
                                                {client.primary_contact && (
                                                    <p className="text-xs text-gray-400 mt-2 font-mono truncate">
                                                        {client.primary_contact.name} • {client.primary_contact.phone || client.primary_contact.email}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Rollup Metrics */}
                                            <div className="mt-6 pt-4 border-t border-gray-800/80">
                                                <div className="grid grid-cols-3 gap-2 text-center mb-4">
                                                    <div className="bg-gray-900/60 p-2 rounded border border-gray-800">
                                                        <span className="text-[9px] uppercase tracking-wider text-gray-500 block">Campuses</span>
                                                        <span className="text-sm font-bold font-mono text-white">{roll.totalCampuses}</span>
                                                    </div>
                                                    <div className="bg-gray-900/60 p-2 rounded border border-gray-800">
                                                        <span className="text-[9px] uppercase tracking-wider text-gray-500 block">Buildings</span>
                                                        <span className="text-sm font-bold font-mono text-white">{roll.totalBuildings}</span>
                                                    </div>
                                                    <div className="bg-gray-900/60 p-2 rounded border border-gray-800">
                                                        <span className="text-[9px] uppercase tracking-wider text-gray-500 block">Active Jobs</span>
                                                        <span className="text-sm font-bold font-mono text-rhive-pink">{roll.activeJobsCount}</span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between text-xs">
                                                    <span className="text-gray-400 font-mono">
                                                        Total Contract: <strong className="text-[#e2ab49]">{formatCurrency(roll.totalContractValue)}</strong>
                                                    </span>
                                                    <span className="text-rhive-pink group-hover:translate-x-1 transition-transform flex items-center font-bold">
                                                        Navigate <ChevronRightIcon className="w-3.5 h-3.5 ml-0.5" />
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                            {sortedAndFilteredClients.length === 0 && (
                                <div className="col-span-full py-16 text-center bg-black/40 border border-gray-800 rounded-lg">
                                    <UsersIcon className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                                    <p className="text-gray-400 font-mono text-sm">No clients found matching query.</p>
                                    <Button 
                                        variant="secondary" 
                                        size="sm" 
                                        onClick={() => { setSelectedTypeFilter('All'); setSearchQuery(''); }}
                                        className="mt-4"
                                    >
                                        Clear Filters
                                    </Button>
                                </div>
                            )}
                        </div>
                    )
                ) : (
                    /* ── DRILL-DOWN HIERARCHY FOR SELECTED CLIENT ────────────────── */
                    <div className="space-y-6">
                        {/* Selected Client Card Header */}
                        {activeClient && (
                            <div className="p-6 bg-black/70 border border-gray-800 rounded-lg relative overflow-hidden">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1.5">
                                            <span className={cn(
                                                "px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border",
                                                activeClient.customer_type === 'Commercial' && "bg-blue-500/10 text-blue-400 border-blue-500/30",
                                                activeClient.customer_type === 'Government' && "bg-amber-500/10 text-amber-400 border-amber-500/30",
                                                activeClient.customer_type === 'Residential' && "bg-green-500/10 text-green-400 border-green-500/30"
                                            )}>
                                                Tier 1 Client • {activeClient.customer_type}
                                            </span>
                                            {activeClient.account_code && (
                                                <span className="text-xs text-gray-500 font-mono">
                                                    [{activeClient.account_code}]
                                                </span>
                                            )}
                                        </div>
                                        <h2 className="text-2xl font-black text-white">
                                            {activeClient.name}
                                        </h2>
                                        {activeClient.primary_contact && (
                                            <p className="text-xs text-gray-400 mt-1 font-mono">
                                                Primary Contact: <span className="text-white">{activeClient.primary_contact.name}</span> ({activeClient.primary_contact.phone || 'No phone'} • {activeClient.primary_contact.email || 'No email'})
                                            </p>
                                        )}
                                        {activeClient.billing_address && (
                                            <p className="text-xs text-gray-500 font-mono mt-0.5">
                                                Billing: {activeClient.billing_address}
                                            </p>
                                        )}
                                    </div>

                                    {/* Action buttons */}
                                    <div className="flex flex-wrap items-center gap-2">
                                        <Button 
                                            variant="secondary" 
                                            size="sm"
                                            onClick={() => handleLaunchNewProject(activeClient)}
                                            className="font-mono text-xs"
                                        >
                                            <BriefcaseIcon className="w-4 h-4 mr-1.5 text-rhive-pink" />
                                            Start in New Project
                                        </Button>
                                        <Button 
                                            variant="primary" 
                                            size="sm"
                                            onClick={() => setIsAddCampusModalOpen(true)}
                                            className="whitespace-nowrap"
                                        >
                                            <PlusIcon className="w-4 h-4 mr-1.5" />
                                            Add Campus
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ── TIER 2: PROPERTY CAMPUSES ───────────────────────────────── */}
                        {activeClient && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
                                        <MapPinIcon className="w-4 h-4 text-rhive-pink" />
                                        Tier 2: Property Campuses ({activeClient.campuses.length})
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {activeClient.campuses.map(campus => {
                                        const isSelected = campus.id === selectedCampusId;
                                        return (
                                            <div
                                                key={campus.id}
                                                onClick={() => {
                                                    setSelectedCampusId(campus.id);
                                                    setSelectedPhaseId(null);
                                                    setSelectedBuildingId(null);
                                                    setSelectedJobId(null);
                                                }}
                                                className={cn(
                                                    "p-5 rounded-lg border cursor-pointer transition-all relative overflow-hidden group",
                                                    isSelected 
                                                        ? "bg-black/90 border-rhive-pink shadow-[0_0_15px_rgba(236,2,139,0.3)] ring-1 ring-rhive-pink"
                                                        : "bg-black/50 border-gray-800 hover:border-gray-700"
                                                )}
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <span className="text-[10px] font-mono text-rhive-pink font-bold uppercase tracking-wider block mb-1">
                                                            Tier 2 Campus
                                                        </span>
                                                        <h4 className="text-base font-bold text-white group-hover:text-rhive-pink transition-colors">
                                                            {campus.name}
                                                        </h4>
                                                        <p className="text-xs text-gray-400 mt-1 font-mono">
                                                            {campus.address}, {campus.city}, {campus.state} {campus.zip}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="mt-4 pt-3 border-t border-gray-800 flex items-center justify-between text-xs text-gray-400 font-mono">
                                                    <span>{campus.phases.length} Sub-Phases</span>
                                                    <span className="text-rhive-pink flex items-center font-bold">
                                                        {isSelected ? "Active Campus" : "Select Campus"}
                                                        <ChevronRightIcon className="w-3.5 h-3.5 ml-0.5" />
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}

                                    {activeClient.campuses.length === 0 && (
                                        <div className="col-span-full py-8 text-center bg-black/30 border border-gray-800 rounded-lg">
                                            <p className="text-gray-500 font-mono text-xs">No property campuses registered under this client yet.</p>
                                            <Button 
                                                variant="secondary" 
                                                size="sm" 
                                                onClick={() => setIsAddCampusModalOpen(true)}
                                                className="mt-3 text-xs"
                                            >
                                                Add First Campus
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* ── TIER 3: SUB-PROPERTY / PHASES ──────────────────────────── */}
                        {activeCampus && (
                            <div className="space-y-4 pt-4 border-t border-gray-800">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
                                        <BuildingStorefrontIcon className="w-4 h-4 text-rhive-pink" />
                                        Tier 3: Phases for "{activeCampus.name}" ({activeCampus.phases.length})
                                    </span>
                                    <Button 
                                        variant="secondary" 
                                        size="sm"
                                        onClick={() => setIsAddPhaseModalOpen(true)}
                                        className="text-xs"
                                    >
                                        <PlusIcon className="w-3.5 h-3.5 mr-1" />
                                        Add Phase
                                    </Button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {activeCampus.phases.map(phase => {
                                        const isSelected = phase.id === selectedPhaseId;
                                        return (
                                            <div
                                                key={phase.id}
                                                onClick={() => {
                                                    setSelectedPhaseId(phase.id);
                                                    setSelectedBuildingId(null);
                                                    setSelectedJobId(null);
                                                }}
                                                className={cn(
                                                    "p-4 rounded-lg border cursor-pointer transition-all",
                                                    isSelected 
                                                        ? "bg-black/90 border-rhive-pink shadow-[0_0_12px_rgba(236,2,139,0.3)] ring-1 ring-rhive-pink"
                                                        : "bg-black/40 border-gray-800 hover:border-gray-700"
                                                )}
                                            >
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="text-[10px] font-mono text-rhive-pink uppercase font-bold">
                                                        Tier 3 Phase
                                                    </span>
                                                    {phase.phase_number && (
                                                        <span className="text-[10px] font-mono text-gray-500">
                                                            {phase.phase_number}
                                                        </span>
                                                    )}
                                                </div>
                                                <h5 className="font-bold text-white text-sm">
                                                    {phase.name}
                                                </h5>
                                                {phase.description && (
                                                    <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                                                        {phase.description}
                                                    </p>
                                                )}
                                                <div className="mt-3 pt-2 border-t border-gray-800 text-[11px] font-mono text-gray-400 flex justify-between">
                                                    <span>{phase.buildings.length} Buildings</span>
                                                    <span className="text-rhive-pink font-bold">{isSelected ? "Viewing" : "Explore"}</span>
                                                </div>
                                            </div>
                                        );
                                    })}

                                    {activeCampus.phases.length === 0 && (
                                        <div className="col-span-full py-6 text-center bg-black/20 border border-gray-800 rounded-lg">
                                            <p className="text-gray-500 font-mono text-xs">No phases registered for this campus.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* ── TIER 4: BUILDING ASSETS ─────────────────────────────────── */}
                        {activePhase && (
                            <div className="space-y-4 pt-4 border-t border-gray-800">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
                                        <ShieldCheckIcon className="w-4 h-4 text-rhive-pink" />
                                        Tier 4: Building Assets in "{activePhase.name}" ({activePhase.buildings.length})
                                    </span>
                                    <Button 
                                        variant="secondary" 
                                        size="sm"
                                        onClick={() => setIsAddBuildingModalOpen(true)}
                                        className="text-xs"
                                    >
                                        <PlusIcon className="w-3.5 h-3.5 mr-1" />
                                        Add Building Asset
                                    </Button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {activePhase.buildings.map(building => {
                                        const isSelected = building.id === selectedBuildingId;
                                        return (
                                            <div
                                                key={building.id}
                                                onClick={() => {
                                                    setSelectedBuildingId(building.id);
                                                    setSelectedJobId(null);
                                                }}
                                                className={cn(
                                                    "p-5 rounded-lg border cursor-pointer transition-all",
                                                    isSelected 
                                                        ? "bg-black/90 border-rhive-pink shadow-[0_0_15px_rgba(236,2,139,0.3)] ring-1 ring-rhive-pink"
                                                        : "bg-black/40 border-gray-800 hover:border-gray-700"
                                                )}
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-[10px] font-mono text-rhive-pink uppercase font-bold">
                                                        Tier 4 Building
                                                    </span>
                                                    <span className={cn(
                                                        "px-2 py-0.5 rounded text-[9px] font-bold uppercase",
                                                        building.condition === 'Good' && "bg-green-500/10 text-green-400 border border-green-500/20",
                                                        building.condition === 'Fair' && "bg-amber-500/10 text-amber-400 border border-amber-500/20",
                                                        building.condition === 'Critical' && "bg-red-500/10 text-red-400 border border-red-500/20",
                                                        building.condition === 'Under Replacement' && "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                                                    )}>
                                                        {building.condition || 'Asset'}
                                                    </span>
                                                </div>

                                                <h4 className="font-bold text-white text-base">
                                                    {building.name}
                                                </h4>

                                                <div className="mt-3 space-y-1 text-xs font-mono text-gray-300">
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-500">Roof Area:</span>
                                                        <strong className="text-white">{building.roof_sqft.toLocaleString()} sqft</strong>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-500">Membrane/Type:</span>
                                                        <span className="text-gray-300 truncate max-w-[150px]">{building.roof_type}</span>
                                                    </div>
                                                    {building.pitch && (
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-500">Pitch/Stories:</span>
                                                            <span className="text-gray-300">{building.pitch} • {building.stories || 1} story</span>
                                                        </div>
                                                    )}
                                                </div>

                                                {building.map_annotation && (
                                                    <div className="mt-3 p-2 bg-gray-900/60 rounded border border-gray-800 text-[11px] font-mono text-gray-400">
                                                        <span className="text-rhive-pink font-bold">Annotation: </span>
                                                        {building.map_annotation.notes}
                                                    </div>
                                                )}

                                                <div className="mt-4 pt-3 border-t border-gray-800 flex justify-between text-xs font-mono">
                                                    <span className="text-gray-400">{building.jobs.length} Jobs Linked</span>
                                                    <span className="text-rhive-pink font-bold">{isSelected ? "Active Asset" : "View Jobs"}</span>
                                                </div>
                                            </div>
                                        );
                                    })}

                                    {activePhase.buildings.length === 0 && (
                                        <div className="col-span-full py-6 text-center bg-black/20 border border-gray-800 rounded-lg">
                                            <p className="text-gray-500 font-mono text-xs">No buildings recorded in this phase yet.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* ── TIER 5: PROJECTS / JOBS ─────────────────────────────────── */}
                        {activeBuilding && (
                            <div className="space-y-4 pt-4 border-t border-gray-800">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
                                        <BriefcaseIcon className="w-4 h-4 text-rhive-pink" />
                                        Tier 5: Projects / Jobs on "{activeBuilding.name}" ({activeBuilding.jobs.length})
                                    </span>
                                    <Button 
                                        variant="primary" 
                                        size="sm"
                                        onClick={() => setIsAddJobModalOpen(true)}
                                        className="text-xs"
                                    >
                                        <PlusIcon className="w-3.5 h-3.5 mr-1" />
                                        Create Tier 5 Job
                                    </Button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {activeBuilding.jobs.map(job => {
                                        const isSelected = job.id === selectedJobId;
                                        return (
                                            <div
                                                key={job.id}
                                                onClick={() => setSelectedJobId(job.id)}
                                                className={cn(
                                                    "p-5 rounded-lg border transition-all cursor-pointer",
                                                    isSelected
                                                        ? "bg-black/90 border-rhive-pink shadow-[0_0_15px_rgba(236,2,139,0.3)] ring-1 ring-rhive-pink"
                                                        : "bg-black/50 border-gray-800 hover:border-gray-700"
                                                )}
                                            >
                                                <div className="flex items-start justify-between gap-3 mb-2">
                                                    <div>
                                                        <span className="text-[10px] font-mono text-rhive-pink uppercase font-bold block mb-1">
                                                            Tier 5 Job • {job.job_number || 'RHIVE Job'}
                                                        </span>
                                                        <h5 className="font-bold text-white text-base">
                                                            {job.title}
                                                        </h5>
                                                    </div>
                                                    <span className={cn(
                                                        "px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase whitespace-nowrap",
                                                        job.status === 'Active' && "bg-rhive-pink/10 text-rhive-pink border border-rhive-pink/30",
                                                        job.status === 'Under Review' && "bg-amber-500/10 text-amber-400 border border-amber-500/30",
                                                        job.status === 'Completed' && "bg-green-500/10 text-green-400 border border-green-500/30"
                                                    )}>
                                                        {job.status}
                                                    </span>
                                                </div>

                                                <div className="grid grid-cols-2 gap-2 mt-4 p-3 bg-gray-900/60 rounded border border-gray-800 text-xs font-mono">
                                                    <div>
                                                        <span className="text-[9px] uppercase tracking-wider text-gray-500 block">Current Stage</span>
                                                        <span className="text-white font-bold text-[11px] block truncate">{job.current_stage}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-[9px] uppercase tracking-wider text-gray-500 block">Contract Value</span>
                                                        <span className="text-[#e2ab49] font-bold text-sm block">{formatCurrency(job.contract_value)}</span>
                                                    </div>
                                                </div>

                                                <div className="mt-3 flex items-center justify-between text-xs font-mono text-gray-400">
                                                    <span>Scope: <strong className="text-white">{job.scope_type}</strong></span>
                                                    {job.target_completion && (
                                                        <span>Target: {job.target_completion}</span>
                                                    )}
                                                </div>

                                                {/* Stage Quick Jump Button */}
                                                <div className="mt-4 pt-3 border-t border-gray-800 flex items-center justify-between">
                                                    <span className="text-[11px] text-gray-500 font-mono">
                                                        Assigned: {job.assigned_contractor || 'RHIVE Crew'}
                                                    </span>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            const stagePage = getStagePageId(job.current_stage);
                                                            setActivePageId(stagePage);
                                                        }}
                                                        className="text-xs text-rhive-pink hover:text-white flex items-center gap-1 font-mono font-bold hover:underline"
                                                    >
                                                        Open Stage <ArrowRightIcon className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}

                                    {activeBuilding.jobs.length === 0 && (
                                        <div className="col-span-full py-8 text-center bg-black/20 border border-gray-800 rounded-lg">
                                            <p className="text-gray-500 font-mono text-xs">No active or historical projects recorded for this building asset.</p>
                                            <Button 
                                                variant="secondary" 
                                                size="sm"
                                                onClick={() => setIsAddJobModalOpen(true)}
                                                className="mt-3 text-xs"
                                            >
                                                Create First Job
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* ── MODALS ──────────────────────────────────────────────────────── */}

            {/* 1. Modal: Add Tier 1 Client */}
            {isAddClientModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-gray-950 border border-gray-800 rounded-xl p-6 w-full max-w-lg space-y-4">
                        <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                            <span className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                                Add Tier 1 Client / Company
                            </span>
                            <button onClick={() => setIsAddClientModalOpen(false)} className="text-gray-400 hover:text-white">
                                <XIcon className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateClient} className="space-y-4">
                            <div>
                                <label className="block text-xs font-mono text-gray-400 uppercase mb-1">Company / Client Name *</label>
                                <input 
                                    type="text" 
                                    required 
                                    value={newClientForm.name} 
                                    onChange={e => setNewClientForm({...newClientForm, name: e.target.value})}
                                    placeholder="e.g. UNPHC, City of Salt Lake, or John Doe"
                                    className="w-full bg-black border border-gray-800 rounded px-3 py-2 text-sm text-white font-mono focus:border-rhive-pink focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-mono text-gray-400 uppercase mb-1">Account Category *</label>
                                <select 
                                    value={newClientForm.customer_type}
                                    onChange={e => setNewClientForm({...newClientForm, customer_type: e.target.value as CustomerType})}
                                    className="w-full bg-black border border-gray-800 rounded px-3 py-2 text-sm text-white font-mono focus:border-rhive-pink focus:outline-none"
                                >
                                    <option value="Commercial">Commercial (Business, Portfolio, HOA)</option>
                                    <option value="Government">Government (City, State, Municipal)</option>
                                    <option value="Residential">Residential (Single Family Homeowner)</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-mono text-gray-400 uppercase mb-1">Primary Contact Name</label>
                                    <input 
                                        type="text" 
                                        value={newClientForm.primaryName} 
                                        onChange={e => setNewClientForm({...newClientForm, primaryName: e.target.value})}
                                        placeholder="Full Name"
                                        className="w-full bg-black border border-gray-800 rounded px-3 py-2 text-sm text-white font-mono focus:border-rhive-pink focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-mono text-gray-400 uppercase mb-1">Phone Number</label>
                                    <input 
                                        type="text" 
                                        value={newClientForm.primaryPhone} 
                                        onChange={e => setNewClientForm({...newClientForm, primaryPhone: e.target.value})}
                                        placeholder="(801) 555-0123"
                                        className="w-full bg-black border border-gray-800 rounded px-3 py-2 text-sm text-white font-mono focus:border-rhive-pink focus:outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-mono text-gray-400 uppercase mb-1">Billing Address</label>
                                <input 
                                    type="text" 
                                    value={newClientForm.billingAddress} 
                                    onChange={e => setNewClientForm({...newClientForm, billingAddress: e.target.value})}
                                    placeholder="Street, City, State ZIP"
                                    className="w-full bg-black border border-gray-800 rounded px-3 py-2 text-sm text-white font-mono focus:border-rhive-pink focus:outline-none"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-800">
                                <Button variant="secondary" size="sm" onClick={() => setIsAddClientModalOpen(false)}>
                                    Cancel
                                </Button>
                                <Button variant="primary" size="sm" type="submit">
                                    Create Client
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* 2. Modal: Add Tier 2 Campus */}
            {isAddCampusModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-gray-950 border border-gray-800 rounded-xl p-6 w-full max-w-lg space-y-4">
                        <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                            <span className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                                Add Tier 2 Campus to {activeClient?.name}
                            </span>
                            <button onClick={() => setIsAddCampusModalOpen(false)} className="text-gray-400 hover:text-white">
                                <XIcon className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateCampus} className="space-y-4">
                            <div>
                                <label className="block text-xs font-mono text-gray-400 uppercase mb-1">Campus / Property Name *</label>
                                <input 
                                    type="text" 
                                    required 
                                    value={newCampusForm.name} 
                                    onChange={e => setNewCampusForm({...newCampusForm, name: e.target.value})}
                                    placeholder="e.g. Escalante Park Campus"
                                    className="w-full bg-black border border-gray-800 rounded px-3 py-2 text-sm text-white font-mono focus:border-rhive-pink focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-mono text-gray-400 uppercase mb-1">Street Address</label>
                                <input 
                                    type="text" 
                                    value={newCampusForm.address} 
                                    onChange={e => setNewCampusForm({...newCampusForm, address: e.target.value})}
                                    placeholder="e.g. 1050 N 300 W"
                                    className="w-full bg-black border border-gray-800 rounded px-3 py-2 text-sm text-white font-mono focus:border-rhive-pink focus:outline-none"
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                                <div>
                                    <label className="block text-xs font-mono text-gray-400 uppercase mb-1">City</label>
                                    <input 
                                        type="text" 
                                        value={newCampusForm.city} 
                                        onChange={e => setNewCampusForm({...newCampusForm, city: e.target.value})}
                                        className="w-full bg-black border border-gray-800 rounded px-3 py-2 text-sm text-white font-mono focus:border-rhive-pink focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-mono text-gray-400 uppercase mb-1">State</label>
                                    <input 
                                        type="text" 
                                        value={newCampusForm.state} 
                                        onChange={e => setNewCampusForm({...newCampusForm, state: e.target.value})}
                                        className="w-full bg-black border border-gray-800 rounded px-3 py-2 text-sm text-white font-mono focus:border-rhive-pink focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-mono text-gray-400 uppercase mb-1">ZIP Code</label>
                                    <input 
                                        type="text" 
                                        value={newCampusForm.zip} 
                                        onChange={e => setNewCampusForm({...newCampusForm, zip: e.target.value})}
                                        className="w-full bg-black border border-gray-800 rounded px-3 py-2 text-sm text-white font-mono focus:border-rhive-pink focus:outline-none"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-800">
                                <Button variant="secondary" size="sm" onClick={() => setIsAddCampusModalOpen(false)}>
                                    Cancel
                                </Button>
                                <Button variant="primary" size="sm" type="submit">
                                    Save Campus
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* 3. Modal: Add Tier 3 Phase */}
            {isAddPhaseModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-gray-950 border border-gray-800 rounded-xl p-6 w-full max-w-lg space-y-4">
                        <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                            <span className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                                Add Tier 3 Phase to {activeCampus?.name}
                            </span>
                            <button onClick={() => setIsAddPhaseModalOpen(false)} className="text-gray-400 hover:text-white">
                                <XIcon className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleCreatePhase} className="space-y-4">
                            <div>
                                <label className="block text-xs font-mono text-gray-400 uppercase mb-1">Sub-Property / Phase Name *</label>
                                <input 
                                    type="text" 
                                    required 
                                    value={newPhaseForm.name} 
                                    onChange={e => setNewPhaseForm({...newPhaseForm, name: e.target.value})}
                                    placeholder="e.g. Escalante 1 or South Quad"
                                    className="w-full bg-black border border-gray-800 rounded px-3 py-2 text-sm text-white font-mono focus:border-rhive-pink focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-mono text-gray-400 uppercase mb-1">Phase Reference Code</label>
                                <input 
                                    type="text" 
                                    value={newPhaseForm.phase_number} 
                                    onChange={e => setNewPhaseForm({...newPhaseForm, phase_number: e.target.value})}
                                    placeholder="e.g. Phase 1"
                                    className="w-full bg-black border border-gray-800 rounded px-3 py-2 text-sm text-white font-mono focus:border-rhive-pink focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-mono text-gray-400 uppercase mb-1">Description / Notes</label>
                                <textarea 
                                    value={newPhaseForm.description} 
                                    onChange={e => setNewPhaseForm({...newPhaseForm, description: e.target.value})}
                                    placeholder="Details regarding this phase..."
                                    rows={2}
                                    className="w-full bg-black border border-gray-800 rounded px-3 py-2 text-sm text-white font-mono focus:border-rhive-pink focus:outline-none"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-800">
                                <Button variant="secondary" size="sm" onClick={() => setIsAddPhaseModalOpen(false)}>
                                    Cancel
                                </Button>
                                <Button variant="primary" size="sm" type="submit">
                                    Save Phase
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* 4. Modal: Add Tier 4 Building Asset */}
            {isAddBuildingModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-gray-950 border border-gray-800 rounded-xl p-6 w-full max-w-lg space-y-4">
                        <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                            <span className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                                Add Tier 4 Building to {activePhase?.name}
                            </span>
                            <button onClick={() => setIsAddBuildingModalOpen(false)} className="text-gray-400 hover:text-white">
                                <XIcon className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateBuilding} className="space-y-4">
                            <div>
                                <label className="block text-xs font-mono text-gray-400 uppercase mb-1">Building Asset Name *</label>
                                <input 
                                    type="text" 
                                    required 
                                    value={newBuildingForm.name} 
                                    onChange={e => setNewBuildingForm({...newBuildingForm, name: e.target.value})}
                                    placeholder='e.g. "Building 3 - North" or "Clubhouse"'
                                    className="w-full bg-black border border-gray-800 rounded px-3 py-2 text-sm text-white font-mono focus:border-rhive-pink focus:outline-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-mono text-gray-400 uppercase mb-1">Roof Sqft (Area) *</label>
                                    <input 
                                        type="number" 
                                        required 
                                        value={newBuildingForm.roof_sqft} 
                                        onChange={e => setNewBuildingForm({...newBuildingForm, roof_sqft: Number(e.target.value)})}
                                        className="w-full bg-black border border-gray-800 rounded px-3 py-2 text-sm text-white font-mono focus:border-rhive-pink focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-mono text-gray-400 uppercase mb-1">Current Condition</label>
                                    <select 
                                        value={newBuildingForm.condition}
                                        onChange={e => setNewBuildingForm({...newBuildingForm, condition: e.target.value as any})}
                                        className="w-full bg-black border border-gray-800 rounded px-3 py-2 text-sm text-white font-mono focus:border-rhive-pink focus:outline-none"
                                    >
                                        <option value="Good">Good</option>
                                        <option value="Fair">Fair</option>
                                        <option value="Critical">Critical</option>
                                        <option value="Under Replacement">Under Replacement</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-mono text-gray-400 uppercase mb-1">Roof Membrane / Material</label>
                                <input 
                                    type="text" 
                                    value={newBuildingForm.roof_type} 
                                    onChange={e => setNewBuildingForm({...newBuildingForm, roof_type: e.target.value})}
                                    placeholder="e.g. .060MIL TPO Flat Membrane"
                                    className="w-full bg-black border border-gray-800 rounded px-3 py-2 text-sm text-white font-mono focus:border-rhive-pink focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-mono text-gray-400 uppercase mb-1">Map Notes / Observations</label>
                                <textarea 
                                    value={newBuildingForm.notes} 
                                    onChange={e => setNewBuildingForm({...newBuildingForm, notes: e.target.value})}
                                    placeholder="Add map annotations, ponding issues, drain notes..."
                                    rows={2}
                                    className="w-full bg-black border border-gray-800 rounded px-3 py-2 text-sm text-white font-mono focus:border-rhive-pink focus:outline-none"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-800">
                                <Button variant="secondary" size="sm" onClick={() => setIsAddBuildingModalOpen(false)}>
                                    Cancel
                                </Button>
                                <Button variant="primary" size="sm" type="submit">
                                    Save Building
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* 5. Modal: Add Tier 5 Project / Job */}
            {isAddJobModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-gray-950 border border-gray-800 rounded-xl p-6 w-full max-w-lg space-y-4">
                        <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                            <span className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                                Create Tier 5 Job on {activeBuilding?.name}
                            </span>
                            <button onClick={() => setIsAddJobModalOpen(false)} className="text-gray-400 hover:text-white">
                                <XIcon className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateJob} className="space-y-4">
                            <div>
                                <label className="block text-xs font-mono text-gray-400 uppercase mb-1">Job Title *</label>
                                <input 
                                    type="text" 
                                    required 
                                    value={newJobForm.title} 
                                    onChange={e => setNewJobForm({...newJobForm, title: e.target.value})}
                                    placeholder="e.g. Flat Roof Replacement - 14,434 sqft"
                                    className="w-full bg-black border border-gray-800 rounded px-3 py-2 text-sm text-white font-mono focus:border-rhive-pink focus:outline-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-mono text-gray-400 uppercase mb-1">Contract Value ($) *</label>
                                    <input 
                                        type="number" 
                                        required 
                                        value={newJobForm.contract_value} 
                                        onChange={e => setNewJobForm({...newJobForm, contract_value: Number(e.target.value)})}
                                        className="w-full bg-black border border-gray-800 rounded px-3 py-2 text-sm text-white font-mono focus:border-rhive-pink focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-mono text-gray-400 uppercase mb-1">Scope Type</label>
                                    <input 
                                        type="text" 
                                        value={newJobForm.scope_type} 
                                        onChange={e => setNewJobForm({...newJobForm, scope_type: e.target.value})}
                                        placeholder="Flat Roof, Heat Trace, Shingle..."
                                        className="w-full bg-black border border-gray-800 rounded px-3 py-2 text-sm text-white font-mono focus:border-rhive-pink focus:outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-mono text-gray-400 uppercase mb-1">Starting Pipeline Stage</label>
                                <select 
                                    value={newJobForm.current_stage}
                                    onChange={e => setNewJobForm({...newJobForm, current_stage: e.target.value})}
                                    className="w-full bg-black border border-gray-800 rounded px-3 py-2 text-sm text-white font-mono focus:border-rhive-pink focus:outline-none"
                                >
                                    <option value="Stage 1: LEAD (Intake)">Stage 1: LEAD (Intake)</option>
                                    <option value="Stage 2: ESTIMATE (Property Data)">Stage 2: ESTIMATE (Property Data)</option>
                                    <option value="Stage 3: QUOTE (Pricing Options)">Stage 3: QUOTE (Pricing Options)</option>
                                    <option value="Stage 4: SIGN & VERIFY (Agreement)">Stage 4: SIGN & VERIFY (Agreement)</option>
                                    <option value="Stage 5: SCHEDULE (Queue)">Stage 5: SCHEDULE (Queue)</option>
                                    <option value="Stage 6: PRE-INSTALLATION (Prep)">Stage 6: PRE-INSTALLATION (Prep)</option>
                                    <option value="Stage 7: INSTALL (In Progress)">Stage 7: INSTALL (In Progress)</option>
                                    <option value="Stage 8: PUNCH LIST (Quality Control)">Stage 8: PUNCH LIST (Quality Control)</option>
                                    <option value="Stage 9: INVOICING (Review)">Stage 9: INVOICING (Review)</option>
                                    <option value="Stage 10: COMPLETED (Paid)">Stage 10: COMPLETED (Paid)</option>
                                </select>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-800">
                                <Button variant="secondary" size="sm" onClick={() => setIsAddJobModalOpen(false)}>
                                    Cancel
                                </Button>
                                <Button variant="primary" size="sm" type="submit">
                                    Create Job
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </PageContainer>
    );
};

export default CustomersPortalPage;
