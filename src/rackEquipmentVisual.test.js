import { describe, expect, it } from 'vitest';
import { getRackVisualSegments } from './rackEquipmentVisual.js';

describe('getRackVisualSegments', () => {
  it('centers a 1U Sonos Amp Multi between two 0.5U support bands', () => {
    const segments = getRackVisualSegments({
      id: 'sonos-amp-multi',
      uOcupadas: 2,
      distribucionVisualRack: {
        soporteSuperiorU: 0.5,
        equipoU: 1,
        soporteInferiorU: 0.5
      }
    });

    expect(segments).toEqual([
      { type: 'support', u: 0.5 },
      { type: 'equipment', u: 1 },
      { type: 'support', u: 0.5 }
    ]);
    expect(segments.reduce((total, segment) => total + segment.u, 0)).toBe(2);
  });

  it('uses the complete occupied height for standard equipment', () => {
    expect(getRackVisualSegments({ id: 'equipo-2u', uOcupadas: 2 })).toEqual([
      { type: 'equipment', u: 2 }
    ]);
  });
});
