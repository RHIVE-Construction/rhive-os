import React, { useState, useMemo } from 'react';
import { useNavigation } from '../contexts/NavigationContext';
import { CircuitryBackground } from '../components/CircuitryBackground';
import Button from '../components/Button';
import Card from '../components/Card';
import {
    CurrencyDollarIcon,
    ChartBarIcon,
    ShieldCheckIcon,
    ChevronLeftIcon,
    CheckIcon,
} from '../components/icons';
import { cn } from '../lib/utils';

export type Tier = 'Scout' | 'Builder' | 'Lead' | 'Mentor';
export type Role = 'Sales + PM' | 'Sales Only' | 'PM Only';

interface CommissionRates {
    deposit: number;
    completion: number;
    total: number;
}

const RATES: Record<Tier, Record<Role, { deposit: number; completion: number }>> = {
    Scout: {
        'Sales Only': { deposit: 0.105, completion: 0.045 },
        'PM Only': { deposit: 0.105, completion: 0.045 },
        'Sales + PM': { deposit: 0.15, completion: 0.15 },
    },
    Builder: {
        'Sales Only': { deposit: 0.14, completion: 0.06 },
        'PM Only': { deposit: 0.14, completion: 0.06 },
        'Sales + PM': { deposit: 0.20, completion: 0.20 },
    },
    Lead: {
        'Sales Only': { deposit: 0.175, completion: 0.075 },
        'PM Only': { deposit: 0.175, completion: 0.075 },
        'Sales + PM': { deposit: 0.25, completion: 0.25 },
    },
    Mentor: {
        'Sales Only': { deposit: 0.21, completion: 0.09 },
        'PM Only': { deposit: 0.21, completion: 0.09 },
        'Sales + PM': { deposit: 0.30, completion: 0.30 },
    },
};

const formatUSD = (val: number): string => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
    }).format(isNaN(val) ? 0 : val);
};

