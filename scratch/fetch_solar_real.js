import axios from 'axios';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

dotenv.config();

const API_KEY = process.env.VITE_GOOGLE_MAPS_API_KEY;
const address = '3584 South 500 East, South Salt Lake, UT 84115';

async function main() {
    console.log(`Geocoding address: "${address}"...`);
    try {
        const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${API_KEY}`;
        const geocodeRes = await axios.get(geocodeUrl);
        
        if (geocodeRes.data.status !== 'OK') {
            throw new Error(`Geocoding failed: ${geocodeRes.data.status} - ${geocodeRes.data.error_message || ''}`);
        }

        const location = geocodeRes.data.results[0].geometry.location;
        const lat = location.lat;
        const lng = location.lng;
        console.log(`Coordinates: lat=${lat}, lng=${lng}`);

        console.log("Querying Google Solar API buildingInsights...");
        const solarUrl = `https://solar.googleapis.com/v1/buildingInsights:findClosest?location.latitude=${lat}&location.longitude=${lng}&requiredQuality=HIGH&key=${API_KEY}`;
        const solarRes = await axios.get(solarUrl);

        console.log("Solar API success!");
        fs.writeFileSync('./scratch/solar_response.json', JSON.stringify(solarRes.data, null, 2));
        console.log("Written response to ./scratch/solar_response.json");
    } catch (err) {
        if (err.response) {
            console.error(`API Error (${err.response.status}):`, JSON.stringify(err.response.data, null, 2));
        } else {
            console.error("Error:", err.message);
        }
    }
}

main();
