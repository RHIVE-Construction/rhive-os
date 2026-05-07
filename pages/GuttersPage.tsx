import React from 'react';
import { Droplets, ShieldCheck, Ruler, Fan, Anchor, ArrowRight, Cog, LayoutGrid, CheckCircle2 } from 'lucide-react';
import { useNavigation } from '../contexts/NavigationContext';
import PlexusShape from '../components/PlexusShape';
import { roofComponents } from '../data/roofComponentsData';

const GuttersPage = () => {
    const { setActivePageId } = useNavigation();

    // Pull the gutter data we aggregated
    const gutterData = roofComponents.find(c => c.category === 'Gutters');

    const scrollToSystems = () => {
        const element = document.getElementById('base-foundation');
        element?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="bg-black text-white min-h-screen font-sans selection:bg-[var(--rhive-pink)] selection:text-white pt-20">

            {/* HERO SECTION */}
            <section className="relative aspect-video w-full max-h-screen flex items-center justify-center overflow-hidden border-b border-white/10 group">
                <div className="absolute inset-0 z-0 bg-black">
                    <div
                        className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:opacity-60 group-hover:scale-105 transition-all duration-[2s] ease-out filter grayscale mix-blend-luminosity"
                        style={{ backgroundImage: `url(/components/real_seamless_gutter_1773772866806.png)` }}
                    ></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black z-10"></div>
                </div>

                <div className="absolute inset-0 z-20">
                    <PlexusShape backgroundColor="transparent" dotColor="#ec028b" lineColor="236, 2, 139" density={40} />
                </div>

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl aspect-square bg-[var(--rhive-pink)]/10 blur-[130px] rounded-full z-10" />

                <div className="relative z-30 text-center px-4 max-w-5xl">
                    <div className="inline-flex items-center gap-2 border border-[var(--rhive-pink)]/30 px-6 py-2 bg-[var(--rhive-pink)]/10 mb-8 backdrop-blur-md">
                        <Droplets className="w-4 h-4 text-[var(--rhive-pink)]" />
                        <span className="text-[var(--rhive-pink)] font-black text-base uppercase tracking-[0.4em]">Water Management Diagnostics</span>
                    </div>

                    <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-8 text-white leading-none drop-shadow-2xl font-sans">
                        GUTTER <span className="text-[var(--rhive-pink)]">DEFENSE</span>
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-300 font-sans mb-12 max-w-prose mx-auto leading-relaxed drop-shadow-lg">
                        Complete water management systems engineered to exact architectural specifications. Featuring flawless seamless execution manufactured instantly on-site.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <button
                            onClick={() => setActivePageId('P-12')}
                            className="group relative px-10 py-5 bg-[var(--rhive-pink)] text-white font-black uppercase text-base tracking-[0.2em] hover:scale-105 transition-all shadow-[0_0_30px_rgba(236,2,139,0.3)]"
                            style={{ clipPath: 'polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)' }}
                        >
                            Request Certified Quote
                        </button>
                        <button
                            onClick={scrollToSystems}
                            className="px-10 py-5 border border-white/10 text-white font-bold uppercase text-base tracking-[0.2em] hover:bg-white/5 transition-all backdrop-blur-md"
                            style={{ clipPath: 'polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)' }}
                        >
                            Review Matrix Specs
                        </button>
                    </div>
                </div>
            </section>

            {/* BASE FOUNDATION SECTION */}
            <section id="base-foundation" className="py-20 bg-black relative border-y border-white/5">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-[2px] bg-[var(--rhive-pink)]"></div>
                            <span className="font-mono text-base font-bold uppercase tracking-[0.4em] text-[var(--rhive-pink)] drop-shadow-[0_0_8px_rgba(236,2,139,0.5)]">
                                Core Component Architecture
                            </span>
                        </div>

                        <h2 className="text-5xl md:text-6xl font-black text-white uppercase tracking-tighter mb-4 font-display leading-[0.85]">
                            ARCHITECTURAL <span className="text-[var(--rhive-pink)] block text-4xl mt-2">SEAMLESS GUTTERS</span>
                        </h2>
                        
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--rhive-pink)]/10 border border-[var(--rhive-pink)]/30 mb-6">
                            <CheckCircle2 className="w-3 h-3 text-[var(--rhive-pink)]" />
                            <span className="text-base font-black uppercase tracking-widest text-white">RHIVE QUALITY STANDARD VERIFIED</span>
                        </div>
                        
                        <p className="text-xl text-gray-300 font-sans leading-relaxed max-w-prose mb-12 border-l-2 border-[var(--rhive-pink)] pl-6">
                            {gutterData?.description}
                        </p>

                        <div className="space-y-8 mb-12">
                            <div className="flex items-start gap-6 group">
                                <div className="p-3 bg-white/5 border border-white/10 text-[var(--rhive-pink)] group-hover:bg-[var(--rhive-pink)] group-hover:text-white transition-all">
                                    <ShieldCheck className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="text-white font-black text-base uppercase tracking-widest mb-1">Dual-Protection Warranty</h4>
                                    <p className="text-gray-500 text-base text-balance">
                                        {gutterData?.guarantee.installation} • {gutterData?.guarantee.materials}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative group perspective-[1000px]">
                        <div className="absolute -inset-4 bg-[var(--rhive-pink)]/20 blur-3xl rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-1000"></div>

                        <div className="relative z-10 w-full h-full min-h-[450px] bg-[#0A0A0A] border border-white/10 group-hover:border-[var(--rhive-pink)]/50 transition-all duration-700 flex flex-col p-8 overflow-hidden shadow-2xl"
                            style={{ clipPath: 'polygon(24px 0, 100% 0, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0 100%, 0 24px)', transformStyle: 'preserve-3d' }}>

                            <div className="absolute inset-0 z-0">
                                <img
                                    src="/components/real_seamless_gutter_1773772866806.png"
                                    className="w-full h-full object-cover opacity-30 group-hover:opacity-60 transition-opacity duration-1000"
                                    alt="RHIVE Gutter System"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
                            </div>

                            <div className="relative z-20 flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 flex items-center justify-center bg-[var(--rhive-pink)]/10 rounded-full border border-[var(--rhive-pink)]/30">
                                    <Cog className="w-6 h-6 text-[var(--rhive-pink)]" />
                                </div>
                                <h3 className="text-2xl font-black text-white uppercase tracking-widest font-sans">Execution Blueprint</h3>
                            </div>

                            <div className="space-y-4 flex-grow relative z-20 mt-auto">
                                {gutterData?.blueprint.map((bp, idx) => (
                                    <div key={idx} className="flex items-start gap-4 bg-black/60 backdrop-blur-md border border-white/10 p-4 hover:border-[var(--rhive-pink)] transition-colors group/bp">
                                        <div className="text-[var(--rhive-pink)] mt-1">
                                            <Anchor className="w-4 h-4" />
                                        </div>
                                        <p className="text-base text-gray-300 leading-relaxed font-sans max-w-prose">{bp}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* OPTIONS MATRIX */}
            <section className="py-24 bg-[#050505] border-t border-[var(--rhive-pink)]/20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col items-center text-center mb-16">
                        <div className="text-[var(--rhive-pink)] text-base font-black uppercase tracking-[0.4em] mb-4 drop-shadow-[0_0_5px_rgba(236,2,139,0.8)]">Profile Configuration</div>
                        <h2 className="text-4xl md:text-5xl leading-tight font-black uppercase tracking-tighter text-white mb-6">ARCHITECTURAL <span className="text-gray-500">PROFILES</span></h2>
                        <p className="text-gray-400 max-w-prose text-base md:text-lg leading-relaxed text-center">We offer multiple configurations to match the geometric and hydrological requirements of your specific structure.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {gutterData?.options?.map((opt, i) => (
                            <div key={i} className="group relative bg-[#0A0A0A] border border-white/10 p-6 hover:border-[var(--rhive-pink)]/50 transition-all duration-300"
                                style={{ clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)' }}>
                                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-[var(--rhive-pink)]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <LayoutGrid className="w-6 h-6 text-[var(--rhive-pink)] mb-4" />
                                <h3 className="text-lg font-black text-white uppercase tracking-tighter mb-3 leading-tight">{opt}</h3>
                                <p className="text-base text-gray-400 leading-relaxed font-sans line-clamp-4 group-hover:line-clamp-none transition-all duration-500">
                                    {gutterData.optionDescriptions?.[opt] || "High-performance seamless configuration."}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

        </div>
    );
};

export default GuttersPage;
