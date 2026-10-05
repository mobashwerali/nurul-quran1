import React, { useRef } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Repeat,
  Repeat1,
  User,
  AlertCircle,
  RefreshCw,
  Volume2
} from 'lucide-react';
import { Qari, Ayah } from '../types/quran';
import { VoiceSequenceMode } from '../hooks/useQuranAudio';

interface AudioPlayerBarProps {
  currentAyah: Ayah | null;
  surahNameBangla: string;
  activeQari: Qari;
  isPlaying: boolean;
  isLoadingAudio: boolean;
  isSpeakingBangla: boolean;
  includeBanglaTranslation: boolean;
  voiceSequenceMode: VoiceSequenceMode;
  currentTime: number;
  duration: number;
  playbackSpeed: number;
  repeatMode: 'none' | 'one' | 'continuous';
  audioError: string | null;
  onTogglePlay: () => void;
  onNextAyah: () => void;
  onPrevAyah: () => void;
  onToggleRepeatMode: () => void;
  onToggleIncludeBangla: () => void;
  onChangeSequenceMode: (mode: VoiceSequenceMode) => void;
  onChangeSpeed: (speed: number) => void;
  onOpenQariModal: () => void;
  onSeek: (time: number) => void;
  onRetryPlay?: () => void;
}

export const AudioPlayerBar: React.FC<AudioPlayerBarProps> = ({
  currentAyah,
  surahNameBangla,
  activeQari,
  isPlaying,
  isLoadingAudio,
  isSpeakingBangla,
  includeBanglaTranslation,
  voiceSequenceMode,
  currentTime,
  duration,
  playbackSpeed,
  repeatMode,
  audioError,
  onTogglePlay,
  onNextAyah,
  onPrevAyah,
  onToggleRepeatMode,
  onToggleIncludeBangla,
  onChangeSequenceMode,
  onChangeSpeed,
  onOpenQariModal,
  onSeek,
  onRetryPlay
}) => {
  const progressBarRef = useRef<HTMLDivElement>(null);

  // Format seconds to mm:ss
  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || !duration) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const clampedPos = Math.max(0, Math.min(1, pos));
    onSeek(clampedPos * duration);
  };

  const speedOptions = [0.75, 1.0, 1.25];

  // Cycle sequence mode
  const handleCycleMode = () => {
    if (!includeBanglaTranslation) {
      onToggleIncludeBangla();
      onChangeSequenceMode('arabic_then_bangla');
      return;
    }
    if (voiceSequenceMode === 'arabic_then_bangla') {
      onChangeSequenceMode('bangla_then_arabic');
    } else if (voiceSequenceMode === 'bangla_then_arabic') {
      onChangeSequenceMode('bangla_only');
    } else if (voiceSequenceMode === 'bangla_only') {
      onToggleIncludeBangla();
      onChangeSequenceMode('arabic_only');
    } else {
      onToggleIncludeBangla();
      onChangeSequenceMode('arabic_then_bangla');
    }
  };

  const getModeLabel = () => {
    if (!includeBanglaTranslation || voiceSequenceMode === 'arabic_only') {
      return 'শুধু আরবি';
    }
    if (voiceSequenceMode === 'arabic_then_bangla') {
      return 'আরবি ➔ বাংলা অর্থ';
    }
    if (voiceSequenceMode === 'bangla_then_arabic') {
      return 'বাংলা অর্থ ➔ আরবি';
    }
    if (voiceSequenceMode === 'bangla_only') {
      return 'শুধু বাংলা অর্থ';
    }
    return 'অটো বাংলা অর্থ';
  };

  return (
    <div
      id="audio-player-bar"
      className="fixed bottom-0 left-0 right-0 z-50 bg-[#061513]/95 backdrop-blur-md border-t border-[#D4AF37]/30 shadow-2xl shadow-black"
    >
      {/* Optional Error Alert Banner */}
      {audioError && (
        <div className="bg-red-950/80 border-b border-red-500/30 px-4 py-1.5 flex items-center justify-between text-xs text-red-200">
          <div className="flex items-center gap-1.5 truncate">
            <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
            <span className="truncate">{audioError}</span>
          </div>
          {onRetryPlay && (
            <button
              onClick={onRetryPlay}
              className="text-[#D4AF37] hover:underline shrink-0 ml-2 font-bangla flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              <span>পুনরায় চেষ্টা</span>
            </button>
          )}
        </div>
      )}

      {/* Progress bar scrub rail */}
      <div
        ref={progressBarRef}
        onClick={handleSeek}
        className="w-full h-1.5 bg-[#0B2A24] cursor-pointer relative group"
      >
        <div
          className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F3D78A] relative transition-all"
          style={{
            width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%`
          }}
        >
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-[#FBF9F5] border-2 border-[#D4AF37] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex items-center justify-between gap-3">
        {/* Left: Current Ayah & Status */}
        <div className="flex items-center gap-3 min-w-0 max-w-[32%] sm:max-w-[36%]">
          {/* Animated sound bars when playing */}
          <div className="hidden sm:flex items-end gap-0.5 h-6 w-5 shrink-0">
            <span
              className={`w-1 bg-[#D4AF37] rounded-full transition-all ${
                isPlaying || isSpeakingBangla ? 'animate-pulse h-5' : 'h-2 opacity-40'
              }`}
            />
            <span
              className={`w-1 bg-[#D4AF37] rounded-full transition-all ${
                isPlaying || isSpeakingBangla ? 'animate-bounce h-6' : 'h-3 opacity-40'
              }`}
            />
            <span
              className={`w-1 bg-[#D4AF37] rounded-full transition-all ${
                isPlaying || isSpeakingBangla ? 'animate-pulse h-4' : 'h-1.5 opacity-40'
              }`}
            />
          </div>

          <div className="min-w-0">
            <div className="text-xs sm:text-sm font-semibold text-[#F3EFE6] font-bangla truncate">
              {isSpeakingBangla ? (
                <span className="text-[#FDE68A] flex items-center gap-1.5 animate-pulse font-bold">
                  <Volume2 className="w-4 h-4 shrink-0 text-[#D4AF37]" />
                  বাংলা তরজমা মুখে বলা হচ্ছে...
                </span>
              ) : currentAyah ? (
                `সূরা ${surahNameBangla} • আয়াত ${currentAyah.ayahNumber}`
              ) : (
                'কোনো আয়াত নির্বাচিত নেই'
              )}
            </div>
            <button
              onClick={onOpenQariModal}
              className="text-[11px] sm:text-xs text-[#D4AF37] hover:underline cursor-pointer truncate flex items-center gap-1 font-bangla"
            >
              <User className="w-3 h-3 shrink-0" />
              <span className="truncate">{activeQari.nameBangla}</span>
            </button>
          </div>
        </div>

        {/* Center: Controls */}
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Prev Ayah */}
            <button
              onClick={onPrevAyah}
              className="p-1.5 sm:p-2 text-[#C5BBAA] hover:text-[#F3EFE6] hover:bg-[#0E352F] rounded-lg transition-colors cursor-pointer"
              title="পূর্ববর্তী আয়াত"
            >
              <SkipBack className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Play/Pause Main Button */}
            <button
              onClick={onTogglePlay}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#D4AF37] hover:bg-[#E5C158] text-[#081816] flex items-center justify-center transition-all cursor-pointer shadow-lg shadow-[#D4AF37]/25 hover:scale-105 active:scale-95"
              title={isPlaying || isSpeakingBangla ? 'বিরতি দিন' : 'তিলাওয়াত শুরু করুন'}
            >
              {isLoadingAudio ? (
                <RefreshCw className="w-5 h-5 animate-spin text-[#081816]" />
              ) : isPlaying || isSpeakingBangla ? (
                <Pause className="w-5 h-5 fill-current" />
              ) : (
                <Play className="w-5 h-5 fill-current translate-x-0.5" />
              )}
            </button>

            {/* Next Ayah */}
            <button
              onClick={onNextAyah}
              className="p-1.5 sm:p-2 text-[#C5BBAA] hover:text-[#F3EFE6] hover:bg-[#0E352F] rounded-lg transition-colors cursor-pointer"
              title="পরবর্তী আয়াত"
            >
              <SkipForward className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* Time tracker */}
          <div className="text-[10px] sm:text-xs font-mono text-[#8E9B97] tabular-nums">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        </div>

        {/* Right: Automatic Bangla Speech Sequence Toggle, Repeat Mode & Speed Control */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Automatic Bangla Translation Sequence Button */}
          <button
            onClick={handleCycleMode}
            className={`px-2.5 py-1.5 rounded-lg border text-xs font-bangla transition-all cursor-pointer flex items-center gap-1.5 ${
              includeBanglaTranslation && voiceSequenceMode !== 'arabic_only'
                ? 'bg-[#D4AF37] text-[#081816] font-bold border-[#D4AF37] shadow-md shadow-[#D4AF37]/20'
                : 'border-[#D4AF37]/20 text-[#8E9B97] hover:text-[#F3EFE6] bg-[#0A221E]'
            }`}
            title="ক্লিক করে মোড পরিবর্তন করুন (আরবি ➔ বাংলা, আগে বাংলা ➔ আরবি, ইত্যাদি)"
          >
            <Volume2 className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden md:inline">অটো বাংলা অর্থ:</span>
            <span>{getModeLabel()}</span>
          </button>

          {/* Repeat Mode */}
          <button
            onClick={onToggleRepeatMode}
            className={`p-1.5 sm:p-2 rounded-lg border transition-colors cursor-pointer text-xs flex items-center gap-1 font-bangla ${
              repeatMode === 'one'
                ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#D4AF37]'
                : repeatMode === 'continuous'
                ? 'bg-[#0E352F] border-[#D4AF37]/40 text-[#F3EFE6]'
                : 'border-transparent text-[#8E9B97] hover:text-[#F3EFE6]'
            }`}
            title={
              repeatMode === 'one'
                ? 'বর্তমান আয়াত বারবার চলবে (Loop)'
                : repeatMode === 'continuous'
                ? 'ধারাবাহিক তিলাওয়াত চলবে (Continuous)'
                : 'একবার চলবে (No Repeat)'
            }
          >
            {repeatMode === 'one' ? (
              <Repeat1 className="w-4 h-4 text-[#D4AF37]" />
            ) : (
              <Repeat className="w-4 h-4" />
            )}
            <span className="hidden lg:inline text-[11px]">
              {repeatMode === 'one'
                ? 'রিপিট'
                : repeatMode === 'continuous'
                ? 'ধারাবাহিক'
                : 'একবার'}
            </span>
          </button>

          {/* Playback speed toggle */}
          <div className="hidden sm:flex items-center rounded-lg bg-[#0A221E] border border-[#D4AF37]/20 p-0.5">
            {speedOptions.map((speed) => (
              <button
                key={speed}
                onClick={() => onChangeSpeed(speed)}
                className={`px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs font-mono rounded cursor-pointer transition-colors ${
                  playbackSpeed === speed
                    ? 'bg-[#D4AF37] text-[#081816] font-bold'
                    : 'text-[#8E9B97] hover:text-[#F3EFE6]'
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
