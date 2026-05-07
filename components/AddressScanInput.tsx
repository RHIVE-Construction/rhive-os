import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap } from './icons';

export const AddressScanInput = ({ id }: { id?: string }) => {
    const chamferSize = "16px";
    const clipPathValue = `polygon(
        ${chamferSize} 0,
        100% 0,
        100% calc(100% - ${chamferSize}),
        calc(100% - ${chamferSize}) 100%,
        0 100%,
        0 ${chamferSize}
    )`;

    const fullText = "ENTER PROJECT ADDRESS";
    const [placeholder, setPlaceholder] = useState("");
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (index < fullText.length) {
            const timeout = setTimeout(() => {
                setPlaceholder(prev => prev + fullText[index]);
                setIndex(index + 1);
            }, 50);
            return () => clearTimeout(timeout);
        } else {
            const resetTimeout = setTimeout(() => {
                setPlaceholder("");
                setIndex(0);
            }, 5000);
            return () => clearTimeout(resetTimeout);
        }
    }, [index]);

    return (
        <div id={id} className="relative flex w-full max-w-2xl mx-auto h-16 group mt-8 scroll-mt-40 isolate">
            {/* 1. Background Layer (Clipped) */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-xl z-0"
                style={{ clipPath: clipPathValue }}
            />

            {/* 2. CIRCUITRY BORDERS (Consistent with Design System) */}
            {/* Left Border (Gray) + Animated Pixel */}
            <div className="absolute left-0 top-4 bottom-0 w-[1px] bg-gray-700 z-10 overflow-hidden">
                <motion.div
                    className="absolute left-0 w-[2px] h-4 bg-rhive-pink shadow-[0_0_10px_rgba(236,2,139,1)]"
                    animate={{ top: ["-20%", "120%"] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />
            </div>
            {/* Top-Left Chamfer (Gray Base) */}
            <svg className="absolute top-0 left-0 w-4 h-4 z-10 overflow-visible pointer-events-none">
                <line x1="0" y1="16" x2="16" y2="0" stroke="#374151" strokeWidth="1" strokeLinecap="square" />
            </svg>
            {/* TL Chamfer Accent (Pink) */}
            <svg className="absolute top-0 left-0 w-4 h-4 z-20 overflow-visible pointer-events-none">
                <line x1="6" y1="10" x2="10" y2="6" stroke="#ec028b" strokeWidth="2" strokeLinecap="square" className="drop-shadow-[0_0_3px_rgba(236,2,139,0.8)]" />
            </svg>

            {/* Right Border (Gray) + Animated Pixel */}
            <div className="absolute right-0 top-0 bottom-4 w-[1px] bg-gray-700 z-10 overflow-hidden">
                <motion.div
                    className="absolute right-0 w-[2px] h-4 bg-[#22d3ee] shadow-[0_0_10px_rgba(34,211,238,1)]"
                    animate={{ top: ["120%", "-20%"] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: "linear", delay: 0.5 }}
                />
            </div>
            {/* Top Border (Gray) */}
            <div className="absolute left-4 right-0 top-0 h-[1px] bg-gray-700 z-10" />
            {/* Bottom Border (Gray) */}
            <div className="absolute left-0 right-4 bottom-0 h-[1px] bg-gray-700 z-10" />
            {/* Bottom-Right Chamfer (Gray Base) */}
            <svg className="absolute bottom-0 right-0 w-4 h-4 z-10 overflow-visible pointer-events-none">
                <line x1="0" y1="16" x2="16" y2="0" stroke="#374151" strokeWidth="1" strokeLinecap="square" />
            </svg>
            {/* BR Chamfer Accent (Pink) */}
            <svg className="absolute bottom-0 right-0 w-4 h-4 z-20 overflow-visible pointer-events-none">
                <line x1="6" y1="10" x2="10" y2="6" stroke="#ec028b" strokeWidth="2" strokeLinecap="square" className="drop-shadow-[0_0_3px_rgba(236,2,139,0.8)]" />
            </svg>
            {/* Pink Highlight Pulse (Top edge) */}
            <div className="absolute top-0 left-12 right-12 h-[1px] bg-gradient-to-r from-transparent via-rhive-pink/40 to-transparent z-20" />

            <div className="relative flex-grow flex items-center px-6 md:px-8 z-20">
                {/* Colorful Google Maps Pin with Pink Square Dot */}
                <svg viewBox="0 0 24 24" className="w-7 h-7 mr-4 shrink-0 transition-transform group-hover:scale-110 duration-500" xmlns="http://www.w3.org/2000/svg">
                    <path fill="#4285F4" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                    <path fill="#34A853" d="M12 2C8.13 2 5 5.13 5 9c0 1.15.22 2.21.6 3.19l3.41-3.41C9.07 8.56 9 8.29 9 8c0-1.66 1.34-3 3-3 .29 0 .56.07.78.19l3.41-3.41C14.21 2.22 13.15 2 12 2z" />
                    <path fill="#FBBC05" d="M16.19 5.6C15.21 5.22 14.15 5 13 5c-1.66 0-3 1.34-3 3 0 1.15.47 2.21 1.19 3l3.41-3.41C14.78 7.37 15 7.7 15 8c0 .29-.07.56-.19.78l3.41-3.41C17.78 6.21 18 7.15 18 8.13c0 2.22-1.21 4.39-3 6.3l3.19 3.19C20.5 14.89 22 11.83 22 9c0-3.87-3.13-7-7-7-1.15 0-2.21.22-3.19.6l3.19 3.19c.19.04.37.11.53.21l1.661-1.4z" />
                    <rect x="10.5" y="7.5" width="3" height="3" fill="#ec028b" rx="0.5" className="animate-pulse" />
                </svg>
                <input
                    type="text"
                    placeholder={placeholder}
                    className="bg-transparent text-white w-full h-full outline-none placeholder-rhive-pink/60 font-black uppercase text-[12px] md:text-[14px] tracking-[0.2em] text-left"
                />
            </div>

            {/* Premium Button Section */}
            <button
                onClick={() => window.dispatchEvent(new CustomEvent('open-estimator', { detail: { protocol: 'PUBLIC SCAN' } }))}
                className="relative h-full px-8 md:px-12 flex items-center justify-center gap-2 bg-rhive-pink text-white font-black uppercase text-[13px] tracking-widest overflow-hidden group/btn hover:scale-[1.02] active:scale-95 transition-all duration-300 shadow-[0_0_20px_rgba(236,2,139,0.4)] shrink-0 z-20"
                style={{
                    clipPath: `polygon(0 0, 100% 0, 100% calc(100% - ${chamferSize}), calc(100% - ${chamferSize}) 100%, 0 100%)`
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                <Zap size={18} fill="currentColor" className="text-white" />
                <span className="relative z-10">Scan My Roof</span>
            </button>
        </div>
    );
};

export default AddressScanInput;
