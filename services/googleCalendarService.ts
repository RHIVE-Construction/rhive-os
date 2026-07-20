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
    source: 'google' | 'rhive';   // origin of this event
    color?: string;                // hex color for display
}

export interface CalendarSyncResult {
    success: boolean;
    eventsCount: number;
    events: RhiveCalendarEvent[];
    error?: string;
    accessToken?: string;
}

/** Payload for creating a new calendar event */
export interface CreateEventPayload {
    title: string;
    description?: string;
    location?: string;
    startDateTime: string;   // ISO 8601
    endDateTime: string;     // ISO 8601
    isAllDay?: boolean;
    color?: string;
    pushToGoogle?: boolean;  // if true, also creates in Google Calendar
}

// ─── Constants ───────────────────────────────────────────────────────────────

// Full calendar access — needed for both read (sync) and write (add events)
const CALENDAR_SCOPE = 'https://www.googleapis.com/auth/calendar';
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
        source: 'google' as const,
        color: undefined,
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

/**
 * Creates a new event in Google Calendar (requires full calendar scope access token)
 * and saves it to Firestore.
 */
export const createGoogleCalendarEvent = async (
    accessToken: string,
    userId: string,
    userEmail: string,
    payload: CreateEventPayload
): Promise<RhiveCalendarEvent | null> => {
    try {
        const body: any = {
            summary: payload.title,
            description: payload.description || '',
            location: payload.location || '',
        };

        if (payload.isAllDay) {
            const dateStr = payload.startDateTime.split('T')[0];
            const endDateStr = payload.endDateTime.split('T')[0];
            body.start = { date: dateStr };
            body.end = { date: endDateStr };
        } else {
            body.start = { dateTime: payload.startDateTime, timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone };
            body.end = { dateTime: payload.endDateTime, timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone };
        }

        const res = await fetch(`${CALENDAR_API_BASE}/calendars/primary/events`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            console.error('[GoogleCalendarService] Create event failed:', err);
            return null;
        }

        const googleEvent: GoogleCalendarEvent = await res.json();

        // Persist to Firestore
        const now = new Date().toISOString();
        const normalized: Omit<RhiveCalendarEvent, 'id'> = {
            userId,
            userEmail,
            googleEventId: googleEvent.id,
            title: googleEvent.summary || payload.title,
            description: payload.description || '',
            location: payload.location || '',
            startDateTime: payload.startDateTime,
            endDateTime: payload.endDateTime,
            isAllDay: payload.isAllDay || false,
            status: 'confirmed',
            googleLink: googleEvent.htmlLink || '',
            organizer: userEmail,
            syncedAt: now,
            created_at: now,
            updated_at: now,
            source: 'google',
            color: payload.color,
        };

        const docRef = await addDoc(collection(db, FIRESTORE_COLLECTION), normalized);
        return { id: docRef.id, ...normalized };
    } catch (error: any) {
        console.error('[GoogleCalendarService] createGoogleCalendarEvent error:', error);
        return null;
    }
};

/**
 * Creates a RHIVE-native event (stored only in Firestore, not pushed to Google Calendar).
 */
export const createRhiveEvent = async (
    userId: string,
    userEmail: string,
    payload: CreateEventPayload
): Promise<RhiveCalendarEvent | null> => {
    try {
        const now = new Date().toISOString();
        const normalized: Omit<RhiveCalendarEvent, 'id'> = {
            userId,
            userEmail,
            googleEventId: '',
            title: payload.title,
            description: payload.description || '',
            location: payload.location || '',
            startDateTime: payload.startDateTime,
            endDateTime: payload.endDateTime,
            isAllDay: payload.isAllDay || false,
            status: 'confirmed',
            googleLink: '',
            organizer: userEmail,
            syncedAt: now,
            created_at: now,
            updated_at: now,
            source: 'rhive',
            color: payload.color || '#ec028b',
        };

        const docRef = await addDoc(collection(db, FIRESTORE_COLLECTION), normalized);
        return { id: docRef.id, ...normalized };
    } catch (error: any) {
        console.error('[GoogleCalendarService] createRhiveEvent error:', error);
        return null;
    }
};

/**
 * Deletes a calendar event from Firestore (and optionally from Google Calendar).
 */
