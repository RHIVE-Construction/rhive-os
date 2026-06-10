const axios = require('axios');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
require('dotenv').config({ path: path.join(__dirname, '.env') });

const JUSTCALL_API_KEY = process.env.JUSTCALL_API_KEY;
const JUSTCALL_API_SECRET = process.env.JUSTCALL_API_SECRET;

async function run() {
    if (!JUSTCALL_API_KEY || !JUSTCALL_API_SECRET) {
        console.error("Missing JustCall API credentials");
        return;
    }

    try {
        const res = await axios.get('https://api.justcall.io/v2.1/contacts', {
            params: { page: 1, limit: 10 },
            headers: {
                'Authorization': `${JUSTCALL_API_KEY}:${JUSTCALL_API_SECRET}`,
                'Accept': 'application/json'
            }
        });
        
        console.log("JustCall API Response top-level keys:", Object.keys(res.data));
        console.log("Full metadata/structure:", JSON.stringify({
            status: res.data.status,
            page: res.data.page,
            limit: res.data.limit,
            count: res.data.count,
            total: res.data.total,
            total_records: res.data.total_records,
            total_pages: res.data.total_pages
        }, null, 2));
    } catch (e) {
        console.error(e.message);
    }
}

run().then(() => process.exit(0)).catch(e => {
    console.error(e);
    process.exit(1);
});
