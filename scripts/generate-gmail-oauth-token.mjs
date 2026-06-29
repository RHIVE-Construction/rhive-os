/**
 * generate-gmail-oauth-token.mjs
 *
 * Interactive script to generate a Gmail OAuth2 Refresh Token for use with
 * the Firebase "Trigger Email from Firestore" extension.
 *
 * Usage:
 *   node scripts/generate-gmail-oauth-token.mjs
 *
 * Prerequisites:
 *   - A GCP OAuth2 Desktop App credential (Client ID + Secret)
 *   - Access to the support@rhiveconstruction.com Google account
 *
 * Reference: https://nodemailer.com/smtp/oauth2/
 */

import https from 'https';
import http from 'http';
import { createInterface } from 'readline';
import { URL } from 'url';

const SCOPE = 'https://mail.google.com/';
const REDIRECT_URI = 'http://localhost:9999/oauth2callback';

const rl = createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise(res => rl.question(q, res));

async function exchangeCode(clientId, clientSecret, code) {
  return new Promise((resolve, reject) => {
    const body = new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: REDIRECT_URI,
      grant_type: 'authorization_code',
    }).toString();

    const req = https.request({
      hostname: 'oauth2.googleapis.com',
      path: '/token',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(body),
      },
    }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(new Error(`Parse error: ${data}`)); }
      });
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function waitForCode(clientId, clientSecret) {
  return new Promise((resolve, reject) => {
    const server = http.createServer(async (req, res) => {
      const url = new URL(req.url, 'http://localhost:9999');
      const code = url.searchParams.get('code');
      const error = url.searchParams.get('error');

      if (error) {
        res.writeHead(400);
        res.end(`<h1>Error: ${error}</h1><p>Close this tab and try again.</p>`);
        server.close();
        reject(new Error(`OAuth error: ${error}`));
        return;
      }

      if (code) {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`
          <html><body style="font-family:sans-serif;text-align:center;padding:60px;background:#050505;color:#fff;">
            <h1 style="color:#ec028b;">✅ Authorization Successful!</h1>
            <p>You can close this tab and return to the terminal.</p>
          </body></html>
        `);
        server.close();

        console.log('\n✅ Authorization code received. Exchanging for tokens...');
        try {
          const tokens = await exchangeCode(clientId, clientSecret, code);
          resolve(tokens);
        } catch (e) {
          reject(e);
        }
      }
    });

    server.listen(9999, () => {
      console.log('   Local callback server listening on port 9999...');
    });

    server.on('error', reject);

    // Timeout after 5 minutes
    setTimeout(() => {
      server.close();
      reject(new Error('Timed out waiting for OAuth callback'));
    }, 5 * 60 * 1000);
  });
}

async function main() {
  console.log('\n🔐 RHIVE — Gmail OAuth2 Token Generator');
  console.log('─'.repeat(50));
  console.log('\nThis script will generate a Refresh Token for:');
  console.log('  support@rhiveconstruction.com\n');
  console.log('Prerequisites:');
  console.log('  1. A GCP OAuth2 "Desktop app" credential');
  console.log('  2. Scope added: https://mail.google.com/');
  console.log('  3. support@rhiveconstruction.com added as a test user\n');
  console.log('Get credentials at:');
  console.log('  https://console.cloud.google.com/apis/credentials?project=rhive-os\n');

  const clientId = (await ask('Paste your OAuth2 Client ID: ')).trim();
  const clientSecret = (await ask('Paste your OAuth2 Client Secret: ')).trim();

  if (!clientId || !clientSecret) {
    console.error('❌ Client ID and Secret are required.');
    process.exit(1);
  }

  // Build authorization URL
  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('redirect_uri', REDIRECT_URI);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('scope', SCOPE);
  authUrl.searchParams.set('access_type', 'offline');
  authUrl.searchParams.set('prompt', 'consent');
  authUrl.searchParams.set('login_hint', 'support@rhiveconstruction.com');

  console.log('\n──────────────────────────────────────────────────');
  console.log('📌 Open this URL in your browser and sign in as');
  console.log('   support@rhiveconstruction.com:');
  console.log('');
  console.log(authUrl.toString());
  console.log('──────────────────────────────────────────────────\n');
  console.log('Waiting for OAuth callback...');

  let tokens;
  try {
    tokens = await waitForCode(clientId, clientSecret);
  } catch (err) {
    console.error(`\n❌ Failed: ${err.message}`);
    process.exit(1);
  }

  if (!tokens.refresh_token) {
    console.error('\n❌ No refresh token received. This can happen if:');
    console.error('   - You previously authorized this app (revoke access first)');
    console.error('   - The prompt=consent parameter was not respected');
    console.error('\n   Go to: https://myaccount.google.com/security');
    console.error('   → "Third-party apps with account access" → revoke RHIVE Email Extension');
    console.error('   Then run this script again.');
    process.exit(1);
  }

  console.log('\n' + '═'.repeat(60));
  console.log('🎉 SUCCESS! Copy these values into the Firebase Extension config:');
  console.log('═'.repeat(60));
  console.log('\n  Firebase Console → Extensions → Trigger Email → Reconfigure');
  console.log('  https://console.firebase.google.com/project/rhive-os/extensions/instances/firestore-send-email/config\n');
  console.log('┌─────────────────────────────────────────────────────────────┐');
  console.log('│ Authentication Type        : OAuth2                         │');
  console.log('│ OAuth2 SMTP Host           : smtp.gmail.com                 │');
  console.log('│ OAuth2 SMTP Port           : 465                            │');
  console.log('│ Use Secure OAuth2 Connection: true                          │');
  console.log(`│ OAuth2 Client ID           : ${clientId.substring(0, 30)}... │`);
  console.log(`│ OAuth2 Client Secret       : ${clientSecret.substring(0, 20)}...       │`);
  console.log(`│ OAuth2 Refresh Token       : ${tokens.refresh_token.substring(0, 20)}...       │`);
  console.log('│ OAuth2 SMTP User           : support@rhiveconstruction.com  │');
  console.log('│ Email documents collection : mail                           │');
  console.log('│ Default FROM address       : RHIVE Support <support@rhiveconstruction.com> │');
  console.log('└─────────────────────────────────────────────────────────────┘\n');
  console.log(`Full Refresh Token:\n${tokens.refresh_token}\n`);

  rl.close();
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
