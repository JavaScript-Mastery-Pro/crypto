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
  LIVE_INTERVAL_BUTTONS,
  PERIOD_BUTTONS,
  PERIOD_CONFIG,
} from '@/lib/constants';
import { convertOHLCData } from '@/lib/utils';
const { fetcher } = await import('@/lib/coingecko.actions');

export default function CandlestickChart({
  data,
  coinId,
  height = 360,
  children,
  liveOhlcv = null,
  mode = 'historical',
  initialPeriod = 'daily',
  liveInterval,
  setLiveInterval,
}: CandlestickChartProps) {
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);

  const [period, setPeriod] = useState<Period>(initialPeriod);
  const [ohlcData, setOhlcData] = useState<OHLCData[]>(data ?? []);
  const [loading, setLoading] = useState(false);
  const prevOhlcDataLength = useRef<number>(data?.length ?? 0);

  // Fetch OHLC data when period changes
  const fetchOHLCData = async (selectedPeriod: Period) => {
    setLoading(true);
    try {
      const config = PERIOD_CONFIG[selectedPeriod];

      const newData = await fetcher<OHLCData[]>(`/coins/${coinId}/ohlc`, {
        vs_currency: 'usd',
        days: config.days,
        interval: config.interval,
        precision: 'full',
      });

      setOhlcData(newData ?? []);
    } catch (err) {
      console.error('Failed to fetch OHLC data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePeriodChange = (newPeriod: Period) => {
    if (newPeriod === period) return;

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [height]);

  // Update chart when data or liveOhlcv changes
  useEffect(() => {
    if (!candleSeriesRef.current) return;

    // Convert timestamps from milliseconds to seconds
    const convertedToSeconds = ohlcData.map(
      (item) =>
        [
          Math.floor(item[0] / 1000), // timestamp in seconds
          item[1], // open
          item[2], // high
          item[3], // low
          item[4], // close
        ] as OHLCData
    );

    let merged: OHLCData[];

    if (liveOhlcv) {
      const liveTimestamp = liveOhlcv[0];

      // Check if we need to update an existing candle or add a new one
      const lastHistoricalCandle =
        convertedToSeconds[convertedToSeconds.length - 1];

      if (lastHistoricalCandle && lastHistoricalCandle[0] === liveTimestamp) {
        // Update the last candle with live data
        merged = [...convertedToSeconds.slice(0, -1), liveOhlcv];
      } else {
        // Append new live candle
        merged = [...convertedToSeconds, liveOhlcv];
      }
    } else {
      merged = convertedToSeconds;
    }

    // Sort ascending by time (in case of any ordering issues)
    merged.sort((a, b) => a[0] - b[0]);

    const converted = convertOHLCData(merged);

    candleSeriesRef.current.setData(converted);

    // Fit content when ohlcData changes (period change), not on live updates
    const dataChanged = prevOhlcDataLength.current !== ohlcData.length;
    if (dataChanged || mode === 'historical') {
      chartRef.current?.timeScale().fitContent();
      prevOhlcDataLength.current = ohlcData.length;
    }
  }, [ohlcData, liveOhlcv, period, mode]);

  return (
    <div id='candlestick-chart'>
      <div className='chart-header'>
        <div className='flex-1'>{children}</div>

        <div className='button-group'>
          <span className='text-sm mx-2 font-medium text-purple-100/50'>
            Period:
          </span>
          {PERIOD_BUTTONS.map(({ value, label }) => (
            <button
              key={value}
              className={
                period === value ? 'config-button-active' : 'config-button'
              }
              onClick={() => handlePeriodChange(value)}
              disabled={loading}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Update Frequency: as fast as 1s, for actively traded pools. */}
        <div className='button-group'>
          <span className='text-sm mx-2 font-medium text-purple-100/50'>
            Update Frequency:
          </span>
          {LIVE_INTERVAL_BUTTONS.map(({ value, label }) => (
            <button
              key={value}
              className={
                liveInterval === value
                  ? 'config-button-active'
                  : 'config-button'
              }
              onClick={() => setLiveInterval && setLiveInterval(value)}
              disabled={loading}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div ref={chartContainerRef} className='chart' style={{ height }} />
    </div>
  );
}
