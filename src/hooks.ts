import { useEffect, useState } from 'react';
import { engine } from './data/engine';

/** Re-render every time the market engine ticks (≈1/sec). */
export function useMarketTick(): number {
  const [tick, setTick] = useState(0);
  useEffect(() => engine.subscribe(() => setTick((t) => t + 1)), []);
  return tick;
}

export function useLocalStorage<T>(key: string, initial: T): [T, (v: T) => void] {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });
  const set = (v: T) => {
    setValue(v);
    try {
      localStorage.setItem(key, JSON.stringify(v));
    } catch {
      /* ignore */
    }
  };
  return [value, set];
}
