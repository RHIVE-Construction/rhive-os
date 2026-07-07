
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Project, Property, User, ProjectStage, PROJECT_STAGES_ORDER } from '../types';
import { contactService, userService, userLogService, firestoreService } from '../lib/firebaseService';
import { session, initialUser } from '../lib/session';

interface MockDatabaseContextType {
    users: User[];
    properties: Property[];
    projects: Project[];
    currentUser: User | null;
    currentProjectId: string | null;
    setCurrentProjectId: (id: string | null) => void;
    login: (role?: string, password?: string, email?: string) => Promise<any>;
    logout: () => void;

    // Actions
    createProject: (name: string, type: any, propertyId: string, accountId: string, initialStage?: string) => string;
    addUser: (user: Partial<User>) => void;
    addProperty: (property: Partial<Property>) => string;
    updateProperty: (propertyId: string, updates: Partial<Property>) => void;
    addCommunication: (type: 'email' | 'text' | 'file', targetId: string, content: string) => void;
    updateProjectStage: (projectId: string, stage: ProjectStage) => void;
    saveQuote: (projectId: string, total: number, items: any[]) => void;
    approveQuote: (projectId: string) => void;

    // Getters
    getProject: (id: string) => Project | undefined;
    getUserProjects: (userId: string) => Project[];
}

const MockDatabaseContext = createContext<MockDatabaseContextType | undefined>(undefined);

// --- SEED DATA ---
const SEED_USERS: User[] = [
    { id: 'U-ADMIN-MICHAEL', name: 'Michael Robinson', role: 'Admin', email: 'michael@rhiveconstruction.com', phone: '(801) 555-0192', password_hash: 'daaad6e5604e8e17bd9f108d91e26afe6281dac8fda0091040a7a6d7bd9b43b5', avatarUrl: 'https://i.pravatar.cc/150?u=michael' },
    { id: 'U-EMP-1', name: 'Mike Robinson', role: 'Employee', email: 'mike@rhive.com', avatarUrl: 'https://i.pravatar.cc/150?u=mike' },
    { id: 'U-CUST-1', name: 'Michael Robinson', role: 'Customer', email: 'michael@rhiveconstruction.com', phone: '(801) 555-0192', avatarUrl: 'https://i.pravatar.cc/150?u=michael' },
    { id: 'U-CUST-2', name: 'Willow Park HOA', role: 'Customer', email: 'board@willowpark.com' },
    { id: 'U-CONT-1', name: 'Quality Roofing', role: 'Contractor', email: 'jobs@quality.com' },
    { id: 'U-SUPP-1', name: 'ABC Supply', role: 'Supplier', email: 'orders@abc.com' },
    { id: 'U-ACC-LHM', name: 'Larry H Miller Group', role: 'Customer', email: 'billing@lhm.com' },
    // NOTE: SEED_USERS are fallback stubs for display/dev only.
    // password_hash is intentionally OMITTED here — seeds must never bypass Firestore password verification.
    // If Firestore is unavailable, login will fail rather than authenticate against a static seed.
    { id: 'U-ADMIN-JAMES', name: 'James Gimena', role: 'Admin', email: 'james.g@rhiveconstruction.com', phone: '+17438876637' },
    { id: 'U-GUEST', name: 'Public Guest', role: 'Public', email: 'guest@rhive.com' },
];

const SEED_PROPERTIES: Property[] = [
    { _id: 'PROP-1', address_full: '1927 Thompson St, Boulder, CO', owner_id: 'U-CUST-1', type: 'Residential', coordinates: { lat: 40.0, lng: -105.0 }, features: ['Shingle', 'Solar'] },
    { _id: 'PROP-2', address_full: '525 Aspen Meadow Dr, Logan, UT', owner_id: 'U-CUST-2', type: 'Commercial', coordinates: { lat: 41.7, lng: -111.8 }, features: ['Flat', 'Commercial'] },
    { _id: 'PROP-3', address_full: 'Hill AFB Hangar 42, UT', owner_id: 'U-GOV', type: 'Government', coordinates: { lat: 41.1, lng: -111.9 }, features: ['Metal', 'High Security'] },
    { _id: 'PROP-MEGAPLEX', address_full: 'South Jordan Parkway Megaplex', owner_id: 'U-ACC-LHM', type: 'Commercial', coordinates: { lat: 40.5, lng: -111.9 }, features: ['Flat', 'Commercial'] },
    { _id: 'PROP-JAMES', address_full: '280 Bleecker St, New York, NY', owner_id: 'U-ADMIN-JAMES', type: 'Residential', coordinates: { lat: 40.7317208, lng: -74.0034605 }, features: ['Shingle'] },
];

