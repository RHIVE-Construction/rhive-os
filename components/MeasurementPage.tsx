import React from 'react';
import { MapMeasurementTool } from './MapMeasurementTool';
import { RhiveLogo } from './icons';
import { Button } from './ui/button';
import { CircuitryBackground } from './CircuitryBackground';

interface MeasurementPageProps {
  title: string;
  center: { lat: number; lng: number };
  onLengthChange: (length: number) => void;
  onDone: () => void;
  onStartOver: () => void;
  initialPaths?: { lat: number; lng: number }[][];
  onPathsChange?: (paths: { lat: number; lng: number }[][]) => void;
}

export const MeasurementPage: React.FC<MeasurementPageProps> = ({ 
  title, 
  center, 
  onLengthChange, 
  onDone, 
  onStartOver,
  initialPaths,
  onPathsChange
}) => {
  return (
    <div className="relative h-screen w-screen flex flex-col bg-black">
      <CircuitryBackground />
      <header className="relative z-10 w-full bg-black/50 backdrop-blur-sm border-b border-gray-800">
        <div className="container mx-auto px-4 h-16 flex justify-between items-center">
          <RhiveLogo className="h-7" />
          <Button variant="ghost" onClick={onStartOver}>Start New Estimate</Button>
        </div>
      </header>
      <main className="relative z-10 flex-grow flex flex-col p-4 md:p-8">
        <h1 className="text-2xl font-bold text-white text-center mb-4">{title}</h1>
        <div className="flex-grow rounded-lg overflow-hidden border border-gray-700">
            <MapMeasurementTool 
                center={center}
                onLengthChange={onLengthChange}
                onClose={onDone}
                initialPaths={initialPaths}
                onPathsChange={onPathsChange}
            />
        </div>
      </main>
    </div>
  );
};
