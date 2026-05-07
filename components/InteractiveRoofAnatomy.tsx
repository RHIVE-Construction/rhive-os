import React, { useState, useRef } from 'react';

interface RoofMarker {
    id: string;
    label: string;
    description: string;
    image?: string;
    dotPos: { x: number; y: number };
    labelPos: { x: number; y: number };
    customContent?: React.ReactNode;
}

// Markers mapping to coordinates in a 100x100 SVG space holding the 3D model
const markers: RoofMarker[] = [
    {
        id: 'full-metal',
        label: "FULL METAL FLASHINGS",
        description: "28 G Steel Flashing along the 'roof to wall' as needed. We handle all local building permits and manufacturer warranty registrations so you don't have to.",
        image: 'https://static.wixstatic.com/media/c5862a_4fae850cf3ac440cbcbba81dbec2b7a6~mv2.jpg',
        dotPos: { x: 26, y: 62 },
        labelPos: { x: 8, y: 55 }
    },
    {
        id: 'pipe-flashings',
        label: "FULL METAL PIPE FLASHINGS",
        description: "All jackets replaced and sealed. RHIVE guarantees a leak-free installation for the lifetime of the roof, exceeding standard contractor warranties.",
        image: 'https://static.wixstatic.com/media/c5862a_63ac038e810a4346987d02d0e171ba79~mv2.jpg',
        dotPos: { x: 34, y: 58 },
        labelPos: { x: 15, y: 40 }
    },
    {
        id: 'pro-armor',
        label: "O.C. PRO ARMOR UNDERLAYMENT",
        description: "A synthetic water-shedding barrier. We strictly adhere to manufacturer guidelines to ensure the full system is protected by your warranty.",
        image: 'https://static.wixstatic.com/media/c5862a_43781d1ec90b48aa844293b849fae05a~mv2.jpeg',
        dotPos: { x: 42, y: 65 },
        labelPos: { x: 25, y: 15 }
    },
    {
        id: 'ice-water',
        label: "O.C. WEATHERLOCK ICE & WATER",
        description: "Vital protection for valleys safely installed under our strict No-Layover policy to ensure structural integrity and maximum lifespan.",
        image: 'https://static.wixstatic.com/media/c5862a_babe9c016a734f31b3be88b8ef2e9ccc~mv2.avif',
        dotPos: { x: 43, y: 72 },
        labelPos: { x: 35, y: 25 }
    },
    {
        id: 'hip-ridge',
        label: "O.C HIP AND RIDGE CAP",
        description: "Extra protection along hips and ridges. Enjoy a fully transparent quoting process with exact cost breakdowns for every material.",
        image: 'https://static.wixstatic.com/media/c5862a_fd58a699e8354cecb37bf96134693fc7~mv2.avif',
        dotPos: { x: 50, y: 41 },
        labelPos: { x: 42, y: 10 }
    },
    {
        id: 'starter-strip',
        label: "O.C. STARTER STRIP+",
        description: "Ensures a perfect seal along the roof's edge. Our precise installation method safeguards against 130 MPH high winds with $2M liability insurance.",
        image: 'https://static.wixstatic.com/media/c5862a_445728697a264bc4a949908dc3f1efb5~mv2.jpg',
        dotPos: { x: 46, y: 77 },
        labelPos: { x: 40, y: 52 }
    },
    {
        id: 'shingles',
        label: "CHOOSE YOUR SHINGLES",
        description: "Select from our premium upgrade paths: O.C. Duration Flex®, GAF Woodland® Designer Series, or GAF Grand Sequoia® Premium.",
        dotPos: { x: 60, y: 45 },
        labelPos: { x: 58, y: 25 },
        customContent: (
            <div className="grid grid-cols-4 gap-2 mt-2 w-full">
                <div className="flex flex-col gap-1 items-center">
                    <img src="/oc_duration_standard.png" className="w-full aspect-square object-cover border border-white/20" alt="Standard" />
                    <span className="text-[6px] text-white/70 uppercase text-center leading-tight">Standard<br/>Duration</span>
                </div>
                <div className="flex flex-col gap-1 items-center">
                    <img src="/duration_flex_shingle.png" className="w-full aspect-square object-cover border border-[var(--rhive-pink)]/30" alt="Flex" />
                    <span className="text-[6px] text-[var(--rhive-pink)]/80 uppercase text-center leading-tight font-semibold">Flex<br/>Upgrade</span>
                </div>
                <div className="flex flex-col gap-1 items-center">
                    <img src="/gaf_woodland_shingle.png" className="w-full aspect-square object-cover border border-[var(--rhive-pink)]/60" alt="Designer" />
                    <span className="text-[6px] text-[var(--rhive-pink)] uppercase text-center leading-tight font-semibold">Designer<br/>Series</span>
                </div>
                <div className="flex flex-col gap-1 items-center">
                    <img src="/gaf_woodland_shingle.png" className="w-full aspect-square object-cover border border-[var(--rhive-pink)]" alt="Premium" />
                    <span className="text-[6px] text-[var(--rhive-pink)] uppercase text-center leading-tight font-bold">Premium<br/>Designer</span>
                </div>
            </div>
        )
    },
    {
        id: 'ridge-vent',
        label: "RIDGE PROWLER (VENT)",
        description: "Exhaust vents protect the interior. Featuring the new Ridge Prowler product, leveraging advanced airflow mechanics to pinpoint exhaust vulnerabilities.",
        image: 'https://static.wixstatic.com/media/c5862a_121f7c74c02c4853b4763e18610b8473~mv2.webp',
        dotPos: { x: 60, y: 38 },
        labelPos: { x: 72, y: 10 }
    },
    {
        id: 'drip-metal',
        label: "DRIP METAL",
        description: "Ensures optimal water runoff. Save up to $1,000 on your project with our flexible financing starting at $0 Down and 0% APR.",
        image: 'https://static.wixstatic.com/media/c5862a_9177c0981c2e4fe1bffd91d37d4b6e0c~mv2.jpg',
        dotPos: { x: 73, y: 55 },
        labelPos: { x: 80, y: 25 }
    },
    {
        id: 'intake-vent',
        label: "O.C INFLOW (DECK MOUNT AIR INTAKE)",
        description: "Intake vents protect interior components via deck mounting. Our strict adherence to the 'RHIVE Way' ensures precise placement for critical airflow balancing.",
        image: 'https://static.wixstatic.com/media/c5862a_fa09114631a942baad681a667a2f5dd6~mv2.jpg',
        dotPos: { x: 67, y: 75.5 },
        labelPos: { x: 85, y: 40 }
    }
];

