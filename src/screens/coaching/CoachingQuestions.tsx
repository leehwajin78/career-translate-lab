'use client';

import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, List, Home } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useDbCoaching } from "@/hooks/useDbCoaching";
import type { QuestionAnswer } from "@/store/coachingStore";
import {
  COACHING_QUESTIONS,
  COACHING_PARTS,
  TOTAL_QUESTIONS,
} from "@/data/coachingQuestions";
import ProgressHeader from "@/components/coaching/ProgressHeader";
import TextInputMode from "@/components/coaching/TextInputMode";
import QuestionNav from "@/components/coaching/QuestionNav";

export default function CoachingQuestions() {
  const router = useRouter();
  const navigate = (p: string) => router.push(p);
  const member = useAuthStore((s) => s.currentMember);
  const { answers, status, loading, saveText, flush, completedCount, progress } =
    useDbCoaching();

  const [currentQ, setCurrentQ] = useState(1);
  const [navOpen, setNavOpen] = useState(false);

  const goTo = useCallback((id: number) => {
    if (id < 1 || id > TOTAL_QUESTIONS) return;
    setCurrentQ(id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleTextSave = useCallback(
    (text: string) => {
      saveText(currentQ, text);
    },
    [currentQ, saveText],
  );

  // QuestionNav 가 기대하는 형태로 변환 (텍스트만)
  const navAnswers = useMemo(() => {
    const out: Record<number, QuestionAnswer> = {};
    for (const [k, v] of Object.entries(answers)) {
      out[Number(k)] = { text: v.text, updatedAt: "" };
    }
    return out;
  }, [answers]);

  // ── 모든 훅 호출 종료. 이제 조건부 렌더 ──
  if (!member) {
    navigate("/login");
    return null;
  }
  if (loading) {
    return (
      <div className="container-prose py-24 text-center text-foreground/40">
        불러오는 중…
      </div>
    );
  }

  const q = COACHING_QUESTIONS[currentQ - 1];
  const part = COACHING_PARTS.find((p) => p.key === q?.part);
  const answer = answers[currentQ];
  const isLocked = status !== "in-progress";

  const goNext = () => {
    if (currentQ < TOTAL_QUESTIONS) goTo(currentQ + 1);
    else {
      void flush();
      navigate("/coaching/review");
    }
  };
  const goPrev = () => {
    if (currentQ > 1) goTo(currentQ - 1);
  };
  const goHome = () => {
    void flush();
    navigate("/coaching");
  };

  if (!q) return null;

  return (
    <div className="container-prose py-6 md:py-10">
      <div className="max-w-3xl mx-auto">
        <ProgressHeader
          currentQuestion={currentQ}
          completedCount={completedCount}
          total={TOTAL_QUESTIONS}
          progress={progress}
        />

        {isLocked && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-sm text-emerald-700 break-keep">
            ✓ 이미 제출 완료된 답변입니다. 열람만 가능하며 수정은 운영자에게 문의해 주세요.
          </div>
        )}

        {/* 질문 카드 */}
        <div key={currentQ} className="fade-in">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-bold text-[#C4A265] tracking-wider uppercase">
              {part?.questionRange}
            </span>
            <span className="text-xs text-foreground/30">·</span>
            <span className="text-xs text-foreground/40 break-keep">{part?.title}</span>
          </div>

          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#1E2D8C] text-white text-lg font-bold mb-5 shadow-md">
            Q{currentQ}
          </div>

          <h1 className="font-serif text-[22px] md:text-[28px] text-[#1E2D8C] leading-[1.4] break-keep mb-4">
            {q.question}
          </h1>

          <p className="text-base text-foreground/50 leading-relaxed break-keep mb-8">
            💡 {q.hint}
          </p>

          {/* 입력 영역 (텍스트) */}
          <div className="mb-8">
            <TextInputMode
              value={answer?.text ?? ""}
              onChange={handleTextSave}
              disabled={isLocked}
            />
          </div>
        </div>

        {/* 하단 네비게이션 */}
        <div className="sticky bottom-0 bg-background/95 backdrop-blur-sm border-t border-border pt-4 pb-6 -mx-6 px-6 md:-mx-10 md:px-10">
          <div className="flex items-center justify-between max-w-3xl mx-auto">
            <button
              onClick={goPrev}
              disabled={currentQ <= 1}
              className="flex items-center gap-2 text-base text-foreground/50 hover:text-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed py-3 px-2"
            >
              <ArrowLeft size={18} />
              이전
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={goHome}
                className="flex items-center gap-2 bg-[#F0EFFB] text-[#1E2D8C]/70 px-5 py-3 rounded-xl text-sm font-bold hover:bg-[#F0EFFB]/70 transition-colors"
              >
                <Home size={16} />
                <span className="hidden sm:inline">저장하고 쉬기</span>
                <span className="sm:hidden">저장</span>
              </button>
              <button
                onClick={() => setNavOpen(true)}
                className="flex items-center gap-2 bg-[#F0EFFB] text-[#1E2D8C]/70 px-4 py-3 rounded-xl text-sm font-bold hover:bg-[#F0EFFB]/70 transition-colors"
                aria-label="전체 문항 목록"
              >
                <List size={16} />
              </button>
            </div>

            <button
              onClick={goNext}
              className="flex items-center gap-2 bg-[#1E2D8C] text-white px-6 py-3 rounded-xl text-base font-bold hover:bg-[#1E2D8C]/90 transition-all shadow-md"
            >
              {currentQ === TOTAL_QUESTIONS ? "응답 확인" : "다음"}
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        <QuestionNav
          currentQuestion={currentQ}
          answers={navAnswers}
          onSelect={goTo}
          open={navOpen}
          onClose={() => setNavOpen(false)}
        />
      </div>
    </div>
  );
}
