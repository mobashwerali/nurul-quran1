import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize Gemini Client
const ai = new GoogleGenAI();

// Endpoint for brief authentic Bengali Tafsir & Tajweed explanation
app.post('/api/tafsir', async (req, res) => {
  try {
    const { surahNumber, ayahNumber, arabic, banglaMeaning } = req.body;

    if (!arabic) {
      return res.status(400).json({ error: 'Arabic text is required' });
    }

    const prompt = `তুমি একজন বিশ্বস্ত ও শ্রদ্ধাবান ইসলামিক স্কলার ও কারি। নিচের পবিত্র কুরআন আয়াতের সংক্ষিপ্ত, বিশুদ্ধ ও অনুপ্রেরণাদায়ী তাফসীর ও তাজবীদ বিধান বাংলায় বুঝিয়ে দাও।
সূরা নং: ${surahNumber || ''}, আয়াত: ${ayahNumber || ''}
আরবি আয়াত: ${arabic}
অর্থ: ${banglaMeaning || ''}

অনুগ্রহ করে সর্বোচ্চ ৩টি সংক্ষিপ্ত পয়েন্টে উত্তর দাও:
১. আয়াতের মূল তাৎপর্য ও বার্তা
২. তিলাওয়াতের গুরুত্বপূর্ণ তাজবীদ নিয়ম (যেমন মাদ্দ, গুন্নাহ, ওয়াকফ বা মাখরাজ)
৩. বান্দার জীবনের জন্য শিক্ষণীয় আমল।`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const text = response.text || 'তাফসীর উপলব্ধ করা যায়নি।';
    res.json({ tafsir: text });
  } catch (error: any) {
    console.error('Error generating tafsir:', error);
    res.status(500).json({
      error: 'Failed to generate tafsir',
      details: error?.message || 'Server error'
    });
  }
});

// Proxy endpoint for pure Bengali Voice TTS audio stream
app.get('/api/tts', async (req, res) => {
  try {
    const text = (req.query.text as string) || '';
    if (!text.trim()) {
      return res.status(400).send('Text is required');
    }

    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=bn&client=tw-ob&q=${encodeURIComponent(text.trim())}`;
    
    const response = await fetch(ttsUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    if (!response.ok) {
      return res.status(response.status).send('Failed to fetch TTS');
    }

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    
    const arrayBuffer = await response.arrayBuffer();
    res.send(Buffer.from(arrayBuffer));
  } catch (err: any) {
    console.error('TTS proxy error:', err);
    res.status(500).send('TTS server error');
  }
});

// Configure Vite middleware in dev or static files in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${port}`);
  });
}

startServer();
