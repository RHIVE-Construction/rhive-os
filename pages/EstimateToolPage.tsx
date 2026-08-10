
import React from 'react';
import { EstimatorFlow } from '../components/EstimatorFlow';
import { EstimateErrorBoundary } from '../components/EstimateErrorBoundary';
import { useNavigation } from '../contexts/NavigationContext';

const EstimateToolPage: React.FC = () => {
    const { setActivePageId } = useNavigation();

    const handleClose = () => setActivePageId('E-01');

    // Wrapped in EstimateErrorBoundary so any crash inside the tool
    // shows a RHIVE-branded recovery UI instead of a blank black screen.
    return (
        <div className="h-full w-full bg-black relative z-20">
            <EstimateErrorBoundary onReset={handleClose}>
                <EstimatorFlow onClose={handleClose} />
            </EstimateErrorBoundary>
        </div>
    );
};

export default EstimateToolPage;
