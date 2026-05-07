import React, { useState } from 'react';
import { ShieldCheck, Zap, Award, CheckCircle2, Package, ArrowRight, Gauge, Activity, Building2, Gavel, HardHat, Home, Briefcase, Users, LayoutGrid, AlertCircle, Info, Trash2, Droplets, Fan, Ruler } from 'lucide-react';
import PlexusShape from '../components/PlexusShape';
import { InteractiveCommercialAnatomy } from '../components/InteractiveCommercialAnatomy';

const MembraneRoofingPage = () => {
    const [commercialLightboxOpen, setCommercialLightboxOpen] = useState(false);

    const scrollToSystems = () => {
        const element = document.getElementById('membrane-foundation');
        element?.scrollIntoView({ behavior: 'smooth' });
    };

    const personas = [
        {
            icon: <Home className="w-6 h-6" />,
            title: "Homeowner",
            benefit: "Transparent cost breakdowns for residential flat roofing, ensuring every dollar of your investment is accounted for with local precision."
        },
        {
            icon: <Briefcase className="w-6 h-6" />,
            title: "Property Manager",
            benefit: "Portfolio-wide membrane auditing. We document condition and thermal performance across all your assets for long-term capital planning."
        },
        {
            icon: <HardHat className="w-6 h-6" />,
            title: "New Construction",
            benefit: "Precision TPO detailing and hot-air welding certifications that meet the highest architectural specs for commercial builds."
        },
        {
            icon: <Users className="w-6 h-6" />,
            title: "HOA / Multifamily",
            benefit: "Certified warranty systems for low-slope structures, ensuring monolithic protection across entire blocks of residential units."
        }
    ];

    const membraneSystems = [
        {
            id: 'tpo',
            name: 'EVERGUARD® TPO',
            type: 'THE STANDARD FOR EFFICIENCY',
            description: 'Reflective, heat-welded thermoplastic membrane. The ultimate choice for energy efficiency and durability.',
            color: 'var(--rhive-pink)',
            features: ['Heat-Welded Seams', 'High Solar Reflectance', 'Puncture Resistant'],
            cta: 'View TPO Specs',
            action: () => setCommercialLightboxOpen(true)
        },
        {
            id: 'epdm',
            name: 'EPDM RUBBER',
            type: 'RUGGED RESILIENCE',
            description: 'Time-tested synthetic rubber membrane known for extreme weatherability and rapid installation.',
            color: '#00D1FF',
            features: ['UV Stability', 'Extreme Flexibility', 'Low Maintenance'],
            cta: 'Learn About EPDM',
            action: () => { }
        },
        {
            id: 'pvc',
            name: 'PVC MEMBRANE',
            type: 'CHEMICAL RESISTANCE',
            description: 'Ideally suited for restaurants and industrial sites where grease and chemicals are present.',
            color: '#e2ab49',
            features: ['Grease Resistant', 'Superior Fire Rating', 'Reinforced Strength'],
            cta: 'PVC Diagnostics',
            action: () => { }
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
            <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <PlexusShape backgroundColor="#000000" dotColor="#ec028b" lineColor="236, 2, 139" density={40} />
                </div>

                {/* Branding Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl aspect-square bg-[var(--rhive-pink)]/10 blur-[130px] rounded-full" />

                <div className="relative z-10 text-center px-4 max-w-5xl">
                    <div className="inline-flex items-center gap-2 border border-[var(--rhive-pink)]/30 px-6 py-2 bg-[var(--rhive-pink)]/10 mb-8">
                        <Activity className="w-4 h-4 text-[var(--rhive-pink)]" />
                        <span className="text-[var(--rhive-pink)] font-black text-xs uppercase tracking-[0.4em]">Membrane Architecture</span>
                    </div>

                    <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40 leading-none">
                        MONOLITHIC <br /> <span className="text-[var(--rhive-pink)]">PROTECTION.</span>
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-400 font-serif italic mb-12 max-w-3xl mx-auto leading-relaxed">
                        Commercial-grade membrane systems engineered for the flat roof challenges of the West. Every seam, every detail, built for a lifetime.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <button
                            onClick={() => window.location.href = '#quote'}
                            className="group relative px-10 py-5 bg-[var(--rhive-pink)] text-white font-black uppercase text-sm tracking-[0.2em] hover:scale-105 transition-all shadow-[0_0_30px_rgba(236,2,139,0.3)]"
                            style={{ clipPath: 'polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)' }}
                        >
                            Request Membrane Quote
                        </button>
                        <button
                            onClick={scrollToSystems}
                            className="px-10 py-5 border border-white/10 text-white font-bold uppercase text-xs tracking-[0.2em] hover:bg-white/5 transition-all"
                            style={{ clipPath: 'polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)' }}
                        >
                            System Overview
                        </button>
                    </div>
                </div>
            </section>

            {/* INTERACTIVE ANATOMY SECTION */}
            <section className="py-20 bg-black border-y border-white/5 relative z-10">
                <div className="absolute inset-0 bg-gradient-to-b from-[var(--rhive-pink)]/5 via-black to-black pointer-events-none"></div>
                <div className="max-w-[85rem] mx-auto px-6 mb-12 text-center relative z-20">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="w-8 h-[2px] bg-[var(--rhive-pink)]"></div>
                        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--rhive-pink)] font-bold">Structural Diagnostics</span>
                        <div className="w-8 h-[2px] bg-[var(--rhive-pink)]"></div>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-white uppercase font-display tracking-tight mb-4">Membrane Anatomy<span className="text-[var(--rhive-pink)]">.</span></h2>
                    <p className="text-gray-400 font-serif max-w-2xl mx-auto text-lg italic">
                        Low-slope roofing is engineering, not just installation. Explore the precision layers of a RHIVE certified membrane system.
                    </p>
                </div>
                <div className="relative z-20">
                    <InteractiveCommercialAnatomy />
                </div>
            </section>

            {/* PERSONA BENEFITS SECTION */}
            <section className="py-16 bg-[#050505] relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col items-center mb-20 text-center">
                        <div className="text-[var(--rhive-pink)] text-[10px] font-black uppercase tracking-[0.4em] mb-4">RHIVE Intelligence</div>
                        <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white mb-6">WHY RHIVE <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-gray-600">CONSTRUCTION?</span></h2>
                        <div className="w-24 h-[1px] bg-[var(--rhive-pink)]" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {personas.map((p, i) => (
                            <div key={i} className="group p-8 border border-white/5 bg-black/40 hover:bg-[var(--rhive-pink)]/5 hover:border-[var(--rhive-pink)]/30 transition-all duration-500 flex flex-col items-center text-center">
                                <div className="p-4 bg-white/5 border border-white/10 text-[var(--rhive-pink)] mb-6 group-hover:scale-110 group-hover:bg-[var(--rhive-pink)] group-hover:text-white transition-all duration-300 flex items-center justify-center">
                                    {p.icon}
                                </div>
                                <h3 className="text-white font-black text-xs uppercase tracking-widest mb-4">{p.title}</h3>
                                <p className="text-gray-400 text-[11px] font-serif leading-relaxed italic opacity-70 group-hover:opacity-100">{p.benefit}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SYSTEMS SECTION */}
            <section id="membrane-foundation" className="py-20 bg-black relative border-y border-white/5">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-[2px] bg-[var(--rhive-pink)]"></div>
                            <span className="font-mono text-[11px] font-bold uppercase tracking-[0.4em] text-[var(--rhive-pink)] drop-shadow-[0_0_8px_rgba(236,2,139,0.5)]">
                                Low-Slope Architecture
                            </span>
                        </div>

                        <h1 className="text-5xl md:text-8xl lg:text-[7rem] font-black text-white uppercase tracking-tighter mb-8 font-display leading-[0.85]">
                            Membrane <span className="text-[var(--rhive-pink)]">Systems.</span>
                        </h1>
                        <p className="text-xl text-gray-400 font-serif leading-loose mb-12 italic">
                            A flat roof is a basin, not a shed. We build monolithic barriers that weld together to form a single, impenetrable shield against the elements.
                        </p>

                        <div className="space-y-8 mb-12">
                            <div className="flex items-start gap-6 group">
                                <div className="p-3 bg-white/5 border border-white/10 text-[var(--rhive-pink)] group-hover:bg-[var(--rhive-pink)] group-hover:text-white transition-all">
                                    <ShieldCheck className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="text-white font-black text-xs uppercase tracking-widest mb-1">Commercial NDL Warranties</h4>
                                    <p className="text-gray-500 text-xs">No-Dollar-Limit manufacturer guarantees covering material and total labor for 20+ years.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-6 group">
                                <div className="p-3 bg-white/5 border border-white/10 text-[var(--rhive-pink)] group-hover:bg-[var(--rhive-pink)] group-hover:text-white transition-all">
                                    <Award className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="text-white font-black text-xs uppercase tracking-widest mb-1">Precision Hot-Air Welding</h4>
                                    <p className="text-gray-500 text-xs">Robotic welding technology ensures every seam is stronger than the membrane itself.</p>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => setCommercialLightboxOpen(true)}
                            className="flex items-center gap-3 text-white font-black text-xs uppercase tracking-[0.3em] group"
                        >
                            Explore Seam Specs <ArrowRight className="w-4 h-4 text-[var(--rhive-pink)] group-hover:translate-x-2 transition-transform" />
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {componentsList.map((c, i) => (
                            <div key={i} className="p-6 border border-white/5 bg-white/[0.02] flex flex-col gap-4 group hover:border-[var(--rhive-pink)]/20 transition-all">
                                <div className="text-[var(--rhive-pink)] opacity-50 group-hover:opacity-100 transition-opacity">{c.icon}</div>
                                <span className="text-gray-300 font-black text-[9px] uppercase tracking-widest">{c.title}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* UPGRADE MATRIX */}
            <section className="py-20 bg-[#050505]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-32">
                        <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white mb-6">CUSTOMIZE FOR <span className="text-[var(--rhive-pink)]">PERFORMANCE</span></h2>
                        <p className="text-gray-400 font-serif italic uppercase text-[10px] tracking-[0.5em]">Selection by environment</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {membraneSystems.map((opt) => (
                            <div key={opt.id} className="relative group p-12 bg-black border border-white/5 transition-all duration-700 hover:border-white/20">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                <div className="mb-12 text-left">
                                    <div className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: opt.color }}>{opt.type}</div>
                                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-4">{opt.name}</h3>
                                    <p className="text-gray-500 text-xs font-serif italic leading-relaxed">{opt.description}</p>
                                </div>

                                <div className="space-y-4 mb-12">
                                    {opt.features.map((f, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <div className="w-1 h-1 rounded-full" style={{ backgroundColor: opt.color }} />
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{f}</span>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    onClick={opt.action}
                                    className="w-full py-5 border border-white/10 text-white font-black text-[10px] uppercase tracking-widest hover:bg-white hover:text-black transition-all"
                                    style={{ clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)' }}
                                >
                                    {opt.cta}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

        </div>
    );
};

export default MembraneRoofingPage;
