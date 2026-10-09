import React, { useEffect, useMemo, useState } from 'react';
import { Phone, Shield, ArrowRight, Zap, MapPin, ChevronDown, Wind, Building2, Layers, CheckCircle2, Wrench, Umbrella, Award } from 'lucide-react';
import { cn } from '../lib/utils';

export default function TooeleServiceAreaPage() {
    useEffect(() => {
        document.title = "Top-Rated Roofing Contractor Tooele UT | RHIVE Construction";
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
            metaDesc = document.createElement('meta');
            metaDesc.setAttribute('name', 'description');
            document.head.appendChild(metaDesc);
        }
        metaDesc.setAttribute('content', "Expert residential & commercial roofing in Tooele, UT & Tooele Valley. Owens Corning Duration 130 MPH shingles, GAF TPO flat roofs, 100% full tear-off, and lifetime guarantees.");
    }, []);

    const [openFaq, setOpenFaq] = useState<string | null>('faq-tooele-wind');

    const handleEstimateClick = () => {
        window.location.href = '/estimate-tool';
    };

    const toggleFaq = (id: string) => {
        setOpenFaq(prev => prev === id ? null : id);
    };

    // Granular JSON-LD Schema for Tooele, UT local SEO & AEO
    const jsonLdSchema = useMemo(() => {
        return {
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "RoofingContractor",
                    "@id": "https://www.rhiveconstruction.com/service-areas/tooele-ut/#localbusiness",
                    "name": "RHIVE Construction - Tooele Service Area",
                    "url": "https://www.rhiveconstruction.com/service-areas/tooele-ut",
                    "logo": "https://i.imgur.com/t0VcSgJ.png",
                    "image": "https://i.imgur.com/t0VcSgJ.png",
                    "telephone": "+1-435-417-6637",
                    "email": "office@rhiveconstruction.com",
                    "priceRange": "$$$",
                    "description": "RHIVE Construction delivers precision-engineered residential roofing, commercial facility systems, high-performance asphalt shingles, and certified flat membrane installations across Tooele, UT and Tooele County.",
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
                        "latitude": 40.5308,
                        "longitude": -112.2983
                    },
                    "areaServed": [
                        {"@type": "City", "name": "Tooele"},
                        {"@type": "PostalCode", "postalCode": "84074"},
                        {"@type": "AdministrativeArea", "name": "Historic Downtown Tooele"},
                        {"@type": "AdministrativeArea", "name": "Settlement Canyon Foothills"},
                        {"@type": "AdministrativeArea", "name": "Overlake"},
                        {"@type": "AdministrativeArea", "name": "North Tooele"},
                        {"@type": "AdministrativeArea", "name": "Copper Country Foothills"},
                        {"@type": "AdministrativeArea", "name": "Stansbury Park Boundary"}
                    ]
                },
                {
                    "@type": "FAQPage",
                    "@id": "https://www.rhiveconstruction.com/service-areas/tooele-ut/#faqpage",
                    "mainEntity": [
                        {
                            "@type": "Question",
                            "name": "How does RHIVE protect Tooele homes against severe mountain wind shears?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "We install Owens Corning Duration® shingles featuring patented SureNail® Technology. The embedded woven fabric strip prevents nail pull-through during high-wind events, holding a certified 130 MPH wind uplift rating when installed with our 6-nail fastening pattern."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "Why are continuous custom rain gutters essential for Tooele properties?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "Proper water diversion prevents soil erosion and foundation damage during intense desert rainstorms and winter snowmelt. RHIVE custom-extrudes continuous heavy-gauge 5-inch and 6-inch aluminum rain gutters on-site, spacing hidden screw-in hangers tightly at every 24 inches to support heavy snow loads."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "What guarantees protect Tooele property owners against installation leaks?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "In addition to Owens Corning 50-year non-prorated material warranties, RHIVE backs every replacement with our direct Lifetime Installer No-Leak Guarantee—if our installation causes a leak, we repair it 100% free of charge."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "What is RHIVE’s residential reroofing standard for Tooele single-family homes?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "RHIVE enforces a strict 100% full tear-off policy down to bare OSB decking on all single-family reroofs in Tooele. Every replacement includes ProArmor® synthetic underlayment, 6+ ft WeatherLock® Ice & Water Shield, 6-nail fastening, and 100 sq ft free OSB decking replacement."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "What commercial roofing solutions does RHIVE provide in Tooele?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "As a certified GAF commercial installer, RHIVE installs heat-welded GAF EverGuard® TPO and PVC single-ply membranes in 60 mil and heavy-duty 80 mil specifications with Polyiso insulation and DensDeck® cover boards, backed by GAF NDL warranties up to 30 years."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "What asphalt shingle products does RHIVE install in Tooele?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "RHIVE installs Owens Corning Duration® Series (130 MPH SureNail® wind uplift), Duration FLEX® Class 4 Impact Rated shingles for hail and storm protection, and GAF Designer Shingles (Woodland®/Grand Sequoia®) for dimensional beauty."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "Does Tooele require a building permit for residential reroofing?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "Yes. Full roof replacements in Tooele require municipal building permits through the City of Tooele Community Development Department or Tooele County. RHIVE manages 100% of the municipal permitting process to ensure complete building code compliance."
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
                                <MapPin className="w-3.5 h-3.5" /> Tooele & Oquirrh Valley Master Roofing Systems
                            </div>
                            
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight font-sans">
                                Solving Tooele's Toughest <span className="text-[#ec028b]">High-Desert Mountain Wind</span> & Lake-Effect Freeze-Thaw Challenges
                            </h1>

                            <p className="text-lg sm:text-xl text-gray-300 font-serif leading-relaxed max-w-[70ch]">
                                Situated in Tooele Valley between the Stansbury and Oquirrh mountains, Tooele properties face severe downslope canyon wind shears, Great Salt Lake lake-effect snowstorms, and rapid freeze-thaw cycles. RHIVE Construction engineers roofs with Owens Corning Duration® 130 MPH SureNail® shingles, Class 4 Impact Rated shingles, GAF EverGuard® TPO/PVC flat membranes, and our direct Lifetime Installer No-Leak Guarantee.
                            </p>

                            <div className="flex flex-wrap gap-4 pt-2">
                                <button
                                    onClick={handleEstimateClick}
                                    className="px-8 py-4 bg-[#ec028b] hover:bg-[#d0027a] text-white font-bold text-base rounded-md transition-all duration-200 shadow-lg shadow-pink-500/20 flex items-center gap-3 cursor-pointer"
                                >
                                    <span>Get Instant Tooele Estimate</span>
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
                                TOOELE VALLEY
                            </div>
                            <h3 className="text-lg font-bold text-white mb-3">Tooele Micro-Climate Profile</h3>
                            <ul className="space-y-3 text-xs text-gray-300">
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-[#ec028b] shrink-0 mt-0.5" />
                                    <span><strong>Mountain Wind Shears:</strong> High canyon gusts off Stansbury & Oquirrh ranges exceeding 70 MPH.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-[#ec028b] shrink-0 mt-0.5" />
                                    <span><strong>Lake-Effect Snowpack:</strong> Great Salt Lake moisture generating heavy winter snow loads.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-[#ec028b] shrink-0 mt-0.5" />
                                    <span><strong>High-Desert UV Bake:</strong> Intense summer solar exposure requiring UV-stabilized materials.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-[#ec028b] shrink-0 mt-0.5" />
                                    <span><strong>Thermal Cycling:</strong> 80°F+ single-day fluctuations stressing decking seams and fasteners.</span>
                                </li>
                            </ul>
                            <div className="mt-6 pt-4 border-t border-gray-800 text-center">
                                <span className="text-xs text-gray-400 font-mono">Permitting: Tooele City & Tooele County</span>
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
                        <h2 className="text-2xl sm:text-3xl font-bold text-white">Tooele Environmental Factors & RHIVE Brand Commitment</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm sm:text-base text-gray-300 font-serif leading-relaxed">
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-white font-sans flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-[#ec028b]" /> Regional Environmental Factors & Local Footprint
                            </h3>
                            <p>
                                Tooele features a mix of established historic downtown neighborhoods, modern foothill developments near Settlement Canyon, and industrial properties. Open desert exposure subjects roofs to intense solar UV radiation in summer, while winter snowpack retention creates chronic eave ice dams.
                            </p>
                            <p>
                                Full roof replacements in Tooele require municipal building permits issued through the City of Tooele Community Development Department or Tooele County. RHIVE Construction manages 100% of the permitting process, ensuring full compliance with Utah building codes, 28-gauge steel drip metal specifications, and eave ice barrier extensions.
                            </p>
                            <p className="text-xs text-gray-400 font-mono">
                                Neighborhood Footprint: Main Street, Vine Street, Settlement Canyon foothill areas, Overlake, North Tooele, copper country foothill developments, and boundary zones adjoining Stansbury Park.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-white font-sans flex items-center gap-2">
                                <Award className="w-5 h-5 text-[#ec028b]" /> Radical Transparency & Community Commitment
                            </h3>
                            <p>
                                Co-founded by <strong>Kara Robinson (President)</strong> and <strong>Michael Robinson (CEO)</strong>, RHIVE Construction is a female-owned and operated contractor bringing complete cost transparency to Tooele. We eliminate middleman sales commissions and physical warehouse overhead to keep administrative expenses <strong>under 10%</strong>.
                            </p>
                            <p>
                                Every quote features an itemized mathematical breakdown showing exact costs for <strong>Materials, Labor, Operating Overhead (&lt;10%), and Net Profit</strong>. Guided by our slogan <strong>"Finish On Top"</strong> and our ongoing mission of donating roofs to local veterans, teachers, and first responders, Tooele property owners receive master-craftsman quality without salesman markups.
                            </p>
                        </div>
                    </div>
                </section>

                {/* PART 2: RESIDENTIAL ROOFING */}
                <section className="bg-gray-950/60 border border-gray-800 p-8 sm:p-10 rounded-xl space-y-8">
                    <div className="space-y-3">
                        <div className="text-xs font-mono text-[#ec028b] uppercase tracking-wider">Part 2: Residential Solutions</div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-white">Residential Roofing Standards for Tooele Single-Family Homes</h2>
                    </div>

                    <div className="p-6 rounded-lg bg-pink-500/10 border border-pink-500/20 text-gray-200">
                        <h3 className="text-base font-bold text-white font-sans mb-2">Q: What is RHIVE’s residential reroofing standard for Tooele single-family homes?</h3>
                        <p className="font-serif text-sm sm:text-base text-gray-300 leading-relaxed">
                            <strong>A:</strong> RHIVE enforces a strict <strong>100% full tear-off policy</strong> down to bare OSB decking on all single-family reroofs in Tooele. We never perform residential layovers because placing new shingles over old materials traps moisture, conceals structural wood rot, adds excessive weight under snow loads, and voids manufacturer warranties.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-5 rounded-lg bg-gray-900 border border-gray-800 space-y-2">
                            <h4 className="text-sm font-bold text-white">Synthetic Field Protection</h4>
                            <p className="text-xs text-gray-400 font-serif leading-relaxed">
                                100% field coverage with <strong>Owens Corning ProArmor®</strong> synthetic underlayment.
                            </p>
                        </div>
                        <div className="p-5 rounded-lg bg-gray-900 border border-gray-800 space-y-2">
                            <h4 className="text-sm font-bold text-white">6+ Ft Ice & Water Shield</h4>
                            <p className="text-xs text-gray-400 font-serif leading-relaxed">
                                A minimum of 6 feet of <strong>Owens Corning WeatherLock®</strong> self-adhering membrane along eaves and valleys.
                            </p>
                        </div>
                        <div className="p-5 rounded-lg bg-gray-900 border border-gray-800 space-y-2">
                            <h4 className="text-sm font-bold text-white">Decking Replacement Included</h4>
                            <p className="text-xs text-gray-400 font-serif leading-relaxed">
                                Up to <strong>100 sq ft of 7/16 OSB decking replacement included</strong> at no extra charge if rot is discovered during tear-off ($72.50/sheet after).
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
                        <h3 className="text-base font-bold text-white font-sans mb-2">Q: What commercial roofing solutions does RHIVE provide in Tooele?</h3>
                        <p className="font-serif text-sm sm:text-base text-gray-300 leading-relaxed">
                            <strong>A:</strong> RHIVE delivers rugged commercial roofing throughout Tooele County, serving industrial parks near Peterson Industrial Depot, Main Street commercial corridors, churches, banks, and multi-family developments. We engineer and install both <strong>commercial steep-slope architectural shingle systems</strong> (for multi-family, churches, and steep-slope offices) and <strong>certified single-ply flat membrane systems</strong> (TPO/PVC) backed by certified Master Service Agreements (MSAs) and GAF manufacturer warranties.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-5 rounded-lg bg-gray-900 border border-gray-800 space-y-2">
                            <h4 className="text-sm font-bold text-white">Commercial Code Layover</h4>
                            <p className="text-xs text-gray-400 font-serif leading-relaxed">
                                Under active Utah building codes, single-layer commercial layovers are permitted when underlying structural decking and insulation are dry and sound, avoiding tear-off expenses.
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
                        <h3 className="text-base font-bold text-white font-sans mb-2">Q: What asphalt shingle products does RHIVE install in Tooele?</h3>
                        <p className="font-serif text-sm sm:text-base text-gray-300 leading-relaxed">
                            <strong>A:</strong> RHIVE Construction installs the <strong>Owens Corning Duration® Series</strong> with patented <strong>SureNail® Technology</strong> (130 MPH wind uplift rating), <strong>Duration FLEX®</strong> SBS polymer-modified Class 4 Impact Rated shingles for hail resistance and insurance premium discounts, and <strong>GAF Designer Shingles</strong> (Woodland® / Grand Sequoia®) for dimensional aesthetics backed by 50-year non-prorated warranties.
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
                            <p className="text-xs text-gray-400">Woodland® and Grand Sequoia® hand-cut dimensional aesthetics for luxury Tooele estates.</p>
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
                        <h3 className="text-base font-bold text-white font-sans mb-2">Q: What are the technical specifications of RHIVE’s flat roof membrane installations in Tooele?</h3>
                        <p className="font-serif text-sm sm:text-base text-gray-300 leading-relaxed">
                            <strong>A:</strong> RHIVE installs <strong>GAF EverGuard® TPO (60/80 mil)</strong> reflective white Energy Star membranes to lower summer HVAC cooling costs, and <strong>GAF EverGuard® PVC (60/80 mil)</strong> for high chemical, grease, and fire resistance. The assembly includes mechanically attached Polyiso insulation, custom-tapered boards around drains and scuppers to eliminate ponding water, high-density DensDeck® gypsum cover boards, and fusion hot-air welded seams.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                        <div className="p-4 rounded-lg bg-gray-900 border border-gray-800 space-y-1">
                            <span className="font-bold text-white block">GAF EverGuard® TPO</span>
                            <span className="text-gray-400">60/80 mil reflective white membrane reducing summer HVAC cooling loads.</span>
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
                            <span className="text-gray-400">High-density gypsum cover boards delivering superior puncture defense.</span>
                        </div>
                    </div>
                </section>

                {/* FAQ ACCORDION HUB (AEO / SEO) */}
                <section className="bg-gray-950/80 border border-gray-800 p-8 sm:p-10 rounded-xl space-y-8">
                    <div className="text-center max-w-3xl mx-auto space-y-3">
                        <div className="text-xs font-mono text-[#ec028b] uppercase tracking-wider">AEO & Direct Answers</div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-white">Frequently Asked Questions: Tooele Roofing</h2>
                        <p className="text-sm text-gray-400 font-serif">
                            Direct answers to common questions asked by homeowners and commercial property managers in Tooele & Tooele Valley, Utah.
                        </p>
                    </div>

                    <div className="space-y-4 max-w-4xl mx-auto">
                        {/* FAQ 1 */}
                        <div className="border border-gray-800 rounded-lg overflow-hidden">
                            <button
                                onClick={() => toggleFaq('faq-tooele-wind')}
                                className="w-full p-5 text-left bg-gray-900/90 hover:bg-gray-900 flex justify-between items-center transition-colors cursor-pointer"
                            >
                                <span className="font-bold text-sm sm:text-base text-white">How does RHIVE protect Tooele homes against severe mountain wind shears?</span>
                                <ChevronDown className={cn("w-5 h-5 text-[#ec028b] transition-transform duration-200", openFaq === 'faq-tooele-wind' ? "rotate-180" : "")} />
                            </button>
                            {openFaq === 'faq-tooele-wind' && (
                                <div className="p-5 bg-black/60 border-t border-gray-800 space-y-3">
                                    <div className="p-3 bg-pink-500/10 border border-pink-500/20 rounded text-xs text-pink-300 font-mono">
                                        DIRECT ANSWER: We install Owens Corning Duration® shingles with patented SureNail® Technology, holding a certified 130 MPH wind uplift rating with our 6-nail fastening pattern.
                                    </div>
                                    <p className="text-sm text-gray-300 font-serif leading-relaxed">
                                        High downslope canyon wind gusts rolling off the Stansbury and Oquirrh ranges put intense uplift pressure on roof edges. The woven fabric fastening strip prevents nail pull-through during severe mountain windstorms.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* FAQ 2 */}
                        <div className="border border-gray-800 rounded-lg overflow-hidden">
                            <button
                                onClick={() => toggleFaq('faq-tooele-gutters')}
                                className="w-full p-5 text-left bg-gray-900/90 hover:bg-gray-900 flex justify-between items-center transition-colors cursor-pointer"
                            >
                                <span className="font-bold text-sm sm:text-base text-white">Why are continuous custom rain gutters essential for Tooele properties?</span>
                                <ChevronDown className={cn("w-5 h-5 text-[#ec028b] transition-transform duration-200", openFaq === 'faq-tooele-gutters' ? "rotate-180" : "")} />
                            </button>
                            {openFaq === 'faq-tooele-gutters' && (
                                <div className="p-5 bg-black/60 border-t border-gray-800 space-y-3">
                                    <div className="p-3 bg-pink-500/10 border border-pink-500/20 rounded text-xs text-pink-300 font-mono">
                                        DIRECT ANSWER: RHIVE custom-extrudes continuous 5" and 6" aluminum gutters on-site, spacing hidden screw-in hangers tightly at every 24 inches to support heavy snow loads.
                                    </div>
                                    <p className="text-sm text-gray-300 font-serif leading-relaxed">
                                        Proper water diversion prevents soil erosion and foundation settlement during intense desert storms and rapid winter snowmelt, protecting your home's structural footing.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* FAQ 3 */}
                        <div className="border border-gray-800 rounded-lg overflow-hidden">
                            <button
                                onClick={() => toggleFaq('faq-tooele-guarantee')}
                                className="w-full p-5 text-left bg-gray-900/90 hover:bg-gray-900 flex justify-between items-center transition-colors cursor-pointer"
                            >
                                <span className="font-bold text-sm sm:text-base text-white">What guarantees protect Tooele property owners against installation leaks?</span>
                                <ChevronDown className={cn("w-5 h-5 text-[#ec028b] transition-transform duration-200", openFaq === 'faq-tooele-guarantee' ? "rotate-180" : "")} />
                            </button>
                            {openFaq === 'faq-tooele-guarantee' && (
                                <div className="p-5 bg-black/60 border-t border-gray-800 space-y-3">
                                    <div className="p-3 bg-pink-500/10 border border-pink-500/20 rounded text-xs text-pink-300 font-mono">
                                        DIRECT ANSWER: In addition to Owens Corning 50-year non-prorated material warranties, RHIVE backs every replacement with our direct Lifetime Installer No-Leak Guarantee.
                                    </div>
                                    <p className="text-sm text-gray-300 font-serif leading-relaxed">
                                        If our installation causes a leak at any point during your roof's lifespan, we dispatch technicians to repair it 100% free of charge.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* FAQ 4 */}
                        <div className="border border-gray-800 rounded-lg overflow-hidden">
                            <button
                                onClick={() => toggleFaq('faq-tooele-tearoff')}
                                className="w-full p-5 text-left bg-gray-900/90 hover:bg-gray-900 flex justify-between items-center transition-colors cursor-pointer"
                            >
                                <span className="font-bold text-sm sm:text-base text-white">What is RHIVE’s residential reroofing standard for Tooele single-family homes?</span>
                                <ChevronDown className={cn("w-5 h-5 text-[#ec028b] transition-transform duration-200", openFaq === 'faq-tooele-tearoff' ? "rotate-180" : "")} />
                            </button>
                            {openFaq === 'faq-tooele-tearoff' && (
                                <div className="p-5 bg-black/60 border-t border-gray-800 space-y-3">
                                    <div className="p-3 bg-pink-500/10 border border-pink-500/20 rounded text-xs text-pink-300 font-mono">
                                        DIRECT ANSWER: RHIVE enforces a strict 100% full tear-off policy down to bare OSB decking on all single-family reroofs in Tooele.
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
                                onClick={() => toggleFaq('faq-tooele-commercial')}
                                className="w-full p-5 text-left bg-gray-900/90 hover:bg-gray-900 flex justify-between items-center transition-colors cursor-pointer"
                            >
                                <span className="font-bold text-sm sm:text-base text-white">What commercial roofing solutions does RHIVE provide in Tooele?</span>
                                <ChevronDown className={cn("w-5 h-5 text-[#ec028b] transition-transform duration-200", openFaq === 'faq-tooele-commercial' ? "rotate-180" : "")} />
                            </button>
                            {openFaq === 'faq-tooele-commercial' && (
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
                                onClick={() => toggleFaq('faq-tooele-shingles')}
                                className="w-full p-5 text-left bg-gray-900/90 hover:bg-gray-900 flex justify-between items-center transition-colors cursor-pointer"
                            >
                                <span className="font-bold text-sm sm:text-base text-white">What asphalt shingle products does RHIVE install in Tooele?</span>
                                <ChevronDown className={cn("w-5 h-5 text-[#ec028b] transition-transform duration-200", openFaq === 'faq-tooele-shingles' ? "rotate-180" : "")} />
                            </button>
                            {openFaq === 'faq-tooele-shingles' && (
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
                                onClick={() => toggleFaq('faq-tooele-permits')}
                                className="w-full p-5 text-left bg-gray-900/90 hover:bg-gray-900 flex justify-between items-center transition-colors cursor-pointer"
                            >
                                <span className="font-bold text-sm sm:text-base text-white">Does Tooele require a building permit for residential reroofing?</span>
                                <ChevronDown className={cn("w-5 h-5 text-[#ec028b] transition-transform duration-200", openFaq === 'faq-tooele-permits' ? "rotate-180" : "")} />
                            </button>
                            {openFaq === 'faq-tooele-permits' && (
                                <div className="p-5 bg-black/60 border-t border-gray-800 space-y-3">
                                    <div className="p-3 bg-pink-500/10 border border-pink-500/20 rounded text-xs text-pink-300 font-mono">
                                        DIRECT ANSWER: Yes. Full roof replacements in Tooele require municipal building permits through the City of Tooele or Tooele County.
                                    </div>
                                    <p className="text-sm text-gray-300 font-serif leading-relaxed">
                                        RHIVE manages 100% of the municipal permitting process to ensure compliance with local Utah energy codes, eave ice barrier standards, and perimeter metal flashings.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* BOTTOM CALL TO ACTION */}
                <section className="bg-gradient-to-r from-pink-950/40 via-black to-pink-950/40 border border-pink-500/30 p-10 sm:p-12 rounded-2xl text-center space-y-6">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-sans">
                        Protect Your Tooele Property with Master-Craftsman Precision
                    </h2>
                    <p className="text-gray-300 font-serif max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
                        Get an itemized mathematical estimate with zero salesman pressure, backed by our Lifetime Installer No-Leak Guarantee and 50-year non-prorated material protection.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4 pt-2">
                        <button
                            onClick={handleEstimateClick}
                            className="px-8 py-4 bg-[#ec028b] hover:bg-[#d0027a] text-white font-bold text-base rounded-md transition-all duration-200 shadow-lg shadow-pink-500/20 cursor-pointer flex items-center gap-3"
                        >
                            <span>Calculate Your Instant Tooele Estimate</span>
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
