import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { useCoachingStore } from "@/store/coachingStore";
import { useNotificationStore } from "@/store/notificationStore";
import { analyzeCoachingAnswers } from "@/lib/coachingAI";
import { Loader2, Check } from "lucide-react";

export default function CoachingAnalyzing() {
  const navigate = useNavigate();
  const member = useAuthStore((s) => s.currentMember);
  const { getSession, saveAiDraft, submit, setStatus } = useCoachingStore();
  const [progress, setProgress] = useState(0);
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    { label: "삶의 경험 패턴 분석 중...", duration: 600 },
    { label: "보유 역량 및 강점 데이터 매핑 중...", duration: 800 },
    { label: "미래 비전 및 성장 적합성 탐색 중...", duration: 600 },
    { label: "8대 핵심 브랜드 프로필 초안 구성 중...", duration: 500 },
  ];

  useEffect(() => {
    if (!member) {
      navigate("/login");
      return;
    }

    const session = getSession(member.id);

    // 42문항 답변 미비 시 비정상 진입으로 보고 리다이렉트
    if (Object.keys(session.answers).length === 0) {
      navigate("/coaching");
      return;
    }

    let isMounted = true;

    // 1. 분석 상태 설정
    setStatus(member.id, "analyzing");

    // 2. 가상 프로그레스 애니메이션 (API 호출 대기 동안 시각적 만족 유도)
    let currentStep = 0;
    let stepTimer: NodeJS.Timeout;

    const runStepAnimation = () => {
      if (currentStep >= steps.length) return;
      
      stepTimer = setTimeout(() => {
        if (!isMounted) return;
        currentStep++;
        setActiveStep(currentStep);
        setProgress(Math.min((currentStep / steps.length) * 100, 100));
        runStepAnimation();
      }, steps[currentStep].duration);
    };

    runStepAnimation();

    // 3. 실제 Claude AI 분석 호출
    const runAnalysis = async () => {
      try {
        const result = await analyzeCoachingAnswers(member.name, session.answers);
        if (!isMounted) return;

        // AI 초안 저장 (이 메서드는 스토어 내부에서 상태를 analyzed로 바꿔줌)
        saveAiDraft(member.id, result);
        submit(member.id); // 최종 제출 일자 및 상태 갱신

        // 4. 실시간 알림 트리거 (BroadcastChannel, Desktop push, etc.)
        useNotificationStore.getState().triggerNotification(member.id, member.name);

        // 5. Netlify Forms 비동기 전송
        const formData = new URLSearchParams();
        formData.append("form-name", "coaching-submissions");
        formData.append("memberId", member.id);
        formData.append("memberName", member.name);
        formData.append("memberEmail", member.email || "");
        formData.append("submittedAt", new Date().toISOString());

        fetch("/", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: formData.toString(),
        }).catch((err) => {
          console.warn("Netlify Form submission failed:", err);
        });

        // 부드러운 전환을 위해 약간의 여유 부여
        setProgress(100);
        setActiveStep(steps.length);
        setTimeout(() => {
          if (isMounted) {
            navigate("/coaching");
          }
        }, 1000);
      } catch (err) {
        console.error("분석 중 치명적 오류 발생", err);
        if (isMounted) {
          // 오류 발생하더라도 로컬 백업이 수행되지 않았다면 강제 이전
          navigate("/coaching");
        }
      }
    };

    runAnalysis();

    return () => {
      isMounted = false;
      clearTimeout(stepTimer);
    };
  }, [member, navigate]);

  if (!member) return null;

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 bg-[#F0EFFB]/10">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-soft border border-border/80 text-center fade-in">
        {/* Pulsing loading circle */}
        <div className="relative w-24 h-24 mx-auto mb-8 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-[#1E2D8C]/5 animate-ping" />
          <div className="absolute inset-2 rounded-full bg-[#1E2D8C]/10 animate-pulse" />
          <Loader2 size={36} className="text-[#1E2D8C] animate-spin z-10" />
        </div>

        <h2 className="font-serif text-2xl text-[#1E2D8C] font-extrabold mb-2">
          브랜드 정체성 정밀 분석
        </h2>
        <p className="text-sm text-foreground/50 leading-relaxed mb-8 break-keep">
          {member.name}님이 정성껏 응답하신 42가지 이야기를 기반으로
          코칭 가이드에 맞춰 브랜드 프로필 초안을 구성하고 있습니다.
        </p>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-[#1E2D8C]">
              분석 분석률
            </span>
            <span className="font-mono text-xs font-bold text-[#C4A265]">
              {Math.min(Math.round(progress), 100)}%
            </span>
          </div>
          <div className="w-full h-2.5 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#1E2D8C] to-[#C4A265] transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Step checklist */}
        <div className="space-y-3.5 text-left max-w-[280px] mx-auto">
          {steps.map((step, idx) => {
            const isCompleted = activeStep > idx;
            const isActive = activeStep === idx;

            return (
              <div
                key={idx}
                className={`flex items-center gap-3 text-xs transition-opacity duration-300 ${
                  isCompleted
                    ? "text-foreground/80 font-semibold"
                    : isActive
                    ? "text-[#1E2D8C] font-bold"
                    : "text-foreground/30"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border ${
                    isCompleted
                      ? "bg-emerald-50 border-emerald-500 text-emerald-600"
                      : isActive
                      ? "border-[#1E2D8C] text-[#1E2D8C]"
                      : "border-foreground/15 text-foreground/20"
                  }`}
                >
                  {isCompleted ? (
                    <Check size={12} strokeWidth={3} />
                  ) : isActive ? (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1E2D8C] animate-pulse" />
                  ) : (
                    <span className="text-[9px] font-mono">{idx + 1}</span>
                  )}
                </div>
                <span className="break-keep">{step.label}</span>
              </div>
            );
          })}
        </div>

        <div className="mt-8 pt-6 border-t border-border/80 text-[10px] text-foreground/40 leading-relaxed break-keep">
          💡 이 진단은 단순 AI 답변 생성이 아닙니다. <br />
          나다운브랜딩 5060 코칭 매뉴얼에 명시된 168가지 내러티브 패턴을 
          추출하여 1차 프로필을 빌드합니다.
        </div>
      </div>
    </div>
  );
}
