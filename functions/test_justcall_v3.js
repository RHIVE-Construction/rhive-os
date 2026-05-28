const axios = require('axios');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '.env') });

const KEY = process.env.JUSTCALL_API_KEY;
const SECRET = process.env.JUSTCALL_API_SECRET;

const tests = [
    {
        name: "v1 /contacts | KEY:SECRET | Browser UA",
        url: 'https://api.justcall.io/v1/contacts',
        headers: {
            'Authorization': `${KEY}:${SECRET}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36'
        }
    },
    {
        name: "v1 /calls | KEY:SECRET | Browser UA",
        url: 'https://api.justcall.io/v1/calls',
        headers: {
            'Authorization': `${KEY}:${SECRET}`,
            'Accept': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36'
        }
    },
    {
        name: "v1 /users | KEY:SECRET | Browser UA",
        url: 'https://api.justcall.io/v1/users',
        headers: {
            'Authorization': `${KEY}:${SECRET}`,
            'Accept': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36'
        }
    }
];

async function runTests() {
    const fs = require('fs');
    const results = [];
    console.log(`API Key: ${KEY}`);
    console.log(`API Secret: ${SECRET ? SECRET.substring(0,5)+'...' : 'MISSING'}\n`);

    for (const test of tests) {
        process.stdout.write(`Testing: ${test.name} ... `);
        try {
            const res = await axios.get(test.url, { 
                headers: test.headers, 
                timeout: 10000,
                validateStatus: null // Don't throw on ANY status code
            });
            const success = res.status >= 200 && res.status < 300;
            console.log(`${success ? '✅' : '❌'} HTTP ${res.status}`);
            const bodySnippet = typeof res.data === 'string' 
                ? res.data.substring(0, 150) 
                : JSON.stringify(res.data).substring(0, 150);
            results.push({ name: test.name, status: res.status, body: bodySnippet });
        } catch (err) {
            console.log(`❌ NETWORK ERROR: ${err.message}`);
            results.push({ name: test.name, status: 'NETWORK_ERROR', error: err.message });
        }
    }

    fs.writeFileSync('justcall_v3_results.json', JSON.stringify(results, null, 2));
    console.log("\nResults saved to justcall_v3_results.json");
}

runTests();
