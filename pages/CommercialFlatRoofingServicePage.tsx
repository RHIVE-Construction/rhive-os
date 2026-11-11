import { navigateToIntake } from '../lib/intakeRouting';
import React, { useEffect, useState } from 'react';
import { 
    Phone, Shield, ArrowRight, CheckCircle2, Zap, 
    Building2, Clock, Layers, Award, MapPin, 
    ChevronDown, Wrench, AlertTriangle, FileText, 
    Check, Sparkles, Scale, DollarSign, Briefcase,
    Activity, CalendarCheck, BarChart3, HardHat
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
        a: "Under Utah commercial building codes (IBC Chapter 15), a single-layer flat roof in dry, sound structural condition can receive a certified layover. RHIVE conducts non-destructive core moisture testing and thermal infrared diagnostics to determine if your property qualifies, saving thousands in tear-off and disposal costs."
    },
    {
        q: "How does RHIVE eliminate salesman markups on commercial bids?",
        a: "We use AI automation and remote diagnostic tools to manage operations, eliminating the 10–15% commission typically paid to sales reps and passing those savings directly to you via itemized cost quotes detailing Materials, Labor, Overhead (<10%), and Net Profit."
    },
    {
        q: "What is the primary operational difference between TPO and PVC commercial membranes?",
        a: "TPO is an Energy Star-rated reflective thermoplastic polyolefin ideal for general commercial, retail, and office environments needing high solar reflectance and tensile strength. PVC incorporates plasticizers making it impervious to animal fats, cooking oils, restaurant grease exhaust, and industrial chemicals."
    },
    {
        q: "How does RHIVE handle tenant coordination and business disruption during installation?",
        a: "We deploy phased staging zones, safety barricades, and quiet-hour heat-welding protocols. All material hoisting happens before business hours, keeping customer parking, delivery docks, and retail entrances 100% operational throughout the project lifecycle."
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
        metaDesc.setAttribute('content', "Factory-certified commercial flat roofing contractors in Utah. Specializing in GAF EverGuard® TPO/PVC single-ply systems, 30-year NDL warranties, and transparent itemized pricing.");

        // Canonical Tag Enforcement — points strictly to this page's standardized canonical path
        let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
        if (!canonical) {
            canonical = document.createElement('link');
            canonical.setAttribute('rel', 'canonical');
            document.head.appendChild(canonical);
        }
        canonical.setAttribute('href', 'https://www.rhiveconstruction.com/services/commercial-flat-roofing');

        // OpenGraph URL Tag Enforcement
        let ogUrl = document.querySelector<HTMLMetaElement>('meta[property="og:url"]');
        if (!ogUrl) {
            ogUrl = document.createElement('meta');
            ogUrl.setAttribute('property', 'og:url');
            document.head.appendChild(ogUrl);
        }
        ogUrl.setAttribute('content', 'https://www.rhiveconstruction.com/services/commercial-flat-roofing');

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
                    "@id": "https://www.rhiveconstruction.com/services/commercial-flat-roofing#organization",
                    "name": "RHIVE Construction - Commercial Division",
                    "url": "https://www.rhiveconstruction.com/services/commercial-flat-roofing",
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
                        { "@type": "AdministrativeArea", "name": "Wasatch County" },
                        { "@type": "AdministrativeArea", "name": "Tooele County" }
                    ]
                },
                {
                    "@type": "Service",
                    "@id": "https://www.rhiveconstruction.com/services/commercial-flat-roofing#service",
                    "name": "Commercial Flat Roofing Contractors Utah",
                    "provider": {
                        "@id": "https://www.rhiveconstruction.com/services/commercial-flat-roofing#organization"
                    },
                    "description": "Factory-certified commercial flat roofing contractors in Utah. Specializing in GAF EverGuard® TPO/PVC single-ply systems, 30-year NDL warranties, modified bitumen, and transparent itemized pricing.",
                    "serviceType": "Commercial Roofing, Flat Roofing, TPO Roofing, PVC Roofing, Modified Bitumen, Industrial Roofing"
                },
                {
                    "@type": "FAQPage",
                    "@id": "https://www.rhiveconstruction.com/services/commercial-flat-roofing#faq",
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
                    Utah Commercial Flat Roofing Contractors<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-rhive-pink">
                        TPO &amp; PVC Systems
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
                        onClick={() => navigateToIntake({ category: 'Commercial', intent: 'Certified Quote' })} className="bg-rhive-pink text-white font-black text-xs uppercase tracking-widest px-8 py-4 rounded shadow-[0_0_20px_rgba(236,2,139,0.4)] hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                        style={{ clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)' }}
                    >
                        Request Commercial CapEx Analysis
                    </button>
                    <a
                        onClick={(e) => { e.preventDefault(); navigateToIntake({ category: 'Commercial', intent: 'Instant Estimate' }); }} href="/intake" className="flex items-center gap-2 border border-white/20 hover:border-rhive-pink text-white font-black text-xs uppercase tracking-widest px-8 py-4 rounded bg-white/5 hover:bg-white/10 transition-all cursor-pointer"
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

            {/* ── SECTION 3: COMMERCIAL SYSTEMS & TECHNICAL SPECIFICATIONS ─────── */}
            <section className="relative z-10 py-16 px-6 max-w-6xl mx-auto border-t border-white/10" id="specs">
                <div className="text-center mb-12">
                    <span className="text-xs font-mono text-rhive-pink uppercase tracking-[0.2em] block mb-2 font-bold">
                        Engineered Commercial Systems
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
                        Engineered Single-Ply &amp; Industrial Assemblies
                    </h2>
                    <p className="text-gray-400 font-serif italic text-base max-w-2xl mx-auto mt-3">
                        We specialize in heat-welded thermoplastic membrane assemblies and industrial waterproofing engineered to withstand Utah’s climate—including 80°F+ single-day thermal swings, high UV radiation, and severe snow loads.
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
                                <strong className="text-white font-sans">Primary Application:</strong> Retail lifestyle centers, office complexes, distribution warehouses, tech campuses, and medical facilities.
                            </li>
                            <li>
                                <strong className="text-white font-sans">Thermal Performance:</strong> Highly reflective white Energy Star-rated membrane reflects up to 86% of solar radiation, lowering building HVAC cooling loads during hot Utah summer months.
                            </li>
                            <li>
                                <strong className="text-white font-sans">Mechanical Integrity:</strong> Secured using GAF Drill-Tec™ #15 XHD fasteners and barbed stress plates for maximum wind uplift resistance under high canyon winds.
                            </li>
                            <li>
                                <strong className="text-white font-sans">Fusion Heat-Welded Seams:</strong> All field seams, parapet wall transitions, and pipe boots are fusion heat-welded using computer-monitored hot air to form a continuous, monolithic watertight bond stronger than the sheet itself.
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
                                <strong className="text-white font-sans">Primary Application:</strong> Commercial kitchens, restaurants, food processing plants, automotive facilities, and roofs with chemical or grease exhaust.
                            </li>
                            <li>
                                <strong className="text-white font-sans">Chemical &amp; Grease Resistance:</strong> Formulated with premium plasticizers to resist animal fats, oils, jet fuels, and industrial solvents that degrade standard membranes.
                            </li>
                            <li>
                                <strong className="text-white font-sans">Fire Safety &amp; Puncture Resistance:</strong> Superior fire resistance rating (UL Class A) and enhanced puncture resistance against regular rooftop maintenance foot traffic.
                            </li>
                            <li>
                                <strong className="text-white font-sans">Warranty Options:</strong> Up to 30-Year non-prorated material and labor NDL coverage.
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Additional Commercial Assemblies: Modified Bitumen & Standing Seam Metal */}
                <div className="grid md:grid-cols-2 gap-8 mb-12">
                    <div className="bg-white/[0.02] border border-white/10 p-8 rounded-2xl space-y-4">
                        <div className="flex justify-between items-center border-b border-white/10 pb-3">
                            <h3 className="text-xl sm:text-2xl font-bold text-white">3. SBS Modified Bitumen Multi-Ply</h3>
                            <span className="text-xs font-mono text-cyan-400 bg-cyan-400/10 px-2.5 py-1 rounded border border-cyan-400/30">
                                Multi-Ply Redundancy
                            </span>
                        </div>
                        <ul className="text-sm text-gray-300 space-y-3 font-serif">
                            <li>
                                <strong className="text-white font-sans">Primary Application:</strong> Heavy-traffic mechanical penthouses, elevator towers, chillers, and loading docks requiring high puncture tolerance.
                            </li>
                            <li>
                                <strong className="text-white font-sans">Dual-Layer Redundancy:</strong> Combines elastomeric SBS base plies with ceramic granule-surfaced cap sheets for thick, self-annealing multi-layer defense.
                            </li>
                            <li>
                                <strong className="text-white font-sans">Cold-Applied &amp; Torch Options:</strong> Low-VOC, zero-odor cold adhesive installation options engineered for occupied medical and educational facilities.
                            </li>
                        </ul>
                    </div>

                    <div className="bg-white/[0.02] border border-white/10 p-8 rounded-2xl space-y-4">
                        <div className="flex justify-between items-center border-b border-white/10 pb-3">
                            <h3 className="text-xl sm:text-2xl font-bold text-white">4. Commercial Structural Metal</h3>
                            <span className="text-xs font-mono text-white bg-white/10 px-2.5 py-1 rounded border border-white/20">
                                24-Ga Kynar 500®
                            </span>
                        </div>
                        <ul className="text-sm text-gray-300 space-y-3 font-serif">
                            <li>
                                <strong className="text-white font-sans">Primary Application:</strong> Corporate headquarters, steep-pitch commercial entryways, architectural canopies, and industrial pre-engineered buildings.
                            </li>
                            <li>
                                <strong className="text-white font-sans">Mechanical Standing Seam:</strong> Concealed clip fastening allows thermal expansion and contraction across severe Wasatch temperature swings without fastener fatigue.
                            </li>
                            <li>
                                <strong className="text-white font-sans">50-Year Longevity:</strong> Non-combustible, Class 4 impact resistance, zero degradation from alpine snow and ice dam accumulation.
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Substrate & Drainage Engineering */}
                <div className="bg-white/[0.02] border border-white/10 p-8 rounded-2xl space-y-6">
                    <h3 className="text-2xl font-bold text-white border-b border-white/10 pb-3">
                        5. Substrate &amp; Drainage Engineering
                    </h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="space-y-2">
                            <div className="text-xs font-mono text-cyan-400 font-bold uppercase">Thermal Insulation</div>
                            <h4 className="text-base font-bold text-white">Mandatory Polyiso (R-30+)</h4>
                            <p className="text-xs text-gray-400 font-serif leading-relaxed">
                                Staggered double-layer Polyisocyanurate (Polyiso) insulation boards mechanically fastened or adhered to eliminate thermal bridging.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <div className="text-xs font-mono text-cyan-400 font-bold uppercase">Positive Drainage</div>
                            <h4 className="text-base font-bold text-white">Tapered Polyiso Crickets</h4>
                            <p className="text-xs text-gray-400 font-serif leading-relaxed">
                                Custom factory-engineered tapered slopes (1/4" per foot) installed between scuppers, drains, and curbs to eliminate standing ponding water.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <div className="text-xs font-mono text-cyan-400 font-bold uppercase">Abuse Resistance</div>
                            <h4 className="text-base font-bold text-white">DensDeck® Gypsum Boards</h4>
                            <p className="text-xs text-gray-400 font-serif leading-relaxed">
                                High-density fiberglass-mat gypsum cover boards installed over insulation to provide hail resistance, high foot-traffic protection, and Class A fire ratings.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <div className="text-xs font-mono text-cyan-400 font-bold uppercase">Perimeter Integrity</div>
                            <h4 className="text-base font-bold text-white">Kynar-Coated Steel Coping</h4>
                            <p className="text-xs text-gray-400 font-serif leading-relaxed">
                                Custom-fabricated 24-gauge steel 2-piece coping cap systems with continuous 20-ga anchor cleats tested to ANSI/SPRI/FM 4435/ES-1 wind standards.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── SECTION 4: CODE & COMMERCIAL ENGINEERING STANDARD ───────────────── */}
            <section className="relative z-10 py-16 px-6 max-w-6xl mx-auto border-t border-white/10" id="engineering-standard">
                <div className="text-center mb-12">
                    <span className="text-xs font-mono text-rhive-gold uppercase tracking-[0.2em] block mb-2 font-bold">
                        Utah Building Code Compliance
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
                        Full Tear-Off to Decking vs. 1-Layer Re-Cover
                    </h2>
                    <p className="text-gray-400 font-serif italic text-base max-w-2xl mx-auto mt-3">
                        Navigating Utah commercial building code compliance (IBC Chapter 15) with rigorous engineering standards that preserve capital and guarantee long-term asset value.
                    </p>
                    <div className="w-16 h-1 bg-rhive-gold mx-auto mt-4" />
                </div>

                {/* Visual Matrix Block */}
                <div className="max-w-4xl mx-auto bg-black/80 border border-white/15 rounded-xl overflow-hidden mb-12">
                    <div className="bg-white/5 p-4 text-center font-mono text-xs font-bold uppercase text-white tracking-widest border-b border-white/10">
                        COMMERCIAL FLAT ROOF ENGINEERING MATRIX
                    </div>
                    <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/10 p-6 sm:p-8 gap-6 sm:gap-8 font-serif">
                        <div className="space-y-3">
                            <div className="text-base font-bold text-white font-sans uppercase text-rhive-pink">Best Practice: Full Tear-Off to Decking</div>
                            <ul className="text-xs sm:text-sm text-gray-300 space-y-2">
                                <li className="flex items-center gap-2">• Complete removal down to the steel, concrete, or wood structural deck</li>
                                <li className="flex items-center gap-2">• Full structural deck inspection and replacement where corroded or decayed</li>
                                <li className="flex items-center gap-2">• Maximum R-value upgrade with custom multi-layer tapered polyiso insulation</li>
                                <li className="flex items-center gap-2">• Mandatory under IBC Chapter 15 for multi-layered assemblies (2+ layers) or wet insulation</li>
                            </ul>
                        </div>
                        <div className="space-y-3 pt-6 md:pt-0">
                            <div className="text-base font-bold text-white font-sans uppercase text-rhive-gold">How RHIVE Executes a 1-Layer Re-Cover</div>
                            <ul className="text-xs sm:text-sm text-gray-300 space-y-2">
                                <li className="flex items-center gap-2">• Permitted under IBC Chapter 15 on verified single-layer dry commercial substrates</li>
                                <li className="flex items-center gap-2">• RHIVE tears off the existing top membrane down to the insulation (never roofs over old membrane)</li>
                                <li className="flex items-center gap-2">• 100% substrate inspection with immediate replacement of any soiled or damaged polyiso</li>
                                <li className="flex items-center gap-2">• Installation of new fanfold cover board and brand-new GAF TPO or PVC membrane</li>
                                <li className="flex items-center gap-2">• 100% manufacturer-warrantable system over verified substrate and structural decking</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6 text-sm text-gray-300 font-serif leading-relaxed">
                    <div className="p-6 bg-white/[0.02] border border-white/5 rounded-xl">
                        <strong className="text-white font-sans block mb-2">Best Practice (Full Tear-Off):</strong>
                        Tearing all the way down to the structural decking (steel, concrete, or wood) is always best practice and is mandatory when there are 2+ roof layers or wet/damaged insulation. It guarantees 100% visibility into structural deck integrity.
                    </div>
                    <div className="p-6 bg-white/[0.02] border border-white/5 rounded-xl">
                        <strong className="text-white font-sans block mb-2">How RHIVE Executes a 1-Layer Re-Cover:</strong>
                        When there has only been 1 layer of roofing and we perform a Re-Cover, unlike standard industry practices that simply slit or leave the old membrane in place (which can trap moisture and hide bad substrate), RHIVE tears off the existing top membrane down to the insulation/substrate. We thoroughly inspect the substrate (replacing any soiled or damaged insulation) and install new fanfold cover board and a brand-new membrane—so it is a completely new, 100% manufacturer-warrantable system over verified substrate and decking.
                    </div>
                    <div className="p-6 bg-white/[0.02] border border-white/5 rounded-xl">
                        <strong className="text-white font-sans block mb-2">Moisture Audits &amp; Thermal Scanning:</strong>
                        Prior to specifying any commercial re-cover, RHIVE conducts core sampling and thermal infrared diagnostics across the entire field to verify zero moisture entrapment.
                    </div>
                </div>
            </section>

            {/* ── SECTION 5: COMMERCIAL CASE STUDIES ACROSS UTAH ──────────────── */}
            <section className="relative z-10 py-16 px-6 max-w-6xl mx-auto border-t border-white/10">
                <div className="text-center mb-12">
                    <span className="text-xs font-mono text-cyan-400 uppercase tracking-[0.2em] block mb-2 font-bold">
                        Proven Track Record
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
                        Utah Commercial Project Case Studies
                    </h2>
                    <p className="text-gray-400 font-serif italic text-base max-w-2xl mx-auto mt-3">
                        Real-world execution delivering zero tenant disruption, code-compliant engineering, and institutional warranty protection.
                    </p>
                    <div className="w-16 h-1 bg-cyan-400 mx-auto mt-4" />
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    <div className="p-6 bg-white/[0.02] border border-white/10 rounded-2xl flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-xs font-mono font-bold text-rhive-pink uppercase tracking-wider">Silicon Slopes Campus</span>
                                <span className="text-xs font-mono text-gray-400 bg-white/5 px-2 py-0.5 rounded">Lehi, UT</span>
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">52,000 Sq Ft Tech Center TPO Re-Cover</h3>
                            <p className="text-xs text-gray-300 font-serif leading-relaxed mb-4">
                                Installed 80-mil GAF EverGuard® TPO with R-30+ Polyiso upgrade over existing dry substrate. Nighttime heat-welding eliminated noise disruption for 600+ on-site software engineers.
                            </p>
                        </div>
                        <div className="border-t border-white/10 pt-4 text-xs font-mono text-rhive-pink font-bold">
                            ✓ 30-Year GAF NDL Guarantee Issued
                        </div>
                    </div>

                    <div className="p-6 bg-white/[0.02] border border-white/10 rounded-2xl flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-xs font-mono font-bold text-rhive-gold uppercase tracking-wider">Industrial Logistics Park</span>
                                <span className="text-xs font-mono text-gray-400 bg-white/5 px-2 py-0.5 rounded">West Valley City, UT</span>
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">110,000 Sq Ft Distribution Center</h3>
                            <p className="text-xs text-gray-300 font-serif leading-relaxed mb-4">
                                Full tear-off down to 22-ga metal deck, installation of DensDeck® Prime cover board and induction-welded TPO system engineered for 120 MPH canyon wind uplift along the I-215 corridor.
                            </p>
                        </div>
                        <div className="border-t border-white/10 pt-4 text-xs font-mono text-rhive-gold font-bold">
                            ✓ 100% On-Schedule Milestone Completion
                        </div>
                    </div>

                    <div className="p-6 bg-white/[0.02] border border-white/10 rounded-2xl flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">Culinary &amp; Retail Center</span>
                                <span className="text-xs font-mono text-gray-400 bg-white/5 px-2 py-0.5 rounded">Salt Lake City, UT</span>
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">18,500 Sq Ft Grease-Resistant PVC</h3>
                            <p className="text-xs text-gray-300 font-serif leading-relaxed mb-4">
                                Replaced leaking multi-tenant roof with 60-mil GAF EverGuard® PVC membrane. Encapsulated 14 restaurant kitchen hood exhausts without grease degradation or voided manufacturer warranties.
                            </p>
                        </div>
                        <div className="border-t border-white/10 pt-4 text-xs font-mono text-cyan-400 font-bold">
                            ✓ Zero Grease Breakdown &amp; UL Class A Fire
                        </div>
                    </div>
                </div>
            </section>

            {/* ── SECTION 6: PROPERTY MANAGER & PREVENTIVE MAINTENANCE SOPS ───── */}
            <section className="relative z-10 py-16 px-6 max-w-6xl mx-auto border-t border-white/10">
                <div className="text-center mb-12">
                    <span className="text-xs font-mono text-rhive-pink uppercase tracking-[0.2em] block mb-2 font-bold">
                        Facility Operations
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
                        Property Manager Workflows &amp; Preventive Maintenance
                    </h2>
                    <p className="text-gray-400 font-serif italic text-base max-w-2xl mx-auto mt-3">
                        Commercial roofs are dynamic building assets. RHIVE provides structured operating protocols to safeguard investments, preserve warranties, and prevent catastrophic interior losses.
                    </p>
                    <div className="w-16 h-1 bg-rhive-pink mx-auto mt-4" />
                </div>

                <div className="grid md:grid-cols-3 gap-6 mb-12">
                    <div className="p-6 bg-white/[0.02] border border-white/10 rounded-xl space-y-3">
                        <CalendarCheck size={20} className="text-rhive-pink" />
                        <h3 className="text-base font-bold text-white uppercase">Bi-Annual Preventative Audits</h3>
                        <p className="text-xs text-gray-300 font-serif leading-relaxed">
                            Scheduled spring thaw and autumn freeze inspections to clear primary and secondary roof drains, inspect heat-welded seams, check RTU curb flashings, and maintain manufacturer warranty validity.
                        </p>
                    </div>

                    <div className="p-6 bg-white/[0.02] border border-white/10 rounded-xl space-y-3">
                        <Activity size={20} className="text-rhive-gold" />
                        <h3 className="text-base font-bold text-white uppercase">2-Hour Rapid Response Containment</h3>
                        <p className="text-xs text-gray-300 font-serif leading-relaxed">
                            Guaranteed priority dispatch for active storm breaches across the Wasatch Front. Our emergency crew deploys hot-air weld patching or synthetic containment with fees 100% credited to permanent repairs.
                        </p>
                    </div>

                    <div className="p-6 bg-white/[0.02] border border-white/10 rounded-xl space-y-3">
                        <BarChart3 size={20} className="text-cyan-400" />
                        <h3 className="text-base font-bold text-white uppercase">Digital Vault &amp; CapEx Forecasting</h3>
                        <p className="text-xs text-gray-300 font-serif leading-relaxed">
                            Property directors receive full cloud portal access containing high-res aerial drone maps, GAF inspection certificates, annual maintenance logs, and multi-year reserve study replacement schedules.
                        </p>
                    </div>
                </div>
            </section>

            {/* ── SECTION 7: COMMERCIAL WARRANTY INFRASTRUCTURE ───────────────── */}
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

            {/* ── SECTION 8: COMMERCIAL FINANCIAL STRUCTURE & INSTITUTIONAL TERMS ─────────── */}
            <section className="relative z-10 py-16 px-6 max-w-6xl mx-auto border-t border-white/10" id="financials">
                <div className="text-center mb-12">
                    <span className="text-xs font-mono text-rhive-pink uppercase tracking-[0.2em] block mb-2 font-bold">
                        Capital Preservation
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
                        Commercial Financial Structure &amp; Institutional Terms
                    </h2>
                    <p className="text-gray-400 font-serif italic text-base max-w-3xl mx-auto mt-3">
                        Commercial procurement demands capital predictability. RHIVE provides transparent milestone funding schedules and master service agreements engineered for property managers, REITs, and corporate asset directors.
                    </p>
                    <div className="w-16 h-1 bg-rhive-pink mx-auto mt-4" />
                </div>

                {/* Investment Schedule Box */}
                <div className="bg-white/[0.02] border border-white/10 p-8 rounded-2xl max-w-4xl mx-auto">
                    <h3 className="text-xl font-bold text-white uppercase tracking-wider mb-4 border-b border-white/10 pb-2">
                        Commercial Investment Schedule &amp; Institutional Terms
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-300 font-serif leading-relaxed">
                        <div>
                            <h4 className="text-white font-bold mb-1 font-sans">Standard 50/40/10 Milestone Terms:</h4>
                            <p>50% initial investment at signing (secures permits and materials), 40% on substantial completion, and 10% final settlement upon 100% project completion and punch list sign-off.</p>
                        </div>
                        <div>
                            <h4 className="text-white font-bold mb-1 font-sans">Master Service Agreements (MSAs):</h4>
                            <p>Customized progress billing, AIA G702/G703 formats, and Net-30 credit terms available for established commercial management accounts and REIT developers.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── SECTION 9: THE 10-STAGE "ZERO SURPRISES" COMMERCIAL WORKFLOW ─── */}
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

                <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    {[
                        { num: "01", name: "LEAD INTAKE", desc: "High-definition aerial Roofr reports and Google Solar API rooftop mapping generate preliminary parameters." },
                        { num: "02", name: "ESTIMATE", desc: "Instant itemized data range generated without sales pressure or in-person disruption." },
                        { num: "03", name: "QUOTE", desc: "Multi-option proposal detailing GAF TPO/PVC packages, insulation R-values, and perimeter details." },
                        { num: "04", name: "SIGN & INVEST", desc: "Digital contract execution via secure portal with transparent milestone terms and deposit confirmation." },
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

            {/* ── SECTION 10: COMMERCIAL ROOFING FAQ ──────────────────────────── */}
            <section className="relative z-10 py-16 px-6 max-w-5xl mx-auto border-t border-white/10">
                <div className="text-center mb-12">
                    <span className="text-xs font-mono text-rhive-pink uppercase tracking-[0.2em] block mb-2 font-bold">
                        Institutional Knowledge
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
                        Frequently Asked Questions: Utah Commercial Roofing
                    </h2>
                    <p className="text-gray-400 font-serif italic text-base max-w-2xl mx-auto mt-2">
                        Direct answers to pricing, building code layover regulations, NDL warranties, tenant coordination, and maintenance.
                    </p>
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

            {/* ── SECTION 11: GEOTARGETING & COMMERCIAL CORRIDORS ─────────────── */}
            <section className="relative z-10 py-16 px-6 max-w-6xl mx-auto border-t border-white/10">
                <div className="text-center mb-12">
                    <span className="text-xs font-mono text-cyan-400 uppercase tracking-[0.2em] block mb-2 font-bold">
                        Regional Geotargeting
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
                        Utah Commercial Corridors &amp; Service Hubs
                    </h2>
                    <p className="text-gray-400 font-serif italic text-base max-w-3xl mx-auto mt-3">
                        RHIVE Construction delivers factory-certified commercial flat roofing services across all primary Utah business districts, tech centers, and industrial transportation arteries:
                    </p>
                </div>

                {/* Major Corridors */}
                <div className="grid md:grid-cols-3 gap-6 mb-12">
                    <div className="p-6 bg-gradient-to-br from-white/[0.04] to-black border border-rhive-pink/40 rounded-2xl">
                        <div className="text-xs font-mono font-bold text-rhive-pink uppercase tracking-widest mb-1 flex items-center gap-1.5">
                            <Zap size={14} /> Tech &amp; Corporate
                        </div>
                        <h3 className="text-lg font-bold text-white uppercase mb-2">Silicon Slopes Corridor</h3>
                        <p className="text-xs text-gray-300 font-serif leading-relaxed mb-3">
                            Direct service for enterprise tech headquarters, data centers, and multi-story office parks stretching across Lehi, Draper, Alpine, American Fork, and Traverse Mountain.
                        </p>
                        <div className="text-[11px] font-mono text-gray-400">
                            Key Corridors: Thanksgiving Point • Traverse Ridge • Lone Peak Tech Center
                        </div>
                    </div>

                    <div className="p-6 bg-gradient-to-br from-white/[0.04] to-black border border-rhive-gold/40 rounded-2xl">
                        <div className="text-xs font-mono font-bold text-rhive-gold uppercase tracking-widest mb-1 flex items-center gap-1.5">
                            <Building2 size={14} /> Downtown &amp; Retail
                        </div>
                        <h3 className="text-lg font-bold text-white uppercase mb-2">Salt Lake Metro Core</h3>
                        <p className="text-xs text-gray-300 font-serif leading-relaxed mb-3">
                            Commercial flat roof replacements and PVC grease-resistant retrofits for Downtown Salt Lake City high-rises, South Jordan Daybreak commercial centers, Sandy Cairns District, and Sugar House retail.
                        </p>
                        <div className="text-[11px] font-mono text-gray-400">
                            Key Corridors: State Street • 400 South • South Jordan Parkway • 10600 South
                        </div>
                    </div>

                    <div className="p-6 bg-gradient-to-br from-white/[0.04] to-black border border-cyan-400/40 rounded-2xl">
                        <div className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                            <Layers size={14} /> Industrial &amp; Freight
                        </div>
                        <h3 className="text-lg font-bold text-white uppercase mb-2">I-15 / I-80 Freight Spine</h3>
                        <p className="text-xs text-gray-300 font-serif leading-relaxed mb-3">
                            Engineered 80-mil TPO and modified bitumen roofing for large-scale distribution centers, cold storage warehouses, and manufacturing complexes across West Valley, West Jordan, and Ogden.
                        </p>
                        <div className="text-[11px] font-mono text-gray-400">
                            Key Corridors: Business Depot Ogden (BDO) • California Ave Logistics • Freeport Center
                        </div>
                    </div>
                </div>

                {/* Counties Grid */}
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
                            Lehi Silicon Slopes, Provo, Orem, American Fork, Pleasant Grove, Springville, Spanish Fork, Lindon commercial business parks.
                        </p>
                    </div>

                    <div className="p-6 bg-white/[0.02] border border-white/5 rounded-xl">
                        <MapPin size={18} className="text-cyan-400 mb-2" />
                        <h3 className="font-bold text-white text-sm uppercase mb-2">Davis &amp; Weber Counties</h3>
                        <p className="text-xs text-gray-400 font-serif leading-relaxed">
                            Bountiful, Layton, Clearfield, North Salt Lake, Ogden Commercial Hub, Business Depot Ogden (BDO), Falcon Hill Aerospace Park.
                        </p>
                    </div>

                    <div className="p-6 bg-white/[0.02] border border-white/5 rounded-xl">
                        <MapPin size={18} className="text-white mb-2" />
                        <h3 className="font-bold text-white text-sm uppercase mb-2">Summit, Wasatch &amp; Tooele</h3>
                        <p className="text-xs text-gray-400 font-serif leading-relaxed">
                            Park City Kimball Junction, Heber City, Tooele Industrial Depot, with commercial project coverage extending across Southern Idaho.
                        </p>
                    </div>
                </div>

                {/* Contact Card & Final CTA */}
                <div className="bg-gradient-to-br from-black via-white/[0.02] to-black border-2 border-rhive-pink p-8 sm:p-12 rounded-2xl shadow-[0_0_40px_rgba(236,2,139,0.25)] text-center max-w-4xl mx-auto">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight text-white mb-4">
                        Ready to Elevate Your Commercial Property Asset?
                    </h2>
                    <p className="text-gray-300 font-serif text-base max-w-2xl mx-auto leading-relaxed mb-8">
                        Get a precise, itemized commercial quote backed by factory-certified GAF single-ply systems, 30-year NDL warranties, and radical pricing transparency.
                    </p>

                    <div className="inline-block bg-white/5 border border-white/10 p-6 rounded-xl text-xs font-mono text-gray-300 text-left mb-8 space-y-2">
                        <div className="text-rhive-pink font-bold uppercase tracking-wider mb-1">RHIVE Construction Corporate Headquarters</div>
                        <div>📍 10437 Shady Plum Way, South Jordan, UT 84009</div>
                        <div>📞 Phone: <a href="tel:4354176637" className="text-white hover:underline">435-41-ROOFS (435-417-6637)</a> / <a href="tel:8014491451" className="text-white hover:underline">(801) 449-1451</a></div>
                        <div>✉️ Email: <a href="mailto:office@rhiveconstruction.com" className="text-white hover:underline">office@rhiveconstruction.com</a></div>
                        <div>💻 Website: <a href="https://www.rhiveconstruction.com/services/commercial-flat-roofing" className="text-white hover:underline">rhiveconstruction.com/services/commercial-flat-roofing</a></div>
                    </div>

                    <div>
                        <button
                            onClick={() => navigateToIntake({ category: 'Commercial', intent: 'Certified Quote' })} className="bg-rhive-pink text-white font-black text-xs uppercase tracking-widest px-10 py-5 rounded shadow-[0_0_25px_rgba(236,2,139,0.5)] hover:brightness-110 active:scale-95 transition-all cursor-pointer"
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
