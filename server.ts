import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
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
