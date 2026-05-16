import { describe, it, expect } from 'vitest';
import { ContactSchema, MIN_FILL_MS } from '@/lib/contact-schema';

describe('ContactSchema', () => {
  const valid = {
    from: 'test@example.com',
    about: 'test',
    body: 'hello world hello',
    website: '',
    startedAt: Date.now() - (MIN_FILL_MS + 100),
  };

  it('accepts a valid payload', () => {
    expect(ContactSchema.parse(valid).from).toBe('test@example.com');
  });

  it('rejects invalid email', () => {
    expect(() => ContactSchema.parse({ ...valid, from: 'not-an-email' })).toThrow();
  });

  it('rejects too-short body', () => {
    expect(() => ContactSchema.parse({ ...valid, body: 'short' })).toThrow();
  });

  it('rejects honeypot fill', () => {
    expect(() => ContactSchema.parse({ ...valid, website: 'http://spam.com' })).toThrow();
  });
});
