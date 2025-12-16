'use client';

import Image from 'next/image';
import { formatPrice } from '@/lib/utils';
import CandlestickChart from './CandlestickChart';

export default function ChartSection({
  coinData,
  coinOHLCData,
  coinId,
}: ChartSectionProps) {
  return (
    <div className='w-full h-full xl:col-span-2 px-2 py-3 bg-dark-500 rounded-xl'>
      <CandlestickChart data={coinOHLCData} coinId={coinId}>
        <div className='flex-1 mb-2 flex gap-2 md:gap-3'>
          <Image
            src={coinData.image.large}
            alt={coinData.name}
            width={56}
            height={56}
            className='w-10 h-10 md:w-14 md:h-14'
          />
          <div className='flex flex-col'>
            <p className='flex text-purple-100 text-xs md:text-sm w-fit'>
              {coinData.name} / {coinData.symbol.toUpperCase()}
            </p>
            <h1 className='text-xl md:text-2xl font-semibold'>
              {formatPrice(coinData.market_data.current_price.usd)}
            </h1>
          </div>
        </div>
      </CandlestickChart>
    </div>
  );
}
