import React, { useState, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import {
    Zap,
    ArrowRight,
    CheckCircle2,
    Building2,
    Shield,
    Droplets,
    Wind,
    Sun,
    Layers,
    Cpu,
    Activity,
    Users,
    FileImage,
    MousePointer2
} from 'lucide-react';
import { useNavigation } from '../contexts/NavigationContext';
import PlexusShape from '../components/PlexusShape';
import { cn } from '../lib/utils';
import RhiveHeader from '../components/website/RhiveHeader';
import Card from '../components/Card';
import GranulePhysicsOverlay from '../components/GranulePhysicsOverlay';

// --- Visual Helpers (Reused from PublicHomepage) ---

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
            <span className="relative z-10 block">{text}</span>
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

const EmergencyBanner = () => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            whileHover={{ scale: 1.05, x: -10 }}
            className="flex items-center gap-4 bg-red-600/90 backdrop-blur-md rounded-l-full py-3 px-6 shadow-[0_0_30px_rgba(220,38,38,0.6)] border border-red-500/50 cursor-pointer min-w-[200px] max-w-[240px] group overflow-hidden relative animate-[pulse_4s_ease-in-out_infinite]"
            onClick={() => window.dispatchEvent(new CustomEvent('open-estimator', { detail: { protocol: 'EMERGENCY' } }))}
        >
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="p-2 bg-white/20 rounded-full group-hover:scale-110 transition-transform">
                <Zap size={16} className="text-white fill-white" />
            </div>
            <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-white/90">Active Leak</span>
                <span className="text-xs font-bold text-white">[5 Drops]</span>
            </div>
        </motion.div>
    );
};

// --- Main Page Component ---

