import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import PlexusShape from '../PlexusShape';

interface RhiveGenericSectionProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
    subtitle?: string;
    glowColor?: 'pink' | 'blue' | 'gold';
    withPlexus?: boolean;
    chamferSize?: number; // Chamfer size in pixels
}

const RhiveGenericSection: React.FC<RhiveGenericSectionProps> = ({
    children,
    className = '',
    title,
    subtitle,
    glowColor = 'pink',
    withPlexus = true,
    chamferSize = 24
}) => {
    // Mapping of glow colors to tailwind and raw hex/rgb values
    const colorMap = {
        pink: {
            border: '#ec028b',
            accent: 'border-rhive-pink/30',
            bgGlow: 'bg-rhive-pink/5',
            text: 'text-rhive-pink',
            glowShadow: 'drop-shadow-[0_0_8px_rgba(236,2,139,0.8)]',
            dot: '#ec028b',
            line: '236, 2, 139'
        },
        blue: {
            border: '#08137C',
            accent: 'border-rhive-blue/30',
            bgGlow: 'bg-rhive-blue/5',
            text: 'text-rhive-blue',
            glowShadow: 'drop-shadow-[0_0_8px_rgba(8,19,124,0.8)]',
            dot: '#08137C',
            line: '8, 19, 124'
        },
        gold: {
            border: '#e2ab49',
            accent: 'border-rhive-gold/30',
            bgGlow: 'bg-rhive-gold/5',
            text: 'text-rhive-gold',
            glowShadow: 'drop-shadow-[0_0_8px_rgba(226,171,73,0.8)]',
            dot: '#e2ab49',
            line: '226, 171, 73'
        }
    };

    const currentColors = colorMap[glowColor];
    const cSize = `${chamferSize}px`;

    // CLIP PATH for the background container to match chamfered edges
    const clipPathValue = `polygon(
        ${cSize} 0,
        100% 0,
        100% calc(100% - ${cSize}),
        calc(100% - ${cSize}) 100%,
        0 100%,
        0 ${cSize}
    )`;

    return (
        <section className={cn("relative py-24 px-6 md:px-12 w-full select-none", className)}>
            {/* Outer Wrapper with Chamfers */}
            <div className="relative max-w-7xl mx-auto w-full min-h-[400px] flex flex-col group isolate">
                
                {/* 1. Main Background Layer (Clipped) */}
                <div
                    className="absolute inset-0 bg-black/90 backdrop-blur-xl transition-colors duration-300 z-0"
                    style={{ clipPath: clipPathValue }}
                />

                {/* 2. Interactive Plexus Background Grid (Faint) */}
                {withPlexus && (
                    <div 
                        className="absolute inset-[1px] z-0 overflow-hidden pointer-events-none opacity-40 group-hover:opacity-75 transition-opacity duration-700"
                        style={{ clipPath: clipPathValue }}
                    >
                        <PlexusShape
                            backgroundColor="transparent"
                            dotColor={currentColors.dot}
                            lineColor={currentColors.line}
                            density={20}
                            className="h-full w-full relative z-0"
                        />
                        {/* High density black gradient for premium transparency depth */}
                        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/80 z-10" />
                    </div>
                )}

                {/* 3. Outer Edge Borders (Meticulously crafted SVG alignment) */}
                {/* Top Border (Gray) */}
                <div className="absolute left-[24px] right-0 top-0 h-[1px] bg-gray-800 z-20" />
                {/* Bottom Border (Gray) */}
                <div className="absolute left-0 right-[24px] bottom-0 h-[1px] bg-gray-800 z-20" />
                {/* Left Border (Gray) */}
                <div className="absolute left-0 top-[24px] bottom-0 w-[1px] bg-gray-800 z-20" />
                {/* Right Border (Gray) */}
                <div className="absolute right-0 top-0 bottom-[24px] w-[1px] bg-gray-800 z-20" />

                {/* Top-Left Chamfer (Gray base + Neon accent segment) */}
                <svg className="absolute top-0 left-0 w-6 h-6 z-20 overflow-visible pointer-events-none">
                    <line x1="0" y1="24" x2="24" y2="0" stroke="#1f2937" strokeWidth="1" strokeLinecap="square" />
                    <line x1="8" y1="16" x2="16" y2="8" stroke={currentColors.border} strokeWidth="2" strokeLinecap="square" className={currentColors.glowShadow} />
                </svg>

                {/* Bottom-Right Chamfer (Gray base + Neon accent segment) */}
                <svg className="absolute bottom-0 right-0 w-6 h-6 z-20 overflow-visible pointer-events-none">
                    <line x1="0" y1="24" x2="24" y2="0" stroke="#1f2937" strokeWidth="1" strokeLinecap="square" />
                    <line x1="8" y1="16" x2="16" y2="8" stroke={currentColors.border} strokeWidth="2" strokeLinecap="square" className={currentColors.glowShadow} />
                </svg>

                {/* Custom Corner Tech Indicators */}
                <div className="absolute top-8 right-8 text-[9px] font-mono opacity-30 select-none text-right hidden sm:block">
                    <span className="block">SYS.STATUS: ACTIVE</span>
                    <span className="block font-bold">INTEGRITY_VERIFIED_0x7C</span>
                </div>

                <div className="absolute bottom-8 left-8 text-[9px] font-mono opacity-30 select-none hidden sm:block">
                    <span className="block">RHIVE_QOS // V3.0</span>
                    <span className="block uppercase tracking-[0.2em]">{glowColor}_GRID_INTEGRITY</span>
                </div>

                {/* 4. Section Content */}
                <div className="relative z-30 p-8 md:p-16 flex flex-col h-full text-white">
                    {/* Header */}
                    {(title || subtitle) && (
                        <div className="mb-12 text-left border-b border-white/10 pb-6 relative">
                            {title && (
                                <motion.h2 
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6 }}
                                    className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white mb-2"
                                >
                                    {title}
                                </motion.h2>
                            )}
                            {subtitle && (
                                <motion.p 
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.1 }}
                                    className={cn("text-xs font-black tracking-[0.4em] uppercase", currentColors.text)}
                                >
                                    {subtitle}
                                </motion.p>
                            )}
                            {/* Decorative line accent */}
                            <div className={cn("absolute bottom-0 left-0 w-24 h-[2px]", currentColors.bgGlow, "bg-current")} style={{ backgroundColor: currentColors.border }} />
                        </div>
                    )}

                    {/* Children Block */}
                    <div className="flex-grow">
                        {children}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default RhiveGenericSection;
