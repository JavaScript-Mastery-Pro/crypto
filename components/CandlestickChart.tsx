'use client';

import { useEffect, useRef, useMemo, useState } from 'react';
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
import { convertOHLCData } from '@/lib/utils';

export default function CandlestickChart({
  data,
  coinId,
  height = 360,
  children,
}: CandlestickChartProps) {
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  const [period, setPeriod] = useState<Period>('monthly');
  const [ohlcData, setOhlcData] = useState<OHLCData[]>(data);
  const [loading, setLoading] = useState(false);

  // Memoize converted data to avoid recalculating on every render
  const chartData = useMemo(() => convertOHLCData(ohlcData), [ohlcData]);

  // Fetch OHLC data
  const fetchOHLCData = async (selectedPeriod: Period) => {
    setLoading(true);
    try {
      const config = PERIOD_CONFIG[selectedPeriod];
      const params = new URLSearchParams({
        id: coinId,
        days: String(config.days),
        currency: 'usd',
        precision: 'full',
      });

      // Only add interval if it's defined (not for yearly/max)
      if (config.interval) {
        params.append('interval', config.interval);
      }

      const response = await fetch(`/api/coins/ohlc?${params}`);
      if (!response.ok) throw new Error('Failed to fetch OHLC data');

      const newData = await response.json();
      setOhlcData(newData);
    } catch (error) {
      console.error('Error fetching OHLC data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle period change
  const handlePeriodChange = (newPeriod: Period) => {
    if (newPeriod === period) return;
    setPeriod(newPeriod);
    fetchOHLCData(newPeriod);
  };

  // Initialize chart
  useEffect(() => {
    const container = chartContainerRef.current;
    if (!container) return;

    // Show time for shorter periods with hourly interval
    const showTime = ['daily', 'weekly', 'monthly'].includes(period);

    // Initialize chart
    const chart = createChart(container, {
      ...getChartConfig(height, showTime),
      width: container.clientWidth,
    });

    // Add candlestick series
    const candleSeries = chart.addSeries(
      CandlestickSeries,
      getCandlestickConfig()
    );
    candleSeries.setData(chartData);

    // Fit content to display all data
    chart.timeScale().fitContent();

    // Store refs
    chartRef.current = chart;
    candleSeriesRef.current = candleSeries;

    // Handle responsive resizing using ResizeObserver (more efficient than window resize)
    resizeObserverRef.current = new ResizeObserver((entries) => {
      if (!entries.length || !chartRef.current) return;

      const { width } = entries[0].contentRect;
      chartRef.current.applyOptions({ width });
    });

    resizeObserverRef.current.observe(container);

    // Cleanup function
    return () => {
      resizeObserverRef.current?.disconnect();
      chartRef.current?.remove();
      chartRef.current = null;
      candleSeriesRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [height]);

  // Update chart data when chartData or period changes
  useEffect(() => {
    if (candleSeriesRef.current && chartRef.current) {
      candleSeriesRef.current.setData(chartData);
      chartRef.current.timeScale().fitContent();

      // Update time visibility based on period
      const showTime = ['daily', 'weekly', 'monthly'].includes(period);
      chartRef.current.applyOptions({
        timeScale: {
          timeVisible: showTime,
        },
      });
    }
  }, [chartData, period]);

  return (
    <div className='candlestick-container'>
      {/* Chart Header */}
      <div className='candlestick-header'>
        <div className='flex-1'>{children}</div>
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
      </div>

      {/* Chart Container */}
      <div
        ref={chartContainerRef}
        className='candlestick-chart-container'
        style={{ height }}
      />
    </div>
  );
}
