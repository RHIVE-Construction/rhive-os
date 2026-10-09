import React, { useEffect, useMemo, useState } from 'react';
import { Phone, Shield, ArrowRight, CheckCircle2, Zap, MapPin, Snowflake, Building2, ChevronDown, Wind, Umbrella, Sparkles, Wrench, Layers } from 'lucide-react';
import { cn } from '../lib/utils';

export default function ClearfieldServiceAreaPage() {
    useEffect(() => {
        document.title = "Top-Rated Roofing Contractor Clearfield UT | RHIVE Construction";
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
            metaDesc = document.createElement('meta');
            metaDesc.setAttribute('name', 'description');
            document.head.appendChild(metaDesc);
        }
        metaDesc.setAttribute('content', "Top-rated residential & commercial roofing in Clearfield, UT near Hill AFB. Owens Corning Duration 130 MPH shingles, GAF TPO/PVC flat roofs, 100% full tear-off, and lifetime guarantee.");
    }, []);

    const [openFaq, setOpenFaq] = useState<string | null>('faq-clearfield-residential');

    const handleEstimateClick = () => {
        window.location.href = '/estimate-tool';
    };

    const toggleFaq = (id: string) => {
        setOpenFaq(prev => prev === id ? null : id);
    };

    // Granular JSON-LD Schema for Clearfield, UT local SEO & AEO
    const jsonLdSchema = useMemo(() => {
        return {
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "RoofingContractor",
                    "@id": "https://www.rhiveconstruction.com/service-areas/clearfield-ut/#localbusiness",
                    "name": "RHIVE Construction - Clearfield Service Area",
                    "url": "https://www.rhiveconstruction.com/service-areas/clearfield-ut",
                    "logo": "https://i.imgur.com/t0VcSgJ.png",
                    "image": "https://i.imgur.com/t0VcSgJ.png",
                    "telephone": "+1-435-417-6637",
                    "email": "office@rhiveconstruction.com",
                    "priceRange": "$$$",
                    "description": "RHIVE Construction delivers precision-engineered residential roofing, commercial facility systems, high-performance asphalt shingles, and certified flat membrane installations across Clearfield, UT and North Davis County.",
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
                        "latitude": 41.1147,
                        "longitude": -112.0255
                    },
                    "areaServed": [
                        {"@type": "City", "name": "Clearfield"},
                        {"@type": "PostalCode", "postalCode": "84015"},
                        {"@type": "PostalCode", "postalCode": "84016"},
                        {"@type": "PostalCode", "postalCode": "84089"},
                        {"@type": "AdministrativeArea", "name": "Freeport Center"},
                        {"@type": "AdministrativeArea", "name": "Hill Air Force Base Corridor"}
                    ]
                },
                {
                    "@type": "FAQPage",
                    "@id": "https://www.rhiveconstruction.com/service-areas/clearfield-ut/#faqpage",
                    "mainEntity": [
                        {
                            "@type": "Question",
                            "name": "What is RHIVE’s residential reroofing standard for Clearfield single-family homes?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "RHIVE enforces a strict 100% full tear-off policy down to bare OSB decking on all residential replacements in Clearfield. Every replacement includes Owens Corning ProArmor® synthetic underlayment, a minimum of 6 feet of WeatherLock® Ice & Water Shield, a 6-nail fastening pattern, and up to 100 sq ft of free 7/16 OSB decking replacement backed by a Lifetime No-Leak Guarantee."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "What commercial roofing solutions does RHIVE provide in Clearfield?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "RHIVE is a certified GAF commercial installer providing GAF EverGuard® TPO and PVC single-ply membranes in 60 and 80 mil specs, executes code-compliant commercial layovers, and provides GAF No Dollar Limit (NDL) Guarantees for up to 30 years covering 100% of material and labor defect costs."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "What asphalt shingle products does RHIVE install in Clearfield?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "We install Owens Corning Duration® featuring patented SureNail® Technology (130 MPH wind warranty) and Duration FLEX® Class 4 Impact Rated shingles for hail defense, backed by 50-year non-prorated material warranties and 25-Year StreakGuard™ Algae Protection."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "What are the technical specifications of RHIVE’s flat roof membrane installations in Clearfield?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "Our flat roofing assemblies include GAF EverGuard® TPO and PVC membranes, mechanically attached Polyiso thermal insulation cover boards, custom pre-fabricated tapered Polyiso around drains and scuppers to eliminate standing water, DensDeck® gypsum cover boards, and fusion hot-air welded seams."
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
                        Clearfield, UT • North Davis County Roofing Authority
                    </span>
                </div>

                <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold uppercase tracking-tight text-white mb-4 leading-tight">
                    Residential &amp; Commercial Roofing in<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-rhive-pink">
                        Clearfield, Utah &amp; Hill AFB
                    </span>
                </h1>

                <div className="text-base sm:text-xl font-serif italic text-rhive-pink mb-6">
                    130 MPH Valley Wind Uplift Defense. 100% Tear-Off Standard. Lifetime No-Leak Protection.
                </div>

                <p className="text-base sm:text-lg text-gray-200 max-w-[70ch] mx-auto mb-8 leading-relaxed font-serif">
                    Located in northern Davis County adjacent to Hill Air Force Base, Clearfield homes and commercial facilities face open-valley wind gusts, intense seasonal solar exposure, and heavy winter snowfall. RHIVE Construction delivers Owens Corning Duration® shingles, certified GAF flat membranes, and mathematical price transparency.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-4">
                    <button
                        onClick={handleEstimateClick}
                        className="bg-rhive-pink hover:bg-[#d4007b] text-white font-bold text-xs sm:text-sm uppercase tracking-widest px-8 py-3.5 rounded-full shadow-[0_0_15px_rgba(236,2,139,0.4)] transition-all hover:scale-105 cursor-pointer"
                    >
                        Configure Clearfield Estimate
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
                    Clearfield Regional Factors, Municipal Permitting &amp; Brand Values
                </h2>

                <div className="p-6 bg-white/[0.02] border border-white/10 rounded-2xl space-y-4 mb-6">
                    <h3 className="text-lg font-bold text-white">Hill AFB Corridor &amp; Open-Valley Weather Dynamics</h3>
                    <p className="text-sm sm:text-base text-gray-300 font-serif leading-relaxed">
                        Located in northern Davis County adjacent to Hill Air Force Base, <strong>Clearfield, Utah</strong> experiences open-valley wind gusts, intense seasonal solar exposure, and heavy winter snowfall that accelerates shingle wear.
                    </p>
                    <div className="grid sm:grid-cols-2 gap-4 pt-2">
                        <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                            <div className="text-xs font-mono text-rhive-pink font-bold uppercase mb-1">Clearfield City Permitting</div>
                            <p className="text-xs sm:text-sm text-gray-300 font-serif">
                                Full roof replacements in Clearfield require municipal building permits through the Clearfield City Community Development Department. RHIVE manages 100% of the permitting process, ensuring strict code compliance.
                            </p>
                        </div>
                        <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                            <div className="text-xs font-mono text-emerald-400 font-bold uppercase mb-1">Service Coverage</div>
                            <p className="text-xs sm:text-sm text-gray-300 font-serif">
                                Coverage across State Route 126 (Main Street), Antelope Drive, Freeport Center, and boundaries adjoining Sunset, Clinton, and Syracuse.
                            </p>
                        </div>
                    </div>
                    <div className="pt-2 border-t border-white/10 text-xs sm:text-sm text-gray-300 font-serif leading-relaxed">
                        Co-founded by <strong>Kara Robinson</strong> and <strong>Michael Robinson</strong>, RHIVE Construction brings complete cost transparency to Clearfield homeowners. We eliminate middleman sales commissions and physical warehouse overhead to keep administrative expenses <strong>under 10%</strong>. Every quote includes an itemized breakdown of **Materials, Labor, Overhead, and Net Profit**. Guided by our slogan <strong>"Finish On Top"</strong>, we donate complete roofs to local veterans, teachers, and first responders.
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
                    Residential Roofing in Clearfield, UT
                </h2>

                <div className="p-6 bg-white/[0.02] border border-white/10 rounded-2xl space-y-4">
                    <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs uppercase font-bold">
                        <Shield size={14} /> Strict 100% Full Tear-Off Policy
                    </div>
                    <h3 className="text-lg font-bold text-white">Zero Residential Layovers</h3>
                    <p className="text-sm sm:text-base text-gray-300 font-serif leading-relaxed">
                        RHIVE enforces a strict 100% full tear-off policy down to bare OSB decking on all residential replacements in Clearfield. We do not install residential layovers because covering old shingles traps moisture, accelerates heat rot, hides deck damage, and voids manufacturer system warranties.
                    </p>
                    <div className="grid sm:grid-cols-2 gap-3 pt-2 font-sans text-xs sm:text-sm text-gray-300">
                        <div className="flex items-start gap-2">
                            <CheckCircle2 size={14} className="text-rhive-pink mt-0.5 shrink-0" />
                            <span><strong>Synthetic Field Barrier:</strong> Owens Corning ProArmor® synthetic underlayment.</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <CheckCircle2 size={14} className="text-rhive-pink mt-0.5 shrink-0" />
                            <span><strong>Eave &amp; Valley Shield:</strong> 6+ feet WeatherLock® self-adhering Ice &amp; Water Shield.</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <CheckCircle2 size={14} className="text-rhive-pink mt-0.5 shrink-0" />
                            <span><strong>Precision Fastening:</strong> Electro-galvanized coil nails in 6-nail pattern per shingle.</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <CheckCircle2 size={14} className="text-rhive-pink mt-0.5 shrink-0" />
                            <span><strong>Decking Allowance:</strong> 100 sq ft free 7/16 OSB replacement if rot is discovered.</span>
                        </div>
                    </div>
                    <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl text-xs sm:text-sm text-gray-300 font-serif mt-2">
                        Structured on our <strong>50/40/10 milestone schedule</strong>, protected by Utah's <strong>Statutory 3-Day Right of Rescission</strong>, the <strong>RPSP 10% credit (up to $1,000)</strong>, and RHIVE's direct <strong>Lifetime Installer No-Leak Guarantee</strong>.
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
                    Commercial Roofing in Clearfield, UT
                </h2>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="p-6 bg-white/[0.02] border border-white/10 rounded-2xl space-y-3">
                        <div className="text-xs font-mono text-cyan-400 uppercase font-bold">Commercial Facility Solutions</div>
                        <h3 className="text-lg font-bold text-white">Commercial Steep-Slope &amp; Low-Slope</h3>
                        <p className="text-sm sm:text-base text-gray-300 font-serif leading-relaxed">
                            RHIVE delivers turnkey commercial roofing for warehouses near Freeport Center, retail corridors, churches, banks, and multi-family developments in Clearfield. We engineer both commercial steep-slope architectural systems and low-slope membrane solutions under certified Master Service Agreements (MSAs).
                        </p>
                    </div>

                    <div className="p-6 bg-white/[0.02] border border-white/10 rounded-2xl space-y-3">
                        <div className="text-xs font-mono text-emerald-400 uppercase font-bold">30-Year Guarantees &amp; Code Layovers</div>
                        <h3 className="text-lg font-bold text-white">GAF NDL Coverage &amp; Code Layovers</h3>
                        <p className="text-sm sm:text-base text-gray-300 font-serif leading-relaxed">
                            Under active Utah building codes, single-layer commercial roofs in dry, structurally sound condition qualify for certified layovers without full tear-off. Commercial installations qualify for <strong>GAF No Dollar Limit (NDL) Guarantees up to 30 years</strong> with zero payout caps.
                        </p>
                    </div>
                </div>

                <div className="p-4 bg-white/[0.015] border border-white/10 rounded-xl text-xs sm:text-sm text-gray-300 font-serif">
                    Commercial accounts operate under custom Master Service Agreements (MSA) and qualify for our <strong>Commercial RPSP credit (10% credit up to $3,000)</strong> for estimates approved within 7 days.
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
                    Asphalt Roofing in Clearfield, UT
                </h2>

                <div className="grid md:grid-cols-3 gap-6">
                    <div className="p-5 bg-white/[0.02] border border-white/10 rounded-xl space-y-2">
                        <div className="text-xs font-mono text-cyan-400 uppercase font-bold">130 MPH Wind Defense</div>
                        <h3 className="text-base font-bold text-white">Owens Corning Duration®</h3>
                        <p className="text-xs sm:text-sm text-gray-300 font-serif leading-relaxed">
                            Patented SureNail® Technology with an engineered woven fabric strip in the fastening line delivers a certified 130 MPH wind uplift warranty and 25-Year StreakGuard™ Algae Resistance.
                        </p>
                    </div>

                    <div className="p-5 bg-white/[0.02] border border-white/10 rounded-xl space-y-2">
                        <div className="text-xs font-mono text-rhive-pink uppercase font-bold">Class 4 Impact Rated</div>
                        <h3 className="text-base font-bold text-white">Duration FLEX® SBS</h3>
                        <p className="text-xs sm:text-sm text-gray-300 font-serif leading-relaxed">
                            SBS polymer-modified shingles absorb hail impacts and withstand sub-zero freeze-thaw cycles without cracking, qualifying homeowners for up to 20–30% insurance discounts.
                        </p>
                    </div>

                    <div className="p-5 bg-white/[0.02] border border-white/10 rounded-xl space-y-2">
                        <div className="text-xs font-mono text-emerald-400 uppercase font-bold">System Components</div>
                        <h3 className="text-base font-bold text-white">Starter Strip &amp; Ridge Caps</h3>
                        <p className="text-xs sm:text-sm text-gray-300 font-serif leading-relaxed">
                            Includes Owens Corning Starter Strip Plus along eaves and color-matched Pro-Edge® or DuraRidge® hip and ridge caps, backed by 50-year non-prorated material coverage.
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
                    Flat Roofing in Clearfield, UT
                </h2>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="p-6 bg-white/[0.02] border border-white/10 rounded-2xl space-y-3">
                        <div className="text-xs font-mono text-cyan-400 uppercase font-bold">White Reflective TPO (60/80 mil)</div>
                        <h3 className="text-lg font-bold text-white">GAF EverGuard® TPO</h3>
                        <p className="text-sm sm:text-base text-gray-300 font-serif leading-relaxed">
                            Energy Star rated white membrane that reflects solar radiation, lowering building HVAC cooling costs during hot summer months for Clearfield commercial properties.
                        </p>
                    </div>

                    <div className="p-6 bg-white/[0.02] border border-white/10 rounded-2xl space-y-3">
                        <div className="text-xs font-mono text-rhive-pink uppercase font-bold">Chemical &amp; Grease PVC (60/80 mil)</div>
                        <h3 className="text-lg font-bold text-white">GAF EverGuard® PVC</h3>
                        <p className="text-sm sm:text-base text-gray-300 font-serif leading-relaxed">
                            Engineered for superior resistance to chemicals, fats, oils, and fire—ideal for commercial kitchens, automotive facilities, and industrial buildings.
                        </p>
                    </div>
                </div>

                <div className="p-5 bg-white/[0.015] border border-white/10 rounded-xl space-y-2">
                    <div className="text-xs font-mono font-bold uppercase text-emerald-400">Thermal Assembly &amp; Hot-Air Welds</div>
                    <p className="text-sm sm:text-base text-gray-300 font-serif leading-relaxed">
                        Features mechanically attached <strong>Polyiso thermal insulation cover boards</strong>, custom pre-fabricated tapered Polyiso around drains and scuppers to eliminate standing water, high-density <strong>DensDeck® gypsum cover boards</strong>, and fusion hot-air welded seams for a permanent watertight bond.
                    </p>
                </div>
            </section>

            {/* AEO FAQ Accordion Hub */}
            <section className="relative z-10 py-12 px-6 max-w-5xl mx-auto border-t border-white/10">
                <div className="text-center mb-10">
                    <div className="text-xs font-mono uppercase font-bold text-rhive-pink tracking-widest mb-1">
                        Clearfield AEO Knowledge
                    </div>
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold uppercase tracking-tight text-white">
                        Frequently Asked Questions by Clearfield Property Owners
                    </h2>
                </div>

                <div className="space-y-4">
                    <div className="border border-white/10 bg-white/[0.015] rounded-xl overflow-hidden">
                        <button
                            onClick={() => toggleFaq('faq-clearfield-residential')}
                            className="w-full text-left p-5 flex justify-between items-center gap-4 hover:bg-white/[0.02] cursor-pointer"
                        >
                            <span className="text-sm sm:text-base font-bold text-white">
                                What is RHIVE’s residential reroofing standard for Clearfield single-family homes?
                            </span>
                            <ChevronDown className={cn("w-4 h-4 text-rhive-pink transition-transform", openFaq === 'faq-clearfield-residential' && "rotate-180")} />
                        </button>
                        {openFaq === 'faq-clearfield-residential' && (
                            <div className="p-5 pt-0 space-y-3 border-t border-white/5">
                                <div className="p-3.5 rounded-lg bg-rhive-pink/10 border border-rhive-pink/20">
                                    <div className="text-xs font-mono font-bold text-rhive-pink uppercase mb-1 flex items-center gap-1.5">
                                        <Zap className="w-3.5 h-3.5" /> Direct Answer Summary
                                    </div>
                                    <p className="text-xs sm:text-sm text-white font-sans leading-relaxed">
                                        RHIVE enforces a strict 100% full tear-off policy down to bare OSB decking. Every replacement includes 100% ProArmor® synthetic barrier, 6+ ft WeatherLock® Ice &amp; Water Shield, 6-nail fastening, and 100 sq ft free OSB decking replacement backed by a Lifetime No-Leak Guarantee.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="border border-white/10 bg-white/[0.015] rounded-xl overflow-hidden">
                        <button
                            onClick={() => toggleFaq('faq-clearfield-commercial')}
                            className="w-full text-left p-5 flex justify-between items-center gap-4 hover:bg-white/[0.02] cursor-pointer"
                        >
                            <span className="text-sm sm:text-base font-bold text-white">
                                What commercial roofing solutions does RHIVE provide in Clearfield?
                            </span>
                            <ChevronDown className={cn("w-4 h-4 text-rhive-pink transition-transform", openFaq === 'faq-clearfield-commercial' && "rotate-180")} />
                        </button>
                        {openFaq === 'faq-clearfield-commercial' && (
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
                            onClick={() => toggleFaq('faq-clearfield-asphalt')}
                            className="w-full text-left p-5 flex justify-between items-center gap-4 hover:bg-white/[0.02] cursor-pointer"
                        >
                            <span className="text-sm sm:text-base font-bold text-white">
                                What asphalt shingle products does RHIVE install in Clearfield?
                            </span>
                            <ChevronDown className={cn("w-4 h-4 text-rhive-pink transition-transform", openFaq === 'faq-clearfield-asphalt' && "rotate-180")} />
                        </button>
                        {openFaq === 'faq-clearfield-asphalt' && (
                            <div className="p-5 pt-0 space-y-3 border-t border-white/5">
                                <div className="p-3.5 rounded-lg bg-rhive-pink/10 border border-rhive-pink/20">
                                    <div className="text-xs font-mono font-bold text-rhive-pink uppercase mb-1 flex items-center gap-1.5">
                                        <Zap className="w-3.5 h-3.5" /> Direct Answer Summary
                                    </div>
                                    <p className="text-xs sm:text-sm text-white font-sans leading-relaxed">
                                        We install Owens Corning Duration® (130 MPH SureNail® warranty) and Duration FLEX® Class 4 Impact Rated shingles for hail defense, backed by 50-year non-prorated material warranties.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="border border-white/10 bg-white/[0.015] rounded-xl overflow-hidden">
                        <button
                            onClick={() => toggleFaq('faq-clearfield-flat')}
                            className="w-full text-left p-5 flex justify-between items-center gap-4 hover:bg-white/[0.02] cursor-pointer"
                        >
                            <span className="text-sm sm:text-base font-bold text-white">
                                What are the technical specifications of RHIVE’s flat roof membrane installations in Clearfield?
                            </span>
                            <ChevronDown className={cn("w-4 h-4 text-rhive-pink transition-transform", openFaq === 'faq-clearfield-flat' && "rotate-180")} />
                        </button>
                        {openFaq === 'faq-clearfield-flat' && (
                            <div className="p-5 pt-0 space-y-3 border-t border-white/5">
                                <div className="p-3.5 rounded-lg bg-rhive-pink/10 border border-rhive-pink/20">
                                    <div className="text-xs font-mono font-bold text-rhive-pink uppercase mb-1 flex items-center gap-1.5">
                                        <Zap className="w-3.5 h-3.5" /> Direct Answer Summary
                                    </div>
                                    <p className="text-xs sm:text-sm text-white font-sans leading-relaxed">
                                        Our flat roof assemblies include GAF EverGuard® TPO/PVC membranes, Polyiso thermal insulation, custom-tapered boards around drains and scuppers, DensDeck® gypsum cover boards, and fusion hot-air welded seams.
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
