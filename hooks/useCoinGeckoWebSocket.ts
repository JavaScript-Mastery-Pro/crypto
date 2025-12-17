/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState, useCallback } from 'react';

const WS_BASE = `${process.env.NEXT_PUBLIC_COINGECKO_WEBSOCKET_URL}?x_cg_pro_api_key=${process.env.NEXT_PUBLIC_COINGECKO_API_KEY}`;

export function useCoinGeckoWebSocket({
  coinId,
  poolId,
  coinOHLCData,
}: UseCoinGeckoWebSocketProps): UseCoinGeckoWebSocketReturn {
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

    if (msg.type === 'ping') return ws?.send(JSON.stringify({ type: 'pong' }));

    if (msg.type === 'confirm_subscription') {
      const { channel } = JSON.parse(msg?.identifier ?? '');
      subscribed.current.add(channel);
      console.log(`Subscribed to: ${channel}`);
      return;
    }

    // C1: Price updates
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

    // G2: Trade updates
    if (msg.c === 'G2') {
      const newTrade: TradeData = {
        price: msg.pu,
        value: msg.vo,
        timestamp: msg.t ?? 0,
        type: msg.ty,
        amount: msg.to,
      };

      setTrades((prev) => {
        // Prepend new trade to beginning (most recent first)
        const allTrades = [newTrade, ...prev];
        return allTrades.slice(0, 10);
      });
    }

    // G3: OHLCV updates
    if (msg.ch === 'G3') {
      setOhlcv((prev) => {
        const lastCandle = prev[prev.length - 1];

        const newTimeMs = msg.t ?? 0;
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

        // Only append if timestamp is newer than the last candle
        if (lastCandle && newTimeMs < lastCandle[0]) {
          console.warn(
            'Skipping out-of-order candle:',
            newTimeMs,
            'vs',
            lastCandle[0]
          );
          return prev;
        }

        // Keep all historical data + last 100 live candles
        const historicalCount = historicalDataLength.current;
        const liveCandles = prev.slice(historicalCount);
        const limitedLiveCandles = [...liveCandles, newCandle].slice(-100);

        return [...prev.slice(0, historicalCount), ...limitedLiveCandles];
      });
    }
  }, []);

  // WebSocket connection setup
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

  // Subscribe to channels when connected
  useEffect(() => {
    if (!isWsReady) return;

    let active = true;
    (async () => {
      setPrice(null);
      setTrades([]);
      setOhlcv(coinOHLCData);
      historicalDataLength.current = coinOHLCData.length;

      if (!active) return;

      unsubscribeAll();

      // Subscribe to price updates
      subscribe('CGSimplePrice', { coin_id: [coinId], action: 'set_tokens' });

      // Subscribe to trade and OHLCV updates
      const wsPools = [poolId.replace('_', ':')];
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
  }, [coinId, poolId, isWsReady, coinOHLCData, subscribe, unsubscribeAll]);

  return {
    price,
    trades,
    ohlcv,
    isConnected: isWsReady,
  };
}
