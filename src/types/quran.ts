export interface Ayah {
  surahNumber: number;
  ayahNumber: number;
  globalAyahNumber?: number;
  arabic: string;
  bangla: string;
  banglaPronunciation?: string;
  english: string;
  audioUrl?: string;
}

export interface SurahInfo {
  number: number;
  nameArabic: string;
  nameBangla: string;
  nameEnglish: string;
  englishMeaning: string;
  totalAyahs: number;
  revelationType: 'মাক্কী' | 'মাদানী';
}

export interface Qari {
  id: string;
  everyAyahSubfolder: string;
  nameArabic: string;
  nameBangla: string;
  nameEnglish: string;
  country: string;
  countryBangla: string;
  style: string;
  styleBangla: string;
  descriptionBangla: string;
  avatarUrl?: string;
}

export interface PlaybackState {
  isPlaying: boolean;
  currentSurah: number;
  currentAyah: number;
  selectedQariId: string;
  playbackSpeed: number;
  repeatMode: 'none' | 'one' | 'continuous';
  currentTime: number;
  duration: number;
}

export interface BookmarkedAyah {
  surahNumber: number;
  ayahNumber: number;
  arabic: string;
  bangla: string;
  english: string;
  surahNameBangla: string;
  bookmarkedAt: number;
}
