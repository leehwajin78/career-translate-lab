import { cn } from "@/lib/utils";

export function NumberedLabel({ number, children, className }: { number: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("inline-flex items-center gap-3 text-xs uppercase tracking-[0.22em] text-accent", className)}>
      <span className="font-mono">{number}</span>
      <span className="h-px w-8 bg-accent/60" />
      <span className="text-muted-foreground">{children}</span>
    </div>
  );
}

export function SectionHeader({
  number,
  eyebrow,
  title,
  description,
  align = "left",
}: {
  number?: string;
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
}) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center")}>
      {(number || eyebrow) && <NumberedLabel number={number ?? ""} className={cn(align === "center" && "justify-center")}>{eyebrow}</NumberedLabel>}
      <h2 className="font-serif mt-5 text-3xl md:text-[2.5rem] leading-[1.25] text-primary">{title}</h2>
      {description && <p className="mt-5 text-base md:text-lg text-muted-foreground leading-relaxed">{description}</p>}
    </div>
  );
}

export function GoldDivider({ className }: { className?: string }) {
  return <div className={cn("gold-rule", className)} />;
}

export function EditorialCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("bg-card border border-border rounded-[var(--radius)] shadow-soft p-7 md:p-9", className)}>
      {children}
    </div>
  );
}
