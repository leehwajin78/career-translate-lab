import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="container-prose py-16 grid gap-10 md:grid-cols-2 lg:grid-cols-3 text-sm text-muted-foreground">
        <div className="lg:col-span-2">
          <p className="font-serif text-xl text-primary font-bold">꿈몰다 브랜드 매니지먼트</p>
          <p className="mt-4 text-base leading-relaxed font-medium text-foreground/80">
            경험을 이력에서 브랜드로.<br />
            경력을 수익형 자산으로.
          </p>
          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-4 font-medium text-base">
            <Link to="/service" className="hover:text-primary transition-colors">서비스 소개</Link>
            <Link to="/diagnosis" className="hover:text-primary transition-colors">진단하기</Link>
            <Link to="/service#process" className="hover:text-primary transition-colors">진행 과정</Link>
            <Link to="/service#deliverables" className="hover:text-primary transition-colors">결과물</Link>
            <Link to="/consultation" className="hover:text-primary transition-colors">상담 신청</Link>
          </div>
        </div>
        <div className="lg:text-right flex flex-col justify-end">
          <p className="font-medium">© {new Date().getFullYear()} 꿈몰다. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
