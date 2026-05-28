
require('dotenv').config({ path: 'c:/Users/Victor/Downloads/RHIVE2/RHIVE-OS-1.0-Antigravity-1/functions/.env' });
const axios = require('axios');

const JUSTCALL_API_KEY = process.env.JUSTCALL_API_KEY;
const JUSTCALL_API_SECRET = process.env.JUSTCALL_API_SECRET;

async function checkJustCall() {
    console.log("Checking JustCall connection...");
    try {
        const response = await axios.get('https://api.justcall.io/v1/contacts', {
            headers: {
                'Authorization': `${JUSTCALL_API_KEY}:${JUSTCALL_API_SECRET}`
            }
        });
        console.log("JustCall Connection: SUCCESS");
        console.log("Count of contacts returned:", response.data.contacts ? response.data.contacts.length : "N/A");
    } catch (error) {
        console.error("JustCall Connection: FAILED");
        console.error("Error:", error.response?.data || error.message);
    }
}

checkJustCall();
