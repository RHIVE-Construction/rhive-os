import type { Place, BuildingData, RoofFacet, Building } from '../types';
import coachmanSolarData from '../data/coachman_solar_response.json';
import garageSolarData from '../data/garage_solar_response.json';

// Simple pseudo-random generator based on coordinates
const pseudoRandom = (seed1: number, seed2: number) => {
  let s1 = Math.sin(seed1) * 10000;
  let s2 = Math.sin(seed2) * 10000;
  s1 = s1 - Math.floor(s1);
  s2 = s2 - Math.floor(s2);
  return (s1 + s2) / 2;
};

export function getInitialPolygonVertices(lat: number, lng: number, address: string, index: number): { lat: number; lng: number }[] {
  const lower = address.toLowerCase();
  const isMemorial = lower.includes('memorial') || (Math.abs(lat - 40.571939) < 0.001 && Math.abs(lng - -111.964403) < 0.001);
  const isNephi = lower.includes('nephi') || (Math.abs(lat - 39.7270586) < 0.005 && Math.abs(lng - -111.8345244) < 0.005);
  const isEmerson = lower.includes('emerson') || (Math.abs(lat - 40.7376366) < 0.005 && Math.abs(lng - -111.8785726) < 0.005);
  const isCoachman = lower.includes('coachman') || (Math.abs(lat - 40.612) < 0.01 && Math.abs(lng - -111.815) < 0.01);
  
  if (isCoachman && index > 1) {
    const garageLat = 40.6126116;
    const garageLng = -111.8222867;
    const widthMeters = 7.45;
    const heightMeters = 7.45;
    const angleDeg = -32.75; // Rotation angle in degrees (counter-clockwise)
    const theta = angleDeg * Math.PI / 180;
    
    const latConv = 111111;
    const lngConv = 111111 * Math.cos(garageLat * Math.PI / 180);
    
    const dx1 = -widthMeters / 2;
    const dy1 = heightMeters / 2;
    
    const dx2 = widthMeters / 2;
    const dy2 = heightMeters / 2;
    
    const dx3 = widthMeters / 2;
    const dy3 = -heightMeters / 2;
    
    const dx4 = -widthMeters / 2;
    const dy4 = -heightMeters / 2;
    
    const rotate = (dx: number, dy: number) => {
      const rx = dx * Math.cos(theta) - dy * Math.sin(theta);
      const ry = dx * Math.sin(theta) + dy * Math.cos(theta);
      return {
        lat: garageLat + ry / latConv,
        lng: garageLng + rx / lngConv
      };
    };
    
    return [
      rotate(dx1, dy1), // Top-Left
      rotate(dx2, dy2), // Top-Right
      rotate(dx3, dy3), // Bottom-Right
      rotate(dx4, dy4)  // Bottom-Left
    ];
  }

  if (index === 1) { // Primary building
    if (isCoachman) {
      return [
        { lat: 40.612622, lng: -111.822180 }, // 1. Top-Left
        { lat: 40.612622, lng: -111.822005 }, // 2. Top-Notch-Start
        { lat: 40.612590, lng: -111.822005 }, // 3. Notch-Depth-South
        { lat: 40.612590, lng: -111.821955 }, // 4. Top-Right
        { lat: 40.612536, lng: -111.821955 }, // 5. Bottom-Right
        { lat: 40.612536, lng: -111.822115 }, // 6. Proj-Start
        { lat: 40.612513, lng: -111.822115 }, // 7. Proj-Bottom-Right
        { lat: 40.612513, lng: -111.822152 }, // 8. Proj-Bottom-Left
        { lat: 40.612536, lng: -111.822152 }, // 9. Proj-Top-Left
        { lat: 40.612536, lng: -111.822180 }  // 10. Bottom-Left
      ];
    }
    if (isMemorial) {
      return [
        { lat: lat + 0.00008, lng: lng - 0.00014 },
        { lat: lat + 0.00008, lng: lng + 0.00014 },
        { lat: lat - 0.00008, lng: lng + 0.00014 },
        { lat: lat - 0.00008, lng: lng - 0.00014 },
      ];
    }
    if (isNephi) {
      // L-shaped roof polygon
      return [
        { lat: lat + 0.00008, lng: lng - 0.00010 },
        { lat: lat + 0.00008, lng: lng + 0.00010 },
        { lat: lat - 0.00004, lng: lng + 0.00010 },
        { lat: lat - 0.00004, lng: lng + 0.00002 },
        { lat: lat - 0.00010, lng: lng + 0.00002 },
        { lat: lat - 0.00010, lng: lng - 0.00010 },
      ];
    }
    if (isEmerson) {
      return [
        { lat: lat + 0.00008, lng: lng - 0.00008 },
        { lat: lat + 0.00008, lng: lng + 0.00008 },
        { lat: lat - 0.00008, lng: lng + 0.00008 },
        { lat: lat - 0.00008, lng: lng - 0.00008 },
      ];
    }
  }
  
  // Default box: 16m x 12m for primary (192 sqm), 9m x 7m for secondary outbuildings (63 sqm)
  const widthMeters = index === 1 ? 16 : 9;
  const heightMeters = index === 1 ? 12 : 7;
  
  const latOffset = (heightMeters / 2) / 111111;
  const lngOffset = (widthMeters / 2) / (111111 * Math.cos(lat * Math.PI / 180));
  
  return [
    { lat: lat + latOffset, lng: lng - lngOffset },
    { lat: lat + latOffset, lng: lng + lngOffset },
    { lat: lat - latOffset, lng: lng + lngOffset },
    { lat: lat - latOffset, lng: lng - lngOffset },
  ];
}

