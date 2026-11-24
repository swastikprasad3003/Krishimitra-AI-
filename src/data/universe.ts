// Symbol universe: Indian (NSE) + US (NYSE/NASDAQ) stocks and major indices.
// Prices are simulated for demo purposes (seeded random walk), designed to be
// swappable with a real market-data API later.

export type Market = 'IN' | 'US';

export interface SymbolDef {
  symbol: string;
  name: string;
  market: Market;
  currency: '₹' | '$';
  base: number; // reference price (approx. real-world level)
  vol: number; // annualised volatility used by the simulator
  sector: string;
  isIndex?: boolean;
}

export const UNIVERSE: SymbolDef[] = [
  // ---------- Indian indices ----------
  { symbol: 'SENSEX', name: 'BSE Sensex', market: 'IN', currency: '₹', base: 82450, vol: 0.13, sector: 'Index', isIndex: true },
  { symbol: 'NIFTY50', name: 'Nifty 50', market: 'IN', currency: '₹', base: 25120, vol: 0.13, sector: 'Index', isIndex: true },
  { symbol: 'BANKNIFTY', name: 'Nifty Bank', market: 'IN', currency: '₹', base: 57300, vol: 0.15, sector: 'Index', isIndex: true },

  // ---------- Indian stocks ----------
  { symbol: 'RELIANCE', name: 'Reliance Industries', market: 'IN', currency: '₹', base: 1428, vol: 0.22, sector: 'Energy' },
  { symbol: 'TCS', name: 'Tata Consultancy Services', market: 'IN', currency: '₹', base: 4120, vol: 0.2, sector: 'IT' },
  { symbol: 'HDFCBANK', name: 'HDFC Bank', market: 'IN', currency: '₹', base: 1685, vol: 0.19, sector: 'Banking' },
  { symbol: 'INFY', name: 'Infosys', market: 'IN', currency: '₹', base: 1875, vol: 0.21, sector: 'IT' },
  { symbol: 'ICICIBANK', name: 'ICICI Bank', market: 'IN', currency: '₹', base: 1290, vol: 0.2, sector: 'Banking' },
  { symbol: 'SBIN', name: 'State Bank of India', market: 'IN', currency: '₹', base: 842, vol: 0.23, sector: 'Banking' },
  { symbol: 'TATAMOTORS', name: 'Tata Motors', market: 'IN', currency: '₹', base: 765, vol: 0.3, sector: 'Auto' },
  { symbol: 'ITC', name: 'ITC Ltd', market: 'IN', currency: '₹', base: 468, vol: 0.17, sector: 'FMCG' },
  { symbol: 'BHARTIARTL', name: 'Bharti Airtel', market: 'IN', currency: '₹', base: 1560, vol: 0.2, sector: 'Telecom' },
  { symbol: 'LT', name: 'Larsen & Toubro', market: 'IN', currency: '₹', base: 3640, vol: 0.22, sector: 'Infrastructure' },
  { symbol: 'MARUTI', name: 'Maruti Suzuki', market: 'IN', currency: '₹', base: 12480, vol: 0.21, sector: 'Auto' },
  { symbol: 'AXISBANK', name: 'Axis Bank', market: 'IN', currency: '₹', base: 1175, vol: 0.22, sector: 'Banking' },
  { symbol: 'BAJFINANCE', name: 'Bajaj Finance', market: 'IN', currency: '₹', base: 6890, vol: 0.27, sector: 'NBFC' },
  { symbol: 'WIPRO', name: 'Wipro', market: 'IN', currency: '₹', base: 542, vol: 0.23, sector: 'IT' },
  { symbol: 'TATASTEEL', name: 'Tata Steel', market: 'IN', currency: '₹', base: 168, vol: 0.29, sector: 'Metals' },
  { symbol: 'SUNPHARMA', name: 'Sun Pharma', market: 'IN', currency: '₹', base: 1785, vol: 0.19, sector: 'Pharma' },
  { symbol: 'TITAN', name: 'Titan Company', market: 'IN', currency: '₹', base: 3390, vol: 0.24, sector: 'Consumer' },
  { symbol: 'ADANIENT', name: 'Adani Enterprises', market: 'IN', currency: '₹', base: 2450, vol: 0.34, sector: 'Conglomerate' },
  { symbol: 'HINDUNILVR', name: 'Hindustan Unilever', market: 'IN', currency: '₹', base: 2380, vol: 0.16, sector: 'FMCG' },

  // ---------- US indices ----------
  { symbol: 'SPX', name: 'S&P 500', market: 'US', currency: '$', base: 6080, vol: 0.12, sector: 'Index', isIndex: true },
  { symbol: 'NASDAQ', name: 'Nasdaq Composite', market: 'US', currency: '$', base: 21450, vol: 0.15, sector: 'Index', isIndex: true },
  { symbol: 'DOW', name: 'Dow Jones Industrial', market: 'US', currency: '$', base: 44620, vol: 0.12, sector: 'Index', isIndex: true },

  // ---------- US stocks ----------
  { symbol: 'AAPL', name: 'Apple Inc.', market: 'US', currency: '$', base: 245, vol: 0.24, sector: 'Technology' },
  { symbol: 'MSFT', name: 'Microsoft Corp.', market: 'US', currency: '$', base: 448, vol: 0.22, sector: 'Technology' },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', market: 'US', currency: '$', base: 178, vol: 0.42, sector: 'Semiconductors' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', market: 'US', currency: '$', base: 196, vol: 0.25, sector: 'Technology' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', market: 'US', currency: '$', base: 228, vol: 0.27, sector: 'E-commerce' },
  { symbol: 'META', name: 'Meta Platforms', market: 'US', currency: '$', base: 612, vol: 0.3, sector: 'Technology' },
  { symbol: 'TSLA', name: 'Tesla Inc.', market: 'US', currency: '$', base: 348, vol: 0.45, sector: 'Auto' },
  { symbol: 'NFLX', name: 'Netflix Inc.', market: 'US', currency: '$', base: 895, vol: 0.3, sector: 'Entertainment' },
  { symbol: 'JPM', name: 'JPMorgan Chase', market: 'US', currency: '$', base: 248, vol: 0.18, sector: 'Banking' },
  { symbol: 'V', name: 'Visa Inc.', market: 'US', currency: '$', base: 342, vol: 0.17, sector: 'Finance' },
  { symbol: 'AMD', name: 'Advanced Micro Devices', market: 'US', currency: '$', base: 158, vol: 0.4, sector: 'Semiconductors' },
  { symbol: 'DIS', name: 'Walt Disney Co.', market: 'US', currency: '$', base: 112, vol: 0.24, sector: 'Entertainment' },
  { symbol: 'PLTR', name: 'Palantir Technologies', market: 'US', currency: '$', base: 72, vol: 0.48, sector: 'Software' },
  { symbol: 'COIN', name: 'Coinbase Global', market: 'US', currency: '$', base: 285, vol: 0.55, sector: 'Crypto/Finance' },
  { symbol: 'KO', name: 'Coca-Cola Co.', market: 'US', currency: '$', base: 72, vol: 0.14, sector: 'FMCG' },
  { symbol: 'BA', name: 'Boeing Co.', market: 'US', currency: '$', base: 178, vol: 0.33, sector: 'Aerospace' },
];

