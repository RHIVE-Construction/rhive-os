/**
 * Quick test: sends an Ethereal test email and prints the preview URL.
 * Shows exactly what the Cloud Function will do when Gmail is not configured.
 */
const nodemailer = require('nodemailer');

async function testEthereal() {
    console.log('Creating Ethereal test account...');
    const testAccount = await nodemailer.createTestAccount();
    console.log('Test account created:', testAccount.user);

    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: { user: testAccount.user, pass: testAccount.pass }
    });

    const otp = '483 201';
    const info = await transporter.sendMail({
        from: '"RHIVE QOS Security" <' + testAccount.user + '>',
        to: 'james.g@rhiveconstruction.com',
        subject: '483201 - Your RHIVE QOS Verification Code',
        html: '<h1 style="color:#ec028b;">RHIVE QOS</h1><p>Verification code: <strong>' + otp + '</strong></p>',
        text: 'RHIVE QOS\nVerification code: ' + otp
    });

    const previewUrl = nodemailer.getTestMessageUrl(info);
    console.log('\n✅ Email sent! Open the preview URL to see it:');
    console.log('→', previewUrl);
    console.log('\nThis is what the Cloud Function will return as previewUrl.');
}

testEthereal().catch(e => { console.error('Error:', e.message); process.exit(1); });
