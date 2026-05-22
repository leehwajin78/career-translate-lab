import { useFreeDiagnosticStore } from "@/store/freeDiagnosticStore";
import { Link } from "react-router-dom";
import { Lock, AlertTriangle, Star, Users, Target, Lightbulb, Award } from "lucide-react";

interface Props {
  onSendEmail: () => void;
}

const SCORE_LABELS: { key: "identity" | "strengths" | "target" | "differentiation"; label: string; icon: React.ReactNode }[] = [
  { key: "identity", label: "정체성 명확도", icon: <Star size={20} /> },
  { key: "strengths", label: "강점 자산 인식도", icon: <Award size={20} /> },
  { key: "target", label: "타깃 설계도", icon: <Target size={20} /> },
  { key: "differentiation", label: "차별화 인식도", icon: <Lightbulb size={20} /> },
];

export default function Report({ onSendEmail }: Props) {
  const { result, lead } = useFreeDiagnosticStore();

  if (!result || !lead) return null;

  return (
    <div className="fade-in">
      {/* ── 헤더 ── */}
      <section className="editorial-section">
        <div className="container-prose text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-bold border border-accent/20 mb-6">
            {result.typeInfo.emoji} {result.typeInfo.name}
          </div>
          <h1 className="font-serif text-3xl md:text-5xl text-primary leading-tight">
            {lead.name} 님의 경력 가치 레포트
          </h1>
          <p className="mt-6 font-serif text-4xl md:text-5xl text-primary">
            {result.totalScore}
            <span className="text-xl text-muted-foreground font-normal"> / 100점</span>
          </p>
          <p className="mt-4 text-foreground/70 text-base max-w-xl mx-auto">
            {result.typeInfo.description}
          </p>
        </div>
      </section>

      {/* ── Section 1: 4개 영역 점수 ── */}
      <section className="py-16 bg-secondary/40">
        <div className="container-prose">
          <h2 className="font-serif text-2xl md:text-3xl text-primary mb-10 text-center">
            경력 가치 점수
          </h2>
          <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
            {SCORE_LABELS.map(({ key, label, icon }) => (
              <div
                key={key}
                className="bg-background border border-border rounded-2xl p-6 shadow-soft"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                    {icon}
                  </div>
                  <h3 className="font-bold text-primary text-base">{label}</h3>
                  <span className="ml-auto font-serif text-2xl text-primary">
                    {result.scores[key]}
                    <span className="text-sm text-muted-foreground font-normal">점</span>
                  </span>
                </div>
                <div className="h-2 bg-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent rounded-full transition-all duration-1000"
                    style={{ width: `${result.scores[key]}%` }}
                  />
                </div>
                <p className="mt-3 text-sm text-muted-foreground">
                  {result.scoreComments[key]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 2: 빛나는 순간 ── */}
      <section className="editorial-section">
        <div className="container-prose max-w-4xl mx-auto">
          <h2 className="font-serif text-2xl md:text-3xl text-primary mb-8">
            당신이 빛나는 순간의 공통점
          </h2>
          <div className="bg-accent/5 border border-accent/20 rounded-2xl p-8 md:p-10">
            <p className="font-serif text-xl md:text-2xl text-primary leading-relaxed text-center">
              "당신이 가장 빛나는 순간에는 항상{" "}
              <span className="text-accent font-bold">'{result.shiningMoment.keywords[0]}'</span>
              과(와){" "}
              <span className="text-accent font-bold">'{result.shiningMoment.keywords[1]}'</span>
              이(가) 있었습니다"
            </p>
          </div>
          <p className="mt-6 text-foreground/70 leading-relaxed">
            {result.shiningMoment.description}
          </p>
        </div>
      </section>

      {/* ── Section 3: 숨겨진 자산 ── */}
      <section className="py-16 bg-secondary/40">
        <div className="container-prose max-w-4xl mx-auto">
          <h2 className="font-serif text-2xl md:text-3xl text-primary mb-8">
            아직 브랜드로 만들지 못한 3가지 자산
          </h2>
          <div className="space-y-4">
            {result.hiddenAssets.map((asset, i) => (
              <div
                key={i}
                className="bg-background border border-border rounded-2xl p-6 shadow-soft flex items-start gap-4"
              >
                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold text-sm shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <div>
                  <h3 className="font-bold text-primary">{asset.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{asset.rarity}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-accent font-bold text-center">
            이 3가지를 원라이너로 압축하는 작업이 남아있습니다
          </p>
        </div>
      </section>

      {/* ── Section 4: 자연 권위 ── */}
      <section className="editorial-section">
        <div className="container-prose max-w-4xl mx-auto">
          <h2 className="font-serif text-2xl md:text-3xl text-primary mb-8">
            사람들이 이미 당신에게서 찾고 있는 것
          </h2>
          <div className="bg-background border border-border rounded-2xl p-8 shadow-soft flex items-start gap-5">
            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0">
              <Users size={24} />
            </div>
            <div>
              <h3 className="font-bold text-primary text-lg">{result.naturalAuthority.area}</h3>
              <p className="mt-2 text-foreground/70 leading-relaxed">
                {result.naturalAuthority.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 5: 진단 갭 ── */}
      <section className="py-16 bg-secondary/40">
        <div className="container-prose max-w-4xl mx-auto">
          <h2 className="font-serif text-2xl md:text-3xl text-primary mb-8 flex items-center gap-2">
            <AlertTriangle size={28} className="text-amber-500" />
            진단 갭 — 아직 완성되지 않은 3가지
          </h2>
          <div className="space-y-4">
            {[
              { title: "타깃 갭", text: result.gaps.target },
              { title: "차별화 갭", text: result.gaps.differentiation },
              { title: "메시지 갭", text: result.gaps.message },
            ].map((gap, i) => (
              <div
                key={i}
                className="bg-background border-2 border-amber-300/50 rounded-2xl p-6 shadow-soft"
              >
                <h3 className="font-bold text-amber-700 text-base mb-2">⚠️ {gap.title}</h3>
                <p className="text-foreground/80 text-sm leading-relaxed">{gap.text}</p>
                <p className="mt-3 text-xs text-accent font-bold">→ 한끗 코칭에서 해결됩니다</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 6: 잠금 — 브랜드 원라이너 ── */}
      <section className="editorial-section">
        <div className="container-prose max-w-4xl mx-auto">
          <h2 className="font-serif text-2xl md:text-3xl text-primary mb-8">
            🔒 브랜드 원라이너 초안
          </h2>
          <div className="locked-section bg-background border border-border rounded-2xl p-8">
            <div className="locked-content">
              <p className="text-foreground leading-relaxed">{result.locked.oneLiner}</p>
            </div>
            <div className="locked-overlay bg-background/60">
              <Lock size={32} className="text-accent" />
              <p className="font-bold text-primary text-sm">한끗 진단에서만 완성됩니다</p>
              <Link
                to="/consultation"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full text-sm font-bold hover:bg-primary/90 transition-colors mt-2"
              >
                한끗 진단 신청하기
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 7: 잠금 — 고객 페르소나 ── */}
      <section className="py-16 bg-secondary/40">
        <div className="container-prose max-w-4xl mx-auto">
          <h2 className="font-serif text-2xl md:text-3xl text-primary mb-8">
            🔒 이상적 고객 페르소나
          </h2>
          <div className="locked-section bg-background border border-border rounded-2xl p-8">
            <div className="locked-content">
              <p className="text-foreground leading-relaxed">{result.locked.persona}</p>
            </div>
            <div className="locked-overlay bg-background/60">
              <Lock size={32} className="text-accent" />
              <p className="font-bold text-primary text-sm">한끗 진단에서만 완성됩니다</p>
              <Link
                to="/consultation"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full text-sm font-bold hover:bg-primary/90 transition-colors mt-2"
              >
                한끗 진단 신청하기
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA 섹션 ── */}
      <section className="bg-primary text-primary-foreground">
        <div className="container-prose py-20 md:py-28 text-center">
          <h2 className="font-serif text-3xl md:text-4xl leading-snug max-w-3xl mx-auto">
            경력 가치는 있습니다.
            <br />
            아직 언어가 없을 뿐입니다.
          </h2>
          <p className="mt-6 text-primary-foreground/80 text-lg max-w-2xl mx-auto leading-relaxed">
            브랜드 원라이너, 고객 페르소나, 핵심 메시지 — 한끗 코칭에서 완성합니다.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              to="/consultation"
              className="inline-flex items-center gap-2 bg-white text-primary px-8 py-4 rounded-full text-base font-bold hover:bg-white/90 transition-colors shadow-lg"
            >
              한끗 진단 신청하기
            </Link>
            <button
              onClick={onSendEmail}
              className="inline-flex items-center gap-2 border border-primary-foreground/30 text-primary-foreground px-8 py-4 rounded-full text-base hover:bg-primary-foreground/10 transition-colors"
            >
              레포트 이메일로 받기
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
