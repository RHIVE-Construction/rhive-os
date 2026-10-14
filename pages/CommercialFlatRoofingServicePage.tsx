import React, { useEffect, useState } from 'react';
import { 
    Phone, Shield, ArrowRight, CheckCircle2, Zap, 
    Building2, Clock, Layers, Award, MapPin, 
    ChevronDown, Wrench, AlertTriangle, FileText, 
    Check, Sparkles, Scale, DollarSign
} from 'lucide-react';
import { cn } from '../lib/utils';

interface CommercialFaq {
    q: string;
    a: string;
}

const COMMERCIAL_FAQS: CommercialFaq[] = [
    {
        q: "Do you offer commercial roof repairs and emergency leak tarping in Utah?",
        a: "Yes. RHIVE operates a Quantum Rapid-Response Protocol. We dispatch emergency containment crews for heat-welded TPO/PVC membrane patching or synthetic tarping. Emergency containment carries a flat $350 fee, which is 100% credited back toward your permanent repair or full replacement."
    },
    {
        q: "What is a GAF No Dollar Limit (NDL) Warranty?",
        a: "An NDL Warranty is a premium commercial guarantee where GAF covers 100% of material and labor costs to fix manufacturing or installation defects for up to 30 years with zero financial cap on payouts. It requires rigorous factory inspection and certified installer execution."
    },
    {
        q: "Can we install a TPO or PVC membrane over our existing commercial roof in Utah?",
        a: "Under Utah building codes, a single-layer flat roof in dry, sound structural condition can receive a certified layover. RHIVE conducts core moisture testing and thermal infrared diagnostics to determine if your property qualifies, saving thousands in tear-off and disposal costs."
    },
    {
        q: "How does RHIVE eliminate salesman markups on commercial bids?",
        a: "We use AI automation and remote diagnostic tools to manage operations, eliminating the 10–15% commission typically paid to sales reps and passing those savings directly to you via itemized cost quotes detailing Materials, Labor, Overhead (<10%), and Net Profit."
    }
];

