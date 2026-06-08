
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Project, Property, User, ProjectStage, PROJECT_STAGES_ORDER } from '../types';
import { contactService, userService, userLogService } from '../lib/firebaseService';

interface MockDatabaseContextType {
    users: User[];
    properties: Property[];
    projects: Project[];
    currentUser: User | null;
    currentProjectId: string | null;
    setCurrentProjectId: (id: string | null) => void;
    login: (role: string, password?: string, email?: string) => Promise<any>;
    logout: () => void;

    // Actions
    createProject: (name: string, type: any, propertyId: string, accountId: string) => string;
    addUser: (user: Partial<User>) => void;
    addProperty: (property: Partial<Property>) => void;
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
    { id: 'U-EMP-1', name: 'Mike Robinson', role: 'Employee', email: 'mike@rhive.com', avatarUrl: 'https://i.pravatar.cc/150?u=mike' },
    { id: 'U-CUST-1', name: 'Michael Robinson', role: 'Customer', email: 'michael.robinson@gmail.com', phone: '(801) 555-0192', avatarUrl: 'https://i.pravatar.cc/150?u=michael' },
    { id: 'U-CUST-2', name: 'Willow Park HOA', role: 'Customer', email: 'board@willowpark.com' },
    { id: 'U-CONT-1', name: 'Quality Roofing', role: 'Contractor', email: 'jobs@quality.com' },
    { id: 'U-SUPP-1', name: 'ABC Supply', role: 'Supplier', email: 'orders@abc.com' },
    { id: 'U-ACC-LHM', name: 'Larry H Miller Group', role: 'Customer', email: 'billing@lhm.com' },
    { id: 'U-ADMIN-JAMES', name: 'James Gimena', role: 'Admin', email: 'james.g@rhiveconstruction.com', phone: '(333) 333-3333', password_hash: 'daaad6e5604e8e17bd9f108d91e26afe6281dac8fda0091040a7a6d7bd9b43b5', avatarUrl: 'https://i.pravatar.cc/150?u=james' },
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
    const [users, setUsers] = useState<User[]>([]);
    const [properties, setProperties] = useState<Property[]>(SEED_PROPERTIES);
    const [projects, setProjects] = useState<Project[]>(SEED_PROJECTS);
    const [loading, setLoading] = useState(true);

    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [currentProjectId, setCurrentProjectId] = useState<string | null>(localStorage.getItem('rhive_project_id'));

