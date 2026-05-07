import React from 'react';
import { cn } from '../lib/utils';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ title, children, footer, className = '', onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`relative bg-gray-900/80 backdrop-blur-md border border-gray-700/50 shadow-lg text-white transition-all duration-300 ease-in-out hover:border-[#ec028b]/50 hover:shadow-[0_0_25px_rgba(236,2,139,0.1)] ${className}`}
      style={{
        clipPath: 'polygon(24px 0, 100% 0, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0 100%, 0 24px)',
        WebkitClipPath: 'polygon(24px 0, 100% 0, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0 100%, 0 24px)',
      }}
    >
      {/* Decorative Corner Accents */}
      <div className="absolute top-0 left-0 w-8 h-[1px] bg-[#ec028b]/30"></div>
      <div className="absolute top-0 left-0 h-8 w-[1px] bg-[#ec028b]/30"></div>
      <div className="absolute bottom-0 right-0 w-8 h-[1px] bg-[#ec028b]/30"></div>
      <div className="absolute bottom-0 right-0 h-8 w-[1px] bg-[#ec028b]/30"></div>

      {/* 4. Card Content */}
      {title && (
        <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center bg-black/20">
          <h3 className="text-sm font-bold text-white dark:text-white tracking-widest uppercase">{title}</h3>
          <div className="h-1.5 w-1.5 rounded-full bg-[#ec028b] animate-pulse shadow-[0_0_10px_#ec028b]"></div>
        </div>
      )}
      <div className="p-6 flex-grow">
        {children}
      </div>
      {footer && (
        <div className="px-6 py-4 border-t border-white/5 bg-black/40">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
