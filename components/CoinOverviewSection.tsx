import { getCoinDetails, getCoinOHLC } from '@/lib/coingecko.actions';
import CandlestickChart from './CandlestickChart';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';

export const CoinOverviewSection = async () => {
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
