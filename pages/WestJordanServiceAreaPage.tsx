import React, { useEffect } from 'react';
import { Phone, Shield, ArrowRight, CheckCircle2, Zap } from 'lucide-react';

export default function WestJordanServiceAreaPage() {
    useEffect(() => {
        document.title = "Top-Rated Roofing Contractor in West Jordan UT | RHIVE Construction";
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
            metaDesc = document.createElement('meta');
            metaDesc.setAttribute('name', 'description');
            document.head.appendChild(metaDesc);
        }
        metaDesc.setAttribute('content', "Expert residential & commercial roofing in West Jordan, UT. Backed by a lifetime guarantee, wind-resistant systems, and transparent pricing.");
    }, []);

    const handleEstimateClick = () => {
        window.location.href = '/estimate-tool';
    };

    return (
        <div className="min-h-screen bg-black text-white relative overflow-hidden font-sans">
            {/* Dark gradient blur effects */}
            <div className="absolute top-1/4 left-1/3 -translate-x-1/2 w-[500px] h-[500px] bg-rhive-pink/10 blur-[120px] rounded-full pointer-events-none" />

            {/* Hero Section */}
            <section className="relative z-10 pt-20 pb-20 px-6 max-w-5xl mx-auto text-center">
                <div className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-3 block">
                    LOCAL ROOFING SPECIALISTS | WEST JORDAN, UTAH
                </div>
                <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-6">
                    Premium Roofing Contractor<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-rhive-pink">
                        in West Jordan, UT
                    </span>
                </h1>
                <div className="text-xl md:text-2xl font-serif italic text-rhive-pink mb-8">
                    Engineered for Valley Wind Sheers. Backed by a Lifetime No-Leak Guarantee.
                </div>
                <p className="text-lg text-gray-300 max-w-[75ch] mx-auto mb-10 leading-relaxed font-serif">
                    Located on the Salt Lake Valley plain closer to the Oquirrh Mountains, West Jordan properties face high wind sheers and severe weather gusts. Standard roofs fail when wind lifts mismatched shingles. At RHIVE Construction, we build wind-resilient systems designed specifically for West Jordan's open landscape. As Utah's premier tech-forward, female-owned roofing contractor, we bring elite craftsmanship, absolute price transparency, and lifetime security to your doorstep.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-6">
                    <button
                        onClick={handleEstimateClick}
                        className="bg-rhive-pink text-white font-bold text-base uppercase tracking-widest px-8 py-4 rounded-full shadow-[0_0_15px_rgba(236,2,139,0.4)] hover:shadow-[0_0_25px_rgba(236,2,139,0.7)] transition-all duration-300 hover:scale-105"
                    >
                        Configure Your West Jordan Estimate
                    </button>
                    <a
                        href="tel:4354176637"
                        className="flex items-center gap-2 border border-white/20 hover:border-rhive-pink/50 text-white font-bold text-base uppercase tracking-widest px-8 py-4 rounded-full bg-white/5 transition-all duration-300 hover:scale-105"
                    >
                        <Phone size={16} className="text-rhive-pink" />
                        Call 435-41-ROOFS
                    </a>
                </div>
            </section>

            {/* Section 1: Solving West Jordan's Toughest Roofing Challenges */}
            <section className="relative z-10 py-16 px-6 max-w-5xl mx-auto border-t border-white/10">
                <div className="text-center mb-12">
                    <div className="text-3xl font-black uppercase tracking-tight text-white">
                        Solving West Jordan's Toughest Roofing Challenges
                    </div>
                    <div className="w-16 h-1 bg-rhive-pink mx-auto mt-4" />
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
                        <div className="text-lg font-bold text-white mb-3">SureNail® 130 MPH Wind Rating</div>
                        <p className="text-gray-400 text-base font-serif leading-relaxed">
                            West Jordan's open landscape is highly exposed to wind shears. We install Owens Corning Duration shingles featuring SureNail® Technology which includes a triple layer of reinforcement in the nailing zone, delivering a certified 130 MPH Wind Rating and preventing blow-offs.
                        </p>
                    </div>
                    <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
                        <div className="text-lg font-bold text-white mb-3">West Jordan Building Code Compliance</div>
                        <p className="text-gray-400 text-base font-serif leading-relaxed">
                            We manage the entire municipal permitting process with the West Jordan Community Development Department from start to finish. We guarantee that your project complies fully with West Jordan's local wind and load requirements, protecting your home's equity and future resale value.
                        </p>
                    </div>
                    <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
                        <div className="text-lg font-bold text-white mb-3">Comprehensive Project Protection</div>
                        <p className="text-gray-400 text-base font-serif leading-relaxed">
                            Our active $2M General Aggregate insurance protection and full workers' compensation coverage mean your West Jordan property is 100% secured throughout the entire teardown and installation process.
                        </p>
                    </div>
                </div>
            </section>

            {/* Section 2: Our Local Services in West Jordan, UT */}
            <section className="relative z-10 py-16 px-6 max-w-5xl mx-auto border-t border-white/10">
                <div className="text-center mb-12">
                    <div className="text-3xl font-black uppercase tracking-tight text-white">
                        Our Local Services in West Jordan, UT
                    </div>
                    <div className="w-16 h-1 bg-rhive-pink mx-auto mt-4" />
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
                        <div className="text-lg font-bold text-white mb-2">Residential Shingle Replacements</div>
                        <p className="text-gray-400 text-base font-serif leading-relaxed">
                            Featuring Owens Corning Duration® and heavy-duty Class 4 GAF Woodland® shingles. We provide complete itemized cost breakdowns (materials, labor, overhead, and profit) so you see exactly where every dollar goes.
                        </p>
                    </div>
                    <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
                        <div className="text-lg font-bold text-white mb-2">Commercial Flat Roofing</div>
                        <p className="text-gray-400 text-base font-serif leading-relaxed">
                            Advanced GAF TPO and PVC single-ply membrane systems for flat and low-slope business roofs. Installed with precision and backed by premier manufacturer NDL (No Dollar Limit) warranties.
                        </p>
                    </div>
                    <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
                        <div className="text-lg font-bold text-white mb-2">Professional Inspections &amp; Maintenance</div>
                        <p className="text-gray-400 text-base font-serif leading-relaxed">
                            Biennial certified roof inspections to actively maintain your warranties and identify underlying issues before they turn into costly active leaks.
                        </p>
                    </div>
                </div>
            </section>

            {/* Section 3: Neighboring Wasatch Front Communities We Serve */}
            <section className="relative z-10 py-16 px-6 max-w-5xl mx-auto border-t border-white/10">
                <div className="text-center mb-12">
                    <div className="text-3xl font-black uppercase tracking-tight text-white">
                        Neighboring Wasatch Front Communities We Serve
                    </div>
                    <div className="w-16 h-1 bg-rhive-pink mx-auto mt-4" />
                </div>
                <div className="grid md:grid-cols-3 gap-8 text-sm">
                    <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
                        <div className="font-bold text-white uppercase mb-3 text-xs tracking-wider text-rhive-pink">East Bench Corridor</div>
                        <ul className="space-y-2 text-gray-400 font-serif">
                            <li>Sandy</li>
                            <li>Draper</li>
                            <li>Cottonwood</li>
                            <li>Holladay</li>
                            <li>Sugarhouse</li>
                            <li>Park City</li>
                        </ul>
                    </div>
                    <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
                        <div className="font-bold text-white uppercase mb-3 text-xs tracking-wider text-rhive-pink">Central &amp; West Valley Plain</div>
                        <ul className="space-y-2 text-gray-400 font-serif">
                            <li>West Jordan</li>
                            <li>South Jordan</li>
                            <li>Riverton</li>
                            <li>Herriman</li>
                            <li>Murray</li>
                            <li>Midvale</li>
                            <li>Taylorsville</li>
                        </ul>
                    </div>
                    <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
                        <div className="font-bold text-white uppercase mb-3 text-xs tracking-wider text-rhive-pink">Metro SLC &amp; North</div>
                        <ul className="space-y-2 text-gray-400 font-serif">
                            <li>Salt Lake City</li>
                            <li>North Salt Lake</li>
                            <li>Bountiful</li>
                            <li>Clearfield</li>
                            <li>Layton</li>
                        </ul>
                    </div>
                </div>
            </section>
        </div>
    );
}
