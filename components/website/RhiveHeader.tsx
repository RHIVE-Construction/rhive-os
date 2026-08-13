import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Menu, X, User } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useNavigation } from '../../contexts/NavigationContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useMockDB } from '../../contexts/MockDatabaseContext';
import PlexusShape from '../PlexusShape';
import { getPathForPageId } from '../../lib/routing';




const RhiveHeader: React.FC = () => {
    const { setActivePageId, activePageId, lastPortalPageId } = useNavigation();
    const { setTheme, theme } = useTheme();
    const { logout, currentUser, login } = useMockDB();
    const isDark = theme === 'dark';

    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const [isProfileOpen, setIsProfileOpen] = React.useState(false);


    const handleExit = () => {
        if (lastPortalPageId) {
            setActivePageId(lastPortalPageId);
        } else if (currentUser) {
            switch (currentUser.role) {
                case 'Employee': setActivePageId('E-01'); break;
                case 'Customer': setActivePageId('C-01'); break;
                case 'Contractor': setActivePageId('CO-01'); break;
                case 'Supplier': setActivePageId('S-01'); break;
                case 'Admin': setActivePageId('E-01'); break;
                case 'Super Admin': setActivePageId('E-01'); break;
                default: logout();
            }
        } else {
            logout();
        }
    };

    const currentHomeId = (activePageId === 'P-00' || activePageId === 'P-00-V2' || activePageId === 'P-00-V3')
        ? activePageId
        : (sessionStorage.getItem('lastHomepageId') || 'P-00-V3');

    const navLinks = currentHomeId === 'P-00-V3'
        ? [
            { label: 'ABOUT US', target: 'about' },
            { label: 'SERVICES', target: 'services' },
            { label: 'PROCESS', target: 'process' },
            { label: 'FINANCING', target: 'financing' },
            { label: 'CAREERS', target: 'careers' },
            { label: 'CONTACT', target: 'contact' },
          ]
        : [
            { label: 'ABOUT', target: 'about' },
            { label: 'SERVICES', target: 'services' },
            { label: 'PROCESS', target: 'process' },
            { label: 'FINANCING', target: 'financing' },
            { label: 'INSURANCE', target: 'insurance' },
            { label: 'FAQ', target: 'faq' },
            { label: 'CONTACT', target: 'contact' },
          ];

    const TARGET_TO_PAGE_ID: Record<string, string> = {
        'about': 'P-01',
        'services': 'P-02',
        'process': 'P-03',
        'financing': 'P-04',
        'careers': 'P-10',
        'contact': 'P-05',
        'insurance': 'P-13',
        'faq': 'P-15',
    };

    const getPagePath = (target: string): string => {
        const pageId = TARGET_TO_PAGE_ID[target];
        return pageId ? getPathForPageId(pageId) : '/';
    };

    const handleLinkClick = (target: string) => {
        const pageId = TARGET_TO_PAGE_ID[target];
        if (pageId) {
            setActivePageId(pageId);
        } else {
            setActivePageId('P-00-V3');
        }
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-[500] h-12 flex items-center px-4 md:px-12 transition-all duration-300">
            {/* Custom High-Fidelity Metallic Styling */}
            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes headerSheen {
                    0% { transform: translateX(-150%) skewX(-30deg); }
                    35%, 100% { transform: translateX(150%) skewX(-30deg); }
                }
                @keyframes metalSweep {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                .animate-header-sheen {
                    animation: headerSheen 7s infinite ease-in-out;
                }
                .btn-metal-sweep:hover .metal-sweep-element {
                    animation: metalSweep 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
                }
            `}} />

            {/* 1. Header Glass Chassis (Full Width, Ultra-Subtle Gradient) */}
            <div className="absolute top-0 left-0 right-0 h-12 bg-black/85 backdrop-blur-md pointer-events-none border-b border-white/10 overflow-hidden shadow-[0_2px_20px_rgba(0,0,0,0.8)]">
                {/* Slow metallic ray sweeping horizontally */}
                <div className="absolute inset-y-0 -left-1/2 w-1/3 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent animate-header-sheen" />
            </div>

            {/* Mobile Hamburger Button */}
            <div className="absolute left-4 md:left-10 lg:hidden z-20 flex items-center">
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="p-2 rounded-full border border-white/10 hover:border-rhive-pink/50 transition-all text-white/80 hover:text-rhive-pink bg-black/60 outline-none animate-pulse-glow"
                >
                    {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
                </button>
            </div>

            {/* 2. Central Logo Chassis (The Notch) */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[180px] md:w-[320px] h-[65px] md:h-[95px] bg-black/90 backdrop-blur-xl rounded-b-[20px] md:rounded-b-[36px] pointer-events-none border-x border-b border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.9)] overflow-hidden">
                {/* Metallic light beam reflection sweeping the capsule notch */}
                <div className="absolute inset-y-0 -left-1/2 w-1/2 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent animate-header-sheen" style={{ animationDelay: '1.5s' }} />
                
                {/* Glowing tech neon circuit highlight at the bottom edge */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 md:w-28 h-[1.5px] bg-gradient-to-r from-transparent via-rhive-pink to-transparent drop-shadow-[0_0_8px_rgba(236,2,139,0.9)]" />
            </div>

            {/* Desktop Navigation Links (Left side of notch) */}
            <nav className="hidden lg:flex flex-1 justify-end items-center gap-8 z-10 ml-[180px]">
                {navLinks.slice(0, 3).map((link) => (
                    <a
                        key={link.target}
                        href={getPagePath(link.target)}
                        onClick={(e) => {
                            e.preventDefault();
                            handleLinkClick(link.target);
                        }}
                        className="text-[9px] font-black tracking-[0.18em] uppercase text-slate-300 hover:text-rhive-pink transition-colors duration-300 cursor-pointer"
                    >
                        {link.label}
                    </a>
                ))}
            </nav>
 
            {/* Center Spacer to keep navigation links clear of the notch */}
            <div className="hidden lg:block w-[360px] shrink-0" />
 
            {/* Desktop Navigation Links (Right side of notch) */}
            <nav className="hidden lg:flex flex-1 justify-start items-center gap-8 z-10 mr-[180px]">
                {navLinks.slice(3).map((link) => (
                    <a
                        key={link.target}
                        href={getPagePath(link.target)}
                        onClick={(e) => {
                            e.preventDefault();
                            handleLinkClick(link.target);
                        }}
                        className="text-[9px] font-black tracking-[0.18em] uppercase text-slate-300 hover:text-rhive-pink transition-colors duration-300 cursor-pointer"
                    >
                        {link.label}
                    </a>
                ))}
            </nav>

            {/* CENTRAL LOGO (Absolute Alignment for Perfect Spacing) */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[180px] md:w-[280px] h-[75px] md:h-[110px] flex items-center justify-center z-20 pointer-events-none">
                <motion.a
                    href="/"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                        e.preventDefault();
                        setIsMenuOpen(false);
                        if (currentHomeId === 'P-00-V2') {
                            setActivePageId('P-00-V2');
                        } else {
                            setActivePageId('P-00-V3');
                        }
                    }}
                    className="relative flex items-center justify-center mt-0 md:mt-1 pointer-events-auto cursor-pointer"
                >
                    <img
                        src="https://i.imgur.com/t0VcSgJ.png"
                        alt="RHIVE Logo"
                        className="h-[50px] md:h-[80px] w-auto object-contain transition-opacity duration-300 drop-shadow-[0_0_8px_rgba(255,255,255,0.25)]"
                    />
                </motion.a>
            </div>

            {/* THEME & PHONE CONTROLS (Far Right Symmetrical absolute alignment) */}
            <div className="absolute right-4 md:right-10 flex items-center gap-2 md:gap-4 z-10">
                <div className="hidden md:block h-6 w-[1px] bg-white/20 mr-2" />
                <button
                    onClick={() => setTheme(isDark ? 'light' : 'dark')}
                    className="p-2 md:p-2.5 rounded-full hover:text-rhive-pink transition-all group relative border border-white/10 hover:border-rhive-pink/50 bg-black/60 text-white/80"
                    title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
                >
                    <div className="relative w-4 h-4 md:w-5 md:h-5 flex items-center justify-center">
                        <motion.div
                            initial={false}
                            animate={{ scale: isDark ? 0 : 1, rotate: isDark ? 90 : 0, opacity: isDark ? 0 : 1 }}
                            className="absolute"
                        >
                            <Sun size={16} />
                        </motion.div>
                        <motion.div
                            initial={false}
                            animate={{ scale: isDark ? 1 : 0, rotate: isDark ? 0 : -90, opacity: isDark ? 1 : 0 }}
                            className="absolute"
                        >
                            <Moon size={16} />
                        </motion.div>
                    </div>
                </button>

                <motion.a
                    href="tel:8887448301"
                    whileHover={{ scale: 1.1, color: '#ec028b' }}
                    className="p-2 md:p-2.5 rounded-full border border-white/10 hover:border-rhive-pink/50 transition-all text-rhive-pink bg-[#000000]/60"
                    title="Call Us"
                >
                    <svg viewBox="0 0 24 24" width="16" height="16" className="md:w-5 md:h-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                </motion.a>

                <motion.a
                    href="/login"
                    onClick={(e) => {
                        e.preventDefault();
                        setIsMenuOpen(false);
                        setActivePageId('P-06');
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 md:p-2.5 rounded-full border border-white/10 hover:border-rhive-pink/50 transition-all text-white/70 hover:text-rhive-pink bg-[#000000]/60 cursor-pointer"
                    title="Sign In / Portal"
                >
                    <User size={16} />
                </motion.a>
            </div>

            {/* Mobile Menu Drawer */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-x-0 top-12 bottom-0 z-[490] bg-black/95 backdrop-blur-2xl border-b border-white/10 flex flex-col justify-center items-center py-20 px-8 lg:hidden"
                    >
                        {/* Universal Dark Pink Plexus Background */}
                        <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
                            <PlexusShape
                                backgroundColor="#000000"
                                dotColor="#ec028b"
                                lineColor="236, 2, 139"
                                density={30}
                                className="h-full w-full relative z-0"
                            />
                        </div>
                        <div className="relative z-10 flex flex-col items-center gap-6 w-full max-w-sm">
                            {navLinks.map((link) => (
                                <a
                                    key={link.target}
                                    href={getPagePath(link.target)}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setIsMenuOpen(false);
                                        handleLinkClick(link.target);
                                    }}
                                    className="text-base font-black tracking-[0.2em] uppercase text-slate-300 hover:text-rhive-pink transition-colors duration-300 w-full py-4 border-b border-white/5 hover:border-rhive-pink/30 text-center cursor-pointer"
                                >
                                    {link.label}
                                </a>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default RhiveHeader;
