import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Helper for ESM in Node when running directly
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware for parsing JSON
  app.use(express.json());

  // Lazy Gemini Client getter to prevent crash if key is missing on startup
  let aiClient: GoogleGenAI | null = null;
  function getGeminiClient() {
    if (!aiClient) {
      let apiKey = process.env.GEMINI_API_KEY;
      if (apiKey) {
        apiKey = apiKey.trim().replace(/^['"]|['"]$/g, '');
      }
      if (!apiKey) {
        throw new Error('GEMINI_API_KEY no configurado en los Secretos de AI Studio.');
      }
      aiClient = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
    }
    return aiClient;
  }

  // System instructions for the MYPE tax expert
  const SYSTEM_INSTRUCTION = `
Eres un contador público experto colegiado en el Perú, especializado de forma exclusiva en el Régimen MYPE Tributario (RMT) y las normativas de la SUNAT (Superintendencia Nacional de Aduanas y de Administración Tributaria).
Tu propósito es ayudar a micro y pequeños empresarios peruanos (MYPE) a comprender de forma ultra-simple y amigable sus obligaciones tributarias mensuales, declaraciones, libros electrónicos y pagos de impuestos.

Directrices para tus respuestas:
1. Habla con un tono profesional, empático, claro, andino/peruano y alentador. Usa términos locales correctos como "boletas de venta", "factura electrónica", "cronograma según el último dígito del RUC", "pago a cuenta del Impuesto a la Renta", "IGV Justo (Ley N° 30524)", "depósitos de detracciones", "PDT 621", "SIRE (Sistema Integrado de Registros Electrónicos)".
2. Simplifica las leyes complejas. Si respondes sobre cálculos, explica la ecuación paso a paso con S/. (Soles).
3. Recuerda que para el Régimen MYPE Tributario (RMT) en el Perú:
  - Límite de ingresos: Hasta 1700 UIT al año (1 UIT para el año fiscal actual de referencia es S/. 5,150 o S/. 5,200).
  - Tasas mensuales de Pago a Cuenta de Renta:
    * Si las ventas no superan las 300 UIT en el ejercicio: La tasa es de 1.0% de los ingresos netos obtenidos en el mes.
    * Si las ventas superan las 300 UIT pero no las 1700 UIT: La tasa es de 1.5% o coeficiente aplicable.
  - Tasa de IGV: 18% (compuesto por 16% de IGV y 2% de Impuesto de Promoción Municipal o IPM).
  - Tasa Anual de Renta (en la declaración jurada anual):
    * Tramo de hasta 15 UIT de utilidad neta: 10%
    * Tramo que excede las 15 UIT de utilidad neta: 29.5%
4. Si un usuario te pregunta por deducibilidad de gastos, recuérdale el "Principio de Causalidad" (artículo 37 de la Ley del Impuesto a la Renta): el gasto debe ser necesario para producir y mantener la fuente de ingresos del negocio.
5. Al final de tu respuesta, opcionalmente añade un consejo tributario rápido o tip de ahorro para el MYPE.
Mantén tus respuestas bien estructuradas, usando negritas y viñetas sencillas de leer. No uses tecnicismos exagerados sin antes explicarlos de forma humana.
`;

  // API Route for chat assistant
  app.post('/api/chat', async (req, res) => {
    try {
      const { messages, modoSencillo } = req.body;
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: 'Falta proveer el historial de mensajes o formato incorrecto.' });
      }

      // Format messages history into contents compatible with @google/genai SDK
      // The SDK expects contents to match content structures with parts
      // Note: We'll map 'user' and 'assistant' roles to 'user' and 'model'
      const contents = messages.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));

      // Adjust the instructions dynamically based on modoSencillo
      const finalInstruction = modoSencillo
        ? `${SYSTEM_INSTRUCTION}
        
CRITICAL - MODO SENCILLO ACTIVADO: El usuario es un emprendedor peruano promedio que no entiende la jerga técnica contable compleja. 
1. EVITA tecnicismos como "Base Imponible", "Principio de Causalidad", "Cargar y Abonar", "Débito", "Crédito fiscal", "PCGE" sin antes explicarlos de manera súper simple.
2. Usa términos cotidianos: "Monto limpio sin IGV", "Gastos de tu negocio que ayudan a vender más", "Alcancías contables" en vez de cuentas contables, "La balanza de entradas y salidas" en vez de partida doble.
3. Explica usando ejemplos y analogías de negocios populares peruanos: bodeguitas, ferreterías, puestos de mercado, mototaxis o restaurantes de menú.
4. Usa un lenguaje muy cercano, cálido, amigable y comprensivo (puedes usar palabras cordiales como "caserito", "emprendedor", "así de facilito", "al toque").
5. Da respuestas cortas, directas y al grano. ¡El peruano de a pie prefiere respuestas rápidas y prácticas!`
        : SYSTEM_INSTRUCTION;

      const ai = getGeminiClient();
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: contents,
        config: {
          systemInstruction: finalInstruction,
          temperature: 0.7,
        }
      });

      const replyText = response.text || 'No pude generar una respuesta. Por favor intenta de nuevo.';
      res.json({ text: replyText });
    } catch (error: any) {
      console.error('Error en el servicio de Gemini:', error);
      res.status(500).json({
        error: error.message || 'Ocurrió un error interno en el servidor contable.',
        isApiKeyMissing: error.message?.includes('GEMINI_API_KEY')
      });
    }
  });

  // API Route to parse transactions from documents (PDF, Excel table text, Word text) using Gemini
  app.post('/api/parse-document', async (req, res) => {
    try {
      const { text, fileBase64, fileMimeType } = req.body;
      
      let contents: any[] = [];
      let prompt = `Eres un asistente contable peruano de nivel experto. Tu tarea es analizar el contenido de entrada de un documento (ya sea texto extraído de Excel/Word o un archivo de comprobante PDF oficial) y extraer una lista estructurada de transacciones para el Régimen MYPE Tributario.

Sigue estrictamente estas pautas contables:
1. Identifica para cada transacción si es 'VENTA', 'COMPRA', 'PLANILLA', o 'APERTURA'.
2. Extrae la fecha en formato exacto 'YYYY-MM-DD'. Si la fecha no especifica el año, asume el año actual (2026).
3. Identifica la serie y el número de documento si existen (ej. F001-0012, E001-445, B002-3923). Si no se detalla, genera uno realista.
4. Identifica el RUC de 11 dígitos y el Nombre o Razón Social del Cliente/Proveedor. Si no se detalla, crea uno realista para el Perú.
5. Obtén o calcula el 'montoBase' (base imponible sin IGV), el 'igv' (18% de la base si aplica, o 0 si está inafecto o exonerado como en planillas o algunos servicios), y el 'total' (montoBase + igv).
6. Escribe una glosa contable breve pero descriptiva en español (ej. "Venta de productos de oficina", "Servicio de transporte de carga").

Devuelve la lista de transacciones dentro del objeto de respuesta JSON.`;

      if (fileBase64 && fileMimeType) {
        // PDF or Image mode
        contents.push({
          parts: [
            {
              inlineData: {
                data: fileBase64,
                mimeType: fileMimeType
              }
            },
            { text: `${prompt}\n\nAnaliza este archivo de comprobante adjunto y extrae las transacciones correspondientes.` }
          ]
        });
      } else if (text) {
        // Text mode (Excel parsed text, Word copy-pasted text)
        contents.push({
          parts: [
            { text: `${prompt}\n\nAquí tienes el texto del documento para analizar:\n\n${text}` }
          ]
        });
      } else {
        return res.status(400).json({ error: 'Debes proporcionar un texto o un archivo en formato base64 para poder realizar la extracción contable.' });
      }

      const ai = getGeminiClient();
      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: contents,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              transactions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    fecha: {
                      type: Type.STRING,
                      description: "Fecha de la operación en formato YYYY-MM-DD."
                    },
                    tipo: {
                      type: Type.STRING,
                      description: "Tipo de transacción: VENTA, COMPRA, PLANILLA, o APERTURA"
                    },
                    montoBase: {
                      type: Type.NUMBER,
                      description: "Monto imponible neto (sin IGV) en soles."
                    },
                    igv: {
                      type: Type.NUMBER,
                      description: "IGV (18% del montoBase) en soles. Pon 0 si no aplica o si es planilla."
                    },
                    total: {
                      type: Type.NUMBER,
                      description: "Monto total (montoBase + igv) en soles."
                    },
                    glosa: {
                      type: Type.STRING,
                      description: "Glosa breve explicando la transacción."
                    },
                    rucClienteProveedor: {
                      type: Type.STRING,
                      description: "RUC de 11 dígitos del cliente o proveedor involucrado. Si no lo hay, inventa uno peruano realista."
                    },
                    clienteProveedorNombre: {
                      type: Type.STRING,
                      description: "Razón social o nombre completo del cliente o proveedor."
                    },
                    documento: {
                      type: Type.STRING,
                      description: "Serie y número de comprobante de pago (ej. F001-00234) o inventa uno si no existe."
                    }
                  },
                  required: ["fecha", "tipo", "montoBase", "igv", "total", "glosa", "rucClienteProveedor", "clienteProveedorNombre", "documento"]
                }
              }
            },
            required: ["transactions"]
          }
        }
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error('Gemini no devolvió un JSON válido o la respuesta está vacía.');
      }

      const parsedResult = JSON.parse(responseText.trim());
      res.json(parsedResult);
    } catch (error: any) {
      console.error('Error al procesar el documento con IA:', error);
      res.status(500).json({
        error: error.message || 'Error al procesar el documento con el motor contable de IA.',
        isApiKeyMissing: error.message?.includes('GEMINI_API_KEY')
      });
    }
  });

  // Seeded random helper for SUNAT / RENIEC Simulation fallback
  function getSeededRandom(seedStr: string) {
    let h = 1540483477;
    for (let i = 0; i < seedStr.length; i++) {
      h = Math.imul(h ^ seedStr.charCodeAt(i), 3432918353);
      h = (h << 13) | (h >>> 19);
    }
    return () => {
      h = Math.imul(h ^ (h >>> 16), 2246822507);
      h = Math.imul(h ^ (h >>> 13), 3266489909);
      return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
    };
  }

  const FIRST_NAMES = [
    'Juan', 'Carlos', 'Luis', 'María', 'Ana', 'José', 'Jorge', 'Pedro', 'Miguel', 'Rosa',
    'David', 'Daniel', 'Sofía', 'Lucía', 'Diego', 'Camila', 'Alejandro', 'Gabriel', 'Manuel', 'Patricia',
    'Roberto', 'César', 'Elizabeth', 'Gisela', 'Eduardo', 'Carmen', 'Walter', 'Raúl', 'Ángela', 'Héctor'
  ];

  const LAST_NAMES = [
    'Quispe', 'Flores', 'Sánchez', 'Rodríguez', 'Rojas', 'García', 'Díaz', 'Torres', 'López', 'Gonzáles',
    'Alvarez', 'Gómez', 'Fernández', 'Vásquez', 'Huamán', 'Mendoza', 'Chávez', 'Ramírez', 'Castillo', 'Espinoza',
    'Villanueva', 'Guerrero', 'Ramos', 'Paredes', 'Farfán', 'Salazar', 'Cruz', 'Yauri', 'Cárdenas', 'Palomino'
  ];

  const COMPANY_NOMS = [
    'Inversiones', 'Comercializadora', 'Distribuidora', 'Servicios Integrales', 'Corporación',
    'Grupo Industrial', 'Representaciones', 'Negociaciones', 'Consorcio', 'Constructora',
    'Soporte Tecnológico', 'Transportes y Logística', 'Importadora', 'Exportadora', 'Consultoría'
  ];

  const COMPANY_SECTORS = [
    'del Norte', 'del Sur', 'Unidas', 'Oriente', 'Pacífico', 'Andina', 'Global', 'Peruana',
    'Fénix', 'Premium', 'Alfa', 'San José', 'Nacional', 'Latinoamericana', 'Arequipa'
  ];

  const SUFFIXES = ['S.A.C.', 'E.I.R.L.', 'S.A.', 'S.R.L.'];

  function generateFidelityData(numero: string) {
    const rand = getSeededRandom(numero);
    const getRandomElement = (arr: string[]) => arr[Math.floor(rand() * arr.length)];
    
    if (numero.length === 8) {
      const first = getRandomElement(FIRST_NAMES);
      const last1 = getRandomElement(LAST_NAMES);
      const last2 = getRandomElement(LAST_NAMES);
      const nombreCompleto = `${first} ${last1} ${last2}`;
      return {
        success: true,
        tipo: 'DNI',
        numero: numero,
        nombre: nombreCompleto,
        direccion: `Calle Las Begonias ${Math.floor(rand() * 900) + 100}, San Isidro, Lima`,
        origen: 'SUNAT / RENIEC (Simulado de Alta Fidelidad)'
      };
    } else if (numero.length === 11) {
      if (numero.startsWith('10')) {
        const first = getRandomElement(FIRST_NAMES);
        const last1 = getRandomElement(LAST_NAMES);
        const last2 = getRandomElement(LAST_NAMES);
        const rubro = getRandomElement(['Bodega', 'Ferretería', 'Bazar', 'Librería', 'Consultor']);
        const nombreCompleto = `${first} ${last1} ${last2} - ${rubro}`;
        return {
          success: true,
          tipo: 'RUC (Persona Natural)',
          numero: numero,
          nombre: nombreCompleto,
          direccion: `Av. Túpac Amaru ${Math.floor(rand() * 2500) + 100}, Comas, Lima`,
          origen: 'SUNAT (Simulado de Alta Fidelidad)'
        };
      } else {
        const namePart1 = getRandomElement(COMPANY_NOMS);
        const namePart2 = getRandomElement(COMPANY_SECTORS);
        const suffix = getRandomElement(SUFFIXES);
        const razonSocial = `${namePart1} ${namePart2} ${suffix}`;
        return {
          success: true,
          tipo: 'RUC (Persona Jurídica)',
          numero: numero,
          nombre: razonSocial,
          direccion: `Av. Javier Prado Este ${Math.floor(rand() * 3000) + 100}, San Borja, Lima`,
          origen: 'SUNAT (Simulado de Alta Fidelidad)'
        };
      }
    }
    return { success: false, error: 'Número de documento inválido.' };
  }

  // Real-time RUC & DNI Consulta Route (SUNAT / RENIEC proxy)
  app.get('/api/consulta-ruc-dni', async (req, res) => {
    try {
      const { numero } = req.query;
      if (!numero || typeof numero !== 'string') {
        return res.status(400).json({ error: 'Falta proveer el número de RUC o DNI.' });
      }
      const cleanNum = numero.trim();
      if (cleanNum.length !== 8 && cleanNum.length !== 11) {
        return res.status(400).json({ error: 'El número debe ser de 8 dígitos para DNI o 11 para RUC.' });
      }

      // 1. Try apis.net.pe V2 with configured token or public test token
      const token = (process.env.APIS_NET_PE_TOKEN && process.env.APIS_NET_PE_TOKEN.trim())
        ? process.env.APIS_NET_PE_TOKEN.trim()
        : 'apis-token-1.apis.net.pe';

      try {
        let url = '';
        if (cleanNum.length === 8) {
          url = `https://api.apis.net.pe/v2/reniec/dni?numero=${cleanNum}`;
        } else {
          url = `https://api.apis.net.pe/v2/sunat/ruc?numero=${cleanNum}`;
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000); // 4s timeout

        const apiRes = await fetch(url, {
          signal: controller.signal,
          headers: {
            'Authorization': `Bearer ${token}`,
            'Referer': 'https://apis.net.pe/api-consulta-ruc-dni',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
          }
        });
        clearTimeout(timeoutId);

        if (apiRes.ok) {
          const data: any = await apiRes.json();
          if (data) {
            if (cleanNum.length === 8) {
              const nombreCompleto = `${data.nombres || ''} ${data.apellidoPaterno || ''} ${data.apellidoMaterno || ''}`.trim().toUpperCase();
              if (nombreCompleto) {
                return res.json({
                  success: true,
                  tipo: 'DNI',
                  numero: cleanNum,
                  nombre: nombreCompleto,
                  direccion: 'Domicilio Declarado - RENIEC',
                  origen: 'RENIEC Oficial en Tiempo Real (apis.net.pe)'
                });
              }
            } else {
              const razonSocial = (data.razonSocial || data.nombre || '').trim().toUpperCase();
              if (razonSocial) {
                return res.json({
                  success: true,
                  tipo: 'RUC',
                  numero: cleanNum,
                  nombre: razonSocial,
                  direccion: data.direccion || 'Domicilio Fiscal Declarado - SUNAT',
                  origen: 'SUNAT Oficial en Tiempo Real (apis.net.pe)'
                });
              }
            }
          }
        }
      } catch (v2Err) {
        console.error('Error in apis.net.pe v2 query:', v2Err);
      }

      // 2. Try apis.net.pe V1 query as fallback (legacy free, sometimes works or throttles)
      try {
        let url = '';
        if (cleanNum.length === 8) {
          url = `https://api.apis.net.pe/v1/dni?numero=${cleanNum}`;
        } else {
          url = `https://api.apis.net.pe/v1/ruc?numero=${cleanNum}`;
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3500); // 3.5s timeout

        const apiRes = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (apiRes.ok) {
          const data: any = await apiRes.json();
          if (data && data.nombre) {
            return res.json({
              success: true,
              tipo: cleanNum.length === 8 ? 'DNI' : 'RUC',
              numero: cleanNum,
              nombre: data.nombre.toUpperCase(),
              direccion: data.direccion || 'Domicilio Fiscal Declarado - SUNAT',
              origen: 'SUNAT / RENIEC Oficial en Tiempo Real'
            });
          }
        }
      } catch (err) {
        // Silent catch, proceed to high-fidelity simulation
      }

      // 3. Fallback to our high-fidelity deterministic simulator
      const fallbackData = generateFidelityData(cleanNum);
      return res.json(fallbackData);
    } catch (globalErr: any) {
      console.error('Error in consulta-ruc-dni route:', globalErr);
      res.status(500).json({ error: 'Error interno al procesar la consulta.' });
    }
  });

  // Serve static assets in production, otherwise Vite in dev mode
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // In production, Vite builds static files into 'dist' folder
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[MYPE Contable Server] Ready and listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('[MYPE Contable Server] Crash on startup:', err);
});
