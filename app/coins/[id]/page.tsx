import { Separator } from '@/components/ui/separator';
import { getCoinDetails, getCoinOHLC } from '@/lib/ coingecko.actions';
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
import CandlestickChart from '@/components/CandlestickChart';
import LiveCoinHeader from '@/components/LiveCoinHeader';

const CoinDetails = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const coinData = await getCoinDetails(id);
  const coinOHLCData = await getCoinOHLC(id, 30, 'usd', 'hourly', 'full');

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
    description: coinData.description.en, //
    totalVolume: coinData.market_data.total_volume.usd,
    website: coinData.links.homepage[0],
    explorer: coinData.links.blockchain_site[0],
    communityLink: coinData.links.subreddit_url,
    tickers: coinData.tickers,
  };

  return (
    <main className='py-12 container size-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 items-center gap-6 xl:gap-10 justify-center'>
      <section className='size-full xl:col-span-2'>
        {/* Coin Details - Live */}
        <LiveCoinHeader coinId={coin.id} name={coin.name} image={coin.image} />

        <Separator className='my-8 bg-purple-600' />

        {/* Trend Overview */}
        <div className='w-full'>
          <h4 className='text-2xl mb-4'>Trend Overview</h4>
          <CandlestickChart data={coinOHLCData} coinId={id} />
        </div>

        <Separator className='my-8 bg-purple-600' />

        {/* Coin Details */}
        <div className='w-full grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-5'>
          <div className='text-base bg-dark-500 p-4 rounded-lg flex flex-col gap-1'>
            <p className='text-purple-100'>Market Cap</p>
            <p className='text-base font-medium'>
              {formatPrice(coin.marketCap)}
            </p>
          </div>
          <div className='text-base bg-dark-500 p-4 rounded-lg flex flex-col gap-1'>
            <p className='text-purple-100 '>Total Volume</p>
            <p className='text-base font-medium'>
              {formatPrice(coin.totalVolume)}
            </p>
          </div>
          <div className='text-base bg-dark-500 p-4 rounded-lg flex flex-col gap-1'>
            <p className='text-purple-100 '>Market Cap Rank</p>
            <p className='text-base font-bold'>{coin.marketCapRank}</p>
          </div>

          <div className='text-base bg-dark-500 p-4 rounded-lg flex flex-col gap-1'>
            <p className='text-purple-100 '>Website</p>
            {coin.website ? (
              <div className='flex items-center text-green-500 gap-1'>
                <Link href={coin.website} target='_blank'>
                  Website
                </Link>
                <ArrowUpRight size={16} />
              </div>
            ) : (
              '-'
            )}
          </div>
          <div className='text-base bg-dark-500 p-4 rounded-lg flex flex-col gap-1'>
            <p className='text-purple-100 '>Explorer</p>
            {coin.explorer ? (
              <div className='flex items-center text-green-500 gap-1'>
                <Link href={coin.explorer} target='_blank'>
                  Explorer
                </Link>
                <ArrowUpRight size={16} />
              </div>
            ) : (
              '-'
            )}
          </div>
          <div className='text-base bg-dark-500 p-4 rounded-lg flex flex-col gap-1'>
            <p className='text-purple-100 '>Community Link</p>
            {coin.communityLink ? (
              <div className='flex items-center text-green-500 gap-1'>
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

        {/* Order Book */}
        {/* <div className='w-full mt-8 space-y-4'>
          <h4 className='text-2xl'>Order Book</h4>
          <Table className='bg-dark-500 rounded-xl'>
            <TableHeader className='text-purple-100'>
              <TableRow className='hover:bg-transparent'>
                <TableHead className='pl-5 py-5 text-purple-100'>
                  Price (BTC)
                </TableHead>
                <TableHead className='text-purple-100'>Amount (BTC)</TableHead>
                <TableHead className='pr-8 text-purple-100'>
                  Amount (ETH)
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orderBook.map((order, index) => (
                <TableRow key={index}>
                  <TableCell className='pl-5 py-4 font-medium'>
                    {order.price}
                  </TableCell>
                  <TableCell className='pl-5 font-medium'>
                    {order.amountBTC}
                  </TableCell>
                  <TableCell className='pr-5 font-medium'>
                    {order.amountETH}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div> */}
      </section>

      <section className='size-full max-lg:mt-8 lg:col-span-1'>
        {/* Converter */}
        <div className='w-full space-y-4'>
          <h4 className='text-2xl font-semibold'>
            {coin.symbol.toUpperCase()} Converter
          </h4>
          <Converter
            symbol={coin.symbol}
            icon={coin.icon}
            priceList={coin.priceList}
          />
        </div>

        {/* Recent Trades */}
        <div className='w-full mt-8 space-y-4'>
          <h4 className='text-2xl'>Exchange Listings</h4>
          <div className='custom-scrollbar bg-dark-500 rounded-xl overflow-hidden'>
            <Table>
              <TableHeader className='text-purple-100'>
                <TableRow className='hover:bg-transparent'>
                  <TableHead className='pl-5 py-5 text-purple-100'>
                    Exchange
                  </TableHead>
                  <TableHead className='text-purple-100'>Pair</TableHead>
                  <TableHead className='text-purple-100'>Price</TableHead>
                  <TableHead className='pr-5 text-purple-100 text-end'>
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
                          className='py-4 pl-3 block max-w-[110px] truncate'
                        >
                          {ticker.market.name}
                        </Link>
                      </TableCell>
                      <TableCell className='font-medium truncate max-w-[100%] py-4 pr-5'>
                        {ticker.base} / {ticker.target}
                      </TableCell>
                      <TableCell className='font-medium'>
                        {formatPrice(ticker.converted_last.usd)}
                      </TableCell>
                      <TableCell className='pr-5 text-end'>
                        {timeAgo(ticker.timestamp)}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Recent Trades */}
        {/* <div className='w-full mt-8 space-y-4'>
          <h4 className='text-2xl'>Recent Trades</h4>
          <Table className='bg-dark-500 rounded-xl'>
            <TableHeader className='text-purple-100'>
              <TableRow className='hover:bg-transparent'>
                <TableHead className='pl-5 py-5 text-purple-100'>
                  Time
                </TableHead>
                <TableHead className='text-purple-100'>Price (BTC)</TableHead>
                <TableHead className='pr-8 text-purple-100'>
                  Amount (ETH)
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orderBook.map((order, index) => (
                <TableRow key={index}>
                  <TableCell className='pl-5 py-4 font-medium'>
                    {order.price}
                  </TableCell>
                  <TableCell className='pl-5 font-medium'>
                    {order.amountBTC}
                  </TableCell>
                  <TableCell className='pr-5 font-medium'>
                    {order.amountETH}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div> */}
      </section>
    </main>
  );
};

export default CoinDetails;
