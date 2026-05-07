import React, { useState, useMemo } from 'react';
import type { SurveyState, BuildingData, CalculationResult, RoofLayers, EaveOverhang } from '../types';
import { usePricing } from '../contexts/PricingContext';
import { calculateEstimate } from '../lib/calculations';
import { INITIAL_SURVEY_STATE } from '../lib/constants';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { formatCurrency } from '../lib/utils';
import { Separator } from './ui/separator';
import { Select, SelectItem } from './ui/select';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { XIcon } from './icons';
import { SQ_FEET_PER_SQUARE, SQ_METERS_TO_SQ_FEET } from '../lib/constants';

const mockCalculatorBuildingData = (pitchAreas: { pitch: number, sq: number }[]): BuildingData => {
    const facets = pitchAreas.map((pa, index) => {
        if (pa.sq <= 0) return null;
        const areaMeters = pa.sq * SQ_FEET_PER_SQUARE / SQ_METERS_TO_SQ_FEET;
        // Ensure pitch 0 is handled correctly for degrees calculation
        const pitchDegrees = pa.pitch === 0 ? 0 : Math.atan(pa.pitch / 12) * (180 / Math.PI);
        return {
            id: `facet_${index}`,
            areaMeters,
            pitchDegrees,
        };
    }).filter(Boolean); // Remove null entries for sq <= 0

    const totalAreaMeters = facets.reduce((sum, f) => sum + (f?.areaMeters || 0), 0);

    return {
        buildings: [{
            id: 'test_building',
            totalAreaMeters: totalAreaMeters,
            facets: facets as any, // Cast because we filtered nulls
        }],
        yearConstructed: 2000,
    };
};

