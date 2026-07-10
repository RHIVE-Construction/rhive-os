
import React, { useRef, useState, useEffect } from 'react';
import type { Place, BuildingData, SurveyState, CalculationResult, Building, RoofFacet } from '../types';
import { Button } from './ui/button';
import { formatCurrency } from '../lib/utils';
import { WeatherReport } from './WeatherReport';
import { RhiveLogoBlack } from './icons';
import { RoofDrawing } from './RoofDrawing';
import { getMapsApiKey } from '../lib/mapsConfig';
import { calculateEstimate } from '../lib/calculations';
import { usePricing } from '../contexts/PricingContext';
import { SQ_FEET_PER_SQUARE, SQ_METERS_TO_SQ_FEET } from '../lib/constants';

function formatLength(feet: number): string {
    const wholeFeet = Math.floor(feet);
    const inches = Math.round((feet - wholeFeet) * 12);
    if (inches === 12) {
        return `${wholeFeet + 1}ft 0in`;
    }
    return `${wholeFeet}ft ${inches}in`;
}

declare global {
  interface Window {
    jspdf: any;
    html2canvas: any;
  }
}

interface EstimateReportProps {
  place: Place;
  buildingData: BuildingData;
  surveyState: SurveyState;
  calcResult: CalculationResult;
}

const ReportPage: React.FC<{ children: React.ReactNode, pageNumber?: number, totalPages?: number }> = ({ children, pageNumber, totalPages }) => (
    <div className="bg-white p-[0.75in] w-[8.5in] min-h-[11in] flex flex-col font-serif text-gray-800 shadow-lg break-after-page">
        {children}
        {pageNumber && totalPages && (
            <footer className="mt-auto pt-3 border-t text-center text-base text-gray-500 font-sans">
                Page {pageNumber} of {totalPages} | **Precision Fuels Performance.** This is an *instant estimate* based on AI-powered analysis. A final price requires a *certified on-site inspection*. <br/>
                &copy; {new Date().getFullYear()} RHIVE Construction. Finish On Top! 🐝
            </footer>
        )}
    </div>
);

const ReportHeader: React.FC<{ place: Place, title: string, subtitle: string }> = ({ place, title, subtitle }) => (
    <header className="flex justify-between items-start pb-2 border-b-2 border-pink-500/80">
        <RhiveLogoBlack className="h-12 w-auto" />
        <div className="text-right">
            <h1 className="font-sans font-bold text-2xl text-[#ec028b]">{title}</h1>
            <p className="text-base">{place.address}</p>
            <p className="text-base">{subtitle}</p>
        </div>
    </header>
);

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h2 className="font-sans font-bold text-xl text-black mt-6 mb-4 pb-1 border-b-2 border-gray-200">{children}</h2>
);

const DetailItem: React.FC<{ label: string, value: React.ReactNode, isTotal?: boolean, isSubtotal?: boolean }> = ({ label, value, isTotal, isSubtotal }) => (
     <div className={`flex justify-between py-2 border-b border-gray-200 ${isSubtotal ? 'font-serif font-bold text-black' : ''} ${isTotal ? 'font-serif text-lg font-extrabold' : 'text-base'}`}>
        <span>{label}</span>
        <strong className={isTotal ? 'text-[#ec028b]' : ''}>{value}</strong>
    </div>
);


