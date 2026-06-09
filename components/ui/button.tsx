import React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap text-base font-bold tracking-wide uppercase ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rhive-pink focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
  {
    variants: {
      variant: {
        default: 'bg-rhive-pink text-white shadow-pink-glow hover:shadow-[0_0_25px_rgba(236,2,139,0.6)] hover:bg-rhive-pink/90',
        secondary: 'bg-gray-800 text-gray-100 border border-gray-700 hover:border-rhive-pink/50 hover:bg-gray-700',
        ghost: 'text-gray-400 hover:text-gray-100 hover:bg-gray-800/50',
      },
      size: {
        default: 'h-10 px-6 py-2',
        sm: 'h-8 px-4 text-base',
        lg: 'h-12 px-10 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const buttonClipPath = "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, asChild = false, style, ...props }, ref) => {
  const Comp = asChild ? Slot : 'button';
  return (
    <Comp 
      className={cn(buttonVariants({ variant, size, className }))} 
      ref={ref} 
      style={{ clipPath: buttonClipPath, ...style }}
      {...props} 
    />
  );
});
Button.displayName = 'Button';

export { Button, buttonVariants };