const PublicHomepageV2: React.FC = () => {
    const { setActivePageId } = useNavigation();
    const { scrollYProgress } = useScroll();
    const springScroll = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

    const techPages = [
        { title: "Asphalt Roofing", id: "P-02a", icon: Layers },
        { title: "O.C. DURATION", id: "P-02a-1", icon: Shield },
        { title: "O.C. FLEX", id: "P-02a-2", icon: Activity },
        { title: "Membrane Roofing", id: "P-02b", icon: Building2 },
        { title: "Roof Components", id: "P-02e", icon: Cpu }
    ];

    return (
        <div className="relative w-full min-h-full font-sans bg-[var(--rhive-bg)] transition-colors duration-500">
            <ScrollProgress />

            {/* FLOATING CTAS (Preserved from original) */}
            <motion.div
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="fixed right-0 top-1/2 -translate-y-1/2 z-[100] group flex items-center transition-all px-4"
            >
                <div className="flex flex-col gap-3 mr-4 items-end">
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

            {/* SECTION 1: THE HERO (D - Dominance) */}
            <section id="hero-d" className="relative w-full min-h-[85vh] flex items-center justify-center pt-32 pb-24 overflow-hidden shrink-0">
                <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 1 }}>
                    <video autoPlay muted loop playsInline className="w-full h-full object-cover scale-100">
                        <source src="/vidupload/TRADESHOW MARKETING VIDEO.mp4" type="video/mp4" />
                    </video>
                </div>
                <div className="absolute inset-0 bg-black/85 pointer-events-none" style={{ zIndex: 2 }} />
                <div className="absolute inset-0 opacity-80 pointer-events-auto" style={{ zIndex: 3 }}>
                    <PlexusShape backgroundColor="transparent" dotColor="#ec028b" lineColor="236, 2, 139" density={120} />
                </div>

                <div className="container mx-auto px-6 relative z-10 text-center flex flex-col items-center mt-12">
                    <motion.h1
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="font-display text-6xl md:text-8xl font-black uppercase leading-[0.85] mb-8 tracking-tighter text-white drop-shadow-2xl max-w-5xl mx-auto"
                    >
                        <GlitchText text="Utah's Premier Roofing Solutions." className="text-white" />
                    </motion.h1>

                    <div className="mt-12 flex flex-col sm:flex-row justify-center gap-6 w-full max-w-2xl">
                        <button 
                            onClick={() => setActivePageId('P-12')}
                            className="bg-rhive-pink text-white px-10 py-5 font-bold uppercase tracking-[0.2em] text-sm hover:brightness-110 active:scale-95 transition-all shadow-[0_0_20px_rgba(236,2,139,0.4)] flex items-center justify-center gap-3 w-full sm:w-auto border border-rhive-pink/50 backdrop-blur-sm"
                        >
                            <Zap size={18} />
                            Get a Quote
                        </button>
                        <button 
                            onClick={() => setActivePageId('P-04')}
                            className="bg-rhive-blue/20 backdrop-blur-md text-white border border-rhive-blue/50 px-10 py-5 font-bold uppercase tracking-[0.2em] text-sm hover:bg-rhive-blue/40 active:scale-95 transition-all flex items-center justify-center gap-3 w-full sm:w-auto"
                        >
                            <Activity size={18} />
                            View Financing
                        </button>
                    </div>
                </div>
            </section>

            {/* SECTION 2: THE VISION (I - Influence) */}
            <section id="vision-i" className="min-h-screen py-32 px-6 md:px-20 bg-[var(--rhive-bg)] flex flex-col justify-center border-t border-[var(--rhive-border)] relative">
                <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, currentcolor 1px, transparent 0)", backgroundSize: "40px 40px" }} />
                
                <div className="max-w-7xl mx-auto w-full z-10 relative">
                    <div className="text-center mb-16">
                        <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4 text-[var(--rhive-text)]">
                            Roofs Designed to Turn Heads.
                        </h2>
                        <div className="w-20 h-1 bg-rhive-pink mx-auto mb-6" />
                        <p className="text-[var(--rhive-text-muted)] max-w-2xl mx-auto text-lg italic font-serif">
                            Experience architectural excellence. A roof isn't just protection; it's the defining aesthetic statement of your property.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                        {/* Placeholder Gallery - Utilizing existing logic/images if possible, or standard placeholders */}
                        <div className="aspect-[4/3] rounded-sm overflow-hidden border border-white/10 group relative">
                            <img src="https://firebasestorage.googleapis.com/v0/b/video-qr-automator.firebasestorage.app/o/Website%20Media%20Assets%2FImages%2FArchitectural.png?alt=media&token=0cdc836c-d80a-49e0-8c33-fd26e7e2a36a" alt="Designer Package" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                                <span className="text-white font-bold uppercase tracking-widest text-xs">Architectural Shingles</span>
                            </div>
                        </div>
                        <div className="aspect-[4/3] rounded-sm overflow-hidden border border-white/10 group relative">
                            <img src="https://firebasestorage.googleapis.com/v0/b/video-qr-automator.firebasestorage.app/o/Website%20Media%20Assets%2FImages%2FHigh%20COntrast.png?alt=media&token=d9873f3c-afff-49a9-b666-cb46cfaf3c91" alt="Premium Design" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                                <span className="text-white font-bold uppercase tracking-widest text-xs">High-Contrast Aesthetic</span>
                            </div>
                        </div>
                        <div className="aspect-[4/3] rounded-sm overflow-hidden border border-white/10 group relative">
                            <img src="https://firebasestorage.googleapis.com/v0/b/video-qr-automator.firebasestorage.app/o/Website%20Media%20Assets%2FImages%2FPrecision%20Installation.png?alt=media&token=5d344d6c-80bb-45c8-8e6e-b6ac030f05a3" alt="Completed Home" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                                <span className="text-white font-bold uppercase tracking-widest text-xs">Precision Installation</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap justify-center gap-4 relative">
                        {/* Animated Cursor */}
                        <motion.div
                            className="hidden md:block absolute -bottom-6 left-1/2 z-20 pointer-events-none text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                            style={{ x: "-50%" }}
                            initial={{ x: 320, y: 20, opacity: 0 }}
                            animate={{ 
                                x: [320, 320, 0, 0, -320, -320, -320],
                                y: [20, -10, 10, -10, 10, -10, 20], 
                                scale: [1, 0.8, 1, 0.8, 1, 0.8, 1],
                                opacity: [0, 1, 1, 1, 1, 1, 0] 
                            }}
                            transition={{ 
                                repeat: Infinity, 
                                duration: 6,
                                ease: "easeInOut",
                                times: [0, 0.1, 0.4, 0.5, 0.8, 0.9, 1]
                            }}
                        >
                            <MousePointer2 size={36} className="fill-white/20 stroke-white" strokeWidth={1.5} />
                        </motion.div>
                        <button onClick={() => setActivePageId('P-02a-3')} className="border border-rhive-pink/50 bg-rhive-pink/10 hover:bg-rhive-pink/20 text-white backdrop-blur-md text-xs px-8 py-4 uppercase tracking-widest flex items-center gap-2 transition-all">
                            <FileImage size={16} className="text-rhive-pink" /> Explore DESIGNER Packages
                        </button>
                        <button onClick={() => setActivePageId('P-02a-4')} className="border border-rhive-blue/50 bg-rhive-blue/10 hover:bg-rhive-blue/20 text-white backdrop-blur-md text-xs px-8 py-4 uppercase tracking-widest flex items-center gap-2 transition-all">
                            <Building2 size={16} className="text-rhive-blue" /> See PREMIUM DESIGN
                        </button>
                        <button onClick={() => setActivePageId('P-01')} className="border border-white/20 bg-white/5 hover:bg-white/10 text-white backdrop-blur-md text-xs px-8 py-4 uppercase tracking-widest flex items-center gap-2 transition-all">
                            <Users size={16} /> Meet Our Team
                        </button>
                    </div>
                </div>
            </section>

            {/* SECTION 3: THE PROTECTION & PROCESS (S - Steadiness) */}
            <section id="protection-s" className="min-h-screen py-32 px-6 md:px-20 bg-black/40 flex flex-col justify-center border-t border-[var(--rhive-border)] relative isolate">
                <div className="absolute inset-0 bg-circuit-pattern opacity-5 pointer-events-none" />
                
                <div className="max-w-7xl mx-auto w-full z-10 grid lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6 text-[var(--rhive-text)]">
                            No Surprises.<br />
                            <span className="animate-metallic-shine-vertical bg-gradient-to-b from-blue-300 via-white to-blue-600 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(59,130,246,0.6)]">Just a Safe,<br />Protected Home.</span>
                        </h2>
                        <div className="w-20 h-1 bg-rhive-blue mb-8" />
                        
                        <p className="text-[var(--rhive-text-muted)] text-lg mb-8 leading-relaxed">
                            Utah winters are unforgiving. Our systems are engineered specifically for extreme thermal cycling and heavy snow loads. We prioritize seamless installations, rigorous safety protocols, and long-term warranties so you never have to worry about your roof again.
                        </p>

                        <div className="space-y-6 mb-12">
                            <div className="flex items-start gap-4">
                                <Shield className="text-rhive-blue shrink-0 mt-1" />
                                <div>
                                    <h4 className="text-[var(--rhive-text)] font-bold uppercase tracking-widest text-sm mb-1">Guaranteed Defense</h4>
                                    <p className="text-[var(--rhive-text-muted)] text-xs">Comprehensive ice and water shields installed beyond standard code requirements.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <Wind className="text-rhive-blue shrink-0 mt-1" />
                                <div>
                                    <h4 className="text-[var(--rhive-text)] font-bold uppercase tracking-widest text-sm mb-1">Zero-Friction Process</h4>
                                    <p className="text-[var(--rhive-text-muted)] text-xs">From initial drone scan to final punch list, our 10-stage process is fully transparent.</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-6 mt-8 relative z-20">
                            {/* Neon Border Button 1 */}
                            <button 
                                onClick={() => setActivePageId('P-03')} 
                                className="relative group overflow-hidden w-full sm:w-auto min-w-[220px]"
                            >
                                {/* Spinning Gradient Border */}
                                <div className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#000000_0%,#3b82f6_50%,#000000_100%)] opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>
                                
                                {/* Inner Button Container */}
                                <div className="relative z-10 m-[2px] bg-[#050914] px-10 py-5 h-[calc(100%-4px)] flex flex-col items-center justify-center transition-colors duration-300 group-hover:bg-[#0a1128] shadow-[inset_0_0_20px_rgba(59,130,246,0.1)] group-hover:shadow-[inset_0_0_30px_rgba(59,130,246,0.3)]">
                                    <span className="font-bold tracking-[0.15em] text-sm text-white group-hover:text-blue-100 uppercase text-center group-hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.8)] transition-all">Read Our<br/>Process</span>
                                </div>
                            </button>

                            {/* Neon Border Button 2 */}
                            <button 
                                onClick={() => setActivePageId('P-02d')} 
                                className="relative group overflow-hidden w-full sm:w-auto min-w-[220px]"
                            >
                                {/* Spinning Gradient Border */}
                                <div className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#000000_0%,#3b82f6_50%,#000000_100%)] opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>
                                
                                {/* Inner Button Container */}
                                <div className="relative z-10 m-[2px] bg-[#050914] px-10 py-5 h-[calc(100%-4px)] flex flex-col items-center justify-center transition-colors duration-300 group-hover:bg-[#0a1128] shadow-[inset_0_0_20px_rgba(59,130,246,0.1)] group-hover:shadow-[inset_0_0_30px_rgba(59,130,246,0.3)]">
                                    <span className="font-bold tracking-[0.15em] text-sm text-white group-hover:text-blue-100 uppercase text-center group-hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.8)] transition-all">Explore Ice<br/>Management</span>
                                </div>
                            </button>

                            {/* Neon Border Button 3 */}
                            <button 
                                onClick={() => setActivePageId('P-02c')} 
                                className="relative group overflow-hidden w-full sm:w-auto min-w-[220px]"
                            >
                                {/* Spinning Gradient Border */}
                                <div className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#000000_0%,#3b82f6_50%,#000000_100%)] opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>
                                
                                {/* Inner Button Container */}
                                <div className="relative z-10 m-[2px] bg-[#050914] px-10 py-5 h-[calc(100%-4px)] flex flex-col items-center justify-center transition-colors duration-300 group-hover:bg-[#0a1128] shadow-[inset_0_0_20px_rgba(59,130,246,0.1)] group-hover:shadow-[inset_0_0_30px_rgba(59,130,246,0.3)]">
                                    <span className="font-bold tracking-[0.15em] text-sm text-white group-hover:text-blue-100 uppercase text-center group-hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.8)] transition-all">View Gutter<br/>Defense Systems</span>
                                </div>
                            </button>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="aspect-square bg-gradient-to-br from-rhive-blue/20 to-transparent border border-rhive-blue/30 rounded-full flex items-center justify-center p-12 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-circuit-pattern opacity-10 animate-pulse" />
                            <Shield size={120} className="text-rhive-blue relative z-10 group-hover:scale-110 transition-transform duration-700" />
                            <div className="absolute inset-0 rounded-full border-2 border-rhive-blue/20 animate-[spin_10s_linear_infinite]" />
                            <div className="absolute inset-4 rounded-full border border-rhive-blue/40 animate-[spin_15s_linear_infinite_reverse]" />
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 4: THE TECHNICAL DETAILS (C - Conscientiousness) */}
            <section id="tech-c" className="min-h-screen py-32 px-6 md:px-20 bg-[var(--rhive-bg)] flex flex-col justify-center border-t border-[var(--rhive-border)] relative">
                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
                
                {/* Granule Physics Overlay */}
                <GranulePhysicsOverlay />

                <div className="max-w-7xl mx-auto w-full relative z-10">
                    <div className="text-center mb-16 relative z-20">
                        <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4 text-[var(--rhive-text)]">
                            Engineered for Durability.<br/>Compare Our Materials.
                        </h2>
                        <div className="w-20 h-1 bg-rhive-gold mx-auto mb-6" />
                        <p className="text-[var(--rhive-text-muted)] max-w-3xl mx-auto text-sm font-mono tracking-widest uppercase">
                            // Access technical specifications, warranty documentation, and material science data.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16 relative z-20 tech-grid-container">
                        {techPages.map((page, idx) => (
                            <div 
                                key={idx} 
                                className="relative group overflow-hidden cursor-pointer bg-[#050914]/60 backdrop-blur-[10px] p-[1px] shadow-lg transition-all duration-500 hover:shadow-[0_0_40px_rgba(226,171,73,0.3)] tech-card-element"
                                onClick={() => setActivePageId(page.id)}
                                style={{ clipPath: 'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)' }}
                            >
                                {/* Circuit Trace Border (Neon Flow on Hover) */}
                                <div className="absolute inset-[-500%] animate-[spin_5s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#374151_0%,#374151_40%,#e2ab49_50%,#374151_60%,#374151_100%)] opacity-30 group-hover:opacity-100 transition-opacity duration-700" />
                                
                                {/* Inner Card Container */}
                                <div 
                                    className="relative w-full h-full bg-[#050505]/90 p-8 flex flex-col z-10 overflow-hidden"
                                    style={{ clipPath: 'polygon(19px 0, 100% 0, 100% calc(100% - 19px), calc(100% - 19px) 100%, 0 100%, 0 19px)' }}
                                >
                                    {/* Macro-Video Loop Hover State */}
                                    <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
                                        <video autoPlay muted loop playsInline className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-1000">
                                            <source src="/vidupload/TRADESHOW MARKETING VIDEO.mp4" type="video/mp4" />
                                        </video>
                                        <div className="absolute inset-0 bg-black/60 mix-blend-multiply" />
                                    </div>

                                    {/* Card Content */}
                                    <div className="relative z-10 flex flex-col h-full">
                                        {/* Isometric 3D Wireframe Icon */}
                                        <div className="relative mb-6 text-rhive-gold group-hover:text-white transition-colors duration-500 transform group-hover:-translate-y-2 group-hover:rotate-y-12 perspective-1000 w-12 h-12 flex items-center justify-center">
                                            <div className="absolute inset-0 bg-rhive-gold/20 blur-md rounded-full group-hover:animate-pulse" />
                                            <page.icon className="relative z-10 drop-shadow-[0_0_8px_rgba(226,171,73,0.8)]" size={32} strokeWidth={1.5} />
                                        </div>
                                        
                                        <h3 className="text-xl font-bold uppercase mb-4 text-[var(--rhive-text)] font-display tracking-tight group-hover:text-white transition-colors">{page.title}</h3>
                                        
                                        <div className="mt-auto pt-6 border-t border-rhive-gold/20 flex items-center justify-between text-xs font-mono text-[var(--rhive-text-muted)] group-hover:text-rhive-gold transition-colors">
                                            <span>INITIATE DATA TRANSFER</span>
                                            <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        
                        {/* View All Services Card (Pink/Magenta Circuit Trace) */}
                        <div 
                            className="relative group overflow-hidden cursor-pointer bg-[#050914]/60 backdrop-blur-[10px] p-[1px] shadow-lg transition-all duration-500 hover:shadow-[0_0_40px_rgba(236,2,139,0.3)] tech-card-element" 
                            onClick={() => setActivePageId('P-02')}
                            style={{ clipPath: 'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)' }}
                        >
                            <div className="absolute inset-[-500%] animate-[spin_5s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#374151_0%,#374151_40%,#ec028b_50%,#374151_60%,#374151_100%)] opacity-30 group-hover:opacity-100 transition-opacity duration-700" />
                            
                            <div 
                                className="relative w-full h-full bg-[#050505]/90 p-8 flex flex-col items-center justify-center text-center z-10 overflow-hidden"
                                style={{ clipPath: 'polygon(19px 0, 100% 0, 100% calc(100% - 19px), calc(100% - 19px) 100%, 0 100%, 0 19px)' }}
                            >
                                <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
                                    <video autoPlay muted loop playsInline className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-1000">
                                        <source src="/vidupload/TRADESHOW MARKETING VIDEO.mp4" type="video/mp4" />
                                    </video>
                                    <div className="absolute inset-0 bg-black/60 mix-blend-multiply" />
                                </div>

                                <div className="relative z-10 flex flex-col items-center">
                                    <div className="relative mb-4 text-rhive-pink group-hover:text-white transition-colors duration-500 transform group-hover:-translate-y-2 group-hover:rotate-y-12 perspective-1000 w-12 h-12 flex items-center justify-center">
                                        <div className="absolute inset-0 bg-rhive-pink/20 blur-md rounded-full group-hover:animate-pulse" />
                                        <Activity className="relative z-10 drop-shadow-[0_0_8px_rgba(236,2,139,0.8)]" size={40} strokeWidth={1.5} />
                                    </div>
                                    <h3 className="text-lg font-bold uppercase text-[var(--rhive-text)] font-display tracking-tight group-hover:text-white transition-colors">View All Services</h3>
                                    <p className="text-xs font-mono text-[var(--rhive-text-muted)] mt-2 group-hover:text-rhive-pink transition-colors">Comprehensive Systems Catalog</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FOOTER (Reused logic) */}
            <footer className="py-24 px-6 md:px-20 border-t border-[var(--rhive-border)] bg-[var(--rhive-bg)] relative text-[var(--rhive-text)] flex flex-col justify-center">
                <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-20 w-full">
                    <div className="space-y-6 text-left">
                        <div className="flex flex-col text-left">
                            <img src="https://i.imgur.com/t0VcSgJ.png" alt="RHIVE Logo" className="h-10 w-auto object-contain" />
                            <span className="text-[10px] font-bold text-rhive-pink uppercase tracking-widest mt-4">Professional Ecosystem</span>
                        </div>
                        <p className="text-[10px] text-[var(--rhive-text-muted)] font-mono tracking-widest leading-loose uppercase text-left">
                            44.0682° N, 114.7420° W <br />
                            SILICON SLOPES CLUSTER <br />
                            (435) 417-6637
                        </p>
                    </div>

                    <div className="text-left">
                        <h5 className="font-bold text-rhive-pink text-[10px] uppercase tracking-widest mb-10 text-left">Navigation</h5>
                        <ul className="text-[var(--rhive-text-muted)] text-[10px] space-y-4 font-bold uppercase tracking-widest list-none p-0 text-left">
                            <li><a href="#hero-d" className="hover:text-rhive-pink transition no-underline">The Hero (D)</a></li>
                            <li><a href="#vision-i" className="hover:text-rhive-pink transition no-underline">The Vision (I)</a></li>
                            <li><a href="#protection-s" className="hover:text-rhive-pink transition no-underline">Protection (S)</a></li>
                            <li><a href="#tech-c" className="hover:text-rhive-pink transition no-underline">Technical (C)</a></li>
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
                        <p className="text-[10px] text-gray-700 font-mono tracking-widest uppercase">
                            © {new Date().getFullYear()} RHIVE Construction. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default PublicHomepageV2;
