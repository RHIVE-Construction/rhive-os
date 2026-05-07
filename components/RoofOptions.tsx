import React, { useState } from 'react';
import type { BuildingData, SurveyState, RoofLayers } from '../types';
import { CircuitryBackground } from './CircuitryBackground';
import { Button } from './ui/button';
import { RhiveLogo, RoofIcon, Info, Check } from './icons';
import { SQ_FEET_PER_SQUARE, SQ_METERS_TO_SQ_FEET } from '../lib/constants';
import { cn } from '../lib/utils';
import { Modal } from './ui/modal';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from './ui/tooltip';


interface RoofOptionsProps {
    buildingData: BuildingData;
    surveyState: SurveyState;
    onSurveyChange: React.Dispatch<React.SetStateAction<SurveyState>>;
    onContinue: () => void;
    onStartOver: () => void;
}

const roofFeatures: (keyof SurveyState['roofFeatures'])[] = ['chimneys', 'swampCoolers', 'skylights'];

const featureTooltips: Record<keyof SurveyState['roofFeatures'], {
    description: string;
    images: string[];
}> = {
    chimneys: {
        description: "Count each distinct chimney structure. If multiple flues are in one brick structure, count it as one.",
        images: [
            'https://static.wixstatic.com/media/c5862a_d75be5953bca4006909b7880e93d2c57~mv2.jpg',
            'https://static.wixstatic.com/media/c5862a_a1911f83394d49809c8ab16c6c76b29f~mv2.jpg'
        ]
    },
    swampCoolers: {
        description: "Count each evaporative 'swamp cooler' unit that is mounted on the roof surface.",
        images: [
            'https://static.wixstatic.com/media/c5862a_81cdac2af41d4fefa145a452798d3055~mv2.jpg',
            'https://static.wixstatic.com/media/c5862a_9f23086322fc4176ba1d6a0b2ada8383~mv2.jpg'
        ]
    },
    skylights: {
        description: "Count all types of roof windows, including traditional skylights and modern sun tunnels.",
        images: [
            'https://static.wixstatic.com/media/c5862a_ead70a96d001457cad11c0761f284109~mv2.jpg',
            'https://static.wixstatic.com/media/c5862a_2f38e96e0da844148fe6864b5259a848~mv2.jpg'
        ]
    }
};


const QuantitySelector: React.FC<{ value: number; onChange: (newValue: number) => void }> = ({ value, onChange }) => {
    const options = [0, 1, 2, 3, 4];
    return (
        <div className="flex items-center space-x-1 bg-[#1a1a1a] border border-gray-700 rounded-md p-1 w-max">
            {options.map(opt => (
                <button
                    key={opt}
                    onClick={() => onChange(opt)}
                    className={cn(
                        "w-10 h-8 rounded-md text-sm font-medium transition-colors duration-200",
                        value === opt ? 'bg-[#ec028b] text-white' : 'text-gray-300 hover:bg-gray-600'
                    )}
                >
                    {opt}{opt === 4 ? '+' : ''}
                </button>
            ))}
        </div>
    );
};

const LayerSelector: React.FC<{ value: RoofLayers; onChange: (newValue: RoofLayers) => void }> = ({ value, onChange }) => {
    const options: RoofLayers[] = ['1', '2', '3', '4', 'IDK', 'Other'];
    return (
        <div className="flex flex-wrap items-center gap-1 bg-[#1a1a1a] border border-gray-700 rounded-md p-1 w-full md:w-max">
            {options.map(opt => (
                <button
                    key={opt}
                    onClick={() => onChange(opt)}
                    className={cn(
                        "px-4 h-8 rounded-md text-sm font-medium transition-colors duration-200 flex-grow",
                        value === opt ? 'bg-[#ec028b] text-white' : 'text-gray-300 hover:bg-gray-600'
                    )}
                >
                    {opt}
                </button>
            ))}
        </div>
    );
};


