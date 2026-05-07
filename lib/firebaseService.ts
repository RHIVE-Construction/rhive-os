import { auth, db, storage } from './firebase';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    User,
    UserCredential
} from 'firebase/auth';
import {
    collection,
    addDoc,
    getDocs,
    doc,
    getDoc,
    setDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    limit,
    DocumentData,
    Timestamp,
    onSnapshot,
    writeBatch
} from 'firebase/firestore';
import {
    ref,
    uploadBytes,
    getDownloadURL,
    deleteObject
} from 'firebase/storage';
import { ProjectInput } from './sharedProjectTypes';

// Helper to map Firestore docs to data with ID
// Note: Firestore automatically creates collections when you add documents to them.
const mapDoc = (doc: any) => ({ id: doc.id, ...doc.data() });

// ============================================
// AUTH SERVICES
// ============================================

export const authService = {
    signUp: (email: string, password: string) => createUserWithEmailAndPassword(auth, email, password),
    signIn: (email: string, password: string) => signInWithEmailAndPassword(auth, email, password),
    signOut: () => signOut(auth),
    onAuthStateChanged: (callback: (user: User | null) => void) => onAuthStateChanged(auth, callback),
    getCurrentUser: () => auth.currentUser
};

// ============================================
// FIRESTORE BASE SERVICES
// ============================================

export const firestoreService = {
    // This function automatically creates the collection if it doesn't exist
    addDocument: async (collectionName: string, data: DocumentData) => {
        try {
            // Adding a document implicitly 'creates' the collection
            const docRef = await addDoc(collection(db, collectionName), {
                ...data,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            });
            return { success: true, id: docRef.id, data: { id: docRef.id, ...data } };
        } catch (error: any) {
            console.error(`Error adding to ${collectionName}:`, error);
            return { success: false, error: error.message };
        }
    },

    getAllDocuments: async (collectionName: string, sortField = 'created_at') => {
        try {
            const q = query(collection(db, collectionName), orderBy(sortField, 'desc'));
            const querySnapshot = await getDocs(q);
            const data = querySnapshot.docs.map(mapDoc);
            return { success: true, data };
        } catch (error: any) {
            // If collection doesn't exist, it returns empty array, which is fine
            console.error(`Error getting ${collectionName}:`, error);
            return { success: false, error: error.message };
        }
    },

    subscribeToDocuments: (collectionName: string, callback: (data: any[]) => void, sortField = 'created_at') => {
        const q = query(collection(db, collectionName), orderBy(sortField, 'desc'));
        return onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(mapDoc);
            callback(data);
        });
    },

    getDocument: async (collectionName: string, id: string) => {
        try {
            const docRef = doc(db, collectionName, id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                return { success: true, data: mapDoc(docSnap) };
            }
            return { success: false, error: 'Document not found' };
        } catch (error: any) {
            console.error(`Error getting ${collectionName} ${id}:`, error);
            return { success: false, error: error.message };
        }
    },

    updateDocument: async (collectionName: string, id: string, data: any) => {
        try {
            const docRef = doc(db, collectionName, id);
            await updateDoc(docRef, { ...data, updated_at: new Date().toISOString() });
            return { success: true, data: { id, ...data } };
        } catch (error: any) {
            console.error(`Error updating ${collectionName} ${id}:`, error);
            return { success: false, error: error.message };
        }
    },

    deleteDocument: async (collectionName: string, id: string) => {
        try {
            await deleteDoc(doc(db, collectionName, id));
            return { success: true };
        } catch (error: any) {
            console.error(`Error deleting ${collectionName} ${id}:`, error);
            return { success: false, error: error.message };
        }
    },

    createBatch: async (collectionName: string, dataArray: any[]) => {
        try {
            const batch = writeBatch(db);
            const colRef = collection(db, collectionName);
            dataArray.forEach(data => {
                const newDocRef = doc(colRef);
                batch.set(newDocRef, {
                    ...data,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                });
            });
            await batch.commit();
            return { success: true, count: dataArray.length };
        } catch (error: any) {
            console.error(`Error in batch create for ${collectionName}:`, error);
            return { success: false, error: error.message };
        }
    }
};

// ============================================
// DOMAIN SERVICES
// ============================================

// Helper to convert CamelCase ProjectInput to SnakeCase for compatibility
const mapProjectToSnakeCase = (input: ProjectInput) => ({
    user_id: input.userId,
    name: input.name,
    project_type: input.type,
    status: 'Active',
    current_stage: 'Lead',
    property_address: input.property.address,
    property_city: input.property.city,
    property_state: input.property.state,
    property_zip: input.property.zip,
    property: input.property,
    insurance: input.insurance,
    organization: input.organization,
    billing: input.billing,
    details: input.details,
});

