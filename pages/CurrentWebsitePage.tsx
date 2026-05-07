import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserIcon, Globe, Layout, Code } from 'lucide-react';
import { useNavigation } from '../contexts/NavigationContext';
import { useTheme } from '../contexts/ThemeContext';
import { cn } from '../lib/utils';
import RhiveHeader from '../components/website/RhiveHeader';
import RhiveHero from '../components/website/RhiveHero';
import RhiveComparison from '../components/website/RhiveComparison';
import RhiveHexSidebar from '../components/website/RhiveHexSidebar';
import HunniChatWidget from '../components/website/HunniChatWidget';

const CurrentWebsitePage: React.FC = () => {
    const { setActivePageId } = useNavigation();
    const [viewMode, setViewMode] = useState<'recreation' | 'live'>('recreation');
    const [virtualPage, setVirtualPage] = useState<'home' | 'about' | 'roofing' | 'estimator'>('home');

    return (
        <div className="relative w-full h-full bg-black flex flex-col overflow-y-auto overflow-x-hidden">
            {/* VIEW MODE TOGGLE (Floating Bottom Right) */}
            <div className="fixed bottom-8 right-8 z-[1000] flex gap-2 p-1 bg-black/80 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl">
                <button
                    onClick={() => setViewMode('recreation')}
                    className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all",
                        viewMode === 'recreation' ? "bg-rhive-pink text-white" : "text-gray-400 hover:text-white"
                    )}
                >
                    <Layout className="w-3 h-3" />
                    OS Recreation
                </button>
                <button
                    onClick={() => setViewMode('live')}
                    className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all",
                        viewMode === 'live' ? "bg-rhive-pink text-white" : "text-gray-400 hover:text-white"
                    )}
                >
                    <Globe className="w-3 h-3" />
                    Live Site
                </button>
            </div>

            <AnimatePresence mode="wait">
                {viewMode === 'recreation' ? (
                    <motion.div
                        key="recreation"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex-grow flex flex-col"
                    >
                        <RhiveHeader />
                        <RhiveHexSidebar />
                        <HunniChatWidget />

                        <main className="flex-grow">
                            {virtualPage === 'home' && (
                                <>
                                    <RhiveHero />
                                    <RhiveComparison />
                                </>
                            )}
                            {virtualPage !== 'home' && (
                                <div className="min-h-screen flex items-center justify-center pt-24">
                                    <div className="text-center">
                                        <h2 className="text-4xl font-black uppercase tracking-tighter text-white mb-4">
                                            {virtualPage.toUpperCase()} MODULE
                                        </h2>
                                        <p className="text-rhive-pink font-mono text-xs uppercase tracking-[0.4em]">
                                            // Reconstructing Data Streams...
                                        </p>
                                    </div>
                                </div>
                            )}
                        </main>
                    </motion.div>
                ) : (
                    <motion.div
                        key="live"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex-grow w-full h-full relative z-10"
                    >
                        {/* RE-ENTRY AVATAR (Top Left) */}
                        <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ scale: 1.1 }}
                            onClick={() => setActivePageId('P-00')}
                            className="fixed top-6 left-6 z-[2000] w-12 h-12 rounded-full bg-black/80 backdrop-blur-xl border border-white/10 flex items-center justify-center group shadow-2xl"
                        >
                            <div className="relative">
                                <UserIcon className="w-5 h-5 text-white/40 group-hover:text-rhive-pink transition-colors" />
                                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rhive-pink rounded-full animate-pulse-glow" />
                            </div>
                        </motion.button>

                        <iframe
                            src="https://www.rhiveconstruction.com/"
                            className="w-full h-full border-none"
                            title="Current RHIVE Website"
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CurrentWebsitePage;
