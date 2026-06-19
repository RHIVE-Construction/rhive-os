// Node script to calculate detailed roof measurements for 3584 South 500 East, South Salt Lake, UT 84115
// Using idealized azimuths (0 and 180 degrees) to get correct physical classifications (eaves, ridges, rakes).

// Constants from the codebase
const SQ_METERS_TO_SQ_FEET = 10.7639104;
const SQ_FEET_PER_SQUARE = 100;
const WASTE_FACTOR_PERCENT = 10;
const BUNDLES_PER_SQUARE = 3;
const STARTER_LINEAR_FEET_PER_BUNDLE = 100;
const RIDGE_CAP_LINEAR_FEET_PER_BUNDLE = 30;
const ICE_WATER_SQ_FEET_PER_ROLL = 225;
const UNDERLAYMENT_SQ_FEET_PER_ROLL = 1000;
const DRIP_EDGE_FEET_PER_PIECE = 10;
const METERS_TO_FEET = 3.28084;

// Helper functions for vector math
function calculateDistance(p1, p2) {
  return Math.sqrt(
    Math.pow(p2.x - p1.x, 2) +
    Math.pow(p2.y - p1.y, 2) +
    Math.pow(p2.z - p1.z, 2)
  );
}

function getEdgeKey(p1, p2) {
  const p1Str = `${p1.x.toFixed(3)},${p1.y.toFixed(3)},${p1.z.toFixed(3)}`;
  const p2Str = `${p2.x.toFixed(3)},${p2.y.toFixed(3)},${p2.z.toFixed(3)}`;
  return p1Str < p2Str ? `${p1Str}|${p2Str}` : `${p2Str}|${p1Str}`;
}

function getCentroid(vertices) {
  if (vertices.length === 0) return { x: 0, y: 0, z: 0 };
  const sum = vertices.reduce((acc, v) => ({ x: acc.x + v.x, y: acc.y + v.y, z: acc.z + v.z }), { x: 0, y: 0, z: 0 });
  return {
    x: sum.x / Math.max(1, vertices.length),
    y: sum.y / Math.max(1, vertices.length),
    z: sum.z / Math.max(1, vertices.length),
  };
}

function getNormal(pitch, azimuth) {
    const pitchRad = pitch * Math.PI / 180;
    const mathAzimuthRad = (450 - azimuth) % 360 * Math.PI / 180;

    const nx = Math.sin(pitchRad) * Math.cos(mathAzimuthRad);
    const ny = Math.sin(pitchRad) * Math.sin(mathAzimuthRad);
    const nz = Math.cos(pitchRad);

    return { x: nx, y: ny, z: nz };
}

// Equation of plane: z = zc - tan(pitch) * ((x - xc) * sin(azimuth) + (y - yc) * cos(azimuth))
function computeZ(x, y, xc, yc, zc, pitch, azimuth) {
    const pitchRad = pitch * Math.PI / 180;
    const azimuthRad = azimuth * Math.PI / 180;
    const dx = x - xc;
    const dy = y - yc;
    const dist = dx * Math.sin(azimuthRad) + dy * Math.cos(azimuthRad);
    return zc - Math.tan(pitchRad) * dist;
}

// Idealized values
const seg0_xc = 0.92, seg0_yc = -1.99, seg0_zc = 1305.9388, seg0_pitch = 36.957527, seg0_az = 180;
const seg1_xc = 1.88, seg1_yc = 2.12, seg1_zc = 1305.771, seg1_pitch = 36.315845, seg1_az = 360;
const seg2_xc = -3.41, seg2_yc = 2.07, seg2_zc = 1305.847, seg2_pitch = 36.890903, seg2_az = 360;
const seg3_xc = -4.58, seg3_yc = -0.94, seg3_zc = 1305.7244, seg3_pitch = 37.71766, seg3_az = 180;

// Shared ridge Y = 0.16
const z_r1 = computeZ(0.92, 0.16, seg0_xc, seg0_yc, seg0_zc, seg0_pitch, seg0_az); // Ridge Z for main
const z_r2 = computeZ(-3.41, 0.16, seg2_xc, seg2_yc, seg2_zc, seg2_pitch, seg2_az); // Ridge Z for west wing

