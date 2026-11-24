import { LANGUAGES, t, type LangCode } from '../ai/i18n';
import { marketOpenNow } from '../ai/assistant';
import type { Market } from '../data/universe';

interface Props {
  market: Market;
  setMarket: (m: Market) => void;
  lang: LangCode;
  setLang: (l: LangCode) => void;
}

export default function Header({ market, setMarket, lang, setLang }: Props) {
  const s = t(lang);
  const open = marketOpenNow(market);

  return (
    <header className="header">
      <div className="brand">
        <div className="brand-logo">📈</div>
        <div>
          <h1 className="brand-name">
            NiveshMitra <span className="brand-ai">AI</span>
          </h1>
          <p className="brand-tag">{s.tagline}</p>
        </div>
      </div>

      <div className="market-toggle" role="tablist" aria-label="Market">
        <button
          role="tab"
          aria-selected={market === 'IN'}
          className={market === 'IN' ? 'active' : ''}
          onClick={() => setMarket('IN')}
        >
          🇮🇳 {s.ui.india}
        </button>
        <button
          role="tab"
          aria-selected={market === 'US'}
          className={market === 'US' ? 'active' : ''}
          onClick={() => setMarket('US')}
        >
          🇺🇸 {s.ui.usa}
        </button>
      </div>

      <div className="header-right">
        <span className={`status-pill ${open ? 'open' : 'closed'}`} title={open ? s.ui.marketOpen : s.ui.marketClosed}>
          <span className="dot" />
          {open ? s.ui.marketOpen : s.ui.marketClosed}
        </span>
        <label className="lang-select" title="Assistant language">
          🌐
          <select value={lang} onChange={(e) => setLang(e.target.value as LangCode)}>
            {LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>
                {l.native}
              </option>
            ))}
          </select>
        </label>
      </div>
    </header>
  );
}
