import React from 'react';
import PageContainer from '../components/PageContainer';
import FinancingCalculator from '../components/FinancingCalculator';
import PlexusShape from '../components/PlexusShape';
import { ArrowRightIcon } from '../components/icons';
import ContextualCTA from '../components/ContextualCTA';
import GlobalBottomCTA from '../components/GlobalBottomCTA';

const FinancingPage: React.FC = () => {
    return (
        <PageContainer
            title="Flexible Financing Options"
            description="Turn your home improvement dreams into reality with RHIVE Construction's flexible financing, brought to you by Enhancify."
        >
            {/* Ambient Background Layer */}
            <div className="fixed inset-0 z-[-1] pointer-events-none opacity-20">
                <PlexusShape 
                    backgroundColor="#000000" 
                    dotColor="#ec028b" 
                    lineColor="236, 2, 139" 
                    density={20} 
                />
            </div>

            <div className="max-w-5xl mx-auto px-4 py-12">
                <div className="text-center mb-16">
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <div className="w-4 h-[2px] bg-rhive-blue"></div>
                        <span className="font-mono text-base font-bold uppercase tracking-[0.4em] bg-gradient-to-t from-rhive-blue to-white bg-clip-text text-transparent">
                            Capital Resources
                        </span>
                        <div className="w-4 h-[2px] bg-rhive-blue"></div>
                    </div>
                    
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tighter mb-8 font-sans text-balance">
                        Flexible Financing with <span className="bg-gradient-to-t from-rhive-blue to-white bg-clip-text text-transparent">RHIVE Construction</span>,<br/> brought to you by Enhancify
                    </h2>
                    
                    <p className="text-gray-400 leading-relaxed font-serif text-xl italic max-w-3xl mx-auto text-balance">
                        Turn your home improvement dreams into reality with RHIVE Construction's flexible financing options. Whether you're considering a roof replacement or upgrading your property, we're here to support your goals. Benefit from transparent terms and competitive rates, making it easier than ever to invest in your home's future.
                    </p>
                    <p className="text-gray-500 mt-4 font-serif text-lg italic max-w-3xl mx-auto text-balance">
                        Explore your options today and start building with confidence alongside RHIVE Construction, brought to you by Enhancify at <a href="http://www.enhancify.com/rhive" className="text-rhive-blue hover:text-white transition-colors">www.enhancify.com/rhive</a>.
                    </p>
                </div>

                {/* The Tech-Noir Calculator Widget */}
                <div className="mb-20">
                    <FinancingCalculator />
                </div>

                {/* Contextual CTA */}
                <ContextualCTA 
                    message="Let's get your project funded." 
                    buttonText="Apply for Financing Now" 
                />

                {/* Global CTA */}
                <GlobalBottomCTA />
            </div>
        </PageContainer>
    );
};

export default FinancingPage;
