import { auth, db, storage } from './firebase';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    sendPasswordResetEmail,
    confirmPasswordReset as firebaseConfirmPasswordReset,
    verifyPasswordResetCode,
    User,
    UserCredential
} from 'firebase/auth';
import {
    collection,
    addDoc,
    getDocs,
    getDocsFromServer,
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
import { hashPassword } from './utils';
import { session } from './session';

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
    getCurrentUser: () => auth.currentUser,

    /**
     * Sends a secure password reset email via Firebase Auth.
     * The link is time-limited (1 hour by default) and single-use.
     * With handleCodeInApp: true, the link routes back to this app's
     * /reset-password page where the user sets their new password.
     * SECURITY: Always resolves successfully to prevent email enumeration.
     */
    sendPasswordReset: async (email: string): Promise<{ success: boolean; error?: string }> => {
        try {
            const normalized = email.toLowerCase().trim();
            await sendPasswordResetEmail(auth, normalized, {
                // Route back to the in-app password reset page
                url: `${window.location.origin}/?mode=resetPassword`,
                handleCodeInApp: true,
            });
            return { success: true };
        } catch (error: any) {
            // Swallow enumeration errors — do NOT reveal if email exists
            if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-email') {
                return { success: true };
            }
            console.error('[sendPasswordReset] Unexpected error:', error.code, error.message);
            return { success: false, error: 'Unable to send reset email. Please try again later.' };
        }
    },

    /**
     * Verifies that a password reset oobCode (from the email link) is valid
     * and returns the email address it belongs to.
     */
    verifyResetCode: async (oobCode: string): Promise<{ success: boolean; email?: string; error?: string }> => {
        try {
            const email = await verifyPasswordResetCode(auth, oobCode);
            return { success: true, email };
        } catch (error: any) {
            console.error('[verifyResetCode] Error:', error.code, error.message);
            return { success: false, error: 'This reset link is invalid or has expired. Please request a new one.' };
        }
    },

    /**
     * Completes the password reset by applying the new password using the oobCode.
     */
    confirmPasswordReset: async (oobCode: string, newPassword: string): Promise<{ success: boolean; error?: string }> => {
        try {
            await firebaseConfirmPasswordReset(auth, oobCode, newPassword);
            return { success: true };
        } catch (error: any) {
            console.error('[confirmPasswordReset] Error:', error.code, error.message);
            if (error.code === 'auth/expired-action-code') {
                return { success: false, error: 'This reset link has expired. Please request a new one.' };
            }
            if (error.code === 'auth/invalid-action-code') {
                return { success: false, error: 'This reset link is invalid or has already been used.' };
            }
            if (error.code === 'auth/weak-password') {
                return { success: false, error: 'Password must be at least 6 characters.' };
            }
            return { success: false, error: 'Failed to reset password. Please try again.' };
        }
    },
};

// ============================================
// FIRESTORE PASSWORD RESET SERVICE
// For users stored in Firestore (not Firebase Auth).
// Flow: email lookup → token stored in Firestore → email sent via EmailJS
//       → user clicks link → token verified → password_hash updated in Firestore
// ============================================

const RESET_TOKEN_EXPIRY_MS = 60 * 60 * 1000; // 1 hour

