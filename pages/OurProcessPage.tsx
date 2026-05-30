
import React from 'react';
import PageContainer from '../components/PageContainer';
import Card from '../components/Card';
import { Check, BoltIcon } from '../components/icons';
import { cn } from '../lib/utils';

const StageNode = ({ number, title, description, isLast }: any) => (
    <div className="flex gap-6 md:gap-10 items-start">
        <div className="flex flex-col items-center">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-black border-2 border-[#ec028b] flex items-center justify-center text-[#ec028b] font-black shadow-[0_0_15px_rgba(236,2,139,0.3)] z-10 shrink-0" style={{ clipPath: 'polygon(20% 0, 80% 0, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0 80%, 0 20%)' }}>
                {number}
            </div>
            {!isLast && <div className="w-0.5 h-24 md:h-20 bg-gradient-to-b from-[#ec028b] to-transparent -mt-2 opacity-50" />}
        </div>
        <div className="pt-1 pb-10">
            <h4 className="text-lg md:text-xl font-bold text-[var(--rhive-text)] uppercase tracking-tight mb-2 flex items-center font-display italic">
                {title}
                <BoltIcon className="w-4 h-4 ml-2 text-[#ec028b] opacity-50" />
            </h4>
            <p className="text-[var(--rhive-text-muted)] text-sm leading-relaxed max-w-xl font-serif italic">{description}</p>
        </div>
    </div>
);

const OurProcessPage: React.FC = () => {
    const stages = [
        { title: "DRONE SCAN", desc: "Digital intake & aerial assessment. We analyze your property's roof layout using high-resolution drone mapping before any work begins." },
        { title: "BALLPARK ESTIMATE", desc: "Instant visual estimate. Our technology uses spatial data to generate an initial price estimate for your project." },
        { title: "CERTIFIED QUOTE", desc: "Certified fixed-price proposal. Our team reviews every detail to provide a guaranteed contract price valid for 14 days." },
        { title: "SECURE SIGN-OFF", desc: "Digital contract agreement. Review and sign your project agreement online to activate your project portal." },
        { title: "SCHEDULING", desc: "Permits & project timeline. We secure local permits and lock in your delivery and construction dates." },
        { title: "PRE-CONSTRUCTION", desc: "Site preparation checklist. We coordinate with you to ensure property safety and zero disruptions on build day." },
        { title: "INSTALLATION", desc: "The build phase. Real-time updates and photo progress sent directly to your homeowner portal as we work." },
        { title: "QUALITY AUDIT", desc: "Detailed quality inspection. A thorough physical audit of your completed roof to guarantee it meets our standards." },
        { title: "FINAL REVIEW", desc: "Final walkthrough. Review of all work with you to ensure absolute satisfaction and sign off on completion." },
        { title: "WARRANTY HANDOVER", desc: "System handover. We deliver your Lifetime No-Leak Warranty certificate and your digital documentation archive." }
    ];

    return (
        <PageContainer
            title="The 10-Stage Journey"
            description="Experience a construction project defined by transparency, automation, and consistent communication."
        >
            <Card className="p-0 border-0">
                <div className="p-8 md:p-12">
                    <div className="mb-10 p-6 bg-[#ec028b]/5 border border-[#ec028b]/20 flex items-center gap-4" style={{ clipPath: 'polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)' }}>
                        <Check className="w-8 h-8 text-green-400 shrink-0" />
                        <div>
                            <h3 className="text-[var(--rhive-text)] font-bold uppercase tracking-widest text-sm font-display">Automated Transparency</h3>
                            <p className="text-[var(--rhive-text-muted)] text-xs mt-1 font-serif">Our system prevents "ghosting" by sending automated status alerts at every transition stage.</p>
                        </div>
                    </div>

                    <div className="flex flex-col">
                        {stages.map((s, i) => (
                            <StageNode key={i} number={i + 1} title={s.title} description={s.desc} isLast={i === stages.length - 1} />
                        ))}
                    </div>
                </div>
            </Card>

            <div className="mt-8 text-center pb-12">
                <p className="text-[var(--rhive-text-muted)] text-[10px] font-mono uppercase tracking-[0.4em] opacity-50">RHIVE QOS V.3.0 // PROCESS_ENGINE_ACTIVE</p>
            </div>
        </PageContainer>
    );
};

export default OurProcessPage;
