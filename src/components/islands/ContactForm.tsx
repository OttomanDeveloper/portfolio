// src/components/islands/ContactForm.tsx
import { useEffect, useRef, useState } from 'react';

type Status = 'idle' | 'sending' | 'sent' | 'error';

export default function ContactForm({ to }: { to: string }) {
  const startedAt = useRef<number>(Date.now());
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { startedAt.current = Date.now(); }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('sending');
    setError(null);
    const fd = new FormData(e.currentTarget);
    const payload = {
      from: String(fd.get('from') ?? ''),
      about: String(fd.get('about') ?? ''),
      body: String(fd.get('body') ?? ''),
      website: String(fd.get('website') ?? ''),
      startedAt: startedAt.current,
    };
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(typeof data.error === 'string' ? data.error : "couldn't send. try again or email me directly.");
        setStatus('error');
        return;
      }
      setStatus('sent');
    } catch {
      setError("network error. try again or email me directly.");
      setStatus('error');
    }
  }

  if (status === 'sent') {
    return (
      <div className="cf" role="status" aria-live="polite">
        <p className="ok">✓ sent. i'll reply within ~24h.</p>
      </div>
    );
  }

  return (
    <form className="cf" onSubmit={onSubmit} noValidate>
      {/* honeypot */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off"
        aria-hidden="true"
        style={{ position: 'absolute', left: '-9999px', width: 1, height: 1 }} />
      <label className="ln">
        <span className="k">from:</span>
        <input name="from" type="email" required placeholder="your@email.com" />
      </label>
      <label className="ln">
        <span className="k">about:</span>
        <input name="about" type="text" required minLength={2} maxLength={120}
          placeholder="role · contract · advice · just saying hi" />
      </label>
      <label className="ln">
        <span className="k">body:</span>
        <textarea name="body" required minLength={10} maxLength={4000}
          placeholder={`i'll read every message and reply within ~24h`} />
      </label>
      <button type="submit" disabled={status === 'sending'}>
        {status === 'sending' ? '▸ sending…' : '▸ send'}
      </button>
      {error && <p className="err" role="alert">{error}</p>}
      <p className="fallback">
        or email me directly: <a href={`mailto:${to}`}>{to}</a>
      </p>

      <style>{`
        .cf {
          margin-top: 12px; padding: 18px 20px;
          background: var(--bg-elev); border: 1px solid var(--border-soft);
          border-radius: var(--radius-sm);
          font-family: var(--font-mono); font-size: var(--fs-base);
        }
        .ln { display: block; padding: 4px 0; }
        .k { color: var(--key); display: inline-block; min-width: 64px; }
        .cf input, .cf textarea {
          background: var(--bg); border: 1px solid var(--border-soft);
          color: var(--fg); font-family: inherit; font-size: inherit;
          padding: 6px 10px; border-radius: var(--radius-sm);
          width: 100%; max-width: 320px; outline: none;
        }
        .cf textarea { width: 100%; max-width: 480px; min-height: 80px; }
        .cf input:focus, .cf textarea:focus { border-color: var(--accent); }
        .cf button {
          margin-top: 10px; padding: 8px 16px;
          background: var(--accent); color: var(--bg);
          border: 0; border-radius: var(--radius-sm);
          font: inherit; font-weight: 600; cursor: pointer;
          min-height: 44px;
        }
        .cf button:disabled { opacity: 0.6; cursor: progress; }
        .err { color: var(--alert); margin-top: 8px; font-size: var(--fs-sm); }
        .ok { color: var(--accent); margin: 0; }
        .fallback { color: var(--fg-dim); font-size: var(--fs-sm); margin-top: 8px; }
      `}</style>
    </form>
  );
}
