import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Zap, Shield, Star, Phone, CheckCircle2, ArrowRight, ChevronDown,
    MapPin, Clock, Award, Users, Home, Building2, Droplets, Wind,
    AlertTriangle, ChevronRight, BadgeCheck, Wrench, CloudRain,
    Store, Briefcase, Package, Hammer, Laptop, UserCheck, Handshake,
    X, Sun, Sparkles
} from 'lucide-react';
import { useNavigation } from '../contexts/NavigationContext';
import { useGoogleMapsApi } from '../hooks/useGoogleMapsApi';
import PlexusShape from '../components/PlexusShape';
import RhiveHeader from '../components/website/RhiveHeader';
import AddressScanInput from '../components/AddressScanInput';
import { GoogleTestimonials } from '../components/GoogleTestimonials';
import FinancingCalculator from '../components/FinancingCalculator';
import { cn } from '../lib/utils';
import { LightboxNavigation } from '../components/LightboxNavigation';

// --- GLITCH TEXT COMPONENT ---
const GlitchText = ({ text, className }: { text: string; className?: string }) => {
    const isGradient = className?.includes('animate-text-gradient');
    return (
        <div className={cn("relative inline-block", isGradient ? "" : className)}>
            <span className={cn("relative z-10 block", isGradient ? className : "")}>{text}</span>
            <motion.span
                className="absolute inset-0 z-20 text-[#ec028b] mix-blend-screen pointer-events-none select-none"
                initial={{ opacity: 0 }}
                animate={{
                    opacity: [0, 0.5, 0, 0.3, 0],
                    x: [0, -2, 2, -1, 0],
                    y: [0, 1, -1, 0, 0],
                    clipPath: [
                        'inset(10% 0 60% 0)',
                        'inset(30% 0 40% 0)',
                        'inset(50% 0 10% 0)',
                        'inset(20% 0 70% 0)',
                        'inset(10% 0 60% 0)',
                    ]
                }}
                transition={{ duration: 0.3, repeat: Infinity, repeatDelay: Math.random() * 2 + 1, ease: "easeInOut" }}
            >
                {text}
            </motion.span>
        </div>
    );
};

