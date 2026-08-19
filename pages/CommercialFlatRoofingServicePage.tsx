import React, { useEffect } from 'react';
import { Phone, Shield, ArrowRight, CheckCircle2, Zap } from 'lucide-react';

export default function CommercialFlatRoofingServicePage() {
    useEffect(() => {
        document.title = "Commercial Flat Roofing Contractor Utah | RHIVE Construction";
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
            metaDesc = document.createElement('meta');
            metaDesc.setAttribute('name', 'description');
            document.head.appendChild(metaDesc);
        }
        metaDesc.setAttribute('content', "Utah & Idaho's certified commercial flat roofer. Premier GAF PVC & TPO membrane systems backed by GAF NDL warranties. Get a 7-day RPSP quote now!");
    }, []);

    const handleEstimateClick = () => {
        window.location.href = '/estimate-tool';
    };

    return (
        <div className="min-h-screen bg-black text-white relative overflow-hidden font-sans">
            {/* Dark gradient blur effects */}
            <div className="absolute top-1/4 left-1/3 -translate-x-1/2 w-[500px] h-[500px] bg-rhive-blue/10 blur-[120px] rounded-full pointer-events-none" />

            {/* Hero Section */}
            <section className="relative z-10 pt-20 pb-20 px-6 max-w-5xl mx-auto text-center">
                <div className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-3 block">
                    GAF CERTIFIED COMMERCIAL CONTRACTOR | SERVING UTAH &amp; IDAHO
                </div>
                <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-6">
                    Elite Commercial Flat Roofing &amp;<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-rhive-pink">
                        Membrane Systems in Utah &amp; Idaho
                    </span>
                </h1>
                <div className="text-xl md:text-2xl font-serif italic text-rhive-pink mb-8">
                    Certified GAF PVC &amp; TPO Waterproofing Solutions with NDL Warranties.
                </div>
                <p className="text-lg text-gray-300 max-w-[75ch] mx-auto mb-10 leading-relaxed font-serif">
                    Commercial flat and low-slope roofing systems require specialized materials, advanced thermal modeling, and flawless installation to withstand seasonal temperature extremes. RHIVE Construction serves as the premier tech-enabled commercial flat roofing contractor along the Wasatch Front and throughout Idaho. As a certified commercial installer utilizing GAF’s industry-leading membrane systems, we protect your assets with complete transparent pricing and manufacturer-backed No Dollar Limit (NDL) warranties.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-6">
                    <button
                        onClick={handleEstimateClick}
                        className="bg-rhive-pink text-white font-bold text-base uppercase tracking-widest px-8 py-4 rounded-full shadow-[0_0_15px_rgba(236,2,139,0.4)] hover:shadow-[0_0_25px_rgba(236,2,139,0.7)] transition-all duration-300 hover:scale-105"
                    >
                        Schedule Commercial Consultation
                    </button>
                    <a
                        href="tel:4534176637"
                        className="flex items-center gap-2 border border-white/20 hover:border-rhive-pink/50 text-white font-bold text-base uppercase tracking-widest px-8 py-4 rounded-full bg-white/5 transition-all duration-300 hover:scale-105"
                    >
                        <Phone size={16} className="text-rhive-pink" />
                        Call 453-41-ROOFS
                    </a>
                </div>

                <div className="mt-12 rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                    <img 
                        src="/images/commercial-tpo-membrane-re-roof-layover-salt-lake-city-utah.webp"
                        alt="Aerial drone view of a completed GAF certified TPO membrane commercial layover installation in Salt Lake City, Utah."
                        className="w-full h-[350px] object-cover"
                        width={1200}
                        height={350}
                        decoding="async"
                        loading="lazy"
                    />
                </div>
            </section>

            {/* Section 1: Commercial Flat Roofing Systems & Materials */}
            <section className="relative z-10 py-16 px-6 max-w-5xl mx-auto border-t border-white/10">
                <div className="text-center mb-12">
                    <div className="text-3xl font-black uppercase tracking-tight text-white">
                        Commercial Flat Roofing Systems &amp; Materials
                    </div>
                    <div className="w-16 h-1 bg-rhive-pink mx-auto mt-4" />
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col justify-between hover:border-rhive-pink/50 transition-all duration-300">
                        <div>
                            <div className="text-xs text-rhive-pink font-bold uppercase tracking-widest mb-3">Waterproofing Core</div>
                            <div className="text-lg font-bold text-white mb-3">GAF PVC Roofing Membranes</div>
                            <p className="text-gray-400 text-base leading-relaxed font-serif">
                                A durable, highly flexible material, Polyvinyl Chloride (PVC) roofing is an ideal choice for flat or low-slope roofs. It is highly resistant to chemicals, fire, and harsh weather conditions, making it the perfect choice for industrial, manufacturing, and food-service facilities.
                            </p>
                        </div>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col justify-between hover:border-rhive-pink/50 transition-all duration-300">
                        <div>
                            <div className="text-xs text-rhive-pink font-bold uppercase tracking-widest mb-3">Energy Efficiency</div>
                            <div className="text-lg font-bold text-white mb-3">GAF TPO Roofing Membranes</div>
                            <p className="text-gray-400 text-base leading-relaxed font-serif">
                                Thermoplastic Polyolefin (TPO) roofs are exceptionally well-suited for commercial systems seeking maximum energy efficiency. TPO highly reflects solar heat, helping lower your building's HVAC cooling bills during hot Utah summers.
                            </p>
                        </div>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col justify-between hover:border-rhive-pink/50 transition-all duration-300">
                        <div>
                            <div className="text-xs text-rhive-pink font-bold uppercase tracking-widest mb-3">Integrated Assembly</div>
                            <div className="text-lg font-bold text-white mb-3">Integrated Roofing Components</div>
                            <p className="text-gray-400 text-base leading-relaxed font-serif">
                                We install the entire commercial roof system from the decking up. This includes custom-fitted insulation boards for thermal resistance, robust cover boards, and specialized ballast or adhesive systems to permanently anchor the membrane against severe winds.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 2: Flexible Re-Roofing Options: Tear-Off vs. Layover */}
            <section className="relative z-10 py-16 px-6 max-w-5xl mx-auto border-t border-white/10">
                <div className="text-center mb-12">
                    <div className="text-3xl font-black uppercase tracking-tight text-white">
                        Flexible Re-Roofing Options: Tear-Off vs. Layover
                    </div>
                    <div className="w-16 h-1 bg-rhive-pink mx-auto mt-4" />
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-8 bg-white/5 border border-white/10 rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.3)]">
                        <div className="text-xl font-bold text-white mb-4">Layover Membrane Installations</div>
                        <p className="text-gray-400 text-base leading-relaxed font-serif">
                            Under Utah building codes, layovers are permitted on existing single-layer systems. If your current sub-roofing is dry and structurally sound, our expert crews can install a new, certified layover membrane, which is inspected and fully certified by GAF—saving you massive upfront tear-off costs.
                        </p>
                    </div>
                    <div className="p-8 bg-white/5 border border-white/10 rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.3)]">
                        <div className="text-xl font-bold text-white mb-4">Full System Tear-Off &amp; Replacement</div>
                        <p className="text-gray-400 text-base leading-relaxed font-serif">
                            For saturated, failing, or multi-layered roofs, we perform a complete tear-off down to the decking. This allows our team to inspect and replace deteriorating structural decking sheets before deploying a pristine, new membrane system.
                        </p>
                    </div>
                </div>
            </section>

            {/* Section 3: Elite GAF Commercial Warranties */}
            <section className="relative z-10 py-16 px-6 max-w-5xl mx-auto border-t border-white/10">
                <div className="text-center mb-12">
                    <div className="text-3xl font-black uppercase tracking-tight text-white">
                        Elite GAF Commercial Warranties
                    </div>
                    <div className="w-16 h-1 bg-rhive-pink mx-auto mt-4" />
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                        <div className="text-lg font-bold text-white mb-2">GAF System Plus Limited Warranty</div>
                        <p className="text-gray-400 text-base leading-relaxed font-serif">
                            Provides extended system coverage when your commercial project is executed by our certified crews.
                        </p>
                    </div>
                    <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                        <div className="text-lg font-bold text-white mb-2">No Dollar Limit (NDL) Warranty</div>
                        <p className="text-gray-400 text-base leading-relaxed font-serif">
                            The gold standard of commercial roofing. The GAF NDL Warranty covers both materials and labor with absolutely no cap on payout, giving building owners complete long-term peace of mind.
                        </p>
                    </div>
                    <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                        <div className="text-lg font-bold text-white mb-2">RHIVE's Lifetime Installer Guarantee</div>
                        <p className="text-gray-400 text-base leading-relaxed font-serif">
                            Our commercial work is backed by our own direct Lifetime No-Leak Workmanship Guarantee—if we installed it and it leaks, we fix it for free, for life.
                        </p>
                    </div>
                </div>
            </section>

            {/* Section 4: The RHIVE Project Savings Promotion (RPSP) */}
            <section className="relative z-10 py-16 px-6 max-w-3xl mx-auto border-t border-white/10">
                <div className="bg-black/60 border-2 border-rhive-pink p-8 rounded-2xl shadow-[0_0_30px_rgba(236,2,139,0.2)]">
                    <div className="text-center mb-6">
                        <div className="inline-block bg-rhive-pink text-white font-bold text-xs uppercase tracking-widest px-4 py-1.5 rounded-full mb-3 shadow-[0_0_10px_rgba(236,2,139,0.5)]">
                            Promotion Active
                        </div>
                        <div className="text-2xl font-black uppercase tracking-tight text-white">
                            The RHIVE Project Savings Promotion (RPSP)
                        </div>
                        <p className="text-gray-400 font-serif italic mt-2 text-sm">
                            Passing automated scheduling savings directly back to your ledger.
                        </p>
                    </div>
                    <div className="space-y-4">
                        <div className="text-lg font-bold text-white">The 7-Day Decision Credit</div>
                        <p className="text-gray-400 text-base leading-relaxed font-serif">
                            By analyzing decision-making timelines, we've optimized our scheduling. If you decide to move forward with your commercial project within 7 days of receiving your estimate, we slash project costs by 10%, up to $3,000 on larger commercial projects. This eliminates administrative overhead, and we pass those savings directly back to you.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
