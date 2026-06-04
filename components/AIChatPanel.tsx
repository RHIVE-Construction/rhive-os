import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Sparkles, X, Send, Minimize2, RotateCcw, ChevronDown } from 'lucide-react';
import { streamChat, isAIConfigured, type ChatMessage } from '../lib/aiService';
import { cn } from '../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface Message {
    id: string;
    role: 'user' | 'model';
    text: string;
    streaming?: boolean;
}

interface AIChatPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

// ---------------------------------------------------------------------------
// Suggested starter prompts
// ---------------------------------------------------------------------------
const STARTER_PROMPTS = [
    'What are our active projects right now?',
    'How do I submit a new lead?',
    'Explain the project pipeline stages.',
    'What roofing materials do we carry?',
];

// ---------------------------------------------------------------------------
// Markdown-lite renderer: bold **text** and bullet lists
// ---------------------------------------------------------------------------
const renderText = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, i) => {
        // Bold
        const parts = line.split(/(\*\*[^*]+\*\*)/g).map((part, j) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={j}>{part.slice(2, -2)}</strong>;
            }
            return part;
        });

        // Bullet list lines
        if (line.trim().startsWith('- ') || line.trim().startsWith('• ')) {
            const content = line.trim().slice(2);
            const bulletParts = content.split(/(\*\*[^*]+\*\*)/g).map((part, j) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                    return <strong key={j}>{part.slice(2, -2)}</strong>;
                }
                return part;
            });
            return (
                <div key={i} className="flex gap-1.5 items-start my-0.5">
                    <span className="text-rhive-pink mt-0.5 flex-shrink-0">▸</span>
                    <span>{bulletParts}</span>
                </div>
            );
        }

        return <div key={i} className={line === '' ? 'h-2' : ''}>{parts}</div>;
    });
};

