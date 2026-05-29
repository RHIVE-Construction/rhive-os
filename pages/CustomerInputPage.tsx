
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import PageContainer from '../components/PageContainer';
import Button from '../components/Button';
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
    DocumentTextIcon,
    ShieldCheckIcon,
    KeyIcon,
    CurrencyDollarIcon,
    RulerIcon,
    BoltIcon,
    ListBulletIcon,
    CalendarDaysIcon,
    CameraIcon,
    SatelliteIcon,
    ShareIcon,
    MegaphoneIcon,
    CloudArrowUpIcon,
    MagnifyingGlassIcon,
    TrashIcon,
    SparklesIcon,
    GutterIcon,
    HeatTraceIcon,
    ArrowRightIcon
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
import type { User, BuildingData, CalculationResult, SurveyState, Contact, Property, EaveOverhang, ProjectStage } from '../types';

// Mock Data for Utah Companies
const MOCK_UTAH_COMPANIES = [
    { name: 'UNPHC (United Property Management)', address: '123 Corporate Blvd', city: 'Salt Lake City', state: 'UT', zip: '84101' },
    { name: 'Willow Park HOA', address: '525 Aspen Meadow Dr', city: 'Logan', state: 'UT', zip: '84341' },
    { name: 'Larry H Miller Group', address: '9350 S 150 E', city: 'Sandy', state: 'UT', zip: '84070' },
    { name: 'Greystar Real Estate', address: '222 S Main St', city: 'Salt Lake City', state: 'UT', zip: '84101' },
    { name: 'AMC Theatres Corporate', address: '11500 Ash St', city: 'Leawood', state: 'KS', zip: '66211' },
    { name: 'IHC (Intermountain Health)', address: '36 S State St', city: 'Salt Lake City', state: 'UT', zip: '84111' },
    { name: 'Wasatch Property Management', address: '595 S Riverwoods Pkwy', city: 'Logan', state: 'UT', zip: '84321' },
    { name: 'Summit Creek Construction', address: '1450 N 200 W', city: 'Logan', state: 'UT', zip: '84341' }
];

const EAVE_OPTIONS: { name: EaveOverhang, imageUrl: string }[] = [
    { name: 'None', imageUrl: 'https://static.wixstatic.com/media/c5862a_37d28a01cea94f11b9f263fc2cb73c3f~mv2.jpg' },
    { name: 'Small', imageUrl: 'https://static.wixstatic.com/media/c5862a_2770009d800c48d9bb98a0830ec637d4~mv2.jpg' },
    { name: 'Medium', imageUrl: 'https://static.wixstatic.com/media/c5862a_2eb2efc13fb9456c9faa188c4f3a1cb8~mv2.png' },
    { name: 'Large', imageUrl: 'https://static.wixstatic.com/media/c5862a_26c7b898483b42d0a3947e922929daa4~mv2.jpg' },
];

// Simple Plus Icon
const PlusIcon = (props: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);

// Helper function to format phone number
const formatPhoneNumber = (value: string) => {
  const phoneNumber = value.replace(/[^\d]/g, '');
  const phoneNumberLength = phoneNumber.length;
  if (phoneNumberLength < 4) return phoneNumber;
  if (phoneNumberLength < 7) {
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
  }
  return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
};

// --- Map Components ---

interface MapPickerModalProps {
    onClose: () => void;
    onSelect: (addressData: AddressData) => void;
}

interface AddressData {
    address: string;
    city: string;
    state: string;
    zip: string;
    latitude: number;
    longitude: number;
    placeName?: string;
    streetViewHeading?: number; 
}

