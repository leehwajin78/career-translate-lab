export function ScoreGauge({ score }: { score: number }) {
  const r = 80;
  const c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;
  return (
    <div className="relative w-[200px] h-[200px]">
      <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
        <circle cx="100" cy="100" r={r} stroke="hsl(var(--border))" strokeWidth="6" fill="none" />
        <circle
          cx="100"
          cy="100"
          r={r}
          stroke="hsl(var(--accent))"
          strokeWidth="6"
          fill="none"
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s ease-out" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className="font-mono text-xs text-muted-foreground tracking-widest">SCORE</p>
        <p className="font-serif text-5xl text-primary mt-1">{score}</p>
        <p className="text-xs text-muted-foreground mt-1">/ 100</p>
      </div>
    </div>
  );
}
