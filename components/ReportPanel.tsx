import React, { useRef } from 'react';
// Fix: Import newly exported RoofReport type
import type { RoofReport } from '../types';
// Fix: Correct icon names to match exports from icons.tsx
import { DownloadIcon, RulerIcon, WrenchIcon } from './icons';

// Fix: Declare jspdf and html2canvas on window to avoid TypeScript errors.
declare global {
  interface Window {
    jspdf: any;
    html2canvas: any;
  }
}

interface ReportPanelProps {
  report: RoofReport;
  address: string;
}

const ReportItem: React.FC<{ label: string; value: string | number; unit?: string; highlight?: boolean }> = ({ label, value, unit, highlight }) => (
  <div className={`flex justify-between items-baseline py-3 px-4 rounded-md ${highlight ? 'bg-blue-50' : ''}`}>
    <span className="text-slate-600">{label}</span>
    <span className={`font-bold text-slate-900 ${highlight ? 'text-blue-700 text-lg' : ''}`}>
      {value} <span className="text-base font-normal text-slate-500">{unit}</span>
    </span>
  </div>
);

export const ReportPanel: React.FC<ReportPanelProps> = ({ report, address }) => {
  const reportRef = useRef<HTMLDivElement>(null);
  
  const handleDownloadPdf = () => {
    const { jsPDF } = window.jspdf;
    const reportElement = reportRef.current;
    if (!reportElement || !window.html2canvas) return;

    window.html2canvas(reportElement, { scale: 2 }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`RoofScope_Report_${address.split(',')[0]}.pdf`);
    });
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm animate-fade-in">
        <div id="pdf-content" ref={reportRef} className="p-6 md:p-8">
            <div className="border-b pb-4 mb-6">
                <h3 className="text-xl font-bold text-slate-900">Roof Measurement Report</h3>
                <p className="text-slate-600 truncate">{address}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                {/* Measurements Section */}
                <div>
                    <h4 className="flex items-center text-lg font-semibold text-slate-800 mb-3">
                        <RulerIcon className="h-5 w-5 mr-2 text-blue-600" />
                        Measurements
                    </h4>
                    <div className="space-y-1">
                        <ReportItem label="Total Area" value={report.totalAreaSqFt.toLocaleString()} unit="sq ft" />
                        <ReportItem label="Total Squares" value={report.totalSquares.toFixed(2)} unit="squares" />
                        <ReportItem label="Waste Factor" value={`${report.wasteFactor}%`} />
                        <ReportItem label="Total with Waste" value={report.totalSquaresWithWaste.toFixed(2)} unit="squares" highlight />
                        <ReportItem label="Dominant Pitch" value={`${report.dominantPitch}/12`} />
                        <hr className="my-2"/>
                        <ReportItem label="Ridges" value={report.linearMeasurements.ridges.toFixed(1)} unit="ft" />
                        <ReportItem label="Hips" value={report.linearMeasurements.hips.toFixed(1)} unit="ft" />
                        <ReportItem label="Valleys" value={report.linearMeasurements.valleys.toFixed(1)} unit="ft" />
                        <ReportItem label="Eaves" value={report.linearMeasurements.eaves.toFixed(1)} unit="ft" />
                        <ReportItem label="Rakes" value={report.linearMeasurements.rakes.toFixed(1)} unit="ft" />
                    </div>
                </div>

                {/* Material List Section */}
                <div>
                    <h4 className="flex items-center text-lg font-semibold text-slate-800 mb-3">
                        <WrenchIcon className="h-5 w-5 mr-2 text-green-600" />
                        Estimated Material List
                    </h4>
                    <div className="space-y-1">
                        <ReportItem label="Shingles" value={report.materialList.shingleBundles} unit="bundles" highlight />
                        <ReportItem label="Starter Shingles" value={report.materialList.starterShingles} unit="bundles" />
                        <ReportItem label="Ridge Cap" value={report.materialList.ridgeCapShingles} unit="bundles" />
                        <ReportItem label="Ice & Water Shield" value={report.materialList.iceAndWaterShield} unit="rolls" />
                        <ReportItem label="Underlayment" value={report.materialList.underlaymentRolls} unit="rolls" />
                        <ReportItem label="Drip Edge" value={report.materialList.dripEdge} unit="pieces" />
                    </div>
                </div>
            </div>
             <div className="text-center mt-8 pt-4 border-t text-base text-slate-500">
                Measured by <strong>RoofScope Pro</strong>
            </div>
        </div>

        <div className="bg-slate-50 p-4 rounded-b-lg border-t flex justify-end">
            <button
                onClick={handleDownloadPdf}
                className="flex items-center px-4 py-2 bg-green-600 text-white font-semibold rounded-md shadow-sm hover:bg-green-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
            >
                <DownloadIcon className="h-5 w-5 mr-2" />
                Download PDF
            </button>
        </div>
    </div>
  );
};