export const passwordResetService = {
    /**
     * Step 1: Request a password reset.
     * Looks up the user in Firestore, generates a secure token,
     * stores it in the `passwordResets` collection, then sends the email.
     * SECURITY: Always returns success to prevent email enumeration.
     */
    requestReset: async (email: string): Promise<{ success: boolean; error?: string }> => {
        try {
            const normalized = email.toLowerCase().trim();

            // Look up user in Firestore
            const usersRef = collection(db, 'users');
            const q = query(usersRef, where('email', '==', normalized), limit(1));
            const snapshot = await getDocs(q);

            if (snapshot.empty) {
                // Don't reveal user doesn't exist — silently succeed
                console.warn('[passwordResetService] No user found for email (enumeration guard)');
                return { success: true };
            }

            const userDoc = snapshot.docs[0];
            const userId = userDoc.id;
            const userName = userDoc.data().name || 'RHIVE User';

            // Generate a cryptographically secure token
            const tokenBytes = new Uint8Array(32);
            crypto.getRandomValues(tokenBytes);
            const token = Array.from(tokenBytes).map(b => b.toString(16).padStart(2, '0')).join('');

            // Store the token in Firestore with expiry
            const expiresAt = new Date(Date.now() + RESET_TOKEN_EXPIRY_MS).toISOString();
            await setDoc(doc(db, 'passwordResets', token), {
                userId,
                email: normalized,
                expiresAt,
                used: false,
                createdAt: new Date().toISOString(),
            });

            // Build the reset URL
            const resetUrl = `${window.location.origin}/?mode=firestoreReset&token=${token}`;

            // Send email via EmailJS
            const emailjsServiceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
            const emailjsTemplateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
            const emailjsPublicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

            if (!emailjsServiceId || !emailjsTemplateId || !emailjsPublicKey) {
                console.error('[passwordResetService] EmailJS env vars not configured. Reset URL:', resetUrl);
                // In dev, still return success and log the URL so it can be tested
                return { success: true };
            }

            const { default: emailjs } = await import('@emailjs/browser');
            await emailjs.send(
                emailjsServiceId,
                emailjsTemplateId,
                {
                    to_email: normalized,
                    to_name: userName,
                    reset_url: resetUrl,
                    expires_in: '1 hour',
                    app_name: 'RHIVE QOS',
                },
                emailjsPublicKey
            );

            return { success: true };
        } catch (error: any) {
            console.error('[passwordResetService.requestReset] Error:', error);
            return { success: false, error: 'Unable to send reset email. Please try again later.' };
        }
    },

    /**
     * Step 2: Verify a reset token from the URL.
     * Returns the email address if valid, or an error if expired/used/invalid.
     */
    verifyToken: async (token: string): Promise<{ success: boolean; email?: string; userId?: string; error?: string }> => {
        try {
            if (!token) return { success: false, error: 'Invalid reset link.' };

            const tokenDocRef = doc(db, 'passwordResets', token);
            const tokenSnap = await getDoc(tokenDocRef);

            if (!tokenSnap.exists()) {
                return { success: false, error: 'This reset link is invalid or has already been used.' };
            }

            const data = tokenSnap.data();

            if (data.used) {
                return { success: false, error: 'This reset link has already been used. Please request a new one.' };
            }

            if (new Date() > new Date(data.expiresAt)) {
                return { success: false, error: 'This reset link has expired. Links are valid for 1 hour.' };
            }

            return { success: true, email: data.email, userId: data.userId };
        } catch (error: any) {
            console.error('[passwordResetService.verifyToken] Error:', error);
            return { success: false, error: 'Unable to verify reset link. Please try again.' };
        }
    },

    /**
     * Step 3: Apply the new password.
     * Hashes the new password and updates password_hash in the users collection.
     * Marks the reset token as used so it cannot be replayed.
     */
    applyNewPassword: async (token: string, newPassword: string): Promise<{ success: boolean; error?: string }> => {
        try {
            // Re-verify token before applying
            const verification = await passwordResetService.verifyToken(token);
            if (!verification.success || !verification.userId) {
                return { success: false, error: verification.error };
            }

            const { hashPassword } = await import('./utils');
            const newHash = await hashPassword(newPassword);

            // Update password_hash in the users collection
            const userRef = doc(db, 'users', verification.userId);
            await updateDoc(userRef, {
                password_hash: newHash,
                updated_at: new Date().toISOString(),
            });

            // Mark the token as used (single-use enforcement)
            const tokenRef = doc(db, 'passwordResets', token);
            await updateDoc(tokenRef, { used: true, usedAt: new Date().toISOString() });

            return { success: true };
        } catch (error: any) {
            console.error('[passwordResetService.applyNewPassword] Error:', error);
            return { success: false, error: 'Failed to update password. Please try again.' };
        }
    },
};


