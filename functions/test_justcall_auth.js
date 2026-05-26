const axios = require('axios');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '.env') });

const JUSTCALL_API_KEY = process.env.JUSTCALL_API_KEY;
const JUSTCALL_API_SECRET = process.env.JUSTCALL_API_SECRET;

async function testAuthFormats() {
    console.log("Testing JustCall API with different Authorization formats...\n");

    const formats = [
        {
            name: "Format 1: KEY:SECRET",
            headers: { 'Authorization': `${JUSTCALL_API_KEY}:${JUSTCALL_API_SECRET}` }
        },
        {
            name: "Format 2: Bearer KEY:SECRET",
            headers: { 'Authorization': `Bearer ${JUSTCALL_API_KEY}:${JUSTCALL_API_SECRET}` }
        },
        {
            name: "Format 3: Basic Base64",
            headers: { 'Authorization': `Basic ${Buffer.from(JUSTCALL_API_KEY + ':' + JUSTCALL_API_SECRET).toString('base64')}` }
        },
        {
            name: "Format 4: Bearer Base64",
            headers: { 'Authorization': `Bearer ${Buffer.from(JUSTCALL_API_KEY + ':' + JUSTCALL_API_SECRET).toString('base64')}` }
        }
    ];

    for (const format of formats) {
        console.log(`--- Trying ${format.name} ---`);
        try {
            const res = await axios.get('https://api.justcall.io/v1/contacts', {
                headers: {
                    ...format.headers,
                    'Accept': 'application/json',
                    'User-Agent': 'Axios 1.4.0'
                }
            });
            console.log(`✅ SUCCESS! HTTP ${res.status}`);
            console.log(`Found ${res.data.contacts ? res.data.contacts.length : 0} contacts.`);
            console.log("-------------------------------------------\n");
            return; // Exit on first success
        } catch (error) {
            console.log(`❌ FAILED: HTTP ${error.response?.status}`);
            console.log(`Details: ${JSON.stringify(error.response?.data).substring(0, 100)}...`);
            console.log("-------------------------------------------\n");
        }
    }
}

testAuthFormats();
