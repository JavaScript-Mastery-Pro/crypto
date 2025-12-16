'use client';

import { useCoinPrice } from '@/hooks/useCoinPrice';
import { formatPrice, formatPercentage, cn } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Badge } from './ui/badge';

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
  const { prices, connected } = useCoinPrice([coinId]);
  const priceData = prices[coinId];

  const isTrendingUp = priceData
    ? priceData.priceChangePercentage24h > 0
    : false;

  return (
    <Link href={`/coins/${coinId}`}>
      <div className='bg-dark-500 hover:bg-dark-400/50 transition-all rounded-lg p-5 border border-purple-600/20 hover:border-purple-600/50 cursor-pointer h-fit'>
        {/* Header */}
        <div className='flex gap-3 mb-4'>
          <Image
            src={image}
            alt={name}
            width={48}
            height={48}
            className='size-12 rounded-full'
          />
          <div className='flex-1'>
            <h3 className='font-semibold text-lg'>{name}</h3>
            <p className='text-sm text-gray-400 uppercase'>{symbol}</p>
          </div>
        </div>

        {/* Price */}
        {priceData ? (
          <>
            <div className='flex  justify-between items-center mb-5'>
              <p className='text-2xl font-bold'>
                {formatPrice(priceData.price)}
              </p>
              {/* 24h Change */}
              <div className='flex items-center gap-2'>
                <Badge
                  className={cn(
                    'font-medium h-fit py-1 flex items-center gap-1',
                    isTrendingUp
                      ? 'bg-green-500/20 text-green-600'
                      : 'bg-red-500/20 text-red-500'
                  )}
                >
                  {formatPercentage(priceData.priceChangePercentage24h)}
                  {isTrendingUp ? <TrendingUp /> : <TrendingDown />}
                </Badge>
              </div>
            </div>

            {/* Market Stats */}
            <div className='space-y-3 text-sm'>
              <div className='flex flex-row lg:flex-col xl:flex-row gap-1 justify-between'>
                <span className='text-gray-400'>Market Cap</span>
                <span className='font-medium'>
                  {formatPrice(priceData.marketCap)}
                </span>
              </div>
              <div className='flex flex-row lg:flex-col xl:flex-row gap-1 justify-between'>
                <span className='text-gray-400'>Volume 24h</span>
                <span className='font-medium'>
                  {formatPrice(priceData.volume24h)}
                </span>
              </div>
            </div>
          </>
        ) : (
          // Loading Skeleton
          <>
            <div className='flex justify-between items-center mb-5'>
              <div className='h-8 w-32 bg-dark-400/50 rounded animate-pulse' />
              <div className='h-7 w-24 bg-dark-400/50 rounded-full animate-pulse' />
            </div>
            <div className='space-y-3 text-sm'>
              <div className='h-5 w-full bg-dark-400/50 rounded animate-pulse' />
              <div className='h-5 w-full bg-dark-400/50 rounded animate-pulse' />
            </div>
          </>
        )}
      </div>
    </Link>
  );
}
