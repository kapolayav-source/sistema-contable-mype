import { PCGEAccount, Transaction, AccountingEntry } from './types';

export const PCGE_MYPE: PCGEAccount[] = [
  { 
    cta: '101', 
    desc: 'Caja - Efectivo', 
    categoria: 'Activo', 
    explicacion: 'Dinero en efectivo de libre disponibilidad de la empresa.' 
  },
  { 
    cta: '1041', 
    desc: 'Cuentas corrientes bancarias', 
    categoria: 'Activo', 
    explicacion: 'Efectivo depositado en bancos comerciales para operaciones de la empresa.' 
  },
  { 
    cta: '1042', 
    desc: 'Cuentas corrientes - Detracciones (BN)', 
    categoria: 'Activo', 
    explicacion: 'Dinero depositado en la cuenta del Banco de la Nación para pago exclusivo de obligaciones tributarias.' 
  },
  { 
    cta: '1212', 
    desc: 'Facturas por cobrar - Emitidas en cartera', 
    categoria: 'Activo', 
    explicacion: 'Derechos de cobro a clientes por ventas al crédito de bienes o servicios.' 
  },
  { 
    cta: '40111', 
    desc: 'IGV - Cuenta Propia (18%)', 
    categoria: 'Pasivo', 
    explicacion: 'Impuesto General a las Ventas de 18% para liquidación mensual en SUNAT.' 
  },
  { 
    cta: '40114', 
    desc: 'IGV - Retenciones Sufridas', 
    categoria: 'Activo', 
    explicacion: 'Crédito acumulado por retenciones efectuadas de clientes autorizados de SUNAT (3%).' 
  },
  { 
    cta: '40115', 
    desc: 'IGV - Detracciones por Depositar', 
    categoria: 'Pasivo', 
    explicacion: 'Obligación de depositar el porcentaje de la detracción retenido al proveedor en su cuenta BN.' 
  },
  { 
    cta: '4031', 
    desc: 'Tributos - ESSALUD por Pagar (9%)', 
    categoria: 'Pasivo', 
    explicacion: 'Contribución patronal para la cobertura de salud de los trabajadores de la MYPE.' 
  },
  { 
    cta: '4032', 
    desc: 'Tributos - ONP por Pagar (13%)', 
    categoria: 'Pasivo', 
    explicacion: 'Retenciones al trabajador destinadas al fondo nacional de pensiones.' 
  },
  { 
    cta: '4111', 
    desc: 'Sueldos y Remuneraciones por Pagar', 
    categoria: 'Pasivo', 
    explicacion: 'Sueldo neto a pagar a los trabajadores una vez aplicadas las retenciones de ley.' 
  },
  { 
    cta: '4212', 
    desc: 'Facturas por pagar - Emitidas de proveedores', 
    categoria: 'Pasivo', 
    explicacion: 'Obligaciones comerciales a saldar con proveedores de mercaderías e insumos.' 
  },
  { 
    cta: '5011', 
    desc: 'Acciones - Capital Social', 
    categoria: 'Patrimonio', 
    explicacion: 'Capital societario aportado por los dueños o socios al iniciar el negocio.' 
  },
  { 
    cta: '6011', 
    desc: 'Mercaderías - Compras comerciales', 
    categoria: 'Gasto', 
    explicacion: 'Costo total de mercaderías adquiridas destinadas directamente a la venta.' 
  },
  { 
    cta: '6211', 
    desc: 'Gastos de Personal - Sueldos directos', 
    categoria: 'Gasto', 
    explicacion: 'Gasto total de sueldos brutos de los trabajadores inscritos en planilla T-Registro.' 
  },
  { 
    cta: '6271', 
    desc: 'Gastos de Personal - ESSALUD (9%)', 
    categoria: 'Gasto', 
    explicacion: 'Gasto propio del empleador por el seguro de salud integral del empleado regulado por ley.' 
  },
  { 
    cta: '70121', 
    desc: 'Mercaderías - Venta nacional', 
    categoria: 'Ingreso', 
    explicacion: 'Ingresos por venta directa de productos propios del giro comercial (base imponible).' 
  },
  {
    cta: '3311',
    desc: 'Equipos y Activos Fijos - Adquisición',
    categoria: 'Activo',
    explicacion: 'Propiedad, planta y equipo (laptops, servidores, etc.) que posee la empresa para su uso operativo.'
  },
  {
    cta: '3411',
    desc: 'Licencias e Intangibles - Adquisición',
    categoria: 'Activo',
    explicacion: 'Activos intangibles adquiridos como licencias de software, patentes o marcas comerciales.'
  },
  {
    cta: '5911',
    desc: 'Resultados Acumulados - Utilidades acumuladas',
    categoria: 'Patrimonio',
    explicacion: 'Utilidades generadas por el negocio pendientes de distribución o retenidas para reinversión.'
  }
];

