// Multi-language support for UI, AI replies and voice (TTS/STT).
// Languages: English, हिंदी, ಕನ್ನಡ, தமிழ், తెలుగు, मराठी

import type { SignalLabel, ReasonCode } from './indicators';
import type { Market } from '../data/universe';

export type LangCode = 'en' | 'hi' | 'kn' | 'ta' | 'te' | 'mr';

export interface LangOption {
  code: LangCode;
  label: string;
  bcp47: string; // for speech synthesis / recognition
  native: string;
}

export const LANGUAGES: LangOption[] = [
  { code: 'en', label: 'English', bcp47: 'en-IN', native: 'English' },
  { code: 'hi', label: 'Hindi', bcp47: 'hi-IN', native: 'हिन्दी' },
  { code: 'kn', label: 'Kannada', bcp47: 'kn-IN', native: 'ಕನ್ನಡ' },
  { code: 'ta', label: 'Tamil', bcp47: 'ta-IN', native: 'தமிழ்' },
  { code: 'te', label: 'Telugu', bcp47: 'te-IN', native: 'తెలుగు' },
  { code: 'mr', label: 'Marathi', bcp47: 'mr-IN', native: 'मराठी' },
];

type ReasonMap = Record<ReasonCode, string>;
type SignalMap = Record<SignalLabel, string>;

interface Strings {
  tagline: string;
  assistantName: string;
  greeting: string;
  askPlaceholder: string;
  listenHint: string;
  disclaimerShort: string;
  disclaimerLong: string;
  signals: SignalMap;
  reasons: ReasonMap;
  intents: {
    greeting: string;
    about: string;
    help: string;
    thanks: string;
    fallback: string;
    price: string; // {name} {sym} {price} {chg} {signal} {conf}
    trend: string; // {name} {trendWord} {relFast} {rsi} {mom}
    best: string; // {count} {market}
    pickLine: string; // {i} {sym} {signal} {conf}
    afterPicks: string;
    marketNote: string; // {market} {status}
    indexNote: string; // {sym} {price} {chg}
  };
  trendWords: { up: string; down: string; flat: string };
  relFast: { above: string; below: string };
  ui: {
    watchlist: string;
    aiPicks: string;
    assistant: string;
    marketOpen: string;
    marketClosed: string;
    statusOpen: string;
    statusClosed: string;
    autoSpeak: string;
    confidence: string;
    askAi: string;
    india: string;
    usa: string;
    live: string;
    simulated: string;
    addSymbol: string;
    send: string;
    micUnsupported: string;
    voiceLoading: string;
    chart: string;
    volume: string;
    high: string;
    low: string;
    open: string;
    rsi: string;
    signal: string;
    topPicks: string;
    refreshed: string;
    disclaimer: string;
  };
}

const en: Strings = {
  tagline: 'Your AI guide to smarter investing',
  assistantName: 'Meera',
  greeting:
    "Namaste! I'm Meera, your AI investment guide. Ask me about any stock and I'll explain it using the live chart — and speak the answer aloud. I share analysis for learning, not financial advice.",
  askPlaceholder: 'Ask about a stock… e.g. Should I buy Reliance?',
  listenHint: 'Tap the mic and speak',
  disclaimerShort: 'Educational demo with simulated data — not investment advice.',
  disclaimerLong:
    'NiveshMitra AI is an educational demo. All prices are simulated for demonstration and do not represent real market data. Nothing here is investment advice — please do your own research or consult a SEBI-registered advisor before investing.',
  signals: {
    STRONG_BUY: 'Strong Buy',
    BUY: 'Buy',
    HOLD: 'Hold',
    SELL: 'Sell',
    STRONG_SELL: 'Strong Sell',
  },
  reasons: {
    above_fast_ma: 'Price above 20-period average — short-term uptrend',
    below_fast_ma: 'Price below 20-period average — short-term downtrend',
    golden_cross: 'Fast average above slow average — bullish structure',
    death_cross: 'Fast average below slow average — bearish structure',
    rsi_oversold: 'RSI oversold — bounce possible',
    rsi_overbought: 'RSI overbought — pullback risk',
    rsi_neutral: 'RSI in neutral zone',
    momentum_up: 'Positive momentum over last 20 bars',
    momentum_down: 'Negative momentum over last 20 bars',
    high_volatility: 'High volatility — size positions carefully',
    near_support: 'Near support zone',
    near_resistance: 'Near resistance zone',
  },
  intents: {
    greeting: "Hello! Ask me about any stock — for example 'How is NVDA doing?' or 'Best stocks to buy today'.",
    about:
      "I'm Meera, the AI assistant inside NiveshMitra. I read the live charts, compute indicators like RSI and moving averages, and explain them in simple words — in your language. I analyse simulated demo data for education, so please don't treat me as a SEBI-registered advisor.",
    help: "You can ask: 1) About any stock — 'Tell me about TCS'. 2) For picks — 'Best stocks to buy'. 3) About the market — 'Is the market going up?'. Tap the mic to speak instead of typing.",
    thanks: 'Happy to help! Investing rewards patience and research — please do your own due diligence too.',
    fallback:
      "I didn't catch that. Try naming a stock (like 'RELIANCE' or 'Apple'), or ask 'Best stocks to buy today'.",
    price:
      '{name} ({sym}) is trading at {price}, {chg} today. My signal: {signal} with {conf}% confidence.',
    trend:
      "{name} looks {trendWord} on the chart — price is {relFast} the 20-period average, RSI at {rsi}. Over the last 20 bars it moved {mom}%.",
    best: 'Here are my top {count} picks for the {market} market right now, ranked by trend, momentum and RSI:',
    pickLine: '{i}. {sym} — {signal} ({conf}% confidence)',
    afterPicks: 'These are model outputs on simulated data for learning — please research before investing.',
    marketNote: 'The {market} market is {status} right now.',
    indexNote: '{sym} is at {price} ({chg} today).',
  },
  trendWords: { up: 'uptrending', down: 'downtrending', flat: 'moving sideways' },
  relFast: { above: 'above', below: 'below' },
  ui: {
    watchlist: 'Watchlist',
    aiPicks: 'AI Picks',
    assistant: 'AI Assistant',
    marketOpen: 'Market open',
    marketClosed: 'Market closed',
    statusOpen: 'open',
    statusClosed: 'closed',
    autoSpeak: 'Speak replies',
    confidence: 'Confidence',
    askAi: 'Ask AI',
    india: 'India',
    usa: 'USA',
    live: 'LIVE',
    simulated: 'Simulated feed',
    addSymbol: 'Add symbol…',
    send: 'Send',
    micUnsupported: "Voice input isn't supported in this browser — try Chrome.",
    voiceLoading: 'Listening…',
    chart: 'Chart',
    volume: 'Volume',
    high: 'High',
    low: 'Low',
    open: 'Open',
    rsi: 'RSI',
    signal: 'AI Signal',
    topPicks: 'Top AI Picks',
    refreshed: 'Auto-refreshed',
    disclaimer: 'Simulated data · For education only · Not investment advice',
  },
};

