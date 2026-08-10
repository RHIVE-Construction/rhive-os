/**
 * measurementCalculator.ts
 *
 * Converts BuildingData (from the Google Solar API via mockData.ts) into a
 * DetailedMeasurementReport using the instant-estimate/vic pitch-bucket approach:
 *
 *   1. For each facet:
 *      – pitchIn12 = round(12 × tan(pitchDegrees × π/180))
 *      – groundArea = facet.areaMeters × cos(pitchDegrees × π/180)   ← instant-estimate method
 *      – groundSQ   = groundArea × SQ_METERS_TO_SQ_FEET / 100
 *      – Flat (pitchIn12 < 3): goes to flat bucket
 *      – Pitched (pitchIn12 ≥ 3): goes to pitched pitch-bucket
 *
 *   2. SqRaw = Σ(groundSQ[pitch] × PITCH_MULTIPLIER[pitch])   ← instant-estimate formula
 *   3. WastePct from facet count (instant-estimate rule)
 *   4. SqLoad = SqRaw / (1 − WastePct)
 *   5. Linear measurements from the existing tier-based calibrated ratios
 *      (already validated against Roofr reports in calculations.ts)
 *
 * Area accuracy: Solar API's facet.areaMeters is the actual satellite-measured
 * slope area — more accurate than ground × multiplier for the TOTAL area value.
 * We use it for the area display but derive ground SQ from it for pricing inputs.
 */

import type { BuildingData, RoofFacet, Pricing, SurveyState } from '../types';
import { SQ_FEET_PER_SQUARE, SQ_METERS_TO_SQ_FEET } from '../constants';
import { pricingToSheet, sheetVal, type SpreadsheetState } from './spreadsheetEngine';

// ── Pitch multipliers (from spreadsheetEngine v2.0) ──────────────────────────
// Derived from: multiplier = √(1 + (pitch/12)²)
const PITCH_MULTIPLIERS: Record<number, number> = {
  0: 1.0000, 1: 1.0035, 2: 1.0138,
  3: 1.0308, 4: 1.0541, 5: 1.0833,
  6: 1.1180, 7: 1.1577, 8: 1.2019,
  9: 1.2500, 10: 1.3017, 11: 1.3566,
  12: 1.4142, 13: 1.4745, 14: 1.5366,
};

/** instant-estimate/vic: pitch < 3/12 → flat; ≥ 3/12 → asphalt/pitched */
const FLAT_THRESHOLD = 3;

function pitchMultiplier(pitchIn12: number): number {
  const clamped = Math.min(14, Math.max(0, pitchIn12));
  return PITCH_MULTIPLIERS[clamped] ?? 1.5366;
}

/** Waste % by facet count — exact instant-estimate rule from spreadsheetEngine */
function wastePctForCount(facetCount: number): number {
  if (facetCount <= 5)  return 0.05;
  if (facetCount <= 10) return 0.08;
  if (facetCount <= 15) return 0.12;
  if (facetCount <= 25) return 0.15;
  if (facetCount <= 35) return 0.18;
  return 0.225;
}

// ── Spreadsheet cell addresses for each pitched pitch bucket ─────────────────
const PITCH_CELL: Record<number, string> = {
  3: "B36", 4: "B37", 5: "B38",  6: "B39",  7: "B40",  8: "B41",
  9: "B42", 10: "B43", 11: "B44", 12: "B45", 13: "B46", 14: "B47",
};
const FLAT_PITCH_CELL: Record<number, string> = {
  0: "F32", 1: "F33", 2: "F34",
};

// ── Return type exported so Dashboard and MeasurementsSummary can use it ─────

export interface PitchBucket {
  pitchIn12: number;
  label: string;       // e.g. "6/12"
  groundSQ: number;
  slopeSQ: number;     // groundSQ × pitchMultiplier
  slopeAreaSqFt: number;
  pct: number;         // fraction of total slope area
}

