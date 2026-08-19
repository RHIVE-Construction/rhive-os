import React, { useEffect } from 'react';
import { Phone, Shield, ArrowRight, CheckCircle2, Zap } from 'lucide-react';
import { cn } from '../lib/utils';

export default function ResidentialReplacementServicePage() {
    useEffect(() => {
        document.title = "Residential Roof Replacement Utah | RHIVE Construction";
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
            metaDesc = document.createElement('meta');
            metaDesc.setAttribute('name', 'description');
            document.head.appendChild(metaDesc);
        }
        metaDesc.setAttribute('content', "Experience Utah's most transparent residential roof replacement. Lifetime No-Leak Guarantees, transparent itemized cost breakdowns, and certified installs.");
    }, []);

    const handleEstimateClick = () => {
        window.location.href = '/estimate-tool';
    };

    return (
        <div className="min-h-screen bg-black text-white relative overflow-hidden font-sans">
            {/* Dark gradient blur effects */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-rhive-pink/10 blur-[120px] rounded-full pointer-events-none" />

            {/* Hero Section */}
            <section className="relative z-10 pt-20 pb-20 px-6 max-w-5xl mx-auto text-center">
                <div className="inline-block border border-rhive-pink/30 px-6 py-2 rounded-full bg-rhive-pink/10 mb-6 shadow-[0_0_20px_rgba(236,2,139,0.3)]">
                    <span className="text-rhive-pink font-bold text-sm tracking-[0.3em] uppercase">Residential Systems</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-6">
                    Crafting Lifetime Protection:<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-rhive-pink">
                        Residential Roof Replacement in Utah
                    </span>
                </h1>
                <div className="text-xl md:text-2xl font-serif italic text-rhive-pink mb-8">
                    Zero Surprises. 100% Transparency. Backed by a Lifetime No-Leak Guarantee.
                </div>
                <p className="text-lg text-gray-300 max-w-[75ch] mx-auto mb-10 leading-relaxed font-serif">
                    A roof is your home’s primary line of defense. At RHIVE Construction, we do not believe in standard "mystery bids" or cutting corners with mismatched, cheap materials that void manufacturer warranties. We provide an interactive, fully itemized cost breakdown of your project—separating material, labor, overhead, and our profit margins so you know exactly where your investment goes. Every replacement is handled by our factory-certified crews and secured with our industry-leading Lifetime No-Leak Workmanship Guarantee.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-6">
                    <button
                        onClick={handleEstimateClick}
                        className="bg-rhive-pink text-white font-bold text-base uppercase tracking-widest px-8 py-4 rounded-full shadow-[0_0_15px_rgba(236,2,139,0.4)] hover:shadow-[0_0_25px_rgba(236,2,139,0.7)] transition-all duration-300 hover:scale-105"
                    >
                        Configure Your Estimate
                    </button>
                    <a
                        href="tel:4534176637"
                        className="flex items-center gap-2 border border-white/20 hover:border-rhive-pink/50 text-white font-bold text-base uppercase tracking-widest px-8 py-4 rounded-full bg-white/5 transition-all duration-300 hover:scale-105"
                    >
                        <Phone size={16} className="text-rhive-pink" />
                        Call 453-41-ROOFS
                    </a>
                </div>
            </section>

            {/* Section 1: The RHIVE Core Commitment */}
            <section className="relative z-10 py-16 px-6 max-w-5xl mx-auto border-t border-white/10">
                <div className="text-center mb-12">
                    <div className="text-3xl font-black uppercase tracking-tight text-white">
                        The RHIVE Core Commitment
                    </div>
                    <div className="w-16 h-1 bg-rhive-pink mx-auto mt-4" />
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-6 bg-white/5 border border-white/10 rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.3)] flex gap-4">
                        <Shield className="w-8 h-8 text-rhive-pink shrink-0" />
                        <div>
                            <div className="text-lg font-bold text-white mb-2">Comprehensive Insurance Protection</div>
                            <p className="text-gray-400 text-base leading-relaxed font-serif">
                                We maintain a $2M General Aggregate and $1M Personal & ADV Injury policy to fully protect your property during all project phases.
                            </p>
                        </div>
                    </div>
                    <div className="p-6 bg-white/5 border border-white/10 rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.3)] flex gap-4">
                        <CheckCircle2 className="w-8 h-8 text-rhive-pink shrink-0" />
                        <div>
                            <div className="text-lg font-bold text-white mb-2">Certified & Insured Workers</div>
                            <p className="text-gray-400 text-base leading-relaxed font-serif">
                                All work is performed by certified RHIVE workers covered by full workers' compensation. Crew safety is non-negotiable.
                            </p>
                        </div>
                    </div>
                    <div className="p-6 bg-white/5 border border-white/10 rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.3)] flex gap-4">
                        <Zap className="w-8 h-8 text-rhive-pink shrink-0" />
                        <div>
                            <div className="text-lg font-bold text-white mb-2">Full Building Permit Management</div>
                            <p className="text-gray-400 text-base leading-relaxed font-serif">
                                We handle all municipal permitting from start to finish to ensure your roof is fully compliant with local Utah building codes, safeguarding your future home resale value.
                            </p>
                        </div>
                    </div>
                    <div className="p-6 bg-white/5 border border-white/10 rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.3)] flex gap-4">
                        <Shield className="w-8 h-8 text-rhive-pink shrink-0" />
                        <div>
                            <div className="text-lg font-bold text-white mb-2">Dedicated Site Project Manager</div>
                            <p className="text-gray-400 text-base leading-relaxed font-serif">
                                A dedicated, on-site Project Manager oversees all site logistics, performs certified quality inspections, runs comprehensive magnetic cleanup sweeps, and activates your final warranties.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 2: Premium Residential Roofing Packages */}
            <section className="relative z-10 py-16 px-6 max-w-5xl mx-auto border-t border-white/10">
                <div className="text-center mb-16">
                    <div className="text-3xl font-black uppercase tracking-tight text-white">
                        Premium Residential Roofing Packages
                    </div>
                    <p className="text-gray-400 font-serif italic mt-2">
                        Choose the perfect manufacturer-certified system for your architectural style and climate needs
                    </p>
                    <div className="w-16 h-1 bg-rhive-pink mx-auto mt-4" />
                </div>
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Package 1 */}
                    <div className="flex flex-col bg-white/5 border border-white/10 hover:border-rhive-pink/50 transition-all duration-300 rounded-2xl overflow-hidden group shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                        <div className="p-8 border-b border-white/10 relative">
                            <div className="text-xs font-bold text-rhive-pink uppercase tracking-widest mb-2">Performance Package</div>
                            <div className="text-xl font-bold text-white">The O.C. Duration Series</div>
                        </div>
                        <div className="p-8 flex-grow flex flex-col justify-between">
                            <div className="space-y-6">
                                <div>
                                    <div className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Best For:</div>
                                    <p className="text-base text-gray-300 font-serif">Commercial-grade durability and outstanding modern styling for standard residential homes.</p>
                                </div>
                                <div>
                                    <div className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-2">Key System Features:</div>
                                    <ul className="space-y-2 text-base text-gray-400 font-serif">
                                        <li className="flex items-start gap-2">
                                            <span className="text-rhive-pink shrink-0">•</span>
                                            <span>Owens Corning Duration Shingles (SureNail® Tech, 130 MPH Wind, 25-Yr Algae Resistance)</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-rhive-pink shrink-0">•</span>
                                            <span>WeatherLock® water barrier (minimum 6ft double-layer coverage)</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-rhive-pink shrink-0">•</span>
                                            <span>ProArmor® synthetic underlayment</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-rhive-pink shrink-0">•</span>
                                            <span>Ring-shank wind-resistant nails</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="mt-8 border-t border-white/5 pt-6">
                                <div className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">System Warranty:</div>
                                <p className="text-sm text-rhive-pink font-bold">50-Yr OC Preferred Protection + RHIVE Lifetime Workmanship Guarantee</p>
                            </div>
                        </div>
                    </div>

                    {/* Package 2 */}
                    <div className="flex flex-col bg-white/5 border border-white/10 hover:border-rhive-pink/50 transition-all duration-300 rounded-2xl overflow-hidden group shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                        <div className="p-8 border-b border-white/10 relative">
                            <div className="text-xs font-bold text-rhive-pink uppercase tracking-widest mb-2">Storm Shield Package</div>
                            <div className="text-xl font-bold text-white">The O.C. Duration FLEX®</div>
                        </div>
                        <div className="w-full h-48 overflow-hidden relative border-b border-white/5">
                            <img 
                                src="/images/owens-corning-duration-flex-class-4-impact-shingles.webp"
                                alt="Close-up detail of weather-resistant Owens Corning Duration FLEX Class 4 impact shingles engineered for heavy Utah storm damage."
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                width={400}
                                height={192}
                                decoding="async"
                                loading="lazy"
                            />
                        </div>
                        <div className="p-8 flex-grow flex flex-col justify-between">
                            <div className="space-y-6">
                                <div>
                                    <div className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Best For:</div>
                                    <p className="text-base text-gray-300 font-serif">Extreme weather resilience, hail resistance, and long-term insurance premium discounts.</p>
                                </div>
                                <div>
                                    <div className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-2">Key System Features:</div>
                                    <ul className="space-y-2 text-base text-gray-400 font-serif">
                                        <li className="flex items-start gap-2">
                                            <span className="text-rhive-pink shrink-0">•</span>
                                            <span>Duration FLEX® Polymer-Modified Shingles (Class 4 Impact/Hail Rating)</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-rhive-pink shrink-0">•</span>
                                            <span>DuraRidge® Hip & Ridge Shingles matching modified asphalt blend</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-rhive-pink shrink-0">•</span>
                                            <span>Advanced temperature-shift flexibility to resist cracking</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="mt-8 border-t border-white/5 pt-6">
                                <div className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">System Warranty:</div>
                                <p className="text-sm text-rhive-pink font-bold">50-Yr Material & Labor, 10-Yr Manufacturer Workmanship + RHIVE Lifetime Guarantee</p>
                            </div>
                        </div>
                    </div>

                    {/* Package 3 */}
                    <div className="flex flex-col bg-white/5 border border-white/10 hover:border-rhive-pink/50 transition-all duration-300 rounded-2xl overflow-hidden group shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                        <div className="p-8 border-b border-white/10 relative">
                            <div className="text-xs font-bold text-rhive-pink uppercase tracking-widest mb-2">Designer Architectural Package</div>
                            <div className="text-xl font-bold text-white">GAF Woodland®</div>
                        </div>
                        <div className="p-8 flex-grow flex flex-col justify-between">
                            <div className="space-y-6">
                                <div>
                                    <div className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Best For:</div>
                                    <p className="text-base text-gray-300 font-serif">Unmatched curb appeal and a stunning, dimensional, heavy-duty wood-shake aesthetic.</p>
                                </div>
                                <div>
                                    <div className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-2">Key System Features:</div>
                                    <ul className="space-y-2 text-base text-gray-400 font-serif">
                                        <li className="flex items-start gap-2">
                                            <span className="text-rhive-pink shrink-0">•</span>
                                            <span>GAF Woodland® Shingles (StainGuard® Algae Protection)</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-rhive-pink shrink-0">•</span>
                                            <span>Tiger Paw™ Premium synthetic underlayment</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-rhive-pink shrink-0">•</span>
                                            <span>WeatherWatch® or StormGuard® leak barriers in valleys and eaves</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-rhive-pink shrink-0">•</span>
                                            <span>Pro-Start® Starter Strips & GAF Cobra® ventilation system</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="mt-8 border-t border-white/5 pt-6">
                                <div className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">System Warranty:</div>
                                <p className="text-sm text-rhive-pink font-bold">GAF System Plus Limited Warranty (50-Yr Material, 10-Yr Workmanship) + RHIVE Lifetime Guarantee</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
