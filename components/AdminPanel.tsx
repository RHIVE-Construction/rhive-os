import React, { useState, useEffect } from 'react';
import { usePricing } from '../contexts/PricingContext';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { PRICING_DATA as defaultPricing } from '../lib/pricing';
import { EstimateCalculatorTool } from './EstimateCalculatorTool';
import type { Pricing } from '../types';

export const AdminPanel: React.FC = () => {
  const { pricing, setPricing } = usePricing();
  const [localPricing, setLocalPricing] = useState(pricing);
  const [activeTab, setActiveTab] = useState('pricing');

  useEffect(() => {
    setLocalPricing(pricing);
  }, [pricing]);

  const handleNestedInputChange = (cat1: string, cat2: string, key: string, value: string) => {
    setLocalPricing(prev => {
        const valueAsNumber = Number(value);
        if (isNaN(valueAsNumber)) return prev;

        const newPricing = JSON.parse(JSON.stringify(prev)); // Deep copy
        
        if (cat2) {
            (newPricing as any)[cat1][cat2][key] = valueAsNumber;
        } else {
            (newPricing as any)[cat1][key] = valueAsNumber;
        }
        return newPricing;
    });
  };

   const handleDeeplyNestedInputChange = (cat1: string, cat2: string, cat3: string, value: string) => {
    setLocalPricing(prev => {
        const valueAsNumber = Number(value);
        if (isNaN(valueAsNumber)) return prev;

        const newPricing = JSON.parse(JSON.stringify(prev)) as Pricing;

        if (
            (cat1 === 'costPerSqByPitch' || cat1 === 'flatRoofing') &&
            (cat3 === 'materials' || cat3 === 'labor' || cat3 === 'overhead')
        ) {
            const section = newPricing[cat1];
            if (section && Object.prototype.hasOwnProperty.call(section, cat2)) {
                const item = section[cat2 as keyof typeof section];
                (item as any)[cat3] = valueAsNumber;
            }
        }
        
        return newPricing;
    });
  };


  const handleSave = () => {
    setPricing(localPricing);
    alert('Pricing saved!');
  };

  const handleReset = () => {
    setPricing(defaultPricing);
    alert('Pricing reset to defaults!');
  };

  const renderPricingPanel = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <PricingCategory title="Base Cost Per Square by Pitch">
            {Object.entries(localPricing.costPerSqByPitch).map(([pitch, costs]) => (
                <div key={pitch} className="p-2 border-t border-gray-700">
                    <h4 className="font-semibold text-base mb-1">{pitch}/12 Pitch</h4>
                     <PricingInput label="Materials" value={(costs as any).materials} onChange={(v) => handleDeeplyNestedInputChange('costPerSqByPitch', pitch, 'materials', v)} />
                     <PricingInput label="Labor" value={(costs as any).labor} onChange={(v) => handleDeeplyNestedInputChange('costPerSqByPitch', pitch, 'labor', v)} />
                     <PricingInput label="Overhead" value={(costs as any).overhead} onChange={(v) => handleDeeplyNestedInputChange('costPerSqByPitch', pitch, 'overhead', v)} />
                </div>
            ))}
        </PricingCategory>
        <PricingCategory title="Flat Roofing Cost Per Square">
            {Object.entries(localPricing.flatRoofing).map(([type, costs]) => (
                <div key={type} className="p-2 border-t border-gray-700">
                    <h4 className="font-semibold text-base mb-1">{type}</h4>
                     <PricingInput label="Materials" value={(costs as any).materials} onChange={(v) => handleDeeplyNestedInputChange('flatRoofing', type, 'materials', v)} />
                     <PricingInput label="Labor" value={(costs as any).labor} onChange={(v) => handleDeeplyNestedInputChange('flatRoofing', type, 'labor', v)} />
                     <PricingInput label="Overhead" value={(costs as any).overhead} onChange={(v) => handleDeeplyNestedInputChange('flatRoofing', type, 'overhead', v)} />
                </div>
            ))}
        </PricingCategory>
        <PricingCategory title="Profit Margin">
            <PricingInput label="Margin (%)" value={localPricing.profitMargin * 100} onChange={(v) => setLocalPricing(p=>({...p, profitMargin: Number(v)/100}))} />
        </PricingCategory>
        <PricingCategory title="Layer Add-ons (per SQ)">
            {Object.entries(localPricing.addons.layers).map(([key, value]) => (
            <PricingInput key={key} label={key} value={value} onChange={(v) => handleNestedInputChange('addons', 'layers', key, v)} />
        ))}
        </PricingCategory>
        <PricingCategory title="Feature Add-ons (flat)">
            {Object.entries(localPricing.addons.features).map(([key, value]) => (
            <PricingInput key={key} label={key} value={value} onChange={(v) => handleNestedInputChange('addons', 'features', key, v)} />
        ))}
        </PricingCategory>
        <PricingCategory title="Upgrades (per SQ)">
            {Object.entries(localPricing.upgrades).map(([key, value]) => (
            <PricingInput key={key} label={key} value={value} onChange={(v) => handleNestedInputChange('upgrades', '', key, v)} />
        ))}
        </PricingCategory>
    </div>
  )

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-white mb-6">Pricing Configuration</h1>
      <Card>
        <CardHeader>
           <div className="border-b border-gray-700 mb-4">
              <nav className="flex space-x-4">
                  <button onClick={() => setActiveTab('pricing')} className={`py-2 px-4 ${activeTab === 'pricing' ? 'border-b-2 border-pink-500 text-pink-500' : 'text-gray-400'}`}>Live Pricing</button>
                  <button onClick={() => setActiveTab('calculator')} className={`py-2 px-4 ${activeTab === 'calculator' ? 'border-b-2 border-pink-500 text-pink-500' : 'text-gray-400'}`}>Estimate Calculator</button>
              </nav>
          </div>
        </CardHeader>
        <CardContent>
          {activeTab === 'pricing' && renderPricingPanel()}
          {activeTab === 'calculator' && <EstimateCalculatorTool />}
          
          {activeTab === 'pricing' && (
              <div className="mt-8 flex justify-end space-x-4">
              <Button variant="ghost" onClick={handleReset}>Reset to Defaults</Button>
              <Button onClick={handleSave}>Save Changes</Button>
              </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const PricingCategory: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-gray-800 p-4 rounded-lg">
        <h3 className="font-semibold mb-3">{title}</h3>
        <div className="space-y-2">{children}</div>
    </div>
);

const PricingInput: React.FC<{label: string, value: any, onChange: (value: string) => void}> = ({label, value, onChange}) => (
    <div className="flex items-center">
        <Label htmlFor={label} className="flex-1 capitalize">{label.replace(/([A-Z])/g, ' $1')}</Label>
        <Input id={label} type="number" value={value} onChange={e => onChange(e.target.value)} className="w-28"/>
    </div>
);