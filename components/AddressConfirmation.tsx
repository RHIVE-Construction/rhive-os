import React, { useEffect, useRef, useState } from 'react';
import type { Place } from '../types';
import { Button } from './ui/button';
import { XIcon, Check, SatelliteIcon, CameraIcon } from './icons';
import { CircuitryBackground } from './CircuitryBackground';
import { cn } from '../lib/utils';

interface AddressConfirmationProps {
  place: Place;
  onConfirm: () => void;
  onStartOver: () => void;
  streetViewUrl: string;
  satelliteViewUrl: string;
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
}) => {
  const [view, setView] = useState<'street' | 'satellite'>('satellite');
  const streetViewRef = useRef<HTMLDivElement>(null);
  const panoramaRef = useRef<any>(null);
  const [isStreetViewAvailable, setIsStreetViewAvailable] = useState(true);

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
                    <div>
                        <p className="text-base text-gray-400">Selected Address</p>
                        <h2 className="text-xl font-semibold text-white truncate">{place.address}</h2>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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