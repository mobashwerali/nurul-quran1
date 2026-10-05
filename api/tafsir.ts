import { GoogleGenAI } from '@google/genai';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { surahNumber, ayahNumber, arabic, banglaMeaning } = req.body || {};

    if (!arabic) {
      return res.status(400).json({ error: 'Arabic text is required' });
    }

    const ai = new GoogleGenAI();
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
      contents: prompt
    });

    const text = response.text || 'তাফসীর উপলব্ধ করা যায়নি।';
    res.status(200).json({ tafsir: text });
  } catch (error: any) {
    console.error('Error generating tafsir on Vercel:', error);
    res.status(500).json({
      error: 'Failed to generate tafsir',
      details: error?.message || 'Server error'
    });
  }
}
