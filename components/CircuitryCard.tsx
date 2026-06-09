import React from 'react';
import PlexusShape from './PlexusShape';

interface ShowcaseCardProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
    icon?: React.ReactNode;
    headerAccessory?: React.ReactNode;
}

export const CircuitryCard: React.FC<ShowcaseCardProps> = ({ children, className = '', title, icon, headerAccessory }) => {
    const chamferSize = "24px";

    // CLIP PATH for Backgrounds (Matches the border logic)
    const clipPathValue = `polygon(
    ${ chamferSize } 0,
    100% 0,
    100% calc(100% - ${ chamferSize }),
    calc(100% - ${ chamferSize }) 100%,
    0 100%,
    0 ${ chamferSize }
)`;

    return (
        <div className={`relative flex flex-col ${ className } group isolate`}>
            {/* 1. Background Layers (Clipped) */}
            <div
                className="absolute inset-0 bg-[var(--bg-main)] transition-colors duration-300"
                style={{ clipPath: clipPathValue }}
            />
            <div
                className="absolute inset-[1px] bg-[var(--bg-card-solid)] z-0 overflow-hidden"
                style={{ clipPath: clipPathValue }}
            >
                {/* Universal Dark Pink Plexus Background */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <PlexusShape
                        backgroundColor="#000000"
                        dotColor="#ec028b"
                        lineColor="236, 2, 139"
                        density={30}
                        className="h-full w-full relative z-0"
                    />
                    <div className="absolute inset-0 bg-black/60 z-10" />
                </div>
            </div>

            {/* 2. BORDER CONSTRUCTION (Manual Placement for Perfect Control) 
                Target: Pink on Left/Right. Gray on Chamfers/Top/Bottom. Pink Accent on Top-Left Corner.
            */}

            {/* Left Border (Gray) */}
            <div className="absolute left-0 top-6 bottom-0 w-[1px] bg-gray-700 z-10" />

            {/* Top-Left Chamfer (Gray Base) */}
            <svg className="absolute top-0 left-0 w-6 h-6 z-10 overflow-visible pointer-events-none">
                <line x1="0" y1="24" x2="24" y2="0" stroke="#374151" strokeWidth="1" strokeLinecap="square" />
            </svg>

            {/* TL Chamfer Accent (Pink Segment) */}
            <svg className="absolute top-0 left-0 w-6 h-6 z-20 overflow-visible pointer-events-none">
                <line x1="8" y1="16" x2="16" y2="8" stroke="#ec028b" strokeWidth="2" strokeLinecap="square" className="drop-shadow-[0_0_3px_rgba(236,2,139,0.8)]" />
            </svg>

            {/* Right Border (Gray) */}
            <div className="absolute right-0 top-0 bottom-6 w-[1px] bg-gray-700 z-10" />

            {/* Top Border (Gray) - Starts after chamfer */}
            <div className="absolute left-6 right-0 top-0 h-[1px] bg-gray-700 z-10" />

            {/* Bottom Border (Gray) - Ends before chamfer */}
            <div className="absolute left-0 right-6 bottom-0 h-[1px] bg-gray-700 z-10" />

            {/* Bottom-Right Chamfer (Gray Base) */}
            <svg className="absolute bottom-0 right-0 w-6 h-6 z-10 overflow-visible pointer-events-none">
                <line x1="0" y1="24" x2="24" y2="0" stroke="#374151" strokeWidth="1" strokeLinecap="square" />
            </svg>

            {/* BR Chamfer Accent (Pink Segment) */}
            <svg className="absolute bottom-0 right-0 w-6 h-6 z-20 overflow-visible pointer-events-none">
                <line x1="8" y1="16" x2="16" y2="8" stroke="#ec028b" strokeWidth="2" strokeLinecap="square" className="drop-shadow-[0_0_3px_rgba(236,2,139,0.8)]" />
            </svg>

            {/* 3. Card Content */}
            <div className="relative z-20 p-6 flex flex-col h-full text-[var(--text-main)]">
                {title && (
                    <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4 mb-6 flex-wrap gap-4">
                        <div className="flex items-center gap-3">
                            {icon && (
                                <div className="text-rhive-pink p-2 bg-rhive-pink/10 rounded-sm border border-rhive-pink/20 flex items-center justify-center shrink-0">
                                    {icon}
                                </div>
                            )}
                            <h3 className="text-xl font-bold text-[var(--text-main)] tracking-tight">{title}</h3>
                        </div>
                        {headerAccessory && (
                            <div className="flex items-center shrink-0">
                                {headerAccessory}
                            </div>
                        )}
                    </div>
                )}

                <div className="flex-grow">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default CircuitryCard;
