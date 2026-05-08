import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  to: string;
  children: React.ReactNode;
  variant?: "primary" | "ghost" | "gold";
  className?: string;
}

export default function CTAButton({ to, children, variant = "primary", className }: Props) {
  const base = "inline-flex items-center gap-2 px-7 py-3.5 text-sm md:text-base rounded-full transition-all";
  const styles = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-soft",
    ghost: "border border-border text-primary hover:border-primary/40 bg-transparent",
    gold: "bg-accent text-primary-foreground hover:bg-accent/90 shadow-soft",
  } as const;
  const isExternal = to.startsWith("http");
  const Comp: any = isExternal ? "a" : Link;
  const props: any = isExternal ? { href: to } : { to };
  return (
    <Comp {...props} className={cn(base, styles[variant], className)}>
      {children}
      <ArrowRight size={16} className="opacity-80" />
    </Comp>
  );
}
