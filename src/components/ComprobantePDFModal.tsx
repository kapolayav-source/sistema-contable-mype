import React, { useRef, useState } from 'react';
import { X, Download, FileText, Printer, Check } from 'lucide-react';
import { Transaction, CompanyConfig } from '../types';

interface ComprobantePDFModalProps {
  isOpen: boolean;
  onClose: () => void;
  venta: Transaction | null;
  companyConfig: CompanyConfig;
}

// Convert numbers to Spanish words helper
function numeroALetras(value: number): string {
  const arrUnidades = [
    '', 'UN', 'DOS', 'TRES', 'CUATRO', 'CINCO', 'SEIS', 'SIETE', 'OCHO', 'NUEVE', 'DIEZ',
    'ONCE', 'DOCE', 'TRECE', 'CATORCE', 'QUINCE', 'DIECISEIS', 'DIECISIETE', 'DIECIOCHO', 'DIECINUEVE'
  ];
  const arrDecenas = [
    '', 'DIEZ', 'VEINTE', 'TREINTA', 'CUARENTA', 'CINCUENTA', 'SESENTA', 'SETENTA', 'OCHENTA', 'NOVENTA'
  ];
  const arrCentenas = [
    '', 'CIENTO', 'DOSCIENTOS', 'TRESCIENTOS', 'CUATROCIENTOS', 'QUINIENTOS', 'SEISCIENTOS', 'SIETECIENTOS', 'OCHOCIENTOS', 'NOVECIENTOS'
  ];

  const entero = Math.floor(value);
  const centavos = Math.round((value - entero) * 100);
  const centavosStr = centavos.toString().padStart(2, '0') + '/100 SOLES';

  if (entero === 0) return `CERO Y ${centavosStr}`;

  function conversion(n: number): string {
    if (n < 20) return arrUnidades[n];
    if (n < 100) {
      const d = Math.floor(n / 10);
      const u = n % 10;
      return u === 0 ? arrDecenas[d] : `${arrDecenas[d]} Y ${arrUnidades[u]}`;
    }
    if (n < 1000) {
      if (n === 100) return 'CIEN';
      const c = Math.floor(n / 100);
      const resto = n % 100;
      return resto === 0 ? arrCentenas[c] : `${arrCentenas[c]} ${conversion(resto)}`;
    }
    if (n < 1000000) {
      const mil = Math.floor(n / 1000);
      const resto = n % 1000;
      let milStr = '';
      if (mil === 1) {
        milStr = 'MIL';
      } else {
        milStr = `${conversion(mil)} MIL`;
      }
      return resto === 0 ? milStr : `${milStr} ${conversion(resto)}`;
    }
    return 'UN MILLÓN';
  }

  return `${conversion(entero)} Y ${centavosStr}`;
}

