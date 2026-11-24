import { useEffect, useRef, useState } from 'react';
import type { ChatMessage } from '../ai/assistant';
import { LANGUAGES, t, type LangCode } from '../ai/i18n';
import { recognitionSupported, speak, startListening, stopSpeaking } from '../ai/speech';

interface Props {
  lang: LangCode;
  messages: ChatMessage[];
  autoSpeak: boolean;
  setAutoSpeak: (v: boolean) => void;
  onSend: (text: string) => void;
}

export default function Assistant({ lang, messages, autoSpeak, setAutoSpeak, onSend }: Props) {
  const s = t(lang);
  const [input, setInput] = useState('');
  const [listening, setListening] = useState(false);
  const [speakingId, setSpeakingId] = useState<number | null>(null);
  const stopRecRef = useRef<(() => void) | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages.length]);

  useEffect(() => () => stopRecRef.current?.(), []);

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setInput('');
  };

  const toggleMic = () => {
    if (listening) {
      stopRecRef.current?.();
      stopRecRef.current = null;
      setListening(false);
      return;
    }
    const stop = startListening(lang, {
      onResult: (transcript) => {
        setListening(false);
        stopRecRef.current = null;
        send(transcript);
      },
      onEnd: () => {
        setListening(false);
        stopRecRef.current = null;
      },
      onError: () => {
        setListening(false);
        stopRecRef.current = null;
      },
    });
    if (stop) {
      stopRecRef.current = stop;
      setListening(true);
    }
  };

  const speakMsg = async (m: ChatMessage) => {
    if (speakingId === m.id) {
      stopSpeaking();
      setSpeakingId(null);
      return;
    }
    setSpeakingId(m.id);
    await speak(m.text.replace(/[•·]/g, ''), lang);
    setSpeakingId(null);
  };

  const chips = [chipBest(lang), chipMarket(lang), chipAbout(lang)];

  const canMic = recognitionSupported();

  return (
    <section className="panel assistant">
      <div className="panel-title assistant-head">
        <span className="assistant-id">
          <span className="avatar">🤖</span>
          <span>
            <b>{s.assistantName}</b>
            <small className="muted"> · {s.ui.assistant}</small>
          </span>
        </span>
        <label className="speak-toggle" title={s.ui.autoSpeak}>
          <input type="checkbox" checked={autoSpeak} onChange={(e) => setAutoSpeak(e.target.checked)} />
          🔊 {s.ui.autoSpeak}
        </label>
      </div>

      <div className="chat-list" ref={listRef}>
        {messages.map((m) => (
          <div key={m.id} className={`msg ${m.role}`}>
            {m.role === 'ai' && <span className="msg-avatar">🤖</span>}
            <div className="bubble">
              <p>{m.text}</p>
              {m.role === 'ai' && (
                <button className="replay" onClick={() => speakMsg(m)} title="Read aloud">
                  {speakingId === m.id ? '⏹' : '🔊'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="chat-chips">
        {chips.map((c) => (
          <button key={c} onClick={() => send(c)}>
            {c}
          </button>
        ))}
      </div>

      <div className="chat-input">
        <input
          type="text"
          value={input}
          placeholder={s.askPlaceholder}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send(input)}
        />
        <button
          className={`mic-btn ${listening ? 'listening' : ''}`}
          onClick={toggleMic}
          disabled={!canMic}
          title={canMic ? s.listenHint : s.ui.micUnsupported}
        >
          {listening ? '🎙️…' : '🎤'}
        </button>
        <button className="send-btn" onClick={() => send(input)}>
          ➤
        </button>
      </div>
      {listening && <div className="listening-hint">● {s.ui.voiceLoading}</div>}
      {!canMic && <div className="listening-hint muted">{s.ui.micUnsupported}</div>}
      <div className="lang-note">
        {LANGUAGES.find((l) => l.code === lang)?.native} · {LANGUAGES.find((l) => l.code === lang)?.bcp47}
      </div>
    </section>
  );
}

// short localized quick-chip labels
function chipBest(lang: LangCode): string {
  return {
    en: 'Best stocks to buy',
    hi: 'सबसे अच्छे शेयर',
    kn: 'ಉತ್ತಮ ಷೇರುಗಳು',
    ta: 'சிறந்த பங்குகள்',
    te: 'ఉత్తమ షేర్లు',
    mr: 'सर्वोत्तम शेयर',
  }[lang];
}
function chipMarket(lang: LangCode): string {
  return {
    en: 'How is the market?',
    hi: 'बाज़ार कैसा है?',
    kn: 'ಮಾರುಕಟ್ಟೆ ಹೇಗಿದೆ?',
    ta: 'சந்தை எப்படி?',
    te: 'మార్కెట్ ఎలా ఉంది?',
    mr: 'बाजार कसा आहे?',
  }[lang];
}
function chipAbout(lang: LangCode): string {
  return {
    en: 'Who are you?',
    hi: 'तुम कौन हो?',
    kn: 'ನೀವು ಯಾರು?',
    ta: 'நீங்கள் யார்?',
    te: 'మీరు ఎవరు?',
    mr: 'तुम्ही कोण आहात?',
  }[lang];
}
