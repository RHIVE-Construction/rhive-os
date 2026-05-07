import React, { useState, useCallback } from 'react';
import type { Place, BuildingData, SurveyState } from '../types';
import { getMapsApiKey } from '../lib/mapsConfig';
import { LandingPage } from './LandingPage';
import { Dashboard } from './Dashboard';
import { generateMockBuildingData } from '../lib/mockData';
import { INITIAL_SURVEY_STATE } from '../lib/constants';
import { AddressConfirmation } from './AddressConfirmation';
import { RoofOptions } from './RoofOptions';
import { Gutters } from './Gutters';
import { HeatTrace } from './HeatTrace';
import { MeasurementPage } from './MeasurementPage';

type AppState = 'landing' | 'addressConfirmation' | 'roofOptions' | 'gutters' | 'heatTrace' | 'dashboard' | 'gutterMeasurement' | 'heatTraceMeasurement';

interface EstimatorFlowProps {
  onClose: () => void;
}

export const EstimatorFlow: React.FC<EstimatorFlowProps> = ({ onClose }) => {
  const [appState, setAppState] = useState<AppState>('landing');
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [buildingData, setBuildingData] = useState<BuildingData | null>(null);
  const [surveyState, setSurveyState] = useState<SurveyState>(INITIAL_SURVEY_STATE);
  const [streetViewUrl, setStreetViewUrl] = useState<string>('');
  const [satelliteViewUrl, setSatelliteViewUrl] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handlePlaceSelected = useCallback(async (place: Place) => {
    setError(null);
    try {
      const data = generateMockBuildingData(place);
      setBuildingData(data);
      setSelectedPlace(place);
      
      const allBuildingIds = data.buildings.map(b => b.id);
      setSurveyState(prev => ({
        ...INITIAL_SURVEY_STATE,
        latitude: place.latitude, 
        longitude: place.longitude,
        includedBuildingIds: allBuildingIds,
      }));

      // Fetch key from backend — never exposed in HTML or bundle
      const apiKey = await getMapsApiKey();
      
      const satUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${place.latitude},${place.longitude}&zoom=20&size=640x480&maptype=satellite&markers=color:0xec028b%7C${place.latitude},${place.longitude}&key=${apiKey}`;
      setSatelliteViewUrl(satUrl);

      const metadataUrl = `https://maps.googleapis.com/maps/api/streetview/metadata?location=${place.latitude},${place.longitude}&key=${apiKey}`;
      
      fetch(metadataUrl)
        .then(res => res.json())
        .then(meta => {
          if (meta.status === 'OK') {
            setStreetViewUrl(`https://maps.googleapis.com/maps/api/streetview?size=640x480&location=${place.latitude},${place.longitude}&heading=120&fov=90&pitch=10&key=${apiKey}`);
          } else {
            setStreetViewUrl('https://picsum.photos/seed/roof/640/480');
          }
          setAppState('addressConfirmation');
        })
        .catch(() => {
           setStreetViewUrl('https://picsum.photos/seed/roof/640/480');
           setAppState('addressConfirmation');
        });

    } catch (e: any) {
      console.error(e);
      setError(e.message || "An unexpected error occurred.");
    }
  }, []);

  const handleStartNew = () => {
    onClose();
  };

  const handleConfirmAddress = () => {
    setAppState('roofOptions');
  };

  const handleRoofOptionsContinue = () => {
    setAppState('gutters');
  }

  const handleGuttersContinue = () => {
    setAppState('heatTrace');
  };

  const handleHeatTraceContinue = () => {
    setAppState('dashboard');
  };

  const handleStartGutterMeasurement = () => setAppState('gutterMeasurement');
  const handleGutterMeasurementDone = () => setAppState('gutters');
  const handleStartHeatTraceMeasurement = () => setAppState('heatTraceMeasurement');
  const handleHeatTraceMeasurementDone = () => setAppState('heatTrace');

  const renderContent = () => {
    switch (appState) {
      case 'addressConfirmation':
        if (selectedPlace) {
            return (
                <AddressConfirmation
                    place={selectedPlace}
                    onConfirm={handleConfirmAddress}
                    onStartOver={handleStartNew}
                    streetViewUrl={streetViewUrl}
                    satelliteViewUrl={satelliteViewUrl}
                />
            )
        }
        handleStartNew();
        return null;

      case 'roofOptions':
        if (buildingData) {
            return (
                <RoofOptions 
                    buildingData={buildingData}
                    surveyState={surveyState}
                    onSurveyChange={setSurveyState}
                    onContinue={handleRoofOptionsContinue}
                    onStartOver={handleStartNew}
                />
            )
        }
        handleStartNew();
        return null;

      case 'gutters':
        if (buildingData) {
            return (
                <Gutters 
                    surveyState={surveyState}
                    onSurveyChange={setSurveyState}
                    onContinue={handleGuttersContinue}
                    onStartOver={handleStartNew}
                    onStartMeasurement={handleStartGutterMeasurement}
                />
            )
        }
        handleStartNew();
        return null;
        
      case 'heatTrace':
        if (buildingData) {
            return (
                <HeatTrace
                    surveyState={surveyState}
                    onSurveyChange={setSurveyState}
                    onContinue={handleHeatTraceContinue}
                    onStartOver={handleStartNew}
                    onStartMeasurement={handleStartHeatTraceMeasurement}
                />
            )
        }
        handleStartNew();
        return null;

      case 'gutterMeasurement':
        if (selectedPlace) {
            return (
                <MeasurementPage
                    title="Measure Gutter Length"
                    center={{ lat: selectedPlace.latitude, lng: selectedPlace.longitude }}
                    onLengthChange={(length) => {
                        setSurveyState(prev => ({...prev, gutters: {...prev.gutters, length: Math.round(length)}}));
                    }}
                    onDone={handleGutterMeasurementDone}
                    onStartOver={handleStartNew}
                />
            );
        }
        handleStartNew();
        return null;

      case 'heatTraceMeasurement':
        if (selectedPlace) {
            return (
                <MeasurementPage
                    title="Measure Heat Trace Length"
                    center={{ lat: selectedPlace.latitude, lng: selectedPlace.longitude }}
                    onLengthChange={(length) => {
                        setSurveyState(prev => ({...prev, heatTrace: {...prev.heatTrace, length: Math.round(length)}}));
                    }}
                    onDone={handleHeatTraceMeasurementDone}
                    onStartOver={handleStartNew}
                />
            );
        }
        handleStartNew();
        return null;
      
      case 'dashboard':
        if (buildingData && selectedPlace) {
          return (
            <Dashboard
              place={selectedPlace}
              buildingData={buildingData}
              surveyState={surveyState}
              onSurveyChange={setSurveyState}
              onStartNew={handleStartNew}
              streetViewUrl={streetViewUrl}
            />
          );
        }
        handleStartNew();
        return null;

      case 'landing':
      default:
        return (
          <LandingPage onPlaceSelected={handlePlaceSelected} error={error} />
        );
    }
  };

  return <div className="h-full w-full bg-black">{renderContent()}</div>;
}
