import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useGoogleMapsApi } from '../hooks/useGoogleMapsApi';
import { METERS_TO_FEET } from '../lib/constants';
import { Button } from './ui/button';
import { RulerIcon, HandIcon } from './icons';
import { cn } from '../lib/utils';

interface MapMeasurementToolProps {
  center: { lat: number; lng: number };
  onLengthChange: (length: number) => void;
  onClose: () => void;
  initialPaths?: { lat: number; lng: number }[][];
  onPathsChange?: (paths: { lat: number; lng: number }[][]) => void;
}

declare global {
  interface Window {
    google: any;
  }
}

const ControlButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode; title: string }> = ({ active, onClick, children, title }) => (
    <button title={title} onClick={onClick} className={cn(
        "p-2 rounded-md transition-colors",
        active ? 'bg-[#ec028b] text-white' : 'text-gray-300 hover:bg-gray-700'
    )}>
        {children}
    </button>
);

export const MapMeasurementTool: React.FC<MapMeasurementToolProps> = ({ center, onLengthChange, onClose, initialPaths, onPathsChange }) => {
  const isApiReady = useGoogleMapsApi();
  const mapRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const polylinesRef = useRef<any[]>([]);
  const activePolylineRef = useRef<any>(null);
  const finishActiveLineRef = useRef<() => void>(() => {});
  
  const [map, setMap] = useState<any>(null);
  const [drawingMode, setDrawingMode] = useState<'polyline' | null>('polyline');
  const [activePath, setActivePath] = useState<{ lat: number; lng: number }[]>([]);
  const [tempPoint, setTempPoint] = useState<{ lat: number; lng: number } | null>(null);
  const [liveSegmentLength, setLiveSegmentLength] = useState<number>(0);
  const [completedLength, setCompletedLength] = useState<number>(0);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);

  // Keep refs in sync for event listener closures
  const activePathRef = useRef(activePath);
  activePathRef.current = activePath;
  const tempPointRef = useRef(tempPoint);
  tempPointRef.current = tempPoint;
  const drawingModeRef = useRef(drawingMode);
  drawingModeRef.current = drawingMode;

  const recalculateTotalLength = useCallback(() => {
    if (!window.google || !polylinesRef.current) return;
    let lengthInMeters = 0;
    polylinesRef.current.forEach(polyline => {
      lengthInMeters += window.google.maps.geometry.spherical.computeLength(polyline.getPath());
    });
    const lengthInFeet = lengthInMeters * METERS_TO_FEET;
    console.log("recalculateTotalLength. polylines:", polylinesRef.current.length, "calculated length in feet:", lengthInFeet);
    setCompletedLength(lengthInFeet);
  }, []);

  const totalLength = completedLength + liveSegmentLength;

  const handleDone = () => {
    let finalCompletedLength = completedLength;
    if (activePath.length > 1 && window.google) {
      const lengthInMeters = window.google.maps.geometry.spherical.computeLength(activePath);
      finalCompletedLength += lengthInMeters * METERS_TO_FEET;
    }
    const finalVal = parseFloat((finalCompletedLength || totalLength).toFixed(1));
    onLengthChange(finalVal);

    console.log("MapMeasurementTool handleDone. polylines:", polylinesRef.current.length, "activePath:", activePath.length);
    if (onPathsChange && window.google) {
      const paths = polylinesRef.current.map(p => {
        const path = p.getPath();
        const coords: { lat: number; lng: number }[] = [];
        for (let i = 0; i < path.getLength(); i++) {
          const xy = path.getAt(i);
          coords.push({ lat: xy.lat(), lng: xy.lng() });
        }
        return coords;
      });
      if (activePath.length > 1) {
        paths.push(activePath);
      }
      onPathsChange(paths);
    }

    onClose();
  };

  const clearDrawing = useCallback(() => {
    polylinesRef.current.forEach(polyline => polyline.setMap(null));
    polylinesRef.current = [];
    if (activePolylineRef.current) {
      activePolylineRef.current.setPath([]);
    }
    setActivePath([]);
    setTempPoint(null);
    setLiveSegmentLength(0);
    setCompletedLength(0);
  }, []);

  // Update active polyline rendering
  useEffect(() => {
    if (!activePolylineRef.current || !window.google) return;
    const pathCoords = [...activePath];
    if (tempPoint) {
      pathCoords.push(tempPoint);
    }
    activePolylineRef.current.setPath(pathCoords);

    if (pathCoords.length > 1) {
      const lengthInMeters = window.google.maps.geometry.spherical.computeLength(pathCoords);
      setLiveSegmentLength(lengthInMeters * METERS_TO_FEET);
    } else {
      setLiveSegmentLength(0);
    }
  }, [activePath, tempPoint]);

  // Set draw vs pan options
  useEffect(() => {
    if (!map) return;
    const isDrawing = drawingMode === 'polyline';
    map.setOptions({
      draggable: !isDrawing,
      draggableCursor: isDrawing ? 'crosshair' : 'grab',
      draggingCursor: isDrawing ? 'crosshair' : 'grabbing',
    });
    if (!isDrawing) {
      finishActiveLineRef.current();
    }
  }, [drawingMode, map]);

  // Map Initialization
  useEffect(() => {
    if (!isApiReady || !mapRef.current || map) return;

    const mapInstance = new window.google.maps.Map(mapRef.current, {
      center: center,
      zoom: 21,
      mapTypeId: 'satellite',
      disableDefaultUI: true,
      zoomControl: true,
      tilt: 0,
      disableDoubleClickZoom: true, // Prevent zoom on double-click
      clickableIcons: false, // Prevent POIs from intercepting clicks
    });
    setMap(mapInstance);

    activePolylineRef.current = new window.google.maps.Polyline({
      strokeColor: '#ec028b',
      strokeWeight: 4,
      map: mapInstance,
      clickable: false, // Prevent active line from intercepting clicks
    });

    console.log("MapMeasurementTool mount. initialPaths:", initialPaths);
    polylinesRef.current.forEach(polyline => polyline.setMap(null));
    polylinesRef.current = [];

    if (initialPaths && initialPaths.length > 0) {
      initialPaths.forEach((path, idx) => {
        console.log(`Render initialPath ${idx}:`, JSON.stringify(path));
        const completedPolyline = new window.google.maps.Polyline({
          strokeColor: '#ec028b',
          strokeWeight: 4,
          map: mapInstance,
          editable: true,
          clickable: false,
          path: path,
        });

        completedPolyline.getPath().addListener('set_at', recalculateTotalLength);
        completedPolyline.getPath().addListener('insert_at', recalculateTotalLength);
        completedPolyline.getPath().addListener('remove_at', recalculateTotalLength);

        polylinesRef.current.push(completedPolyline);
      });
      recalculateTotalLength();
    }

    const finishActiveLineLoc = () => {
      if (activePathRef.current.length > 1) {
        const completedPolyline = new window.google.maps.Polyline({
          strokeColor: '#ec028b',
          strokeWeight: 4,
          map: mapInstance,
          editable: true,
          clickable: false, // Prevent completed lines from intercepting clicks
          path: activePathRef.current,
        });

        completedPolyline.getPath().addListener('set_at', recalculateTotalLength);
        completedPolyline.getPath().addListener('insert_at', recalculateTotalLength);
        completedPolyline.getPath().addListener('remove_at', recalculateTotalLength);

        polylinesRef.current.push(completedPolyline);
      }
      setActivePath([]);
      setTempPoint(null);
      setLiveSegmentLength(0);
      recalculateTotalLength();
    };

    finishActiveLineRef.current = finishActiveLineLoc;

    const clickListener = mapInstance.addListener('click', (e: any) => {
      if (drawingModeRef.current !== 'polyline') return;
      const latLng = { lat: e.latLng.lat(), lng: e.latLng.lng() };
      setActivePath(prev => [...prev, latLng]);
    });

    const mousemoveListener = mapInstance.addListener('mousemove', (e: any) => {
      if (drawingModeRef.current !== 'polyline') return;
      const latLng = { lat: e.latLng.lat(), lng: e.latLng.lng() };
      setTempPoint(latLng);
    });

    const dblclickListener = mapInstance.addListener('dblclick', (e: any) => {
      if (drawingModeRef.current !== 'polyline') return;
      e.stop();
      finishActiveLineLoc();
    });

    return () => {
      window.google.maps.event.removeListener(clickListener);
      window.google.maps.event.removeListener(mousemoveListener);
      window.google.maps.event.removeListener(dblclickListener);
      if (activePolylineRef.current) {
        activePolylineRef.current.setMap(null);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isApiReady, center]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (drawingModeRef.current !== 'polyline') return;
      
      if (e.key === 'Enter') {
        e.preventDefault();
        finishActiveLineRef.current();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setActivePath([]);
        setTempPoint(null);
        setLiveSegmentLength(0);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleContainerMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (drawingMode !== 'polyline') return;
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleContainerMouseLeave = () => {
    setMousePos(null);
  };

  if (!isApiReady) {
    return <div className="h-96 w-full flex items-center justify-center bg-gray-800 text-gray-400 rounded-lg">Loading Map...</div>;
  }

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleContainerMouseMove}
      onMouseLeave={handleContainerMouseLeave}
      className="relative h-full w-full select-none"
    >
      <div ref={mapRef} className="h-full w-full" />
      
      {/* Dynamic Cursor Tooltip */}
      {mousePos && drawingMode === 'polyline' && (
        <div 
          className="absolute pointer-events-none bg-black/80 border border-pink-500 text-white px-2 py-1.5 text-[11px] font-sans font-black uppercase tracking-wider rounded-sm z-50 shadow-[0_0_12px_rgba(236,2,139,0.55)] flex flex-col gap-0.5"
          style={{ 
            left: mousePos.x + 16, 
            top: mousePos.y + 16,
            transform: 'translateY(-50%)'
          }}
        >
          {activePath.length === 0 ? (
            <span>Click to start drawing gutters</span>
          ) : (
            <>
              <span className="text-pink-400 font-bold">Line: {liveSegmentLength.toFixed(1)} ft</span>
              <span className="text-[9px] text-gray-400">Click: Add point</span>
              <span className="text-[9px] text-gray-400">Double-click: Finish line</span>
            </>
          )}
        </div>
      )}

      <div className="absolute top-0 left-0 right-0 p-3 bg-gradient-to-b from-black/70 to-transparent">
        <div className="flex justify-between items-center bg-black/50 p-2 rounded-lg backdrop-blur-sm">
            <div>
                <p className="text-base text-gray-300">Total Measured Length</p>
                <p className="text-xl font-bold text-pink-400">{totalLength.toFixed(1)} ft</p>
            </div>
            <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" onClick={clearDrawing}>Clear</Button>
                <Button size="sm" onClick={handleDone}>Done</Button>
            </div>
        </div>
      </div>
      
      <div className="absolute top-20 left-1/2 -translate-x-1/2 p-1.5 bg-black/50 backdrop-blur-sm rounded-lg flex items-center space-x-1 border border-gray-700 shadow-lg">
          <ControlButton active={drawingMode === null} onClick={() => setDrawingMode(null)} title="Pan Map">
              <HandIcon className="h-5 w-5" />
          </ControlButton>
          <ControlButton active={drawingMode === 'polyline'} onClick={() => setDrawingMode('polyline')} title="Draw Line">
              <RulerIcon className="h-5 w-5" />
          </ControlButton>
      </div>
      
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-center">
          <p className="text-white text-base bg-black/50 px-3 py-1 rounded-full">
            {drawingMode === 'polyline' ? 'Click on map to draw. Double-click to finish line.' : 'Click and drag to pan the map.'}
          </p>
      </div>
    </div>
  );
};