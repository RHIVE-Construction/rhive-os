
import React, { useRef, useState, useEffect } from 'react';
import type { Place, BuildingData, SurveyState, CalculationResult } from '../types';
import { Button } from './ui/button';
import { formatCurrency } from '../lib/utils';
import { WeatherReport } from './WeatherReport';
import { RhiveLogoBlack } from './icons';
import { RoofDrawing } from './RoofDrawing';
import { getMapsApiKey } from '../lib/mapsConfig';

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


export const EstimateReport: React.FC<EstimateReportProps> = ({ place, buildingData, surveyState, calcResult }) => {
  const reportContentRef = useRef<HTMLDivElement>(null);
  const [mapsKey, setMapsKey] = useState<string>('');

  useEffect(() => {
    getMapsApiKey().then(setMapsKey);
  }, []);

  const satelliteUrl = mapsKey 
    ? `https://maps.googleapis.com/maps/api/staticmap?center=${place.latitude},${place.longitude}&zoom=20&size=640x640&maptype=satellite&markers=color:0xec028b%7C${place.latitude},${place.longitude}&key=${mapsKey}`
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

    pdf.save(`RHIVE_Estimate_${place.address.split(',')[0]}.pdf`);
  };

  const isGaf = surveyState.roofUpgrade.includes('GAF');
  const upgradeCost = calcResult.roofEstimate.upgrades[surveyState.roofUpgrade as keyof typeof calcResult.roofEstimate.upgrades] || 0;


  return (
    <div className="text-black bg-gray-300">
      <div className="max-h-[70vh] overflow-y-auto">
        <div ref={reportContentRef} className="font-serif">
            {/* PAGE 1 */}
            <ReportPage pageNumber={1} totalPages={4}>
                <ReportHeader place={place} title="Instant Proposal" subtitle="Slogan: Finish On Top! 🐝" />
                <div className="grid grid-cols-2 gap-8 mt-6">
                    <div>
                        <SectionTitle>Property Data (AI Measured)</SectionTitle>
                        <DetailItem label="Total Squares (Approx.):" value={`${calcResult.finalSq.toFixed(2)} SQ`} />
                        <DetailItem label="Estimated Layers:" value={calcResult.estimatedLayers} />
                        <DetailItem label="Max Pitch:" value={`${Math.max(...calcResult.pitchBreakdown.map(p => p.pitch), 0)}/12 Pitch`} />
                        <DetailItem label="Total Facets:" value={calcResult.roofEstimate.totalFacets} />
                        <DetailItem label="Year Built:" value={buildingData.yearConstructed} />
                    </div>
                     <div>
                        <SectionTitle>Your Selections</SectionTitle>
                        <DetailItem label="Primary Shingle:" value={surveyState.roofUpgrade} />
                        <DetailItem label="Shingle Color:" value={surveyState.shingleColor} />
                        <DetailItem label="Heat Trace System:" value={surveyState.heatTrace.enabled ? `Included (${formatCurrency(calcResult.heatTraceEstimate.total)})` : 'Not Included'} />
                        <DetailItem label="Gutter System:" value={surveyState.gutters.enabled ? `${surveyState.gutters.size} ${surveyState.gutters.style}` : 'Not Included'} />
                    </div>
                </div>

                <SectionTitle>Ballpark Investment Breakdown</SectionTitle>
                <div className="grid grid-cols-2 gap-x-8">
                     <div>
                        <DetailItem label="Roofing Materials" value={formatCurrency(calcResult.roofEstimate.breakdown.materials)} />
                        <DetailItem label="Roofing Labor" value={formatCurrency(calcResult.roofEstimate.breakdown.labor)} />
                        <DetailItem label="Overhead & Add-ons" value={formatCurrency(calcResult.roofEstimate.breakdown.overhead)} />
                        <DetailItem label="Profit" value={formatCurrency(calcResult.roofEstimate.breakdown.profit)} />
                        {upgradeCost > 0 && <DetailItem label={`${surveyState.roofUpgrade} Upgrade`} value={formatCurrency(upgradeCost)} />}
                        <DetailItem label="Roofing Subtotal" value={formatCurrency(calcResult.roofEstimate.breakdown.total + upgradeCost)} isSubtotal/>
                    </div>
                     <div>
                        <DetailItem label="Gutter System Estimate" value={formatCurrency(calcResult.gutterEstimate.total)} />
                        <DetailItem label="Heat Trace System" value={formatCurrency(calcResult.heatTraceEstimate.total)} />
                        <div className="mt-4 pt-4 border-t-2 border-pink-500/80">
                          <DetailItem label="Your Estimated Total" value={formatCurrency(calcResult.liveTotal)} isTotal/>
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
            <ReportPage pageNumber={2} totalPages={4}>
                <ReportHeader place={place} title="The RHIVE Quality System" subtitle={isGaf ? "GAF Lifetime Roofing System" : "Total Protection Roofing System®"} />
                <p className="font-sans font-medium text-black p-4 border-l-4 border-[#ec028b] bg-gray-50 my-6">
                    **We build trust, not just roofs.** You've selected a premium {isGaf ? 'GAF' : 'Owens Corning'} product, part of an integrated system ensuring unmatched quality, integrity, and clear pricing.
                </p>
                <div className="grid grid-cols-2 gap-8 items-start mt-4">
                    <div>
                        <h3 className="font-semibold text-lg font-sans mb-3 text-pink-600">Your Chosen System Components</h3>
                        <DetailItem label="Shingle Line:" value={surveyState.roofUpgrade} />
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
            <ReportPage pageNumber={3} totalPages={4}>
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
            <ReportPage pageNumber={4} totalPages={4}>
                <ReportHeader place={place} title="Report Summary" subtitle="Detailed Roof Measurements & Satellite Imagery" />
                <div className="grid grid-cols-12 gap-8 items-start mt-6">
                    <div className="col-span-5 bg-gray-50/50 p-4 border border-gray-200 rounded-lg">
                        <h3 className="font-sans font-bold text-lg text-pink-600 mb-4 pb-1 border-b border-gray-200">Measurements</h3>
                        <div className="space-y-0.5 text-base">
                            <DetailItem label="Total roof area" value={`${Math.round(calcResult.finalSq * 100)} sqft`} />
                            <DetailItem label="Total pitched area" value={`${Math.round(calcResult.asphaltSq * 100)} sqft`} />
                            <DetailItem label="Total flat area" value={`${Math.round(calcResult.flatRoofSq * 100)} sqft`} />
                            <DetailItem label="Total roof facets" value={`${calcResult.roofEstimate.totalFacets} facets`} />
                            <DetailItem label="Predominant pitch" value={`${calcResult.dominantPitch}/12`} />
                            <DetailItem label="Total eaves" value={formatLength(calcResult.linearMeasurements.eaves)} />
                            <DetailItem label="Total valleys" value={formatLength(calcResult.linearMeasurements.valleys)} />
                            <DetailItem label="Total hips" value={formatLength(calcResult.linearMeasurements.hips)} />
                            <DetailItem label="Total ridges" value={formatLength(calcResult.linearMeasurements.ridges)} />
                            <DetailItem label="Total rakes" value={formatLength(calcResult.linearMeasurements.rakes)} />
                            <DetailItem label="Total wall flashing" value={calcResult.linearMeasurements.wallFlashing ? formatLength(calcResult.linearMeasurements.wallFlashing) : '0ft 0in'} />
                            <DetailItem label="Total step flashing" value={calcResult.linearMeasurements.stepFlashing ? formatLength(calcResult.linearMeasurements.stepFlashing) : '0ft 0in'} />
                            <DetailItem label="Total transitions" value={calcResult.linearMeasurements.transitions ? formatLength(calcResult.linearMeasurements.transitions) : '0ft 0in'} />
                            <DetailItem label="Total parapet wall" value="0ft 0in" />
                            <DetailItem label="Total unspecified" value={calcResult.linearMeasurements.unspecified ? formatLength(calcResult.linearMeasurements.unspecified) : '0ft 0in'} />
                            <div className="pt-2 mt-2 border-t border-gray-300">
                                <DetailItem label="Hips + ridges" value={formatLength(calcResult.linearMeasurements.hips + calcResult.linearMeasurements.ridges)} isSubtotal />
                                <DetailItem label="Eaves + rakes" value={formatLength(calcResult.linearMeasurements.eaves + calcResult.linearMeasurements.rakes)} isTotal />
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
