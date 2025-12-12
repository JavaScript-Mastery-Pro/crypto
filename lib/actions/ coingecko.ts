"use server";

export async function getCoinList() {
  const res = await fetch("https://api.coingecko.com/api/v3/coins/list", {
    method: "GET",
    headers: {
      "x-cg-demo-api-key": process.env.COINGECKO_API_KEY!,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch CoinGecko Demo API data");
  }

  return res.json();
}

export async function getCoinDetails(id:string) {
  const res = await fetch(`https://api.coingecko.com/api/v3/coins/${id}`, {
    method: "GET",
    headers: {
      "x-cg-demo-api-key": process.env.COINGECKO_API_KEY!,
    },
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch CoinGecko Demo API data");

  return res.json();
}

export async function getCoinOHLC(id:string, days:number) {
  const res = await fetch(`https://api.coingecko.com/api/v3/coins/${id}/ohlc?vs_currency=usd&days=${days}`, {
    method: "GET",
    headers: {
      "x-cg-demo-api-key": process.env.COINGECKO_API_KEY!,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch CoinGecko Demo API data");
  }

  return res.json();
}

