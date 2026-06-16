const PATTERNS = [
  { p: "P1 지함 중심형", signal: "직위 묘사 2회+ · 가치 활용사 0개 (Q1)", risk: "중", action: "지함 제거 심층 질문 자동 생성" },
  { p: "P3 자기축소형", signal: "\"별로·비천한·그냥\" 축소 표현 3회+ (Q2·Q4)", risk: "중", action: "재프레이밍 코칭 메시지 코스" },
  { p: "P5 파킹 과확장형", signal: "\"모두·누구나\" + 구체 허르소나 0개 (Q9·Q26)", risk: "높", action: "좁히기 코칭 + 보정 질문" },
  { p: "P7 방법론 보유형", signal: "단계·프로세스 구조 설명 (Q13)", risk: "낮", action: "방법론 이름 붙이기 → USP 연결" },
  { p: "P10 실패 하피형", signal: "Q15 < 50자 또는 \"없다/모르겠다\"", risk: "높", action: "보상 질문 + 검증인 플래그 + 트랜스퍼" },
];

const riskCls = (r: string) =>
  r === "높" ? "bg-red-100 text-red-700" : r === "중" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700";

export default function AdminPatterns() {
  return (
    <div className="p-8 max-w-4xl">
      <h1 className="text-2xl font-bold text-[#0D1A3E] mb-1">Answer Pattern Classifier</h1>
      <p className="text-sm text-gray-500 mb-6">답변을 10개 패턴으로 분류 — NLP 키워드 + LLM 문맥 분석 (F10)</p>

      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { v: "87.2%", k: "검증인 일치율 (목표 ≥85%)", ok: true },
          { v: "1.7분", k: "건별 분류 시간 (목표 60분)" },
          { v: "10", k: "패턴 유형" },
        ].map((kpi, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <div className={`text-2xl font-bold ${(kpi as any).ok ? "text-emerald-600" : "text-[#0D1A3E]"}`}>{kpi.v}</div>
            <div className="text-[10px] text-gray-500 mt-0.5">{kpi.k}</div>
          </div>
        ))}
      </div>

      {/* 분류 결과 예시 */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm mb-4">
        <h3 className="font-bold text-sm text-[#0D1A3E] mb-3">김명지 — 분류 결과</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700">P10 실패 하피형 (Q15, 신뢰도 .91)</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700">P1 지함 중심형 (Q1, .88)</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700">P3 자기축소형 (Q4, .83)</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">P7 방법론 보유형 (Q13, .79)</span>
        </div>
        <div className="flex gap-2">
          <button onClick={() => alert("분류 승인 → 검증인 일치율 집계에 반영")} className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700">분류 승인</button>
          <button onClick={() => alert("거부 후기 → 재학습 후기")} className="px-3 py-1.5 border border-gray-200 text-gray-600 text-xs font-bold rounded-lg hover:bg-gray-50">분류 거부</button>
        </div>
      </div>

      {/* 패턴 테이블 */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-xs">
          <thead className="bg-gray-50 text-gray-500 border-b border-gray-200">
            <tr className="text-left">
              <th className="px-5 py-2.5">패턴</th>
              <th className="px-5 py-2.5">감지 신호 (§5-2)</th>
              <th className="px-5 py-2.5">리스크</th>
              <th className="px-5 py-2.5">자동 조치</th>
            </tr>
          </thead>
          <tbody>
            {PATTERNS.map((p, i) => (
              <tr key={i} className="border-t border-gray-100">
                <td className="px-5 py-3 font-bold text-[#0D1A3E]">{p.p}</td>
                <td className="px-5 py-3 text-gray-600">{p.signal}</td>
                <td className="px-5 py-3"><span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${riskCls(p.risk)}`}>{p.risk}</span></td>
                <td className="px-5 py-3 text-gray-600">{p.action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-3 text-[10px] text-blue-700">
        Phase 2 로드맵 페이지입니다. Supabase + OpenAI 연동 후 실제 데이터로 전환됩니다.
      </div>
    </div>
  );
}
