import {
  getCoinDetails,
  getCoinOHLC,
  fetchPools,
  getTopGainersLosers,
} from '@/lib/coingecko.actions';
import { formatPrice, timeAgo } from '@/lib/utils';
import Link from 'next/link';
import CoinDetailCard from '@/components/CoinDetailCard';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Converter } from '@/components/Converter';
import LiveDataWrapper from '@/components/LiveDataWrapper';
import CoinCard from '@/components/CoinCard';

const CoinDetails = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const coinData = await getCoinDetails(id);
  const topGainersLosers = await getTopGainersLosers();
  const coinOHLCData = await getCoinOHLC(id, 30, 'usd', 'hourly', 'full');
  const pool = await fetchPools(id);

  const coin = {
    id: coinData.id,
    name: coinData.name,
    symbol: coinData.symbol,
    image: coinData.image.large,
    icon: coinData.image.small,
    price: coinData.market_data.current_price.usd,
    priceList: coinData.market_data.current_price,
    priceChange24h: coinData.market_data.price_change_24h_in_currency.usd,
    priceChangePercentage24h:
      coinData.market_data.price_change_percentage_24h_in_currency.usd,
    priceChangePercentage30d:
      coinData.market_data.price_change_percentage_30d_in_currency.usd,
    marketCap: coinData.market_data.market_cap.usd,
    marketCapRank: coinData.market_cap_rank,
    description: coinData.description.en,
    totalVolume: coinData.market_data.total_volume.usd,
    website: coinData.links.homepage[0],
    explorer: coinData.links.blockchain_site[0],
    communityLink: coinData.links.subreddit_url,
    tickers: coinData.tickers,
  };

  return (
    <main className='coin-details-main'>
      <section className='size-full xl:col-span-2'>
        <LiveDataWrapper
          coinOHLCData={coinOHLCData}
          coinId={id}
          pool={pool}
          coin={coin}
        >
          {/* Exchange Listings */}
          <div className='w-full mt-8 space-y-4'>
            <h4 className='section-title'>Exchange Listings</h4>
            <div className='custom-scrollbar mt-5 exchange-container'>
              <Table>
                <TableHeader className='text-purple-100'>
                  <TableRow className='hover:bg-transparent'>
                    <TableHead className='exchange-header-left'>
                      Exchange
                    </TableHead>
                    <TableHead className='text-purple-100'>Pair</TableHead>
                    <TableHead className='text-purple-100'>Price</TableHead>
                    <TableHead className='exchange-header-right'>
                      Last Traded
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {coin.tickers
                    .slice(0, 7)
                    .map((ticker: Ticker, index: number) => (
                      <TableRow
                        key={index}
                        className='overflow-hidden rounded-lg hover:!bg-dark-400/30'
                      >
                        <TableCell className=' text-green-500 font-bold'>
                          <Link
                            href={ticker.trade_url}
                            target='_blank'
                            className='exchange-link'
                          >
                            {ticker.market.name}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <div className='exchange-pair'>
                            <p className='truncate max-w-[100px] h-full'>
                              {ticker.base}
                            </p>
                            /
                            <p className='truncate max-w-[100px] h-full ml-2'>
                              {ticker.target}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className='font-medium'>
                          {formatPrice(ticker.converted_last.usd)}
                        </TableCell>
                        <TableCell className='exchange-timestamp'>
                          {timeAgo(ticker.timestamp)}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </LiveDataWrapper>
      </section>

      <section className='size-full max-lg:mt-8 lg:col-span-1'>
        {/* Converter */}
        <div className='w-full space-y-5'>
          <h4 className='converter-title'>
            {coin.symbol.toUpperCase()} Converter
          </h4>
          <Converter
            symbol={coin.symbol}
            icon={coin.icon}
            priceList={coin.priceList}
          />
        </div>

        {/* Coin Details */}
        <div className='w-full mt-8 space-y-4'>
          <h4 className='section-title pb-3'>Coin Details</h4>
          <div className='coin-details-grid'>
            {[
              {
                label: 'Market Cap',
                value: formatPrice(coin.marketCap),
              },
              {
                label: 'Market Cap Rank',
                value: `# ${coin.marketCapRank}`,
              },
              {
                label: 'Total Volume',
                value: formatPrice(coin.totalVolume),
              },
              {
                label: 'Website',
                value: '-',
                link: coin.website,
                linkText: 'Website',
              },
              {
                label: 'Explorer',
                value: '-',
                link: coin.explorer,
                linkText: 'Explorer',
              },
              {
                label: 'Community Link',
                value: '-',
                link: coin.communityLink,
                linkText: 'Community',
              },
            ].map((detail, index) => (
              <CoinDetailCard
                key={index}
                label={detail.label}
                value={detail.value}
                link={detail.link}
                linkText={detail.linkText}
              />
            ))}
          </div>
        </div>

        {/* Top Gainers */}
        <div className='space-y-6 mt-8'>
          <h4 className='section-title'>Top Gainers</h4>
          <div className='top-gainers-list'>
            {topGainersLosers.top_gainers.map(
              (coin: TopGainersLosersResponse) => (
                <CoinCard
                  key={coin.id}
                  id={coin.id}
                  name={coin.name}
                  symbol={coin.symbol}
                  image={coin.image}
                  price={coin.usd}
                  priceChangePercentage24h={coin.usd_24h_change}
                  volume24={coin.usd_24h_vol}
                  rank={coin.market_cap_rank}
                />
              )
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default CoinDetails;
