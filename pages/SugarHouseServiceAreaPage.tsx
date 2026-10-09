import React, { useEffect, useMemo, useState } from 'react';
import { Phone, Shield, ArrowRight, Zap, MapPin, ChevronDown, Wind, Building2, Layers, CheckCircle2, Wrench, Umbrella, Award } from 'lucide-react';
import { cn } from '../lib/utils';

export default function SugarHouseServiceAreaPage() {
    useEffect(() => {
        document.title = "Top-Rated Roofing Contractor Sugar House UT | RHIVE Construction";
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
            metaDesc = document.createElement('meta');
            metaDesc.setAttribute('name', 'description');
            document.head.appendChild(metaDesc);
        }
        metaDesc.setAttribute('content', "Expert residential & commercial roofing in Sugar House, UT. Parleys Canyon wind resistance, historic craftsman shingle matching, GAF TPO/PVC flat roofs, and lifetime guarantees.");
    }, []);

    const [openFaq, setOpenFaq] = useState<string | null>('faq-sh-canopy');

    const handleEstimateClick = () => {
        window.location.href = '/estimate-tool';
    };

    const toggleFaq = (id: string) => {
        setOpenFaq(prev => prev === id ? null : id);
    };

    // Granular JSON-LD Schema for Sugar House, UT local SEO & AEO
    const jsonLdSchema = useMemo(() => {
        return {
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "RoofingContractor",
                    "@id": "https://www.rhiveconstruction.com/service-areas/sugar-house-ut/#localbusiness",
                    "name": "RHIVE Construction - Sugar House Service Area",
                    "url": "https://www.rhiveconstruction.com/service-areas/sugar-house-ut",
                    "logo": "https://i.imgur.com/t0VcSgJ.png",
                    "image": "https://i.imgur.com/t0VcSgJ.png",
                    "telephone": "+1-435-417-6637",
                    "email": "office@rhiveconstruction.com",
                    "priceRange": "$$$",
                    "description": "RHIVE Construction delivers precision-engineered residential roofing, commercial facility systems, high-performance asphalt shingles, and certified flat membrane installations across Sugar House, UT.",
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
                        "latitude": 40.7228,
                        "longitude": -111.8580
                    },
                    "areaServed": [
                        {"@type": "City", "name": "Sugar House"},
                        {"@type": "City", "name": "Salt Lake City"},
                        {"@type": "PostalCode", "postalCode": "84105"},
                        {"@type": "PostalCode", "postalCode": "84106"},
                        {"@type": "AdministrativeArea", "name": "1500 East Corridor"},
                        {"@type": "AdministrativeArea", "name": "2100 South Business District"},
                        {"@type": "AdministrativeArea", "name": "Sugar House Park District"},
                        {"@type": "AdministrativeArea", "name": "Highland High Area"},
                        {"@type": "AdministrativeArea", "name": "Westminster University District"},
                        {"@type": "AdministrativeArea", "name": "Imperial Park"},
                        {"@type": "AdministrativeArea", "name": "Country Club Neighborhood"}
                    ]
                },
                {
                    "@type": "FAQPage",
                    "@id": "https://www.rhiveconstruction.com/service-areas/sugar-house-ut/#faqpage",
                    "mainEntity": [
                        {
                            "@type": "Question",
                            "name": "How does RHIVE protect historic Sugar House homes with heavy tree shade from ice dams?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "We install a minimum 6-foot continuous eave barrier of self-adhering Owens Corning WeatherLock® Ice & Water Shield combined with commercial-grade self-regulating heat trace cables (5W/lin ft, 110V) controlled by intelligent thermostats."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "How fast can RHIVE dispatch an emergency repair crew to a leaking roof in Sugar House?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "Through our Quantum Rapid-Response Protocol, we dispatch emergency crews for pitched-roof synthetic tarping or flat membrane heat-welded containment. Emergency tarping carries a flat $350 fee, and 100% of this $350 fee is credited back toward your permanent repair or full replacement."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "What guarantees protect Sugar House homeowners against installation leaks?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "In addition to Owens Corning 50-year non-prorated material warranties, RHIVE backs every replacement with our direct Lifetime Installer No-Leak Guarantee—if our installation causes a leak, we repair it 100% free of charge."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "What is RHIVE’s residential reroofing standard for Sugar House single-family homes?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "RHIVE enforces a strict 100% full tear-off policy down to bare OSB decking on all residential replacements in Sugar House. Every replacement includes ProArmor® synthetic underlayment, 6+ ft WeatherLock® Ice & Water Shield, 6-nail fastening, and 100 sq ft free OSB decking replacement."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "What single-ply commercial flat roof options does RHIVE install in Sugar House?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "As a certified GAF commercial installer, RHIVE installs heat-welded GAF EverGuard® TPO and PVC single-ply membranes in 60 mil and heavy-duty 80 mil specifications with Polyiso insulation and DensDeck® cover boards, backed by GAF NDL warranties up to 30 years."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "What asphalt shingle products does RHIVE install for Sugar House properties?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "RHIVE installs Owens Corning Duration® Series (130 MPH SureNail®), Duration FLEX® Class 4 Impact Rated shingles for hail and debris protection, and GAF Designer Shingles (Woodland®/Grand Sequoia®) for historic craftsman aesthetics."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "Does Sugar House require a building permit for residential reroofing?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "Yes. Full roof replacements in Sugar House require municipal building permits issued through the Salt Lake City Community Development Department. RHIVE manages 100% of the municipal permitting process to ensure complete building code compliance."
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
                                <MapPin className="w-3.5 h-3.5" /> Sugar House & Historic District Master Roofing
                            </div>
                            
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight font-sans">
                                Solving Sugar House's Toughest <span className="text-[#ec028b]">Parleys Canyon Wind</span> & Tree Canopy Ice Damming Challenges
                            </h1>

                            <p className="text-lg sm:text-xl text-gray-300 font-serif leading-relaxed max-w-[70ch]">
                                Situated near Parleys Canyon with dense mature tree canopies, Sugar House properties face severe canyon wind shears, prolonged shade-induced snow retention, and chronic eave ice dams. RHIVE Construction engineers roofs with Owens Corning Duration® 130 MPH SureNail® shingles, GAF Designer Shingles, GAF EverGuard® TPO/PVC flat membranes, and our direct Lifetime Installer No-Leak Guarantee.
                            </p>

                            <div className="flex flex-wrap gap-4 pt-2">
                                <button
                                    onClick={handleEstimateClick}
                                    className="px-8 py-4 bg-[#ec028b] hover:bg-[#d0027a] text-white font-bold text-base rounded-md transition-all duration-200 shadow-lg shadow-pink-500/20 flex items-center gap-3 cursor-pointer"
                                >
                                    <span>Get Instant Sugar House Estimate</span>
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
                                HISTORIC DISTRICT
                            </div>
                            <h3 className="text-lg font-bold text-white mb-3">Sugar House Micro-Climate Profile</h3>
                            <ul className="space-y-3 text-xs text-gray-300">
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-[#ec028b] shrink-0 mt-0.5" />
                                    <span><strong>Parleys Canyon Winds:</strong> Downslope wind corridors sweeping along 2100 South.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-[#ec028b] shrink-0 mt-0.5" />
                                    <span><strong>Dense Tree Canopy:</strong> Prolonged shade causing uneven snowmelt & heavy ice dams.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-[#ec028b] shrink-0 mt-0.5" />
                                    <span><strong>Craftsman Architecture:</strong> Historic bungalows requiring authentic wood-shake aesthetics.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-[#ec028b] shrink-0 mt-0.5" />
                                    <span><strong>Thermal Stress:</strong> 80°F+ single-day temperature fluctuations stressing decking seams.</span>
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
                        <h2 className="text-2xl sm:text-3xl font-bold text-white">Sugar House Environmental Factors & RHIVE Brand Commitment</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm sm:text-base text-gray-300 font-serif leading-relaxed">
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-white font-sans flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-[#ec028b]" /> Regional Environmental Factors & Local Footprint
                            </h3>
                            <p>
                                Sugar House features a distinct architectural mixture of early 20th-century craftsman homes, Tudor cottages, modern mid-rise multi-family developments, and vibrant commercial plazas along 2100 South. Heavy tree debris accumulation in valleys and gutters traps moisture, while rapid freeze-thaw cycles—where temperatures swing over 80°F in a single day—cause severe thermal expansion stress on older structural decking.
                            </p>
                            <p>
                                Full roof replacements in Sugar House require municipal building permits issued through the Salt Lake City Community Development Department. RHIVE Construction manages 100% of the permitting process, ensuring full compliance with local building codes, 28-gauge steel drip metal specifications, and eave ice barrier extensions.
                            </p>
                            <p className="text-xs text-gray-400 font-mono">
                                Neighborhood Footprint: 1500 East, 2100 South corridor, Sugar House Park district, Highland High area, Westminster University district, Imperial Park, and the Country Club neighborhood.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-white font-sans flex items-center gap-2">
                                <Award className="w-5 h-5 text-[#ec028b]" /> Radical Cost Transparency & Community Mission
                            </h3>
                            <p>
                                Co-founded by <strong>Kara Robinson (President)</strong> and <strong>Michael Robinson (CEO)</strong>, RHIVE Construction is a proudly female-owned and operated contractor bringing complete cost transparency to Sugar House. We eliminate middleman sales commissions and physical warehouse overhead to keep administrative expenses <strong>under 10%</strong>.
                            </p>
                            <p>
                                Every quote provides an itemized mathematical breakdown showing exact costs for <strong>Materials, Labor, Operating Overhead, and Net Company Profit</strong>. Guided by our slogan <strong>"Finish On Top"</strong> and our ongoing mission of donating complete roof replacements to local veterans, teachers, and first responders, Sugar House property owners receive master-craftsman quality without salesman markups.
                            </p>
                        </div>
                    </div>
                </section>

                {/* PART 2: RESIDENTIAL ROOFING */}
                <section className="bg-gray-950/60 border border-gray-800 p-8 sm:p-10 rounded-xl space-y-8">
                    <div className="space-y-3">
                        <div className="text-xs font-mono text-[#ec028b] uppercase tracking-wider">Part 2: Residential Solutions</div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-white">Residential Roofing Standards for Sugar House Craftsman & Estate Homes</h2>
                    </div>

                    <div className="p-6 rounded-lg bg-pink-500/10 border border-pink-500/20 text-gray-200">
                        <h3 className="text-base font-bold text-white font-sans mb-2">Q: What is RHIVE’s residential reroofing standard for Sugar House single-family homes?</h3>
                        <p className="font-serif text-sm sm:text-base text-gray-300 leading-relaxed">
                            <strong>A:</strong> RHIVE enforces a strict <strong>100% full tear-off policy</strong> down to bare OSB or tongue-and-groove decking on all residential replacements in Sugar House. We never perform residential layovers because placing new shingles over old materials traps moisture, conceals structural deck rot, adds excessive weight, and voids manufacturer system warranties.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-5 rounded-lg bg-gray-900 border border-gray-800 space-y-2">
                            <h4 className="text-sm font-bold text-white">100% Field Protection</h4>
                            <p className="text-xs text-gray-400 font-serif leading-relaxed">
                                High-performance <strong>Owens Corning ProArmor®</strong> synthetic underlayment installed across the entire non-covered roof deck.
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
                        <h3 className="text-base font-bold text-white font-sans mb-2">Q: What commercial roofing systems does RHIVE install for Sugar House commercial properties?</h3>
                        <p className="font-serif text-sm sm:text-base text-gray-300 leading-relaxed">
                            <strong>A:</strong> RHIVE provides premium commercial roofing throughout the Sugar House business district, 2100 South commercial corridor, historic storefronts, churches, banks, and modern mid-rise multi-family developments. We engineer and install both <strong>commercial steep-slope architectural shingle systems</strong> (for multi-family, churches, and steep-slope offices) and <strong>certified single-ply flat membrane systems</strong> (TPO/PVC) backed by certified Master Service Agreements (MSAs) and GAF manufacturer warranties.
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
                        <h3 className="text-base font-bold text-white font-sans mb-2">Q: What asphalt shingle products does RHIVE install for Sugar House properties?</h3>
                        <p className="font-serif text-sm sm:text-base text-gray-300 leading-relaxed">
                            <strong>A:</strong> RHIVE Construction is an Owens Corning Preferred Contractor installing the <strong>Duration® Series</strong> with patented <strong>SureNail® Technology</strong> (130 MPH wind uplift rating), <strong>Duration FLEX®</strong> SBS polymer-modified Class 4 Impact Rated shingles for hail resistance and insurance discounts, and <strong>GAF Designer Shingles</strong> (Woodland® / Grand Sequoia®) for historic craftsman aesthetics backed by 50-year non-prorated warranties.
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
                            <p className="text-xs text-gray-400">Woodland® and Grand Sequoia® hand-cut dimensional aesthetics for historic craftsman homes.</p>
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
                        <h3 className="text-base font-bold text-white font-sans mb-2">Q: What are the technical specifications of RHIVE’s flat roof membrane installations in Sugar House?</h3>
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
                            <span className="text-gray-400">High-density gypsum cover boards delivering superior puncture defense.</span>
                        </div>
                    </div>
                </section>

                {/* FAQ ACCORDION HUB (AEO / SEO) */}
                <section className="bg-gray-950/80 border border-gray-800 p-8 sm:p-10 rounded-xl space-y-8">
                    <div className="text-center max-w-3xl mx-auto space-y-3">
                        <div className="text-xs font-mono text-[#ec028b] uppercase tracking-wider">AEO & Direct Answers</div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-white">Frequently Asked Questions: Sugar House Roofing</h2>
                        <p className="text-sm text-gray-400 font-serif">
                            Direct answers to common questions asked by homeowners and commercial property managers in Sugar House, Utah.
                        </p>
                    </div>

                    <div className="space-y-4 max-w-4xl mx-auto">
                        {/* FAQ 1 */}
                        <div className="border border-gray-800 rounded-lg overflow-hidden">
                            <button
                                onClick={() => toggleFaq('faq-sh-canopy')}
                                className="w-full p-5 text-left bg-gray-900/90 hover:bg-gray-900 flex justify-between items-center transition-colors cursor-pointer"
                            >
                                <span className="font-bold text-sm sm:text-base text-white">How does RHIVE protect historic Sugar House homes with heavy tree shade from ice dams?</span>
                                <ChevronDown className={cn("w-5 h-5 text-[#ec028b] transition-transform duration-200", openFaq === 'faq-sh-canopy' ? "rotate-180" : "")} />
                            </button>
                            {openFaq === 'faq-sh-canopy' && (
                                <div className="p-5 bg-black/60 border-t border-gray-800 space-y-3">
                                    <div className="p-3 bg-pink-500/10 border border-pink-500/20 rounded text-xs text-pink-300 font-mono">
                                        DIRECT ANSWER: We install a minimum 6-foot continuous eave barrier of self-adhering Owens Corning WeatherLock® Ice & Water Shield combined with self-regulating heat trace cables.
                                    </div>
                                    <p className="text-sm text-gray-300 font-serif leading-relaxed">
                                        Mature tree canopies in Sugar House prevent sunlight from melting snow evenly. Our commercial-grade heat trace cables (5W/lin ft, 110V) melt drainage channels through accumulated snow, preventing meltwater backup under shingles.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* FAQ 2 */}
                        <div className="border border-gray-800 rounded-lg overflow-hidden">
                            <button
                                onClick={() => toggleFaq('faq-sh-rapid')}
                                className="w-full p-5 text-left bg-gray-900/90 hover:bg-gray-900 flex justify-between items-center transition-colors cursor-pointer"
                            >
                                <span className="font-bold text-sm sm:text-base text-white">How fast can RHIVE dispatch an emergency repair crew to a leaking roof in Sugar House?</span>
                                <ChevronDown className={cn("w-5 h-5 text-[#ec028b] transition-transform duration-200", openFaq === 'faq-sh-rapid' ? "rotate-180" : "")} />
                            </button>
                            {openFaq === 'faq-sh-rapid' && (
                                <div className="p-5 bg-black/60 border-t border-gray-800 space-y-3">
                                    <div className="p-3 bg-pink-500/10 border border-pink-500/20 rounded text-xs text-pink-300 font-mono">
                                        DIRECT ANSWER: We dispatch emergency crews for pitched synthetic tarping or flat heat-welded containment with a flat $350 fee, 100% credited back toward permanent replacement.
                                    </div>
                                    <p className="text-sm text-gray-300 font-serif leading-relaxed">
                                        Through our Quantum Rapid-Response Protocol, our dispatch center routes the nearest Wasatch Front crew to secure your roof against structural interior water intrusion.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* FAQ 3 */}
                        <div className="border border-gray-800 rounded-lg overflow-hidden">
                            <button
                                onClick={() => toggleFaq('faq-sh-guarantee')}
                                className="w-full p-5 text-left bg-gray-900/90 hover:bg-gray-900 flex justify-between items-center transition-colors cursor-pointer"
                            >
                                <span className="font-bold text-sm sm:text-base text-white">What guarantees protect Sugar House homeowners against installation leaks?</span>
                                <ChevronDown className={cn("w-5 h-5 text-[#ec028b] transition-transform duration-200", openFaq === 'faq-sh-guarantee' ? "rotate-180" : "")} />
                            </button>
                            {openFaq === 'faq-sh-guarantee' && (
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
                                onClick={() => toggleFaq('faq-sh-tearoff')}
                                className="w-full p-5 text-left bg-gray-900/90 hover:bg-gray-900 flex justify-between items-center transition-colors cursor-pointer"
                            >
                                <span className="font-bold text-sm sm:text-base text-white">What is RHIVE’s residential reroofing standard for Sugar House single-family homes?</span>
                                <ChevronDown className={cn("w-5 h-5 text-[#ec028b] transition-transform duration-200", openFaq === 'faq-sh-tearoff' ? "rotate-180" : "")} />
                            </button>
                            {openFaq === 'faq-sh-tearoff' && (
                                <div className="p-5 bg-black/60 border-t border-gray-800 space-y-3">
                                    <div className="p-3 bg-pink-500/10 border border-pink-500/20 rounded text-xs text-pink-300 font-mono">
                                        DIRECT ANSWER: RHIVE enforces a strict 100% full tear-off policy down to bare OSB decking on all residential replacements in Sugar House.
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
                                onClick={() => toggleFaq('faq-sh-commercial')}
                                className="w-full p-5 text-left bg-gray-900/90 hover:bg-gray-900 flex justify-between items-center transition-colors cursor-pointer"
                            >
                                <span className="font-bold text-sm sm:text-base text-white">What single-ply commercial flat roof options does RHIVE install in Sugar House?</span>
                                <ChevronDown className={cn("w-5 h-5 text-[#ec028b] transition-transform duration-200", openFaq === 'faq-sh-commercial' ? "rotate-180" : "")} />
                            </button>
                            {openFaq === 'faq-sh-commercial' && (
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
                                onClick={() => toggleFaq('faq-sh-shingles')}
                                className="w-full p-5 text-left bg-gray-900/90 hover:bg-gray-900 flex justify-between items-center transition-colors cursor-pointer"
                            >
                                <span className="font-bold text-sm sm:text-base text-white">What asphalt shingle products does RHIVE install for Sugar House properties?</span>
                                <ChevronDown className={cn("w-5 h-5 text-[#ec028b] transition-transform duration-200", openFaq === 'faq-sh-shingles' ? "rotate-180" : "")} />
                            </button>
                            {openFaq === 'faq-sh-shingles' && (
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
                                onClick={() => toggleFaq('faq-sh-permits')}
                                className="w-full p-5 text-left bg-gray-900/90 hover:bg-gray-900 flex justify-between items-center transition-colors cursor-pointer"
                            >
                                <span className="font-bold text-sm sm:text-base text-white">Does Sugar House require a building permit for residential reroofing?</span>
                                <ChevronDown className={cn("w-5 h-5 text-[#ec028b] transition-transform duration-200", openFaq === 'faq-sh-permits' ? "rotate-180" : "")} />
                            </button>
                            {openFaq === 'faq-sh-permits' && (
                                <div className="p-5 bg-black/60 border-t border-gray-800 space-y-3">
                                    <div className="p-3 bg-pink-500/10 border border-pink-500/20 rounded text-xs text-pink-300 font-mono">
                                        DIRECT ANSWER: Yes. Full roof replacements in Sugar House require municipal building permits through the Salt Lake City Community Development Department.
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
                        Protect Your Sugar House Property with Master-Craftsman Precision
                    </h2>
                    <p className="text-gray-300 font-serif max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
                        Get an itemized mathematical estimate with zero salesman pressure, backed by our Lifetime Installer No-Leak Guarantee and 50-year non-prorated material protection.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4 pt-2">
                        <button
                            onClick={handleEstimateClick}
                            className="px-8 py-4 bg-[#ec028b] hover:bg-[#d0027a] text-white font-bold text-base rounded-md transition-all duration-200 shadow-lg shadow-pink-500/20 cursor-pointer flex items-center gap-3"
                        >
                            <span>Calculate Your Instant Sugar House Estimate</span>
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
