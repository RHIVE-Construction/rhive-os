import * as React from 'react';
import { cn } from '../../lib/utils';

// A simple CSS-driven tooltip for demonstration purposes.
// It requires the parent to have a `group` class.

export const TooltipProvider: React.FC<{ children: React.ReactNode; delayDuration?: number }> = ({ children }) => {
  // Provider doesn't need to do anything in this simple implementation
  return <>{children}</>;
};

export const Tooltip: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className="group relative inline-flex">{children}</div>;
};

// Fix: Add `asChild` prop to TooltipTrigger's props to resolve type error in Dashboard.tsx.
export const TooltipTrigger: React.FC<{ children: React.ReactNode; asChild?: boolean }> = ({ children }) => {
  return <>{children}</>;
};

export const TooltipContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { side?: 'top' | 'bottom' | 'left' | 'right' }
>(({ className, side = 'top', ...props }, ref) => {
    const positionClasses = {
        top: 'left-1/2 -translate-x-1/2 bottom-full mb-2',
        bottom: 'left-1/2 -translate-x-1/2 top-full mt-2',
        left: 'top-1/2 -translate-y-1/2 right-full mr-2',
        right: 'top-1/2 -translate-y-1/2 left-full ml-2',
    };

    return (
        <div
            ref={ref}
            className={cn(
            'absolute w-max max-w-xs',
            'z-50 scale-95 opacity-0 transition-all group-hover:scale-100 group-hover:opacity-100 pointer-events-none',
            'rounded-md bg-gray-950 border border-gray-700 px-3 py-1.5 text-base text-gray-100 shadow-lg',
            positionClasses[side],
            className
            )}
            {...props}
        />
    );
});
TooltipContent.displayName = 'TooltipContent';