// Seed initial transactions
export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx1',
    fecha: '2026-06-10',
    tipo: 'VENTA',
    montoBase: 1200.00,
    igv: 216.00,
    total: 1416.00,
    glosa: 'Venta de mercadería MYPE al crédito',
    rucClienteProveedor: '20601234567',
    documento: 'F001-000101',
    creadoPor: 'GERENTE',
    catalogItemId: '1',
    cantidad: 1,
    precioUnitario: 1200
  },
  {
    id: 'tx2',
    fecha: '2026-06-12',
    tipo: 'COMPRA',
    montoBase: 750.00,
    igv: 135.00,
    total: 885.00,
    glosa: 'Compra de stock con factura',
    rucClienteProveedor: '20459876543',
    documento: 'FT01-001245',
    creadoPor: 'EMPLEADO',
    catalogItemId: '1',
    cantidad: 1,
    precioUnitario: 750
  },
  {
    id: 'tx3',
    fecha: '2026-06-15',
    tipo: 'VENTA',
    montoBase: 2500.00,
    igv: 450.00,
    total: 2950.00,
    glosa: 'Servicio de consultoría MYPE suj. detracción',
    rucClienteProveedor: '10467812349',
    documento: 'F002-000045',
    creadoPor: 'CONTADOR',
    sujetoDetraccion: true,
    tasaDetraccion: 10,
    montoDetraccion: 295
  }
];

