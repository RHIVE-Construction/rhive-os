import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { ShieldCheckIcon, UserIcon, ArrowRightIcon } from './icons';
import { cn } from '../lib/utils';
import PlexusShape from './PlexusShape';

interface AboutUsLightboxProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AboutUsLightbox: React.FC<AboutUsLightboxProps> = ({ isOpen, onClose }) => {

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-12 overflow-hidden">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                        animate={{ opacity: 1, backdropFilter: 'blur(12px)' }}
                        exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                        transition={{ duration: 0.4 }}
                        className="absolute inset-0 bg-black/60 cursor-pointer"
                        onClick={onClose}
                    />

                    {/* Lightbox Container */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="relative w-full max-w-5xl bg-[#050505] border border-rhive-pink/30 shadow-[0_0_50px_rgba(236,2,139,0.15)] flex flex-col md:flex-row overflow-hidden"
                        style={{ clipPath: 'polygon(32px 0, 100% 0, 100% calc(100% - 32px), calc(100% - 32px) 100%, 0 100%, 0 32px)' }}
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 z-50 text-white/50 hover:text-white transition-colors p-2 bg-black/50 rounded-full hover:bg-rhive-pink/20 border border-transparent hover:border-rhive-pink/50 backdrop-blur-md"
                        >
                            <X size={24} />
                        </button>

                        {/* Left Side: Visual/Background */}
                        <div className="w-full md:w-2/5 relative min-h-[250px] md:min-h-full bg-black flex items-center justify-center overflow-hidden">
                            <div className="absolute inset-0 opacity-40">
                                <PlexusShape backgroundColor="transparent" dotColor="#ec028b" lineColor="236, 2, 139" density={40} />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#050505]" />
                            <div className="relative z-10 p-8 text-center">
                                <h3 className="font-display text-4xl md:text-5xl font-black uppercase tracking-tighter text-white mb-2 drop-shadow-[0_0_15px_rgba(236,2,139,0.5)]">
                                    <span className="text-rhive-pink">RHIVE</span><br />CONSTRUCTION
                                </h3>
                                <p className="text-[var(--rhive-text-muted)] font-serif italic text-lg uppercase tracking-widest">Est. 2022</p>
                            </div>
                        </div>

                        {/* Right Side: Content */}
                        <div className="w-full md:w-3/5 p-8 md:p-12 relative z-10 flex flex-col justify-center">

                            <div className="inline-block border border-rhive-pink/30 px-4 py-1 rounded-full bg-rhive-pink/10 mb-6 self-start">
                                <span className="text-rhive-pink font-bold text-xs tracking-[0.2em] uppercase">Who We Are</span>
                            </div>

                            <h2 className="text-3xl md:text-4xl font-black uppercase text-white tracking-tight leading-tight mb-4">
                                We don't just build roofs.<br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rhive-pink to-rhive-gold">We build trust.</span>
                            </h2>

                            <p className="text-[var(--rhive-text-muted)] text-lg leading-relaxed mb-8">
                                A completely radically transparent approach to contracting. We eliminate salesman markup, provide comprehensive data-driven reports, and guarantee our work—because you deserve to know exactly what goes into your home.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-rhive-blue/10 rounded-sm border border-rhive-blue/30 shrink-0">
                                        <ShieldCheckIcon className="w-6 h-6 text-rhive-blue" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold text-sm uppercase mb-1">Total Transparency</h4>
                                        <p className="text-[#9CA3AF] text-xs">No hidden fees, no salesman markup.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-rhive-pink/10 rounded-sm border border-rhive-pink/30 shrink-0">
                                        <UserIcon className="w-6 h-6 text-rhive-pink" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold text-sm uppercase mb-1">Human Impact</h4>
                                        <p className="text-[#9CA3AF] text-xs">Community reinvestment on every job.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                                <button
                                    onClick={() => {
                                        onClose();
                                        window.location.href = '/aboutus';
                                        window.scrollTo(0, 0);
                                    }}
                                    className="group relative px-6 py-4 bg-transparent border border-[var(--border-color)] text-white font-bold uppercase tracking-widest text-sm hover:border-rhive-pink transition-all flexitems-center justify-center gap-2 overflow-hidden w-full sm:w-auto text-center"
                                    style={{ clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)' }}
                                >
                                    <span className="relative z-10 flex items-center justify-center gap-2">Read Full Story <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></span>
                                    <div className="absolute inset-0 bg-rhive-pink/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out z-0" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
