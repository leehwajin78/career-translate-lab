import CTAButton from "@/components/site/CTAButton";
import { NumberedLabel } from "@/components/site/Editorial";
import { ArrowRight, ArrowRightLeft, AlertTriangle, Sparkles, Check, Clock, User, Briefcase, ArrowDown } from "lucide-react";
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
            <span>경력 자산화 서비스</span>
          </div>
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl leading-[1.15] text-primary fade-in tracking-tight break-keep">
            30년을 일했는데, <br />
            <span className="inline-block">나를 소개하는 <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary/80">한 문장</span>이 없습니다.</span>
          </h1>
          <p className="mt-8 max-w-3xl text-lg md:text-xl text-foreground/80 leading-relaxed font-medium break-keep">
            30년 경력은 충분합니다. 부족한 건 그 경험을 시장의 언어로 옮기는 작업입니다.<br />
            한끗 프로젝트가 당신의 경력을 시장이 선택하는 자산으로 만들어 드리겠습니다.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <CTAButton to="/diagnosis" variant="primary" className="w-full sm:w-auto justify-center">경력 가치 무료 진단받기</CTAButton>
            <CTAButton to="/consultation" variant="ghost" className="w-full sm:w-auto justify-center">30분 무료 상담 신청하기</CTAButton>
          </div>

          {/* 하단 숫자 */}
          <div className="mt-16 pt-8 border-t border-border/60 flex flex-wrap items-center gap-x-12 gap-y-8 opacity-90">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0">
                <Clock size={24} />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-serif text-primary">1주</span>
                <span className="text-sm font-medium text-muted-foreground mt-0.5">경력 자산 진단</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0">
                <User size={24} />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-serif text-primary">6주</span>
                <span className="text-sm font-medium text-muted-foreground mt-0.5">핵심 자산 완성</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0">
                <Briefcase size={24} />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-serif text-primary">3개월</span>
                <span className="text-sm font-medium text-muted-foreground mt-0.5">론칭 지원</span>
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
            경력은 충분합니다.<br />
            부족한 건 번역입니다.
          </h2>
          <p className="mt-8 text-foreground/70 text-lg max-w-2xl mx-auto">
            회사 안에서는 직함이 나를 설명해줬지만, 회사 밖에서는 다릅니다.<br />
            이제는 내가 누구인지, 무엇을 해결하는 사람인지 스스로 보여줘야 합니다.
          </p>

          <div className="mt-16 relative max-w-5xl mx-auto">
            <div className="grid md:grid-cols-[1fr_auto_1fr] gap-6 items-center">
              {/* INPUT 카드 */}
              <div className="bg-background border border-border p-8 md:p-10 rounded-2xl shadow-sm relative text-left h-full flex flex-col justify-center">
                <h3 className="font-serif text-2xl md:text-3xl font-extrabold text-primary mb-6">당신의 30년 경력</h3>
                <ul className="space-y-5 text-lg md:text-xl text-foreground/90 font-bold">
                  <li className="flex items-center gap-3"><div className="w-2.5 h-2.5 rounded-full bg-accent shrink-0" /> 쌓아온 전문성</li>
                  <li className="flex items-center gap-3"><div className="w-2.5 h-2.5 rounded-full bg-accent shrink-0" /> 현장에서 얻은 노하우</li>
                  <li className="flex items-center gap-3"><div className="w-2.5 h-2.5 rounded-full bg-accent shrink-0" /> 실패와 성공의 스토리</li>
                </ul>
              </div>

              {/* 중간 버튼 */}
              <div className="flex flex-col items-center justify-center text-accent my-2 md:my-0">
                <ArrowRight size={32} className="hidden md:block opacity-50 mb-3" />
                <ArrowDown size={32} className="block md:hidden opacity-50 mb-1" />

                <div className="bg-accent text-white px-10 py-5 rounded-full shadow-xl font-extrabold text-lg md:text-xl whitespace-nowrap tracking-wide hover:scale-105 transition-transform duration-200">
                  한끗프로젝트
                </div>

                <ArrowRight size={32} className="hidden md:block opacity-50 mt-3" />
                <ArrowDown size={32} className="block md:hidden opacity-50 mt-1" />
              </div>

              {/* OUTPUT 카드 */}
              <div className="bg-primary text-primary-foreground p-8 md:p-10 rounded-2xl shadow-xl relative text-left h-full transform md:scale-105 transition-transform border border-primary-foreground/10 flex flex-col justify-center">
                <h3 className="font-serif text-2xl md:text-3xl font-extrabold mb-6 text-white">시장이 선택하는 자산</h3>
                <ul className="space-y-5 text-lg md:text-xl text-white font-bold">
                  <li className="flex items-center gap-3"><div className="w-2.5 h-2.5 rounded-full bg-white shrink-0" /> 전문가 프로필 1페이지</li>
                  <li className="flex items-center gap-3"><div className="w-2.5 h-2.5 rounded-full bg-white shrink-0" /> B2B 제안서 템플릿</li>
                  <li className="flex items-center gap-3"><div className="w-2.5 h-2.5 rounded-full bg-white shrink-0" /> 대표 강의안 (60분)</li>
                  <li className="flex items-center gap-3"><div className="w-2.5 h-2.5 rounded-full bg-white shrink-0" /> 채널 진입 전략 가이드</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: 시간 대비 성과 */}
      <section className="py-24 md:py-32">
        <div className="container-prose text-center">
          <NumberedLabel number="01">시간 대비 성과</NumberedLabel>
          <h2 className="font-serif text-3xl md:text-4xl text-primary leading-snug mt-4 mb-6">
            혼자 6개월, 한끗과 함께라면 6주.
          </h2>
          <p className="text-foreground/70 text-lg max-w-2xl mx-auto mb-16 break-keep">
            무엇을 살리고, 무엇을 버리고, 어떤 말로 팔아야 하는지<br className="hidden md:block" />
            혼자서는 계속 막히기 마련입니다. 한끗은 그 6개월을 6주로 줄입니다.
          </p>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto text-left">

            {/* 카드 1 */}
            <div className="bg-background border border-border p-8 rounded-2xl shadow-sm flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-muted-foreground/10 rounded-full flex items-center justify-center text-muted-foreground mb-6">
                <Clock size={32} />
              </div>
              <h3 className="font-extrabold text-muted-foreground text-xl md:text-2xl mb-2 tracking-tight break-keep">혼자 준비할 때</h3>
              <p className="text-2xl md:text-3xl font-serif font-extrabold text-muted-foreground mb-4 tracking-tight break-keep">6개월 이상 <span className="text-sm md:text-base font-normal">(24주~)</span></p>
              <p className="text-foreground/85 text-base md:text-lg leading-relaxed break-keep font-medium">
                무엇부터 시작할지 막막한 채<br />
                시행착오를 반복하는 시간입니다.<br />
                시작도 끝도 보이지 않습니다.
              </p>
            </div>

            {/* 카드 2 — 강조 */}
            <div className="bg-primary/5 border-2 border-accent p-8 rounded-2xl shadow-md flex flex-col items-center text-center relative">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center text-accent mb-6">
                <ArrowRightLeft size={32} />
              </div>
              <h3 className="font-extrabold text-primary text-xl md:text-2xl mb-2 tracking-tight break-keep">한끗과 함께</h3>
              <p className="text-2xl md:text-3xl font-serif font-extrabold text-accent mb-4 tracking-tight break-keep">6주 <span className="text-sm md:text-base font-normal text-primary">(핵심 자산 완성)</span></p>
              <p className="text-foreground/85 text-base md:text-lg leading-relaxed break-keep font-medium">
                1주 진단으로 방향을 잡고,<br />
                6주 빌드로 강의안·제안서·프로필을<br />
                손에 쥐고 시장으로 나갑니다.
              </p>
            </div>

            {/* 카드 3 */}
            <div className="bg-background border border-border p-8 rounded-2xl shadow-sm flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-400 mb-6">
                <AlertTriangle size={32} />
              </div>
              <h3 className="font-extrabold text-red-400 text-xl md:text-2xl mb-2 tracking-tight break-keep">가장 큰 손실</h3>
              <p className="text-2xl md:text-3xl font-serif font-extrabold text-red-400 mb-4 tracking-tight break-keep">시작하지 못한 시간</p>
              <p className="text-foreground/85 text-base md:text-lg leading-relaxed break-keep font-medium">
                가장 위험한 것은 끔찍하게 바쁘게,<br />
                아무것도 시작하지 못한 시간입니다.<br />
                오늘이 가장 빠른 날입니다.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 3: 3 VALUE PROPS */}
      <section className="py-24 bg-secondary/40">
        <div className="container-prose text-center">
          <h2 className="font-serif text-3xl md:text-4xl text-primary leading-snug mb-6">
            왜 한끗프로젝트를 <br />
            선택해야 할까?
          </h2>
          <p className="text-foreground/70 text-lg mb-16 max-w-2xl mx-auto">컴퓨터 앞에 앉아 끙끙댈 필요 없습니다.<br />대표님의 체면과 귀중한 시간을 지켜드립니다.</p>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="flex flex-col items-center bg-background p-8 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center text-accent mb-6"><Clock size={32} /></div>
              <h3 className="font-extrabold text-primary text-2xl md:text-3xl mb-4 text-center break-keep leading-tight">PPT · 문서 작업 제로</h3>
              <p className="text-foreground/80 text-base md:text-lg leading-relaxed text-center font-medium">대표님은 편하게 말씀만 하세요.<br />인터뷰 내용만으로 모든 문서를<br />우리가 완성합니다.</p>
            </div>
            <div className="flex flex-col items-center bg-background p-8 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center text-accent mb-6"><User size={32} /></div>
              <h3 className="font-extrabold text-primary text-2xl md:text-3xl mb-4 text-center break-keep leading-tight">1:1 전담 매니저 배정</h3>
              <p className="text-foreground/80 text-base md:text-lg leading-relaxed text-center font-medium">여러 수강생 중 한 명이 아닙니다.<br />대표님만을 위한 전담 매니저가<br />과정 내내 밀착 관리합니다.</p>
            </div>
            <div className="flex flex-col items-center bg-background p-8 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center text-accent mb-6"><Briefcase size={32} /></div>
              <h3 className="font-extrabold text-primary text-2xl md:text-3xl mb-4 text-center break-keep leading-tight">장기적으로 활용 가능한 자산</h3>
              <p className="text-foreground/80 text-base md:text-lg leading-relaxed text-center font-medium">완성된 자산은 강의, 자문, 제안 등<br />다양한 기회에 반복적으로<br />활용할 수 있습니다.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: DARK COMPARISON */}
      <section className="py-24 md:py-32 bg-primary text-white">
        <div className="container-prose text-center">
          <h2 className="font-serif text-3xl md:text-4xl leading-snug mb-6">
            왜 한끗프로젝트인가.
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto mb-16 break-keep leading-relaxed">
            강사 양성 과정도,<br />
            일반 브랜딩 컨설팅도 아닙니다.<br />
            경력을 시장이 선택하는<br />
            자산으로 만드는 서비스입니다.
          </p>
          {/* 모바일 화면 전용 비교 레이아웃 (md:hidden) */}
          <div className="block md:hidden max-w-md mx-auto space-y-4 px-4">
            {[
              { label: "제공 방식", normal: "이론 수업 / 피드백", special: "100% 대행 제작" },
              { label: "결과물", normal: "수료증 / 이력서", special: "제안서 · 강연안 · 프로필" },
              { label: "타겟", normal: "불특정 다수", special: "시니어 경력자 전담" },
              { label: "디지털 작업", normal: "직접 PPT 작성", special: "노동 제로(0)" },
            ].map((item, idx) => (
              <div key={idx} className="bg-white/5 border border-white/15 rounded-2xl p-5 text-left hover:bg-white/10 transition-colors shadow-sm">
                <p className="text-white text-base font-extrabold tracking-wide mb-3">{item.label}</p>
                <div className="grid grid-cols-[35%_65%] gap-4 text-sm">
                  <div>
                    <span className="text-white/50 text-xs block mb-1">일반 브랜딩 학원</span>
                    <span className="text-white/80 font-medium block break-keep leading-relaxed">{item.normal}</span>
                  </div>
                  <div className="border-l border-white/15 pl-4">
                    <span className="text-white/60 text-xs block mb-1">한끗프로젝트</span>
                    <span className="text-white font-extrabold block break-keep leading-relaxed">{item.special}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 데스크톱 화면 전용 비교 테이블 (hidden md:block) */}
          <div className="hidden md:block max-w-4xl mx-auto bg-white/10 rounded-3xl border border-white/20 overflow-hidden text-white">
            <div className="grid grid-cols-3 p-6 border-b border-white/10 font-bold text-center">
              <div>구분</div>
              <div>일반 브랜딩 학원</div>
              <div className="text-lg text-white font-extrabold">한끗프로젝트</div>
            </div>
            <div className="grid grid-cols-3 p-6 border-b border-white/10 text-sm text-center items-center">
              <div className="font-bold">제공 방식</div>
              <div>이론 수업 / 피드백</div>
              <div className="font-bold text-white text-base">100% 대행 제작</div>
            </div>
            <div className="grid grid-cols-3 p-6 border-b border-white/10 text-sm text-center items-center">
              <div className="font-bold">결과물</div>
              <div>수료증 / 이력서</div>
              <div className="font-bold text-white text-base">제안서 · 강연안 · 프로필</div>
            </div>
            <div className="grid grid-cols-3 p-6 border-b border-white/10 text-sm text-center items-center">
              <div className="font-bold">타겟</div>
              <div>불특정 다수</div>
              <div className="font-bold text-white text-base">시니어 경력자 전담</div>
            </div>
            <div className="grid grid-cols-3 p-6 text-sm text-center items-center">
              <div className="font-bold">디지털 작업</div>
              <div>직접 PPT 작성</div>
              <div className="font-bold text-white text-base">노동 제로(0)</div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: PROCESS */}
      <section id="process" className="py-24">
        <div className="container-prose">
          <div className="text-center mb-6">
            <NumberedLabel number="02">진행 과정</NumberedLabel>
            <h2 className="font-serif text-3xl md:text-4xl text-primary leading-snug mt-4">
              진단부터 론칭까지 단계별로 진행합니다.
            </h2>
            <p className="mt-4 text-foreground/70 text-lg max-w-2xl mx-auto mb-16 break-keep leading-relaxed">
              처음부터 큰 결정을 내릴 필요 없습니다.<br />
              진단으로 방향을 확인하고,<br />
              필요한 단계까지 이어가면 됩니다.
            </p>
          </div>
          <div className="relative max-w-5xl mx-auto">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-border -translate-y-1/2 z-0"></div>
            <div className="grid md:grid-cols-4 gap-8 relative z-10">
              {[
                { n: "1", t: "경험 인터뷰", d: "편하게 대화하듯 30년 경험을 들려주세요. 42문항으로 핵심을 찾아드립니다." },
                { n: "2", t: "브랜드 기획", d: "\"이 분에게 맡겨야 하는 이유\"를 시장이 납득할 언어로 만듭니다." },
                { n: "3", t: "문서 제작", d: "제안서, 강연안, 프로필을 세련된 디자인으로 100% 대행 제작합니다." },
                { n: "4", t: "기회 탐색 지원", d: "만들고 끝이 아닙니다. 강의·자문 기회 탐색 및 소개를 지원해 드립니다." },
              ].map((s) => (
                <div key={s.n} className="bg-white p-8 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow text-center flex flex-col items-center">
                  <div className="w-14 h-14 bg-accent text-white rounded-full flex items-center justify-center font-extrabold text-2xl mb-6 shadow-md border-4 border-white">{s.n}</div>
                  <h3 className="font-extrabold text-primary text-2xl md:text-3xl mb-4 text-center break-keep leading-tight">{s.t}</h3>
                  <p className="text-base md:text-lg text-foreground/80 break-keep leading-relaxed font-medium">{s.d}</p>
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
            6주 후, 손에 쥐는 자산입니다.
          </h2>
          <p className="text-foreground/70 text-lg mb-16 max-w-2xl mx-auto">한끗 빌드 종료 시 완성되는 핵심 산출물입니다.</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            <div className="bg-background border border-border p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <User className="text-accent mb-6" size={32} />
              <h3 className="font-serif text-2xl md:text-3xl font-extrabold text-primary mb-3 leading-snug break-keep">전문가 프로필 1페이지</h3>
              <p className="text-foreground/80 text-base md:text-lg leading-relaxed break-keep font-medium">"이 분이 누구인지" 한눈에 보여주는 소개 카드. 미팅 자리에서 바로 건넬 수 있습니다.</p>
            </div>
            <div className="bg-background border border-border p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <Briefcase className="text-accent mb-6" size={32} />
              <h3 className="font-serif text-2xl md:text-3xl font-extrabold text-primary mb-3 leading-snug break-keep">B2B 제안서 템플릿</h3>
              <p className="text-foreground/80 text-base md:text-lg leading-relaxed break-keep font-medium">기업 임원에게 보내는 자문·프로젝트 제안서. "이 분에게 맡기자"는 결정을 이끌어냅니다.</p>
            </div>
            <div className="bg-background border border-border p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <Sparkles className="text-accent mb-6" size={32} />
              <h3 className="font-serif text-2xl md:text-3xl font-extrabold text-primary mb-3 leading-snug break-keep">대표 강의안 (60분)</h3>
              <p className="text-foreground/80 text-base md:text-lg leading-relaxed break-keep font-medium">기업 특강, 세미나에 바로 쓸 수 있는 시그니처 강의 슬라이드입니다.</p>
            </div>
            <div className="bg-background border border-border p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <Check className="text-accent mb-6" size={32} />
              <h3 className="font-serif text-2xl md:text-3xl font-extrabold text-primary mb-3 leading-snug break-keep">채널 진입 전략 가이드</h3>
              <p className="text-foreground/80 text-base md:text-lg leading-relaxed break-keep font-medium">어떤 채널에서, 어떤 방식으로 시작할지 실행 가능한 전략을 정리해 드립니다.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: 단계별 상품 */}
      <section id="packages" className="py-24 md:py-32 bg-secondary/40">
        <div className="container-prose text-center">
          <NumberedLabel number="04">단계별 상품</NumberedLabel>
          <h2 className="font-serif text-3xl md:text-4xl text-primary leading-snug mt-4 mb-6">
            단계별로 시작하세요.
          </h2>
          <p className="text-foreground/70 text-lg max-w-2xl mx-auto">
            진단부터 시작해, 필요한 만큼만 진행하시면 됩니다.
          </p>
          <div className="mb-16"></div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto text-left">

            {/* 카드 1: 한끗 진단 */}
            <div className="bg-background border-2 border-accent p-6 md:p-8 pt-10 rounded-3xl shadow-lg flex flex-col relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-accent text-white px-4 py-1 rounded-full text-xs font-bold tracking-wider whitespace-nowrap">시작은 여기서</div>
              <h3 className="text-xs font-bold text-accent mb-2 tracking-widest uppercase mt-3">STEP 1</h3>
              <p className="text-primary font-serif text-3xl md:text-4xl font-extrabold mb-2">한끗 진단</p>
              <p className="text-foreground/70 text-xs mb-4 break-keep">내 경력의 시장 가치를 진단합니다</p>
              <div className="mb-4 flex items-baseline gap-1">
                <span className="text-2xl md:text-3xl font-serif font-bold text-black tracking-tight">500,000</span>
                <span className="text-xs text-foreground/70 font-medium">원</span>
              </div>
              <p className="text-xs text-foreground/70 mb-5">부가세 별도 · 1주</p>
              <hr className="border-border mb-5" />
              <ul className="space-y-3 mb-8 flex-grow text-xs text-foreground/80 font-medium">
                <li className="flex items-start gap-2"><Check size={14} className="text-accent shrink-0 mt-0.5" /> 1:1 인터뷰 60분</li>
                <li className="flex items-start gap-2"><Check size={14} className="text-accent shrink-0 mt-0.5" /> 경력 자산 진단 리포트 A4 3~5장</li>
                <li className="flex items-start gap-2"><Check size={14} className="text-accent shrink-0 mt-0.5" /> 자산화 로드맵 1장</li>
                <li className="flex items-start gap-2"><Check size={14} className="text-accent shrink-0 mt-0.5" /> 30분 해석 미팅</li>
              </ul>
              <Link to="/apply/diagnosis" className="w-full py-3.5 rounded-xl font-bold bg-accent text-white hover:bg-accent/90 transition-colors shadow-lg text-center text-sm">한끗 진단 신청하기</Link>
            </div>

            {/* 카드 2: 한끗 빌드 */}
            <div className="bg-background border border-border p-6 md:p-8 rounded-3xl shadow-sm flex flex-col">
              <h3 className="text-xs font-bold text-primary mb-2 tracking-widest uppercase">STEP 2</h3>
              <p className="text-primary font-serif text-3xl md:text-4xl font-extrabold mb-2">한끗 빌드</p>
              <p className="text-foreground/70 text-xs mb-4 break-keep">강의안·프로필·제안서를 완성합니다</p>
              <div className="mb-4 flex items-baseline gap-1">
                <span className="text-2xl md:text-3xl font-serif font-bold text-black tracking-tight">3,500,000</span>
                <span className="text-xs text-foreground/70 font-medium">원</span>
              </div>
              <p className="text-xs text-foreground/70 mb-5">부가세 별도 · 6주</p>
              <hr className="border-border mb-5" />
              <ul className="space-y-3 mb-8 flex-grow text-xs text-foreground/80 font-medium">
                <li className="flex items-start gap-2"><Check size={14} className="text-accent shrink-0 mt-0.5" /> 1:1 심층 인터뷰 2회</li>
                <li className="flex items-start gap-2"><Check size={14} className="text-accent shrink-0 mt-0.5" /> 브랜드 메시지 설계</li>
                <li className="flex items-start gap-2"><Check size={14} className="text-accent shrink-0 mt-0.5" /> 전문가 프로필 1페이지</li>
                <li className="flex items-start gap-2"><Check size={14} className="text-accent shrink-0 mt-0.5" /> 대표 강의안 1개, 60분</li>
                <li className="flex items-start gap-2"><Check size={14} className="text-accent shrink-0 mt-0.5" /> B2B 제안서 템플릿</li>
                <li className="flex items-start gap-2"><Check size={14} className="text-accent shrink-0 mt-0.5" /> 채널 전략 가이드</li>
                <li className="flex items-start gap-2"><Check size={14} className="text-accent shrink-0 mt-0.5" /> 주 1회 코칭, 총 6회</li>
              </ul>
              <Link to="/apply/build" className="w-full py-3.5 rounded-xl font-bold border border-border text-primary hover:border-primary transition-colors text-center text-sm">한끗 빌드 신청하기</Link>
            </div>

            {/* 카드 3: 한끗 론칭 */}
            <div className="bg-background border border-border p-6 md:p-8 rounded-3xl shadow-sm flex flex-col">
              <h3 className="text-xs font-bold text-primary mb-2 tracking-widest uppercase">STEP 3</h3>
              <p className="text-primary font-serif text-3xl md:text-4xl font-extrabold mb-2">한끗 론칭</p>
              <p className="text-foreground/70 text-xs mb-4 break-keep">실제 무대와 수익 기회에 접근하도록 지원합니다</p>
              <div className="mb-4 flex items-baseline gap-1">
                <span className="text-2xl md:text-3xl font-serif font-bold text-black tracking-tight">7,000,000</span>
                <span className="text-xs text-foreground/70 font-medium">원</span>
              </div>
              <p className="text-xs text-foreground/70 mb-5">부가세 별도 · 3개월</p>
              <hr className="border-border mb-5" />
              <ul className="space-y-3 mb-8 flex-grow text-xs text-foreground/80 font-medium">
                <li className="flex items-start gap-2"><Check size={14} className="text-accent shrink-0 mt-0.5" /> 한끗 빌드 전체 포함</li>
                <li className="flex items-start gap-2"><Check size={14} className="text-accent shrink-0 mt-0.5" /> 강의 리허설·피드백 2회</li>
                <li className="flex items-start gap-2"><Check size={14} className="text-accent shrink-0 mt-0.5" /> 온라인 프로필 페이지 제작</li>
                <li className="flex items-start gap-2"><Check size={14} className="text-accent shrink-0 mt-0.5" /> 강의·자문 제안처 발굴 및 소개 지원</li>
                <li className="flex items-start gap-2"><Check size={14} className="text-accent shrink-0 mt-0.5" /> 3개월 론칭 코칭, 월 2회</li>
              </ul>
              <Link to="/apply/launch" className="w-full py-3.5 rounded-xl font-bold border border-border text-primary hover:border-primary transition-colors text-center text-sm">한끗 론칭 신청하기</Link>
            </div>

            {/* 카드 4: 한끗 파트너 */}
            <div className="bg-background border border-border p-6 md:p-8 rounded-3xl shadow-sm flex flex-col">
              <h3 className="text-xs font-bold text-muted-foreground mb-2 tracking-widest uppercase">후속 리테이너</h3>
              <p className="text-primary font-serif text-3xl md:text-4xl font-extrabold mb-2">한끗 파트너</p>
              <p className="text-foreground/70 text-xs mb-4 break-keep">매월 점검하고, 다음 기회를 설계합니다</p>
              <div className="mb-4 flex items-baseline gap-1">
                <span className="text-lg text-foreground/70 font-medium mr-1">월</span>
                <span className="text-2xl md:text-3xl font-serif font-bold text-black tracking-tight">1,000,000</span>
                <span className="text-xs text-foreground/70 font-medium">원</span>
              </div>
              <p className="text-xs text-foreground/70 mb-5">
                부가세 별도 · 월 단위 <br />
                (3개월 이상 시 할인)
              </p>
              <hr className="border-border mb-5" />
              <ul className="space-y-3 mb-8 flex-grow text-xs text-foreground/80 font-medium">
                <li className="flex items-start gap-2"><Check size={14} className="text-accent shrink-0 mt-0.5" /> 월 2회 코칭</li>
                <li className="flex items-start gap-2"><Check size={14} className="text-accent shrink-0 mt-0.5" /> 콘텐츠 리뷰 및 업데이트</li>
                <li className="flex items-start gap-2"><Check size={14} className="text-accent shrink-0 mt-0.5" /> 신규 기회 탐색 및 소개 지원</li>
                <li className="flex items-start gap-2"><Check size={14} className="text-accent shrink-0 mt-0.5" /> 분기별 브랜드 점검 리포트</li>
              </ul>
              <Link to="/apply/partner" className="w-full py-3.5 rounded-xl font-bold border border-border text-primary hover:border-primary transition-colors text-center text-sm">한끗 파트너 신청하기</Link>
            </div>

          </div>

        </div>
      </section>

      {/* SECTION 8: FAQ */}
      <FAQ />

      {/* FINAL CTA */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-accent/20 to-transparent -z-10" />
        <div className="container-prose relative z-10">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl leading-snug mb-6 max-w-3xl mx-auto">
            당신의 다음 명함은,<br />과거의 직함이 아닙니다.
          </h2>
          <p className="text-lg md:text-xl text-primary-foreground/80 mb-10 max-w-3xl mx-auto leading-relaxed break-keep">
            이제 어디에서 일했는지가 아니라,<br />
            무엇을 해줄 수 있는 사람인지가 중요합니다.<br />
            30년의 경력을 다음 기회로 바꾸고 싶다면<br />
            지금 시작하세요.
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
