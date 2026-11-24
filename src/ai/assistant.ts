// Rule-based conversational AI for the investing assistant.
// Detects intent (greeting, price query, picks, trend, about, help…),
// runs technical analysis, and answers in the selected language.

import { engine, type Candle } from '../data/engine';
import { resolveSymbol, tradableForMarket, type Market, type SymbolDef } from '../data/universe';
import { analyze, type Analysis } from './indicators';
import { fmt, formatPct, formatPrice, marketLabel, t, type LangCode } from './i18n';

export interface ChatMessage {
  id: number;
  role: 'user' | 'ai';
  text: string;
  ts: number;
}

let msgId = 0;
export function makeMessage(role: ChatMessage['role'], text: string): ChatMessage {
  return { id: ++msgId, role, text, ts: Date.now() };
}

function getAnalysis(def: SymbolDef, tf: '1m' | '5m' = '5m'): { candles: Candle[]; analysis: Analysis } {
  const candles = engine.getCandles(def.symbol, tf);
  return { candles, analysis: analyze(candles) };
}

// ---------- intent detection ----------

type Intent = 'greeting' | 'price' | 'best' | 'trend' | 'about' | 'help' | 'thanks' | 'fallback';

const INTENT_PATTERNS: Record<Exclude<Intent, 'price' | 'fallback'>, string[]> = {
  greeting: [
    'hello', 'hi ', 'hey', 'good morning', 'good evening', 'namaste', 'vanakkam',
    'नमस्ते', 'नमस्कार', 'हैलो', 'कैसे हो',
    'ನಮಸ್ಕಾರ', 'ಹಾಯ್', 'ಹಲೋ',
    'வணக்கம்', 'ஹலோ',
    'నమస్కారం', 'హాయ్', 'హలో',
    'नमस्कार', 'हाय',
  ],
  best: [
    'best stock', 'top stock', 'best share', 'top share', 'what to buy', 'which stock',
    'which share', 'recommend', 'suggestion', 'suggest me', 'buy today', 'good stock',
    'should i invest', 'where to invest', 'top pick', 'best pick', 'which one to buy',
    'सबसे अच्छा', 'कौन सा शेयर', 'क्या खरीदू', 'बेस्ट शेयर', 'कहां निवेश',
    'ಉತ್ತಮ ಷೇರು', 'ಯಾವ ಷೇರು', 'ಏನು ಖರೀದಿ', 'ಬೆಸ್ಟ್',
    'சிறந்த பங்கு', 'எந்த பங்கு', 'எதை வாங்க',
    'ఉత్తమ షేరు', 'ఏ షేరు', 'ఏమి కొనాలి',
    'सर्वोत्तम शेयर', 'कोणता शेयर', 'काय खरेदी',
  ],
  trend: [
    'market going', 'market up', 'market down', 'market today', 'how is market',
    'market trend', 'nifty', 'sensex', 'nasdaq', 's&p', 'dow jones', 'index',
    'economy', 'bull market', 'bear market',
    'बाजार', 'मार्केट कैसा', 'निफ्टी', 'सेंसेक्स',
    'ಮಾರುಕಟ್ಟೆ', 'ಸೆನ್ಸೆಕ್ಸ್', 'ನಿಫ್ಟಿ',
    'சந்தை', 'நிஃப்டி', 'சென்செக்ஸ்',
    'మార్కెట్', 'సెన్సెక్స్', 'నిఫ్టీ',
    'बाजार', 'सेंसेक्स', 'निफ्टी',
  ],
  about: [
    'who are you', 'about you', 'what can you do', 'your name', 'tell about yourself',
    'what do you do', 'about this app', 'what is this',
    'तुम कौन', 'आप कौन', 'तुम्हारा नाम', 'क्या कर सकती',
    'ನೀವು ಯಾರು', 'ನಿಮ್ಮ ಹೆಸರು', 'ನೀನು ಏನು',
    'நீங்கள் யார்', 'உங்கள் பெயர்',
    'మీరు ఎవరు', 'మీ పేరు',
    'तुम्ही कोण', 'तुमचे नाव',
  ],
  help: ['help', 'how to use', 'guide', 'instructions', 'मदद', 'सहायता', 'ಸಹಾಯ', 'உதவி', 'సహాయం', 'मदत'],
  thanks: [
    'thanks', 'thank you', 'thx', 'appreciate', 'धन्यवाद', 'शुक्रिया',
    'ಧನ್ಯವಾದ', 'ನನ್ನಿಂದ',
    'நன்றி',
    'ధన్యవాదాలు', 'కృతజ్ఞతలు',
    'धन्यवाद', 'आभार',
  ],
};

// ---------- response builders ----------

function signalPhrase(analysis: Analysis, lang: LangCode): string {
  const s = t(lang);
  return s.signals[analysis.label];
}

function reasonList(analysis: Analysis, lang: LangCode): string {
  const s = t(lang);
  return analysis.reasons.map((r) => `• ${s.reasons[r]}`).join('\n');
}

export function analysisSummary(def: SymbolDef, lang: LangCode): string {
  const s = t(lang);
  const quote = engine.getQuote(def.symbol);
  const { analysis } = getAnalysis(def);
  if (!quote) return '';
  const parts: string[] = [
    fmt(s.intents.price, {
      name: def.name,
      sym: def.symbol,
      price: formatPrice(quote.price, def.market),
      chg: formatPct(quote.changePct),
      signal: signalPhrase(analysis, lang),
      conf: analysis.confidence,
    }),
    reasonList(analysis, lang),
  ];
  return parts.join('\n');
}

