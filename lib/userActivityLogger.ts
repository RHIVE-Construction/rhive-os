/**
 * userActivityLogger.ts
 * Central user activity logging utility for RHIVE QOS.
 * All user actions across the platform funnel through this module
 * and are persisted to the Firestore `user_log` collection.
 */

import { userLogService } from './firebaseService';

// ─── Action Type Constants ────────────────────────────────────────────────────

export const LOG_ACTIONS = {
    // Authentication
    USER_LOGIN:           'USER_LOGIN',
    USER_LOGOUT:          'USER_LOGOUT',
    FAILED_LOGIN:         'FAILED_LOGIN',

    // Password management
    PASSWORD_CHANGED:              'PASSWORD_CHANGED',
    FORGOT_PASSWORD_REQUESTED:     'FORGOT_PASSWORD_REQUESTED',
    FORGOT_PASSWORD_OTP_SENT:      'FORGOT_PASSWORD_OTP_SENT',
    FORGOT_PASSWORD_OTP_VERIFIED:  'FORGOT_PASSWORD_OTP_VERIFIED',
    FORGOT_PASSWORD_RESET_COMPLETE:'FORGOT_PASSWORD_RESET_COMPLETE',

    // Navigation
    PAGE_VISITED:         'PAGE_VISITED',

    // Notifications
    NOTIFICATION_READ:      'NOTIFICATION_READ',
    NOTIFICATION_READ_ALL:  'NOTIFICATION_READ_ALL',

    // User management
    USER_CREATED:         'USER_CREATED',
    USER_UPDATED:         'USER_UPDATED',
    USER_DELETED:         'USER_DELETED',
    USER_ROLE_CHANGED:    'USER_ROLE_CHANGED',
} as const;

export type LogActionType = typeof LOG_ACTIONS[keyof typeof LOG_ACTIONS];

// ─── Human-readable labels for each action type ──────────────────────────────

export const LOG_ACTION_LABELS: Record<string, string> = {
    USER_LOGIN:                    'Login',
    USER_LOGOUT:                   'Logout',
    FAILED_LOGIN:                  'Failed Login',
    PASSWORD_CHANGED:              'Password Changed',
    FORGOT_PASSWORD_REQUESTED:     'Forgot Password Requested',
    FORGOT_PASSWORD_OTP_SENT:      'OTP Sent',
    FORGOT_PASSWORD_OTP_VERIFIED:  'OTP Verified',
    FORGOT_PASSWORD_RESET_COMPLETE:'Password Reset Complete',
    PAGE_VISITED:                  'Page Visited',
    NOTIFICATION_READ:             'Notification Read',
    NOTIFICATION_READ_ALL:         'All Notifications Read',
    USER_CREATED:                  'User Created',
    USER_UPDATED:                  'User Updated',
    USER_DELETED:                  'User Deleted',
    USER_ROLE_CHANGED:             'Role Changed',
    // Legacy / project events that flow through the same collection
    LOGIN:                         'Login',
    LOGOUT:                        'Logout',
    ADD_USER:                      'User Created',
    // Pipeline events
    lead_created:                  'Lead Created',
    lead_updated:                  'Lead Updated',
    project_stage_changed:         'Stage Changed',
    estimate_created:              'Estimate Created',
    estimate_updated:              'Estimate Updated',
    quote_saved:                   'Quote Saved',
    quote_approved:                'Quote Approved',
    quote_rejected:                'Quote Rejected',
    meeting_scheduled:             'Meeting Scheduled',
    meeting_updated:               'Meeting Updated',
    payment_recorded:              'Payment Recorded',
    document_uploaded:             'Document Uploaded',
    calendar_event_created:        'Calendar Event Created',
    calendar_event_updated:        'Calendar Event Updated',
    calendar_event_deleted:        'Calendar Event Deleted',
    calendar_synced:               'Calendar Synced',
};

// ─── Emoji icons per action ───────────────────────────────────────────────────

export const LOG_ACTION_ICONS: Record<string, string> = {
    USER_LOGIN:                    '🔐',
    USER_LOGOUT:                   '🚪',
    FAILED_LOGIN:                  '⛔',
    LOGIN:                         '🔐',
    LOGOUT:                        '🚪',
    PASSWORD_CHANGED:              '🔑',
    FORGOT_PASSWORD_REQUESTED:     '📧',
    FORGOT_PASSWORD_OTP_SENT:      '📱',
    FORGOT_PASSWORD_OTP_VERIFIED:  '✅',
    FORGOT_PASSWORD_RESET_COMPLETE:'🔑',
    PAGE_VISITED:                  '👁️',
    NOTIFICATION_READ:             '🔔',
    NOTIFICATION_READ_ALL:         '🔔',
    USER_CREATED:                  '🧑‍💼',
    ADD_USER:                      '🧑‍💼',
    USER_UPDATED:                  '✏️',
    USER_DELETED:                  '🗑️',
    USER_ROLE_CHANGED:             '🛡️',
    lead_created:                  '📋',
    lead_updated:                  '✏️',
    project_stage_changed:         '🔄',
    estimate_created:              '📐',
    estimate_updated:              '📐',
    quote_saved:                   '💾',
    quote_approved:                '✅',
    quote_rejected:                '❌',
    meeting_scheduled:             '📅',
    meeting_updated:               '📅',
    payment_recorded:              '💰',
    document_uploaded:             '📎',
    calendar_event_created:        '📅',
    calendar_event_updated:        '✏️',
    calendar_event_deleted:        '🗑️',
    calendar_synced:               '🔄',
};