export const InteractiveRoofAnatomy: React.FC = () => {
    const [isSectionHovered, setIsSectionHovered] = useState(false);
    const [activeMarkerId, setActiveMarkerId] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const activeMarker = markers.find(m => m.id === activeMarkerId) || null;

    const handleMouseLeaveSection = () => {
        setIsSectionHovered(false);
        setActiveMarkerId(null);
    };

    return (
        <section className="relative w-full py-24 select-none bg-black">
            <div className="max-w-[1400px] mx-auto px-4 relative z-10 flex flex-col items-center">
                
                {/* Header Context */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter mix-blend-difference">
                        System <span className="text-[var(--rhive-pink)]">Anatomy</span>
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto mt-4 font-serif text-lg">
                        Hover over our certified component pipeline. Explore the architecture designed to outlast typical warranties.
                    </p>
                </div>

                {/* Main Interactive Diagram Container */}
                <div 
                    className="relative w-full max-w-[1000px] aspect-[4/3] bg-transparent overflow-visible group"
                    ref={containerRef}
                    onMouseEnter={() => setIsSectionHovered(true)}
                    onMouseLeave={handleMouseLeaveSection}
                >
                    {/* The LIVE 3D Base Image (Clean) */}
                    <img
                        src="/Components%20clean.png"
                        alt="3D Roof Anatomy Diagram"
                        className="absolute inset-0 w-full h-full object-contain pointer-events-none z-0"
                    />

                    {/* Interactive Hotspots & Lines via SVG */}
                    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full z-20 pointer-events-none">
                        <defs>
                            <filter id="pinkGlow" x="-20%" y="-20%" width="140%" height="140%">
                                <feGaussianBlur stdDeviation="0.6" result="blur" />
                                <feComposite in="SourceGraphic" in2="blur" operator="over" />
                            </filter>
                        </defs>

                        {markers.map((marker) => {
                            const isActive = activeMarkerId === marker.id;
                            const isVisible = !isSectionHovered || isActive;

                            return (
                                <g key={`svg-${marker.id}`}>
                                    {/* LINE */}
                                    <line
                                        x1={marker.dotPos.x}
                                        y1={marker.dotPos.y}
                                        x2={marker.labelPos.x}
                                        y2={marker.labelPos.y + 1.5}
                                        stroke="#ec028b"
                                        strokeWidth="0.25"
                                        filter="url(#pinkGlow)"
                                        className="transition-all duration-700 ease-out"
                                        style={{
                                            strokeDasharray: 200,
                                            strokeDashoffset: isVisible ? 0 : 200,
                                            opacity: isVisible ? 1 : 0
                                        }}
                                    />
                                    
                                    {/* VISUAL DOT (always visible) */}
                                    <circle
                                        cx={marker.dotPos.x}
                                        cy={marker.dotPos.y}
                                        r={isActive ? 1.0 : 0.6}
                                        fill="#ec028b"
                                        filter="url(#pinkGlow)"
                                        className="transition-all duration-300 pointer-events-none"
                                        style={{
                                            boxShadow: '0 0 10px #ec028b'
                                        }}
                                    />

                                    {/* INVISIBLE HITBOX for the dot to make it easier to hover */}
                                    <circle
                                        cx={marker.dotPos.x}
                                        cy={marker.dotPos.y}
                                        r={2.5}
                                        fill="transparent"
                                        className="cursor-crosshair pointer-events-auto"
                                        onMouseEnter={() => setActiveMarkerId(marker.id)}
                                        onMouseLeave={() => setActiveMarkerId(null)}
                                    />
                                </g>
                            );
                        })}
                    </svg>

                    {/* HTML Overlays for Text labels */}
                    {markers.map(marker => {
                        const isActive = activeMarkerId === marker.id;
                        const isVisible = !isSectionHovered || isActive;

                        return (
                            <div 
                                key={`label-${marker.id}`}
                                className={`absolute pointer-events-none whitespace-nowrap transition-all duration-700 ease-out flex flex-col items-center z-30
                                    ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-95'}
                                `}
                                style={{
                                    left: `${marker.labelPos.x}%`,
                                    top: `${marker.labelPos.y}%`,
                                    transform: 'translate(-50%, -50%)',
                                    textShadow: '0 0 10px rgba(0,0,0,1), 0 0 20px rgba(236,2,139,0.5)'
                                }}
                            >
                                <div className="text-[9px] md:text-[11px] font-black text-white px-2 py-0.5 uppercase tracking-[0.1em] font-sans">
                                    {marker.label}
                                </div>
                            </div>
                        );
                    })}

                    {/* HUD POPUP for active item */}
                    <div
                        className={`pointer-events-none absolute w-[260px] md:w-[320px] bg-[#000000]/95 backdrop-blur-3xl border border-white/10 p-5 z-50
                            transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1) shadow-[0_0_50px_rgba(236,2,139,0.15)]
                            ${activeMarker ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'}
                        `}
                        style={{
                            clipPath: 'polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)',
                            left: `${activeMarker ? Math.min(activeMarker.labelPos.x + 5, 60) : 50}%`,
                            top: `${activeMarker ? Math.min(activeMarker.labelPos.y + 5, 50) : 50}%`,
                        }}
                    >
                        {/* Nano-Banana High-Fidelity Corner Constraints */}
                        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[var(--rhive-pink)]/40 rounded-tl-xl"></div>
                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[var(--rhive-pink)]/40 rounded-br-xl"></div>

                        {activeMarker && (
                            <div className="relative">
                                {/* Component Scan Header */}
                                <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-[var(--rhive-pink)] animate-pulse rounded-full shadow-[0_0_8px_#ec028b]"></div>
                                        <span className="text-[9px] text-[var(--rhive-pink)] font-mono uppercase tracking-[0.3em]">
                                            System Node: Active
                                        </span>
                                    </div>
                                    <span className="text-[8px] text-gray-500 font-mono italic">RHIVE OS V.2.1</span>
                                </div>

                                <h3 className="text-white font-bold text-lg leading-tight uppercase mb-1 tracking-tight">
                                    {activeMarker.label}
                                </h3>
                                <div className="text-[var(--rhive-pink)] font-mono text-[8px] uppercase tracking-widest mb-4 opacity-80">
                                    Certified Component Pipeline
                                </div>

                                {activeMarker.image && (
                                    <div className="w-full h-32 mb-4 bg-black overflow-hidden border border-white/10 relative">
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10"></div>
                                        <img
                                            src={activeMarker.image}
                                            alt={activeMarker.label}
                                            className="w-full h-full object-cover scale-110"
                                        />
                                        <div className="absolute bottom-2 left-2 z-20 flex items-center gap-1">
                                            <div className="w-1 h-1 bg-[var(--rhive-pink)]"></div>
                                            <span className="text-[7px] text-white/70 font-mono uppercase tracking-widest">Target Acquired</span>
                                        </div>
                                    </div>
                                )}

                                <p className="text-gray-400 text-xs leading-relaxed font-serif tracking-wide border-l-2 border-[var(--rhive-pink)]/50 pl-3">
                                    {activeMarker.description}
                                </p>
                                
                                {activeMarker.customContent && (
                                    <div className="mt-4">
                                        {activeMarker.customContent}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </section>
    );
};

export default InteractiveRoofAnatomy;
