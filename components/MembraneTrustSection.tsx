import React, { useState, useEffect } from 'react';
import { Star, Award, Shield, ChevronLeft, ChevronRight, Quote, Building2 } from 'lucide-react';

const MembraneTrustSection = () => {
    // Basic Carousel State
    const [currentSlide, setCurrentSlide] = useState(0);
    const [gafOpen, setGafOpen] = useState(false);

    const reviews = [
        {
            name: "Robert P.",
            role: "Facility Manager",
            text: "RHIVE's commercial team didn't just give us a quote; they provided a complete CapEx diagnostic. The TPO installation was seamless, and operations never stopped.",
            stars: 5
        },
        {
            name: "Elena M.",
            role: "Commercial Real Estate Operator",
            text: "Their dual-math approach for our warehouse roof replacement completely changed how we view capital expenditures. The Master Select warranty gives our investors total peace of mind.",
            stars: 5
        },
        {
            name: "Steven K.",
            role: "Property Asset Director",
            text: "When the severe hail storm hit our retail center, RHIVE's commercial insurance data hub provided the exact engineering specs needed to ensure a fair and full claim settlement.",
            stars: 5
        }
    ];

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % reviews.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + reviews.length) % reviews.length);

    useEffect(() => {
        const timer = setInterval(() => {
            nextSlide();
        }, 6000);
        return () => clearInterval(timer);
    }, [reviews.length]);

    return (
        <section className="py-24 bg-black border-y border-[var(--border-color)] relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-[var(--rhive-pink)]/5 to-transparent pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    
                    {/* The Certification Story */}
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <Building2 className="w-6 h-6 text-[var(--rhive-pink)]" />
                            <span className="font-mono text-base font-bold uppercase tracking-[0.4em] text-[var(--rhive-pink)]">
                                Commercial Certification Standard
                            </span>
                        </div>

                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tighter mb-8 font-display leading-[0.9]">
                            CERTIFIED FOR<br/>
                            <span className="text-[var(--rhive-pink)] text-3xl md:text-5xl">COMMERCIAL SCALE</span>
                        </h2>

                        <div className="grid grid-cols-1 gap-4 mb-8">
                            <button 
                                onClick={() => setGafOpen(true)}
                                className="bg-white/5 border border-white/10 p-4 transition-all hover:bg-[#e2ab49]/10 hover:border-[#e2ab49]/50 group duration-500 text-left relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Star className="w-3 h-3 text-[#e2ab49]" />
                                </div>
                                <h4 className="text-white font-bold text-base uppercase tracking-widest mb-1 group-hover:text-[#e2ab49] transition-colors">GAF Certified</h4>
                                <p className="text-gray-500 text-base uppercase font-bold tracking-widest">Master Select Commercial</p>
                            </button>
                        </div>

                        <p className="text-gray-400 font-sans text-base leading-relaxed mb-6 text-balance">
                            These commercial designations represent a <span className="text-white font-bold">top 1% industry standard</span>. They are earned through rigorous financial audits, multi-million dollar liability prerequisites, and <strong>mandatory on-site manufacturer engineering inspections</strong> during live commercial membrane installations.
                        </p>
                        
                        <p className="text-gray-300 font-sans text-base leading-relaxed mb-8 border-l-2 border-[var(--rhive-pink)] pl-4">
                            Because we execute complex commercial installations strictly to low-slope engineering tolerances, your facility qualifies for the <span className="text-[#ec028b]">Diamond Pledge NDL (No Dollar Limit) Warranty</span>, providing absolute coverage that uncertified competitors cannot legally issue.
                        </p>

                        {/* Celebratory Badge */}
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-[var(--rhive-pink)] via-[var(--rhive-blue)] to-[var(--rhive-pink)] opacity-30 blur group-hover:opacity-100 group-hover:animate-pulse transition duration-1000"></div>
                            <div className="relative flex items-center gap-3 px-6 py-3 bg-black border border-white/20 w-fit cursor-default">
                                <Shield className="w-5 h-5 text-[var(--rhive-pink)] animate-bounce" />
                                <span className="text-base font-black uppercase tracking-[0.3em] text-white">Commercial NDL Upgrade Unlocked</span>
                            </div>
                        </div>
                    </div>


                    {/* Social Proof Carousel */}
                    <div className="relative p-1 bg-gradient-to-tr from-[#e2ab49]/40 via-white/5 to-transparent" style={{ clipPath: 'polygon(24px 0, 100% 0, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0 100%, 0 24px)' }}>
                        <div className="bg-[#050505] p-10 h-full flex flex-col justify-center relative min-h-[400px]" style={{ clipPath: 'polygon(22px 0, 100% 0, 100% calc(100% - 22px), calc(100% - 22px) 100%, 0 100%, 0 22px)' }}>
                            
                            <div className="absolute top-8 right-8 flex gap-1">
                                {[1,2,3,4,5].map((star) => (
                                    <Star key={star} className="w-5 h-5 text-[#e2ab49] fill-[#e2ab49] drop-shadow-[0_0_5px_rgba(226,171,73,0.8)]" />
                                ))}
                            </div>
                            
                            <div className="text-[#e2ab49]/10 absolute -left-4 top-10">
                                <Quote className="w-32 h-32" />
                            </div>

                            <div className="relative z-10 transition-all duration-500 ease-in-out opacity-100">
                                <p className="text-xl md:text-2xl text-white font-serif italic mb-8 leading-relaxed text-balance">
                                    "{reviews[currentSlide].text}"
                                </p>
                                
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full border border-white/20 bg-white/5 flex items-center justify-center font-bold text-white tracking-widest">
                                        {reviews[currentSlide].name.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold text-base uppercase tracking-widest">{reviews[currentSlide].name}</h4>
                                        <p className="text-gray-500 text-base font-bold uppercase tracking-widest">{reviews[currentSlide].role}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Carousel Controls */}
                            <div className="absolute bottom-8 right-8 flex gap-2">
                                <button onClick={prevSlide} className="p-3 border border-white/10 hover:bg-white/10 hover:border-white/30 transition-all text-white">
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                <button onClick={nextSlide} className="p-3 border border-white/10 hover:bg-white/10 hover:border-white/30 transition-all text-white">
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Trust Badge Note */}
                            <div className="absolute bottom-[-10px] left-10 translate-y-full pt-4">
                                <div className="text-base uppercase tracking-widest text-[#e2ab49] font-black">
                                    ★ 5.0 Stars on Commercial Projects
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* LIGHTBOXES */}
            {gafOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-xl bg-black/80 animate-in fade-in duration-300">
                    <div className="relative w-full max-w-2xl bg-[#0a0a0a] border border-[#e2ab49]/30 p-12 overflow-hidden shadow-[0_0_100px_rgba(226,171,73,0.2)]">
                        <div className="absolute top-0 right-0 p-8">
                             <button onClick={() => setGafOpen(false)} className="text-gray-500 hover:text-white transition-colors uppercase font-black text-base tracking-widest">Close [x]</button>
                        </div>
                        <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-6">GAF MASTER SELECT™</h3>
                        <div className="space-y-6 text-gray-400 font-sans text-base">
                            <p>Less than 1% of roofing contractors nationwide achieve Master Select™ status. This commercial designation allows us to offer the Diamond Pledge NDL (No Dollar Limit) Roof Guarantee.</p>
                            <ul className="space-y-4">
                                <li className="flex gap-4">
                                    <div className="w-1 h-6 bg-[#e2ab49]" />
                                    <div><span className="text-white font-bold uppercase text-base block mb-1">Commercial Expertise</span> Demonstrated continuous operation and expertise in low-slope TPO, PVC, and liquid-applied systems.</div>
                                </li>
                                <li className="flex gap-4">
                                    <div className="w-1 h-6 bg-[#e2ab49]" />
                                    <div><span className="text-white font-bold uppercase text-base block mb-1">Stringent Inspections</span> Warranty issuance requires a passing grade from an independent GAF Field Services Engineer on the finished roof.</div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default MembraneTrustSection;
