const ELEMENTS = [
  { el: "브랜드 정체성", src: "Q1 · Q7 · Q41", count: 3, status: "충분" },
  { el: "핵심 가치 체계", src: "Q2 · Q6 · Q42", count: 3, status: "충분" },
  { el: "강점 & 전문성", src: "Q4 · Q11 · Q13", count: 3, status: "충분" },
  { el: "브랜드 스토리", src: "Q8 · Q15", count: 1, status: "부족 — Q15 하피" },
  { el: "이상적 고객", src: "Q9 · Q26 · Q33", count: 3, status: "충분" },
  { el: "핵심 메시지", src: "Q41 · Q42", count: 2, status: "충분" },
  { el: "채널 전략", src: "Q28 · Q40", count: 0, status: "누락" },
  { el: "레거시 & 임팩트", src: "Q32(미응답)", count: 0, status: "누락" },
];

const statusCls = (s: string) =>
  s === "충분" ? "bg-emerald-100 text-emerald-700" : s.startsWith("부족") ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700";

export default function AdminMapper() {
  return (
    <div className="p-8 max-w-4xl">
      <h1 className="text-2xl font-bold text-[#0D1A3E] mb-1">Branding Output Mapper</h1>
      <p className="text-sm text-gray-500 mb-6">답변 → 8대 브랜딩 구성 요소 매핑, 누락 영역 식별 + 보정 질문 트리거 (F11)</p>

      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { v: "6 / 8", k: "매핑 완료 요소" },
          { v: "96.1%", k: "매핑률 (목표 ≥90%)" },
          { v: "2", k: "보정 질문 자동 생성" },
        ].map((kpi, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <div className="text-2xl font-bold text-[#0D1A3E]">{kpi.v}</div>
            <div className="text-[10px] text-gray-500 mt-0.5">{kpi.k}</div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* 요소별 커버리지 */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100">
            <h3 className="font-bold text-sm text-[#0D1A3E]">요소별 커버리지 — 김명지</h3>
          </div>
          <table className="w-full text-xs">
            <thead className="bg-gray-50 text-gray-500 border-b border-gray-200">
              <tr className="text-left">
                <th className="px-4 py-2">구성 요소</th>
                <th className="px-4 py-2">연결 답변</th>
                <th className="px-4 py-2">매핑</th>
                <th className="px-4 py-2">상태</th>
              </tr>
            </thead>
            <tbody>
              {ELEMENTS.map((e, i) => (
                <tr key={i} className="border-t border-gray-100">
                  <td className="px-4 py-2 font-bold text-[#0D1A3E]">{e.el}</td>
                  <td className="px-4 py-2 font-mono text-gray-400">{e.src}</td>
                  <td className="px-4 py-2 font-mono">{e.count}건</td>
                  <td className="px-4 py-2"><span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${statusCls(e.status)}`}>{e.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 자동 생성 보정 질문 */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <h3 className="font-bold text-sm text-[#0D1A3E] mb-3">자동 생성된 보정 질문 <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded text-[10px] font-bold">AC-Map-2</span></h3>
          <div className="space-y-3">
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <p className="font-bold text-xs text-[#0D1A3E] mb-1">채널 전략 보정</p>
              <p className="text-xs text-gray-600 italic">\"글·말·만남 중 가장 편하게 기여할 수 있는 방식은 무엇인가요? 지금 당장 하나만 깊이 한다면요?\"</p>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <p className="font-bold text-xs text-[#0D1A3E] mb-1">레거시 보정</p>
              <p className="text-xs text-gray-600 italic">\"10년 뒤, 사람들이 김명지이라는 이름을 어떤 한 단어로 기억하길 바라시나요?\"</p>
            </div>
          </div>
          <button onClick={() => alert("보정 질문을 고객 질문지에 추가 발송")} className="mt-3 w-full py-2 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary/90">
            고객에게 보정 질문 발송
          </button>
        </div>
      </div>

      <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-3 text-[10px] text-blue-700">
        Phase 2 로드맵 페이지입니다. Supabase + OpenAI 연동 후 실제 데이터로 전환됩니다.
      </div>
    </div>
  );
}
