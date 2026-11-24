/**
 * RHIVE Per-User Email Connection & Sync Service
 * ─────────────────────────────────────────────────────────────────────────────
 * Allows each RHIVE org user (Admin, Super Admin, Employee) to connect their
 * own Google Workspace email via Firebase Auth (signInWithPopup + GoogleAuthProvider),
 * choose whether to "Share your emails" with the org, sync their Gmail inbox,
 * and send directly from their connected account.
 */

import { auth, db } from '../lib/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc, deleteDoc, collection } from 'firebase/firestore';

export interface UserEmailSettings {
    userId: string;
    provider: 'google' | 'microsoft';
    connectedEmail: string;
    displayName?: string;
    shareEmails: boolean;
    connectedAt: string;
    lastSyncedAt?: string;
}

const GMAIL_SCOPES = [
    'https://www.googleapis.com/auth/gmail.readonly',
    'https://www.googleapis.com/auth/gmail.send',
];
const GMAIL_API_BASE = 'https://gmail.googleapis.com/gmail/v1/users/me';
const SETTINGS_COLLECTION = 'user_email_settings';

// Session-scoped OAuth access token cache (never stored permanently in Firestore)
const SESSION_TOKEN_PREFIX = 'rhive_gmail_token_';

export const getCachedGmailToken = (userId: string): string | null => {
    try {
        const raw = sessionStorage.getItem(`${SESSION_TOKEN_PREFIX}${userId}`);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (parsed.expiresAt && Date.now() < parsed.expiresAt) {
            return parsed.token;
        }
        sessionStorage.removeItem(`${SESSION_TOKEN_PREFIX}${userId}`);
    } catch { /* ignore */ }
    return null;
};

const cacheGmailToken = (userId: string, token: string) => {
    try {
        sessionStorage.setItem(
            `${SESSION_TOKEN_PREFIX}${userId}`,
            JSON.stringify({ token, expiresAt: Date.now() + 50 * 60 * 1000 })
        );
    } catch { /* ignore */ }
};

export const clearCachedGmailToken = (userId: string) => {
    try {
        sessionStorage.removeItem(`${SESSION_TOKEN_PREFIX}${userId}`);
    } catch { /* ignore */ }
};

/**
 * Load a user's saved email connection settings from Firestore.
 */
export const getUserEmailSettings = async (userId: string): Promise<UserEmailSettings | null> => {
    if (!userId) return null;
    try {
        const snap = await getDoc(doc(db, SETTINGS_COLLECTION, userId));
        if (!snap.exists()) return null;
        return snap.data() as UserEmailSettings;
    } catch (err) {
        console.warn('[googleEmailService.getUserEmailSettings] Error:', err);
        return null;
    }
};

/**
 * Update the "Share your emails" toggle (or other preference) for an org user.
 */
export const updateUserEmailSharing = async (
    userId: string,
    shareEmails: boolean
): Promise<{ success: boolean; error?: string }> => {
    try {
        await setDoc(
            doc(db, SETTINGS_COLLECTION, userId),
            { shareEmails, updatedAt: new Date().toISOString() },
            { merge: true }
        );
        return { success: true };
    } catch (err: any) {
        console.error('[googleEmailService.updateUserEmailSharing] Error:', err);
        return { success: false, error: err.message };
    }
};

/**
 * Connect an org user's Google Workspace account via OAuth popup.
 */
export const connectUserGoogleEmail = async (
    userId: string,
    emailHint?: string,
    shareEmails = true
): Promise<{ success: boolean; settings?: UserEmailSettings; accessToken?: string; error?: string }> => {
    try {
        const provider = new GoogleAuthProvider();
        GMAIL_SCOPES.forEach(scope => provider.addScope(scope));
        provider.setCustomParameters({
            ...(emailHint ? { login_hint: emailHint } : {}),
            prompt: 'select_account consent',
        });

        const result = await signInWithPopup(auth, provider);
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const accessToken = credential?.accessToken;

        if (!accessToken) {
            return { success: false, error: 'Google did not return an OAuth access token. Please try again.' };
        }

        const connectedEmail = result.user.email || emailHint || '';
        const displayName = result.user.displayName || connectedEmail.split('@')[0];

        const settings: UserEmailSettings = {
            userId,
            provider: 'google',
            connectedEmail,
            displayName,
            shareEmails,
            connectedAt: new Date().toISOString(),
        };

        await setDoc(doc(db, SETTINGS_COLLECTION, userId), settings, { merge: true });
        cacheGmailToken(userId, accessToken);

        return { success: true, settings, accessToken };
    } catch (err: any) {
        const code = err?.code || '';
        if (code === 'auth/popup-closed-by-user') {
            return { success: false, error: 'Sign-in popup was closed before completing.' };
        }
        return { success: false, error: err?.message || 'Failed to connect Google email.' };
    }
};

/**
 * Disconnect a user's connected email account.
 */
export const disconnectUserEmail = async (userId: string): Promise<{ success: boolean; error?: string }> => {
    try {
        await deleteDoc(doc(db, SETTINGS_COLLECTION, userId));
        clearCachedGmailToken(userId);
        return { success: true };
    } catch (err: any) {
        return { success: false, error: err?.message || 'Failed to disconnect email.' };
    }
};

/**
 * Decode Gmail base64url payload safely.
 */
