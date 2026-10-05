import { Ayah } from '../types/quran';

export const INITIAL_FATIHAH_AYAHS: Ayah[] = [
  {
    surahNumber: 1,
    ayahNumber: 1,
    globalAyahNumber: 1,
    arabic: "بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ",
    bangla: "পরম করুণাময়, অসীম দয়ালু আল্লাহর নামে (শুরু করছি)।",
    banglaPronunciation: "বিসমিল্লাহির রাহমানির রাহীম",
    english: "In the Name of Allah—the Most Compassionate, Most Merciful."
  },
  {
    surahNumber: 1,
    ayahNumber: 2,
    globalAyahNumber: 2,
    arabic: "ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَـٰلَمِينَ",
    bangla: "যাবতীয় প্রশংসা একমাত্র আল্লাহর জন্য, যিনি সমগ্র বিশ্বজগতের প্রতিপালক।",
    banglaPronunciation: "আলহামদু লিল্লাহি রাব্বিল আলামীন",
    english: "All praise is for Allah—Lord of all worlds."
  },
  {
    surahNumber: 1,
    ayahNumber: 3,
    globalAyahNumber: 3,
    arabic: "ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ",
    bangla: "যিনি পরম করুণাময় ও অতিশয় দয়ালু।",
    banglaPronunciation: "আর-রাহমানির রাহীম",
    english: "The Most Compassionate, Most Merciful."
  },
  {
    surahNumber: 1,
    ayahNumber: 4,
    globalAyahNumber: 4,
    arabic: "مَـٰلِكِ يَوْمِ ٱلدِّينِ",
    bangla: "যিনি বিচার দিবসের একমাত্র মালিক ও অধিপতি।",
    banglaPronunciation: "মালিকি ইয়াওমিদ্দীন",
    english: "Master of the Day of Judgment."
  },
  {
    surahNumber: 1,
    ayahNumber: 5,
    globalAyahNumber: 5,
    arabic: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
    bangla: "আমরা কেবল আপনারই ইবাদত করি এবং কেবল আপনারই সাহায্য প্রার্থনা করি।",
    banglaPronunciation: "ইয়্যাকা নাবুদু ওয়া ইয়্যাকা নাসতাঈন",
    english: "You alone we worship and You alone we ask for help."
  },
  {
    surahNumber: 1,
    ayahNumber: 6,
    globalAyahNumber: 6,
    arabic: "ٱهْدِنَا ٱلصِّرَٰطَ ٱلْمُسْتَقِيمَ",
    bangla: "আমাদেরকে সরল-সঠিক পথ প্রদর্শন করুন।",
    banglaPronunciation: "ইহদিনাস সিরাত্বাল মুসতাক্বীম",
    english: "Guide us along the Straight Path,"
  },
  {
    surahNumber: 1,
    ayahNumber: 7,
    globalAyahNumber: 7,
    arabic: "صِرَٰطَ ٱلَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ ٱلْمَغْضُوبِ عَلَيْهِمْ وَلَا ٱلضَّآلِّينَ",
    bangla: "তাদের পথ, যাদের আপনি পুরস্কৃত করেছেন; যাদের ওপর আপনার ক্রোধ আপতিত হয়নি এবং যারা পথভ্রষ্টও হয়নি।",
    banglaPronunciation: "সিরাত্বাল্লাযীনা আনআমতা আলাইহিম, গাইরিল মাগদূবি আলাইহিম ওয়া লাদ্দল্লীন।",
    english: "The Path of those You have blessed—not those You are displeased with, or those who are astray."
  }
];

export const FAMOUS_AYAH_PRESETS = [
  {
    id: 'fatihah-1-2',
    titleBangla: 'আপনার দেয়া আয়াত (সূরা আল-ফাতিহা ১-২)',
    titleEnglish: 'Your Verses (Al-Fatihah 1-2)',
    surahNumber: 1,
    ayahStart: 1,
    ayahEnd: 2,
    previewArabic: 'بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ • ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَـٰلَمِينَ'
  },
  {
    id: 'fatihah-all',
    titleBangla: 'সম্পূর্ণ সূরা আল-ফাতিহা (১-৭)',
    titleEnglish: 'Complete Surah Al-Fatihah (1-7)',
    surahNumber: 1,
    ayahStart: 1,
    ayahEnd: 7,
    previewArabic: 'سورة الفاتحة كاملاً'
  },
  {
    id: 'ayatul-kursi',
    titleBangla: 'আয়াতুল কুরসী (সূরা আল-বাকারা ২৫৫)',
    titleEnglish: 'Ayat al-Kursi (2:255)',
    surahNumber: 2,
    ayahStart: 255,
    ayahEnd: 255,
    previewArabic: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ...'
  },
  {
    id: 'ar-rahman',
    titleBangla: 'সূরা আর-রহমান (১-১৬)',
    titleEnglish: 'Surah Ar-Rahman (1-16)',
    surahNumber: 55,
    ayahStart: 1,
    ayahEnd: 16,
    previewArabic: 'الرَّحْمَٰنُ • عَلَّمَ الْقُرْآنَ...'
  },
  {
    id: 'al-mulk',
    titleBangla: 'সূরা আল-মুলক (১-১০)',
    titleEnglish: 'Surah Al-Mulk (1-10)',
    surahNumber: 67,
    ayahStart: 1,
    ayahEnd: 10,
    previewArabic: 'تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ...'
  },
  {
    id: 'yasin',
    titleBangla: 'সূরা ইয়াসীন (১-১২)',
    titleEnglish: 'Surah Ya-Sin (1-12)',
    surahNumber: 36,
    ayahStart: 1,
    ayahEnd: 12,
    previewArabic: 'يس • وَالْقُرْآنِ الْحَكِيمِ...'
  },
  {
    id: 'ikhlas',
    titleBangla: 'সূরা আল-ইখলাস (১-৪)',
    titleEnglish: 'Surah Al-Ikhlas (1-4)',
    surahNumber: 112,
    ayahStart: 1,
    ayahEnd: 4,
    previewArabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ...'
  },
  {
    id: 'falaq',
    titleBangla: 'সূরা আল-ফালাক (১-৫)',
    titleEnglish: 'Surah Al-Falaq (1-5)',
    surahNumber: 113,
    ayahStart: 1,
    ayahEnd: 5,
    previewArabic: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ...'
  },
  {
    id: 'nas',
    titleBangla: 'সূরা আন-নাস (১-৬)',
    titleEnglish: 'Surah An-Nas (1-6)',
    surahNumber: 114,
    ayahStart: 1,
    ayahEnd: 6,
    previewArabic: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ...'
  }
];

