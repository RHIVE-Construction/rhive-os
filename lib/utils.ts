import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getStagePageId(stage: string = ''): string {
    const s = stage.toLowerCase().trim();
    if (s.includes('lead')) return 'E-26';
    if (s.includes('estimate')) return 'E-27';
    if (s.includes('quote')) return 'E-28';
    if (s.includes('sign')) return 'E-29';
    if (s.includes('schedule')) return 'E-30';
    if (s.includes('pre-install')) return 'E-31';
    if (s.includes('install')) return 'E-32';
    if (s.includes('warranty') || s.includes('punch')) return 'E-33';
    if (s.includes('payment')) return 'E-35';
    if (s.includes('invoic')) return 'E-34';
    if (s.includes('complet')) return 'E-36';
    if (s.includes('past')) return 'E-37';
    return 'E-15'; // Default project profile
}

export async function hashPassword(password: string): Promise<string> {
    const msgUint8 = new TextEncoder().encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
