import React from 'react';

interface Props {
    children: React.ReactNode;
    onReset?: () => void;
}

interface State {
    hasError: boolean;
    errorMessage: string;
}

/**
 * EstimateErrorBoundary
 *
 * Catches any render-time throw inside the Estimate Tool subtree and
 * displays a styled recovery UI instead of a blank/black screen.
 * Call onReset (or click "Try Again") to remount the tool fresh.
 */
export class EstimateErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, errorMessage: '' };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, errorMessage: error?.message ?? 'Unknown error' };
    }

    componentDidCatch(error: Error, info: React.ErrorInfo) {
        // Surface the error in the console for debugging — never shown to end-user
        console.error('[EstimateErrorBoundary] Caught error:', error, info.componentStack);
    }

    handleReset = () => {
        this.setState({ hasError: false, errorMessage: '' });
        this.props.onReset?.();
    };

    render() {
        if (!this.state.hasError) {
            return this.props.children;
        }

        return (
            <div className="h-full w-full bg-black flex flex-col items-center justify-center p-8 relative overflow-hidden">
                {/* Subtle pink corner accents */}
                <svg className="absolute top-0 left-0 w-16 h-16 pointer-events-none" viewBox="0 0 64 64">
                    <polyline points="0,64 0,0 64,0" fill="none" stroke="#ec028b" strokeWidth="1" opacity="0.4" />
                </svg>
                <svg className="absolute bottom-0 right-0 w-16 h-16 pointer-events-none" viewBox="0 0 64 64">
                    <polyline points="64,0 64,64 0,64" fill="none" stroke="#ec028b" strokeWidth="1" opacity="0.4" />
                </svg>

                <div className="relative z-10 text-center max-w-md">
                    {/* Icon */}
                    <div className="mx-auto mb-6 w-16 h-16 flex items-center justify-center border border-rhive-pink/30 bg-rhive-pink/10"
                        style={{ clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)' }}>
                        <svg className="w-7 h-7 text-rhive-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round"
                                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                        </svg>
                    </div>

                    {/* Heading */}
                    <p className="text-[10px] font-mono text-rhive-pink uppercase tracking-widest mb-2">
                        // SYSTEM RECOVERY
                    </p>
                    <h1 className="text-2xl font-black uppercase text-white tracking-tight mb-3">
                        Estimate Tool Unavailable
                    </h1>
                    <p className="text-sm text-gray-400 font-mono leading-relaxed mb-8">
                        An unexpected error occurred while loading the estimator. Your session and data are intact.
                    </p>

                    {/* Recovery button */}
                    <button
                        id="estimate-error-retry-btn"
                        onClick={this.handleReset}
                        className="relative px-8 py-3 text-xs font-black uppercase tracking-widest text-white transition-all duration-200 hover:shadow-[0_0_20px_rgba(236,2,139,0.5)]"
                        style={{
                            clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)',
                            background: '#ec028b'
                        }}
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }
}

export default EstimateErrorBoundary;
