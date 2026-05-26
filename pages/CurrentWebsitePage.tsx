import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserIcon, Globe, Layout, Shield, Zap, DollarSign, TrendingUp, Maximize2, Award, Info, FileText } from 'lucide-react';
import { useNavigation } from '../contexts/NavigationContext';
import { cn } from '../lib/utils';
import RhiveHeader from '../components/website/RhiveHeader';
import RhiveHexSidebar from '../components/website/RhiveHexSidebar';
import HunniChatWidget from '../components/website/HunniChatWidget';
import RhiveGenericSection from '../components/website/RhiveGenericSection';
import TechHero from '../components/website/TechHero';
import DualMathComparison from '../components/website/DualMathComparison';
import AddressScanInput from '../components/AddressScanInput';

const CurrentWebsitePage: React.FC = () => {
    const { setActivePageId } = useNavigation();
    const [viewMode, setViewMode] = useState<'recreation' | 'live'>('recreation');
    const [virtualPage, setVirtualPage] = useState<'home' | 'about' | 'roofing' | 'estimator'>('home');

    // Interactive Roofing Tab
    const [roofingType, setRoofingType] = useState<'residential' | 'commercial'>('residential');
    const [shingleTier, setShingleTier] = useState<number>(1); // 0: Standard, 1: Premium, 2: Storm
    const [membraneThickness, setMembraneThickness] = useState<number>(60); // 50, 60, 80 mil

    // Interactive Estimator State
    const [estimatorSquares, setEstimatorSquares] = useState<number>(30);
    const [estimatorGrade, setEstimatorGrade] = useState<'standard' | 'premium'>('standard');

    // Telemetry Listeners
    useEffect(() => {
        const handleVirtualNav = (e: Event) => {
            const customEvent = e as CustomEvent<{ page: 'home' | 'about' | 'roofing' | 'estimator' }>;
            if (customEvent.detail && customEvent.detail.page) {
                setVirtualPage(customEvent.detail.page);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        };

        const handleScannerOpen = () => {
            setVirtualPage('estimator');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        };

        window.addEventListener('rhive-virtual-nav', handleVirtualNav);
        window.addEventListener('open-estimator', handleScannerOpen);

        return () => {
            window.removeEventListener('rhive-virtual-nav', handleVirtualNav);
            window.removeEventListener('open-estimator', handleScannerOpen);
        };
    }, []);

    // Format Currency Helper
    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(val);
    };

    // Shingle Specs Configuration
    const shingleSpecs = [
        {
            name: "Duration Standard Shingles",
            wind: "110 MPH Wind Resistance",
            impact: "Class 2 Impact Resistance",
            algae: "10-Year Algae Defense",
            description: "Solid, reliable protection with TruDefinition color styling."
        },
        {
            name: "Duration Premium SureNail Shingles",
            wind: "130 MPH Wind Warranty (Patented SureNail®)",
            impact: "Class 3 Advanced Impact Rating",
            algae: "25-Year StreakGuard™ Defense",
            description: "The gold standard of residential performance, featuring double-layer reinforcement in the nailing zone."
        },
        {
            name: "Duration Flex Armor Shingles",
            wind: "130 MPH Wind Warranty (SureNail® Reinforced)",
            impact: "Class 4 Maximum Impact Rating (SBS Rubberized)",
            algae: "Lifetime StreakGuard™ Defense",
            description: "Ultimate polymer-modified roofing designed to withstand massive hail damage and extreme structural flex."
        }
    ];

    // Estimator Calculations
    const currentGradeDetails = estimatorGrade === 'standard'
        ? { material: 185, labor: 140, overhead: 45, label: "OC Duration Class A" }
        : { material: 245, labor: 160, overhead: 55, label: "OC Duration Storm (SBS Impact)" };

    const estFloorCost = (currentGradeDetails.material + currentGradeDetails.labor + currentGradeDetails.overhead) * estimatorSquares;
    const estCeilingPrice = Math.round(estFloorCost / 0.85); // 15% margin
    const estMarginAmount = estCeilingPrice - estFloorCost;
    const estMaterialTotal = currentGradeDetails.material * estimatorSquares;
    const estLaborTotal = currentGradeDetails.labor * estimatorSquares;
    const estOverheadTotal = currentGradeDetails.overhead * estimatorSquares;

    return (
        <div className="relative w-full h-full bg-black flex flex-col overflow-y-auto overflow-x-hidden">
            {/* VIEW MODE TOGGLE (Floating Bottom Right) */}
            <div className="fixed bottom-8 right-8 z-[1000] flex gap-2 p-1 bg-black/80 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl">
                <button
                    onClick={() => setViewMode('recreation')}
                    className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all",
                        viewMode === 'recreation' ? "bg-rhive-pink text-white" : "text-gray-400 hover:text-white"
                    )}
                >
                    <Layout className="w-3 h-3" />
                    OS Recreation
                </button>
                <button
                    onClick={() => setViewMode('live')}
                    className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all",
                        viewMode === 'live' ? "bg-rhive-pink text-white" : "text-gray-400 hover:text-white"
                    )}
                >
                    <Globe className="w-3 h-3" />
                    Live Site
                </button>
            </div>

            <AnimatePresence mode="wait">
                {viewMode === 'recreation' ? (
                    <motion.div
                        key="recreation"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex-grow flex flex-col pb-32"
                    >
                        <RhiveHeader />
                        <RhiveHexSidebar />
                        <HunniChatWidget />

                        <main className="flex-grow">
                            {virtualPage === 'home' && (
                                <>
                                    <TechHero />
                                    <DualMathComparison />
                                </>
                            )}

                            {/* VIRTUAL ABOUT PAGE */}
                            {virtualPage === 'about' && (
                                <div className="min-h-screen pt-24">
                                    <RhiveGenericSection glowColor="blue" title="The Vanguard." subtitle="Identity Resolution // Radical Transparency">
                                        <div className="grid lg:grid-cols-2 gap-12 mt-4 select-none">
                                            {/* KARA ROBINSON CARD */}
                                            <div 
                                                className="relative p-[1px] group overflow-hidden bg-gradient-to-b from-rhive-blue/40 to-transparent transition-all duration-300"
                                                style={{ clipPath: 'polygon(24px 0, 100% 0, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0 100%, 0 24px)' }}
                                            >
                                                <div 
                                                    className="bg-black/90 p-8 flex flex-col md:flex-row gap-8 items-center h-full relative"
                                                    style={{ clipPath: 'polygon(23px 0, 100% 0, 100% calc(100% - 23px), calc(100% - 23px) 100%, 0 100%, 0 23px)' }}
                                                >
                                                    {/* Grayscale Avatar with Blue Tech Glow Ring */}
                                                    <div className="relative w-36 h-36 rounded-full shrink-0 border-2 border-rhive-blue shadow-[0_0_20px_rgba(8,19,124,0.4)] overflow-hidden group-hover:scale-105 transition-transform duration-500">
                                                        <img
                                                            src="https://static.wixstatic.com/media/c5862a_591faf36d59c448e8c92b9caff471e96~mv2.png"
                                                            alt="Kara Robinson"
                                                            className="w-full h-full object-cover grayscale brightness-95 group-hover:grayscale-0 transition-all duration-700"
                                                        />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
                                                    </div>

                                                    <div className="flex-grow text-center md:text-left space-y-4">
                                                        <div>
                                                            <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                                                                <span className="h-1.5 w-1.5 rounded-full bg-rhive-pink animate-pulse" />
                                                                <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">Security clearance: Tier-1 Exec</span>
                                                            </div>
                                                            <h3 className="text-2xl font-black uppercase text-white tracking-tight">Kara Robinson</h3>
                                                            <p className="text-rhive-pink text-xs font-black tracking-widest uppercase mt-0.5">President // Co-Founder</p>
                                                        </div>

                                                        <p className="text-gray-400 text-xs leading-relaxed font-mono">
                                                            Commitment to reshaping the construction landscape through female-led operational excellence, staging logic, and zero-surprise delivery frameworks. Harnessing comprehensive accountability matrices to safeguard project integrity.
                                                        </p>

                                                        <div className="pt-2 flex justify-center md:justify-start gap-4 text-[9px] font-mono text-gray-500">
                                                            <span>SIG: KARA_ROBINSON_0x9E</span>
                                                            <span>•</span>
                                                            <span className="text-rhive-pink">STATUS: ACTIVE_COMMAND</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* MICHAEL ROBINSON CARD */}
                                            <div 
                                                className="relative p-[1px] group overflow-hidden bg-gradient-to-b from-rhive-blue/40 to-transparent transition-all duration-300"
                                                style={{ clipPath: 'polygon(24px 0, 100% 0, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0 100%, 0 24px)' }}
                                            >
                                                <div 
                                                    className="bg-black/90 p-8 flex flex-col md:flex-row gap-8 items-center h-full relative"
                                                    style={{ clipPath: 'polygon(23px 0, 100% 0, 100% calc(100% - 23px), calc(100% - 23px) 100%, 0 100%, 0 23px)' }}
                                                >
                                                    {/* Grayscale Avatar with Blue Tech Glow Ring */}
                                                    <div className="relative w-36 h-36 rounded-full shrink-0 border-2 border-rhive-blue shadow-[0_0_20px_rgba(8,19,124,0.4)] overflow-hidden group-hover:scale-105 transition-transform duration-500">
                                                        <img
                                                            src="https://static.wixstatic.com/media/c5862a_f1b8b6616fe44f739664188e00d416ce~mv2.png"
                                                            alt="Michael Robinson"
                                                            className="w-full h-full object-cover grayscale brightness-95 group-hover:grayscale-0 transition-all duration-700"
                                                        />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
                                                    </div>

                                                    <div className="flex-grow text-center md:text-left space-y-4">
                                                        <div>
                                                            <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                                                                <span className="h-1.5 w-1.5 rounded-full bg-rhive-pink animate-pulse" />
                                                                <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">Security clearance: Tier-1 Exec</span>
                                                            </div>
                                                            <h3 className="text-2xl font-black uppercase text-white tracking-tight">Michael Robinson</h3>
                                                            <p className="text-rhive-pink text-xs font-black tracking-widest uppercase mt-0.5">CEO // Co-Founder</p>
                                                        </div>

                                                        <p className="text-gray-400 text-xs leading-relaxed font-mono">
                                                            Chief Strategic Architect of RHIVE OS. Resolutely focused on integrating AI-driven satellite telemetry, machine estimation systems, and open-book ledger pricing. Empowering clients with direct access to actual physical costs.
                                                        </p>

                                                        <div className="pt-2 flex justify-center md:justify-start gap-4 text-[9px] font-mono text-gray-500">
                                                            <span>SIG: MICHAEL_ROBINSON_0x7F</span>
                                                            <span>•</span>
                                                            <span className="text-rhive-pink">STATUS: ACTIVE_COMMAND</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* System Integrity Mission Statement */}
                                        <div className="mt-16 bg-neutral-900/50 border border-white/5 p-8 relative rounded-xl">
                                            <div className="absolute top-0 left-6 w-16 h-[2px] bg-rhive-pink" />
                                            <h4 className="text-lg font-black uppercase tracking-tight text-white mb-4">Core Integrity Mandate</h4>
                                            <p className="text-xs font-mono leading-relaxed text-gray-400">
                                                RHIVE was established to challenge the construction industry's legacy model. Traditional roofing firms leverage informational asymmetry (the "black box") to hide bloated commissions and subcontractors markups. Our protocol mandates total transparency. Every piece of telemetry data, shingle cost ledger, and labor wage schedule is open-source and visible to the property owner. No hidden fees. Zero surprises. Just honest, high-performance math.
                                            </p>
                                        </div>
                                    </RhiveGenericSection>
                                </div>
                            )}

                            {/* VIRTUAL ROOFING (SERVICES) PAGE */}
                            {virtualPage === 'roofing' && (
                                <div className="min-h-screen pt-24">
                                    <RhiveGenericSection glowColor="gold" title="Capability Catalog." subtitle="Precision-Engineered Roofing Specifications">
                                        
                                        {/* INTERACTIVE ROOFING TYPE TOGGLE SWITCH (Zero Checkboxes) */}
                                        <div className="flex justify-center mb-12">
                                            <div className="p-1.5 bg-neutral-950 border border-white/10 rounded-full flex gap-1 shadow-2xl relative">
                                                <button
                                                    onClick={() => setRoofingType('residential')}
                                                    className={cn(
                                                        "px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all",
                                                        roofingType === 'residential' ? "bg-rhive-gold text-black font-extrabold" : "text-gray-400 hover:text-white"
                                                    )}
                                                >
                                                    Residential Steep-Slope
                                                </button>
                                                <button
                                                    onClick={() => setRoofingType('commercial')}
                                                    className={cn(
                                                        "px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all",
                                                        roofingType === 'commercial' ? "bg-rhive-gold text-black font-extrabold" : "text-gray-400 hover:text-white"
                                                    )}
                                                >
                                                    Commercial Flat Membrane
                                                </button>
                                            </div>
                                        </div>

                                        <AnimatePresence mode="wait">
                                            {roofingType === 'residential' ? (
                                                <motion.div
                                                    key="residential"
                                                    initial={{ opacity: 0, y: 15 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -15 }}
                                                    className="grid lg:grid-cols-2 gap-12 mt-4 select-none text-left"
                                                >
                                                    {/* LEFT PANEL: SYSTEM SPECIFICATION CONTROLS */}
                                                    <div className="space-y-8 bg-neutral-900/40 border border-white/5 p-8 rounded-xl backdrop-blur-md">
                                                        <div>
                                                            <span className="text-[10px] font-black tracking-widest text-rhive-gold uppercase">// OC Shingle System Tiers</span>
                                                            <h3 className="text-xl font-bold uppercase text-white mt-1">Configure Duration™ System</h3>
                                                        </div>

                                                        {/* CUSTOM SLIDER TIER CONTROLLER */}
                                                        <div className="space-y-4">
                                                            <div className="flex justify-between text-xs font-mono text-gray-400">
                                                                <span>Tier: {shingleSpecs[shingleTier].name}</span>
                                                                <span className="text-rhive-gold uppercase tracking-wider font-bold">Level {shingleTier + 1}</span>
                                                            </div>
                                                            <input
                                                                type="range"
                                                                min="0"
                                                                max="2"
                                                                step="1"
                                                                value={shingleTier}
                                                                onChange={(e) => setShingleTier(parseInt(e.target.value))}
                                                                className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-rhive-gold focus:outline-none"
                                                                style={{
                                                                    background: `linear-gradient(to right, #e2ab49 0%, #e2ab49 ${(shingleTier / 2) * 100}%, #262626 ${(shingleTier / 2) * 100}%, #262626 100%)`
                                                                }}
                                                            />
                                                            <div className="flex justify-between text-[9px] font-mono text-gray-500 uppercase tracking-widest mt-1">
                                                                <span>Duration Standard</span>
                                                                <span>Premium SureNail</span>
                                                                <span>Flex Rubberized</span>
                                                            </div>
                                                        </div>

                                                        {/* Specs Highlight */}
                                                        <div className="bg-black/80 border border-rhive-gold/30 p-6 rounded-lg space-y-4">
                                                            <h4 className="text-xs font-black uppercase text-white tracking-widest border-b border-white/5 pb-2 text-rhive-gold">
                                                                Technical System Telemetry
                                                            </h4>
                                                            <div className="space-y-3 text-xs font-mono text-gray-300">
                                                                <div className="flex justify-between">
                                                                    <span className="text-gray-500 uppercase">Wind Resistance</span>
                                                                    <span className="text-white">{shingleSpecs[shingleTier].wind}</span>
                                                                </div>
                                                                <div className="flex justify-between">
                                                                    <span className="text-gray-500 uppercase">Impact Rating</span>
                                                                    <span className="text-white">{shingleSpecs[shingleTier].impact}</span>
                                                                </div>
                                                                <div className="flex justify-between">
                                                                    <span className="text-gray-500 uppercase">Streak Defense</span>
                                                                    <span className="text-white">{shingleSpecs[shingleTier].algae}</span>
                                                                </div>
                                                            </div>
                                                            <p className="text-xs italic text-gray-400 font-serif border-t border-white/5 pt-3">
                                                                "{shingleSpecs[shingleTier].description}"
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* RIGHT PANEL: Steep-Slope Layered Shield Diagram */}
                                                    <div className="flex flex-col justify-center space-y-6">
                                                        <h4 className="text-xs font-black uppercase tracking-wider text-gray-400">// Layered Steep-Slope Shield (OC Duration)</h4>
                                                        <div className="space-y-3 font-mono">
                                                            {[
                                                                { name: "04 // Owens Corning Duration Shingles", desc: "Patented SureNail® double-reinforced nailing zone.", thickness: "bg-rhive-gold/30 border-rhive-gold text-white" },
                                                                { name: "03 // ProArmor Synthetic Underlayment", desc: "Friction-enhancing defense slip sheet.", thickness: "bg-white/10 border-white/20 text-gray-300" },
                                                                { name: "02 // WeatherLock G Ice & Water Shield", desc: "Self-sealing modified asphalt barrier for valleys.", thickness: "bg-white/5 border-white/10 text-gray-400" },
                                                                { name: "01 // Solid Structural Roof Plywood Decking", desc: "Verified structural substrate free of flex.", thickness: "bg-white/5 border-white/10 text-gray-500" }
                                                            ].map((layer, i) => (
                                                                <div 
                                                                    key={i} 
                                                                    className={cn(
                                                                        "p-4 border rounded backdrop-blur-md relative overflow-hidden transition-all duration-300",
                                                                        layer.thickness
                                                                    )}
                                                                >
                                                                    <div className="absolute top-0 right-0 p-2 text-[7px] text-gray-600">// VERIFIED_SECURE</div>
                                                                    <h5 className="text-[11px] font-bold uppercase">{layer.name}</h5>
                                                                    <p className="text-[9px] mt-1 opacity-70 leading-normal">{layer.desc}</p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ) : (
                                                <motion.div
                                                    key="commercial"
                                                    initial={{ opacity: 0, y: 15 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -15 }}
                                                    className="grid lg:grid-cols-2 gap-12 mt-4 select-none text-left"
                                                >
                                                    {/* LEFT PANEL: COMMERCIAL MEMBRANE CONTROLS */}
                                                    <div className="space-y-8 bg-neutral-900/40 border border-white/5 p-8 rounded-xl backdrop-blur-md">
                                                        <div>
                                                            <span className="text-[10px] font-black tracking-widest text-rhive-gold uppercase">// GAF Thermoplastic Membrane</span>
                                                            <h3 className="text-xl font-bold uppercase text-white mt-1">GAF PVC & TPO Welding Specs</h3>
                                                        </div>

                                                        {/* MEMBRANE THICKNESS SLIDER CONTROLLER */}
                                                        <div className="space-y-4">
                                                            <div className="flex justify-between text-xs font-mono text-gray-400">
                                                                <span>Thickness Spec: {membraneThickness} Mil</span>
                                                                <span className="text-rhive-gold font-bold">{membraneThickness === 50 ? "Standard 50 Mil" : membraneThickness === 60 ? "Heavy Duty 60 Mil" : "Extreme Duty 80 Mil"}</span>
                                                            </div>
                                                            <input
                                                                type="range"
                                                                min="50"
                                                                max="80"
                                                                step="10"
                                                                value={membraneThickness}
                                                                onChange={(e) => setMembraneThickness(parseInt(e.target.value))}
                                                                className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-rhive-gold focus:outline-none"
                                                                style={{
                                                                    background: `linear-gradient(to right, #e2ab49 0%, #e2ab49 ${((membraneThickness - 50) / 30) * 100}%, #262626 ${((membraneThickness - 50) / 30) * 100}%, #262626 100%)`
                                                                }}
                                                            />
                                                            <div className="flex justify-between text-[9px] font-mono text-gray-500 uppercase tracking-widest mt-1">
                                                                <span>50 mil membrane</span>
                                                                <span>60 mil heavy-duty</span>
                                                                <span>80 mil extreme-duty</span>
                                                            </div>
                                                        </div>

                                                        {/* Molecular weld output */}
                                                        <div className="bg-black/80 border border-rhive-gold/30 p-6 rounded-lg space-y-4">
                                                            <h4 className="text-xs font-black uppercase text-white tracking-widest border-b border-white/5 pb-2 text-rhive-gold">
                                                                GAF Certified Specifications Matrix
                                                            </h4>
                                                            <div className="space-y-3 text-xs font-mono text-gray-300">
                                                                <div className="flex justify-between">
                                                                    <span className="text-gray-500 uppercase">NDL Material Warranty</span>
                                                                    <span className="text-white">{membraneThickness === 50 ? "15-Year No-Dollar-Limit" : membraneThickness === 60 ? "20-Year No-Dollar-Limit" : "30-Year Maximum NDL"}</span>
                                                                </div>
                                                                <div className="flex justify-between">
                                                                    <span className="text-gray-500 uppercase">Solar Reflectance Index (SRI)</span>
                                                                    <span className="text-white">{membraneThickness === 50 ? "94 SRI (Excellent)" : membraneThickness === 60 ? "96 SRI (High-Reflectivity)" : "101 SRI (Maximum Heat Shield)"}</span>
                                                                </div>
                                                                <div className="flex justify-between">
                                                                    <span className="text-gray-500 uppercase">Tensile Strength (ASTM D751)</span>
                                                                    <span className="text-white">{membraneThickness === 50 ? "300 lbf Rating" : membraneThickness === 60 ? "350 lbf Rating" : "440 lbf Ultra-Strength"}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* RIGHT PANEL: Commercial flat roof description */}
                                                    <div className="flex flex-col justify-center space-y-6">
                                                        <h4 className="text-xs font-black uppercase tracking-wider text-gray-400">// Molecular Welded Flat Membrane Architecture</h4>
                                                        <div className="p-6 bg-neutral-900/50 border border-white/5 rounded-xl font-mono text-xs text-gray-400 space-y-4">
                                                            <div className="flex items-center gap-2 text-white font-bold">
                                                                <Award size={16} className="text-rhive-gold" />
                                                                <span className="uppercase text-[10px] tracking-wider text-rhive-gold">Precision Fusion Weld</span>
                                                            </div>
                                                            <p className="leading-relaxed text-[11px]">
                                                                Commercial systems operate under extreme thermal expansion stress. RHIVE uses molecular fusion heat-welded joints. Standard roofing systems rely on glues or seal tapes that decay under UV degradation. By using state-of-the-art automatic hot-air robotic welders, we fuse PVC/TPO membrane sheets into a single, cohesive, molecularly unified sheet spanning your complete decking.
                                                            </p>
                                                            <div className="border-t border-white/5 pt-4 text-[9px] text-gray-500 flex justify-between uppercase">
                                                                <span>ASTM STANDARDS MET: ASTM D4434 / D6878</span>
                                                                <span className="text-rhive-gold font-bold">WELD TEST: OK // 100% MOLECULAR</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </RhiveGenericSection>
                                </div>
                            )}

                            {/* VIRTUAL ESTIMATOR PAGE */}
                            {virtualPage === 'estimator' && (
                                <div className="min-h-screen pt-24">
                                    <RhiveGenericSection glowColor="pink" title="Quantum Pricing Telemetry." subtitle="Open-Book Mathematics // Instant Cost Calculator">
                                        
                                        {/* TELEMETRY CONTROL PANEL & LAYOUT */}
                                        <div className="grid lg:grid-cols-2 gap-12 mt-4 select-none text-left">
                                            
                                            {/* LEFT COLUMN: TELEMETRY INPUTS */}
                                            <div className="space-y-8 bg-neutral-900/40 border border-white/5 p-8 rounded-xl backdrop-blur-md">
                                                <div>
                                                    <span className="text-[10px] font-black tracking-widest text-rhive-pink uppercase">// Scope Telemetry Inputs</span>
                                                    <h3 className="text-xl font-bold uppercase text-white mt-1">Configure Physical Scope</h3>
                                                </div>

                                                {/* Address Intake Simulation */}
                                                <div className="space-y-2">
                                                    <label className="text-[9px] font-mono uppercase text-gray-500 tracking-wider">PROJECT GEOMETRY COORDINATES</label>
                                                    <AddressScanInput id="estimator-local-scanner" />
                                                </div>

                                                {/* Squares Scope Slider */}
                                                <div className="space-y-4">
                                                    <div className="flex justify-between text-xs font-mono text-gray-400">
                                                        <span>Calculated Area: {estimatorSquares} Squares</span>
                                                        <span className="text-rhive-pink font-bold">{estimatorSquares * 100} Sq. Ft.</span>
                                                    </div>
                                                    <input
                                                        type="range"
                                                        min="15"
                                                        max="70"
                                                        value={estimatorSquares}
                                                        onChange={(e) => setEstimatorSquares(parseInt(e.target.value))}
                                                        className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-rhive-pink focus:outline-none"
                                                        style={{
                                                            background: `linear-gradient(to right, #ec028b 0%, #ec028b ${((estimatorSquares - 15) / 55) * 100}%, #262626 ${((estimatorSquares - 15) / 55) * 100}%, #262626 100%)`
                                                        }}
                                                    />
                                                    <div className="flex justify-between text-[9px] font-mono text-gray-500 uppercase tracking-widest mt-1">
                                                        <span>15 SQ (1500 SQ FT)</span>
                                                        <span>70 SQ (7000 SQ FT)</span>
                                                    </div>
                                                </div>

                                                {/* QUALITY TIER SWITCH BUTTON (Zero Checkboxes!) */}
                                                <div className="space-y-3">
                                                    <label className="text-[9px] font-mono uppercase text-gray-500 tracking-wider">MATERIAL SYSTEM GRADE</label>
                                                    <div className="p-1 bg-black border border-white/10 rounded-lg flex relative">
                                                        <button
                                                            onClick={() => setEstimatorGrade('standard')}
                                                            className={cn(
                                                                "flex-1 py-3 text-[10px] font-black uppercase tracking-wider transition-all rounded-md",
                                                                estimatorGrade === 'standard' ? "bg-rhive-pink text-white" : "text-gray-400 hover:text-white"
                                                            )}
                                                        >
                                                            OC Duration Standard (15% Margin)
                                                        </button>
                                                        <button
                                                            onClick={() => setEstimatorGrade('premium')}
                                                            className={cn(
                                                                "flex-1 py-3 text-[10px] font-black uppercase tracking-wider transition-all rounded-md",
                                                                estimatorGrade === 'premium' ? "bg-rhive-pink text-white" : "text-gray-400 hover:text-white"
                                                            )}
                                                        >
                                                            OC Duration Storm SBS (15% Margin)
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* RIGHT COLUMN: RADICAL MATHEMATICAL LEDGER */}
                                            <div className="bg-neutral-900/60 border border-rhive-pink/30 p-8 rounded-xl backdrop-blur-md flex flex-col justify-between shadow-[0_0_30px_rgba(236,2,139,0.1)] relative">
                                                <div className="absolute top-0 right-6 w-16 h-[1px] bg-rhive-pink/55" />
                                                
                                                <div className="space-y-6">
                                                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                                                        <div>
                                                            <span className="text-[9px] font-mono text-rhive-pink uppercase tracking-widest">RHIVE OPEN LEDGER REGISTRY</span>
                                                            <h4 className="text-md font-bold uppercase text-white mt-0.5">Itemized Telemetry Calculation</h4>
                                                        </div>
                                                        <Shield size={18} className="text-rhive-pink" />
                                                    </div>

                                                    {/* COST LEDGER TABLE */}
                                                    <div className="space-y-4 font-mono text-xs text-gray-300">
                                                        <div className="flex justify-between border-b border-white/5 pb-2">
                                                            <span className="text-gray-500 uppercase">Shingles & Materials ({currentGradeDetails.label})</span>
                                                            <span className="text-white">{formatCurrency(estMaterialTotal)}</span>
                                                        </div>
                                                        <div className="flex justify-between border-b border-white/5 pb-2">
                                                            <span className="text-gray-500 uppercase">Tier-1 Shingle Install Labor & Safety</span>
                                                            <span className="text-white">{formatCurrency(estLaborTotal)}</span>
                                                        </div>
                                                        <div className="flex justify-between border-b border-white/5 pb-2">
                                                            <span className="text-gray-500 uppercase">Staging, Dumpsters & Permits Overhead</span>
                                                            <span className="text-white">{formatCurrency(estOverheadTotal)}</span>
                                                        </div>
                                                        <div className="flex justify-between border-b border-white/5 pb-2">
                                                            <span className="text-rhive-pink font-bold uppercase">Platform Operating Margin (Fixed 15%)</span>
                                                            <span className="text-rhive-pink font-bold">{formatCurrency(estMarginAmount)}</span>
                                                        </div>
                                                    </div>

                                                    {/* GLOWING BAR CHART BREAKDOWN */}
                                                    <div className="space-y-2 mt-4">
                                                        <label className="text-[8px] font-mono uppercase text-gray-500 tracking-wider">PROJECT COST DISTRIBUTIONS</label>
                                                        <div className="h-4 w-full bg-white/5 rounded-sm overflow-hidden flex border border-white/5">
                                                            <div 
                                                                className="h-full bg-rhive-pink/85" 
                                                                style={{ width: `${(estMaterialTotal / estCeilingPrice) * 100}%` }} 
                                                                title="Materials"
                                                            />
                                                            <div 
                                                                className="h-full bg-rhive-blue/85 border-l border-black" 
                                                                style={{ width: `${(estLaborTotal / estCeilingPrice) * 100}%` }}
                                                                title="Labor"
                                                            />
                                                            <div 
                                                                className="h-full bg-rhive-gold/85 border-l border-black" 
                                                                style={{ width: `${(estOverheadTotal / estCeilingPrice) * 100}%` }}
                                                                title="Overhead"
                                                            />
                                                            <div 
                                                                className="h-full bg-white/20 border-l border-black" 
                                                                style={{ width: `${(estMarginAmount / estCeilingPrice) * 100}%` }}
                                                                title="Platform Margin"
                                                            />
                                                        </div>
                                                        <div className="flex justify-between text-[8px] font-mono text-gray-500 uppercase mt-1">
                                                            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-rhive-pink rounded-sm" /> Materials ({(estMaterialTotal / estCeilingPrice * 100).toFixed(0)}%)</span>
                                                            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-rhive-blue rounded-sm" /> Labor ({(estLaborTotal / estCeilingPrice * 100).toFixed(0)}%)</span>
                                                            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-rhive-gold rounded-sm" /> Overhead ({(estOverheadTotal / estCeilingPrice * 100).toFixed(0)}%)</span>
                                                            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-white/20 rounded-sm" /> Margin (15%)</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* GRAND TOTAL PRICE */}
                                                <div className="mt-8 bg-black border border-rhive-pink/30 p-6 rounded-lg text-center relative overflow-hidden">
                                                    <span className="text-[8px] font-mono text-rhive-pink uppercase tracking-widest block mb-1">
                                                        // Net Platforms Retail Ceiling Price
                                                    </span>
                                                    <span className="text-4xl md:text-5xl font-black text-white font-mono tracking-tighter drop-shadow-[0_0_10px_rgba(236,2,139,0.3)]">
                                                        {formatCurrency(estCeilingPrice)}
                                                    </span>
                                                    <div className="mt-3 border-t border-white/5 pt-3 text-[9px] font-mono text-gray-500 uppercase tracking-widest">
                                                        Formula: Retail = Floor Cost / (1 - 0.15)
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </RhiveGenericSection>
                                </div>
                            )}

                        </main>
                    </motion.div>
                ) : (
                    <motion.div
                        key="live"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex-grow w-full h-full relative z-10"
                    >
                        {/* RE-ENTRY AVATAR (Top Left) */}
                        <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ scale: 1.1 }}
                            onClick={() => setActivePageId('P-00')}
                            className="fixed top-6 left-6 z-[2000] w-12 h-12 rounded-full bg-black/80 backdrop-blur-xl border border-white/10 flex items-center justify-center group shadow-2xl"
                        >
                            <div className="relative">
                                <UserIcon className="w-5 h-5 text-white/40 group-hover:text-rhive-pink transition-colors" />
                                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rhive-pink rounded-full animate-pulse-glow" />
                            </div>
                        </motion.button>

                        <iframe
                            src="https://www.rhiveconstruction.com/"
                            className="w-full h-full border-none min-h-screen"
                            title="Current RHIVE Website"
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CurrentWebsitePage;
