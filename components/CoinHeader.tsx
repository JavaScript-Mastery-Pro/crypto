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
    <div className='space-y-5 w-full'>
      {name ? (
        <div className='space-y-5 w-full'>
          <h3 className='text-3xl font-medium'>{name}</h3>
          <div className='flex gap-3 items-center'>
            <Image
              src={image}
              alt={name}
              width={77}
              height={77}
              className='size-[45px] sm:size-[50px] xl:size-[77px]'
            />
            <div className='flex gap-4'>
              <h1 className='text-3xl sm:text-5xl xl:text-6xl font-semibold'>
                {formatPrice(livePrice)}
              </h1>
              <Badge
                className={cn(
                  'font-medium mt-2 h-fit py-1 flex items-center gap-1',
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
          <div className='grid grid-cols-3 mt-8 gap-4 sm:gap-6 w-fit'>
            <div className='text-base border-r border-purple-600 flex flex-col gap-2'>
              <p className='text-purple-100 max-sm:text-sm'>Today</p>
              <div
                className={cn(
                  'flex flex-1 gap-1 items-end text-sm font-medium',
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

            <div className='text-base border-r border-purple-600 flex flex-col gap-2'>
              <p className='text-purple-100 max-sm:text-sm'>30 Days</p>
              <div
                className={cn(
                  'flex gap-1 flex-1 items-end text-sm font-medium',
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
              <p className='text-purple-100 max-sm:text-sm'>
                Price Change (24h)
              </p>
              <p
                className={cn('flex gap-1 items-center text-sm font-medium', {
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
          <div className='flex gap-3 items-center'>
            <div className='size-[45px] sm:size-[50px] xl:size-[77px] bg-dark-400/50 rounded-full animate-pulse' />
            <div className='flex gap-4'>
              <div className='h-12 sm:h-16 xl:h-20 w-48 sm:w-64 xl:w-80 bg-dark-400/50 rounded animate-pulse' />
              <div className='h-10 w-32 bg-dark-400/50 rounded-full animate-pulse mt-2' />
            </div>
          </div>
          <div className='grid grid-cols-3 mt-8 gap-4 sm:gap-6 w-fit'>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={cn(
                  'text-base flex flex-col gap-2',
                  i < 3 && 'border-r border-purple-600'
                )}
              >
                <p className='text-purple-100 max-sm:text-sm'>
                  {i === 1 ? 'Today' : i === 2 ? 'Market Cap' : 'Volume 24h'}
                </p>
                <div className='h-5 w-24 bg-dark-400/50 rounded animate-pulse' />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
