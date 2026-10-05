import React, { useState } from 'react';
import { Play, Sparkles, CornerDownLeft, Volume2, User, RefreshCw } from 'lucide-react';
import { FAMOUS_AYAH_PRESETS } from '../data/initialAyahs';
import { parseUserAyahInput } from '../utils/quranApi';
import { Qari } from '../types/quran';

interface CustomAyahInputProps {
  onLoadCustomVerses: (surahNumber: number, ayahStart: number, ayahEnd: number, customNote?: string) => void;
  activeQari: Qari;
  onOpenQariModal: () => void;
  isLoading: boolean;
}

export const CustomAyahInput: React.FC<CustomAyahInputProps> = ({
  onLoadCustomVerses,
  activeQari,
  onOpenQariModal,
  isLoading
}) => {
  const [inputText, setInputText] = useState(
    'ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَـٰلَمِينَ ٢\nبِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ ١'
  );
  const [feedback, setFeedback] = useState<string | null>(
    'শনাক্ত হয়েছে: সূরা আল-ফাতিহা (১:১ - ১:২) • কারি কণ্ঠে তিলাওয়াত শুনুন'
  );

  const handleInputChange = (text: string) => {
    setInputText(text);
    if (!text.trim()) {
      setFeedback(null);
      return;
    }
    const result = parseUserAyahInput(text);
    setFeedback(`শনাক্ত হয়েছে: সূরা নং ${result.surahNumber} (আয়াত ${result.ayahStart}${result.ayahEnd > result.ayahStart ? ` থেকে ${result.ayahEnd}` : ''})`);
  };

  const handlePlaySubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const result = parseUserAyahInput(inputText);
    onLoadCustomVerses(result.surahNumber, result.ayahStart, result.ayahEnd, inputText);
  };

  const handleSelectPreset = (preset: typeof FAMOUS_AYAH_PRESETS[0]) => {
    if (preset.id === 'fatihah-1-2') {
      setInputText('بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ ١\nٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَـٰلَمِينَ ٢');
    } else {
      setInputText(`${preset.surahNumber}:${preset.ayahStart}${preset.ayahEnd > preset.ayahStart ? `-${preset.ayahEnd}` : ''}`);
    }
    onLoadCustomVerses(preset.surahNumber, preset.ayahStart, preset.ayahEnd);
    setFeedback(`লোড করা হয়েছে: ${preset.titleBangla}`);
  };

  return (
    <div id="custom-ayah-section" className="w-full bg-[#0B2521] border border-[#D4AF37]/30 rounded-2xl p-4 sm:p-6 lg:p-7 shadow-xl shadow-black/40 relative overflow-hidden">
      {/* Subtle Islamic geometric background accent */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#D4AF37]/5 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-[#14532D]/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 relative z-10">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#D4AF37]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>আয়াত তিলাওয়াত কারি রিকোয়েস্ট</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#FBF9F5] mt-1">
            যেকোনো আয়াত দিন — কারির মতো তিলাওয়াত শুনুন
          </h2>
          <p className="text-xs sm:text-sm text-[#A89F91] mt-0.5 font-bangla">
            কুরআনের যেকোনো আয়াত লিখুন বা পেস্ট করুন। বিশ্ববিখ্যাত কারিদের শুদ্ধ সুরে মুহূর্তেই শুনতে পারবেন।
          </p>
        </div>

        {/* Active Qari Pill Button */}
        <button
          onClick={onOpenQariModal}
          className="self-start sm:self-auto flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0E352F] hover:bg-[#13443C] border border-[#D4AF37]/30 text-xs text-[#F3EFE6] transition-all cursor-pointer group"
          title="কারি পরিবর্তন করুন"
        >
          <div className="w-6 h-6 rounded-full bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37]">
            <User className="w-3.5 h-3.5" />
          </div>
          <div className="text-left">
            <div className="text-[10px] text-[#A89F91]">বর্তমান কারি:</div>
            <div className="font-semibold text-[#D4AF37] group-hover:text-[#F3EFE6] transition-colors truncate max-w-[140px]">
              {activeQari.nameBangla}
            </div>
          </div>
        </button>
      </div>

      {/* Input box */}
      <form onSubmit={handlePlaySubmit} className="relative z-10 mb-4">
        <div className="relative rounded-xl border border-[#D4AF37]/30 bg-[#061412] focus-within:border-[#D4AF37] focus-within:ring-1 focus-within:ring-[#D4AF37]/40 transition-all">
          <textarea
            value={inputText}
            onChange={(e) => handleInputChange(e.target.value)}
            rows={3}
            dir="auto"
            placeholder="উদাহরণ: ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَـٰلَمِينَ অথবা 1:2 বা আয়াতুল কুরসী..."
            className="w-full bg-transparent px-4 py-3 text-[#FBF9F5] placeholder-[#6A7874] text-base sm:text-lg focus:outline-none resize-none font-arabic leading-relaxed"
          />

          <div className="flex items-center justify-between px-3 py-2 border-t border-[#D4AF37]/15 bg-[#081C18]/60">
            <span className="text-xs text-[#A89F91] font-bangla truncate">
              {feedback || 'আরবি আয়াত, বাংলা নাম বা ১:২ ফরম্যাটে লিখুন'}
            </span>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => handleInputChange('')}
                className="px-2.5 py-1 text-xs text-[#8E9B97] hover:text-[#F3EFE6] transition-colors cursor-pointer"
              >
                মুছুন
              </button>
              <button
                type="submit"
                disabled={isLoading || !inputText.trim()}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#D4AF37] hover:bg-[#E5C158] text-[#081816] font-semibold text-xs sm:text-sm rounded-lg transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-[#D4AF37]/20 whitespace-nowrap"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>লোড হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>তিলাওয়াত চালান</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Preset pills for quick navigation */}
      <div className="relative z-10">
        <div className="text-xs text-[#A89F91] mb-2 flex items-center gap-1.5 font-bangla">
          <Sparkles className="w-3 h-3 text-[#D4AF37]" />
          <span>দ্রুত নির্বাচনের জন্য আয়াতসমূহ:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {FAMOUS_AYAH_PRESETS.map((preset) => {
            const isUserRequest = preset.id === 'fatihah-1-2';
            return (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className={`text-xs px-3 py-1.5 rounded-lg border transition-all cursor-pointer font-bangla flex items-center gap-1.5 ${
                  isUserRequest
                    ? 'bg-[#D4AF37]/15 border-[#D4AF37] text-[#D4AF37] font-semibold hover:bg-[#D4AF37]/25'
                    : 'bg-[#0E352F]/70 border-[#D4AF37]/20 text-[#D8D2C6] hover:bg-[#0E352F] hover:border-[#D4AF37]/50'
                }`}
              >
                <Volume2 className="w-3 h-3 shrink-0" />
                <span className="truncate">{preset.titleBangla}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
