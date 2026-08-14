import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import type { Pricing } from '../types';
import { PRICING_DATA as defaultPricing } from '../lib/pricing';

interface PricingContextType {
  pricing: Pricing;
  setPricing: (newPricing: Pricing) => void;
}

const PricingContext = createContext<PricingContextType | undefined>(undefined);

export const PricingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [pricing, setPricingState] = useState<Pricing>(() => {
    try {
      const storedPricing = localStorage.getItem('rhive-pricing');
      return storedPricing ? { ...defaultPricing, ...JSON.parse(storedPricing) } : defaultPricing;
    } catch (error) {
      console.error('Error loading pricing from localStorage', error);
      return defaultPricing;
    }
  });

  const setPricing = (newPricing: Pricing) => {
    try {
      localStorage.setItem('rhive-pricing', JSON.stringify(newPricing));
      setPricingState(newPricing);
    } catch (error) {
      console.error('Error saving pricing to localStorage', error);
    }
  };

  return (
    <PricingContext.Provider value={{ pricing, setPricing }}>
      {children}
    </PricingContext.Provider>
  );
};

export const usePricing = (): PricingContextType => {
  const context = useContext(PricingContext);
  if (context === undefined) {
    throw new Error('usePricing must be used within a PricingProvider');
  }
  return context;
};