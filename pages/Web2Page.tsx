
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShieldAlert, Calculator, FileSignature, Search,
    CloudLightning, Wrench, HardHat, Zap, ChevronRight,
    Menu, X, ShieldCheck, Building2, Clock, Activity, HeartHandshake,
    Cpu
} from 'lucide-react';

// --- THEME TOKENS ---
const theme = {
    bg: '#050505',
    pink: '#ec028b',
    cyan: '#22d3ee',
    glass: 'bg-white/5 backdrop-blur-xl border border-white/10',
};

// --- REUSABLE COMPONENTS ---

const GlitchText = ({ text, className = "" }: { text: string; className?: string }) => (
    <div className={`relative group inline-block ${className}`}>
        <h1 className="text-white font-black tracking-tighter uppercase italic relative z-10 leading-none">
            {text}
        </h1>
        <span className="absolute top-0 left-0 -translate-x-0.5 -translate-y-0.5 opacity-0 group-hover:opacity-70 blur-[1px] transition-opacity duration-100 select-none font-black italic uppercase tracking-tighter text-[#ec028b]">
            {text}
        </span>
        <span className="absolute top-0 left-0 translate-x-0.5 translate-y-0.5 opacity-0 group-hover:opacity-70 blur-[1px] transition-opacity duration-100 select-none font-black italic uppercase tracking-tighter text-[#22d3ee]">
            {text}
        </span>
    </div>
);

