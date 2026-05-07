import React from 'react';
import { useNavigation } from '../contexts/NavigationContext';
import { Shield, Zap, Hammer, FileCheck, Anchor, Wind, Wrench, Menu } from 'lucide-react';

const DurationPerformancePage: React.FC = () => {
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
            desc: "Owens Corning Duration Series Shingles: 50-Year Preferred Protection featuring SureNail Technology, 130 MPH Wind Rating, and guaranteed StreakGuard™ Algae Resistance 25YR."
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
            desc: "Owens Corning ProEdge Hip & Ridge Shingles: Provides an architectural, high-profile look while delivering enhanced system performance and 130 mph wind resistance."
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
                    <div className="inline-flex items-center px-3 py-1 mb-6 rounded-sm bg-white/5 border border-white/10 font-mono text-[10px] uppercase tracking-wider text-gray-300">
                        THE PERFORMANCE BASELINE
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight mb-4 flex items-center gap-4">
                        O.C. Duration <span className="text-[var(--rhive-pink)]">Package</span>
                    </h1>
                    <p className="text-xl text-gray-300 font-serif leading-relaxed max-w-3xl">
                        Premium roofing solution featuring Owens Corning Duration shingles. This system delivers
                        commercial-grade durability built for the toughest Western weather and is backed by our
                        Lifetime No-Leak Guarantee.
                    </p>
                </div>

                {/* Inclusions Grid */}
                <h2 className="text-2xl font-black text-white uppercase mb-8 tracking-tight">System Inclusions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
                    {inclusions.map((item, i) => (
                        <div key={i} className="bg-black/50 border border-white/5 p-6 rounded-sm hover:border-white/20 transition-colors">
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
                <div className="bg-gradient-to-br from-[var(--rhive-pink)]/10 to-transparent p-10 border border-[var(--rhive-pink)]/20 text-center">
                    <h3 className="text-2xl font-black text-white uppercase mb-4">Protect Your Structure Today</h3>
                    <p className="text-gray-400 mb-8 max-w-xl mx-auto">Get an instant estimate for the O.C. Duration package using our transparent pricing engine.</p>
                    <button
                        onClick={() => setActivePageId('P-12')}
                        className="px-8 py-4 bg-[var(--rhive-pink)] hover:bg-[#c90278] text-white font-bold uppercase tracking-widest text-sm transition-colors"
                    >
                        Request A Quote
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DurationPerformancePage;
