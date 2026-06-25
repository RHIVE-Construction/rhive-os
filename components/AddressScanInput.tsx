import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Zap } from './icons';
import { CheckCircle2 } from 'lucide-react';

interface AddressScanInputProps {
    id?: string;
    placeholder?: string;
    buttonText?: string;
    themeColor?: 'pink' | 'blue' | 'gold';
    value?: string;
    onChange?: (val: string) => void;
    onScan?: (address: string) => void;
}

export const AddressScanInput = ({
    id,
    buttonText = "Scan My Roof",
    themeColor = "pink",
    value,
    onChange,
    onScan,
}: AddressScanInputProps) => {
    const chamferSize = "16px";

    const inputRef = useRef<HTMLInputElement>(null);
    const [selectedPlace, setSelectedPlace] = useState<string | null>(null);

    const fullText = "ENTER PROJECT ADDRESS";
    const [placeholder, setPlaceholder] = useState("");
    const [index, setIndex] = useState(0);
    const [localVal, setLocalVal] = useState("");

    useEffect(() => {
        if (index < fullText.length) {
            const timeout = setTimeout(() => {
                setPlaceholder(prev => prev + fullText[index]);
                setIndex(index + 1);
            }, 50);
            return () => clearTimeout(timeout);
        } else {
            const resetTimeout = setTimeout(() => {
                setPlaceholder("");
                setIndex(0);
            }, 5000);
            return () => clearTimeout(resetTimeout);
        }
    }, [index]);

    const isControlled = value !== undefined;
    const currentVal = isControlled ? value : localVal;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        if (!isControlled) {
            setLocalVal(val);
        }
        if (onChange) {
            onChange(val);
        }
    };

    const handleScanClick = () => {
        if (onScan) {
            onScan(currentVal || "525 Aspen Meadow Dr, Logan, UT");
        } else {
            window.dispatchEvent(new CustomEvent('open-roof-configurator', { 
                detail: { 
                    address: currentVal || "525 Aspen Meadow Dr, Logan, UT",
                    mode: 'estimate'
                } 
            }));
        }
    };

    const isPink = themeColor === 'pink';
    const isGold = themeColor === 'gold';

    // Accent line stroke colors (SVG)
    const accentStroke = isPink ? "#ec028b" : (isGold ? "#e2ab49" : "#3b82f6");
    const topGradVia = isPink ? "via-rhive-pink/40" : (isGold ? "via-[#e2ab49]/40" : "via-blue-500/40");
    const blinkDotFill = isPink ? "#ec028b" : (isGold ? "#e2ab49" : "#3b82f6");
    const inputPlaceholderClass = isPink 
        ? "placeholder-rhive-pink/60 text-rhive-pink/90" 
        : (isGold ? "placeholder-[#e2ab49]/60 text-[#e2ab49]/90" : "placeholder-blue-400/60 text-blue-300/90");

    // Left border animate pulse classes
    const leftPulseClass = isPink 
        ? "bg-rhive-pink shadow-[0_0_10px_rgba(236,2,139,1)]" 
        : (isGold ? "bg-[#e2ab49] shadow-[0_0_10px_rgba(226,171,73,1)]" : "bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,1)]");
    const rightPulseClass = isPink 
        ? "bg-[#22d3ee] shadow-[0_0_10px_rgba(34,211,238,1)]" 
        : (isGold ? "bg-[#e2ab49] shadow-[0_0_10px_rgba(226,171,73,1)]" : "bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,1)]");

    // Button style classes
    const buttonBgClass = isPink 
        ? "bg-rhive-pink shadow-[0_0_20px_rgba(236,2,139,0.4)]" 
        : (isGold 
            ? "bg-[#e2ab49] hover:bg-[#d19a38] text-black shadow-[0_0_20px_rgba(226,171,73,0.5)] border border-[#d19a38]/50" 
            : "bg-[#08137C] hover:bg-[#0c1c9c] shadow-[0_0_20px_rgba(8,19,124,0.6)] border border-[#0c1c9c]/50");

    return (
        <div id={id} className="relative flex w-full max-w-2xl mx-auto h-16 group mt-8 scroll-mt-40 isolate breathing-glow">
            <style>{`
                @keyframes border-breathe {
                    0%, 100% {
                        box-shadow: 0 0 10px 1px rgba(236, 2, 139, 0.25);
                    }
                    50% {
                        box-shadow: 0 0 20px 2px rgba(236, 2, 139, 0.45);
                    }
                }
                .breathing-glow {
                    animation: border-breathe 4s ease-in-out infinite;
                    transition: box-shadow 0.3s ease-out, transform 0.3s ease-out;
                    border-radius: 4px;
                }
                .breathing-glow:hover, .breathing-glow:focus-within {
                    animation: none;
                    box-shadow: 0 0 28px 4px rgba(236, 2, 139, 0.7);
                    transform: scale(1.005);
                }
            `}</style>

                {/* 2. CIRCUITRY BORDERS (Consistent with Design System) */}
                <div className="absolute left-0 top-4 bottom-0 w-[1px] bg-gray-700 z-10 overflow-hidden">
                    <motion.div
                        className={`absolute left-0 w-[2px] h-4 ${leftPulseClass}`}
                        animate={{ top: ["-20%", "120%"] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    />
                </div>
                <svg className="absolute top-0 left-0 w-4 h-4 z-10 overflow-visible pointer-events-none">
                    <line x1="0" y1="16" x2="16" y2="0" stroke="#374151" strokeWidth="1" strokeLinecap="square" />
                </svg>
                <svg className="absolute top-0 left-0 w-4 h-4 z-20 overflow-visible pointer-events-none">
                    <line x1="6" y1="10" x2="10" y2="6" stroke={accentStroke} strokeWidth="2" strokeLinecap="square" className={isPink ? "drop-shadow-[0_0_3px_rgba(236,2,139,0.8)]" : "drop-shadow-[0_0_3px_rgba(59,130,246,0.8)]"} />
                </svg>

                <div className="absolute right-0 top-0 bottom-4 w-[1px] bg-gray-700 z-10 overflow-hidden">
                    <motion.div
                        className={`absolute right-0 w-[2px] h-4 ${rightPulseClass}`}
                        animate={{ top: ["120%", "-20%"] }}
                        transition={{ duration: 1.8, repeat: Infinity, ease: "linear", delay: 0.5 }}
                    />
                </div>
                <div className="absolute left-4 right-0 top-0 h-[1px] bg-gray-700 z-10" />
                <div className="absolute left-0 right-4 bottom-0 h-[1px] bg-gray-700 z-10" />
                <svg className="absolute bottom-0 right-0 w-4 h-4 z-10 overflow-visible pointer-events-none">
                    <line x1="0" y1="16" x2="16" y2="0" stroke="#374151" strokeWidth="1" strokeLinecap="square" />
                </svg>
                <svg className="absolute bottom-0 right-0 w-4 h-4 z-20 overflow-visible pointer-events-none">
                    <line x1="6" y1="10" x2="10" y2="6" stroke={accentStroke} strokeWidth="2" strokeLinecap="square" className={isPink ? "drop-shadow-[0_0_3px_rgba(236,2,139,0.8)]" : "drop-shadow-[0_0_3px_rgba(59,130,246,0.8)]"} />
                </svg>
                <div className={`absolute top-0 left-12 right-12 h-[1px] bg-gradient-to-r from-transparent ${topGradVia} to-transparent z-20`} />

                <div className="relative flex-grow flex items-center px-6 md:px-8 z-20">
                    <svg viewBox="0 0 24 24" className="w-7 h-7 mr-4 shrink-0 transition-transform group-hover:scale-110 duration-500" xmlns="http://www.w3.org/2000/svg">
                        <path fill="#4285F4" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                        <path fill="#34A853" d="M12 2C8.13 2 5 5.13 5 9c0 1.15.22 2.21.6 3.19l3.41-3.41C9.07 8.56 9 8.29 9 8c0-1.66 1.34-3 3-3 .29 0 .56.07.78.19l3.41-3.41C14.21 2.22 13.15 2 12 2z" />
                        <path fill="#FBBC05" d="M16.19 5.6C15.21 5.22 14.15 5 13 5c-1.66 0-3 1.34-3 3 0 1.15.47 2.21 1.19 3l3.41-3.41C14.78 7.37 15 7.7 15 8c0 .29-.07.56-.19.78l3.41-3.41C17.78 6.21 18 7.15 18 8.13c0 2.22-1.21 4.39-3 6.3l3.19 3.19C20.5 14.89 22 11.83 22 9c0-3.87-3.13-7-7-7-1.15 0-2.21.22-3.19.6l3.19 3.19c.19.04.37.11.53.21l1.661-1.4z" />
                        <rect x="10.5" y="7.5" width="3" height="3" fill={blinkDotFill} rx="0.5" className="animate-pulse" />
                    </svg>
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder={placeholder}
                        className={`bg-transparent text-white w-full h-full outline-none font-black uppercase text-base tracking-[0.2em] text-left ${inputPlaceholderClass}`}
                        onChange={() => {
                            // If they start typing again after selecting, clear the selected place so they have to re-select
                            setSelectedPlace(null);
                        }}
                    />
                </div>

                {/* Premium Button Section */}
                <button
                    onClick={handleScanClick}
                    className={`relative h-full px-8 md:px-12 flex items-center justify-center gap-2 ${isGold ? 'text-black' : 'text-white'} font-black uppercase text-base tracking-widest overflow-hidden group/btn hover:scale-[1.02] active:scale-95 transition-all duration-300 shrink-0 z-20 ${buttonBgClass}`}
                    style={{
                        clipPath: `polygon(0 0, 100% 0, 100% calc(100% - ${chamferSize}), calc(100% - ${chamferSize}) 100%, 0 100%)`
                    }}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                    {isPink ? (
                        <Zap size={18} fill="currentColor" className="text-white" />
                    ) : (
                        <CheckCircle2 size={18} className={`shrink-0 ${isGold ? 'text-black' : 'text-white'}`} />
                    )}
                    <span className="relative z-10">{buttonText}</span>
                </button>
        </div>
    );
};

export default AddressScanInput;
