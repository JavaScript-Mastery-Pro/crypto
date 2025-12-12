import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { getCoinDetails, getCoinOHLC } from '@/lib/actions/ coingecko';
import { cn, formatPercentage, formatPrice } from '@/lib/utils';
import { ArrowUpRight, TrendingDown, TrendingUp } from 'lucide-react';

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
import { Converter } from '@/components/Converter';
import CandlestickChart from '@/components/CandlestickChart';
import { orderBook, similarCoins } from '@/lib/constants';

const CoinDetails = async () => {
  const coinData = await getCoinDetails('ethereum');
  const coinOHLCData = await getCoinOHLC('ethereum', 30);

  const coin = {
    id: coinData.id,
    name: coinData.name,
    symbol: coinData.symbol,
    image: coinData.image.large,
    price: coinData.market_data.current_price.usd,
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
  };

  const isTrendingUp = coin.priceChangePercentage24h > 0;

  console.log('Fetched coin details:', coinData);
  console.log('Processed coin details:', coin);

  return (
    <main className='py-12 container size-full grid grid-cols-1 lg:grid-cols-3 items-center gap-10 justify-center'>
      <section className='w-full lg:col-span-2'>
        {/* Coin Details */}
        <div className='space-y-5 w-full'>
          <h3 className='text-3xl font-medium'>{coin.name}</h3>
          <div className='flex gap-3 items-center'>
            <Image src={coin.image} alt={coin.name} width={77} height={77} />
            <div className='flex gap-4'>
              <h1 className='text-6xl font-semibold'>
                {formatPrice(coin.price)}
              </h1>
              <Badge
                className={cn(
                  'font-medium mt-2 h-fit py-1 flex items-center gap-1',
                  isTrendingUp
                    ? 'bg-green-500/20 text-green-600'
                    : 'bg-red-500/20 text-red-500'
                )}
              >
                {formatPercentage(coin.priceChangePercentage24h)}
                {isTrendingUp ? <TrendingUp /> : <TrendingDown />}
                (24h)
              </Badge>
            </div>
          </div>
          <div className='grid grid-cols-3 mt-8 gap-6 w-fit'>
            {/* Today */}
            <div className='text-base border-r border-purple-600 flex flex-col gap-2'>
              <p className='text-purple-100'>Today</p>
              <div
                className={cn('flex gap-1 items-center text-sm font-medium', {
                  'text-green-500': coin.priceChangePercentage24h > 0,
                  'text-red-500': coin.priceChangePercentage24h < 0,
                })}
              >
                <p>{formatPercentage(coin.priceChangePercentage24h)}</p>
                {isTrendingUp ? (
                  <TrendingUp width={16} height={16} />
                ) : (
                  <TrendingDown width={16} height={16} />
                )}
              </div>
            </div>
            {/* 30 Days */}
            <div className='text-base border-r border-purple-600 flex flex-col gap-2'>
              <p className='text-purple-100'>30 Days</p>
              <div
                className={cn('flex gap-1 items-center text-sm font-medium', {
                  'text-green-500': coin.priceChangePercentage30d > 0,
                  'text-red-500': coin.priceChangePercentage30d < 0,
                })}
              >
                <p>{formatPercentage(coin.priceChangePercentage30d)}</p>
                {isTrendingUp ? (
                  <TrendingUp width={16} height={16} />
                ) : (
                  <TrendingDown width={16} height={16} />
                )}
              </div>
            </div>
            {/* Rank */}
            <div className='text-base flex flex-col gap-2'>
              <p className='text-purple-100 '>24h Price Change</p>
              <p
                className={cn('flex gap-1 items-center text-sm font-medium', {
                  'text-green-500': coin.priceChange24h > 0,
                  'text-red-500': coin.priceChange24h < 0,
                })}
              >
                {formatPrice(coin.priceChange24h)}
              </p>
            </div>
          </div>
        </div>

        <Separator className='my-8 bg-purple-600' />

        {/* Trend Overview */}
        <div className='w-full'>
          <h4 className='text-2xl'>Trend Overview</h4>
          <CandlestickChart data={coinOHLCData} />
        </div>

        <Separator className='my-8 bg-purple-600' />

        {/* Coin Details */}
        <div className='w-full grid grid-cols-3 gap-5'>
          <div className='text-base bg-dark-500 p-4 rounded-lg flex flex-col gap-1'>
            <p className='text-purple-100 '>Market Cap</p>
            <p className='text-base font-bold'>{formatPrice(coin.marketCap)}</p>
          </div>
          <div className='text-base bg-dark-500 p-4 rounded-lg flex flex-col gap-1'>
            <p className='text-purple-100 '>Total Volume</p>
            <p className='text-base font-bold'>
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
        <div className='w-full mt-8 space-y-4'>
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
        </div>
      </section>

      <section className='size-full max-lg:mt-8 lg:col-span-1'>
        {/* Converter */}
        <div className='w-full space-y-4'>
          <h4 className='text-2xl font-semibold'>
            {coin.symbol.toUpperCase()} Converter
          </h4>
          <Converter />
        </div>

        {/* Similar Coins */}
        <div className='w-full mt-8 space-y-4'>
          <h4 className='text-2xl'>Similar Coins</h4>
          <ul className='flex bg-dark-500 py-4 rounded-lg flex-col gap-2'>
            {similarCoins.map((item) => (
              <li
                key={item.name}
                className='pr-5 pl-1 py-2 flex w-full gap-2 items-center'
              >
                <div className='flex w-[45%] items-center gap-2'>
                  <Image
                    src={coin.image}
                    alt={item.name}
                    width={40}
                    height={40}
                  />
                  <div className='flex flex-col font-medium'>
                    <p>{item.name}</p>
                    <span className='text-xs text-purple-100'>
                      {item.symbol}
                    </span>
                  </div>
                </div>
                <div
                  className={cn(
                    'flex flex-1 gap-1 items-center text-sm font-medium',
                    {
                      'text-green-500': coin.priceChangePercentage24h > 0,
                      'text-red-500': coin.priceChangePercentage24h < 0,
                    }
                  )}
                >
                  <p>{formatPercentage(coin.priceChangePercentage24h)}</p>
                  {isTrendingUp ? (
                    <TrendingUp width={16} height={16} />
                  ) : (
                    <TrendingDown width={16} height={16} />
                  )}
                </div>
                <div className='font-semibold'>{formatPrice(30000)}</div>
              </li>
            ))}
          </ul>
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

export default CoinDetails;
