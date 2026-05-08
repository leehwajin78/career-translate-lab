import { useState } from "react";
import { Link } from "react-router-dom";
import { z } from "zod";
import { FormField } from "@/components/ui/form-field";
import { GoldDivider, NumberedLabel } from "@/components/site/Editorial";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CHANNEL_OPTIONS, OUTCOME_OPTIONS, PURPOSE_OPTIONS } from "@/data/content";
import { useDiagnosticStore } from "@/store/diagnostic";
import { useLeadsStore } from "@/store/leads";

const schema = z.object({
  name: z.string().trim().min(1, "이름을 입력해주세요").max(60),
  phone: z.string().trim().min(7, "연락처를 정확히 입력해주세요").max(30),
  email: z.string().trim().email("이메일 형식이 올바르지 않습니다").max(120),
  field: z.string().trim().min(1, "현재 직함/분야를 입력해주세요").max(120),
  career: z.string().trim().min(1, "주요 경력을 간단히 적어주세요").max(2000),
  purposes: z.array(z.string()).min(1, "관심 목적을 하나 이상 선택해주세요"),
  challenge: z.string().trim().min(1, "현재 가장 어려운 점을 적어주세요").max(2000),
  outcomes: z.array(z.string()).min(1, "원하는 결과물을 하나 이상 선택해주세요"),
  channel: z.string().min(1, "상담 희망 방식을 선택해주세요"),
  agree: z.literal(true, { errorMap: () => ({ message: "개인정보 활용에 동의해주세요" }) }),
});

type Form = z.infer<typeof schema>;

const initial: Form = {
  name: "", phone: "", email: "", field: "", career: "",
  purposes: [], challenge: "", outcomes: [], channel: "", agree: false as any,
};

