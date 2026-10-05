import { Ayah } from '../types/quran';
import { INITIAL_FATIHAH_AYAHS, AYATUL_KURSI_DATA, SURAH_IKHLAS_DATA } from '../data/initialAyahs';
import { SURAHS_LIST } from '../data/surahs';

// In-memory cache for loaded surahs
const surahCache = new Map<number, Ayah[]>();

// Initialize with preloaded surahs
surahCache.set(1, INITIAL_FATIHAH_AYAHS);
surahCache.set(112, SURAH_IKHLAS_DATA);

/**
 * Strips diacritics and special Quranic markers for loose matching
 */
export function normalizeArabic(text: string): string {
  return text
    // Remove Arabic diacritics / tashkeel
    .replace(/[\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E8\u06EA-\u06ED]/g, '')
    // Standardize Alefs
    .replace(/[إأآٱ]/g, 'ا')
    // Remove Arabic-indic digits (٠-٩) and western digits
    .replace(/[٠-٩0-9]/g, '')
    // Remove punctuation & brackets
    .replace(/[.,/#!$%^&*;:{}=\-_`~()«»۩۝]/g, '')
    .trim()
    .replace(/\s+/g, ' ');
}

/**
 * Fetch full Surah with Arabic Uthmani, Bengali translation, and English translation
 */
export async function fetchSurahAyahs(surahNumber: number): Promise<Ayah[]> {
  if (surahCache.has(surahNumber)) {
    return surahCache.get(surahNumber)!;
  }

  try {
    const response = await fetch(
      `https://api.alquran.cloud/v1/surah/${surahNumber}/editions/quran-uthmani,bn.bengali,en.sahih`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch surah: ${response.statusText}`);
    }

    const json = await response.json();
    if (json.code !== 200 || !json.data || json.data.length < 3) {
      throw new Error('Invalid response structure from Quran API');
    }

    const [uthmaniEdition, bengaliEdition, englishEdition] = json.data;

    const ayahs: Ayah[] = uthmaniEdition.ayahs.map((arabicAyah: any, index: number) => {
      const bnAyah = bengaliEdition.ayahs[index];
      const enAyah = englishEdition.ayahs[index];

      return {
        surahNumber,
        ayahNumber: arabicAyah.numberInSurah,
        globalAyahNumber: arabicAyah.number,
        arabic: arabicAyah.text,
        bangla: bnAyah ? bnAyah.text : '',
        english: enAyah ? enAyah.text : ''
      };
    });

    surahCache.set(surahNumber, ayahs);
    return ayahs;
  } catch (err) {
    console.warn(`Could not fetch online surah ${surahNumber}, falling back to available data:`, err);
    if (surahNumber === 1) return INITIAL_FATIHAH_AYAHS;
    if (surahNumber === 112) return SURAH_IKHLAS_DATA;
    if (surahNumber === 2) return [AYATUL_KURSI_DATA];
    throw err;
  }
}

/**
 * Fetch a single specific Ayah
 */
export async function fetchSingleAyah(surahNumber: number, ayahNumber: number): Promise<Ayah | null> {
  const ayahs = await fetchSurahAyahs(surahNumber);
  const found = ayahs.find((a) => a.ayahNumber === ayahNumber);
  return found || null;
}

export interface ParseResult {
  surahNumber: number;
  ayahStart: number;
  ayahEnd: number;
  detectedText?: string;
  matchedVerse?: Ayah;
}

/**
 * Smartly parse user's input string:
 * - Can be Quran text: "ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَـٰلَمِينَ ٢" or "بِسْمِ ٱللَّهِ..."
 * - Can be citation: "1:2", "1:1-7", "2:255", "36:1-12"
 * - Can be name: "আল ফাতিহা ২" or "Fatihah 2"
 */
export function parseUserAyahInput(input: string): ParseResult {
  const trimmed = input.trim();
  if (!trimmed) {
    return { surahNumber: 1, ayahStart: 1, ayahEnd: 2 };
  }

  // 1. Check for citation pattern: e.g. "1:2" or "1:1-5" or "1 2"
  const citationMatch = trimmed.match(/^(\d{1,3})[:\s-]+(\d{1,3})(?:[:\s-]+(\d{1,3}))?$/);
  if (citationMatch) {
    const s = parseInt(citationMatch[1], 10);
    const a1 = parseInt(citationMatch[2], 10);
    const a2 = citationMatch[3] ? parseInt(citationMatch[3], 10) : a1;
    if (s >= 1 && s <= 114) {
      return { surahNumber: s, ayahStart: a1, ayahEnd: Math.max(a1, a2) };
    }
  }

  // 2. Check for single Surah number
  if (/^\d{1,3}$/.test(trimmed)) {
    const s = parseInt(trimmed, 10);
    if (s >= 1 && s <= 114) {
      const surahInfo = SURAHS_LIST.find((item) => item.number === s);
      return { surahNumber: s, ayahStart: 1, ayahEnd: Math.min(surahInfo?.totalAyahs || 7, 7) };
    }
  }

  // 3. Check for specific Arabic verses
  const normInput = normalizeArabic(trimmed);

  // Check Al-Hamdulillah (Surah 1:2)
  if (normInput.includes('الحمد لله رب العالمين') || normInput.includes('الحمد لله')) {
    return {
      surahNumber: 1,
      ayahStart: 2,
      ayahEnd: 2,
      detectedText: 'ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَـٰلَمِينَ',
      matchedVerse: INITIAL_FATIHAH_AYAHS[1]
    };
  }

  // Check Bismillah (Surah 1:1)
  if (normInput.includes('بسم الله الرحمن الرحيم') || normInput.includes('بسم الله')) {
    return {
      surahNumber: 1,
      ayahStart: 1,
      ayahEnd: 1,
      detectedText: 'بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ',
      matchedVerse: INITIAL_FATIHAH_AYAHS[0]
    };
  }

  // Check Ayatul Kursi
  if (normInput.includes('الله لا اله الا هو الحي القيوم') || trimmed.includes('আয়াতুল কুরসী') || /kursi/i.test(trimmed)) {
    return {
      surahNumber: 2,
      ayahStart: 255,
      ayahEnd: 255,
      detectedText: AYATUL_KURSI_DATA.arabic,
      matchedVerse: AYATUL_KURSI_DATA
    };
  }

  // Check Surah Ikhlas
  if (normInput.includes('قل هو الله احد') || trimmed.includes('ইখলাস') || /ikhlas/i.test(trimmed)) {
    return {
      surahNumber: 112,
      ayahStart: 1,
      ayahEnd: 4,
      detectedText: SURAH_IKHLAS_DATA[0].arabic
    };
  }

  // Check Surah Ar-Rahman
  if (normInput.includes('الرحمن') || trimmed.includes('রহমান') || /rahman/i.test(trimmed)) {
    return {
      surahNumber: 55,
      ayahStart: 1,
      ayahEnd: 16
    };
  }

  // Check Surah Yasin
  if (normInput.includes('يس') || trimmed.includes('ইয়াসীন') || /yasin/i.test(trimmed)) {
    return {
      surahNumber: 36,
      ayahStart: 1,
      ayahEnd: 12
    };
  }

  // Check Surah Al-Mulk
  if (normInput.includes('تبارك الذي بيده الملك') || trimmed.includes('মুলক') || /mulk/i.test(trimmed)) {
    return {
      surahNumber: 67,
      ayahStart: 1,
      ayahEnd: 10
    };
  }

  // 4. Check if text matches Surah name in Bengali or English
  for (const surah of SURAHS_LIST) {
    const bnMatch = trimmed.includes(surah.nameBangla.replace('আল-', '').replace('আশ-', '').replace('আন-', '').trim());
    const enMatch = trimmed.toLowerCase().includes(surah.nameEnglish.toLowerCase().replace('al-', '').replace('an-', '').trim());
    if (bnMatch || enMatch) {
      // Look for a number inside the string for ayah
      const numMatch = trimmed.match(/\b(\d+)\b/);
      const ayah = numMatch ? Math.min(parseInt(numMatch[1], 10), surah.totalAyahs) : 1;
      return {
        surahNumber: surah.number,
        ayahStart: ayah,
        ayahEnd: ayah
      };
    }
  }

  // Default to Surah 1:1-2 (The user's requested verses)
  return { surahNumber: 1, ayahStart: 1, ayahEnd: 2 };
}
