import React from 'react';
import type { BuildingData, SurveyState, CalculationResult } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Check } from './icons';
import { SQ_FEET_PER_SQUARE, SQ_METERS_TO_SQ_FEET } from '../lib/constants';
import { ProfileCard } from './ProfileCard';
import { cn } from '../lib/utils';

interface AnalysisPanelProps {
    buildingData: BuildingData;
    surveyState: SurveyState;
    onSurveyChange: React.Dispatch<React.SetStateAction<SurveyState>>;
    streetViewUrl: string;
    calcResult: CalculationResult;
}

export const AnalysisPanel: React.FC<AnalysisPanelProps> = ({ buildingData, surveyState, onSurveyChange, streetViewUrl, calcResult }) => {
    const handleBuildingToggle = (buildingId: string) => {
        onSurveyChange(prev => {
            const isIncluded = prev.includedBuildingIds.includes(buildingId);
            const newIds = isIncluded
                ? prev.includedBuildingIds.filter(id => id !== buildingId)
                : [...prev.includedBuildingIds, buildingId];

            return { ...prev, includedBuildingIds: newIds };
        });
    };

    return (
        <Card className="bg-gray-900/50 border border-pink-500/50">
            <CardHeader>
                <CardTitle>AI-Generated Roof Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2 h-48 rounded-lg overflow-hidden border border-gray-700">
                    <img src={streetViewUrl} alt="Street view of property" className="object-cover w-full h-full" />
                    {/* Placeholder for map */}
                    <div className="bg-gray-800 flex items-center justify-center text-gray-500">
                        Map View
                    </div>
                </div>
                <div>
                    <label className="text-sm font-medium text-gray-400">Select buildings to include in estimate:</label>
                    <div className="mt-2 space-y-2">
                        {buildingData.buildings.map(building => {
                            const isSelected = surveyState.includedBuildingIds.includes(building.id);
                            return (
                                <div
                                    key={building.id}
                                    onClick={() => handleBuildingToggle(building.id)}
                                    role="button"
                                    aria-pressed={isSelected}
                                    tabIndex={0}
                                    onKeyDown={(e) => (e.key === ' ' || e.key === 'Enter') && handleBuildingToggle(building.id)}
                                    className={cn(
                                        "flex items-center justify-between p-3 rounded-md bg-gray-800/50 border cursor-pointer transition-all",
                                        isSelected ? "border-pink-500/70" : "border-gray-700 hover:bg-gray-800"
                                    )}
                                >
                                    <span className="capitalize">{building.id.replace(/_/g, ' ')}</span>
                                    <span className="font-mono text-pink-400">{(building.totalAreaMeters * SQ_METERS_TO_SQ_FEET / SQ_FEET_PER_SQUARE).toFixed(2)} SQ</span>
                                </div>
                            )
                        })}
                    </div>
                </div>
                <ProfileCard calcResult={calcResult} buildingData={buildingData} />
            </CardContent>
        </Card>
    );
}