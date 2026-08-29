import { describe, expect, it } from 'vitest';
import { formatProfessionalIdentity } from './formatProfessionalIdentity';

describe('formatProfessionalIdentity', () => {
  it('combina fabricante y modelo', () => {
    expect(formatProfessionalIdentity({ fabricante: 'Sonos', modelo: 'Amp' })).toBe('Sonos · Amp');
  });

  it('omite separadores cuando falta uno de los datos', () => {
    expect(formatProfessionalIdentity({ fabricante: 'Apple', modelo: '' })).toBe('Apple');
    expect(formatProfessionalIdentity({ fabricante: '', modelo: '' })).toBe('');
  });
});
