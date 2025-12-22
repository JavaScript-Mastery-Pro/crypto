/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

const BASE_URL = process.env.COINGECKO_BASE_URL;
const API_KEY = process.env.COINGECKO_API_KEY;

/**
 * Optimized fetcher with robust error parsing and Next.js caching.
 */
async function fetcher<T>(endpoint: string, params?: URLSearchParams, revalidate = 60): Promise<T> {
  const url = new URL(`${BASE_URL}${endpoint}`);
  if (params) url.search = params.toString();

  const response = await fetch(url.toString(), {
    headers: {
      'x-cg-pro-api-key': API_KEY!,
      'Content-Type': 'application/json',
    },
    next: { revalidate },
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(`API Error ${response.status}: ${errorBody.error || response.statusText}`);
  }

  return response.json();
}

/* --- Market Actions --- */

export async function getCoinDetails(id: string): Promise<CoinDetailsData> {
  return fetcher(`/coins/${id}`, new URLSearchParams({ dex_pair_format: 'contract_address' }));
}

export async function getCoinOHLC(
  id: string,
  days: number | string,
  currency: string = 'usd',
  interval?: 'daily' | 'hourly',
  precision?: 'full' | string
): Promise<OHLCData[]> {
  const vsCurrency = currency && currency !== 'undefined' ? currency : 'usd';
  const params = new URLSearchParams({ vs_currency: vsCurrency, days: days.toString() });

  if (interval) params.append('interval', interval);
  if (precision) params.append('precision', precision);

  return fetcher<OHLCData[]>(`/coins/${id}/ohlc`, params);
}

export async function getTrendingCoins(): Promise<TrendingCoin[]> {
  const data = await fetcher<{ coins: TrendingCoin[] }>('/search/trending', undefined, 300);
  return data.coins ?? [];
}

export async function getCategories(): Promise<Category[]> {
  const data = await fetcher<Category[]>('/coins/categories');
  return data.slice(0, 10) ?? [];
}

export async function getCoinList(page = 1, perPage = 50): Promise<CoinMarketData[]> {
  const params = new URLSearchParams({
    vs_currency: 'usd',
    order: 'market_cap_desc',
    per_page: perPage.toString(),
    page: page.toString(),
    sparkline: 'false',
    price_change_percentage: '24h',
  });

  return fetcher<CoinMarketData[]>('/coins/markets', params);
}

/**
 * lib/coingecko.actions.ts
 * Refactored to map API data to CoinCard requirements
 */
export async function getTopGainersLosers() {
  const data = await fetcher<{ top_gainers: any[]; top_losers: any[] }>('/coins/top_gainers_losers?vs_currency=usd');

  // Standardize the data here so the component stays simple
  const mapCoin = (coin: any) => ({
    id: coin.id,
    name: coin.name,
    symbol: coin.symbol,
    image: coin.image,
    current_price: coin.usd, // Mapping 'usd' to 'current_price'
    price_change_percentage_24h: coin.usd_24h_change, // Mapping 'usd_24h_change' to standard
  });

  return {
    top_gainers: data.top_gainers?.slice(0, 4).map(mapCoin) ?? [],
    top_losers: data.top_losers?.slice(0, 4).map(mapCoin) ?? [],
  };
}
/* --- Search & Discovery --- */

export async function searchCoins(query: string): Promise<SearchCoin[]> {
  if (!query?.trim()) return [];
  const searchData = await fetcher<{ coins: SearchCoin[] }>('/search', new URLSearchParams({ query }));
  const coins = searchData.coins.slice(0, 10);

  if (coins.length === 0) return [];

  try {
    const coinIds = coins.map((c) => c.id).join(',');
    const priceData = await fetcher<CoinMarketData[]>(
      '/coins/markets',
      new URLSearchParams({ vs_currency: 'usd', ids: coinIds }),
    );
    const priceMap = new Map(priceData.map((c) => [c.id, c]));

    return coins.map((coin) => {
      const market = priceMap.get(coin.id);
      return {
        ...coin,
        data: {
          price: market?.current_price,
          price_change_percentage_24h: market?.price_change_percentage_24h ?? 0,
        },
      };
    });
  } catch (error) {
    console.error('Search enrichment failed:', error);
    return coins;
  }
}

/* --- On-Chain Pool Actions --- */
export async function fetchTopPool(network: string, contractAddress: string) {
  const data = await fetcher<{ data: any[] }>(`/onchain/networks/${network}/tokens/${contractAddress}/pools`);
  return data.data[0];
}

export async function fetchPools(id: string) {
  try {
    const data = await fetcher<{ data: any[] }>('/onchain/search/pools', new URLSearchParams({ query: id }));
    return data.data[0];
  } catch (error) {
    return { id: '', address: '', name: '', network: '' };
  }
}
