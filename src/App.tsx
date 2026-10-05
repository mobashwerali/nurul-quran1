import React, { useState, useEffect, useCallback } from 'react';
import {
  Volume2,
  BookOpen,
  User,
  Sparkles,
  Play,
  Pause,
  ChevronRight,
  ChevronLeft,
  Minus,
  Plus
} from 'lucide-react';
import { Ayah, SurahInfo, Qari, BookmarkedAyah } from './types/quran';
import { DEFAULT_QARI } from './data/qaris';
import { SURAHS_LIST } from './data/surahs';
import { INITIAL_FATIHAH_AYAHS } from './data/initialAyahs';
import { fetchSurahAyahs } from './utils/quranApi';
import { Navbar } from './components/Navbar';
import { CustomAyahInput } from './components/CustomAyahInput';
import { AyahCard } from './components/AyahCard';
import { AudioPlayerBar } from './components/AudioPlayerBar';
import { QariSelectorModal } from './components/QariSelectorModal';
import { SurahDrawer } from './components/SurahDrawer';
import { FavoritesDrawer } from './components/FavoritesDrawer';
import { TafsirModal } from './components/TafsirModal';
import { useQuranAudio } from './hooks/useQuranAudio';
import { useFavorites } from './hooks/useFavorites';

// High-fidelity image assets
import heroQuranImage from './assets/images/quran_rehal_glow_1791113561664.jpg';

