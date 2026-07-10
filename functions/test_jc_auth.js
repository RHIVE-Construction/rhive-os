const axios = require('axios');
const KEY = 'YOUR_JUSTCALL_API_KEY';
const SECRET = 'YOUR_JUSTCALL_API_SECRET';

// JustCall v2.1 Documentation: https://developer.justcall.io/api/reference/contacts
async function testAuth() {
    const configs = [
        { name: "v2.1 Format KEY:SECRET", headers: { 'Authorization': `${KEY}:${SECRET}`, 'Accept': 'application/json' } },
        { name: "v2.1 Format Bearer KEY:SECRET", headers: { 'Authorization': `Bearer ${KEY}:${SECRET}`, 'Accept': 'application/json' } },
        { name: "v2.1 Format Basic (Base64)", headers: { 'Authorization': `Basic ${Buffer.from(`${KEY}:${SECRET}`).toString('base64')}`, 'Accept': 'application/json' } }
    ];

    for (let conf of configs) {
        try {
            console.log(`Testing ${conf.name}...`);
            let req = { headers: conf.headers || {} };
            res = await axios.get('https://api.justcall.io/v2.1/contacts', req);
            console.log(`✅ Success for ${conf.name}: Found ${res.data.data ? res.data.data.length : 0} contacts`);
            return; // Stop if one works
        } catch (e) {
            console.log(`❌ Failed: ${e.response ? e.response.status : e.message}`);
        }
    }
}
testAuth();
