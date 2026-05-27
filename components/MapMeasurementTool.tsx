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

export const MapMeasurementTool: React.FC<MapMeasurementToolProps> = ({ center, onLengthChange, onClose }) => {
  const isApiReady = useGoogleMapsApi();
  const mapRef = useRef<HTMLDivElement>(null);
  const polylinesRef = useRef<any[]>([]);
  const [map, setMap] = useState<any>(null);
  const [drawingManager, setDrawingManager] = useState<any>(null);
  const [totalLength, setTotalLength] = useState<number>(0);
  const [drawingMode, setDrawingMode] = useState<string | null>('polyline');

  const calculateTotalLength = useCallback(() => {
    if (!window.google || !polylinesRef.current) return;
    let lengthInMeters = 0;
    polylinesRef.current.forEach(polyline => {
      lengthInMeters += window.google.maps.geometry.spherical.computeLength(polyline.getPath());
    });
    const lengthInFeet = lengthInMeters * METERS_TO_FEET;
    setTotalLength(lengthInFeet);
  }, []);

  const handleDone = () => {
    onLengthChange(Math.round(totalLength));
    onClose();
  };

  const clearDrawing = useCallback(() => {
    polylinesRef.current.forEach(polyline => polyline.setMap(null));
    polylinesRef.current = [];
    calculateTotalLength();
  }, [calculateTotalLength]);

  const setMode = useCallback((mode: 'polyline' | null) => {
    if (drawingManager && map) {
        const googleMode = mode === 'polyline' ? window.google.maps.drawing.OverlayType.POLYLINE : null;
        drawingManager.setDrawingMode(googleMode);
        
        // Disable map dragging when drawing to prevent conflict
        const isDrawing = mode === 'polyline';
        map.setOptions({ 
            draggable: !isDrawing,
            draggableCursor: isDrawing ? 'crosshair' : 'grab',
            draggingCursor: isDrawing ? 'crosshair' : 'grabbing',
        });
        setDrawingMode(isDrawing ? 'polyline' : null);
    }
  }, [drawingManager, map]);


  useEffect(() => {
    if (!isApiReady || !mapRef.current || map) return;

    const mapInstance = new window.google.maps.Map(mapRef.current, {
      center: center,
      zoom: 21,
      mapTypeId: 'satellite',
      disableDefaultUI: true,
      zoomControl: true,
      tilt: 0,
    });
    setMap(mapInstance);

    const dm = new window.google.maps.drawing.DrawingManager({
      drawingMode: null, // Start with pan mode
      drawingControl: false,
      polylineOptions: {
        strokeColor: '#ec028b',
        strokeWeight: 4,
        editable: true,
        zIndex: 1,
      },
    });
    
    dm.setMap(mapInstance);
    setDrawingManager(dm);

    return () => {
      if (dm) {
        dm.setMap(null);
      }
      clearDrawing();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isApiReady, center]);

  // Set initial drawing mode once the drawing manager is ready
  useEffect(() => {
    if (drawingManager) {
      setMode('polyline');
    }
  }, [drawingManager, setMode]);

  useEffect(() => {
    if (!drawingManager) return;

    const polylineCompleteListener = window.google.maps.event.addListener(
      drawingManager,
      'polylinecomplete',
      (polyline: any) => {
        polylinesRef.current.push(polyline);
        
        const path = polyline.getPath();
        path.addListener('set_at', calculateTotalLength);
        path.addListener('insert_at', calculateTotalLength);
        path.addListener('remove_at', calculateTotalLength);
        
        calculateTotalLength();
        
        // After finishing a line, you might want to switch back to pan mode.
        // For now, we keep it in draw mode to allow multiple lines.
        // setMode(null);
      }
    );

    return () => {
      window.google.maps.event.removeListener(polylineCompleteListener);
    };
  }, [drawingManager, calculateTotalLength, setMode]);

  if (!isApiReady) {
    return <div className="h-96 w-full flex items-center justify-center bg-gray-800 text-gray-400 rounded-lg">Loading Map...</div>;
  }

  return (
    <div className="relative h-full w-full">
      <div ref={mapRef} className="h-full w-full" />
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
          <ControlButton active={drawingMode === null} onClick={() => setMode(null)} title="Pan Map">
              <HandIcon className="h-5 w-5" />
          </ControlButton>
          <ControlButton active={drawingMode === 'polyline'} onClick={() => setMode('polyline')} title="Draw Line">
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