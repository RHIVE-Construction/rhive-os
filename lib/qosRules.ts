/**
 * lib/qosRules.ts
 *
 * Canonical RHIVE Quantum OS (QOS) Business Logic, Dual-Math Financial Engine,
 * Polymorphic Payment Milestones, 72h RPSP Efficiency Credits, and 100 sq ft OSB Decking Rules.
 *
 * Ground Truth Sources:
 * - Live Spreadsheet: RHIVE QOS DATA (25 Tabs) + Project Item Descriptions (45 Catalog Items)
 * - Audited Google Drive Customer Contracts & Job Costing Ledgers (Residential, HOA, UNPHC, Megaplex, DFCM, GC)
 */

export type PaymentModelKey =
    | 'retail_50_40_10'
    | 'repair_100'
    | 'commercial_50_50'
    | 'insurance_acv_rcv'
    | 'msa_net_30';

export type QosPaymentModel = PaymentModelKey;

export const QOS_RPSP_WINDOW_HOURS = 72;

export interface QosMilestone {
    id: string;
    key: string;
    label: string;
    percent: number;
    pct: number;
    amount: number;
    paid: boolean;
    paid_at?: string;
}

export const QOS_ASPHALT_PACKAGES = [
    {
        id: 'oc-duration',
        name: 'Owens Corning TruDefinition® Duration®',
        short: 'O.C. Duration®',
        warranty: '50-Yr Non-Prorated + 10-Yr Workmanship',
        windRating: '130 MPH SureNail®',
        addonPerSq: 0,
    },
    {
        id: 'oc-flex',
        name: 'Owens Corning Duration FLEX® (Class 4 SBS)',
        short: 'O.C. Duration FLEX®',
        warranty: '50-Yr Preferred + UL 2218 Class 4 Hail',
        windRating: '130 MPH SureNail®',
        addonPerSq: 58.7,
    },
    {
        id: 'oc-woodcrest',
        name: 'Owens Corning Woodcrest® Designer',
        short: 'O.C. Woodcrest®',
        warranty: '50-Yr Non-Prorated Heavy Shake Profile',
        windRating: '130 MPH',
        addonPerSq: 250,
    },
    {
        id: 'oc-woodmoor',
        name: 'Owens Corning Woodmoor® Premium Designer',
        short: 'O.C. Woodmoor®',
        warranty: '50-Yr Non-Prorated Ultra-Dimensional Estate',
        windRating: '130 MPH',
        addonPerSq: 300,
    },
] as const;

export const QOS_MEMBRANE_PACKAGES = [
    { id: 'gaf-tpo-60', name: 'GAF EverGuard® TPO 60 mil', warranty: '20-Yr Diamond Pledge™ NDL', basePerSq: 665 },
    { id: 'gaf-tpo-80', name: 'GAF EverGuard® TPO 80 mil', warranty: '25-Yr Diamond Pledge™ NDL', basePerSq: 785 },
    { id: 'gaf-pvc-60', name: 'GAF EverGuard® PVC 60 mil (Chemical/Grease)', warranty: '20-Yr NDL Class A Fire', basePerSq: 845 },
    { id: 'gaf-pvc-80', name: 'GAF EverGuard® PVC 80 mil (Heavy Industrial)', warranty: '25-Yr NDL Class A Fire', basePerSq: 960 },
] as const;

/**
 * Multi-format phone digit normalization (AGENTS.md getPhoneVariations compliance).
 */
export function normalizePhoneDigits(phone?: string | null): string {
    if (!phone) return '';
    const digits = String(phone).replace(/\D/g, '');
    if (digits.length === 11 && digits.startsWith('1')) return digits.slice(1);
    return digits;
}

export function getPhoneVariations(phone?: string | null): string[] {
    const d = normalizePhoneDigits(phone);
    if (!d) return [];
    const out = new Set<string>([d]);
    if (d.length === 10) {
        out.add(`1${d}`);
        out.add(`+1${d}`);
        out.add(`(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`);
        out.add(`${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}`);
        out.add(`${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`);
    }
    return Array.from(out);
}

export function matchesPhoneQuery(storedPhone: string | undefined | null, rawQuery: string): boolean {
    if (!storedPhone || !rawQuery) return false;
    const rawLower = rawQuery.toLowerCase().trim();
    if (String(storedPhone).toLowerCase().includes(rawLower)) return true;
    const qDigits = normalizePhoneDigits(rawQuery);
    if (qDigits.length < 3) return false;
    const sDigits = normalizePhoneDigits(storedPhone);
    return sDigits.includes(qDigits);
}

