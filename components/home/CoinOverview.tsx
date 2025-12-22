import Image from 'next/image';
import CandlestickChart from '../CandlestickChart';
import { getCoinDetails, getCoinOHLC } from '@/lib/coingecko.actions';
import { formatPrice } from '@/lib/utils';

export const CoinOverview = async ({ coinId = 'bitcoin' }: { coinId?: string }) => {
  const [coin, ohlcData] = await Promise.all([getCoinDetails(coinId), getCoinOHLC(coinId, 1)]);

  return (
    <section id='coin-overview'>
      <CandlestickChart initialData={ohlcData} coinId={coinId}>
        <div className='header'>
          <Image src={coin.image.large} alt={coin.name} width={56} height={56} />
          <div className='info'>
            <p className='uppercase'>
              {coin.name} / {coin.symbol}
            </p>
            <h1>{formatPrice(coin.market_data.current_price.usd)}</h1>
          </div>
        </div>
      </CandlestickChart>
    </section>
  );
};
