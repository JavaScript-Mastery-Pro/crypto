/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useEffect, useRef, useState, useCallback } from 'react';
import CoinHeader from './CoinHeader';
import { Separator } from './ui/separator';
import CandlestickChart from './CandlestickChart';
import { formatPrice, formatTime, timeAgo } from '@/lib/utils';

const WS_BASE = `${process.env.NEXT_PUBLIC_COINGECKO_WEBSOCKET_URL}?x_cg_pro_api_key=${process.env.NEXT_PUBLIC_COINGECKO_API_KEY}`;

export default function LiveDataWrapper({
  coinId,
  pool,
  coin,
  coinOHLCData,
  children,
}: LiveDataProps) {
  const wsRef = useRef<WebSocket | null>(null);
  const subscribed = useRef<Set<string>>(new Set());

  const [price, setPrice] = useState<ExtendedPriceData | null>(null);
  const [trades, setTrades] = useState<TradeData[]>([]);
  const [ohlcv, setOhlcv] = useState<OHLCData[]>(coinOHLCData);
  const [isWsReady, setIsWsReady] = useState(false);

  // Track where historical data ends and live data begins
  const historicalDataLength = useRef(coinOHLCData.length);

  const handleMessage = useCallback((event: MessageEvent) => {
    const ws = wsRef.current;
    const msg: WebSocketMessage = JSON.parse(event.data);

    console.log('>>>>>>>WS Message:', msg);

    if (msg.type === 'ping') return ws?.send(JSON.stringify({ type: 'pong' }));

    if (msg.type === 'confirm_subscription') {
      const { channel } = JSON.parse(msg?.identifier ?? '');
      subscribed.current.add(channel);
      console.log(`Subscribed to: ${channel}`);
      return;
    }

    if (msg.c === 'C1') {
      setPrice({
        usd: msg.p ?? 0,
        coin: msg.i,
        price: msg.p,
        change24h: msg.pp,
        marketCap: msg.m,
        volume24h: msg.v,
        timestamp: msg.t,
      });
    }

    if (msg.c === 'G2') {
      const newTrade: TradeData = {
        price: msg.pu,
        value: msg.vo,
        timestamp: (msg.t ?? 0) * 1000, // Convert to milliseconds
        type: msg.ty,
        amount: msg.to,
      };

      setTrades((prev) => {
        // Prepend new trade to beginning (most recent first)
        const allTrades = [newTrade, ...prev];
        return allTrades.slice(0, 10);
      });
    }

    if (msg.ch === 'G3') {
      setOhlcv((prev) => {
        const lastCandle = prev[prev.length - 1];
        // Convert WebSocket timestamp (seconds) to milliseconds to match API data
        const newTimeMs = (msg.t ?? 0) * 1000;
        const newCandle: OHLCData = [
          newTimeMs,
          Number(msg.o ?? 0),
          Number(msg.h ?? 0),
          Number(msg.l ?? 0),
          Number(msg.c ?? 0),
        ];

        // If same timestamp, update the existing candle
        if (lastCandle && lastCandle[0] === newTimeMs) {
          return [...prev.slice(0, -1), newCandle];
        }

        // New timestamp, append new candle
        // Keep all historical data + last 100 live candles
        const historicalCount = historicalDataLength.current;
        const liveCandles = prev.slice(historicalCount);
        const limitedLiveCandles = [...liveCandles, newCandle].slice(-100);

        return [...prev.slice(0, historicalCount), ...limitedLiveCandles];
      });
    }
  }, []);

  useEffect(() => {
    const ws = new WebSocket(WS_BASE);
    wsRef.current = ws;

    ws.onopen = () => setIsWsReady(true);
    ws.onmessage = handleMessage;
    ws.onclose = () => setIsWsReady(false);

    return () => ws.close();
  }, [handleMessage]);

  const subscribe = useCallback(
    (channel: string, data?: Record<string, any>) => {
      const ws = wsRef.current;
      if (!ws || !isWsReady || subscribed.current.has(channel)) return;

      ws.send(
        JSON.stringify({
          command: 'subscribe',
          identifier: JSON.stringify({ channel }),
        })
      );

      if (data) {
        ws.send(
          JSON.stringify({
            command: 'message',
            identifier: JSON.stringify({ channel }),
            data: JSON.stringify(data),
          })
        );
      }
    },
    [isWsReady]
  );

  const unsubscribeAll = useCallback(() => {
    const ws = wsRef.current;
    subscribed.current.forEach((channel) => {
      ws?.send(
        JSON.stringify({
          command: 'unsubscribe',
          identifier: JSON.stringify({ channel }),
        })
      );
    });
    subscribed.current.clear();
  }, []);

  useEffect(() => {
    if (!isWsReady) return;

    let active = true;
    (async () => {
      setPrice(null);
      // Reset to empty (clear live data)
      setTrades([]);
      setOhlcv(coinOHLCData);
      historicalDataLength.current = coinOHLCData.length;

      if (!active) return;

      unsubscribeAll();

      subscribe('CGSimplePrice', { coin_id: [coinId], action: 'set_tokens' });

      const wsPools = [pool.id.replace('_', ':')];
      if (wsPools.length) {
        subscribe('OnchainTrade', {
          'network_id:pool_addresses': wsPools,
          action: 'set_pools',
        });

        subscribe('OnchainOHLCV', {
          'network_id:pool_addresses': wsPools,
          interval: '1s',
          action: 'set_pools',
        });
      }
    })();

    return () => {
      active = false;
    };
  }, [coinId, pool, isWsReady, coinOHLCData, subscribe, unsubscribeAll]);

  return (
    <section className='size-full xl:col-span-2'>
      <CoinHeader
        name={coin.name}
        image={coin.image}
        livePrice={price?.usd ?? coin.price}
        livePriceChangePercentage24h={
          price?.change24h ?? coin.priceChangePercentage24h
        }
        priceChangePercentage30d={coin.priceChangePercentage30d}
        priceChange24h={coin.priceChange24h}
      />

      <Separator className='my-8 bg-purple-600' />

      {/* Trend Overview */}
      <div className='w-full'>
        <h4 className='text-2xl mb-4'>Trend Overview</h4>
        <CandlestickChart data={ohlcv} coinId={coinId} mode='live' />
      </div>

      <Separator className='my-8 bg-purple-600' />

      {/* Recent Trades */}
      <div className='w-full my-8 space-y-4'>
        <h4 className='text-2xl'>Recent Trades</h4>
        <div className='custom-scrollbar bg-dark-500 rounded-xl overflow-hidden'>
          {trades.length > 0 ? (
            <Table className='bg-dark-500'>
              <TableHeader className='text-purple-100'>
                <TableRow className='hover:bg-transparent'>
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
                  <TableRow key={index}>
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
