import React, { useState } from 'react';
import { Building2, TrendingUp, ShieldCheck, Activity, Target, HardHat } from 'lucide-react';
import CapExDiagnosticLightbox from './CapExDiagnosticLightbox.tsx';

const CommercialCapExCTA: React.FC = () => {
    const [lightboxOpen, setLightboxOpen] = useState(false);

    return (
        <section className="py-24 bg-[#050505] relative overflow-hidden border-t border-white/5">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    
                    {/* Left Content */}
                    <div className="text-left">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-[var(--rhive-pink)]/10 border border-[var(--rhive-pink)]/30 rounded-full flex items-center justify-center">
                                <Activity className="w-6 h-6 text-[var(--rhive-pink)]" />
                            </div>
                            <div className="text-[var(--rhive-pink)] text-base font-black uppercase tracking-[0.4em]">Strategic Portfolio Management</div>
                        </div>
                        
                        <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter text-white mb-6 leading-none">
                            10-YEAR <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--rhive-pink)] to-purple-600">CAPEX</span><br />
                            INTELLIGENCE.
                        </h2>
                        
                        <p className="text-gray-400 font-sans text-lg leading-relaxed mb-8 max-w-xl">
                            Stop reacting to leaks. We provide full company-wide roof inspections to put into perspective your budgets over the next decade. A comprehensive strategy for preserving, repairing, maintaining, and planning for your largest asset.
                        </p>

                        <div className="grid grid-cols-2 gap-6 mb-12">
                            <div className="border-l-2 border-[var(--rhive-pink)] pl-4">
                                <div className="text-white font-black text-xl mb-1 tracking-tight">HOA & Multi-Family</div>
                                <div className="text-gray-500 text-base uppercase tracking-widest">Neighborhood Scale</div>
                            </div>
                            <div className="border-l-2 border-[var(--rhive-pink)] pl-4">
                                <div className="text-white font-black text-xl mb-1 tracking-tight">Industrial Parks</div>
                                <div className="text-gray-500 text-base uppercase tracking-widest">Enterprise Assets</div>
                            </div>
                        </div>

                        <button 
                            onClick={() => setLightboxOpen(true)}
                            className="group relative inline-flex items-center gap-4 px-8 py-5 bg-[var(--rhive-pink)] text-white font-black uppercase tracking-[0.2em] text-base transition-all hover:bg-white hover:text-black shadow-[0_0_20px_rgba(236,2,139,0.4)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)]"
                            style={{ clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)' }}
                        >
                            <span>Request CapEx Diagnostic</span>
                            <Target className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                        </button>
                    </div>

                    {/* Right Tech Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2 md:col-span-1 space-y-4">
                            <div className="bg-black/40 border border-white/10 p-6 backdrop-blur-md group hover:border-[var(--rhive-pink)]/50 transition-colors">
                                <TrendingUp className="w-8 h-8 text-gray-500 group-hover:text-[var(--rhive-pink)] mb-4 transition-colors" />
                                <h3 className="text-white font-black tracking-widest text-base mb-2 uppercase">Financial Predictability</h3>
                                <p className="text-gray-500 text-base leading-relaxed">Exact cost projections for 1, 3, 5, and 10-year horizons.</p>
                            </div>
                            <div className="bg-black/40 border border-white/10 p-6 backdrop-blur-md group hover:border-[var(--rhive-pink)]/50 transition-colors">
                                <Building2 className="w-8 h-8 text-gray-500 group-hover:text-[var(--rhive-pink)] mb-4 transition-colors" />
                                <h3 className="text-white font-black tracking-widest text-base mb-2 uppercase">Portfolio Standardization</h3>
                                <p className="text-gray-500 text-base leading-relaxed">Unified system specifications across all physical locations.</p>
                            </div>
                        </div>
                        <div className="col-span-2 md:col-span-1 space-y-4 md:mt-12">
                            <div className="bg-black/40 border border-white/10 p-6 backdrop-blur-md group hover:border-[var(--rhive-pink)]/50 transition-colors">
                                <ShieldCheck className="w-8 h-8 text-gray-500 group-hover:text-[var(--rhive-pink)] mb-4 transition-colors" />
                                <h3 className="text-white font-black tracking-widest text-base mb-2 uppercase">Liability Mitigation</h3>
                                <p className="text-gray-500 text-base leading-relaxed">Identify and neutralize structural risks before interior failure.</p>
                            </div>
                            <div className="bg-gradient-to-br from-[var(--rhive-pink)]/20 to-black/40 border border-[var(--rhive-pink)]/30 p-6 backdrop-blur-md">
                                <HardHat className="w-8 h-8 text-[var(--rhive-pink)] mb-4" />
                                <h3 className="text-white font-black tracking-widest text-base mb-2 uppercase">Certified Execution</h3>
                                <p className="text-gray-400 text-base leading-relaxed">Backed by GAF Master Select and OC Preferred protections.</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <CapExDiagnosticLightbox isOpen={lightboxOpen} onClose={() => setLightboxOpen(false)} />
        </section>
    );
};

export default CommercialCapExCTA;