/**
 * QOS Tab 24 (RPSP Schema) — Canonical 72-Hour Efficiency Credit & Portfolio Discounts
 * - Residential: 10% capped strictly at $1,000 max
 * - Commercial / Government: <$50k => $1,000 | >=$50k => $1,500 + $500 per extra $50k
 * - Multi-Building Portfolio Loyalty: 0.5% per roof when >= 2 buildings (capped at 5%)
 * - Competitor Quote Credit: $50 per verified competitor quote (max 3 = $150)
 */
export function calculateRpspAndCredits(params: {
    subtotal: number;
    projectType?: string;
    projectCategory?: string;
    rpspActive?: boolean;
    buildingCount?: number;
    competitorQuotes?: number;
    competitorQuoteCount?: number;
}) {
    const sub = Math.max(0, Number(params.subtotal || 0));
    const catStr = String(params.projectCategory || params.projectType || '').toLowerCase();
    const isCommOrGov = ['commercial', 'government', 'hoa', 'multifamily'].some((k) =>
        catStr.includes(k)
    );

    let rpspCredit = 0;
    if (params.rpspActive && sub > 0) {
        if (isCommOrGov) {
            if (sub < 50000) {
                rpspCredit = Math.min(sub, 1000);
            } else {
                const extra50kBlocks = Math.floor((sub - 50000) / 50000);
                rpspCredit = Math.min(sub, 1500 + extra50kBlocks * 500);
            }
        } else {
            rpspCredit = Math.min(Math.round(sub * 0.1), 1000);
        }
    }

    const rpspLabel = isCommOrGov
        ? '72h Commercial RPSP Efficiency Credit'
        : '72h RPSP Efficiency Credit (10%, Max $1,000)';

    const bldCount = Math.max(1, Number(params.buildingCount || 1));
    const multiBuildingPct = bldCount >= 2 ? Math.min(bldCount * 0.005, 0.05) : 0;
    const multiBuildingDiscount = Math.round(sub * multiBuildingPct);

    const compRaw = params.competitorQuoteCount ?? params.competitorQuotes ?? 0;
    const compCount = Math.min(3, Math.max(0, Number(compRaw)));
    const competitorCredit = compCount * 50;

    const totalDiscount = Math.min(sub, rpspCredit + multiBuildingDiscount + competitorCredit);
    const netRetail = Math.max(0, sub - totalDiscount);
    return {
        rpspCredit,
        rpspDiscount: rpspCredit,
        rpspLabel,
        multiBuildingPct,
        multiBuildingDiscount,
        competitorCredit,
        totalDiscount,
        netRetail,
        finalTotal: netRetail,
    };
}

/**
 * QOS Tab 5 & Tab 22 — 100 sq ft (3 sheets of 4'x8' 7/16" OSB) Free Decking Allowance
 * - First 3 sheets (96–100 sq ft) included at $0.00
 * - Additional sheets: $72.50/sheet (+$7.00/sheet if steep >= 8/12)
 * - Wood dump trailer fee: $250 when billableSheets > 3
 */
export function calculateOsbDeckingAllowance(totalSheetsUsed: number, isSteep = false) {
    const sheets = Math.max(0, Math.floor(Number(totalSheetsUsed || 0)));
    const freeSheets = Math.min(3, sheets);
    const billableSheets = Math.max(0, sheets - 3);
    const ratePerSheet = isSteep ? 79.5 : 72.5;
    const trailerFee = billableSheets > 3 ? 250 : 0;
    const totalCharge = Number((billableSheets * ratePerSheet + trailerFee).toFixed(2));
    return {
        totalSheets: sheets,
        freeSheets,
        billableSheets,
        ratePerSheet,
        trailerFee,
        totalCharge,
    };
}

/**
 * QOS Dual-Math Financial Engine:
 * Retail = Cost / (1 - TargetMargin)
 * Separates Admin-only internal cost floor (`costs`) from Customer-visible `retail`.
 */
