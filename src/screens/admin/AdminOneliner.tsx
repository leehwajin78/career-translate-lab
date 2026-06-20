const VARIANTS = [
  {
    type: "A. 전문성형",
    color: "border-primary",
    text: "\"40건의 전사적 검토로 다져진, 선택하기 기업의 전략 구조화 파트너\"",
    src: "Q4(40건), Q13(태그리기), Q35",
    highlight: "\"전략을 구조로\"",
  },
  {
    type: "B. 공감형",
    color: "border-amber-400",
    text: "\"멈춰 있는 기업이 다시 결정할 용기를 내도록 계속 지키는 사람\"",
    src: "Q6(사람), Q26(바라는 사람)",
    highlight: "\"다시 결정하게\"",
  },
  {
    type: "C. 결과형",
    color: "border-emerald-500",
    text: "\"6개월의 상태 \"검토 중\"을 \"실행 중\"으로 바꾸는 전략 파트너\"",
    src: "Q21(가장 명확), Q41(이유)",
    highlight: "\"검토를 실행으로\"",
  },
];

export default function AdminOneliner() {
  return (
    <div className="p-8 max-w-4xl">
      <h1 className="text-2xl font-bold text-[#0D1A3E] mb-1">슬라이드 이름 3종</h1>
      <p className="text-sm text-gray-500 mb-4">2차 인세 24시간 전 자동 생성 — 원고·선택이 생성보다 10배 빠르다 (AC-One-1~4)</p>

      <div className="flex gap-2 mb-6">
        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700">김명지 · 2차 인세 D-1</span>
        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">Stage 1+2+3 통합 데이터 기반</span>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-4">
        {VARIANTS.map((v, i) => (
          <div key={i} className={`bg-white border-t-4 ${v.color} border border-gray-200 rounded-2xl p-5 shadow-sm`}>
            <h3 className="font-bold text-sm text-[#0D1A3E] mb-3">{v.type}</h3>
            <p className="text-sm font-bold leading-relaxed text-gray-800 mb-3">{v.text}</p>
            <p className="text-[10px] text-gray-400 mb-1">출처: {v.src}</p>
            <p className="text-[10px] text-gray-400 mb-4">요약(10자): <strong>{v.highlight}</strong></p>
            <button
              onClick={() => alert(`${v.type} 선택 → 2차 인세 회의 활용 후보로 저장`)}
              className={`w-full py-1.5 rounded-lg text-xs font-bold ${i === 0 ? "bg-primary text-white hover:bg-primary/90" : "border border-gray-200 text-gray-600 hover:bg-gray-50"}`}
            >
              이 안 선택
            </button>
          </div>
        ))}
      </div>

      {/* 품질 게이트 */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
        <h3 className="font-bold text-sm text-[#0D1A3E] mb-2">품질 게이트</h3>
        <div className="flex flex-wrap gap-2">
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">3종 의미 중복 검사 통과 (AC-Neg-5)</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">일관성 점수 0.78 ≥ 0.5 (AC-One-4)</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">질문 원용 인용 정확도 100% (AC-One-2)</span>
        </div>
      </div>

      <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-3 text-[10px] text-blue-700">
        Phase 2 로드맵 페이지입니다. Supabase + OpenAI 연동 후 실제 데이터로 전환됩니다.
      </div>
    </div>
  );
}
