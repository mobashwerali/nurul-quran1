import React, { useState, useMemo } from 'react';
import { X, Search, BookOpen } from 'lucide-react';
import { SURAHS_LIST } from '../data/surahs';
import { SurahInfo } from '../types/quran';

interface SurahDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentSurahNumber: number;
  onSelectSurah: (surahNumber: number) => void;
}

export const SurahDrawer: React.FC<SurahDrawerProps> = ({
  isOpen,
  onClose,
  currentSurahNumber,
  onSelectSurah
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSurahs = useMemo(() => {
    if (!searchTerm.trim()) return SURAHS_LIST;
    const term = searchTerm.toLowerCase().trim();
    return SURAHS_LIST.filter((s) => {
      const matchNum = String(s.number) === term;
      const matchBangla = s.nameBangla.toLowerCase().includes(term);
      const matchEnglish = s.nameEnglish.toLowerCase().includes(term);
      const matchMeaning = s.englishMeaning.toLowerCase().includes(term);
      const matchArabic = s.nameArabic.includes(term);
      return matchNum || matchBangla || matchEnglish || matchMeaning || matchArabic;
    });
  }, [searchTerm]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-[#071B17] border-l border-[#D4AF37]/30 h-full flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#D4AF37]/20 flex items-center justify-between bg-[#051512]">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#D4AF37]" />
            <h3 className="text-lg font-serif font-bold text-[#FBF9F5]">
              পবিত্র কুরআনের ১১৪টি সূরা
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#8E9B97] hover:text-[#F3EFE6] hover:bg-[#0E352F] rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search input */}
        <div className="p-4 border-b border-[#D4AF37]/15 bg-[#081F1A]">
          <div className="relative">
            <Search className="w-4 h-4 text-[#8E9B97] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="সূরার নাম (যেমন: ফাতিহা, রহমান) বা নম্বর..."
              className="w-full bg-[#051512] border border-[#D4AF37]/30 rounded-lg pl-9 pr-4 py-2 text-xs sm:text-sm text-[#F3EFE6] placeholder-[#6E7D79] focus:outline-none focus:border-[#D4AF37] font-bangla"
            />
          </div>
        </div>

        {/* Surahs List */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2">
          {filteredSurahs.map((surah) => {
            const isSelected = surah.number === currentSurahNumber;
            return (
              <button
                key={surah.number}
                onClick={() => {
                  onSelectSurah(surah.number);
                  onClose();
                }}
                className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between group ${
                  isSelected
                    ? 'bg-[#0E352F] border-[#D4AF37] shadow-md'
                    : 'bg-[#061814]/70 hover:bg-[#0B2520] border-[#D4AF37]/15 hover:border-[#D4AF37]/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Number Badge */}
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center font-serif text-xs font-bold ${
                      isSelected
                        ? 'bg-[#D4AF37] text-[#081816]'
                        : 'bg-[#08201B] text-[#D4AF37] border border-[#D4AF37]/25'
                    }`}
                  >
                    {surah.number}
                  </div>

                  <div>
                    <div className="text-sm font-semibold text-[#F3EFE6] font-bangla group-hover:text-[#D4AF37] transition-colors flex items-center gap-1.5">
                      <span>{surah.nameBangla}</span>
                      <span className="text-xs text-[#8E9B97] font-normal font-sans">
                        ({surah.nameEnglish})
                      </span>
                    </div>
                    <div className="text-[11px] text-[#8E9B97] font-bangla">
                      <span>{surah.revelationType}</span>
                      <span className="mx-1.5 opacity-40">·</span>
                      <span>{surah.totalAyahs} আয়াত</span>
                    </div>
                  </div>
                </div>

                {/* Arabic Name */}
                <div className="font-arabic text-base sm:text-lg text-[#D4AF37] font-semibold" dir="rtl">
                  {surah.nameArabic}
                </div>
              </button>
            );
          })}

          {filteredSurahs.length === 0 && (
            <div className="text-center py-8 text-xs text-[#8E9B97] font-bangla">
              কোনো সূরা পাওয়া যায়নি। আবার অনুসন্ধান করুন।
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