const BuildingDrawing: React.FC<{ building: Building }> = ({ building }) => {
    const numFacets = building.facets.length;
    
    if (building.polygonVertices && building.polygonVertices.length >= 3) {
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
            <div className="flex flex-col items-center justify-center w-full h-full p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <svg viewBox="0 0 200 200" className="w-full h-auto max-w-[200px] stroke-[#0284c7] fill-[rgba(14,165,233,0.08)] stroke-[2.5] stroke-linejoin-round">
                    <polygon points={points} />
                    <line x1="100" y1="30" x2="100" y2="170" stroke="#ec028b" strokeWidth="2.5" strokeDasharray="3" />
                </svg>
                <p className="text-slate-500 text-sm mt-3 text-center">{numFacets} Facets Diagram</p>
            </div>
        );
    }
    
    if (numFacets === 1) {
        // Simple shed roof: single rectangle
        const facet = building.facets[0];
        const areaSqFt = Math.round(facet.areaMeters * SQ_METERS_TO_SQ_FEET);
        return (
            <div className="flex flex-col items-center justify-center w-full h-full p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <svg viewBox="0 0 200 200" className="w-full h-auto max-w-[200px]">
                    <rect x="30" y="30" width="140" height="140" fill="rgba(14, 165, 233, 0.08)" stroke="#0284c7" strokeWidth="2.5" strokeLinejoin="round" />
                    <text x="100" y="100" className="font-sans font-bold text-lg fill-slate-800" textAnchor="middle" dominantBaseline="middle">{areaSqFt}</text>
                </svg>
                <p className="text-slate-500 text-sm mt-3 text-center">1 Facet Diagram (Shed)</p>
            </div>
        );
    } else if (numFacets === 2) {
        // Dual-slope roof: two rectangles side-by-side
        const f1 = building.facets[0];
        const f2 = building.facets[1];
        const a1 = Math.round(f1.areaMeters * SQ_METERS_TO_SQ_FEET);
        const a2 = Math.round(f2.areaMeters * SQ_METERS_TO_SQ_FEET);
        return (
            <div className="flex flex-col items-center justify-center w-full h-full p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <svg viewBox="0 0 200 200" className="w-full h-auto max-w-[200px]">
                    {/* Left slope */}
                    <rect x="20" y="30" width="80" height="140" fill="rgba(14, 165, 233, 0.08)" stroke="#0284c7" strokeWidth="2.5" strokeLinejoin="round" />
                    <text x="60" y="100" className="font-sans font-bold text-sm fill-slate-800" textAnchor="middle" dominantBaseline="middle">{a1}</text>
                    {/* Right slope */}
                    <rect x="100" y="30" width="80" height="140" fill="rgba(14, 165, 233, 0.08)" stroke="#0284c7" strokeWidth="2.5" strokeLinejoin="round" />
                    <text x="140" y="100" className="font-sans font-bold text-sm fill-slate-800" textAnchor="middle" dominantBaseline="middle">{a2}</text>
                    {/* Ridge line */}
                    <line x1="100" y1="30" x2="100" y2="170" stroke="#ec028b" strokeWidth="3" />
                </svg>
                <p className="text-slate-500 text-sm mt-3 text-center">2 Facets Diagram (Gable)</p>
            </div>
        );
    } else {
        // 4 or more facets: draw a main house shape with hips and ridge
        const totalAreaSqFt = Math.round(building.totalAreaMeters * SQ_METERS_TO_SQ_FEET);
        const avgFacetArea = Math.round(totalAreaSqFt / numFacets);
        return (
            <div className="flex flex-col items-center justify-center w-full h-full p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <svg viewBox="0 0 200 200" className="w-full h-auto max-w-[200px]">
                    {/* Main perimeter */}
                    <polygon points="20,40 180,40 180,160 20,160" fill="rgba(14, 165, 233, 0.05)" stroke="#0284c7" strokeWidth="2.5" strokeLinejoin="round" />
                    
                    {/* Hips and Ridges */}
                    <line x1="20" y1="40" x2="60" y2="100" stroke="#0284c7" strokeWidth="2" />
                    <line x1="20" y1="160" x2="60" y2="100" stroke="#0284c7" strokeWidth="2" />
                    <line x1="180" y1="40" x2="140" y2="100" stroke="#0284c7" strokeWidth="2" />
                    <line x1="180" y1="160" x2="140" y2="100" stroke="#0284c7" strokeWidth="2" />
                    <line x1="60" y1="100" x2="140" y2="100" stroke="#ec028b" strokeWidth="3" />

                    {/* Annotations */}
                    <text x="100" y="70" className="font-sans font-bold text-xs fill-slate-800" textAnchor="middle" dominantBaseline="middle">{avgFacetArea}</text>
                    <text x="100" y="130" className="font-sans font-bold text-xs fill-slate-800" textAnchor="middle" dominantBaseline="middle">{avgFacetArea}</text>
                    <text x="45" y="100" className="font-sans font-bold text-xs fill-slate-800" textAnchor="middle" dominantBaseline="middle">{avgFacetArea}</text>
                    <text x="155" y="100" className="font-sans font-bold text-xs fill-slate-800" textAnchor="middle" dominantBaseline="middle">{avgFacetArea}</text>
                </svg>
                <p className="text-slate-500 text-sm mt-3 text-center">{numFacets} Facets Diagram (Hip/Gable)</p>
            </div>
        );
    }
};

