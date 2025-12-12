type OHLCData = [number, number, number, number, number];

interface CandlestickChartProps {
  data: OHLCData[];
  coinId: string;
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

type Period =
  | 'daily'
  | 'weekly'
  | 'monthly'
  | '3months'
  | '6months'
  | 'yearly'
  | 'max';


