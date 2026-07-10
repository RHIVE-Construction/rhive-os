import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an uncaught rendering error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return (
        <div className="p-8 bg-black border border-red-500/30 rounded-2xl text-white font-sans space-y-6 max-w-4xl mx-auto my-8 relative overflow-hidden">
          {/* Neon Pink/Red tech background accents */}
          <div className="absolute top-0 left-0 w-2 h-full bg-red-500/80 shadow-[0_0_15px_rgba(239,68,68,0.5)]"></div>
          
          <div className="pl-4">
            <div className="flex items-center space-x-3 text-red-500 mb-4">
              <svg className="w-8 h-8 drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h3 className="text-xl font-bold tracking-wide uppercase font-mono">System Recovery: Render Isolated</h3>
            </div>
            
            <p className="text-gray-300 text-base leading-relaxed max-w-2xl mb-4">
              A rendering exception occurred in this panel's view hierarchy. 
              The application core remains fully functional. You may close this dialog or attempt to re-estimate.
            </p>
            
            <div className="border border-gray-800 rounded-lg overflow-hidden bg-gray-950">
              <div className="bg-gray-900 px-4 py-2 border-b border-gray-800 flex justify-between items-center">
                <span className="text-xs text-gray-500 font-mono">ERROR_STACK_TRACE</span>
                <span className="w-3 h-3 rounded-full bg-red-500/80"></span>
              </div>
              <pre className="p-4 text-xs text-red-400 overflow-auto max-h-60 font-mono whitespace-pre-wrap selection:bg-red-500/30">
                {this.state.error?.stack || this.state.error?.toString()}
              </pre>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
