'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

const WS_BASE = `${process.env.NEXT_PUBLIC_COINGECKO_WEBSOCKET_URL}?x_cg_pro_api_key=${process.env.NEXT_PUBLIC_COINGECKO_API_KEY}`;

export function useCoinGeckoWebSocket({ coinId, poolId }: UseCoinGeckoWebSocketProps): UseCoinGeckoWebSocketReturn {
  const wsRef = useRef<WebSocket | null>(null);
  const subscribed = useRef<Set<string>>(new Set());

  const [price, setPrice] = useState<ExtendedPriceData | null>(null);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [ohlcv, setOhlcv] = useState<OHLCData | null>(null);
  const [isWsReady, setIsWsReady] = useState(false);

  // Helper to send JSON payloads safely
  const send = useCallback((payload: Record<string, unknown>) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(payload));
    }
  }, []);

  // 1. WebSocket Connection & Message Handling
  useEffect(() => {
    const ws = new WebSocket(WS_BASE);
    wsRef.current = ws;

    const handleMessage = (event: MessageEvent) => {
      const msg: WebSocketMessage = JSON.parse(event.data);

      // Handle Ping/Pong
      if (msg.type === 'ping') {
        send({ type: 'pong' });
        return;
      }

      // Track confirmed subscriptions
      if (msg.type === 'confirm_subscription') {
        const { channel } = JSON.parse(msg?.identifier ?? '{}');
        subscribed.current.add(channel);
        return;
      }

      // Simple Price Stream (C1)
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

      // Real-Time Trades (G2)
      if (msg.c === 'G2') {
        const newTrade: Trade = {
          price: msg.pu ?? 0,
          value: msg.vo ?? 0,
          timestamp: msg.t ?? Date.now(),
          type: (msg.ty as 'b' | 's') ?? 'b',
          amount: msg.to ?? 0,
        };
        setTrades((prev) => [newTrade, ...prev].slice(0, 7));
      }

      // OHLCV Stream (G3) - Corrected to Object Format
      
      if (msg.ch === 'G3') {
        const timestamp = msg.t || 0;
        const newCandle: OHLCData = [
          timestamp,
          Number(msg.o ?? 0),
          Number(msg.h ?? 0),
          Number(msg.l ?? 0),
          Number(msg.c ?? 0),
        ];

        setOhlcv(newCandle);
      }
    };

    ws.onopen = () => setIsWsReady(true);
    ws.onmessage = handleMessage;
    ws.onclose = () => setIsWsReady(false);

    return () => ws.close();
  }, [send]);

  // 2. Subscription Management
  useEffect(() => {
    if (!isWsReady || !wsRef.current) return;

    const subscribe = (channel: string, data?: Record<string, unknown>) => {
      if (subscribed.current.has(channel)) return;

      send({ command: 'subscribe', identifier: JSON.stringify({ channel }) });
      if (data) {
        send({
          command: 'message',
          identifier: JSON.stringify({ channel }),
          data: JSON.stringify(data),
        });
      }
    };

    const unsubscribeAll = () => {
      subscribed.current.forEach((channel) => {
        send({ command: 'unsubscribe', identifier: JSON.stringify({ channel }) });
      });
      subscribed.current.clear();
    };

    // Reset data and re-subscribe on asset change
     queueMicrotask(() => {
      setPrice(null);
      setTrades([]);
      setOhlcv(null);
    });

    unsubscribeAll();

    // Market Price Subscription
    subscribe('CGSimplePrice', { coin_id: [coinId], action: 'set_tokens' });

    // On-Chain Pool Subscriptions (Trades & OHLCV)
    const poolAddress = poolId.replace('_', ':');
    if (poolAddress) {
      const poolPayload = { 'network_id:pool_addresses': [poolAddress], action: 'set_pools' };
      subscribe('OnchainTrade', poolPayload);
      subscribe('OnchainOHLCV', { ...poolPayload, interval: '1s' });
    }
  }, [coinId, poolId, isWsReady, send]);

  return { price, trades, ohlcv, isConnected: isWsReady };
}
