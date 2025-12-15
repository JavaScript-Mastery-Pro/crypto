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

  if (!res.ok) {
    const errorText = await res.text();
    console.error('CoinGecko API Error:', res.status, errorText);
    throw new Error(
      `Failed to fetch CoinGecko API data: ${res.status} ${errorText}`
    );
  }
  return res.json();
}

export async function getCoinDetails(id: string) {
  const res = await fetch(`${baseUrl}/coins/${id}`, header);

  if (!res.ok) throw new Error('Failed to fetch CoinGecko API data');
  return res.json();
}

export async function getCoinOHLC(
  id: string,
  days: number,
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

export async function getTopPoolForToken(
  network: string,
  tokenAddress: string
) {
  const res = await fetch(
    `${baseUrl}/onchain/networks/${network}/tokens/${tokenAddress}/pools`,
    header
  );

  if (!res.ok) throw new Error('Failed to fetch pool data');
  const data = await res.json();

  // Return the top pool (first one, sorted by liquidity)
  return data.data && data.data.length > 0 ? data.data[0] : null;
}

export async function getTrendingCoins() {
  const res = await fetch(`${baseUrl}/search/trending`, header);

  if (!res.ok) throw new Error('Failed to fetch trending coins');

  const data = await res.json();
  return data.coins || [];
}

export async function searchCoins(query: string) {
  if (!query || query.trim().length === 0) {
    return [];
  }

  const res = await fetch(
    `${baseUrl}/search?query=${encodeURIComponent(query)}`,
    header
  );

  if (!res.ok) throw new Error('Failed to fetch search data');

  const data = await res.json();
  return data.coins || [];
}
