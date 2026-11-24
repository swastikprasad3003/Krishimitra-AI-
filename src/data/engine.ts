// Live market simulation engine.
// Drives every symbol with a correlated random walk (shared market factor +
// idiosyncratic noise), builds OHLC candles per timeframe, and pushes updates
// to subscribers once per second. Designed so a real API feed can replace it.

import { UNIVERSE, getSymbolDef, type Market, type SymbolDef } from './universe';

export type Timeframe = '1m' | '5m' | '15m' | '1H' | '1D';

export const TIMEFRAMES: Timeframe[] = ['1m', '5m', '15m', '1H', '1D'];

export const TF_MS: Record<Timeframe, number> = {
  '1m': 60_000,
  '5m': 300_000,
  '15m': 900_000,
  '1H': 3_600_000,
  '1D': 86_400_000,
};

export interface Candle {
  time: number; // unix seconds (bucket start)
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface Quote {
  def: SymbolDef;
  price: number;
  prevClose: number;
  dayOpen: number;
  dayHigh: number;
  dayLow: number;
  change: number;
  changePct: number;
  volume: number;
  tickDir: 1 | -1 | 0;
}

// ---------- deterministic PRNG ----------
function hashStr(s: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function gauss(rnd: () => number): number {
  // Box–Muller
  let u = 0;
  let v = 0;
  while (u === 0) u = rnd();
  while (v === 0) v = rnd();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

// Demo amplification: makes 1-second ticks visibly move the chart while the
// long-run behaviour still resembles the symbol's real volatility profile.
const DEMO_BOOST = 26;
const TICK_MS = 1000;
const YEAR_MS = 365 * 24 * 3600 * 1000;
const HISTORY_BARS = 160;
const MAX_BARS = 240;

interface EngineState {
  price: number;
  prevClose: number;
  dayOpen: number;
  dayHigh: number;
  dayLow: number;
  volume: number;
  drift: number; // slow regime drift, re-anchored occasionally
  tickDir: 1 | -1 | 0;
}

class MarketEngine {
  private state = new Map<string, EngineState>();
  private candleCache = new Map<string, Candle[]>(); // `${symbol}|${tf}`
  private listeners = new Set<() => void>();
  private timer: ReturnType<typeof setInterval> | null = null;
  private newsTimer = 0;
  readonly startedAt = Date.now();

  constructor() {
    for (const def of UNIVERSE) {
      const rnd = mulberry32(hashStr(def.symbol + ':day'));
      const prevClose = def.base * (1 + (rnd() - 0.5) * 0.035);
      this.state.set(def.symbol, {
        price: def.base,
        prevClose,
        dayOpen: def.base * (1 + (rnd() - 0.5) * 0.01),
        dayHigh: def.base * 1.002,
        dayLow: def.base * 0.998,
        volume: Math.round((2_000_000 + rnd() * 30_000_000) * (def.isIndex ? 0 : 1)),
        drift: (rnd() - 0.48) * 0.00018, // per-tick drift (≈ ±0.018%/s)
        tickDir: 0,
      });
    }
  }

  start(): void {
    if (this.timer) return;
    this.timer = setInterval(() => this.tick(), TICK_MS);
  }

  stop(): void {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
  }

  subscribe(fn: () => void): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  getQuote(symbol: string): Quote | undefined {
    const def = getSymbolDef(symbol);
    const st = this.state.get(symbol);
    if (!def || !st) return undefined;
    return {
      def,
      price: st.price,
      prevClose: st.prevClose,
      dayOpen: st.dayOpen,
      dayHigh: st.dayHigh,
      dayLow: st.dayLow,
      change: st.price - st.prevClose,
      changePct: ((st.price - st.prevClose) / st.prevClose) * 100,
      volume: st.volume,
      tickDir: st.tickDir,
    };
  }

  getQuotes(symbols: string[]): Quote[] {
    return symbols.map((s) => this.getQuote(s)).filter((q): q is Quote => !!q);
  }

  marketQuotes(market: Market): Quote[] {
    return UNIVERSE.filter((d) => d.market === market)
      .map((d) => this.getQuote(d.symbol))
      .filter((q): q is Quote => !!q);
  }

  /** Candles for a symbol/timeframe: generated history + live last bar. */
  getCandles(symbol: string, tf: Timeframe): Candle[] {
    const key = `${symbol}|${tf}`;
    let bars = this.candleCache.get(key);
    if (!bars) {
      bars = this.generateHistory(symbol, tf);
      this.candleCache.set(key, bars);
    }
    this.syncLiveBar(symbol, tf, bars);
    return bars;
  }

  // ---------- internals ----------

  private generateHistory(symbol: string, tf: Timeframe): Candle[] {
    const def = getSymbolDef(symbol)!;
    const st = this.state.get(symbol)!;
    const dur = TF_MS[tf];
    const now = Date.now();
    const bucket = Math.floor(now / dur) * dur;
    const rnd = mulberry32(hashStr(`${symbol}|${tf}|${bucket}`));

    // per-bar sigma from annualised vol — kept sane across timeframes
    const barYears = dur / YEAR_MS;
    const barSigma = Math.min(Math.max(def.vol * Math.sqrt(barYears) * 5, 0.0015), 0.06);

    // build forward returns, then rescale so the last close equals current price
    const closes: number[] = [1];
    for (let i = 1; i <= HISTORY_BARS; i++) {
      const z = gauss(rnd);
      const regime = Math.sin(i / 23) * barSigma * 0.35; // gentle wave so trends appear
      closes.push(closes[i - 1] * Math.exp(regime + barSigma * z));
    }
    const scale = st.price / closes[closes.length - 1];

    const bars: Candle[] = [];
    let prev = closes[0] * scale;
    for (let i = 0; i < HISTORY_BARS; i++) {
      const t = Math.floor((bucket - (HISTORY_BARS - 1 - i) * dur) / 1000);
      const close = closes[i] * scale;
      const open = prev;
      const span = Math.abs(close - open) + close * barSigma * (0.3 + rnd() * 0.7);
      const high = Math.max(open, close) + span * rnd() * 0.6;
      const low = Math.min(open, close) - span * rnd() * 0.6;
      const volume = Math.round((0.6 + rnd()) * 1_000_000 * (def.isIndex ? 0 : 1) * (1 + Math.abs(close - open) / (close * barSigma + 1e-9)) * 0.5);
      bars.push({ time: t, open, high, low, close, volume });
      prev = close;
    }
    // attach the true current price to the newest bar
    const last = bars[bars.length - 1];
    last.close = st.price;
    last.high = Math.max(last.high, st.price);
    last.low = Math.min(last.low, st.price);
    return bars;
  }

  private syncLiveBar(symbol: string, tf: Timeframe, bars: Candle[]): void {
    const st = this.state.get(symbol);
    if (!st || bars.length === 0) return;
    const dur = TF_MS[tf];
    const bucket = Math.floor(Date.now() / dur) * dur;
    const bucketSec = Math.floor(bucket / 1000);
    const last = bars[bars.length - 1];

    if (last.time === bucketSec) {
      last.close = st.price;
      last.high = Math.max(last.high, st.price);
      last.low = Math.min(last.low, st.price);
      last.volume += Math.round(Math.random() * 800);
    } else if (bucketSec > last.time) {
      bars.push({
        time: bucketSec,
        open: last.close,
        high: Math.max(last.close, st.price),
        low: Math.min(last.close, st.price),
        close: st.price,
        volume: Math.round(500 + Math.random() * 5000),
      });
      while (bars.length > MAX_BARS) bars.shift();
    }
  }

  private tick(): void {
    const now = Date.now();
    const dt = TICK_MS / YEAR_MS;

    // shared market factor each second (creates correlated, realistic tape)
    const fIN = gauss(Math.random);
    const fUS = gauss(Math.random);
    const factors: Record<Market, number> = { IN: fIN, US: fUS };

    // occasional market-wide news pulses
    this.newsTimer += TICK_MS;
    const pulse =
      this.newsTimer % 45_000 < TICK_MS
        ? { IN: (Math.random() < 0.5 ? -1 : 1) * 0.0016, US: (Math.random() < 0.5 ? -1 : 1) * 0.0016 }
        : { IN: 0, US: 0 };

    for (const def of UNIVERSE) {
      const st = this.state.get(def.symbol)!;
      const rnd = Math.random;
      const z = gauss(rnd);

      // per-second sigma: realistic annualised vol, amplified for demo visibility
      const sigmaTick = def.vol * Math.sqrt(dt) * DEMO_BOOST;
      const beta = def.isIndex ? 1 : 0.85 + (hashStr(def.symbol) % 30) / 100;
      // shared market factor contributes a fraction of the per-tick sigma
      const marketRet = beta * factors[def.market] * sigmaTick * 0.55 + pulse[def.market];
      const idio = sigmaTick * 0.75 * z;
      const revert = 0.004 * Math.log(def.base / st.price) * 0.02; // mild anchor
      const ret = st.drift + marketRet + idio + revert;

      const prevPrice = st.price;
      const next = Math.max(st.price * Math.exp(ret), def.base * 0.5);
      st.price = next;
      st.tickDir = next > prevPrice ? 1 : next < prevPrice ? -1 : 0;
      st.dayHigh = Math.max(st.dayHigh, next);
      st.dayLow = Math.min(st.dayLow, next);
      if (!def.isIndex) {
        st.volume += Math.round((1 + Math.abs(ret) * 4000) * (20 + rnd() * 120));
      }

      // slowly wandering regime so trends emerge over minutes (per-tick drift)
      if (rnd() < 0.02) st.drift = (rnd() - 0.485) * 0.0002;
    }

    // refresh open candle caches for live bars
    for (const key of this.candleCache.keys()) {
      const [symbol, tf] = key.split('|') as [string, Timeframe];
      const bars = this.candleCache.get(key)!;
      this.syncLiveBar(symbol, tf, bars);
    }

    for (const fn of this.listeners) fn();
  }
}

export const engine = new MarketEngine();

// auto-start on import (browser only)
if (typeof window !== 'undefined') {
  engine.start();
}