export default function Consultation() {
  const [form, setForm] = useState<Form>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const { result } = useDiagnosticStore();
  const addLead = useLeadsStore((s) => s.addLead);

  const update = <K extends keyof Form>(k: K, v: Form[K]) => setForm((f) => ({ ...f, [k]: v }));

  const toggleArr = (k: "purposes" | "outcomes", v: string) => {
    setForm((f) => {
      const arr = f[k];
      return { ...f, [k]: arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v] };
    });
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const e: Record<string, string> = {};
      parsed.error.issues.forEach((i) => (e[i.path[0] as string] = i.message));
      setErrors(e);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setErrors({});
    addLead({
      name: parsed.data.name,
      phone: parsed.data.phone,
      email: parsed.data.email,
      field: parsed.data.field,
      career: parsed.data.career,
      purposes: parsed.data.purposes,
      challenge: parsed.data.challenge,
      outcomes: parsed.data.outcomes,
      channel: parsed.data.channel,
      diagnosticScore: result?.totalScore,
      diagnosticType: result?.type,
      recommendedPackage: result?.recommendedPackage,
    });
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (submitted) {
    return (
      <div className="container-prose py-32 text-center max-w-2xl mx-auto">
        <NumberedLabel number="✓" className="justify-center">접수 완료</NumberedLabel>
        <h1 className="font-serif mt-6 text-3xl md:text-4xl text-primary leading-snug">
          상담 신청이 완료되었습니다.
        </h1>
        <p className="mt-6 text-base md:text-lg text-muted-foreground leading-relaxed">
          작성해주신 내용을 검토한 뒤, 현재 경력 상태와 필요한 브랜드 자산 범위를
          기준으로 가장 적합한 진행 방식을 안내드리겠습니다.
        </p>
        <div className="mt-10">
          <Link to="/" className="text-sm text-accent hover:underline">홈으로 돌아가기 →</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-prose py-16 md:py-24">
        <div className="max-w-3xl mx-auto">
          <NumberedLabel number="09">상담 신청</NumberedLabel>
          <h1 className="font-serif mt-5 text-3xl md:text-5xl text-primary leading-tight">
            진단 결과를 바탕으로
            <br />1:1 상담을 신청하세요.
          </h1>
          {result && (
            <p className="mt-5 text-sm text-muted-foreground">
              현재 진단 점수 <span className="text-accent font-mono">{result.totalScore}</span> ·
              유형 <span className="text-foreground">{result.typeInfo.name}</span> 정보가 함께 전달됩니다.
            </p>
          )}

          <form onSubmit={submit} className="mt-14 space-y-10">
            {/* basic */}
            <section className="grid gap-5 md:grid-cols-2">
              <FormField label="이름" id="name" error={errors.name}>
                <Input id="name" value={form.name} onChange={(e) => update("name", e.target.value)} />
              </FormField>
              <FormField label="연락처" id="phone" error={errors.phone}>
                <Input id="phone" value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="010-0000-0000" />
              </FormField>
              <FormField label="이메일" id="email" error={errors.email}>
                <Input id="email" value={form.email} onChange={(e) => update("email", e.target.value)} />
              </FormField>
              <FormField label="현재 직함 / 분야" id="field" error={errors.field}>
                <Input id="field" value={form.field} onChange={(e) => update("field", e.target.value)} />
              </FormField>
            </section>

            <GoldDivider />

            <FormField label="주요 경력" id="career" error={errors.career} hint="간단한 핵심 경력 위주로 적어주세요.">
              <Textarea id="career" rows={5} value={form.career} onChange={(e) => update("career", e.target.value)} />
            </FormField>

            <FormField label="관심 목적" id="purposes" error={errors.purposes} hint="복수 선택 가능">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-1">
                {PURPOSE_OPTIONS.map((p) => (
                  <label key={p} className="flex items-center gap-2 cursor-pointer text-sm">
                    <Checkbox checked={form.purposes.includes(p)} onCheckedChange={() => toggleArr("purposes", p)} />
                    {p}
                  </label>
                ))}
              </div>
            </FormField>

            <FormField label="현재 가장 어려운 점" id="challenge" error={errors.challenge}>
              <Textarea id="challenge" rows={5} value={form.challenge} onChange={(e) => update("challenge", e.target.value)} />
            </FormField>

            <FormField label="원하는 결과물" id="outcomes" error={errors.outcomes} hint="복수 선택 가능">
              <div className="grid sm:grid-cols-2 gap-3 mt-1">
                {OUTCOME_OPTIONS.map((p) => (
                  <label key={p} className="flex items-center gap-2 cursor-pointer text-sm">
                    <Checkbox checked={form.outcomes.includes(p)} onCheckedChange={() => toggleArr("outcomes", p)} />
                    {p}
                  </label>
                ))}
              </div>
            </FormField>

            <FormField label="상담 희망 방식" id="channel" error={errors.channel}>
              <RadioGroup value={form.channel} onValueChange={(v) => update("channel", v)} className="flex gap-6 mt-1">
                {CHANNEL_OPTIONS.map((c) => (
                  <label key={c} className="flex items-center gap-2 cursor-pointer text-sm">
                    <RadioGroupItem value={c} />
                    {c}
                  </label>
                ))}
              </RadioGroup>
            </FormField>

            <GoldDivider />

            <div>
              <label className="flex items-start gap-3 text-sm text-muted-foreground cursor-pointer">
                <Checkbox
                  checked={form.agree as unknown as boolean}
                  onCheckedChange={(v) => update("agree", v as any)}
                  className="mt-0.5"
                />
                <span>
                  상담 진행을 위한 개인정보(이름, 연락처, 이메일, 작성 내용)의 수집·이용에 동의합니다.
                  수집된 정보는 상담 안내 목적으로만 사용되며, 1년 후 파기됩니다.
                </span>
              </label>
              {errors.agree && <p className="mt-2 text-xs text-destructive">{errors.agree}</p>}
            </div>

            <button
              type="submit"
              className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full text-base hover:bg-primary/90"
            >
              진단 결과 기반 상담 신청하기 →
            </button>
          </form>
        </div>
    </div>
  );
}
