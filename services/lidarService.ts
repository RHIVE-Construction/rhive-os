/**
 * lidarService.ts — Client for the RHIVE LiDAR Analyzer Firebase Function.
 *
 * Calls the analyzeLidar Cloud Function which:
 *   1. Checks Firebase Storage cache (~100ms if cached)
 *   2. Downloads USGS 3DEP LiDAR from AWS S3 (free)
 *   3. Runs RANSAC plane fitting + edge classification
 *   4. Returns facet count, pitch, and edge type flags
 *
 * On timeout or error, returns null so the caller falls back to
 * the Phase 1 Solar-API-only tier model.
 */

// ── Types ──────────────────────────────────────────────────────────────────

export interface LidarResult {
  /** Number of distinct roof facets detected by RANSAC */
  facetCount: number;
  /** Dominant pitch as a string, e.g. "6/12" */
  dominantPitch: string;
  /** True if diagonal hip edges detected */
  hasHips: boolean;
  /** True if horizontal ridge edges detected */
  hasRidges: boolean;
  /** True if concave valley edges detected */
  hasValleys: boolean;
  /** True if open rake (gable end) edges detected */
  hasRakes: boolean;
  /** Recommended Phase 1 tier based on LiDAR geometry */
  suggestedTier:
    | 'complex_hip'
    | 'cross_gable_hip'
    | 'moderate_hip'
    | 'simple'
    | 'pyramid_hip';
  /** Confidence based on point count and plane quality */
  confidence: 'high' | 'medium' | 'low';
  /** Total roof area from LiDAR in m² */
  totalRoofAreaM2?: number;
  /** Per-pitch area breakdown */
  pitchBreakdown?: Array<{ pitch: number; areaSqFt: number }>;
  /** USGS dataset name used */
  dataset?: string;
  /** QL1/QL2/QL3 quality level */
  qualityLevel?: string;
  /** ISO timestamp of when this was analyzed */
  cachedAt?: string;
  /** True if returned from Firebase Storage cache */
  fromCache?: boolean;
  /** Number of building LiDAR points found */
  pointCount?: number;
  /** Error code if processing failed */
  error?: string;
}

// ── Config ─────────────────────────────────────────────────────────────────

const FUNCTION_URL =
  'https://analyzelidar-fisdwx35uq-uc.a.run.app';

/** Maximum ms to wait for the LiDAR function before falling back to Phase 1 */
const TIMEOUT_MS = 20_000;

// ── Main export ────────────────────────────────────────────────────────────

/**
 * Analyze the LiDAR point cloud for a given lat/lng coordinate.
 *
 * Returns LidarResult on success, or null if:
 *   - No USGS coverage for the location
 *   - Function timed out (>20s)
 *   - Network error
 *
 * The caller should always fall back gracefully to the Phase 1 tier model
 * when null is returned.
 *
 * @example
 * const lidar = await analyzeLidar(40.8683, -111.8759);
 * if (lidar) {
 *   console.log(`Facets: ${lidar.facetCount}, Tier: ${lidar.suggestedTier}`);
 * }
 */
export async function analyzeLidar(
  lat: number,
  lng: number,
): Promise<LidarResult | null> {
  if (!lat || !lng) return null;

  try {
    const url = `${FUNCTION_URL}?lat=${lat.toFixed(6)}&lng=${lng.toFixed(6)}`;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timer);

    if (!res.ok) {
      console.warn(
        `[LiDAR] Function returned ${res.status} for (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
      );
      return null;
    }

    const data: LidarResult = await res.json();

    // Log result summary
    if (data.error) {
      console.warn(`[LiDAR] ${data.error}:`, data);
      return null;
    }

    console.info(
      `[LiDAR] ✓ ${data.facetCount} facets, ${data.dominantPitch}, ` +
        `tier=${data.suggestedTier}, ${data.fromCache ? 'CACHED' : 'FRESH'} ` +
        `(${data.qualityLevel ?? 'unknown'})`,
    );

    return data;
  } catch (err: unknown) {
    if (err instanceof Error && err.name === 'AbortError') {
      console.warn(`[LiDAR] Timeout after ${TIMEOUT_MS}ms — falling back to Phase 1`);
    } else {
      console.warn(`[LiDAR] Network error — falling back to Phase 1`, err);
    }
    return null;
  }
}

/**
 * Converts a LidarResult's suggestedTier to the numeric pitch number
 * for display in the UI, if the LiDAR pitch string is in "N/12" format.
 */
export function parseLidarPitch(dominantPitch: string): number | null {
  const match = dominantPitch.match(/^(\d+)\/12$/);
  if (!match) return null;
  return parseInt(match[1], 10);
}
