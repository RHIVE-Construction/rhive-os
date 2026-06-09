import React, { useState, useEffect } from 'react';

const FinancingCalculator: React.FC = () => {
    const [amount, setAmount] = useState<number>(25000);
    const [apr, setApr] = useState<number>(9.99);
    const [term, setTerm] = useState<number>(60);
    const [monthlyPayment, setMonthlyPayment] = useState<number>(0);

    useEffect(() => {
        const principal = amount;
        const rate = (apr / 100) / 12;
        const n = term;

        if (rate === 0) {
            setMonthlyPayment(principal / n);
        } else {
            const payment = (principal * rate * Math.pow(1 + rate, n)) / (Math.pow(1 + rate, n) - 1);
            setMonthlyPayment(payment);
        }
    }, [amount, apr, term]);

    // Format currency
    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
    };

    return (
        <div className="relative p-8 md:p-12 bg-[#050505] border border-white/5 shadow-[0_0_30px_rgba(8,19,124,0.1)] isolate flex flex-col md:flex-row gap-12 items-center"
             style={{ clipPath: 'polygon(32px 0, 100% 0, 100% calc(100% - 32px), calc(100% - 32px) 100%, 0 100%, 0 32px)' }}>
            
            {/* Background glowing orbs */}
            <div className="absolute top-0 right-0 p-32 bg-rhive-blue rounded-full blur-[120px] opacity-10 -mr-16 -mt-16 pointer-events-none" />
            <div className="absolute bottom-0 left-0 p-32 bg-[var(--rhive-pink)] rounded-full blur-[120px] opacity-5 -ml-16 -mb-16 pointer-events-none" />

            {/* Sliders Container */}
            <div className="flex-1 w-full space-y-8 z-10">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-2 h-2 bg-[var(--rhive-pink)] shadow-pink-glow-sm"></div>
                    <h3 className="text-xl font-bold text-white uppercase tracking-widest font-sans">Payment Configurator</h3>
                </div>

                {/* Amount Slider */}
                <div className="space-y-4">
                    <div className="flex justify-between items-end">
                        <label className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-wider font-mono">Project Amount</label>
                        <div className="text-2xl font-black text-white bg-white/5 px-4 py-1 border border-white/10 rounded-sm font-mono">
                            {formatCurrency(amount)}
                        </div>
                    </div>
                    <input
                        type="range"
                        min="1000"
                        max="200000"
                        step="1000"
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-[var(--rhive-pink)]"
                    />
                    <div className="flex justify-between text-xs text-gray-600 font-mono">
                        <span>$1,000</span>
                        <span>$200,000</span>
                    </div>
                </div>

                {/* APR Slider */}
                <div className="space-y-4">
                    <div className="flex justify-between items-end">
                        <label className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-wider font-mono">Estimated APR</label>
                        <div className="text-2xl font-black text-white bg-white/5 px-4 py-1 border border-white/10 rounded-sm font-mono">
                            {apr.toFixed(2)}%
                        </div>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="29.99"
                        step="0.01"
                        value={apr}
                        onChange={(e) => setApr(Number(e.target.value))}
                        className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-[var(--rhive-pink)]"
                    />
                    <div className="flex justify-between text-xs text-gray-600 font-mono">
                        <span>0%</span>
                        <span>29.99%</span>
                    </div>
                </div>

                {/* Term Slider */}
                <div className="space-y-4">
                    <div className="flex justify-between items-end">
                        <label className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-wider font-mono">Term Length</label>
                        <div className="text-2xl font-black text-white bg-white/5 px-4 py-1 border border-white/10 rounded-sm font-mono">
                            {term} Months
                        </div>
                    </div>
                    <input
                        type="range"
                        min="12"
                        max="144"
                        step="12"
                        value={term}
                        onChange={(e) => setTerm(Number(e.target.value))}
                        className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-[var(--rhive-pink)]"
                    />
                    <div className="flex justify-between text-xs text-gray-600 font-mono">
                        <span>12 Mos</span>
                        <span>144 Mos</span>
                    </div>
                </div>
            </div>

            {/* Result Container */}
            <div className="w-full md:w-96 bg-black/60 border border-rhive-blue/30 p-8 backdrop-blur-xl relative group"
                 style={{ clipPath: 'polygon(24px 0, 100% 0, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0 100%, 0 24px)' }}>
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-rhive-blue to-transparent opacity-50"></div>
                
                <div className="text-center">
                    <h4 className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-widest mb-6 font-mono">Estimated Min. Monthly Payment</h4>
                    
                    <div className="text-5xl md:text-6xl font-black bg-gradient-to-t from-rhive-blue to-white bg-clip-text text-transparent mb-8 tracking-tighter drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                        {formatCurrency(monthlyPayment)}<span className="text-2xl text-gray-500">/mo</span>
                    </div>

                    <a 
                        href="https://www.enhancify.com/rhive" 
                        target="_blank" 
                        rel="noreferrer"
                        className="block w-full py-4 px-6 bg-gradient-to-r from-rhive-blue to-[#1a2b9e] text-white font-black uppercase tracking-[0.2em] text-sm shadow-[0_0_20px_rgba(8,19,124,0.4)] hover:shadow-[0_0_30px_rgba(8,19,124,0.6)] hover:scale-[1.02] transition-all duration-300 border border-blue-400/20"
                        style={{ clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)' }}
                    >
                        Qualify Now
                    </a>
                    
                    <p className="text-xs text-gray-500 mt-6 font-sans italic max-w-[250px] mx-auto text-balance">
                        *Estimates only. Final terms are subject to credit approval by Enhancify.
                    </p>
                </div>
            </div>

        </div>
    );
};

export default FinancingCalculator;
