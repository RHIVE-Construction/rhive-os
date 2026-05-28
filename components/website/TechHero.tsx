import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, Shield, ArrowRight } from 'lucide-react';
import { cn } from '../../lib/utils';
import PlexusShape from '../PlexusShape';
import AddressScanInput from '../AddressScanInput';

// --- GlitchText Sub-component for TechHero ---
const GlitchText = ({ text, className }: { text: string, className?: string }) => {
    return (
        <div className={cn("relative inline-block select-none", className)}>
            {/* Base layer - always visible and legible */}
            <span className="relative z-10 block">{text}</span>

            {/* Magenta Glitch Layer (Rhive Pink) */}
            <motion.span
                className="absolute inset-0 z-20 text-[#ec028b] mix-blend-screen pointer-events-none select-none"
                initial={{ opacity: 0 }}
                animate={{
                    opacity: [0, 0.8, 0, 0.5, 0],
                    x: [0, -3, 2, -2, 0],
                    y: [0, 1, -1, 1, 0],
                    clipPath: [
                        'inset(20% 0 50% 0)',
                        'inset(10% 0 80% 0)',
                        'inset(40% 0 10% 0)',
                        'inset(70% 0 30% 0)',
                        'inset(20% 0 50% 0)',
                    ]
                }}
                transition={{
                    duration: 0.2,
                    repeat: Infinity,
                    repeatDelay: Math.random() * 1.5 + 0.5,
                    ease: "easeInOut"
                }}
            >
                {text}
            </motion.span>

            {/* Cyan Glitch Layer */}
            <motion.span
                className="absolute inset-0 z-20 text-[#00ffff] mix-blend-screen pointer-events-none select-none"
                initial={{ opacity: 0 }}
                animate={{
                    opacity: [0, 0.7, 0, 0.4, 0],
                    x: [0, 3, -2, 2, 0],
                    y: [0, -1, 1, -1, 0],
                    clipPath: [
                        'inset(50% 0 20% 0)',
                        'inset(80% 0 10% 0)',
                        'inset(10% 0 40% 0)',
                        'inset(30% 0 70% 0)',
                        'inset(50% 0 20% 0)',
                    ]
                }}
                transition={{
                    duration: 0.25,
                    repeat: Infinity,
                    repeatDelay: Math.random() * 1.5 + 0.5,
                    ease: "easeInOut"
                }}
            >
                {text}
            </motion.span>
        </div>
    );
};

const TechHero: React.FC = () => {
    return (
        <section className="relative min-h-[90vh] flex items-center justify-center pt-32 pb-24 overflow-hidden snap-start select-none">
            
            {/* 1. Video Background Layer (Bottom) */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover scale-100 filter brightness-[0.4]"
                >
                    <source src="/vidupload/TRADESHOW MARKETING VIDEO.mp4" type="video/mp4" />
                </video>
            </div>

            {/* 2. 85% Transparent Void Overlay for Technical Contrast */}
            <div className="absolute inset-0 bg-black/80 pointer-events-none z-10" />

            {/* 3. Interactive Plexus Background Layer */}
            <div className="absolute inset-0 opacity-40 pointer-events-auto z-20">
                <PlexusShape
                    backgroundColor="transparent"
                    dotColor="#ec028b"
                    lineColor="236, 2, 139"
                    density={80}
                />
            </div>

            {/* 4. Content Chassis */}
            <div className="container mx-auto px-6 relative z-30 text-center flex flex-col items-center mt-6">
                
                {/* Visual Technical Frame Header */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="inline-flex items-center gap-3 px-6 py-2 border border-rhive-pink/30 rounded-sm bg-rhive-pink/5 mb-8 shadow-[0_0_15px_rgba(236,2,139,0.15)]"
                >
                    <div className="h-2 w-2 bg-rhive-pink rounded-full animate-ping" />
                    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white">
                        System Online // Quantum Operational Interface
                    </span>
                </motion.div>

                {/* Main Glitch Header */}
                <motion.h1
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="font-sans text-6xl md:text-8xl lg:text-9xl font-black uppercase leading-[0.85] mb-8 tracking-tighter text-white drop-shadow-2xl"
                >
                    <GlitchText text="Finish On Top." />
                </motion.h1>

                {/* Subtitle / Description */}
                <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="font-sans text-md md:text-lg text-gray-300 max-w-2xl mx-auto mb-12 leading-relaxed tracking-wide font-medium"
                >
                    Experience Utah's first AI-enabled operating system for high-performance construction. 
                    Residential steep-slope shingles or commercial molecular heat-welded flat membranes, deployed with 
                    <span className="text-white font-bold"> military precision</span> and <span className="text-rhive-pink font-bold">radical transparency.</span>
                </motion.p>

                {/* Animated Address Input with Precision Indicator */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="w-full max-w-4xl relative mt-4"
                >
                    {/* Hand-drawn styled indicator overlay pointing to the scanner */}
                    <div className="absolute right-full mr-[-100px] top-[-100px] z-50 pointer-events-none hidden xl:flex flex-col items-end gap-1">
                        <div 
                            style={{ fontFamily: "'EB Garamond', serif" }} 
                            className="text-rhive-pink text-2xl -rotate-6 drop-shadow-[0_0_8px_rgba(236,2,139,0.6)] font-bold italic"
                        >
                            Got a project? <br /> Scan here!
                        </div>
                        <svg width="180" height="90" viewBox="0 0 180 90" fill="none" className="mr-6 overflow-visible">
                            <path
                                d="M10 10 Q 110 5 158 50"
                                stroke="#ec028b"
                                strokeWidth="2"
                                strokeLinecap="round"
                                fill="none"
                                className="drop-shadow-[0_0_5px_rgba(236,2,139,0.8)] opacity-80"
                            />
                            <path
                                d="M136 42 L158 50 L146 28"
                                stroke="#ec028b"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                fill="none"
                                className="drop-shadow-[0_0_5px_rgba(236,2,139,0.8)] opacity-80"
                            />
                        </svg>
                    </div>

                    <AddressScanInput id="hero-address-scanner" />
                </motion.div>
            </div>

            {/* Bottom gradient mask for smooth section transition */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black to-transparent z-20 pointer-events-none" />
        </section>
    );
};

export default TechHero;
