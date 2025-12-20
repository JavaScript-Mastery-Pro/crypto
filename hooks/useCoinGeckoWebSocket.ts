/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState, useCallback } from 'react';

const WS_BASE = `${process.env.NEXT_PUBLIC_COINGECKO_WEBSOCKET_URL}?x_cg_pro_api_key=${process.env.NEXT_PUBLIC_COINGECKO_API_KEY}`;

export function useCoinGeckoWebSocket({
  coinId,
  poolId,
}: UseCoinGeckoWebSocketProps): UseCoinGeckoWebSocketReturn {
  const wsRef = useRef<WebSocket | null>(null);
  const subscribed = useRef<Set<string>>(new Set());

  const [price, setPrice] = useState<ExtendedPriceData | null>(null);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [ohlcv, setOhlcv] = useState<OHLCData | null>(null);
  const lastOhlcvTimestamp = useRef<number>(0);

  const [isWsReady, setIsWsReady] = useState(false);

  const handleMessage = useCallback((event: MessageEvent) => {
    const ws = wsRef.current;
    const msg: WebSocketMessage = JSON.parse(event.data);

    // Ping/Pong to keep connection alive
    if (msg.type === 'ping') return ws?.send(JSON.stringify({ type: 'pong' }));

    // Confirm subscription
    if (msg.type === 'confirm_subscription') {
      const { channel } = JSON.parse(msg?.identifier ?? '');
      subscribed.current.add(channel);
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
      const newTrade: Trade = {
        price: msg.pu,
        value: msg.vo,
        timestamp: msg.t ?? 0,
        type: msg.ty,
        amount: msg.to,
      };

      setTrades((prev) => [newTrade, ...prev].slice(0, 7));
    }
    // G3: OHLCV updates
    if (msg.ch === 'G3') {
      const timestamp = msg.t || 0; // already in seconds
      const newCandle: OHLCData = [
        timestamp,
        Number(msg.o ?? 0),
        Number(msg.h ?? 0),
        Number(msg.l ?? 0),
        Number(msg.c ?? 0),
      ];

      // Always update with the latest candle - chart will handle deduplication
      setOhlcv(newCandle);
      lastOhlcvTimestamp.current = timestamp;
    }
  }, []);

  // WebSocket connection
  useEffect(() => {
    const ws = new WebSocket(WS_BASE);
    wsRef.current = ws;

    ws.onopen = () => setIsWsReady(true);
    ws.onmessage = handleMessage;
    ws.onclose = () => setIsWsReady(false);

    return () => ws.close();
  }, [handleMessage]);

  // Subscribe helper
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

  // Subscribe on connection ready
  useEffect(() => {
    if (!isWsReady) return;

    let active = true;

    (async () => {
      if (!active) return;

      // Reset state
      setPrice(null);
      setTrades([]);
      setOhlcv(null);
      lastOhlcvTimestamp.current = 0;

      unsubscribeAll();

      // Subscribe channels
      subscribe('CGSimplePrice', { coin_id: [coinId], action: 'set_tokens' });

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
  }, [coinId, poolId, isWsReady, subscribe, unsubscribeAll]);

  return {
    price,
    trades,
    ohlcv,
    isConnected: isWsReady,
  };
}