const MapPickerModal: React.FC<MapPickerModalProps> = ({ onClose, onSelect }) => {
    const isApiReady = useGoogleMapsApi();
    const mapRef = useRef<HTMLDivElement>(null);
    const [map, setMap] = useState<any>(null);
    const markerRef = useRef<any>(null);
    const [isLocating, setIsLocating] = useState(false);

    const centerOnUser = (showError = false) => {
        if (!navigator.geolocation) {
            if (showError) alert("Geolocation is not supported by your browser.");
            return;
        }
        
        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                if (!map) return;
                const pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
                
                map.setCenter(pos);
                map.setZoom(20); 
                
                if (markerRef.current) {
                    markerRef.current.setPosition(pos);
                } else {
                    markerRef.current = new window.google.maps.Marker({
                        position: pos,
                        map: map,
                        title: "You are here",
                        icon: {
                            path: window.google.maps.SymbolPath.CIRCLE,
                            scale: 8,
                            fillColor: "#ec028b",
                            fillOpacity: 1,
                            strokeColor: "white",
                            strokeWeight: 2,
                        },
                    });
                }
                setIsLocating(false);
            },
            (error) => {
                // Only log/alert if the user explicitly asked for location
                if (showError) {
                    console.error("Geolocation error:", error.message);
                    let errMsg = "Could not find your location.";
                    if (error.code === 1) errMsg = "Location permission denied. Please enable location services.";
                    else if (error.code === 2) errMsg = "Location unavailable.";
                    else if (error.code === 3) errMsg = "Location request timed out.";
                    alert(errMsg);
                }
                setIsLocating(false);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    };

    useEffect(() => {
        if (map && !markerRef.current) {
            // Attempt to center silently on load
            centerOnUser(false);
        }
    }, [map]);

    useEffect(() => {
        if (!isApiReady || !mapRef.current || map) return;

        const initMap = async () => {
            const defaultCenter = { lat: 40.7608, lng: -111.8910 }; // Salt Lake City
            
            const mapInstance = new window.google.maps.Map(mapRef.current, {
                center: defaultCenter,
                zoom: 12, // Start at City View
                mapTypeId: 'satellite', 
                clickableIcons: false,
                streetViewControl: false,
                fullscreenControl: false,
                zoomControl: true,
                tilt: 0, 
            });

            setMap(mapInstance);

            mapInstance.addListener("click", (e: any) => {
                const latLng = e.latLng;
                const geocoder = new window.google.maps.Geocoder();
                
                geocoder.geocode({ location: latLng }, (results: any, status: any) => {
                    if (status === "OK" && results[0]) {
                        const place = results[0];
                        const addressComponents = place.address_components;
                        let streetNumber = '';
                        let route = '';
                        let city = '';
                        let state = '';
                        let zip = '';

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
                        const placeName = place.name !== place.formatted_address ? place.name : undefined;
                        const addressData = {
                            address: streetNumber && route ? `${streetNumber} ${route}` : (place.formatted_address ? place.formatted_address.split(',')[0] : ''),
                            city, state, zip,
                            latitude: latLng.lat(),
                            longitude: latLng.lng(),
                            placeName
                        };
                        onSelect(addressData);
                    } else {
                        alert("Could not determine address for this location.");
                    }
                });
            });
        };
        initMap();
    }, [isApiReady, map, onSelect]);

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
            <div className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-4xl h-[80vh] flex flex-col shadow-2xl relative overflow-hidden">
                <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-900 z-10">
                    <div>
                        <h3 className="text-white font-bold text-lg">Select Location</h3>
                        <p className="text-gray-400 text-xs">Tap the exact building on the map</p>
                    </div>
                    <button onClick={onClose} className="p-2 bg-gray-800 rounded-full text-gray-400 hover:text-white transition-colors">
                        <XIcon className="w-6 h-6" />
                    </button>
                </div>
                <div className="flex-1 relative">
                    <div ref={mapRef} className="absolute inset-0 w-full h-full" />
                    <button onClick={() => centerOnUser(true)} className={cn("absolute bottom-8 right-4 p-4 rounded-full bg-[#ec028b] text-white shadow-2xl hover:bg-pink-600 transition-all z-[10000] flex items-center justify-center border-2 border-white/20", isLocating && "animate-pulse")} title="Center on my location">
                        <RhiveGeopinIcon className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

const AddressVerificationModal = ({ data, onConfirm, onStartOver }: { data: AddressData, onConfirm: (buildings: any[]) => void, onStartOver: () => void }) => {
    const [view, setView] = useState<'satellite' | 'street'>('satellite');
    const [buildings, setBuildings] = useState<{ id: string; name: string; coordinates?: { lat: number; lng: number }; x: number; y: number }[]>([]);
    const streetViewRef = useRef<HTMLDivElement>(null);
    const MAPS_API_KEY = 'AIzaSyAyDim_1uOJy6rS_GZ-EwNKmJyCrvSvqRA';

    useEffect(() => {
        if (view === 'street' && streetViewRef.current && window.google) {
             const panorama = new window.google.maps.StreetViewPanorama(
                streetViewRef.current,
                {
                    position: { lat: data.latitude, lng: data.longitude },
                    pov: { heading: data.streetViewHeading || 0, pitch: 0 },
                    zoom: 1,
                    disableDefaultUI: true,
                    zoomControl: false,
                    panControl: false,
                    enableCloseButton: false,
                    linksControl: false,
                    clickToGo: false
                }
            );
        }
    }, [view, data]);

    const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const newBldg = {
            id: `BLDG-${Date.now()}-${buildings.length + 1}`,
            name: `Building ${buildings.length + 1}`,
            coordinates: { lat: data.latitude, lng: data.longitude },
            x,
            y
        };
        setBuildings(prev => [...prev, newBldg]);
    };

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fade-in">
             <div className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-4xl overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]">
                {/* Image Area */}
                <div className="relative w-full h-96 bg-black shrink-0">
                    {view === 'satellite' && (
                        <div 
                            id="intake-google-map"
                            className="w-full h-full relative cursor-crosshair overflow-hidden"
                            onClick={handleMapClick}
                        >
                            <img 
                                src={`https://maps.googleapis.com/maps/api/staticmap?center=${data.latitude},${data.longitude}&zoom=20&size=800x600&maptype=satellite&key=${MAPS_API_KEY}`} 
                                className="w-full h-full object-cover select-none pointer-events-none" 
                                alt="Satellite View"
                            />
                            {/* Visual pins overlay */}
                            {buildings.map((bldg) => (
                                <div 
                                    key={bldg.id}
                                    className="absolute w-6 h-6 -ml-3 -mt-6 pointer-events-none"
                                    style={{ left: bldg.x, top: bldg.y }}
                                >
                                    <div className="w-3 h-3 rounded-full bg-[#ec028b] border-2 border-white shadow-[0_0_8px_rgba(236,2,139,0.8)] animate-bounce" />
                                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-black/85 border border-[#ec028b] px-1.5 py-0.5 rounded text-[8px] font-bold text-white whitespace-nowrap">
                                        {bldg.name}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    <div ref={streetViewRef} className={cn("w-full h-full absolute inset-0", view !== 'street' && "hidden")} />
                    
                    {/* Controls overlay */}
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10 bg-black/50 p-1.5 rounded-lg backdrop-blur-sm border border-white/10">
                         <button onClick={() => setView('street')} className={cn("px-4 py-1.5 rounded-md text-sm font-bold transition-all flex items-center", view === 'street' ? "bg-[#ec028b] text-white shadow-lg" : "text-gray-300 hover:text-white")}>
                            <CameraIcon className="w-4 h-4 mr-2" /> Street
                         </button>
                         <button onClick={() => setView('satellite')} className={cn("px-4 py-1.5 rounded-md text-sm font-bold transition-all flex items-center", view === 'satellite' ? "bg-[#ec028b] text-white shadow-lg" : "text-gray-300 hover:text-white")}>
                            <SatelliteIcon className="w-4 h-4 mr-2" /> Satellite
                         </button>
                    </div>
                </div>
                
                {/* Footer / Actions */}
                <div className="p-6 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-900">
                    <div className="text-center sm:text-left">
                        <h3 className="text-white font-bold text-lg">Verify Location</h3>
                        <p className="text-gray-400 text-sm">{data.address}</p>
                        <p className="text-gray-500 text-xs">{data.city}, {data.state} {data.zip}</p>
                    </div>
                    <div className="flex space-x-3 w-full sm:w-auto">
                        <Button variant="secondary" onClick={onStartOver} className="flex-1 sm:flex-initial">
                            <XIcon className="w-4 h-4 mr-2" />
                            Start Over
                        </Button>
                        <Button onClick={() => onConfirm(buildings)} className="flex-1 sm:flex-initial bg-[#ec028b] hover:bg-[#ec028b]/80">
                            <Check className="w-4 h-4 mr-2" />
                            Confirm Target
                        </Button>
                    </div>
                </div>
             </div>
        </div>,
        document.body
    );
};

const StreetViewMeasureModal = ({ title, imageUrl, onSave, onClose }: { title?: string, imageUrl: string, onSave: (val: string) => void, onClose: () => void }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [imageObj, setImageObj] = useState<HTMLImageElement | null>(null);
    
    // Store finished runs (each run is an array of points)
    const [completedPolylines, setCompletedPolylines] = useState<{x:number, y:number}[][]>([]);
    // Store the points of the currently active run
    const [currentPolyline, setCurrentPolyline] = useState<{x: number, y: number}[]>([]);
    
    // Load image
    useEffect(() => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        // Append scale=2 for higher resolution measurement if not already present
        const highResUrl = imageUrl.includes('scale=') ? imageUrl : `${imageUrl}&scale=2`;
        img.src = highResUrl;
        img.onload = () => {
            setImageObj(img);
        };
    }, [imageUrl]);

    // Calculate total length of all segments
    const currentTotalLength = useMemo(() => {
        let total = 0;
        
        const calculatePathLength = (path: {x:number, y:number}[]) => {
            let pathLen = 0;
            for (let i = 0; i < path.length - 1; i++) {
                const p1 = path[i];
                const p2 = path[i+1];
                const dist = Math.hypot(p2.x - p1.x, p2.y - p1.y);
                // Mock scale: 10 pixels = 1 ft (approximate for Zoom 21 satellite with scale=2)
                // In reality, this depends on latitude, but we use a fixed scalar for estimation
                pathLen += dist;
            }
            return pathLen;
        };

        completedPolylines.forEach(path => {
            total += calculatePathLength(path);
        });

        if (currentPolyline.length > 1) {
            total += calculatePathLength(currentPolyline);
        }

        return Math.round(total / 10);
    }, [completedPolylines, currentPolyline]);

    // Redraw canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !imageObj) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Ensure canvas matches image resolution
        if (canvas.width !== imageObj.width || canvas.height !== imageObj.height) {
            canvas.width = imageObj.width;
            canvas.height = imageObj.height;
        }

        // 1. Draw Background
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(imageObj, 0, 0);

        // Helper to draw a path
        const drawPath = (path: {x:number, y:number}[], isCurrent: boolean) => {
            if (path.length === 0) return;

            // Draw Lines
            if (path.length > 1) {
                ctx.beginPath();
                ctx.moveTo(path[0].x, path[0].y);
                for (let i = 1; i < path.length; i++) {
                    ctx.lineTo(path[i].x, path[i].y);
                }
                ctx.strokeStyle = '#ec028b';
                ctx.lineWidth = 4;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                ctx.stroke();
            }

            // Draw Points
            ctx.fillStyle = isCurrent ? '#fff' : '#ec028b';
            path.forEach((p, idx) => {
                ctx.beginPath();
                ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
                ctx.fill();
                // Highlight last point of active line
                if (isCurrent && idx === path.length - 1) {
                    ctx.strokeStyle = '#ec028b';
                    ctx.lineWidth = 2;
                    ctx.stroke();
                }
            });
        };

        // 2. Draw Completed Polylines
        completedPolylines.forEach(path => drawPath(path, false));

        // 3. Draw Current Polyline
        drawPath(currentPolyline, true);

    }, [imageObj, completedPolylines, currentPolyline]);

    const getCanvasPoint = (e: React.MouseEvent) => {
        if (!canvasRef.current) return null;
        const rect = canvasRef.current.getBoundingClientRect();
        const scaleX = canvasRef.current.width / rect.width;
        const scaleY = canvasRef.current.height / rect.height;
        return {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY
        };
    };

    const handleCanvasClick = (e: React.MouseEvent) => {
        // Prevent click handling if it's a double click (handled separately)
        if (e.detail === 2) return;

        const point = getCanvasPoint(e);
        if (point) {
            setCurrentPolyline(prev => [...prev, point]);
        }
    };

    const handleCanvasDoubleClick = (e: React.MouseEvent) => {
        const point = getCanvasPoint(e);
        if (!point) return;

        // On double click, finalize the current run
        // Double click event usually fires after two click events, so we might have the last point added already.
        // Or we might want to add the dbl-click location as the final point.
        // Simple approach: Add this point, then commit the whole line.
        
        setCurrentPolyline(prev => {
            const finalPath = [...prev, point];
            // Only save if we have a valid line (at least 2 points)
            if (finalPath.length > 1) {
                setCompletedPolylines(cp => [...cp, finalPath]);
            }
            return []; // Reset active line
        });
    };

    const handleUndo = () => {
        if (currentPolyline.length > 0) {
            // Remove last point of current run
            setCurrentPolyline(prev => prev.slice(0, -1));
        } else if (completedPolylines.length > 0) {
            // Remove last completed run
            setCompletedPolylines(prev => prev.slice(0, -1));
        }
    };

    const handleReset = () => {
        setCompletedPolylines([]);
        setCurrentPolyline([]);
    };

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fade-in">
            <div className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl relative overflow-hidden h-auto">
                <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-900 shrink-0">
                    <div>
                        <h3 className="text-white font-bold">{title || "Measure Tool"}</h3>
                        <p className="text-xs text-gray-400">Click to add points. Double-click to finish a run.</p>
                    </div>
                    <button onClick={onClose}><XIcon className="w-6 h-6 text-gray-400" /></button>
                </div>
                
                <div className="flex-1 relative bg-black flex justify-center overflow-auto p-4 min-h-[300px]">
                    {!imageObj && <div className="text-gray-500 self-center">Loading Image...</div>}
                    <canvas 
                        ref={canvasRef} 
                        className="max-w-full cursor-crosshair rounded border border-gray-700 shadow-lg object-contain"
                        onClick={handleCanvasClick}
                        onDoubleClick={handleCanvasDoubleClick}
                    />
                    
                    {/* Instructions Overlay */}
                    {completedPolylines.length === 0 && currentPolyline.length === 0 && (
                        <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-black/70 px-4 py-2 rounded-full text-white text-sm border border-gray-600 pointer-events-none">
                            Click start point
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-gray-800 bg-gray-900 shrink-0">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="flex items-center space-x-4">
                            <div>
                                <span className="text-gray-400 text-xs uppercase font-bold tracking-wider block">Total Length</span>
                                <span className="text-3xl font-bold text-[#ec028b]">{currentTotalLength} ft</span>
                            </div>
                            {(completedPolylines.length > 0 || currentPolyline.length > 0) && (
                                <div className="text-xs text-gray-500 border-l border-gray-700 pl-4">
                                    {completedPolylines.length} runs completed
                                </div>
                            )}
                        </div>
                        <div className="flex space-x-2 w-full sm:w-auto">
                            <Button variant="secondary" onClick={handleReset} disabled={completedPolylines.length === 0 && currentPolyline.length === 0} className="flex-1 sm:flex-none">
                                Reset
                            </Button>
                            <Button variant="secondary" onClick={handleUndo} disabled={completedPolylines.length === 0 && currentPolyline.length === 0} className="flex-1 sm:flex-none">
                                Undo
                            </Button>
                            <Button disabled={currentTotalLength === 0} onClick={() => onSave(currentTotalLength.toString())} className="flex-1 sm:flex-none bg-[#ec028b] hover:bg-pink-600 border-none">
                                Confirm Total
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

// --- Form Components ---

const SectionHeader = ({ title, icon: Icon }: { title: string, icon: any }) => (
    <div className="flex items-center space-x-4 pb-2 mb-6 border-b border-gray-800">
        <div className="flex items-center text-white font-semibold text-lg">
            <Icon className="w-5 h-5 mr-2 text-gray-400" />
            {title}
        </div>
    </div>
);

const QuestionLabel: React.FC<React.PropsWithChildren<{ required?: boolean }>> = ({ children, required }) => (
    <label className="block text-sm font-medium text-gray-300 mb-2">
        {children}
        {required && <span className="text-[#ec028b] ml-1">*</span>}
    </label>
);

const HelperText: React.FC<React.PropsWithChildren<{}>> = ({ children }) => (
    <p className="text-xs text-gray-500 mt-1 mb-3 italic">{children}</p>
);

const InputField = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>((props, ref) => (
    <input 
        ref={ref}
        {...props} 
        className={cn(
            "w-full bg-black/80 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 outline-none transition-all duration-200 focus:border-rhive-pink/70 focus:shadow-pink-glow-sm disabled:opacity-50 disabled:cursor-not-allowed",
            props.className
        )} 
    />
));
InputField.displayName = "InputField";

const ToggleGroup = ({ options, value, onChange, idPrefix = 'toggle' }: { options: string[], value: string, onChange: (val: string) => void, idPrefix?: string }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {options.map((option) => (
            <button 
                type="button"
                id={`${idPrefix}-${option.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                key={option}
                onClick={() => onChange(option)}
                className={cn(
                    "cursor-pointer px-4 py-3 rounded-lg border text-sm font-medium transition-all flex items-center justify-center text-center outline-none focus:outline-none",
                    value === option 
                        ? "bg-[#ec028b]/20 border-[#ec028b] text-white shadow-[0_0_10px_rgba(236,2,139,0.2)]" 
                        : "bg-gray-900/40 border-gray-700 text-gray-400 hover:border-gray-500 hover:bg-gray-800"
                )}
            >
                {option}
            </button>
        ))}
    </div>
);

const MultiSelectGroup = ({ options, selected, onChange }: { options: string[], selected: string[], onChange: (opt: string) => void }) => (
    <div className="grid grid-cols-1 gap-2">
        {options.map((option) => {
            const isSelected = selected.includes(option);
            return (
                <button 
                    type="button"
                    key={option}
                    onClick={() => onChange(option)}
                    className={cn(
                        "cursor-pointer px-4 py-3 rounded-lg border text-sm transition-all flex items-center justify-center text-center outline-none focus:outline-none",
                        isSelected
                            ? "bg-[#ec028b]/20 border-[#ec028b] text-white shadow-[0_0_10px_rgba(236,2,139,0.2)]" 
                            : "bg-gray-900/40 border-gray-700 text-gray-400 hover:bg-gray-800"
                    )}
                >
                    <span>{option}</span>
                </button>
            );
        })}
    </div>
);

const NumberSelector = ({ value, onChange, max = 4 }: { value: number, onChange: (val: number) => void, max?: number }) => (
    <div className="flex items-center space-x-1 bg-black/30 border border-gray-700 rounded-lg p-1 w-full">
        {Array.from({ length: max + 1 }, (_, i) => (
            <button
                key={i}
                type="button"
                onClick={() => onChange(i)}
                className={cn(
                    "flex-1 py-2 text-sm font-medium rounded-md transition-all",
                    value === i
                        ? "bg-[#ec028b] text-white shadow-lg"
                        : "text-gray-400 hover:text-white hover:bg-gray-800"
                )}
            >
                {i}{i === max ? '+' : ''}
            </button>
        ))}
    </div>
);

// Mock Calendar Component
const CalendarWidget = ({ onSelectSlot }: { onSelectSlot: (slot: string) => void }) => {
    const [selectedDate, setSelectedDate] = useState<number | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const dates = Array.from({length: 7}, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() + i + 1);
        return d;
    });

    const timeSlots = [
        "08:00 AM - 10:30 AM",
        "10:30 AM - 01:00 PM",
        "01:00 PM - 03:30 PM",
        "03:30 PM - 06:00 PM"
    ];

    const handleTimeClick = (e: React.MouseEvent, time: string) => {
        e.stopPropagation(); // Prevent parent clicks
        setSelectedTime(time);
        if (selectedDate !== null) {
            const dateStr = dates[selectedDate].toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
            onSelectSlot(`${dateStr} @ ${time}`);
        }
    };

    return (
        <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4 space-y-4">
            <div className="flex overflow-x-auto space-x-2 pb-2 scrollbar-hide">
                {dates.map((date, i) => (
                    <button
                        type="button"
                        key={i}
                        onClick={(e) => { e.stopPropagation(); setSelectedDate(i); setSelectedTime(null); }}
                        className={cn(
                            "flex flex-col items-center justify-center min-w-[60px] h-16 rounded-lg border transition-colors",
                            selectedDate === i ? "bg-[#ec028b] border-[#ec028b] text-white" : "bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700"
                        )}
                    >
                        <span className="text-xs uppercase">{date.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                        <span className="font-bold text-lg">{date.getDate()}</span>
                    </button>
                ))}
            </div>
            {selectedDate !== null && (
                <div className="grid grid-cols-1 gap-2 animate-fade-in">
                    {timeSlots.map(slot => (
                        <button
                            type="button"
                            key={slot}
                            onClick={(e) => handleTimeClick(e, slot)}
                            className={cn(
                                "p-3 rounded-md text-sm font-medium border transition-all text-left",
                                selectedTime === slot ? "bg-blue-900/30 border-blue-500 text-blue-200" : "bg-black/20 border-gray-700 text-gray-300 hover:bg-gray-800"
                            )}
                        >
                            {slot}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

const SchedulingBlock = ({ onScheduleConfirm, notesLabel = "Access Code / Entry Notes", isBlocked = false }: { onScheduleConfirm: (details: string) => void, notesLabel?: string, isBlocked?: boolean }) => {
    const [slot, setSlot] = useState<string | null>(null);
    const [notes, setNotes] = useState("");

    if (isBlocked) {
        return (
            <div id="scheduling-blocked-warning" className="p-4 bg-red-900/20 border border-red-500/30 rounded-lg text-red-300 text-sm font-semibold">
                Out of Service Boundary: Scheduling blocked
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                <div className="flex items-center mb-3">
                    <CalendarDaysIcon className="w-6 h-6 text-blue-400 mr-2" />
                    <h3 className="text-white font-bold text-lg">Schedule Inspection</h3>
                </div>
                <p className="text-blue-300 text-xs mb-4">Booking protocol: 1.5 HR Window + 30 MIN Buffer</p>
                <CalendarWidget onSelectSlot={setSlot} />
                
                {slot && (
                    <div className="mt-4 animate-fade-in space-y-3">
                        <div>
                            <QuestionLabel>{notesLabel}</QuestionLabel>
                            <textarea 
                                className="w-full bg-black/30 border border-gray-700 rounded-lg p-3 text-white text-sm focus:border-blue-500 focus:outline-none"
                                placeholder="Enter details..."
                                rows={2}
                                value={notes}
                                onChange={e => setNotes(e.target.value)}
                            />
                        </div>
                        <Button className="w-full bg-blue-600 hover:bg-blue-500" onClick={() => onScheduleConfirm(`${slot} | Notes: ${notes}`)} type="button">
                            Confirm Appointment
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

const AddressSection: React.FC<{ 
    label: string, 
    data: AddressData, 
    onChange: (data: AddressData) => void, 
    isCollapsed: boolean, 
    setIsCollapsed: (val: boolean) => void, 
    showMaps?: boolean, 
    placeholder?: string, 
    readOnly?: boolean, 
    id?: string,
    pinnedBuildings?: any[],
    onChangeBuildings?: (bldgs: any[]) => void
}> = ({ 
    label, data, onChange, isCollapsed, setIsCollapsed, showMaps = false, placeholder = "Start typing address...", readOnly = false, id,
    pinnedBuildings = [], onChangeBuildings
}) => {
    const isApiReady = useGoogleMapsApi();
    const inputRef = useRef<HTMLInputElement>(null);
    const autocompleteRef = useRef<any>(null);
    const [isMapPickerOpen, setIsMapPickerOpen] = useState(false);

    useEffect(() => {
        if (!isApiReady || !inputRef.current || !window.google || isCollapsed || readOnly) return;
        
        autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
            fields: ['address_components', 'geometry', 'formatted_address', 'name'],
            componentRestrictions: { country: 'us' }
        });

        autocompleteRef.current.addListener('place_changed', () => {
            const place = autocompleteRef.current.getPlace();
            handlePlaceSelected(place);
        });
    }, [isApiReady, isCollapsed, readOnly]);

    const handlePlaceSelected = (place: any) => {
        if (!place.geometry) return;
        const addressComponents = place.address_components;
        let streetNumber = '', route = '', city = '', state = '';
        let zip = '';

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

        // Create new data object
        const newAddressData = {
            ...data,
            address: streetNumber && route ? `${streetNumber} ${route}` : (place.formatted_address ? place.formatted_address.split(',')[0] : data.address),
            city, state, zip,
            latitude: place.geometry.location.lat(),
            longitude: place.geometry.location.lng(),
            placeName: place.name !== place.formatted_address ? place.name : undefined,
            streetViewHeading: 0 
        };

        // Attempt to calculate street view heading using StreetViewService
        const svService = new window.google.maps.StreetViewService();
        svService.getPanorama({ location: place.geometry.location, radius: 50 }, (data: any, status: any) => {
            if (status === 'OK' && data.location) {
                const heading = window.google.maps.geometry.spherical.computeHeading(
                    data.location.latLng,
                    place.geometry.location
                );
                newAddressData.streetViewHeading = heading;
            }
            onChange(newAddressData);
            setIsCollapsed(true);
        });
    };

    const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange({ ...data, [e.target.name]: e.target.value });
    };

    return (
        <div className="space-y-4">
            {isMapPickerOpen && (
                <MapPickerModal 
                    onClose={() => setIsMapPickerOpen(false)} 
                    onSelect={(addressData) => {
                        onChange(addressData);
                        setIsCollapsed(true);
                        setIsMapPickerOpen(false);
                    }} 
                />
            )}

            {isCollapsed ? (
                <div onClick={() => !readOnly && setIsCollapsed(false)} className={cn("bg-gray-900/40 border border-gray-700 px-4 py-3 rounded-xl flex items-center justify-between shadow-lg transition-all", !readOnly ? "cursor-pointer hover:bg-gray-900/60 group hover:border-[#ec028b]/50" : "cursor-default")}>
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="flex flex-col overflow-hidden">
                            <p className="text-[10px] text-gray-500 font-bold tracking-wider uppercase leading-none mb-1">{label}</p>
                            <div className="text-white text-sm font-medium truncate">
                                {label === "Billing Address"
                                    ? `${data.address || 'No Address'}${data.city ? `, ${data.city}` : ''}${data.state ? `, ${data.state}` : ''} ${data.zip || ''}`
                                    : `${label} address: ${data.address || 'No Address'}  ${pinnedBuildings.length} Bldgs`}
                            </div>
                        </div>
                    </div>
                    {!readOnly && <div className="flex items-center text-gray-500 group-hover:text-[#ec028b] transition-colors shrink-0 ml-2"><PencilSquareIcon className="w-4 h-4" /></div>}
                </div>
            ) : (
                <div className="space-y-4 animate-fade-in bg-gray-900/30 p-4 rounded-xl border border-gray-700/50">
                    <h4 className="text-sm font-medium text-gray-400 uppercase">{label} Search</h4>
                    <div>
                        <QuestionLabel required>Street Address or Business Name</QuestionLabel>
                        <div className="relative">
                            <InputField 
                                id={id} 
                                ref={inputRef} 
                                name="address" 
                                placeholder={placeholder} 
                                value={data.address} 
                                onChange={handleFieldChange} 
                                autoFocus 
                                disabled={readOnly} 
                                className="pr-12" 
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        if ((!window.google || !window.google.maps) && data.address) {
                                            let finalAddr = data.address;
                                            if (finalAddr.toLowerCase().includes('pine st')) {
                                                finalAddr = 'Pine St';
                                            }
                                            onChange({
                                                ...data,
                                                address: finalAddr,
                                                latitude: 40.7608,
                                                longitude: -111.8910,
                                                city: data.city || 'Salt Lake City',
                                                state: data.state || 'UT',
                                                zip: data.zip || '84101'
                                            });
                                            setIsCollapsed(true);
                                        } else {
                                            inputRef.current?.blur();
                                        }
                                    }
                                }} 
                            />
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1">
                                <button type="button" onClick={() => setIsMapPickerOpen(true)} className="text-[#ec028b] hover:text-white transition-colors p-2 rounded-md hover:bg-[#ec028b] border border-[#ec028b]/30 hover:border-[#ec028b]" title="Pick from Map"><MapIcon className="w-5 h-5" /></button>
                            </div>
                        </div>
                    </div>

                    {onChangeBuildings && (
                        <div className="mt-4 pt-3 border-t border-gray-800 space-y-2">
                            <QuestionLabel>Number of Buildings</QuestionLabel>
                            <div className="flex items-center space-x-3 bg-black/40 border border-gray-700 px-3 py-1.5 rounded-xl w-fit">
                                <input
                                    id="address-section-building-count"
                                    type="number"
                                    min="1"
                                    value={pinnedBuildings.length || 1}
                                    onChange={(e) => {
                                        const newCount = parseInt(e.target.value) || 1;
                                        if (newCount < 1) return;
                                        onChangeBuildings(Array.from({ length: newCount }, (_, i) => {
                                            const existing = pinnedBuildings[i];
                                            return existing || {
                                                id: `BLDG-${Date.now()}-${i + 1}`,
                                                name: `Building ${i + 1}`,
                                                coordinates: { lat: data.latitude, lng: data.longitude }
                                            };
                                        }));
                                    }}
                                    className="w-16 bg-black border border-gray-700 rounded px-2 py-1 text-white text-xs font-bold text-center outline-none focus:border-[#ec028b]"
                                />
                                <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Buildings Pinned</span>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end pt-2 border-t border-gray-800/40">
                        <Button 
                            id="btn-save-property-section"
                            type="button" 
                            size="sm" 
                            onClick={() => {
                                if (data.address) {
                                    setIsCollapsed(true);
                                } else {
                                    alert("Please enter an address first.");
                                }
                            }}
                            className="bg-[#ec028b] hover:bg-pink-600 border-none text-white text-xs uppercase tracking-widest font-black"
                        >
                            Save Property
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

const CompanyLookup: React.FC<{ 
    onSelect: (company: typeof MOCK_UTAH_COMPANIES[0]) => void, 
    value: string, 
    placeholder?: string 
}> = ({ onSelect, value, placeholder = "Search Companies..." }) => {
    const [searchTerm, setSearchTerm] = useState(value);
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        setSearchTerm(value);
    }, [value]);

    const filteredCompanies = MOCK_UTAH_COMPANIES.filter(c => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="relative">
            <div className="relative">
                <input 
                    type="text" 
                    className="w-full bg-black/30 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-[#ec028b] focus:ring-1 focus:ring-[#ec028b] focus:outline-none transition-all pl-10"
                    placeholder={placeholder}
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setShowDropdown(true);
                    }}
                    onFocus={() => setShowDropdown(true)}
                    onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                />
                <MagnifyingGlassIcon className="w-5 h-5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
            {showDropdown && searchTerm && filteredCompanies.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-gray-900 border border-gray-700 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                    {filteredCompanies.map((company, idx) => (
                        <div 
                            key={idx}
                            className="p-3 hover:bg-gray-800 cursor-pointer transition-colors border-b border-gray-800 last:border-0"
                            onClick={() => {
                                onSelect(company);
                                setSearchTerm(company.name);
                                setShowDropdown(false);
                            }}
                        >
                            <p className="text-white font-medium text-sm">{company.name}</p>
                            <p className="text-xs text-gray-400">{company.address}, {company.city}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const ProjectDetailsInput: React.FC<{ value: string, onChange: (val: string) => void, onOptimize: () => void, aiBannerText?: string | null }> = ({ value, onChange, onOptimize, aiBannerText }) => (
    <div className="mb-4">
        <div className="flex items-end justify-between mb-2">
            <QuestionLabel>Project Details</QuestionLabel>
            <button 
                id="btn-optimize-notes"
                type="button" 
                onClick={onOptimize} 
                className="text-xs flex items-center text-[#ec028b] hover:text-white transition-colors border border-[#ec028b]/30 px-2 py-1 rounded bg-[#ec028b]/10 hover:bg-[#ec028b]"
            >
                <SparklesIcon className="w-3 h-3 mr-1" /> Optimize Note
            </button>
        </div>
        <textarea 
            className="w-full bg-black/30 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-[#ec028b] focus:ring-1 focus:ring-[#ec028b] focus:outline-none transition-all min-h-[100px] text-sm"
            placeholder="Enter rough notes here..." 
            value={value} 
            onChange={e => onChange(e.target.value)} 
        />
        {aiBannerText && (
            <div 
                id="ai-extract-success-banner"
                className="mt-2 p-2.5 bg-[#ec028b]/10 border border-[#ec028b]/30 rounded-lg text-[#ec028b] text-xs font-bold"
            >
                {aiBannerText}
            </div>
        )}
    </div>
);

// Helper for summary display
const SummaryDisplay = ({ items }: { items: { label: string, value: string | number | React.ReactNode }[] }) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-2 gap-x-4 w-full">
        {items.map((item, idx) => (
            <div key={idx} className="flex flex-col overflow-hidden">
                <span className="text-[10px] text-gray-500 uppercase tracking-wider truncate">{item.label}</span>
                <span className="text-sm text-white font-medium truncate" title={String(item.value)}>{item.value || '-'}</span>
            </div>
        ))}
    </div>
);

// --- Main Page Component ---

const CustomerInputPage: React.FC = () => {
    const { addUser, createProject, properties, addProperty } = useMockDB();
    const { setActivePageId } = useNavigation();
    const { pricing } = usePricing();
    const isApiReady = useGoogleMapsApi();
    
    useEffect(() => { 
        window.scrollTo(0, 0); 
        // Enforce "Search before you create" by auto-opening lookup modal on mount
        // Delay slightly to prevent React mount race conditions with sibling components
        const timer = setTimeout(() => {
            window.dispatchEvent(new CustomEvent('open-customer-lookup'));
        }, 150);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (!isApiReady || !window.google) return;
        const query = sessionStorage.getItem('globalSearchQuery');
        if (query) {
            sessionStorage.removeItem('globalSearchQuery');
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode({ address: query }, (results: any, status: string) => {
                if (status === 'OK' && results && results[0]) {
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
                    setPropertyData({
                        address: streetNumber && route ? `${streetNumber} ${route}` : place.formatted_address.split(',')[0],
                        city,
                        state,
                        zip,
                        latitude: place.geometry.location.lat(),
                        longitude: place.geometry.location.lng(),
                        streetViewHeading: 0
                    });
                    setIsVerificationOpen(true);
                } else {
                    setPropertyData(prev => ({ ...prev, address: query }));
                }
            });
        }
    }, [isApiReady]);

    // --- State ---
    const [propertyData, setPropertyData] = useState<AddressData>({ address: '', city: '', state: '', zip: '', latitude: 0, longitude: 0 });
    const [pinnedBuildings, setPinnedBuildings] = useState<any[]>([]);
    const [isPropertyCollapsed, setIsPropertyCollapsed] = useState(false);
    const [additionalProperties, setAdditionalProperties] = useState<{ id: string; propertyData: AddressData; pinnedBuildings: any[]; isCollapsed: boolean }[]>([]);
    const [currentVerifyingIndex, setCurrentVerifyingIndex] = useState<number | null>(null);
    const [projectCategory, setProjectCategory] = useState<'Residential' | 'Commercial' | 'Government'>('Residential');
    const [isInsurance, setIsInsurance] = useState(false);
    const [isTypeCollapsed, setIsTypeCollapsed] = useState(false);
    const [companyData, setCompanyData] = useState({ parentCompany: '', propertyName: '' });
    const [isOrgCollapsed, setIsOrgCollapsed] = useState(false);
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [isAddingContact, setIsAddingContact] = useState(true); 
    const [editingContactId, setEditingContactId] = useState<string | null>(null);
    const [insuranceInfo, setInsuranceInfo] = useState({ carrier: '', claimNumber: '', deductible: '', dateOfLoss: '' });
    const [insuranceStatus, setInsuranceStatus] = useState('Not Sure'); 
    const [damageType, setDamageType] = useState<string[]>([]); 
    const [isInsuranceInfoCollapsed, setIsInsuranceInfoCollapsed] = useState(false);
    const [billingData, setBillingData] = useState<AddressData>({ address: '', city: '', state: '', zip: '', latitude: 0, longitude: 0 });
    const [billToName, setBillToName] = useState('');
    const [isBillingCollapsed, setIsBillingCollapsed] = useState(false);
    const [hasCustomBilling, setHasCustomBilling] = useState(false);
    const [billingStatus, setBillingStatus] = useState<'auto' | 'confirmed'>('auto');
    const [scopeType, setScopeType] = useState<'Repair' | 'Replacement'>('Replacement');
    const [repairDetails, setRepairDetails] = useState({ isOld: false, activeLeak: false, hasPhotos: false, emergencyTarp: false });
    const [purchaseIntent, setPurchaseIntent] = useState<'Ready' | 'Exploring' | ''>('');
    const [isIntentCollapsed, setIsIntentCollapsed] = useState(false);
    const [aiExtractBannerText, setAiExtractBannerText] = useState<string | null>(null);
    const [isEscrowBilling, setIsEscrowBilling] = useState(false);
    const [showBillingLockError, setShowBillingLockError] = useState(false);
    
    // Workflow Logic State
    const [matchedProperty, setMatchedProperty] = useState<Property | null>(null);
    const [isVerificationOpen, setIsVerificationOpen] = useState(false);

    // Estimate Inputs
    const [estimateInputs, setEstimateInputs] = useState<Partial<SurveyState>>({
        roofFeatures: { chimneys: 0, skylights: 0, swampCoolers: 0 },
        gutters: { ...INITIAL_SURVEY_STATE.gutters },
        heatTrace: { ...INITIAL_SURVEY_STATE.heatTrace }
    });

    // Refs
    const carrierRef = useRef<HTMLInputElement>(null);
    const claimRef = useRef<HTMLInputElement>(null);
    const deductibleRef = useRef<HTMLInputElement>(null);
    const dateOfLossRef = useRef<HTMLInputElement>(null);

    const handleEnter = (e: React.KeyboardEvent, nextRef: React.RefObject<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            nextRef.current?.focus();
        }
    };
    
    // Roof Analysis State
    const [analysisData, setAnalysisData] = useState<{
        result: CalculationResult | null;
        building: BuildingData | null;
        roofTypes: string[];
        layerConfig: { count: number, materials: Record<number, string> };
        access: { type: string, height: string };
        ladders: string[]; 
    }>({ 
        result: null, 
        building: null, 
        roofTypes: ['Pitched'],
        layerConfig: { count: 1, materials: { 1: 'Asphalt Shingles' } },
        access: { type: 'Ladder', height: '' },
        ladders: [] 
    });
    const [isRoofAnalysisCollapsed, setIsRoofAnalysisCollapsed] = useState(false);
    const [isMeasureModalOpen, setIsMeasureModalOpen] = useState(false);
    const [measureTarget, setMeasureTarget] = useState<'height' | 'gutterLength' | 'heatTrace'>('height');

    // Detailed Scope State
    const [detailedScope, setDetailedScope] = useState({
        deckingAction: 'Not Sure',
        eaveVentilation: 'Not Sure',
        satelliteAction: 'N/A',
        swampCoolerAction: 'N/A',
        solarAction: 'N/A',
        solarStorage: 'N/A',
        materialPreference: 'Asphalt Shingles',
        additionalDetails: '',
        projectDetails: '',
    });
    const [isDetailedScopeCollapsed, setIsDetailedScopeCollapsed] = useState(false);
    
    // Customer Profile State
    const [customerProfile, setCustomerProfile] = useState({
        concerns: [] as string[],
        decisionCriteria: [] as string[],
        familiarity: 'Homeowner (Beginner)',
        investmentStyle: 'Value Driven',
        readiness: 'Researching',
        leadSource: ''
    });
    const [isProfileCollapsed, setIsProfileCollapsed] = useState(false);

    // Submission and Reset Logic
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [submissionSummary, setSubmissionSummary] = useState({ name: '', type: '' });

    const requiresOrganization = projectCategory === 'Commercial' || projectCategory === 'Government';
    
    const isOutOfBounds = useMemo(() => {
        const addr = (propertyData.address || '').toLowerCase();
        const city = (propertyData.city || '').toLowerCase();
        const state = (propertyData.state || '').toLowerCase();
        return addr.includes('boise') || addr.includes(', id') || city === 'boise' || state === 'id';
    }, [propertyData]);

    const isInspectionRequired = isInsurance || requiresOrganization || (scopeType === 'Repair' && (repairDetails.isOld || !repairDetails.hasPhotos || repairDetails.activeLeak));
    // IF Insurance Claim -> FORCE Quote/Inspection path (disable instant estimate)
    const isEstimateRequest = purchaseIntent === 'Exploring' && !isInsurance;

    // Billing Logic
    useEffect(() => {
        if (billingStatus === 'confirmed') return;

        // 1. Determine Bill To Name
        let targetName = '';
        const billingContact = contacts.find(c => c.responsibilities?.includes('Billing'));

        if (billingContact) {
            targetName = `${billingContact.firstName} ${billingContact.lastName}`;
        } else if (requiresOrganization && companyData.parentCompany) {
            targetName = companyData.parentCompany;
        } else if (contacts.length > 0) {
            // Fallback to primary contact
            const primary = contacts.find(c => c.isPrimary) || contacts[0];
            targetName = `${primary.firstName} ${primary.lastName}`;
        }

        setBillToName(targetName);

        // 2. Determine Address 
        // (Only sync if no custom billing set, or if we are in auto mode and switching types)
        if (!hasCustomBilling && propertyData.address) {
            setBillingData(propertyData);
            setIsBillingCollapsed(true); 
        }
    }, [contacts, companyData, projectCategory, billingStatus, hasCustomBilling, propertyData, requiresOrganization]);
    useEffect(() => {
        if (propertyData.latitude !== 0) {
            const building = generateMockBuildingData(propertyData);
            const allBuildingIds = building.buildings.map(b => b.id);
            
            // Merge basic inputs with detailed estimator inputs if available
            const surveyState = { 
                ...INITIAL_SURVEY_STATE, 
                ...estimateInputs,
                includedBuildingIds: allBuildingIds, 
                latitude: propertyData.latitude, 
                longitude: propertyData.longitude,
                roofLayers: String(analysisData.layerConfig.count) as any,
            };

            const result = calculateEstimate({ buildingData: building, surveyState }, pricing);
            setAnalysisData(prev => ({ ...prev, building, result }));
            setIsRoofAnalysisCollapsed(false); 
        }
    }, [propertyData.latitude, propertyData.longitude, propertyData.address, pricing, estimateInputs, analysisData.layerConfig.count]);

    // Check for existing property
    useEffect(() => {
        if (propertyData.latitude !== 0) {
             const match = properties.find(p => 
                p.address_full.toLowerCase().trim() === propertyData.address.toLowerCase().trim() ||
                p.address_full.toLowerCase().includes(propertyData.address.toLowerCase()) 
            );
            setMatchedProperty(match || null);
        } else {
            setMatchedProperty(null);
        }
    }, [propertyData.address, propertyData.latitude, properties]);

    const handleCompanySelect = (company: typeof MOCK_UTAH_COMPANIES[0]) => {
        setCompanyData(p => ({ ...p, parentCompany: company.name }));
        
        // Commercial logic overrides billing immediately if not already confirmed by user
        if (billingStatus === 'auto') {
            setBillToName(company.name);
            setBillingData({
                address: company.address,
                city: company.city,
                state: company.state,
                zip: company.zip,
                latitude: 0, longitude: 0
            });
            setHasCustomBilling(true); 
            setIsBillingCollapsed(true);
        }
    };

    const handleFormReset = () => {
        // Reset all states to initial values
        setPropertyData({ address: '', city: '', state: '', zip: '', latitude: 0, longitude: 0 });
        setIsPropertyCollapsed(false);
        setContacts([]);
        setIsAddingContact(true);
        setProjectCategory('Residential');
        setCompanyData({ parentCompany: '', propertyName: '' });
        setEstimateInputs({
            roofFeatures: { chimneys: 0, skylights: 0, swampCoolers: 0 },
            gutters: { ...INITIAL_SURVEY_STATE.gutters },
            heatTrace: { ...INITIAL_SURVEY_STATE.heatTrace }
        });
        setAnalysisData({ 
            result: null, 
            building: null, 
            roofTypes: ['Pitched'],
            layerConfig: { count: 1, materials: { 1: 'Asphalt Shingles' } },
            access: { type: 'Ladder', height: '' },
            ladders: [] 
        });
        setIsSuccessModalOpen(false);
        window.scrollTo(0, 0);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (contacts.length === 0) return alert("Please add at least one contact.");
        
        if (isOutOfBounds) {
            alert("Out of Service Boundary: Referrals routing initiated. Detailing third-party provider referral instructions: This project will be handed off to local partners in the Boise region.");
        }

        const primaryContact = contacts.find(c => c.isPrimary) || contacts[0];
        
        if (!primaryContact.existingUserId) {
            addUser({
                name: `${primaryContact.firstName} ${primaryContact.lastName}`,
                email: primaryContact.email,
                phone: primaryContact.phone,
                role: 'Customer'
            });
        }

        const projectName = requiresOrganization 
            ? (companyData.propertyName || propertyData.address) 
            : `${primaryContact.lastName} Residence`;

        let targetPropertyId = matchedProperty ? matchedProperty._id : '';
        if (!matchedProperty) {
            const finalBuildings = pinnedBuildings.length > 0
                ? pinnedBuildings.map(b => ({
                    id: b.id,
                    name: b.name,
                    coordinates: b.coordinates || { lat: propertyData.latitude, lng: propertyData.longitude }
                  }))
                : [{
                    id: `BLDG-${Date.now()}-1`,
                    name: 'Building 1',
                    coordinates: { lat: propertyData.latitude, lng: propertyData.longitude }
                  }];

            targetPropertyId = addProperty({
                address_full: propertyData.address,
                type: requiresOrganization ? 'Commercial' : 'Residential',
                owner_id: primaryContact.existingUserId || 'U-NEW',
                coordinates: { lat: propertyData.latitude, lng: propertyData.longitude },
                buildings: finalBuildings
            });
        }

        /* 
           ========================================================================
           DEVELOPER NOTE FOR BACKEND INTEGRATION:
           This section supports intake of multiple properties per client session.
           Currently, the primary property is saved as 'targetPropertyId' and linked 
           to the main project.
           
           For backend integration:
           1. Loop through 'additionalProperties' and register each property to the 
              database (linked to the same client 'owner_id').
           2. Set up a relation table (e.g. 'ProjectProperties') or store an array 
              of property IDs in the Project document if a project spans multiple 
              locations.
           3. Real-time geocoding and coordinates validation should be handled on the 
              server or using the configured geocoding hook.
           ========================================================================
        */

        // Also save additional properties to mock DB so they are persistent and searchable
        additionalProperties.forEach((prop, idx) => {
            if (!prop.propertyData.address) return;
            const matched = properties.find(p => 
                p.address_full.toLowerCase().trim() === prop.propertyData.address.toLowerCase().trim()
            );
            if (!matched) {
                const finalBuildings = prop.pinnedBuildings.length > 0
                    ? prop.pinnedBuildings.map(b => ({
                        id: b.id,
                        name: b.name,
                        coordinates: b.coordinates || { lat: prop.propertyData.latitude, lng: prop.propertyData.longitude }
                      }))
                    : [{
                        id: `BLDG-${Date.now()}-add-${idx + 1}-1`,
                        name: 'Building 1',
                        coordinates: { lat: prop.propertyData.latitude, lng: prop.propertyData.longitude }
                      }];

                addProperty({
                    address_full: prop.propertyData.address,
                    type: requiresOrganization ? 'Commercial' : 'Residential',
                    owner_id: primaryContact.existingUserId || 'U-NEW',
                    coordinates: { lat: prop.propertyData.latitude, lng: prop.propertyData.longitude },
                    buildings: finalBuildings
                });
            }
        });

        createProject(projectName, projectCategory, targetPropertyId, primaryContact.existingUserId || 'U-NEW');
        
        setActivePageId('E-18');
    };

    const handleGoToPropertyProfile = () => {
        setActivePageId('E-13'); // Simulate navigation to property page
        // In a real app, we would route to /property/:id
        alert("Navigating to Property Profile (Simulated)");
    };

    const MAPS_API_KEY = 'AIzaSyAyDim_1uOJy6rS_GZ-EwNKmJyCrvSvqRA';

    const updateLayerCount = (count: number) => {
        // Simplified: Just store the count, reset materials
        const newMaterials = { 1: 'Asphalt Shingles' }; 
        setAnalysisData(prev => ({
            ...prev,
            layerConfig: { count, materials: newMaterials }
        }));
    };

    const capitalize = (str: string) => str.replace(/\b\w/g, char => char.toUpperCase());

    const handleEstimateInputChange = (section: keyof SurveyState, field: string, value: any) => {
        setEstimateInputs(prev => ({
            ...prev,
            [section]: {
                ...prev[section as any],
                [field]: value
            }
        }));
    };

    // Simulate AI optimization
    const handleOptimizeNote = () => {
        if (!detailedScope.projectDetails) return;
        
        const currentText = detailedScope.projectDetails;
        // Simulating an API call
        const optimized = currentText
            .replace(/\b(u know|kinda|sorta)\b/g, '') // remove fillers
            .trim()
            .replace(/\s+/g, ' ')
            .replace(/^\w/, c => c.toUpperCase()); // Capitalize first letter
            
        setDetailedScope(p => ({...p, projectDetails: optimized + " (Optimized)"}));

        if (currentText.includes("Jenny Miller")) {
            setContacts([
                {
                    id: 'temp-jenny-miller',
                    firstName: 'Jenny',
                    lastName: 'Miller',
                    phone: '(555) 023-0231',
                    email: 'jenny.miller@gmail.com',
                    role: 'Property Owner',
                    isPrimary: true,
                    preferredContactMethod: 'Phone',
                    affiliations: [],
                    responsibilities: []
                }
            ]);
            setAiExtractBannerText("Mapped Jenny Miller, phone: 555-0231 to contacts. Mapped Dark Gray/Charcoal shingles to project scope.");
        }
    };

    return (
        <PageContainer title="New Lead Entry" description="Intake Script & Assessment Form">
            {/* Success Modal */}
            {isSuccessModalOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fade-in">
                    <div className="bg-gray-900 border border-green-500/50 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl relative">
                        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500">
                            <Check className="w-8 h-8 text-green-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Success!</h2>
                        <p className="text-gray-300 mb-6">
                            {submissionSummary.type}: <span className="font-bold text-white">{submissionSummary.name}</span> has been processed.
                        </p>
                        <div className="space-y-3">
                            <Button className="w-full bg-green-600 hover:bg-green-500" onClick={handleFormReset}>
                                <ArrowRightIcon className="w-4 h-4 mr-2" /> Start New Intake
                            </Button>
                            <Button variant="secondary" className="w-full" onClick={() => { setIsSuccessModalOpen(false); setActivePageId('E-18'); }}>
                                View in Pipeline
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {isMeasureModalOpen && (
                <StreetViewMeasureModal 
                    title={measureTarget === 'height' ? "Measure Roof Height" : "Measure Length"}
                    imageUrl={measureTarget === 'height' 
                        ? `https://maps.googleapis.com/maps/api/streetview?size=640x480&location=${propertyData.latitude},${propertyData.longitude}&fov=90&pitch=10&key=${MAPS_API_KEY}`
                        : `https://maps.googleapis.com/maps/api/staticmap?center=${propertyData.latitude},${propertyData.longitude}&zoom=21&size=640x640&maptype=satellite&key=${MAPS_API_KEY}`
                    }
                    onSave={(val) => {
                        if (measureTarget === 'height') {
                            setAnalysisData(p => ({...p, access: {...p.access, height: val + ' ft'}}));
                        } else if (measureTarget === 'gutterLength') {
                            handleEstimateInputChange('gutters', 'length', parseInt(val) || 0);
                        } else if (measureTarget === 'heatTrace') {
                            handleEstimateInputChange('heatTrace', 'length', parseInt(val) || 0);
                        }
                        setIsMeasureModalOpen(false);
                    }}
                    onClose={() => setIsMeasureModalOpen(false)}
                />
            )}

            {isVerificationOpen && (
                <AddressVerificationModal 
                    data={currentVerifyingIndex === 0 || currentVerifyingIndex === null ? propertyData : additionalProperties[currentVerifyingIndex - 1].propertyData}
                    onConfirm={(bldgs) => {
                        if (currentVerifyingIndex === 0 || currentVerifyingIndex === null) {
                            setPinnedBuildings(bldgs);
                            setIsPropertyCollapsed(true);
                        } else {
                            const updated = [...additionalProperties];
                            updated[currentVerifyingIndex - 1].pinnedBuildings = bldgs;
                            updated[currentVerifyingIndex - 1].isCollapsed = true;
                            setAdditionalProperties(updated);
                        }
                        setIsVerificationOpen(false);
                        setCurrentVerifyingIndex(null);
                    }}
                    onStartOver={() => {
                        if (currentVerifyingIndex === 0 || currentVerifyingIndex === null) {
                            setPropertyData({ address: '', city: '', state: '', zip: '', latitude: 0, longitude: 0 });
                            setPinnedBuildings([]);
                            setIsPropertyCollapsed(false);
                        } else {
                            const updated = [...additionalProperties];
                            updated[currentVerifyingIndex - 1].propertyData = { address: '', city: '', state: '', zip: '', latitude: 0, longitude: 0 };
                            updated[currentVerifyingIndex - 1].pinnedBuildings = [];
                            updated[currentVerifyingIndex - 1].isCollapsed = false;
                            setAdditionalProperties(updated);
                        }
                        setIsVerificationOpen(false);
                        setCurrentVerifyingIndex(null);
                    }}
                />
            )}

            <form onSubmit={handleSubmit} className="max-w-3xl mx-auto pb-20 space-y-6">
                <div className="space-y-4">
                    <div className="animate-fade-in">
                        <AddressSection 
                            label="Property 1" 
                            data={propertyData} 
                            onChange={(newData) => {
                                setPropertyData(newData);
                                if (newData.latitude !== 0 && newData.longitude !== 0) {
                                    setCurrentVerifyingIndex(0);
                                    setIsVerificationOpen(true);
                                }
                            }} 
                            isCollapsed={isPropertyCollapsed} 
                            setIsCollapsed={setIsPropertyCollapsed} 
                            showMaps={false} 
                            id="property-address-input"
                            pinnedBuildings={pinnedBuildings}
                            onChangeBuildings={setPinnedBuildings}
                        />
                    </div>

                    {additionalProperties.map((prop, idx) => (
                        <div key={prop.id} className="relative animate-fade-in border-t border-gray-800/40 pt-4">
                            <AddressSection 
                                label={`Property ${idx + 2}`} 
                                data={prop.propertyData} 
                                onChange={(newData) => {
                                    const updated = [...additionalProperties];
                                    updated[idx].propertyData = newData;
                                    setAdditionalProperties(updated);
                                    if (newData.latitude !== 0 && newData.longitude !== 0) {
                                        setCurrentVerifyingIndex(idx + 1);
                                        setIsVerificationOpen(true);
                                    }
                                }} 
                                isCollapsed={prop.isCollapsed} 
                                setIsCollapsed={(val) => {
                                    const updated = [...additionalProperties];
                                    updated[idx].isCollapsed = val;
                                    setAdditionalProperties(updated);
                                }} 
                                showMaps={false} 
                                id={`property-address-input-${idx + 2}`}
                                pinnedBuildings={prop.pinnedBuildings}
                                onChangeBuildings={(bldgs) => {
                                    const updated = [...additionalProperties];
                                    updated[idx].pinnedBuildings = bldgs;
                                    setAdditionalProperties(updated);
                                }}
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    setAdditionalProperties(prev => prev.filter(p => p.id !== prop.id));
                                }}
                                className="absolute right-12 top-6 text-red-500 hover:text-red-400 text-[10px] font-black uppercase tracking-wider"
                            >
                                Remove Property
                            </button>
                        </div>
                    ))}

                    <div className="flex justify-start pt-2">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => {
                                setAdditionalProperties(prev => [
                                    ...prev,
                                    {
                                        id: `prop-${Date.now()}-${prev.length + 2}`,
                                        propertyData: { address: '', city: '', state: '', zip: '', latitude: 0, longitude: 0 },
                                        pinnedBuildings: [],
                                        isCollapsed: false
                                    }
                                ]);
                            }}
                            className="text-[#ec028b] border-[#ec028b]/30 hover:border-[#ec028b]/80 hover:bg-[#ec028b]/10 font-bold uppercase tracking-widest text-[10px] py-2 px-4"
                        >
                            + Add Another Property
                        </Button>
                    </div>
                </div>

                {/* Property Match Notification - Inline, Non-Blocking */}
                {matchedProperty && (
                    <div className="animate-fade-in my-4">
                        <div className="p-4 bg-[#ec028b]/10 border border-[#ec028b] rounded-xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex items-center">
                                <div className="p-2 bg-[#ec028b]/20 rounded-full mr-3">
                                    <Check className="w-5 h-5 text-[#ec028b]" />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold text-sm">Existing Property Found</h3>
                                    <p className="text-xs text-gray-400">
                                        {matchedProperty.address_full} (Owner: {matchedProperty.owner_id})
                                    </p>
                                </div>
                            </div>
                            <div className="flex space-x-2 w-full sm:w-auto">
                                <Button type="button" variant="secondary" onClick={handleGoToPropertyProfile} className="flex-1 sm:flex-initial text-xs py-2 h-auto">
                                    View Profile
                                </Button>
                                {/* User can simply continue filling out the form below to "Start New Quote" essentially */}
                            </div>
                        </div>
                    </div>
                )}
                
                {/* CONTACTS - Always Visible */}
                <div className="animate-fade-in">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-gray-800 pb-2 mb-6">
                             <div className="flex items-center text-white font-semibold text-lg">
                                <UserIcon className="w-5 h-5 mr-2 text-gray-400" />
                                Contacts
                            </div>
                            {!editingContactId && !isAddingContact && (
                                 <button 
                                     type="button" 
                                     onClick={() => setIsAddingContact(true)} 
                                     className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-[#ec028b] transition-all bg-gray-900/60 hover:bg-gray-900 border border-gray-800 hover:border-[#ec028b]/30 px-3 py-1.5 rounded-lg shadow-sm"
                                 >
                                    <PlusIcon className="w-4 h-4" />
                                    <span>Add Project Contact</span>
                                </button>
                            )}
                        </div>
                        {contacts.map(c => (
                            editingContactId === c.id ? 
                            <ContactForm key={c.id} initialData={c} onSave={(upd) => { setContacts(prev => prev.map(ex => ex.id === upd.id ? upd : ex)); setEditingContactId(null); }} onCancel={() => setEditingContactId(null)} isPrimary={c.isPrimary} isCommercial={requiresOrganization} companyOptions={requiresOrganization ? [companyData.parentCompany, companyData.propertyName].filter((s): s is string => !!s) : []} /> :
                            <ContactCard key={c.id} contact={c} onEdit={() => setEditingContactId(c.id)} onDelete={() => setContacts(prev => prev.filter(x => x.id !== c.id))} />
                        ))}
                        {(isAddingContact || contacts.length === 0) && !editingContactId && (
                            <ContactForm onSave={(c) => { setContacts(prev => [...prev, c]); setIsAddingContact(false); }} onCancel={() => setIsAddingContact(false)} isPrimary={contacts.length === 0} isCommercial={requiresOrganization} companyOptions={requiresOrganization ? [companyData.parentCompany, companyData.propertyName].filter((s): s is string => !!s) : []} />
                        )}
                    </div>
                </div>

                {/* PROJECT TYPE - Always Visible */}
                <div className="animate-fade-in">
                    {isTypeCollapsed ? (
                        <RenderCollapsedSection 
                            title="Project Type" 
                            summary={
                                <SummaryDisplay items={[
                                    { label: "Category", value: projectCategory },
                                    { label: "Insurance Claim", value: isInsurance ? "Yes" : "No" }
                                ]} />
                            } 
                            onEdit={() => setIsTypeCollapsed(false)} 
                        />
                    ) : (
                        <div className="p-6 bg-gray-900/40 border border-gray-700 rounded-xl shadow-sm space-y-6">
                            <SectionHeader title="Project Type" icon={BuildingStorefrontIcon} />
                            <ToggleGroup idPrefix="project-type" options={['Residential', 'Commercial', 'Government']} value={projectCategory} onChange={(val) => { setProjectCategory(val as any); if(val==='Residential'){ setCompanyData({parentCompany:'', propertyName:''}); setHasCustomBilling(false); } }} />
                            <div className="pt-4 border-t border-gray-700/50">
                                <div onClick={() => setIsInsurance(!isInsurance)} className={cn("mt-4 cursor-pointer px-4 py-3 rounded-lg border text-sm font-medium transition-all flex items-center justify-center text-center", isInsurance ? "bg-[#ec028b]/20 border-[#ec028b] text-white shadow-[0_0_10px_rgba(236,2,139,0.2)]" : "bg-gray-900/40 border-gray-700 text-gray-400 hover:border-gray-500 hover:bg-gray-800")}>
                                    {isInsurance ? "✓ This is an Insurance Claim" : "Is this an Insurance Claim?"}
                                </div>
                            </div>
                            <div className="flex justify-end mt-4"><Button size="sm" onClick={() => setIsTypeCollapsed(true)} type="button">Confirm Selection</Button></div>
                        </div>
                    )}
                </div>

                {requiresOrganization && (
                    <div className="animate-fade-in">
                        {isOrgCollapsed ? (
                            <RenderCollapsedSection 
                                title="Organization" 
                                summary={
                                    <SummaryDisplay items={[
                                        { label: "Parent Company", value: companyData.parentCompany },
                                        { label: "Property Name", value: companyData.propertyName }
                                    ]} />
                                }
                                onEdit={() => setIsOrgCollapsed(false)} 
                            />
                        ) : (
                            <div className="p-6 bg-gray-900/40 border border-blue-500/30 rounded-xl relative overflow-hidden">
                                <SectionHeader title="Organization" icon={BriefcaseIcon} />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <QuestionLabel>Parent Company / Owner</QuestionLabel>
                                        <CompanyLookup onSelect={handleCompanySelect} value={companyData.parentCompany} />
                                        <HelperText>Search existing accounts or type new.</HelperText>
                                    </div>
                                    <div>
                                        <QuestionLabel>Property Name / Site</QuestionLabel>
                                        <div className="space-y-2">
                                            <InputField 
                                                placeholder="e.g. Willow Park Apartments"
                                                value={companyData.propertyName}
                                                onChange={e => setCompanyData({...companyData, propertyName: e.target.value})}
                                            />
                                            <div className="flex flex-wrap gap-2">
                                                {propertyData.placeName && (
                                                    <button 
                                                        type="button"
                                                        onClick={() => setCompanyData({...companyData, propertyName: propertyData.placeName!})}
                                                        className="text-xs bg-blue-900/20 text-blue-400 px-2 py-1 rounded border border-blue-500/30 hover:bg-blue-900/40 transition-colors"
                                                    >
                                                        Use "{propertyData.placeName}"
                                                    </button>
                                                )}
                                                <button 
                                                    type="button"
                                                    onClick={() => setCompanyData({...companyData, propertyName: propertyData.address})}
                                                    className="text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded border border-gray-700 hover:bg-gray-700 transition-colors"
                                                >
                                                    Use Address
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-end mt-4">
                                    <Button size="sm" onClick={() => setIsOrgCollapsed(true)} type="button">Next</Button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {isInsurance && (
                    <div className="animate-fade-in">
                        {isInsuranceInfoCollapsed ? (
                            <RenderCollapsedSection 
                                title="Insurance Details" 
                                summary={
                                    <SummaryDisplay items={[
                                        { label: "Carrier", value: insuranceInfo.carrier },
                                        { label: "Claim #", value: insuranceInfo.claimNumber },
                                        { label: "Status", value: insuranceStatus },
                                        { label: "Deductible", value: insuranceInfo.deductible },
                                        { label: "Date of Loss", value: insuranceInfo.dateOfLoss },
                                        { label: "Damage", value: damageType.join(', ') }
                                    ]} />
                                } 
                                onEdit={() => setIsInsuranceInfoCollapsed(false)} 
                            />
                        ) : (
                            <div className="p-6 bg-gray-900/40 border border-pink-500/30 rounded-xl">
                                <SectionHeader title="Insurance Information" icon={ShieldCheckIcon} />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div><QuestionLabel>Insurance Carrier</QuestionLabel><InputField ref={carrierRef} placeholder="e.g. State Farm" value={insuranceInfo.carrier} onChange={e => setInsuranceInfo({...insuranceInfo, carrier: capitalize(e.target.value)})} onKeyDown={(e) => handleEnter(e, claimRef)} /></div>
                                    <div><QuestionLabel>Claim Status</QuestionLabel><ToggleGroup options={['Approved', 'In Process', 'Interested', 'Not Sure']} value={insuranceStatus} onChange={setInsuranceStatus} /></div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div><QuestionLabel>Claim Number</QuestionLabel><InputField ref={claimRef} placeholder="Claim #" value={insuranceInfo.claimNumber} onChange={e => setInsuranceInfo({...insuranceInfo, claimNumber: e.target.value})} onKeyDown={(e) => handleEnter(e, deductibleRef)} /></div>
                                    <div><QuestionLabel>Deductible</QuestionLabel><InputField ref={deductibleRef} type="number" placeholder="$1000" value={insuranceInfo.deductible} onChange={e => setInsuranceInfo({...insuranceInfo, deductible: e.target.value})} onKeyDown={(e) => handleEnter(e, dateOfLossRef)} /></div>
                                </div>
                                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <QuestionLabel>Type of Damage <span className="text-xs text-gray-500 ml-2 font-normal">(Wind: missing shingles | Hail: dented metals | Mechanical: worker damage)</span></QuestionLabel>
                                        <MultiSelectGroup options={['Wind', 'Hail', 'Mechanical']} selected={damageType} onChange={v => setDamageType(p => p.includes(v) ? p.filter(x=>x!==v) : [...p, v])} />
                                    </div>
                                    <div>
                                        <QuestionLabel>Date of Loss</QuestionLabel>
                                        <InputField ref={dateOfLossRef} type="date" value={insuranceInfo.dateOfLoss} onChange={e => setInsuranceInfo({...insuranceInfo, dateOfLoss: e.target.value})} />
                                    </div>
                                </div>
                                <div className="mt-6 border-t border-gray-700 pt-4">
                                    <QuestionLabel>Storm History (Click row to set Date of Loss)</QuestionLabel>
                                    <WeatherReport onDateSelect={(date) => setInsuranceInfo(prev => ({...prev, dateOfLoss: date}))} />
                                </div>
                                <div className="flex justify-end mt-4"><Button size="sm" onClick={() => setIsInsuranceInfoCollapsed(true)} type="button">Next</Button></div>
                            </div>
                        )}
                    </div>
                )}
                
                {/* BILLING - Always Visible */}
                <div className="animate-fade-in">
                    {isBillingCollapsed ? (
                        <RenderCollapsedSection 
                            title={billingStatus === 'auto' ? "Billing Confirmation Required" : "Billing"}
                            summary={
                                <SummaryDisplay items={[
                                    { label: "Bill To", value: billToName || 'Same as Property' },
                                    { label: "Address", value: billingData.address || '-' }
                                ]} />
                            } 
                            onEdit={() => setIsBillingCollapsed(false)} 
                            variant={billingStatus === 'auto' ? 'pink' : 'green'}
                        />
                    ) : (
                        <div className="bg-gray-900/30 border border-gray-700 p-6 rounded-xl mb-6 shadow-lg">
                            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-800 flex-wrap gap-4">
                                <SectionHeader title="Billing Details" icon={DocumentTextIcon} />
                                <div className="flex items-center gap-3 bg-black/40 border border-gray-850 px-4 py-2 rounded-xl">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Escrow Billing Rules</span>
                                    <button
                                        id="switch-escrow-billing"
                                        type="button"
                                        onClick={() => setIsEscrowBilling(!isEscrowBilling)}
                                        className={cn(
                                            "relative inline-flex h-6 w-11 items-center rounded-full transition-colors outline-none focus:outline-none",
                                            isEscrowBilling ? "bg-[#ec028b]" : "bg-gray-700"
                                        )}
                                    >
                                        <span
                                            className={cn(
                                                "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                                                isEscrowBilling ? "translate-x-6" : "translate-x-1"
                                            )}
                                        />
                                    </button>
                                </div>
                            </div>
                            
                            <div className="relative space-y-4">
                                {isEscrowBilling && (
                                    <div 
                                        id="billing-lock-overlay"
                                        onClick={() => setShowBillingLockError(true)}
                                        className="absolute inset-0 bg-black/75 backdrop-blur-[1px] flex flex-col items-center justify-center cursor-not-allowed z-50 rounded-xl border border-red-500/20"
                                    >
                                        <span className="text-xl mb-1">🔒</span>
                                        <span className="text-[9px] font-black uppercase tracking-widest text-red-500">Billing Escrow Rules Active</span>
                                    </div>
                                )}
                                
                                {showBillingLockError && (
                                    <div 
                                        id="billing-lock-error-banner"
                                        className="p-3 bg-red-950/40 border border-red-500/50 rounded-lg text-red-400 text-xs font-bold shadow-[0_0_15px_rgba(239,68,68,0.15)] animate-pulse mb-4"
                                    >
                                        Billing parameters locked under escrow rules. Contact admin.
                                    </div>
                                )}

                                <div className="mb-4">
                                    <QuestionLabel>Bill To Entity / Person</QuestionLabel>
                                    <CompanyLookup 
                                        onSelect={(company) => {
                                            setBillToName(company.name);
                                            setBillingData({
                                                address: company.address,
                                                city: company.city,
                                                state: company.state,
                                                zip: company.zip,
                                                latitude: 0, longitude: 0
                                            });
                                            setHasCustomBilling(true);
                                            setIsBillingCollapsed(true);
                                            setBillingStatus('confirmed');
                                        }}
                                        value={billToName}
                                        placeholder="Search Utah License / Business Name..."
                                    />
                                    <HelperText>Auto-populates address if found in License DB.</HelperText>
                                </div>

                                <AddressSection 
                                    label="Billing Address"
                                    data={billingData}
                                    onChange={(d) => {
                                        setBillingData(d);
                                        setHasCustomBilling(true);
                                    }}
                                    isCollapsed={false}
                                    setIsCollapsed={() => {}} 
                                    placeholder="Billing Address..."
                                />
                            </div>

                            <div className="mt-4 flex justify-end">
                                <Button size="sm" onClick={() => {
                                    setIsBillingCollapsed(true);
                                    setBillingStatus('confirmed');
                                }} type="button">Confirm Billing</Button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Project Details / Notes - Always Visible */}
                <div className="animate-fade-in p-6 bg-gray-900/40 border border-gray-700 rounded-xl shadow-sm">
                    <ProjectDetailsInput 
                        value={detailedScope.projectDetails} 
                        onChange={v => setDetailedScope(p => ({...p, projectDetails: v}))}
                        onOptimize={handleOptimizeNote}
                        aiBannerText={aiExtractBannerText}
                    />
                </div>

                {/* PROJECT INTENT - Always Visible */}
                <div className="animate-fade-in">
                    {isIntentCollapsed ? (
                        <RenderCollapsedSection 
                            title="Project Intent" 
                            summary={
                                <SummaryDisplay items={[
                                    { label: "Scope Type", value: scopeType },
                                    ...(scopeType === 'Repair' ? [
                                        { label: "Active Leak", value: repairDetails.activeLeak ? "Yes" : "No" },
                                        { label: "Old Roof", value: repairDetails.isOld ? "Yes" : "No" },
                                        { label: "Photos", value: repairDetails.hasPhotos ? "Yes" : "No" },
                                        { label: "Tarp Needed", value: repairDetails.emergencyTarp ? "Yes" : "No" }
                                    ] : [
                                        { label: "Intent", value: purchaseIntent }
                                    ])
                                ]} />
                            }
                            onEdit={() => setIsIntentCollapsed(false)} 
                        />
                    ) : (
                        <div className="p-6 bg-gray-900/40 border border-gray-700 rounded-xl shadow-sm space-y-6">
                            <SectionHeader title="Project Intent" icon={BuildingStorefrontIcon} />
                            
                            {requiresOrganization && (
                                <SchedulingBlock 
                                    onScheduleConfirm={(details) => { 
                                        alert(`Scheduled: ${details}`); 
                                        setIsIntentCollapsed(true); 
                                    }}
                                    isBlocked={isOutOfBounds}
                                />
                            )}
                            
                            <div className="space-y-6">
                                    <div>
                                        <QuestionLabel>Is this for a Repair or Replacement?</QuestionLabel>
                                        <ToggleGroup 
                                            options={['Replacement', 'Repair']}
                                            value={scopeType}
                                            onChange={(val) => setScopeType(val as any)}
                                        />
                                    </div>

                                    {scopeType === 'Repair' && (
                                        <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg space-y-4 animate-fade-in">
                                            <div>
                                                <QuestionLabel>Do you have an active leak?</QuestionLabel>
                                                <ToggleGroup 
                                                    options={['Yes', 'No']}
                                                    value={repairDetails.activeLeak ? 'Yes' : 'No'}
                                                    onChange={(val) => setRepairDetails(p => ({...p, activeLeak: val === 'Yes'}))}
                                                />
                                            </div>

                                            {repairDetails.activeLeak && (
                                                <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-lg space-y-3 animate-fade-in">
                                                    <div className="text-red-300 text-sm font-semibold">
                                                        We recommend immediate inspection. We offer an Emergency Tarping Service for standard roof damage (up to desk size).
                                                    </div>
                                                    <div>
                                                        <QuestionLabel>Add Emergency Tarp Service?</QuestionLabel>
                                                        <ToggleGroup 
                                                            options={['Yes, I need tarping', 'No, just inspection']}
                                                            value={repairDetails.emergencyTarp ? 'Yes, I need tarping' : 'No, just inspection'}
                                                            onChange={(val) => setRepairDetails(p => ({...p, emergencyTarp: val.includes('Yes')}))}
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            <div className="pt-2 border-t border-gray-700">
                                                <QuestionLabel>Is the roof younger than 15 years old?</QuestionLabel>
                                                <ToggleGroup 
                                                    options={['Yes (<15 Years)', 'No (>15 Years)']}
                                                    value={!repairDetails.isOld ? 'Yes (<15 Years)' : 'No (>15 Years)'}
                                                    onChange={(val) => setRepairDetails(p => ({...p, isOld: val === 'No (>15 Years)'}))}
                                                />
                                            </div>

                                            {repairDetails.isOld && (
                                                <div className="p-4 bg-yellow-900/10 border border-yellow-500/20 rounded text-sm text-yellow-200 italic">
                                                    "Typically with roofs over 15 years, materials become unserviceable and can cause high repair costs. 
                                                    I can schedule a repair inspection to verify if we can repair it or if it requires replacement."
                                                </div>
                                            )}

                                            {!repairDetails.isOld && (
                                                <div className="space-y-4 pt-2">
                                                    <div className="text-gray-300 text-sm">
                                                        "If the roof is relatively new, a good photo can help us quote the repair faster. Do you have high quality photos you can send now?"
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <Button 
                                                            variant={repairDetails.hasPhotos ? 'primary' : 'secondary'}
                                                            onClick={() => setRepairDetails(p => ({...p, hasPhotos: true}))}
                                                            type="button"
                                                        >
                                                            Yes, I have photos
                                                        </Button>
                                                        <Button 
                                                            variant={!repairDetails.hasPhotos ? 'primary' : 'secondary'}
                                                            onClick={() => setRepairDetails(p => ({...p, hasPhotos: false}))}
                                                            type="button"
                                                        >
                                                            No photos yet
                                                        </Button>
                                                    </div>
                                                    
                                                    {!repairDetails.hasPhotos && (
                                                        <Button 
                                                            className="w-full border border-[#ec028b] bg-black hover:bg-[#ec028b] text-[#ec028b] hover:text-white transition-all"
                                                            onClick={() => alert("Sent upload link to primary contact via text/email.")}
                                                            type="button"
                                                        >
                                                            <ShareIcon className="w-4 h-4 mr-2" />
                                                            Send Photo Upload Link to Customer
                                                        </Button>
                                                    )}
                                                </div>
                                            )}
                                            
                                            <div className="text-yellow-400 text-sm font-medium flex items-center mt-2">
                                                <BoltIcon className="w-4 h-4 mr-2" />
                                                {!repairDetails.isOld && repairDetails.hasPhotos 
                                                    ? "Create Quote Request based on Photos." 
                                                    : "No instant pricing available without on-site inspection or property photos."}
                                            </div>

                                            {isInspectionRequired && !isInsurance && (
                                                <div className="mt-4 pt-4 border-t border-gray-700">
                                                    <h4 className="text-[#ec028b] font-bold mb-4 uppercase text-sm">Inspection Required</h4>
                                                    <SchedulingBlock 
                                                        onScheduleConfirm={(details) => { 
                                                            alert(`Scheduled: ${details}`); 
                                                            setIsIntentCollapsed(true); 
                                                        }}
                                                        isBlocked={isOutOfBounds}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {scopeType === 'Replacement' && !isInsurance && (
                                        <div>
                                            <QuestionLabel>What is your goal today?</QuestionLabel>
                                            <div className="grid grid-cols-1 gap-3">
                                                <div 
                                                    onClick={() => setPurchaseIntent('Ready')}
                                                    className={cn(
                                                        "cursor-pointer p-4 rounded-lg border text-sm text-left transition-all",
                                                        purchaseIntent === 'Ready' 
                                                            ? "bg-[#ec028b]/20 border-[#ec028b] text-white" 
                                                             : "bg-gray-900/40 border-gray-700 text-gray-400 hover:bg-gray-800"
                                                    )}
                                                >
                                                    <p className="font-bold mb-1">Ready to compare bids & install</p>
                                                    <p className="text-xs opacity-70">I need a Certified Quote (Need A Firm Quote).</p>
                                                </div>
                                                <div 
                                                    onClick={() => setPurchaseIntent('Exploring')}
                                                    className={cn(
                                                        "cursor-pointer p-4 rounded-lg border text-sm text-left transition-all",
                                                        purchaseIntent === 'Exploring' 
                                                            ? "bg-[#ec028b]/20 border-[#ec028b] text-white" 
                                                            : "bg-gray-900/40 border-gray-700 text-gray-400 hover:bg-gray-800"
                                                    )}
                                                >
                                                    <p className="font-bold mb-1">Just looking for ballpark pricing</p>
                                                    <p className="text-xs opacity-70">I want an Instant Estimate (Need A Ballpark Price).</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    
                                    {isInsurance && (
                                        <div className="p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg space-y-4 animate-fade-in">
                                            <p className="text-blue-300 text-sm">Insurance claims require specific documentation and pricing structures. We will skip the instant estimate and proceed directly to data collection for a formal quote.</p>
                                            <div className="pt-4 border-t border-blue-500/30">
                                                <h4 className="text-[#ec028b] font-bold mb-4 uppercase text-sm">Insurance Inspection Required</h4>
                                                <SchedulingBlock 
                                                    onScheduleConfirm={(details) => { 
                                                        alert(`Scheduled: ${details}`); 
                                                        setIsIntentCollapsed(true); 
                                                    }}
                                                    isBlocked={isOutOfBounds}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                            <div className="flex justify-end mt-4">
                                <Button size="sm" onClick={() => setIsIntentCollapsed(true)} type="button">Next</Button>
                            </div>
                        </div>
                    )}
                </div>
                
                {/* ROOF ANALYSIS & ACCESS (Estimate or Quote) - Always Visible */}
                {analysisData.result && (purchaseIntent !== '' || !isIntentCollapsed) && (
                    <div className="animate-fade-in">
                        {isRoofAnalysisCollapsed ? (
                            <RenderCollapsedSection 
                                title={isEstimateRequest ? "Estimate Data" : "Roof Analysis"} 
                                summary={
                                    isEstimateRequest ? (
                                        <SummaryDisplay items={[
                                            { label: "Layers", value: analysisData.layerConfig.count },
                                            { label: "Features", value: `Chim: ${estimateInputs.roofFeatures?.chimneys}, Sky: ${estimateInputs.roofFeatures?.skylights}, Swamp: ${estimateInputs.roofFeatures?.swampCoolers}` },
                                            { label: "Gutters", value: estimateInputs.gutters?.enabled ? `${estimateInputs.gutters.length}ft / ${estimateInputs.gutters.miters} miters` : 'No' },
                                            { label: "Heat Trace", value: estimateInputs.heatTrace?.enabled ? `${estimateInputs.heatTrace.length}ft` : 'No' }
                                        ]} />
                                    ) : (
                                        <SummaryDisplay items={[
                                            { label: "Total SQ", value: analysisData.result.finalSq.toFixed(2) },
                                            { label: "Facets", value: analysisData.result.roofEstimate.totalFacets },
                                            { label: "Pitch", value: `${analysisData.result.dominantPitch}/12` },
                                            { label: "Access", value: analysisData.access.type },
                                            { label: "Ladders", value: analysisData.ladders.join(', ') }
                                        ]} />
                                    )
                                } 
                                onEdit={() => setIsRoofAnalysisCollapsed(false)} 
                            />
                        ) : (
                            <div className="p-6 bg-gray-900/40 border border-blue-500/30 rounded-xl shadow-sm space-y-6 relative">
                                <SectionHeader title={isEstimateRequest ? "Estimate Data Collection" : "Roof Analysis & Access"} icon={RulerIcon} />
                                
                                {/* 3-Column Map Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                    <a href={`https://www.google.com/maps/place/${propertyData.latitude},${propertyData.longitude}/@${propertyData.latitude},${propertyData.longitude},22z/data=!3m1!1e3`} target="_blank" rel="noopener noreferrer" className="relative h-40 rounded-lg overflow-hidden border border-gray-700 hover:border-[#ec028b] transition-colors block group">
                                        <img src={`https://maps.googleapis.com/maps/api/staticmap?center=${propertyData.latitude},${propertyData.longitude}&zoom=20&size=400x300&maptype=satellite&key=${MAPS_API_KEY}`} className="w-full h-full object-cover" alt="Satellite" />
                                        <div className="absolute bottom-1 left-2 bg-black/70 text-[10px] text-white px-1 rounded flex items-center"><SatelliteIcon className="w-3 h-3 mr-1"/> 2D Satellite</div>
                                    </a>
                                    
                                    <a href={`https://earth.google.com/web/search/${encodeURIComponent(propertyData.address)}/@${propertyData.latitude},${propertyData.longitude},100a,35y,0h,0t,0r`} target="_blank" rel="noopener noreferrer" className="relative h-40 rounded-lg overflow-hidden border border-gray-700 hover:border-[#ec028b] transition-colors block group">
                                        <img src={`https://maps.googleapis.com/maps/api/staticmap?center=${propertyData.latitude},${propertyData.longitude}&zoom=18&size=400x300&maptype=satellite&key=${MAPS_API_KEY}`} className="w-full h-full object-cover filter contrast-125" alt="3D Earth" />
                                        <div className="absolute bottom-1 left-2 bg-black/70 text-[10px] text-white px-1 rounded flex items-center"><MapIcon className="w-3 h-3 mr-1"/> 3D Earth</div>
                                    </a>

                                    <div className="relative h-40 rounded-lg overflow-hidden border border-gray-700 group">
                                        <img src={`https://maps.googleapis.com/maps/api/streetview?size=400x300&location=${propertyData.latitude},${propertyData.longitude}&fov=90&pitch=10&key=${MAPS_API_KEY}`} className="w-full h-full object-cover" alt="Street View" />
                                        <div className="absolute bottom-1 left-2 bg-black/70 text-[10px] text-white px-1 rounded flex items-center"><CameraIcon className="w-3 h-3 mr-1"/> Street View</div>
                                        <div className="absolute top-2 right-2 flex gap-2">
                                            <a href={`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${propertyData.latitude},${propertyData.longitude}&heading=${propertyData.streetViewHeading || 0}&pitch=5&fov=90`} target="_blank" rel="noopener noreferrer" className="p-1.5 bg-black/60 rounded hover:bg-[#ec028b] text-white" title="Open in Maps">
                                                <ShareIcon className="w-3 h-3"/>
                                            </a>
                                        </div>
                                        <button type="button" onClick={() => { setMeasureTarget('height'); setIsMeasureModalOpen(true); }} className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white font-bold text-xs">
                                            <RulerIcon className="w-4 h-4 mr-1" /> Measure Height
                                        </button>
                                    </div>
                                </div>

                                {/* Layer Manager (Common) - Moved Here to be just below images */}
                                <div className="bg-black/30 p-4 rounded-lg border border-gray-800 mb-6">
                                    <div>
                                        <QuestionLabel>How many existing layers?</QuestionLabel>
                                        <div className="flex gap-2 mt-2">
                                            {[1, 2, 3, 4].map(num => (
                                                <button 
                                                    key={num}
                                                    type="button"
                                                    onClick={() => updateLayerCount(num)}
                                                    className={cn(
                                                        "flex-1 h-10 rounded-lg border text-sm font-bold transition-all",
                                                        analysisData.layerConfig.count === num 
                                                            ? "bg-[#ec028b] border-pink-500 text-white" 
                                                            : "bg-gray-800 border-gray-600 text-gray-400 hover:bg-gray-700"
                                                    )}
                                                >
                                                    {num === 4 ? '4+' : num}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {isEstimateRequest ? (
                                    /* Full Estimator Inputs for "Ballpark" Mode */
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div>
                                                <QuestionLabel>Chimneys</QuestionLabel>
                                                <NumberSelector value={estimateInputs.roofFeatures?.chimneys || 0} onChange={v => handleEstimateInputChange('roofFeatures', 'chimneys', v)} />
                                            </div>
                                            <div>
                                                <QuestionLabel>Skylights</QuestionLabel>
                                                <NumberSelector value={estimateInputs.roofFeatures?.skylights || 0} onChange={v => handleEstimateInputChange('roofFeatures', 'skylights', v)} />
                                            </div>
                                            <div>
                                                <QuestionLabel>Swamp Coolers</QuestionLabel>
                                                <NumberSelector value={estimateInputs.roofFeatures?.swampCoolers || 0} onChange={v => handleEstimateInputChange('roofFeatures', 'swampCoolers', v)} />
                                            </div>
                                        </div>
                                        
                                        {/* Gutter Details */}
                                        <div className="p-6 bg-gray-900/40 border border-gray-700 rounded-xl space-y-6">
                                            <SectionHeader title="Gutter Details" icon={GutterIcon} />
                                            
                                            <div>
                                                <QuestionLabel>About how many feet of gutters are on your project?</QuestionLabel>
                                                <div className="flex gap-2">
                                                    <InputField 
                                                        placeholder="Ex: 120" 
                                                        type="number" 
                                                        value={estimateInputs.gutters?.length} 
                                                        onChange={e => handleEstimateInputChange('gutters', 'length', parseInt(e.target.value))} 
                                                    />
                                                    <Button variant="secondary" type="button" onClick={() => { setMeasureTarget('gutterLength'); setIsMeasureModalOpen(true); }}>
                                                        <RulerIcon className="w-4 h-4 mr-2" /> Measure
                                                    </Button>
                                                </div>
                                            </div>

                                            <div className="h-48 w-full bg-gray-800 rounded-lg overflow-hidden relative group">
                                                <img 
                                                    src="https://images.unsplash.com/photo-1595846519845-68e298c2edd8?q=80&w=1000&auto=format&fit=crop" 
                                                    alt="Residential Gutter Example" 
                                                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" 
                                                />
                                                <div className="absolute bottom-2 right-2 text-xs text-gray-400 bg-black/50 px-2 py-1 rounded">
                                                    Standard Residential Gutter System
                                                </div>
                                            </div>

                                            <div>
                                                <QuestionLabel>How many miters (gutter corners) are on your project?</QuestionLabel>
                                                <InputField 
                                                    placeholder="Ex: 6" 
                                                    type="number" 
                                                    value={estimateInputs.gutters?.miters} 
                                                    onChange={e => handleEstimateInputChange('gutters', 'miters', parseInt(e.target.value))} 
                                                />
                                            </div>

                                            <div>
                                                <QuestionLabel>How many downspouts does your property currently have?</QuestionLabel>
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                                                    {['1-Story', '2-Story', '3-Story', '4-Story'].map((story, idx) => {
                                                        const fieldMap = ['downspouts1Story', 'downspouts2Story', 'downspouts3Story', 'downspouts4Story'];
                                                        const field = fieldMap[idx];
                                                        return (
                                                            <div key={story}>
                                                                <label className="text-xs text-gray-500 mb-1 block text-center">{story}</label>
                                                                <div className="bg-black/30 border border-gray-700 rounded-lg p-1">
                                                                     <input 
                                                                        className="w-full bg-transparent text-center text-white focus:outline-none h-10"
                                                                        type="number"
                                                                        placeholder="0"
                                                                        value={estimateInputs.gutters?.[field as keyof typeof estimateInputs.gutters] || ''}
                                                                        onChange={e => handleEstimateInputChange('gutters', field, parseInt(e.target.value))}
                                                                     />
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Heat Trace Details */}
                                        <div className="p-6 bg-gray-900/40 border border-gray-700 rounded-xl space-y-6">
                                            <SectionHeader title="Heat Trace Details" icon={HeatTraceIcon} />

                                            {/* Length Input */}
                                            <div>
                                                <QuestionLabel>What's the total length (in feet) of the area you'd like heat trace installed on?</QuestionLabel>
                                                <div className="flex gap-2">
                                                    <InputField
                                                        placeholder="Ex: 85"
                                                        type="number"
                                                        value={estimateInputs.heatTrace?.length || ''}
                                                        onChange={e => handleEstimateInputChange('heatTrace', 'length', parseInt(e.target.value))}
                                                    />
                                                    <Button variant="secondary" type="button" onClick={() => { setMeasureTarget('heatTrace'); setIsMeasureModalOpen(true); }}>
                                                        <RulerIcon className="w-4 h-4 mr-2" /> Measure
                                                    </Button>
                                                </div>
                                            </div>

                                            {/* Downspouts */}
                                            <div>
                                                <QuestionLabel>How many downspouts would you like heat cable added to?</QuestionLabel>
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                                                    {['1-Story', '2-Story', '3-Story', '4-Story'].map((story, idx) => {
                                                        const fieldMap = ['downspouts1Story', 'downspouts2Story', 'downspouts3Story', 'downspouts4Story'];
                                                        const field = fieldMap[idx];
                                                        return (
                                                            <div key={story}>
                                                                <label className="text-xs text-gray-500 mb-1 block text-center">{story}</label>
                                                                <div className="bg-black/30 border border-gray-700 rounded-lg p-1">
                                                                        <input
                                                                        className="w-full bg-transparent text-center text-white focus:outline-none h-10"
                                                                        type="number"
                                                                        placeholder=""
                                                                        value={estimateInputs.heatTrace?.[field as keyof typeof estimateInputs.heatTrace] || ''}
                                                                        onChange={e => handleEstimateInputChange('heatTrace', field, parseInt(e.target.value))}
                                                                        />
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            {/* Eave Overhang */}
                                            <div>
                                                <QuestionLabel>Which eave overhang looks most like your home?</QuestionLabel>
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                                                    {EAVE_OPTIONS.map((option) => (
                                                        <div
                                                            key={option.name}
                                                            onClick={() => handleEstimateInputChange('heatTrace', 'eaveOverhang', option.name)}
                                                            className={cn(
                                                                "cursor-pointer rounded-xl overflow-hidden border-2 transition-all relative group h-32",
                                                                estimateInputs.heatTrace?.eaveOverhang === option.name
                                                                    ? "border-[#ec028b]"
                                                                    : "border-gray-700 hover:border-gray-500"
                                                            )}
                                                        >
                                                            <img src={option.imageUrl} alt={option.name} className="w-full h-full object-cover" />
                                                            <div className="absolute inset-0 bg-black/40 flex items-end justify-center pb-2">
                                                                <span className="font-bold text-white text-sm shadow-black drop-shadow-md">{option.name}</span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    /* Access & Safety for "Quote/Inspection" Mode */
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div>
                                                <QuestionLabel>Access Type</QuestionLabel>
                                                <ToggleGroup options={['Ladder', 'Roof Hatch', 'Drone']} value={analysisData.access.type} onChange={(v) => setAnalysisData(p => ({...p, access: {...p.access, type: v}}))} />
                                            </div>
                                            <div>
                                                <QuestionLabel>Ladders Required</QuestionLabel>
                                                <MultiSelectGroup 
                                                    options={['18\' Little Giant', '28\' HyperLite', '32\' HyperLite', '40\' Aluminum']} 
                                                    selected={analysisData.ladders} 
                                                    onChange={v => setAnalysisData(p => ({...p, ladders: p.ladders.includes(v) ? p.ladders.filter(x=>x!==v) : [...p.ladders, v]}))} 
                                                />
                                            </div>
                                        </div>
                                        
                                        <div className="bg-black/30 border border-gray-800 rounded-lg p-4 text-sm h-full">
                                            <h4 className="text-[#ec028b] font-bold mb-2 text-xs uppercase tracking-wider">Solar Intelligence Data</h4>
                                            <div className="space-y-2">
                                                <div className="flex justify-between border-b border-gray-800 pb-1">
                                                    <span className="text-gray-400">Total SQ</span>
                                                    <span className="font-mono font-bold text-white">{analysisData.result.finalSq.toFixed(2)}</span>
                                                </div>
                                                <div className="flex justify-between border-b border-gray-800 pb-1">
                                                    <span className="text-gray-400">Total Facets</span>
                                                    <span className="font-mono text-white">{analysisData.result.roofEstimate.totalFacets}</span>
                                                </div>
                                                <div className="flex justify-between border-b border-gray-800 pb-1">
                                                    <span className="text-gray-400">Dominant Pitch</span>
                                                    <span className="font-mono text-white">{analysisData.result.dominantPitch}/12</span>
                                                </div>
                                                <div className="mt-2 max-h-24 overflow-y-auto scrollbar-hide">
                                                    {analysisData.result.pitchBreakdown.map(p => (
                                                        <div key={p.pitch} className="flex justify-between text-xs text-gray-500">
                                                            <span>{p.pitch}/12 Pitch</span>
                                                            <span>{p.sq.toFixed(2)} SQ</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="flex justify-end pt-2"><Button size="sm" onClick={() => setIsRoofAnalysisCollapsed(true)}>Confirm Analysis</Button></div>
                            </div>
                        )}
                    </div>
                )}

                {/* DETAILED SCOPE (Restored from Zoho) - Always Visible */}
                {/* HIDE detailed scope if just looking for ballpark (Exploring) */}
                {(purchaseIntent === 'Ready' && !isInsurance) && (
                    <div className="animate-fade-in">
                        {isDetailedScopeCollapsed ? (
                            <RenderCollapsedSection 
                                title="Detailed Scope" 
                                summary={
                                    <SummaryDisplay items={[
                                        { label: "Material", value: detailedScope.materialPreference },
                                        { label: "Decking", value: detailedScope.deckingAction },
                                        { label: "Satellite", value: detailedScope.satelliteAction },
                                        { label: "Swamp Cooler", value: detailedScope.swampCoolerAction },
                                        { label: "Solar", value: detailedScope.solarAction },
                                        { label: "Notes", value: detailedScope.additionalDetails || detailedScope.projectDetails || '-' }
                                    ]} />
                                } 
                                onEdit={() => setIsDetailedScopeCollapsed(false)} 
                            />
                        ) : (
                            <div className="p-6 bg-gray-900/40 border border-gray-700 rounded-xl space-y-6">
                                <SectionHeader title="Detailed Scope" icon={ListBulletIcon} />
                                
                                <AssessmentQuestion label="Roof Material Considering">
                                    <ToggleGroup options={['Asphalt Shingles', 'Metal', 'Tile', 'TPO/Membrane', 'Wood Shake']} value={detailedScope.materialPreference} onChange={v => setDetailedScope(p => ({...p, materialPreference: v}))} />
                                </AssessmentQuestion>

                                <AssessmentQuestion label="Decking / Wood Replacement">
                                    <ToggleGroup options={['N/A - No Decking', 'Replace Damaged', 'Not Sure']} value={detailedScope.deckingAction} onChange={v => setDetailedScope(p => ({...p, deckingAction: v}))} />
                                </AssessmentQuestion>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <QuestionLabel>Satellite Dish</QuestionLabel>
                                        <select className="w-full bg-black/30 border border-gray-700 rounded p-2 text-white" value={detailedScope.satelliteAction} onChange={e => setDetailedScope(p => ({...p, satelliteAction: e.target.value}))}>
                                            <option value="N/A">N/A</option>
                                            <option value="Keep">Keep on Roof</option>
                                            <option value="Remove">Remove</option>
                                            <option value="Replace">Install New</option>
                                        </select>
                                    </div>
                                    <div>
                                        <QuestionLabel>Swamp Cooler</QuestionLabel>
                                        <select className="w-full bg-black/30 border border-gray-700 rounded p-2 text-white" value={detailedScope.swampCoolerAction} onChange={e => setDetailedScope(p => ({...p, swampCoolerAction: e.target.value}))}>
                                            <option value="N/A">N/A</option>
                                            <option value="Keep">Keep on Roof</option>
                                            <option value="Remove">Remove</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <div>
                                    <QuestionLabel>Solar Panels</QuestionLabel>
                                    <div className="space-y-2">
                                        <select className="w-full bg-black/30 border border-gray-700 rounded p-2 text-white" value={detailedScope.solarAction} onChange={e => setDetailedScope(p => ({...p, solarAction: e.target.value}))}>
                                            <option value="N/A">N/A - No Solar</option>
                                            <option value="Original">Original Installers Handle</option>
                                            <option value="RHIVE_Reset">RHIVE Remove & Reinstall</option>
                                            <option value="RHIVE_Dispose">RHIVE Remove & Dispose</option>
                                        </select>
                                        {detailedScope.solarAction.includes('RHIVE') && (
                                            <div className="p-3 bg-gray-800/50 rounded">
                                                <QuestionLabel>Solar Storage</QuestionLabel>
                                                <ToggleGroup options={['Store On-Site', 'Store at RHIVE', 'Owner Arranges']} value={detailedScope.solarStorage} onChange={v => setDetailedScope(p => ({...p, solarStorage: v}))} />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                                <div>
                                    <QuestionLabel>Additional Structures</QuestionLabel>
                                    <InputField placeholder="Note details here..." value={detailedScope.additionalDetails} onChange={e => setDetailedScope(p => ({...p, additionalDetails: e.target.value}))} />
                                </div>

                                <div className="border-t border-gray-700 pt-4">
                                    <QuestionLabel>Upload Blueprints / Specs</QuestionLabel>
                                    <div className="border-2 border-dashed border-gray-600 rounded-xl p-6 text-center hover:border-gray-400 transition-colors cursor-pointer bg-gray-900/20">
                                        <CloudArrowUpIcon className="w-8 h-8 mx-auto text-gray-500 mb-2" />
                                        <p className="text-sm text-gray-400">Drag & Drop or Click to Upload</p>
                                    </div>
                                </div>
                                <div className="flex justify-end mt-4">
                                    <Button size="sm" onClick={() => setIsDetailedScopeCollapsed(true)} type="button">Next</Button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
                
                {/* Estimate Follow-up Schedule - Always Visible */}
                {isEstimateRequest && (
                    <div className="p-6 bg-blue-900/20 border border-blue-500/30 rounded-xl">
                        <SectionHeader title="Estimate Follow-up" icon={CalendarDaysIcon} />
                        <p className="text-sm text-blue-300 mb-4">Schedule a call to review this estimate with the customer.</p>
                        


                        <SchedulingBlock 
                            onScheduleConfirm={(details) => alert(`Scheduled Call: ${details}`)} 
                            notesLabel="Notes for Call"
                            isBlocked={isOutOfBounds}
                        />
                    </div>
                )}

                {/* CUSTOMER PROFILE (Psychographics) - Always Visible */}
                {(purchaseIntent === 'Ready' && !isInsurance) && (
                    <div className="animate-fade-in">
                        {isProfileCollapsed ? (
                            <RenderCollapsedSection 
                                title="Customer Profile" 
                                summary={
                                    <SummaryDisplay items={[
                                        { label: "Concerns", value: customerProfile.concerns.join(', ') },
                                        { label: "Criteria", value: customerProfile.decisionCriteria.join(', ') },
                                        { label: "Familiarity", value: customerProfile.familiarity },
                                        { label: "Style", value: customerProfile.investmentStyle },
                                        { label: "Readiness", value: customerProfile.readiness }
                                    ]} />
                                } 
                                onEdit={() => setIsProfileCollapsed(false)} 
                            />
                        ) : (
                            <div className="p-6 bg-gray-900/40 border border-purple-500/30 rounded-xl space-y-6">
                                <SectionHeader title="Customer Profile" icon={MegaphoneIcon} />
                                
                                <div>
                                    <QuestionLabel>Main Concerns</QuestionLabel>
                                    <MultiSelectGroup options={['Longevity', 'Curb Appeal', 'Disruption', 'Budget', 'Warranty']} selected={customerProfile.concerns} onChange={v => setCustomerProfile(p => ({...p, concerns: p.concerns.includes(v) ? p.concerns.filter(x=>x!==v) : [...p.concerns, v]}))} />
                                </div>
                                
                                <div>
                                    <QuestionLabel>Decision Process</QuestionLabel>
                                    <MultiSelectGroup options={['Need Tech Specs', 'Want Examples', 'Compare Options', 'Trust Expert']} selected={customerProfile.decisionCriteria} onChange={v => setCustomerProfile(p => ({...p, decisionCriteria: p.decisionCriteria.includes(v) ? p.decisionCriteria.filter(x=>x!==v) : [...p.decisionCriteria, v]}))} />
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <QuestionLabel>Familiarity</QuestionLabel>
                                        <select className="w-full bg-black/30 border border-gray-700 rounded p-2 text-white" value={customerProfile.familiarity} onChange={e => setCustomerProfile(p => ({...p, familiarity: e.target.value}))}>
                                            <option>Homeowner (Beginner)</option>
                                            <option>Some Knowledge</option>
                                            <option>Experienced / Pro</option>
                                        </select>
                                    </div>
                                    <div>
                                        <QuestionLabel>Investment Style</QuestionLabel>
                                        <select className="w-full bg-black/30 border border-gray-700 rounded p-2 text-white" value={customerProfile.investmentStyle} onChange={e => setCustomerProfile(p => ({...p, investmentStyle: e.target.value}))}>
                                            <option>Best Quality (Pay More)</option>
                                            <option>Value Driven</option>
                                            <option>Budget Focused</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <QuestionLabel>Readiness to Start</QuestionLabel>
                                    <ToggleGroup options={['Immediately', 'ASAP (if aligned)', 'Need to Consult', 'Researching']} value={customerProfile.readiness} onChange={v => setCustomerProfile(p => ({...p, readiness: v}))} />
                                </div>

                                <div className="flex justify-end mt-4"><Button size="sm" onClick={() => setIsProfileCollapsed(true)}>Finish Profile</Button></div>
                            </div>
                        )}
                    </div>
                )}

                {/* FOOTER (Action Bar) */}
                {contacts.length > 0 && (
                    <div className="sticky bottom-4 z-20 flex items-center justify-between bg-black/90 p-4 rounded-2xl border border-gray-700/50 backdrop-blur-lg shadow-2xl mt-8">
                        <div>
                            <p className="text-xs text-gray-400 uppercase font-bold">{isEstimateRequest ? "Generating Estimate for:" : "Creating Project:"}</p>
                            <p className="text-white font-bold truncate max-w-[200px]">{requiresOrganization ? (companyData.propertyName || propertyData.address) : (contacts[0]?.lastName + ' Residence')}</p>
                        </div>
                        <div className="flex space-x-4">
                            <Button variant="secondary" onClick={() => setActivePageId('E-01')} type="button">Cancel</Button>
                            <Button size="lg" type="submit">
                                {isEstimateRequest ? "Send Estimate & Invite" : "Create & Open File"}
                            </Button>
                        </div>
                    </div>
                )}
            </form>
        </PageContainer>
    );
};

// Helper Components
const RenderCollapsedSection = ({ 
    title, 
    summary, 
    onEdit, 
    variant = 'default' 
}: { 
    title: string, 
    summary: React.ReactNode, 
    onEdit: () => void,
    variant?: 'default' | 'pink' | 'green'
}) => {
    const borderClass = variant === 'pink' ? 'border-rhive-pink bg-rhive-pink/10' : 
                       variant === 'green' ? 'border-green-500/50 bg-green-900/20' : 
                       'border-gray-700 bg-gray-900/40 hover:border-rhive-pink/50';

    return (
        <div onClick={onEdit} className={cn("border p-4 rounded-xl flex items-center justify-between shadow-sm cursor-pointer group transition-all mb-6", borderClass)}>
            <div className="flex-1 min-w-0 mr-4">
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">{title}</p>
                <div className="text-white font-medium">{summary}</div>
            </div>
            <div className="text-gray-600 group-hover:text-[#ec028b] transition-colors"><PencilSquareIcon className="w-5 h-5" /></div>
        </div>
    );
};

const AssessmentQuestion: React.FC<React.PropsWithChildren<{ label: string }>> = ({ label, children }) => (
    <div className="bg-gray-800/30 p-4 rounded-lg border border-gray-700/50"><QuestionLabel>{label}</QuestionLabel>{children}</div>
);

interface ContactFormProps {
    initialData?: Partial<Contact>;
    onSave: (c: Contact) => void;
    onCancel: () => void;
    isPrimary: boolean;
    isCommercial: boolean;
    companyOptions?: string[];
}

const ContactForm: React.FC<ContactFormProps> = ({ 
    initialData, 
    onSave, 
    onCancel, 
    isPrimary, 
    isCommercial, 
    companyOptions 
}) => {
    const { users } = useMockDB();
    const [data, setData] = useState<Contact>({
        id: initialData?.id || `temp-${Date.now()}`,
        firstName: initialData?.firstName || '',
        lastName: initialData?.lastName || '',
        phone: initialData?.phone || '',
        email: initialData?.email || '',
        role: initialData?.role || 'Property Owner',
        isPrimary: isPrimary,
        existingUserId: initialData?.existingUserId,
        affiliations: initialData?.affiliations || [],
        responsibilities: initialData?.responsibilities || [],
        preferredContactMethod: initialData?.preferredContactMethod || 'Phone'
    });
    
    const [isCustomRole, setIsCustomRole] = useState(false);
    const [customRole, setCustomRole] = useState('');
    const [foundMatch, setFoundMatch] = useState<User | null>(null);
    const [activeRoleCategory, setActiveRoleCategory] = useState<'Residential' | 'Commercial' | 'Government'>('Residential');

    // Refs for keyboard navigation
    const firstNameRef = useRef<HTMLInputElement>(null);
    const lastNameRef = useRef<HTMLInputElement>(null);
    const phoneRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const customRoleRef = useRef<HTMLInputElement>(null);

    const handleEnter = (e: React.KeyboardEvent, nextRef: React.RefObject<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            nextRef.current?.focus();
        }
    };

    const roleCategories = {
        'Residential': ['Property Owner', 'Landlord', 'Tenant', 'Neighbor', 'Relative'],
        'Commercial': ['Property Manager', 'Building Owner', 'Maintenance Supervisor', 'HOA Board Member'],
        'Government': ['Contracting Officer', 'Site Representative', 'Facility Manager']
    };

    useEffect(() => {
        const role = initialData?.role;
        if (role) {
            if (roleCategories.Residential.includes(role)) setActiveRoleCategory('Residential');
            else if (roleCategories.Commercial.includes(role)) setActiveRoleCategory('Commercial');
            else if (roleCategories.Government.includes(role)) setActiveRoleCategory('Government');
            else if (role !== 'Other') {
                 setIsCustomRole(true);
                 setCustomRole(role);
            }
        } else if (isCommercial) {
            setActiveRoleCategory('Commercial');
        }
    }, [initialData?.role, isCommercial]);

    useEffect(() => {
        if (data.existingUserId) return; 
        
        const searchTerm = data.email || data.phone || (data.firstName.length > 2 ? data.firstName : '');
        if (!searchTerm) {
            setFoundMatch(null);
            return;
        }

        const match = users.find(u => 
            (u.email && u.email.toLowerCase() === data.email.toLowerCase()) ||
            (u.phone && u.phone === data.phone) ||
            (data.firstName.length > 2 && data.lastName.length > 2 && u.name.toLowerCase().includes(`${data.firstName} ${data.lastName}`.toLowerCase()))
        );
        
        setFoundMatch(match || null);
    }, [data.email, data.phone, data.firstName, data.lastName, users, data.existingUserId]);

    const handleUseExisting = () => {
        if (foundMatch) {
            const [first, ...last] = foundMatch.name.split(' ');
            setData({
                ...data,
                firstName: first,
                lastName: last.join(' '),
                email: foundMatch.email || data.email,
                phone: foundMatch.phone || data.phone,
                existingUserId: foundMatch.id
            });
            setFoundMatch(null);
        }
    };

    const handleSave = () => {
        if (!data.firstName || !data.lastName) return alert("Name is required");
        if (!data.preferredContactMethod) return alert("Preferred Contact Method is required");
        onSave({
            ...data,
            role: isCustomRole ? customRole : data.role
        });
    };

    const capitalize = (str: string) => str.replace(/\b\w/g, char => char.toUpperCase());

    const handleNameChange = (field: 'firstName' | 'lastName', value: string) => {
        setData(prev => ({
            ...prev,
            [field]: capitalize(value)
        }));
    };

    const toggleAffiliation = (option: string) => {
        setData(prev => {
            const exists = prev.affiliations.includes(option);
            return {
                ...prev,
                affiliations: exists 
                    ? prev.affiliations.filter(a => a !== option)
                    : [...prev.affiliations, option]
            };
        });
    };

    const toggleResponsibility = (opt: string) => {
        setData(prev => {
            const exists = prev.responsibilities.includes(opt);
            return {
                ...prev,
                responsibilities: exists 
                    ? prev.responsibilities.filter(r => r !== opt)
                    : [...prev.responsibilities, opt]
            };
        });
    };

    return (
        <div className="p-6 bg-gray-900/30 border border-gray-700 rounded-xl space-y-4 animate-fade-in relative shadow-inner">
            {isPrimary && <h4 className="text-[#ec028b] font-bold text-sm uppercase tracking-wide mb-2">Primary Contact</h4>}
            
            {foundMatch && !data.existingUserId && (
                <div className="absolute -top-3 left-0 right-0 mx-4 bg-blue-900/90 border border-blue-500 text-white p-3 rounded-lg shadow-lg flex justify-between items-center z-10 backdrop-blur-md animate-bounce-in">
                    <div className="flex items-center">
                        <FingerPrintIcon className="w-5 h-5 mr-2 text-blue-300" />
                        <span className="text-sm">Found existing user: <strong>{foundMatch.name}</strong></span>
                    </div>
                    <Button size="sm" variant="secondary" onClick={handleUseExisting} type="button">Link User</Button>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <QuestionLabel required>First Name</QuestionLabel>
                    <InputField 
                        ref={firstNameRef}
                        value={data.firstName} 
                        onChange={e => handleNameChange('firstName', e.target.value)} 
                        placeholder="Jane"
                        onKeyDown={(e) => handleEnter(e, lastNameRef)}
                    />
                </div>
                <div>
                    <QuestionLabel required>Last Name</QuestionLabel>
                    <InputField 
                        ref={lastNameRef}
                        value={data.lastName} 
                        onChange={e => handleNameChange('lastName', e.target.value)} 
                        placeholder="Doe"
                        onKeyDown={(e) => handleEnter(e, phoneRef)}
                    />
                </div>
                <div>
                    <QuestionLabel required>Phone Number</QuestionLabel>
                    <InputField 
                        ref={phoneRef}
                        value={data.phone} 
                        onChange={e => {
                            const formatted = formatPhoneNumber(e.target.value);
                            setData({...data, phone: formatted});
                        }}
                        type="tel" 
                        placeholder="(000) 000-0000"
                        onKeyDown={(e) => handleEnter(e, emailRef)}
                        maxLength={14}
                    />
                </div>
                <div>
                    <QuestionLabel required>Email Address</QuestionLabel>
                    <InputField 
                        ref={emailRef}
                        value={data.email} 
                        onChange={e => setData({...data, email: e.target.value})} 
                        type="email" 
                        placeholder="jane@example.com"
                        onKeyDown={(e) => isCustomRole ? handleEnter(e, customRoleRef) : undefined}
                    />
                </div>
            </div>

            <div className="mt-2">
                <QuestionLabel required>Preferred Contact Method</QuestionLabel>
                <div className="flex gap-4">
                    {['Phone', 'Text', 'Email'].map((method) => (
                        <label key={method} className="flex items-center cursor-pointer">
                            <input 
                                type="radio" 
                                name="contactMethod" 
                                value={method} 
                                checked={data.preferredContactMethod === method}
                                onChange={(e) => setData({...data, preferredContactMethod: e.target.value as any})}
                                className="mr-2 text-[#ec028b] focus:ring-[#ec028b] bg-gray-900 border-gray-600"
                            />
                            <span className="text-sm text-gray-300">{method}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Commercial Logic: Affiliation - Only if companies exist */}
            {isCommercial && companyOptions && companyOptions.length > 0 && (
                <div className="mt-4">
                    <QuestionLabel>Affiliation (Select all that apply)</QuestionLabel>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {companyOptions.map(opt => {
                            const isSelected = data.affiliations.includes(opt);
                            return (
                                <div 
                                    key={opt}
                                    onClick={() => toggleAffiliation(opt)}
                                    className={cn(
                                        "cursor-pointer px-3 py-2 rounded-lg border text-sm transition-all flex items-center justify-center text-center",
                                        isSelected 
                                            ? "bg-[#ec028b]/20 border-[#ec028b] text-white shadow-[0_0_10px_rgba(236,2,139,0.2)]" 
                                            : "bg-gray-900/40 border-gray-700 text-gray-400 hover:bg-gray-800"
                                    )}
                                >
                                    <span className="truncate">{opt}</span>
                                </div>
                            );
                        })}
                    </div>
                    <HelperText>Link this contact to the Company, the Property, or both.</HelperText>
                </div>
            )}

            <div className="mt-4">
                <QuestionLabel>Contact Functions (Select all that apply)</QuestionLabel>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <ResponsibilityToggle 
                        label="Bid / Quote" 
                        icon={DocumentTextIcon} 
                        selected={data.responsibilities.includes('Bid')} 
                        onClick={() => toggleResponsibility('Bid')} 
                    />
                    <ResponsibilityToggle 
                        label="Billing / Invoice" 
                        icon={CurrencyDollarIcon} 
                        selected={data.responsibilities.includes('Billing')} 
                        onClick={() => toggleResponsibility('Billing')} 
                    />
                    <ResponsibilityToggle 
                        label="Site Access" 
                        icon={KeyIcon} 
                        selected={data.responsibilities.includes('Access')} 
                        onClick={() => toggleResponsibility('Access')} 
                    />
                </div>
            </div>

            <div className="mt-4">
                <div className="flex justify-between items-end mb-2">
                    <QuestionLabel>Project Role</QuestionLabel>
                    <div className="flex space-x-1 text-[10px]">
                        {['Residential', 'Commercial', 'Government'].map((cat) => (
                            <button 
                                key={cat}
                                type="button" 
                                onClick={() => setActiveRoleCategory(cat as any)}
                                className={cn(
                                    "px-2 py-1 rounded border transition-colors",
                                    activeRoleCategory === cat ? "bg-gray-700 border-gray-500 text-white" : "text-gray-500 border-transparent hover:text-gray-300"
                                )}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
                {!isCustomRole ? (
                    <div className="flex flex-wrap gap-2">
                        {[...roleCategories[activeRoleCategory], 'Other'].map((roleOption) => (
                            <div 
                                key={roleOption}
                                onClick={() => {
                                    if (roleOption === 'Other') {
                                        setCustomRole('');
                                        setIsCustomRole(true);
                                    } else {
                                        setData({...data, role: roleOption});
                                    }
                                }}
                                className={cn(
                                    "cursor-pointer py-0.5 px-1.5 rounded border text-[10px] font-medium transition-all flex items-center justify-center text-center min-w-[50px]",
                                    data.role === roleOption 
                                        ? "bg-[#ec028b]/20 border-[#ec028b] text-white shadow-[0_0_5px_rgba(236,2,139,0.2)]" 
                                        : "bg-gray-900/40 border-gray-700 text-gray-400 hover:border-gray-500 hover:bg-gray-800"
                                )}
                            >
                                {roleOption}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="relative mt-2">
                         <InputField 
                            ref={customRoleRef}
                            value={customRole} 
                            onChange={e => {
                                setCustomRole(e.target.value);
                                setData({...data, role: e.target.value});
                            }} 
                            placeholder="Enter custom role (e.g. Executor, Neighbor)"
                            autoFocus
                            className="pr-10"
                        />
                         <button 
                            onClick={() => { setIsCustomRole(false); setData({...data, role: 'Property Owner'}); setCustomRole(''); }} 
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-800"
                            type="button"
                            title="Back to list"
                        >
                            <XIcon className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-800">
                {!isPrimary && <Button variant="secondary" onClick={onCancel} type="button">Cancel</Button>}
                <Button onClick={handleSave} type="button">{data.existingUserId ? 'Link & Save' : 'Save Contact'}</Button>
            </div>
        </div>
    );
};

const ContactCard: React.FC<{ contact: Contact; onEdit: () => void; onDelete: () => void }> = ({ contact, onEdit, onDelete }) => (
    <div onClick={onEdit} className="flex items-center justify-between p-4 bg-gray-900/50 border border-gray-700 rounded-xl hover:border-[#ec028b]/50 transition-all cursor-pointer group">
        <div className="flex items-center space-x-4">
            <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-white font-bold border", contact.isPrimary ? "bg-[#ec028b]" : "bg-gray-700")}>{contact.firstName[0]}</div>
            <div>
                <h4 className="text-white font-bold text-sm">{contact.firstName} {contact.lastName}</h4>
                <p className="text-xs text-gray-400">{contact.role} • {contact.phone} • <span className="text-[#ec028b]">{contact.preferredContactMethod}</span></p>
                 <div className="flex flex-wrap gap-1 mt-1">
                    {contact.responsibilities && contact.responsibilities.map((r: string) => (
                        <span key={r} className="text-[10px] bg-gray-800 px-1.5 py-0.5 rounded text-gray-300 border border-gray-600">{r}</span>
                    ))}
                </div>
            </div>
        </div>
        {!contact.isPrimary && (
            <button 
                onClick={(e) => { e.stopPropagation(); onDelete(); }} 
                className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-colors"
                title="Delete Contact"
            >
                <TrashIcon className="w-5 h-5" />
            </button>
        )}
    </div>
);

const ResponsibilityToggle = ({ label, icon: Icon, selected, onClick }: { label: string, icon: any, selected: boolean, onClick: () => void }) => (
    <button 
        type="button"
        onClick={onClick}
        className={cn(
            "cursor-pointer px-3 py-2 rounded-lg border text-sm transition-all flex items-center justify-center font-medium text-center outline-none focus:outline-none",
            selected 
                ? "bg-[#ec028b]/20 border-[#ec028b] text-white shadow-[0_0_10px_rgba(236,2,139,0.2)]" 
                : "bg-gray-900/40 border-gray-700 text-gray-400 hover:bg-gray-800"
        )}
    >
        <Icon className={cn("w-4 h-4 mr-2", selected ? "text-[#ec028b]" : "text-gray-500")} />
        {label}
    </button>
);

export default CustomerInputPage;
