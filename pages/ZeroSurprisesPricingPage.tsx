import React, { useEffect } from 'react';
import { Phone, Shield, ArrowRight, CheckCircle2, Zap } from 'lucide-react';

export default function ZeroSurprisesPricingPage() {
    useEffect(() => {
        document.title = "Transparent Roofing Pricing & Estimates Utah | RHIVE";
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
            metaDesc = document.createElement('meta');
            metaDesc.setAttribute('name', 'description');
            document.head.appendChild(metaDesc);
        }
        metaDesc.setAttribute('content', "No hidden fees or salesman markups. Explore RHIVE's transparent, itemized roofing pricing model. Backed by the 50/40/10 payment plan & RPSP savings.");
    }, []);

    const handleEstimateClick = () => {
        window.location.href = '/estimate-tool';
    };

    return (
        <div className="min-h-screen bg-black text-white relative overflow-hidden font-sans">
            {/* Dark gradient blur effects */}
            <div className="absolute top-1/4 left-1/3 -translate-x-1/2 w-[500px] h-[500px] bg-rhive-pink/10 blur-[120px] rounded-full pointer-events-none" />

            {/* Hero Section */}
            <section className="relative z-10 pt-20 pb-20 px-6 max-w-5xl mx-auto text-center">
                <div className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-3 block">
                    RADICAL CONTRACTING TRANSPARENCY | ZERO MYSTERY FEES
                </div>
                <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-6">
                    Zero Surprises: Radical<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-rhive-pink">
                        Pricing Transparency in Utah Roofing
                    </span>
                </h1>
                <div className="text-xl md:text-2xl font-serif italic text-rhive-pink mb-8">
                    No Salesman Markups. Fully Itemized Estimates. Secure Financing &amp; Payment Structures.
                </div>
                <p className="text-lg text-gray-300 max-w-[75ch] mx-auto mb-10 leading-relaxed font-serif">
                    At RHIVE Construction, we believe that purchasing a roof should be as clear and straightforward as any other modern service. Traditional contractors rely on opaque lump-sum bids that hide massive commission markups and inflated overhead. We do things differently. Using advanced aerial modeling and automated logistics through Qubit Turnkey, we completely strip away administrative waste. Every estimate we deliver is a certified quote that lays bare our exact costs for materials, labor, operating overhead, and our net profit margin—giving you the data-driven confidence to make the right decision for your home or business.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-6">
                    <button
                        onClick={handleEstimateClick}
                        className="bg-rhive-pink text-white font-bold text-base uppercase tracking-widest px-8 py-4 rounded-full shadow-[0_0_15px_rgba(236,2,139,0.4)] hover:shadow-[0_0_25px_rgba(236,2,139,0.7)] transition-all duration-300 hover:scale-105"
                    >
                        Configure Your Instant Estimate
                    </button>
                    <a
                        href="tel:4534176637"
                        className="flex items-center gap-2 border border-white/20 hover:border-rhive-pink/50 text-white font-bold text-base uppercase tracking-widest px-8 py-4 rounded-full bg-white/5 transition-all duration-300 hover:scale-105"
                    >
                        <Phone size={16} className="text-rhive-pink" />
                        Call 453-41-ROOFS
                    </a>
                </div>
            </section>

            {/* Section 1: The Anatomy of a RHIVE Certified Quote */}
            <section className="relative z-10 py-16 px-6 max-w-5xl mx-auto border-t border-white/10">
                <div className="text-center mb-12">
                    <div className="text-3xl font-black uppercase tracking-tight text-white">
                        The Anatomy of a RHIVE Certified Quote
                    </div>
                    <div className="w-16 h-1 bg-rhive-pink mx-auto mt-4" />
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
                        <div className="text-xl font-bold text-white mb-3">1. Direct Raw Materials</div>
                        <p className="text-gray-400 text-base font-serif leading-relaxed">
                            We list the exact quantity and price of every manufacturer-certified component required for your system—including shingles, synthetic underlayment, ice barriers, drip edges, and ventilation systems. We never use off-brand odds and ends that void your manufacturer warranty.
                        </p>
                    </div>
                    <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
                        <div className="text-xl font-bold text-white mb-3">2. Certified Crew Labor</div>
                        <p className="text-gray-400 text-base font-serif leading-relaxed">
                            The actual cost paid directly to our factory-certified, fully insured installation crews. By respecting and paying our crews competitive, stable rates, we guarantee exceptional craftsmanship on your roof deck.
                        </p>
                    </div>
                    <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
                        <div className="text-xl font-bold text-white mb-3">3. Lean Operational Overhead</div>
                        <p className="text-gray-400 text-base font-serif leading-relaxed">
                            This represents our actual cost to deploy crews, secure city building permits, manage logistics, and provide $2M in active liability protection. Because we use AI automation to eliminate large offices and unnecessary administrative roles, our overhead remains under 10%.
                        </p>
                    </div>
                    <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
                        <div className="text-xl font-bold text-white mb-3">4. Minimal Company Profit</div>
                        <p className="text-gray-400 text-base font-serif leading-relaxed">
                            We state our exact profit margin upfront. No hidden cushions, no back-end fee stacking. You see exactly what RHIVE earns for managing your project from start to finish.
                        </p>
                    </div>
                </div>
            </section>

            {/* Section 2: The RHIVE Project Savings Promotion (RPSP) */}
            <section className="relative z-10 py-16 px-6 max-w-5xl mx-auto border-t border-white/10">
                <div className="border border-rhive-pink/50 bg-black/60 p-8 rounded-2xl shadow-[0_0_30px_rgba(236,2,139,0.1)]">
                    <div className="text-center mb-10">
                        <div className="inline-block bg-rhive-pink text-white font-bold text-xs uppercase tracking-widest px-4 py-1.5 rounded-full mb-3 shadow-[0_0_10px_rgba(236,2,139,0.5)]">
                            Guaranteed Promotions
                        </div>
                        <div className="text-3xl font-black uppercase tracking-tight text-white">
                            The RHIVE Project Savings Promotion (RPSP)
                        </div>
                        <div className="w-16 h-1 bg-rhive-pink mx-auto mt-4" />
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div>
                            <div className="text-lg font-bold text-white mb-2">Residential RPSP</div>
                            <div className="text-xs text-rhive-pink font-bold uppercase tracking-wider mb-2">10% / $1,000 Credit</div>
                            <p className="text-gray-400 text-base font-serif leading-relaxed">
                                If you approve your residential estimate within 48 hours of your consultation, we apply an immediate 10% 'Efficiency Credit' (capped at $1,000 on larger projects). This is not a discount on materials or labor quality; it is a mathematical correction that passes our administrative savings back to you.
                            </p>
                        </div>
                        <div>
                            <div className="text-lg font-bold text-white mb-2">Commercial RPSP</div>
                            <div className="text-xs text-rhive-pink font-bold uppercase tracking-wider mb-2">10% / $3,000 Credit</div>
                            <p className="text-gray-400 text-base font-serif leading-relaxed">
                                For commercial property managers ready to execute within 7 days, we apply a tiered credit starting at 10% (up to $3,000) on larger membrane projects, allowing you to optimize CapEx across your entire portfolio.
                            </p>
                        </div>
                        <div>
                            <div className="text-lg font-bold text-white mb-2">Price Match Guarantee</div>
                            <div className="text-xs text-rhive-pink font-bold uppercase tracking-wider mb-2">Bid Comparison</div>
                            <p className="text-gray-400 text-base font-serif leading-relaxed">
                                We are confident in our transparent pricing structure. If you have competing bids, submit up to three formal estimates from licensed Utah contractors, and we will award you a $50 project voucher for comparing the data.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 3: The 50/40/10 Payment and Investment Schedule */}
            <section className="relative z-10 py-16 px-6 max-w-5xl mx-auto border-t border-white/10">
                <div className="text-center mb-12">
                    <div className="text-3xl font-black uppercase tracking-tight text-white">
                        The 50/40/10 Payment &amp; Investment Schedule
                    </div>
                    <div className="w-16 h-1 bg-rhive-pink mx-auto mt-4" />
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="p-6 bg-white/5 border border-white/10 rounded-xl relative">
                        <div className="absolute top-4 right-4 text-4xl font-black text-white/5">50%</div>
                        <div className="text-lg font-bold text-white mb-2">50% Initial Investment</div>
                        <p className="text-gray-400 text-base font-serif leading-relaxed">
                            Paid upon signing your dynamic Project Design Agreement to secure material procurement and lock in your installation date on our queue.
                        </p>
                    </div>
                    <div className="p-6 bg-white/5 border border-white/10 rounded-xl relative">
                        <div className="absolute top-4 right-4 text-4xl font-black text-white/5">40%</div>
                        <div className="text-lg font-bold text-white mb-2">40% Mid-Project Investment</div>
                        <p className="text-gray-400 text-base font-serif leading-relaxed">
                            Paid on the morning of your final installation day as our crews deploy the premium shingle or membrane systems.
                        </p>
                    </div>
                    <div className="p-6 bg-white/5 border border-white/10 rounded-xl relative">
                        <div className="absolute top-4 right-4 text-4xl font-black text-white/5">10%</div>
                        <div className="text-lg font-bold text-white mb-2">10% Final Completion Holdback</div>
                        <p className="text-gray-400 text-base font-serif leading-relaxed">
                            Paid only after the final roof inspection is passed, magnetic safety sweeps are completed, and you sign off on your complete satisfaction.
                        </p>
                    </div>
                </div>
            </section>

            {/* Section 4: Consumer Safety Nets & Project Guidelines */}
            <section className="relative z-10 py-16 px-6 max-w-5xl mx-auto border-t border-white/10">
                <div className="text-center mb-12">
                    <div className="text-3xl font-black uppercase tracking-tight text-white">
                        Consumer Safety Nets &amp; Project Guidelines
                    </div>
                    <div className="w-16 h-1 bg-rhive-pink mx-auto mt-4" />
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
                        <div className="text-lg font-bold text-white mb-2">3-Day Right to Rescission</div>
                        <p className="text-gray-400 text-base font-serif leading-relaxed">
                            We want you to lock in your RPSP efficiency rates without feeling rushed. In compliance with Utah state law, every signed agreement is backed by a 3-day safety net. You have three full business days to sleep on it, verify specifications, or compare bids—if you change your mind for any reason, cancel with a simple written notice for a full refund of your deposit.
                        </p>
                    </div>
                    <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
                        <div className="text-lg font-bold text-white mb-2">Quote Longevity</div>
                        <p className="text-gray-400 text-base font-serif leading-relaxed">
                            Our aerial measurements and material cost modeling are highly accurate and guaranteed for 14 days from presentation, protecting you from sudden market fluctuations.
                        </p>
                    </div>
                    <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
                        <div className="text-lg font-bold text-white mb-2">Crew Delay Clause</div>
                        <p className="text-gray-400 text-base font-serif leading-relaxed">
                            Efficiency runs both ways. While we guarantee a swift build, if homeowner-caused unavailability delays our active, on-site crews for two hours or more, a standard delay fee of $350 per hour is applied to cover crew standby logistics.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
