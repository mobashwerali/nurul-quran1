import React from 'react';
import { Volume2, BookOpen, Bookmark } from 'lucide-react';

interface NavbarProps {
  onOpenSurahList: () => void;
  onOpenQariModal: () => void;
  onOpenFavorites: () => void;
  onScrollToInput: () => void;
  onScrollToPlayer: () => void;
  activeQariName: string;
  favoritesCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenSurahList,
  onOpenQariModal,
  onOpenFavorites,
  onScrollToInput,
  onScrollToPlayer,
  activeQariName,
  favoritesCount
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#081816]/95 backdrop-blur-md border-b border-[#D4AF37]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <a href="/" className="flex items-center gap-2 group shrink-0">
          <div className="w-8 h-8 rounded-lg bg-[#0E352F] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] font-serif text-lg group-hover:border-[#D4AF37] transition-colors">
            ن
          </div>
          <span className="text-lg sm:text-xl font-serif font-bold tracking-tight text-[#F3EFE6] group-hover:text-[#D4AF37] transition-colors whitespace-nowrap">
            Nurul Quran
          </span>
        </a>

        {/* Zone 2: Clean text navigation links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-7 text-sm font-medium text-[#C5BBAA]">
          <button
            onClick={onScrollToInput}
            className="hover:text-[#D4AF37] transition-colors cursor-pointer whitespace-nowrap"
          >
            আয়াত তিলাওয়াত
          </button>
          <button
            onClick={onOpenSurahList}
            className="hover:text-[#D4AF37] transition-colors cursor-pointer whitespace-nowrap"
          >
            ১১৪টি সূরা
          </button>
          <button
            onClick={onOpenFavorites}
            className="hover:text-[#D4AF37] transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5"
          >
            <span>প্রিয় আয়াত</span>
            {favoritesCount > 0 && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#D4AF37] text-[#081816] leading-none">
                {favoritesCount}
              </span>
            )}
          </button>
          <button
            onClick={onOpenQariModal}
            className="hover:text-[#D4AF37] transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5"
          >
            <span>কারি নির্বাচন</span>
            <span className="text-xs text-[#D4AF37] font-bangla truncate max-w-[100px]">
              ({activeQariName})
            </span>
          </button>
          <button
            onClick={onScrollToPlayer}
            className="hover:text-[#D4AF37] transition-colors cursor-pointer whitespace-nowrap"
          >
            অডিও প্লেয়ার
          </button>
        </nav>

        {/* Zone 3: Primary actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={onOpenFavorites}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#D4AF37] bg-[#0E352F]/80 hover:bg-[#0E352F] border border-[#D4AF37]/30 rounded-lg transition-colors cursor-pointer whitespace-nowrap relative"
            title="প্রিয় আয়াত ড্রয়ার খুলুন"
          >
            <Bookmark className="w-3.5 h-3.5 fill-[#D4AF37]" />
            <span className="hidden sm:inline">প্রিয় তালিকা</span>
            {favoritesCount > 0 && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#D4AF37] text-[#081816] leading-none">
                {favoritesCount}
              </span>
            )}
          </button>

          <button
            onClick={onScrollToInput}
            className="px-3.5 py-1.5 text-xs font-semibold text-[#081816] bg-[#D4AF37] hover:bg-[#E5C158] rounded-lg transition-colors cursor-pointer shadow-sm shadow-[#D4AF37]/20 whitespace-nowrap flex items-center gap-1.5"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>আয়াত শুনুন</span>
          </button>
        </div>
      </div>
    </header>
  );
};
