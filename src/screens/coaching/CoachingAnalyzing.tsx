'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { Loader2, Check } from "lucide-react";

/* =============================================================
 * C-13 — 제출 완료 전환 화면
 *
 * 42문항 제출은 C-12(CoachingReview)에서 서버(POST /api/coaching/submit)로
 * 이미 영속화된다. AI 브랜드 프로필 초안 생성은 코치가 관리자 워크스페이스
 * (A-03)에서 수동 트리거하는 서버 전용 작업(WI-10)으로 이관되었다.
 * 따라서 이 화면은 브라우저에서 AI를 호출하지 않고, 안내 애니메이션 후
 * 코칭 대시보드(/coaching)로 이동시키는 전환 화면 역할만 한다.
 * ============================================================= */

export default function CoachingAnalyzing() {
  const router = useRouter();
  const member = useAuthStore((s) => s.currentMember);
  const [progress, setProgress] = useState(0);
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    { label: "제출된 42가지 이야기 정리 중...", duration: 600 },
    { label: "코치 검토용 응답 데이터 매핑 중...", duration: 800 },
    { label: "브랜딩 코칭 큐 등록 중...", duration: 600 },
    { label: "코칭 대시보드 준비 중...", duration: 500 },
  ];

  useEffect(() => {
    if (!member) {
      router.push("/login");
      return;
    }

    let isMounted = true;
    let currentStep = 0;
    let stepTimer: ReturnType<typeof setTimeout>;

    const runStepAnimation = () => {
      if (currentStep >= steps.length) {
        setProgress(100);
        setActiveStep(steps.length);
        stepTimer = setTimeout(() => {
          if (isMounted) router.push("/coaching");
        }, 1000);
        return;
      }
      stepTimer = setTimeout(() => {
        if (!isMounted) return;
        currentStep++;
        setActiveStep(currentStep);
        setProgress(Math.min((currentStep / steps.length) * 100, 100));
        runStepAnimation();
      }, steps[currentStep].duration);
    };

    runStepAnimation();

    return () => {
      isMounted = false;
      clearTimeout(stepTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [member, router]);

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
          소중한 이야기가 제출되었습니다
        </h2>
        <p className="text-sm text-foreground/50 leading-relaxed mb-8 break-keep">
          {member.name}님이 정성껏 응답하신 42가지 이야기가 코치에게 안전하게 전달되었습니다.
          전담 코치가 검토 후 브랜드 프로필 리포트를 작성해 드립니다.
        </p>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-[#1E2D8C]">
              제출 처리율
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
          💡 코치 검토가 완료되면 대시보드에서 리포트를 확인하실 수 있습니다.
          잠시 후 코칭 대시보드로 이동합니다.
        </div>
      </div>
    </div>
  );
}
