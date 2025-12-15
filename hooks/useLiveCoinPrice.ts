'use client';

import { useEffect, useState } from 'react';

const WS_URL =
  process.env.NEXT_PUBLIC_COINGECKO_WEBSOCKET_URL ||
  'wss://stream.coingecko.com/v1';
const API_KEY = process.env.NEXT_PUBLIC_COINGECKO_API_KEY;

export const useLiveCoinPrice = (coinIds: string[]) => {
  const [prices, setPrices] = useState({});
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!API_KEY) return;

    const socket = new WebSocket(`${WS_URL}?x_cg_pro_api_key=${API_KEY}`);

    socket.onopen = () => {
      setConnected(true);
      socket.send(
        JSON.stringify({
          command: 'subscribe',
          identifier: JSON.stringify({ channel: 'CGSimplePrice' }),
        })
      );
    };

    socket.onmessage = (event) => {
      const msg = JSON.parse(event.data);

      console.log('======Message', msg);

      if (msg === 'ping') {
        socket.send(JSON.stringify({ type: 'pong' }));
        return;
      }

      socket.send(
        JSON.stringify({
          command: 'message',
          identifier: JSON.stringify({ channel: 'CGSimplePrice' }),
          data: JSON.stringify({ coin_id: coinIds, action: 'set_tokens' }),
        })
      );

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
    };

    socket.onclose = () => setConnected(false);

    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(
          JSON.stringify({
            command: 'unsubscribe',
            identifier: JSON.stringify({ channel: 'CGSimplePrice' }),
          })
        );
      }
      socket.close();
    };
  }, [coinIds]);

  return { prices, connected };
};
