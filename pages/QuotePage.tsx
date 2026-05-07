import React, { useState, useEffect } from 'react';
import { ProjectStageLayout } from '../components/ProjectStageLayout';
import Card from '../components/Card';
import Button from '../components/Button';
import { ClockIcon, DocumentCheckIcon } from '../components/icons';
import { firestoreService } from '../lib/firebaseService';
import { useNavigation } from '../contexts/NavigationContext';

// ─── Bolt icon (local) ───────────────────────────────────────────────────────
const BoltIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M14.615 1.595a.75.75 0 01.359.852L12.982 9.75h7.268a.75.75 0 01.548 1.262l-10.5 11.25a.75.75 0 01-1.272-.71l1.992-7.302H3.75a.75.75 0 01-.548-1.262l10.5-11.25a.75.75 0 01.913-.143z" clipRule="evenodd" />
    </svg>
);

// ─── RPSP countdown timer ─────────────────────────────────────────────────────
const RPSP_WINDOW_HOURS = 48;

function useRPSPTimer(project: any) {
    const [timeRemaining, setTimeRemaining] = useState<number>(0);

    useEffect(() => {
        if (!project) return;
        const mockCreatedAt = new Date(Date.now() - 24 * 60 * 60 * 1000).getTime();
        const expiresAt = mockCreatedAt + RPSP_WINDOW_HOURS * 60 * 60 * 1000;
        const interval = setInterval(() => {
            setTimeRemaining(Math.max(0, expiresAt - Date.now()));
        }, 1000);
        return () => clearInterval(interval);
    }, [project?.id]);

    return timeRemaining;
}

function formatTime(ms: number) {
    const h = Math.floor(ms / (1000 * 60 * 60));
    const m = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((ms % (1000 * 60)) / 1000);
    return `${h}h ${m}m ${s}s`;
}

// ─── Quote detail content (shown per-record) ──────────────────────────────────
interface QuoteContentProps {
    project: any;
    onSignAndAccept: () => void;
    signing: boolean;
}

