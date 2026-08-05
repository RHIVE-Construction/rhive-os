/**
 * EstimateErrorBoundary
 *
 * React 19 compatible error boundary for the Estimate Tool.
 *
 * React 19 + useDefineForClassFields:false means class component instance
 * members (state, props, setState) aren't resolved by tsc via normal
 * inheritance. We work around this with:
 *   1. Object.defineProperty for state initialization
 *   2. (this as any) casts for instance member access
 *   3. React.createElement for the key-reset prop (avoids JSX type conflict)
 */
import React, { Component, ReactNode, useState, useCallback } from 'react';

interface InnerProps {
    children: ReactNode;
    onError: () => void;
}
interface InnerState { crashed: boolean }

class InnerBoundary extends Component<InnerProps, InnerState> {
    constructor(p: InnerProps) {
        super(p);
        // Object.defineProperty is required — React 19 + useDefineForClassFields:false
        // breaks the normal `this.state = ...` assignment pattern for class components.
        Object.defineProperty(this, 'state', {
            value: { crashed: false } as InnerState,
            writable: true,
            configurable: true,
        });
    }

    static getDerivedStateFromError(): InnerState {
        return { crashed: true };
    }

    componentDidCatch(_error: Error, _info: React.ErrorInfo): void {
        // Notify the outer functional wrapper so it can display the fallback UI.
        // Without this call, crashed state in EstimateErrorBoundary stays false
        // and InnerBoundary's null return produces a permanent black screen.
        const p = (this as any).props as InnerProps;
        p.onError();
    }

    render(): ReactNode {
        /* eslint-disable @typescript-eslint/no-explicit-any */
        const s = (this as any).state as InnerState;
        const p = (this as any).props as InnerProps;
        /* eslint-enable @typescript-eslint/no-explicit-any */
        if (s.crashed) {
            return null; // outer state drives the fallback UI
        }
        return p.children;
    }
}

// ─── Fallback UI ──────────────────────────────────────────────────────────────
function EstimateFallback({ onRetry }: { onRetry: () => void }) {
    return (
        <div className="h-full w-full bg-black flex flex-col items-center justify-center p-8 relative overflow-hidden">
            <svg className="absolute top-0 left-0 w-16 h-16 pointer-events-none" viewBox="0 0 64 64">
                <polyline points="0,64 0,0 64,0" fill="none" stroke="#ec028b" strokeWidth="1" opacity="0.4" />
            </svg>
            <svg className="absolute bottom-0 right-0 w-16 h-16 pointer-events-none" viewBox="0 0 64 64">
                <polyline points="64,0 64,64 0,64" fill="none" stroke="#ec028b" strokeWidth="1" opacity="0.4" />
            </svg>
            <div className="relative z-10 text-center max-w-md">
                <div
                    className="mx-auto mb-6 w-16 h-16 flex items-center justify-center border border-rhive-pink/30 bg-rhive-pink/10"
                    style={{ clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)' }}
                >
                    <svg className="w-7 h-7 text-rhive-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round"
                            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                    </svg>
                </div>
                <p className="text-[10px] font-mono text-rhive-pink uppercase tracking-widest mb-2">
                    // SYSTEM RECOVERY
                </p>
                <h1 className="text-2xl font-black uppercase text-white tracking-tight mb-3">
                    Estimate Tool Unavailable
                </h1>
                <p className="text-sm text-gray-400 font-mono leading-relaxed mb-8">
                    An unexpected error occurred while loading the estimator. Your session and data are intact.
                </p>
                <button
                    id="estimate-error-retry-btn"
                    onClick={onRetry}
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

// ─── Public export — functional wrapper with key-reset pattern ────────────────
interface EstimateErrorBoundaryProps {
    children: ReactNode;
    onReset?: () => void;
}

export function EstimateErrorBoundary({ children, onReset }: EstimateErrorBoundaryProps) {
    const [crashed, setCrashed] = useState(false);
    const [resetKey, setResetKey] = useState(0);

    const handleRetry = useCallback(() => {
        setCrashed(false);
        setResetKey(k => k + 1);
        onReset?.();
    }, [onReset]);

    if (crashed) {
        return <EstimateFallback onRetry={handleRetry} />;
    }

    // Use React.createElement to attach the `key` prop — JSX cannot type-check
    // `key` against InnerProps in React 19 (it's a reserved attribute, not a prop).
    return React.createElement(
        InnerBoundary,
        { key: resetKey, onError: () => setCrashed(true) },
        children,
    );
}

export default EstimateErrorBoundary;
