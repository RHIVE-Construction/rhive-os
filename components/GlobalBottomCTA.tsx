import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigation } from '../contexts/NavigationContext';

const GlobalBottomCTA: React.FC = () => {
    const { setActivePageId } = useNavigation();

    return (
        <div className="w-full mt-24 relative z-20">
            <div className="relative flex flex-col group isolate w-full border-t border-gray-800 bg-black">
                <div className="absolute inset-0 bg-gradient-to-t from-rhive-pink/5 to-transparent pointer-events-none" />
                
                <div className="max-w-5xl mx-auto text-center py-20 px-6 relative z-10">
                    <h3 className="text-4xl md:text-5xl font-black uppercase mb-6 text-white tracking-tight">Ready to Secure Your Utah Home?</h3>
                    <p className="text-gray-400 font-serif text-xl md:text-2xl mb-12 max-w-3xl mx-auto">
                        Whether you need a fast repair or a full premium replacement, our team is ready to deliver.
                    </p>
                    
                    <button 
                        onClick={() => setActivePageId('P-12')}
                        className="relative px-12 py-6 bg-rhive-pink text-white font-bold uppercase tracking-widest text-lg hover:bg-[#c90275] transition-all flex items-center justify-center gap-3 group shadow-[0_0_20px_rgba(236,2,139,0.4)] hover:shadow-[0_0_30px_rgba(236,2,139,0.6)] mx-auto"
                        style={{ clipPath: 'polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)' }}
                    >
                        Request an Estimate <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GlobalBottomCTA;
