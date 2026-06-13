import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useCoachingStore } from "@/store/coachingStore";
import {
  COACHING_QUESTIONS,
  COACHING_PARTS,
  TOTAL_QUESTIONS,
} from "@/data/coachingQuestions";
import VoicePlayer from "@/components/coaching/VoicePlayer";

export default function CoachingReview() {
  const navigate = useNavigate();
  const member = useAuthStore((s) => s.currentMember);
  const { getSession, getCompletedCount, submit, setCurrentQuestion } =
    useCoachingStore();
  const [showConfirm, setShowConfirm] = useState(false);

  if (!member) {
    navigate("/login");
    return null;
  }

  const session = getSession(member.id);
  const completedCount = getCompletedCount(member.id);
  const unansweredCount = TOTAL_QUESTIONS - completedCount;
  const isSubmitted = session.status !== "in-progress";

  const handleSubmit = () => {
    setShowConfirm(false);
    navigate("/coaching/analyzing");
  };

  const goToQuestion = (id: number) => {
    setCurrentQuestion(member.id, id);
    navigate("/coaching/questions");
  };

  // 이미 제출된 상태라면 대시보드로 이동
  if (isSubmitted) {
    navigate("/coaching");
    return null;
  }

  return (
    <div className="container-prose py-10 md:py-16 fade-in">
      <div className="max-w-3xl mx-auto">
        {/* 헤더 */}
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={() => navigate("/coaching/questions")}
            className="text-foreground/40 hover:text-foreground transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="font-serif text-2xl md:text-3xl text-primary font-extrabold">
            📋 응답 요약
          </h1>
        </div>

        {/* 요약 통계 */}
        <div className="flex items-center gap-4 text-sm text-foreground/50 mb-8 ml-8">
          <span>
            완료{" "}
            <span className="font-bold text-primary">{completedCount}</span>
            문항
          </span>
          {unansweredCount > 0 && (
            <span>
              미응답{" "}
              <span className="font-bold text-destructive">{unansweredCount}</span>
              문항
            </span>
          )}
          <span>
            녹음{" "}
            <span className="font-bold text-accent">
              {
                Object.values(session.answers).filter((a) => a.voice).length
              }
            </span>
            건
          </span>
        </div>

        {/* 파트별 응답 목록 */}
        <div className="space-y-10">
          {COACHING_PARTS.map((part) => {
            const partQuestions = COACHING_QUESTIONS.filter(
              (q) => q.part === part.key,
            );

            return (
              <div key={part.key}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs font-bold text-accent tracking-wider uppercase">
                    {part.questionRange}
                  </span>
                  <span className="text-sm font-bold text-foreground/60 break-keep">
                    {part.title}
                  </span>
                </div>

                <div className="space-y-3">
                  {partQuestions.map((q) => {
                    const a = session.answers[q.id];
                    const hasText = a?.text && a.text.trim().length > 0;
                    const hasVoice = !!a?.voice;
                    const answered = hasText || hasVoice;

                    return (
                      <div
                        key={q.id}
                        className={`rounded-2xl border p-4 md:p-5 transition-colors ${
                          answered
                            ? "border-border bg-white"
                            : "border-dashed border-foreground/15 bg-foreground/[0.02]"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-foreground/70 break-keep">
                              <span className="text-primary mr-1.5">
                                Q{q.id}.
                              </span>
                              {q.question}
                            </p>

                            {hasText && (
                              <p className="mt-2 text-base text-foreground/50 line-clamp-3 leading-relaxed">
                                {a!.text}
                              </p>
                            )}

                            {hasVoice && (
                              <div className="mt-3">
                                <VoicePlayer
                                  src={a!.voice!.data}
                                  duration={a!.voice!.duration}
                                />
                              </div>
                            )}

                            {!answered && (
                              <p className="mt-2 text-sm text-foreground/30 italic">
                                아직 답변하지 않은 문항입니다
                              </p>
                            )}
                          </div>

                          <button
                            onClick={() => goToQuestion(q.id)}
                            className="shrink-0 text-xs font-bold text-primary/60 hover:text-primary transition-colors px-3 py-2 rounded-lg hover:bg-product-confirm"
                          >
                            {answered ? "수정" : "작성"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* 제출 영역 */}
        <div className="mt-12 bg-product-confirm rounded-2xl p-6 md:p-8 text-center">
          {unansweredCount > 0 && (
            <p className="text-sm text-foreground/50 mb-4 break-keep">
              ⚠️ 미응답 문항이 {unansweredCount}개 있습니다. 미응답 상태로도
              제출할 수 있습니다.
            </p>
          )}

          <button
            onClick={() => setShowConfirm(true)}
            className="bg-primary text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl"
          >
            최종 제출하기
          </button>

          <p className="text-xs text-foreground/30 mt-3">
            제출 후에는 수정할 수 없습니다
          </p>
        </div>

        {/* 제출 확인 모달 */}
        {showConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setShowConfirm(false)}
            />
            <div className="relative bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
              <h3 className="font-serif text-xl text-primary font-bold mb-3">
                응답을 제출하시겠습니까?
              </h3>
              <p className="text-base text-foreground/60 leading-relaxed mb-6 break-keep">
                제출 후에는 답변을 수정할 수 없습니다.
                {unansweredCount > 0 &&
                  ` 현재 ${unansweredCount}개 문항이 미응답 상태입니다.`}
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 py-3.5 rounded-xl border border-border text-foreground/60 font-bold hover:bg-secondary/40 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 py-3.5 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-colors shadow-md"
                >
                  제출하기
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
