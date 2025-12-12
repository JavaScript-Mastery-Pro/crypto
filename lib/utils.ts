import { clsx, type ClassValue } from 'clsx';
import { CandlestickData, Time } from 'lightweight-charts';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(
  value: number,
  currency?: string,
  showSymbol?: boolean
) {

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

export function formatPercentage(change: number): string {
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
