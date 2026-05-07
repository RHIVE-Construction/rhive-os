import React from 'react';
import type { CalculationResult, SurveyState } from '../types';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { Check } from './icons';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { formatCurrency } from '../lib/utils';
import { Card, CardContent } from './ui/card';
import { cn } from '../lib/utils';

interface EstimateFooterProps {
    calcResult: CalculationResult;
    surveyState: SurveyState;
    onSurveyChange: React.Dispatch<React.SetStateAction<SurveyState>>;
}

export const EstimateFooter: React.FC<EstimateFooterProps> = ({ calcResult, surveyState, onSurveyChange }) => {
    return (
        <footer className="sticky bottom-0 z-20 bg-black/70 backdrop-blur-sm border-t border-gray-800">
            <div className="container mx-auto px-4 h-20 flex justify-between items-center">
                <div>
                    <p className="text-base text-gray-400">Live Estimate Total</p>
                    <p className="text-3xl font-bold text-[#ec028b]">
                        {formatCurrency(calcResult.liveTotal)}
                    </p>
                </div>
                <Sheet>
                    <SheetTrigger asChild>
                        <Button size="lg">Show Full Breakdown</Button>
                    </SheetTrigger>
                    <SheetContent>
                        <BreakdownSheetContent calcResult={calcResult} surveyState={surveyState} onSurveyChange={onSurveyChange}/>
                    </SheetContent>
                </Sheet>
            </div>
        </footer>
    );
};


const BreakdownSheetContent: React.FC<{ calcResult: CalculationResult; surveyState: SurveyState; onSurveyChange: React.Dispatch<React.SetStateAction<SurveyState>> }> = ({ calcResult, surveyState, onSurveyChange }) => {
    const { roofEstimate, gutterEstimate, heatTraceEstimate } = calcResult;
    
    const handleUpgradeChange = (value: string) => {
        onSurveyChange(prev => ({...prev, roofUpgrade: value as SurveyState['roofUpgrade']}));
    }
    const handleGutterToggle = (checked: boolean) => {
        onSurveyChange(prev => ({...prev, gutters: {...prev.gutters, enabled: checked}}));
    }
     const handleHeatTraceToggle = (checked: boolean) => {
        onSurveyChange(prev => ({...prev, heatTrace: {...prev.heatTrace, enabled: checked}}));
    }

    return (
        <>
            <SheetHeader>
                <SheetTitle>Cost & Upgrade Options</SheetTitle>
            </SheetHeader>
            <div className="py-4 space-y-6">
                <div>
                    <h3 className="font-semibold mb-2">Base Roof Cost Breakdown (Duration)</h3>
                    <Card>
                        <CardContent className="pt-4 text-base space-y-2">
                             <div className="flex justify-between"><span>Materials</span><span>{formatCurrency(roofEstimate.breakdown.materials)}</span></div>
                             <div className="flex justify-between"><span>Labor</span><span>{formatCurrency(roofEstimate.breakdown.labor)}</span></div>
                             <div className="flex justify-between"><span>Overhead & Addons</span><span>{formatCurrency(roofEstimate.breakdown.overhead)}</span></div>
                             <div className="flex justify-between"><span>Profit</span><span>{formatCurrency(roofEstimate.breakdown.profit)}</span></div>
                             <Separator className="my-2 bg-gray-600"/>
                             <div className="flex justify-between font-bold"><span>Total Base Price</span><span>{formatCurrency(roofEstimate.breakdown.total)}</span></div>
                        </CardContent>
                    </Card>
                </div>
                
                 <div>
                    <h3 className="font-semibold mb-2">Roof Upgrade Options</h3>
                    {/* Fix: Use correct keys for roof upgrade types and costs. */}
                    <RadioGroup value={surveyState.roofUpgrade} onValueChange={handleUpgradeChange}>
                        <LabelledRadioItem id="duration" value="TruDefinition® Duration®" label="Duration" priceText="Included"/>
                        <LabelledRadioItem id="flex" value="TruDefinition® Duration FLEX®" label="Flex" priceText={`+ ${formatCurrency(roofEstimate.upgrades['TruDefinition® Duration FLEX®'])}`}/>
                        <LabelledRadioItem id="designer" value="GAF Woodland®" label="Designer" priceText={`+ ${formatCurrency(roofEstimate.upgrades['GAF Woodland®'])}`}/>
                        <LabelledRadioItem id="premiumDesigner" value="GAF Grand Sequoia®" label="Premium Designer" priceText={`+ ${formatCurrency(roofEstimate.upgrades['GAF Grand Sequoia®'])}`}/>
                    </RadioGroup>
                </div>
                <Separator className="bg-gray-600"/>
                 <div
                    onClick={() => handleGutterToggle(!surveyState.gutters.enabled)}
                     className={cn(
                        "flex items-center justify-between cursor-pointer p-3 rounded-lg border transition-colors",
                        surveyState.gutters.enabled
                            ? "bg-pink-900/30 border-pink-500/70"
                            : "border-transparent hover:bg-gray-800/50"
                    )}
                 >
                    <span className="font-semibold">Include Gutter Estimate</span>
                    <span className="font-bold">{formatCurrency(gutterEstimate.total)}</span>
                 </div>
                 <div
                    onClick={() => handleHeatTraceToggle(!surveyState.heatTrace.enabled)}
                    className={cn(
                        "flex items-center justify-between cursor-pointer p-3 rounded-lg border transition-colors",
                        surveyState.heatTrace.enabled
                            ? "bg-pink-900/30 border-pink-500/70"
                            : "border-transparent hover:bg-gray-800/50"
                    )}
                >
                    <span className="font-semibold">Include Heat Trace Estimate</span>
                    <span className="font-bold">{formatCurrency(heatTraceEstimate.total)}</span>
                 </div>
            </div>
        </>
    );
};

const LabelledRadioItem: React.FC<{id:string, value: string, label: string, priceText: string}> = ({id, value, label, priceText}) => (
    <label htmlFor={id} className="flex items-center p-3 rounded-md border border-gray-700 has-[:checked]:border-pink-500/70 has-[:checked]:bg-pink-900/20 cursor-pointer">
        <RadioGroupItem value={value} id={id} />
        <span className="ml-3 flex-grow">{label}</span>
        <span className="text-base font-semibold">{priceText}</span>
    </label>
);