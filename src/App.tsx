import React, { useState, useEffect, useRef } from 'react';
import { 
  Calculator, 
  Scale, 
  BookOpen, 
  Sparkles, 
  Calendar, 
  TrendingUp, 
  PlusCircle, 
  Download, 
  RefreshCw, 
  FileText, 
  Check, 
  MessageSquare, 
  HelpCircle, 
  Trash2, 
  Search, 
  Building, 
  Tag, 
  ChevronRight, 
  ChevronDown,
  ChevronUp,
  AlertCircle, 
  Info, 
  Send, 
  Plus,
  TrendingDown,
  Lock,
  Unlock,
  LogOut,
  User,
  Menu,
  X
} from 'lucide-react';
import { Transaction, AccountingEntry, PCGEAccount, ChatMessage, UserRole, CompanyConfig } from './types';
import { PCGE_MYPE, INITIAL_TRANSACTIONS, generateSeatsFromTransaction, PRESET_QUESTIONS, MONTHS_LIST, getSUNATDeadline } from './data';
import { exportToExcel, exportToPDF } from './exportHelper';
import { getRegisteredUsers, registerUser, deleteUser, SimulatedUser, validateUserCloud, registerUserCloud } from './usuarios';
import { supabase, isSupabaseConfigured } from './supabaseClient';
import { ConfiguracionEmpresa, DEFAULT_COMPANY_CONFIG } from './components/ConfiguracionEmpresa';
import { ComprobantePDFModal } from './components/ComprobantePDFModal';

import imgOperaciones from './assets/images/navegacion_operaciones_1783371809409.jpg';
import imgProductos from './assets/images/navegacion_productos_1783371823633.jpg';
import imgLibros from './assets/images/navegacion_libros_1783371831901.jpg';
import imgImpuestos from './assets/images/navegacion_impuestos_1783371840807.jpg';

const MOCK_CATALOG = [
  { id: '1', desc: 'Mercadería Comercial Lote A', precio: 1200, tipo: 'VENTA', isPhysical: true, sku: 'MER-001', unidad: 'Unidades', stockInicial: 50, costoInicial: 750 },
  { id: '2', desc: 'Servicios de Asesoría Mensual', precio: 800, tipo: 'VENTA', isPhysical: false },
  { id: '3', desc: 'Servicio de Consultoría de Sistemas', precio: 1500, tipo: 'VENTA', isPhysical: false },
  { id: '4', desc: 'Auditoría Financiera MYPE', precio: 2500, tipo: 'VENTA', isPhysical: false },
  { id: '5', desc: 'Suministros de Oficina (Venta)', precio: 150, tipo: 'VENTA', isPhysical: true, sku: 'MER-002', unidad: 'Cajas', stockInicial: 120, costoInicial: 90 },
  { id: '6', desc: 'Alquiler de Servidores / Cloud', precio: 450, tipo: 'COMPRA', isPhysical: false },
  { id: '7', desc: 'Honorarios del Contador Externo', precio: 600, tipo: 'COMPRA', isPhysical: false },
  { id: '8', desc: 'Útiles de Escritorio y Papelería', precio: 120, tipo: 'COMPRA', isPhysical: false },
  { id: '9', desc: 'Servicios de Luz y Agua Comercial', precio: 280, tipo: 'COMPRA', isPhysical: false },
  { id: '10', desc: 'Sueldo Planilla MYPE', precio: 1025, tipo: 'PLANILLA', isPhysical: false },
  { id: '11', desc: 'Laptop Corporativa Core i5', precio: 3200, tipo: 'VENTA', isPhysical: true, sku: 'MER-003', unidad: 'Equipos', stockInicial: 8, costoInicial: 2100 }
];

export function KhipuRevLogo({ className = "w-14 h-14" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        {/* Gradients */}
        <linearGradient id="pillarGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0a192f" />
          <stop offset="100%" stopColor="#172a45" />
        </linearGradient>
        <linearGradient id="swoopGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00b4d8" />
          <stop offset="30%" stopColor="#0077b6" />
          <stop offset="70%" stopColor="#3a0ca3" />
          <stop offset="100%" stopColor="#7209b7" />
        </linearGradient>
        <linearGradient id="barTeal" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#0d9488" />
          <stop offset="100%" stopColor="#2dd4bf" />
        </linearGradient>
        <linearGradient id="barBlue" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#60a5fa" />
        </linearGradient>
        <linearGradient id="barPurple" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#c084fc" />
        </linearGradient>
      </defs>

      {/* Behind: Growing chart bars with upward arrow */}
      <rect x="64" y="38" width="6.5" height="22" rx="3" fill="url(#barTeal)" />
      <rect x="74" y="26" width="6.5" height="34" rx="3" fill="url(#barBlue)" />
      <rect x="84" y="16" width="6.5" height="44" rx="3" fill="url(#barPurple)" />

      {/* Upward sweeping arrow curve */}
      <path d="M54 62 C70 62 90 54 91 26" stroke="#00b4d8" strokeWidth="4.5" strokeLinecap="round" fill="none" />
      <path d="M85 32 L91 26 L97 33" stroke="#00b4d8" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />

      {/* Left Main Pillar */}
      <rect x="26" y="15" width="13" height="60" rx="6.5" fill="url(#pillarGrad)" />

      {/* 3D Swoop/Ribbon component making the K's diagonal branches */}
      <path d="M26 42 C36 42 45 28 65 28 C80 28 85 45 68 55 L45 75" stroke="url(#swoopGrad)" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" fill="none" />

      {/* Abacus under the loop on the left */}
      {/* Abacus frame top horizontal bar */}
      <line x1="31" y1="46" x2="52" y2="46" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />
      {/* 3 vertical rods */}
      <line x1="34" y1="46" x2="34" y2="78" stroke="#0d9488" strokeWidth="1.5" />
      <line x1="41" y1="46" x2="41" y2="78" stroke="#2563eb" strokeWidth="1.5" />
      <line x1="48" y1="46" x2="48" y2="78" stroke="#7c3aed" strokeWidth="1.5" />

      {/* Beads */}
      {/* Beads on Rod 1 (Teal) */}
      <circle cx="34" cy="54" r="2.8" fill="#2dd4bf" />
      <circle cx="34" cy="61" r="2.8" fill="#2dd4bf" />
      <circle cx="34" cy="68" r="2.8" fill="#2dd4bf" />

      {/* Beads on Rod 2 (Blue) */}
      <circle cx="41" cy="57" r="2.8" fill="#60a5fa" />
      <circle cx="41" cy="64" r="2.8" fill="#60a5fa" />
      <circle cx="41" cy="71" r="2.8" fill="#60a5fa" />

      {/* Beads on Rod 3 (Purple) */}
      <circle cx="48" cy="52" r="2.8" fill="#c084fc" />
      <circle cx="48" cy="59" r="2.8" fill="#c084fc" />
      <circle cx="48" cy="66" r="2.8" fill="#c084fc" />
    </svg>
  );
}

