/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  getCoinDetails,
  getCoinOHLC,
  getTopGainersLosers,
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
    <main className='main-container'>
      <section className='home-grid'>
        {/* Coin Overview */}
        <ChartSection
          coinData={coinData}
          coinOHLCData={coinOHLCData}
          coinId='bitcoin'
        />

        {/* Top Movers */}
        <div className='top-movers-container'>
          <h4 className='section-title-spacing'>Top Movers</h4>
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

      {/* Top Gainers / Losers */}
      <section className='space-y-6 mt-5'>
        <h4 className='section-title'>Top Gainers</h4>
        <div className='card-grid'>
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
        <h4 className='section-title'>Top Losers</h4>
        <div className='card-grid'>
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
