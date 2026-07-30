/**
 * spreadsheetEngine.ts
 * Exact replica of the instant-estimate/vic V2 spreadsheet engine.
 * Powers the full pricing pipeline in the Measurements Summary modal.
 * Imports adjusted for RHIVE OS path structure (lib/ → types at ../types, constants at ../constants).
 */

import type { Pricing } from '../types';

export interface SheetCell {
  value: any;
  formula?: string;
  isEditable: boolean;
  label?: string;
}

export type SpreadsheetState = Record<string, SheetCell>;

// Default cells and formulas matching sheet v2.0 exactly
export const DEFAULT_SHEET_STATE: SpreadsheetState = {
  // 1. ASPHALT OUTPUT / ESTIMATE
  "B7":  { value: 0, formula: "=(DurationMat * SqLoad) + (ChimneyCount * ChimMat) + (SwampCoolerCount * SwampMat) + (SkylightCount * SkyMat) + AddonMat", isEditable: false, label: "DurationMat" },
  "B8":  { value: 0, formula: "=(Sum(PitchRawGroundSQ * LaborRate) + LayerCountTearOff + FeaturesLabor + AddonLab)", isEditable: false, label: "DurationLab" },
  "B9":  { value: 0, formula: "=SqRaw * INSTALLOvrd * (1 + 0.1 * INT((SqRaw - 1) / 50))", isEditable: false, label: "DurationOvrd" },
  "B10": { value: 0, formula: "=(Sum(B7:B9) / (1 - ProfitMargin)) - Sum(B7:B9)", isEditable: false, label: "DurationProf" },
  "B11": { value: 0, formula: "=Sum(B7:B10)", isEditable: false, label: "DurationRetail" },
  "B12": { value: 0, formula: "=B11 / 18", isEditable: false, label: "DurPmt0_18" },
  "B13": { value: 0, formula: "=PMT(7.99%/12, 60, B11)", isEditable: false, label: "DurPmt799_60" },
  "B14": { value: 0, formula: "=SqLoad * FlexRetailUpgrade", isEditable: false, label: "FlexAddon" },
  "B15": { value: 0, formula: "=SqLoad * WoodlandUpgrade", isEditable: false, label: "DesignerAddon" },
  "B16": { value: 0, formula: "=SqLoad * GrandSequoiaUpgrade", isEditable: false, label: "PremDesignerAddon" },

  // 2. FLAT (MEMBRANE) OUTPUT
  "F7":  { value: 0, formula: "=(TPO60MATRATE * SqLoad) + (SMCURB * SMCURBMAT) + (LRGCURB * LRGCURBMAT) + AddonMatFlat", isEditable: false, label: "TPO60_MATERIAL" },
  "F8":  { value: 0, formula: "=(FLAT_R_AND_R * SqRaw) + (SMCURB * SMCURBLAB) + (LRGCURB * LRGCURBLAB) + (LayerCountTearOffFlat * G102) + AddonLabFlat + (DumpsterCount * DUMPSTER)", isEditable: false, label: "TPO60_LABOR" },
  "F9":  { value: 0, formula: "=FLATOVRD * SqRaw", isEditable: false, label: "TPO60_OVERHEAD" },
  "F10": { value: 0, formula: "=(Sum(F7:F9) / (1 - FLAT_PROFIT)) - Sum(F7:F9)", isEditable: false, label: "TPO60_PROFIT" },
  "F11": { value: 0, formula: "=Sum(F7:F10)", isEditable: false, label: "TPO60_RETAIL" },
  "F12": { value: 0, formula: "=SqLoad * TPO80MATRATE", isEditable: false, label: "TPO80_RETAIL" },
  "F13": { value: 0, formula: "=SqLoad * PVC60MATRATE", isEditable: false, label: "PVC60_RETAIL" },
  "F14": { value: 0, formula: "=SqLoad * PVC80MATRATE", isEditable: false, label: "PVC80_RETAIL" },

  // 3. GUTTER & HEAT TRACE OUTPUT
  "J7":  { value: 0, formula: "=MAX(GutterLoad * Gtr5Lf * (1 + GtrOvrd + GtrProf), GtrMin)", isEditable: false, label: "Gtr5Retail" },
  "J8":  { value: 0, formula: "=(HCLoad * HeatCableLF * (1 + HCOverd + HCProf)) + ExtCord", isEditable: false, label: "HCPremRetail" },

  // 4. ASPHALT ROOFING INPUTS
  "B28": { value: 1, formula: undefined, isEditable: true, label: "LayerCount" },
  "B29": { value: 0, formula: undefined, isEditable: true, label: "ChimneyCount" },
  "B30": { value: 0, formula: undefined, isEditable: true, label: "SwampCoolerCount" },
  "B31": { value: 0, formula: undefined, isEditable: true, label: "SkylightCount" },
  "B32": { value: 0, formula: undefined, isEditable: true, label: "FacetCount" },

  // Pitch raw ground SQs (B36=3/12 … B47=14/12+)
  "B36": { value: 0, formula: undefined, isEditable: true, label: "3/12 Ground SQ" },
  "B37": { value: 0, formula: undefined, isEditable: true, label: "4/12 Ground SQ" },
  "B38": { value: 0, formula: undefined, isEditable: true, label: "5/12 Ground SQ" },
  "B39": { value: 0, formula: undefined, isEditable: true, label: "6/12 Ground SQ" },
  "B40": { value: 0, formula: undefined, isEditable: true, label: "7/12 Ground SQ" },
  "B41": { value: 0, formula: undefined, isEditable: true, label: "8/12 Ground SQ" },
  "B42": { value: 0, formula: undefined, isEditable: true, label: "9/12 Ground SQ" },
  "B43": { value: 0, formula: undefined, isEditable: true, label: "10/12 Ground SQ" },
  "B44": { value: 0, formula: undefined, isEditable: true, label: "11/12 Ground SQ" },
  "B45": { value: 0, formula: undefined, isEditable: true, label: "12/12 Ground SQ" },
  "B46": { value: 0, formula: undefined, isEditable: true, label: "13/12 Ground SQ" },
  "B47": { value: 0, formula: undefined, isEditable: true, label: "14/12+ Ground SQ" },

  // 5. FLAT ROOFING INPUTS
  "F28": { value: 1, formula: undefined, isEditable: true, label: "LayerCount Flat" },
  "F29": { value: 0, formula: undefined, isEditable: true, label: "SM CURB" },
  "F30": { value: 0, formula: undefined, isEditable: true, label: "LRG CURB" },
  "F31": { value: 0, formula: undefined, isEditable: true, label: "FacetCount Flat" },
  "F32": { value: 0, formula: undefined, isEditable: true, label: "0/12 Ground SQ" },
  "F33": { value: 0, formula: undefined, isEditable: true, label: "1/12 Ground SQ" },
  "F34": { value: 0, formula: undefined, isEditable: true, label: "2/12 Ground SQ" },
  "F35": { value: 0, formula: undefined, isEditable: true, label: "Parapet SQ" },

  // 6. GUTTER & HEAT TRACE INPUTS
  "J27": { value: 0, formula: undefined, isEditable: true, label: "Gutter length" },
  "J28": { value: 0, formula: undefined, isEditable: true, label: "Gutter Miter" },
  "J29": { value: 0, formula: undefined, isEditable: true, label: "Gutter_DS_1story" },
  "J30": { value: 0, formula: undefined, isEditable: true, label: "Gutter_DS_2story" },
  "J31": { value: 0, formula: undefined, isEditable: true, label: "Gutter_DS_3story" },
  "J32": { value: 0, formula: undefined, isEditable: true, label: "Gutter_DS_4story" },
  "J35": { value: "Small", formula: undefined, isEditable: true, label: "Eave Type" },
  "J36": { value: 0, formula: undefined, isEditable: true, label: "Heat Cable Eave Length" },
  "J37": { value: 0, formula: undefined, isEditable: true, label: "HC_DS-1story" },
  "J38": { value: 0, formula: undefined, isEditable: true, label: "HC_DS-2story" },
  "J39": { value: 0, formula: undefined, isEditable: true, label: "HC_DS-3story" },
  "J40": { value: 0, formula: undefined, isEditable: true, label: "HC_DS-4story" },

  // 7. ASPHALT CALCULATIONS
  "B52": { value: 0, formula: "=IF(B32<=5, 5%, IF(B32<=10, 8%, IF(B32<=15, 12%, IF(B32<=25, 15%, IF(B32<=35, 18%, 22.5%)))))", isEditable: false, label: "WastePct" },
  "B53": { value: 0, formula: "=Sum(PitchRawGroundSQ * PitchMultiplier)", isEditable: false, label: "SqRaw" },
  "B54": { value: 0, formula: "=B53 / (1 - B52)", isEditable: false, label: "SqLoad" },
  "B55": { value: 0, formula: "=B36 * 1.0308",  isEditable: false, label: "3/12 SQRAW" },
  "B56": { value: 0, formula: "=B37 * 1.0541",  isEditable: false, label: "4/12 SQRAW" },
  "B57": { value: 0, formula: "=B38 * 1.0833",  isEditable: false, label: "5/12 SQRAW" },
  "B58": { value: 0, formula: "=B39 * 1.1180",  isEditable: false, label: "6/12 SQRAW" },
  "B59": { value: 0, formula: "=B40 * 1.1577",  isEditable: false, label: "7/12 SQRAW" },
  "B60": { value: 0, formula: "=B41 * 1.2019",  isEditable: false, label: "8/12 SQRAW" },
  "B61": { value: 0, formula: "=B42 * 1.2500",  isEditable: false, label: "9/12 SQRAW" },
  "B62": { value: 0, formula: "=B43 * 1.3017",  isEditable: false, label: "10/12 SQRAW" },
  "B63": { value: 0, formula: "=B44 * 1.3566",  isEditable: false, label: "11/12 SQRAW" },
  "B64": { value: 0, formula: "=B45 * 1.4142",  isEditable: false, label: "12/12 SQRAW" },
  "B65": { value: 0, formula: "=B46 * 1.4745",  isEditable: false, label: "13/12 SQRAW" },
  "B66": { value: 0, formula: "=B47 * 1.5366",  isEditable: false, label: "14/12+ SQRAW" },

  // 8. FLAT CALCULATIONS
  "F52": { value: 0.12, formula: "=IF(F31<=5, 5%, IF(F31<=10, 8%, IF(F31<=15, 12%, IF(F31<=25, 15%, IF(F31<=35, 18%, 22.5%)))))", isEditable: false, label: "WastePct Flat" },
  "F53": { value: 0, formula: "=Sum(FlatRawGroundSQ * PitchMultiplier) + ParapetSQ", isEditable: false, label: "SqRaw Flat" },
  "F54": { value: 0, formula: "=F53 / (1 - F52)", isEditable: false, label: "SqLoad Flat" },

  // 9. GUTTER & HEAT TRACE CALCULATIONS
  "J52": { value: 0, formula: "=(J27 + J28 * 5 + J29 * 15 + J30 * 24 + J31 * 37 + J32 * 50) * 1.1", isEditable: false, label: "GutterLoad" },
  "J53": { value: 0, formula: "=(J36 * eaveMultiplier + J37 * 15 + J38 * 24 + J39 * 35 + J40 * 50)", isEditable: false, label: "HCLoad" },

  // 10. ASPHALT PRICING CONSTANTS (v2.0 baseline)
  "C108": { value: 274.90, formula: undefined, isEditable: true, label: "DurationMat" },
  "C109": { value: 250.00, formula: undefined, isEditable: true, label: "AddonMat" },
  "C110": { value:  60.00, formula: undefined, isEditable: true, label: "SkyMat" },
  "C111": { value:  60.00, formula: undefined, isEditable: true, label: "ChimMat" },
  "C112": { value:  80.00, formula: undefined, isEditable: true, label: "SwampMat" },
  // Labor rates R&R per pitch (C114=3/12 … C125=14/12+)
  "C114": { value: 140.00, formula: undefined, isEditable: true, label: "3/12 R&R" },
  "C115": { value: 140.00, formula: undefined, isEditable: true, label: "4/12 R&R" },
  "C116": { value: 140.00, formula: undefined, isEditable: true, label: "5/12 R&R" },
  "C117": { value: 140.00, formula: undefined, isEditable: true, label: "6/12 R&R" },
  "C118": { value: 155.00, formula: undefined, isEditable: true, label: "7/12 R&R" },
  "C119": { value: 170.00, formula: undefined, isEditable: true, label: "8/12 R&R" },
  "C120": { value: 185.00, formula: undefined, isEditable: true, label: "9/12 R&R" },
  "C121": { value: 200.00, formula: undefined, isEditable: true, label: "10/12 R&R" },
  "C122": { value: 215.00, formula: undefined, isEditable: true, label: "11/12 R&R" },
  "C123": { value: 230.00, formula: undefined, isEditable: true, label: "12/12 R&R" },
  "C124": { value: 230.00, formula: undefined, isEditable: true, label: "13/12 R&R" },
  "C125": { value: 230.00, formula: undefined, isEditable: true, label: "14/12+ R&R" },
  // Remove Only rates (C126=3/12 … C137=14/12+)
  "C126": { value:  25.00, formula: undefined, isEditable: true, label: "3/12 REMOVE" },
  "C127": { value:  25.00, formula: undefined, isEditable: true, label: "4/12 REMOVE" },
  "C128": { value:  25.00, formula: undefined, isEditable: true, label: "5/12 REMOVE" },
  "C129": { value:  25.00, formula: undefined, isEditable: true, label: "6/12 REMOVE" },
  "C130": { value:  40.00, formula: undefined, isEditable: true, label: "7/12 REMOVE" },
  "C131": { value:  55.00, formula: undefined, isEditable: true, label: "8/12 REMOVE" },
  "C132": { value:  70.00, formula: undefined, isEditable: true, label: "9/12 REMOVE" },
  "C133": { value:  85.00, formula: undefined, isEditable: true, label: "10/12 REMOVE" },
  "C134": { value: 100.00, formula: undefined, isEditable: true, label: "11/12 REMOVE" },
  "C135": { value: 115.00, formula: undefined, isEditable: true, label: "12/12 REMOVE" },
  "C136": { value: 115.00, formula: undefined, isEditable: true, label: "13/12 REMOVE" },
  "C137": { value: 115.00, formula: undefined, isEditable: true, label: "14/12+ REMOVE" },
  "C139": { value: 150.00, formula: undefined, isEditable: true, label: "ChimLab" },
  "C140": { value: 200.00, formula: undefined, isEditable: true, label: "SwampLab" },
  "C141": { value: 100.00, formula: undefined, isEditable: true, label: "SkyLab" },
  "C142": { value: 250.00, formula: undefined, isEditable: true, label: "AddonLab" },
  "C144": { value:  96.00, formula: undefined, isEditable: true, label: "INSTALLOvrd" },
  "C146": { value:   0.10, formula: undefined, isEditable: true, label: "ProfitMargin" },

  // 11. FLAT PRICING CONSTANTS
  "G93":  { value: 575.00, formula: undefined, isEditable: true, label: "TPO60MATRATE" },
  "G94":  { value: 250.00, formula: undefined, isEditable: true, label: "AddonMatFlat" },
  "G95":  { value: 120.00, formula: undefined, isEditable: true, label: "LRGCURBMAT" },
  "G96":  { value:  80.00, formula: undefined, isEditable: true, label: "SMCURBMAT" },
  "G102": { value:  35.00, formula: undefined, isEditable: true, label: "FLAT REMOVE/SQ" },
  "G103": { value: 140.00, formula: undefined, isEditable: true, label: "FLAT R&R/SQ" },
  "G105": { value: 350.00, formula: undefined, isEditable: true, label: "DUMPSTER" },
  "G106": { value: 250.00, formula: undefined, isEditable: true, label: "LRGCURBLAB" },
  "G107": { value: 150.00, formula: undefined, isEditable: true, label: "SMCURBLAB" },
  "G108": { value: 250.00, formula: undefined, isEditable: true, label: "AddonLabFlat" },
  "G110": { value:  96.00, formula: undefined, isEditable: true, label: "FLATOVRD" },
  "G112": { value:   0.10, formula: undefined, isEditable: true, label: "FLAT_PROFIT" },
  "G115": { value:  82.50, formula: undefined, isEditable: true, label: "TPO80MATRATE" },
  "G116": { value:   8.71, formula: undefined, isEditable: true, label: "PVC60MATRATE" },
  "G117": { value:  80.21, formula: undefined, isEditable: true, label: "PVC80MATRATE" },

  // 12. GUTTER & HEAT TRACE CONSTANTS
  "J92":  { value:   6.50, formula: undefined, isEditable: true, label: "Gtr5Lf" },
  "J93":  { value:   0.15, formula: undefined, isEditable: true, label: "GtrOvrd" },
  "J94":  { value:   0.10, formula: undefined, isEditable: true, label: "GtrProf" },
  "J103": { value:   1.00, formula: undefined, isEditable: true, label: "GtrRemoveLf" },
  "J104": { value:   2.00, formula: undefined, isEditable: true, label: "GtrCleanoutLf" },
  "J105": { value: 350.00, formula: undefined, isEditable: true, label: "GtrMin" },
  "J109": { value:   9.00, formula: undefined, isEditable: true, label: "HeatCable/LF" },
  "J110": { value:  35.00, formula: undefined, isEditable: true, label: "ExtCord" },
  "J111": { value: 150.00, formula: undefined, isEditable: true, label: "HCEaProj" },
  "J112": { value:   0.15, formula: undefined, isEditable: true, label: "HCOverd" },
  "J113": { value:   0.10, formula: undefined, isEditable: true, label: "HCProf" },
};

