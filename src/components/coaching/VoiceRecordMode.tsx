import { useState, useRef, useCallback, useEffect } from "react";
import { AudioRecorder } from "@/lib/audioRecorder";
import type { VoiceRecording } from "@/store/coachingStore";
import VoicePlayer from "./VoicePlayer";

interface Props {
  voice?: VoiceRecording;
  text?: string;
  onSave: (voice: VoiceRecording) => void;
  onRemove: () => void;
  onSaveText?: (text: string) => void;
  disabled?: boolean;
}

const MAX_SECONDS = 180; // 3분 제한

export default function VoiceRecordMode({
  voice,
  text,
  onSave,
  onRemove,
  onSaveText,
  disabled,
}: Props) {
  const [state, setState] = useState<"idle" | "recording" | "done">(
    voice ? "done" : "idle",
  );
  const [elapsed, setElapsed] = useState(0);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [transcript, setTranscript] = useState(text || "");
  
  const recorderRef = useRef(new AudioRecorder());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const recognitionRef = useRef<any>(null);

  // Sync text from store when not recording
  useEffect(() => {
    if (state !== "recording") {
      setTranscript(text || "");
    }
  }, [text, state]);

  // 파형 애니메이션
  const drawWaveform = useCallback(() => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    if (!canvas || !analyser) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const barWidth = (w / bufferLength) * 2.5;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      const barHeight = (dataArray[i] / 255) * h * 0.8;
      const gradient = ctx.createLinearGradient(0, h, 0, h - barHeight);
      gradient.addColorStop(0, "rgba(30, 45, 140, 0.3)");
      gradient.addColorStop(1, "rgba(30, 45, 140, 0.8)");
      ctx.fillStyle = gradient;
      ctx.fillRect(x, h - barHeight, barWidth - 1, barHeight);
      x += barWidth + 1;
    }

    animRef.current = requestAnimationFrame(drawWaveform);
  }, []);

  // 녹음 중지
  const stopRecording = useCallback(async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    cancelAnimationFrame(animRef.current);

    // Stop Speech Recognition
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        console.error("Failed to stop speech recognition:", err);
      }
    }

    try {
      const result = await recorderRef.current.stop();
      const recording: VoiceRecording = {
        data: result.base64,
        mimeType: result.mimeType,
        duration: result.duration,
        recordedAt: new Date().toISOString(),
      };
      onSave(recording);
      setState("done");
    } catch {
      setState("idle");
    }
  }, [onSave]);

  // 녹음 시작
  const startRecording = useCallback(async () => {
    try {
      const hasPermission = await recorderRef.current.requestPermission();
      if (!hasPermission) {
        setPermissionDenied(true);
        return;
      }
      setPermissionDenied(false);
      setElapsed(0);
      
      // Reset transcript for new recording
      setTranscript("");
      if (onSaveText) {
        onSaveText("");
      }
      
      setState("recording");

      await recorderRef.current.start((analyser) => {
        analyserRef.current = analyser;
        drawWaveform();
      });

      // Start Web Speech API Speech Recognition
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "ko-KR";

        recognition.onresult = (event: any) => {
          let transcriptText = "";
          for (let i = 0; i < event.results.length; i++) {
            transcriptText += event.results[i][0].transcript;
          }
          setTranscript(transcriptText);
          if (onSaveText) {
            onSaveText(transcriptText);
          }
        };

        recognition.onerror = (event: any) => {
          console.error("Speech recognition error:", event.error);
        };

        recognitionRef.current = recognition;
        recognition.start();
      }

      timerRef.current = setInterval(() => {
        setElapsed((prev) => {
          if (prev >= MAX_SECONDS - 1) {
            stopRecording();
            return MAX_SECONDS;
          }
          return prev + 1;
        });
      }, 1000);
    } catch {
      setPermissionDenied(true);
    }
  }, [drawWaveform, onSaveText, stopRecording]);

  // 재녹음
  const reRecord = useCallback(() => {
    onRemove();
    setTranscript("");
    if (onSaveText) {
      onSaveText("");
    }
    setState("idle");
  }, [onRemove, onSaveText]);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      cancelAnimationFrame(animRef.current);
      recorderRef.current.cancel();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          console.error("Speech recognition stop on unmount failed:", e);
        }
      }
    };
  }, []);

  const fmt = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  // ─── 마이크 권한 거부 상태 ───
  if (permissionDenied) {
    return (
      <div className="rounded-2xl border-2 border-dashed border-error-border bg-error-bg p-6 text-center">
        <p className="text-base font-bold text-destructive mb-2">
          🎤 마이크 사용 권한이 필요합니다
        </p>
        <p className="text-sm text-destructive/80 leading-relaxed break-keep mb-4">
          브라우저 설정에서 이 사이트의 마이크 접근을 허용해 주세요.
          <br />
          허용 후 아래 버튼을 다시 눌러주시면 됩니다.
        </p>
        <button
          onClick={() => {
            setPermissionDenied(false);
            startRecording();
          }}
          className="bg-[#1E2D8C] text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-[#1E2D8C]/90 transition-colors"
        >
          다시 시도하기
        </button>
      </div>
    );
  }

  // ─── 녹음 완료 → 재생 및 편집 모드 ───
  if (state === "done" && voice) {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    return (
      <div className="space-y-4">
        <VoicePlayer src={voice.data} duration={voice.duration} />
        
        {/* Transcript Text Area Editor */}
        <div className="space-y-2 mt-4 bg-white/50 border border-border p-5 rounded-2xl shadow-soft">
          <div className="flex items-center justify-between">
            <label htmlFor="transcript" className="text-sm font-bold text-[#1E2D8C] flex items-center gap-1.5">
              <span>📝 음성 인식 내용</span>
            </label>
            <span className="text-[11px] text-foreground/40">
              {SpeechRecognition ? "* 틀린 내용을 직접 수정해 주세요." : "* 직접 텍스트를 적어보세요."}
            </span>
          </div>
          <textarea
            id="transcript"
            className="w-full min-h-[120px] p-4 text-base rounded-xl border border-input bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-[#1E2D8C]/15 focus:border-[#1E2D8C] transition-all leading-relaxed placeholder:text-muted-foreground/50"
            placeholder={
              SpeechRecognition
                ? "여기에 녹음 내용이 텍스트로 자동 입력됩니다. 필요 시 직접 수정할 수도 있습니다."
                : "이 브라우저는 음성 텍스트 변환을 지원하지 않습니다. 필요시 직접 기재해 주세요."
            }
            value={transcript}
            onChange={(e) => {
              const val = e.target.value;
              setTranscript(val);
              if (onSaveText) {
                onSaveText(val);
              }
            }}
            disabled={disabled}
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={reRecord}
            disabled={disabled}
            className="flex items-center gap-2 text-sm text-[#1E2D8C]/70 hover:text-[#1E2D8C] font-medium transition-colors disabled:opacity-50"
          >
            🔄 다시 녹음하기
          </button>
          <span className="text-foreground/20">|</span>
          <span className="text-sm text-emerald-600 font-medium flex items-center gap-1">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M3 8.5L6.5 12L13 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            저장 완료
          </span>
        </div>
      </div>
    );
  }

  // ─── 녹음 중 ───
  if (state === "recording") {
    return (
      <div className="rounded-2xl border-2 border-red-200 bg-red-50/30 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
            <span className="text-base font-bold text-red-600">녹음 중...</span>
          </div>
          <span className="font-mono text-lg text-foreground/70">
            {fmt(elapsed)} / {fmt(MAX_SECONDS)}
          </span>
        </div>

        {/* 파형 시각화 */}
        <canvas
          ref={canvasRef}
          width={600}
          height={80}
          className="w-full h-16 rounded-xl bg-white/50 mb-4"
        />

        {/* Real-time speech transcript bubble */}
        {transcript && (
          <div className="mb-4 p-4 rounded-xl bg-white/60 border border-[#1E2D8C]/5 text-[#1E2D8C]/80 text-sm leading-relaxed whitespace-pre-wrap max-h-[120px] overflow-y-auto shadow-inner">
            <span className="font-bold text-xs text-[#1E2D8C]/60 block mb-1">인식된 텍스트:</span>
            {transcript}
          </div>
        )}

        <div className="flex items-center justify-center">
          <button
            onClick={stopRecording}
            className="flex items-center gap-2 bg-red-500 text-white px-8 py-4 rounded-2xl text-base font-bold hover:bg-red-600 transition-colors shadow-lg"
          >
            <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
              <rect x="3" y="3" width="10" height="10" rx="2" />
            </svg>
            녹음 중지
          </button>
        </div>

        <p className="text-center text-sm text-foreground/40 mt-3">
          최대 {MAX_SECONDS / 60}분까지 녹음할 수 있습니다
        </p>
      </div>
    );
  }

  // ─── 대기 상태 (녹음 시작 전) ───
  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  return (
    <div className="rounded-2xl border-2 border-dashed border-[#1E2D8C]/15 bg-[#F0EFFB]/30 p-8 text-center">
      <button
        onClick={startRecording}
        disabled={disabled}
        className="w-20 h-20 rounded-full bg-[#1E2D8C] text-white flex items-center justify-center mx-auto hover:bg-[#1E2D8C]/85 transition-all shadow-xl hover:shadow-2xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="녹음 시작"
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          <line x1="12" x2="12" y1="19" y2="22" />
        </svg>
      </button>

      <p className="mt-4 text-base font-bold text-[#1E2D8C]/70">
        버튼을 누르면 녹음이 시작됩니다
      </p>
      <p className="mt-2 text-sm text-foreground/40 leading-relaxed break-keep">
        편하게 말씀하세요. 녹음과 함께 음성이 자동으로 텍스트로 인식됩니다.
        <br />
        {SpeechRecognition ? "녹음 종료 후 인식된 텍스트를 보며 수정할 수 있습니다." : "최대 3분까지 녹음 가능합니다."}
      </p>
    </div>
  );
}
