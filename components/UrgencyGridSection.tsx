import React from 'react';
import { AlertCircle, Waves, Sun, Clock, Droplet } from 'lucide-react';

const UrgencyGridSection = () => {
    const signs = [
        {
            icon: <Waves className="w-8 h-8" />,
            title: "CURLING & BUCKLING",
            desc: "Shingles turning upward or buckling indicate advanced thermal damage and complete sealant failure. Your home is exposed to wind uplift.",
            color: "text-amber-500",
            bgHover: "hover:bg-amber-500/20",
            borderColor: "hover:border-amber-500/50",
            image: "https://images.unsplash.com/photo-1632759145351-1d592919f522?auto=format&fit=crop&q=80&w=600"
        },
        {
            icon: <Sun className="w-8 h-8" />,
            title: "SEVERE GRANULE LOSS",
            desc: "Finding coarse sand in your gutters? Granules protect the asphalt from UV radiation. Without them, the asphalt bakes, cracks, and fails rapidly.",
            color: "text-orange-500",
            bgHover: "hover:bg-orange-500/20",
            borderColor: "hover:border-orange-500/50",
            image: "https://images.unsplash.com/photo-1628177142898-93e36e4e3a30?auto=format&fit=crop&q=80&w=600"
        },
        {
            icon: <Clock className="w-8 h-8" />,
            title: "SYSTEM AGE: 15+ YEARS",
            desc: "Even without obvious leaks, older builder-grade roofs have dried out asphalt. The structural defense is severely compromised against the next major storm.",
            color: "text-red-500",
            bgHover: "hover:bg-red-500/20",
            borderColor: "hover:border-red-500/50",
            image: "https://images.unsplash.com/photo-1541123356219-284ebe98ae3b?auto=format&fit=crop&q=80&w=600"
        },
        {
            icon: <Droplet className="w-8 h-8" />,
            title: "INTERIOR WATER STAINS",
            desc: "If you see ceiling stains, thousands of dollars in hidden decking and insulation rot have already occurred above it. Immediate action is critical.",
            color: "text-[#00D1FF]",
            bgHover: "hover:bg-[#00D1FF]/20",
            borderColor: "hover:border-[#00D1FF]/50",
            image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=600"
        }
    ];

    return (
        <section className="py-24 bg-[#050505] border-t border-[var(--border-color)] relative">
            <div className="absolute inset-0 bg-gradient-to-b from-black via-[#050505] to-black z-0 pointer-events-none"></div>
            
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 border border-red-500/30 px-6 py-2 bg-red-500/10 mb-6 backdrop-blur-md">
                        <AlertCircle className="w-4 h-4 text-red-500 hidden sm:block" />
                        <span className="text-red-500 font-black text-xs uppercase tracking-[0.3em]">Critical System Failure</span>
                    </div>
                    
                    <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white mb-6">
                        SIGNS YOU NEED A <span className="text-red-500">NEW ROOF</span> NOW
                    </h2>
                    
                    <p className="text-gray-400 font-sans max-w-2xl mx-auto text-lg">
                        Don't wait for the leak. Thousands of dollars in hidden structural damage happens <strong>before</strong> water ever breaches your interior ceiling.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                    {signs.map((sign, idx) => (
                        <div key={idx} 
                             className={`group relative p-8 bg-black border border-white/5 transition-all duration-700 cursor-default ${sign.bgHover} ${sign.borderColor} overflow-hidden min-h-[250px] flex flex-col justify-end`}
                             style={{ clipPath: 'polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)' }}>
                            
                            {/* Background Image */}
                            <div className="absolute inset-0 z-0 opacity-20 group-hover:opacity-40 transition-opacity duration-700">
                                <img src={sign.image} alt={sign.title} className="w-full h-full object-cover transform scale-100 group-hover:scale-110 transition-transform duration-[2s]" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
                            </div>

                            <div className="relative z-10">
                                <div className={`mb-4 p-3 inline-block bg-white/5 border border-white/10 ${sign.color} group-hover:bg-black transition-colors duration-500`}>
                                    {sign.icon}
                                </div>
                                
                                <h3 className="text-xl font-black text-white uppercase tracking-widest mb-2 font-sans">
                                    {sign.title}
                                </h3>
                                
                                <p className="text-gray-400 font-sans text-xs leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                                    {sign.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default UrgencyGridSection;
