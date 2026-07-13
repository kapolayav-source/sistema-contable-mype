import { createClient } from '@supabase/supabase-js';

// Get Supabase environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://uohxujclznpmkwlmuudc.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publistable_Uf6154ktGM67A4Q3bxodAw_d5X00NX5';

// Validate key presence (exclude placeholder key starting with sb_publistable)
export const isSupabaseConfigured = 
  supabaseUrl.trim() !== '' && 
  supabaseAnonKey.trim() !== '' && 
  !supabaseAnonKey.startsWith('sb_publistable');

// Create the Supabase client (or null if not configured)
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Interfaces mapping the data structure
export interface DBUser {
  ruc: string;
  usuario_sol: string;
  contrasena_sol: string;
  role: 'GERENTE' | 'ADMINISTRADOR' | 'CONTADOR' | 'EMPLEADO';
  full_name: string;
}

export interface DBCompanyConfig {
  ruc: string;
  razon_social: string;
  direccion: string;
  telefono: string;
  correo: string;
  representante_legal: string;
}

export interface DBTransaction {
  id: string;
  fecha: string;
  tipo: string;
  monto_base: number;
  igv: number;
  total: number;
  glosa: string;
  ruc_cliente_proveedor: string;
  documento: string;
  creado_por: string;
  forma_pago: string;
  cuenta_origen: string;
  cuenta_destino: string;
  catalog_item_id?: string;
  cantidad?: number;
  precio_unitario?: number;
  es_movimiento_inventario?: boolean;
  tipo_inventario?: string;
}
