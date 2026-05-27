import React, { useEffect } from "react";
import { useNavigation } from '../contexts/NavigationContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckSquare, Magnet, ShieldCheck, UserCheck, FileBadge, Calendar, ArrowLeft } from 'lucide-react';

const ScopePanel = ({ icon: Icon, title, children }: { icon: React.ElementType, title: string, children: React.ReactNode }) => (
    <Card className="bg-black/80 backdrop-blur-sm border-[var(--rhive-pink)]/20 shadow-[0_0_15px_rgba(236,2,139,0.1)] h-full">
        <CardHeader>
            <CardTitle className="flex items-center gap-3">
                <Icon className="h-6 w-6 text-[var(--rhive-pink)]" />
                <span className="text-white uppercase tracking-widest">{title}</span>
            </CardTitle>
        </CardHeader>
        <CardContent className="text-gray-400 text-base space-y-4 font-sans leading-relaxed">
            {children}
        </CardContent>
    </Card>
);

const LogoGrid = () => (
    <div className="grid grid-cols-3 gap-4 items-center justify-center mt-6">
        {[
            "https://static.wixstatic.com/media/c5862a_23d463b7c8f448408f65e219034f7b6b~mv2.png",
            "https://static.wixstatic.com/media/c5862a_83f3e827015049c693a388b1d960f25a~mv2.png",
            "https://static.wixstatic.com/media/c5862a_b5a3e143128b43b6b47a9d0092c7333d~mv2.png",
            "https://static.wixstatic.com/media/c5862a_5b501538392f44778d99c43a0e698889~mv2.png",
            "https://static.wixstatic.com/media/c5862a_49b5c2d338d1469b82c616d2509121a3~mv2.png",
            "https://static.wixstatic.com/media/c5862a_68612cd4e0634a36b567a145869a844b~mv2.png",
            "https://static.wixstatic.com/media/c5862a_b29845347101487189914717b070494b~mv2.png",
            "https://static.wixstatic.com/media/c5862a_4d09c2518eda41689b3f3a09e0750537~mv2.png",
            "https://static.wixstatic.com/media/c5862a_60c1d1d860164893a401b1c55452f303~mv2.png"
        ].map((src, index) => (
            <div key={index} className="flex justify-center items-center p-2 bg-white/5 border border-white/10 rounded-md hover:bg-white/10 transition-colors">
                 <img src={src} alt="Company Logo" className="object-contain w-full h-8 opacity-80 hover:opacity-100 transition-opacity" />
            </div>
        ))}
    </div>
);

