
import React from 'react';
import type { CalculationResult, SurveyState } from '../types';
import { Card, CardContent } from './ui/card';
import { formatCurrency } from '../lib/utils';

interface LiveEstimateBreakdownProps {
  calcResult: CalculationResult;
  surveyState: SurveyState;
}

export const LiveEstimateBreakdown: React.FC<LiveEstimateBreakdownProps> = ({ calcResult, surveyState }) => {
  const {
    roofEstimate,
    gutterEstimate,
    heatTraceEstimate,
    flatRoofingUpgrades,
    flatRoofColorAddonCost,
  } = calcResult;

  const { upgrades } = roofEstimate;

  const selectedShingleUpgradeCost = upgrades[surveyState.roofUpgrade as keyof typeof upgrades] || 0;
  const selectedFlatUpgradeCost = flatRoofingUpgrades[surveyState.flatRoofingType] || 0;

  const hasLineItems =
    (surveyState.asphaltRoofingEnabled && selectedShingleUpgradeCost > 0) ||
    surveyState.flatRoofingEnabled ||
    surveyState.gutters.enabled ||
    surveyState.heatTrace.enabled;

  // Sum pre-rounded line items to eliminate visual rounding discrepancy in the UI
  const displayMaterials = Math.round(roofEstimate.breakdown.materials);
  const displayLabor = Math.round(roofEstimate.breakdown.labor);
  const displayOverhead = Math.round(roofEstimate.breakdown.overhead);
  const displayProfit = Math.round(roofEstimate.breakdown.profit);

  const displayShingleUpgrade = surveyState.asphaltRoofingEnabled && selectedShingleUpgradeCost > 0
    ? Math.round(selectedShingleUpgradeCost)
    : 0;
  const displayFlatUpgrade = surveyState.flatRoofingEnabled && selectedFlatUpgradeCost > 0
    ? Math.round(selectedFlatUpgradeCost)
    : 0;
  const displayFlatColorAddon = surveyState.flatRoofingEnabled && flatRoofColorAddonCost > 0
    ? Math.round(flatRoofColorAddonCost)
    : 0;
  const displayGutter = surveyState.gutters.enabled
    ? Math.round(gutterEstimate.total)
    : 0;
  const displayHeatTrace = surveyState.heatTrace.enabled
    ? Math.round(heatTraceEstimate.total)
    : 0;

  const displayTotal = displayMaterials + displayLabor + displayOverhead + displayProfit +
    displayShingleUpgrade + displayFlatUpgrade + displayFlatColorAddon + displayGutter + displayHeatTrace;

  return (
    <div className="w-full">
      <Card className="bg-gray-900/80 backdrop-blur-md border-pink-500/50">
        <CardContent className="p-4">
          <p className="text-base font-semibold text-gray-300">Live Estimate Breakdown</p>
          <div className="mt-2 text-base space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-400">Materials</span>
              <span>{formatCurrency(displayMaterials)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Labor</span>
              <span>{formatCurrency(displayLabor)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Overhead</span>
              <span>{formatCurrency(displayOverhead)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Profit</span>
              <span>{formatCurrency(displayProfit)}</span>
            </div>

            {hasLineItems && (
              <div className="border-t border-gray-700/50 my-1 !mt-2 pt-1">
                {surveyState.asphaltRoofingEnabled && selectedShingleUpgradeCost > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">{surveyState.roofUpgrade}</span>
                    <span>{formatCurrency(displayShingleUpgrade)}</span>
                  </div>
                )}
                 {surveyState.asphaltRoofingEnabled && (
                    <div className="flex justify-between">
                        <span className="text-gray-400">Asphalt Color ({surveyState.shingleColor})</span>
                        <span>Included</span>
                    </div>
                 )}
                {surveyState.flatRoofingEnabled && selectedFlatUpgradeCost > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">{surveyState.flatRoofingType}</span>
                    <span>{formatCurrency(displayFlatUpgrade)}</span>
                  </div>
                )}
                {surveyState.flatRoofingEnabled && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Flat Roof Color ({surveyState.flatRoofingColor})</span>
                    <span>
                      {displayFlatColorAddon > 0
                        ? formatCurrency(displayFlatColorAddon)
                        : 'Included'}
                    </span>
                  </div>
                )}
                {surveyState.gutters.enabled && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">{`Gutter System (${surveyState.gutters.size})`}</span>
                    <span>{formatCurrency(displayGutter)}</span>
                  </div>
                )}
                {surveyState.heatTrace.enabled && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Heat Trace System</span>
                    <span>{formatCurrency(displayHeatTrace)}</span>
                  </div>
                )}
              </div>
            )}

            <div className="border-t border-gray-700 my-2"></div>
            <div className="flex justify-between font-bold text-lg">
              <span className="text-pink-400">Total</span>
              <span className="text-pink-400">{formatCurrency(displayTotal)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