export function generateMockBuildingData(place: Place): BuildingData {
  const lowerCaseAddress = place.address.toLowerCase();
  const lat = place.latitude;
  const lng = place.longitude;

  // Special case for the specific address (Demo Data)
  if (lowerCaseAddress.includes('10437') || lowerCaseAddress.includes('shady plum')) {
    return {
      buildings: [
        {
          id: 'main_house',
          totalAreaMeters: 200,
          lat,
          lng,
          polygonVertices: getInitialPolygonVertices(lat, lng, place.address, 1),
          facets: [
            { id: 'f1', areaMeters: 50, pitchDegrees: 22.6 }, // 6/12
            { id: 'f2', areaMeters: 50, pitchDegrees: 22.6 },
            { id: 'f3', areaMeters: 50, pitchDegrees: 33.7 }, // 8/12
            { id: 'f4', areaMeters: 50, pitchDegrees: 33.7 },
          ],
        },
        {
          id: 'garage',
          totalAreaMeters: 39.48, // ~4.25 SQ
          lat: lat - 0.00012,
          lng: lng + 0.00012,
          polygonVertices: getInitialPolygonVertices(lat - 0.00012, lng + 0.00012, place.address, 2),
          facets: [
            { id: 'g1', areaMeters: 19.74, pitchDegrees: 18.4 }, // 4/12
            { id: 'g2', areaMeters: 19.74, pitchDegrees: 18.4 },
          ],
        },
      ],
      yearConstructed: 2005,
    };
  } 

  // Specific case for 10850 Beckstead Ln (Large Residential)
  if (lowerCaseAddress.includes('10850') || lowerCaseAddress.includes('beckstead')) {
    return {
      buildings: [
        {
          id: 'main_estate',
          totalAreaMeters: 395, // ~42.5 SQ total
          lat,
          lng,
          polygonVertices: getInitialPolygonVertices(lat, lng, place.address, 1),
          facets: [
            { id: 'f1', areaMeters: 80, pitchDegrees: 26.6 }, // 6/12
            { id: 'f2', areaMeters: 80, pitchDegrees: 26.6 },
            { id: 'f3', areaMeters: 60, pitchDegrees: 18.4 }, // 4/12
            { id: 'f4', areaMeters: 60, pitchDegrees: 18.4 },
            { id: 'f5', areaMeters: 50, pitchDegrees: 33.7 }, // 8/12 (Dormers)
            { id: 'f6', areaMeters: 65, pitchDegrees: 0 },    // Flat section
          ],
        }
      ],
      yearConstructed: 1998,
    };
  }
  
  // Default Generator for any other address
  const isMemorial = lowerCaseAddress.includes('memorial') || (Math.abs(lat - 40.571939) < 0.001 && Math.abs(lng - -111.964403) < 0.001);
  const isNephi = lowerCaseAddress.includes('nephi') || (Math.abs(lat - 39.7270586) < 0.005 && Math.abs(lng - -111.8345244) < 0.005);
  const isEmerson = lowerCaseAddress.includes('emerson') || (Math.abs(lat - 40.7376366) < 0.005 && Math.abs(lng - -111.8785726) < 0.005);
  const isCoachman = lowerCaseAddress.includes('coachman') || (Math.abs(lat - 40.612) < 0.01 && Math.abs(lng - -111.815) < 0.01);

  if (isCoachman) {
    const baseArea = coachmanSolarData.solarPotential.wholeRoofStats.areaMeters2;
    const facets = coachmanSolarData.solarPotential.roofSegmentStats.map((seg, j) => ({
      id: `gen_f${j}`,
      areaMeters: seg.stats.areaMeters2,
      pitchDegrees: seg.pitchDegrees,
    }));
    return {
      buildings: [{
        id: 'Main Structure',
        totalAreaMeters: baseArea,
        facets: facets,
        lat,
        lng,
        polygonVertices: getInitialPolygonVertices(lat, lng, place.address, 1)
      }],
      yearConstructed: 1992,
    };
  }

  if (isMemorial) {
    const baseArea = 245.7; // ~24.57 SQ total
    const facets = [];
    for (let j = 0; j < 8; j++) {
      facets.push({
        id: `gen_f${j}`,
        areaMeters: baseArea / 8,
        pitchDegrees: 26.57, // 6/12 pitch
      });
    }
    return {
      buildings: [{
        id: 'Main Structure',
        totalAreaMeters: baseArea,
        facets: facets,
        lat,
        lng,
        polygonVertices: getInitialPolygonVertices(lat, lng, place.address, 1)
      }],
      yearConstructed: 1995,
    };
  }

  if (isNephi) {
    const baseArea = 299.1; // ~29.91 SQ
    const facets = [];
    for (let j = 0; j < 6; j++) {
      facets.push({
        id: `gen_f${j}`,
        areaMeters: baseArea / 6,
        pitchDegrees: 26.57, // 6/12 pitch
      });
    }
    return {
      buildings: [{
        id: 'Main Structure',
        totalAreaMeters: baseArea,
        facets: facets,
        lat,
        lng,
        polygonVertices: getInitialPolygonVertices(lat, lng, place.address, 1)
      }],
      yearConstructed: 1982,
    };
  }

  if (isEmerson) {
    const baseArea = 239.6; // ~23.96 SQ
    const facets = [];
    for (let j = 0; j < 9; j++) {
      facets.push({
        id: `gen_f${j}`,
        areaMeters: baseArea / 9,
        pitchDegrees: 26.57, // 6/12 pitch
      });
    }
    return {
      buildings: [{
        id: 'Main Structure',
        totalAreaMeters: baseArea,
        facets: facets,
        lat,
        lng,
        polygonVertices: getInitialPolygonVertices(lat, lng, place.address, 1)
      }],
      yearConstructed: 1965,
    };
  }

  const random = pseudoRandom(lat, lng);
  const yearConstructed = 1970 + Math.floor(random * 50);
  const baseArea = 192; // Default 192 sqm (16mx12m)
  const numFacets = 2; // Gable roof matches fallback diagram exactly!
  const facets = [];
  
  for (let j = 0; j < numFacets; j++) {
    facets.push({
      id: `gen_f${j}`,
      areaMeters: baseArea / numFacets,
      pitchDegrees: 26.57, // 6/12 pitch (26.57 degrees)
    });
  }

  return { 
    buildings: [{
        id: 'Main Structure',
        totalAreaMeters: baseArea,
        facets: facets,
        lat,
        lng,
        polygonVertices: getInitialPolygonVertices(lat, lng, place.address, 1)
    }], 
    yearConstructed 
  };
}

