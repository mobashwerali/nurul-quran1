import React from 'react';
import { X, Check, Volume2, Globe, Sparkles } from 'lucide-react';
import { Qari } from '../types/quran';
import { QARIS_LIST } from '../data/qaris';

interface QariSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedQariId: string;
  onSelectQari: (qari: Qari) => void;
}

export const QariSelectorModal: React.FC<QariSelectorModalProps> = ({
  isOpen,
  onClose,
  selectedQariId,
  onSelectQari
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl bg-[#081C18] border border-[#D4AF37]/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#D4AF37]/20 flex items-center justify-between bg-[#061613]">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-[#D4AF37] font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>কারি নির্বাচন ও তিলাওয়াত ভয়েস</span>
            </div>
            <h3 className="text-lg font-serif font-bold text-[#FBF9F5] mt-0.5">
              বিশ্ববিখ্যাত কারিগণ (World-Renowned Qaris)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#8E9B97] hover:text-[#F3EFE6] hover:bg-[#0E352F] rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of Qaris */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3">
          <p className="text-xs text-[#A89F91] font-bangla mb-1">
            যেকোনো কারি নির্বাচন করুন, আপনার নির্বাচিত আয়াত তাৎক্ষণিকভাবে সেই কারির কণ্ঠে শুরু হবে:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {QARIS_LIST.map((qari) => {
              const isSelected = qari.id === selectedQariId;
              return (
                <div
                  key={qari.id}
                  onClick={() => {
                    onSelectQari(qari);
                    onClose();
                  }}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between text-left group relative ${
                    isSelected
                      ? 'bg-[#0E352F] border-[#D4AF37] ring-1 ring-[#D4AF37]/50 shadow-lg'
                      : 'bg-[#071916] hover:bg-[#0B2521] border-[#D4AF37]/20 hover:border-[#D4AF37]/50'
                  }`}
                >
                  <div>
                    {/* Top Row: Arabic Name & Check */}
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <span className="font-arabic text-[#D4AF37] text-base font-semibold" dir="rtl">
                        {qari.nameArabic}
                      </span>
                      {isSelected ? (
                        <div className="w-5 h-5 rounded-full bg-[#D4AF37] text-[#081816] flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full border border-[#D4AF37]/30 group-hover:border-[#D4AF37] flex items-center justify-center shrink-0">
                          <Volume2 className="w-2.5 h-2.5 text-[#8E9B97] group-hover:text-[#D4AF37]" />
                        </div>
                      )}
                    </div>

                    {/* Bangla Name */}
                    <div className="text-sm font-semibold text-[#F3EFE6] font-bangla group-hover:text-[#D4AF37] transition-colors">
                      {qari.nameBangla}
                    </div>

                    {/* Style & Country */}
                    <div className="flex items-center gap-1.5 text-xs text-[#8E9B97] mt-1 font-bangla">
                      <Globe className="w-3 h-3 text-[#D4AF37]/70 shrink-0" />
                      <span>{qari.countryBangla}</span>
                      <span>·</span>
                      <span className="text-[#C5BBAA]">{qari.styleBangla}</span>
                    </div>

                    {/* Short Description */}
                    <p className="text-[11px] text-[#8E9B97] font-bangla mt-2 line-clamp-2">
                      {qari.descriptionBangla}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[#D4AF37]/20 bg-[#061613] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-[#081816] bg-[#D4AF37] hover:bg-[#E5C158] rounded-lg transition-colors cursor-pointer"
          >
            সম্পন্ন
          </button>
        </div>
      </div>
    </div>
  );
};