const hi: Strings = {
  tagline: 'स्मार्ट निवेश का आपका AI गाइड',
  assistantName: 'मीरा',
  greeting:
    'नमस्ते! मैं मीरा हूँ, आपकी AI निवेश साथी। किसी भी शेयर के बारे में पूछिए — मैं लाइव चार्ट के आधार पर समझाऊँगी और जवाब बोलकर भी सुनाऊँगी। यह सीखने के लिए विश्लेषण है, निवेश सलाह नहीं।',
  askPlaceholder: 'किसी शेयर के बारे में पूछें… जैसे क्या मैं रिलायंस ख़रीदूँ?',
  listenHint: 'माइक दबाकर बोलें',
  disclaimerShort: 'सिम्युलेटेड डेटा के साथ शैक्षिक डेमो — निवेश सलाह नहीं।',
  disclaimerLong:
    'निवेशमित्र AI एक शैक्षिक डेमो है। सभी कीमतें प्रदर्शन के लिए सिम्युलेटेड हैं और वास्तविक बाज़ार डेटा का प्रतिनिधित्व नहीं करतीं। यहाँ कुछ भी निवेश सलाह नहीं है — निवेश से पहले अपना शोध करें या SEBI-पंजीकृत सलाहकार से परामर्श लें।',
  signals: {
    STRONG_BUY: 'मज़बूत ख़रीदारी',
    BUY: 'ख़रीदें',
    HOLD: 'होल्ड करें',
    SELL: 'बेचें',
    STRONG_SELL: 'मज़बूत बिकवाली',
  },
  reasons: {
    above_fast_ma: 'कीमत 20-अवधि के औसत से ऊपर — अल्पकालिक तेज़ी',
    below_fast_ma: 'कीमत 20-अवधि के औसत से नीचे — अल्पकालिक मंदी',
    golden_cross: 'तेज़ औसत धीमे औसत से ऊपर — तेज़ी की संरचना',
    death_cross: 'तेज़ औसत धीमे औसत से नीचे — मंदी की संरचना',
    rsi_oversold: 'RSI ओवरसोल्ड — तेज़ी की संभावना',
    rsi_overbought: 'RSI ओवरबॉट — गिरावट का जोखिम',
    rsi_neutral: 'RSI संतुलित क्षेत्र में',
    momentum_up: 'पिछले 20 बार में सकारात्मक गति',
    momentum_down: 'पिछले 20 बार में नकारात्मक गति',
    high_volatility: 'उच्च उतार-चढ़ाव — पोज़िशन सावधानी से लें',
    near_support: 'सपोर्ट ज़ोन के पास',
    near_resistance: 'रेज़िस्टेंस ज़ोन के पास',
  },
  intents: {
    greeting: 'नमस्ते! किसी भी शेयर के बारे में पूछिए — जैसे "NVDA कैसा चल रहा है?" या "आज कौन-सा शेयर ख़रीदें?"',
    about:
      'मैं मीरा हूँ, निवेशमित्र की AI सहायक। मैं लाइव चार्ट पढ़ती हूँ, RSI और मूविंग एवरेज जैसे संकेतक निकालती हूँ और सरल शब्दों में — आपकी भाषा में — समझाती हूँ। यह शिक्षा के लिए सिम्युलेटेड डेटा पर विश्लेषण है, इसलिए मुझे SEBI-पंजीकृत सलाहकार न मानें।',
    help: 'आप ऐसे पूछ सकते हैं: 1) किसी शेयर के बारे में — "TCS के बारे में बताओ"। 2) पिक्स के लिए — "सबसे अच्छे शेयर"। 3) बाज़ार के लिए — "क्या बाज़ार ऊपर जा रहा है?"। टाइप करने के बजाय माइक दबाकर बोलें।',
    thanks: 'ख़ुशी हुई! निवेश में धैर्य और शोध का फ़ायदा मिलता है — कृपया अपना शोध भी ज़रूर करें।',
    fallback: 'समझ नहीं आया। कोई शेयर नाम लिखें (जैसे "RELIANCE" या "Apple"), या पूछें "आज कौन-सा शेयर ख़रीदें"।',
    price: '{name} ({sym}) अभी {price} पर कारोबार कर रहा है, आज {chg}। मेरा संकेत: {signal}, {conf}% विश्वास के साथ।',
    trend:
      '{name} चार्ट पर {trendWord} दिख रहा है — कीमत 20-अवधि के औसत से {relFast} है, RSI {rsi} पर। पिछले 20 बार में {mom}% बदलाव।',
    best: 'ट्रेंड, गति और RSI के आधार पर {market} बाज़ार के मेरे टॉप {count} पिक्स यह रहे:',
    pickLine: '{i}. {sym} — {signal} ({conf}% विश्वास)',
    afterPicks: 'ये सीखने के लिए सिम्युलेटेड डेटा के मॉडल आउटपुट हैं — निवेश से पहले शोध ज़रूर करें।',
    marketNote: '{market} बाज़ार अभी {status} है।',
    indexNote: '{sym} {price} पर है (आज {chg})।',
  },
  trendWords: { up: 'तेज़ी के रुझान में', down: 'मंदी के रुझान में', flat: 'सीधी चाल' },
  relFast: { above: 'ऊपर', below: 'नीचे' },
  ui: {
    watchlist: 'वॉचलिस्ट',
    aiPicks: 'AI पिक्स',
    assistant: 'AI सहायक',
    marketOpen: 'बाज़ार खुला',
    marketClosed: 'बाज़ार बंद',
    statusOpen: 'खुला',
    statusClosed: 'बंद',
    autoSpeak: 'जवाब बोलें',
    confidence: 'विश्वास',
    askAi: 'AI से पूछें',
    india: 'भारत',
    usa: 'अमेरिका',
    live: 'लाइव',
    simulated: 'सिम्युलेटेड फ़ीड',
    addSymbol: 'सिंबल जोड़ें…',
    send: 'भेजें',
    micUnsupported: 'इस ब्राउज़र में वॉइस इनपुट उपलब्ध नहीं — Chrome आज़माएँ।',
    voiceLoading: 'सुन रही हूँ…',
    chart: 'चार्ट',
    volume: 'वॉल्यूम',
    high: 'उच्च',
    low: 'निम्न',
    open: 'ओपन',
    rsi: 'RSI',
    signal: 'AI संकेत',
    topPicks: 'टॉप AI पिक्स',
    refreshed: 'ऑटो-रिफ्रेश',
    disclaimer: 'सिम्युलेटेड डेटा · केवल शिक्षा के लिए · निवेश सलाह नहीं',
  },
};

