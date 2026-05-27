
import React from 'react';
import PageContainer from '../components/PageContainer';
import Card from '../components/Card';
import { Check, BoltIcon, ShieldCheckIcon } from '../components/icons';
import { cn } from '../lib/utils';
import ContextualCTA from '../components/ContextualCTA';
import GlobalBottomCTA from '../components/GlobalBottomCTA';

const StageNode = ({ number, title, description, isLast }: any) => (
    <div className="flex gap-6 md:gap-10 items-start">
        <div className="flex flex-col items-center">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-black border-2 border-[#ec028b] flex items-center justify-center text-[#ec028b] font-black shadow-[0_0_15px_rgba(236,2,139,0.3)] z-10 shrink-0" style={{ clipPath: 'polygon(20% 0, 80% 0, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0 80%, 0 20%)' }}>
                {number}
            </div>
            {!isLast && <div className="w-0.5 h-24 md:h-20 bg-gradient-to-b from-[#ec028b] to-transparent -mt-2 opacity-50" />}
        </div>
        <div className="pt-1 pb-10">
            <h4 className="text-lg md:text-xl leading-tight font-bold text-[var(--rhive-text)] uppercase tracking-tight mb-2 flex items-center font-display italic">
                {title}
                <BoltIcon className="w-4 h-4 ml-2 text-[#ec028b] opacity-50" />
            </h4>
            <p className="text-[var(--rhive-text-muted)] text-base leading-relaxed max-w-prose font-serif italic">{description}</p>
        </div>
    </div>
);

const OurProcessPage: React.FC = () => {
    const stages = [
        { title: "LEAD", desc: "Digital intake & identification. We analyze your property's geometry via satellite data before we ever deploy a human." },
        { title: "ESTIMATE", desc: "Instant ballpark numbers. Our AI uses Google Solar data to generate a low-friction financial starting point." },
        { title: "QUOTE", desc: "Certified proposal. A human architect verifies every variable to provide a fixed-price packet valid for 14 days." },
        { title: "SIGN & VERIFY", desc: "Digital contract & 50% deposit. We generate your secure 'Ghost Link' and unlock the client portal." },
        { title: "SCHEDULE", desc: "Material & labor logistics. Permits are filed and the production queue is locked into our operational registry." },
        { title: "PRE-INSTALL", desc: "Site preparation & approvals. Final coordination with homeowners to ensure zero-friction deployment." },
        { title: "INSTALL", desc: "The build. Live photo feeds are streamed directly from your roof to your portal in real-time." },
        { title: "PUNCH LIST", desc: "Quality assurance. A multi-point structural audit ensures every detail exceeds our ineffable standard." },
        { title: "INVOICING", desc: "Final accounting. 10% payment trigger upon completion and verified client satisfaction." },
        { title: "COMPLETED", desc: "Asset handover. We deliver your Lifetime No-Leak Warranty and your Digital Property Vault." }
    ];

    return (
        <PageContainer
            title="The 10-Stage Journey"
            description="Experience a construction project defined by transparency, automation, and consistent communication."
        >
            {/* 1-2-3 Summary Graphic */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-black/40 border border-white/10 p-6 text-center">
                    <div className="text-4xl font-black text-[#ec028b] mb-4 font-display italic">1</div>
                    <h3 className="text-white font-bold uppercase tracking-widest mb-2">Assess</h3>
                    <p className="text-gray-400 text-sm">AI-powered mapping & instant quote.</p>
                </div>
                <div className="bg-black/40 border border-white/10 p-6 text-center">
                    <div className="text-4xl font-black bg-gradient-to-t from-rhive-blue to-white bg-clip-text text-transparent mb-4 font-display italic">2</div>
                    <h3 className="text-white font-bold uppercase tracking-widest mb-2">Approve</h3>
                    <p className="text-gray-400 text-sm">Fixed-cost transparent contracts.</p>
                </div>
                <div className="bg-black/40 border border-white/10 p-6 text-center">
                    <div className="text-4xl font-black text-rhive-gold mb-4 font-display italic">3</div>
                    <h3 className="text-white font-bold uppercase tracking-widest mb-2">Deploy</h3>
                    <p className="text-gray-400 text-sm">Certified swift installation.</p>
                </div>
            </div>

            {/* Trust Badge */}
            <div className="mb-12 flex justify-center">
                <div className="inline-flex items-center gap-4 px-6 py-3 bg-green-500/10 border border-green-500/30 rounded-full">
                    <ShieldCheckIcon className="w-6 h-6 text-green-500" />
                    <span className="text-green-400 font-bold uppercase tracking-widest text-sm">Licensed, Bonded, and Insured</span>
                </div>
            </div>

            <Card className="p-0 border-0">
                <div className="p-8 md:p-12">
                    <div className="mb-10 p-6 bg-[#ec028b]/5 border border-[#ec028b]/20 flex items-center gap-4" style={{ clipPath: 'polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)' }}>
                        <Check className="w-8 h-8 text-green-400 shrink-0" />
                        <div>
                            <h3 className="text-[var(--rhive-text)] font-bold uppercase tracking-widest text-base font-display leading-tight">Automated Transparency</h3>
                            <p className="text-[var(--rhive-text-muted)] text-base mt-1 font-serif leading-relaxed max-w-prose">Our system prevents "ghosting" by sending automated status alerts at every transition stage.</p>
                        </div>
                    </div>

                    <div className="flex flex-col">
                        {stages.map((s, i) => (
                            <StageNode key={i} number={i + 1} title={s.title} description={s.desc} isLast={i === stages.length - 1} />
                        ))}
                    </div>
                </div>
            </Card>

            {/* Contextual CTA */}
            <ContextualCTA 
                message="Ready for a stress-free installation?" 
                buttonText="Start the Process Today" 
            />

            {/* Global CTA */}
            <GlobalBottomCTA />
        </PageContainer>
    );
};

export default OurProcessPage;
