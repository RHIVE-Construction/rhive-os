import React, { useState, useEffect } from 'react';
import { getWeatherData, CityWeather } from '../lib/weather';
import { cn } from '../lib/utils';

// --- CUSTOM SVG ICONS FOR WEATHER ---
const SunIcon = (p: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...p}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m0 13.5V21M4.93 4.93l1.59 1.59m10.96 10.96l1.59 1.59M3 12h2.25m13.5 0H21M5.05 18.95l1.59-1.59m10.96-10.96l1.59-1.59M12 8.25a3.75 3.75 0 1 0 0 7.5 3.75 3.75 0 0 0 0-7.5Z" />
    </svg>
);

const CloudIcon = (p: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...p}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 0 0 4.5 4.5H18a3.75 3.75 0 0 0 1.333-7.261 3 3 0 0 0-5.604-3.113A4.5 4.5 0 0 0 4.5 12a4.482 4.482 0 0 0-2.25 3Z" />
    </svg>
);

const CloudRainIcon = (p: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...p}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M1.5 8.678c0-2.308 1.835-4.183 4.1-4.183 1.332 0 2.502.656 3.24 1.666a4.002 4.002 0 0 1 7.378 1.48A3.75 3.75 0 0 1 18.3 15.02H6.6a4.49 4.49 0 0 1-4.1-4.179c0-.77.2-1.493.55-2.128M9 16.5v2.25M12 16.5v3M15 16.5v2.25M9 20.25h.008v.008H9V20.25Zm3 0h.008v.008H12v-.008Zm3 0h.008v.008H15v-.008Z" />
    </svg>
);

const CloseIcon = (p: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...p}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
);

const LocateIcon = (p: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...p}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1.5M12 19.5V21M3 12h1.5M19.5 12H21m-9-6a6 6 0 1 0 0 12 6 6 0 0 0 0-12Z" />
        <circle cx="12" cy="12" r="2" fill="currentColor" />
    </svg>
);

const DEFAULT_HISTORY = ["Salt Lake City, UT", "Denver, CO", "Boulder, CO", "Logan, UT", "Boise, ID"];

