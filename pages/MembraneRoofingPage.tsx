import React, { useState } from 'react';
import { ShieldCheck, Zap, Award, CheckCircle2, Package, ArrowRight, Gauge, Activity, Building2, Gavel, HardHat, Home, Briefcase, Users, LayoutGrid, AlertCircle, Info, Trash2, Droplets, Fan, Ruler } from 'lucide-react';
import PlexusShape from '../components/PlexusShape';
import { InteractiveCommercialAnatomy } from '../components/InteractiveCommercialAnatomy';
import MembraneTearOffMandate from '../components/MembraneTearOffMandate';
import MembraneTimelineSection from '../components/MembraneTimelineSection';
import MembraneFinancialSection from '../components/MembraneFinancialSection';
import MembraneUrgencyGrid from '../components/MembraneUrgencyGrid';
import MembraneTrustSection from '../components/MembraneTrustSection';
import { InteractiveGAFCommercial } from '../components/InteractiveGAFCommercial';
import CommercialCapExCTA from '../components/CommercialCapExCTA';
import { useNavigation } from '../contexts/NavigationContext';

const MembraneRoofingPage = () => {
    const { setActivePageId } = useNavigation();
    const [commercialLightboxOpen, setCommercialLightboxOpen] = useState(false);

    const scrollToSystems = () => {
        const element = document.getElementById('membrane-foundation');
        element?.scrollIntoView({ behavior: 'smooth' });
    };


    const membraneSystems = [
        {
            id: 'tpo-80',
            name: 'GAF TPO 80 MIL',
            type: 'MAXIMUM DURABILITY',
            description: 'Features the GAF EverGuard® 80 mil TPO membrane. Engineered for superior puncture resistance, maximum UV defense, and highest longevity.',
            color: 'var(--rhive-pink)',
            features: ['30-Year NDL Warranty', 'Maximum Puncture Defense', 'Highest UV Resistance'],
            cta: 'View TPO 80 Specs',
            action: () => setActivePageId('P-02b-2')
        },
        {
            id: 'pvc-60',
            name: 'GAF PVC 60 MIL',
            type: 'CHEMICAL RESISTANCE',
            description: 'Specialized chemical-resistant base. Highly resistant to fats, oils, and grease in demanding commercial or restaurant environments.',
            color: 'var(--rhive-blue)',
            features: ['20-Year NDL Warranty', 'Superior Chemical Defense', 'Grease Resistant'],
            cta: 'View PVC Specs',
            action: () => setActivePageId('P-02b-3')
        },
        {
            id: 'pvc-80',
            name: 'GAF PVC 80 MIL',
            type: 'ULTIMATE DEFENSE',
            description: 'The absolute pinnacle of chemical defense and longevity. Heavy-duty membrane engineered for maximum resistance to harsh industrial exposure.',
            color: '#e2ab49',
            features: ['30-Year NDL Warranty', 'Maximum Chemical Defense', 'Extreme Longevity'],
            cta: 'View PVC Specs',
            action: () => setActivePageId('P-02b-3')
        }
    ];

    const componentsList = [
        { title: "Structural Decking", icon: <LayoutGrid className="w-4 h-4" /> },
        { title: "Vapor retarder", icon: <ShieldCheck className="w-4 h-4" /> },
        { title: "Polyiso insulation", icon: <Zap className="w-4 h-4" /> },
        { title: "HD Cover Board", icon: <Package className="w-4 h-4" /> },
        { title: "Mechanical Fasteners", icon: <Gavel className="w-4 h-4" /> },
        { title: "TPO Membrane", icon: <Activity className="w-4 h-4" /> },
        { title: "Heat-Welded Seams", icon: <Zap className="w-4 h-4" /> },
        { title: "Flashings & Details", icon: <Award className="w-4 h-4" /> }
    ];

    return (
        <div className="bg-black text-white min-h-screen font-sans selection:bg-[var(--rhive-pink)] selection:text-white pt-20">

            {/* HERO SECTION */}
            <section className="relative aspect-video w-full max-h-[90vh] flex items-center justify-center overflow-hidden border-b border-white/10 group">
                
                {/* Background Images with Parallax & Contrast Layers */}
                <div className="absolute inset-0 z-0 bg-black">
                    <div className="absolute inset-0 opacity-40 group-hover:opacity-60 group-hover:scale-105 transition-all duration-[2s] ease-out filter grayscale mix-blend-luminosity flex items-end justify-center">
                        <img src="/commercial-facility.png" alt="Commercial Layout" className="absolute bottom-0 w-full h-full object-contain origin-bottom" />
                        <img src="/residential-flat-roof.png" alt="Residential Layout" className="absolute bottom-[10%] -right-[5%] w-[40%] h-[40%] object-contain origin-bottom" />
                    </div>
                    {/* Gradient Mask to ensure text readability */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black z-10"></div>
                </div>

                <div className="absolute inset-0 z-20">
                    <PlexusShape backgroundColor="transparent" dotColor="#ec028b" lineColor="236, 2, 139" density={40} />
                </div>

                {/* Branding Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl aspect-square bg-[var(--rhive-pink)]/10 blur-[130px] rounded-full z-10" />

                <div className="relative z-30 text-center px-4 max-w-5xl">
                    <div className="inline-flex items-center gap-2 border border-[var(--rhive-pink)]/30 px-6 py-2 bg-[var(--rhive-pink)]/10 mb-8 backdrop-blur-md">
                        <Activity className="w-4 h-4 text-[var(--rhive-pink)]" />
                        <span className="text-[var(--rhive-pink)] font-black text-base uppercase tracking-[0.4em]">Membrane Architecture</span>
                    </div>

                    <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-8 text-white leading-none drop-shadow-2xl font-sans">
                        MEMBRANE <br /> <span className="text-[var(--rhive-pink)]">ROOFING</span>
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-300 font-sans mb-12 max-w-prose mx-auto leading-relaxed drop-shadow-lg">
                        Commercial-grade membrane systems engineered for the flat roof challenges of the West. Every seam, every detail, built for a lifetime.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <button
                            onClick={() => window.location.href = '#quote'}
                            className="group relative px-10 py-5 bg-[var(--rhive-pink)] text-white font-black uppercase text-base tracking-[0.2em] hover:scale-105 transition-all shadow-[0_0_30px_rgba(236,2,139,0.3)]"
                            style={{ clipPath: 'polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)' }}
                        >
                            Request Membrane Quote
                        </button>
                        <button
                            onClick={scrollToSystems}
                            className="px-10 py-5 border border-white/10 text-white font-bold uppercase text-base tracking-[0.2em] hover:bg-white/5 transition-all"
                            style={{ clipPath: 'polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)' }}
                        >
                            System Overview
                        </button>
                    </div>
                </div>

                <InteractiveGAFCommercial />
            </section>

            {/* INTERACTIVE ANATOMY SECTION */}
            <section className="py-20 bg-black border-y border-white/5 relative z-10">
                <div className="absolute inset-0 bg-gradient-to-b from-[var(--rhive-pink)]/5 via-black to-black pointer-events-none"></div>
                <div className="max-w-[85rem] mx-auto px-6 mb-12 text-center relative z-20">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="w-8 h-[2px] bg-[var(--rhive-pink)]"></div>
                        <span className="font-mono text-base uppercase tracking-[0.3em] text-[var(--rhive-pink)] font-bold">Structural Diagnostics</span>
                        <div className="w-8 h-[2px] bg-[var(--rhive-pink)]"></div>
                    </div>
                    <h2 className="text-4xl md:text-5xl leading-tight font-black text-white uppercase font-display tracking-tight mb-4">Membrane Anatomy<span className="text-[var(--rhive-pink)]">.</span></h2>
                    <p className="text-gray-400 font-serif max-w-prose mx-auto text-base md:text-lg leading-relaxed italic">
                        Low-slope roofing is engineering, not just installation. Explore the precision layers of a RHIVE certified membrane system.
                    </p>
                </div>
                <div className="relative z-20">
                    <InteractiveCommercialAnatomy />
                </div>
            </section>


            {/* BASE PACKAGE SECTION */}
            <section id="membrane-foundation" className="py-20 bg-black relative border-y border-white/5">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-[2px] bg-[var(--rhive-pink)]"></div>
                            <span className="font-mono text-base font-bold uppercase tracking-[0.4em] text-[var(--rhive-pink)] drop-shadow-[0_0_8px_rgba(236,2,139,0.5)]">
                                Base Commercial Package
                            </span>
                        </div>

                        <h1 className="text-5xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tighter mb-8 font-display leading-[0.85]">
                            GAF TPO 60 mil <br /><span className="text-[var(--rhive-pink)]">Roofing Package.</span>
                        </h1>
                        <p className="text-xl text-gray-400 font-serif leading-relaxed max-w-prose mb-12 italic">
                            Superior Durability and Performance. Featuring GAF EverGuard® 60 mil TPO—an industry-proven, highly reflective membrane. Engineered for maximum thermal performance and secured by a manufacturer-backed guarantee.
                        </p>

                        <div className="space-y-8 mb-12">
                            <div className="flex items-start gap-6 group">
                                <div className="p-3 bg-white/5 border border-white/10 text-[var(--rhive-pink)] group-hover:bg-[var(--rhive-pink)] group-hover:text-white transition-all">
                                    <ShieldCheck className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="text-white font-black text-base uppercase tracking-widest mb-1">20-Year NDL Warranty</h4>
                                    <p className="text-gray-500 text-base">GAF EverGuard® System Limited Warranty including 20 years of non-prorated material and labor coverage.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-6 group">
                                <div className="p-3 bg-white/5 border border-white/10 text-[var(--rhive-pink)] group-hover:bg-[var(--rhive-pink)] group-hover:text-white transition-all">
                                    <HardHat className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="text-white font-black text-base uppercase tracking-widest mb-1">Total Engineering Assurance</h4>
                                    <p className="text-gray-500 text-base">Full GAF Engineer Project Submittal and certified installation by safety-audited RHIVE crews.</p>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => setActivePageId('P-02b-1')}
                            className="flex items-center gap-3 text-white font-black text-base uppercase tracking-[0.3em] group"
                        >
                            Explore TPO 60 Specs <ArrowRight className="w-4 h-4 text-[var(--rhive-pink)] group-hover:translate-x-2 transition-transform" />
                        </button>
                    </div>

                    {/* Visual representation of the Membrane package */}
                    <div className="relative group perspective-[1000px]">
                        <div className="absolute -inset-4 bg-[var(--rhive-pink)]/20 blur-3xl rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-1000"></div>

                        <div className="relative z-10 w-full h-full min-h-[450px] bg-[#0A0A0A] border border-white/10 group-hover:border-[var(--rhive-pink)]/50 transition-all duration-700 flex flex-col p-8 overflow-hidden shadow-2xl"
                            style={{ clipPath: 'polygon(24px 0, 100% 0, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0 100%, 0 24px)', transformStyle: 'preserve-3d' }}>

                            {/* Marketing Showcase Image */}
                            <div className="absolute inset-0 z-0">
                                <img
                                    src="/metal deck single ply.png"
                                    className="w-full h-full object-cover opacity-50 group-hover:opacity-80 transition-opacity duration-1000"
                                    alt="GAF TPO Membrane System on Metal Deck"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
                            </div>

                            <div className="relative z-20 flex items-center gap-4 mb-8 pt-4">
                                <div className="w-12 h-12 flex items-center justify-center bg-[var(--rhive-pink)]/10 rounded-full border border-[var(--rhive-pink)]/30">
                                    <Package className="w-6 h-6 text-[var(--rhive-pink)]" />
                                </div>
                                <h3 className="text-2xl font-black text-white uppercase tracking-widest font-sans drop-shadow-md">Core Package Artifacts</h3>
                            </div>

                            <div className="space-y-4 flex-grow relative z-20">
                                {[
                                    { icon: <Zap className="w-4 h-4" />, text: "Heat-Welded Monolithic Seams" },
                                    { icon: <Activity className="w-4 h-4" />, text: "Energy-Reflective Surface" },
                                    { icon: <ShieldCheck className="w-4 h-4" />, text: "20-Year NDL Guarantee - Included" },
                                    { icon: <Package className="w-4 h-4" />, text: "Complete Polyiso Assembly" }
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-4 bg-white/10 backdrop-blur-sm p-4 hover:bg-[var(--rhive-pink)] transition-colors border border-white/5 hover:border-transparent cursor-default group/item hover:translate-x-2 duration-300">
                                        <div className="text-[var(--rhive-pink)] group-hover/item:text-white transition-colors">
                                            {item.icon}
                                        </div>
                                        <span className="text-base font-bold text-gray-200 uppercase font-sans tracking-widest group-hover/item:text-white transition-colors">{item.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* UPGRADE MATRIX */}
            <section className="py-20 bg-[#050505]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-32">
                        <h2 className="text-4xl md:text-5xl leading-tight font-black uppercase tracking-tighter text-white mb-6">CUSTOMIZE FOR <span className="text-[var(--rhive-pink)]">PERFORMANCE</span></h2>
                        <p className="text-gray-400 font-serif italic uppercase text-base tracking-[0.5em]">Selection by environment</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {membraneSystems.map((opt) => (
                            <div key={opt.id} className="relative group p-12 bg-black border border-white/5 transition-all duration-700 hover:border-white/20">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                <div className="mb-12 text-left">
                                    <div className="text-base font-black uppercase tracking-widest mb-2" style={{ color: opt.color }}>{opt.type}</div>
                                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-4">{opt.name}</h3>
                                    <p className="text-gray-300 text-base font-sans leading-relaxed">{opt.description}</p>
                                </div>

                                <div className="space-y-4 mb-12">
                                    {opt.features.map((f, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <div className="w-1 h-1 rounded-full" style={{ backgroundColor: opt.color }} />
                                            <span className="text-base font-bold text-gray-400 uppercase tracking-widest">{f}</span>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    onClick={opt.action}
                                    className="w-full py-5 border border-white/10 text-white font-black text-base uppercase tracking-widest hover:bg-white hover:text-black transition-all"
                                    style={{ clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)' }}
                                >
                                    {opt.cta}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 1. Commercial Tear-Off Mandate (replaces No Layovers) */}
            <MembraneTearOffMandate />

            {/* 2. Commercial Urgency Grid */}
            <MembraneUrgencyGrid />

            {/* 3. Commercial Process Timeline */}
            <MembraneTimelineSection />

            {/* 4. Commercial Financial & Insurance Section */}
            <MembraneFinancialSection />

            {/* 5. Commercial Trust & Certifications */}
            <MembraneTrustSection />

            {/* COMMERCIAL CAPEX CTA */}
            <CommercialCapExCTA />

        </div>
    );
};

export default MembraneRoofingPage;
