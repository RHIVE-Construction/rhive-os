
import React from 'react';
import { EstimatorFlow } from '../components/EstimatorFlow';
import { useNavigation } from '../contexts/NavigationContext';

const EstimateToolPage: React.FC = () => {
    const { setActivePageId } = useNavigation();

    // This page just acts as a container for the full-screen estimator flow
    return (
        <div className="h-full w-full bg-black relative z-20">
            <EstimatorFlow onClose={() => setActivePageId('E-01')} />
        </div>
    );
};

export default EstimateToolPage;
