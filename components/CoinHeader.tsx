'use client';

import { cn, formatPercentage, formatPrice } from '@/lib/utils';
import { TrendingDown, TrendingUp } from 'lucide-react';
import Image from 'next/image';
import { Badge } from './ui/badge';

export default function CoinHeader({
  livePriceChangePercentage24h,
  priceChangePercentage30d,
  name,
  image,
  livePrice,
  priceChange24h,
}: LiveCoinHeaderProps) {
  const isTrendingUp = livePriceChangePercentage24h > 0;

  return (
    <div className='coin-header-container'>
      {name ? (
        <div className='coin-header-container'>
          <h3 className='text-3xl font-medium'>{name}</h3>
          <div className='coin-header-info'>
            <Image
              src={image}
              alt={name}
              width={77}
              height={77}
              className='coin-header-image'
            />
            <div className='flex gap-4'>
              <h1 className='coin-header-price'>
                {formatPrice(livePrice)}
              </h1>
              <Badge
                className={cn(
                  'coin-header-badge',
                  isTrendingUp
                    ? 'bg-green-500/20 text-green-600'
                    : 'bg-red-500/20 text-red-500'
                )}
              >
                {formatPercentage(livePriceChangePercentage24h)}
                {isTrendingUp ? <TrendingUp /> : <TrendingDown />}
                (24h)
              </Badge>
            </div>
          </div>
          <div className='coin-header-stats'>
            <div className='coin-header-stat'>
              <p className='coin-header-stat-label'>Today</p>
              <div
                className={cn(
                  'coin-header-stat-value',
                  {
                    'text-green-500': livePriceChangePercentage24h > 0,
                    'text-red-500': livePriceChangePercentage24h < 0,
                  }
                )}
              >
                <p>{formatPercentage(livePriceChangePercentage24h)}</p>
                {isTrendingUp ? (
                  <TrendingUp width={16} height={16} />
                ) : (
                  <TrendingDown width={16} height={16} />
                )}
              </div>
            </div>

            <div className='coin-header-stat'>
              <p className='coin-header-stat-label'>30 Days</p>
              <div
                className={cn(
                  'coin-header-stat-value-30d',
                  {
                    'text-green-500': priceChangePercentage30d > 0,
                    'text-red-500': priceChangePercentage30d < 0,
                  }
                )}
              >
                <p>{formatPercentage(priceChangePercentage30d)}</p>
                {isTrendingUp ? (
                  <TrendingUp width={16} height={16} />
                ) : (
                  <TrendingDown width={16} height={16} />
                )}
              </div>
            </div>

            <div className='text-base flex flex-col gap-2'>
              <p className='coin-header-stat-label'>
                Price Change (24h)
              </p>
              <p
                className={cn('coin-header-stat-price', {
                  'text-green-500': priceChange24h > 0,
                  'text-red-500': priceChange24h < 0,
                })}
              >
                {formatPrice(priceChange24h)}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className='coin-header-info'>
            <div className='coin-header-skeleton-image' />
            <div className='flex gap-4'>
              <div className='coin-header-skeleton-price' />
              <div className='coin-header-skeleton-badge' />
            </div>
          </div>
          <div className='coin-header-stats'>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={cn(
                  'text-base flex flex-col gap-2',
                  i < 3 && 'border-r border-purple-600'
                )}
              >
                <p className='coin-header-stat-label'>
                  {i === 1 ? 'Today' : i === 2 ? 'Market Cap' : 'Volume 24h'}
                </p>
                <div className='coin-header-skeleton-stat' />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
