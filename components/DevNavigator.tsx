import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, X, ChevronRight, Code } from 'lucide-react';
import { useNavigation } from '../contexts/NavigationContext';
import { PAGE_GROUPS } from '../constants';
import { cn } from '../lib/utils';

export const DevNavigator: React.FC = () => {
    const { activePageId, setActivePageId } = useNavigation();
    const [isOpen, setIsOpen] = useState(false);

    // Extract all public pages from PAGE_GROUPS
    const publicGroup = PAGE_GROUPS.find(g => g.userType === 'All');
    const publicPages = publicGroup ? publicGroup.pages.filter(p => p.id.startsWith('P-')) : [];

    // Also include a few developer utility links to jump back to portal
    const devShortcuts = [
        { id: 'C-01', name: 'Customer Portal', description: 'Jump to Portal' },
        { id: 'E-01', name: 'Employee Portal', description: 'Jump to Portal' },
        { id: 'CO-01', name: 'Contractor Portal', description: 'Jump to Portal' },
    ];

    return (
        <div className="fixed bottom-6 left-6 z-[9999] font-sans">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20, originX: 0, originY: 1 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="absolute bottom-16 left-0 w-80 max-h-[70vh] flex flex-col bg-black/90 backdrop-blur-xl border border-[var(--rhive-pink)]/50 shadow-[0_0_30px_rgba(236,2,139,0.2)] rounded-xl overflow-hidden"
                    >
                        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
                            <div className="flex items-center gap-2">
                                <Code size={16} className="text-[var(--rhive-pink)]" />
                                <span className="text-base font-black uppercase tracking-widest text-white">Dev Navigator</span>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                                <X size={16} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-2 scrollbar-hide">
                            <div className="px-3 py-2 text-base font-black uppercase tracking-[0.2em] text-gray-500">Website Pages (P-*)</div>
                            <div className="space-y-1 mb-4">
                                {publicPages.map(page => (
                                    <button
                                        key={page.id}
                                        onClick={() => {
                                            setActivePageId(page.id);
                                            setIsOpen(false);
                                        }}
                                        className={cn(
                                            "w-full flex flex-col items-start px-3 py-2 rounded-lg text-left transition-all",
                                            activePageId === page.id 
                                                ? "bg-[var(--rhive-pink)]/20 border border-[var(--rhive-pink)]/50" 
                                                : "hover:bg-white/5 border border-transparent"
                                        )}
                                    >
                                        <div className="flex items-center gap-2 w-full">
                                            <span className={cn(
                                                "text-base font-bold uppercase tracking-wide",
                                                activePageId === page.id ? "text-[var(--rhive-pink)]" : "text-gray-300"
                                            )}>
                                                {page.name}
                                            </span>
                                            {activePageId === page.id && <ChevronRight size={14} className="ml-auto text-[var(--rhive-pink)]" />}
                                        </div>
                                        <span className="text-base text-gray-500 uppercase font-mono mt-0.5">{page.id} - {page.description}</span>
                                    </button>
                                ))}
                            </div>

                            <div className="px-3 py-2 text-base font-black uppercase tracking-[0.2em] text-gray-500 border-t border-white/10 pt-4">Portal Shortcuts</div>
                            <div className="space-y-1">
                                {devShortcuts.map(page => (
                                    <button
                                        key={page.id}
                                        onClick={() => {
                                            setActivePageId(page.id);
                                            setIsOpen(false);
                                        }}
                                        className="w-full flex flex-col items-start px-3 py-2 rounded-lg text-left hover:bg-white/5 transition-all group"
                                    >
                                        <span className="text-base font-bold uppercase tracking-wide text-gray-400 group-hover:text-white">
                                            {page.name}
                                        </span>
                                        <span className="text-base text-gray-600 uppercase font-mono mt-0.5">{page.id}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "flex items-center justify-center w-12 h-12 rounded-full shadow-[0_0_20px_rgba(0,0,0,0.5)] transition-colors border",
                    isOpen ? "bg-[var(--rhive-pink)] text-white border-[var(--rhive-pink)]" : "bg-black/80 backdrop-blur-md text-gray-400 hover:text-[var(--rhive-pink)] border-white/10 hover:border-[var(--rhive-pink)]/50"
                )}
            >
                {isOpen ? <X size={20} /> : <Settings size={20} />}
            </motion.button>
        </div>
    );
};