export default function CommercialFlatRoofingServicePage() {
    const [openFaq, setOpenFaq] = useState<number | null>(0);

    useEffect(() => {
        document.title = "Commercial Roofing Contractor Utah | TPO & Flat Roofs | RHIVE Construction";
        
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
            metaDesc = document.createElement('meta');
            metaDesc.setAttribute('name', 'description');
            document.head.appendChild(metaDesc);
        }
        metaDesc.setAttribute('content', "Factory-certified commercial flat roofing contractors in Utah. Specializing in GAF EverGuard® TPO/PVC single-ply systems, 30-year NDL warranties, and transparent RPSP pricing.");

        // Schema.org Structured Data: RoofingContractor + Service + FAQPage
        const schemaId = 'schema-commercial-roofing-utah';
        let scriptTag = document.getElementById(schemaId) as HTMLScriptElement | null;
        if (!scriptTag) {
            scriptTag = document.createElement('script');
            scriptTag.id = schemaId;
            scriptTag.type = 'application/ld+json';
            document.head.appendChild(scriptTag);
        }

        const schemaData = {
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "RoofingContractor",
                    "@id": "https://www.rhiveconstruction.com/commercial-roofing#organization",
                    "name": "RHIVE Construction - Commercial Division",
                    "url": "https://www.rhiveconstruction.com/commercial-roofing",
                    "logo": "https://i.imgur.com/t0VcSgJ.png",
                    "image": "https://www.rhiveconstruction.com/images/commercial-tpo-membrane-re-roof-layover-salt-lake-city-utah.webp",
                    "telephone": "+1-801-449-1451",
                    "email": "office@rhiveconstruction.com",
                    "priceRange": "$$$",
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
                        { "@type": "AdministrativeArea", "name": "Salt Lake County" },
                        { "@type": "AdministrativeArea", "name": "Utah County" },
                        { "@type": "AdministrativeArea", "name": "Davis County" },
                        { "@type": "AdministrativeArea", "name": "Summit County" },
                        { "@type": "AdministrativeArea", "name": "Weber County" },
                        { "@type": "AdministrativeArea", "name": "Tooele County" }
                    ]
                },
                {
                    "@type": "Service",
                    "@id": "https://www.rhiveconstruction.com/commercial-roofing#service",
                    "name": "Commercial Roofing Contractor Utah",
                    "provider": {
                        "@id": "https://www.rhiveconstruction.com/commercial-roofing#organization"
                    },
                    "description": "Factory-certified commercial flat roofing contractors in Utah. Specializing in GAF EverGuard® TPO/PVC single-ply systems, 30-year NDL warranties, and transparent RPSP pricing.",
                    "serviceType": "Commercial Roofing, Flat Roofing, TPO Roofing, PVC Roofing, Industrial Roofing"
                },
                {
                    "@type": "FAQPage",
                    "@id": "https://www.rhiveconstruction.com/commercial-roofing#faq",
                    "mainEntity": COMMERCIAL_FAQS.map(faq => ({
                        "@type": "Question",
                        "name": faq.q,
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": faq.a
                        }
                    }))
                }
            ]
        };

        scriptTag.text = JSON.stringify(schemaData);

        return () => {
            const existing = document.getElementById(schemaId);
            if (existing) existing.remove();
        };
    }, []);

    const handleEstimateClick = () => {
        window.location.href = '/estimate-tool';
    };

    return (
        <div className="min-h-screen bg-black text-white relative overflow-hidden font-sans">
            {/* Ambient Background Glows */}
            <div className="absolute top-1/4 left-1/3 -translate-x-1/2 w-[650px] h-[650px] bg-rhive-blue/15 blur-[150px] rounded-full pointer-events-none" />
            <div className="absolute bottom-1/3 right-1/4 w-[550px] h-[550px] bg-rhive-pink/10 blur-[150px] rounded-full pointer-events-none" />

            {/* ── SECTION 1: HERO MODULE ──────────────────────────────────────── */}
            <section className="relative z-10 pt-24 pb-16 px-6 max-w-6xl mx-auto text-center">
                <div className="inline-flex items-center gap-2 border border-rhive-pink/30 px-4 py-1.5 rounded-full bg-rhive-pink/10 mb-6 shadow-[0_0_15px_rgba(236,2,139,0.2)]">
                    <Building2 size={14} className="text-rhive-pink" />
                    <span className="text-xs font-mono font-bold uppercase tracking-widest text-white">
                        GAF COMMERCIAL CERTIFIED CONTRACTOR | UTAH &amp; IDAHO
                    </span>
                </div>

                <h1 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight leading-[1.1] mb-6">
                    Utah’s Premier AI-Driven<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-rhive-pink">
                        Commercial &amp; Industrial Roofing Specialists
                    </span>
                </h1>

                <div className="text-lg sm:text-xl md:text-2xl font-serif italic text-rhive-gold mb-8 max-w-3xl mx-auto">
                    Engineering Superior Flat Roof Systems with Radical Cost Transparency, 30-Year NDL Warranties, and Zero Salesman Markup.
                </div>

                <p className="text-base sm:text-lg text-gray-300 max-w-[78ch] mx-auto mb-10 leading-relaxed font-serif">
                    RHIVE Construction redefines commercial contracting across the Wasatch Front and Western United States. By eliminating physical warehouse bloat and sales commissions, we keep administrative overhead under 10% and pass direct capital efficiency back to property managers and facility directors.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mb-8">
                    <button
                        onClick={handleEstimateClick}
                        className="bg-rhive-pink text-white font-black text-xs uppercase tracking-widest px-8 py-4 rounded shadow-[0_0_20px_rgba(236,2,139,0.4)] hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                        style={{ clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)' }}
                    >
                        Request Commercial CapEx Analysis
                    </button>
                    <a
                        href="/estimate-tool"
                        className="flex items-center gap-2 border border-white/20 hover:border-rhive-pink text-white font-black text-xs uppercase tracking-widest px-8 py-4 rounded bg-white/5 hover:bg-white/10 transition-all cursor-pointer"
                        style={{ clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)' }}
                    >
                        Launch Instant Aerial Estimator
                    </a>
                </div>

                {/* Trust Badges */}
                <div className="flex flex-wrap justify-center items-center gap-6 text-xs font-mono text-gray-300">
                    <span className="flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-rhive-pink" /> GAF Commercial Certified Contractor
                    </span>
                    <span className="flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-rhive-gold" /> 30-Year No Dollar Limit (NDL) Guarantees
                    </span>
                    <span className="flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-cyan-400" /> Female-Owned &amp; Operated
                    </span>
                </div>

                {/* Hero Showcase Image */}
                <div className="mt-12 rounded-xl overflow-hidden border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.8)] relative">
                    <img 
                        src="/images/commercial-tpo-membrane-re-roof-layover-salt-lake-city-utah.webp"
                        alt="Aerial drone view of a completed GAF certified TPO membrane commercial layover installation in Salt Lake City, Utah."
                        className="w-full h-[320px] sm:h-[420px] object-cover"
                        width={1200}
                        height={420}
                        decoding="async"
                        loading="lazy"
                    />
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/80 to-transparent p-4 sm:p-6 text-left flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <div>
                            <div className="text-xs font-mono font-bold text-rhive-pink uppercase tracking-widest">Active Commercial Portfolio</div>
                            <div className="text-sm sm:text-base font-bold text-white">45,000 Sq Ft GAF EverGuard® TPO Layover — Salt Lake County, UT</div>
                        </div>
                        <span className="text-xs font-mono text-gray-300 bg-white/10 px-3 py-1 rounded border border-white/20">
                            30-Yr NDL Certified
                        </span>
                    </div>
                </div>
            </section>

            {/* ── SECTION 2: THE RHIVE COMMERCIAL DIFFERENCE ──────────────────── */}
            <section className="relative z-10 py-16 px-6 max-w-6xl mx-auto border-t border-white/10">
                <div className="text-center mb-12">
                    <span className="text-xs font-mono text-rhive-pink uppercase tracking-[0.2em] block mb-2 font-bold">
                        Institutional Value Proposition
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
                        Why Utah Property Managers &amp; HOA Boards Partner with RHIVE
                    </h2>
                    <p className="text-gray-400 font-serif italic text-base max-w-3xl mx-auto mt-3">
                        Commercial roofing projects represent major capital expenditures (CapEx). Traditional contractors protect their margins with vague lump-sum bids, inflated sales commissions, and short-term workmanship warranties. RHIVE Construction flips that script through operational technology, engineering precision, and complete financial openness.
                    </p>
                    <div className="w-16 h-1 bg-rhive-pink mx-auto mt-4" />
                </div>

                {/* Radical Transparency Terminal Box */}
                <div className="max-w-3xl mx-auto bg-black/80 border border-rhive-pink/40 p-6 sm:p-8 rounded-xl font-mono text-xs sm:text-sm shadow-[0_0_25px_rgba(236,2,139,0.15)] mb-12">
                    <div className="border-b border-rhive-pink/30 pb-3 mb-4 text-center text-rhive-pink font-bold uppercase tracking-widest">
                        RHIVE RADICAL TRANSPARENCY MODEL
                    </div>
                    <ul className="space-y-3 text-gray-200">
                        <li className="flex items-start gap-3">
                            <span className="text-rhive-pink font-bold">✓</span>
                            <span><strong>Itemized Cost Breakdown:</strong> Materials, Labor, Overhead (&lt;10%), and Net Company Profit transparently exposed on every bid.</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-rhive-pink font-bold">✓</span>
                            <span><strong>Factory-Certified Single-Ply Membrane Installation:</strong> Adherence to GAF specifications with automated test-weld logging.</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-rhive-pink font-bold">✓</span>
                            <span><strong>Up to 30-Year GAF No Dollar Limit (NDL) Coverage:</strong> Non-prorated factory material and labor coverage with zero payout cap.</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-rhive-pink font-bold">✓</span>
                            <span><strong>Direct Founder Line &amp; Dedicated AI Systems Architect:</strong> Immediate communication without multiple corporate gatekeepers.</span>
                        </li>
                    </ul>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="p-6 bg-white/[0.02] border border-white/5 rounded-xl">
                        <div className="text-xs text-rhive-pink font-mono font-bold uppercase tracking-widest mb-2 flex items-center gap-1.5">
                            <DollarSign size={16} /> Cost Integrity
                        </div>
                        <h3 className="text-base font-bold text-white uppercase mb-2">Radical Cost Transparency</h3>
                        <p className="text-gray-400 text-xs font-serif leading-relaxed">
                            Every commercial proposal includes an itemized mathematical breakdown showing exact costs for Materials, Labor, Operating Overhead (&lt;10%), and Net Company Profit.
                        </p>
                    </div>

                    <div className="p-6 bg-white/[0.02] border border-white/5 rounded-xl">
                        <div className="text-xs text-rhive-gold font-mono font-bold uppercase tracking-widest mb-2 flex items-center gap-1.5">
                            <Award size={16} /> Master Standards
                        </div>
                        <h3 className="text-base font-bold text-white uppercase mb-2">Factory-Certified Precision</h3>
                        <p className="text-gray-400 text-xs font-serif leading-relaxed">
                            As a certified GAF commercial installer, our crews adhere strictly to manufacturer assembly drawings, technical submittals, and daily robotic seam test welds.
                        </p>
                    </div>

                    <div className="p-6 bg-white/[0.02] border border-white/5 rounded-xl">
                        <div className="text-xs text-cyan-400 font-mono font-bold uppercase tracking-widest mb-2 flex items-center gap-1.5">
                            <Shield size={16} /> Dual Warranties
                        </div>
                        <h3 className="text-base font-bold text-white uppercase mb-2">Double-Layer Protection</h3>
                        <p className="text-gray-400 text-xs font-serif leading-relaxed">
                            Receive non-prorated manufacturer system warranties alongside RHIVE's direct Lifetime Installer No-Leak Guarantee for absolute institutional security.
                        </p>
                    </div>

                    <div className="p-6 bg-white/[0.02] border border-white/5 rounded-xl">
                        <div className="text-xs text-white font-mono font-bold uppercase tracking-widest mb-2 flex items-center gap-1.5">
                            <Sparkles size={16} className="text-rhive-pink" /> Social Impact
                        </div>
                        <h3 className="text-base font-bold text-white uppercase mb-2">Community Reinvestment</h3>
                        <p className="text-gray-400 text-xs font-serif leading-relaxed">
                            Every commercial project helps fund complete roof replacements for local veterans, teachers, and first responders through "Our Hive" community reinvestment initiatives.
                        </p>
                    </div>
                </div>
            </section>

            {/* ── SECTION 3: COMMERCIAL SINGLE-PLY SYSTEMS & SPECIFICATIONS ───── */}
            <section className="relative z-10 py-16 px-6 max-w-6xl mx-auto border-t border-white/10">
                <div className="text-center mb-12">
                    <span className="text-xs font-mono text-rhive-pink uppercase tracking-[0.2em] block mb-2 font-bold">
                        Engineered Single-Ply Specifications
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
                        GAF EverGuard® Single-Ply Flat Membrane Assemblies
                    </h2>
                    <p className="text-gray-400 font-serif italic text-base max-w-2xl mx-auto mt-3">
                        We specialize in heat-welded thermoplastic membrane systems engineered to withstand Utah’s harsh climate dynamics—including 80°F+ single-day thermal swings, high UV radiation, and heavy snow loads.
                    </p>
                    <div className="w-16 h-1 bg-rhive-pink mx-auto mt-4" />
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-12">
                    {/* TPO Detailed Card */}
                    <div className="bg-white/[0.02] border border-white/10 p-8 rounded-2xl space-y-4">
                        <div className="flex justify-between items-center border-b border-white/10 pb-3">
                            <h3 className="text-xl sm:text-2xl font-bold text-white">1. GAF EverGuard® TPO Systems</h3>
                            <span className="text-xs font-mono text-rhive-pink bg-rhive-pink/10 px-2.5 py-1 rounded border border-rhive-pink/30">
                                60 mil &amp; Heavy-Duty 80 mil
                            </span>
                        </div>
                        <ul className="text-sm text-gray-300 space-y-3 font-serif">
                            <li>
                                <strong className="text-white font-sans">Primary Application:</strong> Retail plazas, office towers, warehouses, distribution centers, and educational facilities.
                            </li>
                            <li>
                                <strong className="text-white font-sans">Thermal Performance:</strong> Highly reflective white Energy Star-rated membrane reflects solar radiation, lowering building HVAC cooling loads during hot summer months.
                            </li>
                            <li>
                                <strong className="text-white font-sans">Mechanical Integrity:</strong> Secured using GAF Drill-Tec™ #15 XHD screws and barbed stress plates for maximum wind uplift resistance under high canyon winds.
                            </li>
                            <li>
                                <strong className="text-white font-sans">Fusion Heat-Welded Seams:</strong> All field seams, wall transitions, and pipe boots are fusion heat-welded using hot air to form a continuous, monolithic watertight bond stronger than the membrane itself.
                            </li>
                            <li>
                                <strong className="text-white font-sans">Warranty Options:</strong> 20-Year (60 mil) or 30-Year (80 mil) GAF System Limited &amp; NDL Warranties.
                            </li>
                        </ul>
                    </div>

                    {/* PVC Detailed Card */}
                    <div className="bg-white/[0.02] border border-white/10 p-8 rounded-2xl space-y-4">
                        <div className="flex justify-between items-center border-b border-white/10 pb-3">
                            <h3 className="text-xl sm:text-2xl font-bold text-white">2. GAF EverGuard® PVC Systems</h3>
                            <span className="text-xs font-mono text-rhive-gold bg-rhive-gold/10 px-2.5 py-1 rounded border border-rhive-gold/30">
                                60 mil &amp; Heavy-Duty 80 mil
                            </span>
                        </div>
                        <ul className="text-sm text-gray-300 space-y-3 font-serif">
                            <li>
                                <strong className="text-white font-sans">Primary Application:</strong> Commercial kitchens, restaurants, food processing plants, automotive centers, and facilities exposed to chemical exhaust.
                            </li>
                            <li>
                                <strong className="text-white font-sans">Chemical &amp; Grease Resistance:</strong> Formulated to resist animal fats, oils, greases, and industrial chemicals that rapidly dissolve standard asphalt or TPO membranes.
                            </li>
                            <li>
                                <strong className="text-white font-sans">Fire Safety &amp; Puncture Resistance:</strong> High fire resistance rating and superior puncture strength against roof foot traffic and service maintenance.
                            </li>
                            <li>
                                <strong className="text-white font-sans">Warranty Options:</strong> Up to 30-Year non-prorated material and labor coverage.
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Substrate & Drainage Engineering */}
                <div className="bg-white/[0.02] border border-white/10 p-8 rounded-2xl space-y-6">
                    <h3 className="text-2xl font-bold text-white border-b border-white/10 pb-3">
                        3. Substrate &amp; Drainage Engineering
                    </h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="space-y-2">
                            <div className="text-xs font-mono text-cyan-400 font-bold uppercase">Thermal Insulation</div>
                            <h4 className="text-base font-bold text-white">Mandatory Polyiso (R-30+)</h4>
                            <p className="text-xs text-gray-400 font-serif leading-relaxed">
                                Mechanically attached Polyisocyanurate (Polyiso) insulation boards installed to achieve required energy code R-values.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <div className="text-xs font-mono text-cyan-400 font-bold uppercase">Positive Drainage</div>
                            <h4 className="text-base font-bold text-white">Tapered Polyiso Crickets</h4>
                            <p className="text-xs text-gray-400 font-serif leading-relaxed">
                                Custom pre-fabricated tapered Polyiso installed around curbs, drains, and scuppers to eliminate standing ponding water.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <div className="text-xs font-mono text-cyan-400 font-bold uppercase">Abuse Resistance</div>
                            <h4 className="text-base font-bold text-white">DensDeck® Gypsum Boards</h4>
                            <p className="text-xs text-gray-400 font-serif leading-relaxed">
                                High-density fiberglass-mat gypsum cover boards installed over insulation to provide hail resistance and Class A fire ratings.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <div className="text-xs font-mono text-cyan-400 font-bold uppercase">Perimeter Integrity</div>
                            <h4 className="text-base font-bold text-white">Kynar-Coated Steel Coping</h4>
                            <p className="text-xs text-gray-400 font-serif leading-relaxed">
                                Custom-fabricated 24-gauge steel 2-piece coping cap systems with continuous anchor cleats for extreme canyon wind uplift protection.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── SECTION 4: CODE & COMMERCIAL LAYOVER ANALYSIS ───────────────── */}
            <section className="relative z-10 py-16 px-6 max-w-6xl mx-auto border-t border-white/10">
                <div className="text-center mb-12">
                    <span className="text-xs font-mono text-rhive-gold uppercase tracking-[0.2em] block mb-2 font-bold">
                        Utah Building Code Compliance
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
                        Full System Tear-Off vs. Certified Code Layover
                    </h2>
                    <p className="text-gray-400 font-serif italic text-base max-w-2xl mx-auto mt-3">
                        Navigating Utah building code compliance is essential when evaluating commercial roof asset management.
                    </p>
                    <div className="w-16 h-1 bg-rhive-gold mx-auto mt-4" />
                </div>

                {/* ASCII / Visual Matrix Block */}
                <div className="max-w-4xl mx-auto bg-black/80 border border-white/15 rounded-xl overflow-hidden mb-12">
                    <div className="bg-white/5 p-4 text-center font-mono text-xs font-bold uppercase text-white tracking-widest border-b border-white/10">
                        COMMERCIAL FLAT ROOF EVALUATION MATRIX
                    </div>
                    <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/10 p-6 sm:p-8 gap-6 sm:gap-8 font-serif">
                        <div className="space-y-3">
                            <div className="text-base font-bold text-white font-sans uppercase text-rhive-pink">Full Tear-Off Protocol</div>
                            <ul className="text-xs sm:text-sm text-gray-300 space-y-2">
                                <li className="flex items-center gap-2">• Complete removal down to the steel or wood deck</li>
                                <li className="flex items-center gap-2">• Complete structural deck replacement (up to 100 sq ft included)</li>
                                <li className="flex items-center gap-2">• Maximum R-value upgrade with custom multi-layer tapered ISO</li>
                                <li className="flex items-center gap-2">• Mandatory for multi-layered or saturated assemblies</li>
                            </ul>
                        </div>
                        <div className="space-y-3 pt-6 md:pt-0">
                            <div className="text-base font-bold text-white font-sans uppercase text-rhive-gold">Certified Layover Protocol</div>
                            <ul className="text-xs sm:text-sm text-gray-300 space-y-2">
                                <li className="flex items-center gap-2">• Single-layer dry membrane substrate required</li>
                                <li className="flex items-center gap-2">• Mechanically fastened or adhered over high-density cover board</li>
                                <li className="flex items-center gap-2">• Saves tens of thousands in landfill and disposal costs</li>
                                <li className="flex items-center gap-2">• 100% eligible for full GAF NDL warranties</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6 text-sm text-gray-300 font-serif leading-relaxed">
                    <div className="p-6 bg-white/[0.02] border border-white/5 rounded-xl">
                        <strong className="text-white font-sans block mb-2">Residential vs. Commercial Standard:</strong>
                        While RHIVE enforces a strict 100% full tear-off policy on all residential asphalt roofs, active Utah building codes permit single-layer commercial flat roof layovers if the underlying insulation and structural decking are verified dry and sound.
                    </div>
                    <div className="p-6 bg-white/[0.02] border border-white/5 rounded-xl">
                        <strong className="text-white font-sans block mb-2">The Layover Benefit:</strong>
                        A certified GAF TPO or PVC layover over new high-density cover boards saves property owners tens of thousands of dollars in tear-off and landfill disposal fees while maintaining 100% eligibility for GAF NDL warranties.
                    </div>
                    <div className="p-6 bg-white/[0.02] border border-white/5 rounded-xl">
                        <strong className="text-white font-sans block mb-2">Moisture Audits &amp; Thermal Scanning:</strong>
                        Prior to specifying any layover, RHIVE conducts core sampling and thermal diagnostics to ensure no trapped moisture exists.
                    </div>
                </div>
            </section>

            {/* ── SECTION 5: COMMERCIAL WARRANTY INFRASTRUCTURE ───────────────── */}
            <section className="relative z-10 py-16 px-6 max-w-6xl mx-auto border-t border-white/10">
                <div className="text-center mb-12">
                    <span className="text-xs font-mono text-cyan-400 uppercase tracking-[0.2em] block mb-2 font-bold">
                        Institutional Asset Protection
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
                        Unmatched Capital Protection &amp; Lifetime Performance
                    </h2>
                    <div className="w-16 h-1 bg-cyan-400 mx-auto mt-4" />
                </div>

                {/* Visual Warranty Hierarchy Box */}
                <div className="max-w-2xl mx-auto flex flex-col items-center mb-12">
                    <div className="w-full bg-rhive-pink/10 border-2 border-rhive-pink p-5 rounded-xl text-center shadow-[0_0_20px_rgba(236,2,139,0.3)]">
                        <div className="text-xs font-mono font-bold uppercase tracking-widest text-rhive-pink">30-YEAR GAF NDL GUARANTEE</div>
                        <div className="text-base sm:text-lg font-black text-white uppercase mt-1">100% Material &amp; Certified Labor Coverage (No Payout Cap)</div>
                    </div>
                    <div className="w-0.5 h-8 bg-gradient-to-b from-rhive-pink to-rhive-gold" />
                    <div className="w-full bg-rhive-gold/10 border-2 border-rhive-gold p-5 rounded-xl text-center shadow-[0_0_20px_rgba(226,171,73,0.3)]">
                        <div className="text-xs font-mono font-bold uppercase tracking-widest text-rhive-gold">RHIVE INSTALLER NO-LEAK GUARANTEE</div>
                        <div className="text-base sm:text-lg font-black text-white uppercase mt-1">Direct Lifetime Workmanship Protection (Zero-Cost Repairs)</div>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-8 bg-white/[0.02] border border-white/10 rounded-2xl space-y-4">
                        <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                            <Award size={22} className="text-rhive-pink" /> 1. GAF No Dollar Limit (NDL) Commercial Guarantees
                        </h3>
                        <ul className="text-sm text-gray-300 space-y-3 font-serif">
                            <li>
                                <strong className="text-white font-sans">No Payout Caps:</strong> Covers 100% of material and certified labor costs to repair manufacturing defects or installation failures without a dollar payout ceiling for up to 30 years.
                            </li>
                            <li>
                                <strong className="text-white font-sans">Factory Inspection Required:</strong> A GAF technical field engineer conducts a rigorous multi-point inspection of the completed roof before issuing the NDL certificate.
                            </li>
                            <li>
                                <strong className="text-white font-sans">Complete System Integrity:</strong> Covers all integrated components—membranes, Polyiso insulation, cover boards, Drill-Tec™ fasteners, and perimeter metal edge details.
                            </li>
                        </ul>
                    </div>

                    <div className="p-8 bg-white/[0.02] border border-white/10 rounded-2xl space-y-4">
                        <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                            <Shield size={22} className="text-rhive-gold" /> 2. RHIVE Lifetime Installer No-Leak Guarantee
                        </h3>
                        <p className="text-sm text-gray-300 font-serif leading-relaxed">
                            In addition to manufacturer warranties, RHIVE Construction guarantees our installation workmanship for the lifetime of the roof system.
                        </p>
                        <div className="p-4 bg-white/5 border border-white/10 rounded-xl text-sm font-serif italic text-gray-200">
                            "If our installation methods cause a leak, RHIVE repairs it 100% free of charge."
                        </div>
                        <ul className="text-xs text-gray-400 space-y-2 font-mono">
                            <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-rhive-gold" /> Lifetime Flashing &amp; Scupper Guarantee</li>
                            <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-rhive-gold" /> 24/7 Dispatch Hotline for Active Breaches</li>
                            <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-rhive-gold" /> Transferable Asset Documentation</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* ── SECTION 6: FINANCIAL STRUCTURE & CAPEX PRESERVATION ─────────── */}
            <section className="relative z-10 py-16 px-6 max-w-6xl mx-auto border-t border-white/10">
                <div className="text-center mb-12">
                    <span className="text-xs font-mono text-rhive-pink uppercase tracking-[0.2em] block mb-2 font-bold">
                        Capital Efficiency Engine
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
                        The Commercial RHIVE Project Savings Promotion (RPSP)
                    </h2>
                    <p className="text-gray-400 font-serif italic text-base max-w-3xl mx-auto mt-3">
                        Commercial procurement delays and extended bid management often inflate contracting budgets by 15–20% in "soft costs". The RHIVE Project Savings Promotion (RPSP) rewards decision-speed by stripping out administrative "chase costs" and crediting the savings directly back to your project ledger.
                    </p>
                    <div className="w-16 h-1 bg-rhive-pink mx-auto mt-4" />
                </div>

                {/* Efficiency Credit Matrix */}
                <div className="max-w-3xl mx-auto bg-black/80 border border-rhive-pink/40 rounded-xl overflow-hidden mb-10 shadow-[0_0_25px_rgba(236,2,139,0.15)]">
                    <div className="bg-rhive-pink/15 p-4 text-center font-mono text-xs font-bold uppercase text-white tracking-widest border-b border-rhive-pink/30">
                        COMMERCIAL RPSP EFFICIENCY MATRIX
                    </div>
                    <table className="w-full text-left text-xs sm:text-sm font-mono">
                        <thead className="bg-white/5 border-b border-white/10 text-gray-300">
                            <tr>
                                <th className="p-4">Project Value Tier</th>
                                <th className="p-4">Maximum Efficiency Credit</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-gray-200 font-serif">
                            <tr>
                                <td className="p-4 font-bold text-white font-mono">Tier 1: Under $50,000</td>
                                <td className="p-4 text-rhive-pink font-bold font-mono">Up to $1,000 Credit</td>
                            </tr>
                            <tr>
                                <td className="p-4 font-bold text-white font-mono">Tier 2: $50,000 - $100,000</td>
                                <td className="p-4 text-rhive-gold font-bold font-mono">Starts at $1,500 Credit</td>
                            </tr>
                            <tr>
                                <td className="p-4 font-bold text-white font-mono">Tier 3: Large Scale ($100k+)</td>
                                <td className="p-4 text-cyan-400 font-bold font-mono">+$500 per additional $50k (e.g. $150k = $2,500)</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="grid md:grid-cols-3 gap-6 text-sm text-gray-300 font-serif leading-relaxed mb-12">
                    <div className="p-6 bg-white/[0.02] border border-white/5 rounded-xl">
                        <strong className="text-white font-sans block mb-2">How It Works:</strong>
                        Execute your commercial agreement within 72 hours of presentation to unlock your Tiered Efficiency Credit directly onto your balance sheet.
                    </div>
                    <div className="p-6 bg-white/[0.02] border border-white/5 rounded-xl">
                        <strong className="text-white font-sans block mb-2">Portfolio Scaling:</strong>
                        Managing multiple properties or HOAs? RPSP efficiency credits stack across your entire portfolio, lowering capital expenditures across all assets.
                    </div>
                    <div className="p-6 bg-white/[0.02] border border-white/5 rounded-xl">
                        <strong className="text-white font-sans block mb-2">Protected by Utah’s 3-Day Rescission:</strong>
                        Lock in your efficiency pricing immediately while retaining a full 3-business-day statutory window for internal board review or stakeholder verification with zero risk.
                    </div>
                </div>

                {/* Investment Schedule Box */}
                <div className="bg-white/[0.02] border border-white/10 p-8 rounded-2xl">
                    <h3 className="text-xl font-bold text-white uppercase tracking-wider mb-4 border-b border-white/10 pb-2">
                        Commercial Investment Schedule &amp; Institutional Terms
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-300 font-serif leading-relaxed">
                        <div>
                            <h4 className="text-white font-bold mb-1 font-sans">Standard 50/40/10 Milestone Terms:</h4>
                            <p>50% initial investment at signing (secures permits and materials), 40% on final installation day (substantial completion), and 10% final settlement upon 100% project completion and punch list verification.</p>
                        </div>
                        <div>
                            <h4 className="text-white font-bold mb-1 font-sans">Master Service Agreements (MSAs):</h4>
                            <p>Customized progress billing, AIA G702/G703 formats, and Net-30 credit terms available for established commercial management accounts and REIT developers.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── SECTION 7: THE 10-STAGE "ZERO SURPRISES" COMMERCIAL WORKFLOW ─── */}
            <section className="relative z-10 py-16 px-6 max-w-6xl mx-auto border-t border-white/10">
                <div className="text-center mb-12">
                    <span className="text-xs font-mono text-cyan-400 uppercase tracking-[0.2em] block mb-2 font-bold">
                        Fulfillment Architecture
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
                        The 10-Stage "Zero Surprises" Commercial Workflow
                    </h2>
                    <p className="text-gray-400 font-serif italic text-base max-w-2xl mx-auto mt-2">
                        Automated Fulfillment Built for Property Managers and Facility Directors.
                    </p>
                    <div className="w-16 h-1 bg-cyan-400 mx-auto mt-4" />
                </div>

                {/* Interactive Workflow Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    {[
                        { num: "01", name: "LEAD INTAKE", desc: "High-definition aerial Roofr reports and Google Solar API rooftop mapping generate preliminary parameters." },
                        { num: "02", name: "ESTIMATE", desc: "Instant itemized data range generated without sales pressure or in-person disruption." },
                        { num: "03", name: "QUOTE", desc: "Multi-option proposal detailing GAF TPO/PVC packages, insulation R-values, and perimeter details." },
                        { num: "04", name: "SIGN & INVEST", desc: "Digital contract execution via secure portal with RPSP credit lock and deposit confirmation." },
                        { num: "05", name: "SCHEDULE", desc: "City permit acquisition, GAF submittal package filing, material delivery, and crew dispatch." },
                        { num: "06", name: "PRE-INSTALL", desc: "Automated weekly SMS/email status reports keep facility directors fully informed." },
                        { num: "07", name: "INSTALL", desc: "Mobile-first site logs capture real-time photos of tear-off, Polyiso layout, and heat-welded seams." },
                        { num: "08", name: "PUNCH LIST", desc: "Multi-point quality inspection ensuring 100% defect clearance before final billing." },
                        { num: "09", name: "INVOICING", desc: "Electronic billing with automated Lien Waiver generation and GAF engineering documentation." },
                        { num: "10", name: "TROPHY ROOM", desc: "Activation of 30-Year GAF NDL Warranty and RHIVE Lifetime Guarantee stored in your digital vault." }
                    ].map((step, idx) => (
                        <div key={idx} className="p-4 bg-white/[0.02] border border-white/5 rounded-xl hover:border-rhive-pink/40 transition-colors">
                            <div className="font-mono text-xs font-black text-rhive-pink mb-1">{step.num} // STAGE</div>
                            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-2">{step.name}</h3>
                            <p className="text-[11px] text-gray-400 font-serif leading-relaxed">{step.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── SECTION 8: COMMERCIAL ROOFING FAQ ───────────────────────────── */}
            <section className="relative z-10 py-16 px-6 max-w-5xl mx-auto border-t border-white/10">
                <div className="text-center mb-12">
                    <span className="text-xs font-mono text-rhive-pink uppercase tracking-[0.2em] block mb-2 font-bold">
                        Institutional Knowledge
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
                        Frequently Asked Questions: Utah Commercial Roofing
                    </h2>
                    <div className="w-16 h-1 bg-rhive-pink mx-auto mt-4" />
                </div>

                <div className="space-y-4">
                    {COMMERCIAL_FAQS.map((faq, idx) => {
                        const isOpen = openFaq === idx;
                        return (
                            <div 
                                key={idx} 
                                className="border border-white/10 bg-white/[0.02] hover:border-rhive-pink/40 transition-all rounded-xl overflow-hidden"
                            >
                                <button
                                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                                    className="w-full p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
                                >
                                    <span className="font-bold text-white text-base sm:text-lg leading-snug">
                                        {faq.q}
                                    </span>
                                    <div className={cn(
                                        "w-8 h-8 rounded-full border border-white/20 flex items-center justify-center shrink-0 transition-transform duration-300",
                                        isOpen ? "rotate-180 border-rhive-pink text-rhive-pink bg-rhive-pink/10" : "text-gray-400"
                                    )}>
                                        <ChevronDown size={18} />
                                    </div>
                                </button>
                                {isOpen && (
                                    <div className="px-6 pb-6 pt-1 text-gray-300 font-serif text-sm sm:text-base leading-relaxed border-t border-white/5">
                                        {faq.a}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* ── SECTION 9: REGIONAL SERVICE AREA & CALL TO ACTION ───────────── */}
            <section className="relative z-10 py-16 px-6 max-w-6xl mx-auto border-t border-white/10">
                <div className="text-center mb-12">
                    <span className="text-xs font-mono text-cyan-400 uppercase tracking-[0.2em] block mb-2 font-bold">
                        Regional Coverage
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
                        Serving Commercial Properties Across Utah &amp; Idaho
                    </h2>
                    <p className="text-gray-400 font-serif italic text-base max-w-3xl mx-auto mt-3">
                        RHIVE Construction delivers certified commercial roofing services across all primary Wasatch Front hubs and surrounding regions:
                    </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    <div className="p-6 bg-white/[0.02] border border-white/5 rounded-xl">
                        <MapPin size={18} className="text-rhive-pink mb-2" />
                        <h3 className="font-bold text-white text-sm uppercase mb-2">Salt Lake County</h3>
                        <p className="text-xs text-gray-400 font-serif leading-relaxed">
                            Salt Lake City, South Jordan (Corporate HQ), Sandy, Draper, West Jordan, West Valley City, Herriman, Taylorsville, Midvale, Millcreek, Holladay, Kearns, Magna, Sugar House.
                        </p>
                    </div>

                    <div className="p-6 bg-white/[0.02] border border-white/5 rounded-xl">
                        <MapPin size={18} className="text-rhive-gold mb-2" />
                        <h3 className="font-bold text-white text-sm uppercase mb-2">Utah County</h3>
                        <p className="text-xs text-gray-400 font-serif leading-relaxed">
                            Lehi Silicon Slopes, Provo, Orem, American Fork, Pleasant Grove, Springville, Spanish Fork.
                        </p>
                    </div>

                    <div className="p-6 bg-white/[0.02] border border-white/5 rounded-xl">
                        <MapPin size={18} className="text-cyan-400 mb-2" />
                        <h3 className="font-bold text-white text-sm uppercase mb-2">Davis &amp; Weber Counties</h3>
                        <p className="text-xs text-gray-400 font-serif leading-relaxed">
                            Bountiful, Layton, Clearfield, North Salt Lake, Ogden Commercial Hub, Business Depot Ogden (BDO).
                        </p>
                    </div>

                    <div className="p-6 bg-white/[0.02] border border-white/5 rounded-xl">
                        <MapPin size={18} className="text-white mb-2" />
                        <h3 className="font-bold text-white text-sm uppercase mb-2">Summit, Wasatch &amp; Beyond</h3>
                        <p className="text-xs text-gray-400 font-serif leading-relaxed">
                            Park City, Heber City, Tooele, with expanded commercial project coverage extending throughout Idaho.
                        </p>
                    </div>
                </div>

                {/* Contact Card & Final CTA */}
                <div className="bg-gradient-to-br from-black via-white/[0.02] to-black border-2 border-rhive-pink p-8 sm:p-12 rounded-2xl shadow-[0_0_40px_rgba(236,2,139,0.25)] text-center max-w-4xl mx-auto">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight text-white mb-4">
                        Ready to Elevate Your Commercial Property Asset?
                    </h2>
                    <p className="text-gray-300 font-serif text-base max-w-2xl mx-auto leading-relaxed mb-8">
                        Get a precise, itemized commercial quote backed by factory-certified GAF single-ply systems and radical pricing transparency.
                    </p>

                    <div className="inline-block bg-white/5 border border-white/10 p-6 rounded-xl text-xs font-mono text-gray-300 text-left mb-8 space-y-2">
                        <div className="text-rhive-pink font-bold uppercase tracking-wider mb-1">RHIVE Construction Corporate Headquarters</div>
                        <div>📍 10437 Shady Plum Way, South Jordan, UT 84009</div>
                        <div>📞 Phone: <a href="tel:4354176637" className="text-white hover:underline">435-41-ROOFS (435-417-6637)</a> / <a href="tel:8014491451" className="text-white hover:underline">(801) 449-1451</a></div>
                        <div>✉️ Email: <a href="mailto:office@rhiveconstruction.com" className="text-white hover:underline">office@rhiveconstruction.com</a></div>
                        <div>💻 Website: <a href="https://www.rhiveconstruction.com" className="text-white hover:underline">rhiveconstruction.com</a></div>
                    </div>

                    <div>
                        <button
                            onClick={handleEstimateClick}
                            className="bg-rhive-pink text-white font-black text-xs uppercase tracking-widest px-10 py-5 rounded shadow-[0_0_25px_rgba(236,2,139,0.5)] hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                            style={{ clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)' }}
                        >
                            Request Your Free Commercial Certified Quote Today
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}
