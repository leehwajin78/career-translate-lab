import CTAButton from "@/components/site/CTAButton";
import { NumberedLabel } from "@/components/site/Editorial";
import { Check, Sparkles, Users, Award, Building, ArrowRight, Download } from "lucide-react";
import { Link } from "react-router-dom";

export default function Service() {
  return (
    <>
      {/* SECTION 1: HERO — 문제 공감 → 해결책 제시 */}
      <section className="relative overflow-hidden">
        <div className="container-prose relative z-10 pt-20 md:pt-32 pb-24 md:pb-40">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-bold mb-8 border border-accent/20 shadow-sm">
            <Sparkles size={16} />
            <span>1:1 맞춤 6주 과정</span>
          </div>
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl leading-[1.15] text-primary fade-in tracking-tight break-keep">
            30년 경력을 시장의 <br />
            언어로 번역하는 <br />
            서비스입니다.
          </h1>
          <p className="mt-8 max-w-3xl text-lg md:text-xl text-foreground/80 leading-relaxed font-medium break-keep">
            당신만을 위한 1:1 맞춤 과정으로, 경험 속 가장 강력한 이야기를 꺼내 6주 안에 프로필·강의안·제안서로 만들어 드립니다.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <CTAButton to="/diagnosis" variant="primary" className="w-full sm:w-auto justify-center">경력 가치 무료 진단받기</CTAButton>
            <CTAButton to="/consultation" variant="ghost" className="w-full sm:w-auto justify-center">30분 무료 상담 신청하기</CTAButton>
            <a
              href="https://drive.google.com/file/d/1871MRxG1L2_ft-xe_z5vCmpFdQm24sv1/view?usp=drive_link"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-7 py-3.5 text-sm md:text-base rounded-full border border-primary/10 bg-primary/5 text-primary hover:bg-primary/10 hover:border-primary/20 transition-all shadow-sm font-medium"
            >
              <Download size={16} />
              프로그램 상세 안내서 다운로드
            </a>
          </div>
        </div>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 h-[80vh] bg-gradient-to-bl from-accent/20 to-transparent blur-3xl -z-10 rounded-full" />
        <div className="absolute -left-20 bottom-0 w-96 h-96 bg-primary/5 blur-3xl -z-10 rounded-full" />
      </section>

      {/* SECTION 2: 카테고리 차별화 — 비교 축 강화 */}
      <section className="py-24 bg-secondary/40">
        <div className="container-prose">
          <div className="text-center mb-16">
            <NumberedLabel number="01">왜 한끗인가</NumberedLabel>
            <h2 className="font-serif text-3xl md:text-4xl text-primary leading-snug mt-4 mb-6">
              강사 양성도, 브랜딩 컨설팅도 아닙니다.
            </h2>
            <p className="text-foreground/70 text-lg max-w-2xl mx-auto">
              한끗은 이미 충분한 경력을 가진 분의 자산화에 집중합니다.
            </p>
          </div>

          {/* 비교 테이블 — 모바일 대응 카드 + 데스크탑 그리드 */}
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* 카드 1: 강사 양성 과정 */}
            <div className="bg-background border border-border p-6 md:p-8 rounded-2xl shadow-sm flex flex-col">
              <h3 className="text-2xl md:text-3xl font-extrabold text-foreground mb-6 tracking-tight break-keep leading-tight">강사 양성 과정</h3>
              <hr className="border-border mb-6" />
              <div className="space-y-4 md:space-y-5 text-base md:text-lg flex-grow">
                <div className="grid grid-cols-[60px_1fr] gap-2 items-start">
                  <span className="font-bold text-foreground shrink-0">대상</span>
                  <span className="text-foreground leading-relaxed break-keep">강의 경험이 없는 분</span>
                </div>
                <div className="grid grid-cols-[60px_1fr] gap-2 items-start">
                  <span className="font-bold text-foreground shrink-0">진단</span>
                  <span className="text-foreground leading-relaxed break-keep">없음</span>
                </div>
                <div className="grid grid-cols-[60px_1fr] gap-2 items-start">
                  <span className="font-bold text-foreground shrink-0">결과물</span>
                  <span className="text-foreground leading-relaxed break-keep">수료증, 강사 풀 등록</span>
                </div>
                <div className="grid grid-cols-[60px_1fr] gap-2 items-start">
                  <span className="font-bold text-foreground shrink-0">활용처</span>
                  <span className="text-foreground leading-relaxed break-keep">강사 활동 한정</span>
                </div>
              </div>
              <div className="mt-8 pt-5 border-t border-border">
                <p className="text-base md:text-lg text-accent font-bold leading-relaxed break-keep">
                  "한끗은 강의를 가르치지 않습니다."
                </p>
              </div>
            </div>

            {/* 카드 2: 일반 브랜딩 컨설팅 */}
            <div className="bg-background border border-border p-6 md:p-8 rounded-2xl shadow-sm flex flex-col">
              <h3 className="text-2xl md:text-3xl font-extrabold text-foreground mb-6 tracking-tight break-keep leading-tight">일반 브랜딩 컨설팅</h3>
              <hr className="border-border mb-6" />
              <div className="space-y-4 md:space-y-5 text-base md:text-lg flex-grow">
                <div className="grid grid-cols-[60px_1fr] gap-2 items-start">
                  <span className="font-bold text-foreground shrink-0">대상</span>
                  <span className="text-foreground leading-relaxed break-keep">사업체·창업자</span>
                </div>
                <div className="grid grid-cols-[60px_1fr] gap-2 items-start">
                  <span className="font-bold text-foreground shrink-0">진단</span>
                  <span className="text-foreground leading-relaxed break-keep">시장 분석 중심</span>
                </div>
                <div className="grid grid-cols-[60px_1fr] gap-2 items-start">
                  <span className="font-bold text-foreground shrink-0">결과물</span>
                  <span className="text-foreground leading-relaxed break-keep">로고, 웹사이트</span>
                </div>
                <div className="grid grid-cols-[60px_1fr] gap-2 items-start">
                  <span className="font-bold text-foreground shrink-0">활용처</span>
                  <span className="text-foreground leading-relaxed break-keep">디지털 채널</span>
                </div>
              </div>
              <div className="mt-8 pt-5 border-t border-border">
                <p className="text-base md:text-lg text-accent font-bold leading-relaxed break-keep">
                  "한끗은 디자인이 아닙니다."
                </p>
              </div>
            </div>

            {/* 카드 3: 한끗프로젝트 — 강조 */}
            <div className="bg-primary text-white p-6 md:p-8 rounded-2xl shadow-xl flex flex-col border border-primary-foreground/10">
              <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-6 tracking-tight break-keep leading-tight">한끗프로젝트</h3>
              <hr className="border-white/20 mb-6" />
              <div className="space-y-4 md:space-y-5 text-base md:text-lg flex-grow">
                <div className="grid grid-cols-[60px_1fr] gap-2 items-start">
                  <span className="font-bold text-white shrink-0">대상</span>
                  <span className="text-white/95 leading-relaxed break-keep">20~30년 경력 전문가</span>
                </div>
                <div className="grid grid-cols-[60px_1fr] gap-2 items-start">
                  <span className="font-bold text-white shrink-0">진단</span>
                  <span className="text-white/95 leading-relaxed break-keep">개인의 경력 자산 추출 중심</span>
                </div>
                <div className="grid grid-cols-[60px_1fr] gap-2 items-start">
                  <span className="font-bold text-white shrink-0">결과물</span>
                  <span className="text-white/95 leading-relaxed break-keep">프로필, 강의안, 제안서</span>
                </div>
                <div className="grid grid-cols-[60px_1fr] gap-2 items-start">
                  <span className="font-bold text-white shrink-0">활용처</span>
                  <span className="text-white/95 leading-relaxed break-keep">강의·제안·프로필 전 채널</span>
                </div>
              </div>
              <div className="mt-8 pt-5 border-t border-white/20">
                <p className="text-base md:text-lg text-white/90 font-bold leading-relaxed break-keep">
                  "한끗은 경력을 시장 언어로 번역합니다."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: 한끗 방법론 3단계 + Before/After */}
      <section className="py-24 md:py-32">
        <div className="container-prose">
          <div className="text-center mb-16">
            <NumberedLabel number="02">방법론</NumberedLabel>
            <h2 className="font-serif text-3xl md:text-4xl text-primary leading-snug mt-4 mb-6">
              한끗은 이렇게 작동합니다.
            </h2>
            <p className="text-foreground/70 text-lg max-w-2xl mx-auto">
              30년 경험과 노하우에서 정제된 3단계 자산화 원리입니다.
            </p>
          </div>

          <div className="space-y-6 max-w-4xl mx-auto">
            {/* 1단계 */}
            <div className="bg-card border border-border rounded-3xl p-8 md:p-10 shadow-sm hover:shadow-md transition-shadow">
              <div className="grid md:grid-cols-[100px_1fr] gap-6 items-start">
                <span className="font-serif text-6xl md:text-7xl text-accent/30 font-bold leading-none">01</span>
                <div>
                  <h3 className="font-serif text-3xl md:text-4xl font-extrabold text-primary mb-2">
                    추출 <span className="text-muted-foreground text-base md:text-lg font-normal ml-1">Extraction</span>
                  </h3>
                  <p className="text-accent font-extrabold text-lg md:text-xl mb-4 leading-normal">
                    경력에서 시장이 원할 만한 것을 골라냅니다.
                  </p>
                  <p className="text-base md:text-lg text-foreground/90 font-medium leading-relaxed break-keep">
                    30년 경력 안에는 수백 가지 경험이 쌓여 있습니다.
                    그 중에서 시장이 돈을 낼 만한 핵심을 골라내는 것이 첫 단계입니다.
                    '무엇을 했는가'가 아니라 '무엇을 줄 수 있는가'의 관점으로 재정렬합니다.
                  </p>
                </div>
              </div>
            </div>

            {/* 2단계 */}
            <div className="bg-card border border-border rounded-3xl p-8 md:p-10 shadow-sm hover:shadow-md transition-shadow">
              <div className="grid md:grid-cols-[100px_1fr] gap-6 items-start">
                <span className="font-serif text-6xl md:text-7xl text-accent/30 font-bold leading-none">02</span>
                <div>
                  <h3 className="font-serif text-3xl md:text-4xl font-extrabold text-primary mb-2">
                    번역 <span className="text-muted-foreground text-base md:text-lg font-normal ml-1">Translation</span>
                  </h3>
                  <p className="text-accent font-extrabold text-lg md:text-xl mb-4 leading-normal">
                    전문가 언어를 고객 언어로 옮깁니다.
                  </p>
                  <p className="text-base md:text-lg text-foreground/90 font-medium leading-relaxed break-keep">
                    회사 내부에서 통했던 직함과 KPI 언어는 외부 시장에서는 통하지 않습니다.
                    '30년 차 임원'이 아니라 '어떤 문제를 어떻게 해결해주는 사람'으로 다시 정의합니다.
                    이 번역의 결과가 바로 프로필 한 문장이고, 강의 제목이며, 제안서 첫 페이지입니다.
                  </p>
                </div>
              </div>
            </div>

            {/* 3단계 */}
            <div className="bg-card border border-border rounded-3xl p-8 md:p-10 shadow-sm hover:shadow-md transition-shadow">
              <div className="grid md:grid-cols-[100px_1fr] gap-6 items-start">
                <span className="font-serif text-6xl md:text-7xl text-accent/30 font-bold leading-none">03</span>
                <div>
                  <h3 className="font-serif text-3xl md:text-4xl font-extrabold text-primary mb-2">
                    자산화 <span className="text-muted-foreground text-base md:text-lg font-normal ml-1">Asset-building</span>
                  </h3>
                  <p className="text-accent font-extrabold text-lg md:text-xl mb-4 leading-normal">
                    한 번 만들면 계속 쓸 수 있는 형태로 만듭니다.
                  </p>
                  <p className="text-base md:text-lg text-foreground/90 font-medium leading-relaxed break-keep">
                    PPT 한 번 만들고 끝이 아닙니다.
                    강의안은 주제 변경에 맞춰 변형 가능한 모듈로,
                    제안서는 다양한 클라이언트에 맞게 조정 가능한 템플릿으로,
                    프로필은 채널·매체별로 변환 가능한 한 페이지로 설계합니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: 산출물 6가지 */}
      <section id="deliverables" className="py-24 bg-primary/5">
        <div className="container-prose">
          <div className="text-center mb-16">
            <NumberedLabel number="03">산출물</NumberedLabel>
            <h2 className="font-serif text-3xl md:text-4xl text-primary leading-snug mt-4 mb-6">
              한끗을 마치면 <br />
              손에 쥐는 것.
            </h2>
            <p className="text-foreground/70 text-lg max-w-2xl mx-auto">
              한끗 빌드 6주 종료 시 모두 편집 가능한 <br />
              원본 파일로 제공됩니다.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { n: "01", title: "한 줄 포지셔닝", desc: "당신을 한 문장으로 설명하는 핵심 메시지. 명함·SNS 자기소개·강의 제목에 그대로 활용 가능합니다." },
              { n: "02", title: "전문가 프로필 1페이지", desc: "경력·전문성·제공 가능 영역을 정리한 A4 1장. PDF와 편집 가능한 원본 모두 제공됩니다." },
              { n: "03", title: "대표 강의안 (60분)", desc: "PPT 원본 + 강의 스크립트 + 발표 노트. 첫 무대에서 바로 사용 가능한 완성된 콘텐츠입니다." },
              { n: "04", title: "B2B 제안서 템플릿", desc: "기업·기관에 보낼 수 있는 표준 제안서 구조. 주제·고객사 변경 시 빠르게 변형 가능합니다." },
              { n: "05", title: "채널 전략 가이드", desc: "어디서 시작할지, 어떤 콘텐츠를 만들지에 대한 로드맵. 온라인·오프라인 모두 다룹니다." },
              { n: "06", title: "소개 멘트 30초·60초", desc: "BNI·CEO 모임·강의 후 인사 등 다양한 자리에서 사용할 30초 / 60초 / 90초 자기소개 스크립트." },
            ].map((d) => (
              <div key={d.n} className="bg-background border border-border p-6 md:p-8 rounded-2xl shadow-sm">
                <p className="font-mono text-sm md:text-base text-accent font-bold">D{d.n}</p>
                <h3 className="font-serif text-2xl md:text-3xl font-extrabold text-primary mt-3 mb-4 leading-snug">{d.title}</h3>
                <p className="text-base md:text-lg text-foreground/80 leading-relaxed break-keep">{d.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: 신뢰 */}
      <section className="py-24 md:py-32">
        <div className="container-prose">
          <div className="text-center mb-16">
            <NumberedLabel number="04">신뢰</NumberedLabel>
            <h2 className="font-serif text-3xl md:text-4xl text-primary leading-snug mt-4 mb-6">
              30년 동안 <br />
              이 일만 해왔습니다.
            </h2>
            <p className="text-foreground/70 text-lg max-w-2xl mx-auto">
              꿈몰다 이화진 대표의 현장 경험이 한끗프로젝트의 기반입니다.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-stretch max-w-5xl mx-auto">
            {/* 좌측: 대표 사진 */}
            <div className="flex flex-col items-center">
              <img
                src="/images/profile.jpg"
                alt="이화진 꿈몰다 대표"
                className="w-full h-full max-w-md rounded-3xl shadow-lg object-cover"
              />
              <p className="mt-6 text-muted-foreground text-sm font-medium">이화진 | 꿈몰다 대표</p>
            </div>

            {/* 우측: 실적 카드 */}
            <div className="flex flex-col justify-between gap-5">
              <div className="bg-card border border-border p-8 rounded-2xl shadow-sm flex items-center gap-6 flex-1">
                <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0">
                  <Award size={28} />
                </div>
                <div>
                  <span className="text-3xl font-serif font-bold text-primary">30년</span>
                  <p className="text-sm text-muted-foreground mt-1">프레젠테이션·브랜딩 컨설팅 경력</p>
                  <p className="text-xs text-foreground/50 mt-1">기업·기관·대학 대상 강의 및 콘텐츠 설계</p>
                </div>
              </div>
              <div className="bg-card border border-border p-8 rounded-2xl shadow-sm flex items-center gap-6 flex-1">
                <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0">
                  <Users size={28} />
                </div>
                <div>
                  <span className="text-3xl font-serif font-bold text-primary">300+</span>
                  <p className="text-sm text-muted-foreground mt-1">누적 코칭 사례</p>
                  <p className="text-xs text-foreground/50 mt-1">임원·전문가·강사의 브랜딩과 콘텐츠를 함께 설계</p>
                </div>
              </div>
              <div className="bg-card border border-border p-8 rounded-2xl shadow-sm flex items-center gap-6 flex-1">
                <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0">
                  <Building size={28} />
                </div>
                <div>
                  <span className="text-3xl font-serif font-bold text-primary">300+</span>
                  <p className="text-sm text-muted-foreground mt-1">대기업·공공기관·대학 출강</p>
                  <p className="text-xs text-foreground/50 mt-1">현장에서 검증된 강의력과 콘텐츠 제작 노하우</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: 다음 단계 CTA */}
      <section className="py-24 md:py-32 bg-primary text-primary-foreground text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-accent/20 to-transparent -z-10" />
        <div className="container-prose relative z-10">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl leading-snug mb-6 max-w-3xl mx-auto">
            준비가 되셨다면,<br />
            내 경력의 가치부터<br />
            확인해 보세요.
          </h2>
          <p className="text-lg md:text-xl text-primary-foreground/80 mb-12 max-w-2xl mx-auto leading-relaxed font-medium break-keep">
            30년의 경험이 시장에서 어떤 자산이 될 수 있는지,<br className="hidden md:block" />
            간단한 진단과 무료 상담을 통해 명확한 방향을 잡아드립니다.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-5 mb-8">
            <Link to="/diagnosis" className="w-full sm:w-auto bg-accent text-white border-2 border-white/90 px-10 py-5 rounded-full font-bold text-lg hover:bg-accent/90 transition-all shadow-lg hover:scale-105">
              경력 가치 무료 진단받기
            </Link>
            <Link to="/consultation" className="w-full sm:w-auto bg-white text-primary px-10 py-5 rounded-full font-bold text-lg hover:bg-white/90 transition-all shadow-lg hover:scale-105">
              30분 무료 상담 신청하기
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
