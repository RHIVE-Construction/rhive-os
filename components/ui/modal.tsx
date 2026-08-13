import React from 'react';
import { XIcon } from '../icons';
import { cn } from '../../lib/utils';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
}

export const Modal: React.FC<ModalProps> = ({ open, onClose, title, children, className, contentClassName }) => {
  if (!open) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        className={cn(
            "relative w-full max-w-lg m-4 bg-gray-900 border border-gray-700 rounded-lg shadow-xl text-white transform transition-all flex flex-col max-h-[90vh] overflow-hidden",
            className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-800 shrink-0">
          <h2 id="modal-title" className="text-lg font-semibold">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white" aria-label="Close">
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        <div className={cn("p-6 overflow-y-auto flex-1 min-h-0 flex flex-col", contentClassName)}>
          {children}
        </div>
      </div>
    </div>
  );
};