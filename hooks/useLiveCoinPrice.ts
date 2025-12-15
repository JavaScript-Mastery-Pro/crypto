'use client';

import { useEffect, useRef, useState } from 'react';

const WS_URL =
  process.env.NEXT_PUBLIC_COINGECKO_WEBSOCKET_URL ||
  'wss://stream.coingecko.com/v1';
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
  const socketRef = useRef<WebSocket | null>(null);
  const [prices, setPrices] = useState<Record<string, LiveCoinPrice>>({});
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Normalize coinIds to array
    const coins = Array.isArray(coinIds) ? coinIds : [coinIds];

    // Establish connection
    const socket = new WebSocket(
      API_KEY ? `${WS_URL}?x_cg_pro_api_key=${API_KEY}` : WS_URL
    );

    console.log('========== Socket', socket);

    socket.onopen = () => {
      setConnected(true);
      setError(null);
      console.log('WebSocket connected');

      // Subscribe to CGSimplePrice channel
      const subscribeMessage = {
        command: 'subscribe',
        identifier: JSON.stringify({ channel: 'CGSimplePrice' }),
      };
      socket.send(JSON.stringify(subscribeMessage));
      console.log('Subscribe to CGSimplePrice:', subscribeMessage);

      // Request price data for coins
      const dataMessage = {
        command: 'message',
        identifier: JSON.stringify({ channel: 'CGSimplePrice' }),
        data: JSON.stringify({
          coin_id: coins,
          action: 'set_tokens',
        }),
      };
      socket.send(JSON.stringify(dataMessage));
      console.log('Request prices for:', coins);
      console.log('dataMessage:', dataMessage);
    };

    socket.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        console.log('Other message:', msg);

        // Handle ping/pong
        if (msg.type === 'ping') {
          socket.send(JSON.stringify({ type: 'pong' }));
          console.log('Pong sent');
          return;
        }

        // Handle subscription confirmation
        if (msg.type === 'confirm_subscription') {
          console.log('Subscription confirmed');
          return;
        }

        // Handle price data (channel C1)
        if (msg.c === 'C1' && msg.i && msg.p !== undefined) {
          setPrices((prev) => ({
            ...prev,
            [msg.i]: {
              coinId: msg.i,
              price: msg.p,
              priceChangePercentage24h: msg.pp || 0,
              marketCap: msg.m || 0,
              volume24h: msg.v || 0,
              lastUpdated: msg.t || Date.now() / 1000,
            },
          }));
        }
      } catch (err) {
        console.error('Error parsing message:', err, event.data);
      }
    };

    socket.onerror = (err) => {
      console.error('WebSocket error:', err);
      setConnected(false);
      setError('WebSocket connection error');
    };

    socket.onclose = (event) => {
      console.log('WebSocket closed:', event.code, event.reason);
      setConnected(false);
    };

    socketRef.current = socket;

    return () => {
      console.log('Cleaning up WebSocket');
      socket.close();
    };
  }, [coinIds]);

  return { prices, connected, error };
};
