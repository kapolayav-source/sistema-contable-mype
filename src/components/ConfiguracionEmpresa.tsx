import React, { useState, useEffect } from 'react';
import { Building, Save, Phone, Mail, MapPin, User, ShieldAlert, CheckCircle } from 'lucide-react';
import { CompanyConfig, UserRole } from '../types';

interface ConfiguracionEmpresaProps {
  currentUserRole: UserRole;
  darkMode: boolean;
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

export function ConfiguracionEmpresa({ currentUserRole, darkMode, onConfigChange }: ConfiguracionEmpresaProps) {
  const [config, setConfig] = useState<CompanyConfig>(() => {
    try {
      const stored = localStorage.getItem('mype_company_config');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error loading company config', e);
    }
    return DEFAULT_COMPANY_CONFIG;
  });

  const [isSaved, setIsSaved] = useState(false);
  const isGerente = currentUserRole === 'GERENTE';

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
      localStorage.setItem('mype_company_config', JSON.stringify(config));
      setIsSaved(true);
      onConfigChange(config);
      setTimeout(() => setIsSaved(false), 4000);
    } catch (e) {
      alert('Error al guardar la configuración');
    }
  };

  // Styling
  const cardClass = darkMode 
    ? 'bg-slate-900 border-slate-800 text-white shadow-md' 
    : 'bg-white border-slate-200/80 text-slate-700 shadow-xs';
  
  const inputBgClass = darkMode 
    ? 'bg-slate-800 border-slate-750 text-white focus:border-indigo-500' 
    : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-indigo-500 focus:bg-white';

  const labelClass = darkMode ? 'text-slate-400' : 'text-slate-500';

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className={`p-6 rounded-3xl border transition-colors duration-300 ${cardClass}`}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
          <div>
            <span className="text-[9px] bg-indigo-50 text-indigo-700 font-black tracking-widest px-2.5 py-1 rounded-full border border-indigo-100 uppercase dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-900/60">
              MÓDULO DE CONFIGURACIÓN
            </span>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white mt-3 flex items-center gap-2">
              <Building className="w-5 h-5 text-indigo-600" />
              <span>Datos Reales de la Empresa</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Configure la información legal de su negocio para que aparezca automáticamente en la cabecera del panel, facturación simulada y reportes de libros electrónicos.
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
          <div className="mt-5 p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-800/40 text-amber-800 dark:text-amber-300 rounded-2xl text-xs flex gap-3 items-start animate-pulse">
            <ShieldAlert className="w-5 h-5 shrink-0" />
            <div className="leading-relaxed">
              <strong className="block font-black uppercase text-[10px] tracking-wide">Acceso Limitado como {currentUserRole}</strong>
              <span>Solo los usuarios con el rol <strong>GERENTE</strong> tienen autorización para modificar la Razón Social y demás datos fiscales de la empresa en producción. Contacte a la gerencia si requiere actualizaciones.</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={`text-[10px] font-bold uppercase tracking-wider block mb-1.5 ${labelClass}`}>Número de RUC (Inmutable por Sesión)</label>
              <div className="relative">
                <input 
                  type="text"
                  value={config.ruc}
                  disabled
                  className={`w-full font-mono font-bold rounded-xl py-2.5 px-3.5 pl-10 text-xs focus:outline-none transition-all ${
                    darkMode ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-500'
                  }`}
                />
                <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
              <p className="text-[9px] text-slate-400 mt-1">El RUC se hereda de la credencial Clave SOL con la que inició sesión.</p>
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
                  className={`w-full rounded-xl py-2.5 px-3.5 pl-10 text-xs focus:outline-none transition-all focus:ring-2 focus:ring-indigo-500/10 font-bold ${inputBgClass}`}
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
                  className={`w-full rounded-xl py-2.5 px-3.5 pl-10 text-xs focus:outline-none transition-all focus:ring-2 focus:ring-indigo-500/10 font-medium ${inputBgClass}`}
                />
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className={`text-[10px] font-bold uppercase tracking-wider block mb-1.5 ${labelClass}`}>Teléfono de Contacto</label>
              <div className="relative">
                <input 
                  type="text"
                  placeholder="Ej. (01) 456-7890 o 999888777"
                  value={config.telefono}
                  onChange={(e) => handleChange('telefono', e.target.value)}
                  disabled={!isGerente}
                  required
                  className={`w-full rounded-xl py-2.5 px-3.5 pl-10 text-xs focus:outline-none transition-all focus:ring-2 focus:ring-indigo-500/10 font-medium ${inputBgClass}`}
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
                  className={`w-full rounded-xl py-2.5 px-3.5 pl-10 text-xs focus:outline-none transition-all focus:ring-2 focus:ring-indigo-500/10 font-medium ${inputBgClass}`}
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className={`text-[10px] font-bold uppercase tracking-wider block mb-1.5 ${labelClass}`}>Representante Legal / Gerente General</label>
              <div className="relative">
                <input 
                  type="text"
                  placeholder="Nombre del Gerente"
                  value={config.representanteLegal}
                  onChange={(e) => handleChange('representanteLegal', e.target.value)}
                  disabled={!isGerente}
                  required
                  className={`w-full rounded-xl py-2.5 px-3.5 pl-10 text-xs focus:outline-none transition-all focus:ring-2 focus:ring-indigo-500/10 font-medium ${inputBgClass}`}
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>
          </div>

          {isGerente && (
            <div className="flex justify-end pt-3">
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black py-2.5 px-5 rounded-xl transition-all shadow-md shadow-indigo-200/50 flex items-center gap-1.5 cursor-pointer"
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
            <span className="font-bold">¡Datos guardados con éxito en localStorage! Se reflejarán en todo el sistema.</span>
          </div>
        )}
      </div>
    </div>
  );
}
