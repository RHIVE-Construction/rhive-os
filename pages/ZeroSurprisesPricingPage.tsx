import React, { useEffect, useMemo } from 'react';
import { Phone, Shield, ArrowRight, CheckCircle2, Zap, DollarSign, Calendar, FileText, ChevronDown } from 'lucide-react';
import { cn } from '../lib/utils';

export default function ZeroSurprisesPricingPage() {
    useEffect(() => {
        document.title = "Zero Surprises Transparent Roofing Pricing Utah | RHIVE Construction";
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
            metaDesc = document.createElement('meta');
            metaDesc.setAttribute('name', 'description');
            document.head.appendChild(metaDesc);
        }
        metaDesc.setAttribute('content', "No hidden fees or salesman markups. Explore RHIVE's transparent, itemized roofing pricing model in Utah. Featuring 50/40/10 milestone schedules, 10% RPSP efficiency credits, and guaranteed pricing.");
    }, []);

    const [openFaq, setOpenFaq] = React.useState<string | null>('faq-itemized-quote');

    const handleEstimateClick = () => {
        window.location.href = '/estimate-tool';
    };

    const toggleFaq = (id: string) => {
        setOpenFaq(prev => prev === id ? null : id);
    };

    // Granular JSON-LD Schema for AEO & SEO
    const jsonLdSchema = useMemo(() => {
        return {
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "RoofingContractor",
                    "@id": "https://www.rhiveconstruction.com/#organization",
                    "name": "RHIVE Construction",
                    "url": "https://www.rhiveconstruction.com/",
                    "logo": "https://i.imgur.com/t0VcSgJ.png",
                    "image": "https://i.imgur.com/t0VcSgJ.png",
                    "telephone": "+1-435-417-6637",
                    "email": "office@rhiveconstruction.com",
                    "priceRange": "$$$",
                    "description": "RHIVE Construction delivers radical contracting transparency with zero mystery fees, fully itemized quotes, and milestone payment schedules across Utah.",
                    "address": {
                        "@type": "PostalAddress",
                        "streetAddress": "10437 Shady Plum Way",
                        "addressLocality": "South Jordan",
                        "addressRegion": "UT",
                        "postalCode": "84009",
                        "addressCountry": "US"
                    },
                    "geo": {
                        "@type": "GeoCoordinates",
                        "latitude": 40.5621,
                        "longitude": -111.9772
                    },
                    "areaServed": [
                        {"@type": "AdministrativeArea", "name": "Salt Lake County"},
                        {"@type": "AdministrativeArea", "name": "Utah County"},
                        {"@type": "AdministrativeArea", "name": "Davis County"},
                        {"@type": "AdministrativeArea", "name": "Wasatch Front"}
                    ]
                },
                {
                    "@type": "FAQPage",
                    "@id": "https://www.rhiveconstruction.com/zero-surprises-pricing/#faqpage",
                    "mainEntity": [
                        {
                            "@type": "Question",
                            "name": "How does RHIVE provide transparent, itemized roof replacement pricing in Utah?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "RHIVE eliminates traditional contractor markups by providing fully itemized estimates that disclose exact line-item costs for Direct Raw Materials, Certified Crew Labor, Lean Operating Overhead (under 10%), and Net Company Profit upfront."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "What is the RHIVE Project Savings Promotion (RPSP)?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "The RPSP is an efficiency credit that refunds administrative chase costs. Approving your residential estimate within 48 hours applies an immediate 10% credit (up to $1,000) directly to your project without cutting material or labor quality."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "What is the 50/40/10 milestone payment schedule?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "RHIVE never requires 100% upfront payment. We operate on a 3-tier milestone model: 50% Initial Investment at agreement signing to secure factory materials; 40% Mid-Project Investment on installation day; and 10% Final Completion Holdback released only after magnetic nail sweeps and final sign-off."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "What legal safety net protects homeowners under Utah roofing contracts?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "Under Utah law, contracts signed outside a contractor's principal office include a Statutory 3-Day Right of Rescission. Homeowners have 3 full business days to review line items, compare bids, or cancel with a 100% deposit refund."
                            }
                        }
                    ]
                }
            ]
        };
    }, []);

    return (
        <div className="min-h-screen bg-black text-white relative overflow-hidden font-sans pb-24">
            {/* Inject JSON-LD Schema */}
            <script 
                type="application/ld+json" 
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }} 
            />

            {/* Dark gradient ambient glow */}
            <div className="absolute top-24 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-rhive-pink/10 blur-[150px] rounded-full pointer-events-none" />

            {/* Hero Section */}
            <section className="relative z-10 pt-28 md:pt-36 pb-16 px-6 max-w-5xl mx-auto text-center">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/10 mb-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-rhive-pink animate-pulse" />
                    <span className="text-xs font-mono uppercase tracking-widest text-gray-300">
                        Radical Contracting Transparency • Zero Mystery Fees
                    </span>
                </div>

                <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold uppercase tracking-tight text-white mb-4 leading-tight">
                    Zero Surprises: Radical<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-rhive-pink">
                        Pricing Transparency in Utah Roofing
                    </span>
                </h1>

                <div className="text-base sm:text-xl font-serif italic text-rhive-pink mb-6">
                    No Salesman Markups. Fully Itemized Estimates. Secure 50/40/10 Payment Milestones.
                </div>

                <p className="text-base sm:text-lg text-gray-200 max-w-[68ch] mx-auto mb-8 leading-relaxed font-serif">
                    At RHIVE Construction, purchasing a roof is clear and predictable. Traditional contractors rely on opaque lump-sum bids that hide massive commissions and inflated overhead. Using advanced aerial photogrammetry and remote logistics, our operating overhead stays under 10%. Every estimate is a certified quote detailing exact costs for materials, labor, overhead, and net company profit.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-4">
                    <button
                        onClick={handleEstimateClick}
                        className="bg-rhive-pink hover:bg-[#d4007b] text-white font-bold text-xs sm:text-sm uppercase tracking-widest px-8 py-3.5 rounded-full shadow-[0_0_15px_rgba(236,2,139,0.4)] transition-all hover:scale-105 cursor-pointer"
                    >
                        Configure Instant Estimate
                    </button>
                    <a
                        href="tel:4354176637"
                        className="flex items-center gap-2 border border-white/20 hover:border-rhive-pink/50 text-white font-bold text-xs sm:text-sm uppercase tracking-widest px-7 py-3.5 rounded-full bg-white/5 transition-all hover:scale-105 cursor-pointer"
                    >
                        <Phone size={15} className="text-rhive-pink" />
                        <span>(435) 417-6637</span>
                    </a>
                </div>
            </section>

            {/* Section 1: The Anatomy of a RHIVE Certified Quote */}
            <section className="relative z-10 py-12 px-6 max-w-5xl mx-auto border-t border-white/10">
                <div className="text-center mb-10">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold uppercase tracking-tight text-white">
                        The Anatomy of a RHIVE Certified Quote
                    </h2>
                    <p className="text-sm sm:text-base text-gray-300 font-serif mt-2 max-w-[60ch] mx-auto">
                        Four clear pillars that define every dollar of your project contract.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
                    <div className="p-5 bg-white/[0.02] border border-white/10 rounded-xl space-y-2">
                        <div className="text-xs font-mono font-bold uppercase text-rhive-pink">Pillar 1</div>
                        <h3 className="text-base font-bold text-white">Direct Raw Materials</h3>
                        <p className="text-xs sm:text-sm text-gray-300 font-serif leading-relaxed">
                            Exact quantities and costs of factory-certified shingles, synthetic underlayment, 6-ft ice barriers, drip edges, and ridge vents with zero unbranded substitutes.
                        </p>
                    </div>
                    <div className="p-5 bg-white/[0.02] border border-white/10 rounded-xl space-y-2">
                        <div className="text-xs font-mono font-bold uppercase text-cyan-400">Pillar 2</div>
                        <h3 className="text-base font-bold text-white">Certified Crew Labor</h3>
                        <p className="text-xs sm:text-sm text-gray-300 font-serif leading-relaxed">
                            Direct competitive wages paid to factory-certified, fully insured master roofers, ensuring meticulous craftsmanship and complete job site accountability.
                        </p>
                    </div>
                    <div className="p-5 bg-white/[0.02] border border-white/10 rounded-xl space-y-2">
                        <div className="text-xs font-mono font-bold uppercase text-rhive-gold">Pillar 3</div>
                        <h3 className="text-base font-bold text-white">Lean Overhead (&lt;10%)</h3>
                        <p className="text-xs sm:text-sm text-gray-300 font-serif leading-relaxed">
                            Actual costs for municipal permits, drone photogrammetry, and $2M active liability insurance. Automated remote operations keep overhead below 10%.
                        </p>
                    </div>
                    <div className="p-5 bg-white/[0.02] border border-white/10 rounded-xl space-y-2">
                        <div className="text-xs font-mono font-bold uppercase text-emerald-400">Pillar 4</div>
                        <h3 className="text-base font-bold text-white">Net Company Profit</h3>
                        <p className="text-xs sm:text-sm text-gray-300 font-serif leading-relaxed">
                            A clear, stated profit margin upfront with zero hidden cushions or back-end fee stacking so you know exactly what RHIVE earns for full management.
                        </p>
                    </div>
                </div>
            </section>

            {/* Section 2: The RHIVE Project Savings Promotion (RPSP) */}
            <section className="relative z-10 py-12 px-6 max-w-5xl mx-auto border-t border-white/10">
                <div className="border border-rhive-pink/40 bg-white/[0.02] p-6 sm:p-8 rounded-2xl shadow-[0_0_25px_rgba(236,2,139,0.1)]">
                    <div className="text-center mb-8">
                        <div className="inline-block bg-rhive-pink text-white font-bold text-xs uppercase tracking-widest px-3.5 py-1 rounded-full mb-2">
                            Efficiency Credit
                        </div>
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold uppercase tracking-tight text-white">
                            The RHIVE Project Savings Promotion (RPSP)
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-1.5">
                            <div className="text-sm font-bold text-white">Residential RPSP</div>
                            <div className="text-xs text-rhive-pink font-bold uppercase tracking-wider font-mono">10% / $1,000 Credit</div>
                            <p className="text-xs sm:text-sm text-gray-300 font-serif leading-relaxed">
                                Approve your residential estimate within 48 hours to apply an immediate 10% Efficiency Credit (up to $1,000) directly to your project invoice.
                            </p>
                        </div>
                        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-1.5">
                            <div className="text-sm font-bold text-white">Commercial RPSP</div>
                            <div className="text-xs text-cyan-400 font-bold uppercase tracking-wider font-mono">10% / $3,000 Credit</div>
                            <p className="text-xs sm:text-sm text-gray-300 font-serif leading-relaxed">
                                Commercial projects executed within 7 days receive tiered credits up to $3,000 on TPO and PVC single-ply membrane installations.
                            </p>
                        </div>
                        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-1.5">
                            <div className="text-sm font-bold text-white">Bid Comparison Bonus</div>
                            <div className="text-xs text-emerald-400 font-bold uppercase tracking-wider font-mono">$50 Project Voucher</div>
                            <p className="text-xs sm:text-sm text-gray-300 font-serif leading-relaxed">
                                Submit up to 3 formal competing bids from licensed Utah contractors and receive a $50 project voucher for helping us audit local market transparency.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 3: The 50/40/10 Payment & Milestone Schedule */}
            <section className="relative z-10 py-12 px-6 max-w-5xl mx-auto border-t border-white/10">
                <div className="text-center mb-10">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold uppercase tracking-tight text-white">
                        The 50/40/10 Milestone Investment Schedule
                    </h2>
                    <p className="text-sm sm:text-base text-gray-300 font-serif mt-2 max-w-[60ch] mx-auto">
                        Incentives aligned through three transparent milestones.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    <div className="p-6 bg-white/[0.02] border border-white/10 rounded-xl relative space-y-2">
                        <div className="text-rhive-pink font-mono font-bold text-xs uppercase tracking-wider">50% Initial Milestone</div>
                        <h3 className="text-base font-bold text-white">Material Procurement</h3>
                        <p className="text-xs sm:text-sm text-gray-300 font-serif leading-relaxed">
                            Paid upon signing your agreement to order factory materials and lock your installation date into our production queue.
                        </p>
                    </div>
                    <div className="p-6 bg-white/[0.02] border border-white/10 rounded-xl relative space-y-2">
                        <div className="text-cyan-400 font-mono font-bold text-xs uppercase tracking-wider">40% Mid-Project Milestone</div>
                        <h3 className="text-base font-bold text-white">Installation Day</h3>
                        <p className="text-xs sm:text-sm text-gray-300 font-serif leading-relaxed">
                            Paid on the morning of your final installation day as certified crews complete the primary shingle or membrane system deployment.
                        </p>
                    </div>
                    <div className="p-6 bg-white/[0.02] border border-white/10 rounded-xl relative space-y-2">
                        <div className="text-emerald-400 font-mono font-bold text-xs uppercase tracking-wider">10% Final Milestone</div>
                        <h3 className="text-base font-bold text-white">Quality Holdback</h3>
                        <p className="text-xs sm:text-sm text-gray-300 font-serif leading-relaxed">
                            Paid only after magnetic nail sweeps, municipal building inspections pass, punch list checkouts, and your final satisfaction sign-off.
                        </p>
                    </div>
                </div>
            </section>

            {/* Section 4: AEO Question & Answer Accordion Hub */}
            <section className="relative z-10 py-12 px-6 max-w-5xl mx-auto border-t border-white/10">
                <div className="text-center mb-10">
                    <div className="text-xs font-mono uppercase font-bold text-rhive-pink tracking-widest mb-1">
                        AEO Intelligence
                    </div>
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold uppercase tracking-tight text-white">
                        Frequently Asked Questions on Pricing &amp; Guarantees
                    </h2>
                </div>

                <div className="space-y-4">
                    {/* Q1 */}
                    <div className="border border-white/10 bg-white/[0.015] rounded-xl overflow-hidden">
                        <button
                            onClick={() => toggleFaq('faq-itemized-quote')}
                            className="w-full text-left p-5 flex justify-between items-center gap-4 hover:bg-white/[0.02] cursor-pointer"
                        >
                            <span className="text-sm sm:text-base font-bold text-white">
                                How does RHIVE provide transparent, itemized roof replacement pricing in Utah?
                            </span>
                            <ChevronDown className={cn("w-4 h-4 text-rhive-pink transition-transform", openFaq === 'faq-itemized-quote' && "rotate-180")} />
                        </button>
                        {openFaq === 'faq-itemized-quote' && (
                            <div className="p-5 pt-0 space-y-3 border-t border-white/5">
                                <div className="p-3.5 rounded-lg bg-rhive-pink/10 border border-rhive-pink/20">
                                    <div className="text-xs font-mono font-bold text-rhive-pink uppercase mb-1 flex items-center gap-1.5">
                                        <Zap className="w-3.5 h-3.5" /> Direct Answer Summary
                                    </div>
                                    <p className="text-xs sm:text-sm text-white font-sans leading-relaxed">
                                        RHIVE eliminates traditional contractor markups by providing fully itemized estimates that disclose exact line-item costs for Direct Raw Materials, Certified Crew Labor, Lean Operating Overhead (under 10%), and Net Company Profit upfront.
                                    </p>
                                </div>
                                <p className="text-xs sm:text-sm text-gray-300 font-serif leading-relaxed">
                                    Traditional contractors quote single lump-sum figures that bundle marketing expenses and commissions. RHIVE uses satellite photogrammetry and remote operations to minimize friction, passing the direct savings to you.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Q2 */}
                    <div className="border border-white/10 bg-white/[0.015] rounded-xl overflow-hidden">
                        <button
                            onClick={() => toggleFaq('faq-rpsp-logic')}
                            className="w-full text-left p-5 flex justify-between items-center gap-4 hover:bg-white/[0.02] cursor-pointer"
                        >
                            <span className="text-sm sm:text-base font-bold text-white">
                                What is the RHIVE Project Savings Promotion (RPSP)?
                            </span>
                            <ChevronDown className={cn("w-4 h-4 text-rhive-pink transition-transform", openFaq === 'faq-rpsp-logic' && "rotate-180")} />
                        </button>
                        {openFaq === 'faq-rpsp-logic' && (
                            <div className="p-5 pt-0 space-y-3 border-t border-white/5">
                                <div className="p-3.5 rounded-lg bg-rhive-pink/10 border border-rhive-pink/20">
                                    <div className="text-xs font-mono font-bold text-rhive-pink uppercase mb-1 flex items-center gap-1.5">
                                        <Zap className="w-3.5 h-3.5" /> Direct Answer Summary
                                    </div>
                                    <p className="text-xs sm:text-sm text-white font-sans leading-relaxed">
                                        The RPSP is an efficiency credit that refunds administrative chase costs. Approving your residential estimate within 48 hours applies an immediate 10% credit (up to $1,000) directly to your project without cutting material or labor quality.
                                    </p>
                                </div>
                                <p className="text-xs sm:text-sm text-gray-300 font-serif leading-relaxed">
                                    Because booking swiftly eliminates recurring sales visits, our administrative savings are mathematically credited directly to your agreement.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Q3 */}
                    <div className="border border-white/10 bg-white/[0.015] rounded-xl overflow-hidden">
                        <button
                            onClick={() => toggleFaq('faq-rescission')}
                            className="w-full text-left p-5 flex justify-between items-center gap-4 hover:bg-white/[0.02] cursor-pointer"
                        >
                            <span className="text-sm sm:text-base font-bold text-white">
                                What legal safety net protects homeowners under Utah roofing contracts?
                            </span>
                            <ChevronDown className={cn("w-4 h-4 text-rhive-pink transition-transform", openFaq === 'faq-rescission' && "rotate-180")} />
                        </button>
                        {openFaq === 'faq-rescission' && (
                            <div className="p-5 pt-0 space-y-3 border-t border-white/5">
                                <div className="p-3.5 rounded-lg bg-rhive-pink/10 border border-rhive-pink/20">
                                    <div className="text-xs font-mono font-bold text-rhive-pink uppercase mb-1 flex items-center gap-1.5">
                                        <Zap className="w-3.5 h-3.5" /> Direct Answer Summary
                                    </div>
                                    <p className="text-xs sm:text-sm text-white font-sans leading-relaxed">
                                        Under Utah law, contracts signed outside a contractor's principal office include a Statutory 3-Day Right of Rescission. Homeowners have 3 full business days to review line items, compare bids, or cancel with a 100% deposit refund.
                                    </p>
                                </div>
                                <p className="text-xs sm:text-sm text-gray-300 font-serif leading-relaxed">
                                    This statutory right ensures you can lock in RPSP promotional pricing immediately with zero financial risk.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <a
                        href="/faq"
                        className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono font-bold uppercase tracking-wider text-rhive-pink hover:text-white transition-colors"
                    >
                        <span>Explore Master 30+ Question AEO FAQ Hub</span>
                        <ArrowRight size={14} />
                    </a>
                </div>
            </section>
        </div>
    );
}