export function createTaggedBuilding(index: number, areaSq: number, pitchIn12: number): Building {
  const id = `BLD_${index}`;
  const totalAreaMeters = areaSq * 9.290304;
  const pitchDegrees = Math.atan(pitchIn12 / 12) * 180 / Math.PI;

  const facets: RoofFacet[] = [
    {
      id: `${id}_f1`,
      areaMeters: totalAreaMeters / 2,
      pitchDegrees: pitchDegrees
    },
    {
      id: `${id}_f2`,
      areaMeters: totalAreaMeters / 2,
      pitchDegrees: pitchDegrees
    }
  ];

  return {
    id,
    totalAreaMeters,
    facets
  };
}

export function generateBuildingFromLatLng(lat: number, lng: number, index: number): Building {
  const isCoachman = (Math.abs(lat - 40.612) < 0.01 && Math.abs(lng - -111.815) < 0.01);

  if (isCoachman && index > 1) {
    const finalLat = 40.6126116;
    const finalLng = -111.8222867;
    const baseArea = garageSolarData.solarPotential.wholeRoofStats.areaMeters2;
    const facets = garageSolarData.solarPotential.roofSegmentStats.map((seg, j) => ({
      id: `BLD_${index}_f${j}`,
      areaMeters: seg.stats.areaMeters2,
      pitchDegrees: seg.pitchDegrees,
    }));

    return {
      id: `BLD_${index}`,
      totalAreaMeters: baseArea,
      facets: facets,
      lat: finalLat,
      lng: finalLng,
      polygonVertices: getInitialPolygonVertices(finalLat, finalLng, '', index)
    };
  }

  const baseArea = 63;
  const numFacets = 2; // Outbuildings/garages are simple gables with 2 facets
  const facets: RoofFacet[] = [];
  const pitchDegrees = 18.43; // 4/12 pitch (18.43 degrees)

  for (let j = 0; j < numFacets; j++) {
    facets.push({
      id: `BLD_${index}_f${j}`,
      areaMeters: baseArea / numFacets,
      pitchDegrees: pitchDegrees,
    });
  }

  return {
    id: `BLD_${index}`,
    totalAreaMeters: baseArea,
    facets: facets,
    lat: lat,
    lng: lng,
    polygonVertices: getInitialPolygonVertices(lat, lng, '', index)
  };
}

