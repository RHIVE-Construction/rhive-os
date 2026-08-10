/**
 * solarService.ts — Google Solar API client for RHIVE OS.
 *
 * Calls the REAL Google Solar API (buildingInsights:findClosest).
 * Uses VITE_GOOGLE_MAPS_API_KEY — Solar API access confirmed active on rhive-os project.
 *
 * API docs:
 * https://developers.google.com/maps/documentation/solar/reference/rest/v1/buildingInsights/findClosest
 *
 * Key normalization note:
 *   Real Solar API returns areaMeters2 (square meters, field name has "2").
 *   Our internal SolarApiData type uses areaMeters.
 *   normalizeSolarResponse() bridges this automatically.
 */

import type { SolarApiData, RoofSegment } from '../types';

const SOLAR_ENDPOINT =
  'https://solar.googleapis.com/v1/buildingInsights:findClosest';

// ── Main export ────────────────────────────────────────────────────────────

/**
 * Fetch real roof segment data from Google Solar API for a given location.
 *
 * Returns pitch, azimuth, and area per roof facet — measured from satellite.
 * Automatically retries with LOW quality if HIGH quality imagery is unavailable.
 *
 * @param lat - Property latitude
 * @param lng - Property longitude
 * @throws Error if the API key is missing or Solar API returns an error
 *
 * @example
 * const data = await getRoofData(40.8683, -111.8759);
 * // data.solarPotential.roofSegmentStats[0].pitchDegrees → 18.74
 * // data.solarPotential.roofSegmentStats[0].azimuthDegrees → 3.85
 * // data.solarPotential.wholeRoofStats.areaMeters → 121.22
 */
export async function getRoofData(lat: number, lng: number): Promise<SolarApiData> {
  const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;
  if (!key) {
    throw new Error(
      'VITE_GOOGLE_MAPS_API_KEY is not set. Add it to your .env file.',
    );
  }

  // First attempt: HIGH quality (best accuracy)
  const res = await fetch(buildUrl(lat, lng, 'HIGH', key));

  if (res.ok) {
    return normalizeSolarResponse(await res.json());
  }

  // 404 = HIGH quality imagery not available for this location → try LOW
  if (res.status === 404) {
    console.warn(
      `[SolarAPI] HIGH quality not available at (${lat.toFixed(4)}, ${lng.toFixed(4)}) — retrying with LOW`,
    );
    const fallback = await fetch(buildUrl(lat, lng, 'LOW', key));
    if (fallback.ok) {
      return normalizeSolarResponse(await fallback.json());
    }
    const errText = await fallback.text();
    throw new Error(`Solar API error ${fallback.status} (LOW quality): ${errText}`);
  }

  // Any other HTTP error
  const errText = await res.text();
  throw new Error(`Solar API error ${res.status}: ${errText}`);
}

// ── Helpers ────────────────────────────────────────────────────────────────

function buildUrl(
  lat: number,
  lng: number,
  quality: 'HIGH' | 'LOW',
  key: string,
): string {
  return (
    `${SOLAR_ENDPOINT}` +
    `?location.latitude=${lat}` +
    `&location.longitude=${lng}` +
    `&requiredQuality=${quality}` +
    `&key=${key}`
  );
}

/**
 * Normalize the raw Google Solar API response to match our internal SolarApiData type.
 *
 * Differences between real API and our internal type:
 *   - Real API: stats.areaMeters2  →  Internal: stats.areaMeters
 *   - Real API: wholeRoofStats.areaMeters2  →  Internal: wholeRoofStats.areaMeters
 *   - Real API: no vertex geometry  →  Internal: vertices set to [] (roofCalculator handles gracefully)
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeSolarResponse(raw: any): SolarApiData {
  const sp = raw?.solarPotential;
  if (!sp) {
    throw new Error(
      'Solar API response is missing the solarPotential field. ' +
      'The address may not be covered by Google Solar imagery.',
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const segments: RoofSegment[] = (sp.roofSegmentStats ?? []).map((seg: any) => ({
    pitchDegrees:   seg.pitchDegrees   ?? 0,
    azimuthDegrees: seg.azimuthDegrees ?? 0,
    stats: {
      // Real API uses areaMeters2; fall back to areaMeters for forward-compat
      areaMeters: seg.stats?.areaMeters2 ?? seg.stats?.areaMeters ?? 0,
    },
    // Real Solar API does not provide vertex geometry.
    // roofCalculator.ts already guards with `if (!segment.vertices) return;`
    // so linear measurements (ridges/hips/valleys) will be 0 — area and pitch are accurate.
    vertices: [],
  }));

  return {
    solarPotential: {
      wholeRoofStats: {
        areaMeters:
          sp.wholeRoofStats?.areaMeters2 ??
          sp.wholeRoofStats?.areaMeters ??
          0,
      },
      roofSegmentStats: segments,
    },
  };
}