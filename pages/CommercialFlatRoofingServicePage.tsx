import React, { useEffect, useState } from 'react';
import { 
    Phone, Shield, ArrowRight, CheckCircle2, Zap, 
    Building2, Clock, Layers, Award, MapPin, 
    ChevronDown, Wrench, AlertTriangle, FileText 
} from 'lucide-react';
import { cn } from '../lib/utils';

interface CommercialFaq {
    q: string;
    a: string;
}

const COMMERCIAL_FAQS: CommercialFaq[] = [
    {
        q: "How much does commercial flat roofing cost per square foot in Utah?",
        a: "Commercial flat roofing in Utah typically ranges from $5.50 to $9.50 per square foot for single-ply TPO membrane installations and $7.00 to $12.00 per square foot for high-durability PVC systems. Final costs depend on roof square footage, existing insulation R-value requirements, structural deck condition, and whether the project is a single-layer layover or a full tear-off. RHIVE provides 100% itemized commercial estimates with transparent material and labor breakdowns."
    },
    {
        q: "Can my commercial building in Utah qualify for a layover instead of a full tear-off?",
        a: "Under Utah State Building Code (IBC/IRC), a commercial building may qualify for a single-ply membrane layover if there is only one existing roof layer and the underlying insulation and decking are dry and structurally sound. RHIVE conducts core sampling and thermal drone scans to verify moisture levels before recommending a layover, saving property owners 25% to 40% in labor and disposal costs."
    },
    {
        q: "What is a GAF No Dollar Limit (NDL) warranty and why is it essential?",
        a: "A GAF No Dollar Limit (NDL) warranty is the gold standard of commercial roofing coverage. Unlike standard manufacturer material warranties, an NDL warranty covers 100% of both material defects and contractor workmanship with no financial cap on repair payouts for up to 20 or 25 years. It is directly backed and inspected by GAF field inspectors, protecting commercial asset value and corporate balance sheets."
    },
    {
        q: "How does RHIVE minimize disruption to commercial tenants, customers, and operations?",
        a: "RHIVE implements a phased commercial project management protocol. We section roofs into independent zones, utilize exterior crane hoists to keep building interiors untouched, coordinate off-hours and weekend hot-air welding passes when requested, and provide facility managers with live digital drone progress feeds to ensure tenant parking and foot traffic remain 100% unobstructed."
    },
    {
        q: "How do commercial TPO and PVC flat roofs perform during severe Utah winters?",
        a: "Both TPO and PVC are engineered with advanced polymer plasticizers that maintain elasticity in sub-zero Wasatch Front temperatures, preventing brittle cracking under heavy snowpack. Hot-air heat-welded seams create a monolithic waterproof envelope that resists ponding water and ice dam expansion along internal scuppers, parapet flashings, and rooftop drains."
    }
];

