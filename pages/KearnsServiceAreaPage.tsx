import React, { useEffect, useMemo, useState } from 'react';
import { Phone, Shield, ArrowRight, Zap, MapPin, ChevronDown, Wind, Sun, Building2, Layers, CheckCircle2, Wrench, Umbrella, Award } from 'lucide-react';
import { cn } from '../lib/utils';

export default function KearnsServiceAreaPage() {
    useEffect(() => {
        document.title = "Top-Rated Roofing Contractor Kearns UT | RHIVE Construction";
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
            metaDesc = document.createElement('meta');
            metaDesc.setAttribute('name', 'description');
            document.head.appendChild(metaDesc);
        }
        metaDesc.setAttribute('content', "Top-rated residential & commercial roofing in Kearns, UT. Owens Corning Duration 130 MPH shingles, GAF TPO/PVC flat roofs, 100% full tear-off, and lifetime guarantee.");
    }, []);

    const [openFaq, setOpenFaq] = useState<string | null>('faq-kearns-wind');

    const handleEstimateClick = () => {
        window.location.href = '/estimate-tool';
    };

    const toggleFaq = (id: string) => {
        setOpenFaq(prev => prev === id ? null : id);
    };

    // Granular JSON-LD Schema for Kearns, UT local SEO & AEO
    const jsonLdSchema = useMemo(() => {
        return {
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "RoofingContractor",
                    "@id": "https://www.rhiveconstruction.com/service-areas/kearns-ut/#localbusiness",
                    "name": "RHIVE Construction - Kearns Service Area",
                    "url": "https://www.rhiveconstruction.com/service-areas/kearns-ut",
                    "logo": "https://i.imgur.com/t0VcSgJ.png",
                    "image": "https://i.imgur.com/t0VcSgJ.png",
                    "telephone": "+1-435-417-6637",
                    "email": "office@rhiveconstruction.com",
                    "priceRange": "$$$",
                    "description": "RHIVE Construction delivers precision-engineered residential roofing, commercial facility systems, high-performance asphalt shingles, and certified flat membrane installations across Kearns, UT.",
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
                        "latitude": 40.6586,
                        "longitude": -111.9963
                    },
                    "areaServed": [
                        {"@type": "City", "name": "Kearns"},
                        {"@type": "PostalCode", "postalCode": "84118"},
                        {"@type": "AdministrativeArea", "name": "Oquirrh Park"},
                        {"@type": "AdministrativeArea", "name": "Utah Olympic Oval District"},
                        {"@type": "AdministrativeArea", "name": "5400 South Corridor"},
                        {"@type": "AdministrativeArea", "name": "6200 South Corridor"}
                    ]
                },
                {
                    "@type": "FAQPage",
                    "@id": "https://www.rhiveconstruction.com/service-areas/kearns-ut/#faqpage",
                    "mainEntity": [
                        {
                            "@type": "Question",
                            "name": "How does RHIVE protect Kearns homes against high open-valley wind gusts?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "We install the Owens Corning Duration® Series with patented SureNail® Technology. Its engineered woven fabric strip prevents nail pull-through and maintains a certified 130 MPH wind uplift rating when installed using our 6-nail fastening pattern."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "Can commercial building owners in Kearns perform a flat roof layover?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "Yes. Utah building code permits a single-layer commercial layover if the existing membrane and insulation are dry and structurally sound. RHIVE heat-welds a new GAF TPO or PVC membrane over new cover boards, backed by up to 30-year GAF NDL warranties."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "What is RHIVE’s policy if unforeseen wood rot is found during tear-off?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "Every residential reroof includes up to 100 sq ft of 7/16 OSB decking replacement at no extra charge. Any additional sheets needed are billed at pre-agreed contract rates ($72.50 per 7/16 OSB sheet) specified upfront in your agreement."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "What is RHIVE’s residential reroofing standard for Kearns single-family homes?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "RHIVE enforces a strict 100% full tear-off policy down to bare OSB decking on all residential replacements in Kearns. Every project includes ProArmor® synthetic underlayment, 6+ ft WeatherLock® Ice & Water Shield, 6-nail fastening, and a Lifetime Installer No-Leak Guarantee."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "What commercial roofing solutions does RHIVE provide in Kearns?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "RHIVE is a factory-certified GAF commercial contractor installing heat-welded GAF EverGuard® TPO and PVC single-ply membranes (60/80 mil), single-layer commercial layovers, and GAF No Dollar Limit (NDL) Guarantees for up to 30 years."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "What asphalt shingle products does RHIVE install in Kearns?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "We install Owens Corning Duration® shingles with SureNail® Technology (130 MPH wind rating), Duration FLEX® Class 4 Impact Rated shingles for severe hail and UV resistance, and GAF Designer Shingles backed by 50-year non-prorated material warranties."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "What are the technical specifications of RHIVE’s flat roof membrane installations in Kearns?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "Our commercial flat roofing assemblies feature GAF EverGuard® TPO/PVC membranes, mechanically attached Polyiso thermal insulation, tapered boards around drains and scuppers to eliminate ponding water, DensDeck® gypsum cover boards, and hot-air fusion heat-welded seams."
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
            <section className="relative z-10 pt-28 md:pt-36 pb-14 px-6 max-w-5xl mx-auto text-center">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/10 mb-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-rhive-pink animate-pulse" />
                    <span className="text-xs font-mono uppercase tracking-widest text-gray-300">
                        Kearns, UT • West-Valley Authority
                    </span>
                </div>

                <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold uppercase tracking-tight text-white mb-4 leading-tight">
                    Engineered Roofing Systems for<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-rhive-pink">
                        Kearns, Utah
                    </span>
                </h1>

                <div className="text-base sm:text-xl font-serif italic text-rhive-pink mb-6">
                    Open-Valley Wind Defense. 100% Tear-Off Standard. Lifetime No-Leak Protection.
                </div>

                {/* Local Problem Callout */}
                <div className="p-5 sm:p-6 bg-white/[0.02] border border-white/10 rounded-2xl max-w-4xl mx-auto mb-8 text-left">
                    <div className="flex items-center gap-2 text-xs font-mono uppercase font-bold text-rhive-pink mb-2">
                        <Wind className="w-4 h-4" /> Solving Kearns's Toughest Open West-Valley Wind &amp; High Solar Exposure Challenges
                    </div>
                    <p className="text-sm sm:text-base text-gray-200 font-serif leading-relaxed">
                        Positioned in central-western Salt Lake County, properties in Kearns face harsh open-valley weather conditions. Unobstructed west-valley wind gusts sweep across the terrain, putting intense uplift pressure on roof edges and unreinforced shingles. During summer months, relentless solar UV radiation bakes roof surfaces, accelerating shingle granule loss and causing thermal expansion stress. Combined with winter snow accumulation and 80°F+ single-day temperature swings, Kearns rooflines demand high-wind SureNail® fastening bands, polymer-modified Class 4 impact shingles, and balanced attic ventilation systems.
                    </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-4">
                    <button
                        onClick={handleEstimateClick}
                        className="bg-rhive-pink hover:bg-[#d4007b] text-white font-bold text-xs sm:text-sm uppercase tracking-widest px-8 py-3.5 rounded-full shadow-[0_0_15px_rgba(236,2,139,0.4)] transition-all hover:scale-105 cursor-pointer"
                    >
                        Configure Kearns Estimate
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

            {/* 5-Section Standard Architecture */}

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
                    Location-Specific Content for Kearns, UT
                </h2>

                <div className="p-6 bg-white/[0.02] border border-white/10 rounded-2xl space-y-4 mb-6">
                    <h3 className="text-lg font-bold text-white">Regional Environmental Factors &amp; Local Footprint</h3>
                    <p className="text-sm sm:text-base text-gray-300 font-serif leading-relaxed">
                        Kearns features established residential neighborhoods with single-story ranch and split-entry homes. Located in the open Salt Lake Valley, homes are exposed to direct wind shears and high solar UV radiation that degrade lower-grade roofing materials over time.
                    </p>
                    <div className="grid sm:grid-cols-2 gap-4 pt-2">
                        <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                            <div className="text-xs font-mono text-rhive-pink font-bold uppercase mb-1">Municipal Permitting &amp; Compliance</div>
                            <p className="text-xs sm:text-sm text-gray-300 font-serif">
                                Full roof replacements in Kearns require municipal building permits issued through Salt Lake County / Greater Salt Lake Municipal District. RHIVE Construction handles 100% of the permitting process, ensuring strict adherence to wind uplift resistance, perimeter 28-gauge steel drip metal specifications, and eave ice barrier codes.
                            </p>
                        </div>
                        <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                            <div className="text-xs font-mono text-emerald-400 font-bold uppercase mb-1">Local Service Footprint</div>
                            <p className="text-xs sm:text-sm text-gray-300 font-serif">
                                Our service footprint covers all Kearns neighborhoods, including 5400 South, 6200 South, 4000 West, Oquirrh Park, the Utah Olympic Oval district, and boundaries adjoining West Valley City and Taylorsville.
                            </p>
                        </div>
                    </div>
                    <div className="pt-2 border-t border-white/10 text-xs sm:text-sm text-gray-300 font-serif leading-relaxed">
                        Co-founded by <strong>Kara Robinson (President)</strong> and <strong>Michael Robinson (CEO)</strong>, RHIVE Construction is a female-owned and operated contractor bringing complete cost transparency to Kearns. We eliminate middleman sales commissions and physical warehouse overhead to keep administrative expenses <strong>under 10%</strong>. Every quote includes an itemized mathematical breakdown showing exact costs for <strong>Materials, Labor, Operating Overhead, and Net Company Profit</strong>. Guided by our slogan <strong>"Finish On Top"</strong> and our ongoing mission of donating complete roof replacements to local veterans, teachers, and first responders, Kearns homeowners receive master-craftsman quality without salesman markups.
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
                    Residential Roofing in Kearns, UT
                </h2>

                <div className="p-6 bg-white/[0.02] border border-white/10 rounded-2xl space-y-4">
                    <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs uppercase font-bold">
                        <Shield size={14} /> Strict 100% Full Tear-Off Policy
                    </div>
                    <h3 className="text-lg font-bold text-white">Zero Residential Layovers on Kearns Homes</h3>
                    <p className="text-sm sm:text-base text-gray-300 font-serif leading-relaxed">
                        RHIVE enforces a strict <strong>100% full tear-off policy</strong> down to bare OSB decking on all residential replacements in Kearns. We never perform residential layovers because covering old shingles traps moisture, accelerates heat rot, hides deck damage, and voids manufacturer system warranties.
                    </p>
                    <div className="grid sm:grid-cols-2 gap-4 pt-2">
                        <div className="p-4 bg-black/40 border border-white/5 rounded-xl space-y-2">
                            <div className="text-xs font-mono text-rhive-pink font-bold uppercase">Synthetic Field Barrier</div>
                            <p className="text-xs sm:text-sm text-gray-300 font-serif">
                                <strong>Owens Corning ProArmor®</strong> high-performance synthetic underlayment covering 100% of the roof field.
                            </p>
                        </div>
                        <div className="p-4 bg-black/40 border border-white/5 rounded-xl space-y-2">
                            <div className="text-xs font-mono text-rhive-pink font-bold uppercase">Eave &amp; Valley Shield</div>
                            <p className="text-xs sm:text-sm text-gray-300 font-serif">
                                A minimum of <strong>6 feet of Owens Corning WeatherLock®</strong> self-adhering Ice &amp; Water Shield installed along eaves and valleys (extending well past the 24-inch IRC warm-wall code).
                            </p>
                        </div>
                        <div className="p-4 bg-black/40 border border-white/5 rounded-xl space-y-2">
                            <div className="text-xs font-mono text-rhive-pink font-bold uppercase">Precision Fastening &amp; Decking</div>
                            <p className="text-xs sm:text-sm text-gray-300 font-serif">
                                Electro-galvanized ring shank coil nails driven in a strict <strong>6-nail pattern per shingle</strong> through the SureNail strip. Includes up to <strong>100 sq ft of 7/16 OSB decking replacement</strong> at no extra charge.
                            </p>
                        </div>
                        <div className="p-4 bg-black/40 border border-white/5 rounded-xl space-y-2">
                            <div className="text-xs font-mono text-rhive-pink font-bold uppercase">Payment Terms &amp; Guarantees</div>
                            <p className="text-xs sm:text-sm text-gray-300 font-serif">
                                Structured on our <strong>50/40/10 milestone schedule</strong>, protected by Utah's <strong>Statutory 3-Day Right of Rescission</strong>, the <strong>RPSP 10% credit (up to $1,000)</strong>, and RHIVE's direct <strong>Lifetime Installer No-Leak Guarantee</strong>.
                            </p>
                        </div>
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
                    Commercial Roofing in Kearns, UT
                </h2>

                <div className="p-6 bg-white/[0.02] border border-white/10 rounded-2xl space-y-4">
                    <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase font-bold">
                        <Building2 size={14} /> Certified Commercial Roofing Contractor
                    </div>
                    <p className="text-sm sm:text-base text-gray-300 font-serif leading-relaxed">
                        RHIVE delivers turnkey commercial roofing across Kearns, serving strip malls, local enterprises, churches, banks, and multi-family housing complexes. We engineer both commercial steep-slope architectural shingle systems and low-slope membrane solutions under certified Master Service Agreements (MSAs).
                    </p>
                    <div className="grid sm:grid-cols-2 gap-4 pt-2">
                        <div className="p-4 bg-black/40 border border-white/5 rounded-xl space-y-1">
                            <div className="text-xs font-mono text-cyan-400 font-bold uppercase">Commercial Facility Systems</div>
                            <p className="text-xs sm:text-sm text-gray-300 font-serif">
                                Full engineering for both <strong>commercial steep-slope architectural shingles</strong> and <strong>certified low-slope single-ply membrane systems</strong> customized to west-valley wind load standards.
                            </p>
                        </div>
                        <div className="p-4 bg-black/40 border border-white/5 rounded-xl space-y-1">
                            <div className="text-xs font-mono text-cyan-400 font-bold uppercase">Commercial Layover Option</div>
                            <p className="text-xs sm:text-sm text-gray-300 font-serif">
                                Under active Utah building codes, single-layer commercial flat roofs in dry, sound condition can receive a <strong>certified layover membrane installation</strong>, reducing disposal costs while maintaining structural integrity.
                            </p>
                        </div>
                        <div className="p-4 bg-black/40 border border-white/5 rounded-xl space-y-1">
                            <div className="text-xs font-mono text-cyan-400 font-bold uppercase">GAF NDL Coverage</div>
                            <p className="text-xs sm:text-sm text-gray-300 font-serif">
                                Commercial projects qualify for <strong>GAF No Dollar Limit (NDL) Guarantees</strong> for up to 30 years, covering 100% of material and labor defect costs without a payout cap.
                            </p>
                        </div>
                        <div className="p-4 bg-black/40 border border-white/5 rounded-xl space-y-1">
                            <div className="text-xs font-mono text-cyan-400 font-bold uppercase">Commercial RPSP</div>
                            <p className="text-xs sm:text-sm text-gray-300 font-serif">
                                Commercial accounts operate under Master Service Agreements (MSA) and qualify for our <strong>Commercial RPSP credit</strong> (10% credit up to $3,000) for estimates approved within 7 days.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* PART 4: Asphalt Roofing */}
            <section className="relative z-10 py-14 px-6 max-w-5xl mx-auto border-t border-white/10">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-rhive-pink/10 border border-rhive-pink/20 flex items-center justify-center text-rhive-pink font-mono font-bold text-sm">
                        04
                    </div>
                    <span className="text-xs font-mono uppercase tracking-widest text-rhive-pink font-bold">
                        Part 4 • Asphalt Shingle Engineering
                    </span>
                </div>

                <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold uppercase tracking-tight text-white mb-6">
                    Asphalt Roofing in Kearns, UT
                </h2>

                <div className="p-6 bg-white/[0.02] border border-white/10 rounded-2xl space-y-4">
                    <div className="flex items-center gap-2 text-rhive-pink font-mono text-xs uppercase font-bold">
                        <Layers size={14} /> Owens Corning Preferred Contractor
                    </div>
                    <p className="text-sm sm:text-base text-gray-300 font-serif leading-relaxed">
                        RHIVE Construction is an Owens Corning Preferred Contractor installing architectural shingle systems engineered for high wind uplift resistance:
                    </p>
                    <div className="grid sm:grid-cols-2 gap-4 pt-2">
                        <div className="p-4 bg-black/40 border border-white/5 rounded-xl space-y-2">
                            <div className="text-xs font-mono text-rhive-pink font-bold uppercase">Owens Corning Duration® Series</div>
                            <p className="text-xs sm:text-sm text-gray-300 font-serif">
                                Patented <strong>SureNail® Technology</strong> with embedded woven fabric strip delivering a certified <strong>130 MPH wind uplift warranty</strong> and 25-Year StreakGuard™ Algae Resistance Protection.
                            </p>
                        </div>
                        <div className="p-4 bg-black/40 border border-white/5 rounded-xl space-y-2">
                            <div className="text-xs font-mono text-rhive-pink font-bold uppercase">Owens Corning Duration FLEX®</div>
                            <p className="text-xs sm:text-sm text-gray-300 font-serif">
                                SBS polymer-modified Class 4 Impact Rated shingle designed to absorb hail impacts and withstand cold winter freeze-thaw cycles without cracking, qualifying homeowners for up to 20–30% insurance discounts.
                            </p>
                        </div>
                        <div className="p-4 bg-black/40 border border-white/5 rounded-xl space-y-2">
                            <div className="text-xs font-mono text-rhive-pink font-bold uppercase">GAF Designer Shingles</div>
                            <p className="text-xs sm:text-sm text-gray-300 font-serif">
                                For dimensional curb appeal, we install <strong>GAF Woodland® and Grand Sequoia® Designer Shingles</strong>, backed by GAF System Plus® 50-year non-prorated coverage.
                            </p>
                        </div>
                        <div className="p-4 bg-black/40 border border-white/5 rounded-xl space-y-2">
                            <div className="text-xs font-mono text-rhive-pink font-bold uppercase">Non-Prorated 50-Year Warranty</div>
                            <p className="text-xs sm:text-sm text-gray-300 font-serif">
                                Complete installations include Owens Corning Starter Strip Plus and color-matched Pro-Edge® / DuraRidge® caps backed by <strong>50 years of non-prorated material coverage</strong>.
                            </p>
                        </div>
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
                        Part 5 • Flat &amp; Low-Slope Roofing
                    </span>
                </div>

                <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold uppercase tracking-tight text-white mb-6">
                    Flat Roofing in Kearns, UT
                </h2>

                <div className="p-6 bg-white/[0.02] border border-white/10 rounded-2xl space-y-4">
                    <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase font-bold">
                        <Building2 size={14} /> Advanced Single-Ply Membrane Technologies
                    </div>
                    <p className="text-sm sm:text-base text-gray-300 font-serif leading-relaxed">
                        RHIVE’s commercial flat roofing installations utilize advanced single-ply membrane technologies designed for long-term weatherproofing:
                    </p>
                    <div className="grid sm:grid-cols-2 gap-4 pt-2">
                        <div className="p-4 bg-black/40 border border-white/5 rounded-xl space-y-2">
                            <div className="text-xs font-mono text-cyan-400 font-bold uppercase">GAF EverGuard® TPO (60/80 mil)</div>
                            <p className="text-xs sm:text-sm text-gray-300 font-serif">
                                White reflective thermoplastic membrane (Energy Star rated) that reflects solar radiation, lowering building HVAC cooling costs during hot summer months.
                            </p>
                        </div>
                        <div className="p-4 bg-black/40 border border-white/5 rounded-xl space-y-2">
                            <div className="text-xs font-mono text-cyan-400 font-bold uppercase">GAF EverGuard® PVC (60/80 mil)</div>
                            <p className="text-xs sm:text-sm text-gray-300 font-serif">
                                Engineered for superior resistance to chemicals, fats, oils, and fire—ideal for commercial kitchens, automotive facilities, and industrial buildings.
                            </p>
                        </div>
                        <div className="p-4 bg-black/40 border border-white/5 rounded-xl space-y-2">
                            <div className="text-xs font-mono text-cyan-400 font-bold uppercase">Thermal &amp; Drainage Assembly</div>
                            <p className="text-xs sm:text-sm text-gray-300 font-serif">
                                Mechanically attached <strong>Polyiso thermal insulation cover boards</strong>, custom pre-fabricated tapered Polyiso around drains and scuppers to prevent ponding water, and high-density <strong>DensDeck® gypsum cover boards</strong>.
                            </p>
                        </div>
                        <div className="p-4 bg-black/40 border border-white/5 rounded-xl space-y-2">
                            <div className="text-xs font-mono text-cyan-400 font-bold uppercase">Fusion Heat Welding</div>
                            <p className="text-xs sm:text-sm text-gray-300 font-serif">
                                All field seams, wall transitions, and pipe boots are fusion heat-welded using hot air to form a monolithic, watertight bond.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Comprehensive Q&A Accordion Hub for Kearns */}
            <section className="relative z-10 py-14 px-6 max-w-5xl mx-auto border-t border-white/10">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rhive-pink/10 border border-rhive-pink/20 text-rhive-pink font-mono text-xs uppercase mb-3">
                        <Zap className="w-3.5 h-3.5" /> High-Intent Answer Engine
                    </div>
                    <h2 className="text-xl sm:text-3xl font-extrabold uppercase tracking-tight text-white mb-3">
                        Frequently Asked Questions by Kearns Property Owners
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-400 max-w-[70ch] mx-auto font-serif">
                        Direct, verified technical answers for residential and commercial roofing projects across Kearns and west Salt Lake Valley.
                    </p>
                </div>

                <div className="space-y-4">
                    {/* FAQ 1: Open Valley Wind */}
                    <div className="border border-white/10 bg-white/[0.015] rounded-xl overflow-hidden">
                        <button
                            onClick={() => toggleFaq('faq-kearns-wind')}
                            className="w-full text-left p-5 flex justify-between items-center gap-4 hover:bg-white/[0.02] cursor-pointer"
                        >
                            <span className="text-sm sm:text-base font-bold text-white">
                                How does RHIVE protect Kearns homes against high open-valley wind gusts?
                            </span>
                            <ChevronDown className={cn("w-4 h-4 text-rhive-pink transition-transform", openFaq === 'faq-kearns-wind' && "rotate-180")} />
                        </button>
                        {openFaq === 'faq-kearns-wind' && (
                            <div className="p-5 pt-0 space-y-3 border-t border-white/5">
                                <div className="p-3.5 rounded-lg bg-rhive-pink/10 border border-rhive-pink/20">
                                    <div className="text-xs font-mono font-bold text-rhive-pink uppercase mb-1 flex items-center gap-1.5">
                                        <Zap className="w-3.5 h-3.5" /> Direct Answer Summary
                                    </div>
                                    <p className="text-xs sm:text-sm text-white font-sans leading-relaxed">
                                        We install the Owens Corning Duration® Series with patented SureNail® Technology. Its engineered woven fabric strip prevents nail pull-through and maintains a certified 130 MPH wind uplift rating when installed using our 6-nail fastening pattern.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* FAQ 2: Commercial Layover */}
                    <div className="border border-white/10 bg-white/[0.015] rounded-xl overflow-hidden">
                        <button
                            onClick={() => toggleFaq('faq-kearns-layover')}
                            className="w-full text-left p-5 flex justify-between items-center gap-4 hover:bg-white/[0.02] cursor-pointer"
                        >
                            <span className="text-sm sm:text-base font-bold text-white">
                                Can commercial building owners in Kearns perform a flat roof layover?
                            </span>
                            <ChevronDown className={cn("w-4 h-4 text-rhive-pink transition-transform", openFaq === 'faq-kearns-layover' && "rotate-180")} />
                        </button>
                        {openFaq === 'faq-kearns-layover' && (
                            <div className="p-5 pt-0 space-y-3 border-t border-white/5">
                                <div className="p-3.5 rounded-lg bg-rhive-pink/10 border border-rhive-pink/20">
                                    <div className="text-xs font-mono font-bold text-rhive-pink uppercase mb-1 flex items-center gap-1.5">
                                        <Zap className="w-3.5 h-3.5" /> Direct Answer Summary
                                    </div>
                                    <p className="text-xs sm:text-sm text-white font-sans leading-relaxed">
                                        Yes. Utah building code permits a single-layer commercial layover if the existing membrane and insulation are dry and structurally sound. RHIVE heat-welds a new GAF TPO or PVC membrane over new cover boards, backed by up to 30-year GAF NDL warranties.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* FAQ 3: Wood Rot Decking */}
                    <div className="border border-white/10 bg-white/[0.015] rounded-xl overflow-hidden">
                        <button
                            onClick={() => toggleFaq('faq-kearns-decking')}
                            className="w-full text-left p-5 flex justify-between items-center gap-4 hover:bg-white/[0.02] cursor-pointer"
                        >
                            <span className="text-sm sm:text-base font-bold text-white">
                                What is RHIVE’s policy if unforeseen wood rot is found during tear-off?
                            </span>
                            <ChevronDown className={cn("w-4 h-4 text-rhive-pink transition-transform", openFaq === 'faq-kearns-decking' && "rotate-180")} />
                        </button>
                        {openFaq === 'faq-kearns-decking' && (
                            <div className="p-5 pt-0 space-y-3 border-t border-white/5">
                                <div className="p-3.5 rounded-lg bg-rhive-pink/10 border border-rhive-pink/20">
                                    <div className="text-xs font-mono font-bold text-rhive-pink uppercase mb-1 flex items-center gap-1.5">
                                        <Zap className="w-3.5 h-3.5" /> Direct Answer Summary
                                    </div>
                                    <p className="text-xs sm:text-sm text-white font-sans leading-relaxed">
                                        Every residential reroof includes up to 100 sq ft of 7/16 OSB decking replacement at no extra charge. Any additional sheets needed are billed at pre-agreed contract rates ($72.50 per 7/16 OSB sheet) specified upfront in your agreement.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* FAQ 4: Residential Standard */}
                    <div className="border border-white/10 bg-white/[0.015] rounded-xl overflow-hidden">
                        <button
                            onClick={() => toggleFaq('faq-kearns-residential')}
                            className="w-full text-left p-5 flex justify-between items-center gap-4 hover:bg-white/[0.02] cursor-pointer"
                        >
                            <span className="text-sm sm:text-base font-bold text-white">
                                What is RHIVE’s residential reroofing standard for Kearns single-family homes?
                            </span>
                            <ChevronDown className={cn("w-4 h-4 text-rhive-pink transition-transform", openFaq === 'faq-kearns-residential' && "rotate-180")} />
                        </button>
                        {openFaq === 'faq-kearns-residential' && (
                            <div className="p-5 pt-0 space-y-3 border-t border-white/5">
                                <div className="p-3.5 rounded-lg bg-rhive-pink/10 border border-rhive-pink/20">
                                    <div className="text-xs font-mono font-bold text-rhive-pink uppercase mb-1 flex items-center gap-1.5">
                                        <Zap className="w-3.5 h-3.5" /> Direct Answer Summary
                                    </div>
                                    <p className="text-xs sm:text-sm text-white font-sans leading-relaxed">
                                        RHIVE enforces a strict 100% full tear-off policy down to bare OSB decking on all residential replacements in Kearns. Every project includes ProArmor® synthetic underlayment, 6+ ft WeatherLock® Ice &amp; Water Shield, 6-nail fastening, and a Lifetime Installer No-Leak Guarantee.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* FAQ 5: Commercial Solutions */}
                    <div className="border border-white/10 bg-white/[0.015] rounded-xl overflow-hidden">
                        <button
                            onClick={() => toggleFaq('faq-kearns-commercial')}
                            className="w-full text-left p-5 flex justify-between items-center gap-4 hover:bg-white/[0.02] cursor-pointer"
                        >
                            <span className="text-sm sm:text-base font-bold text-white">
                                What commercial roofing solutions does RHIVE provide in Kearns?
                            </span>
                            <ChevronDown className={cn("w-4 h-4 text-rhive-pink transition-transform", openFaq === 'faq-kearns-commercial' && "rotate-180")} />
                        </button>
                        {openFaq === 'faq-kearns-commercial' && (
                            <div className="p-5 pt-0 space-y-3 border-t border-white/5">
                                <div className="p-3.5 rounded-lg bg-rhive-pink/10 border border-rhive-pink/20">
                                    <div className="text-xs font-mono font-bold text-rhive-pink uppercase mb-1 flex items-center gap-1.5">
                                        <Zap className="w-3.5 h-3.5" /> Direct Answer Summary
                                    </div>
                                    <p className="text-xs sm:text-sm text-white font-sans leading-relaxed">
                                        RHIVE is a factory-certified GAF commercial contractor installing heat-welded GAF EverGuard® TPO and PVC single-ply membranes (60/80 mil), single-layer commercial layovers, and GAF No Dollar Limit (NDL) Guarantees for up to 30 years.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* FAQ 6: Asphalt Products */}
                    <div className="border border-white/10 bg-white/[0.015] rounded-xl overflow-hidden">
                        <button
                            onClick={() => toggleFaq('faq-kearns-asphalt')}
                            className="w-full text-left p-5 flex justify-between items-center gap-4 hover:bg-white/[0.02] cursor-pointer"
                        >
                            <span className="text-sm sm:text-base font-bold text-white">
                                What asphalt shingle products does RHIVE install in Kearns?
                            </span>
                            <ChevronDown className={cn("w-4 h-4 text-rhive-pink transition-transform", openFaq === 'faq-kearns-asphalt' && "rotate-180")} />
                        </button>
                        {openFaq === 'faq-kearns-asphalt' && (
                            <div className="p-5 pt-0 space-y-3 border-t border-white/5">
                                <div className="p-3.5 rounded-lg bg-rhive-pink/10 border border-rhive-pink/20">
                                    <div className="text-xs font-mono font-bold text-rhive-pink uppercase mb-1 flex items-center gap-1.5">
                                        <Zap className="w-3.5 h-3.5" /> Direct Answer Summary
                                    </div>
                                    <p className="text-xs sm:text-sm text-white font-sans leading-relaxed">
                                        We install Owens Corning Duration® shingles with SureNail® Technology (130 MPH wind rating), Duration FLEX® Class 4 Impact Rated shingles for severe hail and UV resistance, and GAF Designer Shingles backed by 50-year non-prorated material warranties.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* FAQ 7: Flat Membrane Specs */}
                    <div className="border border-white/10 bg-white/[0.015] rounded-xl overflow-hidden">
                        <button
                            onClick={() => toggleFaq('faq-kearns-flat')}
                            className="w-full text-left p-5 flex justify-between items-center gap-4 hover:bg-white/[0.02] cursor-pointer"
                        >
                            <span className="text-sm sm:text-base font-bold text-white">
                                What are the technical specifications of RHIVE’s flat roof membrane installations in Kearns?
                            </span>
                            <ChevronDown className={cn("w-4 h-4 text-rhive-pink transition-transform", openFaq === 'faq-kearns-flat' && "rotate-180")} />
                        </button>
                        {openFaq === 'faq-kearns-flat' && (
                            <div className="p-5 pt-0 space-y-3 border-t border-white/5">
                                <div className="p-3.5 rounded-lg bg-rhive-pink/10 border border-rhive-pink/20">
                                    <div className="text-xs font-mono font-bold text-rhive-pink uppercase mb-1 flex items-center gap-1.5">
                                        <Zap className="w-3.5 h-3.5" /> Direct Answer Summary
                                    </div>
                                    <p className="text-xs sm:text-sm text-white font-sans leading-relaxed">
                                        Our commercial flat roofing assemblies feature GAF EverGuard® TPO/PVC membranes, mechanically attached Polyiso thermal insulation, tapered boards around drains and scuppers to eliminate ponding water, DensDeck® gypsum cover boards, and hot-air fusion heat-welded seams.
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
