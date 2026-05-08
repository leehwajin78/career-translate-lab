import CTAButton from "@/components/site/CTAButton";
import { NumberedLabel } from "@/components/site/Editorial";
import { ArrowRight, Sparkles, Check, Clock, User, Briefcase } from "lucide-react";
import { Link } from "react-router-dom";
import FAQ from "@/components/site/FAQ";

export default function Index() {
  return (
    <>
      {/* HERO SECTION */}
      <section className="relative overflow-hidden">
        <div className="container-prose relative z-10 pt-20 md:pt-32 pb-24 md:pb-40">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-bold mb-8 border border-accent/20 shadow-sm">
            <Sparkles size={16} />
            <span>5060 프리미엄 브랜드 매니지먼트</span>
          </div>
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl leading-[1.15] text-primary fade-in tracking-tight break-keep">
            20년 경력, <br />
            <span className="inline-block">이제 회사 밖에서도 <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary/80">팔리게</span> 만드세요.</span>
          </h1>
          <p className="mt-8 max-w-3xl text-lg md:text-xl text-foreground/80 leading-relaxed font-medium break-keep">
            퇴직 후가 막막한 이유는 경력이 부족해서가 아닙니다.<br className="hidden md:block" />
            그 경력을 <strong>강연, 컨설팅, B2B 제안, 브랜드 프로필</strong>로 바꿔본 적이 없었기 때문입니다.<br className="hidden md:block" />
            8주 안에 당신의 경험을 시장에 제안할 수 있는 <strong>수익형 브랜드 자산</strong>으로 만듭니다.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <CTAButton to="/diagnosis" variant="primary">내 경력이 팔릴 수 있는지 진단받기</CTAButton>
            <CTAButton to="/service" variant="ghost">8주 후 결과물 미리 보기</CTAButton>
          </div>

          {/* 하단 숫자 */}
          <div className="mt-16 pt-8 border-t border-border/60 flex flex-wrap items-center gap-x-12 gap-y-8 opacity-90">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0">
                <Clock size={24} />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-serif text-primary">8주</span>
                <span className="text-sm font-medium text-muted-foreground mt-0.5">경력 자산화 집중 과정</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0">
                <User size={24} />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-serif text-primary">1:1</span>
                <span className="text-sm font-medium text-muted-foreground mt-0.5">전담 브랜드 설계</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0">
                <Briefcase size={24} />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-serif text-primary">4종 결과물</span>
                <span className="text-sm font-medium text-muted-foreground mt-0.5">프로필 · 제안서 · 강연안 · 컨설팅 패키지</span>
              </div>
            </div>
          </div>
        </div>

        {/* Background Decorative Elements */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 h-[80vh] bg-gradient-to-bl from-accent/20 to-transparent blur-3xl -z-10 rounded-full" />
        <div className="absolute -left-20 bottom-0 w-96 h-96 bg-primary/5 blur-3xl -z-10 rounded-full" />
      </section>

      {/* SECTION 1 */}
      <section className="py-24 bg-secondary/40">
        <div className="container-prose text-center">
          <h2 className="font-serif text-2xl md:text-3xl text-primary leading-snug">
            당신에게 없는 건 경력이 아닙니다.<br />
            팔리는 구조입니다.
          </h2>
          <p className="mt-8 max-w-2xl mx-auto text-foreground/80 text-lg leading-relaxed font-medium">
            회사 안에서는 직함이 나를 설명해줬습니다.<br />
            하지만 회사 밖에서는 다릅니다.<br />
            이제는 내가 누구인지, 무엇을 해결하는 사람인지,<br />
            왜 나에게 맡겨야 하는지 스스로 보여줘야 합니다.
          </p>

          <div className="mt-16 relative max-w-5xl mx-auto">
            <div className="grid md:grid-cols-[1fr_auto_1fr] gap-6 items-center">
              {/* INPUT 카드 */}
              <div className="bg-background border border-border p-8 md:p-10 rounded-2xl shadow-sm relative text-left h-full flex flex-col justify-center">
                <h3 className="font-serif text-xl text-primary mb-6">당신의 20년 경력</h3>
                <ul className="space-y-5 text-base text-foreground/80 font-medium">
                  <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-muted-foreground/50 shrink-0" /> 쌓아온 전문성</li>
                  <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-muted-foreground/50 shrink-0" /> 현장에서 얻은 노하우</li>
                  <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-muted-foreground/50 shrink-0" /> 실패와 성공의 스토리</li>
                </ul>
              </div>

              {/* 중간 버튼 */}
              <div className="flex flex-col items-center justify-center text-accent my-6 md:my-0">
                <ArrowRight size={32} className="hidden md:block opacity-50 mb-3" />
                <div className="bg-accent text-white px-6 py-3.5 rounded-full shadow-lg font-bold text-base whitespace-nowrap">
                  8주 브랜드 매니지먼트
                </div>
                <ArrowRight size={32} className="hidden md:block opacity-50 mt-3" />
              </div>

              {/* OUTPUT 카드 */}
              <div className="bg-primary text-primary-foreground p-8 md:p-10 rounded-2xl shadow-xl relative text-left h-full transform md:scale-105 transition-transform border border-primary-foreground/10 flex flex-col justify-center">
                <h3 className="font-serif text-xl mb-6 text-white">제안 가능한 브랜드 자산</h3>
                <ul className="space-y-5 text-base text-primary-foreground/90 font-medium">
                  <li className="flex items-center gap-3"><Check size={20} className="text-accent shrink-0" /> 전문가 브랜드 프로필</li>
                  <li className="flex items-center gap-3"><Check size={20} className="text-accent shrink-0" /> B2B 기업 제안서</li>
                  <li className="flex items-center gap-3"><Check size={20} className="text-accent shrink-0" /> 시그니처 강연 기획안</li>
                  <li className="flex items-center gap-3"><Check size={20} className="text-accent shrink-0" /> 컨설팅 패키지</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: 시간 대비 성과 */}
      <section className="py-24 md:py-32">
        <div className="container-prose">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* 왼쪽: 핵심 메시지 + Before/After */}
            <div>
              <NumberedLabel number="01">시간 대비 성과</NumberedLabel>
              <h2 className="font-serif mt-4 text-2xl md:text-3xl text-primary leading-snug">
                혼자 준비하면 6개월,<br />
                우리와 함께하면 8주.
              </h2>
              <p className="mt-6 text-foreground/80 leading-relaxed text-lg font-medium break-keep">
                무엇을 살리고, 무엇을 버리고, 어떤 말로 팔아야 하는지<br className="hidden md:block" />
                혼자서는 계속 막히기 마련입니다.<br /><br />
                우리가 대표님의 경력을 분석하고, 시장이 납득할 언어로 바꾸고,<br className="hidden md:block" />
                <strong>바로 사용할 수 있는 결과물</strong>로 만들어 드립니다.
              </p>

              {/* Before / After 비교 */}
              <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="p-6 rounded-2xl bg-secondary/50 border border-border">
                  <h4 className="text-lg font-bold text-muted-foreground flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-muted-foreground/20 flex items-center justify-center text-xs font-bold text-muted-foreground">✕</span>
                    지금 상태
                  </h4>
                  <ul className="mt-4 space-y-3 text-muted-foreground text-sm font-medium break-keep">
                    <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5 shrink-0">•</span> 나를 소개할 프로필이 없다</li>
                    <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5 shrink-0">•</span> 강연을 해달라 하면 막막하다</li>
                    <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5 shrink-0">•</span> 기업에 보낼 제안서가 없다</li>
                  </ul>
                </div>
                <div className="p-6 rounded-2xl bg-primary/5 border-2 border-accent/30 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-accent"></div>
                  <h4 className="text-lg font-bold text-primary flex items-center gap-2 pt-1">
                    <span className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center text-xs font-bold text-accent">✓</span>
                    8주 후 완성
                  </h4>
                  <ul className="mt-4 space-y-3 text-foreground/80 text-sm font-bold break-keep">
                    <li className="flex items-start gap-2"><Check size={16} className="text-accent mt-0.5 shrink-0" /> 전문가 브랜드 프로필</li>
                    <li className="flex items-start gap-2"><Check size={16} className="text-accent mt-0.5 shrink-0" /> B2B 기업 제안서</li>
                    <li className="flex items-start gap-2"><Check size={16} className="text-accent mt-0.5 shrink-0" /> 시그니처 강연 기획안</li>
                    <li className="flex items-start gap-2"><Check size={16} className="text-accent mt-0.5 shrink-0" /> 컨설팅 패키지</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 오른쪽: 시간 비교 그래프 */}
            <div className="bg-card border border-border p-8 md:p-12 rounded-3xl shadow-elevated relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-accent/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
              <h3 className="font-serif text-xl text-primary mb-4 relative z-10">소요 시간 비교</h3>
              <p className="text-muted-foreground text-sm mb-10 relative z-10">같은 결과물, 걸리는 시간은 완전히 다릅니다.</p>

              <div className="space-y-8 relative z-10">
                {/* 혼자 준비 */}
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="w-3 h-3 rounded-full bg-muted-foreground/40"></span>
                    <span className="text-muted-foreground font-bold">혼자 준비할 때</span>
                  </div>
                  <div className="h-16 w-full bg-secondary/80 rounded-xl overflow-hidden flex items-center justify-between px-5 relative border border-border/50">
                    <div className="absolute left-0 top-0 h-full bg-muted-foreground/20 w-full z-0 rounded-xl"></div>
                    <span className="relative z-10 font-bold text-muted-foreground text-base">6개월 이상 (24주+)</span>
                    <span className="relative z-10 text-muted-foreground text-xs bg-muted-foreground/10 px-3 py-1 rounded-full">결과물 불확실</span>
                  </div>
                </div>
                {/* 브랜드 매니지먼트 */}
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="w-3 h-3 rounded-full bg-accent"></span>
                    <span className="font-bold text-primary text-lg">브랜드 매니지먼트</span>
                  </div>
                  <div className="h-16 w-[33%] min-w-[200px] bg-accent text-white rounded-xl flex items-center justify-between px-5 shadow-lg">
                    <span className="font-bold text-lg">8주</span>
                    <span className="text-xs bg-white/20 px-3 py-1 rounded-full font-bold">4종 완성 ✓</span>
                  </div>
                </div>
              </div>

              <div className="mt-10 p-5 bg-accent/5 rounded-2xl border border-accent/20 text-center relative z-10">
                <p className="text-base md:text-lg text-primary font-bold leading-relaxed break-keep">
                  "가장 비싼 것은 제작비가 아니라,<br />
                  아무것도 시작하지 못한 시간입니다."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: 3 VALUE PROPS */}
      <section className="py-24 bg-secondary/40">
        <div className="container-prose text-center">
          <h2 className="font-serif text-2xl md:text-3xl text-primary leading-snug mb-6">
            왜 우리 서비스를 선택해야 할까요?
          </h2>
          <p className="text-foreground/70 text-lg mb-16 max-w-2xl mx-auto">컴퓨터 앞에 앉아 끙끙댈 필요 없습니다.<br />대표님의 체면과 귀중한 시간을 지켜드립니다.</p>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="flex flex-col items-center bg-background p-8 rounded-2xl border border-border shadow-sm">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center text-accent mb-6"><Clock size={32} /></div>
              <h3 className="font-bold text-primary text-lg mb-3">PPT · 문서 작업 제로</h3>
              <p className="text-foreground/70 text-sm leading-relaxed">대표님은 편하게 말씀만 하세요.<br />인터뷰 내용만으로 모든 문서를<br />우리가 완성합니다.</p>
            </div>
            <div className="flex flex-col items-center bg-background p-8 rounded-2xl border border-border shadow-sm">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center text-accent mb-6"><User size={32} /></div>
              <h3 className="font-bold text-primary text-lg mb-3">1:1 전담 매니저 배정</h3>
              <p className="text-foreground/70 text-sm leading-relaxed">여러 수강생 중 한 명이 아닙니다.<br />대표님만을 위한 전담 매니저가<br />8주간 밀착 관리합니다.</p>
            </div>
            <div className="flex flex-col items-center bg-background p-8 rounded-2xl border border-border shadow-sm">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center text-accent mb-6"><Briefcase size={32} /></div>
              <h3 className="font-bold text-primary text-lg mb-3">비용 전액 회수 가능</h3>
              <p className="text-foreground/70 text-sm leading-relaxed">완성된 자산으로 자문 1건 또는<br />특강 3건만 수주하면 투자 비용을<br />100% 회수할 수 있습니다.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: DARK COMPARISON */}
      <section className="py-24 md:py-32 bg-primary text-white">
        <div className="container-prose text-center">
          <h2 className="font-serif text-3xl md:text-4xl leading-snug mb-6">
            수백만 원의 강의료, 헛되이 쓰지 마세요.<br />
            오직 성과로 증명합니다.
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto mb-16">
            일반 브랜딩 학원은 이론을 가르치고 수료증을 줍니다.<br />
            우리는 기획부터 디자인까지 100% 대행하고, 실제 수익을 만듭니다.
          </p>
          <div className="max-w-4xl mx-auto bg-white/10 rounded-3xl border border-white/20 overflow-hidden">
            <div className="grid grid-cols-3 p-6 border-b border-white/10 font-bold text-center">
              <div className="text-white/60">구분</div>
              <div className="text-white/60">일반 브랜딩 학원</div>
              <div className="text-accent text-lg">프리미엄 매니지먼트</div>
            </div>
            <div className="grid grid-cols-3 p-6 border-b border-white/10 text-sm text-center items-center">
              <div className="font-bold text-white/80">제공 방식</div>
              <div className="text-white/50">이론 수업 / 피드백</div>
              <div className="font-bold text-white">100% 대행 제작</div>
            </div>
            <div className="grid grid-cols-3 p-6 border-b border-white/10 text-sm text-center items-center">
              <div className="font-bold text-white/80">결과물</div>
              <div className="text-white/50">수료증 / 이력서</div>
              <div className="font-bold text-white">제안서 · 강연안 · 프로필</div>
            </div>
            <div className="grid grid-cols-3 p-6 border-b border-white/10 text-sm text-center items-center">
              <div className="font-bold text-white/80">타겟</div>
              <div className="text-white/50">불특정 다수</div>
              <div className="font-bold text-white">5060 시니어 전담</div>
            </div>
            <div className="grid grid-cols-3 p-6 text-sm text-center items-center">
              <div className="font-bold text-white/80">디지털 작업</div>
              <div className="text-white/50">직접 PPT 작성</div>
              <div className="font-bold text-accent">노동 제로(0)</div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: PROCESS */}
      <section className="py-24">
        <div className="container-prose">
          <div className="text-center mb-6">
            <NumberedLabel number="02">진행 과정</NumberedLabel>
            <h2 className="font-serif text-3xl md:text-4xl text-primary leading-snug mt-4">
              대표님은 말씀만 하시면 됩니다.
            </h2>
            <p className="mt-4 text-foreground/70 text-lg max-w-2xl mx-auto mb-16">복잡한 건 저희가 합니다. 대표님은 경험을 이야기해 주시기만 하면 됩니다.</p>
          </div>
          <div className="relative max-w-5xl mx-auto">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-border -translate-y-1/2 z-0"></div>
            <div className="grid md:grid-cols-4 gap-8 relative z-10">
              {[
                { n: "1", t: "경험 인터뷰", d: "편하게 대화하듯 30년 경험을 들려주세요. 42문항으로 핵심을 찾아드립니다." },
                { n: "2", t: "브랜드 기획", d: "\"이 분에게 맡겨야 하는 이유\"를 시장이 납득할 언어로 만듭니다." },
                { n: "3", t: "문서 제작", d: "제안서, 강연안, 프로필을 세련된 디자인으로 100% 대행 제작합니다." },
                { n: "4", t: "수익화 지원", d: "만들고 끝이 아닙니다. 실제 자문·강연 기회까지 연결해 드립니다." },
              ].map((s) => (
                <div key={s.n} className="bg-white p-8 rounded-2xl border border-border shadow-sm text-center flex flex-col items-center">
                  <div className="w-12 h-12 bg-accent text-white rounded-full flex items-center justify-center font-bold text-xl mb-6 shadow-md border-4 border-white">{s.n}</div>
                  <h3 className="font-bold text-primary text-lg mb-3">{s.t}</h3>
                  <p className="text-sm text-foreground/70 break-keep leading-relaxed">{s.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: DELIVERABLES */}
      <section className="py-24 bg-primary/5">
        <div className="container-prose text-center">
          <NumberedLabel number="03">완성되는 결과물</NumberedLabel>
          <h2 className="font-serif text-3xl md:text-4xl text-primary leading-snug mt-4 mb-6">
            8주 후, 이런 결과물이 완성됩니다.
          </h2>
          <p className="text-foreground/70 text-lg mb-16 max-w-2xl mx-auto">모두 실제로 기업에 보내고, 강연 무대에 쓸 수 있는 실전용 자산입니다.</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            <div className="bg-background border border-border p-8 rounded-2xl shadow-sm">
              <User className="text-accent mb-6" size={32} />
              <h3 className="font-serif text-lg text-primary mb-3">전문가 프로필</h3>
              <p className="text-foreground/70 text-sm leading-relaxed break-keep">"이 분이 누구인지" 한눈에 보여주는 1장짜리 소개 카드. 미팅 자리에서 바로 건넬 수 있습니다.</p>
            </div>
            <div className="bg-background border border-border p-8 rounded-2xl shadow-sm">
              <Briefcase className="text-accent mb-6" size={32} />
              <h3 className="font-serif text-lg text-primary mb-3">B2B 제안서</h3>
              <p className="text-foreground/70 text-sm leading-relaxed break-keep">기업 임원에게 보내는 자문·프로젝트 제안서. "이 분에게 맡기자"는 결정을 이끌어냅니다.</p>
            </div>
            <div className="bg-background border border-border p-8 rounded-2xl shadow-sm">
              <Sparkles className="text-accent mb-6" size={32} />
              <h3 className="font-serif text-lg text-primary mb-3">시그니처 강연안</h3>
              <p className="text-foreground/70 text-sm leading-relaxed break-keep">30장 내외의 PPT 강연 슬라이드. 기업 특강, 세미나에 바로 쓸 수 있습니다.</p>
            </div>
            <div className="bg-background border border-border p-8 rounded-2xl shadow-sm">
              <Check className="text-accent mb-6" size={32} />
              <h3 className="font-serif text-lg text-primary mb-3">컨설팅 패키지</h3>
              <p className="text-foreground/70 text-sm leading-relaxed break-keep">1:1 또는 그룹 컨설팅을 바로 진행할 수 있는 워크시트와 진행 가이드입니다.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: PRICING */}
      <section className="py-24 md:py-32 bg-secondary/40">
        <div className="container-prose text-center">
          <NumberedLabel number="04">패키지</NumberedLabel>
          <h2 className="font-serif text-3xl md:text-4xl text-primary leading-snug mt-4 mb-6">
            필요한 만큼만 선택하세요.
          </h2>
          <p className="text-foreground/70 text-lg max-w-2xl mx-auto">어떤 패키지든 대표님이 직접 작업할 일은 없습니다.</p>
          <div className="mb-16"></div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto text-left">
            <div className="bg-background border border-border p-8 rounded-3xl shadow-sm flex flex-col">
              <h3 className="text-xl font-bold text-muted-foreground mb-2">BASIC</h3>
              <p className="text-primary font-serif text-2xl mb-6">기본 패키지</p>
              <ul className="space-y-4 mb-10 flex-grow text-sm text-foreground/80">
                <li className="flex items-start gap-3"><Check size={18} className="text-muted-foreground shrink-0 mt-0.5" /> 진단 및 기획 코칭</li>
                <li className="flex items-start gap-3"><Check size={18} className="text-muted-foreground shrink-0 mt-0.5" /> 전문가 프로필 1종</li>
              </ul>
              <button className="w-full py-4 rounded-xl font-bold border-2 border-border text-foreground hover:border-primary hover:text-primary transition-colors">문의하기</button>
            </div>
            <div className="bg-primary text-white p-8 rounded-3xl shadow-2xl transform md:scale-105 border-2 border-accent flex flex-col relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-accent text-white px-4 py-1 rounded-full text-xs font-bold tracking-wider">추천</div>
              <h3 className="text-xl font-bold text-accent mb-2">PREMIUM</h3>
              <p className="font-serif text-3xl mb-6">프리미엄 패키지</p>
              <ul className="space-y-4 mb-10 flex-grow text-sm text-white/90">
                <li className="flex items-start gap-3"><Check size={18} className="text-accent shrink-0 mt-0.5" /> BASIC 전체 포함</li>
                <li className="flex items-start gap-3"><Check size={18} className="text-accent shrink-0 mt-0.5" /> B2B 제안서 기획/디자인</li>
                <li className="flex items-start gap-3"><Check size={18} className="text-accent shrink-0 mt-0.5" /> 시그니처 강연안 제작</li>
                <li className="flex items-start gap-3"><Check size={18} className="text-accent shrink-0 mt-0.5" /> 1:1 밀착 VVIP 매니지먼트</li>
              </ul>
              <button className="w-full py-4 rounded-xl font-bold bg-accent text-white hover:bg-accent/90 transition-colors shadow-lg">신청하기</button>
            </div>
            <div className="bg-background border border-border p-8 rounded-3xl shadow-sm flex flex-col">
              <h3 className="text-xl font-bold text-muted-foreground mb-2">STANDARD</h3>
              <p className="text-primary font-serif text-2xl mb-6">표준 패키지</p>
              <ul className="space-y-4 mb-10 flex-grow text-sm text-foreground/80">
                <li className="flex items-start gap-3"><Check size={18} className="text-muted-foreground shrink-0 mt-0.5" /> BASIC 전체 포함</li>
                <li className="flex items-start gap-3"><Check size={18} className="text-muted-foreground shrink-0 mt-0.5" /> B2B 제안서 기획/디자인</li>
              </ul>
              <button className="w-full py-4 rounded-xl font-bold border-2 border-border text-foreground hover:border-primary hover:text-primary transition-colors">문의하기</button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8: FAQ */}
      <FAQ />

      {/* FINAL CTA */}
      <section className="py-24 md:py-32 bg-primary text-primary-foreground text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-accent/20 to-transparent -z-10" />
        <div className="container-prose relative z-10">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl leading-snug mb-6 max-w-3xl mx-auto">
            당신의 다음 명함은,<br />과거의 직함이 아닙니다.
          </h2>
          <p className="text-lg md:text-xl text-primary-foreground/80 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
            이제는 어디에서 일했는지가 아니라<br />
            무엇을 해결할 수 있는 사람인지가 중요합니다.<br /><br />
            20년의 경력을 다음 기회로 바꾸고 싶다면<br />
            먼저 가능성부터 확인하세요.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-5 mb-10">
            <Link to="/diagnosis" className="w-full sm:w-auto bg-accent text-white border-2 border-white/90 px-10 py-5 rounded-full font-bold text-lg hover:bg-accent/90 transition-all shadow-lg hover:scale-105">
              내 경력이 팔릴 수 있는지 진단받기
            </Link>
            <Link to="/service" className="w-full sm:w-auto bg-white text-primary px-10 py-5 rounded-full font-bold text-lg hover:bg-white/90 transition-all shadow-lg hover:scale-105">
              서비스 상세 과정 보기
            </Link>
          </div>
          <p className="text-sm font-bold text-accent/90 tracking-wide bg-accent/10 inline-block px-4 py-2 rounded-full border border-accent/20">
            3분 입력 · 1:1 검토 · 적합하지 않으면 진행을 권하지 않습니다
          </p>
        </div>
      </section>
    </>
  );
}
