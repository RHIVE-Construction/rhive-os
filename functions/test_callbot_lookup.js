const axios = require('axios');
const fs = require('fs');
const LOOKUP_URL = 'https://us-central1-rhive-os.cloudfunctions.net/justCallLookup';

async function run(phone) {
    try {
        const response = await axios.get(LOOKUP_URL, { params: { phone }, timeout: 15000 });
        fs.writeFileSync('lookup_result.json', JSON.stringify(response.data, null, 2));
        console.log('HTTP:', response.status);
        console.log('Found:', response.data.found);
        console.log('Name:', response.data.firstName, response.data.lastName);
        console.log('Greeting:', response.data.personalizedGreeting);
        console.log('Status:', response.data.status);
        console.log('Project:', response.data.lastProject);
    } catch (err) {
        console.error('FAILED:', err.response?.status, JSON.stringify(err.response?.data || err.message));
    }
}
run(process.argv[2] || '+10000000000');
