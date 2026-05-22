import { useState } from "react";
import { useFreeDiagnosticStore } from "@/store/freeDiagnosticStore";
import { CAREER_YEAR_OPTIONS } from "@/data/content";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Check } from "lucide-react";
import { z } from "zod";

const schema = z.object({
  name: z.string().trim().min(1, "이름을 입력해주세요").max(60),
  email: z.string().trim().email("이메일 형식이 올바르지 않습니다"),
  careerYears: z.string().min(1, "경력 연수를 선택해주세요"),
});

interface Props {
  onNext: () => void;
}

export default function EmailCollect({ onNext }: Props) {
  const { setLead, setAgreedPrivacy } = useFreeDiagnosticStore();
  const [form, setForm] = useState({ name: "", email: "", careerYears: "" });
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = () => {
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const e: Record<string, string> = {};
      parsed.error.issues.forEach((i) => (e[i.path[0] as string] = i.message));
      setErrors(e);
      return;
    }
    if (!agreed) {
      setErrors({ agreed: "개인정보 수집·이용에 동의해주세요" });
      return;
    }
    setErrors({});
    setLead(parsed.data);
    setAgreedPrivacy(true);
    onNext();
  };

  return (
    <div className="container-prose py-16 md:py-28 fade-in">
      <div className="max-w-2xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-bold mb-8 border border-accent/20">
          <Sparkles size={16} />
          <span>경력 가치 무료 진단</span>
        </div>

        {/* Headline */}
        <h1 className="font-serif text-3xl md:text-5xl text-primary leading-[1.2] tracking-tight break-keep">
          내 경력의 진짜 가치를 증명할{" "}
          <br className="hidden md:block" />
          나만의{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary/80">
            한 문장
          </span>
          을 찾아서
        </h1>
        <p className="mt-6 text-lg text-foreground/70 leading-relaxed break-keep">
          단 7개의 질문으로 내 경력의 빛나는 순간과 숨겨진 핵심 자산을 진단해 보세요.
        </p>

        {/* Form */}
        <div className="mt-12 space-y-5">
          <div>
            <Label htmlFor="name" className="text-sm font-medium text-foreground/80">
              이름
            </Label>
            <Input
              id="name"
              className="mt-2 bg-surface"
              placeholder="홍길동"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
            {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
          </div>

          <div>
            <Label htmlFor="email" className="text-sm font-medium text-foreground/80">
              이메일
            </Label>
            <Input
              id="email"
              type="email"
              className="mt-2 bg-surface"
              placeholder="example@email.com"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            />
            {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
          </div>

          <div>
            <Label htmlFor="careerYears" className="text-sm font-medium text-foreground/80">
              경력 연수
            </Label>
            <select
              id="careerYears"
              className="mt-2 w-full h-10 rounded-md border border-input bg-surface px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              value={form.careerYears}
              onChange={(e) => setForm((f) => ({ ...f, careerYears: e.target.value }))}
            >
              <option value="">선택해주세요</option>
              {CAREER_YEAR_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            {errors.careerYears && (
              <p className="mt-1 text-xs text-destructive">{errors.careerYears}</p>
            )}
          </div>

          {/* Privacy */}
          <label className="flex items-start gap-3 mt-6 cursor-pointer">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-border text-accent focus:ring-accent"
            />
            <span className="text-xs text-muted-foreground leading-relaxed">
              개인정보 수집·이용에 동의합니다. 수집된 정보는 진단 결과 발송 및 서비스 안내 목적으로만
              사용됩니다.
            </span>
          </label>
          {errors.agreed && <p className="mt-1 text-xs text-destructive">{errors.agreed}</p>}

          {/* CTA */}
          <button
            onClick={handleSubmit}
            className="w-full mt-6 bg-primary text-primary-foreground py-4 rounded-full text-base font-bold hover:bg-primary/90 transition-colors shadow-soft"
          >
            무료 진단 시작하기
          </button>
        </div>

        {/* Trust Indicators */}
        <div className="mt-8 flex items-center justify-center gap-6 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Check size={14} className="text-accent" /> 무료
          </span>
          <span className="flex items-center gap-1.5">
            <Check size={14} className="text-accent" /> 5~8분 완료
          </span>
          <span className="flex items-center gap-1.5">
            <Check size={14} className="text-accent" /> AI 즉시 분석
          </span>
        </div>
      </div>
    </div>
  );
}
