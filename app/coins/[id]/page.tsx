import {
  getCoinDetails,
  getCoinOHLC,
  fetchPools,
  getTopGainersLosers,
} from '@/lib/coingecko.actions';
import { formatPrice, timeAgo } from '@/lib/utils';
import Link from 'next/link';
import CoinDetailCard from '@/components/CoinDetailCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  const coinOHLCData = await getCoinOHLC(id, 1, 'usd', 'hourly', 'full');
  const pool = await fetchPools(id);

  const coinDetails = [
    {
      label: 'Market Cap',
      value: formatPrice(coinData.market_data.market_cap.usd),
    },
    {
      label: 'Market Cap Rank',
      value: `# ${coinData.market_cap_rank}`,
    },
    {
      label: 'Total Volume',
      value: formatPrice(coinData.market_data.total_volume.usd),
    },
    {
      label: 'Website',
      value: '-',
      link: coinData.links.homepage[0],
      linkText: 'Website',
    },
    {
      label: 'Explorer',
      value: '-',
      link: coinData.links.blockchain_site[0],
      linkText: 'Explorer',
    },
    {
      label: 'Community Link',
      value: '-',
      link: coinData.links.subreddit_url,
      linkText: 'Community',
    },
  ];

  return (
    <main className='coin-details-main'>
      <section className='size-full xl:col-span-2'>
        <LiveDataWrapper
          coinOHLCData={coinOHLCData}
          coinId={id}
          pool={pool}
          coin={coinData}
        >
          {/* Exchange Listings - pass it as a child of a client component 
          // so it will be render server side */}
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
                  {coinData.tickers
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
            {coinData.symbol.toUpperCase()} Converter
          </h4>
          <Converter
            symbol={coinData.symbol}
            icon={coinData.image.small}
            priceList={coinData.market_data.current_price}
          />
        </div>

        {/* Coin Details */}
        <div className='w-full mt-8 space-y-4'>
          <h4 className='section-title pb-3'>Coin Details</h4>
          <div className='coin-details-grid'>
            {coinDetails.map((detail, index) => (
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

        {/* Top Gainers / Losers */}
        <Tabs defaultValue='top-gainers' className='mt-8  w-full'>
          <TabsList className='size-full p-1 bg-transparent border-b border-dark-500 rounded-none '>
            <TabsTrigger
              value='top-gainers'
              className='data-[state=active]:!border-none data-[state=active]:!bg-transparent flex justify-start !mb-0 py-2 text-lg font-semibold md:text-2xl'
            >
              Top Gainers
            </TabsTrigger>
            <TabsTrigger
              value='top-losers'
              className='data-[state=active]:!border-none data-[state=active]:!bg-transparent flex justify-start !mb-0 py-2 text-lg font-semibold md:text-2xl'
            >
              Top Losers
            </TabsTrigger>
          </TabsList>
          <TabsContent value='top-gainers' className='top-list'>
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
          </TabsContent>
          <TabsContent value='top-losers' className='top-list'>
            {topGainersLosers.top_losers.map(
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
          </TabsContent>
        </Tabs>
      </section>
    </main>
  );
};

export default CoinDetails;
