# NiveshMitra AI 📈

**Your AI guide to smarter investing** — a modern web app that helps investors
explore the stock market with **live charts**, an **AI signal engine**, and a
**voice assistant** that explains everything out loud.

> Built on the Krishimitra-AI repository, reimagined for stock-market investors.

## ✨ Features

| Feature | Description |
| --- | --- |
| 📊 **Live charts** | Real-time candlestick charts (TradingView's lightweight-charts) with volume, timeframes `1m · 5m · 15m · 1H · 1D`, and prices that tick every second |
| 🌏 **Two markets** | Indian market (NSE/BSE, ₹) and US market (NYSE/NASDAQ, $) — switch with one tap |
| 🤖 **AI signal engine** | Computes SMA (20/50), RSI(14), momentum, volatility & support/resistance → a **Buy / Sell / Hold** signal with confidence % and plain-language reasons |
| 🗣️ **AI voice assistant "Meera"** | Ask anything by text or **mic** — she analyses the live chart and **speaks the answer aloud** |
| 🌐 **6 languages** | English · हिन्दी · ಕನ್ನಡ · தமிழ் · తెలుగు · मराठी — UI, replies *and* voice follow your choice |
| ⭐ **Watchlist** | Build your own list, click any row to load its chart (saved in your browser) |
| 🤖 **Top AI Picks** | Auto-refreshed ranking of the best-scoring stocks in the selected market |
| 📜 **Market status** | Live open/closed badge for NSE (IST) and US exchanges (ET) |

## 🚀 Quick start

```bash
npm install
npm run dev      # → http://localhost:5173
```

Production build & tests:

```bash
npm run build    # type-check + bundle to dist/
npm test         # engine / signals / assistant smoke tests (Node, no browser)
```

## 🧠 How it works

```
src/
├── data/
│   ├── universe.ts     # 40+ symbols: NSE + NASDAQ stocks & indices
│   └── engine.ts       # live simulation engine (correlated GBM ticks → OHLC candles)
├── ai/
│   ├── indicators.ts   # SMA, RSI, momentum, volatility → composite signal
│   ├── assistant.ts    # intent detection + language-aware answer builder
│   ├── i18n.ts         # 6-language UI/reply strings + ₹/$ formatting
│   └── speech.ts       # Web Speech API: text-to-speech + mic dictation
├── components/         # Header, TickerTape, Watchlist, StockChart,
│                       # SignalBar, Assistant, AIPicks
└── App.tsx             # state: market · language · watchlist · chat
```

- **Data feed** — the app ships with a realistic *simulated* feed (shared market
  factor + per-stock noise, demo-amplified volatility, news pulses). The engine
  exposes a tiny interface (`getQuote`, `getCandles`, `subscribe`), so a real
  market-data API can replace it later without touching the UI.
- **Voice** — uses the browser's built-in Web Speech API (Chrome/Edge best).
  No API keys, no server round-trips: replies are synthesised locally by the OS.
- **AI** — a transparent rules engine: every signal lists the exact reasons
  behind it (e.g. "fast average above slow average — bullish structure"), so
  investors learn *why*, not just *what*.

## ⚠️ Disclaimer

NiveshMitra AI is an **educational demo**. All prices are **simulated** and do
not represent real market data. Nothing here is investment advice — please do
your own research or consult a SEBI-registered advisor before investing.
