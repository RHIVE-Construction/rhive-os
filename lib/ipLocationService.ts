/**
 * ipLocationService.ts
 * Lightweight IP geo-location resolver for RHIVE QOS.
 * Called during login to attach IP / location metadata to `user_log` entries.
 *
 * Uses the free ipapi.co endpoint — no API key required.
 * Returns a safe fallback object on any network error so logins are never blocked.
 */

export interface IpLocationData {
    ip: string;
    city: string;
    region: string;
    country: string;
    countryName: string;
    latitude: number | null;
    longitude: number | null;
    timezone: string;
}

const FALLBACK: IpLocationData = {
    ip: 'unknown',
    city: 'unknown',
    region: 'unknown',
    country: 'unknown',
    countryName: 'unknown',
    latitude: null,
    longitude: null,
    timezone: 'unknown',
};

/**
 * Fetch the current client's public IP address and geo-location.
 * Resolves in ~200ms on a good connection. Times out after 4 seconds.
 * Never throws — returns FALLBACK on any error.
 */
export async function getIpLocation(): Promise<IpLocationData> {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);

        const res = await fetch('https://ipapi.co/json/', {
            signal: controller.signal,
            headers: { Accept: 'application/json' },
        });

        clearTimeout(timeoutId);

        if (!res.ok) return FALLBACK;

        const data = await res.json();

        return {
            ip:          data.ip          || 'unknown',
            city:        data.city        || 'unknown',
            region:      data.region      || 'unknown',
            country:     data.country     || 'unknown',
            countryName: data.country_name || 'unknown',
            latitude:    typeof data.latitude  === 'number' ? data.latitude  : null,
            longitude:   typeof data.longitude === 'number' ? data.longitude : null,
            timezone:    data.timezone    || 'unknown',
        };
    } catch {
        // Never block login due to geo-lookup failure
        return FALLBACK;
    }
}
