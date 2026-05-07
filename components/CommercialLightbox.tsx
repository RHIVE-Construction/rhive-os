import React from 'react';
import { useNavigation } from '../contexts/NavigationContext';

interface CommercialLightboxProps {
    isOpen: boolean;
    onClose: () => void;
}

export const CommercialLightbox: React.FC<CommercialLightboxProps> = ({ isOpen, onClose }) => {
    const { setActivePageId } = useNavigation();

    if (!isOpen) return null;

    const packages = [
        {
            tier: "Standard Commercial",
            name: "Modified Bitumen System",
            system: "Multi-Ply APP/SBS Membrane",
            warranty: "15-Year Material Warranty",
            highlights: [
                "Proven Asphalt Technology",
                "High Puncture Resistance",
                "Excellent Cold Weather Flex",
                "Granulated Surface Options"
            ]
        },
        {
            tier: "Premium Single-Ply",
            name: "TPO Membrane System",
            system: "Thermoplastic Polyolefin",
            warranty: "20-Year NDL Warranty",
            highlights: [
                "Hot-Air Welded Seams",
                "High Energy Efficiency (Title 24)",
                "Excellent UV Resistance",
                "Cost-Effective Performance"
            ],
            recommended: true
        },
        {
            tier: "Ultimate Commercial",
            name: "PVC Membrane System",
            system: "Polyvinyl Chloride",
            warranty: "25-Year NDL Warranty",
            highlights: [
                "Superior Chemical Resistance",
                "Exceptional Wind Uplift Rating",
                "Maximum Flexibility",
                "Self-Extinguishing (Fire Rated)"
            ]
        }
    ];

    const handleSelectPackage = (packageId: string) => {
        onClose();
        setTimeout(() => {
            document.getElementById('commercial')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 text-[var(--rhive-text)]">
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-500 animate-fade-in"
                onClick={onClose}
            ></div>

            <div
                className="relative w-full max-w-6xl bg-black border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col max-h-[90vh] overflow-hidden animate-slide-up"
                style={{ clipPath: 'polygon(32px 0, 100% 0, 100% calc(100% - 32px), calc(100% - 32px) 100%, 0 100%, 0 32px)' }}
            >
                <div className="flex-shrink-0 p-6 sm:p-8 bg-gradient-to-b from-[#0a0a0a] to-black border-b border-white/5 flex justify-between items-start relative z-10">
                    <div>
                        <div className="inline-flex items-center gap-2 mb-3 bg-[var(--rhive-blue)]/10 border border-[var(--rhive-blue)]/20 px-3 py-1 rounded-sm">
                            <span className="w-1.5 h-1.5 bg-[var(--rhive-blue)] rounded-full animate-pulse shadow-[0_0_8px_rgba(8,19,124,0.8)]"></span>
                            <span className="text-[10px] uppercase tracking-widest text-[var(--rhive-blue)] font-bold">Compare Options</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tighter font-display">Commercial Systems Matrix<span className="text-[var(--rhive-blue)]">.</span></h2>
                    </div>
                </div>

                <div className="flex-grow overflow-y-auto p-6 sm:p-8 relative z-10 custom-scrollbar">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {packages.map((pkg, idx) => (
                            <div
                                key={idx}
                                className={`flex flex-col border ${pkg.recommended ? 'border-[var(--rhive-blue)] shadow-[0_0_30px_rgba(8,19,124,0.15)] bg-gradient-to-b from-[var(--rhive-blue)]/10 to-transparent' : 'border-white/10 bg-black/50'} relative group transition-all duration-300 hover:border-white/30`}
                                style={{ clipPath: 'polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)' }}
                            >
                                {pkg.recommended && (
                                    <div className="absolute top-0 right-0 bg-[var(--rhive-blue)] text-white text-[9px] font-black uppercase tracking-widest px-4 py-1.5 z-20"
                                        style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 8px 100%)' }}>
                                        Highest Value
                                    </div>
                                )}

                                <div className="p-6 border-b border-white/5 relative bg-black/40">
                                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2">{pkg.tier}</div>
                                    <h3 className="text-2xl font-black text-white uppercase mb-1 font-display">{pkg.name}</h3>
                                    <div className="text-sm text-[var(--rhive-blue)] font-bold mb-4">{pkg.system}</div>

                                    <div className="bg-white/5 border border-white/10 p-3 rounded-sm mb-2">
                                        <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Warranty Coverage</div>
                                        <div className="text-sm font-bold text-gray-200">{pkg.warranty}</div>
                                    </div>
                                </div>

                                <div className="flex-grow p-6 bg-black/20">
                                    <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-4">Core Specifications</div>
                                    <ul className="space-y-3">
                                        {pkg.highlights.map((highlight, hIdx) => (
                                            <li key={hIdx} className="flex items-start text-sm text-gray-300 font-serif group-hover:text-white transition-colors">
                                                <span className={`mr-2 mt-1 text-[10px] ${pkg.recommended ? 'text-[var(--rhive-blue)]' : 'text-gray-500'}`}>■</span>
                                                <span className="leading-tight">{highlight}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="p-6 border-t border-white/5 mt-auto bg-black/60">
                                    <button
                                        onClick={() => handleSelectPackage('commercial-tpo')}
                                        className={`w-full py-4 text-xs font-black uppercase tracking-widest transition-all duration-300 ${pkg.recommended ? 'bg-[var(--rhive-blue)] text-white hover:bg-white hover:text-black shadow-[0_0_20px_rgba(8,19,124,0.4)]' : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'}`}
                                        style={{ clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)' }}
                                    >
                                        Full Specifications
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex-shrink-0 p-6 border-t border-white/5 bg-black/80 backdrop-blur-md flex justify-end relative z-10">
                    <button
                        onClick={onClose}
                        className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-colors px-6 py-3 border border-transparent hover:border-white/10 bg-transparent hover:bg-white/5"
                        style={{ clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)' }}
                    >
                        Close Matrix
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CommercialLightbox;
