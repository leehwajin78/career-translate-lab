const HISTORY = [
  { doc: "이수아 — 기업교육 패키지 제안서", format: "PPTX", date: "06-05" },
  { doc: "이수아 — 진단 리포트", format: "PDF", date: "05-30" },
];

export default function AdminExport() {
  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-4">
        <div className="inline-block px-2.5 py-0.5 bg-gray-100 text-gray-500 rounded text-[10px] font-bold mb-2">Phase 3 로드맵</div>
        <h1 className="text-2xl font-bold text-[#0D1A3E]">PPT / PDF Export — F8</h1>
        <p className="text-sm text-gray-500 mt-1">마스터 브리프 → 제안서·강의안 슬라이드 자동 변환 (Won't → V2 이후)</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* 내보내기 설정 */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <h3 className="font-bold text-sm text-[#0D1A3E] mb-3">내보내기 설정</h3>
          <p className="text-xs font-bold text-gray-500 mb-1">원본 문서</p>
          <p className="text-xs text-gray-600 mb-3">김명진 — 마스터 브리프 v1.0 (승인 06-11)</p>

          <p className="text-xs font-bold text-gray-500 mb-1">형식</p>
          <div className="flex gap-2 mb-3">
            <span className="px-2.5 py-0.5 bg-blue-100 text-blue-700 rounded-full text-[10px] font-bold">PPTX — moldi-slide-design</span>
            <span className="px-2.5 py-0.5 bg-gray-100 text-gray-500 rounded-full text-[10px] font-bold">PDF</span>
          </div>

          <p className="text-xs font-bold text-gray-500 mb-1">템플릿</p>
          <p className="text-xs text-gray-600 mb-4">B2B 전략 제안서 (12슬라이드) · Brand Blue #0123B4 · Pretendard</p>

          <button
            onClick={() => alert("Export 큐 등록 — V2 데모")}
            className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary/90"
          >
            PPTX 생성
          </button>
        </div>

        {/* 생성 이력 */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <h3 className="font-bold text-sm text-[#0D1A3E] mb-3">생성 이력</h3>
          <table className="w-full text-xs">
            <thead className="text-gray-500 border-b border-gray-200">
              <tr className="text-left">
                <th className="pb-2">문서</th>
                <th className="pb-2">형식</th>
                <th className="pb-2">일시</th>
                <th className="pb-2"></th>
              </tr>
            </thead>
            <tbody>
              {HISTORY.map((h, i) => (
                <tr key={i} className="border-t border-gray-100">
                  <td className="py-2.5 text-gray-700 pr-3">{h.doc}</td>
                  <td className="py-2.5 font-mono text-gray-500">{h.format}</td>
                  <td className="py-2.5 font-mono text-gray-400">{h.date}</td>
                  <td className="py-2.5">
                    <button onClick={() => alert("다운로드 — V2 데모")} className="text-primary text-[10px] hover:underline">다운로드</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-3 text-[10px] text-gray-400">
            자동 PPT '디자인' 생성은 범위 외 — 구조 변환까지만 자동화하고 디자인은 사람이 완성합니다 (PRD 12-1 Out).
          </p>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-[10px] text-blue-700">
        Phase 3 로드맵 페이지입니다. 토스페이먼츠 연동 후 실제 데이터로 전환됩니다.
      </div>
    </div>
  );
}
