import { COACHING_QUESTIONS, COACHING_PARTS } from "@/data/coachingQuestions";
import type { QuestionAnswer } from "@/store/coachingStore";

interface Props {
  currentQuestion: number;
  answers: Record<number, QuestionAnswer>;
  onSelect: (questionId: number) => void;
  open: boolean;
  onClose: () => void;
}

export default function QuestionNav({
  currentQuestion,
  answers,
  onSelect,
  open,
  onClose,
}: Props) {
  if (!open) return null;

  const isAnswered = (id: number) => {
    const a = answers[id];
    return a && ((a.text && a.text.trim().length > 0) || a.voice);
  };

  return (
    <>
      {/* 배경 오버레이 */}
      <div
        className="fixed inset-0 bg-black/30 z-40 lg:hidden"
        onClick={onClose}
      />

      {/* 네비게이션 패널 */}
      <div className="fixed right-0 top-0 bottom-0 w-[320px] max-w-[85vw] bg-white border-l border-border shadow-2xl z-50 overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-border px-5 py-4 flex items-center justify-between">
          <h3 className="font-bold text-[#1E2D8C] text-base">
            📋 전체 문항 목록
          </h3>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#F0EFFB] flex items-center justify-center text-foreground/50 hover:text-foreground transition-colors"
            aria-label="닫기"
          >
            ✕
          </button>
        </div>

        <div className="p-5 space-y-6">
          {COACHING_PARTS.map((part) => {
            const partQuestions = COACHING_QUESTIONS.filter(
              (q) => q.part === part.key,
            );
            const answeredCount = partQuestions.filter((q) =>
              isAnswered(q.id),
            ).length;

            return (
              <div key={part.key}>
                {/* 파트 헤더 */}
                <div className="mb-3">
                  <p className="text-xs font-bold text-[#C4A265] tracking-wider uppercase">
                    {part.questionRange}
                  </p>
                  <p className="text-sm font-bold text-foreground/80 mt-0.5 break-keep">
                    {part.title}
                  </p>
                  <p className="text-xs text-foreground/40 mt-0.5">
                    {answeredCount} / {partQuestions.length} 완료
                  </p>
                </div>

                {/* 질문 그리드 */}
                <div className="grid grid-cols-5 gap-2">
                  {partQuestions.map((q) => {
                    const answered = isAnswered(q.id);
                    const isCurrent = q.id === currentQuestion;

                    return (
                      <button
                        key={q.id}
                        onClick={() => {
                          onSelect(q.id);
                          onClose();
                        }}
                        className={`
                          w-full aspect-square rounded-xl text-sm font-bold transition-all
                          flex items-center justify-center
                          ${isCurrent
                            ? "bg-[#1E2D8C] text-white ring-2 ring-[#1E2D8C]/30 ring-offset-2 shadow-md"
                            : answered
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                              : "bg-[#F0EFFB] text-foreground/40 hover:bg-[#F0EFFB]/80 hover:text-foreground/60"
                          }
                        `}
                      >
                        {q.id}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* 범례 */}
        <div className="sticky bottom-0 bg-white border-t border-border px-5 py-3 flex items-center gap-4 text-xs text-foreground/50">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-[#1E2D8C]" /> 현재
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-emerald-50 border border-emerald-200" /> 완료
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-[#F0EFFB]" /> 미답변
          </span>
        </div>
      </div>
    </>
  );
}
