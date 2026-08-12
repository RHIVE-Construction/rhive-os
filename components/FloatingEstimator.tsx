
import React, { useState, useEffect, useRef } from 'react';
import { useGoogleMapsApi } from '../hooks/useGoogleMapsApi';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigation } from '../contexts/NavigationContext';
import {
    Gauge,
    X,
    ChevronRight,
    Home,
    CheckCircle2,
    MapPin,
    ArrowRight,
    Search,
    Zap,
    MessageSquare,
    Send,
    Bot
} from 'lucide-react';
import { cn } from '../lib/utils';
import { generateMockBuildingData } from '../lib/mockData';
import { usePricing } from '../contexts/PricingContext';
import type { Place, BuildingData } from '../types';

type Step = 'address' | 'specs' | 'lead' | 'result' | 'chat';

export const FloatingEstimator: React.FC = () => {
    const { activePageId } = useNavigation();
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState<Step>('address');
    const [address, setAddress] = useState('');
    const [activeProtocol, setActiveProtocol] = useState<string | null>(null);
    const [isVisible, setIsVisible] = useState(true);

    // Dynamic Estimation States
    const [placeCoords, setPlaceCoords] = useState<Place | null>(null);
    const [buildingData, setBuildingData] = useState<BuildingData | null>(null);
    const [shingleProfile, setShingleProfile] = useState<'Duration' | 'Designer' | 'Metal' | 'Slate'>('Duration');
    const [pitch, setPitch] = useState<'Low' | 'Medium' | 'Steep'>('Medium');
    const [priceRange, setPriceRange] = useState<{ low: number; high: number } | null>(null);

    const { pricing } = usePricing();

    const inputRef = useRef<HTMLInputElement>(null);
    const autocompleteRef = useRef<any>(null);
    const isApiReady = useGoogleMapsApi();

    const calculateBallparkRange = (bldgData: BuildingData, selectedProf: string, selectedPitch: string) => {
        if (!bldgData || !pricing) return;

        let totalSq = 0;
        const SQ_METERS_TO_SQ_FEET = 10.7639;
        const SQ_FEET_PER_SQUARE = 100;

        bldgData.buildings.forEach(b => {
            let bldgSq = 0;
            b.facets.forEach(f => {
                bldgSq += f.areaMeters * SQ_METERS_TO_SQ_FEET / SQ_FEET_PER_SQUARE;
            });
            if (b.isOverridden && b.overrideSq !== undefined) {
                bldgSq = b.overrideSq;
            }
            totalSq += bldgSq;
        });

        if (totalSq <= 0) {
            totalSq = 30; // Fallback standard squares
        }

        const pitchKey = selectedPitch === 'Low' ? '4' : (selectedPitch === 'Steep' ? '10' : '6');
        const pitchRates = pricing.costPerSqByPitch[pitchKey] || pricing.costPerSqByPitch['6'];
        let ratePerSq = pitchRates.materials + pitchRates.labor + pitchRates.overhead;

        if (selectedProf === 'Designer') {
            ratePerSq += pricing.upgrades['GAF Grand Sequoia®'] || 35;
        } else if (selectedProf === 'Metal') {
            ratePerSq += 600; // Metal premium
        } else if (selectedProf === 'Slate') {
            ratePerSq += 1000; // Slate premium
        }

        const baseCost = ratePerSq * totalSq;
        // Apply 15% platform margin
        const retailPrice = baseCost / (1 - 0.15);

        // Apply 10% RPSP Efficiency Credit
        const finalPrice = retailPrice * 0.90;

        // Generate range
        const low = Math.round(finalPrice * 0.95);
        const high = Math.round(finalPrice * 1.05);

        setPriceRange({ low, high });
    };

    const fetchBuildingAndProceed = (place: Place) => {
        const bData = generateMockBuildingData(place);
        setBuildingData(bData);
        setStep('specs');
    };

    const handleInitializeAnalysis = () => {
        if (!address) return;

        if (!placeCoords && window.google?.maps?.Geocoder) {
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode({ address: address }, (results: any, status: any) => {
                if (status === 'OK' && results[0] && results[0].geometry) {
                    const loc = results[0].geometry.location;
                    const resolvedPlace = {
                        address: results[0].formatted_address || address,
                        latitude: loc.lat(),
                        longitude: loc.lng()
                    };
                    setPlaceCoords(resolvedPlace);
                    setAddress(results[0].formatted_address || address);
                    fetchBuildingAndProceed(resolvedPlace);
                } else {
                    const fallbackPlace = {
                        address: address,
                        latitude: 40.7608,
                        longitude: -111.8910
                    };
                    setPlaceCoords(fallbackPlace);
                    fetchBuildingAndProceed(fallbackPlace);
                }
            });
        } else {
            const placeToUse = placeCoords || {
                address: address,
                latitude: 40.7608,
                longitude: -111.8910
            };
            fetchBuildingAndProceed(placeToUse);
        }
    };

    const handleGenerateRange = () => {
        if (buildingData) {
            calculateBallparkRange(buildingData, shingleProfile, pitch);
        }
        setStep('lead');
    };

    useEffect(() => {
        const isHomepage = ['P-00', 'P-00-V2', 'P-00-V3', 'P-Landing'].includes(activePageId);

        if (!isHomepage) {
            setIsVisible(true);
            return;
        }

        // On homepage, hide by default until scrolled to capability catalog
        setIsVisible(false);

        const handleScroll = () => {
            const servicesEl = document.getElementById('services') || document.getElementById('tech-c');
            if (servicesEl) {
                const rect = servicesEl.getBoundingClientRect();
                if (rect.top <= window.innerHeight * 0.8) {
                    setIsVisible(true);
                } else {
                    setIsVisible(false);
                }
            } else {
                setIsVisible(false);
            }
        };

        handleScroll();

        window.addEventListener('scroll', handleScroll, { capture: true, passive: true });
        const interval = setInterval(handleScroll, 200);

        return () => {
            window.removeEventListener('scroll', handleScroll, { capture: true });
            clearInterval(interval);
        };
    }, [activePageId]);

    useEffect(() => {
        const handleOpen = (e: any) => {
            setActiveProtocol(e.detail?.protocol || null);
            setIsOpen(true);
            if (e.detail?.address) {
                const addr = e.detail.address;
                setAddress(addr);
                // Attempt geocode immediately if geocoder is available
                if (window.google?.maps?.Geocoder) {
                    const geocoder = new window.google.maps.Geocoder();
                    geocoder.geocode({ address: addr }, (results: any, status: any) => {
                        if (status === 'OK' && results[0] && results[0].geometry) {
                            const loc = results[0].geometry.location;
                            const resolvedPlace = {
                                address: results[0].formatted_address || addr,
                                latitude: loc.lat(),
                                longitude: loc.lng()
                            };
                            setPlaceCoords(resolvedPlace);
                            setAddress(results[0].formatted_address || addr);
                            const bData = generateMockBuildingData(resolvedPlace);
                            setBuildingData(bData);
                            setStep('specs');
                        } else {
                            const fallbackPlace = {
                                address: addr,
                                latitude: 40.7608,
                                longitude: -111.8910
                            };
                            setPlaceCoords(fallbackPlace);
                            const bData = generateMockBuildingData(fallbackPlace);
                            setBuildingData(bData);
                            setStep('specs');
                        }
                    });
                } else {
                    const fallbackPlace = {
                        address: addr,
                        latitude: 40.7608,
                        longitude: -111.8910
                    };
                    setPlaceCoords(fallbackPlace);
                    const bData = generateMockBuildingData(fallbackPlace);
                    setBuildingData(bData);
                    setStep('specs');
                }
            } else {
                setAddress('');
                setPlaceCoords(null);
                setBuildingData(null);
                setPriceRange(null);
                setStep('address');
            }
        };
        window.addEventListener('open-estimator', handleOpen);
        return () => window.removeEventListener('open-estimator', handleOpen);
    }, []);

    useEffect(() => {
        // Only initialize once when the API is ready and input is mounted.
        // We include `isOpen` because the inputRef only mounts when the drawer is open.
        // We do NOT include `step` — the autocomplete lives on the 'address' step input
        // and does not need to reinitialize on every step change.
        // CRITICAL: Do NOT remove .pac-container elements in cleanup — doing so nukes
        // other autocomplete dropdowns globally (e.g., the EstimateTool's AddressInput).
        if (!isApiReady || !isOpen || !inputRef.current || !window.google?.maps?.places) return;

        if (autocompleteRef.current) return;

        const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
            types: ['address'],
            fields: ['formatted_address', 'geometry'],
            componentRestrictions: { country: 'us' }
        });

        autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();
            if (place.formatted_address && place.geometry && place.geometry.location) {
                setAddress(place.formatted_address);
                setPlaceCoords({
                    address: place.formatted_address,
                    latitude: place.geometry.location.lat(),
                    longitude: place.geometry.location.lng()
                });
            } else if (place.formatted_address) {
                setAddress(place.formatted_address);
            } else if (inputRef.current) {
                setAddress(inputRef.current.value);
            }
        });

        autocompleteRef.current = autocomplete;

        return () => {
            // Only clear listeners — do NOT remove .pac-container elements globally.
            // Google appends pac-containers to <body> and manages their lifecycle.
            // Removing them here wipes out other autocomplete dropdowns on the page.
            if (autocompleteRef.current) {
                window.google?.maps?.event?.clearInstanceListeners(autocompleteRef.current);
                autocompleteRef.current = null;
            }
        };
    }, [isApiReady, isOpen]);


    const steps = [
        { id: 'address', label: 'Identity' },
        { id: 'specs', label: 'Specs' },
        { id: 'lead', label: 'Lead' },
        { id: 'result', label: 'Quote' }
    ];

    const toggleDrawer = () => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            setStep('address');
            setPlaceCoords(null);
            setBuildingData(null);
            setPriceRange(null);
        }
    };

    return (
        <>
            {/* 1. SIDE TAB BUTTON */}
            <AnimatePresence>
                {isVisible && (
                    <motion.button
                        key="system-scan-tab"
                        onClick={() => {
                            setStep('chat');
                            setIsOpen(true);
                        }}
                        whileHover={{ scale: 1.05, x: -10 }}
                        whileTap={{ scale: 0.95 }}
                        className="fixed right-0 top-1/2 -translate-y-1/2 z-[600] flex items-center gap-3 bg-[var(--rhive-bg)] text-[var(--rhive-text)] px-4 py-10 rounded-l-3xl shadow-[-20px_0_40px_rgba(236,2,139,0.3)] hover:shadow-[-30px_0_60px_rgba(236,2,139,0.6)] transition-all group overflow-hidden border border-[var(--rhive-border)] outline-none"
                        initial={{ x: 100 }}
                        animate={{ x: 0 }}
                        exit={{ x: 100 }}
                        transition={{ type: 'spring', damping: 20, stiffness: 100 }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-rhive-pink/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="flex flex-col items-center gap-2 relative z-10">
                            <Zap size={20} className="text-rhive-pink animate-pulse" />
                            <span className="[writing-mode:vertical-lr] font-black text-base uppercase tracking-[0.6em] rotate-180">
                                System Scan
                            </span>
                        </div>
                    </motion.button>
                )}
            </AnimatePresence>

            {/* 2. OVERLAY */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[700]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={toggleDrawer}
                    />
                )}
            </AnimatePresence>

            {/* 3. SLIDE-OUT DRAWER */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="fixed top-0 right-0 h-full w-full max-w-lg bg-[var(--rhive-bg)] z-[800] shadow-[-40px_0_80px_rgba(0,0,0,0.8)] border-l border-[var(--rhive-border)] overflow-hidden flex flex-col pt-12"
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300, mass: 0.8 }}
                    >
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-rhive-pink/10">
                            <motion.div
                                className="h-full bg-rhive-pink shadow-pink-glow"
                                initial={{ width: "0%" }}
                                animate={{
                                    width: step === 'address' ? '25%' :
                                        step === 'specs' ? '50%' :
                                            step === 'lead' ? '75%' : '100%'
                                }}
                            />
                        </div>

                        {/* Header */}
                        <div className="p-10 flex justify-between items-center border-b border-[var(--rhive-border)] relative bg-[var(--rhive-bg)]/50">
                            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-rhive-pink/50 to-transparent" />
                            <div className="flex flex-col">
                                <motion.span
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="text-rhive-pink font-black text-base uppercase tracking-[0.6em] mb-2"
                                >
                                    {activeProtocol ? `Protocol ${activeProtocol} // Locked` : 'Quantum Intake Terminal'}
                                </motion.span>
                                <h2 className="text-3xl font-black uppercase tracking-tighter text-[var(--rhive-text)] italic">Property Portal<span className="text-rhive-pink">.</span></h2>
                            </div>
                            <motion.button
                                whileHover={{ rotate: 90, scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={toggleDrawer}
                                className="p-3 glass-dark border-[var(--rhive-border)] text-[var(--rhive-text-muted)] hover:text-rhive-pink transition-colors flex items-center justify-center outline-none bg-transparent"
                            >
                                <X size={20} />
                            </motion.button>
                        </div>

                        {/* Content Area */}
                        <div className="flex-grow p-8 overflow-y-auto flex flex-col">
                            {step === 'chat' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex flex-col h-full space-y-6"
                                >
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-rhive-pink/10 rounded-lg border border-rhive-pink/30">
                                                <Bot size={24} className="text-rhive-pink" />
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-black uppercase tracking-tighter italic">RHIVE AI Architect</h3>
                                                <p className="text-rhive-pink font-black text-base uppercase tracking-[0.4em]">Neural Network Operational</p>
                                            </div>
                                        </div>
                                        <p className="text-[var(--text-muted)] text-base leading-relaxed">
                                            I am the strategic engine of RHIVE OS. How can I assist your deployment today?
                                        </p>
                                    </div>

                                    <div className="flex-grow space-y-4 overflow-y-auto pr-2 scrollbar-hide">
                                        <div className="bg-white/5 border border-white/10 p-4 rounded-2xl rounded-tl-none max-w-[85%]">
                                            <p className="text-base text-white/90 leading-relaxed">
                                                Welcome to the ecosystem. I can help you with:
                                                <br /><br />
                                                • Instant geometric roof analysis
                                                <br />
                                                • Material durability comparisons
                                                <br />
                                                • Financing & RPSP logic
                                                <br />
                                                • Customer portal access
                                            </p>
                                        </div>

                                        <div className="flex justify-end">
                                            <div className="bg-rhive-pink/20 border border-rhive-pink/30 p-4 rounded-2xl rounded-tr-none max-w-[85%]">
                                                <p className="text-base text-white/90 leading-relaxed">
                                                    I'm interested in a metal roof for a 2,500 sq ft property.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-auto pt-6 border-t border-white/5">
                                        <div className="relative group">
                                            <input
                                                type="text"
                                                placeholder="COMMAND THE AI..."
                                                className="w-full bg-black/40 border-2 border-white/10 p-5 pr-16 text-base font-black uppercase tracking-widest outline-none focus:border-rhive-pink transition-all text-white placeholder-white/20"
                                            />
                                            <button className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-rhive-pink text-white rounded-xl shadow-pink-glow hover:scale-110 transition-transform">
                                                <Send size={16} />
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2 mt-4">
                                            <button onClick={() => setStep('address')} className="text-base font-black tracking-widest border border-white/10 py-2 hover:border-rhive-pink transition-all uppercase">Start Estimate</button>
                                            <button className="text-base font-black tracking-widest border border-white/10 py-2 hover:border-rhive-pink transition-all uppercase">View Process</button>
                                            <button className="text-base font-black tracking-widest border border-white/10 py-2 hover:border-rhive-pink transition-all uppercase">Insurance FAQ</button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {step === 'address' && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                                    className="space-y-8"
                                >
                                    {activeProtocol && (
                                        <div className="bg-rhive-pink/10 border border-rhive-pink/30 p-4 rounded-xl">
                                            <p className="text-base font-black uppercase tracking-widest text-rhive-pink mb-1">Active Protocol: {activeProtocol}</p>
                                            <p className="text-base text-white/70 italic leading-relaxed">
                                                {activeProtocol === 'CERTIFIED QUOTE'
                                                    ? "This protocol involves a deep neural sweep and human-verified geometric validation for 100% price certainty."
                                                    : "Initializing rapid satellite scanning for an instant ball-park estimation."}
                                            </p>
                                        </div>
                                    )}

                                    <div className="space-y-4">
                                        <h3 className="text-4xl font-black uppercase tracking-tighter leading-none italic">Where are we <br /> deploying?</h3>
                                        <p className="text-[var(--text-muted)] text-base">Input your address to initialize geospatial mapping and high-resolution aerial analysis.</p>
                                    </div>

                                    <div className="relative group">
                                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--rhive-text-muted)] group-focus-within:text-rhive-pink transition-colors">
                                            <Search size={22} />
                                        </div>
                                        <input
                                            ref={inputRef}
                                            type="text"
                                            placeholder={isApiReady ? "STREET ADDRESS..." : "INITIALIZING..."}
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                            className="w-full bg-[var(--rhive-bg)] border-2 border-[var(--rhive-border)] py-6 pl-16 pr-8 text-base font-black uppercase tracking-widest outline-none focus:border-rhive-pink transition-all placeholder-[var(--rhive-text-muted)] text-[var(--rhive-text)]"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        {[
                                            { icon: MapPin, label: "Geospatial Data" },
                                            { icon: Home, label: "Roof Geometry" },
                                        ].map((item, i) => (
                                            <div key={i} className="glass-dark p-4 border-[var(--rhive-border)] flex flex-col items-center gap-2 opacity-50">
                                                <item.icon size={20} className="text-rhive-pink" />
                                                <span className="text-base font-black uppercase tracking-widest text-[var(--rhive-text)]">{item.label}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <button
                                        onClick={handleInitializeAnalysis}
                                        disabled={!address}
                                        className="w-full btn-tech py-6 text-base shadow-pink-glow disabled:opacity-20 disabled:grayscale transition-all"
                                    >
                                        Initialize Analysis
                                    </button>
                                </motion.div>
                            )}

                            {step === 'specs' && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                                    className="space-y-8"
                                >
                                    <h3 className="text-3xl font-black uppercase tracking-tighter leading-none italic">Select Your Infrastructure<span className="text-rhive-pink">.</span></h3>

                                    <div className="space-y-6">
                                        <div className="space-y-3">
                                            <label className="text-base font-black uppercase tracking-widest opacity-50">Shingle Profile</label>
                                            <div className="grid grid-cols-2 gap-3">
                                                {['Duration', 'Designer', 'Metal', 'Slate'].map(s => (
                                                    <button 
                                                        key={s} 
                                                        onClick={() => setShingleProfile(s as any)}
                                                        className={cn(
                                                            "p-4 glass-dark text-base font-black uppercase tracking-widest transition-all",
                                                            shingleProfile === s ? "border-rhive-pink bg-rhive-pink/10 text-white shadow-pink-glow-sm" : "border-white/5 text-[var(--rhive-text-muted)] hover:border-rhive-pink"
                                                        )}
                                                    >
                                                        {s}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-base font-black uppercase tracking-widest opacity-50">Pitch Assessment</label>
                                            <div className="grid grid-cols-3 gap-3">
                                                {['Low', 'Medium', 'Steep'].map(p => (
                                                    <button 
                                                        key={p} 
                                                        onClick={() => setPitch(p as any)}
                                                        className={cn(
                                                            "p-3 glass-dark text-base font-black uppercase tracking-widest transition-all",
                                                            pitch === p ? "border-rhive-pink bg-rhive-pink/10 text-white shadow-pink-glow-sm" : "border-white/5 text-[var(--rhive-text-muted)] hover:border-rhive-pink"
                                                        )}
                                                    >
                                                        {p}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleGenerateRange}
                                        className="w-full btn-tech py-6 text-base shadow-pink-glow"
                                    >
                                        Generate Range
                                    </button>
                                </motion.div>
                            )}

                            {step === 'lead' && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                                    className="space-y-8"
                                >
                                    <h3 className="text-3xl font-black uppercase tracking-tighter leading-none italic">Secure My Quote<span className="text-rhive-pink">.</span></h3>
                                    <p className="text-[var(--text-muted)] text-base">Where should we deliver the detailed technical analysis and NDL warranty certification?</p>

                                    <div className="space-y-4">
                                        <input type="text" placeholder="FULL NAME" className="w-full bg-[var(--rhive-bg)] border border-[var(--rhive-border)] p-5 text-base font-bold uppercase tracking-widest outline-none focus:border-rhive-pink transition-all text-[var(--rhive-text)] placeholder-[var(--rhive-text-muted)]" />
                                        <input type="email" placeholder="EMAIL ADDRESS" className="w-full bg-[var(--rhive-bg)] border border-[var(--rhive-border)] p-5 text-base font-bold uppercase tracking-widest outline-none focus:border-rhive-pink transition-all text-[var(--rhive-text)] placeholder-[var(--rhive-text-muted)]" />
                                        <input type="tel" placeholder="PHONE NUMBER" className="w-full bg-[var(--rhive-bg)] border border-[var(--rhive-border)] p-5 text-base font-bold uppercase tracking-widest outline-none focus:border-rhive-pink transition-all text-[var(--rhive-text)] placeholder-[var(--rhive-text-muted)]" />
                                    </div>

                                    <button
                                        onClick={() => setStep('result')}
                                        className="w-full btn-tech py-6 text-base shadow-pink-glow"
                                    >
                                        Execute Delivery
                                    </button>
                                </motion.div>
                            )}

                            {step === 'result' && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                                    className="text-center space-y-10 py-10"
                                >
                                    <div className="flex justify-center">
                                        <div className="w-24 h-24 bg-rhive-pink rounded-full flex items-center justify-center text-white shadow-pink-glow animate-pulse">
                                            <CheckCircle2 size={48} />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <h3 className="text-5xl font-black uppercase tracking-tighter italic">Analysis <br /> Complete<span className="text-rhive-pink">.</span></h3>
                                        <p className="text-rhive-pink font-black text-base uppercase tracking-[0.4em]">Integrated Estimate Ready</p>
                                    </div>

                                    <div className="glass-dark p-10 border-rhive-pink/30 relative overflow-hidden">
                                        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-rhive-pink to-transparent" />
                                        <span className="text-base font-black uppercase tracking-widest opacity-40 mb-4 block">Calculated Result Range</span>
                                        <div className="text-6xl font-black tracking-tighter text-white mb-2">
                                            {priceRange 
                                                ? `$${(priceRange.low / 1000).toFixed(1)}K - $${(priceRange.high / 1000).toFixed(1)}K`
                                                : "$14.2K - $16.8K"
                                            }
                                        </div>
                                        <div className="text-rhive-pink text-base font-bold uppercase tracking-widest">Includes 10% RPSP Efficiency Credit</div>
                                    </div>

                                    <p className="text-base text-[var(--text-muted)] leading-relaxed">
                                        Your detailed PDF breakdown has been sent. A local engineer will confirm the drone mapping data within 24 hours.
                                    </p>

                                    <div className="grid grid-cols-2 gap-4">
                                        <button className="btn-tech py-4 text-base">Call Support</button>
                                        <button onClick={toggleDrawer} className="btn-tech-outline py-4 text-base">Finish</button>
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* Footer Status */}
                        <div className="p-6 bg-black/40 border-t border-[var(--border-color)] flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]" />
                                <span className="text-base font-black uppercase tracking-widest opacity-40">OS Channel Sec-1</span>
                            </div>
                            <span className="text-base font-mono text-[var(--text-muted)] opacity-30 italic">Encryption: AES-256 Enabled</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
