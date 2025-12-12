import { NextRequest, NextResponse } from 'next/server';

const baseUrl = process.env.COINGECKO_BASE_URL!;
const headerConfig = {
  'x-cg-pro-api-key': process.env.COINGECKO_API_KEY!,
};

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    const days = searchParams.get('days');
    const currency = searchParams.get('currency') || 'usd';
    const interval = searchParams.get('interval');
    const precision = searchParams.get('precision');

    if (!id || !days) {
      return NextResponse.json(
        { error: 'Missing required parameters: id, days' },
        { status: 400 }
      );
    }

    const params = new URLSearchParams({
      vs_currency: currency,
      days: days,
    });

    if (interval) params.append('interval', interval);
    if (precision) params.append('precision', precision);

    const res = await fetch(`${baseUrl}/coins/${id}/ohlc?${params}`, {
      method: 'GET',
      headers: headerConfig,
      cache: 'no-store',
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch OHLC data' },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('OHLC API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