// ---------------------------------------------------------------------------
// Single message bubble
// ---------------------------------------------------------------------------
const MessageBubble: React.FC<{ msg: Message }> = ({ msg }) => {
    const isUser = msg.role === 'user';
    return (
        <div className={cn('flex gap-2 items-end', isUser ? 'flex-row-reverse' : 'flex-row')}>
            {/* Avatar */}
            {!isUser && (
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-rhive-pink/20 border border-rhive-pink/40 flex items-center justify-center shadow-[0_0_6px_rgba(236,2,139,0.3)]">
                    <Sparkles size={10} className="text-rhive-pink" />
                </div>
            )}

            {/* Bubble */}
            <div
                className={cn(
                    'max-w-[80%] px-3 py-2.5 text-[12px] leading-relaxed',
                    isUser
                        ? 'bg-rhive-pink/20 border border-rhive-pink/40 text-white rounded-tl-xl rounded-tr-sm rounded-bl-xl rounded-br-xl'
                        : 'bg-white/5 border border-white/10 text-gray-200 rounded-tl-sm rounded-tr-xl rounded-bl-xl rounded-br-xl'
                )}
                style={{
                    clipPath: isUser
                        ? 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)'
                        : 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
                }}
            >
                {isUser ? (
                    <span>{msg.text}</span>
                ) : (
                    <div>
                        {renderText(msg.text)}
                        {msg.streaming && (
                            <span className="inline-block w-1.5 h-3.5 bg-rhive-pink ml-0.5 animate-pulse rounded-sm" />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

// ---------------------------------------------------------------------------
// Main Chat Panel
// ---------------------------------------------------------------------------
const AIChatPanel: React.FC<AIChatPanelProps> = ({ isOpen, onClose }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [showScrollBtn, setShowScrollBtn] = useState(false);

    // Drag state
    const [pos, setPos] = useState({ x: 0, y: 0 });
    const [dragging, setDragging] = useState(false);
    const dragStart = useRef({ mx: 0, my: 0, px: 0, py: 0 });
    const panelRef = useRef<HTMLDivElement>(null);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // ---------------------------------------------------------------------------
    // Initial position — bottom-right with some margin
    // ---------------------------------------------------------------------------
    useEffect(() => {
        if (isOpen && pos.x === 0 && pos.y === 0) {
            setPos({
                x: window.innerWidth - 400 - 24,
                y: window.innerHeight - 560 - 24,
            });
        }
    }, [isOpen]);

    // Auto-scroll to bottom
    const scrollToBottom = useCallback((smooth = true) => {
        messagesEndRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, scrollToBottom]);

    // Track scroll position for "scroll to bottom" button
    const handleScroll = () => {
        const el = scrollContainerRef.current;
        if (!el) return;
        const distFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
        setShowScrollBtn(distFromBottom > 80);
    };

    // Focus input when opened
    useEffect(() => {
        if (isOpen && !isMinimized) {
            setTimeout(() => inputRef.current?.focus(), 120);
        }
    }, [isOpen, isMinimized]);

    // ---------------------------------------------------------------------------
    // Drag handlers
    // ---------------------------------------------------------------------------
    const onMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        setDragging(true);
        dragStart.current = { mx: e.clientX, my: e.clientY, px: pos.x, py: pos.y };
    };

    useEffect(() => {
        if (!dragging) return;
        const onMove = (e: MouseEvent) => {
            const dx = e.clientX - dragStart.current.mx;
            const dy = e.clientY - dragStart.current.my;
            setPos({
                x: Math.max(0, Math.min(window.innerWidth - 380, dragStart.current.px + dx)),
                y: Math.max(48, Math.min(window.innerHeight - 60, dragStart.current.py + dy)),
            });
        };
        const onUp = () => setDragging(false);
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onUp);
        return () => {
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseup', onUp);
        };
    }, [dragging]);

    // ---------------------------------------------------------------------------
    // Send message
    // ---------------------------------------------------------------------------
    const sendMessage = useCallback(async (text: string) => {
        const trimmed = text.trim();
        if (!trimmed || isLoading) return;

        setInput('');
        setIsMinimized(false);

        const userMsg: Message = {
            id: `u-${Date.now()}`,
            role: 'user',
            text: trimmed,
        };

        const aiMsgId = `a-${Date.now()}`;
        const aiMsg: Message = {
            id: aiMsgId,
            role: 'model',
            text: '',
            streaming: true,
        };

        setMessages(prev => [...prev, userMsg, aiMsg]);
        setIsLoading(true);

        // Build history for the API (all turns before current)
        const history: ChatMessage[] = messages.map(m => ({
            role: m.role,
            text: m.text,
        }));

        if (!isAIConfigured) {
            await new Promise(r => setTimeout(r, 600));
            setMessages(prev => prev.map(m =>
                m.id === aiMsgId
                    ? {
                        ...m,
                        text: '⚠️ **AI not configured.** Please add `VITE_GEMINI_API_KEY` to your `.env` file and restart the dev server.\n\nGet a free key at [aistudio.google.com](https://aistudio.google.com).',
                        streaming: false,
                    }
                    : m
            ));
            setIsLoading(false);
            return;
        }

        try {
            let accumulated = '';
            for await (const chunk of streamChat(history, trimmed)) {
                accumulated += chunk;
                const finalText = accumulated;
                setMessages(prev => prev.map(m =>
                    m.id === aiMsgId ? { ...m, text: finalText, streaming: true } : m
                ));
            }
            setMessages(prev => prev.map(m =>
                m.id === aiMsgId ? { ...m, streaming: false } : m
            ));
        } catch (err: any) {
            setMessages(prev => prev.map(m =>
                m.id === aiMsgId
                    ? { ...m, text: `❌ Error: ${err?.message || 'Failed to get a response.'}`, streaming: false }
                    : m
            ));
        } finally {
            setIsLoading(false);
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [messages, isLoading]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage(input);
        }
    };

    const handleReset = () => {
        setMessages([]);
        setInput('');
        setTimeout(() => inputRef.current?.focus(), 100);
    };

    if (!isOpen) return null;

    const panelHeight = isMinimized ? 52 : 520;

    return (
        <>
            {/* Subtle backdrop tint — does NOT block page interaction */}
            <div
                className="fixed inset-0 z-[1998] pointer-events-none"
                style={{ background: 'rgba(0,0,0,0.08)' }}
            />

            {/* Panel */}
            <div
                ref={panelRef}
                className="fixed z-[1999] flex flex-col shadow-2xl"
                style={{
                    left: pos.x,
                    top: pos.y,
                    width: 380,
                    height: panelHeight,
                    transition: 'height 0.25s cubic-bezier(0.4,0,0.2,1)',
                    clipPath: 'polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)',
                    userSelect: dragging ? 'none' : 'auto',
                }}
            >
                {/* ── Border frame ── */}
                <div className="absolute inset-0 bg-[#0a0a0a] border border-gray-800" style={{ clipPath: 'inherit' }} />

                {/* Top pink accent line */}
                <div className="absolute top-0 left-4 right-0 h-[1px] bg-gradient-to-r from-rhive-pink via-rhive-pink/60 to-transparent z-10" />

                {/* TL chamfer pink accent */}
                <svg className="absolute top-0 left-0 z-10 w-5 h-5 overflow-visible pointer-events-none">
                    <line x1="0" y1="16" x2="16" y2="0" stroke="#ec028b" strokeWidth="1.5" />
                </svg>
                {/* BR chamfer gray */}
                <svg className="absolute bottom-0 right-0 z-10 w-5 h-5 overflow-visible pointer-events-none">
                    <line x1="0" y1="16" x2="16" y2="0" stroke="#374151" strokeWidth="1" />
                </svg>

                {/* ── Drag handle / Header ── */}
                <div
                    onMouseDown={onMouseDown}
                    className="relative z-20 flex items-center justify-between px-4 h-[52px] flex-shrink-0 border-b border-gray-800/80 cursor-grab active:cursor-grabbing select-none"
                    style={{ background: 'linear-gradient(135deg, rgba(236,2,139,0.08) 0%, rgba(0,0,0,0) 60%)' }}
                >
                    <div className="flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded-full bg-rhive-pink/15 border border-rhive-pink/40 flex items-center justify-center shadow-[0_0_8px_rgba(236,2,139,0.35)]">
                            <Sparkles size={11} className="text-rhive-pink" />
                        </div>
                        <div>
                            <div className="text-[11px] font-black text-white uppercase tracking-widest leading-none">ARIA</div>
                            <div className="text-[8px] font-mono text-rhive-pink/80 uppercase tracking-wider mt-0.5">
                                {isLoading ? 'Generating...' : 'RHIVE AI Assistant'}
                            </div>
                        </div>
                        {isLoading && (
                            <div className="flex gap-0.5 ml-1">
                                {[0, 1, 2].map(i => (
                                    <div
                                        key={i}
                                        className="w-1 h-1 rounded-full bg-rhive-pink animate-bounce"
                                        style={{ animationDelay: `${i * 0.15}s` }}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-1">
                        {messages.length > 0 && (
                            <button
                                onClick={handleReset}
                                onMouseDown={e => e.stopPropagation()}
                                className="p-1.5 text-gray-500 hover:text-gray-300 hover:bg-white/5 rounded transition-all"
                                title="Clear conversation"
                            >
                                <RotateCcw size={12} />
                            </button>
                        )}
                        <button
                            onClick={() => setIsMinimized(m => !m)}
                            onMouseDown={e => e.stopPropagation()}
                            className="p-1.5 text-gray-500 hover:text-gray-300 hover:bg-white/5 rounded transition-all"
                            title={isMinimized ? 'Expand' : 'Minimize'}
                        >
                            {isMinimized ? <ChevronDown size={13} /> : <Minimize2 size={13} />}
                        </button>
                        <button
                            onClick={onClose}
                            onMouseDown={e => e.stopPropagation()}
                            className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-950/20 rounded transition-all"
                            title="Close"
                        >
                            <X size={13} />
                        </button>
                    </div>
                </div>

                {/* ── Body (hidden when minimized) ── */}
                {!isMinimized && (
                    <div className="relative z-20 flex flex-col flex-1 overflow-hidden">
                        {/* Messages area */}
                        <div
                            ref={scrollContainerRef}
                            onScroll={handleScroll}
                            className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scrollbar-thin"
                            style={{ scrollbarWidth: 'none' }}
                        >
                            {/* Welcome state */}
                            {messages.length === 0 && (
                                <div className="flex flex-col items-center justify-center h-full pt-6 pb-2 gap-4 text-center">
                                    <div className="w-14 h-14 rounded-full bg-rhive-pink/10 border border-rhive-pink/30 flex items-center justify-center shadow-[0_0_20px_rgba(236,2,139,0.2)]">
                                        <Sparkles size={22} className="text-rhive-pink" />
                                    </div>
                                    <div>
                                        <div className="text-white font-black text-sm uppercase tracking-wider">ARIA</div>
                                        <div className="text-gray-400 text-[11px] mt-1 max-w-[240px] leading-relaxed">
                                            RHIVE Operations AI. Ask me about projects, quotes, scheduling, materials, or roofing.
                                        </div>
                                    </div>

                                    {/* Starter prompts */}
                                    <div className="w-full grid grid-cols-1 gap-1.5 mt-1">
                                        {STARTER_PROMPTS.map((prompt, i) => (
                                            <button
                                                key={i}
                                                onClick={() => sendMessage(prompt)}
                                                className="text-left px-3 py-2 bg-white/3 border border-white/8 hover:border-rhive-pink/40 hover:bg-rhive-pink/5 rounded-lg text-[10px] text-gray-400 hover:text-gray-200 transition-all font-medium"
                                                style={{ clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)' }}
                                            >
                                                {prompt}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Message list */}
                            {messages.map(msg => (
                                <MessageBubble key={msg.id} msg={msg} />
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Scroll to bottom button */}
                        {showScrollBtn && (
                            <button
                                onClick={() => scrollToBottom()}
                                className="absolute bottom-[68px] right-3 w-7 h-7 rounded-full bg-rhive-pink/20 border border-rhive-pink/40 flex items-center justify-center text-rhive-pink hover:bg-rhive-pink/30 transition-all shadow-lg z-10"
                            >
                                <ChevronDown size={13} />
                            </button>
                        )}

                        {/* ── Input area ── */}
                        <div className="flex-shrink-0 border-t border-gray-800/80 p-3">
                            <div
                                className="flex items-end gap-2 bg-black/50 border border-gray-700/60 focus-within:border-rhive-pink/50 transition-all p-2"
                                style={{ clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)' }}
                            >
                                <textarea
                                    ref={inputRef}
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    disabled={isLoading}
                                    placeholder="Ask ARIA anything..."
                                    rows={1}
                                    className="flex-1 bg-transparent text-white text-[12px] placeholder-gray-600 outline-none resize-none leading-relaxed max-h-24 overflow-y-auto"
                                    style={{
                                        height: 'auto',
                                        minHeight: '20px',
                                    }}
                                    onInput={e => {
                                        const t = e.currentTarget;
                                        t.style.height = 'auto';
                                        t.style.height = `${Math.min(t.scrollHeight, 96)}px`;
                                    }}
                                />
                                <button
                                    onClick={() => sendMessage(input)}
                                    disabled={!input.trim() || isLoading}
                                    className={cn(
                                        'flex-shrink-0 w-7 h-7 flex items-center justify-center transition-all rounded',
                                        input.trim() && !isLoading
                                            ? 'bg-rhive-pink text-white shadow-[0_0_10px_rgba(236,2,139,0.4)] hover:shadow-[0_0_15px_rgba(236,2,139,0.6)]'
                                            : 'bg-gray-800 text-gray-600 cursor-not-allowed'
                                    )}
                                >
                                    <Send size={12} />
                                </button>
                            </div>
                            <div className="flex justify-between items-center mt-1.5 px-0.5">
                                <span className="text-[8px] font-mono text-gray-700 uppercase tracking-wider">Enter to send · Shift+Enter newline</span>
                                <span className="text-[8px] font-mono text-rhive-pink/50 uppercase tracking-wider">Gemini 3.5 Flash</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default AIChatPanel;
