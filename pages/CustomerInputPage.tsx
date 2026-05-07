import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import PageContainer from '../components/PageContainer';
import Button from '../components/Button';
import { Card, CardContent } from '../components/ui/card';
import {
    UserIcon,
    MapPinIcon,
    BuildingStorefrontIcon,
    Check,
    RhiveGeopinIcon,
    PencilSquareIcon,
    XIcon,
    FingerPrintIcon,
    BriefcaseIcon,
    MapIcon,
    ChevronDownIcon,
    DocumentTextIcon,
    ShieldCheckIcon,
    KeyIcon,
    CurrencyDollarIcon,
    RulerIcon,
    BoltIcon,
    ListBulletIcon,
    CalendarDaysIcon,
    WrenchIcon,
    CameraIcon,
    SatelliteIcon,
    ShareIcon,
    MegaphoneIcon,
    CloudArrowUpIcon,
    MagnifyingGlassIcon,
    TrashIcon,
    SparklesIcon,
    GutterIcon,
    PlusIcon
} from '../components/icons';
import { useMockDB } from '../contexts/MockDatabaseContext';
import { useNavigation } from '../contexts/NavigationContext';
import { usePricing } from '../contexts/PricingContext';
import { cn } from '../lib/utils';
import { useGoogleMapsApi } from '../hooks/useGoogleMapsApi';
import { generateMockBuildingData } from '../lib/mockData';
import { calculateEstimate } from '../lib/calculations';
import { INITIAL_SURVEY_STATE } from '../lib/constants';
import { WeatherReport } from '../components/WeatherReport';
import type { User, BuildingData, CalculationResult, SurveyState, Contact, ProjectStage } from '../types';
import { createProject as createProjectApi } from '../lib/api';

