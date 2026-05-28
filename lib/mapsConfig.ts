
/**
 * getMapsApiKey — fetches the Google Maps API key from the /api/config
 * backend endpoint. The key is never embedded in any client bundle or HTML.
 *
 * Result is cached in memory after the first successful fetch so subsequent
 * calls in the same session are instant.
 */

let _cachedKey: string | null = null;

export async function getMapsApiKey(): Promise<string> {
    if (_cachedKey) return _cachedKey;

    try {
        const res = await fetch('/api/config');
        if (!res.ok) throw new Error(`/api/config returned ${res.status}`);
        const data = await res.json();
        if (!data.mapsApiKey) throw new Error('mapsApiKey missing from /api/config response');
        _cachedKey = data.mapsApiKey as string;
        return _cachedKey;
    } catch (err) {
        console.error('[RHIVE] Failed to fetch Maps API key from backend:', err);
        return '';
    }
}
