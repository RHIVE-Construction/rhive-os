import { createRequire } from 'module';
import path from 'path';
import { fileURLToPath } from 'url';
import { Readable } from 'stream';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire('c:/Users/mjrob/OneDrive/Desktop/App Repo s/MJR_EPA/scripts/drive-automation/package.json');
const { google } = require('googleapis');

export async function patchGoogleDoc(docId, findText, replaceText) {
  try {
    const keyPath = 'c:/Users/mjrob/OneDrive/Desktop/App Repo s/MJR_EPA/scripts/drive-automation/service-account.json';
    const auth = new google.auth.GoogleAuth({
      keyFile: keyPath,
      scopes: ['https://www.googleapis.com/auth/drive']
    });
    const drive = google.drive({ version: 'v3', auth });

    console.log(`[1/3] Exporting document ${docId}...`);
    const exportRes = await drive.files.export({ fileId: docId, mimeType: 'text/html' });
    let html = exportRes.data;

    if (!html.includes(findText)) {
      console.warn(`[WARN] Target text "${findText}" not found in document.`);
      return false;
    }

    console.log(`[2/3] Replacing: "${findText}" -> "${replaceText}"...`);
    html = html.replaceAll(findText, replaceText);

    console.log(`[3/3] Uploading updated document...`);
    const stream = Readable.from([html]);
    const res = await drive.files.update({
      fileId: docId,
      media: {
        mimeType: 'text/html',
        body: stream
      },
      supportsAllDrives: true
    });

    console.log(`[✓] Update Successful: HTTP ${res.status}`);
    return true;
  } catch (err) {
    console.error(`[ERROR] Failed to patch document:`, err.message || err);
    throw err;
  }
}

const args = process.argv.slice(2);
if (args.length >= 3) {
  const [docId, findText, replaceText] = args;
  patchGoogleDoc(docId, findText, replaceText);
}
