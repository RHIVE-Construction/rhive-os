
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Gauge,
    X,
    ChevronRight,
    Home,
    CheckCircle2,
    MapPin,
    ArrowRight,
    Search,
    Zap,
    MessageSquare,
    Send,
    Bot
} from 'lucide-react';
import { cn } from '../lib/utils';

type Step = 'address' | 'specs' | 'lead' | 'result' | 'chat';

export const FloatingEstimator: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState<Step>('address');
    const [address, setAddress] = useState('');
    const [activeProtocol, setActiveProtocol] = useState<string | null>(null);

    React.useEffect(() => {
        const handleOpen = (e: any) => {
            setActiveProtocol(e.detail?.protocol || null);
            setIsOpen(true);
            setStep('address');
        };
        window.addEventListener('open-estimator', handleOpen);
        return () => window.removeEventListener('open-estimator', handleOpen);
    }, []);

    const steps = [
        { id: 'address', label: 'Identity' },
        { id: 'specs', label: 'Specs' },
        { id: 'lead', label: 'Lead' },
        { id: 'result', label: 'Quote' }
    ];

    const toggleDrawer = () => {
        setIsOpen(!isOpen);
        if (!isOpen) setStep('address');
    };

    return (
        <>
            {/* 1. SIDE TAB BUTTON */}
            <motion.button
                onClick={() => {
                    setStep('chat');
                    setIsOpen(true);
                }}
                whileHover={{ scale: 1.05, x: -10 }}
                whileTap={{ scale: 0.95 }}
                className="fixed right-0 top-1/2 -translate-y-1/2 z-[600] flex items-center gap-3 bg-[var(--rhive-bg)] text-[var(--rhive-text)] px-4 py-10 rounded-l-3xl shadow-[0_20px_60px_rgba(236,2,139,0.4)] hover:shadow-pink-glow transition-all group overflow-hidden border border-[var(--rhive-border)] outline-none"
                initial={{ x: 100 }}
                animate={{ x: 0 }}
                transition={{ type: 'spring', damping: 20, stiffness: 100 }}
            >
                <div className="absolute inset-0 bg-gradient-to-br from-rhive-pink/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex flex-col items-center gap-2 relative z-10">
                    <Zap size={20} className="text-rhive-pink animate-pulse" />
                    <span className="[writing-mode:vertical-lr] font-black text-[10px] uppercase tracking-[0.6em] rotate-180">
                        System Scan
                    </span>
                </div>
            </motion.button>

            {/* 2. OVERLAY */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[700]"
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
                        className="fixed top-0 right-0 h-full w-full max-w-lg bg-[var(--rhive-bg)] z-[800] shadow-[-40px_0_80px_rgba(0,0,0,0.8)] border-l border-[var(--rhive-border)] overflow-hidden flex flex-col pt-12"
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300, mass: 0.8 }}
                    >
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-rhive-pink/10">
                            <motion.div
                                className="h-full bg-rhive-pink shadow-pink-glow"
                                initial={{ width: "0%" }}
                                animate={{
                                    width: step === 'address' ? '25%' :
                                        step === 'specs' ? '50%' :
                                            step === 'lead' ? '75%' : '100%'
                                }}
                            />
                        </div>

                        {/* Header */}
                        <div className="p-10 flex justify-between items-center border-b border-[var(--rhive-border)] relative bg-[var(--rhive-bg)]/50">
                            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-rhive-pink/50 to-transparent" />
                            <div className="flex flex-col">
                                <motion.span
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="text-rhive-pink font-black text-[10px] uppercase tracking-[0.6em] mb-2"
                                >
                                    {activeProtocol ? `Protocol ${activeProtocol} // Locked` : 'Quantum Intake Terminal'}
                                </motion.span>
                                <h2 className="text-3xl font-black uppercase tracking-tighter text-[var(--rhive-text)] italic">Property Portal<span className="text-rhive-pink">.</span></h2>
                            </div>
                            <motion.button
                                whileHover={{ rotate: 90, scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={toggleDrawer}
                                className="p-3 glass-dark border-[var(--rhive-border)] text-[var(--rhive-text-muted)] hover:text-rhive-pink transition-colors flex items-center justify-center outline-none bg-transparent"
                            >
                                <X size={20} />
                            </motion.button>
                        </div>

                        {/* Content Area */}
                        <div className="flex-grow p-8 overflow-y-auto flex flex-col">
                            {step === 'chat' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex flex-col h-full space-y-6"
                                >
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-rhive-pink/10 rounded-lg border border-rhive-pink/30">
                                                <Bot size={24} className="text-rhive-pink" />
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-black uppercase tracking-tighter italic">RHIVE AI Architect</h3>
                                                <p className="text-rhive-pink font-black text-[8px] uppercase tracking-[0.4em]">Neural Network Operational</p>
                                            </div>
                                        </div>
                                        <p className="text-[var(--text-muted)] text-sm leading-relaxed">
                                            I am the strategic engine of RHIVE OS. How can I assist your deployment today?
                                        </p>
                                    </div>

                                    <div className="flex-grow space-y-4 overflow-y-auto pr-2 scrollbar-hide">
                                        <div className="bg-white/5 border border-white/10 p-4 rounded-2xl rounded-tl-none max-w-[85%]">
                                            <p className="text-xs text-white/90 leading-relaxed">
                                                Welcome to the ecosystem. I can help you with:
                                                <br /><br />
                                                • Instant geometric roof analysis
                                                <br />
                                                • Material durability comparisons
                                                <br />
                                                • Financing & RPSP logic
                                                <br />
                                                • Customer portal access
                                            </p>
                                        </div>

                                        <div className="flex justify-end">
                                            <div className="bg-rhive-pink/20 border border-rhive-pink/30 p-4 rounded-2xl rounded-tr-none max-w-[85%]">
                                                <p className="text-xs text-white/90 leading-relaxed">
                                                    I'm interested in a metal roof for a 2,500 sq ft property.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-auto pt-6 border-t border-white/5">
                                        <div className="relative group">
                                            <input
                                                type="text"
                                                placeholder="COMMAND THE AI..."
                                                className="w-full bg-black/40 border-2 border-white/10 p-5 pr-16 text-xs font-black uppercase tracking-widest outline-none focus:border-rhive-pink transition-all text-white placeholder-white/20"
                                            />
                                            <button className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-rhive-pink text-white rounded-xl shadow-pink-glow hover:scale-110 transition-transform">
                                                <Send size={16} />
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2 mt-4">
                                            <button onClick={() => setStep('address')} className="text-[8px] font-black tracking-widest border border-white/10 py-2 hover:border-rhive-pink transition-all uppercase">Start Estimate</button>
                                            <button className="text-[8px] font-black tracking-widest border border-white/10 py-2 hover:border-rhive-pink transition-all uppercase">View Process</button>
                                            <button className="text-[8px] font-black tracking-widest border border-white/10 py-2 hover:border-rhive-pink transition-all uppercase">Insurance FAQ</button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {step === 'address' && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                                    className="space-y-8"
                                >
                                    {activeProtocol && (
                                        <div className="bg-rhive-pink/10 border border-rhive-pink/30 p-4 rounded-xl">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-rhive-pink mb-1">Active Protocol: {activeProtocol}</p>
                                            <p className="text-[10px] text-white/70 italic leading-relaxed">
                                                {activeProtocol === 'CERTIFIED QUOTE'
                                                    ? "This protocol involves a deep neural sweep and human-verified geometric validation for 100% price certainty."
                                                    : "Initializing rapid satellite scanning for an instant ball-park estimation."}
                                            </p>
                                        </div>
                                    )}

                                    <div className="space-y-4">
                                        <h3 className="text-4xl font-black uppercase tracking-tighter leading-none italic">Where are we <br /> deploying?</h3>
                                        <p className="text-[var(--text-muted)] text-sm">Input your address to initialize geospatial mapping and high-resolution aerial analysis.</p>
                                    </div>

                                    <div className="relative group">
                                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--rhive-text-muted)] group-focus-within:text-rhive-pink transition-colors">
                                            <Search size={22} />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="STREET ADDRESS..."
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                            className="w-full bg-[var(--rhive-bg)] border-2 border-[var(--rhive-border)] py-6 pl-16 pr-8 text-sm font-black uppercase tracking-widest outline-none focus:border-rhive-pink transition-all placeholder-[var(--rhive-text-muted)] text-[var(--rhive-text)]"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        {[
                                            { icon: MapPin, label: "Geospatial Data" },
                                            { icon: Home, label: "Roof Geometry" },
                                        ].map((item, i) => (
                                            <div key={i} className="glass-dark p-4 border-[var(--rhive-border)] flex flex-col items-center gap-2 opacity-50">
                                                <item.icon size={20} className="text-rhive-pink" />
                                                <span className="text-[8px] font-black uppercase tracking-widest text-[var(--rhive-text)]">{item.label}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => setStep('specs')}
                                        disabled={!address}
                                        className="w-full btn-tech py-6 text-xs shadow-pink-glow disabled:opacity-20 disabled:grayscale transition-all"
                                    >
                                        Initialize Analysis
                                    </button>
                                </motion.div>
                            )}

                            {step === 'specs' && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                                    className="space-y-8"
                                >
                                    <h3 className="text-3xl font-black uppercase tracking-tighter leading-none italic">Select Your Infrastructure<span className="text-rhive-pink">.</span></h3>

                                    <div className="space-y-6">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-widest opacity-50">Shingle Profile</label>
                                            <div className="grid grid-cols-2 gap-3">
                                                {['Duration', 'Designer', 'Metal', 'Slate'].map(s => (
                                                    <button key={s} className="p-4 glass-dark border-white/5 text-[10px] font-black uppercase tracking-widest hover:border-rhive-pink transition-all">
                                                        {s}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-widest opacity-50">Pitch Assessment</label>
                                            <div className="grid grid-cols-3 gap-3">
                                                {['Low', 'Medium', 'Steep'].map(p => (
                                                    <button key={p} className="p-3 glass-dark border-white/5 text-[9px] font-black uppercase tracking-widest hover:border-rhive-pink transition-all">
                                                        {p}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setStep('lead')}
                                        className="w-full btn-tech py-6 text-xs shadow-pink-glow"
                                    >
                                        Generate Range
                                    </button>
                                </motion.div>
                            )}

                            {step === 'lead' && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                                    className="space-y-8"
                                >
                                    <h3 className="text-3xl font-black uppercase tracking-tighter leading-none italic">Secure My Quote<span className="text-rhive-pink">.</span></h3>
                                    <p className="text-[var(--text-muted)] text-sm">Where should we deliver the detailed technical analysis and NDL warranty certification?</p>

                                    <div className="space-y-4">
                                        <input type="text" placeholder="FULL NAME" className="w-full bg-[var(--rhive-bg)] border border-[var(--rhive-border)] p-5 text-xs font-bold uppercase tracking-widest outline-none focus:border-rhive-pink transition-all text-[var(--rhive-text)] placeholder-[var(--rhive-text-muted)]" />
                                        <input type="email" placeholder="EMAIL ADDRESS" className="w-full bg-[var(--rhive-bg)] border border-[var(--rhive-border)] p-5 text-xs font-bold uppercase tracking-widest outline-none focus:border-rhive-pink transition-all text-[var(--rhive-text)] placeholder-[var(--rhive-text-muted)]" />
                                        <input type="tel" placeholder="PHONE NUMBER" className="w-full bg-[var(--rhive-bg)] border border-[var(--rhive-border)] p-5 text-xs font-bold uppercase tracking-widest outline-none focus:border-rhive-pink transition-all text-[var(--rhive-text)] placeholder-[var(--rhive-text-muted)]" />
                                    </div>

                                    <button
                                        onClick={() => setStep('result')}
                                        className="w-full btn-tech py-6 text-xs shadow-pink-glow"
                                    >
                                        Execute Delivery
                                    </button>
                                </motion.div>
                            )}

                            {step === 'result' && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                                    className="text-center space-y-10 py-10"
                                >
                                    <div className="flex justify-center">
                                        <div className="w-24 h-24 bg-rhive-pink rounded-full flex items-center justify-center text-white shadow-pink-glow animate-pulse">
                                            <CheckCircle2 size={48} />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <h3 className="text-5xl font-black uppercase tracking-tighter italic">Analysis <br /> Complete<span className="text-rhive-pink">.</span></h3>
                                        <p className="text-rhive-pink font-black text-[10px] uppercase tracking-[0.4em]">Integrated Estimate Ready</p>
                                    </div>

                                    <div className="glass-dark p-10 border-rhive-pink/30 relative overflow-hidden">
                                        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-rhive-pink to-transparent" />
                                        <span className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-4 block">Calculated Result Range</span>
                                        <div className="text-6xl font-black tracking-tighter text-white mb-2">
                                            $14.2K - $16.8K
                                        </div>
                                        <div className="text-rhive-pink text-[9px] font-bold uppercase tracking-widest">Includes 10% RPSP Efficiency Credit</div>
                                    </div>

                                    <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                                        Your detailed PDF breakdown has been sent. A local engineer will confirm the drone mapping data within 24 hours.
                                    </p>

                                    <div className="grid grid-cols-2 gap-4">
                                        <button className="btn-tech py-4 text-[10px]">Call Support</button>
                                        <button onClick={toggleDrawer} className="btn-tech-outline py-4 text-[10px]">Finish</button>
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* Footer Status */}
                        <div className="p-6 bg-black/40 border-t border-[var(--border-color)] flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]" />
                                <span className="text-[8px] font-black uppercase tracking-widest opacity-40">OS Channel Sec-1</span>
                            </div>
                            <span className="text-[8px] font-mono text-[var(--text-muted)] opacity-30 italic">Encryption: AES-256 Enabled</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
