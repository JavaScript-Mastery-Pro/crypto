import {
  getCoinDetails,
  getCoinOHLC,
  fetchPools,
  fetchTopPool,
} from '@/lib/coingecko.actions';
import { Converter } from '@/components/Converter';
import LiveDataWrapper from '@/components/LiveDataWrapper';
import { ExchangeListings } from '@/components/ExchangeListings';
import { CoinDetailsSection } from '@/components/CoinDetailsSection';
import { TopGainersLosers } from '@/components/TopGainersLosers';

const CoinDetails = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const coinData = await getCoinDetails(id);
  const pool = coinData.asset_platform_id
    ? await fetchTopPool(coinData.asset_platform_id, coinData.contract_address)
    : await fetchPools(id);
  const coinOHLCData = await getCoinOHLC(id, 1, 'usd', 'hourly', 'full');

  return (
    <main className='coin-details-main'>
      <section className='size-full xl:col-span-2'>
        <LiveDataWrapper
          coinId={id}
          poolId={pool.id}
          coin={coinData}
          coinOHLCData={coinOHLCData}
        >
          {/* Exchange Listings - pass it as a child of a client component so it will be render server side */}
          <ExchangeListings coinData={coinData} />
        </LiveDataWrapper>
      </section>

      <section className='size-full max-lg:mt-8 lg:col-span-1'>
        {/* Converter */}
        <Converter
          symbol={coinData.symbol}
          icon={coinData.image.small}
          priceList={coinData.market_data.current_price}
        />

        {/* Coin Details */}
        <CoinDetailsSection coinData={coinData} />

        {/* Top Gainers / Losers */}
        <TopGainersLosers />
      </section>
    </main>
  );
};

export default CoinDetails;
