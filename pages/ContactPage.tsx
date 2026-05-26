
import React, { useState, useEffect } from 'react';
import PageContainer from '../components/PageContainer';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { MapPinIcon, UserIcon, RhiveLogo, ShareIcon } from '../components/icons';
import { getMapsApiKey } from '../lib/mapsConfig';

const MAPS_API_KEY = (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY || '';

const ContactPage: React.FC = () => {
    const [mapsKey, setMapsKey] = useState('');

    useEffect(() => {
        getMapsApiKey().then(setMapsKey);
    }, []);

    return (
        <PageContainer 
            title="Get In Touch" 
            description="Direct access to leadership and our North Logan operations center."
        >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Contact Form */}
                <Card className="lg:col-span-2 p-8 md:p-12">
                    <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-8">Message Our Hive</h3>
                    <form className="space-y-6" onSubmit={e => e.preventDefault()}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Full Name</label>
                                <Input placeholder="John Doe" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Email Address</label>
                                <Input placeholder="john@example.com" type="email" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Subject</label>
                            <Input placeholder="Quote Inquiry, Partnership, etc." />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Message</label>
                            <textarea 
                                className="w-full h-32 bg-black/40 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-[#ec028b] focus:outline-none transition-all resize-none text-sm"
                                placeholder="How can we help your project finish on top?"
                            />
                        </div>
                        <Button size="lg" className="w-full md:w-auto px-12">
                            Send Secure Message
                        </Button>
                    </form>
                </Card>

                {/* Sidebar Info */}
                <div className="space-y-8">
                    <Card title="Direct Lines">
                        <div className="space-y-6 p-2">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center shrink-0">
                                    <UserIcon className="w-5 h-5 text-[#ec028b]" />
                                </div>
                                <div>
                                    <p className="text-white font-bold text-sm">Kara Robinson</p>
                                    <p className="text-[#ec028b] font-mono text-sm mt-1">801‑441‑0024</p>
                                    <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest mt-1">Founder / President</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center shrink-0">
                                    <UserIcon className="w-5 h-5 text-[#ec028b]" />
                                </div>
                                <div>
                                    <p className="text-white font-bold text-sm">Michael Robinson</p>
                                    <p className="text-[#ec028b] font-mono text-sm mt-1">801‑449‑1451</p>
                                    <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest mt-1">Founder / CEO</p>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card title="HQ Location">
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <MapPinIcon className="w-5 h-5 text-gray-500 shrink-0 mt-0.5" />
                                <p className="text-sm text-gray-400">
                                    525 Aspen Meadow Dr,<br />
                                    North Logan, UT 84341
                                </p>
                            </div>
                            <div className="h-48 bg-gray-900 rounded-xl overflow-hidden border border-gray-800 relative group">
                                {/* Map Placeholder */}
                                <img 
                                    src={mapsKey ? `https://maps.googleapis.com/maps/api/staticmap?center=41.7766,-111.8211&zoom=15&size=400x300&maptype=roadmap&markers=color:0xec028b%7C41.7766,-111.8211&key=${mapsKey}` : ''} 
                                    className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                                    alt="RHIVE HQ Map"
                                />
                                <div className="absolute inset-0 bg-[#ec028b]/5 pointer-events-none" />
                            </div>
                        </div>
                    </Card>

                    <Card title="Global Connect">
                        <div className="flex gap-4">
                            <button className="flex-1 p-4 bg-gray-900 rounded-xl border border-gray-800 hover:border-[#ec028b] transition-all flex flex-col items-center">
                                <ShareIcon className="w-6 h-6 text-gray-500 mb-2" />
                                <span className="text-[10px] text-white font-bold uppercase tracking-widest">Share HQ</span>
                            </button>
                            <button className="flex-1 p-4 bg-gray-900 rounded-xl border border-gray-800 hover:border-[#ec028b] transition-all flex flex-col items-center">
                                <RhiveLogo className="h-6 mb-2 opacity-50" />
                                <span className="text-[10px] text-white font-bold uppercase tracking-widest">Office Docs</span>
                            </button>
                        </div>
                    </Card>
                </div>
            </div>
        </PageContainer>
    );
};

export default ContactPage;
