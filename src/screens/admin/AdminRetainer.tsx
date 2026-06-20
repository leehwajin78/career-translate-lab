const RETAINERS = [
  { name: "이요이", plan: "월 100만 · 탑 매니지먼트", start: "2026-03", portfolio: "기업교육 패키지 자문안 v3 (HR→리더십)", next: "07-01", status: "정상" },
  { name: "김명지", plan: "월 80만 · 자문안+강연", start: "2026-05", portfolio: "전략 자문 자문안 v2", next: "07-05", status: "정상" },
  { name: "최성민", plan: "월 50만 · 콘텐츠", start: "2026-04", portfolio: "오늘 칼라 2건", next: "06-28", status: "결제 확인 필요" },
];

const statusCls = (s: string) =>
  s === "정상" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700";

export default function AdminRetainer() {
  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-4">
        <div className="inline-block px-2.5 py-0.5 bg-gray-100 text-gray-500 rounded text-[10px] font-bold mb-2">Phase 3 로드맵</div>
        <h1 className="text-2xl font-bold text-[#0D1A3E]">리테이너 구독 관리 — F6</h1>
        <p className="text-sm text-gray-500 mt-1">월정액 매니지먼트 + 전문 퍼포폴리오 이력 · LTV 1.5배 목표</p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { v: "5", k: "활성 리테이너" },
          { v: "33%", k: "Option B → 리테이너 선택율 (목표 ≥30%)", ok: true },
          { v: "월 380만", k: "리테이너 MRR" },
        ].map((kpi, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <div className={`text-2xl font-bold ${(kpi as any).ok ? "text-emerald-600" : "text-[#0D1A3E]"}`}>{kpi.v}</div>
            <div className="text-[10px] text-gray-500 mt-0.5">{kpi.k}</div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-xs">
          <thead className="bg-gray-50 text-gray-500 border-b border-gray-200">
            <tr className="text-left">
              <th className="px-5 py-2.5">고객</th>
              <th className="px-5 py-2.5">플랜</th>
              <th className="px-5 py-2.5">시작</th>
              <th className="px-5 py-2.5">이번 달 퍼포폴리오</th>
              <th className="px-5 py-2.5">다음 결제</th>
              <th className="px-5 py-2.5">상태</th>
            </tr>
          </thead>
          <tbody>
            {RETAINERS.map((r, i) => (
              <tr key={i} className="border-t border-gray-100">
                <td className="px-5 py-3 font-bold text-primary">{r.name}</td>
                <td className="px-5 py-3 text-gray-700">{r.plan}</td>
                <td className="px-5 py-3 font-mono text-gray-400">{r.start}</td>
                <td className="px-5 py-3 text-gray-700">{r.portfolio}</td>
                <td className="px-5 py-3 font-mono">{r.next}</td>
                <td className="px-5 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${statusCls(r.status)}`}>{r.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="px-5 py-3 text-[10px] text-gray-400 border-t border-gray-100">
          선택 트리거: Option B 멘트 완료 + NPS ≥ 8 (§11-4). MVP-Free 단계 결제는 계좌이체로 대체.
        </p>
      </div>

      <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-3 text-[10px] text-blue-700">
        Phase 3 로드맵 페이지입니다. 토스페이먼츠 연동 후 실제 데이터로 전환됩니다.
      </div>
    </div>
  );
}
