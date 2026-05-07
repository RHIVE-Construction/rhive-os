import React, { useState } from 'react';
import { ArrowRightIcon } from '../components/icons';
import { useNavigation } from '../contexts/NavigationContext';
import ServicesHero from '../components/ServicesHero';
import ServicesLightbox from '../components/ServicesLightbox';
import { InteractiveRoofAnatomy } from '../components/InteractiveRoofAnatomy';
import { InteractiveCommercialAnatomy } from '../components/InteractiveCommercialAnatomy';

import CommercialLightbox from '../components/CommercialLightbox';
import GuttersLightbox from '../components/GuttersLightbox';
import IceLightbox from '../components/IceLightbox';

const ServiceHero = ({ id, title, subtitle, bgImage, ctaText, ctaThemeColor, align = 'left', onCtaClick }: any) => (
    <div id={id} className="relative w-full min-h-[500px] lg:h-[600px] py-10 flex items-center overflow-hidden group border-b border-white/10">
        {/* Background Image with Parallax & Contrast Layers */}
        <div className="absolute inset-0 z-0 bg-black">
            <div
                className="absolute inset-0 bg-cover bg-center opacity-50 group-hover:opacity-70 group-hover:scale-105 transition-all duration-[2s] ease-out filter grayscale mix-blend-luminosity"
                style={{ backgroundImage: `url(${bgImage})` }}
            ></div>
            {/* Gradient Mask to ensure text readability */}
            <div className={`absolute inset-0 bg-gradient-to-${align === 'left' ? 'r' : 'l'} from-black via-black/80 to-transparent z-10`}></div>
            {/* Ambient Base Glow */}
            <div className={`absolute ${align === 'left' ? '-left-64' : '-right-64'} top-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[150px] opacity-20 pointer-events-none transition-colors duration-1000`} style={{ backgroundColor: ctaThemeColor }}></div>
        </div>

        {/* Content Container */}
        <div className={`max-w-[85rem] mx-auto px-6 w-full relative z-20 flex flex-col ${align === 'left' ? 'items-start text-left' : 'items-end text-right'}`}>

            {/* Tech Accent Label */}
            <div className={`flex items-center gap-3 mb-6 ${align === 'right' ? 'flex-row-reverse' : ''}`}>
                <div className="w-8 h-[2px]" style={{ backgroundColor: ctaThemeColor }}></div>
                <span className="font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-white/50">RHIVE Architecture</span>
            </div>

            <h2 className="text-5xl md:text-7xl lg:text-[5.5rem] font-black text-white uppercase tracking-tighter mb-6 font-display max-w-4xl leading-[0.9] drop-shadow-2xl transition-transform duration-700 group-hover:translate-x-2">
                {title}
            </h2>

            <p className="text-gray-300 font-serif text-xl md:text-2xl leading-relaxed max-w-2xl mb-12 drop-shadow-lg font-medium">
                {subtitle}
            </p>

            <button
                onClick={onCtaClick}
                className="group/btn relative overflow-hidden bg-black/40 backdrop-blur-md border px-10 py-5 font-black uppercase tracking-widest text-xs transition-all duration-500 text-white flex items-center gap-4 hover:border-transparent"
                style={{
                    clipPath: 'polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)',
                    borderColor: 'rgba(255,255,255,0.2)'
                }}
            >
                <div className="absolute inset-0 w-[120%] h-full transition-transform duration-500 -translate-x-[105%] skew-x-12 group-hover/btn:skew-x-0 group-hover/btn:translate-x-0 z-0" style={{ backgroundColor: ctaThemeColor }}></div>
                <span className="relative z-10 flex items-center gap-3 text-white">
                    {ctaText}
                    <div className="bg-white/10 p-2 rounded-full group-hover/btn:bg-black/20 transition-colors">
                        <ArrowRightIcon className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform duration-300" />
                    </div>
                </span>
            </button>
        </div>
    </div>
);

