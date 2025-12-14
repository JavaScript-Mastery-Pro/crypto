/* eslint-disable @typescript-eslint/no-explicit-any */
import { Separator } from '@/components/ui/separator';
import {
  getCoinDetails,
  getCoinOHLC,
  getTrendingCoins,
} from '@/lib/actions/ coingecko';
import { cn, formatPercentage, formatPrice, timeAgo } from '@/lib/utils';
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
import { TrendingDown, TrendingUp } from 'lucide-react';

const Home = async () => {
  const coinData = await getCoinDetails('bitcoin');
  const trendingCoins = await getTrendingCoins();
  const coinOHLCData = await getCoinOHLC(
    'bitcoin',
    30, // days
    'usd', // vs_currency
    'hourly', // interval
    'full' // precision
  );

  return (
    <main className='py-12 container size-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 items-center lg:gap-10 justify-center'>
      <section className='w-full h-full xl:col-span-2'>
        {/* Trend Overview */}
        <div className='w-full px-2 py-3 bg-dark-500 rounded-xl'>
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
      </section>

      <section className='size-full'>
        {/* Recent Trades */}
        <div className='w-full  py-3 bg-dark-500 rounded-xl'>
          <h4 className='text-2xl px-5'>Top Movers</h4>
          <Table>
            <TableHeader className='text-purple-100'>
              <TableRow className='hover:bg-transparent'>
                <TableHead className='pl-5 py-3 text-purple-100'>
                  Name
                </TableHead>
                <TableHead className='text-purple-100'>24h Change</TableHead>
                <TableHead className='pr-5 text-purple-100'>Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trendingCoins.coins
                .slice(0, 6)
                .map((coin: { item: any }, index: number) => {
                  const item = coin.item;
                  const isTrendingUp =
                    item.data.price_change_percentage_24h.usd > 0;

                  return (
                    <TableRow
                      key={index}
                      className='overflow-hidden border-none hover:!bg-dark-400 rounded-lg'
                    >
                      <TableCell className='font-bold'>
                        <Link
                          href={`/coins/${item.id}`}
                          className='pl-2 py-1 flex items-center gap-3'
                        >
                          <Image
                            src={item.large}
                            alt={item.name}
                            width={36}
                            height={36}
                            className='rounded-full'
                          />
                          <div>
                            <p className='text-base'>{item.name}</p>
                            <p className='text-purple-100 font-medium text-xs'>
                              {item.symbol}
                            </p>
                          </div>
                        </Link>
                      </TableCell>
                      <TableCell className='font-medium py-4 pr-5'>
                        <div
                          className={cn(
                            'flex gap-1 items-center text-sm font-medium',
                            isTrendingUp ? 'text-green-500' : 'text-red-500'
                          )}
                        >
                          <p>{formatPercentage(item.data.price)}</p>
                          {isTrendingUp ? (
                            <TrendingUp width={16} height={16} />
                          ) : (
                            <TrendingDown width={16} height={16} />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className='font-bold pr-2'>
                        {formatPrice(item.data.price)}
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </div>
      </section>
    </main>
  );
};

export default Home;