export const AYATUL_KURSI_DATA: Ayah = {
  surahNumber: 2,
  ayahNumber: 255,
  globalAyahNumber: 262,
  arabic: "ٱللَّهُ لَآ إِلَـٰهَ إِلَّا هُوَ ٱلْحَىُّ ٱلْقَيُّومُ ۚ لَا تَأْخُذُهُۥ سِنَةٌۭ وَلَا نَوْمٌۭ ۚ لَّهُۥ مَا فِى ٱلسَّمَـٰوَٰتِ وَمَا فِى ٱلْأَرْضِ ۗ مَن ذَا ٱلَّذِى يَشْفَعُ عِندَهُۥٓ إِلَّا بِإِذْنِهِۦ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَىْءٍۢ مِّنْ عِلْمِهِۦٓ إِلَّا بِمَا شَآءَ ۚ وَسِعَ كُرْسِيُّهُ ٱلسَّمَـٰوَٰتِ وَٱلْأَرْضَ ۖ وَلَا يَـُٔودُهُۥ حِفْظُهُمَا ۚ وَهُوَ ٱلْعَلِىُّ ٱلْعَظِيمُ",
  bangla: "আল্লাহ, তিনি ব্যতীত কোনো সত্য উপাস্য নেই; তিনি চিরঞ্জীব, সর্বসত্তার ধারক। তন্দ্রা বা নিদ্রা তাঁকে স্পর্শ করতে পারে না। আকাশমণ্ডলী ও পৃথিবীতে যা কিছু আছে সবই তাঁর। কে আছে যে তাঁর অনুমতি ছাড়া তাঁর কাছে সুপারিশ করবে? তাদের সম্মুখে ও পশ্চাতে যা কিছু আছে তিনি তা জানেন। তাঁর ইচ্ছার বাইরে তাঁর জ্ঞানের কিছুই তারা আয়ত্ত করতে পারে না। তাঁর সিংহাসন আসমান ও জমিন পরিব্যাপ্ত এবং এ দুটির সংরক্ষণ তাঁকে ক্লান্ত করে না। তিনি সর্বোচ্চ, মহান।",
  banglaPronunciation: "আল্লাহু লা ইলাহা ইল্লা হুয়াল হাইয়্যুল কাইয়্যুম...",
  english: "Allah! There is no god ˹worthy of worship˺ except Him, the Ever-Living, All-Sustaining. Neither drowsiness nor sleep overtakes Him. To Him belongs whatever is in the heavens and whatever is on the earth. Who could possibly intercede with Him without His permission? He knows what is ahead of them and what is behind them, but they cannot grasp any of His knowledge except what He wills. His Seat encompasses the heavens and the earth, and the preservation of both does not tire Him. For He is the Most High, the Most Great."
};

export const SURAH_IKHLAS_DATA: Ayah[] = [
  {
    surahNumber: 112,
    ayahNumber: 1,
    arabic: "قُلْ هُوَ ٱللَّهُ أَحَدٌ",
    bangla: "বলুন, তিনিই আল্লাহ, একক ও অদ্বিতীয়।",
    banglaPronunciation: "কুল হুয়াল্লাহু আহাদ",
    english: "Say, ˹O Prophet,˺ 'He is Allah—One ˹and Indivisible˺;'"
  },
  {
    surahNumber: 112,
    ayahNumber: 2,
    arabic: "ٱللَّهُ ٱلصَّمَدُ",
    bangla: "আল্লাহ অমুখাপেক্ষী (সকলের ভরসা)।",
    banglaPronunciation: "আল্লাহুস সামাদ",
    english: "Allah—the Sustainer ˹needed by all˺."
  },
  {
    surahNumber: 112,
    ayahNumber: 3,
    arabic: "لَمْ يَلِدْ وَلَمْ يُولَدْ",
    bangla: "তিনি কাউকে জন্ম দেননি এবং তাঁকেও কেউ জন্ম দেয়নি,",
    banglaPronunciation: "লাম ইয়ালিদ ওয়া লাম ইউলাদ",
    english: "He has never had offspring, nor was He born."
  },
  {
    surahNumber: 112,
    ayahNumber: 4,
    arabic: "وَلَمْ يَكُن لَّهُۥ كُفُوًا أَحَدٌۢ",
    bangla: "এবং তাঁর সমকক্ষ কেউই নেই।",
    banglaPronunciation: "ওয়া লাম ইয়াকুল্লাহু কুফুওয়ান আহাদ",
    english: "And there is none comparable to Him."
  }
];