const kn: Strings = {
  tagline: 'ಸ್ಮಾರ್ಟ್ ಹೂಡಿಕೆಗಾಗಿ ನಿಮ್ಮ AI ಮಾರ್ಗದರ್ಶಿ',
  assistantName: 'ಮೀರಾ',
  greeting:
    'ನಮಸ್ಕಾರ! ನಾನು ಮೀರಾ, ನಿಮ್ಮ AI ಹೂಡಿಕೆ ಸಹಚರ. ಯಾವುದೇ ಷೇರಿನ ಬಗ್ಗೆ ಕೇಳಿ — ಲೈವ್ ಚಾರ್ಟ್ ಆಧಾರಿಸಿ ವಿವರಿಸುತ್ತೇನೆ ಮತ್ತು ಉತ್ತರವನ್ನು ಧ್ವನಿಯಲ್ಲಿ ಹೇಳುತ್ತೇನೆ. ಇದು ಕಲಿಕೆಗಾಗಿ ವಿಶ್ಲೇಷಣೆ, ಹೂಡಿಕೆ ಸಲಹೆ ಅಲ್ಲ.',
  askPlaceholder: 'ಷೇರಿನ ಬಗ್ಗೆ ಕೇಳಿ… ಉದಾ: ರಿಲಯನ್ಸ್ ಖರೀದಿಸಲೇ?',
  listenHint: 'ಮೈಕ್ ಒತ್ತಿ ಮಾತನಾಡಿ',
  disclaimerShort: 'ಸಿಮ್ಯುಲೇಟೆಡ್ ಡೇಟಾದೊಂದಿಗೆ ಶೈಕ್ಷಣಿಕ ಡೆಮೋ — ಹೂಡಿಕೆ ಸಲಹೆ ಅಲ್ಲ.',
  disclaimerLong:
    'ನಿವೇಶಮಿತ್ರ AI ಒಂದು ಶೈಕ್ಷಣಿಕ ಡೆಮೋ. ಎಲ್ಲಾ ಬೆಲೆಗಳು ಪ್ರದರ್ಶನಕ್ಕಾಗಿ ಸಿಮ್ಯುಲೇಟೆಡ್ ಆಗಿವೆ ಮತ್ತು ನೈಜ ಮಾರುಕಟ್ಟೆ ಡೇಟಾವನ್ನು ಪ್ರತಿನಿಧಿಸುವುದಿಲ್ಲ. ಇಲ್ಲಿನ ಯಾವುದೇ ಮಾಹಿತಿ ಹೂಡಿಕೆ ಸಲಹೆಯಲ್ಲ — ಹೂಡಿಕೆಗೂ ಮೊದಲು ನಿಮ್ಮ ಸ್ವಂತ ಸಂಶೋಧನೆ ಮಾಡಿ ಅಥವಾ SEBI-ನೋಂದಾಯಿತ ಸಲಹೆಗಾರರನ್ನು ಸಂಪರ್ಕಿಸಿ.',
  signals: {
    STRONG_BUY: 'ಬಲವಾದ ಖರೀದಿ',
    BUY: 'ಖರೀದಿಸಿ',
    HOLD: 'ಹಿಡಿದಿಡಿ',
    SELL: 'ಮಾರಾಟ',
    STRONG_SELL: 'ಬಲವಾದ ಮಾರಾಟ',
  },
  reasons: {
    above_fast_ma: 'ಬೆಲೆ 20-ಅವಧಿಯ ಸರಾಸರಿಗಿಂತ ಮೇಲೆ — ಅಲ್ಪಾವಧಿ ಏರಿಕೆ',
    below_fast_ma: 'ಬೆಲೆ 20-ಅವಧಿಯ ಸರಾಸರಿಗಿಂತ ಕೆಳಗೆ — ಅಲ್ಪಾವಧಿ ಇಳಿಕೆ',
    golden_cross: 'ವೇಗದ ಸರಾಸರಿ ನಿಧಾನ ಸರಾಸರಿಗಿಂತ ಮೇಲೆ — ಏರಿಕೆ ರಚನೆ',
    death_cross: 'ವೇಗದ ಸರಾಸರಿ ನಿಧಾನ ಸರಾಸರಿಗಿಂತ ಕೆಳಗೆ — ಇಳಿಕೆ ರಚನೆ',
    rsi_oversold: 'RSI ಅತಿಮಾರಾಟ — ಏರಿಕೆಯ ಸಾಧ್ಯತೆ',
    rsi_overbought: 'RSI ಅತಿಖರೀದಿ — ಇಳಿಕೆಯ ಅಪಾಯ',
    rsi_neutral: 'RSI ತಟಸ್ಥ ವಲಯದಲ್ಲಿ',
    momentum_up: 'ಕೊನೆಯ 20 ಬಾರ್‌ಗಳಲ್ಲಿ ಧನಾತ್ಮಕ ಚಲನೆ',
    momentum_down: 'ಕೊನೆಯ 20 ಬಾರ್‌ಗಳಲ್ಲಿ ಋಣಾತ್ಮಕ ಚಲನೆ',
    high_volatility: 'ಹೆಚ್ಚಿನ ಏರಿಳಿಕೆ — ಪೋಸಿಶನ್ ಎಚ್ಚರಿಕೆಯಿಂದ ತೆಗೆದುಕೊಳ್ಳಿ',
    near_support: 'ಬೆಂಬಲ ವಲಯದ ಹತ್ತಿರ',
    near_resistance: 'ಪ್ರತಿರೋಧ ವಲಯದ ಹತ್ತಿರ',
  },
  intents: {
    greeting: 'ನಮಸ್ಕಾರ! ಯಾವುದೇ ಷೇರಿನ ಬಗ್ಗೆ ಕೇಳಿ — ಉದಾ: "NVDA ಹೇಗಿದೆ?" ಅಥವಾ "ಇಂದು ಯಾವ ಷೇರು ಖರೀದಿಸಬೇಕು?"',
    about:
      'ನಾನು ಮೀರಾ, ನಿವೇಶಮಿತ್ರದ AI ಸಹಾಯಕ. ಲೈವ್ ಚಾರ್ಟ್ ಓದಿ, RSI ಮತ್ತು ಮೂವಿಂಗ್ ಸರಾಸರಿಗಳಂತಹ ಸೂಚಕಗಳನ್ನು ಲೆಕ್ಕಹಾಕಿ, ಸರಳ ಪದಗಳಲ್ಲಿ — ನಿಮ್ಮ ಭಾಷೆಯಲ್ಲಿ — ವಿವರಿಸುತ್ತೇನೆ. ಇದು ಶಿಕ್ಷಣಕ್ಕಾಗಿ ಸಿಮ್ಯುಲೇಟೆಡ್ ಡೇಟಾದ ವಿಶ್ಲೇಷಣೆ, ಆದ್ದರಿಂದ ನನ್ನನ್ನು SEBI-ನೋಂದಾಯಿತ ಸಲಹೆಗಾರ ಎಂದು ಪರಿಗಣಿಸಬೇಡಿ.',
    help: 'ಹೀಗೆ ಕೇಳಬಹುದು: 1) ಷೇರಿನ ಬಗ್ಗೆ — "TCS ಬಗ್ಗೆ ಹೇಳಿ"। 2) ಪಿಕ್ಸ್‌ಗಾಗಿ — "ಅತ್ಯುತ್ತಮ ಷೇರುಗಳು"। 3) ಮಾರುಕಟ್ಟೆಯ ಬಗ್ಗೆ — "ಮಾರುಕಟ್ಟೆ ಮೇಲೇರುತ್ತಿದೆಯೇ?"। ಟೈಪ್ ಮಾಡುವ ಬದಲು ಮೈಕ್ ಒತ್ತಿ ಮಾತನಾಡಿ.',
    thanks: 'ಸಂತೋಷ! ಹೂಡಿಕೆಯಲ್ಲಿ ತಾಳ್ಮೆ ಮತ್ತು ಸಂಶೋಧನೆಗೆ ಫಲ — ದಯವಿಟ್ಟು ನಿಮ್ಮ ಸ್ವಂತ ಪರಿಶೀಲನೆಯೂ ಮಾಡಿ.',
    fallback: 'ಅರ್ಥವಾಗಲಿಲ್ಲ. ಷೇರಿನ ಹೆಗಲು ಬರೆಯಿರಿ (ಉದಾ: "RELIANCE" ಅಥವಾ "Apple"), ಅಥವಾ ಕೇಳಿ "ಇಂದು ಯಾವ ಷೇರು ಖರೀದಿಸಬೇಕು"।',
    price: '{name} ({sym}) ಈಗ {price} ನಲ್ಲಿ ವ್ಯಾಪಾರವಾಗುತ್ತಿದೆ, ಇಂದು {chg}। ನನ್ನ ಸಂಕೇತ: {signal}, {conf}% ವಿಶ್ವಾಸದೊಂದಿಗೆ.',
    trend:
      '{name} ಚಾರ್ಟ್‌ನಲ್ಲಿ {trendWord} ಕಾಣಿಸುತ್ತಿದೆ — ಬೆಲೆ 20-ಅವಧಿಯ ಸರಾಸರಿ {relFast} ಇದೆ, RSI {rsi} ನಲ್ಲಿ. ಕೊನೆಯ 20 ಬಾರ್‌ಗಳಲ್ಲಿ {mom}% ಬದಲಾವಣೆ.',
    best: 'ಟ್ರೆಂಡ್, ಚಲನೆ ಮತ್ತು RSI ಆಧಾರಿಸಿ {market} ಮಾರುಕಟ್ಟೆಯ ನನ್ನ ಟಾಪ್ {count} ಪಿಕ್ಸ್ ಇಲ್ಲಿವೆ:',
    pickLine: '{i}. {sym} — {signal} ({conf}% ವಿಶ್ವಾಸ)',
    afterPicks: 'ಇವು ಕಲಿಕೆಗಾಗಿ ಸಿಮ್ಯುಲೇಟೆಡ್ ಡೇಟಾದ ಮಾಡೆಲ್ ಔಟ್‌ಪುಟ್ — ಹೂಡಿಕೆಗೂ ಮೊದಲು ಸಂಶೋಧನೆ ಮಾಡಿ.',
    marketNote: '{market} ಮಾರುಕಟ್ಟೆ ಈಗ {status} ಇದೆ.',
    indexNote: '{sym} {price} ನಲ್ಲಿ ಇದೆ (ಇಂದು {chg})।',
  },
  trendWords: { up: 'ಏರಿಕೆಯ ಹಾದಿಯಲ್ಲಿ', down: 'ಇಳಿಕೆಯ ಹಾದಿಯಲ್ಲಿ', flat: 'ಸಮತಲ ಚಲನೆ' },
  relFast: { above: 'ಮೇಲೆ', below: 'ಕೆಳಗೆ' },
  ui: {
    watchlist: 'ವಾಚ್‌ಲಿಸ್ಟ್',
    aiPicks: 'AI ಪಿಕ್ಸ್',
    assistant: 'AI ಸಹಾಯಕ',
    marketOpen: 'ಮಾರುಕಟ್ಟೆ ತೆರೆದಿದೆ',
    marketClosed: 'ಮಾರುಕಟ್ಟೆ ಮುಚ್ಚಿದೆ',
    statusOpen: 'ತೆರೆದಿದೆ',
    statusClosed: 'ಮುಚ್ಚಿದೆ',
    autoSpeak: 'ಉತ್ತರ ಮಾತನಾಡಿ',
    confidence: 'ವಿಶ್ವಾಸ',
    askAi: 'AI ನಲ್ಲಿ ಕೇಳಿ',
    india: 'ಭಾರತ',
    usa: 'ಅಮೇರಿಕಾ',
    live: 'ಲೈವ್',
    simulated: 'ಸಿಮ್ಯುಲೇಟೆಡ್ ಫೀಡ್',
    addSymbol: 'ಸಿಂಬಲ್ ಸೇರಿಸಿ…',
    send: 'ಕಳುಹಿಸಿ',
    micUnsupported: 'ಈ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ವಾಯ್ಸ್ ಇನ್‌ಪುಟ್ ಲಭ್ಯವಿಲ್ಲ — Chrome ಪ್ರಯತ್ನಿಸಿ.',
    voiceLoading: 'ಕೇಳುತ್ತಿದ್ದೇನೆ…',
    chart: 'ಚಾರ್ಟ್',
    volume: 'ಪ್ರಮಾಣ',
    high: 'ಹೆಚ್ಚು',
    low: 'ಕಡಿಮೆ',
    open: 'ತೆರೆದ',
    rsi: 'RSI',
    signal: 'AI ಸಂಕೇತ',
    topPicks: 'ಟಾಪ್ AI ಪಿಕ್ಸ್',
    refreshed: 'ಆಟೋ-ರಿಫ್ರೆಶ್',
    disclaimer: 'ಸಿಮ್ಯುಲೇಟೆಡ್ ಡೇಟಾ · ಶಿಕ್ಷಣಕ್ಕೆ ಮಾತ್ರ · ಹೂಡಿಕೆ ಸಲಹೆ ಅಲ್ಲ',
  },
};

