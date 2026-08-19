import React, { useEffect, useState } from 'react';
import { Phone, Shield, ArrowRight, CheckCircle2, Zap } from 'lucide-react';
import { cn } from '../lib/utils';

interface AccordionItemProps {
    question: string;
    answer: string;
    isOpen: boolean;
    onToggle: () => void;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ question, answer, isOpen, onToggle }) => {
    return (
        <div className={cn(
            "border rounded-xl overflow-hidden transition-all duration-300 bg-white/5",
            isOpen ? "border-rhive-pink shadow-[0_0_15px_rgba(236,2,139,0.3)]" : "border-white/10"
        )}>
            <button
                onClick={onToggle}
                className="w-full text-left p-6 flex justify-between items-center hover:bg-white/[0.02] transition-colors cursor-pointer"
            >
                <h3 className="text-base font-bold text-white tracking-tight leading-[1.2]">{question}</h3>
                <span className={cn("text-rhive-pink text-xs transition-transform duration-300", isOpen && "rotate-180")}>▼</span>
            </button>
            <div className={cn(
                "transition-all duration-300 overflow-hidden",
                isOpen ? "max-h-[500px]" : "max-h-0"
            )}>
                <div className="p-6 pt-0 text-base text-gray-300 font-serif leading-relaxed border-t border-white/5 max-w-[65ch]">
                    {answer}
                </div>
            </div>
        </div>
    );
};

