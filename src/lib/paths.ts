// src/lib/paths.ts
const BASE = (import.meta.env.PUBLIC_BASE_PATH ?? '/').replace(/\/$/, '');

/** Prefix an absolute-style path with the configured base. Idempotent for external URLs. */
export function withBase(path: string): string {
  if (!path.startsWith('/')) return path; // external or relative — leave alone
  return `${BASE}${path}`;
}
