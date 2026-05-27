import React from 'react';
import { useNavigation } from '../contexts/NavigationContext';
import { Shield, Zap, Hammer, FileCheck, Anchor, Wind, Wrench, Menu } from 'lucide-react';
import ContextualCTA from '../components/ContextualCTA';
import GlobalBottomCTA from '../components/GlobalBottomCTA';

const DurationFlexPage: React.FC = () => {
    const { setActivePageId } = useNavigation();

    const inclusions = [
        {
            icon: <Shield className="w-6 h-6 text-[var(--rhive-pink)]" />,
            title: "O.C. PREFERRED PROTECTION PLAN",
            desc: "Includes 50 years of non-prorated material and labor coverage, 10 years of workmanship coverage, 130 MPH wind resistance, and 25 years of algae resistance. Conferred automatically by RHIVE's certified installation."
        },
        {
            icon: <Hammer className="w-6 h-6" color="url(#blue-white-grad)" />,
            title: "FIELD SHINGLES",
            desc: "Upgrade: Owens Corning Duration FLEX® Shingles. 50-Year Preferred Protection, Class 4 Impact Rated featuring polymer-modified asphalt for extreme flexibility, SureNail Technology, and 130 MPH Wind Rating."
        },
        {
            icon: <Anchor className="w-6 h-6 text-[var(--rhive-pink)]" />,
            title: "HARDWARE & FASTENERS",
            desc: "Electro-galvanized coil nails installed with 6 nails per shingle (utilizing SureNail Technology) for superior wind resistance to exceed standard building codes."
        },
        {
            icon: <FileCheck className="w-6 h-6" color="url(#blue-white-grad)" />,
            title: "UNDERLAYMENT",
            desc: "Owens Corning ProArmor®: A high-performance synthetic underlayment installed on the entire non-covered roof field as a secondary water-shedding barrier."
        },
        {
            icon: <Menu className="w-6 h-6 text-[var(--rhive-pink)]" />,
            title: "STARTER STRIPS",
            desc: "Owens Corning Starter Strip Plus: A specialized shingle installed on all eaves for a straight edge and an effective perimeter seal against high winds."
        },
        {
            icon: <Wrench className="w-6 h-6" color="url(#blue-white-grad)" />,
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
                    className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 font-mono text-base uppercase tracking-widest transition-colors"
                >
                    &larr; Back to Asphalt Systems
                </button>

                {/* Header */}
                <div className="border-b border-white/10 pb-10 mb-12">
                    <div className="inline-flex items-center px-3 py-1 mb-6 rounded-sm bg-rhive-blue/10 border border-rhive-blue/20 font-mono text-base uppercase tracking-wider bg-gradient-to-t from-rhive-blue to-white bg-clip-text text-transparent">
                        CLASS 4 IMPACT RATED - EXTREME WEATHER
                    </div>
                    <h1 className="text-4xl md:text-5xl leading-tight font-black text-white uppercase tracking-tight mb-4 flex items-center gap-4">
                        O.C. FLEX <span className="bg-gradient-to-t from-rhive-blue to-white bg-clip-text text-transparent">Package</span>
                    </h1>
                    <p className="text-xl text-gray-300 font-serif leading-relaxed max-w-prose">
                        Premium, high-performance solution featuring Owens Corning Duration FLEX®. Engineered with
                        specialized polymer-modified asphalt for superior flexibility to defend against extreme western weather.
                    </p>
                </div>

                {/* Data & Comparisons (C Target) */}
                <div className="mb-16">
                    <h2 className="text-2xl leading-tight font-black text-white uppercase tracking-tight mb-6 flex items-center gap-4">
                        Material Comparison
                        <div className="h-[1px] flex-grow bg-gradient-to-r from-white/20 to-transparent" />
                    </h2>
                    
                    <div className="overflow-x-auto border border-white/10">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/20 bg-black">
                                    <th className="p-4 text-gray-400 font-mono text-sm uppercase tracking-widest">Specification</th>
                                    <th className="p-4 text-gray-400 font-mono text-sm uppercase tracking-widest border-l border-white/10">Standard Asphalt</th>
                                    <th className="p-4 font-mono text-sm uppercase tracking-widest border-l border-white/10 bg-rhive-blue/5 bg-gradient-to-t from-rhive-blue to-white bg-clip-text text-transparent">Duration FLEX®</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm bg-black/40">
                                <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="p-4 text-white font-bold">Asphalt Type</td>
                                    <td className="p-4 text-gray-400 border-l border-white/10">Standard Oxidized</td>
                                    <td className="p-4 text-white font-bold border-l border-white/10 bg-rhive-blue/5">SBS Polymer-Modified</td>
                                </tr>
                                <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="p-4 text-white font-bold">Impact Rating</td>
                                    <td className="p-4 text-gray-400 border-l border-white/10">Class 1-3 (Variable)</td>
                                    <td className="p-4 font-bold border-l border-white/10 bg-rhive-blue/5 bg-gradient-to-t from-rhive-blue to-white bg-clip-text text-transparent">Class 4 (Highest Rating)</td>
                                </tr>
                                <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="p-4 text-white font-bold">Wind Resistance</td>
                                    <td className="p-4 text-gray-400 border-l border-white/10">110 MPH</td>
                                    <td className="p-4 text-white font-bold border-l border-white/10 bg-rhive-blue/5">130 MPH</td>
                                </tr>
                                <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="p-4 text-white font-bold">Flexibility (Cold Temp)</td>
                                    <td className="p-4 text-gray-400 border-l border-white/10">Brittle, crack-prone</td>
                                    <td className="p-4 text-white font-bold border-l border-white/10 bg-rhive-blue/5">Pliable, tear-resistant</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <button className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest hover:text-white border border-rhive-blue/30 hover:border-rhive-blue px-4 py-2 transition-colors bg-rhive-blue/5 hover:bg-rhive-blue/20">
                            <FileCheck className="w-4 h-4" color="url(#blue-white-grad)" /> <span className="bg-gradient-to-t from-rhive-blue to-white bg-clip-text text-transparent">Download Technical Specifications (PDF)</span>
                        </button>
                    </div>
                </div>

                {/* Inclusions Grid */}
                <h2 className="text-2xl leading-tight font-black text-white uppercase mb-8 tracking-tight">System Inclusions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
                    {inclusions.map((item, i) => (
                        <div key={i} className={`bg-black/50 border p-6 rounded-sm transition-colors ${i === 1 || i === 5 ? 'border-rhive-blue/30 hover:border-rhive-blue' : 'border-white/5 hover:border-white/20'}`}>
                            {/* Highlight the upgrade items */}
                            {(i === 1 || i === 5) && (
                                <div className="text-base font-mono uppercase mb-3 tracking-widest bg-rhive-blue/10 inline-block px-2 py-0.5 bg-gradient-to-t from-rhive-blue to-white bg-clip-text text-transparent">
                                    System Upgrade
                                </div>
                            )}
                            <div className="flex items-start gap-4">
                                <div className="mt-1 p-2 bg-white/5 rounded-sm">
                                    {item.icon}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                                    <p className="text-gray-400 text-base leading-relaxed max-w-prose">{item.desc}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Contextual CTA */}
                <ContextualCTA 
                    message="Need precise numbers for your project?" 
                    buttonText="Get a Detailed Material Quote" 
                />
            </div>

            {/* Global CTA */}
            <GlobalBottomCTA />
        </div>
    );
};

export default DurationFlexPage;