// --- STICKY CTA BAR ---
const StickyCTABar: React.FC = () => {
    const [visible, setVisible] = useState(false);
    const { setActivePageId } = useNavigation();

    useEffect(() => {
        const handler = () => setVisible(window.scrollY > 400);
        window.addEventListener('scroll', handler, { passive: true });
        return () => window.removeEventListener('scroll', handler);
    }, []);

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ y: -80, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -80, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed top-0 left-0 right-0 z-[200] bg-black/95 backdrop-blur-xl border-b border-rhive-pink/30 shadow-[0_4px_30px_rgba(236,2,139,0.2)]"
                >
                    <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <span className="text-white font-black text-lg tracking-tighter uppercase italic">RHIVE</span>
                            <span className="text-gray-400 text-xs hidden sm:block tracking-widest uppercase border-l border-white/20 pl-3">Utah's #1 Roofing System</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <a href="tel:8014491451" className="flex items-center gap-2 text-white font-bold text-sm hover:text-rhive-pink transition-colors mr-2">
                                <Phone size={14} className="text-rhive-pink" />
                                <span className="hidden md:block">(801) 449-1451</span>
                            </a>
                            <button
                                onClick={() => setActivePageId('P-12')}
                                className="bg-rhive-pink text-white px-5 py-2 text-xs font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-[0_0_12px_rgba(236,2,139,0.4)]"
                            >
                                Free Estimate
                            </button>
                            <button
                                onClick={() => window.dispatchEvent(new CustomEvent('open-estimator', { detail: { protocol: 'EMERGENCY BREACH' } }))}
                                className="bg-red-600 text-white px-5 py-2 text-xs font-black uppercase tracking-widest hover:bg-red-500 transition-all animate-pulse"
                            >
                                🚨 Emergency
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

// --- CUSTOM INTERACTIVE COMPARISON DIAGRAM ---
const CustomComparisonDiagram: React.FC = () => {
    return (
        <div className="w-full relative border border-white/10 bg-black/60 rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(236,2,139,0.1)] group">
            <div className="absolute top-0 left-0 w-1 h-full bg-rhive-pink shadow-[0_0_10px_rgba(236,2,139,1)]" />
            <img 
                src="https://static.wixstatic.com/media/c5862a_7e539a778fd84771b8327f43dfc7dd0a~mv2.png/v1/fill/w_1200,h_675,al_c,q_90/dd.png" 
                alt="Standard Contractor vs RHIVE comparison flow chart" 
                className="w-full h-auto object-cover block transition-transform duration-700 group-hover:scale-[1.01]" 
            />
        </div>
    );
};

// --- MAIN PAGE ---
const PublicHomepageV3: React.FC = () => {
    const { setActivePageId } = useNavigation();
    const [intakeTab, setIntakeTab] = useState<'emergency' | 'estimate' | 'quote'>('estimate');
    const [activeLightbox, setActiveLightbox] = useState<string | null>(null);
    const [capexSqft, setCapexSqft] = useState<number>(15000);
    const [capexComplexity, setCapexComplexity] = useState<'low' | 'medium' | 'high'>('medium');
    const [capexAge, setCapexAge] = useState<number>(10);

    const emergencyInputRef = useRef<HTMLInputElement>(null);
    const emergencyAutocompleteRef = useRef<any>(null);
    const [emergencyAddress, setEmergencyAddress] = useState('');
    const isApiReady = useGoogleMapsApi();

    useEffect(() => {
        if (!isApiReady || !emergencyInputRef.current || !window.google || !window.google.maps.places) return;
        if (emergencyAutocompleteRef.current) return;

        const autocomplete = new window.google.maps.places.Autocomplete(emergencyInputRef.current, {
            types: ['address'],
            fields: ['formatted_address'],
            componentRestrictions: { country: 'us' }
        });

        autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();
            if (place.formatted_address) {
                setEmergencyAddress(place.formatted_address);
            } else if (emergencyInputRef.current) {
                setEmergencyAddress(emergencyInputRef.current.value);
            }
        });

        emergencyAutocompleteRef.current = autocomplete;

        return () => {
            if (emergencyAutocompleteRef.current) {
                window.google.maps.event.clearInstanceListeners(emergencyAutocompleteRef.current);
                emergencyAutocompleteRef.current = null;
            }
        };
    }, [isApiReady, intakeTab]);

    useEffect(() => {
        const handleOpenLightbox = (e: any) => {
            if (e.detail) {
                setActiveLightbox(e.detail);
            }
        };
        window.addEventListener('v3-open-lightbox', handleOpenLightbox);
        return () => window.removeEventListener('v3-open-lightbox', handleOpenLightbox);
    }, []);

    return (
        <div className="relative w-full min-h-screen font-sans bg-black text-white overflow-x-hidden">
            <StickyCTABar />
            <RhiveHeader />

            {/* Background Video Layer */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover"
                    style={{ transform: 'scale(1.12) translate(-3%, -3%)', transformOrigin: 'top left' }}
                >
                    <source src="/vidupload/compressed_tradeshow_video.mp4" type="video/mp4" />
                </video>
            </div>

            {/* 85% Black Overlay Layer */}
            <div className="fixed inset-0 bg-black/85 pointer-events-none z-0" />

            {/* Living Plexus Background Layer */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-80">
                <PlexusShape 
                    backgroundColor="transparent" 
                    dotColor="#ec028b" 
                    lineColor="236, 2, 139" 
                    density={120} 
                />
            </div>

            {/* ── HERO SECTION (INTAKE) ─────────────────────────────────────── */}
            <section id="hero" className="relative min-h-[90vh] flex flex-col items-center justify-center pt-36 pb-24 overflow-hidden z-10">
                <div className="container mx-auto px-6 text-center flex flex-col items-center max-w-5xl">

                    <h1 className="text-6xl md:text-8xl lg:text-9xl font-sans font-normal uppercase leading-[0.85] tracking-tighter mb-8">
                        <GlitchText text="FINISH ON TOP" className="animate-text-gradient-white drop-shadow-[0_0_30px_rgba(236,2,139,0.3)]" />
                        <img 
                            src="https://firebasestorage.googleapis.com/v0/b/video-qr-automator.firebasestorage.app/o/Website%20Media%20Assets%2FImages%2Frhive%20pink%20icon.png?alt=media&token=a9982468-9ba9-498c-bd49-d2f6c1b9f4d1"
                            alt="RHIVE Icon"
                            className="inline-block h-[0.7em] w-auto align-top ml-3 drop-shadow-[0_0_15px_rgba(236,2,139,0.8)]"
                        />
                    </h1>

                    <p className="text-lg md:text-xl font-medium text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed font-serif italic">
                        Advanced aerial mapping to manufacturer-certified installation.<br />
                        <span className="text-white font-bold not-italic">100% transparent costs, 100% satisfaction, zero surprises.</span>
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-4 mb-12 relative z-20">
                        <button 
                            onClick={() => setActiveLightbox('rhive-ai')}
                            className="text-xs font-mono tracking-widest uppercase text-white hover:text-rhive-pink underline transition-all duration-300 flex items-center gap-2"
                        >
                            <Zap size={12} className="text-rhive-pink animate-pulse" />
                            Built by RHIVE.AI
                        </button>
                        <button 
                            onClick={() => {
                                const processEl = document.getElementById('process');
                                processEl?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="text-xs font-mono tracking-widest uppercase text-slate-300 hover:text-rhive-pink underline transition-all duration-300 flex items-center gap-2"
                        >
                            View Our 10-Stage 'Zero Surprises' Process
                            <ArrowRight size={12} />
                        </button>
                    </div>

                    {/* Interactive Tab Control */}
                    <div className="w-full max-w-2xl bg-white/5 border border-white/10 p-1.5 rounded-full flex gap-1 mb-2 relative z-20">
                        <button
                            onClick={() => setIntakeTab('emergency')}
                            className={cn(
                                "flex-1 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2",
                                intakeTab === 'emergency' ? "bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]" : "text-gray-400 hover:text-white"
                            )}
                        >
                            <AlertTriangle size={14} />
                            Emergency Leak
                        </button>
                        <button
                            onClick={() => setIntakeTab('estimate')}
                            className={cn(
                                "flex-1 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2",
                                intakeTab === 'estimate' ? "bg-[#ec028b] text-white shadow-[0_0_15px_rgba(236,2,139,0.4)]" : "text-gray-400 hover:text-white"
                            )}
                        >
                            <Zap size={14} />
                            Instant Estimate
                        </button>
                        <button
                            onClick={() => setIntakeTab('quote')}
                            className={cn(
                                "flex-1 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2",
                                intakeTab === 'quote' ? "bg-[#e2ab49] text-black shadow-[0_0_15px_rgba(226,171,73,0.4)]" : "text-gray-400 hover:text-white"
                            )}
                        >
                            <CheckCircle2 size={14} />
                            Certified Quote
                        </button>
                    </div>

                    <div className="w-full relative z-10">
                        {intakeTab === 'emergency' ? (
                            <div className="w-full max-w-2xl mx-auto mt-8 p-6 bg-red-950/20 border border-red-500/30 rounded-2xl text-left flex flex-col sm:flex-row justify-between items-center gap-6 animate-fade-in">
                                <div className="flex-1">
                                    <h4 className="text-red-400 font-bold uppercase text-sm tracking-wider flex items-center gap-2">
                                        <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                                        Active Leak Detected?
                                    </h4>
                                    <p className="text-gray-400 text-xs mt-1">Our emergency dispatch protocol provides rapid containment within 2-4 hours.</p>
                                    <button 
                                        type="button"
                                        onClick={() => setActiveLightbox('emergency')}
                                        className="text-[10px] text-red-400 hover:text-red-300 font-mono uppercase tracking-widest underline mt-2 block"
                                    >
                                        Learn More: 90-Day Tarps & Free Audits
                                    </button>
                                </div>
                                <div className="flex flex-col gap-3 w-full sm:w-[320px] shrink-0">
                                    <input
                                        ref={emergencyInputRef}
                                        type="text"
                                        placeholder={isApiReady ? "ENTER EMERGENCY ADDRESS..." : "INITIALIZING..."}
                                        value={emergencyAddress}
                                        onChange={(e) => setEmergencyAddress(e.target.value)}
                                        className="w-full bg-black/60 border border-red-500/30 focus:border-red-500 p-4 rounded-lg text-xs font-black uppercase tracking-widest outline-none text-red-400 placeholder-red-500/50 shadow-[0_0_10px_rgba(220,38,38,0.1)] focus:shadow-[0_0_15px_rgba(220,38,38,0.3)] transition-all duration-300"
                                    />
                                    <button
                                        onClick={() => {
                                            if (emergencyAddress) {
                                                window.dispatchEvent(new CustomEvent('open-estimator', { 
                                                    detail: { 
                                                        protocol: 'EMERGENCY BREACH',
                                                        address: emergencyAddress
                                                    } 
                                                }));
                                            } else {
                                                emergencyInputRef.current?.focus();
                                            }
                                        }}
                                        className="w-full py-4 bg-red-600 hover:bg-red-500 active:scale-95 text-white font-black uppercase text-xs tracking-widest transition-all shadow-[0_0_15px_rgba(220,38,38,0.5)] shrink-0"
                                        style={{ clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)' }}
                                    >
                                        Report Emergency Leak
                                    </button>
                                </div>
                            </div>
                        ) : intakeTab === 'quote' ? (
                            <AddressScanInput 
                                id="v3-intake-scanner" 
                                placeholder="ENTER PROPERTY ADDRESS FOR CERTIFIED BID"
                                buttonText="Build Certified Quote"
                                themeColor="gold"
                            />
                        ) : (
                            <AddressScanInput 
                                id="v3-intake-scanner" 
                                placeholder="ENTER PROJECT ADDRESS FOR INSTANT BALLPARK"
                                buttonText="Scan My Roof"
                                themeColor="pink"
                            />
                        )}
                    </div>
                </div>
            </section>

            {/* ── CAPABILITY CATALOG (SERVICES) ─────────────────────────────── */}
            <section id="services" className="py-32 px-6 border-t border-white/5 bg-black/40 z-10 relative">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-20 text-left">
                        <span className="font-mono text-xs uppercase tracking-widest mb-3 block animate-text-gradient-pink">// CAPABILITIES</span>
                        <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4 animate-text-gradient-white">Capability Catalog.</h2>
                        <div className="w-20 h-1 bg-rhive-pink" />
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            {
                                id: "commercial",
                                title: "Commercial / Industrial",
                                icon: Building2,
                                desc: "Industrial-grade flat roof deployment. High-tensile PVC and TPO membranes, heat-welded for 100% molecular integration. Built for NDL warranty readiness.",
                                btn: "Interactive CAPEX Estimate"
                            },
                            {
                                id: "residential",
                                title: "Residential Roofing",
                                icon: Home,
                                desc: "The highest standard for steep-slope infrastructure. We deploy Owens Corning Duration systems with integrated ice-and-water shields and California Cut valleys.",
                                btn: "Configure System"
                            },
                            {
                                id: "gutters",
                                title: "Seamless Gutters",
                                icon: Droplets,
                                desc: "Custom-extruded 6\" K-Style systems. Precision-mitered corners and high-flow downspouts designed to evacuate max-volume storm events.",
                                btn: "Explore Gutter Specs"
                            },
                            {
                                id: "icedefense",
                                title: "Thermal Ice Defense",
                                icon: Wind,
                                desc: "Thermal protection for critical infrastructure. Industrial heat cables and low-profile snow retention systems designed to prevent ice-dam catastrophe.",
                                btn: "Explore Ice Specs"
                            },
                            {
                                id: "solar",
                                title: "Solar Integration",
                                icon: Zap,
                                desc: "Certified decoupling, safe off-roof storage, and complete reinstallation of solar arrays during roofing projects to avoid split liability.",
                                btn: "Explore Solar Specs"
                            },
                            {
                                id: "portfolio",
                                title: "Portfolio Management",
                                icon: Store,
                                desc: "Comprehensive structural monitoring, routine health checks, automated drone flight mappings, and 10-year forecasting logs for asset managers.",
                                btn: "Access Portfolio Auditor"
                            }
                        ].map((srv, idx) => (
                            <div
                                key={idx}
                                onClick={() => setActiveLightbox(srv.id)}
                                className="relative bg-white/[0.01] hover:bg-white/[0.03] border border-white/5 hover:border-rhive-pink/30 p-10 flex flex-col justify-between group transition-all duration-500 cursor-pointer"
                                style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0 100%)' }}
                            >
                                <div>
                                    <div className="text-rhive-pink mb-8 group-hover:scale-110 transition-transform w-fit">
                                        <srv.icon size={36} />
                                    </div>
                                    <h3 className="text-xl font-bold uppercase mb-4 text-white font-display tracking-tight">{srv.title}</h3>
                                    <p className="text-gray-400 text-sm leading-relaxed mb-8">{srv.desc}</p>
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveLightbox(srv.id);
                                    }}
                                    className="text-[10px] font-bold uppercase tracking-widest text-rhive-pink border-b border-rhive-pink/20 pb-1 hover:border-rhive-pink transition-all w-fit bg-transparent text-left"
                                >
                                    {srv.btn}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── ABOUT RHIVE & COMPARISON ──────────────────────────────────── */}
            <section id="about" className="py-32 px-6 max-w-7xl mx-auto z-10 relative">
                <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-16 items-start mb-20">
                    <div className="space-y-8">
                        <div className="inline-block border border-rhive-pink/30 px-6 py-2 rounded-full bg-rhive-pink/10 shadow-[0_0_20px_rgba(236,2,139,0.3)]">
                            <span className="font-bold text-xs tracking-[0.4em] uppercase animate-text-gradient-pink">The Core Mission</span>
                        </div>
                        <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-tight animate-text-gradient-white border-b border-white/5 pb-6">
                            About RHIVE
                        </h2>
                        <p className="text-2xl leading-snug font-serif italic text-gray-300">
                            We're not just a roofing company. <br />We're a revolution in construction.
                        </p>
                        <div className="text-gray-400 text-base leading-relaxed font-serif space-y-6">
                            <p>RHIVE Construction is a proudly female-owned and operated company specializing in residential and commercial roofing. But roofing is only the beginning of our story.</p>
                            <p>We were built to challenge an industry known for inflated pricing, vague bids, poor communication, and short-lived warranties. RHIVE exists to flip that script—with honesty, precision, and care. We bring a new standard to the industry: one rooted in transparency, technology, and trust.</p>
                        </div>
                        <button
                            onClick={() => setActiveLightbox('about')}
                            className="bg-transparent hover:bg-white/5 border border-white/20 hover:border-white/40 text-white font-black uppercase text-xs tracking-widest py-3 px-8 rounded-full transition-all inline-block mt-4"
                        >
                            Read Full Story &amp; Mission
                        </button>
                    </div>
                    {/* Glowing Logo Circle accent */}
                    <div className="flex justify-center lg:justify-end items-center h-full pt-12 lg:pt-0">
                        <div 
                            onClick={() => setActiveLightbox('about')}
                            className="relative w-72 h-72 rounded-full bg-black border border-rhive-pink/40 flex items-center justify-center shadow-[0_0_50px_rgba(236,2,139,0.15)] group overflow-hidden cursor-pointer hover:border-rhive-pink transition-all"
                        >
                            <div className="absolute inset-0 bg-gradient-to-tr from-rhive-pink/20 via-transparent to-rhive-blue/20 animate-pulse" />
                            <div className="relative z-10 text-center flex flex-col items-center">
                                <Zap className="text-rhive-pink mb-4 animate-bounce" size={48} />
                                <span className="text-2xl font-black italic tracking-tighter text-white">RHIVE</span>
                                <span className="text-[9px] font-mono tracking-widest text-slate-500 uppercase mt-1">Specialists</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Pricing Comparison Diagram */}
                <CustomComparisonDiagram />
            </section>

            {/* ── PROCESS TIMELINE (10 STAGES) ───────────────────────────────── */}
            <section id="process" className="py-32 px-6 border-y border-white/5 bg-white/[0.01] z-10 relative">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <div className="inline-block border border-rhive-blue/50 px-4 py-1 rounded-full text-xs font-bold tracking-[0.2em] mb-4 uppercase bg-[#08137C]/10 shadow-[0_0_15px_rgba(8,19,124,0.2)]">
                            <span className="animate-text-gradient-white">Zero Surprises Promise</span>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter animate-text-gradient-white">The 10-Stage Journey</h2>
                        <p className="text-gray-400 text-sm mt-3 max-w-xl mx-auto">Tracked, streamed, and audited transparency at every single mile-marker.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { step: "01", title: "LEAD", desc: "Digital intake. Drone flights and Google Solar API overlays analyze property geometry." },
                            { step: "02", title: "ESTIMATE", desc: "Instant ballpark metrics. Automated calculations establish a financial baseline." },
                            { step: "03", title: "QUOTE", desc: "Certified proposal. Full SKU transparency. Material, labor, and profit margins itemized." },
                            { step: "04", title: "SIGN & VERIFY", desc: "Agreement sealed. 50% deposit triggers dispatch. Your secure client Ghost Link is unlocked." }
                        ].map((stg, idx) => (
                            <div 
                                key={idx} 
                                onClick={() => setActiveLightbox('process')}
                                className="bg-black/50 border border-white/5 p-8 rounded-xl hover:border-rhive-blue transition-colors duration-300 cursor-pointer hover:bg-black/80 hover:border-rhive-blue/60"
                            >
                                <div className="w-10 h-10 rounded-full border border-rhive-blue/50 flex items-center justify-center font-bold text-xs text-white mb-6 bg-[#08137C]/10 shadow-[0_0_10px_rgba(8,19,124,0.3)]">
                                    {stg.step}
                                </div>
                                <h3 className="text-lg font-bold text-white uppercase mb-2 font-display">{stg.title}</h3>
                                <p className="text-gray-400 text-xs leading-relaxed">{stg.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-12">
                        <button
                            onClick={() => setActiveLightbox('process')}
                            className="bg-transparent hover:bg-white/5 border border-white/20 hover:border-white/40 text-white font-black uppercase text-xs tracking-widest py-4 px-10 rounded-full transition-all"
                        >
                            View All 10 Stages
                        </button>
                    </div>
                </div>
            </section>

            {/* ── FINANCING (0% APR & 50/40/10) ──────────────────────────────── */}
            <section id="financing" className="py-32 px-6 max-w-7xl mx-auto z-10 relative">
                <div className="text-center mb-20">
                    <span className="font-mono text-xs uppercase tracking-widest mb-3 block animate-text-gradient-pink">// CAPITAL &amp; LOGIC</span>
                    <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter animate-text-gradient-white">0% APR for 18 Months.</h2>
                    <p className="text-gray-400 text-sm mt-3 max-w-xl mx-auto">Lending structures engineered to optimize capital allocation without interest friction.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {/* RPSP Credit Card */}
                    <div className="bg-white/[0.01] border border-white/5 p-10 rounded-2xl hover:border-rhive-pink/30 transition-all duration-300">
                        <h4 className="text-2xl font-black text-white uppercase italic mb-4">The RPSP Credit</h4>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6">
                            Traditional quotes hide the cost of marketing and follow-ups. Commit within 48 hours, and we credit that 10% &quot;Chase Cost&quot; back to your project instantly.
                        </p>
                        <div className="h-px w-full bg-white/5 my-6" />
                        <div className="flex justify-between items-center">
                            <span className="font-mono text-xs text-gray-500 uppercase">Efficiency Savings</span>
                            <span className="text-lg font-bold text-rhive-pink">-10% OFF</span>
                        </div>
                    </div>

                    {/* 50/40/10 Logic */}
                    <div className="bg-white/[0.01] border border-white/5 p-10 rounded-2xl hover:border-rhive-blue/30 transition-all duration-300">
                        <h4 className="text-2xl font-black text-white uppercase italic mb-4">The 50/40/10 Logic</h4>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6">
                            A transparent payment breakdown to ensure mutual protection. 50% Material Deposit, 40% Upon Roof Completion, 10% After Final QC Punch List.
                        </p>
                        <button
                            onClick={() => setActivePageId('P-04')}
                            className="w-full bg-[#08137C] hover:bg-[#08137C]/80 active:scale-95 text-white font-black uppercase text-xs tracking-widest py-4 rounded-lg transition-all shadow-[0_0_15px_rgba(8,19,124,0.3)]"
                        >
                            View Lending Matrix
                        </button>
                    </div>
                </div>
            </section>

            {/* ── GOOGLE TESTIMONIALS ────────────────────────────────────────── */}
            <section className="py-24 border-t border-white/5 bg-black/60 z-10 relative">
                <GoogleTestimonials />
            </section>

            {/* ── CAREERS (JOIN THE HIVE) ────────────────────────────────────── */}
            <section id="careers" className="py-32 px-6 max-w-5xl mx-auto text-center z-10 relative">
                <div className="inline-block border border-rhive-pink/30 px-6 py-2 rounded-full bg-rhive-pink/10 mb-6 shadow-[0_0_20px_rgba(236,2,139,0.3)]">
                    <span className="font-bold text-xs tracking-[0.4em] uppercase animate-text-gradient-pink">Join The Hive</span>
                </div>
                <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter animate-text-gradient-white mb-6">Our Hive is a Movement.</h2>
                <p className="text-gray-300 text-lg md:text-xl font-serif italic max-w-2xl mx-auto leading-relaxed mb-12">
                    Every roof we install supports a bigger mission. At RHIVE, a percentage of every project goes directly into community reinvestment, workforce development, and giving back.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={() => setActivePageId('P-10')}
                        className="group flex items-center justify-center gap-3 bg-rhive-pink hover:brightness-110 active:scale-95 text-white px-10 py-5 font-black uppercase tracking-widest text-xs transition-all shadow-[0_0_25px_rgba(236,2,139,0.4)]"
                    >
                        Explore Careers
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button
                        onClick={() => setActivePageId('P-11')}
                        className="flex items-center justify-center gap-3 border border-white/20 bg-white/5 hover:bg-white/10 text-white px-10 py-5 font-black uppercase tracking-widest text-xs transition-all"
                    >
                        Apply Online
                    </button>
                </div>
            </section>

            {/* ── GLOBAL FOOTER ──────────────────────────────────────────────── */}
            <footer id="contact" className="bg-black py-16 px-6 border-t border-white/10 relative z-10">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-3">
                        <Zap className="text-rhive-pink animate-pulse" size={24} />
                        <span className="text-2xl font-black text-white italic tracking-tighter uppercase">RHIVE</span>
                    </div>
                    <p className="text-xs font-mono text-slate-500 uppercase tracking-widest text-center leading-loose">
                        © 2026 RHIVE CONSTRUCTION LLC. ALL RIGHTS RESERVED.<br />
                        SOUTH JORDAN, UT // POCATELLO, ID // POWERED BY RHIVE'S AI ARCHITECT
                    </p>
                    <div className="flex gap-4">
                        <span className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-slate-400 hover:text-white cursor-pointer hover:border-white transition-all text-xs font-mono">IG</span>
                        <span className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-slate-400 hover:text-white cursor-pointer hover:border-white transition-all text-xs font-mono">FB</span>
                    </div>
                </div>
            </footer>

            {/* ── LIGHTBOX MODAL OVERLAYS ───────────────────────────────────── */}
            <AnimatePresence>
                {activeLightbox && (
                    <div className="fixed inset-0 z-[1000] isolate">
                        <LightboxNavigation onClose={() => setActiveLightbox(null)} />
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 p-4 py-24 bg-black/90 backdrop-blur-xl overflow-y-auto scrollbar-hide"
                            onClick={() => setActiveLightbox(null)}
                        >
                        <motion.div
                            initial={{ scale: 0.9, y: 20, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 0.9, y: 20, opacity: 0 }}
                            transition={{ type: "spring", damping: 25, stiffness: 180 }}
                            className="relative w-full max-w-4xl mx-auto bg-black border border-white/10 p-8 md:p-16 text-left isolate overflow-hidden shadow-[0_0_50px_rgba(236,2,139,0.15)]"
                            style={{ clipPath: 'polygon(32px 0, 100% 0, 100% calc(100% - 32px), calc(100% - 32px) 100%, 0 100%, 0 32px)' }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Top Accent Lines */}
                            <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-rhive-pink to-transparent opacity-50" />
                            <div className="absolute bottom-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-rhive-blue to-transparent opacity-50" />

                            {/* Content based on active state */}
                            {activeLightbox === 'emergency' && (
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] animate-text-gradient-red">// EMERGENCY MITIGATION</div>
                                    <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tight animate-text-gradient-white">Active Leak Containment Protocol</h3>
                                    <p className="text-gray-400 font-serif italic text-base leading-relaxed">
                                        Utah's most responsive emergency damage control pipeline. We deploy certified specialists to isolate, protect, and document water intrusion events in real-time.
                                    </p>
                                    <div className="grid md:grid-cols-3 gap-6 pt-4">
                                        <div className="border border-red-500/20 bg-red-950/10 p-5 rounded-lg">
                                            <h4 className="font-bold text-white uppercase text-xs tracking-wider mb-2">90-Day Emergency Tarping</h4>
                                            <p className="text-gray-500 text-xs leading-relaxed">Heavy-duty heat-shrink plastic wrap or 12-mil structural tarps secured to withstand Utah's highest wind events for up to 90 days.</p>
                                        </div>
                                        <div className="border border-white/5 bg-white/[0.01] p-5 rounded-lg">
                                            <h4 className="font-bold text-white uppercase text-xs tracking-wider mb-2">Targeted Leak Repair</h4>
                                            <p className="text-gray-500 text-xs leading-relaxed">Immediate localized mitigation of cracked shingles, rusted valleys, deteriorated pipe jacks, or membrane breaches to halt damage immediately.</p>
                                        </div>
                                        <div className="border border-white/5 bg-white/[0.01] p-5 rounded-lg">
                                            <h4 className="font-bold text-white uppercase text-xs tracking-wider mb-2">Zero-Cost Assessments</h4>
                                            <p className="text-gray-500 text-xs leading-relaxed">Comprehensive high-resolution drone audits and interior moisture maps generated for property owners free of charge.</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-4 pt-6">
                                        <button
                                            onClick={() => {
                                                window.dispatchEvent(new CustomEvent('open-estimator', { detail: { protocol: 'EMERGENCY BREACH' } }));
                                                setActiveLightbox(null);
                                            }}
                                            className="px-8 py-4 bg-red-600 hover:bg-red-500 text-white font-black uppercase text-xs tracking-widest transition-all shadow-[0_0_15px_rgba(220,38,38,0.4)] cursor-pointer"
                                            style={{ clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)' }}
                                        >
                                            Trigger Dispatch Protocol
                                        </button>
                                        <button
                                            onClick={() => setActiveLightbox(null)}
                                            className="px-8 py-4 border border-white/20 hover:bg-white/5 text-white font-black uppercase text-xs tracking-widest transition-all cursor-pointer"
                                            style={{ clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)' }}
                                        >
                                            Dismiss Protocol
                                        </button>
                                    </div>
                                </div>
                            )}

                            {activeLightbox === 'commercial' && (
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] animate-text-gradient-pink">// COMMERCIAL MATRIX</div>
                                    <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tight animate-text-gradient-white">Commercial Membrane Systems &amp; CAPEX Planner</h3>
                                    <p className="text-gray-400 font-serif italic text-base leading-relaxed">
                                        High-tensile PVC and TPO deployments designed for extreme temperature tolerances and flat-roof drainage profiles. Itemized manufacturer certification and NDL warranty integration.
                                    </p>

                                    {/* 10-Year CAPEX Calculator Tool (Teaser) */}
                                    <div className="border border-white/10 bg-white/[0.01] p-6 rounded-xl space-y-6">
                                        <div className="flex items-center justify-between border-b border-white/5 pb-3">
                                            <h4 className="text-white font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                                                <Zap size={14} className="text-rhive-pink" /> 10-Year Interactive CAPEX Estimator
                                            </h4>
                                            <span className="text-[10px] font-mono text-gray-500 uppercase">Interactive Algorithm Node</span>
                                        </div>

                                        <div className="grid md:grid-cols-3 gap-6">
                                            {/* Step 1: Sqft */}
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Roof Square Footage: {capexSqft.toLocaleString()} sqft</label>
                                                <input 
                                                    type="range" 
                                                    min="5000" 
                                                    max="100000" 
                                                    step="5000"
                                                    value={capexSqft}
                                                    onChange={(e) => setCapexSqft(Number(e.target.value))}
                                                    className="w-full accent-rhive-pink cursor-pointer"
                                                />
                                                <span className="text-[9px] text-gray-600 font-mono block">Range: 5k - 100k sqft</span>
                                            </div>

                                            {/* Step 2: Complexity */}
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Complexity Profile</label>
                                                <div className="flex gap-2">
                                                    {(['low', 'medium', 'high'] as const).map(c => (
                                                        <button
                                                            key={c}
                                                            onClick={() => setCapexComplexity(c)}
                                                            className={cn(
                                                                "flex-1 py-2 text-[10px] font-black uppercase tracking-wider transition-all border cursor-pointer",
                                                                capexComplexity === c 
                                                                    ? "border-rhive-pink bg-rhive-pink/10 text-white" 
                                                                    : "border-white/10 bg-transparent text-gray-500 hover:border-white/20 hover:text-white"
                                                            )}
                                                            style={{ clipPath: 'polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)' }}
                                                        >
                                                            {c}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Step 3: Age */}
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Current Roof Age: {capexAge} Years</label>
                                                <input 
                                                    type="range" 
                                                    min="0" 
                                                    max="25" 
                                                    step="1"
                                                    value={capexAge}
                                                    onChange={(e) => setCapexAge(Number(e.target.value))}
                                                    className="w-full accent-rhive-blue cursor-pointer"
                                                />
                                                <span className="text-[9px] text-gray-600 font-mono block">Range: 0 - 25 years</span>
                                            </div>
                                        </div>

                                        {/* Outputs */}
                                        <div className="grid md:grid-cols-3 gap-4 p-4 bg-black/60 border border-white/5 rounded-lg">
                                            <div className="flex flex-col text-center md:text-left">
                                                <span className="text-[9px] font-mono text-gray-500 uppercase">Estimated Install Cost</span>
                                                <span className="text-xl font-black text-white mt-1">
                                                    ${(capexSqft * (capexComplexity === 'low' ? 7.5 : capexComplexity === 'medium' ? 9.5 : 12.5)).toLocaleString()}
                                                </span>
                                            </div>
                                            <div className="flex flex-col text-center md:text-left border-y md:border-y-0 md:border-x border-white/5 py-3 md:py-0 md:px-4">
                                                <span className="text-[9px] font-mono text-gray-500 uppercase">10-Yr Projected Maintenance</span>
                                                <span className="text-xl font-black text-rhive-pink mt-1">
                                                    ${Math.round(capexSqft * 0.4 * (capexAge / 10 + 1) * (capexComplexity === 'low' ? 1.0 : capexComplexity === 'medium' ? 1.25 : 1.5)).toLocaleString()}
                                                </span>
                                            </div>
                                            <div className="flex flex-col text-center md:text-left">
                                                <span className="text-[9px] font-mono text-gray-500 uppercase">Estimated NDL Warranty</span>
                                                <span className="text-xl font-black text-white mt-1">
                                                    {capexComplexity === 'high' ? 15 : 20} Years
                                                </span>
                                            </div>
                                        </div>
                                        <p className="text-[10px] text-gray-500 font-serif italic text-center">
                                            *CAPEX estimate model based on typical Pocatello, ID / South Jordan, UT baseline system data. Final SKU scope is determined during certified physical audits.
                                        </p>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                        <button
                                            onClick={() => {
                                                setActivePageId('P-12');
                                                setActiveLightbox(null);
                                            }}
                                            className="px-8 py-4 bg-rhive-pink text-white font-black uppercase text-xs tracking-widest transition-all shadow-[0_0_15px_rgba(236,2,139,0.3)] cursor-pointer"
                                            style={{ clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)' }}
                                        >
                                            Schedule Commercial Site Audit
                                        </button>
                                        <button
                                            onClick={() => {
                                                setActivePageId('P-02b');
                                                setActiveLightbox(null);
                                            }}
                                            className="px-8 py-4 border border-white/20 hover:bg-white/5 text-white font-black uppercase text-xs tracking-widest transition-all cursor-pointer"
                                            style={{ clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)' }}
                                        >
                                            Explore Membrane Systems
                                        </button>
                                    </div>
                                </div>
                            )}

                            {activeLightbox === 'residential' && (
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] animate-text-gradient-pink">// RESIDENTIAL INFRASTRUCTURE</div>
                                    <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tight animate-text-gradient-white">Steep-Slope Residential Systems</h3>
                                    <p className="text-gray-400 font-serif italic text-base leading-relaxed">
                                        Highest quality residential builds using Owens Corning Duration® shingles. Formulated with patented SureNail® Technology for maximum grip and wind resistance.
                                    </p>
                                    <div className="grid md:grid-cols-2 gap-6 pt-4">
                                        <div className="border border-white/5 bg-white/[0.01] p-6 rounded-lg space-y-3">
                                            <h4 className="font-bold text-white uppercase text-xs tracking-wider flex items-center gap-2">
                                                <BadgeCheck size={14} className="text-rhive-pink" /> Manufacturer Lifetime Warranty
                                            </h4>
                                            <p className="text-gray-500 text-xs leading-relaxed">As an Owens Corning Platinum Preferred Contractor, we secure a 50-year non-prorated system warranty on materials and labor, backed by the manufacturer directly.</p>
                                        </div>
                                        <div className="border border-white/5 bg-white/[0.01] p-6 rounded-lg space-y-3">
                                            <h4 className="font-bold text-white uppercase text-xs tracking-wider flex items-center gap-2">
                                                <Shield size={14} className="text-rhive-pink" /> 10-Point Leak Shield Integrity
                                            </h4>
                                            <p className="text-gray-500 text-xs leading-relaxed">Every valley is reinforced with 28-gauge steel valleys and WeatherLock® ice &amp; water self-adhering membranes extending 24 inches past interior warm wall lines.</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-4 pt-6">
                                        <button
                                            onClick={() => {
                                                setActivePageId('P-12');
                                                setActiveLightbox(null);
                                            }}
                                            className="px-8 py-4 bg-rhive-pink text-white font-black uppercase text-xs tracking-widest transition-all shadow-[0_0_15px_rgba(236,2,139,0.3)] cursor-pointer"
                                            style={{ clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)' }}
                                        >
                                            Configure Residential Quote
                                        </button>
                                        <button
                                            onClick={() => {
                                                setActivePageId('P-02a-1');
                                                setActiveLightbox(null);
                                            }}
                                            className="px-8 py-4 border border-white/20 hover:bg-white/5 text-white font-black uppercase text-xs tracking-widest transition-all cursor-pointer"
                                            style={{ clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)' }}
                                        >
                                            View Duration Shingles
                                        </button>
                                    </div>
                                </div>
                            )}

                            {activeLightbox === 'gutters' && (
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] animate-text-gradient-pink">// DRAINAGE SCIENCE</div>
                                    <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tight animate-text-gradient-white">Seamless Gutters &amp; High-Volume Evacuation</h3>
                                    <p className="text-gray-400 font-serif italic text-base leading-relaxed">
                                        Custom-extruded seamless systems fabricated directly on-site to exact millimeter measurements. Designed to protect foundations and landscaping from heavy Utah snow melts.
                                    </p>
                                    <div className="p-5 border border-[#ec028b]/20 bg-[#ec028b]/5 text-[#ec028b] font-mono text-xs uppercase tracking-wider rounded-lg">
                                        ⚠️ Gutter scopes are managed as system-integrated add-ons or upgrades. There is no standalone gutter service page.
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="border border-white/5 bg-white/[0.01] p-5 rounded-lg">
                                            <h4 className="font-bold text-white uppercase text-xs tracking-wider mb-2">6-Inch Seamless Aluminum</h4>
                                            <p className="text-gray-500 text-xs leading-relaxed">Heavy-gauge aluminum extruded through our customized mobile machinery directly at your driveway, ensuring zero seams and leaks along lengths.</p>
                                        </div>
                                        <div className="border border-white/5 bg-white/[0.01] p-5 rounded-lg">
                                            <h4 className="font-bold text-white uppercase text-xs tracking-wider mb-2">High-Flow Spouts &amp; Leaf Defense</h4>
                                            <p className="text-gray-500 text-xs leading-relaxed">Designed with 3\"x4\" downspout columns and micro-mesh leaf screens to accommodate up to 14 inches of rainwater per hour.</p>
                                        </div>
                                    </div>
                                    <div className="pt-6 flex flex-col sm:flex-row gap-4">
                                        <button
                                            onClick={() => {
                                                setActivePageId('P-02c');
                                                setActiveLightbox(null);
                                            }}
                                            className="px-8 py-4 bg-rhive-pink text-white font-black uppercase text-xs tracking-widest transition-all shadow-[0_0_15px_rgba(236,2,139,0.3)] cursor-pointer"
                                            style={{ clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)' }}
                                        >
                                            Explore Gutter Systems
                                        </button>
                                        <button
                                            onClick={() => setActiveLightbox(null)}
                                            className="px-8 py-4 border border-white/20 hover:bg-white/5 text-white font-black uppercase text-xs tracking-widest transition-all cursor-pointer"
                                            style={{ clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)' }}
                                        >
                                            Dismiss Overview
                                        </button>
                                    </div>
                                </div>
                            )}

                            {activeLightbox === 'icedefense' && (
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] animate-text-gradient-pink">// THERMAL PROTECTION</div>
                                    <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tight animate-text-gradient-white">Thermal Ice Defense &amp; Snow Control</h3>
                                    <p className="text-gray-400 font-serif italic text-base leading-relaxed">
                                        Engineered thermal management designed to prevent ice dam backing, gutter sagging, and catastrophic snow slides on steep-slope roof sections.
                                    </p>
                                    <div className="p-5 border border-[#ec028b]/20 bg-[#ec028b]/5 text-[#ec028b] font-mono text-xs uppercase tracking-wider rounded-lg">
                                        ⚠️ Thermal tracing and snow brackets are custom configured during site audit. There is no standalone page.
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="border border-white/5 bg-white/[0.01] p-5 rounded-lg">
                                            <h4 className="font-bold text-white uppercase text-xs tracking-wider mb-2">Self-Regulating Heat Cables</h4>
                                            <p className="text-gray-500 text-xs leading-relaxed">Industrial-grade self-regulating heat trace cables woven into gutters, downspouts, and valley channels. Dynamically increases heat output as temperatures drop.</p>
                                        </div>
                                        <div className="border border-white/5 bg-white/[0.01] p-5 rounded-lg">
                                            <h4 className="font-bold text-white uppercase text-xs tracking-wider mb-2">Low-Profile Snow Retainers</h4>
                                            <p className="text-gray-500 text-xs leading-relaxed">Solid steel color-matched snow guards designed to lock sliding snow packs in place, allowing controlled water melt off without sudden avalanches.</p>
                                        </div>
                                    </div>
                                    <div className="pt-6 flex flex-col sm:flex-row gap-4">
                                        <button
                                            onClick={() => {
                                                setActivePageId('P-02d');
                                                setActiveLightbox(null);
                                            }}
                                            className="px-8 py-4 bg-rhive-pink text-white font-black uppercase text-xs tracking-widest transition-all shadow-[0_0_15px_rgba(236,2,139,0.3)] cursor-pointer"
                                            style={{ clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)' }}
                                        >
                                            Explore Ice Management
                                        </button>
                                        <button
                                            onClick={() => setActiveLightbox(null)}
                                            className="px-8 py-4 border border-white/20 hover:bg-white/5 text-white font-black uppercase text-xs tracking-widest transition-all cursor-pointer"
                                            style={{ clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)' }}
                                        >
                                            Dismiss Overview
                                        </button>
                                    </div>
                                </div>
                            )}

                            {activeLightbox === 'solar' && (
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] animate-text-gradient-pink">// SYSTEM INTEGRATION</div>
                                    <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tight animate-text-gradient-white">Certified Solar Decoupling &amp; Protection</h3>
                                    <p className="text-gray-400 font-serif italic text-base leading-relaxed">
                                        Certified Detachment, Safe Storage, and Complete Re-Commissioning of residential solar systems. We coordinate directly with local utility partners to eliminate split liability.
                                    </p>
                                    <div className="p-5 border border-white/10 bg-white/[0.01] rounded-lg">
                                        <h4 className="font-bold text-white uppercase text-xs tracking-wider mb-2">Why Certified Decoupling Matters</h4>
                                        <p className="text-gray-500 text-xs leading-relaxed">
                                            Most roofing contractors bypass solar, leaving you with split liability where the roofer blames the solar installer for leaks and the solar installer blames the roofer for system errors. RHIVE handles both scopes under a unified lifetime warranty.
                                        </p>
                                    </div>
                                    <div className="pt-6">
                                        <button
                                            onClick={() => setActiveLightbox(null)}
                                            className="px-8 py-4 bg-rhive-pink text-white font-black uppercase text-xs tracking-widest transition-all shadow-[0_0_15px_rgba(236,2,139,0.3)] cursor-pointer"
                                            style={{ clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)' }}
                                        >
                                            Include Solar Scope
                                        </button>
                                    </div>
                                </div>
                            )}

                            {activeLightbox === 'portfolio' && (
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] animate-text-gradient-pink">// PORTFOLIO MONITORING</div>
                                    <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tight animate-text-gradient-white">Commercial Asset Audits &amp; Inspections</h3>
                                    <p className="text-gray-400 font-serif italic text-base leading-relaxed">
                                        Designed for facility managers, property developers, and HOA boards managing multiple roof systems. Live structural integrity mapping, predictive leaks, and automated alerts.
                                    </p>
                                    <div className="grid md:grid-cols-2 gap-6 pt-4">
                                        <div className="border border-white/5 bg-white/[0.01] p-5 rounded-lg">
                                            <h4 className="font-bold text-white uppercase text-xs tracking-wider mb-2">Inspections &amp; Drone Flights</h4>
                                            <p className="text-gray-500 text-xs leading-relaxed">Schedule routine physical inspections. Our automated drone scans identify minor thermal variances and structural weaknesses before water breach happens.</p>
                                        </div>
                                        <div className="border border-white/5 bg-white/[0.01] p-5 rounded-lg">
                                            <h4 className="font-bold text-white uppercase text-xs tracking-wider mb-2">10-Year Lifecycle Forecasting</h4>
                                            <p className="text-gray-500 text-xs leading-relaxed">Track degradation data over all assets to generate itemized CAPEX replacement forecasts for your corporate financial sheets.</p>
                                        </div>
                                    </div>
                                    <div className="pt-6">
                                        <button
                                            onClick={() => {
                                                window.dispatchEvent(new CustomEvent('open-estimator', { detail: { protocol: 'PORTFOLIO AUDIT' } }));
                                                setActiveLightbox(null);
                                            }}
                                            className="px-8 py-4 bg-rhive-pink text-white font-black uppercase text-xs tracking-widest transition-all shadow-[0_0_15px_rgba(236,2,139,0.3)] cursor-pointer"
                                            style={{ clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)' }}
                                        >
                                            Request Portfolio Inspection
                                        </button>
                                    </div>
                                </div>
                            )}

                            {activeLightbox === 'rhive-ai' && (
                                <div className="space-y-8">
                                    <div className="grid md:grid-cols-[0.8fr_1.2fr] gap-8 md:gap-12 items-stretch">
                                        {/* Left Side: Animated Blob */}
                                        <div className="flex flex-col items-center justify-center bg-black/40 border border-white/5 p-6 rounded-xl relative overflow-hidden group">
                                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(236,2,139,0.1)_0%,transparent_70%)]" />
                                            
                                            <div className="ai-blob-container relative z-10 my-4">
                                                <div className="ai-blob-pulse absolute inset-0">
                                                    <div className="ai-blob-1 w-full h-full" />
                                                </div>
                                                <div className="ai-blob-2" />
                                                
                                                <div className="absolute w-4 h-4 rounded-full bg-white shadow-[0_0_20px_rgba(255,255,255,1),0_0_40px_rgba(236,2,139,1)] z-20" />
                                            </div>

                                            <div className="w-full mt-6 space-y-2 font-mono text-[10px] text-gray-500 uppercase tracking-widest relative z-10">
                                                <div className="flex justify-between border-b border-white/5 pb-1">
                                                    <span>AGENT CORE:</span>
                                                    <span className="text-rhive-pink animate-pulse">● ACTIVE / ONLINE</span>
                                                </div>
                                                <div className="flex justify-between border-b border-white/5 pb-1">
                                                    <span>MODEL STATE:</span>
                                                    <span className="text-white">DEEP-COGNITION v4.2</span>
                                                </div>
                                                <div className="flex justify-between border-b border-white/5 pb-1">
                                                    <span>DEVIATION ACCURACY:</span>
                                                    <span className="text-white">±0.003mm</span>
                                                </div>
                                                <div className="flex justify-between border-b border-white/5 pb-1">
                                                    <span>NEURAL LINK:</span>
                                                    <span className="text-rhive-gold">CONNECTED</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right Side: Text & Capabilities */}
                                        <div className="space-y-6 flex flex-col justify-center">
                                            <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] animate-text-gradient-pink">
                                                <Zap size={14} className="text-rhive-pink" /> // AUTONOMOUS INTEL ENGINE
                                            </div>
                                            <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tight leading-none">
                                                <GlitchText text="RHIVE AI AGENT" className="animate-text-gradient-white" />
                                            </h3>
                                            <p className="text-gray-300 font-serif italic text-sm md:text-base leading-relaxed max-w-[60ch]">
                                                Our proprietary neural orchestrator automates aerial cartography, instant quote compiling, and logistic dependencies with zero human latency.
                                            </p>
                                            
                                            <div className="space-y-4 pt-2">
                                                <div className="flex items-start gap-4 p-4 border border-white/5 bg-white/[0.02] hover:border-rhive-pink/30 hover:bg-white/[0.04] transition-all rounded-lg">
                                                    <div className="p-2 border border-rhive-pink/30 bg-rhive-pink/10 text-rhive-pink rounded">
                                                        <Laptop size={16} />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-white uppercase text-[10px] tracking-wider mb-1 font-sans">Autonomous Spatial Cartography</h4>
                                                        <p className="text-gray-400 text-xs leading-relaxed font-serif">
                                                            Processes multi-spectral satellite imagery and point-cloud aerial drone telemetry to calculate precise slope, height, and edge dimensions in under 3 minutes.
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-start gap-4 p-4 border border-white/5 bg-white/[0.02] hover:border-rhive-pink/30 hover:bg-white/[0.04] transition-all rounded-lg">
                                                    <div className="p-2 border border-rhive-pink/30 bg-rhive-pink/10 text-rhive-pink rounded">
                                                        <Sparkles size={16} />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-white uppercase text-[10px] tracking-wider mb-1 font-sans">Dynamic "Ceiling/Floor" Pricing</h4>
                                                        <p className="text-gray-400 text-xs leading-relaxed font-serif">
                                                            Instantly compiles shingle-waste matrices and labor cost floors to provide absolute price visibility, locked with a certified price guarantee.
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-start gap-4 p-4 border border-white/5 bg-white/[0.02] hover:border-rhive-pink/30 hover:bg-white/[0.04] transition-all rounded-lg">
                                                    <div className="p-2 border border-rhive-pink/30 bg-rhive-pink/10 text-rhive-pink rounded">
                                                        <Handshake size={16} />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-white uppercase text-[10px] tracking-wider mb-1 font-sans">Zero Surprises Scheduling</h4>
                                                        <p className="text-gray-400 text-xs leading-relaxed font-serif">
                                                            Directly coordinates manufacturer shipping logs, local permit nodes, and certified installation dispatch loops to completely bypass scheduling delays.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeLightbox === 'about' && (
                                <div className="space-y-8">
                                    <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] animate-text-gradient-pink">// COMPANY DNA</div>
                                    
                                    <div className="grid md:grid-cols-[1.2fr_0.8fr] gap-10 items-start">
                                        <div className="space-y-6 max-w-[65ch]">
                                            <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tight leading-[1.2] animate-text-gradient-white">The RHIVE Transparency Decree</h3>
                                            <p className="text-gray-300 font-serif italic text-base leading-[1.65]">
                                                RHIVE Construction is a proudly female-owned and operated company specializing in residential and commercial roofing. But roofing is only the beginning of our story.
                                            </p>
                                            <div className="text-gray-300 text-[15px] leading-[1.65] font-serif space-y-4 pr-2">
                                                <p>We were built to challenge an industry known for inflated pricing, vague bids, poor communication, and short-lived warranties. RHIVE exists to flip that script—with honesty, precision, and care. We bring a new standard to the industry: one rooted in transparency, technology, and trust.</p>
                                                <p>By bypassing expensive brick-and-mortar showrooms and traditional high-pressure sales reps who claim commissions on every square, we direct-connect you with manufacturer-approved installers and itemized pricing sheets. Every dollar in your project cost is visible and trackable.</p>
                                            </div>
                                        </div>
                                        
                                        {/* Core Values Brief */}
                                        <div className="bg-white/5 border border-white/10 p-6 rounded-xl space-y-4 font-serif max-w-[45ch]">
                                            <h4 className="text-white font-bold uppercase text-xs tracking-wider font-sans text-rhive-pink leading-[1.2]">Why We Exist</h4>
                                            <ul className="text-[13px] text-gray-300 space-y-3 leading-[1.6]">
                                                <li className="flex gap-2">
                                                    <span className="text-rhive-pink">■</span>
                                                    <span><strong>Advanced Tech:</strong> Remote inspections powered by aerial drone mapping & AI audits.</span>
                                                </li>
                                                <li className="flex gap-2">
                                                    <span className="text-rhive-pink">■</span>
                                                    <span><strong>Transparent Costing:</strong> Materials, labor, and exact profits itemized upfront.</span>
                                                </li>
                                                <li className="flex gap-2">
                                                    <span className="text-rhive-pink">■</span>
                                                    <span><strong>Community Impact:</strong> Supporting veterans and teachers through home reinvestment.</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>

                                    {/* Meet Founders (Authentic Copy) */}
                                    <div className="border-t border-white/10 pt-8">
                                        <h4 className="text-white font-bold uppercase text-xs tracking-widest font-sans mb-6 leading-[1.2]">Meet Our Founders</h4>
                                        <div className="grid md:grid-cols-2 gap-6">
                                            {/* Kara Card */}
                                            <div className="flex gap-4 p-5 bg-white/[0.02] border border-white/5 rounded-xl">
                                                <img 
                                                    src="https://static.wixstatic.com/media/c5862a_591faf36d59c448e8c92b9caff471e96~mv2.png/v1/fill/w_100,h_125,fp_0.53_0.42,q_85,enc_avif,quality_auto" 
                                                    alt="Kara Robinson" 
                                                    className="w-20 h-24 object-cover border border-rhive-pink/40 rounded shrink-0" 
                                                />
                                                <div className="max-w-[40ch]">
                                                    <h5 className="font-bold text-white uppercase text-sm leading-[1.2]">Kara Robinson</h5>
                                                    <span className="text-[10px] text-rhive-pink font-mono uppercase tracking-wider block mb-1">President & Founder</span>
                                                    <p className="text-gray-400 text-xs font-serif italic mb-2 leading-[1.4]">"Heart First. Mission Always."</p>
                                                    <p className="text-gray-300 text-xs leading-[1.6] font-serif">
                                                        Founded RHIVE to bring operational excellence, female leadership, and deep community impact to an industry long overdue for real transparency.
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Michael Card */}
                                            <div className="flex gap-4 p-5 bg-white/[0.02] border border-white/5 rounded-xl">
                                                <img 
                                                    src="https://static.wixstatic.com/media/c5862a_f1b8b6616fe44f739664188e00d416ce~mv2.png/v1/fill/w_100,h_125,fp_0.49_0.34,q_85,enc_avif,quality_auto" 
                                                    alt="Michael Robinson" 
                                                    className="w-20 h-24 object-cover border border-[#08137C]/40 rounded shrink-0" 
                                                />
                                                <div className="max-w-[40ch]">
                                                    <h5 className="font-bold text-white uppercase text-sm leading-[1.2]">Michael Robinson</h5>
                                                    <span className="text-[10px] text-[#22d3ee] font-mono uppercase tracking-wider block mb-1">CEO & Strategic Architect</span>
                                                    <p className="text-gray-400 text-xs font-serif italic mb-2 leading-[1.4]">"The Disruptor Who Builds Better."</p>
                                                    <p className="text-gray-300 text-xs leading-[1.6] font-serif">
                                                        Decades of construction expertise. Formulated RHIVE's proprietary AI tools and remote logistics pipelines to drop markup costs for homeowners.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-white/10">
                                        <button
                                            onClick={() => {
                                                setActivePageId('P-01');
                                                setActiveLightbox(null);
                                            }}
                                            className="px-8 py-4 bg-rhive-pink text-white font-black uppercase text-xs tracking-widest transition-all shadow-[0_0_15px_rgba(236,2,139,0.3)] cursor-pointer"
                                            style={{ clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)' }}
                                        >
                                            View About Us Page
                                        </button>
                                        <button
                                            onClick={() => setActiveLightbox(null)}
                                            className="px-8 py-4 border border-white/20 hover:bg-white/5 text-white font-black uppercase text-xs tracking-widest transition-all cursor-pointer"
                                            style={{ clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)' }}
                                        >
                                            Close Mission Briefing
                                        </button>
                                    </div>
                                </div>
                            )}

                            {activeLightbox === 'services' && (
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] animate-text-gradient-pink">// CAPABILITY CATALOG</div>
                                    <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tight leading-[1.2] animate-text-gradient-white">Monolithic Performance Engineering</h3>
                                    <p className="text-gray-300 font-serif italic text-base leading-[1.65] max-w-[65ch]">
                                        Every roof we install represents a commercial-grade, multi-layered defense pipeline built to survive Utah's most challenging weather profiles.
                                    </p>

                                    {/* 4 Packages comparison */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                                        {[
                                            {
                                                name: "Duration Package",
                                                shingle: "OC Duration Series",
                                                warranty: "50-Yr Material / 10-Yr Labor",
                                                bullets: ["SureNail® Tech & 130MPH Wind", "StreakGuard™ Algae 25YR", "WeatherLock® Water (6ft)"]
                                            },
                                            {
                                                name: "Flex Package",
                                                shingle: "OC Duration FLEX®",
                                                warranty: "50-Yr Material / 10-Yr Labor",
                                                bullets: ["Class 4 Impact Resistance", "Polymer-Modified Asphalt", "Potential Insurance Discounts"],
                                                reco: true
                                            },
                                            {
                                                name: "Designer Package",
                                                shingle: "GAF Woodland® Designer",
                                                warranty: "50-Yr Material / 10-Yr Labor",
                                                bullets: ["Dimensional Wood Shake look", "GAF Tiger Paw Underlayment", "StainGuard® Algae 25YR"]
                                            },
                                            {
                                                name: "Premium Designer",
                                                shingle: "GAF Grand Sequoia®",
                                                warranty: "50-Yr Material / 10-Yr Labor",
                                                bullets: ["Extra-large Premium Profile", "Ultimate Dimensional Presence", "Bespoke Shake Aesthetic"]
                                            }
                                        ].map((pkg, idx) => (
                                            <div 
                                                key={idx} 
                                                className={cn(
                                                    "p-5 border flex flex-col justify-between relative bg-black/40",
                                                    pkg.reco ? "border-rhive-pink shadow-[0_0_15px_rgba(236,2,139,0.2)]" : "border-white/5"
                                                )}
                                                style={{ clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)' }}
                                            >
                                                {pkg.reco && (
                                                    <span className="absolute top-0 right-0 bg-rhive-pink text-white text-[8px] font-black uppercase px-2 py-0.5 tracking-wider">
                                                        Baseline Standard
                                                    </span>
                                                )}
                                                <div>
                                                    <h4 className="text-white font-black text-sm uppercase tracking-tight mb-0.5 font-display leading-[1.2]">{pkg.name}</h4>
                                                    <span className="text-rhive-pink text-[10px] font-mono uppercase block mb-3">{pkg.shingle}</span>
                                                    <div className="text-xs text-gray-400 font-serif mb-4 leading-[1.4]">Warranty: {pkg.warranty}</div>
                                                    <ul className="space-y-2 text-xs text-gray-300 font-serif leading-[1.5]">
                                                        {pkg.bullets.map((b, i) => (
                                                            <li key={i} className="flex items-start gap-1">
                                                                <span className="text-rhive-pink">■</span>
                                                                <span>{b}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Other Services Grid */}
                                    <div className="grid md:grid-cols-3 gap-4 pt-4 border-t border-white/10">
                                        <div className="p-4 bg-white/[0.01] border border-white/5 rounded-lg max-w-[40ch]">
                                            <h4 className="font-bold text-white uppercase text-xs flex items-center gap-2 leading-[1.2]">
                                                <Building2 size={12} className="text-rhive-pink" /> Flat &amp; Commercial Membrane
                                            </h4>
                                            <p className="text-gray-400 text-xs leading-[1.65] mt-2">High-tensile PVC/TPO membrane panels molecularly heat-welded for absolute NDL warranty readiness.</p>
                                        </div>
                                        <div className="p-4 bg-white/[0.01] border border-white/5 rounded-lg max-w-[40ch]">
                                            <h4 className="font-bold text-white uppercase text-xs flex items-center gap-2 leading-[1.2]">
                                                <Droplets size={12} className="text-rhive-pink" /> Gutter Defense Systems
                                            </h4>
                                            <p className="text-gray-400 text-xs leading-[1.65] mt-2">Seamless 6-inch custom extruded aluminum gutters with Leaf-Defense screens built on-site.</p>
                                        </div>
                                        <div className="p-4 bg-white/[0.01] border border-white/5 rounded-lg max-w-[40ch]">
                                            <h4 className="font-bold text-white uppercase text-xs flex items-center gap-2 leading-[1.2]">
                                                <Wind size={12} className="text-rhive-pink" /> Automated Ice Management
                                            </h4>
                                            <p className="text-gray-400 text-xs leading-[1.65] mt-2">Self-regulating heat trace coils and low-profile snow retainers designed for high steep slopes.</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-white/10">
                                        <button
                                            onClick={() => {
                                                setActivePageId('P-02');
                                                setActiveLightbox(null);
                                            }}
                                            className="px-8 py-4 bg-rhive-pink text-white font-black uppercase text-xs tracking-widest transition-all shadow-[0_0_15px_rgba(236,2,139,0.3)] cursor-pointer"
                                            style={{ clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)' }}
                                        >
                                            View Full Services Catalog
                                        </button>
                                        <button
                                            onClick={() => setActiveLightbox(null)}
                                            className="px-8 py-4 border border-white/20 hover:bg-white/5 text-white font-black uppercase text-xs tracking-widest transition-all cursor-pointer"
                                            style={{ clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)' }}
                                        >
                                            Dismiss Matrix
                                        </button>
                                    </div>
                                </div>
                            )}

                            {activeLightbox === 'process' && (
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] animate-text-gradient-pink">// ZERO SURPRISES PROMISE</div>
                                    <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tight leading-[1.2] animate-text-gradient-white">The 10-Stage Journey</h3>
                                    <p className="text-gray-300 font-serif italic text-base leading-[1.65] max-w-[65ch]">
                                        Experience a construction project defined by absolute transparency, automated scheduling, and constant communications. Here is our 10-stage process from digital intake to asset handover:
                                    </p>
                                    <div className="grid md:grid-cols-2 gap-4 pr-2">
                                        {[
                                            { num: "01", title: "LEAD", desc: "Digital intake. Drone flights and Google Solar API overlays analyze property geometry." },
                                            { num: "02", title: "ESTIMATE", desc: "Instant ballpark numbers. Our AI uses Google Solar data to generate a low-friction financial starting point." },
                                            { num: "03", title: "QUOTE", desc: "Certified proposal. A human architect verifies every variable to provide a fixed-price packet valid for 14 days." },
                                            { num: "04", title: "SIGN & VERIFY", desc: "Digital contract & 50% deposit. We generate your secure 'Ghost Link' and unlock the client portal." },
                                            { num: "05", title: "SCHEDULE", desc: "Material & labor logistics. Permits are filed and the production queue is locked into our operational registry." },
                                            { num: "06", title: "PRE-INSTALL", desc: "Site preparation & approvals. Final coordination with homeowners to ensure zero-friction deployment." },
                                            { num: "07", title: "INSTALL", desc: "The build. Live photo feeds are streamed directly from your roof to your portal in real-time." },
                                            { num: "08", title: "PUNCH LIST", desc: "Quality assurance. A multi-point structural audit ensures every detail exceeds our standard." },
                                            { num: "09", title: "INVOICING", desc: "Final accounting. 10% payment trigger upon completion and verified client satisfaction." },
                                            { num: "10", title: "COMPLETED", desc: "Asset handover. We deliver your Lifetime No-Leak Warranty and your Digital Property Vault." }
                                        ].map(s => (
                                            <div key={s.num} className="border border-white/5 bg-white/[0.01] p-4 rounded-lg flex gap-3 items-start max-w-[50ch]">
                                                <span className="font-mono text-xs font-black text-rhive-pink p-1.5 border border-rhive-pink/20 bg-rhive-pink/5 rounded shrink-0">{s.num}</span>
                                                <div>
                                                    <h4 className="text-white font-bold uppercase text-xs tracking-wider leading-[1.2]">{s.title}</h4>
                                                    <p className="text-gray-400 text-xs leading-[1.6] mt-1.5">{s.desc}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                        <button
                                            onClick={() => {
                                                setActivePageId('P-03');
                                                setActiveLightbox(null);
                                            }}
                                            className="px-8 py-4 bg-rhive-pink text-white font-black uppercase text-xs tracking-widest transition-all shadow-[0_0_15px_rgba(236,2,139,0.3)] cursor-pointer"
                                            style={{ clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)' }}
                                        >
                                            View Interactive Process Page
                                        </button>
                                        <button
                                            onClick={() => setActiveLightbox(null)}
                                            className="px-8 py-4 border border-white/20 hover:bg-white/5 text-white font-black uppercase text-xs tracking-widest transition-all cursor-pointer"
                                            style={{ clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)' }}
                                        >
                                            Dismiss Overview
                                        </button>
                                    </div>
                                </div>
                            )}

                            {activeLightbox === 'financing' && (
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] animate-text-gradient-blue">// CAPITAL OPTIMIZATION</div>
                                    <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tight leading-[1.2] animate-text-gradient-white">Flexible Project Financing</h3>
                                    <p className="text-gray-300 font-serif italic text-base leading-[1.65] max-w-[65ch]">
                                        Brought to you in partnership with Enhancify. We construct structures and capital pathways to protect your home's integrity without interest friction.
                                    </p>

                                    {/* The financing calculator component */}
                                    <div className="border border-white/10 bg-black/60 p-1 rounded-xl">
                                        <FinancingCalculator />
                                    </div>

                                    {/* Traditional logic comparison */}
                                    <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-white/10">
                                        <div className="max-w-[45ch]">
                                            <h4 className="font-bold text-white uppercase text-xs mb-1.5 leading-[1.2]">The 50/40/10 Logic</h4>
                                            <p className="text-gray-400 text-xs leading-[1.6] font-serif">
                                                50% Material Deposit, 40% Roof Installation, and a final 10% held back until the final Quality QC Punch List inspection is signed off by you.
                                            </p>
                                        </div>
                                        <div className="max-w-[45ch]">
                                            <h4 className="font-bold text-white uppercase text-xs mb-1.5 leading-[1.2]">RPSP Commit Credit</h4>
                                            <p className="text-gray-400 text-xs leading-[1.6] font-serif">
                                                Lock in your bid within 48 hours to credit the 10% follow-up chase cost directly back to your invoice total. Zero salesman, zero markup.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                        <a
                                            href="https://www.enhancify.com/rhive"
                                            target="_blank"
                                            rel="noreferrer"
                                            className="px-8 py-4 bg-rhive-blue hover:bg-rhive-blue/80 text-white font-black uppercase text-xs tracking-widest text-center transition-all shadow-[0_0_15px_rgba(8,19,124,0.3)] cursor-pointer"
                                            style={{ clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)' }}
                                        >
                                            Qualify on Enhancify
                                        </a>
                                        <button
                                            onClick={() => setActiveLightbox(null)}
                                            className="px-8 py-4 border border-white/20 hover:bg-white/5 text-white font-black uppercase text-xs tracking-widest transition-all cursor-pointer"
                                            style={{ clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)' }}
                                        >
                                            Dismiss Calculator
                                        </button>
                                    </div>
                                </div>
                            )}

                            {activeLightbox === 'careers' && (
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] animate-text-gradient-pink">// MANIFESTO</div>
                                    <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tight leading-[1.2] animate-text-gradient-white">Join The Movement</h3>
                                    <p className="text-gray-300 font-serif italic text-base leading-[1.65] max-w-[65ch]">
                                        Redefining what it means to work in skilled services. We combine craft precision with Quantum OS automation to unleash professionals.
                                    </p>

                                    {/* 3 Values block */}
                                    <div className="grid md:grid-cols-3 gap-4 pt-2">
                                        <div className="p-4 border border-white/5 bg-white/[0.01] rounded-lg max-w-[32ch]">
                                            <h4 className="font-bold text-white uppercase text-xs flex items-center gap-1.5 mb-1.5 text-rhive-pink leading-[1.2]">
                                                <Zap size={12} /> AI Driven
                                            </h4>
                                            <p className="text-gray-400 text-xs leading-[1.6]">We leverage proprietary remote tooling to handle CRM paperwork so you can solve client problems.</p>
                                        </div>
                                        <div className="p-4 border border-white/5 bg-white/[0.01] rounded-lg max-w-[32ch]">
                                            <h4 className="font-bold text-white uppercase text-xs flex items-center gap-1.5 mb-1.5 text-rhive-pink leading-[1.2]">
                                                <Sparkles size={12} /> High Energy
                                            </h4>
                                            <p className="text-gray-400 text-xs leading-[1.6]">A culture of extreme optimism, assertion, and unmatched, ineffable quality in every operation.</p>
                                        </div>
                                        <div className="p-4 border border-white/5 bg-white/[0.01] rounded-lg max-w-[32ch]">
                                            <h4 className="font-bold text-white uppercase text-xs flex items-center gap-1.5 mb-1.5 text-rhive-pink leading-[1.2]">
                                                <Users size={12} /> Community
                                            </h4>
                                            <p className="text-gray-400 text-xs leading-[1.6]">Dedicated regional roof donation programs supporting veterans and educators.</p>
                                        </div>
                                    </div>

                                    {/* Career jobs board teaser */}
                                    <div className="border border-white/10 p-5 rounded-xl bg-black/60 space-y-4">
                                        <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                            <h4 className="text-white font-bold text-xs uppercase tracking-wider font-sans leading-[1.2]">Active Opportunities</h4>
                                            <span className="text-[9px] font-mono text-green-400 uppercase tracking-widest">● Live Opportunities</span>
                                        </div>
                                        <div className="space-y-3">
                                            {[
                                                { title: "Project Design Specialist", dept: "Sales", loc: "Salt Lake City, UT", pay: "Commission" },
                                                { title: "Field Operations Lead", dept: "Production", loc: "North Logan, UT", pay: "Salary + Bonus" },
                                                { title: "AI Systems Architect", dept: "Engineering", loc: "Remote", pay: "Contract" }
                                            ].map((j, i) => (
                                                <div key={i} className="flex justify-between items-center p-3 bg-white/[0.01] border border-white/5 rounded hover:border-rhive-pink/40 transition-colors">
                                                    <div>
                                                        <h5 className="text-white font-bold text-xs uppercase leading-[1.2]">{j.title}</h5>
                                                        <span className="text-[10px] text-gray-400 uppercase tracking-widest">{j.dept} • {j.loc}</span>
                                                    </div>
                                                    <span className="text-xs font-mono text-gray-300">{j.pay}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-white/10">
                                        <button
                                            onClick={() => {
                                                setActivePageId('P-11');
                                                setActiveLightbox(null);
                                            }}
                                            className="px-8 py-4 bg-rhive-pink text-white font-black uppercase text-xs tracking-widest transition-all shadow-[0_0_15px_rgba(236,2,139,0.3)] cursor-pointer"
                                            style={{ clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)' }}
                                        >
                                            Apply Online Now
                                        </button>
                                        <button
                                            onClick={() => {
                                                setActivePageId('P-10');
                                                setActiveLightbox(null);
                                            }}
                                            className="px-8 py-4 border border-white/20 hover:bg-white/5 text-white font-black uppercase text-xs tracking-widest transition-all cursor-pointer"
                                            style={{ clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)' }}
                                        >
                                            Explore Careers Page
                                        </button>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default PublicHomepageV3;
