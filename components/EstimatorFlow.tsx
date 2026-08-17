import React from 'react';
import type { Place } from '../types';
import ContactUsTodayForm from './ContactUsTodayForm';
import { ArrowLeft } from 'lucide-react';

interface EstimatorFlowProps {
  onClose: () => void;
  initialPlace?: Place;
}

export const EstimatorFlow: React.FC<EstimatorFlowProps> = ({ onClose, initialPlace }) => {
  return (
    <div className="min-h-screen w-full bg-black text-white flex flex-col justify-start items-center p-6 md:p-12 relative overflow-y-auto">
      {/* Back button */}
      <div className="w-full max-w-4xl mb-8 flex justify-start z-30">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-gray-400 hover:text-rhive-pink transition-colors outline-none bg-transparent cursor-pointer"
        >
          <ArrowLeft size={16} />
          Go Back
        </button>
      </div>

      <div className="w-full max-w-4xl z-20">
        <ContactUsTodayForm 
          concern="Instant Estimate" 
          showTitle={true} 
          className="w-full"
        />
      </div>
    </div>
  );
};
