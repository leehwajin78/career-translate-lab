import { COACHING_PARTS, COACHING_QUESTIONS } from "@/data/coachingQuestions";

interface Props {
  currentQuestion: number;
  completedCount: number;
  total: number;
  progress: number;
}

export default function ProgressHeader({
  currentQuestion,
  completedCount,
  total,
  progress,
}: Props) {
  const q = COACHING_QUESTIONS[currentQuestion - 1];
  const part = COACHING_PARTS.find((p) => p.key === q?.part);

  return (
    <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b border-border pb-4 pt-4 mb-8">
      <div className="flex items-center justify-between text-sm text-foreground/60 mb-2">
        <span className="font-medium break-keep">
          {part?.title ?? ""} · {currentQuestion} / {total}
        </span>
        <span className="flex items-center gap-2">
          <span className="text-[#1E2D8C] font-bold">{completedCount}</span>
          <span>문항 완료</span>
          <span className="font-mono text-[#C4A265] font-bold">
            {progress}%
          </span>
        </span>
      </div>

      {/* 프로그레스 바 */}
      <div className="h-2 bg-[#F0EFFB] rounded-full relative overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#1E2D8C] to-[#1E2D8C]/70 rounded-full transition-all duration-700 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
