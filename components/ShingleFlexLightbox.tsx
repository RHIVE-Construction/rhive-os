import React from 'react';
import { Shield, CheckCircle2, X, Zap, Award, Info, AlertOctagon, TrendingDown, Activity } from 'lucide-react';

interface ShingleFlexLightboxProps {
    isOpen: boolean;
    onClose: () => void;
}

const ShingleFlexLightbox: React.FC<ShingleFlexLightboxProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-8">
            <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={onClose}></div>

            <div className="relative z-10 w-full max-w-4xl bg-[#0a0a0a] border border-white/10 shadow-2xl overflow-hidden"
                style={{ clipPath: 'polygon(32px 0, 100% 0, 100% calc(100% - 32px), calc(100% - 32px) 100%, 0 100%, 0 32px)' }}
            >
                {/* Header */}
                <div className="p-8 border-b border-[#00D1FF]/20 flex justify-between items-center bg-[#0a0a0a] sticky top-0 z-20">
                    <div className="flex items-center gap-6">
                        <div className="p-4 bg-[#00D1FF] text-black shadow-[0_0_20px_rgba(0,209,255,0.4)]"
                            style={{ clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)' }}
                        >
                            <Zap className="w-8 h-8" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-white uppercase tracking-tighter text-left flex items-center gap-4">
                                FLEX - <span className="text-[#00D1FF]">UPGRADE</span>
                                <img src="/oc-logo.png" alt="OC Preferred" className="h-8 grayscale brightness-200" />
                            </h2>
                            <p className="text-[#00D1FF] font-mono text-xs uppercase tracking-[0.3em] mt-1 font-bold text-left">Class 4 Hail & Impact Defense</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-12 h-12 border border-white/10 rounded-full flex items-center justify-center text-gray-500 hover:text-white hover:border-[#00D1FF] hover:bg-[#00D1FF]/10 transition-all"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-10 bg-[radial-gradient(circle_at_top_right,_rgba(0,209,255,0.05),_transparent_70%)] text-left">
                    <p className="text-gray-300 font-serif text-lg leading-relaxed mb-12 italic border-l-2 border-[#00D1FF] pl-6 text-left">
                        This premium upgrade includes all the components, guarantees, and certified installation standards of the Performance Roofing Package, fortified with specialized components to deliver maximum protection against extreme weather.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                        <div className="p-6 border border-white/10 bg-white/5 transition-all hover:border-[#00D1FF]/40">
                            <div className="flex items-center gap-3 mb-4">
                                <AlertOctagon className="w-5 h-5 text-[#00D1FF]" />
                                <h4 className="text-white font-black text-[10px] uppercase tracking-widest text-left">Impact Resistance</h4>
                            </div>
                            <p className="text-gray-400 text-xs font-serif leading-relaxed text-left">
                                Class 4 Rating: Provides the industry's highest level of protection against hail and storm debris, reducing future damage risk.
                            </p>
                        </div>
                        <div className="p-6 border border-white/10 bg-white/5 transition-all hover:border-[#00D1FF]/40">
                            <div className="flex items-center gap-3 mb-4">
                                <TrendingDown className="w-5 h-5 text-[#00D1FF]" />
                                <h4 className="text-white font-black text-[10px] uppercase tracking-widest text-left">Insurance ROI</h4>
                            </div>
                            <p className="text-gray-400 text-xs font-serif leading-relaxed text-left">
                                Potential Premium Discounts: Many carriers offer substantial discounts for certified Class 4 roofs, providing long-term ROI.
                            </p>
                        </div>
                        <div className="p-6 border border-white/10 bg-white/5 transition-all hover:border-[#00D1FF]/40">
                            <div className="flex items-center gap-3 mb-4">
                                <Activity className="w-5 h-5 text-[#00D1FF]" />
                                <h4 className="text-white font-black text-[10px] uppercase tracking-widest text-left">Polymer Modified</h4>
                            </div>
                            <p className="text-gray-400 text-xs font-serif leading-relaxed text-left">
                                Superior Flexibility: SBS Modified asphalt resists cracking during extreme temperature shifts and absorbs high-velocity impacts.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-black/40 border border-white/5 p-8">
                            <div className="text-[10px] font-black text-[#00D1FF] uppercase tracking-[0.3em] mb-4 text-left">Upgraded Components</div>
                            <div className="space-y-8">
                                <div>
                                    <h5 className="text-white font-bold text-sm uppercase mb-2 flex items-center gap-2 text-left">
                                        <span className="w-1.5 h-1.5 bg-[#00D1FF] rounded-full"></span> FIELD SHINGLES
                                    </h5>
                                    <p className="text-gray-400 text-xs font-serif leading-relaxed ml-3.5 italic text-left">
                                        Upgrade: Owens Corning Duration FLEX® Shingles: 50-Year Preferred Protection, Class 4 Impact Rated featuring SureNail Technology and StreakGuard™ Algae Resistance.
                                    </p>
                                </div>
                                <div className="border-t border-white/5 pt-6">
                                    <h5 className="text-white font-bold text-sm uppercase mb-2 flex items-center gap-2 text-left">
                                        <span className="w-1.5 h-1.5 bg-[#00D1FF] rounded-full"></span> HIP & RIDGE SHINGLES
                                    </h5>
                                    <p className="text-gray-400 text-xs font-serif leading-relaxed ml-3.5 italic text-left">
                                        Upgrade: Owens Corning DuraRidge® Hip & Ridge Shingles: Specialized modified asphalt blend for superior flexibility and high-profile architectural depth.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 flex flex-col md:flex-row justify-between items-center gap-8 border-t border-white/10 pt-8 mt-16">
                        <div className="flex items-center gap-4">
                            <img src="/oc-logo.png" alt="Owens Corning" className="h-8 brightness-150" />
                            <div className="h-8 w-[1px] bg-white/10"></div>
                            <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest text-left">
                                Certified Preferred <br /> Contractor System
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="px-12 py-4 bg-[#00D1FF] text-black font-black uppercase tracking-widest text-[10px] hover:bg-white hover:scale-105 transition-all"
                            style={{ clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)' }}
                        >
                            Select FLEX Upgrade
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShingleFlexLightbox;
