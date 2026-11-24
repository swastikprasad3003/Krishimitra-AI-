import { engine } from '../data/engine';
import { UNIVERSE } from '../data/universe';
import { formatPct, formatPrice } from '../ai/i18n';
import { useMarketTick } from '../hooks';

/** Scrolling live ticker across both markets (indices + majors). */
export default function TickerTape() {
  useMarketTick();
  const items = UNIVERSE.filter((d) => d.isIndex || ['RELIANCE', 'TCS', 'INFY', 'AAPL', 'NVDA', 'MSFT', 'TSLA', 'GOOGL', 'HDFCBANK', 'AMZN'].includes(d.symbol));

  const row = items.map((def) => {
    const q = engine.getQuote(def.symbol);
    if (!q) return null;
    const up = q.changePct >= 0;
    return (
      <span className="ticker-item" key={def.symbol}>
        <b>{def.symbol}</b>
        <span className="ticker-price">{formatPrice(q.price, def.market)}</span>
        <span className={up ? 'up' : 'down'}>
          {up ? '▲' : '▼'} {formatPct(q.changePct)}
        </span>
      </span>
    );
  });

  return (
    <div className="ticker" aria-label="Live market ticker">
      <div className="ticker-track">
        <span className="ticker-group">{row}</span>
        <span className="ticker-group" aria-hidden="true">
          {row}
        </span>
      </div>
    </div>
  );
}
