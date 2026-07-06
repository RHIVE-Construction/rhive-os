import React from 'react';
import { ArrowLeft, X } from 'lucide-react';

interface LightboxNavigationProps {
    onClose: () => void;
    onBack?: () => void;
    title?: string;
}

export const LightboxNavigation: React.FC<LightboxNavigationProps> = ({ onClose, onBack, title }) => {
    return (
        <div className="fixed top-8 right-8 flex items-center gap-4 z-[1100]">
            <button
                onClick={onBack || onClose}
                className="flex items-center gap-2 text-[11px] font-black tracking-widest uppercase text-white hover:text-white transition-all p-3 px-5 rounded-full border border-white/20 bg-black/80 backdrop-blur-xl cursor-pointer shadow-lg hover:border-rhive-pink/50 group"
            >
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                <span>BACK</span>
            </button>
            <button
                onClick={onClose}
                className="text-white hover:text-white transition-all p-3 rounded-full border border-white/20 bg-black/80 backdrop-blur-xl cursor-pointer shadow-lg hover:border-rhive-pink/50 group"
                title="Close"
            >
                <X size={20} className="group-hover:rotate-90 transition-transform" />
            </button>
        </div>
    );
};
