import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useFreeDiagnosticStore } from "@/store/freeDiagnosticStore";
import EmailCollect from "@/components/free-diagnosis/EmailCollect";
import DiagnosisForm from "@/components/free-diagnosis/DiagnosisForm";
import AnalysisLoading from "@/components/free-diagnosis/AnalysisLoading";
import Report from "@/components/free-diagnosis/Report";
import Complete from "@/components/free-diagnosis/Complete";
import { useToast } from "@/hooks/use-toast";

const EDGE_URL = `${import.meta.env.VITE_SUPABASE_URL as string}/functions/v1/submit-free-diagnosis`;
const TIMEOUT_MS = 10_000;

export default function Diagnosis() {
  const { step, setStep, reset, lead, answers, outputAssets } = useFreeDiagnosticStore();
  const navigate = useNavigate();
  const { toast } = useToast();
  const submittingRef = useRef(false);

  useEffect(() => {
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFormSubmit = async () => {
    if (submittingRef.current || !lead) return;
    submittingRef.current = true;

    // 즉시 로딩 상태로 전환 → DiagnosisForm 언마운트 (버튼 비활성화 효과)
    setStep("loading");
    window.scrollTo({ top: 0, behavior: "smooth" });

    const formattedAnswers: Record<string, string> = {};
    for (let i = 1; i <= 7; i++) {
      if (answers[i]) formattedAnswers[`q${i}`] = answers[i];
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      const res = await fetch(EDGE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: lead.email,
          name: lead.name,
          careerYears: lead.careerYears,
          answers: formattedAnswers,
          bonusChecks: outputAssets,
          consentAt: new Date().toISOString(),
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.status === 429) {
        setStep("form");
        toast({
          variant: "destructive",
          title: "이미 진단하셨습니다",
          description: `${lead.email} 받은 편지함을 확인해주세요. (24시간 후 재진단 가능)`,
        });
        return;
      }

      if (!res.ok) {
        const body = await res.json().catch(() => ({})) as Record<string, unknown>;
        throw new Error(typeof body.message === "string" ? body.message : "서버 오류");
      }

      const data = await res.json() as { id: string; type: string; scores: Record<string, number> };
      navigate("/result", {
        replace: true,
        state: { diagnosisId: data.id, type: data.type, scores: data.scores },
      });
    } catch (err) {
      clearTimeout(timeoutId);
      setStep("form");

      if (err instanceof Error && err.name === "AbortError") {
        toast({
          variant: "destructive",
          title: "응답 시간 초과 (10초)",
          description: "답변은 저장되어 있습니다. 인터넷 연결 확인 후 다시 시도해주세요.",
        });
      } else if (!navigator.onLine) {
        toast({
          variant: "destructive",
          title: "인터넷 연결을 확인해주세요",
          description: "답변은 저장되어 있습니다. 연결 복구 후 다시 시도해주세요.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "제출 중 오류가 발생했습니다",
          description: err instanceof Error ? err.message : "잠시 후 다시 시도해주세요.",
        });
      }
    } finally {
      submittingRef.current = false;
    }
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
