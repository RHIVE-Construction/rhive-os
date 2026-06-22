
/**
 * getMapsApiKey — fetches the Google Maps API key.
 *
 * Priority:
 * 1. Memory cache (instant on repeat calls)
 * 2. VITE_GOOGLE_MAPS_API_KEY env var (set in apphosting.yaml for live, .env for local)
 * 3. /api/config backend endpoint (Vite dev server middleware fallback)
 *
 * The key is never hardcoded — it comes from build-time env injection or the
 * dev-server proxy. Google Maps keys should be HTTP-referrer restricted in GCP.
 */

let _cachedKey: string | null = null;

export async function getMapsApiKey(): Promise<string> {
    if (_cachedKey) return _cachedKey;

    // 1. Check build-time env var (works on Firebase App Hosting & locally with .env)
    const envKey = (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY as string | undefined;
    if (envKey) {
        _cachedKey = envKey;
        return _cachedKey;
    }

    // 2. Fall back to /api/config (Vite dev server middleware)
    try {
        const res = await fetch('/api/config');
        if (!res.ok) throw new Error(`/api/config returned ${res.status}`);
        const data = await res.json();
        if (!data.mapsApiKey) throw new Error('mapsApiKey missing from /api/config response');
        _cachedKey = data.mapsApiKey as string;
        return _cachedKey;
    } catch (err) {
        console.warn('[RHIVE] Maps API key not available — map will show placeholder.', err);
        return '';
    }
}

/**
 * ensureGoogleMapsLoaded — dynamically loads the Google Maps JS API if not already present.
 *
 * Called once from useGoogleMapsApi hook so all map components benefit automatically.
 * Safe to call multiple times — idempotent via the _loadPromise singleton.
 */
let _loadPromise: Promise<void> | null = null;

export function ensureGoogleMapsLoaded(): Promise<void> {
    // Already loaded
    if (window.googleMapsApiLoaded) return Promise.resolve();

    // Deduplicate concurrent calls
    if (_loadPromise) return _loadPromise;

    _loadPromise = (async () => {
        const key = await getMapsApiKey();
        if (!key) {
            console.warn('[RHIVE] No Maps API key — skipping script load.');
            return;
        }

        // Check if script tag already exists (loaded via index.html)
        const existing = document.querySelector('script[src*="maps.googleapis.com/maps/api/js"]');
        if (existing) {
            // Script exists but callback may not have fired yet — just wait for the event
            return;
        }

        // Define the callback before creating the script
        (window as any).onGoogleMapsApiReady = () => {
            window.googleMapsApiLoaded = true;
            window.dispatchEvent(new Event('google-maps-api-ready'));
        };

        const script = document.createElement('script');
        script.async = true;
        script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places,drawing,geometry&callback=onGoogleMapsApiReady`;
        script.onerror = () => {
            console.error('[RHIVE] Failed to load Google Maps API — check API key & referrer restrictions.');
            _loadPromise = null; // Allow retry
        };
        document.head.appendChild(script);
    })();

    return _loadPromise;
}
