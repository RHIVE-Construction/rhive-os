import React, { useState } from 'react';
import { Droplets, Zap, ShieldCheck, Thermometer, Wind, Award, ArrowRight, Gauge, Activity, Trash2, CheckCircle2, Ruler, Trash, Snowflake } from 'lucide-react';
import PlexusShape from '../components/PlexusShape';
import GuttersLightbox from '../components/GuttersLightbox';
import IceLightbox from '../components/IceLightbox';

const RoofUpgradesPage = () => {
    const [guttersOpen, setGuttersOpen] = useState(false);
    const [iceOpen, setIceOpen] = useState(false);

    const upgradeModules = [
        {
            id: 'gutters',
            title: "Seamless Gutters",
            icon: <Droplets className="w-8 h-8" />,
            efficiency: "98%",
            description: "Custom-extruded seamless aluminum systems. Designed to channel water safely away from your foundation with surgical precision.",
            highlights: ["Heavy .032 Gauge Aluminum", "Hidden Hanger Fasteners", "Custom Miters", "Lifetime Workmanship"],
            action: () => setGuttersOpen(true)
        },
        {
            id: 'ice',
            title: "Ice Management",
            icon: <Snowflake className="w-8 h-8" />,
            efficiency: "100%",
            description: "Self-regulating heat trace and snow retention systems. Prevent ice dams and avalanches before they threaten your structure.",
            highlights: ["Smart Sensor Activation", "Industrial Grade Heat Trace", "Engineered Snow Guards", "Winter Readiness Proof"],
            action: () => setIceOpen(true)
        }
    ];

    return (
        <div className="bg-black text-white min-h-screen font-sans selection:bg-[var(--rhive-pink)] selection:text-white pt-20">
            {/* HERO */}
            <section className="relative h-[60vh] flex items-center justify-center overflow-hidden border-b border-white/5">
                <div className="absolute inset-0 z-0">
                    <PlexusShape backgroundColor="#000000" dotColor="#ec028b" lineColor="236, 2, 139" density={30} />
                </div>

                <div className="relative z-10 text-center px-4">
                    <div className="inline-flex items-center gap-2 border border-[var(--rhive-pink)]/30 px-6 py-2 bg-[var(--rhive-pink)]/10 mb-8">
                        <Zap className="w-4 h-4 text-[var(--rhive-pink)]" />
                        <span className="text-[var(--rhive-pink)] font-black text-xs uppercase tracking-[0.4em]">Efficiency Specialization</span>
                    </div>

                    <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40">
                        ROOF <span className="text-[var(--rhive-pink)]">UPGRADES</span>.
                    </h1>
                    <p className="text-xl text-gray-400 font-serif italic max-w-2xl mx-auto">
                        Precision peripherals designed to extend the life of your foundation and protect your property from the elements.
                    </p>
                </div>
            </section>

            {/* UPGRADE MODULES */}
            <section className="py-24 bg-[#050505]">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12">
                    {upgradeModules.map((module) => (
                        <div key={module.id} className="group relative p-12 bg-black border border-white/5 hover:border-[var(--rhive-pink)]/30 transition-all duration-500 overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--rhive-pink)]/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-[var(--rhive-pink)]/10 transition-colors" />

                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-12">
                                    <div className="p-4 bg-white/5 border border-white/10 text-[var(--rhive-pink)] group-hover:bg-[var(--rhive-pink)] group-hover:text-white transition-all">
                                        {module.icon}
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Protection Rating</div>
                                        <div className="text-2xl font-black text-white font-mono">{module.efficiency}</div>
                                    </div>
                                </div>

                                <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-6">{module.title}</h3>
                                <p className="text-gray-400 font-serif italic mb-12 leading-loose text-lg">{module.description}</p>

                                <div className="grid grid-cols-2 gap-4 mb-12">
                                    {module.highlights.map((h, i) => (
                                        <div key={i} className="flex items-center gap-2">
                                            <div className="w-1 h-1 bg-[var(--rhive-pink)] rounded-full" />
                                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{h}</span>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    onClick={module.action}
                                    className="w-full py-5 border border-white/10 text-white font-black text-xs uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all flex items-center justify-center gap-3"
                                    style={{ clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)' }}
                                >
                                    Explore Matrix <ArrowRight className="w-4 h-4 text-[var(--rhive-pink)] group-hover:translate-x-2 transition-transform" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* LIGHTBOXES */}
            <GuttersLightbox isOpen={guttersOpen} onClose={() => setGuttersOpen(false)} />
            <IceLightbox isOpen={iceOpen} onClose={() => setIceOpen(false)} />
        </div>
    );
};

export default RoofUpgradesPage;