const GlassCard = ({ children, className = "", hoverEffect = true }: { children: React.ReactNode; className?: string; hoverEffect?: boolean }) => (
    <div className={`${theme.glass} rounded-2xl overflow-hidden relative group transition-all duration-500 ${hoverEffect ? 'hover:bg-white/10 hover:border-white/20' : ''} ${className}`}>
        <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none bg-[#ec028b]" />
        <div className="relative z-10 h-full">{children}</div>
    </div>
);

const QuantumButton = ({ children, variant = "primary", onClick, className = "", pulse = false }: { children: React.ReactNode; variant?: string; onClick?: () => void; className?: string; pulse?: boolean }) => {
    const baseStyle = "px-6 py-3 rounded-full font-bold uppercase tracking-widest text-xs transition-all duration-300 flex items-center justify-center gap-2 group relative overflow-hidden cursor-pointer";

    const variants: Record<string, string> = {
        primary: "bg-[#ec028b] text-white hover:bg-white hover:text-[#ec028b] shadow-[0_0_30px_rgba(236,2,139,0.4)] hover:shadow-[0_0_40px_rgba(236,2,139,0.6)]",
        secondary: "bg-transparent border border-[#ec028b] text-[#ec028b] hover:bg-[#ec028b]/10 hover:shadow-[0_0_20px_rgba(236,2,139,0.3)]",
        danger: "bg-red-600/10 border border-red-500 text-red-500 hover:bg-red-600 hover:text-white shadow-[0_0_15px_rgba(239,68,68,0.3)]",
        glass: "bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-[#ec028b]/50"
    };

    return (
        <button onClick={onClick} className={`${baseStyle} ${variants[variant] || variants.primary} ${pulse ? 'animate-pulse' : ''} ${className}`}>
            <span className="relative z-10 flex items-center gap-2">{children}</span>
        </button>
    );
};

// --- MAIN APPLICATION ---

export default function Web2Page() {
    const [mobileMenu, setMobileMenu] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [terminalText, setTerminalText] = useState("");
    const [isRouting, setIsRouting] = useState(false);

    // Scroll effect for header
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Quantum Terminal Routing Effect
    const handleRouting = (actionName: string) => {
        setIsRouting(true);
        const text = `> INITIATING PROTOCOL: ${actionName}...\n> ESTABLISHING SECURE CONNECTION...\n> ROUTING...`;
        let currentText = "";
        let i = 0;

        const typing = setInterval(() => {
            currentText += text.charAt(i);
            setTerminalText(currentText);
            i++;
            if (i >= text.length) {
                clearInterval(typing);
                setTimeout(() => {
                    setIsRouting(false);
                    setTerminalText("");
                }, 600);
            }
        }, 15);
    };

    return (
        <div className="min-h-screen bg-[#050505] text-slate-300 font-sans selection:bg-[#ec028b]/30 selection:text-white overflow-x-hidden">

            {/* Ghost Grid Background */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-20">
                <div className="absolute inset-0" style={{
                    backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(236,2,139,0.15) 1px, transparent 0)',
                    backgroundSize: '40px 40px'
                }} />
            </div>

            {/* Terminal Overlay (Micro-interaction) */}
            <AnimatePresence>
                {isRouting && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[9999] bg-[#050505]/95 backdrop-blur-md flex flex-col items-center justify-center"
                    >
                        <div className="w-full max-w-2xl p-8 border border-[#ec028b]/30 rounded-lg bg-black/50 shadow-[0_0_60px_rgba(236,2,139,0.2)]">
                            <div className="flex items-center gap-3 mb-4 border-b border-white/10 pb-4">
                                <Cpu className="text-[#ec028b] animate-pulse" />
                                <span className="text-xs font-mono text-[#ec028b] tracking-widest">RHIVE QUANTUM KERNEL v2.0</span>
                            </div>
                            <pre className="text-[#22d3ee] font-mono text-sm leading-relaxed whitespace-pre-wrap">
                                {terminalText}
                                <span className="animate-pulse">_</span>
                            </pre>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* GLOBAL HEADER */}
            <nav className={`fixed top-0 w-full z-50 transition-all duration-500 border-b ${scrolled ? 'bg-[#050505]/80 backdrop-blur-xl border-white/10 py-4' : 'bg-transparent border-transparent py-6'}`}>
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#ec028b] rounded flex items-center justify-center shadow-[0_0_15px_rgba(236,2,139,0.4)]">
                            <Zap className="text-white" size={20} />
                        </div>
                        <span className="text-2xl font-black text-white italic tracking-tighter uppercase">RHIVE</span>
                    </div>

                    <div className="hidden lg:flex items-center gap-8 text-xs font-mono tracking-widest uppercase text-slate-400">
                        <button className="hover:text-[#ec028b] transition-colors">Services</button>
                        <button className="hover:text-[#ec028b] transition-colors">Process</button>
                        <button className="hover:text-[#ec028b] transition-colors">Financing</button>
                        <button className="hover:text-[#ec028b] transition-colors">About</button>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* CTA 2: EMERGENCY LEAK */}
                        <QuantumButton variant="danger" pulse onClick={() => handleRouting('EMERGENCY_OVERRIDE')} className="hidden md:flex">
                            <ShieldAlert size={16} /> Emergency Leak
                        </QuantumButton>
                        <button className="lg:hidden text-white" onClick={() => setMobileMenu(!mobileMenu)}>
                            {mobileMenu ? <X /> : <Menu />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* HERO HOLOGRAM */}
            <section className="relative z-10 pt-48 pb-32 px-6 max-w-7xl mx-auto flex flex-col items-center justify-center text-center min-h-screen">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#ec028b]/5 rounded-full blur-[200px] pointer-events-none" />
                <div className="absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#08137C]/10 rounded-full blur-[180px] pointer-events-none" />

                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-[#ec028b] font-mono tracking-widest uppercase mb-8 text-[10px]"
                >
                    <Activity size={12} className="animate-pulse" /> System Online // Utah &amp; Idaho Nodes Active
                </motion.div>

                <GlitchText text="Finish On Top." className="text-6xl md:text-8xl lg:text-[10rem] mb-6" />

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-lg md:text-2xl text-slate-400 font-light max-w-3xl leading-relaxed mb-12"
                >
                    Stripping the <span className="text-white font-bold border-b border-[#ec028b]">"Chase Cost"</span> out of construction. Pay for precision engineering, not administrative waste.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto"
                >
                    {/* CTA 6: ESTIMATE */}
                    <QuantumButton variant="primary" className="py-5 px-10 text-sm" onClick={() => handleRouting('UNGATED_ESTIMATE')}>
                        <Calculator size={18} /> Instant Estimate
                    </QuantumButton>

                    {/* CTA 7: QUOTE */}
                    <QuantumButton variant="secondary" className="py-5 px-10 text-sm" onClick={() => handleRouting('CERTIFIED_QUOTE')}>
                        <FileSignature size={18} /> Certified Quote
                    </QuantumButton>
                </motion.div>
            </section>

            {/* ACTION MATRIX (Intent Routing) */}
            <section className="relative z-10 py-24 px-6 bg-black border-y border-white/5">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-16">
                        <h2 className="text-3xl md:text-5xl font-black text-white italic tracking-tighter uppercase mb-4">Choose Intent.</h2>
                        <p className="font-mono text-sm text-[#ec028b] tracking-widest uppercase">Identify your structural requirement to initialize protocol.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* CTA 1: INSPECTION */}
                        <GlassCard className="p-8 cursor-pointer group" hoverEffect>
                            <div onClick={() => handleRouting('HEALTH_VALIDATION_SCAN')} className="h-full flex flex-col justify-between min-h-[180px]">
                                <Search className="text-[#22d3ee] mb-6 group-hover:scale-110 transition-transform" size={36} />
                                <div>
                                    <h3 className="text-xl font-bold text-white uppercase tracking-tight mb-2">Inspection</h3>
                                    <p className="text-xs text-slate-400 font-mono">Proactive health validation &amp; drone scanning.</p>
                                </div>
                            </div>
                        </GlassCard>

                        {/* CTA 3: INSURANCE */}
                        <GlassCard className="p-8 cursor-pointer group" hoverEffect>
                            <div onClick={() => handleRouting('FORENSIC_STORM_DATA')} className="h-full flex flex-col justify-between min-h-[180px]">
                                <CloudLightning className="text-yellow-400 mb-6 group-hover:scale-110 transition-transform" size={36} />
                                <div>
                                    <h3 className="text-xl font-bold text-white uppercase tracking-tight mb-2">Insurance</h3>
                                    <p className="text-xs text-slate-400 font-mono">Storm data API overlays &amp; adjuster advocacy.</p>
                                </div>
                            </div>
                        </GlassCard>

                        {/* CTA 4: REPAIR */}
                        <GlassCard className="p-8 cursor-pointer group" hoverEffect>
                            <div onClick={() => handleRouting('COMPONENT_RESTORATION')} className="h-full flex flex-col justify-between min-h-[180px]">
                                <Wrench className="text-green-400 mb-6 group-hover:scale-110 transition-transform" size={36} />
                                <div>
                                    <h3 className="text-xl font-bold text-white uppercase tracking-tight mb-2">Repair</h3>
                                    <p className="text-xs text-slate-400 font-mono">Precision component restoration &amp; leak stops.</p>
                                </div>
                            </div>
                        </GlassCard>

                        {/* CTA 5: REPLACEMENT */}
                        <GlassCard className="p-8 cursor-pointer group" hoverEffect>
                            <div onClick={() => handleRouting('ECOSYSTEM_OVERHAUL')} className="h-full flex flex-col justify-between min-h-[180px]">
                                <HardHat className="text-[#ec028b] mb-6 group-hover:scale-110 transition-transform" size={36} />
                                <div>
                                    <h3 className="text-xl font-bold text-white uppercase tracking-tight mb-2">Replacement</h3>
                                    <p className="text-xs text-slate-400 font-mono">Complete structural ecosystem overhaul.</p>
                                </div>
                            </div>
                        </GlassCard>
                    </div>
                </div>
            </section>

            {/* SERVICES PITCH */}
            <section className="relative z-10 py-32 px-6 max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <span className="text-[#ec028b] font-mono text-xs uppercase tracking-widest mb-4 block">System Capabilities</span>
                        <h2 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter uppercase mb-6 leading-none">Engineered Protection.<br />Zero Layovers.</h2>
                        <p className="text-lg text-slate-400 font-light leading-relaxed mb-8">
                            We deploy strict installation protocols. From &apos;California Cut&apos; valleys on residential structures to NDL warranties on industrial membrane systems. We do not cut corners.
                        </p>
                        <QuantumButton variant="glass" onClick={() => handleRouting('SERVICES_DIRECTORY')}>
                            View Full Capabilities <ChevronRight size={16} />
                        </QuantumButton>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                        <GlassCard className="p-8 border-t-4 border-t-[#ec028b]">
                            <ShieldCheck className="text-[#ec028b] mb-4" size={32} />
                            <h4 className="font-bold text-white uppercase mb-2">OC Preferred</h4>
                            <p className="text-xs text-slate-400 leading-relaxed">Top 1% of contractors nationwide. Owens Corning Residential systems.</p>
                        </GlassCard>
                        <GlassCard className="p-8 border-t-4 border-t-[#22d3ee]">
                            <Building2 className="text-[#22d3ee] mb-4" size={32} />
                            <h4 className="font-bold text-white uppercase mb-2">GAF Certified</h4>
                            <p className="text-xs text-slate-400 leading-relaxed">Flat/Membrane systems. PVC &amp; TPO installation for commercial assets.</p>
                        </GlassCard>
                    </div>
                </div>
            </section>

            {/* PROCESS & TRACKING PITCH */}
            <section className="relative z-10 py-32 px-6 bg-white/[0.02] border-y border-white/5">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
                    <div className="w-full md:w-1/2">
                        <div className="relative pl-10 border-l border-white/10 space-y-12">
                            <div className="absolute left-0 top-0 w-[2px] h-1/3 bg-gradient-to-b from-[#ec028b] to-transparent" />

                            <div className="relative">
                                <div className="absolute -left-[21px] top-1 w-2 h-2 rounded-full bg-[#ec028b] shadow-[0_0_10px_rgba(236,2,139,0.6)]" />
                                <h4 className="text-xl font-bold text-white uppercase">1. AI Estimate &amp; Quote</h4>
                                <p className="text-sm text-slate-400 mt-2">Satellite data yields immediate precision.</p>
                            </div>
                            <div className="relative">
                                <div className="absolute -left-[21px] top-1 w-2 h-2 rounded-full bg-white/20" />
                                <h4 className="text-xl font-bold text-white uppercase">2. The 10-Stage Automation</h4>
                                <p className="text-sm text-slate-400 mt-2">Zero ghosting. Automated logistics sequencing.</p>
                            </div>
                            <div className="relative">
                                <div className="absolute -left-[21px] top-1 w-2 h-2 rounded-full bg-white/20" />
                                <h4 className="text-xl font-bold text-white uppercase">3. Live &quot;Pizza Tracker&quot;</h4>
                                <p className="text-sm text-slate-400 mt-2">Real-time tear-off photos sent directly to your portal.</p>
                            </div>
                        </div>
                    </div>

                    <div className="w-full md:w-1/2">
                        <span className="text-[#ec028b] font-mono text-xs uppercase tracking-widest mb-4 block">The Blueprint</span>
                        <h2 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter uppercase mb-6 leading-none">Automated Precision.<br />Zero Ambiguity.</h2>
                        <QuantumButton variant="primary" onClick={() => handleRouting('VIEW_PROCESS_TIMELINE')}>
                            <Clock size={16} /> Explore The 10 Stages
                        </QuantumButton>
                    </div>
                </div>
            </section>

            {/* FINANCING PITCH */}
            <section className="relative z-10 py-32 px-6 max-w-7xl mx-auto text-center">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#ec028b]/5 rounded-full blur-[200px] pointer-events-none" />

                <span className="text-[#ec028b] font-mono text-xs uppercase tracking-widest mb-4 block">Capital &amp; Logic</span>
                <h2 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter uppercase mb-10">0% APR for 18 Months.</h2>

                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left mb-12">
                    <GlassCard className="p-10">
                        <h4 className="text-2xl font-black text-white italic uppercase mb-4">The RPSP Credit</h4>
                        <p className="text-slate-400 text-sm leading-relaxed mb-6">
                            Traditional quotes hide the cost of marketing and follow-ups. Commit within 48 hours, and we credit that 10% &quot;Chase Cost&quot; back to your project instantly.
                        </p>
                        <div className="h-px w-full bg-white/10 my-6" />
                        <div className="flex justify-between items-center">
                            <span className="font-mono text-xs text-slate-500 uppercase">Efficiency Savings</span>
                            <span className="text-xl font-bold text-[#ec028b]">-10% OFF</span>
                        </div>
                    </GlassCard>

                    <GlassCard className="p-10">
                        <h4 className="text-2xl font-black text-white italic uppercase mb-4">The 50/40/10 Logic</h4>
                        <p className="text-slate-400 text-sm leading-relaxed mb-6">
                            A transparent payment breakdown to ensure mutual protection. 50% Material Deposit, 40% Upon Roof Completion, 10% After Final QC Punch List.
                        </p>
                        <QuantumButton variant="secondary" className="w-full mt-4" onClick={() => handleRouting('LENDING_MATRIX')}>
                            View Lending Matrix
                        </QuantumButton>
                    </GlassCard>
                </div>
            </section>

            {/* ABOUT US PITCH */}
            <section className="relative z-10 py-32 px-6 bg-[#ec028b]/5 border-t border-[#ec028b]/20">
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter uppercase mb-6 leading-none">A Revolution in Construction.</h2>
                        <p className="text-lg text-slate-300 font-light leading-relaxed mb-6">
                            Proudly Female-Owned. We enforce Radical Transparency, exposing exactly what you pay for Materials, Labor, Overhead, and Profit on every single job.
                        </p>
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 rounded-full border border-white/20 bg-white/10" />
                            <div className="w-12 h-12 rounded-full border border-white/20 bg-white/10 -ml-6" />
                            <span className="font-mono text-xs text-slate-400 uppercase tracking-widest ml-4">Kara &amp; Michael Robinson</span>
                        </div>
                        <QuantumButton variant="glass" onClick={() => handleRouting('FOUNDER_PROFILES')}>
                            Read The Manifesto
                        </QuantumButton>
                    </div>

                    <GlassCard className="p-10 border-[#ec028b]/30 bg-[#ec028b]/5" hoverEffect={false}>
                        <HeartHandshake className="text-[#ec028b] mb-6" size={48} />
                        <h4 className="text-2xl font-black text-white italic uppercase mb-4">The Community Directive</h4>
                        <p className="text-slate-400 leading-relaxed mb-6">
                            For every state RHIVE operates in, we execute a mandated protocol: Donating a complete roofing system to veterans and teachers who protect and educate our future.
                        </p>
                        <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                            <div className="w-3/4 h-full bg-gradient-to-r from-[#ec028b] to-[#22d3ee]" />
                        </div>
                        <p className="text-xs font-mono text-slate-500 uppercase mt-3 tracking-widest text-right">Target Metrics Reached</p>
                    </GlassCard>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="bg-black py-12 px-6 border-t border-white/10 relative z-10">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-3">
                        <Zap className="text-[#ec028b]" size={20} />
                        <span className="text-xl font-black text-white italic tracking-tighter uppercase">RHIVE</span>
                    </div>
                    <p className="text-xs font-mono text-slate-600 uppercase tracking-widest text-center">
                        © 2026 RHIVE CONSTRUCTION LLC. ALL RIGHTS RESERVED.<br />
                        SOUTH JORDAN, UT // POCATELLO, ID
                    </p>
                    <div className="flex gap-4">
                        <span className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-slate-500 hover:text-white cursor-pointer transition-colors">IG</span>
                        <span className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-slate-500 hover:text-white cursor-pointer transition-colors">FB</span>
                    </div>
                </div>
            </footer>

        </div>
    );
}
