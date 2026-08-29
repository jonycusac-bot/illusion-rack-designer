import { describe, expect, it } from 'vitest';
import { shouldUseGoogleRedirect } from './auth.js';

describe('shouldUseGoogleRedirect', () => {
  it('uses redirect when the browser blocks the Google popup', () => {
    expect(shouldUseGoogleRedirect({ code: 'auth/popup-blocked' })).toBe(true);
  });

  it('does not hide unrelated authentication errors', () => {
    expect(shouldUseGoogleRedirect({ code: 'auth/unauthorized-domain' })).toBe(false);
  });
});
