import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, CheckCircle2, Building2, Shield, Droplets, ChevronRight, ArrowRight, Eye, ListChecks, FileText, Activity, TrendingUp, ShieldCheck, Building, HardHat, Target } from 'lucide-react';
import PlexusShape from '../components/PlexusShape';
import RhiveHeader from '../components/website/RhiveHeader';
import Card from '../components/Card';
import { cn } from '../lib/utils';
import { useNavigation } from '../contexts/NavigationContext';

const GlitchText = ({ text, className }: { text: string, className?: string }) => {
    return (
        <div className={cn("relative inline-block", className)}>
            <span className="relative z-10 block">{text}</span>
            <motion.span
                className="absolute inset-0 z-20 text-[#ec028b] mix-blend-screen pointer-events-none select-none"
                initial={{ opacity: 0 }}
                animate={{
                    opacity: [0, 0.8, 0, 0.5, 0],
                    x: [0, -4, 3, -2, 0],
                    y: [0, 1, -1, 2, 0],
                    clipPath: [
                        'inset(20% 0 50% 0)',
                        'inset(10% 0 80% 0)',
                        'inset(40% 0 10% 0)',
                        'inset(70% 0 30% 0)',
                        'inset(20% 0 50% 0)',
                    ]
                }}
                transition={{ duration: 0.2, repeat: Infinity, repeatDelay: Math.random() * 1 + 0.5, ease: "easeInOut" }}
            >
                {text}
            </motion.span>
            <motion.span
                className="absolute inset-0 z-20 bg-gradient-to-t from-rhive-blue to-white bg-clip-text text-transparent mix-blend-screen pointer-events-none select-none"
                initial={{ opacity: 0 }}
                animate={{
                    opacity: [0, 0.7, 0, 0.4, 0],
                    x: [0, 4, -3, 2, 0],
                    y: [0, -1, 1, -2, 0],
                    clipPath: [
                        'inset(50% 0 20% 0)',
                        'inset(80% 0 10% 0)',
                        'inset(10% 0 40% 0)',
                        'inset(30% 0 70% 0)',
                        'inset(50% 0 20% 0)',
                    ]
                }}
                transition={{ duration: 0.25, repeat: Infinity, repeatDelay: Math.random() * 1 + 0.5, ease: "easeInOut" }}
            >
                {text}
            </motion.span>
        </div>
    );
};

const OpenEstimator = (protocol = 'INSTANT ESTIMATE') => {
    window.dispatchEvent(new CustomEvent('open-estimator', { detail: { protocol } }));
};

const ScrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
};

