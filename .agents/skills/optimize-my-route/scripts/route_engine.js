/**
 * RHIVE ROUTE OPTIMIZATION & DISPATCH ENGINE
 * High-performance deterministic engine for calendar ingestion, TSP routing, map generation, and Google Chat dispatch.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const GOOGLEAPIS_PATH = path.join('C:', 'Users', 'mjrob', '.gemini', 'config', 'skills', 'omni-clone', 'node_modules', 'googleapis');
const { google } = require(GOOGLEAPIS_PATH);

const SERVICE_ACCOUNT_PATH = path.join('C:', 'Users', 'mjrob', '.gemini', 'config', 'skills', 'omni-clone', 'auth', 'service-account.json');
const CHAT_TOKEN_PATH = path.join('c:', 'Users', 'mjrob', 'OneDrive', 'Desktop', 'App Repo s', 'MJR_EPA', 'config', 'rhive_chat_token.json');
const CHAT_CREDENTIALS_PATH = path.join('c:', 'Users', 'mjrob', 'OneDrive', 'Desktop', 'App Repo s', 'MJR_EPA', 'config', 'rhive_master_credentials.json');

// --- 1. GOOGLE CALENDAR FETCH ---
async function fetchCalendarEvents(dateStr = 'today') {
  if (!fs.existsSync(SERVICE_ACCOUNT_PATH)) {
    throw new Error('Service account credentials not found at: ' + SERVICE_ACCOUNT_PATH);
  }
  const credentials = JSON.parse(fs.readFileSync(SERVICE_ACCOUNT_PATH, 'utf8'));
  const auth = new google.auth.JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
    subject: 'michael@rhiveconstruction.com'
  });

  const calendar = google.calendar({ version: 'v3', auth });

  let targetDate = new Date();
  if (dateStr !== 'today') {
    targetDate = new Date(dateStr);
  }
  
  const yyyy = targetDate.getFullYear();
  const mm = String(targetDate.getMonth() + 1).padStart(2, '0');
  const dd = String(targetDate.getDate()).padStart(2, '0');
  
  const timeMin = new Date(`${yyyy}-${mm}-${dd}T00:00:00-06:00`).toISOString();
  const timeMax = new Date(`${yyyy}-${mm}-${dd}T23:59:59-06:00`).toISOString();

  const res = await calendar.events.list({
    calendarId: 'primary',
    timeMin,
    timeMax,
    singleEvents: true,
    orderBy: 'startTime'
  });

  return (res.data.items || []).map((event, idx) => {
    let assignee = 'Field Staff';
    const desc = event.description || '';
    const assigneeMatch = desc.match(/Assignee:\s*([A-Za-z]+)/i);
    if (assigneeMatch) assignee = assigneeMatch[1].toUpperCase();

    let pm = '';
    const pmMatch = desc.match(/Property Mngr:\s*([^<]+)/i);
    if (pmMatch) pm = pmMatch[1].trim();

    let phone = '';
    const phoneMatch = desc.match(/Contact:\s*([^<]+)/i);
    if (phoneMatch) phone = phoneMatch[1].trim();

    let units = '';
    const unitsMatch = desc.match(/Units:\s*([0-9]+)/i);
    if (unitsMatch) units = parseInt(unitsMatch[1], 10);

    return {
      id: event.id,
      name: event.summary || `Appointment ${idx + 1}`,
      address: event.location || '',
      assignee,
      pm,
      phone,
      units: units || 0,
      start: event.start.dateTime || event.start.date,
      end: event.end.dateTime || event.end.date
    };
  }).filter(e => e.address && e.address.trim().length > 0);
}

// --- 2. GEOCODING VIA NOMINATIM ---
async function geocodeAddress(addr) {
  return new Promise((resolve) => {
    const url = 'https://nominatim.openstreetmap.org/search?format=json&q=' + encodeURIComponent(addr);
    https.get(url, { headers: { 'User-Agent': 'RhiveRoutingEngine/2.0' } }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json && json.length > 0) {
            resolve({ lat: parseFloat(json[0].lat), lon: parseFloat(json[0].lon) });
          } else {
            resolve(null);
          }
        } catch (e) {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
}

// --- 3. OSRM ROUTING & TSP SOLVER ---
function permute(arr) {
  if (arr.length <= 1) return [arr];
  let res = [];
  for (let i = 0; i < arr.length; i++) {
    const current = arr[i];
    const remaining = arr.slice(0, i).concat(arr.slice(i + 1));
    const remPerms = permute(remaining);
    for (const p of remPerms) res.push([current, ...p]);
  }
  return res;
}

async function solveTSP(stops) {
  const coordsStr = stops.map(s => `${s.lon},${s.lat}`).join(';');
  const tableUrl = `https://router.project-osrm.org/table/v1/driving/${coordsStr}?annotations=distance,duration`;

  const matrixData = await new Promise((resolve, reject) => {
    https.get(tableUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });

  const distMatrix = matrixData.distances;
  const durMatrix = matrixData.durations;
  const indices = stops.map((_, i) => i);
  const perms = permute(indices);

  let bestDist = Infinity;
  let bestRoute = null;

  for (const p of perms) {
    let d = 0;
    for (let i = 0; i < p.length - 1; i++) {
      d += distMatrix[p[i]][p[i + 1]];
    }
    if (d < bestDist) {
      bestDist = d;
      bestRoute = p;
    }
  }

  const orderedStops = bestRoute.map((idx, i) => ({
    ...stops[idx],
    num: i + 1
  }));

  const legs = [];
  let totalDurationSec = 0;
  for (let i = 0; i < bestRoute.length - 1; i++) {
    const fromIdx = bestRoute[i];
    const toIdx = bestRoute[i + 1];
    const dMeters = distMatrix[fromIdx][toIdx];
    const dSecs = durMatrix[fromIdx][toIdx];
    totalDurationSec += dSecs;
    legs.push({
      from: stops[fromIdx].name,
      to: stops[toIdx].name,
      dist: `${(dMeters / 1609.34).toFixed(1)} mi`,
      time: `${Math.round(dSecs / 60)} min`
    });
  }

  const orderedCoordsStr = orderedStops.map(s => `${s.lon},${s.lat}`).join(';');
  const routeUrl = `https://router.project-osrm.org/route/v1/driving/${orderedCoordsStr}?overview=full&geometries=geojson`;
  const routeGeomData = await new Promise((resolve, reject) => {
    https.get(routeUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });

  return {
    orderedStops,
    legs,
    totalDistanceMiles: (bestDist / 1609.34).toFixed(1),
    totalDurationMins: Math.round(totalDurationSec / 60),
    coordinates: routeGeomData.routes[0].geometry.coordinates
  };
}

// --- 4. GENERATE HTML MAP ---
function generateHTMLMap(orderedStops, legs, coordinates, totalDistMiles, totalDurationMins, outputPaths) {
  const origin = encodeURIComponent(orderedStops[0].address);
  const destination = encodeURIComponent(orderedStops[orderedStops.length - 1].address);
  const waypoints = orderedStops.slice(1, -1).map(s => encodeURIComponent(s.address)).join('|');
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&waypoints=${waypoints}`;

  const colors = ['#ec028b', '#e2ab49', '#00f0ff', '#a855f7', '#10b981', '#3b82f6', '#f97316', '#e11d48'];
  orderedStops.forEach((s, idx) => {
    s.color = colors[idx % colors.length];
  });

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>RHIVE Daily Route Optimizer</title>
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <link href="https://fonts.googleapis.com/css2?family=Rubik:wght@400;600;700;800&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg-dark: #07090e;
      --card-bg: rgba(14, 18, 27, 0.92);
      --card-border: #1e293b;
      --pink: #ec028b;
      --gold: #e2ab49;
      --cyan: #00f0ff;
      --text: #f8fafc;
      --muted: #94a3b8;
    }
    * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Rubik', sans-serif; }
    body { background: var(--bg-dark); color: var(--text); overflow: hidden; height: 100vh; display: flex; flex-direction: column; }
    
    header {
      background: rgba(10, 14, 22, 0.95);
      border-bottom: 1px solid var(--card-border);
      padding: 14px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      z-index: 1000;
      backdrop-filter: blur(10px);
    }
    .brand-title { display: flex; align-items: center; gap: 12px; }
    .badge {
      background: rgba(236, 2, 139, 0.15);
      border: 1px solid var(--pink);
      color: var(--pink);
      font-size: 11px;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: 4px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    h1 { font-size: 18px; font-weight: 700; color: #fff; letter-spacing: -0.5px; }
    .metrics { display: flex; gap: 20px; font-size: 13px; }
    .metric-item { display: flex; flex-direction: column; align-items: flex-end; }
    .metric-val { font-size: 16px; font-weight: 700; color: var(--cyan); font-family: 'JetBrains Mono', monospace; }
    .metric-label { font-size: 11px; color: var(--muted); text-transform: uppercase; }

    .main-container { display: flex; flex: 1; height: calc(100vh - 65px); position: relative; }
    #map { flex: 1; height: 100%; z-index: 1; background: #0b0f19; }

    .sidebar {
      width: 420px;
      background: var(--card-bg);
      border-left: 1px solid var(--card-border);
      overflow-y: auto;
      z-index: 1000;
      display: flex;
      flex-direction: column;
      backdrop-filter: blur(12px);
    }
    .sidebar-header {
      padding: 16px 20px;
      border-bottom: 1px solid var(--card-border);
      background: rgba(15, 23, 42, 0.6);
    }
    .sidebar-title { font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: var(--pink); }
    .actions-bar {
      padding: 12px 20px;
      display: flex;
      gap: 10px;
      border-bottom: 1px solid var(--card-border);
    }
    .nav-btn {
      flex: 1;
      background: linear-gradient(135deg, #ec028b 0%, #a855f7 100%);
      color: white;
      text-decoration: none;
      text-align: center;
      padding: 10px 14px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      transition: all 0.2s ease;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      border: none;
      cursor: pointer;
    }
    .nav-btn:hover { opacity: 0.9; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(236, 2, 139, 0.4); }

    .stops-list { padding: 12px; display: flex; flex-direction: column; gap: 8px; flex: 1; overflow-y: auto; }
    .stop-card {
      background: rgba(15, 23, 42, 0.7);
      border: 1px solid #1e293b;
      border-radius: 8px;
      padding: 12px 14px;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .stop-card:hover {
      border-color: var(--pink);
      background: rgba(30, 41, 59, 0.8);
      transform: translateX(3px);
    }
    .stop-card.active {
      border-color: var(--cyan);
      box-shadow: 0 0 10px rgba(0, 240, 255, 0.25);
    }
    .stop-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
    .stop-num-badge {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: var(--pink);
      color: white;
      font-size: 12px;
      font-weight: 700;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin-right: 8px;
    }
    .stop-title { font-size: 14px; font-weight: 700; color: #fff; flex: 1; }
    .units-tag {
      font-size: 11px;
      font-weight: 700;
      color: var(--gold);
      background: rgba(226, 171, 73, 0.12);
      border: 1px solid rgba(226, 171, 73, 0.3);
      padding: 2px 6px;
      border-radius: 4px;
      font-family: 'JetBrains Mono', monospace;
    }
    .stop-addr { font-size: 12px; color: var(--muted); margin-bottom: 6px; line-height: 1.3; }
    .stop-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      font-size: 11px;
      color: #94a3b8;
      border-top: 1px solid rgba(255,255,255,0.06);
      padding-top: 6px;
      margin-top: 4px;
    }
    .meta-tag { display: inline-flex; align-items: center; gap: 4px; }
    .meta-tag strong { color: #e2e8f0; }

    .leg-divider {
      text-align: center;
      font-size: 10px;
      color: var(--muted);
      padding: 2px 0;
      font-family: 'JetBrains Mono', monospace;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
    }
    .leg-divider::before, .leg-divider::after { content: ''; flex: 1; height: 1px; background: #1e293b; }

    .leaflet-popup-content-wrapper {
      background: rgba(15, 23, 42, 0.95);
      border: 1px solid var(--pink);
      color: white;
      border-radius: 8px;
      backdrop-filter: blur(10px);
    }
    .leaflet-popup-tip { background: rgba(15, 23, 42, 0.95); border-left: 1px solid var(--pink); border-top: 1px solid var(--pink); }
    .custom-marker {
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      border: 2px solid white;
      font-weight: 800;
      color: white;
      box-shadow: 0 0 12px rgba(0,0,0,0.6);
    }
  </style>
</head>
<body>
  <header>
    <div class="brand-title">
      <div class="badge">RHIVE ROUTING ENGINE</div>
      <h1>Today's Optimized Daily Route Corridor</h1>
    </div>
    <div class="metrics">
      <div class="metric-item">
        <div class="metric-val">${orderedStops.length} STOPS</div>
        <div class="metric-label">Total Stops</div>
      </div>
      <div class="metric-item">
        <div class="metric-val">${totalDistMiles} MI</div>
        <div class="metric-label">Total Distance</div>
      </div>
      <div class="metric-item">
        <div class="metric-val">~${totalDurationMins} MIN</div>
        <div class="metric-label">Total Drive Time</div>
      </div>
    </div>
  </header>

  <div class="main-container">
    <div id="map"></div>
    
    <div class="sidebar">
      <div class="sidebar-header">
        <div class="sidebar-title">Turn-by-Turn Route Order</div>
      </div>
      
      <div class="actions-bar">
        <a class="nav-btn" target="_blank" href="${googleMapsUrl}">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="3 11 22 2 13 21 11 13 3 11"></polygon></svg>
          Launch Live Google Maps GPS
        </a>
      </div>

      <div class="stops-list" id="stopsList"></div>
    </div>
  </div>

  <script>
    const stops = ${JSON.stringify(orderedStops)};
    const legs = ${JSON.stringify(legs)};
    const coordinates = ${JSON.stringify(coordinates)};

    const map = L.map('map', { zoomControl: false });
    L.control.zoom({ position: 'topleft' }).addTo(map);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(map);

    const latLngs = coordinates.map(c => [c[1], c[0]]);
    
    L.polyline(latLngs, {
      color: '#ec028b',
      weight: 10,
      opacity: 0.35,
      lineJoin: 'round'
    }).addTo(map);

    const polyline = L.polyline(latLngs, {
      color: '#ec028b',
      weight: 4,
      opacity: 0.95,
      dashArray: '8, 6',
      lineJoin: 'round'
    }).addTo(map);

    const markers = [];

    stops.forEach((s, idx) => {
      const customIcon = L.divIcon({
        className: 'custom-div-icon',
        html: '<div class="custom-marker" style="background: ' + s.color + '; width: 28px; height: 28px; font-size: 13px;">' + s.num + '</div>',
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      const marker = L.marker([s.lat, s.lon], { icon: customIcon }).addTo(map);
      marker.bindPopup(
        '<div style="padding: 4px;">' +
          '<div style="font-size: 11px; color: ' + s.color + '; font-weight: 800; text-transform: uppercase;">STOP #' + s.num + '</div>' +
          '<h3 style="font-size: 15px; margin: 4px 0 6px 0; color: #fff;">' + s.name + '</h3>' +
          '<p style="font-size: 12px; color: #cbd5e1; margin-bottom: 6px;">' + s.address + '</p>' +
          '<div style="font-size: 11px; border-top: 1px solid #334155; padding-top: 6px; color: #94a3b8; line-height: 1.5;">' +
            (s.units ? '<div>🏢 <strong>Units:</strong> ' + s.units + '</div>' : '') +
            (s.assignee ? '<div>👤 <strong>Assignee:</strong> ' + s.assignee + '</div>' : '') +
            (s.phone ? '<div>📞 <strong>Contact:</strong> ' + s.phone + '</div>' : '') +
          '</div>' +
        '</div>'
      );
      markers.push(marker);
    });

    map.fitBounds(polyline.getBounds(), { padding: [50, 50] });

    const container = document.getElementById('stopsList');
    stops.forEach((s, i) => {
      const card = document.createElement('div');
      card.className = 'stop-card';
      card.innerHTML = 
        '<div class="stop-header">' +
          '<div style="display: flex; align-items: center;">' +
            '<span class="stop-num-badge" style="background: ' + s.color + ';">' + s.num + '</span>' +
            '<span class="stop-title">' + s.name + '</span>' +
          '</div>' +
          (s.units ? '<span class="units-tag">' + s.units + ' Units</span>' : '') +
        '</div>' +
        '<div class="stop-addr">' + s.address + '</div>' +
        '<div class="stop-meta">' +
          (s.assignee ? '<span class="meta-tag">👤 <strong>' + s.assignee + '</strong></span>' : '') +
          (s.phone ? '<span class="meta-tag">📞 <strong>' + s.phone + '</strong></span>' : '') +
        '</div>';

      card.addEventListener('click', () => {
        document.querySelectorAll('.stop-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        map.flyTo([s.lat, s.lon], 15, { duration: 1 });
        markers[i].openPopup();
      });

      container.appendChild(card);

      if (i < legs.length) {
        const legDiv = document.createElement('div');
        legDiv.className = 'leg-divider';
        legDiv.innerHTML = '↓ ' + legs[i].dist + ' (' + legs[i].time + ') ↓';
        container.appendChild(legDiv);
      }
    });
  </script>
</body>
</html>`;

  for (const p of outputPaths) {
    fs.mkdirSync(path.dirname(p), { recursive: true });
    fs.writeFileSync(p, html, 'utf8');
  }

  return googleMapsUrl;
}

// --- 5. GOOGLE CHAT DISPATCH ---
async function dispatchToGoogleChat(messageText, targetSpaces = ['spaces/AAQA_y6BMAI']) {
  if (!fs.existsSync(CHAT_TOKEN_PATH) || !fs.existsSync(CHAT_CREDENTIALS_PATH)) {
    throw new Error('Google Chat OAuth tokens not found.');
  }

  const content = fs.readFileSync(CHAT_CREDENTIALS_PATH, 'utf8');
  const credentials = JSON.parse(content);
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
  const token = fs.readFileSync(CHAT_TOKEN_PATH, 'utf8');
  oAuth2Client.setCredentials(JSON.parse(token));

  const chat = google.chat({ version: 'v1', auth: oAuth2Client });

  const results = [];
  for (const space of targetSpaces) {
    try {
      const res = await chat.spaces.messages.create({
        parent: space,
        requestBody: { text: messageText }
      });
      results.push({ space, status: 'success', messageId: res.data.name });
    } catch (e) {
      results.push({ space, status: 'error', error: e.message });
    }
  }
  return results;
}

// --- 6. MAIN CLI ENTRY POINT ---
async function main() {
  const args = process.argv.slice(2);
  const isDispatch = args.includes('--dispatch');
  const dateArg = args.find(a => a.startsWith('--date='))?.split('=')[1] || 'today';
  const excludeArg = args.find(a => a.startsWith('--exclude='))?.split('=')[1];
  const outputHtmlPath = path.join(process.cwd(), 'daily_route_map.html');

  console.log('🚀 Executing RHIVE Fast Route Engine...');
  
  let rawStops = await fetchCalendarEvents(dateArg);
  if (rawStops.length === 0) {
    console.log('❌ No calendar appointments with locations found for date:', dateArg);
    return;
  }

  if (excludeArg) {
    const excludes = excludeArg.toLowerCase().split(',');
    rawStops = rawStops.filter((s, idx) => {
      const numMatch = excludes.includes(String(idx + 1));
      const nameMatch = excludes.some(ex => s.name.toLowerCase().includes(ex));
      return !numMatch && !nameMatch;
    });
  }

  console.log(`📍 Found ${rawStops.length} stops. Geocoding addresses...`);
  const validStops = [];
  for (const s of rawStops) {
    const geo = await geocodeAddress(s.address);
    if (geo) {
      validStops.push({ ...s, lat: geo.lat, lon: geo.lon });
    } else {
      console.warn('⚠️ Could not geocode address:', s.address);
    }
  }

  if (validStops.length < 2) {
    console.log('❌ Need at least 2 valid geocoded stops to optimize a route.');
    return;
  }

  console.log(`🧭 Optimizing TSP route for ${validStops.length} stops via OSRM...`);
  const tspResult = await solveTSP(validStops);

  const outPaths = [outputHtmlPath];
  const googleMapsUrl = generateHTMLMap(
    tspResult.orderedStops,
    tspResult.legs,
    tspResult.coordinates,
    tspResult.totalDistanceMiles,
    tspResult.totalDurationMins,
    outPaths
  );

  console.log('\n=============================================');
  console.log(`✅ ROUTE OPTIMIZATION COMPLETE (${tspResult.orderedStops.length} Stops)`);
  console.log(`📏 Total Distance: ${tspResult.totalDistanceMiles} miles`);
  console.log(`⏱️ Total Transit Time: ~${tspResult.totalDurationMins} minutes`);
  console.log('=============================================');

  tspResult.orderedStops.forEach((s) => {
    console.log(`${s.num}. ${s.name} (${s.address}) ${s.units ? '[' + s.units + ' Units]' : ''} [${s.assignee}]`);
  });

  console.log('\n🗺️ Live Google Maps Multi-Stop Link:');
  console.log(googleMapsUrl);

  const stopListFormatted = tspResult.orderedStops.map(s => 
    `${s.num}. *${s.name}* (${s.address.split(',')[0]})${s.units ? ' — ' + s.units + ' Units' : ''} | _${s.assignee}_`
  ).join('\n');

  const chatMessage = `📍 *Today's Optimized Route (${tspResult.orderedStops.length} Stops • ${tspResult.totalDistanceMiles} Mi Total):*

${stopListFormatted}

🗺️ <${googleMapsUrl}|🚀 Launch Live Google Maps GPS>

(Message dispatched by Michael's Omni-Clone)`;

  if (isDispatch) {
    console.log('\n📡 Dispatching directly to Google Chat...');
    const dispatchResults = await dispatchToGoogleChat(chatMessage);
    console.log('Dispatch Results:', JSON.stringify(dispatchResults, null, 2));
  } else {
    console.log('\n💡 Google Chat Draft Ready. Run with --dispatch to send.');
  }
}

main().catch(console.error);
