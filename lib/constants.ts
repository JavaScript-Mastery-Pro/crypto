import {
  CandlestickSeriesPartialOptions,
  ChartOptions,
  ColorType,
  DeepPartial,
} from 'lightweight-charts';

export const navItems = [
  {
    label: 'Home',
    href: '/',
  },
  {
    label: 'Search',
    href: '/',
  },
  {
    label: 'Tokens',
    href: '/coins',
  },
];

const CHART_COLORS = {
  background: '#0b1116',
  text: '#8f9fb1',
  grid: '#1a2332',
  border: '#1a2332',
  crosshairVertical: '#ffffff40',
  crosshairHorizontal: '#ffffff20',
  candleUp: '#b9f6c0',
  candleDown: '#ffaba6',
} as const;

export const getCandlestickConfig = (): CandlestickSeriesPartialOptions => ({
  upColor: CHART_COLORS.candleUp,
  downColor: CHART_COLORS.candleDown,
  wickUpColor: CHART_COLORS.candleUp,
  wickDownColor: CHART_COLORS.candleDown,
  borderVisible: true,
  wickVisible: true,
});

export const getChartConfig = (
  height: number,
  timeVisible: boolean = true
): DeepPartial<ChartOptions> => ({
  width: 0,
  height,
  layout: {
    background: { type: ColorType.Solid, color: CHART_COLORS.background },
    textColor: CHART_COLORS.text,
    fontSize: 12,
    fontFamily: 'Inter, Roboto, "Helvetica Neue", Arial',
  },
  grid: {
    vertLines: { visible: false },
    horzLines: {
      visible: true,
      color: CHART_COLORS.grid,
      style: 2,
    },
  },
  rightPriceScale: {
    borderColor: CHART_COLORS.border,
  },
  timeScale: {
    borderColor: CHART_COLORS.border,
    timeVisible,
    secondsVisible: false,
  },
  handleScroll: true,
  handleScale: true,
  crosshair: {
    mode: 1,
    vertLine: {
      visible: true,
      color: CHART_COLORS.crosshairVertical,
      width: 1,
      style: 0,
    },
    horzLine: {
      visible: true,
      color: CHART_COLORS.crosshairHorizontal,
      width: 1,
      style: 0,
    },
  },
  localization: {
    priceFormatter: (price: number) =>
      '$' + price.toLocaleString(undefined, { maximumFractionDigits: 2 }),
  },
});

export const PERIOD_CONFIG: Record<
  Period,
  { days: number | string; interval?: 'hourly' | 'daily' }
> = {
  daily: { days: 1, interval: 'hourly' },
  weekly: { days: 7, interval: 'hourly' },
  monthly: { days: 30, interval: 'hourly' },
  '3months': { days: 90, interval: 'daily' },
  '6months': { days: 180, interval: 'daily' },
  // For 365 and max: no interval param = automatic granularity (4 days per candle)
  yearly: { days: 365 },
  max: { days: 'max' },
};

export const PERIOD_BUTTONS: { value: Period; label: string }[] = [
  { value: 'daily', label: '1D' },
  { value: 'weekly', label: '1W' },
  { value: 'monthly', label: '1M' },
  { value: '3months', label: '3M' },
  { value: '6months', label: '6M' },
  { value: 'yearly', label: '1Y' },
  { value: 'max', label: 'Max' },
];

// Test Data
export const orderBook = [
  { price: '0.031 BTC', amountBTC: '0.5 BTC', amountETH: '$15,000' },
  { price: '0.0305 BTC', amountBTC: '1.0 BTC', amountETH: '$30,000' },
  { price: '0.0300 BTC', amountBTC: '2.0 BTC', amountETH: '$60,000' },
  { price: '0.0295 BTC', amountBTC: '1.5 BTC', amountETH: '$45,000' },
  { price: '0.0290 BTC', amountBTC: '3.0 BTC', amountETH: '$90,000' },
];

// Popular coins data
export const popularCoins = [
  {
    coinId: 'bitcoin',
    name: 'Bitcoin',
    symbol: 'BTC',
    image: 'https://coin-images.coingecko.com/coins/images/1/large/bitcoin.png',
  },
  {
    coinId: 'ethereum',
    name: 'Ethereum',
    symbol: 'ETH',
    image:
      'https://coin-images.coingecko.com/coins/images/279/large/ethereum.png',
  },
  {
    coinId: 'litecoin',
    name: 'Litecoin',
    symbol: 'LTC',
    image:
      'https://coin-images.coingecko.com/coins/images/2/large/litecoin.png',
  },
  {
    coinId: 'dogecoin',
    name: 'Dogecoin',
    symbol: 'DOGE',
    image:
      'https://coin-images.coingecko.com/coins/images/5/large/dogecoin.png',
  },
];
