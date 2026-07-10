import React, { useState, useEffect } from 'react';
import { Building, Save, Phone, Mail, MapPin, User, ShieldAlert, CheckCircle, Users, Trash2, Plus, Key, Eye, EyeOff } from 'lucide-react';
import { CompanyConfig, UserRole } from '../types';
import { getUsersByRuc, registerUser, deleteUser, SimulatedUser } from '../usuarios';

interface ConfiguracionEmpresaProps {
  currentUserRole: UserRole;
  darkMode: boolean;
  companyConfig: CompanyConfig;
  onConfigChange: (config: CompanyConfig) => void;
}

export const DEFAULT_COMPANY_CONFIG: CompanyConfig = {
  ruc: '20601234567',
  razonSocial: 'Empresa de Servicios Demo SAC',
  direccion: 'Av. Las Flores 450, San Isidro, Lima, Perú',
  telefono: '(01) 456-7890',
  correo: 'contacto@empresademo.pe',
  representanteLegal: 'Carlos Mendoza Ramos'
};

export function ConfiguracionEmpresa({ currentUserRole, darkMode, companyConfig, onConfigChange }: ConfiguracionEmpresaProps) {
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
  const loadUsers = () => {
    const list = getUsersByRuc(config.ruc);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isGerente) return;

    try {
      localStorage.setItem('mype_company_config_' + config.ruc, JSON.stringify(config));
      // Save general key as well for backward compatibility
      localStorage.setItem('mype_company_config', JSON.stringify(config));
      setIsSaved(true);
      onConfigChange(config);
      setTimeout(() => setIsSaved(false), 4000);
    } catch (e) {
      alert('Error al guardar la configuración');
    }
  };

  const handleAddUser = (e: React.FormEvent) => {
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

    const success = registerUser(newUser);
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

  const handleDeleteUser = (usuarioSolToDelete: string) => {
    if (usuarioSolToDelete.toUpperCase() === 'GERENTE_MYPE') {
      alert('No se puede eliminar el usuario Gerente raíz del sistema de demostración.');
      return;
    }

    if (confirm(`¿Está seguro de revocar el acceso para el usuario SOL ${usuarioSolToDelete}?`)) {
      deleteUser(config.ruc, usuarioSolToDelete);
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

  // Styling
  const cardClass = darkMode 
    ? 'bg-slate-900 border-slate-800 text-white shadow-md' 
    : 'bg-white border-slate-200/80 text-slate-700 shadow-xs';
  
  const inputBgClass = darkMode 
    ? 'bg-slate-850 border-slate-750 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500' 
    : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500';

  const labelClass = darkMode ? 'text-slate-400' : 'text-slate-500';

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* 1. EMISOR FISCAL DETAILS CARD */}
      <div className={`p-6 rounded-3xl border transition-colors duration-300 ${cardClass}`}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
          <div>
            <span className="text-[9px] bg-indigo-50 text-indigo-700 font-black tracking-widest px-2.5 py-1 rounded-full border border-indigo-100 uppercase dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-900/60">
              CONFIGURACIÓN GENERAL
            </span>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white mt-3 flex items-center gap-2">
              <Building className="w-5 h-5 text-indigo-600" />
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
                    darkMode ? 'bg-slate-950 border-slate-850 text-slate-400' : 'bg-slate-100 border-slate-250 text-slate-500'
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
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black py-2.5 px-5 rounded-xl transition-all shadow-md shadow-indigo-200/30 flex items-center gap-1.5 cursor-pointer"
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

      {/* 2. USER ACCESS MANAGEMENT (ONLY FOR GERENTE - "darle acceso a otra persona") */}
      <div className={`p-6 rounded-3xl border transition-colors duration-300 ${cardClass}`}>
        <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-5 mb-6">
          <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-300">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Usuarios y Accesos Autorizados</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Administre las personas de su carrera o salón a las que desea darles acceso a este RUC, asignándoles roles SOL de consulta o registro contable.
            </p>
          </div>
        </div>

        {isGerente ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left side: Add User Form */}
            <form onSubmit={handleAddUser} className="lg:col-span-5 space-y-4 bg-slate-50 dark:bg-slate-950/40 p-4 rounded-2xl border border-slate-200/50 dark:border-slate-800/60">
              <h4 className="text-xs font-black uppercase text-slate-900 dark:text-white tracking-wider flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-indigo-600" />
                <span>Crear Nuevo Acceso SOL</span>
              </h4>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider block mb-1 text-slate-400">Nombre Completo de la Persona</label>
                <input 
                  type="text"
                  placeholder="Ej. María Rojas (Contadora)"
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  className={`w-full rounded-xl py-2 px-3 text-xs focus:outline-none ${inputBgClass}`}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider block mb-1 text-slate-400">Usuario SOL</label>
                  <input 
                    type="text"
                    placeholder="E.g. CONTADOR_AUX"
                    value={newUsuarioSol}
                    onChange={(e) => setNewUsuarioSol(e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g, ''))}
                    className={`w-full font-mono rounded-xl py-2 px-3 text-xs focus:outline-none ${inputBgClass}`}
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider block mb-1 text-slate-400">Contraseña SOL</label>
                  <input 
                    type="text"
                    placeholder="Ej. Clave123*"
                    value={newContrasenaSol}
                    onChange={(e) => setNewContrasenaSol(e.target.value)}
                    className={`w-full font-mono rounded-xl py-2 px-3 text-xs focus:outline-none ${inputBgClass}`}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider block mb-1 text-slate-400">Rol del Sistema</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as UserRole)}
                  className={`w-full rounded-xl py-2 px-3 text-xs focus:outline-none ${inputBgClass}`}
                >
                  <option value="EMPLEADO">Empleado (Sólo Ventas/Compras, sin eliminar)</option>
                  <option value="ADMINISTRADOR">Administrador (Puede modificar y ver todo)</option>
                  <option value="CONTADOR">Contador (Puede procesar libros contables y SIRE)</option>
                  <option value="GERENTE">Gerente (Control total y gestionar accesos)</option>
                </select>
              </div>

              {userError && (
                <div className="text-[10.5px] font-medium text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/20 p-2.5 rounded-lg border border-rose-100 dark:border-rose-900/40">
                  ⚠️ {userError}
                </div>
              )}

              {userSuccess && (
                <div className="text-[10.5px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 p-2.5 rounded-lg border border-emerald-100 dark:border-emerald-900/40">
                  ✅ {userSuccess}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2 px-4 rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Generar Acceso SOL</span>
              </button>
            </form>

            {/* Right side: Table of current users */}
            <div className="lg:col-span-7 space-y-3">
              <h4 className="text-xs font-black uppercase text-slate-900 dark:text-white tracking-wider">
                Personal con acceso a RUC {config.ruc}
              </h4>
              <div className="overflow-x-auto rounded-2xl border border-slate-100 dark:border-slate-800">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-950 text-[10px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800">
                      <th className="p-3">Nombre / Integrante</th>
                      <th className="p-3">Credencial SOL</th>
                      <th className="p-3">Rol Contable</th>
                      <th className="p-3 text-right">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {usersList.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-4 text-center text-slate-400 font-medium">
                          No hay otros usuarios registrados para este RUC.
                        </td>
                      </tr>
                    ) : (
                      usersList.map((usr) => (
                        <tr key={usr.usuarioSol} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition-colors">
                          <td className="p-3 font-semibold text-slate-800 dark:text-slate-100">
                            {usr.fullName}
                          </td>
                          <td className="p-3">
                            <div className="font-mono text-[10.5px] leading-tight space-y-0.5">
                              <div><span className="text-[9px] text-slate-400">Usr:</span> {usr.usuarioSol}</div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-[9px] text-slate-400 font-sans">Psw:</span>
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
                                ? 'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-950/40 dark:border-indigo-900/60 dark:text-indigo-300'
                                : usr.role === 'ADMINISTRADOR'
                                ? 'bg-sky-50 border-sky-200 text-sky-700 dark:bg-sky-950/40 dark:border-sky-900/60 dark:text-sky-300'
                                : usr.role === 'CONTADOR'
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950/40 dark:border-emerald-900/60 dark:text-emerald-300'
                                : 'bg-slate-100 border-slate-250 text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300'
                            }`}>
                              {usr.role}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            {usr.usuarioSol.toUpperCase() !== 'GERENTE_MYPE' && usr.usuarioSol.toUpperCase() !== currentUserRole.toUpperCase() ? (
                              <button
                                type="button"
                                onClick={() => handleDeleteUser(usr.usuarioSol)}
                                className="text-rose-600 hover:text-rose-800 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 p-1.5 rounded-lg transition-colors cursor-pointer"
                                title="Revocar acceso"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            ) : (
                              <span className="text-[10px] text-slate-400 italic">Inmune</span>
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
          <div className="p-4 bg-slate-50 dark:bg-slate-950/40 border border-slate-200/50 dark:border-slate-800/40 rounded-2xl text-xs flex gap-3 text-slate-500">
            <Key className="w-5 h-5 text-slate-400 shrink-0" />
            <span>La creación de accesos y delegación de usuarios a compañeros de carrera está habilitada únicamente para la cuenta que posee el rol de <strong>GERENTE</strong>. Si usted ingresa con este rol, podrá agregar múltiples sub-usuarios con total seguridad.</span>
          </div>
        )}
      </div>
    </div>
  );
}
