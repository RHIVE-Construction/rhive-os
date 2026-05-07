import React from 'react';
import { cn } from '../../lib/utils';
import { useTheme } from '../../contexts/ThemeContext';

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, children, ...props }, ref) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const chamferSize = "24px";

    // CLIP PATH for Backgrounds (Matches the logic)
    const clipPathValue = `polygon(
        ${chamferSize} 0,
        100% 0,
        100% calc(100% - ${chamferSize}),
        calc(100% - ${chamferSize}) 100%,
        0 100%,
        0 ${chamferSize}
    )`;

    return (
        <div
            ref={ref}
            className={cn('relative flex flex-col group isolate transition-all duration-300', className)}
            {...props}
        >
            {/* 1. Background Layers (Clipped) */}
            <div
                className={cn(
                    "absolute inset-0 backdrop-blur-md transition-colors duration-500 z-[-2]",
                    isDark ? "bg-black/20" : "bg-white/40"
                )}
                style={{ clipPath: clipPathValue }}
            />
            <div
                className={cn(
                    "absolute inset-[1px] z-[-1] overflow-hidden transition-colors duration-500",
                    isDark ? "bg-black/40" : "bg-white/60"
                )}
                style={{ clipPath: clipPathValue }}
            >
                <div className={cn("absolute inset-0 z-0 transition-colors duration-500", isDark ? "bg-black/20" : "bg-white/10")} />
            </div>

            {/* 2. BORDER CONSTRUCTION */}
            <div className={cn("absolute left-0 top-6 bottom-0 w-[1px] z-10 transition-colors duration-500", isDark ? "bg-white/10" : "bg-black/10")} />
            <div className={cn("absolute left-6 right-0 top-0 h-[1px] z-10 transition-colors duration-500", isDark ? "bg-white/10" : "bg-black/10")} />
            <div className={cn("absolute right-0 top-0 bottom-6 w-[1px] z-10 transition-colors duration-500", isDark ? "bg-white/10" : "bg-black/10")} />
            <div className={cn("absolute left-0 right-6 bottom-0 h-[1px] z-10 transition-colors duration-500", isDark ? "bg-white/10" : "bg-black/10")} />

            <svg className="absolute top-0 left-0 w-6 h-6 z-10 overflow-visible pointer-events-none">
                <line x1="0" y1="24" x2="24" y2="0" stroke={isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"} strokeWidth="1" strokeLinecap="square" className="transition-all duration-500" />
            </svg>

            <svg className="absolute bottom-0 right-0 w-6 h-6 z-10 overflow-visible pointer-events-none">
                <line x1="0" y1="24" x2="24" y2="0" stroke={isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"} strokeWidth="1" strokeLinecap="square" className="transition-all duration-500" />
            </svg>

            {/* 3. Card Content */}
            <div className="relative z-20 h-full">
                {children}
            </div>
        </div>
    );
});
Card.displayName = 'Card';

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    return (
        <div ref={ref} className={cn('flex flex-col space-y-1.5 p-6 border-b transition-colors duration-500', isDark ? "border-white/5" : "border-black/5", className)} {...props} />
    );
});
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(({ className, ...props }, ref) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    return (
        <h3 ref={ref} className={cn('text-xl font-bold tracking-tight uppercase transition-colors duration-500', isDark ? "text-gray-100" : "text-black", className)} {...props} />
    );
});
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(({ className, ...props }, ref) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    return (
        <p ref={ref} className={cn('text-sm font-medium transition-colors duration-500', isDark ? "text-gray-400" : "text-gray-600", className)} {...props} />
    );
});
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pt-6', className)} {...props} />
));
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center p-6 pt-0', className)} {...props} />
));
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
