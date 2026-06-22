import { useState, useEffect } from 'react';
import { ensureGoogleMapsLoaded } from '../lib/mapsConfig';

declare global {
  interface Window {
    google: any;
    googleMapsApiLoaded?: boolean;
  }
}

export function useGoogleMapsApi() {
  const [isApiReady, setIsApiReady] = useState(!!window.googleMapsApiLoaded);

  useEffect(() => {
    // Proactively load Maps API if not already loaded (handles cases where
    // index.html %VITE_*% substitution didn't inject the key)
    ensureGoogleMapsLoaded();

    if (isApiReady) return;

    const onReady = () => setIsApiReady(true);

    if (window.googleMapsApiLoaded) {
      onReady();
      return;
    }
    
    window.addEventListener('google-maps-api-ready', onReady);
    
    return () => {
      window.removeEventListener('google-maps-api-ready', onReady);
    };
  }, [isApiReady]);

  return isApiReady;
}
