require('dotenv').config({ path: 'c:/Users/Victor/Downloads/RHIVE2/RHIVE-OS-1.0-Antigravity-1/functions/.env' });

async function checkCommunications() {
    try {
        console.log("Fetching contacts directly from JustCall v2.1 API...");
        const JUSTCALL_API_KEY = process.env.JUSTCALL_API_KEY;
        const JUSTCALL_API_SECRET = process.env.JUSTCALL_API_SECRET;
        
        const response = await fetch('https://api.justcall.io/v2.1/contacts', {
            headers: {
                'Authorization': `${JUSTCALL_API_KEY}:${JUSTCALL_API_SECRET}`,
                'Accept': 'application/json'
            }
        });
        
        const data = await response.json();
        const contacts = data.data;
        if (!contacts || contacts.length === 0) {
            console.log("No contacts found in JustCall v2.1 API.");
            return;
        }
        
        console.log(`Found ${contacts.length} contacts.`);
        let contact = contacts.find(c => c.phone_numbers && c.phone_numbers.length > 0);
        
        if(!contact) {
            console.log("No contact with phone number found. Will search just phone field");
            contact = contacts.find(c => c.contact_numbers && c.contact_numbers.length > 0);
        }
        
        if (!contact && contacts[0].phone) {
            contact = contacts[0];
        }

        if(!contact) {
            console.log("No valid contact found", contacts[0]);
            return; 
        }

        const phoneNum = contact.phone || (contact.phone_numbers && contact.phone_numbers[0]) || (contact.contact_numbers && contact.contact_numbers[0].number);
        
        console.log(`Using phone ${phoneNum} for contact id ${contact.id}`);
        
        const phoneEscaped = encodeURIComponent(phoneNum);
        const url = `https://us-central1-rhive-os.cloudfunctions.net/getJustCallCommunications?phone=${phoneEscaped}`;
        console.log("Testing cloud function endpoint with this number...");
        console.log(url);
        
        const commsResponse = await fetch(url);
        const textData = await commsResponse.text();
        try {
            const commsData = JSON.parse(textData);
            console.log(`Response success: ${commsData.success}`);
            console.log(`Texts count: ${commsData.texts ? commsData.texts.length : 0}`);
            if (commsData.texts && commsData.texts.length > 0) {
                console.log("Sample text:", commsData.texts[0]);
            }
            console.log(`Calls count: ${commsData.calls ? commsData.calls.length : 0}`);
        } catch(e) {
            console.log("Invalid cloud function response:", textData);
        }
        
    } catch (e) {
        console.error("Error:", e.message);
    }
}

checkCommunications();