export const ComprobantePDFModal: React.FC<ComprobantePDFModalProps> = ({
  isOpen,
  onClose,
  venta,
  companyConfig
}) => {
  const [downloading, setDownloading] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !venta) return null;

  const isFactura = venta.documento.toUpperCase().startsWith('F');
  const tipoComprobanteLabel = isFactura ? 'FACTURA ELECTRÓNICA' : 'BOLETA DE VENTA ELECTRÓNICA';
  const tipoComprobanteSUNATCode = isFactura ? '01' : '03';

  // Resolve customer name and address elegantly for realism based on RUC
  let razonSocialCliente = 'CLIENTE GENÉRICO';
  let direccionCliente = 'AV. JAVIER PRADO ESTE 2450, SAN BORJA, LIMA';

  if (venta.rucClienteProveedor === '20601234567') {
    razonSocialCliente = 'Inversiones Unidas SAC';
    direccionCliente = 'Av. La Marina 1520, San Miguel, Lima';
  } else if (venta.rucClienteProveedor === '10467812349') {
    razonSocialCliente = 'Juan Manuel Pérez Ramos';
    direccionCliente = 'Calle Las Begonias 450, San Isidro, Lima';
  } else if (venta.rucClienteProveedor === '20459876543') {
    razonSocialCliente = 'Distribuidora Alimentos del Sur EIRL';
    direccionCliente = 'Jr. Huancavelica 741, Cercado de Lima, Lima';
  } else {
    // Elegant generation of realistic names if not found
    const names = [
      'Representaciones Contables del Norte S.A.C.',
      'Servicios Logísticos y Comercio Perú S.A.',
      'Consorcio Industrial MYPE del Sur S.A.C.',
      'Comercializadora de Productos Innovadores S.A.'
    ];
    // pseudo-random seed based on ruc
    const seed = parseInt(venta.rucClienteProveedor.slice(-2)) || 0;
    razonSocialCliente = names[seed % names.length];
  }

  // Calculate detailed pricing if not fully specified
  const qty = venta.cantidad || 1;
  const unitVal = venta.precioUnitario || (venta.montoBase / qty);
  const totalItemVal = qty * unitVal;

  // SUNAT QR format: Issuer RUC | Type Code | Serie | Correlativo | IGV | Total | Date | Customer Doc Type | Customer Doc Number |
  // 6 = RUC, 1 = DNI
  const docTypeCustomer = venta.rucClienteProveedor.length === 11 ? '6' : '1';
  const qrString = `20731209182|${tipoComprobanteSUNATCode}|${venta.documento}|${venta.igv.toFixed(2)}|${venta.total.toFixed(2)}|${venta.fecha}|${docTypeCustomer}|${venta.rucClienteProveedor}|`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrString)}`;

  const handleDownload = async () => {
    try {
      setDownloading(true);
      const { default: html2canvas } = await import('html2canvas');
      const { jsPDF } = await import('jspdf');

      const element = document.getElementById('comprobante-a4-document');
      if (!element) {
        setDownloading(false);
        return;
      }

      // Hide shadow and borders for exact printing output
      const canvas = await html2canvas(element, {
        scale: 2, // Retain crystal clear rendering
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; // A4 standard width (mm)
      const pageHeight = 297; // A4 standard height (mm)
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`${venta.documento}.pdf`);
    } catch (err) {
      console.error('Error generating PDF:', err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999] overflow-y-auto p-4 backdrop-blur-xs">
      <div className="bg-slate-900/45 absolute inset-0 cursor-pointer" onClick={onClose} />
      
      {/* Modal Container */}
      <div className="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-4xl w-full border border-slate-200 dark:border-slate-800 flex flex-col max-h-[92vh] overflow-hidden animate-fadeIn">
        
        {/* Header toolbar */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-xl">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider font-heading">
                Comprobante de Pago Electrónico
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                SUNAT Formato A4 Oficial de Kipurev
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="flex items-center gap-1.5 px-4 py-2 bg-indigo-650 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm hover:scale-[1.01] cursor-pointer disabled:opacity-50"
            >
              {downloading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Procesando...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Descargar PDF</span>
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable document area */}
        <div className="p-6 overflow-y-auto bg-slate-100 dark:bg-slate-950/40 flex justify-center flex-1">
          
          {/* Printable A4 Document Sheet */}
          <div
            id="comprobante-a4-document"
            ref={reportRef}
            className="w-[794px] min-h-[1123px] bg-white text-slate-900 p-10 shadow-lg border border-slate-200 flex flex-col justify-between font-sans shrink-0"
            style={{ color: '#1e293b', backgroundColor: '#ffffff' }} // Force black text & white canvas
          >
            {/* Top segment */}
            <div>
              {/* Header row */}
              <div className="grid grid-cols-12 gap-4 items-start mb-8 pb-6 border-b border-slate-200">
                {/* Logo & Issuer details */}
                <div className="col-span-7 flex gap-4 items-start">
                  {/* Kipurev vector logo */}
                  <div className="w-14 h-14 bg-slate-900 text-white flex items-center justify-center rounded-xl font-bold font-heading text-lg tracking-tighter shrink-0">
                    KR
                  </div>
                  <div className="space-y-1">
                    <h1 className="text-xl font-black tracking-tight text-slate-900 uppercase">KIPUREV S.A.C.</h1>
                    <p className="text-[10.5px] font-bold text-slate-500 uppercase leading-normal">
                      Sistemas Contables y Facturación MYPE Inteligente
                    </p>
                    <p className="text-[10px] text-slate-500 leading-normal">
                      Av. Canaval y Moreyra 480, Piso 12, San Isidro, Lima, Perú
                    </p>
                    <p className="text-[10px] text-slate-500 leading-normal">
                      Telf: (01) 641-9021 • contacto@kipurev.pe • www.kipurev.pe
                    </p>
                  </div>
                </div>

                {/* SUNAT RUC & Comprobante Number Frame */}
                <div className="col-span-5 border-2 border-indigo-600 rounded-2xl p-5 text-center bg-indigo-50/10 flex flex-col justify-center items-center h-full">
                  <span className="text-sm font-bold tracking-widest text-indigo-900">R.U.C. 20731209182</span>
                  <span className="text-[11.5px] font-black tracking-wider text-indigo-850 uppercase my-2 bg-indigo-100/60 px-3 py-1 rounded-md">
                    {tipoComprobanteLabel}
                  </span>
                  <span className="text-base font-mono font-bold tracking-widest text-slate-800">
                    Nro. {venta.documento}
                  </span>
                </div>
              </div>

              {/* Client Info Block */}
              <div className="border border-slate-200 rounded-2xl p-4 mb-8 bg-slate-50/50">
                <h3 className="text-[10.5px] font-black tracking-wider text-slate-400 uppercase mb-3 border-b border-slate-200/60 pb-1">
                  DATOS DE ADQUIRIENTE / CLIENTE
                </h3>
                <div className="grid grid-cols-12 gap-x-6 gap-y-2.5 text-xs text-slate-700">
                  <div className="col-span-8 space-y-1.5">
                    <div>
                      <span className="font-bold text-slate-500 w-28 inline-block">Razón Social:</span>
                      <strong className="text-slate-900 text-xs font-semibold">{razonSocialCliente}</strong>
                    </div>
                    <div>
                      <span className="font-bold text-slate-500 w-28 inline-block">RUC / DNI:</span>
                      <span className="font-mono font-bold text-slate-800">{venta.rucClienteProveedor}</span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-500 w-28 inline-block">Dirección:</span>
                      <span className="text-slate-850">{direccionCliente}</span>
                    </div>
                  </div>

                  <div className="col-span-4 space-y-1.5 border-l border-slate-200 pl-6">
                    <div>
                      <span className="font-bold text-slate-500 block">Fecha de Emisión:</span>
                      <strong className="text-slate-900 font-mono">{venta.fecha}</strong>
                    </div>
                    <div>
                      <span className="font-bold text-slate-500 block">Moneda:</span>
                      <span className="font-semibold text-slate-800">SOLES (S/.)</span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-500 block">Tipo Pago:</span>
                      <span className="text-[10px] font-bold uppercase px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded">
                        {venta.formaPago || 'Contado'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Table of items */}
              <table className="w-full border-collapse mb-8 text-xs text-slate-700">
                <thead>
                  <tr className="bg-slate-900 text-white font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-2 px-3 text-center rounded-l-lg w-16">Cant.</th>
                    <th className="py-2 px-3 text-left">Descripción / Glosa del Concepto</th>
                    <th className="py-2 px-3 text-right w-28">Valor Unitario</th>
                    <th className="py-2 px-3 text-right rounded-r-lg w-28">Importe</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50/50">
                    <td className="py-4 px-3 text-center font-mono font-bold">{qty}</td>
                    <td className="py-4 px-3">
                      <div className="font-semibold text-slate-900">{venta.glosa}</div>
                      <div className="text-[9px] text-slate-400 mt-0.5 uppercase">Servicio de Asesoría y Gestión Comercial</div>
                    </td>
                    <td className="py-4 px-3 text-right font-mono text-slate-650">
                      S/. {unitVal.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="py-4 px-3 text-right font-mono font-semibold text-slate-900">
                      S/. {totalItemVal.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                  
                  {/* Empty spacer row for design structure */}
                  <tr className="h-24">
                    <td colSpan={4} />
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Bottom segment */}
            <div>
              {/* Financial Breakdown Frame */}
              <div className="grid grid-cols-12 gap-4 border-t-2 border-slate-100 pt-6">
                {/* Words currency & QR */}
                <div className="col-span-7 flex gap-5 items-end">
                  {/* Real SUNAT square QR Code */}
                  <img
                    src={qrCodeUrl}
                    alt="QR SUNAT"
                    className="w-28 h-28 border border-slate-200 p-1.5 bg-white rounded-xl shadow-xs"
                    referrerPolicy="no-referrer"
                  />
                  
                  <div className="space-y-3 flex-1 pb-1">
                    <div>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Importe con Letras</span>
                      <p className="text-[10px] font-extrabold text-slate-800 leading-normal uppercase">
                        SON: {numeroALetras(venta.total)}
                      </p>
                    </div>

                    <div className="text-[9.5px] text-slate-400 leading-relaxed font-sans">
                      Representación impresa de la {tipoComprobanteLabel} de Kipurev. 
                      Autorizado mediante Resolución de Superintendencia SUNAT. 
                      Consulte la validez del comprobante usando su clave SOL.
                    </div>
                  </div>
                </div>

                {/* Subtotals & Totals */}
                <div className="col-span-5 bg-slate-50/60 border border-slate-200/80 rounded-2xl p-4 space-y-2.5 h-fit text-xs">
                  <div className="flex justify-between items-center text-slate-600">
                    <span className="font-semibold">Op. Gravada (Subtotal):</span>
                    <span className="font-mono font-semibold">
                      S/. {venta.montoBase.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-slate-600">
                    <span className="font-semibold">I.G.V. (18%):</span>
                    <span className="font-mono font-semibold">
                      S/. {venta.igv.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-slate-600">
                    <span className="font-semibold">Op. Exonerada:</span>
                    <span className="font-mono">S/. 0.00</span>
                  </div>
                  
                  <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-slate-900 font-black">
                    <span className="text-sm">IMPORTE TOTAL:</span>
                    <span className="text-sm font-mono text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-lg">
                      S/. {venta.total.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Thank you note */}
              <div className="text-center mt-10 pt-4 border-t border-dashed border-slate-200 text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                ¡Gracias por hacer negocios con Kipurev! • Impulsando tu crecimiento MYPE
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
