
import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, LogOut } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useNavigation } from '../../contexts/NavigationContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useMockDB } from '../../contexts/MockDatabaseContext';

const RhiveHeader: React.FC = () => {
    const { setActivePageId, activePageId, lastPortalPageId } = useNavigation();
    const { setTheme, theme } = useTheme();
    const { logout, currentUser } = useMockDB();
    const isDark = theme === 'dark';

    const handleExit = () => {
        if (lastPortalPageId) {
            setActivePageId(lastPortalPageId);
        } else if (currentUser) {
            // Fallback dashboard based on role
            switch (currentUser.role) {
                case 'Employee': setActivePageId('E-01'); break;
                case 'Customer': setActivePageId('C-01'); break;
                case 'Contractor': setActivePageId('CO-01'); break;
                case 'Supplier': setActivePageId('S-01'); break;
                default: logout();
            }
        } else {
            logout();
        }
    };

    const navLinks = [
        { label: 'ABOUT', target: 'hero' },
        { label: 'SERVICES', target: 'services' },
        { label: 'PROCESS', target: 'process' },
        { label: 'FINANCING', target: 'financing' },
        { label: 'INSURANCE', target: 'insurance' },
        { label: 'FAQ', target: 'faq' },
        { label: 'CONTACT', target: 'contact' },
    ];

    const scrollToSection = (id: string) => {
        // If we are not on the homepage, navigate there first
        if (activePageId !== 'P-00' && activePageId !== 'P-01') {
            setActivePageId('P-00');
            // Give it a moment to mount before scrolling
            setTimeout(() => {
                const element = document.getElementById(id);
                element?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } else {
            const element = document.getElementById(id);
            element?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-[500] h-12 flex items-center px-12 transition-all duration-300">

            {/* 1. Header Glass Chassis (Full Width, Ultra-Subtle Gradient) */}
            <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-black/40 to-transparent backdrop-blur-sm pointer-events-none border-b border-white/5" />

            {/* 2. Central Logo Chassis (The Notch) */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[320px] h-[100px] bg-black/60 backdrop-blur-xl rounded-b-[40px] pointer-events-none border-x border-b border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.5)]" />

            {/* EXIT BUTTON (Far Left) */}
            <div className="absolute left-10 flex items-center gap-6 z-10">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleExit}
                    className="flex items-center gap-3 px-5 py-2.5 border-transparent group hover:border-rhive-pink/30 transition-all bg-transparent"
                >
                    <LogOut size={16} className="text-rhive-pink group-hover:-translate-x-1 transition-transform" />
                    <span className="text-[10px] font-black tracking-[0.3em] uppercase opacity-70 group-hover:opacity-100 transition-opacity text-white">Exit to Portal</span>
                </motion.button>
            </div>

            <nav className="flex-1 flex justify-end gap-6 z-10">
                {navLinks.slice(0, 3).map((link) => (
                    <button
                        key={link.target}
                        onClick={() => scrollToSection(link.target)}
                        className="text-[11px] font-black tracking-[0.3em] uppercase text-white/50 hover:text-rhive-pink transition-colors"
                    >
                        {link.label}
                    </button>
                ))}
            </nav>

            {/* CENTRAL LOGO (Absolute Alignment for Perfect Spacing) */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[280px] h-[110px] flex items-center justify-center z-20 pointer-events-auto">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActivePageId('P-00')}
                    className="relative flex items-center justify-center mt-1"
                >
                    <img
                        src="https://i.imgur.com/t0VcSgJ.png"
                        alt="RHIVE Logo"
                        className="h-[80px] w-auto object-contain transition-opacity duration-300 drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]"
                    />
                </motion.button>
            </div>
            {/* Empty spacer to keep nav links apart */}
            <div className="mx-16 w-[140px] shrink-0" />

            <nav className="flex-1 flex justify-start gap-6 items-center z-10">
                {navLinks.slice(3).map((link) => (
                    <button
                        key={link.target}
                        onClick={() => scrollToSection(link.target)}
                        className="text-[11px] font-black tracking-[0.3em] uppercase text-white/50 hover:text-rhive-pink transition-colors"
                    >
                        {link.label}
                    </button>
                ))}

                <div className="h-6 w-[1px] bg-white/20 mx-4" />

                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setTheme(isDark ? 'light' : 'dark')}
                        className="p-2.5 rounded-full hover:text-rhive-pink transition-all group relative border border-transparent hover:border-rhive-pink/50 bg-black/50 text-white/80"
                        title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
                    >
                        <div className="relative w-5 h-5 flex items-center justify-center">
                            <motion.div
                                initial={false}
                                animate={{ scale: isDark ? 0 : 1, rotate: isDark ? 90 : 0, opacity: isDark ? 0 : 1 }}
                                className="absolute"
                            >
                                <Sun size={20} />
                            </motion.div>
                            <motion.div
                                initial={false}
                                animate={{ scale: isDark ? 1 : 0, rotate: isDark ? 0 : -90, opacity: isDark ? 1 : 0 }}
                                className="absolute"
                            >
                                <Moon size={20} />
                            </motion.div>
                        </div>
                    </button>

                    <motion.a
                        href="tel:8887448301"
                        whileHover={{ scale: 1.1, color: '#ec028b' }}
                        className="p-2.5 rounded-full border border-transparent hover:border-rhive-pink/50 transition-all text-rhive-pink bg-black/50"
                        title="Call Us"
                    >
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                        </svg>
                    </motion.a>
                </div>
            </nav>
        </header>
    );
};

export default RhiveHeader;
