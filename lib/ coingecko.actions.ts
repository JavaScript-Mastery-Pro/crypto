'use server';

const baseUrl = process.env.COINGECKO_BASE_URL!;
const header = {
  method: 'GET',
  headers: {
    'x-cg-pro-api-key': process.env.COINGECKO_API_KEY!,
  },
  cache: 'no-store' as RequestCache,
};

export async function getCoinList(page: number = 1, perPage: number = 50) {
  const params = new URLSearchParams({
    vs_currency: 'usd',
    order: 'market_cap_desc',
    per_page: perPage.toString(),
    page: page.toString(),
    sparkline: 'false',
    locale: 'en',
    price_change_percentage: '24h',
  });

  const res = await fetch(`${baseUrl}/coins/markets?${params}`, header);

  if (!res.ok) throw new Error('Failed to fetch CoinGecko API data');
  return res.json();
}

export async function getCoinDetails(id: string) {
  const res = await fetch(`${baseUrl}/coins/${id}`, header);

  if (!res.ok) throw new Error('Failed to fetch CoinGecko API data');
  return res.json();
}

export async function getCoinOHLC(
  id: string,
  days: number | string,
  currency?: string,
  interval?: 'daily' | 'hourly',
  precision?: 'full' | string
) {
  const currencyParam = currency || 'usd';
  const params = new URLSearchParams({
    vs_currency: currencyParam,
    days: days.toString(),
  });

  if (interval) params.append('interval', interval);
  if (precision) params.append('precision', precision);

  const res = await fetch(`${baseUrl}/coins/${id}/ohlc?${params}`, header);

  if (!res.ok) throw new Error('Failed to fetch CoinGecko API data');
  return res.json();
}

export async function getTrendingCoins() {
  const res = await fetch(`${baseUrl}/search/trending`, header);

  if (!res.ok) throw new Error('Failed to fetch trending coins');

  const data = await res.json();
  return data.coins || [];
}

export async function getTopGainersLosers() {
  const res = await fetch(`${baseUrl}/coins/top_gainers_losers?vs_currency=usd`, header);

  if (!res.ok) throw new Error('Failed to fetch top gainers/losers');

  const data = await res.json();
  return { top_gainers: data.top_gainers.slice(0,4) || [], top_losers: data.top_losers.slice(0,4) || [] };
}

export async function searchCoins(query: string): Promise<SearchCoin[]> {
  if (!query || query.trim().length === 0) return [];

  const res = await fetch(
    `${baseUrl}/search?query=${encodeURIComponent(query)}`,
    header
  );

  if (!res.ok) throw new Error('Failed to fetch search data');

  const data = await res.json();
  const coins = data.coins || [];

  // Get price data for the search results (limit to first 10)
  const coinIds = coins.slice(0, 10).map((coin: SearchCoin) => coin.id);

  if (coinIds.length === 0) return [];

  try {
    const priceParams = new URLSearchParams({
      vs_currency: 'usd',
      ids: coinIds.join(','),
      order: 'market_cap_desc',
      per_page: '10',
      page: '1',
      sparkline: 'false',
    });

    const priceRes = await fetch(
      `${baseUrl}/coins/markets?${priceParams}`,
      header
    );

    if (priceRes.ok) {
      const priceData = await priceRes.json();

      // Create a map of coin prices
      const priceMap = new Map<string, { price: number }>(
        priceData.map((coin: CoinMarketData) => [
          coin.id,
          { price: coin.current_price,
            price_change_percentage_24h: coin.price_change_percentage_24h
           }
        ])
      );

      // Enrich search results with price data
      return coins.slice(0, 10).map((coin: SearchCoin) => ({
        ...coin,
        data: priceMap.get(coin.id) || undefined,
      }));
    }
  } catch (error) {
    console.error('Failed to fetch price data for search results:', error);
  }

  return coins.slice(0, 10);
}

export async function fetchPools(id: string): Promise<{id: string;address: string; name: string}> {
  try {
    // Fetch onchain data for the coin which includes pool information
    const res = await fetch(
      `${baseUrl}/onchain/search/pools?query=${encodeURIComponent(id)}`,
      header
    );
 
    if (!res.ok) {
      console.warn(`No pool data found for ${id}`);
      return {id: '', address: '', name: ''};
    }

    const data = await res.json();

       console.log('>>>>>Fetched pool data:', data);
       const pool = data.data[0];

    return {id: pool.id as string, address: pool.attributes.address as string, name: pool.attributes.name as string}
  } catch (error) {
    console.error('Failed to fetch pools', error);
    return {id: '', address: '', name: ''};
  }
}
