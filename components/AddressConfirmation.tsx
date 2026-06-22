import React, { useEffect, useRef, useState } from 'react';
import type { Place, BuildingData, SurveyState } from '../types';
import { Button } from './ui/button';
import { XIcon, Check, SatelliteIcon, CameraIcon, PlusIcon, TrashIcon } from './icons';
import { CircuitryBackground } from './CircuitryBackground';
import { cn } from '../lib/utils';
import { generateBuildingFromLatLng } from '../lib/mockData';
import { Switch } from './ui/switch';
import { useGoogleMapsApi } from '../hooks/useGoogleMapsApi';

interface AddressConfirmationProps {
  place: Place;
  onConfirm: () => void;
  onStartOver: () => void;
  streetViewUrl: string;
  satelliteViewUrl: string;
  buildingData: BuildingData | null;
  setBuildingData: React.Dispatch<React.SetStateAction<BuildingData | null>>;
  surveyState: SurveyState;
  onSurveyChange: React.Dispatch<React.SetStateAction<SurveyState>>;
}

declare global {
    interface Window {
      google: any;
    }
}

export const AddressConfirmation: React.FC<AddressConfirmationProps> = ({
  place,
  onConfirm,
  onStartOver,
  streetViewUrl,
  satelliteViewUrl,
  buildingData,
  setBuildingData,
  surveyState,
  onSurveyChange,
}) => {
  const [view, setView] = useState<'street' | 'satellite'>('satellite');
  const streetViewRef = useRef<HTMLDivElement>(null);
  const panoramaRef = useRef<any>(null);
  const [isStreetViewAvailable, setIsStreetViewAvailable] = useState(true);

  // Interactive Maps and Pin Drop states
  const isApiReady = useGoogleMapsApi();
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const markersRef = useRef<any[]>([]);
  const gPolygonsMapRef = useRef<Map<string, any>>(new Map());
  
  const [isAddingPin, setIsAddingPin] = useState(false);
  const [focusedBuildingId, setFocusedBuildingId] = useState<string | null>(null);
  const hasAnimatedRef = useRef<boolean>(false);
  const isAnimatingRef = useRef<boolean>(false);

  // Centroid calculator helper
  const getPolygonCenter = (vertices: { lat: number; lng: number }[], fallbackLat: number, fallbackLng: number) => {
    if (!vertices || vertices.length === 0) return { lat: fallbackLat, lng: fallbackLng };
    let minLat = Infinity, maxLat = -Infinity;
    let minLng = Infinity, maxLng = -Infinity;
    vertices.forEach(v => {
      if (v.lat < minLat) minLat = v.lat;
      if (v.lat > maxLat) maxLat = v.lat;
      if (v.lng < minLng) minLng = v.lng;
      if (v.lng > maxLng) maxLng = v.lng;
    });
    return {
      lat: (minLat + maxLat) / 2,
      lng: (minLng + maxLng) / 2
    };
  };

  // Set initial focus
  useEffect(() => {
    if (buildingData && !focusedBuildingId) {
      setFocusedBuildingId(buildingData.buildings[0]?.id || null);
    }
  }, [buildingData, focusedBuildingId]);

  // Clean up polygons on unmount
  useEffect(() => {
    return () => {
      gPolygonsMapRef.current.forEach(poly => poly.setMap(null));
      gPolygonsMapRef.current.clear();
    };
  }, []);

  const handleDeleteBuilding = (buildingId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!buildingData) return;

    const remaining = buildingData.buildings.filter(b => b.id !== buildingId);
    setBuildingData(prev => {
        if (!prev) return prev;
        return {
            ...prev,
            buildings: remaining
        };
    });

    if (focusedBuildingId === buildingId) {
      setFocusedBuildingId(remaining[0]?.id || null);
    }

    onSurveyChange(prev => ({
        ...prev,
        includedBuildingIds: prev.includedBuildingIds.filter(id => id !== buildingId)
    }));
  };

  const handleBuildingToggle = (buildingId: string) => {
      onSurveyChange(prev => {
          const isIncluded = prev.includedBuildingIds.includes(buildingId);
          const newIds = isIncluded
              ? prev.includedBuildingIds.filter(id => id !== buildingId)
              : [...prev.includedBuildingIds, buildingId];
          return { ...prev, includedBuildingIds: newIds };
      });
  };

  // 1. Initialize Interactive Satellite Google Map
  useEffect(() => {
    if (!isApiReady || !mapRef.current || map) return;

    const initialMapType = hasAnimatedRef.current ? 'satellite' : 'roadmap';
    const mapInstance = new window.google.maps.Map(mapRef.current, {
      center: { lat: place.latitude, lng: place.longitude },
      zoom: 20,
      mapTypeId: initialMapType,
      disableDefaultUI: true,
      zoomControl: true,
      tilt: 0,
    });

    setMap(mapInstance);

    if (!hasAnimatedRef.current) {
      const timer = setTimeout(() => {
        mapInstance.setMapTypeId('satellite');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isApiReady, place.latitude, place.longitude, map]);

  // 2. Set Map Cursor Style in Pin Dropping Mode
  useEffect(() => {
    if (!map) return;
    map.setOptions({
      draggableCursor: isAddingPin ? 'crosshair' : null,
      draggingCursor: isAddingPin ? 'crosshair' : null,
    });
  }, [map, isAddingPin]);

  // 3. Map Click Handler for Tagging Buildings
  useEffect(() => {
    if (!map) return;

    const clickListener = window.google.maps.event.addListener(map, 'click', (e: any) => {
      if (!isAddingPin) return;

      const lat = e.latLng.lat();
      const lng = e.latLng.lng();

      setBuildingData(prev => {
        if (!prev) return prev;
        const nextIndex = prev.buildings.length + 1;
        const newBuilding = generateBuildingFromLatLng(lat, lng, nextIndex);
        
        onSurveyChange(survey => {
          if (!survey.includedBuildingIds.includes(newBuilding.id)) {
            return {
              ...survey,
              includedBuildingIds: [...survey.includedBuildingIds, newBuilding.id]
            };
          }
          return survey;
        });

        return {
          ...prev,
          buildings: [...prev.buildings, newBuilding]
        };
      });

      setIsAddingPin(false);
    });

    return () => {
      window.google.maps.event.removeListener(clickListener);
    };
  }, [map, isAddingPin, setBuildingData, onSurveyChange]);

  // 4. Render Markers for All Buildings (Included/Excluded styled accordingly)
  useEffect(() => {
    if (!map || !buildingData) return;

    // Clear old markers
    markersRef.current.forEach(m => m.setMap(null));
    markersRef.current = [];

    // Redraw markers
    buildingData.buildings.forEach((building, idx) => {
      const isIncluded = surveyState.includedBuildingIds.includes(building.id);
      const isFocused = building.id === focusedBuildingId;
      
      // Compute center of polygon for marker position
      const center = getPolygonCenter(building.polygonVertices || [], building.lat ?? place.latitude, building.lng ?? place.longitude);

      const marker = new window.google.maps.Marker({
        position: center,
        map: map,
        label: {
          text: (idx + 1).toString(),
          color: '#ffffff',
          fontWeight: 'bold',
          fontSize: '14px'
        },
        icon: {
          path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z',
          fillColor: isFocused ? '#ec028b' : (isIncluded ? '#ec028b99' : '#4b5563'), // bright pink if focused, slightly translucent pink if included, gray if excluded
          fillOpacity: 1,
          strokeColor: isFocused ? '#ffffff' : '#cbd5e1',
          strokeWeight: isFocused ? 2.5 : 1.5,
          scale: isFocused ? 1.3 : 1.1,
          labelOrigin: new window.google.maps.Point(0, -30)
        },
        title: `BLDG ${idx + 1}`
      });

      marker.addListener('click', () => {
        setFocusedBuildingId(building.id);
      });

      markersRef.current.push(marker);
    });
  }, [map, buildingData, surveyState.includedBuildingIds, focusedBuildingId, place.latitude, place.longitude]);

  // 4.5 Manage Google Maps Polygons (Editable/Editable path changes)
  useEffect(() => {
    if (!map || !buildingData || !window.google) return;

    // Remove polygons for buildings that are no longer present
    const currentIds = new Set(buildingData.buildings.map(b => b.id));
    for (const [id, poly] of gPolygonsMapRef.current.entries()) {
      if (!currentIds.has(id)) {
        poly.setMap(null);
        gPolygonsMapRef.current.delete(id);
      }
    }

    // Draw/Update polygons
    buildingData.buildings.forEach((building) => {
      const isFocused = building.id === focusedBuildingId;
      
      let poly = gPolygonsMapRef.current.get(building.id);
      const vertices = building.polygonVertices || [];
      const pathCoords = vertices.map(v => new window.google.maps.LatLng(v.lat, v.lng));

      // Skip updating if this building is currently animating
      const isPrimary = building.id === buildingData.buildings[0]?.id;
      if (poly && isAnimatingRef.current && isPrimary) {
        return;
      }

      if (!poly) {
        // Set path change listener helper
        const registerPathListener = (polygonInstance: any) => {
          const path = polygonInstance.getPath();
          
          const onPathChange = () => {
            const newVertices: { lat: number; lng: number }[] = [];
            for (let i = 0; i < path.getLength(); i++) {
              const xy = path.getAt(i);
              newVertices.push({ lat: xy.lat(), lng: xy.lng() });
            }
            
            const newAreaMeters = window.google.maps.geometry.spherical.computeArea(path);
            
            setBuildingData(prev => {
              if (!prev) return prev;
              return {
                ...prev,
                buildings: prev.buildings.map(b => {
                  if (b.id === building.id) {
                    const avgPitchDeg = b.facets.reduce((sum, f) => sum + f.pitchDegrees, 0) / b.facets.length || 22.6;
                    const newFacets = b.facets.map(f => ({
                      ...f,
                      areaMeters: newAreaMeters / b.facets.length,
                      pitchDegrees: avgPitchDeg
                    }));
                    
                    return {
                      ...b,
                      totalAreaMeters: newAreaMeters,
                      polygonVertices: newVertices,
                      facets: newFacets
                    };
                  }
                  return b;
                })
              };
            });
          };

          path.addListener('set_at', onPathChange);
          path.addListener('insert_at', onPathChange);
          path.addListener('remove_at', onPathChange);
        };

        if (isPrimary && !hasAnimatedRef.current) {
          isAnimatingRef.current = true;
          const pinCenter = new window.google.maps.LatLng(place.latitude, place.longitude);
          const startCoords = vertices.map(() => pinCenter);
          
          poly = new window.google.maps.Polygon({
            paths: startCoords,
            strokeColor: '#ec028b',
            strokeOpacity: 0,
            strokeWeight: isFocused ? 3.5 : 2,
            fillColor: '#ec028b',
            fillOpacity: 0,
            editable: false,
            draggable: false,
            map: map,
          });

          gPolygonsMapRef.current.set(building.id, poly);

          const duration = 1200;
          const startTime = performance.now();

          const animateSnap = (time: number) => {
            const elapsed = time - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3); // easeOutCubic

            const currentCoords = vertices.map(v => {
              const lat = place.latitude + ease * (v.lat - place.latitude);
              const lng = place.longitude + ease * (v.lng - place.longitude);
              return new window.google.maps.LatLng(lat, lng);
            });

            poly.setPath(currentCoords);
            poly.setOptions({
              strokeOpacity: ease * (isFocused ? 0.9 : 0.5),
              fillOpacity: ease * (isFocused ? 0.25 : 0.08),
            });

            if (progress < 1) {
              requestAnimationFrame(animateSnap);
            } else {
              hasAnimatedRef.current = true;
              isAnimatingRef.current = false;
              poly.setPath(pathCoords);
              poly.setOptions({
                editable: isFocused && view === 'satellite',
              });
              registerPathListener(poly);
            }
          };

          requestAnimationFrame(animateSnap);
        } else {
          poly = new window.google.maps.Polygon({
            paths: pathCoords,
            strokeColor: '#ec028b',
            strokeOpacity: isFocused ? 0.9 : 0.5,
            strokeWeight: isFocused ? 3.5 : 2,
            fillColor: '#ec028b',
            fillOpacity: isFocused ? 0.25 : 0.08,
            editable: isFocused && view === 'satellite',
            draggable: false,
            map: map,
          });

          registerPathListener(poly);
          gPolygonsMapRef.current.set(building.id, poly);
        }
      } else {
        // Update styling and editable state
        poly.setOptions({
          strokeOpacity: isFocused ? 0.9 : 0.5,
          strokeWeight: isFocused ? 3.5 : 2,
          fillOpacity: isFocused ? 0.25 : 0.08,
          editable: isFocused && view === 'satellite',
        });

        // Verify if path coordinates match the state
        const polyPath = poly.getPath();
        let needsUpdate = polyPath.getLength() !== vertices.length;
        if (!needsUpdate) {
          for (let i = 0; i < vertices.length; i++) {
            const pt = polyPath.getAt(i);
            const v = vertices[i];
            if (Math.abs(pt.lat() - v.lat) > 0.000001 || Math.abs(pt.lng() - v.lng) > 0.000001) {
              needsUpdate = true;
              break;
            }
          }
        }

        if (needsUpdate) {
          // Temporarily disable listeners to avoid cycles
          window.google.maps.event.clearListeners(polyPath, 'set_at');
          window.google.maps.event.clearListeners(polyPath, 'insert_at');
          window.google.maps.event.clearListeners(polyPath, 'remove_at');

          poly.setPath(pathCoords);

          // Re-register listeners on new path
          const newPath = poly.getPath();
          const onPathChangeNew = () => {
            const newVertices: { lat: number; lng: number }[] = [];
            for (let i = 0; i < newPath.getLength(); i++) {
              const xy = newPath.getAt(i);
              newVertices.push({ lat: xy.lat(), lng: xy.lng() });
            }
            const newAreaMeters = window.google.maps.geometry.spherical.computeArea(newPath);
            setBuildingData(prev => {
              if (!prev) return prev;
              return {
                ...prev,
                buildings: prev.buildings.map(b => {
                  if (b.id === building.id) {
                    const avgPitchDeg = b.facets.reduce((sum, f) => sum + f.pitchDegrees, 0) / b.facets.length || 22.6;
                    const newFacets = b.facets.map(f => ({
                      ...f,
                      areaMeters: newAreaMeters / b.facets.length,
                      pitchDegrees: avgPitchDeg
                    }));
                    return {
                      ...b,
                      totalAreaMeters: newAreaMeters,
                      polygonVertices: newVertices,
                      facets: newFacets
                    };
                  }
                  return b;
                })
              };
            });
          };

          newPath.addListener('set_at', onPathChangeNew);
          newPath.addListener('insert_at', onPathChangeNew);
          newPath.addListener('remove_at', onPathChangeNew);
        }
      }
    });
  }, [map, buildingData, focusedBuildingId, view, setBuildingData]);

  // 5. Initialize Street View Panorama
  useEffect(() => {
    const initPanorama = () => {
      if (streetViewRef.current && window.google) {
        const propertyLocation = { lat: place.latitude, lng: place.longitude };
        const panorama = new window.google.maps.StreetViewPanorama(
          streetViewRef.current,
          {
            position: propertyLocation,
            pov: { heading: 0, pitch: 10 },
            zoom: 0,
            addressControl: false,
            linksControl: false,
            panControl: false,
            fullscreenControl: false,
            enableCloseButton: false,
            visible: view === 'street',
          }
        );

        window.google.maps.event.addListenerOnce(panorama, 'status_changed', () => {
          if (panorama.getStatus() === 'OK') {
            const panoLocation = panorama.getLocation().latLng;
            const heading = window.google.maps.geometry.spherical.computeHeading(
              panoLocation, 
              new window.google.maps.LatLng(propertyLocation)
            );
            panorama.setPov({ heading, pitch: 10 });
            setIsStreetViewAvailable(true);
          } else {
            console.error('Street View data not available for this location.');
            setIsStreetViewAvailable(false);
          }
        });

        panoramaRef.current = panorama;
      }
    };

    if (window.google?.maps?.geometry) {
        if (!panoramaRef.current) {
            initPanorama();
        } else if (panoramaRef.current) {
            panoramaRef.current.setVisible(view === 'street');
        }
    }
  }, [place.latitude, place.longitude, view]);


  return (
    <div className="relative h-screen w-screen flex flex-col justify-center items-center p-4 bg-black overflow-hidden animate-fade-in">
        <CircuitryBackground />
        
        <main className="relative z-10 w-full max-w-4xl">
            <div className="bg-black/70 backdrop-blur-md rounded-xl border border-gray-800 shadow-2xl shadow-pink-500/10 overflow-hidden">
                {/* Image/Map Part */}
                <div className="relative w-full aspect-[16/10] bg-gray-950">
                    {/* Interactive Google Map for Satellite View */}
                    <div 
                        ref={mapRef} 
                        className="absolute inset-0 w-full h-full"
                        style={{ display: view === 'satellite' ? 'block' : 'none' }}
                    />
                    
                    {/* Fallback image if map is loading or not ready */}
                    {(!isApiReady || !map) && view === 'satellite' && (
                        <img src={satelliteViewUrl} alt="Satellite view of property" className="absolute inset-0 w-full h-full object-cover animate-pulse" />
                    )}

                    {/* Street View or Fallback street view image */}
                    {view === 'street' && !isStreetViewAvailable && (
                        <img src={streetViewUrl} alt="Street view of property" className="absolute inset-0 w-full h-full object-cover" />
                    )}
                    <div 
                        ref={streetViewRef} 
                        className="absolute inset-0"
                        style={{ visibility: view === 'street' && isStreetViewAvailable ? 'visible' : 'hidden' }}
                    />

                    {/* Floating Add Pin Banner */}
                    {isAddingPin && (
                        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20 bg-black/90 border border-pink-500 text-white px-4 py-2 rounded-md shadow-lg flex items-center space-x-3 backdrop-blur-md">
                            <span className="text-sm font-semibold text-pink-400 font-sans">
                                Click on the satellite map to place BLDG {buildingData ? buildingData.buildings.length + 1 : 2}
                            </span>
                            <button
                                type="button"
                                onClick={() => setIsAddingPin(false)}
                                className="px-2 py-1 bg-gray-800 hover:bg-gray-700 rounded text-xs text-white font-semibold transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                    
                    {/* Vignette Effect */}
                    <div className="absolute inset-0 pointer-events-none z-10" style={{ boxShadow: 'inset 0px 0px 100px 20px rgba(0,0,0,0.7)' }} />
                </div>
            
                {/* Controls Part */}
                <div className="p-4 sm:p-5 space-y-4">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div>
                            <p className="text-base text-gray-400">Selected Address</p>
                            <h2 className="text-xl font-semibold text-white">{place.address}</h2>
                        </div>
                    </div>

                    {/* Tagged Buildings Section */}
                    <div className="border-t border-gray-800/80 pt-4">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-lg font-medium text-gray-300">Buildings on Property</h3>
                            <button
                                onClick={() => {
                                    setView('satellite');
                                    setIsAddingPin(true);
                                }}
                                className="inline-flex items-center text-sm font-semibold text-pink-400 hover:text-pink-300 transition-colors gap-1 px-3 py-1.5 rounded bg-pink-500/10 border border-pink-500/20 hover:bg-pink-500/20"
                            >
                                <PlusIcon className="h-4 w-4" />
                                <span>Tag Another Building</span>
                            </button>
                        </div>

                        {/* List of buildings */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {buildingData?.buildings.map((building, idx) => {
                                const isIncluded = surveyState.includedBuildingIds.includes(building.id);
                                const sqValue = (building.totalAreaMeters * 10.7639 / 100).toFixed(2);
                                const isCustom = building.id.startsWith('BLD_') && building.id !== 'BLD_1';
                                const isFocused = building.id === focusedBuildingId;
                                
                                return (
                                    <div
                                        key={building.id}
                                        onClick={() => setFocusedBuildingId(building.id)}
                                        className={cn(
                                            "relative flex flex-col justify-between p-4 rounded-xl bg-black/50 border transition-all select-none cursor-pointer",
                                            isFocused
                                                ? "border-pink-500 bg-pink-500/5 shadow-[0_0_15px_rgba(236,2,139,0.25)]"
                                                : "border-gray-800 hover:border-gray-700 hover:bg-gray-900/30"
                                        )}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex flex-col min-w-0">
                                                <span className="text-base font-bold text-white truncate flex items-center">
                                                    BLDG {idx + 1}
                                                    {idx === 0 && <span className="text-[10px] text-pink-400 font-normal ml-2 bg-pink-400/10 px-1.5 py-0.5 rounded border border-pink-400/20">Primary</span>}
                                                </span>
                                                <span className="text-sm font-semibold text-pink-400/90 font-mono mt-1">{sqValue} SQ</span>
                                            </div>
                                            <div className="flex items-center space-x-2" onClick={e => e.stopPropagation()}>
                                                <Switch 
                                                    checked={isIncluded} 
                                                    onCheckedChange={() => handleBuildingToggle(building.id)} 
                                                />
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-900 text-xs">
                                            <span className={cn(
                                                "font-semibold uppercase tracking-wider",
                                                isFocused ? "text-pink-400 animate-pulse" : "text-gray-500"
                                            )}>
                                                {isFocused ? "Editing Outline" : "Click to Edit Outline"}
                                            </span>
                                            {isCustom && (
                                                <button
                                                    onClick={(e) => handleDeleteBuilding(building.id, e)}
                                                    className="p-1 rounded text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                                                    aria-label="Delete building"
                                                >
                                                    <TrashIcon className="h-4 w-4" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t border-gray-800/80 pt-4">
                        {/* Left Buttons: View Toggles */}
                        <div className="flex items-center space-x-2">
                             <button
                                onClick={() => setView('street')}
                                className={cn(
                                    'inline-flex items-center justify-center whitespace-nowrap rounded-md text-base font-medium transition-colors h-10 px-4 py-2 gap-2',
                                    view === 'street'
                                        ? 'bg-[#ec028b] text-white'
                                        : 'bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700'
                                )}
                            >
                                <CameraIcon className="h-5 w-5" />
                                <span>Street</span>
                            </button>
                            <button
                                onClick={() => setView('satellite')}
                                className={cn(
                                    'inline-flex items-center justify-center whitespace-nowrap rounded-md text-base font-medium transition-colors h-10 px-4 py-2 gap-2',
                                    view === 'satellite'
                                        ? 'bg-[#ec028b] text-white'
                                        : 'bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700'
                                )}
                            >
                                <SatelliteIcon className="h-5 w-5" />
                                <span>Satellite</span>
                            </button>
                        </div>
                        
                        {/* Right Buttons: Actions */}
                        <div className="flex items-center space-x-2">
                            <Button onClick={onStartOver} className="bg-black border border-gray-600 hover:bg-gray-800 text-gray-300 hover:text-white flex items-center space-x-2">
                                <XIcon className="h-4 w-4" />
                                <span>Start Over</span>
                            </Button>
                            <Button onClick={onConfirm} className="flex items-center space-x-2">
                                <Check className="h-5 w-5" />
                                <span>Confirm Address</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
  );
};