'use client';

import { cn, formatPrice, timeAgo } from '@/lib/utils';
import { DataTable } from '@/components/DataTable';
import CoinHeader from './CoinHeader';
import { Separator } from './ui/separator';
import CandlestickChart from './CandlestickChart';
import { useCoinGeckoWebSocket } from '@/hooks/useCoinGeckoWebSocket';
import { LiveDataProps, Trade } from '@/types';

export default function LiveDataWrapper({ coinId, poolId, coin, coinOHLCData, children }: LiveDataProps) {
  const { price, trades, ohlcv } = useCoinGeckoWebSocket({ coinId, poolId });

  const tradeColumns = [
    {
      header: 'Price',
      cellClassName: 'font-bold',
      cell: (t: Trade) => formatPrice(t.price),
    },
    {
      header: 'Amount',
      cellClassName: 'text-purple-100',
      cell: (t: Trade) => t.amount.toFixed(4),
    },
    {
      header: 'Type',
      cell: (t: Trade) => (
        <span
          className={cn(
            'px-2 py-0.5 rounded text-[10px] font-black uppercase',
            t.type === 'b' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500',
          )}
        >
          {t.type === 'b' ? 'Buy' : 'Sell'}
        </span>
      ),
    },
    {
      header: 'Time',
      cellClassName: 'text-end text-purple-100 text-xs',
      cell: (t: Trade) => timeAgo(t.timestamp),
    },
  ];

  return (
    <section id='live-data-wrapper' className='space-y-8'>
      <CoinHeader
        name={coin.name}
        image={coin.image.large}
        livePrice={price?.usd ?? coin.market_data.current_price.usd}
        livePriceChangePercentage24h={price?.change24h ?? coin.market_data.price_change_percentage_24h_in_currency.usd}
        priceChangePercentage30d={coin.market_data.price_change_percentage_30d_in_currency.usd}
        priceChange24h={coin.market_data.price_change_24h_in_currency.usd}
      />

      <Separator className='opacity-10' />

      {/* Passing liveOhlcv resolves the missing property warning */}
      <CandlestickChart initialData={coinOHLCData} liveOhlcv={ohlcv} coinId={coinId} mode='live' />

      <Separator className='opacity-10' />

      <div className='trades'>
        <DataTable
          tableClassName='trades-table'
          columns={tradeColumns}
          data={trades || []}
          rowKey={(t, i) => `${t.timestamp}-${i}`}
        />
      </div>

      {children}
    </section>
  );
}
