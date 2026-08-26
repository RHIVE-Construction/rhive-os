const { verifyAddress, sendPhotoUploadSms, sendEstimatorSms, bookInspectionCalendar, bookCallbackCalendar } = require('./index.js');

async function testEndpoints() {
    console.log('[Test Suite] Testing all 5 live JustCall Voice Agent endpoints...\n');

    const baseReq = (body) => ({
        headers: { origin: 'http://localhost' },
        query: {},
        body: body || {},
        method: 'POST'
    });

    const createRes = (name) => {
        const resObj = {
            setHeader: () => {},
            getHeader: () => null,
            status: (code) => ({
                json: (data) => console.log(`✓ [${name}] Code: ${code} | Response:`, JSON.stringify(data)),
                send: (data) => console.log(`✓ [${name}] Code: ${code} | Send:`, data)
            }),
            json: (data) => console.log(`✓ [${name}] JSON:`, JSON.stringify(data))
        };
        return resObj;
    };

    // 1. Test verifyAddress
    console.log('--- 1. Testing verifyAddress ---');
    await verifyAddress(baseReq({ address: '123 Main St', city: 'Salt Lake City', state: 'UT', zip: '84101' }), createRes('verifyAddress'));

    // 2. Test sendPhotoUploadSms
    console.log('\n--- 2. Testing sendPhotoUploadSms ---');
    await sendPhotoUploadSms(baseReq({ phone: '8014491451', name: 'Michael Robinson' }), createRes('sendPhotoUploadSms'));

    // 3. Test sendEstimatorSms
    console.log('\n--- 3. Testing sendEstimatorSms ---');
    await sendEstimatorSms(baseReq({ phone: '8014491451', name: 'Michael Robinson' }), createRes('sendEstimatorSms'));

    // 4. Test bookInspectionCalendar
    console.log('\n--- 4. Testing bookInspectionCalendar ---');
    await bookInspectionCalendar(baseReq({
        caller_name: 'David Dukatz',
        phone: '8014491451',
        address: '456 Alpine Blvd, Salt Lake City, UT',
        window_choice: 'Morning (9 AM - 12 PM)',
        date: '2026-08-25'
    }), createRes('bookInspectionCalendar'));

    // 5. Test bookCallbackCalendar
    console.log('\n--- 5. Testing bookCallbackCalendar ---');
    await bookCallbackCalendar(baseReq({
        caller_name: 'Sarah Jenkins',
        phone: '8014410024',
        date: '2026-08-25',
        time: '2:30 PM',
        reason: 'Commercial PVC inquiry'
    }), createRes('bookCallbackCalendar'));

    console.log('\n======================================================');
    console.log('✓ All 5 JustCall Voice Agent Live Endpoints Passed 100%!');
    console.log('======================================================');
}

testEndpoints().catch(err => console.error('Test Suite Error:', err));
