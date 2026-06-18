import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, LogOut, Menu, X, User } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useNavigation } from '../../contexts/NavigationContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useMockDB } from '../../contexts/MockDatabaseContext';
import PlexusShape from '../PlexusShape';




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
                default: setActivePageId('P-06'); break;
            }
        } else {
            setActivePageId('P-06');
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

    const scrollToSection = (id: string) => {
        if (id === 'hero' || id === 'about') {
            window.dispatchEvent(new CustomEvent('rhive-virtual-nav', { detail: { page: 'about' } }));
            return;
        }
        if (id === 'services') {
            window.dispatchEvent(new CustomEvent('rhive-virtual-nav', { detail: { page: 'roofing' } }));
            return;
        }
        if (id === 'process' || id === 'financing' || id === 'faq' || id === 'contact') {
            window.dispatchEvent(new CustomEvent('rhive-virtual-nav', { detail: { page: 'home' } }));
            setTimeout(() => {
                const element = document.getElementById(id);
                element?.scrollIntoView({ behavior: 'smooth' });
            }, 150);
            return;
        }

        // Standard scrolling logic for live mode / external pages
        if (activePageId !== 'P-00' && activePageId !== 'P-00-V2' && activePageId !== 'P-00-V3' && activePageId !== 'P-01') {
            setActivePageId('P-00-V3');
            // Give it a moment to mount before scrolling
            setTimeout(() => {
                const element = document.getElementById(id);
                element?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } else {
            let targetId = id;
            if (activePageId === 'P-00-V2') {
                if (id === 'about') targetId = 'hero-d';
                else if (id === 'services') targetId = 'protection-s';
                else if (id === 'process') targetId = 'vision-i';
                else if (id === 'financing') targetId = 'tech-c';
            }
            const element = document.getElementById(targetId);
            element?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleLinkClick = (id: string) => {
        if (activePageId === 'P-00-V3') {
            if (id === 'contact') {
                const element = document.getElementById('contact');
                element?.scrollIntoView({ behavior: 'smooth' });
            } else {
                window.dispatchEvent(new CustomEvent('v3-open-lightbox', { detail: id }));
            }
        } else if (currentHomeId === 'P-00-V3') {
            setActivePageId('P-00-V3');
            setTimeout(() => {
                if (id === 'contact') {
                    const element = document.getElementById('contact');
                    element?.scrollIntoView({ behavior: 'smooth' });
                } else {
                    window.dispatchEvent(new CustomEvent('v3-open-lightbox', { detail: id }));
                }
            }, 150);
        } else {
            scrollToSection(id);
        }
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-[500] h-12 flex items-center px-12 transition-all duration-300">
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

            {/* 2. Central Logo Chassis (The Notch) */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[320px] h-[95px] bg-black/90 backdrop-blur-xl rounded-b-[36px] pointer-events-none border-x border-b border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.9)] overflow-hidden">
                {/* Metallic light beam reflection sweeping the capsule notch */}
                <div className="absolute inset-y-0 -left-1/2 w-1/2 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent animate-header-sheen" style={{ animationDelay: '1.5s' }} />
                
                {/* Glowing tech neon circuit highlight at the bottom edge */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-28 h-[1.5px] bg-gradient-to-r from-transparent via-rhive-pink to-transparent drop-shadow-[0_0_8px_rgba(236,2,139,0.9)]" />
            </div>

            {/* EXIT BUTTON (Far Left) — only shown when logged in */}
            {currentUser && (
                <div className="absolute left-10 flex items-center gap-6 z-10">
                    <button
                        onClick={handleExit}
                        className="flex items-center gap-2 text-[10px] font-black tracking-[0.2em] uppercase text-slate-300 hover:text-rhive-pink transition-colors duration-300"
                    >
                        <LogOut size={13} className="text-rhive-pink shrink-0" />
                        <span>Exit to Portal</span>
                    </button>
                </div>
            )}

            <nav className="flex-1 flex justify-end items-center gap-8 z-10 ml-[180px]">
                {navLinks.slice(0, 3).map((link) => (
                    <button
                        key={link.target}
                        onClick={() => handleLinkClick(link.target)}
                        className="text-[9px] font-black tracking-[0.18em] uppercase text-slate-300 hover:text-rhive-pink transition-colors duration-300"
                    >
                        {link.label}
                    </button>
                ))}
            </nav>
 
            {/* Center Spacer to keep navigation links clear of the notch */}
            <div className="w-[360px] shrink-0" />
 
            <nav className="flex-1 flex justify-start items-center gap-8 z-10 mr-[180px]">
                {navLinks.slice(3).map((link) => (
                    <button
                        key={link.target}
                        onClick={() => handleLinkClick(link.target)}
                        className="text-[9px] font-black tracking-[0.18em] uppercase text-slate-300 hover:text-rhive-pink transition-colors duration-300"
                    >
                        {link.label}
                    </button>
                ))}
            </nav>

            {/* CENTRAL LOGO (Absolute Alignment for Perfect Spacing) */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[280px] h-[110px] flex items-center justify-center z-20 pointer-events-none">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                        if (currentHomeId === 'P-00-V3') {
                            setActivePageId('P-00-V3');
                        } else if (currentHomeId === 'P-00-V2') {
                            setActivePageId('P-00-V2');
                        } else {
                            setActivePageId('P-00-V3');
                        }
                    }}
                    className="relative flex items-center justify-center mt-1 pointer-events-auto"
                >
                    <img
                        src="https://i.imgur.com/t0VcSgJ.png"
                        alt="RHIVE Logo"
                        className="h-[80px] w-auto object-contain transition-opacity duration-300 drop-shadow-[0_0_8px_rgba(255,255,255,0.25)]"
                    />
                </motion.button>
            </div>

            {/* THEME & PHONE CONTROLS (Far Right Symmetrical absolute alignment) */}
            <div className="absolute right-10 flex items-center gap-4 z-10">
                <div className="h-6 w-[1px] bg-white/20 mr-2" />
                <button
                    onClick={() => setTheme(isDark ? 'light' : 'dark')}
                    className="p-2.5 rounded-full hover:text-rhive-pink transition-all group relative border border-white/10 hover:border-rhive-pink/50 bg-black/60 text-white/80"
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
                    className="p-2.5 rounded-full border border-white/10 hover:border-rhive-pink/50 transition-all text-rhive-pink bg-[#000000]/60"
                    title="Call Us"
                >
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                </motion.a>

                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleExit}
                    className="p-2.5 rounded-full border border-white/10 hover:border-rhive-pink/50 transition-all text-white/70 hover:text-rhive-pink bg-[#000000]/60"
                    title={currentUser ? `Portal — ${currentUser.name}` : 'Sign In to Portal'}
                >
                    {currentUser?.avatarUrl ? (
                        <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-5 h-5 rounded-full object-cover" />
                    ) : (
                        <User size={20} />
                    )}
                </motion.button>
            </div>

        </header>
    );
};

export default RhiveHeader;