export function calculateDualMathFromRetailOrItems(
    itemsOrRetail:
        | number
        | Array<{ name: string; price?: number; cost?: number; internal_cost?: number; qty?: number }>,
    existingCosts?: { materials?: number; labor?: number; overhead?: number; totalCost?: number },
    targetMargin = 0.25
) {
    const items =
        typeof itemsOrRetail === 'number'
            ? [{ name: 'Project Scope', price: itemsOrRetail, qty: 1 }]
            : Array.isArray(itemsOrRetail)
            ? itemsOrRetail
            : [];

    const retailSubtotal = items.reduce(
        (sum, it) => sum + Number(it.price ?? it.cost ?? 0) * Number(it.qty ?? 1),
        0
    );

    if (existingCosts?.totalCost && existingCosts.totalCost > 0) {
        const floor = Math.round(existingCosts.totalCost);
        const materials = Math.round(existingCosts.materials ?? floor * 0.52);
        const labor = Math.round(existingCosts.labor ?? floor * 0.28);
        const overhead = Math.round(existingCosts.overhead ?? floor * 0.2);
        return {
            materials,
            labor,
            overhead,
            totalCost: floor,
            costs: { materials, labor, overhead, totalCost: floor },
            retailSubtotal: Math.round(retailSubtotal),
            grossProfit: Math.round(retailSubtotal - floor),
            marginPct: retailSubtotal > 0 ? Number((((retailSubtotal - floor) / retailSubtotal) * 100).toFixed(1)) : 0,
        };
    }

    // Derive true QOS cost floor using Cost = Retail * (1 - targetMargin) split across Mat (52%), Lab (28%), Ovrd (20%)
    const explicitItemFloor = items.reduce((sum, it) => {
        const unitRetail = Number(it.price ?? it.cost ?? 0);
        const unitFloor =
            typeof it.internal_cost === 'number' && it.internal_cost > 0
                ? it.internal_cost
                : unitRetail * (1 - targetMargin);
        return sum + unitFloor * Number(it.qty ?? 1);
    }, 0);

    const totalCost = Math.round(explicitItemFloor);
    const materials = Math.round(totalCost * 0.52);
    const labor = Math.round(totalCost * 0.28);
    const overhead = Math.max(0, totalCost - materials - labor);

    return {
        materials,
        labor,
        overhead,
        totalCost,
        costs: { materials, labor, overhead, totalCost },
        retailSubtotal: Math.round(retailSubtotal),
        grossProfit: Math.round(retailSubtotal - totalCost),
        marginPct: retailSubtotal > 0 ? Number((((retailSubtotal - totalCost) / retailSubtotal) * 100).toFixed(1)) : 0,
    };
}

/**
 * Resolves which of the 5 real RHIVE payment structures applies to a project.
 */
export function resolvePaymentModel(project: any): PaymentModelKey {
    if (!project) return 'retail_50_40_10';
    if (project.payment_model) return project.payment_model as PaymentModelKey;

    const total = Number(project.quote?.total || 0);
    const isRepair =
        String(project.details?.scopeType || project.scope_type || '').toLowerCase() === 'repair' ||
        String(project.name || '').toLowerCase().includes('repair') ||
        String(project.name || '').toLowerCase().includes('leak');

    if (isRepair && (total <= 3500 || total === 0)) return 'repair_100';
    if (project.insurance && (project.insurance.carrier || project.insurance.claimNumber || project.insurance.claim_number)) {
        return 'insurance_acv_rcv';
    }
    const pType = String(project.project_type || '').toLowerCase();
    if (pType === 'government' || project.compliance?.solicitation_num) return 'msa_net_30';
    if (pType === 'commercial' && project.billing?.isMsa) return 'msa_net_30';

    return 'retail_50_40_10';
}

export const PAYMENT_MODEL_LABELS: Record<PaymentModelKey, string> = {
    retail_50_40_10: 'Standard 50% / 40% / 10% Milestone Split',
    repair_100: 'Fast-Path Repair (100% Upon Authorization / Completion)',
    commercial_50_50: 'Commercial / HOA 50% Mobilization / 50% Completion',
    insurance_acv_rcv: 'Insurance Claim (Deductible + ACV -> Final RCV Supplement)',
    msa_net_30: 'Government / Corporate MSA (Approved PO -> Net-30 Final Invoice)',
};

/**
 * Generates normalized milestone records with both `key`, `amount`, `percent`, and `pct`
 * so `InvoicingPage` (`E-34`) and `CustomerDashboard` (`C-02`) never diverge or show $0.
 */
