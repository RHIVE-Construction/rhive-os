import React from 'react';
import { useNavigation } from '../contexts/NavigationContext';
import { Shield, Map, Target, Layers, Anchor, Wind, Wrench } from 'lucide-react';
import ContextualCTA from '../components/ContextualCTA';
import GlobalBottomCTA from '../components/GlobalBottomCTA';

const PremiumDesignerPackagePage: React.FC = () => {
    const { setActivePageId } = useNavigation();

    const inclusions = [
        {
            icon: <Shield className="w-6 h-6" color="url(#blue-white-grad)" />,
            title: "GAF SYSTEM PLUS® WARRANTY",
            desc: "Includes 50 years of non-prorated material and labor coverage for manufacturing defects, 10 years of workmanship coverage, 130 MPH wind resistance, and 25 years of StainGuard® Algae Protection."
        },
        {
            icon: <Layers className="w-6 h-6" color="url(#blue-white-grad)" />,
            title: "FIELD SHINGLES",
            desc: "Upgrade: GAF Grand Sequoia® Designer Shingles. 50-Year System Plus Protection with an extra-large, multi-layered profile creating the most robust and authentic wood-shake aesthetic available."
        },
        {
            icon: <Anchor className="w-6 h-6" color="url(#blue-white-grad)" />,
            title: "HARDWARE & FASTENERS",
            desc: "6 electro-galvanized coil nails per shingle, installed in the manufacturer's specified nailing zone, securing the 130 MPH Wind Resistance."
        },
        {
            icon: <Map className="w-6 h-6" color="url(#blue-white-grad)" />,
            title: "UNDERLAYMENT",
            desc: "GAF Tiger Paw™ Premium Roof Deck Protection: A high-performance, non-woven synthetic underlayment installed on the entire non-covered roof field as a secondary barrier."
        },
        {
            icon: <Target className="w-6 h-6" color="url(#blue-white-grad)" />,
            title: "STARTER STRIPS",
            desc: "GAF Pro-Start® Eave/Rake Starter Strip: A specialized shingle installed on all eaves and rake edges for a continuous perimeter seal and effective high-wind defense."
        },
        {
            icon: <Wind className="w-6 h-6" color="url(#blue-white-grad)" />,
            title: "VENTILATION",
            desc: "Balanced GAF System: Exhaust uses a GAF Cobra® Exhaust Vent or equivalent (high NFVA) engineered for optimal airflow. Intake is via soffit or deck-mount air."
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
                    <div className="inline-flex items-center px-3 py-1 mb-6 rounded-sm bg-rhive-blue/10 border border-rhive-blue/30 font-mono text-base uppercase tracking-wider bg-gradient-to-t from-rhive-blue to-white bg-clip-text text-transparent">
                        ULTIMATE BESPOKE ARCHITECTURE
                    </div>
                    <h1 className="text-4xl md:text-5xl leading-tight font-black text-white uppercase tracking-tight mb-4 flex items-center gap-4">
                        Premium Designer <span className="bg-gradient-to-t from-rhive-blue to-white bg-clip-text text-transparent">Package</span>
                    </h1>
                    <p className="text-xl text-gray-300 font-serif leading-relaxed max-w-prose">
                        Indulge in the ultimate dimensional presence. The GAF Grand Sequoia® Designer system delivers
                        unmatched, high-profile aesthetics and lasting defense for absolute luxury and protection.
                    </p>
                </div>

                {/* Inclusions Grid */}
                <h2 className="text-2xl leading-tight font-black text-white uppercase mb-8 tracking-tight">System Inclusions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
                    {inclusions.map((item, i) => (
                        <div key={i} className={`bg-black/50 border p-6 rounded-sm transition-colors ${i === 1 ? 'border-rhive-blue/40 hover:border-rhive-blue' : 'border-white/5 hover:border-white/20'}`}>
                            {i === 1 && (
                                <div className="text-base font-mono uppercase mb-3 tracking-widest bg-rhive-blue/10 inline-block px-2 py-0.5 bg-gradient-to-t from-rhive-blue to-white bg-clip-text text-transparent">
                                    Grand Sequoia Upgrade
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
                    message="Love this look for your home?" 
                    buttonText="Schedule a Design Consultation" 
                />
            </div>
            
            {/* Global Catch-All CTA */}
            <GlobalBottomCTA />
        </div>
    );
};

export default PremiumDesignerPackagePage;
