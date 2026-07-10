export interface Place {
  address: string;
  latitude: number;
  longitude: number;
}

export interface RoofFacet {
  id: string;
  areaMeters: number;
  pitchDegrees: number;
}

export interface Building {
  id: string;
  facets: RoofFacet[];
  totalAreaMeters: number;
  isOverridden?: boolean;
  overrideSq?: number;
}

export interface BuildingData {
  buildings: Building[];
  yearConstructed: number;
}

export type RoofLayers = '1' | '2' | '3' | '4' | 'IDK' | 'Other';
export type EaveOverhang = 'None' | 'Small' | 'Medium' | 'Large';
export type RoofUpgrade = 'TruDefinition® Duration®' | 'TruDefinition® Duration FLEX®' | 'GAF Woodland®' | 'GAF Grand Sequoia®';
export type FlatRoofingType = '.060MIL TPO' | '.080MIL TPO' | '.060MIL PVC' | '.080MIL PVC';
export type GutterStyle = 'K-Style' | 'Box/Square' | 'Half Round';
export type GutterSize = '5"' | '6"';
export type FlatRoofingColor = 'White' | 'Gray' | 'Tan' | 'Brown';


export interface SurveyState {
  latitude: number;
  longitude: number;
  includedBuildingIds: string[];
  totalSq: number; // Editable by user
  roofLayers: RoofLayers;
  roofFeatures: {
    chimneys: number;
    swampCoolers: number;
    skylights: number;
  };
  gutters: {
    enabled: boolean;
    length: number;
    miters: number;
    downspouts1Story: number;
    downspouts2Story: number;
    downspouts3Story: number;
    downspouts4Story: number;
  };
  heatTrace: {
    enabled: boolean;
    length: number;
    downspouts1Story: number;
    downspouts2Story: number;
    downspouts3Story: number;
    downspouts4Story: number;
    eaveOverhang: EaveOverhang;
  };
  roofUpgrade: RoofUpgrade;
  asphaltRoofingEnabled: boolean;
  shingleColor: string;
  flatRoofingType: FlatRoofingType;
  flatRoofingEnabled: boolean;
  flatRoofingColor: FlatRoofingColor;
  additionalOptions: {
    chimneyPan: boolean;
    chimneyShroud: boolean;
    highProfileHipRidge: boolean;
    wValleyMetal: boolean;
  };
  gutterStyle: GutterStyle;
  gutterSize: GutterSize;
}

export interface CostBreakdown {
  materials: number;
  labor: number;
  overhead: number;
  profit: number;
  total: number;
}

export interface CalculationInputs {
  buildingData: BuildingData;
  surveyState: SurveyState;
}

export interface CalculationResult {
  baseSq: number;
  finalSq: number; // Editable value from surveyState
  asphaltSq: number;
  flatRoofSq: number;
  estimatedLayers: number;
  pitchBreakdown: { pitch: number; sq: number }[];
  roofEstimate: {
    breakdown: CostBreakdown;
    upgrades: {
      'TruDefinition® Duration FLEX®': number;
      'GAF Woodland®': number;
      'GAF Grand Sequoia®': number;
    };
    totalRetail: number;
    totalFacets: number;
  };
  asphaltEstimate: CostBreakdown;
  gutterEstimate: CostBreakdown;
  heatTraceEstimate: CostBreakdown;
  flatRoofingEstimate: CostBreakdown;
  flatRoofingUpgrades: Record<FlatRoofingType, number>;
  flatRoofColorAddonCost: number;
  liveTotal: number;
}

export interface Pricing {
  costPerSqByPitch: Record<string, {
    materials: number;
    labor: number;
    overhead: number;
  }>;
  profitMargin: number;
  addons: {
    layers: {
      '1': number; // Add '1' for type consistency
      '2': number;
      '3': number;
      '4': number;
      'IDK': number;
      'Other': number;
    };
    features: {
      chimney: number;
      swampCooler: number;
      skylight: number;
    };
  };
  upgrades: {
    'TruDefinition® Duration®': number;
    'TruDefinition® Duration FLEX®': number;
    'GAF Woodland®': number;
    'GAF Grand Sequoia®': number;
  };
  flatRoofing: Record<FlatRoofingType, {
    materials: number;
    labor: number;
    overhead: number;
  }>;
  flatRoofingColorAddons: Record<FlatRoofingColor, number>;
  gutters: {
    perFoot: number;
    perMiter: number;
    downspout1Story: number;
    downspout2Story: number;
    downspout3Story: number;
    downspout4Story: number;
    styleMultipliers: Record<GutterStyle, number>;
    sizeMultipliers: Record<GutterSize, number>;
  };
  heatTrace: {
    perFoot: number;
    downspout1Story: number;
    downspout2Story: number;
    downspout3Story: number;
    downspout4Story: number;
    eaveOverhang: {
      'None': number;
      'Small': number;
      'Medium': number;
      'Large': number;
    }
  };
}

// Fix: Add missing type definitions
export interface Point3D {
  x: number;
  y: number;
  z: number;
}

export interface RoofSegment {
    pitchDegrees: number;
    azimuthDegrees: number;
    stats: {
        areaMeters: number;
    };
    vertices: Point3D[];
}

export interface SolarApiData {
    solarPotential: {
        wholeRoofStats: {
            areaMeters: number;
        };
        roofSegmentStats: RoofSegment[];
    };
}

export interface Edge {
  p1: Point3D;
  p2: Point3D;
  length: number;
  segmentId: number;
}

export interface RoofReport {
  totalAreaSqFt: number;
  totalSquares: number;
  wasteFactor: number;
  totalSquaresWithWaste: number;
  dominantPitch: number;
  linearMeasurements: {
    ridges: number;
    hips: number;
    valleys: number;
    eaves: number;
    rakes: number;
  };
  materialList: {
    shingleBundles: number;
    starterShingles: number;
    ridgeCapShingles: number;
    iceAndWaterShield: number;
    underlaymentRolls: number;
    dripEdge: number;
  };
  pitchAnalysis: {
      pitch: number;
      areaSqFt: number;
  }[];
}