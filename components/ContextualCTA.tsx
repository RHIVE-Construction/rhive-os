import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigation } from '../contexts/NavigationContext';

interface ContextualCTAProps {
    message: string;
    buttonText: string;
}

const ContextualCTA: React.FC<ContextualCTAProps> = ({ message, buttonText }) => {
    const { setActivePageId } = useNavigation();

    return (
        <div className="w-full max-w-4xl mx-auto my-16 p-8 border border-gray-800 bg-[#050505] flex flex-col md:flex-row items-center justify-between gap-6" style={{ clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)' }}>
            <p className="text-xl md:text-2xl font-serif text-gray-300">
                {message}
            </p>
            <button 
                onClick={() => setActivePageId('P-12')}
                className="flex-shrink-0 px-8 py-4 bg-rhive-pink text-white font-bold uppercase tracking-widest text-sm hover:bg-[#c90275] transition-colors flex items-center justify-center gap-3 group"
                style={{ clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)' }}
            >
                {buttonText} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
        </div>
    );
};

export default ContextualCTA;
