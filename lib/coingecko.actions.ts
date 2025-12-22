'use server';

import qs from 'query-string';

const BASE_URL = process.env.COINGECKO_BASE_URL;
const API_KEY = process.env.COINGECKO_API_KEY;

if (!BASE_URL) {
  throw new Error('Missing COINGECKO_BASE_URL environment variable');
}

if (!API_KEY) {
  throw new Error('Missing COINGECKO_API_KEY environment variable');
}

export async function fetcher<T>(
  endpoint: string,
  params?: QueryParams,
  revalidate = 60
): Promise<T> {
  const url = qs.stringifyUrl(
    {
      url: `${BASE_URL}${endpoint}`,
      query: params,
    },
    { skipEmptyString: true, skipNull: true }
  );

  const response = await fetch(url, {
    headers: {
      'x-cg-pro-api-key': API_KEY,
      'Content-Type': 'application/json',
    } as Record<string, string>,
    next: { revalidate },
  });

  if (!response.ok) {
    const errorBody: CoinGeckoErrorBody = await response
      .json()
      .catch(() => ({}));
    throw new Error(
      `API Error ${response.status}: ${errorBody.error || response.statusText}`
    );
  }

  return response.json();
}

export async function searchCoins(query: string): Promise<SearchCoin[]> {
  if (!query?.trim()) return [];

  const searchData = await fetcher<{ coins: SearchCoin[] }>('/search', {
    query,
  });
  const coins = searchData.coins?.slice(0, 10) ?? [];

  if (coins.length === 0) return [];

  try {
    const coinIds = coins.map((coin) => coin.id).join(',');
    const priceData = await fetcher<CoinMarketData[]>('/coins/markets', {
      vs_currency: 'usd',
      ids: coinIds,
    });
    const priceMap = new Map(priceData.map((coin) => [coin.id, coin]));

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
    return coins.map((coin) => ({
      ...coin,
      data: {
        price: undefined,
        price_change_percentage_24h: 0,
      },
    }));
  }
}

export async function getPools(
  id: string,
  network?: string | null,
  contractAddress?: string | null
): Promise<PoolData> {
  const fallback: PoolData = {
    id: '',
    address: '',
    name: '',
    network: '',
  };

  if (network && contractAddress) {
    const poolData = await fetcher<{ data: PoolData[] }>(
      `/onchain/networks/${network}/tokens/${contractAddress}/pools`
    );

    return poolData.data?.[0] ?? fallback;
  }

  try {
    const poolData = await fetcher<{ data: PoolData[] }>(
      '/onchain/search/pools',
      { query: id }
    );

    return poolData.data?.[0] ?? fallback;
  } catch {
    return fallback;
  }
}
