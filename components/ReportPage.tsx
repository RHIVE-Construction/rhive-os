import React, { useRef } from 'react';
// Fix: Import newly exported RoofReport type
import type { RoofReport } from '../types';
// Fix: Correct icon imports to match exports from icons.tsx
import { RhiveLogo, SnowflakeIcon, HailIcon, WindIcon, DownloadIcon } from './icons';

declare global {
  interface Window {
    jspdf: any;
    html2canvas: any;
  }
}

const StatCard: React.FC<{ title: string; value: string; unit: string; icon?: React.ReactNode }> = ({ title, value, unit, icon }) => (
  <div className="bg-gray-800 p-4 rounded-lg flex items-center">
    {icon && <div className="mr-4 text-[#ec028b]">{icon}</div>}
    <div>
      <div className="text-gray-400 text-base">{title}</div>
      <div className="text-white text-2xl font-bold">
        {value} <span className="text-lg text-gray-300">{unit}</span>
      </div>
    </div>
  </div>
);

const ReportHeader: React.FC<{ onNewEstimate: () => void; onDownload: () => void }> = ({ onNewEstimate, onDownload }) => (
    <header className="flex justify-between items-center p-4 md:p-6">
        <RhiveLogo className="h-7" />
        <div className="flex items-center space-x-6">
             <button onClick={onDownload} className="flex items-center text-base font-semibold text-white hover:text-[#ec028b] transition-colors">
                <DownloadIcon className="h-4 w-4 mr-2" />
                Download Report
            </button>
            <button onClick={onNewEstimate} className="text-base font-semibold text-white hover:text-[#ec028b] transition-colors">
                Start New Estimate
            </button>
        </div>
    </header>
);

