import { describe, expect, it } from 'vitest';
import { mergeProfessionalCatalog } from './mergeProfessionalCatalog';

describe('mergeProfessionalCatalog', () => {
  it('fusiona los datos profesionales por ID sin perder las reglas técnicas', () => {
    const technicalCatalog = [{
      id: 'sonos-amp-multi',
      nombre: 'Sonos Amp Multi',
      uOcupadas: 2,
      distribucionVisualRack: { soporteSuperiorU: 0.5, equipoU: 1, soporteInferiorU: 0.5 },
    }];
    const professionalRows = [{
      id: 'sonos-amp-multi',
      fabricante: 'Sonos',
      modelo: 'Amp Multi',
      codigoODDO: 'XXXXX',
      estadoValidacion: 'pendiente',
    }];

    const merged = mergeProfessionalCatalog(technicalCatalog, professionalRows);

    expect(merged[0]).toMatchObject({
      id: 'sonos-amp-multi',
      uOcupadas: 2,
      distribucionVisualRack: { soporteSuperiorU: 0.5, equipoU: 1, soporteInferiorU: 0.5 },
      datosProfesionales: {
        fabricante: 'Sonos',
        modelo: 'Amp Multi',
        codigoODDO: 'XXXXX',
        estadoValidacion: 'pendiente',
      },
    });
  });

  it('rechaza filas profesionales con IDs desconocidos o ausentes', () => {
    expect(() => mergeProfessionalCatalog(
      [{ id: 'sonos-port' }],
      [{ id: 'producto-desconocido', fabricante: 'Marca' }],
    )).toThrow(/IDs profesionales no coinciden/);
  });
});