export const EstimateCalculatorTool: React.FC = () => {
    const { pricing } = usePricing();
    const [testInputs, setTestInputs] = useState({
        pitchAreas: [{ pitch: 6, sq: 20 }],
        layers: '1' as RoofLayers,
        features: {
            chimneys: 0,
            swampCoolers: 0,
            skylights: 0,
        },
        gutters: { ...INITIAL_SURVEY_STATE.gutters },
        heatTrace: { ...INITIAL_SURVEY_STATE.heatTrace },
    });

    const buildingData = useMemo(() =>
        mockCalculatorBuildingData(testInputs.pitchAreas),
        [testInputs.pitchAreas]
    );

    const calcResult = useMemo<CalculationResult>(() => {
        const totalSq = testInputs.pitchAreas.reduce((sum, pa) => sum + (pa.sq || 0), 0);
        const tempSurveyState: SurveyState = {
            ...INITIAL_SURVEY_STATE,
            includedBuildingIds: ['test_building'],
            totalSq: totalSq,
            roofLayers: testInputs.layers,
            roofFeatures: testInputs.features,
            gutters: testInputs.gutters,
            heatTrace: testInputs.heatTrace,
        };
        return calculateEstimate({ buildingData, surveyState: tempSurveyState }, pricing);
    }, [buildingData, testInputs, pricing]);

    const handlePitchAreaChange = (index: number, field: 'pitch' | 'sq', value: string) => {
        const numValue = Number(value);
        if (isNaN(numValue) || numValue < 0) return;

        const newPitchAreas = [...testInputs.pitchAreas];
        newPitchAreas[index] = { ...newPitchAreas[index], [field]: numValue };
        setTestInputs(prev => ({ ...prev, pitchAreas: newPitchAreas }));
    };

    const handleAddPitch = () => {
        setTestInputs(prev => ({
            ...prev,
            pitchAreas: [...prev.pitchAreas, { pitch: 0, sq: 0 }],
        }));
    };

    const handleRemovePitch = (index: number) => {
        setTestInputs(prev => ({
            ...prev,
            pitchAreas: prev.pitchAreas.filter((_, i) => i !== index),
        }));
    };

    const handleNestedInputChange = (
        section: 'features' | 'gutters' | 'heatTrace',
        field: string,
        value: string | number | boolean
    ) => {
        setTestInputs(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: typeof value === 'boolean' ? value : Number(value)
            }
        }));
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="bg-gray-800/50">
                <CardHeader><CardTitle>Calculator Inputs</CardTitle></CardHeader>
                <CardContent className="space-y-6">
                    {/* Roof Inputs */}
                    <div className="space-y-4 p-4 border border-gray-700 rounded-lg">
                        <h3 className="font-semibold">Roof Inputs</h3>
                        <div>
                            <Label>Roof Areas by Pitch</Label>
                            <div className="space-y-2 mt-1">
                                {testInputs.pitchAreas.map((pa, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <Input type="number" placeholder="Pitch (0-18)" value={pa.pitch} onChange={e => handlePitchAreaChange(index, 'pitch', e.target.value)} min="0" max="18" />
                                        <Input type="number" placeholder="Squares" value={pa.sq} onChange={e => handlePitchAreaChange(index, 'sq', e.target.value)} min="0" />
                                        <Button variant="ghost" size="sm" onClick={() => handleRemovePitch(index)} className="p-2 h-auto">
                                            <XIcon className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                            <Button variant="ghost" size="sm" onClick={handleAddPitch} className="mt-2">+ Add Pitch</Button>
                        </div>
                        <div>
                            <Label htmlFor="layers">Layers</Label>
                            <Select id="layers" value={testInputs.layers} onChange={e => setTestInputs(p => ({ ...p, layers: e.target.value as RoofLayers }))}>
                                {['1', '2', '3', '4', 'IDK', 'Other'].map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                            </Select>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <InputGroup label="Chimneys" id="chimneys" type="number" value={testInputs.features.chimneys} onChange={e => handleNestedInputChange('features', 'chimneys', e.target.value)} />
                            <InputGroup label="Swamp Coolers" id="swampCoolers" type="number" value={testInputs.features.swampCoolers} onChange={e => handleNestedInputChange('features', 'swampCoolers', e.target.value)} />
                            <InputGroup label="Skylights" id="skylights" type="number" value={testInputs.features.skylights} onChange={e => handleNestedInputChange('features', 'skylights', e.target.value)} />
                        </div>
                    </div>
                    {/* Gutter Inputs */}
                    <div className="space-y-4 p-4 border border-gray-700 rounded-lg">
                        <div className="flex items-center space-x-2">
                            <Switch id="guttersEnabled" checked={testInputs.gutters.enabled} onCheckedChange={c => handleNestedInputChange('gutters', 'enabled', !!c)} />
                            <Label htmlFor="guttersEnabled" className="font-semibold cursor-pointer">Gutter Inputs</Label>
                        </div>
                        {testInputs.gutters.enabled && <div className="space-y-4 animate-fade-in">
                            <InputGroup label="Gutter Length (ft)" id="gutterLength" type="number" value={testInputs.gutters.length} onChange={e => handleNestedInputChange('gutters', 'length', e.target.value)} />
                            <InputGroup label="Miters (corners)" id="gutterMiters" type="number" value={testInputs.gutters.miters} onChange={e => handleNestedInputChange('gutters', 'miters', e.target.value)} />
                            <Label>Downspouts (by story)</Label>
                            <div className="grid grid-cols-2 gap-4">
                                <InputGroup label="1-Story" id="ds1" type="number" value={testInputs.gutters.downspouts1Story} onChange={e => handleNestedInputChange('gutters', 'downspouts1Story', e.target.value)} />
                                <InputGroup label="2-Story" id="ds2" type="number" value={testInputs.gutters.downspouts2Story} onChange={e => handleNestedInputChange('gutters', 'downspouts2Story', e.target.value)} />
                                <InputGroup label="3-Story" id="ds3" type="number" value={testInputs.gutters.downspouts3Story} onChange={e => handleNestedInputChange('gutters', 'downspouts3Story', e.target.value)} />
                                <InputGroup label="4-Story" id="ds4" type="number" value={testInputs.gutters.downspouts4Story} onChange={e => handleNestedInputChange('gutters', 'downspouts4Story', e.target.value)} />
                            </div>
                        </div>}
                    </div>
                    {/* Heat Trace Inputs */}
                    <div className="space-y-4 p-4 border border-gray-700 rounded-lg">
                        <div className="flex items-center space-x-2">
                            <Switch id="heatTraceEnabled" checked={testInputs.heatTrace.enabled} onCheckedChange={c => handleNestedInputChange('heatTrace', 'enabled', !!c)} />
                            <Label htmlFor="heatTraceEnabled" className="font-semibold cursor-pointer">Heat Trace Inputs</Label>
                        </div>
                        {testInputs.heatTrace.enabled && <div className="space-y-4 animate-fade-in">
                            <InputGroup label="Heat Trace Length (ft)" id="htLength" type="number" value={testInputs.heatTrace.length} onChange={e => handleNestedInputChange('heatTrace', 'length', e.target.value)} />
                            <Label>Downspouts (by story)</Label>
                            <div className="grid grid-cols-2 gap-4">
                                <InputGroup label="1-Story" id="ht-ds1" type="number" value={testInputs.heatTrace.downspouts1Story} onChange={e => handleNestedInputChange('heatTrace', 'downspouts1Story', e.target.value)} />
                                <InputGroup label="2-Story" id="ht-ds2" type="number" value={testInputs.heatTrace.downspouts2Story} onChange={e => handleNestedInputChange('heatTrace', 'downspouts2Story', e.target.value)} />
                                <InputGroup label="3-Story" id="ht-ds3" type="number" value={testInputs.heatTrace.downspouts3Story} onChange={e => handleNestedInputChange('heatTrace', 'downspouts3Story', e.target.value)} />
                                <InputGroup label="4-Story" id="ht-ds4" type="number" value={testInputs.heatTrace.downspouts4Story} onChange={e => handleNestedInputChange('heatTrace', 'downspouts4Story', e.target.value)} />
                            </div>
                            <div>
                                <Label htmlFor="eave">Eave Overhang</Label>
                                <Select id="eave" value={testInputs.heatTrace.eaveOverhang} onChange={e => handleNestedInputChange('heatTrace', 'eaveOverhang', e.target.value)}>
                                    {['None', 'Small', 'Medium', 'Large'].map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                                </Select>
                            </div>
                        </div>}
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-gray-800/50 sticky top-8">
                <CardHeader><CardTitle>Calculation Result</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                    <h3 className="text-2xl font-bold text-pink-400">Total Estimate: {formatCurrency(calcResult.liveTotal)}</h3>
                    <Separator />
                    <h4 className="font-semibold">Roof Breakdown</h4>
                    <BreakdownRow label="Materials" value={calcResult.roofEstimate.breakdown.materials} />
                    <BreakdownRow label="Labor" value={calcResult.roofEstimate.breakdown.labor} />
                    <BreakdownRow label="Overhead & Addons" value={calcResult.roofEstimate.breakdown.overhead} />
                    <BreakdownRow label="Profit" value={calcResult.roofEstimate.breakdown.profit} />
                    <BreakdownRow label="Roof Total" value={calcResult.roofEstimate.breakdown.total} isBold={true} />
                    <Separator />
                    <BreakdownRow label="Gutter Total" value={calcResult.gutterEstimate.total} isBold={true} />
                    <Separator />
                    <BreakdownRow label="Heat Trace Total" value={calcResult.heatTraceEstimate.total} isBold={true} />
                </CardContent>
            </Card>
        </div>
    );
};

const InputGroup: React.FC<{ label: string, id: string, value: any, onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void, type?: string }> =
    ({ label, id, ...props }) => (
        <div>
            <Label htmlFor={id} className="text-sm text-gray-300">{label}</Label>
            <Input id={id} className="mt-1" {...props} />
        </div>
    );

const BreakdownRow: React.FC<{ label: string, value: number, isBold?: boolean }> = ({ label, value, isBold }) => (
    <div className={`flex justify-between text-sm ${isBold ? 'font-bold text-white' : 'text-gray-300'}`}>
        <span>{label}</span>
        <span>{formatCurrency(value)}</span>
    </div>
);