import professionalCatalog from './professionalCatalog.json';
import { mergeProfessionalCatalog } from './mergeProfessionalCatalog';

export const CATALOG_VERSION = '1.2.0';

const TECHNICAL_EQUIPMENT_CATALOG = Object.freeze([
  // --- REDES ---
  { id: 'udm-pro', nombre: 'UniFi Dream Machine Pro', altura: 44, esRackable: true, categoria: 'Redes', consumo: 33, requiereEscobilla: true, fondo: 285 },
  { id: 'sw-pro-48', nombre: 'UniFi Switch Pro 48 PoE', altura: 44, esRackable: true, categoria: 'Redes', consumo: 600, requiereEscobilla: true, fondo: 400 },
  { id: 'sw-ent-24', nombre: 'UniFi Enterprise 24', altura: 44, esRackable: true, categoria: 'Redes', consumo: 450, requiereEscobilla: true, fondo: 320 },
  { id: 'unifi-router-compact', nombre: 'UniFi Router Compact', altura: 44, esRackable: false, categoria: 'Redes', consumo: 200, ancho: 'media', requiereTapaCiega: true, fondo: 150 },
  { id: 'switch-8p-dlink', nombre: 'Switch 8p D-Link', altura: 44, esRackable: false, categoria: 'Redes', consumo: 10, ancho: 'media', requiereTapaCiega: true, fondo: 120 },

  // --- CONTROL ---
  { id: 'crestron-cp4', nombre: 'Crestron CP4', altura: 44, esRackable: true, categoria: 'Control', consumo: 15, fondo: 170 },
  { id: 'crestron-rmc4', nombre: 'Crestron RMC4', altura: 44, esRackable: false, categoria: 'Control', consumo: 10, ancho: 'media', requiereTapaCiega: true, fondo: 120 },
  { id: 'beoliving', nombre: 'Beoliving Intelligence', altura: 44, esRackable: false, categoria: 'Control', consumo: 20, ancho: 'media', requiereTapaCiega: true, fondo: 200 },

  // --- AUDIO ---
  { id: 'beoamp2', nombre: 'B&O Beoamp2', altura: 44, esRackable: true, categoria: 'Audio', consumo: 300, fondo: 250 },
  { id: 'beocore', nombre: 'BeoCore (B&O)', altura: 44, esRackable: false, categoria: 'Audio', consumo: 50, fondo: 310, ancho: 'media', requiereTapaCiega: true },
  { id: 'matrix-audio', nombre: 'Matriz Audio 16x16', altura: 88, esRackable: true, categoria: 'Audio', consumo: 80, fondo: 350 },
  { id: 'sonance-dsp', nombre: 'Sonance DSP 8-125', altura: 44, esRackable: true, categoria: 'Audio', consumo: 600, fondo: 425, requierePlacaCiega: true },
  { id: 'sonos-amp', nombre: 'Sonos Amp', altura: 88, esRackable: false, categoria: 'Audio', consumo: 100, ancho: 'media', requiereTapaCiega: true, fondo: 220 },
  {
    id: 'sonos-amp-multi',
    nombre: 'Sonos Amp Multi',
    altura: 88,
    esRackable: true,
    categoria: 'Audio',
    consumo: 200,
    fondo: 220,
    uOcupadas: 2,
    distribucionVisualRack: { soporteSuperiorU: 0.5, equipoU: 1, soporteInferiorU: 0.5 },
  },
  { id: 'sonos-port', nombre: 'Sonos Port', altura: 44, esRackable: false, categoria: 'Audio', consumo: 10, ancho: 'media', requiereTapaCiega: true, fondo: 150 },

  // --- VIDEO ---
  { id: 'apple-tv', nombre: 'Apple TV 4K', altura: 35, esRackable: false, categoria: 'Video', consumo: 6, requiereTapaCiega: true, ancho: 'media', fondo: 93 },
  { id: 'kaleidescape', nombre: 'Kaleidescape Strato', altura: 44, esRackable: true, categoria: 'Video', consumo: 30, fondo: 250 },
  { id: 'receptor-sat', nombre: 'Receptor Sat', altura: 44, esRackable: false, categoria: 'Video', consumo: 15, ancho: 'media', requiereTapaCiega: true, fondo: 150 },

  // --- CINEMA ---
  { id: 'marantz-av', nombre: 'Marantz AV Processor', altura: 177, esRackable: true, categoria: 'Cinema', consumo: 800, fondo: 411, uOcupadas: 4 },
  { id: 'integra-drx', nombre: 'Integra DRX Series', altura: 177, esRackable: true, categoria: 'Cinema', consumo: 850, fondo: 390, uOcupadas: 4 },
  { id: 'audiocontrol-av', nombre: 'AudioControl Maestro', altura: 177, esRackable: true, categoria: 'Cinema', consumo: 850, fondo: 420, uOcupadas: 4 },

  // --- ENERGÍA ---
  { id: 'ups-apc', nombre: 'SAI APC Smart-UPS 1500', altura: 88, esRackable: true, categoria: 'Energía', consumo: 0, fondo: 457 },

  // --- OTROS ---
  { id: 'equipo-1u', nombre: 'Equipo 1U', altura: 44, esRackable: true, categoria: 'Otros', consumo: 50, fondo: 300 },
  { id: 'equipo-2u', nombre: 'Equipo 2U', altura: 88, esRackable: true, categoria: 'Otros', consumo: 100, fondo: 350 },
  { id: 'equipo-3u', nombre: 'Equipo 3U', altura: 133, esRackable: true, categoria: 'Otros', consumo: 150, fondo: 400, uOcupadas: 3 },
  { id: 'equipo-4u', nombre: 'Equipo 4U', altura: 177, esRackable: true, categoria: 'Otros', consumo: 200, fondo: 450, uOcupadas: 4 },
  { id: 'equipo-media-balda', nombre: 'Equipo Media Balda', altura: 44, esRackable: false, categoria: 'Otros', consumo: 25, ancho: 'media', requiereTapaCiega: true, fondo: 150 },

  // --- ACCESORIOS ---
  { id: 'placa-ciega-1u', nombre: 'Placa Ciega 1U', altura: 44, esRackable: true, categoria: 'Accesorios', consumo: 0, fondo: 0, esAccesorio: true },
  { id: 'placa-ciega-2u', nombre: 'Placa Ciega 2U', altura: 88, esRackable: true, categoria: 'Accesorios', consumo: 0, fondo: 0, uOcupadas: 2, esAccesorio: true },
  { id: 'escobilla-acc', nombre: 'Escobilla', altura: 44, esRackable: true, categoria: 'Accesorios', consumo: 0, fondo: 0, esAccesorio: true, esEscobillaMaual: true },
  { id: 'pasacables-acc', nombre: 'Pasacables', altura: 44, esRackable: true, categoria: 'Accesorios', consumo: 0, fondo: 100, esAccesorio: true },
  { id: 'regleta-acc', nombre: 'Regleta de conexión', altura: 44, esRackable: true, categoria: 'Accesorios', consumo: 0, fondo: 150, esAccesorio: true },
]);

export const EQUIPMENT_CATALOG = Object.freeze(
  mergeProfessionalCatalog(TECHNICAL_EQUIPMENT_CATALOG, professionalCatalog),
);
