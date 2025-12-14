import { Separator } from '@/components/ui/separator';
import { getCoinDetails, getCoinOHLC } from '@/lib/actions/ coingecko';
import { formatPrice, timeAgo } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import CandlestickChart from '@/components/CandlestickChart';
import { orderBook } from '@/lib/constants';

const Home = async () => {
  const coinData = await getCoinDetails('bitcoin');
  const coinOHLCData = await getCoinOHLC(
    'bitcoin',
    30, // days
    'usd', // vs_currency
    'hourly', // interval
    'full' // precision
  );

  return (
    <main className='py-12 container size-full grid grid-cols-1 lg:grid-cols-3 items-center gap-10 justify-center'>
      <section className='w-full h-full lg:col-span-2'>
        {/* Trend Overview */}
        <div className='w-full px-2 pt-5 bg-dark-500 rounded-xl'>
          <CandlestickChart data={coinOHLCData} coinId={'bitcoin'}>
            <div className='flex-1 mb-1 flex gap-3'>
              <Image
                src={coinData.image.large}
                alt={coinData.name}
                width={56}
                height={56}
              />
              <div className='flex flex-col'>
                <p className='flex text-purple-100 text-sm w-fit'>
                  {coinData.name} / {coinData.symbol.toUpperCase()}
                </p>
                <h1 className='text-2xl font-semibold'>
                  {formatPrice(coinData.market_data.current_price.usd)}
                </h1>
              </div>
            </div>
          </CandlestickChart>
        </div>

        <Separator className='my-8 bg-purple-600' />
      </section>

      <section className='size-full max-lg:mt-8 lg:col-span-1'>
        {/* Recent Trades */}
        <div className='w-full px-5 pt-5 bg-dark-500 rounded-xl'>
          <h4 className='text-2xl'>Exchange Listings</h4>
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
              {coinData.tickers
                .slice(0, 7)
                .map((ticker: Ticker, index: number) => (
                  <TableRow key={index} className='overflow-hidden rounded-lg'>
                    <TableCell className=' text-green-500 font-bold'>
                      <Link
                        href={ticker.trade_url}
                        target='_blank'
                        className='py-4 pl-3'
                      >
                        {ticker.market.name}
                      </Link>
                    </TableCell>
                    <TableCell className='font-medium py-4 pr-5'>
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

        {/* Recent Trades */}
        <div className='w-full mt-8 space-y-4'>
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
        </div>
      </section>
    </main>
  );
};

export default Home;
