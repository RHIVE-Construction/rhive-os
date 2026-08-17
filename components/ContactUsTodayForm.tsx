import React, { useState, useEffect, useRef } from 'react';
import { useGoogleMapsApi } from '../hooks/useGoogleMapsApi';
import { ctaLeadService } from '../lib/firebaseService';
import { Phone, Mail, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';

interface ContactUsTodayFormProps {
    concern?: string;
    onSuccess?: () => void;
    className?: string;
    showTitle?: boolean;
}

export const ContactUsTodayForm: React.FC<ContactUsTodayFormProps> = ({
    concern = 'General',
    onSuccess,
    className,
    showTitle = true,
}) => {
    const isApiReady = useGoogleMapsApi();
    const addressInputRef = useRef<HTMLInputElement>(null);
    const autocompleteRef = useRef<any>(null);

    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (!isApiReady || !addressInputRef.current || !window.google?.maps?.places) return;
        if (autocompleteRef.current) return;

        const autocomplete = new window.google.maps.places.Autocomplete(addressInputRef.current, {
            types: ['address'],
            fields: ['formatted_address'],
            componentRestrictions: { country: 'us' }
        });

        autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();
            if (place.formatted_address) {
                setAddress(place.formatted_address);
                if (addressInputRef.current) {
                    addressInputRef.current.value = place.formatted_address;
                }
            } else if (addressInputRef.current) {
                setAddress(addressInputRef.current.value);
            }
        });

        autocompleteRef.current = autocomplete;

        return () => {
            if (autocompleteRef.current) {
                window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
                autocompleteRef.current = null;
            }
        };
    }, [isApiReady]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const currentAddress = addressInputRef.current?.value || address;
        if (!currentAddress || !phone || !email) {
            setErrorMessage('All fields are required.');
            setStatus('error');
            return;
        }

        setStatus('submitting');
        setErrorMessage('');

        const result = await ctaLeadService.sendNotification(currentAddress, phone, email, concern);
        if (result.success) {
            setStatus('success');
            if (onSuccess) onSuccess();
        } else {
            setStatus('error');
            setErrorMessage(result.error || 'Failed to send contact notification.');
        }
    };

    return (
        <div className={cn("w-full max-w-4xl mx-auto bg-black/60 border border-white/10 rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(236,2,139,0.15)] flex flex-col md:grid md:grid-cols-12 p-6 md:p-8 gap-6 md:gap-8 relative isolate", className)}>
            {/* Top linear glow line */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-rhive-pink to-transparent z-10" />

            {/* Left section: Form (Option 1) */}
            <div className="md:col-span-7 flex flex-col justify-between">
                <div>
                    {showTitle && (
                        <div className="mb-6">
                            <span className="font-mono text-xs uppercase tracking-[0.2em] text-rhive-pink">// CONTACT INTAKE</span>
                            <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter mt-1 italic text-white">
                                Contact Us Today<span className="text-rhive-pink">.</span>
                            </h3>
                        </div>
                    )}

                    {status === 'success' ? (
                        <div className="flex flex-col items-center justify-center py-10 text-center space-y-4 animate-fade-in">
                            <div className="w-16 h-16 bg-rhive-pink/10 border border-rhive-pink rounded-full flex items-center justify-center text-rhive-pink shadow-pink-glow animate-pulse">
                                <CheckCircle2 size={36} />
                            </div>
                            <h4 className="text-xl font-bold text-white uppercase tracking-tight">VERIFIED</h4>
                            <p className="text-gray-300 text-sm max-w-md font-serif italic">
                                You can expect us to reach out to you shortly.
                            </p>
                            <button
                                onClick={() => {
                                    setAddress('');
                                    if (addressInputRef.current) {
                                        addressInputRef.current.value = '';
                                    }
                                    setPhone('');
                                    setEmail('');
                                    setStatus('idle');
                                }}
                                className="text-xs text-rhive-pink hover:text-white underline font-mono uppercase tracking-widest mt-4"
                            >
                                Submit another inquiry
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <p className="text-gray-400 text-xs uppercase tracking-wider mb-2 font-mono">
                                Please verify your address and contact information below, and we will contact you as soon as possible.
                            </p>

                            <div className="space-y-3">
                                <div>
                                    <input
                                        ref={addressInputRef}
                                        type="text"
                                        placeholder="ENTER PROJECT ADDRESS"
                                        defaultValue={address}
                                        className="w-full bg-black/80 border border-white/10 hover:border-white/20 focus:border-rhive-pink py-2.5 px-4 text-xs font-bold uppercase tracking-widest outline-none text-white transition-all duration-300"
                                        disabled={status === 'submitting'}
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <input
                                        type="tel"
                                        placeholder="PHONE NUMBER"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="w-full bg-black/80 border border-white/10 hover:border-white/20 focus:border-rhive-pink py-2.5 px-4 text-xs font-bold uppercase tracking-widest outline-none text-white transition-all duration-300"
                                        disabled={status === 'submitting'}
                                        required
                                    />
                                    <input
                                        type="email"
                                        placeholder="EMAIL ADDRESS"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-black/80 border border-white/10 hover:border-white/20 focus:border-rhive-pink py-2.5 px-4 text-xs font-bold uppercase tracking-widest outline-none text-white transition-all duration-300"
                                        disabled={status === 'submitting'}
                                        required
                                    />
                                </div>
                            </div>

                            {status === 'error' && (
                                <div className="flex items-center gap-2 text-red-500 text-xs font-bold uppercase tracking-wider p-3 bg-red-950/20 border border-red-500/20">
                                    <AlertTriangle size={14} className="shrink-0" />
                                    <span>{errorMessage}</span>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={status === 'submitting'}
                                className="w-full py-2.5 bg-rhive-pink text-white font-black uppercase text-xs tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-[0_0_15px_rgba(236,2,139,0.3)] flex items-center justify-center gap-2 cursor-pointer"
                                style={{ clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)' }}
                            >
                                {status === 'submitting' ? (
                                    <>
                                        <Loader2 size={14} className="animate-spin" />
                                        Submitting Info...
                                    </>
                                ) : (
                                    'VERIFY'
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </div>

            {/* Middle Divider */}
            <div className="hidden md:flex md:col-span-1 items-center justify-center relative">
                <div className="w-[1px] h-full bg-white/10 absolute left-1/2" />
                <span className="bg-black border border-white/10 px-3 py-1 text-[10px] font-mono uppercase tracking-widest rounded-full z-10 text-gray-500">OR</span>
            </div>
            <div className="flex md:hidden items-center justify-center py-2">
                <div className="w-full h-[1px] bg-white/10 relative" />
                <span className="bg-black border border-white/10 px-3 py-1 text-[9px] font-mono uppercase tracking-widest rounded-full absolute text-gray-500">OR</span>
            </div>

            {/* Right section: Direct contact (Option 2) */}
            <div className="md:col-span-4 flex flex-col justify-center space-y-6 text-left">
                <div>
                    <p className="text-gray-400 text-xs uppercase tracking-wider mb-3 font-mono">
                        CALL US TODAY
                    </p>
                    <p className="text-gray-300 text-xs font-serif italic mb-4 leading-relaxed">
                        Or by calling, texting, or emailing us at:
                    </p>
                    
                    <div className="space-y-4">
                        <a 
                            href="tel:4354176637" 
                            className="flex items-center gap-3 p-3 bg-white/[0.02] border border-white/5 hover:border-rhive-pink/30 hover:bg-white/[0.05] transition-all group"
                            style={{ clipPath: 'polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)' }}
                        >
                            <div className="text-rhive-pink bg-rhive-pink/10 p-2 group-hover:scale-110 transition-transform">
                                <Phone size={14} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[9px] font-mono text-gray-500 uppercase">Call / Text</span>
                                <span className="text-xs font-bold text-white tracking-wider whitespace-nowrap">(435) 417-6637</span>
                            </div>
                        </a>

                        <a 
                            href="mailto:Office@RhiveConstruction.com" 
                            className="flex items-center gap-3 p-3 bg-white/[0.02] border border-white/5 hover:border-rhive-pink/30 hover:bg-white/[0.05] transition-all group"
                            style={{ clipPath: 'polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)' }}
                        >
                            <div className="text-rhive-pink bg-rhive-pink/10 p-2 group-hover:scale-110 transition-transform">
                                <Mail size={14} />
                            </div>
                            <div className="flex flex-col overflow-hidden">
                                <span className="text-[9px] font-mono text-gray-500 uppercase">Email</span>
                                <span className="text-xs font-bold text-white tracking-wide whitespace-nowrap">Office@RhiveConstruction.com</span>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactUsTodayForm;