const BY_SYMBOL = new Map(UNIVERSE.map((s) => [s.symbol, s]));

export function getSymbolDef(symbol: string): SymbolDef | undefined {
  return BY_SYMBOL.get(symbol);
}

export function symbolsForMarket(market: Market): SymbolDef[] {
  return UNIVERSE.filter((s) => s.market === market);
}

export function tradableForMarket(market: Market): SymbolDef[] {
  return UNIVERSE.filter((s) => s.market === market && !s.isIndex);
}

/** Loose symbol lookup from free text: exact code, then company-name match. */
export function resolveSymbol(text: string): SymbolDef | undefined {
  const t = text.trim().toUpperCase();
  if (BY_SYMBOL.has(t)) return BY_SYMBOL.get(t);
  // word-boundary match on symbol inside longer text (e.g. "should I buy AAPL?")
  for (const def of UNIVERSE) {
    const re = new RegExp(`(^|[^A-Z0-9])${def.symbol}([^A-Z0-9]|$)`);
    if (re.test(t)) return def;
  }
  // company-name match (case-insensitive)
  const lower = text.toLowerCase();
  let best: SymbolDef | undefined;
  for (const def of UNIVERSE) {
    if (def.name.toLowerCase() === lower) return def;
    if (lower.includes(def.name.toLowerCase()) && (!best || def.name.length > best.name.length)) {
      best = def;
    }
  }
  if (best) return best;

  // distinctive brand word of the name ("reliance", "nvidia") — longest match wins,
  // generic words (company, industries, …) are ignored to avoid false positives
  const GENERIC = new Set([
    'company', 'industries', 'platforms', 'technologies', 'global', 'enterprises',
    'chase', 'composite', 'industrial', 'consultancy', 'services', 'systems',
    'unilever', 'holdings', 'group', 'the', 'and', 'inc', 'ltd', 'co',
  ]);
  let bestWord: { def: SymbolDef; len: number } | undefined;
  for (const def of UNIVERSE) {
    const words = def.name
      .toLowerCase()
      .replace(/[^a-z\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length >= 4 && !GENERIC.has(w));
    for (const w of words) {
      const re = new RegExp(`\\b${w}\\b`);
      if (re.test(lower) && (!bestWord || w.length > bestWord.len)) {
        bestWord = { def, len: w.length };
      }
    }
  }
  return bestWord?.def;
}
