'use client';

import { DataTable } from '@/components/DataTable';
import CoinHeader from './CoinHeader';
import { Separator } from './ui/separator';
import CandlestickChart from './CandlestickChart';
import { formatCurrency, timeAgo } from '@/lib/utils';
import { useCoinGeckoWebSocket } from '@/hooks/useCoinGeckoWebSocket';
import { useState } from 'react';

export default function LiveDataWrapper({
  coinId,
  poolId,
  coin,
  coinOHLCData,
  children,
}: LiveDataProps) {
  const [liveInterval, setLiveInterval] = useState<'1s' | '1m'>('1s');
  const { price, trades, ohlcv } = useCoinGeckoWebSocket({
    coinId,
    poolId,
    liveInterval,
  });

  const tradeColumns: DataTableColumn<Trade>[] = [
    {
      header: 'Price',
      cellClassName: 'price-cell',
      cell: (trade) => (trade.price ? formatCurrency(trade.price) : '-'),
    },
    {
      header: 'Amount',
      cellClassName: 'amount-cell',
      cell: (trade) => trade.amount?.toFixed(4) ?? '-',
    },
    {
      header: 'Value',
      cellClassName: 'value-cell',
      cell: (trade) => (trade.value ? formatCurrency(trade.value) : '-'),
    },
    {
      header: 'Buy/Sell',
      cellClassName: 'type-cell',
      cell: (trade) => (
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
      cell: (trade) => (trade.timestamp ? timeAgo(trade.timestamp) : '-'),
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
          liveInterval={liveInterval}
          setLiveInterval={setLiveInterval}
        >
          <h4>Trend Overview</h4>
        </CandlestickChart>
      </div>

      <Separator className='divider' />

      {tradeColumns && (
        <div className='trades'>
          <h4>Recent Trades</h4>
          <DataTable
            tableClassName='trades-table'
            columns={tradeColumns}
            data={trades ?? []}
            rowKey={(_, index) => index}
          />
        </div>
      )}

      {children}
    </section>
  );
}