export interface SpreadsheetPricing {
  // Asphalt
  sqRaw: number;
  sqLoad: number;
  wastePct: number;
  durationMat: number;
  durationLab: number;
  durationOvrd: number;
  durationProf: number;
  durationRetail: number;
  pmt18: number;    // 0% 18-month
  pmt60: number;    // 7.99% 60-month
  // Shingle upgrade addons (per SqLoad)
  flexAddon: number;
  designerAddon: number;
  premDesignerAddon: number;
  // Flat
  flatSqRaw: number;
  flatSqLoad: number;
  flatWastePct: number;
  tpo60Material: number;
  tpo60Labor: number;
  tpo60Overhead: number;
  tpo60Profit: number;
  tpo60Retail: number;
  tpo80Retail: number;
  pvc60Retail: number;
  pvc80Retail: number;
  // Totals
  asphaltTotal: number;
  flatTotal: number;
  combinedTotal: number;
}

export interface DetailedMeasurementReport {
  buildingId: string;

  // ── Area breakdown (slope area = Solar API measured = most accurate) ──
  totalSlopeSqFt: number;
  totalSlopeSquares: number;  // = totalSlopeSqFt / 100
  pitchedSlopeSqFt: number;
  flatSlopeSqFt: number;
  totalGroundSqFt: number;
  pitchedGroundSqFt: number;
  flatGroundSqFt: number;

  // ── Facet counts ──────────────────────────────────────────────────────
  totalFacets: number;
  pitchedFacets: number;
  flatFacets: number;
  dominantPitch: number;    // pitchIn12 of the largest area bucket

  // ── Pitch-bucket breakdown (instant-estimate/vic approach) ────────────
  pitchBuckets: PitchBucket[];
  pitchedGroundSQ: Record<number, number>;   // raw bucket map for sheet inputs
  flatGroundSQ: Record<number, number>;      // raw flat bucket map

  // ── SQ quantities (instant-estimate method) ───────────────────────────
  sqRaw: number;         // Σ(groundSQ × multiplier)  for pitched
  wastePct: number;      // based on pitched facet count
  sqLoad: number;        // sqRaw / (1 − wastePct)  — materials order quantity
  flatSqRaw: number;
  flatWastePct: number;
  flatSqLoad: number;

  // ── Linear measurements (tier-based, calibrated from Roofr) ──────────
  linear: {
    eaves: number;
    ridges: number;
    hips: number;
    valleys: number;
    rakes: number;
    stepFlashing: number;
    wallFlashing: number;
    unspecified: number;
    transitions: number;
  };
  roofTier: string;   // "complex_hip" | "cross_gable_hip" | "moderate_hip" | "simple"

  // ── Full pricing pipeline (spreadsheet engine v2.0) ───────────────────
  pricing: SpreadsheetPricing;
}

// ── Tier-based linear measurement ratios (calibrated from Roofr) ─────────────
// These are the same ratios used in calculations.ts but exported here for the
// measurement report so the summary modal can display them independently.
const TIER_RATIOS = {
  complex_hip: {
    ridges: 7.9, hips: 7.1, valleys: 8.8,
    eaves: 15.7, rakes: 7.3, wallFlashing: 2.2, stepFlashing: 1.7,
  },
  cross_gable_hip: {
    ridges: 6.85, hips: 5.29, valleys: 5.13,
    eaves: 15.19, rakes: 15.15, wallFlashing: 2.23, stepFlashing: 8.63,
  },
  moderate_hip: {
    ridges: 2.9, hips: 13.0, valleys: 1.8,
    eaves: 22.8, rakes: 3.9, wallFlashing: 3.5, stepFlashing: 2.3,
  },
  simple: {
    ridges: 14.8, hips: 2.9, valleys: 6.2,
    eaves: 36.9, rakes: 37.0, wallFlashing: 11.6, stepFlashing: 11.8,
  },
} as const;

type RoofTier = keyof typeof TIER_RATIOS;

