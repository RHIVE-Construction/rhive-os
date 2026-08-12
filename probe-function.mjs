// probe-function.mjs - Quick probe of sendSignVerifyEmail endpoint
const res = await fetch('https://us-central1-rhive-os.cloudfunctions.net/sendSignVerifyEmail', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ projectId: 'probe-test', customerEmail: 'victor.v@rhiveconstruction.com', customerName: 'Probe Test', projectName: 'Probe', link: 'https://rhive-os.web.app/?page=CUSTOMER-SIGN-VERIFY&token=probe-test' }),
});
const text = await res.text();
console.log('HTTP Status:', res.status);
console.log('Content-Type:', res.headers.get('content-type'));
console.log('Response Body:', text.substring(0, 500));
