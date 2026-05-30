import { useState, useRef, useEffect, useCallback } from "react";
import { base64ToBlob } from "@/lib/audioRecorder";

interface Props {
  /** base64 audio data */
  src: string;
  duration: number;
}

export default function VoicePlayer({ src, duration }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const urlRef = useRef<string>("");

  useEffect(() => {
    const blob = base64ToBlob(src);
    urlRef.current = URL.createObjectURL(blob);
    return () => {
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    };
  }, [src]);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
    } else {
      audio.play();
    }
    setPlaying(!playing);
  }, [playing]);

  const handleTimeUpdate = useCallback(() => {
    if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
  }, []);

  const handleEnded = useCallback(() => {
    setPlaying(false);
    setCurrentTime(0);
  }, []);

  const fmt = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const pct = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="flex items-center gap-4 bg-[#F0EFFB] rounded-2xl px-5 py-4">
      <audio
        ref={audioRef}
        src={urlRef.current}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        preload="metadata"
      />

      {/* 재생/일시정지 버튼 */}
      <button
        onClick={toggle}
        className="shrink-0 w-12 h-12 rounded-full bg-[#1E2D8C] text-white flex items-center justify-center hover:bg-[#1E2D8C]/85 transition-colors shadow-md"
        aria-label={playing ? "일시정지" : "재생"}
      >
        {playing ? (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <rect x="3" y="2" width="4" height="12" rx="1" />
            <rect x="9" y="2" width="4" height="12" rx="1" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M4 2.5L13 8L4 13.5V2.5Z" />
          </svg>
        )}
      </button>

      {/* 진행 바 */}
      <div className="flex-1">
        <div className="h-2 bg-[#1E2D8C]/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#1E2D8C] rounded-full transition-all duration-200"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="flex justify-between mt-1.5 text-xs text-foreground/50 font-mono">
          <span>{fmt(currentTime)}</span>
          <span>{fmt(duration)}</span>
        </div>
      </div>
    </div>
  );
}
