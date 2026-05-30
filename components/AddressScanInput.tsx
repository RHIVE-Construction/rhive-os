import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Zap } from './icons';
import { useGoogleMapsApi } from '../hooks/useGoogleMapsApi';
import type { Place } from '../types';
import { EstimatorFlow } from './EstimatorFlow';

interface AddressScanInputProps {
    id?: string;
    value?: string;
    onChange?: (val: string) => void;
    onScan?: (address: string) => void;
}

export const AddressScanInput: React.FC<AddressScanInputProps> = ({ 
    id, 
    value, 
    onChange, 
    onScan 
}) => {
    const chamferSize = "16px";
    const clipPathValue = `polygon(
        ${chamferSize} 0,
        100% 0,
        100% calc(100% - ${chamferSize}),
        calc(100% - ${chamferSize}) 100%,
        0 100%,
        0 ${chamferSize}
    )`;

    const fullText = "ENTER PROJECT ADDRESS";
    const [placeholder, setPlaceholder] = useState("");
    const [index, setIndex] = useState(0);
    const [localVal, setLocalVal] = useState("");

    useEffect(() => {
        if (!isApiReady || !inputRef.current || !window.google || !window.google.maps.places) return;
        if (autocompleteRef.current) return;

        const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
            types: ['address'],
            fields: ['formatted_address', 'geometry'],
            componentRestrictions: { country: 'us' },
        });

        autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();
            if (place.geometry && place.geometry.location && place.formatted_address) {
                setSelectedPlace({
                    address: place.formatted_address,
                    latitude: place.geometry.location.lat(),
                    longitude: place.geometry.location.lng(),
                });
            }
        });

        autocompleteRef.current = autocomplete;

        return () => {
            if (autocompleteRef.current) {
                window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
                autocompleteRef.current = null;
            }
            document.querySelectorAll('.pac-container').forEach((el) => el.remove());
        };
    }, [isApiReady]);

    const handleScanClick = () => {
        if (selectedPlace) {
            setIsEstimatorOpen(true);
        } else {
            // Optional: prompt user or just focus input
            inputRef.current?.focus();
        }
    };

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

            {/* 1. Background Layer (Clipped) */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-xl z-0"
                style={{ clipPath: clipPathValue }}
            />

            {/* 2. CIRCUITRY BORDERS (Consistent with Design System) */}
            {/* Left Border (Gray) + Animated Pixel */}
            <div className="absolute left-0 top-4 bottom-0 w-[1px] bg-gray-700 z-10 overflow-hidden">
                <motion.div
                    className="absolute left-0 w-[2px] h-4 bg-rhive-pink shadow-[0_0_10px_rgba(236,2,139,1)]"
                    animate={{ top: ["-20%", "120%"] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />

                {/* 2. CIRCUITRY BORDERS (Consistent with Design System) */}
                <div className="absolute left-0 top-4 bottom-0 w-[1px] bg-gray-700 z-10 overflow-hidden">
                    <motion.div
                        className="absolute left-0 w-[2px] h-4 bg-rhive-pink shadow-[0_0_10px_rgba(236,2,139,1)]"
                        animate={{ top: ["-20%", "120%"] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    />
                </div>
                <svg className="absolute top-0 left-0 w-4 h-4 z-10 overflow-visible pointer-events-none">
                    <line x1="0" y1="16" x2="16" y2="0" stroke="#374151" strokeWidth="1" strokeLinecap="square" />
                </svg>
                <input
                    type="text"
                    placeholder={placeholder}
                    value={currentVal}
                    onChange={handleInputChange}
                    className="bg-transparent text-white w-full h-full outline-none placeholder-white font-black uppercase text-[12px] md:text-[14px] tracking-[0.2em] text-left"
                />
            </div>

            {/* Premium Button Section */}
            <button
                onClick={handleScanClick}
                className="relative h-full px-8 md:px-12 flex items-center justify-center gap-2 bg-rhive-pink/20 hover:bg-rhive-pink/40 border border-rhive-pink/40 hover:border-rhive-pink/60 backdrop-blur-md text-white font-black uppercase text-[13px] tracking-widest overflow-hidden group/btn hover:scale-[1.02] active:scale-95 transition-all duration-300 shadow-[0_0_20px_rgba(236,2,139,0.2)] shrink-0 z-20"
                style={{
                    clipPath: `polygon(0 0, 100% 0, 100% calc(100% - ${chamferSize}), calc(100% - ${chamferSize}) 100%, 0 100%)`
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                <Zap size={18} fill="currentColor" className="text-white" />
                <span className="relative z-10">Scan My Roof</span>
            </button>
        </div>
    );
};

export default AddressScanInput;
