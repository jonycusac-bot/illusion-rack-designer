import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, Trash2, RotateCcw, 
  ChevronDown, LayoutList, 
  Wind, Thermometer, 
  ShieldCheck, EyeOff,
  MoveHorizontal,
  Fan,
  Film,
  Cable,
  Server,
  Zap,
  Wifi,
  Settings,
  Volume2,
  Monitor,
  Battery,
  Package,
  Download,
  Save,
  FolderOpen,
  FileText,
  X,
  Check,
  Edit3,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  HelpCircle,
  CheckCircle2,
  Layers,
  ArrowUpDown,
  User,
  LogIn,
  LogOut,
  Cloud,
  CloudOff,
  Mail,
  Lock,
  AlertCircle,
  Loader2
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import LoginPage from './components/LoginPage';
import { 
  auth, 
  onAuthStateChanged,
  logoutUser, 
  guardarProyectoEnFirestore, 
  cargarProyectosDeFirestore, 
  eliminarProyectoDeFirestore,
  testConnection 
} from './firebase';

// Icono Enchufe / Toma Schuko Redondeada (Estilo Flaticon 62931)
const RoundedSocketIcon = ({ size = 15, className = "text-indigo-400" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="9.5" />
    <circle cx="8.5" cy="12" r="1.5" fill="currentColor" stroke="none" />
    <circle cx="15.5" cy="12" r="1.5" fill="currentColor" stroke="none" />
    <path d="M12 2.5v2.5M12 19v2.5" strokeWidth="2.2" />
  </svg>
);

const EscobaIcon = ({ size = 15, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    {/* Mango de la escobilla / Brush handle */}
    <path d="M19 4L13 10" />
    <path d="M16 2L22 8" />
    {/* Base y cabezal del cepillo */}
    <path d="M8 12L15 15L12 18L5 15Z" fill="currentColor" fillOpacity="0.25" />
    {/* Cerdas densas / Brush bristles */}
    <path d="M6 16L3 21" />
    <path d="M8 16.5L6 22" />
    <path d="M10 17L9 22" />
    <path d="M12 17.5L12 22" />
    <path d="M14 16.5L15 21" />
  </svg>
);

// ── LOGOS DE MARCA VECTORIALES EN MINIATURA ──────────────────────
const BrandLogo = ({ brand, size = 12, className = "" }) => {
  if (!brand) return null;
  const b = brand.toLowerCase();
  
  // LOGO APPLE
  if (b.includes('apple')) {
    return (
      <svg width={size} height={size} viewBox="0 0 170 170" fill="currentColor" className={`shrink-0 ${className}`}>
        <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.6-7.8-11.71-14.28-5.44-8.68-9.74-18.91-12.91-30.68-3.16-11.77-4.75-23.01-4.75-33.72 0-14.54 3.73-26.65 11.2-36.34 7.46-9.69 16.9-14.65 28.32-14.88 4.9.11 10.1 1.25 15.6 3.42 5.51 2.18 9.38 3.32 11.63 3.44 1.9-.23 5.92-1.42 12.06-3.56 6.13-2.14 11.39-3.08 15.77-2.82 12.2.65 21.84 5.38 28.91 14.2-10.66 6.42-15.88 15.4-15.66 26.94.22 9.03 3.65 16.57 10.3 22.61 6.64 6.04 14.57 9.4 23.77 10.08-2.28 6.74-4.89 13.54-7.83 20.41zM119.22 31.84c0-7.39 2.67-14.25 8.01-20.59 5.34-6.33 11.96-10.23 19.86-11.7.98 7.39-1.47 14.47-7.35 21.24-5.88 6.78-12.72 10.46-20.52 11.05z" />
      </svg>
    );
  }

  // LOGO UNIFI
  if (b.includes('unifi') || b.includes('ubiquiti')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={`shrink-0 ${className}`}>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 15c-2.76 0-5-2.24-5-5V7h2.5v5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V7H17v5c0 2.76-2.24 5-5 5z" />
      </svg>
    );
  }

  // LOGO BANG & OLUFSEN (B&O)
  if (b.includes('b&o') || b.includes('beo') || b.includes('bang')) {
    return (
      <span className={`inline-flex items-center justify-center font-black tracking-tight text-[8px] px-1 py-0.2 rounded bg-white/20 text-white shrink-0 leading-none ${className}`}>
        B&amp;O
      </span>
    );
  }

  // LOGO SONOS
  if (b.includes('sonos')) {
    return (
      <span className={`inline-flex items-center justify-center font-black tracking-wider text-[7px] px-1 py-0.2 rounded bg-white/20 text-white shrink-0 leading-none ${className}`}>
        SONOS
      </span>
    );
  }

  // LOGO CRESTRON
  if (b.includes('crestron')) {
    return (
      <span className={`inline-flex items-center justify-center font-black tracking-wider text-[7px] px-1 py-0.2 rounded bg-white/20 text-white shrink-0 leading-none ${className}`}>
        CRESTRON
      </span>
    );
  }

  // LOGO D-LINK
  if (b.includes('d-link') || b.includes('dlink')) {
    return (
      <span className={`inline-flex items-center justify-center font-black tracking-tight text-[7px] px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-300 shrink-0 leading-none border border-emerald-500/30 ${className}`}>
        D-Link
      </span>
    );
  }

  // LOGO TP-LINK
  if (b.includes('tp-link') || b.includes('tplink')) {
    return (
      <span className={`inline-flex items-center justify-center font-black tracking-tight text-[7px] px-1 py-0.2 rounded bg-cyan-500/20 text-cyan-300 shrink-0 leading-none border border-cyan-500/30 ${className}`}>
        TP-Link
      </span>
    );
  }

  return null;
};

// Función auxiliar para detectar la marca según el nombre o id
const getBrandForEquipment = (item) => {
  if (!item) return null;
  const str = `${item.id || ''} ${item.nombre || ''}`.toLowerCase();
  if (str.includes('apple') || str.includes('appletv')) return 'apple';
  if (str.includes('unifi') || str.includes('ubiquiti')) return 'unifi';
  if (str.includes('b&o') || str.includes('beo') || str.includes('bang')) return 'b&o';
  if (str.includes('sonos')) return 'sonos';
  if (str.includes('crestron')) return 'crestron';
  if (str.includes('dlink') || str.includes('d-link')) return 'd-link';
  if (str.includes('tplink') || str.includes('tp-link')) return 'tp-link';
  return null;
};

/**
 * RackDesignerPro - Versión Cinema & Gestión de Cables
 * Ajuste: Sustitución de Lutron/KNX por Crestron RMC4 en Control.
 * Lógica PDU: 1 por cada 3.500W de consumo o 1 cada 6 equipos (el mayor).
 */

const CATALOGO_EQUIPOS = [
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
  
  // --- AUDIO (Ordenado Alfabéticamente) ---
  { id: 'beoamp2', nombre: 'B&O Beoamp2', altura: 44, esRackable: true, categoria: 'Audio', consumo: 300, fondo: 250 },
  { id: 'beocore', nombre: 'BeoCore (B&O)', altura: 44, esRackable: false, categoria: 'Audio', consumo: 50, fondo: 310, ancho: 'media', requiereTapaCiega: true },
  { id: 'matrix-audio', nombre: 'Matriz Audio 16x16', altura: 88, esRackable: true, categoria: 'Audio', consumo: 80, fondo: 350, requierePlacaCiega: true },
  { id: 'sonance-dsp', nombre: 'Sonance DSP 8-125', altura: 44, esRackable: true, categoria: 'Audio', consumo: 600, fondo: 425, requierePlacaCiega: true },
  { id: 'sonos-amp', nombre: 'Sonos Amp', altura: 88, esRackable: false, categoria: 'Audio', consumo: 100, ancho: 'media', requiereTapaCiega: true, fondo: 220 },
  { id: 'sonos-amp-multi', nombre: 'Sonos Amp Multi', altura: 88, esRackable: true, categoria: 'Audio', consumo: 200, fondo: 220, uOcupadas: 2, requierePlacaCiega: true },
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
  { id: 'ups-apc', nombre: 'SAI APC Smart-UPS 1500', altura: 88, esRackable: true, categoria: 'Energía', consumo: 0, fondo: 457, requierePlacaCiega: true },

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
];

const UNIDAD_RACK_MM = 44.45;
const PIXELS_PER_U = 50; 
// Modelos oficiales de rack marca Excell: 9U, 15U, 20U, 24U, 33U, 42U y 47U
const RACKS_COMERCIALES = [9, 15, 20, 24, 33, 42, 47];

const PASOS_GUIA = [
  {
    id: 'pestanas',
    titulo: 'Pestañas y Categorías',
    icono: LayoutList,
    color: '#38bdf8',
    badge: '1. Catálogo',
    subtitulo: 'Explora y filtra equipos organizados por familias de sistemas',
    descripcion: 'La barra lateral izquierda contiene el catálogo técnico de equipos Illusion organizados en 8 pestañas especializadas.',
    puntos: [
      'Haz clic sobre cualquier pestaña (Redes, Control, Audio, Video, Cinema, Energía, Otros, Accesorios) para desplegar u ocultar sus componentes.',
      'Los equipos se ordenan de forma alfabética para facilitar una búsqueda instantánea.',
      'Sistema de Auto-replegado: Las categorías se repliegan automáticamente tras unos segundos de inactividad para mantener la interfaz siempre limpia y optimizada.'
    ],
    ejemplo: 'Redes (UniFi, D-Link, Routers), Control (Crestron, Lutron), Audio (Sonos Amp, B&O, Triad), Video (Apple TV, Matrices), Cinema (Marantz, Integra), Accesorios (Pasacables, Regletas, Escobillas).'
  },
  {
    id: 'anadir',
    titulo: 'Cómo Añadir Equipos',
    icono: Plus,
    color: '#4ade80',
    badge: '2. Inserción',
    subtitulo: 'Monta equipos en el rack con 1 solo clic y agrupación automática',
    descripcion: 'Añadir elementos al bastidor es inmediato y cuenta con algoritmos de posicionamiento profesional.',
    puntos: [
      'Haz clic en el botón circular con el icono "+" o sobre la tarjeta del equipo en la librería.',
      'Auto-agrupación de Media Balda (1/2 U): Equipos compactos como Sonos Amp, UniFi Router Compact o Switch 8p D-Link se emparejan automáticamente de 2 en 2 en bandejas 1U.',
      'Ventilación Superior Automática: El sistema inserta rejillas de ventilación de 1U sobre las bandejas térmicas de Sonos Amp.',
      'Feedback Acústico: Cada equipo añadido reproduce un tono ascendente de confirmación.'
    ],
    ejemplo: 'Al pulsar sobre "Sonos Amp", si ya hay uno solo en balda, el nuevo se colocará a su derecha ocupando la misma unidad 1U.'
  },
  {
    id: 'reordenar',
    titulo: 'Desplazar Equipos (Arriba / Abajo)',
    icono: ArrowUpDown,
    color: '#818cf8',
    badge: '3. Reordenación',
    subtitulo: 'Ajusta la posición de tus equipos y ventilación intermedia',
    descripcion: 'Puedes reubicar la altura de cualquier equipo y ventilador intermedio en el rack:',
    puntos: [
      'Método 1 (Botones de Flechas ▲ / ▼): Pasa el ratón (hover) sobre cualquier equipo o usa las flechas del Ventilador Intermedio para subir o bajar su posición en el bastidor.',
      'Método 2 (Arrastrar y Soltar / Drag & Drop): Haz clic sostenido sobre cualquier equipo y arrástralo verticalmente a la posición deseada.',
      'La escala métrica en U (de 1U a 47U) se renumera al vuelo asegurando coherencia visual.'
    ],
    ejemplo: 'Usa las flechas para desplazar el ventilador intermedio justo encima o debajo de los equipos que mayor calor disipan.'
  },
  {
    id: 'eliminar',
    titulo: 'Eliminar y Reiniciar',
    icono: Trash2,
    color: '#f87171',
    badge: '4. Gestión',
    subtitulo: 'Retira elementos individuales o vacía el rack por completo',
    descripcion: 'Gestiona la retirada de componentes con total seguridad y rapidez:',
    puntos: [
      'Eliminación individual: Pasa el cursor sobre el equipo que deseas retirar en el rack y pulsa el icono de papelera roja.',
      'Sonido de borrado: Escucharás un suave tono descendente confirmando la extracción del equipo.',
      'Reiniciar Rack (↺): Pulsa el botón de reinicio en la barra superior para limpiar todos los equipos y comenzar un nuevo diseño desde cero.'
    ],
    ejemplo: 'Al borrar un equipo de una balda doble, la balda se reorganiza automáticamente o se libera la unidad U.'
  },
  {
    id: 'guardar',
    titulo: 'Guardar y Cargar Proyectos',
    icono: Save,
    color: '#fbbf24',
    badge: '5. Proyectos',
    subtitulo: 'Asigna nombres y almacena múltiples configuraciones de rack',
    descripcion: 'Todos tus diseños se guardan de forma permanente en la memoria de tu navegador:',
    puntos: [
      'Nombrar y Guardar: Haz clic en el nombre del proyecto en la barra superior o en el botón de guardar (💾).',
      'Escribe el nombre de tu instalación (ej: "Rack Villa Sol", "Rack Principal 42U") y pulsa "Guardar Proyecto".',
      'Cargar Proyectos: Pasa el ratón por el icono de carpeta (📂) para desplegar el historial de proyectos guardados y abrirlos al instante.'
    ],
    ejemplo: 'El nombre asignado se imprimirá como encabezado oficial en el informe PDF de materiales.'
  },
  {
    id: 'descargar',
    titulo: 'Descargar Lista de Materiales (PDF)',
    icono: Download,
    color: '#a855f7',
    badge: '6. Informe Oficial',
    subtitulo: 'Genera el informe técnico de ingeniería para instaladores y clientes',
    descripcion: 'Exporta un informe técnico completo en formato PDF con diseño corporativo Illusion:',
    puntos: [
      'Pulsa el botón "Descargar Materiales de Rack (PDF)" ubicado al pie del panel lateral derecho.',
      'Tabla 1 (Materiales): Cómputo de rack recomendado, regletas PDU traseras, pasacables, regletas frontales, baldas 1U y reforzadas, tornillería M6 y ventiladores.',
      'Tabla 2 (Equipos): Desglose de todos los equipos instalados con categoría, altura en U, consumo en W y cantidades.',
      'Prescripción Eléctrica: Cálculo exacto de líneas de 2,5 mm², magnetotérmicos de 16A y diferenciales 40A/30mA.'
    ],
    ejemplo: 'El PDF incluye membrete oficial, fecha y numeración de páginas listo para presupuesto o dirección de obra.'
  },
  {
    id: 'consumo',
    titulo: 'Consumo y Dimensionamiento',
    icono: Zap,
    color: '#eab308',
    badge: '7. Cálculo',
    subtitulo: 'Supervisa la potencia eléctrica y el tamaño comercial de rack',
    descripcion: 'El motor de cálculo analiza en tiempo real todas las variables de la instalación:',
    puntos: [
      'Indicador de Consumo (W): Muestra la potencia total acumulada en la barra superior.',
      'Rack Recomendado: Sugiere el tamaño comercial Excell óptimo (9U, 15U, 20U, 24U, 33U, 42U o 47U) con ventilador intermedio automático en modelos superiores a 24U (33U, 42U y 47U).',
      'Distribución Eléctrica: Calcula las PDUs traseras a razón de 1 regleta cada 8 tomas y las líneas de protección necesarias.'
    ],
    ejemplo: 'Si superas los 3680W, el sistema te recomendará automáticamente 2 o más líneas de alimentación independientes.'
  }
];

let sharedAudioCtx = null;

const initOrResumeAudio = () => {
  try {
    if (!sharedAudioCtx) {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      if (AudioCtxClass) {
        sharedAudioCtx = new AudioCtxClass();
      }
    }
    if (sharedAudioCtx && sharedAudioCtx.state === 'suspended') {
      sharedAudioCtx.resume().catch(() => {});
    }
  } catch (e) {
    console.warn('AudioContext init error:', e);
  }
  return sharedAudioCtx;
};

// Sonido de clic sutil y agradable al añadir equipo
const playClickSound = () => {
  try {
    const ctx = initOrResumeAudio();
    if (!ctx) return;
    
    // Si sigue suspendido, reanudar
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(550, now);
    osc.frequency.exponentialRampToValueAtTime(1050, now + 0.05);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.09);
  } catch (e) {
    console.warn('Audio click error:', e);
  }
};

