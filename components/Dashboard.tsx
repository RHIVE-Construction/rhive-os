import React, { useMemo, useState, useEffect } from 'react';
import type { Place, BuildingData, SurveyState, CalculationResult, RoofUpgrade, FlatRoofingType, GutterStyle, GutterSize, EaveOverhang, FlatRoofingColor } from '../types';
import { usePricing } from '../contexts/PricingContext';
import { calculateEstimate } from '../lib/calculations';
import { RhiveLogo, SnowflakeIcon, Squares2x2Icon, Calendar, RulerIcon, Check, ShareIcon } from './icons';
import { Button } from './ui/button';
import { CircuitryBackground } from './CircuitryBackground';
import { WeatherReport } from './WeatherReport';
import { Card } from './ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Input } from './ui/input';
import { cn } from '../lib/utils';
import { LiveEstimateBreakdown } from './LiveEstimateBreakdown';
import { formatCurrency } from '../lib/utils';
import { Modal } from './ui/modal';
import { EstimateReport } from './EstimateReport';
import { ErrorBoundary } from './ErrorBoundary';

interface DashboardProps {
  place: Place;
  buildingData: BuildingData;
  surveyState: SurveyState;
  onSurveyChange: React.Dispatch<React.SetStateAction<SurveyState>>;
  onStartNew: () => void;
  streetViewUrl: string;
}

const shinglesData: Record<RoofUpgrade, { description: string; colors: {name: string, image: string}[]; video: string }> = {
  'TruDefinition® Duration®': {
    description: "Bold Style. Built to Last. Duration® Shingles don't just top your home—they transform it.",
    colors: [{ name: 'Onyx Black', image: '' }, { name: 'Driftwood', image: '' }],
    video: ''
  },
  'TruDefinition® Duration FLEX®': {
    description: "Shield Your Home with the Power of FLEX.",
    colors: [{ name: 'Black Sable', image: '' }],
    video: ''
  },
  'GAF Woodland®': {
    description: "Woodland® — Timeless Beauty, Modern Strength.",
    colors: [{ name: 'Castlewood Gray', image: '' }],
    video: ''
  },
  'GAF Grand Sequoia®': {
    description: "Grand Sequoia® — Nature-Inspired. Boldly Built.",
    colors: [{ name: 'Autumn Brown', image: '' }],
    video: ''
  }
};

const flatRoofingData: Record<FlatRoofingType, { description: string; image: string; video: string; }> = {
  '.060MIL TPO': { description: "Cost-effective single-ply roofing.", image: '', video: '' },
  '.080MIL TPO': { description: "Thicker, robust TPO.", image: '', video: '' },
  '.060MIL PVC': { description: "Premium flexibility.", image: '', video: '' },
  '.080MIL PVC': { description: "Ultimate flat roof choice.", image: '', video: '' },
};

const gutterStyleData: Record<GutterStyle, { description: string; type: string; }> = {
    'K-Style': { description: 'Classic decorative appearance.', type: 'Residential' },
    'Box/Square': { description: 'Bold lines, high capacity.', type: 'Commercial' },
    'Half Round': { description: 'Timeless drainage style.', type: 'Premium' },
}

const gutterSizeData: Record<GutterSize, { description: string }> = {
    '5"': { description: 'Standard residential size.' },
    '6"': { description: 'High capacity for heavy rain.' },
}

const HoverVideoCard: React.FC<{
  selected: boolean;
  onClick: () => void;
  title: string;
  description: string;
  priceText: string;
}> = ({ selected, onClick, title, description, priceText }) => (
    <div onClick={onClick} className={cn(
        "relative border rounded-lg p-2 cursor-pointer transition-all duration-200 group h-full flex flex-col",
        selected ? "bg-pink-900/30 border-pink-500/70" : "border-gray-700 bg-gray-900/50 hover:border-pink-500/70"
    )}>
        <div className="h-20 bg-gray-800 rounded mb-2"></div>
        <div className="flex items-start justify-between flex-grow">
            <h3 className="font-semibold text-white text-base leading-tight">{title}</h3>
        </div>
        <p className="text-base text-gray-400 mt-1">{description}</p>
        {priceText && <p className={cn("text-base font-bold mt-auto pt-1", priceText === 'Included' ? 'text-gray-300' : 'text-pink-400')}>{priceText}</p>}
    </div>
);

const SelectableCard: React.FC<{
  selected: boolean;
  onClick: () => void;
  title: string;
  children: React.ReactNode;
  badge?: string;
  price?: number;
}> = ({ selected, onClick, title, children, badge, price }) => (
    <div onClick={onClick} className={cn(
        "relative border rounded-lg p-3 cursor-pointer transition-all duration-200 h-full flex flex-col",
        selected ? "bg-pink-900/30 border-pink-500/70" : "border-gray-700 bg-gray-900/50 hover:border-pink-500/70"
    )}>
        <h3 className="font-semibold text-white text-base">{title}</h3>
        <div className="text-base text-gray-400 mt-1 pr-6 flex-grow">{children}</div>
        {badge && <div className="absolute top-3 right-3 text-base bg-pink-500/80 text-white font-semibold px-1.5 py-0.5 rounded-full">{badge}</div>}
        {price !== undefined && (
            <div className="mt-2 text-right">
                <p className="text-xl font-bold text-pink-400">{formatCurrency(price)}</p>
            </div>
        )}
    </div>
);

