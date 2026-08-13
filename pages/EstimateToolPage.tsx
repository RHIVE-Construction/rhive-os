
import React, { useState, useEffect } from 'react';
import { EstimatorFlow } from '../components/EstimatorFlow';
import { EstimateErrorBoundary } from '../components/EstimateErrorBoundary';
import { useNavigation } from '../contexts/NavigationContext';
import { useMockDB } from '../contexts/MockDatabaseContext';
import { useGoogleMapsApi } from '../hooks/useGoogleMapsApi';
import type { Place } from '../types';

const EstimateToolPage: React.FC = () => {
    const { setActivePageId } = useNavigation();
    const { currentUser } = useMockDB();
    const isApiReady = useGoogleMapsApi();
    const [initialPlace, setInitialPlace] = useState<Place | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(false);

    const handleClose = () => {
        if (currentUser) {
            setActivePageId('E-01');
        } else {
            setActivePageId('P-00-V3');
        }
    };

    useEffect(() => {
        const addr = sessionStorage.getItem('estimateAddress');
        if (!addr) {
            setInitialPlace(undefined);
            return;
        }

        sessionStorage.removeItem('estimateAddress');

        if (isApiReady && window.google?.maps?.Geocoder) {
            setIsLoading(true);
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode({ address: addr }, (results: any, status: any) => {
                setIsLoading(false);
                if (status === 'OK' && results[0] && results[0].geometry) {
                    const loc = results[0].geometry.location;
                    setInitialPlace({
                        address: results[0].formatted_address || addr,
                        latitude: loc.lat(),
                        longitude: loc.lng()
                    });
                } else {
                    // Fallback to standard SLC coordinates
                    setInitialPlace({
                        address: addr,
                        latitude: 40.7608,
                        longitude: -111.8910
                    });
                }
            });
        } else {
            setInitialPlace({
                address: addr,
                latitude: 40.7608,
                longitude: -111.8910
            });
        }
    }, [isApiReady]);

    if (isLoading) {
        return (
            <div className="h-full w-full bg-black flex items-center justify-center text-white font-mono text-xs uppercase tracking-widest">
                Geocoding Property Address...
            </div>
        );
    }

    return (
        <div className="h-full w-full bg-black relative z-20">
            <EstimateErrorBoundary onReset={handleClose}>
                <EstimatorFlow key={initialPlace?.address || 'default'} onClose={handleClose} initialPlace={initialPlace} />
            </EstimateErrorBoundary>
        </div>
    );
};

export default EstimateToolPage;
