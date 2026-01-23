import React, { useState, useMemo } from 'react';
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
  Battery
} from 'lucide-react';

/**
 * RackDesignerPro - Versión Cinema & Gestión de Cables
 * Ajuste: Sustitución de Lutron/KNX por Crestron RMC4 en Control.
 * Lógica PDU: 1 cada 6 equipos totales.
 */

export default function App() {
  const CATALOGO_EQUIPOS = [
    // --- REDES ---
    { id: 'udm-pro', nombre: 'UniFi Dream Machine Pro', altura: 44, esRackable: true, categoria: 'Redes', consumo: 33, requiereEscobilla: true, fondo: 285 },
    { id: 'sw-pro-48', nombre: 'UniFi Switch Pro 48 PoE', altura: 44, esRackable: true, categoria: 'Redes', consumo: 600, requiereEscobilla: true, fondo: 400 },
    { id: 'sw-ent-24', nombre: 'UniFi Enterprise 24', altura: 44, esRackable: true, categoria: 'Redes', consumo: 400, requiereEscobilla: true, fondo: 320 },
    
    // --- CONTROL ---
    { id: 'crestron-cp4', nombre: 'Crestron CP4 Control System', altura: 44, esRackable: true, categoria: 'Control', consumo: 15, fondo: 170 },
    { id: 'crestron-rmc4', nombre: 'Crestron RMC4 Processor', altura: 44, esRackable: false, categoria: 'Control', consumo: 10, ancho: 'media', requiereTapaCiega: true, fondo: 120 },
    { id: 'beoliving', nombre: 'Beoliving Intelligence (B&O)', altura: 44, esRackable: false, categoria: 'Control', consumo: 20, ancho: 'media', requiereTapaCiega: true, fondo: 200 },
    
    // --- AUDIO ---
    { id: 'beocore', nombre: 'BeoCore (B&O)', altura: 44, esRackable: false, categoria: 'Audio', consumo: 50, fondo: 310, ancho: 'media', requiereTapaCiega: true },
    { id: 'sonance-dsp', nombre: 'Sonance DSP 8-125', altura: 88, esRackable: true, categoria: 'Audio', consumo: 600, fondo: 425 },
    { id: 'beoamp2', nombre: 'B&O Beoamp2', altura: 44, esRackable: true, categoria: 'Audio', consumo: 300, fondo: 250 },
    { id: 'sonos-port', nombre: 'Sonos Port', altura: 44, esRackable: false, categoria: 'Audio', consumo: 10, ancho: 'media', requiereTapaCiega: true, fondo: 150 },
    { id: 'matrix-audio', nombre: 'Matriz Audio 16x16', altura: 88, esRackable: true, categoria: 'Audio', consumo: 80, fondo: 350 },
    
    // --- VIDEO ---
    { id: 'apple-tv', nombre: 'Apple TV 4K', altura: 35, esRackable: false, categoria: 'Video', consumo: 6, requiereTapaCiega: true, ancho: 'media', fondo: 93 },
    { id: 'kaleidescape', nombre: 'Kaleidescape Strato', altura: 44, esRackable: true, categoria: 'Video', consumo: 30, fondo: 250 },
    
    // --- CINEMA ---
    { id: 'marantz-av', nombre: 'Marantz AV Processor', altura: 177, esRackable: true, categoria: 'Cinema', consumo: 100, fondo: 411, uOcupadas: 4 },
    { id: 'integra-drx', nombre: 'Integra DRX Series', altura: 177, esRackable: true, categoria: 'Cinema', consumo: 110, fondo: 390, uOcupadas: 4 },
    { id: 'audiocontrol-av', nombre: 'AudioControl Maestro', altura: 177, esRackable: true, categoria: 'Cinema', consumo: 120, fondo: 420, uOcupadas: 4 },

    // --- ENERGÍA ---
    { id: 'ups-apc', nombre: 'SAI APC Smart-UPS 1500', altura: 88, esRackable: true, categoria: 'Energía', consumo: 0, fondo: 457 },
  ];

  const [equipos, setEquipos] = useState([]);
  const [categoriasAbiertas, setCategoriasAbiertas] = useState([]);

  const UNIDAD_RACK_MM = 44.45;
  const PIXELS_PER_U = 32; 
  const RACKS_COMERCIALES = [4, 6, 9, 12, 15, 18, 22, 27, 32, 37, 42, 47];

  const agregarItem = (item) => {
    const uCalculadas = item.uOcupadas || Math.ceil(item.altura / UNIDAD_RACK_MM);
    const nuevoItem = { 
      ...item, 
      instanceId: Math.random().toString(36).substr(2, 9), 
      uOcupadas: uCalculadas,
      timestamp: Date.now() 
    };
    setEquipos([...equipos, nuevoItem]);
  };

  const eliminarItem = (id) => {
    setEquipos(prev => prev.filter(e => e.instanceId !== id));
  };

  const res = useMemo(() => {
    const rackablesRaw = equipos.filter(e => e.esRackable);
    const noRackables = equipos.filter(e => !e.esRackable);

    let numEscobillas = 0;
    let numTapasAutomaticas = 0;
    let pasacablesTraseros = 0;
    const rackItems = [];

    // Lógica para rackables
    rackablesRaw.forEach(eq => {
      pasacablesTraseros++; 
      
      if (eq.categoria === 'Cinema') {
        numTapasAutomaticas++;
        rackItems.push({ 
          instanceId: `ciego-cin-${eq.instanceId}`, 
          nombre: `Panel Ciego Ventilación (Cinema)`, 
          categoria: 'Pasivo', 
          uOcupadas: 1, 
          tipoPasivo: 'Ciego' 
        });
      }

      rackItems.push(eq);

      if (eq.requiereEscobilla) {
        numEscobillas++;
        rackItems.push({ 
          instanceId: `esc-${eq.instanceId}`, 
          nombre: `Paso de cables (Escobilla)`, 
          categoria: 'Pasivo', 
          uOcupadas: 1, 
          tipoPasivo: 'Escobilla' 
        });
      }
    });

    // Lógica para no rackables (Baldas)
    let numTapasBalda = 0;
    const bloquesBaldas = [];
    let itemsPendientes = [...noRackables];
    
    while (itemsPendientes.length > 0) {
      pasacablesTraseros++;
      const actual = itemsPendientes.shift();
      
      if (actual.ancho === 'media') {
        const indexPareja = itemsPendientes.findIndex(e => e.ancho === 'media');
        if (indexPareja !== -1) {
          const pareja = itemsPendientes.splice(indexPareja, 1)[0];
          const tieneTapa = actual.requiereTapaCiega || pareja.requiereTapaCiega;
          if (tieneTapa) numTapasBalda++;
          bloquesBaldas.push({ 
            equipos: [actual, pareja], 
            uTotal: Math.max(actual.uOcupadas, pareja.uOcupadas) + (tieneTapa ? 1 : 0),
            tieneTapa: tieneTapa 
          });
          continue;
        }
      }
      const tieneTapa = actual.requiereTapaCiega;
      if (tieneTapa) numTapasBalda++;
      bloquesBaldas.push({ 
        equipos: [actual], 
        uTotal: actual.uOcupadas + (tieneTapa ? 1 : 0),
        tieneTapa: tieneTapa 
      });
    }

    const infraestructuraSuperiorU = 3; 
    const uDeEquiposTotal = rackItems.reduce((acc, item) => acc + item.uOcupadas, 0) + bloquesBaldas.reduce((acc, b) => acc + b.uTotal, 0);
    
    // Regletas: 1 cada 6 equipos totales
    const numEquiposTotal = equipos.length;
    const numRegletasTraseras = numEquiposTotal === 0 ? 0 : Math.ceil(numEquiposTotal / 6);
    
    const totalUNecesariasFrontales = uDeEquiposTotal + infraestructuraSuperiorU;
    const rackRecomendado = RACKS_COMERCIALES.find(r => r >= totalUNecesariasFrontales) || 47;
    
    const numVentiladores = rackRecomendado < 24 ? 1 : 2;

    return {
      rackItems,
      bloquesBaldas,
      rackRecomendado,
      numRegletasTraseras,
      totalUNecesariasFrontales,
      numTornillos: Math.ceil(totalUNecesariasFrontales * 4),
      consumoTotal: equipos.reduce((sum, eq) => sum + (eq.consumo || 0), 0),
      numEscobillas,
      numPlacasCiegas: 1 + numTapasBalda + numTapasAutomaticas,
      pasacablesTraseros,
      numVentiladores
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
      default: return <Server size={12} className="text-slate-400" />;
    }
  };

  const getCategoryTheme = (cat) => {
    switch(cat) {
      case 'Redes': return { color: 'text-blue-500', rackColor: 'bg-blue-600' };
      case 'Audio': return { color: 'text-emerald-500', rackColor: 'bg-emerald-600' };
      case 'Video': return { color: 'text-purple-500', rackColor: 'bg-purple-600' };
      case 'Control': return { color: 'text-indigo-500', rackColor: 'bg-indigo-600' };
      case 'Cinema': return { color: 'text-rose-500', rackColor: 'bg-rose-700' };
      case 'Energía': return { color: 'text-orange-500', rackColor: 'bg-orange-600' };
      default: return { color: 'text-slate-400', rackColor: 'bg-slate-800' };
    }
  };

  return (
    <div className="h-screen bg-[#020617] text-slate-100 flex flex-col overflow-hidden font-sans">
      <header className="h-14 flex items-center justify-between px-8 bg-slate-900/80 border-b border-white/10 backdrop-blur-xl shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-1.5 rounded-lg shadow-lg shadow-indigo-500/20">
            <ShieldCheck className="text-white w-5 h-5" />
          </div>
          <h1 className="text-sm font-black tracking-widest uppercase italic">
            Illusion <span className="text-slate-500 font-light">Rack Designer Pro</span>
          </h1>
        </div>
        <div className="flex items-center gap-8 text-[10px] font-bold">
           <div className="flex gap-6">
              <div className="flex items-center gap-2">
                 <Thermometer size={14} className="text-orange-400" />
                 <span className="text-orange-400 uppercase tracking-tighter">Consumo: {res.consumoTotal}W</span>
              </div>
              <div className="flex items-center gap-2">
                 <Zap size={14} className="text-blue-400" />
                 <span className="text-blue-400 uppercase tracking-tighter">PDUs: x{res.numRegletasTraseras}</span>
              </div>
           </div>
           <button onClick={() => setEquipos([])} className="p-2 hover:bg-white/5 rounded-full text-slate-500 hover:text-red-400 transition-colors">
            <RotateCcw size={16} />
          </button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        <aside className="w-72 bg-slate-900/20 border-r border-white/5 p-4 overflow-y-auto shrink-0 custom-scrollbar">
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-4">Librería Illusion</p>
          <div className="space-y-2">
            {[...new Set(CATALOGO_EQUIPOS.map(i => i.categoria))].map(cat => (
              <div key={cat} className="rounded-xl border border-white/5 bg-white/5 overflow-hidden">
                <button 
                  onClick={() => setCategoriasAbiertas(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat])}
                  className="w-full px-3 py-2.5 flex items-center justify-between hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(cat)}
                    <span className="text-[10px] font-bold uppercase tracking-wider">{cat}</span>
                  </div>
                  <ChevronDown size={12} className={`transition-transform duration-300 ${categoriasAbiertas.includes(cat) ? 'rotate-180' : ''}`} />
                </button>
                {categoriasAbiertas.includes(cat) && (
                  <div className="p-2 border-t border-white/10 bg-black/30">
                    {CATALOGO_EQUIPOS.filter(i => i.categoria === cat).map(item => (
                      <button key={item.id} onClick={() => agregarItem(item)} className="w-full p-3 rounded-lg hover:bg-indigo-600/80 group text-left flex justify-between items-center mb-2 transition-all duration-200 border border-white/5 hover:border-indigo-400/50 bg-white/95 hover:bg-indigo-600 hover:shadow-lg">
                        <div className="flex flex-col flex-1">
                           <span className="text-[12px] font-semibold text-slate-900 group-hover:text-white truncate">{item.nombre}</span>
                        </div>
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 group-hover:bg-white/20 transition-colors">
                          <Plus size={14} className="text-indigo-600 group-hover:text-white" />
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </aside>

        <section className="flex-1 bg-black relative flex items-center justify-center p-6 overflow-hidden">
          <div className="absolute top-6 left-8">
            <h2 className="text-[5rem] font-black leading-none text-white/90">{res.rackRecomendado}<span className="text-xl text-indigo-500 ml-2">U</span></h2>
            <p className="text-[9px] font-black text-indigo-500 uppercase tracking-widest mt-2 border-l-2 border-indigo-500 pl-3 italic">Gabinete Illusion Recomendado</p>
          </div>

          <div className="relative w-[440px] h-full bg-[#0a0a0a] border-x-[20px] border-slate-800 rounded-sm shadow-2xl flex flex-col">
            <div className="flex-1 flex flex-col p-1 overflow-y-auto custom-scrollbar">
              {/* Infraestructura Fija Superior */}
              <div style={{ height: `${PIXELS_PER_U}px` }} className="w-full bg-black/60 border-b border-white/5 flex items-center justify-center shrink-0">
                <div className="flex gap-1.5 opacity-20">{[...Array(14)].map((_, j) => <div key={j} className="w-1 h-3 bg-white rounded-full" />)}</div>
              </div>
              <div style={{ height: `${PIXELS_PER_U}px` }} className="w-full bg-slate-800 border-b-2 border-black/80 flex items-center justify-around shrink-0 relative shadow-inner">
                <span className="text-[9px] font-black text-white uppercase tracking-[0.3em]">Ventilación Forzada</span>
              </div>
              <div style={{ height: `${PIXELS_PER_U}px` }} className="w-full bg-[#111] border-b-2 border-black/80 flex items-center justify-center shrink-0 italic">
                <span className="text-[8px] font-bold text-slate-700 uppercase tracking-[0.4em]">Separador Técnico</span>
              </div>

              {/* Listado dinámico de equipos */}
              <div className="flex-1 mt-1 space-y-1">
                {res.rackItems.map((eq) => (
                  <div key={eq.instanceId} className={`w-full ${eq.tipoPasivo === 'Escobilla' || eq.tipoPasivo === 'Ciego' ? 'bg-black/80 border-dashed border-white/10' : getCategoryTheme(eq.categoria).rackColor} rounded-sm border-b border-black/40 flex items-center justify-center relative group transition-all`} style={{ height: `${eq.uOcupadas * PIXELS_PER_U}px` }}>
                    {eq.tipoPasivo === 'Escobilla' || eq.tipoPasivo === 'Ciego' ? (
                      <span className="text-[7px] font-bold text-slate-600 uppercase tracking-widest">{eq.nombre}</span>
                    ) : (
                      <div className="flex flex-col items-center">
                        <span className="font-black uppercase tracking-tight px-4 truncate text-[10px] text-white">{eq.nombre}</span>
                        <span className="text-[7px] font-bold opacity-50 uppercase tracking-widest">{eq.categoria}</span>
                      </div>
                    )}
                    {eq.categoria !== 'Pasivo' && (
                      <button onClick={() => eliminarItem(eq.instanceId)} className="absolute right-2 opacity-0 group-hover:opacity-100 p-2 text-white/50 hover:text-red-400 transition-all">
                        <Trash2 size={12} />
                      </button>
                    )}
                  </div>
                ))}

                {res.bloquesBaldas.map((bloque, i) => (
                  <div key={`bloque-${i}`} className="mb-1 flex flex-col">
                    <div className="w-full bg-slate-800 rounded-sm border-b-4 border-black/60 flex shadow-inner relative" style={{ height: `${(bloque.uTotal - (bloque.tieneTapa ? 1 : 0)) * PIXELS_PER_U}px` }}>
                      {bloque.equipos.map((e) => (
                        <div key={e.instanceId} className="h-[90%] flex flex-col items-center justify-center m-1.5 text-center bg-white rounded shadow-xl flex-1 border-t-2 border-slate-300 overflow-hidden relative group/item">
                          <span className="font-black uppercase text-slate-900 text-[8px] px-2 leading-tight">{e.nombre}</span>
                          <button onClick={() => eliminarItem(e.instanceId)} className="absolute inset-0 bg-red-600/90 text-white flex items-center justify-center opacity-0 group-hover/item:opacity-100 transition-opacity"><Trash2 size={14} /></button>
                        </div>
                      ))}
                    </div>
                    {bloque.tieneTapa && (
                      <div style={{ height: `${PIXELS_PER_U}px` }} className="w-full bg-black/80 border-b-2 border-white/5 flex items-center justify-center text-[7px] font-bold text-slate-600 uppercase tracking-widest">Tapa Ciega Balda</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <aside className="w-80 bg-slate-900/40 border-l border-white/5 flex flex-col shrink-0 p-6 overflow-y-auto custom-scrollbar text-[11px]">
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-6 italic">Configuración Técnica</p>
          <div className="space-y-3">
             <div className="flex justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                <span className="text-slate-500 font-bold uppercase text-[9px]">U Frontales Ocupadas</span>
                <span className="font-black text-white">{res.totalUNecesariasFrontales} U</span>
             </div>
             <div className="flex justify-between p-3 bg-white/5 rounded-xl border border-white/5 group hover:border-blue-500/30 transition-colors">
                <div className="flex items-center gap-2">
                   <Zap size={14} className="text-blue-400" />
                   <span className="text-slate-500 font-bold uppercase text-[9px]">Regletas (Traseras)</span>
                </div>
                <span className="font-black text-white">x{res.numRegletasTraseras}</span>
             </div>
             <div className="flex justify-between p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                <div className="flex items-center gap-2">
                   <Cable size={14} className="text-indigo-400" />
                   <span className="text-indigo-400 font-black uppercase text-[9px]">Pasacables (Posterior)</span>
                </div>
                <span className="font-black text-white">x{res.pasacablesTraseros}</span>
             </div>
             <div className="flex justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                <span className="text-slate-500 font-bold uppercase text-[9px]">Placas Ciegas</span>
                <span className="font-black text-white">x{res.numPlacasCiegas}</span>
             </div>
             <div className="flex justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                <span className="text-slate-500 font-bold uppercase text-[9px]">Escobillas</span>
                <span className="font-black text-white">x{res.numEscobillas}</span>
             </div>
          </div>

          <div className="mt-8 pt-8 border-t border-white/5">
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-4 italic">Resumen Activos</p>
            <div className="space-y-2">
               <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <Server size={14} className="text-emerald-500" />
                     <span className="font-bold text-slate-300">Equipos Totales</span>
                  </div>
                  <span className="text-xs font-black text-emerald-500">x{equipos.length}</span>
               </div>
               <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <Film size={14} className="text-rose-500" />
                     <span className="font-bold text-slate-300">Cinema Reference</span>
                  </div>
                  <span className="text-xs font-black text-rose-500">x{equipos.filter(e => e.categoria === 'Cinema').length}</span>
               </div>
            </div>
          </div>

          <div className="mt-auto pt-6">
            <button className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-900/40 transition-all active:scale-95">Descargar Listado BOOM</button>
          </div>
        </aside>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `.custom-scrollbar::-webkit-scrollbar { width: 4px; } .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }`}} />
    </div>
  )
}