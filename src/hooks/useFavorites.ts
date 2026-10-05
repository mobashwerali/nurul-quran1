import { useState, useEffect, useCallback } from 'react';
import { Ayah, BookmarkedAyah } from '../types/quran';

const STORAGE_KEY = 'nurul_quran_favorites_v1';

export function useFavorites() {
  const [favorites, setFavorites] = useState<BookmarkedAyah[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to load favorites from localStorage:', e);
    }
    // Default initial bookmark: Surah Al-Fatihah Ayah 2
    return [
      {
        surahNumber: 1,
        ayahNumber: 2,
        arabic: "ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَـٰلَمِينَ",
        bangla: "যাবতীয় প্রশংসা একমাত্র আল্লাহর জন্য, যিনি সমগ্র বিশ্বজগতের প্রতিপালক।",
        english: "All praise is for Allah—Lord of all worlds.",
        surahNameBangla: "আল-ফাতিহা",
        bookmarkedAt: Date.now()
      }
    ];
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch (e) {
      console.warn('Failed to persist favorites to localStorage:', e);
    }
  }, [favorites]);

  const isBookmarked = useCallback(
    (surahNumber: number, ayahNumber: number) => {
      return favorites.some(
        (f) => f.surahNumber === surahNumber && f.ayahNumber === ayahNumber
      );
    },
    [favorites]
  );

  const toggleBookmark = useCallback(
    (ayah: Ayah, surahNameBangla: string) => {
      setFavorites((prev) => {
        const exists = prev.some(
          (f) => f.surahNumber === ayah.surahNumber && f.ayahNumber === ayah.ayahNumber
        );
        if (exists) {
          return prev.filter(
            (f) => !(f.surahNumber === ayah.surahNumber && f.ayahNumber === ayah.ayahNumber)
          );
        } else {
          const newBookmark: BookmarkedAyah = {
            surahNumber: ayah.surahNumber,
            ayahNumber: ayah.ayahNumber,
            arabic: ayah.arabic,
            bangla: ayah.bangla,
            english: ayah.english,
            surahNameBangla,
            bookmarkedAt: Date.now()
          };
          return [newBookmark, ...prev];
        }
      });
    },
    []
  );

  const removeBookmark = useCallback((surahNumber: number, ayahNumber: number) => {
    setFavorites((prev) =>
      prev.filter(
        (f) => !(f.surahNumber === surahNumber && f.ayahNumber === ayahNumber)
      )
    );
  }, []);

  const clearAllBookmarks = useCallback(() => {
    setFavorites([]);
  }, []);

  return {
    favorites,
    isBookmarked,
    toggleBookmark,
    removeBookmark,
    clearAllBookmarks
  };
}
