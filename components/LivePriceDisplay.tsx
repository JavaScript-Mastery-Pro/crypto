'use client';

import { useLiveCoinPrice } from '@/hooks/useLiveCoinPrice';
import { formatPrice, formatPercentage } from '@/lib/utils';
import { cn } from '@/lib/utils';

export default function LivePriceDisplay({ coinId }: { coinId: string }) {
  const { prices, connected } = useLiveCoinPrice([coinId]) as LiveCoinPrice;
  const priceData = prices[coinId];

  console.log('======Websocket connected', connected);
  console.log('======Websocket prices', prices);

  const isTrendingUp = priceData.priceChangePercentage24h > 0;

  return (
    <div className='space-y-2'>
      <div className='flex items-center gap-3'>
        <span className='text-sm text-green-500'>● Live</span>
        <span className='text-2xl font-bold'>
          {formatPrice(priceData.price)}
        </span>
        <span
          className={cn('text-sm font-medium', {
            'text-green-600': isTrendingUp,
            'text-red-500': !isTrendingUp,
          })}
        >
          {isTrendingUp && '+'}
          {formatPercentage(priceData.priceChangePercentage24h)}
        </span>
      </div>
      <div className='grid grid-cols-2 gap-2 text-xs text-gray-400'>
        <div>
          <span className='font-medium'>Market Cap:</span>{' '}
          {formatPrice(priceData.marketCap)}
        </div>
        <div>
          <span className='font-medium'>Volume 24h:</span>{' '}
          {formatPrice(priceData.volume24h)}
        </div>
      </div>
    </div>
  );
}
