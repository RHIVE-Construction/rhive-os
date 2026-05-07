import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';

const HunniChatWidget: React.FC = () => {
    return (
        <div className="fixed bottom-8 left-8 z-[1000]">
            <motion.button
                whileHover={{ scale: 1.1, rotate: -5 }}
                whileTap={{ scale: 0.9 }}
                className="group relative flex items-center justify-center"
            >
                {/* Glow ring */}
                <div className="absolute inset-0 bg-rhive-pink/40 blur-[15px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Main Button */}
                <div className="relative w-16 h-16 rounded-full bg-black border-2 border-rhive-pink flex items-center justify-center overflow-hidden shadow-[0_0_15px_rgba(236,2,139,0.4)]">
                    <div className="absolute inset-0 bg-gradient-to-tr from-rhive-pink/20 to-transparent" />

                    <span className="relative z-10 text-white font-black text-[10px] tracking-tighter">HUNNI</span>

                    {/* Animated Pulse */}
                    <div className="absolute inset-0 border border-rhive-pink rounded-full animate-ping opacity-20" />
                </div>

                {/* Tooltip */}
                <div className="absolute left-full ml-4 bg-black/80 backdrop-blur-xl border border-rhive-pink/30 px-3 py-1.5 opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap">
                    <span className="text-[10px] font-bold text-white tracking-widest uppercase">Chat with AI Support</span>
                </div>
            </motion.button>
        </div>
    );
};

export default HunniChatWidget;
