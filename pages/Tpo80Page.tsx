import React from 'react';
import { useNavigation } from '../contexts/NavigationContext';
import { Shield, Hammer, FileCheck, Layers, Activity, Wrench, ShieldAlert } from 'lucide-react';

const Tpo80Page: React.FC = () => {
    const { setActivePageId } = useNavigation();

    const inclusions = [
        {
            icon: <Shield className="w-6 h-6 text-[var(--rhive-pink)]" />,
            title: "30-YEAR NDL WARRANTY",
            desc: "GAF EverGuard® System Limited Warranty including 30 years of non-prorated material and labor coverage. Backed by RHIVE's certified installation."
        },
        {
            icon: <Layers className="w-6 h-6" color="url(#blue-white-grad)" />,
            title: "TPO 80 MIL MEMBRANE",
            desc: "GAF EverGuard® 80 mil TPO. Ultra-thick, maximum durability membrane offering the highest puncture resistance and longevity in the TPO class."
        },
        {
            icon: <ShieldAlert className="w-6 h-6 text-[var(--rhive-pink)]" />,
            title: "MAXIMUM PUNCTURE DEFENSE",
            desc: "The 80 mil thickness provides significantly enhanced protection against hail, airborne debris, and rooftop foot traffic compared to standard membranes."
        },
        {
            icon: <Activity className="w-6 h-6" color="url(#blue-white-grad)" />,
            title: "SUPERIOR UV RESISTANCE",
            desc: "Enhanced weathering layer protects against extreme sun exposure and ultra-violet degradation, ensuring the roof performs for its full 30-year lifespan."
        },
        {
            icon: <FileCheck className="w-6 h-6 text-[var(--rhive-pink)]" />,
            title: "HIGH-DENSITY COVER BOARD",
            desc: "Added directly beneath the membrane for supreme crush resistance and to provide an ultra-rigid substrate for the robotic hot-air welders."
        },
        {
            icon: <Wrench className="w-6 h-6" color="url(#blue-white-grad)" />,
            title: "ROBOTIC SEAM WELDING",
            desc: "Monolithic, continuous seam integration performed by calibrated hot-air robotics, eliminating virtually all points of potential failure."
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
                    <div className="inline-flex items-center px-3 py-1 mb-6 rounded-sm bg-[var(--rhive-pink)]/10 border border-[var(--rhive-pink)]/30 font-mono text-[10px] uppercase tracking-wider text-[var(--rhive-pink)]">
                        MAXIMUM DURABILITY UPGRADE
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight mb-4 flex items-center gap-4">
                        GAF TPO 80 mil <span className="text-[var(--rhive-pink)]">Package</span>
                    </h1>
                    <p className="text-xl text-gray-300 font-serif leading-relaxed max-w-3xl italic">
                        The ultimate TPO defense system. Engineered for superior puncture resistance, maximum UV defense, and extreme longevity. Upgraded with an elite 30-year Guarantee.
                    </p>
                </div>

                {/* Inclusions Grid */}
                <h2 className="text-2xl font-black text-white uppercase mb-8 tracking-tight">System Specifications</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
                    {inclusions.map((item, i) => (
                        <div key={i} className="bg-black/50 border border-[var(--border-color)] p-6 rounded-sm hover:border-rhive-blue/50 transition-colors">
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
                <div className="relative group bg-gradient-to-br from-rhive-blue/10 to-transparent p-10 border border-rhive-blue/20 text-center overflow-hidden">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-0"></div>
                    <div className="relative z-10">
                        <h3 className="text-2xl font-black uppercase mb-4 bg-gradient-to-t from-rhive-blue to-white bg-clip-text text-transparent">Upgrade to 30-Year Performance</h3>
                        <p className="text-gray-400 mb-8 max-w-xl mx-auto">Get an instant estimate for the GAF TPO 80 mil upgrade using our transparent pricing engine.</p>
                        <button
                            onClick={() => setActivePageId('P-12')}
                            className="px-8 py-4 bg-gradient-to-b from-white to-rhive-blue hover:from-white hover:to-[#08137C] text-black font-black uppercase tracking-widest text-sm transition-colors shadow-[0_0_20px_rgba(8,19,124,0.3)] hover:shadow-[0_0_30px_rgba(8,19,124,0.5)]"
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

export default Tpo80Page;
