import { useEffect, useState } from 'react';
// import { subscribe } from '@/lib/websocket';

export const useCoinPrice = (coinIds: string[]) => {
  const [prices, setPrices] = useState<PricesMap>({});
  const coinIdsKey = coinIds.join(',');

  useEffect(() => {
    const cleanupFunctions: (() => void)[] = [];

    // Subscribe to each coin
    // coinIds.forEach((coinId) => {
    //   const cleanup = subscribe(coinId, (allPrices) => {
    //     setPrices(allPrices);
    //   });
    //   cleanupFunctions.push(cleanup);
    // });

    // Cleanup all subscriptions
    return () => {
      cleanupFunctions.forEach((cleanup) => cleanup());
    };
     
  }, [coinIdsKey]); // Use string key to avoid array reference changes

  // Filter prices to only include requested coins
  const filteredPrices: PricesMap = {};
  coinIds.forEach((coinId) => {
    if (prices[coinId]) {
      filteredPrices[coinId] = prices[coinId];
    }
  });

  return { prices: filteredPrices };
};
