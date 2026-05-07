import React from 'react';
import type { SurveyState, EaveOverhang } from '../types';
import { CircuitryBackground } from './CircuitryBackground';
import { Button } from './ui/button';
import { RhiveLogo, Check, HeatTraceIcon, Info, RulerIcon } from './icons';
import { cn } from '../lib/utils';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from './ui/tooltip';

interface HeatTraceProps {
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

const eaveOptions: { name: EaveOverhang, imageUrl: string }[] = [
    { name: 'None', imageUrl: 'https://static.wixstatic.com/media/c5862a_37d28a01cea94f11b9f263fc2cb73c3f~mv2.jpg' },
    { name: 'Small', imageUrl: 'https://static.wixstatic.com/media/c5862a_2770009d800c48d9bb98a0830ec637d4~mv2.jpg' },
    { name: 'Medium', imageUrl: 'https://static.wixstatic.com/media/c5862a_2eb2efc13fb9456c9faa188c4f3a1cb8~mv2.png' },
    { name: 'Large', imageUrl: 'https://static.wixstatic.com/media/c5862a_26c7b898483b42d0a3947e922929daa4~mv2.jpg' },
];

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


export const HeatTrace: React.FC<HeatTraceProps> = ({ surveyState, onSurveyChange, onContinue, onStartOver, onStartMeasurement }) => {
    const { heatTrace } = surveyState;

    const handleEnabledChange = (enabled: boolean) => {
        onSurveyChange(prev => ({ ...prev, heatTrace: { ...prev.heatTrace, enabled } }));
    };

    const handleValueChange = (field: keyof SurveyState['heatTrace'], value: any) => {
        onSurveyChange(prev => ({
            ...prev,
            heatTrace: { ...prev.heatTrace, [field]: value }
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
                        
                        {!heatTrace.enabled ? (
                            <div className="text-center">
                                <video 
                                    src="https://video.wixstatic.com/video/c5862a_b8bd71a880624aafbb533f1d755cd2a1/720p/mp4/file.mp4" 
                                    autoPlay 
                                    loop 
                                    muted 
                                    playsInline
                                    className="w-full max-w-md mx-auto rounded-lg shadow-lg mb-6" 
                                    aria-label="Heat trace on a snowy roof"
                                />
                                <h2 className="text-3xl font-bold mb-2">Prevent Ice Dams This Winter!</h2>
                                <p className="text-gray-400 mb-6">Add a heat trace system to protect your roof from damaging ice buildup.</p>

                                <div className="space-y-3 max-w-md mx-auto">
                                    <ChoiceButton active={false} onClick={() => handleEnabledChange(true)}>
                                        Yes, protect my investment!
                                    </ChoiceButton>
                                    <ChoiceButton active={false} onClick={onContinue}>
                                        No thanks, I'll risk it.
                                    </ChoiceButton>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-8 animate-fade-in">
                                <h2 className="text-2xl font-bold">Heat Trace Details</h2>
                                
                                <div>
                                    <label className="font-medium text-gray-200 flex items-center">
                                        What's the total length (in feet) of the area you'd like heat trace installed on?
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <button className="ml-2 text-gray-500 hover:text-pink-400" aria-label="More info on heat trace length"><Info className="h-4 w-4"/></button>
                                            </TooltipTrigger>
                                            <TooltipContent side="left" className="p-2 max-w-sm">
                                                <div className="flex gap-2 mb-2">
                                                    <video src="https://video.wixstatic.com/video/c5862a_2479a8a4ae234c3eb11fa6daefd68704/720p/mp4/file.mp4" loop muted autoPlay playsInline className="w-1/2 rounded-md"></video>
                                                    <img src="https://static.wixstatic.com/media/c5862a_43d38b7dcb514cbb9664193eb24bbdb9~mv2.jpg" alt="Heat trace on roof edge" className="w-1/2 rounded-md object-cover" />
                                                </div>
                                                <p className="text-base">Estimate the total length of roof edges and valleys where ice dams typically form. Use the measure tool for a more accurate calculation. Provide the total straight length. Do not calculate the zigzag pattern</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </label>
                                     <div className="flex items-center space-x-2 mt-2">
                                        <input
                                            type="number"
                                            placeholder="Ex: 85"
                                            value={heatTrace.length || ''}
                                            onChange={(e) => handleValueChange('length', parseInt(e.target.value, 10) || 0)}
                                            className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-pink-500/70 focus:border-transparent transition"
                                        />
                                         <Button variant="ghost" onClick={onStartMeasurement} className="flex-shrink-0 px-3">
                                            <RulerIcon className="h-5 w-5 mr-0 sm:mr-2"/>
                                            <span className="hidden sm:inline">Measure</span>
                                        </Button>
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="font-medium text-gray-200 flex items-center">
                                        How many downspouts would you like heat cable added to?
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <button className="ml-2 text-gray-500 hover:text-pink-400" aria-label="More info on downspouts with heat cable"><Info className="h-4 w-4"/></button>
                                            </TooltipTrigger>
                                            <TooltipContent className="p-2 max-w-xs">
                                                <img src="https://static.wixstatic.com/media/c5862a_ff6c190422474297abaecc306fc78777~mv2.jpg" alt="Heat trace in downspout" className="w-full rounded-md mb-2" />
                                                <p className="text-base">Adding heat cable to downspouts prevents them from freezing solid and causing backups.</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </label>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                                        <DownspoutInput label="1-Story" value={heatTrace.downspouts1Story} onChange={v => handleValueChange('downspouts1Story', v)} />
                                        <DownspoutInput label="2-Story" value={heatTrace.downspouts2Story} onChange={v => handleValueChange('downspouts2Story', v)} />
                                        <DownspoutInput label="3-Story" value={heatTrace.downspouts3Story} onChange={v => handleValueChange('downspouts3Story', v)} />
                                        <DownspoutInput label="4-Story" value={heatTrace.downspouts4Story} onChange={v => handleValueChange('downspouts4Story', v)} />
                                    </div>
                                </div>
                                
                                <div className="mt-8">
                                    <label className="font-medium text-gray-200 flex items-center">
                                        Which eave overhang looks most like your home?
                                         <Tooltip>
                                            <TooltipTrigger asChild>
                                                <button className="ml-2 text-gray-500 hover:text-pink-400" aria-label="More info on eave overhang"><Info className="h-4 w-4"/></button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p className="max-w-xs">The eave is the part of the roof that overhangs the walls. A larger eave may require more extensive heat trace coverage to be effective.</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </label>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                                        {eaveOptions.map(({name, imageUrl}) => (
                                            <label key={name} className="relative cursor-pointer">
                                                <input 
                                                    type="radio" 
                                                    name="eave" 
                                                    value={name} 
                                                    checked={heatTrace.eaveOverhang === name}
                                                    onChange={() => handleValueChange('eaveOverhang', name)}
                                                    className="sr-only peer"
                                                />
                                                <img src={imageUrl} alt={`${name} eave`} className="w-full h-24 object-cover rounded-md transition-all border border-transparent peer-checked:border-pink-500/70"/>
                                                <div className="absolute inset-0 bg-black/50 rounded-md"></div>
                                                <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-base font-semibold">{name}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                     {heatTrace.enabled && (
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