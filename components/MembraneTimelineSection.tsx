import React from 'react';
import { Activity, Briefcase, Building2, ShieldCheck } from 'lucide-react';

const MembraneTimelineSection = () => {
    const steps = [
        {
            num: "01",
            icon: <Activity className="w-6 h-6" />,
            title: "CORE DIAGNOSTICS",
            desc: "We deploy advanced moisture surveys and core sampling to capture accurate data on your existing insulation and deck condition before proposing a solution."
        },
        {
            num: "02",
            icon: <Briefcase className="w-6 h-6" />,
            title: "CAPEX PROPOSAL",
            desc: "Absolute transparency for property managers. You see the exact estimated CapEx required. We structure our data to support Section 179 tax deductions and portfolio planning."
        },
        {
            num: "03",
            icon: <Building2 className="w-6 h-6" />,
            title: "CERTIFIED ORCHESTRATION",
            desc: "Execution by factory-certified crews following rigorous commercial specifications. Every welded seam and mechanical fastener is executed to the millimeter to ensure compliance."
        },
        {
            num: "04",
            icon: <ShieldCheck className="w-6 h-6" />,
            title: "NDL GUARANTEE ISSUANCE",
            desc: "Upon final inspection, we complete our rigorous multi-point quality assurance check and issue your 20 or 30-Year No Dollar Limit (NDL) warranty directly from the manufacturer."
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
                        <span className="font-mono text-base font-bold uppercase tracking-[0.4em] text-[#00D1FF]">
                            Execution Architecture
                        </span>
                        <div className="w-4 h-[2px] bg-[#00D1FF]"></div>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white mb-6">
                        COMMERCIAL <span className="text-[#00D1FF]">ORCHESTRATION</span> PROTOCOL
                    </h2>
                    <p className="text-gray-400 font-sans max-w-2xl mx-auto text-lg text-balance">
                        A systematic, friction-free operation engineered to maximize transparency and protect your property assets with surgical precision.
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
                                    
                                    <h3 className="text-xl font-black text-white uppercase tracking-widest mb-4 font-sans text-balance">
                                        {step.title}
                                    </h3>
                                    
                                    <p className="text-gray-400 font-sans text-base leading-relaxed group-hover:text-gray-300 transition-colors duration-300 text-balance">
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

export default MembraneTimelineSection;
