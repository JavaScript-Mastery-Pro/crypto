type OHLCData = [number, number, number, number, number];

interface CandlestickChartProps {
  /** CoinGecko OHLC format: [timestamp, open, high, low, close] */
  data: OHLCData[];
  /** Chart height in pixels */
  height?: number;
}

