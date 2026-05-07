
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
    liveTotal,
  } = calcResult;

  const { upgrades } = roofEstimate;

  const selectedShingleUpgradeCost = upgrades[surveyState.roofUpgrade as keyof typeof upgrades] || 0;
  const selectedFlatUpgradeCost = flatRoofingUpgrades[surveyState.flatRoofingType] || 0;

  const hasLineItems =
    (surveyState.asphaltRoofingEnabled && selectedShingleUpgradeCost > 0) ||
    surveyState.flatRoofingEnabled ||
    surveyState.gutters.enabled ||
    surveyState.heatTrace.enabled;

  return (
    <div className="w-full">
      <Card className="bg-gray-900/80 backdrop-blur-md border-pink-500/50">
        <CardContent className="p-4">
          <p className="text-base font-semibold text-gray-300">Live Estimate Breakdown</p>
          <div className="mt-2 text-base space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-400">Materials</span>
              <span>{formatCurrency(roofEstimate.breakdown.materials)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Labor</span>
              <span>{formatCurrency(roofEstimate.breakdown.labor)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Overhead</span>
              <span>{formatCurrency(roofEstimate.breakdown.overhead)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Profit</span>
              <span>{formatCurrency(roofEstimate.breakdown.profit)}</span>
            </div>

            {hasLineItems && (
              <div className="border-t border-gray-700/50 my-1 !mt-2 pt-1">
                {surveyState.asphaltRoofingEnabled && selectedShingleUpgradeCost > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">{surveyState.roofUpgrade}</span>
                    <span>{formatCurrency(selectedShingleUpgradeCost)}</span>
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
                    <span>{formatCurrency(selectedFlatUpgradeCost)}</span>
                  </div>
                )}
                {surveyState.flatRoofingEnabled && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Flat Roof Color ({surveyState.flatRoofingColor})</span>
                    <span>
                      {flatRoofColorAddonCost > 0
                        ? formatCurrency(flatRoofColorAddonCost)
                        : 'Included'}
                    </span>
                  </div>
                )}
                {surveyState.gutters.enabled && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">{`Gutter System (${surveyState.gutters.size})`}</span>
                    <span>{formatCurrency(gutterEstimate.total)}</span>
                  </div>
                )}
                {surveyState.heatTrace.enabled && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Heat Trace System</span>
                    <span>{formatCurrency(heatTraceEstimate.total)}</span>
                  </div>
                )}
              </div>
            )}

            <div className="border-t border-gray-700 my-2"></div>
            <div className="flex justify-between font-bold text-lg">
              <span className="text-pink-400">Total</span>
              <span className="text-pink-400">{formatCurrency(liveTotal)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
