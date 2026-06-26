const https = require('https');

const data = JSON.stringify({
  type: "contact.created",
  data: {
    contact_number: "15559998888",
    first_name: "Homer",
    last_name: "Simpson",
    email: "homer@burns.com",
    address: "742 Evergreen Terrace, Springfield"
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
  });
});

req.on('error', (e) => {
  console.error('Error:', e);
});

req.write(data);
req.end();
