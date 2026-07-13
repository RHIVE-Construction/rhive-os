/**
 * RHIVE Google Calendar Sync Service
 * ─────────────────────────────────────────────────────────────────────────────
 * Handles Google OAuth 2.0 (via GIS token model), Google Calendar REST API
 * fetching, and Firestore persistence of synced events under `calendar_events`.
 *
 * Uses the Google Identity Services (GIS) library loaded via CDN in index.html.
 * Client ID is stored in Firestore: settings/google_oauth → { client_id }
 */

import { db } from '../lib/firebase';
import {
    collection,
    addDoc,
    getDocs,
    getDoc,
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

// ─── GIS Token Client Declaration ────────────────────────────────────────────
// The google.accounts.oauth2 object is injected by the GIS CDN script.

declare global {
    interface Window {
        google?: {
            accounts: {
                oauth2: {
                    initTokenClient: (config: {
                        client_id: string;
                        scope: string;
                        hint?: string;
                        callback: (response: { access_token?: string; error?: string }) => void;
                    }) => {
                        requestAccessToken: (opts?: { prompt?: string; hint?: string }) => void;
                    };
                };
            };
        };
    }
}

// ─── Constants ───────────────────────────────────────────────────────────────

const CALENDAR_SCOPE = 'https://www.googleapis.com/auth/calendar.readonly';
const CALENDAR_API_BASE = 'https://www.googleapis.com/calendar/v3';
const FIRESTORE_COLLECTION = 'calendar_events';
const SETTINGS_COLLECTION = 'settings';
const OAUTH_SETTINGS_DOC = 'google_oauth';

// Look ahead/back window for events
const SYNC_DAYS_PAST = 30;
const SYNC_DAYS_FUTURE = 90;

// ─── Firestore: Get Google Client ID ─────────────────────────────────────────

/**
 * Fetches the Google OAuth Client ID from Firestore settings.
 * Stored at: settings/google_oauth → { client_id: string }
 * This allows any user's calendar to be synced without env variables.
 */
export const getGoogleClientIdFromFirestore = async (): Promise<string | null> => {
    try {
        const settingsRef = doc(db, SETTINGS_COLLECTION, OAUTH_SETTINGS_DOC);
        const snap = await getDoc(settingsRef);
        if (snap.exists()) {
            const data = snap.data();
            return data?.client_id || null;
        }
        return null;
    } catch (error: any) {
        console.warn('[GoogleCalendarService] Could not fetch client_id from Firestore:', error.message);
        return null;
    }
};

// ─── Core Functions ───────────────────────────────────────────────────────────

/**
 * Checks if the Google Identity Services library is loaded.
 */
export const isGISLoaded = (): boolean =>
    typeof window !== 'undefined' && !!window.google?.accounts?.oauth2;

/**
 * Requests a Google OAuth2 access token using the GIS Token model.
 * Client ID is read from Firestore settings/google_oauth.
 * Shows a Google popup for the user to authenticate.
 *
 * @param emailHint - Pre-fill the account picker with this email address
 * @returns Promise resolving to the access token
 */
export const requestGoogleAccessToken = (emailHint?: string): Promise<string> => {
    return new Promise(async (resolve, reject) => {
        // Fetch client ID from Firestore
        const clientId = await getGoogleClientIdFromFirestore();

        if (!clientId) {
            reject(new Error(
                'Google OAuth Client ID is not configured in Firestore.\n' +
                'An admin must save it at: Firestore → settings/google_oauth → { client_id }'
            ));
            return;
        }

        if (!isGISLoaded()) {
            reject(new Error(
                'Google Identity Services library is not loaded.\n' +
                'Make sure the GIS script tag is present in index.html.'
            ));
            return;
        }

        const tokenClient = window.google!.accounts.oauth2.initTokenClient({
            client_id: clientId,
            scope: CALENDAR_SCOPE,
            hint: emailHint,
            callback: (response) => {
                if (response.error) {
                    reject(new Error(`Google Auth error: ${response.error}`));
                    return;
                }
                if (!response.access_token) {
                    reject(new Error('No access token received from Google.'));
                    return;
                }
                resolve(response.access_token);
            },
        });

        tokenClient.requestAccessToken({
            prompt: '',
            hint: emailHint,
        });
    });
};

/**
 * Fetches calendar events from the Google Calendar API.
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

/**
 * Full sync pipeline: OAuth → Fetch → Save to Firestore → Update user meta.
 * Client ID is fetched from Firestore settings/google_oauth.
 */
export const syncUserGoogleCalendar = async (
    userId: string,
    userEmail: string
): Promise<CalendarSyncResult> => {
    try {
        // Step 1: Get OAuth access token (triggers Google popup)
        const accessToken = await requestGoogleAccessToken(userEmail);

        // Step 2: Fetch events from Google Calendar
        const googleEvents = await fetchGoogleCalendarEvents(accessToken);

        // Step 3: Save to Firestore
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
