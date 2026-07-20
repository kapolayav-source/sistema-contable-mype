import React, { useState, useEffect } from 'react';
import { Building, Save, Phone, Mail, MapPin, User, ShieldAlert, CheckCircle, Users, Trash2, Plus, Key, Eye, EyeOff, CloudLightning } from 'lucide-react';
import { CompanyConfig, UserRole } from '../types';
import { getUsersByRucCloud, registerUserCloud, deleteUserCloud, SimulatedUser } from '../usuarios';
import { supabase, isSupabaseConfigured } from '../supabaseClient';


interface ConfiguracionEmpresaProps {
  currentUserRole: UserRole;
  darkMode: boolean;
  companyConfig: CompanyConfig;
  onConfigChange: (config: CompanyConfig) => void;
  bypassUITLock: boolean;
  onBypassUITLockChange: (val: boolean) => void;
  startingCash: number;
  onStartingCashChange: (val: number) => void;
}

export const DEFAULT_COMPANY_CONFIG: CompanyConfig = {
  ruc: '20601234567',
  razonSocial: 'Empresa de Servicios Demo SAC',
  direccion: 'Av. Las Flores 450, San Isidro, Lima, Perú',
  telefono: '(01) 456-7890',
  correo: 'contacto@empresademo.pe',
  representanteLegal: 'Carlos Mendoza Ramos'
};