export const GlobalWeatherModal: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(true);
    const [activeCity, setActiveCity] = useState("Salt Lake City, UT");
    const [searchInput, setSearchInput] = useState("");
    const [isLocating, setIsLocating] = useState(false);
    
    // Previous 5 locations lookup history
    const [weatherHistory, setWeatherHistory] = useState<string[]>(() => {
        const stored = localStorage.getItem('rhive_weather_history');
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (e) {
                // fall through
            }
        }
        return DEFAULT_HISTORY;
    });

    useEffect(() => {
        const handleOpen = () => {
            const cached = localStorage.getItem('rhive_weather_city') || "Salt Lake City, UT";
            setActiveCity(cached);
            setSearchInput("");
            setIsOpen(true);
            setIsMinimized(true); // default minimize down
        };
        window.addEventListener('open-weather-forecast', handleOpen);
        return () => window.removeEventListener('open-weather-forecast', handleOpen);
    }, []);

    if (!isOpen) return null;

    const weather = getWeatherData(activeCity);

    const updateWeatherCity = (city: string) => {
        setActiveCity(city);
        localStorage.setItem('rhive_weather_city', city);
        window.dispatchEvent(new CustomEvent('weather-update', { detail: { city } }));

        // Update rolling history to keep the last 5
        setWeatherHistory(prev => {
            const cleanCity = city.trim();
            const nextHistory = [cleanCity, ...prev.filter(c => c.toLowerCase() !== cleanCity.toLowerCase())].slice(0, 5);
            localStorage.setItem('rhive_weather_history', JSON.stringify(nextHistory));
            return nextHistory;
        });
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchInput.trim()) {
            updateWeatherCity(searchInput.trim());
        }
    };

    const handleLocateMe = () => {
        setIsLocating(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;
                    
                    let resolvedCity = "Salt Lake City, UT";
                    if (Math.abs(lat - 39.7392) < 2 && Math.abs(lon - -104.9903) < 2) {
                        resolvedCity = "Denver, CO";
                    } else if (Math.abs(lat - 40.015) < 1 && Math.abs(lon - -105.2705) < 1) {
                        resolvedCity = "Boulder, CO";
                    } else if (Math.abs(lat - 41.737) < 1 && Math.abs(lon - -111.83) < 1) {
                        resolvedCity = "Logan, UT";
                    } else if (Math.abs(lat - 43.615) < 2 && Math.abs(lon - -116.2023) < 2) {
                        resolvedCity = "Boise, ID";
                    } else if (Math.abs(lat - 33.4484) < 3 && Math.abs(lon - -112.074) < 3) {
                        resolvedCity = "Phoenix, AZ";
                    } else {
                        resolvedCity = `Salt Lake City, UT`;
                    }
                    
                    setTimeout(() => {
                        updateWeatherCity(resolvedCity);
                        setIsLocating(false);
                    }, 600);
                },
                () => {
                    setTimeout(() => {
                        updateWeatherCity("Salt Lake City, UT");
                        setIsLocating(false);
                    }, 600);
                }
            );
        } else {
            setTimeout(() => {
                updateWeatherCity("Salt Lake City, UT");
                setIsLocating(false);
            }, 400);
        }
    };

    // Minimized Floating Glassmorphic view in bottom-right
    if (isMinimized) {
        return (
            <div 
                className="fixed bottom-6 right-6 w-[320px] bg-black/85 backdrop-blur-md border border-gray-800 rounded-xl shadow-2xl z-[9999] p-3 flex items-center justify-between cursor-pointer hover:border-[#ec028b]/50 hover:shadow-[0_0_15px_rgba(236,2,139,0.2)] transition-all animate-fade-in select-none"
                onClick={() => setIsMinimized(false)}
                style={{ clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)' }}
            >
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#ec028b] to-transparent"></div>
                <div className="flex items-center gap-3">
                    <div className="text-xl">
                        {weather.condition === 'Storm Alert' ? '🌨️' : weather.condition === 'Sunny' ? '🌤️' : '☁️'}
                    </div>
                    <div>
                        <div className="text-xs font-black text-white uppercase tracking-wider">{weather.city}</div>
                        <div className="text-[10px] text-[#ec028b] font-bold uppercase tracking-wider">{weather.condition}</div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-lg font-black text-white font-mono">{weather.temp}</span>
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsOpen(false);
                        }}
                        className="text-gray-400 hover:text-white p-1 hover:bg-white/5 rounded-lg transition-colors outline-none"
                    >
                        <CloseIcon className="w-4 h-4" />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-[9999] flex items-center justify-center p-4 select-none">
            {/* Modal Container with 24px Chamfer */}
            <div 
                className="bg-[#050505] border border-gray-800 w-full max-w-xl overflow-hidden shadow-2xl relative animate-fade-in"
                style={{ clipPath: 'polygon(24px 0, 100% 0, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0 100%, 0 24px)' }}
            >
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#ec028b] to-transparent"></div>
                
                {/* Header */}
                <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-gray-900/30">
                    <div>
                        <h3 className="text-lg font-black uppercase tracking-wider text-white">Geospatial Weather Outlook</h3>
                        <p className="text-xs text-gray-400 mt-0.5 font-semibold tracking-wide">RHIVE Climate Intel Center</p>
                    </div>
                    <div className="flex items-center gap-2">
                        {/* Header minimize (▼) button */}
                        <button 
                            onClick={() => setIsMinimized(true)} 
                            className="text-gray-400 hover:text-white p-1 hover:bg-white/5 rounded-lg transition-colors outline-none"
                            title="Minimize weather view"
                        >
                            <span className="text-sm font-black">▼</span>
                        </button>
                        <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white p-1 hover:bg-white/5 transition-colors outline-none">
                            <CloseIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    {/* Location Form & Pinpoint (Chamfered Inputs & Buttons) */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                        <form onSubmit={handleSearchSubmit} className="md:col-span-3 flex gap-2">
                            <input 
                                type="text"
                                placeholder="Search city or zip (e.g. SLC, Denver)..."
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                className="flex-grow bg-black/60 border border-gray-850 focus:border-[#ec028b] px-4 py-2.5 outline-none text-white text-xs font-semibold"
                                style={{ clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)' }}
                            />
                            <button
                                type="submit"
                                className="px-5 py-2.5 bg-[#ec028b] hover:bg-[#c90276] text-white text-xs font-black uppercase tracking-widest transition-all shadow-md"
                                style={{ clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)' }}
                            >
                                Search
                            </button>
                        </form>
                        <button
                            onClick={handleLocateMe}
                            disabled={isLocating}
                            className={cn(
                                "flex items-center justify-center gap-2 px-3 py-2.5 bg-black border border-gray-700 hover:border-[#ec028b]/50 text-xs font-black uppercase tracking-widest transition-all",
                                isLocating ? "text-gray-500 border-gray-800" : "text-[#ec028b]"
                            )}
                            style={{ clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)' }}
                        >
                            <LocateIcon className={cn("w-4 h-4", isLocating ? "animate-pulse" : "")} />
                            {isLocating ? "Locating..." : "Locate Me"}
                        </button>
                    </div>

                    {/* Rolling history of looked up locations */}
                    <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Recent Pinpoint Locations</label>
                        <div className="flex flex-wrap gap-2">
                            {weatherHistory.map((city) => (
                                <button
                                    key={city}
                                    onClick={() => updateWeatherCity(city)}
                                    className={cn(
                                        "px-3 py-1.5 text-[10px] uppercase tracking-wider font-bold transition-all border",
                                        activeCity.toLowerCase() === city.toLowerCase()
                                            ? "bg-[#ec028b]/15 text-[#ec028b] border-[#ec028b]/40 shadow-[0_0_8px_rgba(236,2,139,0.2)]"
                                             : "bg-black text-gray-400 border-gray-850 hover:border-gray-750"
                                    )}
                                    style={{ clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)' }}
                                >
                                    {city.split(',')[0]}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Main Stats Card with 12px Chamfer */}
                    <div 
                        className="p-5 bg-white/5 border border-gray-800 flex items-center justify-between"
                        style={{ clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)' }}
                    >
                        <div className="flex items-center">
                            {weather.condition === 'Storm Alert' ? (
                                <CloudRainIcon className="w-12 h-12 text-yellow-500 mr-4 animate-bounce" />
                            ) : weather.condition === 'Sunny' ? (
                                <SunIcon className="w-12 h-12 text-yellow-400 mr-4 animate-spin-slow" />
                            ) : (
                                <CloudIcon className="w-12 h-12 text-gray-400 mr-4" />
                            )}
                            <div>
                                <h4 className="text-sm font-black text-white uppercase tracking-wider">{weather.city}</h4>
                                <p className="text-xs text-[#ec028b] font-bold mt-1 uppercase tracking-widest">{weather.condition}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="text-3xl font-black text-white font-mono">{weather.temp}</span>
                        </div>
                    </div>

                    <div 
                        className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-black/40 border border-gray-800"
                        style={{ clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)' }}
                    >
                        <div className="flex flex-col items-center justify-center text-center">
                            <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">Humidity</span>
                            <p className="text-sm font-bold text-white mt-1">{weather.humidity}</p>
                        </div>
                        <div className="flex flex-col items-center justify-center text-center">
                            <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">Wind Velocity</span>
                            <p className="text-sm font-bold text-white mt-1">{weather.wind}</p>
                        </div>
                        <div className="flex flex-col items-center justify-center text-center">
                            <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">UV Index</span>
                            <p className="text-sm font-bold text-white mt-1">{weather.uv}</p>
                        </div>
                        <div className="flex flex-col items-center justify-center text-center">
                            <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">Hail Risk</span>
                            <p className={cn(
                                "text-sm font-bold mt-1",
                                weather.hailProb !== '0%' ? "text-yellow-500" : "text-green-500"
                            )}>{weather.hailProb}</p>
                        </div>
                    </div>

                    {/* 7-Day Forecast Grid */}
                    <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">7-Day Deployment Outlook</label>
                        <div className="space-y-1.5 max-h-[25vh] overflow-y-auto pr-1">
                            {weather.forecast.map((fc, i) => (
                                <div 
                                    key={i} 
                                    className="flex justify-between items-center py-2.5 px-4 bg-black/40 border border-gray-900 text-xs text-white"
                                    style={{ clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)' }}
                                >
                                    <span className="font-bold text-gray-300">{fc.day}</span>
                                    <div className="flex items-center gap-4">
                                        <span className={cn(
                                            "text-[9px] px-2 py-0.5 rounded font-black uppercase tracking-widest border",
                                            fc.condition === 'Storm Alert' ? "bg-red-950/60 border-red-900 text-red-400" :
                                            fc.condition === 'Sunny' ? "bg-yellow-950/60 border-yellow-900 text-yellow-400" :
                                            "bg-gray-900/60 border-gray-800 text-gray-400"
                                        )}>
                                            {fc.condition}
                                        </span>
                                        <span className="font-mono font-bold w-12 text-right text-gray-100">{fc.temp}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