export const deleteCalendarEvent = async (
    eventId: string,
    googleEventId?: string,
    accessToken?: string
): Promise<void> => {
    // Delete from Firestore
    await deleteDoc(doc(db, FIRESTORE_COLLECTION, eventId));

        // Optionally delete from Google Calendar
    if (googleEventId && accessToken) {
        await fetch(`${CALENDAR_API_BASE}/calendars/primary/events/${googleEventId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${accessToken}` },
        }).catch(console.warn);
    }
};

// ─── Bidirectional Sync Additions ─────────────────────────────────────────────

/**
 * Calendar action discriminant — use this wherever you need to log or
 * dispatch a typed calendar mutation event.
 */
export type CalendarAction =
    | 'calendar_event_created'
    | 'calendar_event_updated'
    | 'calendar_event_deleted'
    | 'calendar_synced';

/** Partial update payload accepted by the Google Calendar Events.patch endpoint. */
export interface GoogleEventPatchPayload {
    summary?: string;
    description?: string;
    location?: string;
    start?: { dateTime?: string; date?: string; timeZone?: string };
    end?: { dateTime?: string; date?: string; timeZone?: string };
    status?: 'confirmed' | 'tentative' | 'cancelled';
    colorId?: string;
}

/** Result shape returned by bidiSync. */
export interface BidiSyncResult {
    added: number;
    updated: number;
    deleted: number;
    events: RhiveCalendarEvent[];
}

/**
 * PATCHes an existing event in Google Calendar.
 *
 * @param accessToken  - Valid Google OAuth2 access token with calendar scope.
 * @param googleEventId - The Google Calendar event id (event.id from the API).
 * @param payload       - Partial fields to update (summary, start, end, …).
 * @returns The updated GoogleCalendarEvent returned by the API, or null on failure.
 */
export const updateGoogleCalendarEvent = async (
    accessToken: string,
    googleEventId: string,
    payload: GoogleEventPatchPayload
): Promise<GoogleCalendarEvent | null> => {
    try {
        const res = await fetch(
            `${CALENDAR_API_BASE}/calendars/primary/events/${encodeURIComponent(googleEventId)}`,
            {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            }
        );

        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            console.error('[GoogleCalendarService] updateGoogleCalendarEvent failed:', err);
            return null;
        }

        return (await res.json()) as GoogleCalendarEvent;
    } catch (error: any) {
        console.error('[GoogleCalendarService] updateGoogleCalendarEvent error:', error);
        return null;
    }
};

/**
 * Updates a RHIVE calendar event document in Firestore.
 *
 * @param firestoreDocId - The Firestore document id inside `calendar_events`.
 * @param updates        - Partial fields to merge into the document.
 */
export const updateRhiveEvent = async (
    firestoreDocId: string,
    updates: Partial<Omit<RhiveCalendarEvent, 'id'>>
): Promise<void> => {
    try {
        const eventRef = doc(db, FIRESTORE_COLLECTION, firestoreDocId);
        await updateDoc(eventRef, {
            ...updates,
            updated_at: new Date().toISOString(),
        });
    } catch (error: any) {
        console.error('[GoogleCalendarService] updateRhiveEvent error:', error);
        throw error;
    }
};

/**
 * Sends a DELETE request to the Google Calendar API for a specific event.
 *
 * @param accessToken   - Valid Google OAuth2 access token with calendar scope.
 * @param googleEventId - The Google Calendar event id to delete.
 * @returns `true` if the deletion succeeded (204 No Content), `false` otherwise.
 */
