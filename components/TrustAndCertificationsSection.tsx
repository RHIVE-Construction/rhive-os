import React, { useState, useEffect } from 'react';
import { Star, Award, Shield, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const TrustAndCertificationsSection = () => {
    // Basic Carousel State
    const [currentSlide, setCurrentSlide] = useState(0);
    const [ocOpen, setOcOpen] = useState(false);
    const [gafOpen, setGafOpen] = useState(false);

    const reviews = [
        {
            name: "Michael S.",
            role: "Homeowner",
            text: "RHIVE's dual-math quote actually showed me where my money was going. The installation crew was incredibly professional, and they didn't leave a single nail in the yard.",
            stars: 5
        },
        {
            name: "Sarah T.",
            role: "Property Investor",
            text: "I appreciated that they outright refused to do an overlay on my rental property. They explained the structural danger, stripped it to the deck, and did it right.",
            stars: 5
        },
        {
            name: "David L.",
            role: "Homeowner",
            text: "After the hail storm, their comprehensive roof reporting package gave my insurance company exactly what they needed without the usual endless back-and-forth.",
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
                            <Award className="w-6 h-6 text-[var(--rhive-pink)]" />
                            <span className="font-mono text-[11px] font-bold uppercase tracking-[0.4em] text-[var(--rhive-pink)]">
                                Elite Qualification Standard
                            </span>
                        </div>

                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tighter mb-8 font-display leading-[0.9]">
                            CERTIFIED IN<br/>
                            <span className="text-[var(--rhive-pink)] text-3xl md:text-5xl">MANUFACTURER SPECS</span>
                        </h2>

                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <button 
                                onClick={() => setOcOpen(true)}
                                className="bg-white/5 border border-white/10 p-4 transition-all hover:bg-[var(--rhive-pink)]/10 hover:border-[var(--rhive-pink)]/50 group duration-500 text-left relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Star className="w-3 h-3 text-[var(--rhive-pink)]" />
                                </div>
                                <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-1 group-hover:text-[var(--rhive-pink)] transition-colors">Owens Corning</h4>
                                <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">Preferred Contractor</p>
                            </button>
                            <button 
                                onClick={() => setGafOpen(true)}
                                className="bg-white/5 border border-white/10 p-4 transition-all hover:bg-[#e2ab49]/10 hover:border-[#e2ab49]/50 group duration-500 text-left relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Star className="w-3 h-3 text-[#e2ab49]" />
                                </div>
                                <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-1 group-hover:text-[#e2ab49] transition-colors">GAF Certified</h4>
                                <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">Master Installer Status</p>
                            </button>
                        </div>

                        <p className="text-gray-400 font-sans text-sm leading-relaxed mb-6 text-balance">
                            These badges represent a <span className="text-white font-bold">top 1% industry standard</span>. They are not simply bought; they are aggressively earned through rigorous background checks, financial audits, and <strong>mandatory on-site manufacturer inspections</strong> that verify absolute compliance with engineering tolerances.
                        </p>
                        
                        <p className="text-gray-300 font-sans text-sm leading-relaxed mb-8 border-l-2 border-[var(--rhive-pink)] pl-4">
                            Because we execute installations to precise manufacturer engineering tolerances, your roof qualifies for <span className="text-[#ec028b]">50-Year Non-Prorated</span> lifetime coverage that uncertified competitors cannot legally offer.
                        </p>

                        {/* Celebratory Badge */}
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-[var(--rhive-pink)] via-[#00D1FF] to-[var(--rhive-pink)] opacity-30 blur group-hover:opacity-100 group-hover:animate-pulse transition duration-1000"></div>
                            <div className="relative flex items-center gap-3 px-6 py-3 bg-black border border-white/20 w-fit cursor-default">
                                <Shield className="w-5 h-5 text-[var(--rhive-pink)] animate-bounce" />
                                <span className="text-[11px] font-black uppercase tracking-[0.3em] text-white">Preferred Protection Upgrade Unlocked</span>
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
                                        <h4 className="text-white font-bold text-xs uppercase tracking-widest">{reviews[currentSlide].name}</h4>
                                        <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">{reviews[currentSlide].role}</p>
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
                                <div className="text-[10px] uppercase tracking-widest text-[#e2ab49] font-black">
                                    ★ 4.9 Stars on 399 Reviews
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* LIGHTBOXES */}
            {ocOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-xl bg-black/80 animate-in fade-in duration-300">
                    <div className="relative w-full max-w-2xl bg-[#0a0a0a] border border-[var(--rhive-pink)]/30 p-12 overflow-hidden shadow-[0_0_100px_rgba(236,2,139,0.2)]">
                        <div className="absolute top-0 right-0 p-8">
                             <button onClick={() => setOcOpen(false)} className="text-gray-500 hover:text-white transition-colors uppercase font-black text-xs tracking-widest">Close [x]</button>
                        </div>
                        <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-6">OWENS CORNING PREFERRED</h3>
                        <div className="space-y-6 text-gray-400 font-sans text-sm">
                            <p>As an OC Preferred Contractor, RHIVE has met strict requirements including general liability insurance, workers compensation, and a clean history with no unresolved better business bureau complaints.</p>
                            <ul className="space-y-4">
                                <li className="flex gap-4">
                                    <div className="w-1 h-6 bg-[var(--rhive-pink)]" />
                                    <div><span className="text-white font-bold uppercase text-xs block mb-1">Mandatory Training</span> Crews must pass regular installation and safety training modules directly from the manufacturer.</div>
                                </li>
                                <li className="flex gap-4">
                                    <div className="w-1 h-6 bg-[var(--rhive-pink)]" />
                                    <div><span className="text-white font-bold uppercase text-xs block mb-1">Job-Site Audits</span> Owens Corning reserved the right to audit our job sites randomly to ensure shingle layouts meet warranty specs.</div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {gafOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-xl bg-black/80 animate-in fade-in duration-300">
                    <div className="relative w-full max-w-2xl bg-[#0a0a0a] border border-[#e2ab49]/30 p-12 overflow-hidden shadow-[0_0_100px_rgba(226,171,73,0.2)]">
                        <div className="absolute top-0 right-0 p-8">
                             <button onClick={() => setGafOpen(false)} className="text-gray-500 hover:text-white transition-colors uppercase font-black text-xs tracking-widest">Close [x]</button>
                        </div>
                        <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-6">GAF MASTER INSTALLER</h3>
                        <div className="space-y-6 text-gray-400 font-sans text-sm">
                            <p>GAF Certification is reserved for contractors who demonstrate stability and a commitment to high-performance system installations across residential and commercial sectors.</p>
                            <ul className="space-y-4">
                                <li className="flex gap-4">
                                    <div className="w-1 h-6 bg-[#e2ab49]" />
                                    <div><span className="text-white font-bold uppercase text-xs block mb-1">Precision Execution</span> Mastery of GAF Cobra ventilation systems and Pro-Start starter strips to prevent blow-offs.</div>
                                </li>
                                <li className="flex gap-4">
                                    <div className="w-1 h-6 bg-[#e2ab49]" />
                                    <div><span className="text-white font-bold uppercase text-xs block mb-1">Financial Integrity</span> Proof of stable business operations ensuring we are here to back your warranty for decades.</div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default TrustAndCertificationsSection;
