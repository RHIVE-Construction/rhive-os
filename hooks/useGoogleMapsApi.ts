import { useState, useEffect } from 'react';

declare global {
  interface Window {
    google: any;
    googleMapsApiLoaded?: boolean;
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
