import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Lock, 
  LogIn, 
  Check, 
  AlertCircle, 
  CheckCircle2, 
  Loader2, 
  Layers, 
  FileText, 
  ArrowRight,
  Sparkles,
  Server,
  Cloud,
  Zap,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { 
  loginWithGoogle, 
  loginWithEmail, 
  registerWithEmail, 
  resetPassword 
} from '../firebase';

export default function LoginPage({ 
  usuarioActual, 
  onEnterDesigner, 
  onLogout, 
  onLoginSuccess, 
  onContinueGuest 
}) {
  const [authModo, setAuthModo] = useState('login'); // 'login' | 'registro' | 'recuperar'
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authNombre, setAuthNombre] = useState('');
  const [authError, setAuthError] = useState('');
  const [authMensajeExito, setAuthMensajeExito] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleLoginGoogle = async () => {
    setAuthError('');
    setCargando(true);
    try {
      const user = await loginWithGoogle();
      if (onLoginSuccess) onLoginSuccess(user);
    } catch (err) {
      if (err.message?.includes('popup-closed-by-user')) {
        setAuthError('Ventana de autenticación cerrada.');
      } else if (err.code === 'auth/unauthorized-domain') {
        setAuthError('Dominio no autorizado en Firebase. Añade este dominio en Firebase Auth > Configuración > Dominios autorizados.');
      } else {
        setAuthError(err.message || 'Error al iniciar sesión con Google.');
      }
    } finally {
      setCargando(false);
    }
  };

  const handleLoginEmail = async (e) => {
    e.preventDefault();
    if (!authEmail || !authPassword) {
      setAuthError('Por favor introduce tu correo y contraseña.');
      return;
    }
    setAuthError('');
    setCargando(true);
    try {
      const user = await loginWithEmail(authEmail, authPassword);
      if (onLoginSuccess) onLoginSuccess(user);
    } catch (err) {
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setAuthError('Correo electrónico o contraseña incorrectos.');
      } else if (err.code === 'auth/invalid-email') {
        setAuthError('El correo electrónico no es válido.');
      } else {
        setAuthError(err.message || 'Error al iniciar sesión.');
      }
    } finally {
      setCargando(false);
    }
  };

  const handleRegistroEmail = async (e) => {
    e.preventDefault();
    if (!authEmail || !authPassword) {
      setAuthError('Por favor completa todos los campos.');
      return;
    }
    if (authPassword.length < 6) {
      setAuthError('La contraseña debe tener un mínimo de 6 caracteres.');
      return;
    }
    setAuthError('');
    setCargando(true);
    try {
      const user = await registerWithEmail(authEmail, authPassword, authNombre);
      if (onLoginSuccess) onLoginSuccess(user);
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setAuthError('Este correo electrónico ya está registrado.');
      } else {
        setAuthError(err.message || 'Error al registrar la cuenta.');
      }
    } finally {
      setCargando(false);
    }
  };

  const handleRecuperarPassword = async (e) => {
    e.preventDefault();
    if (!authEmail) {
      setAuthError('Introduce tu correo para restablecer la contraseña.');
      return;
    }
    setAuthError('');
    setCargando(true);
    try {
      await resetPassword(authEmail);
      setAuthMensajeExito('Se ha enviado un enlace de recuperación a tu correo.');
    } catch (err) {
      setAuthError(err.message || 'Error al solicitar el enlace.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#07090e] text-white flex flex-col justify-between overflow-y-auto selection:bg-indigo-500 selection:text-white">
      {/* Barra de Navegación Superior */}
      <header className="w-full border-b border-white/10 bg-[#0c0e17]/90 backdrop-blur-md px-6 py-3 flex items-center justify-between shrink-0 sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 border border-indigo-400/30">
            <Server className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-lg tracking-tight text-white">Illusion</span>
              <span className="font-extrabold text-lg tracking-tight text-indigo-400">Rack Designer</span>
              <span className="text-[9px] uppercase font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                v3.0 Pro
              </span>
            </div>
            <p className="text-[9px] font-semibold text-slate-400 tracking-wider uppercase">
              Ingeniería AV & IT de Bastidores 19"
            </p>
          </div>
        </div>

        <button
          onClick={onContinueGuest}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-all text-xs font-semibold cursor-pointer active:scale-95"
        >
          <span>Modo Demostración (Sin cuenta)</span>
          <ArrowRight size={14} className="text-slate-400" />
        </button>
      </header>

      {/* Contenido Principal: Hero + Formulario de Acceso */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-4 sm:py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
        
        {/* Columna Izquierda: Información y Propuesta de Valor */}
        <div className="lg:col-span-7 space-y-4 sm:space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-bold">
            <Sparkles size={13} className="text-indigo-400" />
            <span>Plataforma Oficial de Ingeniería Illusion</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-[1.2] text-white">
              Diseña, calcula y dimensiona racks <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-blue-400 to-indigo-200">profesionales de 19"</span>
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-2xl">
              Configura equipos de marcas líderes (UniFi, Crestron, Sonos, Apple, Marantz, B&O), simula la distribución térmica, computa tomas PDU y descarga informes técnicos oficiales en PDF.
            </p>
          </div>

          {/* Grid de 4 Características Clave */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="p-3 rounded-xl bg-[#0f121d] border border-white/5 hover:border-indigo-500/30 transition-all shadow-md">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                  <Layers size={14} />
                </div>
                <h3 className="font-bold text-xs text-white">Escala Milimétrica en U</h3>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                Racks oficiales Excell desde 9U hasta 47U con colocación inteligente y baldas dobles.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#0f121d] border border-white/5 hover:border-indigo-500/30 transition-all shadow-md">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                  <Zap size={14} />
                </div>
                <h3 className="font-bold text-xs text-white">Cálculo Eléctrico & PDU</h3>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                Suma instantánea de Watts, cálculo de regletas traseras/frontales y líneas de 2.5 mm².
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#0f121d] border border-white/5 hover:border-indigo-500/30 transition-all shadow-md">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                  <Cloud size={14} />
                </div>
                <h3 className="font-bold text-xs text-white">Sincronización en la Nube</h3>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                Guarda tus proyectos en Firebase Firestore y accede a ellos desde tu PC o tablet en cualquier lugar.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#0f121d] border border-white/5 hover:border-indigo-500/30 transition-all shadow-md">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <FileText size={14} />
                </div>
                <h3 className="font-bold text-xs text-white">Exportación Oficial a PDF</h3>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                Genera listados técnicos de materiales, tornillería y prescripciones de obra con un solo clic.
              </p>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Tarjeta de Autenticación */}
        <div className="lg:col-span-5 w-full">
          <div className="w-full rounded-2xl bg-[#0f121f] border border-indigo-500/30 p-5 sm:p-6 shadow-2xl shadow-indigo-950/50 backdrop-blur-xl relative overflow-hidden">
            
            {/* Resplandor decorativo */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

            {/* Cabecera del Formulario o Estado de Usuario Activo */}
            {usuarioActual ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/30">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white font-black text-base border border-indigo-400/40 shadow-md shrink-0">
                    {usuarioActual.displayName ? usuarioActual.displayName.charAt(0).toUpperCase() : (usuarioActual.email?.charAt(0).toUpperCase() || 'U')}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-[11px] font-bold text-emerald-400">Sesión Activa</span>
                    </div>
                    <p className="text-sm font-bold text-white truncate">
                      {usuarioActual.displayName || usuarioActual.email}
                    </p>
                    {usuarioActual.displayName && (
                      <p className="text-[11px] text-slate-400 truncate">{usuarioActual.email}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2.5">
                  <button
                    type="button"
                    onClick={onEnterDesigner}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-sm shadow-lg shadow-indigo-950/50 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                  >
                    <span>Entrar al Diseñador de Racks</span>
                    <ChevronRight size={16} />
                  </button>

                  <button
                    type="button"
                    onClick={onLogout}
                    className="w-full py-2 px-3 rounded-lg bg-white/5 hover:bg-rose-500/15 text-slate-400 hover:text-rose-300 border border-white/10 hover:border-rose-500/30 text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <LogOut size={13} />
                    <span>Cerrar Sesión / Cambiar Usuario</span>
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-4 relative">
                  <h2 className="text-xl font-black text-white tracking-tight">
                    {authModo === 'login' ? 'Iniciar Sesión' : authModo === 'registro' ? 'Crear Cuenta' : 'Recuperar Contraseña'}
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {authModo === 'login'
                      ? 'Accede con tu cuenta para cargar y sincronizar tus proyectos de rack.'
                      : authModo === 'registro'
                      ? 'Regístrate para guardar tus diseños de ingeniería en la nube.'
                      : 'Introduce tu email y te enviaremos las instrucciones de restablecimiento.'}
                  </p>
                </div>

                {/* Selector de Pestañas (Iniciar Sesión / Registro) */}
                {authModo !== 'recuperar' && (
                  <div className="grid grid-cols-2 p-1 bg-black/40 rounded-xl border border-white/5 mb-4">
                    <button
                      type="button"
                      onClick={() => { setAuthModo('login'); setAuthError(''); setAuthMensajeExito(''); }}
                      className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                        authModo === 'login'
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/40'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Iniciar Sesión
                    </button>
                    <button
                      type="button"
                      onClick={() => { setAuthModo('registro'); setAuthError(''); setAuthMensajeExito(''); }}
                      className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                        authModo === 'registro'
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/40'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Registrarse
                    </button>
                  </div>
                )}

            {/* Mensajes de Estado */}
            {authError && (
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs mb-5">
                <AlertCircle size={16} className="shrink-0 mt-0.5 text-rose-400" />
                <span>{authError}</span>
              </div>
            )}

            {authMensajeExito && (
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs mb-5">
                <CheckCircle2 size={16} className="shrink-0 mt-0.5 text-emerald-400" />
                <span>{authMensajeExito}</span>
              </div>
            )}

            {/* Botón de Google */}
            {authModo !== 'recuperar' && (
              <>
                <button
                  type="button"
                  onClick={handleLoginGoogle}
                  disabled={cargando}
                  className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm shadow-md transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span>Continuar con Google</span>
                </button>

                <div className="flex items-center gap-3 my-5">
                  <div className="h-px flex-1 bg-white/10" />
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">o con tu email</span>
                  <div className="h-px flex-1 bg-white/10" />
                </div>
              </>
            )}

            {/* Formulario de Email & Contraseña */}
            <form 
              onSubmit={authModo === 'login' ? handleLoginEmail : authModo === 'registro' ? handleRegistroEmail : handleRecuperarPassword}
              className="space-y-4"
            >
              {authModo === 'registro' && (
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Nombre Completo / Empresa</label>
                  <div className="relative">
                    <User size={16} className="absolute left-3.5 top-3.5 text-slate-500" />
                    <input
                      type="text"
                      value={authNombre}
                      onChange={(e) => setAuthNombre(e.target.value)}
                      placeholder="Ej: Jonatan Cusac"
                      className="w-full pl-10 pr-3.5 py-3 rounded-xl bg-black/40 border border-slate-700 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Correo Electrónico</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-3.5 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="jonycusac@gmail.com"
                    className="w-full pl-10 pr-3.5 py-3 rounded-xl bg-black/40 border border-slate-700 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                </div>
              </div>

              {authModo !== 'recuperar' && (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-300">Contraseña</label>
                    {authModo === 'login' && (
                      <button
                        type="button"
                        onClick={() => { setAuthModo('recuperar'); setAuthError(''); setAuthMensajeExito(''); }}
                        className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer"
                      >
                        ¿Olvidaste tu clave?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-3.5 text-slate-500" />
                    <input
                      type="password"
                      required
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-3.5 py-3 rounded-xl bg-black/40 border border-slate-700 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={cargando}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold text-sm shadow-xl shadow-indigo-950/60 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-[0.98]"
              >
                {cargando ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Conectando...</span>
                  </>
                ) : authModo === 'login' ? (
                  <>
                    <LogIn size={16} />
                    <span>Entrar al Diseñador</span>
                  </>
                ) : authModo === 'registro' ? (
                  <>
                    <Check size={16} />
                    <span>Crear Cuenta & Empezar</span>
                  </>
                ) : (
                  <>
                    <Mail size={16} />
                    <span>Enviar Enlace de Recuperación</span>
                  </>
                )}
              </button>
            </form>

            {authModo === 'recuperar' && (
              <div className="text-center pt-4">
                <button
                  type="button"
                  onClick={() => { setAuthModo('login'); setAuthError(''); setAuthMensajeExito(''); }}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-bold cursor-pointer"
                >
                  ← Volver a Iniciar Sesión
                </button>
              </div>
            )}

            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-500 font-medium">
              <span>© 2026 Jonathan Cusac</span>
              <span className="text-indigo-400/80">Illusion Custom Solutions</span>
            </div>
              </>
            )}
          </div>
        </div>
      </main>

      {/* Pie de Página con Copyright Destacado */}
      <footer className="w-full border-t border-slate-800/80 bg-slate-950/80 backdrop-blur-md px-6 py-3.5 text-center shrink-0 z-10">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 text-xs text-slate-400">
          <span className="font-bold text-slate-200">© 2026 Jonathan Cusac / Illusion Custom Solutions</span>
          <span className="hidden sm:inline text-slate-600">•</span>
          <span className="text-slate-300 font-medium">Todos los derechos reservados</span>
          <span className="hidden sm:inline text-slate-600">•</span>
          <span className="text-indigo-400 text-[11px] font-mono font-semibold">Software Propietario</span>
        </div>
      </footer>
    </div>
  );
}