// ─── Severity color mapping ───────────────────────────────────────────────────

export type LogSeverity = 'info' | 'warning' | 'danger' | 'success' | 'muted';

export const LOG_ACTION_SEVERITY: Record<string, LogSeverity> = {
    USER_LOGIN:                    'success',
    LOGIN:                         'success',
    USER_LOGOUT:                   'muted',
    LOGOUT:                        'muted',
    FAILED_LOGIN:                  'danger',
    PASSWORD_CHANGED:              'warning',
    FORGOT_PASSWORD_REQUESTED:     'warning',
    FORGOT_PASSWORD_OTP_SENT:      'info',
    FORGOT_PASSWORD_OTP_VERIFIED:  'info',
    FORGOT_PASSWORD_RESET_COMPLETE:'success',
    PAGE_VISITED:                  'muted',
    NOTIFICATION_READ:             'muted',
    NOTIFICATION_READ_ALL:         'muted',
    USER_CREATED:                  'info',
    ADD_USER:                      'info',
    USER_UPDATED:                  'info',
    USER_DELETED:                  'danger',
    USER_ROLE_CHANGED:             'warning',
};

// ─── Main logger function ─────────────────────────────────────────────────────

/**
 * Log a user activity event to the Firestore `user_log` collection.
 * Automatically reads the current user from session.
 *
 * @param actionType  One of LOG_ACTIONS constants
 * @param description Human-readable description of the event
 * @param payload     Optional contextual data (page ID, error reason, etc.)
 * @param userContext Optional override for user context (use for pre-auth events like FAILED_LOGIN)
 */
export async function logUserActivity(
    actionType: string,
    description: string,
    payload?: Record<string, any>,
    userContext?: { id: string; name: string; role: string }
): Promise<void> {
    try {
        await userLogService.logAction(actionType, description, payload, userContext);
    } catch {
        // Never throw — logging must never crash the app
    }
}

// ─── Page ID to human-readable name map ──────────────────────────────────────

export const PAGE_NAMES: Record<string, string> = {
    'P-00':    'Public Homepage',
    'P-00-V2': 'Homepage V2',
    'P-00-V3': 'Homepage V3',
    'P-01':    'About Us',
    'P-02':    'Our Services',
    'P-03':    'Our Process',
    'P-04':    'Financing',
    'P-05':    'Contact',
    'P-06':    'Login',
    'P-07':    'Password Reset',
    'P-09':    'Contractor Signup',
    'P-10':    'Public Careers',
    'P-11':    'Job Application',
    'estimate-tool': 'Estimate Tool',
    'P-12':    'Estimate Tool',
    'P-13':    'Insurance',
    'P-14':    'Maintenance',
    'P-Landing': 'Landing Page',
    'A-01':    'Admin Dashboard',
    'A-02':    'User Management',
    'A-LOGS':  'User Activity Logs',
    'A-03':    'Estimate Pricing',
    'A-04':    'Estimate API',
    'A-05':    'Line Item Master',
    'A-06':    'Line Item Profile',
    'E-01':    'Employee Dashboard',
    'E-02a':   'New Project',
    'E-04':    'Calendar',
    'E-05':    'Pipeline Overview',
    'E-06':    'Project Map',
    'E-08':    'Account Profile',
    'E-10':    'Contact Profile',
    'E-12':    'Property Profile',
    'E-14':    'Project Hub',
    'E-15':    'Project Profile',
    'E-16':    'Income Actionator',
    'E-18':    'Report Builder',
    'E-19':    'Line Item Catalog',
    'E-21':    'My Info',
    'E-22':    'Time Off',
    'E-23':    'Quote Builder',
    'E-24':    'Contacts & Vendors',
    'E-25':    'Vendor Profile',
    'E-26':    'Stage 1: Lead',
    'E-27':    'Stage 2: Estimate',
    'E-28':    'Stage 3: Quote',
    'E-29':    'Stage 4: Sign & Verify',
    'E-30':    'Stage 5: Schedule',
    'E-31':    'Stage 6: Pre-Install',
    'E-32':    'Stage 7: Install',
    'E-33':    'Stage 8: Punch List',
    'E-34':    'Stage 9: Invoicing',
    'E-35':    'Stage 9b: Payments',
    'E-36':    'Stage 10: Completed',
    'E-37':    'Stage 11: Past Customer',
    'E-38':    'Weather Guide',
    'E-TRASH': 'Trash Bin',
    'C-01':    'Customer Homepage',
    'C-02':    'My Projects',
    'C-03':    'Project Profile',
    'C-Tracker': 'Customer Tracker',
    'CO-01':   'Contractor Homepage',
    'CO-03':   'Contractor Profile & Docs',
    'CO-05':   'Available Jobs',
    'CO-07':   'My Payments',
    'S-01':    'Supplier Homepage',
    'S-04':    'Company Profile',
    'SA-01':   'Role Management',
};
