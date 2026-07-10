const https = require('https');

const transcriptText = `Address: 105B WINDERLAND LN SPRINGDALE UT 84767-7760 USA
project_type: residential
first_name: Dobby
last_name: Houseelf
phone_number: 6641123344
project_role: landlord

project_intent: replacement
active_leak_detected: no
goal: seeking instant estimate`;

const data = JSON.stringify({
  type: "call.completed",
  data: {
    contact_number: "6641123344",
    contact_name: "Dobby Houseelf",
    id: "mock_dobby_" + Date.now(),
    call_date: new Date().toISOString(),
    duration: 150,
    direction: "inbound",
    transcript: transcriptText
  }
});

const req = https.request('https://us-central1-rhive-os.cloudfunctions.net/justCallWebhook', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data),
  }
}, (res) => {
  let responseBody = '';
  res.on('data', (chunk) => responseBody += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', responseBody);
    console.log('Now waiting 10 seconds for the backend trigger processCallLogForLead to run...');
    setTimeout(() => {
        console.log('Done waiting.');
        process.exit(0);
    }, 10000);
  });
});

req.on('error', (e) => {
  console.error('Error:', e);
});

req.write(data);
req.end();
