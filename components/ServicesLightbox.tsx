import React from 'react';
import { ArrowRightIcon } from './icons';
import { useNavigation } from '../contexts/NavigationContext';

interface ServicesLightboxProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ServicesLightbox: React.FC<ServicesLightboxProps> = ({ isOpen, onClose }) => {
    const { setActivePageId } = useNavigation();

    if (!isOpen) return null;

    const packages = [
        {
            tier: "Standard",
            name: "Duration Package",
            shingle: "Owens Corning Duration Series",
            warranty: "50-Yr Material / 10-Yr Workmanship",
            highlights: [
                "SureNail® Technology & 130 MPH Wind",
                "StreakGuard™ Algae Resistance 25YR",
                "WeatherLock® Waterproofing (6ft)",
                "Full Metal Pipe Jacks (Lifetime)"
            ]
        },
        {
            tier: "Premium Standard",
            name: "Flex Package",
            shingle: "Owens Corning Duration FLEX®",
            warranty: "50-Yr Material / 10-Yr Workmanship",
            highlights: [
                "Class 4 Impact Resistance",
                "Polymer-Modified Asphalt (Flexible)",
                "SureNail® Technology & 130 MPH Wind",
                "Potential Insurance Discounts"
            ],
            recommended: true
        },
        {
            tier: "Designer",
            name: "Designer Package",
            shingle: "GAF Woodland® Designer",
            warranty: "50-Yr Material / 10-Yr Workmanship",
            highlights: [
                "Stunning Dimensional Appearance",
                "Custom Wood Shake Profile",
                "GAF Tiger Paw™ Premium Underlayment",
                "StainGuard® Algae Protection 25YR"
            ]
        },
        {
            tier: "Premium Design",
            name: "Premium Designer",
            shingle: "GAF Grand Sequoia® Designer",
            warranty: "50-Yr Material / 10-Yr Workmanship",
            highlights: [
                "Ultimate Dimensional Presence",
                "Extra-large, Multi-layered Profile",
                "System-Wide Component Integration",
                "Bespoke Wood-shake Aesthetic"
            ]
        }
    ];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-8">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose}></div>

            <div className="relative z-10 w-full max-w-6xl max-h-full overflow-y-auto bg-[#0a0a0a] border border-white/10 shadow-2xl shadow-[var(--rhive-pink)]/10"
                style={{ clipPath: 'polygon(24px 0, 100% 0, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0 100%, 0 24px)' }}
            >
                {/* Header */}
                <div className="p-8 border-b border-white/10 flex justify-between items-center sticky top-0 bg-[#0a0a0a]/90 backdrop-blur-sm z-20">
                    <div>
                        <h2 className="text-3xl font-black text-white uppercase tracking-tighter font-display">
                            Package Matrix<span className="text-[var(--rhive-pink)]">.</span>
                        </h2>
                        <p className="text-gray-500 font-mono text-xs uppercase tracking-widest mt-1">Comparison Engine L-02</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 border border-white/20 hover:border-[var(--rhive-pink)] hover:text-[var(--rhive-pink)] text-white flex items-center justify-center transition-colors"
                        style={{ clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)' }}
                    >
                        ✕
                    </button>
                </div>

                {/* Content */}
                <div className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {packages.map((pkg, idx) => (
                            <div
                                key={idx}
                                className={`relative p-8 border ${pkg.recommended ? 'border-[var(--rhive-pink)] bg-[var(--rhive-pink)]/5' : 'border-white/10 bg-white/5'} transition-all`}
                                style={{ clipPath: 'polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)' }}
                            >
                                {pkg.recommended && (
                                    <div className="absolute top-0 right-0 bg-[var(--rhive-pink)] text-white text-[9px] font-bold uppercase tracking-widest px-3 py-1">
                                        Selected Baseline
                                    </div>
                                )}

                                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">{pkg.tier}</div>
                                <h3 className="text-2xl font-black text-white uppercase font-display mb-1">{pkg.name}</h3>
                                <div className="text-[var(--rhive-pink)] text-sm font-bold uppercase tracking-wider mb-8">{pkg.shingle}</div>

                                <div className="mb-8">
                                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Warranty</div>
                                    <div className="text-white text-sm font-serif">{pkg.warranty}</div>
                                </div>

                                <ul className="space-y-4 mb-8">
                                    {pkg.highlights.map((h, i) => (
                                        <li key={i} className="flex items-start text-xs font-serif text-gray-400">
                                            <span className="text-[var(--rhive-pink)] mr-2 mt-0.5">■</span>
                                            {h}
                                        </li>
                                    ))}
                                </ul>

                                <button
                                    onClick={() => {
                                        onClose();
                                        setTimeout(() => {
                                            document.getElementById('residential')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                        }, 100);
                                    }}
                                    className={`w-full py-4 text-xs font-bold uppercase tracking-widest transition-all ${pkg.recommended ? 'bg-[var(--rhive-pink)] text-white hover:bg-white hover:text-black' : 'border border-white/20 text-white hover:border-[var(--rhive-pink)] hover:text-[var(--rhive-pink)]'}`}
                                    style={{ clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)' }}>
                                    Select Package
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServicesLightbox;
