import React, { useState, useMemo } from 'react';
import { 
  Plus, Trash2, RotateCcw, 
  ChevronDown, LayoutList, 
  Wind, Thermometer, 
  ShieldCheck, EyeOff,
  MoveHorizontal
} from 'lucide-react';

/**
 * RackDesignerPro - Versión Maestra
 * Herramienta integral para el diseño de racks audiovisuales.
 */

export default function App() {
  const CATALOGO_EQUIPOS = [
    { id: 'udm-pro', nombre: 'UniFi Dream Machine Pro', altura: 44, esRackable: true, categoria: 'Redes', consumo: 33, requiereEscobilla: true },
    { id: 'sw-pro-48', nombre: 'UniFi Switch Pro 48 PoE', altura: 44, esRackable: true, categoria: 'Redes', consumo: 600, requiereEscobilla: true },
    { id: 'sw-ent-24', nombre: 'UniFi Enterprise 24', altura: 44, esRackable: true, categoria: 'Redes', consumo: 400, requiereEscobilla: true },
    { id: 'crestron-cp4', nombre: 'Crestron CP4 Control System', altura: 44, esRackable: true, categoria: 'Control', consumo: 15 },
    { id: 'crestron-rmc3', nombre: 'Crestron RMC3 Processor', altura: 40, esRackable: false, categoria: 'Control', consumo: 10, requiereTapaCiega: true, ancho: 'media' },
    { id: 'crestron-swamp', nombre: 'Crestron SWAMP-24x8', altura: 177, esRackable: true, categoria: 'Audio', consumo: 800 },
    { id: 'beoamp2', nombre: 'B&O Beoamp2', altura: 44, esRackable: true, categoria: 'Audio', consumo: 300 },
    { id: 'sonos-amp', nombre: 'Sonos Amp', altura: 64, esRackable: false, categoria: 'Audio', consumo: 125, requiereTapaCiega: true, ancho: 'media' },
    { id: 'apple-tv', nombre: 'Apple TV 4K', altura: 35, esRackable: false, categoria: 'Video', consumo: 6, requiereTapaCiega: true, ancho: 'media' },
    { id: 'ups-apc', nombre: 'SAI APC Smart-UPS 1500', altura: 88, esRackable: true, categoria: 'Energía', consumo: 0 },
  ];

  const [equipos, setEquipos] = useState([]);
  const [categoriasAbiertas, setCategoriasAbiertas] = useState(['Redes', 'Audio']);

  const UNIDAD_RACK_MM = 44.45;
  const PIXELS_PER_U = 32; 
  const RACKS_COMERCIALES = [4, 6, 9, 12, 15, 18, 22, 27, 32, 37, 42, 47];

  const agregarItem = (item) => {
    const uCalculadas = Math.ceil(item.altura / UNIDAD_RACK_MM);
    const nuevoItem = { 
      ...item, 
      id: Math.random().toString(36).substr(2, 9), 
      uOcupadas: uCalculadas,
      timestamp: Date.now() 
    };
    setEquipos([...equipos, nuevoItem]);
  };

  const eliminarItem = (id) => setEquipos(equipos.filter(e => e.id !== id));

  const res = useMemo(() => {
    const rackablesRaw = equipos.filter(e => e.esRackable);
    const noRackables = equipos.filter(e => !e.esRackable);

    let numEscobillas = 0;
    const rackItems = [];
    rackablesRaw.forEach(eq => {
      rackItems.push(eq);
      if (eq.requiereEscobilla) {
        numEscobillas++;
        rackItems.push({ id: `esc-${eq.id}`, nombre: `Paso de cables (Escobilla)`, categoria: 'Pasivo', uOcupadas: 1, tipoPasivo: 'Escobilla' });
      }
    });

    let numTapasBalda = 0;
    const bloquesBaldas = [];
    let itemsPendientes = [...noRackables];
    while (itemsPendientes.length > 0) {
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

    const ventilacionSuperiorU = 1; 
    const termostatoU = 1;
    const panelCiegoSeparadorU = 1; 
    const infraestructuraSuperiorU = ventilacionSuperiorU + termostatoU + panelCiegoSeparadorU;
    
    const uDeEquiposTotal = rackItems.reduce((acc, item) => acc + item.uOcupadas, 0) + bloquesBaldas.reduce((acc, b) => acc + b.uTotal, 0);
    const totalUNecesariasFrontales = uDeEquiposTotal + infraestructuraSuperiorU;
    const rackRecomendado = RACKS_COMERCIALES.find(r => r >= totalUNecesariasFrontales) || 47;
    const numRegletasTraseras = Math.ceil(equipos.length / 8) || 1;

    return {
      rackItems,
      bloquesBaldas,
      rackRecomendado,
      ventilacionSuperiorU,
      termostatoU,
      numRegletasTraseras,
      totalUNecesariasFrontales,
      numTornillos: Math.ceil(totalUNecesariasFrontales * 4),
      consumoTotal: equipos.reduce((sum, eq) => sum + (eq.consumo || 0), 0),
      numEscobillas,
      numPlacasCiegas: panelCiegoSeparadorU + numTapasBalda
    };
  }, [equipos]);

  const getCategoryTheme = (cat) => {
    switch(cat) {
      case 'Redes': return { color: 'text-blue-500', rackColor: 'bg-blue-600' };
      case 'Audio': return { color: 'text-emerald-500', rackColor: 'bg-emerald-600' };
      case 'Video': return { color: 'text-purple-500', rackColor: 'bg-purple-600' };
      case 'Control': return { color: 'text-indigo-500', rackColor: 'bg-indigo-600' };
      case 'Energía': return { color: 'text-orange-500', rackColor: 'bg-orange-600' };
      default: return { color: 'text-slate-400', rackColor: 'bg-slate-800' };
    }
  };

  return (
    <div className="h-screen bg-[#020617] text-slate-100 flex flex-col overflow-hidden font-sans">
      <header className="h-14 flex items-center justify-between px-8 bg-slate-900/80 border-b border-white/10 backdrop-blur-xl shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-1.5 rounded-lg">
            <ShieldCheck className="text-white w-5 h-5" />
          </div>
          <h1 className="text-sm font-black tracking-widest uppercase italic">
            Illusion <span className="text-slate-500 font-light">Rack Designer Pro</span>
          </h1>
        </div>
        <div className="flex items-center gap-8">
          <div className="flex gap-6 items-center">
            <div className="flex flex-col text-right">
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-tighter">Tornillos</span>
              <span className="text-xs font-bold text-indigo-400">{res.numTornillos} PCS</span>
            </div>
            <div className="flex flex-col border-l border-white/10 pl-6 text-right">
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-tighter">Potencia</span>
              <span className="text-xs font-bold text-orange-400">{res.consumoTotal}W</span>
            </div>
          </div>
          <button onClick={() => setEquipos([])} className="p-2 hover:bg-white/5 rounded-full text-slate-500 hover:text-red-400">
            <RotateCcw size={16} />
          </button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        <aside className="w-72 bg-slate-900/20 border-r border-white/5 p-4 overflow-y-auto shrink-0">
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-4">Librería Illusion</p>
          <div className="space-y-2">
            {[...new Set(CATALOGO_EQUIPOS.map(i => i.categoria))].map(cat => (
              <div key={cat} className="rounded-xl border border-white/5 bg-white/5 overflow-hidden">
                <button 
                  onClick={() => setCategoriasAbiertas(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat])}
                  className="w-full px-3 py-2.5 flex items-center justify-between hover:bg-white/5"
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider">{cat}</span>
                  <ChevronDown size={12} className={categoriasAbiertas.includes(cat) ? 'rotate-180' : ''} />
                </button>
                {categoriasAbiertas.includes(cat) && (
                  <div className="p-1 border-t border-white/5 bg-black/20">
                    {CATALOGO_EQUIPOS.filter(i => i.categoria === cat).map(item => (
                      <button key={item.id} onClick={() => agregarItem(item)} className="w-full p-2.5 rounded-lg hover:bg-indigo-600 group text-left flex justify-between items-center mb-0.5">
                        <span className="text-[11px] font-medium text-slate-400 group-hover:text-white truncate">{item.nombre}</span>
                        <Plus size={12} className="text-indigo-400 group-hover:text-white" />
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
            <p className="text-[9px] font-black text-indigo-500 uppercase tracking-widest mt-2 border-l-2 border-indigo-500 pl-3 italic">Gabinete Frontal</p>
          </div>

          <div className="relative flex gap-1 h-full items-center">
             <div className="w-8 flex flex-col gap-1 py-10 opacity-40">
                {[...Array(res.numRegletasTraseras)].map((_, i) => (
                  <div key={i} className="flex-1 bg-slate-900 border border-indigo-500/30 rounded-full flex flex-col items-center justify-around py-4">
                    <span className="text-[6px] font-black text-indigo-400 rotate-90 uppercase whitespace-nowrap">PDU TRASERA {i+1}</span>
                    {[...Array(8)].map((_, j) => <div key={j} className="w-1.5 h-1.5 rounded-full bg-indigo-500/20 border border-indigo-500/40" />)}
                  </div>
                ))}
             </div>

             <div className="relative w-[440px] h-full bg-[#0a0a0a] border-x-[20px] border-slate-800 rounded-sm shadow-2xl flex flex-col">
              <div className="flex-1 flex flex-col p-1 overflow-y-auto custom-scrollbar">
                
                <div style={{ height: `${PIXELS_PER_U}px` }} className="w-full bg-black/60 border-b border-white/5 flex items-center justify-center shrink-0">
                  <div className="flex gap-1.5 opacity-20">
                    {[...Array(14)].map((_, j) => <div key={j} className="w-1 h-3 bg-white rounded-full" />)}
                  </div>
                </div>

                <div style={{ height: `${PIXELS_PER_U}px` }} className="w-full bg-slate-800 border-b-2 border-black/80 flex items-center justify-around shrink-0 relative shadow-inner">
                  <Thermometer size={14} className="text-indigo-400" />
                  <span className="text-[9px] font-black text-white uppercase tracking-[0.3em]">Termostato</span>
                  <Wind size={14} className="text-slate-500 animate-pulse" />
                </div>

                <div style={{ height: `${PIXELS_PER_U}px` }} className="w-full bg-[#111] border-b-2 border-black/80 flex items-center justify-center shrink-0 italic">
                  <span className="text-[8px] font-bold text-slate-700 uppercase tracking-[0.4em]">Panel Ciego (Separador)</span>
                </div>

                <div className="flex-1 mt-1 space-y-1">
                  {res.rackItems.map((eq) => (
                    <div key={eq.id} className={`w-full ${eq.tipoPasivo === 'Escobilla' ? 'bg-slate-900 border-dashed border-slate-700' : getCategoryTheme(eq.categoria).rackColor} rounded-sm border-b border-black/40 flex items-center justify-center relative group mb-1`} style={{ height: `${eq.uOcupadas * PIXELS_PER_U}px` }}>
                      {eq.tipoPasivo === 'Escobilla' ? (
                        <div className="flex gap-1 opacity-40">{[...Array(20)].map((_, i) => <div key={i} className="w-px h-4 bg-slate-400 mx-0.5" />)}</div>
                      ) : (
                        <span className="font-black uppercase tracking-tight px-4 truncate text-[10px] text-white">{eq.nombre}</span>
                      )}
                      <button onClick={() => eliminarItem(eq.id)} className="absolute right-2 opacity-0 group-hover:opacity-100 p-2 hover:text-red-400"><Trash2 size={12} /></button>
                    </div>
                  ))}

                  {res.bloquesBaldas.map((bloque, i) => (
                    <div key={`bloque-${i}`} className="mb-1 flex flex-col">
                      <div className="w-full bg-slate-800 rounded-sm border-b-4 border-black/60 flex shadow-inner relative" style={{ height: `${(bloque.uTotal - (bloque.tieneTapa ? 1 : 0)) * PIXELS_PER_U}px` }}>
                        {bloque.equipos.map((e, idx) => (
                          <div key={idx} className="h-[85%] flex flex-col items-center justify-center m-1.5 text-center bg-white rounded shadow-xl flex-1 border-t-2 border-slate-300">
                            <span className="font-black uppercase text-slate-900 text-[8px] px-2 leading-tight">{e.nombre}</span>
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
          </div>
        </section>

        <aside className="w-80 bg-slate-900/40 border-l border-white/5 flex flex-col shrink-0 p-6 overflow-y-auto custom-scrollbar">
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-6">Especificaciones Técnicas</p>
          <div className="space-y-4">
            <div className="p-5 bg-white/5 rounded-2xl border border-white/5">
              <p className="text-[10px] font-black text-slate-500 uppercase mb-2">Unidades Totales</p>
              <div className="flex items-end gap-2">
                <span className="text-4xl font-black text-white">{res.totalUNecesariasFrontales}</span>
                <span className="text-xs text-slate-400 mb-1.5 uppercase font-bold tracking-widest">U</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex flex-col items-center">
                <span className="text-[8px] font-bold text-slate-500 block mb-1 uppercase">Bandejas</span>
                <span className="text-2xl font-black text-emerald-400">{res.bloquesBaldas.length}</span>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex flex-col items-center">
                <span className="text-[8px] font-bold text-slate-500 block mb-1 uppercase">Placas Ciegas</span>
                <span className="text-2xl font-black text-slate-300">{res.numPlacasCiegas}</span>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex flex-col items-center">
                <span className="text-[8px] font-bold text-slate-500 block mb-1 uppercase">Escobillas</span>
                <span className="text-2xl font-black text-blue-400">{res.numEscobillas}</span>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex flex-col items-center">
                <span className="text-[8px] font-bold text-slate-500 block mb-1 uppercase">Tornillos</span>
                <span className="text-2xl font-black text-indigo-400">{res.numTornillos}</span>
              </div>
            </div>
          </div>
          <div className="mt-8">
            <div className="p-4 bg-indigo-950/20 border border-indigo-500/20 rounded-xl mb-6 text-[11px] text-slate-300 space-y-3">
              <div className="flex items-center justify-between font-bold text-indigo-400 uppercase text-[9px]"><span>Accesorio</span><span>Cant.</span></div>
              <div className="flex items-center justify-between"><span><LayoutList className="inline mr-2" size={14}/> PDUs Verticales</span><span>x{res.numRegletasTraseras}</span></div>
              <div className="flex items-center justify-between"><span><Thermometer className="inline mr-2" size={14}/> Termostato</span><span>1</span></div>
              <div className="flex items-center justify-between"><span><Wind className="inline mr-2" size={14}/> Ventilación Activa</span><span>1</span></div>
            </div>
            <button className="w-full py-4 bg-white hover:bg-slate-200 text-slate-950 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl">Generar Presupuesto PDF</button>
          </div>
        </aside>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `.custom-scrollbar::-webkit-scrollbar { width: 4px; } .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }`}} />
    </div>
  );
}
