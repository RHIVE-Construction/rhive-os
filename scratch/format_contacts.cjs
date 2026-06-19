const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, 'contacts_output.json');
const workspaceMdPath = path.join(__dirname, 'contacts_list.md');
const artifactMdPath = 'C:\\Users\\Victor\\.gemini\\antigravity\\brain\\fe669648-f254-4347-8f42-bdceb92154d1\\contacts_list.md';

function formatPhone(phone) {
    if (!phone) return 'N/A';
    // Convert to string and clean up
    let str = String(phone).trim();
    return str || 'N/A';
}

function run() {
    if (!fs.existsSync(jsonPath)) {
        console.error("JSON data file not found!");
        return;
    }

    const contacts = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    console.log(`Processing ${contacts.length} contacts...`);

    // Clean and normalize contacts
    const cleaned = contacts.map(c => {
        let name = '';
        if (c.full_name && c.full_name.trim()) {
            name = c.full_name.trim();
        } else if (c.first_name || c.last_name) {
            name = `${c.first_name || ''} ${c.last_name || ''}`.trim();
        } else {
            name = 'Unnamed Contact';
        }

        // Clean name if it starts with "+" followed by phone
        if (name.startsWith('+ ') && name.length > 2) {
            // Keep it as is or clean
        }

        return {
            name: name,
            phone: formatPhone(c.phone),
            email: c.email || 'N/A',
            address: c.address || c.billingStreet || 'N/A',
            source: c._source || 'N/A',
            id: c.id
        };
    });

    // Sort alphabetically by name
    cleaned.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base', numeric: true }));

    // Generate markdown contents
    let md = `# RHIVE OS Contacts List\n\n`;
    md += `Total Contacts: **${cleaned.length}**\n\n`;
    md += `Below is a complete alphabetical directory of all contacts retrieved from the Firestore database.\n\n`;

    // Group by first letter
    let currentLetter = '';
    cleaned.forEach(c => {
        let firstChar = c.name.trim().charAt(0).toUpperCase();
        if (!/[A-Z]/.test(firstChar)) {
            firstChar = '#'; // Symbols or numbers
        }

        if (firstChar !== currentLetter) {
            currentLetter = firstChar;
            md += `\n## ${currentLetter}\n\n`;
            md += `| Name | Phone | Email | Address | Source |\n`;
            md += `| :--- | :--- | :--- | :--- | :--- |\n`;
        }

        // Escape pipes in values for markdown table safety
        const nameEsc = c.name.replace(/\|/g, '\\|');
        const phoneEsc = c.phone.replace(/\|/g, '\\|');
        const emailEsc = c.email.replace(/\|/g, '\\|');
        const addrEsc = c.address.replace(/\|/g, '\\|').replace(/\n/g, ' ');
        const srcEsc = c.source.replace(/\|/g, '\\|');

        md += `| **${nameEsc}** | ${phoneEsc} | ${emailEsc} | ${addrEsc} | \`${srcEsc}\` |\n`;
    });

    // Write to workspace
    fs.writeFileSync(workspaceMdPath, md, 'utf8');
    console.log(`Saved formatted markdown to: ${workspaceMdPath}`);

    // Write to artifact directory if it exists or can be created
    try {
        const artifactDir = path.dirname(artifactMdPath);
        if (!fs.existsSync(artifactDir)) {
            fs.mkdirSync(artifactDir, { recursive: true });
        }
        fs.writeFileSync(artifactMdPath, md, 'utf8');
        console.log(`Saved formatted markdown artifact to: ${artifactMdPath}`);
    } catch (err) {
        console.error("Could not write artifact file:", err.message);
    }
}

run();
process.exit(0);
