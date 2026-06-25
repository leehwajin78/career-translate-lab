'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Phone, Mail, LogOut } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useDbCoaching } from "@/hooks/useDbCoaching";
import { TOTAL_QUESTIONS, COACHING_PARTS } from "@/data/coachingQuestions";

export default function CoachingDashboard() {
  const router = useRouter();
  const navigate = (p: string) => router.push(p);
  const member = useAuthStore((s) => s.currentMember);
  const logout = useAuthStore((s) => s.logout);
  const { answers, status, loading, completedCount, progress } = useDbCoaching();

  // ── 모든 훅 종료. 조건부 렌더 ──
  if (!member) {
    navigate("/login");
    return null;
  }
  if (loading) {
    return (
      <div className="container-prose py-24 text-center text-foreground/40">불러오는 중…</div>
    );
  }

  const isFinalized = status === "finalized";
  const isSubmitted = status !== "in-progress" && status !== "analyzing";
  const isAnalyzing = status === "analyzing";

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="container-prose py-12 md:py-20 fade-in">
      <div className="max-w-3xl mx-auto">
        {/* 헤더 */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <p className="text-sm text-[#C4A265] font-bold tracking-wider uppercase mb-2">
              나다운 브랜딩 코칭
            </p>
            <h1 className="font-serif text-2xl md:text-3xl text-[#1E2D8C] leading-snug">
              👋 {member.name}님,
              <br />
              {isFinalized ? "당신의 브랜드가 마침내 빛을 발합니다" : "한끗 진단에 오신 것을 환영합니다"}
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs text-foreground/40 hover:text-foreground/70 transition-colors mt-2"
          >
            <LogOut size={14} />
            로그아웃
          </button>
        </div>

        {/* 1. 최종 완료 (리포트 열람 가능) 상태 */}
        {isFinalized ? (
          <div className="bg-gradient-to-br from-[#1E2D8C] to-[#1E2D8C]/95 text-white rounded-3xl p-6 md:p-8 shadow-xl mb-8 relative overflow-hidden">
            <div className="absolute right-0 bottom-0 opacity-10 font-serif text-[180px] font-bold select-none leading-none translate-y-16 translate-x-12">
              ✦
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs font-bold text-[#C4A265] tracking-widest uppercase bg-white/10 px-3 py-1 rounded-full border border-white/10">
                  COACHING COMPLETE
                </span>
                <span className="bg-[#C4A265] text-white text-[10px] font-bold px-2 py-0.5 rounded">
                  최종 확정
                </span>
              </div>
              <h2 className="font-serif text-xl md:text-2xl font-bold mb-3 leading-snug">
                당신만을 위해 정제된 <br />
                나다운 브랜드 프로필이 확정되었습니다.
              </h2>
              <p className="text-sm text-white/70 leading-relaxed mb-6 break-keep">
                전문 코치와의 1:1 대화와 성찰을 통해 완성된 {member.name}님의 고유한 브랜드 가치,
                강점 명제, 브랜드 원라이너와 톤앤매너 리포트가 최종 발급되었습니다.
              </p>
              <Link
                href="/coaching/report"
                className="inline-flex items-center justify-center w-full sm:w-auto bg-[#C4A265] text-white hover:bg-[#C4A265]/90 transition-all font-bold text-base px-10 py-5 rounded-2xl shadow-lg"
              >
                ✨ 나의 브랜드 프로필 리포트 보기
              </Link>
            </div>
          </div>
        ) : isSubmitted ? (
          /* 2. 제출 완료 및 코칭 인터뷰 대기 상태 */
          <div className="bg-white border-2 border-[#1E2D8C]/15 rounded-3xl p-6 md:p-8 shadow-soft mb-8">
            <div className="flex items-center gap-3 mb-5">
              <span className="text-2xl">💬</span>
              <h2 className="text-xl font-bold text-[#1E2D8C]">자가 진단 제출 완료</h2>
              <span className="ml-auto bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200">
                ✓ 대기 중
              </span>
            </div>
            <div className="bg-[#F0EFFB]/40 border border-[#1E2D8C]/10 rounded-2xl p-5 mb-6 text-sm text-foreground/75 leading-relaxed break-keep">
              <p className="font-bold text-[#1E2D8C] mb-2 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#1E2D8C]" />
                1:1 브랜드 코칭 인터뷰 준비 중
              </p>
              {member.name}님이 정성스레 작성하신 42문항 답변이 안전하게 제출되었습니다.
              현재 코치가 답변을 검토하고 있으며, 1:1 대화를 마친 후 최종 브랜드 프로필 리포트가 열람 가능하도록 잠금 해제됩니다.
            </div>
            <Link
              href="/coaching/review"
              className="block w-full bg-[#F0EFFB] text-[#1E2D8C] text-center py-5 rounded-2xl font-bold text-lg hover:bg-[#F0EFFB]/70 transition-colors"
            >
              📋 내가 작성한 응답 다시 보기
            </Link>
          </div>
        ) : (
          /* 3. 작성 중 상태 */
          <div className="bg-white border-2 border-[#1E2D8C]/10 rounded-3xl p-6 md:p-8 shadow-soft mb-8">
            <div className="flex items-center gap-3 mb-5">
              <span className="text-2xl">📝</span>
              <h2 className="text-xl font-bold text-[#1E2D8C]">42문항 코칭 질문</h2>
              {isAnalyzing && (
                <span className="ml-auto bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full border border-blue-200 animate-pulse">
                  분석 중...
                </span>
              )}
            </div>

            <div className="mb-5">
              <div className="h-3 bg-[#F0EFFB] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#1E2D8C] to-[#1E2D8C]/70 rounded-full transition-all duration-700"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-base text-foreground/60">
                  응답 완료:{" "}
                  <span className="font-bold text-[#1E2D8C]">{completedCount}</span> / {TOTAL_QUESTIONS}
                </span>
                <span className="font-mono text-lg font-bold text-[#C4A265]">{progress}%</span>
              </div>
            </div>

            <Link
              href="/coaching/questions"
              className="block w-full bg-[#1E2D8C] text-white text-center py-5 rounded-2xl font-bold text-lg hover:bg-[#1E2D8C]/90 transition-all shadow-lg hover:shadow-xl"
            >
              {completedCount > 0 ? "🖊️ 이어서 작성하기" : "🖊️ 작성 시작하기"}
            </Link>
          </div>
        )}

        {/* 파트별 진행 상황 */}
        <div className="grid gap-3 sm:grid-cols-2 mb-8">
          {COACHING_PARTS.map((part, idx) => {
            const partQuestions = Array.from(
              { length: idx === 0 ? 10 : idx === 1 ? 12 : 10 },
              (_, i) => (idx === 0 ? 1 : idx === 1 ? 11 : idx === 2 ? 23 : 33) + i,
            );
            const partCompleted = partQuestions.filter((id) => {
              const a = answers[id];
              return a && a.text && a.text.trim().length > 0;
            }).length;

            return (
              <div key={part.key} className="bg-white rounded-2xl border border-border p-4 shadow-soft">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#C4A265] tracking-wider">PART {idx + 1}</span>
                  <span className="text-xs text-foreground/40 font-mono">
                    {partCompleted}/{partQuestions.length}
                  </span>
                </div>
                <p className="text-sm font-bold text-foreground/70 break-keep">{part.title}</p>
                <div className="h-1.5 bg-[#F0EFFB] rounded-full mt-3 overflow-hidden">
                  <div
                    className="h-full bg-[#1E2D8C]/60 rounded-full transition-all duration-500"
                    style={{ width: `${(partCompleted / partQuestions.length) * 100}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* 안내 박스 */}
        <div className="bg-[#F0EFFB]/50 rounded-2xl p-6 md:p-8 space-y-4">
          <h3 className="font-bold text-[#1E2D8C] text-lg">💡 이렇게 진행하시면 됩니다</h3>
          <ul className="space-y-3 text-base text-foreground/70 leading-relaxed">
            <li className="flex items-start gap-2.5 break-keep">
              <span className="shrink-0 mt-0.5">✓</span>
              한 번에 다 하지 않으셔도 됩니다. 언제든 나갔다 돌아오시면 이어서 작성됩니다.
            </li>
            <li className="flex items-start gap-2.5 break-keep">
              <span className="shrink-0 mt-0.5">✓</span>
              작성하신 답변은 자동으로 저장되며, 운영자만 확인할 수 있습니다.
            </li>
            <li className="flex items-start gap-2.5 break-keep">
              <span className="shrink-0 mt-0.5">✓</span>
              빠른 답보다 솔직한 답이 중요합니다. '모르겠다'도 좋은 출발점입니다.
            </li>
          </ul>

          <div className="pt-4 border-t border-[#1E2D8C]/10 flex flex-col sm:flex-row items-start sm:items-center gap-3 text-sm text-foreground/40">
            <span className="flex items-center gap-1.5">
              <Phone size={14} className="shrink-0" />
              070-4090-2161
            </span>
            <span className="hidden sm:block text-foreground/20">/</span>
            <span className="flex items-center gap-1.5">
              <Mail size={14} className="shrink-0" />
              kkummolda@kkummolda.com
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
