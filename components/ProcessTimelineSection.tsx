import React from 'react';
import { Satellite, Calculator, HardHat, ShieldCheck } from 'lucide-react';

const ProcessTimelineSection = () => {
    const steps = [
        {
            num: "01",
            icon: <Satellite className="w-6 h-6" />,
            title: "SATELLITE & DRONE METRICS",
            desc: "We deploy advanced Roofr satellite technology and autonomous drone inspections to capture millimeter-accurate measurements of your entire property structure before a ladder ever touches your siding."
        },
        {
            num: "02",
            icon: <Calculator className="w-6 h-6" />,
            title: "DUAL-MATH PROPOSAL",
            desc: "Absolute transparency. You see the exact estimated materials, labor, overhead, and profit required to complete your project. Comparing bids is simple because you see if your project is informed by hard data or simply 'guessed' by other contractors."
        },
        {
            num: "03",
            icon: <HardHat className="w-6 h-6" />,
            title: "CERTIFIED INSTALLATION",
            desc: "Execution by factory-certified crews following strict manufacturer specifications. Every nail placement, barrier seal, and ventilation calculation is executed to the millimeter to ensure lifetime guarantee compliance."
        },
        {
            num: "04",
            icon: <ShieldCheck className="w-6 h-6" />,
            title: "FINAL QA & REGISTRATION",
            desc: "Upon final investment deposit, we complete our rigorous multi-point quality assurance check and instantly register your 50-year non-prorated system warranty directly with the manufacturer on your behalf."
        }
    ];

    return (
        <section className="py-24 bg-black border-y border-white/5 relative overflow-hidden">
            {/* Tech-Noir Glowing Orbs */}
            <div className="absolute top-0 right-1/4 w-[40vw] h-[40vw] bg-[#00D1FF]/5 blur-[120px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-0 left-1/4 w-[30vw] h-[30vw] bg-[var(--rhive-pink)]/5 blur-[100px] rounded-full pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-20">
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <div className="w-4 h-[2px] bg-[#00D1FF]"></div>
                        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.4em] text-[#00D1FF]">
                            Execution Architecture
                        </span>
                        <div className="w-4 h-[2px] bg-[#00D1FF]"></div>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white mb-6">
                        THE <span className="text-[#00D1FF]">RHIVE WAY</span> PROTOCOL
                    </h2>
                    <p className="text-gray-400 font-sans max-w-2xl mx-auto text-lg text-balance">
                        A systematic, friction-free operation engineered to maximize transparency and protect your property with surgical precision.
                    </p>
                </div>

                <div className="relative">
                    {/* Glowing Connection Line (Desktop) */}
                    <div className="hidden lg:block absolute top-[60px] left-[10%] right-[10%] h-[2px] bg-white/5 z-0">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00D1FF]/50 to-transparent shadow-[0_0_15px_rgba(0,209,255,0.5)]"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {steps.map((step, idx) => (
                            <div key={idx} className="relative z-10 group flex flex-col items-center text-center">
                                {/* Number Marker */}
                                <div className="text-[#00D1FF]/20 font-black text-6xl md:text-8xl tracking-tighter mix-blend-screen -mb-10 group-hover:text-[#00D1FF]/40 transition-colors duration-500 pointer-events-none">
                                    {step.num}
                                </div>
                                
                                {/* Hexagon Tech Node */}
                                <div className="w-16 h-16 bg-black border border-[#00D1FF]/30 mb-8 flex items-center justify-center relative shadow-[0_0_20px_rgba(0,209,255,0.1)] group-hover:shadow-[0_0_30px_rgba(0,209,255,0.4)] group-hover:bg-[#00D1FF]/10 transition-all duration-500"
                                     style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
                                    <div className="text-[#00D1FF] group-hover:scale-110 transition-transform duration-500">
                                        {step.icon}
                                    </div>
                                    <div className="absolute inset-0 border-[2px] border-[#00D1FF]/0 group-hover:border-[#00D1FF]/50 blur-[2px] transition-all duration-500" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}></div>
                                </div>

                                <div className="bg-[#050505] border border-white/5 p-8 transition-colors duration-500 group-hover:border-[#00D1FF]/30 h-full w-full relative"
                                     style={{ clipPath: 'polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)' }}>
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#00D1FF]/5 to-transparent pointer-events-none"></div>
                                    
                                    <h3 className="text-xl font-black text-white uppercase tracking-widest mb-4 font-sans">
                                        {step.title}
                                    </h3>
                                    
                                    <p className="text-gray-400 font-sans text-sm leading-relaxed group-hover:text-gray-300 transition-colors duration-300 text-balance">
                                        {step.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProcessTimelineSection;
