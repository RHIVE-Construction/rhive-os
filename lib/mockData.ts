
import type { Place, BuildingData, RoofFacet, Building } from '../types';

// Simple pseudo-random generator based on coordinates
const pseudoRandom = (seed1: number, seed2: number) => {
  let s1 = Math.sin(seed1) * 10000;
  let s2 = Math.sin(seed2) * 10000;
  s1 = s1 - Math.floor(s1);
  s2 = s2 - Math.floor(s2);
  return (s1 + s2) / 2;
};

export function generateMockBuildingData(place: Place): BuildingData {
  const lowerCaseAddress = place.address.toLowerCase();

  // Special case for the specific address (Demo Data)
  if (lowerCaseAddress.includes('10437') || lowerCaseAddress.includes('shady plum')) {
    return {
      buildings: [
        {
          id: 'main_house',
          totalAreaMeters: 200,
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
  const random = pseudoRandom(place.latitude, place.longitude);
  const yearConstructed = 1970 + Math.floor(random * 50);
  
  // Generate realistic facets for the "Solar API" simulation
  const baseArea = 250 + random * 100; // Meters
  const numFacets = 6 + Math.floor(random * 6); // 6 to 12 facets
  const facets = [];
  
  for (let j = 0; j < numFacets; j++) {
    const facetArea = baseArea / numFacets;
    // Distribute pitches: Some steep, some low
    const isSteep = Math.random() > 0.5;
    const pitchDegrees = isSteep ? 30 + (Math.random() * 10) : 15 + (Math.random() * 10); 
    
    facets.push({
      id: `gen_f${j}`,
      areaMeters: facetArea,
      pitchDegrees: pitchDegrees,
    });
  }

  return { 
    buildings: [{
        id: 'Main Structure',
        totalAreaMeters: baseArea,
        facets: facets
    }], 
    yearConstructed 
  };
}

export function createTaggedBuilding(index: number, areaSq: number, pitchIn12: number): Building {
  const id = `BLD_${index}`;
  const totalAreaMeters = areaSq * 9.290304; // 1 SQ = 100 sq ft = 9.290304 sq meters
  
  // Convert pitch in x/12 to degrees
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
  const random = pseudoRandom(lat, lng);
  // Simulating an outbuilding/secondary structure size based on coordinates (e.g. 40 to 140 sqm, ~4.3 to 15 SQ)
  const baseArea = 40 + random * 100;
  const numFacets = 2 + Math.floor(random * 4); // 2 to 6 facets
  const facets: RoofFacet[] = [];

  for (let j = 0; j < numFacets; j++) {
    const facetArea = baseArea / numFacets;
    const isSteep = random > 0.5;
    // pitches in degrees: e.g. 4/12 (18.4) to 6/12 (22.6)
    const pitchDegrees = isSteep ? 22.6 + (j % 2) * 4 : 18.4 + (j % 2) * 4;
    
    facets.push({
      id: `BLD_${index}_f${j}`,
      areaMeters: facetArea,
      pitchDegrees: pitchDegrees,
    });
  }

  return {
    id: `BLD_${index}`,
    totalAreaMeters: baseArea,
    facets: facets,
    lat,
    lng
  };
}

