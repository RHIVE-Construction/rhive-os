import React, { useState, useEffect } from 'react';
import { ProjectStageLayout, PIPELINE } from '../components/ProjectStageLayout';
import Card from '../components/Card';
import Button from '../components/Button';
import { ClockIcon, DocumentCheckIcon, PlusIcon, TrashIcon, DocumentTextIcon, CheckCircleIcon } from '../components/icons';
import { projectService, userLogService } from '../lib/firebaseService';
import { useNavigation } from '../contexts/NavigationContext';
import { cn } from '../lib/utils';
import {
    QOS_RPSP_WINDOW_HOURS,
    calculateRpspAndCredits,
    calculateDualMathFromRetailOrItems,
    resolvePaymentModel,
    PAYMENT_MODEL_LABELS,
    type QosPaymentModel,
} from '../lib/qosRules';

const MASTER_QUOTE_SHEET_URL = 'https://docs.google.com/spreadsheets/d/1gIpfoBPayONS8__CxIhFpDYbiK4HgwfBphuNSGZVxPY/edit?gid=1779763051#gid=1779763051';

const BoltIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M14.615 1.595a.75.75 0 01.359.852L12.982 9.75h7.268a.75.75 0 01.548 1.262l-10.5 11.25a.75.75 0 01-1.272-.71l1.992-7.302H3.75a.75.75 0 01-.548-1.262l10.5-11.25a.75.75 0 01.913-.143z" clipRule="evenodd" />
    </svg>
);

const RPSP_WINDOW_HOURS = QOS_RPSP_WINDOW_HOURS;

function useRPSPTimer(project: any) {
    const [timeRemaining, setTimeRemaining] = useState<number>(0);

    useEffect(() => {
        if (!project) return;
        const rawSentAt = project?.quote?.sent_at || project?.updated_at || project?.created_at;
        const sentMs = rawSentAt ? new Date(rawSentAt).getTime() : Date.now();
        const validStart = Number.isNaN(sentMs) ? Date.now() : sentMs;
        const expiresAt = validStart + RPSP_WINDOW_HOURS * 60 * 60 * 1000;

        const update = () => setTimeRemaining(Math.max(0, expiresAt - Date.now()));
        update();
        const interval = setInterval(update, 1000);
        return () => clearInterval(interval);
    }, [project?.id, project?.quote?.sent_at]);

    return timeRemaining;
}

function formatTime(ms: number) {
    const h = Math.floor(ms / (1000 * 60 * 60));
    const m = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((ms % (1000 * 60)) / 1000);
    return `${h}h ${m}m ${s}s`;
}

interface QuoteLineItem {
    name: string;
    price: number;
}

interface QuoteSheetLink {
    id: string;
    label: string;
    url: string;
    addedAt: string;
}

interface QuoteContentProps {
    project: any;
    onSignAndAccept: (finalQuoteData: any) => Promise<void>;
    signing: boolean;
}