const seg0 = {
    id: 0,
    pitchDegrees: seg0_pitch,
    azimuthDegrees: seg0_az,
    stats: { areaMeters: 44.864014 },
    vertices: [
        { x: -1.69, y: -4.39, z: computeZ(-1.69, -4.39, seg0_xc, seg0_yc, seg0_zc, seg0_pitch, seg0_az) },
        { x: 5.38, y: -4.39, z: computeZ(5.38, -4.39, seg0_xc, seg0_yc, seg0_zc, seg0_pitch, seg0_az) },
        { x: 5.38, y: 0.16, z: z_r1 },
        { x: -1.69, y: 0.16, z: z_r1 }
    ]
};

const seg1 = {
    id: 1,
    pitchDegrees: seg1_pitch,
    azimuthDegrees: seg1_az,
    stats: { areaMeters: 32.950073 },
    vertices: [
        { x: -1.69, y: 0.16, z: z_r1 },
        { x: 5.38, y: 0.16, z: z_r1 },
        { x: 5.38, y: 4.21, z: computeZ(5.38, 4.21, seg1_xc, seg1_yc, seg1_zc, seg1_pitch, seg1_az) },
        { x: -1.69, y: 4.21, z: computeZ(-1.69, 4.21, seg1_xc, seg1_yc, seg1_zc, seg1_pitch, seg1_az) }
    ]
};

const seg2 = {
    id: 2,
    pitchDegrees: seg2_pitch,
    azimuthDegrees: seg2_az,
    stats: { areaMeters: 15.81685 },
    vertices: [
        { x: -5.64, y: 0.16, z: z_r2 },
        { x: -1.69, y: 0.16, z: z_r2 },
        { x: -1.69, y: 4.13, z: computeZ(-1.69, 4.13, seg2_xc, seg2_yc, seg2_zc, seg2_pitch, seg2_az) },
        { x: -5.64, y: 4.13, z: computeZ(-5.64, 4.13, seg2_xc, seg2_yc, seg2_zc, seg2_pitch, seg2_az) }
    ]
};

const seg3 = {
    id: 3,
    pitchDegrees: seg3_pitch,
    azimuthDegrees: seg3_az,
    stats: { areaMeters: 8.950299 },
    vertices: [
        { x: -5.64, y: -2.91, z: computeZ(-5.64, -2.91, seg3_xc, seg3_yc, seg3_zc, seg3_pitch, seg3_az) },
        { x: -1.69, y: -2.91, z: computeZ(-1.69, -2.91, seg3_xc, seg3_yc, seg3_zc, seg3_pitch, seg3_az) },
        { x: -1.69, y: 0.16, z: z_r2 },
        { x: -5.64, y: 0.16, z: z_r2 }
    ]
};

const segments = [seg0, seg1, seg2, seg3];

