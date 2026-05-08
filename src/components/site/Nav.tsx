import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { NAV_LINKS } from "@/data/content";
import { cn } from "@/lib/utils";

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [location.pathname]);

  const renderLink = (href: string, label: string) => {
    const isAnchor = href.startsWith("#");
    if (isAnchor && location.pathname !== "/") {
      return (
        <Link key={href} to={`/${href}`} className="text-sm text-foreground/80 hover:text-foreground transition-colors">
          {label}
        </Link>
      );
    }
    if (isAnchor) {
      return (
        <a key={href} href={href} className="text-sm text-foreground/80 hover:text-foreground transition-colors">
          {label}
        </a>
      );
    }
    return (
      <Link key={href} to={href} className="text-sm text-foreground/80 hover:text-foreground transition-colors">
        {label}
      </Link>
    );
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full border-b border-transparent backdrop-blur-md transition-all",
        scrolled ? "bg-background/85 border-border/70" : "bg-background/60"
      )}
    >
      <div className="container-prose flex h-16 md:h-20 items-center justify-between">
        <Link to="/" className="flex items-center">
          <img src="/logo.png" alt="꿈몰다 브랜드 매니지먼트" className="h-3 md:h-4 w-auto object-contain" />
        </Link>
        <nav className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((l) => renderLink(l.href, l.label))}
        </nav>
        <div className="hidden lg:block">
          <Link
            to="/diagnosis"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors px-5 py-2.5 text-sm rounded-full shadow-soft"
          >
            내 경력 브랜드 가능성 진단하기
          </Link>
        </div>
        <button className="lg:hidden p-2 -mr-2" onClick={() => setOpen((v) => !v)} aria-label="menu">
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      {open && (
        <div className="lg:hidden border-t border-border bg-background">
          <div className="container-prose py-6 flex flex-col gap-4">
            {NAV_LINKS.map((l) => renderLink(l.href, l.label))}
            <Link
              to="/diagnosis"
              className="mt-2 inline-flex items-center justify-center bg-primary text-primary-foreground px-5 py-3 text-sm rounded-full"
            >
              내 경력 브랜드 가능성 진단하기
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
