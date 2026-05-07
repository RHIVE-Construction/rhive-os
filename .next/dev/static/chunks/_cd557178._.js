(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/lib/pricing.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PRICING_DATA",
    ()=>PRICING_DATA
]);
const PRICING_DATA = {
    costPerSqByPitch: {
        '3': {
            materials: 120,
            labor: 110,
            overhead: 45
        },
        '4': {
            materials: 120,
            labor: 115,
            overhead: 45
        },
        '5': {
            materials: 120,
            labor: 120,
            overhead: 50
        },
        '6': {
            materials: 125,
            labor: 125,
            overhead: 50
        },
        '7': {
            materials: 130,
            labor: 135,
            overhead: 55
        },
        '8': {
            materials: 130,
            labor: 140,
            overhead: 55
        },
        '9': {
            materials: 135,
            labor: 150,
            overhead: 60
        },
        '10': {
            materials: 135,
            labor: 160,
            overhead: 65
        },
        '11': {
            materials: 140,
            labor: 170,
            overhead: 70
        },
        '12': {
            materials: 140,
            labor: 185,
            overhead: 75
        },
        '13': {
            materials: 150,
            labor: 200,
            overhead: 80
        },
        '14': {
            materials: 155,
            labor: 220,
            overhead: 85
        },
        '15': {
            materials: 160,
            labor: 240,
            overhead: 90
        },
        '16': {
            materials: 165,
            labor: 260,
            overhead: 95
        },
        '17': {
            materials: 170,
            labor: 280,
            overhead: 100
        },
        '18': {
            materials: 175,
            labor: 300,
            overhead: 105
        }
    },
    profitMargin: 0.25,
    addons: {
        layers: {
            '1': 0,
            '2': 55,
            '3': 75,
            '4': 100,
            'IDK': 65,
            'Other': 80
        },
        features: {
            chimney: 450,
            swampCooler: 300,
            skylight: 600
        }
    },
    upgrades: {
        'TruDefinition® Duration®': 0,
        'TruDefinition® Duration FLEX®': 8,
        'GAF Woodland®': 18,
        'GAF Grand Sequoia®': 35
    },
    flatRoofing: {
        '.060MIL TPO': {
            materials: 25,
            labor: 20,
            overhead: 5
        },
        '.080MIL TPO': {
            materials: 32,
            labor: 25,
            overhead: 8
        },
        '.060MIL PVC': {
            materials: 38,
            labor: 28,
            overhead: 9
        },
        '.080MIL PVC': {
            materials: 45,
            labor: 35,
            overhead: 10
        }
    },
    flatRoofingColorAddons: {
        'White': 0,
        'Gray': 0,
        'Tan': 50,
        'Brown': 50
    },
    gutters: {
        perFoot: 9,
        perMiter: 25,
        downspout1Story: 60,
        downspout2Story: 120,
        downspout3Story: 180,
        downspout4Story: 240,
        styleMultipliers: {
            'K-Style': 1.0,
            'Box/Square': 1.3,
            'Half Round': 1.6
        },
        sizeMultipliers: {
            '5"': 1.0,
            '6"': 1.25
        }
    },
    heatTrace: {
        perFoot: 22,
        downspout1Story: 100,
        downspout2Story: 150,
        downspout3Story: 200,
        downspout4Story: 250,
        eaveOverhang: {
            'None': 0,
            'Small': 100,
            'Medium': 200,
            'Large': 450
        }
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cn",
    ()=>cn,
    "formatCurrency",
    ()=>formatCurrency
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-client] (ecmascript)");
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/calculations.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "calculateEstimate",
    ()=>calculateEstimate
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/constants.ts [app-client] (ecmascript)");
;
function calculateEstimate(inputs, pricing) {
    const { buildingData, surveyState } = inputs;
    const { roofLayers, roofFeatures, gutters, heatTrace, roofUpgrade, flatRoofingType, flatRoofingColor, includedBuildingIds, asphaltRoofingEnabled, flatRoofingEnabled } = surveyState;
    const zeroBreakdown = {
        materials: 0,
        labor: 0,
        overhead: 0,
        profit: 0,
        total: 0
    };
    const zeroUpgrades = {
        '.060MIL TPO': 0,
        '.080MIL TPO': 0,
        '.060MIL PVC': 0,
        '.080MIL PVC': 0
    };
    if (includedBuildingIds.length === 0) {
        return {
            baseSq: 0,
            finalSq: 0,
            asphaltSq: 0,
            flatRoofSq: 0,
            estimatedLayers: 1,
            dominantPitch: 0,
            pitchBreakdown: [],
            roofEstimate: {
                breakdown: zeroBreakdown,
                upgrades: {
                    'TruDefinition® Duration FLEX®': 0,
                    'GAF Woodland®': 0,
                    'GAF Grand Sequoia®': 0
                },
                totalRetail: 0,
                totalFacets: 0
            },
            asphaltEstimate: zeroBreakdown,
            gutterEstimate: zeroBreakdown,
            heatTraceEstimate: zeroBreakdown,
            flatRoofingEstimate: zeroBreakdown,
            flatRoofingUpgrades: zeroUpgrades,
            flatRoofColorAddonCost: 0,
            liveTotal: 0
        };
    }
    const includedBuildings = buildingData.buildings.filter((b)=>includedBuildingIds.includes(b.id));
    const totalFacets = includedBuildings.reduce((sum, b)=>sum + b.facets.length, 0);
    let initialAsphaltSq = 0;
    let initialFlatSq = 0;
    let initialAsphaltMaterialCost = 0;
    let initialAsphaltLaborCost = 0;
    let initialAsphaltOverheadCost = 0;
    includedBuildings.forEach((building)=>{
        building.facets.forEach((facet)=>{
            const pitchIn12 = Math.round(12 * Math.tan(facet.pitchDegrees * Math.PI / 180));
            const facetSq = facet.areaMeters * __TURBOPACK__imported__module__$5b$project$5d2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SQ_METERS_TO_SQ_FEET"] / __TURBOPACK__imported__module__$5b$project$5d2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SQ_FEET_PER_SQUARE"];
            if (pitchIn12 < 3) {
                initialFlatSq += facetSq;
            } else {
                initialAsphaltSq += facetSq;
                const pitchKey = Math.min(18, Math.max(3, pitchIn12)).toString();
                const pitchPrice = pricing.costPerSqByPitch[pitchKey] || pricing.costPerSqByPitch['6'];
                if (pitchPrice) {
                    initialAsphaltMaterialCost += facetSq * pitchPrice.materials;
                    initialAsphaltLaborCost += facetSq * pitchPrice.labor;
                    initialAsphaltOverheadCost += facetSq * pitchPrice.overhead;
                }
            }
        });
    });
    const apiTotalSq = initialAsphaltSq + initialFlatSq;
    const finalSq = surveyState.totalSq > 0 ? surveyState.totalSq : apiTotalSq;
    const scalingFactor = apiTotalSq > 0 ? finalSq / apiTotalSq : 1;
    const finalAsphaltSq = initialAsphaltSq * scalingFactor;
    const finalFlatSq = initialFlatSq * scalingFactor;
    // 1. Calculate Asphalt Roof Cost
    let totalAsphaltMaterialCost = 0;
    let totalAsphaltLaborCost = 0;
    let totalAsphaltOverheadCost = 0;
    if (asphaltRoofingEnabled) {
        totalAsphaltMaterialCost = initialAsphaltMaterialCost * scalingFactor;
        totalAsphaltLaborCost = initialAsphaltLaborCost * scalingFactor;
        totalAsphaltOverheadCost = initialAsphaltOverheadCost * scalingFactor;
        if (roofLayers !== '1') {
            totalAsphaltOverheadCost += finalAsphaltSq * pricing.addons.layers[roofLayers];
        }
        totalAsphaltOverheadCost += roofFeatures.chimneys * pricing.addons.features.chimney;
        totalAsphaltOverheadCost += roofFeatures.swampCoolers * pricing.addons.features.swampCooler;
        totalAsphaltOverheadCost += roofFeatures.skylights * pricing.addons.features.skylight;
    }
    const totalAsphaltBaseCost = totalAsphaltMaterialCost + totalAsphaltLaborCost + totalAsphaltOverheadCost;
    const asphaltProfit = totalAsphaltBaseCost * pricing.profitMargin;
    const asphaltTotalRetail = totalAsphaltBaseCost + asphaltProfit;
    const asphaltUpgradeCost = asphaltRoofingEnabled ? finalAsphaltSq * (pricing.upgrades[roofUpgrade] || 0) : 0;
    const asphaltEstimate = {
        materials: totalAsphaltMaterialCost,
        labor: totalAsphaltLaborCost,
        overhead: totalAsphaltOverheadCost,
        profit: asphaltProfit,
        total: asphaltTotalRetail
    };
    // 2. Calculate Flat Roof Estimate (BASE COST ONLY)
    const baseFlatRoofPricing = pricing.flatRoofing['.060MIL TPO'];
    let flatRoofMaterialCost = 0;
    let flatRoofLaborCost = 0;
    let flatRoofOverheadCost = 0;
    if (flatRoofingEnabled && finalFlatSq > 0) {
        flatRoofMaterialCost = finalFlatSq * baseFlatRoofPricing.materials;
        flatRoofLaborCost = finalFlatSq * baseFlatRoofPricing.labor;
        flatRoofOverheadCost = finalFlatSq * baseFlatRoofPricing.overhead;
    }
    const totalFlatRoofBaseCost = flatRoofMaterialCost + flatRoofLaborCost + flatRoofOverheadCost;
    const flatRoofProfit = totalFlatRoofBaseCost * pricing.profitMargin;
    const flatRoofTotalRetail = totalFlatRoofBaseCost + flatRoofProfit;
    const flatRoofingEstimate = {
        materials: flatRoofMaterialCost,
        labor: flatRoofLaborCost,
        overhead: flatRoofOverheadCost,
        profit: flatRoofProfit,
        total: flatRoofTotalRetail
    };
    // 3. Gutter Estimate
    const baseGutterCost = gutters.length * pricing.gutters.perFoot + gutters.miters * pricing.gutters.perMiter + gutters.downspouts1Story * pricing.gutters.downspout1Story + gutters.downspouts2Story * pricing.gutters.downspout2Story + gutters.downspouts3Story * pricing.gutters.downspout3Story + gutters.downspouts4Story * pricing.gutters.downspout4Story;
    const styleMultiplier = pricing.gutters.styleMultipliers?.[surveyState.gutters.style] ?? 1;
    const sizeMultiplier = pricing.gutters.sizeMultipliers?.[surveyState.gutters.size] ?? 1;
    const gutterTotal = baseGutterCost * styleMultiplier * sizeMultiplier;
    const gutterEstimate = {
        materials: gutterTotal * 0.6,
        labor: gutterTotal * 0.4,
        overhead: 0,
        profit: 0,
        total: gutterTotal
    };
    // 4. Heat Trace Estimate
    const heatTraceTotal = heatTrace.length * pricing.heatTrace.perFoot + heatTrace.downspouts1Story * pricing.heatTrace.downspout1Story + heatTrace.downspouts2Story * pricing.heatTrace.downspout2Story + heatTrace.downspouts3Story * pricing.heatTrace.downspout3Story + heatTrace.downspouts4Story * pricing.heatTrace.downspout4Story + (pricing.heatTrace.eaveOverhang[heatTrace.eaveOverhang] || 0);
    const heatTraceEstimate = {
        materials: heatTraceTotal * 0.5,
        labor: heatTraceTotal * 0.5,
        overhead: 0,
        profit: 0,
        total: heatTraceTotal
    };
    // 5. Upgrades & Addons
    const flatRoofingUpgrades = Object.keys(pricing.flatRoofing).reduce((acc, type)=>{
        if (!flatRoofingEnabled || finalFlatSq <= 0) {
            acc[type] = 0;
            return acc;
        }
        const baseCost = finalFlatSq * (baseFlatRoofPricing.materials + baseFlatRoofPricing.labor + baseFlatRoofPricing.overhead) * (1 + pricing.profitMargin);
        const upgradePricing = pricing.flatRoofing[type];
        const upgradeCost = finalFlatSq * (upgradePricing.materials + upgradePricing.labor + upgradePricing.overhead) * (1 + pricing.profitMargin);
        acc[type] = upgradeCost - baseCost;
        return acc;
    }, {});
    const flatRoofColorAddonCost = flatRoofingEnabled && finalFlatSq > 0 ? finalFlatSq * (pricing.flatRoofingColorAddons?.[flatRoofingColor] ?? 0) : 0;
    // 6. Live Total
    const liveGutterTotal = gutters.enabled ? gutterEstimate.total : 0;
    const liveHeatTraceTotal = heatTrace.enabled ? heatTraceEstimate.total : 0;
    const liveFlatRoofUpgradeCost = flatRoofingEnabled ? flatRoofingUpgrades[flatRoofingType] || 0 : 0;
    const liveFlatRoofTotal = flatRoofingEnabled ? flatRoofingEstimate.total + liveFlatRoofUpgradeCost : 0;
    const liveTotal = asphaltTotalRetail + asphaltUpgradeCost + liveFlatRoofTotal + liveGutterTotal + liveHeatTraceTotal + flatRoofColorAddonCost;
    // 7. Pitch breakdown from included buildings
    const pitchBreakdown = includedBuildings.flatMap((b)=>b.facets).reduce((acc, facet)=>{
        const pitchIn12 = Math.round(12 * Math.tan(facet.pitchDegrees * Math.PI / 180));
        const sq = facet.areaMeters * __TURBOPACK__imported__module__$5b$project$5d2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SQ_METERS_TO_SQ_FEET"] / __TURBOPACK__imported__module__$5b$project$5d2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SQ_FEET_PER_SQUARE"];
        const existing = acc.find((p)=>p.pitch === pitchIn12);
        if (existing) {
            existing.sq += sq;
        } else {
            acc.push({
                pitch: pitchIn12,
                sq
            });
        }
        return acc;
    }, []).sort((a, b)=>a.pitch - b.pitch);
    const dominantPitch = pitchBreakdown.length > 0 ? pitchBreakdown.reduce((max, current)=>current.sq > max.sq ? current : max, pitchBreakdown[0]).pitch : 0;
    const estimatedLayers = Math.max(1, Math.floor((new Date().getFullYear() - buildingData.yearConstructed) / 35));
    return {
        baseSq: apiTotalSq,
        finalSq,
        asphaltSq: finalAsphaltSq,
        flatRoofSq: finalFlatSq,
        estimatedLayers,
        pitchBreakdown,
        dominantPitch,
        roofEstimate: {
            breakdown: asphaltEstimate,
            upgrades: pricing.upgrades,
            totalRetail: asphaltTotalRetail + flatRoofTotalRetail,
            totalFacets
        },
        asphaltEstimate,
        gutterEstimate,
        heatTraceEstimate,
        flatRoofingEstimate,
        flatRoofingUpgrades,
        flatRoofColorAddonCost,
        liveTotal
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/mockData.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "generateMockBuildingData",
    ()=>generateMockBuildingData
]);
// Simple pseudo-random generator based on coordinates
const pseudoRandom = (seed1, seed2)=>{
    let s1 = Math.sin(seed1) * 10000;
    let s2 = Math.sin(seed2) * 10000;
    s1 = s1 - Math.floor(s1);
    s2 = s2 - Math.floor(s2);
    return (s1 + s2) / 2;
};
function generateMockBuildingData(place) {
    const lowerCaseAddress = place.address.toLowerCase();
    // Special case for the specific address (Demo Data)
    if (lowerCaseAddress.includes('10437') || lowerCaseAddress.includes('shady plum')) {
        return {
            buildings: [
                {
                    id: 'main_house',
                    totalAreaMeters: 200,
                    facets: [
                        {
                            id: 'f1',
                            areaMeters: 50,
                            pitchDegrees: 22.6
                        },
                        {
                            id: 'f2',
                            areaMeters: 50,
                            pitchDegrees: 22.6
                        },
                        {
                            id: 'f3',
                            areaMeters: 50,
                            pitchDegrees: 33.7
                        },
                        {
                            id: 'f4',
                            areaMeters: 50,
                            pitchDegrees: 33.7
                        }
                    ]
                },
                {
                    id: 'garage',
                    totalAreaMeters: 39.48,
                    facets: [
                        {
                            id: 'g1',
                            areaMeters: 19.74,
                            pitchDegrees: 18.4
                        },
                        {
                            id: 'g2',
                            areaMeters: 19.74,
                            pitchDegrees: 18.4
                        }
                    ]
                }
            ],
            yearConstructed: 2005
        };
    }
    // Specific case for 10850 Beckstead Ln (Large Residential)
    if (lowerCaseAddress.includes('10850') || lowerCaseAddress.includes('beckstead')) {
        return {
            buildings: [
                {
                    id: 'main_estate',
                    totalAreaMeters: 395,
                    facets: [
                        {
                            id: 'f1',
                            areaMeters: 80,
                            pitchDegrees: 26.6
                        },
                        {
                            id: 'f2',
                            areaMeters: 80,
                            pitchDegrees: 26.6
                        },
                        {
                            id: 'f3',
                            areaMeters: 60,
                            pitchDegrees: 18.4
                        },
                        {
                            id: 'f4',
                            areaMeters: 60,
                            pitchDegrees: 18.4
                        },
                        {
                            id: 'f5',
                            areaMeters: 50,
                            pitchDegrees: 33.7
                        },
                        {
                            id: 'f6',
                            areaMeters: 65,
                            pitchDegrees: 0
                        }
                    ]
                }
            ],
            yearConstructed: 1998
        };
    }
    // Default Generator for any other address
    const random = pseudoRandom(place.latitude, place.longitude);
    const yearConstructed = 1970 + Math.floor(random * 50);
    // Generate realistic facets for the "Solar API" simulation
    const baseArea = 250 + random * 100; // Meters
    const numFacets = 6 + Math.floor(random * 6); // 6 to 12 facets
    const facets = [];
    for(let j = 0; j < numFacets; j++){
        const facetArea = baseArea / numFacets;
        // Distribute pitches: Some steep, some low
        const isSteep = Math.random() > 0.5;
        const pitchDegrees = isSteep ? 30 + Math.random() * 10 : 15 + Math.random() * 10;
        facets.push({
            id: `gen_f${j}`,
            areaMeters: facetArea,
            pitchDegrees: pitchDegrees
        });
    }
    return {
        buildings: [
            {
                id: 'Main Structure',
                totalAreaMeters: baseArea,
                facets: facets
            }
        ],
        yearConstructed
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/constants.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "INITIAL_SURVEY_STATE",
    ()=>INITIAL_SURVEY_STATE,
    "METERS_TO_FEET",
    ()=>METERS_TO_FEET,
    "SQ_FEET_PER_SQUARE",
    ()=>SQ_FEET_PER_SQUARE,
    "SQ_METERS_TO_SQ_FEET",
    ()=>SQ_METERS_TO_SQ_FEET
]);
const INITIAL_SURVEY_STATE = {
    latitude: 40.7608,
    longitude: -111.891,
    includedBuildingIds: [],
    totalSq: 0,
    roofLayers: '1',
    roofFeatures: {
        chimneys: 0,
        swampCoolers: 0,
        skylights: 0
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
        size: '5"'
    },
    heatTrace: {
        enabled: false,
        length: 0,
        downspouts1Story: 0,
        downspouts2Story: 0,
        downspouts3Story: 0,
        downspouts4Story: 0,
        eaveOverhang: 'Medium'
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
        wValleyMetal: false
    }
};
const METERS_TO_FEET = 3.28084;
const SQ_METERS_TO_SQ_FEET = METERS_TO_FEET * METERS_TO_FEET;
const SQ_FEET_PER_SQUARE = 100;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/contexts/PricingContext.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PricingProvider",
    ()=>PricingProvider,
    "usePricing",
    ()=>usePricing
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$pricing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/pricing.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
;
;
const PricingContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
const PricingProvider = ({ children })=>{
    _s();
    const [pricing, setPricingState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "PricingProvider.useState": ()=>{
            try {
                const storedPricing = localStorage.getItem('rhive-pricing');
                return storedPricing ? JSON.parse(storedPricing) : __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$pricing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PRICING_DATA"];
            } catch (error) {
                console.error('Error loading pricing from localStorage', error);
                return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$pricing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PRICING_DATA"];
            }
        }
    }["PricingProvider.useState"]);
    const setPricing = (newPricing)=>{
        try {
            localStorage.setItem('rhive-pricing', JSON.stringify(newPricing));
            setPricingState(newPricing);
        } catch (error) {
            console.error('Error saving pricing to localStorage', error);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(PricingContext.Provider, {
        value: {
            pricing,
            setPricing
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/contexts/PricingContext.tsx",
        lineNumber: 33,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(PricingProvider, "GKKMauYLuO/imnZTIXf94Em0828=");
_c = PricingProvider;
const usePricing = ()=>{
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(PricingContext);
    if (context === undefined) {
        throw new Error('usePricing must be used within a PricingProvider');
    }
    return context;
};
_s1(usePricing, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "PricingProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/contexts/MockDatabaseContext.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MockDatabaseProvider",
    ()=>MockDatabaseProvider,
    "useMockDB",
    ()=>useMockDB
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
;
const MockDatabaseContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
// --- SEED DATA ---
const SEED_USERS = [
    {
        id: 'U-EMP-1',
        name: 'Mike Robinson',
        role: 'Employee',
        email: 'mike@rhive.com',
        avatarUrl: 'https://i.pravatar.cc/150?u=mike'
    },
    {
        id: 'U-CUST-1',
        name: 'Michael Robinson',
        role: 'Customer',
        email: 'michael.robinson@gmail.com',
        phone: '(801) 555-0192',
        avatarUrl: 'https://i.pravatar.cc/150?u=michael'
    },
    {
        id: 'U-CUST-2',
        name: 'Willow Park HOA',
        role: 'Customer',
        email: 'board@willowpark.com'
    },
    {
        id: 'U-CONT-1',
        name: 'Quality Roofing',
        role: 'Contractor',
        email: 'jobs@quality.com'
    },
    {
        id: 'U-SUPP-1',
        name: 'ABC Supply',
        role: 'Supplier',
        email: 'orders@abc.com'
    },
    {
        id: 'U-ACC-LHM',
        name: 'Larry H Miller Group',
        role: 'Customer',
        email: 'billing@lhm.com'
    },
    {
        id: 'U-GUEST',
        name: 'Public Guest',
        role: 'Public',
        email: 'guest@rhive.com'
    }
];
const SEED_PROPERTIES = [
    {
        _id: 'PROP-1',
        address_full: '1927 Thompson St, Boulder, CO',
        owner_id: 'U-CUST-1',
        type: 'Residential',
        coordinates: {
            lat: 40.0,
            lng: -105.0
        },
        features: [
            'Shingle',
            'Solar'
        ]
    },
    {
        _id: 'PROP-2',
        address_full: '525 Aspen Meadow Dr, Logan, UT',
        owner_id: 'U-CUST-2',
        type: 'Commercial',
        coordinates: {
            lat: 41.7,
            lng: -111.8
        },
        features: [
            'Flat',
            'Commercial'
        ]
    },
    {
        _id: 'PROP-3',
        address_full: 'Hill AFB Hangar 42, UT',
        owner_id: 'U-GOV',
        type: 'Government',
        coordinates: {
            lat: 41.1,
            lng: -111.9
        },
        features: [
            'Metal',
            'High Security'
        ]
    },
    {
        _id: 'PROP-MEGAPLEX',
        address_full: 'South Jordan Parkway Megaplex',
        owner_id: 'U-ACC-LHM',
        type: 'Commercial',
        coordinates: {
            lat: 40.5,
            lng: -111.9
        },
        features: [
            'Flat',
            'Commercial'
        ]
    }
];
const SEED_PROJECTS = [
    {
        _id: 'PROJ-1',
        name: 'Thompson Roof Replacement',
        property_id: 'PROP-1',
        account_id: 'U-CUST-1',
        project_type: 'Residential',
        current_stage: 'Quote',
        status: 'Active',
        last_updated: '2023-10-01',
        quote: {
            total: 14500,
            status: 'Sent',
            items: [
                {
                    name: 'Materials',
                    cost: 8000
                },
                {
                    name: 'Labor',
                    cost: 6500
                }
            ]
        }
    },
    {
        _id: 'PROJ-2',
        name: 'Willow Park Gutter Repair',
        property_id: 'PROP-2',
        account_id: 'U-CUST-2',
        project_type: 'Commercial',
        current_stage: 'Schedule',
        status: 'Active',
        assigned_contractor_id: 'U-CONT-1',
        last_updated: '2023-10-05',
        quote: {
            total: 4200,
            status: 'Approved',
            items: []
        }
    },
    {
        _id: 'PROJ-3',
        name: 'Hangar 42 Security Upgrade',
        property_id: 'PROP-3',
        account_id: 'U-GOV',
        project_type: 'Government',
        current_stage: 'Estimate',
        status: 'Active',
        last_updated: '2023-10-10',
        compliance: {
            solicitation_num: '',
            wage_determination: '',
            certified_payroll_status: false
        }
    },
    {
        _id: 'PROJ-MEGA',
        name: 'Megaplex Roof Restore',
        property_id: 'PROP-MEGAPLEX',
        account_id: 'U-ACC-LHM',
        project_type: 'Commercial',
        current_stage: 'Lead',
        status: 'Active',
        last_updated: '2023-10-12'
    }
];
const MockDatabaseProvider = ({ children })=>{
    _s();
    const [users, setUsers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(SEED_USERS);
    const [properties, setProperties] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(SEED_PROPERTIES);
    const [projects, setProjects] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(SEED_PROJECTS);
    const [currentUser, setCurrentUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "MockDatabaseProvider.useState": ()=>{
            const saved = localStorage.getItem('rhive_user');
            return saved ? JSON.parse(saved) : null;
        }
    }["MockDatabaseProvider.useState"]);
    const [currentProjectId, setCurrentProjectId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(localStorage.getItem('rhive_project_id'));
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MockDatabaseProvider.useEffect": ()=>{
            if (currentUser) localStorage.setItem('rhive_user', JSON.stringify(currentUser));
            else localStorage.removeItem('rhive_user');
        }
    }["MockDatabaseProvider.useEffect"], [
        currentUser
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MockDatabaseProvider.useEffect": ()=>{
            if (currentProjectId) localStorage.setItem('rhive_project_id', currentProjectId);
            else localStorage.removeItem('rhive_project_id');
        }
    }["MockDatabaseProvider.useEffect"], [
        currentProjectId
    ]);
    const login = (role)=>{
        const user = users.find((u)=>u.role === role) || users[users.length - 1]; // Fallback to Guest
        setCurrentUser(user);
    };
    const logout = ()=>{
        setCurrentUser(null);
        setCurrentProjectId(null);
    };
    // --- ACTIONS ---
    const addUser = (user)=>{
        const newUser = {
            id: `U-${Date.now()}`,
            name: user.name || 'Unknown',
            role: user.role || 'Customer',
            email: user.email || '',
            phone: user.phone || '',
            avatarUrl: user.avatarUrl
        };
        setUsers((prev)=>[
                ...prev,
                newUser
            ]);
    };
    const addProperty = (property)=>{
        const newProperty = {
            _id: `PROP-${Date.now()}`,
            address_full: property.address_full || 'Unknown Address',
            type: property.type || 'Residential',
            owner_id: property.owner_id || 'Unknown',
            coordinates: {
                lat: 0,
                lng: 0
            },
            features: []
        };
        setProperties((prev)=>[
                ...prev,
                newProperty
            ]);
    };
    const addCommunication = (type, targetId, content)=>{
        console.log(`[SIMULATION] Added ${type} to ${targetId}: ${content}`);
    };
    const createProject = (name, type, propertyId, accountId)=>{
        const newId = `PROJ-${projects.length + 1}`;
        const newProject = {
            _id: newId,
            name,
            project_type: type,
            property_id: propertyId,
            account_id: accountId,
            current_stage: 'Estimate',
            status: 'Active',
            last_updated: new Date().toISOString().split('T')[0]
        };
        setProjects([
            ...projects,
            newProject
        ]);
        return newId;
    };
    const updateProjectStage = (projectId, stage)=>{
        setProjects((prev)=>prev.map((p)=>p._id === projectId ? {
                    ...p,
                    current_stage: stage,
                    last_updated: new Date().toISOString()
                } : p));
    };
    const saveQuote = (projectId, total, items)=>{
        setProjects((prev)=>prev.map((p)=>p._id === projectId ? {
                    ...p,
                    quote: {
                        total,
                        status: 'Sent',
                        items
                    },
                    current_stage: 'Quote'
                } : p));
    };
    const approveQuote = (projectId)=>{
        setProjects((prev)=>prev.map((p)=>p._id === projectId ? {
                    ...p,
                    quote: {
                        ...p.quote,
                        status: 'Approved'
                    },
                    current_stage: 'Sign & Verify'
                } : p));
    };
    const getProject = (id)=>projects.find((p)=>p._id === id);
    const getUserProjects = (userId)=>{
        if (!userId) return [];
        if (currentUser?.role === 'Contractor') {
            return projects.filter((p)=>p.assigned_contractor_id === userId || p.current_stage === 'Schedule' || p.current_stage === 'Install');
        }
        if (currentUser?.role === 'Customer') {
            return projects.filter((p)=>p.account_id === userId);
        }
        return projects;
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MockDatabaseContext.Provider, {
        value: {
            users,
            properties,
            projects,
            currentUser,
            currentProjectId,
            setCurrentProjectId,
            login,
            logout,
            addUser,
            addProperty,
            addCommunication,
            createProject,
            updateProjectStage,
            saveQuote,
            approveQuote,
            getProject,
            getUserProjects
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/contexts/MockDatabaseContext.tsx",
        lineNumber: 213,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
_s(MockDatabaseProvider, "p020MSbNtLOPKDODvXm9NF7Q3Xw=");
_c = MockDatabaseProvider;
const useMockDB = ()=>{
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(MockDatabaseContext);
    if (!context) throw new Error("useMockDB must be used within MockDatabaseProvider");
    return context;
};
_s1(useMockDB, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "MockDatabaseProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/contexts/NavigationContext.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "NavigationProvider",
    ()=>NavigationProvider,
    "useNavigation",
    ()=>useNavigation
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
;
const NavigationContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
const NavigationProvider = ({ children })=>{
    _s();
    const [activePageId, setActivePageId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(NavigationContext.Provider, {
        value: {
            activePageId,
            setActivePageId
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/contexts/NavigationContext.tsx",
        lineNumber: 15,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
_s(NavigationProvider, "4dXW47greIKCrEfQ/ffi8EOI86U=");
_c = NavigationProvider;
const useNavigation = ()=>{
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(NavigationContext);
    if (!context) throw new Error("useNavigation must be used within NavigationProvider");
    return context;
};
_s1(useNavigation, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "NavigationProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/constants.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BUNDLES_PER_SQUARE",
    ()=>BUNDLES_PER_SQUARE,
    "DRIP_EDGE_FEET_PER_PIECE",
    ()=>DRIP_EDGE_FEET_PER_PIECE,
    "ICE_WATER_SQ_FEET_PER_ROLL",
    ()=>ICE_WATER_SQ_FEET_PER_ROLL,
    "METERS_TO_FEET",
    ()=>METERS_TO_FEET,
    "PAGE_GROUPS",
    ()=>PAGE_GROUPS,
    "PROJECT_STAGES",
    ()=>PROJECT_STAGES,
    "RIDGE_CAP_LINEAR_FEET_PER_BUNDLE",
    ()=>RIDGE_CAP_LINEAR_FEET_PER_BUNDLE,
    "SQ_FEET_PER_SQUARE",
    ()=>SQ_FEET_PER_SQUARE,
    "SQ_METERS_TO_SQ_FEET",
    ()=>SQ_METERS_TO_SQ_FEET,
    "STARTER_LINEAR_FEET_PER_BUNDLE",
    ()=>STARTER_LINEAR_FEET_PER_BUNDLE,
    "UNDERLAYMENT_SQ_FEET_PER_ROLL",
    ()=>UNDERLAYMENT_SQ_FEET_PER_ROLL,
    "WASTE_FACTOR_PERCENT",
    ()=>WASTE_FACTOR_PERCENT
]);
const METERS_TO_FEET = 3.28084;
const SQ_METERS_TO_SQ_FEET = METERS_TO_FEET * METERS_TO_FEET; // 10.7639
const SQ_FEET_PER_SQUARE = 100;
const WASTE_FACTOR_PERCENT = 10; // Default 10% waste
const BUNDLES_PER_SQUARE = 3; // Standard 3-tab shingles
const STARTER_LINEAR_FEET_PER_BUNDLE = 100;
const RIDGE_CAP_LINEAR_FEET_PER_BUNDLE = 33;
const ICE_WATER_SQ_FEET_PER_ROLL = 65;
const UNDERLAYMENT_SQ_FEET_PER_ROLL = 1000; // 10 squares
const DRIP_EDGE_FEET_PER_PIECE = 10;
const PROJECT_STAGES = [
    'Lead',
    'Estimate',
    'Quote',
    'Sign & Verify',
    'Schedule',
    'Pre-Installation',
    'Install',
    'Punch List',
    'Invoicing',
    'Completed',
    'Past Customer'
];
const PAGE_GROUPS = [
    {
        userType: 'Public',
        pages: [
            {
                id: 'P-01',
                name: 'About Us',
                userType: 'Public',
                description: 'Mission, Vision & Values'
            },
            {
                id: 'P-02',
                name: 'Our Services',
                userType: 'Public',
                description: 'Residential & Commercial Solutions'
            },
            {
                id: 'P-03',
                name: 'Our Process',
                userType: 'Public',
                description: 'The 10-Stage Journey'
            },
            {
                id: 'P-04',
                name: 'Financing',
                userType: 'Public',
                description: 'RPSP & Payment Options'
            },
            {
                id: 'P-05',
                name: 'Contact',
                userType: 'Public',
                description: 'Directory & Lead Gen'
            },
            {
                id: 'P-07',
                name: 'Password Reset',
                userType: 'Public',
                description: 'Secure Account Recovery'
            },
            {
                id: 'P-09',
                name: 'CONTRACTOR SIGNUP',
                userType: 'Public',
                description: 'Vendor Vetting & Onboarding'
            },
            {
                id: 'P-10',
                name: 'PUBLIC CAREERS',
                userType: 'Public',
                description: 'Recruitment & Brand Manifesto'
            },
            {
                id: 'P-11',
                name: 'JOB APPLICATION',
                userType: 'Public',
                description: 'Candidate Intake Wizard'
            },
            {
                id: 'P-12',
                name: 'ESTIMATE TOOL',
                userType: 'Public',
                description: 'Instant Pricing Engine'
            }
        ]
    },
    {
        userType: 'Employee',
        pages: [
            {
                id: 'A-01',
                name: 'Admin Admin Dashboard',
                userType: 'Employee'
            },
            {
                id: 'A-02',
                name: 'Admin User Management',
                userType: 'Employee'
            },
            {
                id: 'A-03',
                name: 'Admin ESTIMATE PRICING',
                userType: 'Employee'
            },
            {
                id: 'A-04',
                name: 'Admin ESTIMATE BACK END + API',
                userType: 'Employee'
            },
            {
                id: 'A-05',
                name: 'Admin LINE ITEM CATALOG',
                userType: 'Employee'
            },
            {
                id: 'A-06',
                name: 'Admin LINE ITEM PROFILE',
                userType: 'Employee'
            }
        ]
    },
    {
        userType: 'Employee',
        pages: [
            {
                id: 'E-01',
                name: 'Employee Dashboard',
                userType: 'Employee'
            },
            {
                id: 'E-02',
                name: 'GLOBAL NAV - CUSTOMER LOOKUP',
                userType: 'Employee'
            },
            {
                id: 'E-02a',
                name: 'CUSTOMER INPUT PAGE',
                userType: 'Employee'
            },
            {
                id: 'E-03',
                name: 'AI ASSISTANT (GLOBAL)',
                userType: 'Employee'
            },
            {
                id: 'E-04',
                name: 'CALENDAR',
                userType: 'Employee'
            },
            {
                id: 'E-05',
                name: 'PIPELINE',
                userType: 'Employee'
            },
            {
                id: 'E-06',
                name: 'CUSTOMER PROJECT MAP',
                userType: 'Employee'
            },
            {
                id: 'E-07',
                name: 'MY ACCOUNTS (CRM)',
                userType: 'Employee'
            },
            {
                id: 'E-08',
                name: 'ACCOUNT PROFILE',
                userType: 'Employee'
            },
            {
                id: 'E-09',
                name: 'MY CONTACTS (CRM)',
                userType: 'Employee'
            },
            {
                id: 'E-10',
                name: 'CONTACT PROFILE',
                userType: 'Employee'
            },
            {
                id: 'E-11',
                name: 'MY PROPERTIES (CRM)',
                userType: 'Employee'
            },
            {
                id: 'E-12',
                name: 'PROPERTY PROFILE',
                userType: 'Employee'
            },
            {
                id: 'E-14',
                name: 'PROJECT HUB',
                userType: 'Employee'
            },
            {
                id: 'E-15',
                name: 'PROJECT PROFILE',
                userType: 'Employee'
            },
            {
                id: 'E-16',
                name: 'INCOME ACTIONATOR',
                userType: 'Employee'
            },
            {
                id: 'E-17',
                name: 'COMMISSION COMPASS',
                userType: 'Employee'
            },
            {
                id: 'E-18',
                name: 'REPORT BUILDER',
                userType: 'Employee'
            },
            {
                id: 'E-19',
                name: 'LINE ITEM CATALOG',
                userType: 'Employee'
            },
            {
                id: 'E-20',
                name: 'LINE ITEM PROFILE',
                userType: 'Employee'
            },
            {
                id: 'E-21',
                name: 'MY INFO',
                userType: 'Employee'
            },
            {
                id: 'E-22',
                name: 'EMPLOYEE TIMEOFF',
                userType: 'Employee'
            },
            {
                id: 'E-23',
                name: 'QUOTE BUILDER TOOL',
                userType: 'Employee'
            },
            {
                id: 'E-24',
                name: 'CONTACTS/VENDORS',
                userType: 'Employee'
            },
            {
                id: 'E-25',
                name: 'CONTACT/VENDOR PROFILES',
                userType: 'Employee'
            },
            {
                id: 'E-26',
                name: 'LEAD STAGE PAGE',
                userType: 'Employee'
            },
            {
                id: 'E-27',
                name: 'ESTIMATE STAGE PAGE',
                userType: 'Employee'
            },
            {
                id: 'E-28',
                name: 'QUOTE STAGE PAGE',
                userType: 'Employee'
            },
            {
                id: 'E-29',
                name: 'SIGN & VERIFY PAGE',
                userType: 'Employee'
            },
            {
                id: 'E-30',
                name: 'SCHEDULE STAGE PAGE',
                userType: 'Employee'
            },
            {
                id: 'E-31',
                name: 'PRE INSTALLATION STAGE PAGE',
                userType: 'Employee'
            },
            {
                id: 'E-32',
                name: 'INSTALL STAGE PAGE',
                userType: 'Employee'
            },
            {
                id: 'E-33',
                name: 'PUNCH LIST STAGE PAGE',
                userType: 'Employee'
            },
            {
                id: 'E-34',
                name: 'INVOICING STAGE PAGE',
                userType: 'Employee'
            },
            {
                id: 'E-35',
                name: 'PAYMENTS modular PAGE',
                userType: 'Employee'
            },
            {
                id: 'E-36',
                name: 'COMPLETED STAGE PAGE',
                userType: 'Employee'
            },
            {
                id: 'E-37',
                name: 'PAST CUSTOMER STAGE PAGE',
                userType: 'Employee'
            },
            {
                id: 'E-38',
                name: 'WEATHER GUIDE WIDGET',
                userType: 'Employee'
            },
            {
                id: 'E-39',
                name: 'BRADING',
                userType: 'Employee'
            }
        ]
    },
    {
        userType: 'Customer',
        pages: [
            {
                id: 'C-01',
                name: 'Customer Homepage',
                userType: 'Customer',
                description: 'Welcome'
            },
            {
                id: 'C-02',
                name: 'MY PROJECTS',
                userType: 'Customer',
                description: 'Active Project Status'
            },
            {
                id: 'C-03',
                name: 'CUSTOMER PROJECT PROFILE',
                userType: 'Customer',
                description: 'Job Specific Details'
            },
            {
                id: 'C-04',
                name: 'MY PROFILE',
                userType: 'Customer',
                description: 'Personal Settings'
            },
            {
                id: 'P-12',
                name: 'ESTIMATE TOOL',
                userType: 'Customer',
                description: 'Public Calculator'
            }
        ]
    },
    {
        userType: 'Contractor',
        pages: [
            {
                id: 'CO-01',
                name: 'Contractor Homepage',
                userType: 'Contractor',
                description: 'Active Assignments'
            },
            {
                id: 'CO-02',
                name: 'ONBOARDING',
                userType: 'Contractor',
                description: 'Vetting Process'
            },
            {
                id: 'CO-03',
                name: 'MY PROFILE & DOCS',
                userType: 'Contractor',
                description: 'Compliance & Safety'
            },
            {
                id: 'CO-04',
                name: 'MY SERVICES & PRICING',
                userType: 'Contractor',
                description: 'Rate Cards'
            },
            {
                id: 'CO-05',
                name: 'AVAILABLE JOBS',
                userType: 'Contractor',
                description: 'Bidding Opportunities'
            },
            {
                id: 'CO-06',
                name: 'MY JOBS',
                userType: 'Contractor',
                description: 'Current Active Projects'
            },
            {
                id: 'CO-07',
                name: 'MY PAYMENTS',
                userType: 'Contractor',
                description: 'Financial Status'
            },
            {
                id: 'CO-08',
                name: 'Contractor Map',
                userType: 'Contractor',
                description: 'Geographical Pipeline'
            }
        ]
    },
    {
        userType: 'Supplier',
        pages: [
            {
                id: 'S-01',
                name: 'Supplier Homepage',
                userType: 'Supplier',
                description: 'Orders & Bids'
            },
            {
                id: 'S-02',
                name: 'MY PRICE LISTS',
                userType: 'Supplier',
                description: 'Pricing Management'
            },
            {
                id: 'S-03',
                name: 'PURCHASE ORDERS',
                userType: 'Supplier',
                description: 'Project Fulfillment'
            },
            {
                id: 'S-04',
                name: 'MY COMPANY PROFILE',
                userType: 'Supplier',
                description: 'Business & Legal Data'
            }
        ]
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/hooks/useGoogleMapsApi.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useGoogleMapsApi",
    ()=>useGoogleMapsApi
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
function useGoogleMapsApi() {
    _s();
    const [isApiReady, setIsApiReady] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(!!window.googleMapsApiLoaded);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useGoogleMapsApi.useEffect": ()=>{
            if (isApiReady) return;
            const onReady = {
                "useGoogleMapsApi.useEffect.onReady": ()=>setIsApiReady(true)
            }["useGoogleMapsApi.useEffect.onReady"];
            if (window.googleMapsApiLoaded) {
                onReady();
                return;
            }
            window.addEventListener('google-maps-api-ready', onReady);
            return ({
                "useGoogleMapsApi.useEffect": ()=>{
                    window.removeEventListener('google-maps-api-ready', onReady);
                }
            })["useGoogleMapsApi.useEffect"];
        }
    }["useGoogleMapsApi.useEffect"], [
        isApiReady
    ]);
    return isApiReady;
}
_s(useGoogleMapsApi, "EkP8Z3xO3wd49HpK9xzojY0b/50=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/pageRegistry.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "pageComponentMap",
    ()=>pageComponentMap
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
// Import all page components
var __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$LoginPage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/pages/LoginPage.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$AboutUsPage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/pages/AboutUsPage.tsx [app-client] (ecmascript)"); // P-01
var __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$OurServicesPage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/pages/OurServicesPage.tsx [app-client] (ecmascript)"); // P-02
var __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$OurProcessPage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/pages/OurProcessPage.tsx [app-client] (ecmascript)"); // P-03
var __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$FinancingPage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/pages/FinancingPage.tsx [app-client] (ecmascript)"); // P-04
var __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$ContactPage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/pages/ContactPage.tsx [app-client] (ecmascript)"); // P-05
var __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$PasswordResetPage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/pages/PasswordResetPage.tsx [app-client] (ecmascript)"); // P-07
var __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$ContractorSignupPage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/pages/ContractorSignupPage.tsx [app-client] (ecmascript)"); // P-09
var __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$PublicCareersPage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/pages/PublicCareersPage.tsx [app-client] (ecmascript)"); // P-10
var __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$JobApplicationPage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/pages/JobApplicationPage.tsx [app-client] (ecmascript)"); // P-11
var __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$EmployeeHomepage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/pages/EmployeeHomepage.tsx [app-client] (ecmascript)"); // E-01
var __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$GlobalNavCustomerLookup$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/pages/GlobalNavCustomerLookup.tsx [app-client] (ecmascript)"); // E-02
var __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$CustomerInputPage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/pages/CustomerInputPage.tsx [app-client] (ecmascript)"); // E-02a
var __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$EmployeePipelinePage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/pages/EmployeePipelinePage.tsx [app-client] (ecmascript)"); // E-05
var __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$IncomeActionatorPage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/pages/IncomeActionatorPage.tsx [app-client] (ecmascript)"); // E-16
var __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$ReportingPage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/pages/ReportingPage.tsx [app-client] (ecmascript)"); // E-18
var __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$EmployeeInfoPage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/pages/EmployeeInfoPage.tsx [app-client] (ecmascript)"); // E-21
var __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$EmployeeTimeoffPage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/pages/EmployeeTimeoffPage.tsx [app-client] (ecmascript)"); // E-22 / E-04
var __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$EstimateToolPage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/pages/EstimateToolPage.tsx [app-client] (ecmascript)"); // E-27 / P-12
var __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$EstimatePricingPage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/pages/EstimatePricingPage.tsx [app-client] (ecmascript)"); // A-03
var __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$EstimateBackendApiPage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/pages/EstimateBackendApiPage.tsx [app-client] (ecmascript)"); // A-04
var __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$QuoteBuilderToolPage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/pages/QuoteBuilderToolPage.tsx [app-client] (ecmascript)"); // E-23
var __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$LineItemCatalogPage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/pages/LineItemCatalogPage.tsx [app-client] (ecmascript)"); // A-05 / E-19
var __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$LineItemProfilePage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/pages/LineItemProfilePage.tsx [app-client] (ecmascript)"); // A-06 / E-20
var __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$ContactsVendorsPage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/pages/ContactsVendorsPage.tsx [app-client] (ecmascript)"); // E-24
var __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$ContactVendorProfilePage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/pages/ContactVendorProfilePage.tsx [app-client] (ecmascript)"); // E-25
var __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$CompanyPage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/pages/CompanyPage.tsx [app-client] (ecmascript)"); // E-12 (Property Profile)
var __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$PropertyPage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/pages/PropertyPage.tsx [app-client] (ecmascript)"); // E-12
var __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$WeatherGuideWidgetPage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/pages/WeatherGuideWidgetPage.tsx [app-client] (ecmascript)"); // E-38
var __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$CustomerProjectMapPage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/pages/CustomerProjectMapPage.tsx [app-client] (ecmascript)"); // E-06
var __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$CustomerHomepage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/pages/CustomerHomepage.tsx [app-client] (ecmascript)"); // C-01
var __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$CustomerDashboard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/pages/CustomerDashboard.tsx [app-client] (ecmascript)"); // C-02
var __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$CustomerProjectProfilePage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/pages/CustomerProjectProfilePage.tsx [app-client] (ecmascript)"); // C-03
var __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$ContractorHomepage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/pages/ContractorHomepage.tsx [app-client] (ecmascript)"); // CO-01
var __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$ContractorAdminPanelPage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/pages/ContractorAdminPanelPage.tsx [app-client] (ecmascript)"); // CO-03
var __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$ContractorFinancialsPage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/pages/ContractorFinancialsPage.tsx [app-client] (ecmascript)"); // CO-07
var __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$NewProjectBidsPage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/pages/NewProjectBidsPage.tsx [app-client] (ecmascript)"); // CO-05
var __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$SupplierHomepage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/pages/SupplierHomepage.tsx [app-client] (ecmascript)"); // S-01
var __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$SupplierProfilePage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/pages/SupplierProfilePage.tsx [app-client] (ecmascript)"); // S-04
var __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$CustomerTrackerPage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/pages/CustomerTrackerPage.tsx [app-client] (ecmascript)"); // C-Tracker
var __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$SimulationGuidePage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/pages/SimulationGuidePage.tsx [app-client] (ecmascript)"); // (Simulation)
var __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$RHIVEBrandingPage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/pages/RHIVEBrandingPage.tsx [app-client] (ecmascript)"); // E-39
// Specific stage pages
var __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$LeadPage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/pages/LeadPage.tsx [app-client] (ecmascript)"); // E-26
var __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$QuotePage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/pages/QuotePage.tsx [app-client] (ecmascript)"); // E-28
var __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$SignAndVerifyPage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/pages/SignAndVerifyPage.tsx [app-client] (ecmascript)"); // E-29
var __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$SchedulePage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/pages/SchedulePage.tsx [app-client] (ecmascript)"); // E-30
var __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$PreInstallationPage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/pages/PreInstallationPage.tsx [app-client] (ecmascript)"); // E-31
var __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$InstallPage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/pages/InstallPage.tsx [app-client] (ecmascript)"); // E-32
var __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$PunchListPage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/pages/PunchListPage.tsx [app-client] (ecmascript)"); // E-33
var __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$InvoicingPage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/pages/InvoicingPage.tsx [app-client] (ecmascript)"); // E-34
var __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$PaymentsModularPage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/pages/PaymentsModularPage.tsx [app-client] (ecmascript)"); // E-35
var __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$CompletedPage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/pages/CompletedPage.tsx [app-client] (ecmascript)"); // E-36
var __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$PastCustomerPage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/pages/PastCustomerPage.tsx [app-client] (ecmascript)"); // E-37
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
const Placeholder = ({ name })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "p-10 text-white font-mono",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                className: "text-2xl font-bold text-[#ec028b] mb-4",
                children: name
            }, void 0, false, {
                fileName: "[project]/pageRegistry.tsx",
                lineNumber: 63,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-gray-400",
                children: "Design Mockup: This module is currently under construction for original design verification."
            }, void 0, false, {
                fileName: "[project]/pageRegistry.tsx",
                lineNumber: 64,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/pageRegistry.tsx",
        lineNumber: 62,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
_c = Placeholder;
const pageComponentMap = {
    // Public
    'P-01': __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$AboutUsPage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    'P-02': __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$OurServicesPage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    'P-03': __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$OurProcessPage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    'P-04': __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$FinancingPage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    'P-05': __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$ContactPage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    'P-06': __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$LoginPage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    'P-07': __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$PasswordResetPage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    'P-09': __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$ContractorSignupPage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    'P-10': __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$PublicCareersPage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    'P-11': __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$JobApplicationPage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    'P-12': __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$EstimateToolPage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    // Admin (Employee World Section 1)
    'A-01': ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Placeholder, {
            name: "Admin Admin Dashboard"
        }, void 0, false, {
            fileName: "[project]/pageRegistry.tsx",
            lineNumber: 83,
            columnNumber: 17
        }, ("TURBOPACK compile-time value", void 0)),
    'A-02': ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Placeholder, {
            name: "Admin User Management"
        }, void 0, false, {
            fileName: "[project]/pageRegistry.tsx",
            lineNumber: 84,
            columnNumber: 17
        }, ("TURBOPACK compile-time value", void 0)),
    'A-03': __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$EstimatePricingPage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    'A-04': __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$EstimateBackendApiPage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    'A-05': __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$LineItemCatalogPage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    'A-06': __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$LineItemProfilePage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    // Employee (Employee World Section 2)
    'E-01': __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$EmployeeHomepage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    'E-02': __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$GlobalNavCustomerLookup$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    'E-02a': __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$CustomerInputPage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    'E-03': ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Placeholder, {
            name: "AI ASSISTANT (GLOBAL)"
        }, void 0, false, {
            fileName: "[project]/pageRegistry.tsx",
            lineNumber: 94,
            columnNumber: 17
        }, ("TURBOPACK compile-time value", void 0)),
    'E-04': __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$EmployeeTimeoffPage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    'E-05': __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$EmployeePipelinePage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    'E-06': __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$CustomerProjectMapPage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    'E-07': ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Placeholder, {
            name: "MY ACCOUNTS (CRM)"
        }, void 0, false, {
            fileName: "[project]/pageRegistry.tsx",
            lineNumber: 98,
            columnNumber: 17
        }, ("TURBOPACK compile-time value", void 0)),
    'E-08': __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$CompanyPage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    'E-09': ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Placeholder, {
            name: "MY CONTACTS (CRM)"
        }, void 0, false, {
            fileName: "[project]/pageRegistry.tsx",
            lineNumber: 100,
            columnNumber: 17
        }, ("TURBOPACK compile-time value", void 0)),
    'E-10': __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$ContactVendorProfilePage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    'E-11': ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Placeholder, {
            name: "MY PROPERTIES (CRM)"
        }, void 0, false, {
            fileName: "[project]/pageRegistry.tsx",
            lineNumber: 102,
            columnNumber: 17
        }, ("TURBOPACK compile-time value", void 0)),
    'E-12': __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$PropertyPage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    'E-14': ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Placeholder, {
            name: "PROJECT HUB"
        }, void 0, false, {
            fileName: "[project]/pageRegistry.tsx",
            lineNumber: 104,
            columnNumber: 17
        }, ("TURBOPACK compile-time value", void 0)),
    'E-15': ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Placeholder, {
            name: "PROJECT PROFILE"
        }, void 0, false, {
            fileName: "[project]/pageRegistry.tsx",
            lineNumber: 105,
            columnNumber: 17
        }, ("TURBOPACK compile-time value", void 0)),
    'E-16': __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$IncomeActionatorPage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    'E-17': ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Placeholder, {
            name: "COMMISSION COMPASS"
        }, void 0, false, {
            fileName: "[project]/pageRegistry.tsx",
            lineNumber: 107,
            columnNumber: 17
        }, ("TURBOPACK compile-time value", void 0)),
    'E-18': __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$ReportingPage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    'E-19': __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$LineItemCatalogPage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    'E-20': __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$LineItemProfilePage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    'E-21': __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$EmployeeInfoPage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    'E-22': __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$EmployeeTimeoffPage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    'E-21a': ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Placeholder, {
            name: "EMPLOYEE PROFILE"
        }, void 0, false, {
            fileName: "[project]/pageRegistry.tsx",
            lineNumber: 113,
            columnNumber: 18
        }, ("TURBOPACK compile-time value", void 0)),
    'E-23': __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$QuoteBuilderToolPage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    'E-24': __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$ContactsVendorsPage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    'E-25': __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$ContactVendorProfilePage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    'E-26': __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$LeadPage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    'E-27': __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$EstimateToolPage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    'E-28': __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$QuotePage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    'E-29': __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$SignAndVerifyPage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    'E-30': __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$SchedulePage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    'E-31': __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$PreInstallationPage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    'E-32': __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$InstallPage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    'E-33': __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$PunchListPage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    'E-34': __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$InvoicingPage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    'E-35': __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$PaymentsModularPage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    'E-36': __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$CompletedPage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    'E-37': __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$PastCustomerPage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    'E-38': __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$WeatherGuideWidgetPage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    'E-39': __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$RHIVEBrandingPage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    // Customer
    'C-01': __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$CustomerHomepage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    'C-02': __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$CustomerDashboard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    'C-Tracker': __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$CustomerTrackerPage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    'C-03': __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$CustomerProjectProfilePage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    'C-04': ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Placeholder, {
            name: "MY PROFILE"
        }, void 0, false, {
            fileName: "[project]/pageRegistry.tsx",
            lineNumber: 137,
            columnNumber: 17
        }, ("TURBOPACK compile-time value", void 0)),
    // Contractor
    'CO-01': __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$ContractorHomepage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    'CO-02': ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Placeholder, {
            name: "ONBOARDING"
        }, void 0, false, {
            fileName: "[project]/pageRegistry.tsx",
            lineNumber: 141,
            columnNumber: 18
        }, ("TURBOPACK compile-time value", void 0)),
    'CO-03': __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$ContractorAdminPanelPage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    'CO-04': ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Placeholder, {
            name: "MY SERVICES & PRICING"
        }, void 0, false, {
            fileName: "[project]/pageRegistry.tsx",
            lineNumber: 143,
            columnNumber: 18
        }, ("TURBOPACK compile-time value", void 0)),
    'CO-05': __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$NewProjectBidsPage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    'CO-06': ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Placeholder, {
            name: "MY JOBS"
        }, void 0, false, {
            fileName: "[project]/pageRegistry.tsx",
            lineNumber: 145,
            columnNumber: 18
        }, ("TURBOPACK compile-time value", void 0)),
    'CO-07': __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$ContractorFinancialsPage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    'CO-08': ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Placeholder, {
            name: "Contractor Map"
        }, void 0, false, {
            fileName: "[project]/pageRegistry.tsx",
            lineNumber: 147,
            columnNumber: 18
        }, ("TURBOPACK compile-time value", void 0)),
    // Supplier
    'S-01': __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$SupplierHomepage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    'S-02': ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Placeholder, {
            name: "MY PRICE LISTS"
        }, void 0, false, {
            fileName: "[project]/pageRegistry.tsx",
            lineNumber: 151,
            columnNumber: 17
        }, ("TURBOPACK compile-time value", void 0)),
    'S-03': ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Placeholder, {
            name: "PURCHASE ORDERS"
        }, void 0, false, {
            fileName: "[project]/pageRegistry.tsx",
            lineNumber: 152,
            columnNumber: 17
        }, ("TURBOPACK compile-time value", void 0)),
    'S-04': __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$SupplierProfilePage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    // Simulation
    'E-SIM-GUIDE': __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$SimulationGuidePage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
};
var _c;
__turbopack_context__.k.register(_c, "Placeholder");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/App.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>App
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$PricingContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/PricingContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$MockDatabaseContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/MockDatabaseContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$NavigationContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/NavigationContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/Sidebar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$LoginPage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/pages/LoginPage.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$pageRegistry$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/pageRegistry.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$CircuitryBackground$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/CircuitryBackground.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/icons.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
;
;
;
;
;
;
;
;
;
const AppContentAuthenticated = ()=>{
    _s();
    const { activePageId, setActivePageId } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$NavigationContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useNavigation"])();
    const { currentUser } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$MockDatabaseContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMockDB"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AppContentAuthenticated.useEffect": ()=>{
            const params = new URLSearchParams(window.location.search);
            const pageCode = params.get('page');
            if (pageCode && pageCode !== activePageId) {
                setActivePageId(pageCode);
            }
        }
    }["AppContentAuthenticated.useEffect"], [
        activePageId,
        setActivePageId
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AppContentAuthenticated.useEffect": ()=>{
            if (currentUser && !activePageId) {
                switch(currentUser.role){
                    case 'Employee':
                        setActivePageId('E-01');
                        break;
                    case 'Customer':
                        setActivePageId('C-01');
                        break;
                    case 'Contractor':
                        setActivePageId('CO-01');
                        break;
                    case 'Supplier':
                        setActivePageId('S-01');
                        break;
                    case 'Public':
                        setActivePageId('P-01');
                        break;
                }
            }
        }
    }["AppContentAuthenticated.useEffect"], [
        currentUser,
        setActivePageId,
        activePageId
    ]);
    const CurrentPage = __TURBOPACK__imported__module__$5b$project$5d2f$pageRegistry$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pageComponentMap"][activePageId] || (()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "p-10 text-gray-400",
            children: "Select a page from the menu."
        }, void 0, false, {
            fileName: "[project]/App.tsx",
            lineNumber: 36,
            columnNumber: 66
        }, ("TURBOPACK compile-time value", void 0)));
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex h-screen w-screen bg-black text-white overflow-hidden relative font-sans",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$CircuitryBackground$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CircuitryBackground"], {}, void 0, false, {
                fileName: "[project]/App.tsx",
                lineNumber: 40,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "fixed top-0 left-0 w-full h-12 bg-black/40 backdrop-blur-xl border-b border-gray-800 z-[100] flex items-center justify-between px-6 select-none",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RhiveLogo"], {
                                className: "h-6"
                            }, void 0, false, {
                                fileName: "[project]/App.tsx",
                                lineNumber: 44,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "h-4 w-[1px] bg-gray-700"
                            }, void 0, false, {
                                fileName: "[project]/App.tsx",
                                lineNumber: 45,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-[10px] font-black uppercase tracking-[0.3em] text-gray-400",
                                children: "Quantum Operating System 1.2.5"
                            }, void 0, false, {
                                fileName: "[project]/App.tsx",
                                lineNumber: 46,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/App.tsx",
                        lineNumber: 43,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-6",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "w-2 h-2 rounded-full bg-green-500 animate-pulse"
                                }, void 0, false, {
                                    fileName: "[project]/App.tsx",
                                    lineNumber: 50,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-[8px] font-bold text-green-500/80 uppercase tracking-widest",
                                    children: "System Link Active"
                                }, void 0, false, {
                                    fileName: "[project]/App.tsx",
                                    lineNumber: 51,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/App.tsx",
                            lineNumber: 49,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/App.tsx",
                        lineNumber: 48,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/App.tsx",
                lineNumber: 42,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative z-10 flex h-full w-full pt-12",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Sidebar"], {}, void 0, false, {
                        fileName: "[project]/App.tsx",
                        lineNumber: 57,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                        className: "flex-1 h-full overflow-hidden bg-black/20 relative border-l border-gray-800/50",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CurrentPage, {}, void 0, false, {
                            fileName: "[project]/App.tsx",
                            lineNumber: 59,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/App.tsx",
                        lineNumber: 58,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/App.tsx",
                lineNumber: 56,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/App.tsx",
        lineNumber: 39,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
_s(AppContentAuthenticated, "SguSbyFXIXS3LjeFbZso9mpU6Zs=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$NavigationContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useNavigation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$MockDatabaseContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMockDB"]
    ];
});
_c = AppContentAuthenticated;
const LoginBridge = ()=>{
    _s1();
    const { currentUser, login } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$MockDatabaseContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMockDB"])();
    if (!currentUser) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "relative h-screen w-screen bg-black text-white overflow-hidden",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$CircuitryBackground$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CircuitryBackground"], {}, void 0, false, {
                    fileName: "[project]/App.tsx",
                    lineNumber: 72,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "relative z-10 h-full",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$LoginPage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        onLogin: login
                    }, void 0, false, {
                        fileName: "[project]/App.tsx",
                        lineNumber: 74,
                        columnNumber: 21
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/App.tsx",
                    lineNumber: 73,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/App.tsx",
            lineNumber: 71,
            columnNumber: 13
        }, ("TURBOPACK compile-time value", void 0));
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AppContentAuthenticated, {}, void 0, false, {
        fileName: "[project]/App.tsx",
        lineNumber: 80,
        columnNumber: 12
    }, ("TURBOPACK compile-time value", void 0));
};
_s1(LoginBridge, "mYmdoVnymXopo6lHHCR0MNz98I0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$MockDatabaseContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMockDB"]
    ];
});
_c1 = LoginBridge;
function App() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$MockDatabaseContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MockDatabaseProvider"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$PricingContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PricingProvider"], {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$NavigationContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NavigationProvider"], {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(LoginBridge, {}, void 0, false, {
                    fileName: "[project]/App.tsx",
                    lineNumber: 88,
                    columnNumber: 21
                }, this)
            }, void 0, false, {
                fileName: "[project]/App.tsx",
                lineNumber: 87,
                columnNumber: 17
            }, this)
        }, void 0, false, {
            fileName: "[project]/App.tsx",
            lineNumber: 86,
            columnNumber: 13
        }, this)
    }, void 0, false, {
        fileName: "[project]/App.tsx",
        lineNumber: 85,
        columnNumber: 9
    }, this);
}
_c2 = App;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "AppContentAuthenticated");
__turbopack_context__.k.register(_c1, "LoginBridge");
__turbopack_context__.k.register(_c2, "App");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/App.tsx [app-client] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/App.tsx [app-client] (ecmascript)"));
}),
]);

//# sourceMappingURL=_cd557178._.js.map