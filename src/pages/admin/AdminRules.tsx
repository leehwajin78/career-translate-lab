const RULES = [
  { code: "R-SUF-01", condition: "응답 < 20문항", output: "브리프 생성 차단 + 경고 (AC-Suf-1)", active: true },
  { code: "R-SEC-08", condition: "8섹션 매핑 완료", output: "섹션별 1건 이상 생성 (AC-Out-1)", active: true },
  { code: "R-TONE-01", condition: "모든 해석 문장", output: "\"~일 수 있습니다\" 가중 표현 개선 (R7)", active: true },
  { code: "R-SRC-01", condition: "주요 항목 생성 시", output: "sourceQuestionCodes 필수 (REQ-021)", active: true },
  { code: "R-HALL-01", condition: "Zod 스키마 검증 실패", output: "draft 보류 + 검증인 알림 (AC-Neg-2)", active: true },
  { code: "R-MISS-05", condition: "OUTPUT 변수 누락 ≥5개", output: "생성 보류 + 추가 답변 목록 (AC-Neg-7)", active: true },
];

export default function AdminRules() {
  return (
    <div className="p-8 max-w-4xl">
      <h1 className="text-2xl font-bold text-[#0D1A3E] mb-1">리포트 생성 룰 엔진 — F13</h1>
      <p className="text-sm text-gray-500 mb-6">동적 답변 → 진단 리포트·브랜드 프로필·마스터 브리프 규칙 기반 구조화 (일관성 ≥95%)</p>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden mb-4">
        <div className="px-5 py-3 border-b border-gray-100">
          <h3 className="font-bold text-sm text-[#0D1A3E]">생성 규칙 정의</h3>
        </div>
        <table className="w-full text-xs">
          <thead className="bg-gray-50 text-gray-500 border-b border-gray-200">
            <tr className="text-left">
              <th className="px-5 py-2.5">규칙</th>
              <th className="px-5 py-2.5">조건 (IF)</th>
              <th className="px-5 py-2.5">출력 (THEN)</th>
              <th className="px-5 py-2.5">상태</th>
            </tr>
          </thead>
          <tbody>
            {RULES.map((r) => (
              <tr key={r.code} className="border-t border-gray-100">
                <td className="px-5 py-3 font-mono font-bold text-primary">{r.code}</td>
                <td className="px-5 py-3 text-gray-700">{r.condition}</td>
                <td className="px-5 py-3 text-gray-700">{r.output}</td>
                <td className="px-5 py-3">
                  {r.active && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">활성</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { v: "96.4%", k: "산출물 구조 일관성 (목표 ≥95%)", ok: true },
          { v: "100%", k: "스키마 일치율 (AC-Logic-1)", ok: true },
          { v: "3.1%", k: "하강율 (목표 <5%)", ok: true },
        ].map((kpi, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <div className="text-2xl font-bold text-emerald-600">{kpi.v}</div>
            <div className="text-[10px] text-gray-500 mt-0.5">{kpi.k}</div>
          </div>
        ))}
      </div>

      <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-3 text-[10px] text-blue-700">
        Phase 2 로드맵 페이지입니다. Supabase + OpenAI 연동 후 실제 데이터로 전환됩니다.
      </div>
    </div>
  );
}
