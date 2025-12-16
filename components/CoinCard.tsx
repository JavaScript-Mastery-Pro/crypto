'use client';

import { formatPrice, formatPercentage, cn } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Badge } from './ui/badge';

export default function CoinCard({
  id,
  name,
  symbol,
  image,
  price,
  priceChangePercentage24h,
  volume24,
  rank,
}: TopGainersLosers) {
  const isTrendingUp = priceChangePercentage24h > 0;

  return (
    <Link href={`/coins/${id}`}>
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
        <>
          <div className='flex  justify-between items-center mb-5'>
            <p className='text-xl font-bold'>{formatPrice(price, 7)}</p>
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
                {formatPercentage(priceChangePercentage24h)}
                {isTrendingUp ? <TrendingUp /> : <TrendingDown />}
              </Badge>
            </div>
          </div>

          {/* Market Stats */}
          <div className='space-y-3'>
            <div className='flex gap-1 justify-between'>
              <span className='text-purple-100'>Market Cap Rank</span>
              <span className='font-medium'>#{rank}</span>
            </div>
            <div className='flex gap-1 justify-between'>
              <span className='text-purple-100'>Volume 24h: </span>
              <span className='font-medium'>{formatPrice(volume24)}</span>
            </div>
          </div>
        </>
      </div>
    </Link>
  );
}
