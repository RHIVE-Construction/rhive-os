import React, { useEffect, useMemo, useState } from 'react';
import { Phone, Shield, ArrowRight, Zap, MapPin, ChevronDown, Wind, Building2, Layers, CheckCircle2, Wrench, Umbrella, Award } from 'lucide-react';
import { cn } from '../lib/utils';

export default function SaltLakeCityServiceAreaPage() {
    useEffect(() => {
        document.title = "Top-Rated Roofing Contractor Salt Lake City UT | RHIVE Construction";
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
            metaDesc = document.createElement('meta');
            metaDesc.setAttribute('name', 'description');
            document.head.appendChild(metaDesc);
        }
        metaDesc.setAttribute('content', "Top-rated residential & commercial roofing in Salt Lake City, UT. Owens Corning Duration 130 MPH shingles, GAF TPO/PVC flat roofs, 100% full tear-off, and lifetime guarantee.");
    }, []);

    const [openFaq, setOpenFaq] = useState<string | null>('faq-slc-wind');

    const handleEstimateClick = () => {
        window.location.href = '/estimate-tool';
    };

    const toggleFaq = (id: string) => {
        setOpenFaq(prev => prev === id ? null : id);
    };

    // Granular JSON-LD Schema for Salt Lake City, UT local SEO & AEO
    const jsonLdSchema = useMemo(() => {
        return {
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "RoofingContractor",
                    "@id": "https://www.rhiveconstruction.com/service-areas/salt-lake-city-ut/#localbusiness",
                    "name": "RHIVE Construction - Salt Lake City Service Area",
                    "url": "https://www.rhiveconstruction.com/service-areas/salt-lake-city-ut",
                    "logo": "https://i.imgur.com/t0VcSgJ.png",
                    "image": "https://i.imgur.com/t0VcSgJ.png",
                    "telephone": "+1-435-417-6637",
                    "email": "office@rhiveconstruction.com",
                    "priceRange": "$$$",
                    "description": "RHIVE Construction delivers precision-engineered residential roofing, commercial facility systems, high-performance asphalt shingles, and certified flat membrane installations across Salt Lake City, UT.",
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
                        "latitude": 40.7608,
                        "longitude": -111.8910
                    },
                    "areaServed": [
                        {"@type": "City", "name": "Salt Lake City"},
                        {"@type": "PostalCode", "postalCode": "84101"},
                        {"@type": "PostalCode", "postalCode": "84102"},
                        {"@type": "PostalCode", "postalCode": "84103"},
                        {"@type": "PostalCode", "postalCode": "84105"},
                        {"@type": "PostalCode", "postalCode": "84108"},
                        {"@type": "PostalCode", "postalCode": "84111"},
                        {"@type": "AdministrativeArea", "name": "Sugar House"},
                        {"@type": "AdministrativeArea", "name": "The Avenues"},
                        {"@type": "AdministrativeArea", "name": "Capitol Hill"},
                        {"@type": "AdministrativeArea", "name": "Rose Park"},
                        {"@type": "AdministrativeArea", "name": "East Bench"},
                        {"@type": "AdministrativeArea", "name": "Downtown SLC"},
                        {"@type": "AdministrativeArea", "name": "Federal Heights"},
                        {"@type": "AdministrativeArea", "name": "Harvard-Yale District"}
                    ]
                },
                {
                    "@type": "FAQPage",
                    "@id": "https://www.rhiveconstruction.com/service-areas/salt-lake-city-ut/#faqpage",
                    "mainEntity": [
                        {
                            "@type": "Question",
                            "name": "How does RHIVE protect Salt Lake City homes from urban canyon wind shears and freeze-thaw cycles?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "We install Owens Corning Duration® shingles with patented SureNail® Technology. The embedded woven fabric strip prevents nail pull-through during high-wind events, holding a certified 130 MPH wind uplift rating when installed with our 6-nail fastening pattern."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "Can commercial buildings in downtown Salt Lake City qualify for a flat roof layover?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "Yes. Utah building code permits a single-layer commercial layover if the existing membrane and insulation are dry and structurally sound. RHIVE heat-welds a new GAF TPO or PVC membrane over new cover boards, backed by up to 30-year GAF NDL warranties."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "How does the RHIVE Project Savings Promotion (RPSP) benefit Salt Lake City homeowners?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "The RPSP provides an immediate 10% credit (up to $1,000 for residential / $3,000 for commercial) for decisions made within the presentation window by stripping out chase costs and administrative overhead. Homeowners retain their full 3-day statutory right of rescission with zero risk."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "What is RHIVE’s residential reroofing standard for Salt Lake City single-family homes?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "RHIVE enforces a strict 100% full tear-off policy down to bare OSB decking on all single-family residential replacements in Salt Lake City. Every replacement includes ProArmor® synthetic underlayment, 6+ ft WeatherLock® Ice & Water Shield, 6-nail fastening, and 100 sq ft free OSB decking replacement."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "What commercial roofing options does RHIVE install in Salt Lake City?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "RHIVE delivers turnkey commercial roofing across Salt Lake City, engineering both commercial steep-slope architectural shingles (churches, banks, multi-family) and heat-welded GAF EverGuard® TPO and PVC single-ply flat membranes with Polyiso insulation and DensDeck® cover boards, backed by GAF NDL warranties up to 30 years."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "What asphalt shingle products does RHIVE install for Salt Lake City properties?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "RHIVE installs Owens Corning Duration® Series (130 MPH wind uplift), Duration FLEX® Class 4 Impact Rated shingles for hail protection and insurance discounts, and GAF Designer Shingles (Woodland®/Grand Sequoia®) for historic craftsman aesthetics."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "Does Salt Lake City require a building permit for residential reroofing?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "Yes. Salt Lake City Community Development Department requires permits for all complete reroofing projects. RHIVE manages 100% of the municipal permitting process and schedules on-site city inspections to verify complete code compliance."
                            }
                        }
                    ]
                }
            ]
        };
    }, []);

    return (
        <div className="relative min-h-screen bg-black text-gray-100 selection:bg-[#ec028b] selection:text-white pb-24">
            {/* Inject Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
            />

            {/* HERO SECTION */}
            <section className="relative pt-12 pb-20 overflow-hidden border-b border-gray-800">
                <div className="absolute inset-0 bg-gradient-to-b from-pink-950/20 via-transparent to-black pointer-events-none" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
                        <div className="max-w-3xl space-y-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-400 text-xs font-mono uppercase tracking-widest">
                                <MapPin className="w-3.5 h-3.5" /> Salt Lake City, Utah Master Roofing Systems
                            </div>
                            
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight font-sans">
                                Solving Salt Lake City's Toughest <span className="text-[#ec028b]">Urban Canyon Wind</span> & Severe Alpine Snowmelt Challenges
                            </h1>

                            <p className="text-lg sm:text-xl text-gray-300 font-serif leading-relaxed max-w-[70ch]">
                                As Utah's state capital and central metropolitan hub, Salt Lake City properties endure severe downslope canyon winds, heavy winter lake-effect snowpack, and rapid freeze-thaw cycles fluctuating over 80°F in a single day. RHIVE Construction engineers roofs with Owens Corning Duration® 130 MPH SureNail® shingles, GAF EverGuard® TPO/PVC flat membranes, and our direct Lifetime Installer No-Leak Guarantee.
                            </p>

                            <div className="flex flex-wrap gap-4 pt-2">
                                <button
                                    onClick={handleEstimateClick}
                                    className="px-8 py-4 bg-[#ec028b] hover:bg-[#d0027a] text-white font-bold text-base rounded-md transition-all duration-200 shadow-lg shadow-pink-500/20 flex items-center gap-3 cursor-pointer"
                                >
                                    <span>Get Instant Salt Lake City Estimate</span>
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                                
                                <a
                                    href="tel:4354176637"
                                    className="px-6 py-4 bg-gray-900/90 hover:bg-gray-800 text-gray-200 font-semibold text-base rounded-md border border-gray-700 transition-all duration-200 flex items-center gap-3"
                                >
                                    <Phone className="w-5 h-5 text-[#ec028b]" />
                                    <span>(435) 417-6637</span>
                                </a>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-gray-800/80">
                                <div className="space-y-1">
                                    <div className="text-sm font-bold text-white flex items-center gap-1.5">
                                        <Wind className="w-4 h-4 text-[#ec028b]" /> 130 MPH
                                    </div>
                                    <p className="text-xs text-gray-400">SureNail® Wind Uplift</p>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-sm font-bold text-white flex items-center gap-1.5">
                                        <Layers className="w-4 h-4 text-[#ec028b]" /> 100% Tear-Off
                                    </div>
                                    <p className="text-xs text-gray-400">Zero Residential Layovers</p>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-sm font-bold text-white flex items-center gap-1.5">
                                        <Shield className="w-4 h-4 text-[#ec028b]" /> 50-Year
                                    </div>
                                    <p className="text-xs text-gray-400">Non-Prorated Warranty</p>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-sm font-bold text-white flex items-center gap-1.5">
                                        <Zap className="w-4 h-4 text-[#ec028b]" /> &lt;10% Admin
                                    </div>
                                    <p className="text-xs text-gray-400">Zero Middleman Markup</p>
                                </div>
                            </div>
                        </div>

                        {/* Visual Highlight Badge */}
                        <div className="w-full lg:w-96 bg-gray-950/80 border border-gray-800 p-6 rounded-xl relative">
                            <div className="absolute -top-3 -right-3 bg-[#ec028b] text-white text-xs font-mono font-bold px-3 py-1 rounded">
                                SLC METRO HUB
                            </div>
                            <h3 className="text-lg font-bold text-white mb-3">Salt Lake City Micro-Climate Profile</h3>
                            <ul className="space-y-3 text-xs text-gray-300">
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-[#ec028b] shrink-0 mt-0.5" />
                                    <span><strong>Urban Canyon Winds:</strong> Downslope canyon gusts sweep through East Bench and downtown high-rises.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-[#ec028b] shrink-0 mt-0.5" />
                                    <span><strong>Lake-Effect Snow:</strong> Heavy snow retention on shaded north-facing slopes and historic rooflines.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-[#ec028b] shrink-0 mt-0.5" />
                                    <span><strong>Freeze-Thaw Swings:</strong> 80°F+ single-day temperature fluctuations stress decking and seams.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-[#ec028b] shrink-0 mt-0.5" />
                                    <span><strong>Historic Architecture:</strong> Strict craftsman aesthetics in Sugar House, Avenues, & Harvard-Yale.</span>
                                </li>
                            </ul>
                            <div className="mt-6 pt-4 border-t border-gray-800 text-center">
                                <span className="text-xs text-gray-400 font-mono">Permitting: Salt Lake City Community Development</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* MAIN CONTENT CONTAINER */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 space-y-20">

                {/* PART 1: LOCATION-SPECIFIC CONTENT */}
                <section className="bg-gray-950/60 border border-gray-800 p-8 sm:p-10 rounded-xl space-y-8">
                    <div className="space-y-3">
                        <div className="text-xs font-mono text-[#ec028b] uppercase tracking-wider">Part 1: Regional Specifications</div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-white">Salt Lake City Environmental Factors & RHIVE Brand Commitment</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm sm:text-base text-gray-300 font-serif leading-relaxed">
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-white font-sans flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-[#ec028b]" /> Regional Environmental Factors & Local Footprint
                            </h3>
                            <p>
                                Salt Lake City features a complex mix of historic craftsman homes, East Bench foothill estates, and major commercial complexes along State Street and I-15. Heavy winter snowpack on shaded roof slopes leads to chronic eave ice damming, which forces meltwater upward beneath standard shingles unless prevented by continuous waterproofing barriers.
                            </p>
                            <p>
                                Full roof replacements in Salt Lake City require municipal building permits issued through the Salt Lake City Community Development Department. RHIVE Construction manages 100% of the permitting process, ensuring strict adherence to local building codes, perimeter 28-gauge steel drip metal specifications, and eave ice barrier extensions.
                            </p>
                            <p className="text-xs text-gray-400 font-mono">
                                Neighborhood Footprint: Sugar House, The Avenues, Capitol Hill, Rose Park, East Bench, Downtown SLC, Federal Heights, and the Harvard-Yale district.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-white font-sans flex items-center gap-2">
                                <Award className="w-5 h-5 text-[#ec028b]" /> Radical Transparency & Community Mission
                            </h3>
                            <p>
                                Co-founded by <strong>Kara Robinson (President)</strong> and <strong>Michael Robinson (CEO)</strong>, RHIVE Construction is a female-owned and operated contractor bringing radical cost transparency to Salt Lake City. By utilizing AI automation and eliminating physical warehouse overhead, we keep administrative expenses <strong>under 10%</strong>.
                            </p>
                            <p>
                                Every quote provides an itemized mathematical breakdown showing exact costs for <strong>Materials, Labor, Operating Overhead, and Net Company Profit</strong>. Guided by our slogan <strong>"Finish On Top"</strong> and our ongoing mission of donating complete roof replacements to local veterans, teachers, and first responders, Salt Lake City property owners receive master-craftsman quality without salesman markups.
                            </p>
                        </div>
                    </div>
                </section>

                {/* PART 2: RESIDENTIAL ROOFING */}
                <section className="bg-gray-950/60 border border-gray-800 p-8 sm:p-10 rounded-xl space-y-8">
                    <div className="space-y-3">
                        <div className="text-xs font-mono text-[#ec028b] uppercase tracking-wider">Part 2: Residential Solutions</div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-white">Residential Roofing Standards for Salt Lake City Homes</h2>
                    </div>

                    <div className="p-6 rounded-lg bg-pink-500/10 border border-pink-500/20 text-gray-200">
                        <h3 className="text-base font-bold text-white font-sans mb-2">Q: What is RHIVE’s residential reroofing standard for Salt Lake City single-family homes?</h3>
                        <p className="font-serif text-sm sm:text-base text-gray-300 leading-relaxed">
                            <strong>A:</strong> RHIVE enforces a strict <strong>100% full tear-off policy</strong> down to bare OSB decking on all single-family residential replacements in Salt Lake City. We never perform residential layovers because covering old shingles traps heat, conceals structural wood rot, adds excessive weight, and voids manufacturer system warranties.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-5 rounded-lg bg-gray-900 border border-gray-800 space-y-2">
                            <h4 className="text-sm font-bold text-white">Synthetic Field Protection</h4>
                            <p className="text-xs text-gray-400 font-serif leading-relaxed">
                                100% field coverage with <strong>Owens Corning ProArmor®</strong> synthetic underlayment as a secondary water-shedding barrier.
                            </p>
                        </div>
                        <div className="p-5 rounded-lg bg-gray-900 border border-gray-800 space-y-2">
                            <h4 className="text-sm font-bold text-white">6+ Ft Ice & Water Shield</h4>
                            <p className="text-xs text-gray-400 font-serif leading-relaxed">
                                A minimum of 6 feet of self-adhering <strong>Owens Corning WeatherLock®</strong> installed continuously along all eaves and valleys.
                            </p>
                        </div>
                        <div className="p-5 rounded-lg bg-gray-900 border border-gray-800 space-y-2">
                            <h4 className="text-sm font-bold text-white">Decking Replacement Included</h4>
                            <p className="text-xs text-gray-400 font-serif leading-relaxed">
                                Up to <strong>100 sq ft of 7/16 OSB decking replacement included</strong> at no extra charge if wood rot is discovered during tear-off ($72.50/sheet after).
                            </p>
                        </div>
                    </div>

                    <div className="text-xs text-gray-400 border-t border-gray-800/80 pt-4 flex flex-wrap justify-between items-center gap-4">
                        <span><strong>Milestone Schedule:</strong> 50% Deposit | 40% Install Day | 10% Final Completion</span>
                        <span><strong>Protections:</strong> 3-Day Right of Rescission | RPSP 10% Credit (up to $1,000) | Lifetime Installer No-Leak Guarantee</span>
                    </div>
                </section>

                {/* PART 3: COMMERCIAL ROOFING */}
                <section className="bg-gray-950/60 border border-gray-800 p-8 sm:p-10 rounded-xl space-y-8">
                    <div className="space-y-3">
                        <div className="text-xs font-mono text-[#ec028b] uppercase tracking-wider">Part 3: Commercial Roofing Solutions</div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-white">Commercial Roofing Services & GAF NDL Warranties</h2>
                    </div>

                    <div className="p-6 rounded-lg bg-pink-500/10 border border-pink-500/20 text-gray-200">
                        <h3 className="text-base font-bold text-white font-sans mb-2">Q: What commercial roofing systems does RHIVE install for Salt Lake City commercial facilities?</h3>
                        <p className="font-serif text-sm sm:text-base text-gray-300 leading-relaxed">
                            <strong>A:</strong> RHIVE delivers comprehensive commercial roofing solutions across Salt Lake City for retail centers, corporate office parks, industrial facilities, churches, banks, and multi-family communities. We engineer and install both <strong>commercial steep-slope architectural shingle systems</strong> (for multi-family, churches, and steep-slope offices) and <strong>certified single-ply flat membrane systems</strong> (TPO/PVC) backed by certified Master Service Agreements (MSAs) and GAF manufacturer warranties.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-5 rounded-lg bg-gray-900 border border-gray-800 space-y-2">
                            <h4 className="text-sm font-bold text-white">Commercial Code Layover</h4>
                            <p className="text-xs text-gray-400 font-serif leading-relaxed">
                                Under active Utah building codes, single-layer commercial layovers are permitted when underlying decking and insulation are structurally sound and moisture-free, reducing tear-off expenses.
                            </p>
                        </div>
                        <div className="p-5 rounded-lg bg-gray-900 border border-gray-800 space-y-2">
                            <h4 className="text-sm font-bold text-white">GAF NDL Guarantees</h4>
                            <p className="text-xs text-gray-400 font-serif leading-relaxed">
                                Commercial installations qualify for <strong>GAF No Dollar Limit (NDL) Guarantees up to 30 years</strong>, covering 100% of material and labor defect costs with zero payout caps.
                            </p>
                        </div>
                        <div className="p-5 rounded-lg bg-gray-900 border border-gray-800 space-y-2">
                            <h4 className="text-sm font-bold text-white">Commercial RPSP Credit</h4>
                            <p className="text-xs text-gray-400 font-serif leading-relaxed">
                                Commercial accounts operate under custom MSAs and qualify for our <strong>Commercial RPSP 10% credit up to $3,000</strong> for estimates approved within 7 days.
                            </p>
                        </div>
                    </div>
                </section>

                {/* PART 4: ASPHALT ROOFING */}
                <section className="bg-gray-950/60 border border-gray-800 p-8 sm:p-10 rounded-xl space-y-8">
                    <div className="space-y-3">
                        <div className="text-xs font-mono text-[#ec028b] uppercase tracking-wider">Part 4: Asphalt Shingle Technology</div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-white">Owens Corning Duration® & High-Performance Asphalt Systems</h2>
                    </div>

                    <div className="p-6 rounded-lg bg-pink-500/10 border border-pink-500/20 text-gray-200">
                        <h3 className="text-base font-bold text-white font-sans mb-2">Q: What asphalt shingle products does RHIVE install for Salt Lake City properties?</h3>
                        <p className="font-serif text-sm sm:text-base text-gray-300 leading-relaxed">
                            <strong>A:</strong> RHIVE Construction is an Owens Corning Preferred Contractor installing the <strong>Duration® Series</strong> with patented <strong>SureNail® Technology</strong> (130 MPH wind uplift rating), <strong>Duration FLEX®</strong> SBS polymer-modified Class 4 Impact Rated shingles for hail resistance and insurance premium discounts, and <strong>GAF Designer Shingles</strong> (Woodland® / Grand Sequoia®) for historic craftsman aesthetics backed by 50-year non-prorated warranties.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="p-4 rounded-lg bg-gray-900/80 border border-gray-800">
                            <h4 className="text-sm font-bold text-white mb-1">SureNail® Band</h4>
                            <p className="text-xs text-gray-400">Embedded woven fabric strip delivering certified 130 MPH wind uplift resistance.</p>
                        </div>
                        <div className="p-4 rounded-lg bg-gray-900/80 border border-gray-800">
                            <h4 className="text-sm font-bold text-white mb-1">Duration FLEX® Class 4</h4>
                            <p className="text-xs text-gray-400">Rubberized SBS polymer-modified asphalt absorbs impacts and qualifies for insurance discounts.</p>
                        </div>
                        <div className="p-4 rounded-lg bg-gray-900/80 border border-gray-800">
                            <h4 className="text-sm font-bold text-white mb-1">GAF Designer Shingles</h4>
                            <p className="text-xs text-gray-400">Woodland® and Grand Sequoia® hand-cut dimensional aesthetics for historic Salt Lake homes.</p>
                        </div>
                        <div className="p-4 rounded-lg bg-gray-900/80 border border-gray-800">
                            <h4 className="text-sm font-bold text-white mb-1">50-Year Non-Prorated</h4>
                            <p className="text-xs text-gray-400">Owens Corning Preferred Protection 50-year non-prorated material coverage.</p>
                        </div>
                    </div>
                </section>

                {/* PART 5: FLAT ROOFING */}
                <section className="bg-gray-950/60 border border-gray-800 p-8 sm:p-10 rounded-xl space-y-8">
                    <div className="space-y-3">
                        <div className="text-xs font-mono text-[#ec028b] uppercase tracking-wider">Part 5: Membrane Specifications</div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-white">GAF EverGuard® TPO, PVC & Tapered Polyiso Assemblies</h2>
                    </div>

                    <div className="p-6 rounded-lg bg-pink-500/10 border border-pink-500/20 text-gray-200">
                        <h3 className="text-base font-bold text-white font-sans mb-2">Q: What are the technical specifications of RHIVE’s flat roof membrane installations in Salt Lake City?</h3>
                        <p className="font-serif text-sm sm:text-base text-gray-300 leading-relaxed">
                            <strong>A:</strong> RHIVE installs <strong>GAF EverGuard® TPO (60/80 mil)</strong> reflective white Energy Star membranes to cut HVAC cooling costs, and <strong>GAF EverGuard® PVC (60/80 mil)</strong> for high chemical, grease, and fire resistance. The assembly includes mechanically attached Polyiso insulation, custom-tapered boards around drains and scuppers to eliminate ponding water, high-density DensDeck® gypsum cover boards, and fusion hot-air welded seams.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                        <div className="p-4 rounded-lg bg-gray-900 border border-gray-800 space-y-1">
                            <span className="font-bold text-white block">GAF EverGuard® TPO</span>
                            <span className="text-gray-400">60/80 mil reflective white membrane reducing urban heat island cooling loads.</span>
                        </div>
                        <div className="p-4 rounded-lg bg-gray-900 border border-gray-800 space-y-1">
                            <span className="font-bold text-white block">GAF EverGuard® PVC</span>
                            <span className="text-gray-400">Formulated for extreme chemical, grease, and restaurant exhaust resistance.</span>
                        </div>
                        <div className="p-4 rounded-lg bg-gray-900 border border-gray-800 space-y-1">
                            <span className="font-bold text-white block">Tapered Polyiso Boards</span>
                            <span className="text-gray-400">Custom slope engineered around drains and scuppers to prevent ponding.</span>
                        </div>
                        <div className="p-4 rounded-lg bg-gray-900 border border-gray-800 space-y-1">
                            <span className="font-bold text-white block">DensDeck® Cover Boards</span>
                            <span className="text-gray-400">High-density gypsum cover boards delivering superior puncture and hail defense.</span>
                        </div>
                    </div>
                </section>

                {/* FAQ ACCORDION HUB (AEO / SEO) */}
                <section className="bg-gray-950/80 border border-gray-800 p-8 sm:p-10 rounded-xl space-y-8">
                    <div className="text-center max-w-3xl mx-auto space-y-3">
                        <div className="text-xs font-mono text-[#ec028b] uppercase tracking-wider">AEO & Direct Answers</div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-white">Frequently Asked Questions: Salt Lake City Roofing</h2>
                        <p className="text-sm text-gray-400 font-serif">
                            Direct answers to common questions asked by homeowners and commercial property managers in Salt Lake City, Utah.
                        </p>
                    </div>

                    <div className="space-y-4 max-w-4xl mx-auto">
                        {/* FAQ 1 */}
                        <div className="border border-gray-800 rounded-lg overflow-hidden">
                            <button
                                onClick={() => toggleFaq('faq-slc-wind')}
                                className="w-full p-5 text-left bg-gray-900/90 hover:bg-gray-900 flex justify-between items-center transition-colors cursor-pointer"
                            >
                                <span className="font-bold text-sm sm:text-base text-white">How does RHIVE protect Salt Lake City homes from urban canyon wind shears and freeze-thaw cycles?</span>
                                <ChevronDown className={cn("w-5 h-5 text-[#ec028b] transition-transform duration-200", openFaq === 'faq-slc-wind' ? "rotate-180" : "")} />
                            </button>
                            {openFaq === 'faq-slc-wind' && (
                                <div className="p-5 bg-black/60 border-t border-gray-800 space-y-3">
                                    <div className="p-3 bg-pink-500/10 border border-pink-500/20 rounded text-xs text-pink-300 font-mono">
                                        DIRECT ANSWER: We install Owens Corning Duration® shingles with patented SureNail® Technology, holding a certified 130 MPH wind uplift rating with our 6-nail fastening pattern.
                                    </div>
                                    <p className="text-sm text-gray-300 font-serif leading-relaxed">
                                        Downslope winds off the Wasatch foothills sweep through East Bench and downtown corridors. The woven fabric strip embedded in the fastening zone creates a dual-bond gripping zone that prevents nail pull-through during severe wind gusts.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* FAQ 2 */}
                        <div className="border border-gray-800 rounded-lg overflow-hidden">
                            <button
                                onClick={() => toggleFaq('faq-slc-layover')}
                                className="w-full p-5 text-left bg-gray-900/90 hover:bg-gray-900 flex justify-between items-center transition-colors cursor-pointer"
                            >
                                <span className="font-bold text-sm sm:text-base text-white">Can commercial buildings in downtown Salt Lake City qualify for a flat roof layover?</span>
                                <ChevronDown className={cn("w-5 h-5 text-[#ec028b] transition-transform duration-200", openFaq === 'faq-slc-layover' ? "rotate-180" : "")} />
                            </button>
                            {openFaq === 'faq-slc-layover' && (
                                <div className="p-5 bg-black/60 border-t border-gray-800 space-y-3">
                                    <div className="p-3 bg-pink-500/10 border border-pink-500/20 rounded text-xs text-pink-300 font-mono">
                                        DIRECT ANSWER: Yes. Utah building code permits a single-layer commercial layover if the existing insulation and decking are dry and structurally sound.
                                    </div>
                                    <p className="text-sm text-gray-300 font-serif leading-relaxed">
                                        RHIVE heat-welds a new GAF TPO or PVC membrane over new cover boards, saving building owners significant tear-off and disposal costs while qualifying for up to 30-year GAF NDL warranties.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* FAQ 3 */}
                        <div className="border border-gray-800 rounded-lg overflow-hidden">
                            <button
                                onClick={() => toggleFaq('faq-slc-rpsp')}
                                className="w-full p-5 text-left bg-gray-900/90 hover:bg-gray-900 flex justify-between items-center transition-colors cursor-pointer"
                            >
                                <span className="font-bold text-sm sm:text-base text-white">How does the RHIVE Project Savings Promotion (RPSP) benefit Salt Lake City homeowners?</span>
                                <ChevronDown className={cn("w-5 h-5 text-[#ec028b] transition-transform duration-200", openFaq === 'faq-slc-rpsp' ? "rotate-180" : "")} />
                            </button>
                            {openFaq === 'faq-slc-rpsp' && (
                                <div className="p-5 bg-black/60 border-t border-gray-800 space-y-3">
                                    <div className="p-3 bg-pink-500/10 border border-pink-500/20 rounded text-xs text-pink-300 font-mono">
                                        DIRECT ANSWER: The RPSP provides an immediate 10% credit (up to $1,000 for residential / $3,000 for commercial) for decisions made within the presentation window.
                                    </div>
                                    <p className="text-sm text-gray-300 font-serif leading-relaxed">
                                        By deciding within the initial presentation window, we eliminate administrative chase costs and pass 100% of those savings directly back to you. Homeowners retain their full 3-day statutory right of rescission with zero financial risk.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* FAQ 4 */}
                        <div className="border border-gray-800 rounded-lg overflow-hidden">
                            <button
                                onClick={() => toggleFaq('faq-slc-tearoff')}
                                className="w-full p-5 text-left bg-gray-900/90 hover:bg-gray-900 flex justify-between items-center transition-colors cursor-pointer"
                            >
                                <span className="font-bold text-sm sm:text-base text-white">What is RHIVE’s residential reroofing standard for Salt Lake City single-family homes?</span>
                                <ChevronDown className={cn("w-5 h-5 text-[#ec028b] transition-transform duration-200", openFaq === 'faq-slc-tearoff' ? "rotate-180" : "")} />
                            </button>
                            {openFaq === 'faq-slc-tearoff' && (
                                <div className="p-5 bg-black/60 border-t border-gray-800 space-y-3">
                                    <div className="p-3 bg-pink-500/10 border border-pink-500/20 rounded text-xs text-pink-300 font-mono">
                                        DIRECT ANSWER: RHIVE enforces a strict 100% full tear-off policy down to bare OSB decking on all single-family residential replacements in Salt Lake City.
                                    </div>
                                    <p className="text-sm text-gray-300 font-serif leading-relaxed">
                                        We never perform residential layovers. Every project includes ProArmor® synthetic underlayment, 6+ feet of WeatherLock® Ice & Water Shield, 6-nail fastening, and up to 100 sq ft of free OSB decking replacement.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* FAQ 5 */}
                        <div className="border border-gray-800 rounded-lg overflow-hidden">
                            <button
                                onClick={() => toggleFaq('faq-slc-commercial')}
                                className="w-full p-5 text-left bg-gray-900/90 hover:bg-gray-900 flex justify-between items-center transition-colors cursor-pointer"
                            >
                                <span className="font-bold text-sm sm:text-base text-white">What single-ply commercial flat roof options does RHIVE install in Salt Lake City?</span>
                                <ChevronDown className={cn("w-5 h-5 text-[#ec028b] transition-transform duration-200", openFaq === 'faq-slc-commercial' ? "rotate-180" : "")} />
                            </button>
                            {openFaq === 'faq-slc-commercial' && (
                                <div className="p-5 bg-black/60 border-t border-gray-800 space-y-3">
                                    <div className="p-3 bg-pink-500/10 border border-pink-500/20 rounded text-xs text-pink-300 font-mono">
                                        DIRECT ANSWER: We install heat-welded GAF EverGuard® TPO and PVC single-ply membranes in 60 mil and heavy-duty 80 mil specifications.
                                    </div>
                                    <p className="text-sm text-gray-300 font-serif leading-relaxed">
                                        Flat systems feature mechanically attached Polyiso insulation, tapered boards around scuppers and drains to eliminate ponding water, and DensDeck® gypsum cover boards backed by GAF NDL warranties up to 30 years.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* FAQ 6 */}
                        <div className="border border-gray-800 rounded-lg overflow-hidden">
                            <button
                                onClick={() => toggleFaq('faq-slc-shingles')}
                                className="w-full p-5 text-left bg-gray-900/90 hover:bg-gray-900 flex justify-between items-center transition-colors cursor-pointer"
                            >
                                <span className="font-bold text-sm sm:text-base text-white">What asphalt shingle products does RHIVE install for Salt Lake City properties?</span>
                                <ChevronDown className={cn("w-5 h-5 text-[#ec028b] transition-transform duration-200", openFaq === 'faq-slc-shingles' ? "rotate-180" : "")} />
                            </button>
                            {openFaq === 'faq-slc-shingles' && (
                                <div className="p-5 bg-black/60 border-t border-gray-800 space-y-3">
                                    <div className="p-3 bg-pink-500/10 border border-pink-500/20 rounded text-xs text-pink-300 font-mono">
                                        DIRECT ANSWER: We install Owens Corning Duration® (130 MPH SureNail®), Duration FLEX® Class 4 Impact Rated shingles, and GAF Designer Shingles.
                                    </div>
                                    <p className="text-sm text-gray-300 font-serif leading-relaxed">
                                        All asphalt installations include Starter Strip Plus along eaves, Pro-Edge® / DuraRidge® cap shingles, and 50 years of non-prorated material warranty coverage.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* FAQ 7 */}
                        <div className="border border-gray-800 rounded-lg overflow-hidden">
                            <button
                                onClick={() => toggleFaq('faq-slc-permits')}
                                className="w-full p-5 text-left bg-gray-900/90 hover:bg-gray-900 flex justify-between items-center transition-colors cursor-pointer"
                            >
                                <span className="font-bold text-sm sm:text-base text-white">Does Salt Lake City require a building permit for residential reroofing?</span>
                                <ChevronDown className={cn("w-5 h-5 text-[#ec028b] transition-transform duration-200", openFaq === 'faq-slc-permits' ? "rotate-180" : "")} />
                            </button>
                            {openFaq === 'faq-slc-permits' && (
                                <div className="p-5 bg-black/60 border-t border-gray-800 space-y-3">
                                    <div className="p-3 bg-pink-500/10 border border-pink-500/20 rounded text-xs text-pink-300 font-mono">
                                        DIRECT ANSWER: Yes. Salt Lake City Community Development Department requires permits for all complete reroofs. RHIVE manages 100% of the permitting process.
                                    </div>
                                    <p className="text-sm text-gray-300 font-serif leading-relaxed">
                                        We ensure compliance with local Utah energy codes, eave ice damming protection rules, and perimeter metal flashings, and we coordinate all municipal inspections.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* BOTTOM CALL TO ACTION */}
                <section className="bg-gradient-to-r from-pink-950/40 via-black to-pink-950/40 border border-pink-500/30 p-10 sm:p-12 rounded-2xl text-center space-y-6">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-sans">
                        Protect Your Salt Lake City Property with Master-Craftsman Precision
                    </h2>
                    <p className="text-gray-300 font-serif max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
                        Get an itemized mathematical estimate with zero salesman pressure, backed by our Lifetime Installer No-Leak Guarantee and 50-year non-prorated material protection.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4 pt-2">
                        <button
                            onClick={handleEstimateClick}
                            className="px-8 py-4 bg-[#ec028b] hover:bg-[#d0027a] text-white font-bold text-base rounded-md transition-all duration-200 shadow-lg shadow-pink-500/20 cursor-pointer flex items-center gap-3"
                        >
                            <span>Calculate Your Instant Salt Lake City Estimate</span>
                            <ArrowRight className="w-5 h-5" />
                        </button>
                        <a
                            href="tel:4354176637"
                            className="px-6 py-4 bg-gray-900 hover:bg-gray-800 text-gray-200 font-semibold text-base rounded-md border border-gray-700 transition-all duration-200 flex items-center gap-3"
                        >
                            <Phone className="w-5 h-5 text-[#ec028b]" />
                            <span>(435) 417-6637</span>
                        </a>
                    </div>
                </section>

            </main>
        </div>
    );
}
