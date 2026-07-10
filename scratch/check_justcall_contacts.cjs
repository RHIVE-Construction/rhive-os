const axios = require('axios');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
require('dotenv').config({ path: path.join(__dirname, '../functions/.env') });

const JUSTCALL_API_KEY = process.env.JUSTCALL_API_KEY;
const JUSTCALL_API_SECRET = process.env.JUSTCALL_API_SECRET;

async function run() {
    if (!JUSTCALL_API_KEY || !JUSTCALL_API_SECRET) {
        console.error("Missing JustCall API credentials in env");
        return;
    }

    console.log("Fetching all JustCall contacts to search for Ladd/Thorn...");
    let page = 1;
    let found = [];
    while (true) {
        try {
            const res = await axios.get('https://api.justcall.io/v2.1/contacts', {
                params: { page: page, limit: 50 },
                headers: {
                    'Authorization': `${JUSTCALL_API_KEY}:${JUSTCALL_API_SECRET}`,
                    'Accept': 'application/json'
                }
            });
            const contacts = res.data.data || [];
            if (contacts.length === 0) break;
            
            for (let c of contacts) {
                const name = `${c.first_name || ''} ${c.last_name || ''}`.toLowerCase();
                if (name.includes('ladd') || name.includes('thorn')) {
                    found.push(c);
                }
            }
            console.log(`Checked page ${page} (${contacts.length} contacts)...`);
            if (contacts.length < 50) break;
            page++;
        } catch (e) {
            console.error(`JustCall API Error on page ${page}:`, e.message);
            break;
        }
    }

    console.log(`\nFound ${found.length} matches in JustCall:`);
    console.log(JSON.stringify(found, null, 2));
}

run().then(() => process.exit(0)).catch(e => {
    console.error(e);
    process.exit(1);
});
