import React from 'react';
import { useNavigation } from '../contexts/NavigationContext';
import { Shield, Zap, Hammer, FileCheck, Anchor, Wind, Wrench, Menu, Layers, Activity } from 'lucide-react';

const Tpo60Page: React.FC = () => {
    const { setActivePageId } = useNavigation();

    const inclusions = [
        {
            icon: <Shield className="w-6 h-6 text-[var(--rhive-pink)]" />,
            title: "20-YEAR NDL WARRANTY",
            desc: "GAF EverGuard® System Limited Warranty including 20 years of non-prorated material and labor coverage. Backed by RHIVE's certified installation."
        },
        {
            icon: <Layers className="w-6 h-6" color="url(#blue-white-grad)" />,
            title: "TPO 60 MIL MEMBRANE",
            desc: "GAF EverGuard® 60 mil TPO. Highly reflective, energy-efficient, and puncture-resistant single-ply roofing proven in commercial environments."
        },
        {
            icon: <Activity className="w-6 h-6 text-[var(--rhive-pink)]" />,
            title: "HEAT-WELDED MONOLITHIC SEAMS",
            desc: "All seams are heat-welded by robotic automatic welders to form a single, impenetrable, monolithic layer across the entire roof surface."
        },
        {
            icon: <FileCheck className="w-6 h-6" color="url(#blue-white-grad)" />,
            title: "POLYISO INSULATION",
            desc: "EnergyGuard™ Polyiso Insulation provides high thermal efficiency (R-Value), minimizing heating and cooling costs for your facility."
        },
        {
            icon: <Shield className="w-6 h-6 text-[var(--rhive-pink)]" />,
            title: "VAPOR BARRIER PROTECTION",
            desc: "Prevents interior moisture from infiltrating the roofing assembly, ensuring longevity and maintaining insulation performance."
        },
        {
            icon: <Wrench className="w-6 h-6" color="url(#blue-white-grad)" />,
            title: "FLASHINGS & DETAILS",
            desc: "Pre-molded, factory-built accessories for pipes, corners, and curbs to eliminate weak points and human error in crucial transition areas."
        }
    ];

    return (
        <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] overflow-x-hidden pt-24 pb-20">
            <div className="max-w-5xl mx-auto px-6 lg:px-8">

                {/* Back Navigation */}
                <button
                    onClick={() => setActivePageId('P-02b')}
                    className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 font-mono text-xs uppercase tracking-widest transition-colors"
                >
                    &larr; Back to Membrane Systems
                </button>

                {/* Header */}
                <div className="border-b border-white/10 pb-10 mb-12">
                    <div className="inline-flex items-center px-3 py-1 mb-6 rounded-sm bg-white/5 border border-white/10 font-mono text-[10px] uppercase tracking-wider text-[var(--rhive-pink)]">
                        COMMERCIAL BASE PACKAGE
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight mb-4 flex items-center gap-4">
                        GAF TPO 60 mil <span className="text-[var(--rhive-pink)]">Package</span>
                    </h1>
                    <p className="text-xl text-gray-300 font-serif leading-relaxed max-w-3xl italic">
                        The industry standard for commercial low-slope roofing. This highly reflective, energy-efficient package is designed for longevity and thermal performance.
                    </p>
                </div>

                {/* Inclusions Grid */}
                <h2 className="text-2xl font-black text-white uppercase mb-8 tracking-tight">System Specifications</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
                    {inclusions.map((item, i) => (
                        <div key={i} className="bg-black/50 border border-white/5 p-6 rounded-sm hover:border-[var(--rhive-pink)]/30 transition-colors">
                            <div className="flex items-start gap-4">
                                <div className="mt-1 p-2 bg-white/5 border border-white/10 rounded-sm">
                                    {item.icon}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                                    <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div className="relative group bg-gradient-to-br from-[var(--rhive-pink)]/10 to-transparent p-10 border border-[var(--rhive-pink)]/20 text-center overflow-hidden">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-0"></div>
                    <div className="relative z-10">
                        <h3 className="text-2xl font-black text-white uppercase mb-4">Secure Your Commercial Asset</h3>
                        <p className="text-gray-400 mb-8 max-w-xl mx-auto">Get an instant estimate for the GAF TPO 60 mil package using our transparent pricing engine.</p>
                        <button
                            onClick={() => setActivePageId('P-12')}
                            className="px-8 py-4 bg-[var(--rhive-pink)] hover:bg-[#c90278] text-white font-bold uppercase tracking-widest text-sm transition-colors shadow-[0_0_20px_rgba(236,2,139,0.3)] hover:shadow-[0_0_30px_rgba(236,2,139,0.5)]"
                            style={{ clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)' }}
                        >
                            Request A Quote
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Tpo60Page;
