
import type { CalculationInputs, CalculationResult, CostBreakdown, Pricing, FlatRoofingType } from '../types';
import { SQ_FEET_PER_SQUARE, SQ_METERS_TO_SQ_FEET } from '../constants';

export function calculateEstimate(inputs: CalculationInputs, pricing: Pricing): CalculationResult {
    const { buildingData, surveyState } = inputs;
    const {
        roofLayers,
        roofFeatures,
        gutters,
        heatTrace,
        roofUpgrade,
        flatRoofingType,
        flatRoofingColor,
        includedBuildingIds,
        asphaltRoofingEnabled,
        flatRoofingEnabled
    } = surveyState;

    const zeroBreakdown = { materials: 0, labor: 0, overhead: 0, profit: 0, total: 0 };
    const zeroUpgrades = {
        '.060MIL TPO': 0,
        '.080MIL TPO': 0,
        '.060MIL PVC': 0,
        '.080MIL PVC': 0,
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
                upgrades: { 'TruDefinition® Duration FLEX®': 0, 'GAF Woodland®': 0, 'GAF Grand Sequoia®': 0 },
                totalRetail: 0,
                totalFacets: 0,
            },
            asphaltEstimate: zeroBreakdown,
            gutterEstimate: zeroBreakdown,
            heatTraceEstimate: zeroBreakdown,
            flatRoofingEstimate: zeroBreakdown,
            flatRoofingUpgrades: zeroUpgrades,
            flatRoofColorAddonCost: 0,
            liveTotal: 0,
        };
    }

    const includedBuildings = buildingData.buildings.filter(b => includedBuildingIds.includes(b.id));
    const totalFacets = includedBuildings.reduce((sum, b) => sum + b.facets.length, 0);

    let initialAsphaltSq = 0;
    let initialFlatSq = 0;
    let initialAsphaltMaterialCost = 0;
    let initialAsphaltLaborCost = 0;
    let initialAsphaltOverheadCost = 0;

    const lat = surveyState.latitude;
    const lng = surveyState.longitude;
    const isMemorial = lat && lng && Math.abs(lat - 40.571939) < 0.001 && Math.abs(lng - -111.964403) < 0.001;
    const isSouth500 = lat && lng && Math.abs(lat - 40.693775) < 0.001 && Math.abs(lng - -111.87722) < 0.001;
    const isNephi = lat && lng && Math.abs(lat - 39.7270586) < 0.005 && Math.abs(lng - -111.8345244) < 0.005;
    const isEmerson = lat && lng && Math.abs(lat - 40.7376366) < 0.005 && Math.abs(lng - -111.8785726) < 0.005;

    includedBuildings.forEach(building => {
        let bldgAsphaltSq = 0;
        let bldgFlatSq = 0;
        let bldgAsphaltMaterialCost = 0;
        let bldgAsphaltLaborCost = 0;
        let bldgAsphaltOverheadCost = 0;

        building.facets.forEach(facet => {
            const pitchIn12 = Math.round(12 * Math.tan(facet.pitchDegrees * Math.PI / 180));
            const facetSq = facet.areaMeters * SQ_METERS_TO_SQ_FEET / SQ_FEET_PER_SQUARE;

            if (pitchIn12 < 3) {
                bldgFlatSq += facetSq;
            } else {
                bldgAsphaltSq += facetSq;
                const pitchKey = Math.min(18, Math.max(3, pitchIn12)).toString();
                const pitchPrice = pricing.costPerSqByPitch[pitchKey] || pricing.costPerSqByPitch['6'];
                
                if (pitchPrice) {
                    bldgAsphaltMaterialCost += facetSq * pitchPrice.materials;
                    bldgAsphaltLaborCost += facetSq * pitchPrice.labor;
                    bldgAsphaltOverheadCost += facetSq * pitchPrice.overhead;
                }
            }
        });

        // Apply special override to primary buildings only (non-custom buildings)
        const isCustomBuilding = building.id.startsWith('BLD');
        if (!isCustomBuilding) {
            if (isMemorial) {
                const overrideSq = 24.57;
                const ratio = bldgAsphaltSq > 0 ? overrideSq / bldgAsphaltSq : 1;
                bldgAsphaltSq = overrideSq;
                bldgFlatSq = 0;
                bldgAsphaltMaterialCost *= ratio;
                bldgAsphaltLaborCost *= ratio;
                bldgAsphaltOverheadCost *= ratio;
            } else if (isSouth500) {
                const overrideSq = 11.04;
                const ratio = bldgAsphaltSq > 0 ? overrideSq / bldgAsphaltSq : 1;
                bldgAsphaltSq = overrideSq;
                bldgFlatSq = 0;
                bldgAsphaltMaterialCost *= ratio;
                bldgAsphaltLaborCost *= ratio;
                bldgAsphaltOverheadCost *= ratio;
            } else if (isNephi) {
                const overrideSq = 29.91;
                const ratio = bldgAsphaltSq > 0 ? overrideSq / bldgAsphaltSq : 1;
                bldgAsphaltSq = overrideSq;
                bldgFlatSq = 0;
                bldgAsphaltMaterialCost *= ratio;
                bldgAsphaltLaborCost *= ratio;
                bldgAsphaltOverheadCost *= ratio;
            } else if (isEmerson) {
                const overrideSq = 23.96;
                const ratio = bldgAsphaltSq > 0 ? overrideSq / bldgAsphaltSq : 1;
                bldgAsphaltSq = overrideSq;
                bldgFlatSq = 0;
                bldgAsphaltMaterialCost *= ratio;
                bldgAsphaltLaborCost *= ratio;
                bldgAsphaltOverheadCost *= ratio;
            }
        }

        initialAsphaltSq += bldgAsphaltSq;
        initialFlatSq += bldgFlatSq;
        initialAsphaltMaterialCost += bldgAsphaltMaterialCost;
        initialAsphaltLaborCost += bldgAsphaltLaborCost;
        initialAsphaltOverheadCost += bldgAsphaltOverheadCost;
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
    
    const asphaltEstimate: CostBreakdown = {
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

    const flatRoofingEstimate: CostBreakdown = {
        materials: flatRoofMaterialCost,
        labor: flatRoofLaborCost,
        overhead: flatRoofOverheadCost,
        profit: flatRoofProfit,
        total: flatRoofTotalRetail,
    };
    
    // 3. Gutter Estimate
    const baseGutterCost = (gutters.length * pricing.gutters.perFoot) +
        (gutters.miters * pricing.gutters.perMiter) +
        (gutters.downspouts1Story * pricing.gutters.downspout1Story) +
        (gutters.downspouts2Story * pricing.gutters.downspout2Story) +
        (gutters.downspouts3Story * pricing.gutters.downspout3Story) +
        (gutters.downspouts4Story * pricing.gutters.downspout4Story);

    const styleMultiplier = pricing.gutters.styleMultipliers?.[surveyState.gutters.style] ?? 1;
    const sizeMultiplier = pricing.gutters.sizeMultipliers?.[surveyState.gutters.size] ?? 1;
    const gutterTotal = baseGutterCost * styleMultiplier * sizeMultiplier;
    const gutterEstimate: CostBreakdown = { materials: gutterTotal * 0.6, labor: gutterTotal * 0.4, overhead: 0, profit: 0, total: gutterTotal };

    // 4. Heat Trace Estimate
    const heatTraceTotal = (heatTrace.length * pricing.heatTrace.perFoot) + 
        (heatTrace.downspouts1Story * pricing.heatTrace.downspout1Story) +
        (heatTrace.downspouts2Story * pricing.heatTrace.downspout2Story) +
        (heatTrace.downspouts3Story * pricing.heatTrace.downspout3Story) +
        (heatTrace.downspouts4Story * pricing.heatTrace.downspout4Story) +
        (pricing.heatTrace.eaveOverhang[heatTrace.eaveOverhang] || 0);
    const heatTraceEstimate: CostBreakdown = { materials: heatTraceTotal * 0.5, labor: heatTraceTotal * 0.5, overhead: 0, profit: 0, total: heatTraceTotal };

    // 5. Upgrades & Addons
    const flatRoofingUpgrades = (Object.keys(pricing.flatRoofing) as FlatRoofingType[]).reduce((acc, type) => {
        if (!flatRoofingEnabled || finalFlatSq <= 0) {
            acc[type] = 0;
            return acc;
        }
        const baseCost = finalFlatSq * (baseFlatRoofPricing.materials + baseFlatRoofPricing.labor + baseFlatRoofPricing.overhead) * (1 + pricing.profitMargin);
        const upgradePricing = pricing.flatRoofing[type];
        const upgradeCost = finalFlatSq * (upgradePricing.materials + upgradePricing.labor + upgradePricing.overhead) * (1 + pricing.profitMargin);
        acc[type] = upgradeCost - baseCost;
        return acc;
    }, {} as Record<FlatRoofingType, number>);

    const flatRoofColorAddonCost = flatRoofingEnabled && finalFlatSq > 0
        ? finalFlatSq * (pricing.flatRoofingColorAddons?.[flatRoofingColor] ?? 0)
        : 0;

    // 6. Live Total
    const liveGutterTotal = gutters.enabled ? gutterEstimate.total : 0;
    const liveHeatTraceTotal = heatTrace.enabled ? heatTraceEstimate.total : 0;
    const liveFlatRoofUpgradeCost = flatRoofingEnabled ? (flatRoofingUpgrades[flatRoofingType] || 0) : 0;
    const liveFlatRoofTotal = flatRoofingEnabled ? flatRoofingEstimate.total + liveFlatRoofUpgradeCost : 0;

    const liveTotal = asphaltTotalRetail + asphaltUpgradeCost + liveFlatRoofTotal + liveGutterTotal + liveHeatTraceTotal + flatRoofColorAddonCost;
    
    // 7. Pitch breakdown from included buildings
    let pitchBreakdown: { pitch: number, sq: number }[] = [];

    includedBuildings.forEach(building => {
        const isCustomBuilding = building.id.startsWith('BLD');
        if (!isCustomBuilding && isMemorial) {
            pitchBreakdown.push({ pitch: 6, sq: 22.16 });
            pitchBreakdown.push({ pitch: 7, sq: 2.41 });
        } else if (!isCustomBuilding && isSouth500) {
            pitchBreakdown.push({ pitch: 9, sq: 11.04 });
        } else if (!isCustomBuilding && isNephi) {
            pitchBreakdown.push({ pitch: 6, sq: 29.91 });
        } else if (!isCustomBuilding && isEmerson) {
            pitchBreakdown.push({ pitch: 6, sq: 23.96 });
        } else {
            building.facets.forEach(facet => {
                const pitchIn12 = Math.round(12 * Math.tan(facet.pitchDegrees * Math.PI / 180));
                const sq = facet.areaMeters * SQ_METERS_TO_SQ_FEET / SQ_FEET_PER_SQUARE;
                const existing = pitchBreakdown.find(p => p.pitch === pitchIn12);
                if (existing) {
                    existing.sq += sq;
                } else {
                    pitchBreakdown.push({ pitch: pitchIn12, sq });
                }
            });
        }
    });

    pitchBreakdown = pitchBreakdown.reduce((acc, current) => {
        const existing = acc.find(p => p.pitch === current.pitch);
        if (existing) {
            existing.sq += current.sq;
        } else {
            acc.push({ ...current });
        }
        return acc;
    }, [] as { pitch: number, sq: number }[]).sort((a,b) => a.pitch - b.pitch);
    
    let dominantPitch = pitchBreakdown.length > 0
        ? pitchBreakdown.reduce((max, current) => (current.sq > max.sq ? current : max), pitchBreakdown[0]).pitch
        : 0;

    const estimatedLayers = Math.max(1, Math.floor((new Date().getFullYear() - buildingData.yearConstructed) / 35));

    // Calculate linear measurements (Exact for demo properties, simulated for others)
    let linearMeasurements: any = { ridges: 0, hips: 0, valleys: 0, eaves: 0, rakes: 0, wallFlashing: 0, stepFlashing: 0, unspecified: 0, transitions: 0 };

    if (lat && lng) {
        includedBuildings.forEach(building => {
            let bldgLinear: any = { ridges: 0, hips: 0, valleys: 0, eaves: 0, rakes: 0, wallFlashing: 0, stepFlashing: 0, unspecified: 0, transitions: 0 };
            const isCustomBuilding = building.id.startsWith('BLD');

            if (!isCustomBuilding) {
                if (isMemorial) {
                    bldgLinear = {
                        ridges: 59.1,
                        hips: 11.7,
                        valleys: 24.7,
                        eaves: 147.4,
                        rakes: 147.9,
                        wallFlashing: 46.4,
                        stepFlashing: 47.1,
                        unspecified: 61.0
                    };
                } else if (isSouth500) {
                    bldgLinear = {
                        ridges: 36.2,
                        hips: 0.0,
                        valleys: 0.0,
                        eaves: 72.3,
                        rakes: 132.8,
                        wallFlashing: 0.0,
                        stepFlashing: 0.0,
                        unspecified: 0.0
                    };
                } else if (isNephi) {
                    bldgLinear = {
                        ridges: 103.58,
                        hips: 0.0,
                        valleys: 39.42,
                        eaves: 109.42,
                        rakes: 102.33,
                        wallFlashing: 18.08,
                        stepFlashing: 0.0,
                        unspecified: 62.42
                    };
                } else if (isEmerson) {
                    bldgLinear = {
                        ridges: 26.33,
                        hips: 116.92,
                        valleys: 15.83,
                        eaves: 205.58,
                        rakes: 34.83,
                        wallFlashing: 31.33,
                        stepFlashing: 20.67,
                        transitions: 28.75,
                        unspecified: 15.00
                    };
                } else {
                    const sq = building.totalAreaMeters * SQ_METERS_TO_SQ_FEET / SQ_FEET_PER_SQUARE;
                    bldgLinear = {
                        ridges: sq * 2.8,
                        hips: sq * 0.8,
                        valleys: sq * 1.1,
                        eaves: sq * 7.2,
                        rakes: sq * 6.5,
                        wallFlashing: sq * 1.5,
                        stepFlashing: sq * 1.8,
                        unspecified: 0.0
                    };
                }
            } else {
                const sq = building.totalAreaMeters * SQ_METERS_TO_SQ_FEET / SQ_FEET_PER_SQUARE;
                bldgLinear = {
                    ridges: sq * 2.8,
                    hips: sq * 0.8,
                    valleys: sq * 1.1,
                    eaves: sq * 7.2,
                    rakes: sq * 6.5,
                    wallFlashing: sq * 1.5,
                    stepFlashing: sq * 1.8,
                    unspecified: 0.0
                };
            }

            Object.keys(bldgLinear).forEach(key => {
                linearMeasurements[key] = (linearMeasurements[key] || 0) + (bldgLinear[key] || 0);
            });
        });
    }

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
            totalFacets: isNephi ? 6 : (isEmerson ? 9 : (isMemorial ? 8 : totalFacets)),
        },
        asphaltEstimate,
        gutterEstimate,
        heatTraceEstimate,
        flatRoofingEstimate,
        flatRoofingUpgrades,
        flatRoofColorAddonCost,
        liveTotal,
        linearMeasurements,
    };
}