const QuoteContent: React.FC<QuoteContentProps> = ({ project, onSignAndAccept, signing }) => {
    const timeRemaining = useRPSPTimer(project);
    const [rpspEnabled, setRpspEnabled] = useState<boolean>(project?.quote?.rpspEnabled ?? true);

    const initialItems: QuoteLineItem[] = (() => {
        const existing = project?.quote?.breakdown || project?.quote?.items;
        if (Array.isArray(existing) && existing.length > 0) {
            return existing.map((it: any) => ({
                name: it.name || 'Roof System Scope',
                price: Number(it.price ?? it.cost ?? 0),
            }));
        }
        const fallbackTotal = Number(project?.quote?.total || project?.estimate?.total || 18500);
        return [{
            name: project?.project_type
                ? `${project.project_type} Certified Roof System Installation`
                : 'Certified Roof System Installation',
            price: fallbackTotal,
        }];
    })();

    const [items, setItems] = useState<QuoteLineItem[]>(initialItems);
    const [sheets, setSheets] = useState<QuoteSheetLink[]>(project?.quote_sheets || []);
    const [newSheetLabel, setNewSheetLabel] = useState('');
    const [newSheetUrl, setNewSheetUrl] = useState('');
    const [cartPortalUrl, setCartPortalUrl] = useState<string>(project?.shopping_cart_url || '');
    const [competitorQuoteCount, setCompetitorQuoteCount] = useState<number>(Number(project?.quote?.competitorQuoteCount || 0));
    const [multiBuildingPromo, setMultiBuildingPromo] = useState<boolean>(Boolean(project?.quote?.multiBuildingPromo ?? ((project?.buildings?.length || 1) > 1)));
    const [paymentModel, setPaymentModel] = useState<QosPaymentModel>(() => resolvePaymentModel(project));
    const [savingDraft, setSavingDraft] = useState(false);
    const [saveMessage, setSaveMessage] = useState('');

    useEffect(() => {
        const existing = project?.quote?.breakdown || project?.quote?.items;
        if (Array.isArray(existing) && existing.length > 0) {
            setItems(existing.map((it: any) => ({
                name: it.name || 'Roof System Scope',
                price: Number(it.price ?? it.cost ?? 0),
            })));
        }
        if (Array.isArray(project?.quote_sheets)) setSheets(project.quote_sheets);
        if (project?.shopping_cart_url) setCartPortalUrl(project.shopping_cart_url);
        setPaymentModel(resolvePaymentModel(project));
    }, [project?.id]);

    const isRPSPActive = rpspEnabled && timeRemaining > 0;
    const subtotal = items.reduce((acc, it) => acc + (Number(it.price) || 0), 0);
    const buildingCount = Array.isArray(project?.buildings) && project.buildings.length > 0 ? project.buildings.length : items.length;
    const rpspCalc = calculateRpspAndCredits({
        subtotal,
        projectCategory: project?.project_category || project?.project_type || 'Residential',
        rpspActive: isRPSPActive,
        buildingCount: multiBuildingPromo ? buildingCount : 1,
        competitorQuoteCount,
    });
    const discountAmount = rpspCalc.totalDiscount;
    const finalTotal = rpspCalc.finalTotal;
    const dualMath = calculateDualMathFromRetailOrItems(subtotal, project?.costs);
    const internalCost = dualMath.costs.totalCost;
    const margin = finalTotal - internalCost;

    const buildQuoteObject = (statusLabel: string) => {
        const cleanPrev = { ...(project?.quote || {}) };
        delete (cleanPrev as any).internalCost;
        return {
            ...cleanPrev,
            subtotal,
            total: finalTotal,
            discountAmount,
            rpspDiscount: rpspCalc.rpspDiscount,
            multiBuildingDiscount: rpspCalc.multiBuildingDiscount,
            competitorCredit: rpspCalc.competitorCredit,
            competitorQuoteCount,
            multiBuildingPromo,
            rpspEnabled,
            payment_model: paymentModel,
            osbFreeAllowanceSqft: 100,
            breakdown: items.map(i => ({ name: i.name, price: Number(i.price) || 0, cost: Number(i.price) || 0 })),
            items: items.map(i => ({ name: i.name, price: Number(i.price) || 0, cost: Number(i.price) || 0 })),
            status: statusLabel,
            sent_at: project?.quote?.sent_at || new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };
    };

    const handleSaveQuote = async () => {
        if (!project?.id || savingDraft) return;
        setSavingDraft(true);
        setSaveMessage('');
        try {
            const quoteObj = buildQuoteObject('Sent');
            await projectService.updateRecord(project.id, {
                quote: quoteObj,
                costs: dualMath.costs,
                payment_model: paymentModel,
                quote_sheets: sheets,
                shopping_cart_url: cartPortalUrl.trim() || null,
                updated_at: new Date().toISOString(),
            }, project._source);

            await userLogService.logAction(
                'SAVE_QUOTE',
                `Saved certified quote for ${project.name || 'Project'} ($${finalTotal.toLocaleString()})`,
                { recordId: project.id, projectId: project.id, total: finalTotal, itemCount: items.length }
            );
            setSaveMessage('Certified quote & linked sheets saved to Firebase.');
        } catch (err) {
            console.error('[QuotePage] Save error:', err);
            setSaveMessage('Failed to save quote.');
        } finally {
            setSavingDraft(false);
        }
    };

    const handleAddSheetLink = async () => {
        if (!newSheetUrl.trim()) return;
        const entry: QuoteSheetLink = {
            id: `SHEET-${Date.now()}`,
            label: newSheetLabel.trim() || `Building Quote Sheet #${sheets.length + 1}`,
            url: newSheetUrl.trim(),
            addedAt: new Date().toISOString(),
        };
        const nextSheets = [...sheets, entry];
        setSheets(nextSheets);
        setNewSheetLabel('');
        setNewSheetUrl('');

        if (project?.id) {
            await projectService.updateRecord(project.id, {
                quote_sheets: nextSheets,
                updated_at: new Date().toISOString(),
            }, project._source);
            await userLogService.logAction(
                'EDIT_RECORD',
                `Linked Google Quote Sheet "${entry.label}" to ${project.name || 'Project'}`,
                { recordId: project.id, projectId: project.id }
            );
        }
    };

    const handleRemoveSheetLink = async (id: string) => {
        const nextSheets = sheets.filter(s => s.id !== id);
        setSheets(nextSheets);
        if (project?.id) {
            await projectService.updateRecord(project.id, { quote_sheets: nextSheets }, project._source);
        }
    };

    return (
        <div className="p-6 md:p-8 space-y-6">
            {/* Header Strip with RPSP Timer */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gray-900/40 border border-gray-800 rounded-xl p-5">
                <div>
                    <p className="text-xl font-black text-white uppercase tracking-wide">Certified Quote Builder & Shopping Cart Bridge</p>
                    <p className="text-gray-400 mt-1 text-xs font-mono">
                        {project.property_address || project?.property?.address || 'Address pending'}
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        type="button"
                        onClick={() => setRpspEnabled(prev => !prev)}
                        className={cn(
                            'px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider border transition-all',
                            rpspEnabled
                                ? 'bg-[#ec028b]/20 border-[#ec028b] text-[#ec028b] shadow-[0_0_12px_rgba(236,2,139,0.3)]'
                                : 'bg-black/50 border-gray-700 text-gray-500 hover:text-gray-300'
                        )}
                    >
                        72h RPSP Savings: {rpspEnabled ? 'Active' : 'Off'}
                    </button>

                    {isRPSPActive ? (
                        <div className="text-right">
                            <p className="text-[#ec028b] font-bold text-[10px] uppercase tracking-widest mb-1 flex items-center justify-end gap-1">
                                <ClockIcon className="w-3.5 h-3.5" />
                                72h Window
                            </p>
                            <div className="text-lg font-mono font-bold text-white bg-black/70 px-3 py-1.5 rounded-lg border border-[#ec028b]/50">
                                {formatTime(timeRemaining)}
                            </div>
                        </div>
                    ) : (
                        <div className="px-3 py-2 border border-gray-800 bg-black/50 text-gray-500 rounded-lg text-xs font-bold uppercase">
                            Standard Pricing
                        </div>
                    )}
                </div>
            </div>

            {saveMessage && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2">
                    <CheckCircleIcon className="w-4 h-4" />
                    {saveMessage}
                </div>
            )}

            {/* Google Spreadsheet Template & Sheena Shopping Cart Integration */}
            <Card title="Google Spreadsheet Quote Tool & Shopping Cart Sync">
                <div className="space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-black/50 border border-gray-800 rounded-xl">
                        <div>
                            <p className="text-white font-bold text-sm">RHIVE Master Beta Quote Spreadsheet</p>
                            <p className="text-gray-400 text-xs mt-0.5">
                                Duplicate the master spreadsheet into the customer&apos;s Google Drive folder (per building or option), then link it below for Shopping Cart &amp; Client Portal PDF sync.
                            </p>
                        </div>
                        <a
                            href={MASTER_QUOTE_SHEET_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#ec028b] hover:bg-[#d4027d] text-white text-xs font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(236,2,139,0.3)] transition-all"
                        >
                            <DocumentTextIcon className="w-4 h-4" />
                            Create Quote from Master Sheet
                        </a>
                    </div>

                    {/* Add Building / Option Sheet Link */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                        <input
                            type="text"
                            value={newSheetLabel}
                            onChange={e => setNewSheetLabel(e.target.value)}
                            placeholder="Label (e.g., Main House Quote, BLD A TPO Quote)"
                            className="md:col-span-4 bg-black/60 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-600 focus:border-[#ec028b] outline-none"
                        />
                        <input
                            type="url"
                            value={newSheetUrl}
                            onChange={e => setNewSheetUrl(e.target.value)}
                            placeholder="Paste Google Sheet URL for this building/project..."
                            className="md:col-span-6 bg-black/60 border border-gray-700 rounded-lg px-3 py-2 text-xs font-mono text-white placeholder-gray-600 focus:border-[#ec028b] outline-none"
                        />
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={handleAddSheetLink}
                            className="md:col-span-2 justify-center flex items-center gap-1"
                        >
                            <PlusIcon className="w-4 h-4" />
                            Save Sheet
                        </Button>
                    </div>

                    {sheets.length > 0 && (
                        <div className="space-y-2">
                            {sheets.map(sheet => (
                                <div key={sheet.id} className="flex items-center justify-between p-3 bg-gray-900/60 border border-gray-800 rounded-lg">
                                    <div className="min-w-0 pr-3">
                                        <p className="text-white text-xs font-bold truncate">{sheet.label}</p>
                                        <a
                                            href={sheet.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[#ec028b] hover:underline text-[11px] font-mono truncate block"
                                        >
                                            {sheet.url}
                                        </a>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveSheetLink(sheet.id)}
                                        className="text-gray-500 hover:text-red-400 p-1.5"
                                        title="Remove sheet link"
                                    >
                                        <TrashIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Shopping Cart Client Portal URL */}
                    <div className="pt-3 border-t border-gray-800/70 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                        <span className="md:col-span-3 text-xs text-gray-400 font-bold uppercase tracking-wider">
                            Shopping Cart / Portal Link
                        </span>
                        <input
                            type="url"
                            value={cartPortalUrl}
                            onChange={e => setCartPortalUrl(e.target.value)}
                            placeholder="https://toolkit.rhiveconstruction.com/cart/..."
                            className="md:col-span-9 bg-black/60 border border-gray-700 rounded-lg px-3 py-2 text-xs font-mono text-white placeholder-gray-600 focus:border-[#ec028b] outline-none"
                        />
                    </div>
                </div>
            </Card>

            {/* Internal Dual-Math Dashboard */}
            <div className="grid grid-cols-2 gap-6 p-6 border border-gray-800 rounded-2xl bg-black/40 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#ec028b] to-transparent opacity-50" />
                <div className="absolute top-2 right-2 text-[9px] text-gray-600 font-bold uppercase border border-gray-800 px-2 rounded">
                    Internal TrueCost Audit
                </div>
                <div>
                    <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Internal Cost (Floor)</p>
                    <p className="text-2xl font-mono text-gray-300">${internalCost.toLocaleString()}</p>
                </div>
                <div className="text-right">
                    <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Net Target Margin</p>
                    <p className="text-2xl font-mono text-[#ec028b] font-bold">+${margin.toLocaleString()}</p>
                </div>
            </div>

            {/* Line Items + Totals */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                    <Card title="Certified Project Specifications">
                        <div className="space-y-3">
                            {items.map((item, idx) => (
                                <div key={idx} className="grid grid-cols-12 gap-2 items-center pb-3 border-b border-gray-800/70 last:border-0">
                                    <input
                                        type="text"
                                        value={item.name}
                                        onChange={e => {
                                            const val = e.target.value;
                                            setItems(prev => prev.map((it, i) => i === idx ? { ...it, name: val } : it));
                                        }}
                                        className="col-span-7 md:col-span-8 bg-black/50 border border-gray-800 rounded-lg px-3 py-2 text-xs text-white focus:border-[#ec028b] outline-none"
                                    />
                                    <input
                                        type="number"
                                        min={0}
                                        step={100}
                                        value={item.price}
                                        onChange={e => {
                                            const val = Number(e.target.value) || 0;
                                            setItems(prev => prev.map((it, i) => i === idx ? { ...it, price: val } : it));
                                        }}
                                        className="col-span-4 md:col-span-3 bg-black/50 border border-gray-800 rounded-lg px-3 py-2 text-xs font-mono text-right text-white focus:border-[#ec028b] outline-none"
                                    />
                                    <button
                                        type="button"
                                        disabled={items.length <= 1}
                                        onClick={() => setItems(prev => prev.filter((_, i) => i !== idx))}
                                        className="col-span-1 flex justify-center text-gray-600 hover:text-red-400 disabled:opacity-30"
                                    >
                                        <TrashIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}

                            <div className="pt-2 flex justify-between items-center">
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => setItems(prev => [...prev, { name: `Additional Building / Option #${prev.length + 1}`, price: 2500 }])}
                                    className="flex items-center gap-1.5"
                                >
                                    <PlusIcon className="w-4 h-4" />
                                    Create Line Item
                                </Button>

                                <Button
                                    id="quote-save-btn"
                                    variant="secondary"
                                    size="sm"
                                    disabled={savingDraft}
                                    onClick={handleSaveQuote}
                                >
                                    {savingDraft ? 'Saving…' : 'Save'}
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>

                <div>
                    <Card className="sticky top-6">
                        <div className="space-y-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Subtotal</span>
                                <span className="text-white font-mono">${subtotal.toLocaleString()}</span>
                            </div>

                            {rpspCalc.rpspDiscount > 0 && (
                                <div className="flex justify-between text-xs text-[#ec028b] font-bold">
                                    <span className="flex items-center gap-1">
                                        <BoltIcon className="w-3 h-3" />
                                        {rpspCalc.rpspLabel}
                                    </span>
                                    <span className="font-mono">-${rpspCalc.rpspDiscount.toLocaleString()}</span>
                                </div>
                            )}

                            {buildingCount > 1 && (
                                <div className="flex items-center justify-between text-xs">
                                    <button
                                        type="button"
                                        onClick={() => setMultiBuildingPromo(p => !p)}
                                        className={cn(
                                            'px-2 py-1 rounded border text-[10px] font-bold uppercase cursor-pointer',
                                            multiBuildingPromo ? 'border-[#ec028b] bg-[#ec028b]/15 text-[#ec028b]' : 'border-gray-700 text-gray-500'
                                        )}
                                    >
                                        Multi-Roof 0.5%/Bldg ({buildingCount})
                                    </button>
                                    <span className="font-mono text-emerald-400">
                                        {rpspCalc.multiBuildingDiscount > 0 ? `-$${rpspCalc.multiBuildingDiscount.toLocaleString()}` : '$0'}
                                    </span>
                                </div>
                            )}

                            <div className="flex items-center justify-between text-xs">
                                <span className="text-gray-400">Competitor Quotes ($50/ea)</span>
                                <div className="flex gap-1">
                                    {[0, 1, 2, 3].map(n => (
                                        <button
                                            key={n}
                                            type="button"
                                            onClick={() => setCompetitorQuoteCount(n)}
                                            className={cn(
                                                'w-6 h-6 rounded border text-[10px] font-bold cursor-pointer',
                                                competitorQuoteCount === n ? 'bg-[#ec028b] border-[#ec028b] text-white' : 'bg-black/40 border-gray-700 text-gray-400'
                                            )}
                                        >
                                            {n}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            {rpspCalc.competitorCredit > 0 && (
                                <div className="flex justify-between text-xs text-emerald-400 font-mono">
                                    <span>Competitor Quote Credit</span>
                                    <span>-${rpspCalc.competitorCredit}</span>
                                </div>
                            )}

                            <div className="p-2.5 rounded-lg bg-emerald-500/5 border border-emerald-500/20 text-[11px] text-emerald-300">
                                Includes 1st 100 sq ft (3 sheets) of 7/16&quot; OSB Decking Replacement Free ($72.50/sheet thereafter).
                            </div>

                            <div className="space-y-1.5 pt-2 border-t border-gray-800">
                                <label className="block text-[10px] text-gray-400 uppercase font-bold tracking-widest">
                                    Billing &amp; Payment Model
                                </label>
                                <select
                                    id="quote-payment-model-select"
                                    value={paymentModel}
                                    onChange={(e) => setPaymentModel(e.target.value as QosPaymentModel)}
                                    className="w-full bg-black/70 border border-gray-700 rounded-lg px-2.5 py-2 text-xs text-white focus:border-[#ec028b] outline-none"
                                >
                                    {(Object.keys(PAYMENT_MODEL_LABELS) as QosPaymentModel[]).map((m) => (
                                        <option key={m} value={m}>{PAYMENT_MODEL_LABELS[m]}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="border-t border-gray-700 pt-4">
                                <div className="flex justify-between items-end">
                                    <span className="text-gray-300 font-bold uppercase text-xs">Total Investment</span>
                                    <span className="text-3xl font-black text-white font-mono leading-none">
                                        ${finalTotal.toLocaleString()}
                                    </span>
                                </div>
                                <p className="text-[10px] text-gray-400 text-right mt-2 font-mono">
                                    {PAYMENT_MODEL_LABELS[paymentModel]}
                                </p>
                            </div>

                            <Button
                                id="sign-accept-quote-btn"
                                size="lg"
                                className="w-full mt-4 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(236,2,139,0.3)] hover:shadow-[0_0_30px_rgba(236,2,139,0.5)] disabled:opacity-50 disabled:pointer-events-none"
                                onClick={() => onSignAndAccept(buildQuoteObject('Accepted'))}
                                disabled={signing}
                            >
                                {signing ? (
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <DocumentCheckIcon className="w-4 h-4" />
                                )}
                                {signing ? 'Saving…' : 'Confirm & Send to Sign'}
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

const QuotePage: React.FC = () => {
    const { setActivePageId } = useNavigation();
    const [signing, setSigning] = useState(false);

    const handleSignAndAccept = async (project: any, finalQuoteData: any) => {
        if (!project || signing) return;
        setSigning(true);
        try {
            const dualMath = calculateDualMathFromRetailOrItems(Number(finalQuoteData.subtotal || finalQuoteData.total || 0), project?.costs);
            await projectService.updateRecord(project.id, {
                current_stage: 'Sign & Verify',
                quote: finalQuoteData,
                costs: dualMath.costs,
                payment_model: finalQuoteData.payment_model || resolvePaymentModel(project),
                pizza_tracker: {
                    stage: 'Sign & Verify',
                    stageIndex: 3,
                    totalStages: PIPELINE.length,
                    subSteps: PIPELINE[3].defaultSubSteps.map((label, i) => ({ label, done: i === 0 })),
                    updatedAt: new Date().toISOString(),
                },
                updated_at: new Date().toISOString(),
            }, project._source);

            await userLogService.logAction(
                'STAGE_CHANGE',
                `Quote confirmed for ${project.name || 'Project'} ($${Number(finalQuoteData.total || 0).toLocaleString()}) — moved to Sign & Verify`,
                {
                    recordId: project.id,
                    recordName: project.name || 'Unknown',
                    projectId: project.id,
                    oldStage: 'Quote',
                    newStage: 'Sign & Verify',
                    stage: 'Sign & Verify',
                    projectName: project.name || 'Unknown',
                }
            );
            setActivePageId('E-29');
        } catch (err) {
            console.error('Sign & Accept error:', err);
        } finally {
            setSigning(false);
        }
    };

    return (
        <ProjectStageLayout stageLabel="Quote" stagePageId="E-28">
            {(project) => (
                <QuoteContent
                    project={project}
                    onSignAndAccept={(finalQuoteData) => handleSignAndAccept(project, finalQuoteData)}
                    signing={signing}
                />
            )}
        </ProjectStageLayout>
    );
};

export default QuotePage;