export default function App() {
  // --- States ---
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    try {
      return localStorage.getItem('mype_logged_in') === 'true';
    } catch {
      return false;
    }
  });
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>(() => {
    try {
      return (localStorage.getItem('mype_user_role') as UserRole) || 'GERENTE';
    } catch {
      return 'GERENTE';
    }
  });
  const [currentUserFullName, setCurrentUserFullName] = useState<string>(() => {
    try {
      return localStorage.getItem('mype_user_fullname') || 'Usuario General';
    } catch {
      return 'Usuario General';
    }
  });
  const [loginRole, setLoginRole] = useState<UserRole>('EMPLEADO');
  const [period, setPeriod] = useState<string>('2026-06');
  const [ruc, setRuc] = useState<string>(() => {
    try {
      return localStorage.getItem('mype_user_ruc') || '20601234567';
    } catch {
      return '20601234567';
    }
  });
  const [rucLastDigit, setRucLastDigit] = useState<string>(() => {
    try {
      const savedRuc = localStorage.getItem('mype_user_ruc') || '20601234567';
      return savedRuc.length > 0 ? savedRuc[savedRuc.length - 1] : '7';
    } catch {
      return '7';
    }
  });
  const [loginRuc, setLoginRuc] = useState<string>('');
  const [loginUser, setLoginUser] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string>('');
  const [supabaseError, setSupabaseError] = useState<string | null>(null);
  const [loginMode, setLoginMode] = useState<'login' | 'registro'>('login');
  const [loginType, setLoginType] = useState<'gerente' | 'colaborador'>('gerente');
  const [regRuc, setRegRuc] = useState<string>('');
  const [regRazonSocial, setRegRazonSocial] = useState<string>('');
  const [regNombreGerente, setRegNombreGerente] = useState<string>('');
  const [regUsuarioSol, setRegUsuarioSol] = useState<string>('');
  const [regClaveSol, setRegClaveSol] = useState<string>('');
  const [regSuccess, setRegSuccess] = useState<string>('');
  const [regError, setRegError] = useState<string>('');
  const [solUser, setSolUser] = useState<string>(() => {
    try {
      return localStorage.getItem('mype_sol_user') || 'CONTADOR_MYPE';
    } catch {
      return 'CONTADOR_MYPE';
    }
  });
  
  // Custom Transaction List
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const activeRuc = localStorage.getItem('mype_user_ruc') || '20601234567';
      const saved = localStorage.getItem('mype_transactions_' + activeRuc) || localStorage.getItem('mype_transactions');
      const loaded = saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
      if (Array.isArray(loaded)) {
        return loaded.map((tx: any) => ({
          ...tx,
          fecha: typeof tx.fecha === 'string' ? tx.fecha : new Date().toISOString().split('T')[0],
          montoBase: typeof tx.montoBase === 'number' ? tx.montoBase : (Number(tx.montoBase) || 0),
          igv: typeof tx.igv === 'number' ? tx.igv : (Number(tx.igv) || 0),
          total: typeof tx.total === 'number' ? tx.total : (Number(tx.total) || 0),
          documento: typeof tx.documento === 'string' ? tx.documento : '',
          glosa: typeof tx.glosa === 'string' ? tx.glosa : '',
          rucClienteProveedor: typeof tx.rucClienteProveedor === 'string' ? tx.rucClienteProveedor : '',
          montoDetraccion: tx.montoDetraccion !== undefined ? (Number(tx.montoDetraccion) || 0) : undefined,
          montoRetencion: tx.montoRetencion !== undefined ? (Number(tx.montoRetencion) || 0) : undefined
        }));
      }
      return INITIAL_TRANSACTIONS;
    } catch {
      return INITIAL_TRANSACTIONS;
    }
  });

  const transactionsRucRef = useRef<string>(ruc);

  const [activeView, setActiveView] = useState<'transacciones' | 'catalogo' | 'libros' | 'sunat' | 'configuracion'>('transacciones');
  const [moduloActivo, setModuloActivo] = useState<'menu' | 'cronograma' | 'libros' | 'impuestos' | 'simulador' | 'configuracion'>('menu');
  const [activeTab, setActiveTab] = useState<'Inicio' | 'SIRE' | 'Impuestos' | 'Simulador'>('Inicio');
  const [selectedVentaComprobante, setSelectedVentaComprobante] = useState<Transaction | null>(null);

  const [companyConfig, setCompanyConfig] = useState<CompanyConfig>(() => {
    try {
      const activeRuc = localStorage.getItem('mype_user_ruc') || '20601234567';
      const stored = localStorage.getItem('mype_company_config_' + activeRuc) || localStorage.getItem('mype_company_config');
      return stored ? JSON.parse(stored) : DEFAULT_COMPANY_CONFIG;
    } catch {
      return DEFAULT_COMPANY_CONFIG;
    }
  });

  useEffect(() => {
    try {
      if (companyConfig && companyConfig.ruc) {
        localStorage.setItem('mype_company_config_' + companyConfig.ruc, JSON.stringify(companyConfig));
        localStorage.setItem('mype_company_config', JSON.stringify(companyConfig));
      }
    } catch {}
  }, [companyConfig]);

  const [modoSencillo, setModoSencillo] = useState<boolean>(() => {
    try {
      return localStorage.getItem('mype_modo_sencillo') !== 'false';
    } catch {
      return true;
    }
  });

  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const [cloudSyncEnabled, setCloudSyncEnabled] = useState<boolean>(() => {
    try {
      return localStorage.getItem('mype_cloud_sync_enabled') === 'true';
    } catch {
      return false;
    }
  });

  const [monitoreoEnVivo, setMonitoreoEnVivo] = useState<boolean>(() => {
    try {
      return localStorage.getItem('mype_monitoreo_en_vivo') === 'true';
    } catch {
      return false;
    }
  });

  const [simulatedAction, setSimulatedAction] = useState<string | null>(null);

  // PCGE Custom Selected Account details
  const [selectedPCGE, setSelectedPCGE] = useState<PCGEAccount | null>(PCGE_MYPE[2]); // Default 1212
  const [pcgeSearch, setPcgeSearch] = useState<string>('');
  const [pcgeFilter, setPcgeFilter] = useState<string>('Todos');

  // New Transaction Form state (Kept for compatibility with background calculations, but we also use our advanced modal states)
  const [formTipo, setFormTipo] = useState<'VENTA' | 'COMPRA' | 'PLANILLA' | 'APERTURA'>('VENTA');
  const [formMontoBase, setFormMontoBase] = useState<string>('1200');
  const [formDocumento, setFormDocumento] = useState<string>('');
  const [formRuc, setFormRuc] = useState<string>('');
  const [formGlosa, setFormGlosa] = useState<string>('');

  // Advanced High-Fidelity Modal Registration states
  const [activeModal, setActiveModal] = useState<'VENTA' | 'COMPRA' | 'COBRO' | 'PAGO' | 'TRANSFERENCIA' | 'APERTURA' | null>(null);
  
  const [mFecha, setMFecha] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [mTipoComprobante, setMTipoComprobante] = useState<string>('Factura');
  const [mSerieNumero, setMSerieNumero] = useState<string>('');
  const [mRuc, setMRuc] = useState<string>('');
  const [mClienteProveedor, setMClienteProveedor] = useState<string>('');
  const [mMCatalogItem, setMCatalogItem] = useState<string>('');
  const [mCantidad, setMCantidad] = useState<number>(1);
  const [mPrecioUnitario, setMPrecioUnitario] = useState<string>('1200');
  const [mAfectacionIGV, setMAfectacionIGV] = useState<string>('Gravado (Afecto a IGV 18%)');
  const [mGlosa, setMGlosa] = useState<string>('');
  
  const [mCondicionOperacion, setMCondicionOperacion] = useState<'Contado' | 'Crédito'>('Contado');
  const [mEstadoPago, setMEstadoPago] = useState<'Pagado' | 'Pendiente'>('Pagado');
  const [mFormaPago, setMFormaPago] = useState<string>('Efectivo');
  const [mCuentaDinero, setMCuentaDinero] = useState<string>('1041'); // 1041 - Cuentas corrientes
  const [mEstadoInterno, setMEstadoInterno] = useState<string>('Registrado');
  const [mObservaciones, setMObservaciones] = useState<string>('');
  
  // Real-time RUC / DNI Consulta states
  const [loadingConsulta, setLoadingConsulta] = useState<boolean>(false);
  const [consultaStatus, setConsultaStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });
  
  // Tax regime (Fixed to Régimen MYPE Tributario)
  const [regimen] = useState<'RER' | 'RMT'>('RMT');

  // --- Real-Time Monitoring (Real Collaborative Data Feed) ---

  const realTimeFeed = React.useMemo(() => {
    // Return last 15 real transactions formatted for the feed
    const filtered = transactions.filter(tx => !tx.isExtornado);
    return filtered.map(tx => {
      const userRole = tx.creadoPor || 'GERENTE';
      const userFullName = tx.creadoPorNombre || (
        userRole === 'GERENTE' ? 'Gerente General' :
        userRole === 'ADMINISTRADOR' ? 'Ana Torres (Admin)' :
        userRole === 'CONTADOR' ? 'Esteban Delgado (Contador)' :
        'Juan Quispe (Empleado)'
      );
      
      const parts = tx.fecha.split('-');
      const year = parts[0] || '2026';
      const month = parts[1] || '06';
      const day = parts[2] || '15';
      
      return {
        id: tx.id,
        time: `${day}/${month}/${year}`,
        usuario: userFullName,
        role: userRole,
        tipo: tx.tipo,
        monto: tx.total,
        documento: tx.documento,
        descripcion: tx.glosa
      };
    });
  }, [transactions]);

  const [activeToast, setActiveToast] = useState<{
    id: string;
    title: string;
    message: string;
    role: string;
    amount: number;
    tipo: 'VENTA' | 'COMPRA';
  } | null>(null);

  // Detracción and Retención options
  const [sujetoDetraccion, setSujetoDetraccion] = useState<boolean>(false);
  const [tasaDetraccion, setTasaDetraccion] = useState<number>(10); // 10% (Servicios) or 12%
  const [sujetoRetencion, setSujetoRetencion] = useState<boolean>(false); // 3%

  // Libro Diario / Registro filters
  const [filterOperacion, setFilterOperacion] = useState<'TODOS' | 'VENTA' | 'COMPRA' | 'PLANILLA' | 'APERTURA' | 'COBRO' | 'PAGO' | 'TRANSFERENCIA'>('TODOS');
  const [filterCuenta, setFilterCuenta] = useState<string>('');
  const [filterTexto, setFilterTexto] = useState<string>('');

  // Projected annual income in UIT for Tramo selections (1 UIT = S/. 5,500)
  const [projectedIncomeUIT, setProjectedIncomeUIT] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('mype_projected_uit');
      return saved ? Number(saved) : 180; // Tramo 1 default (180 UIT)
    } catch {
      return 180;
    }
  });

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('mype_dark_mode') === 'true';
    } catch {
      return false;
    }
  });

  const [bypassUITLock, setBypassUITLock] = useState<boolean>(() => {
    try {
      return localStorage.getItem('mype_bypass_uit_lock') === 'true';
    } catch {
      return false;
    }
  });

  const [startingCash, setStartingCash] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('mype_starting_cash');
      return saved ? parseFloat(saved) : 0;
    } catch {
      return 0;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('mype_dark_mode', String(darkMode));
    } catch {}
  }, [darkMode]);

  // Projected annual net profit for Progressive Income Tax calculation
  const [customAnnualNetProfit, setCustomAnnualNetProfit] = useState<number>(120000);

  // Renta rate state: 1% or 1.5%
  const [autoRenteRate, setAutoRenteRate] = useState<'300_LIMIT' | 'OVER_300'>('300_LIMIT');
  
  // Apply IGV Justo state
  const [applyIgvJusto, setApplyIgvJusto] = useState<boolean>(false);

  // State to toggle technical trial balance sheet
  const [verHojaTrabajoContable, setVerHojaTrabajoContable] = useState<boolean>(false);

  // Inventory / Kardex Management States
  const [selectedDiarioTab, setSelectedDiarioTab] = useState<'diario' | 'mayor' | 'balance' | 'sunat_req' | 'inventario' | 'catalogo' | 'ventas' | 'compras' | 'inventario_balances'>('ventas');
  const [ventasFiltroDoc, setVentasFiltroDoc] = useState<'TODOS' | 'FACTURAS' | 'BOLETAS'>('TODOS');
  const [comprasFiltroDoc, setComprasFiltroDoc] = useState<'TODOS' | 'FACTURAS' | 'BOLETAS'>('TODOS');
  const [selectedMayorCta, setSelectedMayorCta] = useState<string>('1041');
  const [selectedInventoryProduct, setSelectedInventoryProduct] = useState<string>('1');
  const [showManualStockModal, setShowManualStockModal] = useState<boolean>(false);
  const [manualStockType, setManualStockType] = useState<'INGRESO' | 'SALIDA'>('INGRESO');
  const [manualStockProduct, setManualStockProduct] = useState<string>('1');
  const [manualStockQty, setManualStockQty] = useState<number>(10);
  const [manualStockCost, setManualStockCost] = useState<string>('750');
  const [manualStockGlosa, setManualStockGlosa] = useState<string>('');
  const [manualStockDoc, setManualStockDoc] = useState<string>('');

  // Custom Catalog items state (persisted)
  const [catalogItems, setCatalogItems] = useState(() => {
    try {
      const saved = localStorage.getItem('mype_catalog_items');
      return saved ? JSON.parse(saved) : MOCK_CATALOG;
    } catch {
      return MOCK_CATALOG;
    }
  });

  // Keep catalogItems synced in localStorage
  useEffect(() => {
    localStorage.setItem('mype_catalog_items', JSON.stringify(catalogItems));
  }, [catalogItems]);

  // Product creation states
  const [newProdDesc, setNewProdDesc] = useState<string>('');
  const [newProdPrecio, setNewProdPrecio] = useState<string>('');
  const [newProdTipo, setNewProdTipo] = useState<'VENTA' | 'COMPRA'>('VENTA');
  const [newProdIsPhysical, setNewProdIsPhysical] = useState<boolean>(true);
  const [newProdSku, setNewProdSku] = useState<string>('');
  const [newProdUnidad, setNewProdUnidad] = useState<string>('Unidades');
  const [newProdStockInicial, setNewProdStockInicial] = useState<number>(0);
  const [newProdCostoInicial, setNewProdCostoInicial] = useState<number>(0);

  // Editing state for products
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editingProductPrice, setEditingProductPrice] = useState<string>('');
  const [editingProductDesc, setEditingProductDesc] = useState<string>('');

  // Chat/Assistant state
  const [chatInput, setChatInput] = useState<string>('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    return [
      {
        id: 'welcome',
        role: 'assistant',
        content: `¡Hola! Soy tu asistente contable tributario para el **Régimen MYPE Tributario (RMT)**. 🇵🇪\n\nPuedo guiarte con consultas sobre gastos deducibles, prórroga del **IGV Justo**, libros contables obligatorios con el nuevo **SIRE de la SUNAT**, o explicarte cómo realizar algún asiento específico.\n\nPrueba los botones rápidos abajo o escribe tu pregunta.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
  });
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // --- Effects ---
  useEffect(() => {
    localStorage.setItem('mype_projected_uit', String(projectedIncomeUIT));
    // Synchronize autoRenteRate based on projected UIT (300 UIT threshold)
    setAutoRenteRate(projectedIncomeUIT <= 300 ? '300_LIMIT' : 'OVER_300');
  }, [projectedIncomeUIT]);

  useEffect(() => {
    if (ruc && ruc === transactionsRucRef.current) {
      localStorage.setItem('mype_transactions_' + ruc, JSON.stringify(transactions));
    }
  }, [transactions, ruc]);

  const prevFirstTxIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (transactions.length > 0) {
      const firstTx = transactions[0];
      if (prevFirstTxIdRef.current !== null && prevFirstTxIdRef.current !== firstTx.id) {
        // A new transaction was added! Let's trigger a toast
        const userRole = firstTx.creadoPor || 'GERENTE';
        const userFullName = firstTx.creadoPorNombre || (
          userRole === 'GERENTE' ? 'Gerente General' :
          userRole === 'ADMINISTRADOR' ? 'Ana Torres (Admin)' :
          userRole === 'CONTADOR' ? 'Esteban Delgado (Contador)' :
          'Juan Quispe (Empleado)'
        );
        
        const roleIcon = userRole === 'EMPLEADO' ? '💼' : userRole === 'ADMINISTRADOR' ? '🔧' : userRole === 'CONTADOR' ? '🧮' : '👔';
        
        setActiveToast({
          id: firstTx.id,
          title: `${roleIcon} Operación por ${userFullName.split(' ')[0]}`,
          message: `${firstTx.glosa || 'Transacción registrada en el libro Diario'}`,
          role: userRole,
          amount: firstTx.total,
          tipo: (firstTx.tipo === 'VENTA' || firstTx.tipo === 'COBRO') ? 'VENTA' : 'COMPRA'
        });

        // Automatically change working period to match this transaction's month so it's immediately visible
        const txPeriod = firstTx.fecha.slice(0, 7);
        setPeriod(txPeriod);
      }
      prevFirstTxIdRef.current = firstTx.id;
    } else {
      prevFirstTxIdRef.current = null;
    }
  }, [transactions]);

  // --- Supabase Transaction Sync Effects ---
  const prevTransactionsRef = useRef<Transaction[]>([]);

  // Synchronize transactions state when RUC changes (logout, login, change company)
  useEffect(() => {
    try {
      const saved = localStorage.getItem('mype_transactions_' + ruc);
      if (saved) {
        const loaded = JSON.parse(saved);
        if (Array.isArray(loaded)) {
          const mapped = loaded.map((tx: any) => ({
            ...tx,
            fecha: typeof tx.fecha === 'string' ? tx.fecha : new Date().toISOString().split('T')[0],
            montoBase: typeof tx.montoBase === 'number' ? tx.montoBase : (Number(tx.montoBase) || 0),
            igv: typeof tx.igv === 'number' ? tx.igv : (Number(tx.igv) || 0),
            total: typeof tx.total === 'number' ? tx.total : (Number(tx.total) || 0),
            documento: typeof tx.documento === 'string' ? tx.documento : '',
            glosa: typeof tx.glosa === 'string' ? tx.glosa : '',
            rucClienteProveedor: typeof tx.rucClienteProveedor === 'string' ? tx.rucClienteProveedor : '',
            montoDetraccion: tx.montoDetraccion !== undefined ? (Number(tx.montoDetraccion) || 0) : undefined,
            montoRetencion: tx.montoRetencion !== undefined ? (Number(tx.montoRetencion) || 0) : undefined
          }));
          setTransactions(mapped);
          prevTransactionsRef.current = mapped;
          transactionsRucRef.current = ruc;
          return;
        }
      }
      
      // If no company-specific transactions found, try global ones or fall back to INITIAL_TRANSACTIONS
      const legacySaved = localStorage.getItem('mype_transactions');
      const loaded = legacySaved ? JSON.parse(legacySaved) : INITIAL_TRANSACTIONS;
      if (Array.isArray(loaded)) {
        const mapped = loaded.map((tx: any) => ({
          ...tx,
          fecha: typeof tx.fecha === 'string' ? tx.fecha : new Date().toISOString().split('T')[0],
          montoBase: typeof tx.montoBase === 'number' ? tx.montoBase : (Number(tx.montoBase) || 0),
          igv: typeof tx.igv === 'number' ? tx.igv : (Number(tx.igv) || 0),
          total: typeof tx.total === 'number' ? tx.total : (Number(tx.total) || 0),
          documento: typeof tx.documento === 'string' ? tx.documento : '',
          glosa: typeof tx.glosa === 'string' ? tx.glosa : '',
          rucClienteProveedor: typeof tx.rucClienteProveedor === 'string' ? tx.rucClienteProveedor : '',
          montoDetraccion: tx.montoDetraccion !== undefined ? (Number(tx.montoDetraccion) || 0) : undefined,
          montoRetencion: tx.montoRetencion !== undefined ? (Number(tx.montoRetencion) || 0) : undefined
        }));
        setTransactions(mapped);
        prevTransactionsRef.current = mapped;
        transactionsRucRef.current = ruc;
      } else {
        setTransactions(INITIAL_TRANSACTIONS);
        prevTransactionsRef.current = INITIAL_TRANSACTIONS;
        transactionsRucRef.current = ruc;
      }
    } catch {
      setTransactions(INITIAL_TRANSACTIONS);
      prevTransactionsRef.current = INITIAL_TRANSACTIONS;
      transactionsRucRef.current = ruc;
    }
  }, [ruc]);

  // 1. Fetch transactions from Supabase on load and on a periodic 8s polling interval if live monitoring is active
  useEffect(() => {
    if (!ruc || !isSupabaseConfigured || !supabase || !cloudSyncEnabled) return;

    const fetchTransactions = async () => {
      try {
        const { data, error } = await supabase
          .from('transacciones')
          .select('*')
          .eq('ruc_empresa', ruc)
          .order('fecha', { ascending: false });

        if (error) throw error;

        setSupabaseError(null); // Clear errors on success

        if (data) {
          const mapped: Transaction[] = data.map(tx => {
            const parsedCreadoPor = tx.creado_por || 'EMPLEADO';
            const hasColon = parsedCreadoPor.includes(':');
            const role = hasColon ? parsedCreadoPor.split(':')[0] : parsedCreadoPor;
            const fullName = hasColon ? parsedCreadoPor.split(':')[1] : undefined;

            return {
              id: tx.id,
              fecha: tx.fecha,
              tipo: tx.tipo as any,
              montoBase: Number(tx.monto_base),
              igv: Number(tx.igv),
              total: Number(tx.total),
              glosa: tx.glosa || '',
              rucClienteProveedor: tx.ruc_cliente_proveedor || '',
              documento: tx.documento || '',
              creadoPor: (role || 'EMPLEADO') as any,
              creadoPorNombre: fullName,
              formaPago: tx.forma_pago || 'EFECTIVO',
              cuentaOrigen: tx.cuenta_origen || '',
              cuentaDestino: tx.cuenta_destino || '',
              catalogItemId: tx.catalog_item_id || undefined,
              cantidad: tx.cantidad ? Number(tx.cantidad) : undefined,
              precioUnitario: tx.precio_unitario ? Number(tx.precio_unitario) : undefined,
              esMovimientoInventario: tx.es_movimiento_inventario || false,
              tipoInventario: tx.tipo_inventario as any,
              montoDetraccion: tx.monto_detraccion ? Number(tx.monto_detraccion) : undefined,
              montoRetencion: tx.monto_retencion ? Number(tx.monto_retencion) : undefined,
            };
          });

          // Avoid updating state if the contents are identical (prevent render thrashing)
          setTransactions(prev => {
            const unsavedLocal = prev.filter(tx => 
              tx.id.startsWith('tx_user_') && !mapped.some(m => m.id === tx.id)
            );
            const merged = [...unsavedLocal, ...mapped];
            merged.sort((a, b) => b.fecha.localeCompare(a.fecha) || b.id.localeCompare(a.id));
            if (JSON.stringify(merged) !== JSON.stringify(prev)) {
              prevTransactionsRef.current = merged;
              return merged;
            }
            return prev;
          });
        }
      } catch (err: any) {
        console.warn('Supabase fetch status: unable to retrieve transactions.', err.message || err);
        setSupabaseError(err.message || 'Error de conexión o tablas faltantes en Supabase');
      }
    };

    fetchTransactions();

    if (monitoreoEnVivo) {
      const interval = setInterval(fetchTransactions, 8000);
      return () => clearInterval(interval);
    }
  }, [ruc, monitoreoEnVivo, cloudSyncEnabled]);

  // 2. Push local changes (inserts, updates, deletes) to Supabase cloud
  useEffect(() => {
    if (!ruc || !isSupabaseConfigured || !supabase || !cloudSyncEnabled) return;

    const syncToSupabase = async () => {
      // Find transactions that are new or have changed
      const changed = transactions.filter(tx => {
        const prev = prevTransactionsRef.current.find(p => p.id === tx.id);
        if (!prev) return true; // New transaction
        return JSON.stringify(prev) !== JSON.stringify(tx); // Modified transaction
      });

      if (changed.length === 0) {
        // Check for deletions
        const deletedIds = prevTransactionsRef.current
          .filter(p => !transactions.some(t => t.id === p.id))
          .map(p => p.id);

        if (deletedIds.length > 0) {
          try {
            const { error } = await supabase
              .from('transacciones')
              .delete()
              .in('id', deletedIds);
            if (error) throw error;
            setSupabaseError(null);
          } catch (err: any) {
            console.warn('Supabase delete status: unable to delete transactions.', err.message || err);
            setSupabaseError(err.message || 'Error al eliminar fila en Supabase');
          }
        }
        prevTransactionsRef.current = transactions;
        return;
      }

      // Upsert modified or new transactions
      try {
        const rows = changed.map(tx => ({
          id: tx.id,
          ruc_empresa: ruc,
          fecha: tx.fecha,
          tipo: tx.tipo,
          monto_base: tx.montoBase,
          igv: tx.igv,
          total: tx.total,
          glosa: tx.glosa,
          ruc_cliente_proveedor: tx.rucClienteProveedor,
          documento: tx.documento,
          creado_por: tx.creadoPorNombre ? `${tx.creadoPor}:${tx.creadoPorNombre}` : tx.creadoPor,
          forma_pago: tx.formaPago,
          cuenta_origen: tx.cuentaOrigen,
          cuenta_destino: tx.cuentaDestino,
          catalog_item_id: tx.catalogItemId,
          cantidad: tx.cantidad,
          precio_unitario: tx.precioUnitario,
          es_movimiento_inventario: tx.esMovimientoInventario,
          tipo_inventario: tx.tipoInventario,
          monto_detraccion: tx.montoDetraccion,
          monto_retencion: tx.montoRetencion
        }));

        const { error } = await supabase
          .from('transacciones')
          .upsert(rows);

        if (error) throw error;
        setSupabaseError(null);
      } catch (err: any) {
        console.warn('Supabase sync status: unable to sync transactions.', err.message || err);
        setSupabaseError(err.message || 'Error de sincronización con Supabase (Verifica que creaste las tablas)');
      }

      prevTransactionsRef.current = transactions;
    };

    syncToSupabase();
  }, [transactions, ruc, cloudSyncEnabled]);

  useEffect(() => {
    localStorage.setItem('mype_modo_sencillo', String(modoSencillo));
  }, [modoSencillo]);

  useEffect(() => {
    localStorage.setItem('mype_bypass_uit_lock', String(bypassUITLock));
  }, [bypassUITLock]);

  useEffect(() => {
    localStorage.setItem('mype_starting_cash', String(startingCash));
  }, [startingCash]);

  useEffect(() => {
    localStorage.setItem('mype_monitoreo_en_vivo', String(monitoreoEnVivo));
  }, [monitoreoEnVivo]);

  useEffect(() => {
    localStorage.setItem('mype_cloud_sync_enabled', String(cloudSyncEnabled));
  }, [cloudSyncEnabled]);



  // Toast notification auto-dismissal
  useEffect(() => {
    if (activeToast) {
      const timer = setTimeout(() => {
        setActiveToast(null);
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [activeToast]);





  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isChatLoading]);

  // Handle RUC Change
  const handleRucChange = (val: string) => {
    const numbersOnly = val.replace(/\D/g, '').slice(0, 11);
    setRuc(numbersOnly);
    if (numbersOnly.length > 0) {
      setRucLastDigit(numbersOnly[numbersOnly.length - 1]);
    }
  };

  // --- Calculations ---
  // Period filter
  const filteredTransactions = transactions.filter(tx => tx.fecha.startsWith(period));

  const dynamicMonthsList = React.useMemo(() => {
    const list = [...MONTHS_LIST];
    transactions.forEach(tx => {
      if (tx.fecha && tx.fecha.length >= 7) {
        const value = tx.fecha.slice(0, 7); // "YYYY-MM"
        if (!list.some(m => m.value === value)) {
          const [year, month] = value.split('-');
          const monthNames = [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
          ];
          const monthIndex = parseInt(month, 10) - 1;
          const label = (monthIndex >= 0 && monthIndex < 12)
            ? `${monthNames[monthIndex]} ${year}`
            : value;
          list.push({ value, label });
        }
      }
    });
    return list.sort((a, b) => a.value.localeCompare(b.value));
  }, [transactions]);

  // Dynamic Kardex Calculator for physical items
  const getKardexForProduct = (productId: string) => {
    const product = catalogItems.find((p: any) => p.id === productId);
    if (!product || !product.isPhysical) return null;

    const initialStock = product.stockInicial || 0;
    const initialCost = product.costoInicial || 0;

    // Filter transactions: we want non-extornado transactions that touch this item
    const matchingTxs = transactions.filter(tx => {
      if (tx.isExtornado) return false;
      if (tx.esMovimientoInventario) {
        return tx.catalogItemId === productId;
      }
      return tx.catalogItemId === productId && (tx.tipo === 'VENTA' || tx.tipo === 'COMPRA');
    });

    // Sort matching transactions by date ascending, then by ID
    const sortedTxs = [...matchingTxs].sort((a, b) => {
      const dateCompare = a.fecha.localeCompare(b.fecha);
      if (dateCompare !== 0) return dateCompare;
      return a.id.localeCompare(b.id);
    });

    let currentStock = initialStock;
    let currentCost = initialCost;
    let totalValue = initialStock * initialCost;

    let totalEntradas = 0;
    let totalSalidas = 0;

    const movements = sortedTxs.map(tx => {
      const isIngreso = tx.tipo === 'COMPRA' || (tx.esMovimientoInventario && tx.tipoInventario === 'INGRESO');
      const qty = tx.cantidad || 0;
      const txUnitPrice = tx.precioUnitario || 0;

      let entryQty = 0;
      let entryPrice = 0;
      let entryTotal = 0;
      let exitQty = 0;
      let exitPrice = 0;
      let exitTotal = 0;

      if (isIngreso) {
        entryQty = qty;
        entryPrice = txUnitPrice;
        entryTotal = qty * txUnitPrice;
        
        currentStock += qty;
        totalValue += entryTotal;
        if (currentStock > 0) {
          currentCost = totalValue / currentStock;
        }
        totalEntradas += qty;
      } else {
        entryQty = 0;
        entryPrice = 0;
        entryTotal = 0;
        exitQty = qty;
        exitPrice = currentCost; // exiting cost is the current Average Cost
        exitTotal = qty * currentCost;
        
        currentStock -= qty;
        totalValue -= exitTotal;
        totalSalidas += qty;
      }

      return {
        txId: tx.id,
        fecha: tx.fecha,
        documento: tx.documento,
        tipo: tx.esMovimientoInventario ? (tx.tipoInventario === 'INGRESO' ? 'INGRESO_ALMACEN' : 'SALIDA_ALMACEN') : tx.tipo,
        glosa: tx.glosa,
        entryQty,
        entryPrice,
        entryTotal,
        exitQty,
        exitPrice,
        exitTotal,
        saldoStock: currentStock,
        saldoCost: currentCost,
        saldoTotal: totalValue,
      };
    });

    return {
      product,
      stockInicial: initialStock,
      costoInicial: initialCost,
      valorInicial: initialStock * initialCost,
      stockActual: currentStock,
      costoPromedioActual: currentCost,
      valorActual: totalValue,
      totalEntradas,
      totalSalidas,
      movements
    };
  };

  // Multi-Filter Logic representing search and autocomplete features requested
  const visibleTransactions = filteredTransactions.filter(tx => {
    // 1. Operation Type filter
    if (filterOperacion !== 'TODOS' && tx.tipo !== filterOperacion) {
      return false;
    }

    // 2. Account filter: checks if any generated entry touches the typed account code (e.g. "12")
    if (filterCuenta.trim()) {
      const seats = generateSeatsFromTransaction(tx);
      const touchesAccount = seats.some(seat => seat.cuenta.startsWith(filterCuenta.trim()));
      if (!touchesAccount) return false;
    }

    // 3. Simple text search matching glosa, RUC, or document reference
    if (filterTexto.trim()) {
      const query = filterTexto.toLowerCase().trim();
      const matchesGlosa = tx.glosa.toLowerCase().includes(query);
      const matchesRuc = tx.rucClienteProveedor.toLowerCase().includes(query);
      const matchesDoc = tx.documento.toLowerCase().includes(query);
      if (!matchesGlosa && !matchesRuc && !matchesDoc) return false;
    }

    return true;
  });

  // Totals for the selected month/period
  const totalVentasBase = filteredTransactions
    .filter(tx => tx.tipo === 'VENTA')
    .reduce((sum, tx) => sum + tx.montoBase, 0);

  const totalVentasIgv = filteredTransactions
    .filter(tx => tx.tipo === 'VENTA')
    .reduce((sum, tx) => sum + tx.igv, 0);

  const totalVentasTotal = filteredTransactions
    .filter(tx => tx.tipo === 'VENTA')
    .reduce((sum, tx) => sum + tx.total, 0);

  const totalComprasBase = filteredTransactions
    .filter(tx => tx.tipo === 'COMPRA')
    .reduce((sum, tx) => sum + tx.montoBase, 0);

  const totalComprasIgv = filteredTransactions
    .filter(tx => tx.tipo === 'COMPRA')
    .reduce((sum, tx) => sum + tx.igv, 0);

  const totalComprasTotal = filteredTransactions
    .filter(tx => tx.tipo === 'COMPRA')
    .reduce((sum, tx) => sum + tx.total, 0);

  // Liquidación del mes
  const igvPagarCalculado = Math.max(0, totalVentasIgv - totalComprasIgv);
  
  // Pago a Cuenta Renta:
  // - En RER: 1.5% fijo mensual sobre ingresos netos.
  // - En RMT: 1.0% de renta neta (hasta 300 UIT), luego 1.5%.
  const rentaTasa = regimen === 'RER' ? 0.015 : (autoRenteRate === '300_LIMIT' ? 0.01 : 0.015);
  const rentaPagarCalculado = totalVentasBase * rentaTasa;

  // Total obligation
  const totalTributoOriginal = igvPagarCalculado + rentaPagarCalculado;
  const totalAbonadoEfectivo = applyIgvJusto 
    ? rentaPagarCalculado // under IGV Justo, current payment is deferred for up to 3 months, only Pay Renta today
    : totalTributoOriginal;

  // Generate Accounting Entries dynamically
  const allEntries: AccountingEntry[] = [];
  if (startingCash > 0) {
    allEntries.push(
      {
        id: 'starting_cash_debit',
        asientoId: 'tx_starting_cash',
        fecha: `${period}-01`,
        glosa: 'Apertura: Caja de inicio / Saldo inicial en efectivo',
        cuenta: '101',
        cuentaNombre: 'Caja - Efectivo',
        debe: startingCash,
        haber: 0
      },
      {
        id: 'starting_cash_credit',
        asientoId: 'tx_starting_cash',
        fecha: `${period}-01`,
        glosa: 'Apertura: Caja de inicio / Saldo inicial en efectivo',
        cuenta: '5011',
        cuentaNombre: 'Acciones - Capital Social',
        debe: 0,
        haber: startingCash
      }
    );
  }
  visibleTransactions.forEach(tx => {
    allEntries.push(...generateSeatsFromTransaction(tx));
  });

  const allPeriodEntries: AccountingEntry[] = [];
  if (startingCash > 0) {
    allPeriodEntries.push(
      {
        id: 'starting_cash_debit',
        asientoId: 'tx_starting_cash',
        fecha: `${period}-01`,
        glosa: 'Apertura: Caja de inicio / Saldo inicial en efectivo',
        cuenta: '101',
        cuentaNombre: 'Caja - Efectivo',
        debe: startingCash,
        haber: 0
      },
      {
        id: 'starting_cash_credit',
        asientoId: 'tx_starting_cash',
        fecha: `${period}-01`,
        glosa: 'Apertura: Caja de inicio / Saldo inicial en efectivo',
        cuenta: '5011',
        cuentaNombre: 'Acciones - Capital Social',
        debe: 0,
        haber: startingCash
      }
    );
  }
  filteredTransactions.forEach(tx => {
    allPeriodEntries.push(...generateSeatsFromTransaction(tx));
  });

  // Calculate Balance Check (Debe / Haber)
  const totalDebeGlobal = allEntries.reduce((sum, e) => sum + e.debe, 0);
  const totalHaberGlobal = allEntries.reduce((sum, e) => sum + e.haber, 0);
  const isBalanced = Math.abs(totalDebeGlobal - totalHaberGlobal) < 0.01;

  // --- TOP-LEVEL SIMULATION CALCULATIONS ---
  const entries = allPeriodEntries;
  
  // --- ACTIVO ---
  const cajaBancos = entries
    .filter(e => e.cuenta.startsWith('10'))
    .reduce((sum, e) => sum + (e.debe - e.haber), 0);

  const ctasPorCobrar = entries
    .filter(e => e.cuenta.startsWith('12'))
    .reduce((sum, e) => sum + (e.debe - e.haber), 0);

  const mercaderias = entries
    .filter(e => e.cuenta.startsWith('20'))
    .reduce((sum, e) => sum + (e.debe - e.haber), 0);

  const equiposIntangibles = entries
    .filter(e => e.cuenta.startsWith('33') || e.cuenta.startsWith('34'))
    .reduce((sum, e) => sum + (e.debe - e.haber), 0);

  // Split IGV into credit or debit
  const igvDebito = entries
    .filter(e => e.cuenta === '40111')
    .reduce((sum, e) => sum + e.haber, 0);

  const igvCredito = entries
    .filter(e => e.cuenta === '40111')
    .reduce((sum, e) => sum + e.debe, 0);

  const netIGV = igvDebito - igvCredito;
  const impuestosPorCobrar = netIGV < 0 ? -netIGV : 0;
  const igvPorPagar = netIGV > 0 ? netIGV : 0;

  const otrosTributos = entries
    .filter(e => e.cuenta.startsWith('40') && e.cuenta !== '40111')
    .reduce((sum, e) => sum + (e.haber - e.debe), 0);

  const tributos = igvPorPagar + otrosTributos;

  const planillas = entries
    .filter(e => e.cuenta.startsWith('41'))
    .reduce((sum, e) => sum + (e.haber - e.debe), 0);

  const ctasPorPagar = entries
    .filter(e => e.cuenta.startsWith('42'))
    .reduce((sum, e) => sum + (e.haber - e.debe), 0);

  // --- PATRIMONIO ---
  const capitalSocial = entries
    .filter(e => e.cuenta.startsWith('50'))
    .reduce((sum, e) => sum + (e.haber - e.debe), 0);

  const resultadosAcumulados = entries
    .filter(e => e.cuenta.startsWith('59'))
    .reduce((sum, e) => sum + (e.haber - e.debe), 0);

  const ingresos = entries
    .filter(e => e.cuenta.startsWith('7'))
    .reduce((sum, e) => sum + (e.haber - e.debe), 0);

  const gastos = entries
    .filter(e => e.cuenta.startsWith('6') || e.cuenta.startsWith('9'))
    .reduce((sum, e) => sum + (e.debe - e.haber), 0);

  const utilidadNeto = ingresos - gastos;

  // --- DYNAMIC SIMULATION ENGINE ---
  let cajaBancosSim = cajaBancos;
  let ctasPorCobrarSim = ctasPorCobrar;
  let mercaderiasSim = mercaderias;
  let equiposIntangiblesSim = equiposIntangibles;
  let impuestosPorCobrarSim = impuestosPorCobrar;
  let tributosSim = tributos;
  let planillasSim = planillas;
  let ctasPorPagarSim = ctasPorPagar;
  let capitalSocialSim = capitalSocial;
  let resultadosAcumuladosSim = resultadosAcumulados;
  let ingresosSim = ingresos;
  let gastosSim = gastos;

  if (simulatedAction === 'VENTA_EFECTIVO') {
    cajaBancosSim += 2000;
    ingresosSim += 1694.92;
    const simNetIGV = (igvDebito + 305.08) - igvCredito;
    if (simNetIGV < 0) {
      impuestosPorCobrarSim = -simNetIGV;
      tributosSim = otrosTributos;
    } else {
      impuestosPorCobrarSim = 0;
      tributosSim = simNetIGV + otrosTributos;
    }
  } else if (simulatedAction === 'COMPRA_CREDITO') {
    mercaderiasSim += 847.46;
    const simNetIGV = igvDebito - (igvCredito + 152.54);
    if (simNetIGV < 0) {
      impuestosPorCobrarSim = -simNetIGV;
      tributosSim = otrosTributos;
    } else {
      impuestosPorCobrarSim = 0;
      tributosSim = simNetIGV + otrosTributos;
    }
    ctasPorPagarSim += 1000;
  } else if (simulatedAction === 'COBRO_EFECTIVO') {
    cajaBancosSim += 500;
    ctasPorCobrarSim -= 500;
  } else if (simulatedAction === 'PAGO_IMPUESTOS') {
    cajaBancosSim -= 300;
    if (tributosSim >= 300) {
      tributosSim -= 300;
    } else {
      const diff = 300 - tributosSim;
      tributosSim = 0;
      impuestosPorCobrarSim += diff;
    }
  }

  const utilidadNetoSim = ingresosSim - gastosSim;
  const totalActivosSim = cajaBancosSim + ctasPorCobrarSim + mercaderiasSim + equiposIntangiblesSim + impuestosPorCobrarSim;
  const totalPasivosSim = tributosSim + planillasSim + ctasPorPagarSim;
  const totalPatrimonioSim = capitalSocialSim + resultadosAcumuladosSim + utilidadNetoSim;
  const totalPasivoYPatrimonioSim = totalPasivosSim + totalPatrimonioSim;
  const balancesCuadranSim = Math.abs(totalActivosSim - totalPasivoYPatrimonioSim) < 0.01;

  // Calculate percentages for the stacked visualization chart
  const sumTotal = totalActivosSim + totalPasivoYPatrimonioSim;
  const pctActivos = sumTotal > 0 ? (totalActivosSim / sumTotal) * 100 : 50;
  const pctPasivosYPat = sumTotal > 0 ? (totalPasivoYPatrimonioSim / sumTotal) * 100 : 50;

  // Financial Health Score & Traffic Light Indicator
  let healthBadge = "🟢 EXCELENTE SALUD";
  let healthColor = "border-emerald-200 bg-emerald-50 text-emerald-900";
  let healthDot = "bg-emerald-500";
  let healthAdvice = "Tus pertenencias e inversión propia superan ampliamente las deudas comerciales de tu empresa. ¡Tu negocio se encuentra en una situación contable magnífica!";
  
  if (totalPasivosSim > totalActivosSim) {
    healthBadge = "🔴 ALERTA DE DEUDA ALTA";
    healthColor = "border-rose-200 bg-rose-50 text-rose-900";
    healthDot = "bg-rose-500";
    healthAdvice = "Cuidado: Tus compromisos de pago con terceros superan el total de tus bienes actuales. Recomendamos impulsar tus ventas al contado o refinanciar deudas con proveedores.";
  } else if (totalPasivosSim > 0 && (totalPasivosSim / (totalActivosSim || 1)) > 0.6) {
    healthBadge = "🟡 DEUDA MODERADA";
    healthColor = "border-amber-200 bg-amber-50 text-amber-900";
    healthDot = "bg-amber-500";
    healthAdvice = "Tus deudas acumuladas representan más del 60% de tus activos totales. Vigila tus deudas corrientes para evitar cuellos de botella con la liquidez de tu caja.";
  }

  // Deadline info
  const deadlineInfo = getSUNATDeadline(rucLastDigit, period);

  // --- Handlers ---
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');
    setRegSuccess('');

    const cleanRuc = regRuc.trim().replace(/\D/g, '');
    const cleanRazonSocial = regRazonSocial.trim();
    const cleanNombreGerente = regNombreGerente.trim();
    const cleanUser = regUsuarioSol.trim();
    const cleanPass = regClaveSol.trim();

    if (cleanRuc.length !== 11) {
      setRegError('El RUC peruano debe tener exactamente 11 dígitos numéricos.');
      return;
    }
    if (!['10', '15', '20'].includes(cleanRuc.substring(0, 2))) {
      setRegError('El RUC debe comenzar con 10, 15 o 20.');
      return;
    }
    if (!cleanRazonSocial) {
      setRegError('Por favor, ingrese la Razón Social.');
      return;
    }
    if (!cleanNombreGerente) {
      setRegError('Por favor, ingrese el nombre del Gerente.');
      return;
    }
    if (!cleanUser) {
      setRegError('Por favor, ingrese el Usuario SOL.');
      return;
    }
    if (cleanPass.length < 4) {
      setRegError('La contraseña SOL debe tener al menos 4 caracteres.');
      return;
    }

    const newUser: SimulatedUser = {
      ruc: cleanRuc,
      usuarioSol: cleanUser.toUpperCase(),
      contrasenaSol: cleanPass,
      role: 'GERENTE',
      fullName: `${cleanNombreGerente} (Gerente General)`
    };

    const registered = await registerUserCloud(newUser);
    if (!registered) {
      setRegError('Este Usuario SOL ya se encuentra registrado para este RUC.');
      return;
    }

    // Save company config specifically for this RUC
    const newConfig: CompanyConfig = {
      ruc: cleanRuc,
      razonSocial: cleanRazonSocial,
      direccion: 'Av. Principal de la Empresa, Perú',
      telefono: '999888777',
      correo: 'contacto@' + cleanRazonSocial.toLowerCase().replace(/[^a-z0-9]/g, '') + '.pe',
      representanteLegal: cleanNombreGerente
    };
    localStorage.setItem('mype_company_config_' + cleanRuc, JSON.stringify(newConfig));
    localStorage.setItem('mype_company_name_' + cleanRuc, cleanRazonSocial);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from('configuracion_empresa')
          .upsert({
            ruc: cleanRuc,
            razon_social: cleanRazonSocial,
            direccion: newConfig.direccion,
            telefono: newConfig.telefono,
            correo: newConfig.correo,
            representante_legal: newConfig.representanteLegal
          });
      } catch (err) {
        console.error('Error saving company profile to Supabase:', err);
      }
    }

    setRegSuccess('¡Empresa y Gerente registrados correctamente! Ya puedes iniciar sesión.');
    
    // Clear registration fields
    setRegRuc('');
    setRegRazonSocial('');
    setRegNombreGerente('');
    setRegUsuarioSol('');
    setRegClaveSol('');

    // Wait a bit and switch to login mode
    setTimeout(() => {
      setLoginRuc(cleanRuc);
      setLoginUser(cleanUser.toUpperCase());
      setLoginMode('login');
      setRegSuccess('');
    }, 2500);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const cleanRuc = loginRuc.trim().replace(/\D/g, '');
    const cleanUser = loginUser.trim();
    const cleanPass = loginPassword.trim();

    if (!cleanUser) {
      setLoginError('Por favor ingrese el Usuario.');
      return;
    }
    if (cleanPass.length < 4) {
      setLoginError('La contraseña debe tener al menos 4 caracteres.');
      return;
    }

    let matchedUser = null;
    let finalRuc = '';

    if (loginType === 'gerente') {
      if (cleanRuc.length !== 11) {
        setLoginError('El RUC peruano debe tener exactamente 11 dígitos numéricos.');
        return;
      }
      if (!['10', '15', '20'].includes(cleanRuc.substring(0, 2))) {
        setLoginError('El RUC debe comenzar con 10 (Persona Natural con Negocio), 15 o 20 (Persona Jurídica).');
        return;
      }

      matchedUser = await validateUserCloud(cleanUser, cleanPass, cleanRuc);

      if (!matchedUser) {
        setLoginError('Credenciales Clave SOL de Gerente inválidas para este RUC. Verifica tus datos o regístrate.');
        return;
      }

      if (matchedUser.role !== 'GERENTE') {
        setLoginError('Este acceso con RUC requiere el rol GERENTE. Si eres Admin, Contador o Empleado, inicia sesión desde la pestaña Colaboradores.');
        return;
      }

      finalRuc = cleanRuc;
    } else {
      // Colaborador login (No RUC required)
      matchedUser = await validateUserCloud(cleanUser, cleanPass);

      if (!matchedUser) {
        setLoginError('Usuario o Contraseña incorrectos. Verifica tus credenciales o solicita el alta de tu usuario en Configuración.');
        return;
      }

      // Flexible validation: Only allow ADMINISTRADOR, CONTADOR, or EMPLEADO
      const allowedRoles = ['ADMINISTRADOR', 'CONTADOR', 'EMPLEADO'];
      if (!allowedRoles.includes(matchedUser.role.toUpperCase())) {
        if (matchedUser.role.toUpperCase() === 'GERENTE') {
          setLoginError('El acceso para Gerentes requiere ingresar el RUC de la Empresa. Por favor, inicia sesión desde la pestaña Gerente.');
        } else {
          setLoginError('El rol de este usuario no está autorizado para ingresar como Colaborador.');
        }
        return;
      }

      finalRuc = matchedUser.ruc;
    }

    if (matchedUser.estado === 'PENDIENTE') {
      setLoginError('Tu cuenta aún está en proceso de aprobación. Comunícate con soporte para activarla.');
      return;
    }

    const finalRole = matchedUser.role;

    // Load company config for this RUC
    let userCompanyConfig = DEFAULT_COMPANY_CONFIG;
    try {
      let loadedFromSupabase = false;
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase
          .from('configuracion_empresa')
          .select('*')
          .eq('ruc', finalRuc)
          .maybeSingle();
        
        if (data && !error) {
          userCompanyConfig = {
            ruc: data.ruc,
            razonSocial: data.razon_social,
            direccion: data.direccion,
            telefono: data.telefono,
            correo: data.correo,
            representanteLegal: data.representante_legal
          };
          loadedFromSupabase = true;
        }
      }

      if (!loadedFromSupabase) {
        const stored = localStorage.getItem('mype_company_config_' + finalRuc);
        if (stored) {
          userCompanyConfig = JSON.parse(stored);
        } else {
          // If not found, create a customized default for this user
          userCompanyConfig = {
            ruc: finalRuc,
            razonSocial: localStorage.getItem('mype_company_name_' + finalRuc) || (finalRuc === '20601234567' ? 'Empresa de Servicios Generales SAC' : `MYPE RUC ${finalRuc} S.A.C.`),
            direccion: 'Av. Las Flores 450, San Isidro, Lima, Perú',
            telefono: '(01) 456-7890',
            correo: 'contacto@empresamype.pe',
            representanteLegal: matchedUser.fullName.replace(' (Gerente General)', '')
          };
          localStorage.setItem('mype_company_config_' + finalRuc, JSON.stringify(userCompanyConfig));
        }
      }
    } catch (e) {
      console.error('Error loading custom company config', e);
    }

    setCompanyConfig(userCompanyConfig);

    // Persist session
    localStorage.setItem('mype_logged_in', 'true');
    localStorage.setItem('mype_user_ruc', finalRuc);
    localStorage.setItem('mype_sol_user', cleanUser);
    localStorage.setItem('mype_user_role', finalRole);
    localStorage.setItem('mype_user_fullname', matchedUser.fullName);

    setIsLoggedIn(true);
    setRuc(finalRuc);
    setSolUser(cleanUser);
    setCurrentUserRole(finalRole);
    setCurrentUserFullName(matchedUser.fullName);
    setRucLastDigit(finalRuc[finalRuc.length - 1]);
    
    // Welcome chat notification or system message update
    setChatMessages(prev => [
      ...prev,
      {
        id: 'login_confirm_' + Date.now(),
        role: 'assistant',
        content: `📈 **Sesión Iniciada como ${finalRole} por ${matchedUser.fullName}.**\n\nBienvenido, la empresa con RUC **${finalRuc}** ya está conectada al Sistema de Libros Electrónicos y SIRE de SUNAT.\n\nHe adaptado el calendario tributario. Para tu dígito verificador **${finalRuc[finalRuc.length - 1]}**, tu fecha límite es el **${getSUNATDeadline(finalRuc[finalRuc.length - 1], period).date}**.\n\n*Nota de permisos:* Tienes el rol **${finalRole}**. ${finalRole === 'EMPLEADO' ? 'Solo los roles GERENTE o ADMINISTRADOR están autorizados para eliminar asientos o limpiar libros contables.' : 'Tienes permisos completos de modificación y eliminación de asientos diarios y configuración general.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const handleLogout = () => {
    if (confirm('¿Desea cerrar la sesión de Clave SOL? Se desconectará de la SUNAT.')) {
      localStorage.removeItem('mype_logged_in');
      localStorage.removeItem('mype_user_ruc');
      localStorage.removeItem('mype_sol_user');
      localStorage.removeItem('mype_user_role');
      localStorage.removeItem('mype_user_fullname');
      setIsLoggedIn(false);
      setRuc('20601234567');
      setSolUser('CONTADOR_MYPE');
      setCurrentUserRole('GERENTE');
      setCurrentUserFullName('Usuario General');
      setRucLastDigit('7');
      setLoginRuc('');
      setLoginUser('');
      setLoginPassword('');
    }
  };

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    const baseNum = parseFloat(formMontoBase);
    if (isNaN(baseNum) || baseNum <= 0) {
      alert('Por favor, ingresa un monto base / sueldo / capital válido mayor a cero.');
      return;
    }

    let calculatedIgv = baseNum * 0.18;
    let calculatedTotal = baseNum + calculatedIgv;

    if (formTipo === 'PLANILLA' || formTipo === 'APERTURA') {
      calculatedIgv = 0;
      calculatedTotal = baseNum;
    }

    // Use current selected date or fallback to some day of selected period
    const todayStr = new Date().toISOString().split('T')[0];
    const itemDate = todayStr.startsWith(period) ? todayStr : `${period}-15`;

    let finalGlosa = formGlosa.trim();
    if (!finalGlosa) {
      if (formTipo === 'VENTA') finalGlosa = 'Venta de mercadería MYPE';
      else if (formTipo === 'COMPRA') finalGlosa = 'Compra en Régimen MYPE';
      else if (formTipo === 'PLANILLA') finalGlosa = 'Registro de planilla de sueldos';
      else if (formTipo === 'APERTURA') finalGlosa = 'Asiento de apertura del ejercicio';
    }

    let resolvedDocumento = formDocumento.trim();
    if (!resolvedDocumento) {
      if (formTipo === 'VENTA') resolvedDocumento = `F001-${Math.floor(Math.random() * 9000) + 1000}`;
      else if (formTipo === 'COMPRA') resolvedDocumento = `FT01-${Math.floor(Math.random() * 9000) + 1000}`;
      else if (formTipo === 'PLANILLA') resolvedDocumento = `PL-${period.replace('-', '')}`;
      else if (formTipo === 'APERTURA') resolvedDocumento = `AP-${period.split('-')[0]}`;
    }

    let calculatedDetraccion = 0;
    if ((formTipo === 'VENTA' || formTipo === 'COMPRA') && sujetoDetraccion) {
      calculatedDetraccion = Number((calculatedTotal * (tasaDetraccion / 100)).toFixed(2));
    }

    let calculatedRetencion = 0;
    if (formTipo === 'VENTA' && sujetoRetencion) {
      calculatedRetencion = Number((calculatedTotal * 0.03).toFixed(2));
    }

    const newTx: Transaction = {
      id: 'tx_user_' + Date.now(),
      fecha: itemDate,
      tipo: formTipo,
      montoBase: baseNum,
      igv: calculatedIgv,
      total: calculatedTotal,
      glosa: finalGlosa,
      rucClienteProveedor: (formTipo === 'PLANILLA' || formTipo === 'APERTURA') ? ruc : (formRuc ? formRuc.trim() : (formTipo === 'VENTA' ? '20100200300' : '20500600700')),
      documento: resolvedDocumento,
      creadoPor: currentUserRole,
      creadoPorNombre: currentUserFullName,
      sujetoDetraccion: (formTipo === 'VENTA' || formTipo === 'COMPRA') ? sujetoDetraccion : false,
      tasaDetraccion: (formTipo === 'VENTA' || formTipo === 'COMPRA') ? tasaDetraccion : undefined,
      montoDetraccion: (formTipo === 'VENTA' || formTipo === 'COMPRA') && sujetoDetraccion ? calculatedDetraccion : undefined,
      sujetoRetencion: formTipo === 'VENTA' ? sujetoRetencion : false,
      montoRetencion: formTipo === 'VENTA' && sujetoRetencion ? calculatedRetencion : undefined
    };

    setTransactions(prev => [newTx, ...prev]);
    const txPeriod = itemDate.slice(0, 7);
    setPeriod(txPeriod);
    
    // Reset form fields and flags
    setFormMontoBase('');
    setFormDocumento('');
    setFormRuc('');
    setFormGlosa('');
    setSujetoDetraccion(false);
    setSujetoRetencion(false);
  };

  const handleConsultaRucDni = async (num: string) => {
    const cleanNum = num.replace(/\D/g, '').trim();
    if (cleanNum.length !== 8 && cleanNum.length !== 11) {
      setConsultaStatus({ type: 'error', message: 'Ingresa 8 dígitos (DNI) o 11 dígitos (RUC).' });
      return;
    }

    setLoadingConsulta(true);
    setConsultaStatus({ type: null, message: '' });

    try {
      const response = await fetch(`/api/consulta-ruc-dni?numero=${cleanNum}`);
      if (!response.ok) {
        throw new Error('Servidor SUNAT/RENIEC no disponible temporalmente.');
      }
      const data = await response.json();
      if (data && data.success && data.nombre) {
        setMClienteProveedor(data.nombre);
        setConsultaStatus({
          type: 'success',
          message: `✓ ${data.tipo} Validado (${data.origen})`
        });
      } else {
        setConsultaStatus({
          type: 'error',
          message: data.error || 'No se encontró información para este número.'
        });
      }
    } catch (err: any) {
      setConsultaStatus({
        type: 'error',
        message: 'Consulta SUNAT/RENIEC fuera de línea. Ingresa el nombre manualmente.'
      });
    } finally {
      setLoadingConsulta(false);
    }
  };

  const handleModalSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeModal) return;

    let baseNum = 0;
    let calculatedIgv = 0;
    let calculatedTotal = 0;

    if (activeModal === 'VENTA' || activeModal === 'COMPRA') {
      baseNum = parseFloat(mPrecioUnitario) * mCantidad;
      if (isNaN(baseNum) || baseNum <= 0) {
        alert('Por favor, ingresa una cantidad y precio unitario válidos.');
        return;
      }
      calculatedIgv = mAfectacionIGV.includes('Gravado') ? baseNum * 0.18 : 0;
      calculatedTotal = baseNum + calculatedIgv;
    } else {
      // For Cobro, Pago, Transferencia, Apertura
      baseNum = parseFloat(mPrecioUnitario); // This represents the cash movement amount
      if (isNaN(baseNum) || baseNum <= 0) {
        alert('Por favor, ingresa un monto válido para la operación.');
        return;
      }
      calculatedIgv = 0;
      calculatedTotal = baseNum;
    }

    // Bancarización Alert for Purchases (Compras) equal or over S/. 2000 paid in Cash
    if (activeModal === 'COMPRA' && calculatedTotal >= 2000 && mFormaPago === 'Efectivo') {
      const confirmProceed = window.confirm(
        '⚠️ ADVERTENCIA DE BANCARIZACIÓN SUNAT\n\nEsta compra supera los S/. 2,000.00 pero has seleccionado "Efectivo" como forma de pago.\n\nDe acuerdo con la legislación tributaria peruana, toda transacción a partir de S/. 2,000.00 (o $500.00 USD) exige de forma obligatoria el uso de un Medio de Pago Bancario (Transferencia, Depósito o Tarjeta).\n\nSi guardas esta compra en "Efectivo", la SUNAT invalidará el costo/gasto y PERDERÁS el Crédito Fiscal del IGV.\n\n¿Estás seguro de que deseas continuar y registrarla en Efectivo de todas formas?'
      );
      if (!confirmProceed) return;
    }

    let finalGlosa = mGlosa.trim();
    if (!finalGlosa) {
      if (activeModal === 'VENTA') finalGlosa = `Venta de ${mMCatalogItem || 'Servicios/Mercadería'}`;
      else if (activeModal === 'COMPRA') finalGlosa = `Compra de ${mMCatalogItem || 'Bienes/Servicios'}`;
      else if (activeModal === 'COBRO') finalGlosa = `Cobro de Factura ${mSerieNumero}`;
      else if (activeModal === 'PAGO') finalGlosa = `Pago a Proveedor ${mSerieNumero}`;
      else if (activeModal === 'TRANSFERENCIA') finalGlosa = `Transferencia interna de fondos`;
      else if (activeModal === 'APERTURA') finalGlosa = `Aporte de capital de socio`;
    }

    let resolvedDocumento = mSerieNumero.trim();
    if (!resolvedDocumento) {
      if (activeModal === 'VENTA') resolvedDocumento = `F001-${Math.floor(Math.random() * 90000) + 10000}`;
      else if (activeModal === 'COMPRA') resolvedDocumento = `FT01-${Math.floor(Math.random() * 90000) + 10000}`;
      else if (activeModal === 'COBRO') resolvedDocumento = `RC01-${Math.floor(Math.random() * 90000) + 10000}`;
      else if (activeModal === 'PAGO') resolvedDocumento = `RP01-${Math.floor(Math.random() * 90000) + 10000}`;
      else if (activeModal === 'TRANSFERENCIA') resolvedDocumento = `TR-${Math.floor(Math.random() * 90000) + 10000}`;
      else if (activeModal === 'APERTURA') resolvedDocumento = `AC01-${Math.floor(Math.random() * 90000) + 10000}`;
    }

    let calculatedDetraccion = 0;
    if ((activeModal === 'VENTA' || activeModal === 'COMPRA') && sujetoDetraccion) {
      calculatedDetraccion = Number((calculatedTotal * (tasaDetraccion / 100)).toFixed(2));
    }

    let calculatedRetencion = 0;
    if (activeModal === 'VENTA' && sujetoRetencion) {
      calculatedRetencion = Number((calculatedTotal * 0.03).toFixed(2));
    }

    let matchedCatalogItem = catalogItems.find((c: any) => c.desc.trim().toLowerCase() === mMCatalogItem.trim().toLowerCase());

    if ((activeModal === 'VENTA' || activeModal === 'COMPRA') && mMCatalogItem.trim() && !matchedCatalogItem) {
      const isPhysicalProduct = true;
      const newId = 'prod_auto_' + Date.now();
      const newProductPrice = parseFloat(mPrecioUnitario) || 0;
      
      const newCatalogItem = {
        id: newId,
        desc: mMCatalogItem.trim(),
        precio: newProductPrice,
        tipo: activeModal,
        isPhysical: isPhysicalProduct,
        sku: `AUTO-${Math.floor(1000 + Math.random() * 9000)}`,
        unidad: 'Unidades',
        stockInicial: 0,
        costoInicial: Number((newProductPrice * 0.7).toFixed(2))
      };
      
      setCatalogItems((prev: any) => [...prev, newCatalogItem]);
      matchedCatalogItem = newCatalogItem;
    }

    const newTx: Transaction = {
      id: 'tx_user_' + Date.now(),
      fecha: mFecha,
      tipo: activeModal,
      montoBase: baseNum,
      igv: calculatedIgv,
      total: calculatedTotal,
      glosa: finalGlosa,
      rucClienteProveedor: mRuc ? mRuc.trim() : (activeModal === 'VENTA' || activeModal === 'COBRO' ? '20100200300' : '20500600700'),
      clienteProveedorNombre: (activeModal !== 'TRANSFERENCIA' && mClienteProveedor) ? mClienteProveedor.trim() : undefined,
      documento: resolvedDocumento,
      creadoPor: currentUserRole,
      creadoPorNombre: currentUserFullName,
      sujetoDetraccion: (activeModal === 'VENTA' || activeModal === 'COMPRA') ? sujetoDetraccion : false,
      tasaDetraccion: (activeModal === 'VENTA' || activeModal === 'COMPRA') ? tasaDetraccion : undefined,
      montoDetraccion: (activeModal === 'VENTA' || activeModal === 'COMPRA') && sujetoDetraccion ? calculatedDetraccion : undefined,
      sujetoRetencion: activeModal === 'VENTA' ? sujetoRetencion : false,
      montoRetencion: activeModal === 'VENTA' && sujetoRetencion ? calculatedRetencion : undefined,
      
      // Treasury fields
      cuentaOrigen: activeModal === 'COBRO' ? '1212' : activeModal === 'PAGO' ? '4212' : activeModal === 'APERTURA' ? '5011' : mCuentaDinero,
      cuentaDestino: activeModal === 'COBRO' ? mCuentaDinero : activeModal === 'PAGO' ? mCuentaDinero : activeModal === 'APERTURA' ? mCuentaDinero : mObservaciones, // For transfers we hold the dest account
      formaPago: mFormaPago,
      observaciones: mObservaciones,

      // Inventory / Stock / Kardex fields
      catalogItemId: matchedCatalogItem ? matchedCatalogItem.id : undefined,
      cantidad: (activeModal === 'VENTA' || activeModal === 'COMPRA') ? mCantidad : undefined,
      precioUnitario: (activeModal === 'VENTA' || activeModal === 'COMPRA') ? parseFloat(mPrecioUnitario) : undefined
    };

    if (activeModal === 'TRANSFERENCIA') {
      newTx.cuentaOrigen = mCuentaDinero;
      newTx.cuentaDestino = mObservaciones || '1041';
    }

    setTransactions(prev => [newTx, ...prev]);
    const txPeriod = mFecha.slice(0, 7);
    setPeriod(txPeriod);

    // Close Modal and Reset states
    setActiveModal(null);
    setMGlosa('');
    setMRuc('');
    setMClienteProveedor('');
    setMCantidad(1);
    setMPrecioUnitario('1200');
    setSujetoDetraccion(false);
    setSujetoRetencion(false);
  };

  const handleRemoveTransaction = (id: string) => {
    if (currentUserRole === 'EMPLEADO') {
      alert('⚠️ ACCESO DENEGADO (Régimen MYPE)\n\nSu rol es EMPLEADO. No cuenta con permisos jerárquicos para eliminar registros del Diario o SIRE.\n\nPor favor, solicite a un GERENTE, ADMINISTRADOR o CONTADOR que realice esta acción para corregir el error.');
      return;
    }
    if (confirm('¿Está seguro de eliminar esta transacción de sus libros?')) {
      setTransactions(prev => prev.filter(tx => tx.id !== id));
    }
  };

  const handleExtornarTransaction = (id: string) => {
    if (currentUserRole === 'EMPLEADO') {
      alert('⚠️ ACCESO DENEGADO (Régimen MYPE)\n\nSu rol es EMPLEADO. El extorno/anulación de asientos requiere aprobación jerárquica de Gerente, Admin o Contador.');
      return;
    }

    const txToExtornar = transactions.find(t => t.id === id);
    if (!txToExtornar) return;

    if (txToExtornar.isExtornado && txToExtornar.documento.startsWith('EXT-')) {
      alert('Este asiento ya corresponde a un extorno regulatorio.');
      return;
    }

    if (confirm(`¿Desea generar el Contraasiento de Extorno (Anulación) para la operación ${txToExtornar.documento}?\n\nEsto creará un asiento de ajuste con el flujo saldo invertido para netear de forma transparente la operación sin borrar de forma tosca el historial contable, cumpliendo las directrices de la SUNAT.`)) {
      // 1. Mark original as extornado
      const updatedTxList = transactions.map(t => {
        if (t.id === id) {
          return { ...t, isExtornado: true, extornoRefId: 'ext_' + t.id };
        }
        return t;
      });

      // 2. Create the exact reversal transaction
      const extTx: Transaction = {
        ...txToExtornar,
        id: 'ext_' + txToExtornar.id,
        glosa: `[EXTORNO] Anulación de asiento: ${txToExtornar.documento} - ${txToExtornar.glosa}`,
        documento: `EXT-${txToExtornar.documento}`,
        isExtornado: true,
        extornoRefId: txToExtornar.id,
        creadoPor: currentUserRole
      };

      setTransactions([extTx, ...updatedTxList]);
      
      setChatMessages(prev => [
        ...prev,
        {
          id: 'extorno_confirm_' + Date.now(),
          role: 'assistant',
          content: `🔄 **¡Contraasiento de Extorno Generado con Éxito!**\n\nHe anulado la operación del comprobante **${txToExtornar.documento}** respetando las normas de control contable del PCGE.\n\n- Se ha generado un asiento espejo **${extTx.documento}** con la transferencia del saldo invertida (Débito ↔️ Crédito).\n- La suma neta de ambas transacciones en tu balance es ahora **S/. 0.00**, garantizando un registro contable auditable sin borrar de manera tosca la historia de los libros.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  };

  const handleResetData = () => {
    if (currentUserRole === 'EMPLEADO') {
      alert('⚠️ ACCESO DENEGADO\n\nSu rol es EMPLEADO. No cuenta con autorización para realizar el reinicio masivo de datos contables.');
      return;
    }
    if (confirm('¿Está seguro de reiniciar los movimientos predeterminados? Se perderán las facturas ingresadas.')) {
      setTransactions(INITIAL_TRANSACTIONS);
    }
  };

  const handleClearAllData = async () => {
    if (currentUserRole === 'EMPLEADO') {
      alert('⚠️ ACCESO DENEGADO\n\nSu rol es EMPLEADO. No cuenta con autorización para purgar la base de datos de transacciones de la empresa.');
      return;
    }
    if (confirm('¿Está seguro de limpiar absolutamente todos los datos de transacción de esta empresa?')) {
      try {
        if (isSupabaseConfigured && supabase && ruc && cloudSyncEnabled) {
          const { error } = await supabase
            .from('transacciones')
            .delete()
            .eq('ruc_empresa', ruc);
          if (error) throw error;
        }
        setTransactions([]);
        prevTransactionsRef.current = [];
      } catch (err: any) {
        alert('Error al eliminar datos de Supabase: ' + err.message);
      }
    }
  };

  // --- AI Consultation Chat Request ---
  const handleSendChat = async (questionText?: string) => {
    const textToSend = questionText || chatInput;
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: 'msg_' + Date.now(),
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);
    if (!questionText) setChatInput('');
    setIsChatLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: [...chatMessages, userMsg].map(m => ({
            role: m.role,
            content: m.content
          })),
          modoSencillo: modoSencillo
        })
      });

      if (!response.ok) {
        let serverErrorMsg = 'No se pudo establecer comunicación con el servidor central MYPE.';
        try {
          const errorData = await response.json();
          if (errorData && errorData.error) {
            serverErrorMsg = errorData.error;
          }
        } catch (e) {}
        throw new Error(serverErrorMsg);
      }

      const data = await response.json();
      const assistantMsg: ChatMessage = {
        id: 'msg_assist_' + Date.now(),
        role: 'assistant',
        content: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setChatMessages(prev => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error('Error enviando consulta contable:', err);
      const errMsg: ChatMessage = {
        id: 'error_' + Date.now(),
        role: 'assistant',
        content: `Error del Sistema: ${err.message || 'No se pudo contactar al especialista SUNAT.'}\n\nPor favor, verifica que tu **GEMINI_API_KEY** esté configurada correctamente en el panel de **Secrets** de AI Studio o en las variables de entorno.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, errMsg]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleDownloadReport = () => {
    // Basic CSV construction to download
    const headers = 'Fecha,Tipo,Documento,RUC,Monto Base,IGV,Total,Glosa\n';
    const rows = filteredTransactions.map(tx => 
      `"${tx.fecha}","${tx.tipo}","${tx.documento}","${tx.rucClienteProveedor}",${tx.montoBase.toFixed(2)},${tx.igv.toFixed(2)},${tx.total.toFixed(2)},"${tx.glosa}"`
    ).join('\n');
    
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `MYPE_Reporte_Tributario_${period}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportSIRE_RVIE = () => {
    const sales = transactions.filter(t => t.tipo === 'VENTA');
    if (sales.length === 0) {
      alert('No hay ventas registradas en este periodo para exportar al SIRE RVIE.');
      return;
    }

    const formattedPeriod = period.replace('-', '') + '00';
    let txtContent = '';

    sales.forEach((s, index) => {
      const parts = s.documento.split('-');
      const serie = parts[0] || 'F001';
      const numero = parts[1] || String(1000 + index);
      const docTipo = s.rucClienteProveedor.length === 11 ? '6' : '1';
      const rucCliente = s.rucClienteProveedor || '20100200300';
      const fechaFormateada = s.fecha.split('-').reverse().join('/'); // DD/MM/YYYY

      const line = [
        formattedPeriod, // 1. Periodo
        `CAR_V_${s.id}`, // 2. Código de anotación registrado (CAR)
        fechaFormateada, // 3. Fecha Emisión
        '', // 4. Fecha Vencimiento
        s.documento.startsWith('F') ? '01' : '03', // 5. Tipo Comprobante (01 Factura, 03 Boleta)
        serie, // 6. Serie
        numero, // 7. Número
        '', // 8. Número final (para boletas consolidadas)
        docTipo, // 9. Tipo de Doc (6 RUC, 1 DNI)
        rucCliente, // 10. Número de Doc
        s.glosa.substring(0, 30), // 11. Nombre o Razón Social
        s.montoBase.toFixed(2), // 12. Base Imponible
        s.igv.toFixed(2), // 13. IGV
        '0.00', // 14. Exonerado
        '0.00', // 15. Inafecto
        '0.00', // 16. ISC
        '0.00', // 17. Base Arroz Pilado
        '0.00', // 18. Impuesto Arroz Pilado
        '0.00', // 19. ICBPER
        '0.00', // 20. Otros Cargos
        s.total.toFixed(2), // 21. Total
        'PEN', // 22. Moneda
        '1.000', // 23. Tipo de Cambio
        '', // 24. Fecha Referencia (Modificación)
        '', // 25. Tipo Referencia
        '', // 26. Serie Referencia
        '', // 27. Número Referencia
        '1' // 28. Estado de indicador
      ].join('|') + '|';

      txtContent += line + '\n';
    });

    const blob = new Blob([txtContent], { type: 'text/plain;charset=utf-8' });
    const filename = `LE${ruc}${formattedPeriod}140400021112.txt`; // SUNAT SIRE standard filename for Ventas (RVIE)
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Add visual system notification to chat
    setChatMessages(prev => [
      ...prev,
      {
        id: 'sire_export_' + Date.now(),
        role: 'assistant',
        content: `📥 **¡Archivo SIRE RVIE Generado de forma exitosa!**\n\nHe compilado tus ventas en la estructura oficial regulada por la SUNAT.\n\n- **Nombre de Archivo:** \`${filename}\`\n- **Estructura:** Pipe-delimited (\\|)\n- **Campos:** Periodo, Código CAR, Razón Social, RUC, Base Imponible, IGV e Importe Total.\n\nEste archivo está listo para ser cargado en el portal oficial de SUNAT MYPE - SIRE para su validación previa.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const handleExportSIRE_RCE = () => {
    const purchases = transactions.filter(t => t.tipo === 'COMPRA');
    if (purchases.length === 0) {
      alert('No hay compras registradas en este periodo para exportar al SIRE RCE.');
      return;
    }

    const formattedPeriod = period.replace('-', '') + '00';
    let txtContent = '';

    purchases.forEach((s, index) => {
      const parts = s.documento.split('-');
      const serie = parts[0] || 'FT01';
      const numero = parts[1] || String(2000 + index);
      const docTipo = s.rucClienteProveedor.length === 11 ? '6' : '1';
      const rucProveedor = s.rucClienteProveedor || '20500600700';
      const fechaFormateada = s.fecha.split('-').reverse().join('/'); // DD/MM/YYYY

      const line = [
        formattedPeriod, // 1. Periodo
        `CAR_C_${s.id}`, // 2. CAR
        fechaFormateada, // 3. Fecha Emisión
        '', // 4. Fecha Vencimiento
        '01', // 5. Tipo Comprobante (01 Factura)
        serie, // 6. Serie
        '', // 7. Año de emisión de la DUA o DSI
        numero, // 8. Número de Comprobante
        '', // 9. Número final (para boletas)
        docTipo, // 10. Tipo de Doc de Identidad del Proveedor (6 RUC)
        rucProveedor, // 11. Número de Doc del Proveedor
        s.glosa.substring(0, 30), // 12. Razón Social o Nombre
        s.montoBase.toFixed(2), // 13. Base Imponible Gravada (Adquisiciones que otorgan Crédito Fiscal)
        s.igv.toFixed(2), // 14. IGV de adquisiciones gravadas
        '0.00', // 15. Base Imponible de adquisiciones mixtas
        '0.00', // 16. IGV mixto
        '0.00', // 17. Base imponible sin derecho a crédito
        '0.00', // 18. IGV sin derecho a crédito
        '0.00', // 19. Adquisiciones no gravadas (exoneradas)
        '0.00', // 20. ISC
        '0.00', // 21. ICBPER
        '0.00', // 22. Otros cargos / tributos
        s.total.toFixed(2), // 23. Importe Total
        'PEN', // 24. Moneda
        '1.000', // 25. Tipo de Cambio
        '', // 26. Fecha Referencia (Modificación)
        '', // 27. Tipo Referencia
        '', // 28. Serie Referencia
        '', // 29. Número Referencia
        '', // 30. Número de Detracción (si aplica)
        s.sujetoDetraccion ? s.fecha.split('-').reverse().join('/') : '', // 31. Fecha de Detracción
        '', // 32. Retención / Marcador
        '1' // 33. Estado del Comprobante
      ].join('|') + '|';

      txtContent += line + '\n';
    });

    const blob = new Blob([txtContent], { type: 'text/plain;charset=utf-8' });
    const filename = `LE${ruc}${formattedPeriod}080400021112.txt`; // SUNAT SIRE standard filename for Compras (RCE)
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Add visual system notification to chat
    setChatMessages(prev => [
      ...prev,
      {
        id: 'sire_rce_export_' + Date.now(),
        role: 'assistant',
        content: `📥 **¡Archivo SIRE RCE Generado de forma exitosa!**\n\nHe compilado tus compras y gastos en la estructura oficial regulada por la SUNAT.\n\n- **Nombre de Archivo:** \`${filename}\`\n- **Estructura:** Pipe-delimited (\\|)\n- **Detalles:** Adquisiciones gravadas con IGV de 18%, retenciones e indicadores de detracción correspondientes.\n\nEste archivo está listo para ser cargado en el portal de SUNAT MYPE - SIRE para su validación de crédito fiscal mensual.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  if (!isLoggedIn) {
    return (
      <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 pb-12 ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-[#F8FAFC] text-slate-900'}`}>
        <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 pt-12 gap-8 flex flex-col">
          {/* Top minimal header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-900 shadow-md">
                <KhipuRevLogo className="w-10 h-10" />
              </div>
              <div>
                <h1 className={`text-xl font-extrabold tracking-tight font-heading ${darkMode ? 'text-white' : 'text-slate-900'}`}>Kipurev</h1>
                <p className={`text-xs font-medium font-sans ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Acceso Seguro Clave SOL SUNAT</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Theme Toggle Button directly on login landing */}
              <button 
                type="button"
                onClick={() => setDarkMode(prev => !prev)}
                className={`p-2 rounded-xl border cursor-pointer transition-all ${
                  darkMode ? 'bg-slate-900 border-slate-800 text-yellow-400 hover:bg-slate-800' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                }`}
                title="Cambiar Tema"
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
              <div className={`text-[11px] font-bold font-mono px-3 py-1 rounded-full border ${
                darkMode ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-400'
              }`}>
                AÑO FISCAL 2026
              </div>
            </div>
          </div>

          {/* Bento grid layout for Login */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
            
            {/* LEFT BOX: Legal Details & Features / Guide */}
            <div className={`md:col-span-7 rounded-3xl p-8 border shadow-sm flex flex-col justify-between gap-6 transition-colors duration-300 ${
              darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-300'
            }`}>
              <div>
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest block mb-2">Sistema Tributario Oficial para MYPEs</span>
                <h2 className={`text-3xl font-bold tracking-tight font-heading leading-tight mb-4 ${
                  darkMode ? 'text-white' : 'text-slate-950'
                }`}>
                  Controla la tributación de tu negocio en el <span className="text-emerald-600">Régimen MYPE</span>
                </h2>
                <p className={`text-sm leading-relaxed mb-6 ${
                  darkMode ? 'text-slate-300' : 'text-slate-650 font-medium'
                }`}>
                  Nuestra plataforma te permite liquidar tu impuesto mensual, verificar cronogramas de vencimiento automatizados según tu número de RUC, generar asientos en doble partida compatibles con el PCGE y consultar a nuestro especialista con Inteligencia Artificial.
                </p>

                <div className="space-y-4">
                  <div className="flex gap-3 items-start">
                    <div className="bg-emerald-50 text-emerald-700 w-8 h-8 rounded-lg flex items-center justify-center shrink-0 font-bold text-sm">
                      📊
                    </div>
                    <div>
                      <h4 className={`text-sm font-bold ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>Liquidación en 1-Clic</h4>
                      <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Separamos la base imponible del IGV al 18% permitiendo el beneficio de IGV Justo de forma automatizada.</p>
                    </div>
                  </div>

                  <div className="flex gap-3 items-start">
                    <div className="bg-indigo-50 text-indigo-700 w-8 h-8 rounded-lg flex items-center justify-center shrink-0 font-bold text-sm">
                      🔒
                    </div>
                    <div>
                      <h4 className={`text-sm font-bold ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>Seguridad de Datos</h4>
                      <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Tus credenciales y datos contables se guardan de manera local y privada en tu navegador.</p>
                    </div>
                  </div>

                  <div className="flex gap-3 items-start">
                    <div className="bg-amber-50 text-amber-700 w-8 h-8 rounded-lg flex items-center justify-center shrink-0 font-bold text-sm">
                      👥
                    </div>
                    <div>
                      <h4 className={`text-sm font-bold ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>Multiusuario y Roles</h4>
                      <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Crea perfiles con roles personalizados: Gerente, Administrador, Contador o Empleado con accesos restrictivos.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className={`pt-6 border-t flex justify-between items-center text-[10px] font-mono ${
                darkMode ? 'border-slate-800 text-slate-500' : 'border-slate-300 text-slate-550 font-bold'
              }`}>
                <span>RÉGIMEN MYPE TRIBUTARIO (RMT)</span>
                <span>UIT 2026: S/. 5,500</span>
              </div>
            </div>

            {/* RIGHT BOX: Credential fields form / Registration toggle */}
            <div className={`md:col-span-5 rounded-3xl p-8 border-2 shadow-md flex flex-col justify-between transition-colors duration-300 ${
              darkMode 
                ? 'bg-slate-900 border-indigo-500/80 shadow-indigo-950/20' 
                : 'bg-white border-indigo-600/85 shadow-indigo-100/40'
            }`}>
              <div className="w-full">
                
                {/* Mode Selector Tabs */}
                <div className={`grid grid-cols-2 gap-2 mb-6 p-1 rounded-2xl ${
                  darkMode ? 'bg-slate-950' : 'bg-slate-100'
                }`}>
                  <button
                    type="button"
                    onClick={() => {
                      setLoginMode('login');
                      setLoginError('');
                      setRegError('');
                      setRegSuccess('');
                    }}
                    className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                      loginMode === 'login'
                        ? darkMode ? 'bg-slate-800 text-white shadow-xs' : 'bg-white text-slate-900 shadow-sm'
                        : darkMode ? 'text-slate-500 hover:text-slate-300' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Iniciar Sesión
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLoginMode('registro');
                      setLoginError('');
                      setRegError('');
                      setRegSuccess('');
                    }}
                    className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                      loginMode === 'registro'
                        ? darkMode ? 'bg-slate-800 text-white shadow-xs' : 'bg-white text-slate-900 shadow-sm'
                        : darkMode ? 'text-slate-500 hover:text-slate-300' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Registrar Gerente
                  </button>
                </div>

                {loginMode === 'login' ? (
                  <div>
                    <div className="mb-4">
                      <span className={`text-[10px] font-black tracking-widest px-2.5 py-1 rounded-full border uppercase ${
                        darkMode ? 'bg-indigo-950/40 border-indigo-900/60 text-indigo-400' : 'bg-indigo-50 border-indigo-100 text-indigo-700'
                      }`}>
                        ACCESO PRIVADO MYPE
                      </span>
                      <h3 className={`text-lg font-bold mt-2 font-heading ${darkMode ? 'text-white' : 'text-slate-900'}`}>Ingreso del Personal</h3>
                      <p className={`text-xs mt-0.5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Ingresa tus credenciales autorizadas por el Gerente.</p>
                    </div>

                    {/* Access Type Sub-tabs */}
                    <div className={`grid grid-cols-2 gap-1.5 mb-5 p-1 rounded-xl border ${
                      darkMode ? 'bg-slate-950 border-slate-800' : 'bg-indigo-50/50 border-indigo-100/50'
                    }`}>
                      <button
                        type="button"
                        onClick={() => {
                          setLoginType('gerente');
                          setLoginError('');
                        }}
                        className={`py-1.5 text-[11px] font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1 ${
                          loginType === 'gerente'
                            ? 'bg-indigo-600 text-white shadow-xs font-black'
                            : darkMode ? 'text-indigo-400 hover:bg-slate-800' : 'text-indigo-600 hover:bg-indigo-50/80 font-semibold'
                        }`}
                      >
                        💼 Gerente
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setLoginType('colaborador');
                          setLoginError('');
                        }}
                        className={`py-1.5 text-[11px] font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1 ${
                          loginType === 'colaborador'
                            ? 'bg-indigo-600 text-white shadow-xs font-black'
                            : darkMode ? 'text-indigo-400 hover:bg-slate-800' : 'text-indigo-600 hover:bg-indigo-50/80 font-semibold'
                        }`}
                      >
                        👥 Colaborador
                      </button>
                    </div>

                    {loginError && (
                      <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-700 rounded-2xl text-xs flex gap-2 items-start">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <div>{loginError}</div>
                      </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-4">
                      {loginType === 'gerente' && (
                        <div>
                          <label className={`text-[11px] font-bold uppercase block mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>RUC de la Empresa (11 dígitos)</label>
                          <div className="relative">
                            <input 
                              type="text"
                              placeholder="Ej. 20601234567"
                              maxLength={11}
                              value={loginRuc}
                              onChange={(e) => setLoginRuc(e.target.value.replace(/\D/g, ''))}
                              className={`w-full border focus:ring-2 rounded-xl py-2 px-3 pl-9 text-xs font-mono font-bold focus:outline-none ${
                                darkMode 
                                  ? 'bg-slate-950 border-slate-800 focus:border-indigo-500 focus:ring-indigo-500/10 text-white' 
                                  : 'bg-slate-50 border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/10 text-slate-900'
                              }`}
                              required
                            />
                            <Building className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                          </div>
                        </div>
                      )}

                      <div>
                        <label className={`text-[11px] font-bold uppercase block mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Usuario</label>
                        <div className="relative">
                          <input 
                            type="text"
                            placeholder={loginType === 'gerente' ? 'e.g. GERENTE_MYPE' : 'e.g. ADMIN_MYPE'}
                            value={loginUser}
                            onChange={(e) => setLoginUser(e.target.value)}
                            className={`w-full border focus:ring-2 rounded-xl py-2 px-3 pl-9 text-xs font-mono font-bold focus:outline-none ${
                              darkMode 
                                ? 'bg-slate-950 border-slate-800 focus:border-indigo-500 focus:ring-indigo-500/10 text-white' 
                                : 'bg-slate-50 border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/10 text-slate-900'
                            }`}
                            required
                          />
                          <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        </div>
                      </div>

                      <div>
                        <label className={`text-[11px] font-bold uppercase block mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Contraseña</label>
                        <div className="relative">
                          <input 
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            className={`w-full border focus:ring-2 rounded-xl py-2 px-3 pl-9 text-xs font-mono focus:outline-none ${
                              darkMode 
                                ? 'bg-slate-950 border-slate-800 focus:border-indigo-500 focus:ring-indigo-500/10 text-white' 
                                : 'bg-slate-50 border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/10 text-slate-900'
                            }`}
                            required
                          />
                          <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                          <button 
                            type="button" 
                            onClick={() => setShowPassword(!showPassword)} 
                            className="text-[10px] text-indigo-600 font-bold hover:underline absolute right-3 top-2.5 focus:outline-none"
                          >
                            {showPassword ? 'Ocultar' : 'Ver'}
                          </button>
                        </div>
                      </div>

                      <button 
                        type="submit"
                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-2xl shadow-lg shadow-indigo-250 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
                      >
                        <span>Conectar al Sistema</span>
                        <Unlock className="w-3.5 h-3.5" />
                      </button>
                    </form>

                    <div className={`mt-4 p-3 border rounded-2xl text-[11px] ${
                      darkMode ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-550 font-medium'
                    }`}>
                      ℹ️ <strong>¿No tienes cuenta?</strong> Puedes registrar tu empresa y obtener un RUC con rol de <strong>Gerente</strong> haciendo clic en la pestaña superior.
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="mb-4">
                      <span className={`text-[10px] font-black tracking-widest px-2.5 py-1 rounded-full border uppercase ${
                        darkMode ? 'bg-emerald-950/40 border-emerald-900/60 text-emerald-400' : 'bg-emerald-50 border-emerald-100 text-emerald-700'
                      }`}>
                        NUEVO REGISTRO MYPE
                      </span>
                      <h3 className={`text-lg font-bold mt-2 font-heading ${darkMode ? 'text-white' : 'text-slate-900'}`}>Alta de Empresa</h3>
                      <p className={`text-xs mt-0.5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Inicializa tu base contable privada en el Régimen MYPE.</p>
                    </div>

                    {regError && (
                      <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-700 rounded-2xl text-xs flex gap-2 items-start animate-fadeIn">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <div>{regError}</div>
                      </div>
                    )}

                    {regSuccess && (
                      <div className="mb-4 p-3 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-2xl text-xs flex gap-2 items-start animate-fadeIn">
                        <span className="text-base">✅</span>
                        <div>{regSuccess}</div>
                      </div>
                    )}

                    <form onSubmit={handleRegister} className="space-y-3.5">
                      <div>
                        <label className={`text-[11px] font-bold uppercase block mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>RUC de la Empresa (11 dígitos)</label>
                        <div className="relative">
                          <input 
                            type="text"
                            placeholder="Ej. 20601122334"
                            maxLength={11}
                            value={regRuc}
                            onChange={(e) => setRegRuc(e.target.value.replace(/\D/g, ''))}
                            className={`w-full border focus:ring-2 rounded-xl py-2 px-3 pl-9 text-xs font-mono font-bold focus:outline-none ${
                              darkMode 
                                ? 'bg-slate-950 border-slate-800 focus:border-indigo-500 focus:ring-indigo-500/10 text-white' 
                                : 'bg-slate-50 border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/10 text-slate-900'
                            }`}
                            required
                          />
                          <Building className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        </div>
                      </div>

                      <div>
                        <label className={`text-[11px] font-bold uppercase block mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Razón Social</label>
                        <div className="relative">
                          <input 
                            type="text"
                            placeholder="Ej. Mi Negocio Contable S.A.C."
                            value={regRazonSocial}
                            onChange={(e) => setRegRazonSocial(e.target.value)}
                            className={`w-full border focus:ring-2 rounded-xl py-2 px-3 pl-9 text-xs font-bold focus:outline-none ${
                              darkMode 
                                ? 'bg-slate-950 border-slate-800 focus:border-indigo-500 focus:ring-indigo-500/10 text-white' 
                                : 'bg-slate-50 border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/10 text-slate-900'
                            }`}
                            required
                          />
                          <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        </div>
                      </div>

                      <div>
                        <label className={`text-[11px] font-bold uppercase block mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Nombre del Gerente</label>
                        <div className="relative">
                          <input 
                            type="text"
                            placeholder="Ej. Juan Pérez"
                            value={regNombreGerente}
                            onChange={(e) => setRegNombreGerente(e.target.value)}
                            className={`w-full border focus:ring-2 rounded-xl py-2 px-3 pl-9 text-xs font-bold focus:outline-none ${
                              darkMode 
                                ? 'bg-slate-950 border-slate-800 focus:border-indigo-500 focus:ring-indigo-500/10 text-white' 
                                : 'bg-slate-50 border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/10 text-slate-900'
                            }`}
                            required
                          />
                          <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        </div>
                      </div>

                      <div>
                        <label className={`text-[11px] font-bold uppercase block mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Usuario de Acceso</label>
                        <div className="relative">
                          <input 
                            type="text"
                            placeholder="Ej. GERENTE_SOL"
                            value={regUsuarioSol}
                            onChange={(e) => setRegUsuarioSol(e.target.value)}
                            className={`w-full border focus:ring-2 rounded-xl py-2 px-3 pl-9 text-xs font-mono font-bold focus:outline-none ${
                              darkMode 
                                ? 'bg-slate-950 border-slate-800 focus:border-indigo-500 focus:ring-indigo-500/10 text-white' 
                                : 'bg-slate-50 border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/10 text-slate-900'
                            }`}
                            required
                          />
                          <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        </div>
                      </div>

                      <div>
                        <label className={`text-[11px] font-bold uppercase block mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Contraseña de Acceso</label>
                        <div className="relative">
                          <input 
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Mínimo 4 caracteres"
                            value={regClaveSol}
                            onChange={(e) => setRegClaveSol(e.target.value)}
                            className={`w-full border focus:ring-2 rounded-xl py-2 px-3 pl-9 text-xs font-mono font-bold focus:outline-none ${
                              darkMode 
                                ? 'bg-slate-950 border-slate-800 focus:border-indigo-500 focus:ring-indigo-500/10 text-white' 
                                : 'bg-slate-50 border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/10 text-slate-900'
                            }`}
                            required
                          />
                          <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        </div>
                      </div>

                      <button 
                        type="submit"
                        className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-2xl shadow-lg shadow-emerald-250 transition-all flex items-center justify-center gap-2 cursor-pointer mt-3"
                      >
                        <span>Registrar e Inicializar MYPE</span>
                        <Check className="w-4 h-4" />
                      </button>
                    </form>
                  </div>
                )}

              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // Theme styling helpers based on darkMode with optimized WCAG contrast
  const cardBg = darkMode ? 'bg-slate-900 border-slate-800 text-white shadow-md' : 'bg-white border-slate-300 text-slate-900 shadow-sm';
  const labelColor = darkMode ? 'text-slate-200' : 'text-slate-900 font-bold';
  const subtitleColor = darkMode ? 'text-slate-400' : 'text-slate-650';
  const mainTitleColor = darkMode ? 'text-white' : 'text-slate-950 font-black';
  const tabBg = darkMode ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-100/80 border-slate-300';
  const inputBg = darkMode ? 'bg-slate-800 border-slate-700 text-white focus:border-blue-500 focus:ring-blue-500' : 'bg-white border-slate-400 text-slate-950 placeholder-slate-500 focus:border-indigo-600 focus:ring-indigo-600/10';
  const btnSec = darkMode ? 'bg-slate-800 hover:bg-slate-750 border-slate-700 text-white' : 'bg-white hover:bg-slate-100 border-slate-400 text-slate-900 font-bold';
  const tableHeaderBg = darkMode ? 'bg-slate-950 text-slate-300 border-slate-800' : 'bg-slate-200 text-slate-900 border-slate-300 font-bold';
  const tableBorder = darkMode ? 'border-slate-800' : 'border-slate-300';
  const hoverRowBg = darkMode ? 'hover:bg-slate-800/50' : 'hover:bg-slate-100/70';

  return (
    <div className={`min-h-screen flex font-sans transition-colors duration-300 ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-700'}`}>
      
      {/* Backdrop overlay for mobile */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* SIDEBAR IZQUIERDO RESPONSIVO */}
      <div className={`fixed inset-y-0 left-0 z-45 md:sticky md:z-auto w-[240px] h-screen bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between p-4 shrink-0 shadow-xs transition-transform duration-300 md:translate-x-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        {/* TOP BLOCK */}
        <div className="space-y-4">
          {/* Logo en texto plano y botón cerrar en móvil */}
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-black text-lg tracking-tight text-slate-900 dark:text-white">Kipurev</span>
                <span className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-[8px] font-bold px-1.5 py-0.5 rounded border border-emerald-100 dark:border-emerald-900/40 uppercase">RMT</span>
              </div>
              {/* RUC de la empresa */}
              <div className="text-[10px] font-mono text-slate-400 dark:text-slate-500 mt-1 font-bold">RUC: {companyConfig.ruc}</div>
            </div>
            {/* Close button for mobile sidebar */}
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none cursor-pointer"
              title="Cerrar menú"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Rol actual de acceso */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-1">ROL ACTUAL</span>
            <span className={`inline-flex w-full justify-center items-center gap-1 px-2.5 py-1 rounded-xl text-[9.5px] font-bold tracking-wider uppercase border ${
              currentUserRole === 'EMPLEADO'
                ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/60 text-amber-700 dark:text-amber-400'
                : currentUserRole === 'GERENTE'
                ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-900/60 text-indigo-700 dark:text-indigo-400'
                : currentUserRole === 'ADMINISTRADOR'
                ? 'bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-900/60 text-sky-700 dark:text-sky-400'
                : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/60 text-emerald-700 dark:text-emerald-400'
            }`}>
              {currentUserRole === 'EMPLEADO' && '💼 Empleado'}
              {currentUserRole === 'GERENTE' && '👔 Gerente'}
              {currentUserRole === 'ADMINISTRADOR' && '🔧 Admin'}
              {currentUserRole === 'CONTADOR' && '🧮 Contador'}
            </span>
          </div>

          {/* Modo de Interfaz Switcher */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-1">MODO DE INTERFAZ</span>
            <button
              onClick={() => setModoSencillo(prev => !prev)}
              className={`w-full flex items-center justify-between gap-1.5 px-2.5 py-1.5 rounded-xl text-[9.5px] font-black tracking-wider uppercase border transition-all cursor-pointer ${
                modoSencillo
                  ? 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/60 text-amber-700 dark:text-amber-400 hover:bg-amber-100/40'
                  : 'bg-indigo-50/60 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-900/60 text-indigo-700 dark:text-indigo-450 hover:bg-indigo-100/40'
              }`}
              title="Alternar entre Modo Sencillo y Modo Factura / Tributario"
            >
              <span>{modoSencillo ? "📁 Modo Sencillo" : "🧾 Modo Factura / Trib."}</span>
              <span className="text-[8px] bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-1.5 py-0.2 rounded font-black font-sans">
                Cambiar
              </span>
            </button>
          </div>

          {/* Menú de navegación vertical */}
          <nav className="space-y-1 pt-3 border-t border-slate-100 dark:border-slate-800">
            <span className="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-1.5 px-1">NAVEGACIÓN</span>
            
            <button
              onClick={() => {
                setActiveTab('Inicio');
                setModuloActivo('menu');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                activeTab === 'Inicio'
                  ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-100/10'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              <span>🏠</span>
              <span>Inicio</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('SIRE');
                setModuloActivo('libros');
                setSelectedDiarioTab('ventas');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                activeTab === 'SIRE'
                  ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-100/10'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              <span>📖</span>
              <span>SIRE</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('Impuestos');
                setModuloActivo('impuestos');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                activeTab === 'Impuestos'
                  ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-100/10'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              <span>⚖️</span>
              <span>Impuestos</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('Simulador');
                setModuloActivo('simulador');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                activeTab === 'Simulador'
                  ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-100/10'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              <span>💡</span>
              <span>Planificador Financiero</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('Configuracion');
                setModuloActivo('configuracion');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                activeTab === 'Configuracion'
                  ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-100/10'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              <span>⚙️</span>
              <span>Configuración</span>
            </button>
          </nav>
        </div>

        {/* BOTTOM BLOCK: CERRAR SESIÓN */}
        <div className="space-y-3">
          {/* Toggles embedded compactly */}
          <div className="space-y-2 border-b border-slate-100 dark:border-slate-800/40 pb-2.5">
            {isSupabaseConfigured ? (
              <div className="flex items-center justify-between px-1 text-[10px] text-slate-400">
                <span className="flex items-center gap-1.5" title={cloudSyncEnabled ? "Sincronizando transacciones con Supabase" : "Transacciones guardadas localmente y seguras"}>
                  <span className={`w-1.5 h-1.5 rounded-full ${cloudSyncEnabled ? 'bg-indigo-500 animate-pulse' : 'bg-slate-400'}`} />
                  Sincronización Nube
                </span>
                <button 
                  onClick={() => {
                    const nextVal = !cloudSyncEnabled;
                    setCloudSyncEnabled(nextVal);
                    if (!nextVal) {
                      setMonitoreoEnVivo(false);
                    }
                  }}
                  className={`relative inline-flex h-4 w-8 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
                    cloudSyncEnabled ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-800'
                  }`}
                  title="Activar/Desactivar Sincronización en Tiempo Real con Supabase"
                >
                  <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition duration-200 ${cloudSyncEnabled ? 'translate-x-4' : 'translate-x-0'}`} />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between px-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                <span>🛡️ Local / Offline Seguro</span>
                <span className="text-[9px] bg-emerald-100 dark:bg-emerald-950/40 px-1 rounded">Activo</span>
              </div>
            )}

            {isSupabaseConfigured && cloudSyncEnabled && (
              <div className="flex items-center justify-between px-1 text-[10px] text-slate-400">
                <span className="flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${monitoreoEnVivo ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                  Monitoreo en Vivo
                </span>
                <button 
                  onClick={() => setMonitoreoEnVivo(prev => !prev)}
                  className={`relative inline-flex h-4 w-8 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
                    monitoreoEnVivo ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-800'
                  }`}
                  title="Alternar Monitoreo de Colaboradores en Tiempo Real"
                >
                  <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition duration-200 ${monitoreoEnVivo ? 'translate-x-4' : 'translate-x-0'}`} />
                </button>
              </div>
            )}

            <div className="flex items-center justify-between px-1 text-[10px] text-slate-400">
              <span>Modo Oscuro</span>
              <button 
                onClick={() => setDarkMode(prev => !prev)}
                className={`relative inline-flex h-4 w-8 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
                  darkMode ? 'bg-indigo-600' : 'bg-slate-200'
                }`}
                title="Alternar Modo Oscuro"
              >
                <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition duration-200 ${darkMode ? 'translate-x-4' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>

          <button 
            onClick={() => {
              handleLogout();
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/25 transition-all flex items-center gap-2 cursor-pointer border border-transparent hover:border-red-150/10"
            title="Cerrar Sesión SOL"
          >
            <span>🚪</span>
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>

      {/* ÁREA PRINCIPAL (DERECHA, scroll independiente) */}
      <div className="flex-1 h-screen overflow-y-auto p-6 space-y-6">

        {/* TOP HEADER COMPONENT */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-5 border-b border-slate-200/60 dark:border-slate-800/80 gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Hamburger button for mobile */}
            <button
              onClick={() => setMobileMenuOpen(prev => !prev)}
              className="md:hidden p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 shrink-0"
              title="Abrir menú"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <h2 className="font-heading font-black text-lg text-slate-900 dark:text-white uppercase tracking-tight">
                {activeTab === 'Inicio' && 'Dashboard Principal'}
                {activeTab === 'SIRE' && 'Libros Electrónicos SIRE'}
                {activeTab === 'Impuestos' && 'Cálculo de Impuestos MYPE'}
                {activeTab === 'Simulador' && 'Planificación y Solvencia Financiera'}
                {activeTab === 'Configuracion' && 'Configuración de Empresa & Empleados'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {companyConfig.razonSocial} • RUC {companyConfig.ruc}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Period selector */}
            <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-3 py-1.5 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-sans">Periodo SOL:</span>
              <select 
                value={period} 
                onChange={(e) => setPeriod(e.target.value)}
                className="bg-transparent text-xs font-black text-indigo-650 dark:text-indigo-400 focus:outline-none cursor-pointer"
              >
                {dynamicMonthsList.map(m => (
                  <option key={m.value} value={m.value} className="dark:bg-slate-900">{m.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* RIGHT MAIN WORKSPACE */}
        <div className="space-y-6">

          {/* HUB DE MÓDULOS (VISTA MENÚ PRINCIPAL) */}
          {moduloActivo === 'menu' ? (
            <div className="space-y-6 animate-fadeIn">
              {/* USER-FRIENDLY WELCOME BANNER */}
              <div className={`transition-colors duration-300 rounded-3xl p-6 border shadow-xs space-y-5 ${cardBg}`}>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-200 text-[9px] font-black tracking-wider uppercase px-2.5 py-0.5 rounded-full border border-indigo-200/40">
                        🏢 {companyConfig.razonSocial}
                      </span>
                      <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[9px] font-mono font-black tracking-wider uppercase px-2.5 py-0.5 rounded-full border border-slate-200/40">
                        RUC: {companyConfig.ruc}
                      </span>
                    </div>
                    <h2 className={`text-xl font-bold tracking-tight font-heading flex items-center gap-2 ${mainTitleColor}`}>
                      <span>👋 ¡Hola! Bienvenido a Kipurev MYPE</span>
                    </h2>
                    <p className={`text-xs max-w-2xl mt-1 leading-relaxed ${subtitleColor}`}>
                      {modoSencillo 
                        ? "Hemos simplificado todos los términos contables difíciles de la SUNAT a ejemplos cotidianos de tu negocio. ¡Elige un módulo para comenzar a gestionar tus cuentas!" 
                        : "Panel de autogestión contable y tributario para el Régimen MYPE y Especial. Selecciona un módulo para gestionar transacciones, impuestos y análisis financieros."}
                    </p>
                  </div>
                </div>
              </div>

              {/* 4 CARDS NAVIGATION HUB */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* TARJETA 1: Calendario & Alertas */}
                <button
                  type="button"
                  onClick={() => setModuloActivo('cronograma')}
                  className={`group relative text-left p-6 rounded-3xl border transition-all duration-300 cursor-pointer ${cardBg} hover:border-emerald-500/50 hover:shadow-lg hover:scale-[1.01]`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/50 flex items-center justify-center text-2xl shadow-xs">
                      📅
                    </div>
                    <span className="text-[10px] font-black tracking-wider bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 uppercase px-2.5 py-1 rounded-full border border-emerald-100 dark:border-emerald-900/40">
                      Módulo 1
                    </span>
                  </div>
                  <h3 className={`font-black text-sm tracking-tight font-heading mb-1.5 ${mainTitleColor}`}>
                    Calendario & Alertas
                  </h3>
                  <p className={`text-xs leading-relaxed ${subtitleColor}`}>
                    Sincronización del vencimiento mensual de la SUNAT, alertas de plazos tributarios y estado de tu RUC para evitar contingencias.
                  </p>
                  <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 font-mono uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Último dígito RUC: {rucLastDigit}
                  </div>
                </button>

                {/* TARJETA 2: Libros Electrónicos (SIRE) */}
                <button
                  type="button"
                  onClick={() => {
                    setModuloActivo('libros');
                    setSelectedDiarioTab('ventas');
                  }}
                  className={`group relative text-left p-6 rounded-3xl border transition-all duration-300 cursor-pointer ${cardBg} hover:border-indigo-500/50 hover:shadow-lg hover:scale-[1.01]`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950/50 flex items-center justify-center text-2xl shadow-xs">
                      📖
                    </div>
                    <span className="text-[10px] font-black tracking-wider bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 uppercase px-2.5 py-1 rounded-full border border-indigo-100 dark:border-indigo-900/40">
                      Módulo 2
                    </span>
                  </div>
                  <h3 className={`font-black text-sm tracking-tight font-heading mb-1.5 ${mainTitleColor}`}>
                    Libros Electrónicos (SIRE)
                  </h3>
                  <p className={`text-xs leading-relaxed ${subtitleColor}`}>
                    Registro interactivo de Ventas y Compras, emisión de asientos del Libro Diario, Mayor y reportes estructurados para exportación oficial.
                  </p>
                  <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 font-mono uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
                    {transactions.length} Asientos Registrados
                  </div>
                </button>

                {/* TARJETA 3: Impuestos & Planeamiento */}
                <button
                  type="button"
                  onClick={() => setModuloActivo('impuestos')}
                  className={`group relative text-left p-6 rounded-3xl border transition-all duration-300 cursor-pointer ${cardBg} hover:border-rose-500/50 hover:shadow-lg hover:scale-[1.01]`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/50 flex items-center justify-center text-2xl shadow-xs">
                      ⚖️
                    </div>
                    <span className="text-[10px] font-black tracking-wider bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 uppercase px-2.5 py-1 rounded-full border border-rose-100 dark:border-rose-900/40">
                      Módulo 3
                    </span>
                  </div>
                  <h3 className={`font-black text-sm tracking-tight font-heading mb-1.5 ${mainTitleColor}`}>
                    Impuestos & Planeamiento
                  </h3>
                  <p className={`text-xs leading-relaxed ${subtitleColor}`}>
                    Cálculo mensual automatizado de IGV y Renta Régimen Especial / MYPE, y planeamiento tributario anual con escala progresiva acumulativa.
                  </p>
                  <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 text-[10px] font-bold text-rose-600 dark:text-rose-400 font-mono uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                    IGV Justo Prorrogable Activo
                  </div>
                </button>

                {/* TARJETA 4: Planificador Financiero */}
                <button
                  type="button"
                  onClick={() => setModuloActivo('simulador')}
                  className={`group relative text-left p-6 rounded-3xl border transition-all duration-300 cursor-pointer ${cardBg} hover:border-purple-500/50 hover:shadow-lg hover:scale-[1.01]`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950/50 flex items-center justify-center text-2xl shadow-xs">
                      💡
                    </div>
                    <span className="text-[10px] font-black tracking-wider bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 uppercase px-2.5 py-1 rounded-full border border-purple-100 dark:border-purple-900/40">
                      Módulo 4
                    </span>
                  </div>
                  <h3 className={`font-black text-sm tracking-tight font-heading mb-1.5 ${mainTitleColor}`}>
                    Planificador Financiero
                  </h3>
                  <p className={`text-xs leading-relaxed ${subtitleColor}`}>
                    Toma decisiones de negocio y observa su impacto financiero en tiempo real sobre tu balance de situación y semáforo de solvencia.
                  </p>
                  <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 text-[10px] font-bold text-purple-600 dark:text-purple-400 font-mono uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse"></span>
                    PCGE Consulta Integrada
                  </div>
                </button>

                {/* TARJETA 5: Configuración Empresa & Empleados */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('Configuracion');
                    setModuloActivo('configuracion');
                  }}
                  className={`group relative text-left p-6 rounded-3xl border transition-all duration-300 cursor-pointer ${cardBg} hover:border-slate-400 hover:shadow-lg hover:scale-[1.01] md:col-span-2 lg:col-span-1`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-2xl shadow-xs">
                      ⚙️
                    </div>
                    <span className="text-[10px] font-black tracking-wider bg-slate-50 dark:bg-slate-850 text-slate-700 dark:text-slate-300 uppercase px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-700">
                      Módulo 5
                    </span>
                  </div>
                  <h3 className={`font-black text-sm tracking-tight font-heading mb-1.5 ${mainTitleColor}`}>
                    Configuración de Empresa & Empleados
                  </h3>
                  <p className={`text-xs leading-relaxed ${subtitleColor}`}>
                    Personalice la razón social, RUC, régimen tributario, dirección legal, logotipo de comprobantes, y administre los usuarios y empleados con acceso SOL autorizados.
                  </p>
                  <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 text-[10px] font-bold text-slate-600 dark:text-slate-400 font-mono uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                    Gestionar Nombre, RUC y Equipo
                  </div>
                </button>
              </div>
            </div>
          ) : (
            /* SUB-VIEW HEADER CON BOTÓN VOLVER */
            <div className="flex items-center justify-between p-4.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800 rounded-3xl animate-fadeIn">
              <button
                type="button"
                onClick={() => setModuloActivo('menu')}
                className="flex items-center gap-2 px-4 py-2.5 text-xs font-black uppercase tracking-wider bg-white hover:bg-slate-150 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-2xl transition-all cursor-pointer border border-slate-200/60 dark:border-slate-700 hover:scale-[1.01]"
              >
                ⬅️ Volver al Menú Principal
              </button>
              <div className="text-right">
                <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 block uppercase tracking-wider">MÓDULO DE TRABAJO</span>
                <span className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest font-heading">
                  {moduloActivo === 'cronograma' && '📅 Calendario & Alertas'}
                  {moduloActivo === 'libros' && '📖 Libros Electrónicos (SIRE)'}
                  {moduloActivo === 'impuestos' && '⚖️ Impuestos & Planeamiento'}
                  {moduloActivo === 'simulador' && '💡 Planificador Financiero'}
                  {moduloActivo === 'configuracion' && '⚙️ Configuración Empresa'}
                </span>
              </div>
            </div>
          )}

          {/* REGIMEN LIMIT WARNING */}
          {(() => {
            const totalSalesCumulative = transactions
              .filter(t => t.tipo === 'VENTA' && !t.isExtornado)
              .reduce((sum, t) => sum + t.montoBase, 0);

            if (regimen === 'RER' && totalSalesCumulative > 525000) {
              return (
                <div className="bg-amber-50 border border-amber-300 text-amber-950 p-4.5 rounded-3xl flex items-start gap-4 shadow-xs animate-pulse">
                  <AlertCircle className="w-5 h-5 text-amber-650 shrink-0 mt-0.5" />
                  <div className="text-xs space-y-1">
                    <span className="font-extrabold text-amber-900 block uppercase tracking-wide">⚠️ ALERTA SUNAT: Exceso de Límite Régimen Especial (RER)</span>
                    <p>Tus ventas netas acumuladas registradas (**S/. {totalSalesCumulative.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}**) superan el tope anual permitido para el Régimen Especial (RER) de <span className="font-bold">S/. 525,000.00</span>.</p>
                    <p className="text-[11px] text-amber-850">La SUNAT exige que migres de inmediato al **Régimen MYPE Tributario (RMT)** o al Régimen General a partir del periodo actual, regularizando tus declaraciones.</p>
                  </div>
                </div>
              );
            }
            return null;
          })()}

          {/* SUPABASE CONNECTION & TABLE CREATION STATUS */}
          {isSupabaseConfigured && supabaseError && (
            <div className="bg-blue-50/95 dark:bg-slate-900 border border-blue-200 dark:border-blue-900 text-slate-800 dark:text-slate-200 p-5 rounded-3xl flex flex-col md:flex-row items-start gap-4 shadow-sm animate-fadeIn">
              <div className="p-2 bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-2xl shrink-0 mt-0.5">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div className="text-xs space-y-2 flex-1">
                <span className="font-extrabold text-blue-900 dark:text-blue-400 block uppercase tracking-wider text-[11px]">☁️ Conexión Supabase Activa - Requiere Script SQL</span>
                <p className="leading-relaxed font-sans text-slate-650 dark:text-slate-300">
                  Hemos conectado la aplicación a tu cuenta de Supabase en <code className="bg-slate-200/60 dark:bg-slate-850 px-1 py-0.5 rounded text-[10px] text-blue-700 dark:text-blue-300">{import.meta.env.VITE_SUPABASE_URL}</code>, pero tu base de datos aún no tiene las tablas creadas en la nube.
                </p>
                <div className="bg-slate-100/80 dark:bg-slate-950 p-3 rounded-2xl border border-slate-200/60 dark:border-slate-800 space-y-1 text-slate-500 dark:text-slate-400">
                  <span className="font-bold text-slate-700 dark:text-slate-300 block">Detalle técnico del error:</span>
                  <p className="font-mono text-[10.5px] text-red-650 dark:text-red-400 leading-snug">{supabaseError}</p>
                </div>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                  💡 Solución fácil: Ve a tu panel de Supabase &gt; SQL Editor, copia y pega las sentencias SQL provistas en tu chat para crear las tablas <code className="bg-emerald-50 dark:bg-emerald-950/40 px-1 rounded text-[10px]">usuarios</code>, <code className="bg-emerald-50 dark:bg-emerald-950/40 px-1 rounded text-[10px]">configuracion_empresa</code> y <code className="bg-emerald-50 dark:bg-emerald-950/40 px-1 rounded text-[10px]">transacciones</code>.
                </p>
              </div>
            </div>
          )}

          {/* MAIN BENTO GRID */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">

          {moduloActivo === 'configuracion' && (
            <div className="xl:col-span-12">
              <ConfiguracionEmpresa 
                currentUserRole={currentUserRole}
                companyConfig={companyConfig}
                darkMode={darkMode}
                onConfigChange={(newConfig) => {
                  setCompanyConfig(newConfig);
                  setRuc(newConfig.ruc);
                  setRucLastDigit(newConfig.ruc.length > 0 ? newConfig.ruc[newConfig.ruc.length - 1] : '7');
                }}
                bypassUITLock={bypassUITLock}
                onBypassUITLockChange={setBypassUITLock}
                startingCash={startingCash}
                onStartingCashChange={setStartingCash}
              />
            </div>
          )}
          
          {/* SUNAT RUC & DEADLINE - BENTO BOX 1 */}
          {moduloActivo === 'cronograma' && (
            <div id="ruc-setup-box" className={`col-span-12 max-w-xl mx-auto w-full ${cardBg} rounded-3xl p-6 border flex flex-col justify-between animate-fadeIn`}>
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest block mb-1">SUNAT CRONOGRAMA</span>
                    <h2 className="font-bold text-lg font-heading text-slate-900 dark:text-slate-100">Vencimiento Fiscal</h2>
                  </div>
                  <Calendar className="w-5 h-5 text-emerald-500" />
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1.5">
                      Número RUC de la Empresa:
                    </label>
                    <div className="relative">
                      <input 
                        type="text" 
                        value={ruc} 
                        onChange={(e) => handleRucChange(e.target.value)}
                        placeholder="Ej. 20601234567"
                        maxLength={11}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 pl-8 text-sm font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500"
                      />
                      <Building className="w-4 h-4 text-slate-400 absolute left-2.5 top-3" />
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Último dígito detectado: <strong className="text-slate-700 font-mono text-xs">{rucLastDigit}</strong>
                    </span>
                  </div>

                  <div className="p-4 bg-emerald-50/50 border border-emerald-100/85 rounded-2xl">
                    <div className="font-heading font-bold text-emerald-800 text-sm mb-1">
                      {deadlineInfo.status}
                    </div>
                    <p className="text-xs text-emerald-700/80">
                      Evita multas declarando antes del <span className="font-mono font-bold text-emerald-950">{deadlineInfo.date}</span> (periodo {period}).
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[11px] font-bold text-slate-500">SIRE & Portal Integrado</span>
              </div>
            </div>
          )}

          {/* DASHBOARD RESUMEN DE LIQUIDACIÓN - BENTO BOX 2 */}
          {moduloActivo === 'impuestos' && (
            <div id="liquidation-summary-box" className="col-span-12 xl:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white flex flex-col justify-between shadow-xl animate-fadeIn">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1 font-heading">
                      {modoSencillo ? "CÁLCULO SENCILLO DE IMPUESTOS" : "LIQUIDACIÓN MYPE ESTIMADA"}
                    </h2>
                    <div className="text-[11px] bg-slate-800 px-2 py-0.5 rounded text-indigo-400 inline-block font-mono border border-slate-700">
                      Periodo {period}
                    </div>
                  </div>
                  <TrendingUp className="w-6 h-6 text-indigo-400 animate-pulse" />
                </div>

                <div className="space-y-2">
                  <div className="text-[11px] text-slate-300 uppercase tracking-wider font-semibold">
                    {modoSencillo ? "💸 TOTAL DE IMPUESTOS A PAGAR ESTE MES" : "TRIBUTOS POR PAGAR A SUNAT"}
                  </div>
                  
                  {/* Total indicator with deferral applied or not */}
                  <div className="text-3.5xl font-black tracking-tight font-mono text-emerald-400">
                    S/. {totalAbonadoEfectivo.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>

                {/* Sub-itemization rows with rich colors */}
                <div className="space-y-2 pt-3 border-t border-slate-800 text-xs">
                  <div className="flex justify-between items-center bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                    <span className="text-slate-300 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                      {modoSencillo ? "Impuesto IGV (Ventas - Compras):" : "IGV por pagar (18%):"}
                    </span>
                    <span className="font-mono font-bold text-cyan-400 bg-cyan-400/10 px-2.5 py-1 rounded-lg border border-cyan-500/20">
                      S/. {igvPagarCalculado.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                    <span className="text-slate-300 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                      {modoSencillo ? `Impuesto Renta (${(rentaTasa * 100).toFixed(1)}%):` : `Impuesto Renta (${rentaTasa * 100}%):`}
                    </span>
                    <span className="font-mono font-bold text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                      S/. {rentaPagarCalculado.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  {applyIgvJusto && (
                    <div className="bg-rose-500/10 text-rose-300 p-3 rounded-2xl text-[10px] space-y-1 border border-rose-500/20 mt-2">
                      <div className="font-bold flex items-center gap-1.5 text-rose-400">
                        <span>⚖️</span> {modoSencillo ? "¡Pagarás el IGV en 3 meses!" : "¡Prorroga IGV Justo Activada!"}
                      </div>
                      <p className="leading-tight text-slate-300">
                        {modoSencillo 
                          ? `Este mes solo pagas tu Impuesto a la Renta. El pago del IGV de S/. ${igvPagarCalculado.toFixed(2)} se posterga hasta por 3 meses (90 días) para darte más aire con tu efectivo.`
                          : `Solo abonas el Impuesto a la Renta este mes. El pago de S/. ${igvPagarCalculado.toFixed(2)} se difiere hasta por 90 días.`}
                      </p>
                    </div>
                  )}
                </div>

                {/* Renta category and scale setup */}
                <div className="pt-2 border-t border-slate-800 space-y-2">
                  <label className="text-[11px] text-slate-400 font-semibold block uppercase">
                    {modoSencillo ? "Elige el tamaño de tu negocio (Ventas anuales):" : "Escala de Impuesto Renta (Anual):"}
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <button 
                      onClick={() => setAutoRenteRate('300_LIMIT')} 
                      className={`py-1.5 px-2.5 rounded-xl font-bold text-[10.5px] border transition-all ${autoRenteRate === '300_LIMIT' ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/20' : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700'}`}
                    >
                      {modoSencillo ? "Chico (< S/. 1.65M - Tasa 1%)" : "Hasta 300 UIT (Tasa 1.0%)"}
                    </button>
                    <button 
                      onClick={() => setAutoRenteRate('OVER_300')}
                      className={`py-1.5 px-2.5 rounded-xl font-bold text-[10.5px] border transition-all ${autoRenteRate === 'OVER_300' ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/20' : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700'}`}
                    >
                      {modoSencillo ? "Mediano (< S/. 9.35M - Tasa 1.5%)" : "> 300 a 1700 UIT (1.5%)"}
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input 
                    type="checkbox" 
                    id="igvJustoCheck" 
                    checked={applyIgvJusto}
                    onChange={(e) => setApplyIgvJusto(e.target.checked)}
                    className="rounded bg-slate-950 border-slate-800 text-indigo-500 focus:ring-0 focus:ring-offset-0 w-4 h-4 cursor-pointer"
                  />
                  <label htmlFor="igvJustoCheck" className="text-[11px] font-bold text-slate-400 cursor-pointer select-none hover:text-slate-200 flex items-center gap-1.5">
                    {modoSencillo ? "Quiero acorgerse al 'IGV Justo' (Pagar el IGV en 3 meses)" : "Acogerse a IGV Justo (Ley 30524)"}
                    <HelpCircle className="w-3.5 h-3.5 text-slate-500 inline" title="Permite a las MYPE con ventas anuales menores de 1700 UIT prorrogar el pago del IGV hasta por 3 meses" />
                  </label>
                </div>
              </div>

              {/* Total Summary figures beneath with rich contrast */}
              <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between text-[11px] text-slate-400">
                <div>
                  <p className="uppercase text-[9px] font-bold text-slate-500">{modoSencillo ? "Tus Ventas sin IGV" : "Ingresos del Mes"}</p>
                  <p className="font-bold text-slate-300 font-mono mt-0.5">
                    S/. {totalVentasBase.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="uppercase text-[9px] font-bold text-slate-500">{modoSencillo ? "Tus Compras para Descontar" : "Compras con Crédito"}</p>
                  <p className="font-bold text-slate-300 font-mono mt-0.5">
                    S/. {totalComprasBase.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </div>
          )}

          {moduloActivo === 'impuestos' && regimen === 'RMT' && (
            <div className={`col-span-12 xl:col-span-7 ${cardBg} rounded-3xl p-6 border animate-fadeIn space-y-6`}>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-indigo-50 dark:bg-slate-950 text-indigo-700 dark:text-indigo-450 font-bold px-2 py-0.5 rounded-lg border border-indigo-100 dark:border-indigo-900/60 uppercase tracking-wide">Planeamiento Anual</span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-550 font-mono">Ley MYPE Tributaria</span>
                  </div>
                  <h3 className="font-bold text-lg font-heading tracking-tight mt-1 text-slate-900 dark:text-slate-100">📊 Proyección de Impuesto a la Renta Anual</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-3xl mt-0.5">
                    Estima el Impuesto a la Renta Anual del ejercicio basándote en la escala progresiva acumulativa oficial de SUNAT. Modifica la utilidad proyectada para proyectar tu cierre anual.
                  </p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-2xl border border-slate-100 dark:border-slate-800 text-right shrink-0">
                  <span className="text-[9px] font-bold text-slate-400 dark:text-slate-555 block uppercase">1 UIT Oficial 2026</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200 text-xs">S/. S/. 5,500.00</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left side: interactive controls */}
                <div className="lg:col-span-5 space-y-4 bg-slate-50/50 p-5 rounded-3xl border border-slate-150">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">
                      Utilidad Neta Anual Proyectada:
                    </label>
                    <p className="text-[11px] text-slate-400 leading-normal">
                      (Tus ingresos anuales menos los gastos de compras deducibles autorizados por SUNAT)
                    </p>
                    
                    <div className="relative mt-2">
                      <span className="absolute left-3 top-2.5 font-bold text-slate-400 text-xs font-sans">S/.</span>
                      <input 
                        type="number"
                        value={customAnnualNetProfit}
                        onChange={(e) => setCustomAnnualNetProfit(Math.max(0, Number(e.target.value)))}
                        className="w-full bg-white border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 rounded-2xl py-2 px-3 pl-10 text-xs font-bold text-slate-800 font-mono focus:outline-none"
                      />
                    </div>

                    <input 
                      type="range"
                      min="10000"
                      max="300000"
                      step="5000"
                      value={customAnnualNetProfit}
                      onChange={(e) => setCustomAnnualNetProfit(Number(e.target.value))}
                      className="w-full accent-indigo-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer mt-3"
                    />
                    <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                      <span>S/. 10,000</span>
                      <span>S/. 150,000</span>
                      <span>S/. 300,000+</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200/60 text-[11px] text-slate-600 leading-normal space-y-2">
                    <p className="font-semibold text-slate-800">💡 Recomendación Tributaria SUNAT:</p>
                    {customAnnualNetProfit > 82500 ? (
                      <p>
                        Tu utilidad supera las 15 UIT (S/. 82,500). El exceso se grava con la tasa de <strong className="text-indigo-700">29.5%</strong>. Evalúa programar tus adquisiciones estratégicas y depreciaciones de activo fijo antes del cierre anual de forma causal para optimizar legalmente tu utilidad imponible.
                      </p>
                    ) : (
                      <p>
                        Tu utilidad proyectada se mantiene dentro de las 15 UIT. Toda tu utilidad tributará únicamente con la tasa reducida promocional del <strong className="text-emerald-700">10%</strong>. ¡Excelente rango para MYPEs en crecimiento!
                      </p>
                    )}
                  </div>
                </div>

                {/* Right side: visual breakdown calculation */}
                <div className="lg:col-span-7 space-y-5">
                  {/* Progressive bar chart */}
                  {(() => {
                    const limit15UIT = 15 * 5500; // 82,500
                    const u = customAnnualNetProfit;
                    
                    const p1 = Math.min(u, limit15UIT);
                    const p2 = Math.max(0, u - limit15UIT);
                    
                    const p1Pct = u > 0 ? (p1 / u) * 100 : 0;
                    const p2Pct = u > 0 ? (p2 / u) * 100 : 0;

                    const imp1 = p1 * 0.10;
                    const imp2 = p2 * 0.295;
                    const impTotal = imp1 + imp2;
                    const effectiveRate = u > 0 ? (impTotal / u) * 100 : 0;

                    return (
                      <div className="space-y-4">
                        {/* Visual Segment Bar */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[11px] font-bold text-slate-500">
                            <span>Distribución de Utilidad en Tramos:</span>
                            <span className="font-mono text-indigo-700">Total: S/. {u.toLocaleString()}</span>
                          </div>
                          
                          <div className="h-6 w-full bg-slate-100 rounded-xl overflow-hidden flex border border-slate-200">
                            {p1 > 0 && (
                              <div 
                                style={{ width: `${p1Pct}%` }}
                                className="bg-emerald-500 flex items-center justify-center text-[10px] text-white font-bold transition-all duration-300"
                                title="Tramo 1 (10% Renta)"
                              >
                                {p1Pct > 15 ? `Tramo 1: 10%` : `10%`}
                              </div>
                            )}
                            {p2 > 0 && (
                              <div 
                                style={{ width: `${p2Pct}%` }}
                                className="bg-indigo-600 flex items-center justify-center text-[10px] text-white font-bold transition-all duration-300"
                                title="Tramo 2 (29.5% Renta)"
                              >
                                {p2Pct > 15 ? `Tramo 2: 29.5%` : `29.5%`}
                              </div>
                            )}
                          </div>

                          <div className="flex justify-between text-[10px] text-slate-400 font-mono pt-1">
                            <span>Tramo 1 (Hasta 15 UIT)</span>
                            <span>Tramo 2 (Exceso 15 UIT)</span>
                          </div>
                        </div>

                        {/* Detailed math rows */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Tramo 1 details card */}
                          <div className="bg-emerald-50/40 p-4 rounded-2xl border border-emerald-100/60 space-y-1">
                            <span className="text-[10px] font-bold text-emerald-800 block uppercase">TRAMO 1 (Hasta S/. 82,500)</span>
                            <div className="flex justify-between items-baseline pt-1">
                              <span className="text-xs text-slate-500">Base imponible:</span>
                              <span className="font-mono font-bold text-slate-800">S/. {p1.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                            </div>
                            <div className="flex justify-between items-baseline pt-0.5 border-t border-emerald-100/50 mt-1">
                              <span className="text-xs text-emerald-800 font-semibold">Impuesto (10%):</span>
                              <span className="font-mono font-bold text-emerald-900">S/. {imp1.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                            </div>
                          </div>

                          {/* Tramo 2 details card */}
                          <div className="bg-indigo-50/30 p-4 rounded-2xl border border-indigo-100/60 space-y-1">
                            <span className="text-[10px] font-bold text-indigo-800 block uppercase">TRAMO 2 (Exceso de 15 UIT)</span>
                            <div className="flex justify-between items-baseline pt-1">
                              <span className="text-xs text-slate-500">Base imponible:</span>
                              <span className="font-mono font-bold text-slate-800">S/. {p2.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                            </div>
                            <div className="flex justify-between items-baseline pt-0.5 border-t border-indigo-100/50 mt-1">
                              <span className="text-xs text-indigo-800 font-semibold">Impuesto (29.5%):</span>
                              <span className="font-mono font-bold text-indigo-900">S/. {imp2.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                            </div>
                          </div>
                        </div>

                        {/* Final summary card */}
                        <div className="bg-slate-900 text-white p-5 rounded-3xl flex justify-between items-center shadow-lg">
                          <div>
                            <span className="text-[9px] font-bold text-indigo-300 uppercase tracking-widest block">IMPUESTO TOTAL ESTIMADO ANUAL</span>
                            <div className="text-2xl font-black font-mono tracking-tight text-white mt-1">
                              S/. {impTotal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-[9px] font-bold text-slate-400 block uppercase tracking-widest">TASA EFECTIVA REAL</span>
                            <div className="text-xl font-bold font-mono text-emerald-400 mt-1">
                              {effectiveRate.toFixed(2)}%
                            </div>
                          </div>
                        </div>

                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          )}

          {/* QUICK PRESETS PLAN DE CUENTAS MYPE - BENTO BOX 3 */}
          {moduloActivo === 'simulador' && (
            <div id="pcge-snippet-box" className={`col-span-12 xl:col-span-4 ${cardBg} rounded-3xl p-6 border flex flex-col justify-between animate-fadeIn`}>
              <div>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest block mb-1">PCGE DE CONSULTA</span>
                    <h2 className="font-bold text-sm font-heading text-slate-900 dark:text-slate-100">Plan de Cuentas MYPE</h2>
                  </div>
                  <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-500 dark:text-slate-400 font-bold uppercase font-mono">
                    RMT
                  </span>
                </div>

                {/* Search Account */}
                <div className="mb-4 relative">
                  <input 
                    type="text" 
                    placeholder="Buscar cuenta o palabra..." 
                    value={pcgeSearch}
                    onChange={(e) => setPcgeSearch(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-1.5 px-3 pl-8 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                </div>

                {/* Tabs */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {['Todos', 'Activo', 'Pasivo', 'Gasto', 'Ingreso'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setPcgeFilter(cat)}
                      className={`text-[10px] px-2 py-1 rounded-md font-bold transition-all ${pcgeFilter === cat ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* List Container */}
                <div className="max-h-[160px] overflow-y-auto space-y-1.5 pr-1 divide-y divide-slate-100">
                  {PCGE_MYPE.filter(acc => {
                    const matchSearch = acc.cta.includes(pcgeSearch) || acc.desc.toLowerCase().includes(pcgeSearch.toLowerCase());
                    const matchFilter = pcgeFilter === 'Todos' || acc.categoria === pcgeFilter;
                    return matchSearch && matchFilter;
                  }).map((item) => (
                    <div 
                      key={item.cta} 
                      onClick={() => setSelectedPCGE(item)}
                      className={`flex justify-between items-center py-2 px-2.5 rounded-lg text-xs cursor-pointer transition-all ${selectedPCGE?.cta === item.cta ? 'bg-emerald-50 text-emerald-950 font-semibold border-l-4 border-emerald-500' : 'hover:bg-slate-50 text-slate-600'}`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`font-mono font-bold ${selectedPCGE?.cta === item.cta ? 'text-emerald-700' : 'text-indigo-600'}`}>{item.cta}</span>
                        <span className="truncate max-w-[150px]">{item.desc}</span>
                      </div>
                      <span className="text-[9px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 font-mono">
                        {item.categoria[0]}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Active PCGE Explanation Box */}
                {selectedPCGE && (
                  <div className="mt-4 p-3 bg-indigo-50/50 border border-indigo-100 rounded-2xl">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] bg-indigo-600 text-white font-mono px-1.5 py-0.5 rounded">Cuenta {selectedPCGE.cta}</span>
                      <span className="text-[10px] font-bold text-indigo-700">{selectedPCGE.categoria}</span>
                    </div>
                    <p className="text-xs text-indigo-950 font-bold mb-1">{selectedPCGE.desc}</p>
                    <p className="text-[11px] text-slate-600 leading-relaxed font-sans">{selectedPCGE.explicacion}</p>
                  </div>
                )}
              </div>
            </div>
          )}

            {/* TREASURY & OPERATIONS CENTER - Bento Box 5 */}
            {moduloActivo === 'libros' && (
              <div id="new-asiento-box" className={`col-span-12 xl:col-span-4 ${cardBg} rounded-3xl p-6 border flex flex-col justify-between animate-fadeIn`}>
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest block mb-1">CENTRO DE OPERACIONES</span>
                      <h2 className="font-bold text-base font-heading text-slate-900 dark:text-slate-100">Gestión Operativa y Tesorería</h2>
                    </div>
                    <span className="text-lg">💼</span>
                  </div>
                  <p className="text-xs text-slate-400 dark:text-slate-450 mb-4 font-sans">Haz clic en cualquier botón para abrir el formulario especializado de registro contable en tiempo real.</p>

                  <div className="space-y-2.5">
                    {/* VENTA */}
                    <button
                      type="button"
                      onClick={() => {
                        setActiveModal('VENTA');
                        setMTipoComprobante('Factura');
                        setMSerieNumero(`F001-${Math.floor(Math.random() * 90000) + 10000}`);
                        setMPrecioUnitario('1200');
                        setMGlosa('');
                        setMRuc('20110000101');
                        setMClienteProveedor('Inversiones Unidas SAC');
                        setMCatalogItem('Mercadería Comercial Lote A');
                        setMCondicionOperacion('Contado');
                        setMFormaPago('Transferencia');
                        setMCuentaDinero('1041');
                      }}
                      className="w-full text-left p-3 rounded-2xl border border-emerald-100 hover:border-emerald-300 bg-emerald-50/20 hover:bg-emerald-50/40 transition-all cursor-pointer flex justify-between items-center group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-emerald-500 text-white w-9 h-9 rounded-xl flex items-center justify-center font-bold text-base shadow-sm shadow-emerald-500/10">
                          🟢
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">Registrar Venta</h4>
                          <p className="text-[10px] text-slate-500 font-sans">Facturas, boletas y notas de débito</p>
                        </div>
                      </div>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-black px-2 py-0.5 rounded-full group-hover:translate-x-0.5 transition-transform font-sans">Ingresos →</span>
                    </button>

                    {/* COMPRA DE GASTOS */}
                    <button
                      type="button"
                      onClick={() => {
                        setActiveModal('COMPRA');
                        setMTipoComprobante('Factura');
                        setMSerieNumero(`FT01-${Math.floor(Math.random() * 90000) + 10000}`);
                        setMPrecioUnitario('600');
                        setMGlosa('');
                        setMRuc('20459876543');
                        setMClienteProveedor('Distribuidora El Sol SRL');
                        setMCatalogItem('Honorarios del Contador Externo');
                        setMCondicionOperacion('Contado');
                        setMFormaPago('Transferencia');
                        setMCuentaDinero('1041');
                      }}
                      className="w-full text-left p-3 rounded-2xl border border-indigo-100 hover:border-indigo-300 bg-indigo-50/20 hover:bg-indigo-50/40 transition-all cursor-pointer flex justify-between items-center group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-indigo-600 text-white w-9 h-9 rounded-xl flex items-center justify-center font-bold text-base shadow-sm shadow-indigo-600/10">
                          🔵
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">Registrar Compra / Gasto</h4>
                          <p className="text-[10px] text-slate-500 font-sans">Proveedores, mercadería y gastos fijos</p>
                        </div>
                      </div>
                      <span className="text-[10px] bg-indigo-100 text-indigo-800 font-black px-2 py-0.5 rounded-full group-hover:translate-x-0.5 transition-transform font-sans">Gastos →</span>
                    </button>

                    {/* REGISTRAR COBRO */}
                    <button
                      type="button"
                      onClick={() => {
                        setActiveModal('COBRO');
                        setMTipoComprobante('Recibo de Caja');
                        setMSerieNumero(`RC01-${Math.floor(Math.random() * 9000) + 1000}`);
                        setMPrecioUnitario('1180');
                        setMGlosa('Cobro de Factura F001-000101');
                        setMRuc('20601234567');
                        setMClienteProveedor('Cliente Corporativo SAC');
                        setMCatalogItem('Cobro en Cartera');
                        setMFormaPago('Transferencia');
                        setMCuentaDinero('1041');
                      }}
                      className="w-full text-left p-3 rounded-2xl border border-teal-100 hover:border-teal-300 bg-teal-50/20 hover:bg-teal-50/40 transition-all cursor-pointer flex justify-between items-center group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-teal-500 text-white w-9 h-9 rounded-xl flex items-center justify-center font-bold text-base shadow-sm shadow-teal-500/10">
                          🪙
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">Registrar Cobro</h4>
                          <p className="text-[10px] text-slate-500 font-sans">Liquidar facturas por cobrar (Cta. 1212)</p>
                        </div>
                      </div>
                      <span className="text-[10px] bg-teal-100 text-teal-800 font-black px-2 py-0.5 rounded-full group-hover:translate-x-0.5 transition-transform font-sans">Cobros →</span>
                    </button>

                    {/* REGISTRAR PAGO */}
                    <button
                      type="button"
                      onClick={() => {
                        setActiveModal('PAGO');
                        setMTipoComprobante('Comprobante Pago');
                        setMSerieNumero(`RP01-${Math.floor(Math.random() * 9000) + 1000}`);
                        setMPrecioUnitario('590');
                        setMGlosa('Pago a Proveedor de factura FT01-001245');
                        setMRuc('20459876543');
                        setMClienteProveedor('Distribuidora El Sol SRL');
                        setMCatalogItem('Pago Obligación');
                        setMFormaPago('Efectivo');
                        setMCuentaDinero('101');
                      }}
                      className="w-full text-left p-3 rounded-2xl border border-rose-100 hover:border-rose-300 bg-rose-50/20 hover:bg-rose-50/40 transition-all cursor-pointer flex justify-between items-center group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-rose-500 text-white w-9 h-9 rounded-xl flex items-center justify-center font-bold text-base shadow-sm shadow-rose-500/10">
                          💸
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">Registrar Pago</h4>
                          <p className="text-[10px] text-slate-500 font-sans">Cancelar facturas por pagar (Cta. 4212)</p>
                        </div>
                      </div>
                      <span className="text-[10px] bg-rose-100 text-rose-800 font-black px-2 py-0.5 rounded-full group-hover:translate-x-0.5 transition-transform font-sans">Pagos →</span>
                    </button>

                    {/* INTERCONEXIÓN CAJA / BANCOS */}
                    <button
                      type="button"
                      onClick={() => {
                        setActiveModal('TRANSFERENCIA');
                        setMTipoComprobante('Nota de Débito');
                        setMSerieNumero(`TR-${Math.floor(Math.random() * 90000) + 10000}`);
                        setMPrecioUnitario('1000');
                        setMGlosa('Depósito de efectivo a cuenta corriente comercial');
                        setMRuc(ruc);
                        setMClienteProveedor('Autotransferencia Comercial');
                        setMCatalogItem('Transferencia Interna');
                        setMFormaPago('Depósito bancario');
                        setMCuentaDinero('101'); // Source account
                        setMObservaciones('1041'); // Destination account
                      }}
                      className="w-full text-left p-3 rounded-2xl border border-amber-100 hover:border-amber-300 bg-amber-50/20 hover:bg-amber-50/40 transition-all cursor-pointer flex justify-between items-center group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-amber-500 text-white w-9 h-9 rounded-xl flex items-center justify-center font-bold text-base shadow-sm shadow-amber-500/10">
                          🏦
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">Movimiento de Caja / Banco</h4>
                          <p className="text-[10px] text-slate-500 font-sans">Depósito en cuenta o retiro de efectivo</p>
                        </div>
                      </div>
                      <span className="text-[10px] bg-amber-100 text-amber-800 font-black px-2 py-0.5 rounded-full group-hover:translate-x-0.5 transition-transform font-sans">Fondos →</span>
                    </button>

                    {/* REGISTRAR APORTE DE CAPITAL */}
                    <button
                      type="button"
                      onClick={() => {
                        setActiveModal('APERTURA');
                        setMTipoComprobante('Recibo de Caja');
                        setMSerieNumero(`AC01-${Math.floor(Math.random() * 90000) + 10000}`);
                        setMPrecioUnitario('5000');
                        setMGlosa('Aporte de capital social de socios fundadores');
                        setMRuc(ruc);
                        setMClienteProveedor('Socios Fundadores');
                        setMCatalogItem('Aporte de Capital');
                        setMFormaPago('Efectivo');
                        setMCuentaDinero('101');
                        setMObservaciones('5011');
                      }}
                      className="w-full text-left p-3 rounded-2xl border border-purple-100 hover:border-purple-300 bg-purple-50/20 hover:bg-purple-50/40 transition-all cursor-pointer flex justify-between items-center group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-purple-500 text-white w-9 h-9 rounded-xl flex items-center justify-center font-bold text-base shadow-sm shadow-purple-500/10">
                          🛡️
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">Registrar Aporte de Capital</h4>
                          <p className="text-[10px] text-slate-500 font-sans">Ingreso de inversión propia o capital (Cta. 5011)</p>
                        </div>
                      </div>
                      <span className="text-[10px] bg-purple-100 text-purple-800 font-black px-2 py-0.5 rounded-full group-hover:translate-x-0.5 transition-transform font-sans">Socios →</span>
                    </button>

                  </div>
                </div>
              </div>
            )}

            {/* LIBRO DIARIO GENERAL & PARTIDA DOBLE TABS - Bento Box 6 */}
            {moduloActivo === 'libros' && (
              <div id="libro-diario-box" className={`col-span-12 xl:col-span-8 ${cardBg} rounded-3xl p-6 border flex flex-col justify-between animate-fadeIn`}>
              <div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest block mb-1">LIBROS ELECTRÓNICOS SUNAT (SIRE)</span>
                    <h2 className="font-bold text-lg font-heading text-slate-900 dark:text-slate-100">
                      Libros y Registros Contables {regimen === 'RER' ? 'RER (Reg. Especial)' : 'MYPE (Reg. MYPE Tributario)'}
                    </h2>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
                      <button 
                        onClick={() => exportToExcel(selectedDiarioTab, {
                          transactions: filteredTransactions,
                          periodEntries: allPeriodEntries,
                          period,
                          ruc,
                          solUser,
                          regimen,
                          modoSencillo,
                          catalogItems,
                          selectedInventoryProduct,
                          getKardexForProduct,
                          companyName: companyConfig.razonSocial
                        })}
                        title="Descargar reporte formateado en Excel (.xls)"
                        className="text-[10.5px] bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-1 px-2.5 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        📊 Excel
                      </button>
                      <button 
                        onClick={() => exportToPDF(selectedDiarioTab, {
                          transactions: filteredTransactions,
                          periodEntries: allPeriodEntries,
                          period,
                          ruc,
                          solUser,
                          regimen,
                          modoSencillo,
                          catalogItems,
                          selectedInventoryProduct,
                          getKardexForProduct,
                          companyName: companyConfig.razonSocial,
                          representanteLegal: companyConfig.representanteLegal
                        })}
                        title="Imprimir o descargar reporte contable en PDF"
                        className="text-[10.5px] bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-1 px-2.5 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        📄 PDF
                      </button>
                    </div>
                    <button 
                      onClick={handleResetData}
                      title={currentUserRole === 'EMPLEADO' ? "Reinicio bloqueado: Solo Gerente/Admin/Contador" : "Reiniciar a semilla temporal inicial"}
                      className={`text-xs p-1.5 rounded-xl transition-colors cursor-pointer ${
                        currentUserRole === 'EMPLEADO' 
                          ? 'bg-amber-50 text-amber-500 hover:bg-amber-100/50' 
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                      }`}
                    >
                      {currentUserRole === 'EMPLEADO' ? <Lock className="w-3.5 h-3.5" /> : <RefreshCw className="w-3.5 h-3.5" />}
                    </button>
                    <button 
                      onClick={handleClearAllData}
                      title={currentUserRole === 'EMPLEADO' ? "Limpieza bloqueada: Solo Gerente/Admin/Contador" : "Limpiar todas las operaciones"}
                      className={`text-xs p-1.5 rounded-xl transition-colors cursor-pointer ${
                        currentUserRole === 'EMPLEADO'
                          ? 'bg-amber-50 text-amber-500 hover:bg-amber-100/50'
                          : 'bg-red-50 hover:bg-red-100 text-red-600'
                      }`}
                    >
                      {currentUserRole === 'EMPLEADO' ? <Lock className="w-3.5 h-3.5" /> : <Trash2 className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* TAB SWITCHER */}
                {moduloActivo === 'libros' && (
                  <div className="flex flex-wrap border-b border-slate-200 mb-5 gap-y-2 select-none">
                    <button
                      type="button"
                      onClick={() => setSelectedDiarioTab('ventas')}
                      className={`pb-2.5 px-3 sm:px-4 text-[10.5px] font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                        selectedDiarioTab === 'ventas'
                          ? 'border-emerald-650 text-emerald-750 font-black'
                          : 'border-transparent text-slate-400 hover:text-slate-650'
                      }`}
                    >
                      📈 Ventas (SIRE - RVIE)
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedDiarioTab('compras')}
                      className={`pb-2.5 px-3 sm:px-4 text-[10.5px] font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                        selectedDiarioTab === 'compras'
                          ? 'border-indigo-600 text-indigo-750'
                          : 'border-transparent text-slate-400 hover:text-slate-650'
                      }`}
                    >
                      📉 Compras (SIRE - RCE)
                    </button>

                    {regimen === 'RMT' && (
                      <>
                        <button
                          type="button"
                          onClick={() => setSelectedDiarioTab('diario')}
                          className={`pb-2.5 px-3 sm:px-4 text-[10.5px] font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                            selectedDiarioTab === 'diario'
                              ? 'border-indigo-600 text-indigo-750'
                              : 'border-transparent text-slate-400 hover:text-slate-650'
                          }`}
                        >
                          📖 {projectedIncomeUIT <= 300 && !bypassUITLock ? "LDFS (Diario Simplificado)" : "Libro Diario Completo"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedDiarioTab('mayor')}
                          className={`pb-2.5 px-3 sm:px-4 text-[10.5px] font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                            selectedDiarioTab === 'mayor'
                              ? 'border-indigo-600 text-indigo-750'
                              : 'border-transparent text-slate-400 hover:text-slate-650'
                          }`}
                        >
                          🗂️ Libro Mayor {projectedIncomeUIT <= 300 && !bypassUITLock && "🔒"}
                        </button>
                      </>
                    )}

                    <button
                      type="button"
                      onClick={() => setSelectedDiarioTab('balance')}
                      className={`pb-2.5 px-3 sm:px-4 text-[10.5px] font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                        selectedDiarioTab === 'balance'
                          ? 'border-indigo-600 text-indigo-750'
                          : 'border-transparent text-slate-400 hover:text-slate-650'
                      }`}
                    >
                      📊 Balance de Comprobación
                    </button>

                    {regimen === 'RMT' && (
                      <button
                        type="button"
                        onClick={() => setSelectedDiarioTab('inventario_balances')}
                        className={`pb-2.5 px-3 sm:px-4 text-[10.5px] font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                          selectedDiarioTab === 'inventario_balances'
                            ? 'border-indigo-600 text-indigo-750'
                            : 'border-transparent text-slate-400 hover:text-slate-650'
                        }`}
                      >
                        📋 Inventarios y Balances {projectedIncomeUIT <= 500 && !bypassUITLock && "🔒"}
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => setSelectedDiarioTab('catalogo')}
                      className={`pb-2.5 px-3 sm:px-4 text-[10.5px] font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                        selectedDiarioTab === 'catalogo'
                          ? 'border-indigo-600 text-indigo-750'
                          : 'border-transparent text-slate-400 hover:text-slate-650'
                      }`}
                    >
                      🏷️ Catálogo
                    </button>
                  </div>
                )}

                {selectedDiarioTab === 'ventas' && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="bg-emerald-50/50 border border-emerald-100 p-4.5 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <h3 className="text-xs font-black text-emerald-850 uppercase tracking-wider mb-1">
                          {modoSencillo ? "📈 Mis Ventas de Bienes o Servicios (Lo que vendiste)" : "🏛️ Registro de Ventas e Ingresos (SIRE - RVIE)"}
                        </h3>
                        <p className="text-[11px] text-emerald-700 font-sans max-w-2xl leading-normal">
                          {modoSencillo 
                            ? "Aquí están todas tus boletas y facturas de venta. Estos montos le dicen a la SUNAT cuánto dinero ha ingresado a tu negocio para calcular tus impuestos fijos o progresivos del mes." 
                            : "Comprobantes de pago emitidos por la empresa durante el periodo fiscal activo. Es de carácter obligatorio para el Régimen Especial (RER) y Régimen MYPE Tributario (RMT)."}
                        </p>
                      </div>
                      <button 
                        type="button"
                        onClick={handleExportSIRE_RVIE}
                        className="bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs py-2 px-4 rounded-xl shadow-md shadow-emerald-500/10 transition-all shrink-0 cursor-pointer flex items-center gap-1.5"
                      >
                        <span>📥 Exportar SIRE RVIE (.txt)</span>
                      </button>
                    </div>

                    {/* Document Filter Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 dark:bg-slate-950 p-2.5 rounded-2xl border border-slate-100 dark:border-slate-850">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider ml-1">Filtrar por Documento:</span>
                        <div className="flex bg-slate-200/60 dark:bg-slate-900 rounded-xl p-1 gap-1">
                          <button
                            type="button"
                            onClick={() => setVentasFiltroDoc('TODOS')}
                            className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                              ventasFiltroDoc === 'TODOS'
                                ? 'bg-indigo-600 text-white shadow-xs'
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-300/40 dark:hover:bg-slate-800/60'
                            }`}
                          >
                            📁 Todos
                          </button>
                          <button
                            type="button"
                            onClick={() => setVentasFiltroDoc('FACTURAS')}
                            className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                              ventasFiltroDoc === 'FACTURAS'
                                ? 'bg-indigo-600 text-white shadow-xs'
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-300/40 dark:hover:bg-slate-800/60'
                            }`}
                          >
                            🧾 Facturas
                          </button>
                          <button
                            type="button"
                            onClick={() => setVentasFiltroDoc('BOLETAS')}
                            className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                              ventasFiltroDoc === 'BOLETAS'
                                ? 'bg-indigo-600 text-white shadow-xs'
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-300/40 dark:hover:bg-slate-800/60'
                            }`}
                          >
                            🎫 Boletas
                          </button>
                        </div>
                      </div>
                      <div className="text-[10.5px] font-black font-sans text-slate-500 mr-1.5">
                        Modo Activo: <span className="text-indigo-600 dark:text-indigo-400 font-extrabold uppercase">{ventasFiltroDoc === 'TODOS' ? 'Todos los Comprobantes' : ventasFiltroDoc === 'FACTURAS' ? 'Modo Factura' : 'Modo Boleta'}</span>
                      </div>
                    </div>

                    <div className="overflow-x-auto border border-slate-250/60 rounded-2xl bg-white">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase font-black tracking-wider text-slate-400 select-none">
                            <th className="py-3 px-3">{modoSencillo ? "Fecha de Venta" : "F. Emisión"}</th>
                            <th className="py-3 px-3">{modoSencillo ? "Boleta / Factura" : "Comprobante"}</th>
                            <th className="py-3 px-3">{modoSencillo ? "Cliente" : "Cliente / Destinatario"}</th>
                            <th className="py-3 px-3">{modoSencillo ? "RUC o DNI" : "RUC / Doc"}</th>
                            <th className="py-3 px-3 text-right">{modoSencillo ? "Plata Limpia" : "Monto Base"}</th>
                            <th className="py-3 px-3 text-right">{modoSencillo ? "Impuesto IGV (18%)" : "IGV (18%)"}</th>
                            <th className="py-3 px-3 text-right">{modoSencillo ? "Cobro Total" : "Total Soles"}</th>
                            <th className="py-3 px-2 text-center">Estado</th>
                            <th className="py-3 px-2 text-center">Acciones</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs">
                          {(() => {
                            let sales = filteredTransactions.filter(t => t.tipo === 'VENTA');
                            if (ventasFiltroDoc === 'FACTURAS') {
                              sales = sales.filter(s => s.documento.toUpperCase().startsWith('F') || s.documento.toLowerCase().includes('factura'));
                            } else if (ventasFiltroDoc === 'BOLETAS') {
                              sales = sales.filter(s => s.documento.toUpperCase().startsWith('B') || s.documento.toLowerCase().includes('boleta'));
                            }
                            if (sales.length === 0) {
                              return (
                                <tr>
                                  <td colSpan={9} className="py-8 text-center text-slate-400 italic">No hay registros de ventas para este periodo.</td>
                                </tr>
                              );
                            }
                            
                            let totalBase = 0;
                            let totalIgv = 0;
                            let totalSol = 0;

                            return (
                              <>
                                {sales.map(s => {
                                  if (!s.isExtornado) {
                                    totalBase += s.montoBase;
                                    totalIgv += s.igv;
                                    totalSol += s.total;
                                  }
                                  return (
                                    <tr key={s.id} className={`hover:bg-slate-50/40 transition-colors ${s.isExtornado ? 'opacity-40 line-through bg-slate-50/80' : ''}`}>
                                      <td className="py-3 px-3 font-medium text-slate-600">{s.fecha}</td>
                                      <td className="py-3 px-3 font-mono font-bold text-slate-800">{s.documento}</td>
                                      <td className="py-3 px-3 font-semibold text-slate-900">{s.clienteProveedorNombre || s.glosa}</td>
                                      <td className="py-3 px-3 font-mono text-slate-500">{s.rucClienteProveedor}</td>
                                      <td className="py-3 px-3 text-right font-mono font-bold text-slate-700">S/. {s.montoBase.toFixed(2)}</td>
                                      <td className="py-3 px-3 text-right font-mono text-slate-600">S/. {s.igv.toFixed(2)}</td>
                                      <td className="py-3 px-3 text-right font-mono font-black text-slate-900">S/. {s.total.toFixed(2)}</td>
                                      <td className="py-3 px-2 text-center">
                                        <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${s.isExtornado ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'}`}>
                                          {s.isExtornado ? 'Anulado' : 'Emitido'}
                                        </span>
                                      </td>
                                      <td className="py-3 px-2 text-center">
                                        <div className="flex items-center justify-center gap-1.5">
                                          <button
                                            type="button"
                                            onClick={() => setSelectedVentaComprobante(s)}
                                            className="text-[10px] bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold py-1 px-2 rounded-lg border border-indigo-200 hover:border-indigo-300 transition-colors flex items-center gap-1 cursor-pointer"
                                            title="Ver Comprobante Electrónico (SUNAT PDF)"
                                          >
                                            📄 Comprobante
                                          </button>
                                          {currentUserRole === 'EMPLEADO' ? (
                                            <button 
                                              type="button"
                                              onClick={() => handleRemoveTransaction(s.id)}
                                              className="text-amber-500 hover:text-amber-600 p-1.5 rounded-lg border border-amber-200 bg-amber-50/50 transition-colors cursor-pointer"
                                              title="Acceso Bloqueado: Su rango es Empleado"
                                            >
                                              <Lock className="w-3.5 h-3.5" />
                                            </button>
                                          ) : (
                                            <button 
                                              type="button"
                                              onClick={() => handleRemoveTransaction(s.id)}
                                              className="text-slate-400 hover:text-red-500 p-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-red-50 hover:border-red-200 transition-colors cursor-pointer"
                                              title="Eliminar venta de los libros"
                                            >
                                              <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                          )}
                                        </div>
                                      </td>
                                    </tr>
                                  );
                                })}
                                <tr className="bg-slate-50/80 font-black text-slate-900 border-t border-slate-200">
                                  <td colSpan={4} className="py-3 px-3 text-right uppercase tracking-wider text-[10px]">Totales Acumulados:</td>
                                  <td className="py-3 px-3 text-right font-mono text-slate-950">S/. {totalBase.toFixed(2)}</td>
                                  <td className="py-3 px-3 text-right font-mono text-slate-950">S/. {totalIgv.toFixed(2)}</td>
                                  <td className="py-3 px-3 text-right font-mono text-emerald-700 text-sm">S/. {totalSol.toFixed(2)}</td>
                                  <td></td>
                                  <td></td>
                                </tr>
                              </>
                            );
                          })()}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {selectedDiarioTab === 'compras' && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="bg-indigo-50/50 border border-indigo-100 p-4.5 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <h3 className="text-xs font-black text-indigo-850 uppercase tracking-wider mb-1">
                          {modoSencillo ? "📉 Mis Compras y Gastos del Negocio (Lo que compraste)" : "🏛️ Registro de Compras (SIRE - RCE)"}
                        </h3>
                        <p className="text-[11px] text-indigo-700 font-sans max-w-2xl leading-normal">
                          {modoSencillo 
                            ? "Aquí anotas todo lo que gastas para tu negocio (mercadería, luz, agua, contador, etc.). Tener estas facturas te ayuda a restar el impuesto IGV y pagar menos de forma 100% legal." 
                            : "Comprobantes de pago recibidos de proveedores por adquisiciones y gastos del periodo activo. Obligatorio en RER y RMT."}
                        </p>
                      </div>
                      <button 
                        type="button"
                        onClick={handleExportSIRE_RCE}
                        className="bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-xs py-2 px-4 rounded-xl shadow-md shadow-indigo-500/10 transition-all shrink-0 cursor-pointer flex items-center gap-1.5"
                      >
                        <span>📥 Exportar SIRE RCE (.txt)</span>
                      </button>
                    </div>

                    {/* Document Filter Bar for Compras */}
                    <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 dark:bg-slate-950 p-2.5 rounded-2xl border border-slate-100 dark:border-slate-850">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider ml-1">Filtrar por Documento:</span>
                        <div className="flex bg-slate-200/60 dark:bg-slate-900 rounded-xl p-1 gap-1">
                          <button
                            type="button"
                            onClick={() => setComprasFiltroDoc('TODOS')}
                            className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                              comprasFiltroDoc === 'TODOS'
                                ? 'bg-indigo-600 text-white shadow-xs'
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-300/40 dark:hover:bg-slate-800/60'
                            }`}
                          >
                            📁 Todos
                          </button>
                          <button
                            type="button"
                            onClick={() => setComprasFiltroDoc('FACTURAS')}
                            className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                              comprasFiltroDoc === 'FACTURAS'
                                ? 'bg-indigo-600 text-white shadow-xs'
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-300/40 dark:hover:bg-slate-800/60'
                            }`}
                          >
                            🧾 Facturas
                          </button>
                          <button
                            type="button"
                            onClick={() => setComprasFiltroDoc('BOLETAS')}
                            className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                              comprasFiltroDoc === 'BOLETAS'
                                ? 'bg-indigo-600 text-white shadow-xs'
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-300/40 dark:hover:bg-slate-800/60'
                            }`}
                          >
                            🎫 Boletas
                          </button>
                        </div>
                      </div>
                      <div className="text-[10.5px] font-black font-sans text-slate-500 mr-1.5">
                        Modo Activo: <span className="text-indigo-600 dark:text-indigo-400 font-extrabold uppercase">{comprasFiltroDoc === 'TODOS' ? 'Todos los Comprobantes' : comprasFiltroDoc === 'FACTURAS' ? 'Modo Factura' : 'Modo Boleta'}</span>
                      </div>
                    </div>

                    <div className="overflow-x-auto border border-slate-250/60 rounded-2xl bg-white">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-50/50 border-b border-slate-200 text-[10px] uppercase font-black tracking-wider text-slate-400 select-none">
                            <th className="py-3 px-3">{modoSencillo ? "Fecha de Compra" : "F. Emisión"}</th>
                            <th className="py-3 px-3">{modoSencillo ? "Factura Recibida" : "Comprobante"}</th>
                            <th className="py-3 px-3">{modoSencillo ? "Proveedor (Quién te vende)" : "Proveedor / Emisor"}</th>
                            <th className="py-3 px-3">{modoSencillo ? "RUC del Proveedor" : "RUC / Doc"}</th>
                            <th className="py-3 px-3 text-right">{modoSencillo ? "Monto Limpio" : "Monto Base"}</th>
                            <th className="py-3 px-3 text-right">{modoSencillo ? "IGV a tu Favor" : "IGV (18%)"}</th>
                            <th className="py-3 px-3 text-right">{modoSencillo ? "Gasto Total" : "Total Soles"}</th>
                            <th className="py-3 px-2 text-center">Estado</th>
                            <th className="py-3 px-2 text-center">Acciones</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs">
                          {(() => {
                            let purchases = filteredTransactions.filter(t => t.tipo === 'COMPRA');
                            if (comprasFiltroDoc === 'FACTURAS') {
                              purchases = purchases.filter(s => s.documento.toUpperCase().startsWith('F') || s.documento.toLowerCase().includes('factura'));
                            } else if (comprasFiltroDoc === 'BOLETAS') {
                              purchases = purchases.filter(s => s.documento.toUpperCase().startsWith('B') || s.documento.toLowerCase().includes('boleta'));
                            }
                            if (purchases.length === 0) {
                              return (
                                <tr>
                                  <td colSpan={9} className="py-8 text-center text-slate-400 italic">No hay registros de compras para este periodo.</td>
                                </tr>
                              );
                            }
                            
                            let totalBase = 0;
                            let totalIgv = 0;
                            let totalSol = 0;

                            return (
                              <>
                                {purchases.map(s => {
                                  if (!s.isExtornado) {
                                    totalBase += s.montoBase;
                                    totalIgv += s.igv;
                                    totalSol += s.total;
                                  }
                                  return (
                                    <tr key={s.id} className={`hover:bg-slate-50/40 transition-colors ${s.isExtornado ? 'opacity-40 line-through bg-slate-50/80' : ''}`}>
                                      <td className="py-3 px-3 font-medium text-slate-600">{s.fecha}</td>
                                      <td className="py-3 px-3 font-mono font-bold text-slate-800">{s.documento}</td>
                                      <td className="py-3 px-3 font-semibold text-slate-900">{s.clienteProveedorNombre || s.glosa}</td>
                                      <td className="py-3 px-3 font-mono text-slate-500">{s.rucClienteProveedor}</td>
                                      <td className="py-3 px-3 text-right font-mono font-bold text-slate-700">S/. {s.montoBase.toFixed(2)}</td>
                                      <td className="py-3 px-3 text-right font-mono text-slate-600">S/. {s.igv.toFixed(2)}</td>
                                      <td className="py-3 px-3 text-right font-mono font-black text-slate-900">S/. {s.total.toFixed(2)}</td>
                                      <td className="py-3 px-2 text-center">
                                        <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${s.isExtornado ? 'bg-red-100 text-red-800' : 'bg-indigo-100 text-indigo-850'}`}>
                                          {s.isExtornado ? 'Anulado' : 'Aceptado'}
                                        </span>
                                      </td>
                                      <td className="py-3 px-2 text-center">
                                        {currentUserRole === 'EMPLEADO' ? (
                                          <button 
                                            type="button"
                                            onClick={() => handleRemoveTransaction(s.id)}
                                            className="text-amber-500 hover:text-amber-600 p-1.5 rounded-lg border border-amber-200 bg-amber-50/50 transition-colors cursor-pointer"
                                            title="Acceso Bloqueado: Su rango es Empleado"
                                          >
                                            <Lock className="w-3.5 h-3.5 mx-auto" />
                                          </button>
                                        ) : (
                                          <button 
                                            type="button"
                                            onClick={() => handleRemoveTransaction(s.id)}
                                            className="text-slate-400 hover:text-red-500 p-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-red-50 hover:border-red-200 transition-colors cursor-pointer"
                                            title="Eliminar compra de los libros"
                                          >
                                            <Trash2 className="w-3.5 h-3.5 mx-auto" />
                                          </button>
                                        )}
                                      </td>
                                    </tr>
                                  );
                                })}
                                <tr className="bg-slate-50/80 font-black text-slate-900 border-t border-slate-200">
                                  <td colSpan={4} className="py-3 px-3 text-right uppercase tracking-wider text-[10px]">Totales Acumulados:</td>
                                  <td className="py-3 px-3 text-right font-mono text-slate-950">S/. {totalBase.toFixed(2)}</td>
                                  <td className="py-3 px-3 text-right font-mono text-slate-950">S/. {totalIgv.toFixed(2)}</td>
                                  <td className="py-3 px-3 text-right font-mono text-indigo-700 text-sm">S/. {totalSol.toFixed(2)}</td>
                                  <td></td>
                                  <td></td>
                                </tr>
                              </>
                            );
                          })()}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {selectedDiarioTab === 'mayor' && regimen === 'RMT' && (
                  <div className="space-y-4 animate-fadeIn">
                    {projectedIncomeUIT <= 300 && !bypassUITLock ? (
                      <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 text-center space-y-4 shadow-3xs max-w-2xl mx-auto my-6 animate-fadeIn">
                        <div className="w-16 h-16 bg-indigo-50 text-indigo-650 rounded-full flex items-center justify-center mx-auto text-3xl shadow-sm border border-indigo-100">
                          🔒
                        </div>
                        <div className="space-y-1.5">
                          <span className="text-[10px] bg-indigo-100 text-indigo-850 font-extrabold px-3 py-0.5 rounded-full uppercase tracking-wider font-sans">
                            Tramo 1 (Hasta 300 UIT) — Exonerado
                          </span>
                          <h3 className="text-base font-bold text-slate-800 font-heading">Libro Mayor Auxiliar Completo Reservado</h3>
                          <p className="text-xs text-slate-500 font-sans leading-relaxed">
                            De acuerdo con la normativa oficial de la SUNAT para el **Régimen MYPE Tributario (RMT)**, las empresas con ingresos anuales de hasta 300 UIT no están obligadas a llevar el Libro Mayor.
                          </p>
                        </div>
                        <div className="bg-indigo-50/40 p-4 rounded-2xl border border-indigo-100/50 text-left text-xs text-indigo-900 leading-normal font-sans">
                          💡 **¿Cómo cumplo con SUNAT?** Tu obligación principal queda cubierta de manera 100% legal con el **Libro Diario de Formato Simplificado (LDFS)**, el cual ya agrupa y resume todas tus cuentas en la pestaña correspondiente de forma automática.
                        </div>
                        <p className="text-[10.5px] text-slate-400 italic font-sans">
                          Si deseas habilitar y experimentar con este libro, puedes incrementar tus ingresos proyectados a más de 300 UIT en el menú de configuración lateral.
                        </p>
                      </div>
                    ) : (
                      <>
                        <div className="bg-indigo-50/50 border border-indigo-100 p-4.5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <h3 className="text-xs font-black text-indigo-850 uppercase tracking-wider mb-1">🗂️ Libro Mayor Auxiliar (PCGE Perú)</h3>
                        <p className="text-[11px] text-indigo-750 font-sans">Muestra los cargos (Debe) y abonos (Haber) agrupados por cada cuenta del Plan Contable General Empresarial para determinar sus saldos.</p>
                      </div>

                      {/* Dropdown to select PCGE account */}
                      <div className="space-y-1 shrink-0 w-full sm:w-auto">
                        <label className="text-[9px] font-black text-indigo-900 uppercase block">Seleccionar Cuenta Contable:</label>
                        <select
                          value={selectedMayorCta}
                          onChange={(e) => setSelectedMayorCta(e.target.value)}
                          className="bg-white border border-indigo-200 text-xs font-bold text-slate-800 py-1.5 px-3 rounded-xl focus:ring-2 focus:ring-indigo-500 w-full cursor-pointer"
                        >
                          {(() => {
                            // Extract unique accounts that have entries
                            const uniqueAccounts = Array.from(new Set(allPeriodEntries.map(e => e.cuenta))).sort();
                            if (uniqueAccounts.length === 0) {
                              return <option value="">No hay cuentas con movimientos</option>;
                            }
                            return uniqueAccounts.map(code => {
                              const matchingEntry = allPeriodEntries.find(e => e.cuenta === code);
                              return (
                                <option key={code} value={code}>
                                  {code} - {matchingEntry?.cuentaNombre || 'Cuenta General'}
                                </option>
                              );
                            });
                          })()}
                        </select>
                      </div>
                    </div>

                    {/* Ledger details table */}
                    <div className="overflow-x-auto border border-slate-200 rounded-2xl bg-white">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase font-black tracking-wider text-slate-400">
                            <th className="py-3 px-3">Fecha</th>
                            <th className="py-3 px-3">Asiento / Glosa</th>
                            <th className="py-3 px-3 text-right text-emerald-750">Debe (Cargos)</th>
                            <th className="py-3 px-3 text-right text-indigo-750">Haber (Abonos)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs">
                          {(() => {
                            const entriesForCta = allPeriodEntries.filter(e => e.cuenta === selectedMayorCta);
                            if (entriesForCta.length === 0) {
                              return (
                                <tr>
                                  <td colSpan={4} className="py-8 text-center text-slate-400 italic">No hay movimientos en el Mayor para esta cuenta en este periodo.</td>
                                </tr>
                              );
                            }

                            let sumDebe = 0;
                            let sumHaber = 0;

                            return (
                              <>
                                {entriesForCta.map((e, idx) => {
                                  sumDebe += e.debe;
                                  sumHaber += e.haber;
                                  return (
                                    <tr key={idx} className="hover:bg-slate-50/40 transition-colors font-sans">
                                      <td className="py-3 px-3 font-medium text-slate-500">{period}-15</td>
                                      <td className="py-3 px-3">
                                        <div className="font-bold text-slate-800">{e.glosa}</div>
                                      </td>
                                      <td className="py-3 px-3 text-right font-mono text-emerald-800 font-bold">
                                        {e.debe > 0 ? `S/. ${e.debe.toFixed(2)}` : '-'}
                                      </td>
                                      <td className="py-3 px-3 text-right font-mono text-indigo-800 font-bold">
                                        {e.haber > 0 ? `S/. ${e.haber.toFixed(2)}` : '-'}
                                      </td>
                                    </tr>
                                  );
                                })}
                                <tr className="bg-slate-50 font-black border-t border-slate-200">
                                  <td colSpan={2} className="py-3 px-3 text-right uppercase tracking-wider text-[10px]">Sumas de Mayor:</td>
                                  <td className="py-3 px-3 text-right font-mono text-emerald-800 text-sm">S/. {sumDebe.toFixed(2)}</td>
                                  <td className="py-3 px-3 text-right font-mono text-indigo-800 text-sm">S/. {sumHaber.toFixed(2)}</td>
                                </tr>
                                <tr className="bg-slate-100/50 font-black border-t border-slate-200 text-xs">
                                  <td colSpan={2} className="py-3.5 px-3 text-right uppercase tracking-wider text-[10px] text-slate-500">Saldo Final Determinado:</td>
                                  <td colSpan={2} className="py-3.5 px-3 text-right font-mono font-black text-slate-900 text-sm">
                                    {sumDebe >= sumHaber ? (
                                      <span className="text-emerald-700">Saldo Deudor: S/. {(sumDebe - sumHaber).toFixed(2)}</span>
                                    ) : (
                                      <span className="text-indigo-700">Saldo Acreedor: S/. {(sumHaber - sumDebe).toFixed(2)}</span>
                                    )}
                                  </td>
                                </tr>
                              </>
                            );
                          })()}
                        </tbody>
                      </table>
                    </div>
                      </>
                    )}
                  </div>
                )}

                {selectedDiarioTab === 'balance' && (
                  <div className="space-y-6 animate-fadeIn">
                    {(() => {
                      const entries = allPeriodEntries;
                      
                      // --- ACTIVO ---
                      const cajaBancos = entries
                        .filter(e => e.cuenta.startsWith('10'))
                        .reduce((sum, e) => sum + (e.debe - e.haber), 0);

                      const ctasPorCobrar = entries
                        .filter(e => e.cuenta.startsWith('12'))
                        .reduce((sum, e) => sum + (e.debe - e.haber), 0);

                      const mercaderias = entries
                        .filter(e => e.cuenta.startsWith('20'))
                        .reduce((sum, e) => sum + (e.debe - e.haber), 0);

                      const equiposIntangibles = entries
                        .filter(e => e.cuenta.startsWith('33') || e.cuenta.startsWith('34'))
                        .reduce((sum, e) => sum + (e.debe - e.haber), 0);

                      // Split IGV into credit or debit
                      const igvDebito = entries
                        .filter(e => e.cuenta === '40111')
                        .reduce((sum, e) => sum + e.haber, 0);

                      const igvCredito = entries
                        .filter(e => e.cuenta === '40111')
                        .reduce((sum, e) => sum + e.debe, 0);

                      const netIGV = igvDebito - igvCredito;
                      const impuestosPorCobrar = netIGV < 0 ? -netIGV : 0;
                      const igvPorPagar = netIGV > 0 ? netIGV : 0;

                      const otrosTributos = entries
                        .filter(e => e.cuenta.startsWith('40') && e.cuenta !== '40111')
                        .reduce((sum, e) => sum + (e.haber - e.debe), 0);

                      const tributos = igvPorPagar + otrosTributos;

                      const planillas = entries
                        .filter(e => e.cuenta.startsWith('41'))
                        .reduce((sum, e) => sum + (e.haber - e.debe), 0);

                      const ctasPorPagar = entries
                        .filter(e => e.cuenta.startsWith('42'))
                        .reduce((sum, e) => sum + (e.haber - e.debe), 0);

                      // --- PATRIMONIO ---
                      const capitalSocial = entries
                        .filter(e => e.cuenta.startsWith('50'))
                        .reduce((sum, e) => sum + (e.haber - e.debe), 0);

                      const resultadosAcumulados = entries
                        .filter(e => e.cuenta.startsWith('59'))
                        .reduce((sum, e) => sum + (e.haber - e.debe), 0);

                      const ingresos = entries
                        .filter(e => e.cuenta.startsWith('7'))
                        .reduce((sum, e) => sum + (e.haber - e.debe), 0);

                      const gastos = entries
                        .filter(e => e.cuenta.startsWith('6') || e.cuenta.startsWith('9'))
                        .reduce((sum, e) => sum + (e.debe - e.haber), 0);

                      const utilidadNeto = ingresos - gastos;

                      // --- DYNAMIC SIMULATION ENGINE ---
                      let cajaBancosSim = cajaBancos;
                      let ctasPorCobrarSim = ctasPorCobrar;
                      let mercaderiasSim = mercaderias;
                      let equiposIntangiblesSim = equiposIntangibles;
                      let impuestosPorCobrarSim = impuestosPorCobrar;
                      let tributosSim = tributos;
                      let planillasSim = planillas;
                      let ctasPorPagarSim = ctasPorPagar;
                      let capitalSocialSim = capitalSocial;
                      let resultadosAcumuladosSim = resultadosAcumulados;
                      let ingresosSim = ingresos;
                      let gastosSim = gastos;

                      if (simulatedAction === 'VENTA_EFECTIVO') {
                        cajaBancosSim += 2000;
                        ingresosSim += 1694.92;
                        const simNetIGV = (igvDebito + 305.08) - igvCredito;
                        if (simNetIGV < 0) {
                          impuestosPorCobrarSim = -simNetIGV;
                          tributosSim = otrosTributos;
                        } else {
                          impuestosPorCobrarSim = 0;
                          tributosSim = simNetIGV + otrosTributos;
                        }
                      } else if (simulatedAction === 'COMPRA_CREDITO') {
                        mercaderiasSim += 847.46;
                        const simNetIGV = igvDebito - (igvCredito + 152.54);
                        if (simNetIGV < 0) {
                          impuestosPorCobrarSim = -simNetIGV;
                          tributosSim = otrosTributos;
                        } else {
                          impuestosPorCobrarSim = 0;
                          tributosSim = simNetIGV + otrosTributos;
                        }
                        ctasPorPagarSim += 1000;
                      } else if (simulatedAction === 'COBRO_EFECTIVO') {
                        cajaBancosSim += 500;
                        ctasPorCobrarSim -= 500;
                      } else if (simulatedAction === 'PAGO_IMPUESTOS') {
                        cajaBancosSim -= 300;
                        if (tributosSim >= 300) {
                          tributosSim -= 300;
                        } else {
                          const diff = 300 - tributosSim;
                          tributosSim = 0;
                          impuestosPorCobrarSim += diff;
                        }
                      }

                      const utilidadNetoSim = ingresosSim - gastosSim;
                      const totalActivosSim = cajaBancosSim + ctasPorCobrarSim + mercaderiasSim + equiposIntangiblesSim + impuestosPorCobrarSim;
                      const totalPasivosSim = tributosSim + planillasSim + ctasPorPagarSim;
                      const totalPatrimonioSim = capitalSocialSim + resultadosAcumuladosSim + utilidadNetoSim;
                      const totalPasivoYPatrimonioSim = totalPasivosSim + totalPatrimonioSim;
                      const balancesCuadranSim = Math.abs(totalActivosSim - totalPasivoYPatrimonioSim) < 0.01;

                      // Calculate percentages for the stacked visualization chart
                      const sumTotal = totalActivosSim + totalPasivoYPatrimonioSim;
                      const pctActivos = sumTotal > 0 ? (totalActivosSim / sumTotal) * 100 : 50;
                      const pctPasivosYPat = sumTotal > 0 ? (totalPasivoYPatrimonioSim / sumTotal) * 100 : 50;

                      // Financial Health Score & Traffic Light Indicator
                      let healthBadge = "🟢 EXCELENTE SALUD";
                      let healthColor = "border-emerald-200 bg-emerald-50 text-emerald-900";
                      let healthDot = "bg-emerald-500";
                      let healthAdvice = "Tus pertenencias e inversión propia superan ampliamente las deudas comerciales de tu empresa. ¡Tu negocio se encuentra en una situación contable magnífica!";
                      
                      if (totalPasivosSim > totalActivosSim) {
                        healthBadge = "🔴 ALERTA DE DEUDA ALTA";
                        healthColor = "border-rose-200 bg-rose-50 text-rose-900";
                        healthDot = "bg-rose-500";
                        healthAdvice = "Cuidado: Tus compromisos de pago con terceros superan el total de tus bienes actuales. Recomendamos impulsar tus ventas al contado o refinanciar deudas con proveedores.";
                      } else if (totalPasivosSim > 0 && (totalPasivosSim / (totalActivosSim || 1)) > 0.6) {
                        healthBadge = "🟡 DEUDA MODERADA";
                        healthColor = "border-amber-200 bg-amber-50 text-amber-900";
                        healthDot = "bg-amber-500";
                        healthAdvice = "Tus deudas financian más del 60% de tus activos. Intenta liquidar tus cuentas por cobrar pendientes para robustecer tu liquidez inmediata en caja y banco.";
                      }

                      return (
                        <>
                          {/* REGIME TIP FOR SPECIAL REGIME */}
                          {regimen === 'RER' && (
                            <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl text-xs animate-fadeIn shadow-xs">
                              <div className="font-bold text-amber-850 uppercase tracking-wide flex items-center gap-2 mb-1">
                                <Info className="w-4 h-4 text-amber-600" />
                                <span>💡 Nota Tributaria del Régimen Especial (RER)</span>
                              </div>
                              <p className="text-amber-800 leading-relaxed font-sans">
                                {modoSencillo 
                                  ? "La SUNAT no te exige presentar un Balance General oficial en el régimen RER. Sin embargo, te lo mostramos de forma interactiva para que puedas ver el semáforo financiero de tu negocio y tomar mejores decisiones diarias."
                                  : "De acuerdo a la normativa de SUNAT, las empresas en el Régimen Especial (RER) solo tienen la obligación de llevar el Registro de Compras y Ventas. No obstante, te compilamos este balance de gestión para ayudarte en el control financiero."}
                              </p>
                            </div>
                          )}

                          {/* INTERACTIVE DECISION SIMULATOR PANEL */}
                          <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-md border border-slate-800 space-y-4">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-800 pb-3">
                              <div>
                                <span className="text-[9px] bg-indigo-500/30 text-indigo-300 font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider block w-fit mb-1">
                                  PLANIFICACIÓN Y PREVISIÓN
                                </span>
                                <h3 className="text-base font-bold font-heading text-white flex items-center gap-1.5">
                                  <span>💡 Planificador de Escenarios y Decisiones</span>
                                </h3>
                              </div>
                              <span className="text-[11px] text-slate-400 font-sans">
                                Haz clic en una acción para ver cómo impacta en tu Balance en tiempo real:
                              </span>
                            </div>

                            {/* Simulation Preset Buttons */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2.5">
                              <button
                                type="button"
                                onClick={() => setSimulatedAction(simulatedAction === 'VENTA_EFECTIVO' ? null : 'VENTA_EFECTIVO')}
                                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer text-xs flex flex-col justify-between h-18 ${
                                  simulatedAction === 'VENTA_EFECTIVO'
                                    ? 'bg-emerald-950 border-emerald-500 text-emerald-200 ring-2 ring-emerald-500/20'
                                    : 'bg-slate-850 hover:bg-slate-800 border-slate-800 text-slate-300'
                                }`}
                              >
                                <span className="font-bold flex items-center gap-1">🟢 Venta Contado</span>
                                <span className="text-[10px] text-slate-400 font-sans">Cobrar S/. 2,000</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => setSimulatedAction(simulatedAction === 'COMPRA_CREDITO' ? null : 'COMPRA_CREDITO')}
                                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer text-xs flex flex-col justify-between h-18 ${
                                  simulatedAction === 'COMPRA_CREDITO'
                                    ? 'bg-indigo-950 border-indigo-500 text-indigo-200 ring-2 ring-indigo-500/20'
                                    : 'bg-slate-850 hover:bg-slate-800 border-slate-800 text-slate-300'
                                }`}
                              >
                                <span className="font-bold flex items-center gap-1">🔵 Compra Crédito</span>
                                <span className="text-[10px] text-slate-400 font-sans">Fiar S/. 1,000 stock</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => setSimulatedAction(simulatedAction === 'COBRO_EFECTIVO' ? null : 'COBRO_EFECTIVO')}
                                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer text-xs flex flex-col justify-between h-18 ${
                                  simulatedAction === 'COBRO_EFECTIVO'
                                    ? 'bg-teal-950 border-teal-500 text-teal-200 ring-2 ring-teal-500/20'
                                    : 'bg-slate-850 hover:bg-slate-800 border-slate-800 text-slate-300'
                                }`}
                              >
                                <span className="font-bold flex items-center gap-1">🪙 Cobrar Deuda</span>
                                <span className="text-[10px] text-slate-400 font-sans">Recibir S/. 500 de clientes</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => setSimulatedAction(simulatedAction === 'PAGO_IMPUESTOS' ? null : 'PAGO_IMPUESTOS')}
                                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer text-xs flex flex-col justify-between h-18 ${
                                  simulatedAction === 'PAGO_IMPUESTOS'
                                    ? 'bg-rose-950 border-rose-500 text-rose-200 ring-2 ring-rose-500/20'
                                    : 'bg-slate-850 hover:bg-slate-800 border-slate-800 text-slate-300'
                                }`}
                              >
                                <span className="font-bold flex items-center gap-1">💸 Pagar Impuestos</span>
                                <span className="text-[10px] text-slate-400 font-sans">Pagar S/. 300 a SUNAT</span>
                              </button>

                              <button
                                type="button"
                                disabled={!simulatedAction}
                                onClick={() => setSimulatedAction(null)}
                                className={`p-2.5 rounded-xl border transition-all text-xs flex flex-col justify-center items-center h-18 font-bold ${
                                  simulatedAction
                                    ? 'bg-white hover:bg-slate-100 text-slate-950 border-white cursor-pointer'
                                    : 'bg-slate-850/50 text-slate-600 border-slate-850 cursor-not-allowed'
                                }`}
                              >
                                <RefreshCw className={`w-4 h-4 mb-1 ${simulatedAction ? 'animate-spin-slow text-slate-800' : 'text-slate-600'}`} />
                                <span>Restablecer</span>
                              </button>
                            </div>

                            {/* Simulation Explanation feedback box */}
                            {simulatedAction && (
                              <div className="bg-slate-850/80 border border-slate-800/80 rounded-2xl p-4.5 text-xs text-slate-200 space-y-1.5 animate-fadeIn">
                                <div className="font-bold text-yellow-400 flex items-center gap-1">
                                  <span>✨ Análisis del escenario proyectado:</span>
                                </div>
                                {simulatedAction === 'VENTA_EFECTIVO' && (
                                  <p className="leading-relaxed">
                                    Al vender **S/. 2,000 en efectivo**: Tu saldo de banco sube en **S/. 2,000**, tu ganancia libre sube en **S/. 1,694.92** (después de deducir el 18% de IGV que guardas) y tus impuestos pendientes suben en **S/. 305.08**. Tu patrimonio neto aumenta inmediatamente gracias a tus ganancias de venta.
                                  </p>
                                )}
                                {simulatedAction === 'COMPRA_CREDITO' && (
                                  <p className="leading-relaxed">
                                    Al comprar **S/. 1,000 de mercadería al crédito**: Tus existencias en almacén aumentan en **S/. 847.46**, tus deudas por pagar a proveedores suben en **S/. 1,000**, y el IGV pagado te genera un crédito fiscal a favor de **S/. 152.54** (reduciendo tus deudas con SUNAT). Tu balance sigue en perfecto equilibrio porque incrementas un bien (activo) a cambio de una promesa de pago futura (deuda).
                                  </p>
                                )}
                                {simulatedAction === 'COBRO_EFECTIVO' && (
                                  <p className="leading-relaxed">
                                    Al cobrar **S/. 500 que te debían**: Tu efectivo en banco aumenta en **S/. 500** y tus cuentas pendientes por cobrar a clientes se reducen en **S/. 500**. Esto no altera tus ganancias netas directas porque la venta ya se había realizado antes, pero mejora enormemente tu caja para pagar las facturas de hoy.
                                  </p>
                                )}
                                {simulatedAction === 'PAGO_IMPUESTOS' && (
                                  <p className="leading-relaxed">
                                    Al pagar **S/. 300 de impuestos**: Tu efectivo en banco se reduce en **S/. 300** y tu deuda pendiente con SUNAT se reduce en **S/. 300** por igual monto. La balanza se mantiene cuadrada porque disminuyes un activo para saldar una obligación del pasivo.
                                  </p>
                                )}
                              </div>
                            )}
                          </div>

                          {/* FINANCIAL HEALTH & TRAFFIC LIGHT CARD */}
                          <div className={`border rounded-3xl p-5 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-fadeIn ${healthColor}`}>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className={`w-3 h-3 rounded-full animate-pulse ${healthDot}`}></span>
                                <span className="font-extrabold text-[11px] tracking-widest uppercase">{healthBadge}</span>
                              </div>
                              <h4 className="font-bold text-sm font-heading">
                                {modoSencillo ? "Semáforo Financiero de tu Negocio" : "Evaluación de Solvencia y Apalancamiento"}
                              </h4>
                              <p className="text-xs opacity-90 leading-relaxed font-sans max-w-xl">
                                {healthAdvice}
                              </p>
                            </div>
                            <div className="bg-white/40 border border-white/20 p-3 rounded-2xl text-center shrink-0 w-full md:w-fit">
                              <span className="text-[9px] block font-bold uppercase opacity-75">Tasa de Deuda Actual:</span>
                              <span className="text-lg font-black font-mono">
                                {((totalPasivosSim / (totalActivosSim || 1)) * 100).toFixed(0)}%
                              </span>
                              <span className="text-[9.5px] block text-slate-500 font-sans mt-0.5">Financiado por deudas</span>
                            </div>
                          </div>

                          {/* VISUAL COMPOSITION BAR CHART (PROPORTIONAL SECTIONS) */}
                          <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs space-y-3.5">
                            <div className="flex justify-between items-center text-xs">
                              <div>
                                <h4 className="font-bold font-heading text-slate-800">Visualización de Equilibrio Contable</h4>
                                <p className="text-[10px] text-slate-400 font-sans">Cada sol que posee tu negocio está financiado por deudas o tu propio capital</p>
                              </div>
                              {balancesCuadranSim ? (
                                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2.5 py-1 rounded-xl flex items-center gap-1 font-sans">
                                  <Check className="w-3.5 h-3.5 stroke-[3]" /> Balanza Cuadrada
                                </span>
                              ) : (
                                <span className="bg-amber-100 text-amber-800 text-[10px] font-black px-2.5 py-1 rounded-xl flex items-center gap-1 font-sans animate-pulse">
                                  <AlertCircle className="w-3.5 h-3.5" /> Diferencia Temporal
                                </span>
                              )}
                            </div>

                            {/* Stacked Proportional Bar */}
                            <div className="space-y-1.5">
                              <div className="w-full h-4.5 bg-slate-100 rounded-xl overflow-hidden flex shadow-inner">
                                <div 
                                  className="bg-emerald-500 hover:bg-emerald-600 transition-all duration-500 relative group flex items-center justify-center text-[9px] font-black text-white"
                                  style={{ width: `${pctActivos}%` }}
                                  title="Tus Recursos (Activos)"
                                >
                                  Activos
                                </div>
                                <div 
                                  className="bg-amber-500 hover:bg-amber-600 transition-all duration-500 relative group flex items-center justify-center text-[9px] font-black text-white"
                                  style={{ width: `${pctPasivosYPat * (totalPasivosSim / (totalPasivoYPatrimonioSim || 1))}%` }}
                                  title="Tus Deudas (Pasivos)"
                                >
                                  Deudas
                                </div>
                                <div 
                                  className="bg-indigo-600 hover:bg-indigo-700 transition-all duration-500 relative group flex items-center justify-center text-[9px] font-black text-white"
                                  style={{ width: `${pctPasivosYPat * (totalPatrimonioSim / (totalPasivoYPatrimonioSim || 1))}%` }}
                                  title="Tu Inversión y Ganancias (Patrimonio)"
                                >
                                  Suyo
                                </div>
                              </div>
                              <div className="flex justify-between text-[9.5px] font-extrabold text-slate-400 font-mono uppercase tracking-wider">
                                <span className="text-emerald-600">Lo que tienes: S/. {totalActivosSim.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</span>
                                <span className="text-indigo-600">Deudas + Capital: S/. {totalPasivoYPatrimonioSim.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</span>
                              </div>
                            </div>
                          </div>

                          {/* BENTO COLUMN CARDS - DUAL COLUMN VIEW */}
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            
                            {/* LEFT SIDE: ACTIVO (RESOURCES) */}
                            <div className="bg-white border border-slate-200 rounded-3xl p-5 space-y-4 shadow-sm flex flex-col justify-between">
                              <div>
                                <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-2">
                                  <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-lg bg-emerald-500 text-white flex items-center justify-center text-xs">📂</div>
                                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                                      {modoSencillo ? "Lo que tienes en el negocio (Activos)" : "RECURSOS Y BIENES (TOTAL ACTIVO)"}
                                    </h4>
                                  </div>
                                  <span className="text-xs bg-emerald-100 text-emerald-800 font-extrabold px-2.5 py-1 rounded-xl font-mono">
                                    S/. {totalActivosSim.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                                  </span>
                                </div>

                                <div className="space-y-2.5 text-xs">
                                  {/* Caja y Bancos Card */}
                                  <div className="flex justify-between items-start p-3 hover:bg-slate-50 rounded-2xl transition-all border border-slate-100 shadow-3xs">
                                    <div className="flex items-start gap-2.5">
                                      <div className="text-lg mt-0.5 bg-slate-50 w-7 h-7 rounded-lg flex items-center justify-center border border-slate-100">🏦</div>
                                      <div>
                                        <div className="font-bold text-slate-800 flex items-center gap-1.5">
                                          <span>{modoSencillo ? "Efectivo y Bancos" : "Caja y Bancos (Cta. 10)"}</span>
                                          {simulatedAction && (simulatedAction === 'VENTA_EFECTIVO' || simulatedAction === 'COBRO_EFECTIVO' || simulatedAction === 'PAGO_IMPUESTOS') && (
                                            <span className="text-[8.5px] bg-yellow-100 text-yellow-800 px-1.5 rounded-full font-sans font-bold uppercase tracking-wider">Proyectado</span>
                                          )}
                                        </div>
                                        <p className="text-[10px] text-slate-400 font-sans leading-relaxed mt-0.5 max-w-[240px]">
                                          {modoSencillo 
                                            ? "Dinero físico en caja de la tienda y en tu cuenta de banco." 
                                            : "Saldos monetarios de Caja general (101) y Cuentas corrientes (1041)."}
                                        </p>
                                      </div>
                                    </div>
                                    <span className="font-mono font-bold text-slate-900 text-right mt-1">
                                      S/. {cajaBancosSim.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                                    </span>
                                  </div>

                                  {/* Cuentas por Cobrar Card */}
                                  <div className="flex justify-between items-start p-3 hover:bg-slate-50 rounded-2xl transition-all border border-slate-100 shadow-3xs">
                                    <div className="flex items-start gap-2.5">
                                      <div className="text-lg mt-0.5 bg-slate-50 w-7 h-7 rounded-lg flex items-center justify-center border border-slate-100">📝</div>
                                      <div>
                                        <div className="font-bold text-slate-800 flex items-center gap-1.5">
                                          <span>{modoSencillo ? "Dinero por Cobrar" : "Clientes por Cobrar (Cta. 12)"}</span>
                                          {simulatedAction && (simulatedAction === 'COBRO_EFECTIVO') && (
                                            <span className="text-[8.5px] bg-yellow-100 text-yellow-800 px-1.5 rounded-full font-sans font-bold uppercase tracking-wider">Proyectado</span>
                                          )}
                                        </div>
                                        <p className="text-[10px] text-slate-400 font-sans leading-relaxed mt-0.5 max-w-[240px]">
                                          {modoSencillo 
                                            ? "Ventas o servicios que entregaste y que te pagarán después." 
                                            : "Facturas comerciales pendientes de cobro emitidas al crédito (1212)."}
                                        </p>
                                      </div>
                                    </div>
                                    <span className="font-mono font-bold text-slate-900 text-right mt-1">
                                      S/. {ctasPorCobrarSim.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                                    </span>
                                  </div>

                                  {/* Mercaderías Card */}
                                  <div className="flex justify-between items-start p-3 hover:bg-slate-50 rounded-2xl transition-all border border-slate-100 shadow-3xs">
                                    <div className="flex items-start gap-2.5">
                                      <div className="text-lg mt-0.5 bg-slate-50 w-7 h-7 rounded-lg flex items-center justify-center border border-slate-100">📦</div>
                                      <div>
                                        <div className="font-bold text-slate-800 flex items-center gap-1.5">
                                          <span>{modoSencillo ? "Mercadería en Stock" : "Almacén e Inventario (Cta. 20)"}</span>
                                          {simulatedAction && (simulatedAction === 'COMPRA_CREDITO') && (
                                            <span className="text-[8.5px] bg-yellow-100 text-yellow-800 px-1.5 rounded-full font-sans font-bold uppercase tracking-wider">Proyectado</span>
                                          )}
                                        </div>
                                        <p className="text-[10px] text-slate-400 font-sans leading-relaxed mt-0.5 max-w-[240px]">
                                          {modoSencillo 
                                            ? "El valor de tus productos en almacén listos para la venta." 
                                            : "Existencias comerciales valuadas a su costo inicial de adquisición (20111)."}
                                        </p>
                                      </div>
                                    </div>
                                    <span className="font-mono font-bold text-slate-900 text-right mt-1">
                                      S/. {mercaderiasSim.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                                    </span>
                                  </div>

                                  {/* Equipos y Licencias Card */}
                                  <div className="flex justify-between items-start p-3 hover:bg-slate-50 rounded-2xl transition-all border border-slate-100 shadow-3xs">
                                    <div className="flex items-start gap-2.5">
                                      <div className="text-lg mt-0.5 bg-slate-50 w-7 h-7 rounded-lg flex items-center justify-center border border-slate-100">💻</div>
                                      <div>
                                        <div className="font-bold text-slate-800">
                                          <span>{modoSencillo ? "Equipos, Laptops y Licencias" : "Activos Fijos e Intangibles (Cta. 33/34)"}</span>
                                        </div>
                                        <p className="text-[10px] text-slate-400 font-sans leading-relaxed mt-0.5 max-w-[240px]">
                                          {modoSencillo 
                                            ? "Laptops, servidores, software o licencias que usa tu negocio." 
                                            : "Adquisiciones de propiedad, planta, equipos (33) e intangibles (34)."}
                                        </p>
                                      </div>
                                    </div>
                                    <span className="font-mono font-bold text-slate-900 text-right mt-1">
                                      S/. {equiposIntangiblesSim.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                                    </span>
                                  </div>

                                  {/* Impuestos por Cobrar (Crédito Fiscal IGV) Card */}
                                  {impuestosPorCobrarSim > 0 && (
                                    <div className="flex justify-between items-start p-3 bg-emerald-50/40 hover:bg-emerald-50 rounded-2xl transition-all border border-emerald-100 shadow-3xs animate-fadeIn">
                                      <div className="flex items-start gap-2.5">
                                        <div className="text-lg mt-0.5 bg-emerald-100/50 w-7 h-7 rounded-lg flex items-center justify-center border border-emerald-100 text-emerald-700">⚖️</div>
                                        <div>
                                          <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                                            <span>{modoSencillo ? "Crédito Fiscal a Favor (IGV)" : "Impuestos por Cobrar (Cta. 40 - Crédito)"}</span>
                                            <span className="text-[8.5px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full font-sans font-bold uppercase tracking-wider">Activo</span>
                                          </div>
                                          <p className="text-[10px] text-emerald-600/80 font-sans leading-relaxed mt-0.5 max-w-[240px]">
                                            {modoSencillo 
                                              ? "IGV de tus compras que supera al de tus ventas; te sirve para no pagar IGV en los próximos meses." 
                                              : "Saldo a favor del Crédito Fiscal del IGV (40111) acumulado por compras."}
                                          </p>
                                        </div>
                                      </div>
                                      <span className="font-mono font-bold text-emerald-700 text-right mt-1">
                                        S/. {impuestosPorCobrarSim.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="bg-emerald-50 text-emerald-950 p-3.5 rounded-2xl flex justify-between items-center font-bold font-sans text-xs mt-4 border border-emerald-100 shadow-3xs">
                                <span>{modoSencillo ? "Total de recursos de tu empresa:" : "TOTAL ACTIVOS:"}</span>
                                <span className="font-mono text-sm font-black text-emerald-900">S/. {totalActivosSim.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</span>
                              </div>
                            </div>

                            {/* RIGHT SIDE: PASIVO & PATRIMONIO (LIABILITIES & EQUITY) */}
                            <div className="bg-white border border-slate-200 rounded-3xl p-5 space-y-4 shadow-sm flex flex-col justify-between">
                              <div>
                                <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-2">
                                  <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-lg bg-indigo-650 text-white flex items-center justify-center text-xs">🏛️</div>
                                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                                      {modoSencillo ? "Lo que debes + Tu inversión (Pasivo y Pat.)" : "FUENTES DE FINANCIAMIENTO (PASIVO + PATR.)"}
                                    </h4>
                                  </div>
                                  <span className="text-xs bg-indigo-100 text-indigo-850 font-extrabold px-2.5 py-1 rounded-xl font-mono">
                                    S/. {totalPasivoYPatrimonioSim.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                                  </span>
                                </div>

                                <div className="space-y-4 text-xs">
                                  {/* SECCIÓN PASIVOS */}
                                  <div className="space-y-2">
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">
                                      {modoSencillo ? "Deudas con otras personas (Pasivos)" : "OBLIGACIONES CORRIENTES (PASIVO)"}
                                    </span>

                                    {/* Impuestos Card */}
                                    <div className="flex justify-between items-start p-3 hover:bg-slate-50 rounded-2xl transition-all border border-slate-100 shadow-3xs">
                                      <div className="flex items-start gap-2.5">
                                        <div className="text-lg mt-0.5 bg-slate-50 w-7 h-7 rounded-lg flex items-center justify-center border border-slate-100">💸</div>
                                        <div>
                                          <div className="font-bold text-slate-800 flex items-center gap-1.5">
                                            <span>{modoSencillo ? "Impuestos SUNAT" : "Tributos por Pagar (Cta. 40)"}</span>
                                            {simulatedAction && (simulatedAction === 'VENTA_EFECTIVO' || simulatedAction === 'COMPRA_CREDITO' || simulatedAction === 'PAGO_IMPUESTOS') && (
                                              <span className="text-[8.5px] bg-yellow-100 text-yellow-800 px-1.5 rounded-full font-sans font-bold uppercase tracking-wider">Proyectado</span>
                                            )}
                                          </div>
                                          <p className="text-[10px] text-slate-400 font-sans leading-relaxed mt-0.5 max-w-[240px]">
                                            {modoSencillo 
                                              ? "Tus impuestos de IGV y pagos a cuenta de Renta calculados." 
                                              : "Impuesto General a las Ventas (40111) y Renta a pagar."}
                                          </p>
                                        </div>
                                      </div>
                                      <span className="font-mono font-bold text-slate-900 text-right mt-1">
                                        S/. {tributosSim.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                                      </span>
                                    </div>

                                    {/* Sueldos Card */}
                                    <div className="flex justify-between items-start p-3 hover:bg-slate-50 rounded-2xl transition-all border border-slate-100 shadow-3xs">
                                      <div className="flex items-start gap-2.5">
                                        <div className="text-lg mt-0.5 bg-slate-50 w-7 h-7 rounded-lg flex items-center justify-center border border-slate-100">🧑‍🤝‍🧑</div>
                                        <div>
                                          <div className="font-bold text-slate-800">
                                            {modoSencillo ? "Sueldos por Pagar" : "Remuneraciones por Pagar (Cta. 41)"}
                                          </div>
                                          <p className="text-[10px] text-slate-400 font-sans leading-relaxed mt-0.5 max-w-[240px]">
                                            {modoSencillo 
                                              ? "Planillas de tu personal que quedan pendientes de pago." 
                                              : "Sueldos de trabajadores pendientes de desembolso (4111)."}
                                          </p>
                                        </div>
                                      </div>
                                      <span className="font-mono font-bold text-slate-900 text-right mt-1">
                                        S/. {planillasSim.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                                      </span>
                                    </div>

                                    {/* Proveedores Card */}
                                    <div className="flex justify-between items-start p-3 hover:bg-slate-50 rounded-2xl transition-all border border-slate-100 shadow-3xs">
                                      <div className="flex items-start gap-2.5">
                                        <div className="text-lg mt-0.5 bg-slate-50 w-7 h-7 rounded-lg flex items-center justify-center border border-slate-100">🚚</div>
                                        <div>
                                          <div className="font-bold text-slate-800 flex items-center gap-1.5">
                                            <span>{modoSencillo ? "Deudas a Proveedores" : "Cuentas por Pagar (Cta. 42)"}</span>
                                            {simulatedAction && (simulatedAction === 'COMPRA_CREDITO') && (
                                              <span className="text-[8.5px] bg-yellow-100 text-yellow-800 px-1.5 rounded-full font-sans font-bold uppercase tracking-wider">Proyectado</span>
                                            )}
                                          </div>
                                          <p className="text-[10px] text-slate-400 font-sans leading-relaxed mt-0.5 max-w-[240px]">
                                            {modoSencillo 
                                              ? "Facturas de compras al crédito pendientes de cancelar." 
                                              : "Facturas y boletas comerciales por pagar a proveedores (4212)."}
                                          </p>
                                        </div>
                                      </div>
                                      <span className="font-mono font-bold text-slate-900 text-right mt-1">
                                        S/. {ctasPorPagarSim.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                                      </span>
                                    </div>
                                  </div>

                                  {/* SECCIÓN PATRIMONIO */}
                                  <div className="space-y-2 pt-3.5 border-t border-slate-100">
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">
                                      {modoSencillo ? "Tus recursos propios (Patrimonio)" : "PATRIMONIO NETO"}
                                    </span>

                                    {/* Capital Social Card */}
                                    <div className="flex justify-between items-start p-3 hover:bg-slate-50 rounded-2xl transition-all border border-slate-100 shadow-3xs">
                                      <div className="flex items-start gap-2.5">
                                        <div className="text-lg mt-0.5 bg-slate-50 w-7 h-7 rounded-lg flex items-center justify-center border border-slate-100">💰</div>
                                        <div>
                                          <div className="font-bold text-slate-800">
                                            {modoSencillo ? "Aporte de Socios / Capital" : "Capital Social (Cta. 50)"}
                                          </div>
                                          <p className="text-[10px] text-slate-400 font-sans leading-relaxed mt-0.5 max-w-[240px]">
                                            {modoSencillo 
                                              ? "Tu inversión inicial aportada al abrir el negocio formalmente." 
                                              : "Inversión inicial o capital escriturado por los socios (5011)."}
                                          </p>
                                        </div>
                                      </div>
                                      <span className="font-mono font-bold text-slate-900 text-right mt-1">
                                        S/. {capitalSocialSim.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                                      </span>
                                    </div>

                                    {/* Resultados Acumulados Card */}
                                    <div className="flex justify-between items-start p-3 hover:bg-slate-50 rounded-2xl transition-all border border-slate-100 shadow-3xs">
                                      <div className="flex items-start gap-2.5">
                                        <div className="text-lg mt-0.5 bg-slate-50 w-7 h-7 rounded-lg flex items-center justify-center border border-slate-100">⚖️</div>
                                        <div>
                                          <div className="font-bold text-slate-800">
                                            {modoSencillo ? "Resultados Acumulados / Dividendos" : "Resultados Acumulados (Cta. 59)"}
                                          </div>
                                          <p className="text-[10px] text-slate-400 font-sans leading-relaxed mt-0.5 max-w-[240px]">
                                            {modoSencillo 
                                              ? "Utilidades de años anteriores o retiros de socios realizados directamente." 
                                              : "Resultados acumulados de periodos anteriores y efectos de retiros de dividendos (5911/592)."}
                                          </p>
                                        </div>
                                      </div>
                                      <span className="font-mono font-bold text-slate-900 text-right mt-1">
                                        S/. {resultadosAcumuladosSim.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                                      </span>
                                    </div>

                                    {/* Utilidad Card */}
                                    <div className="flex justify-between items-start p-3 hover:bg-slate-50 rounded-2xl transition-all border border-slate-100 shadow-3xs animate-pulseFast">
                                      <div className="flex items-start gap-2.5">
                                        <div className="text-lg mt-0.5 bg-slate-50 w-7 h-7 rounded-lg flex items-center justify-center border border-slate-100">📈</div>
                                        <div>
                                          <div className="font-bold text-slate-800 flex items-center gap-1.5">
                                            <span>{modoSencillo ? "Tus Ganancias Libres" : "Utilidad neta del periodo"}</span>
                                            {simulatedAction && (simulatedAction === 'VENTA_EFECTIVO') && (
                                              <span className="text-[8.5px] bg-yellow-100 text-yellow-800 px-1.5 rounded-full font-sans font-bold uppercase tracking-wider">Proyectado</span>
                                            )}
                                          </div>
                                          <p className="text-[10px] text-slate-400 font-sans leading-relaxed mt-0.5 max-w-[240px]">
                                            {modoSencillo 
                                              ? "Ganancia neta acumulada de tus ventas menos tus gastos de este mes." 
                                              : "Sincronización de Ingresos (70) menos Gastos (6x/9x) calculada."}
                                          </p>
                                        </div>
                                      </div>
                                      <span className="font-mono font-bold text-emerald-600 text-right mt-1 text-sm">
                                        S/. {utilidadNetoSim.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="bg-indigo-50 text-indigo-950 p-3.5 rounded-2xl flex justify-between items-center font-bold font-sans text-xs mt-4 border border-indigo-100 shadow-3xs">
                                <span>{modoSencillo ? "Total de deudas más capital:" : "TOTAL PASIVO + PATRIMONIO:"}</span>
                                <span className="font-mono text-sm font-black text-indigo-900">S/. {totalPasivoYPatrimonioSim.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</span>
                              </div>
                            </div>

                          </div>

                          {/* BOTÓN COLAPSABLE PARA VER DETALLES CONTABLES TÉCNICOS */}
                          <div className="pt-4 border-t border-slate-200">
                            <button
                              type="button"
                              onClick={() => setVerHojaTrabajoContable(!verHojaTrabajoContable)}
                              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 px-4 rounded-xl flex justify-between items-center transition-all cursor-pointer text-xs font-bold"
                            >
                              <span className="flex items-center gap-2">
                                <BookOpen className="w-4 h-4 text-slate-500" />
                                {modoSencillo 
                                  ? (verHojaTrabajoContable ? "🔼 Ocultar detalles del Plan Contable (PCGE)" : "📖 Ver Detalles Técnicos Contables del Plan General (PCGE)") 
                                  : (verHojaTrabajoContable ? "🔼 Ocultar Balance de Comprobación Técnico" : "📊 Ver Balance de Comprobación y Hoja de Trabajo Contable")}
                              </span>
                              {verHojaTrabajoContable ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>

                            {verHojaTrabajoContable && (
                              <div className="mt-4 space-y-4 animate-fadeIn">
                                <div className="bg-indigo-50/50 border border-indigo-100 p-4.5 rounded-2xl">
                                  <h3 className="text-xs font-black text-indigo-850 uppercase tracking-wider mb-1">📊 Hoja de Trabajo y Balance de Comprobación MYPE / RER</h3>
                                  <p className="text-[11px] text-indigo-700 font-sans">Muestra la sumatoria acumulada de cargos (Debe), abonos (Haber) y saldos netos por cada cuenta analítica del Plan Contable General de Perú. Garantiza concordancia exacta por doble entrada.</p>
                                </div>

                                <div className="overflow-x-auto border border-slate-200 rounded-2xl bg-white">
                                  <table className="w-full text-left border-collapse min-w-[700px]">
                                    <thead>
                                      <tr className="bg-slate-50 border-b border-slate-200 text-[9px] uppercase font-black tracking-wider text-slate-400">
                                        <th className="py-3 px-3">Código</th>
                                        <th className="py-3 px-3">Cuenta Contable</th>
                                        <th className="py-3 px-3 text-right">Sumas Debe</th>
                                        <th className="py-3 px-3 text-right">Sumas Haber</th>
                                        <th className="py-3 px-3 text-right">Saldo Deudor</th>
                                        <th className="py-3 px-3 text-right">Saldo Acreedor</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 text-xs">
                                      {(() => {
                                        const accountCodes = Array.from(new Set(entries.map(e => e.cuenta))).sort();
                                        if (accountCodes.length === 0) {
                                          return (
                                            <tr>
                                              <td colSpan={6} className="py-8 text-center text-slate-400 italic">No hay datos para compilar el Balance de Comprobación en este periodo.</td>
                                            </tr>
                                          );
                                        }

                                        let grandSumDebe = 0;
                                        let grandSumHaber = 0;
                                        let grandSumDeudor = 0;
                                        let grandSumAcreedor = 0;

                                        return (
                                          <>
                                            {accountCodes.map(code => {
                                              const acctEntries = entries.filter(e => e.cuenta === code);
                                              const denominacion = acctEntries[0]?.cuentaNombre || 'Cuenta General';
                                              
                                              const totalDebe = acctEntries.reduce((sum, e) => sum + e.debe, 0);
                                              const totalHaber = acctEntries.reduce((sum, e) => sum + e.haber, 0);
                                              
                                              const deudor = totalDebe > totalHaber ? totalDebe - totalHaber : 0;
                                              const acreedor = totalHaber > totalDebe ? totalHaber - totalDebe : 0;

                                              grandSumDebe += totalDebe;
                                              grandSumHaber += totalHaber;
                                              grandSumDeudor += deudor;
                                              grandSumAcreedor += acreedor;

                                              return (
                                                <tr key={code} className="hover:bg-slate-50/40 transition-colors font-sans">
                                                  <td className="py-3 px-3 font-mono font-bold text-indigo-750">{code}</td>
                                                  <td className="py-3 px-3 font-semibold text-slate-800">{denominacion}</td>
                                                  <td className="py-3 px-3 text-right font-mono text-slate-600">S/. {totalDebe.toFixed(2)}</td>
                                                  <td className="py-3 px-3 text-right font-mono text-slate-600">S/. {totalHaber.toFixed(2)}</td>
                                                  <td className="py-3 px-3 text-right font-mono text-emerald-850 font-bold">
                                                    {deudor > 0 ? `S/. ${deudor.toFixed(2)}` : '-'}
                                                  </td>
                                                  <td className="py-3 px-3 text-right font-mono text-indigo-850 font-bold">
                                                    {acreedor > 0 ? `S/. ${acreedor.toFixed(2)}` : '-'}
                                                  </td>
                                                </tr>
                                              );
                                            })}

                                            <tr className="bg-slate-50/90 font-black border-t border-slate-200 text-xs">
                                              <td colSpan={2} className="py-3.5 px-3 text-right uppercase tracking-wider text-[10px]">Totales Generales de Balance:</td>
                                              <td className="py-3.5 px-3 text-right font-mono text-slate-950">S/. {grandSumDebe.toFixed(2)}</td>
                                              <td className="py-3.5 px-3 text-right font-mono text-slate-950">S/. {grandSumHaber.toFixed(2)}</td>
                                              <td className="py-3.5 px-3 text-right font-mono text-emerald-800">S/. {grandSumDeudor.toFixed(2)}</td>
                                              <td className="py-3.5 px-3 text-right font-mono text-indigo-800">S/. {grandSumAcreedor.toFixed(2)}</td>
                                            </tr>
                                          </>
                                        );
                                      })()}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            )}
                          </div>
                        </>
                      );
                    })()}
                  </div>
                )}

                {selectedDiarioTab === 'diario' && regimen === 'RMT' && (
                  <>
                    <div className="bg-indigo-50/50 border border-indigo-100 p-4.5 rounded-2xl mb-4 animate-fadeIn">
                      <h3 className="text-xs font-black text-indigo-850 uppercase tracking-wider mb-1">
                        {modoSencillo ? "📖 Cuaderno Diario de Operaciones (Libro Diario)" : "📖 Libro Diario Simplificado (Régimen MYPE)"}
                      </h3>
                      <p className="text-[11px] text-indigo-700 font-sans">
                        {modoSencillo 
                          ? "Este es tu cuaderno principal. Cada vez que vendes, compras, cobras o pagas, el sistema lo traduce de inmediato en un asiento de 'doble entrada' (Debe y Haber). ¡Es como llevar la cuenta de lo que entra y lo que sale de cada bolsillo!" 
                          : "Consolida en orden cronológico el asiento por cada hecho económico para registrar el aumento o disminución del patrimonio. Es obligatorio para empresas en el Régimen MYPE Tributario."}
                      </p>
                    </div>

                    {/* LIBRO DIARIO DE FORMATO SIMPLIFICADO (LDFS) SUMMARY */}
                    {projectedIncomeUIT <= 300 && (
                      <div className="bg-slate-50 border border-slate-200 p-5 rounded-3xl space-y-4 mb-5 animate-fadeIn">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-200/60 pb-3">
                          <div>
                            <span className="text-[9px] bg-slate-250 text-slate-700 font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider block w-fit mb-1 font-mono">
                              REQUISITO SUNAT: TRAMO 1 (≤300 UIT)
                            </span>
                            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 font-heading">
                              <span>📖 Libro Diario de Formato Simplificado (LDFS) Resumido</span>
                            </h4>
                            <p className="text-[11px] text-slate-500 font-sans mt-0.5">
                              SUNAT exige agrupar los asientos por cuentas (Activo, Pasivo, Patrimonio, Ingresos, Gastos) de manera resumida en este formato.
                            </p>
                          </div>
                          <div className="bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-[10.5px] font-bold text-slate-600">
                            Periodo: <span className="font-mono text-slate-800">{period}</span>
                          </div>
                        </div>

                        {(() => {
                          const groups = [
                            { id: 'activo', nombre: 'Activo', color: 'bg-emerald-50 text-emerald-800 border-emerald-100', match: (cta: string) => /^[123]/.test(cta), entries: [] as any[] },
                            { id: 'pasivo', nombre: 'Pasivo', color: 'bg-indigo-50 text-indigo-800 border-indigo-100', match: (cta: string) => /^4/.test(cta), entries: [] as any[] },
                            { id: 'patrimonio', nombre: 'Patrimonio', color: 'bg-purple-50 text-purple-800 border-purple-100', match: (cta: string) => /^5/.test(cta), entries: [] as any[] },
                            { id: 'gastos', nombre: 'Gastos', color: 'bg-rose-50 text-rose-800 border-rose-100', match: (cta: string) => /^[69]/.test(cta), entries: [] as any[] },
                            { id: 'ingresos', nombre: 'Ingresos', color: 'bg-amber-50 text-amber-800 border-amber-100', match: (cta: string) => /^7/.test(cta), entries: [] as any[] }
                          ];

                          allPeriodEntries.forEach(e => {
                            const group = groups.find(g => g.match(e.cuenta));
                            if (group) {
                              group.entries.push(e);
                            }
                          });

                          return (
                            <div className="overflow-x-auto border border-slate-200/80 rounded-2xl bg-white shadow-3xs">
                              <table className="w-full text-left border-collapse text-xs">
                                <thead>
                                  <tr className="bg-slate-50 border-b border-slate-200 text-[9.5px] uppercase font-black tracking-wider text-slate-400">
                                    <th className="py-3 px-4.5">Clase de Cuenta</th>
                                    <th className="py-3 px-4 text-center">Cuentas Utilizadas</th>
                                    <th className="py-3 px-4.5 text-right text-emerald-850">Debe (Cargos)</th>
                                    <th className="py-3 px-4.5 text-right text-indigo-850">Haber (Abonos)</th>
                                    <th className="py-3 px-4.5 text-right text-slate-800 font-bold">Saldo Determinado</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-[11.5px]">
                                  {groups.map(g => {
                                    const totalDebe = g.entries.reduce((sum, e) => sum + e.debe, 0);
                                    const totalHaber = g.entries.reduce((sum, e) => sum + e.haber, 0);
                                    const uniqueCtas = Array.from(new Set(g.entries.map(e => e.cuenta))).sort().join(', ');

                                    const isDeudor = g.id === 'activo' || g.id === 'gastos';
                                    const netBalance = isDeudor ? (totalDebe - totalHaber) : (totalHaber - totalDebe);

                                    return (
                                      <tr key={g.id} className="hover:bg-slate-50/25 transition-colors font-sans">
                                        <td className="py-3 px-4.5">
                                          <span className={`inline-block px-2.5 py-0.5 rounded-lg text-[9.5px] font-black uppercase tracking-wider border ${g.color}`}>
                                            {g.nombre}
                                          </span>
                                        </td>
                                        <td className="py-3 px-4 font-mono text-[10.5px] text-slate-400 text-center font-bold">
                                          {uniqueCtas ? uniqueCtas : <span className="italic text-slate-300 font-normal">Sin actividad</span>}
                                        </td>
                                        <td className="py-3 px-4.5 text-right font-mono text-slate-700">
                                          {totalDebe > 0 ? `S/. ${totalDebe.toLocaleString('es-PE', { minimumFractionDigits: 2 })}` : '-'}
                                        </td>
                                        <td className="py-3 px-4.5 text-right font-mono text-slate-700">
                                          {totalHaber > 0 ? `S/. ${totalHaber.toLocaleString('es-PE', { minimumFractionDigits: 2 })}` : '-'}
                                        </td>
                                        <td className="py-3 px-4.5 text-right font-mono font-bold">
                                          {netBalance > 0 ? (
                                            <span className="text-emerald-700">S/. {netBalance.toLocaleString('es-PE', { minimumFractionDigits: 2 })} (Deudor)</span>
                                          ) : netBalance < 0 ? (
                                            <span className="text-indigo-700">S/. {Math.abs(netBalance).toLocaleString('es-PE', { minimumFractionDigits: 2 })} (Acreedor)</span>
                                          ) : (
                                            <span className="text-slate-400">-</span>
                                          )}
                                        </td>
                                      </tr>
                                    );
                                  })}
                                  <tr className="bg-slate-50 font-black border-t border-slate-200">
                                    <td colSpan={2} className="py-3 px-4.5 text-right uppercase tracking-wider text-[9.5px] text-slate-500">
                                      Totales de Formato Simplificado:
                                    </td>
                                    <td className="py-3 px-4.5 text-right font-mono text-emerald-800">
                                      S/. {groups.reduce((sum, g) => sum + g.entries.reduce((s, e) => s + e.debe, 0), 0).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                                    </td>
                                    <td className="py-3 px-4.5 text-right font-mono text-indigo-800">
                                      S/. {groups.reduce((sum, g) => sum + g.entries.reduce((s, e) => s + e.haber, 0), 0).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                                    </td>
                                    <td className="py-3 px-4.5 text-right font-mono text-slate-900 font-extrabold">
                                      S/. {groups.reduce((sum, g) => {
                                        const debe = g.entries.reduce((s, e) => s + e.debe, 0);
                                        const haber = g.entries.reduce((s, e) => s + e.haber, 0);
                                        const isDeudor = g.id === 'activo' || g.id === 'gastos';
                                        return sum + Math.abs(isDeudor ? debe - haber : haber - debe);
                                      }, 0).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          );
                        })()}
                      </div>
                    )}

                    {/* ADVANCED MULTI-FILTER PANEL */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-4 bg-slate-50 border border-slate-200/60 p-4 rounded-2xl">
                      {/* Text search by glosa or RUC */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-1.5">
                          <Search className="w-3 h-3 text-slate-400 shrink-0" /> {modoSencillo ? "Buscar por palabra o RUC" : "Glosa / RUC / Doc"}
                        </label>
                        <input 
                          type="text" 
                          placeholder="Ej. F001 o mercadería..."
                          value={filterTexto}
                          onChange={(e) => setFilterTexto(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl py-1.5 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 font-medium text-slate-800"
                        />
                      </div>

                      {/* Operation nature selector filter */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase block">
                          {modoSencillo ? "Filtrar por tipo de apunte" : "Filtro Naturaleza"}
                        </label>
                        <select 
                          value={filterOperacion}
                          onChange={(e) => setFilterOperacion(e.target.value as any)}
                          className="w-full bg-white border border-slate-200 rounded-xl py-1.5 px-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 font-bold text-slate-800 cursor-pointer text-[11px]"
                        >
                          <option value="TODOS">🔍 {modoSencillo ? "Todos los apuntes" : "Todos los movimientos"}</option>
                          <option value="VENTA">🟢 {modoSencillo ? "Solo Ventas (Dinero Entra)" : "Solo Ventas (Ingresos)"}</option>
                          <option value="COMPRA">🔵 {modoSencillo ? "Solo Compras (Gastos de negocio)" : "Solo Compras (Gastos)"}</option>
                          <option value="PLANILLA">🟡 Solo Planillas (Personal)</option>
                          <option value="APERTURA">⚫ Solo Asiento Apertura</option>
                          <option value="COBRO">🪙 Solo Cobros de Factura</option>
                          <option value="PAGO">💸 Solo Pagos a Proveedores</option>
                          <option value="TRANSFERENCIA">🏦 Solo Movimientos Caja/Banco</option>
                        </select>
                      </div>

                      {/* Account number digital search */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-1.5">
                          <BookOpen className="w-3 h-3 text-slate-400 shrink-0" /> {modoSencillo ? "Código de alcancía (Cuenta)" : "Cuenta PCGE"}
                        </label>
                        <div className="relative">
                          <input 
                            type="text" 
                            placeholder="Ej. 10 o 40 o 12..."
                            maxLength={5}
                            value={filterCuenta}
                            onChange={(e) => setFilterCuenta(e.target.value.replace(/\D/g, ''))}
                            className="w-full bg-white border border-slate-200 rounded-xl py-1.5 px-3 text-xs font-mono font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
                          />
                          {filterCuenta && (
                            <button 
                              type="button"
                              onClick={() => setFilterCuenta('')}
                              className="absolute right-2.5 top-2 text-[10px] text-slate-400 hover:text-red-500 font-black cursor-pointer"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Info and status check */}
                    <div className="flex flex-wrap gap-4 items-center mb-4 bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-slate-500">{modoSencillo ? "Viendo en lista:" : "Filtrados / Total " + period + ":"}</span>
                        <span className="bg-slate-200 text-slate-800 font-bold px-2 py-0.5 rounded-md font-mono">
                          {visibleTransactions.length} de {filteredTransactions.length}
                        </span>
                      </div>
                      
                      {/* Debe vs Haber balance check */}
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-500">
                          {modoSencillo ? "Balanza de Entradas y Salidas:" : "Balance Partida Doble:"}
                        </span>
                        <div className="flex items-center gap-1 text-[11px] font-bold">
                          <span className="text-emerald-600 font-mono">
                            {modoSencillo ? "Entradas: S/. " : "D: S/. "}{totalDebeGlobal.toFixed(2)}
                          </span>
                          <span className="text-slate-300">|</span>
                          <span className="text-indigo-600 font-mono">
                            {modoSencillo ? "Salidas: S/. " : "H: S/. "}{totalHaberGlobal.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      <div className="ml-auto flex items-center gap-1.5 text-[11px] font-bold">
                        {isBalanced ? (
                          <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                            <Check className="w-3.5 h-3.5 stroke-[3]" /> {modoSencillo ? "¡Todo en orden!" : "¡Asientos Cuadrados!"}
                          </span>
                        ) : (
                          <span className="text-red-700 bg-red-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5" /> {modoSencillo ? "¡Hay un error!" : "Asientos Descuadrados"}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Main Table view of individual ledger entries */}
                    <div className="overflow-x-auto max-h-[350px] overflow-y-auto border border-slate-100 rounded-2xl">
                      {visibleTransactions.length === 0 ? (
                        <div className="text-center py-12 text-slate-400 font-medium">
                          <FileText className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                          <p className="text-sm">No se encontraron transacciones que coincidan con los filtros</p>
                          <p className="text-xs text-slate-400 mt-1">Usa los filtros superiores para refinar tu búsqueda o añade nuevas operaciones.</p>
                        </div>
                      ) : (
                        <table className="w-full text-left text-xs min-w-[700px]">
                          <thead>
                            <tr className="bg-slate-50 text-[10px] text-slate-500 uppercase tracking-wider border-b border-slate-200/80 sticky top-0">
                              <th className="py-3 px-4 font-bold">{modoSencillo ? "Fecha y N° Boleta" : "Fecha / Doc"}</th>
                              <th className="py-3 px-4 font-bold">{modoSencillo ? "Tipo" : "Naturaleza"}</th>
                              <th className="py-3 px-4 font-bold">Ruc Cliente/Prov</th>
                              <th className="py-3 px-4 font-bold">{modoSencillo ? "Concepto / Detalle" : "Concepto / Glosa"}</th>
                              <th className="py-3 px-4 font-bold text-emerald-600">{modoSencillo ? "Monto Sin IGV" : "Base Imp. / IGV"}</th>
                              <th className="py-3 px-4 font-bold text-right text-slate-800">{modoSencillo ? "Monto Final" : "Total (S/.)"}</th>
                              <th className="py-3 px-4 font-bold text-center">{modoSencillo ? "Hacer" : "Acción"}</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-sans">
                            {visibleTransactions.map((tx) => (
                              <tr key={tx.id} className="hover:bg-slate-50/60 transition-colors group">
                                {/* Fecha & Doc */}
                                <td className="py-3 px-4 font-medium text-slate-600">
                                  <div className="font-semibold text-slate-800">{tx.fecha}</div>
                                  <div className="text-[10px] font-mono text-slate-400">{tx.documento}</div>
                                </td>

                                {/* Naturaleza */}
                                <td className="py-3 px-4">
                                  <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-black tracking-wider uppercase ${
                                    tx.esMovimientoInventario ? 'bg-slate-700 text-white font-mono text-[9px]' :
                                    tx.tipo === 'VENTA' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 
                                    tx.tipo === 'COMPRA' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' :
                                    tx.tipo === 'COBRO' ? 'bg-teal-50 text-teal-700 border border-teal-100' :
                                    tx.tipo === 'PAGO' ? 'bg-rose-50 text-rose-700 border border-rose-100' :
                                    tx.tipo === 'TRANSFERENCIA' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                                    tx.tipo === 'PLANILLA' ? 'bg-yellow-50 text-yellow-700 border border-yellow-100' :
                                    'bg-slate-50 text-slate-700 border border-slate-100'
                                  }`}>
                                    {tx.esMovimientoInventario ? 'ALMACÉN' : tx.tipo}
                                  </span>
                                </td>

                                {/* RUC info */}
                                <td className="py-3 px-4 font-mono text-slate-500 text-[11px]">
                                  {tx.rucClienteProveedor}
                                </td>

                                {/* Glosa / Concepto */}
                                <td className="py-3 px-4 text-slate-700 font-sans">
                                  <div className="font-semibold text-slate-800">{tx.glosa}</div>
                                  <div className="flex items-center gap-1.5 mt-1 text-[9px] font-mono select-none">
                                    <span className="text-slate-400">Creado por:</span>
                                    <span className={`px-1.5 py-0.2 rounded-full border text-[9px] ${
                                      tx.creadoPor === 'EMPLEADO'
                                        ? 'bg-amber-50 border-amber-200 text-amber-700 font-bold'
                                        : tx.creadoPor === 'GERENTE'
                                        ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-bold'
                                        : tx.creadoPor === 'ADMINISTRADOR'
                                        ? 'bg-sky-50 border-sky-200 text-sky-700 font-bold'
                                        : tx.creadoPor === 'CONTADOR'
                                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700 font-bold'
                                        : 'bg-slate-50 border-slate-200 text-slate-500'
                                    }`}>
                                      👤 {tx.creadoPor || 'SISTEMA'}
                                    </span>
                                  </div>
                                </td>

                                {/* Base Imp. / IGV split */}
                                <td className="py-3 px-4 text-slate-500 text-[11px] font-mono whitespace-nowrap">
                                  <div>Base: S/. {tx.montoBase.toFixed(2)}</div>
                                  <div className="text-[10px] text-slate-400">IGV: S/. {tx.igv.toFixed(2)}</div>
                                </td>

                                {/* Total contable */}
                                <td className="py-3 px-4 text-right font-mono font-black text-slate-900 whitespace-nowrap">
                                  S/. {tx.total.toFixed(2)}
                                </td>

                                {/* Actions */}
                                <td className="py-3 px-4 text-center">
                                  {currentUserRole === 'EMPLEADO' ? (
                                    <button 
                                      onClick={() => handleRemoveTransaction(tx.id)}
                                      className="text-amber-500 hover:text-amber-600 p-1 rounded-sm transition-colors cursor-pointer"
                                      title="Acceso Bloqueado: Su rango es Empleado"
                                    >
                                      <Lock className="w-3.5 h-3.5 mx-auto" />
                                    </button>
                                  ) : (
                                    <button 
                                      onClick={() => handleRemoveTransaction(tx.id)}
                                      className="text-slate-300 hover:text-red-500 p-1 rounded-sm transition-colors cursor-pointer"
                                      title="Eliminar registro"
                                    >
                                      <Trash2 className="w-4 h-4 mx-auto" />
                                    </button>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>

                    {/* DYNAMIC ASENTOS CONTABLES EN DETALLE DE PARTIDA DOBLE (TABLA DIARIO DETALLE) */}
                    {activeView === 'libros' && (
                      <div className="mt-4 pt-4 border-t border-slate-100">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                          <Scale className="w-4 h-4 text-indigo-500" />
                          Estructura de Asientos Diario MYPE (Double Entry Ledger)
                        </h3>
                        <span className="text-[10px] text-slate-400">Generación de partida doble automática</span>
                      </div>

                      {allEntries.length === 0 ? (
                        <p className="text-xs text-slate-400 italic text-center py-4">Añada transacciones arriba para visualizar sus asientos contables estructurados por cuentas debito/credito.</p>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {visibleTransactions.map(tx => {
                            const seats = generateSeatsFromTransaction(tx);
                            return (
                              <div key={tx.id} className="bg-slate-50 rounded-2xl p-3 border border-slate-200/50 space-y-2">
                                <div className="flex justify-between items-center border-b border-slate-200 pb-1.5">
                                  <div>
                                    <span className="text-[10px] font-bold text-slate-400">Asiento #{tx.id.replace(/\D/g, '').slice(-4) || '10'}</span>
                                    <p className="text-xs font-bold text-slate-800">{tx.glosa}</p>
                                  </div>
                                  <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${
                                    tx.esMovimientoInventario ? 'bg-slate-700 text-white font-mono text-[8.5px]' :
                                    tx.tipo === 'VENTA' ? 'bg-emerald-100 text-emerald-800' : 
                                    tx.tipo === 'COMPRA' ? 'bg-indigo-100 text-indigo-800' :
                                    tx.tipo === 'COBRO' ? 'bg-teal-100 text-teal-800' :
                                    tx.tipo === 'PAGO' ? 'bg-rose-100 text-rose-800' :
                                    tx.tipo === 'TRANSFERENCIA' ? 'bg-amber-100 text-amber-800' :
                                    tx.tipo === 'PLANILLA' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-slate-100 text-slate-800'
                                  }`}>
                                    {tx.esMovimientoInventario ? 'ALMACÉN' : tx.tipo}
                                  </span>
                                </div>

                                <div className="space-y-1.5">
                                  {seats.map((seat, sIdx) => (
                                    <div key={seat.id} className="flex justify-between text-xs items-center gap-2">
                                      <div className="flex gap-2 items-center truncate">
                                        <span className="font-mono font-bold text-indigo-600 bg-slate-200/50 rounded px-1 text-[11px]">{seat.cuenta}</span>
                                        <span className="text-slate-600 truncate text-[11px]" title={seat.cuentaNombre}>{seat.cuentaNombre}</span>
                                      </div>
                                      <div className="flex items-center gap-2 font-mono text-[11px] shrink-0 font-bold">
                                        {seat.debe > 0 ? (
                                          <span className="text-emerald-700 bg-emerald-50 px-1 rounded">D: S/. {seat.debe.toFixed(2)}</span>
                                        ) : (
                                          <span className="text-indigo-700 bg-indigo-50 px-1 rounded">H: S/. {seat.haber.toFixed(2)}</span>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}

              {false && (
                  /* INVENTARIO DE MERCADERÍAS & KÁRDEX SUNAT 13.1 PANEL */
                  <div className="space-y-5">
                    <div className="bg-indigo-50/50 border border-indigo-100 p-4.5 rounded-2xl mb-2 animate-fadeIn">
                      <h3 className="text-xs font-black text-indigo-850 uppercase tracking-wider mb-1">
                        📦 SUNAT Formato 13.1: Registro de Inventario Permanente Valorizado (Kárdex)
                      </h3>
                      <p className="text-[11px] text-indigo-700 font-sans">
                        Controla el ingreso, salida y saldos de mercaderías físicas valuados mediante el método de Costo Promedio Móvil. Es obligatorio para empresas comerciales que requieran llevar inventarios formales para sustentar el costo de ventas.
                      </p>
                    </div>

                    {/* Product selector grid */}
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2.5">
                        📦 CATÁLOGO DE PRODUCTOS FÍSICOS (INVENTARIABLES)
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {catalogItems.filter((c: any) => c.isPhysical).map((prod: any) => {
                          const kardex = getKardexForProduct(prod.id);
                          const isActive = selectedInventoryProduct === prod.id;
                          return (
                            <button
                              key={prod.id}
                              type="button"
                              onClick={() => setSelectedInventoryProduct(prod.id)}
                              className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between gap-1 cursor-pointer select-none ${
                                isActive
                                  ? 'bg-slate-900 border-slate-900 text-white shadow-md font-sans'
                                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-800 font-sans'
                              }`}
                            >
                              <div className="flex justify-between items-start">
                                <span className={`text-[9.5px] px-2 py-0.5 rounded font-bold tracking-wider ${
                                  isActive ? 'bg-indigo-600 text-white font-mono' : 'bg-slate-200 text-slate-700 font-mono'
                                }`}>{prod.sku}</span>
                                <span className={`text-[10px] font-bold ${isActive ? 'text-slate-300' : 'text-slate-500'}`}>{prod.unidad}</span>
                              </div>
                              <div className="font-extrabold text-xs truncate mt-2 font-heading">{prod.desc}</div>
                              <div className="flex justify-between items-center mt-3 pt-2 border-t border-slate-200/20 text-[10.5px]">
                                <span className={isActive ? 'text-slate-400' : 'text-slate-500'}>Stock Disp:</span>
                                <span className="font-mono font-black text-xs">{(kardex?.stockActual ?? 0) > 0 ? (kardex?.stockActual) : 0} {prod.unidad.slice(0,3)}</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Kardex metrics */}
                    {(() => {
                      const kardex = getKardexForProduct(selectedInventoryProduct);
                      if (!kardex) return null;
                      return (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
                          {/* Stock Actual */}
                          <div className="bg-emerald-50/40 border border-emerald-100/80 p-4 rounded-2xl flex flex-col justify-between">
                            <div>
                              <span className="text-[10px] font-bold text-emerald-800 uppercase block mb-1">Stock Actual</span>
                              <div className="flex items-baseline gap-1">
                                <span className="text-xl font-black text-emerald-900 font-mono">{kardex.stockActual}</span>
                                <span className="text-[10px] font-bold text-emerald-700">{kardex.product.unidad}</span>
                              </div>
                            </div>
                            <span className="text-[9.5px] text-emerald-600 font-semibold mt-2.5 block border-t border-emerald-100 pt-1">
                              Stock Apertura: {kardex.stockInicial}
                            </span>
                          </div>

                          {/* Costo Unitario Promedio */}
                          <div className="bg-indigo-50/40 border border-indigo-100/80 p-4 rounded-2xl flex flex-col justify-between">
                            <div>
                              <span className="text-[10px] font-bold text-indigo-800 uppercase block mb-1">Costo Promedio (C/U)</span>
                              <div className="text-lg font-black text-indigo-900 font-mono">S/. {kardex.costoPromedioActual.toFixed(2)}</div>
                            </div>
                            <span className="text-[9.5px] text-indigo-600 font-semibold mt-2.5 block border-t border-indigo-100 pt-1">
                              Fórmula: Costo Promedio Móvil
                            </span>
                          </div>

                          {/* Valorización Total */}
                          <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex flex-col justify-between">
                            <div>
                              <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Valorización de Almacén</span>
                              <div className="text-lg font-black text-slate-900 font-mono">S/. {kardex.valorActual.toFixed(2)}</div>
                            </div>
                            <span className="text-[9.5px] text-slate-400 font-semibold mt-2.5 block border-t border-slate-200 pt-1">
                              Total Activo corriente (Cta 20)
                            </span>
                          </div>

                          {/* Movimientos */}
                          <div className="bg-amber-50/30 border border-amber-100/80 p-4 rounded-2xl flex flex-col justify-between">
                            <div>
                              <span className="text-[10px] font-bold text-amber-800 uppercase block mb-1">Movimientos del Periodo</span>
                              <div className="text-[11px] font-bold text-amber-900 font-mono space-y-0.5 mt-0.5">
                                <div className="flex justify-between">
                                  <span>📥 Entradas:</span>
                                  <span>+{kardex.totalEntradas}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>📤 Salidas:</span>
                                  <span>-{kardex.totalSalidas}</span>
                                </div>
                              </div>
                            </div>
                            <span className="text-[9.5px] text-amber-600 font-semibold mt-2 block border-t border-amber-100 pt-1">
                              Ventas, Compras y Ajustes
                            </span>
                          </div>
                        </div>
                      );
                    })()}

                    {/* Title with manual movement button */}
                    <div className="flex flex-col sm:flex-row gap-3.5 sm:justify-between sm:items-center pt-3.5 border-t border-slate-100">
                      <div>
                        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                          📋 Registro de Inventario Permanente Valorizado (SUNAT Formato 13.1)
                        </h3>
                        <p className="text-[10px] text-slate-400 font-sans mt-0.5">Control histórico de entradas, salidas y saldos físicos de mercaderías comerciales.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setManualStockProduct(selectedInventoryProduct);
                          const prod = catalogItems.find((p: any) => p.id === selectedInventoryProduct);
                          if (prod) {
                            setManualStockCost(prod.costoInicial ? prod.costoInicial.toString() : '100');
                          }
                          setManualStockQty(10);
                          setManualStockGlosa('');
                          setManualStockDoc('');
                          setShowManualStockModal(true);
                        }}
                        className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-3 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm shadow-indigo-600/10 self-start sm:self-center select-none"
                      >
                        📥 Registrar Ingreso/Egreso Manual
                      </button>
                    </div>

                    {/* Official SUNAT 13.1 table */}
                    {(() => {
                      const kardex = getKardexForProduct(selectedInventoryProduct);
                      if (!kardex) return null;
                      return (
                        <div className="overflow-x-auto border border-slate-200 rounded-2xl max-h-[380px] overflow-y-auto">
                          <table className="w-full text-left text-xs min-w-[900px]">
                            <thead>
                              <tr className="bg-slate-900 text-[10px] text-white uppercase font-black text-center border-b border-slate-800 sticky top-0 z-10">
                                <th rowSpan={2} className="py-2.5 px-3 border-r border-slate-800 text-left">Fecha</th>
                                <th rowSpan={2} className="py-2.5 px-3 border-r border-slate-800 text-left font-mono">Doc. Ref.</th>
                                <th rowSpan={2} className="py-2.5 px-3 border-r border-slate-800 text-left">Glosa / Concepto del Movimiento</th>
                                <th colSpan={3} className="py-1 px-2 border-r border-slate-800 bg-emerald-950/40 text-emerald-300">ENTRADAS (Ingresos / Compras)</th>
                                <th colSpan={3} className="py-1 px-2 border-r border-slate-800 bg-rose-950/40 text-rose-300">SALIDAS (Ventas / Merma)</th>
                                <th colSpan={3} className="py-1 px-2 bg-slate-850 text-slate-300">SALDOS FINAL (Existencias)</th>
                              </tr>
                              <tr className="bg-slate-100 text-[9px] text-slate-600 uppercase font-black text-center border-b border-slate-200 sticky top-[33px] z-10">
                                <th className="py-1.5 px-2 border-r border-slate-200 font-mono">Cant</th>
                                <th className="py-1.5 px-2 border-r border-slate-200 font-mono">C/U (S/.)</th>
                                <th className="py-1.5 px-2 border-r border-slate-200 font-mono">Total (S/.)</th>
                                <th className="py-1.5 px-2 border-r border-slate-200 font-mono">Cant</th>
                                <th className="py-1.5 px-2 border-r border-slate-200 font-mono">C/U (S/.)</th>
                                <th className="py-1.5 px-2 border-r border-slate-200 font-mono">Total (S/.)</th>
                                <th className="py-1.5 px-2 border-r border-slate-200 font-mono bg-slate-50">Cant</th>
                                <th className="py-1.5 px-2 border-r border-slate-200 font-mono bg-slate-50">C/U (S/.)</th>
                                <th className="py-1.5 px-2 font-mono bg-slate-50">Total (S/.)</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 font-sans bg-white">
                              {/* SALDO INICIAL */}
                              <tr className="bg-indigo-50/30 text-indigo-900 font-semibold italic text-xs">
                                <td className="py-2 px-3 border-r border-slate-200">-</td>
                                <td className="py-2 px-3 border-r border-slate-200 font-mono">-</td>
                                <td className="py-2 px-3 border-r border-slate-200 font-bold text-slate-700 uppercase tracking-wide">SALDO INICIAL DE APERTURA DE EJERCICIO</td>
                                <td colSpan={3} className="border-r border-slate-200 text-center text-slate-400 bg-emerald-50/5">-</td>
                                <td colSpan={3} className="border-r border-slate-200 text-center text-slate-400 bg-rose-50/5">-</td>
                                <td className="py-2 px-2 text-center bg-slate-100 font-mono font-bold border-r border-slate-200">{kardex.stockInicial}</td>
                                <td className="py-2 px-2 text-right bg-slate-100 font-mono font-semibold border-r border-slate-200">S/. {kardex.costoInicial.toFixed(2)}</td>
                                <td className="py-2 px-2 text-right bg-slate-100 font-mono font-bold">S/. {kardex.valorInicial.toFixed(2)}</td>
                              </tr>

                              {/* MOVEMENTS */}
                              {kardex.movements.length === 0 ? (
                                <tr>
                                  <td colSpan={12} className="py-10 text-center text-slate-400 font-sans italic">
                                    No hay movimientos registrados para este producto en el sistema.
                                  </td>
                                </tr>
                              ) : (
                                kardex.movements.map((mov, mIdx) => (
                                  <tr key={mov.txId} className="hover:bg-slate-50/40 transition-colors text-xs font-sans">
                                    <td className="py-2.5 px-3 border-r border-slate-150 font-medium text-slate-700">{mov.fecha}</td>
                                    <td className="py-2.5 px-3 border-r border-slate-150 font-mono font-bold text-slate-800">{mov.documento}</td>
                                    <td className="py-2.5 px-3 border-r border-slate-150 font-sans">
                                      <div className="font-bold text-slate-900">{mov.glosa}</div>
                                      <div className="flex items-center gap-1.5 mt-0.5">
                                        <span className={`inline-block px-1.5 py-0.2 rounded text-[8.5px] font-black uppercase tracking-wider ${
                                          mov.tipo === 'VENTA' ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' :
                                          mov.tipo === 'COMPRA' ? 'bg-indigo-50 text-indigo-800 border border-indigo-100' :
                                          'bg-slate-100 text-slate-700 border border-slate-200'
                                        }`}>
                                          {mov.tipo}
                                        </span>
                                      </div>
                                    </td>
                                    
                                    {/* Entradas */}
                                    <td className="py-2.5 px-2 border-r border-slate-150 text-center bg-emerald-50/15 font-mono text-emerald-800 font-bold">
                                      {mov.entryQty > 0 ? mov.entryQty : '-'}
                                    </td>
                                    <td className="py-2.5 px-2 border-r border-slate-150 text-right bg-emerald-50/15 font-mono text-slate-600">
                                      {mov.entryQty > 0 ? `S/. ${mov.entryPrice.toFixed(2)}` : '-'}
                                    </td>
                                    <td className="py-2.5 px-2 border-r border-slate-150 text-right bg-emerald-50/15 font-mono text-emerald-900 font-black">
                                      {mov.entryQty > 0 ? `S/. ${mov.entryTotal.toFixed(2)}` : '-'}
                                    </td>

                                    {/* Salidas */}
                                    <td className="py-2.5 px-2 border-r border-slate-150 text-center bg-rose-50/15 font-mono text-rose-800 font-bold">
                                      {mov.exitQty > 0 ? mov.exitQty : '-'}
                                    </td>
                                    <td className="py-2.5 px-2 border-r border-slate-150 text-right bg-rose-50/15 font-mono text-slate-600">
                                      {mov.exitQty > 0 ? `S/. ${mov.exitPrice.toFixed(2)}` : '-'}
                                    </td>
                                    <td className="py-2.5 px-2 border-r border-slate-150 text-right bg-rose-50/15 font-mono text-rose-900 font-black">
                                      {mov.exitQty > 0 ? `S/. ${mov.exitTotal.toFixed(2)}` : '-'}
                                    </td>

                                    {/* Saldos */}
                                    <td className="py-2.5 px-2 border-r border-slate-150 text-center bg-slate-50/50 font-mono font-black text-slate-900">
                                      {mov.saldoStock}
                                    </td>
                                    <td className="py-2.5 px-2 border-r border-slate-150 text-right bg-slate-50/50 font-mono text-slate-600">
                                      S/. {mov.saldoCost.toFixed(2)}
                                    </td>
                                    <td className="py-2.5 px-2 text-right bg-slate-50 font-mono font-black text-slate-950">
                                      S/. {mov.saldoTotal.toFixed(2)}
                                    </td>
                                  </tr>
                                ))
                              )}
                            </tbody>
                          </table>
                        </div>
                      );
                    })()}
                  </div>
                )}

                {selectedDiarioTab === 'inventario_balances' && regimen === 'RMT' && (
                  <div className="space-y-5 animate-fadeIn">
                    {projectedIncomeUIT <= 500 && !bypassUITLock ? (
                      <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 text-center space-y-4 shadow-3xs max-w-2xl mx-auto my-6 animate-fadeIn">
                        <div className="w-16 h-16 bg-indigo-50 text-indigo-650 rounded-full flex items-center justify-center mx-auto text-3xl shadow-sm border border-indigo-100">
                          🔒
                        </div>
                        <div className="space-y-1.5">
                          <span className="text-[10px] bg-indigo-100 text-indigo-850 font-extrabold px-3 py-0.5 rounded-full uppercase tracking-wider font-sans">
                            Tramo 1 y 2 (Hasta 500 UIT) — Exonerado
                          </span>
                          <h3 className="text-base font-bold text-slate-800 font-heading">Libro de Inventarios y Balances Reservado</h3>
                          <p className="text-xs text-slate-500 font-sans leading-relaxed">
                            De acuerdo con la normativa legal de la SUNAT para el **Régimen MYPE Tributario (RMT)**, las empresas con ingresos anuales de hasta 500 UIT no están obligadas a registrar este libro.
                          </p>
                        </div>
                        <div className="bg-indigo-50/40 p-4 rounded-2xl border border-indigo-100/50 text-left text-xs text-indigo-900 leading-normal font-sans">
                          💡 **¿Cómo puedo habilitarlo?** Puedes elevar tus ingresos proyectados anuales en el widget de la barra lateral izquierda a más de 500 UIT y el sistema habilitará este reporte estructurado en tiempo real para visualizar tu balance anual complejo.
                        </div>
                        <p className="text-[10.5px] text-slate-400 italic font-sans">
                          Asegura el cumplimiento tributario de tu negocio manteniendo al día el Registro de Compras, Ventas y el Libro Diario Simplificado.
                        </p>
                      </div>
                    ) : (
                      <>
                        {/* UNLOCKED: SUNAT FORMATO 1.1 LIBRO DE INVENTARIOS Y BALANCES */}
                        <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 space-y-4 animate-fadeIn">
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-800 pb-3">
                            <div>
                              <span className="text-[9px] bg-indigo-600 text-white font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono">
                                SUNAT FORMATO 1.1 — LIBRO DE INVENTARIOS Y BALANCES
                              </span>
                              <h3 className="text-base font-bold text-white font-heading mt-1">Estado de Situación Financiera Oficial</h3>
                              <p className="text-xs text-slate-400 font-sans">
                                Detalle pormenorizado de los activos, pasivos y patrimonio neto al término del ejercicio comercial.
                              </p>
                            </div>
                            <div className="bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700 text-xs font-mono font-bold text-slate-300">
                              ESTADO: <span className="text-emerald-400">HABILITADO TRAMO 3 (&gt;500 UIT)</span>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                            <div className="space-y-1">
                              <div><span className="text-slate-400 font-bold">RUC:</span> <span className="font-mono">{ruc || '20123456789'}</span></div>
                              <div><span className="text-slate-400 font-bold">Razón Social:</span> <span>{solUser || 'Mi Negocio MYPE S.A.C.'}</span></div>
                            </div>
                            <div className="space-y-1 sm:text-right font-mono">
                              <div><span className="text-slate-400 font-sans font-bold">Periodo:</span> <span>{period}</span></div>
                              <div><span className="text-slate-400 font-sans font-bold">Moneda:</span> <span>Soles (S/.)</span></div>
                            </div>
                          </div>
                        </div>

                        {(() => {
                          const entries = allPeriodEntries;
                          
                          const cajaBancos = entries.filter(e => e.cuenta.startsWith('10')).reduce((sum, e) => sum + (e.debe - e.haber), 0);
                          const ctasPorCobrar = entries.filter(e => e.cuenta.startsWith('12')).reduce((sum, e) => sum + (e.debe - e.haber), 0);
                          const mercaderias = entries.filter(e => e.cuenta.startsWith('20')).reduce((sum, e) => sum + (e.debe - e.haber), 0);
                          const activoNoCorr = entries.filter(e => e.cuenta.startsWith('33')).reduce((sum, e) => sum + (e.debe - e.haber), 0);

                          const tributos = entries.filter(e => e.cuenta.startsWith('40')).reduce((sum, e) => sum + (e.haber - e.debe), 0);
                          const planillas = entries.filter(e => e.cuenta.startsWith('41')).reduce((sum, e) => sum + (e.haber - e.debe), 0);
                          const ctasPorPagar = entries.filter(e => e.cuenta.startsWith('42')).reduce((sum, e) => sum + (e.haber - e.debe), 0);

                          const capitalSocial = entries.filter(e => e.cuenta.startsWith('50')).reduce((sum, e) => sum + (e.haber - e.debe), 0);
                          const ingresosSum = entries.filter(e => e.cuenta.startsWith('70')).reduce((sum, e) => sum + (e.haber - e.debe), 0);
                          const gastosSum = entries.filter(e => e.cuenta.startsWith('60') || e.cuenta.startsWith('62') || e.cuenta.startsWith('63') || e.cuenta.startsWith('69') || e.cuenta.startsWith('94') || e.cuenta.startsWith('95')).reduce((sum, e) => sum + (e.debe - e.haber), 0);
                          const utilidadPeriodo = ingresosSum - gastosSum;

                          const totalActivo = cajaBancos + ctasPorCobrar + mercaderias + activoNoCorr;
                          const totalPasivo = tributos + planillas + ctasPorPagar;
                          const totalPatrimonio = capitalSocial + utilidadPeriodo;

                          return (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                              {/* ACTIVO PANEL */}
                              <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-3xs space-y-3 animate-fadeIn">
                                <h4 className="text-xs font-black text-slate-800 border-b border-slate-100 pb-2 uppercase tracking-wider flex items-center gap-1.5">
                                  <span className="text-base">📈</span> ACTIVO (Bienes y Derechos de la Empresa)
                                </h4>
                                <div className="space-y-2 text-xs font-sans">
                                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                                    <span className="font-mono text-slate-500 font-bold">101/1041 - Efectivo y Equivalentes</span>
                                    <span className="font-mono font-bold text-slate-900">S/. {cajaBancos.toFixed(2)}</span>
                                  </div>
                                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                                    <span className="font-mono text-slate-500 font-bold">1212 - Cuentas por Cobrar Comerciales</span>
                                    <span className="font-mono font-bold text-slate-900">S/. {ctasPorCobrar.toFixed(2)}</span>
                                  </div>
                                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                                    <span className="font-mono text-slate-500 font-bold">20111 - Mercaderías (Almacén)</span>
                                    <span className="font-mono font-bold text-slate-900">S/. {mercaderias.toFixed(2)}</span>
                                  </div>
                                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                                    <span className="font-mono text-slate-500 font-bold">3341 - Propiedades, Planta y Equipo</span>
                                    <span className="font-mono font-bold text-slate-900">S/. {activoNoCorr.toFixed(2)}</span>
                                  </div>
                                  <div className="flex justify-between py-2.5 bg-emerald-50 px-3 rounded-xl font-bold text-emerald-950 font-sans mt-3">
                                    <span>TOTAL ACTIVO:</span>
                                    <span className="font-mono font-black">S/. {totalActivo.toFixed(2)}</span>
                                  </div>
                                </div>
                              </div>

                              {/* PASIVO & PATRIMONIO PANEL */}
                              <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-3xs space-y-4 flex flex-col justify-between animate-fadeIn">
                                <div>
                                  <h4 className="text-xs font-black text-slate-800 border-b border-slate-100 pb-2 uppercase tracking-wider flex items-center gap-1.5">
                                    <span className="text-base">🏛️</span> PASIVO Y PATRIMONIO (Financiamiento externo e interno)
                                  </h4>
                                  <div className="space-y-2 text-xs font-sans">
                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Obligaciones (Pasivo)</div>
                                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                                      <span className="font-mono text-slate-500 font-bold">40111 - Tributos por Pagar (SUNAT)</span>
                                      <span className="font-mono font-bold text-slate-900">S/. {tributos.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                                      <span className="font-mono text-slate-500 font-bold">4111 - Remuneraciones por Pagar (Planilla)</span>
                                      <span className="font-mono font-bold text-slate-900">S/. {planillas.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                                      <span className="font-mono text-slate-500 font-bold">4212 - Cuentas por Pagar Comerciales (Proveedores)</span>
                                      <span className="font-mono font-bold text-slate-900">S/. {ctasPorPagar.toFixed(2)}</span>
                                    </div>

                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-3.5">Capital y Ganancias (Patrimonio)</div>
                                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                                      <span className="font-mono text-slate-500 font-bold">5011 - Capital Social Autorizado</span>
                                      <span className="font-mono font-bold text-slate-900">S/. {capitalSocial.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                                      <span className="font-mono text-slate-500 font-bold">5911 - Resultado de Ejercicios (Utilidad Periodo)</span>
                                      <span className="font-mono font-bold text-slate-900">S/. {utilidadPeriodo.toFixed(2)}</span>
                                    </div>
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <div className="flex justify-between py-1 bg-slate-50 px-3 rounded-lg text-slate-700 font-bold font-sans">
                                    <span>TOTAL PASIVO:</span>
                                    <span className="font-mono font-extrabold">S/. {totalPasivo.toFixed(2)}</span>
                                  </div>
                                  <div className="flex justify-between py-1 bg-slate-50 px-3 rounded-lg text-slate-700 font-bold font-sans">
                                    <span>TOTAL PATRIMONIO:</span>
                                    <span className="font-mono font-extrabold">S/. {totalPatrimonio.toFixed(2)}</span>
                                  </div>
                                  <div className="flex justify-between py-2.5 bg-indigo-50 px-3 rounded-xl font-bold text-indigo-950 font-sans mt-2">
                                    <span>TOTAL PASIVO + PATRIMONIO:</span>
                                    <span className="font-mono font-black">S/. {(totalPasivo + totalPatrimonio).toFixed(2)}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })()}
                      </>
                    )}
                  </div>
                )}

                {selectedDiarioTab === 'catalogo' && (
                  <div className="space-y-6 animate-fadeIn">
                    {/* SUMMARY CARDS */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-slate-50 border border-slate-200/80 p-4.5 rounded-2xl">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">Total en Catálogo</span>
                        <div className="text-2xl font-black text-slate-900 font-mono">
                          {catalogItems.length} <span className="text-xs font-bold text-slate-500 font-sans">Productos / Servicios</span>
                        </div>
                      </div>
                      <div className="bg-indigo-50/40 border border-indigo-100/80 p-4.5 rounded-2xl">
                        <span className="text-[10px] font-black text-indigo-800 uppercase tracking-wider block mb-1">Mercaderías Físicas</span>
                        <div className="text-2xl font-black text-indigo-950 font-mono">
                          {catalogItems.filter((c: any) => c.isPhysical).length} <span className="text-xs font-bold text-indigo-650 font-sans">Inventariables</span>
                        </div>
                      </div>
                      <div className="bg-emerald-50/40 border border-emerald-100/80 p-4.5 rounded-2xl">
                        <span className="text-[10px] font-black text-emerald-800 uppercase tracking-wider block mb-1">Servicios / Conceptos</span>
                        <div className="text-2xl font-black text-emerald-950 font-mono">
                          {catalogItems.filter((c: any) => !c.isPhysical).length} <span className="text-xs font-bold text-emerald-650 font-sans">No inventariables</span>
                        </div>
                      </div>
                    </div>

                    {/* MAIN INTERFACE: ADD FORM AND LIST */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                      {/* LEFT COLUMN: ADD PRODUCT */}
                      <div className="lg:col-span-4 bg-white border border-slate-200/80 rounded-2xl p-5 space-y-4">
                        <div className="border-b border-slate-100 pb-3">
                          <h3 className="font-heading font-black text-xs text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                            <PlusCircle className="w-4 h-4 text-emerald-500" /> Registrar Nuevo Producto
                          </h3>
                          <p className="text-[10px] text-slate-400 mt-1">Guarda productos predeterminados para emitir ventas y compras rápidamente.</p>
                        </div>

                        <div className="space-y-3.5">
                          <div>
                            <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Nombre / Descripción *</label>
                            <input
                              type="text"
                              placeholder="Ej. Suministros Lote Premium"
                              value={newProdDesc}
                              onChange={(e) => setNewProdDesc(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs focus:ring-2 focus:ring-indigo-500 font-bold text-slate-800 placeholder-slate-400"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Precio Unitario (S/.) *</label>
                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                placeholder="120"
                                value={newProdPrecio}
                                onChange={(e) => setNewProdPrecio(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs focus:ring-2 focus:ring-indigo-500 font-bold text-slate-800 font-mono"
                              />
                            </div>

                            <div>
                              <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Tipo de Uso *</label>
                              <select
                                value={newProdTipo}
                                onChange={(e) => setNewProdTipo(e.target.value as any)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs focus:ring-2 focus:ring-indigo-500 font-bold text-slate-800 cursor-pointer"
                              >
                                <option value="VENTA">Venta (Ingreso)</option>
                                <option value="COMPRA">Compra (Egreso)</option>
                              </select>
                            </div>
                          </div>

                          <div>
                            <label className="text-[10px] font-black text-slate-500 uppercase block mb-1.5">Naturaleza del Producto</label>
                            <div className="grid grid-cols-2 gap-2">
                              <button
                                type="button"
                                onClick={() => setNewProdIsPhysical(true)}
                                className={`py-2 px-3 rounded-xl border text-center text-xs font-bold transition-all cursor-pointer ${
                                  newProdIsPhysical
                                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                                    : 'bg-slate-50 border-slate-200 text-slate-650 hover:bg-slate-100'
                                }`}
                              >
                                📦 Producto Físico
                              </button>
                              <button
                                type="button"
                                onClick={() => setNewProdIsPhysical(false)}
                                className={`py-2 px-3 rounded-xl border text-center text-xs font-bold transition-all cursor-pointer ${
                                  !newProdIsPhysical
                                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                                    : 'bg-slate-50 border-slate-200 text-slate-650 hover:bg-slate-100'
                                }`}
                              >
                                💼 Servicio / Concepto
                              </button>
                            </div>
                          </div>

                          {newProdIsPhysical && (
                            <div className="p-3 bg-slate-50 border border-slate-200/60 rounded-xl space-y-3 animate-fadeIn">
                              <div className="grid grid-cols-2 gap-3.5">
                                <div>
                                  <label className="text-[9px] font-black text-slate-500 uppercase block mb-0.5">SKU / Código *</label>
                                  <input
                                    type="text"
                                    placeholder="Ej. MER-101"
                                    value={newProdSku}
                                    onChange={(e) => setNewProdSku(e.target.value)}
                                    className="w-full bg-white border border-slate-200 rounded-xl py-1.5 px-2.5 text-xs focus:ring-2 focus:ring-indigo-500 font-bold text-slate-800 font-mono"
                                  />
                                </div>
                                <div>
                                  <label className="text-[9px] font-black text-slate-500 uppercase block mb-0.5">Unidad de Medida *</label>
                                  <input
                                    type="text"
                                    placeholder="Ej. Unidades, Cajas"
                                    value={newProdUnidad}
                                    onChange={(e) => setNewProdUnidad(e.target.value)}
                                    className="w-full bg-white border border-slate-200 rounded-xl py-1.5 px-2.5 text-xs focus:ring-2 focus:ring-indigo-500 font-bold text-slate-800"
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-3.5">
                                <div>
                                  <label className="text-[9px] font-black text-slate-500 uppercase block mb-0.5">Stock Inicial *</label>
                                  <input
                                    type="number"
                                    min="0"
                                    value={newProdStockInicial}
                                    onChange={(e) => setNewProdStockInicial(parseInt(e.target.value) || 0)}
                                    className="w-full bg-white border border-slate-200 rounded-xl py-1.5 px-2.5 text-xs focus:ring-2 focus:ring-indigo-500 font-bold text-slate-800 font-mono"
                                  />
                                </div>
                                <div>
                                  <label className="text-[9px] font-black text-slate-500 uppercase block mb-0.5">Costo Unit. Inicial *</label>
                                  <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={newProdCostoInicial}
                                    onChange={(e) => setNewProdCostoInicial(parseFloat(e.target.value) || 0)}
                                    className="w-full bg-white border border-slate-200 rounded-xl py-1.5 px-2.5 text-xs focus:ring-2 focus:ring-indigo-500 font-bold text-slate-800 font-mono"
                                  />
                                </div>
                              </div>
                            </div>
                          )}

                          <button
                            type="button"
                            onClick={() => {
                              if (!newProdDesc.trim()) {
                                alert('Por favor, ingresa el nombre o descripción del producto.');
                                return;
                              }
                              const price = parseFloat(newProdPrecio);
                              if (isNaN(price) || price < 0) {
                                alert('Por favor, ingresa un precio válido.');
                                return;
                              }
                              if (newProdIsPhysical && !newProdSku.trim()) {
                                alert('Por favor, ingresa el código SKU del producto físico.');
                                return;
                              }

                              const newItem = {
                                id: 'prod_' + Date.now(),
                                desc: newProdDesc.trim(),
                                precio: price,
                                tipo: newProdTipo,
                                isPhysical: newProdIsPhysical,
                                sku: newProdIsPhysical ? newProdSku.trim().toUpperCase() : undefined,
                                unidad: newProdIsPhysical ? newProdUnidad.trim() : 'Servicios',
                                stockInicial: newProdIsPhysical ? newProdStockInicial : undefined,
                                costoInicial: newProdIsPhysical ? newProdCostoInicial : undefined
                              };

                              setCatalogItems((prev: any) => [...prev, newItem]);

                              // Reset form fields
                              setNewProdDesc('');
                              setNewProdPrecio('');
                              setNewProdSku('');
                              setNewProdUnidad('Unidades');
                              setNewProdStockInicial(0);
                              setNewProdCostoInicial(0);
                              alert('🎉 ¡Producto guardado como predeterminado en el catálogo con éxito!');
                            }}
                            className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-colors shadow-md shadow-emerald-650/15 flex items-center justify-center gap-2 cursor-pointer select-none"
                          >
                            💾 Guardar en Catálogo Predeterminado
                          </button>
                        </div>
                      </div>

                      {/* RIGHT COLUMN: CATALOG LIST */}
                      <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-slate-100 dark:border-slate-850 pb-3 gap-2">
                          <div>
                            <h3 className="font-heading font-black text-xs text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                              🏷️ Catálogo de Productos Registrados
                            </h3>
                            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">Sube precios, baja precios o elimina productos del catálogo comercial.</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm('¿Estás seguro de que deseas reiniciar todo el catálogo a los productos de fábrica? Se perderán tus productos agregados.')) {
                                setCatalogItems(MOCK_CATALOG);
                              }
                            }}
                            className="text-[10px] text-slate-400 dark:text-slate-500 hover:text-rose-650 font-bold border border-slate-200 dark:border-slate-800 hover:border-rose-200 py-1 px-2.5 rounded-lg transition-colors cursor-pointer"
                          >
                            🔄 Reiniciar Catálogo
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[550px] overflow-y-auto pr-1">
                          {catalogItems.map((prod: any) => {
                            const isEditing = editingProductId === prod.id;
                            return (
                              <div 
                                key={prod.id} 
                                className="border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/30 dark:hover:bg-slate-950/40 transition-all flex flex-col justify-between"
                              >
                                <div className="space-y-1.5">
                                  <div className="flex justify-between items-start">
                                    <span className={`text-[9px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider ${
                                      prod.isPhysical 
                                        ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-350' 
                                        : 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-350'
                                    }`}>
                                      {prod.isPhysical ? `📦 Físico • ${prod.sku}` : '💼 Servicio / Concepto'}
                                    </span>
                                    <span className={`text-[9.5px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider font-mono ${
                                      prod.tipo === 'VENTA' 
                                        ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300' 
                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                                    }`}>
                                      {prod.tipo}
                                    </span>
                                  </div>

                                  {isEditing ? (
                                    <div className="space-y-2 mt-1">
                                      <input
                                        type="text"
                                        value={editingProductDesc}
                                        onChange={(e) => setEditingProductDesc(e.target.value)}
                                        className="w-full bg-white dark:bg-slate-950 border border-indigo-300 dark:border-slate-800 rounded-lg py-1 px-2 text-xs font-bold text-slate-800 dark:text-slate-100"
                                      />
                                      <div className="flex gap-2 items-center">
                                        <span className="text-xs font-bold text-slate-400 font-mono">S/.</span>
                                        <input
                                          type="number"
                                          step="0.01"
                                          value={editingProductPrice}
                                          onChange={(e) => setEditingProductPrice(e.target.value)}
                                          className="w-24 bg-white dark:bg-slate-950 border border-indigo-300 dark:border-slate-800 rounded-lg py-1 px-2 text-xs font-bold text-slate-800 dark:text-slate-100 font-mono"
                                        />
                                      </div>
                                    </div>
                                  ) : (
                                    <>
                                      <h4 className="font-heading font-extrabold text-sm text-slate-800 dark:text-slate-200">{prod.desc}</h4>
                                      <div className="flex items-baseline gap-1 pt-1">
                                        <span className="text-[10px] text-slate-400 font-bold">Precio Unitario:</span>
                                        <span className="text-sm font-black text-slate-900 dark:text-slate-100 font-mono">S/. {prod.precio.toFixed(2)}</span>
                                      </div>
                                    </>
                                  )}

                                  {prod.isPhysical && (
                                    <div className="grid grid-cols-2 gap-2 text-[10px] bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-850 p-2 rounded-xl text-slate-500 dark:text-slate-400 font-mono">
                                      <div>📦 Medida: <span className="font-bold text-slate-700 dark:text-slate-300">{prod.unidad}</span></div>
                                      <div>📈 Stock Ini: <span className="font-bold text-slate-700 dark:text-slate-300">{prod.stockInicial}</span></div>
                                      <div className="col-span-2">💰 Costo Unit. Ini: <span className="font-bold text-slate-700 dark:text-slate-300">S/. {(prod.costoInicial ?? 0).toFixed(2)}</span></div>
                                    </div>
                                  )}
                                </div>

                                {/* ACTIONS ROW */}
                                <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex flex-wrap justify-between items-center gap-2">
                                  {isEditing ? (
                                    <div className="flex gap-2 w-full justify-end">
                                      <button
                                        type="button"
                                        onClick={() => setEditingProductId(null)}
                                        className="text-[10px] font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 py-1 px-2.5 rounded-lg transition-colors cursor-pointer"
                                      >
                                        Cancelar
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const pPrice = parseFloat(editingProductPrice);
                                          if (isNaN(pPrice) || pPrice < 0) {
                                            alert('Precio inválido');
                                            return;
                                          }
                                          if (!editingProductDesc.trim()) {
                                            alert('Descripción inválida');
                                            return;
                                          }
                                          setCatalogItems((prev: any) => prev.map((c: any) => 
                                            c.id === prod.id ? { ...c, desc: editingProductDesc.trim(), precio: pPrice } : c
                                          ));
                                          setEditingProductId(null);
                                        }}
                                        className="text-[10px] font-bold bg-indigo-600 hover:bg-indigo-700 text-white py-1 px-2.5 rounded-lg transition-colors cursor-pointer"
                                      >
                                        Guardar
                                      </button>
                                    </div>
                                  ) : (
                                    <>
                                      <div className="flex items-center gap-1.5">
                                        {/* QUICK PRICE UP */}
                                        <button
                                          type="button"
                                          title="Subir precio S/. 10"
                                          onClick={() => {
                                            setCatalogItems((prev: any) => prev.map((c: any) => 
                                              c.id === prod.id ? { ...c, precio: Number((c.precio + 10).toFixed(2)) } : c
                                            ));
                                          }}
                                          className="text-[10.5px] bg-emerald-50 dark:bg-emerald-950/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/65 text-emerald-700 dark:text-emerald-400 font-bold py-1 px-2 rounded-lg transition-colors cursor-pointer flex items-center gap-0.5"
                                        >
                                          📈 +S/.10
                                        </button>
                                        {/* QUICK PRICE DOWN */}
                                        <button
                                          type="button"
                                          title="Bajar precio S/. 10"
                                          onClick={() => {
                                            setCatalogItems((prev: any) => prev.map((c: any) => 
                                              c.id === prod.id ? { ...c, precio: Math.max(1, Number((c.precio - 10).toFixed(2))) } : c
                                            ));
                                          }}
                                          className="text-[10.5px] bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100 dark:hover:bg-rose-900/65 text-rose-700 dark:text-rose-400 font-bold py-1 px-2 rounded-lg transition-colors cursor-pointer flex items-center gap-0.5"
                                        >
                                          📉 -S/.10
                                        </button>
                                      </div>

                                      <div className="flex items-center gap-1.5 ml-auto">
                                        {/* EDIT BUTTON */}
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setEditingProductId(prod.id);
                                            setEditingProductPrice(prod.precio.toString());
                                            setEditingProductDesc(prod.desc);
                                          }}
                                          className="text-[10px] font-bold border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-950 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 py-1 px-2.5 rounded-lg transition-colors cursor-pointer"
                                        >
                                          Editar
                                        </button>

                                        {/* DELETE BUTTON */}
                                        <button
                                          type="button"
                                          onClick={() => {
                                            if (window.confirm(`¿Estás seguro de que deseas eliminar "${prod.desc}" del catálogo?`)) {
                                              setCatalogItems((prev: any) => prev.filter((c: any) => c.id !== prod.id));
                                            }
                                          }}
                                          className="text-[10px] font-bold bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100 dark:hover:bg-rose-900/65 text-rose-600 dark:text-rose-400 py-1 px-2.5 rounded-lg transition-colors cursor-pointer"
                                        >
                                          Eliminar
                                        </button>
                                      </div>
                                    </>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        {/* INFORMATIVE SECTION: COMPREHENSIVE RMT GUIDE - BENTO ROW */}
        {activeView === 'sunat' && (
          <div id="rmt-guide-grid" className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
          <div className={`${cardBg} rounded-3xl p-6 border space-y-3`}>
            <div className="bg-emerald-50 dark:bg-slate-950 text-emerald-700 dark:text-emerald-400 w-10 h-10 rounded-2xl flex items-center justify-center font-bold">
              1%
            </div>
            <h3 className="font-heading font-bold text-base text-slate-900 dark:text-slate-100">Pagos a Cuenta de Renta</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
              Si tus ingresos netos mensuales no superan las 300 UIT en el año fiscal, pagas únicamente el <strong>1.0% de tus ventas base</strong> del mes. Si excedes las 300 UIT pero no superas las 1700 UIT, la tasa del pago mensual a cuenta es del <strong>1.5%</strong>.
            </p>
          </div>

          <div className={`${cardBg} rounded-3xl p-6 border space-y-3`}>
            <div className="bg-indigo-50 dark:bg-slate-950 text-indigo-700 dark:text-indigo-400 w-10 h-10 rounded-2xl flex items-center justify-center font-bold">
              ⚖️
            </div>
            <h3 className="font-heading font-bold text-base text-slate-900 dark:text-slate-100">Difiere con IGV Justo</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
              La Ley 30524 faculta a las microempresas (ventas de hasta 1700 UIT) a prorrogar hasta por <strong>3 meses o 90 días</strong> el pago efectivo del IGV de sus declaraciones mensuales, siempre que no tengan deudas tributarias firmes o socios con mal comportamiento de pago.
            </p>
          </div>

          <div className={`${cardBg} rounded-3xl p-6 border space-y-3`}>
            <div className="bg-amber-50 dark:bg-slate-950 text-amber-700 dark:text-amber-400 w-10 h-10 rounded-2xl flex items-center justify-center font-bold">
              📂
            </div>
            <h3 className="font-heading font-bold text-base text-slate-900 dark:text-slate-100">SIRE de la SUNAT</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
              Con la masificación del Sistema Integrado de Registros Electrónicos (SIRE), la SUNAT pre-elabora tus registros de Compras y Ventas basándose en la emisión electrónica de facturas. ¡Asegura que todos tus comprobantes estén aprobados y cuadrados antes del vencimiento!
            </p>
          </div>
        </div>
      )}

    </div>
  </div>

      {/* MANUAL STOCK MOVEMENT MODAL */}
      {showManualStockModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto font-sans">
          <div className="bg-white rounded-3xl overflow-hidden shadow-2xl max-w-lg w-full flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="bg-slate-900 text-white px-6 py-4 flex justify-between items-center">
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider font-heading flex items-center gap-1.5">
                  📦 Movimiento Manual de Almacén
                </h3>
                <p className="text-[11px] text-slate-400">
                  Ingreso o salida directa de inventario sin generar facturas comerciales
                </p>
              </div>
              <button 
                onClick={() => setShowManualStockModal(false)}
                className="text-white hover:text-slate-300 text-xl font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Form */}
            <form onSubmit={(e) => {
              e.preventDefault();
              const qty = manualStockQty;
              const cost = parseFloat(manualStockCost);
              if (isNaN(cost) || cost <= 0 || qty <= 0) {
                alert('Por favor, ingresa cantidad y costo válidos.');
                return;
              }
              const selectedProduct = catalogItems.find((p: any) => p.id === manualStockProduct);
              if (!selectedProduct) return;

              const totalVal = qty * cost;
              const doc = manualStockDoc.trim() || `MV-${Math.floor(Math.random() * 90000) + 10000}`;
              const glo = manualStockGlosa.trim() || `${manualStockType === 'INGRESO' ? 'Ingreso' : 'Salida'} manual de ${selectedProduct.desc}`;

              const newManualTx: Transaction = {
                id: 'tx_user_' + Date.now(),
                fecha: mFecha,
                tipo: manualStockType === 'INGRESO' ? 'COMPRA' : 'VENTA', // internal accounting fallback
                montoBase: totalVal,
                igv: 0,
                total: totalVal,
                glosa: glo,
                rucClienteProveedor: '20100200300', // Internal warehouse code
                documento: doc,
                creadoPor: currentUserRole,
                esMovimientoInventario: true,
                tipoInventario: manualStockType,
                catalogItemId: manualStockProduct,
                cantidad: qty,
                precioUnitario: cost
              };

              setTransactions(prev => [newManualTx, ...prev]);
              setShowManualStockModal(false);
              setManualStockGlosa('');
              setManualStockDoc('');
            }} className="p-6 space-y-4 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Tipo de Movimiento</label>
                  <select
                    value={manualStockType}
                    onChange={(e) => setManualStockType(e.target.value as 'INGRESO' | 'SALIDA')}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs focus:ring-2 focus:ring-indigo-500 font-bold text-slate-800 cursor-pointer"
                  >
                    <option value="INGRESO">📥 Ingreso (Entrada a Stock)</option>
                    <option value="SALIDA">📤 Salida (Egreso de Stock)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Producto Físico</label>
                  <select
                    value={manualStockProduct}
                    onChange={(e) => {
                      const id = e.target.value;
                      setManualStockProduct(id);
                      const prod = catalogItems.find((p: any) => p.id === id);
                      if (prod) setManualStockCost(prod.costoInicial ? prod.costoInicial.toString() : '100');
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs focus:ring-2 focus:ring-indigo-500 font-bold text-slate-800 cursor-pointer"
                  >
                    {catalogItems.filter((c: any) => c.isPhysical).map((c: any) => (
                      <option key={c.id} value={c.id}>{c.desc} ({c.sku})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Cantidad</label>
                  <input
                    type="number"
                    min={1}
                    value={manualStockQty}
                    onChange={(e) => setManualStockQty(parseInt(e.target.value) || 1)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-mono font-bold text-slate-800"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Costo Unitario (S/.)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={manualStockCost}
                    onChange={(e) => setManualStockCost(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-mono font-bold text-slate-800"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Documento de Referencia (Ej: Guía de Remisión, etc)</label>
                <input
                  type="text"
                  placeholder="Ej: GR01-00045"
                  value={manualStockDoc}
                  onChange={(e) => setManualStockDoc(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-mono text-slate-800"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Glosa / Motivo del Movimiento</label>
                <input
                  type="text"
                  placeholder="Ej: Ajuste de inventario físico de fin de mes, mermas"
                  value={manualStockGlosa}
                  onChange={(e) => setManualStockGlosa(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-800"
                  required
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowManualStockModal(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 px-4 rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-xl text-xs transition-colors cursor-pointer shadow-md shadow-indigo-600/10"
                >
                  Confirmar Movimiento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* HIGH FIDELITY MODAL OVERLAY FOR OPERATIONS */}
      {activeModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto font-sans">
          <div className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl max-w-3xl w-full flex flex-col max-h-[90vh] border border-transparent dark:border-slate-800">
            
            {/* Modal Header */}
            <div className="bg-slate-900 text-white px-6 py-4 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold font-heading">
                  {activeModal === 'VENTA' && 'Registrar venta'}
                  {activeModal === 'COMPRA' && 'Registrar compra de gastos'}
                  {activeModal === 'COBRO' && 'Registrar cobro'}
                  {activeModal === 'PAGO' && 'Registrar pago'}
                  {activeModal === 'TRANSFERENCIA' && 'Movimiento de caja/banco'}
                  {activeModal === 'APERTURA' && 'Registrar aporte de capital'}
                </h3>
                <p className="text-xs text-slate-400">
                  {activeModal === 'VENTA' && 'Cuando la empresa vende productos o servicios'}
                  {activeModal === 'COMPRA' && 'Cuando la empresa adquiere bienes, servicios o activos'}
                  {activeModal === 'COBRO' && 'Registro de ingreso de dinero de facturas pendientes'}
                  {activeModal === 'PAGO' && 'Registro de egreso de dinero para cancelar obligaciones'}
                  {activeModal === 'TRANSFERENCIA' && 'Transferencias internas de dinero entre cuentas de la empresa'}
                  {activeModal === 'APERTURA' && 'Registro de aporte de capital social de socios en efectivo o transferencia'}
                </p>
              </div>
              <button 
                onClick={() => setActiveModal(null)}
                className="text-white hover:text-slate-300 text-2xl font-semibold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Body Container */}
            <div className="p-6 bg-slate-50 flex-1 overflow-y-auto space-y-6">
              
              {/* Active Flow Status Bar */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 flex justify-between items-center shadow-xs">
                <div className="text-xs text-slate-600 font-bold flex items-center gap-2">
                  <span>Flujo activo:</span>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest ${
                    activeModal === 'VENTA' ? 'bg-emerald-100 text-emerald-800' :
                    activeModal === 'COMPRA' ? 'bg-indigo-100 text-indigo-800' :
                    activeModal === 'COBRO' ? 'bg-teal-100 text-teal-800' :
                    activeModal === 'PAGO' ? 'bg-rose-100 text-rose-800' :
                    activeModal === 'TRANSFERENCIA' ? 'bg-amber-100 text-amber-800' : 'bg-purple-100 text-purple-800'
                  }`}>
                    {activeModal === 'APERTURA' ? 'APORTE CAPITAL' : activeModal}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-bold border border-slate-200 hover:border-slate-300 bg-slate-50 rounded-lg px-3 py-1.5 transition-colors cursor-pointer"
                >
                  ← Volver a elegir operación
                </button>
              </div>

              <form onSubmit={handleModalSave} className="space-y-6">
                
                {/* 1. DATOS PRINCIPALES DE LA OPERACIÓN */}
                <div className="space-y-3.5 bg-white dark:bg-slate-900/90 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
                  <h4 className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-850 pb-2">
                    1. DATOS PRINCIPALES DE LA OPERACIÓN
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* FECHA DE OPERACIÓN */}
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1">Fecha de Operación</label>
                      <input 
                        type="date" 
                        value={mFecha}
                        onChange={(e) => setMFecha(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 font-bold text-slate-800 dark:text-slate-100"
                        required
                      />
                    </div>

                    {/* TIPO DE COMPROBANTE */}
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1">Tipo de Comprobante</label>
                      <select 
                        value={mTipoComprobante}
                        onChange={(e) => setMTipoComprobante(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 font-bold text-slate-800 dark:text-slate-100 cursor-pointer"
                      >
                        {activeModal === 'VENTA' && (
                          <>
                            <option value="Factura" className="dark:bg-slate-900">Factura Electrónica</option>
                            <option value="Boleta" className="dark:bg-slate-900">Boleta de Venta Electrónica</option>
                            <option value="Nota de Crédito" className="dark:bg-slate-900">Nota de Crédito</option>
                            <option value="Nota de Débito" className="dark:bg-slate-900">Nota de Débito</option>
                          </>
                        )}
                        {activeModal === 'COMPRA' && (
                          <>
                            <option value="Factura" className="dark:bg-slate-900">Factura de Proveedor</option>
                            <option value="Boleta" className="dark:bg-slate-900">Boleta de Venta</option>
                            <option value="Recibo de Honorarios" className="dark:bg-slate-900">Recibo por Honorarios (10% Ret.)</option>
                            <option value="Declaración Importación" className="dark:bg-slate-900">Declaración Aduanera (DAM)</option>
                          </>
                        )}
                        {(activeModal === 'COBRO' || activeModal === 'PAGO' || activeModal === 'TRANSFERENCIA' || activeModal === 'APERTURA') && (
                          <>
                            <option value="Recibo de Caja" className="dark:bg-slate-900">Recibo de Caja</option>
                            <option value="Voucher Bancario" className="dark:bg-slate-900">Voucher de Depósito / Transferencia</option>
                            <option value="Nota de Débito" className="dark:bg-slate-900">Nota de Cargo / Nota de Débito</option>
                          </>
                        )}
                      </select>
                    </div>

                    {/* SERIE Y NÚMERO */}
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1">Serie y Número</label>
                      <input 
                        type="text" 
                        placeholder={activeModal === 'VENTA' ? 'F001-0000101' : 'FT01-1245'}
                        value={mSerieNumero}
                        onChange={(e) => setMSerieNumero(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 font-mono font-bold text-slate-800 dark:text-slate-100"
                        required
                      />
                    </div>
                  </div>

                  {activeModal !== 'TRANSFERENCIA' && (
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-1.5">
                      {/* RUC / DNI */}
                      <div className="md:col-span-4 animate-fadeIn">
                        <div className="flex justify-between items-center mb-1">
                          <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                            {activeModal === 'VENTA' || activeModal === 'COBRO' ? 'RUC / DNI Cliente' : activeModal === 'APERTURA' ? 'RUC / DNI Socio' : 'RUC / DNI Proveedor'}
                          </label>
                          <button
                            type="button"
                            onClick={() => handleConsultaRucDni(mRuc)}
                            disabled={loadingConsulta || (mRuc.length !== 8 && mRuc.length !== 11)}
                            className="text-[9px] font-black uppercase text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 disabled:opacity-40 disabled:hover:text-indigo-600 flex items-center gap-1 transition-all focus:outline-none"
                            title="Validar y rellenar automáticamente vía SUNAT/RENIEC"
                          >
                            {loadingConsulta ? (
                              <span className="flex items-center gap-1">
                                <svg className="animate-spin h-2.5 w-2.5 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Consultando...
                              </span>
                            ) : (
                              '🔍 Consulta Rápida'
                            )}
                          </button>
                        </div>
                        <input 
                          type="text" 
                          placeholder="Ej. 20110000101"
                          maxLength={11}
                          value={mRuc}
                          onChange={(e) => {
                            setMRuc(e.target.value.replace(/\D/g, ''));
                            if (consultaStatus.type) {
                              setConsultaStatus({ type: null, message: '' });
                            }
                          }}
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 font-mono font-bold text-slate-800 dark:text-slate-100"
                          required
                        />
                      </div>

                      {/* CLIENTE / RAZÓN SOCIAL */}
                      <div className="md:col-span-8 animate-fadeIn">
                        <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                          {activeModal === 'VENTA' || activeModal === 'COBRO' ? 'Cliente / Razón Social' : activeModal === 'APERTURA' ? 'Socio / Nombre Completo' : 'Proveedor / Razón Social'}
                        </label>
                        <input 
                          type="text" 
                          placeholder="Nombre o Razón Social Comercial"
                          value={mClienteProveedor}
                          onChange={(e) => setMClienteProveedor(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 font-bold text-slate-800 dark:text-slate-100"
                          required
                        />
                      </div>

                      {/* Consulta Status Banner */}
                      {consultaStatus.message && (
                        <div className="md:col-span-12 -mt-2 animate-fadeIn">
                          <div className={`px-3.5 py-2 rounded-xl text-xs font-semibold border ${
                            consultaStatus.type === 'success' 
                              ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/30 text-emerald-700 dark:text-emerald-400' 
                              : 'bg-red-50 dark:bg-red-950/20 border-red-100 dark:border-red-900/30 text-red-700 dark:text-red-400'
                          } flex items-center gap-1.5`}>
                            <span className="text-sm">{consultaStatus.type === 'success' ? '✓' : 'ℹ'}</span>
                            <span>{consultaStatus.message}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* 2. DETALLE DE LA TRANSACCIÓN Y BASE IMPONIBLE */}
                <div className="space-y-3.5 bg-white dark:bg-slate-900/90 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
                  <h4 className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-850 pb-2">
                    2. DETALLE DE LA TRANSACCIÓN Y BASE IMPONIBLE
                  </h4>
                  
                  {/* For Sales and Purchases (items, quantity, unit price) */}
                  {(activeModal === 'VENTA' || activeModal === 'COMPRA') ? (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                        {/* PRODUCT/SERVICE SELECTION */}
                        <div className="md:col-span-6">
                          <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1">
                            {activeModal === 'VENTA' ? 'Producto o Servicio Vendido' : 'Bien o Servicio Comprado'}
                          </label>
                          <input
                            type="text"
                            placeholder={activeModal === 'VENTA' ? "Ej. Suministros de Oficina, Servicio de Consultoría" : "Ej. Alquiler de local, Útiles de escritorio"}
                            value={mMCatalogItem}
                            onChange={(e) => {
                              const selected = e.target.value;
                              setMCatalogItem(selected);
                              // Auto price fill if it matches an item
                              const match = catalogItems.find((c: any) => c.desc.trim().toLowerCase() === selected.trim().toLowerCase());
                              if (match) {
                                setMPrecioUnitario(match.precio.toString());
                              }
                            }}
                            list="catalog-suggestions"
                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 font-bold text-slate-800 dark:text-slate-100"
                            required
                          />
                          <datalist id="catalog-suggestions">
                            {catalogItems.filter((c: any) => c.tipo === activeModal).map((c: any) => (
                              <option key={c.id} value={c.desc} />
                            ))}
                          </datalist>
                          <span className="text-[9px] text-indigo-500 dark:text-indigo-400 font-semibold mt-1 block">
                            💡 Escribe un producto nuevo y se guardará automáticamente en tu catálogo.
                          </span>
                        </div>

                        {/* QUANTITY */}
                        <div className="md:col-span-3">
                          <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1">Cantidad</label>
                          <input 
                            type="number" 
                            min={1}
                            value={mCantidad}
                            onChange={(e) => setMCantidad(parseInt(e.target.value) || 1)}
                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 font-bold text-slate-800 dark:text-slate-100 font-mono text-center"
                            required
                          />
                        </div>

                        {/* UNIT PRICE */}
                        <div className="md:col-span-3">
                          <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1">Precio Unitario (S/.)</label>
                          <input 
                            type="number" 
                            step="0.01"
                            value={mPrecioUnitario}
                            onChange={(e) => setMPrecioUnitario(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 font-bold text-slate-800 dark:text-slate-100 font-mono text-right"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-1.5">
                        {/* IGV TAX TYPE */}
                        <div className="md:col-span-5">
                          <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1">Tipo de afectación al IGV</label>
                          <select
                            value={mAfectacionIGV}
                            onChange={(e) => setMAfectacionIGV(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 font-bold text-slate-800 dark:text-slate-100 cursor-pointer text-[11px]"
                          >
                            <option value="Gravado (Afecto a IGV 18%)" className="dark:bg-slate-900">Gravado (Afecto a IGV 18%)</option>
                            <option value="Exonerado (Sin IGV)" className="dark:bg-slate-900">Exonerado (Art. 19 de la Ley del IGV)</option>
                            <option value="Inafecto (Sin IGV)" className="dark:bg-slate-900">Inafecto (Fuera del ámbito del impuesto)</option>
                          </select>
                        </div>

                        {/* GENERAL GLOSA DESCRIPTION */}
                        <div className="md:col-span-7">
                          <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1">Descripción General / Glosa</label>
                          <input 
                            type="text" 
                            placeholder="Glosa descriptiva para asientos contables"
                            value={mGlosa}
                            onChange={(e) => setMGlosa(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 font-bold text-slate-800 dark:text-slate-100"
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    // For Treasury transactions (Cobros, Pagos, Transferencias)
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                      {/* AMOUNT */}
                      <div className="md:col-span-4">
                        <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1">Monto de Operación (S/.)</label>
                        <input 
                          type="number" 
                          step="0.01"
                          placeholder="Monto en Soles"
                          value={mPrecioUnitario}
                          onChange={(e) => setMPrecioUnitario(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 font-mono font-bold text-slate-800 dark:text-slate-100 text-lg text-right"
                          required
                        />
                      </div>

                      {/* GENERAL GLOSA DESCRIPTION */}
                      <div className="md:col-span-8">
                        <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1">Glosa / Concepto del Movimiento</label>
                        <input 
                          type="text" 
                          placeholder="Ej. Cobro total de factura de cartera F001-000101"
                          value={mGlosa}
                          onChange={(e) => setMGlosa(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 font-bold text-slate-800 dark:text-slate-100"
                          required
                        />
                      </div>
                    </div>
                  )}

                  {/* Detracciones or Retenciones conditional options for sales/purchases */}
                  {(activeModal === 'VENTA' || activeModal === 'COMPRA') && (
                    <div className="bg-slate-50 dark:bg-slate-950 rounded-2xl p-3 border border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row gap-4 items-stretch justify-between">
                      <div className="flex-1 flex items-center gap-2">
                        <input 
                          type="checkbox" 
                          id="mSujetoDetraccion"
                          checked={sujetoDetraccion}
                          onChange={(e) => {
                            setSujetoDetraccion(e.target.checked);
                            if (e.target.checked) setSujetoRetencion(false);
                          }}
                          className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                        />
                        <label htmlFor="mSujetoDetraccion" className="text-xs font-bold text-slate-600 dark:text-slate-350 cursor-pointer select-none flex flex-col">
                          <span>📌 Operación Sujeta a Detracción (SPOT)</span>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-normal">Sujeto a detracción en cuenta BN</span>
                        </label>
                      </div>

                      {sujetoDetraccion && (
                        <div className="flex items-center gap-2">
                          <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Tasa de Detracción:</label>
                          <select 
                            value={tasaDetraccion} 
                            onChange={(e) => setTasaDetraccion(Number(e.target.value))}
                            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-extrabold py-1 px-2.5 rounded-lg text-slate-700 dark:text-slate-200 outline-none cursor-pointer"
                          >
                            <option value={10} className="dark:bg-slate-900">10% (Servicios Generales)</option>
                            <option value={12} className="dark:bg-slate-900">12% (Construcciones y Obras)</option>
                            <option value={4} className="dark:bg-slate-900">4% (Otros Bienes / Pesca)</option>
                          </select>
                        </div>
                      )}

                      {activeModal === 'VENTA' && (
                        <div className="flex-1 flex items-center gap-2 border-t sm:border-t-0 sm:border-l border-slate-200 dark:border-slate-800 pt-2 sm:pt-0 sm:pl-4">
                          <input 
                            type="checkbox" 
                            id="mSujetoRetencion"
                            checked={sujetoRetencion}
                            onChange={(e) => {
                              setSujetoRetencion(e.target.checked);
                              if (e.target.checked) setSujetoDetraccion(false);
                            }}
                            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                          />
                          <label htmlFor="mSujetoRetencion" className="text-xs font-bold text-slate-600 dark:text-slate-350 cursor-pointer select-none flex flex-col">
                            <span>🏢 Retención IGV SUNAT (3%)</span>
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-normal">Cliente es Agente de Retención</span>
                          </label>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* 3. CONDICIONES DE PAGO E INFORMACIÓN DE TESORERÍA */}
                <div className="space-y-3.5 bg-white dark:bg-slate-900/90 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
                  <h4 className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-850 pb-2">
                    3. CONDICIONES DE PAGO E INFORMACIÓN DE TESORERÍA
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* CONDICIÓN DE OPERACIÓN */}
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1">Condición de Operación</label>
                      <select 
                        value={mCondicionOperacion}
                        onChange={(e) => {
                          const val = e.target.value as 'Contado' | 'Crédito';
                          setMCondicionOperacion(val);
                          setMEstadoPago(val === 'Contado' ? 'Pagado' : 'Pendiente');
                        }}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 font-bold text-slate-800 dark:text-slate-100 cursor-pointer"
                      >
                        <option value="Contado" className="dark:bg-slate-900">Al Contado (Inmediato)</option>
                        <option value="Crédito" className="dark:bg-slate-900">Al Crédito (Factura en Cartera)</option>
                      </select>
                    </div>

                    {/* ESTADO DE PAGO */}
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1">Estado de Pago</label>
                      <select 
                        value={mEstadoPago}
                        onChange={(e) => setMEstadoPago(e.target.value as any)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 font-bold text-slate-800 dark:text-slate-100 cursor-pointer"
                      >
                        <option value="Pagado" className="dark:bg-slate-900">
                          {activeModal === 'VENTA' ? 'Cobrado / Liquidado' : 'Pagado / Cancelado'}
                        </option>
                        <option value="Pendiente" className="dark:bg-slate-900">Pendiente de Cobro/Pago</option>
                      </select>
                    </div>

                    {/* FORMA DE PAGO */}
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1">Forma de Pago</label>
                      <select 
                        value={mFormaPago}
                        onChange={(e) => setMFormaPago(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 font-bold text-slate-800 dark:text-slate-100 cursor-pointer"
                      >
                        <option value="Efectivo" className="dark:bg-slate-900">Efectivo en Caja</option>
                        <option value="Transferencia" className="dark:bg-slate-900">Transferencia de Fondos bancarios</option>
                        <option value="Tarjeta de Crédito/Débito" className="dark:bg-slate-900">Tarjeta de Crédito / Débito</option>
                        <option value="Cheque Comercial" className="dark:bg-slate-900">Cheque no Negociable</option>
                        <option value="Depósito en Cuenta" className="dark:bg-slate-900">Depósito bancario directo</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1.5">
                    {/* CUENTA DE DINERO */}
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1">
                        {activeModal === 'TRANSFERENCIA' ? 'Cuenta Origen de Fondos' : 'Cuenta de Dinero / Destino'}
                      </label>
                      <select 
                        value={mCuentaDinero}
                        onChange={(e) => setMCuentaDinero(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 font-bold text-slate-800 dark:text-slate-100 cursor-pointer"
                      >
                        <option value="1041" className="dark:bg-slate-900">Banco - Cuenta Corriente Operativa (1041)</option>
                        <option value="101" className="dark:bg-slate-900">Caja Chica - Efectivo Disponible (101)</option>
                        <option value="1042" className="dark:bg-slate-900">Banco de la Nación - Cuenta de Detracciones (1042)</option>
                      </select>
                    </div>

                    {/* ESTADO INTERNO / OTRAS CUENTAS */}
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1">
                        {activeModal === 'TRANSFERENCIA' ? 'Cuenta Destino de Fondos' : 'Estado Interno del Asiento'}
                      </label>
                      {activeModal === 'TRANSFERENCIA' ? (
                        <select 
                          value={mObservaciones} // using mObservaciones to hold transfer destination temporary
                          onChange={(e) => setMObservaciones(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 font-bold text-slate-800 dark:text-slate-100 cursor-pointer"
                          required
                        >
                          <option value="1041" className="dark:bg-slate-900">Banco - Cuenta Corriente Operativa (1041)</option>
                          <option value="101" className="dark:bg-slate-900">Caja Chica - Efectivo Disponible (101)</option>
                          <option value="1042" className="dark:bg-slate-900">Banco de la Nación - Cuenta de Detracciones (1042)</option>
                        </select>
                      ) : (
                        <select 
                          value={mEstadoInterno}
                          onChange={(e) => setMEstadoInterno(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 font-bold text-slate-800 dark:text-slate-100 cursor-pointer"
                        >
                          <option value="Registrado" className="dark:bg-slate-900">Registrado y Cerrado (SIRE SUNAT)</option>
                          <option value="Borrador" className="dark:bg-slate-900">Asiento Temporal Borrador</option>
                          <option value="Aprobado Auditoria" className="dark:bg-slate-900">Aprobado por Auditoría Interna</option>
                        </select>
                      )}
                    </div>
                  </div>

                  {/* OBSERVACIONES */}
                  {activeModal !== 'TRANSFERENCIA' && (
                    <div className="pt-1.5">
                      <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1">Observaciones / Notas de Auditoría</label>
                      <textarea 
                        rows={2}
                        placeholder="Notas administrativas o glosas de auditoría..."
                        value={mObservaciones}
                        onChange={(e) => setMObservaciones(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 font-bold text-slate-800 dark:text-slate-100"
                      />
                    </div>
                  )}
                </div>

                {/* DOUBLE ENTRY PREVIEW ACCORDING TO USER CONFIGURATION */}
                {(() => {
                  const baseVal = (activeModal === 'VENTA' || activeModal === 'COMPRA')
                    ? (parseFloat(mPrecioUnitario) * mCantidad || 0)
                    : (parseFloat(mPrecioUnitario) || 0);
                  
                  let igvVal = (activeModal === 'VENTA' || activeModal === 'COMPRA') && mAfectacionIGV.includes('18%')
                    ? baseVal * 0.18
                    : 0;
                  let totVal = baseVal + igvVal;
                  let detVal = sujetoDetraccion ? Number((totVal * (tasaDetraccion / 100)).toFixed(2)) : 0;
                  let retVal = (activeModal === 'VENTA' && sujetoRetencion) ? Number((totVal * 0.03).toFixed(2)) : 0;

                  const mockTx: Transaction = {
                    id: 'preview',
                    fecha: mFecha,
                    tipo: activeModal,
                    montoBase: baseVal,
                    igv: igvVal,
                    total: totVal,
                    glosa: mGlosa.trim() || 'Previsualización de asiento',
                    rucClienteProveedor: mRuc || '20000000000',
                    documento: mSerieNumero || 'TMP-001',
                    sujetoDetraccion,
                    tasaDetraccion,
                    montoDetraccion: detVal,
                    sujetoRetencion,
                    montoRetencion: retVal,
                    cuentaOrigen: activeModal === 'COBRO' ? '1212' : activeModal === 'PAGO' ? '4212' : activeModal === 'APERTURA' ? '5011' : mCuentaDinero,
                    cuentaDestino: activeModal === 'COBRO' ? mCuentaDinero : activeModal === 'PAGO' ? mCuentaDinero : activeModal === 'APERTURA' ? mCuentaDinero : mObservaciones,
                  };

                  if (activeModal === 'TRANSFERENCIA') {
                    mockTx.cuentaOrigen = mCuentaDinero;
                    mockTx.cuentaDestino = mObservaciones || '1041';
                  }

                  const seats = generateSeatsFromTransaction(mockTx);
                  const tDebe = seats.reduce((s, e) => s + e.debe, 0);
                  const tHaber = seats.reduce((s, e) => s + e.haber, 0);

                  return (
                    <div className="bg-slate-900 text-slate-100 rounded-2xl p-4.5 border border-slate-800 shadow-lg space-y-3 font-sans select-none">
                      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-2">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          ASIENTO AUTOMÁTICO COMPILADO (PCGE 2026)
                        </span>
                        <span className="text-[10px] font-mono text-emerald-400 font-extrabold">CUADRADO S/. {tDebe.toFixed(2)}</span>
                      </div>
                      
                      <div className="space-y-1.5 text-[11px] max-h-[140px] overflow-y-auto divide-y divide-slate-800/40 pr-1 select-text">
                        {seats.map((seat, i) => (
                          <div key={i} className="flex justify-between py-1.5 items-start gap-2">
                            <div className="text-[10.5px]">
                              <span className="font-mono bg-slate-800 px-1.5 py-0.2 rounded text-[10px] text-slate-300 font-bold mr-1.5">{seat.cuenta}</span>
                              <span className="text-slate-300 font-medium truncate inline-block max-w-[200px]">{seat.cuentaNombre}</span>
                            </div>
                            <div className="flex gap-3 font-mono text-xs text-right whitespace-nowrap">
                              {seat.debe > 0 ? (
                                <span className="text-emerald-400 font-bold w-[90px] block">Debe: +{seat.debe.toFixed(2)}</span>
                              ) : (
                                <span className="text-indigo-400 w-[90px] block">Haber: +{seat.haber.toFixed(2)}</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="pt-2 border-t border-slate-800 flex justify-between text-[11px] font-bold text-slate-400 select-none">
                        <span>Balance Neto de Operación</span>
                        <span className="font-mono text-slate-200">S/. {tDebe.toFixed(2)} = S/. {tHaber.toFixed(2)}</span>
                      </div>
                    </div>
                  );
                })()}

                {/* Submit Action Buttons */}
                <div className="flex justify-end gap-3 pt-2">
                  <button 
                    type="button"
                    onClick={() => setActiveModal(null)}
                    className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    className={`px-6 py-2.5 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition-all cursor-pointer ${
                      activeModal === 'VENTA' ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-200' :
                      activeModal === 'COMPRA' ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200' :
                      activeModal === 'COBRO' ? 'bg-teal-500 hover:bg-teal-600 shadow-teal-200' :
                      activeModal === 'PAGO' ? 'bg-rose-500 hover:bg-rose-600 shadow-rose-200' :
                      'bg-amber-500 hover:bg-amber-600 shadow-amber-200'
                    }`}
                  >
                    <span>Guardar y Publicar Asiento</span>
                    <span>⚡</span>
                  </button>
                </div>

              </form>

            </div>

          </div>
        </div>
      )}

      {/* COMPROBANTE PDF MODAL */}
      {selectedVentaComprobante && (
        <ComprobantePDFModal
          isOpen={selectedVentaComprobante !== null}
          onClose={() => setSelectedVentaComprobante(null)}
          venta={selectedVentaComprobante}
          companyConfig={companyConfig}
        />
      )}

      {/* FLOATING REAL-TIME ACTIVITY TOAST POPUP */}
      {activeToast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-white dark:bg-slate-900 border-2 border-indigo-500 rounded-2xl shadow-2xl p-4 animate-fadeIn flex gap-3.5 items-start">
          <div className="bg-indigo-50 dark:bg-slate-950 p-2.5 rounded-xl border border-indigo-100 dark:border-slate-800 text-base shrink-0">
            {activeToast.role === 'EMPLEADO' ? '💼' : activeToast.role === 'ADMINISTRADOR' ? '🔧' : '🧮'}
          </div>
          <div className="min-w-0 w-full">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                {activeToast.title}
              </span>
              <button 
                onClick={() => setActiveToast(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold text-xs"
              >
                ✕
              </button>
            </div>
            <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200 mt-1 leading-normal">
              {activeToast.message}
            </p>
            <div className="flex justify-between items-center mt-2 pt-1.5 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[9px] font-mono text-slate-400 dark:text-slate-500">Estado del Sistema</span>
              <span className={`text-[11px] font-black font-mono ${activeToast.tipo === 'VENTA' ? 'text-blue-600 dark:text-blue-400' : 'text-red-500 dark:text-red-400'}`}>
                {activeToast.tipo === 'VENTA' ? '+' : '-'}S/. {activeToast.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
