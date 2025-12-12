type OHLCData = [number, number, number, number, number];

interface CandlestickChartProps {
  /** CoinGecko OHLC format: [timestamp, open, high, low, close] */
  data: OHLCData[];
  /** Chart height in pixels */
  height?: number;
}

interface ConverterProps {
  symbol: string;
  icon: string;
  priceList: Record<string, number>;
}

interface Ticker {
  market: {
    name: string;
  };
  base: string;
  target: string;
  converted_last: {
    usd: number;
  };
  timestamp: string;
  trade_url: string;
}