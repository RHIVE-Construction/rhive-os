import React from 'react';
import { cn } from '../../lib/utils';

interface SheetContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SheetContext = React.createContext<SheetContextProps | undefined>(undefined);

const Sheet: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [open, setOpen] = React.useState(false);
  return <SheetContext.Provider value={{ open, setOpen }}>{children}</SheetContext.Provider>;
};

// Fix: Make SheetTrigger more robust to prevent cloneElement errors.
const SheetTrigger: React.FC<{ children: React.ReactNode; asChild?: boolean }> = ({ children }) => {
  const context = React.useContext(SheetContext);
  if (!context) throw new Error('SheetTrigger must be used within a Sheet');
  
  if (!React.isValidElement(children)) {
    return <>{children}</>
  }

  // Fix: Cast props to any to avoid errors with spread and onClick access on unknown type.
  const childProps = children.props as any;

  return React.cloneElement(children, {
    ...childProps,
    onClick: (e: React.MouseEvent<HTMLElement>) => {
        context.setOpen(true);
        if (childProps.onClick) {
            childProps.onClick(e);
        }
    }
  });
};

const SheetContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
  const context = React.useContext(SheetContext);
  if (!context) throw new Error('SheetContent must be used within a Sheet');

  return (
    <>
      {context.open && (
        <div
          className="fixed inset-0 z-40 bg-black/60"
          onClick={() => context.setOpen(false)}
        />
      )}
      <div
        className={cn(
          'fixed z-50 gap-4 bg-gray-900 p-6 shadow-lg transition ease-in-out duration-300',
          'inset-y-0 right-0 h-full w-full max-w-md border-l border-gray-800',
          context.open ? 'translate-x-0' : 'translate-x-full',
          className
        )}
      >
        {children}
        <button
          onClick={() => context.setOpen(false)}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          <span className="sr-only">Close</span>
        </button>
      </div>
    </>
  );
};

const SheetHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
    <div className={cn('flex flex-col space-y-2 text-center sm:text-left', className)}>{children}</div>
);

const SheetTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
    <h2 className={cn('text-lg font-semibold text-white', className)}>{children}</h2>
);

const SheetDescription: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
    <p className={cn('text-base text-gray-400', className)}>{children}</p>
);

export { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription };