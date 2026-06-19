const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const API_KEY = process.env.VITE_GOOGLE_MAPS_API_KEY;
const address = '1271 North 100 East, Nephi, UT 84648';

async function main() {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${API_KEY}`;
    const res = await axios.get(url);
    if (res.data.status === 'OK') {
        const loc = res.data.results[0].geometry.location;
        console.log(`Address: ${address}`);
        console.log(`Latitude: ${loc.lat}`);
        console.log(`Longitude: ${loc.lng}`);
    } else {
        console.log(`Geocoding failed: ${res.data.status}`);
    }
}

main().catch(err => console.error(err));
