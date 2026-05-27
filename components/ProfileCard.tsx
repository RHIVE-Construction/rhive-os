import React from 'react';
import type { CalculationResult, BuildingData } from '../types';

interface ProfileCardProps {
    calcResult: CalculationResult;
    buildingData: BuildingData;
}

const Metric: React.FC<{ label: string; value: string | number; subValue?: string | number; unit?: string; children?: React.ReactNode }> = ({ label, value, subValue, unit, children }) => (
    <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 flex-1">
        <div className="text-base text-gray-400">{label}</div>
        <div className="flex items-baseline mt-1">
            <span className="text-3xl font-bold text-white">{value}</span>
            {unit && <span className="text-lg text-gray-300 ml-1">{unit}</span>}
             {subValue && <span className="text-base text-gray-400 ml-2">{subValue}</span>}
        </div>
        {children}
    </div>
);


export const ProfileCard: React.FC<ProfileCardProps> = ({ calcResult, buildingData }) => {
    const { finalSq, pitchBreakdown, roofEstimate, estimatedLayers } = calcResult;
    const { totalFacets } = roofEstimate;

    return (
        <div className="space-y-4">
             <div className="flex gap-4">
                <Metric label="Total Roof Squares" value={finalSq.toFixed(2)} unit="SQ" />
                <Metric label="Year Constructed" value={buildingData.yearConstructed} subValue={`Est. Layers: ${estimatedLayers}`} />
             </div>
             <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                <div className="text-base text-gray-400">Pitch & Facet Breakdown</div>
                <div className="flex items-baseline mt-1">
                    <span className="text-3xl font-bold text-white">{totalFacets}</span>
                    <span className="text-lg text-gray-300 ml-2">Facets</span>
                </div>
                <div className="mt-2 space-y-1 text-base border-t border-gray-700 pt-2">
                    {pitchBreakdown.map(({ pitch, sq }) => (
                        <div key={pitch} className="flex justify-between">
                            <span className="text-gray-300">{pitch}/12 Pitch</span>
                            <span className="font-mono text-gray-300">{sq.toFixed(2)} SQ</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}