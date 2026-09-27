import React, { useState, useEffect } from 'react';
import { ShieldCheck, X } from 'lucide-react';

export const CookieConsentBanner: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('rhive_cookie_consent');
        if (!consent) {
            // Slight delay so it slides in smoothly
            const timer = setTimeout(() => setIsVisible(true), 800);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAcceptAll = () => {
        localStorage.setItem('rhive_cookie_consent', 'accepted_all');
        localStorage.setItem('rhive_sms_consent', 'true');
        setIsVisible(false);
    };

    const handleEssentialOnly = () => {
        localStorage.setItem('rhive_cookie_consent', 'essential_only');
        setIsVisible(false);
    };

    const handlePolicyClick = (pageId: string) => (e: React.MouseEvent) => {
        window.dispatchEvent(new CustomEvent('nav-page', { detail: pageId }));
    };

    const isLoginPage = typeof window !== 'undefined' && (
        window.location.pathname === '/login' ||
        window.location.search.includes('P-06') ||
        window.location.search.includes('page=P-06')
    );

    if (!isVisible || isLoginPage) return null;

    return (
        <aside
            aria-label="Cookie and Communications Consent"
            className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-xl z-[9999] bg-[#0A0E17]/95 backdrop-blur-md border-2 border-slate-700/60 rounded-[18px] p-5 shadow-[0_10px_40px_rgba(0,0,0,0.8)] text-white font-sans animate-fade-in"
        >
            <div className="flex items-start justify-between gap-3 mb-2.5">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-[10px] bg-pink-500/10 border border-[#ec028b]/40 flex items-center justify-center text-[#ec028b]">
                        <ShieldCheck size={18} />
                    </div>
                    <div>
                        <h4 className="text-xs font-mono font-black uppercase tracking-wider text-white">
                            Cookie & SMS Communications Notice
                        </h4>
                        <span className="text-[10px] font-mono text-emerald-400 font-bold">100% Privacy Protected</span>
                    </div>
                </div>
                <button
                    onClick={handleEssentialOnly}
                    className="text-gray-400 hover:text-white p-1 transition"
                    title="Dismiss"
                >
                    <X size={16} />
                </button>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed mb-3">
                RHIVE Construction uses cookies to personalize your experience and deliver real-time roofing estimate updates. By clicking <strong className="text-white">"Accept All"</strong>, you consent to our use of cookies and agree to our{' '}
                <a
                    href="/privacy"
                    onClick={handlePolicyClick('P-PRIVACY')}
                    className="text-[#ec028b] underline hover:text-white font-bold"
                >
                    Privacy Policy
                </a>{' '}
                and{' '}
                <a
                    href="/privacy"
                    onClick={handlePolicyClick('P-PRIVACY')}
                    className="text-[#ec028b] underline hover:text-white font-bold"
                >
                    Terms of Service
                </a>
                , including receiving service-related SMS notifications regarding your project (Msg & data rates may apply; Reply STOP to cancel).
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-2 pt-1 border-t border-slate-800">
                <button
                    onClick={handleAcceptAll}
                    className="w-full sm:w-auto flex-1 px-4 py-2 bg-[#ec028b] hover:bg-[#d0027b] text-white text-xs font-mono font-bold uppercase tracking-wider rounded-[10px] shadow-[0_0_15px_rgba(236,2,139,0.35)] transition"
                >
                    Accept All (Cookies & SMS)
                </button>
                <button
                    onClick={handleEssentialOnly}
                    className="w-full sm:w-auto px-4 py-2 bg-slate-800/80 hover:bg-slate-700 text-gray-300 text-xs font-mono font-bold uppercase tracking-wider rounded-[10px] transition"
                >
                    Essential Only
                </button>
            </div>
        </aside>
    );
};

export default CookieConsentBanner;