const ta: Strings = {
  tagline: 'புத்திசாலித்தனமான முதலீட்டிற்கான உங்கள் AI வழிகாட்டி',
  assistantName: 'மீரா',
  greeting:
    'வணக்கம்! நான் மீரா, உங்கள் AI முதலீட்டு துணை. எந்த பங்கு பற்றியும் கேளுங்கள் — நேரடி விளக்கப்படத்தின் அடிப்படையில் விளக்கி, பதிலை குரலிலும் சொல்கிறேன். இது கற்றலுக்கான பகுப்பாய்வு, முதலீட்டு அறிவுரை அல்ல.',
  askPlaceholder: 'ஒரு பங்கு பற்றி கேளுங்கள்… எ.கா. ரிலையன்ஸ் வாங்கலாமா?',
  listenHint: 'மைக் அழுத்தி பேசுங்கள்',
  disclaimerShort: 'உருவகப்படுத்தப்பட்ட தரவுடன் கல்விசார் டெமோ — முதலீட்டு அறிவுரை அல்ல.',
  disclaimerLong:
    'நிவேஷ்மித்ரா AI ஒரு கல்விசார் டெமோ. அனைத்து விலைகளும் காட்சிக்காக உருவகப்படுத்தப்பட்டவை, உண்மையான சந்தை தரவை குறிக்கவில்லை. இங்குள்ள எதுவும் முதலீட்டு அறிவுரை அல்ல — முதலீட்டிற்கு முன் உங்கள் சொந்த ஆய்வை மேற்கொள்ளவோ அல்லது SEBI-பதிவுபெற்ற ஆலோசகரை அணுகவோ செய்யுங்கள்.',
  signals: {
    STRONG_BUY: 'வலுவான வாங்குதல்',
    BUY: 'வாங்குங்கள்',
    HOLD: 'வைத்திருங்கள்',
    SELL: 'விற்கவும்',
    STRONG_SELL: 'வலுவான விற்பனை',
  },
  reasons: {
    above_fast_ma: 'விலை 20-கால சராசரிக்கு மேலே — குறுகிய கால ஏற்றம்',
    below_fast_ma: 'விலை 20-கால சராசரிக்கு கீழே — குறுகிய கால இறக்கம்',
    golden_cross: 'வேகமான சராசரி மெதுவான சராசரிக்கு மேலே — ஏற்ற அமைப்பு',
    death_cross: 'வேகமான சராசரி மெதுவான சராசரிக்கு கீழே — இறக்க அமைப்பு',
    rsi_oversold: 'RSI அதிகம் விற்கப்பட்டது — மீள்தல் சாத்தியம்',
    rsi_overbought: 'RSI அதிகம் வாங்கப்பட்டது — இறக்க ஆபத்து',
    rsi_neutral: 'RSI நடுநிலை பகுதியில்',
    momentum_up: 'கடைசி 20 பார்களில் நேர்மறை இயக்கம்',
    momentum_down: 'கடைசி 20 பார்களில் எதிர்மறை இயக்கம்',
    high_volatility: 'அதிக ஏற்றஇறக்கம் — பதிவை எச்சரிக்கையாக எடுங்கள்',
    near_support: 'ஆதரவு பகுதிக்கு அருகில்',
    near_resistance: 'எதிர்ப்பு பகுதிக்கு அருகில்',
  },
  intents: {
    greeting: 'வணக்கம்! எந்த பங்கு பற்றியும் கேளுங்கள் — எ.கா. "NVDA எப்படி இருக்கிறது?" அல்லது "இன்று எந்த பங்கு வாங்கலாம்?"',
    about:
      'நான் மீரா, நிவேஷ்மித்ராவின் AI உதவியாளர். நேரடி விளக்கப்படங்களை படித்து, RSI மற்றும் நகரும் சராசரிகள் போன்ற குறிகாட்டிகளை கணக்கிட்டு, எளிய சொற்களில் — உங்கள் மொழியில் — விளக்குகிறேன். இது கல்விக்காக உருவகப்படுத்தப்பட்ட தரவில் பகுப்பாய்வு, எனவே என்னை SEBI-பதிவுபெற்ற ஆலோசகராக எண்ண வேண்டாம்.',
    help: 'இப்படி கேட்கலாம்: 1) பங்கு பற்றி — "TCS பற்றி சொல்லுங்கள்"। 2) பிக்ஸ்க்காக — "சிறந்த பங்குகள்"। 3) சந்தை பற்றி — "சந்தை ஏறுகிறதா?"। தட்டச்சு பண்ணாமல் மைக் அழுத்தி பேசுங்கள்.',
    thanks: 'மகிழ்ச்சி! முதலீட்டில் பொறுமையும் ஆய்வும் பலன் தரும் — உங்கள் சொந்த ஆய்வையும் செய்யுங்கள்.',
    fallback: 'புரியவில்லை. ஒரு பங்கின் பெயரை எழுதுங்கள் (எ.கா. "RELIANCE" அல்லது "Apple"), அல்லது கேளுங்கள் "இன்று எந்த பங்கு வாங்கலாம்"।',
    price: '{name} ({sym}) தற்போது {price} இல் வர்த்தகமாகிறது, இன்று {chg}. என் சிக்னல்: {signal}, {conf}% நம்பிக்கையுடன்.',
    trend:
      '{name} விளக்கப்படத்தில் {trendWord} தெரிகிறது — விலை 20-கால சராசரியின் {relFast} உள்ளது, RSI {rsi} இல். கடைசி 20 பார்களில் {mom}% மாற்றம்.',
    best: 'போக்கு, இயக்கம் மற்றும் RSI அடிப்படையில் {market} சந்தைக்கான என் டாப் {count} பிக்ஸ் இதோ:',
    pickLine: '{i}. {sym} — {signal} ({conf}% நம்பிக்கை)',
    afterPicks: 'இவை கற்றலுக்காக உருவகப்படுத்தப்பட்ட தரவின் மாதிரி வெளியீடுகள் — முதலீட்டிற்கு முன் ஆய்வு செய்யுங்கள்.',
    marketNote: '{market} சந்தை இப்போது {status} உள்ளது.',
    indexNote: '{sym} {price} இல் உள்ளது (இன்று {chg}).',
  },
  trendWords: { up: 'ஏற்றப்பாதையில்', down: 'இறக்கப்பாதையில்', flat: 'பக்கவாட்டில் நகர்கிறது' },
  relFast: { above: 'மேலே', below: 'கீழே' },
  ui: {
    watchlist: 'கண்காணிப்பு பட்டியல்',
    aiPicks: 'AI பிக்ஸ்',
    assistant: 'AI உதவியாளர்',
    marketOpen: 'சந்தை திறந்துள்ளது',
    marketClosed: 'சந்தை மூடப்பட்டுள்ளது',
    statusOpen: 'திறந்துள்ளது',
    statusClosed: 'மூடப்பட்டுள்ளது',
    autoSpeak: 'பதில்களை பேசு',
    confidence: 'நம்பிக்கை',
    askAi: 'AI-யிடம் கேளுங்கள்',
    india: 'இந்தியா',
    usa: 'அமெரிக்கா',
    live: 'நேரலை',
    simulated: 'உருவக ஊட்டம்',
    addSymbol: 'சின்னம் சேர்க்கவும்…',
    send: 'அனுப்பு',
    micUnsupported: 'இந்த உலவியில் குரல் உள்ளீடு இல்லை — Chrome முயற்சிக்கவும்.',
    voiceLoading: 'கேட்கிறது…',
    chart: 'விளக்கப்படம்',
    volume: 'அளவு',
    high: 'உயர்',
    low: 'தாழ்',
    open: 'திறப்பு',
    rsi: 'RSI',
    signal: 'AI சிக்னல்',
    topPicks: 'டாப் AI பிக்ஸ்',
    refreshed: 'தானியங்கி புதுப்பிப்பு',
    disclaimer: 'உருவக தரவு · கல்விக்கு மட்டும் · முதலீட்டு அறிவுரை அல்ல',
  },
};