// Sonido de eliminación sutil al retirar equipo
const playDeleteSound = () => {
  try {
    const ctx = initOrResumeAudio();
    if (!ctx) return;

    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(460, now);
    osc.frequency.exponentialRampToValueAtTime(160, now + 0.08);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.1);
  } catch (e) {
    console.warn('Audio delete error:', e);
  }
};

let instanceCounter = 0;
const createInstanceId = () => `inst_${Date.now()}_${++instanceCounter}`;

const createNewEquiposList = (prevEquipos, item) => {
  const uCalculadas = item.uOcupadas || Math.ceil(item.altura / UNIDAD_RACK_MM);
  const now = Date.now();
  const nuevoItem = { 
    ...item, 
    instanceId: createInstanceId(), 
    uOcupadas: uCalculadas,
    timestamp: now
  };
  
  // Patch Panel automático únicamente para Switches de red (sw-), no para routers como UDM Pro
  if (item.id.includes('sw-')) {
    const patchPanel = {
      id: 'patch-panel-auto',
      nombre: 'Patch Panel (Auto)',
      altura: 44,
      esRackable: true,
      categoria: 'Redes',
      consumo: 0,
      requiereEscobilla: false,
      fondo: 200,
      instanceId: createInstanceId(),
      uOcupadas: 1,
      timestamp: now + 1,
      esAutomatico: true
    };
    return [...prevEquipos, nuevoItem, patchPanel];
  }
  return [...prevEquipos, nuevoItem];
};

const esBaldaLigera = (eq) => ['sonos-amp', 'sonos-port', 'crestron-rmc4', 'beoliving', 'beocore', 'apple-tv', 'receptor-sat'].includes(eq.id);

const calcularRackCalculos = (equipos, posicionVentiladorIntermedio = null) => {
  let numEscobillas = 0;
  let numTapasAutomaticas = 0;
  let numTapasBalda = 0;
  let pasacablesTraseros = 0;
  const rackItems = [];
  const bloquesBaldas = [];

  const pendientesMedia = [];

  const procesarNoRackable = (eq) => {
    if (eq.ancho === 'media') {
      const indexPareja = pendientesMedia.findIndex(e => e.ancho === 'media');
      if (indexPareja !== -1) {
        pasacablesTraseros++;
        const pareja = pendientesMedia.splice(indexPareja, 1)[0];
        const tieneTapa = eq.requiereTapaCiega || pareja.requiereTapaCiega;
        const esSonosAmp = (e) => e.id === 'sonos-amp';
        const hayDosSonosAmp = esSonosAmp(eq) && esSonosAmp(pareja);
        const tapaCiegaFinal = hayDosSonosAmp ? false : tieneTapa;
        if (tapaCiegaFinal) numTapasBalda++;
        if (hayDosSonosAmp) numTapasBalda++;
        const bloque = {
          equipos: [pareja, eq],
          uTotal: Math.max(eq.uOcupadas, pareja.uOcupadas) + (tapaCiegaFinal ? 1 : 0) + (hayDosSonosAmp ? 1 : 0),
          tieneTapa: false,
          tieneTapaArriba: tapaCiegaFinal,
          tieneVentilacionArriba: hayDosSonosAmp
        };
        bloquesBaldas.push(bloque);
        rackItems.push({ __esBloque: true, bloque });
      } else {
        pendientesMedia.push(eq);
      }
    } else {
      pasacablesTraseros++;
      const tieneTapa = eq.requiereTapaCiega;
      if (tieneTapa) numTapasBalda++;
      const bloque = {
        equipos: [eq],
        uTotal: eq.uOcupadas + (tieneTapa ? 1 : 0),
        tieneTapa: false,
        tieneTapaArriba: tieneTapa,
        tieneVentilacionArriba: false
      };
      bloquesBaldas.push(bloque);
      rackItems.push({ __esBloque: true, bloque });
    }
  };

  equipos.forEach(eq => {
    if (eq.esRackable) {
      if (eq.categoria !== 'Accesorios') pasacablesTraseros++;
      if (eq.categoria === 'Cinema') {
        numTapasAutomaticas++;
        rackItems.push({
          instanceId: `ventilacion-cin-${eq.instanceId}`,
          nombre: `Rejilla de Ventilación (Cinema)`,
          categoria: 'Pasivo',
          uOcupadas: 1,
          tipoPasivo: 'Ventilacion'
        });
      }
      if (eq.requierePlacaCiega || eq.id === 'sonance-dsp' || eq.id === 'sonos-amp-multi' || eq.id === 'matrix-audio' || eq.id === 'ups-apc' || eq.nombre?.toLowerCase().includes('matriz audio') || eq.nombre?.toLowerCase().includes('sai') || eq.nombre?.toLowerCase().includes('smart-ups')) {
        numTapasAutomaticas++;
        rackItems.push({
          instanceId: `placa-auto-${eq.instanceId}`,
          nombre: `Placa Ciega 1U`,
          categoria: 'Accesorios',
          uOcupadas: 1,
          tipoPasivo: 'Ciego',
          esPlacaCiega: true,
          esAutomatico: true
        });
      }
      if (eq.requiereEscobilla) {
        const esRedes = eq.categoria === 'Redes';
        if (esRedes) numEscobillas++;
        rackItems.push({
          instanceId: `esc-${eq.instanceId}`,
          nombre: `Escobilla Pasacables`,
          categoria: 'Pasivo',
          uOcupadas: 1,
          tipoPasivo: 'Escobilla',
          esEscobilla: esRedes
        });
      }
      rackItems.push(eq);
    } else {
      procesarNoRackable(eq);
    }
  });

  pendientesMedia.forEach(eq => {
    pasacablesTraseros++;
    const tieneTapa = eq.requiereTapaCiega;
    if (tieneTapa) numTapasBalda++;
    const bloque = {
      equipos: [eq],
      uTotal: eq.uOcupadas + (tieneTapa ? 1 : 0),
      tieneTapa: false,
      tieneTapaArriba: tieneTapa,
      tieneVentilacionArriba: false
    };
    bloquesBaldas.push(bloque);
    rackItems.push({ __esBloque: true, bloque });
  });

  const infraestructuraSuperiorU = 1;
  const uDeEquiposTotal = rackItems.reduce((acc, item) => {
    if (item.__esBloque) return acc + item.bloque.uTotal;
    return acc + (item.uOcupadas || 0);
  }, 0);
  
  const consumoTotalCalc = equipos.reduce((sum, eq) => sum + (eq.consumo || 0), 0);
  const numEquiposTotal = equipos.length;
  const numRegletasTraseras = consumoTotalCalc === 0 ? (numEquiposTotal === 0 ? 0 : Math.ceil(numEquiposTotal / 6)) : Math.max(Math.ceil(consumoTotalCalc / 3500), Math.ceil(numEquiposTotal / 6));
  
  const totalUNecesariasFrontales = uDeEquiposTotal + infraestructuraSuperiorU;
  const rackRecomendado = RACKS_COMERCIALES.find(r => r >= totalUNecesariasFrontales) || 47;
  
  const numVentiladores = rackRecomendado <= 24 ? 1 : 2;
  const totalSlotsSinVentilador = rackItems.length;
  const posicionVentiladorPorDefecto = Math.floor(totalSlotsSinVentilador / 2);
  let posicionVentiladorActual = null;
  
  if (rackRecomendado > 24 && totalSlotsSinVentilador > 0) {
    posicionVentiladorActual = (typeof posicionVentiladorIntermedio === 'number' && !isNaN(posicionVentiladorIntermedio))
      ? Math.max(0, Math.min(totalSlotsSinVentilador, posicionVentiladorIntermedio))
      : posicionVentiladorPorDefecto;

    const ventiladorAdicional = {
      instanceId: 'ventilador-adicional-auto',
      nombre: 'Ventilador Intermedio 1U',
      categoria: 'Ventilacion',
      uOcupadas: 1,
      esVentiladorAdicional: true,
      posicionIndex: posicionVentiladorActual,
      totalSlots: totalSlotsSinVentilador
    };
    rackItems.splice(posicionVentiladorActual, 0, ventiladorAdicional);
  }
  
  const bandejasSonosAmp = bloquesBaldas.filter(bloque => bloque.tieneVentilacionArriba).length;
  const escobillasAccesorios = equipos.filter(e => e.id === 'escobilla-acc').length;
  const pasacablesFrontales = equipos.filter(e => e.id === 'pasacables-acc').length;
  const regletasFrontales = equipos.filter(e => e.id === 'regleta-acc').length;
  const totalBandejasVentilacion = numTapasAutomaticas + bandejasSonosAmp;
  
  const placasCiegasAccesorios = equipos.filter(e => 
    e.id === 'placa-ciega-1u' || e.id === 'placa-ciega-2u'
  ).length;

  const numBaldas1U = bloquesBaldas.filter(bloque =>
    bloque.equipos.some(e => esBaldaLigera(e))
  ).length;

  const numBaldasReforzadas = equipos.filter(e => e.categoria === 'Cinema').length;

  return {
    rackItems,
    bloquesBaldas,
    rackRecomendado,
    numRegletasTraseras,
    numRegletasFrontales: regletasFrontales,
    numPasacablesFrontales: pasacablesFrontales,
    totalUNecesariasFrontales,
    numTornillos: equipos.length * 4,
    consumoTotal: equipos.reduce((sum, eq) => sum + (eq.consumo || 0), 0),
    numLineasElectricas: Math.max(1, Math.ceil(equipos.reduce((sum, eq) => sum + (eq.consumo || 0), 0) / 3680)),
    numEscobillas: numEscobillas + escobillasAccesorios,
    numPlacasCiegas: numTapasBalda + numTapasAutomaticas + placasCiegasAccesorios,
    pasacablesTraseros,
    numVentiladores,
    bandejasSonosAmp,
    totalBandejasVentilacion,
    numBaldas1U,
    numBaldasReforzadas,
    posicionVentiladorPorDefecto,
    posicionVentiladorActual,
    totalSlotsSinVentilador
  };
};

