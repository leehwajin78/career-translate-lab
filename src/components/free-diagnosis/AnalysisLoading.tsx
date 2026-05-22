import { useState, useEffect } from "react";
import { useFreeDiagnosticStore } from "@/store/freeDiagnosticStore";

const MESSAGES = [
  "30년의 경험을 분석하고 있어요",
  "숨겨진 강점을 발굴하고 있어요",
  "당신만의 차별화 포인트를 찾고 있어요",
  "경력 가치 레포트를 생성 중이에요",
];

const DURATION = 12000; // 12초
const MSG_INTERVAL = 3000; // 3초

interface Props {
  onComplete: () => void;
}

export default function AnalysisLoading({ onComplete }: Props) {
  const { analyze } = useFreeDiagnosticStore();
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const msgTimer = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % MESSAGES.length);
    }, MSG_INTERVAL);

    const completeTimer = setTimeout(() => {
      analyze();
      onComplete();
    }, DURATION);

    return () => {
      clearInterval(msgTimer);
      clearTimeout(completeTimer);
    };
  }, [analyze, onComplete]);

  return (
    <div className="container-prose py-16 md:py-24 flex flex-col items-center justify-center min-h-[60vh] fade-in">
      {/* Pulse Spinner */}
      <div className="pulse-spinner mb-10">
        <div className="ring" />
        <div className="ring" />
        <div className="ring" />
        <div className="core" />
      </div>

      {/* Main Text */}
      <h2 className="font-serif text-2xl md:text-3xl text-primary text-center">
        AI가 경력 가치를 분석 중입니다...
      </h2>

      {/* Rotating Sub Text */}
      <p className="mt-6 text-base text-muted-foreground text-center text-fade-in" key={msgIndex}>
        {MESSAGES[msgIndex]}
      </p>

      {/* Progress Bar */}
      <div className="mt-10 w-full max-w-md">
        <div className="h-1.5 bg-border rounded-full overflow-hidden">
          <div className="h-full bg-accent rounded-full progress-animate" />
        </div>
      </div>

      {/* Bottom Text */}
      <p className="mt-8 text-xs text-muted-foreground/70">
        약 1~2분 소요됩니다. 창을 닫지 마세요.
      </p>
    </div>
  );
}
