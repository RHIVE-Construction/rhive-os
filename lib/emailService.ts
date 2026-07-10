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
const FROM_ADDRESS = 'RHIVE Support <support@rhiveconstruction.com>';
const APP_URL = typeof window !== 'undefined'
    ? window.location.origin
    : 'https://app.rhiveconstruction.com';

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

// ─── Public API ──────────────────────────────────────────────────────────────

export const emailService = {
    /**
     * Sends a password reset link email.
     * Called after a reset token is created in the `users` collection.
     */
    sendPasswordReset: async (recipientEmail: string, resetToken: string) => {
        const resetLink = `${APP_URL}/?page=P-07&token=${resetToken}`;

        return queueEmail({
            to: recipientEmail,
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
                html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Password Reset — RHIVE Construction</title>
</head>
<body style="margin:0;padding:0;background:#050505;font-family:'Rubik',Arial,sans-serif;color:#f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#050505;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#0a0a0a;border:1px solid #374151;border-radius:4px;overflow:hidden;max-width:560px;">
          <!-- Header -->
          <tr>
            <td style="background:#ec028b;padding:4px 0;"></td>
          </tr>
          <tr>
            <td style="padding:32px 36px 20px;">
              <h1 style="margin:0 0 4px;font-size:22px;font-weight:800;letter-spacing:-0.5px;color:#ffffff;">
                RHIVE <span style="color:#ec028b;">Construction</span>
              </h1>
              <p style="margin:0;font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#6b7280;">
                Secure Account Recovery
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:0 36px 32px;">
              <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#d1d5db;">
                You requested a password reset for your RHIVE account.
              </p>
              <p style="margin:0 0 28px;font-size:14px;line-height:1.6;color:#9ca3af;">
                Click the button below to set a new password. This link expires in
                <strong style="color:#f3f4f6;">1 hour</strong>.
              </p>

              <!-- CTA Button -->
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

              <!-- Fallback link -->
              <p style="margin:0 0 8px;font-size:12px;color:#6b7280;">
                Or copy and paste this URL into your browser:
              </p>
              <p style="margin:0 0 32px;font-size:11px;word-break:break-all;">
                <a href="${resetLink}" style="color:#ec028b;text-decoration:none;">${resetLink}</a>
              </p>

              <!-- Security note -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#111827;border-left:3px solid #ec028b;border-radius:0 4px 4px 0;">
                <tr>
                  <td style="padding:14px 16px;">
                    <p style="margin:0;font-size:12px;color:#9ca3af;line-height:1.5;">
                      🔒 <strong style="color:#f3f4f6;">Didn't request this?</strong>
                      You can safely ignore this email. Your password will remain unchanged.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 36px;border-top:1px solid #1f2937;">
              <p style="margin:0;font-size:11px;color:#4b5563;">
                RHIVE Construction · Brisbane, QLD · Australia<br/>
                <a href="mailto:support@rhiveconstruction.com" style="color:#6b7280;text-decoration:none;">
                  support@rhiveconstruction.com
                </a>
              </p>
            </td>
          </tr>

          <!-- Bottom bar -->
          <tr>
            <td style="background:#ec028b;padding:2px 0;"></td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
                `.trim(),
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
            to,
            from: FROM_ADDRESS,
            message: {
                subject,
                html,
                text: text || html.replace(/<[^>]+>/g, ''),
            },
        });
    },
};
