export default function AdminAuth() {
  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-2xl font-bold text-[#0D1A3E] mb-1">어드민 인증 게이트</h1>
      <p className="text-sm text-gray-500 mb-6">Supabase Auth 기반 접근 통제 — FR-AUTH-01·02 / NFR-SEC</p>

      {/* As-Is */}
      <div className="bg-white border-l-4 border-red-400 border border-gray-200 rounded-2xl p-5 shadow-sm mb-4">
        <h3 className="font-bold text-sm text-red-600 mb-2">현행 상태 (As-Is)</h3>
        <p className="text-xs text-gray-700 mb-3">
          현재 AdminGate는 children만 반환합니다. <strong>/admin의 URL만 알면 누구나 접근</strong>해 리드 연락처·진단 답변·멤버 계정을 열람할 수 있습니다. 실고객 데이터가 들어오기 전 반드시 차단해야 합니다.
        </p>
        <pre className="bg-red-50 text-red-800 border border-red-200 rounded-xl p-3 text-[11px] font-mono leading-relaxed">
{`const AdminGate = ({ children }) => children;  // 인증 로직 없음`}
        </pre>
      </div>

      {/* To-Be */}
      <div className="bg-white border-l-4 border-primary border border-gray-200 rounded-2xl p-5 shadow-sm mb-4">
        <h3 className="font-bold text-sm text-primary mb-2">▶ [P1] 목표 (To-Be) — Supabase Auth</h3>
        <p className="text-xs text-gray-700 mb-3">
          로그인 + <code className="bg-gray-100 px-1 rounded">app_metadata.role='admin'</code> 인증만 어드민 권한을 가집니다. 비로그인·비어드민은 <code className="bg-gray-100 px-1 rounded">/admin</code>·<code className="bg-gray-100 px-1 rounded">/coaching/workspace/*</code> 접근이 차단됩니다.
        </p>
        <pre className="bg-blue-50 text-blue-900 border border-blue-200 rounded-xl p-3 text-[11px] font-mono leading-relaxed">
{`// is_admin(): auth.jwt().app_metadata.role === 'admin'
if (!session || !isAdmin) return <AdminLogin/>;
return children;`}
        </pre>

        {/* 로그인 폼 미리보기 */}
        <div className="max-w-sm mx-auto mt-5">
          <p className="text-xs font-semibold text-gray-600 mb-1">어드민 이메일</p>
          <input type="text" defaultValue="admin@kkummolda.com" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs mb-3" readOnly />
          <p className="text-xs font-semibold text-gray-600 mb-1">비밀번호</p>
          <input type="password" placeholder="••••••••" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs mb-3" />
          <button className="w-full bg-primary text-white py-2.5 rounded-xl text-xs font-bold opacity-50 cursor-not-allowed">어드민 로그인 (Supabase 연결 후 활성화)</button>
        </div>
      </div>

      {/* 인수 조건 */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
        <h3 className="font-bold text-sm text-[#0D1A3E] mb-3">인수조건 (SRS)</h3>
        <table className="w-full text-xs">
          <thead className="bg-gray-50 text-gray-500 border-b border-gray-100">
            <tr className="text-left">
              <th className="px-3 py-2">AC</th>
              <th className="px-3 py-2">통과 조건</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {[
              { ac: "AUTH-02.1", cond: "로그아웃 상태 /admin 접근 시 로그인 폼 표시, 데이터 미노출" },
              { ac: "AUTH-02.2", cond: "일반 멤버 인증으로 워크스페이스 직접 접근 거부" },
              { ac: "AUTH-05.1", cond: "members 테이블·store에 평문 password 필드 부재" },
              { ac: "SEC-02.1", cond: "service_role 키가 클라이언트 번들에 미포함" },
            ].map((row) => (
              <tr key={row.ac}>
                <td className="px-3 py-2 font-mono font-bold text-primary">{row.ac}</td>
                <td className="px-3 py-2 text-gray-700">{row.cond}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-[10px] text-gray-400 mt-3">관련 Task: T1(RLS·어드민 role) · T3(AdminGate 교체) · T4(멤버 Auth 발급)</p>
      </div>
    </div>
  );
}
