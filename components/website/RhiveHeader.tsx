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
                default: logout();
            }
        } else {
            logout();
        }
    };

    const handleRoleSwitch = async (role: string) => {
        setIsProfileOpen(false);
        const res = await login(role, 'bypass');
        if (res && res.success) {
            switch (role) {
                case 'Employee': setActivePageId('E-01'); break;
                case 'Customer': setActivePageId('C-01'); break;
                case 'Contractor': setActivePageId('CO-01'); break;
                case 'Supplier': setActivePageId('S-01'); break;
                case 'Admin': setActivePageId('E-01'); break;
                case 'Super Admin': setActivePageId('E-01'); break;
            }
        }
    };

    const publicPages = [
        { id: 'P-00', name: 'Home', desc: 'RHIVE Main Gateway' },
        { id: 'P-01', name: 'About Us', desc: 'Mission, Vision & Values' },
        { id: 'P-02', name: 'Our Services', desc: 'Residential & Commercial Solutions' },
        { id: 'P-03', name: 'Our Process', desc: 'The 10-Stage Journey' },
        { id: 'P-08', name: 'Financing', desc: 'RPSP & Payment Options' },
        { id: 'P-05', name: 'Contact', desc: 'Directory & Lead Gen' },
        { id: 'P-09', name: 'Contractor Signup', desc: 'Vendor Vetting & Onboarding' },
        { id: 'P-10', name: 'Public Careers', desc: 'Recruitment & Brand Manifesto' },
        { id: 'P-11', name: 'Job Application', desc: 'Candidate Intake Wizard' },
        { id: 'P-12', name: 'Estimate Tool', desc: 'Instant Pricing Engine' },
        { id: 'P-13', name: 'Insurance', desc: 'Insurance Protection' },
    ];

    const roles = ['Admin', 'Employee', 'Customer', 'Contractor', 'Supplier'] as const;

    const leftLinks = [
        { label: 'SERVICES', target: 'services' },
        { label: 'ABOUT US', target: 'about' }
    ];

    const rightLinks = [
        { label: 'FINANCING', target: 'financing' }
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

        if (activePageId !== 'P-00' && activePageId !== 'P-01') {
            setActivePageId('P-00');
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
        <>
        <header className="fixed top-0 left-0 right-0 z-[500] h-12 flex items-center px-12 transition-all duration-300 select-none">

            {/* 1. Header Glass Chassis (Full Width, Ultra-Subtle Gradient) */}
            <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-black/40 to-transparent pointer-events-none border-b border-white/5" />

            {/* EXIT / MENU CONTROLS (Far Left) */}
            <div className="absolute left-10 flex items-center gap-4 z-30 pointer-events-auto">
                {currentUser && (
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleExit}
                        className="flex items-center gap-2 px-4 py-2 border border-white/10 hover:border-rhive-pink/40 bg-black/40 hover:bg-black/60 rounded-full text-white/80 hover:text-white transition-all shadow-[0_0_15px_rgba(0,0,0,0.3)]"
                    >
                        <LogOut size={14} className="text-rhive-pink group-hover:-translate-x-1 transition-transform" />
                        <span className="text-[9px] font-black tracking-[0.2em] uppercase">Exit to Portal</span>
                    </motion.button>
                )}
                
                {/* Website Menu Trigger */}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsMenuOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 border border-white/10 hover:border-rhive-pink/40 bg-black/40 hover:bg-black/60 rounded-full text-white/80 hover:text-white transition-all shadow-[0_0_15px_rgba(0,0,0,0.3)]"
                >
                    <Menu size={14} className="text-rhive-pink" />
                    <span className="text-[9px] font-black tracking-[0.2em] uppercase">Website Menu</span>
                </motion.button>
            </div>

            <nav className="flex-1 flex justify-end gap-6 z-10">
                {leftLinks.map((link) => (
                    <button
                        key={link.target}
                        onClick={() => scrollToSection(link.target)}
                        className="text-base font-black tracking-[0.3em] uppercase text-white/50 hover:text-rhive-pink transition-colors"
                    >
                        {link.label}
                    </button>
                ))}
            </nav>

            {/* CENTRAL LOGO (Absolute Alignment for Perfect Spacing) */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[240px] h-16 flex items-center justify-center z-20 pointer-events-auto">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                        setActivePageId('P-00');
                        window.dispatchEvent(new CustomEvent('rhive-virtual-nav', { detail: { page: 'home' } }));
                    }}
                    className="relative flex items-center justify-center"
                >
                    <img
                        src="https://i.imgur.com/t0VcSgJ.png"
                        alt="RHIVE Logo"
                        className="h-16 w-auto object-contain transition-opacity duration-300 drop-shadow-[0_0_10px_rgba(255,255,255,0.25)]"
                    />
                </motion.button>
            </div>
            {/* Empty spacer to keep nav links apart */}
            <div className="mx-16 w-[140px] shrink-0" />

            <nav className="flex-1 flex justify-start gap-6 items-center z-10">
                {rightLinks.map((link) => (
                    <button
                        key={link.target}
                        onClick={() => scrollToSection(link.target)}
                        className="text-base font-black tracking-[0.3em] uppercase text-white/50 hover:text-rhive-pink transition-colors"
                    >
                        {link.label}
                    </button>
                ))}


                <div className="flex items-center gap-3 relative">
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
                                <Sun size={18} />
                            </motion.div>
                            <motion.div
                                initial={false}
                                animate={{ scale: isDark ? 1 : 0, rotate: isDark ? 0 : -90, opacity: isDark ? 1 : 0 }}
                                className="absolute"
                            >
                                <Moon size={18} />
                            </motion.div>
                        </div>
                    </button>



                    <motion.a
                        href="tel:8887448301"
                        whileHover={{ scale: 1.1, color: '#ec028b' }}
                        className="p-2.5 rounded-full border border-transparent hover:border-rhive-pink/50 transition-all text-rhive-pink bg-black/50"
                        title="Call Us"
                    >
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                        </svg>
                    </motion.a>

                    {/* AVATAR / PROFILE BUTTON */}
                    <button
                        onClick={() => {
                            if (!currentUser) {
                                setActivePageId('P-06');
                            } else {
                                setIsProfileOpen(!isProfileOpen);
                            }
                        }}
                        className={cn(
                            "w-9 h-9 rounded-full flex items-center justify-center border transition-all pointer-events-auto bg-black/50 text-white/80 hover:brightness-110",
                            isProfileOpen ? "border-rhive-pink text-rhive-pink shadow-[0_0_12px_rgba(236,2,139,0.3)] scale-105" : "border-white/10 hover:border-rhive-pink/50"
                        )}
                        title={currentUser ? `Profile: ${currentUser.name}` : "Developer Quick Login"}
                    >
                        {currentUser?.avatarUrl ? (
                            <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-full h-full rounded-full object-cover" />
                        ) : (
                            <User size={16} />
                        )}
                    </button>

                    {/* ROLE SWITCHER DROPDOWN */}
                    {isProfileOpen && (
                        <>
                            <div className="fixed inset-0 z-[498]" onClick={() => setIsProfileOpen(false)} />
                            <div 
                                className="absolute right-0 top-12 w-60 bg-black/95 backdrop-blur-xl border border-rhive-pink/40 shadow-[0_0_25px_rgba(236,2,139,0.25)] rounded-xl p-4 flex flex-col z-[499] text-left animate-fade-in gap-3"
                                style={{
                                    clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)'
                                }}
                            >
                                <div className="border-b border-white/10 pb-2">
                                    <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest block">SESSION ACCOUNT</span>
                                    {currentUser ? (
                                        <div className="mt-1">
                                            <div className="text-xs font-black uppercase text-white truncate">{currentUser.name}</div>
                                            <div className="text-[9px] font-mono text-rhive-pink uppercase mt-0.5">{currentUser.role} Portal</div>
                                        </div>
                                    ) : (
                                        <div className="mt-1">
                                            <div className="text-xs font-black uppercase text-gray-400">Public Guest</div>
                                            <div className="text-[9px] font-mono text-gray-600 uppercase mt-0.5">Unauthenticated</div>
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col gap-1">
                                    <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest block mb-1">DEVELOPER BYPASS</span>
                                    {roles.map(r => (
                                        <button
                                            key={r}
                                            onClick={() => handleRoleSwitch(r)}
                                            className={cn(
                                                "w-full px-3 py-1.5 rounded-lg border text-[9px] font-extrabold uppercase tracking-widest text-left transition-all",
                                                currentUser?.role === r
                                                    ? "bg-rhive-pink/20 border-rhive-pink/40 text-white shadow-[0_0_8px_rgba(236,2,139,0.2)]"
                                                    : "bg-white/5 border-transparent text-gray-400 hover:bg-white/10 hover:text-white"
                                            )}
                                        >
                                            {r} Portal
                                        </button>
                                    ))}
                                </div>

                                <div className="border-t border-white/10 pt-2 flex flex-col gap-1">
                                    <button
                                        onClick={() => {
                                            setIsProfileOpen(false);
                                            setActivePageId('P-00');
                                        }}
                                        className={cn(
                                            "w-full px-3 py-1.5 rounded-lg border text-[9px] font-extrabold uppercase tracking-widest text-left transition-all",
                                            activePageId.startsWith('P-') && activePageId !== 'P-06'
                                                ? "bg-rhive-blue/20 border-rhive-blue/40 text-white"
                                                : "bg-white/5 border-transparent text-gray-400 hover:bg-white/10 hover:text-white"
                                        )}
                                    >
                                        Public Website
                                    </button>
                                    
                                    {currentUser ? (
                                        <button
                                            onClick={() => {
                                                setIsProfileOpen(false);
                                                logout();
                                            }}
                                            className="w-full px-3 py-1.5 bg-red-950/20 hover:bg-red-900/35 border border-red-900/40 hover:border-red-500/50 rounded-lg text-[9px] font-extrabold uppercase tracking-widest text-red-400 text-left transition-all"
                                        >
                                            Sign Out
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => {
                                                setIsProfileOpen(false);
                                                setActivePageId('P-06');
                                            }}
                                            className="w-full px-3 py-1.5 bg-rhive-pink/25 hover:bg-rhive-pink/35 border border-rhive-pink/40 hover:border-rhive-pink/60 rounded-lg text-[9px] font-extrabold uppercase tracking-widest text-white text-left transition-all shadow-[0_0_10px_rgba(236,2,139,0.15)]"
                                        >
                                            Standard Login
                                        </button>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </nav>

            {/* PUBLIC MENU DRAWER (Slide-out) */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-[9999] flex select-none pointer-events-auto">
                    {/* Backdrop */}
                    <div 
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
                        onClick={() => setIsMenuOpen(false)}
                    />
                    
                    {/* Drawer Content */}
                    <div 
                        className="relative w-80 h-full bg-black/90 backdrop-blur-xl border-r border-rhive-pink/30 shadow-[0_0_50px_rgba(236,2,139,0.25)] flex flex-col pt-6 animate-fade-in"
                        style={{
                            clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0 100%)'
                        }}
                    >
                        {/* Interactive Plexus background in the drawer */}
                        <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
                            <PlexusShape
                                backgroundColor="transparent"
                                dotColor="#ec028b"
                                lineColor="236, 2, 139"
                                density={30}
                                className="w-full h-full"
                            />
                        </div>
                        
                        <div className="relative z-10 flex items-center justify-between px-6 pb-4 border-b border-white/10">
                            <div className="flex items-center gap-2">
                                <img
                                    src="https://i.imgur.com/t0VcSgJ.png"
                                    alt="RHIVE Logo"
                                    className="h-6 w-auto object-contain"
                                />
                                <span className="text-[9px] font-black tracking-[0.2em] text-white/50 uppercase">DIRECTORY</span>
                            </div>
                            <button 
                                onClick={() => setIsMenuOpen(false)}
                                className="p-1.5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                            >
                                <X size={16} />
                            </button>
                        </div>
                        
                        <div className="relative z-10 flex-1 overflow-y-auto py-6 px-4 space-y-1.5 scrollbar-hide">
                            {publicPages.map(page => (
                                <button
                                    key={page.id}
                                    onClick={() => {
                                        setActivePageId(page.id);
                                        setIsMenuOpen(false);
                                    }}
                                    className={cn(
                                        "w-full flex flex-col items-start px-4 py-2.5 rounded-xl border transition-all text-left group",
                                        activePageId === page.id
                                            ? "bg-rhive-pink/15 border-rhive-pink/40 text-white shadow-[0_0_15px_rgba(236,2,139,0.15)]"
                                            : "bg-white/5 border-transparent text-gray-400 hover:bg-white/10 hover:text-white hover:border-white/10"
                                    )}
                                >
                                    <span className="text-[11px] font-extrabold uppercase tracking-widest">{page.name}</span>
                                    <span className="text-[8px] font-mono text-gray-500 uppercase group-hover:text-gray-400 mt-0.5">{page.id} • {page.desc}</span>
                                </button>
                            ))}
                        </div>
                        
                        <div className="relative z-10 p-6 border-t border-white/5 bg-black/40 text-center">
                            <p className="text-[8px] font-mono text-gray-600 uppercase tracking-widest">
                                RHIVE OS • PUBLIC GATEWAY
                            </p>
                        </div>
                    </div>
                </div>
            )}


        </header>


        </>
    );
};

export default RhiveHeader;
