const https = require('https');

const url = 'https://docs.google.com/spreadsheets/d/1r5V12_Kp0928Y_SAdFhv8jI05mO9M40qzBAinlAF4Qc/export?format=csv&gid=0';

https.get(url, {
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
}, (res) => {
    console.log(`Status Code: ${res.statusCode}`);
    console.log('Headers:', res.headers);
    let body = '';
    res.on('data', chunk => body += chunk);
    res.on('end', () => {
        console.log('Body length:', body.length);
        if (res.statusCode !== 200) {
            console.log('Body preview:', body.substring(0, 500));
        }
    });
}).on('error', (e) => {
    console.error('Error:', e);
});
