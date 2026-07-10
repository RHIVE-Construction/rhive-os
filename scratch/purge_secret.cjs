const fs = require('fs');
const path = require('path');

const KEY_TO_REPLACE = process.env.JUSTCALL_API_KEY || '';
const SECRET_TO_REPLACE = process.env.JUSTCALL_API_SECRET || '';

const KEY_PLACEHOLDER = 'YOUR_JUSTCALL_API_KEY';
const SECRET_PLACEHOLDER = 'YOUR_JUSTCALL_API_SECRET';
const TOKEN_PLACEHOLDER = 'Bearer YOUR_JUSTCALL_TOKEN';

function walkAndReplace(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            if (file === 'node_modules' || file === '.git' || file === 'REFERENCES') {
                continue;
            }
            walkAndReplace(fullPath);
        } else {
            // Only process text files (js, cjs, ts, tsx, json, md, html, yaml, yml, txt)
            const ext = path.extname(file).toLowerCase();
            if (['.js', '.cjs', '.ts', '.tsx', '.json', '.md', '.html', '.yaml', '.yml', '.txt'].includes(ext)) {
                try {
                    let content = fs.readFileSync(fullPath, 'utf8');
                    let changed = false;
                    
                    if (content.includes(KEY_TO_REPLACE)) {
                        content = content.split(KEY_TO_REPLACE).join(KEY_PLACEHOLDER);
                        changed = true;
                    }
                    if (content.includes(SECRET_TO_REPLACE)) {
                        content = content.split(SECRET_TO_REPLACE).join(SECRET_PLACEHOLDER);
                        changed = true;
                    }
                    
                    if (changed) {
                        fs.writeFileSync(fullPath, content, 'utf8');
                        console.log(`Updated secrets in: ${fullPath}`);
                    }
                } catch (err) {
                    // Ignore read/write errors on system/locked files
                }
            }
        }
    }
}

// Start from the current working directory
const rootDir = process.cwd();
console.log(`Purging secrets from files in: ${rootDir}`);
walkAndReplace(rootDir);
