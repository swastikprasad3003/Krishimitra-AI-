// Voice layer: text-to-speech (speechSynthesis) and speech-to-text
// (webkitSpeechRecognition) with per-language voice selection.

import { LANGUAGES, type LangCode } from './i18n';

function bcp47(lang: LangCode): string {
  return LANGUAGES.find((l) => l.code === lang)?.bcp47 ?? 'en-IN';
}

let cachedVoices: SpeechSynthesisVoice[] = [];

function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return Promise.resolve([]);
  const existing = window.speechSynthesis.getVoices();
  if (existing.length) {
    cachedVoices = existing;
    return Promise.resolve(existing);
  }
  return new Promise((resolve) => {
    const timer = setTimeout(() => resolve(cachedVoices), 1200);
    window.speechSynthesis.onvoiceschanged = () => {
      clearTimeout(timer);
      cachedVoices = window.speechSynthesis.getVoices();
      resolve(cachedVoices);
    };
  });
}

export function pickVoice(lang: LangCode): SpeechSynthesisVoice | undefined {
  const target = bcp47(lang);
  const voices = cachedVoices.length ? cachedVoices : typeof window !== 'undefined' ? window.speechSynthesis.getVoices() : [];
  if (!voices.length) return undefined;
  const base = target.split('-')[0];
  return (
    voices.find((v) => v.lang === target) ||
    voices.find((v) => v.lang.replace('_', '-').startsWith(base)) ||
    voices.find((v) => v.default && base === 'en') ||
    undefined
  );
}

export function speechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

export function recognitionSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)
  );
}

/** Speak text in the given language. Resolves when playback ends (or fails). */
export async function speak(text: string, lang: LangCode): Promise<boolean> {
  if (!speechSupported() || !text) return false;
  window.speechSynthesis.cancel();
  await loadVoices();

  return new Promise<boolean>((resolve) => {
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = bcp47(lang);
    const voice = pickVoice(lang);
    if (voice) utter.voice = voice;
    utter.rate = 1.02;
    utter.pitch = 1.0;

    let done = false;
    const finish = (ok: boolean) => {
      if (done) return;
      done = true;
      resolve(ok);
    };
    utter.onend = () => finish(true);
    utter.onerror = () => finish(false);
    // safety net: some browsers never fire onend
    setTimeout(() => finish(true), 4000 + text.length * 95);

    window.speechSynthesis.speak(utter);
  });
}

export function stopSpeaking(): void {
  if (speechSupported()) window.speechSynthesis.cancel();
}

export interface RecognitionHandlers {
  onResult: (transcript: string) => void;
  onEnd: () => void;
  onError: (error: string) => void;
}

type AnyRecognition = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((e: any) => void) | null;
  onerror: ((e: any) => void) | null;
  onend: (() => void) | null;
};

/** Start mic dictation. Returns a stop function. */
export function startListening(lang: LangCode, handlers: RecognitionHandlers): (() => void) | null {
  if (!recognitionSupported()) return null;
  const Ctor: any = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  const rec: AnyRecognition = new Ctor();
  rec.lang = bcp47(lang);
  rec.continuous = false;
  rec.interimResults = false;

  rec.onresult = (e: any) => {
    const transcript = e?.results?.[0]?.[0]?.transcript ?? '';
    if (transcript) handlers.onResult(transcript);
  };
  rec.onerror = (e: any) => handlers.onError(e?.error ?? 'error');
  rec.onend = () => handlers.onEnd();

  try {
    rec.start();
  } catch {
    handlers.onError('start-failed');
    return null;
  }
  return () => {
    try {
      rec.stop();
    } catch {
      /* already stopped */
    }
  };
}

/** Preload voices once at app start. */
export function initSpeech(): void {
  if (speechSupported()) {
    void loadVoices();
  }
}
