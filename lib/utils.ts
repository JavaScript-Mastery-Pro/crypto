import { clsx, type ClassValue } from 'clsx';
import { CandlestickData, Time } from 'lightweight-charts';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(
  value: number | null | undefined,
  currency?: string,
  showSymbol?: boolean
) {
  if (value === null || value === undefined || isNaN(value)) {
    return showSymbol !== false ? '$0.00' : '0.00';
  }

  if (showSymbol === undefined || showSymbol === true) {
    return value.toLocaleString(undefined, {
      style: 'currency',
      currency: currency?.toUpperCase() || 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
   return value.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
}

export function formatPercentage(change: number | null | undefined): string {
  if (change === null || change === undefined || isNaN(change)) {
    return '0.0%';
  }
  const formattedChange = change.toFixed(1);
  return `${formattedChange}%`;
}

export function trendingClasses(value: number) {
  const isTrendingUp = value > 0;

  return {
    textClass: isTrendingUp ? 'text-green-400' : 'text-red-400',
    bgClass: isTrendingUp ? 'bg-green-500/10' : 'bg-red-500/10',
    iconClass: isTrendingUp ? 'icon-up' : 'icon-down',
  };
}

export const convertOHLCData = (rawData: OHLCData[]): CandlestickData[] => {
  return rawData.map(([timestampMs, open, high, low, close]) => ({
    time: Math.floor(timestampMs / 1000) as Time,
    open: Number(open),
    high: Number(high),
    low: Number(low),
    close: Number(close),
  }));
};

export function timeAgo(date: string | number | Date): string {
  const now = new Date();
  const past = new Date(date);
  const diff = now.getTime() - past.getTime(); // difference in ms

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);

  if (seconds < 60) return 'just now';
  if (minutes < 60) return `${minutes} min`;
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''}`;
  if (days < 7) return `${days} day${days > 1 ? 's' : ''}`;
  if (weeks < 4) return `${weeks} week${weeks > 1 ? 's' : ''}`;

  // Format date as YYYY-MM-DD
  return past.toISOString().split('T')[0];
}