// Helper to expand transaction into Accounting Seats (Double Entry)
export const generateSeatsFromTransaction = (tx: Transaction): AccountingEntry[] => {
  const { 
    id, 
    fecha, 
    tipo, 
    montoBase, 
    igv, 
    total, 
    glosa, 
    sujetoDetraccion, 
    montoDetraccion, 
    sujetoRetencion, 
    montoRetencion,
    isExtornado,
    tipoComprobante,
    condicionOperacion,
    estadoPago,
    cuentaOrigen,
    cuentaDestino
  } = tx;
  
  let rawEntries: Omit<AccountingEntry, 'id'>[] = [];
  const glosaLower = (glosa || '').toLowerCase();
  const compLower = (tipoComprobante || '').toLowerCase();

  // 1. Check for "Retiro de utilidades de socios" first
  const isRetiroUtilidades = glosaLower.includes('retiro de utilidad') || 
                             glosaLower.includes('retiro utilidad') || 
                             glosaLower.includes('retiro de utilidades') || 
                             glosaLower.includes('dividendos') || 
                             glosaLower.includes('retiro de socios') ||
                             compLower.includes('retiro') ||
                             (tipo === 'PAGO' && (tx.observaciones?.toLowerCase().includes('utilidad') || tx.observaciones?.toLowerCase().includes('dividendo')));

  if (isRetiroUtilidades) {
    const cOrig = cuentaOrigen || '1041';
    const cOrigName = PCGE_MYPE.find(a => a.cta === cOrig)?.desc || 'Cuentas corrientes bancarias';
    rawEntries = [
      {
        asientoId: id,
        fecha,
        glosa: `${glosa} (Retiro de utilidades directo de patrimonio)`,
        cuenta: '5911',
        cuentaNombre: 'Resultados Acumulados - Utilidades acumuladas',
        debe: total,
        haber: 0
      },
      {
        asientoId: id,
        fecha,
        glosa: `${glosa} (Desembolso de efectivo por retiro)`,
        cuenta: cOrig,
        cuentaNombre: cOrigName,
        debe: 0,
        haber: total
      }
    ];
  } else if (tx.esMovimientoInventario) {
    const isIngreso = tx.tipoInventario === 'INGRESO';
    if (isIngreso) {
      rawEntries = [
        {
          asientoId: id,
          fecha,
          glosa: `[Ingreso de Almacén] ${glosa}`,
          cuenta: '20111',
          cuentaNombre: 'Mercaderías - Costo comercial',
          debe: total,
          haber: 0
        },
        {
          asientoId: id,
          fecha,
          glosa: `[Ingreso de Almacén] ${glosa}`,
          cuenta: '6111',
          cuentaNombre: 'Variación de mercaderías',
          debe: 0,
          haber: total
        }
      ];
    } else {
      rawEntries = [
        {
          asientoId: id,
          fecha,
          glosa: `[Salida de Almacén] ${glosa}`,
          cuenta: '659',
          cuentaNombre: 'Otros gastos - Mermas y pérdidas',
          debe: total,
          haber: 0
        },
        {
          asientoId: id,
          fecha,
          glosa: `[Salida de Almacén] ${glosa}`,
          cuenta: '20111',
          cuentaNombre: 'Mercaderías - Costo comercial',
          debe: 0,
          haber: total
        }
      ];
    }
  } else if (tipo === 'VENTA') {
    const isNotaCredito = compLower === 'nota de crédito' || 
                          compLower.includes('nota de credito') || 
                          glosaLower.includes('nota de crédito') || 
                          glosaLower.includes('nota de credito') || 
                          glosaLower.includes('devolución') || 
                          glosaLower.includes('devolucion');

    if (isNotaCredito) {
      // Sales Return / Credit Note (Invert standard VENTA entries: swap Debe and Haber)
      rawEntries = [
        {
          asientoId: id,
          fecha,
          glosa: `${glosa} (Reversa de cuentas por cobrar)`,
          cuenta: '1212',
          cuentaNombre: 'Facturas por cobrar - Emitidas',
          debe: 0,
          haber: total
        },
        {
          asientoId: id,
          fecha,
          glosa: `${glosa} (Reversa de IGV Débito)`,
          cuenta: '40111',
          cuentaNombre: 'IGV - Cuenta Propia (18%)',
          debe: igv,
          haber: 0
        },
        {
          asientoId: id,
          fecha,
          glosa: `${glosa} (Reversa de ingresos)`,
          cuenta: '70121',
          cuentaNombre: 'Mercaderías - Venta nacional',
          debe: montoBase,
          haber: 0
        }
      ];

      // If it's a cash sale return, reverse the cash flow
      if (condicionOperacion === 'Contado' || estadoPago === 'Pagado' || tx.formaPago) {
        const cDest = cuentaDestino || '1041';
        const cDestName = PCGE_MYPE.find(a => a.cta === cDest)?.desc || 'Cuentas corrientes bancarias';
        rawEntries.push(
          {
            asientoId: id,
            fecha,
            glosa: `${glosa} (Reversa de Cobro - Devolución de Caja)`,
            cuenta: '1212',
            cuentaNombre: 'Facturas por cobrar - Emitidas',
            debe: total,
            haber: 0
          },
          {
            asientoId: id,
            fecha,
            glosa: `${glosa} (Reversa de Cobro - Devolución de Caja)`,
            cuenta: cDest,
            cuentaNombre: cDestName,
            debe: 0,
            haber: total
          }
        );
      }
    } else {
      // Standard VENTA
      if (sujetoDetraccion && montoDetraccion) {
        rawEntries = [
          {
            asientoId: id,
            fecha,
            glosa: `${glosa} (Neto por cobrar - Factura)`,
            cuenta: '1212',
            cuentaNombre: 'Facturas por cobrar - Emitidas',
            debe: total - montoDetraccion,
            haber: 0
          },
          {
            asientoId: id,
            fecha,
            glosa: `${glosa} (Detracción 10% en Banco Nación)`,
            cuenta: '1042',
            cuentaNombre: 'Cuentas corrientes - Detracciones (BN)',
            debe: montoDetraccion,
            haber: 0
          },
          {
            asientoId: id,
            fecha,
            glosa: glosa,
            cuenta: '40111',
            cuentaNombre: 'IGV - Cuenta Propia (18%)',
            debe: 0,
            haber: igv
          },
          {
            asientoId: id,
            fecha,
            glosa: glosa,
            cuenta: '70121',
            cuentaNombre: 'Mercaderías - Venta nacional',
            debe: 0,
            haber: montoBase
          }
        ];
      } else if (sujetoRetencion && montoRetencion) {
        rawEntries = [
          {
            asientoId: id,
            fecha,
            glosa: `${glosa} (Neto deducido de Retención)`,
            cuenta: '1212',
            cuentaNombre: 'Facturas por cobrar - Emitidas',
            debe: total - montoRetencion,
            haber: 0
          },
          {
            asientoId: id,
            fecha,
            glosa: `${glosa} (Canje de Retención 3% SUNAT)`,
            cuenta: '40114',
            cuentaNombre: 'IGV - Retenciones Sufridas',
            debe: montoRetencion,
            haber: 0
          },
          {
            asientoId: id,
            fecha,
            glosa: glosa,
            cuenta: '40111',
            cuentaNombre: 'IGV - Cuenta Propia (18%)',
            debe: 0,
            haber: igv
          },
          {
            asientoId: id,
            fecha,
            glosa: glosa,
            cuenta: '70121',
            cuentaNombre: 'Mercaderías - Venta nacional',
            debe: 0,
            haber: montoBase
          }
        ];
      } else {
        rawEntries = [
          {
            asientoId: id,
            fecha,
            glosa,
            cuenta: '1212',
            cuentaNombre: 'Facturas por cobrar - Emitidas',
            debe: total,
            haber: 0
          },
          {
            asientoId: id,
            fecha,
            glosa,
            cuenta: '40111',
            cuentaNombre: 'IGV - Cuenta Propia (18%)',
            debe: 0,
            haber: igv
          },
          {
            asientoId: id,
            fecha,
            glosa,
            cuenta: '70121',
            cuentaNombre: 'Mercaderías - Venta nacional',
            debe: 0,
            haber: montoBase
          }
        ];
      }

      // If VENTA is "al contado", register the immediate collection (cobro)
      if (condicionOperacion === 'Contado' || estadoPago === 'Pagado' || tx.formaPago) {
        const cDest = cuentaDestino || '1041';
        const cDestName = PCGE_MYPE.find(a => a.cta === cDest)?.desc || 'Cuentas corrientes bancarias';
        const collectAmount = (sujetoDetraccion && montoDetraccion) ? (total - montoDetraccion) : total;
        rawEntries.push(
          {
            asientoId: id,
            fecha,
            glosa: `${glosa} (Cobro de Factura al Contado)`,
            cuenta: cDest,
            cuentaNombre: cDestName,
            debe: collectAmount,
            haber: 0
          },
          {
            asientoId: id,
            fecha,
            glosa: `${glosa} (Cobro de Factura al Contado)`,
            cuenta: '1212',
            cuentaNombre: 'Facturas por cobrar - Emitidas',
            debe: 0,
            haber: collectAmount
          }
        );
      }
    }
  } else if (tipo === 'COMPRA') {
    // 1. Determine whether it's an Asset (Activo Fijo Tangible vs Intangible) or standard Gasto
    const isEquipos = glosaLower.includes('equipo') || 
                      glosaLower.includes('laptop') || 
                      glosaLower.includes('computadora') || 
                      glosaLower.includes('servidor') || 
                      glosaLower.includes('maquinaria') || 
                      glosaLower.includes('activo fijo') || 
                      glosaLower.includes('mueble');

    const isLicencias = glosaLower.includes('licencia') || 
                        glosaLower.includes('software') || 
                        glosaLower.includes('patente') || 
                        glosaLower.includes('intangible') ||
                        glosaLower.includes('cloud');

    let mainAccount = '6011';
    let mainAccountName = 'Mercaderías - Compras comerciales';

    if (isEquipos) {
      mainAccount = '3311';
      mainAccountName = 'Equipos y Activos Fijos - Adquisición';
    } else if (isLicencias) {
      mainAccount = '3411';
      mainAccountName = 'Licencias e Intangibles - Adquisición';
    }

    // 2. Exception: Recibo por Honorarios has NO IGV (100% goes to concept)
    const isHonorarios = compLower.includes('honorarios') || glosaLower.includes('honorarios');
    const finalMontoBase = isHonorarios ? total : montoBase;
    const finalIgv = isHonorarios ? 0 : igv;

    if (sujetoDetraccion && montoDetraccion) {
      rawEntries = [
        {
          asientoId: id,
          fecha,
          glosa,
          cuenta: mainAccount,
          cuentaNombre: mainAccountName,
          debe: finalMontoBase,
          haber: 0
        }
      ];

      if (finalIgv > 0) {
        rawEntries.push({
          asientoId: id,
          fecha,
          glosa,
          cuenta: '40111',
          cuentaNombre: 'IGV - Cuenta Propia (18%)',
          debe: finalIgv,
          haber: 0
        });
      }

      rawEntries.push(
        {
          asientoId: id,
          fecha,
          glosa: `${glosa} (Neto por Pagar a Proveedor)`,
          cuenta: '4212',
          cuentaNombre: 'Facturas por pagar - Emitidas',
          debe: 0,
          haber: total - montoDetraccion
        },
        {
          asientoId: id,
          fecha,
          glosa: `${glosa} (Obligación Detracción por Depositar BN)`,
          cuenta: '40115',
          cuentaNombre: 'IGV - Detracciones por Depositar',
          debe: 0,
          haber: montoDetraccion
        }
      );
    } else {
      // Standard local purchase
      rawEntries = [
        {
          asientoId: id,
          fecha,
          glosa,
          cuenta: mainAccount,
          cuentaNombre: mainAccountName,
          debe: finalMontoBase,
          haber: 0
        }
      ];

      if (finalIgv > 0) {
        rawEntries.push({
          asientoId: id,
          fecha,
          glosa,
          cuenta: '40111',
          cuentaNombre: 'IGV - Cuenta Propia (18%)',
          debe: finalIgv,
          haber: 0
        });
      }

      rawEntries.push({
        asientoId: id,
        fecha,
        glosa,
        cuenta: '4212',
        cuentaNombre: 'Facturas por pagar - Emitidas',
        debe: 0,
        haber: total
      });
    }

    // If COMPRA is "al contado", register the immediate payment (pago)
    if (condicionOperacion === 'Contado' || estadoPago === 'Pagado' || tx.formaPago) {
      const cOrig = cuentaOrigen || '101';
      const cOrigName = PCGE_MYPE.find(a => a.cta === cOrig)?.desc || 'Caja - Efectivo';
      const payAmount = (sujetoDetraccion && montoDetraccion) ? (total - montoDetraccion) : total;
      rawEntries.push(
        {
          asientoId: id,
          fecha,
          glosa: `${glosa} (Pago de Factura al Contado)`,
          cuenta: '4212',
          cuentaNombre: 'Facturas por pagar - Emitidas',
          debe: payAmount,
          haber: 0
        },
        {
          asientoId: id,
          fecha,
          glosa: `${glosa} (Pago de Factura al Contado)`,
          cuenta: cOrig,
          cuentaNombre: cOrigName,
          debe: 0,
          haber: payAmount
        }
      );
    }
  } else if (tipo === 'PLANILLA') {
    // Basic remuneration sits in montoBase. No IGV. Total is Basic salary + 9% Essalud.
    const essalud = Number((montoBase * 0.09).toFixed(2));
    const onp = Number((montoBase * 0.13).toFixed(2));
    const sueldoNeto = Number((montoBase - onp).toFixed(2));

    rawEntries = [
      {
        asientoId: id,
        fecha,
        glosa: `${glosa} (Gasto de Planilla Bruto)`,
        cuenta: '6211',
        cuentaNombre: 'Gastos de Personal - Sueldos directos',
        debe: montoBase,
        haber: 0
      },
      {
        asientoId: id,
        fecha,
        glosa: `${glosa} (ESSALUD 9% Aporte Patronal)`,
        cuenta: '6271',
        cuentaNombre: 'Gastos de Personal - ESSALUD (9%)',
        debe: essalud,
        haber: 0
      },
      {
        asientoId: id,
        fecha,
        glosa: `${glosa} (ESSALUD por pagar)`,
        cuenta: '4031',
        cuentaNombre: 'Tributos - ESSALUD por Pagar (9%)',
        debe: 0,
        haber: essalud
      },
      {
        asientoId: id,
        fecha,
        glosa: `${glosa} (ONP 13% Retención de Ley)`,
        cuenta: '4032',
        cuentaNombre: 'Tributos - ONP por Pagar (13%)',
        debe: 0,
        haber: onp
      },
      {
        asientoId: id,
        fecha,
        glosa: `${glosa} (Sueldos netos por pagar)`,
        cuenta: '4111',
        cuentaNombre: 'Sueldos y Remuneraciones por Pagar',
        debe: 0,
        haber: sueldoNeto
      }
    ];
  } else if (tipo === 'APERTURA') {
    // Capital initialization setup
    const cDestino = tx.cuentaDestino || '101';
    const getAccountName = (cta: string) => PCGE_MYPE.find(a => a.cta === cta)?.desc || 'Caja - Efectivo';
    rawEntries = [
      {
        asientoId: id,
        fecha,
        glosa,
        cuenta: cDestino,
        cuentaNombre: getAccountName(cDestino),
        debe: total,
        haber: 0
      },
      {
        asientoId: id,
        fecha,
        glosa,
        cuenta: '5011',
        cuentaNombre: 'Acciones - Capital Social',
        debe: 0,
        haber: total
      }
    ];
  } else if (tipo === 'COBRO') {
    // Collection of receivable
    const cDestino = tx.cuentaDestino || '1041';
    const cOrigen = tx.cuentaOrigen || '1212';
    const getAccountName = (cta: string) => PCGE_MYPE.find(a => a.cta === cta)?.desc || 'Cuentas por cobrar';
    rawEntries = [
      {
        asientoId: id,
        fecha,
        glosa,
        cuenta: cDestino,
        cuentaNombre: getAccountName(cDestino),
        debe: total,
        haber: 0
      },
      {
        asientoId: id,
        fecha,
        glosa,
        cuenta: cOrigen,
        cuentaNombre: getAccountName(cOrigen),
        debe: 0,
        haber: total
      }
    ];
  } else if (tipo === 'PAGO') {
    // Payment of supplier invoice
    const cDestino = tx.cuentaDestino || '4212';
    const cOrigen = tx.cuentaOrigen || '1041';
    const getAccountName = (cta: string) => PCGE_MYPE.find(a => a.cta === cta)?.desc || 'Cuentas por pagar';
    rawEntries = [
      {
        asientoId: id,
        fecha,
        glosa,
        cuenta: cDestino,
        cuentaNombre: getAccountName(cDestino),
        debe: total,
        haber: 0
      },
      {
        asientoId: id,
        fecha,
        glosa,
        cuenta: cOrigen,
        cuentaNombre: getAccountName(cOrigen),
        debe: 0,
        haber: total
      }
    ];
  } else if (tipo === 'TRANSFERENCIA') {
    // Internal bank/cash transfer
    const cDestino = tx.cuentaDestino || '1041';
    const cOrigen = tx.cuentaOrigen || '101';
    const getAccountName = (cta: string) => PCGE_MYPE.find(a => a.cta === cta)?.desc || 'Caja/Banco';
    rawEntries = [
      {
        asientoId: id,
        fecha,
        glosa,
        cuenta: cDestino,
        cuentaNombre: getAccountName(cDestino),
        debe: total,
        haber: 0
      },
      {
        asientoId: id,
        fecha,
        glosa,
        cuenta: cOrigen,
        cuentaNombre: getAccountName(cOrigen),
        debe: 0,
        haber: total
      }
    ];
  }

  // If this is an EXTORNO / ANULACIÓN, invert the entries (swap Debe and Haber completely)
  // to net the accounting score back to absolute zero.
  return rawEntries.map((entry, idx) => {
    const finalDebe = isExtornado ? entry.haber : entry.debe;
    const finalHaber = isExtornado ? entry.debe : entry.haber;
    return {
      ...entry,
      id: `${id}-seat-${idx}`,
      debe: finalDebe,
      haber: finalHaber,
      glosa: isExtornado ? `[EXTORNO] ${entry.glosa}` : entry.glosa
    };
  });
};