const MAPS_API_KEY = (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY || '';

// --- Reusable UI Components ---

const SectionHeader = ({ title, icon: Icon, className }: { title: string, icon: any, className?: string }) => (
    <div className={cn("flex items-center space-x-4 pb-2 mb-6 border-b border-gray-800/30", className)}>
        <div className="flex items-center text-white font-semibold text-lg uppercase tracking-tight">
            <Icon className="w-5 h-5 mr-2 text-gray-400" />
            {title}
        </div>
    </div>
);

const QuestionLabel: React.FC<React.PropsWithChildren<{ required?: boolean, isPink?: boolean }>> = ({ children, required, isPink }) => (
    <label className={cn(
        "block text-[11px] font-bold uppercase tracking-widest mb-2",
        isPink ? "text-white" : "text-gray-400"
    )}>
        {children}
        {required && <span className="text-[#ec028b] ml-1">*</span>}
    </label>
);

const InputField = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>((props, ref) => (
    <input
        ref={ref}
        {...props}
        className={cn(
            "w-full bg-black/30 border border-gray-800 px-4 py-3 text-white focus:border-white/50 focus:ring-1 focus:ring-white/20 focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed",
            props.className
        )}
        style={{
            clipPath: "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)",
            ...props.style
        }}
    />
));
InputField.displayName = "InputField";

const ToggleGroup = ({ options, value, onChange }: { options: string[], value: string, onChange: (val: string) => void }) => (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {options.map((option) => (
            <div
                key={option}
                onClick={() => onChange(option)}
                className={cn(
                    "cursor-pointer px-4 py-2.5 border text-[11px] font-black uppercase tracking-widest transition-all flex items-center justify-center text-center backdrop-blur-sm",
                    value === option
                        ? "bg-white/10 border-white/50 text-white shadow-xl"
                        : "bg-transparent border-gray-800 text-gray-500 hover:border-gray-600 hover:text-white"
                )}
                style={{ clipPath: "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)" }}
            >
                {option}
            </div>
        ))}
    </div>
);

const MultiSelectGroup = ({ options, selected, onChange }: { options: string[], selected: string[], onChange: (opt: string) => void }) => (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {options.map((option) => {
            const isSelected = selected.includes(option);
            return (
                <div
                    key={option}
                    onClick={() => onChange(option)}
                    className={cn(
                        "cursor-pointer px-4 py-2 border text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center text-center backdrop-blur-sm",
                        isSelected
                            ? "bg-white/10 border-white/50 text-white shadow-xl"
                            : "bg-transparent border-gray-800 text-gray-500 hover:border-gray-600 hover:text-white"
                    )}
                    style={{ clipPath: "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)" }}
                >
                    <span>{option}</span>
                </div>
            );
        })}
    </div>
);

const CalendarWidget = ({ onSelectSlot }: { onSelectSlot: (slot: string) => void }) => {
    const [selectedDate, setSelectedDate] = useState<number | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const dates = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(); d.setDate(d.getDate() + i + 1); return d;
    });
    const timeSlots = ["08:00 AM - 10:30 AM", "10:30 AM - 01:00 PM", "01:00 PM - 03:30 PM", "03:30 PM - 06:00 PM"];
    return (
        <div className="bg-black/20 border border-gray-800 rounded-lg p-4 space-y-4 backdrop-blur-sm">
            <div className="flex overflow-x-auto space-x-2 pb-2 scrollbar-hide">
                {dates.map((date, i) => (
                    <button
                        type="button" key={i}
                        onClick={(e) => { e.stopPropagation(); setSelectedDate(i); setSelectedTime(null); }}
                        className={cn("flex flex-col items-center justify-center min-w-[60px] h-16 border transition-all", selectedDate === i ? "bg-white/10 border-white/50 text-white" : "bg-transparent border-gray-800 text-gray-500 hover:border-gray-600")}
                        style={{ clipPath: "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)" }}
                    >
                        <span className="text-[10px] uppercase font-black">{date.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                        <span className="font-black text-lg">{date.getDate()}</span>
                    </button>
                ))}
            </div>
            {selectedDate !== null && (
                <div className="grid grid-cols-1 gap-2 animate-fade-in">
                    {timeSlots.map(slot => (
                        <button
                            type="button" key={slot}
                            onClick={() => {
                                setSelectedTime(slot);
                                const dStr = dates[selectedDate!].toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
                                onSelectSlot(`${dStr} @ ${slot}`);
                            }}
                            className={cn("p-3 text-sm font-bold border transition-all text-left backdrop-blur-sm", selectedTime === slot ? "bg-white/10 border-white/50 text-white" : "bg-transparent border-gray-800 text-gray-400 hover:border-gray-500 hover:text-white")}
                            style={{ clipPath: "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)" }}
                        >
                            {slot}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

// --- Map & Confirmation Components ---

interface AddressData {
    address: string;
    city: string;
    state: string;
    zip: string;
    latitude: number;
    longitude: number;
    placeName?: string;
}

const SolarIntelligenceOverlay = ({ data }: { data: AddressData }) => {
    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden isolate">
            {/* Geometric Scanning Animation */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(236,2,139,0.05)_100%)]" />

            {/* Reticle / Target */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-[#ec028b]/20 rounded-full animate-pulse flex items-center justify-center">
                <div className="w-full h-[1px] bg-[#ec028b]/10 absolute rotate-45" />
                <div className="w-full h-[1px] bg-[#ec028b]/10 absolute -rotate-45" />
                <div className="w-32 h-32 border border-[#ec028b]/40 rounded-full" />
            </div>

            {/* Data Nodes */}
            <div className="absolute top-10 left-10 p-4 bg-black/60 backdrop-blur-md border border-[#ec028b]/30 text-white space-y-2 animate-fade-in"
                style={{ clipPath: "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)" }}>
                <p className="text-[9px] text-[#ec028b] font-black uppercase tracking-widest">Building Intelligence</p>
                <div className="flex justify-between gap-8">
                    <span className="text-gray-400 text-[10px] font-bold uppercase">Estimated Area</span>
                    <span className="font-mono text-xs">3,450 SQ FT</span>
                </div>
                <div className="flex justify-between gap-8">
                    <span className="text-gray-400 text-[10px] font-bold uppercase">Roof Pitch</span>
                    <span className="font-mono text-xs text-[#ec028b]">8/12 - 10/12</span>
                </div>
                <div className="flex justify-between gap-8">
                    <span className="text-gray-400 text-[10px] font-bold uppercase">Complexity</span>
                    <span className="font-mono text-xs text-gold">ELITE (14 Facets)</span>
                </div>
            </div>

            <div className="absolute bottom-10 right-10 p-4 bg-black/60 backdrop-blur-md border border-[#08137C]/50 text-white space-y-2 animate-fade-in delay-150"
                style={{ clipPath: "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)" }}>
                <p className="text-[9px] text-blue-400 font-black uppercase tracking-widest">Solar API Index</p>
                <div className="flex justify-between gap-8">
                    <span className="text-gray-400 text-[10px] font-bold uppercase">Sunshine Exposure</span>
                    <span className="font-mono text-xs">88% (Optimal)</span>
                </div>
                <div className="flex justify-between gap-8">
                    <span className="text-gray-400 text-[10px] font-bold uppercase">Max Panel Count</span>
                    <span className="font-mono text-xs">42 PANELS</span>
                </div>
            </div>

            {/* Animated Scanning Line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-[#ec028b]/20 blur-sm animate-[scan_4s_linear_infinite]" />
        </div>
    );
};

const AddressConfirmationModal: React.FC<{
    data: AddressData,
    onConfirm: () => void,
    onCancel: () => void
}> = ({ data, onConfirm, onCancel }) => {
    const [view, setView] = useState<'street' | 'satellite'>('satellite'); // Default to satellite for "scanning" feel

    const streetUrl = `https://maps.googleapis.com/maps/api/streetview?size=1024x512&location=${data.latitude},${data.longitude}&fov=90&pitch=10&key=${MAPS_API_KEY}`;
    const satUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${data.latitude},${data.longitude}&zoom=21&size=1024x512&maptype=satellite&key=${MAPS_API_KEY}`;

    const chamfer = 24;
    const clipPathValue = `polygon(${chamfer}px 0, 100% 0, 100% calc(100% - ${chamfer}px), calc(100% - ${chamfer}px) 100%, 0 100%, 0 ${chamfer}px)`;

    const ActionButton = ({ onClick, children, variant = 'secondary', icon: Icon }: any) => {
        const bChamfer = 8;
        return (
            <button
                type="button"
                onClick={onClick}
                className={cn(
                    "relative px-5 py-2.5 flex items-center gap-2 group transition-all duration-300 isolate",
                    variant === 'primary' ? "text-white" : "text-gray-400 hover:text-white"
                )}
            >
                <div
                    className={cn(
                        "absolute inset-0 z-[-1] transition-all duration-300",
                        variant === 'primary' ? "bg-white/10 border border-white/30 backdrop-blur-md shadow-xl" : "bg-black/50 border border-gray-800 group-hover:border-gray-500"
                    )}
                    style={{ clipPath: `polygon(${bChamfer}px 0, 100% 0, 100% calc(100% - ${bChamfer}px), calc(100% - ${bChamfer}px) 100%, 0 100%, 0 ${bChamfer}px)` }}
                />
                {Icon && <Icon className="w-4 h-4" />}
                <span className="font-black text-[10px] uppercase tracking-widest">{children}</span>
            </button>
        );
    };

    return createPortal(
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
            <div
                className="bg-black border border-gray-800 w-full max-w-5xl shadow-2xl animate-fade-in overflow-hidden"
                style={{ clipPath: clipPathValue }}
            >
                <div className="relative aspect-[2.2/1] bg-gray-950 border-b border-gray-800 overflow-hidden">
                    <img
                        src={view === 'street' ? streetUrl : satUrl}
                        className="w-full h-full object-cover transition-all duration-700"
                        alt="Location Preview"
                    />
                    <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                    {/* Simulated Building Intelligence Overlay */}
                    {view === 'satellite' && <SolarIntelligenceOverlay data={data} />}
                </div>

                <div className="p-6 bg-black relative">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="flex bg-gray-900 p-1 border border-gray-800 shrink-0" style={{ clipPath: `polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)` }}>
                            <button
                                type="button"
                                onClick={() => setView('street')}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-1.5 text-[9px] font-black uppercase tracking-widest transition-all duration-300",
                                    view === 'street' ? "bg-white/10 text-white border border-white/20" : "text-gray-500 hover:text-gray-300"
                                )}
                                style={{ clipPath: `polygon(3px 0, 100% 0, 100% calc(100% - 3px), calc(100% - 3px) 100%, 0 100%, 0 3px)` }}
                            >
                                <CameraIcon className="w-3.5 h-3.5" />
                                Street View
                            </button>
                            <button
                                type="button"
                                onClick={() => setView('satellite')}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-1.5 text-[9px] font-black uppercase tracking-widest transition-all duration-300",
                                    view === 'satellite' ? "bg-white/10 text-white border border-white/20" : "text-gray-500 hover:text-gray-300"
                                )}
                                style={{ clipPath: `polygon(3px 0, 100% 0, 100% calc(100% - 3px), calc(100% - 3px) 100% , 0 100%, 0 3px)` }}
                            >
                                <SatelliteIcon className="w-3.5 h-3.5" />
                                AI Scanning
                            </button>
                        </div>

                        <div className="flex-1 min-w-0 text-center md:text-left">
                            <p className="text-[9px] text-gray-500 font-black uppercase tracking-[0.3em] mb-1 opacity-60">Universal Intake Target</p>
                            <h3 className="text-white font-bold text-base md:text-lg tracking-tight">
                                {data.address}, {data.city}, {data.state} {data.zip}, USA
                            </h3>
                        </div>

                        <div className="flex gap-4 shrink-0">
                            <ActionButton onClick={onCancel} icon={XIcon}>Start Over</ActionButton>
                            <ActionButton onClick={onConfirm} variant="primary" icon={Check}>Confirm Target</ActionButton>
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

const MapPickerModal: React.FC<{ onClose: () => void, onSelect: (d: AddressData) => void }> = ({ onClose, onSelect }) => {
    const isApiReady = useGoogleMapsApi();
    const mapRef = useRef<HTMLDivElement>(null);
    const [map, setMap] = useState<any>(null);
    const markerRef = useRef<any>(null);
    const [isLocating, setIsLocating] = useState(false);

    const centerOnUser = (showError = false) => {
        if (!navigator.geolocation) return;
        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                if (!map) return;
                const pos = { lat: position.coords.latitude, lng: position.coords.longitude };
                map.setCenter(pos);
                map.setZoom(20);
                if (markerRef.current) markerRef.current.setPosition(pos);
                else {
                    markerRef.current = new window.google.maps.Marker({
                        position: pos, map: map, title: "You are here",
                        icon: { path: window.google.maps.SymbolPath.CIRCLE, scale: 8, fillColor: "#ffffff", fillOpacity: 1, strokeColor: "#000000", strokeWeight: 2 }
                    });
                }
                setIsLocating(false);
            },
            () => setIsLocating(false),
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    };

    useEffect(() => {
        if (!isApiReady || !mapRef.current || map) return;
        const mapInstance = new window.google.maps.Map(mapRef.current, {
            center: { lat: 40.7608, lng: -111.8910 }, zoom: 12, mapTypeId: 'satellite', clickableIcons: false, streetViewControl: false, fullscreenControl: false, zoomControl: true, tilt: 0,
        });
        setMap(mapInstance);
        mapInstance.addListener("click", (e: any) => {
            const latLng = e.latLng;
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode({ location: latLng }, (results: any, status: any) => {
                if (status === "OK" && results[0]) {
                    const place = results[0];
                    const addressComponents = place.address_components;
                    let streetNumber = '', route = '', city = '', state = '', zip = '';
                    if (addressComponents) {
                        for (const component of addressComponents) {
                            const componentType = component.types[0];
                            switch (componentType) {
                                case 'street_number': streetNumber = component.long_name; break;
                                case 'route': route = component.short_name; break;
                                case 'locality': city = component.long_name; break;
                                case 'administrative_area_level_1': state = component.short_name; break;
                                case 'postal_code': zip = component.short_name; break;
                            }
                        }
                    }
                    onSelect({
                        address: streetNumber && route ? `${streetNumber} ${route}` : (place.formatted_address ? place.formatted_address.split(',')[0] : ''),
                        city, state, zip, latitude: latLng.lat(), longitude: latLng.lng(),
                        placeName: place.name !== place.formatted_address ? place.name : undefined
                    });
                }
            });
        });
    }, [isApiReady, map, onSelect]);

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
            <div className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-4xl h-[80vh] flex flex-col shadow-2xl relative overflow-hidden">
                <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-900 z-10">
                    <div><h3 className="text-white font-bold text-lg">Select Location</h3><p className="text-gray-400 text-xs">Tap the exact building on the map</p></div>
                    <button type="button" onClick={onClose} className="p-2 bg-gray-800 rounded-full text-gray-400 hover:text-white transition-colors"><XIcon className="w-6 h-6" /></button>
                </div>
                <div className="flex-1 relative">
                    <div ref={mapRef} className="absolute inset-0 w-full h-full" />
                    <button type="button" onClick={() => centerOnUser(true)} className={cn("absolute bottom-8 right-4 p-4 rounded-full bg-white text-black shadow-2xl hover:bg-gray-200 transition-all z-[10000] flex items-center justify-center border-2 border-black/10", isLocating && "animate-pulse")}><RhiveGeopinIcon className="w-6 h-6" /></button>
                </div>
            </div>
        </div>,
        document.body
    );
};

const AddressSection: React.FC<{
    label: string, data: AddressData, onChange: (data: AddressData) => void, isCollapsed: boolean, setIsCollapsed: (val: boolean) => void, showMaps?: boolean, readOnly?: boolean
}> = ({ label, data, onChange, isCollapsed, setIsCollapsed, showMaps = false, readOnly = false }) => {
    const isApiReady = useGoogleMapsApi();
    const inputRef = useRef<HTMLInputElement>(null);
    const [isMapPickerOpen, setIsMapPickerOpen] = useState(false);
    const [pendingConfirmationData, setPendingConfirmationData] = useState<AddressData | null>(null);

    useEffect(() => {
        if (!isApiReady || !inputRef.current || isCollapsed || readOnly) return;
        const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
            fields: ['address_components', 'geometry', 'formatted_address', 'name'],
            componentRestrictions: { country: 'us' }
        });

        autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();
            if (!place.geometry) return;
            const extracted = {
                address: place.formatted_address?.split(',')[0] || '',
                city: place.address_components?.find((c: any) => c.types.includes('locality'))?.long_name || '',
                state: place.address_components?.find((c: any) => c.types.includes('administrative_area_level_1'))?.short_name || '',
                zip: place.address_components?.find((c: any) => c.types.includes('postal_code'))?.long_name || '',
                latitude: place.geometry.location.lat(), longitude: place.geometry.location.lng(),
                placeName: place.name !== place.formatted_address ? place.name : undefined
            };
            if (showMaps) setPendingConfirmationData(extracted);
            else { onChange(extracted); setIsCollapsed(true); }
        });
    }, [isApiReady, isCollapsed, readOnly]);

    return (
        <div className="space-y-4">
            {isMapPickerOpen && <MapPickerModal onClose={() => setIsMapPickerOpen(false)} onSelect={(d) => { if (showMaps) setPendingConfirmationData(d); else { onChange(d); setIsCollapsed(true); } setIsMapPickerOpen(false); }} />}
            {pendingConfirmationData && (
                <AddressConfirmationModal
                    data={pendingConfirmationData}
                    onCancel={() => setPendingConfirmationData(null)}
                    onConfirm={() => { onChange(pendingConfirmationData); setIsCollapsed(true); setPendingConfirmationData(null); }}
                />
            )}

            {isCollapsed ? (
                <div onClick={() => !readOnly && setIsCollapsed(false)} className={cn("bg-black/20 border border-gray-800 px-4 py-3 flex items-center justify-between shadow-lg transition-all backdrop-blur-md", !readOnly && "cursor-pointer hover:bg-black/40 group")} style={{ clipPath: "polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)" }}>
                    <div className="flex flex-col">
                        <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest mb-1.5">{label}</p>
                        <div className="text-white text-sm font-bold truncate tracking-tight">{data.address || 'Click to select...'}, {data.city} {data.state}</div>
                    </div>
                </div>
            ) : (
                <div className="space-y-4 animate-fade-in bg-black/20 backdrop-blur-sm p-4 rounded-xl border border-gray-800/50">
                    <QuestionLabel>{label} Search</QuestionLabel>
                    <div className="relative">
                        <InputField ref={inputRef} placeholder="Start typing address..." value={data.address} onChange={e => onChange({ ...data, address: e.target.value })} className="pr-12" />
                        <button type="button" onClick={() => setIsMapPickerOpen(true)} className="absolute right-2 top-1/2 -translate-y-1/2 text-white/70 p-2.5 rounded-lg hover:bg-white/10 transition-all"><MapIcon className="w-5 h-5" /></button>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- Contact Form Logic (Matches Screenshot) ---

const FunctionChip = ({ label, icon: Icon, active, onClick }: any) => (
    <button type="button" onClick={onClick} className={cn("flex items-center justify-center gap-3 p-4 border-2 transition-all duration-300 backdrop-blur-md", active ? "bg-white/10 border-white/50 text-white shadow-xl" : "bg-black/30 border-gray-800 text-gray-500 hover:border-gray-700 hover:text-gray-300")} style={{ clipPath: "polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)" }}>
        <Icon className={cn("w-5 h-5", active ? "text-white" : "text-gray-700")} />
        <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
    </button>
);

const MethodButton: React.FC<{ label: string, active: boolean, onClick: () => void }> = ({ label, active, onClick }) => (
    <button
        type="button"
        onClick={onClick}
        className={cn(
            "px-6 py-2 border text-[10px] font-black uppercase tracking-widest transition-all duration-300 backdrop-blur-sm",
            active
                ? "bg-white/10 border-white/50 text-white shadow-xl"
                : "bg-transparent border-gray-800 text-gray-500 hover:text-white hover:border-gray-600"
        )}
        style={{ clipPath: "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)" }}
    >
        {label}
    </button>
);

const ContactForm: React.FC<{ initialData?: Contact, companyName?: string, propertyName?: string, onSave: (c: Contact) => void, onCancel: () => void, isPrimary: boolean, projectCategory: string }> = ({ initialData, companyName, propertyName, onSave, onCancel, isPrimary, projectCategory }) => {
    const { users } = useMockDB();
    const [data, setData] = useState<Partial<Contact>>(initialData || {
        firstName: '', lastName: '', phone: '', email: '', role: projectCategory === 'Residential' ? 'Property Owner' : 'Property Manager', preferredContactMethod: 'Text', responsibilities: [], affiliations: []
    });
    const [activeRoleCategory, setActiveRoleCategory] = useState<'Residential' | 'Commercial' | 'Government'>((projectCategory as any) || 'Residential');

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let v = e.target.value.replace(/\D/g, '');
        if (v.length > 0) v = '(' + v.substring(0, 3) + (v.length > 3 ? ') ' + v.substring(3, 6) : '') + (v.length > 6 ? '-' + v.substring(6, 10) : '');
        setData({ ...data, phone: v });
    };

    const handleNameChange = (field: 'firstName' | 'lastName', value: string) => {
        const capitalized = value.charAt(0).toUpperCase() + value.slice(1);
        setData({ ...data, [field]: capitalized });
    };

    const toggleAffiliation = (aff: string) => {
        const current = data.affiliations || [];
        const exists = current.includes(aff);
        setData({ ...data, affiliations: exists ? current.filter(a => a !== aff) : [...current, aff] });
    };

    const toggleResponsibility = (opt: string) => {
        const current = data.responsibilities || [];
        const exists = current.includes(opt);
        setData({ ...data, responsibilities: exists ? current.filter(r => r !== opt) : [...current, opt] });
    };

    const roleCategories = {
        'Residential': ['Property Owner', 'Landlord', 'Tenant', 'Neighbor', 'Relative', 'Other'],
        'Commercial': ['Property Manager', 'Building Owner', 'Maintenance Supervisor', 'HOA Board Member', 'Other'],
        'Government': ['Contracting Officer', 'Site Representative', 'Facility Manager', 'Other']
    };

    return (
        <Card className="animate-fade-in shadow-2xl relative overflow-hidden isolate">
            <CardContent className="p-10 space-y-10">
                <div className="flex items-center justify-between">
                    <h4 className="text-white/70 font-black text-xs uppercase tracking-[0.4em]">{isPrimary ? 'PRIMARY CONTACT' : 'STAKEHOLDER NODE'}</h4>
                    {isPrimary && <div className="w-2 h-2 rounded-full bg-white shadow-xl" />}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <div className="space-y-2"><QuestionLabel required>First Name</QuestionLabel><InputField value={data.firstName} onChange={e => handleNameChange('firstName', e.target.value)} /></div>
                    <div className="space-y-2"><QuestionLabel required>Last Name</QuestionLabel><InputField value={data.lastName} onChange={e => handleNameChange('lastName', e.target.value)} /></div>
                    <div className="space-y-2"><QuestionLabel required>Phone Number</QuestionLabel><InputField placeholder="(000) 000-0000" value={data.phone} onChange={handlePhoneChange} /></div>
                    <div className="space-y-2"><QuestionLabel required>Email Address</QuestionLabel><InputField type="email" placeholder="example@domain.com" value={data.email} onChange={e => setData({ ...data, email: e.target.value })} /></div>
                </div>

                <div className="space-y-4">
                    <QuestionLabel required isPink>Preferred Contact Method</QuestionLabel>
                    <div className="flex flex-wrap gap-4">
                        {(['Phone', 'Text', 'Email'] as const).map(m => (
                            <MethodButton
                                key={m}
                                label={m}
                                active={data.preferredContactMethod === m}
                                onClick={() => setData({ ...data, preferredContactMethod: m })}
                            />
                        ))}
                    </div>
                </div>

                {projectCategory !== 'Residential' && (companyName || propertyName) && (
                    <div className="space-y-4">
                        <QuestionLabel>Affiliation (Select all that apply)</QuestionLabel>
                        <div className="flex flex-wrap gap-4">
                            {companyName && (
                                <button type="button" onClick={() => toggleAffiliation('Company')} className={cn("px-6 py-3 border text-[11px] font-black uppercase tracking-widest transition-all backdrop-blur-md", data.affiliations?.includes('Company') ? "bg-white/10 border-white/50 text-white shadow-xl" : "bg-transparent border-gray-800 text-gray-300 hover:text-gray-300")} style={{ clipPath: "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)" }}>
                                    {companyName}
                                </button>
                            )}
                            {propertyName && (
                                <button type="button" onClick={() => toggleAffiliation('Property')} className={cn("px-6 py-3 border text-[11px] font-black uppercase tracking-widest transition-all backdrop-blur-md", data.affiliations?.includes('Property') ? "bg-white/10 border-white/50 text-white shadow-xl" : "bg-transparent border-gray-800 text-gray-500 hover:text-gray-300")} style={{ clipPath: "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)" }}>
                                    {propertyName}
                                </button>
                            )}
                        </div>
                        <p className="text-[10px] text-gray-600 font-bold italic ml-1">Link this contact to the Company, the Property, or both.</p>
                    </div>
                )}

                <div className="space-y-4">
                    <QuestionLabel>Contact Functions (Select all that apply)</QuestionLabel>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FunctionChip label="Bid / Quote" icon={DocumentTextIcon} active={data.responsibilities?.includes('Bid')} onClick={() => toggleResponsibility('Bid')} />
                        <FunctionChip label="Billing / Invoice" icon={CurrencyDollarIcon} active={data.responsibilities?.includes('Billing')} onClick={() => toggleResponsibility('Billing')} />
                        <FunctionChip label="Site Access" icon={RhiveGeopinIcon} active={data.responsibilities?.includes('Access')} onClick={() => toggleResponsibility('Access')} />
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <QuestionLabel>Project Role</QuestionLabel>
                        <div className="flex gap-4">
                            {(['Residential', 'Commercial', 'Government'] as const).map(cat => (
                                <button key={cat} type="button" onClick={() => setActiveRoleCategory(cat)} className={cn("text-[10px] font-black uppercase tracking-widest transition-all", activeRoleCategory === cat ? "text-white" : "text-gray-700 hover:text-gray-500")}>{cat}</button>
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {roleCategories[activeRoleCategory].map(role => (
                            <button key={role} type="button" onClick={() => setData({ ...data, role })} className={cn("px-4 py-2 border text-[10px] font-black uppercase tracking-tighter transition-all", data.role === role ? "bg-white/10 border-white/30 text-white" : "bg-transparent border-gray-800 text-gray-500 hover:border-gray-600 hover:text-gray-400")} style={{ clipPath: "polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)" }}>{role}</button>
                        ))}
                    </div>
                </div>

                <div className="flex justify-end gap-4 pt-8 border-t border-gray-800/50">
                    <Button variant="secondary" onClick={onCancel}>Cancel</Button>
                    <button type="button" onClick={() => onSave({ id: data.id || String(Date.now()), ...data, isPrimary } as Contact)} className="px-12 py-4 bg-white/10 border border-white/30 text-white font-black text-[11px] uppercase tracking-[0.3em] rounded-xl hover:bg-white/20 transition-all shadow-xl" style={{ clipPath: "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)" }}>Save Contact</button>
                </div>
            </CardContent>
        </Card>
    );
};

const SuccessModal = ({ onNavigate }: { onNavigate: () => void }) => {
    useEffect(() => {
        const timer = setTimeout(onNavigate, 3000);
        return () => clearTimeout(timer);
    }, [onNavigate]);

    return createPortal(
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 animate-in fade-in duration-500">
            <div className="relative max-w-lg w-full bg-black border border-[#ec028b]/30 shadow-[0_0_100px_rgba(236,2,139,0.2)] p-12 text-center overflow-hidden"
                style={{ clipPath: "polygon(40px 0, 100% 0, 100% calc(100% - 40px), calc(100% - 40px) 100%, 0 100%, 0 40px)" }}>

                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(236,2,139,0.1)_0%,transparent_70%)]" />

                <div className="relative z-10 flex flex-col items-center gap-6">
                    <div className="w-24 h-24 rounded-full border-2 border-[#ec028b] flex items-center justify-center shadow-[0_0_30px_rgba(236,2,139,0.4)] animate-pulse">
                        <Check className="w-12 h-12 text-[#ec028b]" />
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-3xl font-black text-white uppercase tracking-tighter">System Locked</h2>
                        <p className="text-gray-400 font-medium tracking-wide">Lead entry successfully</p>
                    </div>

                    <div className="flex items-center gap-3 text-[#ec028b] text-xs font-black uppercase tracking-widest animate-pulse">
                        <span className="w-2 h-2 bg-[#ec028b] rounded-full" />
                        Redirecting to Dashboard...
                    </div>

                    <Button onClick={onNavigate} className="w-full mt-4 bg-[#ec028b]/10 border border-[#ec028b]/50 text-[#ec028b] hover:bg-[#ec028b] hover:text-white transition-all uppercase tracking-widest font-black py-4">
                        Access Dashboard Now
                    </Button>
                </div>
            </div>
        </div>,
        document.body
    );
};

// --- Main Page Component ---

const CustomerInputPage: React.FC = () => {
    const { addUser, createProject, users } = useMockDB();
    const { setActivePageId } = useNavigation();
    const { pricing } = usePricing();
    const isApiReady = useGoogleMapsApi();

    const propertyNameRef = useRef<HTMLInputElement>(null);
    const [propertyData, setPropertyData] = useState<AddressData>({ address: '', city: '', state: '', zip: '', latitude: 0, longitude: 0 });
    const [isPropertyCollapsed, setIsPropertyCollapsed] = useState(false);
    const [projectCategory, setProjectCategory] = useState<'Residential' | 'Commercial' | 'Government'>('Residential');
    const [isInsurance, setIsInsurance] = useState(false);
    const [isTypeCollapsed, setIsTypeCollapsed] = useState(false);
    const [companyData, setCompanyData] = useState({ parentCompany: '', propertyName: '' });
    const [isOrgCollapsed, setIsOrgCollapsed] = useState(false);
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [isAddingContact, setIsAddingContact] = useState(true);
    const [editingContactId, setEditingContactId] = useState<string | null>(null);
    const [insuranceInfo, setInsuranceInfo] = useState({ carrier: '', claimNumber: '', deductible: '', dateOfLoss: '', damageType: [] as string[] });
    const [insuranceStatus, setInsuranceStatus] = useState('Not Sure');
    const [isInsuranceInfoCollapsed, setIsInsuranceInfoCollapsed] = useState(false);
    const [billingData, setBillingData] = useState<AddressData>({ address: '', city: '', state: '', zip: '', latitude: 0, longitude: 0 });
    const [billToName, setBillToName] = useState('');
    const [isBillingCollapsed, setIsBillingCollapsed] = useState(true);
    const [isBillingConfirmed, setIsBillingConfirmed] = useState(false);
    const [scopeType, setScopeType] = useState<'Repair' | 'Replacement'>('Replacement');
    const [repairDetails, setRepairDetails] = useState({ isOld: false, activeLeak: false, hasPhotos: false, emergencyTarp: false });
    const [purchaseIntent, setPurchaseIntent] = useState<'Ready' | 'Exploring' | ''>('');
    const [isIntentCollapsed, setIsIntentCollapsed] = useState(false);
    const [scheduledDetails, setScheduledDetails] = useState<string | null>(null);

    const isCommercialOrGov = projectCategory === 'Commercial' || projectCategory === 'Government';

    const isInspectionRequired = isCommercialOrGov || isInsurance || repairDetails.activeLeak || (
        scopeType === 'Repair' && (
            repairDetails.isOld ||
            !repairDetails.hasPhotos
        )
    );

    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        if (!isApiReady || !propertyNameRef.current || !isCommercialOrGov || isOrgCollapsed) return;
        const autocomplete = new window.google.maps.places.Autocomplete(propertyNameRef.current, {
            fields: ['formatted_address', 'geometry', 'name', 'address_components'],
            componentRestrictions: { country: 'us' }
        });

        autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();
            if (!place.geometry) return;

            const name = place.name || '';
            const extracted = {
                address: place.formatted_address?.split(',')[0] || '',
                city: place.address_components?.find((c: any) => c.types.includes('locality'))?.long_name || '',
                state: place.address_components?.find((c: any) => c.types.includes('administrative_area_level_1'))?.short_name || '',
                zip: place.address_components?.find((c: any) => c.types.includes('postal_code'))?.long_name || '',
                latitude: place.geometry.location.lat(), longitude: place.geometry.location.lng(),
            };

            setCompanyData(prev => ({ ...prev, propertyName: name }));

            if (!isBillingConfirmed) {
                setBillToName(name);
                setBillingData(extracted);
            }
        });
    }, [isApiReady, isCommercialOrGov, isOrgCollapsed]);

    useEffect(() => {
        if (isBillingConfirmed) return;

        if (projectCategory === 'Residential') {
            const primary = contacts.find(c => c.isPrimary) || contacts[0];
            if (primary) {
                setBillToName(`${primary.firstName} ${primary.lastName}`);
            }
            setBillingData(propertyData);
            if (propertyData.address && !companyData.propertyName) {
                setCompanyData(prev => ({ ...prev, propertyName: propertyData.address }));
            }
        } else if (isCommercialOrGov) {
            if (companyData.parentCompany) {
                setBillToName(companyData.parentCompany);
            }
        }
    }, [projectCategory, contacts, propertyData, companyData.parentCompany, isBillingConfirmed]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (contacts.length === 0) return alert("Please add at least one contact.");
        const primary = contacts.find(c => c.isPrimary) || contacts[0];
        const projNameStr = isCommercialOrGov ? (companyData.propertyName || propertyData.address) : `${primary.lastName} Residence`;

        try {
            await createProjectApi({
                userId: primary.existingUserId || 'U-NEW',
                name: projNameStr,
                type: projectCategory,
                property: {
                    address: propertyData.address,
                    city: propertyData.city,
                    state: propertyData.state,
                    zip: propertyData.zip,
                    latitude: propertyData.latitude,
                    longitude: propertyData.longitude
                },
                organization: (companyData.parentCompany || companyData.propertyName) ? {
                    parentCompany: companyData.parentCompany,
                    propertyName: companyData.propertyName
                } : undefined,
                insurance: isInsurance ? {
                    isClaim: true,
                    carrier: insuranceInfo.carrier,
                    status: insuranceStatus,
                    claimNumber: insuranceInfo.claimNumber,
                    deductible: insuranceInfo.deductible,
                    dateOfLoss: insuranceInfo.dateOfLoss,
                    damageType: insuranceInfo.damageType
                } : undefined,
                billing: {
                    name: billToName || 'Same as Property',
                    address: billingData
                },
                contacts: contacts.map(c => ({
                    firstName: c.firstName,
                    lastName: c.lastName,
                    phone: c.phone,
                    email: c.email,
                    role: c.role,
                    isPrimary: c.isPrimary || false,
                    preferredContactMethod: c.preferredContactMethod,
                    responsibilities: c.responsibilities || [],
                    affiliations: c.affiliations || []
                })),
                details: {
                    purchaseIntent: purchaseIntent,
                    scopeType: scopeType,
                    activeLeak: repairDetails.activeLeak,
                    isOld: repairDetails.isOld,
                    hasPhotos: repairDetails.hasPhotos,
                    scheduledInspection: scheduledDetails || undefined
                }
            });
            console.log("✅ Project and Property successfully saved to Firebase!");
            setIsSuccess(true);
        } catch (error) {
            console.error("❌ Failed to save project to database:", error);
            alert(`Failed to save to Firebase: ${error instanceof Error ? error.message : 'Unknown error'}. Check browser console for details.`);
        }
    };

    const handleDeductibleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.replace(/\D/g, '');
        const formatted = val ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(Number(val)) : '';
        setInsuranceInfo({ ...insuranceInfo, deductible: formatted });
    };

    const handleCarrierChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        const capitalized = val.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        setInsuranceInfo({ ...insuranceInfo, carrier: capitalized });
    };

    const handleQuickAddPropertyName = () => {
        if (propertyData.placeName) {
            setCompanyData(prev => ({ ...prev, propertyName: propertyData.placeName }));
            if (!isBillingConfirmed) {
                setBillToName(propertyData.placeName);
                setBillingData(propertyData);
            }
        } else if (propertyData.address) {
            const street = propertyData.address.split(',')[0].replace(/^\d+\s+/, '');
            setCompanyData(prev => ({ ...prev, propertyName: street }));
            if (!isBillingConfirmed) {
                setBillToName(street);
                setBillingData(propertyData);
            }
        }
    };

    const projectLabel = isCommercialOrGov ? (companyData.propertyName || propertyData.address || "Unnamed Project") : (contacts[0]?.lastName ? contacts[0].lastName + ' Residence' : 'New Project');

    return (
        <PageContainer title="New Lead Entry" description="Sequential intake logic for clean data nodes.">
            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto pb-32 space-y-8">

                {/* 1. ADDRESS SEARCH */}
                <AddressSection label="Property Location" data={propertyData} onChange={setPropertyData} isCollapsed={isPropertyCollapsed} setIsCollapsed={setIsPropertyCollapsed} showMaps={true} />

                {/* 2. PROJECT TYPE */}
                {isTypeCollapsed ? <RenderCollapsedSection title="Project Type" summary={`${projectCategory}${isInsurance ? ' [Insurance]' : ''}`} onEdit={() => setIsTypeCollapsed(false)} /> : (
                    <Card className="animate-fade-in shadow-2xl">
                        <CardContent className="p-8 space-y-6">
                            <SectionHeader title="Project Type" icon={BuildingStorefrontIcon} />
                            <ToggleGroup options={['Residential', 'Commercial', 'Government']} value={projectCategory} onChange={v => setProjectCategory(v as any)} />
                            <div
                                onClick={() => setIsInsurance(!isInsurance)}
                                className={cn(
                                    "mt-4 cursor-pointer px-4 py-4 border text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center backdrop-blur-md",
                                    isInsurance ? "bg-white/10 border-white/50 text-white shadow-xl" : "bg-transparent border-gray-800 text-gray-500 hover:border-gray-600 hover:text-gray-300"
                                )}
                                style={{ clipPath: "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)" }}
                            >
                                {isInsurance ? "✓ Insurance Claim" : "Is this an Insurance Claim?"}
                            </div>
                            <div className="flex justify-end pt-4"><Button size="sm" onClick={() => setIsTypeCollapsed(true)}>Continue to {isCommercialOrGov ? 'Organization' : 'Contacts'}</Button></div>
                        </CardContent>
                    </Card>
                )}

                {/* 2.5 ORGANIZATION (COMMERCIAL/GOV ONLY) */}
                {isCommercialOrGov && (
                    <div className="animate-fade-in">
                        {isOrgCollapsed ? <RenderCollapsedSection title="Organization" summary={`${companyData.parentCompany || 'N/A'} • ${companyData.propertyName || 'N/A'}`} onEdit={() => setIsOrgCollapsed(false)} /> : (
                            <Card className="shadow-2xl relative overflow-hidden isolate">
                                <CardContent className="p-8 space-y-8">
                                    <SectionHeader title="Organization Details" icon={BriefcaseIcon} className="border-none mb-4" />
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <QuestionLabel>Parent Company / Owner</QuestionLabel>
                                            <div className="relative">
                                                <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                                <InputField className="pl-11 h-14" placeholder="Search Companies..." value={companyData.parentCompany} onChange={e => setCompanyData({ ...companyData, parentCompany: e.target.value })} />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <QuestionLabel>Property Name / Site</QuestionLabel>
                                            <div className="relative">
                                                <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                                <InputField ref={propertyNameRef} className="pl-11 h-14" placeholder="e.g. Willow Park Apartments" value={companyData.propertyName} onChange={e => setCompanyData({ ...companyData, propertyName: e.target.value })} />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={handleQuickAddPropertyName}
                                                className="px-3 py-1.5 bg-white/5 border border-gray-800 text-[10px] font-black uppercase tracking-tighter text-gray-500 hover:text-white hover:border-gray-600 transition-all"
                                                style={{ clipPath: "polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)" }}
                                            >
                                                Use Site Address
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex justify-end pt-4"><Button size="sm" onClick={() => setIsOrgCollapsed(true)}>Next: Contact Discovery</Button></div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                )}

                {/* 3. CONTACTS */}
                <div className="space-y-4">
                    <SectionHeader title="Contact Directory" icon={UserIcon} />
                    {contacts.map(c => (
                        editingContactId === c.id ?
                            <ContactForm key={c.id} initialData={c} companyName={companyData.parentCompany} propertyName={companyData.propertyName} onSave={(upd) => { setContacts(prev => prev.map(ex => ex.id === upd.id ? upd : ex)); setEditingContactId(null); }} onCancel={() => setEditingContactId(null)} isPrimary={c.isPrimary} projectCategory={projectCategory} /> :
                            <ContactCard key={c.id} contact={c} onEdit={() => setEditingContactId(c.id)} onDelete={() => setContacts(p => p.filter(x => x.id !== c.id))} />
                    ))}
                    {(isAddingContact || contacts.length === 0) && !editingContactId && (
                        <ContactForm companyName={companyData.parentCompany} propertyName={companyData.propertyName} onSave={c => { setContacts(p => [...p, c]); setIsAddingContact(false); }} onCancel={() => setIsAddingContact(false)} isPrimary={contacts.length === 0} projectCategory={projectCategory} />
                    )}
                    {!editingContactId && !isAddingContact && <div onClick={() => setIsAddingContact(true)} className="py-4 border-2 border-dashed border-gray-800/30 rounded-[24px] text-gray-600 hover:border-white/30 hover:text-white transition-all flex items-center justify-center font-black text-xs uppercase tracking-widest cursor-pointer group backdrop-blur-sm"><PlusIcon className="w-4 h-4 mr-2 group-hover:scale-125 transition-transform" /> Add Stakeholder</div>}
                </div>

                {isInsurance && (
                    isInsuranceInfoCollapsed ? <RenderCollapsedSection title="Insurance Details" summary={`${insuranceInfo.carrier} - ${insuranceStatus}`} onEdit={() => setIsInsuranceInfoCollapsed(false)} /> : (
                        <Card className="shadow-2xl border-gray-800/50">
                            <CardContent className="p-8 space-y-6">
                                <SectionHeader title="Insurance Profile" icon={ShieldCheckIcon} />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div><QuestionLabel>Carrier</QuestionLabel><InputField placeholder="e.g. State Farm" value={insuranceInfo.carrier} onChange={handleCarrierChange} /></div>
                                    <div><QuestionLabel>Status</QuestionLabel><ToggleGroup options={['Approved', 'Process', 'Interest', 'Not Sure']} value={insuranceStatus} onChange={setInsuranceStatus} /></div>
                                    <div><QuestionLabel>Claim #</QuestionLabel><InputField style={{ textTransform: 'uppercase' }} placeholder="CLAIM #" value={insuranceInfo.claimNumber} onChange={e => setInsuranceInfo({ ...insuranceInfo, claimNumber: e.target.value.toUpperCase() })} /></div>
                                    <div><QuestionLabel>Deductible</QuestionLabel><InputField placeholder="$1,000" value={insuranceInfo.deductible} onChange={handleDeductibleChange} /></div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <QuestionLabel>Type of Damage</QuestionLabel>
                                        <MultiSelectGroup options={['Wind', 'Hail', 'Mechanical']} selected={insuranceInfo.damageType} onChange={v => setInsuranceInfo(p => ({ ...p, damageType: p.damageType.includes(v) ? p.damageType.filter(x => x !== v) : [...p.damageType, v] }))} />
                                    </div>
                                    <div><QuestionLabel>Date of Loss</QuestionLabel><InputField type="date" value={insuranceInfo.dateOfLoss} onChange={e => setInsuranceInfo({ ...insuranceInfo, dateOfLoss: e.target.value })} /></div>
                                </div>
                                <div className="mt-6 border-t border-gray-800/50 pt-6">
                                    <QuestionLabel>Storm History (Selection autofills Type & Date)</QuestionLabel>
                                    <WeatherReport onDateSelect={d => {
                                        const dmgType = d.includes('2023-08-15') || d.includes('2021-07-03') ? ['Hail'] : ['Wind'];
                                        setInsuranceInfo({ ...insuranceInfo, dateOfLoss: d, damageType: dmgType });
                                    }} />
                                </div>
                                <div className="flex justify-end pt-4"><Button size="sm" onClick={() => setIsInsuranceInfoCollapsed(true)}>Continue</Button></div>
                            </CardContent>
                        </Card>
                    )
                )}

                {/* 4. BILLING */}
                <div className="animate-fade-in">
                    {isBillingCollapsed ? (
                        <div
                            onClick={() => setIsBillingCollapsed(false)}
                            className={cn("border p-6 flex items-center justify-between group cursor-pointer transition-all mb-6 backdrop-blur-md", isBillingConfirmed ? "border-white/20 bg-black/40" : "border-gray-800 bg-black/10")}
                            style={{ clipPath: "polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)" }}
                        >
                            <div>
                                <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest mb-1.5">Billing Confirmation Required</p>
                                <div className="text-white font-bold tracking-tight text-lg">{billToName || 'Unspecified'} • {billingData.address || 'Address Required'}</div>
                            </div>
                            <div className={cn("transition-colors", isBillingConfirmed ? "text-white" : "text-gray-500 group-hover:text-white")}>{isBillingConfirmed ? <Check className="w-6 h-6" /> : <PencilSquareIcon className="w-6 h-6" />}</div>
                        </div>
                    ) : (
                        <Card className={cn("animate-fade-in shadow-2xl", isBillingConfirmed ? "border-white/20" : "border-gray-800")}>
                            <CardContent className="p-8 space-y-6">
                                <SectionHeader title="Billing Profile" icon={DocumentTextIcon} />
                                <div className="space-y-4">
                                    <div><QuestionLabel>Bill To Entity / Individual</QuestionLabel><InputField placeholder="Company or Individual Name" value={billToName} onChange={e => setBillToName(e.target.value)} /></div>
                                    <AddressSection label="Billing Address" data={billingData} onChange={setBillingData} isCollapsed={false} setIsCollapsed={() => { }} />
                                </div>
                                <div className="flex justify-end gap-3 pt-4">
                                    {isBillingConfirmed && <Button variant="secondary" size="sm" onClick={() => setIsBillingCollapsed(true)}>Hide Section</Button>}
                                    <button
                                        type="button"
                                        onClick={() => { setIsBillingConfirmed(true); setIsBillingCollapsed(true); }}
                                        className="px-8 py-3 bg-white/10 border border-white/30 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-white/20 transition-all shadow-xl"
                                        style={{ clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)" }}
                                    >
                                        Confirm Billing Node
                                    </button>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* 5. PROJECT INTENT */}
                {isIntentCollapsed ? <RenderCollapsedSection title="Project Intent" summary={scheduledDetails || (scopeType + ' • ' + (purchaseIntent || 'Pending'))} onEdit={() => setIsIntentCollapsed(false)} /> : (
                    <Card className="shadow-2xl">
                        <CardContent className="p-8 space-y-6">
                            <SectionHeader title="Project Intent" icon={SparklesIcon} />
                            <div className="space-y-6">
                                <div><QuestionLabel>Nature of Work</QuestionLabel><ToggleGroup options={['Replacement', 'Repair']} value={scopeType} onChange={v => setScopeType(v as any)} /></div>
                                <div className="p-5 bg-black/30 backdrop-blur-md border border-gray-800/50 space-y-6" style={{ clipPath: "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)" }}>
                                    <div><QuestionLabel>Active Leak Detected?</QuestionLabel><ToggleGroup options={['Yes', 'No']} value={repairDetails.activeLeak ? 'Yes' : 'No'} onChange={v => setRepairDetails(p => ({ ...p, activeLeak: v === 'Yes' }))} /></div>
                                    {scopeType === 'Repair' && (
                                        <div className="animate-fade-in space-y-6">
                                            <div><QuestionLabel>Is the system older than 15 years?</QuestionLabel><ToggleGroup options={['Yes', 'No']} value={repairDetails.isOld ? 'Yes' : 'No'} onChange={v => setRepairDetails(p => ({ ...p, isOld: v === 'Yes' }))} /></div>
                                            {!repairDetails.isOld && (
                                                <div><QuestionLabel>Client has photos of damage?</QuestionLabel><ToggleGroup options={['Yes', 'No']} value={repairDetails.hasPhotos ? 'Yes' : 'No'} onChange={v => setRepairDetails(p => ({ ...p, hasPhotos: v === 'Yes' }))} /></div>
                                            )}
                                        </div>
                                    )}
                                </div>
                                {!repairDetails.activeLeak && !isInsurance && (
                                    <div className="space-y-3">
                                        <QuestionLabel>What is the goal today?</QuestionLabel>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div
                                                onClick={() => setPurchaseIntent('Ready')}
                                                className={cn("p-6 border cursor-pointer transition-all group backdrop-blur-md", purchaseIntent === 'Ready' ? "bg-white/10 border-white/50 shadow-xl" : "border-gray-800 bg-black/10 hover:border-gray-600")}
                                                style={{ clipPath: "polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)" }}
                                            >
                                                <p className="font-black text-xs text-white uppercase tracking-widest group-hover:text-white transition-colors">Direct Install</p>
                                                <p className="text-[10px] text-gray-500 uppercase mt-1">Ready to sign & schedule</p>
                                            </div>
                                            <div
                                                onClick={() => setPurchaseIntent('Exploring')}
                                                className={cn("p-6 border cursor-pointer transition-all group backdrop-blur-md", purchaseIntent === 'Exploring' ? "bg-white/10 border-white/50 shadow-xl" : "border-gray-800 bg-black/10 hover:border-gray-600")}
                                                style={{ clipPath: "polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)" }}
                                            >
                                                <p className="font-black text-xs text-white uppercase tracking-widest group-hover:text-white transition-colors">Ballpark Analysis</p>
                                                <p className="text-[10px] text-gray-500 uppercase mt-1">Seeking instant estimate</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {isInspectionRequired && (
                                    <div className="mt-8 pt-8 border-t border-gray-800/50">
                                        <h4 className="text-white/70 font-black text-xs uppercase tracking-[0.3em] mb-6 flex items-center"><CalendarDaysIcon className="w-4 h-4 mr-2" /> Site Inspection Scheduling</h4>
                                        <CalendarWidget onSelectSlot={s => { setScheduledDetails(s); setIsIntentCollapsed(true); }} />
                                    </div>
                                )}
                            </div>
                            <div className="flex justify-end pt-4"><Button size="sm" onClick={() => setIsIntentCollapsed(true)}>Confirm Intent</Button></div>
                        </CardContent>
                    </Card>
                )}

                {/* 6. FINAL ACTION HUB */}
                <Card className="border-gray-800/80 shadow-2xl animate-fade-in mt-12 overflow-hidden bg-black/30 backdrop-blur-lg">
                    <CardContent className="p-10 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex flex-col">
                            <span className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em] mb-2">{purchaseIntent === 'Exploring' ? "Ready for Analysis:" : "Ready to Commit:"}</span>
                            <span className="text-white font-black text-2xl uppercase tracking-tighter">{projectLabel}</span>
                        </div>
                        <div className="flex gap-4">
                            <Button variant="secondary" size="lg" onClick={() => setActivePageId('E-01')}>Cancel</Button>
                            <Button size="lg" type="submit" className="shadow-2xl border border-white/20 bg-white/10 text-white hover:bg-white/20">Launch Project Core</Button>
                        </div>
                    </CardContent>
                </Card>
                <button type="submit" className="hidden" /> {/* Implicit submit for enter key if needed, or just relying on the buttons */}
            </form>
            {isSuccess && <SuccessModal onNavigate={() => setActivePageId('E-01')} />}
        </PageContainer >
    );
};

const ContactCard: React.FC<{ contact: Contact; onEdit: () => void; onDelete: () => void }> = ({ contact, onEdit, onDelete }) => (
    <div
        onClick={onEdit}
        className="flex items-center justify-between p-6 bg-black/30 backdrop-blur-md border border-gray-800 hover:border-white/30 transition-all cursor-pointer group shadow-xl"
        style={{ clipPath: "polygon(24px 0, 100% 0, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0 100%, 0 24px)" }}
    >
        <div className="flex items-center space-x-6">
            <div className={cn("w-14 h-14 border flex items-center justify-center text-white font-black text-xl transition-all", contact.isPrimary ? "bg-white/10 border-white/30" : "bg-gray-900 border-gray-800 group-hover:border-white/20")} style={{ clipPath: "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)" }}>{contact.firstName[0]}</div>
            <div>
                <h4 className="text-white font-bold text-lg leading-none mb-1.5 group-hover:text-white transition-colors">{contact.firstName} {contact.lastName}</h4>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-widest">{contact.role} • <span className="text-white/70">{contact.phone}</span></p>
                <div className="flex gap-2 mt-3">
                    {contact.responsibilities && contact.responsibilities.map(r => (
                        <span key={r} className="text-[8px] bg-black border border-gray-800 px-2 py-0.5 rounded text-gray-600 uppercase font-black tracking-tighter">{r}</span>
                    ))}
                </div>
            </div>
        </div>
        <div className="flex items-center gap-4">
            <PencilSquareIcon className="w-5 h-5 text-gray-700 group-hover:text-white transition-all" />
            {!contact.isPrimary && <button onClick={e => { e.stopPropagation(); onDelete(); }} className="p-3 text-gray-700 hover:text-red-500 transition-colors"><TrashIcon className="w-5 h-5" /></button>}
        </div>
    </div>
);

const RenderCollapsedSection = ({ title, summary, onEdit }: { title: string, summary: React.ReactNode, onEdit: () => void }) => (
    <div
        onClick={onEdit}
        className="border border-gray-800 bg-black/20 backdrop-blur-md p-6 flex items-center justify-between group cursor-pointer hover:border-white/20 transition-all mb-6 shadow-lg"
        style={{ clipPath: "polygon(24px 0, 100% 0, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0 100%, 0 24px)" }}
    >
        <div>
            <p className="text-[9px] text-gray-500 font-black uppercase tracking-[0.2em] mb-1.5">{title}</p>
            <div className="text-white font-bold tracking-tight text-lg">{summary}</div>
        </div>
        <div className="text-gray-700 group-hover:text-white transition-colors">
            <PencilSquareIcon className="w-6 h-6" />
        </div>
    </div>
);

export default CustomerInputPage;