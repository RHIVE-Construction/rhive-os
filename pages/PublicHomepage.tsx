import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import {
    UserIcon,
    Building2,
    Zap,
    Globe,
    Gauge,
    Plus,
    Minus,
    Sun,
    Moon,
    Shield,
    Droplets,
    ArrowRight,
    CheckCircle2,
    ChevronRight,
    X,
    Award,
    Compass,
    ShieldAlert,
    UploadCloud,
    Star
} from 'lucide-react';
import { useNavigation } from '../contexts/NavigationContext';
import { useTheme } from '../contexts/ThemeContext';
import PlexusShape from '../components/PlexusShape';
import { cn } from '../lib/utils';
import RhiveHeader from '../components/website/RhiveHeader';
import Card from '../components/Card';

// --- Visual Helpers ---

const ScrollProgress = () => {
    const [scrolled, setScrolled] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            const currentPosition = window.scrollY;
            setScrolled((currentPosition / totalHeight) * 100);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="progress-container">
            <div className="progress-bar" style={{ width: `${scrolled}%` }} />
        </div>
    );
};

const GlitchText = ({ text, className }: { text: string, className?: string }) => {
    return (
        <div className={cn("relative inline-block", className)}>
            {/* Base layer - always visible and legible */}
            <span className="relative z-10 block">{text}</span>

            {/* Magenta Glitch Layer (Rhive Pink) */}
            <motion.span
                className="absolute inset-0 z-20 text-[#ec028b] mix-blend-screen pointer-events-none select-none"
                initial={{ opacity: 0 }}
                animate={{
                    opacity: [0, 0.8, 0, 0.5, 0],
                    x: [0, -4, 3, -2, 0],
                    y: [0, 1, -1, 2, 0],
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
                    repeatDelay: Math.random() * 1 + 0.5,
                    ease: "easeInOut"
                }}
            >
                {text}
            </motion.span>

            {/* Cyan Glitch Layer */}
            <motion.span
                className="absolute inset-0 z-20 bg-gradient-to-t from-rhive-blue to-white bg-clip-text text-transparent mix-blend-screen pointer-events-none select-none"
                initial={{ opacity: 0 }}
                animate={{
                    opacity: [0, 0.7, 0, 0.4, 0],
                    x: [0, 4, -3, 2, 0],
                    y: [0, -1, 1, -2, 0],
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
                    repeatDelay: Math.random() * 1 + 0.5,
                    ease: "easeInOut"
                }}
            >
                {text}
            </motion.span>
        </div>
    );
};

const FloatingCommandCenter = () => (
    <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="fixed right-0 top-1/2 -translate-y-1/2 z-[100] group flex items-center transition-all"
    >
        <div className="flex flex-col gap-3 mr-4">

            <motion.button
                whileHover={{ x: -10, scale: 1.05 }}
                className="bg-black/80 backdrop-blur-xl border border-rhive-pink/50 py-4 px-8 shadow-[0_0_30px_rgba(236,2,139,0.3)] flex items-center justify-between min-w-[240px] group/btn overflow-hidden relative"
                style={{
                    clipPath: 'polygon(12px 0, 100% 0, 100% 100%, 12px 100%, 0 calc(100% - 12px), 0 12px)'
                }}
            >
                <div className="absolute inset-0 bg-rhive-pink/10 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                <div className="flex items-center gap-3">
                    <Zap size={18} className="text-rhive-pink" fill="currentColor" />
                    <span className="text-[11px] font-black uppercase tracking-widest text-white">Instant Estimate</span>
                </div>
                <ArrowRight size={14} className="text-rhive-pink opacity-0 group-hover/btn:opacity-100 -translate-x-2 group-hover/btn:translate-x-0 transition-all" />
            </motion.button>

            <motion.button
                whileHover={{ x: -10, scale: 1.05 }}
                className="bg-rhive-blue/80 backdrop-blur-xl border border-rhive-blue/50 py-4 px-8 shadow-[0_0_30px_rgba(8,19,124,0.3)] flex items-center justify-between min-w-[240px] group/btn overflow-hidden relative"
                style={{
                    clipPath: 'polygon(12px 0, 100% 0, 100% 100%, 12px 100%, 0 calc(100% - 12px), 0 12px)'
                }}
            >
                <div className="absolute inset-0 bg-rhive-blue/10 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                <div className="flex items-center gap-3">
                    <CheckCircle2 size={18} className="text-white" />
                    <span className="text-[11px] font-black uppercase tracking-widest text-white">Certified Quote</span>
                </div>
                <ArrowRight size={14} className="text-white opacity-0 group-hover/btn:opacity-100 -translate-x-2 group-hover/btn:translate-x-0 transition-all" />
            </motion.button>
        </div>

        <div className="h-40 w-[2px] bg-gradient-to-b from-transparent via-rhive-pink to-transparent opacity-50 mr-2" />
    </motion.div>
);

// --- Sub-Components ---

import { gsap } from 'gsap';

const EmergencyBanner = () => {
    return (
        <div className="relative z-20 min-w-[210px] max-w-[270px]">
            <style>{`
                @keyframes melt-drip-1 {
                    0% { transform: translateY(0) scaleY(1); opacity: 0; }
                    25% { transform: translateY(0) scaleY(1.6); opacity: 0.8; }
                    55% { transform: translateY(35px) scaleY(0.9); opacity: 1; }
                    100% { transform: translateY(90px) scale(0.2); opacity: 0; }
                }
                @keyframes melt-drip-2 {
                    0% { transform: translateY(0) scaleY(1); opacity: 0; }
                    35% { transform: translateY(0) scaleY(1.4); opacity: 0.8; }
                    65% { transform: translateY(40px) scaleY(0.9); opacity: 1; }
                    100% { transform: translateY(110px) scale(0.2); opacity: 0; }
                }
                @keyframes melt-drip-3 {
                    0% { transform: translateY(0) scaleY(1); opacity: 0; }
                    15% { transform: translateY(0) scaleY(1.5); opacity: 0.8; }
                    45% { transform: translateY(28px) scaleY(0.9); opacity: 1; }
                    100% { transform: translateY(80px) scale(0.2); opacity: 0; }
                }
                .melt-droplet-1 { animation: melt-drip-1 3.2s infinite linear; }
                .melt-droplet-2 { animation: melt-drip-2 3.8s infinite linear; animation-delay: 1.1s; }
                .melt-droplet-3 { animation: melt-drip-3 2.9s infinite linear; animation-delay: 2s; }
            `}</style>
            
            <motion.button
                whileHover={{ x: -10, scale: 1.05 }}
                onClick={() => window.dispatchEvent(new CustomEvent('open-estimator', { detail: { protocol: 'EMERGENCY BREACH' } }))}
                className="relative py-4 px-6 flex items-center justify-between w-full group/btn overflow-visible text-white select-none bg-transparent border-none outline-none"
            >
                {/* Custom Melting Liquid SVG Background */}
                <div className="absolute inset-0 z-0 pointer-events-none w-full h-full">
                    <svg 
                        viewBox="0 0 250 56" 
                        preserveAspectRatio="none" 
                        className="w-full h-full text-red-600/90 fill-current drop-shadow-[0_0_20px_rgba(220,38,38,0.6)]"
                    >
                        <path d="M 12 0 H 238 Q 250 0, 250 12 V 36 C 230 45, 210 32, 195 46 C 185 36, 170 38, 160 48 C 145 34, 130 36, 115 50 C 95 35, 80 44, 70 38 C 55 46, 35 34, 20 44 L 0 36 V 12 Q 0 0, 12 0 Z" />
                    </svg>
                </div>

                {/* SVG Droplets that physically fall downward */}
                <svg className="absolute left-[115px] bottom-[-2px] w-3 h-4 overflow-visible pointer-events-none z-10">
                    <path d="M6,0 C3.6,1.8 1.2,3.3 1.2,4.8 A2.4,2.4 0 0,0 10.8,4.8 C10.8,3.3 8.4,1.8 6,0 Z" className="fill-red-500/95 melt-droplet-1" />
                </svg>
                <svg className="absolute left-[160px] bottom-[-2px] w-3 h-4 overflow-visible pointer-events-none z-10">
                    <path d="M6,0 C3.6,1.8 1.2,3.3 1.2,4.8 A2.4,2.4 0 0,0 10.8,4.8 C10.8,3.3 8.4,1.8 6,0 Z" className="fill-red-500/95 melt-droplet-2" />
                </svg>
                <svg className="absolute left-[195px] bottom-[-2px] w-3 h-4 overflow-visible pointer-events-none z-10">
                    <path d="M6,0 C3.6,1.8 1.2,3.3 1.2,4.8 A2.4,2.4 0 0,0 10.8,4.8 C10.8,3.3 8.4,1.8 6,0 Z" className="fill-red-500/95 melt-droplet-3" />
                </svg>

                <div className="relative z-10 flex items-center gap-2">
                    <Zap size={16} className="text-white animate-pulse" fill="currentColor" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white">Active Leak</span>
                </div>
                <ArrowRight size={14} className="relative z-10 text-white opacity-0 group-hover/btn:opacity-100 -translate-x-2 group-hover/btn:translate-x-0 transition-all" />
            </motion.button>
        </div>
    );
};


