import React from 'react';
import { ShieldCheck, CheckCircle2, Award, Zap, Ruler, Fan, Droplets, Target, Layers } from 'lucide-react';

const DurationSpecificationPrint = () => {
    return (
        <div className="bg-white text-black font-serif min-h-screen p-12 max-w-[8.5in] mx-auto shadow-2xl overflow-visible print:shadow-none print:p-0">
            {/* Header / Branding */}
            <div className="flex justify-between items-start border-b-4 border-black pb-8 mb-12">
                <div>
                    <h1 className="text-5xl font-black uppercase tracking-tighter leading-none mb-2">RHIVE CONSTRUCTION</h1>
                    <p className="text-xl font-bold tracking-[0.2em] uppercase">Certified System Specification</p>
                </div>
                <div className="text-right">
                    <div className="bg-black text-white px-4 py-2 text-xs font-black uppercase tracking-widest mb-2">OC PREFERRED PROTECT</div>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Document ID: RHV-OCDP-2026</p>
                </div>
            </div>

            {/* Main Spec Title */}
            <div className="mb-12">
                <h2 className="text-3xl font-black uppercase mb-4 border-b-2 border-gray-200 pb-2">O.C. DURATION® FOUNDATION</h2>
                <p className="text-sm leading-relaxed text-gray-700 italic">
                    The comprehensive specification for high-performance residential and commercial-grade asphalt shingle systems installed by RHIVE Construction as the uncompromised baseline for property protection.
                </p>
            </div>

            {/* Warranty Section */}
            <div className="grid grid-cols-2 gap-12 mb-12">
                <div className="border-2 border-black p-6">
                    <h3 className="text-lg font-black uppercase mb-4 flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5" /> Manufacturer Coverage
                    </h3>
                    <ul className="space-y-3 text-sm font-bold uppercase tracking-tight">
                        <li className="flex justify-between border-b border-gray-100 pb-1">
                            <span>Material Period:</span>
                            <span>50 Years</span>
                        </li>
                        <li className="flex justify-between border-b border-gray-100 pb-1 text-red-600">
                            <span>Non-Prorated:</span>
                            <span>100% Guaranteed</span>
                        </li>
                        <li className="flex justify-between border-b border-gray-100 pb-1">
                            <span>Labor Coverage:</span>
                            <span>Included</span>
                        </li>
                        <li className="flex justify-between">
                            <span>Wind Resistance:</span>
                            <span>130 MPH</span>
                        </li>
                    </ul>
                </div>
                <div className="border-2 border-black p-6 bg-gray-50">
                    <h3 className="text-lg font-black uppercase mb-4 flex items-center gap-2">
                        <Award className="w-5 h-5" /> RHIVE Installer Guarantee
                    </h3>
                    <ul className="space-y-3 text-sm font-bold uppercase tracking-tight">
                        <li className="flex justify-between border-b border-gray-100 pb-1">
                            <span>Workmanship:</span>
                            <span>10-Year Backup</span>
                        </li>
                        <li className="flex justify-between border-b border-gray-100 pb-1">
                            <span>Leak-Free Period:</span>
                            <span>Lifetime Signature</span>
                        </li>
                        <li className="flex justify-between border-b border-gray-100 pb-1">
                            <span>Transferable:</span>
                            <span>Standard 1-Time</span>
                        </li>
                        <li className="flex justify-between italic">
                            <span>Certified Install:</span>
                            <span>OC Preferred</span>
                        </li>
                    </ul>
                </div>
            </div>

            {/* System Components Grid */}
            <div className="mb-12">
                <h3 className="text-xl font-black uppercase mb-6 border-b-2 border-gray-200 pb-2">8-POINT COMPONENT SPECIFICATION</h3>
                <div className="grid grid-cols-2 gap-x-12 gap-y-4">
                    {[
                        { title: "Tear-off to Decking", desc: "Full removal of existing layers to expose and certify the structural deck." },
                        { title: "OSB / Plywood Certification", desc: "Ensuring structural integrity with fasteners into 5/8\" minimum decking." },
                        { title: "ProArmor® Barrier", desc: "Advanced synthetic underlayment for breathable, long-term deck protection." },
                        { title: "WeatherLock® Shield", desc: "Self-sealing ice and water barrier at eaves, valleys, and penetrations." },
                        { title: "Starter Strip Plus", desc: "Continuous sealant strip at the eave to prevent shingle blow-offs." },
                        { title: "Vent-Sure® Balance", desc: "Balanced intake and exhaust ventilation to regulate attic temperature." },
                        { title: "SureNail® Technology", desc: "Triple-layer reinforcement in the nailing zone for extreme wind grip." },
                        { title: "Pro-Edge® Hip/Ridge", desc: "High-profile finishing shingles for enhanced aesthetics and ridge defense." }
                    ].map((comp, idx) => (
                        <div key={idx} className="border-b border-gray-200 pb-2">
                            <h4 className="text-xs font-black uppercase">{idx + 1}. {comp.title}</h4>
                            <p className="text-[10px] text-gray-600 uppercase tracking-tighter">{comp.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footnote / Certification */}
            <div className="mt-auto border-t-2 border-black pt-8 flex justify-between items-end">
                <div className="max-w-md">
                    <p className="text-[10px] font-bold text-gray-500 uppercase leading-relaxed tracking-widest">
                        This specification is valid only for projects where RHIVE Construction is the prime contractor. All installations are performed in accordance with manufacturer guidelines and local building codes.
                    </p>
                </div>
                <div className="flex flex-col items-center">
                    <div className="w-32 h-16 border border-gray-300 mb-2 p-2 flex items-center justify-center italic text-gray-300">
                        Signature Seal
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest">Certified Field Specialist</p>
                </div>
            </div>

            {/* Print Instruction (Hidden in Print) */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 print:hidden z-50">
                <button
                    onClick={() => window.print()}
                    className="bg-black text-white px-8 py-4 font-black uppercase tracking-widest hover:bg-[var(--rhive-pink)] transition-colors shadow-2xl flex items-center gap-3"
                >
                    <Zap className="w-4 h-4" /> Download PDF / Print Specification
                </button>
            </div>
        </div>
    );
};

export default DurationSpecificationPrint;
