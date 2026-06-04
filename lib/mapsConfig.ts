
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
