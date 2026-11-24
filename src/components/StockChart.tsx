import { useEffect, useRef } from 'react';
import { createChart, ColorType, CrosshairMode, type IChartApi, type ISeriesApi, type UTCTimestamp } from 'lightweight-charts';
import { engine, TIMEFRAMES, type Timeframe } from '../data/engine';
import { getSymbolDef } from '../data/universe';
import { formatCompact, formatPct, formatPrice, t, type LangCode } from '../ai/i18n';
import { useMarketTick } from '../hooks';

interface Props {
  symbol: string;
  timeframe: Timeframe;
  setTimeframe: (tf: Timeframe) => void;
  lang: LangCode;
}

export default function StockChart({ symbol, timeframe, setTimeframe, lang }: Props) {
  const tick = useMarketTick();
  const s = t(lang);
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const volumeRef = useRef<ISeriesApi<'Histogram'> | null>(null);
  const symbolRef = useRef(symbol);
  const tfRef = useRef(timeframe);

  // create chart once
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const chart = createChart(el, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#94a3b8',
        fontSize: 12,
      },
      grid: {
        vertLines: { color: 'rgba(148,163,184,0.07)' },
        horzLines: { color: 'rgba(148,163,184,0.07)' },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: { color: 'rgba(99,102,241,0.5)', labelBackgroundColor: '#6366f1' },
        horzLine: { color: 'rgba(99,102,241,0.5)', labelBackgroundColor: '#6366f1' },
      },
      rightPriceScale: { borderColor: 'rgba(148,163,184,0.15)' },
      timeScale: {
        borderColor: 'rgba(148,163,184,0.15)',
        timeVisible: true,
        secondsVisible: false,
      },
      autoSize: true,
    });

    const candles = chart.addCandlestickSeries({
      upColor: '#22c55e',
      downColor: '#ef4444',
      borderUpColor: '#22c55e',
      borderDownColor: '#ef4444',
      wickUpColor: '#22c55e',
      wickDownColor: '#ef4444',
      priceLineColor: '#6366f1',
    });
    const volume = chart.addHistogramSeries({
      priceFormat: { type: 'volume' },
      priceScaleId: 'vol',
    });
    chart.priceScale('vol').applyOptions({
      scaleMargins: { top: 0.82, bottom: 0 },
    });

    chartRef.current = chart;
    candleRef.current = candles;
    volumeRef.current = volume;

    return () => {
      chart.remove();
      chartRef.current = null;
      candleRef.current = null;
      volumeRef.current = null;
    };
  }, []);

  // (re)load data when symbol or timeframe changes
  useEffect(() => {
    symbolRef.current = symbol;
    tfRef.current = timeframe;
    const candles = engine.getCandles(symbol, timeframe);
    candleRef.current?.setData(
      candles.map((c) => ({
        time: c.time as UTCTimestamp,
        open: c.open,
        high: c.high,
        low: c.low,
        close: c.close,
      })),
    );
    volumeRef.current?.setData(
      candles.map((c) => ({
        time: c.time as UTCTimestamp,
        value: c.volume,
        color: c.close >= c.open ? 'rgba(34,197,94,0.35)' : 'rgba(239,68,68,0.35)',
      })),
    );
    chartRef.current?.timeScale().fitContent();
  }, [symbol, timeframe]);

  // live updates every engine tick
  useEffect(() => {
    if (!candleRef.current) return;
    const candles = engine.getCandles(symbolRef.current, tfRef.current);
    const last = candles[candles.length - 1];
    if (!last) return;
    candleRef.current.update({
      time: last.time as UTCTimestamp,
      open: last.open,
      high: last.high,
      low: last.low,
      close: last.close,
    });
    volumeRef.current?.update({
      time: last.time as UTCTimestamp,
      value: last.volume,
      color: last.close >= last.open ? 'rgba(34,197,94,0.35)' : 'rgba(239,68,68,0.35)',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick]);

  const def = getSymbolDef(symbol);
  const quote = engine.getQuote(symbol);
  if (!def || !quote) return null;
  const up = quote.changePct >= 0;
  const tfLabel: Record<Timeframe, string> = {
    '1m': '1m',
    '5m': '5m',
    '15m': '15m',
    '1H': '1H',
    '1D': '1D',
  };

  return (
    <section className="panel chart-panel">
      <div className="chart-head">
        <div className="chart-symbol">
          <div className="chart-symbol-row">
            <h2>{def.symbol}</h2>
            <span className="sector-tag">{def.sector}</span>
            <span className="feed-tag">● {s.ui.simulated}</span>
          </div>
          <div className="chart-price-row">
            <span className={`chart-price ${up ? 'up' : 'down'}`}>{formatPrice(quote.price, def.market)}</span>
            <span className={`chip big ${up ? 'up' : 'down'}`}>
              {up ? '▲' : '▼'} {formatPrice(Math.abs(quote.change), def.market)} ({formatPct(quote.changePct)})
            </span>
          </div>
          <div className="ohlc-row">
            <span>
              {s.ui.open} <b>{formatPrice(quote.dayOpen, def.market)}</b>
            </span>
            <span>
              {s.ui.high} <b>{formatPrice(quote.dayHigh, def.market)}</b>
            </span>
            <span>
              {s.ui.low} <b>{formatPrice(quote.dayLow, def.market)}</b>
            </span>
            <span>
              {s.ui.volume} <b>{formatCompact(quote.volume, def.market)}</b>
            </span>
          </div>
        </div>
        <div className="tf-buttons">
          {TIMEFRAMES.map((tf) => (
            <button key={tf} className={tf === timeframe ? 'active' : ''} onClick={() => setTimeframe(tf)}>
              {tfLabel[tf]}
            </button>
          ))}
        </div>
      </div>
      <div className="chart-container" ref={containerRef} />
    </section>
  );
}
