/**
 * EstimateToolPublicPage
 *
 * Public-zone variant of the Estimate Tool page for use on clean URL paths
 * (e.g. app.rhiveconstruction.com/estimate-tool).
 *
 * KEY DIFFERENCE from EstimateToolPage:
 *   - Does NOT use useNavigation() — NavigationContext is not available on clean paths
 *   - onClose navigates to the homepage via window.location.href instead of setActivePageId
 *   - Registered as 'estimate-tool' in pageRegistry (canonical clean-URL key)
 *
 * The CRM variant (EstimateToolPage) remains registered as 'P-12' / 'E-27'
 * and continues to use NavigationContext normally for employees.
 */

import React from 'react';
import { EstimatorFlow } from '../components/EstimatorFlow';
import { EstimateErrorBoundary } from '../components/EstimateErrorBoundary';

const EstimateToolPublicPage: React.FC = () => {
    // On the public page, "close" means go back to the RHIVE homepage.
    // No CRM routing — we use a hard navigation to keep contexts separate.
    const handleClose = () => {
        window.location.href = '/';
    };

    return (
        <div className="h-full w-full bg-transparent relative z-20">
            <EstimateErrorBoundary onReset={handleClose}>
                <EstimatorFlow onClose={handleClose} />
            </EstimateErrorBoundary>
        </div>
    );
};

export default EstimateToolPublicPage;