const OurServicesPage: React.FC = () => {
    const { setActivePageId } = useNavigation();
    const [activeLightbox, setActiveLightbox] = useState<'residential' | 'commercial' | 'gutters' | 'ice' | null>(null);

    return (
        <div className="min-h-screen bg-[var(--rhive-bg)] animate-fade-in flex flex-col relative overflow-x-hidden">
            {/* H-02: Services Hero */}
            <ServicesHero />

            {/* L-02 Phase Lightboxes */}
            <ServicesLightbox isOpen={activeLightbox === 'residential'} onClose={() => setActiveLightbox(null)} />
            {activeLightbox === 'commercial' && <CommercialLightbox isOpen={true} onClose={() => setActiveLightbox(null)} />}
            {activeLightbox === 'gutters' && <GuttersLightbox isOpen={true} onClose={() => setActiveLightbox(null)} />}
            {activeLightbox === 'ice' && <IceLightbox isOpen={true} onClose={() => setActiveLightbox(null)} />}

            {/* --- HERO COLLECTION FUNNELS --- */}

            <ServiceHero
                id="residential"
                title="Commercial-Grade Asphalt Systems"
                subtitle="Engineered for absolute defense. We refuse to install standard architectural shingles; we deploy complete, lifetime-guaranteed commercial-grade systems for every client, regardless of structure size."
                bgImage="/slc-residential-roof.png"
                ctaText="Explore Asphalt Systems"
                ctaThemeColor="var(--rhive-pink)"
                align="left"
                onCtaClick={() => setActivePageId('P-02a')}
            />

            {/* Interactive Anatomy Integration */}
            <div className="w-full bg-black border-y border-white/10 py-12 relative z-10">
                <div className="absolute inset-0 bg-gradient-to-b from-[var(--rhive-pink)]/5 via-black to-black pointer-events-none"></div>
                <div className="max-w-[85rem] mx-auto px-6 mb-12 text-center relative z-20">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="w-8 h-[2px] bg-[var(--rhive-pink)]"></div>
                        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--rhive-pink)] font-bold">System Diagnostics</span>
                        <div className="w-8 h-[2px] bg-[var(--rhive-pink)]"></div>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-white uppercase font-display tracking-tight mb-4">Know Your System<span className="text-[var(--rhive-pink)]">.</span></h2>
                    <p className="text-gray-400 font-serif max-w-2xl mx-auto text-lg hover:text-white transition-colors duration-300">
                        A roof is not just shingles. It is a multi-layered defense pipeline. Hover over the nodes below to understand the RHIVE standard of protection.
                    </p>
                </div>
                <div className="relative z-20">
                    <InteractiveRoofAnatomy />
                </div>
            </div>

            <ServiceHero
                id="commercial"
                title="Membrane Roofing"
                subtitle="High-performance TPO and PVC membrane systems tested for extreme weather, high-traffic, and chemical exposure. Built for businesses that cannot stop."
                bgImage="https://images.unsplash.com/photo-1541888052126-af6a642e12e7?q=80&w=2000&auto=format&fit=crop"
                ctaText="Explore Membrane Systems"
                ctaThemeColor="var(--rhive-pink)"
                align="right"
                onCtaClick={() => setActivePageId('P-02b')}
            />

            {/* Interactive Commercial Anatomy Integration */}
            <div className="w-full bg-black border-y border-white/10 py-12 relative z-10">
                <div className="absolute inset-0 bg-gradient-to-b from-[var(--rhive-pink)]/5 via-black to-black pointer-events-none"></div>
                <div className="max-w-[85rem] mx-auto px-6 mb-12 text-center relative z-20">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="w-8 h-[2px] bg-[var(--rhive-pink)]"></div>
                        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--rhive-pink)] font-bold">Structural Diagnostics</span>
                        <div className="w-8 h-[2px] bg-[var(--rhive-pink)]"></div>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-white uppercase font-display tracking-tight mb-4">Know Your Membrane System<span className="text-[var(--rhive-pink)]">.</span></h2>
                    <p className="text-gray-400 font-serif max-w-2xl mx-auto text-lg hover:text-white transition-colors duration-300">
                        Membrane roofing demands absolute precision. Hover over the nodes below to understand the monolithic structure of our flat environments.
                    </p>
                </div>
                <div className="relative z-20">
                    <InteractiveCommercialAnatomy />
                </div>
            </div>

            <ServiceHero
                id="gutters"
                title="Gutter Defense Systems"
                subtitle='We engineer perfect runoff management. Offering 5" and 6" K-Style, Box/Square, and Half-Round architectural options customized to your property.'
                bgImage="https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=2000&auto=format&fit=crop"
                ctaText="Explore Gutter Defense"
                ctaThemeColor="var(--rhive-pink)"
                align="left"
                onCtaClick={() => setActivePageId('P-02c')}
            />

            <ServiceHero
                id="ice"
                title="Automated Ice Management"
                subtitle="Self-regulating heat trace systems and robust snow retention to prevent catastrophic ice dams and winter structural failure."
                bgImage="https://images.unsplash.com/photo-1518546305927-5a555bb70208?q=80&w=2000&auto=format&fit=crop"
                ctaText="Explore Ice Defense"
                ctaThemeColor="var(--rhive-pink)"
                align="right"
                onCtaClick={() => setActivePageId('P-02c')}
            />

            {/* Sub-Footer Message */}
            <div className="text-center pt-5 pb-10 border-t border-white/10 relative z-10 w-full px-6">
                <div className="inline-block p-1 bg-gradient-to-r from-[var(--rhive-pink)] to-[var(--rhive-blue)] rounded-sm mb-8" style={{ clipPath: 'polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)' }}>
                    <div className="bg-black px-12 py-8" style={{ clipPath: 'polygon(14px 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%, 0 14px)' }}>
                        <h3 className="text-3xl font-black text-white uppercase font-display mb-4">Your Roof. Our Legacy.</h3>
                        <p className="text-gray-400 font-serif max-w-xl mx-auto mb-6">
                            RHIVE Roofing is more than shingles and sealants. It’s a movement of trust, transformation, and transparency. Whether you're protecting your home, your business, or your legacy—you’re part of the Hive now.
                        </p>
                        <button onClick={() => setActivePageId('P-12')} className="px-8 py-4 bg-white text-black hover:bg-[var(--rhive-pink)] hover:text-white font-black text-xs uppercase tracking-widest transition-colors" style={{ clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)' }}>
                            Join The Hive Today
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default OurServicesPage;