// Run calculation report
function calculateReport(roofSegmentStats, totalAreaMeters) {
  const totalAreaSqFt = totalAreaMeters * SQ_METERS_TO_SQ_FEET;
  const totalSquares = totalAreaSqFt / SQ_FEET_PER_SQUARE;
  const totalSquaresWithWaste = totalSquares * (1 + WASTE_FACTOR_PERCENT / 100);

  // Dominant Pitch
  const pitchMap = {};
  roofSegmentStats.forEach(segment => {
    const pitchIn12 = Math.round(12 * Math.tan(segment.pitchDegrees * Math.PI / 180));
    const pitchKey = `${Math.max(1, pitchIn12)}`;
    pitchMap[pitchKey] = (pitchMap[pitchKey] || 0) + segment.stats.areaMeters;
  });

  const dominantPitchKey = Object.keys(pitchMap).length > 0
    ? Object.entries(pitchMap).sort((a, b) => b[1] - a[1])[0][0]
    : '0';
  
  const pitchAnalysis = Object.entries(pitchMap).map(([pitch, areaMeters]) => ({
    pitch: Number(pitch),
    areaSqFt: areaMeters * SQ_METERS_TO_SQ_FEET,
  })).sort((a, b) => b.areaSqFt - a.areaSqFt);

  // Linear Measurements
  const normals = roofSegmentStats.map(seg => getNormal(seg.pitchDegrees, seg.azimuthDegrees));
  const centroids = roofSegmentStats.map(seg => getCentroid(seg.vertices));

  const edgesMap = new Map();
  roofSegmentStats.forEach((segment, segmentId) => {
    for (let i = 0; i < segment.vertices.length; i++) {
      const p1 = segment.vertices[i];
      const p2 = segment.vertices[(i + 1) % segment.vertices.length];
      const key = getEdgeKey(p1, p2);
      const edge = {
        p1,
        p2,
        length: calculateDistance(p1, p2) * METERS_TO_FEET,
        segmentId,
      };
      if (!edgesMap.has(key)) {
        edgesMap.set(key, []);
      }
      edgesMap.get(key).push(edge);
    }
  });

  const linearMeasurements = { ridges: 0, hips: 0, valleys: 0, eaves: 0, rakes: 0 };
  const classificationThreshold = 0.1;

  edgesMap.forEach((edges, key) => {
    const edge = edges[0];
    const isHorizontal = Math.abs(edge.p1.z - edge.p2.z) < classificationThreshold;

    if (edges.length === 1) { // External edge
      if (isHorizontal) {
        linearMeasurements.eaves += edge.length;
      } else {
        linearMeasurements.rakes += edge.length;
      }
    } else if (edges.length === 2) { // Shared edge
      const segInfo1 = { normal: normals[edges[0].segmentId], centroid: centroids[edges[0].segmentId] };
      const segInfo2 = { normal: normals[edges[1].segmentId] };

      const vecToCentroid1 = {
          x: segInfo1.centroid.x - edge.p1.x,
          y: segInfo1.centroid.y - edge.p1.y,
          z: segInfo1.centroid.z - edge.p1.z,
      };

      const dotProduct = (segInfo2.normal.x * vecToCentroid1.x) +
                         (segInfo2.normal.y * vecToCentroid1.y) +
                         (segInfo2.normal.z * vecToCentroid1.z);

      if (dotProduct < -classificationThreshold) { // Convex
          if (isHorizontal) {
              linearMeasurements.ridges += edge.length;
          } else {
              linearMeasurements.hips += edge.length;
          }
      } else if (dotProduct > classificationThreshold) { // Concave
          linearMeasurements.valleys += edge.length;
      }
    }
  });

  // Calculate Material List
  const materialList = {
    shingleBundles: Math.ceil(totalSquaresWithWaste * BUNDLES_PER_SQUARE),
    starterShingles: Math.ceil((linearMeasurements.eaves + linearMeasurements.rakes) / STARTER_LINEAR_FEET_PER_BUNDLE),
    ridgeCapShingles: Math.ceil((linearMeasurements.ridges + linearMeasurements.hips) / RIDGE_CAP_LINEAR_FEET_PER_BUNDLE),
    iceAndWaterShield: Math.ceil((linearMeasurements.eaves * 3) / ICE_WATER_SQ_FEET_PER_ROLL),
    underlaymentRolls: Math.ceil(totalAreaSqFt / UNDERLAYMENT_SQ_FEET_PER_ROLL),
    dripEdge: Math.ceil((linearMeasurements.eaves + linearMeasurements.rakes) / DRIP_EDGE_FEET_PER_PIECE),
  };

  return {
    totalAreaSqFt: Math.round(totalAreaSqFt),
    totalSquares,
    wasteFactor: WASTE_FACTOR_PERCENT,
    totalSquaresWithWaste,
    dominantPitch: Number(dominantPitchKey),
    linearMeasurements,
    materialList,
    pitchAnalysis,
  };
}

const totalAreaMeters = 102.58124;
const report = calculateReport(segments, totalAreaMeters);

console.log("=== ROOF MEASUREMENT REPORT ===");
console.log(JSON.stringify(report, null, 2));
console.log("===============================");
