import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Header from './components/Header';
import TickerTape from './components/TickerTape';
import Watchlist from './components/Watchlist';
import StockChart from './components/StockChart';
import SignalBar from './components/SignalBar';
import Assistant from './components/Assistant';
import AIPicks from './components/AIPicks';
import { makeMessage, respond, welcomeLine, type ChatMessage } from './ai/assistant';
import { t, type LangCode } from './ai/i18n';
import { speak } from './ai/speech';
import type { Market } from './data/universe';
import type { Timeframe } from './data/engine';
import { useLocalStorage } from './hooks';

const DEFAULT_WATCH: Record<Market, string[]> = {
  IN: ['RELIANCE', 'TCS', 'INFY', 'HDFCBANK', 'TATAMOTORS', 'SBIN', 'ITC'],
  US: ['AAPL', 'MSFT', 'NVDA', 'TSLA', 'AMZN', 'GOOGL', 'META'],
};

const DEFAULT_SEL: Record<Market, string> = { IN: 'RELIANCE', US: 'AAPL' };

export default function App() {
  const [lang, setLang] = useLocalStorage<LangCode>('nivesh.lang', 'en');
  const [market, setMarket] = useLocalStorage<Market>('nivesh.market', 'IN');
  const [watch, setWatch] = useLocalStorage<Record<Market, string[]>>('nivesh.watch', DEFAULT_WATCH);
  const [selected, setSelected] = useLocalStorage<Record<Market, string>>('nivesh.sel', DEFAULT_SEL);
  const [autoSpeak, setAutoSpeak] = useLocalStorage<boolean>('nivesh.autoSpeak', true);
  const [timeframe, setTimeframe] = useState<Timeframe>('5m');
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const langRef = useRef(lang);
  const marketRef = useRef(market);
  const autoSpeakRef = useRef(autoSpeak);
  langRef.current = lang;
  marketRef.current = market;
  autoSpeakRef.current = autoSpeak;

  const s = t(lang);
  const currentSel = selected[market];

  // welcome message once
  useEffect(() => {
    setMessages([makeMessage('ai', welcomeLine(langRef.current))]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSend = useCallback((text: string) => {
    const l = langRef.current;
    const m = marketRef.current;
    const reply = respond(text, l, m);
    setMessages((prev) => [...prev, makeMessage('user', text), makeMessage('ai', reply)]);
    if (autoSpeakRef.current) {
      void speak(reply.replace(/[•·]/g, ''), l);
    }
  }, []);

  const selectSymbol = useCallback(
    (sym: string) => {
      setSelected({ ...selected, [marketRef.current]: sym });
    },
    [selected, setSelected],
  );

  const addSymbol = useCallback(
    (sym: string) => {
      const m = marketRef.current;
      const list = watch[m] ?? [];
      if (!list.includes(sym)) setWatch({ ...watch, [m]: [...list, sym] });
      selectSymbol(sym);
    },
    [watch, setWatch, selectSymbol],
  );

  const removeSymbol = useCallback(
    (sym: string) => {
      const m = marketRef.current;
      const cur = watch[m] ?? [];
      const filtered = cur.filter((x) => x !== sym);
      const finalList = filtered.length ? filtered : cur; // keep at least one
      setWatch({ ...watch, [m]: finalList });
      if (currentSel === sym) {
        setSelected({ ...selected, [m]: finalList[0] });
      }
    },
    [watch, setWatch, selected, setSelected, currentSel],
  );

  const s2 = useMemo(() => t(lang), [lang]);

  return (
    <div className="app">
      <Header market={market} setMarket={setMarket} lang={lang} setLang={setLang} />
      <TickerTape />

      <main className="layout">
        <Watchlist
          market={market}
          lang={lang}
          watch={watch[market] ?? []}
          selected={currentSel}
          onSelect={selectSymbol}
          onAdd={addSymbol}
          onRemove={removeSymbol}
        />

        <div className="center-col">
          <StockChart symbol={currentSel} timeframe={timeframe} setTimeframe={setTimeframe} lang={lang} />
          <SignalBar symbol={currentSel} timeframe={timeframe} lang={lang} onAsk={handleSend} />
          <section className="panel explainer">
            <h3>💡 {s2.ui.disclaimer}</h3>
            <p>{s2.disclaimerLong}</p>
          </section>
        </div>

        <div className="right-col">
          <Assistant
            lang={lang}
            messages={messages}
            autoSpeak={autoSpeak}
            setAutoSpeak={setAutoSpeak}
            onSend={handleSend}
          />
          <AIPicks market={market} lang={lang} onSelect={selectSymbol} />
        </div>
      </main>

      <footer className="footer">
        <span>
          NiveshMitra AI · {s.ui.disclaimer}
        </span>
        <span className="muted">⚡ {s.ui.live} · {s.ui.simulated}</span>
      </footer>
    </div>
  );
}
