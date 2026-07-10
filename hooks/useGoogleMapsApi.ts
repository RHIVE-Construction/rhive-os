import { useState, useEffect } from 'react';
import { getMapsApiKey } from '../lib/mapsConfig';

declare global {
  interface Window {
    google: any;
    googleMapsApiLoaded?: boolean;
    onGoogleMapsApiReady?: () => void;
  }
}

let isLoadingScript = false;

export function useGoogleMapsApi() {
  const [isApiReady, setIsApiReady] = useState(!!window.googleMapsApiLoaded || !!window.google);
    googleMapsApiFailed?: boolean;
  }
}

/**
 * Returns { isReady, failed }
 *   isReady — true when window.google is available and Maps API loaded successfully
 *   failed  — true when the Maps script failed to load (bad key, billing, etc.)
 *
 * Legacy default export kept for backwards compat: returns isReady boolean.
 */
export function useGoogleMapsApi(): boolean {
  const [isApiReady, setIsApiReady] = useState(!!window.googleMapsApiLoaded);

  useEffect(() => {
    if (isApiReady) return;

    const onReady = () => {
      window.googleMapsApiLoaded = true;
      setIsApiReady(true);
    };

    if (window.googleMapsApiLoaded || window.google) {
      onReady();
      return;
    }

    window.addEventListener('google-maps-api-ready', onReady);

    if (!isLoadingScript) {
        isLoadingScript = true;
        
        window.onGoogleMapsApiReady = () => {
            window.dispatchEvent(new Event('google-maps-api-ready'));
        };

        getMapsApiKey().then((key) => {
            if (!key) {
                console.warn('[RHIVE] Maps API key not found. Maps features will be disabled.');
                return;
            }
            
            if (document.querySelector('script[src*="maps.googleapis.com"]')) {
                return;
            }
            
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places,drawing,geometry&callback=onGoogleMapsApiReady`;
            script.async = true;
            script.defer = true;
            document.head.appendChild(script);
        });
    }
    
    return () => {
      window.removeEventListener('google-maps-api-ready', onReady);
    };
  }, [isApiReady]);

  return isApiReady;
}

/**
 * Extended hook that also exposes a `failed` flag.
 * Use this in map-rendering components to show a proper error state.
 */
export function useGoogleMapsApiStatus(): { isReady: boolean; failed: boolean } {
  const [isReady, setIsReady] = useState(!!window.googleMapsApiLoaded);
  const [failed, setFailed] = useState(!!window.googleMapsApiFailed);

  useEffect(() => {
    if (isReady || failed) return;

    const onReady = () => setIsReady(true);
    const onFailed = () => setFailed(true);

    if (window.googleMapsApiLoaded) { onReady(); return; }
    if (window.googleMapsApiFailed) { onFailed(); return; }

    window.addEventListener('google-maps-api-ready', onReady);
    window.addEventListener('google-maps-api-failed', onFailed);

    return () => {
      window.removeEventListener('google-maps-api-ready', onReady);
      window.removeEventListener('google-maps-api-failed', onFailed);
    };
  }, [isReady, failed]);

  return { isReady, failed };
}