function classifyRoofTier(facets: RoofFacet[]): RoofTier {
  const N = facets.length;
  if (N === 0) return 'simple';
  const hasN = facets.some(f => { const a = (f.azimuthDegrees ?? 0) % 360; return a >= 315 || a < 45; });
  const hasE = facets.some(f => { const a = (f.azimuthDegrees ?? 0) % 360; return a >= 45 && a < 135; });
  const hasS = facets.some(f => { const a = (f.azimuthDegrees ?? 0) % 360; return a >= 135 && a < 225; });
  const hasW = facets.some(f => { const a = (f.azimuthDegrees ?? 0) % 360; return a >= 225 && a < 315; });
  const quadrants = [hasN, hasE, hasS, hasW].filter(Boolean).length;

  if (quadrants >= 4 && N >= 13) return 'complex_hip';
  if (quadrants >= 4 && N >= 7)  return 'cross_gable_hip';
  if (quadrants >= 3 || N >= 7)  return 'moderate_hip';
  return 'simple';
}

function tierLinear(facets: RoofFacet[], tier: RoofTier) {
  const N = facets.length;
  const r = TIER_RATIOS[tier];
  return {
    ridges:       Math.round(N * r.ridges * 10) / 10,
    hips:         Math.round(N * r.hips * 10) / 10,
    valleys:      Math.round(N * r.valleys * 10) / 10,
    eaves:        Math.round(N * r.eaves * 10) / 10,
    rakes:        Math.round(N * r.rakes * 10) / 10,
    wallFlashing: Math.round(N * r.wallFlashing * 10) / 10,
    stepFlashing: Math.round(N * r.stepFlashing * 10) / 10,
    unspecified:  0,
    transitions:  0,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Main export: compute a full DetailedMeasurementReport for ONE building
// ─────────────────────────────────────────────────────────────────────────────
export function computeDetailedMeasurements(
  buildingData: BuildingData,
  pricing: Pricing,
  includedBuildingIds?: string[],
  surveyState?: SurveyState,
): DetailedMeasurementReport {
  // Collect facets from included buildings (or all buildings if not specified)
  const buildings = includedBuildingIds && includedBuildingIds.length > 0
    ? buildingData.buildings.filter(b => includedBuildingIds.includes(b.id))
    : buildingData.buildings;

  const allFacets: RoofFacet[] = buildings.flatMap(b => b.facets);
  const buildingId = buildings[0]?.id ?? 'building_1';

  // ── Step 1: Pitch-bucket ground SQ (instant-estimate/vic approach) ────────
  const pitchedGroundSQ: Record<number, number> = {};
  const flatGroundSQ: Record<number, number> = {};
  for (let p = 0; p <= 14; p++) { pitchedGroundSQ[p] = 0; flatGroundSQ[p] = 0; }

  let totalSlopeSqFt = 0;
  let pitchedSlopeSqFt = 0;
  let flatSlopeSqFt = 0;
  let totalGroundSqFt = 0;
  let pitchedGroundSqFt = 0;
  let flatGroundSqFt = 0;
  let pitchedFacets = 0;
  let flatFacets = 0;

  allFacets.forEach(facet => {
    const pitchRad = facet.pitchDegrees * Math.PI / 180;
    const pitchIn12 = Math.round(12 * Math.tan(pitchRad));

    // Slope area from Solar API (most accurate measurement)
    const slopeAreaSqFt = facet.areaMeters * SQ_METERS_TO_SQ_FEET;
    // Ground area derived from slope area using cos(pitch) — instant-estimate method
    const groundAreaSqFt = slopeAreaSqFt * Math.cos(pitchRad);
    const groundSQ = groundAreaSqFt / SQ_FEET_PER_SQUARE;

    totalSlopeSqFt += slopeAreaSqFt;
    totalGroundSqFt += groundAreaSqFt;

    if (pitchIn12 < FLAT_THRESHOLD) {
      // ── Flat section (pitch < 3/12) ──────────────────────────────────────
      flatSlopeSqFt += slopeAreaSqFt;
      flatGroundSqFt += groundAreaSqFt;
      flatFacets++;
      const flatKey = Math.min(2, Math.max(0, pitchIn12));
      flatGroundSQ[flatKey] = (flatGroundSQ[flatKey] || 0) + groundSQ;
    } else {
      // ── Pitched section (pitch ≥ 3/12) ───────────────────────────────────
      pitchedSlopeSqFt += slopeAreaSqFt;
      pitchedGroundSqFt += groundAreaSqFt;
      pitchedFacets++;
      const pitchedKey = Math.min(14, Math.max(3, pitchIn12));
      pitchedGroundSQ[pitchedKey] = (pitchedGroundSQ[pitchedKey] || 0) + groundSQ;
    }
  });

  // ── Step 2: SqRaw (instant-estimate: Σ groundSQ × pitchMultiplier) ─────────
  let sqRaw = 0;
  Object.entries(pitchedGroundSQ).forEach(([p, gSQ]) => {
    sqRaw += gSQ * pitchMultiplier(Number(p));
  });

  let flatSqRaw = 0;
  Object.entries(flatGroundSQ).forEach(([p, gSQ]) => {
    const mult = PITCH_MULTIPLIERS[Number(p)] ?? 1.0;
    flatSqRaw += gSQ * mult;
  });

  // ── Step 3: Waste & SqLoad ─────────────────────────────────────────────────
  const wastePct     = wastePctForCount(pitchedFacets);
  const flatWastePct = wastePctForCount(flatFacets);
  const sqLoad       = sqRaw > 0     ? sqRaw     / (1 - wastePct)     : 0;
  const flatSqLoad   = flatSqRaw > 0 ? flatSqRaw / (1 - flatWastePct) : 0;

  // ── Step 4: Pitch buckets for display ─────────────────────────────────────
  const pitchBuckets: PitchBucket[] = Object.entries(pitchedGroundSQ)
    .filter(([_, gSQ]) => gSQ > 0.001)
    .map(([p, groundSQ]) => {
      const pitchIn12 = Number(p);
      const slopeSQ = groundSQ * pitchMultiplier(pitchIn12);
      const slopeAreaSqFt = slopeSQ * SQ_FEET_PER_SQUARE;
      return {
        pitchIn12,
        label: `${pitchIn12}/12`,
        groundSQ: Math.round(groundSQ * 100) / 100,
        slopeSQ:  Math.round(slopeSQ  * 100) / 100,
        slopeAreaSqFt: Math.round(slopeAreaSqFt),
        pct: pitchedSlopeSqFt > 0 ? slopeAreaSqFt / pitchedSlopeSqFt : 0,
      };
    })
    .sort((a, b) => a.pitchIn12 - b.pitchIn12);

  // ── Step 5: Dominant pitch ────────────────────────────────────────────────
  const dominantPitch = pitchBuckets.length > 0
    ? pitchBuckets.reduce((max, b) => b.slopeSQ > max.slopeSQ ? b : max, pitchBuckets[0]).pitchIn12
    : 0;

  // ── Step 6: Linear measurements (tier-based, calibrated) ─────────────────
  const tier = classifyRoofTier(allFacets);
  const linear = tierLinear(allFacets, tier);

  // ── Step 7: Full pricing pipeline via spreadsheet engine ──────────────────
  const sheetInputs: Partial<SpreadsheetState> = {};

  // Layer count = 1 (default; caller can override)
  sheetInputs["B28"] = { value: 1, isEditable: true };

  // Pitched facet count → drives waste %
  sheetInputs["B32"] = { value: pitchedFacets, isEditable: true };

  // Inject ground SQs per pitch bucket
  Object.entries(pitchedGroundSQ).forEach(([p, gSQ]) => {
    const pitchIn12 = Number(p);
    const cell = PITCH_CELL[pitchIn12];
    if (cell) sheetInputs[cell] = { value: gSQ, isEditable: true };
  });

  // Flat inputs
  sheetInputs["F31"] = { value: flatFacets, isEditable: true };
  Object.entries(flatGroundSQ).forEach(([p, gSQ]) => {
    const pitchIn12 = Number(p);
    const cell = FLAT_PITCH_CELL[pitchIn12];
    if (cell) sheetInputs[cell] = { value: gSQ, isEditable: true };
  });
  sheetInputs["F35"] = { value: surveyState?.flatRoofFeatures?.parapetSq || 0, isEditable: true };
  sheetInputs["F29"] = { value: surveyState?.flatRoofFeatures?.roofCurbSmall || 0, isEditable: true };
  sheetInputs["F30"] = { value: surveyState?.flatRoofFeatures?.roofCurbLarge || 0, isEditable: true };

  const sheet = pricingToSheet(pricing, sheetInputs);

  const pricingResult: SpreadsheetPricing = {
    // Asphalt
    sqRaw:              sheetVal(sheet, "B53"),
    sqLoad:             sheetVal(sheet, "B54"),
    wastePct:           sheetVal(sheet, "B52"),
    durationMat:        sheetVal(sheet, "B7"),
    durationLab:        sheetVal(sheet, "B8"),
    durationOvrd:       sheetVal(sheet, "B9"),
    durationProf:       sheetVal(sheet, "B10"),
    durationRetail:     sheetVal(sheet, "B11"),
    pmt18:              sheetVal(sheet, "B12"),
    pmt60:              sheetVal(sheet, "B13"),
    flexAddon:          sheetVal(sheet, "B14"),
    designerAddon:      sheetVal(sheet, "B15"),
    premDesignerAddon:  sheetVal(sheet, "B16"),
    // Flat
    flatSqRaw:          sheetVal(sheet, "F53"),
    flatSqLoad:         sheetVal(sheet, "F54"),
    flatWastePct:       sheetVal(sheet, "F52"),
    tpo60Material:      sheetVal(sheet, "F7"),
    tpo60Labor:         sheetVal(sheet, "F8"),
    tpo60Overhead:      sheetVal(sheet, "F9"),
    tpo60Profit:        sheetVal(sheet, "F10"),
    tpo60Retail:        sheetVal(sheet, "F11"),
    tpo80Retail:        sheetVal(sheet, "F11") + sheetVal(sheet, "F12"),
    pvc60Retail:        sheetVal(sheet, "F11") + sheetVal(sheet, "F13"),
    pvc80Retail:        sheetVal(sheet, "F11") + sheetVal(sheet, "F14"),
    // Totals
    asphaltTotal:       sheetVal(sheet, "B11"),
    flatTotal:          sheetVal(sheet, "F11"),
    combinedTotal:      sheetVal(sheet, "B11") + sheetVal(sheet, "F11"),
  };

  return {
    buildingId,
    totalSlopeSqFt:       Math.round(totalSlopeSqFt * 10) / 10,
    totalSlopeSquares:    Math.round(totalSlopeSqFt / SQ_FEET_PER_SQUARE * 100) / 100,
    pitchedSlopeSqFt:     Math.round(pitchedSlopeSqFt * 10) / 10,
    flatSlopeSqFt:        Math.round(flatSlopeSqFt * 10) / 10,
    totalGroundSqFt:      Math.round(totalGroundSqFt * 10) / 10,
    pitchedGroundSqFt:    Math.round(pitchedGroundSqFt * 10) / 10,
    flatGroundSqFt:       Math.round(flatGroundSqFt * 10) / 10,
    totalFacets:          allFacets.length,
    pitchedFacets,
    flatFacets,
    dominantPitch,
    pitchBuckets,
    pitchedGroundSQ,
    flatGroundSQ,
    sqRaw:       Math.round(sqRaw * 100) / 100,
    wastePct,
    sqLoad:      Math.round(sqLoad * 100) / 100,
    flatSqRaw:   Math.round(flatSqRaw * 100) / 100,
    flatWastePct,
    flatSqLoad:  Math.round(flatSqLoad * 100) / 100,
    linear,
    roofTier: tier,
    pricing: pricingResult,
  };
}
