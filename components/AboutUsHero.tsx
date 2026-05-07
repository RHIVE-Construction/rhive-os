import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { ArrowRightIcon, Zap } from './icons';
import { cn } from '../lib/utils';
import PlexusShape from './PlexusShape';

// Glitch Text Component (reused for tech-noir feel)
const GlitchText = ({ text, className }: { text: string, className?: string }) => {
    return (
        <div className={cn("relative inline-block", className)}>
            <span className="relative z-10 block">{text}</span>
            <motion.span
                className="absolute inset-0 z-20 text-[#ec028b] mix-blend-screen pointer-events-none select-none"
                initial={{ opacity: 0 }}
                animate={{
                    opacity: [0, 0.4, 0, 0.2, 0],
                    x: [0, -2, 1, -1, 0],
                }}
                transition={{ duration: 0.2, repeat: Infinity, repeatDelay: Math.random() * 2 + 1, ease: "easeInOut" }}
            >
                {text}
            </motion.span>
        </div>
    );
};

// The Actual Embeddable Component
export const AboutUsHeroModule = () => (
    <div className="relative group isolate w-full max-w-6xl mx-auto overflow-hidden bg-black/80 border border-rhive-pink/30 shadow-[0_0_40px_rgba(236,2,139,0.15)] flex flex-col md:flex-row items-stretch"
        style={{ clipPath: 'polygon(32px 0, 100% 0, 100% calc(100% - 32px), calc(100% - 32px) 100%, 0 100%, 0 32px)' }}>

        {/* Abstract Background Layer */}
        <div className="absolute inset-0 pointer-events-none z-0">
            <div className="absolute inset-0 bg-gradient-to-r from-rhive-pink/10 to-transparent w-full md:w-1/2" />
            <div className="absolute right-0 top-0 w-1/2 h-full opacity-30">
                <PlexusShape backgroundColor="transparent" dotColor="#ffffff" lineColor="255, 255, 255" density={30} />
            </div>
        </div>

        {/* Left Side: The Hook */}
        <div className="relative z-10 w-full md:w-1/2 p-10 md:p-16 flex flex-col justify-center">
            <div className="inline-block border border-rhive-pink/30 px-4 py-1 rounded-full bg-rhive-pink/10 mb-6 self-start shadow-[0_0_15px_rgba(236,2,139,0.2)]">
                <span className="text-rhive-pink font-bold text-xs tracking-[0.2em] uppercase flex items-center gap-2">
                    <Zap size={12} fill="currentColor" /> The RHIVE Standard
                </span>
            </div>

            <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter leading-tight drop-shadow-2xl mb-6">
                <GlitchText text="FINISH ON TOP." className="text-white" />
            </h2>

            <p className="text-xl md:text-2xl font-serif italic text-white/90 mb-8 border-l-2 border-rhive-pink pl-6">
                We're not just a roofing company. <br />We're a revolution in construction.
            </p>

            <p className="text-[var(--rhive-text-muted)] text-lg leading-relaxed mb-10 max-w-md">
                A fundamentally transparent approach to contracting. No salesman markup. Complete operational excellence. And a guarantee that actually protects you.
            </p>

            {/* CTA Button */}
            <button
                onClick={() => window.location.href = '/aboutus'}
                className="group relative px-8 py-4 bg-rhive-pink border border-transparent text-white font-black uppercase tracking-widest text-sm hover:bg-white hover:text-black hover:border-rhive-pink transition-all flex items-center justify-center gap-3 overflow-hidden self-start"
                style={{ clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)' }}
            >
                <span className="relative z-10 flex items-center gap-2">Read Our Story <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></span>
            </button>
        </div>

        {/* Right Side: Visual Data / Founder Hint */}
        <div className="relative z-10 w-full md:w-1/2 min-h-[300px] border-l border-white/10 overflow-hidden flex flex-col items-center justify-center p-12 bg-black/40 backdrop-blur-sm">
            {/* Decorative Corner Accents */}
            <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-rhive-pink/50" />
            <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-rhive-pink/50" />

            <div className="text-center space-y-4 relative z-10">
                <h3 className="font-display text-4xl font-black uppercase tracking-tight text-white/80">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-rhive-pink to-rhive-gold">Trust.</span> Built In.
                </h3>
                <div className="flex justify-center gap-8 mt-8">
                    <div className="text-center">
                        <div className="text-3xl font-black text-rhive-pink mb-1">100%</div>
                        <div className="text-xs uppercase tracking-widest text-white/50 font-bold">Transparency</div>
                    </div>
                    <div className="w-[1px] bg-white/10" />
                    <div className="text-center">
                        <div className="text-3xl font-black text-rhive-blue mb-1">0%</div>
                        <div className="text-xs uppercase tracking-widest text-white/50 font-bold">Salesman Markup</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

// Preview Lightbox Wrapper (For Internal Review)
export const AboutUsHeroPreview: React.FC<{ isOpen: boolean; onClose: () => void; }> = ({ isOpen, onClose }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 md:p-12 overflow-hidden">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                        animate={{ opacity: 1, backdropFilter: 'blur(12px)' }}
                        exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                        transition={{ duration: 0.4 }}
                        className="absolute inset-0 bg-black/80 cursor-pointer"
                        onClick={onClose}
                    />

                    {/* Content Wrapper */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="relative w-full z-10"
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute -top-12 right-0 md:right-4 z-50 text-white hover:text-rhive-pink transition-colors p-2 bg-black/50 rounded-full border border-white/20 hover:border-rhive-pink/50 backdrop-blur-md"
                        >
                            <X size={24} />
                        </button>

                        <AboutUsHeroModule />
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
