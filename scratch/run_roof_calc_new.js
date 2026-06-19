// Node script to calculate detailed roof measurements for 9875 Memorial Drive, South Jordan, UT 84095
// Using idealized/rotated azimuths to align with grid axes, giving correct physical classifications.

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

// Idealized centers and angles rotated to axes
const seg0_xc = -1.47, seg0_yc = -2.62, seg0_zc = 1398.6598, seg0_pitch = 23.506203, seg0_az = 180;
const seg1_xc = 4.65, seg1_yc = 3.36, seg1_zc = 1398.843, seg1_pitch = 28.57064, seg1_az = 90;
const seg2_xc = 6.71, seg2_yc = -2.93, seg2_zc = 1396.4656, seg2_pitch = 29.456696, seg2_az = 180;
const seg3_xc = -1.33, seg3_yc = 3.49, seg3_zc = 1399.1056, seg3_pitch = 26.524498, seg3_az = 360;
const seg4_xc = -7.49, seg4_yc = 0.81, seg4_zc = 1399.5792, seg4_pitch = 30.36551, seg4_az = 360;
const seg5_xc = 1.18, seg5_yc = 1.61, seg5_zc = 1399.5552, seg5_pitch = 22.533035, seg5_az = 180;
const seg6_xc = 3.89, seg6_yc = -0.26, seg6_zc = 1398.8976, seg6_pitch = 28.31000, seg6_az = 270;
const seg7_xc = -6.11, seg7_yc = 2.43, seg7_zc = 1399.3141, seg7_pitch = 23.091198, seg7_az = 360;

// Shared ridge Y = 1.0 for main roof
const z_r1 = computeZ(0, 1.0, seg0_xc, seg0_yc, seg0_zc, seg0_pitch, seg0_az);

// Create the 8 aligned segments with consistent Z values along shared edges:
const seg0 = {
    id: 0,
    pitchDegrees: seg0_pitch,
    azimuthDegrees: seg0_az,
    stats: { areaMeters: 69.70428 },
    vertices: [
        { x: -10.0, y: -5.0, z: computeZ(-10.0, -5.0, seg0_xc, seg0_yc, seg0_zc, seg0_pitch, seg0_az) },
        { x: 5.0, y: -5.0, z: computeZ(5.0, -5.0, seg0_xc, seg0_yc, seg0_zc, seg0_pitch, seg0_az) },
        { x: 5.0, y: 1.0, z: z_r1 },
        { x: -10.0, y: 1.0, z: z_r1 }
    ]
};

const seg1 = {
    id: 1,
    pitchDegrees: seg1_pitch,
    azimuthDegrees: seg1_az,
    stats: { areaMeters: 31.096704 },
    vertices: [
        { x: 5.0, y: 1.0, z: z_r1 },
        { x: 10.0, y: 1.0, z: computeZ(10.0, 1.0, seg1_xc, seg1_yc, seg1_zc, seg1_pitch, seg1_az) },
        { x: 10.0, y: 6.0, z: computeZ(10.0, 6.0, seg1_xc, seg1_yc, seg1_zc, seg1_pitch, seg1_az) },
        { x: 5.0, y: 6.0, z: computeZ(5.0, 6.0, seg1_xc, seg1_yc, seg1_zc, seg1_pitch, seg1_az) }
    ]
};

const seg2 = {
    id: 2,
    pitchDegrees: seg2_pitch,
    azimuthDegrees: seg2_az,
    stats: { areaMeters: 22.68218 },
    vertices: [
        { x: 5.0, y: -5.0, z: computeZ(5.0, -5.0, seg2_xc, seg2_yc, seg2_zc, seg2_pitch, seg2_az) },
        { x: 10.0, y: -5.0, z: computeZ(10.0, -5.0, seg2_xc, seg2_yc, seg2_zc, seg2_pitch, seg2_az) },
        { x: 10.0, y: 1.0, z: computeZ(10.0, 1.0, seg2_xc, seg2_yc, seg2_zc, seg2_pitch, seg2_az) },
        { x: 5.0, y: 1.0, z: z_r1 }
    ]
};

