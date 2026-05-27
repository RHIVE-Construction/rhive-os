import React, { useState } from 'react';
import { Target, Building2, HardHat, CheckCircle2 } from 'lucide-react';

interface CapExDiagnosticLightboxProps {
    isOpen: boolean;
    onClose: () => void;
}

const CapExDiagnosticLightbox: React.FC<CapExDiagnosticLightboxProps> = ({ isOpen, onClose }) => {
    const [step, setStep] = useState(1);
    
    // Mock Form State
    const [formData, setFormData] = useState({
        propertyType: '',
        portfolioSize: '',
        contactName: '',
        companyName: '',
        email: '',
        phone: ''
    });

    if (!isOpen) return null;

    const handleNext = () => setStep(prev => prev + 1);
    const handleBack = () => setStep(prev => prev - 1);

    const isStep1Valid = formData.propertyType !== '' && formData.portfolioSize !== '';

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-8">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={onClose}></div>

            <div className="relative z-10 w-full max-w-4xl bg-[#050505] border border-white/10 shadow-2xl shadow-[var(--rhive-pink)]/10"
                style={{ clipPath: 'polygon(24px 0, 100% 0, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0 100%, 0 24px)' }}
            >
                {/* Header Phase */}
                <div className="p-8 border-b border-white/10 flex justify-between items-center bg-black/50">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <Target className="w-5 h-5 text-[var(--rhive-pink)]" />
                            <span className="text-[var(--rhive-pink)] font-mono text-base uppercase tracking-[0.3em]">Intelligence Division</span>
                        </div>
                        <h2 className="text-3xl font-black text-white uppercase tracking-tighter">
                            CAPEX DIAGNOSTIC <span className="text-gray-500">INTAKE</span>
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 border border-white/20 hover:border-[var(--rhive-pink)] hover:text-[var(--rhive-pink)] text-white flex items-center justify-center transition-colors bg-black"
                        style={{ clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)' }}
                    >
                        ✕
                    </button>
                </div>

                <div className="p-8 md:p-12 relative overflow-hidden">
                    {/* Background Grid */}
                    <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-repeat opacity-[0.03]"></div>

                    {step === 1 && (
                        <div className="relative z-10 animate-fade-in">
                            <h3 className="text-xl font-black text-white uppercase tracking-widest mb-8">1. Portfolio Parameters</h3>
                            
                            <div className="space-y-8">
                                <div>
                                    <label className="block text-gray-500 text-base font-bold uppercase tracking-widest mb-4">Primary Asset Classification</label>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {['Multi-Family / HOA', 'Industrial / Commercial', 'Government / Municipal'].map((type) => (
                                            <button
                                                key={type}
                                                onClick={() => setFormData({ ...formData, propertyType: type })}
                                                className={`p-4 border transition-all text-left ${formData.propertyType === type ? 'border-[var(--rhive-pink)] bg-[var(--rhive-pink)]/10 text-white' : 'border-white/10 text-gray-400 hover:border-white/30 hover:text-white'}`}
                                                style={{ clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)' }}
                                            >
                                                <Building2 className={`w-5 h-5 mb-3 ${formData.propertyType === type ? 'text-[var(--rhive-pink)]' : 'text-gray-600'}`} />
                                                <div className="font-bold text-base tracking-wide">{type}</div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-gray-500 text-base font-bold uppercase tracking-widest mb-4">Estimated Footprint (Sq Ft)</label>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {['< 50k', '50k - 250k', '250k - 1M', '1M+'].map((size) => (
                                            <button
                                                key={size}
                                                onClick={() => setFormData({ ...formData, portfolioSize: size })}
                                                className={`py-3 px-4 border text-center transition-all ${formData.portfolioSize === size ? 'border-[var(--rhive-pink)] bg-[var(--rhive-pink)]/10 text-white' : 'border-white/10 text-gray-400 hover:border-white/30 hover:text-white'}`}
                                            >
                                                <div className="font-mono font-bold text-base">{size}</div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mt-12 flex justify-end">
                                <button
                                    onClick={handleNext}
                                    disabled={!isStep1Valid}
                                    className={`px-8 py-4 font-black uppercase tracking-[0.2em] text-base transition-all ${isStep1Valid ? 'bg-[var(--rhive-pink)] text-white hover:bg-white hover:text-black' : 'bg-gray-800 text-gray-600 cursor-not-allowed'}`}
                                    style={{ clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)' }}
                                >
                                    Proceed to Credentials
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="relative z-10 animate-fade-in">
                            <h3 className="text-xl font-black text-white uppercase tracking-widest mb-8">2. Stakeholder Details</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <label className="block text-gray-500 text-base font-bold uppercase tracking-widest mb-2">Company / Organization</label>
                                    <input 
                                        type="text" 
                                        className="w-full bg-black/50 border border-white/10 text-white p-4 font-mono focus:border-[var(--rhive-pink)] focus:outline-none transition-colors"
                                        placeholder="e.g., Summit Management"
                                        value={formData.companyName}
                                        onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-500 text-base font-bold uppercase tracking-widest mb-2">Direct Contact Name</label>
                                    <input 
                                        type="text" 
                                        className="w-full bg-black/50 border border-white/10 text-white p-4 font-mono focus:border-[var(--rhive-pink)] focus:outline-none transition-colors"
                                        placeholder="John Doe"
                                        value={formData.contactName}
                                        onChange={(e) => setFormData({...formData, contactName: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-500 text-base font-bold uppercase tracking-widest mb-2">Corporate Email</label>
                                    <input 
                                        type="email" 
                                        className="w-full bg-black/50 border border-white/10 text-white p-4 font-mono focus:border-[var(--rhive-pink)] focus:outline-none transition-colors"
                                        placeholder="j.doe@summit.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-500 text-base font-bold uppercase tracking-widest mb-2">Direct Line</label>
                                    <input 
                                        type="tel" 
                                        className="w-full bg-black/50 border border-white/10 text-white p-4 font-mono focus:border-[var(--rhive-pink)] focus:outline-none transition-colors"
                                        placeholder="(555) 123-4567"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                    />
                                </div>
                            </div>
                            
                            <div className="mt-12 flex justify-between">
                                <button
                                    onClick={handleBack}
                                    className="px-8 py-4 bg-transparent border border-white/20 text-white font-black uppercase tracking-[0.2em] text-base hover:border-[var(--rhive-pink)] hover:text-[var(--rhive-pink)] transition-all"
                                    style={{ clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)' }}
                                >
                                    Back
                                </button>
                                <button
                                    onClick={handleNext}
                                    disabled={!formData.contactName || !formData.email}
                                    className={`px-8 py-4 font-black uppercase tracking-[0.2em] text-base transition-all ${formData.contactName && formData.email ? 'bg-[var(--rhive-pink)] text-white hover:bg-white hover:text-black' : 'bg-gray-800 text-gray-600 cursor-not-allowed'}`}
                                    style={{ clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)' }}
                                >
                                    Initialize Diagnostic
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="relative z-10 py-12 text-center animate-fade-in flex flex-col items-center">
                            <div className="w-24 h-24 bg-[var(--rhive-pink)]/10 border border-[var(--rhive-pink)]/30 rounded-full flex items-center justify-center mb-8 relative">
                                <div className="absolute inset-0 border border-[var(--rhive-pink)] rounded-full animate-ping opacity-20"></div>
                                <CheckCircle2 className="w-12 h-12 text-[var(--rhive-pink)]" />
                            </div>
                            <h3 className="text-4xl font-black text-white uppercase tracking-tighter mb-4">REQUEST SECURED</h3>
                            <p className="text-gray-400 font-serif mb-8 max-w-md mx-auto">
                                The intelligence request for <strong className="text-white">{formData.companyName}</strong> has been routed to our commercial division. A project engineer will contact you directly within 24 hours.
                            </p>
                            <button
                                onClick={onClose}
                                className="px-12 py-4 bg-white text-black font-black uppercase tracking-[0.2em] text-base shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] transition-all"
                                style={{ clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)' }}
                            >
                                CLOSE DASHBOARD
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CapExDiagnosticLightbox;
