import React from 'react';
import type { SurveyState } from '../types';
import { CircuitryBackground } from './CircuitryBackground';
import { Button } from './ui/button';
import { RhiveLogo, Check, Info, RulerIcon } from './icons';
import { cn } from '../lib/utils';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from './ui/tooltip';

interface GuttersProps {
  surveyState: SurveyState;
  onSurveyChange: React.Dispatch<React.SetStateAction<SurveyState>>;
  onContinue: () => void;
  onStartOver: () => void;
  onStartMeasurement: () => void;
}

const ChoiceButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center justify-center text-center w-full p-4 rounded-lg border transition-all duration-200",
        active
          ? 'bg-pink-900/30 border-pink-500/70 text-white'
          : 'bg-gray-800/50 border-gray-700 text-gray-300 hover:border-pink-500/70'
      )}
    >
        <span>{children}</span>
    </button>
);

const DownspoutInput: React.FC<{ label: string; value: number; onChange: (val: number) => void }> = ({ label, value, onChange }) => (
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


export const Gutters: React.FC<GuttersProps> = ({ surveyState, onSurveyChange, onContinue, onStartOver, onStartMeasurement }) => {
    const { gutters } = surveyState;

    const handleEnabledChange = (enabled: boolean) => {
        onSurveyChange(prev => ({ ...prev, gutters: { ...prev.gutters, enabled } }));
    };

    const handleValueChange = (field: keyof SurveyState['gutters'], value: any) => {
        onSurveyChange(prev => ({
            ...prev,
            gutters: { ...prev.gutters, [field]: value }
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
                        
                        {!gutters.enabled ? (
                            <div className="text-center">
                                <img src="https://static.wixstatic.com/media/c5862a_46d8ea67e05543e2ace16f2fc3da7504~mv2.gif" alt="Seamless gutters on a modern home" className="w-full max-w-md mx-auto rounded-lg shadow-lg mb-6" />
                                <h2 className="text-3xl font-bold mb-2">Protect Your Foundation with Seamless Gutters</h2>
                                <p className="text-gray-400 mb-6">Channel water away from your home to prevent costly foundation damage, landscape erosion, and basement flooding. Would you like to include a gutter estimate?</p>
                                <div className="space-y-3 max-w-md mx-auto">
                                    <ChoiceButton active={false} onClick={() => handleEnabledChange(true)}>
                                        Yes, add a gutter estimate!
                                    </ChoiceButton>
                                    <ChoiceButton active={false} onClick={onContinue}>
                                        No, I'll consider it later.
                                    </ChoiceButton>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-8 animate-fade-in">
                                <h2 className="text-2xl font-bold">Gutter Details</h2>
                                <div>
                                    <label className="font-medium text-gray-200 flex items-center">
                                        About how many feet of gutters are on your project?
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <button className="ml-2 text-gray-500 hover:text-pink-400" aria-label="More info on gutter length"><Info className="h-4 w-4"/></button>
                                            </TooltipTrigger>
                                            <TooltipContent className="p-2" side="left">
                                                <video src="https://video.wixstatic.com/video/c5862a_2479a8a4ae234c3eb11fa6daefd68704/720p/mp4/file.mp4" loop muted autoPlay playsInline className="w-full rounded-md mb-2"></video>
                                                <p>Use our measurement tool for a quick, accurate number or enter your best estimate. No need for perfection!</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </label>
                                     <div className="flex items-center space-x-2 mt-2">
                                        <input
                                            type="number"
                                            placeholder="Ex: 120"
                                            value={gutters.length || ''}
                                            onChange={(e) => handleValueChange('length', parseInt(e.target.value, 10) || 0)}
                                            className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-pink-500/70 focus:border-transparent transition"
                                        />
                                        <Button variant="ghost" onClick={onStartMeasurement} className="flex-shrink-0 px-3">
                                            <RulerIcon className="h-5 w-5 mr-0 sm:mr-2"/>
                                            <span className="hidden sm:inline">Measure</span>
                                        </Button>
                                    </div>
                                </div>
                                
                                <video src="https://video.wixstatic.com/video/c5862a_30d8b96b6ea349b584d9a845a065a6de/480p/mp4/file.mp4" loop muted autoPlay playsInline className="w-full rounded-lg object-cover" />

                                <div>
                                     <label className="font-medium text-gray-200 flex items-center">
                                        How many miters (gutter corners) are on your project?
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <button className="ml-2 text-gray-500 hover:text-pink-400" aria-label="More info on miters"><Info className="h-4 w-4"/></button>
                                            </TooltipTrigger>
                                            <TooltipContent className="p-2">
                                                <video src="https://video.wixstatic.com/video/c5862a_be6e76b75814476cbb15b24083299abc/1080p/mp4/file.mp4" loop muted autoPlay playsInline className="w-full rounded-md mb-2"></video>
                                                <p>Count every inside and outside corner where your gutters change direction. A simple rectangular house has 4.</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </label>
                                    <input
                                        type="number"
                                        placeholder="Ex: 6"
                                        value={gutters.miters || ''}
                                        onChange={(e) => handleValueChange('miters', parseInt(e.target.value, 10) || 0)}
                                        className="w-full mt-2 bg-gray-800 border border-gray-700 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-pink-500/70 focus:border-transparent transition"
                                    />
                                </div>
                                
                                <div>
                                    <label className="font-medium text-gray-200 flex items-center">
                                        How many downspouts does your property currently have?
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <button className="ml-2 text-gray-500 hover:text-pink-400" aria-label="More info on downspouts"><Info className="h-4 w-4"/></button>
                                            </TooltipTrigger>
                                            <TooltipContent className="p-2">
                                                <video src="https://video.wixstatic.com/video/c5862a_3672a8e278254d659764bd3a7b33e0a6/1080p/mp4/file.mp4" loop muted autoPlay playsInline className="w-full rounded-md mb-2"></video>
                                                <p>Downspouts are the vertical pipes that move water from the gutters to the ground. Enter the quantity for each story height.</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </label>
                                    <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-4 mt-2">
                                        <span className="text-base text-gray-400 mb-2 sm:mb-0 sm:pb-8 sm:w-1/4">Downspout length</span>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full sm:w-3/4">
                                            <DownspoutInput label="1-Story" value={gutters.downspouts1Story} onChange={v => handleValueChange('downspouts1Story', v)} />
                                            <DownspoutInput label="2-Story" value={gutters.downspouts2Story} onChange={v => handleValueChange('downspouts2Story', v)} />
                                            <DownspoutInput label="3-Story" value={gutters.downspouts3Story} onChange={v => handleValueChange('downspouts3Story', v)} />
                                            <DownspoutInput label="4-Story" value={gutters.downspouts4Story} onChange={v => handleValueChange('downspouts4Story', v)} />
                                        </div>
                                    </div>
                                </div>

                            </div>
                        )}
                    </div>
                     {gutters.enabled && (
                        <div className="mt-8 text-center">
                            <Button size="lg" onClick={onContinue}>
                                Continue
                            </Button>
                        </div>
                    )}
                </div>
            </main>
        </div>
        </TooltipProvider>
    );
};