export default function ScopeOfWorkPage() {
    const { setActivePageId } = useNavigation();
    
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    
    return (
        <div className="bg-[#050505] min-h-screen pt-24 pb-12 font-sans selection:bg-[var(--rhive-pink)] selection:text-white">
            <div className="max-w-7xl mx-auto px-6">
                
                {/* Back Navigation */}
                <button 
                    onClick={() => setActivePageId('P-02a')}
                    className="inline-flex items-center gap-2 text-gray-400 hover:text-[var(--rhive-pink)] transition-colors mb-8 group"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-bold uppercase tracking-widest text-sm">Return to Roofing Packages</span>
                </button>

                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--rhive-pink)]/10 border border-[var(--rhive-pink)]/30 mb-6">
                        <FileBadge className="w-4 h-4 text-[var(--rhive-pink)]" />
                        <span className="text-sm font-black uppercase tracking-widest text-[var(--rhive-pink)]">Project Protocol</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter text-white drop-shadow-[0_0_15px_rgba(236,2,139,0.3)] mb-6 font-display">
                        ROOFING PROJECT <span className="text-[var(--rhive-pink)]">SCOPE OF WORK</span>
                    </h1>
                    <p className="mt-4 max-w-2xl mx-auto text-gray-400 text-lg leading-relaxed">
                        An overview of our professional roof installation process, ensuring quality, safety, and peace of mind from start to finish.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Illustration */}
                    <div className="lg:col-span-3 order-1 mb-8">
                        <Card className="bg-black border border-[var(--rhive-pink)]/30 shadow-[0_0_30px_rgba(236,2,139,0.15)] overflow-hidden">
                            <CardHeader className="bg-[var(--rhive-pink)]/5 border-b border-[var(--rhive-pink)]/20 p-6">
                                <CardTitle className="text-white font-black uppercase tracking-widest text-xl">Process Documentation</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                 <div className="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden">
                                    <video
                                        src="https://video.wixstatic.com/video/c5862a_a0c91d0404bb49dba9fd9e46c749b638/720p/mp4/file.mp4"
                                        autoPlay
                                        muted
                                        loop
                                        playsInline
                                        className="w-full h-full object-cover"
                                    />
                                    {/* Scanline overlay for that tech aesthetic */}
                                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none z-10"></div>
                                 </div>
                            </CardContent>
                        </Card>
                    </div>
                    
                    <div className="space-y-8 order-2">
                        <ScopePanel icon={CheckSquare} title="The Process">
                            <p><strong className="text-white uppercase font-bold text-sm tracking-wider">Tear-Off:</strong><br/> We remove all existing roofing material down to the wood decking.</p>
                            <p><strong className="text-white uppercase font-bold text-sm tracking-wider">Decking Inspection:</strong><br/> We inspect all roof surface decking for certification.</p>
                            <p><strong className="text-white uppercase font-bold text-sm tracking-wider">Building Permit:</strong><br/> We provide complete permit management.</p>
                        </ScopePanel>

                        <ScopePanel icon={Magnet} title="Job Site Cleanliness">
                             <p><strong className="text-white uppercase font-bold text-sm tracking-wider">Total Debris Management:</strong><br/> The cost includes waste management and magnetic sweeps.</p>
                        </ScopePanel>
                    </div>

                    <div className="space-y-8 order-3">
                        <ScopePanel icon={ShieldCheck} title="Our Guarantees">
                            <p><strong className="text-white uppercase font-bold text-sm tracking-wider">Installation Warranty:</strong><br/> The RHive No-Leak Guarantee.</p>
                            <p><strong className="text-white uppercase font-bold text-sm tracking-wider">Manufacturer’s Warranty:</strong><br/> 50-Year Material | 15-Year Wind | 25-Year Algae.</p>
                            <div className="flex justify-center p-4 mt-6">
                                <img src="https://static.wixstatic.com/media/c5862a_0846d52fb4464e4c927cf9c7a1563047~mv2.png" alt="Warranty" className="w-[150px] h-[150px] object-contain drop-shadow-[0_0_15px_rgba(236,2,139,0.3)]" />
                            </div>
                        </ScopePanel>

                        <ScopePanel icon={UserCheck} title="Project Oversight">
                            <p><strong className="text-white uppercase font-bold text-sm tracking-wider">Project Manager:</strong><br/> Professional supervision and complete documentation.</p>
                        </ScopePanel>
                    </div>

                    <div className="space-y-8 order-4">
                        <ScopePanel icon={FileBadge} title="Protected & Certified">
                            <p><strong className="text-white uppercase font-bold text-sm tracking-wider">Liability Insurance:</strong><br/> $2M General Aggregate.</p>
                            <p><strong className="text-white uppercase font-bold text-sm tracking-wider">Workers' Compensation:</strong><br/> All workers are certified.</p>
                            <LogoGrid />
                        </ScopePanel>
                        
                        <ScopePanel icon={Calendar} title="Continued Service">
                            <p><strong className="text-white uppercase font-bold text-sm tracking-wider">Free Annual Inspections:</strong><br/> Complimentary yearly inspections upon request.</p>
                            <div className="flex justify-center p-4 mt-6">
                               <div className="w-24 h-24 border-2 border-[var(--rhive-pink)]/50 rounded-full flex items-center justify-center bg-[var(--rhive-pink)]/10 shadow-[0_0_20px_rgba(236,2,139,0.2)]">
                                    <ShieldCheck className="w-12 h-12 text-[var(--rhive-pink)]" />
                               </div>
                            </div>
                        </ScopePanel>
                    </div>
                </div>
            </div>
        </div>
    );
}
