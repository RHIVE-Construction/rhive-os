
import React from 'react';
import PageContainer from '../components/PageContainer';
import Card from '../components/Card';
import { CurrencyDollarIcon, BoltIcon, ShieldCheckIcon, ArrowRightIcon } from '../components/icons';

const FinancingPage: React.FC = () => {
    return (
        <PageContainer
            title="Savings & Financing"
            description="RHIVE Project Savings Promotion (RPSP) and customer-centric payment options."
        >
            {/* RPSP Promo Header */}
            <div
                className="relative p-8 md:p-12 bg-gray-900 border border-[#ec028b]/50 shadow-pink-glow overflow-hidden mb-12 isolate"
                style={{ clipPath: 'polygon(32px 0, 100% 0, 100% calc(100% - 32px), calc(100% - 32px) 100%, 0 100%, 0 32px)' }}
            >
                <div className="absolute top-0 right-0 p-32 bg-[#ec028b] rounded-full blur-[120px] opacity-10 -mr-16 -mt-16" />
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="max-w-xl">
                        <div className="flex items-center gap-2 mb-4">
                            <BoltIcon className="w-5 h-5 text-pink-500" />
                            <span className="text-[#ec028b] text-xs font-black uppercase tracking-[0.4em]">Exclusive Initiative</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4 font-display italic leading-none">RHIVE Project Savings Promotion</h2>
                        <p className="text-gray-300 leading-relaxed mb-6 font-serif text-lg italic">
                            Our RPSP rewards administrative efficiency. By committing within the 48-hour data window, we bypass logistics overhead and pass those savings directly to you.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <div className="bg-black/50 border border-pink-500/30 px-6 py-4" style={{ clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)' }}>
                                <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Residential Credit</p>
                                <p className="text-2xl font-black text-white">10% OFF</p>
                            </div>
                            <div className="bg-black/50 border border-pink-500/30 px-6 py-4" style={{ clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)' }}>
                                <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Commercial Credit</p>
                                <p className="text-2xl font-black text-white">UP TO $3,000</p>
                            </div>
                        </div>
                    </div>
                    <div
                        className="bg-black/60 border border-gray-800 p-8 text-center backdrop-blur-xl w-full md:w-80"
                        style={{ clipPath: 'polygon(24px 0, 100% 0, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0 100%, 0 24px)' }}
                    >
                        <h3 className="text-white font-bold uppercase mb-2 font-display">Promotion Logic</h3>
                        <p className="text-rhive-pink font-black text-4xl mb-4 animate-pulse">48 HRS</p>
                        <p className="text-xs text-[var(--rhive-text-muted)] leading-relaxed mb-6 font-serif italic">
                            Commit within 48 hours of your Certified Quote to activate the RPSP discount.
                        </p>
                        <div className="p-3 bg-[#ec028b]/10 border border-[#ec028b]/30 flex items-center gap-3 text-left">
                            <ShieldCheckIcon className="w-5 h-5 text-[#ec028b]" />
                            <p className="text-[10px] text-white font-medium uppercase tracking-tight">3-Day Right to Rescind (UTAH)</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Payment Schedule */}
            <div className="mb-12">
                <h3 className="text-2xl font-black text-[var(--rhive-text)] uppercase tracking-widest text-center mb-10 font-display">Investment Schedule</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { step: "50%", label: "At Sign-Off", desc: "Initial investment required to approve permits and trigger material procurement." },
                        { step: "40%", label: "Material Drop", desc: "Second investment due upon substantial staging of materials and site mobilization." },
                        { step: "10%", label: "Final Approval", desc: "Final balance due only upon 100% project completion and total client satisfaction." }
                    ].map((s, i) => (
                        <Card key={i} className="text-center group">
                            <div className="text-4xl font-black text-rhive-pink mb-4 group-hover:scale-110 transition-transform font-display italic">{s.step}</div>
                            <h4 className="text-[var(--rhive-text)] font-bold uppercase tracking-tight mb-2 font-display">{s.label}</h4>
                            <p className="text-[var(--rhive-text-muted)] text-sm leading-relaxed font-serif italic">{s.desc}</p>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Financing CTA */}
            <Card className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex gap-6 items-start">
                    <CurrencyDollarIcon className="w-10 h-10 text-rhive-pink mt-1" />
                    <div>
                        <h3 className="text-3xl font-black text-[var(--rhive-text)] uppercase tracking-tight font-display italic leading-none mb-4">Hassle-Free Financing</h3>
                        <p className="text-[var(--rhive-text-muted)] max-w-xl font-serif italic">
                            Starting as low as 4.99% APR with options for $0 Down. Get pre-qualified instantly
                            without impacting your credit score.
                        </p>
                    </div>
                </div>
                <button className="whitespace-nowrap px-10 py-5 bg-rhive-pink text-white font-black uppercase tracking-widest text-xs shadow-pink-glow hover:shadow-[0_0_40px_rgba(236,2,139,0.5)] transition-all flex items-center">
                    Prequalify Now
                    <ArrowRightIcon className="w-5 h-5 ml-3" />
                </button>
            </Card>
        </PageContainer>
    );
};

export default FinancingPage;