export default function FaqHubPage() {
    useEffect(() => {
        document.title = "Utah Roofing FAQs & Expert Guides | RHIVE Construction";
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
            metaDesc = document.createElement('meta');
            metaDesc.setAttribute('name', 'description');
            document.head.appendChild(metaDesc);
        }
        metaDesc.setAttribute('content', "Have questions about roof replacements, local Utah building codes, warranties, or financing? Get honest, transparent answers from RHIVE's expert team.");
    }, []);

    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const handleToggle = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const handleEstimateClick = () => {
        window.location.href = '/estimate-tool';
    };

    const handleBlogClick = (path: string) => {
        window.location.href = path;
    };

    const section1Faqs = [
        {
            question: "How do I get started with a roof replacement?",
            answer: "Connect with us to secure your free, certified quote. We’ll guide you from a detailed, high-resolution aerial inspection through the final installation, ensuring clear communication, automatic digital status updates, and total confidence in your project timeline."
        },
        {
            question: "What warranties are actually available for new roofs?",
            answer: "Many contractors claim 'lifetime' coverage but hide fine-print limitations, offer only short-term 2-year workmanship warranties, or use off-brand 'mix-and-match' materials that completely void manufacturer coverage. At RHIVE, we use only unified, manufacturer-certified components. Every complete replacement is registered automatically to unlock premium manufacturer-backed warranties (like the Owens Corning Preferred Protection or GAF System Plus®) at no extra cost. Plus, we back our craftsmanship with our own direct Lifetime No-Leak Workmanship Guarantee—if we installed it and it leaks, we'll fix it for free, for life."
        },
        {
            question: "Can a new roof lower my homeowner's insurance premium?",
            answer: "Yes. Many insurance carriers in Utah offer substantial long-term premium discounts if your new roof is built with impact-resistant materials. If you upgrade to our O.C. Duration FLEX® or GAF Woodland® systems, which feature Class 4 Impact (Hail) Ratings, we will provide you with a formal Certificate of Compliance to submit directly to your insurance agent."
        }
    ];

    const section2Faqs = [
        {
            question: "Can we perform a localized repair instead of a full replacement?",
            answer: "Yes, if the core structural deck is dry and the damage is isolated. If your roof is suffering from a localized breach (such as minor storm wind blow-offs or a single failed pipe boot flashing), we can execute a surgical shingle repair or pipe flashing replacement to restore the water-shedding boundary. However, if the asphalt shingles are dry-rotted, losing critical protective granules, or the ventilation is failing, a full replacement is required to safeguard your home's equity."
        },
        {
            question: "Can a new roof improve my home's energy efficiency?",
            answer: "Absolutely. Properly installed systems utilizing cool-roof rated shingles or reflective single-ply membranes (TPO/PVC) actively deflect solar heat. When paired with a balanced exhaust and soffit intake ventilation system that regulates attic heat, you can significantly reduce your household HVAC cooling bills during punishing Utah summers."
        },
        {
            question: "What is the importance of proper attic insulation in relation to my roof?",
            answer: "Proper attic insulation is crucial for a healthy roof. Good insulation prevents warm indoor air from leaking into the attic during winter. If warm air escape is unchecked, it melts roof snow from underneath, causing water to run down to the cold eave lines where it freezes into destructive ice dams that backup under your shingles and tear gutters off. Balanced ventilation and insulation keep your attic temperature near ambient outdoor conditions."
        }
    ];

    return (
        <div className="min-h-screen bg-black text-white relative overflow-hidden font-sans">
            {/* Dark gradient blur effects */}
            <div className="absolute top-1/4 left-1/3 -translate-x-1/2 w-[500px] h-[500px] bg-rhive-pink/10 blur-[120px] rounded-full pointer-events-none" />

            {/* Hero Section */}
            <section className="relative z-10 pt-20 pb-20 px-6 max-w-5xl mx-auto text-center">
                <div className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-3 block">
                    EDUCATED CONSUMERS FINISH ON TOP | UT DESIGN STANDARDS
                </div>
                <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-6">
                    Roofing Intelligence: Utah's<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-rhive-pink">
                        Most Transparent FAQ Hub
                    </span>
                </h1>
                <div className="text-xl md:text-2xl font-serif italic text-rhive-pink mb-8">
                    No Opaque Answers. No Sales Speak. Just Cold, Hard Roofing Data.
                </div>
                <p className="text-lg text-gray-300 max-w-[70ch] mx-auto mb-10 leading-relaxed font-serif">
                    At RHIVE Construction, we believe an educated homeowner is our best client. The roofing industry is notoriously opaque, filled with mismatched materials that void manufacturer warranties and workmanship policies that disappear when a leak actually happens. Below, we have compiled the absolute truth about roofing, local Utah building codes, energy efficiency, and warranties so you can make decisions with complete, data-driven confidence.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-6">
                    <button
                        onClick={handleEstimateClick}
                        className="bg-rhive-pink text-white font-bold text-base uppercase tracking-widest px-8 py-4 rounded-full shadow-[0_0_15px_rgba(236,2,139,0.4)] hover:shadow-[0_0_25px_rgba(236,2,139,0.7)] transition-all duration-300 hover:scale-105 cursor-pointer"
                    >
                        Get a Fast Roofing Estimate
                    </button>
                    <a
                        href="tel:4534176637"
                        className="flex items-center gap-2 border border-white/20 hover:border-rhive-pink/50 text-white font-bold text-base uppercase tracking-widest px-8 py-4 rounded-full bg-white/5 transition-all duration-300 hover:scale-105 cursor-pointer"
                    >
                        <Phone size={16} className="text-rhive-pink" />
                        Call Our Tech Office
                    </a>
                </div>
            </section>

            {/* Section 1: Core System & Warranty FAQs */}
            <section className="relative z-10 py-16 px-6 max-w-3xl mx-auto border-t border-white/10">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-black uppercase tracking-tight text-white">
                        Core System &amp; Warranty FAQs
                    </h2>
                    <div className="w-16 h-1 bg-rhive-pink mx-auto mt-4" />
                </div>
                <div className="space-y-4">
                    {section1Faqs.map((faq, index) => (
                        <AccordionItem
                            key={index}
                            question={faq.question}
                            answer={faq.answer}
                            isOpen={openIndex === index}
                            onToggle={() => handleToggle(index)}
                        />
                    ))}
                </div>
            </section>

            {/* Section 2: Installation, Materials & Energy FAQs */}
            <section className="relative z-10 py-16 px-6 max-w-3xl mx-auto border-t border-white/10">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-black uppercase tracking-tight text-white">
                        Installation, Materials &amp; Energy FAQs
                    </h2>
                    <div className="w-16 h-1 bg-rhive-pink mx-auto mt-4" />
                </div>
                <div className="space-y-4">
                    {section2Faqs.map((faq, index) => (
                        <AccordionItem
                            key={index + 10}
                            question={faq.question}
                            answer={faq.answer}
                            isOpen={openIndex === index + 10}
                            onToggle={() => handleToggle(index + 10)}
                        />
                    ))}
                </div>
            </section>

            {/* Section 3: Our Latest Wasatch Front Research & Guides */}
            <section className="relative z-10 py-16 px-6 max-w-5xl mx-auto border-t border-white/10">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-black uppercase tracking-tight text-white">
                        Our Latest Wasatch Front Research &amp; Guides
                    </h2>
                    <div className="w-16 h-1 bg-rhive-pink mx-auto mt-4" />
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Card 1 */}
                    <div className="p-8 bg-white/5 border border-white/10 rounded-2xl flex flex-col justify-between hover:border-rhive-pink/50 transition-all duration-300">
                        <div>
                            <h3 className="text-xl font-bold text-white mb-3">What is the Average Roof Replacement Cost in Utah?</h3>
                            <p className="text-gray-400 text-base font-serif leading-relaxed mb-6 max-w-[60ch]">
                                We peel back the curtain on regional contracting. Learn the exact pricing metrics behind materials, certified labor, municipal permits, and structural contingencies so you can compare bids with confidence.
                            </p>
                        </div>
                        <button
                            onClick={() => handleBlogClick('/blog/roof-replacement-cost-utah')}
                            className="w-full text-center py-3 border border-white/20 hover:border-rhive-pink text-base font-mono font-bold uppercase tracking-widest text-slate-300 hover:text-white rounded-lg hover:bg-rhive-pink/10 transition-all cursor-pointer"
                        >
                            Read the Price Guide
                        </button>
                    </div>

                    {/* Card 2 */}
                    <div className="p-8 bg-white/5 border border-white/10 rounded-2xl flex flex-col justify-between hover:border-rhive-pink/50 transition-all duration-300">
                        <div>
                            <h3 className="text-xl font-bold text-white mb-3">5 Critical Signs of Wasatch Roof Damage</h3>
                            <p className="text-gray-400 text-base font-serif leading-relaxed mb-6 max-w-[60ch]">
                                Curling shingles, attic condensation, and compromised chimney mortar can spell disaster under heavy winter snows. Learn what to inspect before the freeze-thaw cycle begins.
                            </p>
                        </div>
                        <button
                            onClick={() => handleBlogClick('/blog/signs-of-roof-damage')}
                            className="w-full text-center py-3 border border-white/20 hover:border-rhive-pink text-base font-mono font-bold uppercase tracking-widest text-slate-300 hover:text-white rounded-lg hover:bg-rhive-pink/10 transition-all cursor-pointer"
                        >
                            Read the Damage Guide
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}
