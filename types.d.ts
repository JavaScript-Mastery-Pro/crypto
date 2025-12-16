/* eslint-disable @typescript-eslint/no-explicit-any */
type OHLCData = [number, number, number, number, number];

interface CandlestickChartProps {
  data: OHLCData[];
  coinId: string;
  height?: number;
  children?: React.ReactNode;
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

interface CoinMarketData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  last_updated: string;
}

interface TrendingCoin {
  item: {
    id: string;
    name: string;
    symbol: string;
    market_cap_rank: number;
    thumb: string;
    large: string;
    data: {
      price: number;
      price_change_percentage_24h: {
        usd: number;
      };
    };
  };
}

interface SearchCoin {
  id: string;
  name: string;
  symbol: string;
  market_cap_rank: number | null;
  thumb: string;
  large: string;
  data: {
    price?: number;
    price_change_percentage_24h: number;
  };
}

interface LiveCoinPrice {
  prices: {
    [key: string]: {
      price: number;
      priceChangePercentage24h: number;
      marketCap: number;
      volume24h: number;
    };
  };
  connected: boolean;
}

interface UseCoinGeckoSocketProps {
  channel: string;
  onReady: (socket: WebSocket) => void;
  onData: (message: any) => void;
}

interface CGSimplePriceMessage {
  c: string;
  i: string;
  m: number;
  p: number;
  pp: number;
  t: number;
  v: number;
}

interface ChartSectionProps {
  coinData: {
    image: { large: string };
    name: string;
    symbol: string;
    market_data: {
      current_price: { usd: number };
    };
  };
  coinOHLCData: OHLCData[];
  coinId: string;
}

interface CoinPriceData {
  coinId: string;
  price: number;
  priceChangePercentage24h: number;
  marketCap: number;
  volume24h: number;
  lastUpdated: number;
}

interface PricesMap {
  [coinId: string]: CoinPriceData;
}

type UseCoinGeckoSocketProps = {
  channel: string;
  onReady: (socket: WebSocket) => void;
  onData: (data: any) => void;
};

interface TopGainersLosers {
  id: string;
  name: string;
  symbol: string;
  image: string;
  price: number;
  priceChangePercentage24h: number;
  volume24: number;
  rank: number;
}

interface TopGainersLosersResponse {
  id: string;
  name: string;
  symbol: string;
  image: string;
  usd: number;
  usd_24h_change: number;
  usd_24h_vol: number;
  market_cap_rank: number;
}
