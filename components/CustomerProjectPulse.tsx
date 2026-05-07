import React from 'react';
import Card from './Card';
import { Check, Clock, WrenchIcon, CheckCircle2 } from './icons';

const stages = [
    { id: 'lead', label: 'Lead', status: 'completed' },
    { id: 'estimate', label: 'Estimate', status: 'completed' },
    { id: 'quote', label: 'Quote', status: 'active' },
    { id: 'install', label: 'Install', status: 'pending' },
    { id: 'complete', label: 'Complete', status: 'pending' }
];

const CustomerProjectPulse: React.FC = () => {
    // We use a placeholder image designed to look like a drone shot of a roof
    const bgImage = "https://images.unsplash.com/photo-1628744876497-eb30460be9f6?q=80&w=1200&auto=format&fit=crop";

    return (
        <Card showAccents={false} className="relative overflow-hidden mb-8 border-none p-0 bg-transparent">
            {/* Background Image Layer */}
            <div className="absolute inset-0 z-0">
                <img src={bgImage} alt="Project Location" className="w-full h-full object-cover" />
                {/* Dark gradient overlay for readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/40" />
            </div>

            {/* Content Layer */}
            <div className="relative z-10 p-6 md:p-8 flex flex-col min-h-[250px] justify-between">
                
                {/* Header */}
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#ec028b]/20 border border-[#ec028b]/30 rounded-full mb-3">
                            <span className="w-2 h-2 rounded-full bg-[#ec028b] animate-pulse" />
                            <span className="text-base font-bold text-[#ec028b] uppercase tracking-wider">Project Pulse</span>
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-1">124 Maple Street</h2>
                        <p className="text-gray-300 font-mono text-base">PRJ-88492 • Residential Replacement</p>
                    </div>
                </div>

                {/* Pizza Tracker Stepper */}
                <div className="mt-auto">
                    <div className="relative">
                        {/* Connecting Line */}
                        <div className="absolute top-1/2 left-0 w-full h-1 -translate-y-1/2 bg-white/10" />
                        
                        {/* Active Line Progress */}
                        <div 
                            className="absolute top-1/2 left-0 h-1 -translate-y-1/2 bg-[#00D1FF] transition-all duration-1000 shadow-[0_0_10px_#00D1FF]"
                            style={{ width: '50%' }}
                        />

                        {/* Steps */}
                        <div className="relative flex justify-between">
                            {stages.map((stage, index) => {
                                const isCompleted = stage.status === 'completed';
                                const isActive = stage.status === 'active';
                                const isPending = stage.status === 'pending';

                                return (
                                    <div key={stage.id} className="flex flex-col items-center">
                                        <div 
                                            className={`
                                                w-8 h-8 rounded-full flex items-center justify-center relative z-10 transition-colors duration-300
                                                ${isCompleted ? 'bg-[#00D1FF] text-black shadow-[0_0_15px_rgba(0,209,255,0.4)]' : ''}
                                                ${isActive ? 'bg-black border-2 border-[#00D1FF] text-[#00D1FF] shadow-[0_0_20px_rgba(0,209,255,0.6)]' : ''}
                                                ${isPending ? 'bg-black border border-white/20 text-gray-500' : ''}
                                            `}
                                        >
                                            {isCompleted && <Check className="w-4 h-4 font-bold" />}
                                            {isActive && <div className="w-2.5 h-2.5 rounded-full bg-[#00D1FF] animate-pulse" />}
                                            {isPending && <span className="text-base font-mono">{index + 1}</span>}
                                        </div>
                                        <span 
                                            className={`
                                                mt-2 text-base font-bold uppercase tracking-wider absolute top-8 whitespace-nowrap
                                                ${isActive ? 'text-[#00D1FF]' : 'text-gray-400'}
                                            `}
                                        >
                                            {stage.label}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    
                    <div className="mt-12 bg-black/40 backdrop-blur border border-white/10 p-4 rounded-lg flex items-start gap-4">
                        <div className="bg-[#00D1FF]/10 p-2 rounded text-[#00D1FF]">
                            <Clock className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="text-white text-base font-bold mb-1">Current Status: Quote Development</h4>
                            <p className="text-gray-400 text-base">Your dedicated estimator is finalizing the material takeoff. Expect the final quote within 24 hours.</p>
                        </div>
                    </div>
                </div>

            </div>
        </Card>
    );
};

export default CustomerProjectPulse;