const te: Strings = {
  tagline: 'స్మార్ట్ పెట్టుబడికి మీ AI మార్గదర్శి',
  assistantName: 'మీరా',
  greeting:
    'నమస్కారం! నేను మీరా, మీ AI పెట్టుబడి సహచరి. ఏ షేరు గురించైనా అడగండి — లైవ్ చార్ట్ ఆధారంగా వివరించి, సమాధానాన్ని స్వరంలో చెప్తాను. ఇది నేర్చుకోవడానికి విశ్లేషణ, పెట్టుబడి సలహా కాదు.',
  askPlaceholder: 'ఒక షేరు గురించి అడగండి… ఉదా: రిలయన్స్ కొనాలా?',
  listenHint: 'మైక్ నొక్కి మాట్లాడండి',
  disclaimerShort: 'సిమ్యులేటెడ్ డేటాతో విద్యాపరమైన డెమో — పెట్టుబడి సలహా కాదు.',
  disclaimerLong:
    'నివేశమిత్ర AI ఒక విద్యాపరమైన డెమో. అన్ని ధరలు ప్రదర్శన కోసం సిమ్యులేట్ చేయబడ్డాయి, నిజమైన మార్కెట్ డేటాను సూచించవు. ఇక్కడిది ఏదీ పెట్టుబడి సలహా కాదు — పెట్టుబడికి ముందు మీ స్వంత పరిశోధన చేయండి లేదా SEBI-నమోదిత సలహాదారుని సంప్రదించండి.',
  signals: {
    STRONG_BUY: 'బలమైన కొనుగోలు',
    BUY: 'కొనండి',
    HOLD: 'పట్టుకోండి',
    SELL: 'అమ్మండి',
    STRONG_SELL: 'బలమైన అమ్మకం',
  },
  reasons: {
    above_fast_ma: 'ధర 20-కాల సగటు పైన — తక్కువ కాల పెరుగుదల',
    below_fast_ma: 'ధర 20-కాల సగటు కింద — తక్కువ కాల పతనం',
    golden_cross: 'వేగవంతమైన సగటు నెమ్మది సగటు పైన — పెరుగుదల నిర్మాణం',
    death_cross: 'వేగవంతమైన సగటు నెమ్మది సగటు కింద — పతన నిర్మాణం',
    rsi_oversold: 'RSI అధికంగా అమ్మబడింది — తిరిగే అవకాశం',
    rsi_overbought: 'RSI అధికంగా కొనబడింది — పతన ప్రమాదం',
    rsi_neutral: 'RSI తటస్థ ప్రాంతంలో',
    momentum_up: 'గత 20 బార్లలో సానుకూల చలనం',
    momentum_down: 'గత 20 బార్లలో ప్రతికూల చలనం',
    high_volatility: 'అధిక హెచ్చుతగ్గులు — పొజిషన్ జాగ్రత్తగా తీసుకోండి',
    near_support: 'మద్దతు ప్రాంతానికి దగ్గరలో',
    near_resistance: 'నిరోధక ప్రాంతానికి దగ్గరలో',
  },
  intents: {
    greeting: 'నమస్కారం! ఏ షేరు గురించైనా అడగండి — ఉదా: "NVDA ఎలా ఉంది?" లేదా "ఈరోజు ఏ షేరు కొనాలి?"',
    about:
      'నేను మీరా, నివేశమిత్ర AI సహాయకురాలు. లైవ్ చార్ట్లు చదివి, RSI, మూవింగ్ యావరేజీల వంటి సూచికలు లెక్కించి, సరళమైన పదాలలో — మీ భాషలో — వివరిస్తాను. ఇది విద్య కోసం సిమ్యులేటెడ్ డేటాపై విశ్లేషణ, కాబట్టి నన్ను SEBI-నమోదిత సలహాదారుగా భావించవద్దు.',
    help: 'ఇలా అడగవచ్చు: 1) షేరు గురించి — "TCS గురించి చెప్పండి"। 2) పిక్స్ కోసం — "ఉత్తమ షేర్లు"। 3) మార్కెట్ గురించి — "మార్కెట్ పైకెళ్తోందా?"। టైప్ చేయడం కంటే మైక్ నొక్కి మాట్లాడండి.',
    thanks: 'సంతోషం! పెట్టుబడిలో ఓపిక, పరిశోధనకు ఫలితం — మీ స్వంత పరిశీలన కూడా చేయండి.',
    fallback: 'అర్థం కాలేదు. ఒక షేరు పేరు రాయండి (ఉదా: "RELIANCE" లేదా "Apple"), లేదా అడగండి "ఈరోజు ఏ షేరు కొనాలి"।',
    price: '{name} ({sym}) ప్రస్తుతం {price} వద్ద ట్రేడ్ అవుతోంది, ఈరోజు {chg}. నా సంకేతం: {signal}, {conf}% నమ్మకంతో.',
    trend:
      '{name} చార్ట్‌లో {trendWord} కనిపిస్తోంది — ధర 20-కాల సగటు {relFast} ఉంది, RSI {rsi} వద్ద. గత 20 బార్లలో {mom}% మార్పు.',
    best: 'ట్రెండ్, చలనం, RSI ఆధారంగా {market} మార్కెట్‌కు నా టాప్ {count} పిక్స్ ఇవి:',
    pickLine: '{i}. {sym} — {signal} ({conf}% నమ్మకం)',
    afterPicks: 'ఇవి నేర్చుకోవడానికి సిమ్యులేటెడ్ డేటా మోడల్ అవుట్‌పుట్లు — పెట్టుబడికి ముందు పరిశోధన చేయండి.',
    marketNote: '{market} మార్కెట్ ప్రస్తుతం {status} ఉంది.',
    indexNote: '{sym} {price} వద్ద ఉంది (ఈరోజు {chg}).',
  },
  trendWords: { up: 'పెరుగుదల దిశలో', down: 'పతన దిశలో', flat: 'పక్కకు కదులుతోంది' },
  relFast: { above: 'పైన', below: 'కింద' },
  ui: {
    watchlist: 'వాచ్‌లిస్ట్',
    aiPicks: 'AI పిక్స్',
    assistant: 'AI సహాయకురాలు',
    marketOpen: 'మార్కెట్ తెరిచి ఉంది',
    marketClosed: 'మార్కెట్ మూసి ఉంది',
    statusOpen: 'తెరిచి ఉంది',
    statusClosed: 'మూసి ఉంది',
    autoSpeak: 'సమాధానాలు మాట్లాడు',
    confidence: 'నమ్మకం',
    askAi: 'AI అడగండి',
    india: 'భారతదేశం',
    usa: 'అమెరికా',
    live: 'లైవ్',
    simulated: 'సిమ్యులేటెడ్ ఫీడ్',
    addSymbol: 'సింబల్ జోడించండి…',
    send: 'పంపండి',
    micUnsupported: 'ఈ బ్రౌజర్‌లో వాయిస్ ఇన్‌పుట్ లేదు — Chrome ప్రయత్నించండి.',
    voiceLoading: 'వింటున్నాను…',
    chart: 'చార్ట్',
    volume: 'వాల్యూమ్',
    high: 'ఎత్తు',
    low: 'తక్కువ',
    open: 'తెరిచిన',
    rsi: 'RSI',
    signal: 'AI సంకేతం',
    topPicks: 'టాప్ AI పిక్స్',
    refreshed: 'ఆటో-రిఫ్రెష్',
    disclaimer: 'సిమ్యులేటెడ్ డేటా · విద్య కోసమే · పెట్టుబడి సలహా కాదు',
  },
};

