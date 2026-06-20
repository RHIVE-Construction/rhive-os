import type { Place, BuildingData, RoofFacet, Building } from '../types';

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
  
  if (index === 1) { // Primary building
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
  const baseArea = 63; // 9m x 7m = 63 sqm
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
    lat,
    lng,
    polygonVertices: getInitialPolygonVertices(lat, lng, '', index)
  };
}
