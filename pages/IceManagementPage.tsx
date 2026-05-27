import React from 'react';
import { Snowflake, ShieldCheck, Zap, Cog, Activity, ThermometerSnowflake, LayoutGrid, CheckCircle2 } from 'lucide-react';
import { useNavigation } from '../contexts/NavigationContext';
import PlexusShape from '../components/PlexusShape';
import { roofComponents } from '../data/roofComponentsData';
import ContextualCTA from '../components/ContextualCTA';
import GlobalBottomCTA from '../components/GlobalBottomCTA';

const IceManagementPage = () => {
    const { setActivePageId } = useNavigation();

    // Pull the ice management data
    const iceData = roofComponents.find(c => c.category === 'Ice Management');

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
                        style={{ backgroundImage: `url(/components/heat_trace_1773773528589.png)` }}
                    ></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black z-10"></div>
                </div>

                <div className="absolute inset-0 z-20">
                    <PlexusShape backgroundColor="transparent" dotColor="#08137C" lineColor="8, 19, 124" density={40} />
                </div>

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl aspect-square bg-rhive-blue/10 blur-[130px] rounded-full z-10" />

                <div className="relative z-30 text-center px-4 max-w-5xl">
                    <div className="inline-flex items-center gap-2 border border-rhive-blue/30 px-6 py-2 bg-rhive-blue/10 mb-8 backdrop-blur-md">
                        <Snowflake className="w-4 h-4" color="url(#blue-white-grad)" />
                        <span className="font-black text-base uppercase tracking-[0.4em] bg-gradient-to-t from-rhive-blue to-white bg-clip-text text-transparent">Winter Perimeter Security</span>
                    </div>

                    <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-8 text-white leading-none drop-shadow-2xl font-sans">
                        ICE <span className="bg-gradient-to-t from-rhive-blue to-white bg-clip-text text-transparent">MANAGEMENT</span>
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-300 font-sans mb-12 max-w-prose mx-auto leading-relaxed drop-shadow-lg">
                        Proactive Ice Defense & Structural Protection. Prevent the formation of destructive ice dams and heavy icicles along your roof edges and valleys.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <button
                            onClick={() => setActivePageId('P-12')}
                            className="group relative px-10 py-5 bg-gradient-to-b from-white to-rhive-blue hover:from-white hover:to-[#08137C] text-black font-black uppercase text-base tracking-[0.2em] hover:scale-105 transition-all shadow-[0_0_30px_rgba(8,19,124,0.3)]"
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
                            <div className="w-12 h-[2px] bg-rhive-blue"></div>
                            <span className="font-mono text-base font-bold uppercase tracking-[0.4em] bg-gradient-to-t from-rhive-blue to-white bg-clip-text text-transparent drop-shadow-[0_0_8px_rgba(8,19,124,0.5)]">
                                Automated Defense Network
                            </span>
                        </div>

                        <h2 className="text-5xl md:text-6xl font-black text-white uppercase tracking-tighter mb-4 font-display leading-[0.85]">
                            HEAT TRACE <span className="block text-4xl mt-2 bg-gradient-to-t from-rhive-blue to-white bg-clip-text text-transparent">ICE PREVENTION SYSTEM</span>
                        </h2>
                        
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-rhive-blue/10 border border-rhive-blue/30 mb-6">
                            <CheckCircle2 className="w-3 h-3" color="url(#blue-white-grad)" />
                            <span className="text-base font-black uppercase tracking-widest bg-gradient-to-t from-rhive-blue to-white bg-clip-text text-transparent">RHIVE QUALITY STANDARD VERIFIED</span>
                        </div>
                        
                        <p className="text-base md:text-lg text-gray-300 font-sans leading-relaxed max-w-prose mb-12 border-l-2 border-rhive-blue pl-6">
                            {iceData?.description}
                        </p>

                        <div className="space-y-8 mb-12">
                            <div className="flex items-start gap-6 group">
                                <div className="p-3 bg-white/5 border border-white/10 group-hover:bg-rhive-blue group-hover:text-white transition-all text-white">
                                    <ShieldCheck className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="text-white font-black text-base uppercase tracking-widest mb-1">Dual-Protection Warranty</h4>
                                    <p className="text-gray-500 text-base text-balance">
                                        {iceData?.guarantee.installation} • {iceData?.guarantee.materials}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative group perspective-[1000px]">
                        <div className="absolute -inset-4 bg-rhive-blue/20 blur-3xl rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-1000"></div>

                        <div className="relative z-10 w-full h-full min-h-[450px] bg-[#0A0A0A] border border-white/10 group-hover:border-rhive-blue/50 transition-all duration-700 flex flex-col p-8 overflow-hidden shadow-2xl"
                            style={{ clipPath: 'polygon(24px 0, 100% 0, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0 100%, 0 24px)', transformStyle: 'preserve-3d' }}>

                            <div className="absolute inset-0 z-0">
                                <img
                                    src="/components/heat_trace_1773773528589.png"
                                    className="w-full h-full object-cover opacity-30 group-hover:opacity-60 transition-opacity duration-1000"
                                    alt="RHIVE Heat Trace System"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
                            </div>

                            <div className="relative z-20 flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 flex items-center justify-center bg-rhive-blue/10 rounded-full border border-rhive-blue/30">
                                    <Cog className="w-6 h-6" color="url(#blue-white-grad)" />
                                </div>
                                <h3 className="text-2xl font-black text-white uppercase tracking-widest font-sans">Execution Blueprint</h3>
                            </div>

                            <div className="space-y-4 flex-grow relative z-20 mt-auto">
                                {iceData?.blueprint.map((bp, idx) => {
                                    const splitPoint = bp.indexOf(':');
                                    if (splitPoint > -1) {
                                        const heading = bp.substring(0, splitPoint);
                                        const details = bp.substring(splitPoint + 1).trim();
                                        return (
                                            <div key={idx} className="flex flex-col gap-1 bg-black/60 backdrop-blur-md border border-white/10 p-4 hover:border-rhive-blue transition-colors group/bp">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <ThermometerSnowflake className="w-4 h-4" color="url(#blue-white-grad)" />
                                                    <span className="text-base font-black uppercase tracking-widest bg-gradient-to-t from-rhive-blue to-white bg-clip-text text-transparent">{heading}</span>
                                                </div>
                                                <p className="text-base text-gray-300 leading-relaxed font-sans max-w-prose pl-6">{details}</p>
                                            </div>
                                        );
                                    }
                                    return (
                                        <div key={idx} className="flex items-start gap-4 bg-white/5 border border-white/10 p-4 hover:border-rhive-blue transition-colors group/bp">
                                            <p className="text-base text-gray-300 leading-relaxed font-sans max-w-prose">{bp}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contextual CTA */}
            <ContextualCTA 
                message="Ready for a stress-free installation?" 
                buttonText="Start the Process Today" 
            />

            {/* Global CTA */}
            <GlobalBottomCTA />
        </div>
    );
};

export default IceManagementPage;
