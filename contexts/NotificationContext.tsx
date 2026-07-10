import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
    collection, query, where, orderBy, onSnapshot, doc, updateDoc, writeBatch, getDocs
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { userLogService } from '../lib/firebaseService';
import { session } from '../lib/session';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ActivityNotification {
    id: string;
    userId: string;
    userName: string;
    userRole: string;
    actionType: string;
    description: string;
    payload?: Record<string, any>;
    timestamp: string;
    read: boolean;
    created_at?: string;
}

interface NotificationContextType {
    notifications: ActivityNotification[];
    unreadCount: number;
    logActivity: (
        actionType: string,
        description: string,
        payload?: Record<string, any>
    ) => Promise<void>;
    markRead: (id: string) => Promise<void>;
    markUnread: (id: string) => Promise<void>;
    markAllRead: () => Promise<void>;
    isLoading: boolean;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// ─── Icon map for action types ────────────────────────────────────────────────

export const ACTIVITY_ICONS: Record<string, string> = {
    user_login:            '🔐',
    user_logout:           '🚪',
    lead_created:          '📋',
    lead_updated:          '✏️',
    project_stage_changed: '🔄',
    estimate_created:      '📐',
    estimate_updated:      '📐',
    quote_saved:           '💾',
    quote_approved:        '✅',
    quote_rejected:        '❌',
    meeting_scheduled:     '📅',
    meeting_updated:       '📅',
    contact_created:       '👤',
    contact_updated:       '👤',
    message_sent:          '💬',
    payment_recorded:      '💰',
    document_uploaded:     '📎',
    user_created:          '🧑‍💼',
    user_role_changed:     '🛡️',
    page_visited:          '👁️',
};

export const getActivityIcon = (actionType: string) =>
    ACTIVITY_ICONS[actionType] || '🔔';

// ─── Project-only action types (what appears in the notification feed) ──────────
// Strictly project/pipeline events only — no user management, no property admin, no comms noise.
const PROJECT_ACTION_TYPES = new Set([
    // Project lifecycle
    'CREATE_PROJECT', 'STAGE_CHANGE', 'SAVE_QUOTE', 'APPROVE_QUOTE',
    // Standardized lower-case keys
    'lead_created', 'lead_updated', 'project_stage_changed',
    'estimate_created', 'estimate_updated',
    'quote_saved', 'quote_approved', 'quote_rejected',
    'meeting_scheduled', 'meeting_updated',
    'payment_recorded', 'document_uploaded',
    'MEETING_SCHEDULED', 'APPOINTMENT_BOOKED',
]);

const isProjectAction = (actionType: string) =>
    PROJECT_ACTION_TYPES.has(actionType) ||
    PROJECT_ACTION_TYPES.has(actionType?.toUpperCase()) ||
    PROJECT_ACTION_TYPES.has(actionType?.toLowerCase());

// ─── Provider ─────────────────────────────────────────────────────────────────

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [notifications, setNotifications] = useState<ActivityNotification[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Get current user from session
    const currentUser = session.read();
    const userId = currentUser?.id;
    const userRole = currentUser?.role;

    useEffect(() => {
        if (!userId) {
            setNotifications([]);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);

        // Admin/Super Admin see all activity; others see only their own
        const isAdmin = userRole === 'Admin' || userRole === 'Super Admin';

        let q;
        if (isAdmin) {
            // All activity, sorted newest first
            q = query(
                collection(db, 'user_log'),
                orderBy('timestamp', 'desc')
            );
        } else {
            // Only this user's activity
            q = query(
                collection(db, 'user_log'),
                where('userId', '==', userId),
                orderBy('timestamp', 'desc')
            );
        }

        const unsub = onSnapshot(
            q,
            (snap) => {
                const docs = snap.docs
                    .map(d => ({ id: d.id, ...d.data() } as ActivityNotification))
                    // Only surface pipeline-relevant activity — no login/logout/page_visit noise
                    .filter(n => isProjectAction(n.actionType));
                // Keep only the most recent 50
                setNotifications(docs.slice(0, 50));
                setIsLoading(false);
            },
            (error) => {
                console.warn('[NotificationContext] Firestore error:', error.code, error.message);
                // Graceful fallback — no crash
                setNotifications([]);
                setIsLoading(false);
            }
        );

        return () => unsub();
    }, [userId, userRole]);

    // Log a new activity to user_log
    const logActivity = useCallback(async (
        actionType: string,
        description: string,
        payload?: Record<string, any>
    ) => {
        await userLogService.logAction(actionType, description, payload);
    }, []);

    // Mark a single notification as read
    const markRead = useCallback(async (id: string) => {
        try {
            await updateDoc(doc(db, 'user_log', id), { read: true });
            setNotifications(prev =>
                prev.map(n => n.id === id ? { ...n, read: true } : n)
            );
        } catch (err) {
            console.warn('[NotificationContext] markRead error:', err);
        }
    }, []);

    // Mark a single notification as unread
    const markUnread = useCallback(async (id: string) => {
        try {
            await updateDoc(doc(db, 'user_log', id), { read: false });
            setNotifications(prev =>
                prev.map(n => n.id === id ? { ...n, read: false } : n)
            );
        } catch (err) {
            console.warn('[NotificationContext] markUnread error:', err);
        }
    }, []);

    // Mark all unread notifications as read for this user
    const markAllRead = useCallback(async () => {
        try {
            const unread = notifications.filter(n => !n.read);
            if (unread.length === 0) return;

            const batch = writeBatch(db);
            unread.forEach(n => {
                batch.update(doc(db, 'user_log', n.id), { read: true });
            });
            await batch.commit();

            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        } catch (err) {
            console.warn('[NotificationContext] markAllRead error:', err);
        }
    }, [notifications]);

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <NotificationContext.Provider value={{
            notifications,
            unreadCount,
            logActivity,
            markRead,
            markUnread,
            markAllRead,
            isLoading
        }}>
            {children}
        </NotificationContext.Provider>
    );
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useNotifications = () => {
    const ctx = useContext(NotificationContext);
    if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
    return ctx;
};
