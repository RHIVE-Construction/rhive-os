import React from 'react';
import { useNavigation } from '../contexts/NavigationContext';
import { Shield, Map, Target, Layers, Anchor, Wind, Wrench } from 'lucide-react';
import ContextualCTA from '../components/ContextualCTA';
import GlobalBottomCTA from '../components/GlobalBottomCTA';

const DesignerPackagePage: React.FC = () => {
    const { setActivePageId } = useNavigation();

    const inclusions = [
        {
            icon: <Shield className="w-6 h-6 text-[var(--rhive-pink)]" />,
            title: "GAF SYSTEM PLUS® WARRANTY",
            desc: "Includes 50 years of non-prorated material and labor coverage for manufacturing defects, 10 years of workmanship coverage, 130 MPH wind resistance, and 25 years of StainGuard® Algae Protection."
        },
        {
            icon: <Layers className="w-6 h-6 text-rhive-gold" />,
            title: "FIELD SHINGLES",
            desc: "GAF Woodland® Designer Shingles: 50-Year System Plus Protection with a custom, heavy-duty profile that mimics the look of classic wood shake, delivering exceptional dimensional texture."
        },
        {
            icon: <Anchor className="w-6 h-6 text-[var(--rhive-pink)]" />,
            title: "HARDWARE & FASTENERS",
            desc: "6 electro-galvanized coil nails per shingle, installed in the manufacturer's specified nailing zone, securing the 130 MPH Wind Resistance."
        },
        {
            icon: <Map className="w-6 h-6 text-rhive-gold" />,
            title: "UNDERLAYMENT",
            desc: "GAF Tiger Paw™ Premium Roof Deck Protection: A high-performance, non-woven synthetic underlayment installed on the entire non-covered roof field as a secondary barrier."
        },
        {
            icon: <Target className="w-6 h-6 text-[var(--rhive-pink)]" />,
            title: "STARTER STRIPS",
            desc: "GAF Pro-Start® Eave/Rake Starter Strip: A specialized shingle installed on all eaves and rake edges for a continuous perimeter seal and effective high-wind defense."
        },
        {
            icon: <Wind className="w-6 h-6 text-rhive-gold" />,
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
                    <div className="inline-flex items-center px-3 py-1 mb-6 rounded-sm bg-rhive-gold/10 border border-rhive-gold/30 font-mono text-base uppercase tracking-wider text-rhive-gold">
                        PREMIUM ARCHITECTURAL SOLUTION
                    </div>
                    <h1 className="text-4xl md:text-5xl leading-tight font-black text-white uppercase tracking-tight mb-4 flex items-center gap-4">
                        Designer <span className="text-rhive-gold">Package</span>
                    </h1>
                    <p className="text-xl text-gray-300 font-serif leading-relaxed max-w-prose">
                        Transform your structure with GAF Woodland® Designer Shingles. Delivering unparalleled curb appeal
                        and a stunning dimensional, heavy-duty aesthetic that mimics classic wood shake.
                    </p>
                </div>

                {/* Visual Gallery (I Target) */}
                <div className="mb-16">
                    <div className="flex items-center gap-4 mb-6">
                        <h2 className="text-2xl leading-tight font-black text-white uppercase tracking-tight">Exclusive Gallery</h2>
                        <div className="h-[1px] flex-grow bg-gradient-to-r from-rhive-gold/50 to-transparent" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="h-72 overflow-hidden rounded-sm group relative">
                            <img src="https://firebasestorage.googleapis.com/v0/b/video-qr-automator.firebasestorage.app/o/Website%20Media%20Assets%2FGAF%20Woodland%2FHouse%2FCedarwood%20Abbey%20House.png?alt=media&token=7c633769-7bf9-4576-8e41-a09951317e80" alt="Stunning Roof" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            <div className="absolute bottom-0 left-0 bg-black/80 px-4 py-2 font-mono text-xs tracking-widest uppercase text-rhive-gold">Stunning Visuals</div>
                        </div>
                        <div className="h-72 overflow-hidden rounded-sm group relative">
                            <img src="https://firebasestorage.googleapis.com/v0/b/video-qr-automator.firebasestorage.app/o/Website%20Media%20Assets%2FGAF%20Woodland%2FHouse%2FCastlewood%20Gray%20House.png?alt=media&token=0d9c4275-95a9-496a-a778-553a3a97e149" alt="Exclusive Design" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            <div className="absolute bottom-0 left-0 bg-black/80 px-4 py-2 font-mono text-xs tracking-widest uppercase text-rhive-gold">Maximum Curb Appeal</div>
                        </div>
                    </div>
                </div>

                {/* Inclusions Grid */}
                <h2 className="text-2xl leading-tight font-black text-white uppercase mb-8 tracking-tight">System Inclusions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
                    {inclusions.map((item, i) => (
                        <div key={i} className="bg-black/50 border border-white/5 p-6 rounded-sm hover:border-white/20 transition-colors">
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

export default DesignerPackagePage;
