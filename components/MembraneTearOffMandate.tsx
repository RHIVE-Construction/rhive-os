import React, { useState } from 'react';
import { AlertTriangle, Layers, Activity, CheckCircle2, ShieldCheck, X, FileText, ChevronRight } from 'lucide-react';
import { navigateToIntake } from '../lib/intakeRouting';

const MembraneTearOffMandate: React.FC = () => {
    const [isScanModalOpen, setIsScanModalOpen] = useState(false);

    return (
        <section className="py-24 bg-[#0a0a0a] border-y border-[var(--border-color)] relative overflow-hidden">
            {/* Tech-Noir background grid */}
            <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-20"></div>
            
            <div className="max-w-7xl mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                
                {/* Visual Representation */}
                <div className="relative group perspective-[1000px]">
                    <div className="absolute -inset-4 bg-[var(--rhive-pink)]/20 blur-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-1000"></div>
                    
                    <div className="relative z-10 w-full h-full min-h-[440px] bg-black border border-white/10 flex flex-col items-center justify-center p-8 overflow-hidden"
                         style={{ clipPath: 'polygon(24px 0, 100% 0, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0 100%, 0 24px)' }}>
                        
                        {/* Mockup Visual */}
                        <div className="absolute inset-0 z-0">
                            <img src="/wood deck single ply.webp" alt="Commercial Tear-off" className="w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                            
                            {/* Scanning Line Effect */}
                            <div className="absolute top-0 left-0 w-full h-[1px] bg-[var(--rhive-pink)]/50 shadow-[0_0_15px_#ec028b] animate-[scan_4s_linear_infinite] overflow-hidden"></div>
                        </div>

                        <div className="relative z-20 flex flex-col items-center text-center space-y-6">
                            <div className="p-4 bg-black/60 border border-[var(--rhive-pink)]/30 backdrop-blur-md">
                                <Activity className="w-16 h-16 text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
                            </div>
                            <h3 className="text-2xl font-black uppercase tracking-widest text-white">THERMAL DIAGNOSTICS</h3>
                            <button 
                                onClick={() => setIsScanModalOpen(true)}
                                className="px-6 py-2 bg-[var(--rhive-pink)]/10 border border-[var(--rhive-pink)]/50 text-[var(--rhive-pink)] font-black text-base uppercase tracking-widest hover:bg-[var(--rhive-pink)] hover:text-white transition-all cursor-pointer shadow-[0_0_15px_rgba(236,2,139,0.2)]"
                            >
                                VIEW MOISTURE SCAN
                            </button>
                        </div>

                        <style dangerouslySetInnerHTML={{ __html: `
                            @keyframes scan {
                                0% { transform: translateY(0); }
                                100% { transform: translateY(440px); }
                            }
                        ` }} />
                    </div>
                </div>

                {/* Content */}
                <div>
                    <div className="flex items-center gap-3 mb-6">
                        <AlertTriangle className="w-5 h-5 text-[var(--rhive-pink)]" />
                        <span className="font-mono text-base font-bold uppercase tracking-[0.4em] text-[var(--rhive-pink)]">
                            Structural Integrity Mandate
                        </span>
                    </div>

                    <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-6 font-display leading-[1.0]">
                        FULL TEAR-OFF VS. <span className="text-[var(--rhive-pink)]">1-LAYER RE-COVER</span>
                    </h2>
                    
                    <p className="text-lg text-gray-300 font-sans leading-relaxed mb-6 border-l-2 border-[var(--rhive-pink)] pl-6">
                        Code legally permits recovering existing commercial roofs if no wet insulation is found. We refuse to compromise your building's structural integrity or energy efficiency on a guess. <span className="text-[var(--rhive-pink)] font-bold">Re-roofing over wet or degraded polyiso</span> traps moisture, destroys thermal performance (R-Value), and <span className="text-[var(--rhive-pink)] font-bold">instantly voids NDL manufacturer warranties.</span>
                    </p>

                    <div className="space-y-4 mb-8">
                        {/* 1. Best Practice (Full Tear-Off) */}
                        <div className="p-4 bg-white/[0.03] border border-white/10 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                                <ShieldCheck className="w-5 h-5 text-rhive-pink shrink-0" />
                                <h4 className="text-white font-bold text-sm uppercase tracking-wide">
                                    Best Practice: Full Tear-Off to Structural Decking
                                </h4>
                            </div>
                            <p className="text-xs text-gray-300 font-serif leading-relaxed pl-7">
                                Tearing all the way down to the structural decking (steel, concrete, or wood) is always best practice. It provides 100% visibility into structural deck integrity and is mandatory under IBC Chapter 15 whenever there are 2+ roof layers or wet/damaged insulation.
                            </p>
                        </div>

                        {/* 2. How RHIVE Executes a 1-Layer Re-Cover */}
                        <div className="p-4 bg-white/[0.03] border border-white/10 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                                <CheckCircle2 className="w-5 h-5 text-rhive-gold shrink-0" />
                                <h4 className="text-white font-bold text-sm uppercase tracking-wide">
                                    How RHIVE Executes a 1-Layer Re-Cover
                                </h4>
                            </div>
                            <p className="text-xs text-gray-300 font-serif leading-relaxed pl-7">
                                When a building has strictly 1 existing layer and qualifies for a Re-Cover, unlike standard industry practices that simply slit or leave old degraded membrane in place (which traps moisture and conceals rot), RHIVE tears off the existing top membrane down to the insulation/substrate. We thoroughly inspect 100% of the substrate, replace any soiled or damaged polyiso, and install new fanfold cover board and a brand-new membrane—so it is a completely new, 100% manufacturer-warrantable system over verified substrate and decking.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 items-center">
                        <button
                            onClick={() => navigateToIntake({ category: 'Commercial', intent: 'Inspection' })}
                            className="w-full sm:w-auto px-8 py-4 bg-rhive-pink text-white font-black text-xs uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all cursor-pointer shadow-[0_0_20px_rgba(236,2,139,0.4)]"
                            style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}
                        >
                            Schedule Commercial Core Diagnostics
                        </button>
                    </div>
                </div>

            </div>

            {/* Interactive Thermal Diagnostics & Moisture Scan Modal */}
            {isScanModalOpen && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-md animate-fade-in">
                    <div 
                        className="relative w-full max-w-3xl bg-black border border-white/20 p-6 sm:p-8 rounded-2xl shadow-[0_0_50px_rgba(236,2,139,0.25)] overflow-hidden"
                        style={{ clipPath: 'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)' }}
                    >
                        {/* Modal Header */}
                        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-red-500/10 border border-red-500/30 rounded">
                                    <Activity className="w-5 h-5 text-red-500" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-black uppercase tracking-tight text-white">
                                        Thermal Infrared Diagnostics &amp; Moisture Scan
                                    </h3>
                                    <span className="text-xs font-mono text-gray-400">
                                        Non-Destructive Core Moisture Entrapment Verification
                                    </span>
                                </div>
                            </div>
                            <button 
                                onClick={() => setIsScanModalOpen(false)}
                                className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                                aria-label="Close"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="space-y-6 text-left">
                            <div className="relative rounded-xl overflow-hidden border border-white/15 h-48 sm:h-60 bg-zinc-950 flex items-center justify-center">
                                <img 
                                    src="/wood deck single ply.webp" 
                                    alt="Thermal scan sample" 
                                    className="w-full h-full object-cover opacity-50"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                                <div className="absolute inset-0 flex flex-col justify-between p-4">
                                    <div className="flex justify-between items-center text-[10px] font-mono uppercase">
                                        <span className="bg-black/80 px-2.5 py-1 rounded border border-white/20 text-cyan-400">FLIR Infrared Thermography</span>
                                        <span className="bg-rhive-pink/20 text-rhive-pink px-2.5 py-1 rounded border border-rhive-pink/40">Active Diagnostic Mode</span>
                                    </div>
                                    <div className="bg-black/85 backdrop-blur-sm border border-white/10 p-3 rounded-lg text-xs space-y-1">
                                        <div className="text-white font-bold font-mono">Verification Parameters:</div>
                                        <div className="text-gray-300 font-serif">✓ Substrate Moisture Level: 0.0% Trapped Moisture Qualified</div>
                                        <div className="text-gray-300 font-serif">✓ Structural Deck Integrity: Verified Steel/Wood Load-Bearing Standard</div>
                                        <div className="text-gray-300 font-serif">✓ Utah Building Code IBC Chapter 15: Fully Compliant for 1-Layer Re-Cover or Full Tear-Off</div>
                                    </div>
                                </div>
                            </div>

                            <p className="text-xs sm:text-sm text-gray-300 font-serif leading-relaxed">
                                Before RHIVE specifies any commercial flat roof replacement or 1-layer re-cover, our certified technicians conduct comprehensive non-destructive moisture surveys and core sampling. This prevents trapped water from rotting your deck or voiding your 30-year GAF NDL manufacturer warranty.
                            </p>

                            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-white/10">
                                <button
                                    onClick={() => setIsScanModalOpen(false)}
                                    className="px-6 py-2.5 border border-white/20 text-white font-bold text-xs uppercase tracking-wider hover:bg-white/10 rounded transition-all cursor-pointer"
                                >
                                    Close
                                </button>
                                <button
                                    onClick={() => {
                                        setIsScanModalOpen(false);
                                        navigateToIntake({ category: 'Commercial', intent: 'Inspection' });
                                    }}
                                    className="px-6 py-2.5 bg-rhive-pink text-white font-black text-xs uppercase tracking-widest hover:brightness-110 active:scale-95 rounded transition-all cursor-pointer shadow-[0_0_15px_rgba(236,2,139,0.4)]"
                                >
                                    Schedule Commercial Moisture Scan
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default MembraneTearOffMandate;