export default function App() {
  // Navigation & Modals
  const [isSurahDrawerOpen, setIsSurahDrawerOpen] = useState(false);
  const [isFavoritesDrawerOpen, setIsFavoritesDrawerOpen] = useState(false);
  const [isQariModalOpen, setIsQariModalOpen] = useState(false);
  const [tafsirAyah, setTafsirAyah] = useState<Ayah | null>(null);

  // Favorites Hook (localStorage persistent bookmarks)
  const {
    favorites,
    isBookmarked,
    toggleBookmark,
    removeBookmark,
    clearAllBookmarks
  } = useFavorites();

  // Active Qari & Surah
  const [activeQari, setActiveQari] = useState<Qari>(DEFAULT_QARI);
  const [currentSurahNumber, setCurrentSurahNumber] = useState<number>(1);
  const [loadedAyahs, setLoadedAyahs] = useState<Ayah[]>(INITIAL_FATIHAH_AYAHS);
  const [currentAyahIndex, setCurrentAyahIndex] = useState<number>(0);
  const [isLoadingAyahs, setIsLoadingAyahs] = useState<boolean>(false);

  // Display Settings
  const [arabicFontSize, setArabicFontSize] = useState<number>(28);
  const [showBangla, setShowBangla] = useState<boolean>(true);
  const [showEnglish, setShowEnglish] = useState<boolean>(true);
  const [showPronunciation, setShowPronunciation] = useState<boolean>(true);

  // Active Ayah & Surah details
  const currentAyah = loadedAyahs[currentAyahIndex] || loadedAyahs[0] || null;
  const currentSurahInfo: SurahInfo =
    SURAHS_LIST.find((s) => s.number === currentSurahNumber) || SURAHS_LIST[0];

  // Callback when continuous playback advances
  const handleAyahAutoAdvance = useCallback(() => {
    setCurrentAyahIndex((prevIdx) => {
      if (prevIdx < loadedAyahs.length - 1) {
        const nextIdx = prevIdx + 1;
        const nextAyah = loadedAyahs[nextIdx];
        if (nextAyah) {
          loadAyahAudio(nextAyah, activeQari, true);
        }
        return nextIdx;
      } else if (currentSurahNumber < 114) {
        // Move to next Surah
        handleLoadSurah(currentSurahNumber + 1, 1, true);
        return 0;
      }
      return prevIdx;
    });
  }, [loadedAyahs, activeQari, currentSurahNumber]);

  // Dedicated Audio Hook
  const {
    isPlaying,
    isLoadingAudio,
    isSpeakingBangla,
    includeBanglaTranslation,
    setIncludeBanglaTranslation,
    voiceSequenceMode,
    setVoiceSequenceMode,
    speakBanglaTranslation,
    currentTime,
    duration,
    playbackSpeed,
    repeatMode,
    audioError,
    playAudio,
    pauseAudio,
    loadAyahAudio,
    seekTo,
    setPlaybackSpeed,
    setRepeatMode
  } = useQuranAudio({
    currentAyah,
    activeQari,
    onAyahAutoAdvance: handleAyahAutoAdvance
  });

  // Preload initial track quietly on mount without auto-play error
  useEffect(() => {
    if (INITIAL_FATIHAH_AYAHS[0]) {
      loadAyahAudio(INITIAL_FATIHAH_AYAHS[0], activeQari, false);
    }
  }, []);

  // Auto-scroll active recited Ayah into center view smoothly
  useEffect(() => {
    if (currentAyah) {
      const el = document.getElementById(`ayah-${currentAyah.surahNumber}-${currentAyah.ayahNumber}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [currentAyahIndex, currentSurahNumber]);

  // Load a new Surah
  const handleLoadSurah = async (
    surahNum: number,
    targetAyahNum: number = 1,
    autoPlay: boolean = false
  ) => {
    setIsLoadingAyahs(true);
    setCurrentSurahNumber(surahNum);

    try {
      const ayahs = await fetchSurahAyahs(surahNum);
      setLoadedAyahs(ayahs);

      const targetIdx = ayahs.findIndex((a) => a.ayahNumber === targetAyahNum);
      const safeIdx = targetIdx >= 0 ? targetIdx : 0;
      setCurrentAyahIndex(safeIdx);

      const targetAyah = ayahs[safeIdx];
      if (targetAyah) {
        loadAyahAudio(targetAyah, activeQari, autoPlay);
      }
    } catch (err) {
      console.error('Error loading surah:', err);
    } finally {
      setIsLoadingAyahs(false);
    }
  };

  // Play/Pause specific Ayah from card
  const handlePlayAyah = (ayah: Ayah) => {
    const idx = loadedAyahs.findIndex((a) => a.ayahNumber === ayah.ayahNumber);
    if (idx >= 0) {
      if (currentAyahIndex === idx && isPlaying) {
        pauseAudio();
      } else {
        setCurrentAyahIndex(idx);
        loadAyahAudio(ayah, activeQari, true);
      }
    }
  };

  // Toggle Play / Pause from bottom bar
  const handleTogglePlay = () => {
    if (isPlaying) {
      pauseAudio();
    } else {
      if (currentAyah) {
        if (currentTime > 0) {
          playAudio();
        } else {
          loadAyahAudio(currentAyah, activeQari, true);
        }
      }
    }
  };

  // Next Ayah button
  const handleNextAyah = () => {
    if (currentAyahIndex < loadedAyahs.length - 1) {
      const nextIdx = currentAyahIndex + 1;
      setCurrentAyahIndex(nextIdx);
      const nextAyah = loadedAyahs[nextIdx];
      if (nextAyah) {
        loadAyahAudio(nextAyah, activeQari, true);
      }
    } else if (currentSurahNumber < 114) {
      handleLoadSurah(currentSurahNumber + 1, 1, true);
    }
  };

  // Previous Ayah button
  const handlePrevAyah = () => {
    if (currentAyahIndex > 0) {
      const prevIdx = currentAyahIndex - 1;
      setCurrentAyahIndex(prevIdx);
      const prevAyah = loadedAyahs[prevIdx];
      if (prevAyah) {
        loadAyahAudio(prevAyah, activeQari, true);
      }
    } else if (currentSurahNumber > 1) {
      handleLoadSurah(currentSurahNumber - 1, 1, true);
    }
  };

  // Toggle Repeat Mode
  const handleToggleRepeatMode = () => {
    const nextMode =
      repeatMode === 'continuous' ? 'one' : repeatMode === 'one' ? 'none' : 'continuous';
    setRepeatMode(nextMode);
  };

  // Switch Qari
  const handleSelectQari = (qari: Qari) => {
    setActiveQari(qari);
    if (currentAyah) {
      loadAyahAudio(currentAyah, qari, isPlaying);
    }
  };

  // Handle custom verses load from input box
  const handleLoadCustomVerses = async (
    surahNumber: number,
    ayahStart: number,
    _ayahEnd: number,
    _customNote?: string
  ) => {
    await handleLoadSurah(surahNumber, ayahStart, true);
    setTimeout(() => {
      const el = document.getElementById(`ayah-${surahNumber}-${ayahStart}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 400);
  };

  // Handle playing a favorite verse
  const handlePlayFavorite = async (fav: BookmarkedAyah) => {
    if (fav.surahNumber === currentSurahNumber) {
      const idx = loadedAyahs.findIndex((a) => a.ayahNumber === fav.ayahNumber);
      if (idx >= 0) {
        setCurrentAyahIndex(idx);
        loadAyahAudio(loadedAyahs[idx], activeQari, true);
        setTimeout(() => {
          const el = document.getElementById(`ayah-${fav.surahNumber}-${fav.ayahNumber}`);
          el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 200);
        return;
      }
    }
    await handleLoadSurah(fav.surahNumber, fav.ayahNumber, true);
    setTimeout(() => {
      const el = document.getElementById(`ayah-${fav.surahNumber}-${fav.ayahNumber}`);
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 400);
  };

  const scrollToInput = () => {
    document.getElementById('custom-ayah-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToPlayer = () => {
    document.getElementById('audio-player-bar')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#081816] text-[#F3EFE6] flex flex-col font-sans pb-28">
      {/* Top Bar Navigation */}
      <Navbar
        onOpenSurahList={() => setIsSurahDrawerOpen(true)}
        onOpenQariModal={() => setIsQariModalOpen(true)}
        onOpenFavorites={() => setIsFavoritesDrawerOpen(true)}
        onScrollToInput={scrollToInput}
        onScrollToPlayer={scrollToPlayer}
        activeQariName={activeQari.nameBangla}
        favoritesCount={favorites.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-8">
        {/* Editorial Hero Banner */}
        <section className="relative rounded-3xl overflow-hidden border border-[#D4AF37]/30 shadow-2xl bg-[#09221D]">
          {/* Background Image with Scrim */}
          <div className="absolute inset-0">
            <img
              src={heroQuranImage}
              alt="Illuminated Holy Quran on wooden Rehal stand"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center opacity-35 filter brightness-90 contrast-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#071916] via-[#071916]/85 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#071916] via-transparent to-transparent" />
          </div>

          {/* Hero Content */}
          <div className="relative z-10 p-6 sm:p-10 lg:p-12 max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#D4AF37] mb-3 font-bangla">
              <span>পবিত্র কুরআনুল কারীম তিলাওয়াত</span>
              <span aria-hidden="true">·</span>
              <span>বিশ্ববিখ্যাত কারিবৃন্দের বিশুদ্ধ কণ্ঠ</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#FBF9F5] tracking-tight leading-tight mb-4">
              মন জুড়ানো কুরআন তিলাওয়াত — যে আয়াত চান শুনুন
            </h1>

            <p className="text-sm sm:text-base text-[#D4CDC0] font-bangla leading-relaxed mb-6 max-w-2xl">
              আপনি যেকোনো আয়াত লিখুন বা পেস্ট করুন, বিশ্ববিখ্যাত কারিদের (মিশারি আল-আফাসি, আব্দুল বাসিত, মিনশাবি, মাহের আল-মুয়াইক্বিলি প্রমুখ) সুমধুর কণ্ঠে আয়াত অনুযায়ী বিশুদ্ধ তিলাওয়াত শুনতে পাবেন বাংলা ও ইংরেজি অর্থসহ।
            </p>

            {/* User Requested Verses Quick-Play Box */}
            <div className="bg-[#0B2A24]/90 border border-[#D4AF37]/40 rounded-2xl p-4 mb-6 backdrop-blur-xs">
              <div className="flex items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#D4AF37] font-bangla">
                  <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                  <span>আপনার রিকোয়েস্টকৃত আয়াত (সূরা আল-ফাতিহা ১ ও ২):</span>
                </div>
                <button
                  onClick={() => {
                    handleLoadSurah(1, 1, true);
                  }}
                  className="px-3 py-1 bg-[#D4AF37] hover:bg-[#E5C158] text-[#081816] text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>এখনই শুনুন</span>
                </button>
              </div>

              {/* Arabic Verse Quote */}
              <div
                className="text-right font-arabic text-lg sm:text-xl text-[#FBF9F5] leading-relaxed mb-1.5"
                dir="rtl"
              >
                بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ ١ • ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَـٰلَمِينَ ٢
              </div>
              <p className="text-xs text-[#A89F91] font-bangla">
                "পরম করুণাময়, অসীম দয়ালু আল্লাহর নামে... যাবতীয় প্রশংসা একমাত্র আল্লাহর জন্য, যিনি সমগ্র বিশ্বজগতের প্রতিপালক।"
              </p>
            </div>

            {/* Hero CTAs */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={scrollToInput}
                className="px-5 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#E5C158] text-[#081816] font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-lg shadow-[#D4AF37]/20 flex items-center gap-2"
              >
                <Volume2 className="w-4 h-4" />
                <span>নতুন আয়াত দিন</span>
              </button>

              <button
                onClick={() => setIsQariModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-[#0E352F] hover:bg-[#13443C] border border-[#D4AF37]/40 text-[#F3EFE6] font-semibold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2 font-bangla"
              >
                <User className="w-4 h-4 text-[#D4AF37]" />
                <span>কারি: {activeQari.nameBangla}</span>
              </button>
            </div>
          </div>
        </section>

        {/* Custom Ayah Input Panel */}
        <CustomAyahInput
          onLoadCustomVerses={handleLoadCustomVerses}
          activeQari={activeQari}
          onOpenQariModal={() => setIsQariModalOpen(true)}
          isLoading={isLoadingAyahs}
        />

        {/* Surah Content & Ayat Reader */}
        <section className="space-y-6">
          {/* Surah Title Bar & Reading Controls */}
          <div className="bg-[#0A221E] border border-[#D4AF37]/30 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-[#071916] border border-[#D4AF37]/40 flex items-center justify-center font-serif text-lg font-bold text-[#D4AF37]">
                {currentSurahInfo.number}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg sm:text-xl font-serif font-bold text-[#FBF9F5] font-bangla">
                    সূরা {currentSurahInfo.nameBangla}
                  </h3>
                  <span className="text-xs text-[#A89F91]">({currentSurahInfo.nameEnglish})</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-[#071916] border border-[#D4AF37]/20 text-[#D4AF37] font-bangla">
                    {currentSurahInfo.revelationType}
                  </span>
                </div>
                <div className="text-xs text-[#8E9B97] font-bangla mt-0.5">
                  অর্থ: {currentSurahInfo.englishMeaning} · মোট {currentSurahInfo.totalAyahs}টি আয়াত
                </div>
              </div>
            </div>

            {/* Controls: Surah Switcher & View Preferences */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {/* Prev / Next Surah */}
              <div className="flex items-center bg-[#071916] border border-[#D4AF37]/20 rounded-lg p-0.5">
                <button
                  disabled={currentSurahNumber <= 1}
                  onClick={() => handleLoadSurah(currentSurahNumber - 1, 1, isPlaying)}
                  className="p-1.5 text-[#C5BBAA] hover:text-[#D4AF37] disabled:opacity-30 disabled:hover:text-[#C5BBAA] cursor-pointer"
                  title="পূর্ববর্তী সূরা"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsSurahDrawerOpen(true)}
                  className="px-2.5 py-1 text-xs text-[#D4AF37] hover:underline font-bangla cursor-pointer"
                >
                  সূরা পরিবর্তন
                </button>
                <button
                  disabled={currentSurahNumber >= 114}
                  onClick={() => handleLoadSurah(currentSurahNumber + 1, 1, isPlaying)}
                  className="p-1.5 text-[#C5BBAA] hover:text-[#D4AF37] disabled:opacity-30 disabled:hover:text-[#C5BBAA] cursor-pointer"
                  title="পরবর্তী সূরা"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Font Size Adjuster */}
              <div className="flex items-center bg-[#071916] border border-[#D4AF37]/20 rounded-lg px-2 py-1 text-xs text-[#8E9B97]">
                <span className="mr-1.5 font-serif text-[11px]">আরবি ফন্ট:</span>
                <button
                  onClick={() => setArabicFontSize((prev) => Math.max(20, prev - 2))}
                  className="p-1 hover:text-[#F3EFE6] cursor-pointer"
                  title="ফন্ট ছোট করুন"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-5 text-center font-mono text-[11px] tabular-nums text-[#D4AF37]">
                  {arabicFontSize}
                </span>
                <button
                  onClick={() => setArabicFontSize((prev) => Math.min(42, prev + 2))}
                  className="p-1 hover:text-[#F3EFE6] cursor-pointer"
                  title="ফন্ট বড় করুন"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>

              {/* Translation Toggles */}
              <div className="flex items-center gap-1.5 text-xs font-bangla">
                <button
                  onClick={() => setShowBangla(!showBangla)}
                  className={`px-2 py-1 rounded border transition-colors cursor-pointer ${
                    showBangla
                      ? 'bg-[#D4AF37]/15 border-[#D4AF37] text-[#D4AF37]'
                      : 'bg-[#071916] border-[#D4AF37]/20 text-[#8E9B97]'
                  }`}
                >
                  বাংলা
                </button>
                <button
                  onClick={() => setShowEnglish(!showEnglish)}
                  className={`px-2 py-1 rounded border transition-colors cursor-pointer ${
                    showEnglish
                      ? 'bg-[#D4AF37]/15 border-[#D4AF37] text-[#D4AF37]'
                      : 'bg-[#071916] border-[#D4AF37]/20 text-[#8E9B97]'
                  }`}
                >
                  English
                </button>
                <button
                  onClick={() => setShowPronunciation(!showPronunciation)}
                  className={`px-2 py-1 rounded border transition-colors cursor-pointer ${
                    showPronunciation
                      ? 'bg-[#D4AF37]/15 border-[#D4AF37] text-[#D4AF37]'
                      : 'bg-[#071916] border-[#D4AF37]/20 text-[#8E9B97]'
                  }`}
                >
                  উচ্চারণ
                </button>
                <button
                  onClick={() => setIncludeBanglaTranslation((prev) => !prev)}
                  className={`px-2 py-1 rounded border transition-colors cursor-pointer flex items-center gap-1 ${
                    includeBanglaTranslation
                      ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#D4AF37] font-semibold'
                      : 'bg-[#071916] border-[#D4AF37]/20 text-[#8E9B97]'
                  }`}
                  title="আরবি তিলাওয়াত শেষে স্বয়ংক্রিয় বাংলা অর্থ পাঠ"
                >
                  <Volume2 className="w-3 h-3" />
                  <span>বাংলা পাঠ</span>
                </button>
              </div>
            </div>
          </div>

          {/* Bismillah Header (except for Surah 9 and Surah 1) */}
          {currentSurahNumber !== 1 && currentSurahNumber !== 9 && (
            <div className="text-center py-6 bg-[#0A201C]/60 rounded-2xl border border-[#D4AF37]/20">
              <p className="font-arabic text-2xl sm:text-3xl text-[#D4AF37]">
                بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
              </p>
              <p className="text-xs text-[#A89F91] font-bangla mt-1">
                পরম করুণাময়, অসীম দয়ালু আল্লাহর নামে (শুরু করছি)
              </p>
            </div>
          )}

          {/* Ayahs List */}
          <div className="space-y-4">
            {loadedAyahs.map((ayah) => {
              const isCurrent =
                currentAyah?.surahNumber === ayah.surahNumber &&
                currentAyah?.ayahNumber === ayah.ayahNumber;
              const isCurrentlyPlaying = isPlaying && isCurrent;

              return (
                <AyahCard
                  key={`${ayah.surahNumber}-${ayah.ayahNumber}`}
                  ayah={ayah}
                  surahNameBangla={currentSurahInfo.nameBangla}
                  isCurrent={isCurrent}
                  isPlaying={isCurrentlyPlaying}
                  isSpeakingBangla={isSpeakingBangla && isCurrent}
                  isBookmarked={isBookmarked(ayah.surahNumber, ayah.ayahNumber)}
                  onPlay={handlePlayAyah}
                  onSpeakBangla={(a) => speakBanglaTranslation(a.bangla)}
                  onRepeatAyah={() => {
                    handlePlayAyah(ayah);
                    setRepeatMode('one');
                  }}
                  onOpenTafsir={(a) => setTafsirAyah(a)}
                  onToggleBookmark={(a) => toggleBookmark(a, currentSurahInfo.nameBangla)}
                  arabicFontSize={arabicFontSize}
                  showBangla={showBangla}
                  showEnglish={showEnglish}
                  showPronunciation={showPronunciation}
                />
              );
            })}
          </div>
        </section>
      </main>

      {/* Sticky Bottom Audio Player */}
      <AudioPlayerBar
        currentAyah={currentAyah}
        surahNameBangla={currentSurahInfo.nameBangla}
        activeQari={activeQari}
        isPlaying={isPlaying}
        isLoadingAudio={isLoadingAudio}
        isSpeakingBangla={isSpeakingBangla}
        includeBanglaTranslation={includeBanglaTranslation}
        voiceSequenceMode={voiceSequenceMode}
        currentTime={currentTime}
        duration={duration}
        playbackSpeed={playbackSpeed}
        repeatMode={repeatMode}
        audioError={audioError}
        onTogglePlay={handleTogglePlay}
        onNextAyah={handleNextAyah}
        onPrevAyah={handlePrevAyah}
        onToggleRepeatMode={handleToggleRepeatMode}
        onToggleIncludeBangla={() => setIncludeBanglaTranslation((prev) => !prev)}
        onChangeSequenceMode={setVoiceSequenceMode}
        onChangeSpeed={setPlaybackSpeed}
        onOpenQariModal={() => setIsQariModalOpen(true)}
        onSeek={seekTo}
        onRetryPlay={() => {
          if (currentAyah) {
            loadAyahAudio(currentAyah, activeQari, true);
          }
        }}
      />

      {/* Qari Selector Modal */}
      <QariSelectorModal
        isOpen={isQariModalOpen}
        onClose={() => setIsQariModalOpen(false)}
        selectedQariId={activeQari.id}
        onSelectQari={handleSelectQari}
      />

      {/* Surah Drawer (114 Surahs catalog) */}
      <SurahDrawer
        isOpen={isSurahDrawerOpen}
        onClose={() => setIsSurahDrawerOpen(false)}
        currentSurahNumber={currentSurahNumber}
        onSelectSurah={(num) => handleLoadSurah(num, 1, isPlaying)}
      />

      {/* Favorites Sidebar Drawer */}
      <FavoritesDrawer
        isOpen={isFavoritesDrawerOpen}
        onClose={() => setIsFavoritesDrawerOpen(false)}
        favorites={favorites}
        onPlayFavorite={handlePlayFavorite}
        onRemoveFavorite={removeBookmark}
        onClearAll={clearAllBookmarks}
      />

      {/* Tafsir & Tajweed Modal */}
      <TafsirModal
        ayah={tafsirAyah}
        surahNameBangla={currentSurahInfo.nameBangla}
        isOpen={!!tafsirAyah}
        onClose={() => setTafsirAyah(null)}
        onPlayAyah={handlePlayAyah}
      />
    </div>
  );
}
