
import React, { useState } from 'react';
import PageContainer from '../components/PageContainer';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { ShieldCheckIcon, CloudArrowUpIcon, BuildingStorefrontIcon, ArrowRightIcon, Check } from '../components/icons';
import { cn } from '../lib/utils';

const ContractorSignupPage: React.FC = () => {
    const [step, setStep] = useState(1);
    const [dualAuth, setDualAuth] = useState({ phone: '', email: '' });

    const nextStep = () => setStep(s => s + 1);

    return (
        <PageContainer 
            title="Vendor Partnership Portal" 
            description="RHIVE Vetting & Onboarding - Join our nationwide network of elite crews."
        >
            <div className="max-w-2xl mx-auto py-8">
                {/* Progress Bar */}
                <div className="flex gap-2 mb-8">
                    {[1, 2, 3].map(s => (
                        <div 
                            key={s} 
                            className={cn(
                                "h-1 flex-1 rounded-full transition-all duration-500",
                                step >= s ? "bg-[#ec028b]" : "bg-gray-800"
                            )} 
                        />
                    ))}
                </div>

                {step === 1 && (
                    <Card className="p-8 animate-fade-in">
                        <div className="flex items-center gap-4 mb-6">
                            <ShieldCheckIcon className="w-8 h-8 text-[#ec028b]" />
                            <h3 className="text-xl font-bold text-white uppercase tracking-tight">Step 1: Identity Verification</h3>
                        </div>
                        <p className="text-gray-400 text-sm mb-8 leading-relaxed italic">
                            "Legitimate partnerships begin with security. Please verify your primary contact channels to unlock the partnership application."
                        </p>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Company Phone (SMS Enabled)</label>
                                <Input 
                                    placeholder="(801) 000-0000" 
                                    value={dualAuth.phone} 
                                    onChange={e => setDualAuth({...dualAuth, phone: e.target.value})} 
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Professional Email</label>
                                <Input 
                                    placeholder="vendor@company.com" 
                                    type="email"
                                    value={dualAuth.email} 
                                    onChange={e => setDualAuth({...dualAuth, email: e.target.value})} 
                                />
                            </div>
                            <Button className="w-full h-14" onClick={nextStep}>
                                Confirm & Continue
                                <ArrowRightIcon className="w-4 h-4 ml-3" />
                            </Button>
                        </div>
                    </Card>
                )}

                {step === 2 && (
                    <Card className="p-8 animate-fade-in">
                         <div className="flex items-center gap-4 mb-6">
                            <CloudArrowUpIcon className="w-8 h-8 text-[#ec028b]" />
                            <h3 className="text-xl font-bold text-white uppercase tracking-tight">Step 2: Legal Documentation</h3>
                        </div>
                        <p className="text-gray-400 text-sm mb-6">Upload high-resolution scans of the following required documents:</p>
                        
                        <div className="space-y-3 mb-8">
                            {['State Contractor License', 'Liability Insurance ($2M Min)', 'Workers Comp Policy', 'IRS W-9 Form'].map(doc => (
                                <div key={doc} className="group p-4 bg-gray-900/50 border border-gray-800 rounded-xl hover:border-[#ec028b]/50 transition-all cursor-pointer flex justify-between items-center">
                                    <span className="text-sm font-bold text-gray-300 group-hover:text-white">{doc}</span>
                                    <span className="text-[10px] bg-black px-2 py-1 rounded border border-gray-700 text-gray-500 uppercase tracking-widest">Select File</span>
                                </div>
                            ))}
                        </div>

                        <Button className="w-full h-14" onClick={nextStep}>
                            Submit Docs for Review
                            <ArrowRightIcon className="w-4 h-4 ml-3" />
                        </Button>
                    </Card>
                )}

                {step === 3 && (
                    <Card className="p-12 text-center animate-fade-in">
                        <div className="w-20 h-20 rounded-full bg-green-500/20 border border-green-500/50 flex items-center justify-center mx-auto mb-6">
                            <Check className="w-10 h-10 text-green-400" />
                        </div>
                        <h3 className="text-2xl font-black text-white uppercase tracking-widest mb-4">Application Pending</h3>
                        <p className="text-gray-400 text-sm leading-relaxed mb-8">
                            Your identity has been verified and documents uploaded. Our compliance team is now reviewing your online reviews, company history, and legal credentials.
                        </p>
                        <div className="p-4 bg-[#ec028b]/10 border border-[#ec028b]/30 rounded-xl text-[#ec028b] text-xs font-bold uppercase tracking-widest mb-8">
                            EST. REVIEW TIME: 48-72 HOURS
                        </div>
                        <Button variant="secondary" onClick={() => setStep(1)} className="w-full">
                            Return to Homepage
                        </Button>
                    </Card>
                )}
            </div>
        </PageContainer>
    );
};

export default ContractorSignupPage;
