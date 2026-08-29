import { describe, expect, it } from 'vitest';
import professionalCatalog from './professionalCatalog.json';

describe('datos profesionales importados desde Excel', () => {
  it('contiene una ficha sin SKU para cada producto oficial', () => {
    expect(professionalCatalog).toHaveLength(32);
    expect(new Set(professionalCatalog.map(item => item.id)).size).toBe(32);
    professionalCatalog.forEach(item => {
      expect(item).not.toHaveProperty('skuFabricante');
      expect(item.codigoODDO).toBeTruthy();
    });
  });

  it('incorpora los cambios guardados para Kaleidescape', () => {
    expect(professionalCatalog.find(item => item.id === 'kaleidescape')).toMatchObject({
      fabricante: 'Kaleidescape',
      codigoODDO: 'XXXXX',
      urlOficial: 'https://www.kaleidescape.com/strato-movie-players/',
      estadoValidacion: 'validado',
    });
  });
});
