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
  const isThirtyDayUp = priceChangePercentage30d > 0;
  const isPriceChangeUp = priceChange24h > 0;

  const stats = [
    {
      label: 'Today',
      value: livePriceChangePercentage24h,
      isUp: isTrendingUp,
      formatter: formatPercentage,
      valueClassName: 'coin-header-stat-value',
      showIcon: true,
    },
    {
      label: '30 Days',
      value: priceChangePercentage30d,
      isUp: isThirtyDayUp,
      formatter: formatPercentage,
      valueClassName: 'coin-header-stat-value-30d',
      showIcon: true,
    },
    {
      label: 'Price Change (24h)',
      value: priceChange24h,
      isUp: isPriceChangeUp,
      formatter: formatPrice,
      valueClassName: 'coin-header-stat-price',
      showIcon: false,
    },
  ];

  return (
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
          <h1 className='coin-header-price'>{formatPrice(livePrice)}</h1>
          <Badge
            className={cn(
              'coin-header-badge',
              isTrendingUp
                ? 'bg-green-600/20 text-green-600'
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
        {stats.map((stat) => (
          <div key={stat.label} className='coin-header-stat'>
            <p className='coin-header-stat-label'>{stat.label}</p>
            <div
              className={cn(stat.valueClassName, {
                'text-green-500': stat.isUp,
                'text-red-500': !stat.isUp,
              })}
            >
              <p>{stat.formatter(stat.value)}</p>
              {stat.showIcon &&
                (stat.isUp ? (
                  <TrendingUp width={16} height={16} />
                ) : (
                  <TrendingDown width={16} height={16} />
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
