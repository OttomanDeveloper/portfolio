// src/components/islands/ThemeToggle.ts
type Theme = 'system' | 'light' | 'dark';
const KEY = 'theme';

function apply(theme: Theme) {
  const root = document.documentElement;
  if (theme === 'system') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
  } else {
    root.setAttribute('data-theme', theme);
  }
}

function current(): Theme {
  const stored = localStorage.getItem(KEY);
  return stored === 'light' || stored === 'dark' ? stored : 'system';
}

function cycle(t: Theme): Theme {
  return t === 'system' ? 'light' : t === 'light' ? 'dark' : 'system';
}

function icon(t: Theme): string {
  return t === 'light' ? '☀' : t === 'dark' ? '☾' : '⌘';
}

export function mountThemeToggle(btn: HTMLButtonElement) {
  let theme = current();
  btn.textContent = icon(theme);
  btn.setAttribute('aria-label', `theme: ${theme} — click to cycle`);
  btn.addEventListener('click', () => {
    theme = cycle(theme);
    if (theme === 'system') localStorage.removeItem(KEY);
    else localStorage.setItem(KEY, theme);
    apply(theme);
    btn.textContent = icon(theme);
    btn.setAttribute('aria-label', `theme: ${theme} — click to cycle`);
  });
  // react to system pref changes while in system mode
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (current() === 'system') apply('system');
  });
}