export const deleteFromGoogleCalendar = async (
    accessToken: string,
    googleEventId: string
): Promise<boolean> => {
    try {
        const res = await fetch(
            `${CALENDAR_API_BASE}/calendars/primary/events/${encodeURIComponent(googleEventId)}`,
            {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${accessToken}` },
            }
        );

        // 204 No Content = success; 410 Gone = already deleted (treat as success)
        if (res.status === 204 || res.status === 410) {
            return true;
        }

        const err = await res.json().catch(() => ({}));
        console.error('[GoogleCalendarService] deleteFromGoogleCalendar failed:', res.status, err);
        return false;
    } catch (error: any) {
        console.error('[GoogleCalendarService] deleteFromGoogleCalendar error:', error);
        return false;
    }
};

/**
 * Bidirectional sync between Google Calendar and Firestore `calendar_events`.
 *
 * Strategy:
 *  1. Fetch the current window of Google Calendar events.
 *  2. For each Google event:
 *     - If a Firestore doc already has that googleEventId → diff title / times /
 *       location and update if anything changed.
 *     - If no Firestore doc has that googleEventId → add it as a new doc.
 *  3. For Firestore docs with source='google' whose googleEventId is NOT present
 *     in the fetched Google events list → remove them from Firestore (they were
 *     deleted or moved outside the sync window on the Google side).
 *
 * @param userId      - RHIVE user id.
 * @param userEmail   - User's email address.
 * @param accessToken - Valid Google OAuth2 access token with calendar scope.
 * @returns A BidiSyncResult summarising what was added, updated, and deleted.
 */
export const bidiSync = async (
    userId: string,
    userEmail: string,
    accessToken: string
): Promise<BidiSyncResult> => {
    // ── 1. Fetch Google events ──────────────────────────────────────────────
    const googleEvents = await fetchGoogleCalendarEvents(accessToken);

    // Build a fast lookup: googleEventId → GoogleCalendarEvent
    const googleEventMap = new Map<string, GoogleCalendarEvent>(
        googleEvents.map((e) => [e.id, e])
    );

    // ── 2. Load existing Firestore events for this user ─────────────────────
    const existingQuery = query(
        collection(db, FIRESTORE_COLLECTION),
        where('userId', '==', userId)
    );
    const existingSnap = await getDocs(existingQuery);

    // Build a fast lookup: googleEventId → { firestoreDocId, RhiveCalendarEvent }
    const firestoreMap = new Map<
        string,
        { docId: string; event: RhiveCalendarEvent }
    >();

    for (const d of existingSnap.docs) {
        const ev = { id: d.id, ...d.data() } as RhiveCalendarEvent;
        if (ev.googleEventId) {
            firestoreMap.set(ev.googleEventId, { docId: d.id, event: ev });
        }
    }

    let added = 0;
    let updated = 0;
    let deleted = 0;

    // ── 3. Process Google → Firestore (add / update) ────────────────────────
    for (const gEvent of googleEvents) {
        const existing = firestoreMap.get(gEvent.id);
        const normalized = normalizeEvent(gEvent, userId, userEmail);

        if (!existing) {
            // New event — add to Firestore
            await addDoc(collection(db, FIRESTORE_COLLECTION), normalized);
            added++;
        } else {
            // Diff the mutable fields
            const { event: stored } = existing;
            const titleChanged    = normalized.title         !== stored.title;
            const startChanged    = normalized.startDateTime !== stored.startDateTime;
            const endChanged      = normalized.endDateTime   !== stored.endDateTime;
            const locationChanged = normalized.location      !== stored.location;

            if (titleChanged || startChanged || endChanged || locationChanged) {
                const eventRef = doc(db, FIRESTORE_COLLECTION, existing.docId);
                await updateDoc(eventRef, {
                    title:         normalized.title,
                    startDateTime: normalized.startDateTime,
                    endDateTime:   normalized.endDateTime,
                    location:      normalized.location,
                    syncedAt:      normalized.syncedAt,
                    updated_at:    normalized.syncedAt,
                });
                updated++;
            }
        }
    }

    // ── 4. Remove Firestore docs whose Google event no longer exists ─────────
    for (const [gId, { docId }] of firestoreMap.entries()) {
        // Only clean up events that originated from Google
        const firestoreEvent = firestoreMap.get(gId)!.event;
        if (firestoreEvent.source === 'google' && !googleEventMap.has(gId)) {
            await deleteDoc(doc(db, FIRESTORE_COLLECTION, docId));
            deleted++;
        }
    }

    // ── 5. Re-fetch the final merged event list from Firestore ───────────────
    const finalSnap = await getDocs(
        query(
            collection(db, FIRESTORE_COLLECTION),
            where('userId', '==', userId)
        )
    );
    const events = finalSnap.docs.map(
        (d) => ({ id: d.id, ...d.data() } as RhiveCalendarEvent)
    );

    // Update user meta with the latest sync timestamp
    await updateUserCalendarMeta(userId, userEmail, events.length);

    return { added, updated, deleted, events };
};
