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
    <div className='chart-section-container'>
      <CandlestickChart data={coinOHLCData} coinId={coinId}>
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
}
