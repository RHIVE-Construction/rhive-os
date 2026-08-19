import React, { useEffect } from 'react';
import { Phone, Shield, ArrowRight, CheckCircle2, Zap } from 'lucide-react';

export default function RoofingAccessoriesPage() {
    useEffect(() => {
        document.title = "Roof Gutters, Ventilation, & Skylights Utah | RHIVE";
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
            metaDesc = document.createElement('meta');
            metaDesc.setAttribute('name', 'description');
            document.head.appendChild(metaDesc);
        }
        metaDesc.setAttribute('content', "Seamless rain gutters, self-regulating heat trace, Velux skylight replacement, & balanced attic ventilation in Utah. Complete lifetime workmanship guarantees.");
    }, []);

    const handleEstimateClick = () => {
        window.location.href = '/estimate-tool';
    };

    return (
        <div className="min-h-screen bg-black text-white relative overflow-hidden font-sans">
            {/* Dark gradient blur effects */}
            <div className="absolute top-1/4 left-1/4 -translate-x-1/2 w-[500px] h-[500px] bg-rhive-pink/10 blur-[120px] rounded-full pointer-events-none" />

            {/* Hero Section */}
            <section className="relative z-10 pt-20 pb-20 px-6 max-w-5xl mx-auto text-center">
                <div className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-3 block">
                    WATER &amp; AIR SYSTEMS | WASATCH FRONT PREMIER SERVICES
                </div>
                <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-6">
                    High-Performance Roofing Accessories &amp;<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-rhive-pink">
                        Water Management in Utah
                    </span>
                </h1>
                <div className="text-xl md:text-2xl font-serif italic text-rhive-pink mb-8">
                    Custom Rain Gutters, Self-Regulating Heat Trace, Attic Ventilation, &amp; Velux Skylights.
                </div>
                <p className="text-lg text-gray-300 max-w-[75ch] mx-auto mb-10 leading-relaxed font-serif">
                    A beautiful roof shingle or commercial membrane is only as durable as the systems that surround it. Without seamless gutters to channel storm runoff, balanced ventilation to regulate attic temperatures, and waterproof seal integration around skylights, your home remains vulnerable to structural mold, ice dams, and foundation erosion. RHIVE Construction provides custom-engineered, factory-certified installations for rain gutters, self-regulating heat cables, attic vents, and leak-proof skylights along the Wasatch Front. We protect your home's total envelope while safeguarding your manufacturer product warranties.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-6">
                    <button
                        onClick={handleEstimateClick}
                        className="bg-rhive-pink text-white font-bold text-base uppercase tracking-widest px-8 py-4 rounded-full shadow-[0_0_15px_rgba(236,2,139,0.4)] hover:shadow-[0_0_25px_rgba(236,2,139,0.7)] transition-all duration-300 hover:scale-105"
                    >
                        Configure Your Accessories Estimate
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

            {/* Section 1: Seamless Aluminum Gutter Systems */}
            <section className="relative z-10 py-16 px-6 max-w-5xl mx-auto border-t border-white/10">
                <div className="text-center mb-12">
                    <div className="text-3xl font-black uppercase tracking-tight text-white">
                        Seamless Aluminum Gutter Systems
                    </div>
                    <div className="w-16 h-1 bg-rhive-pink mx-auto mt-4" />
                </div>
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <div className="p-6 bg-white/5 border border-white/10 hover:border-rhive-pink/50 transition-colors duration-300 rounded-xl">
                        <div className="text-lg font-bold text-white mb-2">5” and 6” K-Style Gutters</div>
                        <p className="text-gray-400 text-base font-serif leading-relaxed">
                            Our standard high-capacity residential solution. Extruded from continuous heavy-gauge aluminum, these seamless troughs mimic clean architectural crown molding. We install 5-inch systems for standard roofs and 6-inch systems with high-capacity 3”x4” downspouts for steep, large, or commercial-grade roof structures.
                        </p>
                    </div>
                    <div className="p-6 bg-white/5 border border-white/10 hover:border-rhive-pink/50 transition-colors duration-300 rounded-xl">
                        <div className="text-lg font-bold text-white mb-2">5” and 6” Round-Style Gutters</div>
                        <p className="text-gray-400 text-base font-serif leading-relaxed">
                            Perfect for modern, historic, or European-style homes. The semi-circular profile ensures exceptionally efficient water discharge and a distinct, premium aesthetic. Complete with matching 3-inch or 4-inch round downspouts.
                        </p>
                    </div>
                    <div className="p-6 bg-white/5 border border-white/10 hover:border-rhive-pink/50 transition-colors duration-300 rounded-xl">
                        <div className="text-lg font-bold text-white mb-2">5” and 6” Box/Square-Style Gutters</div>
                        <p className="text-gray-400 text-base font-serif leading-relaxed">
                            A sleek, flat-faced, contemporary design profile engineered to integrate seamlessly into mid-century modern or architectural designs while maximizing drainage capacity.
                        </p>
                    </div>
                </div>
                <div className="my-8 rounded-xl overflow-hidden border border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.3)]">
                    <img 
                        src="/images/seamless-aluminum-rain-gutter-installation-west-jordan-utah.webp"
                        alt="Seamless 6-inch white aluminum rain gutters with heavy-duty hidden screw-in hangers spaced at 24 inches for snow load protection."
                        className="w-full h-[300px] object-cover"
                        width={1000}
                        height={300}
                        decoding="async"
                        loading="lazy"
                    />
                </div>
                <div className="bg-black/60 border border-rhive-pink/50 p-6 rounded-xl shadow-[0_0_20px_rgba(236,2,139,0.1)]">
                    <div className="text-lg font-bold text-white mb-2">The RHIVE Gutter Workmanship Standard</div>
                    <p className="text-gray-400 text-base font-serif leading-relaxed">
                        Standard contractors place hangers every 30 inches, leading to gutter collapse under heavy Utah snow loads. RHIVE installs heavy-duty, hidden screw-in hangers spaced tightly at every 24 inches. Every trough is custom pitched to prevent standing water, and joints are sealed with commercial-grade, UV-stable sealant. Backed by our RHIVE No-Leak Gutter Workmanship Guarantee and a 20-Year Manufacturer finish warranty.
                    </p>
                </div>
            </section>

            {/* Section 2: Proactive Ice Management & Self-Regulating Heat Trace */}
            <section className="relative z-10 py-16 px-6 max-w-5xl mx-auto border-t border-white/10">
                <div className="text-center mb-12">
                    <div className="text-3xl font-black uppercase tracking-tight text-white">
                        Proactive Ice Management &amp; Self-Regulating Heat Trace
                    </div>
                    <div className="w-16 h-1 bg-rhive-pink mx-auto mt-4" />
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
                        <div className="text-lg font-bold text-white mb-2">Self-Regulating Heat Cable Systems</div>
                        <p className="text-gray-400 text-base font-serif leading-relaxed">
                            We install high-efficiency, commercial-grade self-regulating heat cables rated at 5 Watts per linear foot (110V). This advanced technology automatically adjusts its thermal output based on ambient winter temperatures to save electricity.
                        </p>
                    </div>
                    <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
                        <div className="text-lg font-bold text-white mb-2">Integrated Intelligent Thermostat</div>
                        <p className="text-gray-400 text-base font-serif leading-relaxed">
                            The system activates only when precipitation is occurring and temperatures drop into the freezing zone (35°F to 45°F), preventing dry-burning or power wastage.
                        </p>
                    </div>
                    <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
                        <div className="text-lg font-bold text-white mb-2">Secured Installation Blueprint</div>
                        <p className="text-gray-400 text-base font-serif leading-relaxed">
                            Cables are woven in a cascading pattern along eaves and valleys using non-corrosive copper or aluminum clips, carrying water safely into gutters and downspouts. Backed by a 2-Year No-Fail System Guarantee and 10-Year Cable Warranty.
                        </p>
                    </div>
                </div>
            </section>

            {/* Section 3: Balanced Attic Ventilation Systems */}
            <section className="relative z-10 py-16 px-6 max-w-5xl mx-auto border-t border-white/10">
                <div className="text-center mb-12">
                    <div className="text-3xl font-black uppercase tracking-tight text-white">
                        Balanced Attic Ventilation Systems
                    </div>
                    <div className="w-16 h-1 bg-rhive-pink mx-auto mt-4" />
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-8 bg-white/5 border border-white/10 rounded-xl">
                        <div className="text-lg font-bold text-white mb-4">The Balanced Intake &amp; Exhaust Blueprint</div>
                        <p className="text-gray-400 text-base font-serif leading-relaxed">
                            We replace inefficient 'turtle vents' (which we permanently cancel on all replacements) with a balanced ventilation design. Fresh air is drawn from continuous soffit intake vents and pushed out through the ridge line using Owens Corning VentSure®, Sky Runner LTE, GAF Cobra®, or 4-Foot strip exhaust vents.
                        </p>
                    </div>
                    <div className="p-8 bg-white/5 border border-white/10 rounded-xl">
                        <div className="text-lg font-bold text-white mb-4">Structural Benefits</div>
                        <p className="text-gray-400 text-base font-serif leading-relaxed">
                            Regulates attic heat to lower household cooling bills, stops mold/mildew buildup, prevents destructive icicles, and maintains the 50-year non-prorated status of your shingle warranty.
                        </p>
                    </div>
                </div>
            </section>

            {/* Section 4: Leak-Proof VELUX® Skylights & Sun Tunnels */}
            <section className="relative z-10 py-16 px-6 max-w-5xl mx-auto border-t border-white/10">
                <div className="text-center mb-12">
                    <div className="text-3xl font-black uppercase tracking-tight text-white">
                        Leak-Proof VELUX® Skylights &amp; Sun Tunnels
                    </div>
                    <div className="w-16 h-1 bg-rhive-pink mx-auto mt-4" />
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-8 bg-white/5 border border-white/10 rounded-xl">
                        <div className="text-lg font-bold text-white mb-3">VELUX® Fixed Curb-Mounted Skylights</div>
                        <p className="text-gray-400 text-base font-serif leading-relaxed mb-4">
                            Constructed with energy-efficient glass, argon gas infill, and a patented three-layer water defense flashing system. Backed by Velux's premier 10-Year "No Leak" manufacturer warranty.
                        </p>
                        <div className="space-y-2 border-t border-white/10 pt-4">
                            <div className="flex justify-between text-xs text-gray-500 uppercase tracking-widest font-bold">
                                <span>Size Options</span>
                                <span>Dimensions</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-white">Small (SKY_SM)</span>
                                <span className="text-rhive-pink">Up to 24" x 38"</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-white">Medium (SKY_MD)</span>
                                <span className="text-rhive-pink">Up to 30" x 46"</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-white">Large (SKY_LG)</span>
                                <span className="text-rhive-pink">Up to 46" x 46"</span>
                            </div>
                        </div>
                    </div>
                    <div className="p-8 bg-white/5 border border-white/10 rounded-xl">
                        <div className="text-lg font-bold text-white mb-3">VELUX® Sun Tunnels®</div>
                        <p className="text-gray-400 text-base font-serif leading-relaxed mb-4">
                            Bring rich daylight into small, dark hallways, closets, or bathrooms without a direct roofline view. Features a high-impact exterior dome, a highly reflective rigid light tube, and an interior ceiling diffuser.
                        </p>
                        <div className="space-y-2 border-t border-white/10 pt-4">
                            <div className="flex justify-between text-xs text-gray-500 uppercase tracking-widest font-bold">
                                <span>Diameter Options</span>
                                <span>Ideal Application</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-white">10-inch (Small)</span>
                                <span className="text-rhive-pink">Small hallways &amp; closets</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-white">14-inch (Medium)</span>
                                <span className="text-rhive-pink">Bathrooms &amp; larger dark spaces</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
