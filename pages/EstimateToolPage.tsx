import React, { useState, useEffect, useMemo } from 'react';
import { EstimatorFlow } from '../components/EstimatorFlow';
import { EstimateErrorBoundary } from '../components/EstimateErrorBoundary';
import { ProjectStageLayout, PIPELINE } from '../components/ProjectStageLayout';
import Card from '../components/Card';
import Button from '../components/Button';
import { useNavigation } from '../contexts/NavigationContext';
import { useMockDB } from '../contexts/MockDatabaseContext';
import { useGoogleMapsApi } from '../hooks/useGoogleMapsApi';
import { projectService, firestoreService, userLogService } from '../lib/firebaseService';
import { CalculatorIcon, CheckCircleIcon, PlusIcon, TrashIcon, ArrowRightIcon, MapPinIcon } from '../components/icons';
import { cn } from '../lib/utils';
import type { Place } from '../types';

interface BuildingEstimateItem {
    id: string;
    buildingName: string;
    roofSqft: number;
    pitch: string;
    stories: number;
    layers: number;
    systemKey: string;
    guttersLf: number;
    heatTraceLf: number;
}

const ROOF_SYSTEM_CATALOG: Record<string, { label: string; ratePerSq: number; category: 'Residential' | 'Commercial' }> = {
    'oc-duration':      { label: 'Owens Corning TruDefinition Duration (Architectural)', ratePerSq: 495, category: 'Residential' },
    'oc-flex':          { label: 'Owens Corning Duration Flex (SBS Class 4 Impact)',     ratePerSq: 565, category: 'Residential' },
    'oc-designer':      { label: 'Owens Corning Designer Series',                        ratePerSq: 645, category: 'Residential' },
    'tpo-60':           { label: '.060MIL Reinforced TPO Flat Membrane',                 ratePerSq: 780, category: 'Commercial' },
    'tpo-80':           { label: '.080MIL RhinoBond Commercial TPO Membrane',            ratePerSq: 890, category: 'Commercial' },
    'pvc-membrane':     { label: 'Chemical-Resistant Commercial PVC Membrane',           ratePerSq: 960, category: 'Commercial' },
    'repair-diagnostic':{ label: 'Targeted Roof Repair & Envelope Seal',                 ratePerSq: 350, category: 'Residential' },
};

const PITCH_MULTIPLIERS: Record<string, number> = {
    'Flat (0-2/12)': 1.0,
    'Low (3-5/12)': 1.05,
    'Standard (6-8/12)': 1.12,
    'Steep (9-12/12)': 1.25,
};

