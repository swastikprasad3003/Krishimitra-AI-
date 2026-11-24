import { engine } from '../data/engine';
import { tradableForMarket, type Market } from '../data/universe';
import { analyze } from '../ai/indicators';
import { t, type LangCode } from '../ai/i18n';
import { useMarketTick } from '../hooks';

interface Props {
  market: Market;
  lang: LangCode;
  onSelect: (sym: string) => void;
}

const PILL: Record<string, string> = {
  STRONG_BUY: 'sig-strong-buy',
  BUY: 'sig-buy',
  HOLD: 'sig-hold',
  SELL: 'sig-sell',
  STRONG_SELL: 'sig-strong-sell',
};

export default function AIPicks({ market, lang, onSelect }: Props) {
  useMarketTick();
  const s = t(lang);

  const picks = tradableForMarket(market)
    .map((def) => {
      const candles = engine.getCandles(def.symbol, '5m');
      return { def, analysis: analyze(candles) };
    })
    .sort((a, b) => b.analysis.score - a.analysis.score)
    .slice(0, 4);

  return (
    <section className="panel picks">
      <div className="panel-title">
        <span>🤖 {s.ui.topPicks}</span>
        <small className="muted">↻ {s.ui.refreshed}</small>
      </div>
      <ul className="pick-rows">
        {picks.map((p, i) => (
          <li key={p.def.symbol} className="pick-row" onClick={() => onSelect(p.def.symbol)}>
            <span className="rank">#{i + 1}</span>
            <div className="pick-info">
              <b>{p.def.symbol}</b>
              <small>{p.def.name}</small>
            </div>
            <div className="pick-signal">
              <span className={`pill ${PILL[p.analysis.label]}`}>{s.signals[p.analysis.label]}</span>
              <div className="conf-track slim">
                <div
                  className={`conf-fill ${PILL[p.analysis.label]}`}
                  style={{ width: `${p.analysis.confidence}%` }}
                />
              </div>
              <small className="muted">
                {s.ui.confidence} {p.analysis.confidence}%
              </small>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