const AddressScanInput = ({ 
    value, 
    onChange, 
    onScan, 
    id 
}: { 
    value: string; 
    onChange: (val: string) => void; 
    onScan: () => void; 
    id?: string; 
}) => {
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
    const [isFocused, setIsFocused] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

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

    const isGlowing = isFocused || isHovered;
    const glowStyle = isGlowing 
        ? { filter: `drop-shadow(0 0 ${isFocused ? '16px' : '10px'} rgba(236, 2, 139, 0.85))` } 
        : { filter: 'drop-shadow(0 0 4px rgba(236, 2, 139, 0.45))' };

    return (
        <div 
            id={id} 
            className={cn(
                "relative flex w-full max-w-2xl mx-auto h-16 group mt-8 scroll-mt-40 transition-all duration-300 isolate",
                isFocused ? "scale-[1.01]" : "hover:scale-[1.005] input-breathe"
            )}
            style={{
                ...glowStyle,
                transition: 'filter 0.3s ease, transform 0.3s ease'
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <style>{`
                @keyframes breathe-glow {
                    0%, 100% { filter: drop-shadow(0 0 4px rgba(236, 2, 139, 0.4)); }
                    50% { filter: drop-shadow(0 0 10px rgba(236, 2, 139, 0.75)); }
                }
                .input-breathe {
                    animation: breathe-glow 3s infinite ease-in-out;
                }
            `}</style>

            {/* 1. Background Layer (Clipped) */}
            <div
                className="absolute inset-0 bg-black/85 backdrop-blur-xl z-0"
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
                {/* Colorful Google Maps Pin Icon */}
                <svg viewBox="0 0 24 24" className="w-7 h-7 mr-4 shrink-0 transition-transform group-hover:scale-110 duration-500" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C8.69 2 6 4.69 6 8C6 9.66 6.67 11.16 7.75 12.25L12 16.5L16.25 12.25C17.33 11.16 18 9.66 18 8C18 4.69 15.31 2 12 2Z" fill="#EA4335" />
                    <path d="M12 16.5L7.75 12.25C6.67 11.16 6 9.66 6 8C6 7.68 6.03 7.37 6.08 7.07L12 16.5Z" fill="#34A853" />
                    <path d="M12 2C13.25 2 14.41 2.38 15.38 3.03L12 7.5L8.62 3.03C9.59 2.38 10.75 2 12 2Z" fill="#F9BC05" />
                    <path d="M12 16.5L16.25 12.25C17.33 11.16 18 9.66 18 8C18 7.68 17.97 7.37 17.92 7.07L12 16.5Z" fill="#4285F4" />
                    <circle cx="12" cy="8" r="2.5" fill="#FFFFFF" />
                    <circle cx="12" cy="8" r="1.2" fill="#4285F4" />
                </svg>
                <input
                    type="text"
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className="bg-transparent text-white w-full h-full outline-none placeholder-rhive-pink/60 font-black uppercase text-[12px] md:text-[14px] tracking-[0.2em] text-left animate-pulse-subtle"
                />
            </div>

            {/* Premium Button Section */}
            <button
                onClick={onScan}
                className="relative h-full px-8 md:px-12 flex items-center justify-center gap-2 bg-rhive-pink/20 hover:bg-rhive-pink/40 border border-rhive-pink/40 hover:border-rhive-pink/60 backdrop-blur-md text-white font-black uppercase text-[13px] tracking-widest overflow-hidden group/btn hover:scale-[1.02] active:scale-95 transition-all duration-300 shadow-[0_0_20px_rgba(236,2,139,0.2)] shrink-0 z-20"
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

const FounderCard = ({ name, role, bio, image, colorClass = "rhive-pink" }: any) => (
    <Card className="flex flex-col md:flex-row items-center gap-8 group overflow-hidden relative isolate">
        <div className={cn(
            "w-32 h-32 rounded-full overflow-hidden relative shrink-0 border-2 shadow-2xl transition-transform duration-700 group-hover:scale-105",
            colorClass === "rhive-pink" ? "border-rhive-pink" : "border-rhive-blue"
        )}>
            <img
                src={image}
                alt={name}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
            />
        </div>
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h3 className={cn(
                "font-display text-2xl font-bold uppercase text-[var(--rhive-text)] mb-1 transition-colors",
                colorClass === "rhive-pink" ? "group-hover:text-rhive-pink" : "group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-t group-hover:from-rhive-blue group-hover:to-white"
            )}>{name}</h3>
            <p className="text-rhive-gold text-sm font-bold tracking-widest uppercase mb-4">{role}</p>
            <p className="text-[var(--rhive-text-muted)] text-sm leading-relaxed max-w-md font-serif italic">
                {bio}
            </p>
        </div>
    </Card>
);

const FinishOnTopTitle: React.FC = () => {
    const textRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!textRef.current) return;
        const chars = textRef.current.querySelectorAll('.char');
        gsap.fromTo(chars, 
            { opacity: 0, y: 40, rotateX: -30 },
            { 
                opacity: 1, 
                y: 0, 
                rotateX: 0,
                duration: 0.8, 
                stagger: 0.05, 
                ease: 'power4.out',
                onComplete: () => {
                    gsap.to(textRef.current, {
                        textShadow: '2px 2px 0px rgba(236,2,139,0.5), -2px -2px 0px rgba(8,19,124,0.5)',
                        duration: 0.5,
                        ease: 'power2.out'
                    });
                }
            }
        );
    }, []);

    const text = "FINISH ON TOP";
    const words = text.split(" ");

    return (
        <div ref={textRef} className="flex flex-wrap items-center justify-center gap-x-6 select-none perspective-[1000px] overflow-hidden py-2">
            {words.map((word, wordIdx) => (
                <span key={wordIdx} className="char-word inline-block whitespace-nowrap">
                    {word.split("").map((char, charIdx) => (
                        <span 
                            key={charIdx} 
                            className="char inline-block font-display text-5xl sm:text-7xl md:text-9xl font-black uppercase leading-[0.85] text-white tracking-tighter"
                            style={{ opacity: 0, transformOrigin: 'bottom center' }}
                        >
                            {char}
                        </span>
                    ))}
                </span>
            ))}
            <span 
                className="char inline-block ml-2"
                style={{ opacity: 0, transformOrigin: 'bottom center' }}
            >
                <svg
                    viewBox="0 0 24 24"
                    className="w-12 h-12 sm:w-16 sm:h-16 md:w-24 md:h-24 text-rhive-pink drop-shadow-[0_0_12px_rgba(236,2,139,0.85)]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M2 17L12 7L22 17" />
                </svg>
            </span>
        </div>
    );
};

const FoundersCardLightbox = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[11000] flex items-center justify-center p-4">
            <motion.div 
                className="absolute inset-0 bg-black/85 backdrop-blur-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={onClose}
            />
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="relative max-w-2xl w-full bg-black/95 border border-rhive-pink/40 p-8 text-white z-10 overflow-hidden flex flex-col"
                style={{
                    clipPath: 'polygon(24px 0, 100% 0, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0 100%, 0 24px)'
                }}
            >
                <div className="absolute inset-0 z-0 pointer-events-none opacity-30">
                    <PlexusShape
                        backgroundColor="transparent"
                        dotColor="#ec028b"
                        lineColor="236, 2, 139"
                        density={30}
                        className="w-full h-full"
                    />
                </div>

                <div className="relative z-10">
                    <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                        <div className="flex items-center gap-3">
                            <div className="text-rhive-pink p-2 bg-rhive-pink/10 rounded-sm border border-rhive-pink/20">
                                <Award size={18} />
                            </div>
                            <div>
                                <h3 className="text-lg font-black tracking-widest uppercase italic">RHIVE Construction LLC</h3>
                                <p className="text-[8px] font-mono text-gray-500 uppercase tracking-[0.2em]">P-02 VERIFIED LEADERSHIP CREDENTIALS</p>
                            </div>
                        </div>
                        <button 
                            onClick={onClose}
                            className="p-1.5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                        >
                            <X size={16} />
                        </button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 text-left">
                        <div className="border border-white/10 p-5 bg-white/5 relative" style={{ clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)' }}>
                            <div className="w-20 h-20 rounded-full overflow-hidden border border-rhive-pink mb-4">
                                <img src="https://static.wixstatic.com/media/c5862a_591faf36d59c448e8c92b9caff471e96~mv2.png" alt="Kara Robinson" className="w-full h-full object-cover" />
                            </div>
                            <h4 className="text-md font-black uppercase text-white">Kara Robinson</h4>
                            <p className="text-rhive-pink text-[9px] font-black uppercase tracking-widest mb-3">PRESIDENT // FOUNDER</p>
                            <p className="text-[10px] text-gray-400 font-serif italic mb-4 leading-relaxed">
                                Empowering the community and elevating our customers. Kara drives operational systems precision, ensuring every contractor and representative works under the highest standards of safety, quality, and mutual trust.
                            </p>
                            <div className="text-[8px] font-mono text-gray-500 uppercase space-y-1">
                                <p>Email: Point of Contact via HQ</p>
                                <p>Phone: (435) 417-6637</p>
                                <p className="text-rhive-gold font-bold">WBE Women-Owned Certified</p>
                            </div>
                        </div>

                        <div className="border border-white/10 p-5 bg-white/5 relative" style={{ clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)' }}>
                            <div className="w-20 h-20 rounded-full overflow-hidden border border-rhive-pink mb-4">
                                <img src="https://static.wixstatic.com/media/c5862a_f1b8b6616fe44f739664188e00d416ce~mv2.png" alt="Michael Robinson" className="w-full h-full object-cover" />
                            </div>
                            <h4 className="text-md font-black uppercase text-white">Michael Robinson</h4>
                            <p className="text-rhive-pink text-[9px] font-black uppercase tracking-widest mb-3">CEO // STRATEGIC ARCHITECT</p>
                            <p className="text-[10px] text-gray-400 font-serif italic mb-4 leading-relaxed">
                                Bridging contractor excellence with customer transparency. Michael maps AI-driven operating systems to deliver direct, data-backed value to our representatives and local community projects.
                            </p>
                            <div className="text-[8px] font-mono text-gray-500 uppercase space-y-1">
                                <p>Email: michael@rhiveconstruction.com</p>
                                <p>Phone: 801-449-1451</p>
                                <p className="text-rhive-gold font-bold">Owens Corning Preferred Builder</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="mt-6 border-t border-white/10 pt-4 flex justify-between items-center text-[8px] font-mono text-gray-500 uppercase tracking-widest">
                        <span>RHIVE Construction LLC • SALT LAKE CLUSTER</span>
                        <span className="text-rhive-pink">VERIFIED STATUS: OK</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

const ProcessLightbox = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    const [bgColor, setBgColor] = useState('#000000');
    if (!isOpen) return null;
    const stages = [
        { stage: "STAGE 01", title: "DRONE SCAN", desc: "Digital intake & aerial assessment. We analyze your property's roof layout using high-resolution drone mapping before any work begins.", progress: "10%", check: "Drone flight scheduled" },
        { stage: "STAGE 02", title: "BALLPARK ESTIMATE", desc: "Instant visual estimate. Our technology uses spatial data to generate an initial price estimate for your project.", progress: "20%", check: "Ballpark pricing generated" },
        { stage: "STAGE 03", title: "CERTIFIED QUOTE", desc: "Certified fixed-price proposal. Our team reviews every detail to provide a guaranteed contract price valid for 14 days.", progress: "30%", check: "Fixed-price proposal finalized" },
        { stage: "STAGE 04", title: "SECURE SIGN-OFF", desc: "Digital contract agreement. Review and sign your project agreement online to activate your project portal.", progress: "40%", check: "Secure digital agreement activated" },
        { stage: "STAGE 05", title: "SCHEDULING", desc: "Permits & project timeline. We secure local permits and lock in your delivery and construction dates.", progress: "50%", check: "Project timeline confirmed" },
        { stage: "STAGE 06", title: "PRE-CONSTRUCTION", desc: "Site preparation checklist. We coordinate with you to ensure property safety and zero disruptions on build day.", progress: "60%", check: "Pre-construction check completed" },
        { stage: "STAGE 07", title: "INSTALLATION", desc: "The build phase. Real-time updates and photo progress sent directly to your homeowner portal as we work.", progress: "70%", check: "Live installation progress active" },
        { stage: "STAGE 08", title: "QUALITY AUDIT", desc: "Detailed quality inspection. A thorough physical audit of your completed roof to guarantee it meets our standards.", progress: "80%", check: "Quality inspection approved" },
        { stage: "STAGE 09", title: "FINAL REVIEW", desc: "Final walkthrough. Review of all work with you to ensure absolute satisfaction and sign off on completion.", progress: "90%", check: "Homeowner sign-off completed" },
        { stage: "STAGE 10", title: "WARRANTY HANDOVER", desc: "System handover. We deliver your Lifetime No-Leak Warranty certificate and your digital documentation archive.", progress: "100%", check: "Lifetime warranty issued" }
    ];

    return (
        <div className="fixed inset-0 z-[11000]">
            <motion.div 
                className="absolute inset-0 bg-black/85 backdrop-blur-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={onClose}
            />
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="fixed inset-[0.5in] border border-rhive-pink/40 p-8 text-white z-10 overflow-hidden flex flex-col"
                style={{
                    backgroundColor: bgColor,
                    clipPath: 'polygon(24px 0, 100% 0, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0 100%, 0 24px)'
                }}
            >
                <div className="relative z-10 flex flex-col h-full">
                    <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                        <div className="flex items-center gap-4 flex-wrap sm:flex-nowrap">
                            <div className="text-rhive-pink p-2 bg-rhive-pink/10 rounded-sm border border-rhive-pink/20">
                                <Compass size={18} />
                            </div>
                            <div>
                                <h3 className="text-lg font-black tracking-widest uppercase italic text-left">Zero Surprises Process</h3>
                                <p className="text-[8px] font-mono text-gray-500 uppercase tracking-[0.2em]">P-04 10-STAGE VERTICAL PERFORMANCE INTEGRITY</p>
                            </div>
                            <div className="flex items-center gap-1.5 ml-4 bg-black/40 p-1 border border-white/5 rounded">
                                {[
                                    { label: 'A', value: '#000000', title: 'Starship Black' },
                                    { label: 'B', value: '#0b0114', title: 'Nebula Purple' },
                                    { label: 'C', value: '#010a18', title: 'Starlink Blue' },
                                    { label: 'D', value: '#0d0f12', title: 'Orbit Gray' },
                                    { label: 'E', value: '#011215', title: 'Aurora Teal' }
                                ].map(token => (
                                    <button
                                        key={token.label}
                                        onClick={() => setBgColor(token.value)}
                                        title={token.title}
                                        type="button"
                                        className={cn(
                                            "w-6 h-6 border flex items-center justify-center text-[10px] font-mono font-black transition-all",
                                            bgColor === token.value 
                                                ? "border-rhive-pink bg-rhive-pink/20 text-white shadow-[0_0_8px_rgba(236,2,139,0.5)]" 
                                                : "border-white/10 bg-white/5 text-gray-400 hover:border-white/20 hover:text-white"
                                        )}
                                    >
                                        {token.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <button 
                            onClick={onClose}
                            className="p-1.5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                        >
                            <X size={16} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-6 pr-2 scrollbar-thin scrollbar-thumb-rhive-pink scrollbar-track-white/5">
                        <p className="text-xs text-gray-400 italic font-serif leading-relaxed text-left mb-4">
                            We follow a strict 10-stage process architecture to eliminate cost overruns, schedule slips, and structural failure risks. Here is your roadmap:
                        </p>

                        {stages.map((st, idx) => (
                            <div key={idx} className="flex gap-4 border-l border-white/15 pl-4 relative text-left">
                                <div className="absolute -left-[9px] top-1 w-4.5 h-4.5 bg-black border border-rhive-pink/60 rounded-full flex items-center justify-center">
                                    <div className="w-1.5 h-1.5 bg-rhive-pink rounded-full" />
                                </div>
                                <div className="space-y-1.5 w-full">
                                    <div className="flex justify-between items-baseline">
                                        <span className="text-[9px] font-mono text-rhive-pink font-black uppercase tracking-widest">{st.stage} // {st.title}</span>
                                        <span className="text-[9px] font-mono text-gray-500">{st.progress}</span>
                                    </div>
                                    <p className="text-xs font-black text-white uppercase">{st.title}</p>
                                    <p className="text-[10px] text-gray-400 leading-normal">{st.desc}</p>
                                    <div className="bg-white/5 p-2 rounded text-[9px] font-mono text-rhive-gold uppercase border border-white/5">
                                        System Check: {st.check}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 border-t border-white/10 pt-4 text-center">
                        <button 
                            onClick={onClose}
                            className="px-6 py-2 bg-rhive-pink/20 hover:bg-rhive-pink/40 border border-rhive-pink/40 hover:border-rhive-pink/60 text-white font-black text-[10px] uppercase tracking-widest"
                            style={{ clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)' }}
                        >
                            Acknowledge Roadmap
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};


// --- Main Page ---

const PublicHomepage: React.FC = () => {
    const { setActivePageId } = useNavigation();
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const [addressQuery, setAddressQuery] = useState('');
    const [isP01Open, setIsP01Open] = useState(false);
    const [isP02Open, setIsP02Open] = useState(false);
    const [isP04Open, setIsP04Open] = useState(false);
    const [isP06Open, setIsP06Open] = useState(false);
    const [configuratorMode, setConfiguratorMode] = useState<'estimate' | 'quote'>('estimate');
    const [selectedLane, setSelectedLane] = useState<'leak' | 'estimate' | 'quote'>('estimate');

    const handleLaneClick = (lane: 'leak' | 'estimate' | 'quote') => {
        sessionStorage.removeItem('intakeActiveLeak');
        sessionStorage.removeItem('intakeEmergencyTarp');
        sessionStorage.removeItem('intakeScopeType');
        sessionStorage.removeItem('intakePurchaseIntent');
        sessionStorage.removeItem('globalSearchQuery');
        
        if (lane === 'leak') {
            sessionStorage.setItem('intakeActiveLeak', 'true');
            sessionStorage.setItem('intakeEmergencyTarp', 'true');
        } else if (lane === 'estimate') {
            sessionStorage.setItem('intakeScopeType', 'Replacement');
            sessionStorage.setItem('intakePurchaseIntent', 'Exploring');
        } else if (lane === 'quote') {
            sessionStorage.setItem('intakeScopeType', 'Replacement');
            sessionStorage.setItem('intakePurchaseIntent', 'Ready');
        }
        
        setActivePageId('E-02a');
    };

    useEffect(() => {
        const handleEmergencyTriage = () => {
            sessionStorage.removeItem('intakeActiveLeak');
            sessionStorage.removeItem('intakeEmergencyTarp');
            sessionStorage.removeItem('intakeScopeType');
            sessionStorage.removeItem('intakePurchaseIntent');
            sessionStorage.removeItem('globalSearchQuery');
            sessionStorage.setItem('intakeActiveLeak', 'true');
            sessionStorage.setItem('intakeEmergencyTarp', 'true');
            setActivePageId('E-02a');
        };
        const handleRoofConfigurator = (e: Event) => {
            const customEvent = e as CustomEvent;
            sessionStorage.removeItem('intakeActiveLeak');
            sessionStorage.removeItem('intakeEmergencyTarp');
            sessionStorage.removeItem('intakeScopeType');
            sessionStorage.removeItem('intakePurchaseIntent');
            sessionStorage.removeItem('globalSearchQuery');
            
            if (customEvent.detail?.mode) {
                if (customEvent.detail.mode === 'quote') {
                    sessionStorage.setItem('intakeScopeType', 'Replacement');
                    sessionStorage.setItem('intakePurchaseIntent', 'Ready');
                } else {
                    sessionStorage.setItem('intakeScopeType', 'Replacement');
                    sessionStorage.setItem('intakePurchaseIntent', 'Exploring');
                }
            }
            if (customEvent.detail?.address) {
                sessionStorage.setItem('globalSearchQuery', customEvent.detail.address);
            }
            setActivePageId('E-02a');
        };

        window.addEventListener('open-emergency-triage', handleEmergencyTriage);
        window.addEventListener('open-roof-configurator', handleRoofConfigurator);

        return () => {
            window.removeEventListener('open-emergency-triage', handleEmergencyTriage);
            window.removeEventListener('open-roof-configurator', handleRoofConfigurator);
        };
    }, []);

    const services = [
        {
            title: "Commercial / Industrial",
            icon: Building2,
            desc: "Industrial-grade flat roof deployment. High-tensile PVC and TPO membranes, heat-welded for 100% molecular integration. Built for NDL warranty readiness.",
            details: ["PVC/TPO Membranes", "NDL Guarantees", "Thermal Shield"],
            cta: "Get Specs"
        },
        {
            title: "Residential",
            icon: Building2,
            desc: "The highest standard for steep-slope infrastructure. We deploy Owens Corning Duration systems with integrated ice-and-water shields and California Cut valleys.",
            details: ["Lifetime Integrity", "Storm Defense", "Zero-Leak Protocol"],
            cta: "Configure System"
        },
        {
            title: "Gutters",
            icon: Droplets,
            desc: "Custom-extruded 6\" K-Style systems. Precision-mitered corners and high-flow downspouts designed to evacuate max-volume storm events.",
            details: ["Seamless Tech", "Leaf Shielding", "High-Flow Miter"],
            cta: "View Profiles"
        },
        {
            title: "Ice Defense",
            icon: Shield,
            desc: "Thermal protection for critical infrastructure. Industrial heat cables and low-profile snow retention systems designed to prevent ice-dam catastrophe.",
            details: ["Heat Cable Arrays", "Snow Rails", "Thermal Audit"],
            cta: "Fortify Roof"
        }
    ];

    const stages = [
        { stage: "STAGE 01", title: "DRONE SCAN", desc: "Digital intake & aerial assessment. We analyze your property's roof layout using high-resolution drone mapping before any work begins.", progress: "10%" },
        { stage: "STAGE 02", title: "BALLPARK ESTIMATE", desc: "Instant visual estimate. Our technology uses spatial data to generate an initial price estimate for your project.", progress: "20%" },
        { stage: "STAGE 03", title: "CERTIFIED QUOTE", desc: "Certified fixed-price proposal. Our team reviews every detail to provide a guaranteed contract price valid for 14 days.", progress: "30%" },
        { stage: "STAGE 04", title: "SECURE SIGN-OFF", desc: "Digital contract agreement. Review and sign your project agreement online to activate your project portal.", progress: "40%" },
        { stage: "STAGE 05", title: "SCHEDULING", desc: "Permits & project timeline. We secure local permits and lock in your delivery and construction dates.", progress: "50%" },
        { stage: "STAGE 06", title: "PRE-CONSTRUCTION", desc: "Site preparation checklist. We coordinate with you to ensure property safety and zero disruptions on build day.", progress: "60%" },
        { stage: "STAGE 07", title: "INSTALLATION", desc: "The build phase. Real-time updates and photo progress sent directly to your homeowner portal as we work.", progress: "70%" },
        { stage: "STAGE 08", title: "QUALITY AUDIT", desc: "Detailed quality inspection. A thorough physical audit of your completed roof to guarantee it meets our standards.", progress: "80%" },
        { stage: "STAGE 09", title: "FINAL REVIEW", desc: "Final walkthrough. Review of all work with you to ensure absolute satisfaction and sign off on completion.", progress: "90%" },
        { stage: "STAGE 10", title: "WARRANTY HANDOVER", desc: "System handover. We deliver your Lifetime No-Leak Warranty certificate and your digital documentation archive.", progress: "100%" }
    ];

    const faqs = [
        { q: "Why do you show your cost breakdowns?", a: "At RHIVE, integrity starts with math. You see exactly what we pay for shingles, labor, and what we keep to sustain our guarantee." },
        { q: "What is the \"No-Leak Guarantee\"?", a: "If we installed it and it leaks, we fix it for free. Period. We follow manufacturer guidelines to the letter." },
        { q: "Do you offer financing?", a: "Yes. Our automated pipeline allows for rapid pre-approvals via our RPSP credit system." }
    ];

    const { scrollYProgress } = useScroll();
    const springScroll = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

    const scrollToScanner = () => {
        document.getElementById('property-scanner')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="relative h-screen w-full font-sans bg-[var(--rhive-bg)] transition-colors duration-500 overflow-y-scroll snap-y snap-mandatory">
            <ScrollProgress />

            {/* REMOVED: Fixed CTA. Moved to relative wrapper below. */}

            <div className="fixed inset-0 bg-circuit-pattern opacity-5 pointer-events-none z-0" />
            <RhiveHeader />

            {/* HERO SECTION */}
            <section id="hero" className="relative w-full min-h-[85vh] flex items-center justify-center pt-32 pb-24 overflow-hidden snap-start shrink-0">

                {/* Video Background Layer (Bottom) - Scaled and shifted to crop out top-left watermark logo */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 1 }}>
                    <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="w-full h-full object-cover"
                        style={{ transform: 'scale(1.12) translate(-3%, -3%)', transformOrigin: 'top left' }}
                    >
                        <source src="/vidupload/TRADESHOW MARKETING VIDEO.mp4" type="video/mp4" />
                    </video>
                </div>

                {/* 85% Black Overlay Layer (Middle) - Refined Technical Depth */}
                <div
                    className="absolute inset-0 bg-black/85 pointer-events-none"
                    style={{ zIndex: 2 }}
                />

                {/* Plexus Background Layer (Top of Background Stack) - Interactive Dots */}
                <div
                    className="absolute inset-0 opacity-80 pointer-events-auto"
                    style={{ zIndex: 3 }}
                >
                    <PlexusShape
                        backgroundColor="transparent"
                        dotColor="#ec028b"
                        lineColor="236, 2, 139"
                        density={120}
                    />
                </div>
                
                {/* Gradient Definition for Icons */}
                <svg width="0" height="0" className="absolute pointer-events-none">
                    <defs>
                        <linearGradient id="blue-white-grad" x1="0%" y1="100%" x2="0%" y2="0%">
                            <stop offset="0%" stopColor="#08137C" />
                            <stop offset="100%" stopColor="#ffffff" />
                        </linearGradient>
                    </defs>
                </svg>

                <div className="container mx-auto px-6 relative z-10 text-center flex flex-col items-center mt-12">
                    <FinishOnTopTitle />

                    <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="font-sans text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-12 font-bold leading-tight tracking-wide"
                    >
                        Advanced aerial mapping to manufacturer-certified installation. 100% transparent costs, 100% satisfaction, zero surprises.
                    </motion.p>

                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="flex flex-wrap justify-center gap-x-2 text-xs md:text-sm text-gray-400 font-medium tracking-wide mb-12 mt-[-24px] select-none"
                    >
                        <span>Built by </span>
                        <button 
                            onClick={() => setIsP02Open(true)}
                            className="text-white hover:text-rhive-pink font-bold underline transition-colors outline-none bg-transparent border-none p-0 cursor-pointer"
                        >
                            RHIVE AI
                        </button>
                        <span> | View Our </span>
                        <button 
                            onClick={() => setIsP04Open(true)}
                            className="text-white hover:text-rhive-pink font-bold underline transition-colors outline-none bg-transparent border-none p-0 cursor-pointer"
                        >
                            10-Stage 'Zero Surprises' Process →
                        </button>
                    </motion.div>


                    <div className="mt-8 w-full flex flex-col items-center">
                        {/* Selection Tabs - Half the height of the input field, sitting 5pt above the input field */}
                        <div className="flex justify-center gap-3 mb-[5px] z-20 relative">
                            {[
                                { id: 'leak', label: 'Emergency Leak', color: 'border-red-500/40 hover:border-red-500 text-red-500', activeBg: 'bg-red-500/20 text-red-400 border-red-500' },
                                { id: 'estimate', label: 'Instant Estimate', color: 'border-rhive-pink/40 hover:border-rhive-pink text-rhive-pink', activeBg: 'bg-rhive-pink/20 text-rhive-pink border-rhive-pink' },
                                { id: 'quote', label: 'Certified Quote', color: 'border-rhive-gold/40 hover:border-rhive-gold text-rhive-gold', activeBg: 'bg-rhive-gold/20 text-rhive-gold border-rhive-gold' }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setSelectedLane(tab.id as any)}
                                    className={cn(
                                        "h-8 px-5 flex items-center justify-center text-[10px] font-black uppercase tracking-widest border transition-all duration-300 backdrop-blur-md cursor-pointer",
                                        selectedLane === tab.id ? tab.activeBg : `${tab.color} bg-black/60`
                                    )}
                                    style={{
                                        clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)'
                                    }}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        <div className="relative flex justify-center items-center w-full max-w-4xl">
                            <AddressScanInput 
                                id="property-scanner" 
                                value={addressQuery}
                                onChange={setAddressQuery}
                                onScan={() => {
                                    sessionStorage.setItem('globalSearchQuery', addressQuery);
                                    handleLaneClick(selectedLane);
                                }}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* THE VANGUARD (ABOUT) */}
            <section id="about" className="h-screen py-32 px-6 md:px-20 max-w-7xl mx-auto snap-start flex flex-col justify-center">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 text-[var(--rhive-text)] text-left">
                    <div className="space-y-4">
                        <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none">The Vanguard.</h2>
                        <p className="text-rhive-pink font-bold text-xs tracking-[0.4em] uppercase">Identity Resolution // Radical Transparency</p>
                    </div>
                    <p className="text-[var(--rhive-text-muted)] max-w-md text-sm leading-relaxed font-serif italic">
                        Fusing female-owned operational excellence with senior-level strategic architecture to redefine the construction ecosystem.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    <FounderCard
                        name="Kara Robinson"
                        role="President // Founder"
                        bio="Commitment to reshaping the construction landscape through community impact and operational excellence."
                        image="https://static.wixstatic.com/media/c5862a_591faf36d59c448e8c92b9caff471e96~mv2.png"
                    />
                    <FounderCard
                        name="Michael Robinson"
                        role="CEO // Strategic Architect"
                        bio="Strategic architect behind RHIVE OS, bringing AI-driven automation and tech-noir efficiency to every job site."
                        image="https://static.wixstatic.com/media/c5862a_f1b8b6616fe44f739664188e00d416ce~mv2.png"
                        colorClass="rhive-blue"
                    />
                </div>
            </section>

            {/* CAPABILITY CATALOG (SERVICES) */}
            <section id="services" className="h-screen py-24 px-6 md:px-20 bg-[var(--rhive-bg)] snap-start flex flex-col justify-center">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-20 text-[var(--rhive-text)] text-left">
                        <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4">Capability Catalog.</h2>
                        <div className="w-20 h-1 bg-rhive-pink" />
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {services.map((service, idx) => (
                            <Card key={idx} className="p-0 border-0">
                                <div className="p-10 flex flex-col h-full group">
                                    <div className="text-rhive-pink mb-8 group-hover:scale-110 transition-transform">
                                        <service.icon size={40} />
                                    </div>
                                    <h3 className="text-xl font-bold uppercase mb-4 text-[var(--rhive-text)] font-display tracking-tight">{service.title}</h3>
                                    <p className="text-[var(--rhive-text-muted)] text-sm leading-relaxed mb-8 flex-grow opacity-80">{service.desc}</p>
                                    <button
                                        onClick={() => setActivePageId('P-12')}
                                        className="text-[10px] font-bold uppercase tracking-widest text-rhive-pink border-b border-rhive-pink/20 pb-1 hover:border-rhive-pink transition-all w-fit px-0 bg-transparent text-left"
                                    >
                                        Configure System
                                    </button>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* THE JOURNEY (PROCESS) */}
            <section id="process" className="h-screen overflow-y-auto py-24 relative bg-[var(--rhive-bg)] snap-start flex flex-col justify-center">
                <div className="container mx-auto px-6 relative z-10">
                    <div className="text-center mb-20 text-[var(--rhive-text)]">
                        <div className="inline-block border border-rhive-blue/50 px-4 py-1 rounded-full text-xs font-bold tracking-[0.2em] mb-4 uppercase bg-rhive-blue/10">
                            <span className="bg-gradient-to-t from-rhive-blue to-white bg-clip-text text-transparent">Zero Surprises Promise</span>
                        </div>
                        <h2 className="font-display text-3xl md:text-5xl font-bold uppercase">The 10-Stage Journey</h2>
                    </div>

                    <div className="relative max-w-4xl mx-auto">
                        <div className="process-line hidden md:block"></div>

                        {stages.map((stage, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0.3, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className={cn(
                                    "process-stage flex flex-col md:flex-row items-center justify-between mb-16 relative w-full",
                                    idx % 2 === 0 ? "" : "md:flex-row-reverse"
                                )}
                            >
                                <div className={cn(
                                    "md:w-5/12 hidden md:block",
                                    idx % 2 === 0 ? "text-right pr-8" : "text-left pl-8"
                                )}>
                                    <h3 className="font-display text-2xl font-bold text-[var(--rhive-text)] uppercase">{stage.title}</h3>
                                    <p className="text-[var(--rhive-text-muted)] text-sm mt-2">{stage.desc}</p>
                                </div>
                                <div className={cn(
                                    "w-12 h-12 bg-transparent border-2 rounded-full z-10 flex items-center justify-center font-display font-bold text-[var(--rhive-text)]",
                                    idx % 3 === 0 ? "border-rhive-pink shadow-[0_0_15px_#ec028b]" :
                                        idx % 3 === 1 ? "border-rhive-blue shadow-[0_0_15px_#08137C]" :
                                            "border-rhive-gold shadow-[0_0_15px_#e2ab49]"
                                )}>
                                    {stage.stage.split(' ')[1]}
                                </div>
                                <div className={cn(
                                    "md:w-5/12 mt-4 md:mt-0 text-center",
                                    idx % 2 === 0 ? "md:text-left pl-8" : "md:text-right pr-8"
                                )}>
                                    <h3 className="font-display text-xl font-bold text-[var(--rhive-text)] uppercase md:hidden mb-2">{stage.title}</h3>
                                    <div 
                                        className={cn(
                                            "glass-dark p-6 border-y-0 text-xs text-[var(--rhive-text-muted)]",
                                            idx % 2 === 0 ? "border-l-4 border-rhive-pink" : "border-r-4 border-rhive-blue"
                                        )}
                                        style={{ clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)' }}
                                    >
                                        <div className="flex justify-between items-center mb-4">
                                            <span className="text-[10px] font-mono text-gray-500 uppercase">Verification Checksum</span>
                                            <span className="text-rhive-pink">OK</span>
                                        </div>
                                        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden mb-4">
                                            <div className="h-full bg-gradient-to-r from-rhive-pink to-rhive-blue" style={{ width: stage.progress }} />
                                        </div>
                                        <strong>Goal:</strong> {stage.progress} Completion
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FINANCING & ECONOMICS */}
            <section id="financing" className="h-screen py-24 px-6 md:px-20 bg-[var(--rhive-bg)] snap-start flex flex-col justify-center">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        <div className="space-y-10 order-2 lg:order-1 text-[var(--rhive-text)] text-left">
                            <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-6">Efficiency Credit.</h2>
                            <p className="text-xl text-[var(--rhive-text-muted)] font-serif italic max-w-xl leading-relaxed">
                                Our RPSP (Project Savings Promotion) rewards speed. By committing within the 48-hour data window, we bypass logistics overhead and pass a 10% credit back to you.
                            </p>

                            <div className="grid grid-cols-3 gap-6">
                                <div>
                                    <h4 className="text-rhive-pink font-bold text-[10px] uppercase tracking-widest mb-4">Deposit</h4>
                                    <p className="text-3xl font-bold text-[var(--rhive-text)] uppercase italic">50%</p>
                                    <p className="text-[9px] text-[var(--rhive-text-muted)] mt-2 uppercase tracking-tighter">Due at Sign-Off</p>
                                </div>
                                <div>
                                    <h4 className="text-rhive-pink font-bold text-[10px] uppercase tracking-widest mb-4">Install</h4>
                                    <p className="text-3xl font-bold text-[var(--rhive-text)] uppercase italic">40%</p>
                                    <p className="text-[9px] text-[var(--rhive-text-muted)] mt-2 uppercase tracking-tighter">Due at Material Drop</p>
                                </div>
                                <div>
                                    <h4 className="text-rhive-pink font-bold text-[10px] uppercase tracking-widest mb-4">Final</h4>
                                    <p className="text-3xl font-bold text-[var(--rhive-text)] uppercase italic">10%</p>
                                    <p className="text-[9px] text-[var(--rhive-text-muted)] mt-2 uppercase tracking-tighter">Verified Completion</p>
                                </div>
                            </div>

                             <button className="px-10 py-5 bg-rhive-pink/20 hover:bg-rhive-pink/40 border border-rhive-pink/40 hover:border-rhive-pink/60 backdrop-blur-md text-white font-bold uppercase tracking-widest text-sm hover:brightness-110 active:scale-95 transition-all w-fit shadow-[0_0_15px_rgba(236,2,139,0.2)]" style={{ clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)' }}>
                                Review Economics
                            </button>
                        </div>

                        <div className="order-1 lg:order-2">
                            <div 
                                className="glass-dark p-12 relative border-white/10 group overflow-hidden"
                                style={{ clipPath: 'polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)' }}
                            >
                                <Shield size={40} className="text-rhive-pink mb-8" />
                                <h3 className="text-3xl font-bold uppercase mb-8 text-[var(--rhive-text)] tracking-tight">System Integrity Protocol</h3>
                                <div className="space-y-6 text-left">
                                    {[
                                        "Owens Corning Lifetime Systems",
                                        "Molecular Heat-Welded Membranes",
                                        "NDL Guarantee Compliance",
                                        "Aerial Thermal Audits"
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center gap-4 text-xs font-bold uppercase tracking-[0.2em] text-[var(--rhive-text-muted)]">
                                            <div className="w-1.5 h-1.5 bg-rhive-pink" />
                                            <span>{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SYSTEM INTEGRITY (TRANSPARENCY PREVIEW) */}
            <section id="integrity" className="h-screen py-24 px-6 md:px-20 bg-[var(--rhive-bg)] relative snap-start flex flex-col justify-center">
                <div className="absolute inset-0 z-0 opacity-10">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
                </div>

                <div className="max-w-7xl mx-auto relative z-10 text-left">
                    <div className="grid lg:grid-cols-2 gap-20 items-center text-left">
                        <div className="text-left">
                            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-8 text-[var(--rhive-text)] text-left">System Integrity.</h2>
                            <p className="text-xl text-[var(--rhive-text-muted)] font-serif italic mb-12 leading-relaxed text-left">
                                We've decoupled the traditional "Black Box" contractor model. Our System Integrity Dashboard provides real-time oversight of every molecular transition in your roof's lifecycle.
                            </p>

                            <div className="space-y-4">
                                {[
                                    { label: "Material Provenance", value: "Verified Batch 0x7E4" },
                                    { label: "Labor Certification", value: "Tier-1 Certified" },
                                    { label: "Warranty Hash", value: "SHA-256 Integrated" }
                                ].map((item, i) => (
                                    <div 
                                        key={i} 
                                        className="glass-dark p-6 flex justify-between items-center border-[var(--rhive-border)]"
                                        style={{ clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)' }}
                                    >
                                        <span className="text-xs font-bold uppercase tracking-widest text-[var(--rhive-text-muted)]">{item.label}</span>
                                        <span className="text-rhive-pink font-mono text-xs">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="relative group">
                            <div className="absolute -inset-4 bg-rhive-pink/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                            <div 
                                className="glass-dark p-2 border-[var(--rhive-border)] relative"
                                style={{ clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)' }}
                            >
                                <div className="aspect-video bg-[var(--rhive-bg)] flex items-center justify-center overflow-hidden relative border border-[var(--rhive-border)]" style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}>
                                    <div className="absolute inset-0 bg-circuit-pattern opacity-10 scale-150" />
                                    <motion.div
                                        animate={{
                                            rotate: [0, 360],
                                            scale: [1, 1.1, 1]
                                        }}
                                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                        className="w-40 h-40 border border-rhive-pink/20 rounded-full flex items-center justify-center"
                                    >
                                        <Shield size={60} className="text-rhive-pink animate-pulse" />
                                    </motion.div>
                                    <div className="absolute bottom-6 left-6 text-[10px] font-mono text-rhive-pink space-y-1 text-left">
                                        <p>{">"} ANALYZING_MEMBRANE_COHESION...</p>
                                        <p>{">"} OK_SYSTEMS_GO</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* INSTANT DATA (ESTIMATOR CTA) */}
            <section id="estimate" className="h-screen py-48 px-6 bg-[var(--rhive-bg)] transition-colors duration-500 relative isolate snap-start flex flex-col justify-center">
                <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, currentcolor 1px, transparent 0)", backgroundSize: "40px 40px" }} />

                <div className="max-w-5xl mx-auto text-center relative z-10 text-[var(--rhive-text)]">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-7xl md:text-[140px] font-black uppercase tracking-tighter mb-10 leading-[0.8]">
                            Instant Data<span className="text-rhive-pink">.</span>
                        </h2>
                        <p className="text-rhive-pink font-bold text-sm tracking-[0.5em] mb-20 uppercase">
                            // RUNNING GEOSPATIAL ANALYSIS PKG: ESTIMATOR_V2.0
                        </p>

                        <div 
                            className="bg-[var(--rhive-bg)] p-2 flex flex-col md:flex-row max-w-3xl mx-auto shadow-2xl group border border-[var(--rhive-border)]"
                            style={{ clipPath: 'polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)' }}
                        >
                            <div className="flex-grow flex items-center px-10">
                                <input
                                    type="text"
                                    placeholder="INPUT PROPERTY ADDRESS..."
                                    className="bg-transparent text-[var(--rhive-text)] w-full py-5 outline-none placeholder-[var(--rhive-text-muted)] font-bold uppercase text-sm tracking-widest text-left"
                                />
                            </div>
                            <button 
                                className="bg-rhive-pink/20 hover:bg-rhive-pink/40 border border-rhive-pink/40 hover:border-rhive-pink/60 backdrop-blur-md text-white px-10 py-5 font-bold uppercase text-sm active:scale-95 transition-all tracking-widest whitespace-nowrap shadow-[0_0_15px_rgba(236,2,139,0.2)]"
                                style={{ clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)' }}
                            >
                                Analyze Now
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* INSURANCE ALLIANCE */}
            <section id="insurance" className="h-[60vh] py-24 px-6 md:px-20 bg-black/60 snap-start flex flex-col justify-center">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
                    <div className="flex-1 space-y-6">
                        <h2 className="text-5xl font-black uppercase tracking-tighter italic text-white">Insurance <br /> Advocacy.</h2>
                        <p className="text-gray-400 text-sm leading-relaxed max-w-lg">
                            We don't work for carriers. We work for you. Our public adjusters and strategic engineers ensure your property is restored to pre-loss condition using high-fidelity weather data.
                        </p>
                        <div className="grid grid-cols-2 gap-4 pt-4">
                            <div className="border border-white/10 p-4 font-black text-[10px] tracking-widest uppercase text-rhive-pink">NRCA Certified</div>
                            <div className="border border-white/10 p-4 font-black text-[10px] tracking-widest uppercase text-rhive-pink">HAAG Engineering</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ LOGIC (INTEGRATED) */}
            <section id="faq" className="min-h-screen py-32 px-6 md:px-20 snap-start flex flex-col justify-center bg-[var(--rhive-bg)]">
                <div className="max-w-5xl mx-auto w-full">
                    <div className="mb-20">
                        <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4 text-white">FAQ.</h2>
                        <div className="w-20 h-1 bg-rhive-pink" />
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq, idx) => (
                            <div key={idx} className="border-b border-white/5 py-8 group cursor-pointer" onClick={() => setOpenFaq(openFaq === idx ? null : idx)}>
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-bold uppercase tracking-tight text-white group-hover:text-rhive-pink transition-colors">{faq.q}</h3>
                                    <ChevronRight className={cn("text-rhive-pink transition-transform duration-300", openFaq === idx ? "rotate-90" : "")} />
                                </div>
                                <AnimatePresence>
                                    {openFaq === idx && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <p className="text-sm text-gray-400 leading-relaxed font-serif italic pt-4 text-left">
                                                {faq.a}
                                            </p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CONTACT TERMINAL */}
            <section id="contact" className="min-h-[80vh] py-32 px-6 md:px-20 snap-start flex flex-col justify-center border-t border-white/5 bg-black/40">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-24 items-center">
                    <div className="flex-1 space-y-10">
                        <div className="space-y-4">
                            <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter italic text-white">Connect.</h2>
                            <p className="text-rhive-pink font-black text-xs tracking-[0.4em] uppercase">24/7 Deployment Command Center</p>
                        </div>
                        <div className="space-y-4 font-mono text-xs tracking-widest text-gray-500 uppercase">
                            <p>Global Headquarters: Silicon Slopes, Utah</p>
                            <p>Phone: (435) 417-6637</p>
                            <p>Email: HQ@RHIVECONSTRUCTION.COM</p>
                        </div>
                    </div>
                    <div 
                        className="flex-1 w-full bg-white/5 border border-white/10 p-10 relative isolate overflow-hidden"
                        style={{ clipPath: 'polygon(24px 0, 100% 0, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0 100%, 0 24px)' }}
                    >
                        <div className="absolute inset-0 bg-circuit-pattern opacity-5 pointer-events-none" />
                        <div className="space-y-6 relative z-10">
                            <input type="text" placeholder="NAME / IDENTIFIER" className="w-full bg-transparent border-b border-white/20 py-4 text-xs font-black uppercase tracking-widest outline-none focus:border-rhive-pink transition-all text-white" />
                            <input type="email" placeholder="SECURE MAILBOX" className="w-full bg-transparent border-b border-white/20 py-4 text-xs font-black uppercase tracking-widest outline-none focus:border-rhive-pink transition-all text-white" />
                            <textarea placeholder="MISSION BRIEFING..." className="w-full bg-transparent border-b border-white/20 py-8 text-xs font-black uppercase tracking-widest outline-none focus:border-rhive-pink transition-all text-white h-32 resize-none" />
                            <button className="w-full btn-tech py-6 text-xs uppercase tracking-[0.3em] font-black">Dispatch Message</button>
                        </div>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="h-screen py-24 px-6 md:px-20 border-t border-[var(--rhive-border)] bg-[var(--rhive-bg)] relative text-[var(--rhive-text)] snap-start flex flex-col justify-center">
                <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-20">
                    <div className="space-y-6 text-left">
                        <div className="flex flex-col text-left">
                            <img
                                src="https://i.imgur.com/t0VcSgJ.png"
                                alt="RHIVE Logo"
                                className="h-10 w-auto object-contain"
                            />
                            <span className="text-[10px] font-bold text-rhive-pink uppercase tracking-widest mt-4">Professional Ecosystem</span>
                        </div>
                        <p className="text-[10px] text-gray-600 font-mono tracking-widest leading-loose uppercase text-left">
                            44.0682° N, 114.7420° W <br />
                            SILICON SLOPES CLUSTER <br />
                            (435) 417-6637
                        </p>
                    </div>

                    <div className="text-left">
                        <h5 className="font-bold text-rhive-pink text-[10px] uppercase tracking-widest mb-10 text-left">Structural</h5>
                        <ul className="text-[var(--rhive-text-muted)] text-[10px] space-y-4 font-bold uppercase tracking-widest list-none p-0 text-left">
                            <li><a href="#hero" className="hover:text-rhive-pink transition no-underline">Foundation</a></li>
                            <li><a href="#services" className="hover:text-rhive-pink transition no-underline">Fulfillment</a></li>
                            <li><a href="#process" className="hover:text-rhive-pink transition no-underline">Deployment</a></li>
                            <li><a href="#financing" className="hover:text-rhive-pink transition no-underline">Economics</a></li>
                        </ul>
                    </div>

                    <div className="text-left">
                        <h5 className="font-bold text-rhive-pink text-[10px] uppercase tracking-widest mb-10 text-left">Gateway</h5>
                        <ul className="text-[var(--rhive-text-muted)] text-[10px] space-y-4 font-bold uppercase tracking-widest list-none p-0 text-left">
                            <li><button onClick={() => setActivePageId('P-06')} className="hover:text-rhive-pink bg-transparent border-0 p-0 font-bold uppercase text-left">Client Auth</button></li>
                            <li><button onClick={() => setActivePageId('P-09')} className="hover:text-rhive-pink bg-transparent border-0 p-0 font-bold uppercase text-left">Drone Data</button></li>
                            <li><button onClick={() => setActivePageId('P-10')} className="hover:text-rhive-pink bg-transparent border-0 p-0 font-bold uppercase text-left">Vanguard</button></li>
                        </ul>
                    </div>

                    <div className="flex flex-col justify-between items-start md:items-end">
                        <div className="flex gap-4 mb-10">
                            {['IG', 'LI', 'TW'].map(s => (
                                <div key={s} className="w-10 h-10 border border-white/10 flex items-center justify-center text-[10px] font-bold hover:bg-rhive-pink transition-all cursor-pointer">
                                    {s}
                                </div>
                            ))}
                        </div>
                        <p className="text-[9px] text-gray-700 font-bold uppercase tracking-widest leading-loose font-mono text-left md:text-right">
                            © 2026 RHIVE INDUSTRIES LLC. <br />
                            ALL RIGHTS RESERVED.
                        </p>
                    </div>
                </div>
            </footer>

            <FoundersCardLightbox 
                isOpen={isP02Open} 
                onClose={() => setIsP02Open(false)} 
            />

            <ProcessLightbox 
                isOpen={isP04Open} 
                onClose={() => setIsP04Open(false)} 
            />
        </div>
    );
};

export default PublicHomepage;
