import React, { useState, useRef } from 'react';
import { Hexagon } from 'lucide-react';

interface CommercialMarker {
    id: string;
    label: string;
    description: string;
    image?: string;
    hitbox: { x: number; y: number; w: number; h: number }; // Target area on the image
}

const commercialMarkers: CommercialMarker[] = [
    {
        id: 'decking',
        label: "STRUCTURAL DECKING",
        description: "The foundation of the flat roof system. Options include corrugated steel, concrete, or wood. We rigorously inspect for structural integrity before membrane installation.",
        image: 'https://images.unsplash.com/photo-1541888052126-af6a642e12e7?w=600&q=80',
        hitbox: { x: 45, y: 75, w: 10, h: 10 }
    },
    {
        id: 'polyiso',
        label: "GAF ENERGYGUARD™ POLYISO",
        description: "High-performance rigid foam insulation board providing maximal R-value. Multiple layers are staggered to prevent thermal bridging and energy loss.",
        image: 'https://images.unsplash.com/photo-1546960017-09f19dbca512?w=600&q=80',
        hitbox: { x: 40, y: 55, w: 10, h: 10 }
    },
    {
        id: 'coverboard',
        label: "HD COVER BOARD",
        description: "An optional but highly recommended high-density layer providing extreme puncture resistance from foot traffic, hail, and mechanical equipment.",
        image: 'https://images.unsplash.com/photo-1619641477727-b0625624707e?w=600&q=80',
        hitbox: { x: 35, y: 40, w: 10, h: 10 }
    },
    {
        id: 'fasteners',
        label: "DRILL-TEC™ MECHANICAL FASTENERS",
        description: "Precision-engineered plates and screws that mechanically attach the membrane and insulation to the structural deck, rated for extreme wind uplift.",
        image: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=600&q=80',
        hitbox: { x: 60, y: 35, w: 10, h: 10 }
    },
    {
        id: 'membrane',
        label: "EVERGUARD® TPO MEMBRANE",
        description: "A bright white, highly reflective thermoplastic polyolefin single-ply membrane. It inherently resists ozone, chemical exposure, and UV radiation.",
        image: 'https://images.unsplash.com/photo-1621252179027-94459d278660?w=600&q=80',
        hitbox: { x: 30, y: 25, w: 10, h: 10 }
    },
    {
        id: 'seams',
        label: "HEAT-WELDED SEAMS",
        description: "Robotic hot-air welding fuses the TPO sheets together at the molecular level, creating a unified, monolithic waterproof surface stronger than the membrane itself.",
        image: 'https://images.unsplash.com/photo-1504917595217-d4f400fb8a06?w=600&q=80',
        hitbox: { x: 65, y: 20, w: 10, h: 10 }
    }
];

