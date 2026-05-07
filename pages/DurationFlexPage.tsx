import React from 'react';
import { useNavigation } from '../contexts/NavigationContext';
import { Shield, Zap, Hammer, FileCheck, Anchor, Wind, Wrench, Menu } from 'lucide-react';

const DurationFlexPage: React.FC = () => {
    const { setActivePageId } = useNavigation();

    const inclusions = [
        {
            icon: <Shield className="w-6 h-6 text-[var(--rhive-pink)]" />,
            title: "O.C. PREFERRED PROTECTION PLAN",
            desc: "Includes 50 years of non-prorated material and labor coverage, 10 years of workmanship coverage, 130 MPH wind resistance, and 25 years of algae resistance. Conferred automatically by RHIVE's certified installation."
        },
        {
            icon: <Hammer className="w-6 h-6 text-[#00D1FF]" />,
            title: "FIELD SHINGLES",
            desc: "Upgrade: Owens Corning Duration FLEX® Shingles. 50-Year Preferred Protection, Class 4 Impact Rated featuring polymer-modified asphalt for extreme flexibility, SureNail Technology, and 130 MPH Wind Rating."
        },
        {
            icon: <Anchor className="w-6 h-6 text-[var(--rhive-pink)]" />,
            title: "HARDWARE & FASTENERS",
            desc: "Electro-galvanized coil nails installed with 6 nails per shingle (utilizing SureNail Technology) for superior wind resistance to exceed standard building codes."
        },
        {
            icon: <FileCheck className="w-6 h-6 text-[#00D1FF]" />,
            title: "UNDERLAYMENT",
            desc: "Owens Corning ProArmor®: A high-performance synthetic underlayment installed on the entire non-covered roof field as a secondary water-shedding barrier."
        },
        {
            icon: <Menu className="w-6 h-6 text-[var(--rhive-pink)]" />,
            title: "STARTER STRIPS",
            desc: "Owens Corning Starter Strip Plus: A specialized shingle installed on all eaves for a straight edge and an effective perimeter seal against high winds."
        },
        {
            icon: <Wrench className="w-6 h-6 text-[#00D1FF]" />,
            title: "HIP & RIDGE",
            desc: "Upgrade: Owens Corning DuraRidge® Hip & Ridge Shingles. Provides a high-profile look utilizing a specialized modified asphalt blend for superior flexibility and 130 mph wind resistance."
        },
        {
            icon: <Wind className="w-6 h-6 text-[var(--rhive-pink)]" />,
            title: "VENTILATION",
            desc: "Balanced Ventsure System: Exhaust uses Sky Runner LTE or 4-Foot Strip Ridge Vent (high NFVA). Intake is via soffit or deck-mount air. (All turtle vents permanently canceled)."
        }
    ];

    return (
        <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] overflow-x-hidden pt-24 pb-20">
            <div className="max-w-5xl mx-auto px-6 lg:px-8">

                {/* Back Navigation */}
                <button
                    onClick={() => setActivePageId('P-02a')}
                    className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 font-mono text-xs uppercase tracking-widest transition-colors"
                >
                    &larr; Back to Asphalt Systems
                </button>

                {/* Header */}
                <div className="border-b border-white/10 pb-10 mb-12">
                    <div className="inline-flex items-center px-3 py-1 mb-6 rounded-sm bg-[#00D1FF]/10 border border-[#00D1FF]/20 font-mono text-[10px] uppercase tracking-wider text-[#00D1FF]">
                        CLASS 4 IMPACT RATED - EXTREME WEATHER
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight mb-4 flex items-center gap-4">
                        O.C. FLEX <span className="text-[#00D1FF]">Package</span>
                    </h1>
                    <p className="text-xl text-gray-300 font-serif leading-relaxed max-w-3xl">
                        Premium, high-performance solution featuring Owens Corning Duration FLEX®. Engineered with
                        specialized polymer-modified asphalt for superior flexibility to defend against extreme western weather.
                    </p>
                </div>

                {/* Inclusions Grid */}
                <h2 className="text-2xl font-black text-white uppercase mb-8 tracking-tight">System Inclusions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
                    {inclusions.map((item, i) => (
                        <div key={i} className={`bg-black/50 border p-6 rounded-sm transition-colors ${i === 1 || i === 5 ? 'border-[#00D1FF]/30 hover:border-[#00D1FF]' : 'border-white/5 hover:border-white/20'}`}>
                            {/* Highlight the upgrade items */}
                            {(i === 1 || i === 5) && (
                                <div className="text-[10px] font-mono text-[#00D1FF] uppercase mb-3 tracking-widest bg-[#00D1FF]/10 inline-block px-2 py-0.5">
                                    System Upgrade
                                </div>
                            )}
                            <div className="flex items-start gap-4">
                                <div className="mt-1 p-2 bg-white/5 rounded-sm">
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
                <div className="bg-gradient-to-br from-[#00D1FF]/10 to-transparent p-10 border border-[#00D1FF]/20 text-center">
                    <h3 className="text-2xl font-black text-white uppercase mb-4">Maximum Impact Defense</h3>
                    <p className="text-gray-400 mb-8 max-w-xl mx-auto">Lock down extreme weather protection. Get an instant estimate for the O.C. FLEX package.</p>
                    <button
                        onClick={() => setActivePageId('P-12')}
                        className="px-8 py-4 bg-[#00D1FF] hover:bg-[#00b8e6] text-black font-black uppercase tracking-widest text-sm transition-colors"
                    >
                        Request A Quote
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DurationFlexPage;
