import React, { useEffect, useState, useMemo } from 'react';
import { 
    Phone, Shield, ArrowRight, CheckCircle2, Zap, Search, 
    Calendar, DollarSign, FileText, Layers, Snowflake, Scale,
    HelpCircle, Sparkles, Building2, Home, MapPin, Wrench, 
    AlertOctagon, Sun, Hammer, Heart, ChevronDown, AlertTriangle
} from 'lucide-react';
import { cn } from '../lib/utils';

interface FaqItem {
    id: string;
    clusterId: 'pricing' | 'residential' | 'commercial' | 'accessories' | 'insurance' | 'service-areas' | 'emergency' | 'solar' | 'decking-standards' | 'leadership-culture' | 'emergency-first-aid';
    clusterTitle: string;
    question: string;
    quickAnswer: string;
    fullAnswer: React.ReactNode;
    plainAnswerText: string;
    relatedLink?: {
        label: string;
        href: string;
    };
}

const FAQ_MASTER_DATA: FaqItem[] = [
    // --- Cluster 1: Roof Replacement Pricing, Estimates & Transparency ---
    {
        id: 'cost-in-utah',
        clusterId: 'pricing',
        clusterTitle: 'Pricing & Estimates',
        question: "How much does a roof replacement cost in Utah?",
        quickAnswer: "Roof replacement costs depend on roof square footage, pitch, layer count, and material selection. At RHIVE Construction, we operate as a remote-first, tech-forward company to keep operational overhead under 10%, passing those direct savings back to you with fully itemized quotes showing exact costs for Materials, Labor, Operating Overhead, and Net Company Profit.",
        plainAnswerText: "Roof replacement costs depend on roof square footage, pitch, layer count, and material selection. Many traditional contractors inflate bids to cover sales commissions and physical warehouse overhead. At RHIVE Construction, we operate as a remote-first, tech-forward company to keep operational overhead under 10%, passing those direct savings back to you. Every quote we issue provides a fully itemized breakdown showing exact costs for Materials, Labor, Operating Overhead, and Net Company Profit. Homeowners can start with a 60-second instant Ballpark Estimate on our website for planning, or request a Certified Quote backed by precision satellite measurements and guaranteed for 14 days with fixed pricing.",
        relatedLink: {
            label: "Launch 60-Second Instant Ballpark Estimator",
            href: "/estimate-tool"
        },
        fullAnswer: (
            <div className="space-y-3.5 max-w-[70ch]">
                <p>
                    Roof replacement costs depend on roof square footage, pitch, layer count, and material selection. Many traditional contractors inflate bids to cover sales commissions and physical warehouse overhead.
                </p>
                <p>
                    At <strong className="text-white">RHIVE Construction</strong>, we operate as a remote-first, tech-forward company to keep operational overhead under 10%, passing those direct savings back to you. Every quote we issue provides a fully itemized breakdown showing exact costs for <strong className="text-white">Materials, Labor, Operating Overhead, and Net Company Profit</strong>.
                </p>
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-2 my-2">
                    <div className="text-xs font-mono font-bold uppercase tracking-wider text-rhive-pink">Transparent Quoting Options</div>
                    <ul className="text-sm md:text-base text-gray-200 space-y-2 list-disc list-inside leading-relaxed font-sans">
                        <li><strong className="text-white">60-Second Ballpark Estimate:</strong> Instant online calculation for planning and budgeting.</li>
                        <li><strong className="text-white">Certified Aerial Quote:</strong> Precision satellite photogrammetry guaranteed for 14 days with locked, zero-surprise pricing.</li>
                    </ul>
                </div>
            </div>
        )
    },
    {
        id: 'rpsp-discount',
        clusterId: 'pricing',
        clusterTitle: 'Pricing & Estimates',
        question: "What is the RHIVE Project Savings Promotion (RPSP)?",
        quickAnswer: "The RHIVE Project Savings Promotion (RPSP) is an efficiency credit that eliminates the hidden 'chase costs' built into standard contractor bids. When homeowners approve their residential estimate within 48 hours, we apply an immediate 10% Efficiency Credit (up to $1,000) directly to the project.",
        plainAnswerText: "The RHIVE Project Savings Promotion (RPSP) is an efficiency credit that eliminates the hidden 'chase costs' built into standard contractor bids. When homeowners approve their residential estimate within 48 hours, we apply an immediate 10% Efficiency Credit (up to $1,000) directly to the project. This is not a discount on material or labor quality; it is a mathematical refund of the administrative follow-up expenses saved by booking immediately.",
        relatedLink: {
            label: "Explore Zero Surprises Transparent Pricing",
            href: "/zero-surprises-pricing"
        },
        fullAnswer: (
            <div className="space-y-3.5 max-w-[70ch]">
                <p>
                    Standard roofing companies spend thousands per month on sales reps repeatedly chasing leads, driving out for multiple visits, and negotiating bids—costs that are quietly loaded into your contract.
                </p>
                <p>
                    The <strong className="text-white">RHIVE Project Savings Promotion (RPSP)</strong> is a mathematical refund of those administrative follow-up expenses. When you approve your project within 48 hours, we slash administrative friction and pass that 10% operational savings (up to $1,000) directly back to your invoice without compromising a single nail of material or workmanship quality.
                </p>
            </div>
        )
    },
    {
        id: 'rpsp-safety-net',
        clusterId: 'pricing',
        clusterTitle: 'Pricing & Estimates',
        question: "What safety net do I have if I lock in the RPSP discount?",
        quickAnswer: "Under Utah law, contracts signed outside a contractor's principal place of business carry a Statutory 3-Day Right of Rescission. This allows you to lock in the RPSP efficiency rate immediately while retaining three full business days to review specifications, compare competing estimates, or cancel with a written notice for a full deposit refund.",
        plainAnswerText: "Under Utah law, contracts signed outside a contractor's principal place of business carry a Statutory 3-Day Right of Rescission. This allows you to lock in the RPSP efficiency rate immediately while retaining three full business days to review specifications, compare competing estimates, or cancel with a written notice for a full deposit refund. Homeowners who need immediate project deployment can sign an optional waiver to begin municipal permitting right away.",
        relatedLink: {
            label: "Review 10-Stage Project Workflow & Guarantees",
            href: "/?page=P-03"
        },
        fullAnswer: (
            <div className="space-y-3.5 max-w-[70ch]">
                <p>
                    You receive complete legal and financial peace of mind. You can secure your installation queue and lock in maximum promotional savings without feeling pressured.
                </p>
                <ul className="space-y-2 list-disc list-inside text-gray-200 pl-2">
                    <li><strong className="text-white">3-Day Window:</strong> Full 72 hours to audit line items, check manufacturer specs, or cancel with 100% refund.</li>
                    <li><strong className="text-white">Fast-Track Waiver:</strong> If you face an active roof leak or urgent timeline, you can sign an optional waiver allowing us to pull municipal building permits immediately.</li>
                </ul>
            </div>
        )
    },
    {
        id: 'payment-schedule-50-40-10',
        clusterId: 'pricing',
        clusterTitle: 'Pricing & Estimates',
        question: "What is the 50/40/10 payment schedule for a residential replacement?",
        quickAnswer: "To protect your investment and ensure quality execution, RHIVE operates on a milestone-based investment schedule: 50% Initial Investment at contract signing to secure manufacturer materials and lock queue dates; 40% Mid-Project Investment on the final day of roof installation; and 10% Final Completion Holdback paid only after 100% completion, magnetic nail sweeps, and final quality sign-off.",
        plainAnswerText: "To protect your investment and ensure quality execution, RHIVE operates on a milestone-based investment schedule: 50% Initial Investment paid at contract signing to secure manufacturer materials and lock in your installation queue date; 40% Mid-Project Investment paid on the final day of primary roof installation as our certified crew finishes deploying the system; 10% Final Completion Holdback paid only after 100% project completion, including magnetic safety sweeps, punch list checks, and final quality sign-off.",
        relatedLink: {
            label: "View Financing Options & Low Monthly Plans",
            href: "/?page=P-04"
        },
        fullAnswer: (
            <div className="space-y-3.5 max-w-[70ch]">
                <p>
                    We never demand 100% upfront payment. Our 3-stage milestone framework keeps incentives aligned and ensures absolute craftsmanship accountability:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 my-2">
                    <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-1.5">
                        <div className="text-rhive-pink font-mono font-bold text-xs uppercase tracking-wider">50% Initial</div>
                        <div className="text-white font-bold text-sm md:text-base">Material Procurement</div>
                        <p className="text-xs md:text-sm text-gray-300 leading-relaxed">Secures factory-ordered shingles, components, and locked installation date.</p>
                    </div>
                    <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-1.5">
                        <div className="text-cyan-400 font-mono font-bold text-xs uppercase tracking-wider">40% Mid-Project</div>
                        <div className="text-white font-bold text-sm md:text-base">Installation Complete</div>
                        <p className="text-xs md:text-sm text-gray-300 leading-relaxed">Paid on the final day of roof installation as system deployment wraps.</p>
                    </div>
                    <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-1.5">
                        <div className="text-emerald-400 font-mono font-bold text-xs uppercase tracking-wider">10% Final</div>
                        <div className="text-white font-bold text-sm md:text-base">Quality Holdback</div>
                        <p className="text-xs md:text-sm text-gray-300 leading-relaxed">Released only after magnetic nail sweeps, punch list sign-off, and customer approval.</p>
                    </div>
                </div>
            </div>
        )
    },

    // --- Cluster 2: Residential Systems, Materials & Weather Protection ---
    {
        id: 'asphalt-shingles-rhive',
        clusterId: 'residential',
        clusterTitle: 'Residential Shingles',
        question: "What asphalt shingle systems does RHIVE Construction install?",
        quickAnswer: "RHIVE Construction is an Owens Corning Preferred Contractor. Our architectural baseline starts with the Owens Corning Duration® Series featuring patented SureNail® Technology (certified 130 MPH wind rating & 25-Year StreakGuard™ Algae Resistance). For extreme hail zones, we install Owens Corning Duration FLEX® (UL 2218 Class 4 Impact Rating for 20–30% insurance discounts). For luxury wood-shake aesthetics, we offer GAF Woodland® and Grand Sequoia® designer shingles.",
        plainAnswerText: "RHIVE Construction is an Owens Corning Preferred Contractor. Our architectural baseline starts with the Owens Corning Duration Series featuring patented SureNail Technology—an engineered woven fabric strip embedded in the fastening zone that provides a certified 130 MPH wind rating and 25-Year StreakGuard Algae Resistance. For extreme weather zones, we install Owens Corning Duration FLEX, an SBS polymer-modified asphalt shingle with a UL 2218 Class 4 Impact (Hail) Rating that absorbs severe impacts and can qualify homeowners for 20–30% insurance premium discounts. For luxury wood-shake aesthetics, we offer GAF Woodland and Grand Sequoia designer shingles.",
        relatedLink: {
            label: "Explore Owens Corning Duration vs GAF Shingles",
            href: "/blog/owens-corning-vs-gaf-shingles-utah"
        },
        fullAnswer: (
            <div className="space-y-3.5 max-w-[70ch]">
                <p>
                    We never install low-grade 3-tab builder shingles. Our entire residential catalog is engineered for high-altitude Mountain West weather:
                </p>
                <ul className="space-y-2 list-disc list-inside text-gray-200 pl-2">
                    <li><strong className="text-white">Owens Corning Duration®:</strong> Patented woven-fabric SureNail® fastening strip with 200% greater nail pull-through resistance and certified 130 MPH wind warranty.</li>
                    <li><strong className="text-white">Owens Corning Duration FLEX®:</strong> SBS modified rubberized asphalt delivering Class 4 impact resistance against hail and severe thermal shifts.</li>
                    <li><strong className="text-white">GAF Designer Series (Woodland® &amp; Grand Sequoia®):</strong> Multi-layer artisan wood-shake dimensional profiles with StainGuard Plus™ algae protection.</li>
                </ul>
            </div>
        )
    },
    {
        id: 'tear-off-vs-layover',
        clusterId: 'residential',
        clusterTitle: 'Residential Shingles',
        question: "Do you tear off old shingles or install layover roofs?",
        quickAnswer: "For all single-family residential homes, RHIVE enforces a strict 100% full tear-off policy down to the bare wood deck. We never install residential layovers because placing new shingles over old ones traps heat, hides rotted wood decking, adds excessive structural weight, and voids manufacturer system warranties.",
        plainAnswerText: "For all single-family residential homes, RHIVE enforces a strict 100% full tear-off policy down to the bare wood deck. We never install residential layovers because placing new shingles over old ones traps heat, hides rotted wood decking, adds excessive weight, and voids manufacturer system warranties. Tearing off down to the deck allows our project managers to inspect the sheathing, include up to 100 sq ft of 7/16 OSB decking replacement if needed, and lay down a clean foundation.",
        relatedLink: {
            label: "View Residential Replacement Technical Specifications",
            href: "/services/residential-roof-replacement"
        },
        fullAnswer: (
            <div className="space-y-3.5 max-w-[70ch]">
                <p>
                    Layovers (nailing new shingles over old ones) are a shortcut that creates severe long-term liabilities:
                </p>
                <ul className="space-y-2 list-disc list-inside text-gray-200 pl-2">
                    <li><strong className="text-white">Trapped Heat:</strong> Double shingle layers trap attic heat, accelerating thermal breakdown by up to 40%.</li>
                    <li><strong className="text-white">Hidden Deck Rot:</strong> Water-damaged OSB or plywood cannot be discovered without a complete tear-off.</li>
                    <li><strong className="text-white">Deck Allowance Included:</strong> RHIVE includes up to 100 sq ft of 7/16\" OSB decking replacement in our standard tear-off scopes to guarantee a solid structural deck.</li>
                    <li><strong className="text-white">Warranty Integrity:</strong> Owens Corning and GAF require a clean deck to register premium 50-year non-prorated system warranties.</li>
                </ul>
            </div>
        )
    },
    {
        id: 'ice-dam-prevention-wasatch',
        clusterId: 'residential',
        clusterTitle: 'Residential Shingles',
        question: "How does RHIVE prevent winter ice dams on Wasatch Front roofs?",
        quickAnswer: "RHIVE prevents ice dams by building a double-layer defense system: Extended Ice & Water Barrier (Owens Corning WeatherLock® self-adhering waterproofing membrane extending at least 6 feet from eaves, exceeding standard building codes, plus valleys and penetrations), and Balanced Attic Ventilation (replacing turtle vents with continuous ridge exhaust and soffit intake to keep deck temperatures uniform).",
        plainAnswerText: "In Utah, heavy snow accumulation and extreme freeze-thaw cycles (which can fluctuate over 80°F in a single day) cause destructive ice damming along eave lines. RHIVE prevents ice dams by building a double-layer defense system: Extended Ice & Water Barrier (installing Owens Corning WeatherLock self-adhering waterproofing membrane continuously across eaves, extending at least 6 feet, exceeding standard IRC building codes, and along all valleys, pipe boots, and chimney flashings), and Balanced Attic Ventilation (permanently removing inefficient 'turtle vents' and replacing them with continuous Owens Corning VentSure or GAF Cobra Ridge Exhaust Systems paired with soffit intake vents to regulate attic temperatures and stop snow from melting unevenly).",
        relatedLink: {
            label: "Read Ice Dam Prevention & Winter Roof Guide",
            href: "/blog/ice-dams-prevention-utah"
        },
        fullAnswer: (
            <div className="space-y-3.5 max-w-[70ch]">
                <p>
                    Along the Wasatch Front, diurnal temperature swings (80°F shifts) melt snow on the warm upper roof, causing runoff that refreezes at the cold overhang. Our 2-part engineering solution stops ice damage cold:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 my-2">
                    <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-1.5">
                        <div className="text-xs font-mono font-bold uppercase text-cyan-400">1. Extended 6-Ft WeatherLock®</div>
                        <p className="text-xs md:text-sm text-gray-300 leading-relaxed font-sans">Self-sealing elastomeric membrane lines eaves 6+ feet inside the heated wall line (double the 3-ft IRC code minimum).</p>
                    </div>
                    <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-1.5">
                        <div className="text-xs font-mono font-bold uppercase text-rhive-pink">2. Continuous Ridge Exhaust</div>
                        <p className="text-xs md:text-sm text-gray-300 leading-relaxed font-sans">Owens Corning VentSure® or GAF Cobra® creates steady convection airflow to keep attic temperatures matching outdoor ambient air.</p>
                    </div>
                </div>
            </div>
        )
    },

    // --- Cluster 3: Commercial Flat & Low-Slope Membrane Roofing ---
    {
        id: 'commercial-flat-utah-idaho',
        clusterId: 'commercial',
        clusterTitle: 'Commercial Flat Roofing',
        question: "Does RHIVE Construction offer commercial flat roofing in Utah and Idaho?",
        quickAnswer: "Yes. As a certified commercial installer utilizing GAF membrane systems, RHIVE specializes in flat and low-slope single-ply membrane roofing for commercial, industrial, and multi-family properties throughout the Wasatch Front and Idaho, installing both GAF EverGuard® TPO and GAF EverGuard® PVC systems in 60 mil and heavy-duty 80 mil thicknesses.",
        plainAnswerText: "Yes. As a certified commercial installer utilizing GAF membrane systems, RHIVE specializes in flat and low-slope single-ply membrane roofing for commercial, industrial, and multi-family properties throughout the Wasatch Front and Idaho. We install both GAF EverGuard TPO (Thermoplastic Polyolefin) and GAF EverGuard PVC (Polyvinyl Chloride) systems in 60 mil and heavy-duty 80 mil thicknesses.",
        relatedLink: {
            label: "Explore Commercial Flat Roofing Systems",
            href: "/services/commercial-flat-roofing"
        },
        fullAnswer: (
            <div className="space-y-3.5 max-w-[70ch]">
                <p>
                    We provide turnkey flat roofing solutions across Utah and southern Idaho for office parks, retail centers, warehouses, and multi-family residential complexes. All systems are installed by certified technicians and eligible for GAF NDL (No Dollar Limit) manufacturer guarantees.
                </p>
            </div>
        )
    },
    {
        id: 'tpo-vs-pvc-differences',
        clusterId: 'commercial',
        clusterTitle: 'Commercial Flat Roofing',
        question: "What is the difference between TPO and PVC flat roofing?",
        quickAnswer: "GAF TPO is highly reflective (Energy Star rated), heat-aging resistant, and cost-effective, actively deflecting solar heat to lower HVAC bills with 20-Year (60 mil) or 30-Year (80 mil) warranties. GAF PVC is formulated for high chemical, fire, grease, and acid resistance—essential for restaurants, food processing, or industrial roofs where exhaust oils would degrade standard TPO.",
        plainAnswerText: "GAF TPO Roofing: Highly reflective (Energy Star rated), heat-aging resistant, and cost-effective. TPO actively deflects solar heat to reduce building HVAC cooling costs during hot Utah summers. Backed by non-prorated 20-Year (60 mil) or 30-Year (80 mil) GAF System Warranties. GAF PVC Roofing: Formulated for high chemical, fire, grease, and acid resistance. PVC is essential for restaurant, food-processing, or industrial facilities where roof vents discharge fats, oils, or chemicals that would break down standard TPO membranes.",
        relatedLink: {
            label: "Read TPO vs PVC Commercial Membrane Guide",
            href: "/blog/tpo-vs-pvc-commercial-flat-roofing"
        },
        fullAnswer: (
            <div className="space-y-3.5 max-w-[70ch]">
                <p>
                    Both membranes utilize 1,000°F robotic hot-air welded seams that form a permanent physical bond stronger than the sheet itself:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 my-2">
                    <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-1.5">
                        <div className="text-cyan-400 font-mono font-bold text-xs uppercase">GAF EverGuard® TPO</div>
                        <p className="text-xs md:text-sm text-gray-300 leading-relaxed font-sans">• Best for offices, retail, and residential flat roofs</p>
                        <p className="text-xs md:text-sm text-gray-300 leading-relaxed font-sans">• Superior UV reflectance (Solar Reflectance Index &gt; 100)</p>
                        <p className="text-xs md:text-sm text-gray-300 leading-relaxed font-sans">• Most economical commercial installation cost</p>
                    </div>
                    <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-1.5">
                        <div className="text-rhive-pink font-mono font-bold text-xs uppercase">GAF EverGuard® PVC</div>
                        <p className="text-xs md:text-sm text-gray-300 leading-relaxed font-sans">• Essential for restaurants, kitchens &amp; chemical plants</p>
                        <p className="text-xs md:text-sm text-gray-300 leading-relaxed font-sans">• Unaffected by animal fats, oils, and chemical runoff</p>
                        <p className="text-xs md:text-sm text-gray-300 leading-relaxed font-sans">• Exceptional sub-zero flexibility in Utah winters</p>
                    </div>
                </div>
            </div>
        )
    },
    {
        id: 'commercial-layover-rules',
        clusterId: 'commercial',
        clusterTitle: 'Commercial Flat Roofing',
        question: "Are layover membrane installations allowed on commercial roofs in Utah?",
        quickAnswer: "Yes. Under Utah building codes, single-layer commercial flat roofs in structurally sound, dry condition can receive a certified layover membrane installation. Our certified crews install new Polyiso thermal insulation cover boards and weld a fresh GAF TPO or PVC membrane directly over the existing system, saving business owners significant upfront tear-off and dumping fees.",
        plainAnswerText: "Yes. Under Utah building codes, single-layer commercial flat roofs in structurally sound, dry condition can receive a certified layover membrane installation. Our certified crews install new Polyiso thermal insulation cover boards and weld a fresh GAF TPO or PVC membrane directly over the existing system, saving business owners significant upfront tear-off and dumping fees.",
        relatedLink: {
            label: "Schedule a Commercial Roof Moisture Assessment",
            href: "/services/commercial-flat-roofing"
        },
        fullAnswer: (
            <div className="space-y-3.5 max-w-[70ch]">
                <p>
                    Commercial layovers can save property owners 25–35% in labor and landfill dumping costs, provided an infrared moisture scan verifies the existing insulation core is dry. If water saturation is found, localized wet insulation is replaced before installing the new Polyiso cover board and welded membrane.
                </p>
            </div>
        )
    },

    // --- Cluster 4: Roofing Accessories, Water & Ice Management ---
    {
        id: 'gutters-rhive-installs',
        clusterId: 'accessories',
        clusterTitle: 'Gutters & Ice Dams',
        question: "What type of rain gutters does RHIVE install?",
        quickAnswer: "RHIVE custom-extrudes continuous, seamless aluminum rain gutters on-site in 5-inch and 6-inch troughs across three profiles: K-Style (standard crown molding look), Half-Round (European-style historic/modern), and Box/Square-Style (sleek architectural builds). To support heavy Utah snow loads, we install heavy-duty hidden screw hangers every 24 inches with a No-Leak Guarantee and 20-year finish warranty.",
        plainAnswerText: "RHIVE custom-extrudes continuous, seamless aluminum rain gutters on-site to eliminate leaking joints and sagging. We offer 5-inch and 6-inch troughs in three profiles: K-Style Gutters (mimics architectural crown molding; standard for single-family homes), Half-Round Gutters (European-style semi-circular profile for modern or historic aesthetics), and Box/Square-Style Gutters (sleek, flat-faced modern profile for architectural builds). To support heavy Utah snow loads, RHIVE installs heavy-duty hidden screw-in hangers spaced tightly at every 24 inches (exceeding standard 30-inch spacing), backed by our No-Leak Gutter Guarantee and a 20-year finish warranty.",
        relatedLink: {
            label: "View Seamless Gutters & Water Management Guide",
            href: "/blog/seamless-gutters-importance-utah"
        },
        fullAnswer: (
            <div className="space-y-3.5 max-w-[70ch]">
                <p>
                    We extrude continuous aluminum lengths directly from our mobile fabrication trucks, eliminating leak-prone mid-span seam joints:
                </p>
                <ul className="space-y-2 list-disc list-inside text-gray-200 pl-2">
                    <li><strong className="text-white">K-Style Profile:</strong> Classic Ogee shape with high flow capacity for residential roofs.</li>
                    <li><strong className="text-white">Half-Round Profile:</strong> Clean radius look for luxury modern and historic renovations.</li>
                    <li><strong className="text-white">Box / Square Profile:</strong> Bold geometric lines popular in contemporary custom homes.</li>
                    <li><strong className="text-white">Snow-Load Bracket Spacing:</strong> Heavy-duty hidden hangers screwed directly into rafter tails every 24 inches (vs. 30\" industry standard) to withstand Wasatch snow and ice pack.</li>
                </ul>
            </div>
        )
    },
    {
        id: 'heat-trace-cables-eaves',
        clusterId: 'accessories',
        clusterTitle: 'Gutters & Ice Dams',
        question: "How do self-regulating heat trace cables protect roof eaves?",
        quickAnswer: "For homes with northern exposures or deep roof valleys prone to chronic icing, we install commercial-grade self-regulating heat trace cable systems rated at 5 Watts per linear foot (110V). The system features an intelligent thermostat that senses ambient temperatures (35°F to 45°F) and activates only when freezing precipitation occurs, creating open melt channels along eaves and downspouts without wasting power.",
        plainAnswerText: "For homes with northern exposures or deep roof valleys prone to chronic icing, we install commercial-grade self-regulating heat trace cable systems rated at 5 Watts per linear foot (110V). The system features an intelligent thermostat that senses ambient temperatures (35°F to 45°F) and activates only when freezing precipitation occurs, creating open melt channels along eaves and downspouts without wasting power.",
        relatedLink: {
            label: "Explore Roofing Accessories & Heat Cables",
            href: "/services/roofing-accessories"
        },
        fullAnswer: (
            <div className="space-y-3.5 max-w-[70ch]">
                <p>
                    Unlike cheap constant-wattage hardware store cables that overheat or burn out, our commercial self-regulating conductive core automatically increases heat output as temperature drops and decreases output when ambient warmth rises. This keeps drainage pathways open through gutters and downspouts safely and energy-efficiently.
                </p>
            </div>
        )
    },

    // --- Cluster 5: Storm Damage, Insurance Claims & Warranties ---
    {
        id: 'storm-damage-eligibility',
        clusterId: 'insurance',
        clusterTitle: 'Storm Claims & Warranties',
        question: "How do I know if my roof has storm damage eligible for an insurance claim?",
        quickAnswer: "Hail impacts leave dark, soft bruises and granule loss deposits in downspouts, while severe open-valley winds create horizontal thermal creases across asphalt shingles. Roofs between 12 and 24 years old are prime candidates for storm-related insurance claims. Before filing a claim—which could add an unnecessary claim strike if denied—we recommend booking an RHIVE Storm Inspection with on-roof photo documentation.",
        plainAnswerText: "Hail impacts leave dark, soft bruises and granule loss deposits in downspouts, while severe open-valley winds create horizontal thermal creases across asphalt shingles. Roofs between 12 and 24 years old are prime candidates for storm-related insurance claims. Before filing a claim—which could add an unnecessary claim strike if denied—we recommend booking an RHIVE Storm Inspection. Our team performs digital aerial modeling and on-roof photo documentation, and our CEO, Michael Robinson, will meet your insurance adjuster on-site to ensure all local codes and code-required items are covered.",
        relatedLink: {
            label: "Read Wasatch Roof Damage & Insurance Guide",
            href: "/blog/roof-damage-insurance-claims-utah"
        },
        fullAnswer: (
            <div className="space-y-3.5 max-w-[70ch]">
                <p>
                    Filing a premature claim without verifiable evidence can leave a claim strike on your insurance record. RHIVE provides data-first advocacy:
                </p>
                <ol className="space-y-2 list-decimal list-inside text-gray-200 pl-2">
                    <li><strong className="text-white">Drone &amp; Physical Inspection:</strong> High-resolution photos documenting hail bruising, granular detachment, and creased shingles.</li>
                    <li><strong className="text-white">Meteorological Swath Data:</strong> Historical radar wind and hail verification confirming the exact storm date.</li>
                    <li><strong className="text-white">On-Site Adjuster Meeting:</strong> We walk your roof with your insurance adjuster to ensure all code-mandated underlayment, drip edge, and flashing items are approved.</li>
                </ol>
            </div>
        )
    },
    {
        id: 'warranties-double-layer',
        clusterId: 'insurance',
        clusterTitle: 'Storm Claims & Warranties',
        question: "What warranties protect my new roof from RHIVE Construction?",
        quickAnswer: "Every complete roof replacement is secured by a double layer of warranty protection: Manufacturer Total Protection Warranty (Owens Corning Preferred Protection or GAF System Plus® offering 50 years of non-prorated material and labor defect coverage) and RHIVE's Lifetime Installer No-Leak Guarantee (ensuring 100% free inspection and repair if any leak develops due to our workmanship for the lifetime of the roof).",
        plainAnswerText: "Every complete roof replacement is secured by a double layer of warranty protection: Manufacturer Total Protection Warranty (Owens Corning Preferred Protection or GAF System Plus offering 50 years of non-prorated material and labor defect coverage) and RHIVE Lifetime Installer No-Leak Guarantee (our master craftsman guarantee ensuring that if any leak develops due to our installation workmanship, RHIVE will inspect and repair the area 100% free of charge for the lifetime of the roof).",
        relatedLink: {
            label: "Read About RHIVE Leadership & Lifetime Guarantees",
            href: "/?page=P-01"
        },
        fullAnswer: (
            <div className="space-y-3.5 max-w-[70ch]">
                <p>
                    Most contractor workmanship warranties expire after only 2 years. At RHIVE, our dual-tier protection ensures lifetime peace of mind:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 my-2">
                    <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-1.5">
                        <div className="text-rhive-gold font-mono font-bold text-xs uppercase">50-Year Manufacturer Warranty</div>
                        <p className="text-xs md:text-sm text-gray-300 leading-relaxed font-sans">Non-prorated coverage for shingle manufacturing defects, tear-off labor, and replacement materials.</p>
                    </div>
                    <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-1.5">
                        <div className="text-rhive-pink font-mono font-bold text-xs uppercase">RHIVE Lifetime Workmanship Guarantee</div>
                        <p className="text-xs md:text-sm text-gray-300 leading-relaxed font-sans">Covers 100% of installation labor, flashing, and leak repair with zero deductibles or service fees.</p>
                    </div>
                </div>
            </div>
        )
    },

    // --- Cluster 6: Service Areas, Inspections & Remote Diagnostics ---
    {
        id: 'service-areas-coverage',
        clusterId: 'service-areas',
        clusterTitle: 'Service Areas & Aerial Quotes',
        question: "What geographic areas does RHIVE Construction service?",
        quickAnswer: "RHIVE Construction is headquartered at 10437 Shady Plum Way, South Jordan, UT 84009. We proudly serve the entire Wasatch Front, including Salt Lake City, Sandy, Draper, South Jordan, West Jordan, Riverton, Herriman, Lehi, Murray, Midvale, Park City, and surrounding mountain communities, extending into Idaho for commercial flat roofing projects.",
        plainAnswerText: "RHIVE Construction is headquartered at 10437 Shady Plum Way, South Jordan, UT 84009. We proudly serve the entire Wasatch Front, including Salt Lake City, Sandy, Draper, South Jordan, West Jordan, Riverton, Herriman, Lehi, Murray, Midvale, Park City, and surrounding Wasatch Front and mountain communities, extending into Idaho for commercial flat roofing.",
        relatedLink: {
            label: "View Sandy, West Jordan & Salt Lake Service Areas",
            href: "/service-areas/sandy-ut"
        },
        fullAnswer: (
            <div className="space-y-3.5 max-w-[70ch]">
                <p>
                    Our service territory covers Salt Lake County, Utah County, Summit County, Davis County, and southern Idaho:
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                    {['South Jordan', 'Sandy', 'West Jordan', 'Salt Lake City', 'Draper', 'Herriman', 'Riverton', 'Lehi', 'Murray', 'Midvale', 'Park City', 'Idaho (Commercial)'].map(area => (
                        <span key={area} className="px-3 py-1 rounded-md bg-white/[0.03] border border-white/10 text-xs text-gray-300 font-mono">
                            {area}
                        </span>
                    ))}
                </div>
            </div>
        )
    },
    {
        id: 'remote-aerial-diagnostics',
        clusterId: 'service-areas',
        clusterTitle: 'Service Areas & Aerial Quotes',
        question: "Do you need to visit my home in person to generate a quote?",
        quickAnswer: "No! We utilize Roofr precision measurement reports, high-definition satellite modeling, and Google Maps to evaluate your roof structure remotely. This allows us to deliver a 24–48 hour Remote Certified Aerial Quote that accurately calculates roof pitch, square footage, eave lengths, and facet counts without disturbing your day.",
        plainAnswerText: "No! We utilize Roofr precision measurement reports, high-definition satellite modeling, and Google Maps to evaluate your roof structure remotely. This allows us to deliver a 24–48 hour Remote Certified Aerial Quote that accurately calculates roof pitch, square footage, eave lengths, and facet counts without disturbing your day.",
        relatedLink: {
            label: "Try Instant Drone & Satellite Estimator",
            href: "/estimate-tool"
        },
        fullAnswer: (
            <div className="space-y-3.5 max-w-[70ch]">
                <p>
                    You no longer have to wait around for a high-pressure salesperson to sit at your kitchen table for two hours. Enter your address, and our engineering desk will analyze satellite elevation photogrammetry to provide an accurate, itemized proposal within 24 to 48 hours.
                </p>
            </div>
        )
    },

    // --- Cluster 7: Emergency Roofing, Leak Containment & Tarping Protocols ---
    {
        id: 'emergency-active-leak',
        clusterId: 'emergency',
        clusterTitle: 'Emergency & Tarping',
        question: "What should I do if water is actively leaking into my home right now?",
        quickAnswer: "If water is actively leaking through your ceiling, call RHIVE Emergency Services immediately at 435-417-6637 (or our emergency dispatch line at 743-887-6637). While our rapid-response crew is en route, place a bucket or container under the leak, carefully poke a small pinhole in the sagging drywall to release trapped water, and take photos of the affected area. Hunni (our AI Assistant) will text you a secure link to upload those photos so our crew arrives with the exact materials needed to contain the breach.",
        plainAnswerText: "If water is actively leaking through your ceiling, call RHIVE Emergency Services immediately at 435-417-6637 (or our emergency dispatch line at 743-887-6637). While our rapid-response crew is en route, place a bucket or container under the leak, carefully poke a small pinhole in the sagging drywall to release trapped water, and take photos of the affected area. Hunni (our AI Assistant) will text you a secure link to upload those photos so our crew arrives with the exact materials needed to contain the breach.",
        relatedLink: {
            label: "Call RHIVE 24/7 Emergency Dispatch",
            href: "tel:4354176637"
        },
        fullAnswer: (
            <div className="space-y-3.5 max-w-[70ch]">
                <p>
                    During an active water breach, fast containment prevents catastrophic structural and mold damage:
                </p>
                <ol className="space-y-2 list-decimal list-inside text-gray-200 pl-2">
                    <li><strong className="text-white">Call Dispatch Immediately:</strong> Reach our emergency desk at <a href="tel:4354176637" className="text-rhive-pink underline font-bold">435-417-6637</a> or <a href="tel:7438876637" className="text-rhive-pink underline font-bold">743-887-6637</a>.</li>
                    <li><strong className="text-white">Relieve Ceiling Pressure:</strong> Place a catch container below, then poke a small hole with a screwdriver in the center of any sagging drywall blister so water drains freely rather than spreading across the ceiling.</li>
                    <li><strong className="text-white">Upload Digital Photos:</strong> Hunni (our AI dispatch coordinator) sends an instant text link to upload photos for our en-route technicians.</li>
                </ol>
            </div>
        )
    },
    {
        id: 'emergency-tarping-cost-credit',
        clusterId: 'emergency',
        clusterTitle: 'Emergency & Tarping',
        question: "How much does emergency roof tarping cost, and is it credited toward my replacement?",
        quickAnswer: "Our emergency pitched-roof tarping dispatch is a flat $350 fee for a standard minimum coverage area of approximately 30 square feet. 100% of this $350 fee is credited directly toward your permanent roof repair or full replacement when you move forward with RHIVE Construction, or billed directly to your active insurance claim. We utilize high-performance, UV-resistant synthetic underlayment secured with plastic cap nails to create a temporary, water-shedding seal for up to 90 days without introducing unnecessary penetrations into undamaged roof sections.",
        plainAnswerText: "Our emergency pitched-roof tarping dispatch is a flat $350 fee for a standard minimum coverage area of approximately 30 square feet. 100% of this $350 fee is credited directly toward your permanent roof repair or full replacement when you move forward with RHIVE Construction, or billed directly to your active insurance claim. We utilize high-performance, UV-resistant synthetic underlayment secured with plastic cap nails to create a temporary, water-shedding seal for up to 90 days without introducing unnecessary penetrations into undamaged roof sections.",
        relatedLink: {
            label: "Schedule Emergency Pitched Roof Tarping",
            href: "/estimate-tool"
        },
        fullAnswer: (
            <div className="space-y-3.5 max-w-[70ch]">
                <p>
                    Unlike temporary blue tarps that shred in heavy Wasatch canyon gusts within days, RHIVE installs heavy-duty commercial synthetic membranes secured with plastic cap fasteners that protect your roof deck for up to 90 days while insurance adjusters review your claim. The full $350 emergency fee is 100% credited to your permanent reroofing contract.
                </p>
            </div>
        )
    },
    {
        id: 'commercial-emergency-membrane-repair',
        clusterId: 'emergency',
        clusterTitle: 'Emergency & Tarping',
        question: "How does RHIVE handle emergency membrane leaks on commercial flat roofs?",
        quickAnswer: "For commercial flat roofs (TPO or PVC), we deploy our Emergency Membrane Repair Protocol to execute a surgical, watertight seal at the point of failure using one of three containment methods: Fusion Heat-Welded Patch (fusion heat-welded directly to existing substrate for a monolithic bond), Adhered Patch with Weld Perimeter (bonded with commercial adhesive with heat-welded perimeter edge), or Roll-On Liquid Sealant (specialized UV-stable liquid flashing for aged or non-weldable membranes).",
        plainAnswerText: "For commercial flat roofs (TPO or PVC), we deploy our Emergency Membrane Repair Protocol to execute a surgical, watertight seal at the point of failure. Depending on the membrane's age and condition, we deploy one of three containment methods: Fusion Heat-Welded Patch (a compatible membrane patch is fusion heat-welded directly to the existing substrate for a monolithic bond), Adhered Patch with Weld Perimeter (a patch is bonded with commercial adhesive and its edges are heat-welded for secondary perimeter protection), or Roll-On Liquid Sealant (for aged or non-weldable membranes, a specialized UV-stable liquid flashing is applied to create a seamless, fully adhered seal).",
        relatedLink: {
            label: "Learn More About Commercial Membrane Services",
            href: "/services/commercial-flat-roofing"
        },
        fullAnswer: (
            <div className="space-y-3.5 max-w-[70ch]">
                <p>
                    Commercial flat roofs require material-specific engineering to stop water from traveling through insulation boards:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 my-2">
                    <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-1.5">
                        <div className="text-cyan-400 font-mono font-bold text-xs uppercase">Fusion Welded Patch</div>
                        <p className="text-xs md:text-sm text-gray-300 leading-relaxed font-sans">1,000°F robotic hot-air weld creates a molecular bond with the existing TPO/PVC sheet.</p>
                    </div>
                    <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-1.5">
                        <div className="text-rhive-pink font-mono font-bold text-xs uppercase">Adhered &amp; Welded</div>
                        <p className="text-xs md:text-sm text-gray-300 leading-relaxed font-sans">Dual-layer chemical adhesive bond with secondary heat-welded outer perimeter.</p>
                    </div>
                    <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-1.5">
                        <div className="text-rhive-gold font-mono font-bold text-xs uppercase">Liquid Flashing</div>
                        <p className="text-xs md:text-sm text-gray-300 leading-relaxed font-sans">Seamless elastomeric polymer sealant for aged, weathered, or non-weldable systems.</p>
                    </div>
                </div>
            </div>
        )
    },

    // --- Cluster 8: Solar Panel Integration, Detach & Reset (D&R) & Decommissioning ---
    {
        id: 'solar-panel-detach-reset',
        clusterId: 'solar',
        clusterTitle: 'Solar D&R & Decommissioning',
        question: "Can I install solar panels on my roof, or replace a roof with an existing solar array?",
        quickAnswer: "Yes! However, installing a new roof around active solar panels—or letting uncertified solar crews dismantle your roof eave mounts—is a leading cause of early roof leaks and voided shingle warranties. RHIVE Construction provides complete, in-house Solar Panel Detach & Reset (D&R) services in coordination with licensed electricians. Our licensed electrician executes a Mandatory Electrical Disconnect at the inverter before work begins; our team unbolts the array, safely stores the PV modules, completes the 100% shingle tear-off and reroofing, resets the racking mounts with new waterproof flashings, and has the electrician re-energize and test the system.",
        plainAnswerText: "Yes! However, installing a new roof around active solar panels—or letting uncertified solar crews dismantle your roof eave mounts—is a leading cause of early roof leaks and voided shingle warranties. RHIVE Construction provides complete, in-house Solar Panel Detach & Reset (D&R) services in coordination with licensed electricians. Our licensed electrician executes a Mandatory Electrical Disconnect (ELEC-DET-RES / ELEC-DET-COM) at the inverter before work begins. Our team unbolts the array, safely stores the PV modules, completes the 100% shingle tear-off and reroofing, resets the racking mounts with new waterproof flashings, and has the electrician re-energize and test the system.",
        relatedLink: {
            label: "Read Solar Panel Roof Integration Guide",
            href: "/blog/solar-panels-roof-replacement-utah"
        },
        fullAnswer: (
            <div className="space-y-3.5 max-w-[70ch]">
                <p>
                    Attempting to shingle around existing solar panels creates chronic leak zones and immediately voids Owens Corning and GAF system warranties. RHIVE's turnkey D&R protocol provides complete protection:
                </p>
                <ul className="space-y-2 list-disc list-inside text-gray-200 pl-2">
                    <li><strong className="text-white">Licensed Electrical Disconnect:</strong> Inverters and AC/DC disconnect switches are safely isolated before panels are unbolted.</li>
                    <li><strong className="text-white">Protected Module Staging:</strong> Photovoltaic panels are cataloged and staged in padded ground racks during roof replacement.</li>
                    <li><strong className="text-white">New Deck Flashing Mounts:</strong> All solar standoffs are reinstalled with brand-new lag bolts and elastomeric waterproofing flashings before system re-commissioning.</li>
                </ul>
            </div>
        )
    },
    {
        id: 'persons-on-roof-3-day-rule',
        clusterId: 'solar',
        clusterTitle: 'Solar D&R & Decommissioning',
        question: "What is the 'Persons on Roof' 3-day rule for maintaining my RHIVE Lifetime Warranty?",
        quickAnswer: "Under the terms of the RHIVE Roof Warranty, homeowners must notify RHIVE Construction in writing within 3 business days of any third-party work being performed on the roof deck (including solar panel arrays, skylights, chimney masonry, or mounting holiday lights). Once notified, RHIVE schedules a professional inspection within 45 days to verify that no uncertified mechanical damage (like exposed 'shiners' or torn shingles) occurred during third-party work, keeping your Lifetime Installer No-Leak Guarantee 100% active.",
        plainAnswerText: "Under the terms of the RHIVE Roof Warranty, homeowners must notify RHIVE Construction in writing within 3 business days of any third-party work being performed on the roof deck. This includes installing solar panel arrays, replacing skylights, repairing chimney masonry, or even mounting Christmas lights. Once notified, RHIVE schedules a professional inspection within 45 days to verify that no uncertified mechanical damage (like exposed 'shiners' or torn shingles) occurred during the third-party work, keeping your Lifetime Installer No-Leak Guarantee 100% active. Homeowners are advised to avoid roof foot traffic entirely, as shingles are not designed for foot load.",
        relatedLink: {
            label: "Review Residential Warranty Guidelines",
            href: "/services/residential-roof-replacement"
        },
        fullAnswer: (
            <div className="space-y-3.5 max-w-[70ch]">
                <p>
                    Asphalt shingles and single-ply membranes are engineered as water-shedding shields—not walking surfaces. Uncertified solar crews, painters, or HVAC technicians walking across hot shingles can easily puncture underlayment or scuff granules.
                </p>
                <p>
                    By notifying RHIVE within 3 business days of any third-party roof access, our project manager conducts a post-work inspection within 45 days to certify that your roof envelope remains fully intact and your Lifetime Guarantee stays unconditionally valid.
                </p>
            </div>
        )
    },
    {
        id: 'solar-decommission-removal',
        clusterId: 'solar',
        clusterTitle: 'Solar D&R & Decommissioning',
        question: "Can RHIVE safely decommission and remove an unwanted solar panel array?",
        quickAnswer: "Yes. If your property has an old, non-functional, or abandoned solar array, RHIVE provides complete Solar System Cancellation (SOLAR-PANEL-CANCEL). A licensed electrician safely de-energizes all electrical conduits, our crew removes all panels, racking, and hardware for proper waste disposal, and we permanently seal and patch all pre-existing roof deck penetrations during your full reroofing process.",
        plainAnswerText: "Yes. If your property has an old, non-functional, or abandoned solar array, RHIVE provides complete Solar System Cancellation (SOLAR-PANEL-CANCEL). A licensed electrician safely de-energizes all electrical conduits, our crew removes all panels, racking, and hardware for proper waste disposal, and we permanently seal and patch all pre-existing roof deck penetrations during your full reroofing process.",
        relatedLink: {
            label: "Get a Quote for Solar Removal & Reroofing",
            href: "/estimate-tool"
        },
        fullAnswer: (
            <div className="space-y-3.5 max-w-[70ch]">
                <p>
                    Old or orphaned solar panels often cause chronic roof leaks and drag down home resale value. Our turnkey decommissioning service includes electrical conduit capping, panel recycling disposal, and replacing all damaged roof decking with fresh 7/16\" OSB before shingle installation.
                </p>
            </div>
        )
    },

    // --- Cluster 9: Wood Rot, Decking Replacement & Structural Standards ---
    {
        id: 'rotted-decking-tear-off',
        clusterId: 'decking-standards',
        clusterTitle: 'Wood Rot & Decking Standards',
        question: "What happens if rotted wood decking is discovered during shingle tear-off?",
        quickAnswer: "During our 100% residential tear-off down to the bare wood deck, our project managers inspect every sheathing sheet for structural rot, mold, or water saturation. Every complete RHIVE residential roofing package includes up to 100 sq ft of 7/16 OSB Decking replacement at no additional cost. Additional required sheets are billed at transparent, pre-agreed rates: 7/16 OSB at $72.50/sheet ($2.27/sq ft), 19/32 Sheathing at $77.50/sheet ($2.42/sq ft), and 1\"x6\" Slat Planking at $52.50/board ($6.56/lin ft).",
        plainAnswerText: "During our 100% residential tear-off down to the bare wood deck, our project managers inspect every sheathing sheet for structural rot, mold, or water saturation. Every complete RHIVE residential roofing package includes up to 100 sq ft of 7/16 OSB Decking replacement at no additional cost. If widespread wood damage is discovered, any additional sheets required are billed at transparent, pre-agreed standardized rates clearly specified in your agreement: 7/16 OSB Sheathing at $72.50 per 4x8 sheet ($2.27/sq ft), 19/32 Sheathing at $77.50 per 4x8 sheet ($2.42/sq ft), and 1\" x 6\" Slat Board Planking at $52.50 per board ($6.56/linear ft).",
        relatedLink: {
            label: "View Zero Surprises Itemized Wood Rates",
            href: "/zero-surprises-pricing"
        },
        fullAnswer: (
            <div className="space-y-3.5 max-w-[70ch]">
                <p>
                    Unlike contractors who quote low and then charge arbitrary, inflated prices for wood repairs on the day of tear-off, RHIVE locks in your wood rates in writing before work begins:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 my-2">
                    <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-1">
                        <div className="text-white font-bold text-xs md:text-sm">7/16\" OSB Sheathing</div>
                        <div className="text-rhive-pink font-bold text-sm md:text-base">$72.50 / Sheet</div>
                        <p className="text-xs text-gray-400">$2.27 / sq ft installed</p>
                    </div>
                    <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-1">
                        <div className="text-white font-bold text-xs md:text-sm">19/32\" CDX Plywood</div>
                        <div className="text-cyan-400 font-bold text-sm md:text-base">$77.50 / Sheet</div>
                        <p className="text-xs text-gray-400">$2.42 / sq ft installed</p>
                    </div>
                    <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-1">
                        <div className="text-white font-bold text-xs md:text-sm">1\" x 6\" Slat Planking</div>
                        <div className="text-emerald-400 font-bold text-sm md:text-base">$52.50 / Board</div>
                        <p className="text-xs text-gray-400">$6.56 / linear ft installed</p>
                    </div>
                </div>
                <p className="text-xs md:text-sm text-gray-300 italic">
                    *First 100 square feet of 7/16" OSB decking replacement is 100% free with every complete residential roof replacement package.
                </p>
            </div>
        )
    },
    {
        id: 'roof-valley-techniques',
        clusterId: 'decking-standards',
        clusterTitle: 'Wood Rot & Decking Standards',
        question: "What roof valley installation techniques does RHIVE Construction use?",
        quickAnswer: "At RHIVE Construction, we exclusively use the California Cut valley method backed by continuous Owens Corning WeatherLock® or GAF WeatherWatch® Ice & Water Shield. The California Cut creates a clean, straight shingle line down the valley that delivers superior water shedding and a smooth architectural finish, with optional upgrades to pre-formed 26-gauge steel W-Valley metal flashing for heavy mountain snow zones.",
        plainAnswerText: "In roofing, valleys direct heavy water runoff off the roof deck. At RHIVE Construction, we exclusively use the California Cut valley method backed by continuous Owens Corning WeatherLock or GAF WeatherWatch Ice & Water Shield. The California Cut creates a clean, straight shingle line down the valley that delivers superior water shedding and a smooth architectural finish. We also offer an optional upgrade to pre-formed 26-gauge steel W-Valley metal flashing for homes in heavy snow zones.",
        relatedLink: {
            label: "Read DIY Roof Inspection Checklist & Valley Standards",
            href: "/blog/diy-roof-checklist-utah"
        },
        fullAnswer: (
            <div className="space-y-3.5 max-w-[70ch]">
                <p>
                    Valleys handle the highest concentration of roof runoff and snowpack. We reject cheap 'woven' valleys that buckle over time. Our California Cut protocol features a vertical starter run up the valley line that creates an unyielding water channel, backed by full 36-inch wide self-adhering elastomeric membrane.
                </p>
            </div>
        )
    },
    {
        id: 'vegetation-compliance-zone',
        clusterId: 'decking-standards',
        clusterTitle: 'Wood Rot & Decking Standards',
        question: "Why does RHIVE enforce a '12-Inch Vegetation Compliance Zone'?",
        quickAnswer: "Overhanging tree branches and creeping vines act like mechanical saws, scraping shingle granules off the roof during high winds and dropping leaves that hold water against the deck. Under our Roofline Vegetation Management protocol, we trim all overhanging branches back to establish a strict minimum 12-inch clearance zone (ideally 1 to 3 feet back from the roof edge) to prevent physical abrasion, stop animal roof access, and keep manufacturer warranties compliant.",
        plainAnswerText: "Overhanging tree branches and creeping vines act like mechanical saws, scraping shingle granules off the roof during high winds and dropping leaves that hold water against the deck. Under our Roofline Vegetation Management protocol, we trim all overhanging branches back to establish a strict minimum 12-inch clearance zone (ideally 1 to 3 feet back from the roof edge). Establishing this clearance prevents physical abrasion, stops animal access, and ensures your manufacturer system warranty remains fully compliant.",
        relatedLink: {
            label: "Explore Complete Roofing Accessories & Tree Protection",
            href: "/services/roofing-accessories"
        },
        fullAnswer: (
            <div className="space-y-3.5 max-w-[70ch]">
                <p>
                    Contact between tree limbs and shingles causes premature granular detachment, lichen growth, and gutter clogs. Maintaining the 12-inch minimum buffer protects your shingle fiberglass mat and prevents rodents and raccoons from accessing your roof deck.
                </p>
            </div>
        )
    },

    // --- Cluster 10: Company Leadership, Culture & Community Impact ("Our Hive") ---
    {
        id: 'female-owned-leadership',
        clusterId: 'leadership-culture',
        clusterTitle: 'Leadership & Community',
        question: "What sets RHIVE Construction apart as a female-owned and operated contractor?",
        quickAnswer: "RHIVE Construction was co-founded by Kara Robinson (President) and Michael Robinson (CEO) to challenge an industry historically known for inflated pricing, vague lump-sum bids, and poor communication. As a proudly female-owned and operated business, RHIVE fuses advanced AI automation and satellite diagnostics with an empathetic, people-first culture, operating with a remote-first administrative model that eliminates costly sales reps and physical warehouse overhead to pass direct savings back to clients.",
        plainAnswerText: "RHIVE Construction was co-founded by Kara Robinson (President) and Michael Robinson (CEO) to challenge an industry historically known for inflated pricing, vague lump-sum bids, and poor communication. As a proudly female-owned and operated business, RHIVE fuses advanced AI automation and satellite diagnostics with an empathetic, people-first culture. We operate with a remote-first administrative model that eliminates costly sales reps and physical warehouse overhead, passing those savings back to clients through itemized pricing and a Lifetime Installer No-Leak Guarantee.",
        relatedLink: {
            label: "Read Female Leadership in Construction Feature",
            href: "/blog/female-leadership-construction"
        },
        fullAnswer: (
            <div className="space-y-3.5 max-w-[70ch]">
                <p>
                    For decades, the roofing industry has relied on opacity—pushy door-to-door sales reps, generic single-paragraph bids, and workmanship warranties that disappear when a leak actually happens.
                </p>
                <p>
                    <strong className="text-white">Kara Robinson</strong> and <strong className="text-white">Michael Robinson</strong> built RHIVE to set a new benchmark for structural transparency. By automating measurements, tracking radar swath data, and keeping company overhead below 10%, we provide client portal visibility and radical pricing transparency across every single project.
                </p>
            </div>
        )
    },
    {
        id: 'community-initiatives-heroes',
        clusterId: 'leadership-culture',
        clusterTitle: 'Leadership & Community',
        question: "How does RHIVE Construction give back to local Utah communities?",
        quickAnswer: "Through our community initiatives, RHIVE is built on the belief that a company must be larger than itself: Free Roofs for Heroes (gifting full, zero-cost roof replacements to local veterans, teachers, first responders, and families facing extreme hardship), June Suicide Prevention Campaign (donating a percentage of all June roofing sales to local crisis centers in memory of Kara Robinson's mother), and 'Own Your Tools' Trade Scholarships supporting women entering construction.",
        plainAnswerText: "Through our community initiatives, RHIVE is built on the belief that a company must be larger than itself: Free Roofs for Heroes (we gift full, zero-cost roof replacements to local veterans, teachers, first responders, and families facing extreme hardship in every state we operate), June Suicide Prevention Campaign (in memory of Kara Robinson's mother, every June a percentage of all roofing sales is donated directly to local suicide prevention lifelines and crisis centers, while crisis resources are distributed to our clients and team), and 'Own Your Tools' & Trade Scholarships (hosting hands-on home repair workshops for women and awarding annual trade scholarships to support women entering the construction trades).",
        relatedLink: {
            label: "Learn More About Our Hive & Story",
            href: "/?page=P-01"
        },
        fullAnswer: (
            <div className="space-y-3.5 max-w-[70ch]">
                <p>
                    We believe in deploying our construction capability directly into community impact:
                </p>
                <div className="space-y-2.5 text-gray-200">
                    <p><strong className="text-white">Free Roofs for Heroes:</strong> Full complimentary roof replacements for veterans, educators, and first responders facing financial hardship.</p>
                    <p><strong className="text-white">June Mental Health Campaign:</strong> In honor of Kara’s mother, June sales directly fund regional suicide prevention hotlines and community crisis resources.</p>
                    <p><strong className="text-white">"Own Your Tools" &amp; Trade Scholarships:</strong> Free hands-on DIY workshops empowering women with home repair skills and trade school funding.</p>
                </div>
            </div>
        )
    },
    {
        id: 'brand-slogan-finish-on-top',
        clusterId: 'leadership-culture',
        clusterTitle: 'Leadership & Community',
        question: "What is RHIVE's brand slogan and promise?",
        quickAnswer: "Our slogan is 'Finish On Top'. It embodies our commitment to pushing industry boundaries, raising standards of transparency, and delivering exceptional craftsmanship. Whether it is our itemized cost breakdowns, our 100% full tear-off policy, or our lifetime no-leak warranty, every project we execute is designed to ensure our clients and communities finish on top.",
        plainAnswerText: "Our slogan is 'Finish On Top'. It embodies our commitment to pushing industry boundaries, raising standards of transparency, and delivering exceptional craftsmanship. Whether it is our itemized cost breakdowns, our 100% full tear-off policy, or our lifetime no-leak warranty, every project we execute is designed to ensure our clients and communities finish on top.",
        relatedLink: {
            label: "Explore How to Choose a Reputable Contractor",
            href: "/blog/how-to-choose-reputable-roofing-contractor-utah"
        },
        fullAnswer: (
            <div className="space-y-3.5 max-w-[70ch]">
                <p>
                    <strong className="text-white">Finish On Top</strong> is more than a slogan—it is our engineering standard. From the moment our drones map your roof geometry to our final magnetic nail sweep and 50-year warranty registration, we ensure you receive unmatched structural protection, fair itemized math, and total peace of mind.
                </p>
            </div>
        )
    },

    // --- Cluster 11: Emergency Leak First Aid, Emergency Response & Storm Checks ---
    {
        id: 'emergency-leak-first-aid',
        clusterId: 'emergency-first-aid',
        clusterTitle: 'Emergency First Aid & Storms',
        question: "What is the immediate 'first aid' or home remedy for an active roof leak if I can't reach a roofer right away?",
        quickAnswer: "Place a bucket under the leak, carefully poke a single pinhole in the center of any sagging ceiling drywall to release trapped water into the bucket, move furniture away, and take photos. Then contact RHIVE Emergency Services at 435-417-6637 for rapid dispatch.",
        plainAnswerText: "If water is actively leaking into your living space, take these four immediate steps to minimize interior structural damage until emergency crews arrive: 1. Catch and Contain: Place a wide bucket, deep container, or plastic bin directly beneath the leak. Line the bottom with a towel to prevent splashing. 2. Relieve Drywall Water Pressure: If you notice a bulge or water bubble forming in your ceiling drywall, carefully poke a single small pinhole in the center of the bulge with a nail, screwdriver, or pin. This releases trapped water into your bucket, preventing the entire drywall sheet from collapsing under weight. 3. Protect Furniture and Belongings: Move electronics, rugs, and furniture away from the leak area or cover them securely with plastic tarps or trash bags. 4. Document and Contact RHIVE: Take clear photos and videos of the active leak, ceiling moisture, and outdoor weather conditions. Call RHIVE Emergency Services at 435-417-6637 (or 743-887-6637). Hunni (our AI Assistant) will text you a secure link to upload your photos so our rapid-response team can analyze the breach and dispatch with the exact containment materials needed. Safety Warning: Never step onto a wet, icy, or storm-damaged roof deck yourself. Shingles become extremely slick when wet, and walking on damaged decking poses severe fall hazards and can cause further mechanical shingle damage that voids warranty coverage.",
        relatedLink: {
            label: "Call RHIVE Emergency Services (435) 417-6637",
            href: "tel:4354176637"
        },
        fullAnswer: (
            <div className="space-y-3.5 max-w-[70ch]">
                <p>
                    If water is actively leaking into your living space, take these four immediate steps to minimize interior structural damage until emergency crews arrive:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 my-2">
                    <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-1.5">
                        <div className="text-cyan-400 font-mono font-bold text-xs uppercase">1. Catch &amp; Contain</div>
                        <p className="text-xs md:text-sm text-gray-300 leading-relaxed font-sans">Place a wide bucket, deep container, or plastic bin directly beneath the leak. Line the bottom with a towel to prevent splashing.</p>
                    </div>
                    <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-1.5">
                        <div className="text-rhive-pink font-mono font-bold text-xs uppercase">2. Relieve Drywall Pressure</div>
                        <p className="text-xs md:text-sm text-gray-300 leading-relaxed font-sans">Carefully poke a single small pinhole in the center of any ceiling bulge to release trapped water into your bucket and prevent the drywall sheet from collapsing.</p>
                    </div>
                    <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-1.5">
                        <div className="text-rhive-gold font-mono font-bold text-xs uppercase">3. Protect Belongings</div>
                        <p className="text-xs md:text-sm text-gray-300 leading-relaxed font-sans">Move electronics, rugs, and furniture away from the leak area or cover them securely with plastic tarps or heavy trash bags.</p>
                    </div>
                    <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-1.5">
                        <div className="text-emerald-400 font-mono font-bold text-xs uppercase">4. Document &amp; Contact RHIVE</div>
                        <p className="text-xs md:text-sm text-gray-300 leading-relaxed font-sans">Take photos and call 435-417-6637. Hunni (AI Assistant) will text a secure link to upload photos for dispatch analysis.</p>
                    </div>
                </div>
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 space-y-1">
                    <div className="text-amber-400 font-bold text-xs uppercase flex items-center gap-1.5 font-mono">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Safety Warning</span>
                    </div>
                    <p className="text-xs md:text-sm text-gray-300 leading-relaxed font-sans">
                        Never step onto a wet, icy, or storm-damaged roof deck yourself. Wet shingles are extremely slick, and walking on compromised decking creates severe fall hazards and mechanical damage that can void warranty coverage.
                    </p>
                </div>
            </div>
        )
    },
    {
        id: 'emergency-response-turnaround',
        clusterId: 'emergency-first-aid',
        clusterTitle: 'Emergency First Aid & Storms',
        question: "How fast can RHIVE Construction respond to emergency roof leaks and storm damage?",
        quickAnswer: "RHIVE provides rapid-response emergency leak containment and $350 credited tarping dispatch across Salt Lake City and the Wasatch Front using our Quantum Rapid-Response Protocol for pitched shingle roofs and flat commercial membranes.",
        plainAnswerText: "RHIVE Construction provides rapid-response emergency leak containment across Salt Lake City, Sandy, Draper, South Jordan, West Jordan, and surrounding Wasatch Front communities. Under our Quantum Rapid-Response Protocol, our dispatch team evaluates emergency photo submissions and dispatches crews to execute immediate physical containment: Pitched Roof Tarping (we deploy high-performance, UV-resistant synthetic underlayment secured with plastic cap nails over damaged shingle fields up to 30 sq ft to channel runoff safely into gutters), Commercial Flat Membrane Containment (for TPO or PVC flat roofs, we perform surgical containment using fusion heat-welded patches, spray-adhered membrane borders, or UV-stable liquid sealants to stop active water intrusion at the point of failure), and a Credited Dispatch Fee (emergency tarping dispatch carries a flat $350 fee, and 100% of this $350 fee is credited directly toward your permanent roof repair or full replacement when you move forward with RHIVE Construction, or billed directly to your insurance claim).",
        relatedLink: {
            label: "Explore Emergency Dispatch & Tarping Rates",
            href: "/estimate-tool"
        },
        fullAnswer: (
            <div className="space-y-3.5 max-w-[70ch]">
                <p>
                    RHIVE Construction provides rapid-response emergency leak containment across Salt Lake City, Sandy, Draper, South Jordan, West Jordan, and surrounding Wasatch Front communities:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 my-2">
                    <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-1.5">
                        <div className="text-cyan-400 font-mono font-bold text-xs uppercase">Pitched Roof Tarping</div>
                        <p className="text-xs md:text-sm text-gray-300 leading-relaxed font-sans">UV-resistant synthetic underlayment fastened with plastic cap nails over damaged fields (up to 30 sq ft) channeling runoff to gutters.</p>
                    </div>
                    <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-1.5">
                        <div className="text-rhive-pink font-mono font-bold text-xs uppercase">Flat Membrane Patches</div>
                        <p className="text-xs md:text-sm text-gray-300 leading-relaxed font-sans">Surgical containment on TPO/PVC using fusion heat-welds, spray-adhered borders, or liquid sealants at point of failure.</p>
                    </div>
                    <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-1.5">
                        <div className="text-emerald-400 font-mono font-bold text-xs uppercase">100% Credited Fee</div>
                        <p className="text-xs md:text-sm text-gray-300 leading-relaxed font-sans">Flat $350 dispatch fee is 100% credited toward your permanent repair/replacement or billed directly to insurance.</p>
                    </div>
                </div>
            </div>
        )
    },
    {
        id: 'hidden-leak-early-warning-signs',
        clusterId: 'emergency-first-aid',
        clusterTitle: 'Emergency First Aid & Storms',
        question: "What are the early warning signs that my roof has a hidden leak?",
        quickAnswer: "Early warning signs include ceiling water stains, musty attic odors, damp insulation, dark wood rot on rafters, missing or curling shingles, damaged pipe boot flashings, and heavy granule loss pooling in gutters.",
        plainAnswerText: "Roof leaks often start small and remain hidden inside your attic framing long before water ever drips through your ceiling. Watch for these indoor, outdoor, and attic indicators: Indoor Indicators (brown or yellowish water stains on ceilings or along top-floor walls, peeling paint or wallpaper near ceiling joints, or damp spots near chimney flues and skylights), Attic Indicators (musty odors, damp insulation, dark wood rot or water staining on rafters and OSB decking sheets, or visible daylight shining through penetration points), and Exterior & Roofline Indicators (missing, cracked, or curling asphalt shingles; dark streaks caused by moisture-retaining algae; damaged or cracked rubber boot seals around pipe jacks; or excessive shingle granules accumulating in your gutter troughs and downspout exits).",
        relatedLink: {
            label: "Schedule a Complete Roof Health Audit",
            href: "/estimate-tool"
        },
        fullAnswer: (
            <div className="space-y-3.5 max-w-[70ch]">
                <p>
                    Roof leaks often start small and remain hidden inside attic framing long before water visibly drips through your drywall:
                </p>
                <div className="space-y-2.5">
                    <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
                        <strong className="text-rhive-pink block text-xs font-mono uppercase mb-1">Indoor Indicators</strong>
                        <p className="text-xs md:text-sm text-gray-300 leading-relaxed font-sans">Brown or yellowish water stains on ceilings or along top-floor walls, peeling paint or wallpaper near ceiling joints, or damp spots near chimney flues and skylights.</p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
                        <strong className="text-cyan-400 block text-xs font-mono uppercase mb-1">Attic &amp; Framing Indicators</strong>
                        <p className="text-xs md:text-sm text-gray-300 leading-relaxed font-sans">Musty odors, damp insulation, dark wood rot or water staining on rafters and OSB decking sheets, or visible daylight shining through penetration points.</p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
                        <strong className="text-rhive-gold block text-xs font-mono uppercase mb-1">Exterior &amp; Roofline Indicators</strong>
                        <p className="text-xs md:text-sm text-gray-300 leading-relaxed font-sans">Missing, cracked, or curling asphalt shingles; dark algae streaks; cracked rubber pipe jack boots; or heavy granule accumulation in gutter troughs.</p>
                    </div>
                </div>
            </div>
        )
    },
    {
        id: 'hail-wind-storm-damage-inspection',
        clusterId: 'emergency-first-aid',
        clusterTitle: 'Emergency First Aid & Storms',
        question: "How do I check if my roof has been damaged after a hail or wind storm?",
        quickAnswer: "Perform a safe ground inspection looking for dents on soft metals (gutters, downspouts, chimney pans), piles of shingle granules in downspouts, and missing or creased shingles. RHIVE offers free storm inspections to document damage before you file an insurance claim.",
        plainAnswerText: "After a severe weather event, you can perform a safe ground-based inspection using binoculars or a camera zoom lens: Check Soft Metals and Accessories First (inspect your gutters, downspouts, window metal flashing, and chimney chase pans; dents or impact pings on soft metal accessories indicate that your roof shingles took similar high-velocity hail hits), Inspect Downspout Drainage (look at the bottom of your downspouts for heavy piles of dark shingle granules; severe hail impact dislodges protective granules, exposing the raw asphalt tar beneath), Look for Wind Uplift and Creases (scan for shingles that are flapping, completely missing, or showing dark horizontal thermal creases across their top edges where the sealant bond broke), and Schedule an RHIVE Storm Inspection (hail bruising on asphalt shingles is often invisible from the ground; roofs between 12 and 24 years old are prime candidates for storm-related insurance claims. Before filing a claim—which could add an unnecessary strike to your policy if denied—book a free RHIVE Storm Inspection where our project managers capture drone imagery, mark hail bruises on-site, and meet your insurance adjuster in person to verify all code-required items).",
        relatedLink: {
            label: "Book Free RHIVE Storm Damage Inspection",
            href: "/blog/roof-damage-insurance-claims-utah"
        },
        fullAnswer: (
            <div className="space-y-3.5 max-w-[70ch]">
                <p>
                    After a severe weather event, you can perform a safe ground-based inspection using binoculars or a camera zoom lens:
                </p>
                <ol className="space-y-2.5 list-decimal list-inside text-gray-200 pl-1">
                    <li><strong className="text-white">Check Soft Metals &amp; Flashing First:</strong> Inspect gutters, downspouts, window head flashing, and chimney chase pans. Dents or impact pings on soft metal accessories verify that your shingles took similar high-velocity hail hits.</li>
                    <li><strong className="text-white">Inspect Downspout Drainage:</strong> Check downspout discharge zones for heavy accumulations of dark mineral granules dislodged by hail impacts.</li>
                    <li><strong className="text-white">Scan for Wind Uplift &amp; Creases:</strong> Look for flapping, torn, or missing shingles, and dark horizontal thermal creases across shingle heads where wind broke the sealant bond.</li>
                    <li><strong className="text-white">Book Free RHIVE Inspection Before Claiming:</strong> Roofs 12–24 years old are prime candidates for storm claims. Book an RHIVE inspection first—we document hail bruises via drone and meet your insurance adjuster on-site with zero pressure.</li>
                </ol>
            </div>
        )
    }
];

export default function FaqHubPage() {
    const [selectedCluster, setSelectedCluster] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [openItemIds, setOpenItemIds] = useState<Set<string>>(new Set(['emergency-leak-first-aid', 'cost-in-utah', 'emergency-active-leak']));

    useEffect(() => {
        document.title = "Master AEO Roofing FAQ Hub | RHIVE Construction Utah";
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
            metaDesc = document.createElement('meta');
            metaDesc.setAttribute('name', 'description');
            document.head.appendChild(metaDesc);
        }
        metaDesc.setAttribute('content', "Utah's Master AEO Roofing FAQ: Instant, verified answers across 11 clusters—emergency leak first aid, rapid dispatch, hail & storm checks, 2026 replacement costs, RPSP discounts, Solar D&R, Owens Corning Duration shingles, TPO/PVC flat roofs, wood rot rates, and female-led leadership.");
    }, []);

    // Filter FAQs based on search and selected cluster
    const filteredFaqs = useMemo(() => {
        return FAQ_MASTER_DATA.filter(item => {
            const matchesCluster = selectedCluster === 'all' || item.clusterId === selectedCluster;
            const query = searchQuery.toLowerCase().trim();
            if (!query) return matchesCluster;
            
            const matchesSearch = 
                item.question.toLowerCase().includes(query) ||
                item.quickAnswer.toLowerCase().includes(query) ||
                item.plainAnswerText.toLowerCase().includes(query) ||
                item.clusterTitle.toLowerCase().includes(query);

            return matchesCluster && matchesSearch;
        });
    }, [selectedCluster, searchQuery]);

    const toggleAccordion = (id: string) => {
        setOpenItemIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    const expandAll = () => {
        setOpenItemIds(new Set(FAQ_MASTER_DATA.map(f => f.id)));
    };

    const collapseAll = () => {
        setOpenItemIds(new Set());
    };

    // Granular JSON-LD Schema Markup Code with @graph combining RoofingContractor and FAQPage across all 10 clusters
    const jsonLdGraphSchema = useMemo(() => {
        return {
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "RoofingContractor",
                    "@id": "https://www.rhiveconstruction.com/#organization",
                    "name": "RHIVE Construction",
                    "url": "https://www.rhiveconstruction.com/",
                    "logo": "https://i.imgur.com/t0VcSgJ.png",
                    "image": "https://i.imgur.com/t0VcSgJ.png",
                    "telephone": "+1-435-417-6637",
                    "email": "office@rhiveconstruction.com",
                    "priceRange": "$$$",
                    "description": "RHIVE Construction is Utah's premier tech-forward, female-owned roofing company. Backed by a lifetime no-leak guarantee, we provide fully transparent, itemized residential roof replacements and certified commercial flat roofing systems.",
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
                    "openingHoursSpecification": [
                        {
                            "@type": "OpeningHoursSpecification",
                            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                            "opens": "07:00",
                            "closes": "19:00"
                        }
                    ],
                    "areaServed": [
                        {"@type": "AdministrativeArea", "name": "South Jordan"},
                        {"@type": "AdministrativeArea", "name": "Sandy"},
                        {"@type": "AdministrativeArea", "name": "West Jordan"},
                        {"@type": "AdministrativeArea", "name": "Salt Lake City"},
                        {"@type": "AdministrativeArea", "name": "Draper"},
                        {"@type": "AdministrativeArea", "name": "Herriman"},
                        {"@type": "AdministrativeArea", "name": "Riverton"},
                        {"@type": "AdministrativeArea", "name": "Park City"},
                        {"@type": "AdministrativeArea", "name": "Wasatch Front"},
                        {"@type": "AdministrativeArea", "name": "Idaho"}
                    ]
                },
                {
                    "@type": "FAQPage",
                    "@id": "https://www.rhiveconstruction.com/faq/#faqpage",
                    "mainEntity": FAQ_MASTER_DATA.map(item => ({
                        "@type": "Question",
                        "name": item.question,
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": item.plainAnswerText
                        }
                    }))
                }
            ]
        };
    }, []);

    const clusterTabs = [
        { id: 'all', label: 'All Topics', count: FAQ_MASTER_DATA.length, icon: Sparkles },
        { id: 'emergency-first-aid', label: 'Leak First Aid & Storms', count: 4, icon: AlertTriangle },
        { id: 'pricing', label: 'Pricing & RPSP', count: 4, icon: DollarSign },
        { id: 'residential', label: 'Residential Shingles', count: 3, icon: Home },
        { id: 'commercial', label: 'Commercial Flat (TPO/PVC)', count: 3, icon: Building2 },
        { id: 'accessories', label: 'Gutters & Ice Dams', count: 2, icon: Snowflake },
        { id: 'insurance', label: 'Storm Claims & Warranties', count: 2, icon: Shield },
        { id: 'service-areas', label: 'Service Areas & Quotes', count: 2, icon: MapPin },
        { id: 'emergency', label: 'Emergency & Tarping', count: 3, icon: AlertOctagon },
        { id: 'solar', label: 'Solar D&R & Decommission', count: 3, icon: Sun },
        { id: 'decking-standards', label: 'Wood Rot & Valleys', count: 3, icon: Hammer },
        { id: 'leadership-culture', label: 'Leadership & Community', count: 3, icon: Heart },
    ];

    return (
        <div className="min-h-screen bg-black text-white relative overflow-hidden font-sans pb-28">
            {/* Inject Unified Schema Graph into DOM for Answer Engines */}
            <script 
                type="application/ld+json" 
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdGraphSchema) }} 
            />

            {/* Ambient Background Glows */}
            <div className="absolute top-24 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-rhive-pink/10 blur-[160px] rounded-full pointer-events-none" />

            {/* Clean, Spacious Hero Header — clearance for top fixed notch */}
            <section className="relative z-10 pt-28 md:pt-36 pb-8 px-6 max-w-5xl mx-auto text-center">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/10 mb-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-rhive-pink animate-pulse" />
                    <span className="text-xs font-mono uppercase tracking-widest text-gray-300">
                        AEO Knowledge Hub • 2026 Edition
                    </span>
                </div>

                {/* H1: Recommended 28px - 36px scale with optimal line-height */}
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold uppercase tracking-tight text-white mb-3.5 leading-snug">
                    Roofing Intelligence &amp; FAQ Hub
                </h1>

                {/* Body Text: 16px - 18px with 1.6+ line-height and 50-70 char line-length */}
                <p className="text-base sm:text-lg text-gray-300 max-w-[65ch] mx-auto font-serif leading-relaxed mb-8">
                    Direct, data-driven solutions to Utah roofing questions—covering itemized pricing, RPSP savings, emergency tarping, solar integration, and lifetime guarantees.
                </p>

                {/* Accessible Search Bar */}
                <div className="max-w-xl mx-auto relative mb-6">
                    <div className="relative flex items-center">
                        <Search className="absolute left-4 w-4 h-4 text-gray-400 pointer-events-none" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search questions, pricing, ice dams, solar D&R, TPO/PVC..."
                            className="w-full pl-11 pr-10 py-3 rounded-xl bg-white/[0.04] border border-white/15 text-white placeholder-gray-400 text-base focus:outline-none focus:border-rhive-pink/80 focus:bg-white/[0.06] transition-all"
                            aria-label="Search frequently asked questions"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-3.5 text-xs text-gray-400 hover:text-white cursor-pointer px-2 py-1 rounded bg-white/10"
                                aria-label="Clear search input"
                            >
                                Clear
                            </button>
                        )}
                    </div>
                </div>

                {/* Mobile / Tablet Horizontal Scroll Bar for Categories */}
                <div className="lg:hidden flex overflow-x-auto no-scrollbar gap-2 py-2 px-2 -mx-4 justify-start">
                    {clusterTabs.map(tab => {
                        const isActive = selectedCluster === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setSelectedCluster(tab.id)}
                                className={cn(
                                    "shrink-0 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all border cursor-pointer",
                                    isActive 
                                        ? "bg-rhive-pink text-white border-rhive-pink shadow-[0_0_10px_rgba(236,2,139,0.4)]" 
                                        : "bg-white/[0.03] text-gray-300 border-white/10 hover:text-white"
                                )}
                            >
                                {tab.label}
                            </button>
                        );
                    })}
                </div>
            </section>

            {/* Main Content Area: 2-Column Desktop Layout (Sidebar + Questions) */}
            <div className="relative z-10 max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left Desktop Sidebar Navigation */}
                <aside className="hidden lg:block lg:col-span-4 sticky top-20 space-y-2 p-3 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-md">
                    <div className="px-3 py-2 text-xs font-mono font-bold uppercase tracking-widest text-gray-400 border-b border-white/5 mb-1 flex justify-between items-center">
                        <span>Topics</span>
                        <span>{FAQ_MASTER_DATA.length} Answers</span>
                    </div>

                    <nav className="space-y-1" aria-label="FAQ Topic Categories">
                        {clusterTabs.map(tab => {
                            const Icon = tab.icon;
                            const isActive = selectedCluster === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setSelectedCluster(tab.id)}
                                    className={cn(
                                        "w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer text-left",
                                        isActive
                                            ? "bg-rhive-pink text-white shadow-[0_0_12px_rgba(236,2,139,0.35)]"
                                            : "text-gray-300 hover:text-white hover:bg-white/[0.04]"
                                    )}
                                >
                                    <div className="flex items-center gap-2.5 truncate">
                                        <Icon className={cn("w-4 h-4 shrink-0", isActive ? "text-white" : "text-rhive-pink")} />
                                        <span className="truncate">{tab.label}</span>
                                    </div>
                                    <span className={cn(
                                        "text-xs font-mono px-2 py-0.5 rounded-md",
                                        isActive ? "bg-white/20 text-white" : "bg-white/5 text-gray-400"
                                    )}>
                                        {tab.count}
                                    </span>
                                </button>
                            );
                        })}
                    </nav>

                    <div className="pt-3 mt-2 border-t border-white/5 px-2">
                        <div className="p-3.5 rounded-xl bg-rhive-pink/10 border border-rhive-pink/20 space-y-2">
                            <div className="text-sm font-bold text-white">Active Roof Leak?</div>
                            <p className="text-xs text-gray-300 font-serif leading-relaxed">
                                24/7 Emergency Dispatch on standby across Salt Lake &amp; Utah counties.
                            </p>
                            <a
                                href="tel:4354176637"
                                className="inline-flex items-center gap-1.5 text-xs font-bold text-rhive-pink hover:text-white transition-colors"
                            >
                                <Phone className="w-3.5 h-3.5" />
                                <span>(435) 417-6637</span>
                            </a>
                        </div>
                    </div>
                </aside>

                {/* Right Column: Questions & Answers Accordion Stream */}
                <main className="lg:col-span-8 space-y-4">
                    
                    {/* Active Cluster Status Header */}
                    <div className="flex justify-between items-center text-xs sm:text-sm text-gray-400 pb-2 border-b border-white/10">
                        <div>
                            Showing <strong className="text-white font-semibold">{filteredFaqs.length}</strong> {filteredFaqs.length === 1 ? 'question' : 'questions'}
                        </div>
                        <div className="flex gap-3 text-xs font-mono">
                            <button onClick={expandAll} className="hover:text-rhive-pink transition-colors cursor-pointer">
                                Expand All
                            </button>
                            <span className="text-gray-600">/</span>
                            <button onClick={collapseAll} className="hover:text-rhive-pink transition-colors cursor-pointer">
                                Collapse All
                            </button>
                        </div>
                    </div>

                    {filteredFaqs.length === 0 ? (
                        <div className="text-center py-12 p-8 rounded-2xl bg-white/[0.02] border border-white/10">
                            <HelpCircle className="w-10 h-10 text-gray-500 mx-auto mb-3" />
                            <div className="text-base sm:text-lg font-bold text-white mb-1">No matching questions found</div>
                            <p className="text-sm text-gray-300 font-serif mb-5 max-w-sm mx-auto leading-relaxed">
                                Try searching for another keyword or speak directly with our team.
                            </p>
                            <a
                                href="tel:8014491451"
                                className="inline-flex items-center gap-2 bg-rhive-pink text-white font-bold text-xs uppercase tracking-widest px-5 py-2.5 rounded-full shadow-[0_0_12px_rgba(236,2,139,0.4)]"
                            >
                                <Phone className="w-3.5 h-3.5" />
                                Call (801) 449-1451
                            </a>
                        </div>
                    ) : (
                        filteredFaqs.map((faq) => {
                            const isOpen = openItemIds.has(faq.id);
                            return (
                                <div
                                    key={faq.id}
                                    className={cn(
                                        "border rounded-2xl overflow-hidden transition-all duration-200",
                                        isOpen 
                                            ? "bg-white/[0.03] border-rhive-pink/60 shadow-[0_0_15px_rgba(236,2,139,0.15)]" 
                                            : "bg-white/[0.015] border-white/10 hover:border-white/20"
                                    )}
                                >
                                    <button
                                        onClick={() => toggleAccordion(faq.id)}
                                        className="w-full text-left p-5 md:p-6 flex justify-between items-start gap-4 hover:bg-white/[0.01] transition-colors cursor-pointer"
                                        aria-expanded={isOpen}
                                    >
                                        <div className="space-y-1.5">
                                            <div className="text-xs font-mono font-semibold uppercase tracking-wider text-rhive-pink">
                                                {faq.clusterTitle}
                                            </div>
                                            {/* Subheading (H2/H3 level scale): 18px to 20px */}
                                            <div className="text-base sm:text-lg font-bold text-white tracking-tight leading-snug">
                                                {faq.question}
                                            </div>
                                        </div>
                                        <div className={cn(
                                            "w-7 h-7 rounded-full flex items-center justify-center shrink-0 border transition-transform duration-200 mt-1",
                                            isOpen ? "border-rhive-pink bg-rhive-pink/20 text-rhive-pink rotate-180" : "border-white/10 bg-white/5 text-gray-400"
                                        )}>
                                            <ChevronDown className="w-4 h-4" />
                                        </div>
                                    </button>

                                    {isOpen && (
                                        <div className="px-5 md:px-6 pb-6 pt-1 border-t border-white/5 space-y-4 animate-fade-in">
                                            {/* Direct AI Answer Summary: 16px font, 1.6 line height */}
                                            <div className="p-4 rounded-xl bg-rhive-pink/10 border border-rhive-pink/25">
                                                <div className="flex items-center gap-1.5 mb-1.5 text-rhive-pink">
                                                    <Zap className="w-4 h-4 shrink-0" />
                                                    <span className="text-xs font-mono font-bold uppercase tracking-wider">
                                                        Direct Answer Summary
                                                    </span>
                                                </div>
                                                <p className="text-sm sm:text-base font-medium text-white leading-relaxed font-sans">
                                                    {faq.quickAnswer}
                                                </p>
                                            </div>

                                            {/* Full Technical Details: 16px font, 1.625 line height, 50-70ch line length */}
                                            <div className="text-sm sm:text-base text-gray-200 font-serif leading-relaxed space-y-3">
                                                {faq.fullAnswer}
                                            </div>

                                            {/* Contextual Links */}
                                            {faq.relatedLink && (
                                                <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                                                    <a
                                                        href={faq.relatedLink.href}
                                                        className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-mono font-bold uppercase tracking-wider text-rhive-pink hover:text-white transition-colors"
                                                    >
                                                        <span>{faq.relatedLink.label}</span>
                                                        <ArrowRight className="w-3.5 h-3.5" />
                                                    </a>
                                                    <span className="text-xs font-mono text-gray-400 uppercase">
                                                        Verified Resource
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}

                    {/* Bottom Inline CTA Card */}
                    <div className="p-6 rounded-2xl bg-gradient-to-r from-white/[0.04] via-white/[0.02] to-transparent border border-white/10 mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="space-y-1">
                            <div className="text-xs font-mono uppercase font-bold text-rhive-pink">Still Have Questions?</div>
                            <div className="text-base sm:text-lg font-bold text-white">Get a Free Remote Aerial Estimate</div>
                            <p className="text-xs sm:text-sm text-gray-300 font-serif leading-relaxed">Instant satellite measurements and fixed 14-day guaranteed pricing.</p>
                        </div>
                        <a
                            href="/estimate-tool"
                            className="shrink-0 bg-rhive-pink hover:bg-[#d4007b] text-white font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-full shadow-[0_0_15px_rgba(236,2,139,0.4)] transition-all hover:scale-105"
                        >
                            Start Estimate
                        </a>
                    </div>
                </main>
            </div>
        </div>
    );
}
