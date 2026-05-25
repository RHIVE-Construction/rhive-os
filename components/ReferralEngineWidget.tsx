import React from 'react';
import Card from './Card';
import { StarIcon, ShareIcon, ChatBubbleLeftRightIcon, EnvelopeIcon } from './icons';

const ReferralEngineWidget: React.FC = () => {
    return (
        <Card title="Referral Engine" className="relative overflow-hidden group">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#ec028b]/10 to-transparent pointer-events-none" />

            <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
                <div className="flex-shrink-0 bg-black/40 p-4 rounded-xl border border-white/10 relative">
                    <div className="absolute inset-0 bg-[#ec028b]/20 blur-xl rounded-full"></div>
                    <StarIcon className="w-12 h-12 text-[#ec028b] relative z-10" />
                </div>
                
                <div className="flex-grow text-center md:text-left">
                    <h3 className="text-2xl font-bold text-white mb-1"><span className="text-[#00D1FF]">Share & Earn</span> $350</h3>
                    <p className="text-gray-400 text-sm max-w-md">
                        Know someone who needs a roof? Send them your unique link. When their project installs, you get $350 instant cash.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <button className="flex items-center justify-center gap-2 bg-[#ec028b] hover:bg-[#ec028b]/80 text-white px-5 py-2.5 rounded text-sm font-bold transition-all shadow-[0_0_15px_rgba(236,2,139,0.3)] hover:shadow-[0_0_25px_rgba(236,2,139,0.5)]">
                        <ChatBubbleLeftRightIcon className="w-4 h-4" />
                        Text Link
                    </button>
                    <button className="flex items-center justify-center gap-2 border border-white/20 hover:border-[#00D1FF] hover:text-[#00D1FF] bg-black/30 text-white px-5 py-2.5 rounded text-sm font-bold transition-all">
                        <EnvelopeIcon className="w-4 h-4" />
                        Email Link
                    </button>
                </div>
            </div>
            
            {/* Stats Footer */}
            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-gray-500 font-mono">
                <span>Total Earned: $0.00</span>
                <span>Clicks: 0</span>
                <span className="flex items-center gap-1 text-[#00D1FF]">
                    <ShareIcon className="w-3 h-3" /> rhive.com/ref/MR849
                </span>
            </div>
        </Card>
    );
};

export default ReferralEngineWidget;
