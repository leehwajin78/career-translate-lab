const MATRIX = [
  { id: "X1 Q1→Q41", desc: "정체성 변화도 (지함 의존·가치 표현·구체성)", result: "변화 +0.43", ok: true },
  { id: "X2 Q6×Q20", desc: "가치 일관성 점수 (의사결정 기준 vs 선언 가치)", result: "0.82", ok: true },
  { id: "X3 Q1+Q21+Q41", desc: "3지점 정체성 일관성", result: "0.77", ok: true },
  { id: "X4 Q32→Q42", desc: "WHY 일관성 (추상 차이)", result: "1단계", ok: true },
  { id: "X5 Q26+Q33", desc: "퍼르소나 통합 적합", result: "0.88", ok: true },
  { id: "X6 Q4→Q12", desc: "전문성-산출 권점 일치도", result: "0.71", ok: true },
  { id: "X7 Q6→Q18", desc: "행동-가치 일관성", result: "0.48", ok: false },
  { id: "X8 Q16→Q4", desc: "이요-전문성 교집합", result: "있음", ok: true },
  { id: "X9 Q38→Q10", desc: "메시지 온전 적합", result: "0.80", ok: true },
];

export default function AdminCrosscheck() {
  return (
    <div className="p-8 max-w-4xl">
      <h1 className="text-2xl font-bold text-[#0D1A3E] mb-1">교차 검증 매트릭스</h1>
      <p className="text-sm text-gray-500 mb-6">단일 답변이 아닌 답변 간 관계에서 패턴을 읽습니다 — §5-5 · 9개 매트릭스 (AC-Cross)</p>

      <div className="grid grid-cols-2 gap-3 mb-6">
        {[
          { v: "8 / 9", k: "통과 (게이트: fail 시 검증인 명시 승인 필수)" },
          { v: "0.74", k: "평균 적합성 점수" },
        ].map((kpi, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <div className="text-2xl font-bold text-[#0D1A3E]">{kpi.v}</div>
            <div className="text-[10px] text-gray-500 mt-0.5">{kpi.k}</div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden mb-4">
        <table className="w-full text-xs">
          <thead className="bg-gray-50 text-gray-500 border-b border-gray-200">
            <tr className="text-left">
              <th className="px-5 py-2.5">매트릭스</th>
              <th className="px-5 py-2.5">검증 내용</th>
              <th className="px-5 py-2.5">결과</th>
              <th className="px-5 py-2.5">판단</th>
            </tr>
          </thead>
          <tbody>
            {MATRIX.map((m) => (
              <tr key={m.id} className="border-t border-gray-100">
                <td className="px-5 py-3 font-mono font-bold text-primary">{m.id}</td>
                <td className="px-5 py-3 text-gray-700">{m.desc}</td>
                <td className="px-5 py-3 font-bold">{m.result}</td>
                <td className="px-5 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${m.ok ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                    {m.ok ? "통과" : "fail → 재연 필요 플래그"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* X7 fail 경고 */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-xs text-red-700">
        <strong>X7 fail</strong> — Q18 일관성 근거가 Q6 원칙과 어긋납니다. AC-Neg-6에 따라 마스터 브리프 생성 시 검증인 명시 승인 후만 진행합니다.
        <div className="mt-2 flex gap-2">
          <button onClick={() => alert("재연 코치 트랜스퍼 권장 기록")} className="px-2.5 py-1 bg-red-600 text-white text-[10px] font-bold rounded-lg hover:bg-red-700">트랜스퍼 권장</button>
          <button onClick={() => alert("검증인 명시 승인 → 게이트 해소")} className="px-2.5 py-1 border border-red-300 text-red-700 text-[10px] font-bold rounded-lg hover:bg-red-50">명시 승인 후 진행</button>
        </div>
      </div>

      <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-3 text-[10px] text-blue-700">
        Phase 2 로드맵 페이지입니다. Supabase + OpenAI 연동 후 실제 데이터로 전환됩니다.
      </div>
    </div>
  );
}
