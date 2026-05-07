
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Shield, Droplets, Snowflake, Flame, Construction, Wrench, Info, Zap, ChevronRight } from 'lucide-react';
import { roofComponents, ComponentDetail } from '../data/roofComponentsData';
import ComponentLightbox from '../components/ComponentLightbox';
import PlexusShape from '../components/PlexusShape';

const CategoryIcon = ({ category, className }: { category: string, className?: string }) => {
    switch (category) {
        case 'Gutters': return <Droplets className={className} />;
        case 'Ice Management': return <Snowflake className={className} />;
        case 'Chimney': return <Flame className={className} />;
        case 'Maintenance': return <Shield className={className} />;
        case 'Repair': return <Wrench className={className} />;
        case 'Roof Details': return <Settings className={className} />;
        default: return <Info className={className} />;
    }
};

const RoofComponentsPage: React.FC = () => {
    const [activeCategory, setActiveCategory] = useState<string>('ALL');
    const [selectedComponent, setSelectedComponent] = useState<ComponentDetail | null>(null);

    const categories = ['ALL', 'Roof Details', 'Repair', 'Gutters', 'Ice Management', 'Chimney', 'Maintenance'];

    const filteredComponents = useMemo(() => {
        if (activeCategory === 'ALL') return roofComponents;
        return roofComponents.filter(c => c.category === activeCategory);
    }, [activeCategory]);

    const maintenanceComponents = useMemo(() => {
        return roofComponents.filter(c => c.category === 'Maintenance');
    }, []);

    const chamferSize = "16px";
    const clipPathValue = `polygon(
        ${chamferSize} 0,
        100% 0,
        100% calc(100% - ${chamferSize}),
        calc(100% - ${chamferSize}) 100%,
        0 100%,
        0 ${chamferSize}
    )`;

    return (
        <div className="bg-black text-white min-h-screen font-sans selection:bg-[var(--rhive-pink)] selection:text-white">
            {/* HERO SECTION */}
            <section className="relative h-[50vh] flex items-center justify-center overflow-hidden border-b border-white/5">
                <div className="absolute inset-0 z-0">
                    <img 
                        src="/images/components/components_hero.png" 
                        alt="Premium Roof System" 
                        className="w-full h-full object-cover opacity-80 grayscale-[10%]"
                    />
                    <div className="absolute inset-0 bg-black/20" />
                </div>
                <div className="absolute inset-0 z-0 opacity-40">
                    <PlexusShape 
                        backgroundColor="transparent" 
                        dotColor="#ec028b" 
                        lineColor="236, 2, 139" 
                        density={40} 
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/40 pointer-events-none" />

                <div className="relative z-10 text-center px-4 max-w-4xl">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 border border-[var(--rhive-pink)]/30 px-6 py-2 bg-[var(--rhive-pink)]/10 mb-8"
                    >
                        <Zap className="w-4 h-4 text-[var(--rhive-pink)] shadow-[0_0_8px_var(--rhive-pink)]" />
                        <span className="text-[var(--rhive-pink)] font-black text-base uppercase tracking-[0.4em]">Precision Peripherals Hub</span>
                    </motion.div>

                    <motion.h1 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-8xl font-black uppercase tracking-tighter mb-6 leading-[0.9]"
                    >
                        ROOF <span className="text-[var(--rhive-pink)]">COMPONENTS</span><br/>
                        <span className="text-white/40">& OPTIONS</span>
                    </motion.h1>
                    
                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg md:text-xl text-gray-500 font-serif italic max-w-prose mx-auto leading-relaxed"
                    >
                        Engineering the perimeter defense of your property. From surgical maintenance protocols to industrial-grade water management systems.
                    </motion.p>
                </div>
            </section>

            {/* CATEGORY NAV */}
            <section className="sticky top-12 z-30 bg-black/80 backdrop-blur-md border-b border-white/5 py-4">
                <div className="max-w-7xl mx-auto px-6 overflow-x-auto no-scrollbar">
                    <div className="flex items-center gap-4 min-w-max">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-6 py-2 text-base font-bold uppercase tracking-widest transition-all relative group
                                    ${activeCategory === cat ? 'text-white' : 'text-gray-500 hover:text-white'}`}
                            >
                                {cat}
                                {activeCategory === cat && (
                                    <motion.div 
                                        layoutId="cat-underline"
                                        className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--rhive-pink)] shadow-[0_0_10px_var(--rhive-pink)]" 
                                    />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            <main className="max-w-7xl mx-auto px-6 py-20 space-y-32">
                
                {/* PRIORITY: MAINTENANCE BLOCK */}
                {(activeCategory === 'ALL' || activeCategory === 'Maintenance') && (
                    <section id="maintenance-priority" className="relative border border-[var(--rhive-pink)]/20 p-8 md:p-12 overflow-hidden" style={{ clipPath: 'polygon(24px 0, 100% 0, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0 100%, 0 24px)' }}>
                        <div className="absolute inset-0 z-0 bg-[#050505]">
                            <img src="/images/components/maint_priority_bg.png" alt="High-Tech Roof Maintenance" className="w-full h-full object-cover opacity-30 grayscale-[50%] mix-blend-luminosity" />
                            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
                            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black" />
                        </div>
                        
                        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between mb-12 border-l-4 border-[var(--rhive-pink)] pl-6 gap-8">
                            <div className="max-w-2xl">
                                <h2 className="text-[var(--rhive-pink)] text-base font-bold uppercase tracking-[.3em] mb-2 drop-shadow-[0_0_8px_rgba(236,2,139,0.5)]">Priority Status: Critical</h2>
                                <h3 className="text-4xl md:text-5xl leading-tight font-black uppercase tracking-tighter mb-4 text-white">Maintenance & Preservation</h3>
                                <p className="text-gray-300 font-serif italic text-base md:text-lg leading-relaxed max-w-prose bg-black/40 p-4 rounded-sm border border-white/5 backdrop-blur-md">
                                    Annual roof maintenance is not an option; it is an engineering necessity. A consistent preservation protocol ensures 
                                    every peripheral component—from gutter channels to pipe flashings—operates at peak theoretical capacity. 
                                    <span className="block mt-4 text-white/70 border-t border-[var(--rhive-pink)]/20 pt-4">
                                        <span className="text-[var(--rhive-pink)] font-bold uppercase tracking-widest text-base">The RHIVE Challenge:</span> Ask other contractors for the specific 
                                        items on your roof they verify during "maintenance." If they can't provide a technical blueprint for the service, they aren't RHIVE.
                                    </span>
                                </p>
                            </div>
                            <div className="hidden md:block text-right bg-black/50 p-6 border border-white/10 backdrop-blur-xl" style={{ clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)' }}>
                                <p className="text-base font-bold text-[var(--rhive-pink)] uppercase tracking-widest mb-2">Integrity Score</p>
                                <p className="text-4xl font-black text-white font-mono shadow-[0_0_15px_rgba(255,255,255,0.2)]">10.0/10.0</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {maintenanceComponents.map((comp) => (
                                <ComponentCard 
                                    key={comp.id} 
                                    component={comp} 
                                    priority={true}
                                    onClick={() => setSelectedComponent(comp)} 
                                />
                            ))}
                        </div>
                    </section>
                )}

                {/* COMPONENT GRID */}
                <section>
                    {activeCategory === 'ALL' && (
                        <div className="mb-12">
                            <h3 className="text-2xl font-black uppercase tracking-tighter">System Peripherals</h3>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <AnimatePresence mode="popLayout">
                            {filteredComponents
                                .filter(c => c.category !== 'Maintenance' || activeCategory === 'Maintenance')
                                .map((comp) => (
                                <motion.div
                                    key={comp.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <ComponentCard 
                                        component={comp} 
                                        onClick={() => setSelectedComponent(comp)} 
                                    />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </section>

                {/* FOOTER CALL TO ACTION */}
                <section className="bg-white/5 border border-white/10 p-12 relative overflow-hidden" 
                    style={{ clipPath: 'polygon(32px 0, 100% 0, 100% calc(100% - 32px), calc(100% - 32px) 100%, 0 100%, 0 32px)' }}>
                    <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--rhive-pink)]/5 blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                    <div className="relative z-10 max-w-2xl">
                        <h4 className="text-base font-bold text-[var(--rhive-pink)] uppercase tracking-widest mb-4">The RHIVE Commitment</h4>
                        <h2 className="text-4xl font-black uppercase tracking-tighter mb-6 leading-none">Complete System <br/>Certification.</h2>
                        <p className="text-gray-400 font-serif italic text-base md:text-lg max-w-prose mb-10 leading-relaxed">
                            Every component we install is selected for maximum durability and thermal efficiency. 
                            We don't just build roofs; we engineer weather-defense ecosystems.
                        </p>
                        <button className="flex items-center gap-4 group">
                            <span className="text-base font-bold uppercase tracking-widest bg-[var(--rhive-pink)] px-8 py-4 group-hover:bg-white group-hover:text-black transition-all">Request Component Diagnostic</span>
                            <ChevronRight className="w-5 h-5 text-[var(--rhive-pink)] group-hover:translate-x-2 transition-transform" />
                        </button>
                    </div>
                </section>
            </main>

            {/* LIGHTBOX */}
            <ComponentLightbox 
                component={selectedComponent} 
                onClose={() => setSelectedComponent(null)} 
            />
        </div>
    );
};

const ComponentCard: React.FC<{ component: ComponentDetail, onClick: () => void, priority?: boolean }> = ({ component, onClick, priority = false }) => {
    const chamferSize = priority ? "24px" : "12px";
    const clipPathValue = `polygon(
        ${chamferSize} 0,
        100% 0,
        100% calc(100% - ${chamferSize}),
        calc(100% - ${chamferSize}) 100%,
        0 100%,
        0 ${chamferSize}
    )`;

    return (
        <div 
            onClick={onClick}
            className={`group relative cursor-pointer border transition-all duration-300 overflow-hidden
                ${priority ? 'aspect-[16/10] md:aspect-auto p-8' : 'aspect-square p-6'}
                ${priority ? 'bg-black/40 border-white/10 hover:border-[var(--rhive-pink)]' : 'bg-white/5 border-white/5 hover:border-white/20'}`}
            style={{ clipPath: clipPathValue }}
        >
            {/* Hover Glow & Image Background */}
            {component.image ? (
                <div className="absolute inset-0 z-0 overflow-hidden bg-[#050505]">
                    <img 
                        src={component.image} 
                        alt={component.title} 
                        className="w-full h-full object-cover object-center opacity-50 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700 grayscale-[50%]" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                    <div className={`absolute inset-0 bg-gradient-to-br from-[var(--rhive-pink)]/0 via-transparent to-transparent opacity-0 group-hover:opacity-30 transition-opacity duration-500`} />
                </div>
            ) : (
                <div className={`absolute inset-0 bg-gradient-to-br from-[var(--rhive-pink)]/0 via-transparent to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-500
                    ${priority ? 'from-[var(--rhive-pink)]/10' : ''}`} />
            )}
            
            <div className="relative z-10 h-full flex flex-col items-start">
                <div className={`mb-auto p-3 transition-all duration-500
                    ${priority ? 'bg-[var(--rhive-pink)]/10 border border-[var(--rhive-pink)]/30 text-[var(--rhive-pink)] group-hover:scale-110 shadow-[0_0_15px_rgba(236,2,139,0.1)]' : 'bg-white/5 text-gray-400 group-hover:text-white'}`}>
                    <CategoryIcon category={component.category} className={priority ? "w-8 h-8" : "w-5 h-5"} />
                </div>

                <div className="mt-6">
                    <div className="flex items-center gap-2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
                        <span className="w-4 h-[1px] bg-[var(--rhive-pink)]" />
                        <span className="text-base font-bold text-[var(--rhive-pink)] uppercase tracking-widest">Detail Matrix</span>
                    </div>
                    <h4 className={`font-black uppercase tracking-tighter leading-none transition-colors
                        ${priority ? 'text-2xl md:text-3xl' : 'text-md group-hover:text-[var(--rhive-pink)]'}`}>
                        {component.title}
                    </h4>
                    {priority && (
                        <p className="mt-4 text-base text-gray-500 font-serif italic line-clamp-2 max-w-[80%]">
                            {component.description}
                        </p>
                    )}
                </div>
            </div>

            {/* Tech Decoration */}
            <div className="absolute bottom-0 right-0 p-2 opacity-10 font-mono text-base tracking-tight uppercase">
                {component.id}
            </div>
            
            {priority && (
                <div className="absolute top-0 right-0 p-6">
                    <div className="w-12 h-12 border border-white/5 rotate-45 flex items-center justify-center opacity-20 group-hover:opacity-100 group-hover:border-[var(--rhive-pink)]/50 transition-all">
                        <div className="w-2 h-2 bg-white/40 group-hover:bg-[var(--rhive-pink)]" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default RoofComponentsPage;
