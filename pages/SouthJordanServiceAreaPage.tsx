import React, { useEffect, useMemo, useState } from 'react';
import { Phone, Shield, ArrowRight, Zap, MapPin, ChevronDown, Wind, Building2, Layers, CheckCircle2, Wrench, Umbrella, Award } from 'lucide-react';
import { cn } from '../lib/utils';

export default function SouthJordanServiceAreaPage() {
    useEffect(() => {
        document.title = "Top-Rated Roofing Contractor South Jordan UT | RHIVE Construction Headquarters";
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
            metaDesc = document.createElement('meta');
            metaDesc.setAttribute('name', 'description');
            document.head.appendChild(metaDesc);
        }
        metaDesc.setAttribute('content', "RHIVE Construction headquarters in South Jordan, UT. Daybreak & Oquirrh foothill residential shingle replacements, GAF TPO flat roofing, full tear-off, and lifetime guarantees.");
    }, []);

    const [openFaq, setOpenFaq] = useState<string | null>('faq-sj-wind');

    const handleEstimateClick = () => {
        window.location.href = '/estimate-tool';
    };

    const toggleFaq = (id: string) => {
        setOpenFaq(prev => prev === id ? null : id);
    };

    // Granular JSON-LD Schema for South Jordan, UT local SEO & AEO
    const jsonLdSchema = useMemo(() => {
        return {
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "RoofingContractor",
                    "@id": "https://www.rhiveconstruction.com/service-areas/south-jordan-ut/#localbusiness",
                    "name": "RHIVE Construction - South Jordan Headquarters & Service Area",
                    "url": "https://www.rhiveconstruction.com/service-areas/south-jordan-ut",
                    "logo": "https://i.imgur.com/t0VcSgJ.png",
                    "image": "https://i.imgur.com/t0VcSgJ.png",
                    "telephone": "+1-435-417-6637",
                    "email": "office@rhiveconstruction.com",
                    "priceRange": "$$$",
                    "description": "RHIVE Construction delivers precision-engineered residential roofing, commercial facility systems, high-performance asphalt shingles, and certified flat membrane installations across South Jordan, UT.",
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
                        "latitude": 40.5622,
                        "longitude": -111.9297
                    },
                    "areaServed": [
                        {"@type": "City", "name": "South Jordan"},
                        {"@type": "PostalCode", "postalCode": "84009"},
                        {"@type": "PostalCode", "postalCode": "84095"},
                        {"@type": "AdministrativeArea", "name": "Daybreak"},
                        {"@type": "AdministrativeArea", "name": "Glenmoor"},
                        {"@type": "AdministrativeArea", "name": "Redwood Road Corridor"},
                        {"@type": "AdministrativeArea", "name": "Riverfront"},
                        {"@type": "AdministrativeArea", "name": "South Jordan Towne Center"},
                        {"@type": "AdministrativeArea", "name": "Grandville"},
                        {"@type": "AdministrativeArea", "name": "Lake Mountain"}
                    ]
                },
                {
                    "@type": "FAQPage",
                    "@id": "https://www.rhiveconstruction.com/service-areas/south-jordan-ut/#faqpage",
                    "mainEntity": [
                        {
                            "@type": "Question",
                            "name": "How does RHIVE handle high open-valley wind gusts across Daybreak and South Jordan developments?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "We install the Owens Corning Duration® Series equipped with patented SureNail® Technology. The woven fabric strip in the fastening line prevents nail pull-through, maintaining a certified 130 MPH wind uplift rating when installed with our 6-nail pattern."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "Why is South Jordan uniquely significant to RHIVE Construction?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "South Jordan is home to RHIVE Construction's national corporate headquarters located at 10437 Shady Plum Way. Our founders, Kara and Michael Robinson, personally oversee local Wasatch Front operations from our South Jordan office."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "How does RHIVE handle unexpected wood rot discovered during tear-off in South Jordan?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "Every residential reroof includes up to 100 sq ft of 7/16 OSB decking replacement at no extra charge. Any additional sheets needed are billed at pre-agreed contract rates ($72.50 per 7/16 OSB sheet) specified upfront in your agreement."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "What is RHIVE’s residential reroofing standard for South Jordan single-family homes?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "RHIVE enforces a strict 100% full tear-off policy down to bare OSB decking on all single-family reroofs in South Jordan. Every project includes ProArmor® synthetic underlayment, 6+ ft WeatherLock® Ice & Water Shield, 6-nail fastening, and 100 sq ft free OSB decking replacement."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "What commercial roofing solutions does RHIVE provide in South Jordan?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "As a certified GAF commercial installer, RHIVE installs heat-welded GAF EverGuard® TPO and PVC single-ply membranes in 60 mil and heavy-duty 80 mil specifications with Polyiso insulation and DensDeck® cover boards, backed by GAF NDL warranties up to 30 years."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "What asphalt shingle products does RHIVE install in South Jordan?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "RHIVE installs Owens Corning Duration® Series (130 MPH SureNail® wind uplift), Duration FLEX® Class 4 Impact Rated shingles for hail and storm protection, and GAF Designer Shingles (Woodland®/Grand Sequoia®) for high-end aesthetic appeal."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "Does South Jordan require a building permit for residential reroofing?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "Yes. Full roof replacements in South Jordan require municipal building permits through the City of South Jordan Development Services. RHIVE manages 100% of the permitting process to ensure complete building code compliance."
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
                                <MapPin className="w-3.5 h-3.5" /> South Jordan & Daybreak HQ Master Roofing Systems
                            </div>
                            
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight font-sans">
                                Solving South Jordan's Toughest <span className="text-[#ec028b]">Oquirrh Foothill Wind</span> & Rapid Valley Temperature Fluctuation Challenges
                            </h1>

                            <p className="text-lg sm:text-xl text-gray-300 font-serif leading-relaxed max-w-[70ch]">
                                Stretching across the Salt Lake Valley from the Jordan River basin to Daybreak and the Oquirrh foothills, South Jordan properties experience severe open-valley winds, intense UV solar baking, and rapid freeze-thaw cycles. As the home of RHIVE Construction's corporate headquarters, South Jordan rooflines receive local master-craftsman installations utilizing Class 4 impact shingles, SureNail® 130 MPH fastening bands, and our direct Lifetime Installer No-Leak Guarantee.
                            </p>

                            <div className="flex flex-wrap gap-4 pt-2">
                                <button
                                    onClick={handleEstimateClick}
                                    className="px-8 py-4 bg-[#ec028b] hover:bg-[#d0027a] text-white font-bold text-base rounded-md transition-all duration-200 shadow-lg shadow-pink-500/20 flex items-center gap-3 cursor-pointer"
                                >
                                    <span>Get Instant South Jordan Estimate</span>
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
                                    <p className="text-xs text-gray-400">HQ Direct Pricing</p>
                                </div>
                            </div>
                        </div>

                        {/* Visual Highlight Badge */}
                        <div className="w-full lg:w-96 bg-gray-950/80 border border-gray-800 p-6 rounded-xl relative">
                            <div className="absolute -top-3 -right-3 bg-[#ec028b] text-white text-xs font-mono font-bold px-3 py-1 rounded">
                                RHIVE HEADQUARTERS
                            </div>
                            <h3 className="text-lg font-bold text-white mb-3">South Jordan Micro-Climate Profile</h3>
                            <ul className="space-y-3 text-xs text-gray-300">
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-[#ec028b] shrink-0 mt-0.5" />
                                    <span><strong>Oquirrh Wind Shears:</strong> High-velocity gusts sweeping across open Daybreak terrain.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-[#ec028b] shrink-0 mt-0.5" />
                                    <span><strong>Thermal Stress:</strong> Rapid 80°F+ single-day temperature fluctuations across roof decking.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-[#ec028b] shrink-0 mt-0.5" />
                                    <span><strong>Summer Solar Bakes:</strong> Intense UV exposure requiring high-reflectance materials.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-[#ec028b] shrink-0 mt-0.5" />
                                    <span><strong>Daybreak Architecture:</strong> Strict community design standards and aesthetic guidelines.</span>
                                </li>
                            </ul>
                            <div className="mt-6 pt-4 border-t border-gray-800 text-center">
                                <span className="text-xs text-gray-400 font-mono">10437 Shady Plum Way, South Jordan, UT</span>
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
                        <h2 className="text-2xl sm:text-3xl font-bold text-white">South Jordan Environmental Factors & RHIVE Corporate Headquarters</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm sm:text-base text-gray-300 font-serif leading-relaxed">
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-white font-sans flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-[#ec028b]" /> Regional Environmental Factors & Local Footprint
                            </h3>
                            <p>
                                South Jordan features a blend of modern master-planned communities like Daybreak, custom suburban estates, and commercial developments along Redwood Road and South Jordan Parkway. Foothill proximity and open-valley wind corridors demand heavy-gauge steel drip metal and 6-nail fastening patterns to prevent edge lifting and shingle blow-offs.
                            </p>
                            <p>
                                Full roof replacements in South Jordan require municipal building permits issued through the City of South Jordan Development Services. RHIVE Construction manages 100% of the permitting process, ensuring full compliance with local building codes, 28-gauge steel drip metal specifications, and eave ice barrier extensions.
                            </p>
                            <p className="text-xs text-gray-400 font-mono">
                                Neighborhood Footprint: Daybreak, Glenmoor, Redwood Road corridor, Riverfront, South Jordan Towne Center, and foothill developments along Grandville Avenue and Lake Mountain Drive.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-white font-sans flex items-center gap-2">
                                <Award className="w-5 h-5 text-[#ec028b]" /> Hometown Brand Commitment & Radical Transparency
                            </h3>
                            <p>
                                Headquartered directly in South Jordan at <strong>10437 Shady Plum Way</strong>, RHIVE Construction was co-founded by <strong>Kara Robinson (President)</strong> and <strong>Michael Robinson (CEO)</strong>. As a female-owned and operated company, we bring radical cost transparency to our hometown community.
                            </p>
                            <p>
                                We eliminate middleman sales commissions and warehouse overhead to keep administrative expenses <strong>under 10%</strong>. Every quote provides an itemized mathematical breakdown showing exact costs for <strong>Materials, Labor, Operating Overhead, and Net Profit</strong>. Guided by our slogan <strong>"Finish On Top"</strong> and our ongoing mission of donating roofs to local veterans, teachers, and first responders, South Jordan property owners receive master-craftsman quality backed by local founders.
                            </p>
                        </div>
                    </div>
                </section>

                {/* PART 2: RESIDENTIAL ROOFING */}
                <section className="bg-gray-950/60 border border-gray-800 p-8 sm:p-10 rounded-xl space-y-8">
                    <div className="space-y-3">
                        <div className="text-xs font-mono text-[#ec028b] uppercase tracking-wider">Part 2: Residential Solutions</div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-white">Residential Roofing Standards for South Jordan Single-Family Homes</h2>
                    </div>

                    <div className="p-6 rounded-lg bg-pink-500/10 border border-pink-500/20 text-gray-200">
                        <h3 className="text-base font-bold text-white font-sans mb-2">Q: What is RHIVE’s residential reroofing standard for South Jordan single-family homes?</h3>
                        <p className="font-serif text-sm sm:text-base text-gray-300 leading-relaxed">
                            <strong>A:</strong> RHIVE enforces a strict <strong>100% full tear-off policy</strong> down to bare OSB decking on all single-family reroofs in South Jordan. We never perform residential layovers because placing new shingles over old materials traps moisture, conceals deck rot, adds excessive weight, and voids manufacturer warranties.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-5 rounded-lg bg-gray-900 border border-gray-800 space-y-2">
                            <h4 className="text-sm font-bold text-white">Synthetic Field Barrier</h4>
                            <p className="text-xs text-gray-400 font-serif leading-relaxed">
                                <strong>Owens Corning ProArmor®</strong> high-performance synthetic underlayment covering 100% of the roof field.
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
                        <h3 className="text-base font-bold text-white font-sans mb-2">Q: What commercial roofing solutions does RHIVE provide in South Jordan?</h3>
                        <p className="font-serif text-sm sm:text-base text-gray-300 leading-relaxed">
                            <strong>A:</strong> Headquartered in South Jordan, RHIVE provides full-spectrum commercial roofing for Daybreak commercial village centers, corporate plazas along South Jordan Parkway, retail developments, churches, banks, and multi-family communities. We engineer and install both <strong>commercial steep-slope architectural shingle systems</strong> (for multi-family, churches, and steep-slope offices) and <strong>certified single-ply flat membrane systems</strong> (TPO/PVC) backed by certified Master Service Agreements (MSAs) and GAF manufacturer warranties.
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
                        <h3 className="text-base font-bold text-white font-sans mb-2">Q: What asphalt shingle products does RHIVE install in South Jordan?</h3>
                        <p className="font-serif text-sm sm:text-base text-gray-300 leading-relaxed">
                            <strong>A:</strong> RHIVE Construction installs the <strong>Owens Corning Duration® Series</strong> with patented <strong>SureNail® Technology</strong> (130 MPH wind uplift rating), <strong>Duration FLEX®</strong> SBS polymer-modified Class 4 Impact Rated shingles for hail resistance and insurance premium discounts, and <strong>GAF Designer Shingles</strong> (Woodland® / Grand Sequoia®) for high-end aesthetic appeal backed by 50-year non-prorated warranties.
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
                            <p className="text-xs text-gray-400">Woodland® and Grand Sequoia® hand-cut dimensional aesthetics for luxury South Jordan homes.</p>
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
                        <h3 className="text-base font-bold text-white font-sans mb-2">Q: What are the technical specifications of RHIVE’s flat roof membrane installations in South Jordan?</h3>
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
                        <h2 className="text-2xl sm:text-3xl font-bold text-white">Frequently Asked Questions: South Jordan Roofing</h2>
                        <p className="text-sm text-gray-400 font-serif">
                            Direct answers to common questions asked by homeowners and commercial property managers in South Jordan & Daybreak, Utah.
                        </p>
                    </div>

                    <div className="space-y-4 max-w-4xl mx-auto">
                        {/* FAQ 1 */}
                        <div className="border border-gray-800 rounded-lg overflow-hidden">
                            <button
                                onClick={() => toggleFaq('faq-sj-wind')}
                                className="w-full p-5 text-left bg-gray-900/90 hover:bg-gray-900 flex justify-between items-center transition-colors cursor-pointer"
                            >
                                <span className="font-bold text-sm sm:text-base text-white">How does RHIVE handle high open-valley wind gusts across Daybreak and South Jordan developments?</span>
                                <ChevronDown className={cn("w-5 h-5 text-[#ec028b] transition-transform duration-200", openFaq === 'faq-sj-wind' ? "rotate-180" : "")} />
                            </button>
                            {openFaq === 'faq-sj-wind' && (
                                <div className="p-5 bg-black/60 border-t border-gray-800 space-y-3">
                                    <div className="p-3 bg-pink-500/10 border border-pink-500/20 rounded text-xs text-pink-300 font-mono">
                                        DIRECT ANSWER: We install the Owens Corning Duration® Series equipped with patented SureNail® Technology, maintaining a certified 130 MPH wind uplift rating with our 6-nail pattern.
                                    </div>
                                    <p className="text-sm text-gray-300 font-serif leading-relaxed">
                                        Open-valley wind sweeps across Daybreak and South Jordan lots. The embedded woven fabric strip prevents nail pull-through during severe wind events, ensuring shingles stay anchored.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* FAQ 2 */}
                        <div className="border border-gray-800 rounded-lg overflow-hidden">
                            <button
                                onClick={() => toggleFaq('faq-sj-hq')}
                                className="w-full p-5 text-left bg-gray-900/90 hover:bg-gray-900 flex justify-between items-center transition-colors cursor-pointer"
                            >
                                <span className="font-bold text-sm sm:text-base text-white">Why is South Jordan uniquely significant to RHIVE Construction?</span>
                                <ChevronDown className={cn("w-5 h-5 text-[#ec028b] transition-transform duration-200", openFaq === 'faq-sj-hq' ? "rotate-180" : "")} />
                            </button>
                            {openFaq === 'faq-sj-hq' && (
                                <div className="p-5 bg-black/60 border-t border-gray-800 space-y-3">
                                    <div className="p-3 bg-pink-500/10 border border-pink-500/20 rounded text-xs text-pink-300 font-mono">
                                        DIRECT ANSWER: South Jordan is home to RHIVE Construction's national corporate headquarters located at 10437 Shady Plum Way.
                                    </div>
                                    <p className="text-sm text-gray-300 font-serif leading-relaxed">
                                        Our founders, Kara and Michael Robinson, personally oversee local Wasatch Front operations from our South Jordan office, giving local residents direct access to executive leadership.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* FAQ 3 */}
                        <div className="border border-gray-800 rounded-lg overflow-hidden">
                            <button
                                onClick={() => toggleFaq('faq-sj-rot')}
                                className="w-full p-5 text-left bg-gray-900/90 hover:bg-gray-900 flex justify-between items-center transition-colors cursor-pointer"
                            >
                                <span className="font-bold text-sm sm:text-base text-white">How does RHIVE handle unexpected wood rot discovered during tear-off in South Jordan?</span>
                                <ChevronDown className={cn("w-5 h-5 text-[#ec028b] transition-transform duration-200", openFaq === 'faq-sj-rot' ? "rotate-180" : "")} />
                            </button>
                            {openFaq === 'faq-sj-rot' && (
                                <div className="p-5 bg-black/60 border-t border-gray-800 space-y-3">
                                    <div className="p-3 bg-pink-500/10 border border-pink-500/20 rounded text-xs text-pink-300 font-mono">
                                        DIRECT ANSWER: Every residential reroof includes up to 100 sq ft of 7/16 OSB decking replacement at no extra charge.
                                    </div>
                                    <p className="text-sm text-gray-300 font-serif leading-relaxed">
                                        Any additional sheets needed are billed at pre-agreed contract rates ($72.50 per 7/16 OSB sheet) specified upfront in your agreement so there are zero surprise charges.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* FAQ 4 */}
                        <div className="border border-gray-800 rounded-lg overflow-hidden">
                            <button
                                onClick={() => toggleFaq('faq-sj-tearoff')}
                                className="w-full p-5 text-left bg-gray-900/90 hover:bg-gray-900 flex justify-between items-center transition-colors cursor-pointer"
                            >
                                <span className="font-bold text-sm sm:text-base text-white">What is RHIVE’s residential reroofing standard for South Jordan single-family homes?</span>
                                <ChevronDown className={cn("w-5 h-5 text-[#ec028b] transition-transform duration-200", openFaq === 'faq-sj-tearoff' ? "rotate-180" : "")} />
                            </button>
                            {openFaq === 'faq-sj-tearoff' && (
                                <div className="p-5 bg-black/60 border-t border-gray-800 space-y-3">
                                    <div className="p-3 bg-pink-500/10 border border-pink-500/20 rounded text-xs text-pink-300 font-mono">
                                        DIRECT ANSWER: RHIVE enforces a strict 100% full tear-off policy down to bare OSB decking on all single-family reroofs in South Jordan.
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
                                onClick={() => toggleFaq('faq-sj-commercial')}
                                className="w-full p-5 text-left bg-gray-900/90 hover:bg-gray-900 flex justify-between items-center transition-colors cursor-pointer"
                            >
                                <span className="font-bold text-sm sm:text-base text-white">What commercial roofing solutions does RHIVE provide in South Jordan?</span>
                                <ChevronDown className={cn("w-5 h-5 text-[#ec028b] transition-transform duration-200", openFaq === 'faq-sj-commercial' ? "rotate-180" : "")} />
                            </button>
                            {openFaq === 'faq-sj-commercial' && (
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
                                onClick={() => toggleFaq('faq-sj-shingles')}
                                className="w-full p-5 text-left bg-gray-900/90 hover:bg-gray-900 flex justify-between items-center transition-colors cursor-pointer"
                            >
                                <span className="font-bold text-sm sm:text-base text-white">What asphalt shingle products does RHIVE install in South Jordan?</span>
                                <ChevronDown className={cn("w-5 h-5 text-[#ec028b] transition-transform duration-200", openFaq === 'faq-sj-shingles' ? "rotate-180" : "")} />
                            </button>
                            {openFaq === 'faq-sj-shingles' && (
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
                                onClick={() => toggleFaq('faq-sj-permits')}
                                className="w-full p-5 text-left bg-gray-900/90 hover:bg-gray-900 flex justify-between items-center transition-colors cursor-pointer"
                            >
                                <span className="font-bold text-sm sm:text-base text-white">Does South Jordan require a building permit for residential reroofing?</span>
                                <ChevronDown className={cn("w-5 h-5 text-[#ec028b] transition-transform duration-200", openFaq === 'faq-sj-permits' ? "rotate-180" : "")} />
                            </button>
                            {openFaq === 'faq-sj-permits' && (
                                <div className="p-5 bg-black/60 border-t border-gray-800 space-y-3">
                                    <div className="p-3 bg-pink-500/10 border border-pink-500/20 rounded text-xs text-pink-300 font-mono">
                                        DIRECT ANSWER: Yes. Full roof replacements in South Jordan require municipal building permits through the City of South Jordan Development Services.
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
                        Protect Your South Jordan Property with Master-Craftsman Precision
                    </h2>
                    <p className="text-gray-300 font-serif max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
                        Get an itemized mathematical estimate directly from our South Jordan headquarters, backed by our Lifetime Installer No-Leak Guarantee and 50-year non-prorated material protection.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4 pt-2">
                        <button
                            onClick={handleEstimateClick}
                            className="px-8 py-4 bg-[#ec028b] hover:bg-[#d0027a] text-white font-bold text-base rounded-md transition-all duration-200 shadow-lg shadow-pink-500/20 cursor-pointer flex items-center gap-3"
                        >
                            <span>Calculate Your Instant South Jordan Estimate</span>
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
