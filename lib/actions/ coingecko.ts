'use server';

const baseUrl = process.env.COINGECKO_BASE_URL!;
const headerConfig = {
  // Demo API Key: x-cg-demo-api-key
  // Pro API Key: x-cg-pro-api-key
  // 'x-cg-demo-api-key': process.env.COINGECKO_API_KEY!,
  'x-cg-pro-api-key': process.env.COINGECKO_API_KEY!,
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

  const res = await fetch(`${baseUrl}/coins/markets?${params}`, {
    method: 'GET',
    headers: headerConfig,
    cache: 'no-store',
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error('CoinGecko API Error:', res.status, errorText);
    throw new Error(`Failed to fetch CoinGecko API data: ${res.status} ${errorText}`);
  }
  return res.json();
}

export async function getCoinDetails(id: string) {
  const res = await fetch(`${baseUrl}/coins/${id}`, {
    method: 'GET',
    headers: headerConfig,
    cache: 'no-store',
  });

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

  const res = await fetch(`${baseUrl}/coins/${id}/ohlc?${params}`, {
    method: 'GET',
    headers: headerConfig,
    cache: 'no-store',
  });

  if (!res.ok) throw new Error('Failed to fetch CoinGecko API data');
  return res.json();
}

export async function getTrendingCoins() {
  const res = await fetch(`${baseUrl}/search/trending`, {
    method: 'GET',
    headers: headerConfig,
    cache: 'no-store',
  });

  if (!res.ok) throw new Error('Failed to fetch CoinGecko API data');
  return res.json();
}
