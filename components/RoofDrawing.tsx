import React from 'react';
import type { Building } from '../types';

interface RoofDrawingProps {
  address: string;
  building?: Building;
  width?: number;
  height?: number;
}

export const RoofDrawing: React.FC<RoofDrawingProps> = ({ address, building, width = 400, height = 500 }) => {
  const isMemorial = address.toLowerCase().includes('memorial');
  const isNephi = address.toLowerCase().includes('nephi');

  if (isNephi) {
    return (
      <div className="flex flex-col items-center justify-center font-sans w-full h-full">
        <svg viewBox="0 0 300 400" className="w-full h-auto max-w-[320px]">
          {/* Style configurations for blueprint */}
          <defs>
            <style>{`
              .roof-perimeter { fill: rgba(14, 165, 233, 0.08); stroke: #0284c7; stroke-width: 2.8; stroke-linejoin: round; }
            `}</style>
          </defs>

          {/* Facets */}
          {/* Facet 1 (Leftmost vertical column) */}
          <polygon points="20,20 100,20 100,380 20,380" className="roof-perimeter" />
          
          {/* Facet 2 (Middle column with gable valley cutouts) */}
          <polygon points="100,20 180,20 180,84 140,110 180,136 180,245 100,245" className="roof-perimeter" />
          
          {/* Facet 3 (Bottom-center block) */}
          <polygon points="100,245 160,245 160,380 100,380" className="roof-perimeter" />
          
          {/* Facet 4 (Upper Gable Triangle) */}
          <polygon points="140,110 280,20 280,110" className="roof-perimeter" />
          
          {/* Facet 5 (Lower Gable Triangle) */}
          <polygon points="140,110 280,110 280,200" className="roof-perimeter" />
          
          {/* Facet 6 (Lower-Right Block) */}
          <polygon points="180,136 280,200 280,220 260,220 260,245 180,245" className="roof-perimeter" />
        </svg>
      </div>
    );
  }

  if (!isMemorial) {
    if (building?.polygonVertices && building.polygonVertices.length >= 3) {
      const vertices = building.polygonVertices;
      let minLat = Infinity, maxLat = -Infinity;
      let minLng = Infinity, maxLng = -Infinity;
      
      vertices.forEach(v => {
        if (v.lat < minLat) minLat = v.lat;
        if (v.lat > maxLat) maxLat = v.lat;
        if (v.lng < minLng) minLng = v.lng;
        if (v.lng > maxLng) maxLng = v.lng;
      });

      const latRange = maxLat - minLat;
      const lngRange = maxLng - minLng;
      const maxRange = Math.max(latRange, lngRange) || 0.0001;

      const size = 200;
      const padding = 30;
      const drawSize = size - 2 * padding;

      const centerLat = (minLat + maxLat) / 2;
      const centerLng = (minLng + maxLng) / 2;
      const cosLat = Math.cos(centerLat * Math.PI / 180);

      const points = vertices.map(v => {
        const x = padding + drawSize / 2 + ((v.lng - centerLng) * cosLat / maxRange) * drawSize / 2;
        const y = padding + drawSize / 2 - ((v.lat - centerLat) / maxRange) * drawSize / 2;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      }).join(' ');

      return (
        <div className="flex flex-col items-center justify-center h-full font-sans">
          <svg viewBox="0 0 200 200" className="w-full h-auto max-w-[200px] stroke-cyan-500 fill-cyan-500/10 stroke-[2.5] stroke-linejoin-round">
            <polygon points={points} />
            <line x1="100" y1="30" x2="100" y2="170" strokeDasharray="3" />
          </svg>
          <p className="text-slate-600 text-sm mt-3 text-center">Interactive 3D Geometry Preview</p>
        </div>
      );
    }

    // Return a generic fallback drawing for other addresses (transparent background)
    return (
      <div className="flex flex-col items-center justify-center h-full font-sans">
        <svg viewBox="0 0 100 100" className="w-42 h-42 stroke-cyan-500 fill-cyan-500/10 stroke-[2]">
          <polygon points="10,80 50,15 90,80" />
          <line x1="50" y1="15" x2="50" y2="80" strokeDasharray="3" />
        </svg>
        <p className="text-slate-600 text-sm mt-3 text-center">Interactive 3D Geometry Preview</p>
      </div>
    );
  }

  // Exact blueprint drawing of 9875 Memorial Drive (clean transparent background for PDF report compatibility)
  return (
    <div className="flex flex-col items-center justify-center font-sans w-full h-full">
      <svg viewBox="0 0 480 580" className="w-full h-auto max-w-[320px]" style={{ transform: 'rotate(90deg)' }}>
        {/* Style configurations for blueprint */}
        <defs>
          <style>{`
            .roof-perimeter { fill: rgba(14, 165, 233, 0.08); stroke: #0284c7; stroke-width: 3.5; stroke-linejoin: round; }
            .roof-internal { stroke: #0284c7; stroke-width: 2.2; stroke-linejoin: round; }
            .roof-rake { stroke: #e11d48; stroke-width: 2.2; }
            .roof-valley { stroke: #10b981; stroke-width: 3.0; }
            .roof-ridge { stroke: #ec028b; stroke-width: 3.5; }
            .roof-dashed { stroke: #64748b; stroke-width: 1.8; stroke-dasharray: 4; }
            .facet-text { font-family: 'Rubik', sans-serif; font-size: 16px; font-weight: bold; fill: #0f172a; text-anchor: middle; dominant-baseline: middle; transform: rotate(-90deg); }
          `}</style>
        </defs>

        {/* 1. Main Outlines (Filled Facets) */}
        {/* Facet 315 (Top Center) */}
        <polygon points="100,50 310,50 310,160 200,160 200,210 100,210" className="roof-perimeter" />
        {/* Facet 32 (Top-Left Gable) */}
        <polygon points="100,210 150,210 100,260" className="roof-perimeter" />
        {/* Facet 278 (Left Vertical Slope) */}
        <polygon points="100,260 150,210 150,335 200,335 200,420 100,420" className="roof-perimeter" />
        {/* Facet 271 (Bottom-Left Slope) */}
        <polygon points="70,420 170,420 170,520 70,520" className="roof-perimeter" />
        {/* Facet 169 (Bottom-most Entrance) */}
        <polygon points="70,520 170,520 170,550 70,550" className="roof-perimeter" />
        {/* Facet 95 (Middle-Right Gable) */}
        <polygon points="200,160 310,160 310,210 200,210" className="roof-perimeter" />
        {/* Facet 241 (Top-Right Slope) */}
        <polygon points="310,50 420,50 420,180 310,180" className="roof-perimeter" />
        {/* Facet 1059 (Right Main Slope) */}
        <polygon points="200,210 310,210 310,180 420,180 420,440 250,440 250,370 200,370" className="roof-perimeter" />

        {/* 2. Internal Ridges, Hips, and Valleys */}
        {/* Main Ridge Y=210 */}
        <line x1="200" y1="210" x2="310" y2="210" className="roof-ridge" />
        {/* Gable Valleys meeting in the middle */}
        <line x1="100" y1="260" x2="150" y2="210" className="roof-valley" />
        {/* Valley from 150,210 to 200,210 */}
        <line x1="150" y1="210" x2="200" y2="210" className="roof-valley" />
        {/* Top edge internal division */}
        <line x1="310" y1="50" x2="310" y2="160" className="roof-internal" />
        {/* Gable internal lines */}
        <line x1="200" y1="160" x2="310" y2="160" className="roof-internal" />
        
        {/* Dashed Chimney projection on top-left */}
        <rect x="75" y="100" width="25" height="40" className="roof-dashed" />

        {/* 3. Text Annotations (Rotated -90 degrees locally to cancel SVG rotation) */}
        {/* Coordinates match the centroid of each facet */}
        <text x="210" y="110" className="facet-text" transform="rotate(-90, 210, 110)">315</text>
        <text x="120" y="225" className="facet-text" transform="rotate(-90, 120, 225)">32</text>
        <text x="260" y="185" className="facet-text" transform="rotate(-90, 260, 185)">95</text>
        <text x="150" y="325" className="facet-text" transform="rotate(-90, 150, 325)">278</text>
        <text x="365" y="115" className="facet-text" transform="rotate(-90, 365, 115)">241</text>
        <text x="310" y="320" className="facet-text" transform="rotate(-90, 310, 320)">1,059</text>
        <text x="120" y="470" className="facet-text" transform="rotate(-90, 120, 470)">271</text>
        <text x="120" y="535" className="facet-text" transform="rotate(-90, 120, 535)">169</text>

        {/* Compass N Arrow in the corner */}
        <g transform="translate(430, 520) rotate(-90)">
          <circle cx="0" cy="0" r="18" fill="none" stroke="#64748b" strokeWidth="1.2" />
          <line x1="0" y1="15" x2="0" y2="-15" stroke="#ec028b" strokeWidth="1.5" />
          <line x1="-5" y1="-8" x2="0" y2="-15" stroke="#ec028b" strokeWidth="1.5" />
          <line x1="5" y1="-8" x2="0" y2="-15" stroke="#ec028b" strokeWidth="1.5" />
          <text x="0" y="-22" className="facet-text" style={{ fontSize: '10px', fill: '#ec028b' }} transform="rotate(90, 0, -22)">N</text>
        </g>
      </svg>
    </div>
  );
};
