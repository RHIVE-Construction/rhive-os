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
    ChevronRight
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
                className="absolute inset-0 z-20 text-[#00ffff] mix-blend-screen pointer-events-none select-none"
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
                className="bg-black/80 backdrop-blur-xl border border-rhive-pink/50 rounded-l-full py-4 px-8 shadow-[0_0_30px_rgba(236,2,139,0.3)] flex items-center justify-between min-w-[240px] group/btn overflow-hidden relative"
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
                className="bg-rhive-blue/80 backdrop-blur-xl border border-rhive-blue/50 rounded-l-full py-4 px-8 shadow-[0_0_30px_rgba(8,19,124,0.3)] flex items-center justify-between min-w-[240px] group/btn overflow-hidden relative"
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
        <motion.button
            whileHover={{ x: -10, scale: 1.05 }}
            onClick={() => window.dispatchEvent(new CustomEvent('open-estimator', { detail: { protocol: 'EMERGENCY BREACH' } }))}
            className="bg-red-600/90 backdrop-blur-xl border border-red-400/50 rounded-l-full py-3 px-6 shadow-[0_0_30px_rgba(239,68,68,0.3)] flex items-center justify-between min-w-[200px] max-w-[240px] group/btn overflow-hidden relative"
        >
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
            <div className="flex items-center gap-3">
                <Zap size={16} className="text-white" fill="currentColor" />
                <span className="text-[10px] font-black uppercase tracking-widest text-white">Active Leak [5 Drops]</span>
            </div>
            <ArrowRight size={14} className="text-white opacity-0 group-hover/btn:opacity-100 -translate-x-2 group-hover/btn:translate-x-0 transition-all" />
        </motion.button>
    );
};


const AddressScanInput = ({ id }: { id?: string }) => {
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
                colorClass === "rhive-pink" ? "group-hover:text-rhive-pink" : "group-hover:text-rhive-blue"
            )}>{name}</h3>
            <p className="text-rhive-gold text-sm font-bold tracking-widest uppercase mb-4">{role}</p>
            <p className="text-[var(--rhive-text-muted)] text-sm leading-relaxed max-w-md font-serif italic">
                {bio}
            </p>
        </div>
    </Card>
);

// --- Main Page ---

