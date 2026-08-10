
import type { SurveyState } from '../types';

export const INITIAL_SURVEY_STATE: SurveyState = {
  latitude: 40.7608, // Default to a central location
  longitude: -111.891,
  includedBuildingIds: [],
  totalSq: 0,
  roofLayers: '1',
  roofFeatures: {
    chimneys: 0,
    swampCoolers: 0,
    skylights: 0,
  },
  flatRoofFeatures: {
    roofCurbSmall: 0,
    roofCurbLarge: 0,
    parapetSq: 0,
  },
  gutters: {
    enabled: false,
    length: 0,
    miters: 0,
    downspouts1Story: 0,
    downspouts2Story: 0,
    downspouts3Story: 0,
    downspouts4Story: 0,
    style: 'K-Style',
    size: '5"',
  },
  heatTrace: {
    enabled: false,
    length: 0,
    downspouts1Story: 0,
    downspouts2Story: 0,
    downspouts3Story: 0,
    downspouts4Story: 0,
    eaveOverhang: 'Medium',
  },
  roofUpgrade: 'TruDefinition® Duration®',
  asphaltRoofingEnabled: true,
  shingleColor: 'Brownwood',
  flatRoofingType: '.060MIL TPO',
  flatRoofingEnabled: true,
  flatRoofingColor: 'White',
  additionalOptions: {
    chimneyPan: false,
    chimneyShroud: false,
    highProfileHipRidge: false,
    wValleyMetal: false,
  },
};

// Conversion Factors
export const METERS_TO_FEET = 3.28084;
export const SQ_METERS_TO_SQ_FEET = METERS_TO_FEET * METERS_TO_FEET;
export const SQ_FEET_PER_SQUARE = 100;