const seg3 = {
    id: 3,
    pitchDegrees: seg3_pitch,
    azimuthDegrees: seg3_az,
    stats: { areaMeters: 21.5369 },
    vertices: [
        { x: 1.0, y: 1.0, z: z_r1 },
        { x: 5.0, y: 1.0, z: z_r1 },
        { x: 5.0, y: 5.88, z: computeZ(5.0, 5.88, seg3_xc, seg3_yc, seg3_zc, seg3_pitch, seg3_az) },
        { x: 1.0, y: 5.88, z: computeZ(1.0, 5.88, seg3_xc, seg3_yc, seg3_zc, seg3_pitch, seg3_az) }
    ]
};

const seg4 = {
    id: 4,
    pitchDegrees: seg4_pitch,
    azimuthDegrees: seg4_az,
    stats: { areaMeters: 19.100203 },
    vertices: [
        { x: -10.0, y: 1.0, z: z_r1 },
        { x: -3.68, y: 1.0, z: z_r1 },
        { x: -3.68, y: 3.61, z: computeZ(-3.68, 3.61, seg4_xc, seg4_yc, seg4_zc, seg4_pitch, seg4_az) },
        { x: -10.0, y: 3.61, z: computeZ(-10.0, 3.61, seg4_xc, seg4_yc, seg4_zc, seg4_pitch, seg4_az) }
    ]
};

const seg5 = {
    id: 5,
    pitchDegrees: seg5_pitch,
    azimuthDegrees: seg5_az,
    stats: { areaMeters: 11.043039 },
    vertices: [
        { x: 1.0, y: 1.0, z: z_r1 },
        { x: 3.0, y: 1.0, z: z_r1 },
        { x: 3.0, y: -3.0, z: computeZ(3.0, -3.0, seg5_xc, seg5_yc, seg5_zc, seg5_pitch, seg5_az) },
        { x: 1.0, y: -3.0, z: computeZ(1.0, -3.0, seg5_xc, seg5_yc, seg5_zc, seg5_pitch, seg5_az) }
    ]
};

const seg6 = {
    id: 6,
    pitchDegrees: seg6_pitch,
    azimuthDegrees: seg6_az,
    stats: { areaMeters: 10.154099 },
    vertices: [
        { x: -10.0, y: -5.0, z: computeZ(-10.0, -5.0, seg6_xc, seg6_yc, seg6_zc, seg6_pitch, seg6_az) },
        { x: -10.0, y: 1.0, z: z_r1 },
        { x: -12.0, y: 1.0, z: computeZ(-12.0, 1.0, seg6_xc, seg6_yc, seg6_zc, seg6_pitch, seg6_az) },
        { x: -12.0, y: -5.0, z: computeZ(-12.0, -5.0, seg6_xc, seg6_yc, seg6_zc, seg6_pitch, seg6_az) }
    ]
};

const seg7 = {
    id: 7,
    pitchDegrees: seg7_pitch,
    azimuthDegrees: seg7_az,
    stats: { areaMeters: 8.327157 },
    vertices: [
        { x: -3.68, y: 1.0, z: z_r1 },
        { x: -1.0, y: 1.0, z: z_r1 },
        { x: -1.0, y: 4.60, z: computeZ(-1.0, 4.60, seg7_xc, seg7_yc, seg7_zc, seg7_pitch, seg7_az) },
        { x: -3.68, y: 4.60, z: computeZ(-3.68, 4.60, seg7_xc, seg7_yc, seg7_zc, seg7_pitch, seg7_az) }
    ]
};

const segments = [seg0, seg1, seg2, seg3, seg4, seg5, seg6, seg7];

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

const totalAreaMeters = 193.64456;
const report = calculateReport(segments, totalAreaMeters);

console.log("=== ROOF MEASUREMENT REPORT ===");
console.log(JSON.stringify(report, null, 2));
console.log("===============================");
