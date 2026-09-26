import React from 'react';
import PageContainer from '../components/PageContainer';
import { Card } from '../components/ui/card';
import { ShieldCheck, Lock, FileText, CheckCircle2 } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
    return (
        <PageContainer
            title="Privacy Policy & Terms of Service"
            description="Our strict commitment to customer privacy, data protection, and SMS communication standards."
        >
            <div className="max-w-4xl mx-auto space-y-8 text-left font-sans">
                
                {/* Executive Summary Card */}
                <Card className="p-6 md:p-8 bg-black/60 border border-slate-700/60 rounded-[18px]">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-[12px] bg-[#ec028b]/10 border border-[#ec028b]/40 flex items-center justify-center text-[#ec028b]">
                            <ShieldCheck size={22} />
                        </div>
                        <div>
                            <h2 className="text-xl font-mono font-bold text-white uppercase tracking-tight">Customer Privacy & Trust Guarantee</h2>
                            <p className="text-xs font-mono text-gray-400">Effective Date: January 1, 2026 &bull; Last Updated: September 2026</p>
                        </div>
                    </div>
                    <p className="text-sm text-gray-300 leading-relaxed">
                        At RHIVE Construction, your trust is paramount. This Privacy Policy details how we collect, use, and protect your information when you request roofing estimates, schedule inspections, or interact with our digital platforms and messaging systems.
                    </p>
                </Card>

                {/* TCR 10DLC Mandatory Mobile Non-Sharing Disclosure */}
                <Card className="p-6 md:p-8 bg-emerald-950/20 border-2 border-emerald-500/40 rounded-[18px]">
                    <div className="flex items-center gap-2 text-emerald-400 mb-3">
                        <Lock size={18} />
                        <h3 className="text-sm font-mono font-bold uppercase tracking-wider">SMS / Mobile Information Privacy Clause (TCR 10DLC Compliant)</h3>
                    </div>
                    <div className="p-4 bg-black/80 border border-emerald-500/20 rounded-[12px] text-xs text-emerald-200 font-mono leading-relaxed space-y-2">
                        <p className="font-bold text-white">
                            "No mobile information will be shared with third parties or affiliates for marketing or promotional purposes. All the above categories exclude text messaging originator opt-in data and consent; this information will not be shared with any third parties."
                        </p>
                        <p className="text-[11px] text-gray-300">
                            We will never sell, rent, or lease your phone number or text opt-in consent to any external marketers, lead brokers, or advertising networks.
                        </p>
                    </div>
                </Card>

                {/* SMS Communications Terms & Conditions */}
                <Card className="p-6 md:p-8 bg-black/60 border border-slate-700/60 rounded-[18px] space-y-4">
                    <div className="flex items-center gap-2 text-[#ec028b]">
                        <FileText size={18} />
                        <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-white">SMS Messaging Terms & Conditions</h3>
                    </div>
                    
                    <div className="space-y-3 text-xs text-gray-300 leading-relaxed">
                        <div>
                            <strong className="text-white">1. Program Description:</strong>
                            <p className="mt-0.5">
                                By providing your phone number on our website forms, you consent to receive SMS communications from RHIVE Construction regarding your roof estimate, drone mapping analysis, scheduling confirmation, project milestones, and warranty delivery.
                            </p>
                        </div>

                        <div>
                            <strong className="text-white">2. Message Frequency:</strong>
                            <p className="mt-0.5">
                                Message frequency varies based on your active project status (typically 2 to 5 messages per roofing project inquiry).
                            </p>
                        </div>

                        <div>
                            <strong className="text-white">3. Cost & Carrier Charges:</strong>
                            <p className="mt-0.5">
                                Message and data rates may apply depending on your cellular service plan. RHIVE Construction does not charge any additional fees for text messaging.
                            </p>
                        </div>

                        <div>
                            <strong className="text-white">4. Opt-Out & Cancellation:</strong>
                            <p className="mt-0.5">
                                You can cancel SMS notifications at any time. Simply reply <strong className="text-white font-mono">STOP</strong> to any message from us. After you send STOP, we will send an SMS to confirm that you have been unsubscribed, and no further messages will be sent unless re-initiated by you.
                            </p>
                        </div>

                        <div>
                            <strong className="text-white">5. Customer Support & Assistance:</strong>
                            <p className="mt-0.5">
                                For help with our messaging program, reply <strong className="text-white font-mono">HELP</strong>, or call/text us directly at <span className="font-mono text-[#ec028b] font-bold">(435) 417-6637</span>, or email <span className="text-white underline">Office@RhiveConstruction.com</span>.
                            </p>
                        </div>

                        <div>
                            <strong className="text-white">6. Consent Exclusivity:</strong>
                            <p className="mt-0.5">
                                Providing consent to receive SMS messages is not a condition of purchasing any roofing services or materials from RHIVE Construction.
                            </p>
                        </div>
                    </div>
                </Card>

                {/* General Information Collection */}
                <Card className="p-6 md:p-8 bg-black/60 border border-slate-700/60 rounded-[18px] space-y-4">
                    <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-white">General Information Collection & Usage</h3>
                    <p className="text-xs text-gray-300 leading-relaxed">
                        We collect personal information you voluntarily provide (name, property address, email, phone number) solely to inspect your roof, generate an Owens Corning Duration certified estimate, and coordinate construction crews on the Wasatch Front.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                        <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-[10px] flex items-center gap-2 text-xs text-gray-300">
                            <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                            <span>AES-256 Encryption</span>
                        </div>
                        <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-[10px] flex items-center gap-2 text-xs text-gray-300">
                            <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                            <span>Zero Data Reselling</span>
                        </div>
                        <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-[10px] flex items-center gap-2 text-xs text-gray-300">
                            <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                            <span>Direct Utah Operations</span>
                        </div>
                    </div>
                </Card>

            </div>
        </PageContainer>
    );
};

export default PrivacyPolicyPage;
