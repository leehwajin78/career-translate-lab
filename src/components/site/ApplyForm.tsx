import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { ApplyProductKey } from "@/data/content";
import { APPLY_PRODUCTS } from "@/data/content";

/* ─── 유효성 스키마 ─── */

const schema = z
  .object({
    name: z.string().trim().min(1, "성함을 입력해 주세요"),
    phone: z.string().trim().min(7, "연락처를 정확히 입력해 주세요"),
    email: z.string().trim().email("이메일 형식이 올바르지 않습니다"),
    contactMethod: z.string().min(1, "연락 받기 편한 방법을 선택해 주세요"),
    kakaoId: z.string().optional(),
    contactTimes: z.array(z.string()).min(1, "연락 받기 편한 시간대를 선택해 주세요"),
    situation: z.string().optional(),
    startTiming: z.string().min(1, "시작 희망 시기를 선택해 주세요"),
    needInvoice: z.string().min(1, "세금계산서 발행 여부를 선택해 주세요"),
    bizNumber: z.string().optional(),
    bizName: z.string().optional(),
    agree: z.literal(true, {
      errorMap: () => ({ message: "개인정보 수집·이용에 동의해 주세요" }),
    }),
  })
  .refine(
    (d) => d.contactMethod !== "카카오톡" || (d.kakaoId && d.kakaoId.trim().length > 0),
    { message: "카카오톡 ID를 입력해 주세요", path: ["kakaoId"] },
  )
  .refine(
    (d) =>
      d.needInvoice !== "네, 발행이 필요합니다" ||
      (d.bizNumber && d.bizNumber.trim().length > 0),
    { message: "사업자번호를 입력해 주세요", path: ["bizNumber"] },
  );

type FormData = z.input<typeof schema>;

const INITIAL: FormData = {
  name: "",
  phone: "",
  email: "",
  contactMethod: "",
  kakaoId: "",
  contactTimes: [],
  situation: "",
  startTiming: "",
  needInvoice: "",
  bizNumber: "",
  bizName: "",
  agree: false as any,
};

const CONTACT_METHODS = ["전화 통화", "카카오톡", "이메일"];

const CONTACT_TIMES = [
  "평일 오전 (10시 ~ 12시)",
  "평일 오후 (13시 ~ 18시)",
  "평일 저녁 (18시 이후)",
  "토요일 오전",
  "언제든 괜찮습니다",
];

const START_TIMINGS = [
  "가능한 빨리",
  "1~2주 후",
  "1개월 이내",
  "아직 정하지 않음",
];

/* ─── 공통 라벨 래퍼 (IME 입력 버그 방지를 위해 컴포넌트 외부로 분리) ─── */
interface FieldProps {
  id: string;
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}

function Field({ id, label, required, hint, error, children }: FieldProps) {
  return (
    <div id={`field-${id}`} className="scroll-mt-24">
      <label htmlFor={id} className="block text-base font-bold text-foreground mb-1">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {hint && (
        <p className="text-sm text-foreground/50 mb-2 leading-relaxed break-keep">{hint}</p>
      )}
      <div className="mt-1.5">{children}</div>
      {error && (
        <p className="mt-1.5 text-sm text-red-500 font-medium">{error}</p>
      )}
    </div>
  );
}

interface ApplyFormProps {
  productKey: ApplyProductKey;
}


