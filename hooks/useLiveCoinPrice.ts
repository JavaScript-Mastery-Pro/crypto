'use client';

import { useEffect, useState } from 'react';

const WS_URL = process.env.NEXT_PUBLIC_COINGECKO_WEBSOCKET_URL || 'wss://stream.coingecko.com/v1';
const API_KEY = process.env.NEXT_PUBLIC_COINGECKO_API_KEY;

export interface LiveCoinPrice {
  coinId: string;
  price: number;
  priceChangePercentage24h: number;
  marketCap: number;
  volume24h: number;
  lastUpdated: number;
}

export const useLiveCoinPrice = (coinIds: string | string[]) => {
  const [prices, setPrices] = useState<Record<string, LiveCoinPrice>>({});
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!API_KEY) return;

    const coins = Array.isArray(coinIds) ? coinIds : [coinIds];
    const socket = new WebSocket(`${WS_URL}?x_cg_pro_api_key=${API_KEY}`);

    socket.onopen = () => {
      setConnected(true);
      socket.send(JSON.stringify({
        command: 'subscribe',
        identifier: JSON.stringify({ channel: 'CGSimplePrice' })
      }));
    };

    socket.onmessage = (event) => {
      const msg = JSON.parse(event.data);

      console.log('======Message', msg);

      if (msg.type === 'ping') {
        socket.send(JSON.stringify({ type: 'pong' }));
        return;
      }

      if (msg.type === 'confirm_subscription') {
        socket.send(JSON.stringify({
          command: 'message',
          identifier: JSON.stringify({ channel: 'CGSimplePrice' }),
          data: JSON.stringify({ coin_id: coins, action: 'set_tokens' })
        }));
        return;
      }

      if (msg.c === 'C1' && msg.i && msg.p !== undefined) {
        setPrices(prev => ({
          ...prev,
          [msg.i]: {
            coinId: msg.i,
            price: msg.p,
            priceChangePercentage24h: msg.pp || 0,
            marketCap: msg.m || 0,
            volume24h: msg.v || 0,
            lastUpdated: msg.t || Date.now() / 1000
          }
        }));
      }
    };

    socket.onclose = () => setConnected(false);

    return () => socket.close();
  }, [coinIds]);

  return { prices, connected };
};
