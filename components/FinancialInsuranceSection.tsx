import React, { useState, useEffect } from 'react';
import { DollarSign, Umbrella, FileText, CheckCircle2 } from 'lucide-react';
import { useNavigation } from '../contexts/NavigationContext';

const FinancialInsuranceSection = () => {
    const { setActivePageId } = useNavigation();
    return (
        <section className="py-24 bg-[#0a0a0a] border-t border-[var(--border-color)] relative overflow-hidden">
            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes float-money {
                    0% { transform: translateY(0) rotate(0deg); opacity: 0; }
                    10% { opacity: 0.8; }
                    90% { opacity: 0.8; }
                    100% { transform: translateY(-100px) rotate(360deg); opacity: 0; }
                }
                @keyframes hail-fall {
                    0% { transform: translateY(-20px) translateX(0); opacity: 0; }
                    50% { opacity: 1; }
                    100% { transform: translateY(400px) translateX(20px); opacity: 0; }
                }
                .money-particle {
                    position: absolute;
                    animation: float-money 3s linear infinite;
                    pointer-events: none;
                }
                .hail-particle {
                    position: absolute;
                    background: white;
                    border-radius: 50%;
                    animation: hail-fall 1.5s linear infinite;
                    pointer-events: none;
                }
            ` }} />

            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    {/* Financing Block */}
                    <div className="relative group p-1 bg-gradient-to-br from-white/10 to-transparent transition-all duration-500 hover:from-[var(--rhive-pink)]/50"
                         style={{ clipPath: 'polygon(24px 0, 100% 0, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0 100%, 0 24px)' }}>
                        <div className="bg-black p-10 h-full relative overflow-hidden" style={{ clipPath: 'polygon(22px 0, 100% 0, 100% calc(100% - 22px), calc(100% - 22px) 100%, 0 100%, 0 22px)' }}>
                            
                            {/* Celebration Particles (Money) - ALWAYS ACTIVE */}
                            <div className="absolute inset-0 z-0 opacity-100 transition-opacity duration-500">
                                {[...Array(15)].map((_, i) => (
                                    <DollarSign 
                                        key={i} 
                                        className="money-particle text-[var(--rhive-pink)]/10" 
                                        style={{ 
                                            left: `${Math.random() * 100}%`, 
                                            bottom: `-20px`,
                                            animationDelay: `${Math.random() * 3}s`,
                                            fontSize: `${Math.random() * 20 + 10}px`
                                        }} 
                                    />
                                ))}
                            </div>

                            <div className="absolute -top-10 -right-10 text-[var(--rhive-pink)]/5 w-64 h-64 rotate-12 pointer-events-none">
                                <DollarSign className="w-full h-full" />
                            </div>
                            
                            <div className="flex items-center gap-3 mb-6 relative z-10">
                                <div className="p-3 bg-[var(--rhive-pink)]/10 border border-[var(--rhive-pink)]/30 text-[var(--rhive-pink)]">
                                    <DollarSign className="w-6 h-6" />
                                </div>
                                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.4em] text-[var(--rhive-pink)]">Enhancify Capital</span>
                            </div>

                            <h3 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4 font-sans relative z-10">
                                $0 DOWN <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--rhive-pink)] to-white block md:inline">0% APR</span>
                            </h3>

                            <p className="text-gray-400 font-sans text-sm leading-relaxed mb-8 relative z-10 pr-4">
                                Keep your capital liquid. Leverage our lending partnerships through Enhancify to access aggressive, zero-friction financing. Approval takes seconds, leaving your emergency funds completely untouched while securing the ultimate structural defense for your property.
                            </p>

                            <button className="px-8 py-4 bg-white/5 border border-white/20 text-white font-black text-[11px] uppercase tracking-widest hover:bg-[var(--rhive-pink)] hover:border-transparent transition-all shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:shadow-[0_0_30px_rgba(236,2,139,0.3)] relative z-10"
                                    style={{ clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)' }}>
                                Configure Finance Option
                            </button>
                        </div>
                    </div>

                    {/* Insurance Compliance Block - REBUILT */}
                    <div className="relative group p-1 bg-gradient-to-bl from-white/10 to-transparent transition-all duration-500 hover:from-[#08137C]/50"
                         style={{ clipPath: 'polygon(0 0, calc(100% - 24px) 0, 100% 24px, 100% 100%, 24px 100%, 0 calc(100% - 24px))' }}>
                        <div className="bg-black p-10 h-full relative overflow-hidden" style={{ clipPath: 'polygon(0 0, calc(100% - 22px) 0, 100% 22px, 100% 100%, 22px 100%, 0 calc(100% - 22px))' }}>
                            
                            {/* Hail/Storm Interaction - ALWAYS ACTIVE */}
                            <div className="absolute inset-0 z-0 opacity-100 transition-opacity duration-1000">
                                <div className="absolute inset-0 bg-[#08137C]/5 backdrop-blur-[1px]"></div>
                                {[...Array(30)].map((_, i) => (
                                    <div 
                                        key={i} 
                                        className="hail-particle" 
                                        style={{ 
                                            left: `${Math.random() * 100}%`, 
                                            top: `-10px`,
                                            width: `${Math.random() * 4 + 2}px`,
                                            height: `${Math.random() * 4 + 2}px`,
                                            animationDelay: `${Math.random() * 1.5}s`,
                                            opacity: Math.random() * 0.4 + 0.2
                                        }} 
                                    />
                                ))}
                            </div>

                            <div className="absolute bottom-0 right-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#08137C]/50 to-transparent -z-10 group-hover:scale-105 transition-transform duration-700"></div>
                            
                            <div className="absolute -top-10 -right-10 text-[#08137C]/10 w-64 h-64 -rotate-12 pointer-events-none">
                                <Umbrella className="w-full h-full" />
                            </div>

                            <div className="flex items-center gap-3 mb-6 relative z-10">
                                <div className="p-3 bg-[#08137C]/20 border border-[#08137C]/50 text-white">
                                    <Umbrella className="w-6 h-6" />
                                </div>
                                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.4em] text-white/50">Ethical Claim Support</span>
                            </div>

                            <h3 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4 font-sans relative z-10">
                                TRANSPARENT <span className="text-[#08137C] drop-shadow-[0_0_5px_rgba(8,19,124,0.8)]">EMPOWERING</span>
                            </h3>

                            <p className="text-gray-400 font-sans text-xs leading-relaxed mb-6 relative z-10 border-l-2 border-[#08137C] pl-4 italic uppercase tracking-wider font-bold">
                                We support your claim, we don't 'work' it.
                            </p>

                            <p className="text-gray-300 font-sans text-sm leading-relaxed mb-8 relative z-10 font-medium">
                                RHIVE provides the <strong>certified technical data and Dual-Math transparency</strong> required to ensure your insurance carrier awards a fair settlement based on manufacturer component specs and local building codes. No games, no rebates—just data-backed performance.
                            </p>

                            <button 
                                onClick={() => setActivePageId('P-13')}
                                className="px-8 py-4 bg-white/5 border border-white/20 text-white font-black text-[11px] uppercase tracking-widest hover:bg-[#08137C] hover:border-transparent transition-all shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:shadow-[0_0_30px_rgba(8,19,124,0.3)] relative z-10 flex items-center gap-3"
                                style={{ clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)' }}>
                                <FileText className="w-4 h-4" />
                                Insurance Data Hub
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default FinancialInsuranceSection;

