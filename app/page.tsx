/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  getCategories,
  getCoinDetails,
  getCoinOHLC,
  getTrendingCoins,
} from '@/lib/coingecko.actions';
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

const Home = async () => {
  const coinData = await getCoinDetails('bitcoin');
  const trendingCoins = await getTrendingCoins();
  const categories = await getCategories();
  const coinOHLCData = await getCoinOHLC('bitcoin', 1, 'usd', 'hourly', 'full');

  return (
    <main className='main-container'>
      <section className='home-grid'>
        {/* Coin Overview */}
        <ChartSection
          coinData={coinData}
          coinOHLCData={coinOHLCData}
          coinId='bitcoin'
        />

        {/* Trending Coins */}
        <div className='top-movers-container'>
          <h4 className='section-title px-5'>Trending Coins</h4>
          <div className='table-scrollbar-container custom-scrollbar'>
            <Table>
              <TableHeader className='table-header-cell'>
                <TableRow className='hover:bg-transparent'>
                  <TableHead className='table-head-left'>Name</TableHead>
                  <TableHead className='table-header-cell table-cell'>
                    24h Change
                  </TableHead>
                  <TableHead className='table-head-right'>Price</TableHead>
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
                      <TableRow key={index} className='table-row-hover'>
                        <TableCell className='font-bold'>
                          <Link
                            href={`/coins/${item.id}`}
                            className='coin-link'
                          >
                            <Image
                              src={item.large}
                              alt={item.name}
                              width={36}
                              height={36}
                              className='coin-image'
                            />
                            <div>
                              <p className='text-sm md:text-base'>
                                {item.name}
                              </p>
                            </div>
                          </Link>
                        </TableCell>
                        <TableCell className='table-cell-change'>
                          <div
                            className={cn(
                              'price-change-indicator',
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
                        <TableCell className='table-cell-price'>
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

      {/* Categories */}
      <section className='w-full mt-7 space-y-4'>
        <div className='custom-scrollbar pt-8 mt-5 w-full bg-dark-500 rounded-xl overflow-hidden'>
          <h4 className='section-title pl-5'>Top Categories</h4>
          <Table>
            <TableHeader className='text-purple-100'>
              <TableRow className='hover:bg-transparent'>
                <TableHead className='exchange-header-left'>Category</TableHead>
                <TableHead className='text-purple-100'>Top Gainers</TableHead>
                <TableHead className='text-purple-100 pl-7'>
                  24h Change
                </TableHead>
                <TableHead className='text-purple-100'>Market Cap</TableHead>
                <TableHead className='text-purple-100'>24h Volume</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category: Category, index: number) => {
                const isTrendingUp = category.market_cap_change_24h > 0;
                return (
                  <TableRow
                    key={index}
                    className='md:text-base rounded-lg hover:!bg-dark-400/30'
                  >
                    <TableCell className='pl-5 font-bold'>
                      {category.name}
                    </TableCell>
                    <TableCell className='flex gap-1 mr-5'>
                      {category.top_3_coins.map((coin: string) => (
                        <Image
                          key={coin}
                          src={coin}
                          alt='Coin image'
                          width={28}
                          height={28}
                          className='rounded-full py-2'
                        />
                      ))}
                    </TableCell>
                    <TableCell className='font-medium'>
                      <div
                        className={cn(
                          'flex flex-1 gap-1 items-end pl-5 text-base font-medium',
                          {
                            'text-green-500':
                              category.market_cap_change_24h > 0,
                            'text-red-500': category.market_cap_change_24h < 0,
                          }
                        )}
                      >
                        <p>
                          {formatPercentage(category.market_cap_change_24h)}
                        </p>
                        {isTrendingUp ? (
                          <TrendingUp width={16} height={16} />
                        ) : (
                          <TrendingDown width={16} height={16} />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className='font-medium'>
                      {formatPrice(category.market_cap)}
                    </TableCell>
                    <TableCell className='font-medium'>
                      {formatPrice(category.volume_24h)}
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
