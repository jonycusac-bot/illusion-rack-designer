import { describe, expect, it } from 'vitest';
import {
  normalizeCustomEquipment,
  parseStoredCustomEquipment,
  validateCustomEquipment
} from './customEquipment.js';

describe('validateCustomEquipment', () => {
  it('requires manufacturer and model', () => {
    expect(validateCustomEquipment({ fabricante: '', modelo: '' })).toEqual({
      fabricante: 'Indica el fabricante.',
      modelo: 'Indica el modelo.'
    });
  });

  it('validates the technical rack fields', () => {
    expect(validateCustomEquipment({
      fabricante: 'Marca',
      modelo: 'Modelo',
      esRackable: true,
      uOcupadas: 0,
      fondo: -1,
      consumo: -10
    })).toEqual({
      uOcupadas: 'Indica una altura entre 1U y 20U.',
      fondo: 'La profundidad no puede ser negativa.',
      consumo: 'El consumo no puede ser negativo.'
    });
  });

  it('rejects product references that are not web URLs', () => {
    expect(validateCustomEquipment({
      fabricante: 'QSC',
      modelo: 'Core 110f',
      esRackable: true,
      uOcupadas: 1,
      urlProducto: 'qsys.com/core-110f'
    })).toMatchObject({
      urlProducto: 'Introduce una URL completa que empiece por http:// o https://.'
    });
  });
});

describe('normalizeCustomEquipment', () => {
  it('creates a catalog-compatible rack item', () => {
    expect(normalizeCustomEquipment({
      fabricante: '  QSC ',
      modelo: ' Core 110f ',
      categoria: 'Audio',
      esRackable: true,
      uOcupadas: '1',
      fondo: '286',
      consumo: '60',
      urlProducto: 'https://www.qsys.com/core-110f',
      requiereEscobilla: true
    }, 'custom_qsc')).toMatchObject({
      id: 'custom_qsc',
      nombre: 'QSC Core 110f',
      fabricante: 'QSC',
      modelo: 'Core 110f',
      categoria: 'Audio',
      esRackable: true,
      uOcupadas: 1,
      altura: 44.45,
      fondo: 286,
      consumo: 60,
      urlProducto: 'https://www.qsys.com/core-110f',
      requiereEscobilla: true,
      esPersonalizado: true
    });
  });
});

describe('parseStoredCustomEquipment', () => {
  it('returns an empty catalog for malformed storage data', () => {
    expect(parseStoredCustomEquipment('{malformed')).toEqual([]);
    expect(parseStoredCustomEquipment('{}')).toEqual([]);
  });
});
