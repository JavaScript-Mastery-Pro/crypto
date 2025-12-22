import React from 'react';

// --- Shared Utility & Base Types ---
type OHLCData = {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
};

type Period = 'daily' | 'weekly' | 'monthly' | '3months' | '6months' | 'yearly' | 'max';

interface Trade {
  price: number;
  amount: number;
  value: number;
  type: 'b' | 's'; // b = buy, s = sell
  timestamp: number;
}

// --- Market Data Interfaces ---
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

interface Category {
  name: string;
  top_3_coins: string[];
  market_cap_change_24h: number;
  market_cap: number;
  volume_24h: number;
}

// --- Coin Detail & Ticker Interfaces ---
interface Ticker {
  market: { name: string };
  base: string;
  target: string;
  converted_last: { usd: number };
  timestamp: string;
  trade_url: string;
}

interface CoinDetailsData {
  id: string;
  name: string;
  symbol: string;
  asset_platform_id?: string;
  detail_platforms?: Record<
    string,
    {
      decimal_place: number | null;
      contract_address: string;
      geckoterminal_url?: string;
    }
  >;
  image: { large: string; small: string };
  market_data: {
    current_price: { usd: number; [key: string]: number };
    price_change_24h_in_currency: { usd: number };
    price_change_percentage_24h_in_currency: { usd: number };
    price_change_percentage_30d_in_currency: { usd: number };
    market_cap: { usd: number };
    total_volume: { usd: number };
  };
  market_cap_rank: number;
  description: { en: string };
  links: {
    homepage: string[];
    blockchain_site: string[];
    subreddit_url: string;
  };
  tickers: Ticker[];
}

// --- WebSocket & Live Logic Interfaces ---
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

// --- Component Prop Interfaces ---
interface CandlestickChartProps {
  initialData: OHLCData[];
  liveOhlcv: OHLCData | null; // Resolves TS2741 & TS2322
  coinId: string;
  children?: React.ReactNode;
  mode?: 'live' | 'historical';
  initialPeriod?: string;
  height?: number;
}

interface LiveDataProps {
  coinId: string;
  poolId: string;
  coin: CoinDetailsData;
  coinOHLCData: OHLCData[];
  children?: React.ReactNode;
}

interface LiveCoinHeaderProps {
  name: string;
  image: string;
  livePrice?: number;
  livePriceChangePercentage24h: number;
  priceChangePercentage30d: number;
  priceChange24h: number;
}

interface ConverterProps {
  symbol: string;
  icon: string;
  priceList: Record<string, number>;
}

interface SearchItemProps {
  coin: SearchCoin | TrendingCoin['item'];
  onSelect: (coinId: string) => void;
  isActiveName: boolean;
}

// --- DataTable Interfaces ---
interface DataTableColumn<T> {
  header: React.ReactNode;
  cell: (row: T, index: number) => React.ReactNode;
  headClassName?: string;
  cellClassName?: string;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  rowKey: (row: T, index: number) => React.Key;
  tableClassName?: string;
  headerClassName?: string;
  headerRowClassName?: string;
  headerCellClassName?: string;
  bodyRowClassName?: string;
  bodyCellClassName?: string;
}

// --- Pagination & Navigation ---
type ButtonSize = 'default' | 'sm' | 'lg' | 'icon' | 'icon-sm' | 'icon-lg';

type PaginationLinkProps = {
  isActive?: boolean;
  size?: ButtonSize;
} & React.ComponentProps<'a'>;

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  hasMorePages: boolean;
}

// --- Page & Route Props ---
interface CoinsPageProps {
  searchParams: Promise<{ page?: string }>;
}

interface CoinDetailsPageProps {
  params: Promise<{ id: string }>;
}

interface HeaderProps {
  trendingCoins: TrendingCoin[];
}

interface Category {
  name: string;
  top_3_coins: string[];
  market_cap_change_24h: number;
  market_cap: number;
  volume_24h: number;
}

interface UseCoinGeckoWebSocketProps {
  coinId: string;
  poolId: string;
}

interface UseCoinGeckoWebSocketReturn {
  price: ExtendedPriceData | null;
  trades: Trade[];
  ohlcv: OHLCData | null;
  isConnected: boolean;
}
