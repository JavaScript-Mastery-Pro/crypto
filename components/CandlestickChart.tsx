'use client';

import { useEffect, useRef, useState } from 'react';
import {
  IChartApi,
  ISeriesApi,
  createChart,
  CandlestickSeries,
} from 'lightweight-charts';
import {
  getCandlestickConfig,
  getChartConfig,
  PERIOD_BUTTONS,
  PERIOD_CONFIG,
} from '@/lib/constants';
import { convertOHLCData, convertOHLCToCandlestickData } from '@/lib/utils';
const { getCoinOHLC } = await import('@/lib/coingecko.actions');

export default function CandlestickChart({
  data,
  coinId,
  height = 360,
  children,
  liveOhlcv = null,
  mode = 'historical',
}: CandlestickChartProps) {
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const [period, setPeriod] = useState<Period>('daily');
  const [ohlcData, setOhlcData] = useState<OHLCData[]>(data ?? []);
  const [loading, setLoading] = useState(false);

  console.log('==== Candlestick Chart Live OHLCV:', liveOhlcv);

  // Fetch historical data
  const fetchOHLCData = async (selectedPeriod: Period) => {
    setLoading(true);
    try {
      const config = PERIOD_CONFIG[selectedPeriod];
      const newData = await getCoinOHLC(
        coinId,
        config.days,
        'usd',
        config.interval,
        'full'
      );
      setOhlcData(newData ?? []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePeriodChange = (newPeriod: Period) => {
    if (mode === 'live' || newPeriod === period) return;
    setPeriod(newPeriod);
    fetchOHLCData(newPeriod);
  };

  // Initialize chart
  useEffect(() => {
    const container = chartContainerRef.current;
    if (!container) return;

    const showTime = ['daily', 'weekly', 'monthly'].includes(period);
    const chart = createChart(container, {
      ...getChartConfig(height, showTime),
      width: container.clientWidth,
    });
    const series = chart.addSeries(CandlestickSeries, getCandlestickConfig());

    series.setData(convertOHLCData(ohlcData));
    chart.timeScale().fitContent();

    chartRef.current = chart;
    candleSeriesRef.current = series;

    const observer = new ResizeObserver((entries) => {
      if (!entries.length) return;
      chart.applyOptions({ width: entries[0].contentRect.width });
    });
    observer.observe(container);

    return () => {
      observer.disconnect();
      chart.remove();
      chartRef.current = null;
      candleSeriesRef.current = null;
    };
  }, [height]);

  // Update chart when data or liveOhlcv changes
  useEffect(() => {
    if (!candleSeriesRef.current) return;

    // Convert timestamps from milliseconds to seconds while keeping full OHLC structure
    const convertedToSeconds = ohlcData.map((item) => [
      Math.floor(item[0] / 1000), // timestamp in seconds
      item[1], // open
      item[2], // high
      item[3], // low
      item[4], // close
    ] as OHLCData);
    console.log('==== Updating convertedToSeconds:', convertedToSeconds);

    const merged = liveOhlcv
      ? [...convertedToSeconds, liveOhlcv]
      : [...convertedToSeconds];

    console.log('==== Updating merged:', merged);
    // Sort ascending by time
    merged.sort((a, b) => a[0] - b[0]);

    const converted = convertOHLCData(merged);

    console.log('==== Updating Candlestick Data:', converted);

    candleSeriesRef.current.setData(converted);
    chartRef.current?.timeScale().fitContent();
  }, [ohlcData, liveOhlcv, period]);

  return (
    <div className='candlestick-container'>
      <div className='candlestick-header'>
        <div className='flex-1'>{children}</div>
        {mode === 'historical' && (
          <div className='candlestick-button-group'>
            {PERIOD_BUTTONS.map(({ value, label }) => (
              <button
                key={value}
                className={
                  period === value
                    ? 'candlestick-period-button-active'
                    : 'candlestick-period-button'
                }
                onClick={() => handlePeriodChange(value)}
                disabled={loading}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </div>
      <div
        ref={chartContainerRef}
        className='candlestick-chart-container'
        style={{ height }}
      />
    </div>
  );
}