export function buildBuildingFromSolarData(solarData: any, clickedLat: number, clickedLng: number, index: number): Building {
  const centerLat = solarData.center?.latitude || clickedLat;
  const centerLng = solarData.center?.longitude || clickedLng;
  const sw = solarData.boundingBox?.sw;
  const ne = solarData.boundingBox?.ne;
  
  let W_bbox = 10;
  let H_bbox = 10;
  if (sw && ne) {
    const latConv = 111111;
    const lngConv = 111111 * Math.cos(centerLat * Math.PI / 180);
    W_bbox = Math.abs(ne.longitude - sw.longitude) * lngConv;
    H_bbox = Math.abs(ne.latitude - sw.latitude) * latConv;
  }
  
  let dominantAzimuth = 0;
  let maxArea = 0;
  if (solarData.solarPotential?.roofSegmentStats) {
    solarData.solarPotential.roofSegmentStats.forEach((seg: any) => {
      const area = seg.stats?.areaMeters2 || 0;
      if (area > maxArea) {
        maxArea = area;
        dominantAzimuth = seg.azimuthDegrees || 0;
      }
    });
  }
  
  const mod = (n: number, m: number) => ((n % m) + m) % m;
  const mappedAngleDeg = mod(dominantAzimuth + 90, 180) - 90;
  const theta = mappedAngleDeg * Math.PI / 180;
  
  const area = solarData.solarPotential?.wholeRoofStats?.groundAreaMeters2 || 
               solarData.solarPotential?.wholeRoofStats?.areaMeters2 || 
               (W_bbox * H_bbox * 0.7);
               
  const c = Math.abs(Math.cos(theta));
  const s = Math.abs(Math.sin(theta));
  let widthMeters = 0;
  let heightMeters = 0;

  if (Math.abs(c * c - s * s) > 0.15) {
    widthMeters = (c * W_bbox - s * H_bbox) / (c * c - s * s);
    heightMeters = (c * H_bbox - s * W_bbox) / (c * c - s * s);
  }

  if (widthMeters <= 2 || heightMeters <= 2) {
    const r = W_bbox / H_bbox;
    widthMeters = Math.sqrt(area * r);
    heightMeters = Math.sqrt(area / r);
  }
  
  widthMeters = Math.max(3, Math.min(widthMeters, 60));
  heightMeters = Math.max(3, Math.min(heightMeters, 60));
  
  const latConv = 111111;
  const lngConv = 111111 * Math.cos(centerLat * Math.PI / 180);
  
  const dx1 = -widthMeters / 2;
  const dy1 = heightMeters / 2;
  const dx2 = widthMeters / 2;
  const dy2 = heightMeters / 2;
  const dx3 = widthMeters / 2;
  const dy3 = -heightMeters / 2;
  const dx4 = -widthMeters / 2;
  const dy4 = -heightMeters / 2;
  
  const rotate = (dx: number, dy: number) => {
    const rx = dx * Math.cos(theta) - dy * Math.sin(theta);
    const ry = dx * Math.sin(theta) + dy * Math.cos(theta);
    return {
      lat: centerLat + ry / latConv,
      lng: centerLng + rx / lngConv
    };
  };

  const polygonVertices = [
    rotate(dx1, dy1),
    rotate(dx2, dy2),
    rotate(dx3, dy3),
    rotate(dx4, dy4)
  ];
  
  const segments = solarData.solarPotential?.roofSegmentStats || [];
  const facets = segments.length > 0 
    ? segments.map((seg: any, j: number) => ({
        id: `BLD_${index}_f${j}`,
        areaMeters: seg.stats?.areaMeters2 || (area / segments.length),
        pitchDegrees: seg.pitchDegrees || 22.6,
      }))
    : [
        { id: `BLD_${index}_f1`, areaMeters: area / 2, pitchDegrees: 18.43 },
        { id: `BLD_${index}_f2`, areaMeters: area / 2, pitchDegrees: 18.43 }
      ];
      
  return {
    id: `BLD_${index}`,
    totalAreaMeters: area,
    facets,
    lat: centerLat,
    lng: centerLng,
    polygonVertices
  };
}
