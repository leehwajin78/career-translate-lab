
import CTAButton from "@/components/site/CTAButton";
import { EditorialCard, GoldDivider, NumberedLabel, SectionHeader } from "@/components/site/Editorial";
import {
  COACHING_NOTES,
  DELIVERABLES,
  PACKAGES,
  PROBLEMS,
  STAGES,
  TRUST,
} from "@/data/content";
import { Check, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export default function Index() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="container-prose pt-20 md:pt-32 pb-24 md:pb-40">
          <NumberedLabel number="00">Premium 1:1 Brand Management</NumberedLabel>
          <h1 className="font-serif mt-6 text-4xl md:text-6xl lg:text-7xl leading-[1.15] text-primary fade-in">
            경력을 무대로
            <br />
            번역합니다.
          </h1>
          <p className="mt-8 max-w-2xl text-lg md:text-xl text-foreground/80 leading-relaxed">
            5060 전문가의 축적된 경험을 브랜드 언어, 강의 자산, B2B 제안 자산으로
            정리해 실제 무대와 수익 기회로 연결합니다.
          </p>
          <p className="mt-5 max-w-2xl text-base text-muted-foreground leading-relaxed">
            직함 뒤에 숨어 있던 경험의 가치를, 소개되고 제안되고 선택받는 구조로 바꾸는
            프리미엄 1:1 브랜드 매니지먼트.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <CTAButton to="/diagnosis" variant="primary">내 경력 브랜드 가능성 진단하기</CTAButton>
            <CTAButton to="/consultation" variant="ghost">1:1 상담 신청하기</CTAButton>
          </div>
          <p className="mt-8 text-xs tracking-widest text-muted-foreground">
            28년 프레젠테이션 · 브랜딩 · 교육 설계 경험 기반
          </p>
        </div>
        <div className="absolute -right-40 top-20 w-[480px] h-[480px] rounded-full bg-accent-soft/60 blur-3xl -z-10" />
      </section>

      <GoldDivider />

      {/* PROBLEM */}
      <section id="service" className="editorial-section">
        <div className="container-prose">
          <SectionHeader
            number="01"
            eyebrow="문제 인식"
            title="경력은 충분한데, 왜 아직 브랜드가 되지 않았을까요?"
          />
          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {PROBLEMS.map((p, i) => (
              <EditorialCard key={p.title}>
                <p className="font-mono text-xs text-accent">P0{i + 1}</p>
                <h3 className="font-serif mt-3 text-xl md:text-2xl text-primary leading-snug">{p.title}</h3>
                <p className="mt-4 text-muted-foreground leading-relaxed">{p.body}</p>
              </EditorialCard>
            ))}
          </div>
        </div>
      </section>

      {/* DIAGNOSTIC INTRO */}
      <section id="diagnosis-intro" className="editorial-section bg-secondary/60">
        <div className="container-prose grid gap-12 md:grid-cols-[1.2fr_1fr] items-center">
          <div>
            <NumberedLabel number="02">진단</NumberedLabel>
            <h2 className="font-serif mt-5 text-3xl md:text-[2.5rem] leading-[1.25] text-primary">
              먼저, 내 경력이 브랜드가 될 준비가
              <br />되어 있는지 진단해보세요.
            </h2>
            <p className="mt-6 text-muted-foreground leading-relaxed text-base md:text-lg">
              꿈몰다의 42문항 코칭 IP를 기반으로 핵심 16문항만 선별해
              현재 브랜딩 준비도를 간단히 진단합니다.
            </p>
            <div className="mt-8">
              <CTAButton to="/diagnosis" variant="gold">16문항 진단 시작하기</CTAButton>
            </div>
          </div>
          <EditorialCard className="bg-card/90">
            <p className="text-xs tracking-widest text-accent">DIAGNOSIS</p>
            <p className="font-serif mt-4 text-2xl text-primary leading-snug">7가지 카테고리 · 16개 질문</p>
            <ul className="mt-6 space-y-2.5 text-sm text-foreground/80">
              {["정체성 진단", "핵심 가치", "강점과 전문성", "브랜드 스토리", "타깃과 메시지", "채널과 비전", "원라이너와 WHY"].map((c, i) => (
                <li key={c} className="flex items-center gap-3">
                  <span className="font-mono text-xs text-muted-foreground w-6">0{i + 1}</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </EditorialCard>
        </div>
      </section>

      {/* CORE CONCEPT */}
      <section className="editorial-section">
        <div className="container-prose">
          <SectionHeader
            number="03"
            eyebrow="서비스의 본질"
            title="이 서비스의 본질은 브랜딩이 아니라 번역입니다."
            description="꿈몰다는 고객의 경력, 관점, 철학, 전문성, 네트워크를 42문항 코칭 IP로 해석하고, 그것을 브랜드 프로필, 메시지 구조, 강의안, B2B 제안서, 실행 가이드로 변환합니다."
          />
          <div className="mt-14 grid gap-6 lg:grid-cols-3 lg:gap-4 items-stretch">
            {[
              { tag: "INPUT", title: "당신의 자산", items: ["경력", "관점", "가치관", "전문성", "네트워크", "성취", "실패", "전환점"] },
              { tag: "ENGINE", title: "해석 프레임", items: ["42문항 코칭 IP", "답변 패턴 분석", "브랜딩 요소 태깅", "5060 특화 해석", "사람 코치 검수"] },
              { tag: "OUTPUT", title: "전달 가능한 자산", items: ["브랜드 원라이너", "프로필 소개문", "핵심 가치 3가지", "강점 명제문", "타깃 페르소나", "브랜드 스토리", "채널 전략", "브랜드 WHY", "강의안", "B2B 제안서"] },
            ].map((col, idx) => (
              <div key={col.tag} className="relative">
                <EditorialCard className="h-full bg-surface">
                  <p className="font-mono text-xs tracking-widest text-accent">{col.tag}</p>
                  <h3 className="font-serif mt-3 text-2xl text-primary">{col.title}</h3>
                  <ul className="mt-6 space-y-2 text-sm text-foreground/80">
                    {col.items.map((it) => (
                      <li key={it} className="flex items-start gap-2.5">
                        <span className="mt-2 h-1 w-1 rounded-full bg-accent" />
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                </EditorialCard>
                {idx < 2 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 z-10 -translate-y-1/2 text-accent text-xl">→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section id="process" className="editorial-section bg-secondary/60">
        <div className="container-prose">
          <SectionHeader
            number="04"
            eyebrow="진행 과정"
            title="8주 동안 경력은 하나의 브랜드 자산으로 정리됩니다."
          />
          <div className="mt-14 space-y-6">
            {STAGES.map((s, i) => (
              <div key={s.stage}>
                <EditorialCard>
                  <div className="grid md:grid-cols-[200px_1fr_1fr] gap-6 md:gap-10 items-start">
                    <div>
                      <p className="font-mono text-xs text-accent">{s.stage}</p>
                      <h3 className="font-serif mt-3 text-2xl md:text-3xl text-primary">{s.title}</h3>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">{s.description}</p>
                    <ul className="space-y-2 text-sm">
                      {s.outputs.map((o) => (
                        <li key={o} className="flex items-start gap-2 text-foreground/80">
                          <Check size={14} className="mt-1 text-accent shrink-0" />
                          <span>{o}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </EditorialCard>
                {COACHING_NOTES.find((c) => c.after === i + 1) && (
                  <div className="my-4 flex items-center gap-3 text-xs text-muted-foreground pl-8">
                    <Sparkles size={14} className="text-accent" />
                    <span className="font-medium text-foreground">
                      {COACHING_NOTES.find((c) => c.after === i + 1)?.label}
                    </span>
                    <span>—</span>
                    <span>{COACHING_NOTES.find((c) => c.after === i + 1)?.desc}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DELIVERABLES */}
      <section id="deliverables" className="editorial-section">
        <div className="container-prose">
          <SectionHeader
            number="05"
            eyebrow="산출물"
            title={<>최종 결과물은 ‘이미지’가 아니라<br />‘제안 가능한 자산’입니다.</>}
          />
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {DELIVERABLES.map((d, i) => (
              <EditorialCard key={d.title} className="p-6">
                <p className="font-mono text-xs text-accent">D{String(i + 1).padStart(2, "0")}</p>
                <h3 className="font-serif mt-3 text-lg text-primary leading-snug">{d.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed italic">{d.desc}</p>
              </EditorialCard>
            ))}
          </div>
        </div>
      </section>

      {/* PACKAGES */}
      <section id="packages" className="editorial-section bg-primary text-primary-foreground">
        <div className="container-prose">
          <div className="max-w-3xl">
            <NumberedLabel number="06" className="text-accent">패키지</NumberedLabel>
            <h2 className="font-serif mt-5 text-3xl md:text-[2.5rem] leading-[1.25]">
              현재 필요한 단계에 맞게
              <br />선택할 수 있습니다.
            </h2>
            <p className="mt-5 text-primary-foreground/70 text-lg">프리미엄 1:1 서비스 / 상담 후 맞춤 안내</p>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {Object.values(PACKAGES).map((p) => (
              <div
                key={p.key}
                className={`relative rounded-[var(--radius)] p-8 md:p-10 border ${p.highlighted ? "border-accent bg-card text-card-foreground" : "border-primary-foreground/15 bg-primary-foreground/[0.04]"}`}
              >
                {p.highlighted && (
                  <span className="absolute -top-3 left-8 bg-accent text-white text-xs px-3 py-1 rounded-full tracking-widest">
                    RECOMMENDED
                  </span>
                )}
                <p className={`font-mono text-xs ${p.highlighted ? "text-accent" : "text-accent"}`}>
                  {p.key === "positioning" ? "PACKAGE A" : "PACKAGE B"}
                </p>
                <h3 className="font-serif mt-3 text-2xl md:text-3xl">{p.title}</h3>
                <p className={`mt-2 ${p.highlighted ? "text-muted-foreground" : "text-primary-foreground/70"}`}>{p.subtitle}</p>

                <div className="mt-7">
                  <p className={`text-xs tracking-widest ${p.highlighted ? "text-accent" : "text-accent"}`}>BEST FOR</p>
                  <ul className="mt-3 space-y-2 text-sm">
                    {p.bestFor.map((b) => (
                      <li key={b} className="flex gap-2">
                        <span className={p.highlighted ? "text-accent" : "text-accent"}>—</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-6">
                  <p className={`text-xs tracking-widest ${p.highlighted ? "text-accent" : "text-accent"}`}>INCLUDES</p>
                  <ul className="mt-3 space-y-2 text-sm">
                    {p.includes.map((b) => (
                      <li key={b} className="flex gap-2">
                        <Check size={14} className="mt-1 text-accent shrink-0" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-8">
                  <Link
                    to="/consultation"
                    className={`inline-flex items-center gap-2 px-6 py-3 text-sm rounded-full transition-colors ${p.highlighted ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-white text-primary hover:bg-white/90"}`}
                  >
                    {p.cta} →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY */}
      <section className="editorial-section">
        <div className="container-prose">
          <SectionHeader number="07" eyebrow="왜 꿈몰다인가" title="왜 꿈몰다인가" />
          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {TRUST.map((t, i) => (
              <EditorialCard key={t.title}>
                <p className="font-mono text-xs text-accent">0{i + 1}</p>
                <h3 className="font-serif mt-3 text-xl md:text-2xl text-primary leading-snug">{t.title}</h3>
                <p className="mt-4 text-muted-foreground leading-relaxed">{t.body}</p>
              </EditorialCard>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-secondary/70">
        <div className="container-prose py-24 md:py-32 text-center">
          <NumberedLabel number="08" className="justify-center">마무리</NumberedLabel>
          <h2 className="font-serif mt-6 text-3xl md:text-5xl text-primary leading-[1.25] max-w-4xl mx-auto">
            <span className="inline-block">오래 쌓아온 경력은 사라지는 것이 아니라,</span>
            <br />
            <span className="inline-block mt-2 md:mt-0">다시 번역되어야 합니다.</span>
          </h2>
          <p className="mt-6 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            꿈몰다는 당신의 경험이 소개되고, 제안되고, 선택받을 수 있도록
            브랜드 언어와 실행 자산으로 정리합니다.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <CTAButton to="/diagnosis" variant="primary">내 경력 브랜드 가능성 진단하기</CTAButton>
            <CTAButton to="/consultation" variant="ghost">1:1 상담 신청</CTAButton>
          </div>
        </div>
      </section>
    </>
  );
}
