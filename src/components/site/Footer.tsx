import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-white text-primary py-12 md:py-16">
      <div className="container-prose flex flex-col md:flex-row md:items-center justify-between gap-10">

        {/* 좌측 정보 영역 */}
        <div className="space-y-4">
          <p className="text-lg md:text-xl font-bold">꿈몰다 | 한끗프로젝트</p>
          <div className="space-y-1 text-primary/80 text-sm break-keep leading-relaxed">
            <p>전화. 070-4090-2161</p>
            <p>메일. kkummolda@kkummolda.com</p>
            <p>주소. 화성시 동탄대로 683 SH스퀘어2, 312호</p>
            <p>사업자등록번호. 133-13-04664</p>
            <p>통신판매업 신고번호. 제 2022-수원영통-0965호</p>
            <div className="pt-3 flex gap-4 text-xs text-primary/60">
              <Link href="/terms" className="hover:text-primary transition-colors underline underline-offset-2">이용약관</Link>
              <Link href="/privacy" className="hover:text-primary transition-colors font-bold">개인정보처리방침</Link>
            </div>
            <p className="text-primary/60 text-xs">
              Copyright © 2021 kkummolda All rights reserved
            </p>
          </div>
        </div>

        {/* 우측 고객센터 영역 */}
        <div className="md:text-right flex flex-col md:items-end justify-center">
          <p className="text-sm font-medium mb-1">CUSTOMER SERVICE</p>
          <p className="text-3xl md:text-4xl font-bold tracking-tight mb-2">070-4090-2161</p>
          <p className="text-primary/80 text-sm">
            주중 10:00~18:00(점심시간 12:00~13:00)
          </p>
        </div>

      </div>
    </footer>
  );
}
