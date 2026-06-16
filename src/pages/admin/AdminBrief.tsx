const SECTIONS = [
  { title: "브랜드 슬라이드", content: "\"40건의 전사적 검토로 다져진, 선택하기 기업의 전략 구조화 파트너\"", src: "Q4·Q13·Q41", status: "확정" },
  { title: "핵심 가치 3", content: "사람이 남는 결정 · 구조적 접지함 · 끝까지의 책임", src: "Q2·Q6·Q20", status: "확정" },
  { title: "가장 명확한 문", content: "\"복잡한 이해 관계 중 먼저 그리는 사람\"", src: "Q11·Q13·Q21", status: "확정" },
  { title: "타깃 퍼르소나", content: "선택하기 중견기업의 대화 (52~60) → \"결정을 미루는 중\"", src: "Q9·Q26·Q33", status: "확정" },
  { title: "브랜드 스토리", content: "Before(지함) → 선택(해소) → After(구조화 파트너)", src: "Q8·Q15·Q37", status: "검증 중" },
  { title: "핵심 메시지", content: "\"검토했는데 됐습니다. 이제 결정에 구조를 만들 차례입니다.\"", src: "Q38·Q41", status: "확정" },
  { title: "채널 전략", content: "1순위 오프라인 강연 · 보조 칼라 (격주)", src: "Q28·Q40", status: "확정" },
  { title: "브랜드 WHY", content: "\"나는 멈춰 있는 조직이 다시 움직이는 순간을 위해 일한다\"", src: "Q32·Q42", status: "확정" },
];

const statusCls = (s: string) =>
  s === "확정" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700";

export default function AdminBrief() {
  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0D1A3E]">마스터 브리프 생성기 — F1</h1>
          <p className="text-sm text-gray-500 mt-1">Q42 완료 시 자동 트리거 · 42 OUTPUT 변수 머지 → 8섹션 (AC-Out-1~6)</p>
        </div>
        <button
          onClick={() => alert("브리프 승인 → 멤버 + 7일 후 프로젝트 설문 트리거 (AC-Out-6)")}
          className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700"
        >
          브리프 승인·멘트
        </button>
      </div>

      {/* 상태 배지 */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { label: "Q42 자동 트리거 06-10 18:02 (5초 내 호출 — AC-Logic-5)", ok: true },
          { label: "OUTPUT 변수 42/42 전달", ok: true },
          { label: "교차 검증 9/9 통과", ok: true },
          { label: "생성 시간 26분 (목표 ≤30분)", blue: true },
        ].map((b, i) => (
          <span key={i} className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${b.ok ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"}`}>{b.label}</span>
        ))}
      </div>

      {/* 8개 섹션 */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden mb-4">
        <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-sm text-[#0D1A3E]">8개 섹션 — 질문 답변 출처 포함</h3>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700">AC-Out-4 추적성 100%</span>
        </div>
        <table className="w-full text-xs">
          <thead className="bg-gray-50 text-gray-500 border-b border-gray-200">
            <tr className="text-left">
              <th className="px-5 py-2.5">섹션</th>
              <th className="px-5 py-2.5">내용 (이요)</th>
              <th className="px-5 py-2.5">출처</th>
              <th className="px-5 py-2.5">상태</th>
            </tr>
          </thead>
          <tbody>
            {SECTIONS.map((s, i) => (
              <tr key={i} className="border-t border-gray-100">
                <td className="px-5 py-3 font-bold text-[#0D1A3E]">{s.title}</td>
                <td className="px-5 py-3 text-gray-700 italic">{s.content}</td>
                <td className="px-5 py-3 font-mono text-gray-400">{s.src}</td>
                <td className="px-5 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${statusCls(s.status)}`}>{s.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 분석 */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
          <h3 className="font-bold text-sm text-[#0D1A3E] mb-2">변화 산출물</h3>
          <p className="text-xs text-gray-700">→ C-Level 전략 자문의 라인 · 전략 방법론 강의의 목차 · 고문 소문 프로필 <span className="text-gray-400">(B2B 구조 변화, F1 ≥단계)</span></p>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
          <h3 className="font-bold text-sm text-[#0D1A3E] mb-2">검증 인사이트 메모</h3>
          <p className="text-xs text-gray-700">브랜드 스토리 섹션의 Q15 하피 확인 → 실패 역사가 없습니다. 멘트 전 코치 보강 세션 1회 권장 <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded text-[10px] font-bold">재연 코치 권장 1건</span></p>
        </div>
      </div>

      <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-3 text-[10px] text-blue-700">
        Phase 2 로드맵 페이지입니다. Supabase + OpenAI 연동 후 실제 데이터로 전환됩니다.
      </div>
    </div>
  );
}
