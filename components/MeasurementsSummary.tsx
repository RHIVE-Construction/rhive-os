/**
 * MeasurementsSummary.tsx
 *
 * Displays a detailed "BLDG Summary" measurements modal matching the
 * instant-estimate V2 spreadsheet output. Shows:
 *
 *  - Area breakdown: slope vs ground, pitched vs flat
 *  - Pitch-bucket table (instant-estimate/vic method)
 *  - SQ quantities with waste %
 *  - Linear measurements (as-is from tier-based calibrated engine)
 *  - Full pricing pipeline (material / labor / overhead / profit / retail)
 *  - Payment plan options
 *
 * RHIVE Design System: Tech-Noir, glassmorphism, rhive-pink accent.
 */

import React, { useMemo, useState } from 'react';
import type { BuildingData, SurveyState } from '../types';
import { usePricing } from '../contexts/PricingContext';
import { computeDetailedMeasurements } from '../lib/measurementCalculator';
import type { DetailedMeasurementReport, PitchBucket } from '../lib/measurementCalculator';

// ── Helpers ───────────────────────────────────────────────────────────────────
function fmt(n: number, dec = 2): string {
  if (!isFinite(n) || isNaN(n)) return '–';
  return n.toFixed(dec).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
function fmtCurrency(n: number): string {
  if (!isFinite(n) || isNaN(n)) return '–';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
}
function fmtPct(n: number): string {
  return `${(n * 100).toFixed(1)}%`;
}
function fmtFt(feet: number): string {
  const w = Math.floor(feet);
  const inches = Math.round((feet - w) * 12);
  if (inches === 12) return `${w + 1}' 0"`;
  return `${w}' ${inches}"`;
}

// ── Sub-components ────────────────────────────────────────────────────────────

const SectionHeader: React.FC<{ icon: React.ReactNode; title: string; accent?: string }> = ({
  icon, title, accent,
}) => (
  <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-700/60">
    <span className="text-rhive-pink">{icon}</span>
    <h3 className="text-sm font-bold uppercase tracking-widest text-gray-300">{title}</h3>
    {accent && <span className="ml-auto text-xs text-rhive-pink font-mono">{accent}</span>}
  </div>
);

const StatRow: React.FC<{
  label: string;
  value: string;
  sub?: string;
  highlight?: boolean;
  pink?: boolean;
}> = ({ label, value, sub, highlight, pink }) => (
  <div className={`flex justify-between items-baseline py-1.5 border-b border-gray-800/60 last:border-0 ${highlight ? 'bg-rhive-pink/5 rounded px-1' : ''}`}>
    <span className="text-xs text-gray-400 shrink-0 mr-2">{label}</span>
    <div className="text-right">
      <span className={`text-sm font-mono font-bold ${pink ? 'text-rhive-pink' : 'text-white'}`}>{value}</span>
      {sub && <span className="text-xs text-gray-500 ml-1">{sub}</span>}
    </div>
  </div>
);

// Pitch bar chart row
const PitchBar: React.FC<{ bucket: PitchBucket; totalSlopeSqFt: number }> = ({ bucket, totalSlopeSqFt }) => {
  const pct = totalSlopeSqFt > 0 ? bucket.slopeAreaSqFt / totalSlopeSqFt : 0;
  return (
    <div className="flex items-center gap-2 py-1">
      <span className="text-xs font-mono text-rhive-pink w-10 shrink-0 text-right">{bucket.label}</span>
      <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-rhive-pink to-pink-300 rounded-full transition-all duration-700"
          style={{ width: `${pct * 100}%` }}
        />
      </div>
      <span className="text-xs font-mono text-gray-300 w-20 text-right shrink-0">
        {fmt(bucket.slopeSQ, 2)} SQ
      </span>
      <span className="text-xs text-gray-500 w-12 text-right shrink-0 hidden lg:block">
        {fmtPct(pct)}
      </span>
    </div>
  );
};

// Pricing breakdown tile
const PricingTile: React.FC<{
  label: string;
  mat: number;
  lab: number;
  ovrd: number;
  prof: number;
  total: number;
}> = ({ label, mat, lab, ovrd, prof, total }) => (
  <div className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-3 space-y-1">
    <p className="text-xs font-bold text-rhive-pink uppercase tracking-wider mb-2">{label}</p>
    <StatRow label="Materials"  value={fmtCurrency(mat)} />
    <StatRow label="Labor"      value={fmtCurrency(lab)} />
    <StatRow label="Overhead"   value={fmtCurrency(ovrd)} />
    <StatRow label="Profit"     value={fmtCurrency(prof)} />
    <div className="pt-1 border-t border-gray-700 flex justify-between items-center">
      <span className="text-xs font-bold text-gray-300 uppercase">Retail</span>
      <span className="text-base font-extrabold text-rhive-pink font-mono">{fmtCurrency(total)}</span>
    </div>
  </div>
);

// Payment option card
const PaymentCard: React.FC<{ label: string; amount: number; sub: string; isPrimary?: boolean }> = ({
  label, amount, sub, isPrimary,
}) => (
  <div className={`rounded-xl border p-3 text-center ${isPrimary ? 'border-rhive-pink/60 bg-rhive-pink/10' : 'border-gray-700 bg-gray-900/40'}`}>
    <p className="text-xs text-gray-400 mb-1">{label}</p>
    <p className={`text-xl font-extrabold font-mono ${isPrimary ? 'text-rhive-pink' : 'text-white'}`}>
      {fmtCurrency(amount)}
    </p>
    <p className="text-xs text-gray-500 mt-0.5">{sub}</p>
  </div>
);

// ── Main Component ────────────────────────────────────────────────────────────

interface MeasurementsSummaryProps {
  buildingData: BuildingData;
  surveyState: SurveyState;
  /** Display label: e.g. "BLDG 1" or the address short form */
  buildingLabel?: string;
}

// Tab type
type Tab = 'area' | 'linear' | 'pricing';

export const MeasurementsSummary: React.FC<MeasurementsSummaryProps> = ({
  buildingData,
  surveyState,
  buildingLabel = 'BLDG 1',
}) => {
  const { pricing } = usePricing();
  const [activeTab, setActiveTab] = useState<Tab>('area');

  const report = useMemo<DetailedMeasurementReport | null>(() => {
    try {
      return computeDetailedMeasurements(
        buildingData,
        pricing,
        surveyState.includedBuildingIds.length > 0 ? surveyState.includedBuildingIds : undefined,
        surveyState,
      );
    } catch (e) {
      console.error('[MeasurementsSummary] computeDetailedMeasurements failed:', e);
      return null;
    }
  }, [buildingData, pricing, surveyState]);

  if (!report) {
    return (
      <div className="p-8 text-center text-gray-400">
        <p>Unable to compute measurements. Please check building data.</p>
      </div>
    );
  }

  const { linear, pricing: p, pitchBuckets } = report;

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'area',    label: 'Area & Pitch',  icon: '⬡' },
    { id: 'linear',  label: 'Linear',        icon: '─' },
    { id: 'pricing', label: 'Pricing',       icon: '$' },
  ];

  // ── Flat roofing membrane upgrade options
  const membraneOptions = [
    { label: '.060 MIL TPO (Base)', value: p.tpo60Retail },
    { label: '.080 MIL TPO',        value: p.tpo80Retail },
    { label: '.060 MIL PVC',        value: p.pvc60Retail },
    { label: '.080 MIL PVC',        value: p.pvc80Retail },
  ];

  return (
    <div className="flex flex-col h-full bg-black text-white font-sans overflow-hidden">
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="shrink-0 px-5 pt-5 pb-3 border-b border-gray-700/60 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-white tracking-tight">
            {buildingLabel} — Measurements Summary
          </h2>
          <p className="text-xs text-gray-500 mt-0.5 font-mono uppercase tracking-wider">
            {report.roofTier.replace(/_/g, ' ')} · {report.totalFacets} facets · Dominant pitch {report.dominantPitch}/12
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-extrabold text-rhive-pink font-mono">
            {fmtCurrency(p.combinedTotal)}
          </p>
          <p className="text-xs text-gray-500">Combined Retail</p>
        </div>
      </div>

      {/* ── Tabs ───────────────────────────────────────────────────────────── */}
      <div className="shrink-0 flex gap-1 px-5 py-2 bg-gray-950/50 border-b border-gray-800">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-rhive-pink text-white shadow-[0_0_10px_rgba(236,2,139,0.35)]'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            <span className="font-mono">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Tab Content (scrollable) ────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">

        {/* ══ TAB: AREA & PITCH ══ */}
        {activeTab === 'area' && (
          <>
            {/* KPI row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Total Slope Area', value: `${fmt(report.totalSlopeSqFt)} ft²`, sub: `${fmt(report.totalSlopeSquares)} SQ` },
                { label: 'Pitched Area',     value: `${fmt(report.pitchedSlopeSqFt)} ft²`, sub: `${fmt(report.pitchedSlopeSqFt / 100)} SQ` },
                { label: 'Flat Area',        value: `${fmt(report.flatSlopeSqFt)} ft²`, sub: report.flatSlopeSqFt > 0 ? `${fmt(report.flatSlopeSqFt / 100)} SQ` : 'None' },
                { label: 'Facets',           value: `${report.totalFacets}`, sub: `${report.pitchedFacets} pitched / ${report.flatFacets} flat` },
              ].map(kpi => (
                <div key={kpi.label} className="bg-gray-900/60 border border-gray-700/50 rounded-xl p-3 text-center">
                  <p className="text-xs text-gray-500 mb-1">{kpi.label}</p>
                  <p className="text-base font-extrabold text-white font-mono">{kpi.value}</p>
                  <p className="text-xs text-gray-500">{kpi.sub}</p>
                </div>
              ))}
            </div>

            {/* Pitch breakdown */}
            <div className="bg-gray-900/40 border border-gray-700/40 rounded-xl p-4">
              <SectionHeader icon="⬡" title="Pitch Breakdown" accent={`${report.dominantPitch}/12 dominant`} />
              <div className="space-y-0.5">
                {pitchBuckets.length === 0 ? (
                  <p className="text-xs text-gray-500">No pitched facets detected.</p>
                ) : (
                  pitchBuckets.map(bucket => (
                    <PitchBar key={bucket.label} bucket={bucket} totalSlopeSqFt={report.pitchedSlopeSqFt} />
                  ))
                )}
              </div>

              {/* Pitch table */}
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-xs font-mono">
                  <thead>
                    <tr className="text-gray-500 border-b border-gray-700">
                      <th className="text-left pb-1">Pitch</th>
                      <th className="text-right pb-1">Ground SQ</th>
                      <th className="text-right pb-1">Multiplier</th>
                      <th className="text-right pb-1">Slope SQ</th>
                      <th className="text-right pb-1">%</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pitchBuckets.map(bucket => {
                      const mult = bucket.groundSQ > 0 ? bucket.slopeSQ / bucket.groundSQ : 1;
                      const pct = report.pitchedSlopeSqFt > 0 ? bucket.slopeAreaSqFt / report.pitchedSlopeSqFt : 0;
                      return (
                        <tr key={bucket.label} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                          <td className="py-1.5 text-rhive-pink font-bold">{bucket.label}</td>
                          <td className="py-1.5 text-right text-gray-300">{fmt(bucket.groundSQ, 2)}</td>
                          <td className="py-1.5 text-right text-gray-400">× {mult.toFixed(4)}</td>
                          <td className="py-1.5 text-right text-white font-bold">{fmt(bucket.slopeSQ, 2)}</td>
                          <td className="py-1.5 text-right text-gray-400">{fmtPct(pct)}</td>
                        </tr>
                      );
                    })}
                    <tr className="border-t border-gray-600 font-bold">
                      <td className="pt-2 text-white">TOTAL</td>
                      <td className="pt-2 text-right text-gray-300">{fmt((Object.values(report.pitchedGroundSQ) as number[]).reduce((a,b)=>a+b,0),2)}</td>
                      <td className="pt-2" />
                      <td className="pt-2 text-right text-rhive-pink">{fmt(report.sqRaw,2)}</td>
                      <td className="pt-2 text-right text-gray-400">100%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* SQ Summary */}
            <div className="bg-gray-900/40 border border-gray-700/40 rounded-xl p-4">
              <SectionHeader icon="⊞" title="Square Quantities" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Pitched */}
                <div className="space-y-0">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Asphalt / Pitched</p>
                  <StatRow label="SqRaw (slope area)" value={`${fmt(report.sqRaw, 2)} SQ`} />
                  <StatRow label={`Waste (${fmtPct(report.wastePct)})`} value={`${fmt(report.sqLoad - report.sqRaw, 2)} SQ`} />
                  <StatRow label="SqLoad (order qty)" value={`${fmt(report.sqLoad, 2)} SQ`} highlight pink />
                </div>
                {/* Flat */}
                {report.flatSlopeSqFt > 0 && (
                  <div className="space-y-0">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Flat / Membrane</p>
                    <StatRow label="SqRaw (flat area)"    value={`${fmt(report.flatSqRaw, 2)} SQ`} />
                    <StatRow label={`Waste (${fmtPct(report.flatWastePct)})`} value={`${fmt(report.flatSqLoad - report.flatSqRaw, 2)} SQ`} />
                    <StatRow label="SqLoad (order qty)"   value={`${fmt(report.flatSqLoad, 2)} SQ`} highlight pink />
                    {surveyState.flatRoofFeatures && (surveyState.flatRoofFeatures.roofCurbSmall > 0 || surveyState.flatRoofFeatures.roofCurbLarge > 0 || surveyState.flatRoofFeatures.parapetSq > 0) && (
                      <div className="mt-3 pt-2 border-t border-gray-800/40 space-y-0">
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1">Accessories / Details</p>
                        {surveyState.flatRoofFeatures.roofCurbSmall > 0 && (
                          <StatRow label="Roof Curb (Small)" value={`${surveyState.flatRoofFeatures.roofCurbSmall}`} />
                        )}
                        {surveyState.flatRoofFeatures.roofCurbLarge > 0 && (
                          <StatRow label="Roof Curb (Large)" value={`${surveyState.flatRoofFeatures.roofCurbLarge}`} />
                        )}
                        {surveyState.flatRoofFeatures.parapetSq > 0 && (
                          <StatRow label="Parapet Wall Area" value={`${fmt(surveyState.flatRoofFeatures.parapetSq, 2)} SQ`} />
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* ══ TAB: LINEAR MEASUREMENTS ══ */}
        {activeTab === 'linear' && (
          <>
            <div className="bg-gray-900/40 border border-gray-700/40 rounded-xl p-4">
              <SectionHeader icon="─" title="Linear Measurements" accent={`${report.roofTier.replace(/_/g,' ')} model`} />
              <p className="text-xs text-gray-500 mb-4">
                Tier-based ratios calibrated from Roofr reports at matching addresses.
              </p>

              {/* Primary categories */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-0">
                {[
                  { label: 'Eaves',           value: linear.eaves },
                  { label: 'Ridges',          value: linear.ridges },
                  { label: 'Hips',            value: linear.hips },
                  { label: 'Valleys',         value: linear.valleys },
                  { label: 'Rakes',           value: linear.rakes },
                  { label: 'Step Flashing',   value: linear.stepFlashing },
                  { label: 'Wall Flashing',   value: linear.wallFlashing },
                  { label: 'Unspecified',     value: linear.unspecified },
                  { label: 'Transitions',     value: linear.transitions },
                ].map(row => (
                  <StatRow key={row.label} label={row.label} value={fmtFt(row.value)} sub={`${fmt(row.value, 1)} ft`} />
                ))}
              </div>

              {/* Totals summary */}
              <div className="mt-4 pt-3 border-t border-gray-700 grid grid-cols-2 gap-4">
                <div className="text-center bg-gray-800/40 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-1">Total Perimeter Lineal Ft</p>
                  <p className="text-lg font-extrabold text-white font-mono">
                    {fmt(linear.eaves + linear.rakes, 0)} ft
                  </p>
                  <p className="text-xs text-gray-500">Eaves + Rakes</p>
                </div>
                <div className="text-center bg-gray-800/40 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-1">Total Ridge / Hip Lineal Ft</p>
                  <p className="text-lg font-extrabold text-white font-mono">
                    {fmt(linear.ridges + linear.hips, 0)} ft
                  </p>
                  <p className="text-xs text-gray-500">Ridges + Hips</p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ══ TAB: FULL PRICING PIPELINE ══ */}
        {activeTab === 'pricing' && (
          <>
            {/* Asphalt + Flat cost tiles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <PricingTile
                label={`Asphalt Roofing · ${fmt(report.sqLoad,2)} SQ`}
                mat={p.durationMat}
                lab={p.durationLab}
                ovrd={p.durationOvrd}
                prof={p.durationProf}
                total={p.durationRetail}
              />
              {report.flatSlopeSqFt > 0 && (
                <PricingTile
                  label={`.060 TPO Flat · ${fmt(report.flatSqLoad,2)} SQ`}
                  mat={p.tpo60Material}
                  lab={p.tpo60Labor}
                  ovrd={p.tpo60Overhead}
                  prof={p.tpo60Profit}
                  total={p.tpo60Retail}
                />
              )}
            </div>

            {/* Shingle Upgrade Options */}
            <div className="bg-gray-900/40 border border-gray-700/40 rounded-xl p-4">
              <SectionHeader icon="⬛" title="Shingle Upgrade Add-ons" />
              <div className="space-y-0">
                <StatRow label="Duration FLEX® upgrade" value={fmtCurrency(p.flexAddon)} sub="(+/SqLoad vs Duration)" />
                <StatRow label="GAF Woodland® upgrade"  value={fmtCurrency(p.designerAddon)} sub="(+/SqLoad)" />
                <StatRow label="GAF Grand Sequoia®"     value={fmtCurrency(p.premDesignerAddon)} sub="(+/SqLoad)" />
              </div>
            </div>

            {/* Flat membrane options */}
            {report.flatSlopeSqFt > 0 && (
              <div className="bg-gray-900/40 border border-gray-700/40 rounded-xl p-4">
                <SectionHeader icon="▭" title="Flat Membrane Options" />
                <div className="space-y-0">
                  {membraneOptions.map(opt => (
                    <StatRow key={opt.label} label={opt.label} value={fmtCurrency(opt.value)} />
                  ))}
                </div>
              </div>
            )}

            {/* Combined retail */}
            <div className="bg-rhive-pink/10 border border-rhive-pink/30 rounded-xl p-4">
              <SectionHeader icon="⊕" title="Combined Retail Total" />
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-300">Asphalt + Flat Total</span>
                <span className="text-2xl font-extrabold text-rhive-pink font-mono">{fmtCurrency(p.combinedTotal)}</span>
              </div>
            </div>

            {/* Payment plans */}
            <div className="bg-gray-900/40 border border-gray-700/40 rounded-xl p-4">
              <SectionHeader icon="₱" title="Payment Plans" />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <PaymentCard label="Cash / Full Pay" amount={p.durationRetail} sub="Best value" isPrimary />
                <PaymentCard label="18 Months · 0%" amount={p.pmt18} sub="per month (18 mo)" />
                <PaymentCard label="60 Months · 7.99%" amount={p.pmt60} sub="per month (60 mo)" />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MeasurementsSummary;
