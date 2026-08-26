import fs from 'fs';
import path from 'path';

const CHROME_USER_DATA = path.join(process.env.LOCALAPPDATA, 'Google', 'Chrome', 'User Data');
const RPA_PROFILE_DIR = path.join(process.cwd(), 'scratch', 'rpa_headless_profile');

export function cloneChromeSessionToHeadless() {
    console.log('[Session Sync] Syncing active Chrome session cookies to headless profile via native Node.js...');
    const targetDefault = path.join(RPA_PROFILE_DIR, 'Default');
    const sourceDefault = path.join(CHROME_USER_DATA, 'Default');

    if (!fs.existsSync(targetDefault)) {
        fs.mkdirSync(targetDefault, { recursive: true });
    }

    const itemsToCopy = ['Network', 'Local Storage', 'Session Storage', 'Preferences', 'Secure Preferences', 'Cookies'];

    for (const item of itemsToCopy) {
        const srcPath = path.join(sourceDefault, item);
        const dstPath = path.join(targetDefault, item);

        if (fs.existsSync(srcPath)) {
            try {
                fs.cpSync(srcPath, dstPath, { recursive: true, force: true });
            } catch (e) {
                // Ignore file lock warnings on transient SQLite WAL locks
            }
        }
    }

    // Also copy Local State from root User Data (needed for DPAPI cookie decryption)
    const localStateSrc = path.join(CHROME_USER_DATA, 'Local State');
    const localStateDst = path.join(RPA_PROFILE_DIR, 'Local State');
    if (fs.existsSync(localStateSrc)) {
        try {
            fs.copyFileSync(localStateSrc, localStateDst);
        } catch (e) {}
    }

    console.log('[Session Sync] Sync complete.');
    return true;
}

if (process.argv[1].endsWith('sync_chrome_session.mjs')) {
    cloneChromeSessionToHeadless();
}
