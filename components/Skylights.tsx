import React from 'react';
import type { SurveyState } from '../types';
import { CircuitryBackground } from './CircuitryBackground';
import { Button } from './ui/button';
import { RhiveLogo, Check, Info } from './icons';
import { cn } from '../lib/utils';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from './ui/tooltip';

// This is a placeholder icon, you might want to create a proper one
const SkylightIcon: React.FC<React.HTMLAttributes<SVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 12 H 22 V 22 H 12 z"/>
        <path d="M2 12 l10 -10 l10 10"/>
    </svg>
);


interface SkylightsProps {
  surveyState: SurveyState;
  onSurveyChange: React.Dispatch<React.SetStateAction<SurveyState>>;
  onContinue: () => void;
  onStartOver: () => void;
}

const ChoiceButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center justify-center text-center w-full p-4 rounded-lg border-2 transition-all duration-200",
        active
          ? 'bg-pink-900/30 border-pink-500 text-white'
          : 'bg-gray-800/50 border-gray-700 text-gray-300 hover:border-pink-500/70'
      )}
    >
        <span>{children}</span>
    </button>
);

const QuantityInput: React.FC<{ label: string; value: number; onChange: (val: number) => void }> = ({ label, value, onChange }) => (
    <div className="text-center">
        <label className="text-base text-gray-400">{label}</label>
        <input 
            type="number"
            value={value || ''}
            onChange={(e) => onChange(parseInt(e.target.value, 10) || 0)}
            className="w-full mt-2 bg-gray-800 border border-gray-700 rounded-md text-center py-2 px-1 focus:outline-none focus:ring-2 focus:ring-pink-500/70 focus:border-transparent transition"
            min="0"
        />
    </div>
);


export const Skylights: React.FC<SkylightsProps> = ({ surveyState, onSurveyChange, onContinue, onStartOver }) => {

    const { roofFeatures } = surveyState;
    // We'll use a simple boolean in state to track the choice, even though the data is stored in roofFeatures
    const skylightsEnabled = roofFeatures.skylights > 0;

    const handleEnabledChange = (enabled: boolean) => {
        onSurveyChange(prev => ({
            ...prev,
            roofFeatures: { ...prev.roofFeatures, skylights: enabled ? 1 : 0 }
        }));
    };

    const handleQuantityChange = (quantity: number) => {
         onSurveyChange(prev => ({
            ...prev,
            roofFeatures: { ...prev.roofFeatures, skylights: quantity }
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
                <div className="w-full max-w-2xl text-white">
                    <div className="space-y-8 p-8 bg-black/70 backdrop-blur-md rounded-2xl border border-gray-800 shadow-2xl shadow-pink-500/10">
                        
                        {!skylightsEnabled ? (
                            <div className="text-center">
                                <div className="mx-auto bg-pink-500/20 rounded-xl h-16 w-16 flex items-center justify-center border border-pink-500/30 mb-4">
                                    <SkylightIcon className="h-8 w-8 text-pink-400" />
                                </div>
                                <h2 className="text-3xl font-bold mb-2">Brighten Your Home with Natural Light!</h2>
                                <p className="text-gray-400 mb-6">Adding skylights can transform a room, making it feel larger and more inviting. Would you like to include skylights in your estimate?</p>

                                <div className="space-y-3 max-w-md mx-auto">
                                    <ChoiceButton active={false} onClick={() => handleEnabledChange(true)}>
                                        Yes, let the sun shine in!
                                    </ChoiceButton>
                                    <ChoiceButton active={false} onClick={onContinue}>
                                        No thanks, not at this time.
                                    </ChoiceButton>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-8 animate-fade-in">
                                <h2 className="text-2xl font-bold">Skylight Details</h2>
                                <img src="https://picsum.photos/seed/skylight-main/800/300" alt="Room with skylights" className="w-full h-48 rounded-lg object-cover" />
                                
                                <div>
                                    <label className="font-medium text-gray-200 flex items-center">
                                        How many skylights would you like to add or replace?
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <button className="ml-2 text-gray-500 hover:text-pink-400" aria-label="More info on skylights"><Info className="h-4 w-4"/></button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p className="max-w-xs">Include both new installations and existing skylights you wish to replace during the roofing project.</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </label>
                                     <div className="mt-2 w-48">
                                        <QuantityInput label="Quantity" value={roofFeatures.skylights} onChange={handleQuantityChange} />
                                    </div>
                                </div>
                                
                                <div>
                                    <p className="text-gray-300">Further customization, such as size, type (fixed, manual, electric), and shades, will be covered during your certified quote with one of our specialists.</p>
                                </div>

                            </div>
                        )}
                    </div>
                     {skylightsEnabled ? (
                        <div className="mt-8 text-center">
                            <Button size="lg" onClick={onContinue}>
                                Continue
                            </Button>
                        </div>
                     ) : null}
                </div>
            </main>
        </div>
        </TooltipProvider>
    );
};