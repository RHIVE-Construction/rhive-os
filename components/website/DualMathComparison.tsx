import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, HelpCircle, Eye, EyeOff, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { cn } from '../../lib/utils';

const DualMathComparison: React.FC = () => {
    // Interactive state for roof size (squares)
    const [squares, setSquares] = useState<number>(30);
    const [revealFormula, setRevealFormula] = useState<boolean>(false);

    // Cost Constants (Per Square)
    const MATERIAL_COST_PER_SQ = 185; // Owens Corning Duration
    const LABOR_COST_PER_SQ = 140;    // Tier-1 Certified
    const OVERHEAD_PER_SQ = 45;       // Staging & Permits
    const TARGET_MARGIN = 0.15;       // Standard 15% Platform Margin

    // Standard Legacy Contractor Estimations
    const LEGACY_COST_PER_SQ = 520;   // Invoiced bloated cost
    const LEGACY_SALES_COMMISSION = 0.12; // 12% hidden commission
    
    // Calculations
    const rhiveFloorCost = (MATERIAL_COST_PER_SQ + LABOR_COST_PER_SQ + OVERHEAD_PER_SQ) * squares;
    const rhiveCeilingPrice = Math.round(rhiveFloorCost / (1 - TARGET_MARGIN));
    const rhiveMarginAmount = Math.round(rhiveCeilingPrice - rhiveFloorCost);

    const legacyPrice = LEGACY_COST_PER_SQ * squares;
    const legacyCommissionAmount = Math.round(legacyPrice * LEGACY_SALES_COMMISSION);
    const consumerSavings = legacyPrice - rhiveCeilingPrice;

    // Formatting helpers
    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(val);
    };

    return (
        <section id="dual-math" className="py-24 px-6 md:px-12 w-full bg-black relative isolate select-none">
            
            {/* Background Tech Mesh Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-rhive-pink/5 blur-[120px] pointer-events-none -z-10 animate-pulse" />

            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 border border-rhive-pink/30 px-4 py-1.5 rounded-full bg-rhive-pink/5 mb-4 shadow-[0_0_15px_rgba(236,2,139,0.15)]">
                        <Shield className="w-3.5 h-3.5 text-rhive-pink" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">
                            Dual-Math Financial Protocol
                        </span>
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white mb-4">
                        The Pricing Revolution.
                    </h2>
                    <p className="text-gray-400 font-sans text-sm md:text-md max-w-xl mx-auto leading-relaxed">
                        Integrity starts with open math. Adjust the slider to see how traditional markup scales compared to our flat-margin algorithms.
                    </p>
                </div>

                {/* SQUARES SLIDER - Zero Checkboxes, Premium slider block */}
                <div className="max-w-3xl mx-auto mb-16 bg-neutral-900/60 border border-white/5 p-8 rounded-xl backdrop-blur-xl relative isolate">
                    <div className="absolute top-0 right-0 w-24 h-[1px] bg-rhive-pink/40" />
                    <div className="absolute bottom-0 left-0 w-24 h-[1px] bg-[#00ffff]/40" />
                    
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
                        <div className="text-left">
                            <span className="text-[10px] font-black tracking-[0.2em] text-rhive-pink uppercase block mb-1">
                                // Step 01: Input Scope
                            </span>
                            <h3 className="text-lg font-bold text-white uppercase tracking-wide">
                                Approximate Roof Area
                            </h3>
                        </div>
                        <div className="flex items-baseline gap-2 bg-black border border-white/10 px-6 py-3 rounded shadow-inner">
                            <span className="text-3xl font-black text-white font-mono">{squares}</span>
                            <span className="text-xs font-mono text-gray-500 uppercase tracking-widest">SQ (Squares)</span>
                        </div>
                    </div>

                    <div className="relative flex items-center mt-8">
                        <input
                            type="range"
                            min="15"
                            max="60"
                            value={squares}
                            onChange={(e) => setSquares(parseInt(e.target.value))}
                            className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-rhive-pink focus:outline-none"
                            style={{
                                background: `linear-gradient(to right, #ec028b 0%, #ec028b ${((squares - 15) / 45) * 100}%, #262626 ${((squares - 15) / 45) * 100}%, #262626 100%)`
                            }}
                        />
                    </div>
                    
                    <div className="flex justify-between text-[10px] font-mono text-gray-600 uppercase tracking-widest mt-4">
                        <span>15 SQ (Min)</span>
                        <span className="text-rhive-pink animate-pulse">Scope Scale: {squares * 100} Sq. Ft.</span>
                        <span>60 SQ (Max)</span>
                    </div>
                </div>

                {/* Side-by-Side Comparison Cards */}
                <div className="grid md:grid-cols-2 gap-8 items-stretch max-w-5xl mx-auto">
                    
                    {/* LEFT CARD: Legacy "Black Box" Contractor */}
                    <div className="flex flex-col bg-neutral-905/30 border border-white/5 backdrop-blur-md relative overflow-hidden group select-none"
                        style={{ clipPath: 'polygon(24px 0, 100% 0, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0 100%, 0 24px)' }}
                    >
                        {/* Red Accent Base lines */}
                        <div className="absolute top-0 left-0 w-8 h-[1px] bg-red-500/20" />
                        <div className="absolute top-0 left-0 h-8 w-[1px] bg-red-500/20" />

                        <div className="p-8 flex flex-col h-full">
                            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
                                <span className="text-[10px] font-black tracking-widest text-red-500/60 uppercase">
                                    Legacy Structure
                                </span>
                                <AlertTriangle className="w-4 h-4 text-red-500/60" />
                            </div>

                            <h3 className="text-xl font-bold uppercase tracking-tight text-white mb-2 text-left">
                                Traditional Quote
                            </h3>
                            <p className="text-xs text-gray-500 text-left mb-6 font-serif italic">
                                A single, inflated number hiding heavy markups and salesman high commissions.
                            </p>

                            <div className="bg-black/80 border border-red-500/20 p-6 rounded-lg text-center shadow-inner mb-6 flex-grow flex flex-col justify-center">
                                <span className="text-[9px] font-mono text-red-500 uppercase tracking-widest block mb-2">
                                    // Total Retail Cost
                                </span>
                                <span className="text-4xl md:text-5xl font-black text-white font-mono tracking-tighter">
                                    {formatCurrency(legacyPrice)}
                                </span>
                                <div className="mt-4 border-t border-white/5 pt-4 text-[10px] font-mono text-gray-500 uppercase tracking-wider">
                                    Status: Cost Non-Itemized
                                </div>
                            </div>

                            {/* Itemized "Lack of Information" display */}
                            <div className="space-y-3 text-left">
                                {[
                                    { label: 'Raw Material Allocation', val: 'Proprietary' },
                                    { label: 'Certified Installer Fee', val: 'Undisclosed' },
                                    { label: 'Operational Overhead', val: 'Vague Markup' },
                                    { label: 'Hidden Salesman Commission', val: formatCurrency(legacyCommissionAmount) }
                                ].map((item, i) => (
                                    <div key={i} className="flex justify-between items-center text-xs border-b border-white/5 pb-2">
                                        <span className="text-gray-500 uppercase font-mono tracking-wider text-[10px]">{item.label}</span>
                                        <span className="font-mono text-white/40">{item.val}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT CARD: The RHIVE Way (Pink accent glows, Glassmorphic) */}
                    <div className="flex flex-col bg-neutral-900/60 border border-rhive-pink/30 backdrop-blur-md relative overflow-hidden group shadow-[0_0_30px_rgba(236,2,139,0.1)] select-none"
                        style={{ clipPath: 'polygon(24px 0, 100% 0, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0 100%, 0 24px)' }}
                    >
                        {/* Pink Accent Base lines */}
                        <div className="absolute top-0 left-0 w-8 h-[1px] bg-rhive-pink/40" />
                        <div className="absolute top-0 left-0 h-8 w-[1px] bg-rhive-pink/40" />
                        <div className="absolute bottom-0 right-0 w-8 h-[1px] bg-rhive-pink/40" />
                        <div className="absolute bottom-0 right-0 h-8 w-[1px] bg-rhive-pink/40" />

                        <div className="p-8 flex flex-col h-full">
                            <div className="flex items-center justify-between border-b border-rhive-pink/20 pb-4 mb-6">
                                <span className="text-[10px] font-black tracking-widest text-rhive-pink uppercase">
                                    RHIVE QOS Protocol
                                </span>
                                <CheckCircle2 className="w-4 h-4 text-rhive-pink" />
                            </div>

                            <h3 className="text-xl font-bold uppercase tracking-tight text-white mb-2 text-left">
                                Transparent Math
                            </h3>
                            <p className="text-xs text-gray-400 text-left mb-6 font-serif italic">
                                Open calculation of raw materials, labor, overhead, and our fixed platform margin.
                            </p>

                            <div className="bg-black/90 border border-rhive-pink/30 p-6 rounded-lg text-center shadow-[0_0_20px_rgba(236,2,139,0.15)] mb-6 flex-grow flex flex-col justify-center relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-tr from-rhive-pink/5 to-transparent pointer-events-none" />
                                <span className="text-[9px] font-mono text-rhive-pink uppercase tracking-widest block mb-2">
                                    // Certified Retail ceiling
                                </span>
                                <span className="text-4xl md:text-5xl font-black text-white font-mono tracking-tighter drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">
                                    {formatCurrency(rhiveCeilingPrice)}
                                </span>
                                <div className="mt-4 border-t border-rhive-pink/20 pt-4 text-[10px] font-mono text-rhive-pink uppercase tracking-widest flex items-center justify-center gap-1">
                                    <span className="h-1.5 w-1.5 rounded-full bg-rhive-pink animate-ping" />
                                    Net Savings: {formatCurrency(consumerSavings)}
                                </div>
                            </div>

                            {/* Itemized "Transparent" display */}
                            <div className="space-y-3 text-left">
                                {[
                                    { label: `Owens Corning Materials ($${MATERIAL_COST_PER_SQ}/SQ)`, val: formatCurrency(MATERIAL_COST_PER_SQ * squares) },
                                    { label: `Tier-1 Certified Labor ($${LABOR_COST_PER_SQ}/SQ)`, val: formatCurrency(LABOR_COST_PER_SQ * squares) },
                                    { label: `Staging & Permit Overhead ($${OVERHEAD_PER_SQ}/SQ)`, val: formatCurrency(OVERHEAD_PER_SQ * squares) },
                                    { label: 'Platform Margin (Fixed 15%)', val: formatCurrency(rhiveMarginAmount), color: 'text-rhive-pink font-bold' }
                                ].map((item, i) => (
                                    <div key={i} className="flex justify-between items-center text-xs border-b border-white/5 pb-2">
                                        <span className="text-gray-400 uppercase font-mono tracking-wider text-[9px]">{item.label}</span>
                                        <span className={cn("font-mono text-white", item.color)}>{item.val}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* FORMULA REVEAL TOGGLE - Zero checkboxes, Premium HSL switch button layout */}
                <div className="max-w-xl mx-auto mt-16 text-center">
                    <button
                        onClick={() => setRevealFormula(!revealFormula)}
                        className={cn(
                            "group inline-flex items-center gap-3 px-8 py-4 border border-white/10 rounded-full hover:border-rhive-pink/50 transition-all font-mono uppercase text-[10px] tracking-widest",
                            revealFormula ? "bg-rhive-pink/10 text-white border-rhive-pink/30" : "bg-neutral-900/60 text-gray-400 hover:text-white"
                        )}
                    >
                        <span>{revealFormula ? "Hide Architecture Formula" : "Deconstruct Algorithm Formula"}</span>
                        <HelpCircle className={cn("w-4 h-4 transition-transform", revealFormula ? "rotate-180 text-rhive-pink" : "text-gray-400")} />
                    </button>

                    <motion.div
                        initial={false}
                        animate={{ height: revealFormula ? 'auto' : 0, opacity: revealFormula ? 1 : 0 }}
                        className="overflow-hidden mt-6 text-left"
                    >
                        <div className="bg-neutral-900/50 border border-white/5 p-6 rounded-lg font-mono text-xs text-gray-400 space-y-4">
                            <p className="text-white font-bold uppercase tracking-wider text-[10px] mb-2 text-rhive-pink">
                                // The Algorithm Math (Dual-Math Engine Specification)
                            </p>
                            <p>
                                standard contractors bundle pricing into a subjective "black box" total based on consumer income indicators. RHIVE relies on the transparent Dual-Math model:
                            </p>
                            <div className="bg-black/90 p-4 border border-white/10 text-white rounded text-center">
                                <code className="text-[11px] md:text-sm font-bold text-[#00ffff]">
                                    Retail Ceiling = (Material + Labor + Overhead) / (1 - TargetMargin)
                                </code>
                            </div>
                            <ul className="list-disc pl-5 space-y-1 text-[11px]">
                                <li><strong>Material:</strong> Owens Corning Duration Class-A system components calculated on satellite square metrics.</li>
                                <li><strong>Labor:</strong> Fixed local certified wage schedules, bypassing sales rep cuts.</li>
                                <li><strong>Overhead:</strong> Strictly tracked local permit and physical site staging fees.</li>
                                <li><strong>Margin:</strong> Standardised 15% platform support margin, which supports our Lifetime No-Leak Warranty.</li>
                            </ul>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default DualMathComparison;
