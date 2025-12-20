import {
  getCoinDetails,
  getCoinOHLC,
  fetchPools,
  fetchTopPool,
} from '@/lib/coingecko.actions';
import { Converter } from '@/components/coin-details/Converter';
import LiveDataWrapper from '@/components/LiveDataWrapper';
import { TopGainersLosers } from '@/components/coin-details/TopGainersLosers';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatPrice, timeAgo } from '@/lib/utils';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

const CoinDetails = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const coinData = await getCoinDetails(id);

  const pool = coinData.asset_platform_id
    ? await fetchTopPool(coinData.asset_platform_id, coinData.contract_address)
    : await fetchPools(id);

  const coinOHLCData = await getCoinOHLC(id, 1, 'usd', 'hourly', 'full');

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
          coinId={id}
          poolId={pool.id}
          coin={coinData}
          coinOHLCData={coinOHLCData}
        >
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
                        className='overflow-hidden rounded-lg hover:bg-dark-400/30!'
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
        <Converter
          symbol={coinData.symbol}
          icon={coinData.image.small}
          priceList={coinData.market_data.current_price}
        />

        {/* Coin Details */}
        <div className='w-full mt-8 space-y-4'>
          <h4 className='section-title pb-3'>Coin Details</h4>
          <div className='coin-details-grid'>
            {coinDetails.map(({ label, value, link, linkText }, index) => (
              <div key={index} className='detail-card'>
                <p className='text-purple-100'>{label}</p>
                {link ? (
                  <div className='detail-link'>
                    <Link href={link} target='_blank'>
                      {linkText || label}
                    </Link>
                    <ArrowUpRight size={16} />
                  </div>
                ) : (
                  <p className='text-base font-medium'>{value}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Top Gainers / Losers */}
        <TopGainersLosers />
      </section>
    </main>
  );
};

export default CoinDetails;
