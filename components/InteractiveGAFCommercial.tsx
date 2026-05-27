import React, { useEffect, useRef } from 'react';
import { ShieldCheck, Building2, Shield, Activity, HardHat } from 'lucide-react';

interface Point {
    x: number;
    y: number;
}

// 3D Parallax Constants
const LERP_SPEED = 0.08;
const MAX_ROTATE_Y = 25; // Max left/right twist
const MAX_ROTATE_X = 15; // Max up/down tilt
const MAX_LEAN_PX = 30; // Max pixels to physically lean
const REACH_SCALE = 1.15; // The scale when "grabbing" the mouse

const lerp = (start: number, end: number, factor: number) => {
    return start + (end - start) * factor;
};

export const InteractiveGAFCommercial = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const facilityRef = useRef<HTMLImageElement>(null);
    const residentialRef = useRef<HTMLImageElement>(null);

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
            if (!containerRef.current || !facilityRef.current) {
                animationFrameId.current = requestAnimationFrame(updatePhysics);
                return;
            }

            const rect = facilityRef.current.getBoundingClientRect();

            // Visual center of the facility
            const catCenterX = rect.left + rect.width / 2;
            const catCenterY = rect.top + rect.height / 2;

            const mx = mouse.current.x;
            const my = mouse.current.y;

            const dx = mx - catCenterX;
            const dy = my - catCenterY;

            // Proximity (0 to 1) to determine scale/reach intensity (1 = touching)
            const maxDistance = 900;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const normalizedDist = Math.min(distance / maxDistance, 1);
            const proximityFactor = Math.pow(1 - normalizedDist, 2); // Exponential easing

            // 1. Rotation Tracking (Looking at cursor)
            const targetRotateY = (dx / window.innerWidth) * MAX_ROTATE_Y * 2;
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
            state.scale = lerp(state.scale, targetScale, LERP_SPEED * 1.5);

            // 5. Apply matrix to GPU Layout
            facilityRef.current.style.transform = `
                translate3d(${state.x}px, ${state.y}px, 0)
                rotateX(${state.rotateX}deg) 
                rotateY(${state.rotateY}deg)
                scale(${state.scale})
            `;

            if (residentialRef.current) {
                // Parallax offset for depth illusion
                residentialRef.current.style.transform = `
                    translate3d(${state.x * 1.4}px, ${state.y * 1.4}px, 50px)
                    rotateX(${state.rotateX * 1.2}deg) 
                    rotateY(${state.rotateY * 1.2}deg)
                    scale(${state.scale})
                `;
            }

            animationFrameId.current = requestAnimationFrame(updatePhysics);
        };

        animationFrameId.current = requestAnimationFrame(updatePhysics);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
        };
    }, []);

    return (
        <div ref={containerRef} className="absolute inset-0 z-40 pointer-events-none group/warranty perspective-[1200px]">
            {/* Slide-Up Container */}
            <div className="absolute inset-x-0 bottom-0 transform translate-y-[85%] hover:translate-y-0 group-hover/warranty:translate-y-0 transition-transform duration-[800ms] ease-out flex justify-center items-end h-full">



                {/* THE COMMERCIAL AUTHORITY BOX CONTENT */}
                <div className="absolute bottom-10 left-10 md:left-24 z-10 pointer-events-auto group/box flex items-end justify-start">
                    
                    {/* Floating Icon (Visible when collapsed) */}
                    <div className="w-16 h-16 bg-[#050505] border border-[#e2ab49]/50 shadow-[0_0_30px_rgba(226,171,73,0.3)] flex items-center justify-center cursor-pointer group-hover/box:opacity-0 group-hover/box:pointer-events-none transition-opacity duration-300 relative z-20 backdrop-blur-md"
                         style={{ clipPath: 'polygon(12px 0, 100% 0, 100% 100%, 0 100%, 0 12px)' }}>
                        <Shield className="w-8 h-8 text-[#e2ab49] drop-shadow-[0_0_8px_#e2ab49]" />
                    </div>

                    {/* Expandable Box (Visible when hovered) */}
                    <div className="absolute bottom-0 left-0 z-10 bg-gradient-to-br from-[#0a0a0a] via-[#111] to-[#050505] border-t-2 border-l-2 border-[#e2ab49] shadow-[0_0_80px_rgba(226,171,73,0.3)] backdrop-blur-md overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] opacity-0 w-16 max-h-16 group-hover/box:w-[550px] group-hover/box:max-h-[800px] group-hover/box:opacity-100"
                        style={{ clipPath: 'polygon(32px 0, 100% 0, 100% 100%, 0 100%, 0 32px)' }}>
                        
                        {/* Inner Content (Fixed Width to prevent text reflow) */}
                        <div className="w-[550px] p-8 opacity-0 group-hover/box:opacity-100 transition-opacity duration-300 delay-200">
                            {/* Gold Pulse Interior */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-[#e2ab49] blur-[100px] opacity-10 group-hover/warranty:opacity-20 transition-opacity duration-700 pointer-events-none" />

                            <div className="flex flex-col gap-6 relative z-10">
                                {/* Header Section */}
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-4 w-1 bg-[#e2ab49] shadow-[0_0_8px_#e2ab49]"></div>
                                            <h4 className="text-white font-black uppercase text-xl md:text-2xl tracking-[0.1em] font-display whitespace-nowrap">GAF COMMERCIAL AUTHORITY</h4>
                                        </div>
                                        <div className="flex gap-2">
                                            <Shield className="w-5 h-5 text-[#e2ab49]" />
                                            <Building2 className="w-5 h-5 text-[#e2ab49]" />
                                        </div>
                                    </div>
                                    <p className="text-gray-400 font-sans text-base uppercase tracking-[0.2em] font-bold border-l-2 border-white/20 pl-4 py-1 leading-relaxed">
                                        Engineered for Government, Industrial, and Enterprise Portfolios. <br/>
                                        <span className="text-[var(--rhive-pink)] italic">*Includes Specialized Divisions for Residential Flat-Roof Architecture.*</span>
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    {/* Primary Manufacture Warranty */}
                                    <div className="flex items-start gap-4 p-4 bg-white/5 border border-white/5 hover:border-[#e2ab49]/50 transition-colors">
                                        <div className="p-3 bg-[#e2ab49]/10 border border-[#e2ab49]/30">
                                            <ShieldCheck className="w-6 h-6 text-[#e2ab49]" />
                                        </div>
                                        <div className="flex-1">
                                            <span className="text-[#e2ab49] font-black text-base uppercase block tracking-widest mb-1">GAF MASTER SELECT™ STATUS</span>
                                            <span className="text-white font-black text-base uppercase block tracking-wider mb-2">DIAMOND PLEDGE™ NDL GUARANTEE</span>
                                            <p className="text-gray-500 text-base uppercase font-bold leading-tight tracking-widest">
                                                Absolute coverage with <span className="text-white">NO DOLLAR LIMIT</span> on structural repairs. Guaranteed by the largest single-ply manufacturer in North America.
                                                <span className="block mt-2 text-base italic text-[#e2ab49]/80">*Requires verified independent engineering inspection at project completion.*</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* ENTERPRISE TARGET / DUAL MATH */}
                                <div className="mt-2 border-t border-white/10 pt-4">
                                    <div className="flex items-center gap-2 text-base text-[var(--rhive-pink)] font-mono uppercase tracking-[0.3em] mb-4">
                                        <Activity className="w-3 h-3" /> The CapEx Diagnostic Advantage
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-white/5 p-4 border-l border-gray-600">
                                            <div className="text-base text-gray-500 uppercase tracking-widest font-bold mb-1">Standard Market Protocol</div>
                                            <div className="text-base text-white font-black uppercase mb-1">Lump Sum Bidding</div>
                                            <div className="text-base text-gray-400 mt-1 uppercase italic tracking-wider leading-relaxed">Hidden "Insurance-Adjusted" Markups & Scope Ambiguity</div>
                                        </div>
                                        <div className="bg-[var(--rhive-pink)]/10 p-4 border-l-2 border-[var(--rhive-pink)]">
                                            <div className="text-base text-[var(--rhive-pink)] uppercase tracking-widest font-bold mb-1">RHIVE Enterprise Execution</div>
                                            <div className="text-base text-white font-black uppercase whitespace-nowrap mb-1">Dual-Math Radical Transparency</div>
                                            <div className="text-base text-gray-300 mt-1 uppercase italic tracking-wider leading-relaxed">Direct Hard Costs + Fixed Orchestration Fee. Zero Speculative Margin.</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default InteractiveGAFCommercial;
