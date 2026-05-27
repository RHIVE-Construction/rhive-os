import React from 'react';
import { Input } from './ui/input';

interface EditableMetricProps {
    value: number;
    onChange: (newValue: number) => void;
    aiValue: number;
}

export const EditableMetric: React.FC<EditableMetricProps> = ({ value, onChange, aiValue }) => {
    return (
        <div className="relative">
            <Input 
                type="number" 
                value={value} 
                onChange={e => onChange(Number(e.target.value))} 
                className="h-12 text-2xl font-bold p-2 pr-16 text-center bg-gray-900/50 border-gray-700"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-base text-gray-400">
                SQ
            </span>
        </div>
    );
};