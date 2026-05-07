

// PlexusShape types
export interface Dot {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

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
  totalSq: number;
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
    style: GutterStyle;
    size: GutterSize;
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
  finalSq: number;
  asphaltSq: number;
  flatRoofSq: number;
  estimatedLayers: number;
  dominantPitch: number;
  pitchBreakdown: { pitch: number; sq: number }[];
  roofEstimate: {
    breakdown: CostBreakdown;
    upgrades: Record<string, number>;
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
    layers: Record<string, number>;
    features: {
      chimney: number;
      swampCooler: number;
      skylight: number;
    };
  };
  upgrades: Record<string, number>;
  flatRoofing: Record<FlatRoofingType, {
    materials: number;
    labor: number;
    overhead: number;
  }>;
  flatRoofingColorAddons: Record<string, number>;
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
    eaveOverhang: Record<string, number>;
  };
}

// Types for App Structure
export type UserType = 'Admin' | 'Employee' | 'Customer' | 'Contractor' | 'Supplier' | 'Public' | 'Super Admin';

export interface User {
    id: string;
    name: string;
    role: UserType;
    email?: string;
    phone?: string;
    avatarUrl?: string;
    password_hash?: string;
}

export interface Project {
  _id: string;
  name: string;
  property_id: string;
  account_id: string;
  project_type: 'Residential' | 'Commercial' | 'Government';
  current_stage: string;
  status: string;
  last_updated?: string;
  assigned_contractor_id?: string;
  quote?: {
    total: number;
    status: 'Draft' | 'Sent' | 'Approved' | 'Rejected';
    items: { name: string; cost: number }[];
  };
  compliance?: {
    solicitation_num: string;
    wage_determination: string;
    certified_payroll_status: boolean;
  };
}

export interface Property {
  _id: string;
  address_full: string;
  owner_id: string;
  type: 'Residential' | 'Commercial' | 'Government';
  coordinates: { lat: number; lng: number };
  features: string[];
}

export type ProjectStage = 
    | 'Stage 1: LEAD (Intake)'
    | 'Stage 2: ESTIMATE (Property Data)'
    | 'Stage 3: QUOTE (Pricing Options)'
    | 'Stage 4: SIGN & VERIFY (Agreement)'
    | 'Stage 5: SCHEDULE (Queue)'
    | 'Stage 6: PRE-INSTALLATION (Prep)'
    | 'Stage 7: INSTALL (In Progress)'
    | 'Stage 8: PUNCH LIST (Quality Control)'
    | 'Stage 9: INVOICING (Balance Due)'
    | 'Stage 10: COMPLETED (Paid)'
    | 'Stage 11: PAST CUSTOMER (Referral System)';

export const PROJECT_STAGES_ORDER: ProjectStage[] = [
    'Stage 1: LEAD (Intake)',
    'Stage 2: ESTIMATE (Property Data)',
    'Stage 3: QUOTE (Pricing Options)',
    'Stage 4: SIGN & VERIFY (Agreement)',
    'Stage 5: SCHEDULE (Queue)',
    'Stage 6: PRE-INSTALLATION (Prep)',
    'Stage 7: INSTALL (In Progress)',
    'Stage 8: PUNCH LIST (Quality Control)',
    'Stage 9: INVOICING (Balance Due)',
    'Stage 10: COMPLETED (Paid)',
    'Stage 11: PAST CUSTOMER (Referral System)'
];

export interface Page {
    id: string;
    name: string;
    userType: UserType | 'All';
    description?: string;
    category?: string;
    parentId?: string;
}

export interface PageGroup {
    userType: UserType | 'All';
    label?: string;
    pages: Page[];
}

// New Types for Estimates
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

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  role: string;
  isPrimary: boolean;
  existingUserId?: string;
  affiliations: string[];
  responsibilities: string[];
  preferredContactMethod?: 'Phone' | 'Text' | 'Email';
}
