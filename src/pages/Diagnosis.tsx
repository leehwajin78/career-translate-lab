import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FormField } from "@/components/ui/form-field";
import { DIAGNOSTIC_QUESTIONS, CATEGORY_LABEL } from "@/data/content";
import { useDiagnosticStore } from "@/store/diagnostic";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { z } from "zod";

const TOTAL = DIAGNOSTIC_QUESTIONS.length;

const contactSchema = z.object({
  name: z.string().trim().min(1, "이름을 입력해주세요").max(60),
  phone: z.string().trim().min(7, "연락처를 정확히 입력해주세요").max(30),
  email: z.string().trim().email("이메일 형식이 올바르지 않습니다").max(120),
  field: z.string().trim().min(1, "현재 분야를 입력해주세요").max(120),
});

export default function Diagnosis() {
  const navigate = useNavigate();
  const { answers, setAnswer, setContact, finalize } = useDiagnosticStore();
  const [step, setStep] = useState(0); // 0..TOTAL (TOTAL = contact step)
  const [contact, setLocalContact] = useState({ name: "", phone: "", email: "", field: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isContact = step === TOTAL;
  const q = DIAGNOSTIC_QUESTIONS[step];
  const currentValue = q ? answers[q.id] ?? "" : "";

  const progress = Math.round(((step + (isContact ? 1 : 0)) / (TOTAL + 1)) * 100);

  const next = () => {
    if (!isContact) {
      setStep((s) => s + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const parsed = contactSchema.safeParse(contact);
      if (!parsed.success) {
        const e: Record<string, string> = {};
        parsed.error.issues.forEach((i) => (e[i.path[0] as string] = i.message));
        setErrors(e);
        return;
      }
      setContact(parsed.data as typeof contact);
      finalize();
      navigate("/result");
    }
  };

  const back = () => {
    if (step === 0) return;
    setStep((s) => s - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="container-prose py-16 md:py-24">
        {/* progress */}
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between text-xs text-muted-foreground tracking-widest">
            <span>
              {isContact ? "마지막 단계 · 연락 정보" : `${CATEGORY_LABEL[q.category]} · ${step + 1} / ${TOTAL}`}
            </span>
            <span className="font-mono">{progress}%</span>
          </div>
          <div className="mt-3 h-px bg-border relative overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-accent transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="max-w-3xl mx-auto mt-14 fade-in" key={step}>
          {!isContact ? (
            <>
              <p className="font-mono text-xs text-accent">QUESTION {String(step + 1).padStart(2, "0")}</p>
              <h1 className="font-serif mt-4 text-2xl md:text-4xl text-primary leading-[1.35]">
                {q.question}
              </h1>
              <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{q.helper}</p>
              <p className="mt-2 text-xs text-muted-foreground/80">
                정답은 없습니다. 짧아도 괜찮습니다. 다만 구체적으로 쓸수록 진단이 선명해집니다.
              </p>
              <Textarea
                value={currentValue}
                onChange={(e) => setAnswer(q.id, e.target.value)}
                placeholder="여기에 답변을 적어주세요"
                rows={7}
                className="mt-8 text-base resize-none bg-surface"
                maxLength={1500}
              />
              <p className="mt-2 text-right text-xs text-muted-foreground">{currentValue.length} / 1500</p>
            </>
          ) : (
            <>
              <p className="font-mono text-xs text-accent">FINAL STEP</p>
              <h1 className="font-serif mt-4 text-2xl md:text-4xl text-primary leading-snug">
                진단 결과를 받기 전, 마지막으로
                <br />간단한 정보를 부탁드립니다.
              </h1>
              <p className="mt-4 text-sm text-muted-foreground">
                상담으로 이어질 경우 정중하게 안내드릴 수 있는 최소한의 정보만 받습니다.
              </p>
              <div className="mt-10 grid gap-6 md:grid-cols-2">
                {[
                  { key: "name", label: "이름", placeholder: "홍길동" },
                  { key: "phone", label: "연락처", placeholder: "010-0000-0000" },
                  { key: "email", label: "이메일", placeholder: "name@example.com" },
                  { key: "field", label: "현재 직함 / 분야", placeholder: "예: HR 전문가, IT 컨설턴트" },
                ].map((f) => (
                  <FormField key={f.key} id={f.key} label={f.label} error={errors[f.key]}>
                    <Input
                      id={f.key}
                      className="bg-surface"
                      placeholder={f.placeholder}
                      value={(contact as any)[f.key]}
                      onChange={(e) => setLocalContact((c) => ({ ...c, [f.key]: e.target.value }))}
                    />
                  </FormField>
                ))}
              </div>
            </>
          )}

          <div className="mt-12 flex items-center justify-between">
            <button
              onClick={back}
              disabled={step === 0}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground disabled:opacity-30"
            >
              <ArrowLeft size={16} /> 이전
            </button>
            <button
              onClick={next}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-7 py-3.5 rounded-full text-sm hover:bg-primary/90 transition-colors"
            >
              {isContact ? "진단 결과 보기" : "다음"} <ArrowRight size={16} />
            </button>
          </div>
        </div>
    </div>
  );
}
