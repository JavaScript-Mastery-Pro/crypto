type OHLCData = [number, number, number, number, number];

interface CandlestickChartProps {
  data: OHLCData[];
  coinId: string;
  height?: number;
  children?: React.ReactNode;
  mode?: 'historical' | 'live';
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

// WebSocket Types
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

// Chart Section Props
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

interface PriceData {
  usd: number;
}

interface TradeData {
  price?: number;
  timestamp?: number;
  type?: string;
  amount?: number;
  value?: number;
}


interface ExtendedPriceData {
  usd: number;
  coin?: string;
  price?: number;
  change24h?: number;
  marketCap?: number;
  volume24h?: number;
  timestamp?: number;
}

interface WebSocketMessage {
  type?: string;
  c?: string;
  ch?: string;
  i?: string;
  p?: number;
  pp?: number;
  pu?: number;
  m?: number;
  v?: number;
  vo?: number;
  o?: number;
  h?: number;
  l?: number;
  t?: number;
  to?: number;
  ty?: string;
  channel?: string;
  identifier?: string;
}

interface LiveDataProps {
  coinId: string;
  pool: {
    id: string;
    address: string;
    name: string;
    network: string;
  };
  coin: {
    name: string;
    image: string;
    description: string;
    priceChangePercentage24h: number;
    priceChangePercentage30d: number;
    priceChange24h: number;
    price: number;
  };
  coinOHLCData: OHLCData[];
  children?: React.ReactNode;
}

interface ClickableTableRowProps {
  href: string;
  children: ReactNode;
  className?: string;
}

interface LiveCoinHeaderProps {
  name: string;
  image: string;
  livePrice?: number;
  livePriceChangePercentage24h: number;
  priceChangePercentage30d: number;
  priceChange24h: number;
}

interface Category {
  name: string;
  top_3_coins: string[];
  market_cap_change_24h: number;
  market_cap: number;
  volume_24h: number;
}
