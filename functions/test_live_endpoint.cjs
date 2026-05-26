const axios = require('axios');
const fs = require('fs');

async function testCallbot() {
    const url = 'https://us-central1-rhive-os.cloudfunctions.net/justCallInformation';
    const phonesToTest = ["3333333333", "2352352352", "(333) 333-3333", "8013333333"];
    
    for (const phone of phonesToTest) {
        try {
            console.log(`\nTesting phone: ${phone}`);
            const res = await axios.post(url, { phone });
            if (res.data.found) {
                fs.writeFileSync('functions/live_results_utf8.json', JSON.stringify(res.data, null, 2), 'utf-8');
                console.log("Wrote functions/live_results_utf8.json");
                break;
            }
        } catch (err) {
            console.error("Error:", err.response ? err.response.data : err.message);
        }
    }
}

testCallbot();
