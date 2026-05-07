
import React from 'react';
import { cn } from '../lib/utils';

interface NumberToggleProps {
  options: string[];
  selected: string;
  onChange: (val: string) => void;
  className?: string;
}

const NumberToggle: React.FC<NumberToggleProps> = ({ options, selected, onChange, className }) => {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {options.map((opt) => {
        const isActive = selected === opt;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={cn(
              "relative w-10 h-10 flex items-center justify-center text-base font-bold transition-all duration-300 group",
              isActive ? 'text-white shadow-[0_0_10px_rgba(236,2,139,0.3)]' : 'text-gray-500 hover:text-white'
            )}
          >
            {/* Background Layer */}
            <div
              className={cn(
                "absolute inset-0 transition-colors duration-300",
                isActive ? 'bg-rhive-pink/20' : 'bg-black/60 group-hover:bg-black/80'
              )}
              style={{ clipPath: "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)" }}
            />

            {/* SVG Border Layer (Solid Stroke) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
              <path
                d="M 6 0 L 40 0 L 40 34 L 34 40 L 0 40 L 0 6 Z"
                fill="none"
                stroke={isActive ? "#ec028b" : "#374151"}
                strokeWidth="1"
                strokeLinecap="square"
                className={cn(
                  "transition-colors duration-300",
                  !isActive && "group-hover:stroke-gray-600"
                )}
              />
            </svg>

            <span className="relative z-10">{opt}</span>
          </button>
        );
      })}
    </div>
  );
};

export default NumberToggle;
