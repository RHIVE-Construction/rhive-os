
const axios = require('axios');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '.env') });

const JUSTCALL_API_KEY = process.env.JUSTCALL_API_KEY;
const JUSTCALL_API_SECRET = process.env.JUSTCALL_API_SECRET;

async function checkJustCall() {
    console.log("--- Checking JustCall connection ---");
    console.log("Using API Key:", JUSTCALL_API_KEY ? JUSTCALL_API_KEY.substring(0, 5) + "..." : "MISSING");
    if (!JUSTCALL_API_KEY || !JUSTCALL_API_SECRET) {
        console.error("JustCall API Key or Secret missing!");
        return;
    }
    try {
        const response = await axios.get('https://api.justcall.io/v1/contacts', {
            headers: {
                'Authorization': `${JUSTCALL_API_KEY}:${JUSTCALL_API_SECRET}`,
                'Accept': 'application/json',
                'User-Agent': 'Axios 1.4.0 / RHIVE-OS'
            }
        });
        console.log("JustCall Connection: SUCCESS");
        console.log("Contacts Found in JustCall:", response.data.contacts ? response.data.contacts.length : "N/A");
    } catch (error) {
        console.error("JustCall Connection: FAILED");
        console.error("Status:", error.response?.status);
        require('fs').writeFileSync('justcall_error.json', JSON.stringify({
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        }, null, 2));
    }
}

checkJustCall();
