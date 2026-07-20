/**
 * RHIVE Google Calendar Sync Service
 * ─────────────────────────────────────────────────────────────────────────────
 * Uses Firebase Auth (signInWithPopup + GoogleAuthProvider) to obtain a Google
 * OAuth access token with calendar.readonly scope.
 *
 * No client_id configuration needed — Firebase manages OAuth internally.
 * No Firestore settings document required.
 * No GIS library required.
 */

import { auth, db } from '../lib/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import {
    collection,
    addDoc,
    getDocs,
    query,
    where,
    deleteDoc,
    doc,
    updateDoc,
    orderBy,
} from 'firebase/firestore';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface GoogleCalendarEvent {
    id: string;
    summary: string;
    description?: string;
    location?: string;
    start: { dateTime?: string; date?: string; timeZone?: string };
    end: { dateTime?: string; date?: string; timeZone?: string };
    status: 'confirmed' | 'tentative' | 'cancelled';
    htmlLink?: string;
    organizer?: { email: string; displayName?: string };
    attendees?: { email: string; displayName?: string; responseStatus?: string }[];
    colorId?: string;
}

export interface RhiveCalendarEvent {
    id: string;
    userId: string;
    userEmail: string;
    googleEventId: string;
    title: string;
    description: string;
    location: string;
    startDateTime: string;
    endDateTime: string;
    isAllDay: boolean;
    status: 'confirmed' | 'tentative' | 'cancelled';
    googleLink: string;
    organizer: string;
    syncedAt: string;
    created_at: string;
    updated_at: string;
}

export interface CalendarSyncResult {
    success: boolean;
    eventsCount: number;
    events: RhiveCalendarEvent[];
    error?: string;
    accessToken?: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const CALENDAR_SCOPE = 'https://www.googleapis.com/auth/calendar.readonly';
const CALENDAR_API_BASE = 'https://www.googleapis.com/calendar/v3';
const FIRESTORE_COLLECTION = 'calendar_events';

// Look ahead/back window for events
const SYNC_DAYS_PAST = 30;
const SYNC_DAYS_FUTURE = 90;

// ─── Kept for backward-compat (no longer reads from Firestore) ───────────────

/** @deprecated No longer needed — Firebase Auth handles OAuth internally. */
export const getGoogleClientIdFromFirestore = async (): Promise<string | null> => {
    return 'firebase-auth'; // non-null so pre-warm check passes
};

/** @deprecated No longer needed — Firebase Auth handles OAuth internally. */
export const isGISLoaded = (): boolean => true;

// ─── Firebase Auth OAuth ─────────────────────────────────────────────────────

/**
 * Requests a Google OAuth2 access token using Firebase Auth's signInWithPopup.
 * Opens the Google account picker popup — no client_id configuration required.
 *
 * @param emailHint - Optional: pre-fill the Google account picker with this email
 * @returns Access token string
 */
export const requestGoogleAccessToken = async (emailHint?: string): Promise<string> => {
    const provider = new GoogleAuthProvider();

    // Request calendar read-only scope
    provider.addScope(CALENDAR_SCOPE);

    // Hint the account picker to the user's registered email
    if (emailHint) {
        provider.setCustomParameters({ login_hint: emailHint });
    }

    // Force account selection so user can pick the right Google account
    provider.setCustomParameters({
        ...(emailHint ? { login_hint: emailHint } : {}),
        prompt: 'select_account',
    });

    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);

    if (!credential?.accessToken) {
        throw new Error('No access token returned from Google. Please try again.');
    }

    return credential.accessToken;
};

// ─── Calendar API ─────────────────────────────────────────────────────────────

/**
 * Fetches calendar events from the Google Calendar REST API.
 */
export const fetchGoogleCalendarEvents = async (
    accessToken: string
): Promise<GoogleCalendarEvent[]> => {
    const now = new Date();
    const timeMin = new Date(now.getTime() - SYNC_DAYS_PAST * 24 * 60 * 60 * 1000).toISOString();
    const timeMax = new Date(now.getTime() + SYNC_DAYS_FUTURE * 24 * 60 * 60 * 1000).toISOString();

    const params = new URLSearchParams({
        calendarId: 'primary',
        timeMin,
        timeMax,
        singleEvents: 'true',
        orderBy: 'startTime',
        maxResults: '250',
    });

    const response = await fetch(
        `${CALENDAR_API_BASE}/calendars/primary/events?${params.toString()}`,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        }
    );

    if (!response.ok) {
        const errBody = await response.json().catch(() => ({}));
        throw new Error(
            `Google Calendar API error ${response.status}: ${errBody?.error?.message || response.statusText}`
        );
    }

    const data = await response.json();
    return (data.items || []) as GoogleCalendarEvent[];
};

// ─── Firestore Persistence ────────────────────────────────────────────────────

/**
 * Normalizes a raw Google Calendar event into the RHIVE schema.
 */