export default function ApplyForm({ productKey }: ApplyFormProps) {
  const navigate = useNavigate();
  const product = APPLY_PRODUCTS[productKey];

  const [form, setForm] = useState<FormData>({ ...INITIAL });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);

  const update = <K extends keyof FormData>(k: K, v: FormData[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const toggleTime = (v: string) =>
    setForm((f) => ({
      ...f,
      contactTimes: (f.contactTimes as string[]).includes(v)
        ? (f.contactTimes as string[]).filter((x) => x !== v)
        : [...(f.contactTimes as string[]), v],
    }));

  /* ─── 제출 ─── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);

    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((i) => {
        const key = i.path[0] as string;
        if (!errs[key]) errs[key] = i.message;
      });
      setErrors(errs);

      /* 첫 에러 필드로 스크롤 */
      const firstKey = Object.keys(errs)[0];
      const el = document.getElementById(`field-${firstKey}`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setErrors({});
    setSubmitting(true);

    /* Netlify Forms 제출 */
    try {
      const body = new URLSearchParams();
      body.append("form-name", product.formName);
      body.append("product", product.name);
      body.append("name", parsed.data.name);
      body.append("phone", parsed.data.phone);
      body.append("email", parsed.data.email);
      body.append("contactMethod", parsed.data.contactMethod);
      if (parsed.data.kakaoId) body.append("kakaoId", parsed.data.kakaoId);
      body.append("contactTimes", (parsed.data.contactTimes as string[]).join(", "));
      if (parsed.data.situation) body.append("situation", parsed.data.situation);
      body.append("startTiming", parsed.data.startTiming);
      body.append("needInvoice", parsed.data.needInvoice);
      if (parsed.data.bizNumber) body.append("bizNumber", parsed.data.bizNumber);
      if (parsed.data.bizName) body.append("bizName", parsed.data.bizName);

      await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      });
    } catch {
      /* Netlify가 없는 개발 환경에서는 무시 */
    }

    navigate(`/apply/thank-you?product=${productKey}`);
  };


  return (
    <section className="mb-16">
      {/* 폼 제목 */}
      <h2 className="font-serif text-2xl md:text-3xl font-extrabold text-[#1E2D8C] mb-3">
        신청 정보를 입력해 주세요
      </h2>
      <p className="text-base text-foreground/60 leading-[1.7] mb-10 break-keep">
        신청 후 24시간 안에 운영자가 직접 연락드려 일정과 진행 방식을 안내해 드립니다.
        <br />
        결제는 통화 후 진행되므로, 지금은 결제하지 않습니다.
      </p>

      {/* Netlify hidden form (for bot detection) */}
      <form name={product.formName} data-netlify="true" hidden>
        <input type="hidden" name="form-name" value={product.formName} />
        <input name="product" />
        <input name="name" />
        <input name="phone" />
        <input name="email" />
        <input name="contactMethod" />
        <input name="kakaoId" />
        <input name="contactTimes" />
        <textarea name="situation" />
        <input name="startTiming" />
        <input name="needInvoice" />
        <input name="bizNumber" />
        <input name="bizName" />
      </form>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 1. 성함 */}
        <Field id="name" label="성함" required error={errors.name}>
          <Input
            id="name"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="예: 김지영"
            className="h-12 text-base"
          />
        </Field>

        {/* 2. 연락처 */}
        <Field id="phone" label="연락처" required error={errors.phone}>
          <Input
            id="phone"
            type="tel"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            placeholder="010-1234-5678"
            className="h-12 text-base"
          />
        </Field>

        {/* 3. 이메일 */}
        <Field id="email" label="이메일" required error={errors.email}>
          <Input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="example@email.com"
            className="h-12 text-base"
          />
        </Field>

        {/* 4. 연락 받기 편한 방법 */}
        <Field id="contactMethod" label="연락 받기 편한 방법" required error={errors.contactMethod}>
          <RadioGroup
            value={form.contactMethod}
            onValueChange={(v) => update("contactMethod", v)}
            className="flex flex-wrap gap-x-6 gap-y-3 mt-1"
          >
            {CONTACT_METHODS.map((m) => (
              <label key={m} className="flex items-center gap-2 cursor-pointer text-base">
                <RadioGroupItem value={m} />
                {m}
              </label>
            ))}
          </RadioGroup>

          {/* 카카오톡 ID 조건부 노출 */}
          {form.contactMethod === "카카오톡" && (
            <div className="mt-4 pl-6 border-l-2 border-[#1E2D8C]/20">
              <label htmlFor="kakaoId" className="block text-sm font-medium text-foreground/70 mb-1">
                카카오톡 ID
              </label>
              <Input
                id="kakaoId"
                value={form.kakaoId || ""}
                onChange={(e) => update("kakaoId", e.target.value)}
                placeholder="카카오톡 ID를 입력해 주세요"
                className="h-11 text-base max-w-sm"
              />
              {errors.kakaoId && (
                <p className="mt-1.5 text-sm text-red-500 font-medium">{errors.kakaoId}</p>
              )}
            </div>
          )}
        </Field>

        {/* 5. 연락 받기 편한 시간대 */}
        <Field id="contactTimes" label="연락 받기 편한 시간대" required hint="여러 개 선택 가능합니다" error={errors.contactTimes}>
          <div className="grid gap-3 sm:grid-cols-2 mt-1">
            {CONTACT_TIMES.map((t) => (
              <label key={t} className="flex items-center gap-2.5 cursor-pointer text-base">
                <Checkbox
                  checked={(form.contactTimes as string[]).includes(t)}
                  onCheckedChange={() => toggleTime(t)}
                />
                {t}
              </label>
            ))}
          </div>
        </Field>

        {/* 6. 현재 상황 (선택) */}
        <Field
          id="situation"
          label="현재 어떤 상황이신지 간단히 알려주세요"
          hint="선택 항목입니다. 미리 알려주시면 더 깊이 있는 상담이 가능합니다."
          error={errors.situation}
        >
          <Textarea
            id="situation"
            rows={6}
            value={form.situation || ""}
            onChange={(e) => update("situation", e.target.value)}
            placeholder="예: 25년간 IT 업계에서 일했고, 올해 퇴직 예정입니다. 강의 활동을 시작하고 싶은데 어떻게 준비해야 할지 막막합니다."
            className="text-base leading-[1.7]"
          />
        </Field>

        {/* 7. 시작 희망 시기 */}
        <Field id="startTiming" label="시작 희망 시기" required error={errors.startTiming}>
          <RadioGroup
            value={form.startTiming}
            onValueChange={(v) => update("startTiming", v)}
            className="grid gap-3 sm:grid-cols-2 mt-1"
          >
            {START_TIMINGS.map((t) => (
              <label key={t} className="flex items-center gap-2 cursor-pointer text-base">
                <RadioGroupItem value={t} />
                {t}
              </label>
            ))}
          </RadioGroup>
        </Field>

        {/* 8. 세금계산서 발행 */}
        <Field id="needInvoice" label="세금계산서 발행이 필요하신가요?" required error={errors.needInvoice}>
          <RadioGroup
            value={form.needInvoice}
            onValueChange={(v) => update("needInvoice", v)}
            className="grid gap-3 mt-1"
          >
            <label className="flex items-center gap-2 cursor-pointer text-base">
              <RadioGroupItem value="네, 발행이 필요합니다" />
              네, 발행이 필요합니다
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-base">
              <RadioGroupItem value="아니오, 개인 결제입니다" />
              아니오, 개인 결제입니다
            </label>
          </RadioGroup>

          {/* 사업자 정보 조건부 노출 */}
          {form.needInvoice === "네, 발행이 필요합니다" && (
            <div className="mt-4 pl-6 border-l-2 border-[#1E2D8C]/20 space-y-3">
              <div>
                <label htmlFor="bizNumber" className="block text-sm font-medium text-foreground/70 mb-1">
                  사업자번호
                </label>
                <Input
                  id="bizNumber"
                  value={form.bizNumber || ""}
                  onChange={(e) => update("bizNumber", e.target.value)}
                  placeholder="000-00-00000"
                  className="h-11 text-base max-w-sm"
                />
                {errors.bizNumber && (
                  <p className="mt-1.5 text-sm text-red-500 font-medium">{errors.bizNumber}</p>
                )}
              </div>
              <div>
                <label htmlFor="bizName" className="block text-sm font-medium text-foreground/70 mb-1">
                  사업자명 (상호)
                </label>
                <Input
                  id="bizName"
                  value={form.bizName || ""}
                  onChange={(e) => update("bizName", e.target.value)}
                  placeholder="사업자명"
                  className="h-11 text-base max-w-sm"
                />
              </div>
            </div>
          )}
        </Field>

        {/* 9. 개인정보 수집·이용 동의 */}
        <div id="field-agree" className="scroll-mt-24">
          <div className="bg-secondary/40 border border-border rounded-xl p-5">
            <label className="flex items-start gap-3 cursor-pointer">
              <Checkbox
                checked={form.agree as unknown as boolean}
                onCheckedChange={(v) => update("agree", v as any)}
                className="mt-1"
              />
              <span className="text-base text-foreground/80 leading-relaxed font-medium">
                신청 처리 및 상담 진행을 위해 개인정보 수집·이용에 동의합니다{" "}
                <span className="text-red-500">(필수)</span>
              </span>
            </label>

            <button
              type="button"
              onClick={() => setPrivacyOpen(!privacyOpen)}
              className="mt-2 ml-8 text-sm text-[#1E2D8C]/60 hover:text-[#1E2D8C] underline underline-offset-4 transition-colors"
            >
              {privacyOpen ? "닫기" : "[자세히]"}
            </button>

            {privacyOpen && (
              <div className="mt-3 ml-8 text-sm text-foreground/60 leading-[1.7] space-y-1 bg-background rounded-lg p-4 border border-border">
                <p>
                  <strong className="text-foreground/80">수집 항목:</strong> 성함, 연락처, 이메일, 카카오톡
                  ID(선택)
                </p>
                <p>
                  <strong className="text-foreground/80">이용 목적:</strong> 신청 상담, 결제 안내, 서비스 진행
                </p>
                <p>
                  <strong className="text-foreground/80">보유 기간:</strong> 신청 처리 종료 후 1년
                </p>
              </div>
            )}

            {errors.agree && (
              <p className="mt-2 ml-8 text-sm text-red-500 font-medium">{errors.agree}</p>
            )}
          </div>
        </div>

        {/* 10. 제출 버튼 */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full md:w-auto md:min-w-[320px] mx-auto block bg-[#1E2D8C] text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-[#1E2D8C]/90 transition-all shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? "보내는 중..." : "신청서 보내기"}
        </button>
      </form>
    </section>
  );
}
