'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { z } from "zod";
import { FormField } from "@/components/ui/form-field";
import { GoldDivider, NumberedLabel } from "@/components/site/Editorial";
import { FieldError } from "@/components/ui/error-message";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CHANNEL_OPTIONS, OUTCOME_OPTIONS, PURPOSE_OPTIONS } from "@/data/content";
import { useDiagnosticStore } from "@/store/diagnostic";
import { useFreeDiagnosticStore } from "@/store/freeDiagnosticStore";
import { useLeadsStore } from "@/store/leads";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel } from "@/components/ui/alert-dialog";

const schema = z.object({
  name: z.string().trim().min(1, "이름을 입력해주세요").max(60),
  phone: z.string().trim().min(7, "연락처를 정확히 입력해주세요").max(30),
  email: z.string().trim().email("이메일 형식이 올바르지 않습니다").max(120),
  field: z.string().trim().min(1, "현재 직함/분야를 입력해주세요").max(120),
  career: z.string().trim().max(2000),
  purposes: z.array(z.string()).min(1, "관심 목적을 하나 이상 선택해주세요"),
  challenge: z.string().trim().max(2000),
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
  const router = useRouter();
  const navigate = (p: string) => router.push(p);
  const [form, setForm] = useState<Form>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [showRedirectModal, setShowRedirectModal] = useState(false);
  
  const searchParams = useSearchParams();
  const typeParam = searchParams.get("type"); // "free" or "paid"

  // 자가 무료 진단 스토어에서 결과를 가져옴
  const { result: freeResult, lead: freeLead, answers: freeAnswers, outputAssets: freeOutputAssets } = useFreeDiagnosticStore();
  const result = freeResult;

  useEffect(() => {
    // 무료 해석 상담인데 무료 자가 진단 결과(result)가 없는 경우 모달을 띄워 유도합니다.
    if (typeParam !== "paid" && !result) {
      setShowRedirectModal(true);
    }
  }, [typeParam, result]);

  const addLead = useLeadsStore((s) => s.addLead);

  // 무료 진단 데이터 자동 연동 (이름, 이메일, 경력 연차, 진단 갭 기반 고민거리)
  useEffect(() => {
    if (freeLead) {
      setForm((f) => ({
        ...f,
        name: f.name || freeLead.name || "",
        email: f.email || freeLead.email || "",
        career: f.career || (freeLead.careerYears ? `경력 연차: ${freeLead.careerYears}\n` : ""),
      }));
    }
  }, [freeLead]);

  useEffect(() => {
    if (freeResult?.gaps) {
      const defaultChallenge = `[자가 진단 분석 결과 보완이 필요한 부분]\n- 타깃 설계: ${freeResult.gaps.target}\n- 차별화 인식: ${freeResult.gaps.differentiation}\n- 메시지 압축: ${freeResult.gaps.message}`;
      setForm((f) => ({
        ...f,
        challenge: f.challenge || defaultChallenge,
      }));
    }
  }, [freeResult]);

  // 상담 신청 유형 파라미터가 paid 일 때 '원하는 결과물'에 전체 패키지 선선택
  useEffect(() => {
    if (typeParam === "paid") {
      setForm((f) => ({
        ...f,
        outcomes: f.outcomes.includes("전체 패키지") ? f.outcomes : [...f.outcomes, "전체 패키지"],
      }));
    } else {
      // free 상담일 경우 원하는 결과물은 비우거나 선택 가능하게
      setForm((f) => ({
        ...f,
        outcomes: f.outcomes.filter(o => o !== "전체 패키지"),
      }));
    }
  }, [typeParam]);

  const update = <K extends keyof Form>(k: K, v: Form[K]) => setForm((f) => ({ ...f, [k]: v }));

  const toggleArr = (k: "purposes" | "outcomes", v: string) => {
    setForm((f) => {
      const arr = f[k];
      return { ...f, [k]: arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v] };
    });
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    // 무료 해석 상담일 때 Zod validation outcomes(결과물) 조건 우회를 위해 mock 셋업
    let submitForm = { ...form };
    if (typeParam !== "paid" && submitForm.outcomes.length === 0) {
      submitForm.outcomes = ["무료 해석 상담"];
    }

    const parsed = schema.safeParse(submitForm);
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
      diagnosticType: result?.typeInfo?.name || result?.type,
      recommendedPackage: typeParam === "paid" ? "positioning" : undefined,
      answers: freeAnswers,
      outputAssets: freeOutputAssets,
      scores: freeResult?.scores,
      status: "신규 리드",
      memo: typeParam === "paid" ? "[정식 유료 진단 신청 리드]" : "[1:1 무료 해석 상담 신청 리드]",
    });
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (submitted) {
    return (
      <div className="container-prose py-32 text-center max-w-2xl mx-auto">
        <NumberedLabel number="✓" className="justify-center">접수 완료</NumberedLabel>
        <h1 className="font-serif mt-6 text-3xl md:text-4xl text-primary leading-snug">
          {typeParam === "paid" ? "정식 한끗 진단 신청이 접수되었습니다." : "1:1 무료 해석 상담 신청이 완료되었습니다."}
        </h1>
        <p className="mt-6 text-base md:text-lg text-muted-foreground leading-relaxed">
          {typeParam === "paid" 
            ? "기입해주신 경력 기본 데이터를 검토하여 1영업일 이내에 정식 1:1 심층 인터뷰 일정 조율 및 결제 안내 연락(전화/문자)을 드리겠습니다."
            : "작성해주신 진단 결과와 갭(Gap) 리포트를 분석하여, 지정하신 상담 방식으로 가장 적합한 해석 상담 일정을 안내해 드리겠습니다."}
        </p>
        <div className="mt-10">
          <Link href="/" className="text-sm text-accent hover:underline font-bold">홈으로 돌아가기 →</Link>
        </div>
      </div>
    );
  }

  // ─────────────── RENDER 1: 유료 정식 한끗 진단 신청 페이지 ───────────────
  if (typeParam === "paid") {
    return (
      <div className="container-prose py-16 md:py-24">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-accent text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">STEP 1</span>
            <span className="text-sm font-semibold text-muted-foreground">정식 프로그램 신청</span>
          </div>
          
          <h1 className="font-serif text-3xl md:text-5xl text-primary leading-tight font-extrabold">
            정식 한끗 진단 프로그램 신청
          </h1>
          <p className="mt-4 text-base text-muted-foreground leading-relaxed">
            본격적인 경력 자산 브랜딩의 첫걸음. 오랜 경력의 맥락과 시장성을 구조화하고, 세상이 기억할 대표 원라이너와 기획 로드맵을 손에 쥡니다.
          </p>

          {/* 프리미엄 상품 정보 안내 상자 */}
          <div className="mt-8 bg-secondary/35 border-2 border-accent/20 rounded-3xl p-6 md:p-8 shadow-sm">
            <div className="flex justify-between items-baseline flex-wrap gap-2">
              <h3 className="font-serif text-2xl text-primary font-bold">프로그램 패키지: 한끗 진단</h3>
              <p className="font-mono text-2xl text-accent font-bold">500,000원 <span className="text-xs text-muted-foreground font-normal">(부가세 별도 / 1주 소요)</span></p>
            </div>
            <GoldDivider className="my-5" />
            <ul className="grid gap-3 text-sm text-foreground/80 font-medium md:grid-cols-2">
              <li className="flex gap-2"><span className="text-accent shrink-0 font-bold">✓</span> 1:1 심층 인터뷰 대면/Zoom (60분)</li>
              <li className="flex gap-2"><span className="text-accent shrink-0 font-bold">✓</span> 공식 진단 리포트 (A4 3~5장 분량)</li>
              <li className="flex gap-2"><span className="text-accent shrink-0 font-bold">✓</span> 차별화 자산 로드맵 & 1페이지 기획</li>
              <li className="flex gap-2"><span className="text-accent shrink-0 font-bold">✓</span> 1:1 해석 미팅 (30분)</li>
            </ul>
          </div>

          <form onSubmit={submit} className="mt-12 space-y-10">
            {/* 기본 연락처 정보 */}
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
                <Input id="field" value={form.field} onChange={(e) => update("field", e.target.value)} placeholder="예: 브랜드 디렉터 / 마케팅" />
              </FormField>
            </section>

            <GoldDivider />

            {/* 정식 인터뷰를 위한 심층 질문 구역 */}
            <FormField label="주요 경력 상세 기술 (필수)" id="career" error={errors.career} hint="인터뷰 설계를 위해 경력과 성취하신 주요 성과 위주로 상세히 적어주세요.">
              <Textarea id="career" rows={6} value={form.career} onChange={(e) => update("career", e.target.value)} placeholder="예: 대기업 브랜드 총괄 15년 근무하며 3개 브랜딩 리뉴얼 프로젝트 성사, 독립 마케터 컨설팅 경력 3년" />
            </FormField>

            <FormField label="관심 목적" id="purposes" error={errors.purposes} hint="진단을 통해 연결하고 싶은 궁극적인 기회를 모두 선택해 주세요 (복수 선택 가능)">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-1">
                {PURPOSE_OPTIONS.map((p) => (
                  <label key={p} className="flex items-center gap-2 cursor-pointer text-sm">
                    <Checkbox checked={form.purposes.includes(p)} onCheckedChange={() => toggleArr("purposes", p)} />
                    {p}
                  </label>
                ))}
              </div>
            </FormField>

            <FormField label="현재 브랜딩 설계의 가장 큰 장애물 (필수)" id="challenge" error={errors.challenge} hint="진단 리포트에서 가장 깊이 다루고 싶은 고민거리를 상세히 적어주세요.">
              <Textarea id="challenge" rows={6} value={form.challenge} onChange={(e) => update("challenge", e.target.value)} />
            </FormField>

            <FormField label="최종 희망하는 브랜드 자산 종류" id="outcomes" error={errors.outcomes} hint="복수 선택 가능">
              <div className="grid sm:grid-cols-2 gap-3 mt-1">
                {OUTCOME_OPTIONS.map((p) => (
                  <label key={p} className="flex items-center gap-2 cursor-pointer text-sm">
                    <Checkbox checked={form.outcomes.includes(p)} onCheckedChange={() => toggleArr("outcomes", p)} />
                    {p}
                  </label>
                ))}
              </div>
            </FormField>

            <FormField label="정식 심층 인터뷰 진행 방식" id="channel" error={errors.channel}>
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
                  정식 프로그램 진행을 위한 개인정보 수집·이용에 동의하며, 한끗 진단 신청 절차를 시작합니다.
                  (작성하신 내용은 진단 리포트 작성용으로만 활용되며 안전하게 1년 후 파기됩니다.)
                </span>
              </label>
              {errors.agree && <FieldError className="mt-2 ml-7">{errors.agree}</FieldError>}
            </div>

            <button
              type="submit"
              className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-accent text-white px-10 py-4.5 rounded-full text-base font-extrabold hover:bg-accent/90 shadow-lg transition-transform hover:scale-[1.02]"
            >
              정식 한끗 진단 신청하기 (500,000원)
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ─────────────── RENDER 2: 1:1 무료 해석 상담 신청 페이지 ───────────────
  return (
    <div className="container-prose py-16 md:py-24">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">30분 무료 상담</span>
            <span className="text-sm font-semibold text-muted-foreground">자가진단 기반</span>
          </div>

          <h1 className="font-serif text-3xl md:text-5xl text-primary leading-tight font-bold">
            1:1 무료 해석 상담 신청
          </h1>
          <p className="mt-4 text-base text-muted-foreground leading-relaxed">
            방금 분석 완료된 자가진단 리포트의 점수와 갭(Gap)을 기반으로, 30분간 1:1 라이브 미팅을 통해 내 경력 브랜드의 다음 보완 방향과 핵심 단서를 명쾌하게 해석해 드립니다.
          </p>

          <form onSubmit={submit} className="mt-12 space-y-10">
            {/* 기본 입력 항목 */}
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
                <Input id="field" value={form.field} onChange={(e) => update("field", e.target.value)} placeholder="예: 브랜드 디렉터 / 마케팅" />
              </FormField>
            </section>

            <GoldDivider />

            <FormField label="추가로 들려주실 경력 요약 (선택)" id="career" error={errors.career} hint="상담에 도움될 추가적인 약력이나 하시는 일의 성격이 있다면 편하게 기술해 주세요.">
              <Textarea id="career" rows={4} value={form.career} onChange={(e) => update("career", e.target.value)} placeholder="예: 대기업 브랜드 총괄 15년" />
            </FormField>

            <FormField label="관심 목적" id="purposes" error={errors.purposes} hint="향후 어떤 방향성으로 브랜딩을 강화하고 싶으신지 모두 골라주세요 (복수 선택 가능)">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-1">
                {PURPOSE_OPTIONS.map((p) => (
                  <label key={p} className="flex items-center gap-2 cursor-pointer text-sm">
                    <Checkbox checked={form.purposes.includes(p)} onCheckedChange={() => toggleArr("purposes", p)} />
                    {p}
                  </label>
                ))}
              </div>
            </FormField>

            <FormField label="상담 시 집중 조율하고 싶은 고민 사항 (선택)" id="challenge" error={errors.challenge} hint="진단 결과의 갭(Gap) 중 특히 어떤 영역에 대한 해석을 원하시는지 적어주시면 좋습니다.">
              <Textarea id="challenge" rows={4} value={form.challenge} onChange={(e) => update("challenge", e.target.value)} />
            </FormField>

            <FormField label="희망하는 미팅 방식" id="channel" error={errors.channel}>
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
                  수집된 정보는 상담 안내 및 진행 목적으로만 사용되며, 상담 완료 1년 후 안전하게 파기됩니다.
                </span>
              </label>
              {errors.agree && <FieldError className="mt-2 ml-7">{errors.agree}</FieldError>}
            </div>

            <button
              type="submit"
              className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full text-base hover:bg-primary/90"
            >
              1:1 무료 해석 상담 신청하기
            </button>
          </form>
        </div>

        {/* 자가진단 미완료 시 노출할 안내 팝업 모달 */}
        <AlertDialog open={showRedirectModal} onOpenChange={setShowRedirectModal}>
          <AlertDialogContent className="max-w-md rounded-3xl p-6 md:p-8 border border-border bg-card shadow-xl">
            <AlertDialogHeader className="text-left">
              <AlertDialogTitle className="font-serif text-2xl text-primary font-bold flex items-center gap-2">
                💡 자가 진단 결과를 준비해 주세요!
              </AlertDialogTitle>
              <AlertDialogDescription className="text-sm text-muted-foreground leading-relaxed mt-4">
                <strong>1:1 무료 해석 상담</strong>은 자가 진단 리포트를 기반으로 피드백을 드리는 상담입니다.
                <br /><br />
                진단 데이터를 먼저 만들어 두시면, 30분 상담 동안 훨씬 더 날카롭고 의미 있는 분석과 보완 방향을 집어드릴 수 있습니다. 
                <br /><br />
                <strong>5분 무료 자가 진단을 먼저 진행하시겠어요?</strong>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="mt-8 flex flex-col sm:flex-row gap-3">
              <AlertDialogCancel 
                className="w-full sm:w-auto border border-border text-xs text-muted-foreground hover:bg-secondary/40 py-2.5 rounded-full"
                onClick={() => setShowRedirectModal(false)}
              >
                그냥 신청서 작성하기
              </AlertDialogCancel>
              <AlertDialogAction 
                className="w-full sm:w-auto bg-accent text-white hover:bg-accent/90 py-2.5 rounded-full text-xs font-bold shadow-soft"
                onClick={() => navigate("/diagnosis")}
              >
                무료 자가 진단 받기 →
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
    </div>
  );
}
