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

export async function getCoinOHLC(id: string, days: number) {
  const res = await fetch(
    `${baseUrl}/coins/${id}/ohlc?vs_currency=usd&days=${days}`,
    {
      method: 'GET',
      headers: headerConfig,
      cache: 'no-store',
    }
  );

  if (!res.ok) throw new Error('Failed to fetch CoinGecko Demo API data');
  return res.json();
}
