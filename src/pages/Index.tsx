import CTAButton from "@/components/site/CTAButton";
import { NumberedLabel } from "@/components/site/Editorial";
import { ArrowRight, ArrowRightLeft, AlertTriangle, Sparkles, Check, Clock, User, Briefcase, ArrowDown, FileText, MessageSquare } from "lucide-react";
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
          <h1 className="font-serif text-fluid-hero leading-[1.15] text-primary fade-in tracking-tight break-keep">
            30년을 일했는데, <br />
            <span className="inline-block">나를 소개하는 <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary/80">한 문장</span>이 없습니다.</span>
          </h1>
          <p className="mt-8 max-w-3xl text-lg md:text-xl text-foreground/80 leading-relaxed font-medium break-keep">
            30년 경력은 충분합니다.<br />
            부족한 건 그 경험을 시장이 알아보는 형태로 정리한 자료입니다.<br />
            한끗프로젝트가 당신의 경력을 시장이 선택하는 자산으로 만들어 드립니다.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <CTAButton to="/diagnosis" variant="primary" className="w-full sm:w-auto justify-center">경력 가치 무료 진단받기 →</CTAButton>
            <CTAButton to="/consultation" variant="ghost" className="w-full sm:w-auto justify-center">30분 무료 상담 신청하기</CTAButton>
          </div>

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

        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 h-[80vh] bg-gradient-to-bl from-accent/20 to-transparent blur-3xl -z-10 rounded-full" />
        <div className="absolute -left-20 bottom-0 w-96 h-96 bg-primary/5 blur-3xl -z-10 rounded-full" />
      </section>

      {/* SECTION 1: 가치 제안 */}
      <section className="py-24 bg-secondary/40">
        <div className="container-prose text-center">
          <h2 className="font-serif text-2xl md:text-3xl text-primary leading-snug">
            경력은 충분합니다.<br />
            부족한 건 번역입니다.
          </h2>
          <p className="mt-8 text-foreground/70 text-lg max-w-2xl mx-auto">
            노하우는 머릿속에 있고, 시장은 문서를 요구합니다.
          </p>

          <div className="mt-16 relative max-w-5xl mx-auto">
            <div className="grid md:grid-cols-[1fr_auto_1fr] gap-6 items-center">
              <div className="bg-background border border-border p-8 md:p-10 rounded-2xl shadow-sm relative text-left h-full flex flex-col justify-center">
                <h3 className="font-serif text-2xl md:text-3xl font-extrabold text-primary mb-6">당신의 30년 경력</h3>
                <ul className="space-y-5 text-lg md:text-xl text-foreground/90 font-bold">
                  <li className="flex items-center gap-3"><div className="w-2.5 h-2.5 rounded-full bg-accent shrink-0" /> 분야별 전문성</li>
                  <li className="flex items-center gap-3"><div className="w-2.5 h-2.5 rounded-full bg-accent shrink-0" /> 현장에서 쌓은 노하우</li>
                  <li className="flex items-center gap-3"><div className="w-2.5 h-2.5 rounded-full bg-accent shrink-0" /> 실패와 성공의 흔적</li>
                </ul>
              </div>

              <div className="flex flex-col items-center justify-center text-accent my-2 md:my-0">
                <ArrowRight size={32} className="hidden md:block opacity-50 mb-3" />
                <ArrowDown size={32} className="block md:hidden opacity-50 mb-1" />
                <div className="bg-accent text-white px-10 py-5 rounded-full shadow-xl font-extrabold text-lg md:text-xl whitespace-nowrap tracking-wide hover:scale-105 transition-transform duration-200">
                  한끗프로젝트
                </div>
                <ArrowRight size={32} className="hidden md:block opacity-50 mt-3" />
                <ArrowDown size={32} className="block md:hidden opacity-50 mt-1" />
              </div>

              <div className="bg-primary text-primary-foreground p-8 md:p-10 rounded-2xl shadow-xl relative text-left h-full transform md:scale-105 transition-transform border border-primary-foreground/10 flex flex-col justify-center">
                <h3 className="font-serif text-2xl md:text-3xl font-extrabold mb-6 text-white">시장이 선택하는 자산</h3>
                <ul className="space-y-5 text-lg md:text-xl text-white font-bold">
                  <li className="flex items-center gap-3"><div className="w-2.5 h-2.5 rounded-full bg-white shrink-0" /> 전문가 강의안</li>
                  <li className="flex items-center gap-3"><div className="w-2.5 h-2.5 rounded-full bg-white shrink-0" /> 대표 경력서</li>
                  <li className="flex items-center gap-3"><div className="w-2.5 h-2.5 rounded-full bg-white shrink-0" /> B2B 제안서</li>
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
            혼자 하면 6개월, 한끗과 함께하면 6주
          </h2>
          <p className="text-foreground/70 text-lg max-w-2xl mx-auto mb-16 break-keep">
            막막한 자료 정리부터 강의안, 제안서까지 빠르게 완성합니다.
          </p>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto text-left">

            <div className="bg-background border border-border p-8 rounded-2xl shadow-sm flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-muted-foreground/10 rounded-full flex items-center justify-center text-muted-foreground mb-6">
                <Clock size={32} />
              </div>
              <h3 className="font-extrabold text-muted-foreground text-xl md:text-2xl mb-2 tracking-tight break-keep">혼자 하면</h3>
              <p className="text-2xl md:text-3xl font-serif font-extrabold text-muted-foreground mb-4 tracking-tight break-keep">6개월+</p>
              <p className="text-foreground/85 text-base md:text-lg leading-relaxed break-keep font-medium">
                자료 조사와 작성 사이를 오가다 멈춥니다.<br />
                완성보다 시작이 반복됩니다.
              </p>
            </div>

            <div className="bg-primary/5 border-2 border-accent p-8 rounded-2xl shadow-md flex flex-col items-center text-center relative">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center text-accent mb-6">
                <ArrowRightLeft size={32} />
              </div>
              <h3 className="font-extrabold text-primary text-xl md:text-2xl mb-2 tracking-tight break-keep">한끗과 함께</h3>
              <p className="text-2xl md:text-3xl font-serif font-extrabold text-accent mb-4 tracking-tight break-keep">6주 완성</p>
              <p className="text-foreground/85 text-base md:text-lg leading-relaxed break-keep font-medium">
                전문 코치와 함께 프로필, 강의안, 제안서를<br />
                손에 쥐고 시장으로 나갑니다.
              </p>
            </div>

            <div className="bg-background border border-border p-8 rounded-2xl shadow-sm flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-400 mb-6">
                <AlertTriangle size={32} />
              </div>
              <h3 className="font-extrabold text-red-400 text-xl md:text-2xl mb-2 tracking-tight break-keep">시작 못 하면</h3>
              <p className="text-2xl md:text-3xl font-serif font-extrabold text-red-400 mb-4 tracking-tight break-keep">기회비용</p>
              <p className="text-foreground/85 text-base md:text-lg leading-relaxed break-keep font-medium">
                특강 요청이 와도 자료가 없어 거절하는<br />
                시간이 계속 쌓입니다.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 3: 3 VALUE PROPS */}
      <section className="py-24 bg-secondary/40">
        <div className="container-prose text-center">
          <h2 className="font-serif text-3xl md:text-4xl text-primary leading-snug mb-6">
            경험만 말씀하세요.<br />
            문서와 구조는 한끗이 완성합니다.
          </h2>
          <p className="text-foreground/70 text-lg mb-16 max-w-2xl mx-auto">경험과 노하우를 듣고, 시장에서 통하는 자료로 정리해드립니다.</p>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="flex flex-col items-center bg-background p-8 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center text-accent mb-6"><Clock size={32} /></div>
              <h3 className="font-extrabold text-primary text-2xl md:text-3xl mb-4 text-center break-keep leading-tight">PPT 작업 제로</h3>
              <p className="text-foreground/80 text-base md:text-lg leading-relaxed text-center font-medium">슬라이드·문서 제작은 한끗이 합니다.<br />고객은 경험을 말하기만 하면 됩니다.</p>
            </div>
            <div className="flex flex-col items-center bg-background p-8 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center text-accent mb-6"><User size={32} /></div>
              <h3 className="font-extrabold text-primary text-2xl md:text-3xl mb-4 text-center break-keep leading-tight">1:1 맞춤 코칭</h3>
              <p className="text-foreground/80 text-base md:text-lg leading-relaxed text-center font-medium">경력과 목표에 맞춰 과정 내내<br />밀착 관리하는 코칭입니다.</p>
            </div>
            <div className="flex flex-col items-center bg-background p-8 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center text-accent mb-6"><Briefcase size={32} /></div>
              <h3 className="font-extrabold text-primary text-2xl md:text-3xl mb-4 text-center break-keep leading-tight">장기 활용 자산</h3>
              <p className="text-foreground/80 text-base md:text-lg leading-relaxed text-center font-medium">명함·제안·강의에 반복 사용하는<br />문서 자산을 남깁니다.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: DARK COMPARISON */}
      <section className="py-24 md:py-32 bg-primary text-white">
        <div className="container-prose text-center">
          <h2 className="font-serif text-3xl md:text-4xl leading-snug mb-6">
            그냥 배우는 곳이 아니라,<br />바로 써먹는 결과물을 만드는 곳.
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto mb-16 break-keep leading-relaxed">
            PPT, 강의안, 제안서를 실제 사업에 쓸 수 있게 만들어드립니다.
          </p>
          <div className="block md:hidden max-w-md mx-auto space-y-4 px-4">
            {[
              { label: "방식", normal: "단체 강의 수강", special: "1:1 맞춤 설계 · 제작 코칭" },
              { label: "산출물", normal: "수료증 · 과제물", special: "프로필 · 강의안 · 제안서 등 실전 문서 6종" },
              { label: "제작 주체", normal: "고객이 직접 제작", special: "한끗이 제작, 고객은 검수 · 확정" },
              { label: "이후 연결", normal: "없음", special: "무대 · 제안처 탐색 지원(론칭 · 파트너)" },
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

          <div className="hidden md:block max-w-4xl mx-auto bg-white/10 rounded-3xl border border-white/20 overflow-hidden text-white">
            <div className="grid grid-cols-3 p-6 border-b border-white/10 font-bold text-center">
              <div>구분</div>
              <div>일반 브랜딩 학원</div>
              <div className="text-lg text-white font-extrabold">한끗프로젝트</div>
            </div>
            <div className="grid grid-cols-3 p-6 border-b border-white/10 text-sm text-center items-center">
              <div className="font-bold">방식</div>
              <div>단체 강의 수강</div>
              <div className="font-bold text-white text-base">1:1 맞춤 설계 · 제작 코칭</div>
            </div>
            <div className="grid grid-cols-3 p-6 border-b border-white/10 text-sm text-center items-center">
              <div className="font-bold">산출물</div>
              <div>수료증 · 과제물</div>
              <div className="font-bold text-white text-base">프로필 · 강의안 · 제안서 등 실전 문서 6종</div>
            </div>
            <div className="grid grid-cols-3 p-6 border-b border-white/10 text-sm text-center items-center">
              <div className="font-bold">제작 주체</div>
              <div>고객이 직접 제작</div>
              <div className="font-bold text-white text-base">한끗이 제작, 고객은 검수 · 확정</div>
            </div>
            <div className="grid grid-cols-3 p-6 text-sm text-center items-center">
              <div className="font-bold">이후 연결</div>
              <div>없음</div>
              <div className="font-bold text-white text-base">무대 · 제안처 탐색 지원(론칭 · 파트너)</div>
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
                { n: "1", t: "경험 인터뷰", d: "42문항 구조화 인터뷰로 경험을 끝까지 꺼냅니다." },
                { n: "2", t: "브랜드 기획", d: "핵심 메시지와 포지셔닝 전략을 설계합니다." },
                { n: "3", t: "문서 제작", d: "프로필·강의안·제안서를 실물로 제작합니다." },
                { n: "4", t: "기회 탐색 지원", d: "강의·자문 제안처를 함께 발굴합니다." },
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

      {/* SECTION 6: DELIVERABLES — 6카드 */}
      <section className="py-24 bg-primary/5">
        <div className="container-prose text-center">
          <NumberedLabel number="03">완성되는 결과물</NumberedLabel>
          <h2 className="font-serif text-3xl md:text-4xl text-primary leading-snug mt-4 mb-6">
            6주 후, 손에 쥐는 자산입니다.
          </h2>
          <p className="text-foreground/70 text-lg mb-16 max-w-2xl mx-auto">한끗 빌드 종료 시 완성되는 핵심 산출물입니다.</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
            <div className="bg-background border border-border p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <FileText className="text-accent mb-6" size={32} />
              <h3 className="font-serif text-2xl md:text-3xl font-extrabold text-primary mb-3 leading-snug break-keep">한 줄 포지셔닝</h3>
              <p className="text-foreground/80 text-base md:text-lg leading-relaxed break-keep font-medium">당신을 한 문장으로 설명하는 핵심 메시지. 명함·SNS 자기소개에 그대로 활용 가능합니다.</p>
            </div>
            <div className="bg-background border border-border p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <User className="text-accent mb-6" size={32} />
              <h3 className="font-serif text-2xl md:text-3xl font-extrabold text-primary mb-3 leading-snug break-keep">전문가 프로필</h3>
              <p className="text-foreground/80 text-base md:text-lg leading-relaxed break-keep font-medium">고문 계약·강사 등록·파트너십용 1페이지 약력서입니다.</p>
            </div>
            <div className="bg-background border border-border p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <Sparkles className="text-accent mb-6" size={32} />
              <h3 className="font-serif text-2xl md:text-3xl font-extrabold text-primary mb-3 leading-snug break-keep">대표 강의안</h3>
              <p className="text-foreground/80 text-base md:text-lg leading-relaxed break-keep font-medium">기업 특강·세미나에 바로 쓰는 시그니처 슬라이드입니다.</p>
            </div>
            <div className="bg-background border border-border p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <Briefcase className="text-accent mb-6" size={32} />
              <h3 className="font-serif text-2xl md:text-3xl font-extrabold text-primary mb-3 leading-snug break-keep">B2B 제안서</h3>
              <p className="text-foreground/80 text-base md:text-lg leading-relaxed break-keep font-medium">기업·기관에 보낼 수 있는 컨설팅·자문 제안용 표준 구조 템플릿입니다.</p>
            </div>
            <div className="bg-background border border-border p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <Check className="text-accent mb-6" size={32} />
              <h3 className="font-serif text-2xl md:text-3xl font-extrabold text-primary mb-3 leading-snug break-keep">채널 전략 가이드</h3>
              <p className="text-foreground/80 text-base md:text-lg leading-relaxed break-keep font-medium">5060 경력자 최적화 1순위 미디어 실행 전략입니다.</p>
            </div>
            <div className="bg-background border border-border p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <MessageSquare className="text-accent mb-6" size={32} />
              <h3 className="font-serif text-2xl md:text-3xl font-extrabold text-primary mb-3 leading-snug break-keep">소개 멘트</h3>
              <p className="text-foreground/80 text-base md:text-lg leading-relaxed break-keep font-medium">다양한 자리에서 사용할 30초, 60초, 90초 자기소개 스크립트입니다.</p>
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
                <li className="flex items-start gap-2">
                  <Check size={14} className="text-accent shrink-0 mt-0.5" />
                  <span>핵심 메시지(원라이너) 1문장 <span className="text-foreground/50 block text-[10px] mt-0.5">(코치 확정 전달, 명함·소개 즉시 사용)</span></span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={14} className="text-accent shrink-0 mt-0.5" />
                  <span>강점 명제문 <span className="text-foreground/50 block text-[10px] mt-0.5">(간략 확정)</span></span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={14} className="text-accent shrink-0 mt-0.5" />
                  <span>나머지 브랜드 요소 6종 미리보기 <span className="text-foreground/50 block text-[10px] mt-0.5">("당신의 경우 이렇게 펼쳐집니다": 핵심 가치 · 타깃 페르소나 · 브랜드 스토리 · 핵심 카피 · 채널 전략 · 브랜드 WHY)</span></span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={14} className="text-accent shrink-0 mt-0.5" />
                  <span>경력 자산 진단 리포트 (A4 3~5장)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={14} className="text-accent shrink-0 mt-0.5" />
                  <span>자산화 로드맵 1장</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={14} className="text-accent shrink-0 mt-0.5" />
                  <span>30분 해석 미팅</span>
                </li>
              </ul>
              <Link to="/apply/diagnosis" className="w-full py-3.5 rounded-xl font-bold bg-accent text-white hover:bg-accent/90 transition-colors shadow-lg text-center text-sm">한끗 진단 신청하기</Link>
            </div>

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
              <ul className="space-y-2.5 mb-8 flex-grow text-xs text-foreground/80 font-medium">
                <li className="font-bold text-primary text-[11px] mt-1 tracking-wider">〈기획 자산〉</li>
                <li className="flex items-start gap-2 pl-1">
                  <Check size={14} className="text-accent shrink-0 mt-0.5" />
                  <span>브랜드 전략 브리프 <span className="text-foreground/50 block text-[10px] mt-0.5">(방향성·메시지 구조 정리본)</span></span>
                </li>
                <li className="font-bold text-primary text-[11px] mt-3 tracking-wider">〈브랜드 언어 자산〉</li>
                <li className="flex items-start gap-2 pl-1">
                  <Check size={14} className="text-accent shrink-0 mt-0.5" />
                  <span>확정 핵심 메시지(원라이너) · 브랜드 매니페스토 · 핵심 카피 3종</span>
                </li>
                <li className="font-bold text-primary text-[11px] mt-3 tracking-wider">〈실전 도구〉</li>
                <li className="flex items-start gap-2 pl-1">
                  <Check size={14} className="text-accent shrink-0 mt-0.5" />
                  <span>전문가 프로필 1페이지</span>
                </li>
                <li className="flex items-start gap-2 pl-1">
                  <Check size={14} className="text-accent shrink-0 mt-0.5" />
                  <span>대표 강의안 (60분)</span>
                </li>
                <li className="flex items-start gap-2 pl-1">
                  <Check size={14} className="text-accent shrink-0 mt-0.5" />
                  <span>B2B 제안서 템플릿</span>
                </li>
                <li className="flex items-start gap-2 pl-1">
                  <Check size={14} className="text-accent shrink-0 mt-0.5" />
                  <span>채널 전략 가이드</span>
                </li>
                <li className="flex items-start gap-2 pl-1">
                  <Check size={14} className="text-accent shrink-0 mt-0.5" />
                  <span>소개 멘트 3종</span>
                </li>
              </ul>
              <Link to="/apply/build" className="w-full py-3.5 rounded-xl font-bold border border-border text-primary hover:border-primary transition-colors text-center text-sm">한끗 빌드 신청하기</Link>
            </div>

            <div className="bg-background border border-border p-6 md:p-8 rounded-3xl shadow-sm flex flex-col">
              <h3 className="text-xs font-bold text-primary mb-2 tracking-widest uppercase">STEP 3</h3>
              <p className="text-primary font-serif text-3xl md:text-4xl font-extrabold mb-2">한끗 론칭</p>
              <p className="text-foreground/70 text-xs mb-4 break-keep">실제 무대와 수익 기회에 접근하도록 지원합니다</p>
              <div className="mb-4 flex items-baseline gap-1">
                <span className="text-2xl md:text-3xl font-serif font-bold text-black tracking-tight">별도 문의</span>
              </div>
              <p className="text-xs text-foreground/70 mb-5">3개월 과정</p>
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

            <div className="bg-background border border-border p-6 md:p-8 rounded-3xl shadow-sm flex flex-col">
              <h3 className="text-xs font-bold text-muted-foreground mb-2 tracking-widest uppercase">후속 리테이너</h3>
              <p className="text-primary font-serif text-3xl md:text-4xl font-extrabold mb-2">한끗 파트너</p>
              <p className="text-foreground/70 text-xs mb-4 break-keep">매월 점검하고, 다음 기회를 설계합니다</p>
              <div className="mb-4 flex items-baseline gap-1">
                <span className="text-2xl md:text-3xl font-serif font-bold text-black tracking-tight">별도 문의</span>
              </div>
              <p className="text-xs text-foreground/70 mb-5">월 단위 리테이너</p>
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
            30년의 경험, 이제 꺼내 보여줄 때입니다.
          </h2>
          <p className="text-lg md:text-xl text-primary-foreground/80 mb-10 max-w-3xl mx-auto leading-relaxed break-keep">
            무료 진단 7문항, 약 10분이면 충분합니다.
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
