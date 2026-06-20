const RUNS = [
  { time: "06-10 14:23:01", taskType: "generateReport", provider: "gemini", status: "completed", duration: "36.2s", error: "—" },
  { time: "06-10 09:52:12", taskType: "generateReport", provider: "gemini", status: "completed", duration: "41.8s", error: "—" },
  { time: "06-09 11:41:30", taskType: "generateReport", provider: "gemini", status: "failed", duration: "60.0s", error: "429 RESOURCE_EXHAUSTED (free tier)" },
  { time: "06-09 11:40:02", taskType: "generateReport", provider: "gemini", status: "failed", duration: "—", error: "Zod parse error — draft 미저장" },
  { time: "06-08 16:18:44", taskType: "regenerateReport", provider: "gemini", status: "completed", duration: "33.1s", error: "—" },
];

const statusCls = (s: string) =>
  s === "completed" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700";

export default function AdminAiruns() {
  return (
    <div className="p-8 max-w-4xl">
      <h1 className="text-2xl font-bold text-[#0D1A3E] mb-1">AI 호출 로그</h1>
      <p className="text-sm text-gray-500 mb-6">AiRun — 호출 성공/실패, 생성 시간, 오류 메시지 추적 (S12 · P1)</p>

      {/* KPI */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { v: "41", k: "이번 달 호출" },
          { v: "92.7%", k: "성공률", ok: true },
          { v: "38.4초", k: "평균 생성 시간 (목표 ≤60초)" },
          { v: "1.07회", k: "진단별 호출 (목표 2회)" },
        ].map((kpi, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <div className={`text-2xl font-bold ${(kpi as any).ok ? "text-emerald-600" : "text-[#0D1A3E]"}`}>{kpi.v}</div>
            <div className="text-[10px] text-gray-500 mt-0.5">{kpi.k}</div>
          </div>
        ))}
      </div>

      {/* 로그 테이블 */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-xs">
          <thead className="bg-gray-50 text-gray-500 border-b border-gray-200">
            <tr className="text-left">
              <th className="px-5 py-3">시간</th>
              <th className="px-5 py-3">taskType</th>
              <th className="px-5 py-3">provider</th>
              <th className="px-5 py-3">상태</th>
              <th className="px-5 py-3">시간</th>
              <th className="px-5 py-3">오류</th>
            </tr>
          </thead>
          <tbody>
            {RUNS.map((run, i) => (
              <tr key={i} className="border-t border-gray-100">
                <td className="px-5 py-3 font-mono text-gray-600">{run.time}</td>
                <td className="px-5 py-3 font-mono">{run.taskType}</td>
                <td className="px-5 py-3">{run.provider}</td>
                <td className="px-5 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${statusCls(run.status)}`}>{run.status}</span>
                </td>
                <td className="px-5 py-3 font-mono">{run.duration}</td>
                <td className="px-5 py-3 font-mono text-red-500">{run.error}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="px-5 py-3 text-[10px] text-gray-400 border-t border-gray-100">
          실패 시에도 Answer 데이터는 보존됩니다 (REQ-FREE-FUNC-022). Zod 검증 실패 시 리포트는 draft 미만 상태로 차단 → 평가 차단 게이트.
        </p>
      </div>
    </div>
  );
}
