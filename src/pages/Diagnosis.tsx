import { useEffect } from "react";
import { useFreeDiagnosticStore } from "@/store/freeDiagnosticStore";
import EmailCollect from "@/components/free-diagnosis/EmailCollect";
import DiagnosisForm from "@/components/free-diagnosis/DiagnosisForm";
import AnalysisLoading from "@/components/free-diagnosis/AnalysisLoading";
import Report from "@/components/free-diagnosis/Report";
import Complete from "@/components/free-diagnosis/Complete";

export default function Diagnosis() {
  const { step, setStep, reset } = useFreeDiagnosticStore();

  // 페이지 진입 시 깨끗한 상태로 시작
  useEffect(() => {
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          onNext={() => {
            setStep("loading");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
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
