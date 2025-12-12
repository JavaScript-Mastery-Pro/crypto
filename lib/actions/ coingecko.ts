'use server';

const baseUrl = process.env.COINGECKO_BASE_URL!;
const headerConfig = {
  // Demo API Key: x-cg-demo-api-key
  // Pro API Key: x-cg-pro-api-key
  'x-cg-pro-api-key': process.env.COINGECKO_API_KEY!,
};

export async function getCoinList() {
  const res = await fetch(`${baseUrl}/coins/list`, {
    method: 'GET',
    headers: headerConfig,
    cache: 'no-store',
  });

  if (!res.ok) throw new Error('Failed to fetch CoinGecko Demo API data');
  return res.json();
}

export async function getCoinDetails(id: string) {
  const res = await fetch(`${baseUrl}/coins/${id}`, {
    method: 'GET',
    headers: headerConfig,
    cache: 'no-store',
  });

  if (!res.ok) throw new Error('Failed to fetch CoinGecko Demo API data');
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

  if (!res.ok) throw new Error('Failed to fetch CoinGecko Demo API data');
  return res.json();
}
