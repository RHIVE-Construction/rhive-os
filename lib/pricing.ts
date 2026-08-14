import type { Pricing } from '../types';

export const PRICING_DATA: Pricing = {
  // Base cost per roofing square (100 sq ft) by pitch
  // For v2.0, shingle materials are a flat $274.90, base labor is pitch-dependent, overhead is $96.00
  costPerSqByPitch: {
    '3': { materials: 274.90, labor: 140.0, overhead: 96.0 },
    '4': { materials: 274.90, labor: 140.0, overhead: 96.0 },
    '5': { materials: 274.90, labor: 140.0, overhead: 96.0 },
    '6': { materials: 274.90, labor: 140.0, overhead: 96.0 },
    '7': { materials: 274.90, labor: 155.0, overhead: 96.0 },
    '8': { materials: 274.90, labor: 170.0, overhead: 96.0 },
    '9': { materials: 274.90, labor: 185.0, overhead: 96.0 },
    '10': { materials: 274.90, labor: 200.0, overhead: 96.0 },
    '11': { materials: 274.90, labor: 215.0, overhead: 96.0 },
    '12': { materials: 274.90, labor: 230.0, overhead: 96.0 },
    '13': { materials: 274.90, labor: 230.0, overhead: 96.0 },
    '14': { materials: 274.90, labor: 230.0, overhead: 96.0 },
    '15': { materials: 274.90, labor: 230.0, overhead: 96.0 },
    '16': { materials: 274.90, labor: 230.0, overhead: 96.0 },
    '17': { materials: 274.90, labor: 230.0, overhead: 96.0 },
    '18': { materials: 274.90, labor: 230.0, overhead: 96.0 },
  },
  removeOnlyByPitch: {
    '3': 25.0,
    '4': 25.0,
    '5': 25.0,
    '6': 25.0,
    '7': 40.0,
    '8': 55.0,
    '9': 70.0,
    '10': 85.0,
    '11': 100.0,
    '12': 115.0,
    '13': 115.0,
    '14': 115.0,
    '15': 115.0,
    '16': 115.0,
    '17': 115.0,
    '18': 115.0
  },
  profitMargin: 0.10, // v2.0 baseline profit margin: 10%

  // Addon costs applied to the base cost before profit
  addons: {
    layers: {
      '1': 0,
      '2': 25.0, // base Remove Only rate for pitch 3-6/12
      '3': 50.0, // (3 - 1) * 25.0
      '4': 75.0, // (4 - 1) * 25.0
      'IDK': 50.0, // Assume 3 layers (2 extra)
      'Other': 50.0,
    },
    features: {
      chimney: 60.0, // Base material addon (Labor added separately)
      swampCooler: 80.0,
      skylight: 60.0,
    },
  },

  // Upgrade costs added to the final retail price (per square)
  upgrades: {
    'TruDefinition® Duration®': 0,
    'TruDefinition® Duration FLEX®': 58.70, // v2.0 FlexRetailaddon/SQ
    'GAF Woodland®': 250.00, // v2.0 DesignerRetailaddon/SQ
    'GAF Grand Sequoia®': 300.00, // v2.0 PremDesignerRetailaddon/SQ
  },
  
  // Cost per square for flat roofing options
  flatRoofing: {
    '.060MIL TPO': { materials: 575.0, labor: 140.0, overhead: 96.0 },
    '.080MIL TPO': { materials: 575.0 + 82.5, labor: 140.0, overhead: 96.0 },
    '.060MIL PVC': { materials: 575.0 + 8.71, labor: 140.0, overhead: 96.0 },
    '.080MIL PVC': { materials: 575.0 + 80.21, labor: 140.0, overhead: 96.0 },
  },

  flatRoofingColorAddons: {
    'White': 0,
    'Gray': 0,
    'Tan': 50,
    'Brown': 50,
  },

  // Gutter pricing
  gutters: {
    perFoot: 6.5, // Gtr5Lf = 6.5
    perMiter: 25,
    downspout1Story: 60,
    downspout2Story: 120,
    downspout3Story: 180,
    downspout4Story: 240,
    styleMultipliers: {
      'K-Style': 1.0,
      'Box/Square': 1.3,
      'Half Round': 1.6,
    },
    sizeMultipliers: {
      '5"': 1.0,
      '6"': 1.25,
    },
    overhead: 0.15, // GtrOvrd = 15%
    profit: 0.10, // GtrProf = 10%
    removePerFoot: 1.0, // GtrRemoveLf = $1.00
    cleanoutPerFoot: 2.0, // GtrCleanoutLf = $2.00
    minOrder: 350.0 // GtrMin = $350.00
  },
 
  // Heat Trace pricing
  heatTrace: {
    perFoot: 9.0, // HeatCable/LF = 9.0
    downspout1Story: 100,
    downspout2Story: 150,
    downspout3Story: 200,
    downspout4Story: 250,
    eaveOverhang: {
      'None': 0,
      'Small': 100,
      'Medium': 200,
      'Large': 450,
    },
    overhead: 0.15, // HCOverd = 15%
    profit: 0.10, // HCProf = 10%
    flatExtensionCord: 35.0, // ExtCord = $35.00
    projectBase: 150.0 // HCEaProj = $150.00
  }
};
