import React, { useState, useRef, useEffect } from 'react';
import { Volume2, Play, Pause, Loader2, RotateCcw, RotateCw, SlidersHorizontal } from 'lucide-react';

interface AudioPlayerButtonProps {
  textToSpeak?: string;
  audioUrl?: string; // Libsyn podcast MP3 enclosure
  label?: string;
  className?: string;
  variant?: 'subtle' | 'primary' | 'outline' | 'pill';
  size?: 'sm' | 'md' | 'lg';
  showSeekBar?: boolean; // Enable expanded seek bar mode with draggable slider
}

export const AudioPlayerButton: React.FC<AudioPlayerButtonProps> = ({
  textToSpeak,
  audioUrl,
  label,
  className = '',
  variant = 'primary',
  size = 'md',
  showSeekBar = false,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [isExpanded, setIsExpanded] = useState(showSeekBar);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize or update audio object
  useEffect(() => {
    if (audioUrl) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onplay = () => {
        setIsLoading(false);
        setIsPlaying(true);
      };

      audio.onpause = () => {
        setIsPlaying(false);
      };

      audio.onended = () => {
        setIsPlaying(false);
        setCurrentTime(0);
      };

      audio.ontimeupdate = () => {
        setCurrentTime(audio.currentTime);
      };

      audio.onloadedmetadata = () => {
        setDuration(audio.duration || 0);
      };

      audio.onerror = () => {
        setIsLoading(false);
        setIsPlaying(false);
      };

      return () => {
        audio.pause();
      };
    }
  }, [audioUrl]);

  // Handle Play/Pause
  const togglePlay = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    if (audioUrl && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        setIsLoading(true);
        audioRef.current.playbackRate = playbackRate;
        audioRef.current.play().catch(() => {
          setIsLoading(false);
          setIsPlaying(false);
          if (textToSpeak) playTTS(textToSpeak);
        });
      }
      return;
    }

    if (textToSpeak) {
      playTTS(textToSpeak);
    }
  };

  const playTTS = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = playbackRate;

      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);

      window.speechSynthesis.speak(utterance);
    }
  };

  // Seek handler for draggable range bar
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const targetTime = parseFloat(e.target.value);
    setCurrentTime(targetTime);
    if (audioRef.current) {
      audioRef.current.currentTime = targetTime;
    }
  };

  // Fast forward / Rewind 10 seconds
  const handleSkip = (seconds: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (audioRef.current) {
      const newTime = Math.min(Math.max(0, audioRef.current.currentTime + seconds), duration || 9999);
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  // Change Speed (0.8x -> 1.0x -> 1.25x -> 1.5x)
  const toggleSpeed = (e: React.MouseEvent) => {
    e.stopPropagation();
    const speeds = [0.8, 1.0, 1.25, 1.5];
    const nextIdx = (speeds.indexOf(playbackRate) + 1) % speeds.length;
    const newRate = speeds[nextIdx];
    setPlaybackRate(newRate);
    if (audioRef.current) {
      audioRef.current.playbackRate = newRate;
    }
  };

  const formatTime = (timeSec: number) => {
    if (isNaN(timeSec) || timeSec <= 0) return '00:00';
    const mins = Math.floor(timeSec / 60);
    const secs = Math.floor(timeSec % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const baseStyle =
    'inline-flex items-center justify-center font-bold font-mono transition-all duration-150 focus:outline-none cursor-pointer uppercase';

  const sizeStyles = {
    sm: 'px-2.5 py-1 text-[11px] gap-1.5',
    md: 'px-3.5 py-1.5 text-xs gap-2',
    lg: 'px-4 py-2 text-xs gap-2',
  };

  const variantStyles = {
    primary: 'bg-[#1A1A1A] text-white hover:bg-[#333] border border-[#1A1A1A]',
    subtle: 'bg-[#FFD700] text-[#1A1A1A] hover:bg-[#f1ca00] border border-[#1A1A1A]',
    outline: 'border border-[#1A1A1A] text-[#1A1A1A] bg-white hover:bg-[#FAF9F6]',
    pill: 'bg-[#F2F0EB] text-[#1A1A1A] hover:bg-[#FAF9F6] border border-[#1A1A1A]',
  };

  // Render full expanded Audio Seek Bar Component
  if (isExpanded && audioUrl) {
    const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

    return (
      <div className={`bg-[#1A1A1A] text-white p-3 sm:p-4 border border-[#1A1A1A] shadow-[4px_4px_0px_#1A1A1A] space-y-3 ${className}`}>
        {/* Upper row: Play button, title & controls */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={togglePlay}
              className="w-10 h-10 bg-[#FFD700] text-[#1A1A1A] hover:bg-[#f1ca00] flex items-center justify-center font-bold border border-[#1A1A1A] shrink-0 transition-transform active:scale-95 cursor-pointer"
              title={isPlaying ? '暂停' : '播放广播原声'}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : isPlaying ? (
                <Pause className="w-5 h-5 fill-current" />
              ) : (
                <Play className="w-5 h-5 fill-current ml-0.5" />
              )}
            </button>

            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#FFD700] block">
                AUDIO PLAYER · PODCAST ENCLOSURE
              </span>
              <p className="text-xs font-serif italic text-slate-200">
                {isPlaying ? '正在播放 Podcast 原声广播...' : '点击播放体验原汁原味美音连读发音'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0 font-mono text-xs">
            {/* Rewind -10s */}
            <button
              type="button"
              onClick={(e) => handleSkip(-10, e)}
              className="p-1.5 bg-[#2A2A2A] hover:bg-[#333] text-slate-200 border border-slate-700 transition-colors cursor-pointer"
              title="倒退 10 秒"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Fast Forward +10s */}
            <button
              type="button"
              onClick={(e) => handleSkip(10, e)}
              className="p-1.5 bg-[#2A2A2A] hover:bg-[#333] text-slate-200 border border-slate-700 transition-colors cursor-pointer"
              title="快进 10 秒"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>

            {/* Playback speed multiplier button */}
            <button
              type="button"
              onClick={toggleSpeed}
              className="px-2 py-1 bg-[#2A2A2A] hover:bg-[#333] text-[#FFD700] border border-slate-700 font-bold text-[11px] cursor-pointer"
              title="切换播放语速"
            >
              {playbackRate}x
            </button>
          </div>
        </div>

        {/* Lower row: Draggable Seek Progress Slider */}
        <div className="space-y-1 font-mono">
          <div className="relative flex items-center">
            <input
              type="range"
              min={0}
              max={duration || 100}
              step={0.1}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-2 bg-slate-700 rounded-none appearance-none cursor-pointer accent-[#FFD700] focus:outline-none"
              style={{
                background: `linear-gradient(to right, #FFD700 0%, #FFD700 ${progressPercent}%, #334155 ${progressPercent}%, #334155 100%)`,
              }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>
    );
  }

  // Standard Compact Button View (With optional toggle to expand seekbar)
  return (
    <div className="inline-flex items-center gap-1.5">
      <button
        type="button"
        onClick={togglePlay}
        className={`${baseStyle} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
        title={audioUrl ? '播放PodCast原声/发音' : '朗读发音'}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-current" />
        ) : isPlaying ? (
          <Pause className="w-4 h-4 text-current animate-pulse fill-current" />
        ) : (
          <Volume2 className="w-4 h-4 text-current" />
        )}
        {label && <span>{isPlaying ? '播放中...' : label}</span>}
      </button>

      {audioUrl && !showSeekBar && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
          className="p-1.5 text-xs bg-[#FAF9F6] text-[#1A1A1A] hover:bg-[#F2F0EB] border border-[#1A1A1A] cursor-pointer"
          title="展开/收起可拖动进度条播放器"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
