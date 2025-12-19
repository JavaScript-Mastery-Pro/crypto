'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import CoinHeader from './CoinHeader';
import { Separator } from './ui/separator';
import CandlestickChart from './CandlestickChart';
import { formatPrice, timeAgo } from '@/lib/utils';
import { useCoinGeckoWebSocket } from '@/hooks/useCoinGeckoWebSocket';

export default function LiveDataWrapper({
  coinId,
  pool,
  coin,
  coinOHLCData,
  children,
}: LiveDataProps) {
  const { price, trades, ohlcv } = useCoinGeckoWebSocket({
    coinId,
    poolId: pool.id,
    coinOHLCData,
  });

  // console.log('==== LiveDataWrapper coinOHLCData:', coinOHLCData);
  // console.log('==== LiveDataWrapper OHLCV:', ohlcv);

  return (
    <section className='size-full xl:col-span-2'>
      <CoinHeader
        name={coin.name}
        image={coin.image.large}
        livePrice={price?.usd ?? coin.market_data.current_price.usd}
        livePriceChangePercentage24h={
          price?.change24h ?? coin.market_data.price_change_percentage_24h_in_currency.usd
        }
        priceChangePercentage30d={coin.market_data.price_change_percentage_30d_in_currency.usd}
        priceChange24h={coin.market_data.price_change_24h_in_currency.usd}
      />

      <Separator className='my-8 bg-purple-600' />

      {/* Trend Overview */}
      <div className='w-full'>
        <h4 className='section-title'>Trend Overview</h4>
        <CandlestickChart
          data={coinOHLCData}
          liveOhlcv={ohlcv}
          coinId={coinId}
          mode='live'
        />
      </div>

      <Separator className='my-8 bg-purple-600' />

      {/* Recent Trades */}
      <div className='w-full my-8 space-y-4'>
        <h4 className='section-title'>Recent Trades</h4>
        <div className='custom-scrollbar bg-dark-500 mt-5 rounded-xl overflow-hidden'>
          {trades.length > 0 ? (
            <Table className='bg-dark-500'>
              <TableHeader className='text-purple-100'>
                <TableRow className='hover:bg-transparent text-sm'>
                  <TableHead className='pl-5 text-purple-100'>Price</TableHead>
                  <TableHead className='py-5 text-purple-100'>Amount</TableHead>
                  <TableHead className='pr-8 text-purple-100'>Value</TableHead>
                  <TableHead className='pr-8 text-purple-100'>
                    Buy/Sell
                  </TableHead>
                  <TableHead className='pr-8 text-purple-100'>Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trades?.map((trade, index) => (
                  <TableRow key={index} className='hover:bg-transparent'>
                    <TableCell className='pl-5 py-5 font-medium'>
                      {trade.price ? formatPrice(trade.price) : '-'}
                    </TableCell>
                    <TableCell className='py-4 font-medium'>
                      {trade.amount?.toFixed(4) ?? '-'}
                    </TableCell>
                    <TableCell className='font-medium'>
                      {trade.value ? formatPrice(trade.value) : '-'}
                    </TableCell>
                    <TableCell className='font-medium'>
                      <span
                        className={
                          trade.type === 'b' ? 'text-green-500' : 'text-red-500'
                        }
                      >
                        {trade.type === 'b' ? 'Buy' : 'Sell'}
                      </span>
                    </TableCell>
                    <TableCell className='pr-5'>
                      {trade.timestamp ? timeAgo(trade.timestamp) : '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className='text-center p-10 text-purple-100/50'>
              No recent trades
            </div>
          )}
        </div>
      </div>

      {children}
    </section>
  );
}
