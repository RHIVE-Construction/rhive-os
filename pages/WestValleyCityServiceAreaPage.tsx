import React, { useEffect, useMemo, useState } from 'react';
import { Phone, Shield, ArrowRight, Zap, MapPin, ChevronDown, Wind, Building2, Layers, CheckCircle2, Wrench, Umbrella, Award } from 'lucide-react';
import { cn } from '../lib/utils';

export default function WestValleyCityServiceAreaPage() {
    useEffect(() => {
        document.title = "Top-Rated Roofing Contractor West Valley City UT | RHIVE Construction";
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
            metaDesc = document.createElement('meta');
            metaDesc.setAttribute('name', 'description');
            document.head.appendChild(metaDesc);
        }
        metaDesc.setAttribute('content', "Top-rated residential & commercial roofing in West Valley City, UT. Owens Corning Duration 130 MPH shingles, GAF TPO/PVC flat roofs, 100% full tear-off, and lifetime guarantees.");
    }, []);

    const [openFaq, setOpenFaq] = useState<string | null>('faq-wvc-wind');

    const handleEstimateClick = () => {
        window.location.href = '/estimate-tool';
    };

    const toggleFaq = (id: string) => {
        setOpenFaq(prev => prev === id ? null : id);
    };

    // Granular JSON-LD Schema for West Valley City, UT local SEO & AEO
    const jsonLdSchema = useMemo(() => {
        return {
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "RoofingContractor",
                    "@id": "https://www.rhiveconstruction.com/service-areas/west-valley-city-ut/#localbusiness",
                    "name": "RHIVE Construction - West Valley City Service Area",
                    "url": "https://www.rhiveconstruction.com/service-areas/west-valley-city-ut",
                    "logo": "https://i.imgur.com/t0VcSgJ.png",
                    "image": "https://i.imgur.com/t0VcSgJ.png",
                    "telephone": "+1-435-417-6637",
                    "email": "office@rhiveconstruction.com",
                    "priceRange": "$$$",
                    "description": "RHIVE Construction delivers precision-engineered residential roofing, commercial facility systems, high-performance asphalt shingles, and certified flat membrane installations across West Valley City, UT.",
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
                        "latitude": 40.6916,
                        "longitude": -111.9963
                    },
                    "areaServed": [
                        {"@type": "City", "name": "West Valley City"},
                        {"@type": "PostalCode", "postalCode": "84119"},
                        {"@type": "PostalCode", "postalCode": "84120"},
                        {"@type": "PostalCode", "postalCode": "84128"},
                        {"@type": "AdministrativeArea", "name": "Granger"},
                        {"@type": "AdministrativeArea", "name": "Hunter"},
                        {"@type": "AdministrativeArea", "name": "West Ridge"},
                        {"@type": "AdministrativeArea", "name": "3500 South Corridor"},
                        {"@type": "AdministrativeArea", "name": "5600 West Industrial District"},
                        {"@type": "AdministrativeArea", "name": "Valley Fair Mall Area"},
                        {"@type": "AdministrativeArea", "name": "Maverik Center Area"}
                    ]
                },
                {
                    "@type": "FAQPage",
                    "@id": "https://www.rhiveconstruction.com/service-areas/west-valley-city-ut/#faqpage",
                    "mainEntity": [
                        {
                            "@type": "Question",
                            "name": "How does RHIVE protect West Valley City roofs against high open-valley wind shears?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "We install Owens Corning Duration® shingles featuring patented SureNail® Technology. The woven fabric strip in the fastening line prevents nail pull-through, holding a certified 130 MPH wind uplift rating when fastened with our 6-nail installation pattern."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "What emergency response options does RHIVE offer for active roof leaks in West Valley City?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "Through our Quantum Rapid-Response Protocol, we dispatch emergency crews for pitched-roof synthetic tarping or flat membrane heat-welded containment. Emergency tarping carries a flat $350 fee, and 100% of this $350 fee is credited back toward your permanent repair or full replacement."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "How does RHIVE ensure transparent pricing with zero salesman markup in West Valley City?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "We operate without commissioned sales representatives or expensive warehouses. Every Certified Quote explicitly breaks down the exact cost of Materials, Labor, Operating Overhead (<10%), and Net Profit, so you know precisely where every dollar goes."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "What is RHIVE’s residential reroofing standard for West Valley City single-family homes?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "RHIVE enforces a strict 100% full tear-off policy down to bare OSB decking on all single-family residential replacements in West Valley City. Every replacement includes ProArmor® synthetic underlayment, 6+ ft WeatherLock® Ice & Water Shield, 6-nail fastening, and 100 sq ft free OSB decking replacement."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "What single-ply commercial flat roof options does RHIVE install in West Valley City?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "As a certified GAF commercial installer, RHIVE installs heat-welded GAF EverGuard® TPO and PVC single-ply membranes in 60 mil and heavy-duty 80 mil specifications with Polyiso insulation and DensDeck® cover boards, backed by GAF NDL warranties up to 30 years."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "What asphalt shingle products does RHIVE install for West Valley City properties?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "RHIVE installs Owens Corning Duration® Series (130 MPH SureNail® wind uplift), Duration FLEX® Class 4 Impact Rated shingles for hail and debris protection, and GAF Designer Shingles (Woodland®/Grand Sequoia®) for upscale aesthetics."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "Does West Valley City require a building permit for residential reroofing?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "Yes. Full roof replacements in West Valley City require municipal building permits issued through the West Valley City Community Development Department. RHIVE manages 100% of the municipal permitting process to ensure complete building code compliance."
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
                                <MapPin className="w-3.5 h-3.5" /> West Valley City Master Roofing Systems
                            </div>
                            
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight font-sans">
                                Solving West Valley City's Toughest <span className="text-[#ec028b]">Open Valley Wind Shears</span> & Extreme Weather Challenges
                            </h1>

                            <p className="text-lg sm:text-xl text-gray-300 font-serif leading-relaxed max-w-[70ch]">
                                As Utah's second-largest municipality, West Valley City properties experience severe open-valley wind shears, relentless summer solar UV baking, and rapid freeze-thaw cycles fluctuating over 80°F in a single day. RHIVE Construction engineers roofs with Owens Corning Duration® 130 MPH SureNail® shingles, GAF EverGuard® TPO/PVC flat membranes, and our direct Lifetime Installer No-Leak Guarantee.
                            </p>

                            <div className="flex flex-wrap gap-4 pt-2">
                                <button
                                    onClick={handleEstimateClick}
                                    className="px-8 py-4 bg-[#ec028b] hover:bg-[#d0027a] text-white font-bold text-base rounded-md transition-all duration-200 shadow-lg shadow-pink-500/20 flex items-center gap-3 cursor-pointer"
                                >
                                    <span>Get Instant West Valley City Estimate</span>
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
                                WVC MUNICIPALITY
                            </div>
                            <h3 className="text-lg font-bold text-white mb-3">West Valley City Micro-Climate Profile</h3>
                            <ul className="space-y-3 text-xs text-gray-300">
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-[#ec028b] shrink-0 mt-0.5" />
                                    <span><strong>Open Valley Winds:</strong> High uplift forces across 3500 South and 5600 West corridors.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-[#ec028b] shrink-0 mt-0.5" />
                                    <span><strong>Summer Solar Bakes:</strong> Intense UV exposure accelerating shingle granule loss.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-[#ec028b] shrink-0 mt-0.5" />
                                    <span><strong>Industrial Flat Roofs:</strong> Heavy commercial GAF TPO/PVC specs in logistics hubs.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-[#ec028b] shrink-0 mt-0.5" />
                                    <span><strong>Thermal Cycling:</strong> 80°F+ single-day fluctuations stressing decking seams.</span>
                                </li>
                            </ul>
                            <div className="mt-6 pt-4 border-t border-gray-800 text-center">
                                <span className="text-xs text-gray-400 font-mono">Permitting: West Valley City Community Development</span>
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
                        <h2 className="text-2xl sm:text-3xl font-bold text-white">West Valley City Environmental Factors & RHIVE Brand Commitment</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm sm:text-base text-gray-300 font-serif leading-relaxed">
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-white font-sans flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-[#ec028b]" /> Regional Environmental Factors & Local Footprint
                            </h3>
                            <p>
                                West Valley City features diverse architectural landscapes, including established residential subdivisions in Granger and Hunter, high-density residential areas near Valley Fair Mall, and extensive industrial and logistics facilities along 3500 South and 5600 West. Roofs face extreme temperature fluctuations ranging over 80°F in a single day, accelerating granule erosion and thermal expansion stress.
                            </p>
                            <p>
                                Full roof replacements in West Valley City require municipal building permits issued through the West Valley City Community Development Department. RHIVE Construction manages 100% of the permitting process, ensuring strict adherence to Utah building codes, perimeter 28-gauge steel drip metal specifications, and eave ice barrier extensions.
                            </p>
                            <p className="text-xs text-gray-400 font-mono">
                                Neighborhood Footprint: Hunter, Granger, West Ridge, 3500 South corridor, 5600 West industrial district, Valley Fair Mall area, and residential zones surrounding the Maverik Center.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-white font-sans flex items-center gap-2">
                                <Award className="w-5 h-5 text-[#ec028b]" /> Radical Cost Transparency & Community Mission
                            </h3>
                            <p>
                                Co-founded by <strong>Kara Robinson (President)</strong> and <strong>Michael Robinson (CEO)</strong>, RHIVE Construction is a female-owned and operated contractor bringing radical cost transparency to West Valley City. We eliminate middleman sales commissions and physical warehouse overhead to keep administrative expenses <strong>under 10%</strong>.
                            </p>
                            <p>
                                Every quote provides an itemized mathematical breakdown showing exact costs for <strong>Materials, Labor, Operating Overhead, and Net Company Profit</strong>. Guided by our slogan <strong>"Finish On Top"</strong> and our ongoing mission of donating complete roof replacements to local veterans, teachers, and first responders, West Valley City property owners receive master-craftsman quality without salesman markups.
                            </p>
                        </div>
                    </div>
                </section>

                {/* PART 2: RESIDENTIAL ROOFING */}
                <section className="bg-gray-950/60 border border-gray-800 p-8 sm:p-10 rounded-xl space-y-8">
                    <div className="space-y-3">
                        <div className="text-xs font-mono text-[#ec028b] uppercase tracking-wider">Part 2: Residential Solutions</div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-white">Residential Roofing Standards for West Valley City Single-Family Homes</h2>
                    </div>

                    <div className="p-6 rounded-lg bg-pink-500/10 border border-pink-500/20 text-gray-200">
                        <h3 className="text-base font-bold text-white font-sans mb-2">Q: What is RHIVE’s residential reroofing standard for West Valley City single-family homes?</h3>
                        <p className="font-serif text-sm sm:text-base text-gray-300 leading-relaxed">
                            <strong>A:</strong> RHIVE enforces a strict <strong>100% full tear-off policy</strong> down to bare OSB decking on all single-family residential replacements in West Valley City. We never perform residential layovers because placing new shingles over old materials traps heat, conceals structural wood rot, adds excessive weight, and voids manufacturer system warranties.
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
                        <h3 className="text-base font-bold text-white font-sans mb-2">Q: What commercial roofing solutions does RHIVE provide in West Valley City?</h3>
                        <p className="font-serif text-sm sm:text-base text-gray-300 leading-relaxed">
                            <strong>A:</strong> As Utah's second-largest city and primary industrial hub, West Valley City properties require heavy-duty commercial roofing. RHIVE serves manufacturing complexes along 2100 South, retail plazas around Valley Fair Mall, corporate offices, churches, banks, and multi-family developments. We engineer and install both <strong>commercial steep-slope architectural shingle systems</strong> (for multi-family, churches, and steep-slope offices) and <strong>certified single-ply flat membrane systems</strong> (TPO/PVC) backed by certified Master Service Agreements (MSAs) and GAF manufacturer warranties.
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
                        <h3 className="text-base font-bold text-white font-sans mb-2">Q: What asphalt shingle products does RHIVE install for West Valley City properties?</h3>
                        <p className="font-serif text-sm sm:text-base text-gray-300 leading-relaxed">
                            <strong>A:</strong> RHIVE Construction is an Owens Corning Preferred Contractor installing the <strong>Duration® Series</strong> with patented <strong>SureNail® Technology</strong> (130 MPH wind uplift rating), <strong>Duration FLEX®</strong> SBS polymer-modified Class 4 Impact Rated shingles for hail resistance and insurance discounts, and <strong>GAF Designer Shingles</strong> (Woodland® / Grand Sequoia®) backed by 50-year non-prorated warranties.
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
                            <p className="text-xs text-gray-400">Woodland® and Grand Sequoia® hand-cut dimensional aesthetics for upscale homes.</p>
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
                        <h3 className="text-base font-bold text-white font-sans mb-2">Q: What are the technical specifications of RHIVE’s flat roof membrane installations in West Valley City?</h3>
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
                        <h2 className="text-2xl sm:text-3xl font-bold text-white">Frequently Asked Questions: West Valley City Roofing</h2>
                        <p className="text-sm text-gray-400 font-serif">
                            Direct answers to common questions asked by homeowners and commercial property managers in West Valley City, Utah.
                        </p>
                    </div>

                    <div className="space-y-4 max-w-4xl mx-auto">
                        {/* FAQ 1 */}
                        <div className="border border-gray-800 rounded-lg overflow-hidden">
                            <button
                                onClick={() => toggleFaq('faq-wvc-wind')}
                                className="w-full p-5 text-left bg-gray-900/90 hover:bg-gray-900 flex justify-between items-center transition-colors cursor-pointer"
                            >
                                <span className="font-bold text-sm sm:text-base text-white">How does RHIVE protect West Valley City roofs against high open-valley wind shears?</span>
                                <ChevronDown className={cn("w-5 h-5 text-[#ec028b] transition-transform duration-200", openFaq === 'faq-wvc-wind' ? "rotate-180" : "")} />
                            </button>
                            {openFaq === 'faq-wvc-wind' && (
                                <div className="p-5 bg-black/60 border-t border-gray-800 space-y-3">
                                    <div className="p-3 bg-pink-500/10 border border-pink-500/20 rounded text-xs text-pink-300 font-mono">
                                        DIRECT ANSWER: We install Owens Corning Duration® shingles with patented SureNail® Technology, holding a certified 130 MPH wind uplift rating with our 6-nail fastening pattern.
                                    </div>
                                    <p className="text-sm text-gray-300 font-serif leading-relaxed">
                                        Open-valley wind sweeps across West Valley City lots from the Oquirrhs. The woven fabric strip in the fastening line prevents nail pull-through during severe wind gusts.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* FAQ 2 */}
                        <div className="border border-gray-800 rounded-lg overflow-hidden">
                            <button
                                onClick={() => toggleFaq('faq-wvc-rapid')}
                                className="w-full p-5 text-left bg-gray-900/90 hover:bg-gray-900 flex justify-between items-center transition-colors cursor-pointer"
                            >
                                <span className="font-bold text-sm sm:text-base text-white">What emergency response options does RHIVE offer for active roof leaks in West Valley City?</span>
                                <ChevronDown className={cn("w-5 h-5 text-[#ec028b] transition-transform duration-200", openFaq === 'faq-wvc-rapid' ? "rotate-180" : "")} />
                            </button>
                            {openFaq === 'faq-wvc-rapid' && (
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
                                onClick={() => toggleFaq('faq-wvc-pricing')}
                                className="w-full p-5 text-left bg-gray-900/90 hover:bg-gray-900 flex justify-between items-center transition-colors cursor-pointer"
                            >
                                <span className="font-bold text-sm sm:text-base text-white">How does RHIVE ensure transparent pricing with zero salesman markup in West Valley City?</span>
                                <ChevronDown className={cn("w-5 h-5 text-[#ec028b] transition-transform duration-200", openFaq === 'faq-wvc-pricing' ? "rotate-180" : "")} />
                            </button>
                            {openFaq === 'faq-wvc-pricing' && (
                                <div className="p-5 bg-black/60 border-t border-gray-800 space-y-3">
                                    <div className="p-3 bg-pink-500/10 border border-pink-500/20 rounded text-xs text-pink-300 font-mono">
                                        DIRECT ANSWER: We operate without commissioned sales representatives or expensive warehouses, keeping administrative overhead under 10%.
                                    </div>
                                    <p className="text-sm text-gray-300 font-serif leading-relaxed">
                                        Every Certified Quote explicitly breaks down the exact cost of Materials, Labor, Operating Overhead, and Net Profit, so you know precisely where every dollar goes.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* FAQ 4 */}
                        <div className="border border-gray-800 rounded-lg overflow-hidden">
                            <button
                                onClick={() => toggleFaq('faq-wvc-tearoff')}
                                className="w-full p-5 text-left bg-gray-900/90 hover:bg-gray-900 flex justify-between items-center transition-colors cursor-pointer"
                            >
                                <span className="font-bold text-sm sm:text-base text-white">What is RHIVE’s residential reroofing standard for West Valley City single-family homes?</span>
                                <ChevronDown className={cn("w-5 h-5 text-[#ec028b] transition-transform duration-200", openFaq === 'faq-wvc-tearoff' ? "rotate-180" : "")} />
                            </button>
                            {openFaq === 'faq-wvc-tearoff' && (
                                <div className="p-5 bg-black/60 border-t border-gray-800 space-y-3">
                                    <div className="p-3 bg-pink-500/10 border border-pink-500/20 rounded text-xs text-pink-300 font-mono">
                                        DIRECT ANSWER: RHIVE enforces a strict 100% full tear-off policy down to bare OSB decking on all single-family residential replacements in West Valley City.
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
                                onClick={() => toggleFaq('faq-wvc-commercial')}
                                className="w-full p-5 text-left bg-gray-900/90 hover:bg-gray-900 flex justify-between items-center transition-colors cursor-pointer"
                            >
                                <span className="font-bold text-sm sm:text-base text-white">What single-ply commercial flat roof options does RHIVE install in West Valley City?</span>
                                <ChevronDown className={cn("w-5 h-5 text-[#ec028b] transition-transform duration-200", openFaq === 'faq-wvc-commercial' ? "rotate-180" : "")} />
                            </button>
                            {openFaq === 'faq-wvc-commercial' && (
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
                                onClick={() => toggleFaq('faq-wvc-shingles')}
                                className="w-full p-5 text-left bg-gray-900/90 hover:bg-gray-900 flex justify-between items-center transition-colors cursor-pointer"
                            >
                                <span className="font-bold text-sm sm:text-base text-white">What asphalt shingle products does RHIVE install for West Valley City properties?</span>
                                <ChevronDown className={cn("w-5 h-5 text-[#ec028b] transition-transform duration-200", openFaq === 'faq-wvc-shingles' ? "rotate-180" : "")} />
                            </button>
                            {openFaq === 'faq-wvc-shingles' && (
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
                                onClick={() => toggleFaq('faq-wvc-permits')}
                                className="w-full p-5 text-left bg-gray-900/90 hover:bg-gray-900 flex justify-between items-center transition-colors cursor-pointer"
                            >
                                <span className="font-bold text-sm sm:text-base text-white">Does West Valley City require a building permit for residential reroofing?</span>
                                <ChevronDown className={cn("w-5 h-5 text-[#ec028b] transition-transform duration-200", openFaq === 'faq-wvc-permits' ? "rotate-180" : "")} />
                            </button>
                            {openFaq === 'faq-wvc-permits' && (
                                <div className="p-5 bg-black/60 border-t border-gray-800 space-y-3">
                                    <div className="p-3 bg-pink-500/10 border border-pink-500/20 rounded text-xs text-pink-300 font-mono">
                                        DIRECT ANSWER: Yes. Full roof replacements in West Valley City require municipal building permits through the West Valley City Community Development Department.
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
                        Protect Your West Valley City Property with Master-Craftsman Precision
                    </h2>
                    <p className="text-gray-300 font-serif max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
                        Get an itemized mathematical estimate with zero salesman pressure, backed by our Lifetime Installer No-Leak Guarantee and 50-year non-prorated material protection.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4 pt-2">
                        <button
                            onClick={handleEstimateClick}
                            className="px-8 py-4 bg-[#ec028b] hover:bg-[#d0027a] text-white font-bold text-base rounded-md transition-all duration-200 shadow-lg shadow-pink-500/20 cursor-pointer flex items-center gap-3"
                        >
                            <span>Calculate Your Instant West Valley City Estimate</span>
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