const QuoteContent: React.FC<QuoteContentProps> = ({ project, onSignAndAccept, signing }) => {
    const timeRemaining = useRPSPTimer(project);
    const isRPSPActive = timeRemaining > 0;

    const projectTotal = project?.quote?.total || 18500;
    const discountAmount = isRPSPActive ? projectTotal * 0.1 : 0;
    const finalTotal = projectTotal - discountAmount;
    const internalCost = projectTotal * 0.65;
    const margin = projectTotal - internalCost;

    const quoteBreakdown = project?.quote?.breakdown || [
        {
            name: project?.project_type
                ? `${project.project_type} System Installation`
                : 'Project System Installation',
            price: projectTotal,
        },
    ];

    return (
        <div className="p-6 md:p-8 space-y-6">
            {/* Header row with RPSP timer */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black text-white uppercase italic">Certified Quote</h2>
                    <p className="text-gray-400 mt-1 text-sm font-mono">
                        {project.address || project?.property?.address || '—'}
                    </p>
                </div>

                {isRPSPActive ? (
                    <div className="text-right">
                        <p className="text-[#ec028b] font-bold text-xs uppercase tracking-widest mb-1 animate-pulse flex items-center justify-end gap-1">
                            <ClockIcon className="w-4 h-4" />
                            Promotion Expires In
                        </p>
                        <div className="text-2xl font-mono font-bold text-white bg-black/50 px-4 py-2 rounded-lg border border-[#ec028b]/50 shadow-[0_0_20px_rgba(236,2,139,0.2)]">
                            {formatTime(timeRemaining)}
                        </div>
                    </div>
                ) : (
                    <div className="px-4 py-2 border border-red-900 bg-red-900/20 text-red-500 rounded-lg text-sm font-bold uppercase">
                        Promotion Expired
                    </div>
                )}
            </div>

            {/* Internal Dual-Math dashboard */}
            <div className="grid grid-cols-2 gap-6 p-6 border border-gray-800 rounded-2xl bg-black/40 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#ec028b] to-transparent opacity-50" />
                <div className="absolute top-2 right-2 text-[9px] text-gray-600 font-bold uppercase border border-gray-800 px-2 rounded">
                    Internal Data
                </div>
                <div>
                    <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Internal Cost (Floor)</p>
                    <p className="text-2xl font-mono text-gray-300">${internalCost.toLocaleString()}</p>
                </div>
                <div className="text-right">
                    <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Target Margin</p>
                    <p className="text-2xl font-mono text-[#ec028b] font-bold">+${margin.toLocaleString()}</p>
                </div>
            </div>

            {/* Line items + totals */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Line Items */}
                <div className="md:col-span-2">
                    <Card title="Project Specifications">
                        <div className="space-y-0">
                            {quoteBreakdown.map((item: any, idx: number) => (
                                <div
                                    key={idx}
                                    className="flex justify-between py-3 border-b border-gray-800 last:border-0"
                                >
                                    <span className="text-gray-300 text-sm">{item.name}</span>
                                    <span className="text-white font-mono text-sm">${(item.price || 0).toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Totals + Sign CTA */}
                <div>
                    <Card className="sticky top-6">
                        <div className="space-y-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Subtotal</span>
                                <span className="text-white font-mono">${projectTotal.toLocaleString()}</span>
                            </div>

                            {isRPSPActive && (
                                <div className="flex justify-between text-sm text-[#ec028b] font-bold">
                                    <span className="flex items-center gap-1">
                                        <BoltIcon className="w-3 h-3" />
                                        RPSP Savings (10%)
                                    </span>
                                    <span className="font-mono">-${discountAmount.toLocaleString()}</span>
                                </div>
                            )}

                            <div className="border-t border-gray-700 pt-4">
                                <div className="flex justify-between items-end">
                                    <span className="text-gray-300 font-bold uppercase text-xs">Total Investment</span>
                                    <span className="text-3xl font-black text-white font-mono leading-none">
                                        ${finalTotal.toLocaleString()}
                                    </span>
                                </div>
                                {isRPSPActive && (
                                    <p className="text-[10px] text-[#ec028b] text-right mt-1 font-bold animate-pulse">
                                        Locked for {formatTime(timeRemaining)}
                                    </p>
                                )}
                            </div>

                            {/* ── Sign & Accept → advances to Sign & Verify stage ── */}
                            <Button
                                id="sign-accept-quote-btn"
                                size="lg"
                                className="w-full mt-4 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(236,2,139,0.3)] hover:shadow-[0_0_30px_rgba(236,2,139,0.5)] disabled:opacity-50 disabled:pointer-events-none"
                                onClick={onSignAndAccept}
                                disabled={signing}
                            >
                                {signing ? (
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <DocumentCheckIcon className="w-4 h-4" />
                                )}
                                {signing ? 'Advancing…' : 'Sign & Accept Quote'}
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

// ─── QuotePage uses ProjectStageLayout for consistent list→detail UX ───────────
const QuotePage: React.FC = () => {
    const { selectedProjectId, setActivePageId } = useNavigation();
    const [signing, setSigning] = useState(false);

    const handleSignAndAccept = async (project: any) => {
        if (!project || signing) return;
        setSigning(true);
        try {
            // Try projects collection first, fall back to leads
            const result = await firestoreService.updateDocument('projects', project.id, {
                current_stage: 'Sign & Verify',
                updated_at: new Date().toISOString(),
            });
            if (!result.success) {
                await firestoreService.updateDocument('leads', project.id, {
                    current_stage: 'Sign & Verify',
                    updated_at: new Date().toISOString(),
                });
            }
            // Navigate to Sign & Verify page (E-29) while keeping selectedProjectId
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
                    onSignAndAccept={() => handleSignAndAccept(project)}
                    signing={signing}
                />
            )}
        </ProjectStageLayout>
    );
};

export default QuotePage;
