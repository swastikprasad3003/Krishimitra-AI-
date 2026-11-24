import { engine, type Timeframe } from '../data/engine';
import { getSymbolDef } from '../data/universe';
import { analyze } from '../ai/indicators';
import { t, type LangCode } from '../ai/i18n';
import { useMarketTick } from '../hooks';

interface Props {
  symbol: string;
  timeframe: Timeframe;
  lang: LangCode;
  onAsk: (question: string) => void;
}

const LABEL_CLASS: Record<string, string> = {
  STRONG_BUY: 'sig-strong-buy',
  BUY: 'sig-buy',
  HOLD: 'sig-hold',
  SELL: 'sig-sell',
  STRONG_SELL: 'sig-strong-sell',
};

export default function SignalBar({ symbol, timeframe, lang, onAsk }: Props) {
  useMarketTick();
  const s = t(lang);
  const def = getSymbolDef(symbol);
  const candles = engine.getCandles(symbol, timeframe);
  const analysis = analyze(candles);
  if (!def) return null;

  const signalText = s.signals[analysis.label];

  return (
    <section className="panel signal-bar">
      <div className="signal-left">
        <div className={`signal-badge ${LABEL_CLASS[analysis.label]}`}>
          <span className="signal-label">{s.ui.signal}</span>
          <strong>{signalText}</strong>
        </div>
        <div className="signal-confidence">
          <span>
            {s.ui.confidence}: <b>{analysis.confidence}%</b>
          </span>
          <div className="conf-track">
            <div className={`conf-fill ${LABEL_CLASS[analysis.label]}`} style={{ width: `${analysis.confidence}%` }} />
          </div>
        </div>
      </div>

      <ul className="signal-reasons">
        {analysis.reasons.map((r) => (
          <li key={r}>{s.reasons[r]}</li>
        ))}
      </ul>

      <div className="signal-metrics">
        <div className="metric">
          <small>{s.ui.rsi}</small>
          <b className={analysis.rsi > 70 ? 'down' : analysis.rsi < 30 ? 'up' : ''}>{analysis.rsi.toFixed(0)}</b>
        </div>
        <div className="metric">
          <small>Mom 20</small>
          <b className={analysis.momentum >= 0 ? 'up' : 'down'}>
            {analysis.momentum >= 0 ? '+' : ''}
            {analysis.momentum.toFixed(2)}%
          </b>
        </div>
        <div className="metric">
          <small>SMA 20/50</small>
          <b className={analysis.smaFast >= analysis.smaSlow ? 'up' : 'down'}>
            {analysis.smaFast >= analysis.smaSlow ? '▲' : '▼'}
          </b>
        </div>
      </div>

      <button className="ask-ai-btn" onClick={() => onAsk(`Should I buy ${symbol}?`)}>
        🤖 {s.ui.askAi}
      </button>
    </section>
  );
}