// ──────────────────────────────────────────────────────────────────────────────
// Core evaluation engine
// ──────────────────────────────────────────────────────────────────────────────
export function recalculateSpreadsheet(sheet: SpreadsheetState): SpreadsheetState {
  const copy = JSON.parse(JSON.stringify(sheet)) as SpreadsheetState;
  const getVal = (c: string) => Number(copy[c]?.value) || 0;
  const setVal = (c: string, v: number) => { if (copy[c]) copy[c].value = v; };

  // ── 1. Asphalt waste & SqRaw ─────────────────────────────────────────────
  const facetCount = getVal("B32");
  let wastePct = facetCount <= 5 ? 0.05 : facetCount <= 10 ? 0.08 : facetCount <= 15 ? 0.12
    : facetCount <= 25 ? 0.15 : facetCount <= 35 ? 0.18 : 0.225;
  setVal("B52", wastePct);

  const rawSq3  = getVal("B36") * 1.0308;
  const rawSq4  = getVal("B37") * 1.0541;
  const rawSq5  = getVal("B38") * 1.0833;
  const rawSq6  = getVal("B39") * 1.1180;
  const rawSq7  = getVal("B40") * 1.1577;
  const rawSq8  = getVal("B41") * 1.2019;
  const rawSq9  = getVal("B42") * 1.2500;
  const rawSq10 = getVal("B43") * 1.3017;
  const rawSq11 = getVal("B44") * 1.3566;
  const rawSq12 = getVal("B45") * 1.4142;
  const rawSq13 = getVal("B46") * 1.4745;
  const rawSq14 = getVal("B47") * 1.5366;

  [rawSq3, rawSq4, rawSq5, rawSq6, rawSq7, rawSq8, rawSq9, rawSq10, rawSq11, rawSq12, rawSq13, rawSq14]
    .forEach((v, i) => setVal(`B${55 + i}`, v));

  const sqRaw = rawSq3 + rawSq4 + rawSq5 + rawSq6 + rawSq7 + rawSq8 + rawSq9 + rawSq10 + rawSq11 + rawSq12 + rawSq13 + rawSq14;
  setVal("B53", sqRaw);
  const sqLoad = sqRaw / (1 - wastePct);
  setVal("B54", sqLoad);

  // ── 2. Flat waste & SqRaw ─────────────────────────────────────────────────
  const facetCountFlat = getVal("F31");
  let wastePctFlat = facetCountFlat <= 5 ? 0.05 : facetCountFlat <= 10 ? 0.08 : facetCountFlat <= 15 ? 0.12
    : facetCountFlat <= 25 ? 0.15 : facetCountFlat <= 35 ? 0.18 : 0.225;
  setVal("F52", wastePctFlat);

  const flatSqRaw = (getVal("F32") * 1.0) + (getVal("F33") * 1.0035) + (getVal("F34") * 1.0138) + getVal("F35");
  setVal("F53", flatSqRaw);
  const flatSqLoad = flatSqRaw / (1 - wastePctFlat);
  setVal("F54", flatSqLoad);

  // ── 3. Gutter & Heat Trace loads ─────────────────────────────────────────
  const gutterLoad = (getVal("J27") + getVal("J28") * 5.0 + getVal("J29") * 15.0 + getVal("J30") * 24.0 + getVal("J31") * 37.0 + getVal("J32") * 50.0) * 1.1;
  setVal("J52", gutterLoad);

  const eaveType = copy["J35"]?.value || "Small";
  const hcMultiplier = (eaveType === "Small" || eaveType === "small") ? 2.8
    : (eaveType === "Medium" || eaveType === "medium") ? 4.8
    : (eaveType === "Large" || eaveType === "large") ? 5.7 : 2.0;

  const hcLoad = (getVal("J36") * hcMultiplier) + (getVal("J37") * 15.0) + (getVal("J38") * 24.0) + (getVal("J39") * 35.0) + (getVal("J40") * 50.0);
  setVal("J53", hcLoad);

  // ── 4. Asphalt costs ─────────────────────────────────────────────────────
  const durationMat = (getVal("C108") * sqLoad) + (getVal("B29") * getVal("C111")) + (getVal("B30") * getVal("C112")) + (getVal("B31") * getVal("C110")) + getVal("C109");
  setVal("B7", durationMat);

  const rrLabor = (getVal("B36") * getVal("C114")) + (getVal("B37") * getVal("C115")) + (getVal("B38") * getVal("C116")) + (getVal("B39") * getVal("C117"))
    + (getVal("B40") * getVal("C118")) + (getVal("B41") * getVal("C119")) + (getVal("B42") * getVal("C120")) + (getVal("B43") * getVal("C121"))
    + (getVal("B44") * getVal("C122")) + (getVal("B45") * getVal("C123")) + (getVal("B46") * getVal("C124")) + (getVal("B47") * getVal("C125"));

  const layerCount = getVal("B28");
  const tearOffLabor = layerCount > 1 ? (layerCount - 1) * (
    (getVal("B36") * getVal("C126")) + (getVal("B37") * getVal("C127")) + (getVal("B38") * getVal("C128")) + (getVal("B39") * getVal("C129"))
    + (getVal("B40") * getVal("C130")) + (getVal("B41") * getVal("C131")) + (getVal("B42") * getVal("C132")) + (getVal("B43") * getVal("C133"))
    + (getVal("B44") * getVal("C134")) + (getVal("B45") * getVal("C135")) + (getVal("B46") * getVal("C136")) + (getVal("B47") * getVal("C137"))
  ) : 0;

  const featuresLabor = (getVal("B29") * getVal("C139")) + (getVal("B30") * getVal("C140")) + (getVal("B31") * getVal("C141"));
  const durationLab = rrLabor + tearOffLabor + featuresLabor + getVal("C142");
  setVal("B8", durationLab);

  const overheadScale = 1.0 + 0.1 * Math.floor(Math.max(0, sqRaw - 1) / 50);
  const durationOvrd = sqRaw * getVal("C144") * overheadScale;
  setVal("B9", durationOvrd);

  const margin = getVal("C146");
  const subtotal = durationMat + durationLab + durationOvrd;
  const durationProf = (subtotal / (1 - margin)) - subtotal;
  setVal("B10", durationProf);

  const durationRetail = subtotal + durationProf;
  setVal("B11", durationRetail);
  setVal("B12", durationRetail / 18);

  const r = 0.0799 / 12;
  const n = 60;
  const pmt60 = durationRetail > 0 ? (durationRetail * r) / (1 - Math.pow(1 + r, -n)) : 0;
  setVal("B13", pmt60);

  // Shingle upgrades
  setVal("B14", sqLoad * 58.70);    // Flex (Duration FLEX)
  setVal("B15", sqLoad * 250.00);   // Woodland
  setVal("B16", sqLoad * 300.00);   // Grand Sequoia

  // ── 5. Flat costs ─────────────────────────────────────────────────────────
  const flatMat = (getVal("G93") * flatSqLoad) + (getVal("F29") * getVal("G96")) + (getVal("F30") * getVal("G95")) + getVal("G94");
  setVal("F7", flatMat);

  const flatLayerCount = getVal("F28");
  const flatTearOff = flatLayerCount > 1 ? (flatLayerCount - 1) * flatSqRaw * getVal("G102") : 0;
  const flatLaborCurb = (getVal("F29") * getVal("G107")) + (getVal("F30") * getVal("G106"));
  const flatDumpster = Math.ceil(flatSqLoad / 35.0) * getVal("G105");
  const flatLab = (getVal("G103") * flatSqRaw) + flatLaborCurb + flatTearOff + getVal("G108") + flatDumpster;
  setVal("F8", flatLab);

  const flatOvrd = getVal("G110") * flatSqRaw;
  setVal("F9", flatOvrd);

  const flatMargin = getVal("G112");
  const flatSubtotal = flatMat + flatLab + flatOvrd;
  const flatProf = (flatSubtotal / (1 - flatMargin)) - flatSubtotal;
  setVal("F10", flatProf);
  setVal("F11", flatSubtotal + flatProf);

  setVal("F12", flatSqLoad * getVal("G115"));
  setVal("F13", flatSqLoad * getVal("G116"));
  setVal("F14", flatSqLoad * getVal("G117"));

  // ── 6. Gutter & Heat Trace retail ────────────────────────────────────────
  const gtrRaw = gutterLoad * getVal("J92") * (1 + getVal("J93") + getVal("J94"));
  setVal("J7", gutterLoad > 0 ? Math.max(gtrRaw, getVal("J105")) : 0);

  const hcTotal = hcLoad * getVal("J109") * (1 + getVal("J112") + getVal("J113")) + getVal("J110");
  setVal("J8", hcTotal);

  return copy;
}

