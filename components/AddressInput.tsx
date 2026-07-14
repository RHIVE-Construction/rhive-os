import React, { useRef, useEffect } from 'react';
import type { Place } from '../types';
import { cn } from '../lib/utils';
import { useGoogleMapsApi } from '../hooks/useGoogleMapsApi';

interface AddressInputProps {
  onPlaceSelected: (place: Place) => void;
  onInputChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  initialValue?: string;
  inputClassName?: string;
  containerClassName?: string;
}

export const AddressInput: React.FC<AddressInputProps> = ({ 
  onPlaceSelected, 
  onInputChange, 
  placeholder = "Enter address",
  initialValue = "",
  inputClassName,
  containerClassName
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<any>(null);
  const isApiReady = useGoogleMapsApi();

  useEffect(() => {
    if (inputRef.current && initialValue !== undefined) {
      inputRef.current.value = initialValue;
    }
  }, [initialValue]);

  useEffect(() => {
    if (!isApiReady || !inputRef.current || !window.google || !window.google.maps.places) {
      return;
    }

    if (autocompleteRef.current) return;

    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
      types: ['address'],
      fields: ['formatted_address', 'geometry'],
      componentRestrictions: { country: 'us' },
    });

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (place.geometry && place.geometry.location && place.formatted_address) {
        if (inputRef.current) {
          inputRef.current.value = place.formatted_address;
        }
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
            autocompleteRef.current = null; 
        }
        const pacContainers = document.querySelectorAll('.pac-container');
        pacContainers.forEach((el) => el.remove());
    };
  }, [isApiReady, onPlaceSelected]);

  const defaultContainerClasses = "group relative flex w-full items-center rounded-full border bg-black/50 shadow-lg border-gray-800 transition-all duration-300 ease-in-out hover:shadow-[0_0_15px_rgba(236,2,139,0.2)] focus-within:border-pink-500/70 focus-within:shadow-[0_0_25px_rgba(236,2,139,0.4)]";
  const finalContainerClasses = containerClassName || defaultContainerClasses;

  if (!isApiReady) {
    return (
       <div className={finalContainerClasses}>
          <div className={cn("w-full py-3 px-5 text-sm text-pink-400/30 animate-pulse", inputClassName)}>
              Initializing search...
          </div>
      </div>
    );
  }

  return (
    <div className={finalContainerClasses}>
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        className={cn("w-full bg-transparent py-3 px-5 text-sm text-gray-200 placeholder-pink-400/50 focus:outline-none", inputClassName)}
        onChange={onInputChange}
      />
    </div>
  );
};