export function buildMilestonesForProject(project: any, overrideTotal?: number): QosMilestone[] {
    const baseContract = Number(overrideTotal ?? project?.quote?.total ?? 0);
    const approvedAwos = Array.isArray(project?.awos)
        ? project.awos
              .filter((a: any) => !a.status || a.status === 'Approved')
              .reduce((s: number, a: any) => s + Number(a.amount || 0), 0)
        : 0;
    const grandTotal = Math.max(0, baseContract + approvedAwos);
    const depositPaid = Boolean(project?.deposit_paid || project?.deposit_confirmed);

    const existing: any[] | undefined = project?.invoicing?.milestones;
    if (Array.isArray(existing) && existing.length > 0) {
        return existing.map((m: any, idx: number) => {
            const pct = typeof m.pct === 'number' ? m.pct : Number(m.percent || 0) / 100;
            const percent = typeof m.percent === 'number' ? m.percent : Math.round(pct * 100);
            const computedAmt =
                typeof m.amount === 'number' && m.amount > 0
                    ? m.amount
                    : Math.round(grandTotal * (pct || percent / 100));
            const key = m.key || m.id || `milestone_${idx}`;
            return {
                id: m.id || key,
                key,
                label: m.label || `Milestone ${idx + 1}`,
                percent,
                pct: pct || percent / 100,
                amount: computedAmt,
                paid: key.includes('deposit') ? Boolean(m.paid || depositPaid) : Boolean(m.paid),
                paid_at: m.paid_at,
            };
        });
    }

    const model = resolvePaymentModel(project);
    if (model === 'repair_100') {
        return [
            {
                id: 'repair_100',
                key: 'repair_100',
                label: '100% Fast-Path Repair Invoice',
                percent: 100,
                pct: 1,
                amount: grandTotal,
                paid: depositPaid,
            },
        ];
    }
    if (model === 'commercial_50_50') {
        const first = Math.round(baseContract * 0.5);
        return [
            {
                id: 'deposit_50',
                key: 'deposit_50',
                label: '50% Commercial Mobilization & Material Deposit',
                percent: 50,
                pct: 0.5,
                amount: first,
                paid: depositPaid,
            },
            {
                id: 'completion_50',
                key: 'completion_50',
                label: '50% Final Completion + Approved AWOs',
                percent: 50,
                pct: 0.5,
                amount: Math.max(0, grandTotal - first),
                paid: false,
            },
        ];
    }
    if (model === 'insurance_acv_rcv') {
        const deductible = Number(project?.insurance?.deductible || 1500);
        const acvInitial = Math.max(deductible, Math.round(baseContract * 0.6));
        return [
            {
                id: 'acv_deductible',
                key: 'acv_deductible',
                label: `Deductible ($${deductible.toLocaleString()}) + Initial Carrier ACV Draw`,
                percent: 60,
                pct: 0.6,
                amount: acvInitial,
                paid: depositPaid,
            },
            {
                id: 'rcv_supplement',
                key: 'rcv_supplement',
                label: 'Recoverable Depreciation (RCV) + Approved Supplements',
                percent: 40,
                pct: 0.4,
                amount: Math.max(0, grandTotal - acvInitial),
                paid: false,
            },
        ];
    }
    if (model === 'msa_net_30') {
        return [
            {
                id: 'ntp_po',
                key: 'ntp_po',
                label: 'Notice to Proceed / Approved Purchase Order ($0 Deposit)',
                percent: 0,
                pct: 0,
                amount: 0,
                paid: true,
            },
            {
                id: 'net_30_final',
                key: 'net_30_final',
                label: '100% Net-30 SOV / Completion Invoice',
                percent: 100,
                pct: 1,
                amount: grandTotal,
                paid: false,
            },
        ];
    }

    // Default: Standard 50 / 40 / 10
    const m50 = Math.round(baseContract * 0.5);
    const m40 = Math.round(baseContract * 0.4);
    const m10 = Math.max(0, grandTotal - m50 - m40);
    return [
        {
            id: 'deposit_50',
            key: 'deposit_50',
            label: '50% Material Deposit',
            percent: 50,
            pct: 0.5,
            amount: m50,
            paid: depositPaid,
        },
        {
            id: 'completion_40',
            key: 'completion_40',
            label: '40% Upon Roof Completion',
            percent: 40,
            pct: 0.4,
            amount: m40,
            paid: false,
        },
        {
            id: 'warranty_10',
            key: 'warranty_10',
            label: '10% Final Balance (Unlocks Master Warranty)',
            percent: 10,
            pct: 0.1,
            amount: m10,
            paid: false,
        },
    ];
}