    useEffect(() => {
        const unsub = userService.subscribe((data) => {
            if (data && data.length > 0) {
                setUsers(data as User[]);
            } else {
                setUsers(SEED_USERS);
            }
            setLoading(false);
            
            // Sync current user if role/data changed in DB
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

    useEffect(() => {
        if (currentUser) localStorage.setItem('rhive_user', JSON.stringify(currentUser));
        else localStorage.removeItem('rhive_user');
    }, [currentUser]);

    useEffect(() => {
        if (currentProjectId) localStorage.setItem('rhive_project_id', currentProjectId);
        else localStorage.removeItem('rhive_project_id');
    }, [currentProjectId]);

    // Ensure James Gimena admin profile is correctly seeded/updated in the live Firestore users collection
    useEffect(() => {
        const seedJamesIfNeeded = async () => {
            try {
                const email = 'james.g@rhiveconstruction.com';
                const correctHash = 'daaad6e5604e8e17bd9f108d91e26afe6281dac8fda0091040a7a6d7bd9b43b5'; // SHA-256 of 'qwerty123'
                const correctRole = 'Admin';
                const correctId = 'U-ADMIN-JAMES';

                const res = await userService.getByEmail(email);

                if (!res.success || !res.data) {
                    console.log("Seeding James Gimena admin profile to Firestore...");
                    await userService.createWithId(correctId, {
                        id: correctId,
                        name: 'James Gimena',
                        role: correctRole,
                        email: email,
                        phone: '(333) 333-3333',
                        password_hash: correctHash,
                        avatarUrl: 'https://i.pravatar.cc/150?u=james',
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    });
                } else {
                    const userDoc = res.data as any;
                    const needsUpdate =
                        userDoc.password_hash !== correctHash ||
                        userDoc.role !== correctRole;

                    if (needsUpdate) {
                        console.log("Updating James Gimena Firestore profile to Admin role with correct password hash...");
                        await userService.update(userDoc.id, {
                            role: correctRole,
                            password_hash: correctHash,
                            updated_at: new Date().toISOString()
                        });
                    }
                }
            } catch (err) {
                console.warn("Failed to automatically seed/sync James Gimena admin doc in Firestore:", err);
            }
        };

        const timer = setTimeout(() => {
            seedJamesIfNeeded();
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

    const login = async (role: string, password?: string, email?: string) => {
        const { hashPassword } = await import('../lib/utils');

        // -------------------------------------------------------
        // PORTAL LOGIN: Customer, Contractor, Supplier
        // Authenticated via email + password against contacts/users
        // -------------------------------------------------------
        if (role === 'Customer' || role === 'Contractor' || role === 'Supplier') {
            if (!email || !password) {
                return { success: false, error: 'Email and password are required.' };
            }

            const normalizedEmail = email.toLowerCase().trim();

            // 1. Look up by email in the `users` Firestore collection
            const userResult = await userService.getByEmail(normalizedEmail);
            if (userResult.success && userResult.data) {
                const foundUser = userResult.data as User;
                // Validate role matches
                if (foundUser.role !== role) {
                    return { success: false, error: `No ${role} account found with this email.` };
                }
                // Validate password hash
                if (!foundUser.password_hash) {
                    return { success: false, error: 'This account has no password set. Please contact your administrator.' };
                }
                const hashed = await hashPassword(password);
                if (foundUser.password_hash !== hashed) {
                    return { success: false, error: 'Invalid email or password.' };
                }
                setCurrentUser(foundUser);
                return { success: true };
            }

            // 2. Fallback: check the `contacts` collection for email match
            const contactResult = await contactService.getByEmail(normalizedEmail);
            if (contactResult.success && contactResult.data) {
                // Contact exists in DB — but they need a user account to have a password.
                // Create a synthetic user so they can log in (read-only portal access)
                // If in the future contacts have passwords added, validate here.
                return { success: false, error: 'Your email was found in our system, but no portal account exists yet. Please contact your administrator.' };
            }

            return { success: false, error: 'No account found with this email address.' };
        }

        // -------------------------------------------------------
        // PUBLIC / GUEST LOGIN — no credentials needed
        // -------------------------------------------------------
        if (role === 'Public') {
            const guestUser: User = { id: 'U-GUEST', name: 'Public Guest', role: 'Public', email: 'guest@rhive.com' };
            setCurrentUser(guestUser);
            return { success: true };
        }

        // -------------------------------------------------------
        // INTERNAL LOGIN: Admin, Super Admin, Employee
        // Authenticated via email + password against `users` collection
        // -------------------------------------------------------
        if (!email) {
            // Legacy fallback: password-only search across all users of that role
            const candidates = users.filter(u => u.role === role);
            if (candidates.length === 0) return { success: false, error: 'Role not found in system.' };
            if (password !== undefined) {
                const hashed = await hashPassword(password);
                const validUser = candidates.find(u => u.password_hash === hashed);
                if (validUser) { setCurrentUser(validUser); return { success: true }; }
                return { success: false, error: 'Invalid security key.' };
            }
            const user = candidates[0];
            if (user) { setCurrentUser(user); return { success: true }; }
            return { success: false, error: 'Login failed.' };
        }

        const normalizedEmail = email.toLowerCase().trim();
        const userResult = await userService.getByEmail(normalizedEmail);
        if (!userResult.success || !userResult.data) {
            return { success: false, error: 'No account found with this email address.' };
        }
        const foundUser = userResult.data as User;
        // Allow 'Admin' selection to also authenticate 'Super Admin' accounts,
        // since Super Admins use the same internal login portal.
        const isRoleMatch =
            foundUser.role === role ||
            (role === 'Admin' && foundUser.role === 'Super Admin');
        if (!isRoleMatch) {
            return { success: false, error: `No ${role} account found with this email.` };
        }
        if (!foundUser.password_hash) {
            if (password === 'rhive123') {
                const sessionUser = { ...foundUser };
                if (foundUser.role === 'Super Admin' && role !== 'Super Admin') {
                    sessionUser.role = role as any;
                }
                setCurrentUser(sessionUser);
                userLogService.logAction('LOGIN', `User ${sessionUser.name} logged in successfully (using default password)`, { email: sessionUser.email }, sessionUser);
                return { success: true };
            }
            return { success: false, error: 'This account has no password set. Use default "rhive123" to log in locally.' };
        }
        const hashed = await hashPassword(password!);
        if (foundUser.password_hash !== hashed) {
            return { success: false, error: 'Invalid email or password.' };
        }
        setCurrentUser(foundUser);
        return { success: true };
    };

    const logout = () => {
        setCurrentUser(null);
        setCurrentProjectId(null);
    };

    // --- ACTIONS ---

    const addUser = (user: Partial<User>) => {
        userService.create(user);
        userLogService.logAction('ADD_USER', `User profile created: ${user.name || 'Unnamed'} (${user.email || 'no email'})`, { user });
    };

    const addProperty = (property: Partial<Property>) => {
        const newId = `PROP-${Date.now()}`;
        const newProperty: Property = {
            _id: newId,
            address_full: property.address_full || 'Unknown Address',
            type: property.type || 'Residential',
            owner_id: property.owner_id || 'Unknown',
            coordinates: { lat: 0, lng: 0 },
            features: []
        };
        setProperties(prev => [...prev, newProperty]);
        userLogService.logAction('ADD_PROPERTY', `Property added: ${newProperty.address_full} (ID: ${newId})`, { propertyId: newId, property: newProperty });
    };

    const addCommunication = (type: 'email' | 'text' | 'file', targetId: string, content: string) => {
        console.log(`[SIMULATION] Added ${type} to ${targetId}: ${content}`);
        userLogService.logAction('ADD_COMMUNICATION', `Communication logged to ${targetId} (${type})`, { type, targetId, content });
    };

    const createProject = (name: string, type: any, propertyId: string, accountId: string) => {
        const newId = `PROJ-${projects.length + 1}`;
        const newProject: Project = {
            _id: newId,
            name,
            project_type: type,
            property_id: propertyId,
            account_id: accountId,
            current_stage: 'Estimate',
            status: 'Active',
            last_updated: new Date().toISOString().split('T')[0]
        };
        setProjects([...projects, newProject]);
        userLogService.logAction('CREATE_PROJECT', `Project "${name}" created (ID: ${newId})`, { projectId: newId, name, type, propertyId, accountId });
        return newId;
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
