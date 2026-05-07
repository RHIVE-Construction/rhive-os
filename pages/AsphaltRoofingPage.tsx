import React, { useState } from 'react';
import { ShieldCheck, Zap, Award, CheckCircle2, Package, ArrowRight, Gauge, Activity, Building2, Gavel, HardHat, Home, Briefcase, Users, LayoutGrid, AlertCircle, Info, Trash2, Droplets, Fan, Ruler, Target, Layers } from 'lucide-react';
import { useNavigation } from '../contexts/NavigationContext';
import PlexusShape from '../components/PlexusShape';
import ShingleDurationLightbox from '../components/ShingleDurationLightbox';
import ShingleFlexLightbox from '../components/ShingleFlexLightbox';
import { InteractiveRoofAnatomy } from '../components/InteractiveRoofAnatomy';
import InteractiveOCMascot from '../components/InteractiveOCMascot';

// New Ultimate Asphalt Sections
import NoLayoversSection from '../components/NoLayoversSection';
import UrgencyGridSection from '../components/UrgencyGridSection';
import ProcessTimelineSection from '../components/ProcessTimelineSection';
import FinancialInsuranceSection from '../components/FinancialInsuranceSection';
import TrustAndCertificationsSection from '../components/TrustAndCertificationsSection';

const AsphaltRoofingPage = () => {
    const { setActivePageId } = useNavigation();
    const [durationOpen, setDurationOpen] = useState(false);
    const [flexOpen, setFlexOpen] = useState(false);

    const scrollToSystems = () => {
        const element = document.getElementById('base-foundation');
        element?.scrollIntoView({ behavior: 'smooth' });
    };

    const personas = [
        {
            icon: <Home className="w-6 h-6" />,
            title: "Homeowner",
            benefit: "First-time buyer? We simplify the complexity with transparent 'Dual-Math' cost breakdowns. You'll see exactly what covers your home and treasures vs. what goes into our certified installation overhead."
        },
        {
            icon: <Briefcase className="w-6 h-6" />,
            title: "Property Manager",
            benefit: "Scale your maintenance without the stress. We provide full digital documentation for every roof, condition-tracking, and scheduled replacements to ensure zero-downtime for your tenants."
        },
        {
            icon: <HardHat className="w-6 h-6" />,
            title: "New Construction",
            benefit: "Beat the standard market. Our certifications allow you to offer 50-year non-prorated protection to your clients, immediately increasing the resale value and marketability of your builds."
        },
        {
            icon: <Users className="w-6 h-6" />,
            title: "HOA / Multifamily",
            benefit: "Protect the whole community. We specialize in large-scale system deployments that maintain aesthetic uniformity while delivering the same high-performance standards to every single unit."
        }
    ];

    const upgradeOptions = [
        {
            id: 'flex',
            name: 'O.C. DURATION FLEX®',
            type: 'MAXIMUM IMPACT DEFENSE',
            description: 'SBS modified polymer armor. Engineered to aggressively absorb extreme hail and wind impacts while maintaining ultimate flexibility.',
            color: '#00D1FF',
            image: '/duration_flex_shingle.png',
            features: ['Class 4 Impact Rated', 'SBS Polymer Protection', 'Extreme Weather-Ready'],
            cta: 'Configure Flex',
            action: () => setFlexOpen(true)
        },
        {
            id: 'woodland',
            name: 'GAF WOODLAND®',
            type: 'ARCHITECTURAL PRESTIGE',
            description: 'Custom hand-cut wood shake look. A complete integrated roof system engineered for dramatic curb appeal and bespoke statement.',
            color: '#e2ab49',
            image: '/gaf_woodland_shingle.png',
            features: ['Tri-Laminate Depth', 'Hand-Cut Shake Look', 'Designer Status'],
            cta: 'View Woodland Specs',
            action: () => { } 
        },
        {
            id: 'sequoia',
            name: 'GAF GRAND SEQUOIA®',
            type: 'ULTRA-PREMIUM LUXURY',
            description: 'The ultimate wood-shake alternative. Rugged, oversized tabs create a sophisticated, dramatic appearance for high-value properties.',
            color: '#e2ab49',
            image: '/gaf_grand_sequoia.png',
            features: ['Extra-Large Shingle Tabs', 'High-Contrast Look', 'Maximum ROI Finish'],
            cta: 'View Sequoia Specs',
            action: () => { }
        }
    ];

    const componentsList = [
        { title: "Tear-off to Decking", icon: <Trash2 className="w-4 h-4" /> },
        { title: "OSB Certification", icon: <CheckCircle2 className="w-4 h-4" /> },
        { title: "ProArmor® Barrier", icon: <ShieldCheck className="w-4 h-4" /> },
        { title: "WeatherLock® Shield", icon: <Droplets className="w-4 h-4" /> },
        { title: "Starter Strip+", icon: <Zap className="w-4 h-4" /> },
        { title: "Vent-Sure® Balance", icon: <Fan className="w-4 h-4" /> },
        { title: "California Cut Valleys", icon: <Ruler className="w-4 h-4" /> },
        { title: "Pro-Edge® Hip/Ridge", icon: <Award className="w-4 h-4" /> }
    ];

    return (
        <div className="bg-black text-white min-h-screen font-sans selection:bg-[var(--rhive-pink)] selection:text-white pt-20">

            {/* HERO SECTION */}
            <section className="relative aspect-video w-full max-h-screen flex items-center justify-center overflow-hidden border-b border-white/10 group">
                {/* Background Image with Parallax & Contrast Layers */}
                <div className="absolute inset-0 z-0 bg-black">
                    <div
                        className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:opacity-60 group-hover:scale-105 transition-all duration-[2s] ease-out filter grayscale mix-blend-luminosity"
                        style={{ backgroundImage: `url(/slc-residential-roof.png)` }}
                    ></div>
                    {/* Gradient Mask to ensure text readability */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black z-10"></div>
                </div>

                <div className="absolute inset-0 z-20">
                    <PlexusShape backgroundColor="transparent" dotColor="#ec028b" lineColor="236, 2, 139" density={40} />
                </div>

                {/* Branding Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl aspect-square bg-[var(--rhive-pink)]/10 blur-[130px] rounded-full z-10" />

                <div className="relative z-30 text-center px-4 max-w-5xl">
                    <div className="inline-flex items-center gap-2 border border-[var(--rhive-pink)]/30 px-6 py-2 bg-[var(--rhive-pink)]/10 mb-8 backdrop-blur-md">
                        <Home className="w-4 h-4 text-[var(--rhive-pink)]" />
                        <span className="text-[var(--rhive-pink)] font-black text-xs uppercase tracking-[0.4em]">Premium Roofing Solutions</span>
                    </div>

                    <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-8 text-white leading-none drop-shadow-2xl font-sans">
                        ASPHALT <span className="text-[var(--rhive-pink)]">ROOFING</span>
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-300 font-sans mb-12 max-w-3xl mx-auto leading-relaxed drop-shadow-lg">
                        Certified, high-performance asphalt shingle systems backed by industry-leading lifetime warranties and a fully transparent quoting process.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <button
                            onClick={() => window.location.href = '#quote'}
                            className="group relative px-10 py-5 bg-[var(--rhive-pink)] text-white font-black uppercase text-sm tracking-[0.2em] hover:scale-105 transition-all shadow-[0_0_30px_rgba(236,2,139,0.3)]"
                            style={{ clipPath: 'polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)' }}
                        >
                            Request Certified Quote
                        </button>
                        <button
                            onClick={scrollToSystems}
                            className="px-10 py-5 border border-white/10 text-white font-bold uppercase text-xs tracking-[0.2em] hover:bg-white/5 transition-all backdrop-blur-md"
                            style={{ clipPath: 'polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)' }}
                        >
                            Review System Specs
                        </button>
                    </div>
                </div>

                {/* Disruptive Owens Corning Warranty Graphic */}
                <InteractiveOCMascot />
            </section>

            {/* ULTIMATE FOUNDATION SECTION: O.C. DURATION (STANDARD) */}
            <section id="base-foundation" className="py-20 bg-black relative border-y border-white/5">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-[2px] bg-[var(--rhive-pink)]"></div>
                            <span className="font-mono text-[11px] font-bold uppercase tracking-[0.4em] text-[var(--rhive-pink)] drop-shadow-[0_0_8px_rgba(236,2,139,0.5)]">
                                The Standard Foundation
                            </span>
                        </div>

                        <h1 className="text-5xl md:text-7xl lg:text-[6rem] font-black text-white uppercase tracking-tighter mb-4 font-display leading-[0.85]">
                            ASPHALT <span className="text-[var(--rhive-pink)] text-4xl md:text-6xl lg:text-[4rem] block">SHINGLE PACKAGE</span>
                        </h1>
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--rhive-pink)]/10 border border-[var(--rhive-pink)]/30 mb-6">
                            <CheckCircle2 className="w-3 h-3 text-[var(--rhive-pink)]" />
                            <span className="text-[9px] font-black uppercase tracking-widest text-white">A ROOF THAT OUTLASTS THE MORTGAGE</span>
                        </div>
                        <p className="text-xl text-gray-300 font-sans leading-relaxed mb-12 border-l-2 border-[var(--rhive-pink)] pl-6">
                            The definitive system for the modern property owner. Featuring Owens Corning Duration® shingles as our <strong>uncompromised baseline</strong>. Far outperforming standard architectural and 3-tab shingles, this system is engineered to perform as a single, impenetrable weather-defense unit.
                        </p>

                        <div className="space-y-8 mb-12">
                            <div className="flex items-start gap-6 group">
                                <div className="p-3 bg-white/5 border border-white/10 text-[var(--rhive-pink)] group-hover:bg-[var(--rhive-pink)] group-hover:text-white transition-all">
                                    <ShieldCheck className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="text-white font-black text-xs uppercase tracking-widest mb-1">Preferred Protection Warranty</h4>
                                    <p className="text-gray-500 text-xs text-balance">50 Years Non-Prorated coverage + 10-year Workmanship backup if installer exits market.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-6 group">
                                <div className="p-3 bg-white/5 border border-white/10 text-[var(--rhive-pink)] group-hover:bg-[var(--rhive-pink)] group-hover:text-white transition-all">
                                    <Package className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="text-white font-black text-xs uppercase tracking-widest mb-1">8-Point Component System</h4>
                                    <p className="text-gray-500 text-xs text-balance">Engineered together to perform as a single, impenetrable weather-defense unit.</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 mb-12">
                            <button
                                onClick={() => setDurationOpen(true)}
                                className="flex-1 inline-flex items-center justify-center gap-3 px-8 py-5 border border-white/20 bg-white/5 backdrop-blur-md text-white font-black text-[11px] uppercase tracking-[0.3em] hover:bg-white/10 hover:border-[var(--rhive-pink)]/50 transition-all shadow-[0_0_20px_rgba(255,255,255,0.05)]"
                                style={{ clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)' }}
                            >
                                Open System Components <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Visual representation of the Duration package */}
                    <div className="relative group perspective-[1000px]">
                        <div className="absolute -inset-4 bg-[var(--rhive-pink)]/20 blur-3xl rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-1000"></div>

                        <div className="relative z-10 w-full h-full min-h-[450px] bg-[#0A0A0A] border border-white/10 group-hover:border-[var(--rhive-pink)]/50 transition-all duration-700 flex flex-col p-8 overflow-hidden shadow-2xl"
                            style={{ clipPath: 'polygon(24px 0, 100% 0, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0 100%, 0 24px)', transformStyle: 'preserve-3d' }}>

                            {/* Marketing Showcase Image */}
                            <div className="absolute inset-0 z-0">
                                <img
                                    src="/oc_duration_standard.png"
                                    className="w-full h-full object-cover opacity-30 group-hover:opacity-60 transition-opacity duration-1000"
                                    alt="Owens Corning Duration Architectural Shingles"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                            </div>

                            <div className="relative z-20 flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 flex items-center justify-center bg-[var(--rhive-pink)]/10 rounded-full border border-[var(--rhive-pink)]/30">
                                    <Package className="w-6 h-6 text-[var(--rhive-pink)]" />
                                </div>
                                <h3 className="text-2xl font-black text-white uppercase tracking-widest font-sans">Core Package Artifacts</h3>
                            </div>

                            <div className="space-y-4 flex-grow relative z-20">
                                {[
                                    { icon: <Zap className="w-4 h-4" />, text: "SureNail® Technology - Standard" },
                                    { icon: <Target className="w-4 h-4" />, text: "130-MPH Wind Rating - Standard" },
                                    { icon: <ShieldCheck className="w-4 h-4" />, text: "Dual-Guarantee Warranty - Included" },
                                    { icon: <Layers className="w-4 h-4" />, text: "Tru-Bond® Sealant - Standard" }
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-4 bg-white/5 p-4 hover:bg-[var(--rhive-pink)] transition-colors border border-white/5 hover:border-transparent cursor-default group/item hover:translate-x-2 duration-300">
                                        <div className="text-[var(--rhive-pink)] group-hover/item:text-white transition-colors">
                                            {item.icon}
                                        </div>
                                        <span className="text-sm font-bold text-gray-300 uppercase font-sans tracking-widest group-hover/item:text-white transition-colors">{item.text}</span>
                                    </div>
                                ))}
                            </div>


                        </div>
                    </div>
                </div>
            </section>

            {/* UPGRADE MATRIX: LUXURY SPECIALIZATIONS */}
            <section className="py-20 bg-[#050505]">
                <div className="max-w-5xl mx-auto px-6">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white mb-6">OPTIONAL PACKAGE <span className="text-[var(--primary-accent)]">ENHANCEMENTS</span></h2>
                        <p className="text-gray-400 font-sans uppercase text-[10px] tracking-[0.5em]">Aesthetic and performance specializations</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {upgradeOptions.map((opt) => (
                            <div key={opt.id} className="relative group overflow-hidden bg-black border border-white/5 transition-all duration-700 hover:border-[var(--rhive-pink)]/30 h-full flex flex-col">
                                {/* Image Background */}
                                <div className="absolute inset-0 z-0 h-40 opacity-40 group-hover:opacity-60 transition-opacity duration-700 overflow-hidden">
                                    <img src={opt.image} alt={opt.name} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000" />
                                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/90 to-black"></div>
                                </div>
                                <div className="relative z-10 p-6 flex flex-col h-full pt-32">
                                    <div className="mb-6 text-left">
                                        <div className="text-[9px] font-black uppercase tracking-widest mb-1" style={{ color: opt.color }}>{opt.type}</div>
                                        <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-3">{opt.name}</h3>
                                        <p className="text-gray-400 text-[10px] font-sans leading-relaxed min-h-[50px]">
                                            {opt.description}
                                        </p>
                                    </div>

                                    <div className="space-y-2 mb-6 flex-grow">
                                        {opt.features.map((f, i) => (
                                            <div key={i} className="flex items-center gap-2">
                                                <div className="w-1 h-1 rounded-full" style={{ backgroundColor: opt.color }} />
                                                <span className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">{f}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <button
                                        onClick={opt.action}
                                        className="w-full py-3 border border-white/10 text-white font-black text-[9px] uppercase tracking-widest hover:bg-white/10 transition-all"
                                        style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}
                                    >
                                        {opt.cta}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* INTERACTIVE ANATOMY SECTION - MOVED BELOW UPGRADES */}
            <section className="py-24 bg-black border-y border-white/5 relative z-10">
                <div className="absolute inset-0 bg-gradient-to-b from-[var(--rhive-pink)]/5 via-black to-black pointer-events-none"></div>
                <div className="max-w-[85rem] mx-auto px-6 mb-12 text-center relative z-20">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="w-8 h-[2px] bg-[var(--rhive-pink)]"></div>
                        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--rhive-pink)] font-bold">System Diagnostics</span>
                        <div className="w-8 h-[2px] bg-[var(--rhive-pink)]"></div>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-white uppercase font-display tracking-tight mb-4 text-center">ANATOMY OF PROTECTION<span className="text-[var(--rhive-pink)]">.</span></h2>
                    <p className="text-gray-400 font-sans max-w-2xl mx-auto text-lg text-center text-balance">
                        Scan the structure below to see the commercial-grade layering included in every RHIVE installation.
                    </p>
                </div>
                <div className="relative z-20">
                    <InteractiveRoofAnatomy />
                </div>
            </section>

            {/* 1. NO LAYOVERS MANDATE */}
            <NoLayoversSection />

            {/* 2. URGENCY GRID */}
            <UrgencyGridSection />

            {/* 3. PROCESS TIMELINE */}
            <ProcessTimelineSection />

            {/* 4. FINANCIAL & INSURANCE GUIDANCE */}
            <FinancialInsuranceSection />

            {/* 5. TRUST & CERTIFICATIONS */}
            <TrustAndCertificationsSection />

            {/* PERSONA BENEFITS SECTION - MOVED BOTTOM */}
            <section className="py-24 bg-[#050505] relative overflow-hidden border-t border-white/5">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col items-center mb-20 text-center">
                        <div className="text-[var(--rhive-pink)] text-[10px] font-black uppercase tracking-[0.4em] mb-4">RHIVE Intelligence</div>
                        <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white mb-6">WHY RHIVE <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-gray-600">CONSTRUCTION?</span></h2>
                        <div className="w-24 h-[1px] bg-[var(--rhive-pink)]" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 group/grid">
                        {personas.map((p, i) => (
                            <div key={i} className="group relative p-8 bg-black/40 backdrop-blur-md border border-white/5 hover:border-[var(--rhive-pink)] hover:-translate-y-2 transition-all duration-500 overflow-hidden cursor-default text-center flex flex-col items-center">
                                <div className="absolute inset-0 bg-gradient-to-br from-[var(--rhive-pink)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <div className="relative z-10 w-full flex flex-col items-center text-center">
                                    <div className="w-16 h-16 rounded-full bg-black border border-[var(--rhive-pink)]/30 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[var(--rhive-pink)] transition-all duration-500 shadow-[0_0_15px_rgba(236,2,139,0.2)] group-hover:shadow-[0_0_25px_rgba(236,2,139,0.6)]">
                                        <div className="text-[var(--rhive-pink)] group-hover:text-white transition-colors duration-500">
                                            {p.icon}
                                        </div>
                                    </div>
                                    <h3 className="text-lg font-black text-white uppercase tracking-widest mb-4 font-sans">{p.title}</h3>
                                    <p className="text-gray-400 font-sans text-sm leading-relaxed group-hover:text-gray-100 transition-colors duration-300">
                                        {p.benefit}
                                    </p>
                                </div>
                                <div className="absolute bottom-0 left-0 h-1 bg-[var(--rhive-pink)] w-0 group-hover:w-full transition-all duration-700 ease-out"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* QUANTUM ROOF VISUALIZER */}
            <section className="py-24 bg-black relative border-t border-[var(--border-color)]">
                <div className="absolute inset-0 bg-gradient-to-tr from-[var(--rhive-pink)]/5 to-transparent pointer-events-none z-0"></div>
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="flex flex-col items-center mb-16 text-center">
                        <div className="text-[var(--rhive-pink)] text-[10px] font-black uppercase tracking-[0.4em] mb-4">Interactive System Tool</div>
                        <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white mb-6">QUANTUM ROOF <span className="text-[var(--rhive-pink)]">VISUALIZER</span></h2>
                        <div className="w-24 h-[1px] bg-[var(--rhive-pink)]" />
                    </div>
                    
                    <div className="w-full relative rounded-2xl p-2 bg-gradient-to-b from-white/10 to-black/50 backdrop-blur-sm border border-white/10 shadow-[0_0_30px_rgba(236,2,139,0.1)] transition-transform duration-700 hover:shadow-[0_0_40px_rgba(236,2,139,0.2)]">
                        {/* Quantum Frame Decoration */}
                        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[var(--rhive-pink)] rounded-tl-xl opacity-50"></div>
                        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[var(--rhive-pink)] rounded-tr-xl opacity-50"></div>
                        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[var(--rhive-pink)] rounded-bl-xl opacity-50"></div>
                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[var(--rhive-pink)] rounded-br-xl opacity-50"></div>
                        
                        <iframe 
                            src="https://www-rhiveconstruction-com.filesusr.com/html/c5862a_79d650c471ddd8505ac22645a386d140.html" 
                            width="100%" 
                            height="900px" 
                            frameBorder="0" 
                            style={{ border: "none", borderRadius: "10px", backgroundColor: "#000" }}
                            title="Quantum Roof Visualizer"
                            className="relative z-10 block"
                        />
                    </div>
                </div>
            </section>

            {/* LIGHTBOXES */}
            <ShingleDurationLightbox isOpen={durationOpen} onClose={() => setDurationOpen(false)} />
            <ShingleFlexLightbox isOpen={flexOpen} onClose={() => setFlexOpen(false)} />

        </div>
    );
};

export default AsphaltRoofingPage;
