// Technical analysis engine: computes indicators from candles and produces a
// composite buy/sell signal with explainable reason codes.

import type { Candle } from '../data/engine';

export type SignalLabel = 'STRONG_BUY' | 'BUY' | 'HOLD' | 'SELL' | 'STRONG_SELL';

export type ReasonCode =
  | 'above_fast_ma'
  | 'below_fast_ma'
  | 'golden_cross'
  | 'death_cross'
  | 'rsi_oversold'
  | 'rsi_overbought'
  | 'rsi_neutral'
  | 'momentum_up'
  | 'momentum_down'
  | 'high_volatility'
  | 'near_support'
  | 'near_resistance';

export interface Analysis {
  label: SignalLabel;
  score: number; // -100 … +100
  confidence: number; // 0 … 100
  reasons: ReasonCode[];
  smaFast: number;
  smaSlow: number;
  rsi: number;
  momentum: number; // % over lookback window
  volatility: number; // annualised % (demo scale)
  support: number;
  resistance: number;
}

export function sma(values: number[], period: number): number {
  if (values.length === 0) return 0;
  const p = Math.min(period, values.length);
  const slice = values.slice(-p);
  return slice.reduce((a, b) => a + b, 0) / slice.length;
}

export function rsi(closes: number[], period = 14): number {
  if (closes.length < period + 1) return 50;
  let gains = 0;
  let losses = 0;
  for (let i = closes.length - period; i < closes.length; i++) {
    const d = closes[i] - closes[i - 1];
    if (d >= 0) gains += d;
    else losses -= d;
  }
  if (losses === 0) return 100;
  const rs = gains / losses;
  return 100 - 100 / (1 + rs);
}

export function analyze(candles: Candle[]): Analysis {
  const closes = candles.map((c) => c.close);
  const price = closes[closes.length - 1] ?? 0;
  const smaFast = sma(closes, 20);
  const smaSlow = sma(closes, 50);
  const prevSmaFast = sma(closes.slice(0, -1), 20);
  const prevSmaSlow = sma(closes.slice(0, -1), 50);
  const rsiVal = rsi(closes, 14);

  const lookback = Math.min(20, closes.length - 1);
  const momentum = lookback > 0 ? ((price - closes[closes.length - 1 - lookback]) / closes[closes.length - 1 - lookback]) * 100 : 0;

  // realised volatility over last 30 returns (annualised, demo scale)
  const rets: number[] = [];
  for (let i = Math.max(1, closes.length - 30); i < closes.length; i++) {
    rets.push(Math.log(closes[i] / closes[i - 1]));
  }
  const mean = rets.length ? rets.reduce((a, b) => a + b, 0) / rets.length : 0;
  const variance = rets.length ? rets.reduce((a, r) => a + (r - mean) ** 2, 0) / rets.length : 0;
  const perBarVol = Math.sqrt(variance);
  const barsPerYear = 1440; // 1-minute bars assumption for display
  const volatility = perBarVol * Math.sqrt(barsPerYear) * 100;

  const window = closes.slice(-60);
  const support = Math.min(...window);
  const resistance = Math.max(...window);

  let score = 0;
  const reasons: ReasonCode[] = [];

  // trend: price vs fast MA, fast vs slow MA
  if (price > smaFast) {
    score += 18;
    reasons.push('above_fast_ma');
  } else {
    score -= 18;
    reasons.push('below_fast_ma');
  }
  if (smaFast > smaSlow && prevSmaFast > prevSmaSlow) {
    score += 24;
    reasons.push('golden_cross');
  } else if (smaFast < smaSlow && prevSmaFast < prevSmaSlow) {
    score -= 24;
    reasons.push('death_cross');
  }

  // RSI: contrarian at extremes, trend-confirming mid-range
  if (rsiVal < 30) {
    score += 22;
    reasons.push('rsi_oversold');
  } else if (rsiVal > 70) {
    score -= 22;
    reasons.push('rsi_overbought');
  } else {
    reasons.push('rsi_neutral');
    score += (rsiVal - 50) * 0.4;
  }

  // momentum
  if (momentum > 2) {
    score += 18;
    reasons.push('momentum_up');
  } else if (momentum < -2) {
    score -= 18;
    reasons.push('momentum_down');
  }

  // proximity to support / resistance
  if (price <= support * 1.01) {
    score += 10;
    reasons.push('near_support');
  } else if (price >= resistance * 0.99) {
    score -= 10;
    reasons.push('near_resistance');
  }

  // volatility is a risk factor — dampens conviction, never flips direction
  if (volatility > 80) reasons.push('high_volatility');

  score = Math.max(-100, Math.min(100, Math.round(score)));

  let label: SignalLabel;
  if (score >= 45) label = 'STRONG_BUY';
  else if (score >= 15) label = 'BUY';
  else if (score <= -45) label = 'STRONG_SELL';
  else if (score <= -15) label = 'SELL';
  else label = 'HOLD';

  const confidence = Math.min(96, Math.round(40 + Math.abs(score) * 0.55));

  return {
    label,
    score,
    confidence,
    reasons: reasons.slice(0, 5),
    smaFast,
    smaSlow,
    rsi: rsiVal,
    momentum,
    volatility,
    support,
    resistance,
  };
}

/** Rank tradable symbols for a market — returns best-scoring candidates. */
export function rankSymbols(analyses: { symbol: string; analysis: Analysis }[]): {
  symbol: string;
  analysis: Analysis;
}[] {
  return [...analyses].sort((a, b) => b.analysis.score - a.analysis.score);
}