export default function App() {
  const [nombreProyectoActual, setNombreProyectoActual] = useState('Nuevo Proyecto');
  const [equipos, setEquipos] = useState([]);
  const [posicionVentiladorIntermedio, setPosicionVentiladorIntermedio] = useState(null);
  const [categoriasAbiertas, setCategoriasAbiertas] = useState([]);
  const [mostrarModalGuardar, setMostrarModalGuardar] = useState(false);
  const [inputNombreProyecto, setInputNombreProyecto] = useState('Nuevo Proyecto');
  const [notificacionGuardado, setNotificacionGuardado] = useState(false);
  const [mostrarGuia, setMostrarGuia] = useState(false);
  const [pasoGuia, setPasoGuia] = useState(0);
  const [generandoPDF, setGenerandoPDF] = useState(false);
  const timerAutoReplegadoRef = useRef(null);
  const rackContainerRef = useRef(null);

  // Firebase Auth & Cloud Sync State
  const [usuario, setUsuario] = useState(null);
  const [cargandoAuth, setCargandoAuth] = useState(true);
  const [enDisenador, setEnDisenador] = useState(false);
  const [proyectosNube, setProyectosNube] = useState([]);
  const [cargandoProyectosNube, setCargandoProyectosNube] = useState(false);
  const [guardandoNube, setGuardandoNube] = useState(false);

  const refrescarProyectosNube = async (uid) => {
    if (!uid) return;
    setCargandoProyectosNube(true);
    try {
      const projs = await cargarProyectosDeFirestore(uid);
      setProyectosNube(projs || []);
    } catch (err) {
      console.error('Error al cargar proyectos de Firestore:', err);
    } finally {
      setCargandoProyectosNube(false);
    }
  };

  // Escuchar estado de autenticación de Firebase y probar conexión
  useEffect(() => {
    testConnection();
    const unsubscribe = onAuthStateChanged(auth, async (userActual) => {
      setUsuario(userActual);
      setCargandoAuth(false);
      if (userActual) {
        refrescarProyectosNube(userActual.uid);
      } else {
        setProyectosNube([]);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
      setUsuario(null);
      setEnDisenador(false);
      setNotificacionGuardado('Sesión cerrada correctamente');
      setTimeout(() => setNotificacionGuardado(false), 3500);
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
    }
  };

  // Atajos de teclado para la guía interactiva
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!mostrarGuia) return;
      if (e.key === 'Escape') {
        setMostrarGuia(false);
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        setPasoGuia((prev) => Math.min(PASOS_GUIA.length - 1, prev + 1));
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        setPasoGuia((prev) => Math.max(0, prev - 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mostrarGuia]);

  // Limpieza inicial y desbloqueo de audio
  useEffect(() => {
    // Desbloquear AudioContext con la primera interacción del usuario en la ventana
    const unlockAudio = () => {
      initOrResumeAudio();
    };
    window.addEventListener('pointerdown', unlockAudio, { once: true });
    window.addEventListener('keydown', unlockAudio, { once: true });

    // Limpiar proyectos con nombre antiguo si estuvieran presentes
    try {
      const proyectos = JSON.parse(localStorage.getItem('illusion-proyectos') || '[]');
      const proyectosFiltrados = proyectos.filter(p => !p.nombre.toLowerCase().includes('agotos'));
      if (proyectos.length !== proyectosFiltrados.length) {
        localStorage.setItem('illusion-proyectos', JSON.stringify(proyectosFiltrados));
      }
    } catch (e) {
      console.error('Error limpiando proyectos:', e);
    }

    return () => {
      window.removeEventListener('pointerdown', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
    };
  }, []);

  // Drag & drop state
  const dragIndexRef = useRef(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [draggingIndex, setDraggingIndex] = useState(null);

  // Auto-replegado de pestañas después de 10 segundos
  useEffect(() => {
    if (categoriasAbiertas.length > 0) {
      if (timerAutoReplegadoRef.current) {
        clearTimeout(timerAutoReplegadoRef.current);
      }
      
      timerAutoReplegadoRef.current = setTimeout(() => {
        setCategoriasAbiertas([]);
      }, 10000);
    }
    
    return () => {
      if (timerAutoReplegadoRef.current) {
        clearTimeout(timerAutoReplegadoRef.current);
      }
    };
  }, [categoriasAbiertas]);

  const toggleCategoria = (cat) => {
    setCategoriasAbiertas(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const agregarItem = (item) => {
    playClickSound();
    setEquipos(prev => createNewEquiposList(prev, item));
  };

  const eliminarItem = (id) => {
    playDeleteSound();
    setEquipos(prev => prev.filter(e => e.instanceId !== id));
  };

  // Drag & drop handlers para reordenar equipos en el rack
  const handleDragStart = (e, index) => {
    dragIndexRef.current = index;
    setDraggingIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    dragIndexRef.current = null;
    setDraggingIndex(null);
    setDragOverIndex(null);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragIndexRef.current !== null && dragIndexRef.current !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    const fromIndex = dragIndexRef.current;
    if (fromIndex === null || fromIndex === dropIndex) {
      setDragOverIndex(null);
      return;
    }
    setEquipos(prev => {
      const updated = [...prev];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(dropIndex, 0, moved);
      return updated;
    });
    dragIndexRef.current = null;
    setDragOverIndex(null);
  };

  const moverEquipo = (index, direccion) => {
    const nuevoIndex = index + direccion;
    if (nuevoIndex < 0 || nuevoIndex >= equipos.length) return;
    playClickSound();
    setEquipos(prev => {
      const updated = [...prev];
      const [moved] = updated.splice(index, 1);
      updated.splice(nuevoIndex, 0, moved);
      return updated;
    });
  };

  const moverVentiladorIntermedio = (direccion) => {
    const posActual = (typeof posicionVentiladorIntermedio === 'number' && !isNaN(posicionVentiladorIntermedio))
      ? posicionVentiladorIntermedio
      : (res.posicionVentiladorPorDefecto ?? 0);
    const maxPos = res.totalSlotsSinVentilador ?? 0;
    const nuevaPos = Math.max(0, Math.min(maxPos, posActual + direccion));
    playClickSound();
    setPosicionVentiladorIntermedio(nuevaPos);
  };

  // Funciones para guardar y cargar proyectos
  const abrirModalGuardar = () => {
    setInputNombreProyecto(nombreProyectoActual || 'Proyecto Rack');
    setMostrarModalGuardar(true);
  };

  const confirmarGuardarProyecto = async (e) => {
    if (e) e.preventDefault();
    const nombreFinal = inputNombreProyecto.trim() || 'Proyecto Rack';

    const proyecto = {
      equipos: equipos,
      posicionVentiladorIntermedio: posicionVentiladorIntermedio,
      nombre: nombreFinal,
      fecha: new Date().toISOString(),
      version: '2.1'
    };

    // Guardar en almacenamiento local como respaldo rápido
    const proyectosGuardados = JSON.parse(localStorage.getItem('illusion-proyectos') || '[]');
    const filtrados = proyectosGuardados.filter(p => p.nombre !== nombreFinal);
    localStorage.setItem('illusion-proyectos', JSON.stringify([proyecto, ...filtrados]));

    // Si el usuario está autenticado con Firebase, guardar en Firestore
    if (usuario) {
      setGuardandoNube(true);
      try {
        await guardarProyectoEnFirestore(usuario.uid, {
          nombre: nombreFinal,
          rackAltura: `${res.rackRecomendado}U`,
          elementos: equipos,
          posicionVentiladorIntermedio: posicionVentiladorIntermedio,
          consumoTotal: res.consumoTotal,
          pesoTotal: res.pesoTotal || 0,
          notas: `Guardado el ${new Date().toLocaleString('es-ES')}`
        });
        await refrescarProyectosNube(usuario.uid);
        setNotificacionGuardado(`☁️ Proyecto "${nombreFinal}" guardado en la nube`);
      } catch (err) {
        console.error('Error guardando en la nube:', err);
        setNotificacionGuardado(`Proyecto "${nombreFinal}" guardado localmente`);
      } finally {
        setGuardandoNube(false);
      }
    } else {
      setNotificacionGuardado(`Proyecto "${nombreFinal}" guardado localmente`);
    }

    setNombreProyectoActual(nombreFinal);
    setMostrarModalGuardar(false);
    setTimeout(() => setNotificacionGuardado(false), 3500);
  };

  const cargarProyecto = (proyecto) => {
    const listaEquipos = proyecto.equipos || proyecto.elementos || [];
    setEquipos(listaEquipos);
    setPosicionVentiladorIntermedio(typeof proyecto.posicionVentiladorIntermedio === 'number' ? proyecto.posicionVentiladorIntermedio : null);
    setNombreProyectoActual(proyecto.nombre);
    setNotificacionGuardado(`Proyecto "${proyecto.nombre}" cargado`);
    setTimeout(() => setNotificacionGuardado(false), 3000);
  };

  const obtenerProyectosGuardados = () => {
    return JSON.parse(localStorage.getItem('illusion-proyectos') || '[]');
  };

  const eliminarProyecto = (index) => {
    const proyectos = obtenerProyectosGuardados();
    proyectos.splice(index, 1);
    localStorage.setItem('illusion-proyectos', JSON.stringify(proyectos));
    setNotificacionGuardado('Proyecto local eliminado');
    setTimeout(() => setNotificacionGuardado(false), 2500);
  };

  const eliminarProyectoNube = async (projectId, e) => {
    if (e) e.stopPropagation();
    if (!usuario || !projectId) return;
    try {
      await eliminarProyectoDeFirestore(usuario.uid, projectId);
      await refrescarProyectosNube(usuario.uid);
      setNotificacionGuardado('☁️ Proyecto eliminado de la nube');
      setTimeout(() => setNotificacionGuardado(false), 2500);
    } catch (err) {
      console.error('Error eliminando proyecto en la nube:', err);
    }
  };

  // Función para descargar informe en PDF profesional con alzado visual vector CAD de alta precisión
  const descargarMaterialesRackPDF = () => {
    setGenerandoPDF(true);
    try {
      const fecha = new Date().toLocaleDateString('es-ES');
      const hora = new Date().toLocaleTimeString('es-ES');

      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const primaryColor = [15, 23, 42]; // Slate 900
      const indigoAccent = [79, 70, 229]; // Indigo 600
      const lightBg = [248, 250, 252]; // Slate 50

      // ─────────────────────────────────────────────────────────────
      // PÁGINA 1: RESUMEN TÉCNICO, BOM DE INFRAESTRUCTURA & ELÉCTRICO
      // ─────────────────────────────────────────────────────────────
      // Header Superior
      doc.setFillColor(...primaryColor);
      doc.rect(0, 0, 210, 32, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.setTextColor(255, 255, 255);
      doc.text('ILLUSION RACK DESIGNER', 14, 14);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(199, 210, 254);
      doc.text('LISTADO DE MATERIALES & INFRAESTRUCTURA DE RACK', 14, 21);

      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text(`PROYECTO: ${(nombreProyectoActual || 'PROYECTO RACK').toUpperCase()}   |   FECHA: ${fecha} - ${hora}`, 14, 27);

      // Caja de Resumen del Rack
      doc.setFillColor(...lightBg);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(14, 32, 182, 21, 2, 2, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(...primaryColor);
      doc.text('RESUMEN TÉCNICO DEL RACK', 19, 38);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(71, 85, 105);

      const hayEquiposRed = equipos.some(eq => 
        eq.categoria === 'Redes' || 
        eq.nombre?.toLowerCase().includes('switch') || 
        eq.nombre?.toLowerCase().includes('router') || 
        eq.nombre?.toLowerCase().includes('unifi') || 
        eq.nombre?.toLowerCase().includes('dream machine')
      );
      const lineasTotales = hayEquiposRed ? res.numLineasElectricas + 1 : res.numLineasElectricas;

      doc.text(`• Rack Recomendado: ${res.rackRecomendado}U`, 19, 44);
      doc.text(`• Unidades Ocupadas: ${res.totalUNecesariasFrontales}U`, 19, 49.5);
      doc.text(`• Unidades Libres: ${res.rackRecomendado - res.totalUNecesariasFrontales}U`, 78, 44);
      doc.text(`• Consumo Total: ${res.consumoTotal} W`, 78, 49.5);
      doc.text(`• Regletas PDU: ${res.numRegletasTraseras}`, 138, 44);
      doc.text(`• Líneas Eléctricas: ${lineasTotales} (2,5mm²)`, 138, 49.5);

      // Tabla 1: Resumen de Cantidades / Materiales (BOM de Infraestructura)
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10.5);
      doc.setTextColor(...primaryColor);
      doc.text('1. RESUMEN DE CANTIDADES (MATERIALES DE INFRAESTRUCTURA)', 14, 66);

      const materialesFilas = [
        [`Rack Excell ${res.rackRecomendado}U`, 'x1', 'XXXXX'],
        ['Regletas PDU (Traseras)', `x${res.numRegletasTraseras}`, 'XXXXX']
      ];

      if (res.numRegletasFrontales > 0) {
        materialesFilas.push(['Regletas de conexión 1U (Frontales)', `x${res.numRegletasFrontales}`, 'XXXXX']);
      }

      materialesFilas.push(
        ['Pasacables posteriores', `x${res.pasacablesTraseros}`, 'XXXXX']
      );

      if (res.numPasacablesFrontales > 0) {
        materialesFilas.push(['Pasacables 1U (Frontales)', `x${res.numPasacablesFrontales}`, 'XXXXX']);
      }

      materialesFilas.push(
        ['Escobillas pasacables', `x${res.numEscobillas}`, 'XXXXX'],
        ['Patch Panels automáticos', `x${equipos.filter(e => e.esAutomatico).length}`, 'XXXXX']
      );

      if (res.numPlacasCiegas > 0) {
        materialesFilas.push(['Placas ciegas 1U (reserva / baldas)', `x${res.numPlacasCiegas}`, 'XXXXX']);
      }

      materialesFilas.push(
        ['Tornillos M6 (Bolsa/Juego)', `x${res.numTornillos}`, 'XXXXX']
      );

      if (res.numBaldas1U > 0) {
        materialesFilas.push(['Baldas 1U fijas', `x${res.numBaldas1U}`, 'XXXXX']);
      }
      if (res.numBaldasReforzadas > 0) {
        materialesFilas.push(['Baldas reforzadas (equipos pesados)', `x${res.numBaldasReforzadas}`, 'XXXXX']);
      }

      materialesFilas.push(['Termostato digital regulable', 'x1', 'XXXXX']);
      materialesFilas.push(['Unidad de ventilación superior', 'x1', 'XXXXX']);

      if (res.rackRecomendado > 24) {
        materialesFilas.push(['Unidad de ventilación intermedia', 'x1', 'XXXXX']);
      }

      autoTable(doc, {
        startY: 71,
        head: [[
          { content: 'ELEMENTO / INFRAESTRUCTURA', styles: { halign: 'left' } },
          { content: 'CANTIDAD', styles: { halign: 'center' } },
          { content: 'CÓDIGO ODOO', styles: { halign: 'center' } }
        ]],
        body: materialesFilas,
        theme: 'grid',
        headStyles: {
          fillColor: indigoAccent,
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 8.5
        },
        bodyStyles: {
          fontSize: 8,
          textColor: [30, 41, 59]
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252]
        },
        columnStyles: {
          0: { cellWidth: 105, fontStyle: 'bold', halign: 'left' },
          1: { cellWidth: 32, halign: 'center', fontStyle: 'bold', textColor: indigoAccent },
          2: { cellWidth: 45, halign: 'center', fontStyle: 'bold', textColor: [100, 116, 139] }
        },
        margin: { left: 14, right: 14 }
      });

      // 2. Sección dedicada: INSTALACIÓN ELÉCTRICA
      const posYElectrica = doc.lastAutoTable.finalY + 9;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10.5);
      doc.setTextColor(...primaryColor);
      doc.text('2. INSTALACIÓN ELÉCTRICA', 14, posYElectrica);

      const amperiosEstimados = (res.consumoTotal / 230).toFixed(1);

      const electricasFilas = [
        [
          'Líneas eléctricas dedicadas 2,5 mm²',
          `x${lineasTotales}`,
          hayEquiposRed 
            ? 'Tirada directa desde cuadro general / SAI (incluye +1 línea extra para Redes)'
            : 'Tirada directa desde cuadro general / SAI'
        ],
        [
          'Magnetotérmicos 16A (Curva C)',
          `x${lineasTotales}`,
          hayEquiposRed
            ? `Protección individual por cada línea del rack (${res.numLineasElectricas} Rack + 1 Redes)`
            : 'Protección individual por cada línea del rack'
        ],
        [
          'Diferenciales 40A / 30mA',
          `x${lineasTotales}`,
          'Protección diferencial de alta inmunidad'
        ],
        [
          'Potencia Total Estimada',
          `${res.consumoTotal} W (~${amperiosEstimados} A)`,
          'Suma de consumos a 230V monofásico'
        ]
      ];

      autoTable(doc, {
        startY: posYElectrica + 4,
        head: [[
          { content: 'COMPONENTE / PROTECCIÓN ELÉCTRICA', styles: { halign: 'left' } },
          { content: 'CANTIDAD / VALOR', styles: { halign: 'center' } },
          { content: 'ESPECIFICACIÓN / PRESCRIPCIÓN', styles: { halign: 'left' } }
        ]],
        body: electricasFilas,
        theme: 'grid',
        headStyles: {
          fillColor: [217, 119, 6], // Amber 600
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 8.5
        },
        bodyStyles: {
          fontSize: 8,
          textColor: [30, 41, 59]
        },
        alternateRowStyles: {
          fillColor: [254, 252, 232] // Light yellow
        },
        columnStyles: {
          0: { cellWidth: 70, fontStyle: 'bold', halign: 'left' },
          1: { cellWidth: 38, halign: 'center', fontStyle: 'bold', textColor: [180, 83, 9] },
          2: { cellWidth: 74, halign: 'left', textColor: [71, 85, 105] }
        },
        margin: { left: 14, right: 14 }
      });

      // 3. Tabla: Listado de Equipos Instalados (Hardware / Dispositivos activos)
      const posYEquipos = doc.lastAutoTable.finalY + 9;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10.5);
      doc.setTextColor(...primaryColor);
      doc.text('3. EQUIPOS INSTALADOS EN EL RACK', 14, posYEquipos);

      const conteoEquipos = {};
      const equiposActivos = equipos.filter(eq => 
        !eq.esAutomatico && 
        !eq.esAccesorio && 
        eq.categoria !== 'Accesorios' && 
        eq.categoria !== 'Pasivo' &&
        !eq.id?.includes('placa-ciega') &&
        !eq.nombre?.toLowerCase().includes('placa ciega') &&
        !eq.id?.includes('escobilla') &&
        !eq.id?.includes('pasacables') &&
        !eq.id?.includes('regleta')
      );

      equiposActivos.forEach(eq => {
        if (!conteoEquipos[eq.nombre]) {
          conteoEquipos[eq.nombre] = { count: 0, cat: eq.categoria, u: eq.uOcupadas || 1, pot: eq.consumo || 0 };
        }
        conteoEquipos[eq.nombre].count += 1;
      });

      const equiposFilas = Object.entries(conteoEquipos).map(([nombre, d]) => [
        nombre,
        d.cat || 'General',
        `${d.u}U`,
        `${d.pot} W`,
        `x${d.count}`
      ]);

      autoTable(doc, {
        startY: posYEquipos + 4,
        head: [[
          { content: 'EQUIPO / MODELO', styles: { halign: 'left' } },
          { content: 'CATEGORÍA', styles: { halign: 'left' } },
          { content: 'ALTURA', styles: { halign: 'center' } },
          { content: 'POTENCIA', styles: { halign: 'center' } },
          { content: 'CANTIDAD', styles: { halign: 'center' } }
        ]],
        body: equiposFilas.length > 0 ? equiposFilas : [['No hay equipos en el rack', '-', '-', '-', '-']],
        theme: 'striped',
        headStyles: {
          fillColor: primaryColor,
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 8.5
        },
        bodyStyles: {
          fontSize: 8,
          textColor: [30, 41, 59]
        },
        columnStyles: {
          0: { cellWidth: 78, fontStyle: 'bold', halign: 'left' },
          1: { cellWidth: 38, halign: 'left' },
          2: { cellWidth: 20, halign: 'center' },
          3: { cellWidth: 22, halign: 'center' },
          4: { cellWidth: 24, halign: 'center', fontStyle: 'bold', textColor: indigoAccent }
        },
        margin: { left: 14, right: 14 }
      });

      // Notas finales
      const posYNotas = doc.lastAutoTable.finalY + 7;
      if (posYNotas < 260) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(...primaryColor);
        doc.text('NOTAS PARA EL INSTALADOR:', 14, posYNotas);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(71, 85, 105);
        doc.text(`• Alimentación Eléctrica: ${lineasTotales} línea(s) de 2,5 mm² con magnetotérmicos 16A y diferenciales 40A/30mA${hayEquiposRed ? ' (incluye 1 línea independiente exclusiva para Redes/IT)' : ''}.`, 14, posYNotas + 4.5);
        doc.text('• Regletas PDU: Distribuir uniformemente en la parte posterior del rack.', 14, posYNotas + 8.5);
        doc.text(`• Climatización: Termostato digital en parte superior + ventilador(es) (${res.rackRecomendado <= 24 ? 'superior' : 'superior e intermedio'}).`, 14, posYNotas + 12.5);
      }

      // ─────────────────────────────────────────────────────────────
      // PÁGINA 2: ALZADO FRONTAL & ELEVACIÓN VISUAL DEL RACK (19")
      // ─────────────────────────────────────────────────────────────
      doc.addPage();

      // Header Página 2
      doc.setFillColor(...primaryColor);
      doc.rect(0, 0, 210, 32, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.setTextColor(255, 255, 255);
      doc.text('ILLUSION RACK DESIGNER', 14, 14);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(199, 210, 254);
      doc.text('ALZADO FRONTAL & ELEVACIÓN TÉCNICA DEL BASTIDOR (19")', 14, 21);

      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text(`BASTIDOR: EXCELL ${res.rackRecomendado}U (EIA-310-D)   |   OCUPACIÓN: ${res.totalUNecesariasFrontales}U (${((res.totalUNecesariasFrontales/res.rackRecomendado)*100).toFixed(0)}%)   |   POTENCIA: ${res.consumoTotal} W`, 14, 27);

      // ═════════════════════════════════════════════════════════════
      // RENDERIZADO VECTORIAL DEL RACK 19" (EXCELL ARCHITECTURAL CAD)
      // ═════════════════════════════════════════════════════════════
      const totalRackU = res.rackRecomendado || 20;
      const rackX = 14;
      const rackY = 36;
      const rackW = 96;
      const railW = 6;
      const equipW = rackW - (railW * 2); // 84mm
      const equipX = rackX + railW; // 20mm
      const headerH = 6;
      const footerH = 6;
      const usableH = 232 - headerH - footerH; // 220mm
      const uHeight = usableH / totalRackU;

      // 1. Estructura Exterior del Rack
      doc.setFillColor(15, 17, 23); // Chasis negro azabache
      doc.roundedRect(rackX - 1, rackY, rackW + 2, 232, 2, 2, 'F');
      doc.setDrawColor(79, 70, 229); // Borde azul índigo
      doc.setLineWidth(0.4);
      doc.roundedRect(rackX - 1, rackY, rackW + 2, 232, 2, 2, 'D');

      // 2. Cabecera Mecánica Superior
      doc.setFillColor(24, 27, 36);
      doc.rect(rackX, rackY, rackW, headerH, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.5);
      doc.setTextColor(148, 163, 184);
      doc.text(`BASTIDOR EXCELL 19" • ${totalRackU}U`, rackX + rackW / 2, rackY + 4.2, { align: 'center' });

      // 3. Raíles de Montaje EIA-310-D Izquierdo y Derecho
      const drawRails = () => {
        // Raíl Izquierdo
        doc.setFillColor(30, 34, 45);
        doc.rect(rackX, rackY + headerH, railW, usableH, 'F');
        // Raíl Derecho
        doc.rect(rackX + rackW - railW, rackY + headerH, railW, usableH, 'F');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(4.8);
        
        for (let u = 1; u <= totalRackU; u++) {
          const uY = rackY + headerH + ((totalRackU - u) * uHeight);
          // Separadores de U
          doc.setDrawColor(51, 65, 85);
          doc.setLineWidth(0.15);
          doc.line(rackX, uY, rackX + railW, uY);
          doc.line(rackX + rackW - railW, uY, rackX + rackW, uY);

          // Número de U (de 1 a totalRackU)
          doc.setTextColor(199, 210, 254);
          doc.text(`${u}U`, rackX + 1.2, uY + (uHeight * 0.65));
          doc.text(`${u}U`, rackX + rackW - railW + 1.2, uY + (uHeight * 0.65));

          // Orificios de tornillo M6 (3 puntos por U)
          doc.setFillColor(71, 85, 105);
          const dotRadius = 0.35;
          const leftDotX = rackX + railW - 1.2;
          const rightDotX = rackX + rackW - railW + 1.2;
          
          doc.circle(leftDotX, uY + (uHeight * 0.2), dotRadius, 'F');
          doc.circle(leftDotX, uY + (uHeight * 0.5), dotRadius, 'F');
          doc.circle(leftDotX, uY + (uHeight * 0.8), dotRadius, 'F');

          doc.circle(rightDotX, uY + (uHeight * 0.2), dotRadius, 'F');
          doc.circle(rightDotX, uY + (uHeight * 0.5), dotRadius, 'F');
          doc.circle(rightDotX, uY + (uHeight * 0.8), dotRadius, 'F');
        }
      };
      drawRails();

      // 4. Renderizado Secuencial de Equipos, Módulos e Infraestructura
      let currentUnitPointer = totalRackU; // Va desde totalRackU bajando hasta 1

      // A) Ventiladores Superiores (1U)
      const topFanY = rackY + headerH + ((totalRackU - currentUnitPointer) * uHeight);
      doc.setFillColor(20, 24, 38);
      doc.rect(equipX, topFanY, equipW, uHeight, 'F');
      doc.setDrawColor(59, 130, 246);
      doc.setLineWidth(0.2);
      doc.rect(equipX, topFanY, equipW, uHeight, 'D');

      // Grilla de ventiladores
      doc.setFillColor(37, 99, 235);
      doc.circle(equipX + 14, topFanY + (uHeight / 2), Math.min(uHeight * 0.35, 2.5), 'FD');
      doc.circle(equipX + equipW - 14, topFanY + (uHeight / 2), Math.min(uHeight * 0.35, 2.5), 'FD');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(Math.min(uHeight * 0.65, 6.5));
      doc.setTextColor(96, 165, 250);
      doc.text('UNIDAD DE VENTILACIÓN SUPERIOR (1U)', equipX + (equipW / 2), topFanY + (uHeight * 0.65), { align: 'center' });
      currentUnitPointer -= 1;

      // B) Termostato Digital (1U)
      const thermoY = rackY + headerH + ((totalRackU - currentUnitPointer) * uHeight);
      doc.setFillColor(18, 20, 29);
      doc.rect(equipX, thermoY, equipW, uHeight, 'F');
      doc.setDrawColor(245, 158, 11);
      doc.setLineWidth(0.2);
      doc.rect(equipX, thermoY, equipW, uHeight, 'D');
      // Display termostato
      doc.setFillColor(10, 15, 20);
      doc.roundedRect(equipX + (equipW / 2) - 18, thermoY + 1, 36, Math.max(uHeight - 2, 3), 0.5, 0.5, 'FD');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(Math.min(uHeight * 0.6, 6));
      doc.setTextColor(251, 191, 36);
      doc.text('TERMOSTATO DIGITAL 1U', equipX + (equipW / 2), thermoY + (uHeight * 0.65), { align: 'center' });
      currentUnitPointer -= 1;

      // C) Equipos del Rack (desde res.rackItems)
      const getCategoryColor = (cat) => {
        switch (cat) {
          case 'Redes': return { bg: [51, 65, 85], text: [255, 255, 255], border: [100, 116, 139] };
          case 'Control': return { bg: [5, 150, 105], text: [255, 255, 255], border: [52, 211, 153] }; // Esmeralda / Jade
          case 'Audio': return { bg: [30, 64, 175], text: [255, 255, 255], border: [96, 165, 250] };
          case 'Video': return { bg: [109, 40, 217], text: [255, 255, 255], border: [192, 132, 252] };
          case 'Cinema': return { bg: [159, 18, 57], text: [255, 255, 255], border: [251, 113, 133] };
          case 'Energía': return { bg: [194, 65, 12], text: [255, 255, 255], border: [251, 146, 60] };
          case 'Otros': return { bg: [82, 82, 91], text: [255, 255, 255], border: [161, 161, 170] };
          default: return { bg: [30, 41, 59], text: [255, 255, 255], border: [71, 85, 105] };
        }
      };

      res.rackItems.forEach((item) => {
        if (currentUnitPointer <= 0) return;

        // Caso 1: Bloque de Balda con equipos no rackables
        if (item.__esBloque) {
          const b = item.bloque;
          const uEquipos = Math.max(1, (b.uTotal - (b.tieneTapaArriba ? 1 : 0) - (b.tieneVentilacionArriba ? 1 : 0) - (b.tieneTapa ? 1 : 0)));

          // 1.1) Si tiene Placa Ciega / Ventilación arriba (1U)
          if (b.tieneVentilacionArriba || b.tieneTapaArriba) {
            const blindY = rackY + headerH + ((totalRackU - currentUnitPointer) * uHeight);
            doc.setFillColor(15, 18, 26);
            doc.rect(equipX, blindY, equipW, uHeight, 'F');
            doc.setDrawColor(45, 52, 70);
            doc.setLineWidth(0.2);
            doc.rect(equipX, blindY, equipW, uHeight, 'D');

            // Tornillos M6
            doc.setFillColor(199, 210, 254);
            doc.circle(equipX + 1.2, blindY + (uHeight / 2), 0.4, 'F');
            doc.circle(equipX + equipW - 1.2, blindY + (uHeight / 2), 0.4, 'F');

            // Texto placa ciega
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(Math.min(uHeight * 0.55, 5.5));
            doc.setTextColor(148, 163, 184);
            doc.text('PLACA CIEGA 1U', equipX + (equipW / 2), blindY + (uHeight * 0.63), { align: 'center' });

            currentUnitPointer -= 1;
          }

          // 1.2) Cuerpo de la Balda (con la altura exacta de los equipos, ej: 2U para Sonos Amp, 1U para Sonos Port)
          if (currentUnitPointer > 0) {
            const blockH = uEquipos * uHeight;
            const blockY = rackY + headerH + ((totalRackU - currentUnitPointer) * uHeight);

            // Fondo balda de soporte de acero
            doc.setFillColor(20, 24, 33);
            doc.rect(equipX, blockY, equipW, blockH, 'F');
            doc.setDrawColor(71, 85, 105);
            doc.setLineWidth(0.2);
            doc.rect(equipX, blockY, equipW, blockH, 'D');

            // Tornillos M6 en los anclajes de la balda
            doc.setFillColor(199, 210, 254);
            doc.circle(equipX + 1.2, blockY + (blockH / 2), 0.4, 'F');
            doc.circle(equipX + equipW - 1.2, blockY + (blockH / 2), 0.4, 'F');

            // Sub-equipos dentro de la balda
            const numEq = b.equipos.length;
            const subEqW = (equipW - ((numEq + 1) * 2)) / numEq;

            b.equipos.forEach((eq, eqIdx) => {
              const subX = equipX + 2 + (eqIdx * (subEqW + 2));
              const subY = blockY + 1.5;
              const subH = blockH - 3;
              const colors = getCategoryColor(eq.categoria);

              doc.setFillColor(...colors.bg);
              doc.roundedRect(subX, subY, subEqW, subH, 0.8, 0.8, 'F');
              doc.setDrawColor(...colors.border);
              doc.setLineWidth(0.15);
              doc.roundedRect(subX, subY, subEqW, subH, 0.8, 0.8, 'D');

              // LED Status
              doc.setFillColor(52, 211, 153);
              doc.circle(subX + 2.5, subY + (subH / 2), 0.4, 'F');

              // Texto equipo balda - legible y de alto contraste
              doc.setFont('helvetica', 'bold');
              const subFontSize = totalRackU > 32 ? 5.5 : 6.5;
              doc.setFontSize(subFontSize);
              doc.setTextColor(255, 255, 255);
              doc.text((eq.nombre || 'Dispositivo').toUpperCase(), subX + (subEqW / 2), subY + (subH / 2) + 0.9, { align: 'center', maxWidth: subEqW - 4 });
            });

            currentUnitPointer -= uEquipos;
          }

          // 1.3) Si tiene Placa Ciega abajo (1U)
          if (b.tieneTapa && currentUnitPointer > 0) {
            const blindY = rackY + headerH + ((totalRackU - currentUnitPointer) * uHeight);
            doc.setFillColor(15, 18, 26);
            doc.rect(equipX, blindY, equipW, uHeight, 'F');
            doc.setDrawColor(45, 52, 70);
            doc.setLineWidth(0.2);
            doc.rect(equipX, blindY, equipW, uHeight, 'D');

            doc.setFillColor(199, 210, 254);
            doc.circle(equipX + 1.2, blindY + (uHeight / 2), 0.4, 'F');
            doc.circle(equipX + equipW - 1.2, blindY + (uHeight / 2), 0.4, 'F');

            doc.setFont('helvetica', 'bold');
            doc.setFontSize(totalRackU > 32 ? 5.5 : 6.5);
            doc.setTextColor(203, 213, 225);
            doc.text('PLACA CIEGA 1U', equipX + (equipW / 2), blindY + (uHeight / 2) + 0.9, { align: 'center' });

            currentUnitPointer -= 1;
          }
        } 
        // Caso 2: Equipo Rackable Estándar o Pasivo
        else {
          const uOcupadas = item.uOcupadas || 1;
          const itemH = uOcupadas * uHeight;
          const itemY = rackY + headerH + ((totalRackU - currentUnitPointer) * uHeight);

          const esPlacaCiega = item.id?.includes('placa-ciega') || item.nombre?.toLowerCase().includes('placa ciega');
          const esRejillaVent = item.id?.includes('ventilacion') || item.nombre?.toLowerCase().includes('ventilación') || item.tipoPasivo === 'Ventilacion';
          const esEscobilla = item.id?.includes('esc') || item.nombre?.toLowerCase().includes('escobilla') || item.tipoPasivo === 'Escobilla';
          const esPasacables = item.id?.includes('pasacables') || item.nombre?.toLowerCase().includes('pasacables');
          const isPassiveOrAccessory = item.categoria === 'Pasivo' || item.categoria === 'Accesorios' || item.esAutomatico || item.esAccesorio || esPlacaCiega || esRejillaVent || esEscobilla || esPasacables;

          // Si es Placa Ciega (manual o automática, 1U o 2U)
          if (esPlacaCiega) {
            doc.setFillColor(15, 18, 26);
            doc.rect(equipX, itemY, equipW, itemH, 'F');
            doc.setDrawColor(45, 52, 70);
            doc.setLineWidth(0.2);
            doc.rect(equipX, itemY, equipW, itemH, 'D');

            // Tornillos frontales M6 en las orejas
            doc.setFillColor(199, 210, 254);
            doc.circle(equipX + 1.2, itemY + (itemH / 2), 0.4, 'F');
            doc.circle(equipX + equipW - 1.2, itemY + (itemH / 2), 0.4, 'F');

            // Texto placa ciega centrado, nítido y claro
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(totalRackU > 32 ? 5.5 : 6.5);
            doc.setTextColor(203, 213, 225);
            doc.text((item.nombre || 'PLACA CIEGA 1U').toUpperCase(), equipX + (equipW / 2), itemY + (itemH / 2) + 0.9, { align: 'center' });

            currentUnitPointer -= uOcupadas;
          }
          // Si es Rejilla de Ventilación / Escobilla / Pasacables pasivo:
          else if (isPassiveOrAccessory && (esRejillaVent || esEscobilla || esPasacables)) {
            doc.setFillColor(18, 22, 32);
            doc.rect(equipX, itemY, equipW, itemH, 'F');
            doc.setDrawColor(51, 65, 85);
            doc.setLineWidth(0.2);
            doc.rect(equipX, itemY, equipW, itemH, 'D');

            // Tornillos M6
            doc.setFillColor(199, 210, 254);
            doc.circle(equipX + 1.2, itemY + (itemH / 2), 0.4, 'F');
            doc.circle(equipX + equipW - 1.2, itemY + (itemH / 2), 0.4, 'F');

            doc.setFont('helvetica', 'bold');
            doc.setFontSize(totalRackU > 32 ? 5.5 : 6.5);
            doc.setTextColor(203, 213, 225);
            doc.text((item.nombre || 'ACCESORIO DE GESTIÓN').toUpperCase(), equipX + (equipW / 2), itemY + (itemH / 2) + 0.9, { align: 'center' });

            currentUnitPointer -= uOcupadas;
          }
          // Equipos activos estándar
          else {
            const colors = getCategoryColor(item.categoria);

            // Fondo equipo
            doc.setFillColor(...colors.bg);
            doc.rect(equipX, itemY, equipW, itemH, 'F');
            doc.setDrawColor(...colors.border);
            doc.setLineWidth(0.2);
            doc.rect(equipX, itemY, equipW, itemH, 'D');

            // Tornillos frontales M6 en las orejas
            doc.setFillColor(199, 210, 254);
            doc.circle(equipX + 1.2, itemY + (itemH / 2), 0.4, 'F');
            doc.circle(equipX + equipW - 1.2, itemY + (itemH / 2), 0.4, 'F');

            // Indicador LED de alimentación
            doc.setFillColor(34, 197, 94); // Green LED
            doc.circle(equipX + 3.8, itemY + (itemH / 2), 0.5, 'F');

            // Nombre del Equipo (Centrado y claramente legible)
            doc.setFont('helvetica', 'bold');
            const calculatedFontSize = uOcupadas > 1 ? 8 : (totalRackU > 32 ? 6.2 : 7.2);
            doc.setFontSize(calculatedFontSize);
            doc.setTextColor(255, 255, 255);
            doc.text((item.nombre || 'Equipo').toUpperCase(), equipX + (equipW / 2), itemY + (itemH / 2) + (calculatedFontSize * 0.12), { align: 'center', maxWidth: equipW - 14 });

            currentUnitPointer -= uOcupadas;
          }
        }
      });

      // D) Unidades Libres / Vacantes restantes
      while (currentUnitPointer > 0) {
        const freeY = rackY + headerH + ((totalRackU - currentUnitPointer) * uHeight);
        doc.setFillColor(11, 13, 19);
        doc.rect(equipX, freeY, equipW, uHeight, 'F');
        doc.setDrawColor(30, 41, 59);
        doc.setLineWidth(0.15);
        doc.rect(equipX, freeY, equipW, uHeight, 'D');

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(Math.min(uHeight * 0.45, 4.5));
        doc.setTextColor(71, 85, 105);
        doc.text(`[ ${currentUnitPointer}U DISPONIBLE / RESERVA ]`, equipX + (equipW / 2), freeY + (uHeight * 0.65), { align: 'center' });
        currentUnitPointer -= 1;
      }

      // 5. Zócalo / Base Mecánica Inferior
      const footerY = rackY + headerH + usableH;
      doc.setFillColor(24, 27, 36);
      doc.rect(rackX, footerY, rackW, footerH, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(5.5);
      doc.setTextColor(148, 163, 184);
      doc.text('EXCELL HEAVY-DUTY BASE • NIVELADORES DE PRECISIÓN', rackX + (rackW / 2), footerY + 4, { align: 'center' });

      // ═════════════════════════════════════════════════════════════
      // COLUMNA DERECHA: ESPECIFICACIONES, LEYENDA & APROBACIÓN
      // ═════════════════════════════════════════════════════════════
      const rightColX = 114;
      const rightColW = 82;

      // Bloque 1: Especificaciones del Bastidor
      doc.setFillColor(...lightBg);
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.2);
      doc.roundedRect(rightColX, 36, rightColW, 46, 2, 2, 'FD');

      doc.setFillColor(...indigoAccent);
      doc.roundedRect(rightColX, 36, rightColW, 7, 2, 2, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(255, 255, 255);
      doc.text('ESPECIFICACIONES DEL BASTIDOR', rightColX + 4, 41);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(51, 65, 85);
      doc.text(`• Modelo: Bastidor Excell 19" (${res.rackRecomendado}U)`, rightColX + 4, 48);
      doc.text(`• Altura útil ocupada: ${res.totalUNecesariasFrontales}U`, rightColX + 4, 54);
      doc.text(`• Reserva disponible: ${res.rackRecomendado - res.totalUNecesariasFrontales}U`, rightColX + 4, 60);
      doc.text(`• Carga térmica total: ${res.consumoTotal} W (~${amperiosEstimados} A)`, rightColX + 4, 66);
      doc.text(`• Ventilación: ${res.rackRecomendado <= 24 ? 'Superior (1x)' : 'Superior + Intermedia (2x)'}`, rightColX + 4, 72);
      doc.text(`• Distribución: ${res.numRegletasTraseras} PDU traseras | ${lineasTotales} línea(s) 2.5mm²`, rightColX + 4, 78);

      // Bloque 2: Leyenda de Subsistemas
      const posYSub = 86;
      doc.setFillColor(...lightBg);
      doc.roundedRect(rightColX, posYSub, rightColW, 68, 2, 2, 'FD');

      doc.setFillColor(30, 41, 59);
      doc.roundedRect(rightColX, posYSub, rightColW, 7, 2, 2, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(255, 255, 255);
      doc.text('CÓDIGO DE COLORES POR SUBSISTEMA', rightColX + 4, posYSub + 5);

      const subsystems = [
        { name: 'Redes & Comunicaciones (UniFi / Patch)', color: [51, 65, 85] },
        { name: 'Control & Domótica (Crestron / Lutron)', color: [5, 150, 105] },
        { name: 'Audio Distribuido & Streaming (Sonos/B&O)', color: [30, 64, 175] },
        { name: 'Distribución de Video HD/4K (Apple/Marantz)', color: [109, 40, 217] },
        { name: 'Cinema & Amplificación Pesada', color: [159, 18, 57] },
        { name: 'Energía, SAIs & PDU Alimentación', color: [194, 65, 12] },
        { name: 'Infraestructura, Baldas & Climatización', color: [15, 17, 23] }
      ];

      subsystems.forEach((sub, sIdx) => {
        const itemY = posYSub + 13 + (sIdx * 7.5);
        doc.setFillColor(...sub.color);
        doc.rect(rightColX + 4, itemY - 2.5, 4, 4, 'F');
        doc.setDrawColor(200, 200, 200);
        doc.rect(rightColX + 4, itemY - 2.5, 4, 4, 'D');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7);
        doc.setTextColor(51, 65, 85);
        doc.text(sub.name, rightColX + 11, itemY + 0.8);
      });

      // Bloque 3: Sello y Aprobación de Obra
      const posYSello = 158;
      doc.setFillColor(...lightBg);
      doc.roundedRect(rightColX, posYSello, rightColW, 60, 2, 2, 'FD');

      doc.setFillColor(16, 185, 129); // Emerald
      doc.roundedRect(rightColX, posYSello, rightColW, 7, 2, 2, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(255, 255, 255);
      doc.text('HOMOLOGACIÓN & CONTROL DE CALIDAD', rightColX + 4, posYSello + 5);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(51, 65, 85);
      doc.text(`• Proyecto: ${(nombreProyectoActual || 'PROYECTO RACK').toUpperCase()}`, rightColX + 4, posYSello + 13);
      doc.text(`• Ingeniería: Illusion Custom Solutions`, rightColX + 4, posYSello + 19);
      doc.text(`• Proyectista: Jony Cusac`, rightColX + 4, posYSello + 25);
      doc.text(`• Contacto: info@e-illusion.es | Illusion.es`, rightColX + 4, posYSello + 31);
      doc.text(`• Estado: CONFORME PARA INSTALACIÓN`, rightColX + 4, posYSello + 37);

      // Sello de verificación técnica
      doc.setDrawColor(16, 185, 129);
      doc.setFillColor(236, 253, 245);
      doc.roundedRect(rightColX + 4, posYSello + 42, rightColW - 8, 14, 1, 1, 'FD');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(5, 150, 105);
      doc.text('DISEÑO VERIFICADO BAJO NORMATIVA 19"', rightColX + rightColW / 2, posYSello + 48, { align: 'center' });
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.5);
      doc.setTextColor(4, 120, 87);
      doc.text(`Código Verificación: ILS-${Math.floor(100000 + Math.random() * 900000)}`, rightColX + rightColW / 2, posYSello + 53, { align: 'center' });

      // Pie de página para todas las páginas
      const totalPages = doc.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(148, 163, 184);
        doc.setDrawColor(226, 232, 240);
        doc.line(14, 285, 196, 285);
        doc.text('Generado por: Jony Cusac  |  Illusion.es (info@e-illusion.es)', 14, 290);
        doc.text(`Página ${i} de ${totalPages}`, 196, 290, { align: 'right' });
      }

      doc.save(`Illusion_Dossier_Rack_${(nombreProyectoActual || 'Proyecto').replace(/\s+/g, '_')}.pdf`);
    } catch (err) {
      console.error('Error generando PDF:', err);
    } finally {
      setGenerandoPDF(false);
    }
  };

  const res = calcularRackCalculos(equipos, posicionVentiladorIntermedio);

  const getCategoryIcon = (cat) => {
    switch(cat) {
      case 'Redes': return <Wifi size={12} className="text-slate-400" />;
      case 'Control': return <Settings size={12} className="text-emerald-400" />;
      case 'Audio': return <Volume2 size={12} className="text-blue-500" />;
      case 'Video': return <Monitor size={12} className="text-purple-500" />;
      case 'Cinema': return <Film size={12} className="text-rose-500" />;
      case 'Energía': return <Battery size={12} className="text-orange-500" />;
      case 'Otros': return <Package size={12} className="text-zinc-400" />;
      case 'Accesorios': return <LayoutList size={12} className="text-cyan-500" />;
      default: return <Server size={12} className="text-slate-400" />;
    }
  };

  // 1. Pantalla de carga si Firebase está comprobando la sesión
  if (cargandoAuth) {
    return (
      <div className="h-screen w-screen bg-[#07090e] flex flex-col items-center justify-center text-white">
        <div className="p-4 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 mb-4 animate-pulse">
          <Server size={36} />
        </div>
        <div className="flex items-center gap-2.5 text-sm font-semibold text-slate-300">
          <Loader2 size={18} className="animate-spin text-indigo-400" />
          <span>Cargando Illusion Rack Designer...</span>
        </div>
      </div>
    );
  }

  // 2. Si no ha entrado al diseñador, mostrar la Página de Inicio & Login
  if (!enDisenador) {
    return (
      <LoginPage 
        usuarioActual={usuario}
        onEnterDesigner={() => setEnDisenador(true)}
        onLogout={handleLogout}
        onLoginSuccess={(user) => {
          setUsuario(user);
          setEnDisenador(true);
          setNotificacionGuardado(`¡Bienvenido ${user.displayName || user.email}!`);
          setTimeout(() => setNotificacionGuardado(false), 3500);
        }}
        onContinueGuest={() => {
          setEnDisenador(true);
        }}
      />
    );
  }

  return (
    <div className="h-screen text-slate-100 flex flex-col overflow-hidden font-sans" style={{ backgroundColor: 'var(--bg-app)' }}>
      <header className="h-16 flex items-center justify-between px-6 border-b shrink-0 relative select-none shadow-md z-20"
              style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border)' }}>
        
        {/* Lado Izquierdo: Logo y Nombre Illusion Rack Designer (Click para volver al Inicio) */}
        <div 
          onClick={() => setEnDisenador(false)}
          className="flex items-center gap-3.5 shrink-0 cursor-pointer group"
          title="Volver a la Página de Inicio / Portal"
        >
          <div className="p-2.5 rounded-2xl shadow-lg shadow-indigo-500/20 flex items-center justify-center bg-gradient-to-br from-indigo-500 to-indigo-700 border border-indigo-400/30 group-hover:scale-105 transition-all">
            <ShieldCheck className="text-white w-7 h-7" />
          </div>
          <div className="flex items-center">
            <h1 className="text-xl font-black tracking-tight text-white leading-none">
              Illusion <span className="text-indigo-400 font-extrabold">Rack Designer</span>
            </h1>
          </div>
        </div>

        {/* Lado Derecho: Pestaña Guía, Indicador de Consumo & Botones de Acción */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Pestaña / Botón de GUÍA homogéneo con los botones de acción */}
          <button
            onClick={() => {
              setPasoGuia(0);
              setMostrarGuia(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-300 hover:text-indigo-200 border border-indigo-500/35 transition-all text-xs font-bold shadow-sm active:scale-95 cursor-pointer shrink-0"
            title="Abrir Guía y Manual de Uso"
          >
            <BookOpen size={14} className="text-indigo-400" />
            <span>Guía</span>
          </button>

          {/* Métrica de Consumo (Estilo píldora ámbar) */}
          <div 
            className="flex items-center gap-2 px-3 py-1.5 rounded-full select-none cursor-default shrink-0" 
            style={{ backgroundColor: 'rgba(224, 153, 63, 0.15)' }}
            title="Consumo eléctrico total estimado"
          >
             <Zap size={16} style={{ color: '#fbbf24' }} />
             <span className="uppercase tracking-tight font-extrabold" style={{ color: '#fbbf24', fontSize: '12px' }}>
               CONSUMO: {res.consumoTotal}W
             </span>
          </div>

          {/* Separador vertical */}
          <div className="h-6 w-px bg-white/10 mx-0.5" />

          {/* Botones de Acción Homogéneos */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Botón Guardar */}
            <button 
              onClick={abrirModalGuardar} 
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 hover:text-emerald-200 border border-emerald-500/35 transition-all text-xs font-bold shadow-sm active:scale-95 cursor-pointer"
              title="Guardar diseño de rack actual"
            >
              {guardandoNube ? (
                <Loader2 size={14} className="animate-spin text-emerald-400" />
              ) : (
                <Save size={14} className="text-emerald-400" />
              )}
              <span>Guardar</span>
            </button>

            {/* Menú Proyectos Guardados (Nube + Local) */}
            <div className="relative group">
              <button 
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 text-sky-300 hover:text-sky-200 border border-sky-500/35 transition-all text-xs font-bold shadow-sm cursor-pointer"
                title="Ver y abrir proyectos guardados"
              >
                <FolderOpen size={14} className="text-sky-400" />
                <span>Proyectos</span>
                {usuario && proyectosNube.length > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-sky-500/30 text-[10px] font-black text-sky-200">
                    {proyectosNube.length}
                  </span>
                )}
                <ChevronDown size={12} className="text-sky-400/80 group-hover:rotate-180 transition-transform" />
              </button>
              
              <div className="absolute right-0 top-full mt-2 w-72 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 border overflow-hidden"
                   style={{ backgroundColor: '#111420', borderColor: 'rgba(99, 102, 241, 0.3)' }}>
                
                {/* Sección Nube si está autenticado */}
                {usuario ? (
                  <div>
                    <div className="px-3 py-2 border-b border-white/10 bg-indigo-950/40 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-indigo-300">
                        <Cloud size={13} className="text-indigo-400" />
                        <span className="text-[10px] uppercase font-black tracking-wider">Proyectos en la Nube</span>
                      </div>
                      <span className="text-[10px] text-indigo-400 font-bold">{proyectosNube.length}</span>
                    </div>

                    <div className="p-2 max-h-48 overflow-y-auto custom-scrollbar space-y-1">
                      {cargandoProyectosNube ? (
                        <div className="flex items-center justify-center p-3 text-xs text-slate-400 gap-2">
                          <Loader2 size={13} className="animate-spin text-indigo-400" />
                          <span>Cargando de Firestore...</span>
                        </div>
                      ) : proyectosNube.length === 0 ? (
                        <p className="text-xs p-3 text-center text-slate-400">No tienes proyectos guardados en tu cuenta aún</p>
                      ) : (
                        proyectosNube.map((proyecto) => (
                          <div key={proyecto.id} className="flex items-center justify-between p-2 hover:bg-white/10 rounded-lg text-xs transition-colors group/item">
                            <div className="flex-1 cursor-pointer truncate pr-2" onClick={() => cargarProyecto(proyecto)}>
                              <div className="font-semibold text-slate-200 truncate group-hover/item:text-indigo-300 flex items-center gap-1.5">
                                <Cloud size={11} className="text-indigo-400 shrink-0" />
                                <span>{proyecto.nombre}</span>
                              </div>
                              <div className="text-[10px] text-slate-400 flex items-center gap-2">
                                <span>{new Date(proyecto.fecha || proyecto.updatedAt).toLocaleDateString('es-ES')}</span>
                                {proyecto.rackAltura && <span className="text-indigo-300 font-bold">{proyecto.rackAltura}</span>}
                              </div>
                            </div>
                            <button 
                              onClick={(e) => eliminarProyectoNube(proyecto.id, e)} 
                              className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                              title="Eliminar de la nube"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="p-3 border-b border-white/10 bg-indigo-950/20">
                    <p className="text-[11px] text-indigo-200 leading-snug">
                      💡 <strong>Inicia sesión</strong> para guardar tus diseños en la nube y acceder desde cualquier ordenador.
                    </p>
                    <button
                      onClick={() => setEnDisenador(false)}
                      className="mt-2 w-full py-1.5 px-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all cursor-pointer shadow-sm"
                    >
                      Iniciar Sesión Ahora
                    </button>
                  </div>
                )}

                {/* Sección Memoria Local */}
                <div className="px-3 py-1.5 border-t border-b border-white/10 bg-black/30 flex items-center justify-between">
                  <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400">Memoria Local (Navegador)</span>
                  <span className="text-[10px] text-slate-400">{obtenerProyectosGuardados().length}</span>
                </div>
                <div className="p-2 max-h-36 overflow-y-auto custom-scrollbar space-y-1">
                  {obtenerProyectosGuardados().length === 0 ? (
                    <p className="text-xs p-2 text-center text-slate-500">Sin proyectos locales</p>
                  ) : (
                    obtenerProyectosGuardados().map((proyecto, index) => (
                      <div key={index} className="flex items-center justify-between p-1.5 hover:bg-white/10 rounded-lg text-xs transition-colors group/item">
                        <div className="flex-1 cursor-pointer truncate pr-2" onClick={() => cargarProyecto(proyecto)}>
                          <div className="font-semibold text-slate-300 truncate group-hover/item:text-sky-300">{proyecto.nombre}</div>
                          <div className="text-[9px] text-slate-500">{new Date(proyecto.fecha).toLocaleDateString('es-ES')}</div>
                        </div>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            eliminarProyecto(index);
                          }} 
                          className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="Eliminar proyecto local"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Botón Reiniciar / Limpiar */}
            <button 
              onClick={() => {
                setEquipos([]);
                setPosicionVentiladorIntermedio(null);
              }} 
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 hover:text-rose-200 border border-rose-500/30 transition-all text-xs font-bold shadow-sm active:scale-95 cursor-pointer" 
              title="Vaciar todos los equipos del rack y empezar de nuevo"
            >
              <RotateCcw size={14} className="text-rose-400" />
              <span>Limpiar</span>
            </button>

            {/* Separador vertical */}
            <div className="h-6 w-px bg-white/10 mx-0.5" />

            {/* Botón / Menú de Usuario & Login Firebase */}
            {cargandoAuth ? (
              <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/5 text-slate-400 text-xs">
                <Loader2 size={14} className="animate-spin text-indigo-400" />
              </div>
            ) : usuario ? (
              <div className="relative group">
                <button 
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 border border-indigo-500/40 transition-all text-xs font-bold shadow-sm cursor-pointer shrink-0"
                  title="Perfil de Usuario"
                >
                  {usuario.photoURL ? (
                    <img src={usuario.photoURL} alt="Avatar" className="w-5 h-5 rounded-full object-cover border border-indigo-400 shrink-0" />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 text-white flex items-center justify-center text-[10px] font-black shrink-0">
                      {(usuario.displayName || usuario.email || 'U')[0].toUpperCase()}
                    </div>
                  )}
                  <span className="max-w-[100px] truncate">{usuario.displayName || usuario.email?.split('@')[0]}</span>
                  <span className="flex h-2 w-2 relative" title="Conectado a Firebase Cloud">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <ChevronDown size={11} className="text-slate-400 group-hover:rotate-180 transition-transform" />
                </button>
                
                {/* Menú de Usuario Desplegable */}
                <div className="absolute right-0 top-full mt-2 w-64 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 border overflow-hidden"
                     style={{ backgroundColor: '#111420', borderColor: 'rgba(99, 102, 241, 0.3)' }}>
                  <div className="p-3 border-b border-white/10 bg-black/30">
                    <p className="text-xs font-bold text-white truncate">{usuario.displayName || 'Usuario Illusion'}</p>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">{usuario.email}</p>
                    <div className="mt-2.5 flex items-center gap-1.5 text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20">
                      <Cloud size={12} />
                      <span>Sincronización en la nube activa</span>
                    </div>
                  </div>
                  <div className="p-2">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-rose-300 hover:text-rose-200 hover:bg-rose-500/15 transition-all text-left cursor-pointer"
                    >
                      <LogOut size={14} className="text-rose-400" />
                      <span>Cerrar Sesión</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button 
                onClick={() => setEnDisenador(false)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600/25 hover:bg-indigo-600/40 text-indigo-200 hover:text-white border border-indigo-500/45 transition-all text-xs font-bold shadow-sm active:scale-95 cursor-pointer shrink-0"
                title="Iniciar sesión para guardar en la nube"
              >
                <User size={14} className="text-indigo-400" />
                <span>Iniciar Sesión / Nube</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* Panel Izquierdo: Librería de Equipos */}
        <aside className="w-72 xl:w-80 border-r p-3.5 overflow-y-auto shrink-0 custom-scrollbar flex flex-col justify-between" style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border)' }}>
          <div>
            <p className="text-[9px] font-black uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>Librería Illusion</p>
            <div className="space-y-2">
              {[...new Set(CATALOGO_EQUIPOS.map(i => i.categoria))].map(cat => (
                <div key={cat} className="rounded-lg overflow-hidden border" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-highlight)' }}>
                  <button
                    onClick={() => toggleCategoria(cat)}
                    className="w-full px-3 py-2.5 flex items-center justify-between transition-colors hover:bg-white/5 cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(cat)}
                      <span className="font-bold uppercase tracking-wider" style={{ fontSize: 'var(--font-label)', color: 'var(--text-secondary)' }}>{cat}</span>
                    </div>
                    <ChevronDown size={12} style={{ color: 'var(--text-muted)' }} className={`transition-transform duration-300 ${categoriasAbiertas.includes(cat) ? 'rotate-180' : ''}`} />
                  </button>
                  {categoriasAbiertas.includes(cat) && (
                    <div className="p-2 border-t space-y-1.5" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-app)' }}>
                      {CATALOGO_EQUIPOS.filter(i => i.categoria === cat).sort((a, b) => a.nombre.localeCompare(b.nombre, 'es', { sensitivity: 'base' })).map(item => (
                        <button key={item.id} onClick={() => agregarItem(item)}
                          className="w-full p-2.5 rounded-lg group text-left flex justify-between items-center transition-all duration-200 border hover:shadow-lg cursor-pointer"
                          style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border)' }}
                          onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--accent)'; e.currentTarget.style.borderColor = 'var(--accent)'; }}
                          onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'var(--bg-panel)'; e.currentTarget.style.borderColor = 'var(--border)'; }}>
                          <span className="font-semibold truncate flex items-center gap-1.5 text-xs text-white">
                            <BrandLogo brand={getBrandForEquipment(item)} size={12} className="text-slate-300 shrink-0" />
                            <span className="truncate">{item.nombre}</span>
                          </span>
                          <div className="flex items-center justify-center w-6 h-6 rounded-full flex-shrink-0 ml-1.5 bg-indigo-500/20 group-hover:bg-white/20">
                            <Plus size={12} className="text-indigo-300 group-hover:text-white" />
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Rack Recomendado */}
          <div className="mt-4 p-4 rounded-xl border shrink-0 shadow-lg" style={{ backgroundColor: 'var(--bg-highlight)', borderColor: 'var(--border-active)', borderLeftWidth: '4px' }}>
            <div className="flex items-baseline gap-1">
              <span className="leading-none font-black text-4xl text-white tracking-tight">
                {res.rackRecomendado}
              </span>
              <span className="text-xl font-bold text-indigo-400">U</span>
            </div>
            <p className="font-black uppercase tracking-widest mt-1.5 text-[9px] text-indigo-300">
              Rack Excell Recomendado
            </p>
          </div>
        </aside>

        {/* Bastidor Central 19" */}
        <section className="flex-1 relative flex items-center justify-center p-4 xl:p-6 overflow-y-auto custom-scrollbar" style={{ backgroundColor: 'var(--bg-app)' }}>
          <div ref={rackContainerRef} className="relative w-full max-w-[560px] xl:max-w-[620px] min-h-[500px] h-full flex flex-col rounded-xl border-x-[20px] shadow-2xl transition-all"
               style={{ backgroundColor: 'var(--bg-rack)', borderColor: '#242731', boxShadow: '0 0 50px rgba(58,62,224,0.18)', outline: '1px solid #1c1e24' }}>
            <div className="flex-1 flex flex-col p-1.5 overflow-y-auto custom-scrollbar">
              {/* Ventiladores */}
              <div style={{ 
                height: `${PIXELS_PER_U}px`, 
                borderBottom: '1px solid var(--border)',
                background: 'linear-gradient(90deg, rgba(59, 130, 246, 0.08) 0%, rgba(96, 165, 250, 0.15) 50%, rgba(59, 130, 246, 0.08) 100%)'
              }} className="w-full flex items-center justify-center gap-3 shrink-0">
                <div className="flex gap-1">{[...Array(8)].map((_, j) => (
                  <div key={j} className="w-1 h-3 bg-blue-400 rounded-full" style={{ opacity: 0.3 + (j * 0.08) }} />
                ))}</div>
                <span className="fan-spin" style={{ color: '#60a5fa', display: 'inline-block' }}>
                  <Fan size={18} />
                </span>
                <span className="uppercase" style={{ fontSize: '13px', letterSpacing: '2px', color: '#60a5fa', fontWeight: 700 }}>Ventiladores</span>
                <span className="fan-spin" style={{ color: '#60a5fa', display: 'inline-block' }}>
                  <Fan size={18} />
                </span>
                <div className="flex gap-1">{[...Array(8)].map((_, j) => (
                  <div key={j} className="w-1 h-3 bg-blue-400 rounded-full" style={{ opacity: 0.3 + ((7 - j) * 0.08) }} />
                ))}</div>
              </div>
              {/* Termostato */}
              <div style={{ height: `${PIXELS_PER_U}px`, backgroundColor: 'var(--neutral-bg)', borderBottom: '2px solid var(--border)' }} className="w-full flex items-center justify-center shrink-0">
                <div className="flex items-center gap-2">
                  <Thermometer size={12} style={{ color: 'var(--warning)' }} />
                  <span className="uppercase" style={{ fontSize: 'var(--font-label)', letterSpacing: '3px', color: 'var(--neutral-text)', fontWeight: 700 }}>Termostato</span>
                </div>
              </div>

                {/* Listado dinámico de equipos en orden de inserción */}
              <div className="flex-1 mt-1 space-y-1">
                {res.rackItems.map((item, idx) => {

                  // ── BLOQUE DE BALDA (no-rackable) ──────────────────────
                  if (item.__esBloque) {
                    const bloque = item.bloque;
                    return (
                      <div key={`bloque-${idx}`} className="flex flex-col">
                        {bloque.tieneVentilacionArriba && (
                          <div style={{ height: `${PIXELS_PER_U}px` }} className="w-full bg-black border-b-2 border-white/10 flex items-center justify-center gap-2 text-[10px] font-bold text-white uppercase tracking-widest mb-1">
                            <Fan size={11} className="text-white/40 shrink-0" />PLACA CIEGA 1U
                          </div>
                        )}
                        {bloque.tieneTapaArriba && (
                          <div style={{ height: `${PIXELS_PER_U}px` }} className="w-full bg-black border-b-2 border-white/10 flex items-center justify-center gap-2 text-[10px] font-bold text-white uppercase tracking-widest mb-1">
                            <Fan size={11} className="text-white/40 shrink-0" />PLACA CIEGA 1U
                          </div>
                        )}
                        <div className="w-full bg-slate-800 rounded-sm border-b-4 border-black/60 flex shadow-inner relative"
                             style={{ height: `${(bloque.uTotal - (bloque.tieneTapaArriba ? 1 : 0) - (bloque.tieneVentilacionArriba ? 1 : 0)) * PIXELS_PER_U}px` }}>
                          {bloque.equipos.map((e) => {
                            const equipoRealIndex = equipos.findIndex(eq => eq.instanceId === e.instanceId);
                            const isDraggable = equipoRealIndex !== -1;
                            const isDragOver = isDraggable && dragOverIndex === equipoRealIndex;
                            const bgColor = e.categoria === 'Redes' ? '#475569' :
                                           e.categoria === 'Audio' ? '#2563eb' :
                                           e.categoria === 'Video' ? '#9333ea' :
                                           e.categoria === 'Control' ? '#059669' :
                                           e.categoria === 'Cinema' ? '#be123c' :
                                           e.categoria === 'Energía' ? '#ea580c' :
                                           e.categoria === 'Otros' ? '#52525b' : '#475569';
                            return (
                              <div key={e.instanceId}
                                   draggable={isDraggable}
                                   onDragStart={isDraggable ? (ev) => handleDragStart(ev, equipoRealIndex) : undefined}
                                   onDragEnd={isDraggable ? handleDragEnd : undefined}
                                   onDragOver={isDraggable ? (ev) => handleDragOver(ev, equipoRealIndex) : undefined}
                                   onDragLeave={isDraggable ? handleDragLeave : undefined}
                                   onDrop={isDraggable ? (ev) => handleDrop(ev, equipoRealIndex) : undefined}
                                   className={`h-[90%] flex flex-row items-center m-1.5 rounded shadow-xl flex-1 border-t-2 border-black/40 overflow-hidden relative group/item${
                                     isDraggable ? ' cursor-grab active:cursor-grabbing' : ''
                                   }${isDragOver ? ' ring-2 ring-indigo-400 ring-inset brightness-125' : ''}`}
                                   style={{
                                     backgroundColor: bgColor,
                                     opacity: isDraggable && draggingIndex === equipoRealIndex ? 0.35 : 1,
                                   }}>
                                {isDraggable && <div className="w-4 shrink-0" />}
                                <div className="flex-1 flex items-center justify-center gap-1.5 px-1 leading-tight overflow-hidden">
                                  <BrandLogo brand={getBrandForEquipment(e)} size={11} className="text-white/90" />
                                  <span className="font-black uppercase text-white text-[11px] truncate text-center">{e.nombre}</span>
                                </div>
                                {isDraggable && (
                                  <div className="w-5 shrink-0 flex flex-col items-center justify-center gap-0.5 z-10 mr-1">
                                    <button
                                      onClick={() => moverEquipo(equipoRealIndex, -1)}
                                      disabled={equipoRealIndex === 0}
                                      className="w-4 h-3.5 flex items-center justify-center rounded bg-black/50 hover:bg-black/80 text-white/90 hover:text-white transition-all opacity-0 group-hover/item:opacity-100 disabled:opacity-0 disabled:cursor-not-allowed cursor-pointer shadow-sm active:scale-95 border border-white/15"
                                      style={{ fontSize: '8px', lineHeight: 1 }}
                                      title="Mover equipo hacia arriba"
                                    >
                                      ▲
                                    </button>
                                    <button
                                      onClick={() => moverEquipo(equipoRealIndex, 1)}
                                      disabled={equipoRealIndex === equipos.length - 1}
                                      className="w-4 h-3.5 flex items-center justify-center rounded bg-black/50 hover:bg-black/80 text-white/90 hover:text-white transition-all opacity-0 group-hover/item:opacity-100 disabled:opacity-0 disabled:cursor-not-allowed cursor-pointer shadow-sm active:scale-95 border border-white/15"
                                      style={{ fontSize: '8px', lineHeight: 1 }}
                                      title="Mover equipo hacia abajo"
                                    >
                                      ▼
                                    </button>
                                  </div>
                                )}
                                <button onClick={() => eliminarItem(e.instanceId)} className="absolute inset-0 bg-red-600/90 text-white flex items-center justify-center opacity-0 group-hover/item:opacity-100 transition-opacity"><Trash2 size={14} /></button>
                              </div>
                            );
                          })}
                        </div>
                        {bloque.tieneTapa && (
                          <div style={{ height: `${PIXELS_PER_U}px` }} className="w-full bg-black border-b-2 border-white/10 flex items-center justify-center gap-2 text-[10px] font-bold text-white uppercase tracking-widest">
                            <Fan size={11} className="text-white/40 shrink-0" />PLACA CIEGA 1U
                          </div>
                        )}
                      </div>
                    );
                  }

                  // ── VENTILADOR ADICIONAL (automático en racks >=24U con movimiento arriba / abajo) ────
                  if (item.esVentiladorAdicional) {
                    const posActual = item.posicionIndex ?? 0;
                    const maxSlots = item.totalSlots ?? 0;
                    const puedeSubir = posActual > 0;
                    const puedeBajar = posActual < maxSlots;

                    return (
                      <div 
                        key={item.instanceId} 
                        style={{ 
                          height: `${PIXELS_PER_U}px`,
                          background: 'linear-gradient(90deg, rgba(30, 58, 138, 0.25) 0%, rgba(59, 130, 246, 0.2) 50%, rgba(30, 58, 138, 0.25) 100%)',
                          borderBottom: '1px solid rgba(96, 165, 250, 0.35)',
                          borderTop: '1px solid rgba(96, 165, 250, 0.25)'
                        }} 
                        className="w-full flex items-center justify-between px-3 overflow-hidden relative group shadow-sm"
                      >
                        {/* Lado Izquierdo: Espaciador simétrico */}
                        <div className="w-8 shrink-0" />

                        {/* Centro: Animación de ventiladores y texto */}
                        <div className="flex-1 flex items-center justify-center gap-2.5 overflow-hidden">
                          <div className="flex gap-1 shrink-0 hidden sm:flex">
                            {[...Array(5)].map((_, j) => (
                              <div key={j} className="w-1 h-3 bg-blue-400 rounded-full" style={{ opacity: 0.3 + (j * 0.14) }} />
                            ))}
                          </div>
                          <span className="fan-spin shrink-0 text-blue-400" style={{ display: 'inline-flex' }}>
                            <Fan size={15} />
                          </span>
                          <span className="uppercase text-center whitespace-nowrap shrink-0 text-blue-300 font-extrabold tracking-wider text-[11px]">
                            Ventilador Intermedio
                          </span>
                          <span className="fan-spin shrink-0 text-blue-400" style={{ display: 'inline-flex' }}>
                            <Fan size={15} />
                          </span>
                          <div className="flex gap-1 shrink-0 hidden sm:flex">
                            {[...Array(5)].map((_, j) => (
                              <div key={j} className="w-1 h-3 bg-blue-400 rounded-full" style={{ opacity: 0.3 + ((4 - j) * 0.14) }} />
                            ))}
                          </div>
                        </div>

                        {/* Lado Derecho: Controles de movimiento Arriba / Abajo */}
                        <div className="w-8 shrink-0 flex flex-col items-center justify-center gap-0.5">
                          <button
                            onClick={() => moverVentiladorIntermedio(-1)}
                            disabled={!puedeSubir}
                            className="w-5 h-4 flex items-center justify-center rounded bg-blue-500/25 hover:bg-blue-500/50 text-blue-200 hover:text-white transition-all disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer shadow-sm active:scale-95"
                            style={{ fontSize: '9px', lineHeight: 1 }}
                            title="Mover ventilador intermedio hacia arriba"
                          >
                            ▲
                          </button>
                          <button
                            onClick={() => moverVentiladorIntermedio(1)}
                            disabled={!puedeBajar}
                            className="w-5 h-4 flex items-center justify-center rounded bg-blue-500/25 hover:bg-blue-500/50 text-blue-200 hover:text-white transition-all disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer shadow-sm active:scale-95"
                            style={{ fontSize: '9px', lineHeight: 1 }}
                            title="Mover ventilador intermedio hacia abajo"
                          >
                            ▼
                          </button>
                        </div>
                      </div>
                    );
                  }

                  // ── EQUIPO RACKABLE ────────────────────────────────────
                  const eq = item;
                  const equipoRealIndex = eq.tipoPasivo ? null : equipos.findIndex(e => e.instanceId === eq.instanceId);
                  const isDraggable = equipoRealIndex !== null && equipoRealIndex !== -1;
                  const isDragOver = isDraggable && dragOverIndex === equipoRealIndex;
                  const backgroundColor = eq.tipoPasivo === 'Ventilacion' || eq.esRejillaVentilacion ? '#000000' :
                                         eq.tipoPasivo === 'Escobilla' || eq.tipoPasivo === 'Ciego' ? '#000000' :
                                         eq.id === 'regleta-acc' ? '#181b24' :
                                         eq.id === 'pasacables-acc' ? '#111827' :
                                         eq.esAccesorio ? '#000000' :
                                         eq.categoria === 'Redes' ? '#475569' :
                                         eq.categoria === 'Audio' ? '#2563eb' :
                                         eq.categoria === 'Video' ? '#9333ea' :
                                         eq.categoria === 'Control' ? '#059669' :
                                         eq.categoria === 'Cinema' ? '#be123c' :
                                         eq.categoria === 'Energía' ? '#ea580c' :
                                         eq.categoria === 'Otros' ? '#52525b' :
                                         eq.categoria === 'Accesorios' ? '#000000' : '#1e293b';
                  return (
                    <div key={eq.instanceId}
                         draggable={isDraggable}
                         onDragStart={isDraggable ? (e) => handleDragStart(e, equipoRealIndex) : undefined}
                         onDragEnd={isDraggable ? handleDragEnd : undefined}
                         onDragOver={isDraggable ? (e) => handleDragOver(e, equipoRealIndex) : undefined}
                         onDragLeave={isDraggable ? handleDragLeave : undefined}
                         onDrop={isDraggable ? (e) => handleDrop(e, equipoRealIndex) : undefined}
                         className={`w-full rounded-sm border-b border-black/40 flex items-center relative group transition-all${
                           isDraggable ? ' cursor-grab active:cursor-grabbing' : ''
                         }${isDragOver ? ' ring-2 ring-indigo-400 ring-inset brightness-125' : ''}`}
                         style={{
                           height: `${eq.uOcupadas * PIXELS_PER_U}px`,
                           backgroundColor,
                           opacity: isDraggable && draggingIndex === equipoRealIndex ? 0.35 : 1,
                         }}>
                      {isDraggable && <div className="w-8 shrink-0" />}
                      <div className="flex-1 h-full flex items-center justify-center overflow-hidden">
                        {eq.tipoPasivo === 'Ventilacion' || eq.esRejillaVentilacion ? (
                          <div className="flex items-center gap-2">
                            <Fan size={11} className="text-white/40 shrink-0" />
                            <span className="text-[10px] font-bold text-white uppercase tracking-widest">PLACA CIEGA 1U</span>
                          </div>
                        ) : eq.tipoPasivo === 'Escobilla' || eq.esEscobilla || eq.id === 'escobilla-acc' || (eq.nombre && eq.nombre.toLowerCase().includes('escobilla')) ? (
                          /* Diseño Escobilla Pasacables con logos de escoba */
                          <div className="w-full flex items-center justify-center gap-3 px-4">
                            <span className="text-amber-400 shrink-0" style={{ display: 'inline-flex' }}>
                              <EscobaIcon size={16} />
                            </span>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-white whitespace-nowrap">
                              ESCOBILLA PASACABLES
                            </span>
                            <span className="text-amber-400 shrink-0" style={{ display: 'inline-flex' }}>
                              <EscobaIcon size={16} />
                            </span>
                          </div>
                        ) : eq.id === 'pasacables-acc' || (eq.nombre && eq.nombre.toLowerCase().includes('pasacables') && !eq.nombre.toLowerCase().includes('escobilla')) ? (
                          /* Diseño Pasacables 1U Ranurado con Guías */
                          <div className="w-full flex items-center justify-between px-3 h-full">
                            <div className="flex items-center gap-1.5 opacity-50">
                              {[...Array(3)].map((_, i) => (
                                <div key={i} className="w-2.5 h-5 rounded-sm border border-slate-600 bg-slate-800/80" />
                              ))}
                            </div>
                            <div className="flex items-center gap-2">
                              <Cable size={14} className="text-cyan-400 shrink-0" />
                              <span className="text-[10px] font-bold text-white uppercase tracking-widest">
                                PASACABLES 1U
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 opacity-50">
                              {[...Array(3)].map((_, i) => (
                                <div key={i} className="w-2.5 h-5 rounded-sm border border-slate-600 bg-slate-800/80" />
                              ))}
                            </div>
                          </div>
                        ) : eq.id === 'regleta-acc' || (eq.nombre && eq.nombre.toLowerCase().includes('regleta')) ? (
                          /* Diseño Regleta de Conexión 1U PDU Frontal */
                          <div className="w-full flex items-center justify-between px-3 h-full">
                            <div className="flex items-center gap-2">
                              <div className="w-3.5 h-5 rounded-sm bg-red-600 shadow-sm shadow-red-500/50 flex items-center justify-center border border-red-400/50" title="Interruptor I/O">
                                <div className="w-1 h-2 bg-red-200 rounded-full" />
                              </div>
                              <div className="flex items-center gap-1.5">
                                <RoundedSocketIcon size={13} className="text-indigo-400 shrink-0" />
                                <span className="text-[10px] font-bold text-white uppercase tracking-widest">
                                  REGLETA DE CONEXIÓN 1U
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5">
                              {[...Array(4)].map((_, i) => (
                                <div key={i} className="w-5 h-5 rounded-full border border-slate-700 bg-slate-900 flex items-center justify-center shadow-inner" title="Toma Schuko">
                                  <div className="flex gap-0.5">
                                    <div className="w-1 h-1 bg-slate-500 rounded-full" />
                                    <div className="w-1 h-1 bg-slate-500 rounded-full" />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : eq.tipoPasivo === 'Ciego' ? (
                          <div className="flex items-center gap-2">
                            <Fan size={11} className="text-white/40 shrink-0" />
                            <span className="text-[10px] font-bold text-white uppercase tracking-widest">PLACA CIEGA 1U</span>
                          </div>
                        ) : eq.categoria === 'Accesorios' ? (
                          <div className="flex items-center gap-2">
                            <Fan size={11} className="text-white/40 shrink-0" />
                            <span className="text-[10px] font-bold text-white uppercase tracking-widest">
                              {eq.id === 'placa-ciega-2u' ? 'PLACA CIEGA 2U' : 'PLACA CIEGA 1U'}
                            </span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center">
                            <div className="flex items-center gap-2 max-w-full px-4">
                              <BrandLogo brand={getBrandForEquipment(eq)} size={13} className="text-white/80" />
                              <span className="font-black uppercase tracking-tight truncate text-[14px] text-white">{eq.nombre}</span>
                            </div>
                            <span className="text-[10px] font-bold opacity-50 uppercase tracking-widest">{eq.categoria}</span>
                          </div>
                        )}
                      </div>
                      <div className="w-8 shrink-0 flex flex-col items-center justify-center gap-0.5 z-10 mr-1">
                        {isDraggable && (
                          <>
                            <button
                              onClick={() => moverEquipo(equipoRealIndex, -1)}
                              disabled={equipoRealIndex === 0}
                              className="w-5 h-4 flex items-center justify-center rounded bg-black/50 hover:bg-black/80 text-white/90 hover:text-white transition-all opacity-0 group-hover:opacity-100 disabled:opacity-0 disabled:cursor-not-allowed cursor-pointer shadow-sm active:scale-95 border border-white/15"
                              style={{ fontSize: '9px', lineHeight: 1 }}
                              title="Mover equipo hacia arriba"
                            >
                              ▲
                            </button>
                            <button
                              onClick={() => moverEquipo(equipoRealIndex, 1)}
                              disabled={equipoRealIndex === equipos.length - 1}
                              className="w-5 h-4 flex items-center justify-center rounded bg-black/50 hover:bg-black/80 text-white/90 hover:text-white transition-all opacity-0 group-hover:opacity-100 disabled:opacity-0 disabled:cursor-not-allowed cursor-pointer shadow-sm active:scale-95 border border-white/15"
                              style={{ fontSize: '9px', lineHeight: 1 }}
                              title="Mover equipo hacia abajo"
                            >
                              ▼
                            </button>
                          </>
                        )}
                      </div>
                      {eq.categoria !== 'Pasivo' && (
                        <button onClick={() => eliminarItem(eq.instanceId)} className="absolute left-2 opacity-0 group-hover:opacity-100 p-2 text-white/50 hover:text-red-400 transition-all">
                          <Trash2 size={12} />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Panel Derecho: Configuración Técnica & Resumen */}
        <aside className="w-72 xl:w-80 bg-slate-900/40 border-l border-white/5 flex flex-col shrink-0 p-4 xl:p-5 overflow-y-auto custom-scrollbar text-[11px]">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-4">Configuración Técnica</p>
          <div className="space-y-3">
             <div className="flex justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                <div className="flex items-center gap-2">
                   <LayoutList size={14} className="text-slate-300" />
                   <span className="text-slate-200 font-bold uppercase text-[10px]">U Frontales Ocupadas</span>
                </div>
                <span className="font-black text-white">{res.totalUNecesariasFrontales} U</span>
             </div>
             <div className="flex justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                <div className="flex items-center gap-2">
                   <RoundedSocketIcon size={14} className="text-slate-300" />
                   <span className="text-slate-200 font-bold uppercase text-[10px]">Regletas PDU (Traseras)</span>
                </div>
                <span className="font-black text-white">x{res.numRegletasTraseras}</span>
             </div>
             {res.numRegletasFrontales > 0 && (
               <div className="flex justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                  <div className="flex items-center gap-2">
                     <RoundedSocketIcon size={14} className="text-indigo-400" />
                     <span className="text-slate-200 font-bold uppercase text-[10px]">Regletas 1U (Frontales)</span>
                  </div>
                  <span className="font-black text-white">x{res.numRegletasFrontales}</span>
               </div>
             )}
             <div className="flex justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                <div className="flex items-center gap-2">
                   <Cable size={14} className="text-slate-300" />
                   <span className="text-slate-200 font-bold uppercase text-[10px]">Pasacables (Posterior)</span>
                </div>
                <span className="font-black text-white">x{res.pasacablesTraseros}</span>
             </div>
             {res.numPasacablesFrontales > 0 && (
               <div className="flex justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                  <div className="flex items-center gap-2">
                     <Cable size={14} className="text-cyan-400" />
                     <span className="text-slate-200 font-bold uppercase text-[10px]">Pasacables 1U (Frontales)</span>
                  </div>
                  <span className="font-black text-white">x{res.numPasacablesFrontales}</span>
               </div>
             )}
             <div className="flex justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                <div className="flex items-center gap-2">
                   <LayoutList size={14} className="text-slate-300" />
                   <span className="text-slate-200 font-bold uppercase text-[10px]">Placas Ciegas</span>
                </div>
                <span className="font-black text-white">x{res.numPlacasCiegas}</span>
             </div>
             <div className="flex justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                <div className="flex items-center gap-2">
                   <Cable size={14} className="text-slate-300" />
                   <span className="text-slate-200 font-bold uppercase text-[10px]">Escobillas</span>
                </div>
                <span className="font-black text-white">x{res.numEscobillas}</span>
             </div>
             <div className="flex justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                <div className="flex items-center gap-2">
                   <LayoutList size={14} className="text-slate-300" />
                   <span className="text-slate-200 font-bold uppercase text-[10px]">Baldas 1U</span>
                </div>
                <span className="font-black text-white">x{res.numBaldas1U}</span>
             </div>
             <div className="flex justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                <div className="flex items-center gap-2">
                   <LayoutList size={14} className="text-slate-300" />
                   <span className="text-slate-200 font-bold uppercase text-[10px]">Balda Reforzada</span>
                </div>
                <span className="font-black text-white">x{res.numBaldasReforzadas}</span>
             </div>
             <div className="flex justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                <div className="flex items-center gap-2">
                   <Cable size={14} className="text-slate-300" />
                   <span className="text-slate-200 font-bold uppercase text-[10px]">Patch Panels (Auto)</span>
                </div>
                <span className="font-black text-white">x{equipos.filter(e => e.esAutomatico).length}</span>
             </div>
          </div>

          <div className="mt-auto pt-6">
            <button 
              onClick={descargarMaterialesRackPDF} 
              disabled={generandoPDF}
              className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-xl shadow-indigo-900/40 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              title="Descargar dossier técnico con alzado visual en PDF"
            >
              {generandoPDF ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  <span>Generando Plano & PDF...</span>
                </>
              ) : (
                <>
                  <Download size={15} />
                  <span>Descargar Dossier & Alzado (PDF)</span>
                </>
              )}
            </button>
          </div>
        </aside>
      </main>

      {/* Modal para Guardar y Nombrar Proyecto */}
      {mostrarModalGuardar && (
        <div className="modal-overlay" onClick={() => setMostrarModalGuardar(false)}>
          <div 
            className="modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                  <Save size={18} />
                </div>
                <div>
                  <h3 className="text-white font-bold text-base leading-tight">Guardar Proyecto</h3>
                  <p className="text-slate-400 text-xs">Asigna un nombre a la configuración del rack</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setMostrarModalGuardar(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={confirmarGuardarProyecto} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Nombre del Proyecto
                </label>
                <input
                  type="text"
                  autoFocus
                  value={inputNombreProyecto}
                  onChange={(e) => setInputNombreProyecto(e.target.value)}
                  placeholder="Ej: Rack Villa Sol, Rack Central..."
                  className="modal-input"
                  style={{
                    backgroundColor: '#090a0f',
                    color: '#ffffff',
                    border: '1px solid #2d3142',
                    fontSize: '14px',
                    lineHeight: '20px'
                  }}
                />
                <p className="text-[11px] text-slate-400 mt-2">
                  Este nombre aparecerá automáticamente como título oficial en el informe PDF de materiales.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setMostrarModalGuardar(false)}
                  className="modal-btn-cancel"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="modal-btn-confirm"
                >
                  <Check size={14} />
                  Guardar Proyecto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Notificación Toast */}
      {notificacionGuardado && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-emerald-500/90 text-white rounded-xl shadow-xl backdrop-blur border border-emerald-400/40 text-xs font-semibold animate-in fade-in slide-in-from-bottom-3 duration-200">
          <Check size={16} className="text-white" />
          <span>{notificacionGuardado}</span>
        </div>
      )}

      {/* Modal Guía Interactiva & Manual de Uso */}
      {mostrarGuia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200" onClick={() => setMostrarGuia(false)}>
          <div 
            className="w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl border shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
            style={{ 
              backgroundColor: '#0c0e15',
              borderColor: 'rgba(99, 102, 241, 0.3)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 40px -10px rgba(99, 102, 241, 0.2)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header del Modal */}
            <div className="flex items-center justify-between px-6 py-4 border-b shrink-0" style={{ borderColor: 'rgba(255,255,255,0.08)', backgroundColor: '#111420' }}>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
                  <BookOpen size={18} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-white font-extrabold text-base tracking-wide leading-tight">Guía Interactiva & Manual de Uso</h3>
                    <span className="text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      Illusion v3
                    </span>
                  </div>
                  <p className="text-slate-400 text-xs mt-0.5">Aprende a diseñar, reordenar y dimensionar racks profesionales paso a paso</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setMostrarGuia(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Cerrar guía (Esc)"
              >
                <X size={18} />
              </button>
            </div>

            {/* Selector de Pestañas / Pasos Superiores con Formato Homogéneo y de Alto Contraste */}
            <div className="flex items-center justify-start gap-2.5 px-6 py-3.5 border-b overflow-x-auto shrink-0 custom-scrollbar" style={{ borderColor: 'rgba(255,255,255,0.08)', backgroundColor: '#0d101a' }}>
              {PASOS_GUIA.map((paso, idx) => {
                const PasoIcono = paso.icono;
                const activo = pasoGuia === idx;
                
                // Esquema de colores vibrantes estilo píldora para cada pestaña
                const estilosPestana = [
                  { bg: 'bg-sky-500/15 hover:bg-sky-500/25', text: 'text-sky-300 hover:text-sky-200', border: 'border-sky-500/40', iconColor: 'text-sky-400', activeBg: 'bg-sky-500 text-slate-950 border-sky-300 shadow-sky-500/30' },
                  { bg: 'bg-emerald-500/15 hover:bg-emerald-500/25', text: 'text-emerald-300 hover:text-emerald-200', border: 'border-emerald-500/40', iconColor: 'text-emerald-400', activeBg: 'bg-emerald-500 text-slate-950 border-emerald-300 shadow-emerald-500/30' },
                  { bg: 'bg-indigo-500/15 hover:bg-indigo-500/25', text: 'text-indigo-300 hover:text-indigo-200', border: 'border-indigo-500/40', iconColor: 'text-indigo-400', activeBg: 'bg-indigo-500 text-white border-indigo-300 shadow-indigo-500/30' },
                  { bg: 'bg-rose-500/15 hover:bg-rose-500/25', text: 'text-rose-300 hover:text-rose-200', border: 'border-rose-500/40', iconColor: 'text-rose-400', activeBg: 'bg-rose-500 text-white border-rose-300 shadow-rose-500/30' },
                  { bg: 'bg-amber-500/15 hover:bg-amber-500/25', text: 'text-amber-300 hover:text-amber-200', border: 'border-amber-500/40', iconColor: 'text-amber-400', activeBg: 'bg-amber-400 text-slate-950 border-yellow-200 shadow-amber-500/30' },
                  { bg: 'bg-purple-500/15 hover:bg-purple-500/25', text: 'text-purple-300 hover:text-purple-200', border: 'border-purple-500/40', iconColor: 'text-purple-400', activeBg: 'bg-purple-500 text-white border-purple-300 shadow-purple-500/30' },
                  { bg: 'bg-yellow-500/15 hover:bg-yellow-500/25', text: 'text-yellow-300 hover:text-yellow-200', border: 'border-yellow-500/40', iconColor: 'text-yellow-400', activeBg: 'bg-yellow-400 text-slate-950 border-yellow-200 shadow-yellow-500/30' },
                ][idx % 7];

                const titulosCompletos = [
                  '1. Pestañas',
                  '2. Cómo Añadir',
                  '3. Desplazar',
                  '4. Eliminar',
                  '5. Guardar',
                  '6. Descargar',
                  '7. Consumo'
                ];

                return (
                  <button
                    key={paso.id}
                    onClick={() => setPasoGuia(idx)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition-all duration-200 cursor-pointer border shadow-sm active:scale-95 ${
                      activo 
                        ? `${estilosPestana.activeBg} font-black shadow-lg scale-105` 
                        : `${estilosPestana.bg} ${estilosPestana.text} ${estilosPestana.border}`
                    }`}
                  >
                    <PasoIcono size={15} className={`shrink-0 ${activo ? (idx === 0 || idx === 1 || idx === 4 || idx === 6 ? 'text-slate-950 stroke-[2.5]' : 'text-white stroke-[2.5]') : estilosPestana.iconColor}`} />
                    <span className="leading-none whitespace-nowrap">{titulosCompletos[idx] || `${idx + 1}. ${paso.titulo}`}</span>
                  </button>
                );
              })}
            </div>

            {/* Contenido Central del Paso Activo */}
            <div className="flex-1 p-6 overflow-y-auto custom-scrollbar space-y-5">
              {(() => {
                const pasoActual = PASOS_GUIA[pasoGuia];
                const IconoActual = pasoActual.icono;

                return (
                  <div className="space-y-4">
                    {/* Encabezado del Paso */}
                    <div className="flex items-start justify-between gap-4 p-4 rounded-xl border bg-white/[0.02]" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                      <div className="flex items-start gap-3.5">
                        <div 
                          className="p-3 rounded-xl shrink-0 flex items-center justify-center shadow-lg"
                          style={{ backgroundColor: `${pasoActual.color}20`, border: `1px solid ${pasoActual.color}40`, color: pasoActual.color }}
                        >
                          <IconoActual size={24} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md" style={{ backgroundColor: `${pasoActual.color}25`, color: pasoActual.color }}>
                              {pasoActual.badge}
                            </span>
                            <h4 className="text-white font-bold text-lg">{pasoActual.titulo}</h4>
                          </div>
                          <p className="text-slate-300 text-sm font-medium mt-1">{pasoActual.subtitulo}</p>
                          <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">{pasoActual.descripcion}</p>
                        </div>
                      </div>
                    </div>

                    {/* Lista de Puntos Clave */}
                    <div className="space-y-2.5">
                      <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                        <Sparkles size={13} className="text-indigo-400" />
                        Instrucciones y Puntos Clave:
                      </h5>
                      <div className="space-y-2">
                        {pasoActual.puntos.map((punto, pIdx) => (
                          <div key={pIdx} className="flex items-start gap-2.5 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] text-xs text-slate-200 leading-relaxed">
                            <CheckCircle2 size={15} className="text-emerald-400 shrink-0 mt-0.5" />
                            <span>{punto}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Demostración Visual / Ejemplos */}
                    {pasoActual.ejemplo && (
                      <div className="p-3.5 rounded-xl border bg-indigo-950/20 border-indigo-500/20 text-xs space-y-1">
                        <span className="font-bold text-indigo-300 uppercase tracking-wider text-[10px] block">
                          💡 Ejemplo Práctico:
                        </span>
                        <p className="text-slate-300 text-xs leading-relaxed">
                          {pasoActual.ejemplo}
                        </p>
                      </div>
                    )}

                    {/* Pro Tip Callout */}
                    {pasoActual.tip && (
                      <div className="p-3.5 rounded-xl border bg-amber-500/10 border-amber-500/20 text-xs flex items-start gap-2.5 text-amber-200/90">
                        <Zap size={15} className="text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold uppercase tracking-wider text-[10px] text-amber-400 block mb-0.5">Consejo Pro:</span>
                          <span className="text-xs text-amber-100/80">{pasoActual.tip}</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>

            {/* Footer de Navegación del Modal */}
            <div className="flex items-center justify-between px-6 py-4 border-t shrink-0" style={{ borderColor: 'rgba(255,255,255,0.08)', backgroundColor: '#0e1018' }}>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="font-bold text-white">Paso {pasoGuia + 1}</span>
                <span>de {PASOS_GUIA.length}</span>
                <span className="text-slate-600 hidden sm:inline">• Usa las teclas ← / → para navegar o Esc para cerrar</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={pasoGuia === 0}
                  onClick={() => setPasoGuia((prev) => Math.max(0, prev - 1))}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    pasoGuia === 0
                      ? 'opacity-40 cursor-not-allowed bg-white/5 text-slate-500'
                      : 'bg-white/10 hover:bg-white/15 text-slate-200 cursor-pointer active:scale-95'
                  }`}
                >
                  <ArrowLeft size={13} />
                  Anterior
                </button>

                {pasoGuia < PASOS_GUIA.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setPasoGuia((prev) => Math.min(PASOS_GUIA.length - 1, prev + 1))}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-900/40 transition-all cursor-pointer active:scale-95"
                  >
                    Siguiente
                    <ArrowRight size={13} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setMostrarGuia(false)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/40 transition-all cursor-pointer active:scale-95"
                  >
                    <Check size={14} />
                    ¡Entendido! Comenzar a diseñar
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { 
          width: 8px; 
        } 
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0,0,0,0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb { 
          background: rgba(99,102,241,0.5);
          border-radius: 10px;
          border: 2px solid rgba(0,0,0,0.3);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(99,102,241,0.7);
        }
      `}} />
    </div>
  )
}