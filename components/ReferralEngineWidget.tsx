import React, { useState } from 'react';
import Card from './Card';
import { StarIcon, ShareIcon, ChatBubbleLeftRightIcon, EnvelopeIcon } from './icons';

const ReferralEngineWidget: React.FC = () => {
    const [copied, setCopied] = useState(false);
    const referralCode = 'MR849';
    const referralUrl = `https://rhiveconstruction.com/ref/${referralCode}`;
    const displayDomain = `rhiveconstruction.com/ref/${referralCode}`;

    const handleTextShare = () => {
        const text = `Get a professional roof inspection or replacement with RHIVE Construction and earn rewards: ${referralUrl}`;
        const smsUrl = `sms:?&body=${encodeURIComponent(text)}`;
        window.open(smsUrl, '_blank');
    };

    const handleEmailShare = () => {
        const subject = 'RHIVE Construction Referral';
        const body = `Hi,\n\nI recommend RHIVE Construction for quality roofing and exterior replacements. You can check them out and request an estimate through my referral link:\n${referralUrl}\n\nBest,`;
        const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.open(mailtoUrl, '_blank');
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(referralUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    };

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
                    <h3 className="text-2xl font-bold text-white mb-1"><span className="bg-gradient-to-t from-rhive-blue to-white bg-clip-text text-transparent">Share & Earn</span> $350</h3>
                    <p className="text-gray-400 text-base max-w-md">
                        Know someone who needs a roof? Send them your unique link. When their project installs, you get $350 instant cash.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <button 
                        onClick={handleTextShare}
                        className="flex items-center justify-center gap-2 bg-[#ec028b] hover:bg-[#ec028b]/80 text-white px-5 py-2.5 rounded text-base font-bold transition-all shadow-[0_0_15px_rgba(236,2,139,0.3)] hover:shadow-[0_0_25px_rgba(236,2,139,0.5)] cursor-pointer"
                    >
                        <ChatBubbleLeftRightIcon className="w-4 h-4" />
                        Text Link
                    </button>
                    <button 
                        onClick={handleEmailShare}
                        className="flex items-center justify-center gap-2 border border-white/20 hover:border-[var(--rhive-blue)] hover:text-white hover:bg-[var(--rhive-blue)]/20 bg-black/30 text-white px-5 py-2.5 rounded text-base font-bold transition-all cursor-pointer"
                    >
                        <EnvelopeIcon className="w-4 h-4" />
                        Email Link
                    </button>
                </div>
            </div>
            
            {/* Stats Footer */}
            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-base text-gray-500 font-mono">
                <span>Total Earned: $0.00</span>
                <span>Clicks: 0</span>
                <button 
                    onClick={handleCopy}
                    title="Click to copy referral link"
                    className="flex items-center gap-1 hover:opacity-80 transition-opacity cursor-pointer text-left"
                >
                    <ShareIcon className="w-3 h-3 text-[var(--rhive-blue)]" /> 
                    <span className="bg-gradient-to-t from-rhive-blue to-white bg-clip-text text-transparent">
                        {copied ? 'Copied to clipboard!' : displayDomain}
                    </span>
                </button>
            </div>
        </Card>
    );
};

export default ReferralEngineWidget;
