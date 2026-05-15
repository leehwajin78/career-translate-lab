import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="container-prose py-16 grid gap-10 md:grid-cols-2 lg:grid-cols-3 text-sm text-muted-foreground">
        <div className="lg:col-span-2">
          <p className="font-serif text-xl text-primary font-bold">한끗프로젝트</p>
          <p className="mt-4 text-base leading-relaxed font-medium text-foreground/80">
            30년 경력을 시장이 선택하는 자산으로 만듭니다.
          </p>
          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-4 font-medium text-base">
            <Link to="/service" className="hover:text-primary transition-colors">서비스 소개</Link>
            <Link to="/diagnosis" className="hover:text-primary transition-colors">진단 신청</Link>
            <Link to="/#process" className="hover:text-primary transition-colors">진행 과정</Link>
            <Link to="/#deliverables" className="hover:text-primary transition-colors">결과물</Link>
            <Link to="/#packages" className="hover:text-primary transition-colors">단계별 상품</Link>
            <Link to="/consultation" className="hover:text-primary transition-colors">상담 신청</Link>
          </div>
        </div>
        <div className="lg:text-right flex flex-col justify-end">
          <p className="font-medium">© 2026 꿈몰다 (kkummolda.com). All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
