import React, { useEffect, useMemo, useState } from 'react';
import { Phone, Shield, ArrowRight, Zap, MapPin, ChevronDown, Snowflake, Building2, Layers, CheckCircle2, Wrench, Umbrella, Award } from 'lucide-react';
import { cn } from '../lib/utils';

export default function ParkCityServiceAreaPage() {
    useEffect(() => {
        document.title = "Top-Rated Roofing Contractor Park City UT | RHIVE Construction";
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
            metaDesc = document.createElement('meta');
            metaDesc.setAttribute('name', 'description');
            document.head.appendChild(metaDesc);
        }
        metaDesc.setAttribute('content', "Top-rated alpine residential & commercial roofing in Park City, UT & Deer Valley. Owens Corning Duration FLEX Class 4 shingles, GAF TPO/PVC flat roofs, 100% full tear-off, and lifetime guarantee.");
    }, []);

    const [openFaq, setOpenFaq] = useState<string | null>('faq-parkcity-ice-dams');

    const handleEstimateClick = () => {
        window.location.href = '/estimate-tool';
    };

    const toggleFaq = (id: string) => {
        setOpenFaq(prev => prev === id ? null : id);
    };

    // Granular JSON-LD Schema for Park City, UT local SEO & AEO
    const jsonLdSchema = useMemo(() => {
        return {
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "RoofingContractor",
                    "@id": "https://www.rhiveconstruction.com/service-areas/park-city-ut/#localbusiness",
                    "name": "RHIVE Construction - Park City Service Area",
                    "url": "https://www.rhiveconstruction.com/service-areas/park-city-ut",
                    "logo": "https://i.imgur.com/t0VcSgJ.png",
                    "image": "https://i.imgur.com/t0VcSgJ.png",
                    "telephone": "+1-435-417-6637",
                    "email": "office@rhiveconstruction.com",
                    "priceRange": "$$$$",
                    "description": "RHIVE Construction delivers precision-engineered residential roofing, commercial facility systems, high-performance asphalt shingles, and certified flat membrane installations across Park City, UT and Summit County.",
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
                        "latitude": 40.6461,
                        "longitude": -111.4980
                    },
                    "areaServed": [
                        {"@type": "City", "name": "Park City"},
                        {"@type": "PostalCode", "postalCode": "84060"},
                        {"@type": "PostalCode", "postalCode": "84068"},
                        {"@type": "PostalCode", "postalCode": "84098"},
                        {"@type": "AdministrativeArea", "name": "Deer Valley"},
                        {"@type": "AdministrativeArea", "name": "Canyons Village"},
                        {"@type": "AdministrativeArea", "name": "Old Town"},
                        {"@type": "AdministrativeArea", "name": "Prospector"},
                        {"@type": "AdministrativeArea", "name": "Park Meadows"},
                        {"@type": "AdministrativeArea", "name": "Jeremy Ranch"},
                        {"@type": "AdministrativeArea", "name": "Silver Springs"},
                        {"@type": "AdministrativeArea", "name": "Promontory"}
                    ]
                },
                {
                    "@type": "FAQPage",
                    "@id": "https://www.rhiveconstruction.com/service-areas/park-city-ut/#faqpage",
                    "mainEntity": [
                        {
                            "@type": "Question",
                            "name": "How does RHIVE prevent destructive ice dams on high-altitude Park City rooflines?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "We install a minimum 6-to-9-foot continuous eave barrier of self-adhering Owens Corning WeatherLock® Ice & Water Shield combined with commercial-grade self-regulating heat trace cables (5W/lin ft, 110V). Thermostat controls activate the cables during freezing weather to maintain open drainage channels along eave lines."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "Why are Duration FLEX® Class 4 impact shingles recommended for Park City homes?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "Duration FLEX® shingles use SBS polymer-modified asphalt, giving them rubberized elasticity to withstand over 100 freeze-thaw cycles per year and absorb heavy snowpack sliding without cracking. They also qualify homeowners for up to 20–30% insurance premium discounts."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "Does RHIVE handle luxury mountain estate reroofing under HOA architectural guidelines?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "Yes. We work directly with Park City architectural review boards to supply material samples, color swatches, and technical specification packets for GAF Woodland® and Grand Sequoia® designer shingles, ensuring 100% compliance with local aesthetic standards."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "What is RHIVE’s residential reroofing standard for Park City mountain homes?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "For all single-family residential homes in Park City, RHIVE enforces a strict 100% full tear-off policy down to the bare wood deck. Every replacement includes ProArmor® or Tiger Paw™ synthetic underlayment, 6-9 feet of Ice & Water Shield, 6-nail fastening, and 100 sq ft free OSB decking replacement."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "What commercial roofing systems and warranties does RHIVE offer in Park City?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "As a certified GAF commercial roofing contractor, RHIVE installs GAF EverGuard® TPO and PVC single-ply membranes (60/80 mil), performs certified single-layer commercial layovers, and provides GAF No Dollar Limit (NDL) Guarantees for up to 30 years covering 100% of material and labor defect costs."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "What asphalt shingle products does RHIVE install for Park City properties?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "We install Owens Corning Duration FLEX® Class 4 Impact Rated shingles, Duration® Series (130 MPH SureNail® warranty), and GAF Designer Shingles (Woodland® / Grand Sequoia®) backed by 50-year non-prorated material warranties."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "What are the technical specifications of RHIVE’s flat roof membrane installations in Park City?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "Our flat roofing assemblies feature GAF EverGuard® TPO/PVC membranes, mechanically attached Polyiso insulation (R-30+), custom-tapered boards around drains and scuppers to eliminate standing water, high-density DensDeck® gypsum cover boards, and fusion hot-air welded seams."
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
                        Park City, UT • Alpine Snowpack &amp; Resort Authority
                    </span>
                </div>

                <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold uppercase tracking-tight text-white mb-4 leading-tight">
                    Engineered Roofing Systems for<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-rhive-pink">
                        Park City, Utah
                    </span>
                </h1>

                <div className="text-base sm:text-xl font-serif italic text-rhive-pink mb-6">
                    7,000+ Ft Alpine Snow Defense. 100% Tear-Off Standard. Lifetime No-Leak Protection.
                </div>

                {/* Local Problem Callout */}
                <div className="p-5 sm:p-6 bg-white/[0.02] border border-white/10 rounded-2xl max-w-4xl mx-auto mb-8 text-left">
                    <div className="flex items-center gap-2 text-xs font-mono uppercase font-bold text-rhive-pink mb-2">
                        <Snowflake className="w-4 h-4" /> Solving Park City's Toughest Alpine Snowpack &amp; High-Altitude Freeze-Thaw Challenges
                    </div>
                    <p className="text-sm sm:text-base text-gray-200 font-serif leading-relaxed">
                        Perched at over 7,000 feet elevation in the Wasatch Mountains, properties in Park City face North America's most demanding alpine weather conditions. Massive winter snowpack accumulation creates extreme weight loads on roof structures and causes chronic ice damming along eave lines. Over 100 freeze-thaw cycles per year, paired with high-altitude UV radiation, rapidly degrade standard roofing materials. Park City luxury estates and resort facilities demand SBS polymer-modified Class 4 impact shingles, heavy-duty eave heat trace systems, and continuous ice &amp; water protection.
                    </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-4">
                    <button
                        onClick={handleEstimateClick}
                        className="bg-rhive-pink hover:bg-[#d4007b] text-white font-bold text-xs sm:text-sm uppercase tracking-widest px-8 py-3.5 rounded-full shadow-[0_0_15px_rgba(236,2,139,0.4)] transition-all hover:scale-105 cursor-pointer"
                    >
                        Configure Park City Estimate
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
                    Location-Specific Content for Park City, UT
                </h2>

                <div className="p-6 bg-white/[0.02] border border-white/10 rounded-2xl space-y-4 mb-6">
                    <h3 className="text-lg font-bold text-white">Regional Environmental Factors &amp; Local Footprint</h3>
                    <p className="text-sm sm:text-base text-gray-300 font-serif leading-relaxed">
                        Park City features upscale mountain architecture, strict HOA guidelines, and luxury estate residential areas alongside world-class ski resort commercial infrastructure. High elevation subjects roofs to intense thermal expansion cycles and heavy snow loads that demand heavy-gauge drip edge metal, ice &amp; water shield across entire low-slope sections, and custom 6-inch gutters.
                    </p>
                    <div className="grid sm:grid-cols-2 gap-4 pt-2">
                        <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                            <div className="text-xs font-mono text-rhive-pink font-bold uppercase mb-1">Municipal Permitting &amp; Compliance</div>
                            <p className="text-xs sm:text-sm text-gray-300 font-serif">
                                Full roof replacements in Park City require municipal building permits issued through the Park City Building Department or Summit County. RHIVE Construction manages 100% of the permitting process, ensuring full compliance with high-altitude structural snow load codes, fire-resistance ratings, and eave ice barrier extensions.
                            </p>
                        </div>
                        <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                            <div className="text-xs font-mono text-emerald-400 font-bold uppercase mb-1">Local Service Footprint</div>
                            <p className="text-xs sm:text-sm text-gray-300 font-serif">
                                Our service footprint covers all Park City neighborhoods, including Deer Valley, Canyons Village, Old Town, Prospector, Park Meadows, Jeremy Ranch, Silver Springs, Pinebrook, and Promontory.
                            </p>
                        </div>
                    </div>
                    <div className="pt-2 border-t border-white/10 text-xs sm:text-sm text-gray-300 font-serif leading-relaxed">
                        Co-founded by <strong>Kara Robinson (President)</strong> and <strong>Michael Robinson (CEO)</strong>, RHIVE Construction is a female-owned and operated contractor bringing complete cost transparency to Park City. We eliminate middleman sales commissions and physical warehouse overhead to keep administrative expenses <strong>under 10%</strong>. Every quote issued provides a fully itemized mathematical breakdown showing exact costs for <strong>Materials, Labor, Operating Overhead (&lt;10%), and Net Company Profit</strong>. Under our slogan <strong>"Finish On Top"</strong> and our community mission of donating roofs to local veterans, teachers, and first responders, Park City property owners receive master-craftsman quality without salesman markups.
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
                    Residential Roofing in Park City, UT
                </h2>

                <div className="p-6 bg-white/[0.02] border border-white/10 rounded-2xl space-y-4">
                    <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs uppercase font-bold">
                        <Shield size={14} /> Strict 100% Full Tear-Off Policy
                    </div>
                    <h3 className="text-lg font-bold text-white">Zero Residential Layovers on Park City Homes</h3>
                    <p className="text-sm sm:text-base text-gray-300 font-serif leading-relaxed">
                        For all single-family residential homes in Park City, RHIVE enforces a strict <strong>100% full tear-off policy</strong> down to the bare wood deck. We never perform residential layovers because placing new shingles over old materials traps moisture, conceals rotted sheathing, adds unnecessary weight under heavy snow loads, and voids manufacturer system warranties.
                    </p>
                    <div className="grid sm:grid-cols-2 gap-4 pt-2">
                        <div className="p-4 bg-black/40 border border-white/5 rounded-xl space-y-2">
                            <div className="text-xs font-mono text-rhive-pink font-bold uppercase">100% Field Protection</div>
                            <p className="text-xs sm:text-sm text-gray-300 font-serif">
                                High-performance <strong>Owens Corning ProArmor®</strong> or <strong>GAF Tiger Paw™</strong> synthetic underlayment installed across the entire non-covered roof deck as a secondary water-shedding barrier.
                            </p>
                        </div>
                        <div className="p-4 bg-black/40 border border-white/5 rounded-xl space-y-2">
                            <div className="text-xs font-mono text-rhive-pink font-bold uppercase">Alpine Eave Waterproofing</div>
                            <p className="text-xs sm:text-sm text-gray-300 font-serif">
                                A minimum of <strong>6 to 9 feet of self-adhering Owens Corning WeatherLock® or GAF WeatherWatch® Ice &amp; Water Shield</strong> installed continuously along all eaves and valleys (extending well past the interior heated wall line).
                            </p>
                        </div>
                        <div className="p-4 bg-black/40 border border-white/5 rounded-xl space-y-2">
                            <div className="text-xs font-mono text-rhive-pink font-bold uppercase">Precision Fastening &amp; Decking</div>
                            <p className="text-xs sm:text-sm text-gray-300 font-serif">
                                Electro-galvanized ring shank coil nails driven in a strict <strong>6-nail pattern per shingle</strong> through the SureNail strip. Includes up to <strong>100 sq ft of 7/16 OSB decking replacement</strong> at no extra charge.
                            </p>
                        </div>
                        <div className="p-4 bg-black/40 border border-white/5 rounded-xl space-y-2">
                            <div className="text-xs font-mono text-rhive-pink font-bold uppercase">Investment &amp; Safety Net</div>
                            <p className="text-xs sm:text-sm text-gray-300 font-serif">
                                Executed under our <strong>50/40/10 milestone schedule</strong>, protected by Utah’s <strong>Statutory 3-Day Right of Rescission</strong>, the <strong>RPSP 10% credit (up to $1,000)</strong>, and RHIVE’s direct <strong>Lifetime Installer No-Leak Guarantee</strong>.
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
                    Commercial Roofing in Park City, UT
                </h2>

                <div className="p-6 bg-white/[0.02] border border-white/10 rounded-2xl space-y-4">
                    <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase font-bold">
                        <Building2 size={14} /> Certified Commercial Roofing Contractor
                    </div>
                    <p className="text-sm sm:text-base text-gray-300 font-serif leading-relaxed">
                        RHIVE provides engineered commercial roofing for alpine resort lodges, Main Street historic commercial properties, boutique hotels, churches, banks, and multi-family HOA communities throughout Park City. We engineer both commercial steep-slope architectural systems and low-slope membrane solutions under certified Master Service Agreements (MSAs).
                    </p>
                    <div className="grid sm:grid-cols-2 gap-4 pt-2">
                        <div className="p-4 bg-black/40 border border-white/5 rounded-xl space-y-1">
                            <div className="text-xs font-mono text-cyan-400 font-bold uppercase">Commercial Facility Systems</div>
                            <p className="text-xs sm:text-sm text-gray-300 font-serif">
                                Custom engineering for both <strong>commercial steep-slope architectural shingles</strong> and <strong>certified low-slope single-ply membrane systems</strong> built to withstand 7,000+ ft elevation alpine snowpack and thermal contraction.
                            </p>
                        </div>
                        <div className="p-4 bg-black/40 border border-white/5 rounded-xl space-y-1">
                            <div className="text-xs font-mono text-cyan-400 font-bold uppercase">Commercial Code Layovers</div>
                            <p className="text-xs sm:text-sm text-gray-300 font-serif">
                                Under Utah building codes, single-layer commercial flat roofs in dry, structurally sound condition can receive a <strong>certified layover membrane installation</strong>, saving substantial disposal fees.
                            </p>
                        </div>
                        <div className="p-4 bg-black/40 border border-white/5 rounded-xl space-y-1">
                            <div className="text-xs font-mono text-cyan-400 font-bold uppercase">GAF NDL Guarantees</div>
                            <p className="text-xs sm:text-sm text-gray-300 font-serif">
                                All complete commercial installations qualify for <strong>GAF No Dollar Limit (NDL) Commercial Warranties</strong> for up to 30 years, covering 100% of material and certified labor defect costs with no payout cap.
                            </p>
                        </div>
                        <div className="p-4 bg-black/40 border border-white/5 rounded-xl space-y-1">
                            <div className="text-xs font-mono text-cyan-400 font-bold uppercase">Commercial Terms &amp; RPSP</div>
                            <p className="text-xs sm:text-sm text-gray-300 font-serif">
                                Commercial accounts operate under custom Master Service Agreements (MSA) and qualify for our <strong>Commercial RPSP credit</strong> (10% credit up to $3,000) for estimates approved within 7 days.
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
                    Asphalt Roofing in Park City, UT
                </h2>

                <div className="p-6 bg-white/[0.02] border border-white/10 rounded-2xl space-y-4">
                    <div className="flex items-center gap-2 text-rhive-pink font-mono text-xs uppercase font-bold">
                        <Layers size={14} /> Owens Corning Preferred Contractor
                    </div>
                    <p className="text-sm sm:text-base text-gray-300 font-serif leading-relaxed">
                        RHIVE Construction is an Owens Corning Preferred Contractor specializing in high-performance architectural and luxury designer shingle systems engineered for extreme alpine environments:
                    </p>
                    <div className="grid sm:grid-cols-2 gap-4 pt-2">
                        <div className="p-4 bg-black/40 border border-white/5 rounded-xl space-y-2">
                            <div className="text-xs font-mono text-rhive-pink font-bold uppercase">Owens Corning Duration FLEX®</div>
                            <p className="text-xs sm:text-sm text-gray-300 font-serif">
                                SBS polymer-modified Class 4 Impact Rated shingle that absorbs high-velocity hail hits and extreme thermal shifting without cracking, qualifying homeowners for 20–30% insurance premium discounts.
                            </p>
                        </div>
                        <div className="p-4 bg-black/40 border border-white/5 rounded-xl space-y-2">
                            <div className="text-xs font-mono text-rhive-pink font-bold uppercase">Owens Corning Duration® Series</div>
                            <p className="text-xs sm:text-sm text-gray-300 font-serif">
                                Patented <strong>SureNail® Technology</strong> with embedded woven fabric strip delivering certified <strong>130 MPH wind uplift warranty</strong> and 25-Year StreakGuard™ Algae Resistance Protection.
                            </p>
                        </div>
                        <div className="p-4 bg-black/40 border border-white/5 rounded-xl space-y-2">
                            <div className="text-xs font-mono text-rhive-pink font-bold uppercase">GAF Designer Shingles</div>
                            <p className="text-xs sm:text-sm text-gray-300 font-serif">
                                For upscale mountain estates, we install <strong>GAF Woodland® and Grand Sequoia® Designer Shingles</strong>, offering hand-cut wood-shake dimensional aesthetics backed by GAF System Plus® 50-year non-prorated coverage.
                            </p>
                        </div>
                        <div className="p-4 bg-black/40 border border-white/5 rounded-xl space-y-2">
                            <div className="text-xs font-mono text-rhive-pink font-bold uppercase">50-Year Non-Prorated Warranty</div>
                            <p className="text-xs sm:text-sm text-gray-300 font-serif">
                                All complete replacements feature color-matched <strong>DuraRidge® or TimberCrest® SBS modified hip and ridge caps</strong> backed by <strong>50 years of non-prorated material coverage</strong>.
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
                    Flat Roofing in Park City, UT
                </h2>

                <div className="p-6 bg-white/[0.02] border border-white/10 rounded-2xl space-y-4">
                    <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase font-bold">
                        <Building2 size={14} /> Maximum Thermal Efficiency &amp; Snow Load Defense
                    </div>
                    <p className="text-sm sm:text-base text-gray-300 font-serif leading-relaxed">
                        RHIVE’s flat and low-slope membrane installations are engineered for maximum thermal efficiency, snow load resistance, and permanent leak defense:
                    </p>
                    <div className="grid sm:grid-cols-2 gap-4 pt-2">
                        <div className="p-4 bg-black/40 border border-white/5 rounded-xl space-y-2">
                            <div className="text-xs font-mono text-cyan-400 font-bold uppercase">GAF EverGuard® TPO (60/80 mil)</div>
                            <p className="text-xs sm:text-sm text-gray-300 font-serif">
                                Highly reflective white thermoplastic membrane (Energy Star rated) that reflects high-altitude solar radiation and provides maximum seam strength.
                            </p>
                        </div>
                        <div className="p-4 bg-black/40 border border-white/5 rounded-xl space-y-2">
                            <div className="text-xs font-mono text-cyan-400 font-bold uppercase">GAF EverGuard® PVC (60/80 mil)</div>
                            <p className="text-xs sm:text-sm text-gray-300 font-serif">
                                Specially formulated for high chemical, oil, grease, and fire resistance—essential for commercial kitchens, restaurants, and resort facilities.
                            </p>
                        </div>
                        <div className="p-4 bg-black/40 border border-white/5 rounded-xl space-y-2">
                            <div className="text-xs font-mono text-cyan-400 font-bold uppercase">Substrate &amp; Drainage Engineering</div>
                            <p className="text-xs sm:text-sm text-gray-300 font-serif">
                                Mechanically attached <strong>Polyisocyanurate (Polyiso) insulation boards</strong> to achieve high R-values (R-30+), custom-tapered Polyiso around drains and scuppers to eliminate standing water, and high-density <strong>DensDeck® gypsum cover boards</strong> for impact and fire resistance.
                            </p>
                        </div>
                        <div className="p-4 bg-black/40 border border-white/5 rounded-xl space-y-2">
                            <div className="text-xs font-mono text-cyan-400 font-bold uppercase">Monolithic Welded Seams</div>
                            <p className="text-xs sm:text-sm text-gray-300 font-serif">
                                All membrane seams and perimeter flashing details are fusion heat-welded using hot-air equipment to create a continuous, monolithic watertight bond.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Comprehensive Q&A Accordion Hub for Park City */}
            <section className="relative z-10 py-14 px-6 max-w-5xl mx-auto border-t border-white/10">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rhive-pink/10 border border-rhive-pink/20 text-rhive-pink font-mono text-xs uppercase mb-3">
                        <Zap className="w-3.5 h-3.5" /> High-Intent Answer Engine
                    </div>
                    <h2 className="text-xl sm:text-3xl font-extrabold uppercase tracking-tight text-white mb-3">
                        Frequently Asked Questions by Park City Property Owners
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-400 max-w-[70ch] mx-auto font-serif">
                        Direct, verified technical answers for residential and commercial roofing projects across Park City and Summit County.
                    </p>
                </div>

                <div className="space-y-4">
                    {/* FAQ 1: Ice Dams */}
                    <div className="border border-white/10 bg-white/[0.015] rounded-xl overflow-hidden">
                        <button
                            onClick={() => toggleFaq('faq-parkcity-ice-dams')}
                            className="w-full text-left p-5 flex justify-between items-center gap-4 hover:bg-white/[0.02] cursor-pointer"
                        >
                            <span className="text-sm sm:text-base font-bold text-white">
                                How does RHIVE prevent destructive ice dams on high-altitude Park City rooflines?
                            </span>
                            <ChevronDown className={cn("w-4 h-4 text-rhive-pink transition-transform", openFaq === 'faq-parkcity-ice-dams' && "rotate-180")} />
                        </button>
                        {openFaq === 'faq-parkcity-ice-dams' && (
                            <div className="p-5 pt-0 space-y-3 border-t border-white/5">
                                <div className="p-3.5 rounded-lg bg-rhive-pink/10 border border-rhive-pink/20">
                                    <div className="text-xs font-mono font-bold text-rhive-pink uppercase mb-1 flex items-center gap-1.5">
                                        <Zap className="w-3.5 h-3.5" /> Direct Answer Summary
                                    </div>
                                    <p className="text-xs sm:text-sm text-white font-sans leading-relaxed">
                                        We install a minimum 6-to-9-foot continuous eave barrier of self-adhering Owens Corning WeatherLock® Ice &amp; Water Shield combined with commercial-grade self-regulating heat trace cables (5W/lin ft, 110V). Thermostat controls activate the cables during freezing weather to maintain open drainage channels along eave lines.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* FAQ 2: Duration FLEX */}
                    <div className="border border-white/10 bg-white/[0.015] rounded-xl overflow-hidden">
                        <button
                            onClick={() => toggleFaq('faq-parkcity-flex')}
                            className="w-full text-left p-5 flex justify-between items-center gap-4 hover:bg-white/[0.02] cursor-pointer"
                        >
                            <span className="text-sm sm:text-base font-bold text-white">
                                Why are Duration FLEX® Class 4 impact shingles recommended for Park City homes?
                            </span>
                            <ChevronDown className={cn("w-4 h-4 text-rhive-pink transition-transform", openFaq === 'faq-parkcity-flex' && "rotate-180")} />
                        </button>
                        {openFaq === 'faq-parkcity-flex' && (
                            <div className="p-5 pt-0 space-y-3 border-t border-white/5">
                                <div className="p-3.5 rounded-lg bg-rhive-pink/10 border border-rhive-pink/20">
                                    <div className="text-xs font-mono font-bold text-rhive-pink uppercase mb-1 flex items-center gap-1.5">
                                        <Zap className="w-3.5 h-3.5" /> Direct Answer Summary
                                    </div>
                                    <p className="text-xs sm:text-sm text-white font-sans leading-relaxed">
                                        Duration FLEX® shingles use SBS polymer-modified asphalt, giving them rubberized elasticity to withstand over 100 freeze-thaw cycles per year and absorb heavy snowpack sliding without cracking. They also qualify homeowners for up to 20–30% insurance premium discounts.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* FAQ 3: HOA Compliance */}
                    <div className="border border-white/10 bg-white/[0.015] rounded-xl overflow-hidden">
                        <button
                            onClick={() => toggleFaq('faq-parkcity-hoa')}
                            className="w-full text-left p-5 flex justify-between items-center gap-4 hover:bg-white/[0.02] cursor-pointer"
                        >
                            <span className="text-sm sm:text-base font-bold text-white">
                                Does RHIVE handle luxury mountain estate reroofing under HOA architectural guidelines?
                            </span>
                            <ChevronDown className={cn("w-4 h-4 text-rhive-pink transition-transform", openFaq === 'faq-parkcity-hoa' && "rotate-180")} />
                        </button>
                        {openFaq === 'faq-parkcity-hoa' && (
                            <div className="p-5 pt-0 space-y-3 border-t border-white/5">
                                <div className="p-3.5 rounded-lg bg-rhive-pink/10 border border-rhive-pink/20">
                                    <div className="text-xs font-mono font-bold text-rhive-pink uppercase mb-1 flex items-center gap-1.5">
                                        <Zap className="w-3.5 h-3.5" /> Direct Answer Summary
                                    </div>
                                    <p className="text-xs sm:text-sm text-white font-sans leading-relaxed">
                                        Yes. We work directly with Park City architectural review boards to supply material samples, color swatches, and technical specification packets for GAF Woodland® and Grand Sequoia® designer shingles, ensuring 100% compliance with local aesthetic standards.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* FAQ 4: Residential Standard */}
                    <div className="border border-white/10 bg-white/[0.015] rounded-xl overflow-hidden">
                        <button
                            onClick={() => toggleFaq('faq-parkcity-residential')}
                            className="w-full text-left p-5 flex justify-between items-center gap-4 hover:bg-white/[0.02] cursor-pointer"
                        >
                            <span className="text-sm sm:text-base font-bold text-white">
                                What is RHIVE’s residential reroofing standard for Park City mountain homes?
                            </span>
                            <ChevronDown className={cn("w-4 h-4 text-rhive-pink transition-transform", openFaq === 'faq-parkcity-residential' && "rotate-180")} />
                        </button>
                        {openFaq === 'faq-parkcity-residential' && (
                            <div className="p-5 pt-0 space-y-3 border-t border-white/5">
                                <div className="p-3.5 rounded-lg bg-rhive-pink/10 border border-rhive-pink/20">
                                    <div className="text-xs font-mono font-bold text-rhive-pink uppercase mb-1 flex items-center gap-1.5">
                                        <Zap className="w-3.5 h-3.5" /> Direct Answer Summary
                                    </div>
                                    <p className="text-xs sm:text-sm text-white font-sans leading-relaxed">
                                        For all single-family residential homes in Park City, RHIVE enforces a strict 100% full tear-off policy down to the bare wood deck. Every replacement includes ProArmor® or Tiger Paw™ synthetic underlayment, 6-9 feet of Ice &amp; Water Shield, 6-nail fastening, and 100 sq ft free OSB decking replacement.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* FAQ 5: Commercial Flat Roof */}
                    <div className="border border-white/10 bg-white/[0.015] rounded-xl overflow-hidden">
                        <button
                            onClick={() => toggleFaq('faq-parkcity-commercial')}
                            className="w-full text-left p-5 flex justify-between items-center gap-4 hover:bg-white/[0.02] cursor-pointer"
                        >
                            <span className="text-sm sm:text-base font-bold text-white">
                                What commercial roofing systems and warranties does RHIVE offer in Park City?
                            </span>
                            <ChevronDown className={cn("w-4 h-4 text-rhive-pink transition-transform", openFaq === 'faq-parkcity-commercial' && "rotate-180")} />
                        </button>
                        {openFaq === 'faq-parkcity-commercial' && (
                            <div className="p-5 pt-0 space-y-3 border-t border-white/5">
                                <div className="p-3.5 rounded-lg bg-rhive-pink/10 border border-rhive-pink/20">
                                    <div className="text-xs font-mono font-bold text-rhive-pink uppercase mb-1 flex items-center gap-1.5">
                                        <Zap className="w-3.5 h-3.5" /> Direct Answer Summary
                                    </div>
                                    <p className="text-xs sm:text-sm text-white font-sans leading-relaxed">
                                        As a certified GAF commercial contractor, RHIVE installs GAF EverGuard® TPO and PVC single-ply membranes (60/80 mil), performs certified single-layer commercial layovers, and provides GAF No Dollar Limit (NDL) Guarantees for up to 30 years covering 100% of material and labor defect costs.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* FAQ 6: Asphalt Products */}
                    <div className="border border-white/10 bg-white/[0.015] rounded-xl overflow-hidden">
                        <button
                            onClick={() => toggleFaq('faq-parkcity-asphalt')}
                            className="w-full text-left p-5 flex justify-between items-center gap-4 hover:bg-white/[0.02] cursor-pointer"
                        >
                            <span className="text-sm sm:text-base font-bold text-white">
                                What asphalt shingle products does RHIVE install for Park City properties?
                            </span>
                            <ChevronDown className={cn("w-4 h-4 text-rhive-pink transition-transform", openFaq === 'faq-parkcity-asphalt' && "rotate-180")} />
                        </button>
                        {openFaq === 'faq-parkcity-asphalt' && (
                            <div className="p-5 pt-0 space-y-3 border-t border-white/5">
                                <div className="p-3.5 rounded-lg bg-rhive-pink/10 border border-rhive-pink/20">
                                    <div className="text-xs font-mono font-bold text-rhive-pink uppercase mb-1 flex items-center gap-1.5">
                                        <Zap className="w-3.5 h-3.5" /> Direct Answer Summary
                                    </div>
                                    <p className="text-xs sm:text-sm text-white font-sans leading-relaxed">
                                        We install Owens Corning Duration FLEX® Class 4 Impact Rated shingles, Duration® Series (130 MPH SureNail® warranty), and GAF Designer Shingles (Woodland® / Grand Sequoia®) backed by 50-year non-prorated material warranties.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* FAQ 7: Flat Membrane Specs */}
                    <div className="border border-white/10 bg-white/[0.015] rounded-xl overflow-hidden">
                        <button
                            onClick={() => toggleFaq('faq-parkcity-flat')}
                            className="w-full text-left p-5 flex justify-between items-center gap-4 hover:bg-white/[0.02] cursor-pointer"
                        >
                            <span className="text-sm sm:text-base font-bold text-white">
                                What are the technical specifications of RHIVE’s flat roof membrane installations in Park City?
                            </span>
                            <ChevronDown className={cn("w-4 h-4 text-rhive-pink transition-transform", openFaq === 'faq-parkcity-flat' && "rotate-180")} />
                        </button>
                        {openFaq === 'faq-parkcity-flat' && (
                            <div className="p-5 pt-0 space-y-3 border-t border-white/5">
                                <div className="p-3.5 rounded-lg bg-rhive-pink/10 border border-rhive-pink/20">
                                    <div className="text-xs font-mono font-bold text-rhive-pink uppercase mb-1 flex items-center gap-1.5">
                                        <Zap className="w-3.5 h-3.5" /> Direct Answer Summary
                                    </div>
                                    <p className="text-xs sm:text-sm text-white font-sans leading-relaxed">
                                        Our flat roofing assemblies feature GAF EverGuard® TPO/PVC membranes, mechanically attached Polyiso insulation (R-30+), custom-tapered boards around drains and scuppers to eliminate standing water, high-density DensDeck® gypsum cover boards, and fusion hot-air welded seams.
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
