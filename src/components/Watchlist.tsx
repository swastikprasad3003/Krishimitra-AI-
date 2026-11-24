import { engine } from '../data/engine';
import { symbolsForMarket, type Market } from '../data/universe';
import { formatPct, formatPrice, t, type LangCode } from '../ai/i18n';
import { useMarketTick } from '../hooks';

interface Props {
  market: Market;
  lang: LangCode;
  watch: string[];
  selected: string;
  onSelect: (sym: string) => void;
  onAdd: (sym: string) => void;
  onRemove: (sym: string) => void;
}

export default function Watchlist({ market, lang, watch, selected, onSelect, onAdd, onRemove }: Props) {
  useMarketTick();
  const s = t(lang);
  const all = symbolsForMarket(market);
  const available = all.filter((d) => !watch.includes(d.symbol));

  return (
    <aside className="panel watchlist">
      <div className="panel-title">
        <span>⭐ {s.ui.watchlist}</span>
        <select
          className="add-select"
          value=""
          onChange={(e) => {
            if (e.target.value) onAdd(e.target.value);
          }}
        >
          <option value="">＋ {s.ui.addSymbol}</option>
          {available.map((d) => (
            <option key={d.symbol} value={d.symbol}>
              {d.symbol} — {d.name}
            </option>
          ))}
        </select>
      </div>

      <ul className="watch-rows">
        {watch.map((sym) => {
          const def = all.find((d) => d.symbol === sym);
          const q = engine.getQuote(sym);
          if (!def || !q) return null;
          const up = q.changePct >= 0;
          return (
            <li
              key={sym}
              className={`watch-row ${selected === sym ? 'selected' : ''}`}
              onClick={() => onSelect(sym)}
            >
              <div className="watch-left">
                <b>{def.symbol}</b>
                <small>{def.name}</small>
              </div>
              <div className="watch-right">
                <span className="watch-price">{formatPrice(q.price, def.market)}</span>
                <span className={`chip ${up ? 'up' : 'down'}`}>{formatPct(q.changePct)}</span>
              </div>
              <button
                className="watch-remove"
                title="Remove"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(sym);
                }}
              >
                ×
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
