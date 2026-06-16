const TRIGGERS = [
  { member: "김명지", trigger: "실패 하피형 심층 필요", basis: "Q15 < 50자 + 하피 패턴", action: "1차 인세 내 신뢰 기반 확인", cta: "인세 제안" },
  { member: "최성민", trigger: "가치 갈등", basis: "Q6·Q20·Q42 일관성 0.42 (<0.5)", action: "가치 정렬 코칭 30분", cta: "인세 제안" },
  { member: "박혜인", trigger: "자기 효능감 극점", basis: "하피형 답변 비율 53% (≥50%)", action: "이요에 먼저 연락", cta: "연락 기록" },
];

export default function AdminHandoff() {
  return (
    <div className="p-8 max-w-4xl">
      <h1 className="text-2xl font-bold text-[#0D1A3E] mb-1">휴먼 코칭 트랜스퍼 — F14</h1>
      <p className="text-sm text-gray-500 mb-6">AI가 멈춰야 할 지점을 식별합니다 · 무거운 이쪽 메타 요구 제인 (§11)</p>

      {/* 강화 트리거 테이블 */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden mb-4">
        <div className="px-5 py-3 border-b border-gray-100">
          <h3 className="font-bold text-sm text-[#0D1A3E]">강화 트리거 후</h3>
        </div>
        <table className="w-full text-xs">
          <thead className="bg-gray-50 text-gray-500 border-b border-gray-200">
            <tr className="text-left">
              <th className="px-5 py-2.5">고객</th>
              <th className="px-5 py-2.5">트리거</th>
              <th className="px-5 py-2.5">근거 (§11-2)</th>
              <th className="px-5 py-2.5">권장 조치</th>
              <th className="px-5 py-2.5"></th>
            </tr>
          </thead>
          <tbody>
            {TRIGGERS.map((t, i) => (
              <tr key={i} className="border-t border-gray-100">
                <td className="px-5 py-3 font-bold text-primary">{t.member}</td>
                <td className="px-5 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${i === 0 ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>{t.trigger}</span>
                </td>
                <td className="px-5 py-3 text-gray-600">{t.basis}</td>
                <td className="px-5 py-3 text-gray-700">{t.action}</td>
                <td className="px-5 py-3">
                  <button onClick={() => alert(`${t.cta} 발송 → 코칭 인세 추가 CTA`)} className="px-2.5 py-1 bg-primary text-white text-[10px] font-bold rounded-lg hover:bg-primary/90">
                    {t.cta}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 상담 CTA 연결 기준 */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
        <h3 className="font-bold text-sm text-[#0D1A3E] mb-3">상담 CTA 연결 기준 (§11-3)</h3>
        <p className="text-xs text-gray-700 leading-relaxed">
          진단 완료 + 자기인식 전체 체가 →{" "}
          <strong>프리미엄 매니지먼트 상담</strong>{" "}
          · \"재연 코치 권장\" 플래그 ≥3건 →{" "}
          <strong>코칭 인세 추가</strong>{" "}
          (코칭 알림 → 자동 연락) · 멘트 후 심층 장벽 도다 →{" "}
          <strong>실은 코칭 패키지</strong>{" "}
          (7일 프로젝트 설문 트리거)
        </p>
      </div>

      <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-3 text-[10px] text-blue-700">
        Phase 2 로드맵 페이지입니다. Supabase + OpenAI 연동 후 실제 데이터로 전환됩니다.
      </div>
    </div>
  );
}
