export default function AdminFeedback() {
  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-2xl font-bold text-[#0D1A3E] mb-1">코칭 피드백 생성기 — F12</h1>
      <p className="text-sm text-gray-500 mb-6">패턴별 5060 특화 피드백 · 168 스크립트 기반 (고객 대면 영역)</p>

      {/* Q4 피드백 예시 */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm mb-4">
        <h3 className="font-bold text-sm text-[#0D1A3E] mb-2">Q4 답변 → P3 자기축소형 감지</h3>
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 mb-3 text-xs text-gray-600 italic">
          고객 답변: \"전사적 검토 자문이요. 제 전사적 검토만 40건 넘게 했습니다. 당연한 거 아닌가 싶지만…\"
        </div>
        <hr className="border-gray-100 mb-3" />
        <p className="text-[10px] font-bold text-gray-400 mb-2">생성된 코칭 피드백 (가중 표현 개선 → R7)</p>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-gray-800 leading-relaxed mb-3">
          \"전사적 검토 40건 — 그게 당연한 사람이 얼마나 될 것 같으세요? 이 경험을 \"판단의 데이터베이스\"라는 특별한 자산으로 볼 수 있습니다. 거창하지 않아도 됩니다. 40건 중 가장 어려웠던 결정 하나만 먼저 꺼내볼까요?\"
        </div>
        <div className="flex gap-2">
          <button onClick={() => alert("피드백 승인 → 고객 화면에 노출")} className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700">승인</button>
          <button onClick={() => alert("일반론 하강 — 비율 목표 <10% (AC-Out-3)")} className="px-3 py-1.5 border border-gray-200 text-gray-600 text-xs font-bold rounded-lg hover:bg-gray-50">일반론 하강</button>
          <button onClick={() => alert("재생성")} className="px-3 py-1.5 border border-gray-200 text-gray-600 text-xs font-bold rounded-lg hover:bg-gray-50">재생성</button>
        </div>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { v: "4.4 / 5.0", k: "\"공감 받는다\" 만족도 (목표 ≥4.3)", ok: true },
          { v: "7.2%", k: "일반론 비율 (목표 <10%)", ok: true },
          { v: "126+168", k: "스크립트 원본+후 2단 구조" },
        ].map((kpi, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <div className={`text-xl font-bold ${(kpi as any).ok ? "text-emerald-600" : "text-[#0D1A3E]"}`}>{kpi.v}</div>
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
