/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  getCoinDetails,
  getCoinOHLC,
  getTopGainersLosers,
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

import ChartSection from '@/components/ChartSection';
import { TrendingDown, TrendingUp } from 'lucide-react';
import CoinCard from '@/components/CoinCard';

const Home = async () => {
  const trendingCoins = await getTrendingCoins();
  const topGainersLosers = await getTopGainersLosers();
  const coinData = await getCoinDetails('bitcoin');
  const coinOHLCData = await getCoinOHLC(
    'bitcoin',
    30,
    'usd',
    'hourly',
    'full'
  );

  return (
    <main className='py-6 md:py-12 container size-full space-y-6 md:space-y-6'>
      <section className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 items-start lg:items-center gap-6'>
        {/* Coin Overview */}
        <ChartSection
          coinData={coinData}
          coinOHLCData={coinOHLCData}
          coinId='bitcoin'
        />

        {/* Top Movers */}
        <div className='w-full flex flex-col justify-center h-full py-4 bg-dark-500 rounded-xl'>
          <h4 className='text-xl md:text-2xl px-4 md:px-5 mb-2'>Top Movers</h4>
          <div className='bg-dark-500 custom-scrollbar overflow-hidden'>
            <Table>
              <TableHeader className='text-purple-100'>
                <TableRow className='hover:bg-transparent'>
                  <TableHead className='pl-4 md:pl-5 py-3 text-purple-100'>
                    Name
                  </TableHead>
                  <TableHead className='text-purple-100 table-cell'>
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
                            className='pl-1 md:pl-2 py-1 md:py-2 xl:py-1 flex items-center gap-2 md:gap-3'
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
                        <TableCell className='font-medium py-4 pr-3 md:pr-5 table-cell'>
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
                        <TableCell className='font-bold pr-5 text-sm max-w-[100%] truncate'>
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

      <section className='space-y-6 mt-5'>
        <h4 className='text-xl md:text-2xl'>Top Gainers</h4>
        <div className='w-full grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6'>
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
      </section>
      <section className='space-y-6 mt-8'>
        <h4 className='text-xl md:text-2xl'>Top Losers</h4>
        <div className='w-full grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6'>
          {topGainersLosers.top_losers.map((coin: TopGainersLosersResponse) => (
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
          ))}
        </div>
      </section>
    </main>
  );
};

export default Home;
