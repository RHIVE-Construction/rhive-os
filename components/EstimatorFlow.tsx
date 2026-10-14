import React, { useState, useCallback, useEffect } from 'react';
import type { Place, BuildingData, SurveyState } from '../types';
import { AddressInput } from './AddressInput';
import { AddressConfirmation } from './AddressConfirmation';
import { RoofOptions } from './RoofOptions';
import { Gutters } from './Gutters';
import { HeatTrace } from './HeatTrace';
import { Dashboard } from './Dashboard';
import { CircuitryBackground } from './CircuitryBackground';
import { getRoofData } from '../services/solarService';
import { INITIAL_SURVEY_STATE } from '../lib/constants';
import { ArrowLeft, Search, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';

type AppState = 'addressInput' | 'addressConfirmation' | 'roofOptions' | 'gutters' | 'heatTrace' | 'dashboard';

interface EstimatorFlowProps {
  onClose: () => void;
  initialPlace?: Place;
}

export const EstimatorFlow: React.FC<EstimatorFlowProps> = ({ onClose, initialPlace }) => {
  const [appState, setAppState] = useState<AppState>(initialPlace ? 'addressConfirmation' : 'addressInput');
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(initialPlace || null);
  const [buildingData, setBuildingData] = useState<BuildingData | null>(null);
  const [surveyState, setSurveyState] = useState<SurveyState>(INITIAL_SURVEY_STATE);
  const [streetViewUrl, setStreetViewUrl] = useState<string>('');
  const [satelliteViewUrl, setSatelliteViewUrl] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasNoCoverage, setHasNoCoverage] = useState(false);

  const handlePlaceSelected = useCallback(async (place: Place) => {
    setError(null);
    setHasNoCoverage(false);
    setIsLoading(true);

    try {
      console.log("[IET Engine] Analyzing building structure for:", place.address);
      const solarData = await getRoofData(place.latitude, place.longitude);

      const facets = solarData.solarPotential.roofSegmentStats.map((seg, i) => ({
        id: `f${i}`,
        areaMeters: seg.stats.areaMeters || (seg.stats as any).areaMeters2 || 0,
        pitchDegrees: seg.pitchDegrees,
      }));

      const bData: BuildingData = {
        buildings: [
          {
            id: 'main_house',
            totalAreaMeters: solarData.solarPotential.wholeRoofStats.areaMeters || (solarData.solarPotential.wholeRoofStats as any).areaMeters2 || 0,
            facets: facets,
          },
        ],
        yearConstructed: 1995,
      };

      setBuildingData(bData);
      setSelectedPlace(place);

      const apiKey = 'AIzaSyAyDim_1uOJy6rS_GZ-EwNKmJyCrvSvqRA';
      const metadataUrl = `https://maps.googleapis.com/maps/api/streetview/metadata?location=${place.latitude},${place.longitude}&key=${apiKey}`;
      const satUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${place.latitude},${place.longitude}&zoom=20&size=640x480&maptype=satellite&key=${apiKey}`;
      setSatelliteViewUrl(satUrl);

      try {
        const metaRes = await fetch(metadataUrl);
        const meta = await metaRes.json();
        if (meta.status === 'OK') {
          setStreetViewUrl(`https://maps.googleapis.com/maps/api/streetview?size=640x480&location=${place.latitude},${place.longitude}&heading=120&fov=90&pitch=10&key=${apiKey}`);
        } else {
          setStreetViewUrl('https://picsum.photos/seed/roof/640/480');
        }
      } catch {
        setStreetViewUrl('https://picsum.photos/seed/roof/640/480');
      }

      setAppState('addressConfirmation');
      setIsLoading(false);
    } catch (e: any) {
      console.error("[IET Engine] Solar API error:", e);
      setHasNoCoverage(true);
      setIsLoading(false);
    }
  }, []);

  // Auto-trigger if initialPlace provided on mount
  useEffect(() => {
    if (initialPlace && !buildingData && !isLoading) {
      handlePlaceSelected(initialPlace);
    }
  }, [initialPlace, buildingData, isLoading, handlePlaceSelected]);

  const handleStartNew = () => {
    setHasNoCoverage(false);
    setError(null);
    setBuildingData(null);
    setSelectedPlace(null);
    setAppState('addressInput');
  };

  const handleConfirmAddress = () => {
    setAppState('roofOptions');
  };

  const handleRoofOptionsContinue = () => {
    setAppState('gutters');
  };

  const handleGuttersContinue = () => {
    setAppState('heatTrace');
  };

  const handleHeatTraceContinue = () => {
    setAppState('dashboard');
  };

  if (isLoading) {
    return (
      <div className="relative min-h-screen w-full flex flex-col justify-center items-center p-6 bg-slate-950 text-center">
        <CircuitryBackground />
        <div className="relative z-10 p-8 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-md max-w-sm w-full">
          <Loader2 className="w-12 h-12 text-pink-500 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white tracking-wide">Analyzing Property Structure</h2>
          <p className="text-xs text-slate-400 mt-2">Querying Google Solar intelligence & roof facets...</p>
        </div>
      </div>
    );
  }

  if (hasNoCoverage) {
    return (
      <div className="relative min-h-screen w-full flex flex-col justify-center items-center p-6 bg-slate-950 text-center">
        <CircuitryBackground />
        <div className="relative z-10 max-w-md w-full bg-slate-900/90 border border-slate-800 p-8 rounded-2xl shadow-2xl backdrop-blur-md">
          <div className="w-14 h-14 bg-pink-500/10 border border-pink-500/30 text-pink-400 flex items-center justify-center rounded-full mx-auto mb-4 text-2xl font-bold">
            !
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-wide mb-2">Aerial Data Unavailable</h2>
          <p className="text-xs text-slate-400 mb-6 leading-relaxed">
            High-resolution satellite LiDAR is not currently indexed for this specific address. Please submit for manual CAD takeoff.
          </p>
          <button
            onClick={() => {
              alert("Address flagged for manual aerial CAD inspection. Representative notified.");
              handleStartNew();
            }}
            className="w-full bg-pink-600 hover:bg-pink-500 text-white font-bold py-2.5 px-4 rounded-lg text-xs shadow-lg shadow-pink-600/30 transition cursor-pointer"
          >
            Request Certified Manual Takeoff
          </button>
          <button
            onClick={handleStartNew}
            className="w-full mt-3 text-xs text-slate-400 hover:text-white transition cursor-pointer"
          >
            Search Another Address
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-slate-950 text-white relative flex flex-col font-sans">
      <CircuitryBackground />

      {/* Top Bar */}
      <header className="relative z-20 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md px-6 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-slate-400 hover:text-pink-400 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Exit IET
          </button>
          <div className="h-4 w-px bg-slate-800"></div>
          <div>
            <span className="text-xs font-bold text-white tracking-tight flex items-center gap-2">
              <span>RHIVE Instant Estimate Tool (IET)</span>
              <span className="px-2 py-0.5 text-[9px] font-mono bg-pink-500/20 text-pink-400 border border-pink-500/40 rounded">
                TOOLS & SUPPORT
              </span>
            </span>
          </div>
        </div>

        {selectedPlace && (
          <div className="text-xs font-mono text-slate-400 truncate max-w-md hidden md:block">
            📍 {selectedPlace.address}
          </div>
        )}
      </header>

      {/* App State Content */}
      <div className="relative z-10 flex-1 flex flex-col">
        {appState === 'addressInput' && (
          <div className="flex-1 flex flex-col justify-center items-center p-6">
            <div className="max-w-xl w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-8 shadow-2xl backdrop-blur-md">
              <div className="w-12 h-12 rounded-xl bg-pink-600/20 border border-pink-500/40 flex items-center justify-center text-pink-400 mb-4">
                <Search className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-extrabold text-white tracking-tight">Instant Property Intake</h2>
              <p className="text-xs text-slate-400 mt-1 mb-6">
                Enter any Wasatch Front residential or commercial address to pull live Google Solar 3D roof geometry, pitch angles, and ballpark pricing.
              </p>

              <div className="w-full">
                <AddressInput
                  onPlaceSelected={handlePlaceSelected}
                  placeholder="Enter property street address (e.g. 10646 S 1055 W, South Jordan, UT)"
                  inputClassName="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:border-pink-500 shadow-inner"
                />
              </div>
            </div>
          </div>
        )}

        {appState === 'addressConfirmation' && selectedPlace && (
          <div className="flex-1 overflow-y-auto">
            <AddressConfirmation
              place={selectedPlace}
              onConfirm={handleConfirmAddress}
              onStartOver={handleStartNew}
              streetViewUrl={streetViewUrl}
              satelliteViewUrl={satelliteViewUrl}
              buildingData={buildingData}
              setBuildingData={setBuildingData}
              surveyState={surveyState}
              onSurveyChange={setSurveyState}
            />
          </div>
        )}

        {appState === 'roofOptions' && buildingData && (
          <div className="flex-1 overflow-y-auto">
            <RoofOptions
              buildingData={buildingData}
              setBuildingData={setBuildingData}
              surveyState={surveyState}
              onSurveyChange={setSurveyState}
              onContinue={handleRoofOptionsContinue}
              onStartOver={handleStartNew}
              onBack={() => setAppState('addressConfirmation')}
            />
          </div>
        )}

        {appState === 'gutters' && (
          <div className="flex-1 overflow-y-auto">
            <Gutters
              surveyState={surveyState}
              onSurveyChange={setSurveyState}
              onContinue={handleGuttersContinue}
              onStartOver={handleStartNew}
              onStartMeasurement={() => {}}
            />
          </div>
        )}

        {appState === 'heatTrace' && (
          <div className="flex-1 overflow-y-auto">
            <HeatTrace
              surveyState={surveyState}
              onSurveyChange={setSurveyState}
              onContinue={handleHeatTraceContinue}
              onStartOver={handleStartNew}
              onStartMeasurement={() => {}}
            />
          </div>
        )}

        {appState === 'dashboard' && buildingData && selectedPlace && (
          <div className="flex-1 overflow-y-auto">
            <Dashboard
              place={selectedPlace}
              buildingData={buildingData}
              surveyState={surveyState}
              onSurveyChange={setSurveyState}
              onStartNew={handleStartNew}
              streetViewUrl={streetViewUrl}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default EstimatorFlow;
