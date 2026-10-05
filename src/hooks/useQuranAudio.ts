import { useState, useRef, useEffect, useCallback } from 'react';
import { Qari, Ayah } from '../types/quran';
import { getAyahAudioUrls } from '../data/qaris';
import { splitTextIntoChunks, getGoogleTTSUrl } from '../utils/banglaVoice';

export type VoiceSequenceMode =
  | 'arabic_then_bangla'
  | 'bangla_then_arabic'
  | 'arabic_only'
  | 'bangla_only';

interface UseQuranAudioProps {
  currentAyah: Ayah | null;
  activeQari: Qari;
  onAyahAutoAdvance: () => void;
}

export function useQuranAudio({
  currentAyah,
  activeQari,
  onAyahAutoAdvance
}: UseQuranAudioProps) {
  const arabicAudioRef = useRef<HTMLAudioElement | null>(null);
  const banglaAudioRef = useRef<HTMLAudioElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [isSpeakingBangla, setIsSpeakingBangla] = useState(false);

  // Preference: Automatic Bangla Translation voice
  const [voiceSequenceMode, setVoiceSequenceMode] = useState<VoiceSequenceMode>(() => {
    try {
      const saved = localStorage.getItem('nurul_quran_sequence_mode');
      if (saved) return saved as VoiceSequenceMode;
    } catch (e) {
      console.warn(e);
    }
    return 'arabic_then_bangla';
  });

  const [includeBanglaTranslation, setIncludeBanglaTranslation] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('nurul_quran_bangla_voice');
      if (saved !== null) return saved === 'true';
    } catch (e) {
      console.warn(e);
    }
    return true; // Default ON: automatic bangla translation voice
  });

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [repeatMode, setRepeatMode] = useState<'none' | 'one' | 'continuous'>('continuous');
  const [audioError, setAudioError] = useState<string | null>(null);

  // Refs for callbacks & state across event handlers
  const currentUrlIndexRef = useRef(0);
  const urlsRef = useRef<string[]>([]);
  const isPlayingRef = useRef(false);
  const repeatModeRef = useRef(repeatMode);
  const currentAyahRef = useRef<Ayah | null>(currentAyah);
  const sequenceModeRef = useRef(voiceSequenceMode);
  const includeBanglaRef = useRef(includeBanglaTranslation);
  const banglaChunksRef = useRef<string[]>([]);
  const banglaChunkIndexRef = useRef<number>(0);
  const banglaOnEndRef = useRef<(() => void) | null>(null);
  const pendingPlayPromiseRef = useRef<Promise<void> | null>(null);

  repeatModeRef.current = repeatMode;
  isPlayingRef.current = isPlaying;
  currentAyahRef.current = currentAyah;
  sequenceModeRef.current = voiceSequenceMode;
  includeBanglaRef.current = includeBanglaTranslation;

  // Persist preference to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('nurul_quran_sequence_mode', voiceSequenceMode);
    } catch (e) {
      console.warn(e);
    }
  }, [voiceSequenceMode]);

  useEffect(() => {
    try {
      localStorage.setItem('nurul_quran_bangla_voice', String(includeBanglaTranslation));
    } catch (e) {
      console.warn(e);
    }
  }, [includeBanglaTranslation]);

  // Stop all Bangla voice playback
  const stopBanglaSpeech = useCallback(() => {
    if (banglaAudioRef.current) {
      banglaAudioRef.current.pause();
      banglaAudioRef.current.removeAttribute('src');
    }
    banglaChunksRef.current = [];
    banglaChunkIndexRef.current = 0;
    banglaOnEndRef.current = null;

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {
        console.warn(e);
      }
    }
    setIsSpeakingBangla(false);
  }, []);

  // Web Speech API Fallback
  const speakBanglaWebSpeech = useCallback((text: string, onEnd?: () => void) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (onEnd) onEnd();
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'bn-BD';
      utterance.rate = 0.92;
      utterance.pitch = 1.0;

      const voices = window.speechSynthesis.getVoices();
      const bnVoice = voices.find(
        (v) =>
          v.lang.startsWith('bn') ||
          v.name.toLowerCase().includes('bangla') ||
          v.name.toLowerCase().includes('bengali')
      );
      if (bnVoice) {
        utterance.voice = bnVoice;
      }

      let ended = false;
      const finish = () => {
        if (!ended) {
          ended = true;
          setIsSpeakingBangla(false);
          if (onEnd) onEnd();
        }
      };

      utterance.onend = finish;
      utterance.onerror = finish;

      // Keep reference to prevent GC bug in Chrome
      (window as any).__quranUtterance = utterance;

      setTimeout(() => {
        try {
          window.speechSynthesis.resume();
          window.speechSynthesis.speak(utterance);
        } catch {
          finish();
        }
      }, 50);
    } catch {
      if (onEnd) onEnd();
    }
  }, []);

  // High quality native Google Bangla TTS audio stream with auto fallback
  const speakBanglaTranslation = useCallback(
    (text: string, onEnd?: () => void) => {
      stopBanglaSpeech();

      if (!text || !text.trim()) {
        if (onEnd) onEnd();
        return;
      }

      const chunks = splitTextIntoChunks(text);
      if (chunks.length === 0) {
        if (onEnd) onEnd();
        return;
      }

      banglaChunksRef.current = chunks;
      banglaChunkIndexRef.current = 0;
      banglaOnEndRef.current = onEnd || null;
      setIsSpeakingBangla(true);

      const playNextChunk = () => {
        const idx = banglaChunkIndexRef.current;
        const total = banglaChunksRef.current.length;

        if (idx >= total) {
          setIsSpeakingBangla(false);
          const cb = banglaOnEndRef.current;
          banglaOnEndRef.current = null;
          if (cb) cb();
          return;
        }

        const chunkText = banglaChunksRef.current[idx];
        const audio = banglaAudioRef.current;

        if (!audio) {
          // Fallback to Web Speech API
          speakBanglaWebSpeech(text, onEnd);
          return;
        }

        const url = getGoogleTTSUrl(chunkText);
        audio.src = url;
        audio.load();

        audio
          .play()
          .then(() => {
            setIsSpeakingBangla(true);
          })
          .catch((err) => {
            console.warn('Bangla audio stream failed, falling back to Web Speech:', err);
            speakBanglaWebSpeech(text, onEnd);
          });
      };

      playNextChunk();
    },
    [speakBanglaWebSpeech, stopBanglaSpeech]
  );

  // Initialize both Arabic and Bangla audio elements
  useEffect(() => {
    const arabicAudio = new Audio();
    arabicAudio.preload = 'auto';
    arabicAudioRef.current = arabicAudio;

    const banglaAudio = new Audio();
    banglaAudio.preload = 'auto';
    banglaAudioRef.current = banglaAudio;

    // Bangla audio chunk ended event
    const handleBanglaEnded = () => {
      banglaChunkIndexRef.current += 1;
      const idx = banglaChunkIndexRef.current;
      const total = banglaChunksRef.current.length;

      if (idx >= total) {
        setIsSpeakingBangla(false);
        const cb = banglaOnEndRef.current;
        banglaOnEndRef.current = null;
        if (cb) cb();
      } else {
        const nextText = banglaChunksRef.current[idx];
        banglaAudio.src = getGoogleTTSUrl(nextText);
        banglaAudio.load();
        banglaAudio.play().catch(() => {
          setIsSpeakingBangla(false);
          const cb = banglaOnEndRef.current;
          banglaOnEndRef.current = null;
          if (cb) cb();
        });
      }
    };

    const handleBanglaError = () => {
      console.warn('Bangla audio error, continuing sequence');
      setIsSpeakingBangla(false);
      const cb = banglaOnEndRef.current;
      banglaOnEndRef.current = null;
      if (cb) cb();
    };

    banglaAudio.addEventListener('ended', handleBanglaEnded);
    banglaAudio.addEventListener('error', handleBanglaError);

    // Arabic audio event listeners
    const handleTimeUpdate = () => {
      setCurrentTime(arabicAudio.currentTime);
      if (!isNaN(arabicAudio.duration) && arabicAudio.duration > 0) {
        setDuration(arabicAudio.duration);
      }
    };

    const handleDurationChange = () => {
      if (!isNaN(arabicAudio.duration) && arabicAudio.duration > 0) {
        setDuration(arabicAudio.duration);
      }
    };

    const handleWaiting = () => {
      setIsLoadingAudio(true);
    };

    const handleCanPlay = () => {
      setIsLoadingAudio(false);
      setAudioError(null);
    };

    // When Arabic finishes: trigger Bangla voice or next verse
    const handleArabicEnded = () => {
      setIsPlaying(false);
      const current = currentAyahRef.current;
      const mode = sequenceModeRef.current;
      const shouldSpeakBangla =
        includeBanglaRef.current &&
        mode !== 'arabic_only' &&
        current &&
        current.bangla;

      if (shouldSpeakBangla && current) {
        setIsSpeakingBangla(true);
        speakBanglaTranslation(current.bangla, () => {
          if (repeatModeRef.current === 'one') {
            arabicAudio.currentTime = 0;
            arabicAudio.play().then(() => setIsPlaying(true)).catch(() => {});
          } else if (repeatModeRef.current === 'continuous') {
            onAyahAutoAdvance();
          }
        });
      } else {
        if (repeatModeRef.current === 'one') {
          arabicAudio.currentTime = 0;
          arabicAudio.play().then(() => setIsPlaying(true)).catch(() => {});
        } else if (repeatModeRef.current === 'continuous') {
          onAyahAutoAdvance();
        }
      }
    };

    const handleArabicError = () => {
      setIsLoadingAudio(false);
      // If audio has no src or empty src, ignore
      if (!arabicAudio.getAttribute('src')) return;

      const nextIndex = currentUrlIndexRef.current + 1;
      if (nextIndex < urlsRef.current.length) {
        currentUrlIndexRef.current = nextIndex;
        arabicAudio.src = urlsRef.current[nextIndex];
        arabicAudio.load();
        if (isPlayingRef.current) {
          arabicAudio.play().then(() => setIsPlaying(true)).catch(() => {});
        }
      } else {
        setIsPlaying(false);
        setAudioError('অডিও লোড করতে সমস্যা হয়েছে। অনুগ্রহ করে ইন্টারনেট সংযোগ চেক করুন বা অন্য কারি নির্বাচন করুন।');
      }
    };

    arabicAudio.addEventListener('timeupdate', handleTimeUpdate);
    arabicAudio.addEventListener('durationchange', handleDurationChange);
    arabicAudio.addEventListener('waiting', handleWaiting);
    arabicAudio.addEventListener('canplay', handleCanPlay);
    arabicAudio.addEventListener('ended', handleArabicEnded);
    arabicAudio.addEventListener('error', handleArabicError);

    return () => {
      arabicAudio.pause();
      banglaAudio.pause();
      stopBanglaSpeech();

      arabicAudio.removeEventListener('timeupdate', handleTimeUpdate);
      arabicAudio.removeEventListener('durationchange', handleDurationChange);
      arabicAudio.removeEventListener('waiting', handleWaiting);
      arabicAudio.removeEventListener('canplay', handleCanPlay);
      arabicAudio.removeEventListener('ended', handleArabicEnded);
      arabicAudio.removeEventListener('error', handleArabicError);

      banglaAudio.removeEventListener('ended', handleBanglaEnded);
      banglaAudio.removeEventListener('error', handleBanglaError);

      arabicAudio.removeAttribute('src');
      banglaAudio.removeAttribute('src');
    };
  }, [onAyahAutoAdvance, speakBanglaTranslation, stopBanglaSpeech]);

  // Update speed
  useEffect(() => {
    if (arabicAudioRef.current) {
      arabicAudioRef.current.playbackRate = playbackSpeed;
    }
    if (banglaAudioRef.current) {
      banglaAudioRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  // Safe play helper
  const playAudio = useCallback(async () => {
    const audio = arabicAudioRef.current;
    if (!audio) return;

    try {
      setIsLoadingAudio(true);
      setAudioError(null);
      stopBanglaSpeech();

      if (pendingPlayPromiseRef.current) {
        try {
          await pendingPlayPromiseRef.current;
        } catch {
          // settled
        }
      }

      const promise = audio.play();
      pendingPlayPromiseRef.current = promise;
      await promise;
      setIsPlaying(true);
      setIsLoadingAudio(false);
    } catch (err: any) {
      setIsLoadingAudio(false);
      if (err.name === 'AbortError') return;
      if (err.name === 'NotAllowedError') {
        setIsPlaying(false);
        return;
      }
      console.warn('Audio play notice:', err.message);
      setIsPlaying(false);
    } finally {
      pendingPlayPromiseRef.current = null;
    }
  }, [stopBanglaSpeech]);

  // Safe pause helper
  const pauseAudio = useCallback(() => {
    if (arabicAudioRef.current) {
      arabicAudioRef.current.pause();
    }
    stopBanglaSpeech();
    setIsPlaying(false);
    setIsLoadingAudio(false);
  }, [stopBanglaSpeech]);

  // Load and play a specific Ayah with sequence mode support
  const loadAyahAudio = useCallback(
    async (ayah: Ayah, qari: Qari, shouldPlay: boolean = true) => {
      const audio = arabicAudioRef.current;
      if (!audio) return;

      stopBanglaSpeech();
      const urls = getAyahAudioUrls(qari, ayah.surahNumber, ayah.ayahNumber);
      urlsRef.current = urls;
      currentUrlIndexRef.current = 0;

      audio.pause();
      setIsPlaying(false);
      setCurrentTime(0);
      setAudioError(null);

      audio.src = urls[0];
      audio.load();

      if (!shouldPlay) return;

      const mode = sequenceModeRef.current;
      const shouldSpeakBangla = includeBanglaRef.current && ayah.bangla;

      // Mode 1: Bangla voice first, then Arabic
      if (mode === 'bangla_then_arabic' && shouldSpeakBangla) {
        speakBanglaTranslation(ayah.bangla, () => {
          playAudio();
        });
      }
      // Mode 2: Bangla only
      else if (mode === 'bangla_only' && shouldSpeakBangla) {
        speakBanglaTranslation(ayah.bangla, () => {
          if (repeatModeRef.current === 'one') {
            speakBanglaTranslation(ayah.bangla);
          } else if (repeatModeRef.current === 'continuous') {
            onAyahAutoAdvance();
          }
        });
      }
      // Mode 3 (Default): Arabic recitation first, then automatic Bangla translation
      else {
        await playAudio();
      }
    },
    [onAyahAutoAdvance, playAudio, speakBanglaTranslation, stopBanglaSpeech]
  );

  // Seek
  const seekTo = useCallback((time: number) => {
    const audio = arabicAudioRef.current;
    if (audio && !isNaN(time) && audio.duration) {
      const clamped = Math.max(0, Math.min(time, audio.duration));
      audio.currentTime = clamped;
      setCurrentTime(clamped);
    }
  }, []);

  return {
    arabicAudioRef,
    banglaAudioRef,
    isPlaying,
    isLoadingAudio,
    isSpeakingBangla,
    includeBanglaTranslation,
    setIncludeBanglaTranslation,
    voiceSequenceMode,
    setVoiceSequenceMode,
    speakBanglaTranslation,
    stopBanglaSpeech,
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
    setRepeatMode,
    currentUrl: urlsRef.current[currentUrlIndexRef.current] || ''
  };
}
