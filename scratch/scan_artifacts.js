import fs from 'fs';
import path from 'path';

const brainDir = 'C:\\Users\\mjrob\\.gemini\\antigravity\\brain';

function scanDir(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            scanDir(fullPath);
        } else if (file.endsWith('.md')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            const lines = content.split('\n');
            for (let i = 0; i < lines.length; i++) {
                if (lines[i].includes('![')) {
                    console.log(`[${file}:${i+1}] ${lines[i]}`);
                }
            }
        }
    }
}

scanDir(brainDir);
