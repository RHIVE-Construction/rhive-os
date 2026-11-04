import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Project, Property, User, ProjectStage } from '../types';
import { contactService, userService, userLogService, firestoreService } from '../lib/firebaseService';
import { session, initialUser } from '../lib/session';
import { LOG_ACTIONS } from '../lib/userActivityLogger';

// ── Server-side login event logger ───────────────────────────────────────────
const FIREBASE_PROJECT_ID = (import.meta as any).env?.VITE_FIREBASE_PROJECT_ID || 'rhive-os';
const LOG_LOGIN_URL = `https://us-central1-${FIREBASE_PROJECT_ID}.cloudfunctions.net/logLoginEvent`;

function stripUndefinedDeep<T>(obj: T): T {
    if (Array.isArray(obj)) {
        return obj.map((item) => stripUndefinedDeep(item)) as unknown as T;
    }
    if (obj && typeof obj === 'object') {
        const cleaned: Record<string, any> = {};
        Object.entries(obj as Record<string, any>).forEach(([k, v]) => {
            if (v !== undefined) {
                cleaned[k] = stripUndefinedDeep(v);
            }
        });
        return cleaned as T;
    }
    return obj;
}

function callLogLoginEvent(
    actionType: string,
    description: string,
    userId: string,
    userName: string,
    userRole: string,
    extraPayload?: Record<string, any>
): void {
    fetch(LOG_LOGIN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            actionType,
            description,
            userId,
            userName,
            userRole,
            payload: extraPayload || {},
        }),
    }).catch(() => { /* best-effort — silently ignore network errors */ });
}

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
    createProject: (
        name: string,
        type: any,
        propertyId: string,
        accountId: string,
        initialStage?: string,
        extraFields?: Record<string, any>
    ) => string;
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
    { id: 'U-ADMIN-MICHAEL', name: 'Michael Robinson', role: 'Admin', email: 'michael@rhiveconstruction.com', phone: '(801) 555-0192', avatarUrl: 'https://i.pravatar.cc/150?u=michael' },
    { id: 'U-EMP-1', name: 'Mike Robinson', role: 'Employee', email: 'mike@rhive.com', avatarUrl: 'https://i.pravatar.cc/150?u=mike' },
    { id: 'U-CUST-1', name: 'Michael Robinson', role: 'Customer', email: 'michael@rhiveconstruction.com', phone: '(801) 555-0192', avatarUrl: 'https://i.pravatar.cc/150?u=michael' },
    { id: 'U-CUST-2', name: 'Willow Park HOA', role: 'Customer', email: 'board@willowpark.com' },
    { id: 'U-CONT-1', name: 'Quality Roofing', role: 'Contractor', email: 'jobs@quality.com' },
    { id: 'U-SUPP-1', name: 'ABC Supply', role: 'Supplier', email: 'orders@abc.com' },
    { id: 'U-ACC-LHM', name: 'Larry H Miller Group', role: 'Customer', email: 'billing@lhm.com' },
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
    const [, setLoading] = useState(true);

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

    useEffect(() => {
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

            const saved = localStorage.getItem('rhive_user');
            if (saved) {
                const parsed = JSON.parse(saved);
                const updated = (data as User[]).find(u => u.id === parsed.id);
                if (updated && JSON.stringify(updated) !== saved) {
                    setCurrentUser(updated);
                }
            }
        });
        return () => unsub();
    }, []);

    // Hydrate properties from Firestore in real-time so MockDB properties stay synced
    useEffect(() => {
        const unsub = firestoreService.subscribeToDocuments('properties', (docs: any[]) => {
            if (!docs || docs.length === 0) return;
            setProperties(prev => {
                const byId = new Map<string, Property>();
                prev.forEach(p => byId.set(p._id, p));
                docs.forEach((d: any) => {
                    if (d.deleted) return;
                    const id = d.id || d._id;
                    if (!id) return;
                    byId.set(id, {
                        _id: id,
                        address_full: d.address_full || d.Property_Name || d.Property_Street || d.property_address || 'Property',
                        type: d.type || d.Property_Type || 'Residential',
                        owner_id: d.owner_id || d.account_id || 'Unknown',
                        coordinates: d.coordinates || { lat: Number(d.latitude || 0), lng: Number(d.longitude || 0) },
                        features: d.features || [],
                        buildings: d.buildings || [],
                        escrow_note: d.escrow_note,
                        ...d,
                    });
                });
                return Array.from(byId.values());
            });
        });
        return () => unsub();
    }, []);

    useEffect(() => {
        if (currentUser) localStorage.setItem('rhive_user', JSON.stringify(currentUser));
        else localStorage.removeItem('rhive_user');
    }, [currentUser]);

    useEffect(() => {
        if (currentProjectId) localStorage.setItem('rhive_project_id', currentProjectId);
        else localStorage.removeItem('rhive_project_id');
    }, [currentProjectId]);

    const login = async (role?: string, password?: string, email?: string) => {
        const { hashPassword } = await import('../lib/utils');

        const setSessionUser = (user: User) => {
            session.write(user);
            setCurrentUser(user);
        };

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
                if (foundUser.role === 'Super Admin' && role && role !== 'Super Admin') {
                    sessionUser.role = role as any;
                }
                setSessionUser(sessionUser);
                callLogLoginEvent('LOGIN', `User ${sessionUser.name} logged in via developer bypass`, sessionUser.id, sessionUser.name, sessionUser.role, { role: sessionUser.role });
                return { success: true };
            }
        }

        if (role === 'Customer' || role === 'Contractor' || role === 'Supplier') {
            if (!email || !password) {
                return { success: false, error: 'Email and password are required.' };
            }

            const normalizedEmail = email.toLowerCase().trim();
            const userResult = await userService.getByEmail(normalizedEmail);
            if (userResult.success && userResult.data) {
                const foundUser = userResult.data as User;
                if (foundUser.role !== role) {
                    return { success: false, error: `No ${role} account found with this email.` };
                }
                if (!foundUser.password_hash) {
                    return { success: false, error: 'This account has no password set. Please contact your administrator.' };
                }
                const hashed = await hashPassword(password);
                const isPasswordValid = foundUser.password_hash === hashed ||
                    (Array.isArray((foundUser as any).password_history) && (foundUser as any).password_history.includes(hashed));
                if (!isPasswordValid) {
                    return { success: false, error: 'Invalid email or password.' };
                }
                setSessionUser(foundUser);
                return { success: true };
            }

            const contactResult = await contactService.getByEmail(normalizedEmail);
            if (contactResult.success && contactResult.data) {
                return { success: false, error: 'Your email was found in our system, but no portal account exists yet. Please contact your administrator.' };
            }

            return { success: false, error: 'No account found with this email address.' };
        }

        if (role === 'Public') {
            const guestUser: User = { id: 'U-GUEST', name: 'Public Guest', role: 'Public', email: 'guest@rhive.com' };
            setSessionUser(guestUser);
            return { success: true };
        }

        if (!email) {
            const candidates = users.filter(u => u.role === role);
            if (candidates.length === 0) return { success: false, error: 'Role not found in system.' };
            if (password !== undefined) {
                const hashed = await hashPassword(password);
                const validUser = candidates.find(u => u.password_hash === hashed);
                if (validUser) { setSessionUser(validUser); return { success: true }; }
                return { success: false, error: 'Invalid security key.' };
            }
            const user = candidates[0];
            if (user) { setSessionUser(user); return { success: true }; }
            return { success: false, error: 'Login failed.' };
        }

        const normalizedEmail = email.toLowerCase().trim();
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

        if (!foundUser) {
            const seedFallback = users.find(u => u.email?.toLowerCase().trim() === normalizedEmail) ??
                                 SEED_USERS.find(u => u.email?.toLowerCase().trim() === normalizedEmail && !u.password_hash);
            if (seedFallback) {
                foundUser = seedFallback;
            }
        }

        if (!foundUser) {
            callLogLoginEvent(LOG_ACTIONS.FAILED_LOGIN, `Failed login attempt — account not found`, 'anonymous', 'anonymous', 'Guest', {
                email: email ? email.replace(/(.{2}).*@/, '$1***@') : 'unknown',
            });
            return { success: false, error: 'No account found with this email address.' };
        }

        if (role && role !== 'Public') {
            const isRoleAllowed = foundUser.role === role ||
                                  (foundUser.role as string) === 'Super Admin' ||
                                  (role === 'Admin' && (foundUser.role as string) === 'Super Admin');
            if (!isRoleAllowed) {
                return { success: false, error: `No ${role} account found with this email.` };
            }
        }

        if (!fromFirestore && !foundUser?.password_hash) {
            callLogLoginEvent(LOG_ACTIONS.FAILED_LOGIN, `Failed login — credentials could not be verified (offline or seed user)`, 'anonymous', 'anonymous', 'Guest', {
                email: email ? email.replace(/(.{2}).*@/, '$1***@') : 'unknown',
            });
            return { success: false, error: 'Could not verify credentials. Please check your connection and try again.' };
        }

        if (!foundUser.password_hash) {
            if (password === 'rhive123') {
                const sessionUser = { ...foundUser };
                if (foundUser.role === 'Super Admin' && role && role !== 'Super Admin') {
                    sessionUser.role = role as any;
                }
                setSessionUser(sessionUser);
                callLogLoginEvent('LOGIN', `User ${sessionUser.name} logged in successfully (using default password)`, sessionUser.id, sessionUser.name, sessionUser.role, { email: sessionUser.email });
                return { success: true };
            }
            return { success: false, error: 'Invalid email or password.' };
        }
        const hashed = await hashPassword(password!);
        const isPasswordValid = foundUser.password_hash === hashed ||
            (Array.isArray((foundUser as any).password_history) && (foundUser as any).password_history.includes(hashed));
        if (!isPasswordValid) {
            callLogLoginEvent(LOG_ACTIONS.FAILED_LOGIN, `Failed login attempt — incorrect password`, 'anonymous', foundUser.name, foundUser.role, {
                email: email ? email.replace(/(.{2}).*@/, '$1***@') : 'unknown',
                role: foundUser.role,
            });
            return { success: false, error: 'Invalid email or password.' };
        }
        const sessionUser = { ...foundUser };
        if (foundUser.role === 'Super Admin' && role && role !== 'Super Admin') {
            sessionUser.role = role as any;
        }
        setSessionUser(sessionUser);
        callLogLoginEvent('LOGIN', `User ${sessionUser.name} logged in successfully`, sessionUser.id, sessionUser.name, sessionUser.role, { email: sessionUser.email });
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
        const newId = user.id || `U-${Date.now()}`;
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
        const newId = (property as any).id || property._id || `PROP-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const newProperty: Property = {
            _id: newId,
            address_full: property.address_full || 'Unknown Address',
            type: property.type || 'Residential',
            owner_id: property.owner_id || 'Unknown',
            coordinates: property.coordinates || { lat: 0, lng: 0 },
            features: property.features || [],
            buildings: property.buildings || [],
            escrow_note: property.escrow_note,
            ...(property as any),
        };
        setProperties(prev => {
            const filtered = prev.filter(p => p._id !== newId);
            return [...filtered, newProperty];
        });

        const firestoreDoc = stripUndefinedDeep({
            ...newProperty,
            id: newId,
            _id: newId,
            account_id: (property as any).account_id || newProperty.owner_id,
            latitude: newProperty.coordinates?.lat || (property as any).latitude || 0,
            longitude: newProperty.coordinates?.lng || (property as any).longitude || 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        });

        setDoc(doc(db, 'properties', newId), firestoreDoc, { merge: true })
            .then(() => {
                userLogService.logAction('ADD_PROPERTY', `Property added: ${newProperty.address_full}`, { propertyId: newId, property: newProperty });
            })
            .catch(() => {
                userLogService.logAction('ADD_PROPERTY', `Property added: ${newProperty.address_full}`, { propertyId: newId, property: newProperty });
            });

        return newId;
    };

    const updateProperty = (propertyId: string, updates: Partial<Property>) => {
        setProperties(prev => prev.map(p =>
            p._id === propertyId ? { ...p, ...updates } : p
        ));
        const cleanUpdates = stripUndefinedDeep({
            ...updates,
            updated_at: new Date().toISOString(),
        });
        setDoc(doc(db, 'properties', propertyId), cleanUpdates, { merge: true }).catch(() => {});
        userLogService.logAction('UPDATE_PROPERTY', `Property record updated`, { propertyId, updates: cleanUpdates });
    };

    const addCommunication = (type: 'email' | 'text' | 'file', targetId: string, content: string) => {
        userLogService.logAction('ADD_COMMUNICATION', `Communication logged (${type})`, { type, targetId, content });
    };

    const createProject = (
        name: string,
        type: any,
        propertyId: string,
        accountId: string,
        initialStage: string = 'Lead',
        extraFields?: Record<string, any>
    ) => {
        const nowIso = new Date().toISOString();
        const resolvedId = extraFields?.id || `PROJ-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const projectDoc: Record<string, any> = stripUndefinedDeep({
            id: resolvedId,
            _id: resolvedId,
            name,
            project_type: type,
            property_id: propertyId,
            account_id: accountId,
            owner_id: accountId,
            current_stage: initialStage,
            status: 'Active',
            created_at: nowIso,
            updated_at: nowIso,
            ...(extraFields || {}),
        });

        setDoc(doc(db, 'projects', resolvedId), projectDoc, { merge: true })
            .then(() => {
                userLogService.logAction(
                    'CREATE_PROJECT',
                    `Project "${name}" created in ${initialStage} stage`,
                    { projectId: resolvedId, name, type, propertyId, accountId, stage: initialStage, newStage: initialStage }
                );
            })
            .catch((err) => {
                console.warn('[MockDB] Firestore createProject error, falling back to local state:', err);
            });

        const newProject: Project = {
            _id: resolvedId,
            name,
            project_type: type,
            property_id: propertyId,
            account_id: accountId,
            current_stage: initialStage as any,
            status: 'Active',
            last_updated: nowIso,
            ...(extraFields || {}),
        };
        setProjects(prev => {
            const filtered = prev.filter(p => p._id !== resolvedId);
            return [...filtered, newProject];
        });

        return resolvedId;
    };

    const updateProjectStage = (projectId: string, stage: ProjectStage) => {
        const project = projects.find(p => p._id === projectId);
        const oldStage = project?.current_stage || 'Unknown';
        setProjects(prev => prev.map(p =>
            p._id === projectId ? { ...p, current_stage: stage, last_updated: new Date().toISOString() } : p
        ));
        setDoc(doc(db, 'projects', projectId), { current_stage: stage, updated_at: new Date().toISOString() }, { merge: true }).catch(() => {});
        userLogService.logAction('STAGE_CHANGE', `Project stage updated from ${oldStage} to ${stage}`, { projectId, oldStage, newStage: stage });
    };

    const saveQuote = (projectId: string, total: number, items: any[]) => {
        const project = projects.find(p => p._id === projectId);
        const oldStage = project?.current_stage || 'Unknown';
        const quoteObj = { total, status: 'Sent' as const, items };
        setProjects(prev => prev.map(p =>
            p._id === projectId ? {
                ...p,
                quote: quoteObj,
                current_stage: 'Quote'
            } : p
        ));
        setDoc(doc(db, 'projects', projectId), { quote: quoteObj, current_stage: 'Quote', updated_at: new Date().toISOString() }, { merge: true }).catch(() => {});
        userLogService.logAction('SAVE_QUOTE', `Quote saved with total $${total.toLocaleString()}`, { projectId, total, oldStage, newStage: 'Quote', itemCount: items?.length || 0 });
    };

    const approveQuote = (projectId: string) => {
        const project = projects.find(p => p._id === projectId);
        const oldStage = project?.current_stage || 'Unknown';
        setProjects(prev => prev.map(p =>
            p._id === projectId ? {
                ...p,
                quote: { ...(p.quote || { total: 0, items: [] }), status: 'Approved' },
                current_stage: 'Sign & Verify'
            } : p
        ));
        setDoc(doc(db, 'projects', projectId), { current_stage: 'Sign & Verify', 'quote.status': 'Approved', updated_at: new Date().toISOString() }, { merge: true }).catch(() => {});
        userLogService.logAction('APPROVE_QUOTE', `Quote approved`, { projectId, oldStage, newStage: 'Sign & Verify' });
    };

    const getProject = (id: string) => projects.find(p => p._id === id || (p as any).id === id);

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
