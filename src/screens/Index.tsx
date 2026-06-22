'use client';

import Link from "next/link";
import { Clock, User, Briefcase, Monitor, Users, FolderOpen } from "lucide-react";

const card = "bg-white border border-border rounded-xl p-5 md:p-6";
const eyebrow = "text-xs font-bold tracking-widest text-primary uppercase";
const note = "text-sm text-muted-foreground leading-relaxed";
const btnPrimary = "inline-flex items-center justify-center gap-2 bg-primary text-white font-bold px-6 py-3 rounded-full text-sm md:text-base hover:bg-primary/90 transition-colors";
const btnGhost = "inline-flex items-center justify-center gap-2 border border-border text-primary font-bold px-6 py-3 rounded-full text-sm md:text-base hover:border-primary hover:bg-primary/5 transition-colors bg-transparent";

export default function Index() {
  return (
    <>
      {/* ① Hero — 흰 배경 */}
      <div className="bg-white">
        <div className="container-prose py-20 md:py-24 text-center">
          <div className="inline-block border border-primary rounded-full px-4 py-1.5 text-xs font-bold text-primary mb-4">
            5060 경력 자산화 서비스
          </div>
          <h1 className="font-serif leading-[1.2] text-primary tracking-tight break-keep" style={{ fontSize: "clamp(2rem, 4vw + 0.8rem, 3.875rem)" }}>
            30년을 일했는데,<br />나를 소개하는 한 문장이 없습니다
          </h1>
          <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-foreground/80 leading-relaxed font-medium break-keep">
            30년 경력은 충분합니다. 부족한 건 시장이 알아보는 형태로 정리한 자료입니다.<br />
            한끗프로젝트가 당신의 경력을 시장이 선택하는 자산으로 만들어 드립니다.
          </p>
          <div className="mt-7 flex gap-3 justify-center flex-wrap">
            <Link href="/diagnosis" className={btnPrimary}>경력 가치 무료 진단받기 →</Link>
            <Link href="/consultation" className={btnGhost}>30분 무료 상담 신청하기</Link>
          </div>
          <div className="mt-6 flex items-center justify-center gap-8 flex-wrap">
            {[
              { Icon: Clock, value: "1주", label: "경력 자산 진단" },
              { Icon: User, value: "6주", label: "핵심 자산 완성" },
              { Icon: Briefcase, value: "3개월", label: "론칭 지원" },
            ].map(({ Icon, value, label }, i, arr) => (
              <div key={value} className="flex items-center gap-6">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 bg-[#E8ECFB] rounded-full flex items-center justify-center shrink-0">
                    <Icon size={18} className="text-primary" strokeWidth={1.8} />
                  </div>
                  <div className="text-left">
                    <div className="text-lg font-extrabold text-primary leading-none">{value}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
                  </div>
                </div>
                {i < arr.length - 1 && <span className="text-border text-lg select-none hidden sm:inline">·</span>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ① 가치 제안 — 연한 회색 배경 */}
      <div className="bg-[#FAFBFD]">
        <div className="container-prose py-16 text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight break-keep text-primary">경력은 충분합니다. 부족한 건 번역입니다.</h2>
          <p className={`mt-2 ${note}`}>노하우는 머릿속에 있고, 시장은 문서를 요구합니다.</p>
          <div className="mt-6 grid grid-cols-[1fr_auto_1fr] gap-6 md:gap-10 items-center">
            <div className="bg-white border-2 border-primary rounded-2xl p-6 md:p-8 text-left">
              <div className="font-extrabold text-primary text-lg mb-4">당신의 30년 경력</div>
              <ul className="space-y-2.5 text-primary text-base font-medium">
                <li>• 분야별 전문성</li>
                <li>• 현장에서 쌓은 노하우</li>
                <li>• 실패와 성공의 흔적</li>
              </ul>
            </div>
            <div className="flex flex-col items-center gap-4">
              <span className="text-2xl font-bold text-primary">→</span>
              <div className="bg-primary text-white font-extrabold text-base md:text-lg px-10 py-4 rounded-2xl whitespace-nowrap">한끗프로젝트</div>
              <span className="text-2xl font-bold text-primary">→</span>
            </div>
            <div className="bg-primary rounded-2xl p-6 md:p-8 text-left">
              <div className="font-extrabold text-white text-lg mb-4">시장이 선택하는 자산</div>
              <ul className="space-y-2.5 text-white/90 text-base font-medium">
                <li>• 전문가 강의안</li>
                <li>• 대표 경력서</li>
                <li>• B2B 제안서</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* ② #1 시간 대비 성과 — 연한 파랑 배경 */}
      <div className="bg-[#EEF3FC]">
        <div className="container-prose py-16">
          <div className="text-center">
            <div className={eyebrow}>#1 — 시간 대비 성과</div>
            <h2 className="text-2xl md:text-3xl font-extrabold mt-2 tracking-tight break-keep text-primary">혼자 하면 6개월, 한끗과 함께하면 6주</h2>
            <p className={`mt-1 ${note}`}>막막한 자료 정리부터 강의안, 제안서까지 빠르게 완성합니다.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className={card}>
              <span className="inline-block bg-gray-100 text-gray-500 text-xs font-bold px-3 py-1 rounded-full mb-3">혼자 하면</span>
              <strong className="block text-base font-extrabold mb-1">6개월+</strong>
              <p className={note}>자료 조사와 작성 사이를 오가다 멈춥니다. 완성보다 시작이 반복됩니다.</p>
            </div>
            <div className="bg-primary border border-primary rounded-xl p-5 md:p-6">
              <span className="inline-block bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full mb-3">한끗과 함께</span>
              <strong className="block text-base font-extrabold text-white mb-1">6주 완성</strong>
              <p className="text-sm text-white/85 leading-relaxed">전문 코치와 함께 프로필, 강의안, 제안서를 손에 쥐고 시장으로 나갑니다.</p>
            </div>
            <div className={card}>
              <span className="inline-block bg-gray-100 text-gray-500 text-xs font-bold px-3 py-1 rounded-full mb-3">시작 못 하면</span>
              <strong className="block text-base font-extrabold mb-1">기회비용</strong>
              <p className={note}>특강 요청이 와도 자료가 없어 거절하는 시간이 계속 쌓입니다.</p>
            </div>
          </div>
        </div>
      </div>

      {/* ③ 차별화 3포인트 — 흰 배경 */}
      <div className="bg-white">
        <div className="container-prose py-20">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight break-keep text-primary">
              경험만 말씀하세요.<br />문서와 구조는 한끗이 완성합니다.
            </h2>
            <p className={`mt-2 ${note}`}>경험과 노하우를 듣고, 시장에서 통하는 자료로 정리해드립니다.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            {[
              { Icon: Monitor, title: "PPT 작업 제로", desc: "슬라이드·문서 제작은 한끗이 합니다. 고객은 경험을 말하기만 하면 됩니다." },
              { Icon: Users, title: "1:1 맞춤 코칭", desc: "경력과 목표에 맞춰 과정 내내 밀착 관리하는 코칭입니다." },
              { Icon: FolderOpen, title: "장기 활용 자산", desc: "명함·제안·강의에 반복 사용하는 문서 자산을 남깁니다." },
            ].map(({ Icon, title, desc }) => (
              <div key={title} className={card}>
                <div className="w-11 h-11 bg-[#E8ECFB] rounded-full flex items-center justify-center mb-3">
                  <Icon size={20} className="text-primary" strokeWidth={1.8} />
                </div>
                <strong className="block text-primary text-base md:text-lg font-extrabold mb-1">{title}</strong>
                <p className={note}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ④ 비교표 — 로열블루 배경 */}
      <div className="bg-primary">
        <div className="container-prose py-16 text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight break-keep">
            그냥 배우는 곳이 아니라,<br />바로 써먹는 결과물을 만드는 곳.
          </h2>
          <p className="mt-2 text-sm text-white/70">PPT, 강의안, 제안서를 실제 사업에 쓸 수 있게 만들어드립니다.</p>
          <div className="mt-6 overflow-hidden rounded-xl border border-white/30">
            <table className="w-full border-collapse text-sm" style={{ tableLayout: "fixed" }}>
              <tbody>
                <tr className="border-b border-white/30">
                  <td className="py-3 px-4 text-center text-white/65 font-medium w-[38%]">일반 브랜딩 학원</td>
                  <td className="py-3 px-4 text-center border-x border-white/30 w-[24%]"></td>
                  <td className="py-3 px-4 text-center text-white font-medium w-[38%]">한끗프로젝트</td>
                </tr>
                {[
                  { label: "방식", left: "단체 강의 수강", right: "1:1 맞춤 설계 · 제작 코칭" },
                  { label: "산출물", left: "수료증 · 과제물", right: "프로필 · 강의안 · 제안서 등 실전 문서 6종" },
                  { label: "제작 주체", left: "고객이 직접 제작", right: "한끗이 제작, 고객은 검수 · 확정" },
                  { label: "이후 연결", left: "없음", right: "무대 · 제안처 탐색 지원(론칭 · 파트너)" },
                ].map(({ label, left, right }) => (
                  <tr key={label} className="border-b border-white/15 last:border-0">
                    <td className="py-3 px-4 text-center text-white/75">{left}</td>
                    <td className="py-3 px-4 text-center text-white/55 text-xs border-x border-white/30">{label}</td>
                    <td className="py-3 px-4 text-center text-white font-medium">{right}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ⑤ #2 진행 과정 — 연한 파랑 배경 */}
      <div id="process" className="bg-[#EEF3FC]">
        <div className="container-prose py-16">
          <div className="text-center">
            <div className={`${eyebrow} inline-flex items-center gap-2`}>
              #2 <span className="inline-block w-8 h-px bg-primary align-middle" /> 진행 과정
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold mt-2 tracking-tight break-keep text-primary">진단부터 론칭까지 단계별로 진행합니다.</h2>
            <p className={`mt-2 ${note} leading-loose`}>
              처음부터 큰 결정을 내릴 필요 없습니다.<br />
              진단으로 방향을 확인하고,<br />
              필요한 단계까지 이어가면 됩니다.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            {[
              { n: "01", title: "경험 인터뷰", desc: "42문항 구조화 인터뷰로 경험을 끝까지 꺼냅니다." },
              { n: "02", title: "브랜드 기획", desc: "핵심 메시지와 포지셔닝 전략을 설계합니다." },
              { n: "03", title: "문서 제작", desc: "프로필·강의안·제안서를 실물로 제작합니다." },
              { n: "04", title: "기회 탐색 지원", desc: "강의·자문 제안처를 함께 발굴합니다." },
            ].map(({ n, title, desc }) => (
              <div key={n} className={card}>
                <div className={eyebrow}>{n}</div>
                <strong className="block text-primary text-base md:text-lg font-extrabold mt-1 mb-1">{title}</strong>
                <p className={note}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ⑥ #3 결과물 6카드 — 흰 배경 */}
      <div className="bg-white">
        <div className="container-prose py-20">
          <div className="text-center">
            <div className={`${eyebrow} inline-flex items-center gap-2`}>
              #3 <span className="inline-block w-8 h-px bg-primary align-middle" /> 완성되는 결과물
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold mt-2 tracking-tight break-keep text-primary">6주 후, 손에 쥐는 자산입니다.</h2>
            <p className={`mt-1 ${note}`}>한끗 빌드 종료 시 완성되는 핵심 산출물입니다.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {[
              { title: "한 줄 포지셔닝", desc: "당신을 한 문장으로 설명하는 핵심 메시지. 명함·SNS 자기소개에 그대로 활용 가능." },
              { title: "전문가 프로필", desc: "고문 계약·강사 등록·파트너십용 1페이지 약력서." },
              { title: "대표 강의안", desc: "기업 특강·세미나에 바로 쓰는 시그니처 슬라이드." },
              { title: "B2B 제안서", desc: "기업·기관에 보낼 수 있는 컨설팅·자문 제안용 표준 구조 템플릿." },
              { title: "채널 전략 가이드", desc: "5060 경력자 최적화 1순위 미디어 실행 전략." },
              { title: "소개 멘트", desc: "다양한 자리에서 사용할 30초, 60초, 90초 자기소개 스크립트." },
            ].map(({ title, desc }) => (
              <div key={title} className={card}>
                <strong className="block text-primary text-base md:text-lg font-extrabold mb-2">{title}</strong>
                <p className={note}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ⑦ #4 단계별 상품 — 연한 파랑 배경 */}
      <div id="packages" className="bg-[#EEF3FC]">
        <div className="container-prose py-16">
          <div className="text-center">
            <div className={`${eyebrow} inline-flex items-center gap-2`}>
              #4 <span className="inline-block w-8 h-px bg-primary align-middle" /> 단계별 상품
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold mt-2 tracking-tight break-keep text-primary">단계별로 시작하세요.</h2>
            <p className={`mt-1 ${note}`}>진단부터 시작해, 필요한 만큼만 진행하시면 됩니다.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            {[
              { step: "STEP01", name: "한끗 진단", price: "50만원", period: "· 1주", desc: "내 경력의 시장 가치를 진단합니다", to: "/apply/diagnosis", cta: "한끗 진단 신청하기", featured: true },
              { step: "STEP02", name: "한끗 빌드", price: "350만원", period: "· 6주", desc: "강의안·프로필·제안서를 완성합니다", to: "/apply/build", cta: "한끗 빌드 신청하기", featured: false },
              { step: "STEP03", name: "한끗 론칭", price: "별도 문의", period: "· 3개월", desc: "실제 무대와 수익 기회에 접근하도록 지원합니다", to: "/apply/launch", cta: "한끗 론칭 신청하기", featured: false },
              { step: "STEP04", name: "한끗 파트너", price: "별도 문의", period: "· 월 단위", desc: "매월 점검하고, 다음 기회를 설계합니다", to: "/apply/partner", cta: "한끗 파트너 신청하기", featured: false },
            ].map(({ step, name, price, period, desc, to, cta, featured }) => (
              <div key={name} className={`bg-white border-2 ${featured ? "border-primary" : "border-border"} rounded-xl p-5 flex flex-col`}>
                <div className={eyebrow}>{step}</div>
                <strong className="block text-primary text-base font-extrabold mt-1">{name}</strong>
                <div className="text-xl font-extrabold mt-2 mb-0.5">
                  {price}<span className="text-sm font-normal text-muted-foreground"> {period}</span>
                </div>
                <p className={`${note} flex-1 mt-1`}>{desc}</p>
                <Link
                  href={to}
                  className={`mt-4 text-center text-sm font-bold py-2.5 px-4 rounded-full transition-colors ${featured ? "bg-primary text-white hover:bg-primary/90" : "border border-border text-primary hover:border-primary hover:bg-primary/5"}`}
                >
                  {cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ⑧ FAQ — 흰 배경 */}
      <div className="bg-white">
        <div className="container-prose py-20">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-primary">자주 묻는 질문</h2>
          </div>
          <div className="max-w-2xl mx-auto mt-6 space-y-2">
            {[
              { q: "아직 명확한 목표가 없어도 신청할 수 있나요?", a: "가능합니다. 50만 원의 한끗 진단으로 방향부터 함께 잡아드립니다." },
              { q: "강사 양성 과정인가요?", a: "아닙니다. 이미 경력 있는 전문가의 콘텐츠를 함께 설계하는 서비스입니다." },
              { q: "퇴직 전에도 받을 수 있나요?", a: "오히려 퇴직 6개월~1년 전에 시작하면 가장 효과적입니다." },
              { q: "결과물은 어디에 활용할 수 있나요?", a: "강의 제안, 자문 계약, 컨설팅 수주, SNS 콘텐츠 등에 즉시 활용 가능합니다." },
              { q: "결과가 보장되나요?", a: "산출물은 6주 안에 완성됩니다. 시장 반응은 개인 경력과 실행에 따라 다릅니다." },
            ].map(({ q, a }) => (
              <details key={q} className="border border-border rounded-xl overflow-hidden">
                <summary className="px-5 py-4 cursor-pointer font-bold text-foreground text-sm md:text-base hover:bg-gray-50 transition-colors list-none flex justify-between items-center">
                  {q}
                  <span className="text-primary ml-2 shrink-0">+</span>
                </summary>
                <div className="px-5 pb-4 pt-3 text-sm text-foreground/75 leading-relaxed border-t border-border">{a}</div>
              </details>
            ))}
          </div>
        </div>
      </div>

      {/* ⑨ Final CTA — 로열블루 배경 */}
      <div className="bg-primary">
        <div className="container-prose py-16 text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight break-keep">
            30년의 경험, 이제 꺼내 보여줄 때입니다.
          </h2>
          <p className="mt-2 text-sm text-white/70">무료 진단 7문항, 약 10분이면 충분합니다.</p>
          <div className="mt-6 flex gap-3 justify-center flex-wrap">
            <Link
              href="/diagnosis"
              className="inline-flex items-center justify-center bg-white text-primary font-bold px-6 py-3 rounded-full text-sm md:text-base hover:bg-white/90 transition-colors"
            >
              경력 가치 무료 진단받기
            </Link>
            <Link
              href="/consultation"
              className="inline-flex items-center justify-center border border-white/40 text-white font-bold px-6 py-3 rounded-full text-sm md:text-base hover:bg-white/10 transition-colors"
            >
              30분 무료 상담 신청
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
