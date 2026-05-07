import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

const RhiveHero: React.FC = () => {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black pt-24">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-b from-rhive-pink/10 via-transparent to-black" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-rhive-blue/20 via-transparent to-transparent opacity-50" />

                {/* Simulated Starry/Circuit Mesh overlay */}
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
            </div>

            <div className="relative z-10 container mx-auto px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="max-w-5xl mx-auto"
                >
                    <h2 className="text-[10px] font-black tracking-[0.6em] text-rhive-pink uppercase mb-8 ml-[0.6em]">
                        Precision Engineering // Radical Transparency
                    </h2>

                    <h1 className="text-7xl md:text-[120px] font-black leading-none tracking-tighter uppercase mb-12 text-white">
                        THE FUTURE OF <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-rhive-pink to-white animate-gradient-x">
                            ROOFING
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl font-medium text-gray-400 max-w-2xl mx-auto mb-16 leading-relaxed">
                        Experience Utah's most trusted, tech-forward roofing contractor.
                        We don't just build roofs; we deploy infrastructure with <span className="text-white">military precision.</span>
                    </p>

                    <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
                        <button className="group relative px-12 py-5 bg-rhive-pink text-white font-black uppercase text-xs tracking-[0.3em] overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(236,2,139,0.4)]">
                            <span className="relative z-10">Start Estimate</span>
                            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                        </button>

                        <button className="px-12 py-5 border border-white/20 text-white font-black uppercase text-xs tracking-[0.3em] hover:bg-white/5 transition-all">
                            Our Process
                        </button>
                    </div>
                </motion.div>
            </div>

            {/* Bottom Gradient Fade */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent z-10" />
        </section>
    );
};

export default RhiveHero;
