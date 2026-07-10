const https = require('https');

const data = JSON.stringify({
  type: "call.completed",
  data: {
    contact_number: "4321118888",
    contact_name: "Missus Yoso",
    contact_email: "missusyoso@gmail.com",
    id: "mock_call_" + Date.now(),
    call_date: new Date().toISOString(),
    duration: 125,
    direction: "inbound",
    transcript: "Agent: Hello, thank you for calling RHIVE. How can I help you today? \nCaller: Hi, my name is Mister Yoso. I'm the property owner at 5500 S Garnet Dr, Saint George, UT 84790. I'm looking for a Residential project. I need some work done there. Just to be clear, this is not an insurance claim. \nAgent: Got it. What's the best way to contact you? \nCaller: Email is preferred. My email address is misteryoso@gmail.com, and my phone number is 4321115566. Could you please reach out to me there to discuss the details? \nAgent: We have all your details. We will reach out shortly."
  }
});

const req = https.request('https://us-central1-rhive-os.cloudfunctions.net/justCallWebhook', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data),
    // Omit x-justcall-signature-version to bypass the v1 signature check
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