export const ReportPage: React.FC<{ report: RoofReport; address: string; onNewEstimate: () => void; }> = ({ report, address, onNewEstimate }) => {
    const reportContentRef = useRef<HTMLDivElement>(null);

    const handleDownloadPdf = () => {
        const { jsPDF } = window.jspdf;
        const reportElement = reportContentRef.current;
        if (!reportElement || !window.html2canvas) return;

        const originalStyles = new Map<HTMLElement, { color: string, backgroundColor: string }>();

        // Change styles for PDF generation
        reportElement.style.backgroundColor = 'white';
        const allElements = reportElement.querySelectorAll<HTMLElement>('*');
        allElements.forEach(el => {
            const computedStyle = window.getComputedStyle(el);
            originalStyles.set(el, { color: el.style.color, backgroundColor: el.style.backgroundColor });
            el.style.color = computedStyle.backgroundColor.startsWith('rgb(236, 2, 139)') ? 'white' : 'black'; // Keep text on pink bg white
             if (el.tagName !== 'path') {
               el.style.backgroundColor = 'transparent';
            }
        });


        window.html2canvas(reportElement, {
            scale: 2,
            backgroundColor: '#ffffff',
        }).then(canvas => {
            // Restore original styles
            reportElement.style.backgroundColor = '';
            allElements.forEach(el => {
                const styles = originalStyles.get(el);
                if (styles) {
                    el.style.color = styles.color;
                    el.style.backgroundColor = styles.backgroundColor;
                }
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'p',
                unit: 'px',
                format: [canvas.width, canvas.height]
            });
            pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
            pdf.save(`RHIVE_Report_${address.split(',')[0]}.pdf`);
        });
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white animate-fade-in">
            <ReportHeader onNewEstimate={onNewEstimate} onDownload={handleDownloadPdf} />
            <main ref={reportContentRef} className="p-4 md:p-8 bg-gray-900">
                <p className="text-lg text-gray-400 mb-6">{address}</p>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left & Middle Column Span */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* AI-Generated Analysis Card */}
                        <div className="bg-gray-800 rounded-lg p-6">
                           <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-2xl font-bold">AI-Generated Roof Analysis</h2>
                                    <p className="text-gray-400">Select buildings to include in estimate.</p>
                                </div>
                                <img src="https://storage.googleapis.com/maker-suite-public-images/codelab-app-art/roof-image.png" alt="Satellite view of a roof" className="w-24 h-24 rounded-lg object-cover border-2 border-gray-700"/>
                           </div>
                           <div className="mt-4 bg-gray-900 p-3 rounded-md flex justify-between items-center border border-[#ec028b]">
                               <span>Building 1</span>
                               <span className="font-bold text-[#ec028b]">{report.totalSquares.toFixed(2)} SQ</span>
                           </div>
                           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                                <StatCard title="Total Roof Squares" value={report.totalSquaresWithWaste.toFixed(2)} unit="SQ" />
                                <StatCard title="Year Constructed" value="1974" unit="Est." />
                                <StatCard title="Est. Layers" value="2" unit="" />
                           </div>
                           <div className="mt-6">
                               <h3 className="font-semibold mb-2">Pitch & Facet Breakdown</h3>
                               <div className="bg-gray-900 p-3 rounded-md space-y-2 text-base">
                                   {report.pitchAnalysis.map(({ pitch, areaSqFt }) => (
                                       <div key={pitch} className="flex justify-between items-center">
                                           <span>{pitch}/12 Pitch</span>
                                           <span className="font-mono">{(areaSqFt / 100).toFixed(2)} SQ</span>
                                       </div>
                                   ))}
                                    <div className="flex justify-between items-center border-t border-gray-700 pt-2 mt-2 font-bold">
                                        <span>Dominant Pitch</span>
                                        <span>{report.dominantPitch}/12</span>
                                    </div>
                               </div>
                           </div>
                        </div>

                        {/* Weather History Card (Mockup) */}
                        <div className="bg-gray-800 rounded-lg p-6">
                            <div className="flex justify-between items-center">
                                <h2 className="text-2xl font-bold">Weather History</h2>
                                <SnowflakeIcon className="h-6 w-6 text-blue-400"/>
                            </div>
                            <div className="mt-4 space-y-2">
                                <div className="grid grid-cols-3 gap-4 items-center text-base">
                                    <div className="flex items-center"><HailIcon className="h-5 w-5 mr-2 text-red-400"/> Hail</div>
                                    <div className="text-gray-400">June 15, 2023</div>
                                    <div className="bg-red-500 text-white text-base font-bold px-2 py-1 rounded-full text-center">1.25-inch hail</div>
                                </div>
                                <div className="grid grid-cols-3 gap-4 items-center text-base">
                                    <div className="flex items-center"><WindIcon className="h-5 w-5 mr-2 text-[#e2ab49]"/> Wind</div>
                                    <div className="text-gray-400">August 28, 2022</div>
                                    <div className="bg-[#e2ab49] text-black text-base font-bold px-2 py-1 rounded-full text-center">55 mph gusts</div>
                                </div>
                                <div className="grid grid-cols-3 gap-4 items-center text-base">
                                    <div className="flex items-center"><SnowflakeIcon className="h-5 w-5 mr-2 text-[#08137C]"/> Ice Storm</div>
                                    <div className="text-gray-400">January 25, 2022</div>
                                    <div className="bg-[#08137C] text-white text-base font-bold px-2 py-1 rounded-full text-center truncate">Significant ice storm</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Right Column */}
                    <div className="space-y-6">
                        {/* Roof Options (Mockup) */}
                        <div className="bg-gray-800 rounded-lg p-6">
                            <h2 className="text-xl font-bold mb-4">Roof Options</h2>
                            <div className="space-y-3 text-base">
                                <div className="flex justify-between items-center">
                                    <span>How many layers are on your project?</span>
                                    <span className="text-gray-400">2</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>Chimneys</span>
                                    <span className="text-gray-400">0</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>Swamp Coolers</span>
                                    <span className="text-gray-400">0</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>Skylights</span>
                                    <span className="text-gray-400">0</span>
                                </div>
                            </div>
                        </div>
                         {/* Gutter Options (Mockup) */}
                         <div className="bg-gray-800 rounded-lg p-6">
                            <h2 className="text-xl font-bold mb-4">Gutter Options</h2>
                             <div className="space-y-3 text-base">
                                <div className="flex justify-between items-center">
                                    <span>How many feet of gutters?</span>
                                    <span className="text-gray-400">Ex: 120</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>How many miters (corners)?</span>
                                    <span className="text-gray-400">Ex: 6</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>How many downspouts?</span>
                                    <span className="text-gray-400">2 - Story</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};