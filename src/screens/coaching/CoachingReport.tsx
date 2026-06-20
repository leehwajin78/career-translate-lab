'use client';

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useCoachingStore } from "@/store/coachingStore";
import { COACHING_QUESTIONS } from "@/data/coachingQuestions";
import { Award, ArrowLeft, Download, Bookmark, MessageSquare, Compass, Send, BookOpen } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

export default function CoachingReport() {
  const router = useRouter();
  const navigate = (p: string) => router.push(p);
  const member = useAuthStore((s) => s.currentMember);
  const getSession = useCoachingStore((s) => s.getSession);

  useEffect(() => {
    if (!member) {
      navigate("/login");
      return;
    }

    const session = getSession(member.id);
    if (session.status !== "finalized") {
      toast({
        title: "접근 제한",
        description: "코칭 세션이 종료되고 최종 리포트가 확정된 후에 열람하실 수 있습니다.",
        variant: "destructive",
      });
      navigate("/coaching");
    }
  }, [member, navigate]);

  if (!member) return null;

  const session = getSession(member.id);
  const profile = session.finalProfile;
  const aiDraft = session.aiDraft;

  if (!profile) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 md:px-6 print:bg-white print:py-0">
      <div className="max-w-4xl mx-auto space-y-8 print:max-w-full">
        
        {/* 상단 액션바 (프린트 시 미출력) */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4 print:hidden">
          <Link
            href="/coaching"
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 transition-colors font-bold"
          >
            <ArrowLeft size={16} />
            대시보드로 돌아가기
          </Link>
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm"
            >
              <Download size={14} />
              PDF 리포트 저장 (인쇄)
            </button>
          </div>
        </div>

        {/* [리포트 메인 콘텐츠] - 잡지 에디토리얼 격조 높은 스타일 */}
        <article className="bg-white border border-slate-200 rounded-3xl p-8 md:p-12 shadow-soft space-y-12 relative overflow-hidden print:border-0 print:shadow-none print:p-0">
          
          {/* 장식선 및 타이틀 */}
          <div className="space-y-4 text-center border-b border-slate-100 pb-8">
            <div className="inline-flex items-center gap-1 text-xs font-mono font-bold tracking-widest text-[#C4A265] uppercase">
              <Award size={14} />
              <span>THE BRAND IDENTITY REPORT</span>
            </div>
            <h1 className="font-serif text-3xl md:text-4xl text-[#1E2D8C] font-extrabold leading-tight">
              {member.name}님의 나다운 브랜드 프로필
            </h1>
            <p className="text-sm text-foreground/50 max-w-xl mx-auto break-keep">
              세상에 흔들리지 않고 수십 년간 축적해 온 {member.name}님만의 고유한 내공과 가치관을
              단단하고 정교한 한 끗의 브랜드 언어로 정의해 낸 1차 최종 리포트입니다.
            </p>
          </div>

          {/* ① 브랜드 원라이너 (가장 크게 인용구 스타일) */}
          <section className="bg-[#F0EFFB]/30 border border-[#1E2D8C]/10 rounded-3xl p-8 md:p-10 text-center relative overflow-hidden">
            <div className="absolute top-4 left-6 text-7xl font-serif text-[#1E2D8C]/5 select-none font-bold">
              “
            </div>
            <div className="relative z-10 space-y-3">
              <h4 className="text-xs font-bold text-[#C4A265] tracking-widest uppercase">브랜드 원라이너 (Core Identity)</h4>
              <p className="font-serif text-lg md:text-2xl text-[#1E2D8C] font-bold leading-relaxed break-keep">
                {profile.oneLiner}
              </p>
            </div>
            <div className="absolute bottom-[-10px] right-6 text-7xl font-serif text-[#1E2D8C]/5 select-none font-bold">
              ”
            </div>
          </section>

          {/* ② 8대 브랜드 DNA 카드 그리드 */}
          <section className="space-y-6">
            <h3 className="text-xs font-bold text-slate-400 tracking-wider uppercase border-b border-slate-100 pb-2">
              ✦ 핵심 브랜드 DNA 포트폴리오
            </h3>
            
            <div className="grid gap-6 md:grid-cols-2">
              
              {/* 핵심 가치 */}
              <div className="border border-slate-100 rounded-2xl p-6 bg-slate-50/30 space-y-2">
                <h4 className="text-xs font-bold text-[#1E2D8C] flex items-center gap-1.5">
                  <Bookmark size={13} className="text-[#C4A265]" />
                  1. 핵심 가치 3가지
                </h4>
                <div className="flex flex-wrap gap-2 pt-1.5">
                  {profile.coreValues.map((v, idx) => (
                    <span
                      key={idx}
                      className="bg-white border border-[#1E2D8C]/15 text-[#1E2D8C] font-bold text-xs px-3.5 py-1.5 rounded-xl shadow-sm"
                    >
                      ✦ {v}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-foreground/40 leading-relaxed pt-2">
                  Q2, Q6, Q20 답변을 토대로 조율된, 의사결정의 흔들림 없는 기준입니다.
                </p>
              </div>

              {/* 강점 명제문 */}
              <div className="border border-slate-100 rounded-2xl p-6 bg-slate-50/30 space-y-2">
                <h4 className="text-xs font-bold text-[#1E2D8C] flex items-center gap-1.5">
                  <Compass size={13} className="text-[#C4A265]" />
                  2. 강점 명제문 (USP)
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {profile.strengthStatement}
                </p>
              </div>

              {/* 이상적 고객 */}
              <div className="border border-slate-100 rounded-2xl p-6 bg-slate-50/30 space-y-2">
                <h4 className="text-xs font-bold text-[#1E2D8C] flex items-center gap-1.5">
                  <Compass size={13} className="text-[#C4A265]" />
                  3. 타깃 페르소나
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {profile.targetPersona}
                </p>
              </div>

              {/* 핵심 메시지 */}
              <div className="border border-slate-100 rounded-2xl p-6 bg-slate-50/30 space-y-2">
                <h4 className="text-xs font-bold text-[#1E2D8C] flex items-center gap-1.5">
                  <MessageSquare size={13} className="text-[#C4A265]" />
                  4. 핵심 메시지 (Slogan)
                </h4>
                <p className="text-xs text-slate-800 font-medium leading-relaxed italic whitespace-pre-wrap">
                  {profile.coreMessage}
                </p>
              </div>

              {/* 브랜드 스토리 */}
              <div className="border border-slate-100 rounded-2xl p-6 bg-slate-50/30 space-y-2 md:col-span-2">
                <h4 className="text-xs font-bold text-[#1E2D8C] flex items-center gap-1.5">
                  <BookOpen size={13} className="text-[#C4A265]" />
                  5. 브랜드 스토리 에센스 (Narrative)
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {profile.brandStory}
                </p>
              </div>

              {/* 채널 전략 */}
              <div className="border border-slate-100 rounded-2xl p-6 bg-slate-50/30 space-y-2">
                <h4 className="text-xs font-bold text-[#1E2D8C] flex items-center gap-1.5">
                  <Send size={13} className="text-[#C4A265]" />
                  6. 표현 채널 및 상품 전략
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {profile.channelStrategy}
                </p>
              </div>

              {/* 브랜드 WHY */}
              <div className="border border-slate-100 rounded-2xl p-6 bg-slate-50/30 space-y-2">
                <h4 className="text-xs font-bold text-[#1E2D8C] flex items-center gap-1.5">
                  <Award size={13} className="text-[#C4A265]" />
                  7. 궁극적 목적 (WHY)
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {profile.brandWhy}
                </p>
              </div>

            </div>
          </section>

          {/* ③ 코치 최종 피드백 코멘트 */}
          {profile.coachComment && (
            <section className="bg-[#C4A265]/5 border border-[#C4A265]/20 rounded-3xl p-6 md:p-8 space-y-3">
              <h4 className="text-xs font-bold text-[#C4A265] tracking-widest uppercase flex items-center gap-1.5">
                <Award size={14} />
                <span>📝 코치 최종 피드백 & 응원 메시지</span>
              </h4>
              <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-wrap break-keep font-serif">
                {profile.coachComment}
              </p>
            </section>
          )}

          {/* ④ 회원 답변과 매칭 분석 아코디언 (서브 컨텐츠 - 프린트 제외 옵션 가능) */}
          {aiDraft && aiDraft.questionInsights && (
            <section className="space-y-4 pt-4 border-t border-slate-100 print:hidden">
              <h3 className="text-xs font-bold text-slate-400 tracking-wider uppercase">
                ✦ 42문항 1차 분석 및 상세 인사이트 아코디언
              </h3>
              
              <div className="space-y-3">
                {aiDraft.questionInsights.slice(0, 10).map((insight) => {
                  const q = COACHING_QUESTIONS.find((qi) => qi.id === insight.questionId);
                  const userAns = session.answers[insight.questionId];

                  return (
                    <details
                      key={insight.questionId}
                      className="group bg-slate-50 border border-slate-100 rounded-2xl p-4 transition-all duration-300"
                    >
                      <summary className="list-none flex justify-between items-center cursor-pointer text-xs font-bold text-slate-700 select-none">
                        <span className="flex items-center gap-2">
                          <span className="text-[#1E2D8C]">Q{insight.questionId}.</span>
                          <span className="line-clamp-1 max-w-[280px] sm:max-w-md">{q?.question}</span>
                        </span>
                        <span className="text-[10px] text-[#C4A265] bg-white border border-[#C4A265]/10 px-2 py-0.5 rounded group-open:hidden">
                          상세분석 조회 ▾
                        </span>
                        <span className="text-[10px] text-[#C4A265] bg-white border border-[#C4A265]/10 px-2 py-0.5 rounded hidden group-open:inline">
                          닫기 ▲
                        </span>
                      </summary>
                      
                      <div className="mt-4 pt-3 border-t border-slate-200/50 space-y-3 text-xs leading-relaxed">
                        <div>
                          <span className="font-bold text-slate-400 block mb-1">💬 내가 제출한 답변:</span>
                          <p className="bg-white p-3 rounded-xl border border-slate-100 text-slate-600">
                            {userAns?.text || "(음성 녹음 등록)"}
                          </p>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <span className="font-bold text-slate-400 block mb-1">📊 답변 패턴:</span>
                            <span className="text-[#1E2D8C] font-semibold">{insight.matchedPattern}</span>
                          </div>
                          <div>
                            <span className="font-bold text-slate-400 block mb-1">🟢 브랜딩 신호:</span>
                            <span className="text-slate-600">{insight.brandingSignal}</span>
                          </div>
                        </div>
                      </div>
                    </details>
                  );
                })}
                <p className="text-[11px] text-center text-slate-400 italic">
                  * 대표적인 질문에 대한 분석 리스트입니다. 상세한 전체 내역은 전문 코치가 기록 및 관리하고 있습니다.
                </p>
              </div>
            </section>
          )}

        </article>

        {/* 푸터 문구 */}
        <div className="text-center text-xs text-slate-400 leading-relaxed print:hidden">
          <span>나다움을 세상의 언어로 번역하는 곳, 한끗프로젝트</span>
          <br />
          <span className="font-mono mt-1 block">© 2026 KKUMMOLDA. All Rights Reserved.</span>
        </div>

      </div>
    </div>
  );
}
