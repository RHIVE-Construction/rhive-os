import React from 'react';
import { 
    HelpCircle, 
    ShieldCheck, 
    Zap, 
    DollarSign, 
    FileText, 
    Activity,
    AlertTriangle,
    UploadCloud,
    BookOpen,
    HeartHandshake,
    Sparkles,
    ArrowRight
} from 'lucide-react';
import { useNavigation } from '../contexts/NavigationContext';
import { CircuitryCard } from '../components/CircuitryCard';
import { Button } from '../components/ui/button';

const InsuranceFaqPage: React.FC = () => {
    const { setActivePageId } = useNavigation();

    return (
        <div className="bg-black text-white min-h-screen font-sans selection:bg-[var(--rhive-pink)] selection:text-white pt-24 pb-24">
            <div className="max-w-6xl mx-auto px-6 space-y-16">
                
                {/* Page Header */}
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rhive-pink/10 border border-rhive-pink/30 mb-2">
                        <ShieldCheck className="w-4 h-4 text-rhive-pink" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-rhive-pink">Advocacy & Transparency</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none text-white">
                        Insurance Advocacy &<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-rhive-pink to-rhive-pink/80 drop-shadow-[0_0_10px_rgba(236,2,139,0.3)]">Restoration FAQ</span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-gray-400 text-sm md:text-base tracking-widest uppercase font-black font-mono">
                        The Authoritative, Radical-Transparency Guide to Navigating Storm Claims
                    </p>
                    <div className="w-24 h-1 bg-gradient-to-r from-transparent via-rhive-pink to-transparent mx-auto mt-6" />
                </div>

                {/* FAQ Content Section */}
                <div className="max-w-4xl mx-auto space-y-8">
                    
                    {/* Why approach differently (Intro Card) */}
                    <CircuitryCard 
                        title="Why do we approach insurance differently from standard contractors?" 
                        icon={<HelpCircle className="w-5 h-5 text-rhive-pink" />}
                    >
                        <div className="space-y-4 text-gray-300 text-sm md:text-base leading-relaxed">
                            <p>
                                The traditional insurance restoration space is fundamentally broken. Homeowners are routinely left stranded in a low-trust crossfire between high-pressure "storm chasers" looking for a quick payout and insurance adjusters utilizing outdated software to undervalue legitimate structural damage.
                            </p>
                            <p className="font-bold text-white border-l-2 border-rhive-pink pl-3">
                                RHIVE is the absolute exception.
                            </p>
                            <p>
                                We do not play communication games, and we do not hide behind vague, lump-sum estimates. We founded RHIVE to enforce complete cost transparency in an industry built on administrative friction. When you navigate an insurance claim with us, our automated systems and specialized team leverage high-resolution aerial mapping, radar swath tracking, and meticulous on-site photo documentation to build an unassailable, itemized case. We lay bare the exact costs of materials, labor, and code-compliance elements to ensure your carrier fully funds a premium, manufacturer-certified roofing shield. We defend your capital so you can <strong className="text-white">Finish On Top.</strong>
                            </p>
                        </div>
                    </CircuitryCard>

                    {/* Question 1 */}
                    <CircuitryCard 
                        title="1. Will insurance cover my roof replacement?" 
                        icon={<ShieldCheck className="w-5 h-5 text-rhive-pink" />}
                    >
                        <div className="space-y-4 text-gray-300 text-sm md:text-base leading-relaxed">
                            <p className="font-bold text-white">
                                We do not control your insurance carrier's final coverage decisions, but we fully arm you with the unassailable data required to secure a fair settlement.
                            </p>
                            <p>
                                Our role is to serve as your premier structural advocate. To achieve this, our certified specialists execute a comprehensive, multi-point on-site inspection, capturing high-resolution evidence of storm-related compromise. We meticulously document every detail—from micro-fractures in your shingles to perimeter drip edge and flashing degradation. We then upload this entire structural data package directly to your <strong className="text-white">C-01 Client Portal</strong>. Furthermore, we physically attend your carrier’s adjuster inspection on your roof to ensure no overlooked damage is swept under the rug, giving you absolute confidence throughout the entire process.
                            </p>
                        </div>
                    </CircuitryCard>

                    {/* Question 2 */}
                    <CircuitryCard 
                        title="2. How do I know if my roof actually has storm damage?" 
                        icon={<Activity className="w-5 h-5 text-rhive-pink" />}
                    >
                        <div className="space-y-4 text-gray-300 text-sm md:text-base leading-relaxed">
                            <p className="font-bold text-white">
                                True storm damage is highly scientific and often completely invisible to the untrained eye.
                            </p>
                            <p>
                                Do not climb a ladder to self-diagnose your home. Our systems identify key indicators of severe weather compromise, including:
                            </p>
                            <ul className="space-y-3 pl-4 list-none">
                                <li className="flex items-start gap-2">
                                    <span className="text-rhive-pink font-bold mt-0.5">•</span>
                                    <span><strong className="text-white">Advanced Granule Loss & Shingle De-bonding:</strong> Hail impacts fracture the asphalt matrix, exposing the underlying fiberglass layer to accelerated UV degradation.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-rhive-pink font-bold mt-0.5">•</span>
                                    <span><strong className="text-white">Creased or Lifted Shingles:</strong> Wind uplift breaks the sealant strip, compromising the roof’s water-shedding integrity.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-rhive-pink font-bold mt-0.5">•</span>
                                    <span><strong className="text-white">Oxidation & Dents on Metal Components:</strong> Impact marks on soft metals (such as vents, valleys, and flashing).</span>
                                </li>
                            </ul>
                            <p>
                                Utah's extreme thermal shifts—where temperatures swing over 80°F in a single day—rapidly accelerate the decay of storm-compromised shingles. Roofs between <strong className="text-white">12 and 24 years old</strong> are prime candidates for storm-related insurance restoration. However, normal wear, aging, and neglect are strictly excluded from insurance coverage. This makes a certified <strong className="text-white">RHIVE Storm Inspection</strong> vital to verify your eligibility before you file an unnecessary claim.
                            </p>
                        </div>
                    </CircuitryCard>

                    {/* Question 3 */}
                    <CircuitryCard 
                        title="3. What is the exact payment schedule for an insurance claim?" 
                        icon={<DollarSign className="w-5 h-5 text-rhive-pink" />}
                    >
                        <div className="space-y-4 text-gray-300 text-sm md:text-base leading-relaxed">
                            <p>
                                We operate with absolute structural and financial discipline. To maintain project momentum, procure materials, and secure municipal building permits, all insurance restoration projects adhere strictly to our <strong className="text-white">Three-Step Insurance Investment Schedule</strong>:
                            </p>
                            <ol className="space-y-4 pl-4 list-decimal">
                                <li className="pl-2">
                                    <strong className="text-white">THE INITIAL INVESTMENT (ACV + DEDUCTIBLE):</strong> Prior to permitting and project approval, you must submit your insurance carrier's initial <strong className="text-white">Actual Cash Value (ACV) check</strong> along with your <strong className="text-white">deductible payment</strong> in full.
                                </li>
                                <li className="pl-2">
                                    <strong className="text-white">RELEASE OF SUPPLEMENTAL PROCEEDS:</strong> As the project progresses, any subsequent or supplemental funds released by your insurance carrier to address overlooked damage, code compliance, or material cost fluctuations must be forwarded directly to RHIVE immediately upon your receipt.
                                </li>
                                <li className="pl-2">
                                    <strong className="text-white">FINAL BALANCE SETTLEMENT:</strong> The final remaining balance is due exactly <strong className="text-white">two weeks</strong> after the insurance company has been billed with our certified final invoices and Certificate of Completion (COC) documentation. (You receive an additional 7-day grace period to settle the balance before standard delinquency penalties apply).
                                </li>
                            </ol>
                            <div className="p-3 bg-white/5 border border-white/10 rounded-sm mt-4">
                                <p className="text-xs text-gray-400 italic">
                                    Note: For minor structural repairs totaling $2,500 or less, full payment is required upfront to secure scheduling.
                                </p>
                            </div>
                        </div>
                    </CircuitryCard>

                    {/* Question 4 */}
                    <CircuitryCard 
                        title="4. What is the &quot;Direct Insurance Proceeds Clause&quot; and why is it required?" 
                        icon={<FileText className="w-5 h-5 text-rhive-pink" />}
                    >
                        <div className="space-y-4 text-gray-300 text-sm md:text-base leading-relaxed">
                            <p className="font-bold text-white">
                                This is your ultimate administrative shield against project delays and financial friction.
                            </p>
                            <p>
                                The first insurance check issued by your carrier frequently lists your mortgage company as a payee, requiring a multi-week administrative "chase" to have the funds endorsed and cleared. To bypass this drag and ensure your construction crew starts on schedule, our contract includes a <strong className="text-white">Direct Insurance Proceeds Authorization Clause</strong>.
                            </p>
                            <p>
                                By executing this clause, you direct your insurance carrier to issue all subsequent and final payments directly to RHIVE Construction as the sole payee. If your carrier fails to list RHIVE or delivers the funds to you instead, you are legally obligated to transfer those direct proceeds to us immediately upon receipt. This keeps your project running at high velocity, secures our material orders, and eliminates administrative overhead.
                            </p>
                        </div>
                    </CircuitryCard>

                    {/* Question 5 */}
                    <CircuitryCard 
                        title="5. My carrier issued a low-ball estimate. Can we &quot;mix and match&quot; cheap materials to fit their budget?" 
                        icon={<AlertTriangle className="w-5 h-5 text-rhive-pink" />}
                    >
                        <div className="space-y-4 text-gray-300 text-sm md:text-base leading-relaxed">
                            <p className="font-bold text-white">
                                Absolutely not. RHIVE strictly refuses to compromise on structural integrity or material standards.
                            </p>
                            <p>
                                Cheap, uncertified, or mismatched materials void premium manufacturer warranties and put your home at severe risk of catastrophic failure. Under the <strong className="text-white">RHIVE System Standard</strong>, our residential installations begin where others' upgrades end: we establish the premium <strong className="text-white">Owens Corning Duration Series</strong> as our absolute minimum baseline, completely banning low-grade three-tab or cheap builder-grade shingles.
                            </p>
                            <p>
                                We do not cut corners to meet an adjuster’s deflated estimate. Instead, our team submits highly detailed, software-backed <strong className="text-white">supplemental invoices</strong> to your carrier. We document the exact material requirements, local building codes, and manufacturer-mandated specifications to compel the carrier to adjust their payout to match real-world, certified construction costs.
                            </p>
                        </div>
                    </CircuitryCard>

                    {/* Question 6 */}
                    <CircuitryCard 
                        title="6. What happens if we encounter pre-existing damage or code compliance issues not covered by insurance?" 
                        icon={<AlertTriangle className="w-5 h-5 text-rhive-pink" />}
                    >
                        <div className="space-y-4 text-gray-300 text-sm md:text-base leading-relaxed">
                            <p className="font-bold text-white">
                                You remain fully protected, in control, and legally compliant at every stage.
                            </p>
                            <p>
                                When we tear off your old roofing layers down to the bare decking, we occasionally uncover hidden rot, deteriorated sheathing, or previous contractor shortcuts that do not meet current Utah building codes.
                            </p>
                            <p>
                                Under our <strong className="text-white">Wood Replacement & Compliance Protocol</strong>:
                            </p>
                            <ul className="space-y-3 pl-4 list-none">
                                <li className="flex items-start gap-2">
                                    <span className="text-rhive-pink font-bold mt-0.5">•</span>
                                    <span>We immediately document the unforeseen damage using certified photos and upload them to your <strong className="text-white">C-01 Client Portal</strong>.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-rhive-pink font-bold mt-0.5">•</span>
                                    <span>We submit a supplemental funding request directly to your insurance carrier to cover the extra costs of code compliance.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-rhive-pink font-bold mt-0.5">•</span>
                                    <span>In the event of an emergency where you are unreachable, RHIVE is authorized to execute necessary compliance work up to <strong className="text-white">5% of the total contract value</strong> to protect your home from active water intrusion and ensure minimum safety standards are met.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-rhive-pink font-bold mt-0.5">•</span>
                                    <span>As the property owner, you remain financially responsible for any pre-existing damage, deck rot, or code upgrades that your carrier ultimately refuses to cover. We provide complete, itemized documentation of these costs so you know exactly where your capital is deployed.</span>
                                </li>
                            </ul>
                        </div>
                    </CircuitryCard>

                </div>

                {/* Omni-Bird CTAs */}
                <div className="max-w-4xl mx-auto space-y-8 pt-8">
                    <div className="text-center space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rhive-gold/10 border border-rhive-gold/30">
                            <Sparkles className="w-3.5 h-3.5 text-rhive-gold" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-rhive-gold">Next Steps</span>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-white">Omni-Bird Operations</h2>
                        <p className="text-gray-400 text-xs md:text-sm max-w-lg mx-auto">
                            Select the operational path that matches your current insurance status.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* EAGLE CTA */}
                        <div className="bg-white/5 border border-white/10 p-6 flex flex-col justify-between space-y-6" style={{ clipPath: 'polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)' }}>
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <UploadCloud className="w-5 h-5 text-rhive-pink" />
                                    <h3 className="text-sm font-black uppercase tracking-widest text-white">EAGLE — The Direct ROI Path</h3>
                                </div>
                                <p className="text-xs text-gray-400 leading-relaxed">
                                    Do not let your insurance carrier dictate the value of your asset. Stop the back-and-forth negotiation games. Scan your carrier's estimate, upload it to our secure system, and let our engineering team draft your certified, zero-markup restoration blueprint within 24 hours.
                                </p>
                            </div>
                            <Button 
                                id="faq-eagle-cta"
                                onClick={() => setActivePageId('P-12')}
                                className="w-full justify-between"
                            >
                                <span>Upload Carrier Estimate Now</span>
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </div>

                        {/* OWL CTA */}
                        <div className="bg-white/5 border border-white/10 p-6 flex flex-col justify-between space-y-6" style={{ clipPath: 'polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)' }}>
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <BookOpen className="w-5 h-5 text-rhive-gold" />
                                    <h3 className="text-sm font-black uppercase tracking-widest text-white">OWL — The Data-Driven Proof</h3>
                                </div>
                                <p className="text-xs text-gray-400 leading-relaxed">
                                    Insurance claim metrics are governed by precise math and regional building codes. Click below to explore our complete, itemized structural catalog, analyze the GAF and Owens Corning manufacturer specifications, and review the exact Utah Code 38-11-108 lien protection disclosures.
                                </p>
                            </div>
                            <Button 
                                id="faq-owl-cta"
                                variant="secondary" 
                                onClick={() => setActivePageId('P-02a')}
                                className="w-full justify-between"
                            >
                                <span>View System Technical Specs</span>
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </div>

                        {/* DOVE CTA */}
                        <div className="bg-white/5 border border-white/10 p-6 flex flex-col justify-between space-y-6" style={{ clipPath: 'polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)' }}>
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <HeartHandshake className="w-5 h-5 text-[#38bdf8]" />
                                    <h3 className="text-sm font-black uppercase tracking-widest text-white">DOVE — The Circle of Safety</h3>
                                </div>
                                <p className="text-xs text-gray-400 leading-relaxed">
                                    We understand that storm damage is stressful and filing a claim can feel overwhelming. Let our team provide a complete circle of safety. We handle the documentation, guide you through every insurance milestone, and back your family’s home with a Lifetime No-Leak Workmanship Guarantee.
                                </p>
                            </div>
                            <Button 
                                id="faq-dove-cta"
                                variant="secondary" 
                                onClick={() => setActivePageId('P-05')}
                                className="w-full justify-between"
                            >
                                <span>Connect With An Advocate</span>
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </div>

                        {/* PARROT CTA */}
                        <div className="bg-white/5 border border-white/10 p-6 flex flex-col justify-between space-y-6" style={{ clipPath: 'polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)' }}>
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <Sparkles className="w-5 h-5 text-rhive-pink" />
                                    <h3 className="text-sm font-black uppercase tracking-widest text-white">PARROT — The Prestige Win</h3>
                                </div>
                                <p className="text-xs text-gray-400 leading-relaxed">
                                    Turn a storm disaster into a major aesthetic upgrade. By partnering with RHIVE, you can leverage your insurance claim to seamlessly scale your home's curb appeal to our high-wind Owens Corning Duration FLEX® or premium luxury GAF Designer series. Click below to see what your home could look like!
                                </p>
                            </div>
                            <Button 
                                id="faq-parrot-cta"
                                onClick={() => setActivePageId('P-02a-3')}
                                className="w-full justify-between animate-pulse-glow"
                            >
                                <span>Explore Luxury Designer Packages</span>
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
};

export default InsuranceFaqPage;
