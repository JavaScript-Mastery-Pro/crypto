import {
  getCoinDetails,
  getCoinOHLC,
  fetchPools,
} from '@/lib/coingecko.actions';
import { formatPrice, timeAgo } from '@/lib/utils';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
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

const CoinDetails = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const coinData = await getCoinDetails(id);
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
            <h4 className='text-2xl'>Exchange Listings</h4>
            <div className='custom-scrollbar exchange-container'>
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
                        className='overflow-hidden rounded-lg'
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
                        <TableCell className='exchange-pair'>
                          {ticker.base} / {ticker.target}
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
          <h4 className='text-2xl'>Coin Details</h4>
          <div className='coin-details-grid'>
            <div className='detail-card'>
              <p className='text-purple-100'>Market Cap</p>
              <p className='text-base font-medium'>
                {formatPrice(coin.marketCap)}
              </p>
            </div>
            <div className='detail-card'>
              <p className='text-purple-100 '>Market Cap Rank</p>
              <p className='text-base font-bold'># {coin.marketCapRank}</p>
            </div>
            <div className='detail-card'>
              <p className='text-purple-100 '>Total Volume</p>
              <p className='text-base font-medium'>
                {formatPrice(coin.totalVolume)}
              </p>
            </div>
            <div className='detail-card'>
              <p className='text-purple-100 '>Website</p>
              {coin.website ? (
                <div className='detail-link'>
                  <Link href={coin.website} target='_blank'>
                    Website
                  </Link>
                  <ArrowUpRight size={16} />
                </div>
              ) : (
                '-'
              )}
            </div>
            <div className='detail-card'>
              <p className='text-purple-100 '>Explorer</p>
              {coin.explorer ? (
                <div className='detail-link'>
                  <Link href={coin.explorer} target='_blank'>
                    Explorer
                  </Link>
                  <ArrowUpRight size={16} />
                </div>
              ) : (
                '-'
              )}
            </div>
            <div className='detail-card'>
              <p className='text-purple-100 '>Community Link</p>
              {coin.communityLink ? (
                <div className='detail-link'>
                  <Link href={coin.communityLink} target='_blank'>
                    Community
                  </Link>
                  <ArrowUpRight size={16} />
                </div>
              ) : (
                '-'
              )}
            </div>
          </div>
        </div>

        <p className='coin-description'>{coin.description}</p>
      </section>
    </main>
  );
};

export default CoinDetails;
