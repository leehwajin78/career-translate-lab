export default function Terms() {
  return (
    <div className="container-prose py-16 md:py-24">
      <div className="text-xs font-bold text-accent tracking-widest uppercase mb-4">
        TERMS · 이용약관
      </div>
      <h1 className="font-serif text-3xl md:text-4xl text-primary mb-4">
        이용약관
      </h1>
      <p className="text-foreground/70 text-lg mb-10 leading-relaxed">
        한끗프로젝트(꿈몰다)의 서비스를 이용하시기 전에 아래 약관을 꼭 읽어주세요.
      </p>

      <div className="space-y-8 text-sm text-foreground/80 leading-relaxed">

        <section>
          <h2 className="font-serif text-xl text-primary mb-3">제1조 (목적)</h2>
          <p>
            이 약관은 꿈몰다(이하 "회사")가 운영하는 한끗프로젝트 서비스(이하 "서비스")의
            이용 조건 및 절차, 회사와 이용자의 권리·의무·책임 사항을 규정함을 목적으로 합니다.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-primary mb-3">제2조 (용어 정의)</h2>
          <ul className="space-y-2 list-none">
            {[
              { t: "서비스", d: "회사가 제공하는 경력 자산화 진단·코칭·컨설팅 관련 모든 온·오프라인 서비스를 말합니다." },
              { t: "이용자", d: "이 약관에 동의하고 서비스를 이용하는 모든 자를 말합니다." },
              { t: "멤버", d: "회사와 유료 계약을 체결하고 코칭 서비스를 이용하는 이용자를 말합니다." },
              { t: "콘텐츠", d: "서비스 내에서 제작·제공되는 진단 리포트, 강의안, 제안서, 프로필 등 산출물을 말합니다." },
            ].map((item) => (
              <li key={item.t} className="flex gap-2">
                <span className="font-bold text-primary shrink-0">• {item.t}:</span>
                <span>{item.d}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-xl text-primary mb-3">제3조 (약관의 효력 및 변경)</h2>
          <p>
            이 약관은 서비스 화면에 게시하거나 기타 방법으로 공지함으로써 효력이 발생합니다.
            회사는 관련 법령에 위배되지 않는 범위 내에서 약관을 변경할 수 있으며,
            변경 시 시행일 7일 전부터 서비스 내 공지합니다.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-primary mb-3">제4조 (서비스 이용)</h2>
          <div className="space-y-3">
            <p>① 무료 진단 서비스는 별도 계정 없이 이름·이메일 제공 및 개인정보 수집·이용 동의 후 이용할 수 있습니다.</p>
            <p>② 유료 코칭 서비스는 회사와 별도 계약 체결 후 회사가 발급한 계정으로 이용합니다.</p>
            <p>③ 서비스는 주중 10:00~18:00를 정규 운영 시간으로 하며, 시스템 점검 등 사유로 일시 중단될 수 있습니다.</p>
          </div>
        </section>

        <section>
          <h2 className="font-serif text-xl text-primary mb-3">제5조 (서비스 요금 및 환불)</h2>
          <div className="space-y-3">
            <p>① 유료 서비스의 요금은 서비스 신청 시 고지된 금액으로 합니다.</p>
            <p>② 코칭 시작 전(1회차 진행 전)에는 전액 환불합니다.</p>
            <p>③ 코칭 진행 중 이용자 사정으로 중단하는 경우, 진행 회차를 제외한 잔여 금액을 환불합니다.</p>
            <p>④ 회사 귀책 사유로 서비스를 제공하지 못한 경우 전액 환불합니다.</p>
          </div>
        </section>

        <section>
          <h2 className="font-serif text-xl text-primary mb-3">제6조 (이용자 의무)</h2>
          <div className="space-y-2">
            <p>이용자는 다음 행위를 하여서는 안 됩니다.</p>
            <ul className="mt-2 space-y-1.5 ml-4">
              {[
                "타인의 정보를 도용하거나 허위 정보를 등록하는 행위",
                "서비스에서 제공되는 콘텐츠를 무단으로 복제·배포·상업적으로 이용하는 행위",
                "서비스 운영을 방해하거나 시스템을 해킹·손상시키는 행위",
                "다른 이용자에게 피해를 주는 행위",
              ].map((item, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-primary shrink-0">·</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section>
          <h2 className="font-serif text-xl text-primary mb-3">제7조 (산출물 저작권)</h2>
          <div className="space-y-3">
            <p>① 서비스를 통해 제작된 콘텐츠(강의안, 제안서, 프로필 등)의 저작권은 해당 멤버에게 귀속됩니다.</p>
            <p>② 회사는 서비스 개선 및 품질 향상을 위해 콘텐츠를 익명화하여 내부적으로 활용할 수 있습니다.</p>
            <p>③ 멤버 동의 없이 콘텐츠를 외부에 공개하거나 제3자에게 제공하지 않습니다.</p>
          </div>
        </section>

        <section>
          <h2 className="font-serif text-xl text-primary mb-3">제8조 (책임 제한)</h2>
          <div className="space-y-3">
            <p>① 회사는 천재지변, 불가항력적 사유로 서비스를 제공하지 못한 경우 책임을 지지 않습니다.</p>
            <p>② 서비스의 진단·분석 결과는 참고 자료이며, 이를 기반으로 한 이용자의 결정에 대한 책임은 이용자 본인에게 있습니다.</p>
          </div>
        </section>

        <section>
          <h2 className="font-serif text-xl text-primary mb-3">제9조 (분쟁 해결)</h2>
          <p>
            서비스 이용과 관련하여 분쟁이 발생한 경우, 회사와 이용자는 상호 협의하여 해결합니다.
            협의가 이루어지지 않는 경우, 관련 법령에 따른 관할 법원에 소를 제기할 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-primary mb-3">제10조 (문의처)</h2>
          <div className="space-y-1">
            <p>상호: 꿈몰다</p>
            <p>대표: 이화진</p>
            <p>주소: 화성시 동탄대로 683 SH스퀘어2, 312호</p>
            <p>전화: 070-4090-2161</p>
            <p>이메일: kkummolda@kkummolda.com</p>
          </div>
        </section>

      </div>

      <p className="mt-12 text-xs text-foreground/50 border-t border-border pt-6">
        시행일: 2026년 1월 1일 · 꿈몰다 한끗프로젝트
      </p>
    </div>
  );
}
