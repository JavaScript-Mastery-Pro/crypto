import Image from 'next/image';

import CandlestickChart from '../CandlestickChart';
import { getCoinDetails, getCoinOHLC } from '@/lib/coingecko.actions';
import { formatPrice } from '@/lib/utils';

export const CoinOverview = async () => {
  const [coinData, coinOHLCData] = await Promise.all([
    getCoinDetails('bitcoin'),
    getCoinOHLC('bitcoin', 1, 'usd', 'hourly', 'full'),
  ]);

  return (
    <div id='coin-overview'>
      <CandlestickChart data={coinOHLCData} coinId='bitcoin'>
        <div className='header'>
          <Image
            src={coinData.image.large}
            alt={coinData.name}
            width={56}
            height={56}
          />
          <div className='info'>
            <p>
              {coinData.name} / {coinData.symbol.toUpperCase()}
            </p>
            <h1>{formatPrice(coinData.market_data.current_price.usd)}</h1>
          </div>
        </div>
      </CandlestickChart>
    </div>
  );
};