const UniversalLandingPage: React.FC = () => {
    const { setActivePageId } = useNavigation();
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const faqs = [
        { q: "Why do you show your cost breakdowns?", a: "At RHIVE, integrity starts with math. You see exactly what we pay for materials and labor, ensuring complete transparency in every quote." },
        { q: "What is the \"No-Leak Guarantee\"?", a: "If we installed it and it leaks, we fix it for free. Period. We follow manufacturer guidelines strictly to ensure your peace of mind." },
        { q: "Do you offer financing?", a: "Yes. Our automated pipeline allows for rapid pre-approvals via our RPSP credit system for quick, frictionless onboarding." }
    ];

    const specs = [
        { name: "Owens Corning Duration", feature: "130 MPH Wind Resistance, SureNail Technology, Class A Fire Rating." },
        { name: "PVC/TPO Membranes", feature: "100% Heat-welded seams, highly reflective (cool roof), highly resistant to chemicals." },
        { name: "Commercial Ice Defense", feature: "Self-regulating thermal cables, extruded aluminum tracking, remote sensor activation." }
    ];

    return (
        <div className="relative h-screen w-full font-sans bg-[var(--rhive-bg)] transition-colors duration-500 overflow-y-scroll snap-y snap-mandatory">
            {/* Gradient Definition for Icons */}
            <svg width="0" height="0" className="absolute pointer-events-none">
                <defs>
                    <linearGradient id="blue-white-grad" x1="0%" y1="100%" x2="0%" y2="0%">
                        <stop offset="0%" stopColor="#08137C" />
                        <stop offset="100%" stopColor="#ffffff" />
                    </linearGradient>
                </defs>
            </svg>
            <div className="fixed inset-0 bg-circuit-pattern opacity-5 pointer-events-none z-0" />
            <RhiveHeader />

            {/* DOMINANCE: Hero Section & Immediate CTA */}
            <section className="relative w-full min-h-[90vh] flex flex-col items-center justify-center pt-32 pb-24 overflow-hidden snap-start shrink-0">
                <div className="absolute inset-0 bg-black/90 pointer-events-none z-[2]" />
                <div className="absolute inset-0 opacity-70 pointer-events-auto z-[3]">
                    <PlexusShape backgroundColor="transparent" dotColor="#ec028b" lineColor="236, 2, 139" density={80} />
                </div>

                <div className="container mx-auto px-6 relative z-10 text-center flex flex-col items-center">
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="mb-6"
                    >
                        <span className="text-rhive-pink font-black text-xs md:text-sm tracking-[0.4em] md:tracking-[0.6em] uppercase">
                            Precision Engineering // Radical Transparency
                        </span>
                    </motion.div>
                    <motion.h1 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="font-display text-5xl md:text-7xl lg:text-8xl font-black uppercase leading-[0.9] mb-8 tracking-tighter drop-shadow-2xl flex flex-col items-center"
                    >
                        <span className="text-white mb-2">The Future Of</span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-rhive-pink via-white to-rhive-pink pb-2">
                            Roofing
                        </span>
                    </motion.h1>
                    <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="font-sans text-base md:text-xl text-gray-300 max-w-3xl mx-auto mb-10 font-medium leading-relaxed"
                    >
                        Experience Utah's most trusted, tech-forward roofing contractor. We don't just build roofs; we deploy infrastructure with <strong className="text-white font-bold">military precision.</strong>
                    </motion.p>

                    <motion.button
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        onClick={() => OpenEstimator()}
                        className="bg-rhive-pink text-white px-12 py-6 rounded-full font-black uppercase tracking-widest text-lg hover:brightness-110 hover:scale-105 active:scale-95 transition-all shadow-[0_0_40px_rgba(236,2,139,0.5)] mb-16 flex items-center gap-4"
                    >
                        <Zap size={24} fill="currentColor" />
                        Get a Fast Quote Today
                    </motion.button>

                    {/* Self-Selection Paths */}
                    <motion.div 
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
                    >
                        <button onClick={() => setActivePageId('P-12')} className="bg-white/5 border border-white/10 hover:border-rhive-pink p-6 text-left group transition-all rounded-lg relative overflow-hidden">
                            <div className="absolute inset-0 bg-rhive-pink/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <Zap className="text-rhive-pink mb-4" size={28} />
                            <h3 className="text-white font-bold text-sm uppercase mb-1">Need it fixed fast?</h3>
                            <p className="text-rhive-pink text-xs font-bold uppercase tracking-widest flex items-center gap-2">Get an Estimate <ArrowRight size={12} /></p>
                        </button>
                        <button onClick={() => setActivePageId('P-02a-3')} className="bg-white/5 border border-white/10 hover:border-rhive-blue p-6 text-left group transition-all rounded-lg relative overflow-hidden">
                            <div className="absolute inset-0 bg-rhive-blue/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <Eye color="url(#blue-white-grad)" className="mb-4" size={28} />
                            <h3 className="text-white font-bold text-sm uppercase mb-1">Want a custom look?</h3>
                            <div className="flex items-center gap-2">
                                <p className="bg-gradient-to-t from-rhive-blue to-white bg-clip-text text-transparent text-xs font-bold uppercase tracking-widest">View Designer Options</p>
                                <ArrowRight size={12} className="text-white" />
                            </div>
                        </button>
                        <button onClick={() => setActivePageId('P-03')} className="bg-white/5 border border-white/10 hover:border-rhive-gold p-6 text-left group transition-all rounded-lg relative overflow-hidden">
                            <div className="absolute inset-0 bg-rhive-gold/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <ListChecks className="text-rhive-gold mb-4" size={28} />
                            <h3 className="text-white font-bold text-sm uppercase mb-1">Wondering how it works?</h3>
                            <p className="text-rhive-gold text-xs font-bold uppercase tracking-widest flex items-center gap-2">Read Our Process <ArrowRight size={12} /></p>
                        </button>
                        <button onClick={() => setActivePageId('P-02a-2')} className="bg-white/5 border border-white/10 hover:border-white/30 p-6 text-left group transition-all rounded-lg relative overflow-hidden">
                            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <FileText className="text-white mb-4" size={28} />
                            <h3 className="text-white font-bold text-sm uppercase mb-1">Comparing materials?</h3>
                            <p className="text-gray-400 group-hover:text-white transition-colors text-xs font-bold uppercase tracking-widest flex items-center gap-2">See Technical Specs <ArrowRight size={12} /></p>
                        </button>
                    </motion.div>
                </div>
            </section>

            {/* INFLUENCE: Gallery & Testimonials */}
            <section id="custom-look" className="min-h-screen py-24 px-6 md:px-20 bg-[var(--rhive-bg)] snap-start flex flex-col justify-center">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-16 text-left">
                        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4 text-[var(--rhive-text)]">Premium Aesthetics.</h2>
                        <div className="w-20 h-1 bg-rhive-blue mb-6" />
                        <p className="text-[var(--rhive-text-muted)] text-lg max-w-2xl font-serif italic">See the stunning transformations we've accomplished for our community. Every project is a testament to our commitment to excellence.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 mb-16">
                        <Card className="p-0 border-0 overflow-hidden group">
                            <div className="relative h-64 overflow-hidden">
                                <img src="https://firebasestorage.googleapis.com/v0/b/video-qr-automator.firebasestorage.app/o/Website%20Media%20Assets%2FImages%2FScreenshot%202026-05-14%20205854.png?alt=media&token=4ff2682f-3e63-4888-aec1-f85d81fb5d2e" alt="Designer Roof" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
                                    <div>
                                        <h3 className="text-white font-bold text-xl uppercase tracking-widest">Designer Series</h3>
                                        <button onClick={() => setActivePageId('P-02a-3')} className="flex items-center gap-1 mt-2 group/btn">
                                            <span className="bg-gradient-to-t from-rhive-blue to-white bg-clip-text text-transparent text-xs font-bold uppercase tracking-widest transition-all group-hover/btn:from-white group-hover/btn:to-white">Explore Gallery</span>
                                            <ArrowRight size={12} className="text-white" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                        <Card className="p-0 border-0 overflow-hidden group">
                            <div className="relative h-64 overflow-hidden">
                                <video autoPlay muted loop playsInline className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700">
                                    <source src="https://firebasestorage.googleapis.com/v0/b/video-qr-automator.firebasestorage.app/o/Website%20Media%20Assets%2FParts%20of%20Asphalt%20Roof%2FDisplay.mp4?alt=media&token=89cf58bc-8ae3-4d2b-8cf5-09ec0b057f91" type="video/mp4" />
                                </video>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
                                    <div>
                                        <h3 className="text-white font-bold text-xl uppercase tracking-widest">Industrial Specs</h3>
                                        <button onClick={() => setActivePageId('P-02')} className="flex items-center gap-1 mt-2 group/btn">
                                            <span className="bg-gradient-to-t from-rhive-blue to-white bg-clip-text text-transparent text-xs font-bold uppercase tracking-widest transition-all group-hover/btn:from-white group-hover/btn:to-white">Know your system</span>
                                            <ArrowRight size={12} className="text-white" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>

                    <div className="glass-dark p-8 border border-white/10 border-l-4 border-l-rhive-blue relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <svg width="60" height="60" viewBox="0 0 24 24" fill="white"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg>
                        </div>
                        <p className="text-xl text-[var(--rhive-text)] font-serif italic mb-6 relative z-10 leading-relaxed">
                            "Absolutely seamless execution from the first drone flight to the final inspection. The digital portal kept us in the loop daily, and the finished roof looks immaculate. Highly recommend the Designer package."
                        </p>
                        <div className="flex items-center gap-4 relative z-10">
                            <div className="w-12 h-12 bg-gray-800 rounded-full overflow-hidden">
                                <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Client Avatar" />
                            </div>
                            <div>
                                <h4 className="text-white font-bold uppercase tracking-widest text-sm">Marcus Vance</h4>
                                <div className="flex text-rhive-gold text-sm mt-1">
                                    ★ ★ ★ ★ ★
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* STEADINESS: Process & Guarantees */}
            <section id="process-section" className="min-h-screen py-24 px-6 md:px-20 bg-black/50 border-y border-white/5 snap-start flex flex-col justify-center">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-16 text-center">
                        <div className="inline-block border border-rhive-gold/50 text-rhive-gold px-4 py-1 rounded-full text-xs font-bold tracking-[0.2em] mb-4 uppercase bg-rhive-gold/10">
                            Predictability Engineered
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4 text-white">The Zero-Surprises Process.</h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto font-serif italic">From contract to cleanup, our 4-phase deployment system ensures you are always informed and protected.</p>
                    </div>

                    <div className="grid md:grid-cols-4 gap-6 mb-16 relative">
                        <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-white/10 -translate-y-1/2 z-0" />
                        {[
                            { num: "01", title: "Assessment", desc: "AI-powered structural mapping." },
                            { num: "02", title: "Approval", desc: "Fixed-cost transparent contracts." },
                            { num: "03", title: "Deployment", desc: "Certified swift installation." },
                            { num: "04", title: "Assurance", desc: "No-Leak Lifetime Guarantee." }
                        ].map((step, idx) => (
                            <div key={idx} className="glass-dark p-8 border border-white/10 text-center relative z-10 hover:border-rhive-gold transition-colors">
                                <div className="w-12 h-12 bg-black border-2 border-rhive-gold rounded-full flex items-center justify-center font-bold text-white mx-auto mb-6 shadow-[0_0_15px_rgba(226,171,73,0.3)]">
                                    {step.num}
                                </div>
                                <h3 className="text-white font-bold uppercase tracking-widest mb-3">{step.title}</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="text-center">
                        <button onClick={() => setActivePageId('P-03')} className="bg-transparent border border-white/20 text-white hover:bg-white/5 hover:border-white/50 px-10 py-4 rounded-full font-bold uppercase tracking-widest text-sm transition-all">
                            See Full 10-Stage Process
                        </button>
                    </div>
                </div>
            </section>

            {/* CONSCIENTIOUSNESS: Specs & FAQs */}
            <section id="specs-section" className="min-h-screen py-24 px-6 md:px-20 bg-[var(--rhive-bg)] snap-start flex flex-col justify-center">
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20">
                    <div>
                        <div className="mb-12">
                            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4 text-[var(--rhive-text)]">Technical Specs.</h2>
                            <div className="w-16 h-1 bg-white/30 mb-6" />
                            <p className="text-[var(--rhive-text-muted)] text-sm leading-relaxed">For those who want to look under the hood. Our materials meet and exceed regional engineering mandates.</p>
                        </div>

                        <div className="space-y-4">
                            {specs.map((spec, i) => (
                                <div key={i} className="glass-dark p-6 border border-white/5 group hover:border-white/20 transition-all">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="text-white font-bold uppercase tracking-widest text-sm group-hover:text-rhive-pink transition-colors">{spec.name}</h4>
                                    </div>
                                    <p className="text-gray-400 text-sm font-mono">{spec.feature}</p>
                                </div>
                            ))}
                        </div>
                        
                        <div className="mt-8">
                            <button onClick={() => setActivePageId('P-02a-SPEC')} className="text-white font-bold uppercase tracking-widest text-xs border-b border-white/30 pb-1 hover:border-white transition-all flex items-center gap-2">
                                View Full Comparison Sheets <ArrowRight size={12} />
                            </button>
                        </div>
                    </div>

                    <div>
                        <div className="mb-12">
                            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4 text-[var(--rhive-text)]">System FAQ.</h2>
                            <div className="w-16 h-1 bg-white/30 mb-6" />
                        </div>

                        <div className="space-y-4">
                            {faqs.map((faq, idx) => (
                                <div key={idx} className="border border-white/5 bg-white/5 p-6 rounded-lg cursor-pointer hover:bg-white/10 transition-colors" onClick={() => setOpenFaq(openFaq === idx ? null : idx)}>
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-sm font-bold uppercase tracking-widest text-white">{faq.q}</h3>
                                        <ChevronRight className={cn("text-white/50 transition-transform duration-300", openFaq === idx ? "rotate-90" : "")} size={18} />
                                    </div>
                                    <AnimatePresence>
                                        {openFaq === idx && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden"
                                            >
                                                <p className="text-sm text-gray-400 leading-relaxed font-serif pt-4">
                                                    {faq.a}
                                                </p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* STRATEGIC PORTFOLIO MANAGEMENT */}
            <section id="portfolio-management" className="min-h-screen py-24 px-6 md:px-20 bg-black relative snap-start flex flex-col justify-center overflow-hidden">
                {/* Background image subtle overlay */}
                <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop")', backgroundSize: 'cover', backgroundPosition: 'center', filter: 'grayscale(100%)' }} />
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent pointer-events-none" />

                <div className="max-w-7xl mx-auto w-full relative z-10 grid lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center">
                                <Activity size={18} className="text-rhive-pink" />
                            </div>
                            <span className="text-rhive-pink font-black text-xs md:text-sm tracking-[0.4em] uppercase">
                                Strategic Portfolio Management
                            </span>
                        </div>
                        
                        <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-8 text-white leading-[0.9]">
                            10-Year <span className="text-transparent bg-clip-text bg-gradient-to-r from-rhive-pink to-[#9d02ec]">Capex</span><br />Intelligence.
                        </h2>
                        
                        <p className="text-gray-300 text-lg md:text-xl font-serif italic mb-10 max-w-xl leading-relaxed">
                            Stop reacting to leaks. We provide full company-wide roof inspections to put into perspective your budgets over the next decade. A comprehensive strategy for preserving, repairing, maintaining, and planning for your largest asset.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-8 mb-12 border-l-2 border-white/10 pl-6">
                            <div>
                                <h4 className="text-white font-bold text-lg">HOA & Multi-Family</h4>
                                <p className="text-gray-500 text-xs font-bold tracking-[0.2em] uppercase">Neighborhood Scale</p>
                            </div>
                            <div className="hidden sm:block w-px h-12 bg-white/10" />
                            <div>
                                <h4 className="text-white font-bold text-lg">Industrial Parks</h4>
                                <p className="text-gray-500 text-xs font-bold tracking-[0.2em] uppercase">Enterprise Assets</p>
                            </div>
                        </div>

                        <button className="bg-rhive-pink text-white px-8 py-5 rounded-[4px] rounded-br-2xl font-black uppercase tracking-[0.2em] text-sm hover:brightness-110 active:scale-95 transition-all shadow-[0_0_20px_rgba(236,2,139,0.3)] flex items-center gap-4">
                            Request Capex Diagnostic <Target size={18} />
                        </button>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="glass-dark p-8 border border-white/5 hover:border-white/20 transition-all">
                            <TrendingUp size={24} className="text-gray-400 mb-6" />
                            <h3 className="text-white font-black uppercase tracking-widest text-sm mb-3">Financial<br />Predictability</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">Exact cost projections for 1, 3, 5, and 10-year horizons.</p>
                        </div>
                        <div className="glass-dark p-8 border border-white/5 hover:border-white/20 transition-all">
                            <ShieldCheck size={24} className="text-gray-400 mb-6" />
                            <h3 className="text-white font-black uppercase tracking-widest text-sm mb-3">Liability Mitigation</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">Identify and neutralize structural risks before interior failure.</p>
                        </div>
                        <div className="glass-dark p-8 border border-white/5 hover:border-white/20 transition-all">
                            <Building size={24} className="text-gray-400 mb-6" />
                            <h3 className="text-white font-black uppercase tracking-widest text-sm mb-3">Portfolio<br />Standardization</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">Unified system specifications across all physical locations.</p>
                        </div>
                        <div className="glass-dark p-8 border border-white/10 hover:border-rhive-pink transition-all relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-rhive-pink" />
                            <HardHat size={24} className="text-rhive-pink mb-6" />
                            <h3 className="text-white font-black uppercase tracking-widest text-sm mb-3">Certified Execution</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">Backed by GAF Master Select and OC Preferred protections.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default UniversalLandingPage;
