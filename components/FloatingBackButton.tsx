import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigation } from '../contexts/NavigationContext';
import { motion, AnimatePresence } from 'framer-motion';

export const FloatingBackButton: React.FC = () => {
    const { activePageId, setActivePageId } = useNavigation();

    // Only show on public pages that are NOT the homepage (P-00, P-00-V3, etc.)
    const isHomepage = ['P-00', 'P-00-V2', 'P-00-V3'].includes(activePageId);
    const isPublic = activePageId?.startsWith('P-');

    if (!isPublic || isHomepage) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="fixed bottom-10 left-10 z-[100]"
            >
                <button
                    onClick={() => setActivePageId('P-00')}
                    className="flex items-center gap-3 bg-black/80 backdrop-blur-xl border border-white/20 hover:border-rhive-pink/50 text-white px-6 py-4 rounded-full font-black text-xs tracking-[0.2em] uppercase transition-all shadow-[0_10px_30px_rgba(0,0,0,0.5)] group cursor-pointer"
                >
                    <ArrowLeft size={16} className="text-rhive-pink group-hover:-translate-x-1 transition-transform" />
                    <span>Back to Start</span>
                </button>
            </motion.div>
        </AnimatePresence>
    );
};
