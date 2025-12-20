'use client';

import { DataTable } from '@/components/DataTable';
import CoinHeader from './CoinHeader';
import { Separator } from './ui/separator';
import CandlestickChart from './CandlestickChart';
import { formatPrice, timeAgo } from '@/lib/utils';
import { useCoinGeckoWebSocket } from '@/hooks/useCoinGeckoWebSocket';

export default function LiveDataWrapper({
  coinId,
  poolId,
  coin,
  coinOHLCData,
  children,
}: LiveDataProps) {
  const { price, trades, ohlcv } = useCoinGeckoWebSocket({
    coinId,
    poolId,
  });

  console.log('=========poolId', poolId);
  const tradeColumns = [
    {
      header: 'Price',
      cellClassName: 'pl-5 py-5 font-medium',
      cell: (trade: Trade) => (trade.price ? formatPrice(trade.price) : '-'),
    },
    {
      header: 'Amount',
      cellClassName: 'py-4 font-medium',
      cell: (trade: Trade) => trade.amount?.toFixed(4) ?? '-',
    },
    {
      header: 'Value',
      cellClassName: 'font-medium',
      cell: (trade: Trade) => (trade.value ? formatPrice(trade.value) : '-'),
    },
    {
      header: 'Buy/Sell',
      cellClassName: 'font-medium',
      cell: (trade: Trade) => (
        <span
          className={trade.type === 'b' ? 'text-green-500' : 'text-red-500'}
        >
          {trade.type === 'b' ? 'Buy' : 'Sell'}
        </span>
      ),
    },
    {
      header: 'Time',
      cellClassName: 'pr-5',
      cell: (trade: Trade) =>
        trade.timestamp ? timeAgo(trade.timestamp) : '-',
    },
  ];

  return (
    <section className='size-full xl:col-span-2'>
      <CoinHeader
        name={coin.name}
        image={coin.image.large}
        livePrice={price?.usd ?? coin.market_data.current_price.usd}
        livePriceChangePercentage24h={
          price?.change24h ??
          coin.market_data.price_change_percentage_24h_in_currency.usd
        }
        priceChangePercentage30d={
          coin.market_data.price_change_percentage_30d_in_currency.usd
        }
        priceChange24h={coin.market_data.price_change_24h_in_currency.usd}
      />

      <Separator className='my-8 bg-purple-600' />

      {/* Trend Overview */}
      <div className='w-full'>
        <CandlestickChart
          data={coinOHLCData}
          liveOhlcv={ohlcv}
          coinId={coinId}
          mode='live'
          initialPeriod='daily'
        >
          <h4 className='section-title mt-2 pl-2'>Trend Overview</h4>
        </CandlestickChart>
      </div>

      <Separator className='my-8 bg-purple-600' />

      {/* Recent Trades */}
      <div className='w-full my-8 space-y-4'>
        <h4 className='section-title'>Recent Trades</h4>
        <div className='custom-scrollbar bg-dark-500 mt-5 rounded-xl overflow-hidden'>
          {trades.length > 0 ? (
            <DataTable
              columns={tradeColumns}
              data={trades}
              rowKey={(_, index) => index}
              tableClassName='bg-dark-500'
              headerClassName='text-purple-100'
              headerRowClassName='hover:bg-transparent text-sm'
              bodyRowClassName='hover:bg-transparent'
            />
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
