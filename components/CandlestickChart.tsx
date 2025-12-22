'use client';

import { useEffect, useRef, useState } from 'react';
import { createChart, CandlestickSeries, IChartApi, ISeriesApi } from 'lightweight-charts';

import { getChartConfig, getCandlestickConfig, PERIOD_BUTTONS, PERIOD_CONFIG } from '@/lib/constants';
import { convertOHLCData } from '@/lib/utils';
import { getCoinOHLC } from '@/lib/coingecko.actions';

export default function CandlestickChart({ initialData, liveOhlcv, coinId, children, height = 400 }: CandlestickChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);

  const [ohlcData, setOhlcData] = useState(initialData);
  const [period, setPeriod] = useState('daily');
  const [isLoading, setIsLoading] = useState(false);

  // 1. Handle Period Changes
  const changePeriod = async (newPeriod: string) => {
    setIsLoading(true);
    setPeriod(newPeriod);

    try {
      const config = PERIOD_CONFIG[newPeriod as keyof typeof PERIOD_CONFIG];

      // CORRECT ORDER: id, days, currency, interval
      const data = await getCoinOHLC(
        coinId,
        config.days,
        'usd', // Add 'usd' explicitly here
        config.interval, // Interval is the 4th argument
      );

      setOhlcData(data);
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Initialize Chart
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, getChartConfig(height));
    const series = chart.addSeries(CandlestickSeries, getCandlestickConfig());

    chartRef.current = chart;
    seriesRef.current = series;

    // Handle Resize
    const handleResize = () => {
      chart.applyOptions({ width: chartContainerRef.current?.clientWidth });
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [height]);

  // 3. Update Series Data
  useEffect(() => {
    if (seriesRef.current && ohlcData) {
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

      // Update the chart series
      const formatted = convertOHLCData(merged);
      seriesRef.current.setData(formatted);

      chartRef.current?.timeScale().fitContent();
    }
  }, [ohlcData, liveOhlcv, period]);

  return (
    <div id='candlestick-chart' className='flex flex-col'>
      <div className='chart-header flex justify-between items-center p-4'>
        {children}
        <div className='button-group bg-dark-400 p-1 rounded-md flex gap-1'>
          {PERIOD_BUTTONS.map((btn) => (
            <button
              key={btn.value}
              onClick={() => changePeriod(btn.value)}
              className={period === btn.value ? 'period-button-active' : 'period-button'}
              disabled={isLoading}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>
      <div ref={chartContainerRef} className='w-full' />
    </div>
  );
}
