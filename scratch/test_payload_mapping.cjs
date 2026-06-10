/**
 * Simulation of the Firestore lead creation logic in functions/index.js
 * using the user's sample parsed JustCall payload.
 */

const samplePayload = {
  "firstName": "Johhn",
  "lastName": "Aanderson",
  "email": "john.anderson@gmail.com",
  "address": "123 Oak Street",
  "city": "Tampa",
  "state": "FL",
  "zip": "33602",
  "projectType": "Residential",
  "projectRole": "Property Owner",
  "details": "The caller is requesting an estimate for a roof replacement due to storm damage. He would like an inspection scheduled within the next week and is interested in financing options."
};

function simulateDatabaseCreation(extracted) {
    console.log("=== SIMULATING DATABASE ENTRY CREATION IN RHIVE OS ===\n");

    const mockPropertyId = "PROP_MOCK_" + Math.random().toString(36).substring(2, 10).toUpperCase();
    const mockLeadId = "LEAD_MOCK_" + Math.random().toString(36).substring(2, 10).toUpperCase();
    const mockContactId = "CONT_MOCK_" + Math.random().toString(36).substring(2, 10).toUpperCase();

    // 1. Map to Property Document (properties collection)
    const propertyDoc = {
        id: mockPropertyId,
        address_full: `${extracted.address} ${extracted.city} ${extracted.state} ${extracted.zip}`.trim(),
        property_address: extracted.address,
        city: extracted.city,
        state: extracted.state,
        zip: extracted.zip,
        type: extracted.projectType,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    };

    // 2. Map to Lead Document (leads collection)
    const leadDoc = {
        id: mockLeadId,
        name: `${extracted.firstName} ${extracted.lastName}`,
        project_type: extracted.projectType,
        project_role: extracted.projectRole,
        status: 'Active',
        current_stage: 'Lead',
        details: extracted.details,
        property_id: mockPropertyId,
        property_address: extracted.address,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    };

    // 3. Map to Contact Document (contacts collection)
    const contactDoc = {
        id: mockContactId,
        first_name: extracted.firstName,
        last_name: extracted.lastName,
        phone: "(813) 555-0199", // Mock phone associated with the call
        email: extracted.email,
        address: extracted.address,
        project_id: mockLeadId,
        property_id: mockPropertyId,
        role: extracted.projectRole,
        is_primary: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    };

    console.log("1. PROPERTY ENTRY (Collection: 'properties')");
    console.log(JSON.stringify(propertyDoc, null, 2));
    console.log("\n2. LEAD ENTRY (Collection: 'leads')");
    console.log(JSON.stringify(leadDoc, null, 2));
    console.log("\n3. CONTACT ENTRY (Collection: 'contacts')");
    console.log(JSON.stringify(contactDoc, null, 2));
    console.log("\n==================================================");
    console.log("✅ Simulation completed successfully.");
}

simulateDatabaseCreation(samplePayload);
