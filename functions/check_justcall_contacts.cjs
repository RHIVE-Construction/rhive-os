const axios = require('axios');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
require('dotenv').config({ path: path.join(__dirname, '.env') }); // Functions local .env

const JUSTCALL_API_KEY = process.env.JUSTCALL_API_KEY;
const JUSTCALL_API_SECRET = process.env.JUSTCALL_API_SECRET;

async function run() {
    if (!JUSTCALL_API_KEY || !JUSTCALL_API_SECRET) {
        console.error("Missing JustCall API credentials in env");
        return;
    }

    console.log("Searching JustCall directly for Ladd Thorn...");
    try {
        const res = await axios.get('https://api.justcall.io/v2.1/contacts', {
            params: { 
                first_name: 'Ladd', 
                last_name: 'Thorn',
                across_team: true 
            },
            headers: {
                'Authorization': `${JUSTCALL_API_KEY}:${JUSTCALL_API_SECRET}`,
                'Accept': 'application/json'
            }
        });
        const contacts = res.data.data || [];
        console.log(`\nFound ${contacts.length} direct matches for Ladd Thorn:`);
        console.log(JSON.stringify(contacts, null, 2));
    } catch (e) {
        console.error(`JustCall API Error:`, e.message);
    }
}

run().then(() => process.exit(0)).catch(e => {
    console.error(e);
    process.exit(1);
});
