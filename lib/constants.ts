import { CandlestickSeriesPartialOptions, ChartOptions, ColorType, DeepPartial } from "lightweight-charts";

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

export const getChartConfig = (height: number): DeepPartial<ChartOptions> => ({
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
    timeVisible: false,
    secondsVisible: true,
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

// Test Data
export  const orderBook = [
    { price: '0.031 BTC', amountBTC: '0.5 BTC', amountETH: '$15,000' },
    { price: '0.0305 BTC', amountBTC: '1.0 BTC', amountETH: '$30,000' },
    { price: '0.0300 BTC', amountBTC: '2.0 BTC', amountETH: '$60,000' },
    { price: '0.0295 BTC', amountBTC: '1.5 BTC', amountETH: '$45,000' },
    { price: '0.0290 BTC', amountBTC: '3.0 BTC', amountETH: '$90,000' },
  ];

export  const similarCoins = [
    { name: 'Bitcoin', symbol: 'BTC', price: 30000 },
    { name: 'Cardano', symbol: 'ADA', price: 2.15 },
    { name: 'Solana', symbol: 'SOL', price: 35.5 },
    { name: 'Ripple', symbol: 'XRP', price: 0.75 },
    { name: 'Polkadot', symbol: 'DOT', price: 18.2 },
  ];
