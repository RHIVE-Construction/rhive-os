import React from 'react';
import { AlertTriangle, Layers, ShieldX } from 'lucide-react';

const NoLayoversSection = () => {
    return (
        <section className="py-24 bg-[#0a0a0a] border-y border-[var(--border-color)] relative overflow-hidden">
            {/* Tech-Noir background grid */}
            <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-20"></div>
            
            <div className="max-w-7xl mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                
                {/* Visual Representation */}
                <div className="relative group perspective-[1000px]">
                    <div className="absolute -inset-4 bg-[var(--rhive-pink)]/20 blur-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-1000"></div>
                    
                    <div className="relative z-10 w-full h-full min-h-[400px] bg-black border border-white/10 flex flex-col items-center justify-center p-8 overflow-hidden"
                         style={{ clipPath: 'polygon(24px 0, 100% 0, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0 100%, 0 24px)' }}>
                        
                        {/* Video Mockup Visual */}
                        <div className="absolute inset-0 z-0">
                            <img src="https://images.unsplash.com/photo-1632759145351-1d592919f522?auto=format&fit=crop&q=80&w=800" alt="Roof Redecking" className="w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                            
                            {/* Scanning Line Effect */}
                            <div className="absolute top-0 left-0 w-full h-[1px] bg-[var(--rhive-pink)]/50 shadow-[0_0_15px_#ec028b] animate-[scan_4s_linear_infinite] overflow-hidden"></div>
                        </div>

                        <div className="relative z-20 flex flex-col items-center text-center space-y-6">
                            <div className="p-4 bg-black/60 border border-[var(--rhive-pink)]/30 backdrop-blur-md">
                                <ShieldX className="w-16 h-16 text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
                            </div>
                            <h3 className="text-2xl font-black uppercase tracking-widest text-white">REDECKING PROTOCOL</h3>
                            <button className="px-6 py-2 bg-[var(--rhive-pink)]/10 border border-[var(--rhive-pink)]/50 text-[var(--rhive-pink)] font-black text-[10px] uppercase tracking-widest hover:bg-[var(--rhive-pink)] hover:text-white transition-all">
                                PLAY PROCESS VIDEO
                            </button>
                        </div>

                        <style dangerouslySetInnerHTML={{ __html: `
                            @keyframes scan {
                                0% { transform: translateY(0); }
                                100% { transform: translateY(400px); }
                            }
                        ` }} />
                    </div>
                </div>

                {/* Content */}
                <div>
                    <div className="flex items-center gap-3 mb-6">
                        <AlertTriangle className="w-5 h-5 text-[var(--rhive-pink)]" />
                        <span className="font-mono text-[11px] font-bold uppercase tracking-[0.4em] text-[var(--rhive-pink)]">
                            Structural Integrity Mandate
                        </span>
                    </div>

                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tighter mb-6 font-display leading-[0.9]">
                        THE RHIVE <span className="text-[var(--rhive-pink)]">ZERO-LAYOVER</span> POLICY
                    </h2>
                    
                    <p className="text-xl text-gray-300 font-sans leading-relaxed mb-8 border-l-2 border-[var(--rhive-pink)] pl-6">
                        Utah code legally permits up to two layers of shingles. We refuse to compromise your home's structural integrity to save a few dollars. <span className="text-[var(--rhive-pink)] font-bold">Re-roofing over existing shingles</span> traps blistering heat, hides critical deck rot, and <span className="text-[var(--rhive-pink)] font-bold">instantly voids premium manufacturer warranties.</span>
                    </p>

                    <div className="bg-white/5 border border-white/10 p-6 backdrop-blur-md mb-8 inline-block" style={{ clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)' }}>
                        <p className="text-white font-serif italic text-lg opacity-90">
                            "Doing a layover is like putting a new bandaid over an old bandaid and expecting it to perform well for a long time."
                        </p>
                    </div>

                    <div className="flex flex-col gap-4">
                        {[
                            { title: "Complete Deck Teardown", desc: "Every roof is stripped to the OSB deck for rigorous structural inspection." },
                            { title: "Maximum Lifespan Assured", desc: "Prevents excessive thermal trapping that bakes and destroys new asphalt." }
                        ].map((item, idx) => (
                            <div key={idx} className="flex gap-4 items-start">
                                <div className="mt-1 p-1 bg-[var(--rhive-pink)]/20 rounded border border-[var(--rhive-pink)]/50 shrink-0">
                                    <Layers className="w-4 h-4 text-[var(--rhive-pink)]" />
                                </div>
                                <div>
                                    <h4 className="text-white font-bold text-sm uppercase tracking-widest">{item.title}</h4>
                                    <p className="text-gray-400 text-xs font-sans mt-1">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
};

export default NoLayoversSection;
