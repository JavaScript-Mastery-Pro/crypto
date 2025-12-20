import Image from 'next/image';

import CandlestickChart from '../CandlestickChart';
import { Skeleton } from '../ui/skeleton';
import { getCoinDetails, getCoinOHLC } from '@/lib/coingecko.actions';
import { formatPrice } from '@/lib/utils';

export const CoinOverview = async () => {
  const [coinData, coinOHLCData] = await Promise.all([
    getCoinDetails('bitcoin'),
    getCoinOHLC('bitcoin', 1, 'usd', 'hourly', 'full'),
  ]);

  return (
    <div className='chart-section-container'>
      <CandlestickChart data={coinOHLCData} coinId='bitcoin'>
        <div className='chart-section-header'>
          <Image
            src={coinData.image.large}
            alt={coinData.name}
            width={56}
            height={56}
            className='chart-section-image'
          />
          <div className='chart-section-info'>
            <p className='chart-section-coin-name'>
              {coinData.name} / {coinData.symbol.toUpperCase()}
            </p>
            <h1 className='chart-section-price'>
              {formatPrice(coinData.market_data.current_price.usd)}
            </h1>
          </div>
        </div>
      </CandlestickChart>
    </div>
  );
};

export const CoinOverviewFallback = () => (
  <div className='chart-section-container'>
    <div className='w-full h-full min-h-[420px] rounded-2xl bg-dark-500/60 p-6'>
      <div className='flex items-center gap-4 mb-6'>
        <Skeleton className='h-14 w-14 rounded-full skeleton' />
        <div className='flex flex-col gap-2 flex-1'>
          <Skeleton className='h-4 w-1/3 skeleton' />
          <Skeleton className='h-8 w-1/2 skeleton' />
        </div>
      </div>
      <Skeleton className='h-[280px] w-full rounded-xl skeleton' />
    </div>
  </div>
);