export const projectService = {
    getAll: async () => {
        const p = await firestoreService.getAllDocuments('projects');
        const l = await firestoreService.getAllDocuments('leads');
        const combined = [...(p.data || []), ...(l.data || [])];
        return { success: true, data: combined };
    },
    subscribe: (callback: (data: any[]) => void) => {
        let projects: any[] = [];
        let leads: any[] = [];
        
        const notify = () => callback([...projects, ...leads]);
        
        const unsubProjects = firestoreService.subscribeToDocuments('projects', (data) => {
            projects = data;
            notify();
        });
        
        const unsubLeads = firestoreService.subscribeToDocuments('leads', (data) => {
            leads = data;
            notify();
        });
        
        return () => {
            unsubProjects();
            unsubLeads();
        };
    },
    subscribeAllWork: (callback: (data: any[]) => void) => {
        let projects: any[] = [];
        let leads: any[] = [];
        const notify = () => callback([...projects, ...leads]);
        
        const unsubP = firestoreService.subscribeToDocuments('projects', (d) => { projects = d; notify(); });
        const unsubL = firestoreService.subscribeToDocuments('leads', (d) => { leads = d; notify(); });
        
        return () => { unsubP(); unsubL(); };
    },
    subscribeToRecentActivity: (callback: (data: any[]) => void, limitCount = 5) => {
        const q = query(
            collection(db, 'projects'),
            orderBy('created_at', 'desc'),
            limit(limitCount)
        );
        return onSnapshot(q, (snapshot) => {
            callback(snapshot.docs.map(mapDoc));
        });
    },
    getById: (id: string) => firestoreService.getDocument('projects', id),
    createBatch: (dataArray: any[]) => firestoreService.createBatch('projects', dataArray),

    // Creates Project/Lead and related sub-collections automatically
    createFullProject: async (input: ProjectInput) => {
        try {
            // Determine if it's a lead or project based on current_stage or initial state
            // For now, if stage is 'Lead', it goes to 'leads' collection
            const targetCollection = 'leads'; // New projects start as leads usually

            // 1. Create the Property entry first
            const propertyData = {
                address_full: `${input.property.address}, ${input.property.city}, ${input.property.state} ${input.property.zip}`,
                property_address: input.property.address,
                city: input.property.city,
                state: input.property.state,
                zip: input.property.zip,
                latitude: input.property.latitude,
                longitude: input.property.longitude,
                type: input.type,
                features: []
            };

            const propertyResult = await firestoreService.addDocument('properties', propertyData);
            if (!propertyResult.success) throw new Error(propertyResult.error);
            const propertyId = propertyResult.id;

            // 2. Create the Account (Company) entry if organization info exists
            let accountId = null;
            if (input.organization?.parentCompany) {
                const accountData = {
                    name: input.organization.parentCompany,
                    propertyName: input.organization.propertyName,
                    type: 'Company',
                    created_at: new Date().toISOString()
                };
                const accountResult = await firestoreService.addDocument('accounts', accountData);
                if (accountResult.success) {
                    accountId = accountResult.id;
                }
            }

            // 3. Create the Lead/Project and link
            const projectData = JSON.parse(JSON.stringify(mapProjectToSnakeCase(input)));
            projectData.property_id = propertyId;
            if (accountId) projectData.account_id = accountId;

            const projectResult = await firestoreService.addDocument(targetCollection, projectData);
            if (!projectResult.success) throw new Error(projectResult.error);
            const projectId = projectResult.id;

            if (input.contacts && input.contacts.length > 0) {
                const contactPromises = input.contacts.map(contact =>
                    firestoreService.addDocument('contacts', {
                        project_id: projectId,
                        property_id: propertyId,
                        account_id: accountId,
                        first_name: contact.firstName,
                        last_name: contact.lastName,
                        email: contact.email,
                        phone: contact.phone,
                        role: contact.role,
                        is_primary: contact.isPrimary,
                    })
                );
                await Promise.all(contactPromises);
            }

            return { success: true, projectId, propertyId, accountId };
        } catch (error: any) {
            console.error('Error creating full project:', error);
            return { success: false, error: error.message };
        }
    },

    getFullProject: async (id: string, isLead = false) => {
        try {
            const collectionName = isLead ? 'leads' : 'projects';
            const projectRes = await firestoreService.getDocument(collectionName, id);
            if (!projectRes.success) throw new Error(projectRes.error);
            const project = projectRes.data;

            const contactsQ = query(collection(db, 'contacts'), where('project_id', '==', id));
            const estimatesQ = query(collection(db, 'estimates'), where('project_id', '==', id));

            const [contactsSnap, estimatesSnap] = await Promise.all([getDocs(contactsQ), getDocs(estimatesQ)]);

            const contacts = contactsSnap.docs.map(mapDoc);
            const estimates = estimatesSnap.docs.map(mapDoc);

            return {
                success: true,
                data: {
                    ...project,
                    contacts,
                    estimates
                }
            };
        } catch (error: any) {
            console.error('Error getting full project:', error);
            return { success: false, error: error.message };
        }
    }
};

