import { Link, useNavigate } from "react-router-dom";
import { Phone, Mail, LogOut } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useCoachingStore } from "@/store/coachingStore";
import { TOTAL_QUESTIONS, COACHING_PARTS } from "@/data/coachingQuestions";

export default function CoachingDashboard() {
  const navigate = useNavigate();
  const member = useAuthStore((s) => s.currentMember);
  const logout = useAuthStore((s) => s.logout);

  const getSession = useCoachingStore((s) => s.getSession);
  const getCompletedCount = useCoachingStore((s) => s.getCompletedCount);
  const getProgress = useCoachingStore((s) => s.getProgress);

  if (!member) {
    navigate("/login");
    return null;
  }

  const session = getSession(member.id);
  const completedCount = getCompletedCount(member.id);
  const progress = getProgress(member.id);
  const isSubmitted = session.status === "submitted";

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
              한끗 진단에 오신 것을 환영합니다
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

        {/* 메인 카드: 42문항 진행 상태 */}
        <div className="bg-white border-2 border-[#1E2D8C]/10 rounded-3xl p-6 md:p-8 shadow-soft mb-8">
          <div className="flex items-center gap-3 mb-5">
            <span className="text-2xl">📝</span>
            <h2 className="text-xl font-bold text-[#1E2D8C]">
              42문항 코칭 질문
            </h2>
            {isSubmitted && (
              <span className="ml-auto bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200">
                ✓ 제출 완료
              </span>
            )}
          </div>

          {/* 프로그레스 바 */}
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
                <span className="font-bold text-[#1E2D8C]">
                  {completedCount}
                </span>{" "}
                / {TOTAL_QUESTIONS}
              </span>
              <span className="font-mono text-lg font-bold text-[#C4A265]">
                {progress}%
              </span>
            </div>
          </div>

          {/* 마지막 저장 시각 */}
          {session.lastSavedAt && (
            <p className="text-sm text-foreground/40 mb-6">
              마지막 저장:{" "}
              {new Date(session.lastSavedAt).toLocaleString("ko-KR", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          )}

          {/* CTA 버튼 */}
          {isSubmitted ? (
            <Link
              to="/coaching/review"
              className="block w-full bg-[#F0EFFB] text-[#1E2D8C] text-center py-5 rounded-2xl font-bold text-lg hover:bg-[#F0EFFB]/70 transition-colors"
            >
              📋 제출한 응답 다시 보기
            </Link>
          ) : (
            <Link
              to="/coaching/questions"
              className="block w-full bg-[#1E2D8C] text-white text-center py-5 rounded-2xl font-bold text-lg hover:bg-[#1E2D8C]/90 transition-all shadow-lg hover:shadow-xl"
            >
              {completedCount > 0
                ? "🖊️ 이어서 작성하기"
                : "🖊️ 작성 시작하기"}
            </Link>
          )}
        </div>

        {/* 파트별 진행 상황 */}
        <div className="grid gap-3 sm:grid-cols-2 mb-8">
          {COACHING_PARTS.map((part, idx) => {
            const partQuestions = Array.from(
              { length: idx === 0 ? 10 : idx === 1 ? 12 : 10 },
              (_, i) => (idx === 0 ? 1 : idx === 1 ? 11 : idx === 2 ? 23 : 33) + i,
            );
            const partCompleted = partQuestions.filter((id) => {
              const a = session.answers[id];
              return a && ((a.text && a.text.trim().length > 0) || a.voice);
            }).length;

            return (
              <div
                key={part.key}
                className="bg-white rounded-2xl border border-border p-4 shadow-soft"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#C4A265] tracking-wider">
                    PART {idx + 1}
                  </span>
                  <span className="text-xs text-foreground/40 font-mono">
                    {partCompleted}/{partQuestions.length}
                  </span>
                </div>
                <p className="text-sm font-bold text-foreground/70 break-keep">
                  {part.title}
                </p>
                <div className="h-1.5 bg-[#F0EFFB] rounded-full mt-3 overflow-hidden">
                  <div
                    className="h-full bg-[#1E2D8C]/60 rounded-full transition-all duration-500"
                    style={{
                      width: `${(partCompleted / partQuestions.length) * 100}%`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* 안내 박스 */}
        <div className="bg-[#F0EFFB]/50 rounded-2xl p-6 md:p-8 space-y-4">
          <h3 className="font-bold text-[#1E2D8C] text-lg">
            💡 이렇게 진행하시면 됩니다
          </h3>
          <ul className="space-y-3 text-base text-foreground/70 leading-relaxed">
            <li className="flex items-start gap-2.5 break-keep">
              <span className="shrink-0 mt-0.5">✓</span>
              한 번에 다 하지 않으셔도 됩니다. 언제든 나갔다 돌아오시면 이어서 작성됩니다.
            </li>
            <li className="flex items-start gap-2.5 break-keep">
              <span className="shrink-0 mt-0.5">✓</span>
              글로 쓰셔도, 말로 녹음하셔도 모두 됩니다. 편한 방법으로 답해 주세요.
            </li>
            <li className="flex items-start gap-2.5 break-keep">
              <span className="shrink-0 mt-0.5">✓</span>
              빠른 답보다 솔직한 답이 중요합니다. '모르겠다'도 좋은 출발점입니다.
            </li>
            <li className="flex items-start gap-2.5 break-keep">
              <span className="shrink-0 mt-0.5">✓</span>
              작성하신 답변은 자동으로 저장되며, 운영자만 확인할 수 있습니다.
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
