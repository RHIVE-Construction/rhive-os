
import React from 'react';
import { EstimatorFlow } from '../components/EstimatorFlow';
import { useNavigation } from '../contexts/NavigationContext';

// Error boundary to catch estimator crashes gracefully
class EstimatorErrorBoundary extends React.Component<
    { children: React.ReactNode; onBack: () => void },
    { hasError: boolean; error: string }
> {
    constructor(props: any) {
        super(props);
        this.state = { hasError: false, error: '' };
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error: error.message };
    }

    componentDidCatch(error: Error) {
        console.error('[EstimateToolPage] Estimator crashed:', error);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center h-full w-full bg-black text-white p-8 text-center">
                    <div className="text-rhive-pink text-6xl mb-6">⚠</div>
                    <h2 className="text-2xl font-bold uppercase tracking-widest mb-4">Estimator Unavailable</h2>
                    <p className="text-gray-400 text-sm mb-8 max-w-md">
                        The estimate tool encountered an error. This may be due to missing Google Maps API configuration.
                    </p>
                    <button
                        onClick={this.props.onBack}
                        className="px-6 py-3 bg-rhive-pink/20 border border-rhive-pink/40 text-white text-sm font-bold uppercase tracking-widest hover:bg-rhive-pink/40 transition-colors"
                    >
                        ← Back to Dashboard
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}

const EstimateToolPage: React.FC = () => {
    const { setActivePageId } = useNavigation();

    return (
        <div className="h-full w-full bg-black relative z-20">
            <EstimatorErrorBoundary onBack={() => setActivePageId('E-01')}>
                <EstimatorFlow onClose={() => setActivePageId('E-01')} />
            </EstimatorErrorBoundary>
        </div>
    );
};

export default EstimateToolPage;
