'use client';

import Link from 'next/link';
import Image from 'next/image';
import { TrendingUp, TrendingDown } from 'lucide-react';

import { Badge } from './ui/badge';
import { formatPrice, formatPercentage, cn } from '@/lib/utils';

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
    <Link href={`/coins/${id}`} id='coin-card'>
      <div className='header'>
        <Image
          src={image}
          alt={name}
          width={48}
          height={48}
          className='image'
        />
        <div className='flex-1'>
          <h3>{name}</h3>
          <p className='symbol'>{symbol}</p>
        </div>
      </div>

      <div className='price-row'>
        <p className='price'>{formatPrice(price, 7)}</p>

        <div className='change'>
          <Badge
            className={cn('badge', isTrendingUp ? 'badge-up' : 'badge-down')}
          >
            {formatPercentage(priceChangePercentage24h)}
            {isTrendingUp ? <TrendingUp /> : <TrendingDown />}
          </Badge>
        </div>
      </div>

      <div className='stats'>
        <div className='stat-row'>
          <span className='label'>Market Cap Rank</span>
          <span className='value'>#{rank}</span>
        </div>

        <div className='stat-row'>
          <span className='label'>Volume 24h: </span>
          <span className='value'>{formatPrice(volume24)}</span>
        </div>
      </div>
    </Link>
  );
}
