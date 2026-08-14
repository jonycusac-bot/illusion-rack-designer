import React, { useState, useMemo, useEffect, useRef } from 'react';
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
  PlugZap
} from 'lucide-react';

/**
 * RackDesignerPro - Versión Cinema & Gestión de Cables
 * Ajuste: Sustitución de Lutron/KNX por Crestron RMC4 en Control.
 * Lógica PDU: 1 por cada 3.500W de consumo o 1 cada 6 equipos (el mayor).
 */

export default function App() {
  const CATALOGO_EQUIPOS = [
    // --- REDES ---
    { id: 'udm-pro', nombre: 'UniFi Dream Machine Pro', altura: 44, esRackable: true, categoria: 'Redes', consumo: 33, requiereEscobilla: true, fondo: 285 },
    { id: 'sw-pro-48', nombre: 'UniFi Switch Pro 48 PoE', altura: 44, esRackable: true, categoria: 'Redes', consumo: 600, requiereEscobilla: true, fondo: 400 },
    { id: 'sw-ent-24', nombre: 'UniFi Enterprise 24', altura: 44, esRackable: true, categoria: 'Redes', consumo: 450, requiereEscobilla: true, fondo: 320 },
    { id: 'unifi-router-compact', nombre: 'UniFi Router Compact', altura: 44, esRackable: false, categoria: 'Redes', consumo: 200, ancho: 'media', requiereTapaCiega: true, fondo: 150 },
    
    // --- CONTROL ---
    { id: 'crestron-cp4', nombre: 'Crestron CP4 Control System', altura: 44, esRackable: true, categoria: 'Control', consumo: 15, fondo: 170 },
    { id: 'crestron-rmc4', nombre: 'Crestron RMC4 Processor', altura: 44, esRackable: false, categoria: 'Control', consumo: 10, ancho: 'media', requiereTapaCiega: true, fondo: 120 },
    { id: 'beoliving', nombre: 'Beoliving Intelligence (B&O)', altura: 44, esRackable: false, categoria: 'Control', consumo: 20, ancho: 'media', requiereTapaCiega: true, fondo: 200 },
    
    // --- AUDIO ---
    { id: 'beocore', nombre: 'BeoCore (B&O)', altura: 44, esRackable: false, categoria: 'Audio', consumo: 50, fondo: 310, ancho: 'media', requiereTapaCiega: true },
    { id: 'sonance-dsp', nombre: 'Sonance DSP 8-125', altura: 44, esRackable: true, categoria: 'Audio', consumo: 600, fondo: 425, requiereEscobilla: true },
    { id: 'beoamp2', nombre: 'B&O Beoamp2', altura: 44, esRackable: true, categoria: 'Audio', consumo: 300, fondo: 250 },
    { id: 'sonos-port', nombre: 'Sonos Port', altura: 44, esRackable: false, categoria: 'Audio', consumo: 10, ancho: 'media', requiereTapaCiega: true, fondo: 150 },
    { id: 'sonos-amp', nombre: 'Sonos Amp', altura: 88, esRackable: false, categoria: 'Audio', consumo: 100, ancho: 'media', requiereTapaCiega: true, fondo: 220 },
    { id: 'sonos-amp-multi', nombre: 'Sonos Amp Multi', altura: 88, esRackable: true, categoria: 'Audio', consumo: 200, fondo: 220, uOcupadas: 2 },
    { id: 'matrix-audio', nombre: 'Matriz Audio 16x16', altura: 88, esRackable: true, categoria: 'Audio', consumo: 80, fondo: 350 },
    
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
  ];

  const [equipos, setEquipos] = useState([]);
  const [categoriasAbiertas, setCategoriasAbiertas] = useState([]);
  const [timerAutoReplegado, setTimerAutoReplegado] = useState(null);

  // Drag & drop state
  const dragIndexRef = useRef(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [draggingIndex, setDraggingIndex] = useState(null);

  // Auto-replegado de pestañas después de 10 segundos
  useEffect(() => {
    if (categoriasAbiertas.length > 0) {
      // Limpiar timer anterior si existe
      if (timerAutoReplegado) {
        clearTimeout(timerAutoReplegado);
      }
      
      // Crear nuevo timer
      const nuevoTimer = setTimeout(() => {
        setCategoriasAbiertas([]);
      }, 10000); // 10 segundos
      
      setTimerAutoReplegado(nuevoTimer);
    }
    
    // Cleanup al desmontar el componente
    return () => {
      if (timerAutoReplegado) {
        clearTimeout(timerAutoReplegado);
      }
    };
  }, [categoriasAbiertas]);

  const toggleCategoria = (cat) => {
    setCategoriasAbiertas(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const UNIDAD_RACK_MM = 44.45;
  const PIXELS_PER_U = 50; 
  const RACKS_COMERCIALES = [4, 6, 9, 12, 15, 18, 22, 27, 32, 37, 42, 47];

  const agregarItem = (item) => {
    // Reproducir sonido de click al añadir
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Sonido más audible: "beep" corto ascendente
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.05);
      
      gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch (e) {
      console.log('Audio no disponible');
    }
    
    const uCalculadas = item.uOcupadas || Math.ceil(item.altura / UNIDAD_RACK_MM);
    const nuevoItem = { 
      ...item, 
      instanceId: Math.random().toString(36).substr(2, 9), 
      uOcupadas: uCalculadas,
      timestamp: Date.now()
    };
    
    // Si es un router UniFi, añadir automáticamente un Patch Panel
    if (item.id.includes('udm') || item.id.includes('sw-')) {
      const patchPanel = {
        id: 'patch-panel-auto',
        nombre: 'Patch Panel (Auto)',
        altura: 44,
        esRackable: true,
        categoria: 'Redes',
        consumo: 0,
        requiereEscobilla: false,
        fondo: 200,
        instanceId: Math.random().toString(36).substr(2, 9),
        uOcupadas: 1,
        timestamp: Date.now() + 1,
        esAutomatico: true
      };
      setEquipos([...equipos, nuevoItem, patchPanel]);
    } else {
      setEquipos([...equipos, nuevoItem]);
    }
  };

  const eliminarItem = (id) => {
    // Reproducir sonido al eliminar (tono descendente)
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Sonido descendente para "eliminar"
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.08);
      
      gainNode.gain.setValueAtTime(0.4, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch (e) {
      console.log('Audio no disponible');
    }
    
    setEquipos(prev => prev.filter(e => e.instanceId !== id));
  };

  // Drag & drop handlers para reordenar equipos en el rack
  const handleDragStart = (e, index) => {
    dragIndexRef.current = index;
    setDraggingIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = (e) => {
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
    setEquipos(prev => {
      const updated = [...prev];
      const [moved] = updated.splice(index, 1);
      updated.splice(nuevoIndex, 0, moved);
      return updated;
    });
  };

  // Funciones para guardar y cargar proyectos
  const guardarProyecto = () => {
    const nombreSugerido = `Proyecto_${new Date().toLocaleDateString('es-ES').replace(/\//g, '-')}`;
    const nombre = window.prompt('Nombre del proyecto:', nombreSugerido);
    if (nombre === null) return; // cancelado
    const nombreFinal = nombre.trim() || nombreSugerido;

    const proyecto = {
      equipos: equipos,
      nombre: nombreFinal,
      fecha: new Date().toISOString(),
      version: '1.0'
    };

    const proyectosGuardados = JSON.parse(localStorage.getItem('illusion-proyectos') || '[]');
    proyectosGuardados.push(proyecto);
    localStorage.setItem('illusion-proyectos', JSON.stringify(proyectosGuardados));

    alert(`Proyecto guardado como: ${nombreFinal}`);
  };

  const cargarProyecto = (proyecto) => {
    setEquipos(proyecto.equipos || []);
    alert(`Proyecto "${proyecto.nombre}" cargado correctamente`);
  };

  const obtenerProyectosGuardados = () => {
    return JSON.parse(localStorage.getItem('illusion-proyectos') || '[]');
  };

  const eliminarProyecto = (index) => {
    const proyectos = obtenerProyectosGuardados();
    proyectos.splice(index, 1);
    localStorage.setItem('illusion-proyectos', JSON.stringify(proyectos));
  };

  // Función para descargar listado de materiales de rack
  const descargarMaterialesRack = () => {
    const fecha = new Date().toLocaleDateString('es-ES');
    const hora = new Date().toLocaleTimeString('es-ES');
    const equiposNoRackables = equipos.filter(e => !e.esRackable);
    const baldasNecesarias = Math.ceil(equiposNoRackables.length / 2);

    let contenido = `
╔══════════════════════════════════════════════════════════════════════════════════════╗
║                           ILLUSION - MATERIALES DE RACK                             ║
║                              LISTADO DE INFRAESTRUCTURA                             ║
╚══════════════════════════════════════════════════════════════════════════════════════╝

📅 FECHA: ${fecha}
🕐 HORA: ${hora}
🏢 EMPRESA: Illusion.es

═══════════════════════════════════════════════════════════════════════════════════════
📋 RESUMEN DEL RACK:
═══════════════════════════════════════════════════════════════════════════════════════
• Rack recomendado: ${res.rackRecomendado}U
• Equipos a instalar: ${equipos.length} unidades
• Unidades ocupadas: ${res.totalUNecesariasFrontales}U
• Unidades libres: ${res.rackRecomendado - res.totalUNecesariasFrontales}U

═══════════════════════════════════════════════════════════════════════════════════════
🏗️ ESTRUCTURA Y RACK:
═══════════════════════════════════════════════════════════════════════════════════════
• Rack ${res.rackRecomendado}U: x1
• Termostato (obligatorio): x1

═══════════════════════════════════════════════════════════════════════════════════════
⚡ ALIMENTACIÓN ELÉCTRICA:
═══════════════════════════════════════════════════════════════════════════════════════
• Regletas PDU (traseras): x${res.numRegletasTraseras}
  └─ Cálculo: 1 PDU por cada 3.500W o 1 cada 6 equipos (el mayor)
  └─ Consumo total estimado: ${res.consumoTotal}W

• Instalación eléctrica necesaria: x${res.numLineasElectricas} línea${res.numLineasElectricas > 1 ? 's' : ''}
  └─ Cable 2,5 mm²: x${res.numLineasElectricas}
  └─ Magnetotérmicos 16A: x${res.numLineasElectricas}
  └─ Diferenciales 40A / 30mA: x${res.numLineasElectricas}
  └─ Consumo total del rack: ${res.consumoTotal}W (máx. 3.680W por línea)

═══════════════════════════════════════════════════════════════════════════════════════
🔗 CONECTIVIDAD Y CABLEADO:
═══════════════════════════════════════════════════════════════════════════════════════
• Pasacables posteriores: x${res.pasacablesTraseros}
• Escobillas pasacables: x${res.numEscobillas}
• Patch Panels (automáticos): x${equipos.filter(e => e.esAutomatico).length}
  └─ Añadidos automáticamente con routers UniFi

═══════════════════════════════════════════════════════════════════════════════════════
🛠️ ACCESORIOS Y HERRAJES:
═══════════════════════════════════════════════════════════════════════════════════════
• Tornillería M6: x${res.numTornillos} tornillos
  └─ Cálculo: 4 tornillos por equipo

═══════════════════════════════════════════════════════════════════════════════════════
🏠 BALDAS Y SOPORTES:
═══════════════════════════════════════════════════════════════════════════════════════`;

    if (baldasNecesarias > 0) {
      contenido += `
• Baldas 1U: x${res.numBaldas1U}
• Baldas reforzadas: x${res.numBaldasReforzadas}
  └─ Para equipos no rackables (${equiposNoRackables.length} equipos)`;
    } else {
      contenido += `
• No se requieren baldas adicionales
  └─ Todos los equipos son rackables`;
    }

    contenido += `

═══════════════════════════════════════════════════════════════════════════════════════
🌡️ VENTILACIÓN Y CLIMATIZACIÓN:
═══════════════════════════════════════════════════════════════════════════════════════
• Termostato digital: x1 (incluido)
• Ventilador superior: x1${res.rackRecomendado >= 24 ? `
• Ventilador intermedio: x1` : ''}
  └─ ${res.rackRecomendado < 24 ? 'Rack menor a 24U: solo ventilador superior' : 'Rack ≥24U: ventilador superior + intermedio'}

═══════════════════════════════════════════════════════════════════════════════════════
📦 RESUMEN DE CANTIDADES:
═══════════════════════════════════════════════════════════════════════════════════════
┌─────────────────────────────────────┬──────────┐
│ ELEMENTO                            │ CANTIDAD │
├─────────────────────────────────────┼──────────┤
│ Rack ${res.rackRecomendado}U                    │    x1    │
│ Regletas PDU                        │    x${res.numRegletasTraseras}    │
│ Líneas eléctricas 2,5 mm²           │    x${res.numLineasElectricas}    │
│ Magnetotérmicos 16A                 │    x${res.numLineasElectricas}    │
│ Diferenciales 40A/30mA              │    x${res.numLineasElectricas}    │
│ Pasacables posteriores              │    x${res.pasacablesTraseros}    │
│ Escobillas pasacables               │    x${res.numEscobillas}    │
│ Patch Panels automáticos            │    x${equipos.filter(e => e.esAutomatico).length}    │
│ Tornillos M6                        │    x${res.numTornillos}   │`;

    if (res.numBaldas1U > 0) {
      contenido += `
│ Baldas 1U                           │    x${res.numBaldas1U}    │`;
    }
    if (res.numBaldasReforzadas > 0) {
      contenido += `
│ Baldas reforzadas                   │    x${res.numBaldasReforzadas}    │`;
    }

    contenido += `
│ Termostato digital                  │    x1    │
│ Ventilador superior                 │    x1    │`;
    
    if (res.rackRecomendado >= 24) {
      contenido += `
│ Ventilador intermedio               │    x1    │`;
    }

    contenido += `
└─────────────────────────────────────┴──────────┘

═══════════════════════════════════════════════════════════════════════════════════════
📝 NOTAS PARA EL INSTALADOR:
═══════════════════════════════════════════════════════════════════════════════════════
• Verificar profundidad del rack según equipos a instalar
• Los Patch Panels se calculan automáticamente con routers UniFi
• Regletas PDU: distribuir uniformemente en la parte trasera
• Termostato: instalar en la parte superior del rack
• Ventiladores: rack <24U solo superior, rack ≥24U superior + intermedio
• Consumo total: ${res.consumoTotal}W — requiere ${res.numLineasElectricas} línea${res.numLineasElectricas > 1 ? 's' : ''} eléctrica${res.numLineasElectricas > 1 ? 's' : ''} de 2,5 mm²

═══════════════════════════════════════════════════════════════════════════════════════
🏢 GENERADO POR: Illusion Rack Designer Pro v2.0.0

📧 CONTACTO: info@e-illusion.es
🌐 WEB: http://www.illusion.es
═══════════════════════════════════════════════════════════════════════════════════════
`;

    const blob = new Blob([contenido], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Illusion_Materiales_Rack_${fecha.replace(/\//g, '-')}_${hora.replace(/:/g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const res = useMemo(() => {
    let numEscobillas = 0;
    let numTapasAutomaticas = 0;
    let numTapasBalda = 0;
    let pasacablesTraseros = 0;
    const rackItems = [];
    const bloquesBaldas = [];

    // Procesamos equipos EN ORDEN DE INSERCIÓN
    // Los no-rackables de ancho 'media' se van acumulando hasta tener pareja
    const pendientesMedia = [];

    const procesarNoRackable = (eq) => {
      if (eq.ancho === 'media') {
        const indexPareja = pendientesMedia.findIndex(e => e.ancho === 'media');
        if (indexPareja !== -1) {
          // Tenemos pareja: 1 solo pasacable por los dos
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
          // Sin pareja aún: pendiente, el pasacable se suma cuando forme bloque
          pendientesMedia.push(eq);
        }
      } else {
        // Ancho completo: balda individual, 1 pasacable
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
        // Rackable: va directo al rack
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

    // Equipos 'media' que quedaron sin pareja: baldas individuales
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
    
    // Regletas PDU: 1 por cada 3.500W de consumo (máximo por PDU)
    const consumoTotalCalc = equipos.reduce((sum, eq) => sum + (eq.consumo || 0), 0);
    const numEquiposTotal = equipos.length;
    const numRegletasTraseras = consumoTotalCalc === 0 ? (numEquiposTotal === 0 ? 0 : Math.ceil(numEquiposTotal / 6)) : Math.max(Math.ceil(consumoTotalCalc / 3500), Math.ceil(numEquiposTotal / 6));
    
    const totalUNecesariasFrontales = uDeEquiposTotal + infraestructuraSuperiorU;
    const rackRecomendado = RACKS_COMERCIALES.find(r => r >= totalUNecesariasFrontales) || 47;
    
    const numVentiladores = rackRecomendado < 24 ? 1 : 2;
    
    // Añadir ventilador adicional en medio del rack si supera 24U
    if (rackRecomendado >= 24 && rackItems.length > 0) {
      const mitadRack = Math.floor(rackItems.length / 2);
      const ventiladorAdicional = {
        instanceId: 'ventilador-adicional-auto',
        nombre: 'Ventilador Adicional 1U',
        categoria: 'Ventilacion',
        uOcupadas: 1,
        esVentiladorAdicional: true
      };
      rackItems.splice(mitadRack, 0, ventiladorAdicional);
    }
    
    // Calcular bandejas de ventilación para Sonos Amp
    const bandejasSonosAmp = bloquesBaldas.filter(bloque => bloque.tieneVentilacionArriba).length;
    
    // Calcular escobillas manuales añadidas desde Accesorios
    const escobillasAccesorios = equipos.filter(e => e.id === 'escobilla-acc').length;

    // Calcular total de rejillas de ventilación (Cinema + Sonos Amp)
    const totalBandejasVentilacion = numTapasAutomaticas + bandejasSonosAmp;
    
    // Calcular placas ciegas de accesorios (1U y 2U)
    const placasCiegasAccesorios = equipos.filter(e => 
      e.id === 'placa-ciega-1u' || e.id === 'placa-ciega-2u'
    ).length;

    // Calcular baldas 1U (automáticas con Sonos Amp, Sonos Port, Crestron RMC4, Beoliving, BeoCore, Apple TV)
    const esBaldaLigera = (eq) => ['sonos-amp', 'sonos-port', 'crestron-rmc4', 'beoliving', 'beocore', 'apple-tv', 'receptor-sat'].includes(eq.id);
    const numBaldas1U = bloquesBaldas.filter(bloque =>
      bloque.equipos.some(e => esBaldaLigera(e))
    ).length;

    // Calcular baldas reforzadas (1 por cada equipo de Cinema)
    const numBaldasReforzadas = equipos.filter(e => e.categoria === 'Cinema').length;

    return {
      rackItems,
      bloquesBaldas,
      rackRecomendado,
      numRegletasTraseras,
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
      numBaldasReforzadas
    };
  }, [equipos]);

  const getCategoryIcon = (cat) => {
    switch(cat) {
      case 'Redes': return <Wifi size={12} className="text-blue-500" />;
      case 'Control': return <Settings size={12} className="text-indigo-500" />;
      case 'Audio': return <Volume2 size={12} className="text-emerald-500" />;
      case 'Video': return <Monitor size={12} className="text-purple-500" />;
      case 'Cinema': return <Film size={12} className="text-rose-500" />;
      case 'Energía': return <Battery size={12} className="text-orange-500" />;
      case 'Otros': return <Package size={12} className="text-slate-400" />;
      case 'Accesorios': return <LayoutList size={12} className="text-cyan-500" />;
      default: return <Server size={12} className="text-slate-400" />;
    }
  };

  const getCategoryTheme = (cat) => {
    switch(cat) {
      case 'Redes': return { color: 'text-green-400', rackColor: 'bg-green-600' };
      case 'Audio': return { color: 'text-blue-500', rackColor: 'bg-blue-600' };
      case 'Video': return { color: 'text-purple-500', rackColor: 'bg-purple-600' };
      case 'Control': return { color: 'text-indigo-500', rackColor: 'bg-indigo-600' };
      case 'Cinema': return { color: 'text-rose-500', rackColor: 'bg-rose-700' };
      case 'Energía': return { color: 'text-orange-500', rackColor: 'bg-orange-600' };
      case 'Otros': return { color: 'text-slate-400', rackColor: 'bg-slate-600' };
      default: return { color: 'text-slate-400', rackColor: 'bg-slate-800' };
    }
  };

  return (
    <div className="h-screen text-slate-100 flex flex-col overflow-hidden font-sans" style={{ backgroundColor: 'var(--bg-app)' }}>
      <header className="h-14 flex items-center justify-between px-8 border-b shrink-0"
              style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-lg" style={{ backgroundColor: 'var(--accent)' }}>
            <ShieldCheck className="text-white w-5 h-5" />
          </div>
          <h1 style={{ fontSize: 'var(--font-brand)', fontWeight: 500, letterSpacing: '0.5px' }}>
            Illusion <span style={{ color: '#e0e1e6', fontWeight: 300 }}>Rack Designer Pro v2.1</span>
          </h1>
        </div>
        <div className="flex items-center gap-8" style={{ fontSize: '10px', fontWeight: 700 }}>
           <div className="flex gap-6">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ backgroundColor: 'rgba(224, 153, 63, 0.15)' }}>
                 <Zap size={16} style={{ color: '#fbbf24' }} />
                 <span className="uppercase tracking-tight font-extrabold" style={{ color: '#fbbf24', fontSize: '12px' }}>Consumo: {res.consumoTotal}W</span>
              </div>
              <div className="flex items-center gap-2">
                 <PlugZap size={14} style={{ color: 'var(--accent-light)' }} />
                 <span className="uppercase tracking-tighter" style={{ color: 'var(--accent-light)' }}>PDUs: x{res.numRegletasTraseras}</span>
              </div>
           </div>
           <div className="flex items-center gap-2">
             <button onClick={guardarProyecto} className="p-2 rounded-full transition-colors" style={{ color: 'var(--text-muted)' }} title="Guardar proyecto"
               onMouseEnter={e => e.currentTarget.style.color='#4ade80'} onMouseLeave={e => e.currentTarget.style.color='var(--text-muted)'}>
               <Save size={16} />
             </button>
             <div className="relative group">
               <button className="p-2 rounded-full transition-colors" style={{ color: 'var(--text-muted)' }} title="Cargar proyecto">
                 <FolderOpen size={16} />
               </button>
               <div className="absolute right-0 top-full mt-2 w-64 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 border"
                    style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border)' }}>
                 <div className="p-2 max-h-48 overflow-y-auto">
                   {obtenerProyectosGuardados().length === 0 ? (
                     <p className="text-xs p-2" style={{ color: 'var(--text-secondary)' }}>No hay proyectos guardados</p>
                   ) : (
                     obtenerProyectosGuardados().map((proyecto, index) => (
                       <div key={index} className="flex items-center justify-between p-2 hover:bg-white/5 rounded text-xs">
                         <div className="flex-1 cursor-pointer" onClick={() => cargarProyecto(proyecto)}>
                           <div className="font-medium" style={{ color: 'var(--text-primary)' }}>{proyecto.nombre}</div>
                           <div style={{ color: 'var(--text-secondary)' }}>{new Date(proyecto.fecha).toLocaleDateString('es-ES')}</div>
                         </div>
                         <button onClick={() => eliminarProyecto(index)} className="ml-2" style={{ color: 'var(--text-secondary)' }}>
                           <Trash2 size={12} />
                         </button>
                       </div>
                     ))
                   )}
                 </div>
               </div>
             </div>
             <button onClick={() => setEquipos([])} className="p-2 rounded-full transition-colors" style={{ color: 'var(--text-muted)' }} title="Limpiar todo"
               onMouseEnter={e => e.currentTarget.style.color='#f87171'} onMouseLeave={e => e.currentTarget.style.color='var(--text-muted)'}>
               <RotateCcw size={16} />
             </button>
           </div>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        <aside className="w-[410px] border-r p-4 overflow-y-auto shrink-0 custom-scrollbar" style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border)' }}>
          <p className="text-[9px] font-black uppercase tracking-widest mb-4" style={{ color: 'var(--text-muted)' }}>Librería Illusion</p>
          <div className="space-y-2">
            {[...new Set(CATALOGO_EQUIPOS.map(i => i.categoria))].map(cat => (
              <div key={cat} className="rounded-lg overflow-hidden border" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-highlight)' }}>
                <button
                  onClick={() => toggleCategoria(cat)}
                  className="w-full px-3 py-2.5 flex items-center justify-between transition-colors hover:bg-white/5"
                >
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(cat)}
                    <span className="font-bold uppercase tracking-wider" style={{ fontSize: 'var(--font-label)', color: 'var(--text-secondary)' }}>{cat}</span>
                  </div>
                  <ChevronDown size={12} style={{ color: 'var(--text-muted)' }} className={`transition-transform duration-300 ${categoriasAbiertas.includes(cat) ? 'rotate-180' : ''}`} />
                </button>
                {categoriasAbiertas.includes(cat) && (
                  <div className="p-2 border-t" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-app)' }}>
                    {CATALOGO_EQUIPOS.filter(i => i.categoria === cat).map(item => (
                      <button key={item.id} onClick={() => agregarItem(item)}
                        className="w-full p-3 rounded-lg group text-left flex justify-between items-center mb-2 transition-all duration-200 border hover:shadow-lg"
                        style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border)' }}
                        onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--accent)'; e.currentTarget.style.borderColor = 'var(--accent)'; }}
                        onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'var(--bg-panel)'; e.currentTarget.style.borderColor = 'var(--border)'; }}>
                        <span className="font-semibold truncate" style={{ fontSize: 'var(--font-rack)', color: 'var(--text-primary)' }}>{item.nombre}</span>
                        <div className="flex items-center justify-center w-7 h-7 rounded-full flex-shrink-0 ml-2" style={{ backgroundColor: 'rgba(58,62,224,0.15)' }}>
                          <Plus size={13} style={{ color: 'var(--accent-light)' }} />
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Rack Recomendado */}
          <div className="mt-6 p-4 rounded-lg border" style={{ backgroundColor: 'var(--bg-highlight)', borderColor: 'var(--border-active)', borderLeftWidth: '3px' }}>
            <h2 className="leading-none font-black" style={{ fontSize: '3rem', color: 'var(--text-primary)' }}>
              {res.rackRecomendado}<span className="text-xl ml-2" style={{ color: 'var(--accent-light)' }}>U</span>
            </h2>
            <p className="font-black uppercase tracking-widest mt-2 pl-3" style={{ fontSize: '9px', color: 'var(--accent-light)', borderLeft: '3px solid var(--accent)' }}>
              Rack Illusion Recomendado
            </p>
          </div>
        </aside>

        <section className="max-w-[450px] flex-1 relative flex items-center justify-center p-4 overflow-hidden" style={{ backgroundColor: 'var(--bg-app)' }}>
          <div className="relative w-full max-w-[400px] h-full flex flex-col rounded-lg border-x-[24px]"
               style={{ backgroundColor: 'var(--bg-rack)', borderColor: '#2a2d35', boxShadow: '0 0 40px rgba(58,62,224,0.15)', outline: '1px solid var(--border)' }}>
            <div className="flex-1 flex flex-col p-1 overflow-y-auto custom-scrollbar">
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
                                           e.categoria === 'Control' ? '#4f46e5' :
                                           e.categoria === 'Cinema' ? '#be123c' :
                                           e.categoria === 'Energía' ? '#ea580c' :
                                           e.categoria === 'Otros' ? '#16a34a' : '#475569';
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
                                <span className="flex-1 font-black uppercase text-white text-[11px] px-1 leading-tight text-center">{e.nombre}</span>
                                {isDraggable && (
                                  <div className="w-4 shrink-0 flex flex-col items-center justify-center gap-0.5">
                                    <button
                                      onClick={() => moverEquipo(equipoRealIndex, -1)}
                                      disabled={equipoRealIndex === 0}
                                      className="opacity-0 group-hover/item:opacity-100 transition-all disabled:opacity-10 disabled:cursor-not-allowed"
                                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.5)', fontSize: '8px', lineHeight: 1, padding: '1px 3px' }}>
                                      ▲
                                    </button>
                                    <button
                                      onClick={() => moverEquipo(equipoRealIndex, 1)}
                                      disabled={equipoRealIndex === equipos.length - 1}
                                      className="opacity-0 group-hover/item:opacity-100 transition-all disabled:opacity-10 disabled:cursor-not-allowed"
                                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.5)', fontSize: '8px', lineHeight: 1, padding: '1px 3px' }}>
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

                  // ── VENTILADOR ADICIONAL (automático en racks >24U) ────
                  if (item.esVentiladorAdicional) {
                    return (
                      <div key={item.instanceId} 
                           style={{ 
                             height: `${PIXELS_PER_U}px`,
                             background: 'linear-gradient(90deg, rgba(59, 130, 246, 0.08) 0%, rgba(96, 165, 250, 0.15) 50%, rgba(59, 130, 246, 0.08) 100%)',
                             borderBottom: '1px solid var(--border)'
                           }} 
                           className="w-full flex items-center justify-center gap-3">
                        <div className="flex gap-1">{[...Array(8)].map((_, j) => (
                          <div key={j} className="w-1 h-3 bg-blue-400 rounded-full" style={{ opacity: 0.3 + (j * 0.08) }} />
                        ))}</div>
                        <span className="fan-spin" style={{ color: '#60a5fa', display: 'inline-block' }}>
                          <Fan size={18} />
                        </span>
                        <span className="uppercase" style={{ fontSize: '13px', letterSpacing: '2px', color: '#60a5fa', fontWeight: 700 }}>Ventilador</span>
                        <div className="flex gap-1">{[...Array(8)].map((_, j) => (
                          <div key={j} className="w-1 h-3 bg-blue-400 rounded-full" style={{ opacity: 0.3 + ((7 - j) * 0.08) }} />
                        ))}</div>
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
                                         eq.esAccesorio ? '#000000' :
                                         eq.categoria === 'Redes' ? '#475569' :
                                         eq.categoria === 'Audio' ? '#2563eb' :
                                         eq.categoria === 'Video' ? '#9333ea' :
                                         eq.categoria === 'Control' ? '#4f46e5' :
                                         eq.categoria === 'Cinema' ? '#be123c' :
                                         eq.categoria === 'Energía' ? '#ea580c' :
                                         eq.categoria === 'Otros' ? '#16a34a' :
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
                      <div className="flex-1 flex items-center justify-center overflow-hidden">
                        {eq.tipoPasivo === 'Ventilacion' || eq.esRejillaVentilacion ? (
                          <div className="flex items-center gap-2">
                            <Fan size={11} className="text-white/40 shrink-0" />
                            <span className="text-[10px] font-bold text-white uppercase tracking-widest">PLACA CIEGA 1U</span>
                          </div>
                        ) : eq.tipoPasivo === 'Escobilla' || eq.tipoPasivo === 'Ciego' ? (
                          <div className="flex items-center gap-2">
                            {!eq.esEscobilla && <Fan size={11} className="text-white/40 shrink-0" />}
                            <span className="text-[10px] font-bold text-white uppercase tracking-widest">
                              {eq.esEscobilla ? 'ESCOBILLA PASACABLES' : 'PLACA CIEGA 1U'}
                            </span>
                          </div>
                        ) : eq.categoria === 'Accesorios' ? (
                          <div className="flex items-center gap-2">
                            {eq.id !== 'escobilla-acc' && <Fan size={11} className="text-white/40 shrink-0" />}
                            <span className="text-[10px] font-bold text-white uppercase tracking-widest">
                              {eq.id === 'placa-ciega-2u' ? 'PLACA CIEGA 2U' : eq.id === 'escobilla-acc' ? 'ESCOBILLA PASACABLES' : 'PLACA CIEGA 1U'}
                            </span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center">
                            <span className="font-black uppercase tracking-tight px-4 truncate text-[14px] text-white">{eq.nombre}</span>
                            <span className="text-[10px] font-bold opacity-50 uppercase tracking-widest">{eq.categoria}</span>
                          </div>
                        )}
                      </div>
                      <div className="w-8 shrink-0 flex flex-col items-center justify-center gap-0.5">
                        {isDraggable && (
                          <>
                            <button
                              onClick={() => moverEquipo(equipoRealIndex, -1)}
                              disabled={equipoRealIndex === 0}
                              className="opacity-0 group-hover:opacity-100 transition-all disabled:opacity-10 disabled:cursor-not-allowed"
                              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.5)', fontSize: '9px', lineHeight: 1, padding: '2px 4px' }}>
                              ▲
                            </button>
                            <button
                              onClick={() => moverEquipo(equipoRealIndex, 1)}
                              disabled={equipoRealIndex === equipos.length - 1}
                              className="opacity-0 group-hover:opacity-100 transition-all disabled:opacity-10 disabled:cursor-not-allowed"
                              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.5)', fontSize: '9px', lineHeight: 1, padding: '2px 4px' }}>
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

        <aside className="w-[410px] bg-slate-900/40 border-l border-white/5 flex flex-col shrink-0 p-6 overflow-y-auto custom-scrollbar text-[11px]">
          <p className="text-[11px] font-black text-slate-300 uppercase tracking-widest mb-6">Configuración Técnica</p>
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
                   <Zap size={14} className="text-slate-300" />
                   <span className="text-slate-200 font-bold uppercase text-[10px]">Regletas (Traseras)</span>
                </div>
                <span className="font-black text-white">x{res.numRegletasTraseras}</span>
             </div>
             <div className="flex justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                <div className="flex items-center gap-2">
                   <Cable size={14} className="text-slate-300" />
                   <span className="text-slate-200 font-bold uppercase text-[10px]">Pasacables (Posterior)</span>
                </div>
                <span className="font-black text-white">x{res.pasacablesTraseros}</span>
             </div>
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
                   <Settings size={14} className="text-slate-300" />
                   <span className="text-slate-200 font-bold uppercase text-[10px]">Tornillería</span>
                </div>
                <span className="font-black text-white">x{res.numTornillos}</span>
             </div>
             <div className="flex justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                <div className="flex items-center gap-2">
                   <Cable size={14} className="text-slate-300" />
                   <span className="text-slate-200 font-bold uppercase text-[10px]">Patch Panels (Auto)</span>
                </div>
                <span className="font-black text-white">x{equipos.filter(e => e.esAutomatico).length}</span>
             </div>
          </div>

          <div className="mt-6">
             <div className="flex flex-col p-3 bg-yellow-500/10 rounded-xl border border-yellow-500/30">
                <div className="flex justify-between items-center mb-2">
                   <div className="flex items-center gap-2">
                      <Zap size={14} className="text-yellow-400" />
                      <span className="text-yellow-400 font-black uppercase text-[9px]">Instalación Eléctrica</span>
                   </div>
                   <span className="font-black text-yellow-300/80 text-[8px]">{res.consumoTotal}W total</span>
                </div>
                <div className="text-[8px] text-yellow-400/80 space-y-1 pl-1">
                   <div className="flex justify-between">
                      <span>Líneas de 2,5 mm²</span>
                      <span className="font-black text-white">x{res.numLineasElectricas}</span>
                   </div>
                   <div className="flex justify-between">
                      <span>Magnetotérmicos 16A</span>
                      <span className="font-black text-white">x{res.numLineasElectricas}</span>
                   </div>
                   <div className="flex justify-between">
                      <span>Diferenciales 40A / 30mA</span>
                      <span className="font-black text-white">x{res.numLineasElectricas}</span>
                   </div>
                </div>
             </div>
          </div>

          <div className="mt-auto pt-6">
            <button onClick={descargarMaterialesRack} className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-900/40 transition-all active:scale-95 flex items-center justify-center gap-2">
              <Download size={14} />
              Descargar Materiales de Rack
            </button>
          </div>
        </aside>
      </main>

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