export function topPicks(market: Market, lang: LangCode, count = 3): string {
  const s = t(lang);
  const ranked = tradableForMarket(market)
    .map((def) => ({ def, analysis: getAnalysis(def).analysis }))
    .sort((a, b) => b.analysis.score - a.analysis.score)
    .slice(0, count);

  const lines = ranked.map(
    (r, i) =>
      fmt(s.intents.pickLine, {
        i: i + 1,
        sym: `${r.def.symbol} (${r.def.name})`,
        signal: signalPhrase(r.analysis, lang),
        conf: r.analysis.confidence,
      }),
  );
  return [
    fmt(s.intents.best, { count, market: marketLabel(market, lang) }),
    ...lines,
    s.intents.afterPicks,
  ].join('\n');
}

function marketOverview(market: Market, lang: LangCode): string {
  const s = t(lang);
  const quotes = engine.marketQuotes(market).filter((q) => q.def.isIndex);
  const lines = quotes.map((q) =>
    fmt(s.intents.indexNote, {
      sym: q.def.name,
      price: formatPrice(q.price, q.def.market),
      chg: formatPct(q.changePct),
    }),
  );
  const status = marketOpenNow(market) ? openWord(lang) : closedWord(lang);
  return [
    fmt(s.intents.marketNote, { market: marketLabel(market, lang), status }),
    ...lines,
    topPicks(market, lang, 3),
  ].join('\n\n');
}

function openWord(lang: LangCode): string {
  return t(lang).ui.statusOpen;
}
function closedWord(lang: LangCode): string {
  return t(lang).ui.statusClosed;
}

/** Market-hours check (IST for NSE, ET for US exchanges) using Intl. */
export function marketOpenNow(market: Market): boolean {
  const now = new Date();
  const day = (d: Date, tz: string) => {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      weekday: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).formatToParts(d);
    const get = (t2: string) => parts.find((p) => p.type === t2)?.value ?? '';
    return { wd: get('weekday'), h: parseInt(get('hour'), 10), m: parseInt(get('minute'), 10) };
  };
  const weekend = (wd: string) => wd === 'Sat' || wd === 'Sun';

  if (market === 'IN') {
    const p = day(now, 'Asia/Kolkata');
    if (weekend(p.wd)) return false;
    const mins = p.h * 60 + p.m;
    return mins >= 9 * 60 + 15 && mins <= 15 * 60 + 30;
  }
  const p = day(now, 'America/New_York');
  if (weekend(p.wd)) return false;
  const mins = p.h * 60 + p.m;
  return mins >= 9 * 60 + 30 && mins <= 16 * 60;
}

// ---------- main entry ----------

export function respond(input: string, lang: LangCode, market: Market): string {
  const s = t(lang);
  const text = input.trim();
  if (!text) return s.intents.fallback;

  // 1) symbol lookup wins
  const def = resolveSymbol(text);
  const quote = def ? engine.getQuote(def.symbol) : undefined;
  if (def && quote && !def.isIndex) {
    const { analysis } = getAnalysis(def);
    const trendWord =
      analysis.momentum > 1 ? s.trendWords.up : analysis.momentum < -1 ? s.trendWords.down : s.trendWords.flat;
    const relFast = def && analysis.smaFast ? (quote.price >= analysis.smaFast ? s.relFast.above : s.relFast.below) : s.relFast.above;
    const priceLine = fmt(s.intents.price, {
      name: def.name,
      sym: def.symbol,
      price: formatPrice(quote.price, def.market),
      chg: formatPct(quote.changePct),
      signal: signalPhrase(analysis, lang),
      conf: analysis.confidence,
    });
    const trendLine = fmt(s.intents.trend, {
      name: def.name,
      trendWord,
      relFast,
      rsi: analysis.rsi.toFixed(0),
      mom: analysis.momentum.toFixed(2),
    });
    return [priceLine, trendLine, reasonList(analysis, lang)].join('\n');
  }

  // 2) index query
  if (def && def.isIndex) {
    const quote = engine.getQuote(def.symbol)!;
    const sLine = fmt(s.intents.indexNote, {
      sym: def.name,
      price: formatPrice(quote.price, def.market),
      chg: formatPct(quote.changePct),
    });
    return [sLine, topPicks(def.market, lang, 3)].join('\n\n');
  }

  const lower = text.toLowerCase();

  // 3) intent keywords (order matters: specific → generic)
  const has = (intent: Exclude<Intent, 'price' | 'fallback'>) =>
    INTENT_PATTERNS[intent].some((k) => lower.includes(k));

  if (has('thanks')) return s.intents.thanks;
  if (has('about')) return s.intents.about;
  if (has('help')) return s.intents.help;
  if (has('best')) return topPicks(market, lang, 3);
  if (has('trend')) return marketOverview(market, lang);
  const bare = lower.replace(/[!?.।,]/g, '').trim();
  const quickHello = ['hi', 'hello', 'hey', 'namaste', 'vanakkam', 'नमस्ते', 'नमस्कार', 'ನಮಸ್ಕಾರ', 'வணக்கம்', 'నమస్కారం', 'नमस्कार'].includes(bare);
  if (quickHello || (has('greeting') && text.length < 60)) return s.intents.greeting;

  // 4) fallback
  return s.intents.fallback;
}

/** Quick headline for the assistant welcome / status chips. */
export function welcomeLine(lang: LangCode): string {
  return t(lang).greeting;
}
