export default function Privacy() {
  return (
    <div className="container-prose py-16 md:py-24">
      <div className="text-xs font-bold text-accent tracking-widest uppercase mb-4">
        PRIVACY · 개인정보 처리방침
      </div>
      <h1 className="font-serif text-3xl md:text-4xl text-primary mb-4">
        개인정보 처리방침
      </h1>
      <p className="text-foreground/70 text-lg mb-6 leading-relaxed">
        한끗프로젝트(꿈몰다)는 아래와 같이 개인정보를 수집·이용합니다.
      </p>

      <div className="border-l-4 border-amber-400 bg-amber-50 p-4 rounded mb-10 text-sm text-amber-800">
        ◆ [P1] 구현 대상 · FR-PRIV-04 / NFR-PRIV. 아래 문구는{' '}
        <strong>자리표시</strong>이며, 실제 시행 전 법률 전문가 검토를 거칩니다.
      </div>

      <div className="space-y-8">
        <section>
          <h2 className="font-serif text-xl text-primary mb-4">1. 수집 항목</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
              <thead className="bg-secondary/40">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold border-b border-border">수집 시점</th>
                  <th className="text-left px-4 py-3 font-semibold border-b border-border">항목</th>
                  <th className="text-left px-4 py-3 font-semibold border-b border-border">저장 위치</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/50">
                  <td className="px-4 py-3 font-medium whitespace-nowrap">무료 진단</td>
                  <td className="px-4 py-3 text-foreground/80">이름, 이메일, 경력연수, 7문항 답변, 동의 시각</td>
                  <td className="px-4 py-3 font-mono text-xs text-foreground/60 whitespace-nowrap">free_diagnostics</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="px-4 py-3 font-medium whitespace-nowrap">상담·신청</td>
                  <td className="px-4 py-3 text-foreground/80">이름, 연락처, 이메일, 분야·경력, 고민, 목적·결과물</td>
                  <td className="px-4 py-3 font-mono text-xs text-foreground/60 whitespace-nowrap">leads</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium whitespace-nowrap">유료 코칭</td>
                  <td className="px-4 py-3 text-foreground/80">42문항 답변, (추후) 음성 녹음</td>
                  <td className="px-4 py-3 font-mono text-xs text-foreground/60 whitespace-nowrap">coaching_sessions · answers</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="font-serif text-xl text-primary mb-3">2. 이용 목적</h2>
          <p className="text-foreground/80 text-sm leading-relaxed">
            경력 자산화 진단·코칭 서비스 제공, 상담 연락, 산출물 제작. 수집 목적 외로 이용하지 않습니다.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-primary mb-3">3. 보관 기간 및 파기</h2>
          <p className="text-foreground/80 text-sm leading-relaxed">
            서비스 종료 또는 회원 요청 시 지체 없이 파기합니다. (구체 기간은 법률 검토 후 확정)
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-primary mb-3">4. 제3자 제공</h2>
          <p className="text-foreground/80 text-sm leading-relaxed">
            원칙적으로 제3자에게 제공하지 않습니다. 데이터는 Supabase(데이터베이스)에 저장되며
            접근은 인증된 운영자로 제한됩니다.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-primary mb-3">5. 이용자 권리</h2>
          <p className="text-foreground/80 text-sm leading-relaxed">
            본인 정보의 열람·정정·삭제를 요청할 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-primary mb-3">6. 문의처</h2>
          <p className="text-foreground/80 text-sm leading-relaxed">
            꿈몰다 · (문의 이메일/연락처 기재)
          </p>
        </section>
      </div>

      <p className="mt-12 text-xs text-foreground/50 border-t border-border pt-6 leading-relaxed">
        동의는 각 수집 지점(무료 진단·상담·신청)에서 별도로 받으며, 미동의 시 제출이 차단됩니다
        (FR-PRIV-02).
      </p>
    </div>
  )
}
