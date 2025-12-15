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
  const [error, setError] = useState<string | null>(
    !API_KEY ? 'API key not configured' : null
  );

  useEffect(() => {
    // Skip if no API key
    if (!API_KEY) {
      console.error('Missing NEXT_PUBLIC_COINGECKO_API_KEY');
      return;
    }

    // Normalize coinIds to array
    const coins = Array.isArray(coinIds) ? coinIds : [coinIds];

    // Establish connection with API key in URL
    const wsUrl = `${WS_URL}?x_cg_pro_api_key=${API_KEY}`;
    const socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      console.log('✅ WebSocket connected to CoinGecko');

      // First, subscribe to CGSimplePrice channel with API key in identifier
      const subscribeMessage = {
        command: 'subscribe',
        identifier: JSON.stringify({
          channel: 'CGSimplePrice',
          x_cg_pro_api_key: API_KEY
        }),
      };
      socket.send(JSON.stringify(subscribeMessage));
      console.log('📤 Subscribing to CGSimplePrice channel...');
    };

    // Handle subscription confirmation before sending data request
    const handleSubscriptionConfirmed = () => {
      setConnected(true);
      setError(null);

      // Now request price data for coins
      const dataMessage = {
        command: 'message',
        identifier: JSON.stringify({
          channel: 'CGSimplePrice',
          x_cg_pro_api_key: API_KEY
        }),
        data: JSON.stringify({
          coin_id: coins,
          action: 'set_tokens',
        }),
      };
      socket.send(JSON.stringify(dataMessage));
      console.log('📤 Requesting prices for coins:', coins);
    };

    socket.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);

        // Log all messages for debugging
        if (msg.message && msg.message.includes('Unauthorized')) {
          console.error('event.data:', msg);
          console.error('WebSocket URL:', wsUrl.replace(API_KEY, 'xxx'));
          setError('Invalid API key - Please check your CoinGecko API key');
          setConnected(false);
          return;
        }

        // Handle error messages
        if (msg.type === 'reject_subscription' || msg.message) {
          const errorMsg = msg.message || 'Subscription rejected';
          console.error('WebSocket error:', errorMsg);
          setError(errorMsg);
          setConnected(false);
          return;
        }

        // Handle ping/pong
        if (msg.type === 'ping') {
          socket.send(JSON.stringify({ type: 'pong' }));
          return;
        }

        // Handle subscription confirmation
        if (msg.type === 'confirm_subscription') {
          console.log('✅ Successfully subscribed to CGSimplePrice');
          handleSubscriptionConfirmed();
          return;
        }

        // Handle welcome message
        if (msg.type === 'welcome') {
          console.log('WebSocket connection established');
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
        } else if (msg.type && msg.type !== 'ping') {
          // Log unhandled message types for debugging
          console.log('Unhandled message type:', msg.type, msg);
        }
      } catch (err) {
        console.error('Error parsing WebSocket message:', err, event.data);
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
