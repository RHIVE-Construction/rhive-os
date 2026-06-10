const axios = require('axios');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
require('dotenv').config({ path: path.join(__dirname, '.env') });

const JUSTCALL_API_KEY = process.env.JUSTCALL_API_KEY;
const JUSTCALL_API_SECRET = process.env.JUSTCALL_API_SECRET;

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function run() {
    console.log("Analyzing JustCall paginated contact IDs...");
    let page = 1;
    while (true) {
        try {
            await sleep(1000);
            const res = await axios.get('https://api.justcall.io/v2.1/contacts', {
                params: { page: page, per_page: 100, across_team: true },
                headers: {
                    'Authorization': `${JUSTCALL_API_KEY}:${JUSTCALL_API_SECRET}`,
                    'Accept': 'application/json'
                }
            });
            const contacts = res.data.data || [];
            if (contacts.length === 0) break;
            
            const ids = contacts.map(c => Number(c.id)).filter(id => !isNaN(id));
            const minId = Math.min(...ids);
            const maxId = Math.max(...ids);
            
            console.log(`Page ${page}: Count = ${contacts.length} | ID Range = [${minId} to ${maxId}]`);
            
            if (contacts.length < 100) break;
            page++;
        } catch (e) {
            console.error(`Page ${page} Error:`, e.message);
            break;
        }
    }
}

run().then(() => process.exit(0)).catch(e => {
    console.error(e);
    process.exit(1);
});
