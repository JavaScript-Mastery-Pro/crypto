'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn, formatPercentage, formatPrice } from '@/lib/utils';

export default function CoinCard({ coin }: { coin: TopGainersLosers }) {
  const isPositive = coin.price_change_percentage_24h >= 0;

  return (
    <Link href={`/coins/${coin.id}`} id='coin-card' className='group'>
      <div className='header'>
        <div className='relative size-10 flex-shrink-0'>
          <Image src={coin.image} alt={coin.name} fill className='rounded-full object-cover bg-dark-400' />
        </div>
        <div className='overflow-hidden'>
          <h5 className='font-bold text-sm truncate group-hover:text-purple-400 transition-colors'>{coin.name}</h5>
          <span className='text-xs text-purple-100 uppercase'>{coin.symbol}</span>
        </div>
      </div>

      <div className='text-right'>
        <p className='font-bold text-sm'>{formatPrice(coin.current_price)}</p>
        <div
          className={cn(
            'flex items-center justify-end gap-1 text-xs font-bold',
            isPositive ? 'text-green-500' : 'text-red-500',
          )}
        >
          {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          <span>{formatPercentage(Math.abs(coin.price_change_percentage_24h))}</span>
        </div>
      </div>
    </Link>
  );
}