export const CommissionCompassPage: React.FC = () => {
    const { setActivePageId } = useNavigation();

    // Form State
    const [contractValue, setContractValue] = useState<number>(38500);
    const [directCosts, setDirectCosts] = useState<number>(24200);
    const [selectedTier, setSelectedTier] = useState<Tier>('Builder');
    const [selectedRole, setSelectedRole] = useState<Role>('Sales + PM');

    // Math Engine
    const calculations = useMemo(() => {
        const grossProfit = Math.max(0, contractValue - directCosts);
        const gpPercent = contractValue > 0 ? (grossProfit / contractValue) * 100 : 0;

        // Tiered Company Retention
        let retention = 0;
        let remainingVal = contractValue;
        if (remainingVal > 150000) {
            retention += (remainingVal - 150000) * 0.03;
            remainingVal = 150000;
        }
        if (remainingVal > 50000) {
            retention += (remainingVal - 50000) * 0.02;
            remainingVal = 50000;
        }
        if (remainingVal > 0) {
            retention += 1000;
        }

        const commissionableGrossProfit = Math.max(0, grossProfit - retention);

        const rateObj = RATES[selectedTier][selectedRole];
        const rates: CommissionRates = {
            deposit: rateObj.deposit,
            completion: rateObj.completion,
            total: rateObj.deposit + rateObj.completion,
        };

        const commissionDeposit = commissionableGrossProfit * rates.deposit;
        const commissionCompletion = commissionableGrossProfit * rates.completion;
        const totalCommission = commissionDeposit + commissionCompletion;
        const companyRetainedNet = grossProfit - totalCommission;

        // GP Health
        let healthLabel = 'Low';
        let healthColor = 'text-rose-400 bg-rose-500/10 border-rose-500/30';
        if (gpPercent >= 35) {
            healthLabel = 'Excellent';
            healthColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
        } else if (gpPercent >= 25) {
            healthLabel = 'Good';
            healthColor = 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30';
        } else if (gpPercent >= 15) {
            healthLabel = 'Average';
            healthColor = 'text-amber-400 bg-amber-500/10 border-amber-500/30';
        }

        return {
            grossProfit,
            gpPercent,
            retention,
            commissionableGrossProfit,
            rates,
            commissionDeposit,
            commissionCompletion,
            totalCommission,
            companyRetainedNet,
            healthLabel,
            healthColor,
        };
    }, [contractValue, directCosts, selectedTier, selectedRole]);

    return (
        <div className="min-h-screen bg-slate-950 text-white relative flex flex-col font-sans">
            <CircuitryBackground />

            {/* Header */}
            <header className="relative z-10 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setActivePageId('E-16')}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                        title="Back to Income Actionator"
                    >
                        <ChevronLeftIcon className="w-5 h-5" />
                    </button>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded bg-amber-500/20 text-amber-400 border border-amber-500/40">
                                FINANCIAL CONTROL E-17
                            </span>
                            <span className="text-xs text-slate-400 font-mono">Precision Compensation Engine</span>
                        </div>
                        <h1 className="text-2xl font-extrabold tracking-tight text-white mt-0.5">Commission Compass</h1>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setActivePageId('E-16')}
                        className="px-3 py-1.5 rounded text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
                    >
                        Income Actionator (E-16)
                    </button>
                    <button
                        onClick={() => setActivePageId('A-03')}
                        className="px-3 py-1.5 rounded text-xs font-semibold bg-pink-600/20 hover:bg-pink-600/30 text-pink-400 border border-pink-500/40 transition"
                    >
                        Estimate Pricing (A-03)
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column: Inputs & Tier Controls */}
                <div className="lg:col-span-5 space-y-6">
                    {/* Project Deal Inputs */}
                    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl">
                        <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2 mb-4">
                            <CurrencyDollarIcon className="w-4 h-4 text-emerald-400" />
                            Project Deal Numbers
                        </h2>

                        <div className="space-y-4 text-xs">
                            <div>
                                <label className="block text-slate-400 mb-1 font-medium">Final Contract Value (Revenue)</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2.5 text-slate-500 font-mono">$</span>
                                    <input
                                        type="number"
                                        value={contractValue}
                                        onChange={(e) => setContractValue(Number(e.target.value))}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 pl-7 pr-3 text-white font-mono text-sm focus:outline-none focus:border-pink-500 transition"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-slate-400 mb-1 font-medium">Direct Project Costs (Materials, Labor, Dumpster)</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2.5 text-slate-500 font-mono">$</span>
                                    <input
                                        type="number"
                                        value={directCosts}
                                        onChange={(e) => setDirectCosts(Number(e.target.value))}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 pl-7 pr-3 text-white font-mono text-sm focus:outline-none focus:border-pink-500 transition"
                                    />
                                </div>
                            </div>

                            {/* Live Gross Profit Health Strip */}
                            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex justify-between items-center">
                                <div>
                                    <div className="text-[10px] text-slate-500 uppercase font-mono">Gross Profit</div>
                                    <div className="text-base font-bold text-white font-mono">{formatUSD(calculations.grossProfit)}</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-[10px] text-slate-500 uppercase font-mono">GP Health</div>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        <span className={cn('px-2 py-0.5 text-xs font-bold rounded border', calculations.healthColor)}>
                                            {calculations.healthLabel} ({calculations.gpPercent.toFixed(1)}%)
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Rep Tier & Role Selectors */}
                    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
                        <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                            <ChartBarIcon className="w-4 h-4 text-amber-400" />
                            Rep Tier & Operational Role
                        </h2>

                        <div>
                            <label className="block text-xs text-slate-400 mb-1.5 font-medium">Select Career Tier</label>
                            <div className="grid grid-cols-4 gap-2">
                                {(['Scout', 'Builder', 'Lead', 'Mentor'] as Tier[]).map((tier) => (
                                    <button
                                        key={tier}
                                        onClick={() => setSelectedTier(tier)}
                                        className={cn(
                                            'py-2 px-1 text-center rounded-lg text-xs font-bold transition border',
                                            selectedTier === tier
                                                ? 'bg-amber-500/20 text-amber-400 border-amber-500/50 shadow-lg shadow-amber-500/10'
                                                : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'
                                        )}
                                    >
                                        {tier}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs text-slate-400 mb-1.5 font-medium">Select Deal Role</label>
                            <div className="grid grid-cols-3 gap-2">
                                {(['Sales + PM', 'Sales Only', 'PM Only'] as Role[]).map((role) => (
                                    <button
                                        key={role}
                                        onClick={() => setSelectedRole(role)}
                                        className={cn(
                                            'py-2 px-1 text-center rounded-lg text-xs font-bold transition border',
                                            selectedRole === role
                                                ? 'bg-pink-500/20 text-pink-400 border-pink-500/50 shadow-lg shadow-pink-500/10'
                                                : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'
                                        )}
                                    >
                                        {role}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-[11px] text-slate-400 space-y-1">
                            <div className="flex justify-between">
                                <span>Active Rate Total:</span>
                                <span className="font-mono font-bold text-amber-400">{(calculations.rates.total * 100).toFixed(1)}% of CGP</span>
                            </div>
                            <div className="flex justify-between text-slate-500">
                                <span>Deposit Split (Estimated):</span>
                                <span className="font-mono">{(calculations.rates.deposit * 100).toFixed(1)}%</span>
                            </div>
                            <div className="flex justify-between text-slate-500">
                                <span>Completion Split (Reconciled):</span>
                                <span className="font-mono">{(calculations.rates.completion * 100).toFixed(1)}%</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Payout Cards & Visual Breakdown */}
                <div className="lg:col-span-7 space-y-6">
                    {/* Hero Commission Payout Card */}
                    <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-xl p-6 shadow-2xl relative overflow-hidden">
                        <div className="absolute right-0 top-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

                        <div className="flex justify-between items-start">
                            <div>
                                <span className="text-[10px] font-mono uppercase font-bold text-amber-400 tracking-wider">
                                    Projected Representative Earnings
                                </span>
                                <div className="text-4xl font-extrabold text-white mt-1 font-mono tracking-tight">
                                    {formatUSD(calculations.totalCommission)}
                                </div>
                                <p className="text-xs text-slate-400 mt-1">
                                    Calculated from {formatUSD(calculations.commissionableGrossProfit)} Commissionable Gross Profit
                                </p>
                            </div>
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                                {selectedTier} • {selectedRole}
                            </span>
                        </div>

                        {/* Split Payout Breakdown */}
                        <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-800">
                            <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                                <span className="text-[10px] uppercase font-mono text-cyan-400 font-bold block">
                                    Deposit Payment (At Sign-Off)
                                </span>
                                <div className="text-xl font-bold text-cyan-300 mt-0.5 font-mono">
                                    {formatUSD(calculations.commissionDeposit)}
                                </div>
                                <span className="text-[10px] text-slate-500">Released upon customer deposit cleared</span>
                            </div>

                            <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                                <span className="text-[10px] uppercase font-mono text-emerald-400 font-bold block">
                                    Completion Payment (At Closeout)
                                </span>
                                <div className="text-xl font-bold text-emerald-300 mt-0.5 font-mono">
                                    {formatUSD(calculations.commissionCompletion)}
                                </div>
                                <span className="text-[10px] text-slate-500">Released upon final invoice & audit passed</span>
                            </div>
                        </div>

                        {/* Deal Anatomy Bar */}
                        <div className="mt-6">
                            <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1.5">
                                <span>Deal Anatomy Breakdown</span>
                                <span>Revenue: {formatUSD(contractValue)}</span>
                            </div>
                            <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden flex">
                                <div
                                    style={{ width: `${contractValue > 0 ? (directCosts / contractValue) * 100 : 0}%` }}
                                    className="bg-slate-600 transition-all"
                                    title={`Direct Costs: ${formatUSD(directCosts)}`}
                                ></div>
                                <div
                                    style={{ width: `${contractValue > 0 ? (calculations.retention / contractValue) * 100 : 0}%` }}
                                    className="bg-pink-600 transition-all"
                                    title={`Company Retention: ${formatUSD(calculations.retention)}`}
                                ></div>
                                <div
                                    style={{ width: `${contractValue > 0 ? (calculations.totalCommission / contractValue) * 100 : 0}%` }}
                                    className="bg-amber-500 transition-all"
                                    title={`Rep Commission: ${formatUSD(calculations.totalCommission)}`}
                                ></div>
                                <div
                                    style={{ width: `${contractValue > 0 ? (calculations.companyRetainedNet / contractValue) * 100 : 0}%` }}
                                    className="bg-emerald-500 transition-all"
                                    title={`Company Net Margin: ${formatUSD(calculations.companyRetainedNet)}`}
                                ></div>
                            </div>
                            <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-600"></span> Hard Costs</span>
                                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-pink-600"></span> Co. Retention</span>
                                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Rep Commission</span>
                                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Co. Net Profit</span>
                            </div>
                        </div>
                    </div>

                    {/* Tier Advancement Guide */}
                    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl">
                        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                            <ShieldCheckIcon className="w-4 h-4 text-cyan-400" />
                            RHIVE Career Advancement Criteria
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                            <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                                <div className="font-bold text-slate-200">1. Scout</div>
                                <div className="text-[10px] text-amber-400 font-mono mt-0.5">30% CGP Base</div>
                                <p className="text-[10px] text-slate-400 mt-1">Entry tier. Focus on lead generation & onboarding.</p>
                            </div>
                            <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                                <div className="font-bold text-slate-200">2. Builder</div>
                                <div className="text-[10px] text-amber-400 font-mono mt-0.5">40% CGP Base</div>
                                <p className="text-[10px] text-slate-400 mt-1">5 signed jobs closed. Independent estimating.</p>
                            </div>
                            <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                                <div className="font-bold text-slate-200">3. Lead</div>
                                <div className="text-[10px] text-amber-400 font-mono mt-0.5">50% CGP Base</div>
                                <p className="text-[10px] text-slate-400 mt-1">$250k annual revenue + quality audit &gt;95%.</p>
                            </div>
                            <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                                <div className="font-bold text-slate-200">4. Mentor</div>
                                <div className="text-[10px] text-amber-400 font-mono mt-0.5">60% CGP Base</div>
                                <p className="text-[10px] text-slate-400 mt-1">$500k+ revenue + active training of 2 Scouts.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CommissionCompassPage;
