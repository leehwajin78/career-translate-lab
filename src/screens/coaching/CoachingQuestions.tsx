'use client';

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, List, Home } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useCoachingStore } from "@/store/coachingStore";
import type { VoiceRecording } from "@/store/coachingStore";
import {
  COACHING_QUESTIONS,
  COACHING_PARTS,
  TOTAL_QUESTIONS,
} from "@/data/coachingQuestions";
import ProgressHeader from "@/components/coaching/ProgressHeader";
import TextInputMode from "@/components/coaching/TextInputMode";
import VoiceRecordMode from "@/components/coaching/VoiceRecordMode";
import QuestionNav from "@/components/coaching/QuestionNav";

type InputMode = "text" | "voice";

export default function CoachingQuestions() {
  const router = useRouter();
  const navigate = (p: string) => router.push(p);
  const member = useAuthStore((s) => s.currentMember);

  const {
    getSession,
    saveText,
    saveVoice,
    removeVoice,
    setCurrentQuestion,
    getCompletedCount,
    getProgress,
  } = useCoachingStore();

  const [inputMode, setInputMode] = useState<InputMode>("text");
  const [navOpen, setNavOpen] = useState(false);

  if (!member) {
    navigate("/login");
    return null;
  }

  const session = getSession(member.id);
  const currentQ = session.currentQuestion;
  const q = COACHING_QUESTIONS[currentQ - 1];
  const part = COACHING_PARTS.find((p) => p.key === q?.part);
  const answer = session.answers[currentQ];
  const completedCount = getCompletedCount(member.id);
  const progress = getProgress(member.id);

  // 문항 이동
  const goTo = useCallback(
    (id: number) => {
      if (id < 1 || id > TOTAL_QUESTIONS) return;
      setCurrentQuestion(member.id, id);
      setInputMode("text");
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [member.id, setCurrentQuestion],
  );

  const goNext = () => {
    if (currentQ < TOTAL_QUESTIONS) goTo(currentQ + 1);
    else navigate("/coaching/review");
  };

  const goPrev = () => {
    if (currentQ > 1) goTo(currentQ - 1);
  };

  // 텍스트 저장
  const handleTextSave = useCallback(
    (text: string) => {
      saveText(member.id, currentQ, text);
    },
    [member.id, currentQ, saveText],
  );

  // 음성 저장
  const handleVoiceSave = useCallback(
    (voice: VoiceRecording) => {
      saveVoice(member.id, currentQ, voice);
    },
    [member.id, currentQ, saveVoice],
  );

  // 음성 삭제
  const handleVoiceRemove = useCallback(() => {
    removeVoice(member.id, currentQ);
  }, [member.id, currentQ, removeVoice]);

  // 대시보드로
  const goHome = () => navigate("/coaching");

  if (!q) return null;

  return (
    <div className="container-prose py-6 md:py-10">
      <div className="max-w-3xl mx-auto">
        {/* 프로그레스 헤더 */}
        <ProgressHeader
          currentQuestion={currentQ}
          completedCount={completedCount}
          total={TOTAL_QUESTIONS}
          progress={progress}
        />

        {/* 질문 카드 */}
        <div key={currentQ} className="fade-in">
          {/* 파트 라벨 */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-bold text-[#C4A265] tracking-wider uppercase">
              {part?.questionRange}
            </span>
            <span className="text-xs text-foreground/30">·</span>
            <span className="text-xs text-foreground/40 break-keep">
              {part?.title}
            </span>
          </div>

          {/* 질문 번호 배지 */}
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#1E2D8C] text-white text-lg font-bold mb-5 shadow-md">
            Q{currentQ}
          </div>

          {/* 질문 텍스트 */}
          <h1 className="font-serif text-[22px] md:text-[28px] text-[#1E2D8C] leading-[1.4] break-keep mb-4">
            {q.question}
          </h1>

          {/* 힌트 */}
          <p className="text-base text-foreground/50 leading-relaxed break-keep mb-8">
            💡 {q.hint}
          </p>

          {/* 입력 모드 전환 탭 */}
          <div className="flex items-center gap-2 mb-5">
            <button
              onClick={() => setInputMode("text")}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-base font-bold transition-all ${
                inputMode === "text"
                  ? "bg-[#1E2D8C] text-white shadow-md"
                  : "bg-[#F0EFFB] text-[#1E2D8C]/60 hover:bg-[#F0EFFB]/80"
              }`}
            >
              ✏️ 글로 쓰기
            </button>
            <button
              onClick={() => setInputMode("voice")}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-base font-bold transition-all ${
                inputMode === "voice"
                  ? "bg-[#1E2D8C] text-white shadow-md"
                  : "bg-[#F0EFFB] text-[#1E2D8C]/60 hover:bg-[#F0EFFB]/80"
              }`}
            >
              🎤 말로 녹음
            </button>
          </div>

          {/* 입력 영역 */}
          <div className="mb-8">
            {inputMode === "text" ? (
              <TextInputMode
                value={answer?.text ?? ""}
                onChange={handleTextSave}
              />
            ) : (
              <VoiceRecordMode
                voice={answer?.voice}
                text={answer?.text ?? ""}
                onSave={handleVoiceSave}
                onRemove={handleVoiceRemove}
                onSaveText={handleTextSave}
              />
            )}

            {/* 다른 모드의 데이터가 있으면 표시 */}
            {inputMode === "text" && answer?.voice && (
              <div className="mt-4 p-4 bg-[#F0EFFB]/40 rounded-xl">
                <p className="text-sm text-foreground/50 mb-2 font-medium">
                  🎤 녹음도 저장되어 있습니다 ({Math.floor(answer.voice.duration / 60)}:{(answer.voice.duration % 60).toString().padStart(2, "0")})
                </p>
              </div>
            )}
            {inputMode === "voice" && answer?.text && answer.text.trim().length > 0 && (
              <div className="mt-4 p-4 bg-[#F0EFFB]/40 rounded-xl">
                <p className="text-sm text-foreground/50 mb-1 font-medium">
                  ✏️ 글도 작성되어 있습니다
                </p>
                <p className="text-sm text-foreground/40 line-clamp-2">
                  {answer.text}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 하단 네비게이션 */}
        <div className="sticky bottom-0 bg-background/95 backdrop-blur-sm border-t border-border pt-4 pb-6 -mx-6 px-6 md:-mx-10 md:px-10">
          <div className="flex items-center justify-between max-w-3xl mx-auto">
            {/* 이전 */}
            <button
              onClick={goPrev}
              disabled={currentQ <= 1}
              className="flex items-center gap-2 text-base text-foreground/50 hover:text-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed py-3 px-2"
            >
              <ArrowLeft size={18} />
              이전
            </button>

            {/* 중앙 버튼 그룹 */}
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

            {/* 다음 */}
            <button
              onClick={goNext}
              className="flex items-center gap-2 bg-[#1E2D8C] text-white px-6 py-3 rounded-xl text-base font-bold hover:bg-[#1E2D8C]/90 transition-all shadow-md"
            >
              {currentQ === TOTAL_QUESTIONS ? "응답 확인" : "다음"}
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        {/* 문항 네비게이션 슬라이드 패널 */}
        <QuestionNav
          currentQuestion={currentQ}
          answers={session.answers}
          onSelect={goTo}
          open={navOpen}
          onClose={() => setNavOpen(false)}
        />
      </div>
    </div>
  );
}
