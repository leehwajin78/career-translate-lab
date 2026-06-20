'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDiagnosticStore } from "@/store/diagnostic";
import { EditorialCard, GoldDivider, NumberedLabel, SectionHeader } from "@/components/site/Editorial";
import CTAButton from "@/components/site/CTAButton";
import { PACKAGES } from "@/data/content";
import { Check } from "lucide-react";

import { ScoreGauge } from "@/components/site/ScoreGauge";

export default function Result() {
  const router = useRouter();
  const navigate = (p: string) => router.push(p);
  const { result, contact } = useDiagnosticStore();

  if (!result) {
    return (
      <div className="container-prose py-32 text-center">
        <h1 className="font-serif text-3xl text-primary">아직 진단 결과가 없습니다.</h1>
        <p className="mt-4 text-muted-foreground">먼저 16문항 내 경력 브랜드 가능성 진단을 진행해주세요.</p>
        <div className="mt-10">
          <CTAButton href="/diagnosis">진단 시작하기</CTAButton>
        </div>
      </div>
    );
  }

  const pkg = PACKAGES[result.recommendedPackage];

  return (
    <>
      {/* A. SUMMARY */}
        <section className="editorial-section">
          <div className="container-prose">
            <NumberedLabel number="01">진단 결과</NumberedLabel>
            <h1 className="font-serif mt-5 text-3xl md:text-5xl text-primary leading-tight">
              {contact?.name ? `${contact.name} 님의` : "당신의"} 브랜딩 준비도
            </h1>
            <div className="mt-12 grid gap-12 md:grid-cols-[auto_1fr] items-center">
              <ScoreGauge score={result.totalScore} />
              <div>
                <p className="text-sm text-muted-foreground tracking-widest">현재 브랜딩 준비도</p>
                <p className="font-serif text-3xl md:text-4xl text-primary mt-2">{result.totalScore}점 / 100점</p>
                <p className="mt-5 text-base md:text-lg text-foreground/80 leading-relaxed max-w-xl">
                  {result.oneLine}
                </p>
              </div>
            </div>
          </div>
        </section>

        <GoldDivider />

        {/* B. TYPE */}
        <section className="editorial-section bg-secondary/60">
          <div className="container-prose">
            <SectionHeader number="02" eyebrow="진단 유형" title={result.typeInfo.name} description={result.typeInfo.description} />
          </div>
        </section>

        {/* C. DIMENSIONS */}
        <section className="editorial-section">
          <div className="container-prose">
            <SectionHeader number="03" eyebrow="핵심 진단 결과" title="다섯 가지 축으로 본 현재 상태" />
            <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {result.dimensions.map((d) => (
                <EditorialCard key={d.key}>
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-serif text-xl text-primary">{d.label}</h3>
                    <span className="font-mono text-sm text-accent">{d.score}</span>
                  </div>
                  <div className="mt-3 h-px bg-border relative overflow-hidden">
                    <div className="absolute h-full bg-accent" style={{ width: `${d.score}%` }} />
                  </div>
                  <div className="mt-6 space-y-4 text-sm">
                    <div>
                      <p className="text-xs tracking-widest text-muted-foreground">현재 상태</p>
                      <p className="mt-1 text-foreground/85 leading-relaxed">{d.status}</p>
                    </div>
                    <div>
                      <p className="text-xs tracking-widest text-muted-foreground">리스크</p>
                      <p className="mt-1 text-foreground/85 leading-relaxed">{d.risk}</p>
                    </div>
                    <div>
                      <p className="text-xs tracking-widest text-accent">다음 단계</p>
                      <p className="mt-1 text-foreground/85 leading-relaxed">{d.nextStep}</p>
                    </div>
                  </div>
                </EditorialCard>
              ))}
            </div>
          </div>
        </section>

        {/* D. PACKAGE */}
        <section className="editorial-section bg-secondary/60">
          <div className="container-prose">
            <SectionHeader number="04" eyebrow="추천 패키지" title={pkg.title} description={result.recommendationReason} />
            <EditorialCard className="mt-12">
              <div className="grid md:grid-cols-2 gap-10">
                <div>
                  <p className="text-xs tracking-widest text-accent">BEST FOR</p>
                  <ul className="mt-4 space-y-2 text-sm">
                    {pkg.bestFor.map((b) => (
                      <li key={b} className="flex gap-2 text-foreground/85"><span className="text-accent">—</span>{b}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs tracking-widest text-accent">INCLUDES</p>
                  <ul className="mt-4 space-y-2 text-sm">
                    {pkg.includes.map((b) => (
                      <li key={b} className="flex gap-2 text-foreground/85"><Check size={14} className="mt-1 text-accent shrink-0" />{b}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </EditorialCard>
          </div>
        </section>

        {/* E. CTA */}
        <section className="bg-primary text-primary-foreground">
          <div className="container-prose py-24 text-center">
            <h2 className="font-serif text-3xl md:text-4xl leading-snug max-w-3xl mx-auto">
              이 진단 결과를 바탕으로
              <br />내 경력을 어떤 무대로 연결할 수 있을지 상담해보세요.
            </h2>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <button
                onClick={() => navigate("/consultation")}
                className="inline-flex items-center gap-2 bg-accent text-white border border-primary-foreground/30 px-7 py-3.5 rounded-full text-sm"
              >
                진단 결과 기반 1:1 상담 신청 →
              </button>
              <Link href="/" className="inline-flex items-center gap-2 border border-primary-foreground/30 px-7 py-3.5 rounded-full text-sm">
                홈으로
              </Link>
            </div>
          </div>
        </section>
    </>
  );
}