const PublicHomepage: React.FC = () => {
    const { setActivePageId } = useNavigation();
    const [openFaq, setOpenFaq] = useState<number | null>(null);

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
        { stage: "STAGE 01", title: "LEAD", desc: "Digital intake & identification. We analyze your property's geometry via satellite data before we ever deploy a human.", progress: "10%" },
        { stage: "STAGE 02", title: "ESTIMATE", desc: "Instant ballpark numbers. Our AI uses Google Solar data to generate a low-friction financial starting point.", progress: "20%" },
        { stage: "STAGE 03", title: "QUOTE", desc: "Certified proposal. A human architect verifies every variable to provide a fixed-price packet valid for 14 days.", progress: "30%" },
        { stage: "STAGE 04", title: "SIGN & VERIFY", desc: "Digital contract & 50% deposit. We generate your secure 'Ghost Link' and unlock the client portal.", progress: "40%" },
        { stage: "STAGE 05", title: "SCHEDULE", desc: "Material & labor logistics. Permits are filed and the production queue is locked into our operational registry.", progress: "50%" },
        { stage: "STAGE 06", title: "PRE-INSTALL", desc: "Site preparation & approvals. Final coordination with homeowners to ensure zero-friction deployment.", progress: "60%" },
        { stage: "STAGE 07", title: "INSTALL", desc: "The build. Live photo feeds are streamed directly from your roof to your portal in real-time.", progress: "70%" },
        { stage: "STAGE 08", title: "PUNCH LIST", desc: "Quality assurance. A multi-point structural audit ensures every detail exceeds our ineffable standard.", progress: "80%" },
        { stage: "STAGE 09", title: "INVOICING", desc: "Final accounting. 10% payment trigger upon completion and verified client satisfaction.", progress: "90%" },
        { stage: "STAGE 10", title: "COMPLETED", desc: "Asset handover. We deliver your Lifetime No-Leak Warranty and your Digital Property Vault.", progress: "100%" }
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

            {/* UPDATED COMMAND CENTER (Logic Bound to Scanner) */}
            <motion.div
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="fixed right-0 top-1/2 -translate-y-1/2 z-[100] group flex items-center transition-all px-4"
            >
                <div className="flex flex-col gap-3 mr-4 items-end">

                    {/* MOVED: Emergency Banner as the top-priority action */}
                    <div className="flex justify-end transform origin-right">
                        <EmergencyBanner />
                    </div>

                    <motion.button
                        whileHover={{ x: -10, scale: 1.05 }}
                        onClick={() => window.dispatchEvent(new CustomEvent('open-estimator', { detail: { protocol: 'INSTANT ESTIMATE' } }))}
                        className="bg-black/80 backdrop-blur-xl border border-rhive-pink/50 rounded-l-full py-3 px-6 shadow-[0_0_30px_rgba(236,2,139,0.3)] flex items-center justify-between min-w-[200px] max-w-[240px] group/btn overflow-hidden relative"
                    >
                        <div className="absolute inset-0 bg-rhive-pink/10 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                        <div className="flex items-center gap-3">
                            <Zap size={16} className="text-rhive-pink" fill="currentColor" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-white">Instant Estimate</span>
                        </div>
                        <ArrowRight size={14} className="text-rhive-pink opacity-0 group-hover/btn:opacity-100 -translate-x-2 group-hover/btn:translate-x-0 transition-all" />
                    </motion.button>

                    <motion.button
                        whileHover={{ x: -10, scale: 1.05 }}
                        onClick={() => window.dispatchEvent(new CustomEvent('open-estimator', { detail: { protocol: 'CERTIFIED QUOTE' } }))}
                        className="bg-rhive-blue/80 backdrop-blur-xl border border-rhive-blue/50 rounded-l-full py-3 px-6 shadow-[0_0_30px_rgba(8,19,124,0.3)] flex items-center justify-between min-w-[200px] max-w-[240px] group/btn overflow-hidden relative"
                    >
                        <div className="absolute inset-0 bg-rhive-blue/10 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                        <div className="flex items-center gap-3">
                            <CheckCircle2 size={16} className="text-white" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-white">Certified Quote</span>
                        </div>
                        <ArrowRight size={14} className="text-white opacity-0 group-hover/btn:opacity-100 -translate-x-2 group-hover/btn:translate-x-0 transition-all" />
                    </motion.button>
                </div>

                <div className="h-48 w-1 bg-gradient-to-b from-transparent via-rhive-pink to-transparent opacity-30" />
            </motion.div>

            <div className="fixed inset-0 bg-circuit-pattern opacity-5 pointer-events-none z-0" />
            <RhiveHeader />

            {/* HERO SECTION */}
            <section id="hero" className="relative w-full min-h-[85vh] flex items-center justify-center pt-32 pb-24 overflow-hidden snap-start shrink-0">

                {/* Video Background Layer (Bottom) */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 1 }}>
                    <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="w-full h-full object-cover scale-100"
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

                <div className="container mx-auto px-6 relative z-10 text-center flex flex-col items-center mt-12">
                    <motion.h1
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="font-display text-7xl md:text-9xl font-black uppercase leading-[0.85] mb-8 tracking-tighter text-white drop-shadow-2xl"
                    >
                        <GlitchText text="Finish On Top." className="text-white" />
                    </motion.h1>

                    <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="font-sans text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-12 font-bold leading-tight tracking-wide"
                    >
                        The first AI-enabled operating system for all high-performance roofing projects—residential, commercial, or emergency restoration. From drone scan to certified install in record time with zero surprises.
                    </motion.p>

                    <div className="mt-8 w-full flex justify-center">
                        <div className="relative flex justify-center items-center w-full max-w-4xl">

                            {/* HANDWRITING CTA + ARROW OVERLAY (Pinned Left) */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, x: -20 }}
                                animate={{ opacity: 1, scale: 1, x: 0 }}
                                transition={{ delay: 1.5, duration: 0.8 }}
                                className="absolute right-full mr-[-125px] top-[-140px] z-[110] pointer-events-none hidden xl:flex flex-col items-end gap-0"
                            >
                                <div style={{ fontFamily: "'Caveat', cursive", whiteSpace: "nowrap" }} className="text-rhive-pink text-3xl lg:text-4xl -rotate-6 drop-shadow-[0_0_12px_rgba(236,2,139,0.8)] mr-16 mb-2">
                                    Got a project? <br /> Start here!
                                </div>
                                {/* Precision Guided Arrow: Aiming for the absolute corner of the scanner */}
                                <svg width="260" height="140" viewBox="0 0 260 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-0 overflow-visible">
                                    <path
                                        d="M10 20 Q 150 15 228 72"
                                        stroke="#ec028b"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        fill="none"
                                        className="drop-shadow-[0_0_10px_rgba(236,2,139,0.9)] opacity-90"
                                    />
                                    <path
                                        d="M204 60 L228 72 L216 46"
                                        stroke="#ec028b"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        fill="none"
                                        className="drop-shadow-[0_0_10px_rgba(236,2,139,0.9)] opacity-90"
                                    />
                                </svg>
                            </motion.div>

                            <AddressScanInput id="property-scanner" />
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
                        <div className="inline-block border border-rhive-blue/50 text-rhive-blue px-4 py-1 rounded-full text-xs font-bold tracking-[0.2em] mb-4 uppercase bg-rhive-blue/10">
                            Zero Surprises Promise
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
                                    <div className={cn(
                                        "glass-dark p-6 rounded border-y-0 text-xs text-[var(--rhive-text-muted)]",
                                        idx % 2 === 0 ? "border-l-4 border-rhive-pink" : "border-r-4 border-rhive-blue"
                                    )}>
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

                            <button className="px-10 py-5 bg-rhive-pink text-white font-bold uppercase tracking-widest text-sm glass-frosted hover:brightness-110 active:scale-95 transition-all w-fit">
                                Review Economics
                            </button>
                        </div>

                        <div className="order-1 lg:order-2">
                            <div className="glass-dark p-12 relative border-white/10 group overflow-hidden">
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
                                    <div key={i} className="glass-dark p-6 flex justify-between items-center border-[var(--rhive-border)]">
                                        <span className="text-xs font-bold uppercase tracking-widest text-[var(--rhive-text-muted)]">{item.label}</span>
                                        <span className="text-rhive-pink font-mono text-xs">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="relative group">
                            <div className="absolute -inset-4 bg-rhive-pink/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                            <div className="glass-dark p-2 border-[var(--rhive-border)] relative">
                                <div className="aspect-video bg-[var(--rhive-bg)] flex items-center justify-center overflow-hidden relative border border-[var(--rhive-border)]">
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

                        <div className="bg-[var(--rhive-bg)] p-2 rounded-full flex flex-col md:flex-row max-w-3xl mx-auto shadow-2xl group border border-[var(--rhive-border)]">
                            <div className="flex-grow flex items-center px-10">
                                <input
                                    type="text"
                                    placeholder="INPUT PROPERTY ADDRESS..."
                                    className="bg-transparent text-[var(--rhive-text)] w-full py-5 outline-none placeholder-[var(--rhive-text-muted)] font-bold uppercase text-sm tracking-widest text-left"
                                />
                            </div>
                            <button className="bg-rhive-pink text-white px-10 py-5 rounded-full font-bold uppercase text-sm hover:brightness-110 active:scale-95 transition-all tracking-widest whitespace-nowrap">
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
                    <div className="flex-1 w-full bg-white/5 border border-white/10 p-10 rounded-3xl relative isolate overflow-hidden">
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
        </div>
    );
};

export default PublicHomepage;
