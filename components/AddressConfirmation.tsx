import React, { useEffect, useRef, useState } from 'react';
import type { Place, BuildingData, SurveyState } from '../types';
import { Button } from './ui/button';
import { XIcon, Check, SatelliteIcon, CameraIcon, PlusIcon, TrashIcon } from './icons';
import { CircuitryBackground } from './CircuitryBackground';
import { cn } from '../lib/utils';
import { createTaggedBuilding } from '../lib/mockData';

interface AddressConfirmationProps {
  place: Place;
  onConfirm: () => void;
  onStartOver: () => void;
  streetViewUrl: string;
  satelliteViewUrl: string;
  buildingData: BuildingData | null;
  setBuildingData: React.Dispatch<React.SetStateAction<BuildingData | null>>;
  surveyState: SurveyState;
  onSurveyChange: React.Dispatch<React.SetStateAction<SurveyState>>;
}

declare global {
    interface Window {
      google: any;
    }
}

export const AddressConfirmation: React.FC<AddressConfirmationProps> = ({
  place,
  onConfirm,
  onStartOver,
  streetViewUrl,
  satelliteViewUrl,
  buildingData,
  setBuildingData,
  surveyState,
  onSurveyChange,
}) => {
  const [view, setView] = useState<'street' | 'satellite'>('satellite');
  const streetViewRef = useRef<HTMLDivElement>(null);
  const panoramaRef = useRef<any>(null);
  const [isStreetViewAvailable, setIsStreetViewAvailable] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAreaSq, setNewAreaSq] = useState('5.00');
  const [newPitch, setNewPitch] = useState('4');

  const handleAddBuildingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!buildingData) return;

    const area = parseFloat(newAreaSq);
    const pitch = parseInt(newPitch, 10);
    if (isNaN(area) || area <= 0 || isNaN(pitch) || pitch < 0) return;

    const nextIndex = buildingData.buildings.length + 1;
    const newBuilding = createTaggedBuilding(nextIndex, area, pitch);

    setBuildingData(prev => {
        if (!prev) return prev;
        return {
            ...prev,
            buildings: [...prev.buildings, newBuilding]
        };
    });

    onSurveyChange(prev => ({
        ...prev,
        includedBuildingIds: [...prev.includedBuildingIds, newBuilding.id]
    }));

    setShowAddForm(false);
    setNewAreaSq('5.00');
    setNewPitch('4');
  };

  const handleDeleteBuilding = (buildingId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!buildingData) return;

    setBuildingData(prev => {
        if (!prev) return prev;
        return {
            ...prev,
            buildings: prev.buildings.filter(b => b.id !== buildingId)
        };
    });

    onSurveyChange(prev => ({
        ...prev,
        includedBuildingIds: prev.includedBuildingIds.filter(id => id !== buildingId)
    }));
  };

  const handleBuildingToggle = (buildingId: string) => {
      onSurveyChange(prev => {
          const isIncluded = prev.includedBuildingIds.includes(buildingId);
          const newIds = isIncluded
              ? prev.includedBuildingIds.filter(id => id !== buildingId)
              : [...prev.includedBuildingIds, buildingId];
          return { ...prev, includedBuildingIds: newIds };
      });
  };


  useEffect(() => {
    const initPanorama = () => {
      if (streetViewRef.current && window.google) {
        const propertyLocation = { lat: place.latitude, lng: place.longitude };
        const panorama = new window.google.maps.StreetViewPanorama(
          streetViewRef.current,
          {
            position: propertyLocation,
            pov: { heading: 0, pitch: 10 },
            zoom: 0,
            addressControl: false,
            linksControl: false,
            panControl: false,
            fullscreenControl: false,
            enableCloseButton: false,
            visible: view === 'street',
          }
        );

        window.google.maps.event.addListenerOnce(panorama, 'status_changed', () => {
          if (panorama.getStatus() === 'OK') {
            const panoLocation = panorama.getLocation().latLng;
            const heading = window.google.maps.geometry.spherical.computeHeading(
              panoLocation, 
              new window.google.maps.LatLng(propertyLocation)
            );
            panorama.setPov({ heading, pitch: 10 });
            setIsStreetViewAvailable(true);
          } else {
            console.error('Street View data not available for this location.');
            setIsStreetViewAvailable(false);
          }
        });

        panoramaRef.current = panorama;
      }
    };

    if (window.google?.maps?.geometry) {
        if (!panoramaRef.current) {
            initPanorama();
        } else if (panoramaRef.current) {
            panoramaRef.current.setVisible(view === 'street');
        }
    }
  }, [place.latitude, place.longitude, view]);


  return (
    <div className="relative h-screen w-screen flex flex-col justify-center items-center p-4 bg-black overflow-hidden animate-fade-in">
        <CircuitryBackground />
        
        <main className="relative z-10 w-full max-w-4xl">
            <div className="bg-black/70 backdrop-blur-md rounded-xl border border-gray-800 shadow-2xl shadow-pink-500/10 overflow-hidden">
                {/* Image Part */}
                <div className="relative w-full aspect-[16/10]">
                    {view === 'satellite' && (
                      <img src={satelliteViewUrl} alt="Satellite view of property" className="absolute inset-0 w-full h-full object-cover" />
                    )}
                    {view === 'street' && !isStreetViewAvailable && (
                        <img src={streetViewUrl} alt="Street view of property" className="absolute inset-0 w-full h-full object-cover" />
                    )}
                    <div 
                        ref={streetViewRef} 
                        className="absolute inset-0"
                        style={{ visibility: view === 'street' && isStreetViewAvailable ? 'visible' : 'hidden' }}
                    />
                    {/* Vignette Effect */}
                    <div className="absolute inset-0 pointer-events-none" style={{ boxShadow: 'inset 0px 0px 100px 20px rgba(0,0,0,0.7)' }} />
                </div>
            
                {/* Controls Part */}
                <div className="p-4 sm:p-5 space-y-4">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div>
                            <p className="text-base text-gray-400">Selected Address</p>
                            <h2 className="text-xl font-semibold text-white">{place.address}</h2>
                        </div>
                    </div>

                    {/* Tagged Buildings Section */}
                    <div className="border-t border-gray-800/80 pt-4">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-lg font-medium text-gray-300">Buildings on Property</h3>
                            <button
                                onClick={() => setShowAddForm(true)}
                                className="inline-flex items-center text-sm font-semibold text-pink-400 hover:text-pink-300 transition-colors gap-1 px-3 py-1.5 rounded bg-pink-500/10 border border-pink-500/20 hover:bg-pink-500/20"
                            >
                                <PlusIcon className="h-4 w-4" />
                                <span>Tag Another Building</span>
                            </button>
                        </div>

                        {/* List of buildings */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                            {buildingData?.buildings.map((building, idx) => {
                                const isIncluded = surveyState.includedBuildingIds.includes(building.id);
                                const sqValue = (building.totalAreaMeters * 10.7639 / 100).toFixed(2);
                                const isCustom = building.id.startsWith('BLD_') && building.id !== 'BLD_1'; // allow deleting added ones
                                return (
                                    <div
                                        key={building.id}
                                        onClick={() => handleBuildingToggle(building.id)}
                                        className={cn(
                                            "relative flex items-center justify-between p-3 rounded-lg bg-black/40 border cursor-pointer transition-all select-none",
                                            isIncluded
                                                ? "border-pink-500/60 bg-pink-900/10 shadow-[0_0_10px_rgba(236,2,139,0.15)]"
                                                : "border-gray-800 hover:border-gray-700 hover:bg-gray-900/30"
                                        )}
                                    >
                                        <div className="flex flex-col min-w-0">
                                            <span className="text-sm font-semibold text-white truncate">
                                                BLD {idx + 1} {idx === 0 && <span className="text-[10px] text-pink-400 font-normal ml-1">(Primary)</span>}
                                            </span>
                                            <span className="text-xs text-gray-400 font-mono">{sqValue} SQ</span>
                                        </div>
                                        {isCustom && (
                                            <button
                                                onClick={(e) => handleDeleteBuilding(building.id, e)}
                                                className="p-1 rounded text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors ml-2"
                                                aria-label="Delete building"
                                            >
                                                <TrashIcon className="h-4 w-4" />
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Inline Add Form */}
                        {showAddForm && (
                            <form onSubmit={handleAddBuildingSubmit} className="mt-4 p-4 rounded-lg border border-pink-500/30 bg-[#121212]/90 space-y-4 animate-fade-in">
                                <h4 className="text-base font-bold text-white">Tag New Building (BLD {buildingData ? buildingData.buildings.length + 1 : 1})</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Estimated Area (SQ)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0.1"
                                            value={newAreaSq}
                                            onChange={(e) => setNewAreaSq(e.target.value)}
                                            className="w-full bg-[#1a1a1a] border border-gray-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-pink-500 font-mono"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Roof Pitch</label>
                                        <select
                                            value={newPitch}
                                            onChange={(e) => setNewPitch(e.target.value)}
                                            className="w-full bg-[#1a1a1a] border border-gray-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-pink-500"
                                        >
                                            <option value="3">3/12</option>
                                            <option value="4">4/12</option>
                                            <option value="5">5/12</option>
                                            <option value="6">6/12</option>
                                            <option value="7">7/12</option>
                                            <option value="8">8/12</option>
                                            <option value="9">9/12</option>
                                            <option value="10">10/12</option>
                                            <option value="12">12/12</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="flex justify-end space-x-2 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddForm(false)}
                                        className="px-4 py-2 rounded text-sm font-semibold text-gray-400 hover:text-white transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 rounded text-sm font-bold text-white bg-[#ec028b] hover:bg-pink-700 transition-colors shadow-md shadow-pink-500/20"
                                    >
                                        Add Building
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t border-gray-800/80 pt-4">
                        {/* Left Buttons: View Toggles */}
                        <div className="flex items-center space-x-2">
                             <button
                                onClick={() => setView('street')}
                                className={cn(
                                    'inline-flex items-center justify-center whitespace-nowrap rounded-md text-base font-medium transition-colors h-10 px-4 py-2 gap-2',
                                    view === 'street'
                                        ? 'bg-[#ec028b] text-white'
                                        : 'bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700'
                                )}
                            >
                                <CameraIcon className="h-5 w-5" />
                                <span>Street</span>
                            </button>
                            <button
                                onClick={() => setView('satellite')}
                                className={cn(
                                    'inline-flex items-center justify-center whitespace-nowrap rounded-md text-base font-medium transition-colors h-10 px-4 py-2 gap-2',
                                    view === 'satellite'
                                        ? 'bg-[#ec028b] text-white'
                                        : 'bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700'
                                )}
                            >
                                <SatelliteIcon className="h-5 w-5" />
                                <span>Satellite</span>
                            </button>
                        </div>
                        
                        {/* Right Buttons: Actions */}
                        <div className="flex items-center space-x-2">
                            <Button onClick={onStartOver} className="bg-black border border-gray-600 hover:bg-gray-800 text-gray-300 hover:text-white flex items-center space-x-2">
                                <XIcon className="h-4 w-4" />
                                <span>Start Over</span>
                            </Button>
                            <Button onClick={onConfirm} className="flex items-center space-x-2">
                                <Check className="h-5 w-5" />
                                <span>Confirm Address</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
  );
};