const SEED_PROJECTS: Project[] = [
    {
        _id: 'PROJ-1',
        name: 'Thompson Roof Replacement',
        property_id: 'PROP-1',
        account_id: 'U-CUST-1',
        project_type: 'Residential',
        current_stage: 'Quote',
        status: 'Active',
        last_updated: '2023-10-01',
        quote: { total: 14500, status: 'Sent', items: [{ name: 'Materials', cost: 8000 }, { name: 'Labor', cost: 6500 }] }
    },
    {
        _id: 'PROJ-2',
        name: 'Willow Park Gutter Repair',
        property_id: 'PROP-2',
        account_id: 'U-CUST-2',
        project_type: 'Commercial',
        current_stage: 'Schedule',
        status: 'Active',
        assigned_contractor_id: 'U-CONT-1',
        last_updated: '2023-10-05',
        quote: { total: 4200, status: 'Approved', items: [] }
    },
    {
        _id: 'PROJ-3',
        name: 'Hangar 42 Security Upgrade',
        property_id: 'PROP-3',
        account_id: 'U-GOV',
        project_type: 'Government',
        current_stage: 'Estimate',
        status: 'Active',
        last_updated: '2023-10-10',
        compliance: { solicitation_num: '', wage_determination: '', certified_payroll_status: false }
    },
    {
        _id: 'PROJ-MEGA',
        name: 'Megaplex Roof Restore',
        property_id: 'PROP-MEGAPLEX',
        account_id: 'U-ACC-LHM',
        project_type: 'Commercial',
        current_stage: 'Lead',
        status: 'Active',
        last_updated: '2023-10-12',
    },
    {
        _id: 'PROJ-JAMES',
        name: 'Gimena TEST Residence',
        property_id: 'PROP-JAMES',
        account_id: 'U-ADMIN-JAMES',
        project_type: 'Residential',
        current_stage: 'Lead',
        status: 'Active',
        last_updated: '2026-02-16',
    }
];