function getPolygonCenter(vertices: { lat: number; lng: number }[], defaultLat: number, defaultLng: number) {
  if (!vertices || vertices.length === 0) return { lat: defaultLat, lng: defaultLng };
  let sumLat = 0;
  let sumLng = 0;
  vertices.forEach(v => {
    sumLat += v.lat;
    sumLng += v.lng;
  });
  return {
    lat: sumLat / vertices.length,
    lng: sumLng / vertices.length
  };
}

const getStaticMapUrl = (
  building: Building,
  allBuildings: Building[],
  includedBuildingIds: string[],
  place: Place,
  mapsKey: string,
  isCombined?: boolean
) => {
  if (!mapsKey) return '';
  
  const paths: string[] = [];
  const markers: string[] = [];
  
  allBuildings.forEach((b, idx) => {
    // Render all buildings on the property for context
    // If isCombined is true, highlight all buildings in includedBuildingIds.
    // Otherwise, highlight only the current building.
    const isHighlighted = isCombined 
      ? includedBuildingIds.includes(b.id)
      : b.id === building.id;
    const vertices = b.polygonVertices || [];
    
    if (vertices.length >= 3) {
      const closedVertices = [...vertices, vertices[0]];
      const pathCoords = closedVertices.map(v => `${v.lat.toFixed(6)},${v.lng.toFixed(6)}`).join('|');
      const pathColor = isHighlighted ? '0xec028b' : '0x6b7280';
      const pathFill = isHighlighted ? '0xec028b25' : '0x6b728015';
      const pathWeight = isHighlighted ? '3' : '2';
      paths.push(`path=color:${pathColor}|weight:${pathWeight}|fillcolor:${pathFill}|${pathCoords}`);
    }
    
    const bldgCenter = getPolygonCenter(vertices, b.lat ?? place.latitude, b.lng ?? place.longitude);
    const markerColor = isHighlighted ? '0xec028b' : '0x6b7280';
    markers.push(`markers=color:${markerColor}|label:${idx + 1}|${bldgCenter.lat.toFixed(6)},${bldgCenter.lng.toFixed(6)}`);
  });

  const pathsQuery = paths.join('&');
  const markersQuery = markers.join('&');
  
  // Calculate bounding box of all valid buildings (those with vertices.length >= 3)
  const validBuildings = allBuildings.filter(b => b.polygonVertices && b.polygonVertices.length >= 3);
  
  let minLat = Infinity, maxLat = -Infinity;
  let minLng = Infinity, maxLng = -Infinity;
  
  if (validBuildings.length > 0) {
    validBuildings.forEach(b => {
      (b.polygonVertices || []).forEach(v => {
        minLat = Math.min(minLat, v.lat);
        maxLat = Math.max(maxLat, v.lat);
        minLng = Math.min(minLng, v.lng);
        maxLng = Math.max(maxLng, v.lng);
      });
    });
  } else {
    // Fallback to place coordinates if no valid polygon vertices exist
    minLat = place.latitude;
    maxLat = place.latitude;
    minLng = place.longitude;
    maxLng = place.longitude;
  }
  
  // Center of the bounding box
  const mapCenterLat = (minLat + maxLat) / 2;
  const mapCenterLng = (minLng + maxLng) / 2;
  
  // Span in degrees
  const latDiff = maxLat - minLat;
  const lngDiff = maxLng - minLng;
  const maxDiff = Math.max(latDiff, lngDiff);
  
  // Dynamically calculate zoom based on span (capping max zoom at 19)
  let zoom = 19;
  if (maxDiff > 0.0050) zoom = 15;
  else if (maxDiff > 0.0025) zoom = 16;
  else if (maxDiff > 0.0012) zoom = 17;
  else if (maxDiff > 0.0005) zoom = 18;
  else zoom = 19; // Cap max zoom at 19 to keep detail high but prevent clipping
  
  return `https://maps.googleapis.com/maps/api/staticmap?center=${mapCenterLat.toFixed(6)},${mapCenterLng.toFixed(6)}&zoom=${zoom}&size=400x400&maptype=satellite&${pathsQuery}&${markersQuery}&key=${mapsKey}`;
};export const EstimateReport: React.FC<EstimateReportProps> = ({ place, buildingData, surveyState, calcResult }) => {
  const reportContentRef = useRef<HTMLDivElement>(null);
  const [mapsKey, setMapsKey] = useState<string>('');

  useEffect(() => {
    getMapsApiKey().then(setMapsKey);
  }, []);

  const primaryBuilding = buildingData?.buildings?.[0];
  const satelliteUrl = mapsKey && primaryBuilding
    ? getStaticMapUrl(primaryBuilding, buildingData?.buildings || [], surveyState?.includedBuildingIds || [], place, mapsKey, true)
    : '';

  const handleDownloadPdf = async () => {
    const { jsPDF } = window.jspdf;
    const reportElement = reportContentRef.current;
    if (!reportElement || !window.html2canvas) return;

    // Temporarily apply body font for rendering
    document.body.style.fontFamily = "'EB Garamond', serif";

    const canvas = await window.html2canvas(reportElement, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#f3f4f6'
    });
    
    // Revert body font
    document.body.style.fontFamily = "";

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'p',
      unit: 'in',
      format: 'letter',
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const ratio = canvasWidth / pdfWidth;
    const imgHeight = canvasHeight / ratio;

    let heightLeft = imgHeight;
    let position = 0;
    
    pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
    heightLeft -= pdfHeight;

    while (heightLeft > 0) {
      position -= pdfHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    pdf.save(`RHIVE_Estimate_${place?.address?.split(',')?.[0] || 'Report'}.pdf`);
  };

  const { pricing } = usePricing();
  const isGaf = surveyState?.roofUpgrade?.includes('GAF') || false;
  const upgradeCost = calcResult?.roofEstimate?.upgrades?.[surveyState?.roofUpgrade as keyof typeof calcResult.roofEstimate.upgrades] || 0;

  const includedBuildings = (buildingData?.buildings || []).filter(b => surveyState?.includedBuildingIds?.includes(b.id));
  const overallScalingFactor = calcResult && calcResult.baseSq > 0 ? calcResult.finalSq / calcResult.baseSq : 1;
  const buildingCalcs = includedBuildings.map(building => {
      const singleBldgData: BuildingData = {
          buildings: [building],
          yearConstructed: buildingData?.yearConstructed ?? new Date().getFullYear()
      };
      const singleSurveyState: SurveyState = {
          ...(surveyState || {}),
          includedBuildingIds: [building.id],
          totalSq: 0 // force raw API measurements
      } as SurveyState;
      const res = calculateEstimate({ buildingData: singleBldgData, surveyState: singleSurveyState }, pricing);
      if (overallScalingFactor !== 1) {
          res.finalSq *= overallScalingFactor;
          res.asphaltSq *= overallScalingFactor;
          res.flatRoofSq *= overallScalingFactor;
      }
      return {
          building,
          res
      };
  });

  const hasMultipleBuildings = includedBuildings.length > 1;
  const totalPagesCount = hasMultipleBuildings ? (4 + includedBuildings.length) : 4;
  return (
    <div className="text-black bg-gray-300">
      <div className="max-h-[70vh] overflow-y-auto">
        <div ref={reportContentRef} className="font-serif">
            {/* PAGE 1 */}
            <ReportPage pageNumber={1} totalPages={totalPagesCount}>
                <ReportHeader place={place} title="Instant Proposal" subtitle="Slogan: Finish On Top! 🐝" />
                <div className="grid grid-cols-2 gap-8 mt-6">
                    <div>
                        <SectionTitle>Property Data (AI Measured)</SectionTitle>
                        <DetailItem label="Total Squares (Approx.):" value={`${(calcResult?.finalSq ?? 0).toFixed(2)} SQ`} />
                        <DetailItem label="Estimated Layers:" value={calcResult?.estimatedLayers ?? 'Unknown'} />
                        <DetailItem label="Max Pitch:" value={`${Math.max(...(calcResult?.pitchBreakdown || []).map(p => p?.pitch || 0), 0)}/12 Pitch`} />
                        <DetailItem label="Total Facets:" value={calcResult?.roofEstimate?.totalFacets ?? 0} />
                        <DetailItem label="Year Built:" value={buildingData?.yearConstructed ?? 'Unknown'} />
                    </div>
                     <div>
                        <SectionTitle>Your Selections</SectionTitle>
                        <DetailItem label="Primary Shingle:" value={surveyState?.roofUpgrade ?? ''} />
                        <DetailItem label="Shingle Color:" value={surveyState?.shingleColor ?? ''} />
                        <DetailItem label="Heat Trace System:" value={surveyState?.heatTrace?.enabled ? `Included (${formatCurrency(calcResult?.heatTraceEstimate?.total ?? 0)})` : 'Not Included'} />
                        <DetailItem label="Gutter System:" value={surveyState?.gutters?.enabled ? `${surveyState?.gutters?.size ?? ''} ${surveyState?.gutters?.style ?? ''}` : 'Not Included'} />
                    </div>
                </div>

                <SectionTitle>Ballpark Investment Breakdown</SectionTitle>
                <div className="grid grid-cols-2 gap-x-8">
                     <div>
                        <DetailItem label="Roofing Materials" value={formatCurrency(calcResult?.roofEstimate?.breakdown?.materials ?? 0)} />
                        <DetailItem label="Roofing Labor" value={formatCurrency(calcResult?.roofEstimate?.breakdown?.labor ?? 0)} />
                        <DetailItem label="Overhead & Add-ons" value={formatCurrency(calcResult?.roofEstimate?.breakdown?.overhead ?? 0)} />
                        <DetailItem label="Profit" value={formatCurrency(calcResult?.roofEstimate?.breakdown?.profit ?? 0)} />
                        {upgradeCost > 0 && <DetailItem label={`${surveyState?.roofUpgrade ?? ''} Upgrade`} value={formatCurrency(upgradeCost)} />}
                        <DetailItem label="Roofing Subtotal" value={formatCurrency((calcResult?.roofEstimate?.breakdown?.total ?? 0) + upgradeCost)} isSubtotal/>
                    </div>
                     <div>
                        <DetailItem label="Gutter System Estimate" value={formatCurrency(calcResult?.gutterEstimate?.total ?? 0)} />
                        <DetailItem label="Heat Trace System" value={formatCurrency(calcResult?.heatTraceEstimate?.total ?? 0)} />
                        <div className="mt-4 pt-4 border-t-2 border-pink-500/80">
                           <DetailItem label="Your Estimated Total" value={formatCurrency(calcResult?.liveTotal ?? 0)} isTotal/>
                        </div>
                    </div>
                </div>
                
                <div className="text-center mt-8 space-y-4">
                    <p className="text-base font-bold text-gray-700 font-sans">This is your transparent investment. Choose your next action now to lock in quality!</p>
                    <div>
                        <button className="inline-block font-sans px-6 py-3 rounded-lg font-bold text-white bg-[#ec028b] mx-2 transition hover:bg-pink-700 shadow-lg hover:scale-105">⚡ Secure Your Certified Quote & Lock Price</button>
                        <button className="inline-block font-sans px-6 py-3 rounded-lg font-bold text-white bg-black mx-2 transition hover:bg-gray-800 shadow-lg hover:scale-105">▶️ Watch The Next Steps Video Guide</button>
                    </div>
                </div>
            </ReportPage>
            
            {/* PAGE 2 */}
            <ReportPage pageNumber={2} totalPages={totalPagesCount}>
                <ReportHeader place={place} title="The RHIVE Quality System" subtitle={isGaf ? "GAF Lifetime Roofing System" : "Total Protection Roofing System®"} />
                <p className="font-sans font-medium text-black p-4 border-l-4 border-[#ec028b] bg-gray-50 my-6">
                    **We build trust, not just roofs.** You've selected a premium {isGaf ? 'GAF' : 'Owens Corning'} product, part of an integrated system ensuring unmatched quality, integrity, and clear pricing.
                </p>
                <div className="grid grid-cols-2 gap-8 items-start mt-4">
                    <div>
                        <h3 className="font-semibold text-lg font-sans mb-3 text-pink-600">Your Chosen System Components</h3>
                        <DetailItem label="Shingle Line:" value={surveyState?.roofUpgrade ?? ''} />
                        <DetailItem label="Ice & Water Barrier:" value={isGaf ? 'WeatherWatch®' : 'WeatherLock® G'} />
                        <DetailItem label="Synthetic Underlayment:" value={isGaf ? 'FeltBuster®' : 'ProArmor®'} />
                        <DetailItem label="Starter Shingles:" value={isGaf ? 'Pro-Start®' : 'Starter Strip Plus'} />
                        <DetailItem label="Hip & Ridge Shingles:" value={isGaf ? 'TimberTex®' : 'ProEdge®'} />
                        <DetailItem label="Ventilation:" value="Matching Ridge Vents" />
                    </div>
                     <div>
                        <img src={isGaf ? 'https://i.imgur.com/pYx6T6d.jpeg' : 'https://i.imgur.com/uF9M44G.jpeg'} alt="System diagram" className="rounded-lg shadow-xl w-full" />
                    </div>
                </div>
                <SectionTitle>Performance & Confidence (Why RHIVE Finishes On Top!)</SectionTitle>
                 <ul className="list-none p-0 text-base space-y-3">
                    <li className="pl-8 bg-no-repeat bg-[length:1.2rem] bg-left-top" style={{backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23EC028B' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z'/%3E%3Cpath d='M9 12l2 2 4-4'/%3E%3C/svg%3E")`}}>
                        <strong>{isGaf ? 'LayerLock™ Technology:' : 'SureNail® Technology:'}</strong> {isGaf ? 'Mechanically fuses the common bond between layers.' : 'A tough, woven fabric nailing strip provides outstanding grip and 130 MPH wind resistance.'}
                    </li>
                    <li className="pl-8 bg-no-repeat bg-[length:1.2rem] bg-left-top" style={{backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23EC028B' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z'/%3E%3Cpath d='M9 12l2 2 4-4'/%3E%3C/svg%3E")`}}>
                        <strong>Zero Mix-and-Match Risk:</strong> We use consistent manufacturer components to fully protect your warranty and ensure lasting quality.
                    </li>
                    <li className="pl-8 bg-no-repeat bg-[length:1.2rem] bg-left-top" style={{backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23EC028B' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z'/%3E%3Cpath d='M9 12l2 2 4-4'/%3E%3C/svg%3E")`}}>
                        <strong>Limited Lifetime Warranty:</strong> Peace of mind backed by an industry leader, plus our Lifetime No-Leak Guarantee.
                    </li>
                 </ul>
            </ReportPage>
            
            {/* PAGE 3 */}
            <ReportPage pageNumber={3} totalPages={totalPagesCount}>
                <ReportHeader place={place} title="The Quantum Leap to Quality" subtitle="Your path to a firm price and maximized savings." />
                
                <SectionTitle>RHIVE Project Savings Promotion</SectionTitle>
                <p>Our goal is unmatched **efficiency**. By choosing to move forward promptly, we eliminate follow-up costs and pass those savings directly to you. This results-driven promotion delivers exceptional value without compromising materials or specifications.</p>
                <ul className="list-disc list-inside mt-4 ml-4 font-sans text-base space-y-2">
                    <li><strong className="text-gray-900">The Savings:</strong> Save approximately **10%** on your job price (up to $1,000 on larger residential projects).</li>
                    <li><strong className="text-gray-900">The Guarantee:</strong> You retain a **3-day right to rescind** in Utah, giving you ample time to solidify your choice and still benefit.</li>
                    <li><strong className="text-gray-900">The Expiration:</strong> This estimate is valid for **two weeks**, but the **Project Savings Promotion is an immediate incentive**.</li>
                </ul>

                <SectionTitle>Next Action: Secure Your Certified Quote</SectionTitle>
                <p>Your Instant Proposal is the foundation. A **Certified Quote** from RHIVE is our firm price guarantee, based on a comprehensive on-site inspection. This next step includes:</p>
                <ul className="list-disc list-inside text-base mt-2 ml-4 space-y-1">
                    <li>Exact, finalized measurements and a detailed scope of work.</li>
                    <li>A complete breakdown of material, labor, overhead, and profit.</li>
                    <li>Customized options, system upgrades, and full warranty details.</li>
                    <li>Flexible, customer-friendly financing options.</li>
                </ul>

                <div className="text-center mt-8">
                     <button className="inline-block font-sans px-8 py-3 rounded-lg font-bold text-white bg-[#ec028b] mx-2 transition hover:bg-pink-700 shadow-lg hover:scale-105">Request My Certified Quote & Save Now!</button>
                    <p className="text-base text-gray-500 mt-2 font-sans">Quote expires soon. Don't miss your chance to **Finish On Top!**</p>
                </div>
            </ReportPage>

            {/* PAGE 4: DETAILED GEOMETRY (EAGLEVIEW-STYLE) */}
            {hasMultipleBuildings && (
                <ReportPage pageNumber={4} totalPages={totalPagesCount}>
                    <ReportHeader place={place} title="Property Summary" subtitle="Combined Roof Measurements & Satellite Imagery" />
                    <div className="grid grid-cols-12 gap-8 items-start mt-6">
                        <div className="col-span-5 bg-gray-50/50 p-4 border border-gray-200 rounded-lg">
                            <h3 className="font-sans font-bold text-lg text-pink-600 mb-4 pb-1 border-b border-gray-200">Combined Measurements</h3>
                            <div className="space-y-0.5 text-base">
                                <DetailItem label="Total roof area" value={`${Math.round((calcResult?.finalSq ?? 0) * 100)} sqft`} />
                                <DetailItem label="Total pitched area" value={`${Math.round((calcResult?.asphaltSq ?? 0) * 100)} sqft`} />
                                <DetailItem label="Total flat area" value={`${Math.round((calcResult?.flatRoofSq ?? 0) * 100)} sqft`} />
                                <DetailItem label="Total roof facets" value={`${calcResult?.roofEstimate?.totalFacets ?? 0} facets`} />
                                <DetailItem label="Predominant pitch" value={`${calcResult?.dominantPitch ?? 0}/12`} />
                                <DetailItem label="Total eaves" value={formatLength(calcResult?.linearMeasurements?.eaves ?? 0)} />
                                <DetailItem label="Total valleys" value={formatLength(calcResult?.linearMeasurements?.valleys ?? 0)} />
                                <DetailItem label="Total hips" value={formatLength(calcResult?.linearMeasurements?.hips ?? 0)} />
                                <DetailItem label="Total ridges" value={formatLength(calcResult?.linearMeasurements?.ridges ?? 0)} />
                                <DetailItem label="Total rakes" value={formatLength(calcResult?.linearMeasurements?.rakes ?? 0)} />
                                <DetailItem label="Total wall flashing" value={calcResult?.linearMeasurements?.wallFlashing ? formatLength(calcResult.linearMeasurements.wallFlashing) : '0ft 0in'} />
                                <DetailItem label="Total step flashing" value={calcResult?.linearMeasurements?.stepFlashing ? formatLength(calcResult.linearMeasurements.stepFlashing) : '0ft 0in'} />
                                <DetailItem label="Total transitions" value={calcResult?.linearMeasurements?.transitions ? formatLength(calcResult.linearMeasurements.transitions) : '0ft 0in'} />
                                <DetailItem label="Total parapet wall" value="0ft 0in" />
                                <DetailItem label="Total unspecified" value={calcResult?.linearMeasurements?.unspecified ? formatLength(calcResult.linearMeasurements.unspecified) : '0ft 0in'} />
                                <div className="pt-2 mt-2 border-t border-gray-300">
                                    <DetailItem label="Hips + ridges" value={formatLength((calcResult?.linearMeasurements?.hips ?? 0) + (calcResult?.linearMeasurements?.ridges ?? 0))} isSubtotal />
                                    <DetailItem label="Eaves + rakes" value={formatLength((calcResult?.linearMeasurements?.eaves ?? 0) + (calcResult?.linearMeasurements?.rakes ?? 0))} isTotal />
                                </div>
                            </div>
                        </div>
                        <div className="col-span-7 flex flex-col items-center">
                            <h3 className="font-sans font-bold text-lg text-black mb-4 self-start">Satellite Roof View</h3>
                            {satelliteUrl ? (
                                <img src={satelliteUrl} alt="Satellite Roof View" className="w-full h-auto max-w-[360px] rounded-lg shadow-md border-2 border-gray-200" />
                            ) : (
                                <div className="w-full h-[360px] max-w-[360px] bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-500 font-sans text-sm">
                                    Loading satellite imagery...
                                </div>
                            )}
                        </div>
                    </div>
                </ReportPage>
            )}

            {/* SEPARATE STRUCTURE PAGES */}
            {buildingCalcs.map(({ building, res }, idx) => {
                const originalIdx = buildingData?.buildings.findIndex(b => b.id === building.id) ?? idx;
                const pageNum = (hasMultipleBuildings ? 5 : 4) + idx;
                const bldgName = `BLDG ${originalIdx + 1}`;
                const isPrimary = originalIdx === 0;

                return (
                    <ReportPage key={building.id} pageNumber={pageNum} totalPages={totalPagesCount}>
                        <ReportHeader place={place} title={`BLDG ${originalIdx + 1} Summary`} subtitle={`${bldgName} Measurements ${isPrimary ? '(Primary Structure)' : '(Manually Tagged)'}`} />
                        <div className="grid grid-cols-12 gap-8 items-start mt-6">
                            <div className="col-span-6 flex flex-col items-center">
                                <h3 className="font-sans font-bold text-lg text-black mb-4 self-start">Structure Diagram</h3>
                                {mapsKey ? (
                                    <div className="w-full flex flex-col items-center justify-center p-4 bg-gray-50 border border-gray-200 rounded-lg">
                                        <img 
                                            src={getStaticMapUrl(building, buildingData?.buildings || [], surveyState?.includedBuildingIds || [], place, mapsKey)} 
                                            alt={`${bldgName} Diagram`} 
                                            className="w-full h-auto max-w-[280px] rounded-lg shadow-md border border-gray-200" 
                                        />
                                        <p className="text-slate-500 text-sm mt-3 text-center">Interactive 3D Geometry Preview</p>
                                    </div>
                                ) : (
                                    isPrimary && !building.id.startsWith('BLD_') ? (
                                        <RoofDrawing address={place?.address ?? ''} building={building} />
                                    ) : (
                                        <BuildingDrawing building={building} />
                                    )
                                )}
                            </div>
                            <div className="col-span-6 bg-gray-50/50 p-4 border border-gray-200 rounded-lg">
                                <h3 className="font-sans font-bold text-lg text-pink-600 mb-4 pb-1 border-b border-gray-200">Measurements</h3>
                                <div className="space-y-0.5 text-base">
                                    <DetailItem label="Total roof area" value={`${Math.round((res?.finalSq ?? 0) * 100)} sqft`} />
                                    <DetailItem label="Total pitched area" value={`${Math.round((res?.asphaltSq ?? 0) * 100)} sqft`} />
                                    <DetailItem label="Total flat area" value={`${Math.round((res?.flatRoofSq ?? 0) * 100)} sqft`} />
                                    <DetailItem label="Total roof facets" value={`${res?.roofEstimate?.totalFacets ?? 0} facets`} />
                                    <DetailItem label="Predominant pitch" value={`${res?.dominantPitch ?? 0}/12`} />
                                    <DetailItem label="Total eaves" value={formatLength(res?.linearMeasurements?.eaves ?? 0)} />
                                    <DetailItem label="Total valleys" value={formatLength(res?.linearMeasurements?.valleys ?? 0)} />
                                    <DetailItem label="Total hips" value={formatLength(res?.linearMeasurements?.hips ?? 0)} />
                                    <DetailItem label="Total ridges" value={formatLength(res?.linearMeasurements?.ridges ?? 0)} />
                                    <DetailItem label="Total rakes" value={formatLength(res?.linearMeasurements?.rakes ?? 0)} />
                                    <DetailItem label="Total wall flashing" value={res?.linearMeasurements?.wallFlashing ? formatLength(res.linearMeasurements.wallFlashing) : '0ft 0in'} />
                                    <DetailItem label="Total step flashing" value={res?.linearMeasurements?.stepFlashing ? formatLength(res.linearMeasurements.stepFlashing) : '0ft 0in'} />
                                    <DetailItem label="Total transitions" value={res?.linearMeasurements?.transitions ? formatLength(res.linearMeasurements.transitions) : '0ft 0in'} />
                                    <DetailItem label="Total unspecified" value={res?.linearMeasurements?.unspecified ? formatLength(res.linearMeasurements.unspecified) : '0ft 0in'} />
                                    <div className="pt-2 mt-2 border-t border-gray-300">
                                        <DetailItem label="Hips + ridges" value={formatLength((res?.linearMeasurements?.hips ?? 0) + (res?.linearMeasurements?.ridges ?? 0))} isSubtotal />
                                        <DetailItem label="Eaves + rakes" value={formatLength((res?.linearMeasurements?.eaves ?? 0) + (res?.linearMeasurements?.rakes ?? 0))} isTotal />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ReportPage>
                );
            })}
        </div>
      </div>
       <div className="p-4 bg-gray-100 border-t flex flex-col sm:flex-row justify-end gap-4">
            <Button variant="ghost" className="text-gray-700 hover:bg-gray-200" onClick={() => alert('Request for certified quote sent!')}>Request Certified Quote</Button>
            <Button variant="ghost" className="text-gray-700 hover:bg-gray-200" onClick={() => alert('Redirecting to scheduler...')}>Schedule Tentative Install</Button>
            <Button size="lg" onClick={handleDownloadPdf}>Download as PDF</Button>
        </div>
    </div>
  );
};
