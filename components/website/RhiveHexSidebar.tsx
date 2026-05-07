import React from 'react';
import { motion } from 'framer-motion';
import { Calculator, MapPin, Zap } from 'lucide-react';
import { cn } from '../../lib/utils';

const HexButton = ({ icon: Icon, label, color }: { icon: any, label: string, color: string }) => (
    <motion.button
        whileHover={{ x: -10 }}
        className="group relative flex items-center"
    >
        <div className={cn(
            "w-12 h-14 flex items-center justify-center relative translate-x-2 z-10 overflow-visible",
        )}>
            <svg viewBox="0 0 100 115" className="absolute inset-0 w-full h-full drop-shadow-[0_0_8px_rgba(0,0,0,0.5)]">
                <path
                    d="M50 0 L100 28.8 L100 86.2 L50 115 L0 86.2 L0 28.8 Z"
                    fill="#000000"
                    stroke={color}
                    strokeWidth="4"
                    className="transition-colors group-hover:fill-rhive-pink/10"
                />
            </svg>
            <Icon className="w-5 h-5 relative z-20 text-white group-hover:text-rhive-pink transition-colors" />
        </div>

        <div className={cn(
            "bg-black/90 backdrop-blur-md border px-4 py-2 opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0 absolute right-full mr-2 whitespace-nowrap overflow-hidden",
            `border-[${color}]`
        )}
            style={{ borderColor: color }}
        >
            <span className="text-[10px] font-black tracking-widest text-white">{label}</span>
        </div>
    </motion.button>
);

const RhiveHexSidebar: React.FC = () => {
    return (
        <div className="fixed right-0 top-1/2 -translate-y-1/2 z-[1000] flex flex-col gap-4 pr-2">
            <HexButton icon={Calculator} label="INSTANT ESTIMATE" color="#ec028b" />
            <HexButton icon={MapPin} label="OUR PROJECTS" color="#116dff" />
            <HexButton icon={Zap} label="STORM ALERTS" color="#e2ab49" />
        </div>
    );
};

export default RhiveHexSidebar;