const mr: Strings = {
  tagline: 'स्मार्ट गुंतवणुकीचा तुमचा AI मार्गदर्शक',
  assistantName: 'मीरा',
  greeting:
    'नमस्कार! मी मीरा, तुमची AI गुंतवणूक सोबती. कोणत्याही शेअरबद्दल विचारा — लाइव्ह चार्टच्या आधारे समजावून सांगेन आणि उत्तर आवाजातही देईन. हे शिक्षणासाठी विश्लेषण आहे, गुंतवणूक सल्ला नाही.',
  askPlaceholder: 'शेअरबद्दल विचारा… उदा. रिलायन्स खरेदी करू का?',
  listenHint: 'माइक दाबून बोला',
  disclaimerShort: 'सिम्युलेटेड डेटासह शैक्षणिक डेमो — गुंतवणूक सल्ला नाही.',
  disclaimerLong:
    'निवेशमित्र AI हा एक शैक्षणिक डेमो आहे. सर्व किमती प्रदर्शनासाठी सिम्युलेटेड आहेत आणि खऱ्या बाजार डेटाचे प्रतिनिधित्व करत नाहीत. इथे काहीही गुंतवणूक सल्ला नाही — गुंतवणुकपूर्वी स्वतःचे संशोधन करा किंवा SEBI-नोंदणीकृत सल्लागाराशी संपर्क साधा.',
  signals: {
    STRONG_BUY: 'मजबूत खरेदी',
    BUY: 'खरेदी करा',
    HOLD: 'ठेवा',
    SELL: 'विक्री करा',
    STRONG_SELL: 'मजबूत विक्री',
  },
  reasons: {
    above_fast_ma: 'किमत 20-काल सरासरीवर — अल्पकालीन वाढ',
    below_fast_ma: 'किमत 20-काल सरासरीखाली — अल्पकालीन कमी',
    golden_cross: 'वेगवान सरासरी हळू सरासरीवर — वाढची रचना',
    death_cross: 'वेगवान सरासरी हळू सरासरीखाली — कमीची रचना',
    rsi_oversold: 'RSI अतिविक्रीत — उच्छालाची शक्यता',
    rsi_overbought: 'RSI अतिखरेदी — कमीचा धोका',
    rsi_neutral: 'RSI तटस्थ क्षेत्रात',
    momentum_up: 'शेवटच्या 20 बारमध्ये सकारात्मक गती',
    momentum_down: 'शेवटच्या 20 बारमध्ये नकारात्मक गती',
    high_volatility: 'उच्च उतारचढाव — पोझिशन काळजीपूर्वक घ्या',
    near_support: 'आधार क्षेत्राजवळ',
    near_resistance: 'प्रतिरोध क्षेत्राजवळ',
  },
  intents: {
    greeting: 'नमस्कार! कोणत्याही शेअरबद्दल विचारा — उदा. "NVDA कसं चालू आहे?" किंवा "आज कोणता शेअर खरेदी करावा?"',
    about:
      'मी मीरा, निवेशमित्रची AI सहाय्यक. लाइव्ह चार्ट वाचते, RSI आणि मूविंग एव्हरेजसारखे निर्देशक काढते आणि सोप्या शब्दांत — तुमच्या भाषेत — समजावते. हे शिक्षणासाठी सिम्युलेटेड डेटावरचे विश्लेषण आहे, त्यामुळे मला SEBI-नोंदणीकृत सल्लागार समजून घेऊ नका.',
    help: 'असे विचारू शकता: 1) शेअरबद्दल — "TCS बद्दल सांगा"। 2) पिक्ससाठी — "सर्वोत्तम शेअर"। 3) बाजाराबद्दल — "बाजार वर जात आहे का?"। टाइप करण्याऐवजी माइक दाबून बोला.',
    thanks: 'आनंद झाला! गुंतवणुकीत धीर आणि संशोधनाला फायदा — कृपया स्वतःची तपासणीही करा.',
    fallback: 'समजले नाही. शेअरचे नाव लिहा (उदा. "RELIANCE" किंवा "Apple"), किंवा विचारा "आज कोणता शेअर खरेदी करावा".',
    price: '{name} ({sym}) सध्या {price} वर व्यापार होत आहे, आज {chg}. माझा संकेत: {signal}, {conf}% विश्वासासह.',
    trend:
      '{name} चार्टवर {trendWord} दिसत आहे — किमत 20-काल सरासरीच्या {relFast} आहे, RSI {rsi} वर. शेवटच्या 20 बारमध्ये {mom}% बदल.',
    best: 'ट्रेंड, गती आणि RSIवर आधारित {market} बाजारासाठी माझे टॉप {count} पिक्स येथे आहेत:',
    pickLine: '{i}. {sym} — {signal} ({conf}% विश्वास)',
    afterPicks: 'हे शिक्षणासाठी सिम्युलेटेड डेटाच्या मॉडेल आउटपुट आहेत — गुंतवणुकपूर्वी संशोधन करा.',
    marketNote: '{market} बाजार सध्या {status} आहे.',
    indexNote: '{sym} {price} वर आहे (आज {chg}).',
  },
  trendWords: { up: 'वाढीच्या दिशेने', down: 'कमीच्या दिशेने', flat: 'बाजूला हलत आहे' },
  relFast: { above: 'वर', below: 'खाली' },
  ui: {
    watchlist: 'वॉचलिस्ट',
    aiPicks: 'AI पिक्स',
    assistant: 'AI सहाय्यक',
    marketOpen: 'बाजार उघडा आहे',
    marketClosed: 'बाजार बंद आहे',
    statusOpen: 'उघडा आहे',
    statusClosed: 'बंद आहे',
    autoSpeak: 'उत्तरे बोला',
    confidence: 'विश्वास',
    askAi: 'AI ला विचारा',
    india: 'भारत',
    usa: 'अमेरिका',
    live: 'लाइव्ह',
    simulated: 'सिम्युलेटेड फीड',
    addSymbol: 'सिंबल जोडा…',
    send: 'पाठवा',
    micUnsupported: 'या ब्राउझरमध्ये वॉइस इनपुट उपलब्ध नाही — Chrome वापरून पहा.',
    voiceLoading: 'ऐकत आहे…',
    chart: 'चार्ट',
    volume: 'वॉल्यूम',
    high: 'जास्त',
    low: 'कमी',
    open: 'उघडलेले',
    rsi: 'RSI',
    signal: 'AI संकेत',
    topPicks: 'टॉप AI पिक्स',
    refreshed: 'ऑटो-रिफ्रेश',
    disclaimer: 'सिम्युलेटेड डेटा · फक्त शिक्षणासाठी · गुंतवणूक सल्ला नाही',
  },
};

export const STRINGS: Record<LangCode, Strings> = { en, hi, kn, ta, te, mr };

export function t(lang: LangCode): Strings {
  return STRINGS[lang] ?? en;
}

/** Fill {placeholders} in a template. */
export function fmt(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m));
}

// ---------- number / currency formatting ----------
export function formatPrice(value: number, market: Market): string {
  const locale = market === 'IN' ? 'en-IN' : 'en-US';
  const currency = market === 'IN' ? 'INR' : 'USD';
  const digits = value >= 1000 ? 2 : value >= 1 ? 2 : 4;
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}

export function formatCompact(value: number, market: Market): string {
  const locale = market === 'IN' ? 'en-IN' : 'en-US';
  return new Intl.NumberFormat(locale, { notation: 'compact', maximumFractionDigits: 1 }).format(value);
}

export function formatPct(value: number): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

export function marketLabel(market: Market, lang: LangCode): string {
  const s = t(lang);
  return market === 'IN' ? s.ui.india : s.ui.usa;
}
