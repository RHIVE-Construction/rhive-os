const axios = require('axios');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
require('dotenv').config({ path: path.join(__dirname, '.env') });

const JUSTCALL_API_KEY = process.env.JUSTCALL_API_KEY;
const JUSTCALL_API_SECRET = process.env.JUSTCALL_API_SECRET;

async function run() {
    if (!JUSTCALL_API_KEY || !JUSTCALL_API_SECRET) {
        console.error("Missing JustCall API credentials in env");
        return;
    }

    console.log("Fetching all JustCall contacts to write names...");
    let page = 1;
    let list = [];
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
                list.push({
                    name: `${c.first_name || ''} ${c.last_name || ''}`.trim(),
                    phone: c.contact_number || c.phone || 'N/A'
                });
            }
            if (contacts.length < 50) break;
            page++;
        } catch (e) {
            console.error(`Error on page ${page}:`, e.message);
            break;
        }
    }

    // Sort alphabetically
    list.sort((a, b) => a.name.localeCompare(b.name));

    fs.writeFileSync('justcall_names_list.txt', list.map(x => `${x.name} - ${x.phone}`).join('\n'));
    console.log(`Saved ${list.length} names to justcall_names_list.txt`);
}

run().then(() => process.exit(0)).catch(e => {
    console.error(e);
    process.exit(1);
});