const QuoteSummary: React.FC<{
    buildingData: BuildingData;
    calcResult: CalculationResult;
    surveyState: SurveyState;
    onSurveyChange: React.Dispatch<React.SetStateAction<SurveyState>>;
    onViewEstimate: () => void;
}> = ({ buildingData, calcResult, surveyState, onSurveyChange, onViewEstimate }) => (
    <div className="space-y-4 text-base">
        <div className="p-4 bg-gray-900/50 border border-gray-700 rounded-lg">
            <div className="flex items-center text-gray-300 mb-2">
                <Squares2x2Icon className="h-4 w-4 mr-2 text-pink-400"/>
                <h3 className="font-semibold">Total Roof Squares</h3>
            </div>
            <Input 
                type="number"
                className="text-lg font-bold w-full bg-gray-800 border-gray-600"
                value={calcResult.finalSq.toFixed(2)}
                onChange={e => onSurveyChange(s => ({...s, totalSq: Number(e.target.value)}))}
            />
        </div>
        <LiveEstimateBreakdown calcResult={calcResult} surveyState={surveyState} />
        <div className="pt-4 text-center">
            <Button size="lg" className="w-full gap-2" onClick={onViewEstimate}>
                <ShareIcon className="h-5 w-5" />
                View & Share Estimate
            </Button>
        </div>
    </div>
);

export const Dashboard: React.FC<DashboardProps> = ({
  place,
  buildingData,
  surveyState,
  onSurveyChange,
  onStartNew,
}) => {
  const { pricing } = usePricing();
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  
  const calcResult = useMemo<CalculationResult>(() => {
    return calculateEstimate({ buildingData, surveyState }, pricing);
  }, [buildingData, surveyState, pricing]);

  return (
    <div className="h-full w-full flex flex-col bg-black text-white relative overflow-hidden">
      <CircuitryBackground />
      <div className="relative z-10 flex flex-col h-full">
        <header className="sticky top-0 z-20 bg-black/50 backdrop-blur-sm border-b border-gray-800">
          <div className="container mx-auto px-4 h-16 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <RhiveLogo className="h-7" />
              <div className="w-px h-6 bg-gray-700"></div>
              <p className="text-gray-300 truncate max-w-xs md:max-w-md">{place.address}</p>
            </div>
            <Button onClick={onStartNew}>New Estimate</Button>
          </div>
        </header>

        <main className="flex-grow overflow-hidden">
            <div className="h-full grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-4 container mx-auto p-4 md:p-6">
                <div className="lg:col-span-2 xl:col-span-3 overflow-y-auto pr-2 space-y-4">
                    {/* Shingles */}
                    <div className="bg-black/40 border border-gray-800 rounded-2xl p-4">
                        <h2 className="text-lg font-bold text-white">Step 1: Choose Asphalt Shingles</h2>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
                            {Object.keys(shinglesData).map((name) => {
                                const upgrade = name as RoofUpgrade;
                                const price = upgrade === 'TruDefinition® Duration®' ? 'Included' : `+ ${formatCurrency(calcResult.roofEstimate.upgrades[upgrade] || 0)}`;
                                return (
                                    <HoverVideoCard 
                                        key={name} 
                                        title={name} 
                                        description={shinglesData[upgrade].description} 
                                        priceText={price}
                                        selected={surveyState.roofUpgrade === name}
                                        onClick={() => onSurveyChange(s => ({...s, roofUpgrade: upgrade, asphaltRoofingEnabled: true}))}
                                    />
                                );
                            })}
                        </div>
                    </div>

                    {/* Gutters */}
                    <div className="bg-black/40 border border-gray-800 rounded-2xl p-4">
                        <h2 className="text-lg font-bold text-white">Step 2: Gutter System</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
                            {Object.keys(gutterStyleData).map((name) => (
                                <SelectableCard 
                                    key={name}
                                    title={name}
                                    selected={surveyState.gutters.enabled && surveyState.gutters.style === name}
                                    onClick={() => onSurveyChange(s => ({...s, gutters: {...s.gutters, enabled: true, style: name as GutterStyle}}))}
                                >
                                    {gutterStyleData[name as GutterStyle].description}
                                </SelectableCard>
                            ))}
                        </div>
                    </div>
                </div>
                
                <div className="hidden lg:block sticky top-0 h-full overflow-y-auto">
                    <QuoteSummary 
                        buildingData={buildingData}
                        calcResult={calcResult}
                        surveyState={surveyState}
                        onSurveyChange={onSurveyChange}
                        onViewEstimate={() => setIsReportModalOpen(true)}
                    />
                </div>
            </div>
        </main>
        
        <Modal open={isReportModalOpen} onClose={() => setIsReportModalOpen(false)} title="" className="max-w-5xl" contentClassName="p-0">
            <ErrorBoundary>
                <EstimateReport
                    place={place}
                    buildingData={buildingData}
                    surveyState={surveyState}
                    calcResult={calcResult}
                />
            </ErrorBoundary>
        </Modal>
      </div>
    </div>
  );
};
