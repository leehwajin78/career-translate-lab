'use client'

import { useEffect, useRef } from "react";
import { useFreeDiagnosticStore } from "@/store/freeDiagnosticStore";
import EmailCollect from "@/components/free-diagnosis/EmailCollect";
import DiagnosisForm from "@/components/free-diagnosis/DiagnosisForm";
import AnalysisLoading from "@/components/free-diagnosis/AnalysisLoading";
import Report from "@/components/free-diagnosis/Report";
import Complete from "@/components/free-diagnosis/Complete";

// 내부 API Route (기존 Supabase Edge Function 대체)
const API_URL = "/api/diagnoses";
const TIMEOUT_MS = 10_000;

export default function Diagnosis() {
  const { step, setStep, reset, lead, answers, outputAssets } = useFreeDiagnosticStore();
  const submittingRef = useRef(false);

  useEffect(() => {
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFormSubmit = () => {
    if (submittingRef.current || !lead) return;
    submittingRef.current = true;

    // 즉시 로딩 화면으로 전환 — 분석은 AnalysisLoading 내부 타이머가 처리
    setStep("loading");
    window.scrollTo({ top: 0, behavior: "smooth" });
    submittingRef.current = false;

    // 서버 전송은 백그라운드 fire-and-forget (실패해도 로딩 흐름 유지)
    const formattedAnswers: Record<string, string> = {};
    for (let i = 1; i <= 7; i++) {
      if (answers[i]) formattedAnswers[`q${i}`] = answers[i];
    }

    const controller = new AbortController();
    setTimeout(() => controller.abort(), TIMEOUT_MS);

    fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: lead.email,
        name: lead.name,
        careerYears: lead.careerYears,
        answers: formattedAnswers,
        bonusChecks: outputAssets,
        consentAt: new Date().toISOString(),
      }),
      signal: controller.signal,
    }).catch(() => {
      // 서버 미연결 시 무시 — 로컬 분석 결과로 계속 진행
    });
  };

  switch (step) {
    case "email":
      return (
        <EmailCollect
          onNext={() => {
            setStep("form");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      );
    case "form":
      return (
        <DiagnosisForm
          onNext={handleFormSubmit}
          onBack={() => {
            setStep("email");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      );
    case "loading":
      return (
        <AnalysisLoading
          onComplete={() => {
            setStep("report");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      );
    case "report":
      return (
        <Report
          onSendEmail={() => {
            setStep("complete");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      );
    case "complete":
      return <Complete />;
    default:
      return <EmailCollect onNext={() => setStep("form")} />;
  }
}
