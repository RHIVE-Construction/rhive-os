/**
 * emailService.ts
 *
 * Sends transactional emails by writing documents to the Firestore `mail`
 * collection. The Firebase "Trigger Email from Firestore" extension watches
 * this collection and dispatches emails via the configured SMTP provider.
 *
 * Extension docs: https://extensions.dev/extensions/firebase/firestore-send-email
 *
 * Document schema expected by the extension:
 * {
 *   to: string | string[],
 *   from?: string,          // optional override
 *   replyTo?: string,
 *   message: {
 *     subject: string,
 *     html?: string,
 *     text?: string,
 *   },
 *   // OR use a named template:
 *   template?: { name: string, data: Record<string, any> }
 * }
 *
 * The extension adds a `delivery` field to track status:
 *   { state: 'PENDING' | 'PROCESSING' | 'SUCCESS' | 'ERROR', ... }
 */

import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

const MAIL_COLLECTION = 'mail';
const FROM_ADDRESS = 'RHIVE Support <noreply@rhiveconstruction.com>';
const APP_URL = typeof window !== 'undefined'
    ? window.location.origin
    : 'https://app.rhiveconstruction.com';

/**
 * TEMPORARY TEST RECIPIENT
 * All notification emails are CC'd / redirected here during testing.
 * Remove or set to undefined once the extension OAuth credentials are
 * fully verified and production email routing is confirmed.
 */
const TEMP_TEST_RECIPIENT = 'james.g@rhiveconstruction.com';

// ─── Types ───────────────────────────────────────────────────────────────────

interface MailMessage {
    subject: string;
    html: string;
    text: string;
}

interface MailDocument {
    to: string | string[];
    from: string;
    replyTo?: string;
    message: MailMessage;
    createdAt: any;
}

// ─── Internal helper ─────────────────────────────────────────────────────────

