import React from 'react';

export const ServicesHero: React.FC = () => {
    return (
        <section className="relative w-full h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden bg-[var(--rhive-obsidian)] border-b border-white/10 group">
            {/* Background Texture Layers */}
            <div
                className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:opacity-50 group-hover:scale-105 transition-all duration-[2s] ease-out filter mix-blend-luminosity grayscale"
                style={{ backgroundImage: 'url(/slc-residential-roof.png)' }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black z-10"></div>
            <div className="absolute inset-0 bg-tech-grid bg-[length:40px_40px] opacity-20 pointer-events-none z-10"></div>

            {/* Neon Accent Glow */}
            <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[var(--rhive-pink)]/10 rounded-full blur-[120px] pointer-events-none z-10"></div>

            <div className="relative z-20 text-center px-6 max-w-5xl mx-auto mt-8">
                <div className="inline-flex items-center justify-center gap-2 mb-6 border border-[var(--rhive-pink)]/30 bg-[var(--rhive-pink)]/5 px-4 py-1.5 rounded-full backdrop-blur-md">
                    <span className="w-1.5 h-1.5 bg-[var(--rhive-pink)] rounded-full animate-pulse shadow-[0_0_8px_rgba(236,2,139,0.8)]"></span>
                    <span className="text-[10px] uppercase tracking-widest text-[var(--rhive-pink)] font-bold font-mono">RHIVE Architecture: The Vanguard of Roofing</span>
                </div>

                <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-black text-white uppercase tracking-tighter mb-6 font-display drop-shadow-2xl leading-[0.9]">
                    Engineered For<br /><span className="text-[var(--rhive-pink)]">Absolute Defense.</span>
                </h1>

                <p className="text-gray-300 font-serif text-lg md:text-2xl max-w-3xl mx-auto leading-relaxed mb-6">
                    We don't just lay standard shingles; we install precision-layered technology featuring active ventilation, architectural-grade materials, and thermal superiority.
                </p>
                <p className="text-[var(--rhive-blue)] font-mono text-sm tracking-widest uppercase font-bold bg-white/5 inline-block px-4 py-2 rounded-sm border border-white/10">
                    Fully warrantied, zero-compromise protection for what matters most.
                </p>
            </div>
        </section>
    );
};

export default ServicesHero;
