import React, { createContext, useContext, useState } from 'react';
import { ChevronDown } from '../icons';
import { cn } from '../../lib/utils';

interface AccordionContextProps {
  value: string | undefined;
  onValueChange: (value: string) => void;
  collapsible: boolean;
}

const AccordionContext = createContext<AccordionContextProps | undefined>(undefined);

const useAccordionContext = () => {
  const context = useContext(AccordionContext);
  if (!context) throw new Error('Accordion components must be used within an Accordion');
  return context;
};

interface AccordionItemContextProps {
  value: string;
  isOpen: boolean;
}

const AccordionItemContext = createContext<AccordionItemContextProps | undefined>(undefined);

const useAccordionItemContext = () => {
  const context = useContext(AccordionItemContext);
  if (!context) throw new Error('AccordionTrigger/Content must be used within an AccordionItem');
  return context;
};

const Accordion = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    type?: 'single' | 'multiple';
    collapsible?: boolean;
    defaultValue?: string;
  }
>(({ children, className, collapsible = true, defaultValue, ...props }, ref) => {
  const [value, setValue] = useState(defaultValue);

  const onValueChange = (newValue: string) => {
    if (collapsible && value === newValue) {
      setValue(undefined);
    } else {
      setValue(newValue);
    }
  };

  return (
    <AccordionContext.Provider value={{ value, onValueChange, collapsible }}>
      <div ref={ref} className={cn("space-y-4", className)} {...props}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
});
Accordion.displayName = 'Accordion';

const AccordionItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value: string }
>(({ className, value, children, ...props }, ref) => {
  const { value: contextValue } = useAccordionContext();
  const isOpen = contextValue === value;
  
  const chamfer = "16px";
  const clip = `polygon(${chamfer} 0, 100% 0, 100% calc(100% - ${chamfer}), calc(100% - ${chamfer}) 100%, 0 100%, 0 ${chamfer})`;

  return (
    <AccordionItemContext.Provider value={{ value, isOpen }}>
      <div 
        ref={ref} 
        className={cn("bg-black/40 border border-gray-800 transition-all duration-300", isOpen && "border-rhive-pink/50 shadow-pink-glow-sm", className)} 
        style={{ clipPath: clip }}
        {...props}
      >
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
});
AccordionItem.displayName = 'AccordionItem';

const AccordionTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => {
  const { onValueChange } = useAccordionContext();
  const { value, isOpen } = useAccordionItemContext();

  return (
    <button
      ref={ref}
      onClick={() => onValueChange(value)}
      aria-expanded={isOpen}
      className={cn(
        'flex w-full flex-1 items-center justify-between p-5 font-bold tracking-tight uppercase transition-all hover:bg-gray-800/50',
        isOpen ? "text-rhive-pink" : "text-gray-300",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown
        className={cn('h-5 w-5 shrink-0 transition-transform duration-300', isOpen && 'rotate-180 text-rhive-pink')}
      />
    </button>
  );
});
AccordionTrigger.displayName = 'AccordionTrigger';

const AccordionContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const { isOpen } = useAccordionItemContext();

  if (!isOpen) return null;
  
  return (
    <div
      ref={ref}
      className={cn('overflow-hidden text-base transition-all animate-fade-in', className)}
      {...props}
    >
      <div className="px-5 pb-6 pt-0">{children}</div>
    </div>
  );
});
AccordionContent.displayName = 'AccordionContent';

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };