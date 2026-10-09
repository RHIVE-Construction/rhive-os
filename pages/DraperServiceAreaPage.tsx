import React, { useEffect, useMemo, useState } from 'react';
import { Phone, Shield, ArrowRight, Zap, MapPin, ChevronDown, Wind, Snowflake, Sun, Building2, Layers, CheckCircle2, Wrench, Umbrella, Award } from 'lucide-react';
import { cn } from '../lib/utils';

export default function DraperServiceAreaPage() {
    useEffect(() => {
        document.title = "Top-Rated Roofing Contractor Draper UT | RHIVE Construction";
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
            metaDesc = document.createElement('meta');
            metaDesc.setAttribute('name', 'description');
            document.head.appendChild(metaDesc);
        }
        metaDesc.setAttribute('content', "Top-rated residential & commercial roofing in Draper, UT and Suncrest Bench. Owens Corning Duration 130 MPH shingles, GAF TPO/PVC flat roofs, 100% full tear-off, and lifetime guarantee.");
    }, []);

    const [openFaq, setOpenFaq] = useState<string | null>('faq-draper-wind');

    const handleEstimateClick = () => {
        window.location.href = '/estimate-tool';
    };

    const toggleFaq = (id: string) => {
        setOpenFaq(prev => prev === id ? null : id);
    };

    // Granular JSON-LD Schema for Draper, UT local SEO & AEO
    const jsonLdSchema = useMemo(() => {
        return {
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "RoofingContractor",
                    "@id": "https://www.rhiveconstruction.com/service-areas/draper-ut/#localbusiness",
                    "name": "RHIVE Construction - Draper Service Area",
                    "url": "https://www.rhiveconstruction.com/service-areas/draper-ut",
                    "logo": "https://i.imgur.com/t0VcSgJ.png",
                    "image": "https://i.imgur.com/t0VcSgJ.png",
                    "telephone": "+1-435-417-6637",
                    "email": "office@rhiveconstruction.com",
                    "priceRange": "$$$",
                    "description": "RHIVE Construction delivers precision-engineered residential roofing, commercial facility systems, high-performance asphalt shingles, and certified flat membrane installations across Draper, UT and South Salt Lake County.",
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
                        "latitude": 40.5247,
                        "longitude": -111.8638
                    },
                    "areaServed": [
                        {"@type": "City", "name": "Draper"},
                        {"@type": "PostalCode", "postalCode": "84020"},
                        {"@type": "AdministrativeArea", "name": "Suncrest Bench"},
                        {"@type": "AdministrativeArea", "name": "Traverse Mountain Corridor"},
                        {"@type": "AdministrativeArea", "name": "Corner Canyon"},
                        {"@type": "AdministrativeArea", "name": "Bellevue"},
                        {"@type": "AdministrativeArea", "name": "South Mountain"}
                    ]
                },
                {
                    "@type": "FAQPage",
                    "@id": "https://www.rhiveconstruction.com/service-areas/draper-ut/#faqpage",
                    "mainEntity": [
                        {
                            "@type": "Question",
                            "name": "What is RHIVE’s residential reroofing standard for Draper single-family homes?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "RHIVE enforces a strict 100% full tear-off policy down to bare OSB decking on all residential replacements in Draper. Every project includes Owens Corning ProArmor® synthetic underlayment, a minimum of 6 feet of WeatherLock® Ice & Water Shield, a 6-nail fastening pattern, and up to 100 sq ft of free 7/16 OSB decking replacement backed by our Lifetime Installer No-Leak Guarantee."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "What single-ply commercial flat roof options does RHIVE install in Draper?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "As a certified GAF commercial installer, RHIVE installs GAF EverGuard® TPO and PVC single-ply membranes in 60 and 80 mil thicknesses, executes code-compliant commercial layovers, and provides GAF No Dollar Limit (NDL) Commercial Guarantees for up to 30 years covering 100% of material and labor defect costs."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "What asphalt shingle products does RHIVE install for Draper properties?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "We install the Owens Corning Duration® Series (130 MPH SureNail® wind warranty) and Duration FLEX® Class 4 Impact Rated shingles for hail and wind-blown debris defense, backed by 50-year non-prorated material warranties and 25-Year StreakGuard™ Algae Protection."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "What are the technical specifications of RHIVE’s flat roof membrane installations in Draper?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "Our flat roofing assemblies feature GAF EverGuard® TPO and PVC membranes, mechanically attached Polyiso thermal insulation, custom-tapered boards around drains and scuppers to ensure positive water drainage, high-density DensDeck® gypsum cover boards, and fusion hot-air welded seams."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "How does RHIVE protect Draper Suncrest Bench homes from severe canyon wind shears?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "We install Owens Corning Duration® shingles featuring patented SureNail® Technology. The embedded woven fabric strip prevents nail pull-through during high-wind events, holding a certified 130 MPH wind uplift rating when installed with our 6-nail fastening pattern."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "What is the benefit of upgrading to Duration FLEX® Class 4 shingles in Draper?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "Duration FLEX® shingles use SBS polymer-modified asphalt, giving them rubberized elasticity to absorb high-velocity hail impacts and withstand 80°F+ single-day thermal swings without cracking. They also qualify homeowners for up to 20–30% insurance premium discounts."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "How fast can RHIVE dispatch an emergency repair crew to a leaking roof in Draper?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "Through our Quantum Rapid-Response Protocol, we dispatch emergency crews for pitched-roof synthetic tarping or flat membrane heat-welded containment. Emergency tarping carries a flat $350 fee, and 100% of this $350 fee is credited back toward your permanent repair or full replacement."
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
                        Draper, UT • Suncrest &amp; Traverse Mountain Authority
                    </span>
                </div>

                <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold uppercase tracking-tight text-white mb-4 leading-tight">
                    Engineered Roofing Systems for<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-rhive-pink">
                        Draper, Utah &amp; Suncrest Bench
                    </span>
                </h1>

                <div className="text-base sm:text-xl font-serif italic text-rhive-pink mb-6">
                    130 MPH Mountain Wind Defense. 100% Tear-Off Standard. Lifetime No-Leak Protection.
                </div>

                {/* Local Problem Callout */}
                <div className="p-5 sm:p-6 bg-white/[0.02] border border-white/10 rounded-2xl max-w-4xl mx-auto mb-8 text-left">
                    <div className="flex items-center gap-2 text-xs font-mono uppercase font-bold text-rhive-pink mb-2">
                        <Wind className="w-4 h-4" /> Solving Draper's Toughest Traverse Mountain Wind &amp; High Bench Freeze-Thaw Challenges
                    </div>
                    <p className="text-sm sm:text-base text-gray-200 font-serif leading-relaxed">
                        Stretching from the valley floor up onto Traverse Mountain and the Suncrest Bench, properties in Draper experience severe environmental pressures. High downslope canyon wind shears rolling off Traverse Mountain frequently exceed 70 MPH, dislodging standard unreinforced shingles. At higher elevations, heavy winter snow accumulation creates chronic eave ice dams that force meltwater under roofing layers during freeze-thaw cycles. Combined with intense summer UV solar exposure, Draper rooflines require Class 4 impact-rated shingle assemblies, high-wind SureNail® fastening bands, and self-regulating thermal ice management systems.
                    </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-4">
                    <button
                        onClick={handleEstimateClick}
                        className="bg-rhive-pink hover:bg-[#d4007b] text-white font-bold text-xs sm:text-sm uppercase tracking-widest px-8 py-3.5 rounded-full shadow-[0_0_15px_rgba(236,2,139,0.4)] transition-all hover:scale-105 cursor-pointer"
                    >
                        Configure Draper Estimate
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
                    Location-Specific Content for Draper, UT
                </h2>

                <div className="p-6 bg-white/[0.02] border border-white/10 rounded-2xl space-y-4 mb-6">
                    <h3 className="text-lg font-bold text-white">Regional Environmental Factors &amp; Local Footprint</h3>
                    <p className="text-sm sm:text-base text-gray-300 font-serif leading-relaxed">
                        Draper’s rapid elevation gain subjects structures to rapid temperature swings where conditions shift over 80°F in short timeframes. Wind gusts along Corner Canyon put extreme uplift pressure on roof perimeters, making heavy-gauge steel drip edge and 6-nail fastening patterns essential for long-term stability.
                    </p>
                    <div className="grid sm:grid-cols-2 gap-4 pt-2">
                        <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                            <div className="text-xs font-mono text-rhive-pink font-bold uppercase mb-1">Municipal Permitting &amp; Local Compliance</div>
                            <p className="text-xs sm:text-sm text-gray-300 font-serif">
                                Full roof replacements in Draper require municipal building permits issued through the Draper City Community Development Department. RHIVE Construction handles 100% of the permitting process, ensuring strict adherence to Utah building codes, perimeter 28-gauge steel drip metal specifications, and eave ice barrier extensions.
                            </p>
                        </div>
                        <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                            <div className="text-xs font-mono text-emerald-400 font-bold uppercase mb-1">Local Service Footprint</div>
                            <p className="text-xs sm:text-sm text-gray-300 font-serif">
                                Our service footprint covers all Draper communities, including Suncrest, Corner Canyon, Bellevue, South Mountain, Lone Peak Parkway, and commercial corridors near Bangerter Highway and I-15.
                            </p>
                        </div>
                    </div>
                    <div className="pt-2 border-t border-white/10 text-xs sm:text-sm text-gray-300 font-serif leading-relaxed">
                        Co-founded by <strong>Kara Robinson (President)</strong> and <strong>Michael Robinson (CEO)</strong>, RHIVE Construction is a proudly female-owned and operated contractor bringing complete cost transparency to Draper. By leveraging AI automation and eliminating physical warehouse overhead, we maintain operating expenses below 10%. Every quote provides an itemized mathematical breakdown showing exact costs for <strong>Materials, Labor, Operating Overhead, and Net Company Profit</strong>. Guided by our slogan <strong>"Finish On Top"</strong> and our ongoing mission of donating complete roof replacements to local veterans, teachers, and first responders, Draper property owners receive master-craftsman quality without salesman markups.
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
                    Residential Roofing in Draper, UT
                </h2>

                <div className="p-6 bg-white/[0.02] border border-white/10 rounded-2xl space-y-4">
                    <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs uppercase font-bold">
                        <Shield size={14} /> Strict 100% Full Tear-Off Policy
                    </div>
                    <h3 className="text-lg font-bold text-white">Zero Residential Layovers on Draper Homes</h3>
                    <p className="text-sm sm:text-base text-gray-300 font-serif leading-relaxed">
                        RHIVE enforces a strict <strong>100% full tear-off policy</strong> down to bare OSB decking on all residential replacements in Draper. We never perform residential layovers because covering old shingles traps heat, conceals structural wood rot, adds unnecessary weight, and voids manufacturer system warranties.
                    </p>
                    <div className="grid sm:grid-cols-2 gap-4 pt-2">
                        <div className="p-4 bg-black/40 border border-white/5 rounded-xl space-y-2">
                            <div className="text-xs font-mono text-rhive-pink font-bold uppercase">100% Field Protection</div>
                            <p className="text-xs sm:text-sm text-gray-300 font-serif">
                                <strong>Owens Corning ProArmor®</strong> high-performance synthetic underlayment installed across the entire non-covered roof deck as a secondary water-shedding barrier.
                            </p>
                        </div>
                        <div className="p-4 bg-black/40 border border-white/5 rounded-xl space-y-2">
                            <div className="text-xs font-mono text-rhive-pink font-bold uppercase">Eave &amp; Valley Waterproofing</div>
                            <p className="text-xs sm:text-sm text-gray-300 font-serif">
                                A minimum of <strong>6 feet of self-adhering Owens Corning WeatherLock® Ice &amp; Water Shield</strong> installed continuously along all eaves and valleys (extending well past the 24-inch IRC warm-wall code).
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
                                Executed on our <strong>50/40/10 milestone schedule</strong>, protected by Utah's <strong>Statutory 3-Day Right of Rescission</strong>, the <strong>RPSP 10% credit up to $1,000</strong>, and RHIVE's direct <strong>Lifetime Installer No-Leak Guarantee</strong>.
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
                    Commercial Roofing in Draper, UT
                </h2>

                <div className="p-6 bg-white/[0.02] border border-white/10 rounded-2xl space-y-4">
                    <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase font-bold">
                        <Building2 size={14} /> Certified Commercial Roofing Contractor
                    </div>
                    <p className="text-sm sm:text-base text-gray-300 font-serif leading-relaxed">
                        RHIVE provides full-spectrum commercial roofing across Draper, serving Silicon Slopes tech campuses, retail plazas, corporate headquarters, churches, banks, and multi-family developments. We engineer both commercial steep-slope architectural shingle systems and low-slope membrane solutions under certified Master Service Agreements (MSAs).
                    </p>
                    <div className="grid sm:grid-cols-2 gap-4 pt-2">
                        <div className="p-4 bg-black/40 border border-white/5 rounded-xl space-y-1">
                            <div className="text-xs font-mono text-cyan-400 font-bold uppercase">Commercial Facility Systems</div>
                            <p className="text-xs sm:text-sm text-gray-300 font-serif">
                                Turnkey engineering for both <strong>commercial steep-slope architectural shingles</strong> and <strong>certified low-slope single-ply membrane systems</strong> customized to commercial structural load requirements.
                            </p>
                        </div>
                        <div className="p-4 bg-black/40 border border-white/5 rounded-xl space-y-1">
                            <div className="text-xs font-mono text-cyan-400 font-bold uppercase">Commercial Code Layover</div>
                            <p className="text-xs sm:text-sm text-gray-300 font-serif">
                                Under active Utah building codes, a <strong>single-layer commercial layover</strong> is approved if underlying insulation and decking are dry and sound, saving property owners substantial disposal fees.
                            </p>
                        </div>
                        <div className="p-4 bg-black/40 border border-white/5 rounded-xl space-y-1">
                            <div className="text-xs font-mono text-cyan-400 font-bold uppercase">GAF NDL Guarantees</div>
                            <p className="text-xs sm:text-sm text-gray-300 font-serif">
                                Commercial installations qualify for <strong>GAF No Dollar Limit (NDL) Guarantees</strong> up to 30 years, covering 100% of material and labor defect costs with no payout cap.
                            </p>
                        </div>
                        <div className="p-4 bg-black/40 border border-white/5 rounded-xl space-y-1">
                            <div className="text-xs font-mono text-cyan-400 font-bold uppercase">Commercial Terms &amp; RPSP</div>
                            <p className="text-xs sm:text-sm text-gray-300 font-serif">
                                Commercial accounts operate under custom Master Service Agreements (MSA) or standard retail terms, and qualify for our <strong>Commercial RPSP credit</strong> (10% efficiency credit up to $3,000) for estimates approved within 7 days.
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
                    Asphalt Roofing in Draper, UT
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
                                Patented <strong>SureNail® Technology</strong> with embedded woven fabric strip delivering certified <strong>130 MPH wind uplift warranty</strong> and 25-Year StreakGuard™ Algae Resistance.
                            </p>
                        </div>
                        <div className="p-4 bg-black/40 border border-white/5 rounded-xl space-y-2">
                            <div className="text-xs font-mono text-rhive-pink font-bold uppercase">Owens Corning Duration FLEX®</div>
                            <p className="text-xs sm:text-sm text-gray-300 font-serif">
                                SBS polymer-modified Class 4 Impact Rated shingles that absorb hail and wind-blown debris without cracking, qualifying homeowners for 20–30% insurance premium discounts.
                            </p>
                        </div>
                        <div className="p-4 bg-black/40 border border-white/5 rounded-xl space-y-2">
                            <div className="text-xs font-mono text-rhive-pink font-bold uppercase">GAF Designer Shingles</div>
                            <p className="text-xs sm:text-sm text-gray-300 font-serif">
                                For luxury estate homes, we install <strong>GAF Woodland® and Grand Sequoia® Designer Shingles</strong>, offering hand-cut wood-shake aesthetics backed by GAF System Plus® 50-year non-prorated coverage.
                            </p>
                        </div>
                        <div className="p-4 bg-black/40 border border-white/5 rounded-xl space-y-2">
                            <div className="text-xs font-mono text-rhive-pink font-bold uppercase">50-Year Non-Prorated Warranty</div>
                            <p className="text-xs sm:text-sm text-gray-300 font-serif">
                                Complete systems include Starter Strip Plus and Pro-Edge® / DuraRidge® hip and ridge caps backed by <strong>50 years of non-prorated material coverage</strong>.
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
                    Flat Roofing in Draper, UT
                </h2>

                <div className="p-6 bg-white/[0.02] border border-white/10 rounded-2xl space-y-4">
                    <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase font-bold">
                        <Building2 size={14} /> Single-Ply Membrane Technologies
                    </div>
                    <p className="text-sm sm:text-base text-gray-300 font-serif leading-relaxed">
                        RHIVE’s flat and low-slope single-ply membrane systems provide high thermal efficiency and continuous leak defense:
                    </p>
                    <div className="grid sm:grid-cols-2 gap-4 pt-2">
                        <div className="p-4 bg-black/40 border border-white/5 rounded-xl space-y-2">
                            <div className="text-xs font-mono text-cyan-400 font-bold uppercase">GAF EverGuard® TPO (60/80 mil)</div>
                            <p className="text-xs sm:text-sm text-gray-300 font-serif">
                                Highly reflective white thermoplastic membrane (Energy Star rated) that reflects solar radiation, reducing summer HVAC cooling bills.
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
                                Mechanically attached <strong>Polyiso thermal insulation boards</strong>, custom-tapered boards around drains and scuppers to ensure positive drainage, and high-density <strong>DensDeck® gypsum cover boards</strong>.
                            </p>
                        </div>
                        <div className="p-4 bg-black/40 border border-white/5 rounded-xl space-y-2">
                            <div className="text-xs font-mono text-cyan-400 font-bold uppercase">Fusion Heat-Welded Seams</div>
                            <p className="text-xs sm:text-sm text-gray-300 font-serif">
                                All field seams, corner details, and parapet wall flashings are fusion heat-welded using hot air to create a monolithic, permanent watertight bond.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Comprehensive Q&A Accordion Hub for Draper */}
            <section className="relative z-10 py-14 px-6 max-w-5xl mx-auto border-t border-white/10">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rhive-pink/10 border border-rhive-pink/20 text-rhive-pink font-mono text-xs uppercase mb-3">
                        <Zap className="w-3.5 h-3.5" /> High-Intent Answer Engine
                    </div>
                    <h2 className="text-xl sm:text-3xl font-extrabold uppercase tracking-tight text-white mb-3">
                        Frequently Asked Questions by Draper Property Owners
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-400 max-w-[70ch] mx-auto font-serif">
                        Direct, verified technical answers for residential and commercial roofing projects across Draper and Traverse Mountain.
                    </p>
                </div>

                <div className="space-y-4">
                    {/* FAQ 1: Suncrest Canyon Wind */}
                    <div className="border border-white/10 bg-white/[0.015] rounded-xl overflow-hidden">
                        <button
                            onClick={() => toggleFaq('faq-draper-wind')}
                            className="w-full text-left p-5 flex justify-between items-center gap-4 hover:bg-white/[0.02] cursor-pointer"
                        >
                            <span className="text-sm sm:text-base font-bold text-white">
                                How does RHIVE protect Draper Suncrest Bench homes from severe canyon wind shears?
                            </span>
                            <ChevronDown className={cn("w-4 h-4 text-rhive-pink transition-transform", openFaq === 'faq-draper-wind' && "rotate-180")} />
                        </button>
                        {openFaq === 'faq-draper-wind' && (
                            <div className="p-5 pt-0 space-y-3 border-t border-white/5">
                                <div className="p-3.5 rounded-lg bg-rhive-pink/10 border border-rhive-pink/20">
                                    <div className="text-xs font-mono font-bold text-rhive-pink uppercase mb-1 flex items-center gap-1.5">
                                        <Zap className="w-3.5 h-3.5" /> Direct Answer Summary
                                    </div>
                                    <p className="text-xs sm:text-sm text-white font-sans leading-relaxed">
                                        We install Owens Corning Duration® shingles featuring patented SureNail® Technology. The embedded woven fabric strip prevents nail pull-through during high-wind events, holding a certified 130 MPH wind uplift rating when installed with our 6-nail fastening pattern.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* FAQ 2: Duration FLEX */}
                    <div className="border border-white/10 bg-white/[0.015] rounded-xl overflow-hidden">
                        <button
                            onClick={() => toggleFaq('faq-draper-flex')}
                            className="w-full text-left p-5 flex justify-between items-center gap-4 hover:bg-white/[0.02] cursor-pointer"
                        >
                            <span className="text-sm sm:text-base font-bold text-white">
                                What is the benefit of upgrading to Duration FLEX® Class 4 shingles in Draper?
                            </span>
                            <ChevronDown className={cn("w-4 h-4 text-rhive-pink transition-transform", openFaq === 'faq-draper-flex' && "rotate-180")} />
                        </button>
                        {openFaq === 'faq-draper-flex' && (
                            <div className="p-5 pt-0 space-y-3 border-t border-white/5">
                                <div className="p-3.5 rounded-lg bg-rhive-pink/10 border border-rhive-pink/20">
                                    <div className="text-xs font-mono font-bold text-rhive-pink uppercase mb-1 flex items-center gap-1.5">
                                        <Zap className="w-3.5 h-3.5" /> Direct Answer Summary
                                    </div>
                                    <p className="text-xs sm:text-sm text-white font-sans leading-relaxed">
                                        Duration FLEX® shingles use SBS polymer-modified asphalt, giving them rubberized elasticity to absorb high-velocity hail impacts and withstand 80°F+ single-day thermal swings without cracking. They also qualify homeowners for up to 20–30% insurance premium discounts.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* FAQ 3: Emergency Response */}
                    <div className="border border-white/10 bg-white/[0.015] rounded-xl overflow-hidden">
                        <button
                            onClick={() => toggleFaq('faq-draper-emergency')}
                            className="w-full text-left p-5 flex justify-between items-center gap-4 hover:bg-white/[0.02] cursor-pointer"
                        >
                            <span className="text-sm sm:text-base font-bold text-white">
                                How fast can RHIVE dispatch an emergency repair crew to a leaking roof in Draper?
                            </span>
                            <ChevronDown className={cn("w-4 h-4 text-rhive-pink transition-transform", openFaq === 'faq-draper-emergency' && "rotate-180")} />
                        </button>
                        {openFaq === 'faq-draper-emergency' && (
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
                            onClick={() => toggleFaq('faq-draper-residential')}
                            className="w-full text-left p-5 flex justify-between items-center gap-4 hover:bg-white/[0.02] cursor-pointer"
                        >
                            <span className="text-sm sm:text-base font-bold text-white">
                                What is RHIVE’s residential reroofing standard for Draper single-family homes?
                            </span>
                            <ChevronDown className={cn("w-4 h-4 text-rhive-pink transition-transform", openFaq === 'faq-draper-residential' && "rotate-180")} />
                        </button>
                        {openFaq === 'faq-draper-residential' && (
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

                    {/* FAQ 5: Commercial Flat Roof */}
                    <div className="border border-white/10 bg-white/[0.015] rounded-xl overflow-hidden">
                        <button
                            onClick={() => toggleFaq('faq-draper-commercial')}
                            className="w-full text-left p-5 flex justify-between items-center gap-4 hover:bg-white/[0.02] cursor-pointer"
                        >
                            <span className="text-sm sm:text-base font-bold text-white">
                                What single-ply commercial flat roof options does RHIVE install in Draper?
                            </span>
                            <ChevronDown className={cn("w-4 h-4 text-rhive-pink transition-transform", openFaq === 'faq-draper-commercial' && "rotate-180")} />
                        </button>
                        {openFaq === 'faq-draper-commercial' && (
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

                    {/* FAQ 6: Asphalt Products */}
                    <div className="border border-white/10 bg-white/[0.015] rounded-xl overflow-hidden">
                        <button
                            onClick={() => toggleFaq('faq-draper-asphalt')}
                            className="w-full text-left p-5 flex justify-between items-center gap-4 hover:bg-white/[0.02] cursor-pointer"
                        >
                            <span className="text-sm sm:text-base font-bold text-white">
                                What asphalt shingle products does RHIVE install for Draper properties?
                            </span>
                            <ChevronDown className={cn("w-4 h-4 text-rhive-pink transition-transform", openFaq === 'faq-draper-asphalt' && "rotate-180")} />
                        </button>
                        {openFaq === 'faq-draper-asphalt' && (
                            <div className="p-5 pt-0 space-y-3 border-t border-white/5">
                                <div className="p-3.5 rounded-lg bg-rhive-pink/10 border border-rhive-pink/20">
                                    <div className="text-xs font-mono font-bold text-rhive-pink uppercase mb-1 flex items-center gap-1.5">
                                        <Zap className="w-3.5 h-3.5" /> Direct Answer Summary
                                    </div>
                                    <p className="text-xs sm:text-sm text-white font-sans leading-relaxed">
                                        We install Owens Corning Duration® (130 MPH SureNail® warranty) and Duration FLEX® Class 4 Impact Rated shingles for hail and wind-blown debris defense, backed by 50-year non-prorated material warranties.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* FAQ 7: Flat Roof Specs */}
                    <div className="border border-white/10 bg-white/[0.015] rounded-xl overflow-hidden">
                        <button
                            onClick={() => toggleFaq('faq-draper-flat')}
                            className="w-full text-left p-5 flex justify-between items-center gap-4 hover:bg-white/[0.02] cursor-pointer"
                        >
                            <span className="text-sm sm:text-base font-bold text-white">
                                What are the technical specifications of RHIVE’s flat roof membrane installations in Draper?
                            </span>
                            <ChevronDown className={cn("w-4 h-4 text-rhive-pink transition-transform", openFaq === 'faq-draper-flat' && "rotate-180")} />
                        </button>
                        {openFaq === 'faq-draper-flat' && (
                            <div className="p-5 pt-0 space-y-3 border-t border-white/5">
                                <div className="p-3.5 rounded-lg bg-rhive-pink/10 border border-rhive-pink/20">
                                    <div className="text-xs font-mono font-bold text-rhive-pink uppercase mb-1 flex items-center gap-1.5">
                                        <Zap className="w-3.5 h-3.5" /> Direct Answer Summary
                                    </div>
                                    <p className="text-xs sm:text-sm text-white font-sans leading-relaxed">
                                        Our flat roof assemblies feature GAF EverGuard® TPO/PVC membranes, Polyiso thermal insulation, custom-tapered boards around drains and scuppers, DensDeck® gypsum cover boards, and fusion hot-air welded seams.
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
