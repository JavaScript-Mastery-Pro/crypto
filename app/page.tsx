/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  getCoinDetails,
  getCoinOHLC,
  getTrendingCoins,
} from '@/lib/ coingecko.actions';
import { cn, formatPercentage, formatPrice } from '@/lib/utils';
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
import CoinCard from '@/components/CoinCard';
import { popularCoins } from '@/lib/constants';
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

  console.log('trendingCoins:', trendingCoins);

  return (
    <main className='py-6 md:py-12 container size-full space-y-6 md:space-y-6'>
      <section className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 items-start lg:items-center gap-6 xl:gap-10'>
        {/* Coin Overview */}
        <div className='w-full h-full xl:col-span-2 px-2 py-3 bg-dark-500 rounded-xl'>
          <CandlestickChart data={coinOHLCData} coinId={'bitcoin'}>
            <div className='flex-1 mb-2 flex gap-2 md:gap-3'>
              <Image
                src={coinData.image.large}
                alt={coinData.name}
                width={56}
                height={56}
                className='w-10 h-10 md:w-14 md:h-14'
              />
              <div className='flex flex-col'>
                <p className='flex text-purple-100 text-xs md:text-sm w-fit'>
                  {coinData.name} / {coinData.symbol.toUpperCase()}
                </p>
                <h1 className='text-xl md:text-2xl font-semibold'>
                  {formatPrice(coinData.market_data.current_price.usd)}
                </h1>
              </div>
            </div>
          </CandlestickChart>
        </div>

        {/* Top Movers */}
        <div className='w-full flex flex-col justify-center h-full py-4 bg-dark-500 rounded-xl'>
          <h4 className='text-xl md:text-2xl px-4 md:px-5 mb-2'>Top Movers</h4>
          <div className='bg-dark-500 rounded-xl custom-scrollbar overflow-hidden'>
            <Table>
              <TableHeader className='text-purple-100'>
                <TableRow className='hover:bg-transparent'>
                  <TableHead className='pl-4 md:pl-5 py-3 text-purple-100'>
                    Name
                  </TableHead>
                  <TableHead className='text-purple-100 hidden sm:table-cell'>
                    24h Change
                  </TableHead>
                  <TableHead className='pr-4 md:pr-5 text-purple-100'>
                    Price
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trendingCoins
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
                            className='pl-1 md:pl-2 py-1 flex items-center gap-2 md:gap-3'
                          >
                            <Image
                              src={item.large}
                              alt={item.name}
                              width={36}
                              height={36}
                              className='rounded-full w-8 h-8 md:w-9 md:h-9'
                            />
                            <div>
                              <p className='text-sm md:text-base'>
                                {item.name}
                              </p>
                            </div>
                          </Link>
                        </TableCell>
                        <TableCell className='font-medium py-4 pr-3 md:pr-5 hidden sm:table-cell'>
                          <div
                            className={cn(
                              'flex gap-1 items-center text-sm font-medium',
                              isTrendingUp ? 'text-green-500' : 'text-red-500'
                            )}
                          >
                            <p>
                              {formatPercentage(
                                item.data.price_change_percentage_24h.usd
                              )}
                            </p>
                            {isTrendingUp ? (
                              <TrendingUp width={16} height={16} />
                            ) : (
                              <TrendingDown width={16} height={16} />
                            )}
                          </div>
                        </TableCell>
                        <TableCell className='font-bold pr-5 text-sm max-w-[100px] truncate'>
                          {formatPrice(item.data.price)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </div>
        </div>
      </section>

      {/* <section className='w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6'>
        {popularCoins.map((coin) => (
          <CoinCard
            key={coin.coinId}
            coinId={coin.coinId}
            name={coin.name}
            symbol={coin.symbol}
            image={coin.image}
          />
        ))}
      </section> */}
    </main>
  );
};

export default Home;
