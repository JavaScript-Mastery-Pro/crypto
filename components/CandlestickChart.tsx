'use client';

import { useEffect, useRef, useMemo } from 'react';
import {
  IChartApi,
  ISeriesApi,
  createChart,
  CandlestickSeries,
} from 'lightweight-charts';
import { getCandlestickConfig, getChartConfig } from '@/lib/constants';
import { convertOHLCData } from '@/lib/utils';

export default function CandlestickChart({
  data,
  height = 360,
}: CandlestickChartProps) {
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  // Memoize converted data to avoid recalculating on every render
  const chartData = useMemo(() => convertOHLCData(data), [data]);

  useEffect(() => {
    const container = chartContainerRef.current;
    if (!container) return;

    // Initialize chart
    const chart = createChart(container, {
      ...getChartConfig(height),
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
  }, [chartData, height]);

  return (
    <div className='candlestick-container'>
      {/* Chart Header */}
      <div className='candlestick-header'>
        <div className='candlestick-button-group'>
          <button className='candlestick-dropdown-button'>BTC ▾</button>
          <button className='candlestick-period-button'>Daily</button>
          <button className='candlestick-period-button-active'>Monthly</button>
          <button className='candlestick-period-button'>Yearly</button>
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