export const RoofOptions: React.FC<RoofOptionsProps> = ({
    buildingData,
    surveyState,
    onSurveyChange,
    onContinue,
    onStartOver
}) => {
    const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

    const handleBuildingToggle = (buildingId: string) => {
        onSurveyChange(prev => {
            const isIncluded = prev.includedBuildingIds.includes(buildingId);
            const newIds = isIncluded
                ? prev.includedBuildingIds.filter(id => id !== buildingId)
                : [...prev.includedBuildingIds, buildingId];
            return { ...prev, includedBuildingIds: newIds };
        });
    };

    const handleLayerChange = (value: RoofLayers) => {
        onSurveyChange(prev => ({ ...prev, roofLayers: value }));
    };

    const handleFeatureChange = (feature: keyof SurveyState['roofFeatures'], value: number) => {
        onSurveyChange(prev => ({
            ...prev,
            roofFeatures: { ...prev.roofFeatures, [feature]: Math.max(0, value) }
        }));
    };

    return (
        <TooltipProvider>
            <div className="relative h-screen w-screen flex flex-col bg-black">
                <CircuitryBackground />
                <header className="relative z-10 w-full bg-black/50 backdrop-blur-sm border-b border-gray-800">
                    <div className="container mx-auto px-4 h-16 flex justify-between items-center">
                        <RhiveLogo className="h-7" />
                        <Button variant="ghost" onClick={onStartOver}>Start New Estimate</Button>
                    </div>
                </header>
                <main className="relative z-10 flex-grow overflow-y-auto p-4 md:p-8 flex justify-center">
                    <div className="w-full max-w-xl text-white">
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-lg font-medium text-gray-300 mb-3">Select buildings to include in estimate:</h2>
                                <div className="flex flex-wrap gap-4">
                                    {buildingData.buildings.map(building => {
                                        const sqValue = (building.totalAreaMeters * SQ_METERS_TO_SQ_FEET / SQ_FEET_PER_SQUARE).toFixed(2);
                                        const areaSqFt = (building.totalAreaMeters * SQ_METERS_TO_SQ_FEET).toFixed(0);
                                        const isSelected = surveyState.includedBuildingIds.includes(building.id);
                                        return (
                                            <Tooltip key={building.id}>
                                                <TooltipTrigger asChild>
                                                    <div
                                                        onClick={() => handleBuildingToggle(building.id)}
                                                        role="button"
                                                        aria-pressed={isSelected}
                                                        tabIndex={0}
                                                        onKeyDown={(e) => (e.key === ' ' || e.key === 'Enter') && handleBuildingToggle(building.id)}
                                                        className={cn(
                                                            "flex items-center justify-between p-3 rounded-xl bg-black/50 border cursor-pointer transition-all focus:outline-none min-w-[180px]",
                                                            isSelected
                                                                ? 'border-pink-500/70 bg-pink-900/20'
                                                                : 'border-gray-700 hover:bg-gray-500/10'
                                                        )}
                                                    >
                                                        <span className="capitalize font-medium text-white whitespace-nowrap">{building.id.replace(/_/g, ' ')}</span>
                                                        <span className="font-mono whitespace-nowrap">
                                                            <span className="text-white">{sqValue}</span>
                                                            <span className="text-white/70 ml-1">SQ</span>
                                                        </span>
                                                    </div>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p className="font-semibold">1 SQ (roofing square) = 100 sq ft.</p>
                                                    <p>This building is approx. {areaSqFt} sq ft.</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        )
                                    })}
                                </div>
                            </div>

                            <div className="p-6 rounded-lg bg-black/50 border border-gray-800">
                                <div className="flex items-center text-2xl font-bold mb-6">
                                    <div className="p-2 bg-pink-500/20 rounded-md mr-4">
                                        <RoofIcon className="h-6 w-6 text-pink-400" />
                                    </div>
                                    Roof Options
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <label className="font-medium text-gray-300 flex items-center">
                                            How many layers are on your project?*
                                            <button onClick={() => setIsVideoModalOpen(true)} className="ml-2 text-gray-500 hover:text-pink-400" aria-label="More info on roof layers">
                                                <Info className="h-4 w-4" />
                                            </button>
                                        </label>
                                        <div className="mt-3">
                                            <LayerSelector value={surveyState.roofLayers} onChange={handleLayerChange} />
                                        </div>
                                    </div>

                                    <div className="border-t border-gray-800 pt-6">
                                        <div className="flex justify-between items-end mb-3">
                                            <label className="font-medium text-gray-300">Indicate the quantity of each feature:</label>
                                        </div>
                                        <div className="space-y-3">
                                            {roofFeatures.map(feature => (
                                                <div key={feature} className="flex items-center justify-between">
                                                    <div className="flex items-center">
                                                        <span className="capitalize text-gray-300">{feature.replace(/([A-Z])/g, ' $1')}</span>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <span className="ml-2 text-gray-500 cursor-help"><Info className="h-4 w-4" /></span>
                                                            </TooltipTrigger>
                                                            <TooltipContent className="p-2 max-w-sm">
                                                                <div className="grid grid-cols-2 gap-2 mb-2">
                                                                    {featureTooltips[feature].images.map((img, index) => (
                                                                        <img key={index} src={img} alt={`${feature} example ${index + 1}`} className="rounded-md object-cover aspect-[4/3]" />
                                                                    ))}
                                                                </div>
                                                                <p className="text-xs">{featureTooltips[feature].description}</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </div>
                                                    <QuantitySelector
                                                        value={surveyState.roofFeatures[feature]}
                                                        onChange={(value) => handleFeatureChange(feature, value)}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 text-center">
                            <Button size="lg" onClick={onContinue}>
                                Continue
                            </Button>
                        </div>
                    </div>
                </main>
                <Modal open={isVideoModalOpen} onClose={() => setIsVideoModalOpen(false)} title="Understanding Roof Layers">
                    <div className="space-y-4">
                        <div className="aspect-video w-full rounded-md overflow-hidden border border-gray-700">
                            <iframe
                                className="w-full h-full"
                                src="https://imgur.com/a/5OqFk2G/embed?pub=true"
                                frameBorder="0"
                                allowFullScreen
                                title="Understanding Roof Layers">
                            </iframe>
                        </div>
                        <p className="text-sm text-gray-300">
                            The number of existing shingle layers significantly impacts the project's cost. Each additional layer requires more labor to remove and increases the weight, leading to higher disposal (dump) fees. In the upcoming video, we'll show you how to quickly spot signs of multiple layers from the ground.
                        </p>
                    </div>
                </Modal>
            </div>
        </TooltipProvider>
    );
};