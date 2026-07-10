import { Transaction, AccountingEntry } from './types';

// Helper to format currency
const formatMoney = (amount: number) => {
  return 'S/. ' + amount.toFixed(2);
};

// Excel Spreadsheet HTML Template exporter
export const exportToExcel = (
  selectedTab: string,
  params: {
    transactions: Transaction[];
    periodEntries: AccountingEntry[];
    period: string;
    ruc: string;
    solUser: string;
    regimen: 'RER' | 'RMT';
    modoSencillo: boolean;
    catalogItems: any[];
    selectedInventoryProduct?: string;
    getKardexForProduct?: (id: string) => any;
    companyName?: string;
  }
) => {
  const {
    transactions,
    periodEntries,
    period,
    ruc,
    solUser,
    regimen,
    modoSencillo,
    catalogItems,
    selectedInventoryProduct,
    getKardexForProduct,
    companyName
  } = params;

  let title = '';
  let tableHeaders: string[] = [];
  let tableRowsHtml = '';

  if (selectedTab === 'ventas') {
    title = modoSencillo ? 'Registro de Ventas e Ingresos' : 'Libro de Ventas Simplificado (SIRE)';
    tableHeaders = [
      'Fecha Emisión',
      'Tipo Doc',
      'N° Comprobante',
      'RUC / Doc Cliente',
      'Cliente / Destinatario',
      'Glosa / Concepto',
      'Monto Base (S/.)',
      'IGV 18% (S/.)',
      'Total Facturado (S/.)'
    ];

    const sales = transactions.filter(t => t.tipo === 'VENTA');
    let totalBase = 0;
    let totalIgv = 0;
    let totalSoles = 0;

    tableRowsHtml = sales.map(t => {
      totalBase += t.montoBase;
      totalIgv += t.igv;
      totalSoles += t.total;
      return `
        <tr>
          <td>${t.fecha}</td>
          <td>Factura / Boleta</td>
          <td>${t.documento}</td>
          <td style="mso-number-format:'@';">${t.rucClienteProveedor}</td>
          <td>${t.glosa.split('-')[1]?.trim() || 'Cliente General'}</td>
          <td>${t.glosa}</td>
          <td align="right">${t.montoBase.toFixed(2)}</td>
          <td align="right">${t.igv.toFixed(2)}</td>
          <td align="right" style="font-weight: bold;">${t.total.toFixed(2)}</td>
        </tr>
      `;
    }).join('');

    // Totals row
    tableRowsHtml += `
      <tr class="total-row" style="font-weight: bold; background-color: #f1f5f9;">
        <td colspan="6" align="right">TOTAL GENERAL:</td>
        <td align="right">${totalBase.toFixed(2)}</td>
        <td align="right">${totalIgv.toFixed(2)}</td>
        <td align="right">${totalSoles.toFixed(2)}</td>
      </tr>
    `;

  } else if (selectedTab === 'compras') {
    title = modoSencillo ? 'Registro de Compras y Gastos' : 'Libro de Compras Simplificado (SIRE)';
    tableHeaders = [
      'Fecha Emisión',
      'Tipo Doc',
      'N° Comprobante',
      'RUC / Doc Proveedor',
      'Proveedor / Emisor',
      'Glosa / Concepto',
      'Monto Base (S/.)',
      'IGV 18% (S/.)',
      'Total Gasto (S/.)'
    ];

    const purchases = transactions.filter(t => t.tipo === 'COMPRA');
    let totalBase = 0;
    let totalIgv = 0;
    let totalSoles = 0;

    tableRowsHtml = purchases.map(t => {
      totalBase += t.montoBase;
      totalIgv += t.igv;
      totalSoles += t.total;
      return `
        <tr>
          <td>${t.fecha}</td>
          <td>Factura / Boleta</td>
          <td>${t.documento}</td>
          <td style="mso-number-format:'@';">${t.rucClienteProveedor}</td>
          <td>${t.glosa.split('-')[1]?.trim() || 'Proveedor General'}</td>
          <td>${t.glosa}</td>
          <td align="right">${t.montoBase.toFixed(2)}</td>
          <td align="right">${t.igv.toFixed(2)}</td>
          <td align="right" style="font-weight: bold;">${t.total.toFixed(2)}</td>
        </tr>
      `;
    }).join('');

    // Totals row
    tableRowsHtml += `
      <tr class="total-row" style="font-weight: bold; background-color: #f1f5f9;">
        <td colspan="6" align="right">TOTAL GENERAL:</td>
        <td align="right">${totalBase.toFixed(2)}</td>
        <td align="right">${totalIgv.toFixed(2)}</td>
        <td align="right">${totalSoles.toFixed(2)}</td>
      </tr>
    `;

  } else if (selectedTab === 'diario') {
    title = modoSencillo ? 'Cuaderno Diario' : 'Libro Diario Simplificado (PCGE)';
    tableHeaders = [
      'Código Cuenta',
      'Denominación Cuenta',
      'Fecha de Operación',
      'N° Asiento / Glosa',
      'Debe (S/.)',
      'Haber (S/.)'
    ];

    let totalDebe = 0;
    let totalHaber = 0;

    tableRowsHtml = periodEntries.map(e => {
      totalDebe += e.debe;
      totalHaber += e.haber;
      return `
        <tr>
          <td style="mso-number-format:'@'; font-weight: bold;">${e.cuenta}</td>
          <td>${e.cuentaNombre}</td>
          <td>${e.fecha}</td>
          <td>${e.glosa}</td>
          <td align="right" style="color: #047857;">${e.debe > 0 ? e.debe.toFixed(2) : '-'}</td>
          <td align="right" style="color: #4f46e5;">${e.haber > 0 ? e.haber.toFixed(2) : '-'}</td>
        </tr>
      `;
    }).join('');

    tableRowsHtml += `
      <tr class="total-row" style="font-weight: bold; background-color: #f1f5f9;">
        <td colspan="4" align="right">SUMA TOTAL:</td>
        <td align="right" style="color: #047857;">${totalDebe.toFixed(2)}</td>
        <td align="right" style="color: #4f46e5;">${totalHaber.toFixed(2)}</td>
      </tr>
    `;

  } else if (selectedTab === 'mayor') {
    title = modoSencillo ? 'Libro Mayor de Alcancías' : 'Libro Mayor General';
    tableHeaders = [
      'N° Cuenta',
      'Denominación',
      'Fecha',
      'Glosa / Detalle',
      'Debe (S/.)',
      'Haber (S/.)',
      'Saldo Acumulado (S/.)'
    ];

    const uniqueAccounts = Array.from(new Set(periodEntries.map(e => e.cuenta))).sort();
    
    tableRowsHtml = uniqueAccounts.map(accCode => {
      const entriesForCta = periodEntries.filter(e => e.cuenta === accCode);
      const firstEntry = entriesForCta[0];
      const accountName = firstEntry ? firstEntry.cuentaNombre : '';

      let accumSaldo = 0;
      const rowsForCta = entriesForCta.map(e => {
        accumSaldo += (e.debe - e.haber);
        return `
          <tr>
            <td style="mso-number-format:'@'; font-weight: bold;">${e.cuenta}</td>
            <td>${accountName}</td>
            <td>${e.fecha}</td>
            <td>${e.glosa}</td>
            <td align="right">${e.debe > 0 ? e.debe.toFixed(2) : '-'}</td>
            <td align="right">${e.haber > 0 ? e.haber.toFixed(2) : '-'}</td>
            <td align="right" style="font-weight: bold;">${accumSaldo.toFixed(2)}</td>
          </tr>
        `;
      }).join('');

      const sumDebe = entriesForCta.reduce((sum, e) => sum + e.debe, 0);
      const sumHaber = entriesForCta.reduce((sum, e) => sum + e.haber, 0);
      const saldoFinalText = sumDebe >= sumHaber 
        ? `Saldo Deudor: S/. ${(sumDebe - sumHaber).toFixed(2)}` 
        : `Saldo Acreedor: S/. ${(sumHaber - sumDebe).toFixed(2)}`;

      return rowsForCta + `
        <tr style="font-weight: bold; background-color: #fafafa; font-size: 9pt;">
          <td colspan="4" align="right">Subtotales Cuenta ${accCode}:</td>
          <td align="right">${sumDebe.toFixed(2)}</td>
          <td align="right">${sumHaber.toFixed(2)}</td>
          <td align="right" style="background-color: #f1f5f9;">${saldoFinalText}</td>
        </tr>
      `;
    }).join('');

  } else if (selectedTab === 'balance') {
    title = modoSencillo ? 'Balance General de la MYPE' : 'Balanza de Comprobación y Situación Financiera';
    tableHeaders = ['Clase / Elemento', 'Concepto Contable (PCGE)', 'Monto Activo (Debe)', 'Monto Pasivo y Patrimonio (Haber)'];

    // Calculations
    const cajaBancos = periodEntries.filter(e => e.cuenta.startsWith('10')).reduce((sum, e) => sum + (e.debe - e.haber), 0);
    const ctasPorCobrar = periodEntries.filter(e => e.cuenta.startsWith('12')).reduce((sum, e) => sum + (e.debe - e.haber), 0);
    const mercaderias = periodEntries.filter(e => e.cuenta.startsWith('20')).reduce((sum, e) => sum + (e.debe - e.haber), 0);
    const totalActivos = cajaBancos + ctasPorCobrar + mercaderias;

    const tributos = periodEntries.filter(e => e.cuenta.startsWith('40')).reduce((sum, e) => sum + (e.haber - e.debe), 0);
    const planillas = periodEntries.filter(e => e.cuenta.startsWith('41')).reduce((sum, e) => sum + (e.haber - e.debe), 0);
    const ctasPorPagar = periodEntries.filter(e => e.cuenta.startsWith('42')).reduce((sum, e) => sum + (e.haber - e.debe), 0);
    const totalPasivos = tributos + planillas + ctasPorPagar;

    const capitalSocial = periodEntries.filter(e => e.cuenta.startsWith('50')).reduce((sum, e) => sum + (e.haber - e.debe), 0);
    const ingresos = periodEntries.filter(e => e.cuenta.startsWith('7')).reduce((sum, e) => sum + (e.haber - e.debe), 0);
    const gastos = periodEntries.filter(e => e.cuenta.startsWith('6') || e.cuenta.startsWith('9')).reduce((sum, e) => sum + (e.debe - e.haber), 0);
    const utilidadNeto = ingresos - gastos;
    const totalPatrimonio = capitalSocial + utilidadNeto;
    const totalPasivoYPatrimonio = totalPasivos + totalPatrimonio;

    tableRowsHtml = `
      <tr>
        <td style="font-weight: bold;">ACTIVO</td>
        <td>🏦 Efectivo y Equivalentes de Banco (Cta. 10)</td>
        <td align="right">${cajaBancos.toFixed(2)}</td>
        <td align="right">-</td>
      </tr>
      <tr>
        <td style="font-weight: bold;">ACTIVO</td>
        <td>📝 Cuentas por Cobrar Comerciales (Cta. 12)</td>
        <td align="right">${ctasPorCobrar.toFixed(2)}</td>
        <td align="right">-</td>
      </tr>
      <tr>
        <td style="font-weight: bold;">ACTIVO</td>
        <td>📦 Mercaderías en Almacén (Cta. 20)</td>
        <td align="right">${mercaderias.toFixed(2)}</td>
        <td align="right">-</td>
      </tr>
      <tr style="font-weight: bold; background-color: #ecfdf5;">
        <td colspan="2">TOTAL ACTIVOS (A):</td>
        <td align="right">${totalActivos.toFixed(2)}</td>
        <td align="right">-</td>
      </tr>
      <tr>
        <td style="font-weight: bold;">PASIVO</td>
        <td>💸 Tributos por Pagar a SUNAT (Cta. 40)</td>
        <td align="right">-</td>
        <td align="right">${tributos.toFixed(2)}</td>
      </tr>
      <tr>
        <td style="font-weight: bold;">PASIVO</td>
        <td>🧑‍🤝‍🧑 Remuneraciones por Pagar (Cta. 41)</td>
        <td align="right">-</td>
        <td align="right">${planillas.toFixed(2)}</td>
      </tr>
      <tr>
        <td style="font-weight: bold;">PASIVO</td>
        <td>🚚 Cuentas por Pagar Comerciales (Cta. 42)</td>
        <td align="right">-</td>
        <td align="right">${ctasPorPagar.toFixed(2)}</td>
      </tr>
      <tr style="font-weight: bold; background-color: #fef2f2;">
        <td colspan="2">TOTAL PASIVOS (Deudas):</td>
        <td align="right">-</td>
        <td align="right">${totalPasivos.toFixed(2)}</td>
      </tr>
      <tr>
        <td style="font-weight: bold;">PATRIMONIO</td>
        <td>💰 Capital Social / Inversión (Cta. 50)</td>
        <td align="right">-</td>
        <td align="right">${capitalSocial.toFixed(2)}</td>
      </tr>
      <tr>
        <td style="font-weight: bold;">PATRIMONIO</td>
        <td>📈 Utilidad neta acumulada de Periodo</td>
        <td align="right">-</td>
        <td align="right">${utilidadNeto.toFixed(2)}</td>
      </tr>
      <tr style="font-weight: bold; background-color: #eff6ff;">
        <td colspan="2">TOTAL PATRIMONIO NETO:</td>
        <td align="right">-</td>
        <td align="right">${totalPatrimonio.toFixed(2)}</td>
      </tr>
      <tr style="font-weight: bold; background-color: #f1f5f9; font-size: 11pt;">
        <td colspan="2">TOTAL PASIVO + PATRIMONIO (B):</td>
        <td align="right">-</td>
        <td align="right">${totalPasivoYPatrimonio.toFixed(2)}</td>
      </tr>
    `;

  } else if (selectedTab === 'inventario') {
    title = 'Libro de Kárdex de Mercaderías (Método Promedio)';
    tableHeaders = [
      'Fecha',
      'Tipo Op',
      'Documento',
      'Concepto / Glosa',
      'ENTRADAS Qty',
      'ENTRADAS P.U.',
      'ENTRADAS Total',
      'SALIDAS Qty',
      'SALIDAS P.U.',
      'SALIDAS Total',
      'SALDO Qty',
      'SALDO P.U.',
      'SALDO Total'
    ];

    const prodId = selectedInventoryProduct || (catalogItems.find(c => c.isPhysical)?.id);
    const kardex = getKardexForProduct && prodId ? getKardexForProduct(prodId) : null;

    if (kardex) {
      tableRowsHtml = `
        <tr style="font-weight: bold; background-color: #fafafa;">
          <td>-</td>
          <td>SALDO INICIAL</td>
          <td>-</td>
          <td>Apertura de Almacén</td>
          <td align="right">-</td>
          <td align="right">-</td>
          <td align="right">-</td>
          <td align="right">-</td>
          <td align="right">-</td>
          <td align="right">-</td>
          <td align="right">${kardex.stockInicial}</td>
          <td align="right">${kardex.costoInicial.toFixed(2)}</td>
          <td align="right">${kardex.valorInicial.toFixed(2)}</td>
        </tr>
      `;

      tableRowsHtml += kardex.movements.map((mov: any) => `
        <tr>
          <td>${mov.fecha}</td>
          <td>${mov.tipo}</td>
          <td>${mov.documento}</td>
          <td>${mov.glosa}</td>
          <td align="right">${mov.entryQty > 0 ? mov.entryQty : '-'}</td>
          <td align="right">${mov.entryQty > 0 ? mov.entryPrice.toFixed(2) : '-'}</td>
          <td align="right" style="color: #047857;">${mov.entryQty > 0 ? mov.entryTotal.toFixed(2) : '-'}</td>
          <td align="right">${mov.exitQty > 0 ? mov.exitQty : '-'}</td>
          <td align="right">${mov.exitQty > 0 ? mov.exitPrice.toFixed(2) : '-'}</td>
          <td align="right" style="color: #be123c;">${mov.exitQty > 0 ? mov.exitTotal.toFixed(2) : '-'}</td>
          <td align="right" style="font-weight: bold;">${mov.saldoStock}</td>
          <td align="right">${mov.saldoCost.toFixed(2)}</td>
          <td align="right" style="font-weight: bold;">${mov.saldoTotal.toFixed(2)}</td>
        </tr>
      `).join('');

      tableRowsHtml += `
        <tr style="font-weight: bold; background-color: #f1f5f9;">
          <td colspan="4" align="right">SALDO FINAL DEL PERIODO:</td>
          <td align="right" colspan="3" style="color: #047857;">Entradas Totales Qty: ${kardex.totalEntradas}</td>
          <td align="right" colspan="3" style="color: #be123c;">Salidas Totales Qty: ${kardex.totalSalidas}</td>
          <td align="right">${kardex.stockActual}</td>
          <td align="right">${kardex.costoPromedioActual.toFixed(2)}</td>
          <td align="right">${kardex.valorActual.toFixed(2)}</td>
        </tr>
      `;
    }

  } else if (selectedTab === 'catalogo') {
    title = 'Catálogo General de Bienes y Servicios';
    tableHeaders = ['Código SKU', 'Nombre / Descripción', 'Tipo Item', 'Precio Venta (S/.)', 'Costo Unit. Inicial (S/.)', 'Unidad Medida'];

    tableRowsHtml = catalogItems.map(item => `
      <tr>
        <td style="mso-number-format:'@'; font-weight: bold;">${item.sku}</td>
        <td>${item.desc}</td>
        <td>${item.isPhysical ? 'FÍSICO (INVENTARIABLE)' : 'SERVICIO'}</td>
        <td align="right">${item.precio.toFixed(2)}</td>
        <td align="right">${item.isPhysical ? (item.costoInicial || 0).toFixed(2) : '-'}</td>
        <td>${item.unidad}</td>
      </tr>
    `).join('');
  }

  // Compile final spreadsheet HTML template
  const excelHtml = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8">
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
        .title-header { font-size: 16pt; font-weight: bold; color: #0f172a; margin-bottom: 5px; }
        .meta-text { font-size: 9.5pt; color: #475569; margin-bottom: 15px; }
        table { border-collapse: collapse; margin-top: 10px; width: 100%; }
        th { background-color: #1e293b; color: #ffffff; font-weight: bold; font-size: 10pt; border: 0.5pt solid #94a3b8; padding: 6px; }
        td { border: 0.5pt solid #cbd5e1; padding: 5px; font-size: 9.5pt; color: #334155; }
        .total-row td { background-color: #f1f5f9; font-weight: bold; color: #0f172a; border-top: 1.5pt solid #475569; }
      </style>
    </head>
    <body>
      <div class="title-header">${title.toUpperCase()}</div>
      <div class="meta-text">
        <strong>RAZÓN SOCIAL / EMPRESA:</strong> ${companyName || solUser} &nbsp;|&nbsp;
        <strong>EMPRESA RUC:</strong> ${ruc} &nbsp;|&nbsp; 
        <strong>PERIODO FISCAL:</strong> ${period} &nbsp;|&nbsp; 
        <strong>RÉGIMEN:</strong> ${regimen === 'RER' ? 'REGIMEN ESPECIAL (RER)' : 'MYPE TRIBUTARIO (RMT)'} &nbsp;|&nbsp;
        <strong>SOL USER:</strong> ${solUser} &nbsp;|&nbsp;
        <strong>MODO:</strong> ${modoSencillo ? 'Sencillo' : 'Profesional'}
      </div>
      <table>
        <thead>
          <tr>
            ${tableHeaders.map(h => `<th>${h}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${tableRowsHtml}
        </tbody>
      </table>
    </body>
    </html>
  `;

  const blob = new Blob([excelHtml], { type: 'application/vnd.ms-excel;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `REPORTE_${selectedTab.toUpperCase()}_${period}.xls`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Professional PDF Exporter via standard Print Interface Integration
export const exportToPDF = (
  selectedTab: string,
  params: {
    transactions: Transaction[];
    periodEntries: AccountingEntry[];
    period: string;
    ruc: string;
    solUser: string;
    regimen: 'RER' | 'RMT';
    modoSencillo: boolean;
    catalogItems: any[];
    selectedInventoryProduct?: string;
    getKardexForProduct?: (id: string) => any;
    companyName?: string;
    representanteLegal?: string;
  }
) => {
  const {
    transactions,
    periodEntries,
    period,
    ruc,
    solUser,
    regimen,
    modoSencillo,
    catalogItems,
    selectedInventoryProduct,
    getKardexForProduct,
    companyName,
    representanteLegal
  } = params;

  let reportTitle = '';
  let reportSubtitle = '';
  let tableHeaders: string[] = [];
  let tableRowsHtml = '';
  let isLandscape = false;

  if (selectedTab === 'ventas') {
    reportTitle = modoSencillo ? 'CUADERNO DE VENTAS Y COBROS' : 'REGISTRO DE VENTAS E INGRESOS SIMPLIFICADO';
    reportSubtitle = 'SUNAT SIRE - RESOLUCIÓN DE SUPERINTENDENCIA N.° 112-2021/SUNAT';
    isLandscape = true;
    tableHeaders = ['FECHA EMISIÓN', 'COMPROBANTE', 'SERIE-NÚMERO', 'RUC CLIENTE', 'CLIENTE', 'DETALLE / CONCEPTO', 'BASE IMP. (S/.)', 'IGV 18% (S/.)', 'TOTAL (S/.)'];

    const sales = transactions.filter(t => t.tipo === 'VENTA');
    let baseSum = 0;
    let igvSum = 0;
    let totSum = 0;

    tableRowsHtml = sales.map(t => {
      baseSum += t.montoBase;
      igvSum += t.igv;
      totSum += t.total;
      return `
        <tr class="border-b border-slate-200 hover:bg-slate-50">
          <td class="p-2 font-mono">${t.fecha}</td>
          <td class="p-2 text-[9px] font-bold">FACTURA / BOLETA</td>
          <td class="p-2 font-mono">${t.documento}</td>
          <td class="p-2 font-mono">${t.rucClienteProveedor}</td>
          <td class="p-2 truncate max-w-[150px]">${t.glosa.split('-')[1]?.trim() || 'Cliente General'}</td>
          <td class="p-2 truncate max-w-[150px] text-slate-500">${t.glosa}</td>
          <td class="p-2 text-right font-mono font-semibold">${t.montoBase.toFixed(2)}</td>
          <td class="p-2 text-right font-mono">${t.igv.toFixed(2)}</td>
          <td class="p-2 text-right font-mono font-bold text-slate-900">${t.total.toFixed(2)}</td>
        </tr>
      `;
    }).join('');

    tableRowsHtml += `
      <tr class="bg-slate-100 font-bold border-t-2 border-slate-400">
        <td colspan="6" class="p-2.5 text-right">TOTAL GENERAL GENERAL:</td>
        <td class="p-2.5 text-right font-mono">${baseSum.toFixed(2)}</td>
        <td class="p-2.5 text-right font-mono">${igvSum.toFixed(2)}</td>
        <td class="p-2.5 text-right font-mono text-emerald-800">${totSum.toFixed(2)}</td>
      </tr>
    `;

  } else if (selectedTab === 'compras') {
    reportTitle = modoSencillo ? 'CUADERNO DE COMPRAS Y GASTOS' : 'REGISTRO DE COMPRAS SIMPLIFICADO';
    reportSubtitle = 'SUNAT SIRE - REGISTRO COMPRAS ELECTRÓNICO (RCE)';
    isLandscape = true;
    tableHeaders = ['FECHA EMISIÓN', 'COMPROBANTE', 'SERIE-NÚMERO', 'RUC PROVEEDOR', 'PROVEEDOR', 'DETALLE / GASTO', 'BASE IMP. (S/.)', 'IGV CRÉDITO (S/.)', 'TOTAL (S/.)'];

    const purchases = transactions.filter(t => t.tipo === 'COMPRA');
    let baseSum = 0;
    let igvSum = 0;
    let totSum = 0;

    tableRowsHtml = purchases.map(t => {
      baseSum += t.montoBase;
      igvSum += t.igv;
      totSum += t.total;
      return `
        <tr class="border-b border-slate-200 hover:bg-slate-50">
          <td class="p-2 font-mono">${t.fecha}</td>
          <td class="p-2 text-[9px] font-bold">FACTURA ADQUIRIDA</td>
          <td class="p-2 font-mono">${t.documento}</td>
          <td class="p-2 font-mono">${t.rucClienteProveedor}</td>
          <td class="p-2 truncate max-w-[150px]">${t.glosa.split('-')[1]?.trim() || 'Proveedor General'}</td>
          <td class="p-2 truncate max-w-[150px] text-slate-500">${t.glosa}</td>
          <td class="p-2 text-right font-mono font-semibold">${t.montoBase.toFixed(2)}</td>
          <td class="p-2 text-right font-mono">${t.igv.toFixed(2)}</td>
          <td class="p-2 text-right font-mono font-bold text-slate-900">${t.total.toFixed(2)}</td>
        </tr>
      `;
    }).join('');

    tableRowsHtml += `
      <tr class="bg-slate-100 font-bold border-t-2 border-slate-400">
        <td colspan="6" class="p-2.5 text-right">TOTAL GENERAL GENERAL:</td>
        <td class="p-2.5 text-right font-mono">${baseSum.toFixed(2)}</td>
        <td class="p-2.5 text-right font-mono">${igvSum.toFixed(2)}</td>
        <td class="p-2.5 text-right font-mono text-indigo-800">${totSum.toFixed(2)}</td>
      </tr>
    `;

  } else if (selectedTab === 'diario') {
    reportTitle = 'LIBRO DIARIO SIMPLIFICADO - PCGE PERU';
    reportSubtitle = 'RESOLUCIÓN DE SUPERINTENDENCIA SUNAT N° 234-2006/SUNAT - FORMATO 5.2';
    isLandscape = false;
    tableHeaders = ['CUENTA', 'DENOMINACIÓN DE LA CUENTA', 'FECHA', 'GLOSA / CONCEPTO DEL ASIENTO', 'DEBE (S/.)', 'HABER (S/.)'];

    let tDebe = 0;
    let tHaber = 0;

    tableRowsHtml = periodEntries.map(e => {
      tDebe += e.debe;
      tHaber += e.haber;
      return `
        <tr class="border-b border-slate-100 hover:bg-slate-50">
          <td class="p-2 font-mono font-bold text-slate-900">${e.cuenta}</td>
          <td class="p-2 text-slate-700 font-semibold">${e.cuentaNombre}</td>
          <td class="p-2 font-mono">${e.fecha}</td>
          <td class="p-2 text-slate-500">${e.glosa}</td>
          <td class="p-2 text-right font-mono text-emerald-700 font-semibold">${e.debe > 0 ? e.debe.toFixed(2) : '-'}</td>
          <td class="p-2 text-right font-mono text-indigo-700 font-semibold">${e.haber > 0 ? e.haber.toFixed(2) : '-'}</td>
        </tr>
      `;
    }).join('');

    tableRowsHtml += `
      <tr class="bg-slate-100 font-bold border-t-2 border-slate-400">
        <td colspan="4" class="p-2.5 text-right">SUMAS TOTALES DE PARTIDA DOBLE:</td>
        <td class="p-2.5 text-right font-mono text-emerald-700">${tDebe.toFixed(2)}</td>
        <td class="p-2.5 text-right font-mono text-indigo-700">${tHaber.toFixed(2)}</td>
      </tr>
    `;

  } else if (selectedTab === 'mayor') {
    reportTitle = 'LIBRO MAYOR GENERAL - FORMATO SUNAT 6.1';
    reportSubtitle = 'RESOLUCIÓN DE SUPERINTENDENCIA N° 234-2006/SUNAT';
    isLandscape = false;
    tableHeaders = ['CTA', 'DENOMINACIÓN', 'FECHA', 'GLOSA', 'DEBE (S/.)', 'HABER (S/.)', 'SALDO ACUM. (S/.)'];

    const uniqueAccounts = Array.from(new Set(periodEntries.map(e => e.cuenta))).sort();

    tableRowsHtml = uniqueAccounts.map(accCode => {
      const entriesForCta = periodEntries.filter(e => e.cuenta === accCode);
      const accountName = entriesForCta[0]?.cuentaNombre || '';
      let accumSaldo = 0;

      let subRows = entriesForCta.map(e => {
        accumSaldo += (e.debe - e.haber);
        return `
          <tr class="border-b border-slate-100 hover:bg-slate-50/50">
            <td class="p-2 font-mono font-bold text-slate-900">${e.cuenta}</td>
            <td class="p-2 text-slate-600 truncate max-w-[130px]">${accountName}</td>
            <td class="p-2 font-mono text-slate-500">${e.fecha}</td>
            <td class="p-2 text-slate-500 text-[10px]">${e.glosa}</td>
            <td class="p-2 text-right font-mono">${e.debe > 0 ? e.debe.toFixed(2) : '-'}</td>
            <td class="p-2 text-right font-mono">${e.haber > 0 ? e.haber.toFixed(2) : '-'}</td>
            <td class="p-2 text-right font-mono font-bold">${accumSaldo.toFixed(2)}</td>
          </tr>
        `;
      }).join('');

      const sumDebe = entriesForCta.reduce((sum, e) => sum + e.debe, 0);
      const sumHaber = entriesForCta.reduce((sum, e) => sum + e.haber, 0);
      const saldoFinalText = sumDebe >= sumHaber 
        ? `Saldo Deudor: S/. ${(sumDebe - sumHaber).toFixed(2)}` 
        : `Saldo Acreedor: S/. ${(sumHaber - sumDebe).toFixed(2)}`;

      return subRows + `
        <tr class="bg-slate-50 border-b border-slate-300 font-semibold" style="font-size: 8.5px;">
          <td colspan="4" class="p-1.5 text-right text-slate-500">Subtotales Cta. ${accCode}:</td>
          <td class="p-1.5 text-right font-mono">${sumDebe.toFixed(2)}</td>
          <td class="p-1.5 text-right font-mono">${sumHaber.toFixed(2)}</td>
          <td class="p-1.5 text-right font-mono font-bold text-indigo-800 bg-slate-100">${saldoFinalText}</td>
        </tr>
      `;
    }).join('');

  } else if (selectedTab === 'balance') {
    reportTitle = 'BALANCE DE SITUACIÓN FINANCIERA (ACTIVOS, PASIVOS Y PATRIMONIO)';
    reportSubtitle = 'ESTADOS FINANCIEROS AUDITADOS BAJO NORMAS INTERNACIONALES DE CONTABILIDAD (NIC/NIIF)';
    isLandscape = false;
    tableHeaders = ['NUR. ELEMENTO', 'DESCRIPCIÓN DE LA CATEGORÍA', 'ACTIVO (DEBE / S/.)', 'PASIVO + PATRIMONIO (HABER / S/.)'];

    // Calculations
    const cajaBancos = periodEntries.filter(e => e.cuenta.startsWith('10')).reduce((sum, e) => sum + (e.debe - e.haber), 0);
    const ctasPorCobrar = periodEntries.filter(e => e.cuenta.startsWith('12')).reduce((sum, e) => sum + (e.debe - e.haber), 0);
    const mercaderias = periodEntries.filter(e => e.cuenta.startsWith('20')).reduce((sum, e) => sum + (e.debe - e.haber), 0);
    const totalActivos = cajaBancos + ctasPorCobrar + mercaderias;

    const tributos = periodEntries.filter(e => e.cuenta.startsWith('40')).reduce((sum, e) => sum + (e.haber - e.debe), 0);
    const planillas = periodEntries.filter(e => e.cuenta.startsWith('41')).reduce((sum, e) => sum + (e.haber - e.debe), 0);
    const ctasPorPagar = periodEntries.filter(e => e.cuenta.startsWith('42')).reduce((sum, e) => sum + (e.haber - e.debe), 0);
    const totalPasivos = tributos + planillas + ctasPorPagar;

    const capitalSocial = periodEntries.filter(e => e.cuenta.startsWith('50')).reduce((sum, e) => sum + (e.haber - e.debe), 0);
    const ingresos = periodEntries.filter(e => e.cuenta.startsWith('7')).reduce((sum, e) => sum + (e.haber - e.debe), 0);
    const gastos = periodEntries.filter(e => e.cuenta.startsWith('6') || e.cuenta.startsWith('9')).reduce((sum, e) => sum + (e.debe - e.haber), 0);
    const utilidadNeto = ingresos - gastos;
    const totalPatrimonio = capitalSocial + utilidadNeto;
    const totalPasivoYPatrimonio = totalPasivos + totalPatrimonio;

    tableRowsHtml = `
      <tr class="border-b border-slate-100">
        <td class="p-2 font-mono font-bold text-slate-500">CTA. 10</td>
        <td class="p-2">Efectivo y Equivalentes de Efectivo (Caja y Banco)</td>
        <td class="p-2 text-right font-mono">${cajaBancos.toFixed(2)}</td>
        <td class="p-2 text-right font-mono">-</td>
      </tr>
      <tr class="border-b border-slate-100">
        <td class="p-2 font-mono font-bold text-slate-500">CTA. 12</td>
        <td class="p-2">Cuentas por Cobrar Comerciales (Crédito a Clientes)</td>
        <td class="p-2 text-right font-mono">${ctasPorCobrar.toFixed(2)}</td>
        <td class="p-2 text-right font-mono">-</td>
      </tr>
      <tr class="border-b border-slate-100">
        <td class="p-2 font-mono font-bold text-slate-500">CTA. 20</td>
        <td class="p-2">Mercaderías en Almacén (Valor de Inventario)</td>
        <td class="p-2 text-right font-mono">${mercaderias.toFixed(2)}</td>
        <td class="p-2 text-right font-mono">-</td>
      </tr>
      <tr class="bg-emerald-50 border-b border-emerald-200 font-bold text-emerald-950">
        <td colspan="2" class="p-2.5">TOTAL GENERAL DE ACTIVOS REALES (A):</td>
        <td class="p-2.5 text-right font-mono">${totalActivos.toFixed(2)}</td>
        <td class="p-2.5 text-right font-mono">-</td>
      </tr>
      <tr class="border-b border-slate-100">
        <td class="p-2 font-mono font-bold text-slate-500">CTA. 40</td>
        <td class="p-2">Tributos por Pagar (SUNAT IGV y Renta Mensual)</td>
        <td class="p-2 text-right font-mono">-</td>
        <td class="p-2 text-right font-mono">${tributos.toFixed(2)}</td>
      </tr>
      <tr class="border-b border-slate-100">
        <td class="p-2 font-mono font-bold text-slate-500">CTA. 41</td>
        <td class="p-2">Remuneraciones por Pagar (Planillas y Beneficios de Personal)</td>
        <td class="p-2 text-right font-mono">-</td>
        <td class="p-2 text-right font-mono">${planillas.toFixed(2)}</td>
      </tr>
      <tr class="border-b border-slate-100">
        <td class="p-2 font-mono font-bold text-slate-500">CTA. 42</td>
        <td class="p-2">Cuentas por Pagar Comerciales (Créditos de Proveedores)</td>
        <td class="p-2 text-right font-mono">-</td>
        <td class="p-2 text-right font-mono">${ctasPorPagar.toFixed(2)}</td>
      </tr>
      <tr class="bg-red-50 border-b border-red-200 font-bold text-red-950">
        <td colspan="2" class="p-2.5">TOTAL GENERAL DE OBLIGACIONES Y PASIVOS:</td>
        <td class="p-2.5 text-right font-mono">-</td>
        <td class="p-2.5 text-right font-mono">${totalPasivos.toFixed(2)}</td>
      </tr>
      <tr class="border-b border-slate-100">
        <td class="p-2 font-mono font-bold text-slate-500">CTA. 50</td>
        <td class="p-2">Capital Social Registrado (Inversión Inicial Propia)</td>
        <td class="p-2 text-right font-mono">-</td>
        <td class="p-2 text-right font-mono">${capitalSocial.toFixed(2)}</td>
      </tr>
      <tr class="border-b border-slate-100">
        <td class="p-2 font-mono font-bold text-slate-500">UTILIDAD</td>
        <td class="p-2">Ganancia o Utilidad Neta del Periodo (Ingresos - Gastos)</td>
        <td class="p-2 text-right font-mono">-</td>
        <td class="p-2 text-right font-mono">${utilidadNeto.toFixed(2)}</td>
      </tr>
      <tr class="bg-blue-50 border-b border-blue-200 font-bold text-blue-950">
        <td colspan="2" class="p-2.5">TOTAL PATRIMONIO NETO CONSOLIDADO:</td>
        <td class="p-2.5 text-right font-mono">-</td>
        <td class="p-2.5 text-right font-mono">${totalPatrimonio.toFixed(2)}</td>
      </tr>
      <tr class="bg-slate-100 border-t-2 border-slate-400 font-bold text-slate-950" style="font-size: 11px;">
        <td colspan="2" class="p-3">TOTAL GENERAL PASIVO + PATRIMONIO NETO (B):</td>
        <td class="p-3 text-right font-mono">-</td>
        <td class="p-3 text-right font-mono text-indigo-900">${totalPasivoYPatrimonio.toFixed(2)}</td>
      </tr>
    `;

  } else if (selectedTab === 'inventario') {
    reportTitle = 'REGISTRO DE INVENTARIO PERMANENTE VALORIZADO';
    reportSubtitle = 'FORMATO 13.1 - LIBRO AUXILIAR CONTABLE DE ALMACÉN (KÁRDEX)';
    isLandscape = true;
    tableHeaders = ['FECHA', 'TIPO OPERACIÓN', 'DOC N°', 'DETALLE / CONCEPTO', 'ENT. QTY', 'ENT. P.U.', 'ENT. TOT', 'SAL. QTY', 'SAL. P.U.', 'SAL. TOT', 'SALD. QTY', 'SALD. P.U.', 'SALD. TOT'];

    const prodId = selectedInventoryProduct || (catalogItems.find(c => c.isPhysical)?.id);
    const kardex = getKardexForProduct && prodId ? getKardexForProduct(prodId) : null;

    if (kardex) {
      reportSubtitle += ` | SKU: ${kardex.product.sku} - ${kardex.product.desc} (${kardex.product.unidad})`;

      tableRowsHtml = `
        <tr class="border-b border-slate-200 bg-slate-50 font-semibold">
          <td class="p-1.5 font-mono">-</td>
          <td class="p-1.5">SALDO DE APERTURA</td>
          <td class="p-1.5 font-mono">-</td>
          <td class="p-1.5 text-slate-400">Estado Inicial de Inventario</td>
          <td class="p-1.5 text-right font-mono">-</td>
          <td class="p-1.5 text-right font-mono">-</td>
          <td class="p-1.5 text-right font-mono">-</td>
          <td class="p-1.5 text-right font-mono">-</td>
          <td class="p-1.5 text-right font-mono">-</td>
          <td class="p-1.5 text-right font-mono">-</td>
          <td class="p-1.5 text-right font-mono text-indigo-800 font-bold">${kardex.stockInicial}</td>
          <td class="p-1.5 text-right font-mono text-slate-600">${kardex.costoInicial.toFixed(2)}</td>
          <td class="p-1.5 text-right font-mono text-slate-900 font-bold">${kardex.valorInicial.toFixed(2)}</td>
        </tr>
      `;

      tableRowsHtml += kardex.movements.map((mov: any) => `
        <tr class="border-b border-slate-100 hover:bg-slate-50 text-[9px]">
          <td class="p-1.5 font-mono">${mov.fecha}</td>
          <td class="p-1.5 font-mono">${mov.tipo}</td>
          <td class="p-1.5 font-mono">${mov.documento}</td>
          <td class="p-1.5 text-slate-500 truncate max-w-[120px]">${mov.glosa}</td>
          <td class="p-1.5 text-right font-mono">${mov.entryQty > 0 ? mov.entryQty : '-'}</td>
          <td class="p-1.5 text-right font-mono">${mov.entryQty > 0 ? mov.entryPrice.toFixed(2) : '-'}</td>
          <td class="p-1.5 text-right font-mono text-emerald-700 font-medium">${mov.entryQty > 0 ? mov.entryTotal.toFixed(2) : '-'}</td>
          <td class="p-1.5 text-right font-mono">${mov.exitQty > 0 ? mov.exitQty : '-'}</td>
          <td class="p-1.5 text-right font-mono">${mov.exitQty > 0 ? mov.exitPrice.toFixed(2) : '-'}</td>
          <td class="p-1.5 text-right font-mono text-rose-700 font-medium">${mov.exitQty > 0 ? mov.exitTotal.toFixed(2) : '-'}</td>
          <td class="p-1.5 text-right font-mono font-bold text-slate-800">${mov.saldoStock}</td>
          <td class="p-1.5 text-right font-mono">${mov.saldoCost.toFixed(2)}</td>
          <td class="p-1.5 text-right font-mono font-bold text-slate-900">${mov.saldoTotal.toFixed(2)}</td>
        </tr>
      `).join('');

      tableRowsHtml += `
        <tr class="bg-slate-100 font-bold border-t-2 border-slate-400 text-[10px]">
          <td colspan="4" class="p-2 text-right">TOTALIZADO DE ALMACÉN:</td>
          <td colspan="3" class="p-2 text-right font-mono text-emerald-800">Suma Entradas: ${kardex.totalEntradas} pz</td>
          <td colspan="3" class="p-2 text-right font-mono text-rose-800">Suma Salidas: ${kardex.totalSalidas} pz</td>
          <td class="p-2 text-right font-mono font-black text-slate-900">${kardex.stockActual}</td>
          <td class="p-2 text-right font-mono">${kardex.costoPromedioActual.toFixed(2)}</td>
          <td class="p-2 text-right font-mono font-black text-slate-900">${kardex.valorActual.toFixed(2)}</td>
        </tr>
      `;
    }

  } else if (selectedTab === 'catalogo') {
    reportTitle = 'CATÁLOGO DE BIENES Y SERVICIOS';
    reportSubtitle = 'REGISTRO DE INVENTARIOS DE LA EMPRESA';
    isLandscape = false;
    tableHeaders = ['CÓDIGO SKU', 'DESCRIPCIÓN DEL BIEN O SERVICIO', 'TIPO ITEM', 'PRECIO VENTA (S/.)', 'COSTO UNIT. INICIAL', 'MEDIDA'];

    tableRowsHtml = catalogItems.map(item => `
      <tr class="border-b border-slate-200 hover:bg-slate-50 text-[10px]">
        <td class="p-2.5 font-mono font-bold text-slate-900">${item.sku}</td>
        <td class="p-2.5 font-sans font-medium text-slate-800">${item.desc}</td>
        <td class="p-2.5 font-mono text-slate-500">${item.isPhysical ? 'BIEN FÍSICO' : 'SERVICIO / ASESORÍA'}</td>
        <td class="p-2.5 text-right font-mono font-bold text-indigo-700">${item.precio.toFixed(2)}</td>
        <td class="p-2.5 text-right font-mono text-slate-600">${item.isPhysical ? (item.costoInicial || 0).toFixed(2) : '-'}</td>
        <td class="p-2.5 font-mono text-slate-500">${item.unidad}</td>
      </tr>
    `).join('');
  }

  // Build high-craftsmanship printable document
  const printContent = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <title>${reportTitle}</title>
      <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
      <style>
        @media print {
          body {
            background-color: #ffffff !important;
            color: #000000 !important;
            font-size: 8.5px !important;
          }
          @page {
            size: A4 ${isLandscape ? 'landscape' : 'portrait'};
            margin: 1.2cm 1cm;
          }
          .no-print { display: none !important; }
          tr { page-break-inside: avoid; }
        }
        body {
          font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
          color: #1e293b;
          font-size: 10px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 9px;
        }
        th {
          font-size: 9px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
      </style>
    </head>
    <body class="bg-white p-6 max-w-7xl mx-auto">
      
      <!-- TOOLBAR (Hidden in Print) -->
      <div class="no-print mb-6 bg-slate-900 text-white p-4 rounded-2xl flex items-center justify-between shadow-lg shadow-slate-900/15 animate-fadeIn">
        <div class="flex items-center gap-2.5">
          <span class="bg-emerald-500 text-white font-bold px-2 py-0.5 rounded text-xs">VISTA PREVIA IMPRESIÓN</span>
          <p class="text-xs text-slate-300">Este documento ha sido estructurado para guardarse como PDF o enviarse a imprimir.</p>
        </div>
        <div class="flex items-center gap-2">
          <button onclick="window.print()" class="bg-emerald-500 hover:bg-emerald-600 font-bold px-4 py-1.5 rounded-xl text-xs transition-colors cursor-pointer text-white flex items-center gap-1 shadow-md shadow-emerald-500/10">
            🖨️ Enviar a PDF / Impresora
          </button>
          <button onclick="window.close()" class="bg-slate-800 hover:bg-slate-750 font-semibold px-3 py-1.5 rounded-xl text-xs transition-colors cursor-pointer text-slate-300">
            Cerrar Vista
          </button>
        </div>
      </div>

      <!-- HEADER CONTABLE -->
      <div class="border-b-2 border-slate-900 pb-4 mb-6">
        <div class="flex justify-between items-start">
          <div>
            <span class="bg-slate-900 text-white font-bold text-[9px] px-2 py-0.5 rounded tracking-widest block w-max uppercase mb-1">REPORTE TRIBUTARIO OFICIAL</span>
            <h1 class="text-slate-950 font-black text-lg tracking-tight leading-tight uppercase">${reportTitle}</h1>
            <p class="text-slate-500 text-[10px] font-semibold">${reportSubtitle}</p>
          </div>
          <div class="text-right">
            <h3 class="font-bold text-slate-900 text-base leading-none">MYPE CONTABLE 2026</h3>
            <p class="text-[9.5px] text-slate-500 font-semibold mt-1">SISTEMA INTEGRAL DE DECLARACIÓN</p>
            <p class="text-[8.5px] text-slate-400 font-mono">Generado el: ${new Date().toLocaleString('es-PE')}</p>
          </div>
        </div>

        <div class="grid grid-cols-4 gap-4 mt-5 bg-slate-50 border border-slate-200 p-3 rounded-xl text-[9.5px] font-sans">
          <div>
            <span class="text-slate-400 font-bold block">EMPRESA (RAZÓN SOCIAL):</span>
            <span class="font-extrabold text-slate-800 uppercase">${companyName || solUser}</span>
          </div>
          <div>
            <span class="text-slate-400 font-bold block">RUC EMISOR:</span>
            <span class="font-mono font-black text-slate-800">${ruc}</span>
          </div>
          <div>
            <span class="text-slate-400 font-bold block">PERIODO FISCAL ACTIVO:</span>
            <span class="font-bold text-slate-800 font-mono">${period}</span>
          </div>
          <div>
            <span class="text-slate-400 font-bold block">RÉGIMEN TRIBUTARIO CONTABLE:</span>
            <span class="font-extrabold text-emerald-700">${regimen === 'RER' ? 'ESPECIAL DE RENTA (RER)' : 'MYPE TRIBUTARIO (RMT)'}</span>
          </div>
        </div>
      </div>

      <!-- TABLE CONTENT -->
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead>
            <tr class="bg-slate-900 text-white border border-slate-900">
              ${tableHeaders.map(h => `<th class="p-2 font-black text-[9px] text-left">${h}</th>`).join('')}
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200 border border-slate-200">
            ${tableRowsHtml}
          </tbody>
        </table>
      </div>

      <!-- SIGNATURE SECTION -->
      <div class="mt-16 grid grid-cols-2 gap-12 text-center text-[10px] no-print-break page-break-inside-avoid">
        <div class="flex flex-col items-center">
          <div class="w-56 border-t border-slate-400 pt-2 flex flex-col items-center">
            <span class="font-black text-slate-800 uppercase">${representanteLegal || companyName || solUser}</span>
            <span class="text-slate-400 font-bold mt-0.5">REPRESENTANTE LEGAL</span>
            <span class="text-slate-400 font-mono font-semibold text-[8px] mt-0.5">RUC: ${ruc}</span>
          </div>
        </div>
        <div class="flex flex-col items-center">
          <div class="w-56 border-t border-slate-400 pt-2 flex flex-col items-center">
            <span class="font-black text-slate-800">C.P.C. REGISTRO CCPL</span>
            <span class="text-slate-400 font-bold mt-0.5">CONTADOR GENERAL</span>
            <span class="text-slate-400 font-mono font-semibold text-[8px] mt-0.5">MATRÍCULA DE COLEGIO N° 45610</span>
          </div>
        </div>
      </div>

      <!-- FOOTER TRIBUTARIO -->
      <div class="mt-12 pt-4 border-t border-slate-200 text-center text-slate-400 text-[8px] font-medium leading-relaxed">
        Declaración Informativa Simulada de carácter Contable en estricto cumplimiento del Plan Contable General Empresarial (PCGE) de la República del Perú.
        <br>
        Todo cuadre contable responde a la teoría de partida doble regulada por los PCGE vigentes de la SUNAT.
      </div>

      <script>
        // Auto trigger print in a short delay so styles are fully rendered
        window.onload = () => {
          setTimeout(() => {
            window.print();
          }, 350);
        };
      </script>
    </body>
    </html>
  `;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(printContent);
    printWindow.document.close();
  } else {
    // Fallback if popup blocker active
    alert('Por favor, permite abrir ventanas emergentes para mostrar la vista previa e impresión de PDF del reporte contable.');
  }
};
