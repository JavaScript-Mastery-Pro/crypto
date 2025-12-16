import { useState } from 'react';
import { useCoinGeckoSocket } from './useCoinGeckoSocket';

type PriceInfo = {
  coinId: string;
  price: number;
  priceChangePercentage24h: number;
  marketCap: number;
  volume24h: number;
  lastUpdated: number;
};

type PricesMap = Record<string, PriceInfo>;

export const useCoinPrice = (coinIds: string[]) => {
  const [prices, setPrices] = useState<PricesMap>({});
  const [connected, setConnected] = useState(false);

  useCoinGeckoSocket({
    channel: 'CGSimplePrice',
    subscribeParams: coinIds,
    subscribeMessage: (coins) => ({
      command: 'message',
      identifier: JSON.stringify({ channel: 'CGSimplePrice' }),
      data: JSON.stringify({ action: 'set_tokens', coin_id: coins }),
    }),
    onReady: () => setConnected(true),
    onData: (msg) => {
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
    },
  });

  return { prices, connected };
};
