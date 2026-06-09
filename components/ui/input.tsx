import * as React from 'react';
import { cn } from '../../lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const inputClipPath = "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)";

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, style, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        'flex h-11 w-full border border-gray-700 bg-black/40 px-4 py-2 text-base font-medium tracking-wide text-white transition-all placeholder:text-gray-500 focus:border-rhive-pink focus:outline-none focus:ring-1 focus:ring-rhive-pink/50 disabled:cursor-not-allowed disabled:opacity-50 font-sans',
        className
      )}
      ref={ref}
      style={{ clipPath: inputClipPath, ...style }}
      {...props}
    />
  );
});
Input.displayName = 'Input';

export { Input };