// ──────────────────────────────────────────────────────────────────────────────
// Build a sheet from RHIVE OS Pricing, then inject input cells and compute
// ──────────────────────────────────────────────────────────────────────────────
export function pricingToSheet(pricing: Pricing, initialInputs?: Partial<SpreadsheetState>): SpreadsheetState {
  const sheet = JSON.parse(JSON.stringify(DEFAULT_SHEET_STATE)) as SpreadsheetState;
  const setVal = (c: string, v: any) => { if (sheet[c]) sheet[c].value = v; };

  // Materials & overhead from 6/12 baseline
  setVal("C108", pricing.costPerSqByPitch['6']?.materials ?? 274.90);
  setVal("C144", pricing.costPerSqByPitch['6']?.overhead  ?? 96.00);
  setVal("C146", pricing.profitMargin);

  // Labor & remove-only by pitch
  for (let p = 3; p <= 14; p++) {
    setVal(`C${111 + p}`, pricing.costPerSqByPitch[p.toString()]?.labor ?? 140.00);
    setVal(`C${123 + p}`, (pricing as any).removeOnlyByPitch?.[p.toString()] ?? 25.00);
  }

  // Flat roofing
  const tpo60 = pricing.flatRoofing['.060MIL TPO'];
  setVal("G93", tpo60.materials);
  setVal("G103", tpo60.labor);
  setVal("G110", tpo60.overhead);
  setVal("G112", pricing.profitMargin);
  setVal("G115", pricing.flatRoofing['.080MIL TPO'].materials - tpo60.materials);
  setVal("G116", pricing.flatRoofing['.060MIL PVC'].materials - tpo60.materials);
  setVal("G117", pricing.flatRoofing['.080MIL PVC'].materials - tpo60.materials);

  // Gutter constants
  setVal("J92",  pricing.gutters.perFoot);
  setVal("J93",  (pricing.gutters as any).overhead          ?? 0.15);
  setVal("J94",  (pricing.gutters as any).profit            ?? 0.10);
  setVal("J103", (pricing.gutters as any).removePerFoot     ?? 1.00);
  setVal("J104", (pricing.gutters as any).cleanoutPerFoot   ?? 2.00);
  setVal("J105", (pricing.gutters as any).minOrder          ?? 350.00);

  // Heat trace constants
  setVal("J109", pricing.heatTrace.perFoot);
  setVal("J110", (pricing.heatTrace as any).flatExtensionCord ?? 35.00);
  setVal("J112", (pricing.heatTrace as any).overhead         ?? 0.15);
  setVal("J113", (pricing.heatTrace as any).profit           ?? 0.10);

  // Inject caller inputs (pitch ground SQs, layer count, features, etc.)
  if (initialInputs) {
    Object.entries(initialInputs).forEach(([c, cell]) => {
      if (sheet[c] && cell) sheet[c].value = cell.value;
    });
  }

  return recalculateSpreadsheet(sheet);
}

// Helper: read a computed cell value from a recalculated sheet
export function sheetVal(sheet: SpreadsheetState, coord: string): number {
  return Number(sheet[coord]?.value) || 0;
}
