import React, { useRef, useEffect } from 'react';
import type { Place } from '../types';
import { cn } from '../lib/utils';
import { useGoogleMapsApi } from '../hooks/useGoogleMapsApi';

interface AddressInputProps {
  onPlaceSelected: (place: Place) => void;
  onInputChange: () => void;
}

export const AddressInput: React.FC<AddressInputProps> = ({ onPlaceSelected, onInputChange }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  // Use a ref to track the instance and prevent double initialization in React Strict Mode
  const autocompleteRef = useRef<any>(null);
  const isApiReady = useGoogleMapsApi();

  useEffect(() => {
    if (!isApiReady || !inputRef.current || !window.google || !window.google.maps.places) {
      return;
    }

    // Only initialize if not already initialized
    if (autocompleteRef.current) return;

    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
      types: ['address'],
      fields: ['formatted_address', 'geometry'], // Request only what we need
      componentRestrictions: { country: 'us' },
    });

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (place.geometry && place.geometry.location && place.formatted_address) {
        onPlaceSelected({
          address: place.formatted_address,
          latitude: place.geometry.location.lat(),
          longitude: place.geometry.location.lng(),
        });
      }
    });

    autocompleteRef.current = autocomplete;

    return () => {
        if (autocompleteRef.current) {
            window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
            // We don't nullify ref here immediately because React might unmount/remount quickly
            // but listeners are cleared to prevent leaks/errors.
            autocompleteRef.current = null; 
        }
        // Note: do NOT remove .pac-container elements here.
        // Google appends them to <body> and manages their own lifecycle.
        // Removing them globally breaks other autocomplete instances on the same page.
    };
  }, [isApiReady, onPlaceSelected]);

  const containerClasses = cn(
    "group relative flex w-full items-center rounded-full border bg-black/50 shadow-lg border-gray-800 transition-all duration-300 ease-in-out hover:shadow-[0_0_15px_rgba(236,2,139,0.2)] focus-within:border-pink-500/70 focus-within:shadow-[0_0_25px_rgba(236,2,139,0.4)]"
  );

  if (!isApiReady) {
    return (
       <div className={containerClasses}>
          <div className="w-full py-3 px-5 text-lg text-pink-400/30 animate-pulse">
              Initializing search...
          </div>
      </div>
    );
  }

  return (
    <div className={containerClasses}>
      <input
        ref={inputRef}
        type="text"
        placeholder="Enter property address for your instant dashboard"
        className="w-full bg-transparent py-3 px-5 text-lg text-gray-200 placeholder-pink-400/50 focus:outline-none"
        onInput={onInputChange}
      />
    </div>
  );
};