export function ConfiguracionEmpresa({ 
  currentUserRole, 
  darkMode, 
  companyConfig, 
  onConfigChange,
  bypassUITLock,
  onBypassUITLockChange,
  startingCash,
  onStartingCashChange
}: ConfiguracionEmpresaProps) {
  const [config, setConfig] = useState<CompanyConfig>(companyConfig);

  // Sync state if prop changes
  useEffect(() => {
    setConfig(companyConfig);
  }, [companyConfig]);

  const [isSaved, setIsSaved] = useState(false);
  const isGerente = currentUserRole === 'GERENTE';

  // State for user management
  const [usersList, setUsersList] = useState<SimulatedUser[]>([]);
  const [newFullName, setNewFullName] = useState('');
  const [newUsuarioSol, setNewUsuarioSol] = useState('');
  const [newContrasenaSol, setNewContrasenaSol] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('EMPLEADO');
  const [showPass, setShowPass] = useState<Record<string, boolean>>({});
  const [userError, setUserError] = useState('');
  const [userSuccess, setUserSuccess] = useState('');

  // Load users associated with this RUC
  const loadUsers = async () => {
    const list = await getUsersByRucCloud(config.ruc);
    setUsersList(list);
  };

  useEffect(() => {
    loadUsers();
  }, [config.ruc]);

  const handleChange = (field: keyof CompanyConfig, value: string) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
    setIsSaved(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isGerente) return;

    try {
      localStorage.setItem('mype_company_config_' + config.ruc, JSON.stringify(config));
      // Save general key as well for backward compatibility
      localStorage.setItem('mype_company_config', JSON.stringify(config));

      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase
          .from('configuracion_empresa')
          .upsert({
            ruc: config.ruc,
            razon_social: config.razonSocial,
            direccion: config.direccion,
            telefono: config.telefono,
            correo: config.correo,
            representante_legal: config.representanteLegal
          });
        if (error) throw error;
      }

      setIsSaved(true);
      onConfigChange(config);
      setTimeout(() => setIsSaved(false), 4000);
    } catch (e) {
      console.error(e);
      alert('Error al guardar la configuración en la base de datos');
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setUserError('');
    setUserSuccess('');

    if (!newFullName.trim() || !newUsuarioSol.trim() || !newContrasenaSol.trim()) {
      setUserError('Por favor complete todos los campos para crear el acceso.');
      return;
    }

    const newUser: SimulatedUser = {
      ruc: config.ruc,
      usuarioSol: newUsuarioSol.trim().toUpperCase(),
      contrasenaSol: newContrasenaSol.trim(),
      role: newRole,
      fullName: newFullName.trim()
    };

    const success = await registerUserCloud(newUser);
    if (success) {
      setUserSuccess(`¡Acceso creado con éxito para ${newUser.fullName}!`);
      setNewFullName('');
      setNewUsuarioSol('');
      setNewContrasenaSol('');
      setNewRole('EMPLEADO');
      loadUsers();
      setTimeout(() => setUserSuccess(''), 4000);
    } else {
      setUserError(`El usuario SOL "${newUser.usuarioSol}" ya está registrado para este RUC.`);
    }
  };

  const handleDeleteUser = async (usuarioSolToDelete: string) => {
    if (usuarioSolToDelete.toUpperCase() === 'GERENTE_MYPE') {
      alert('No se puede eliminar el usuario Gerente raíz del sistema de demostración.');
      return;
    }

    if (confirm(`¿Está seguro de revocar el acceso para el usuario SOL ${usuarioSolToDelete}?`)) {
      await deleteUserCloud(config.ruc, usuarioSolToDelete);
      setUserSuccess('Acceso revocado correctamente.');
      loadUsers();
      setTimeout(() => setUserSuccess(''), 3000);
    }
  };

  const toggleShowPass = (usrSol: string) => {
    setShowPass(prev => ({
      ...prev,
      [usrSol]: !prev[usrSol]
    }));
  };

  // Styling - optimized for premium contrast and perfect visibility in both light and dark modes
  const cardClass = darkMode 
    ? 'bg-slate-900 border-slate-800 text-slate-100 shadow-xl' 
    : 'bg-white border-slate-300 text-slate-900 shadow-sm';
  
  const inputBgClass = darkMode 
    ? 'bg-slate-950 border-slate-800 text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500' 
    : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600/30';

  const labelClass = darkMode ? 'text-slate-400' : 'text-slate-700 font-bold';

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* 1. EMISOR FISCAL DETAILS CARD */}
      <div className={`p-6 rounded-3xl border transition-all duration-300 ${cardClass}`}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
          <div>
            <span className="text-[9px] bg-indigo-50 text-indigo-700 font-black tracking-widest px-2.5 py-1 rounded-full border border-indigo-100 uppercase dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-900/60">
              CONFIGURACIÓN GENERAL
            </span>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white mt-3 flex items-center gap-2">
              <Building className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>Datos Fiscales de la Empresa</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Configure la información legal de su negocio. Estos datos se reflejan automáticamente en reportes, exportaciones de libros contables, SIRE y cabeceras.
            </p>
          </div>

          <div className="flex items-center gap-1">
            <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-[10px] font-black tracking-wider uppercase border ${
              isGerente
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950/20 dark:border-emerald-800 dark:text-emerald-300'
                : 'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-950/20 dark:border-amber-800 dark:text-amber-300'
            }`}>
              {isGerente ? '🔑 Rol Autorizado: Gerente' : '🔒 Lectura Única: No Autorizado'}
            </span>
          </div>
        </div>

        {!isGerente && (
          <div className="mt-5 p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-800/40 text-amber-800 dark:text-amber-300 rounded-2xl text-xs flex gap-3 items-start">
            <ShieldAlert className="w-5 h-5 shrink-0" />
            <div className="leading-relaxed">
              <strong className="block font-black uppercase text-[10px] tracking-wide">Acceso Restringido ({currentUserRole})</strong>
              <span>Solo los usuarios con el rol <strong>GERENTE</strong> de este RUC tienen autorización para modificar los datos fiscales de la empresa.</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={`text-[10px] font-bold uppercase tracking-wider block mb-1.5 ${labelClass}`}>Número de RUC</label>
              <div className="relative">
                <input 
                  type="text"
                  value={config.ruc}
                  disabled
                  className={`w-full font-mono font-bold rounded-xl py-2.5 px-3.5 pl-10 text-xs focus:outline-none transition-all ${
                    darkMode ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-slate-100 border-slate-300 text-slate-500'
                  }`}
                />
                <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
              <p className="text-[9px] text-slate-400 dark:text-slate-500 mt-1">El RUC se hereda de la cuenta registrada o activa.</p>
            </div>

            <div>
              <label className={`text-[10px] font-bold uppercase tracking-wider block mb-1.5 ${labelClass}`}>Razón Social / Nombre Comercial</label>
              <div className="relative">
                <input 
                  type="text"
                  placeholder="Ej. Mi Negocio Mype SAC"
                  value={config.razonSocial}
                  onChange={(e) => handleChange('razonSocial', e.target.value)}
                  disabled={!isGerente}
                  required
                  className={`w-full rounded-xl py-2.5 px-3.5 pl-10 text-xs focus:outline-none transition-all font-bold ${inputBgClass}`}
                />
                <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className={`text-[10px] font-bold uppercase tracking-wider block mb-1.5 ${labelClass}`}>Dirección Fiscal Completa</label>
              <div className="relative">
                <input 
                  type="text"
                  placeholder="Ej. Calle Los Cedros 123, Oficina 402, Lima"
                  value={config.direccion}
                  onChange={(e) => handleChange('direccion', e.target.value)}
                  disabled={!isGerente}
                  required
                  className={`w-full rounded-xl py-2.5 px-3.5 pl-10 text-xs focus:outline-none transition-all font-medium ${inputBgClass}`}
                />
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className={`text-[10px] font-bold uppercase tracking-wider block mb-1.5 ${labelClass}`}>Teléfono de Contacto</label>
              <div className="relative">
                <input 
                  type="text"
                  placeholder="Ej. (01) 456-7890"
                  value={config.telefono}
                  onChange={(e) => handleChange('telefono', e.target.value)}
                  disabled={!isGerente}
                  required
                  className={`w-full rounded-xl py-2.5 px-3.5 pl-10 text-xs focus:outline-none transition-all font-medium ${inputBgClass}`}
                />
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className={`text-[10px] font-bold uppercase tracking-wider block mb-1.5 ${labelClass}`}>Correo Electrónico Corporativo</label>
              <div className="relative">
                <input 
                  type="email"
                  placeholder="Ej. contabilidad@empresa.pe"
                  value={config.correo}
                  onChange={(e) => handleChange('correo', e.target.value)}
                  disabled={!isGerente}
                  required
                  className={`w-full rounded-xl py-2.5 px-3.5 pl-10 text-xs focus:outline-none transition-all font-medium ${inputBgClass}`}
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className={`text-[10px] font-bold uppercase tracking-wider block mb-1.5 ${labelClass}`}>Representante Legal / Gerente General</label>
              <div className="relative">
                <input 
                  type="text"
                  placeholder="Nombre de Gerente"
                  value={config.representanteLegal}
                  onChange={(e) => handleChange('representanteLegal', e.target.value)}
                  disabled={!isGerente}
                  required
                  className={`w-full rounded-xl py-2.5 px-3.5 pl-10 text-xs focus:outline-none transition-all font-medium ${inputBgClass}`}
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>
          </div>

          {isGerente && (
            <div className="flex justify-end pt-3">
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black py-2.5 px-5 rounded-xl transition-all shadow-md shadow-indigo-250/20 flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Guardar Cambios de la Empresa</span>
              </button>
            </div>
          )}
        </form>

        {isSaved && (
          <div className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-800/40 text-emerald-800 dark:text-emerald-300 rounded-2xl text-xs flex gap-2 items-center justify-center animate-fadeIn">
            <CheckCircle className="w-4 h-4" />
            <span className="font-bold">¡Datos guardados con éxito! Los reportes ahora se generarán con esta información.</span>
          </div>
        )}
      </div>

      {/* 1.5. PARAMETROS DE CONFIGURACION AVANZADA (CAJA DE INICIO & BYPASS) */}
      <div className={`p-6 rounded-3xl border transition-all duration-300 ${cardClass}`}>
        <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-5 mb-6">
          <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
            <CloudLightning className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Configuración Contable Avanzada</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Personalice el saldo inicial en caja de su empresa y habilite libros contables adicionales de forma rápida.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* CAJA DE INICIO */}
          <div className="space-y-2 bg-slate-50/50 dark:bg-slate-950/30 p-4.5 rounded-2xl border border-slate-200 dark:border-slate-800">
            <label className={`text-[11px] font-bold uppercase tracking-wider block ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              💵 Caja de Inicio / Saldo Inicial (S/.)
            </label>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-sans">
              Establezca un fondo inicial de dinero disponible en efectivo para que el sistema debite automáticamente en tu balance general.
            </p>
            <div className="relative mt-2">
              <span className="absolute left-3 top-2.5 text-xs font-mono font-bold text-slate-400">S/.</span>
              <input 
                type="number"
                min={0}
                step="100"
                placeholder="0.00"
                value={startingCash || ''}
                onChange={(e) => onStartingCashChange(Math.max(0, parseFloat(e.target.value) || 0))}
                className={`w-full rounded-xl py-2 px-3.5 pl-10 text-xs font-mono font-bold focus:outline-none transition-all ${inputBgClass}`}
              />
            </div>
            <span className="text-[9px] text-indigo-500 dark:text-indigo-400 font-semibold block mt-1">
              💡 Se creará una contrapartida automática en el Capital Social (Cta. 5011) por partida doble.
            </span>
          </div>

          {/* BYPASS UIT LOCK */}
          <div className="space-y-2 bg-slate-50/50 dark:bg-slate-950/30 p-4.5 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
            <div>
              <label className={`text-[11px] font-bold uppercase tracking-wider block ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                🔓 Desbloqueo de Libros Auxiliares (Bypass UIT)
              </label>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-sans mt-1">
                La SUNAT exonera a microempresas de llevar el Libro Mayor y de Inventarios. Active esta opción para forzar su apertura y contar con un control contable completo de su negocio.
              </p>
            </div>
            <div className="flex items-center gap-3 mt-3">
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={bypassUITLock} 
                  onChange={(e) => onBypassUITLockChange(e.target.checked)}
                  className="sr-only peer cursor-pointer"
                />
                <div className="w-10 h-5 bg-slate-300 dark:bg-slate-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                <span className="ml-3 text-xs font-bold text-slate-750 dark:text-slate-300">
                  {bypassUITLock ? '✓ FORZAR HABILITACIÓN ACTIVA' : '✗ RESPETAR LÍMITES SUNAT'}
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* 2. USER ACCESS MANAGEMENT (ONLY FOR GERENTE - "darle acceso a otra persona") */}
      <div className={`p-6 rounded-3xl border transition-all duration-300 ${cardClass}`}>
        <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-5 mb-6">
          <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-300">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Usuarios y Accesos Autorizados</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Administre los accesos de las personas autorizadas a consultar o registrar transacciones bajo este RUC, asignándoles roles SOL de consulta o registro contable.
            </p>
          </div>
        </div>

        {isGerente ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left side: Add User Form with rich layout and high contrast */}
            <form onSubmit={handleAddUser} className="lg:col-span-5 space-y-4 bg-slate-50/80 dark:bg-slate-950/40 p-5 rounded-2xl border border-slate-300 dark:border-slate-800 shadow-xs">
              <h4 className="text-xs font-black uppercase text-slate-900 dark:text-white tracking-wider flex items-center gap-1.5 border-b border-slate-200 dark:border-slate-800 pb-2.5">
                <Plus className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Crear Nuevo Acceso SOL</span>
              </h4>

              <div>
                <label className={`text-[10px] font-bold uppercase tracking-wider block mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-700'}`}>
                  Nombre Completo de la Persona
                </label>
                <input 
                  type="text"
                  placeholder="Ej. María Rojas (Contadora)"
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  className={`w-full rounded-xl py-2 px-3 text-xs focus:outline-none transition-all ${inputBgClass}`}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`text-[10px] font-bold uppercase tracking-wider block mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-700'}`}>
                    Usuario SOL
                  </label>
                  <input 
                    type="text"
                    placeholder="E.g. CONTADOR_AUX"
                    value={newUsuarioSol}
                    onChange={(e) => setNewUsuarioSol(e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g, ''))}
                    className={`w-full font-mono rounded-xl py-2 px-3 text-xs focus:outline-none transition-all ${inputBgClass}`}
                    required
                  />
                </div>
                <div>
                  <label className={`text-[10px] font-bold uppercase tracking-wider block mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-700'}`}>
                    Contraseña SOL
                  </label>
                  <input 
                    type="text"
                    placeholder="Ej. Clave123*"
                    value={newContrasenaSol}
                    onChange={(e) => setNewContrasenaSol(e.target.value)}
                    className={`w-full font-mono rounded-xl py-2 px-3 text-xs focus:outline-none transition-all ${inputBgClass}`}
                    required
                  />
                </div>
              </div>

              <div>
                <label className={`text-[10px] font-bold uppercase tracking-wider block mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-700'}`}>
                  Rol del Sistema
                </label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as UserRole)}
                  className={`w-full rounded-xl py-2 px-3 text-xs focus:outline-none transition-all cursor-pointer ${inputBgClass}`}
                >
                  <option value="EMPLEADO">Empleado (Sólo Ventas/Compras, sin eliminar)</option>
                  <option value="ADMINISTRADOR">Administrador (Puede modificar y ver todo)</option>
                  <option value="CONTADOR">Contador (Puede procesar libros contables y SIRE)</option>
                  <option value="GERENTE">Gerente (Control total y gestionar accesos)</option>
                </select>
              </div>

              {userError && (
                <div className="text-[10.5px] font-medium text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/20 p-2.5 rounded-lg border border-rose-200 dark:border-rose-900/40">
                  ⚠️ {userError}
                </div>
              )}

              {userSuccess && (
                <div className="text-[10.5px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 p-2.5 rounded-lg border border-emerald-200 dark:border-emerald-900/40">
                  ✅ {userSuccess}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-md shadow-indigo-200/20 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Generar Acceso SOL</span>
              </button>
            </form>

            {/* Right side: Table of current users with high readability */}
            <div className="lg:col-span-7 space-y-3">
              <h4 className={`text-xs font-black uppercase tracking-wider ${darkMode ? 'text-slate-300' : 'text-slate-800'}`}>
                Personal con acceso a RUC {config.ruc}
              </h4>
              <div className="overflow-x-auto rounded-2xl border border-slate-300 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/10">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-200/80 dark:bg-slate-950 text-[10px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-400 border-b border-slate-300 dark:border-slate-800">
                      <th className="p-3">Nombre / Integrante</th>
                      <th className="p-3">Credencial SOL</th>
                      <th className="p-3">Rol Contable</th>
                      <th className="p-3 text-right">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-300 dark:divide-slate-800">
                    {usersList.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-4 text-center text-slate-500 font-medium italic">
                          No hay otros usuarios registrados para este RUC.
                        </td>
                      </tr>
                    ) : (
                      usersList.map((usr) => (
                        <tr key={usr.usuarioSol} className="hover:bg-slate-100/50 dark:hover:bg-slate-950/20 transition-colors">
                          <td className="p-3 font-semibold text-slate-900 dark:text-slate-100">
                            {usr.fullName}
                          </td>
                          <td className="p-3">
                            <div className="font-mono text-[10.5px] leading-tight space-y-0.5 text-slate-800 dark:text-slate-200">
                              <div><span className="text-[9px] text-slate-500 dark:text-slate-400">Usr:</span> {usr.usuarioSol}</div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-[9px] text-slate-500 dark:text-slate-400 font-sans">Psw:</span>
                                <span>{showPass[usr.usuarioSol] ? usr.contrasenaSol : '••••••••'}</span>
                                <button
                                  type="button"
                                  onClick={() => toggleShowPass(usr.usuarioSol)}
                                  className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 cursor-pointer"
                                  title="Ver contraseña"
                                >
                                  {showPass[usr.usuarioSol] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                </button>
                              </div>
                            </div>
                          </td>
                          <td className="p-3">
                            <span className={`inline-block px-2 py-0.5 rounded-md text-[9px] font-bold tracking-wider uppercase border ${
                              usr.role === 'GERENTE' 
                                ? 'bg-indigo-100 border-indigo-300 text-indigo-800 dark:bg-indigo-950/40 dark:border-indigo-900/60 dark:text-indigo-300'
                                : usr.role === 'ADMINISTRADOR'
                                ? 'bg-sky-100 border-sky-300 text-sky-850 dark:bg-sky-950/40 dark:border-sky-900/60 dark:text-sky-300'
                                : usr.role === 'CONTADOR'
                                ? 'bg-emerald-100 border-emerald-300 text-emerald-800 dark:bg-emerald-950/40 dark:border-emerald-900/60 dark:text-emerald-300'
                                : 'bg-slate-100 border-slate-300 text-slate-800 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300'
                            }`}>
                              {usr.role}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            {usr.usuarioSol.toUpperCase() !== 'GERENTE_MYPE' && usr.usuarioSol.toUpperCase() !== currentUserRole.toUpperCase() ? (
                               <button
                                type="button"
                                onClick={() => handleDeleteUser(usr.usuarioSol)}
                                className="text-rose-600 hover:text-rose-800 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-950/20 p-1.5 rounded-lg transition-colors cursor-pointer"
                                title="Revocar acceso"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            ) : (
                              <span className="text-[10px] text-slate-500 italic font-medium">Inmune</span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-slate-50 dark:bg-slate-950/40 border border-slate-300 dark:border-slate-800/40 rounded-2xl text-xs flex gap-3 text-slate-600 dark:text-slate-400 leading-relaxed">
            <Key className="w-5 h-5 text-indigo-500 shrink-0" />
            <span>La creación de accesos y delegación de usuarios a compañeros de carrera está habilitada únicamente para la cuenta que posee el rol de <strong>GERENTE</strong>. Si usted ingresa con este rol, podrá agregar múltiples sub-usuarios con total seguridad.</span>
          </div>
        )}
      </div>
    </div>
  );
}
