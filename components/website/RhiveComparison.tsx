import React from 'react';
import { motion } from 'framer-motion';
import { Check, X, Shield, Zap, Globe, Gauge } from 'lucide-react';
import { cn } from '../../lib/utils';

const ComparisonItem = ({ label, rhive, others }: { label: string, rhive: boolean, others: boolean }) => (
    <div className="grid grid-cols-[2fr_1fr_1fr] gap-4 py-6 border-b border-white/5 items-center group">
        <span className="text-sm font-bold uppercase tracking-widest text-gray-400 group-hover:text-white transition-colors">{label}</span>
        <div className="flex justify-center">
            {rhive ? (
                <div className="w-8 h-8 rounded-full bg-rhive-pink/20 border border-rhive-pink flex items-center justify-center shadow-[0_0_10px_rgba(236,2,139,0.3)]">
                    <Check className="w-4 h-4 text-rhive-pink" />
                </div>
            ) : (
                <X className="w-6 h-6 text-gray-800" />
            )}
        </div>
        <div className="flex justify-center">
            {others ? (
                <Check className="w-6 h-6 text-gray-600" />
            ) : (
                <X className="w-6 h-6 text-gray-800" />
            )}
        </div>
    </div>
);

const RhiveComparison: React.FC = () => {
    return (
        <section className="py-32 bg-black relative">
            <div className="container mx-auto px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4 text-white">THE RHIVE WAY.</h2>
                        <p className="text-rhive-pink text-[10px] font-bold tracking-[0.4em] uppercase">Engineered for Transparency</p>
                    </div>

                    <div className="relative isolate">
                        {/* Header */}
                        <div className="grid grid-cols-[2fr_1fr_1fr] gap-4 pb-8 border-b border-white/10">
                            <span className="text-[10px] font-black tracking-widest text-gray-600 uppercase">Capability / Feature</span>
                            <span className="text-[10px] font-black tracking-widest text-rhive-pink uppercase text-center">RHIVE QOS</span>
                            <span className="text-[10px] font-black tracking-widest text-gray-600 uppercase text-center">Legacy Contractors</span>
                        </div>

                        <ComparisonItem label="AI-Aided Satellite Estimation" rhive={true} others={false} />
                        <ComparisonItem label="Dual-Math Pricing Transparency" rhive={true} others={false} />
                        <ComparisonItem label="Military-Grade Project Management" rhive={true} others={true} />
                        <ComparisonItem label="Real-Time 'Pizza Tracker' Updates" rhive={true} others={false} />
                        <ComparisonItem label="No Hidden Sales Commissions" rhive={true} others={false} />
                        <ComparisonItem label="Automated Warranty Pack Generation" rhive={true} others={false} />

                        {/* Background Glow */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-rhive-pink/5 blur-[120px] -z-10" />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default RhiveComparison;
