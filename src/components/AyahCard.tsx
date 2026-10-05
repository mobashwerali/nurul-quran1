import React, { useState } from 'react';
import { Play, Pause, Repeat, Copy, Check, Sparkles, Volume2, Bookmark } from 'lucide-react';
import { Ayah } from '../types/quran';

interface AyahCardProps {
  ayah: Ayah;
  surahNameBangla: string;
  isCurrent: boolean;
  isPlaying: boolean;
  isSpeakingBangla: boolean;
  isBookmarked: boolean;
  onPlay: (ayah: Ayah) => void;
  onSpeakBangla: (ayah: Ayah) => void;
  onRepeatAyah: (ayah: Ayah) => void;
  onOpenTafsir: (ayah: Ayah) => void;
  onToggleBookmark: (ayah: Ayah) => void;
  arabicFontSize: number;
  showBangla: boolean;
  showEnglish: boolean;
  showPronunciation: boolean;
}

export const AyahCard: React.FC<AyahCardProps> = ({
  ayah,
  surahNameBangla,
  isCurrent,
  isPlaying,
  isSpeakingBangla,
  isBookmarked,
  onPlay,
  onSpeakBangla,
  onRepeatAyah,
  onOpenTafsir,
  onToggleBookmark,
  arabicFontSize,
  showBangla,
  showEnglish,
  showPronunciation
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const textToCopy = `${ayah.arabic}\n\n[সূরা ${surahNameBangla}, আয়াত: ${ayah.ayahNumber}]\nবাংলা: ${ayah.bangla}\nEnglish: ${ayah.english}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isActive = isCurrent;
  const isBanglaActive = isCurrent && isSpeakingBangla;

  return (
    <article
      id={`ayah-${ayah.surahNumber}-${ayah.ayahNumber}`}
      className={`relative w-full rounded-2xl p-5 sm:p-7 transition-all duration-300 ${
        isActive
          ? isPlaying || isBanglaActive
            ? 'bg-[#0E3831] border-2 border-[#D4AF37] border-l-[6px] border-l-[#D4AF37] shadow-2xl shadow-[#D4AF37]/20 ring-1 ring-[#D4AF37]/40 scale-[1.005]'
            : 'bg-[#0D302A] border-2 border-[#D4AF37]/70 border-l-[6px] border-l-[#D4AF37] shadow-xl'
          : 'bg-[#0A201C]/80 hover:bg-[#0C2723] border border-[#D4AF37]/20 shadow-md opacity-90 hover:opacity-100'
      }`}
    >
      {/* Active Highlighting Banner on top of card */}
      {isActive && (
        <div className="mb-4 -mt-1 flex items-center justify-between pb-3 border-b border-[#D4AF37]/30">
          <div className="flex items-center gap-2">
            {isBanglaActive ? (
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37] text-[#081816] font-bold text-xs font-bangla shadow-md shadow-[#D4AF37]/30 animate-pulse">
                <Volume2 className="w-3.5 h-3.5 fill-current" />
                <span>📢 বাংলা তরজমা পাঠ হচ্ছে...</span>
              </div>
            ) : isPlaying ? (
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37] text-[#081816] font-bold text-xs font-bangla shadow-md shadow-[#D4AF37]/30 animate-pulse">
                <Volume2 className="w-3.5 h-3.5 fill-current" />
                <span>তিলাওয়াত চলছে • আরবি পাঠ</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#071916] text-[#D4AF37] border border-[#D4AF37]/50 font-semibold text-xs font-bangla">
                <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
                <span>নির্বাচিত আয়াত</span>
              </div>
            )}

            {/* Sound Equalizer animation when playing */}
            {(isPlaying || isBanglaActive) && (
              <div className="flex items-end gap-1 h-4 ml-1">
                <span className="w-1 bg-[#D4AF37] h-4 rounded-full animate-bounce" />
                <span className="w-1 bg-[#D4AF37] h-2.5 rounded-full animate-pulse" />
                <span className="w-1 bg-[#D4AF37] h-4 rounded-full animate-bounce [animation-delay:150ms]" />
              </div>
            )}
          </div>

          <div className="text-xs text-[#D4AF37] font-bangla font-semibold">
            সূরা {surahNameBangla} • আয়াত {ayah.ayahNumber}
          </div>
        </div>
      )}

      {/* Top Bar inside card */}
      <div className="flex items-center justify-between gap-3 border-b border-[#D4AF37]/15 pb-3 mb-5">
        <div className="flex items-center gap-3">
          {/* Ayah Badge */}
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center font-serif text-sm font-bold border transition-all ${
              isActive
                ? 'bg-[#D4AF37] text-[#081816] border-[#D4AF37] ring-2 ring-[#FDE68A]/60 shadow-md shadow-[#D4AF37]/30'
                : 'bg-[#071916] text-[#D4AF37] border-[#D4AF37]/30'
            }`}
          >
            {ayah.ayahNumber}
          </div>

          <div className="text-xs text-[#A89F91] font-bangla">
            <span className={isActive ? 'text-[#FDE68A] font-semibold' : 'text-[#F3EFE6] font-medium'}>
              {surahNameBangla}
            </span>
            <span className="mx-1.5 opacity-40">·</span>
            <span className={isActive ? 'text-[#F3EFE6] font-semibold' : ''}>
              আয়াত {ayah.ayahNumber}
            </span>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1.5">
          {/* Speak Bangla Translation button */}
          <button
            onClick={() => onSpeakBangla(ayah)}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded-md transition-colors cursor-pointer font-bangla border ${
              isBanglaActive
                ? 'bg-[#D4AF37] text-[#081816] font-bold border-[#D4AF37]'
                : 'text-[#D4AF37] hover:text-[#F3EFE6] bg-[#071916] hover:bg-[#0E352F] border-[#D4AF37]/25'
            }`}
            title="বাংলা তরজমা পাঠ শুনুন"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">বাংলা বলুন</span>
          </button>

          <button
            onClick={() => onOpenTafsir(ayah)}
            className="flex items-center gap-1 px-2.5 py-1 text-xs text-[#D4AF37] hover:text-[#F3EFE6] bg-[#071916] hover:bg-[#0E352F] border border-[#D4AF37]/25 rounded-md transition-colors cursor-pointer font-bangla"
            title="তাফসীর ও তাজবীদ অন্তর্দৃষ্টি"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">তাফসীর</span>
          </button>

          <button
            onClick={handleCopy}
            className="p-1.5 text-[#A89F91] hover:text-[#D4AF37] bg-[#071916] border border-[#D4AF37]/20 rounded-md transition-colors cursor-pointer"
            title="আয়াত কপি করুন"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={() => onToggleBookmark(ayah)}
            className={`p-1.5 rounded-md transition-colors cursor-pointer border ${
              isBookmarked
                ? 'bg-[#D4AF37]/25 border-[#D4AF37] text-[#D4AF37]'
                : 'text-[#A89F91] hover:text-[#D4AF37] bg-[#071916] border-[#D4AF37]/20'
            }`}
            title={isBookmarked ? 'প্রিয় তালিকা থেকে মুছুন' : 'প্রিয় তালিকায় সংরক্ষণ করুন'}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-[#D4AF37]' : ''}`} />
          </button>

          <button
            onClick={() => onPlay(ayah)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              isActive && (isPlaying || isBanglaActive)
                ? 'bg-[#D4AF37] text-[#081816] shadow-md shadow-[#D4AF37]/30'
                : 'bg-[#0E352F] hover:bg-[#14483F] text-[#D4AF37] border border-[#D4AF37]/40'
            }`}
          >
            {isActive && (isPlaying || isBanglaActive) ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>চলছে</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>তিলাওয়াত</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Arabic Calligraphy Verse with prominent highlight when active */}
      <div
        className={`mb-6 text-right transition-all rounded-xl ${
          isActive
            ? 'bg-[#061B17]/90 p-4 sm:p-5 border border-[#D4AF37]/40 shadow-inner'
            : ''
        }`}
        dir="rtl"
      >
        <p
          className={`font-arabic leading-[2.2] tracking-wide transition-colors ${
            isActive
              ? 'text-[#FFF8E7] drop-shadow-[0_2px_10px_rgba(212,175,55,0.3)] font-semibold'
              : 'text-[#FBF9F5]'
          }`}
          style={{ fontSize: `${arabicFontSize}px` }}
        >
          {ayah.arabic}
          <span
            className={`inline-flex items-center justify-center w-8 h-8 mx-2 text-xs font-serif rounded-full transition-all ${
              isActive
                ? 'bg-[#D4AF37] text-[#081816] font-bold border-2 border-[#FDE68A] shadow-md shadow-[#D4AF37]/40'
                : 'bg-[#081816] text-[#D4AF37] border border-[#D4AF37]/40'
            }`}
          >
            {ayah.ayahNumber}
          </span>
        </p>
      </div>

      {/* Pronunciation (if available & toggled) */}
      {showPronunciation && ayah.banglaPronunciation && (
        <div
          className={`mb-3 text-xs sm:text-sm font-bangla italic px-3.5 py-2 rounded-lg border-l-4 transition-all ${
            isActive
              ? 'bg-[#061814] text-[#E2F0EA] border-l-[#D4AF37] border border-[#D4AF37]/30 font-medium'
              : 'bg-[#061513]/60 text-[#A0BAAF] border-l-[#D4AF37]/60'
          }`}
        >
          <span className="font-semibold text-[#D4AF37] not-italic mr-1.5">উচ্চারণ:</span>
          {ayah.banglaPronunciation}
        </div>
      )}

      {/* Bangla Translation with dynamic highlight when actively spoken or selected */}
      {showBangla && ayah.bangla && (
        <div
          className={`mb-3 text-sm sm:text-base font-bangla leading-relaxed transition-all rounded-xl ${
            isBanglaActive
              ? 'bg-[#D4AF37]/25 p-4 border-2 border-[#D4AF37] ring-2 ring-[#D4AF37]/50 shadow-xl text-[#FFF] animate-pulse'
              : isActive
              ? 'bg-[#D4AF37]/15 p-3.5 border-l-4 border-l-[#D4AF37] border border-[#D4AF37]/35 text-[#FFF] shadow-sm'
              : 'text-[#E2DACB]'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-[#D4AF37] font-semibold">[বাংলা অর্থ ও তরজমা]</span>
            {isBanglaActive && (
              <span className="text-[11px] text-[#081816] bg-[#D4AF37] px-2 py-0.5 rounded-full font-bold">
                ভয়েস পাঠ চলছে
              </span>
            )}
          </div>
          <p>{ayah.bangla}</p>
        </div>
      )}

      {/* English Translation */}
      {showEnglish && ayah.english && (
        <div
          className={`text-xs sm:text-sm font-sans leading-relaxed pt-2 border-t transition-colors ${
            isActive
              ? 'border-[#D4AF37]/30 text-[#D8D2C6]'
              : 'border-[#D4AF37]/10 text-[#A89F91]'
          }`}
        >
          <span className="text-[11px] text-[#C5BBAA] font-medium mr-1.5">[English]</span>
          {ayah.english}
        </div>
      )}

      {/* Bottom indicator if currently active */}
      {isActive && (
        <div className="mt-4 flex items-center justify-between text-xs text-[#D4AF37] font-bangla pt-3 border-t border-[#D4AF37]/30">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#D4AF37]" />
            </span>
            <span className="font-semibold">
              {isBanglaActive
                ? 'বাংলা তরজমা পাঠ হচ্ছে...'
                : isPlaying
                ? 'কারি তিলাওয়াত করছেন (এরপর বাংলা তরজমা হবে)...'
                : 'তিলাওয়াত প্রস্তুত'}
            </span>
          </div>
          <button
            onClick={() => onRepeatAyah(ayah)}
            className="flex items-center gap-1.5 text-[#C5BBAA] hover:text-[#D4AF37] transition-colors cursor-pointer bg-[#071916] px-2.5 py-1 rounded-md border border-[#D4AF37]/25"
          >
            <Repeat className="w-3.5 h-3.5" />
            <span>এই আয়াত আবার শুনুন</span>
          </button>
        </div>
      )}
    </article>
  );
};