const decodeBase64Url = (data?: string): string => {
    if (!data) return '';
    try {
        const normalized = data.replace(/-/g, '+').replace(/_/g, '/');
        const binary = atob(normalized);
        const bytes = Uint8Array.from(binary, c => c.charCodeAt(0));
        return new TextDecoder('utf-8').decode(bytes);
    } catch {
        return '';
    }
};

const extractPlainBody = (payload: any): string => {
    if (!payload) return '';
    if (payload.mimeType === 'text/plain' && payload.body?.data) {
        return decodeBase64Url(payload.body.data);
    }
    if (Array.isArray(payload.parts)) {
        const textPart = payload.parts.find((p: any) => p.mimeType === 'text/plain' && p.body?.data);
        if (textPart) return decodeBase64Url(textPart.body.data);
        for (const part of payload.parts) {
            const nested = extractPlainBody(part);
            if (nested) return nested;
        }
    }
    if (payload.body?.data) {
        return decodeBase64Url(payload.body.data).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    }
    return '';
};

/**
 * Sync the connected user's latest Gmail inbox messages into Firestore `inbox_messages`
 * tagged with `owner_user_id` and `is_shared` based on their preference.
 */
export const syncConnectedUserGmail = async (
    userId: string,
    settings: UserEmailSettings,
    accessToken?: string,
    maxResults = 15
): Promise<{ success: boolean; importedCount: number; error?: string }> => {
    try {
        let token = accessToken || getCachedGmailToken(userId);
        if (!token) {
            const reconnect = await connectUserGoogleEmail(userId, settings.connectedEmail, settings.shareEmails);
            if (!reconnect.success || !reconnect.accessToken) {
                return { success: false, importedCount: 0, error: reconnect.error || 'Re-authentication required.' };
            }
            token = reconnect.accessToken;
        }

        const listRes = await fetch(
            `${GMAIL_API_BASE}/messages?labelIds=INBOX&maxResults=${maxResults}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!listRes.ok) {
            const errJson = await listRes.json().catch(() => ({}));
            const errMsg = errJson?.error?.message || `Gmail API error (${listRes.status})`;
            return { success: false, importedCount: 0, error: errMsg };
        }

        const listData = await listRes.json();
        const messageStubs: Array<{ id: string }> = listData.messages || [];
        let importedCount = 0;

        for (const stub of messageStubs) {
            const docId = `gmail_${userId}_${stub.id}`;
            const docRef = doc(collection(db, 'inbox_messages'), docId);
            const existing = await getDoc(docRef);
            if (existing.exists()) continue;

            const msgRes = await fetch(`${GMAIL_API_BASE}/messages/${stub.id}?format=full`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!msgRes.ok) continue;
            const msgData = await msgRes.json();

            const headers: Array<{ name: string; value: string }> = msgData.payload?.headers || [];
            const getHeader = (name: string) =>
                headers.find(h => h.name.toLowerCase() === name.toLowerCase())?.value || '';

            const fromRaw = getHeader('From');
            const emailMatch = fromRaw.match(/<([^>]+)>/);
            const senderEmail = (emailMatch ? emailMatch[1] : fromRaw).trim().toLowerCase();
            const senderName = (emailMatch ? fromRaw.replace(/<[^>]+>/, '').replace(/"/g, '').trim() : senderEmail.split('@')[0]) || 'Unknown Sender';

            if (senderEmail.includes('mailer-daemon') || senderEmail.includes('postmaster@')) continue;

            const subject = getHeader('Subject') || '(No Subject)';
            const dateRaw = getHeader('Date');
            const msgDate = dateRaw ? new Date(dateRaw) : new Date(Number(msgData.internalDate) || Date.now());
            const isToday = msgDate.toDateString() === new Date().toDateString();
            const displayTime = isToday
                ? msgDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
                : msgDate.toLocaleDateString([], { month: 'short', day: 'numeric' });

            const bodyText = (extractPlainBody(msgData.payload) || msgData.snippet || '(Empty Email)').slice(0, 4000);

            await setDoc(docRef, {
                channel: 'email',
                direction: 'inbound',
                folder: 'inbox',
                senderName,
                senderEmail: senderEmail || null,
                senderPhone: null,
                recipientName: settings.displayName || settings.connectedEmail,
                recipientEmail: settings.connectedEmail,
                subject,
                body: bodyText,
                timestamp: displayTime,
                created_at: msgDate.toISOString(),
                unread: Array.isArray(msgData.labelIds) ? msgData.labelIds.includes('UNREAD') : true,
                client_id: null,
                client_name: senderName,
                campus_name: null,
                assigned_to: settings.displayName || settings.connectedEmail,
                delivery_status: 'received',
                external_id: stub.id,
                source: 'gmail_oauth',
                owner_user_id: userId,
                is_shared: settings.shareEmails,
            });
            importedCount++;
        }

        await setDoc(
            doc(db, SETTINGS_COLLECTION, userId),
            { lastSyncedAt: new Date().toISOString() },
            { merge: true }
        );

        return { success: true, importedCount };
    } catch (err: any) {
        console.error('[googleEmailService.syncConnectedUserGmail] Error:', err);
        return { success: false, importedCount: 0, error: err?.message || 'Gmail sync failed.' };
    }
};
