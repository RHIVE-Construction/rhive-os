import React from 'react';
import { Shield, CheckCircle2, X, Download, FileText, Activity, HardHat, Building2, Gavel, Hammer, Trash2, Search, Zap, Wind, Droplets, Fan, Ruler, Gauge, Calendar, ClipboardCheck, Award, AlertCircle } from 'lucide-react';

interface ShingleDurationLightboxProps {
    isOpen: boolean;
    onClose: () => void;
}

const ShingleDurationLightbox: React.FC<ShingleDurationLightboxProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const sections = [
        {
            groupId: "logistics",
            title: "PHASE 1: LOGISTICS & PREPARATION",
            icon: <ClipboardCheck className="w-5 h-5" />,
            items: [
                { label: "DUMPSTER & WASTE MANAGEMENT", desc: "Cost included for disposal of all estimated layers, debris, and waste. Includes placement and management of dumpster and ground tarps." },
                { label: "TEAR-OFF", desc: "Full removal of all existing roofing material down to the decking. Any additional layers will be photographed and communicated to the homeowner for unmatched transparency." },
                { label: "DECKING INSPECTION", desc: "Certification inspection of all roof surface decking. Non-compliant wood quoted with homeowner approval." },
                { label: "DECKING", desc: "Up to 100 sq ft of 7/16 OSB Decking replacement included." }
            ]
        },
        {
            groupId: "foundation",
            title: "PHASE 2: FOUNDATION & SEALING",
            icon: <Shield className="w-5 h-5" />,
            items: [
                { label: "CAP NAILS", desc: "Water-sealing, electro-galvanized ring shank cap nails installed to securely adhere underlayment against high winds." },
                { label: "COIL NAILS", desc: "Electro-galvanized coil nails installed with 6 nails per shingle (utilizing SureNail Technology) for superior wind resistance." },
                { label: "DRIP METAL", desc: "28 G Steel drip edge installed on the entire perimeter per manufacturer specifications for clean water diversion." },
                { label: "ICE & WATER SHIELD", desc: "Owens Corning WeatherLock® waterproofing membrane installed in all leak-prone areas (eaves and valleys). Installation meets IRC code (24\" past warm wall) and includes a RHIVE minimum of 6 feet of coverage at all eaves for superior, double-layer protection." },
                { label: "UNDERLAYMENT", desc: "Owens Corning ProArmor: A high-performance synthetic underlayment installed on the entire non-covered roof field as a secondary water-shedding barrier per system specifications." }
            ]
        },
        {
            groupId: "system",
            title: "PHASE 3: THE PERFORMANCE SYSTEM",
            icon: <Zap className="w-5 h-5 text-[var(--rhive-pink)]" />,
            items: [
                { label: "STARTER STRIP SHINGLES", desc: "Owens Corning Starter Strip Plus: A specialized shingle installed on all eaves for a straight edge and an effective perimeter seal against high winds." },
                { label: "FIELD SHINGLES", desc: "Owens Corning Duration Series Shingles: 50-Year Preferred Protection Shingles featuring SureNail Technology, 130 MPH Wind Rating, and guaranteed StreakGuard™ Algae Resistance 25YR. Includes all standard and Designer color options." },
                { label: "PROEDGE HIP & RIDGE", desc: "Owens Corning ProEdge Hip & Ridge Shingles: Provides an architectural, high-profile look while delivering enhanced system performance and 130 mph wind resistance on all hips and ridges." }
            ]
        },
        {
            groupId: "precision",
            title: "PHASE 4: PRECISION FINISHING",
            icon: <Gauge className="w-5 h-5" />,
            items: [
                { label: "PIPE FLASHINGS", desc: "Full Metal Pipe Jacks for lifetime longevity - all jackets replaced, sealed, and painted." },
                { label: "FLASHING", desc: "28 G Steel used for all penetrations: L-Metal for headwalls, and Step Flashing (woven) to meet and often exceed IRC height/lap requirements at sidewalls. New flashing is 4 in×4 in×8 in to maximize coverage." },
                { label: "VENTILATION", desc: "Balanced Ventsure System: Exhaust uses Sky Runner LTE or 4-Foot Strip Ridge Vent (for high NFVA). Intake is via soffit or deck-mount air for non-soffit roofs. (Turbines used only for hipped roofs; all turtle vents are permanently canceled and replaced by the balanced system.)" },
                { label: "CLEAR UV-RATED SEALANT", desc: "High-performance, UV-rated sealant applied on all pipe jacks and penetration locations. This superior material is designed for long-term maintenance, significantly reducing the need for pipe jack replacement." },
                { label: "ROOF CEMENT", desc: "Asphalt-based cement used only as a supplemental adhesive or sealant for cut shingle edges and manufacturer-specified locations." }
            ]
        },
        {
            groupId: "maintenance",
            title: "PHASE 5: FINALIZATION & MAINTENANCE",
            icon: <Calendar className="w-5 h-5" />,
            items: [
                { label: "SITE LOGISTICS & FINAL CLEANUP", desc: "Comprehensive magnetic sweep of the entire property, end-of-shift debris removal, and final site inspection to ensure no waste remains." },
                { label: "CERTIFICATE OF COMPLETION", desc: "Issued upon final inspection, this Certificate formally confirms project completion and activates all manufacturer and workmanship warranties." },
                { label: "COMPLIMENTARY MAINTENANCE INSPECTIONS", desc: "A complimentary, scheduled system check provided upon request. Schedule: Annual for the first two years, then biennial (every other year) until year 15, then annual thereafter. Purpose: Focuses on proactive maintenance, checking all pipe seals and flashing integrity, and identifying any maintenance requirements or debris to ensure system longevity." }
            ]
        }
    ];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-8">
            <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={onClose}></div>

            <div className="relative z-10 w-full max-w-5xl max-h-[90vh] flex flex-col bg-[#0a0a0a] border border-white/10 shadow-2xl overflow-hidden"
                style={{ clipPath: 'polygon(32px 0, 100% 0, 100% calc(100% - 32px), calc(100% - 32px) 100%, 0 100%, 0 32px)' }}
            >
                {/* Header */}
                <div className="p-8 border-b border-[var(--rhive-pink)]/20 flex justify-between items-center bg-[#0a0a0a] sticky top-0 z-20">
                    <div className="flex items-center gap-6">
                        <div className="p-4 bg-[var(--rhive-pink)] text-white shadow-[0_0_20px_rgba(236,2,139,0.4)]"
                            style={{ clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)' }}
                        >
                            <Shield className="w-8 h-8" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-white uppercase tracking-tighter text-left flex items-center gap-4">
                                O.C. DURATION <span className="text-[var(--rhive-pink)]">FOUNDATION</span>
                                <img src="/oc-logo.png" alt="OC Preferred" className="h-8 grayscale group-hover:grayscale-0 transition-all opacity-80" />
                            </h2>
                            <p className="text-[var(--rhive-pink)] font-mono text-xs uppercase tracking-[0.3em] mt-1 italic font-bold text-left">Comprehensive System Specification</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-12 h-12 border border-white/10 rounded-full flex items-center justify-center text-gray-500 hover:text-white hover:border-[var(--rhive-pink)] hover:bg-[var(--rhive-pink)]/10 transition-all"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-grow overflow-y-auto p-8 custom-scrollbar bg-[radial-gradient(circle_at_top_right,_rgba(236,2,139,0.05),_transparent_70%)]">

                    <div className="mb-12 p-8 bg-[var(--rhive-pink)]/5 border border-[var(--rhive-pink)]/20 relative group">
                        <div className="absolute top-0 right-0 w-32 h-32 opacity-10 pointer-events-none overflow-hidden">
                            <div className="absolute top-4 right-4 text-[var(--rhive-pink)]">
                                <Activity className="w-24 h-24" />
                            </div>
                        </div>
                        <h3 className="text-white font-black text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Shield className="w-4 h-4 text-[var(--rhive-pink)]" /> System Overview
                        </h3>
                        <p className="text-gray-300 font-serif text-lg leading-relaxed italic text-left">
                            Premium roofing solution featuring Owens Corning Duration shingles. This system delivers commercial-grade durability built for the toughest Western weather and is backed by our Lifetime No-Leak Guarantee and 50-Year Material Warranty. It is engineered for lasting value across homes, businesses, and multifamily properties.
                        </p>
                    </div>

                    {/* VISUAL SHOWCASE: SHINGLE DETAIL & PAST JOBS */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                        <div className="relative group overflow-hidden border border-white/10"
                            style={{ clipPath: 'polygon(24px 0, 100% 0, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0 100%, 0 24px)' }}>
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10 opacity-60"></div>
                            <img
                                src="file:///C:/Users/mjrob/.gemini/antigravity/brain/462e8772-16d3-4861-a1ad-a0fe0967526a/oc_duration_shingle_detail_1772931649107.png"
                                alt="OC Duration Shingle Detail"
                                className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-[2s]"
                            />
                            <div className="absolute bottom-4 left-4 z-20">
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--rhive-pink)] bg-black/60 px-3 py-1 backdrop-blur-md">HARDWARE: DURATION SERIES</span>
                                <h4 className="text-white font-black text-xs mt-2 uppercase tracking-widest">SURENAIL® TECHNOLOGY FABRIC STRIP</h4>
                            </div>
                        </div>

                        <div className="relative group overflow-hidden border border-white/10"
                            style={{ clipPath: 'polygon(24px 0, 100% 0, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0 100%, 0 24px)' }}>
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10 opacity-60"></div>
                            <img
                                src="file:///C:/Users/mjrob/.gemini/antigravity/brain/462e8772-16d3-4861-a1ad-a0fe0967526a/premium_residential_roof_past_job_1772931661873.png"
                                alt="Premium Past Job Example"
                                className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-[2s]"
                            />
                            <div className="absolute bottom-4 left-4 z-20">
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400 bg-black/60 px-3 py-1 backdrop-blur-md">RHIVE DEPLOYMENT: PAST JOB</span>
                                <h4 className="text-white font-black text-xs mt-2 uppercase tracking-widest">CERTIFIED PREFERRED INSTALLATION</h4>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-16 text-left mb-16">
                        {sections.map((section, sIdx) => (
                            <div key={sIdx} className="space-y-8">
                                <div className="flex items-center gap-4 border-b border-white/10 pb-4">
                                    <div className="p-3 bg-white/5 border border-white/10 text-[var(--rhive-pink)] shadow-[0_0_15px_rgba(236,2,139,0.2)]">
                                        {section.icon}
                                    </div>
                                    <h4 className="text-xl font-black text-white uppercase tracking-tighter italic">{section.title}</h4>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {section.items?.map((item, iIdx) => (
                                        <div key={iIdx} className="group relative p-6 bg-white/[0.01] border border-white/5 hover:border-[var(--rhive-pink)]/40 transition-all duration-500 hover:bg-white/[0.03]">
                                            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-[var(--rhive-pink)]/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                            <div className="flex justify-between items-start mb-3">
                                                <h5 className="text-[11px] font-black text-[var(--rhive-pink)] uppercase tracking-[0.2em]">
                                                    {item.label}
                                                </h5>
                                                <CheckCircle2 className="w-4 h-4 text-gray-700 group-hover:text-green-500 transition-colors" />
                                            </div>
                                            <p className="text-gray-400 text-[12px] font-serif leading-relaxed group-hover:text-gray-200 transition-colors">
                                                {item.desc}
                                            </p>
                                        </div>
                                    ))}

                                    {/* Insert Warranty block strategically after Phase 2 */}
                                    {section.groupId === "foundation" && (
                                        <div className="md:col-span-2 mt-8">
                                            <div className="relative group perspective-[1200px]">
                                                <div className="absolute -inset-4 bg-[var(--rhive-pink)]/10 blur-3xl opacity-30 group-hover:opacity-60 transition-opacity duration-1000"></div>

                                                <div className="relative z-10 bg-[#070707]/80 border border-[var(--rhive-pink)]/30 p-10 shadow-2xl backdrop-blur-md"
                                                    style={{ clipPath: 'polygon(40px 0, 100% 0, 100% calc(100% - 40px), calc(100% - 40px) 100%, 0 100%, 0 40px)' }}>

                                                    <div className="flex items-center gap-6 mb-10">
                                                        <div className="p-4 bg-[var(--rhive-pink)] text-white shadow-[0_0_20px_rgba(236,2,139,0.5)] transform -skew-x-12">
                                                            <Award className="w-8 h-8" />
                                                        </div>
                                                        <div>
                                                            <h4 className="text-2xl font-black text-white uppercase tracking-tighter">WARRANTY ARCHITECTURE</h4>
                                                            <p className="text-[var(--rhive-pink)] font-mono text-xs font-bold uppercase tracking-[0.3em] italic">Dual-Shield Protection Logic</p>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                                        {/* RHIVE SIDE */}
                                                        <div className="relative pl-8 border-l-2 border-[var(--rhive-pink)]/50">
                                                            <div className="absolute -left-[9px] top-0 w-4 h-4 bg-[var(--rhive-pink)] rotate-45 shadow-[0_0_15px_rgba(236,2,139,1)]"></div>
                                                            <h5 className="text-xs font-black text-[var(--rhive-pink)] uppercase tracking-widest mb-4">RHIVE INSTALLER NO-LEAK GUARANTEE</h5>
                                                            <p className="text-gray-300 font-serif text-[13px] leading-relaxed italic border-b border-white/5 pb-4 mb-4">
                                                                "Covers 100% of repairs for any water intrusion caused by improper installation for the standard lifecycle of the roof."
                                                            </p>
                                                            <div className="flex items-center gap-3 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                                                                <Activity className="w-3 h-3 text-[var(--rhive-pink)]" />
                                                                <span>[ ACTIVE RHIVE INTERNAL PROTOCOL ]</span>
                                                            </div>
                                                        </div>

                                                        {/* OC SIDE */}
                                                        <div className="relative pl-8 border-l-2 border-cyan-500/30">
                                                            <div className="absolute -left-[9px] top-0 w-4 h-4 bg-cyan-500/50 rotate-45"></div>
                                                            <h5 className="text-xs font-black text-white uppercase tracking-widest mb-4 italic">OC PREFERRED PROTECTION (TOTAL SYSTEM)</h5>
                                                            <p className="text-gray-400 font-serif text-[13px] leading-relaxed border-b border-white/5 pb-4 mb-4">
                                                                50 Years Non-Prorated Material & Labor. Includes 10-Year Workmanship backup from OC if RHIVE goes out of business.
                                                            </p>
                                                            <div className="flex items-center gap-3 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                                                                <img src="/oc-logo.png" alt="OC" className="h-4 grayscale invert opacity-70" />
                                                                <span>[ MANUFACTURER BONDED ]</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Substitution Note */}
                    <div className="mt-16 p-6 border border-yellow-500/20 bg-yellow-500/5 backdrop-blur-sm">
                        <div className="flex items-start gap-4">
                            <AlertCircle className="w-5 h-5 text-yellow-500 mt-1" />
                            <div>
                                <h5 className="text-[10px] font-black text-yellow-500 uppercase tracking-widest mb-1">SYSTEM PROTOCOL 01: SUBSTITUTIONS</h5>
                                <p className="text-gray-400 text-[11px] font-serif italic">
                                    RHIVE Construction may substitute materials with those of the same kind and quality only if the specified material is unavailable and will ensure all manufacturer warranty requirements remain fully intact.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Footer Info */}
                    <div className="mt-16 p-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8 bg-black/40">
                        <div className="flex items-center gap-4">
                            <img src="/oc-logo.png" alt="Owens Corning" className="h-8 opacity-100 transition-all cursor-crosshair" />
                            <div className="h-8 w-[1px] bg-white/10"></div>
                            <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest text-left">
                                Certified Preferred <br /> Contractor System
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <button className="px-6 py-3 border border-white/10 text-white font-black uppercase text-[10px] tracking-widest hover:bg-white hover:text-black transition-all">
                                Download Full Spec PDF
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShingleDurationLightbox;