export const InteractiveCommercialAnatomy: React.FC = () => {
    const [activeMarker, setActiveMarker] = useState<CommercialMarker | null>(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [parallax, setParallax] = useState({ rotateX: 0, rotateY: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();

        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;

        setMousePos({ x, y });

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotX = ((y - centerY) / centerY) * -4;
        const rotY = ((x - centerX) / centerX) * 4;

        setParallax({ rotateX: rotX, rotateY: rotY });
    };

    const handleMouseLeave = () => {
        setActiveMarker(null);
        setParallax({ rotateX: 0, rotateY: 0 });
    };

    return (
        <section className="relative w-full py-24 select-none perspective-[2000px]">
            <style>{`
                @keyframes scan-laser-pink {
                    0% { top: -10%; opacity: 0; }
                    5% { opacity: 1; }
                    40% { top: 110%; opacity: 1; }
                    80% { top: 110%; opacity: 0; }
                    100% { top: -10%; opacity: 0; }
                }
            `}</style>
            <div className="max-w-6xl mx-auto px-4 relative z-10">
                <div
                    ref={containerRef}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    className="relative w-full max-w-4xl mx-auto aspect-[16/10] bg-[#000000] rounded-xl overflow-hidden transition-all duration-[400ms] ease-out shadow-2xl border border-white/5"
                    style={{
                        transform: `rotateX(${parallax.rotateX}deg) rotateY(${parallax.rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
                        boxShadow: `0 ${20 + parallax.rotateX * -2}px ${40 + Math.abs(parallax.rotateY * 2)}px rgba(0,0,0,0.8), inset 0 0 0 1px rgba(255,255,255,0.05)`
                    }}
                >
                    {/* Generated Diagram Image */}
                    <img
                        src="/tpo-flat-roof-diagram.png"
                        alt="3D Commercial Roof Anatomy Diagram"
                        className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0 mix-blend-lighten"
                    />

                    {/* Scanning Laser Effect Overlay (Blue for Commercial) */}
                    <div className="absolute inset-0 z-10 pointer-events-none mix-blend-screen">
                        <div
                            className="absolute left-0 right-0 h-[2px] bg-[var(--rhive-pink)]/80 shadow-[0_0_20px_rgba(236,2,139,1)]"
                            style={{ animation: 'scan-laser-pink 8s ease-in-out infinite' }}
                        >
                            <div className="absolute bottom-full left-0 right-0 h-24 bg-gradient-to-t from-[var(--rhive-pink)]/30 to-transparent"></div>
                        </div>
                    </div>

                    {/* Overlaid Visible "Pink" / Tech Dots */}
                    {commercialMarkers.map((marker, idx) => (
                        <div
                            key={`dot-${marker.id}`}
                            className="absolute flex items-center justify-center z-20 cursor-crosshair group pointer-events-auto"
                            style={{
                                left: `${marker.hitbox.x}%`,
                                top: `${marker.hitbox.y}%`,
                                width: `${marker.hitbox.w}%`,
                                height: `${marker.hitbox.h}%`
                            }}
                            onMouseEnter={() => setActiveMarker(marker)}
                        >
                            <div className={`w-4 h-4 md:w-6 md:h-6 rounded-full border-2 transition-all duration-300 ${activeMarker?.id === marker.id ? 'border-[var(--rhive-pink)] bg-[var(--rhive-pink)]/40 scale-150 shadow-[0_0_15px_rgba(236,2,139,0.8)]' : 'border-[var(--rhive-pink)] bg-black/50 hover:border-[var(--rhive-pink)] hover:bg-[var(--rhive-pink)]/20'}`}></div>
                            <div className="absolute inset-0 rounded-full border border-[var(--rhive-pink)]/30 animate-ping"></div>
                        </div>
                    ))}

                    {/* Nano-Banana Pro Cursor-Following HUD */}
                    <div
                        className={`absolute w-72 md:w-80 bg-[var(--bg-card-translucent)] backdrop-blur-3xl border border-white/20 rounded-xl p-5 z-50 pointer-events-none
                            transition-all duration-[200ms] ease-out
                            ${activeMarker ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}
                        `}
                        style={{
                            left: `${Math.min(Math.max(20, mousePos.x + 20), containerRef.current ? containerRef.current.clientWidth - 300 : 800)}px`,
                            top: `${Math.min(Math.max(20, mousePos.y - 100), containerRef.current ? containerRef.current.clientHeight - 300 : 800)}px`
                        }}
                    >
                        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[var(--rhive-pink)] rounded-tl-xl opacity-70"></div>
                        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[var(--rhive-pink)] rounded-br-xl opacity-70"></div>

                        {activeMarker && (
                            <div className="relative">
                                <div className="flex items-center gap-2 mb-3 border-b border-white/10 pb-2">
                                    <Hexagon className="w-4 h-4 text-[var(--rhive-pink)] animate-pulse" />
                                    <span className="text-[10px] text-[var(--rhive-pink)] font-mono uppercase tracking-widest">
                                        Data Extracted
                                    </span>
                                </div>

                                <h3 className="text-white font-black text-lg leading-tight uppercase mb-3 drop-shadow-md">
                                    {activeMarker.label.replace(/\n/g, ' ')}
                                </h3>

                                {activeMarker.image && (
                                    <div className="w-full h-36 mb-3 bg-black rounded overflow-hidden border border-white/10 relative group-hover:border-[var(--rhive-pink)]/30">
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 w-full h-full pointer-events-none"></div>
                                        <img
                                            src={activeMarker.image}
                                            alt={activeMarker.label}
                                            className="w-full h-full object-cover relative z-0"
                                        />
                                    </div>
                                )}

                                <p className="text-gray-300 text-sm leading-relaxed font-serif relative z-10">
                                    {activeMarker.description}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default InteractiveCommercialAnatomy;
