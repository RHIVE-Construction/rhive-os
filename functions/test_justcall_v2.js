const axios = require('axios');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '.env') });

const KEY = process.env.JUSTCALL_API_KEY;
const SECRET = process.env.JUSTCALL_API_SECRET;

const tests = [
    {
        name: "v1 API | KEY:SECRET",
        url: 'https://api.justcall.io/v1/contacts',
        headers: { 'Authorization': `${KEY}:${SECRET}`, 'Accept': 'application/json' }
    },
    {
        name: "v2 API | KEY:SECRET",
        url: 'https://api.justcall.io/v2/contacts',
        headers: { 'Authorization': `${KEY}:${SECRET}`, 'Accept': 'application/json' }
    },
    {
        name: "v2 API | Bearer KEY:SECRET",
        url: 'https://api.justcall.io/v2/contacts',
        headers: { 'Authorization': `Bearer ${KEY}:${SECRET}`, 'Accept': 'application/json' }
    },
    {
        name: "v1 API | api_key+api_secret as params",
        url: `https://api.justcall.io/v1/contacts?api_key=${KEY}&api_secret=${SECRET}`,
        headers: { 'Accept': 'application/json' }
    }
];

async function runTests() {
    console.log("=== JustCall API Connectivity Tests ===\n");
    const fs = require('fs');
    const results = [];

    for (const test of tests) {
        process.stdout.write(`Testing: ${test.name} ... `);
        try {
            const res = await axios.get(test.url, { headers: test.headers, timeout: 10000 });
            console.log(`✅ SUCCESS (HTTP ${res.status})`);
            results.push({ name: test.name, success: true, status: res.status, data: res.data });
        } catch (err) {
            const status = err.response?.status || 'NETWORK_ERROR';
            console.log(`❌ FAILED (HTTP ${status})`);
            results.push({ name: test.name, success: false, status, error: String(err.response?.data || err.message).substring(0, 200) });
        }
    }

    fs.writeFileSync('justcall_test_results.json', JSON.stringify(results, null, 2));
    console.log("\nResults saved to justcall_test_results.json");
}

runTests();