const ProjectEstimateWorkspace: React.FC<{ project: any }> = ({ project }) => {
    const { setActivePageId } = useNavigation();
    const isApiReady = useGoogleMapsApi();

    const isCommercial = (project?.project_type || '').toLowerCase().includes('commercial') ||
                         (project?.project_type || '').toLowerCase().includes('government');

    const [buildings, setBuildings] = useState<BuildingEstimateItem[]>([]);
    const [showSatelliteTool, setShowSatelliteTool] = useState(false);
    const [saving, setSaving] = useState(false);
    const [saveBanner, setSaveBanner] = useState('');
    const [notes, setNotes] = useState<string>(project?.estimate?.notes || project?.notes || '');

    // Hydrate buildings from project.estimate.buildings, project.buildings, or linked property
    useEffect(() => {
        let mounted = true;
        const init = async () => {
            if (project?.estimate?.buildings?.length > 0) {
                if (mounted) setBuildings(project.estimate.buildings);
                return;
            }

            let propBuildings: any[] = project?.buildings || [];
            if (propBuildings.length === 0 && project?.property_id) {
                const propRes = await firestoreService.getDocument('properties', project.property_id);
                if (propRes.success && (propRes.data as any)?.buildings?.length > 0) {
                    propBuildings = (propRes.data as any).buildings;
                }
            }

            const defaultSystem = isCommercial ? 'tpo-60' : 'oc-duration';
            const defaultPitch = isCommercial ? 'Flat (0-2/12)' : 'Standard (6-8/12)';

            if (propBuildings.length > 0) {
                if (mounted) {
                    setBuildings(propBuildings.map((b: any, idx: number) => ({
                        id: b.id || `BLDG-${idx + 1}`,
                        buildingName: b.name || `Building ${idx + 1}`,
                        roofSqft: Number(b.roof_sqft) || (isCommercial ? 8500 : 2800),
                        pitch: b.pitch || defaultPitch,
                        stories: Number(b.stories) || 1,
                        layers: 1,
                        systemKey: defaultSystem,
                        guttersLf: isCommercial ? 0 : 160,
                        heatTraceLf: 0,
                    })));
                }
            } else {
                if (mounted) {
                    setBuildings([{
                        id: 'BLDG-1',
                        buildingName: isCommercial ? 'Building A - Main Structure' : 'Main Residence',
                        roofSqft: isCommercial ? 10000 : 2800,
                        pitch: defaultPitch,
                        stories: isCommercial ? 2 : 1,
                        layers: 1,
                        systemKey: defaultSystem,
                        guttersLf: isCommercial ? 0 : 160,
                        heatTraceLf: 0,
                    }]);
                }
            }
        };
        init();
        return () => { mounted = false; };
    }, [project?.id]);

    const calcBuildingPrice = (b: BuildingEstimateItem) => {
        const sys = ROOF_SYSTEM_CATALOG[b.systemKey] || ROOF_SYSTEM_CATALOG['oc-duration'];
        const squares = (Number(b.roofSqft) || 0) / 100;
        const wasteFactor = 1.10;
        const pitchMult = PITCH_MULTIPLIERS[b.pitch] || 1.08;
        const layerAdder = b.layers > 1 ? (b.layers - 1) * 45 * squares : 0;
        const storyAdder = b.stories > 1 ? (b.stories - 1) * 20 * squares : 0;
        const guttersCost = (Number(b.guttersLf) || 0) * 14;
        const heatTraceCost = (Number(b.heatTraceLf) || 0) * 24;
        const baseRoof = squares * wasteFactor * sys.ratePerSq * pitchMult;
        return Math.round(baseRoof + layerAdder + storyAdder + guttersCost + heatTraceCost);
    };

    const summary = useMemo(() => {
        const breakdown = buildings.map(b => {
            const sys = ROOF_SYSTEM_CATALOG[b.systemKey] || ROOF_SYSTEM_CATALOG['oc-duration'];
            const price = calcBuildingPrice(b);
            return {
                buildingId: b.id,
                buildingName: b.buildingName,
                name: `${b.buildingName} — ${sys.label} (${(b.roofSqft / 100).toFixed(1)} SQ)`,
                cost: price,
                price,
            };
        });
        const total = breakdown.reduce((sum, item) => sum + item.price, 0);
        const totalSqft = buildings.reduce((sum, b) => sum + (Number(b.roofSqft) || 0), 0);
        const internalCost = Math.round(total * 0.65);
        return { breakdown, total, totalSqft, internalCost, margin: total - internalCost };
    }, [buildings]);

    const updateBuilding = (id: string, patch: Partial<BuildingEstimateItem>) => {
        setBuildings(prev => prev.map(b => b.id === id ? { ...b, ...patch } : b));
    };

    const handleAddBuilding = () => {
        const idx = buildings.length + 1;
        setBuildings(prev => [
            ...prev,
            {
                id: `BLDG-${Date.now()}-${idx}`,
                buildingName: isCommercial ? `Building ${String.fromCharCode(64 + idx)}` : idx === 2 ? 'Detached Garage' : `Structure ${idx}`,
                roofSqft: isCommercial ? 6000 : 900,
                pitch: isCommercial ? 'Flat (0-2/12)' : 'Standard (6-8/12)',
                stories: 1,
                layers: 1,
                systemKey: isCommercial ? 'tpo-60' : 'oc-duration',
                guttersLf: 0,
                heatTraceLf: 0,
            }
        ]);
    };

    const handleRemoveBuilding = (id: string) => {
        if (buildings.length <= 1) return;
        setBuildings(prev => prev.filter(b => b.id !== id));
    };

    const persistEstimate = async (advanceToQuote: boolean) => {
        if (!project?.id || saving) return;
        setSaving(true);
        setSaveBanner('');
        try {
            const updates: Record<string, any> = {
                estimate: {
                    buildings,
                    totalSqft: summary.totalSqft,
                    totalSquares: Number((summary.totalSqft / 100).toFixed(1)),
                    total: summary.total,
                    internalCost: summary.internalCost,
                    notes,
                    updatedAt: new Date().toISOString(),
                },
                quote: {
                    ...(project.quote || {}),
                    total: summary.total,
                    internalCost: summary.internalCost,
                    breakdown: summary.breakdown,
                    items: summary.breakdown,
                    status: advanceToQuote ? 'Draft' : (project.quote?.status || 'Estimated'),
                    sent_at: project.quote?.sent_at || new Date().toISOString(),
                },
                updated_at: new Date().toISOString(),
            };

            if (advanceToQuote) {
                updates.current_stage = 'Quote';
                updates.pizza_tracker = {
                    stage: 'Quote',
                    stageIndex: 2,
                    totalStages: PIPELINE.length,
                    subSteps: PIPELINE[2].defaultSubSteps.map((label, i) => ({ label, done: i === 0 })),
                    updatedAt: new Date().toISOString(),
                };
            }

            await projectService.updateRecord(project.id, updates, project._source);

            // Also sync building sqft back to linked property if property_id exists
            if (project.property_id) {
                await firestoreService.updateDocument('properties', project.property_id, {
                    buildings: buildings.map(b => ({
                        id: b.id,
                        name: b.buildingName,
                        roof_sqft: b.roofSqft,
                        pitch: b.pitch,
                        stories: b.stories,
                        roof_type: ROOF_SYSTEM_CATALOG[b.systemKey]?.label || '',
                        coordinates: {
                            lat: project?.property?.latitude || 40.7608,
                            lng: project?.property?.longitude || -111.8910,
                        }
                    })),
                });
            }

            await userLogService.logAction(
                advanceToQuote ? 'STAGE_CHANGE' : 'EDIT_RECORD',
                advanceToQuote
                    ? `${project.name || 'Project'} estimate finalized ($${summary.total.toLocaleString()}) — moved to Quote`
                    : `Estimate saved for ${project.name || 'Project'} ($${summary.total.toLocaleString()})`,
                {
                    recordId: project.id,
                    recordName: project.name || 'Unknown',
                    projectId: project.id,
                    stage: advanceToQuote ? 'Quote' : 'Estimate',
                    total: summary.total,
                }
            );

            if (advanceToQuote) {
                setActivePageId('E-28');
            } else {
                setSaveBanner('Estimate saved to project record.');
            }
        } catch (err) {
            console.error('[EstimateWorkspace] Failed to save estimate:', err);
            setSaveBanner('Unable to save estimate. Check connection.');
        } finally {
            setSaving(false);
        }
    };

    const projectAddress = project?.property_address || project?.property?.address || '';
    const satellitePlace: Place | undefined = projectAddress
        ? {
            address: projectAddress,
            latitude: Number(project?.property?.latitude) || 40.7608,
            longitude: Number(project?.property?.longitude) || -111.8910,
        }
        : undefined;

    return (
        <div className="p-6 md:p-8 space-y-6">
            {/* Top Action Strip: Toggle Satellite Visualizer & Add Building */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-gray-900/50 border border-gray-800 rounded-xl p-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#ec028b]/10 border border-[#ec028b]/30 flex items-center justify-center text-[#ec028b]">
                        <CalculatorIcon className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-white font-bold text-sm">
                            Property & Building Takeoff ({buildings.length} {buildings.length === 1 ? 'Structure' : 'Structures'} • {(summary.totalSqft / 100).toFixed(1)} Total SQ)
                        </p>
                        <p className="text-gray-400 text-xs flex items-center gap-1 mt-0.5">
                            <MapPinIcon className="w-3 h-3 text-[#ec028b]" />
                            {projectAddress || 'Address pending'}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => setShowSatelliteTool(prev => !prev)}
                        className={cn(
                            'px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider border transition-all',
                            showSatelliteTool
                                ? 'bg-[#ec028b] text-white border-[#ec028b] shadow-[0_0_15px_rgba(236,2,139,0.4)]'
                                : 'bg-black/60 text-gray-300 border-gray-700 hover:border-[#ec028b]/50 hover:text-white'
                        )}
                    >
                        {showSatelliteTool ? 'Close Satellite Map' : 'Satellite Roof Visualizer'}
                    </button>

                    <Button variant="secondary" size="sm" onClick={handleAddBuilding} className="flex items-center gap-1.5">
                        <PlusIcon className="w-4 h-4" />
                        Create Building
                    </Button>
                </div>
            </div>

            {saveBanner && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2">
                    <CheckCircleIcon className="w-4 h-4" />
                    {saveBanner}
                </div>
            )}

            {/* Embedded Satellite Roof Visualizer Drawer */}
            {showSatelliteTool && (
                <Card title="Interactive Satellite Facet & Measurement Visualizer">
                    <div className="h-[620px] rounded-xl overflow-hidden border border-gray-800 bg-black">
                        <EstimateErrorBoundary onReset={() => setShowSatelliteTool(false)}>
                            <EstimatorFlow
                                key={satellitePlace?.address || project?.id}
                                onClose={() => setShowSatelliteTool(false)}
                                initialPlace={satellitePlace}
                            />
                        </EstimateErrorBoundary>
                    </div>
                </Card>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Per-Building Takeoff Cards */}
                <div className="lg:col-span-2 space-y-4">
                    {buildings.map((b, idx) => {
                        const bPrice = calcBuildingPrice(b);
                        return (
                            <Card key={b.id} title={`Structure #${idx + 1}: ${b.buildingName}`}>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="md:col-span-2">
                                            <label className="block text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">
                                                Building / Roof Section Name
                                            </label>
                                            <input
                                                type="text"
                                                value={b.buildingName}
                                                onChange={e => updateBuilding(b.id, { buildingName: e.target.value })}
                                                className="w-full bg-black/60 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:border-[#ec028b] outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">
                                                Roof Area (Sq Ft)
                                            </label>
                                            <input
                                                type="number"
                                                min={100}
                                                step={50}
                                                value={b.roofSqft}
                                                onChange={e => updateBuilding(b.id, { roofSqft: Number(e.target.value) || 0 })}
                                                className="w-full bg-black/60 border border-gray-700 rounded-lg px-3 py-2 text-sm font-mono text-white focus:border-[#ec028b] outline-none"
                                            />
                                        </div>
                                    </div>

                                    {/* System Selection Pills (Highlighted when selected, un-highlighted when not) */}
                                    <div>
                                        <span className="block text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-2">
                                            Roof System Specification
                                        </span>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                            {Object.entries(ROOF_SYSTEM_CATALOG).map(([key, spec]) => {
                                                const isSelected = b.systemKey === key;
                                                return (
                                                    <button
                                                        key={key}
                                                        type="button"
                                                        onClick={() => updateBuilding(b.id, { systemKey: key })}
                                                        className={cn(
                                                            'text-left p-2.5 rounded-lg border text-xs transition-all flex items-center justify-between gap-2',
                                                            isSelected
                                                                ? 'bg-[#ec028b]/15 border-[#ec028b] text-white shadow-[0_0_12px_rgba(236,2,139,0.25)] font-bold'
                                                                : 'bg-gray-900/40 border-gray-800 text-gray-400 hover:border-gray-600 hover:text-gray-200'
                                                        )}
                                                    >
                                                        <span className="truncate">{spec.label}</span>
                                                        <span className={cn('font-mono shrink-0', isSelected ? 'text-[#ec028b]' : 'text-gray-500')}>
                                                            ${spec.ratePerSq}/SQ
                                                        </span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Pitch + Layers + Peripherals */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2 border-t border-gray-800/60">
                                        <div>
                                            <label className="block text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Pitch</label>
                                            <select
                                                value={b.pitch}
                                                onChange={e => updateBuilding(b.id, { pitch: e.target.value })}
                                                className="w-full bg-black/60 border border-gray-700 rounded-lg px-2.5 py-2 text-xs text-white focus:border-[#ec028b] outline-none"
                                            >
                                                {Object.keys(PITCH_MULTIPLIERS).map(p => (
                                                    <option key={p} value={p}>{p}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Tear-Off Layers</label>
                                            <div className="flex gap-1.5">
                                                {[1, 2, 3].map(layerNum => (
                                                    <button
                                                        key={layerNum}
                                                        type="button"
                                                        onClick={() => updateBuilding(b.id, { layers: layerNum })}
                                                        className={cn(
                                                            'flex-1 py-1.5 rounded border text-xs font-bold transition-all',
                                                            b.layers === layerNum
                                                                ? 'bg-[#ec028b] border-[#ec028b] text-white shadow-[0_0_8px_rgba(236,2,139,0.4)]'
                                                                : 'bg-black/50 border-gray-800 text-gray-500 hover:text-white'
                                                        )}
                                                    >
                                                        {layerNum}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Gutters (LF)</label>
                                            <input
                                                type="number"
                                                min={0}
                                                value={b.guttersLf}
                                                onChange={e => updateBuilding(b.id, { guttersLf: Number(e.target.value) || 0 })}
                                                className="w-full bg-black/60 border border-gray-700 rounded-lg px-2.5 py-1.5 text-xs font-mono text-white focus:border-[#ec028b] outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Heat Trace (LF)</label>
                                            <input
                                                type="number"
                                                min={0}
                                                value={b.heatTraceLf}
                                                onChange={e => updateBuilding(b.id, { heatTraceLf: Number(e.target.value) || 0 })}
                                                className="w-full bg-black/60 border border-gray-700 rounded-lg px-2.5 py-1.5 text-xs font-mono text-white focus:border-[#ec028b] outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-3 border-t border-gray-800/60">
                                        <span className="text-xs text-gray-400 font-mono">
                                            {(b.roofSqft / 100).toFixed(1)} Squares (+10% Waste) • Structure Subtotal:{' '}
                                            <span className="text-[#ec028b] font-bold">${bPrice.toLocaleString()}</span>
                                        </span>
                                        {buildings.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveBuilding(b.id)}
                                                className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 font-bold uppercase tracking-wider"
                                            >
                                                <TrashIcon className="w-3.5 h-3.5" />
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        );
                    })}

                    <Card title="Estimator Takeoff Notes">
                        <textarea
                            rows={3}
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                            placeholder="Record Roofr / EagleView report metrics, decking conditions, access notes, or multi-building staging details..."
                            className="w-full bg-black/60 border border-gray-800 rounded-lg p-3 text-sm text-gray-200 placeholder-gray-600 focus:border-[#ec028b] outline-none"
                        />
                    </Card>
                </div>

                {/* Right Column: Rollup Summary & Stage Advance */}
                <div className="space-y-6">
                    <Card title="Estimate Summary">
                        <div className="space-y-3">
                            {summary.breakdown.map(item => (
                                <div key={item.buildingId} className="flex justify-between items-start text-xs border-b border-gray-800/70 pb-2">
                                    <span className="text-gray-300 pr-2">{item.name}</span>
                                    <span className="font-mono text-white font-bold shrink-0">${item.price.toLocaleString()}</span>
                                </div>
                            ))}

                            <div className="pt-2 space-y-2 text-xs">
                                <div className="flex justify-between text-gray-400">
                                    <span>Total Roof Area</span>
                                    <span className="font-mono text-white">{summary.totalSqft.toLocaleString()} sqft ({(summary.totalSqft / 100).toFixed(1)} SQ)</span>
                                </div>
                                <div className="flex justify-between text-gray-400">
                                    <span>Internal TrueCost Floor</span>
                                    <span className="font-mono text-gray-300">${summary.internalCost.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-gray-400">
                                    <span>Projected Gross Margin</span>
                                    <span className="font-mono text-emerald-400 font-bold">+${summary.margin.toLocaleString()} (35%)</span>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-700 flex justify-between items-baseline">
                                <span className="text-xs font-bold uppercase tracking-wider text-gray-300">Estimated Total</span>
                                <span className="text-3xl font-black font-mono text-[#ec028b]">
                                    ${summary.total.toLocaleString()}
                                </span>
                            </div>

                            <div className="pt-4 space-y-3">
                                <Button
                                    id="est-save-btn"
                                    variant="secondary"
                                    className="w-full justify-center"
                                    disabled={saving}
                                    onClick={() => persistEstimate(false)}
                                >
                                    {saving ? 'Saving…' : 'Save'}
                                </Button>
                                <Button
                                    id="est-advance-quote-btn"
                                    className="w-full justify-center flex items-center gap-2 shadow-[0_0_20px_rgba(236,2,139,0.3)]"
                                    disabled={saving}
                                    onClick={() => persistEstimate(true)}
                                >
                                    <span>{saving ? 'Saving…' : 'Confirm & Create Quote'}</span>
                                    <ArrowRightIcon className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

const EstimateToolPage: React.FC = () => {
    const { activePageId, setActivePageId } = useNavigation();
    const { currentUser } = useMockDB();
    const isApiReady = useGoogleMapsApi();
    const [initialPlace, setInitialPlace] = useState<Place | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(false);

    // Employee Pipeline Stage 2 (E-27) renders the unified ProjectStageLayout Estimate Workspace
    const isEmployeeStageRoute = activePageId === 'E-27' && !!currentUser && currentUser.role !== 'Customer';

    const handleClose = () => {
        if (currentUser) {
            setActivePageId('E-01');
        } else {
            setActivePageId('P-00-V3');
        }
    };

    useEffect(() => {
        if (isEmployeeStageRoute) return;
        const addr = sessionStorage.getItem('estimateAddress');
        if (!addr) {
            setInitialPlace(undefined);
            return;
        }

        sessionStorage.removeItem('estimateAddress');

        if (isApiReady && window.google?.maps?.Geocoder) {
            setIsLoading(true);
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode({ address: addr }, (results: any, status: any) => {
                setIsLoading(false);
                if (status === 'OK' && results[0] && results[0].geometry) {
                    const loc = results[0].geometry.location;
                    setInitialPlace({
                        address: results[0].formatted_address || addr,
                        latitude: loc.lat(),
                        longitude: loc.lng()
                    });
                } else {
                    setInitialPlace({
                        address: addr,
                        latitude: 40.7608,
                        longitude: -111.8910
                    });
                }
            });
        } else {
            setInitialPlace({
                address: addr,
                latitude: 40.7608,
                longitude: -111.8910
            });
        }
    }, [isApiReady, isEmployeeStageRoute]);

    if (isEmployeeStageRoute) {
        return (
            <ProjectStageLayout stageLabel="Estimate" stagePageId="E-27">
                {(project) => <ProjectEstimateWorkspace project={project} />}
            </ProjectStageLayout>
        );
    }

    if (isLoading) {
        return (
            <div className="h-full w-full bg-black flex items-center justify-center text-white font-mono text-xs uppercase tracking-widest">
                Geocoding Property Address...
            </div>
        );
    }

    return (
        <div className="h-full w-full bg-black relative z-20">
            <EstimateErrorBoundary onReset={handleClose}>
                <EstimatorFlow key={initialPlace?.address || 'default'} onClose={handleClose} initialPlace={initialPlace} />
            </EstimateErrorBoundary>
        </div>
    );
};

export default EstimateToolPage;
