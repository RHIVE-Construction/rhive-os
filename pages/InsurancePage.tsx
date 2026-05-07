import React from 'react';
import { ShieldCheck, FileSearch, ClipboardCheck, HardHat, AlertTriangle, CloudHail, Wind, Droplets, ArrowRight } from 'lucide-react';
import { useNavigation } from '../contexts/NavigationContext';

const InsurancePage: React.FC = () => {
    const { setActivePageId } = useNavigation();

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-[var(--rhive-pink)]/30">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden border-b border-white/5">
                <div className="absolute inset-0 bg-gradient-to-b from-[#08137C]/10 to-transparent"></div>
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#08137C]/20 border border-[#08137C]/30 mb-6">
                        <ShieldCheck className="w-4 h-4 text-[#08137C]" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400">The Ethical Alternative</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6 leading-none">
                        Support Your Claim.<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-400 to-[#08137C]">Don't "Work" It.</span>
                    </h1>
                    <p className="max-w-2xl text-gray-400 text-lg leading-relaxed mb-10">
                        At RHIVE, we believe in radical transparency. We don't act as public adjusters or play games with deductibles. 
                        We provide the raw data, certified documentation, and technical expertise you need to ensure your insurance carrier awards a fair and code-compliant settlement.
                    </p>
                    <button 
                        onClick={() => setActivePageId('P-02a')}
                        className="group flex items-center gap-3 px-8 py-4 bg-white text-black font-black text-xs uppercase tracking-widest hover:bg-[#08137C] hover:text-white transition-all"
                        style={{ clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)' }}
                    >
                        Return to Asphalt Roofing
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </section>

            {/* The 4-Step Pipeline */}
            <section className="py-24 border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="mb-16">
                        <h2 className="text-3xl font-black uppercase tracking-tighter mb-2">The RHIVE Claims Pipeline</h2>
                        <div className="w-20 h-1 bg-[#08137C]"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                step: "01",
                                title: "Evidence Review",
                                icon: <FileSearch className="w-6 h-6" />,
                                desc: "Post-storm analytics. We review AI-supported photo reports to identify true insurance-qualified damage vs. maintenance wear."
                            },
                            {
                                step: "02",
                                title: "Carrier Coordination",
                                icon: <ClipboardCheck className="w-6 h-6" />,
                                desc: "We meet your adjuster onsite. Our mission is to ensure every component (flashing, valley, ridge) is accurately cataloged."
                            },
                            {
                                step: "03",
                                title: "Transparent Quoting",
                                icon: <ShieldCheck className="w-6 h-6" />,
                                desc: "We use Dual-Math precision to align with insurance estimates while maintaining high-end component specifications."
                            },
                            {
                                step: "04",
                                title: "Certified Install",
                                icon: <HardHat className="w-6 h-6" />,
                                desc: "Full rebuild with certified crews. We provide a comprehensive completion report to confirm the work for your carrier."
                            }
                        ].map((item, idx) => (
                            <div key={idx} className="relative p-8 bg-white/5 border border-white/10 hover:border-[#08137C]/50 transition-all group overflow-hidden" 
                                 style={{ clipPath: 'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)' }}>
                                <div className="absolute top-0 right-0 p-4 text-4xl font-black text-white/5 group-hover:text-[#08137C]/10 transition-colors font-mono">{item.step}</div>
                                <div className="p-3 bg-[#08137C]/10 border border-[#08137C]/20 text-[#08137C] w-fit mb-6 group-hover:scale-110 transition-transform">
                                    {item.icon}
                                </div>
                                <h4 className="text-xl font-bold uppercase tracking-tight mb-3 text-white">{item.title}</h4>
                                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Deductible Ethics Section */}
            <section className="py-24 bg-gradient-to-b from-transparent to-[#08137C]/5 border-b border-white/5">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-500 rounded-sm">
                        <AlertTriangle className="w-5 h-5" />
                        <span className="text-xs font-black uppercase tracking-widest">Industry Ethics Warning</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-8 leading-tight">
                        The "Deductible Game" <br />
                        <span className="text-red-500">Is a Legal Liability.</span>
                    </h2>
                    <p className="text-gray-300 text-lg leading-relaxed mb-10">
                        Contractors who offer to "absorb," "waive," or "rebate" your deductible are likely participating in insurance fraud. 
                        In many states, this practice can void your claim and lead to legal repercussions for the homeowner. 
                        RHIVE protects you by maintaining 100% legal and financial transparency. We provide a real quote for a real roof—never a "free" one.
                    </p>
                    <div className="bg-black/50 border border-white/10 p-8 text-left" style={{ clipPath: 'polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)' }}>
                        <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-4">Why we don't waive deductibles:</h4>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3 text-sm text-gray-400">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#08137C] mt-1.5 flex-shrink-0" />
                                <span>It undermines the legal contract between you and your carrier.</span>
                            </li>
                            <li className="flex items-start gap-3 text-sm text-gray-400">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#08137C] mt-1.5 flex-shrink-0" />
                                <span>It creates pressure to cut corners on material and labor quality.</span>
                            </li>
                            <li className="flex items-start gap-3 text-sm text-gray-400">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#08137C] mt-1.5 flex-shrink-0" />
                                <span>RHIVE's reputation (and your warranty) depends on ethical documentation.</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Damage Identifiers */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
                        <div>
                            <h2 className="text-3xl font-black uppercase tracking-tighter mb-2">Identify Storm Damage</h2>
                            <div className="w-20 h-1 bg-[#08137C]"></div>
                        </div>
                        <p className="max-w-md text-gray-400 text-sm italic">
                            These identifiers are often missed by untrained eyes, leading to thousands in future structural rot.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                title: "Hail Bruising",
                                icon: <CloudHail className="w-8 h-8" />,
                                color: "blue",
                                info: "Dents in soft metals (vents, flashings) and circular bruises on shingles that break the fiberglass mat."
                            },
                            {
                                title: "Wind Uplift",
                                icon: <Wind className="w-8 h-8" />,
                                color: "cyan",
                                info: "Creased shingles and 'granule-shaving' where high-speed wind rubs the shingle surface raw."
                            },
                            {
                                title: "Water Ingress",
                                icon: <Droplets className="w-8 h-8" />,
                                color: "indigo",
                                info: "Interior ceiling stains, compromised plumbing boots, and damp attic insulation after moderate rain."
                            }
                        ].map((item, idx) => (
                            <div key={idx} className="group p-10 bg-white/5 border border-white/10 hover:bg-[#08137C]/10 transition-all border-l-4 border-l-[#08137C]">
                                <div className="text-[#08137C] mb-6 group-hover:scale-110 transition-transform origin-left">{item.icon}</div>
                                <h4 className="text-2xl font-black uppercase tracking-tighter mb-4">{item.title}</h4>
                                <p className="text-gray-400 text-sm leading-relaxed">{item.info}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 bg-black relative border-t border-white/5">
                <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                    <h3 className="text-3xl font-black uppercase tracking-tighter mb-6 italic text-[#08137C]">Transparency is the new standard.</h3>
                    <p className="text-gray-400 mb-10 text-sm uppercase tracking-widest font-bold">Ready for a data-backed inspection?</p>
                    <button className="px-12 py-5 bg-[var(--rhive-pink)] text-white font-black text-sm uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(236,2,139,0.3)] hover:scale-105 transition-all">
                        Request Ethical Inspection
                    </button>
                </div>
            </section>
        </div>
    );
};

export default InsurancePage;
