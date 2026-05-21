import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, X, Shield, Zap, Info, User, HelpCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

interface Message {
    id: string;
    sender: 'hunni' | 'user';
    text: string;
    timestamp: Date;
    options?: { label: string; action: string }[];
}

const HunniChatWidget: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Initial greeting
    useEffect(() => {
        setMessages([
            {
                id: 'init',
                sender: 'hunni',
                text: "Secure line established. I am HUNNI, your tactical AI roofing assistant. We operate under a mandate of absolute mathematical integrity and rapid structural response. What is your immediate operational requirement?",
                timestamp: new Date(),
                options: [
                    { label: "Active Roof Leak [Emergency]", action: "emergency_leak" },
                    { label: "Certified Roofing Specs", action: "certified_roofing" },
                    { label: "Pricing Calculator Help", action: "pricing_help" }
                ]
            }
        ]);
    }, []);

    // Scroll to bottom on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    const handleOptionClick = (option: { label: string; action: string }) => {
        // Add user response
        const userMsg: Message = {
            id: `user-${Date.now()}`,
            sender: 'user',
            text: option.label,
            timestamp: new Date()
        };
        setMessages(prev => [...prev, userMsg]);
        setIsTyping(true);

        // Simulated reply
        setTimeout(() => {
            let replyText = "";
            let replyOptions: { label: string; action: string }[] = [];

            if (option.action === 'emergency_leak') {
                replyText = "Breach detected. First, take a deep breath—we have immediate tactical control of this. As President Kara Robinson always says, structural safety is our absolute operational mandate. I have initiated our Rapid Restoration Protocol for your coordinates. Please place a container under the drip immediately to limit secondary structural damage. I am dispatching our emergency response coordinator right now. To expedite mitigation, would you like us to secure emergency tarping or run a satellite thermal analysis first?";
                replyOptions = [
                    { label: "Secure Emergency Tarping", action: "secure_tarp" },
                    { label: "Run Drone/Satellite Audit", action: "run_audit" }
                ];
            } else if (option.action === 'secure_tarp' || option.action === 'run_audit') {
                replyText = "Confirmed. Emergency triage queue escalated to Priority Tier-1. Enter your address in the scanner on the main dashboard to lock your coordinates into the telemetry system. We are standing by.";
                replyOptions = [
                    { label: "Show Founder Bios", action: "show_founders" },
                    { label: "Pricing Breakdown", action: "pricing_help" }
                ];
            } else if (option.action === 'certified_roofing') {
                replyText = "We deploy Owens Corning Duration steep-slope systems, engineered with patented SureNail® technology to withstand winds up to 130 MPH. For commercial or low-slope profiles, we use GAF TPO/PVC heat-welded membranes, creating a single molecular defense system across your deck. We do not use legacy sub-contractor black box pricing. All mathematics are completely transparent. Shall we configure a Lifetime Shingle System for your home, or do you require a thermal-welded commercial quote?";
                replyOptions = [
                    { label: "Lifetime Shingle System", action: "lifetime_shingle" },
                    { label: "Commercial Flat Roof Quote", action: "commercial_flat" }
                ];
            } else if (option.action === 'lifetime_shingle' || option.action === 'commercial_flat') {
                replyText = "Understood. The strategic math is ready. Access the Instant Estimator from the sidebar panel or main dashboard to see a complete open-book breakdown of shingle count, labor rates, and exact material costs. Transparency is the only protocol we run.";
                replyOptions = [
                    { label: "Open Estimator page", action: "open_estimator" },
                    { label: "Active Emergency Leak", action: "emergency_leak" }
                ];
            } else if (option.action === 'pricing_help') {
                replyText = "Friction is the enemy of progress. Our digital satellite estimator uses high-resolution geometry coordinates to calculate your roof's surface area. Instead of standard high-commission sales pitches, we present the raw mathematics: Retail = (Material + Labor + Overhead) / (1 - TargetMargin). No hidden markups. We run on a strict, pre-disclosed 15% operating margin. Ready to see the actual math? Use the Estimator panel on the main page to calculate your project instantly.";
                replyOptions = [
                    { label: "Calculate Instantly", action: "open_estimator" },
                    { label: "Talk to Founder team", action: "show_founders" }
                ];
            } else if (option.action === 'show_founders') {
                replyText = "Kara Robinson (President) and Michael Robinson (CEO) founded RHIVE to dismantle traditional construction opacity. Kara represents flawless operational execution, while Michael acts as our chief strategic architect. Together, they have structured RHIVE OS to guarantee zero-leak execution. Select our 'About Us' virtual page to inspect their credentials.";
                replyOptions = [
                    { label: "View About Us page", action: "open_about" },
                    { label: "Active Emergency Leak", action: "emergency_leak" }
                ];
            } else if (option.action === 'open_estimator') {
                replyText = "Operational redirect: Access the 'Estimator' tab on the dashboard top bar to run a simulated satellite scan of your property with full transparent pricing breakdowns.";
            } else if (option.action === 'open_about') {
                replyText = "Operational redirect: Select 'About Us' from the top header navigation to explore our organizational integrity, mission, and the leadership profiles.";
            }

            const replyMsg: Message = {
                id: `hunni-${Date.now()}`,
                sender: 'hunni',
                text: replyText,
                timestamp: new Date(),
                options: replyOptions
            };

            setMessages(prev => [...prev, replyMsg]);
            setIsTyping(false);
        }, 1000);
    };

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const userMsg: Message = {
            id: `user-${Date.now()}`,
            sender: 'user',
            text: inputValue,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        const text = inputValue.toLowerCase();
        setInputValue('');
        setIsTyping(true);

        setTimeout(() => {
            let replyText = "";
            let replyOptions: { label: string; action: string }[] = [];

            if (text.includes('leak') || text.includes('water') || text.includes('drip') || text.includes('emergency') || text.includes('flood')) {
                replyText = "Emergency breach detected via search text. Immediate tactical action required. President Kara Robinson's mandate dictates direct escalation. Place a container under the drip immediately. I am activating our Rapid Restoration coordinator. Would you like emergency tarping or satellite thermal scans?";
                replyOptions = [
                    { label: "Secure Emergency Tarping", action: "secure_tarp" },
                    { label: "Run Drone/Satellite Audit", action: "run_audit" }
                ];
            } else if (text.includes('quote') || text.includes('shingle') || text.includes('duration') || text.includes('gaf') || text.includes('owens')) {
                replyText = "We deploy military-grade certified roofing shingles: Owens Corning Duration with SureNail® technology (130 MPH rating) and GAF molecular flat roof membranes. Zero subcontractor black boxes. Would you like a steep-slope shingle or a heat-welded commercial membrane specification?";
                replyOptions = [
                    { label: "Lifetime Shingle System", action: "lifetime_shingle" },
                    { label: "Commercial Flat Roof Quote", action: "commercial_flat" }
                ];
            } else if (text.includes('price') || text.includes('cost') || text.includes('estimator') || text.includes('math') || text.includes('calculate')) {
                replyText = "Integrity is grounded in math. Our formula is: Retail = (Material + Labor + Overhead) / (1 - 15% Margin). We present absolute open-book breakdowns. Would you like to compute your estimation numbers right now?";
                replyOptions = [
                    { label: "Compute My Roof Pricing", action: "pricing_help" }
                ];
            } else if (text.includes('kara') || text.includes('michael') || text.includes('founder') || text.includes('ceo') || text.includes('about')) {
                replyText = "Resolutely dedicated. Our founder team, Kara Robinson and Michael Robinson, designed RHIVE OS to bring high-performance military and corporate compliance standards to construction. Learn about their vision on our 'About' page.";
                replyOptions = [
                    { label: "View About Us page", action: "open_about" }
                ];
            } else {
                replyText = "I have scanned your input against our operational registry. To best serve your requirements, we recommend running our address telemetry scanner on the home page or activating one of our primary triage protocols below.";
                replyOptions = [
                    { label: "Active Roof Leak [Emergency]", action: "emergency_leak" },
                    { label: "Certified Roofing Specs", action: "certified_roofing" },
                    { label: "Pricing Calculator Help", action: "pricing_help" }
                ];
            }

            const replyMsg: Message = {
                id: `hunni-${Date.now()}`,
                sender: 'hunni',
                text: replyText,
                timestamp: new Date(),
                options: replyOptions
            };

            setMessages(prev => [...prev, replyMsg]);
            setIsTyping(false);
        }, 1200);
    };

    // Chamfer sizing for Tech-Noir design
    const chamferSize = "16px";
    const clipPathValue = `polygon(
        ${chamferSize} 0,
        100% 0,
        100% calc(100% - ${chamferSize}),
        calc(100% - ${chamferSize}) 100%,
        0 100%,
        0 ${chamferSize}
    )`;

    return (
        <>
            {/* FLOATING ACTION BUTTON */}
            <div className="fixed bottom-8 left-8 z-[1000]">
                <motion.button
                    whileHover={{ scale: 1.1, rotate: -5 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsOpen(!isOpen)}
                    className="group relative flex items-center justify-center bg-transparent"
                >
                    {/* Glow ring */}
                    <div className="absolute inset-0 bg-rhive-pink/40 blur-[15px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />

                    {/* Main Button */}
                    <div className="relative w-16 h-16 rounded-full bg-black border-2 border-rhive-pink flex items-center justify-center overflow-hidden shadow-[0_0_15px_rgba(236,2,139,0.4)]">
                        <div className="absolute inset-0 bg-gradient-to-tr from-rhive-pink/20 to-transparent" />
                        
                        <MessageSquare className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
                        
                        <span className="absolute bottom-1.5 text-white font-black text-[8px] tracking-widest">HUNNI</span>

                        {/* Animated Pulse */}
                        <div className="absolute inset-0 border border-rhive-pink rounded-full animate-ping opacity-20" />
                    </div>

                    {/* Tooltip */}
                    <div className="absolute left-full ml-4 bg-black/85 backdrop-blur-xl border border-rhive-pink/30 px-3 py-1.5 opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap">
                        <span className="text-[10px] font-bold text-white tracking-widest uppercase">RHIVE AI ASSISTANT</span>
                    </div>
                </motion.button>
            </div>

            {/* CHAT DRAWER PANEL */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: -100, y: 50, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -100, y: 50, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 260, damping: 25 }}
                        className="fixed bottom-28 left-8 w-[380px] h-[550px] z-[1000] flex flex-col group isolate select-none"
                    >
                        {/* 1. Backdrop Glow & Chamfer Background */}
                        <div
                            className="absolute inset-0 bg-black transition-all duration-300 shadow-2xl border border-gray-700"
                            style={{ clipPath: clipPathValue }}
                        />
                        <div
                            className="absolute inset-[1px] bg-black/95 backdrop-blur-2xl z-0 overflow-hidden"
                            style={{ clipPath: clipPathValue }}
                        >
                            {/* Circuit grid accent */}
                            <div className="absolute inset-0 bg-[radial-gradient(rgba(236,2,139,0.08)_1px,transparent_1px)] [background-size:16px_16px] opacity-65" />
                        </div>

                        {/* 2. Custom Tech Borders */}
                        <div className="absolute left-0 top-4 bottom-0 w-[1px] bg-gray-700 z-10" />
                        <div className="absolute right-0 top-0 bottom-4 w-[1px] bg-gray-700 z-10" />
                        <div className="absolute left-4 right-0 top-0 h-[1px] bg-gray-700 z-10" />
                        <div className="absolute left-0 right-4 bottom-0 h-[1px] bg-gray-700 z-10" />

                        {/* Chamfers */}
                        <svg className="absolute top-0 left-0 w-4 h-4 z-20 overflow-visible pointer-events-none">
                            <line x1="0" y1="16" x2="16" y2="0" stroke="#ec028b" strokeWidth="2" className="drop-shadow-[0_0_3px_rgba(236,2,139,0.8)]" />
                        </svg>
                        <svg className="absolute bottom-0 right-0 w-4 h-4 z-20 overflow-visible pointer-events-none">
                            <line x1="0" y1="16" x2="16" y2="0" stroke="#ec028b" strokeWidth="2" className="drop-shadow-[0_0_3px_rgba(236,2,139,0.8)]" />
                        </svg>

                        {/* 3. Panel Content */}
                        <div className="relative z-20 flex flex-col h-full text-white">
                            
                            {/* Header */}
                            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/40">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-sm bg-rhive-pink animate-pulse shadow-[0_0_8px_#ec028b]" />
                                    <div>
                                        <h3 className="text-xs font-black tracking-widest uppercase">HUNNI // SECURE CHAT</h3>
                                        <p className="text-[8px] font-mono text-gray-500 uppercase">Status: ENCRYPTED_TELEMETRY</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-1 rounded-sm border border-transparent hover:border-white/10 hover:bg-white/5 transition-all text-gray-400 hover:text-white"
                                >
                                    <X size={14} />
                                </button>
                            </div>

                            {/* Conversation Stream */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-800">
                                {messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={cn(
                                            "flex flex-col max-w-[85%] space-y-1 text-left",
                                            msg.sender === 'user' ? "ml-auto items-end" : "mr-auto items-start"
                                        )}
                                    >
                                        <div className="flex items-center gap-1.5 text-[8px] font-mono text-gray-500 uppercase">
                                            {msg.sender === 'hunni' ? (
                                                <>
                                                    <Shield size={8} className="text-rhive-pink" />
                                                    <span>HUNNI AI</span>
                                                </>
                                            ) : (
                                                <>
                                                    <User size={8} className="text-rhive-blue" />
                                                    <span>OPERATOR</span>
                                                </>
                                            )}
                                            <span>•</span>
                                            <span>{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                                        </div>

                                        <div
                                            className={cn(
                                                "p-3 text-xs leading-relaxed transition-all",
                                                msg.sender === 'user'
                                                    ? "bg-rhive-pink/15 text-white border border-rhive-pink/30 rounded-l-md rounded-tr-md"
                                                    : "bg-white/5 text-gray-100 border border-white/10 rounded-r-md rounded-tl-md font-mono"
                                            )}
                                        >
                                            {msg.text}
                                        </div>

                                        {/* Render Options Buttons */}
                                        {msg.options && msg.options.length > 0 && (
                                            <div className="flex flex-col gap-2 pt-2 w-full">
                                                {msg.options.map((opt, idx) => (
                                                    <button
                                                        key={idx}
                                                        onClick={() => handleOptionClick(opt)}
                                                        className="w-full py-2 px-3 text-left text-[10px] font-black tracking-wider uppercase bg-black hover:bg-rhive-pink/10 border border-white/10 hover:border-rhive-pink transition-all duration-200 flex items-center justify-between text-white relative overflow-hidden shrink-0"
                                                        style={{
                                                            clipPath: `polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)`
                                                        }}
                                                    >
                                                        <span className="relative z-10 flex items-center gap-1.5">
                                                            {opt.action.includes('emergency') ? (
                                                                <Zap size={10} className="text-red-500 fill-current animate-pulse" />
                                                            ) : (
                                                                <HelpCircle size={10} className="text-rhive-pink" />
                                                            )}
                                                            {opt.label}
                                                        </span>
                                                        <span className="text-[8px] font-mono text-gray-500 font-normal">// RUN</span>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {/* Typing indicator */}
                                {isTyping && (
                                    <div className="flex flex-col max-w-[80%] space-y-1 mr-auto items-start">
                                        <div className="flex items-center gap-1.5 text-[8px] font-mono text-gray-500 uppercase">
                                            <Shield size={8} className="text-rhive-pink" />
                                            <span>HUNNI AI</span>
                                            <span>•</span>
                                            <span>DECODING...</span>
                                        </div>
                                        <div className="bg-white/5 border border-white/10 p-3 rounded-r-md rounded-tl-md text-xs flex gap-1.5 items-center">
                                            <span className="w-1.5 h-1.5 rounded-full bg-rhive-pink animate-bounce" style={{ animationDelay: '0ms' }} />
                                            <span className="w-1.5 h-1.5 rounded-full bg-rhive-pink animate-bounce" style={{ animationDelay: '150ms' }} />
                                            <span className="w-1.5 h-1.5 rounded-full bg-rhive-pink animate-bounce" style={{ animationDelay: '300ms' }} />
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Message Input Area */}
                            <form onSubmit={handleSendMessage} className="p-3 border-t border-white/10 bg-black/80 flex gap-2">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="TRANSMIT MESSAGE TO HUNNI..."
                                    className="flex-1 bg-white/5 border border-white/10 outline-none text-white text-[10px] uppercase font-mono px-3 py-2 placeholder-gray-600 focus:border-rhive-pink/50 transition-all rounded-sm"
                                />
                                <button
                                    type="submit"
                                    className="p-2 bg-rhive-pink hover:bg-rhive-pink/90 text-white rounded-sm transition-all shadow-[0_0_10px_rgba(236,2,139,0.3)] shrink-0 flex items-center justify-center"
                                >
                                    <Send size={12} />
                                </button>
                            </form>

                            {/* Footer checksum */}
                            <div className="px-4 py-1.5 border-t border-white/5 bg-black text-[7px] font-mono text-gray-600 uppercase flex justify-between">
                                <span>SECURE CORE // V2.92-BETA</span>
                                <span>HASH: 0x9F4C2A3D</span>
                            </div>

                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default HunniChatWidget;
