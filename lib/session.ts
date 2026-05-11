
/**
 * Session Manager — module-level singleton.
 * Reads/writes session data BEFORE React initializes, eliminating all timing issues.
 * 24-hour sliding window: reset on every login and every user activity.
 */

const USER_KEY   = 'rhive_session_user';
const EXPIRY_KEY = 'rhive_session_expiry';
const DURATION   = 24 * 60 * 60 * 1000; // 24 hours in ms

function readSession(): any | null {
    try {
        const saved  = localStorage.getItem(USER_KEY);
        const expiry = localStorage.getItem(EXPIRY_KEY);
        if (saved && expiry && Date.now() < Number(expiry)) {
            return JSON.parse(saved);
        }
    } catch { /* ignore */ }
    clearSession();
    return null;
}

function writeSession(user: any): void {
    try {
        localStorage.setItem(USER_KEY,   JSON.stringify(user));
        localStorage.setItem(EXPIRY_KEY, String(Date.now() + DURATION));
    } catch { /* ignore */ }
}

function refreshSession(): void {
    try {
        if (localStorage.getItem(USER_KEY)) {
            localStorage.setItem(EXPIRY_KEY, String(Date.now() + DURATION));
        }
    } catch { /* ignore */ }
}

function clearSession(): void {
    try {
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem(EXPIRY_KEY);
    } catch { /* ignore */ }
}

// Read once at MODULE LOAD TIME — before React renders anything.
// This is the initial user value passed directly into useState().
const initialUser: any | null = readSession();

export const session = { read: readSession, write: writeSession, refresh: refreshSession, clear: clearSession };
export { initialUser };