export const leadService = {
    getAll: () => firestoreService.getAllDocuments('leads'),
    subscribe: (callback: (data: any[]) => void) => firestoreService.subscribeToDocuments('leads', callback),
    getById: (id: string) => firestoreService.getDocument('leads', id),
    update: (id: string, data: any) => firestoreService.updateDocument('leads', id, data),
    delete: (id: string) => firestoreService.deleteDocument('leads', id)
};

export const accountService = {
    getAll: () => firestoreService.getAllDocuments('accounts'),
    subscribe: (callback: (data: any[]) => void) => firestoreService.subscribeToDocuments('accounts', callback),
    getById: (id: string) => firestoreService.getDocument('accounts', id),
    create: (data: any) => firestoreService.addDocument('accounts', data),
    update: (id: string, data: any) => firestoreService.updateDocument('accounts', id, data),
    delete: (id: string) => firestoreService.deleteDocument('accounts', id),
    createBatch: (dataArray: any[]) => firestoreService.createBatch('accounts', dataArray)
};

export const contactService = {
    getAll: () => firestoreService.getAllDocuments('contacts'),
    getByProjectId: async (projectId: string) => {
        try {
            const q = query(collection(db, 'contacts'), where('project_id', '==', projectId));
            const snapshot = await getDocs(q);
            return { success: true, data: snapshot.docs.map(mapDoc) };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    },
    getByPhone: async (phone: string) => {
        try {
            const q = query(collection(db, 'contacts'), where('phone', '==', phone));
            const snapshot = await getDocs(q);
            if (snapshot.empty) return { success: false, error: 'Contact not found' };
            return { success: true, data: snapshot.docs.map(mapDoc)[0] };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    },
    getByEmail: async (email: string) => {
        try {
            const q = query(collection(db, 'contacts'), where('email', '==', email.toLowerCase().trim()));
            const snapshot = await getDocs(q);
            if (snapshot.empty) return { success: false, error: 'No contact found with this email' };
            return { success: true, data: snapshot.docs.map(mapDoc)[0] };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    },
    create: (data: any) => firestoreService.addDocument('contacts', data),
    update: (id: string, data: any) => firestoreService.updateDocument('contacts', id, data),
    delete: (id: string) => firestoreService.deleteDocument('contacts', id)
};

export const estimateService = {
    getAll: () => firestoreService.getAllDocuments('estimates'),
    getByProjectId: async (projectId: string) => {
        try {
            const q = query(collection(db, 'estimates'), where('project_id', '==', projectId));
            const snapshot = await getDocs(q);
            return { success: true, data: snapshot.docs.map(mapDoc) };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    },
    create: (data: any) => firestoreService.addDocument('estimates', data),
    update: (id: string, data: any) => firestoreService.updateDocument('estimates', id, data),
    delete: (id: string) => firestoreService.deleteDocument('estimates', id)
};

export const userService = {
    getAll: () => firestoreService.getAllDocuments('users'),
    subscribe: (callback: (data: any[]) => void) => firestoreService.subscribeToDocuments('users', callback),
    create: (data: any) => firestoreService.addDocument('users', data),
    // Write a Firestore user doc using a specific ID (e.g. Firebase Auth UID)
    createWithId: async (id: string, data: any) => {
        try {
            await setDoc(doc(db, 'users', id), { ...data, updated_at: new Date().toISOString() });
            return { success: true };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    },
    update: (id: string, data: any) => firestoreService.updateDocument('users', id, data),
    delete: (id: string) => firestoreService.deleteDocument('users', id),
    getByEmail: async (email: string) => {
        try {
            const q = query(collection(db, 'users'), where('email', '==', email.toLowerCase().trim()));
            const snapshot = await getDocs(q);
            if (snapshot.empty) return { success: false, error: 'No user found with this email' };
            return { success: true, data: snapshot.docs.map(mapDoc)[0] };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    }
};

export const dashboardService = {
    getStats: async () => {
        try {
            const [projects, leads, contacts, estimates] = await Promise.all([
                getDocs(collection(db, 'projects')),
                getDocs(collection(db, 'leads')),
                getDocs(collection(db, 'contacts')),
                getDocs(collection(db, 'estimates'))
            ]);
            return {
                success: true,
                data: {
                    total_projects: projects.size + leads.size,
                    total_contacts: contacts.size,
                    total_estimates: estimates.size,
                    total_revenue: 0
                }
            };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    },

    // Real-time subscription for dashboard KPI stat cards
    subscribeToStats: (callback: (stats: {
        activeProjects: number;
        activeProjectsTrend: string;
        tasksDue: number;
        tasksOverdue: number;
        pendingQuotesCount: number;
        pendingQuotesValue: number;
        unreadMessages: number;
    }) => void) => {
        let projectCount = 0;
        let projectsThisWeek = 0;
        let estimatesCount = 0;
        let estimatesValue = 0;
        let tasksCount = 0;
        let tasksOverdue = 0;
        let messagesCount = 0;

        const notify = () => callback({
            activeProjects: projectCount,
            activeProjectsTrend: projectsThisWeek > 0 ? `+${projectsThisWeek} this week` : 'No new this week',
            tasksDue: tasksCount,
            tasksOverdue,
            pendingQuotesCount: estimatesCount,
            pendingQuotesValue: estimatesValue,
            unreadMessages: messagesCount,
        });

        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        // Active projects (non-completed)
        const unsubProjects = onSnapshot(
            query(collection(db, 'projects'), orderBy('created_at', 'desc')),
            (snap) => {
                projectCount = snap.docs.filter(d => {
                    const s = d.data().status;
                    return !s || s !== 'Completed';
                }).length;
                projectsThisWeek = snap.docs.filter(d => {
                    const created = d.data().created_at;
                    return created && new Date(created) >= oneWeekAgo;
                }).length;
                notify();
            }
        );

        // Also track leads
        const unsubLeads = onSnapshot(
            collection(db, 'leads'),
            (snap) => {
                // You might want to combine these into projectCount or separate
                // For now, let's keep it simple
                notify();
            }
        );

        // Pending quotes / estimates
        const unsubEstimates = onSnapshot(
            collection(db, 'estimates'),
            (snap) => {
                estimatesCount = snap.size;
                estimatesValue = snap.docs.reduce((sum, d) => {
                    const total = d.data().total_price || d.data().total || d.data().amount || 0;
                    return sum + Number(total);
                }, 0);
                notify();
            }
        );

        // Tasks due
        const unsubTasks = onSnapshot(
            collection(db, 'tasks'),
            (snap) => {
                tasksCount = snap.docs.filter(d => !d.data().completed).length;
                tasksOverdue = snap.docs.filter(d => {
                    const due = d.data().due_date;
                    return !d.data().completed && due && new Date(due) < new Date();
                }).length;
                notify();
            }
        );

        // Unread messages
        const unsubMessages = onSnapshot(
            query(collection(db, 'messages'), where('read', '==', false)),
            (snap) => {
                messagesCount = snap.size;
                notify();
            }
        );

        // Return cleanup function that unsubscribes all listeners
        return () => {
            unsubProjects();
            unsubEstimates();
            unsubTasks();
            unsubMessages();
        };
    },
    getRecentActivity: async (limitCount = 10) => {
        try {
            const q = query(collection(db, 'projects'), orderBy('created_at', 'desc'), limit(limitCount));
            const snap = await getDocs(q);
            const activitiesCount = snap.docs.map(d => ({
                id: d.id,
                type: 'project_created',
                description: `Project ${d.data().name || 'Unknown'} created`,
                created_at: d.data().created_at
            }));
            return { success: true, data: activitiesCount };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    }
};

export const searchService = {
    searchProjects: async (term: string) => {
        try {
            const q = query(
                collection(db, 'projects'),
                where('name', '>=', term),
                where('name', '<=', term + '\uf8ff')
            );
            const snap = await getDocs(q);
            return { success: true, data: snap.docs.map(mapDoc) };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    }
};

export const storageService = {
    uploadFile: async (file: File, path: string) => {
        try {
            const storageRef = ref(storage, path);
            const snapshot = await uploadBytes(storageRef, file);
            const url = await getDownloadURL(snapshot.ref);
            return { success: true, url, path: snapshot.ref.fullPath };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    }
};

export const customerService = {
    getAllCustomers: () => contactService.getAll(),
    addCustomer: (data: any) => contactService.create(data),
};

export const propertyService = {
    getAll: () => firestoreService.getAllDocuments('properties'),
    subscribe: (callback: (data: any[]) => void) => firestoreService.subscribeToDocuments('properties', callback),
    getById: (id: string) => firestoreService.getDocument('properties', id),
    create: (data: any) => firestoreService.addDocument('properties', data),
    update: (id: string, data: any) => firestoreService.updateDocument('properties', id, data),
    delete: (id: string) => firestoreService.deleteDocument('properties', id)
};