async function queueEmail(doc: Omit<MailDocument, 'createdAt'>): Promise<{ success: boolean; id?: string; error?: string }> {
    try {
        const ref = await addDoc(collection(db, MAIL_COLLECTION), {
            ...doc,
            createdAt: serverTimestamp(),
        });
        return { success: true, id: ref.id };
    } catch (error: any) {
        console.error('[emailService] Failed to queue email:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Resolves the actual recipient.
 * During testing, always routes to TEMP_TEST_RECIPIENT.
 * In production (when TEMP_TEST_RECIPIENT is undefined), uses the real address.
 */
function resolveRecipient(intended: string | string[]): string | string[] {
    if (TEMP_TEST_RECIPIENT) return TEMP_TEST_RECIPIENT;
    return intended;
}

// ─── Shared HTML Template Shell ───────────────────────────────────────────────

function buildEmailHtml(opts: {
    title: string;
    subtitle?: string;
    bodyHtml: string;
    footerNote?: string;
}): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${opts.title} — RHIVE Construction</title>
</head>
<body style="margin:0;padding:0;background:#050505;font-family:'Rubik',Arial,sans-serif;color:#f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#050505;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#0a0a0a;border:1px solid #374151;border-radius:4px;overflow:hidden;max-width:560px;">
          <!-- Top bar -->
          <tr><td style="background:#ec028b;padding:4px 0;"></td></tr>
          <!-- Branding -->
          <tr>
            <td style="padding:32px 36px 20px;">
              <h1 style="margin:0 0 4px;font-size:22px;font-weight:800;letter-spacing:-0.5px;color:#ffffff;">
                RHIVE <span style="color:#ec028b;">Construction</span>
              </h1>
              <p style="margin:0;font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#6b7280;">
                ${opts.subtitle || 'Internal Notification'}
              </p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:0 36px 32px;">
              ${opts.bodyHtml}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:20px 36px;border-top:1px solid #1f2937;">
              <p style="margin:0;font-size:11px;color:#4b5563;">
                RHIVE Construction · Brisbane, QLD · Australia<br/>
                ${opts.footerNote ? `<span style="color:#6b7280;">${opts.footerNote}</span><br/>` : ''}
                <a href="mailto:support@rhiveconstruction.com" style="color:#6b7280;text-decoration:none;">
                  support@rhiveconstruction.com
                </a>
              </p>
            </td>
          </tr>
          <!-- Bottom bar -->
          <tr><td style="background:#ec028b;padding:2px 0;"></td></tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`.trim();
}

// ─── Public API ──────────────────────────────────────────────────────────────

export const emailService = {
    /**
     * Sends a password reset link email.
     * Called after a reset token is created in the `users` collection.
     */
    sendPasswordReset: async (recipientEmail: string, resetToken: string) => {
        const resetLink = `${APP_URL}/?page=P-07&token=${resetToken}`;

        const bodyHtml = `
<p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#d1d5db;">
  You requested a password reset for your RHIVE account.
</p>
<p style="margin:0 0 28px;font-size:14px;line-height:1.6;color:#9ca3af;">
  Click the button below to set a new password. This link expires in
  <strong style="color:#f3f4f6;">1 hour</strong>.
</p>
<table cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
  <tr>
    <td style="background:#ec028b;border-radius:3px;">
      <a href="${resetLink}"
         style="display:inline-block;padding:14px 28px;color:#ffffff;font-size:13px;font-weight:800;text-decoration:none;letter-spacing:1px;text-transform:uppercase;">
        Reset My Password →
      </a>
    </td>
  </tr>
</table>
<p style="margin:0 0 8px;font-size:12px;color:#6b7280;">Or copy and paste this URL into your browser:</p>
<p style="margin:0 0 32px;font-size:11px;word-break:break-all;">
  <a href="${resetLink}" style="color:#ec028b;text-decoration:none;">${resetLink}</a>
</p>
<table width="100%" cellpadding="0" cellspacing="0" style="background:#111827;border-left:3px solid #ec028b;border-radius:0 4px 4px 0;">
  <tr>
    <td style="padding:14px 16px;">
      <p style="margin:0;font-size:12px;color:#9ca3af;line-height:1.5;">
        🔒 <strong style="color:#f3f4f6;">Didn't request this?</strong>
        You can safely ignore this email. Your password will remain unchanged.
      </p>
    </td>
  </tr>
</table>`;

        return queueEmail({
            to: resolveRecipient(recipientEmail),
            from: FROM_ADDRESS,
            message: {
                subject: 'Password Reset Request — RHIVE Construction',
                text: [
                    'You requested a password reset for your RHIVE Construction account.',
                    '',
                    'Click the link below to set a new password. This link expires in 1 hour.',
                    '',
                    resetLink,
                    '',
                    'If you did not request this, you can safely ignore this email.',
                    '',
                    '— RHIVE Support Team',
                ].join('\n'),
                html: buildEmailHtml({
                    title: 'Password Reset',
                    subtitle: 'Secure Account Recovery',
                    bodyHtml,
                }),
            },
        });
    },

    /**
     * Sends a "your password was changed" security confirmation.
     * Called immediately after a successful password reset or in-app password change.
     */
    sendPasswordChangedConfirmation: async (recipientEmail: string, userName?: string) => {
        const displayName = userName || 'Team Member';
        const now = new Date().toLocaleString('en-AU', {
            timeZone: 'Australia/Brisbane',
            dateStyle: 'full',
            timeStyle: 'short',
        });

        const bodyHtml = `
<p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#d1d5db;">
  Hi ${displayName},
</p>
<p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#d1d5db;">
  Your RHIVE Construction account password was successfully changed.
</p>
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0f1621;border:1px solid #1f2937;border-radius:6px;margin-bottom:28px;">
  <tr>
    <td style="padding:16px 20px;">
      <p style="margin:0 0 4px;font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#6b7280;">Changed At</p>
      <p style="margin:0;font-size:14px;color:#f3f4f6;font-weight:700;">${now}</p>
    </td>
  </tr>
</table>
<table width="100%" cellpadding="0" cellspacing="0" style="background:#111827;border-left:3px solid #ec028b;border-radius:0 4px 4px 0;margin-bottom:24px;">
  <tr>
    <td style="padding:14px 16px;">
      <p style="margin:0;font-size:12px;color:#9ca3af;line-height:1.5;">
        🔒 <strong style="color:#f3f4f6;">Wasn't you?</strong>
        If you did not make this change, contact your system administrator immediately at
        <a href="mailto:support@rhiveconstruction.com" style="color:#ec028b;">support@rhiveconstruction.com</a>.
      </p>
    </td>
  </tr>
</table>
<table cellpadding="0" cellspacing="0">
  <tr>
    <td style="background:#ec028b;border-radius:3px;">
      <a href="${APP_URL}"
         style="display:inline-block;padding:12px 24px;color:#ffffff;font-size:13px;font-weight:800;text-decoration:none;letter-spacing:1px;text-transform:uppercase;">
        Go to RHIVE →
      </a>
    </td>
  </tr>
</table>`;

        return queueEmail({
            to: resolveRecipient(recipientEmail),
            from: FROM_ADDRESS,
            message: {
                subject: 'Password Changed Successfully — RHIVE Construction',
                text: [
                    `Hi ${displayName},`,
                    '',
                    'Your RHIVE Construction account password was successfully changed.',
                    `Changed at: ${now}`,
                    '',
                    "If you did not make this change, contact your system administrator immediately.",
                    '',
                    '— RHIVE Support Team',
                ].join('\n'),
                html: buildEmailHtml({
                    title: 'Password Changed',
                    subtitle: 'Security Notification',
                    bodyHtml,
                    footerNote: 'This is an automated security alert.',
                }),
            },
        });
    },

    /**
     * Sends a follow-up scheduled notification to the assigned employee.
     * Called when a follow-up is saved from FollowUpModal.
     */
    sendFollowUpScheduled: async (opts: {
        assigneeEmail: string;
        assigneeName?: string;
        leadName: string;
        followUpDate: string;   // YYYY-MM-DD
        followUpTime?: string;  // HH:MM
        followUpType?: string;  // 'call' | 'visit'
        notes?: string;
        stage?: string;
    }) => {
        const {
            assigneeEmail,
            assigneeName = 'Team Member',
            leadName,
            followUpDate,
            followUpTime = '',
            followUpType = 'call',
            notes = '',
            stage = 'Lead',
        } = opts;

        const typeLabel = followUpType === 'visit' ? 'Site Visit' : 'Phone Call';
        const dateDisplay = new Date(followUpDate + 'T12:00:00').toLocaleDateString('en-AU', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
        });
        const timeDisplay = followUpTime
            ? new Date(`1970-01-01T${followUpTime}`).toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' })
            : '';

        const bodyHtml = `
<p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#d1d5db;">
  Hi ${assigneeName},
</p>
<p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#d1d5db;">
  A follow-up has been scheduled for one of your leads.
</p>
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0f1621;border:1px solid #1f2937;border-radius:6px;margin-bottom:28px;overflow:hidden;">
  <tr><td style="background:#ec028b;padding:2px 0;"></td></tr>
  <tr>
    <td style="padding:20px 24px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding-bottom:14px;border-bottom:1px solid #1f2937;">
            <p style="margin:0 0 3px;font-size:10px;text-transform:uppercase;letter-spacing:2px;color:#6b7280;">Lead / Project</p>
            <p style="margin:0;font-size:16px;color:#ffffff;font-weight:800;">${leadName}</p>
          </td>
        </tr>
        <tr>
          <td style="padding-top:14px;padding-bottom:14px;border-bottom:1px solid #1f2937;">
            <p style="margin:0 0 3px;font-size:10px;text-transform:uppercase;letter-spacing:2px;color:#6b7280;">Follow-Up Type</p>
            <p style="margin:0;font-size:14px;color:#f3f4f6;font-weight:700;">${typeLabel}</p>
          </td>
        </tr>
        <tr>
          <td style="padding-top:14px;padding-bottom:14px;border-bottom:1px solid #1f2937;">
            <p style="margin:0 0 3px;font-size:10px;text-transform:uppercase;letter-spacing:2px;color:#6b7280;">Scheduled For</p>
            <p style="margin:0;font-size:14px;color:#f3f4f6;font-weight:700;">${dateDisplay}${timeDisplay ? ` at ${timeDisplay}` : ''}</p>
          </td>
        </tr>
        <tr>
          <td style="padding-top:14px;padding-bottom:14px;border-bottom:1px solid #1f2937;">
            <p style="margin:0 0 3px;font-size:10px;text-transform:uppercase;letter-spacing:2px;color:#6b7280;">Pipeline Stage</p>
            <p style="margin:0;font-size:14px;color:#f3f4f6;font-weight:700;">${stage}</p>
          </td>
        </tr>
        ${notes ? `
        <tr>
          <td style="padding-top:14px;">
            <p style="margin:0 0 3px;font-size:10px;text-transform:uppercase;letter-spacing:2px;color:#6b7280;">Notes</p>
            <p style="margin:0;font-size:14px;color:#d1d5db;line-height:1.6;">${notes.replace(/\n/g, '<br/>')}</p>
          </td>
        </tr>` : ''}
      </table>
    </td>
  </tr>
</table>
<table cellpadding="0" cellspacing="0">
  <tr>
    <td style="background:#ec028b;border-radius:3px;">
      <a href="${APP_URL}"
         style="display:inline-block;padding:12px 24px;color:#ffffff;font-size:13px;font-weight:800;text-decoration:none;letter-spacing:1px;text-transform:uppercase;">
        Open RHIVE →
      </a>
    </td>
  </tr>
</table>`;

        return queueEmail({
            to: resolveRecipient(assigneeEmail),
            from: FROM_ADDRESS,
            message: {
                subject: `Follow-up Scheduled: ${leadName} — RHIVE`,
                text: [
                    `Hi ${assigneeName},`,
                    '',
                    `A follow-up has been scheduled for: ${leadName}`,
                    `Type: ${typeLabel}`,
                    `Date: ${dateDisplay}${timeDisplay ? ` at ${timeDisplay}` : ''}`,
                    `Stage: ${stage}`,
                    notes ? `Notes: ${notes}` : '',
                    '',
                    '— RHIVE Construction',
                ].filter(Boolean).join('\n'),
                html: buildEmailHtml({
                    title: `Follow-up Scheduled: ${leadName}`,
                    subtitle: 'Sales Pipeline Notification',
                    bodyHtml,
                }),
            },
        });
    },

    /**
     * Sends a 24-hour reminder for an upcoming follow-up.
     * Called by the Cloud Function daily cron.
     */
    sendUpcomingFollowUpReminder: async (opts: {
        assigneeEmail: string;
        assigneeName?: string;
        leadName: string;
        followUpDate: string;
        followUpTime?: string;
        followUpType?: string;
        notes?: string;
    }) => {
        const {
            assigneeEmail,
            assigneeName = 'Team Member',
            leadName,
            followUpDate,
            followUpTime = '',
            followUpType = 'call',
            notes = '',
        } = opts;

        const typeLabel = followUpType === 'visit' ? 'Site Visit' : 'Phone Call';
        const dateDisplay = new Date(followUpDate + 'T12:00:00').toLocaleDateString('en-AU', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
        });
        const timeDisplay = followUpTime
            ? new Date(`1970-01-01T${followUpTime}`).toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' })
            : '';

        const bodyHtml = `
<p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#d1d5db;">
  Hi ${assigneeName},
</p>
<p style="margin:0 0 8px;font-size:15px;line-height:1.6;color:#d1d5db;">
  This is a reminder — you have an upcoming follow-up <strong style="color:#ffffff;">tomorrow</strong>.
</p>
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0f1621;border:1px solid #1f2937;border-radius:6px;margin:24px 0 28px;overflow:hidden;">
  <tr><td style="background:#ec028b;padding:2px 0;"></td></tr>
  <tr>
    <td style="padding:20px 24px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding-bottom:14px;border-bottom:1px solid #1f2937;">
            <p style="margin:0 0 3px;font-size:10px;text-transform:uppercase;letter-spacing:2px;color:#6b7280;">Lead / Project</p>
            <p style="margin:0;font-size:16px;color:#ffffff;font-weight:800;">${leadName}</p>
          </td>
        </tr>
        <tr>
          <td style="padding-top:14px;padding-bottom:14px;border-bottom:1px solid #1f2937;">
            <p style="margin:0 0 3px;font-size:10px;text-transform:uppercase;letter-spacing:2px;color:#6b7280;">Follow-Up Type</p>
            <p style="margin:0;font-size:14px;color:#f3f4f6;font-weight:700;">${typeLabel}</p>
          </td>
        </tr>
        <tr>
          <td style="padding-top:14px;${notes ? 'padding-bottom:14px;border-bottom:1px solid #1f2937;' : ''}">
            <p style="margin:0 0 3px;font-size:10px;text-transform:uppercase;letter-spacing:2px;color:#6b7280;">Scheduled For</p>
            <p style="margin:0;font-size:14px;color:#ec028b;font-weight:800;">${dateDisplay}${timeDisplay ? ` at ${timeDisplay}` : ''}</p>
          </td>
        </tr>
        ${notes ? `
        <tr>
          <td style="padding-top:14px;">
            <p style="margin:0 0 3px;font-size:10px;text-transform:uppercase;letter-spacing:2px;color:#6b7280;">Notes</p>
            <p style="margin:0;font-size:14px;color:#d1d5db;line-height:1.6;">${notes.replace(/\n/g, '<br/>')}</p>
          </td>
        </tr>` : ''}
      </table>
    </td>
  </tr>
</table>
<table cellpadding="0" cellspacing="0">
  <tr>
    <td style="background:#ec028b;border-radius:3px;">
      <a href="${APP_URL}"
         style="display:inline-block;padding:12px 24px;color:#ffffff;font-size:13px;font-weight:800;text-decoration:none;letter-spacing:1px;text-transform:uppercase;">
        View in RHIVE →
      </a>
    </td>
  </tr>
</table>`;

        return queueEmail({
            to: resolveRecipient(assigneeEmail),
            from: FROM_ADDRESS,
            message: {
                subject: `Reminder: Follow-up Tomorrow — ${leadName}`,
                text: [
                    `Hi ${assigneeName},`,
                    '',
                    `Reminder: you have an upcoming follow-up tomorrow.`,
                    `Lead: ${leadName}`,
                    `Type: ${typeLabel}`,
                    `Date: ${dateDisplay}${timeDisplay ? ` at ${timeDisplay}` : ''}`,
                    notes ? `Notes: ${notes}` : '',
                    '',
                    '— RHIVE Construction',
                ].filter(Boolean).join('\n'),
                html: buildEmailHtml({
                    title: `Reminder: Follow-up Tomorrow — ${leadName}`,
                    subtitle: '24-Hour Advance Notice',
                    bodyHtml,
                }),
            },
        });
    },

    /**
     * Generic utility — send any email by writing directly to the mail collection.
     * Useful for notifications, lead confirmations, etc.
     */
    send: async (
        to: string | string[],
        subject: string,
        html: string,
        text?: string
    ) => {
        return queueEmail({
            to: resolveRecipient(to),
            from: FROM_ADDRESS,
            message: {
                subject,
                html,
                text: text || html.replace(/<[^>]+>/g, ''),
            },
        });
    },
};