const normalizeEvent = (
    event: GoogleCalendarEvent,
    userId: string,
    userEmail: string
): Omit<RhiveCalendarEvent, 'id'> => {
    const isAllDay = !event.start.dateTime;
    const startDateTime = event.start.dateTime || event.start.date || '';
    const endDateTime = event.end.dateTime || event.end.date || '';
    const syncedAt = new Date().toISOString();

    return {
        userId,
        userEmail,
        googleEventId: event.id,
        title: event.summary || '(No title)',
        description: event.description || '',
        location: event.location || '',
        startDateTime,
        endDateTime,
        isAllDay,
        status: event.status || 'confirmed',
        googleLink: event.htmlLink || '',
        organizer: event.organizer?.email || userEmail,
        syncedAt,
        created_at: syncedAt,
        updated_at: syncedAt,
    };
};

/**
 * Saves synced calendar events to Firestore.
 * Clears existing events for the user before writing fresh ones.
 */
export const saveCalendarEventsToFirestore = async (
    userId: string,
    userEmail: string,
    googleEvents: GoogleCalendarEvent[]
): Promise<RhiveCalendarEvent[]> => {
    // Delete existing events for this user
    const existingQuery = query(
        collection(db, FIRESTORE_COLLECTION),
        where('userId', '==', userId)
    );
    const existingSnap = await getDocs(existingQuery);
    const deletions = existingSnap.docs.map((d) => deleteDoc(doc(db, FIRESTORE_COLLECTION, d.id)));
    await Promise.all(deletions);

    // Write new events
    const savedEvents: RhiveCalendarEvent[] = [];
    for (const event of googleEvents) {
        const normalized = normalizeEvent(event, userId, userEmail);
        const docRef = await addDoc(collection(db, FIRESTORE_COLLECTION), normalized);
        savedEvents.push({ id: docRef.id, ...normalized });
    }

    return savedEvents;
};

/**
 * Updates the user document with calendar sync metadata.
 */
export const updateUserCalendarMeta = async (
    userId: string,
    userEmail: string,
    eventsCount: number
): Promise<void> => {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
        googleCalendarLinked: true,
        googleCalendarEmail: userEmail,
        lastCalendarSync: new Date().toISOString(),
        calendarEventCount: eventsCount,
        updated_at: new Date().toISOString(),
    });
};

// ─── Main Sync Pipeline ───────────────────────────────────────────────────────

/**
 * Full sync pipeline: Firebase OAuth popup → Fetch Calendar → Save to Firestore.
 * No client_id or Firestore settings required.
 */
export const syncUserGoogleCalendar = async (
    userId: string,
    userEmail: string
): Promise<CalendarSyncResult> => {
    try {
        // Step 1: Get OAuth access token via Firebase Auth popup
        const accessToken = await requestGoogleAccessToken(userEmail);

        // Step 2: Fetch events from Google Calendar REST API
        const googleEvents = await fetchGoogleCalendarEvents(accessToken);

        // Step 3: Save to Firestore calendar_events collection
        const savedEvents = await saveCalendarEventsToFirestore(userId, userEmail, googleEvents);

        // Step 4: Update user document with sync metadata
        await updateUserCalendarMeta(userId, userEmail, savedEvents.length);

        return {
            success: true,
            eventsCount: savedEvents.length,
            events: savedEvents,
            accessToken,
        };
    } catch (error: any) {
        console.error('[GoogleCalendarService] Sync failed:', error);

        // User closed the popup — treat as a cancel, not an error
        if (error?.code === 'auth/popup-closed-by-user' || error?.code === 'auth/cancelled-popup-request') {
            return {
                success: false,
                eventsCount: 0,
                events: [],
                error: 'Sign-in was cancelled. Click the button again to try.',
            };
        }

        // Google sign-in provider not enabled in Firebase Console
        if (error?.code === 'auth/operation-not-allowed') {
            return {
                success: false,
                eventsCount: 0,
                events: [],
                error: 'Google sign-in is not enabled on this Firebase project. An admin must enable the Google provider at: Firebase Console → Authentication → Sign-in method → Google → Enable.',
            };
        }

        // Popup was blocked by the browser
        if (error?.code === 'auth/popup-blocked') {
            return {
                success: false,
                eventsCount: 0,
                events: [],
                error: 'The Google sign-in popup was blocked by your browser. Please allow popups for this site and try again.',
            };
        }

        return {
            success: false,
            eventsCount: 0,
            events: [],
            error: error?.message || 'An unexpected error occurred during calendar sync.',
        };
    }
};

/**
 * Fetches a user's synced calendar events from Firestore.
 */
export const getUserCalendarEvents = async (userId: string): Promise<RhiveCalendarEvent[]> => {
    try {
        const q = query(
            collection(db, FIRESTORE_COLLECTION),
            where('userId', '==', userId),
            orderBy('startDateTime', 'asc')
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as RhiveCalendarEvent));
    } catch (error: any) {
        console.error('[GoogleCalendarService] Failed to fetch events:', error);
        return [];
    }
};