export default function CommercialFlatRoofingServicePage() {
    const [openFaq, setOpenFaq] = useState<number | null>(0);

    useEffect(() => {
        document.title = "Commercial Roofing Contractor Utah | TPO & Flat Roofs | RHIVE Construction";
        
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
            metaDesc = document.createElement('meta');
            metaDesc.setAttribute('name', 'description');
            document.head.appendChild(metaDesc);
        }
        metaDesc.setAttribute('content', "Utah's premier certified commercial roofing contractor. Specializing in TPO and PVC flat roofs, layovers, complete tear-offs, industrial CAPEX planning, and 20-year GAF NDL warranties across Salt Lake, Utah, Davis, Summit, and Weber Counties.");

        // Schema.org Structured Data: RoofingContractor + Service + FAQPage
        const schemaId = 'schema-commercial-roofing-utah';
        let scriptTag = document.getElementById(schemaId) as HTMLScriptElement | null;
        if (!scriptTag) {
            scriptTag = document.createElement('script');
            scriptTag.id = schemaId;
            scriptTag.type = 'application/ld+json';
            document.head.appendChild(scriptTag);
        }

        const schemaData = {
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "RoofingContractor",
                    "@id": "https://www.rhiveconstruction.com/commercial-roofing#organization",
                    "name": "RHIVE Construction - Commercial Roofing Division",
                    "url": "https://www.rhiveconstruction.com/commercial-roofing",
                    "logo": "https://i.imgur.com/t0VcSgJ.png",
                    "image": "https://www.rhiveconstruction.com/images/commercial-tpo-membrane-re-roof-layover-salt-lake-city-utah.webp",
                    "telephone": "+1-801-449-1451",
                    "email": "office@rhiveconstruction.com",
                    "priceRange": "$$$",
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
                        "latitude": 40.5621,
                        "longitude": -111.9772
                    },
                    "areaServed": [
                        { "@type": "AdministrativeArea", "name": "Salt Lake County" },
                        { "@type": "AdministrativeArea", "name": "Utah County" },
                        { "@type": "AdministrativeArea", "name": "Davis County" },
                        { "@type": "AdministrativeArea", "name": "Summit County" },
                        { "@type": "AdministrativeArea", "name": "Weber County" },
                        { "@type": "AdministrativeArea", "name": "Tooele County" }
                    ]
                },
                {
                    "@type": "Service",
                    "@id": "https://www.rhiveconstruction.com/commercial-roofing#service",
                    "name": "Commercial Roofing Contractor Utah",
                    "provider": {
                        "@id": "https://www.rhiveconstruction.com/commercial-roofing#organization"
                    },
                    "description": "Certified commercial flat roofing contractor delivering TPO and PVC single-ply membrane installations, layovers, complete tear-offs, and 20-year GAF NDL warranties in Utah.",
                    "serviceType": "Commercial Roofing, Flat Roofing, TPO Roofing, PVC Roofing, Industrial Roofing"
                },
                {
                    "@type": "FAQPage",
                    "@id": "https://www.rhiveconstruction.com/commercial-roofing#faq",
                    "mainEntity": COMMERCIAL_FAQS.map(faq => ({
                        "@type": "Question",
                        "name": faq.q,
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": faq.a
                        }
                    }))
                }
            ]
        };

        scriptTag.text = JSON.stringify(schemaData);

        return () => {
            const existing = document.getElementById(schemaId);
            if (existing) existing.remove();
        };
    }, []);

    const handleEstimateClick = () => {
        window.location.href = '/estimate-tool';
    };

    return (
        <div className="min-h-screen bg-black text-white relative overflow-hidden font-sans">
            {/* Ambient Background Glow */}
            <div className="absolute top-1/4 left-1/3 -translate-x-1/2 w-[600px] h-[600px] bg-rhive-blue/15 blur-[140px] rounded-full pointer-events-none" />
            <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-rhive-pink/10 blur-[140px] rounded-full pointer-events-none" />

            {/* ── HERO SECTION ──────────────────────────────────────────────── */}
            <section className="relative z-10 pt-24 pb-16 px-6 max-w-6xl mx-auto text-center">
                <div className="inline-flex items-center gap-2 border border-rhive-pink/30 px-4 py-1.5 rounded-full bg-rhive-pink/10 mb-6 shadow-[0_0_15px_rgba(236,2,139,0.2)]">
                    <Building2 size={14} className="text-rhive-pink" />
                    <span className="text-xs font-mono font-bold uppercase tracking-widest text-white">
                        GAF CERTIFIED COMMERCIAL CONTRACTOR | UTAH &amp; IDAHO
                    </span>
                </div>

                <h1 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight leading-[1.1] mb-6">
                    Utah Commercial &amp; Industrial<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-rhive-pink">
                        Flat Roofing Specialists
                    </span>
                </h1>

                <div className="text-lg sm:text-xl md:text-2xl font-serif italic text-rhive-gold mb-8 max-w-3xl mx-auto">
                    Certified GAF TPO &amp; PVC Single-Ply Membranes, Layovers, Full Tear-Offs &amp; 20-Year NDL Warranties Across the Wasatch Front.
                </div>

                <p className="text-base sm:text-lg text-gray-300 max-w-[78ch] mx-auto mb-10 leading-relaxed font-serif">
                    Commercial flat and low-slope roofing systems require specialized materials, advanced thermal modeling, and master-craftsman execution to withstand Utah's extreme freeze-thaw cycles. At <strong className="text-white">RHIVE Construction</strong>, we combine commercial membrane certifications with proprietary drone cartography and 100% itemized pricing. From industrial warehouses to retail plazas, we protect corporate balance sheets with manufacturer-backed No Dollar Limit (NDL) warranties and zero business disruption.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
                    <button
                        onClick={handleEstimateClick}
                        className="bg-rhive-pink text-white font-black text-xs uppercase tracking-widest px-8 py-4 rounded shadow-[0_0_20px_rgba(236,2,139,0.4)] hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                        style={{ clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)' }}
                    >
                        Request Commercial Bid
                    </button>
                    <a
                        href="tel:8014491451"
                        className="flex items-center gap-2 border border-white/20 hover:border-rhive-pink text-white font-black text-xs uppercase tracking-widest px-8 py-4 rounded bg-white/5 hover:bg-white/10 transition-all cursor-pointer"
                        style={{ clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)' }}
                    >
                        <Phone size={14} className="text-rhive-pink" />
                        (801) 449-1451 Dispatch
                    </a>
                </div>

                {/* Hero Showcase Image */}
                <div className="mt-12 rounded-xl overflow-hidden border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.8)] relative">
                    <img 
                        src="/images/commercial-tpo-membrane-re-roof-layover-salt-lake-city-utah.webp"
                        alt="Aerial drone view of a completed GAF certified TPO membrane commercial layover installation in Salt Lake City, Utah."
                        className="w-full h-[320px] sm:h-[420px] object-cover"
                        width={1200}
                        height={420}
                        decoding="async"
                        loading="lazy"
                    />
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/80 to-transparent p-4 sm:p-6 text-left flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <div>
                            <div className="text-xs font-mono font-bold text-rhive-pink uppercase tracking-widest">Active Project Profile</div>
                            <div className="text-sm sm:text-base font-bold text-white">45,000 Sq Ft GAF EverGuard® TPO Layover — Salt Lake County, UT</div>
                        </div>
                        <span className="text-xs font-mono text-gray-300 bg-white/10 px-3 py-1 rounded border border-white/20">
                            20-Yr NDL Certified
                        </span>
                    </div>
                </div>
            </section>

            {/* ── SECTION 1: COMMERCIAL FLAT ROOFING SYSTEMS & MATERIALS ───────── */}
            <section className="relative z-10 py-16 px-6 max-w-6xl mx-auto border-t border-white/10">
                <div className="text-center mb-12">
                    <span className="text-xs font-mono text-rhive-pink uppercase tracking-[0.2em] block mb-2 font-bold">
                        Engineered Single-Ply Specifications
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
                        Commercial Flat, PVC &amp; TPO Roofing Systems in Utah
                    </h2>
                    <p className="text-gray-400 font-serif italic text-base max-w-2xl mx-auto mt-3">
                        Deploying industry-leading single-ply membrane technologies engineered for thermal reflectivity, chemical resistance, and monolithic seam strength.
                    </p>
                    <div className="w-16 h-1 bg-rhive-pink mx-auto mt-4" />
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* TPO Card */}
                    <div className="bg-white/[0.02] border border-white/10 p-6 rounded-xl flex flex-col justify-between hover:border-rhive-pink/40 transition-all duration-300">
                        <div>
                            <div className="text-xs text-rhive-pink font-mono font-bold uppercase tracking-widest mb-2 flex items-center gap-1.5">
                                <Zap size={14} /> Energy Star Efficiency
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">GAF EverGuard® TPO Roofing</h3>
                            <p className="text-gray-300 text-sm leading-relaxed font-serif mb-4">
                                Thermoplastic Polyolefin (TPO) roofs are exceptionally well-suited for Utah commercial buildings seeking maximum energy savings. With initial solar reflectance up to 85%, TPO significantly lowers cooling loads during hot Wasatch Front summers.
                            </p>
                        </div>
                        <ul className="text-xs text-gray-400 space-y-1.5 border-t border-white/5 pt-4 font-mono">
                            <li className="flex items-center gap-2"><CheckCircle2 size={12} className="text-rhive-pink" /> 60-mil &amp; 80-mil Thickness</li>
                            <li className="flex items-center gap-2"><CheckCircle2 size={12} className="text-rhive-pink" /> Robotic Hot-Air Welded Seams</li>
                            <li className="flex items-center gap-2"><CheckCircle2 size={12} className="text-rhive-pink" /> Class A Fire &amp; Hail Resistant</li>
                        </ul>
                    </div>

                    {/* PVC Card */}
                    <div className="bg-white/[0.02] border border-white/10 p-6 rounded-xl flex flex-col justify-between hover:border-rhive-pink/40 transition-all duration-300">
                        <div>
                            <div className="text-xs text-rhive-gold font-mono font-bold uppercase tracking-widest mb-2 flex items-center gap-1.5">
                                <Shield size={14} /> Chemical &amp; Grease Defense
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">GAF EverGuard® PVC Roofing</h3>
                            <p className="text-gray-300 text-sm leading-relaxed font-serif mb-4">
                                Polyvinyl Chloride (PVC) delivers unmatched resistance to harsh chemicals, industrial oils, and rooftop kitchen grease exhaust. The mandatory choice for restaurants, food processing plants, and manufacturing hubs across Utah.
                            </p>
                        </div>
                        <ul className="text-xs text-gray-400 space-y-1.5 border-t border-white/5 pt-4 font-mono">
                            <li className="flex items-center gap-2"><CheckCircle2 size={12} className="text-rhive-gold" /> Animal Fat &amp; Oil Resistant</li>
                            <li className="flex items-center gap-2"><CheckCircle2 size={12} className="text-rhive-gold" /> Permanent Flexible Plasticizers</li>
                            <li className="flex items-center gap-2"><CheckCircle2 size={12} className="text-rhive-gold" /> High Puncture Resistance</li>
                        </ul>
                    </div>

                    {/* Integrated Substrate Card */}
                    <div className="bg-white/[0.02] border border-white/10 p-6 rounded-xl flex flex-col justify-between hover:border-rhive-pink/40 transition-all duration-300">
                        <div>
                            <div className="text-xs text-cyan-400 font-mono font-bold uppercase tracking-widest mb-2 flex items-center gap-1.5">
                                <Layers size={14} /> Complete Assembly
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">Polyiso &amp; HD Cover Boards</h3>
                            <p className="text-gray-300 text-sm leading-relaxed font-serif mb-4">
                                A commercial roof is only as resilient as its foundation. We engineer complete substrate assemblies utilizing staggered Polyisocyanurate (Polyiso) R-30+ insulation, high-density gypsum cover boards, and vapor barriers to halt internal condensation.
                            </p>
                        </div>
                        <ul className="text-xs text-gray-400 space-y-1.5 border-t border-white/5 pt-4 font-mono">
                            <li className="flex items-center gap-2"><CheckCircle2 size={12} className="text-cyan-400" /> Tapered Insulation Drainage</li>
                            <li className="flex items-center gap-2"><CheckCircle2 size={12} className="text-cyan-400" /> High-Density Hail Cover Boards</li>
                            <li className="flex items-center gap-2"><CheckCircle2 size={12} className="text-cyan-400" /> Mechanically Attached or Adhered</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* ── SECTION 2: PROJECT MANAGEMENT & MINIMIZING DISRUPTIONS ────────── */}
            <section className="relative z-10 py-16 px-6 max-w-6xl mx-auto border-t border-white/10">
                <div className="text-center mb-12">
                    <span className="text-xs font-mono text-cyan-400 uppercase tracking-[0.2em] block mb-2 font-bold">
                        Operational Excellence
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
                        Commercial Project Management: Minimizing Business Disruptions
                    </h2>
                    <p className="text-gray-400 font-serif italic text-base max-w-2xl mx-auto mt-3">
                        Commercial property managers, facility directors, and HOA boards need roof installations that protect daily business continuity.
                    </p>
                    <div className="w-16 h-1 bg-cyan-400 mx-auto mt-4" />
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="p-6 bg-white/[0.02] border border-white/5 rounded-xl">
                        <div className="w-10 h-10 rounded bg-rhive-pink/10 border border-rhive-pink/30 flex items-center justify-center text-rhive-pink mb-4">
                            <Clock size={20} />
                        </div>
                        <h3 className="text-base font-bold text-white uppercase mb-2">Phased Installation Zones</h3>
                        <p className="text-gray-400 text-xs font-serif leading-relaxed">
                            We divide large commercial roofs into staged operational sectors, keeping 80% of parking and building entrances completely unobstructed at all times.
                        </p>
                    </div>

                    <div className="p-6 bg-white/[0.02] border border-white/5 rounded-xl">
                        <div className="w-10 h-10 rounded bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4">
                            <Zap size={20} />
                        </div>
                        <h3 className="text-base font-bold text-white uppercase mb-2">Off-Hours &amp; Weekend Work</h3>
                        <p className="text-gray-400 text-xs font-serif leading-relaxed">
                            For noise-sensitive offices, schools, and medical facilities, our crews execute heavy tear-off and mechanical staging outside of regular operational hours.
                        </p>
                    </div>

                    <div className="p-6 bg-white/[0.02] border border-white/5 rounded-xl">
                        <div className="w-10 h-10 rounded bg-rhive-gold/10 border border-rhive-gold/30 flex items-center justify-center text-rhive-gold mb-4">
                            <Shield size={20} />
                        </div>
                        <h3 className="text-base font-bold text-white uppercase mb-2">OSHA Crane &amp; Safety Staging</h3>
                        <p className="text-gray-400 text-xs font-serif leading-relaxed">
                            All materials are staged directly via heavy-lift boom cranes. Drop zones and safety perimeters are enclosed with OSHA-certified barriers to ensure tenant protection.
                        </p>
                    </div>

                    <div className="p-6 bg-white/[0.02] border border-white/5 rounded-xl">
                        <div className="w-10 h-10 rounded bg-white/10 border border-white/20 flex items-center justify-center text-white mb-4">
                            <FileText size={20} />
                        </div>
                        <h3 className="text-base font-bold text-white uppercase mb-2">Drone Inspection Vault</h3>
                        <p className="text-gray-400 text-xs font-serif leading-relaxed">
                            Property managers receive daily aerial progress photographs, seam weld pull-test documentation, and verified milestone sign-offs streamed directly to their portal.
                        </p>
                    </div>
                </div>
            </section>

            {/* ── SECTION 3: TEAR-OFF VS. LAYOVER ─────────────────────────────── */}
            <section className="relative z-10 py-16 px-6 max-w-6xl mx-auto border-t border-white/10">
                <div className="text-center mb-12">
                    <span className="text-xs font-mono text-rhive-gold uppercase tracking-[0.2em] block mb-2 font-bold">
                        Cost vs. Structural Scope
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
                        Flexible Commercial Re-Roofing: Layover vs. Full Tear-Off
                    </h2>
                    <p className="text-gray-400 font-serif italic text-base max-w-2xl mx-auto mt-3">
                        Navigating Utah State Building Code allowances to balance capital expenditure and long-term asset integrity.
                    </p>
                    <div className="w-16 h-1 bg-rhive-gold mx-auto mt-4" />
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-8 bg-white/[0.02] border border-white/10 rounded-2xl">
                        <div className="inline-block bg-rhive-gold/20 text-rhive-gold font-mono font-bold text-xs uppercase px-3 py-1 rounded mb-4 border border-rhive-gold/30">
                            CAPEX Optimization (Saves 25-40%)
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-3">Single-Ply Layover Membrane</h3>
                        <p className="text-gray-300 text-sm leading-relaxed font-serif mb-4">
                            Under Utah building code, a single-layer existing flat roof that is dry and structurally intact qualifies for a certified membrane layover. We install a high-density fanfold recovery board directly over the existing substrate, followed by a new GAF TPO or PVC membrane.
                        </p>
                        <ul className="text-xs text-gray-400 space-y-2 font-mono">
                            <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-rhive-gold" /> Eliminates costly landfill disposal fees</li>
                            <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-rhive-gold" /> Prevents interior weather exposure during construction</li>
                            <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-rhive-gold" /> Fully inspectable and certifiable for GAF NDL warranties</li>
                        </ul>
                    </div>

                    <div className="p-8 bg-white/[0.02] border border-white/10 rounded-2xl">
                        <div className="inline-block bg-rhive-pink/20 text-rhive-pink font-mono font-bold text-xs uppercase px-3 py-1 rounded mb-4 border border-rhive-pink/30">
                            100% Structural Reset
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-3">Full System Tear-Off &amp; Substrate Replacement</h3>
                        <p className="text-gray-300 text-sm leading-relaxed font-serif mb-4">
                            For multi-layered, saturated, or failing commercial roofs, full tear-off is mandatory. We strip all old layers down to the steel or wood deck, inspect and repair all structural purlins and decking, and install a brand-new, tapered R-30+ insulation system.
                        </p>
                        <ul className="text-xs text-gray-400 space-y-2 font-mono">
                            <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-rhive-pink" /> 100 sq ft structural decking replacement included</li>
                            <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-rhive-pink" /> Custom-tapered slopes to permanently eradicate ponding water</li>
                            <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-rhive-pink" /> Full 20 to 25-Year GAF NDL Manufacturer Coverage</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* ── SECTION 4: TECHNICAL COMPARISON TABLE ────────────────────────── */}
            <section className="relative z-10 py-16 px-6 max-w-6xl mx-auto border-t border-white/10 overflow-x-auto">
                <div className="text-center mb-10">
                    <span className="text-xs font-mono text-rhive-pink uppercase tracking-[0.2em] block mb-2 font-bold">
                        Synthesizable Specification Guide
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
                        Utah Commercial Roofing Material Technical Comparison
                    </h2>
                </div>

                <table className="w-full border-collapse text-left text-xs sm:text-sm bg-white/[0.02] border border-white/10 rounded-xl overflow-hidden">
                    <thead>
                        <tr className="bg-rhive-pink/15 border-b border-rhive-pink/30 text-white font-mono uppercase">
                            <th className="p-4">Criteria</th>
                            <th className="p-4">GAF TPO Membrane</th>
                            <th className="p-4">GAF PVC Membrane</th>
                            <th className="p-4">Standing Seam Metal</th>
                            <th className="p-4">Built-Up Asphalt (BUR)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-gray-300 font-serif">
                        <tr>
                            <td className="p-4 font-bold text-white font-mono">Chemical &amp; Grease Resistance</td>
                            <td className="p-4">Moderate</td>
                            <td className="p-4 text-rhive-gold font-bold">Exceptional (Animal Fat/Grease)</td>
                            <td className="p-4">High</td>
                            <td className="p-4 text-red-400">Poor (Degrades with Oil)</td>
                        </tr>
                        <tr>
                            <td className="p-4 font-bold text-white font-mono">Energy Star Solar Reflectance</td>
                            <td className="p-4 text-rhive-pink font-bold">Up to 85% Initial</td>
                            <td className="p-4">Up to 83% Initial</td>
                            <td className="p-4">Up to 70%</td>
                            <td className="p-4 text-red-400">&lt; 25% (Heat Absorbing)</td>
                        </tr>
                        <tr>
                            <td className="p-4 font-bold text-white font-mono">Average Utah Lifespan</td>
                            <td className="p-4">25 - 30 Years</td>
                            <td className="p-4">25 - 30 Years</td>
                            <td className="p-4 text-rhive-pink font-bold">40 - 50 Years</td>
                            <td className="p-4">15 - 20 Years</td>
                        </tr>
                        <tr>
                            <td className="p-4 font-bold text-white font-mono">Primary Utah Application</td>
                            <td className="p-4">Warehouses, Distribution, Big Box Retail</td>
                            <td className="p-4">Restaurants, Food Processing, Manufacturing</td>
                            <td className="p-4">Architectural, Low/Steep Slope</td>
                            <td className="p-4 text-gray-500">Legacy Systems Only</td>
                        </tr>
                        <tr>
                            <td className="p-4 font-bold text-white font-mono">Approx. Cost / Sq Ft Installed</td>
                            <td className="p-4 font-mono text-white">$5.50 - $9.50</td>
                            <td className="p-4 font-mono text-white">$7.00 - $12.00</td>
                            <td className="p-4 font-mono text-white">$10.00 - $16.00</td>
                            <td className="p-4 font-mono text-gray-400">$6.50 - $10.00</td>
                        </tr>
                    </tbody>
                </table>
            </section>

            {/* ── SECTION 5: WARRANTIES & NDL GUARANTEE ───────────────────────── */}
            <section className="relative z-10 py-16 px-6 max-w-6xl mx-auto border-t border-white/10">
                <div className="text-center mb-12">
                    <span className="text-xs font-mono text-rhive-pink uppercase tracking-[0.2em] block mb-2 font-bold">
                        Institutional Asset Protection
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
                        Elite GAF Commercial Warranties &amp; 20-Year NDL Guarantees
                    </h2>
                    <div className="w-16 h-1 bg-rhive-pink mx-auto mt-4" />
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    <div className="p-6 bg-white/[0.02] border border-white/10 rounded-xl">
                        <div className="text-base font-bold text-white mb-2 flex items-center gap-2">
                            <Award size={18} className="text-rhive-pink" /> GAF System Plus Warranty
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed font-serif">
                            Extended manufacturer non-prorated system coverage for small to mid-sized commercial reroofs installed by certified RHIVE specialists.
                        </p>
                    </div>

                    <div className="p-6 bg-white/[0.02] border border-rhive-pink/40 bg-rhive-pink/[0.02] rounded-xl shadow-[0_0_25px_rgba(236,2,139,0.1)]">
                        <div className="text-base font-bold text-white mb-2 flex items-center gap-2">
                            <Shield size={18} className="text-rhive-pink" /> 20-Year No Dollar Limit (NDL)
                        </div>
                        <p className="text-gray-300 text-sm leading-relaxed font-serif">
                            The corporate standard. Covers 100% of material defects and certified contractor workmanship with no financial ceiling on repair costs, inspected directly by GAF technical field auditors.
                        </p>
                    </div>

                    <div className="p-6 bg-white/[0.02] border border-white/10 rounded-xl">
                        <div className="text-base font-bold text-white mb-2 flex items-center gap-2">
                            <CheckCircle2 size={18} className="text-rhive-gold" /> RHIVE Lifetime Workmanship
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed font-serif">
                            Our proprietary company warranty guarantees all flashing, scuppers, pipe boots, and terminations for the lifetime of your membrane system. If it leaks, we fix it at zero cost.
                        </p>
                    </div>
                </div>
            </section>

            {/* ── SECTION 6: UTAH GEOGRAPHIC SERVICE FOOTPRINT ─────────────────── */}
            <section className="relative z-10 py-16 px-6 max-w-6xl mx-auto border-t border-white/10">
                <div className="text-center mb-10">
                    <span className="text-xs font-mono text-cyan-400 uppercase tracking-[0.2em] block mb-2 font-bold">
                        Regional Coverage
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
                        Utah Commercial Roofing Service Footprint
                    </h2>
                    <p className="text-gray-400 font-serif italic text-base max-w-2xl mx-auto mt-2">
                        Deploying fully equipped mobile commercial hot-air welding rigs across all major Utah economic corridors.
                    </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
                    {[
                        { county: "Salt Lake County", hubs: "Salt Lake City, South Jordan, Sandy, Draper, West Valley" },
                        { county: "Utah County", hubs: "Lehi Silicon Slopes, Provo, Orem, American Fork" },
                        { county: "Davis County", hubs: "Layton, Bountiful, Clearfield, North Salt Lake" },
                        { county: "Weber County", hubs: "Ogden Commercial Hub, Business Depot Ogden (BDO)" },
                        { county: "Summit County", hubs: "Park City Commercial, Kimball Junction, Snyderville" },
                        { county: "Tooele County", hubs: "Tooele City, Stansbury Park, Industrial Park" }
                    ].map((item, idx) => (
                        <div key={idx} className="p-4 bg-white/[0.02] border border-white/5 rounded-lg">
                            <MapPin size={16} className="text-rhive-pink mx-auto mb-2" />
                            <div className="text-xs font-bold text-white uppercase">{item.county}</div>
                            <div className="text-[10px] text-gray-400 font-serif mt-1 leading-snug">{item.hubs}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── SECTION 7: RPSP 7-DAY COMMERCIAL PROMOTION ──────────────────── */}
            <section className="relative z-10 py-16 px-6 max-w-4xl mx-auto border-t border-white/10">
                <div className="bg-gradient-to-br from-black via-white/[0.02] to-black border-2 border-rhive-pink p-8 sm:p-10 rounded-2xl shadow-[0_0_35px_rgba(236,2,139,0.25)] text-center">
                    <div className="inline-block bg-rhive-pink text-white font-bold text-xs uppercase tracking-widest px-4 py-1.5 rounded-full mb-4 shadow-[0_0_12px_rgba(236,2,139,0.5)]">
                        Active Commercial Incentive
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white mb-4">
                        The RHIVE Project Savings Promotion (RPSP)
                    </h2>
                    <p className="text-gray-300 font-serif text-base max-w-2xl mx-auto leading-relaxed mb-6">
                        Eliminating sales rep follow-up overhead and passing scheduling efficiencies directly to commercial property owners. When you approve your commercial bid within 7 days, we apply an immediate 10% efficiency credit (up to $3,000) directly toward your contract total.
                    </p>
                    <button
                        onClick={handleEstimateClick}
                        className="bg-white text-black font-black text-xs uppercase tracking-widest px-8 py-4 rounded hover:bg-rhive-pink hover:text-white transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] cursor-pointer"
                    >
                        Claim 7-Day Commercial Credit
                    </button>
                </div>
            </section>

            {/* ── SECTION 8: COMMERCIAL FAQS ACCORDION ────────────────────────── */}
            <section className="relative z-10 py-16 px-6 max-w-5xl mx-auto border-t border-white/10">
                <div className="text-center mb-12">
                    <span className="text-xs font-mono text-rhive-pink uppercase tracking-[0.2em] block mb-2 font-bold">
                        Institutional Knowledge
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
                        Frequently Asked Questions: Utah Commercial Roofing
                    </h2>
                    <p className="text-gray-400 font-serif italic text-base max-w-2xl mx-auto mt-2">
                        Direct answers to pricing, building code layover regulations, NDL warranties, and winter maintenance.
                    </p>
                    <div className="w-16 h-1 bg-rhive-pink mx-auto mt-4" />
                </div>

                <div className="space-y-4">
                    {COMMERCIAL_FAQS.map((faq, idx) => {
                        const isOpen = openFaq === idx;
                        return (
                            <div 
                                key={idx} 
                                className="border border-white/10 bg-white/[0.02] hover:border-rhive-pink/40 transition-all rounded-xl overflow-hidden"
                            >
                                <button
                                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                                    className="w-full p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
                                >
                                    <span className="font-bold text-white text-base sm:text-lg leading-snug">
                                        {faq.q}
                                    </span>
                                    <div className={cn(
                                        "w-8 h-8 rounded-full border border-white/20 flex items-center justify-center shrink-0 transition-transform duration-300",
                                        isOpen ? "rotate-180 border-rhive-pink text-rhive-pink bg-rhive-pink/10" : "text-gray-400"
                                    )}>
                                        <ChevronDown size={18} />
                                    </div>
                                </button>
                                {isOpen && (
                                    <div className="px-6 pb-6 pt-1 text-gray-300 font-serif text-sm sm:text-base leading-relaxed border-t border-white/5">
                                        {faq.a}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* ── SECTION 9: TECHNICAL GUIDES CROSS-LINKING ───────────────────── */}
            <section className="relative z-10 py-16 px-6 max-w-5xl mx-auto border-t border-white/10">
                <div className="p-8 md:p-12 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="space-y-3 max-w-xl text-left">
                        <div className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400">
                            TECHNICAL RESEARCH &amp; GUIDES
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
                            Explore Commercial TPO vs. PVC &amp; Emergency Protocols
                        </h3>
                        <p className="text-sm text-gray-300 font-serif leading-relaxed">
                            Read our in-depth architectural breakdown on single-ply weld mechanics, freeze-thaw performance, and rapid leak containment protocols across Utah.
                        </p>
                        <div className="flex flex-wrap gap-3 pt-2 text-xs font-mono">
                            <a href="/blog/commercial-tpo-vs-pvc-roofing-utah-guide" className="text-rhive-pink hover:underline">
                                → TPO vs PVC Guide
                            </a>
                            <a href="/blog/fastest-emergency-roof-repair-salt-lake-city-utah" className="text-cyan-400 hover:underline">
                                → Emergency Tarping &amp; Repair
                            </a>
                            <a href="/zero-surprises-pricing" className="text-rhive-gold hover:underline">
                                → Zero Surprises Pricing
                            </a>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 shrink-0">
                        <a
                            href="/estimate-tool"
                            className="bg-rhive-pink text-white font-black text-xs uppercase tracking-widest px-8 py-4 rounded shadow-[0_0_15px_rgba(236,2,139,0.4)] hover:brightness-110 transition-all text-center"
                        >
                            Commercial Estimator
                        </a>
                        <a
                            href="/faq"
                            className="border border-white/20 hover:border-white text-white font-black text-xs uppercase tracking-widest px-8 py-4 rounded bg-white/5 hover:bg-white/10 transition-all text-center"
                        >
                            FAQ Knowledge Hub
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}