export const PRESET_QUESTIONS = [
  {
    tag: '¿Qué gastos deduzco?',
    question: '¿Qué gastos reales puedo deducir en el Régimen MYPE Tributario peruano para pagar menos Impuesto a la Renta de forma legal?'
  },
  {
    tag: '¿Cuánto pago de Renta?',
    question: '¿Cómo se calculan los pagos a cuenta mensuales de Impuesto a la Renta en el Régimen MYPE y qué pasa si supero las 300 UIT?'
  },
  {
    tag: '¿Qué es IGV Justo?',
    question: '¿Cómo funciona la ley de IGV Justo para prorrogar el pago hasta por tres meses, y quiénes califican?'
  },
  {
    tag: '¿Libros electrónicos?',
    question: '¿Qué libros contables y electrónicos de SUNAT (SIRE, Compras, Ventas, Diario) estoy obligado a llevar en el MYPE?'
  }
];

export const MONTHS_LIST = [
  { value: '2026-05', label: 'Mayo 2026' },
  { value: '2026-06', label: 'Junio 2026' },
  { value: '2026-07', label: 'Julio 2026' },
  { value: '2026-08', label: 'Agosto 2026' }
];

// Returns the deadline based on RUC last digit and month
export const getSUNATDeadline = (rucDigit: string, period: string): { status: string; date: string } => {
  const [year, month] = period.split('-');
  const mNum = parseInt(month, 10);
  
  // Usually, taxes are declared around the middle-to-end of the subsequent month
  // We'll calculate mock legal deadlines for 2026
  let nextMonth = mNum + 1;
  let nextYear = parseInt(year, 10);
  if (nextMonth > 12) {
    nextMonth = 1;
    nextYear += 1;
  }
  
  const formattedNextMonth = nextMonth.toString().padStart(2, '0');
  
  // Base day offset by RUC last digit
  const offsets: Record<string, number> = {
    '0': 14,
    '1': 15,
    '2': 16,
    '3': 17,
    '4': 18,
    '5': 19,
    '6': 22,
    '7': 23,
    '8': 24,
    '9': 25
  };
  
  const day = offsets[rucDigit] || 15;
  const deadlineDate = `${nextYear}-${formattedNextMonth}-${day.toString().padStart(2, '0')}`;
  
  return {
    status: `Vence el ${day} de ${getSpanishMonthName(nextMonth)}`,
    date: deadlineDate
  };
};

const getSpanishMonthName = (m: number): string => {
  const names = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  return names[m - 1] || 'Enero';
};
