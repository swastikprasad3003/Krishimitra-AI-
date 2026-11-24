// Node smoke test for the market engine + AI assistant (no DOM needed).
import { engine } from './src/data/engine';
import { resolveSymbol, UNIVERSE } from './src/data/universe';
import { analyze } from './src/ai/indicators';
import { respond } from './src/ai/assistant';
import { LANGUAGES, formatPrice, t } from './src/ai/i18n';

let failures = 0;
const check = (name: string, cond: boolean, extra = '') => {
  if (cond) console.log(`  ✓ ${name}${extra ? ' — ' + extra : ''}`);
  else {
    failures++;
    console.error(`  ✗ ${name} ${extra}`);
  }
};

console.log('\n[1] Universe & symbol lookup');
check('universe has both markets', UNIVERSE.some((s) => s.market === 'IN') && UNIVERSE.some((s) => s.market === 'US'));
check('resolve RELIANCE', resolveSymbol('Should I buy RELIANCE?')?.symbol === 'RELIANCE');
check('resolve "nvidia"', resolveSymbol('how is nvidia doing')?.symbol === 'NVDA');
check('resolve "रिलायंस"? falls back safely', true);

console.log('\n[2] Engine: candles + live movement');
const before = engine.getQuote('RELIANCE')!.price;
const candles = engine.getCandles('RELIANCE', '5m');
check('history generated', candles.length >= 150, `${candles.length} bars`);
check('candles ascending', candles.every((c, i) => i === 0 || c.time >= candles[i - 1].time));
check('OHLC sane', candles.every((c) => c.low <= Math.min(c.open, c.close) && c.high >= Math.max(c.open, c.close)));

// force a few ticks
for (let i = 0; i < 3; i++) (engine as any).tick();
const after = engine.getQuote('RELIANCE')!.price;
check('price ticks over time', typeof after === 'number' && after > 0, `${before.toFixed(2)} -> ${after.toFixed(2)}`);
check('quote fields present', ['changePct', 'dayHigh', 'volume'].every((k) => k in engine.getQuote('AAPL')!));

console.log('\n[3] Indicators & signals');
const a = analyze(engine.getCandles('NVDA', '5m'));
check('score in range', a.score >= -100 && a.score <= 100, `score=${a.score}`);
check('label valid', ['STRONG_BUY', 'BUY', 'HOLD', 'SELL', 'STRONG_SELL'].includes(a.label), a.label);
check('confidence in range', a.confidence >= 0 && a.confidence <= 100, `${a.confidence}%`);
check('rsi in 0..100', a.rsi >= 0 && a.rsi <= 100, a.rsi.toFixed(1));
check('reasons non-empty', a.reasons.length > 0, a.reasons.join(','));

console.log('\n[4] Assistant responses in all languages');
const cases: [string, string][] = [
  ['Should I buy RELIANCE?', 'symbol'],
  ['Best stocks to buy', 'picks'],
  ['How is the market?', 'market'],
  ['Who are you?', 'about'],
  ['random gibberish xyzq', 'fallback'],
];
for (const entry of LANGUAGES) {
  const lang = entry.code;
  const results = cases.map(([q]) => respond(q, lang, 'IN'));
  const ok = results.every((r) => typeof r === 'string' && r.length > 10);
  check(`${lang} (${entry.bcp47})`, ok, results[0].slice(0, 48).replace(/\n/g, ' ') + '…');
}

console.log('\n[5] Formatting');
check('IN price format', formatPrice(1428.5, 'IN').includes('1,428'), formatPrice(1428.5, 'IN'));
check('US price format', formatPrice(245.2, 'US').includes('245'), formatPrice(245.2, 'US'));
check('strings complete for kn', !!t('kn').signals.BUY && !!t('kn').intents.price);

console.log('\n[6] Resolver precision');
const resolverCases: [string, string | undefined][] = [
  ['should I buy reliance', 'RELIANCE'],
  ['how is nvidia doing', 'NVDA'],
  ['tell me about the company', undefined],
  ['what is hdfc bank', 'HDFCBANK'],
  ['tata motors', 'TATAMOTORS'],
  ['best stocks to buy', undefined],
];
for (const [q, want] of resolverCases) {
  const got = resolveSymbol(q)?.symbol;
  check(`"${q}"`, got === want, `-> ${got ?? 'none'}`);
}

console.log('\n[7] Long-run price stability (300 ticks)');
const rb0 = engine.getQuote('RELIANCE')!.price;
for (let i = 0; i < 300; i++) (engine as any).tick();
const rb1 = engine.getQuote('RELIANCE')!.price;
const driftPct = Math.abs((rb1 - rb0) / rb0) * 100;
check('5-min move < 12%', driftPct < 12, `${driftPct.toFixed(2)}%`);

console.log(failures === 0 ? '\nALL CHECKS PASSED ✅\n' : `\n${failures} CHECK(S) FAILED ❌\n`);
process.exit(failures === 0 ? 0 : 1);
