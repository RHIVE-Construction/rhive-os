import React, { useEffect, useRef } from 'react';
import { ShieldCheck } from 'lucide-react';

interface Point {
    x: number;
    y: number;
}

// 3D Parallax Constants
const LERP_SPEED = 0.08;
const MAX_ROTATE_Y = 35; // Max left/right twist
const MAX_ROTATE_X = 20; // Max up/down tilt
const MAX_LEAN_PX = 45; // Max pixels to physically lean
const REACH_SCALE = 1.3; // The scale when "grabbing" the mouse

const lerp = (start: number, end: number, factor: number) => {
    return start + (end - start) * factor;
};

export const InteractiveOCMascot = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const pantherRef = useRef<HTMLImageElement>(null);

    // Physics State
    const mouse = useRef<Point>({ x: typeof window !== 'undefined' ? window.innerWidth / 2 : 500, y: typeof window !== 'undefined' ? window.innerHeight / 2 : 500 });

    // Current animated values
    const currentProps = useRef({
        x: 0,
        y: 0,
        rotateX: 0,
        rotateY: 0,
        scale: 1,
    });

    const animationFrameId = useRef<number>();

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouse.current = { x: e.clientX, y: e.clientY };
        };

        window.addEventListener('mousemove', handleMouseMove);

        const updatePhysics = () => {
            if (!containerRef.current || !pantherRef.current) {
                animationFrameId.current = requestAnimationFrame(updatePhysics);
                return;
            }

            const rect = pantherRef.current.getBoundingClientRect();

            // Visual center of the cat (roughly chest high)
            const catCenterX = rect.left + rect.width / 2;
            const catCenterY = rect.top + rect.height * 0.4;

            const mx = mouse.current.x;
            const my = mouse.current.y;

            const dx = mx - catCenterX;
            const dy = my - catCenterY;

            // Proximity (0 to 1) to determine scale/reach intensity (1 = touching)
            const maxDistance = 800;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const normalizedDist = Math.min(distance / maxDistance, 1);
            const proximityFactor = Math.pow(1 - normalizedDist, 2); // Exponential easing

            // 1. Rotation Tracking (Looking at cursor)
            // If mouse is to the left (dx < 0), rotateY should be negative to turn left
            const targetRotateY = (dx / window.innerWidth) * MAX_ROTATE_Y * 2;
            // If mouse is up (dy < 0), rotateX should be positive to tilt up
            const targetRotateX = -(dy / window.innerHeight) * MAX_ROTATE_X * 2;

            // 2. Translation (Leaning towards cursor)
            const targetX = (dx / window.innerWidth) * MAX_LEAN_PX * 2;
            const targetY = (dy / window.innerHeight) * MAX_LEAN_PX * 2;

            // 3. Scale (Grabbing/Reaching when close)
            const targetScale = 1 + (REACH_SCALE - 1) * proximityFactor;

            // 4. LERP Processing (Physical Inertia)
            const state = currentProps.current;
            state.x = lerp(state.x, targetX, LERP_SPEED);
            state.y = lerp(state.y, targetY, LERP_SPEED);
            state.rotateX = lerp(state.rotateX, targetRotateX, LERP_SPEED);
            state.rotateY = lerp(state.rotateY, targetRotateY, LERP_SPEED);
            state.scale = lerp(state.scale, targetScale, LERP_SPEED * 1.5); // Pop faster than drifting

            // 5. Apply matrix to GPU Layout
            pantherRef.current.style.transform = `
                translate3d(${state.x}px, ${state.y}px, 0)
                rotateX(${state.rotateX}deg) 
                rotateY(${state.rotateY}deg)
                scale(${state.scale})
            `;

            animationFrameId.current = requestAnimationFrame(updatePhysics);
        };

        animationFrameId.current = requestAnimationFrame(updatePhysics);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
        };
    }, []);

    return (
        <div ref={containerRef} className="absolute bottom-0 right-0 md:right-0 z-40 w-full md:w-auto flex flex-col items-end pointer-events-none group/warranty perspective-[1200px]">
            {/* Slide-up Container on Hover */}
            <div className="relative transform translate-y-[85%] hover:translate-y-0 group-hover/warranty:translate-y-0 transition-transform duration-[800ms] ease-out flex items-end">

                {/* 3D PARALLAX MASCOT IMAGE - BLOWN UP BACKDROP */}
                <div className="absolute bottom-[-10px] -right-28 w-[800px] h-[900px] z-0 pointer-events-none flex flex-col items-center justify-end perspective-[2000px] transform-style-3d overflow-visible opacity-50 group-hover/warranty:opacity-100 transition-opacity duration-700">
                    
                    {/* PRECISE HIT AREA (SVG Polygon matching panther shape) */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 800 900">
                        {/* This polygon represents the 'pixels' of the panther roughly */}
                        <polygon 
                            points="400,900 700,900 750,700 700,400 600,200 450,150 300,200 250,400 300,700 350,900" 
                            className="pointer-events-auto cursor-pointer fill-transparent"
                            // Adding hover state trigger via child polygon if needed, but since it's inside group/warranty, group-hover works
                        />
                    </svg>

                    <img
                        ref={pantherRef}
                        src="/panther-transparent.png"
                        alt="Owens Corning Panther"
                        className="w-full h-full object-contain origin-bottom filter drop-shadow-[0_20px_30px_rgba(0,0,0,0.7)] translate-y-12 scale-100 pointer-events-none"
                        style={{ willChange: 'transform' }}
                    />
                </div>

                {/* THE ACTUAL WARRANTY BOX CONTENT */}
                <div className="absolute bottom-0 right-10 w-[400px] h-[120px] bg-black/95 blur-3xl rounded-[100%]" />

                <div className="relative z-10 bg-gradient-to-br from-[#0a0a0a] via-[#111] to-[#050505] border-t-2 border-l-2 border-[#ec028b] p-8 pr-12 shadow-[0_0_80px_rgba(236,2,139,0.5)] pointer-events-auto backdrop-blur-md"
                    style={{ clipPath: 'polygon(32px 0, 100% 0, 100% 100%, 0 100%, 0 32px)' }}>

                    {/* Pink Pulse Interior */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#ec028b] blur-[100px] opacity-10 group-hover/warranty:opacity-30 transition-opacity duration-700" />

                    <div className="flex flex-col gap-6 relative z-10 w-[450px]">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="h-3 w-1 bg-[#ec028b] shadow-[0_0_8px_#ec028b]"></div>
                                <h4 className="text-white font-black uppercase text-base tracking-[0.25em]">Duration® Integrated Protection</h4>
                            </div>
                            <p className="text-gray-400 font-sans text-[10px] uppercase tracking-widest font-bold ml-4">
                                The <span className="text-[#ec028b]">Industry-Defining</span> Standard for Wind & Weather Defense
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            {/* Primary Manufacture Warranty */}
                            <div className="flex items-start gap-4 p-4 bg-white/5 border border-white/5 hover:border-[#ec028b]/30 transition-colors">
                                <div className="p-2 bg-[#ec028b]/10 border border-[#ec028b]/20">
                                    <ShieldCheck className="w-5 h-5 text-[#ec028b]" />
                                </div>
                                <div className="flex-1">
                                    <span className="text-[#ec028b] font-black text-[9px] uppercase block tracking-widest mb-1">OWENS CORNING - PREFERRED PROTECTION</span>
                                    <span className="text-white font-black text-[11px] uppercase block tracking-wider mb-1">50-YR NON-PRORATED SYSTEM WARRANTY</span>
                                    <p className="text-gray-500 text-[9px] uppercase font-bold leading-tight tracking-widest">
                                        Powered by SureNail® Technology. Includes <span className="text-white">10-Yr Workmanship Backing</span> from OC—your ultimate insurance against market fluctuations.
                                        <span className="block mt-1 text-[8px] italic text-[#ec028b]/80">*Unlocked via 4+ Performance Components*</span>
                                    </p>
                                </div>
                            </div>

                            {/* Workmanship & Installer Guarantee */}
                            <div className="flex items-start gap-4 p-4 bg-white/5 border border-white/5 hover:border-[#00D1FF]/30 transition-colors">
                                <div className="p-2 bg-[#00D1FF]/10 border border-[#00D1FF]/20">
                                    <div className="w-5 h-5 flex items-center justify-center">
                                        <div className="w-3 h-3 bg-[#00D1FF] rotate-45 shadow-[0_0_10px_#00D1FF]" />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <span className="text-[#00D1FF] font-black text-[9px] uppercase block tracking-widest mb-1">RHIVE MASTER INSTALLER GUARANTEE</span>
                                    <span className="text-white font-black text-[11px] uppercase block tracking-wider mb-1">LIFETIME NO-LEAK CRAFTSMANSHIP</span>
                                    <p className="text-gray-500 text-[9px] uppercase font-bold leading-tight tracking-widest">A zero-fail, in-house commitment to your property's absolute moisture defense for the life of the shingle.</p>
                                </div>
                            </div>
                        </div>

                        {/* CERTIFIED COMPARISON MATRIX - DUAL MATH */}
                        <div className="mt-2 border-t border-white/10 pt-4">
                            <div className="text-[10px] text-rhive-gold font-mono uppercase tracking-[0.3em] mb-4">The "Dual-Math" Advantage</div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/5 p-3 rounded-sm border-l border-gray-600">
                                    <div className="text-[8px] text-gray-500 uppercase tracking-widest font-bold mb-1">Typical Contractors</div>
                                    <div className="text-[10px] text-white font-black">Speculative Pricing</div>
                                    <div className="text-[8px] text-gray-400 mt-1 uppercase italic tracking-wider">Estimated margins</div>
                                </div>
                                <div className="bg-rhive-pink/10 p-3 rounded-sm border-l-2 border-rhive-pink">
                                    <div className="text-[8px] text-rhive-pink uppercase tracking-widest font-bold mb-1">RHIVE TRANSPARENCY</div>
                                    <div className="text-[10px] text-white font-black whitespace-nowrap">Direct Cost + Fixed Fee</div>
                                    <div className="text-[8px] text-gray-300 mt-1 uppercase italic tracking-wider">No hidden builder-adjusted markups</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>

    );
};

export default InteractiveOCMascot;
