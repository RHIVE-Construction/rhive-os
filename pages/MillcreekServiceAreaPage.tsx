import React, { useEffect, useMemo, useState } from 'react';
import { Phone, Shield, ArrowRight, Zap, MapPin, ChevronDown, Wind, Snowflake, Building2, Layers, CheckCircle2, Wrench, Umbrella, Award } from 'lucide-react';
import { cn } from '../lib/utils';

export default function MillcreekServiceAreaPage() {
    useEffect(() => {
        document.title = "Top-Rated Roofing Contractor Millcreek UT | RHIVE Construction";
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
            metaDesc = document.createElement('meta');
            metaDesc.setAttribute('name', 'description');
            document.head.appendChild(metaDesc);
        }
        metaDesc.setAttribute('content', "Top-rated residential & commercial roofing in Millcreek, UT & Canyon Rim. Owens Corning Duration 130 MPH shingles, GAF TPO/PVC flat roofs, 100% full tear-off, and lifetime guarantee.");
    }, []);

    const [openFaq, setOpenFaq] = useState<string | null>('faq-millcreek-ice-dams');

    const handleEstimateClick = () => {
        window.location.href = '/estimate-tool';
    };

    const toggleFaq = (id: string) => {
        setOpenFaq(prev => prev === id ? null : id);
    };

    // Granular JSON-LD Schema for Millcreek, UT local SEO & AEO
    const jsonLdSchema = useMemo(() => {
        return {
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "RoofingContractor",
                    "@id": "https://www.rhiveconstruction.com/service-areas/millcreek-ut/#localbusiness",
                    "name": "RHIVE Construction - Millcreek Service Area",
                    "url": "https://www.rhiveconstruction.com/service-areas/millcreek-ut",
                    "logo": "https://i.imgur.com/t0VcSgJ.png",
                    "image": "https://i.imgur.com/t0VcSgJ.png",
                    "telephone": "+1-435-417-6637",
                    "email": "office@rhiveconstruction.com",
                    "priceRange": "$$$",
                    "description": "RHIVE Construction delivers precision-engineered residential roofing, commercial facility systems, high-performance asphalt shingles, and certified flat membrane installations across Millcreek, UT.",
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
                        "latitude": 40.6974,
                        "longitude": -111.8344
                    },
                    "areaServed": [
                        {"@type": "City", "name": "Millcreek"},
                        {"@type": "PostalCode", "postalCode": "84106"},
                        {"@type": "PostalCode", "postalCode": "84109"},
                        {"@type": "PostalCode", "postalCode": "84124"},
                        {"@type": "AdministrativeArea", "name": "East Millcreek"},
                        {"@type": "AdministrativeArea", "name": "Canyon Rim"},
                        {"@type": "AdministrativeArea", "name": "Mount Olympus Foothills"},
                        {"@type": "AdministrativeArea", "name": "Evergreen"}
                    ]
                },
                {
                    "@type": "FAQPage",
                    "@id": "https://www.rhiveconstruction.com/service-areas/millcreek-ut/#faqpage",
                    "mainEntity": [
                        {
                            "@type": "Question",
                            "name": "How does RHIVE protect Millcreek foothill homes from severe ice damming?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "We install a minimum 6-foot continuous eave coverage of self-adhering Owens Corning WeatherLock® Ice & Water Shield paired with self-regulating heat trace cables (5W/lin ft, 110V) controlled by intelligent thermostats."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "Why are custom continuous rain gutters essential for Millcreek homes?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "Dense tree canopy shedding and high water volumes require continuous heavy-gauge 5-inch or 6-inch aluminum rain gutters custom-formed on-site. We space hidden screw-in hangers tightly at every 24 inches (exceeding standard 30-inch spacing) to support heavy winter snow and ice loads."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "How fast can RHIVE dispatch an emergency repair crew to a leaking roof in Millcreek?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "Through our Quantum Rapid-Response Protocol, we dispatch emergency crews for pitched-roof synthetic tarping or flat membrane heat-welded containment. Emergency tarping carries a flat $350 fee, and 100% of this $350 fee is credited back toward your permanent repair or full replacement."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "What is RHIVE’s residential reroofing standard for Millcreek single-family homes?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "RHIVE enforces a strict 100% full tear-off policy down to bare OSB decking on all single-family reroofs in Millcreek. Every replacement includes ProArmor® synthetic underlayment, 6+ ft WeatherLock® Ice & Water Shield, 6-nail fastening, and 100 sq ft free OSB decking replacement."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "What single-ply commercial flat roof options does RHIVE install in Millcreek?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "As a certified GAF commercial installer, RHIVE installs GAF EverGuard® TPO and PVC single-ply membranes (60/80 mil), executes single-layer commercial layovers, and provides GAF No Dollar Limit (NDL) Guarantees up to 30 years covering 100% of material and labor defect costs."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "What asphalt shingle products does RHIVE install for Millcreek properties?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "We install Owens Corning Duration® (130 MPH SureNail® warranty), Duration FLEX® Class 4 Impact Rated shingles, and GAF Designer Shingles backed by 50-year non-prorated material coverage."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "What are the technical specifications of RHIVE’s flat roof membrane installations in Millcreek?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "Our flat roofing assemblies feature GAF EverGuard® TPO and PVC membranes, mechanically attached Polyiso thermal insulation, custom-tapered boards around drains and scuppers to ensure positive water drainage, high-density DensDeck® gypsum cover boards, and fusion hot-air welded seams."
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
                        Millcreek, UT • Canyon Rim &amp; Foothill Authority
                    </span>
                </div>

                <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold uppercase tracking-tight text-white mb-4 leading-tight">
                    Engineered Roofing Systems for<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-rhive-pink">
                        Millcreek, Utah
                    </span>
                </h1>

                <div className="text-base sm:text-xl font-serif italic text-rhive-pink mb-6">
                    Millcreek Canyon Wind Defense. 100% Tear-Off Standard. Lifetime No-Leak Protection.
                </div>

                {/* Local Problem Callout */}
                <div className="p-5 sm:p-6 bg-white/[0.02] border border-white/10 rounded-2xl max-w-4xl mx-auto mb-8 text-left">
                    <div className="flex items-center gap-2 text-xs font-mono uppercase font-bold text-rhive-pink mb-2">
                        <Snowflake className="w-4 h-4" /> Solving Millcreek's Toughest Foothill Wind &amp; Heavy Tree Canopy Ice Damming Challenges
                    </div>
                    <p className="text-sm sm:text-base text-gray-200 font-serif leading-relaxed">
                        Stretching from the valley floor up into the Wasatch foothills at the mouth of Millcreek Canyon, properties in Millcreek face demanding weather. Dense mature shade tree canopies block winter sunlight, preventing snowpack from melting evenly and creating severe eave ice dams. Meanwhile, downslope canyon wind gusts frequently exceed 70 MPH, dislodging standard shingles. Millcreek rooflines demand polymer-modified Class 4 impact shingles, high-wind SureNail® fastening bands, and commercial-grade eave heat trace systems.
                    </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-4">
                    <button
                        onClick={handleEstimateClick}
                        className="bg-rhive-pink hover:bg-[#d4007b] text-white font-bold text-xs sm:text-sm uppercase tracking-widest px-8 py-3.5 rounded-full shadow-[0_0_15px_rgba(236,2,139,0.4)] transition-all hover:scale-105 cursor-pointer"
                    >
                        Configure Millcreek Estimate
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
                    Location-Specific Content for Millcreek, UT
                </h2>

                <div className="p-6 bg-white/[0.02] border border-white/10 rounded-2xl space-y-4 mb-6">
                    <h3 className="text-lg font-bold text-white">Regional Environmental Factors &amp; Local Footprint</h3>
                    <p className="text-sm sm:text-base text-gray-300 font-serif leading-relaxed">
                        Millcreek features a distinct mix of historic residential ranch homes, custom hillside estates, and mountain-adjacent commercial properties. Tree canopy debris (leaves, needles, and twigs) frequently accumulates in roof valleys and gutters, trapping moisture and accelerating shingle decay if not properly managed.
                    </p>
                    <div className="grid sm:grid-cols-2 gap-4 pt-2">
                        <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                            <div className="text-xs font-mono text-rhive-pink font-bold uppercase mb-1">Municipal Permitting &amp; Compliance</div>
                            <p className="text-xs sm:text-sm text-gray-300 font-serif">
                                Full roof replacements in Millcreek require municipal building permits issued through the City of Millcreek Community Development Department. RHIVE Construction handles 100% of the permitting process, ensuring full compliance with Utah building codes, 28-gauge steel drip metal specifications, and eave ice barrier extensions.
                            </p>
                        </div>
                        <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                            <div className="text-xs font-mono text-emerald-400 font-bold uppercase mb-1">Local Service Footprint</div>
                            <p className="text-xs sm:text-sm text-gray-300 font-serif">
                                Our service footprint covers all Millcreek neighborhoods, including East Millcreek, Canyon Rim, Mount Olympus foothill areas, Evergreen, Highland Drive, and boundaries adjoining Holladay and Salt Lake City.
                            </p>
                        </div>
                    </div>
                    <div className="pt-2 border-t border-white/10 text-xs sm:text-sm text-gray-300 font-serif leading-relaxed">
                        Founded by <strong>Kara Robinson</strong> (President) and <strong>Michael Robinson</strong> (CEO), RHIVE Construction brings complete cost transparency to Millcreek. We eliminate sales commissions and physical warehouse overhead to keep administrative expenses <strong>under 10%</strong>. Every quote includes an itemized breakdown showing exact costs for <strong>Materials, Labor, Operating Overhead (&lt;10%), and Net Profit</strong>. Guided by our slogan <strong>"Finish On Top"</strong> and our ongoing mission of donating complete roof replacements to local veterans, teachers, and first responders, Millcreek homeowners receive master-craftsman quality without salesman markups.
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
                    Residential Roofing in Millcreek, UT
                </h2>

                <div className="p-6 bg-white/[0.02] border border-white/10 rounded-2xl space-y-4">
                    <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs uppercase font-bold">
                        <Shield size={14} /> Strict 100% Full Tear-Off Policy
                    </div>
                    <h3 className="text-lg font-bold text-white">Zero Residential Layovers on Millcreek Homes</h3>
                    <p className="text-sm sm:text-base text-gray-300 font-serif leading-relaxed">
                        RHIVE enforces a strict <strong>100% full tear-off policy</strong> down to bare OSB decking on all single-family reroofs in Millcreek. We never perform residential layovers because placing new shingles over old materials traps moisture, conceals structural wood rot, adds excessive weight, and voids manufacturer warranties.
                    </p>
                    <div className="grid sm:grid-cols-2 gap-4 pt-2">
                        <div className="p-4 bg-black/40 border border-white/5 rounded-xl space-y-2">
                            <div className="text-xs font-mono text-rhive-pink font-bold uppercase">Synthetic Barrier</div>
                            <p className="text-xs sm:text-sm text-gray-300 font-serif">
                                100% field coverage with <strong>Owens Corning ProArmor®</strong> synthetic underlayment.
                            </p>
                        </div>
                        <div className="p-4 bg-black/40 border border-white/5 rounded-xl space-y-2">
                            <div className="text-xs font-mono text-rhive-pink font-bold uppercase">Ice &amp; Water Shield</div>
                            <p className="text-xs sm:text-sm text-gray-300 font-serif">
                                A minimum of <strong>6 feet of Owens Corning WeatherLock®</strong> self-adhering membrane along eaves and valleys (extending well past the 24-inch IRC warm-wall code).
                            </p>
                        </div>
                        <div className="p-4 bg-black/40 border border-white/5 rounded-xl space-y-2">
                            <div className="text-xs font-mono text-rhive-pink font-bold uppercase">Precision Fastening &amp; Decking</div>
                            <p className="text-xs sm:text-sm text-gray-300 font-serif">
                                Electro-galvanized coil nails driven in a strict <strong>6-nail pattern per shingle</strong> through the SureNail strip. Up to <strong>100 sq ft of 7/16 OSB decking replacement included</strong> at no extra charge.
                            </p>
                        </div>
                        <div className="p-4 bg-black/40 border border-white/5 rounded-xl space-y-2">
                            <div className="text-xs font-mono text-rhive-pink font-bold uppercase">Payment &amp; Guarantees</div>
                            <p className="text-xs sm:text-sm text-gray-300 font-serif">
                                Executed on our <strong>50/40/10 milestone schedule</strong>, protected by Utah's <strong>Statutory 3-Day Right of Rescission</strong>, the <strong>RPSP 10% credit (up to $1,000)</strong>, and RHIVE's direct <strong>Lifetime Installer No-Leak Guarantee</strong>.
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
                    Commercial Roofing in Millcreek, UT
                </h2>

                <div className="p-6 bg-white/[0.02] border border-white/10 rounded-2xl space-y-4">
                    <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase font-bold">
                        <Building2 size={14} /> Certified Commercial Roofing Contractor
                    </div>
                    <p className="text-sm sm:text-base text-gray-300 font-serif leading-relaxed">
                        RHIVE delivers full commercial roofing services throughout Millcreek, serving the Millcreek Common commercial district, retail plazas along 3300 South, medical offices, churches, banks, and multi-family communities. We engineer both commercial steep-slope architectural shingle systems and low-slope membrane solutions under certified Master Service Agreements (MSAs).
                    </p>
                    <div className="grid sm:grid-cols-2 gap-4 pt-2">
                        <div className="p-4 bg-black/40 border border-white/5 rounded-xl space-y-1">
                            <div className="text-xs font-mono text-cyan-400 font-bold uppercase">Commercial Facility Systems</div>
                            <p className="text-xs sm:text-sm text-gray-300 font-serif">
                                Complete engineering for both <strong>commercial steep-slope architectural shingles</strong> and <strong>certified low-slope single-ply membrane systems</strong> customized to East Bench snowmelt dynamics.
                            </p>
                        </div>
                        <div className="p-4 bg-black/40 border border-white/5 rounded-xl space-y-1">
                            <div className="text-xs font-mono text-cyan-400 font-bold uppercase">Commercial Code Layover</div>
                            <p className="text-xs sm:text-sm text-gray-300 font-serif">
                                Under active Utah building codes, a <strong>single-layer commercial layover</strong> is approved if underlying insulation and decking are dry and sound, saving substantial disposal fees.
                            </p>
                        </div>
                        <div className="p-4 bg-black/40 border border-white/5 rounded-xl space-y-1">
                            <div className="text-xs font-mono text-cyan-400 font-bold uppercase">GAF NDL Guarantees</div>
                            <p className="text-xs sm:text-sm text-gray-300 font-serif">
                                Commercial installations qualify for <strong>GAF No Dollar Limit (NDL) Commercial Guarantees</strong> up to 30 years, covering 100% of material and labor defect costs with no payout cap.
                            </p>
                        </div>
                        <div className="p-4 bg-black/40 border border-white/5 rounded-xl space-y-1">
                            <div className="text-xs font-mono text-cyan-400 font-bold uppercase">Commercial RPSP</div>
                            <p className="text-xs sm:text-sm text-gray-300 font-serif">
                                Commercial accounts qualify for our <strong>Commercial RPSP credit</strong> (10% efficiency credit up to $3,000) for estimates approved within 7 days.
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
                    Asphalt Roofing in Millcreek, UT
                </h2>

                <div className="p-6 bg-white/[0.02] border border-white/10 rounded-2xl space-y-4">
                    <div className="flex items-center gap-2 text-rhive-pink font-mono text-xs uppercase font-bold">
                        <Layers size={14} /> Owens Corning Preferred Contractor
                    </div>
                    <p className="text-sm sm:text-base text-gray-300 font-serif leading-relaxed">
                        RHIVE Construction is an Owens Corning Preferred Contractor specializing in high-performance architectural shingle systems engineered for high-wind stability:
                    </p>
                    <div className="grid sm:grid-cols-2 gap-4 pt-2">
                        <div className="p-4 bg-black/40 border border-white/5 rounded-xl space-y-2">
                            <div className="text-xs font-mono text-rhive-pink font-bold uppercase">Owens Corning Duration® Series</div>
                            <p className="text-xs sm:text-sm text-gray-300 font-serif">
                                Featuring patented <strong>SureNail® Technology</strong> with embedded woven fabric strip delivering a certified <strong>130 MPH wind uplift warranty</strong> and 25-Year StreakGuard™ Algae Resistance Protection.
                            </p>
                        </div>
                        <div className="p-4 bg-black/40 border border-white/5 rounded-xl space-y-2">
                            <div className="text-xs font-mono text-rhive-pink font-bold uppercase">Owens Corning Duration FLEX®</div>
                            <p className="text-xs sm:text-sm text-gray-300 font-serif">
                                SBS polymer-modified Class 4 Impact Rated shingle that absorbs impact from hail and wind-blown debris without cracking, qualifying homeowners for 20–30% insurance premium discounts.
                            </p>
                        </div>
                        <div className="p-4 bg-black/40 border border-white/5 rounded-xl space-y-2">
                            <div className="text-xs font-mono text-rhive-pink font-bold uppercase">GAF Designer Shingles</div>
                            <p className="text-xs sm:text-sm text-gray-300 font-serif">
                                For luxury estate homes, we install <strong>GAF Woodland® and Grand Sequoia® Designer Shingles</strong>, offering hand-cut wood-shake dimensional aesthetics backed by GAF System Plus® 50-year non-prorated coverage.
                            </p>
                        </div>
                        <div className="p-4 bg-black/40 border border-white/5 rounded-xl space-y-2">
                            <div className="text-xs font-mono text-rhive-pink font-bold uppercase">50-Year Non-Prorated Warranty</div>
                            <p className="text-xs sm:text-sm text-gray-300 font-serif">
                                Backed by Owens Corning Preferred Protection offering <strong>50 years of non-prorated material coverage</strong>.
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
                    Flat Roofing in Millcreek, UT
                </h2>

                <div className="p-6 bg-white/[0.02] border border-white/10 rounded-2xl space-y-4">
                    <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase font-bold">
                        <Building2 size={14} /> High Thermal Efficiency &amp; Leak Defense
                    </div>
                    <p className="text-sm sm:text-base text-gray-300 font-serif leading-relaxed">
                        RHIVE’s flat and low-slope single-ply membrane systems provide high thermal efficiency and continuous leak defense:
                    </p>
                    <div className="grid sm:grid-cols-2 gap-4 pt-2">
                        <div className="p-4 bg-black/40 border border-white/5 rounded-xl space-y-2">
                            <div className="text-xs font-mono text-cyan-400 font-bold uppercase">GAF EverGuard® TPO (60/80 mil)</div>
                            <p className="text-xs sm:text-sm text-gray-300 font-serif">
                                Highly reflective white thermoplastic membrane (Energy Star rated) that reflects solar radiation, keeping building interiors cool and reducing summer HVAC cooling bills.
                            </p>
                        </div>
                        <div className="p-4 bg-black/40 border border-white/5 rounded-xl space-y-2">
                            <div className="text-xs font-mono text-cyan-400 font-bold uppercase">GAF EverGuard® PVC (60/80 mil)</div>
                            <p className="text-xs sm:text-sm text-gray-300 font-serif">
                                Specifically formulated for high chemical, oil, grease, and fire resistance—essential for commercial kitchens, automotive centers, and industrial facilities.
                            </p>
                        </div>
                        <div className="p-4 bg-black/40 border border-white/5 rounded-xl space-y-2">
                            <div className="text-xs font-mono text-cyan-400 font-bold uppercase">Insulation &amp; Board Assembly</div>
                            <p className="text-xs sm:text-sm text-gray-300 font-serif">
                                Mechanically attached <strong>Polyiso thermal insulation boards</strong>, custom-tapered Polyiso around drains and scuppers to ensure positive water drainage, and high-density <strong>DensDeck® gypsum cover boards</strong>.
                            </p>
                        </div>
                        <div className="p-4 bg-black/40 border border-white/5 rounded-xl space-y-2">
                            <div className="text-xs font-mono text-cyan-400 font-bold uppercase">Fusion Heat-Welded Seams</div>
                            <p className="text-xs sm:text-sm text-gray-300 font-serif">
                                All field seams, corner details, and parapet wall flashings are fusion heat-welded using hot air to create a monolithic, watertight bond.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Comprehensive Q&A Accordion Hub for Millcreek */}
            <section className="relative z-10 py-14 px-6 max-w-5xl mx-auto border-t border-white/10">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rhive-pink/10 border border-rhive-pink/20 text-rhive-pink font-mono text-xs uppercase mb-3">
                        <Zap className="w-3.5 h-3.5" /> High-Intent Answer Engine
                    </div>
                    <h2 className="text-xl sm:text-3xl font-extrabold uppercase tracking-tight text-white mb-3">
                        Frequently Asked Questions by Millcreek Property Owners
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-400 max-w-[70ch] mx-auto font-serif">
                        Direct, verified technical answers for residential and commercial roofing projects across Millcreek and Canyon Rim.
                    </p>
                </div>

                <div className="space-y-4">
                    {/* FAQ 1: Ice Dams */}
                    <div className="border border-white/10 bg-white/[0.015] rounded-xl overflow-hidden">
                        <button
                            onClick={() => toggleFaq('faq-millcreek-ice-dams')}
                            className="w-full text-left p-5 flex justify-between items-center gap-4 hover:bg-white/[0.02] cursor-pointer"
                        >
                            <span className="text-sm sm:text-base font-bold text-white">
                                How does RHIVE protect Millcreek foothill homes from severe ice damming?
                            </span>
                            <ChevronDown className={cn("w-4 h-4 text-rhive-pink transition-transform", openFaq === 'faq-millcreek-ice-dams' && "rotate-180")} />
                        </button>
                        {openFaq === 'faq-millcreek-ice-dams' && (
                            <div className="p-5 pt-0 space-y-3 border-t border-white/5">
                                <div className="p-3.5 rounded-lg bg-rhive-pink/10 border border-rhive-pink/20">
                                    <div className="text-xs font-mono font-bold text-rhive-pink uppercase mb-1 flex items-center gap-1.5">
                                        <Zap className="w-3.5 h-3.5" /> Direct Answer Summary
                                    </div>
                                    <p className="text-xs sm:text-sm text-white font-sans leading-relaxed">
                                        We install a minimum 6-foot continuous eave coverage of self-adhering Owens Corning WeatherLock® Ice &amp; Water Shield paired with self-regulating heat trace cables (5W/lin ft, 110V) controlled by intelligent thermostats.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* FAQ 2: Gutters */}
                    <div className="border border-white/10 bg-white/[0.015] rounded-xl overflow-hidden">
                        <button
                            onClick={() => toggleFaq('faq-millcreek-gutters')}
                            className="w-full text-left p-5 flex justify-between items-center gap-4 hover:bg-white/[0.02] cursor-pointer"
                        >
                            <span className="text-sm sm:text-base font-bold text-white">
                                Why are custom continuous rain gutters essential for Millcreek homes?
                            </span>
                            <ChevronDown className={cn("w-4 h-4 text-rhive-pink transition-transform", openFaq === 'faq-millcreek-gutters' && "rotate-180")} />
                        </button>
                        {openFaq === 'faq-millcreek-gutters' && (
                            <div className="p-5 pt-0 space-y-3 border-t border-white/5">
                                <div className="p-3.5 rounded-lg bg-rhive-pink/10 border border-rhive-pink/20">
                                    <div className="text-xs font-mono font-bold text-rhive-pink uppercase mb-1 flex items-center gap-1.5">
                                        <Zap className="w-3.5 h-3.5" /> Direct Answer Summary
                                    </div>
                                    <p className="text-xs sm:text-sm text-white font-sans leading-relaxed">
                                        Dense tree canopy shedding and high water volumes require continuous heavy-gauge 5-inch or 6-inch aluminum rain gutters custom-formed on-site. We space hidden screw-in hangers tightly at every 24 inches (exceeding standard 30-inch spacing) to support heavy winter snow and ice loads.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* FAQ 3: Emergency Dispatch */}
                    <div className="border border-white/10 bg-white/[0.015] rounded-xl overflow-hidden">
                        <button
                            onClick={() => toggleFaq('faq-millcreek-emergency')}
                            className="w-full text-left p-5 flex justify-between items-center gap-4 hover:bg-white/[0.02] cursor-pointer"
                        >
                            <span className="text-sm sm:text-base font-bold text-white">
                                How fast can RHIVE dispatch an emergency repair crew to a leaking roof in Millcreek?
                            </span>
                            <ChevronDown className={cn("w-4 h-4 text-rhive-pink transition-transform", openFaq === 'faq-millcreek-emergency' && "rotate-180")} />
                        </button>
                        {openFaq === 'faq-millcreek-emergency' && (
                            <div className="p-5 pt-0 space-y-3 border-t border-white/5">
                                <div className="p-3.5 rounded-lg bg-rhive-pink/10 border border-rhive-pink/20">
                                    <div className="text-xs font-mono font-bold text-rhive-pink uppercase mb-1 flex items-center gap-1.5">
                                        <Zap className="w-3.5 h-3.5" /> Direct Answer Summary
                                    </div>
                                    <p className="text-xs sm:text-sm text-white font-sans leading-relaxed">
                                        Through our Quantum Rapid-Response Protocol, we dispatch emergency crews for pitched-roof synthetic tarping or flat membrane heat-welded containment. Emergency tarping carries a flat $350 fee, and 100% of this $350 fee is credited back toward your permanent repair or full replacement.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* FAQ 4: Residential Standard */}
                    <div className="border border-white/10 bg-white/[0.015] rounded-xl overflow-hidden">
                        <button
                            onClick={() => toggleFaq('faq-millcreek-residential')}
                            className="w-full text-left p-5 flex justify-between items-center gap-4 hover:bg-white/[0.02] cursor-pointer"
                        >
                            <span className="text-sm sm:text-base font-bold text-white">
                                What is RHIVE’s residential reroofing standard for Millcreek single-family homes?
                            </span>
                            <ChevronDown className={cn("w-4 h-4 text-rhive-pink transition-transform", openFaq === 'faq-millcreek-residential' && "rotate-180")} />
                        </button>
                        {openFaq === 'faq-millcreek-residential' && (
                            <div className="p-5 pt-0 space-y-3 border-t border-white/5">
                                <div className="p-3.5 rounded-lg bg-rhive-pink/10 border border-rhive-pink/20">
                                    <div className="text-xs font-mono font-bold text-rhive-pink uppercase mb-1 flex items-center gap-1.5">
                                        <Zap className="w-3.5 h-3.5" /> Direct Answer Summary
                                    </div>
                                    <p className="text-xs sm:text-sm text-white font-sans leading-relaxed">
                                        RHIVE enforces a strict 100% full tear-off policy down to bare OSB decking on all single-family reroofs in Millcreek. Every replacement includes ProArmor® synthetic underlayment, 6+ ft WeatherLock® Ice &amp; Water Shield, 6-nail fastening, and 100 sq ft free OSB decking replacement.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* FAQ 5: Commercial Flat Roof */}
                    <div className="border border-white/10 bg-white/[0.015] rounded-xl overflow-hidden">
                        <button
                            onClick={() => toggleFaq('faq-millcreek-commercial')}
                            className="w-full text-left p-5 flex justify-between items-center gap-4 hover:bg-white/[0.02] cursor-pointer"
                        >
                            <span className="text-sm sm:text-base font-bold text-white">
                                What single-ply commercial flat roof options does RHIVE install in Millcreek?
                            </span>
                            <ChevronDown className={cn("w-4 h-4 text-rhive-pink transition-transform", openFaq === 'faq-millcreek-commercial' && "rotate-180")} />
                        </button>
                        {openFaq === 'faq-millcreek-commercial' && (
                            <div className="p-5 pt-0 space-y-3 border-t border-white/5">
                                <div className="p-3.5 rounded-lg bg-rhive-pink/10 border border-rhive-pink/20">
                                    <div className="text-xs font-mono font-bold text-rhive-pink uppercase mb-1 flex items-center gap-1.5">
                                        <Zap className="w-3.5 h-3.5" /> Direct Answer Summary
                                    </div>
                                    <p className="text-xs sm:text-sm text-white font-sans leading-relaxed">
                                        As a certified GAF commercial installer, RHIVE installs GAF EverGuard® TPO and PVC single-ply membranes (60/80 mil), executes single-layer commercial layovers, and provides GAF No Dollar Limit (NDL) Guarantees up to 30 years covering 100% of material and labor defect costs.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* FAQ 6: Asphalt Products */}
                    <div className="border border-white/10 bg-white/[0.015] rounded-xl overflow-hidden">
                        <button
                            onClick={() => toggleFaq('faq-millcreek-asphalt')}
                            className="w-full text-left p-5 flex justify-between items-center gap-4 hover:bg-white/[0.02] cursor-pointer"
                        >
                            <span className="text-sm sm:text-base font-bold text-white">
                                What asphalt shingle products does RHIVE install for Millcreek properties?
                            </span>
                            <ChevronDown className={cn("w-4 h-4 text-rhive-pink transition-transform", openFaq === 'faq-millcreek-asphalt' && "rotate-180")} />
                        </button>
                        {openFaq === 'faq-millcreek-asphalt' && (
                            <div className="p-5 pt-0 space-y-3 border-t border-white/5">
                                <div className="p-3.5 rounded-lg bg-rhive-pink/10 border border-rhive-pink/20">
                                    <div className="text-xs font-mono font-bold text-rhive-pink uppercase mb-1 flex items-center gap-1.5">
                                        <Zap className="w-3.5 h-3.5" /> Direct Answer Summary
                                    </div>
                                    <p className="text-xs sm:text-sm text-white font-sans leading-relaxed">
                                        We install Owens Corning Duration® (130 MPH SureNail® warranty), Duration FLEX® Class 4 Impact Rated shingles, and GAF Designer Shingles backed by 50-year non-prorated material coverage.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* FAQ 7: Flat Membrane Specs */}
                    <div className="border border-white/10 bg-white/[0.015] rounded-xl overflow-hidden">
                        <button
                            onClick={() => toggleFaq('faq-millcreek-flat')}
                            className="w-full text-left p-5 flex justify-between items-center gap-4 hover:bg-white/[0.02] cursor-pointer"
                        >
                            <span className="text-sm sm:text-base font-bold text-white">
                                What are the technical specifications of RHIVE’s flat roof membrane installations in Millcreek?
                            </span>
                            <ChevronDown className={cn("w-4 h-4 text-rhive-pink transition-transform", openFaq === 'faq-millcreek-flat' && "rotate-180")} />
                        </button>
                        {openFaq === 'faq-millcreek-flat' && (
                            <div className="p-5 pt-0 space-y-3 border-t border-white/5">
                                <div className="p-3.5 rounded-lg bg-rhive-pink/10 border border-rhive-pink/20">
                                    <div className="text-xs font-mono font-bold text-rhive-pink uppercase mb-1 flex items-center gap-1.5">
                                        <Zap className="w-3.5 h-3.5" /> Direct Answer Summary
                                    </div>
                                    <p className="text-xs sm:text-sm text-white font-sans leading-relaxed">
                                        Our flat roofing assemblies feature GAF EverGuard® TPO and PVC membranes, mechanically attached Polyiso thermal insulation, custom-tapered boards around drains and scuppers to ensure positive water drainage, high-density DensDeck® gypsum cover boards, and fusion hot-air welded seams.
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
