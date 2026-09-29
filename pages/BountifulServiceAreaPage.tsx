import React, { useEffect, useMemo, useState } from 'react';
import { Phone, Shield, ArrowRight, CheckCircle2, Zap, MapPin, Snowflake, Building2, ChevronDown, Wind, Umbrella, Sparkles, Wrench, Layers } from 'lucide-react';
import { cn } from '../lib/utils';

export default function BountifulServiceAreaPage() {
    useEffect(() => {
        document.title = "Top-Rated Roofing Contractor Bountiful UT | RHIVE Construction";
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
            metaDesc = document.createElement('meta');
            metaDesc.setAttribute('name', 'description');
            document.head.appendChild(metaDesc);
        }
        metaDesc.setAttribute('content', "Certified residential & commercial roofing in Bountiful, UT. Owens Corning Duration 130 MPH wind-resistant shingles, GAF TPO/PVC flat roofing, 100% full tear-off, and lifetime no-leak guarantee.");
    }, []);

    const [openFaq, setOpenFaq] = useState<string | null>('faq-bountiful-residential');

    const handleEstimateClick = () => {
        window.location.href = '/estimate-tool';
    };

    const toggleFaq = (id: string) => {
        setOpenFaq(prev => prev === id ? null : id);
    };

    // Granular JSON-LD Schema for Bountiful, UT local SEO & AEO
    const jsonLdSchema = useMemo(() => {
        return {
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "RoofingContractor",
                    "@id": "https://www.rhiveconstruction.com/service-areas/bountiful-ut/#localbusiness",
                    "name": "RHIVE Construction - Bountiful Service Area",
                    "url": "https://www.rhiveconstruction.com/service-areas/bountiful-ut",
                    "logo": "https://i.imgur.com/t0VcSgJ.png",
                    "image": "https://i.imgur.com/t0VcSgJ.png",
                    "telephone": "+1-435-417-6637",
                    "email": "office@rhiveconstruction.com",
                    "priceRange": "$$$",
                    "description": "RHIVE Construction delivers precision-engineered residential roofing, commercial facility systems, high-performance asphalt shingles, and certified flat membrane installations across Bountiful, UT and Davis County.",
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
                        "latitude": 40.8894,
                        "longitude": -111.8808
                    },
                    "areaServed": [
                        {"@type": "City", "name": "Bountiful"},
                        {"@type": "PostalCode", "postalCode": "84010"},
                        {"@type": "PostalCode", "postalCode": "84011"},
                        {"@type": "AdministrativeArea", "name": "Bountiful East Bench"},
                        {"@type": "AdministrativeArea", "name": "Mueller Park"}
                    ]
                },
                {
                    "@type": "FAQPage",
                    "@id": "https://www.rhiveconstruction.com/service-areas/bountiful-ut/#faqpage",
                    "mainEntity": [
                        {
                            "@type": "Question",
                            "name": "What is RHIVE’s residential reroofing standard for Bountiful single-family homes?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "RHIVE enforces a strict 100% full tear-off policy down to the bare wood deck on all residential reroofs in Bountiful. Every replacement includes 100% Owens Corning ProArmor® synthetic underlayment, a minimum of 6 feet of WeatherLock® Ice & Water Shield, a 6-nail fastening pattern, and up to 100 sq ft of free 7/16 OSB decking replacement backed by a Lifetime No-Leak Guarantee."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "What commercial roofing systems and warranties does RHIVE offer in Bountiful?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "As a certified GAF commercial installer, RHIVE installs GAF EverGuard® TPO and PVC single-ply membranes in 60 and 80 mil thicknesses, executes code-compliant commercial layovers, and provides GAF No Dollar Limit (NDL) Commercial Warranties for up to 30 years covering 100% of material and labor defects."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "What asphalt shingle products does RHIVE install for Bountiful properties?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "We install the Owens Corning Duration® Series (130 MPH SureNail® wind warranty), Duration FLEX® Class 4 Impact Rated shingles for hail and thermal defense, and luxury GAF Woodland® and Grand Sequoia® Designer Shingles backed by 50-year non-prorated warranties."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "What are the technical specifications of RHIVE’s flat roof membrane installations in Bountiful?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "Our flat roofing assemblies feature GAF EverGuard® TPO and PVC membranes, mechanically attached Polyiso thermal insulation, custom-tapered boards around drains and scuppers to eliminate standing water, high-density DensDeck® gypsum cover boards, and fusion hot-air welded seams."
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

            {/* Ambient Lighting */}
            <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-rhive-pink/10 blur-[150px] rounded-full pointer-events-none" />

            {/* Hero Section */}
            <section className="relative z-10 pt-28 md:pt-36 pb-16 px-6 max-w-5xl mx-auto text-center">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/10 mb-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-rhive-pink animate-pulse" />
                    <span className="text-xs font-mono uppercase tracking-widest text-gray-300">
                        Bountiful, UT • Davis County Roofing Authority
                    </span>
                </div>

                <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold uppercase tracking-tight text-white mb-4 leading-tight">
                    Engineered Roofing Systems for<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-rhive-pink">
                        Bountiful, Utah &amp; East Bench
                    </span>
                </h1>

                <div className="text-base sm:text-xl font-serif italic text-rhive-pink mb-6">
                    130 MPH Canyon Wind Resistance. 100% Tear-Off Guarantee. Lifetime No-Leak Protection.
                </div>

                <p className="text-base sm:text-lg text-gray-200 max-w-[70ch] mx-auto mb-8 leading-relaxed font-serif">
                    From downslope East Bench canyon wind shears exceeding 70 MPH to heavy mountain snowpack, Bountiful properties require precision-engineered roofing. RHIVE Construction delivers Owens Corning Duration® shingles, luxury GAF designer profiles, certified commercial flat membranes, and mathematical price transparency.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-4">
                    <button
                        onClick={handleEstimateClick}
                        className="bg-rhive-pink hover:bg-[#d4007b] text-white font-bold text-xs sm:text-sm uppercase tracking-widest px-8 py-3.5 rounded-full shadow-[0_0_15px_rgba(236,2,139,0.4)] transition-all hover:scale-105 cursor-pointer"
                    >
                        Configure Bountiful Estimate
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

            {/* 5-Section Architecture */}

            {/* PART 1: Location-Specific Content */}
            <section className="relative z-10 py-14 px-6 max-w-5xl mx-auto border-t border-white/10">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-rhive-pink/10 border border-rhive-pink/20 flex items-center justify-center text-rhive-pink font-mono font-bold text-sm">
                        01
                    </div>
                    <span className="text-xs font-mono uppercase tracking-widest text-rhive-pink font-bold">
                        Part 1 • Location-Specific Content
                    </span>
                </div>

                <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold uppercase tracking-tight text-white mb-6">
                    Bountiful Regional Factors, Permitting &amp; Brand Values
                </h2>

                <div className="p-6 bg-white/[0.02] border border-white/10 rounded-2xl space-y-4 mb-6">
                    <h3 className="text-lg font-bold text-white">East Bench Canyon Wind Dynamics &amp; Local Footprint</h3>
                    <p className="text-sm sm:text-base text-gray-300 font-serif leading-relaxed">
                        Situated along the steep base of the Wasatch Range in Davis County, <strong>Bountiful, Utah</strong> experiences severe downslope East Bench canyon wind shears that frequently gust over 70 MPH. These high-velocity wind events are accompanied by heavy winter snow accumulation that creates severe freeze-thaw cycles and eave ice damming.
                    </p>
                    <div className="grid sm:grid-cols-2 gap-4 pt-2">
                        <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                            <div className="text-xs font-mono text-rhive-pink font-bold uppercase mb-1">Davis County &amp; Municipal Permitting</div>
                            <p className="text-xs sm:text-sm text-gray-300 font-serif">
                                Full roof replacements require strict municipal permits through Davis County and local city building departments. RHIVE manages 100% of the permitting process, ensuring code compliance with drip metal and ice barrier extensions.
                            </p>
                        </div>
                        <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                            <div className="text-xs font-mono text-emerald-400 font-bold uppercase mb-1">Service Coverage</div>
                            <p className="text-xs sm:text-sm text-gray-300 font-serif">
                                Comprehensive coverage across Bountiful Main Street, Bountiful Boulevard, Mueller Park Canyon, and the bench areas surrounding Val Verda and Woods Cross boundaries.
                            </p>
                        </div>
                    </div>
                    <div className="pt-2 border-t border-white/10 text-xs sm:text-sm text-gray-300 font-serif leading-relaxed">
                        Co-founded by <strong>Kara Robinson (President)</strong> and <strong>Michael Robinson (CEO)</strong>, RHIVE Construction is a proudly female-owned and operated contractor bringing complete cost transparency to Bountiful. We eliminate middleman sales commissions and physical warehouse overhead to keep administrative expenses <strong>under 10%</strong>. Every quote includes an itemized breakdown of **Materials, Labor, Operating Overhead, and Net Profit**. Guided by our slogan <strong>"Finish On Top"</strong>, we donate complete roofs to local veterans, teachers, and first responders.
                    </div>
                </div>
            </section>

            {/* PART 2: Residential Roofing */}
            <section className="relative z-10 py-14 px-6 max-w-5xl mx-auto border-t border-white/10">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-rhive-pink/10 border border-rhive-pink/20 flex items-center justify-center text-rhive-pink font-mono font-bold text-sm">
                        02
                    </div>
                    <span className="text-xs font-mono uppercase tracking-widest text-rhive-pink font-bold">
                        Part 2 • Residential Roofing Standards
                    </span>
                </div>

                <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold uppercase tracking-tight text-white mb-6">
                    Residential Roofing in Bountiful, UT
                </h2>

                <div className="p-6 bg-white/[0.02] border border-white/10 rounded-2xl space-y-4">
                    <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs uppercase font-bold">
                        <Shield size={14} /> Strict 100% Full Tear-Off Policy
                    </div>
                    <h3 className="text-lg font-bold text-white">Zero Residential Layovers</h3>
                    <p className="text-sm sm:text-base text-gray-300 font-serif leading-relaxed">
                        For all single-family residential homes in Bountiful, RHIVE enforces a strict 100% full tear-off policy down to bare wood deck. We never perform residential layovers because placing new shingles over old materials traps heat, conceals rotted sheathing, adds unnecessary weight, and voids manufacturer system warranties.
                    </p>
                    <div className="grid sm:grid-cols-2 gap-3 pt-2 font-sans text-xs sm:text-sm text-gray-300">
                        <div className="flex items-start gap-2">
                            <CheckCircle2 size={14} className="text-rhive-pink mt-0.5 shrink-0" />
                            <span><strong>100% Field Protection:</strong> Owens Corning ProArmor® synthetic underlayment.</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <CheckCircle2 size={14} className="text-rhive-pink mt-0.5 shrink-0" />
                            <span><strong>6-Foot Ice Barrier:</strong> Self-adhering WeatherLock® on eaves &amp; valleys (exceeding 24-inch code).</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <CheckCircle2 size={14} className="text-rhive-pink mt-0.5 shrink-0" />
                            <span><strong>Precision Fastening:</strong> Electro-galvanized coil nails in 6-nail pattern through the SureNail strip.</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <CheckCircle2 size={14} className="text-rhive-pink mt-0.5 shrink-0" />
                            <span><strong>Decking Allowance:</strong> 100 sq ft free 7/16 OSB replacement if rot is discovered.</span>
                        </div>
                    </div>
                    <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl text-xs sm:text-sm text-gray-300 font-serif mt-2">
                        Executed under our <strong>50/40/10 milestone schedule</strong> (50% deposit, 40% install day, 10% upon complete satisfaction), backed by Utah’s <strong>Statutory 3-Day Right of Rescission</strong>, the <strong>RHIVE Project Savings Promotion (RPSP 10% credit up to $1,000)</strong>, and RHIVE’s direct <strong>Lifetime Installer No-Leak Guarantee</strong>.
                    </div>
                </div>
            </section>

            {/* PART 3: Commercial Roofing */}
            <section className="relative z-10 py-14 px-6 max-w-5xl mx-auto border-t border-white/10">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-rhive-pink/10 border border-rhive-pink/20 flex items-center justify-center text-rhive-pink font-mono font-bold text-sm">
                        03
                    </div>
                    <span className="text-xs font-mono uppercase tracking-widest text-rhive-pink font-bold">
                        Part 3 • Commercial Roofing Systems
                    </span>
                </div>

                <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold uppercase tracking-tight text-white mb-6">
                    Commercial Roofing in Bountiful, UT
                </h2>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="p-6 bg-white/[0.02] border border-white/10 rounded-2xl space-y-3">
                        <div className="text-xs font-mono text-cyan-400 uppercase font-bold">Commercial Facility Solutions</div>
                        <h3 className="text-lg font-bold text-white">Commercial Steep-Slope &amp; Low-Slope</h3>
                        <p className="text-sm sm:text-base text-gray-300 font-serif leading-relaxed">
                            RHIVE provides turnkey commercial roofing for retail plazas, industrial warehouses, office complexes, churches, banks, and multi-family communities across Bountiful. We engineer both commercial steep-slope architectural systems and low-slope membrane solutions under certified Master Service Agreements (MSAs).
                        </p>
                    </div>

                    <div className="p-6 bg-white/[0.02] border border-white/10 rounded-2xl space-y-3">
                        <div className="text-xs font-mono text-emerald-400 uppercase font-bold">30-Year Guarantees &amp; Code Layovers</div>
                        <h3 className="text-lg font-bold text-white">GAF NDL Coverage &amp; Code Layovers</h3>
                        <p className="text-sm sm:text-base text-gray-300 font-serif leading-relaxed">
                            Under Utah building codes, single-layer commercial roofs in dry, structurally sound condition qualify for code-compliant layovers without complete tear-off. Commercial installations qualify for <strong>GAF No Dollar Limit (NDL) Warranties up to 30 years</strong> with zero payout caps.
                        </p>
                    </div>
                </div>

                <div className="p-4 bg-white/[0.015] border border-white/10 rounded-xl text-xs sm:text-sm text-gray-300 font-serif">
                    Commercial accounts operate under custom Master Service Agreements (MSA) or standard retail terms, and qualify for our <strong>Commercial RPSP credit (10% credit up to $3,000)</strong> for estimates approved within 7 days.
                </div>
            </section>

            {/* PART 4: Asphalt Roofing */}
            <section className="relative z-10 py-14 px-6 max-w-5xl mx-auto border-t border-white/10">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-rhive-pink/10 border border-rhive-pink/20 flex items-center justify-center text-rhive-pink font-mono font-bold text-sm">
                        04
                    </div>
                    <span className="text-xs font-mono uppercase tracking-widest text-rhive-pink font-bold">
                        Part 4 • Asphalt Shingle Systems
                    </span>
                </div>

                <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold uppercase tracking-tight text-white mb-6">
                    Asphalt Roofing in Bountiful, UT
                </h2>

                <div className="grid md:grid-cols-3 gap-6">
                    <div className="p-5 bg-white/[0.02] border border-white/10 rounded-xl space-y-2">
                        <div className="text-xs font-mono text-cyan-400 uppercase font-bold">130 MPH Wind Defense</div>
                        <h3 className="text-base font-bold text-white">Owens Corning Duration®</h3>
                        <p className="text-xs sm:text-sm text-gray-300 font-serif leading-relaxed">
                            Patented SureNail® Technology with an engineered woven fabric strip delivers a certified 130 MPH wind uplift warranty and 25-Year StreakGuard™ Algae Resistance.
                        </p>
                    </div>

                    <div className="p-5 bg-white/[0.02] border border-white/10 rounded-xl space-y-2">
                        <div className="text-xs font-mono text-rhive-pink uppercase font-bold">Class 4 Impact Rated</div>
                        <h3 className="text-base font-bold text-white">Duration FLEX® SBS</h3>
                        <p className="text-xs sm:text-sm text-gray-300 font-serif leading-relaxed">
                            SBS polymer-modified shingles absorb high-velocity hail hits and thermal shifting without cracking, qualifying homeowners for 20–30% insurance premium discounts.
                        </p>
                    </div>

                    <div className="p-5 bg-white/[0.02] border border-white/10 rounded-xl space-y-2">
                        <div className="text-xs font-mono text-emerald-400 uppercase font-bold">Luxury Aesthetics</div>
                        <h3 className="text-base font-bold text-white">GAF Designer Shingles</h3>
                        <p className="text-xs sm:text-sm text-gray-300 font-serif leading-relaxed">
                            For luxury estates, we install GAF Woodland® and Grand Sequoia® Designer Shingles with wood-shake aesthetics backed by GAF System Plus® 50-year non-prorated coverage.
                        </p>
                    </div>
                </div>
            </section>

            {/* PART 5: Flat Roofing */}
            <section className="relative z-10 py-14 px-6 max-w-5xl mx-auto border-t border-white/10">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-rhive-pink/10 border border-rhive-pink/20 flex items-center justify-center text-rhive-pink font-mono font-bold text-sm">
                        05
                    </div>
                    <span className="text-xs font-mono uppercase tracking-widest text-rhive-pink font-bold">
                        Part 5 • Flat Roofing Technical Specs
                    </span>
                </div>

                <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold uppercase tracking-tight text-white mb-6">
                    Flat Roofing in Bountiful, UT
                </h2>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="p-6 bg-white/[0.02] border border-white/10 rounded-2xl space-y-3">
                        <div className="text-xs font-mono text-cyan-400 uppercase font-bold">Energy Star TPO (60/80 mil)</div>
                        <h3 className="text-lg font-bold text-white">GAF EverGuard® TPO</h3>
                        <p className="text-sm sm:text-base text-gray-300 font-serif leading-relaxed">
                            A highly reflective white thermoplastic membrane that reflects solar UV radiation, keeping commercial building interiors cool and reducing summer HVAC cooling bills.
                        </p>
                    </div>

                    <div className="p-6 bg-white/[0.02] border border-white/10 rounded-2xl space-y-3">
                        <div className="text-xs font-mono text-rhive-pink uppercase font-bold">Chemical Resistant PVC (60/80 mil)</div>
                        <h3 className="text-lg font-bold text-white">GAF EverGuard® PVC</h3>
                        <p className="text-sm sm:text-base text-gray-300 font-serif leading-relaxed">
                            Specially formulated for high chemical, oil, grease, and fire resistance—essential for commercial kitchens, restaurants, and industrial facilities with roof exhausts.
                        </p>
                    </div>
                </div>

                <div className="p-5 bg-white/[0.015] border border-white/10 rounded-xl space-y-2">
                    <div className="text-xs font-mono font-bold uppercase text-emerald-400">Substrate, Tapered Insulation &amp; Monolithic Seams</div>
                    <p className="text-sm sm:text-base text-gray-300 font-serif leading-relaxed">
                        Assemblies include mechanically attached <strong>Polyisocyanurate (Polyiso) thermal insulation boards</strong>, custom-tapered Polyiso around drains and scuppers to eliminate standing water, high-density <strong>DensDeck® gypsum cover boards</strong> for impact and fire resistance, and hot-air fusion heat-welded seams for a monolithic watertight bond.
                    </p>
                </div>
            </section>

            {/* AEO FAQ Accordion Hub */}
            <section className="relative z-10 py-12 px-6 max-w-5xl mx-auto border-t border-white/10">
                <div className="text-center mb-10">
                    <div className="text-xs font-mono uppercase font-bold text-rhive-pink tracking-widest mb-1">
                        Bountiful AEO Knowledge
                    </div>
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold uppercase tracking-tight text-white">
                        Frequently Asked Questions by Bountiful Property Owners
                    </h2>
                </div>

                <div className="space-y-4">
                    <div className="border border-white/10 bg-white/[0.015] rounded-xl overflow-hidden">
                        <button
                            onClick={() => toggleFaq('faq-bountiful-residential')}
                            className="w-full text-left p-5 flex justify-between items-center gap-4 hover:bg-white/[0.02] cursor-pointer"
                        >
                            <span className="text-sm sm:text-base font-bold text-white">
                                What is RHIVE’s residential reroofing standard for Bountiful single-family homes?
                            </span>
                            <ChevronDown className={cn("w-4 h-4 text-rhive-pink transition-transform", openFaq === 'faq-bountiful-residential' && "rotate-180")} />
                        </button>
                        {openFaq === 'faq-bountiful-residential' && (
                            <div className="p-5 pt-0 space-y-3 border-t border-white/5">
                                <div className="p-3.5 rounded-lg bg-rhive-pink/10 border border-rhive-pink/20">
                                    <div className="text-xs font-mono font-bold text-rhive-pink uppercase mb-1 flex items-center gap-1.5">
                                        <Zap className="w-3.5 h-3.5" /> Direct Answer Summary
                                    </div>
                                    <p className="text-xs sm:text-sm text-white font-sans leading-relaxed">
                                        RHIVE enforces a strict 100% full tear-off policy down to bare wood deck. Every reroof includes 100% ProArmor® synthetic barrier, 6+ ft WeatherLock® Ice &amp; Water Shield, 6-nail fastening through SureNail, and 100 sq ft free OSB decking replacement backed by a Lifetime No-Leak Guarantee.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="border border-white/10 bg-white/[0.015] rounded-xl overflow-hidden">
                        <button
                            onClick={() => toggleFaq('faq-bountiful-commercial')}
                            className="w-full text-left p-5 flex justify-between items-center gap-4 hover:bg-white/[0.02] cursor-pointer"
                        >
                            <span className="text-sm sm:text-base font-bold text-white">
                                What commercial roofing systems and warranties does RHIVE offer in Bountiful?
                            </span>
                            <ChevronDown className={cn("w-4 h-4 text-rhive-pink transition-transform", openFaq === 'faq-bountiful-commercial' && "rotate-180")} />
                        </button>
                        {openFaq === 'faq-bountiful-commercial' && (
                            <div className="p-5 pt-0 space-y-3 border-t border-white/5">
                                <div className="p-3.5 rounded-lg bg-rhive-pink/10 border border-rhive-pink/20">
                                    <div className="text-xs font-mono font-bold text-rhive-pink uppercase mb-1 flex items-center gap-1.5">
                                        <Zap className="w-3.5 h-3.5" /> Direct Answer Summary
                                    </div>
                                    <p className="text-xs sm:text-sm text-white font-sans leading-relaxed">
                                        We install GAF EverGuard® TPO and PVC (60/80 mil), perform certified single-layer commercial layovers, and provide GAF No Dollar Limit (NDL) Guarantees up to 30 years covering 100% of material and labor defect costs.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="border border-white/10 bg-white/[0.015] rounded-xl overflow-hidden">
                        <button
                            onClick={() => toggleFaq('faq-bountiful-asphalt')}
                            className="w-full text-left p-5 flex justify-between items-center gap-4 hover:bg-white/[0.02] cursor-pointer"
                        >
                            <span className="text-sm sm:text-base font-bold text-white">
                                What asphalt shingle products does RHIVE install for Bountiful properties?
                            </span>
                            <ChevronDown className={cn("w-4 h-4 text-rhive-pink transition-transform", openFaq === 'faq-bountiful-asphalt' && "rotate-180")} />
                        </button>
                        {openFaq === 'faq-bountiful-asphalt' && (
                            <div className="p-5 pt-0 space-y-3 border-t border-white/5">
                                <div className="p-3.5 rounded-lg bg-rhive-pink/10 border border-rhive-pink/20">
                                    <div className="text-xs font-mono font-bold text-rhive-pink uppercase mb-1 flex items-center gap-1.5">
                                        <Zap className="w-3.5 h-3.5" /> Direct Answer Summary
                                    </div>
                                    <p className="text-xs sm:text-sm text-white font-sans leading-relaxed">
                                        We install Owens Corning Duration® (130 MPH SureNail® rating), Duration FLEX® Class 4 Impact Rated shingles for hail protection and insurance discounts, and luxury GAF Grand Sequoia® and Woodland® Designer Shingles.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="border border-white/10 bg-white/[0.015] rounded-xl overflow-hidden">
                        <button
                            onClick={() => toggleFaq('faq-bountiful-flat')}
                            className="w-full text-left p-5 flex justify-between items-center gap-4 hover:bg-white/[0.02] cursor-pointer"
                        >
                            <span className="text-sm sm:text-base font-bold text-white">
                                What are the technical specifications of RHIVE’s flat roof membrane installations in Bountiful?
                            </span>
                            <ChevronDown className={cn("w-4 h-4 text-rhive-pink transition-transform", openFaq === 'faq-bountiful-flat' && "rotate-180")} />
                        </button>
                        {openFaq === 'faq-bountiful-flat' && (
                            <div className="p-5 pt-0 space-y-3 border-t border-white/5">
                                <div className="p-3.5 rounded-lg bg-rhive-pink/10 border border-rhive-pink/20">
                                    <div className="text-xs font-mono font-bold text-rhive-pink uppercase mb-1 flex items-center gap-1.5">
                                        <Zap className="w-3.5 h-3.5" /> Direct Answer Summary
                                    </div>
                                    <p className="text-xs sm:text-sm text-white font-sans leading-relaxed">
                                        Our installations include GAF EverGuard® TPO/PVC membranes, Polyiso thermal insulation, custom-tapered drainage boards, DensDeck® gypsum cover boards, and fusion hot-air welded seams.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <a
                        href="/faq"
                        className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono font-bold uppercase tracking-wider text-rhive-pink hover:text-white transition-colors"
                    >
                        <span>View Master FAQ Hub</span>
                        <ArrowRight size={14} />
                    </a>
                </div>
            </section>
        </div>
    );
}
