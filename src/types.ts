export type UserRole = 'EMPLEADO' | 'GERENTE' | 'ADMINISTRADOR' | 'CONTADOR';

export interface UserSession {
  ruc: string;
  usuarioSol: string;
  role: UserRole;
  fullName: string;
}

export interface Transaction {
  id: string;
  fecha: string;
  tipo: 'VENTA' | 'COMPRA' | 'PLANILLA' | 'APERTURA' | 'COBRO' | 'PAGO' | 'TRANSFERENCIA';
  montoBase: number;
  igv: number;
  total: number;
  glosa: string;
  rucClienteProveedor: string;
  clienteProveedorNombre?: string; // the clean customer/supplier name
  documento: string; // e.g. "F001-000412" or "PLAN-06/2026"
  creadoPor?: string; // tracks which user/role created it
  creadoPorNombre?: string; // tracks name of user who created it
  sujetoDetraccion?: boolean;
  tasaDetraccion?: number; // e.g. 10 or 12 (percent)
  montoDetraccion?: number;
  sujetoRetencion?: boolean; // 3% IGV retention
  montoRetencion?: number;
  isExtornado?: boolean; // tracks if cancelled via extorno
  extornoRefId?: string; // refers to the transaction id that cancels/was cancelled
  
  // Custom tracking for payments/treasury
  cuentaOrigen?: string;     // e.g., '1212' or '101'
  cuentaDestino?: string;    // e.g., '1041' or '101'
  comprobanteRefId?: string; // Reference to sale/purchase being paid/collected
  formaPago?: string;        // Efectivo, Transferencia, Tarjeta, etc.
  observaciones?: string;    // Notas administrativas
  condicionPago?: 'Contado' | 'Crédito';
  estadoPago?: 'Pagado' | 'Pendiente';
  
  // Custom tracking for Inventory / Stock / Kardex
  catalogItemId?: string;
  cantidad?: number;
  precioUnitario?: number;
  esMovimientoInventario?: boolean;
  tipoInventario?: 'INGRESO' | 'SALIDA';
}

export interface AccountingEntry {
  id: string;
  asientoId: string; // links multiple entries in a single transaction double-entry seat
  fecha: string;
  glosa: string;
  cuenta: string;
  cuentaNombre: string;
  debe: number;
  haber: number;
}

export interface PCGEAccount {
  cta: string;
  desc: string;
  categoria: 'Activo' | 'Pasivo' | 'Patrimonio' | 'Gasto' | 'Ingreso';
  explicacion: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface CompanyConfig {
  ruc: string;
  razonSocial: string;
  direccion: string;
  telefono: string;
  correo: string;
  representanteLegal: string;
}

