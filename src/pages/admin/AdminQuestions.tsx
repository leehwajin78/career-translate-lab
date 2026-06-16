const QUESTIONS = [
  { code: "Q1", part: "PART 1", stage: "Stage 1", element: "브랜드 정체성", output: "identity_baseline → 슬라이드·프로필", mvp: true },
  { code: "Q6", part: "PART 1", stage: "Stage 1", element: "핵심 가치", output: "decision_pattern → 가치 교차검증", mvp: true },
  { code: "Q13", part: "PART 2", stage: "Stage 2", element: "강점·전문성", output: "methodology_draft → USP·강의안", mvp: true },
  { code: "Q26", part: "PART 3", stage: "Stage 3", element: "이상적 고객", output: "persona_psychological_profile", mvp: true },
  { code: "Q36", part: "PART 4", stage: "Stage 4", element: "브랜드 이해", output: "brand_vocabulary_final", mvp: true },
  { code: "Q42", part: "PART 4", stage: "Stage 3", element: "브랜드 WHY", output: "brand_why_final → F1 트리거 🔴", mvp: true },
];

export default function AdminQuestions() {
  return (
    <div className="p-8 max-w-4xl">
      <h1 className="text-2xl font-bold text-[#0D1A3E] mb-1">Question Architecture Engine</h1>
      <p className="text-sm text-gray-500 mb-6">42문항 메타데이터 — PART×Stage 이중 분류, 브랜딩 요소·산출물 연결 관리 (F9)</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { v: "42", k: "전체 문항 (9+11+12+10)" },
          { v: "16", k: "MVP 축약 문항" },
          { v: "8", k: "브랜딩 구성 요소" },
          { v: "42", k: "OUTPUT 변수 (§10-3)" },
        ].map((kpi, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <div className="text-2xl font-bold text-[#0D1A3E]">{kpi.v}</div>
            <div className="text-[10px] text-gray-500 mt-0.5">{kpi.k}</div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-sm text-[#0D1A3E]">문항 메타데이터</h3>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700">질문 변경 시 산출물 연결 자동 업데이트</span>
        </div>
        <table className="w-full text-xs">
          <thead className="bg-gray-50 text-gray-500 border-b border-gray-200">
            <tr className="text-left">
              <th className="px-5 py-2.5">코드</th>
              <th className="px-5 py-2.5">PART</th>
              <th className="px-5 py-2.5">Stage</th>
              <th className="px-5 py-2.5">브랜딩 요소</th>
              <th className="px-5 py-2.5">OUTPUT 변수 → 산출물</th>
              <th className="px-5 py-2.5">MVP</th>
            </tr>
          </thead>
          <tbody>
            {QUESTIONS.map((q) => (
              <tr key={q.code} className="border-t border-gray-100">
                <td className="px-5 py-3 font-mono font-bold text-primary">{q.code}</td>
                <td className="px-5 py-3">{q.part}</td>
                <td className="px-5 py-3">{q.stage}</td>
                <td className="px-5 py-3">{q.element}</td>
                <td className="px-5 py-3 font-mono text-gray-600">{q.output}</td>
                <td className="px-5 py-3 text-emerald-600 font-bold">{q.mvp ? "✓" : ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="px-5 py-3 text-[10px] text-gray-400 border-t border-gray-100">
          합계 검증: Stage 1(9) + 2(11) + 3(12) + 4(10) = 42 ✓ · Q42 완료 시 마스터 브리프 자동 생성 트리거.
        </p>
      </div>

      <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-3 text-[10px] text-blue-700">
        Phase 2 로드맵 페이지입니다. Supabase + OpenAI 연동 후 실제 데이터로 전환됩니다.
      </div>
    </div>
  );
}
