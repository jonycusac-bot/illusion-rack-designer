import { describe, expect, it } from 'vitest';
import { DEFAULT_TABLET_DESIGNER_VIEW, TABLET_DESIGNER_VIEWS } from './designerViewport';

describe('configuración responsive del diseñador', () => {
  it('abre el rack como superficie principal del iPad', () => {
    expect(DEFAULT_TABLET_DESIGNER_VIEW).toBe('rack');
  });

  it('ofrece equipos, rack y resumen en ese orden', () => {
    expect(TABLET_DESIGNER_VIEWS.map(view => view.id)).toEqual(['equipos', 'rack', 'resumen']);
    expect(TABLET_DESIGNER_VIEWS.map(view => view.label)).toEqual(['Equipos', 'Rack', 'Resumen']);
  });
});
