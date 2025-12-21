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

  const tradeColumns = [
    {
      header: 'Price',
      cellClassName: 'price-cell',
      cell: (trade: Trade) => (trade.price ? formatPrice(trade.price) : '-'),
    },
    {
      header: 'Amount',
      cellClassName: 'amount-cell',
      cell: (trade: Trade) => trade.amount?.toFixed(4) ?? '-',
    },
    {
      header: 'Value',
      cellClassName: 'value-cell',
      cell: (trade: Trade) => (trade.value ? formatPrice(trade.value) : '-'),
    },
    {
      header: 'Buy/Sell',
      cellClassName: 'type-cell',
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
      cellClassName: 'time-cell',
      cell: (trade: Trade) =>
        trade.timestamp ? timeAgo(trade.timestamp) : '-',
    },
  ];

  return (
    <section id='live-data-wrapper'>
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

      <Separator className='divider' />

      <div className='trend'>
        <CandlestickChart
          data={coinOHLCData}
          liveOhlcv={ohlcv}
          coinId={coinId}
          mode='live'
          initialPeriod='daily'
        >
          <h4>Trend Overview</h4>
        </CandlestickChart>
      </div>

      <Separator className='divider' />

      <div className='trades'>
        <h4>Recent Trades</h4>
        <DataTable
          tableClassName='trades-table'
          columns={tradeColumns}
          data={trades ?? []}
          rowKey={(_, index) => index}
          headerCellClassName='py-5! text-purple-100!'
          bodyCellClassName='py-5!'
        />
      </div>

      {children}
    </section>
  );
}