export const firestoreService = {
    // This function automatically creates the collection if it doesn't exist
    addDocument: async (collectionName: string, data: DocumentData) => {
        try {
            // Firestore fails on undefined fields, serialize to strip undefined
            const cleanData = JSON.parse(JSON.stringify(data));
            // Adding a document implicitly 'creates' the collection
            const docRef = await addDoc(collection(db, collectionName), {
                ...cleanData,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            });
            return { success: true, id: docRef.id, data: { id: docRef.id, ...cleanData } };
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
        // Use simple collection listener (no orderBy = no index required)
        return onSnapshot(
            collection(db, collectionName),
            (snapshot) => {
                const data = snapshot.docs
                    .map(mapDoc)
                    .sort((a, b) => {
                        const aVal = a[sortField] || '';
                        const bVal = b[sortField] || '';
                        return bVal > aVal ? 1 : bVal < aVal ? -1 : 0;
                    });
                callback(data);
            },
            (error) => {
                console.error(`🔥 Firestore [${collectionName}] error:`, error.code, error.message);
                callback([]);
            }
        );
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
            const cleanData = JSON.parse(JSON.stringify(data));
            const docRef = doc(db, collectionName, id);
            await updateDoc(docRef, { ...cleanData, updated_at: new Date().toISOString() });
            return { success: true, data: { id, ...cleanData } };
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
                const cleanData = JSON.parse(JSON.stringify(data));
                const newDocRef = doc(colRef);
                batch.set(newDocRef, {
                    ...cleanData,
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

// Helper to normalize a Firestore 'deals' document to the common project shape
const normalizeDeal = (deal: any): any => ({
    ...deal,
    _source: 'deals',
    // Support both Zoho-style (Deal_Name / Stage) and internal snake_case fields
    name: deal.name || deal.Deal_Name || deal.deal_name || 'Unnamed Deal',
    current_stage: deal.current_stage || deal.Deal_Stage || deal.stage || 'Lead',
    project_type: deal.project_type || deal.Type || deal.type || 'Deal',
    property_address: deal.property_address || deal.Property_Address || deal.Address || '',
    lead_source: deal.lead_source || deal.Lead_Source || deal.source || '',
    notes: deal.notes || deal.Description || deal.description || '',
    quote: deal.quote ?? (
        deal.Amount || deal.amount
            ? { total: Number(deal.Amount || deal.amount) }
            : undefined
    ),
    contact_id: deal.contact_id || deal.Contact_Id || null,
    property_id: deal.property_id || null,
    account_id: deal.account_id || deal.Account_Id || null,
    created_at: deal.created_at || deal.Created_Time || null,
    updated_at: deal.updated_at || deal.Modified_Time || null,
});

// Helper to normalize a Firestore 'leads' document (CRM import) to the common project shape.
// Leads have fields like projectAddress, firstName, lastName, projectType, etc.
const normalizeLead = (lead: any): any => {
    // Build display name from available fields
    const displayName =
        lead.name ||
        (lead.firstName && lead.lastName ? `${lead.firstName} ${lead.lastName}` : null) ||
        lead.projectName ||
        lead.lastName ||
        'Unnamed Lead';

    // Build address from available fields
    const address = [
        lead.property_address ||
        lead.projectAddress ||
        lead.projectStreet ||
        lead.street,
        lead.city,
        lead.state,
        lead.zipCode,
    ].filter(Boolean).join(', ') || '';

    return {
        ...lead,
        _source: 'leads',
        // Normalised fields that ProjectStageLayout + Dashboard expect
        name: displayName,
        current_stage: lead.current_stage || lead.Stage || 'Lead',
        project_type: lead.projectType || lead.project_type || lead.serviceSolution || 'Residential',
        property_address: address,
        // Preserve contact info in a predictable place
        contact_name: displayName,
        contact_email: lead.email || lead.secondaryEmail || '',
        contact_phone: lead.phone || lead.mobile || lead.contactPhone2 || '',
        lead_source: lead.leadSource || lead.lead_source || lead.howDidYouHear || '',
        notes: lead.additionalProjectDetails || lead.notes || '',
        // Timestamps
        created_at: lead.created_at || lead._importedAt || null,
        updated_at: lead.updated_at || lead.created_at || lead._importedAt || null,
    };
};

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
        const d = await firestoreService.getAllDocuments('deals');
        const combined = [
            ...(p.data || []),
            ...(l.data || []).map(normalizeLead),
            ...(d.data || []).map(normalizeDeal),
        ];
        return { success: true, data: combined };
    },
    subscribe: (callback: (data: any[]) => void) => {
        let projects: any[] = [];
        let leads: any[] = [];
        let deals: any[] = [];

        const notify = () => callback([...projects, ...leads, ...deals]);


        const unsubProjects = firestoreService.subscribeToDocuments('projects', (data) => {
            projects = data;
            notify();
        });

        const unsubLeads = firestoreService.subscribeToDocuments('leads', (data) => {
            leads = data.map(normalizeLead);
            notify();
        });

        const unsubDeals = onSnapshot(
            collection(db, 'deals'),
            (snap) => {
                deals = snap.docs.map(mapDoc).map(normalizeDeal);
                notify();
            },
            (error) => {
                console.warn('🔥 Firestore [deals] subscribe error:', error.code);
                notify();
            }
        );


        return () => {
            unsubProjects();
            unsubLeads();
            unsubDeals();
        };
    },
    subscribeAllWork: (callback: (data: any[]) => void) => {
        let projects: any[] = [];
        let leads: any[] = [];
        let deals: any[] = [];
        const notify = () => callback([...projects, ...leads, ...deals]);

        const unsubP = firestoreService.subscribeToDocuments('projects', (d) => { projects = d; notify(); });
        const unsubL = firestoreService.subscribeToDocuments('leads', (d) => { leads = d; notify(); });
        const unsubD = onSnapshot(
            collection(db, 'deals'),
            (snap) => { deals = snap.docs.map(mapDoc).map(normalizeDeal); notify(); },
            () => notify()
        );

        return () => { unsubP(); unsubL(); unsubD(); };
    },
    subscribeToRecentActivity: (callback: (data: any[]) => void, limitCount = 6) => {
        let projectDocs: any[] = [];
        let leadDocs:    any[] = [];
        let dealDocs:    any[] = [];

        // Helper: coerce Firestore Timestamp OR ISO string to ms
        const toMs = (val: any): number => {
            if (!val) return 0;
            if (typeof val === 'object' && typeof val.seconds === 'number')
                return val.seconds * 1000 + Math.floor((val.nanoseconds || 0) / 1e6);
            const ms = new Date(val).getTime();
            return isNaN(ms) ? 0 : ms;
        };

        // Re-fires on every Firestore snapshot (no one-shot guard)
        const notify = () => {
            const merged = [...projectDocs, ...leadDocs, ...dealDocs]
                .sort((a, b) =>
                    toMs(b.updated_at || b.created_at || b._importedAt) -
                    toMs(a.updated_at || a.created_at || a._importedAt)
                )
                .slice(0, limitCount);
            callback(merged);
        };

        const unsubP = onSnapshot(
            collection(db, 'projects'),
            (snap) => { projectDocs = snap.docs.map(mapDoc); notify(); },
            () => { notify(); }
        );
        const unsubL = onSnapshot(
            collection(db, 'leads'),
            // Apply normalizeLead so name / property_address / stage are standardised
            (snap) => { leadDocs = snap.docs.map(mapDoc).map(normalizeLead); notify(); },
            () => { notify(); }
        );
        const unsubD = onSnapshot(
            collection(db, 'deals'),
            (snap) => { dealDocs = snap.docs.map(mapDoc).map(normalizeDeal); notify(); },
            () => { notify(); }
        );

        return () => { unsubP(); unsubL(); unsubD(); };
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

    // Create a new user — rejects if an account with the same email already exists
    create: async (data: any) => {
        try {
            if (data.email) {
                const normalizedEmail = data.email.toLowerCase().trim();
                const dupCheck = query(collection(db, 'users'), where('email', '==', normalizedEmail));
                const dupSnap = await getDocs(dupCheck);
                if (!dupSnap.empty) {
                    return { success: false, error: `An account with the email "${normalizedEmail}" already exists.` };
                }
                data = { ...data, email: normalizedEmail };
            }
            return firestoreService.addDocument('users', data);
        } catch (error: any) {
            console.error('Error creating user:', error);
            return { success: false, error: error.message };
        }
    },

    // Write a Firestore user doc using a specific ID (e.g. Firebase Auth UID) — rejects duplicates
    createWithId: async (id: string, data: any) => {
        try {
            if (data.email) {
                const normalizedEmail = data.email.toLowerCase().trim();
                const dupCheck = query(collection(db, 'users'), where('email', '==', normalizedEmail));
                const dupSnap = await getDocs(dupCheck);
                // Allow update if the only match is the same document (same id)
                const otherDup = dupSnap.docs.find(d => d.id !== id);
                if (otherDup) {
                    return { success: false, error: `An account with the email "${normalizedEmail}" already exists.` };
                }
                data = { ...data, email: normalizedEmail };
            }
            const cleanData = JSON.parse(JSON.stringify(data));
            const docRef = doc(db, 'users', id);
            await setDoc(docRef, {
                ...cleanData,
                created_at: cleanData.created_at || new Date().toISOString(),
                updated_at: new Date().toISOString()
            });
            return { success: true, id, data: { id, ...cleanData } };
        } catch (error: any) {
            console.error('Error creating user with ID:', error);
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
    },
    /**
     * SYSTEM RULE: Always use this method for password verification and any
     * security-sensitive lookup. It bypasses the Firestore SDK cache and fetches
     * directly from the server, ensuring the latest password_hash and user data
     * are always used — even immediately after a password reset or profile update.
     */
    getByEmailFromServer: async (email: string) => {
        try {
            const q = query(collection(db, 'users'), where('email', '==', email.toLowerCase().trim()));
            const snapshot = await getDocsFromServer(q);
            if (snapshot.empty) return { success: false, error: 'No user found with this email' };
            return { success: true, data: snapshot.docs.map(mapDoc)[0] };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    }
};


export const passwordResetService = {
    /**
     * Generates a reset token, stores it on the user document,
     * then queues a password-reset email via the Firestore `mail` collection.
     * The "Trigger Email from Firestore" Firebase extension handles delivery.
     */
    createResetToken: async (email: string) => {
        try {
            const { emailService } = await import('./emailService');
            const normalizedEmail = email.toLowerCase().trim();

            // 1. Verify user exists
            const userResult = await userService.getByEmail(normalizedEmail);
            if (!userResult.success || !userResult.data) {
                return { success: false, error: 'No account found with this email address.' };
            }

            const userDoc = userResult.data as any;

            // 2. Generate secure token: random hex + timestamp
            const randomBytes = Array.from({ length: 16 }, () => Math.floor(Math.random() * 256));
            const token = randomBytes.map(b => b.toString(16).padStart(2, '0')).join('') + Date.now().toString(36);

            // 3. Store token + expiry directly on the user document (1 hour window)
            const expiry = new Date(Date.now() + 3600 * 1000).toISOString();
            const updateResult = await userService.update(userDoc.id, {
                reset_token: token,
                reset_token_expiry: expiry,
                updated_at: new Date().toISOString()
            });

            if (!updateResult.success) {
                return { success: false, error: updateResult.error || 'Failed to generate reset token.' };
            }

            // 4. Queue password reset email via Firestore `mail` collection
            const emailResult = await emailService.sendPasswordReset(normalizedEmail, token);
            if (!emailResult.success) {
                // Email queuing failed — still return success so user isn't locked out,
                // but log the failure for investigation.
                console.error('[passwordResetService] Email queuing failed:', emailResult.error);
            }

            return { success: true, token, email: normalizedEmail, emailQueued: emailResult.success };
        } catch (error: any) {
            console.error('Error in createResetToken:', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Verifies a reset token by querying the users collection directly.
     */
    verifyResetToken: async (token: string) => {
        try {
            const q = query(
                collection(db, 'users'),
                where('reset_token', '==', token)
            );
            const snapshot = await getDocs(q);

            if (snapshot.empty) {
                return { success: false, error: 'This secure recovery link is invalid or has already been used.' };
            }

            const userDoc = snapshot.docs.map(mapDoc)[0];

            if (!userDoc.reset_token_expiry || new Date(userDoc.reset_token_expiry).getTime() < Date.now()) {
                return { success: false, error: 'This secure recovery link has expired.' };
            }

            return { success: true, email: userDoc.email, userId: userDoc.id };
        } catch (error: any) {
            console.error('Error in verifyResetToken:', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Completes the password reset.
     *
     * AUTO-DETECTS token type:
     *  - JWT token (starts with "eyJ") → from SMS OTP flow → calls completePasswordReset Cloud Function
     *    which uses Firebase Admin SDK to update the real Firebase Auth password.
     *  - Firestore token → from email reset flow → updates password_hash on the user document.
     */
    completePasswordReset: async (token: string, newPassword: string): Promise<{ success: boolean; error?: string }> => {
        try {
            // ── JWT path (SMS OTP forgot-password flow) ───────────────────────
            if (token.startsWith('eyJ')) {
                const res = await fetch(`${FUNCTIONS_BASE_URL}/completePasswordReset`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ resetToken: token, newPassword })
                });
                const data = await res.json();
                if (!res.ok) {
                    return { success: false, error: data.error || `HTTP ${res.status}` };
                }
                return { success: true };
            }

            // ── Firestore token path (email reset flow) ───────────────────────
            // 1. Verify token and get userId directly
            const verification = await passwordResetService.verifyResetToken(token);
            if (!verification.success || !verification.userId) {
                return { success: false, error: verification.error || 'Token verification failed.' };
            }

            // 2. Hash the new password
            const passwordHash = await hashPassword(newPassword);

            // 3. Update password_hash and clear reset token fields on the user document
            const updateResult = await userService.update(verification.userId, {
                password_hash: passwordHash,
                reset_token: null,
                reset_token_expiry: null,
                updated_at: new Date().toISOString()
            });

            if (!updateResult.success) {
                return { success: false, error: updateResult.error || 'Failed to update password.' };
            }

            return { success: true };
        } catch (error: any) {
            console.error('Error in completePasswordReset:', error);
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

        // Track which core sources have fired (projects + leads)
        let projectsFired = false;
        let leadsFired = false;
        let notified = false;

        const notify = () => {
            // Notify once both core sources have fired
            if (!projectsFired || !leadsFired) return;
            notified = true;
            callback({
                activeProjects: projectCount,
                activeProjectsTrend: projectsThisWeek > 0 ? `+${projectsThisWeek} this week` : 'No new this week',
                tasksDue: tasksCount,
                tasksOverdue,
                pendingQuotesCount: estimatesCount,
                pendingQuotesValue: estimatesValue,
                unreadMessages: messagesCount,
            });
        };

        // Safety timeout: force fire stats after 5s even if a collection is missing
        const safetyTimer = setTimeout(() => {
            if (!notified) {
                projectsFired = true;
                leadsFired = true;
                callback({
                    activeProjects: projectCount,
                    activeProjectsTrend: projectsThisWeek > 0 ? `+${projectsThisWeek} this week` : 'No new this week',
                    tasksDue: tasksCount,
                    tasksOverdue,
                    pendingQuotesCount: estimatesCount,
                    pendingQuotesValue: estimatesValue,
                    unreadMessages: messagesCount,
                });
            }
        }, 5000);

        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        // Active projects (non-completed)
        let rawProjectCount = 0;
        let rawLeadCount = 0;
        let projectsThisWeekCount = 0;
        let leadsThisWeekCount = 0;

        const recomputeActive = () => {
            projectCount = rawProjectCount + rawLeadCount;
            projectsThisWeek = projectsThisWeekCount + leadsThisWeekCount;
            notify();
        };

        // Projects collection — no orderBy to avoid index requirement
        const unsubProjects = onSnapshot(
            collection(db, 'projects'),
            (snap) => {
                rawProjectCount = snap.docs.filter(d => {
                    const s = (d.data().current_stage || d.data().status || '').toLowerCase();
                    return !s.includes('complet') && !s.includes('past');
                }).length;
                projectsThisWeekCount = snap.docs.filter(d => {
                    const created = d.data().created_at;
                    return created && new Date(created) >= oneWeekAgo;
                }).length;
                projectsFired = true;
                recomputeActive();
            },
            (error) => {
                console.error('🔥 Firestore [projects] stats error:', error.code);
                projectsFired = true;
                notify();
            }
        );

        // Leads collection
        const unsubLeads = onSnapshot(
            collection(db, 'leads'),
            (snap) => {
                rawLeadCount = snap.docs.filter(d => {
                    const s = (d.data().current_stage || '').toLowerCase();
                    return !s.includes('complet') && !s.includes('past');
                }).length;
                leadsThisWeekCount = snap.docs.filter(d => {
                    const created = d.data().created_at;
                    return created && new Date(created) >= oneWeekAgo;
                }).length;
                leadsFired = true;
                recomputeActive();
            },
            (error) => {
                console.error('🔥 Firestore [leads] stats error:', error.code);
                leadsFired = true;
                notify();
            }
        );

        // Estimates — optional, graceful fallback
        const unsubEstimates = onSnapshot(
            collection(db, 'estimates'),
            (snap) => {
                estimatesCount = snap.size;
                estimatesValue = snap.docs.reduce((sum, d) => {
                    const total = d.data().total_price || d.data().total || d.data().amount || 0;
                    return sum + Number(total);
                }, 0);
                notify();
            },
            (error) => {
                console.warn('🔥 Firestore [estimates] not available:', error.code);
                notify();
            }
        );

        // Tasks — optional, graceful fallback
        const unsubTasks = onSnapshot(
            collection(db, 'tasks'),
            (snap) => {
                tasksCount = snap.docs.filter(d => !d.data().completed).length;
                tasksOverdue = snap.docs.filter(d => {
                    const due = d.data().due_date;
                    return !d.data().completed && due && new Date(due) < new Date();
                }).length;
                notify();
            },
            (error) => {
                console.warn('🔥 Firestore [tasks] not available:', error.code);
                notify();
            }
        );

        // Messages — count all unread without a where() to avoid missing index errors
        const unsubMessages = onSnapshot(
            collection(db, 'messages'),
            (snap) => {
                messagesCount = snap.docs.filter(d => d.data().read === false).length;
                notify();
            },
            (error) => {
                console.warn('🔥 Firestore [messages] not available:', error.code);
                notify();
            }
        );

        return () => {
            clearTimeout(safetyTimer);
            unsubProjects();
            unsubLeads();
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

// ============================================
// DEALS SERVICE
// ============================================
// The 'deals' collection holds quote-stage CRM records.
// Each deal is associated to a contact via the `contact_id` field.

export const dealService = {
    getAll: () => firestoreService.getAllDocuments('deals'),
    subscribe: (callback: (data: any[]) => void) =>
        firestoreService.subscribeToDocuments('deals', callback),
    getById: (id: string) => firestoreService.getDocument('deals', id),
    create: (data: any) => firestoreService.addDocument('deals', data),
    update: (id: string, data: any) => firestoreService.updateDocument('deals', id, data),
    delete: (id: string) => firestoreService.deleteDocument('deals', id),
    createBatch: (dataArray: any[]) => firestoreService.createBatch('deals', dataArray),

    /** Fetch all deals linked to a specific contact. */
    getByContactId: async (contactId: string) => {
        try {
            const q = query(collection(db, 'deals'), where('contact_id', '==', contactId));
            const snapshot = await getDocs(q);
            return { success: true, data: snapshot.docs.map(mapDoc) };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    },

    /** Fetch all deals at the Quote stage (Stage 3). */
    subscribeToQuoteStage: (callback: (data: any[]) => void) => {
        return onSnapshot(
            collection(db, 'deals'),
            (snapshot) => {
                const data = snapshot.docs
                    .map(mapDoc)
                    .filter((d) => {
                        const stage = (d.current_stage || d.stage || '').toLowerCase();
                        return stage.includes('quote') || stage.includes('stage 3');
                    })
                    .sort((a, b) => {
                        const aVal = a.created_at || a.createdTime || '';
                        const bVal = b.created_at || b.createdTime || '';
                        return bVal > aVal ? 1 : bVal < aVal ? -1 : 0;
                    });
                callback(data);
            },
            (error) => {
                console.error(`🔥 Firestore [deals] error:`, error.code, error.message);
                callback([]);
            }
        );
    },
};

export const propertyService = {
    getAll: () => firestoreService.getAllDocuments('properties'),
    subscribe: (callback: (data: any[]) => void) => firestoreService.subscribeToDocuments('properties', callback),
    getById: (id: string) => firestoreService.getDocument('properties', id),
    create: (data: any) => firestoreService.addDocument('properties', data),
    update: (id: string, data: any) => firestoreService.updateDocument('properties', id, data),
    delete: (id: string) => firestoreService.deleteDocument('properties', id)
};

// ============================================
// USER LOG SERVICE
// ============================================
export interface UserLog {
    id?: string;
    userId: string;
    userName: string;
    userRole: string;
    actionType: string;
    description: string;
    payload?: Record<string, any>;
    timestamp: string;
}

export const userLogService = {
    getAll: () => firestoreService.getAllDocuments('user_log'),
    subscribe: (callback: (data: any[]) => void) => firestoreService.subscribeToDocuments('user_log', callback),
    logAction: async (
        actionType: string,
        description: string,
        payload?: Record<string, any>,
        userContext?: { id: string; name: string; role: string }
    ) => {
        const currentUser = userContext || session.read();
        const userId = currentUser?.id || 'anonymous';
        const userName = currentUser?.name || 'Anonymous';
        const userRole = currentUser?.role || 'Guest';

        const logDoc = {
            userId,
            userName,
            userRole,
            actionType,
            description,
            payload: payload || {},
            timestamp: new Date().toISOString(),
            read: false
        };

        try {
            const result = await firestoreService.addDocument('user_log', logDoc);
            console.log(`[user_log] Successfully recorded log: ${actionType} - ${description}`, result);
            return result;
        } catch (error: any) {
            console.warn('🔥 Failed to write user action to Firestore user_log:', error);
            return { success: false, error: error.message };
        }
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// SMS OTP Service (for Forgot Password via phone number)
// Calls Firebase Cloud Functions: sendSmsOtp / verifySmsOtp
// ─────────────────────────────────────────────────────────────────────────────

const FIREBASE_PROJECT_ID = (import.meta as any).env?.VITE_FIREBASE_PROJECT_ID || 'rhive-os';
const FUNCTIONS_REGION = 'us-central1';
// Always use the deployed production Cloud Functions (emulator not in use)
const FUNCTIONS_BASE_URL = `https://${FUNCTIONS_REGION}-${FIREBASE_PROJECT_ID}.cloudfunctions.net`;

export const smsOtpService = {
    /**
     * Step 1: Send OTP to phone number
     * Calls the sendSmsOtp Cloud Function
     */
    sendOtp: async (phone: string): Promise<{ success: boolean; error?: string; devCode?: string }> => {
        try {
            const res = await fetch(`${FUNCTIONS_BASE_URL}/sendSmsOtp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone })
            });
            const data = await res.json();
            if (!res.ok) {
                return { success: false, error: data.error || `HTTP ${res.status}` };
            }
            return { success: true, devCode: data.code }; // devCode only set in dev/simulation mode
        } catch (error: any) {
            console.error('[smsOtpService.sendOtp]', error);
            return { success: false, error: 'Network error. Could not reach the OTP service.' };
        }
    },

    /**
     * Step 2: Verify OTP code
     * Calls the verifySmsOtp Cloud Function → returns a short-lived resetToken
     */
    verifyOtp: async (phone: string, code: string): Promise<{ success: boolean; resetToken?: string; email?: string | null; error?: string }> => {
        try {
            const res = await fetch(`${FUNCTIONS_BASE_URL}/verifySmsOtp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone, code })
            });
            const data = await res.json();
            if (!res.ok) {
                return { success: false, error: data.error || `HTTP ${res.status}` };
            }
            return { success: true, resetToken: data.resetToken, email: data.email };
        } catch (error: any) {
            console.error('[smsOtpService.verifyOtp]', error);
            return { success: false, error: 'Network error. Could not verify the OTP.' };
        }
    }
};

