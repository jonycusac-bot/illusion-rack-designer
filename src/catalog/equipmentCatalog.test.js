import { describe, expect, it } from 'vitest';
import { CATALOG_VERSION, EQUIPMENT_CATALOG } from './equipmentCatalog';
import { validateOfficialCatalog } from './catalogSchema';

const EXPECTED_IDS = [
  'udm-pro',
  'sw-pro-48',
  'sw-ent-24',
  'unifi-router-compact',
  'switch-8p-dlink',
  'crestron-cp4',
  'crestron-rmc4',
  'beoliving',
  'beoamp2',
  'beocore',
  'matrix-audio',
  'sonance-dsp',
  'sonos-amp',
  'sonos-amp-multi',
  'sonos-port',
  'apple-tv',
  'kaleidescape',
  'receptor-sat',
  'marantz-av',
  'integra-drx',
  'audiocontrol-av',
  'ups-apc',
  'equipo-1u',
  'equipo-2u',
  'equipo-3u',
  'equipo-4u',
  'equipo-media-balda',
  'placa-ciega-1u',
  'placa-ciega-2u',
  'escobilla-acc',
  'pasacables-acc',
  'regleta-acc',
];

describe('catálogo oficial estructurado', () => {
  it('mantiene la versión y los 32 IDs oficiales existentes', () => {
    expect(CATALOG_VERSION).toBe('1.2.0');
    expect(EQUIPMENT_CATALOG.map(item => item.id)).toEqual(EXPECTED_IDS);
  });

  it('cumple el esquema técnico sin IDs duplicados ni valores negativos', () => {
    expect(validateOfficialCatalog(EQUIPMENT_CATALOG)).toEqual([]);
  });

  it('conserva la distribución especial del Sonos Amp Multi', () => {
    const sonosAmpMulti = EQUIPMENT_CATALOG.find(item => item.id === 'sonos-amp-multi');

    expect(sonosAmpMulti.uOcupadas).toBe(2);
    expect(sonosAmpMulti.distribucionVisualRack).toEqual({
      soporteSuperiorU: 0.5,
      equipoU: 1,
      soporteInferiorU: 0.5,
    });
  });

  it('incorpora la ficha profesional importada a los 32 productos', () => {
    EQUIPMENT_CATALOG.forEach(item => {
      expect(item.datosProfesionales).toEqual(expect.objectContaining({
        fabricante: expect.any(String),
        modelo: expect.any(String),
        codigoODDO: expect.any(String),
        estadoValidacion: expect.any(String),
      }));
      expect(item.datosProfesionales).not.toHaveProperty('skuFabricante');
    });

    expect(EQUIPMENT_CATALOG.find(item => item.id === 'kaleidescape').datosProfesionales).toMatchObject({
      fabricante: 'Kaleidescape',
      urlOficial: 'https://www.kaleidescape.com/strato-movie-players/',
      estadoValidacion: 'validado',
    });
  });

  it('rechaza valores profesionales negativos', () => {
    const invalidProduct = {
      ...EQUIPMENT_CATALOG.find(item => item.id === 'sonos-port'),
      datosProfesionales: {
        ...EQUIPMENT_CATALOG.find(item => item.id === 'sonos-port').datosProfesionales,
        pesoKg: -1,
      },
    };

    expect(validateOfficialCatalog([invalidProduct])).toContain('sonos-port: peso profesional no válido.');
  });

  it('rechaza productos oficiales sin ficha profesional importada', () => {
    const withoutProfessionalData = { ...EQUIPMENT_CATALOG[0] };
    delete withoutProfessionalData.datosProfesionales;

    expect(validateOfficialCatalog([withoutProfessionalData])).toContain(`${withoutProfessionalData.id}: falta la ficha profesional.`);
  });
});
