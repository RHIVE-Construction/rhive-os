import React from 'react';
import { DocumentTextIcon, CreditCardIcon, PaintBrushIcon } from './icons';

interface ActionItem {
    id: string;
    title: string;
    description: string;
    icon: React.FC<any>;
    urgency: 'high' | 'medium' | 'low';
    actionText: string;
}

const actions: ActionItem[] = [
    {
        id: '1',
        title: 'Sign Contract',
        description: 'Your project estimate has been approved. Please sign the final contract to schedule installation.',
        icon: DocumentTextIcon,
        urgency: 'high',
        actionText: 'Review & Sign'
    },
    {
        id: '2',
        title: 'Select Shingle Color',
        description: 'Choose your desired Owens Corning Duration shingle color.',
        icon: PaintBrushIcon,
        urgency: 'medium',
        actionText: 'Open Selector'
    },
    {
        id: '3',
        title: 'Initial Deposit',
        description: 'A 30% material deposit is required to order your supplies.',
        icon: CreditCardIcon,
        urgency: 'high',
        actionText: 'Pay via Wallet'
    }
];

const ActionCard: React.FC<{ item: ActionItem }> = ({ item }) => {
    const isHigh = item.urgency === 'high';
    const chamferSize = 16;
    const clipPathValue = `polygon(${chamferSize}px 0, 100% 0, 100% calc(100% - ${chamferSize}px), calc(100% - ${chamferSize}px) 100%, 0 100%, 0 ${chamferSize}px)`;

    return (
        <div className="relative group isolate">
            <div 
                className={`absolute inset-0 transition-colors duration-300 -z-10 ${isHigh ? 'bg-red-900/20' : 'bg-black/40'}`}
                style={{ clipPath: clipPathValue }}
            />
            
            {/* Outline */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none -z-[5]" preserveAspectRatio="none">
                <path
                    d={`M ${chamferSize},0 L 100%,0 L 100%,calc(100% - ${chamferSize}px) L calc(100% - ${chamferSize}px),100% L 0,100% L 0,${chamferSize} Z`}
                    vectorEffect="non-scaling-stroke"
                    stroke={isHigh ? "rgba(239, 68, 68, 0.4)" : "rgba(255, 255, 255, 0.1)"}
                    strokeWidth="1"
                    fill="none"
                />
            </svg>

            {/* Content */}
            <div className="p-5 flex flex-col h-full">
                <div className="flex items-start justify-between mb-4">
                    <div className={`p-2 rounded-lg ${isHigh ? 'bg-red-500/10 text-red-400' : 'bg-[#ec028b]/10 text-[#ec028b]'}`}>
                        <item.icon className="w-6 h-6" />
                    </div>
                    {isHigh && (
                        <div className="flex items-center gap-1.5 px-2 py-1 bg-red-500/20 rounded text-red-400 text-base font-bold uppercase tracking-wider">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                            Action Required
                        </div>
                    )}
                </div>
                
                <h4 className="text-white font-bold mb-1">{item.title}</h4>
                <p className="text-base text-gray-400 mb-6 flex-grow">{item.description}</p>
                
                <button className={`w-full py-2.5 text-base font-bold transition-all ${isHigh ? 'bg-red-600 hover:bg-red-500 text-white' : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'}`}>
                    {item.actionText}
                </button>
            </div>
        </div>
    );
};

const CustomerActionCenter: React.FC = () => {
    return (
        <div className="mb-8">
            <h2 className="text-lg font-bold text-white mb-4 uppercase tracking-widest flex items-center gap-2">
                Action Center
                <span className="bg-red-500 text-white text-base px-2 py-0.5 rounded-full flex items-center justify-center">2</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {actions.map(action => (
                    <ActionCard key={action.id} item={action} />
                ))}
            </div>
        </div>
    );
};

export default CustomerActionCenter;
