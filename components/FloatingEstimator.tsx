import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap } from 'lucide-react';
import ContactUsTodayForm from './ContactUsTodayForm';
import { useNavigation } from '../contexts/NavigationContext';

export const FloatingEstimator: React.FC = () => {
    const { activePageId } = useNavigation();
    const [isOpen, setIsOpen] = useState(false);
    const [concern, setConcern] = useState('General');
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const handleOpen = (e: any) => {
            setIsOpen(true);
            const selectedConcern = e.detail?.concern || e.detail?.protocol || 'General';
            setConcern(selectedConcern);
        };
        window.addEventListener('open-estimator', handleOpen);
        window.addEventListener('open-roof-configurator', handleOpen);
        return () => {
            window.removeEventListener('open-estimator', handleOpen);
            window.removeEventListener('open-roof-configurator', handleOpen);
        };
    }, []);

    useEffect(() => {
        const isHomepage = ['P-00', 'P-00-V2', 'P-00-V3', 'P-Landing'].includes(activePageId);

        if (!isHomepage) {
            setIsVisible(true);
            return;
        }

        // On homepage, hide the floating scanner tab by default until scrolled to capability catalog
        setIsVisible(false);

        const handleScroll = () => {
            const servicesEl = document.getElementById('services') || document.getElementById('tech-c');
            if (servicesEl) {
                const rect = servicesEl.getBoundingClientRect();
                if (rect.top <= window.innerHeight * 0.8) {
                    setIsVisible(true);
                } else {
                    setIsVisible(false);
                }
            }
        };

        // Run initial check
        handleScroll();

        window.addEventListener('scroll', handleScroll, { capture: true, passive: true });
        return () => window.removeEventListener('scroll', handleScroll, { capture: true });
    }, [activePageId]);

    const toggleDrawer = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            {/* 1. SIDE TAB BUTTON */}
            <AnimatePresence>
                {isVisible && (
                    <motion.button
                        key="system-scan-tab"
                        onClick={() => {
                            setConcern('General');
                            setIsOpen(true);
                        }}
                        whileHover={{ scale: 1.05, x: -10 }}
                        whileTap={{ scale: 0.95 }}
                        className="fixed right-0 top-1/2 -translate-y-1/2 z-[600] flex items-center gap-3 bg-black text-white px-4 py-10 rounded-l-3xl shadow-[-20px_0_40px_rgba(236,2,139,0.3)] hover:shadow-[-30px_0_60px_rgba(236,2,139,0.6)] transition-all group overflow-hidden border border-white/10 outline-none cursor-pointer"
                        initial={{ x: 100 }}
                        animate={{ x: 0 }}
                        exit={{ x: 100 }}
                        transition={{ type: 'spring', damping: 20, stiffness: 100 }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-rhive-pink/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="flex flex-col items-center gap-2 relative z-10">
                            <Zap size={20} className="text-rhive-pink animate-pulse" />
                            <span className="text-[10px] font-mono tracking-[0.3em] uppercase [writing-mode:vertical-lr] rotate-180 font-black">
                                CONTACT US
                            </span>
                        </div>
                    </motion.button>
                )}
            </AnimatePresence>

            {/* 2. DRAWER BACKDROP */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="fixed inset-0 bg-black/85 backdrop-blur-sm z-[700]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={toggleDrawer}
                    />
                )}
            </AnimatePresence>

            {/* 3. SLIDE-OUT DRAWER */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="fixed top-0 right-0 h-full w-full max-w-lg bg-black z-[800] shadow-[-40px_0_80px_rgba(0,0,0,0.8)] border-l border-white/10 overflow-hidden flex flex-col pt-12"
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300, mass: 0.8 }}
                    >
                        {/* Top Pink Line */}
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-rhive-pink/10">
                            <div className="h-full bg-rhive-pink shadow-pink-glow w-full" />
                        </div>

                        {/* Header */}
                        <div className="p-10 flex justify-between items-center border-b border-white/10 relative bg-black/50">
                            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-rhive-pink/50 to-transparent" />
                            <div className="flex flex-col">
                                <span className="text-rhive-pink font-black text-xs uppercase tracking-[0.4em] mb-2">
                                    Intake Active // {concern}
                                </span>
                                <h2 className="text-3xl font-black uppercase tracking-tighter text-white italic">
                                    Contact Us Today<span className="text-rhive-pink">.</span>
                                </h2>
                            </div>
                            <motion.button
                                whileHover={{ rotate: 90, scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={toggleDrawer}
                                className="p-3 border border-white/10 text-gray-400 hover:text-rhive-pink transition-colors flex items-center justify-center outline-none bg-transparent cursor-pointer"
                            >
                                <X size={20} />
                            </motion.button>
                        </div>

                        {/* Content Area */}
                        <div className="flex-grow p-8 overflow-y-auto flex flex-col justify-start">
                            <ContactUsTodayForm 
                                concern={concern} 
                                showTitle={false} 
                                className="border-0 bg-transparent shadow-none p-0 flex flex-col gap-6" 
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default FloatingEstimator;
