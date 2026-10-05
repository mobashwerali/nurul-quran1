import React, { useState } from 'react';
import { X, Sparkles, BookOpen, Volume2, Check, RefreshCw } from 'lucide-react';
import { Ayah } from '../types/quran';

interface TafsirModalProps {
  ayah: Ayah | null;
  surahNameBangla: string;
  isOpen: boolean;
  onClose: () => void;
  onPlayAyah: (ayah: Ayah) => void;
}

export const TafsirModal: React.FC<TafsirModalProps> = ({
  ayah,
  surahNameBangla,
  isOpen,
  onClose,
  onPlayAyah
}) => {
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  if (!isOpen || !ayah) return null;

  const handleFetchAiTafsir = async () => {
    setLoadingAi(true);
    try {
      const res = await fetch('/api/tafsir', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          surahNumber: ayah.surahNumber,
          ayahNumber: ayah.ayahNumber,
          arabic: ayah.arabic,
          banglaMeaning: ayah.bangla
        })
      });

      if (res.ok) {
        const data = await res.json();
        setAiInsight(data.tafsir);
      } else {
        // Fallback default spiritual reflection
        setAiInsight(getDefaultReflection(ayah));
      }
    } catch {
      setAiInsight(getDefaultReflection(ayah));
    } finally {
      setLoadingAi(false);
    }
  };

  const getDefaultReflection = (a: Ayah) => {
    if (a.surahNumber === 1 && a.ayahNumber === 1) {
      return 'বিসমিল্লাহির রাহমানির রাহীম: প্রতিটি নেক কাজের শুরুতে আল্লাহর বরকতময় নামের স্মরণ। এটি বান্দাকে স্মরণ করিয়ে দেয় যে তিনি পরম করুণাময় ও অফুরন্ত দয়ালু রবের আশ্রয়প্রার্থী। তাজবীদ দ্রষ্টব্য: ‘ল্লাহ’ শব্দে আগের অক্ষরে যের থাকায় লাম পাতলা (তারকীক) করে পড়তে হবে।';
    }
    if (a.surahNumber === 1 && a.ayahNumber === 2) {
      return 'আলহামদুলিল্লাহি রাব্বিল আলামীন: বিশ্বজাহানের সব প্রশংসা ও কৃতজ্ঞতা একমাত্র আল্লাহর। ‘রাব্ব’ অর্থ যিনি লালন-পালন ও রক্ষা করেন। তাজবীদ দ্রষ্টব্য: ‘আলামীন’ শব্দে শেষে ওয়াকফ করার কারণে মাদ্দে আরেয ৩ থেকে ৫ আলিফ পরিমাণ টেনে পড়ার বিধান রয়েছে।';
    }
    return `সূরা ${surahNameBangla}-এর এই মহিমান্বিত আয়াতে আল্লাহর একত্ববাদ, রহমত ও বান্দার প্রতি হেদায়েতের অমীয় বার্তা প্রতিফলিত হয়েছে। তিলাওয়াতকালে মাখরাজ ও সিফাত বজায় রেখে ধীরস্থিরভাবে হৃদয় দিয়ে অনুধাবন করা উচিত।`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl bg-[#081C18] border border-[#D4AF37]/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#D4AF37]/20 flex items-center justify-between bg-[#061613]">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#D4AF37]" />
            <h3 className="text-lg font-serif font-bold text-[#FBF9F5]">
              তাফসীর ও তাজবীদ অন্তর্দৃষ্টি
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#8E9B97] hover:text-[#F3EFE6] hover:bg-[#0E352F] rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* Reference Info */}
          <div className="text-xs text-[#D4AF37] font-bangla font-semibold">
            সূরা {surahNameBangla} • আয়াত {ayah.ayahNumber}
          </div>

          {/* Arabic Box */}
          <div className="bg-[#051412] p-4 rounded-xl border border-[#D4AF37]/20 text-right" dir="rtl">
            <p className="font-arabic text-xl sm:text-2xl text-[#FBF9F5] leading-loose">
              {ayah.arabic}
            </p>
          </div>

          {/* Pronunciation & Translation */}
          {ayah.banglaPronunciation && (
            <div className="text-xs sm:text-sm text-[#A0BAAF] font-bangla">
              <span className="text-[#D4AF37] font-semibold mr-1.5">উচ্চারণ:</span>
              {ayah.banglaPronunciation}
            </div>
          )}

          <div className="text-sm sm:text-base text-[#E2DACB] font-bangla leading-relaxed bg-[#0E352F]/40 p-3.5 rounded-xl border border-[#D4AF37]/15">
            <span className="text-xs text-[#D4AF37] font-semibold mr-1.5">[অর্থ]</span>
            {ayah.bangla}
          </div>

          {/* AI Tafsir / Reflection Box */}
          <div className="pt-2">
            {aiInsight ? (
              <div className="bg-[#0A221E] border border-[#D4AF37]/30 rounded-xl p-4 text-xs sm:text-sm text-[#D8D2C6] font-bangla leading-relaxed">
                <div className="flex items-center gap-1.5 text-[#D4AF37] font-semibold mb-2">
                  <Sparkles className="w-4 h-4" />
                  <span>তাফসীর ও তাজবীদ বিশ্লেষণ</span>
                </div>
                <p className="whitespace-pre-line">{aiInsight}</p>
              </div>
            ) : (
              <button
                onClick={handleFetchAiTafsir}
                disabled={loadingAi}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#0E352F] hover:bg-[#14483F] border border-[#D4AF37]/40 text-xs sm:text-sm font-semibold text-[#D4AF37] transition-all cursor-pointer shadow-md"
              >
                {loadingAi ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>তাফসীর প্রস্তুত হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>এই আয়াতের বিস্তারিত তাফসীর ও তাজবীদ জানুন</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[#D4AF37]/20 bg-[#061613] flex items-center justify-between">
          <button
            onClick={() => {
              onPlayAyah(ayah);
              onClose();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#081816] bg-[#D4AF37] hover:bg-[#E5C158] rounded-lg transition-colors cursor-pointer"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>তিলাওয়াত শুনুন</span>
          </button>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs text-[#8E9B97] hover:text-[#F3EFE6] transition-colors cursor-pointer"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
};
