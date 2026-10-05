import React, { useState } from 'react';
import { X, Bookmark, Play, Trash2, BookOpen, Volume2, Search, Sparkles } from 'lucide-react';
import { BookmarkedAyah } from '../types/quran';

interface FavoritesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: BookmarkedAyah[];
  onPlayFavorite: (favorite: BookmarkedAyah) => void;
  onRemoveFavorite: (surahNumber: number, ayahNumber: number) => void;
  onClearAll: () => void;
}

export const FavoritesDrawer: React.FC<FavoritesDrawerProps> = ({
  isOpen,
  onClose,
  favorites,
  onPlayFavorite,
  onRemoveFavorite,
  onClearAll
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredFavorites = favorites.filter((fav) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      fav.surahNameBangla.toLowerCase().includes(q) ||
      String(fav.ayahNumber).includes(q) ||
      fav.bangla.toLowerCase().includes(q) ||
      fav.arabic.includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-[#071B17] border-l border-[#D4AF37]/30 h-full flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#D4AF37]/20 flex items-center justify-between bg-[#051512]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
              <Bookmark className="w-4 h-4 fill-[#D4AF37]" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-serif font-bold text-[#FBF9F5]">
                আমার প্রিয় আয়াতসমূহ
              </h3>
              <p className="text-[11px] text-[#A89F91] font-bangla">
                মোট সংরক্ষিত: {favorites.length}টি আয়াত
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#8E9B97] hover:text-[#F3EFE6] hover:bg-[#0E352F] rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search bar inside favorites (if more than 2) */}
        {favorites.length > 2 && (
          <div className="p-3 border-b border-[#D4AF37]/15 bg-[#081F1A]">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#8E9B97] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="সংরক্ষিত আয়াতে খুঁজুন..."
                className="w-full bg-[#051512] border border-[#D4AF37]/25 rounded-lg pl-8 pr-3 py-1.5 text-xs text-[#F3EFE6] placeholder-[#6E7D79] focus:outline-none focus:border-[#D4AF37] font-bangla"
              />
            </div>
          </div>
        )}

        {/* Favorites List */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3">
          {filteredFavorites.map((fav) => (
            <div
              key={`${fav.surahNumber}-${fav.ayahNumber}`}
              className="bg-[#08201B] border border-[#D4AF37]/25 hover:border-[#D4AF37]/50 rounded-xl p-3.5 transition-all group relative shadow-md"
            >
              {/* Header row */}
              <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-[#D4AF37]/15">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-[#0D2E27] border border-[#D4AF37]/30 flex items-center justify-center font-serif text-[11px] font-bold text-[#D4AF37]">
                    {fav.ayahNumber}
                  </div>
                  <span className="text-xs font-semibold text-[#F3EFE6] font-bangla">
                    সূরা {fav.surahNameBangla}
                  </span>
                  <span className="text-[10px] text-[#A89F91]">
                    ({fav.surahNumber}:{fav.ayahNumber})
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  {/* Play CTA */}
                  <button
                    onClick={() => {
                      onPlayFavorite(fav);
                      onClose();
                    }}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#D4AF37] hover:bg-[#E5C158] text-[#081816] text-[11px] font-bold transition-colors cursor-pointer shadow-xs"
                    title="তিলাওয়াত শুনুন"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>শুনুন</span>
                  </button>

                  {/* Remove CTA */}
                  <button
                    onClick={() => onRemoveFavorite(fav.surahNumber, fav.ayahNumber)}
                    className="p-1 text-[#8E9B97] hover:text-red-400 hover:bg-red-950/40 rounded transition-colors cursor-pointer"
                    title="বুকমার্ক মুছুন"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Arabic snippet */}
              <div className="text-right font-arabic text-base sm:text-lg text-[#FBF9F5] leading-relaxed mb-2" dir="rtl">
                {fav.arabic}
              </div>

              {/* Bangla Meaning */}
              {fav.bangla && (
                <p className="text-xs text-[#C5BBAA] font-bangla leading-relaxed line-clamp-2">
                  {fav.bangla}
                </p>
              )}
            </div>
          ))}

          {/* Empty State */}
          {favorites.length === 0 && (
            <div className="text-center py-12 px-4 flex flex-col items-center justify-center">
              <div className="w-14 h-14 rounded-2xl bg-[#0B2A24] border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37]/60 mb-3">
                <Bookmark className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-semibold text-[#F3EFE6] font-bangla">
                কোনো আয়াত এখনো বুকমার্ক করেননি
              </h4>
              <p className="text-xs text-[#8E9B97] font-bangla mt-1 max-w-xs leading-relaxed">
                পড়ার সময় যেকোনো আয়াতের সাথে থাকা বুকমার্ক আইকনে ক্লিক করে এখানে প্রিয় তালিকায় সংরক্ষণ করে রাখতে পারেন।
              </p>
            </div>
          )}

          {favorites.length > 0 && filteredFavorites.length === 0 && (
            <div className="text-center py-8 text-xs text-[#8E9B97] font-bangla">
              কোনো ফলাফল পাওয়া যায়নি।
            </div>
          )}
        </div>

        {/* Footer */}
        {favorites.length > 0 && (
          <div className="p-3 sm:p-4 border-t border-[#D4AF37]/20 bg-[#051512] flex items-center justify-between">
            <button
              onClick={() => {
                if (window.confirm('আপনি কি প্রিয় তালিকার সকল আয়াত মুছে ফেলতে চান?')) {
                  onClearAll();
                }
              }}
              className="text-xs text-[#8E9B97] hover:text-red-400 transition-colors cursor-pointer font-bangla flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>সব মুছুন</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-semibold text-[#081816] bg-[#D4AF37] hover:bg-[#E5C158] rounded-lg transition-colors cursor-pointer"
            >
              সম্পন্ন
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
