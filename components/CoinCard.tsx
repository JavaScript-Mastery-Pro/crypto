'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

import { formatCurrency, formatPercentage, cn } from '@/lib/utils';

export default function CoinCard({
  id,
  name,
  symbol,
  image,
  price,
  priceChangePercentage24h,
}: TopGainersLosers) {
  const isTrendingUp = priceChangePercentage24h > 0;

  return (
    <Link href={`/coins/${id}`} id='coin-card' className='flex justify-between'>
      <div className='header mb-0'>
        <div className='relative size-10 flex-shrink-0'>
          <Image
            src={image}
            alt={name}
            fill
            className='rounded-full object-cover bg-dark-400'
          />
        </div>
        <div className='overflow-hidden'>
          <h5 className='font-bold text-sm truncate group-hover:text-purple-400 transition-colors'>
            {name}
          </h5>
          <span className='text-xs text-purple-100 uppercase'>{symbol}</span>
        </div>
      </div>

      <div className='text-right space-y-2'>
        <p className='font-bold text-sm'>{formatCurrency(price)}</p>
        <div
          className={cn(
            'flex items-center justify-end gap-1 text-xs font-bold',
            isTrendingUp ? 'text-green-500' : 'text-red-500'
          )}
        >
          {isTrendingUp ? (
            <ArrowUpRight size={12} />
          ) : (
            <ArrowDownRight size={12} />
          )}
          <span>{formatPercentage(Math.abs(priceChangePercentage24h))}</span>
        </div>
      </div>
    </Link>
  );
}
