import React, { useState } from 'react';
import PageContainer from '../components/PageContainer';
import Card from '../components/Card';
import { Cog6ToothIcon, CreditCardIcon, BriefcaseIcon, UserIcon, ChevronDown } from '../components/icons';
import { PAGE_GROUPS } from '../constants';
import CustomerProjectPulse from '../components/CustomerProjectPulse';
import CustomerActionCenter from '../components/CustomerActionCenter';
import ReferralEngineWidget from '../components/ReferralEngineWidget';

const CustomerHomepage: React.FC = () => {
    const page = PAGE_GROUPS.flatMap(g => g.pages).find(p => p.id === 'C-01');
    const [isCommercial, setIsCommercial] = useState(false); // Toggle for mocking Commercial vs Resi state
    
    return (
        <PageContainer 
            title="Welcome to Your RHIVE Portal" 
            description={page?.description || 'Manage your projects and communicate with us.'}
        >
            {/* Context Switcher (For Property Managers / Commercial) */}
            <div className="flex justify-end mb-6">
                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500 font-mono hidden md:inline-block">Simulate Role:</span>
                    <button 
                        onClick={() => setIsCommercial(!isCommercial)}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest transition-colors border ${isCommercial ? 'bg-gradient-to-b from-white/10 to-rhive-blue/30 border-rhive-blue/50 text-white shadow-[0_0_15px_rgba(8,19,124,0.4)]' : 'bg-transparent border-white/10 text-gray-400 hover:text-white'}`}
                    >
                        {isCommercial ? 'Commercial' : 'Residential'}
                    </button>
                </div>
            </div>

            {isCommercial && (
                <div className="mb-8 p-4 bg-black/40 border border-rhive-blue/40 shadow-[0_0_15px_rgba(8,19,124,0.2)] rounded-lg flex items-center justify-between">
                    <div>
                        <span className="text-xs uppercase tracking-widest bg-gradient-to-t from-rhive-blue to-white bg-clip-text text-transparent font-bold block mb-1">Portfolio Toggle</span>
                        <h2 className="text-white font-mono flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
                            The Waverly HOA <ChevronDown className="w-4 h-4 text-white/50" />
                        </h2>
                    </div>
                </div>
            )}

            {/* 1. The Project Pulse - "Pizza Tracker" */}
            <CustomerProjectPulse />

            {/* 2. The Urgency Grid - Action Center */}
            <CustomerActionCenter />

            {/* Unified Comm Hub & Digital Wallet Entry */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Unified Comm Hub */}
                <Card title="Latest Update" className="border-t border-rhive-blue/40 shadow-[0_-5px_15px_rgba(8,19,124,0.1)]">
                    <div className="flex gap-4">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-b from-white/20 to-rhive-blue/40 border border-rhive-blue/30 flex items-center justify-center">
                            <span className="text-white font-bold">R</span>
                        </div>
                        <div>
                            <p className="text-white text-sm mb-2">"Hi Michael, we've received the approved permits. Scheduling will reach out tomorrow to confirm drop-off dates."</p>
                            <span className="text-xs text-gray-500 font-mono">— RHIVE Team (2 hours ago)</span>
                        </div>
                    </div>
                    <button className="mt-4 w-full py-2 bg-gradient-to-b from-white/5 to-rhive-blue/10 hover:from-white/10 hover:to-rhive-blue/20 text-white text-sm font-bold border border-rhive-blue/20 flex items-center justify-center gap-2 transition-all">
                        <Cog6ToothIcon className="w-4 h-4 text-white/70" /> Message Support
                    </button>
                </Card>

                {/* Digital Wallet Entry */}
                <Card title="Digital Wallet" className="border-t border-[#ec028b]/30">
                     <div className="flex flex-col h-full justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <CreditCardIcon className="w-6 h-6 text-gray-400" />
                                <span className="text-white font-mono">Visa ending in ****4242</span>
                            </div>
                            <p className="text-xs text-gray-500">Auto-pay enabled for final balance.</p>
                        </div>
                        <button className="mt-4 w-full py-2 bg-[#ec028b]/20 hover:bg-[#ec028b]/30 text-[#ec028b] text-sm font-bold border border-[#ec028b]/20 flex items-center justify-center gap-2">
                            <CreditCardIcon className="w-4 h-4" /> Manage Wallet
                        </button>
                     </div>
                </Card>
            </div>

            {/* 3. The Referral Engine / Gamification */}
            <ReferralEngineWidget />

            <div className="grid grid-cols-2 gap-4 mt-8">
                <button className="py-4 bg-black/40 border border-white/5 hover:border-white/20 text-white font-bold rounded flex items-center justify-center gap-2 transition-colors">
                    <BriefcaseIcon className="w-5 h-5" /> View Past Projects
                </button>
                <button className="py-4 bg-black/40 border border-white/5 hover:border-white/20 text-white font-bold rounded flex items-center justify-center gap-2 transition-colors">
                    <UserIcon className="w-5 h-5" /> My Profile
                </button>
            </div>

        </PageContainer>
    );
};

export default CustomerHomepage;