export const MockDatabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [users, setUsers] = useState<User[]>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('rhive_db_users');
            if (saved) return JSON.parse(saved);
        }
        return SEED_USERS;
    });
    const [properties, setProperties] = useState<Property[]>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('rhive_db_properties');
            if (saved) return JSON.parse(saved);
        }
        return SEED_PROPERTIES;
    });
    const [projects, setProjects] = useState<Project[]>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('rhive_db_projects');
            if (saved) return JSON.parse(saved);
        }
        return SEED_PROJECTS;
    });
    const [loading, setLoading] = useState(true);

    // initialUser is read at MODULE LOAD TIME (before React) — guaranteed no timing issues
    const [currentUser, setCurrentUser] = useState<User | null>(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const bypassRole = params.get('bypass');
            if (bypassRole) {
                const normalized = bypassRole.toLowerCase();
                let candidate: User | undefined;
                if (normalized === 'admin' || normalized === 'super admin') {
                    candidate = SEED_USERS.find(u => u.name === 'Michael Robinson' && (u.role === 'Admin' || u.role === 'Super Admin')) ||
                                SEED_USERS.find(u => u.role.toLowerCase() === normalized);
                } else {
                    candidate = SEED_USERS.find(u => u.role.toLowerCase() === normalized);
                }
                if (candidate) {
                    session.write(candidate);
                    return candidate;
                }
            }
        }
        return initialUser;
    });
    const [currentProjectId, setCurrentProjectId] = useState<string | null>(localStorage.getItem('rhive_project_id'));

    // Use a ref so the subscription callback always has the latest currentUser
    // without re-subscribing every time it changes (which causes race conditions)
    const currentUserRef = React.useRef<User | null>(currentUser);
    useEffect(() => { currentUserRef.current = currentUser; }, [currentUser]);

    useEffect(() => {
        // SECURITY: Strip password_hash before caching in localStorage.
        // Passwords must ALWAYS come from Firestore server, never from browser cache.
        const safeUsers = users.map(({ password_hash, ...u }) => u);
        localStorage.setItem('rhive_db_users', JSON.stringify(safeUsers));
    }, [users]);

    useEffect(() => {
        localStorage.setItem('rhive_db_properties', JSON.stringify(properties));
    }, [properties]);

    useEffect(() => {
        localStorage.setItem('rhive_db_projects', JSON.stringify(projects));
    }, [projects]);

    useEffect(() => {
        const unsub = userService.subscribe((data) => {
            if (data && data.length > 0) {
                setUsers(data as User[]);
            } else {
                const saved = localStorage.getItem('rhive_db_users');
                if (saved) {
                    setUsers(JSON.parse(saved));
                } else {
                    setUsers(SEED_USERS);
                }
            }
            setLoading(false);
            // Sync currentUser if their Firestore record changed
            const cu = currentUserRef.current;
            if (cu) {
                const updated = ((data || []) as User[]).find(u => u.id === cu.id) || SEED_USERS.find(u => u.id === cu.id);
                if (updated && JSON.stringify(updated) !== JSON.stringify(cu)) {
                    setCurrentUser(updated);
                    session.write(updated);
                }
            }
        });
        return () => unsub();
    }, []); // Only subscribe once — ref keeps currentUser fresh


    useEffect(() => {
        if (currentProjectId) localStorage.setItem('rhive_project_id', currentProjectId);
        else localStorage.removeItem('rhive_project_id');
    }, [currentProjectId]);

    // NOTE: Admin profiles (James, Michael) are managed in Firestore only.
    // Auto-seeding of password_hash has been removed — it was overwriting password resets on every page load.
    // To reset a user's password, use the Forgot Password flow or UserManagementPage.    const login = async (role?: string, password?: string, email?: string) => {
        const { hashPassword } = await import('../lib/utils');

        const setSessionUser = (user: User) => {
            session.write(user);
            setCurrentUser(user);
        };

        // -------------------------------------------------------
        // PUBLIC / GUEST — no credentials needed
        // -------------------------------------------------------
        if (role === 'Public') {
            const guestUser: User = { id: 'U-GUEST', name: 'Public Guest', role: 'Public', email: 'guest@rhive.com' };
            setSessionUser(guestUser);
            userLogService.logAction('LOGIN', 'Public Guest logged in', { role: 'Public' }, guestUser);
            return { success: true };
        }

        // -------------------------------------------------------
        // DUMMY BYPASS FOR LOCAL TESTING / QUICK SWITCH
        // -------------------------------------------------------
        if (password === 'bypass' || !password) {
            let foundUser: User | undefined;
            if (email) {
                const norm = email.toLowerCase().trim();
                if (role && role !== 'Public') {
                    foundUser = users.find(u => u.email?.toLowerCase().trim() === norm && (u.role === role || u.role === 'Super Admin')) ||
                                SEED_USERS.find(u => u.email?.toLowerCase().trim() === norm && (u.role === role || u.role === 'Super Admin'));
                }
                if (!foundUser) {
                    foundUser = users.find(u => u.email?.toLowerCase().trim() === norm) ||
                                SEED_USERS.find(u => u.email?.toLowerCase().trim() === norm);
                }
            }
            if (!foundUser && role) {
                foundUser = users.find(u => u.role === role) ||
                            SEED_USERS.find(u => u.role === role);
            }
            if (foundUser) {
                const sessionUser = { ...foundUser };
                // Ensure correct role is bound if user is a Super Admin switching roles
                if (foundUser.role === 'Super Admin' && role && role !== 'Super Admin') {
                    sessionUser.role = role as any;
                }
                setSessionUser(sessionUser);
                userLogService.logAction('LOGIN', `User ${sessionUser.name} logged in via developer bypass`, { role: sessionUser.role }, sessionUser);
                return { success: true };
            }
        }

        // -------------------------------------------------------
        // ALL AUTHENTICATED ROLES — look up in Firestore users collection
        // Works for: Admin, Super Admin, Employee, Customer, Contractor, Supplier
        // -------------------------------------------------------
        if (!email || !password) {
            return { success: false, error: 'Email and password are required.' };
        }

        const normalizedEmail = email.toLowerCase().trim();

        // 1. Find the user by email from Firestore SERVER (bypasses cache to always get latest data).
        //    SYSTEM RULE: Password verification MUST use live Firestore data — never cached or seed fallback.
        //    This ensures password resets and profile updates are immediately reflected on login.
        let foundUser: User | undefined;
        let fromFirestore = false;
        try {
            const userResult = await userService.getByEmailFromServer(normalizedEmail);
            if (userResult.success && userResult.data) {
                foundUser = userResult.data as User;
                fromFirestore = true;
            }
        } catch (e) {
            console.warn('Firestore server query failed during login:', e);
        }

        // Fallback to local users state (subscription cache) ONLY for non-password fields (role lookup).
        // NEVER use SEED_USERS for password verification — seeds are static and cannot reflect password changes.
        if (!foundUser) {
            const seedFallback = users.find(u => u.email?.toLowerCase().trim() === normalizedEmail) ??
                                 SEED_USERS.find(u => u.email?.toLowerCase().trim() === normalizedEmail && !u.password_hash);
            if (seedFallback) {
                foundUser = seedFallback;
            }
        }

        if (!foundUser) {
            return { success: false, error: 'No account found with this email address.' };
        }

        // 2. Verify the role matches what the user selected (if role selection is supplied)
        if (role && role !== 'Public') {
            const isRoleAllowed = foundUser.role === role || foundUser.role === 'Super Admin';
            if (!isRoleAllowed) {
                return { success: false, error: `No ${role} account found with this email.` };
            }
        }

        // 3. Verify password — MUST come from Firestore (fromFirestore = true).
        //    If user was found from seed fallback (no password_hash), reject with a clear message.
        if (!fromFirestore && !foundUser?.password_hash) {
            return { success: false, error: 'Could not verify credentials. Please check your connection and try again.' };
        }

        if (!foundUser.password_hash) {
            if (password === 'rhive123') {
                const sessionUser = { ...foundUser };
                if (foundUser.role === 'Super Admin' && role && role !== 'Super Admin') {
                    sessionUser.role = role as any;
                }
                setSessionUser(sessionUser);
                userLogService.logAction('LOGIN', `User ${sessionUser.name} logged in successfully (using default password)`, { email: sessionUser.email }, sessionUser);
                return { success: true };
            }
            return { success: false, error: 'Invalid email or password.' };
        }

        const hashed = await hashPassword(password);
        if (foundUser.password_hash !== hashed) {
            return { success: false, error: 'Invalid email or password.' };
        }

        // 4. Success — write session and set current user
        const sessionUser = { ...foundUser };
        if (foundUser.role === 'Super Admin' && role && role !== 'Super Admin') {
            sessionUser.role = role as any;
        }
        setSessionUser(sessionUser);
        userLogService.logAction('LOGIN', `User ${sessionUser.name} logged in successfully`, { email: sessionUser.email }, sessionUser);
        return { success: true };
    };

    const logout = () => {
        if (currentUser) {
            userLogService.logAction('LOGOUT', `User ${currentUser.name} logged out`, undefined, currentUser);
        }
        session.clear();
        localStorage.removeItem('rhive_project_id');
        setCurrentUser(null);
        setCurrentProjectId(null);
    };

    // --- ACTIONS ---

    const addUser = (user: Partial<User>) => {
        const newId = user.id || 'U-NEW';
        const newUser: User = {
            id: newId,
            name: user.name || 'Unnamed',
            role: user.role || 'Customer',
            email: user.email || '',
            phone: user.phone || '',
            avatarUrl: user.avatarUrl || ''
        };
        setUsers(prev => {
            const filtered = prev.filter(u => u.id !== newId);
            return [...filtered, newUser];
        });
        userService.create(newUser);
        userLogService.logAction('ADD_USER', `User profile created: ${newUser.name} (${newUser.email || 'no email'})`, { user: newUser });
    };

    const addProperty = (property: Partial<Property>) => {
        const newId = `PROP-${Date.now()}`;
        const newProperty: Property = {
            _id: newId,
            address_full: property.address_full || 'Unknown Address',
            type: property.type || 'Residential',
            owner_id: property.owner_id || 'Unknown',
            coordinates: property.coordinates || { lat: 0, lng: 0 },
            features: property.features || [],
            buildings: property.buildings || [],
            escrow_note: property.escrow_note
        };
        setProperties(prev => [...prev, newProperty]);

        // Persist to Firestore so property records survive page refreshes
        firestoreService.addDocument('properties', {
            address_full: newProperty.address_full,
            type: newProperty.type,
            owner_id: newProperty.owner_id,
            coordinates: newProperty.coordinates,
            features: newProperty.features,
            buildings: newProperty.buildings,
            escrow_note: newProperty.escrow_note,
        }).then(result => {
            userLogService.logAction('ADD_PROPERTY', `Property added: ${newProperty.address_full}`, { propertyId: result.id || newId, property: newProperty });
        }).catch(() => {
            userLogService.logAction('ADD_PROPERTY', `Property added: ${newProperty.address_full} (ID: ${newId})`, { propertyId: newId, property: newProperty });
        });

        return newId;
    };


    const updateProperty = (propertyId: string, updates: Partial<Property>) => {
        setProperties(prev => prev.map(p =>
            p._id === propertyId ? { ...p, ...updates } : p
        ));
        userLogService.logAction('UPDATE_PROPERTY', `Property updated (ID: ${propertyId})`, { propertyId, updates });
    };

    const addCommunication = (type: 'email' | 'text' | 'file', targetId: string, content: string) => {
        console.log(`[SIMULATION] Added ${type} to ${targetId}: ${content}`);
        userLogService.logAction('ADD_COMMUNICATION', `Communication logged to ${targetId} (${type})`, { type, targetId, content });
    };

    const createProject = (name: string, type: any, propertyId: string, accountId: string, initialStage: string = 'Lead') => {
        // Build a document that the Firestore-backed pipeline (projectService.subscribe) can read
        const projectDoc: Record<string, any> = {
            name,
            project_type: type,
            property_id: propertyId,
            account_id: accountId,
            current_stage: initialStage,   // Honour the stage chosen by the form
            status: 'Active',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };

        // Persist to Firestore so the real-time pipeline subscription sees it immediately
        let resolvedId = `PROJ-${Date.now()}`;
        firestoreService.addDocument('projects', projectDoc).then((result) => {
            if (result.success && result.id) {
                resolvedId = result.id;
            }
            // Log activity AFTER Firestore write so notification includes the real Firestore ID
            // Include stage in payload so notification click resolves to correct stage page
            userLogService.logAction(
                'CREATE_PROJECT',
                `Project "${name}" created and added to ${initialStage} pipeline`,
                { projectId: result.id || resolvedId, name, type, propertyId, accountId, stage: initialStage, newStage: initialStage }
            );
        }).catch((err) => {
            console.warn('[MockDB] Firestore createProject error, falling back to local state:', err);
        });

        // Also update local mock state for immediate in-session consistency
        const newProject: Project = {
            _id: resolvedId,
            name,
            project_type: type,
            property_id: propertyId,
            account_id: accountId,
            current_stage: initialStage as any,
            status: 'Active',
            last_updated: new Date().toISOString()
        };
        setProjects(prev => [...prev, newProject]);

        return resolvedId;
    };

    const updateProjectStage = (projectId: string, stage: ProjectStage) => {
        const project = projects.find(p => p._id === projectId);
        const oldStage = project?.current_stage || 'Unknown';
        setProjects(prev => prev.map(p =>
            p._id === projectId ? { ...p, current_stage: stage, last_updated: new Date().toISOString() } : p
        ));
        userLogService.logAction('STAGE_CHANGE', `Project stage updated from ${oldStage} to ${stage} (ID: ${projectId})`, { projectId, oldStage, newStage: stage });
    };

    const saveQuote = (projectId: string, total: number, items: any[]) => {
        const project = projects.find(p => p._id === projectId);
        const oldStage = project?.current_stage || 'Unknown';
        setProjects(prev => prev.map(p =>
            p._id === projectId ? {
                ...p,
                quote: { total, status: 'Sent', items },
                current_stage: 'Quote'
            } : p
        ));
        userLogService.logAction('SAVE_QUOTE', `Quote saved for project ${projectId} with total $${total.toLocaleString()}`, { projectId, total, oldStage, newStage: 'Quote', itemCount: items?.length || 0 });
    };

    const approveQuote = (projectId: string) => {
        const project = projects.find(p => p._id === projectId);
        const oldStage = project?.current_stage || 'Unknown';
        setProjects(prev => prev.map(p =>
            p._id === projectId ? {
                ...p,
                quote: { ...p.quote!, status: 'Approved' },
                current_stage: 'Sign & Verify'
            } : p
        ));
        userLogService.logAction('APPROVE_QUOTE', `Quote approved for project ${projectId}`, { projectId, oldStage, newStage: 'Sign & Verify' });
    };

    const getProject = (id: string) => projects.find(p => p._id === id);

    const getUserProjects = (userId: string) => {
        if (!userId) return [];
        if (currentUser?.role === 'Contractor') {
            return projects.filter(p => p.assigned_contractor_id === userId || p.current_stage === 'Schedule' || p.current_stage === 'Install');
        }
        if (currentUser?.role === 'Customer') {
            return projects.filter(p => p.account_id === userId);
        }
        return projects;
    };

    return (
        <MockDatabaseContext.Provider value={{
            users,
            properties,
            projects,
            currentUser,
            currentProjectId,
            setCurrentProjectId,
            login,
            logout,
            addUser,
            addProperty,
            updateProperty,
            addCommunication,
            createProject,
            updateProjectStage,
            saveQuote,
            approveQuote,
            getProject,
            getUserProjects
        }}>
            {children}
        </MockDatabaseContext.Provider>
    );
};

export const useMockDB = () => {
    const context = useContext(MockDatabaseContext);
    if (!context) throw new Error("useMockDB must be used within MockDatabaseProvider");
    return context;
};
