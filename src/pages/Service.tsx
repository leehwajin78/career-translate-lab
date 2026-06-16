import CTAButton from "@/components/site/CTAButton";
import { NumberedLabel } from "@/components/site/Editorial";
import { Check, Sparkles, ArrowRight, Download, X, Clock, Monitor, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";

export default function Service() {
  return (
    <>
      {/* SECTION 1: HERO */}
      <section className="bg-white">
        <div className="container-prose pt-20 md:pt-28 pb-16 md:pb-24 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-bold mb-6 border border-accent/20">
            <Sparkles size={16} />
            <span>1:1 맞춤 6주 과정</span>
          </div>
          <h1 className="font-serif text-fluid-hero leading-[1.15] text-primary tracking-tight break-keep">
            한끗프로젝트가 뭔가요?
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-foreground/80 leading-relaxed font-medium break-keep">
            20~30년 경력 전문가의 경험을, 시장이 이해하는 언어로 옮겨<br />
            강의안·제안서·프로필로 만드는 1:1 맞춤 프로그램입니다.
          </p>
          <div className="mt-8 bg-primary text-white p-6 rounded-2xl max-w-2xl mx-auto text-center">
            <p className="text-base md:text-lg font-medium leading-relaxed">
              경력은 사라지는 것이 아니라, 번역되어야 살아남습니다.<br />
              30년의 경험은 그 자체로 충분합니다. 다만 시장이 알아보려면,<br />
              시장의 언어로 옮기는 작업이 필요합니다.
            </p>
          </div>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center flex-wrap">
            <CTAButton to="/diagnosis" variant="primary" className="w-full sm:w-auto justify-center">경력 가치 무료 진단받기 →</CTAButton>
            <CTAButton to="/consultation" variant="ghost" className="w-full sm:w-auto justify-center">30분 무료 상담 신청하기</CTAButton>
            <a
              href="https://drive.google.com/file/d/1871MRxG1L2_ft-xe_z5vCmpFdQm24sv1/view?usp=drive_link"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-7 py-3.5 text-sm md:text-base rounded-full border border-primary/10 bg-primary/5 text-primary hover:bg-primary/10 transition-all font-medium"
            >
              <Download size={16} />
              프로그램 상세 안내서 다운로드
            </a>
          </div>
        </div>
      </section>

      {/* SECTION 2: 누구를 위한 프로그램인가 */}
      <section className="py-24 bg-secondary/40">
        <div className="container-prose">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl text-primary leading-snug">
              누구를 위한 프로그램인가요?
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-background border border-border p-8 rounded-2xl shadow-sm">
              <h3 className="font-extrabold text-accent text-lg mb-6">이런 분을 위한 프로그램입니다</h3>
              <ul className="space-y-4">
                {[
                  "20~30년 실무 경력의 전문가·임원·대표·컨설턴트",
                  "강의·자문·컨설팅으로 자기 이름의 활동을 시작하려는 분",
                  "경력은 충분하지만 정리·표현 방법을 모르는 분",
                  "퇴직을 앞두었거나 막 퇴직하신 분",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center shrink-0 mt-0.5">
                      <Check size={12} className="text-white" strokeWidth={3} />
                    </div>
                    <span className="text-foreground leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-muted/50 border border-border p-8 rounded-2xl shadow-sm">
              <h3 className="font-extrabold text-muted-foreground text-lg mb-6">이런 분께는 맞지 않습니다</h3>
              <ul className="space-y-5">
                {[
                  { title: "재취업을 원하시는 경우", sub: "재취업 지원 기관이 더 적합합니다." },
                  { title: "자서전·회고록을 원하시는 경우", sub: "출판 전문 서비스가 더 적합합니다." },
                  { title: "경력이 아직 충분하지 않은 경우", sub: "번역할 원본이 충분해야 합니다." },
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-muted-foreground/20 flex items-center justify-center shrink-0 mt-0.5">
                      <X size={12} className="text-muted-foreground" strokeWidth={3} />
                    </div>
                    <div>
                      <p className="font-bold text-muted-foreground leading-snug">{item.title}</p>
                      <p className="text-sm text-muted-foreground/70 mt-1">{item.sub}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: 무엇이 다른가 */}
      <section className="py-24 md:py-32">
        <div className="container-prose">
          <div className="text-center mb-16">
            <NumberedLabel number="01">왜 한끗인가</NumberedLabel>
            <h2 className="font-serif text-3xl md:text-4xl text-primary leading-snug mt-4 mb-6">
              가르치지도, 디자인하지도 않습니다.
            </h2>
            <p className="text-foreground/70 text-lg max-w-4xl mx-auto">
              이미 충분한 경력을 가진 분이 그 경력을 '시장에서 바로 쓰는 자산'으로 만드는 데 집중합니다.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="bg-background border border-border p-6 md:p-8 rounded-2xl shadow-sm flex flex-col">
              <h3 className="text-2xl font-extrabold text-foreground mb-6 tracking-tight break-keep">강사 양성 과정</h3>
              <hr className="border-border mb-6" />
              <div className="space-y-4 text-base flex-grow">
                {[
                  { l: "대상", v: "강의 경험이 없는 분" },
                  { l: "방법", v: "표준 커리큘럼 교육" },
                  { l: "결과물", v: "수료증" },
                  { l: "활용", v: "강사 풀 등록" },
                ].map((r) => (
                  <div key={r.l} className="grid grid-cols-[60px_1fr] gap-2 items-start">
                    <span className="font-bold text-foreground shrink-0">{r.l}</span>
                    <span className="text-foreground/80 leading-relaxed">{r.v}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8 pt-5 border-t border-border">
                <p className="text-base text-accent font-bold">"한끗은 강의를 가르치지 않습니다."</p>
              </div>
            </div>

            <div className="bg-background border border-border p-6 md:p-8 rounded-2xl shadow-sm flex flex-col">
              <h3 className="text-2xl font-extrabold text-foreground mb-6 tracking-tight break-keep">일반 브랜딩 컨설팅</h3>
              <hr className="border-border mb-6" />
              <div className="space-y-4 text-base flex-grow">
                {[
                  { l: "대상", v: "사업체·창업자" },
                  { l: "방법", v: "시각 디자인 작업" },
                  { l: "결과물", v: "로고·웹사이트" },
                  { l: "활용", v: "사업체 홍보" },
                ].map((r) => (
                  <div key={r.l} className="grid grid-cols-[60px_1fr] gap-2 items-start">
                    <span className="font-bold text-foreground shrink-0">{r.l}</span>
                    <span className="text-foreground/80 leading-relaxed">{r.v}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8 pt-5 border-t border-border">
                <p className="text-base text-accent font-bold">"한끗은 디자인이 아닙니다."</p>
              </div>
            </div>

            <div className="bg-primary text-white p-6 md:p-8 rounded-2xl shadow-xl flex flex-col">
              <h3 className="text-2xl font-extrabold text-white mb-6 tracking-tight break-keep">한끗프로젝트</h3>
              <hr className="border-white/20 mb-6" />
              <div className="space-y-4 text-base flex-grow">
                {[
                  { l: "대상", v: "20~30년 경력 전문가" },
                  { l: "방법", v: "1:1로 함께 자산 설계" },
                  { l: "결과물", v: "프로필·강의안·제안서" },
                  { l: "활용", v: "시장에서 바로 활용" },
                ].map((r) => (
                  <div key={r.l} className="grid grid-cols-[60px_1fr] gap-2 items-start">
                    <span className="font-bold text-white shrink-0">{r.l}</span>
                    <span className="text-white/90 leading-relaxed">{r.v}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8 pt-5 border-t border-white/20">
                <p className="text-base text-white/90 font-bold">"한끗은 경력을 시장 언어로 번역합니다."</p>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-primary text-white p-6 rounded-2xl max-w-5xl mx-auto text-center">
            <p className="text-base md:text-lg font-medium leading-relaxed">
              한끗은 가르치지 않습니다. 이미 가진 경력을 콘텐츠로 만들고,<br />
              시장에서 통하는 강의안과 제안서를 만듭니다.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 4: 방법론 3단계 */}
      <section className="py-24 bg-secondary/40">
        <div className="container-prose">
          <div className="text-center mb-16">
            <NumberedLabel number="02">방법론</NumberedLabel>
            <h2 className="font-serif text-3xl md:text-4xl text-primary leading-snug mt-4 mb-6">
              골라내고, 옮기고, 자산으로 만듭니다.
            </h2>
            <p className="text-foreground/70 text-lg max-w-4xl mx-auto">
              이화진 대표가 20여 년의 강의·코칭 경험에서 정리한 3단계 원리로 진행됩니다.
            </p>
          </div>

          <div className="space-y-6 max-w-4xl mx-auto">
            {[
              {
                n: "01", title: "골라내기",
                sub: "경력에서 시장이 원할 핵심을 골라냅니다.",
                desc: "수백 가지 경험이 모두 자산은 아닙니다. 본인에게 당연한 것이 시장에서는 귀한 가치일 수 있어, 옆에서 함께 봐주는 사람이 필요합니다.",
              },
              {
                n: "02", title: "옮기기",
                sub: "전문가의 언어를 고객의 언어로.",
                desc: "'30년 차 임원'이 아니라 '어떤 문제를 어떻게 해결하는 사람'으로. 이 결과가 프로필 한 문장, 강의 제목, 제안서 첫 페이지가 됩니다.",
              },
              {
                n: "03", title: "자산 만들기",
                sub: "한 번 만들면 계속 쓰는 형태로.",
                desc: "강의안은 고쳐 쓰는 형태로, 제안서는 바꿔 쓰는 틀로, 프로필은 변형 가능한 한 장으로. 매번 처음부터 만들지 않도록 설계합니다.",
              },
            ].map((s) => (
              <div key={s.n} className="bg-card border border-border rounded-3xl p-8 md:p-10 shadow-sm hover:shadow-md transition-shadow">
                <div className="grid md:grid-cols-[100px_1fr] gap-6 items-start">
                  <span className="font-serif text-6xl md:text-7xl text-accent/30 font-bold leading-none">{s.n}</span>
                  <div>
                    <h3 className="font-serif text-3xl md:text-4xl font-extrabold text-primary mb-2">{s.title}</h3>
                    <p className="text-accent font-extrabold text-lg md:text-xl mb-4 leading-normal">{s.sub}</p>
                    <p className="text-base md:text-lg text-foreground/90 font-medium leading-relaxed break-keep">{s.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: 6주 커리큘럼 */}
      <section className="py-24 md:py-32">
        <div className="container-prose">
          <div className="text-center mb-12">
            <NumberedLabel number="03">커리큘럼</NumberedLabel>
            <h2 className="font-serif text-3xl md:text-4xl text-primary leading-snug mt-4 mb-4">
              6주, 주 1회 90분으로 자산을 완성합니다.
            </h2>
            <p className="text-foreground/70 text-lg max-w-4xl mx-auto">
              이화진 대표가 처음부터 끝까지 직접 1:1로 진행합니다. 대면·화상 중 편한 방식을 선택합니다.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto mb-10">
            {[
              { v: "6주", l: "전체 기간" },
              { v: "주 1회", l: "약 90분 만남" },
              { v: "대면·화상", l: "편한 방식 선택" },
              { v: "1:1", l: "대표 직접 진행" },
            ].map((s) => (
              <div key={s.v} className="bg-primary text-white rounded-xl p-4 text-center">
                <div className="text-xl font-extrabold">{s.v}</div>
                <div className="text-xs text-white/70 mt-1">{s.l}</div>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {[
              { w: "1주", t: "경력 듣기", d: "30년 경험을 편안한 대화로 펼쳐 봅니다. 준비물 없이 오시면 됩니다." },
              { w: "2주", t: "핵심 골라내기", d: "시장에서 가장 가치 있을 핵심을 함께 골라냅니다." },
              { w: "3주", t: "한 문장 만들기", d: "당신을 설명하는 한 문장과 강의 제목을 만듭니다." },
              { w: "4주", t: "강의안 설계", d: "대표 강의안의 뼈대를 함께 세웁니다." },
              { w: "5주", t: "완성 + 제안서", d: "강의안 완성, B2B 제안서 템플릿을 만듭니다." },
              { w: "6주", t: "마무리 + 계획", d: "프로필 완성, 채널 전략과 다음 계획을 세웁니다." },
            ].map((s) => (
              <div key={s.w} className="bg-background border border-border p-6 rounded-2xl shadow-sm">
                <p className="text-xs font-bold text-accent tracking-widest mb-2">{s.w}</p>
                <h3 className="font-extrabold text-primary text-lg mb-2">{s.t}</h3>
                <p className="text-sm text-foreground/70 leading-relaxed">{s.d}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 bg-secondary/60 rounded-xl p-4 max-w-4xl mx-auto text-center">
            <p className="text-sm text-accent font-medium">
              매주 가벼운 준비 사항을 안내 — 부담스러운 숙제가 아닌 짧은 메모 수준. 한 주를 놓쳐도 일정은 함께 조율합니다.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 6: 준비물 */}
      <section className="py-24 bg-secondary/40">
        <div className="container-prose">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl text-primary leading-snug mb-4">
              준비물은 '기억'과 '시간'뿐입니다.
            </h2>
            <p className="text-foreground/70 text-lg max-w-4xl mx-auto">
              정리된 자료도, PPT 기술도, 거창한 계획도 필요 없습니다. 막연한 상태로 오셔도 됩니다.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-background border border-border p-8 rounded-2xl shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center shrink-0">
                  <Sparkles size={16} className="text-white" />
                </div>
                <h3 className="font-extrabold text-accent text-lg">꼭 필요한 것</h3>
              </div>
              <ul className="space-y-4 text-foreground/80">
                <li className="leading-relaxed">
                  지나온 경력에 대한 기억<br />
                  <span className="text-sm text-muted-foreground">(정리된 자료가 아니어도 됩니다.)</span>
                </li>
                <li className="leading-relaxed">
                  6주간 주 1회, 90분의 시간<br />
                  <span className="text-sm text-muted-foreground">(편한 시간으로 맞춥니다.)</span>
                </li>
              </ul>
            </div>

            <div className="bg-background border border-border p-8 rounded-2xl shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                  <ArrowRight size={16} className="text-accent" />
                </div>
                <h3 className="font-extrabold text-primary text-lg">있으면 도움 되는 것</h3>
              </div>
              <ul className="space-y-4 text-foreground/80">
                <li className="leading-relaxed">기존 이력서나 경력 기술서 (있으면 참고)</li>
                <li className="leading-relaxed">예전에 만든 발표·강의 자료 (있으면 활용)</li>
                <li className="text-sm text-muted-foreground mt-2">※ 없어도 전혀 문제 없습니다</li>
              </ul>
            </div>

            <div className="bg-muted/50 border border-border p-8 rounded-2xl shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-full bg-muted-foreground/20 flex items-center justify-center shrink-0">
                  <X size={16} className="text-muted-foreground" />
                </div>
                <h3 className="font-extrabold text-muted-foreground text-lg">준비 안 해도 되는 것</h3>
              </div>
              <ul className="space-y-3 text-muted-foreground/80 text-sm">
                <li>PPT 만드는 기술 — 자료는 함께 만듭니다</li>
                <li>컴퓨터 능숙함 — 그 부분이 한끗이 돕는 일</li>
                <li>거창한 계획 — 방향은 1주 차에 함께 잡습니다</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 bg-primary text-white p-6 rounded-2xl max-w-4xl mx-auto text-center">
            <p className="text-base md:text-lg font-medium leading-relaxed">
              "특강 요청이 와도 자료가 없어서 거절했다"는 분들이 많습니다.<br />
              머릿속엔 다 있는데 꺼낼 도구가 없을 뿐 — 그 도구를 함께 만드는 것이 한끗입니다.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 7: 산출물 6가지 */}
      <section id="deliverables" className="py-24 md:py-32">
        <div className="container-prose">
          <div className="text-center mb-16">
            <NumberedLabel number="04">산출물</NumberedLabel>
            <h2 className="font-serif text-3xl md:text-4xl text-primary leading-snug mt-4 mb-6">
              직접 고쳐 쓰는 6가지 원본 자산.
            </h2>
            <p className="text-foreground/70 text-lg max-w-4xl mx-auto">
              모두 PPT·워드·PDF 원본으로, 인터넷 폴더로 전달되며 활동에 제한 없이 사용할 수 있습니다.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { n: "01", title: "한 줄 포지셔닝", desc: "당신을 한 문장으로 설명하는 핵심 메시지", tag: "명함 · 자기소개 · 강의 제목" },
              { n: "02", title: "전문가 프로필 1페이지", desc: "경력과 전문성을 정리한 A4 한 장", tag: "강의 제안 · 자문 소개 · 강사풀" },
              { n: "03", title: "대표 강의안 (60분)", desc: "발표 자료 + 말할 내용 + 진행 노트", tag: "첫 강의에서 바로 사용" },
              { n: "04", title: "B2B 제안서 템플릿", desc: "기업·기관에 보낼 수 있는 제안서 틀", tag: "자문 · 강의 수주 제안" },
              { n: "05", title: "채널 전략 가이드", desc: "어디서 어떻게 활동을 시작할지 길잡이", tag: "블로그 · SNS · 네트워크" },
              { n: "06", title: "소개 멘트 3종", desc: "30·60·90초 자기소개 스크립트", tag: "모임 · 강의 후 인사 · 발표" },
            ].map((d) => (
              <div key={d.n} className="bg-background border border-border p-6 md:p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-serif text-xl font-extrabold text-primary">{d.title}</h3>
                  <span className="text-2xl font-extrabold text-accent/20 leading-none shrink-0 ml-2">{d.n}</span>
                </div>
                <p className="text-foreground/80 leading-relaxed mb-4 text-sm md:text-base">{d.desc}</p>
                <div className="bg-secondary px-3 py-1.5 rounded-lg text-xs text-accent font-semibold inline-block">{d.tag}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 8: 신뢰 — 이화진 대표 */}
      <section className="py-24 bg-secondary/40">
        <div className="container-prose">
          <div className="text-center mb-12">
            <NumberedLabel number="05">신뢰</NumberedLabel>
            <h2 className="font-serif text-3xl md:text-4xl text-primary leading-snug mt-4 mb-4">
              강사 · 리더 · 멘토 · 저자,<br />네 시선이 함께 작동합니다.
            </h2>
            <p className="text-foreground/70 text-lg max-w-4xl mx-auto">
              모든 과정을 꿈몰다 이화진 대표가 직접 1:1로 진행합니다. 여러 강사가 돌아가며 맡지 않습니다.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 max-w-5xl mx-auto items-stretch">
            <div className="bg-primary text-white p-8 md:p-10 rounded-2xl flex flex-col justify-between">
              <div>
                <div className="text-5xl text-white/20 font-serif leading-none mb-4">"</div>
                <p className="text-lg md:text-xl font-medium leading-relaxed">
                  당신이 당신다운 꿈을 찾을 때까지,<br />당신 꿈의 서포터가 되겠습니다.
                </p>
              </div>
              <div className="mt-8 pt-6 border-t border-white/20">
                <p className="font-extrabold text-white">이화진</p>
                <p className="text-sm text-white/60 mt-1">꿈몰다 대표</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { role: "강사", years: "23년", desc: "2003년부터\n프레젠테이션 강의" },
                { role: "리더", years: "17년", desc: "2009년부터\n꿈몰다 브랜드 운영" },
                { role: "멘토", years: "17년", desc: "2009년부터\n진로, 취·창업 코칭" },
                { role: "저자", years: "17년", desc: "2009년부터\n오피스 분야 책 집필" },
              ].map((s) => (
                <div key={s.role} className="bg-background border border-border p-5 rounded-2xl shadow-sm">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-bold text-foreground">{s.role}</span>
                    <span className="text-2xl font-extrabold text-accent">{s.years}</span>
                  </div>
                  <div className="pt-3 border-t border-border text-xs text-muted-foreground leading-relaxed whitespace-pre-line">{s.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 9: 단계별 상품 */}
      <section className="py-24 md:py-32 bg-primary text-white">
        <div className="container-prose">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl leading-snug mb-4">
              한 번에 큰 결정을 요구하지 않습니다.
            </h2>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              진단부터 시작하면 방향이 분명해집니다. 필요한 만큼 단계별로 진행할 수 있습니다.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {[
              { step: "STEP 1", name: "한끗 진단", price: "50만원", period: "· 1주", desc: "내 경력의 시장 가치를 진단합니다", highlight: true },
              { step: "STEP 2", name: "한끗 빌드", price: "350만원", period: "· 6주", desc: "프로필·강의안·제안서를 완성합니다", highlight: false },
              { step: "STEP 3", name: "한끗 론칭", price: "별도 문의", period: "· 3개월", desc: "빌드 + 강의 리허설·제안처 연결까지", highlight: false },
              { step: "후속", name: "한끗 파트너", price: "별도 문의", period: "· 월 단위", desc: "지속 코칭과 새 기회 연결", highlight: false },
            ].map((p) => (
              <div key={p.name} className={`p-6 rounded-2xl ${p.highlight ? "bg-white" : "bg-white/10 border border-white/20"}`}>
                <p className={`text-xs font-bold tracking-widest mb-2 ${p.highlight ? "text-accent" : "text-white/50"}`}>{p.step}</p>
                <h3 className={`text-lg font-extrabold mb-2 ${p.highlight ? "text-primary" : "text-white"}`}>{p.name}</h3>
                <p className={`text-lg font-extrabold mb-1 ${p.highlight ? "text-primary" : "text-white"}`}>
                  {p.price} <span className={`text-sm font-normal ${p.highlight ? "text-muted-foreground" : "text-white/60"}`}>{p.period}</span>
                </p>
                <p className={`text-sm leading-relaxed ${p.highlight ? "text-foreground" : "text-white/70"}`}>{p.desc}</p>
              </div>
            ))}
          </div>

          <p className="text-center text-sm text-white/40 mt-6 max-w-3xl mx-auto">
            한끗 파트너는 동시 진행 5~8명으로 정원 제한 — 한 분 한 분을 깊이 동행하기 위함이며, 정원이 차면 대기 후 합류합니다.
          </p>

          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <a
              href="https://drive.google.com/file/d/1871MRxG1L2_ft-xe_z5vCmpFdQm24sv1/view?usp=drive_link"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-primary px-6 py-3 rounded-full font-bold text-sm hover:bg-white/90 transition-all shadow"
            >
              <Download size={14} />
              프로그램 상세 안내서 다운로드
            </a>
          </div>
        </div>
      </section>

      {/* SECTION 10: 시작하기 + FAQ */}
      <section className="py-24">
        <div className="container-prose">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl text-primary leading-snug mb-4">
              가장 가벼운 무료 진단부터 시작하세요.
            </h2>
            <p className="text-foreground/70 text-lg max-w-4xl mx-auto">
              처음부터 큰 결정을 하실 필요 없습니다. 세 가지 시작 방법은 자연스럽게 이어집니다.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-6">
            <div className="bg-background border border-border p-8 rounded-2xl shadow-sm flex flex-col">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center mb-6">
                <Monitor size={20} className="text-accent" />
              </div>
              <h3 className="font-extrabold text-accent text-lg mb-1">무료 진단</h3>
              <p className="text-sm font-bold text-accent mb-3">무료 <span className="font-normal text-muted-foreground">· 5~10분</span></p>
              <p className="text-foreground/70 text-sm leading-relaxed mb-6 flex-grow">결과지로 먼저 확인해보고 싶은 분</p>
              <Link to="/diagnosis" className="w-full py-3 rounded-xl font-bold bg-accent text-white text-center text-sm hover:bg-accent/90 transition-colors">무료 진단 시작하기</Link>
            </div>
            <div className="bg-background border border-border p-8 rounded-2xl shadow-sm flex flex-col">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center mb-6">
                <MessageSquare size={20} className="text-accent" />
              </div>
              <h3 className="font-extrabold text-accent text-lg mb-1">무료 상담</h3>
              <p className="text-sm font-bold text-accent mb-3">무료 <span className="font-normal text-muted-foreground">· 30분</span></p>
              <p className="text-foreground/70 text-sm leading-relaxed mb-6 flex-grow">직접 이야기하며 방향을 잡고 싶은 분</p>
              <Link to="/consultation" className="w-full py-3 rounded-xl font-bold bg-primary text-white text-center text-sm hover:bg-primary/90 transition-colors">무료 상담 신청하기</Link>
            </div>
            <div className="bg-primary text-white p-8 rounded-2xl shadow-xl flex flex-col">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mb-6">
                <Clock size={20} className="text-white" />
              </div>
              <h3 className="font-extrabold text-white text-lg mb-1">한끗 진단</h3>
              <p className="text-sm font-bold text-white mb-3">50만원 <span className="font-normal text-white/60">· 1주</span></p>
              <p className="text-white/80 text-sm leading-relaxed mb-6 flex-grow">진지하게 시작할 준비가 된 분</p>
              <Link to="/apply/diagnosis" className="w-full py-3 rounded-xl font-bold bg-white text-primary text-center text-sm hover:bg-white/90 transition-colors">한끗 진단 신청하기</Link>
            </div>
          </div>

          <div className="bg-secondary/60 rounded-xl p-4 max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-2 text-sm mb-16">
            <span className="font-bold text-accent">무료 진단</span>
            <ArrowRight size={14} className="text-muted-foreground" />
            <span className="text-muted-foreground text-xs">(결과지 함께 보기)</span>
            <ArrowRight size={14} className="text-muted-foreground" />
            <span className="font-bold text-accent">무료 상담</span>
            <ArrowRight size={14} className="text-muted-foreground" />
            <span className="text-muted-foreground text-xs">(유료 진단 시작)</span>
            <ArrowRight size={14} className="text-muted-foreground" />
            <span className="font-bold text-accent">한끗 진단</span>
            <ArrowRight size={14} className="text-muted-foreground" />
            <span className="font-bold text-accent">한끗 빌드</span>
          </div>

          <div className="text-center mb-10">
            <h2 className="font-serif text-3xl md:text-4xl text-primary leading-snug mb-4">
              시작 전, 가장 많이 묻는 것들.
            </h2>
            <p className="text-foreground/70 text-lg">일정·진행 방식·결과 보장까지, 솔직하게 답해 드립니다.</p>
          </div>
          <div className="max-w-2xl mx-auto space-y-3">
            {[
              { q: "컴퓨터를 잘 못 다뤄도 되나요?", a: "괜찮습니다. 자료는 함께 만들고, 바로 그 부분이 한끗이 돕는 일입니다." },
              { q: "뭘 하고 싶은지 명확하지 않아도 되나요?", a: "오히려 그런 분들을 위한 프로그램입니다. 1주 차에 방향부터 잡습니다." },
              { q: "매주 시간을 얼마나 내야 하나요?", a: "주 1회 약 90분. 평일 야간·주말도 조율 가능합니다." },
              { q: "대면인가요, 화상인가요?", a: "편하신 방식을 선택하시면 됩니다. 화상이 익숙지 않아도 어려움 없이 도와드립니다." },
              { q: "퇴직 전인데 받을 수 있나요?", a: "가능합니다. 퇴직 6개월~1년 전 시작이 가장 좋습니다." },
              { q: "중간에 일정을 못 맞추면 어떻게 되나요?", a: "괜찮습니다. 1:1이라 일정은 유연하게 조율합니다." },
              { q: "만든 자료는 어디에 쓸 수 있나요?", a: "강의·자문·컨설팅·강사풀 등록·출간 제안·SNS 등 다양하게 활용하실 수 있습니다." },
              { q: "결과가 보장되나요?", a: "자료는 6주 안에 반드시 완성됩니다. 시장 반응은 경력·실행에 따라 다릅니다." },
            ].map((item, idx) => (
              <details key={idx} className="border border-border rounded-xl overflow-hidden">
                <summary className="p-5 cursor-pointer font-bold text-primary text-base hover:bg-secondary/40 transition-colors list-none flex justify-between items-center [&::-webkit-details-marker]:hidden">
                  {item.q}
                  <span className="text-primary font-bold text-lg ml-4 shrink-0">+</span>
                </summary>
                <div className="px-5 pb-5 text-foreground/80 leading-relaxed text-sm border-t border-border pt-4">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-12 md:py-16 bg-primary text-primary-foreground text-center">
        <div className="container-prose">
          <h2 className="font-serif text-2xl md:text-3xl leading-snug mb-4 max-w-3xl mx-auto">
            내 경력이 어떤 자산이 될 수 있을지,<br />부담 없이 확인해 보세요.
          </h2>
          <p className="text-sm md:text-base text-primary-foreground/80 mb-8 max-w-3xl mx-auto leading-relaxed break-keep">
            지금 결정하지 않으셔도 됩니다. 다만 6개월·1년 후 "그때 시작했어야 했는데"가 가장 큰 아쉬움일 것입니다.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link to="/diagnosis" className="w-full sm:w-auto bg-transparent text-white border-2 border-white px-8 py-3.5 rounded-full font-bold text-base hover:bg-white/10 transition-all">
              경력 가치 무료 진단받기
            </Link>
            <Link to="/consultation" className="w-full sm:w-auto bg-white text-primary px-8 py-3.5 rounded-full font-bold text-base hover:bg-white/90 transition-all">
              30분 무료 상담 신청하기
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
