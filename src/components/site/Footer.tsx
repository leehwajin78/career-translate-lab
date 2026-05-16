export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="container-prose py-16 flex flex-col md:flex-row md:items-end justify-between gap-10 text-sm text-muted-foreground">
        <div>
          <p className="font-serif text-xl text-primary font-bold">한끗프로젝트</p>
          <p className="mt-4 text-base leading-relaxed font-medium text-foreground/80">
            30년 경력을 시장이 선택하는 자산으로 만듭니다.
          </p>
        </div>
        <div className="md:text-right">
          <p className="font-medium">© 2026 꿈몰다 (kkummolda). All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
