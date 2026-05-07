import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheckIcon, UserIcon, ArrowRightIcon, Zap, HeartIcon, CpuChipIcon, BuildingOfficeIcon, CheckCircle2 } from '../components/icons';
import { cn } from '../lib/utils';
import PlexusShape from '../components/PlexusShape';
import { AddressScanInput } from '../components/AddressScanInput';
import { AboutUsLightbox } from '../components/AboutUsLightbox';
import { AboutUsHeroPreview } from '../components/AboutUsHero';

// --- Reusable Glitch Text Component ---
const GlitchText = ({ text, className }: { text: string, className?: string }) => {
    return (
        <div className={cn("relative inline-block", className)}>
            <span className="relative z-10 block">{text}</span>
            <motion.span
                className="absolute inset-0 z-20 text-[#ec028b] mix-blend-screen pointer-events-none select-none"
                initial={{ opacity: 0 }}
                animate={{
                    opacity: [0, 0.4, 0, 0.2, 0],
                    x: [0, -2, 1, -1, 0],
                }}
                transition={{ duration: 0.2, repeat: Infinity, repeatDelay: Math.random() * 2 + 1, ease: "easeInOut" }}
            >
                {text}
            </motion.span>
        </div>
    );
};

// --- Authentic Founder Card ---
const AuthenticFounderCard = ({ name, role, tagline, bio, image, colorClass = "rhive-pink", isFlipped = false }: any) => (
    <div className="relative group isolate w-full">
        {/* Chamfered Box Wrapper */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-xl transition-colors duration-300 border border-[var(--rhive-border)] z-0"
            style={{ clipPath: 'polygon(32px 0, 100% 0, 100% calc(100% - 32px), calc(100% - 32px) 100%, 0 100%, 0 32px)' }} />

        <div className={cn(
            "relative z-10 p-10 flex flex-col items-center gap-12 h-full",
            isFlipped ? "md:flex-row-reverse" : "md:flex-row"
        )}>
            <div className={cn(
                "w-56 h-56 relative shrink-0 border-4 shadow-2xl transition-transform duration-700 group-hover:scale-105",
                colorClass === "rhive-pink" ? "border-rhive-pink shadow-[0_0_30px_rgba(236,2,139,0.2)]" : "border-rhive-blue shadow-[0_0_30px_rgba(8,19,124,0.2)]"
            )} style={{ clipPath: 'polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)' }}>
                <img src={image} alt={name} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" />
            </div>
            <div className={cn("flex flex-col text-center", isFlipped ? "md:text-right md:items-end" : "md:text-left md:items-start")}>
                <h3 className={cn(
                    "font-display text-5xl font-black uppercase mb-2 tracking-tighter text-white transition-colors duration-500",
                    colorClass === "rhive-pink" ? "group-hover:text-rhive-pink" : "group-hover:text-rhive-blue"
                )}>{name}</h3>
                <p className="text-white text-md font-bold tracking-widest uppercase mb-2 bg-white/10 px-4 py-1 inline-block rounded-full">{role}</p>
                <p className={cn(
                    "text-xl font-bold font-serif italic mb-6",
                    colorClass === "rhive-pink" ? "text-rhive-pink" : "text-rhive-blue"
                )}>"{tagline}"</p>
                <div className="text-[var(--rhive-text-muted)] text-lg leading-relaxed max-w-2xl font-serif space-y-4">
                    {bio.map((paragraph: string, idx: number) => (
                        <p key={idx}>{paragraph}</p>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

// --- Styled Section Header ---
const SectionHeader = ({ title, subtitle }: { title: string, subtitle?: string }) => (
    <div className="mb-12">
        <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white mb-4">{title}</h2>
        {subtitle && <p className="text-xl md:text-2xl font-serif italic text-rhive-pink">{subtitle}</p>}
    </div>
);

const AboutUsPage: React.FC = () => {
    const [isLightboxOpen, setIsLightboxOpen] = React.useState(false);
    const [isHeroPreviewOpen, setIsHeroPreviewOpen] = React.useState(false);

    return (
        <div className="relative w-full min-h-screen font-sans bg-[var(--rhive-bg)] overflow-hidden">

            {/* L-01 Lightbox Trigger CTA (Internal Testing) */}
            <div className="fixed top-24 right-6 z-50 flex flex-col gap-4 items-end">
                <button
                    onClick={() => setIsLightboxOpen(true)}
                    className="bg-rhive-pink/10 hover:bg-rhive-pink/20 border border-rhive-pink/50 text-rhive-pink px-4 py-2 font-bold text-xs uppercase tracking-widest backdrop-blur-md transition-all group overflow-hidden shadow-[0_0_15px_rgba(236,2,139,0.2)] hover:shadow-[0_0_25px_rgba(236,2,139,0.4)] relative"
                    style={{ clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)' }}
                >
                    <span className="relative z-10 flex items-center gap-2">
                        <Zap size={14} className="group-hover:animate-pulse" />
                        Preview L-01 Lightbox
                    </span>
                    <div className="absolute inset-0 bg-rhive-pink/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-0" />
                </button>

                <button
                    onClick={() => setIsHeroPreviewOpen(true)}
                    className="bg-rhive-blue/10 hover:bg-rhive-blue/20 border border-rhive-blue/50 text-rhive-blue px-4 py-2 font-bold text-xs uppercase tracking-widest backdrop-blur-md transition-all group overflow-hidden shadow-[0_0_15px_rgba(8,19,124,0.2)] hover:shadow-[0_0_25px_rgba(8,19,124,0.4)] relative"
                    style={{ clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)' }}
                >
                    <span className="relative z-10 flex items-center gap-2">
                        <Zap size={14} className="group-hover:animate-pulse" />
                        Preview H-01 Hero
                    </span>
                    <div className="absolute inset-0 bg-rhive-blue/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-0" />
                </button>
            </div>

            <AboutUsLightbox isOpen={isLightboxOpen} onClose={() => setIsLightboxOpen(false)} />
            <AboutUsHeroPreview isOpen={isHeroPreviewOpen} onClose={() => setIsHeroPreviewOpen(false)} />

            {/* Unified Background Environment - Keeps it clean, no changing sections */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-20">
                <PlexusShape backgroundColor="transparent" dotColor="#ffffff" lineColor="255, 255, 255" density={30} />
            </div>

            <div className="relative z-10 max-w-6xl mx-auto px-6 py-24 space-y-32">

                {/* ABOUT RHIVE - HEADER */}
                <section className="space-y-8 text-center md:text-left pt-12 relative isolate">
                    {/* Pink Pulsating Circuitry Glow */}
                    <div className="absolute top-1/2 left-0 md:left-24 -translate-y-1/2 w-96 h-96 bg-rhive-pink/30 blur-[100px] rounded-full z-[-1] animate-[pulse_4s_cubic-bezier(0.4,0,0.6,1)_infinite]" />

                    <div className="inline-block border border-rhive-pink/30 px-6 py-2 rounded-full bg-rhive-pink/10 mb-4 shadow-[0_0_20px_rgba(236,2,139,0.3)]">
                        <span className="text-rhive-pink font-bold text-sm tracking-[0.4em] uppercase">The Core Mission</span>
                    </div>
                    <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-tight drop-shadow-2xl relative">
                        <GlitchText text="FINISH ON TOP." className="text-white drop-shadow-[0_0_30px_rgba(236,2,139,0.6)]" />
                    </h1>
                    <p className="text-3xl font-serif italic text-white/90">
                        We're not just a roofing company. <br />We're a revolution in construction.
                    </p>
                    <div className="text-[var(--rhive-text-muted)] text-xl leading-relaxed font-serif max-w-4xl space-y-6 relative z-10">
                        <p>RHIVE Construction is a proudly female-owned and operated company specializing in residential and commercial roofing. But roofing is only the beginning of our story.</p>
                        <p>We were built to challenge an industry known for inflated pricing, vague bids, poor communication, and short-lived warranties. RHIVE exists to flip that script—with honesty, precision, and care. We bring a new standard to the industry: one rooted in transparency, technology, and trust.</p>
                    </div>
                </section>

                {/* THE DUAL MATH GRAPHIC SECTION */}
                <section className="w-full flex justify-center">
                    <div className="relative w-full max-w-5xl overflow-hidden shadow-[0_0_50px_rgba(236,2,139,0.15)] border border-[var(--rhive-border)]"
                        style={{ clipPath: 'polygon(24px 0, 100% 0, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0 100%, 0 24px)' }}>
                        <img
                            src="https://static.wixstatic.com/media/c5862a_7e539a778fd84771b8327f43dfc7dd0a~mv2.png/v1/fill/w_1200,h_675,al_c,q_90/dd.png"
                            alt="Standard Contractor Practices vs RHIVE Construction"
                            className="w-full h-auto object-cover"
                        />
                    </div>
                </section>



                {/* WHY WE EXIST */}
                <section>
                    <SectionHeader title="Why We Exist" subtitle="We’re not just a roofing company—we’re a revolution in construction." />
                    <div className="text-[var(--rhive-text-muted)] text-2xl leading-relaxed font-serif max-w-4xl space-y-6">
                        <p>We saw that doing business all the ways we saw they were being done were wasting time, money, value, and expectations, and in return, it cut the potential of scaling to a larger picture idea.</p>
                        <p>With RHIVE, we have broken the bounds of residential, commercial, industrial, and into government projects as well. We are setting the pace to change roofing by providing sustainable, transparent cost + value replacement bids with local installers and locally purchased materials for every project.</p>
                    </div>
                </section>

                {/* HOW WE DO IT */}
                <section className="relative isolate py-20 px-8 border-y border-[var(--rhive-border)] mt-12 bg-black/20">
                    {/* Massive 2x Floating Planet Background Oriented to the Right */}
                    <div className="absolute top-1/2 right-[-30%] -translate-y-1/2 w-[120%] md:w-[80%] max-w-[2000px] blur-[2px] opacity-40 z-[-1] pointer-events-none mix-blend-screen overflow-hidden"
                        style={{ maskImage: 'linear-gradient(to left, black 50%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to left, black 50%, transparent 100%)' }}>
                        <img
                            src="https://static.wixstatic.com/media/c5862a_6726f7cd51ee4ae19e05d9bedb6588d7f000.jpg/v1/fill/w_1920,h_1080,al_c,q_90,usm_0.33_1.00_0.00,enc_avif,quality_auto/c5862a_6726f7cd51ee4ae19e05d9bedb6588d7f000.jpg"
                            alt="Floating Data Planet"
                            className="w-full h-auto object-cover mix-blend-lighten filter brightness-150 contrast-125 saturate-150 hue-rotate-15 scale-150 transform-gpu translate-x-12"
                        />
                    </div>

                    <SectionHeader title="How We Do It" subtitle="We’re not just a roofing company. We’re a revolution in construction." />
                    <div className="flex flex-col lg:flex-row gap-12 items-center relative z-10">
                        <div className="flex-1 space-y-6 text-lg text-[var(--rhive-text-muted)]">
                            <ul className="space-y-6 list-none">
                                <li className="flex items-start gap-6 p-6 glass-dark bg-black/60 border border-rhive-pink/30 rounded-2xl backdrop-blur-xl shadow-[0_0_30px_rgba(236,2,139,0.1)] hover:-translate-y-1 transition-transform">
                                    <CpuChipIcon className="w-8 h-8 text-rhive-pink shrink-0" />
                                    <div>
                                        <strong className="text-xl text-rhive-pink block mb-1 font-display tracking-widest uppercase shadow-black drop-shadow-md">Advanced Technology</strong>
                                        <span className="font-serif leading-relaxed text-white">Remote inspections powered by cutting-edge aerial tech and AI-driven tools.</span>
                                    </div>
                                </li>
                                <li className="flex items-start gap-6 p-6 glass-dark bg-black/60 border border-[#22d3ee]/30 rounded-2xl backdrop-blur-xl shadow-[0_0_30px_rgba(34,211,238,0.1)] hover:-translate-y-1 transition-transform">
                                    <ShieldCheckIcon className="w-8 h-8 text-[#22d3ee] shrink-0" />
                                    <div>
                                        <strong className="text-xl text-[#22d3ee] block mb-1 font-display tracking-widest uppercase shadow-black drop-shadow-md">Transparent Pricing</strong>
                                        <span className="font-serif leading-relaxed text-white">Clearly itemized costs (materials, labor, overhead, profit).</span>
                                    </div>
                                </li>
                                <li className="flex items-start gap-6 p-6 glass-dark bg-black/60 border border-rhive-pink/30 rounded-2xl backdrop-blur-xl shadow-[0_0_30px_rgba(236,2,139,0.1)] hover:-translate-y-1 transition-transform">
                                    <BuildingOfficeIcon className="w-8 h-8 text-rhive-pink shrink-0" />
                                    <div>
                                        <strong className="text-xl text-rhive-pink block mb-1 font-display tracking-widest uppercase shadow-black drop-shadow-md">Lifetime Warranties</strong>
                                        <span className="font-serif leading-relaxed text-white">Guaranteed, reliable coverage you can trust.</span>
                                    </div>
                                </li>
                                <li className="flex items-start gap-6 p-6 glass-dark bg-black/60 border border-[#22d3ee]/30 rounded-2xl backdrop-blur-xl shadow-[0_0_30px_rgba(34,211,238,0.1)] hover:-translate-y-1 transition-transform">
                                    <Zap className="w-8 h-8 text-[#22d3ee] shrink-0" />
                                    <div>
                                        <strong className="text-xl text-[#22d3ee] block mb-1 font-display tracking-widest uppercase shadow-black drop-shadow-md">Flexible Financing</strong>
                                        <span className="font-serif leading-relaxed text-white">0% APR for 18 months, transparent options tailored to your needs.</span>
                                    </div>
                                </li>
                                <li className="flex items-start gap-6 p-6 glass-dark bg-black/60 border border-rhive-pink/30 rounded-2xl backdrop-blur-xl shadow-[0_0_30px_rgba(236,2,139,0.1)] hover:-translate-y-1 transition-transform">
                                    <HeartIcon className="w-8 h-8 text-rhive-pink shrink-0" />
                                    <div>
                                        <strong className="text-xl text-rhive-pink block mb-1 font-display tracking-widest uppercase shadow-black drop-shadow-md">Community Commitment</strong>
                                        <span className="font-serif leading-relaxed text-white">Every project supports veterans, teachers, and families in need.</span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className="flex-[1.5] w-full p-[2px] bg-gradient-to-br from-rhive-pink via-[#08137C] to-[#22d3ee] shadow-[0_0_80px_rgba(236,2,139,0.2)] relative aspect-video group transform-gpu hover:scale-[1.02] transition-all duration-700"
                            style={{ clipPath: 'polygon(24px 0, 100% 0, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0 100%, 0 24px)' }}>
                            <div className="w-full h-full overflow-hidden bg-black relative z-10"
                                style={{ clipPath: 'polygon(23px 0, 100% 0, 100% calc(100% - 23px), calc(100% - 23px) 100%, 0 100%, 0 23px)' }}>
                                {/* Embedded Full Kara Video */}
                                <video
                                    className="w-full h-full object-cover filter contrast-110 saturate-110"
                                    controls
                                    poster="https://static.wixstatic.com/media/c5862a_28b9264eb7464935b430c16685d190dc~mv2.png/v1/fill/w_784,h_441,al_c,q_85,usm_0.33_1.00_0.01,enc_avif,quality_auto/c5862a_28b9264eb7464935b430c16685d190dc~mv2.png"
                                >
                                    <source src="/vidupload/TRADESHOW MARKETING VIDEO.mp4" type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            </div>
                            <div className="absolute inset-0 bg-rhive-pink/20 blur-2xl -z-10 group-hover:opacity-100 opacity-0 transition-opacity duration-700" />
                        </div>
                    </div>
                </section>

                {/* WHAT WE OFFER */}
                <section className="relative isolate py-20">
                    <SectionHeader title="What We Offer" />
                    <div className="flex flex-col lg:flex-row-reverse gap-12 items-center">
                        <div className="flex-1 space-y-6 text-lg text-[var(--rhive-text-muted)]">
                            <div className="flex gap-4 items-center">
                                <ArrowRightIcon className="w-6 h-6 text-rhive-pink" />
                                <span className="text-white font-bold text-xl uppercase tracking-widest">Manufacturer-Certified Installations (OC for Asphalt, GAF for Commercial/Flat)</span>
                            </div>
                            <div className="flex gap-4 items-center">
                                <ArrowRightIcon className="w-6 h-6 text-[#22d3ee]" />
                                <span className="text-white font-bold text-xl uppercase tracking-widest">Comprehensive Analysis Reports for Quote, Installation, & Annual Inspections INCLUDED</span>
                            </div>
                            <div className="flex gap-4 items-center">
                                <ArrowRightIcon className="w-6 h-6 text-rhive-pink" />
                                <span className="text-white font-bold text-xl uppercase tracking-widest">NO SALESMAN MARKUP — Material, Labor, Overhead & Profit Shown on Every Quote</span>
                            </div>

                            <p className="mt-8 italic text-white/90 font-serif text-xl border-l-4 border-rhive-pink pl-6 py-2 bg-gradient-to-r from-rhive-pink/10 to-transparent">
                                RHIVE is more than construction—it’s a commitment. Every project reinvests into our communities, fuels workforce development, and pioneers AI-driven change to eliminate waste and elevate standards.
                            </p>
                            <p className="font-bold text-rhive-pink text-xl drop-shadow-[0_0_10px_rgba(236,2,139,0.5)]">
                                When you choose RHIVE, you join a movement defined by integrity, transparency, and lasting impact.
                            </p>
                        </div>
                        <div className="flex-[1.2] w-full p-[2px] bg-gradient-to-tr from-rhive-blue via-transparent to-rhive-pink shadow-[0_0_60px_rgba(8,19,124,0.4)] relative aspect-video group transform-gpu hover:-translate-y-2 transition-transform duration-700"
                            style={{ clipPath: 'polygon(24px 0, 100% 0, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0 100%, 0 24px)' }}>
                            <div className="w-full h-full overflow-hidden bg-black relative z-10"
                                style={{ clipPath: 'polygon(23px 0, 100% 0, 100% calc(100% - 23px), calc(100% - 23px) 100%, 0 100%, 0 23px)' }}>
                                {/* Embedded Video using Wix MP4 fallback pattern */}
                                <video
                                    className="w-full h-full object-cover filter contrast-110 saturate-125"
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                    poster="https://static.wixstatic.com/media/c5862a_28b9264eb7464935b430c16685d190dc~mv2.png/v1/fill/w_784,h_441,al_c,q_85,usm_0.33_1.00_0.01,enc_avif,quality_auto/c5862a_28b9264eb7464935b430c16685d190dc~mv2.png"
                                >
                                    <source src="https://video.wixstatic.com/video/c5862a_28b9264eb7464935b430c16685d190dc/720p/mp4/file.mp4" type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            </div>
                            <div className="absolute inset-0 bg-[#22d3ee]/20 blur-2xl -z-10 group-hover:opacity-100 opacity-0 transition-opacity duration-700" />
                        </div>
                    </div>
                </section>

                {/* OUR HIVE IS A MOVEMENT */}
                <section className="py-16 relative isolate">
                    {/* 3x Glowing Orb Background */}
                    <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[800px] h-[800px] mix-blend-screen opacity-20 pointer-events-none z-[-1]">
                        <img
                            src="https://static.wixstatic.com/media/c5862a_e261d6d6b240466785d6f2996ec33b3c~mv2.gif"
                            alt="Hunni Orb Background Effect"
                            className="w-full h-full object-contain filter drop-shadow-[0_0_100px_rgba(236,2,139,0.8)] scale-150 transform-gpu translate-x-1/3"
                        />
                    </div>

                    <div className="glass-dark p-12 border border-[var(--rhive-border)] shadow-xl relative z-10 max-w-5xl mx-auto"
                        style={{ clipPath: 'polygon(40px 0, 100% 0, 100% calc(100% - 40px), calc(100% - 40px) 100%, 0 100%, 0 40px)' }}>
                        <div className="flex flex-col">
                            <h2 className="text-4xl font-black uppercase tracking-tighter text-white mb-6">"Our Hive" Is a Movement</h2>
                            <div className="text-[var(--rhive-text-muted)] text-xl leading-relaxed space-y-6">
                                <p>Every roof we install supports a bigger mission. At RHIVE, a percentage of every project goes directly into community reinvestment, workforce development, and giving back.</p>
                                <p>We're trailblazers in construction. Using AI to eliminate waste, improve outcomes, and drive real change in an industry long overdue for it.</p>
                                <p>We’re growing across the U.S., expanding our reach with a clear goal: redefine what it means to hire a contractor. Because when you work with RHIVE, you’re not just buying a roof. You’re joining a movement for transparency, integrity, and long-lasting impact.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="flex flex-col xl:flex-row gap-12 items-center w-full max-w-[1400px] mx-auto">
                    <div className="flex-1 w-full max-w-3xl">
                        <SectionHeader title="Our Promise to You" />
                        <div className="space-y-4 pt-4">
                            {[
                                "Transparent, detailed estimates—no hidden fees.",
                                "Lifetime guarantees on craftsmanship and quality.",
                                "Each project supports community initiatives.",
                                "Built with precision and pride—as if it were our own home."
                            ].map((promise, idx) => (
                                <div key={idx} className="flex items-center gap-4 text-xl text-white">
                                    <CheckCircle2 className="w-8 h-8 text-green-500 shrink-0" />
                                    <span>{promise}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex-[1.2] w-full">
                        <div className="relative w-full bg-black/60 border border-[var(--border-color)] p-8 shadow-[0_0_30px_rgba(8,19,124,0.3)]"
                            style={{ clipPath: 'polygon(24px 0, 100% 0, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0 100%, 0 24px)' }}>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-rhive-blue/20 blur-3xl z-0" />
                            <div className="relative z-10 text-center mb-6">
                                <h3 className="text-3xl font-black uppercase tracking-tighter text-white mb-1">Unforeseen Expenses</h3>
                                <p className="text-[var(--rhive-text-muted)] text-sm font-serif italic">
                                    Be wary of low bids with hidden costs—we show you all expenses upfront.
                                </p>
                            </div>
                            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Left Column */}
                                <div className="space-y-4">
                                    <div className="bg-[#111] border border-[#374151] p-4 text-white hover:border-rhive-pink/50 transition-colors">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="font-bold text-rhive-pink uppercase tracking-widest text-[11px]">Difficult Access</span>
                                            <span className="text-[10px] text-[#9CA3AF]">Add-On / SQ</span>
                                        </div>
                                        <ul className="text-[11px] text-[#9CA3AF] space-y-2">
                                            <li className="flex justify-between"><span>2 Stories or greater</span><span>$15.00</span></li>
                                            <li className="flex justify-between"><span>High Pitch &gt; 7/12</span><span>$45.00</span></li>
                                            <li className="flex justify-between"><span>Poor Access</span><span>$22.50</span></li>
                                            <li className="flex justify-between"><span>Load &gt;7/12</span><span>$22.50</span></li>
                                        </ul>
                                    </div>
                                    <div className="bg-[#111] border border-[#374151] p-4 text-white hover:border-rhive-blue/50 transition-colors">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="font-bold text-rhive-blue uppercase tracking-widest text-[11px]">Decking</span>
                                            <span className="text-[10px] text-[#9CA3AF]">Add-On</span>
                                        </div>
                                        <ul className="text-[11px] text-[#9CA3AF] space-y-2">
                                            <li className="flex justify-between"><span>R&R OSB / SH</span><span>$78.13</span></li>
                                            <li className="flex justify-between"><span>ReDeck OSB / SQ</span><span className="text-rhive-pink font-bold">INCLUDED</span></li>
                                        </ul>
                                    </div>
                                </div>

                                {/* Right Column */}
                                <div className="space-y-4">
                                    <div className="bg-[#111] border border-[#374151] p-4 text-white hover:border-[#22d3ee]/50 transition-colors">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="font-bold text-[#22d3ee] uppercase tracking-widest text-[11px]">Ventilation</span>
                                            <span className="text-[10px] text-[#9CA3AF]">Add-On / EA</span>
                                        </div>
                                        <ul className="text-[11px] text-[#9CA3AF] space-y-2">
                                            <li className="flex justify-between"><span>Ridge Vent</span><span className="text-rhive-pink font-bold">INCLUDED</span></li>
                                            <li className="flex justify-between"><span>Install Turtle Vent</span><span>$32.81</span></li>
                                            <li className="flex justify-between"><span>Install Power Vent</span><span>$100.00</span></li>
                                        </ul>
                                    </div>
                                    <div className="bg-[#111] border border-[#374151] p-4 text-white hover:border-rhive-pink/50 transition-colors">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="font-bold text-rhive-pink uppercase tracking-widest text-[11px]">Flashing</span>
                                            <span className="text-[10px] text-[#9CA3AF]">Add-On</span>
                                        </div>
                                        <ul className="text-[11px] text-[#9CA3AF] space-y-2">
                                            <li className="flex justify-between"><span>Step Flashing</span><span className="text-rhive-pink font-bold">INCLUDED</span></li>
                                            <li className="flex justify-between"><span>L Flashing</span><span className="text-rhive-pink font-bold">INCLUDED</span></li>
                                            <li className="flex justify-between"><span>Chimney Flashing</span><span>$259.90</span></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* MEET OUR FOUNDERS */}
                <section className="space-y-16 pt-16 border-t border-[var(--rhive-border)]">
                    <SectionHeader title="Meet Our Founders" />
                    <div className="space-y-16">
                        <AuthenticFounderCard
                            name="Kara Robinson"
                            role="President & Founder"
                            tagline="Heart First. Mission Always."
                            bio={[
                                "Kara entered the roofing industry after recognizing core failures she refused to accept: lack of transparency, disconnection from community, and systems that treated people like numbers. She saw an opportunity to lead differently—and built RHIVE to prove that operational excellence and human impact don't have to compete.",
                                "RHIVE was founded on Kara's belief that a company should be both precise and personal. She championed a model that breaks down every cost clearly, exposes industry tricks, teaches customers what really matters, and ensures getting rid of the salesman results in a win-win for the homeowner.",
                                "Kara leads with intention and impact, ensuring every roof isn't just done right—but done with purpose. For her, it's never just a project. It's a chance to build trust, uplift communities, and raise the standard of what this industry can be."
                            ]}
                            image="https://static.wixstatic.com/media/c5862a_591faf36d59c448e8c92b9caff471e96~mv2.png/v1/fill/w_198,h_250,fp_0.53_0.42,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/KARA%20ROBINSON%2C%20RHIVE%20CONSTRUCTION.png"
                            colorClass="rhive-pink"
                            isFlipped={false}
                        />

                        <AuthenticFounderCard
                            name="Michael Robinson"
                            role="CEO & Strategic Architect"
                            tagline="The Disruptor Who Builds Better."
                            bio={[
                                "Michael entered the roofing industry after seeing three things he couldn't ignore: lack of transparency, bloated overhead, and warranties that didn't actually protect customers.",
                                "RHIVE was born from Michael's desire to bring truth and integrity back to the construction world. With decades of experience and a mind for innovation, he's led the charge in leveraging automation, AI, and streamlined operations to make roofing faster, smarter, and more trustworthy.",
                                "Michael believes real value comes from honesty, not hype—and RHIVE reflects that in every detail, from the cost breakdowns you can actually understand, to the lifetime guarantees we stand behind."
                            ]}
                            image="https://static.wixstatic.com/media/c5862a_f1b8b6616fe44f739664188e00d416ce~mv2.png/v1/fill/w_198,h_250,fp_0.49_0.34,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/MICHAEL%20ROBINSON%2C%20RHIVE%20CONSTRUCTION.png"
                            colorClass="rhive-blue"
                            isFlipped={true}
                        />
                    </div>
                </section>

                {/* CALL TO ACTION */}
                <section className="py-24 text-center border-t border-[var(--rhive-border)]">
                    <h3 className="text-4xl md:text-5xl font-black uppercase text-white mb-6 tracking-tighter">Enter Your Project Address</h3>
                    <p className="text-[var(--rhive-text-muted)] mb-12 max-w-2xl mx-auto font-serif italic text-[1.4rem] leading-snug">
                        See what the RHIVE experience looks like and get numbers on your project today!
                    </p>
                    <AddressScanInput id="about-us-scanner" />
                    <p className="mt-8 text-xs font-mono text-gray-500 uppercase">©2025 RHIVE CONSTRUCTION | POWERED BY RHIVE'S AI ARCHITECT</p>
                </section>

            </div>
        </div>
    );
};

export default AboutUsPage;
