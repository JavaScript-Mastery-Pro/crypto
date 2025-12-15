'use client';

import { useLiveCoinPrice } from '@/hooks/useLiveCoinPrice';
import { formatPrice, formatPercentage, cn } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function CoinCard({
  coinId,
  name,
  symbol,
  image,
}: {
  coinId: string;
  name: string;
  symbol: string;
  image: string;
}) {
  const { prices, connected } = useLiveCoinPrice(coinId);
  const priceData = prices[coinId];

  const isTrendingUp = priceData
    ? priceData.priceChangePercentage24h > 0
    : false;

  return (
    <Link href={`/coins/${coinId}`}>
      <div className='bg-dark-500 hover:bg-dark-400/50 transition-all rounded-lg p-6 border border-purple-600/20 hover:border-purple-600/50 cursor-pointer h-full'>
        {/* Header */}
        <div className='flex items-center gap-3 mb-4'>
          <Image
            src={image}
            alt={name}
            width={40}
            height={40}
            className='rounded-full'
          />
          <div className='flex-1'>
            <h3 className='font-semibold text-lg'>{name}</h3>
            <p className='text-sm text-gray-400 uppercase'>{symbol}</p>
          </div>
          {connected ? (
            <span className='text-xs text-green-500'>● Live</span>
          ) : (
            <span className='text-xs text-gray-400'>○</span>
          )}
        </div>

        {/* Price */}
        {priceData ? (
          <>
            <div className='mb-3'>
              <p className='text-3xl font-bold'>
                {formatPrice(priceData.price)}
              </p>
            </div>

            {/* 24h Change */}
            <div className='flex items-center gap-2 mb-4'>
              <span
                className={cn('text-sm font-medium flex items-center gap-1', {
                  'text-green-600': isTrendingUp,
                  'text-red-500': !isTrendingUp,
                })}
              >
                {isTrendingUp ? (
                  <TrendingUp size={16} />
                ) : (
                  <TrendingDown size={16} />
                )}
                {isTrendingUp && '+'}
                {formatPercentage(priceData.priceChangePercentage24h)}
              </span>
              <span className='text-xs text-gray-400'>24h</span>
            </div>

            {/* Market Stats */}
            <div className='space-y-2 text-sm'>
              <div className='flex justify-between'>
                <span className='text-gray-400'>Market Cap</span>
                <span className='font-medium'>
                  {formatPrice(priceData.marketCap, 'USD', false)}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-400'>Volume 24h</span>
                <span className='font-medium'>
                  {formatPrice(priceData.volume24h, 'USD', false)}
                </span>
              </div>
            </div>
          </>
        ) : (
          <div className='animate-pulse space-y-3'>
            <div className='h-8 bg-dark-400 rounded w-3/4'></div>
            <div className='h-4 bg-dark-400 rounded w-1/2'></div>
            <div className='h-4 bg-dark-400 rounded w-full'></div>
            <div className='h-4 bg-dark-400 rounded w-full'></div>
          </div>
        )}
      </div>
    </Link>
  );
}
