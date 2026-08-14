import React, { useState } from 'react';
import type { Place } from '../types';
import { AddressInput } from './AddressInput';
import { cn } from '../lib/utils';
import { CircuitryBackground } from './CircuitryBackground';
import { RhiveLogo } from './icons';

interface LandingPageProps {
  onPlaceSelected: (place: Place) => void;
  error?: string | null;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onPlaceSelected, error }) => {
  const [hasInteracted, setHasInteracted] = useState(false);

  return (
    <div className="relative h-full w-full flex flex-col justify-center items-center p-4">
      <CircuitryBackground />
      <button 
        onClick={() => window.dispatchEvent(new CustomEvent('rhive-reset-estimator'))}
        className="absolute top-8 left-8 z-20 cursor-pointer focus:outline-none transition-transform hover:scale-105 active:scale-95 bg-transparent border-0 p-0"
        aria-label="Back to start"
      >
        <RhiveLogo className="h-10" />
      </button>
      <div className="relative z-10 w-full">
        <main className="w-full max-w-4xl text-center mx-auto">
          <h1 className="text-6xl sm:text-7xl md:text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-pink-400 tracking-tighter">
            Instant Estimator
          </h1>
          <p className="text-xl md:text-2xl text-pink-400 mt-4 font-light">
            AI-Powered Property Intelligence
          </p>
          <div className="mt-12 max-w-2xl mx-auto">
            <AddressInput onPlaceSelected={onPlaceSelected} onInputChange={() => setHasInteracted(true)} />
          </div>
          <div className={cn(
            "text-red-400 text-base mt-4 h-5 transition-opacity duration-300",
            error && !hasInteracted ? "opacity-100" : "opacity-0"
          )}>
            {error && !hasInteracted ? error : ''}
          </div>
        </main>
      </div>
    </div>
  );
};
