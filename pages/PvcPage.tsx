import React from 'react';
import { useNavigation } from '../contexts/NavigationContext';
import { Shield, Hammer, Droplets, Layers, Activity, Wrench, FlaskConical, FileCheck } from 'lucide-react';

const PvcPage: React.FC = () => {
    const { setActivePageId } = useNavigation();

    const inclusions = [
        {
            icon: <Shield className="w-6 h-6 text-[#e2ab49]" />,
            title: "CHEMICAL & GREASE RESISTANT",
            desc: "Highly resistant to animal fats, oils, and grease. The mandatory system for restaurants, industrial facilities, and demanding chemical environments."
        },
        {
            icon: <Layers className="w-6 h-6 text-[#e2ab49]" />,
            title: "PVC 60 MIL OR 80 MIL MEMBRANE",
            desc: "Available in GAF EverGuard® PVC 60 mil (20-Year Guarantee) or the ultimate 80 mil tier (30-Year Guarantee) for absolute maximum defense."
        },
        {
            icon: <Droplets className="w-6 h-6 text-[#e2ab49]" />,
            title: "SUPERIOR FLEXIBILITY",
            desc: "Inherently flexible formulation allows the membrane to easily accommodate building movement and thermal shock without splitting."
        },
        {
            icon: <FlaskConical className="w-6 h-6 text-[#e2ab49]" />,
            title: "IMPROVED FIRE RATING",
            desc: "PVC formulations inherently possess self-extinguishing properties, providing superior fire resistance in commercial settings."
        },
        {
            icon: <FileCheck className="w-6 h-6 text-[#e2ab49]" />,
            title: "HIGH-DENSITY COVER BOARD",
            desc: "Protects the insulation and provides a smooth, extremely durable substrate for the PVC membrane, significantly enhancing puncture resistance."
        },
        {
            icon: <Wrench className="w-6 h-6 text-[#e2ab49]" />,
            title: "PREMIUM SEAM WELDABILITY",
            desc: "Wide 'window of weldability' ensures consistently strong seams, forming a permanent watertight monolithic seal across the assembly."
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
                    <div className="inline-flex items-center px-3 py-1 mb-6 rounded-sm bg-[#e2ab49]/10 border border-[#e2ab49]/30 font-mono text-[10px] uppercase tracking-wider text-[#e2ab49]">
                        SPECIALIZED INDUSTRIAL DEFENSE
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight mb-4 flex items-center gap-4">
                        GAF PVC <span className="text-[#e2ab49]">Package</span>
                    </h1>
                    <p className="text-xl text-gray-300 font-serif leading-relaxed max-w-3xl italic">
                        The ultimate chemical and grease defense system. Engineered specifically for harsh commercial environments like restaurants and manufacturing facilities where standard membranes fail.
                    </p>
                </div>

                {/* Inclusions Grid */}
                <h2 className="text-2xl font-black text-white uppercase mb-8 tracking-tight">System Specifications</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
                    {inclusions.map((item, i) => (
                        <div key={i} className="bg-black/50 border border-[var(--border-color)] p-6 rounded-sm hover:border-[#e2ab49]/50 transition-colors">
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
                <div className="relative group bg-gradient-to-br from-[#e2ab49]/10 to-transparent p-10 border border-[#e2ab49]/20 text-center overflow-hidden">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-0"></div>
                    <div className="relative z-10">
                        <h3 className="text-2xl font-black text-white uppercase mb-4">Invest in Chemical Immunity</h3>
                        <p className="text-gray-400 mb-8 max-w-xl mx-auto">Get an instant estimate for our specialized PVC packages using our transparent pricing engine.</p>
                        <button
                            onClick={() => window.dispatchEvent(new CustomEvent('open-estimator', { detail: { concern: 'Commercial / Industrial' } }))}
                            className="px-8 py-4 bg-[#e2ab49] hover:bg-[#cf9838] text-black font-black uppercase tracking-widest text-sm transition-colors shadow-[0_0_20px_rgba(226,171,73,0.3)] hover:shadow-[0_0_30px_rgba(226,171,73,0.5)]"
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

export default PvcPage;
