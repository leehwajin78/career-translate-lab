import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "ghost" | "gold";
  className?: string;
}

export default function CTAButton({ href, children, variant = "primary", className }: Props) {
  const base = "inline-flex items-center gap-2 px-8 py-4 text-base md:text-lg font-bold rounded-full transition-all hover:scale-105 duration-200 active:scale-95 shadow-md";
  const styles = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90",
    ghost: "border-2 border-border text-primary hover:border-primary hover:bg-primary/5 bg-transparent",
    gold: "bg-accent text-white hover:bg-accent/90",
  } as const;
  const isExternal = href.startsWith("http");
  const Comp: any = isExternal ? "a" : Link;
  const props: any = { href };
  return (
    <Comp {...props} className={cn(base, styles[variant], className)}>
      {children}
      <ArrowRight size={20} className="opacity-90 shrink-0" />
    </Comp>
  );
}
