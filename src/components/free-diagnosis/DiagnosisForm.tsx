import { useFreeDiagnosticStore } from "@/store/freeDiagnosticStore";
import { FREE_DIAGNOSTIC_QUESTIONS, Q8_OPTIONS } from "@/data/content";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, ArrowRight } from "lucide-react";

const TOTAL = FREE_DIAGNOSTIC_QUESTIONS.length;

interface Props {
  onNext: () => void;
  onBack: () => void;
}

export default function DiagnosisForm({ onNext, onBack }: Props) {
  const { answers, setAnswer, outputAssets, setOutputAssets, currentQuestion, setCurrentQuestion } = useFreeDiagnosticStore();
  const q = FREE_DIAGNOSTIC_QUESTIONS[currentQuestion];
  const currentValue = answers[q.id] ?? "";
  const progress = Math.round(((currentQuestion + 1) / TOTAL) * 100);

  const handleToggleAsset = (key: string) => {
    let nextAssets: string[] = [];
    if (key === "none") {
      nextAssets = ["none"];
    } else {
      const filtered = outputAssets.filter((a) => a !== "none");
      if (filtered.includes(key)) {
        nextAssets = filtered.filter((a) => a !== key);
      } else {
        nextAssets = [...filtered, key];
      }
      if (nextAssets.length === 0) {
        nextAssets = ["none"];
      }
    }
    setOutputAssets(nextAssets);

    // Save comma-separated string to answers[8] for backward compatibility in Lead logs
    const labels = nextAssets
      .map((k) => Q8_OPTIONS.find((opt) => opt.key === k)?.label ?? "")
      .filter(Boolean)
      .join(", ");
    setAnswer(8, labels);
  };

  const next = () => {
    if (currentQuestion === TOTAL - 1 && outputAssets.length === 0) {
      return;
    }
    if (currentQuestion < TOTAL - 1) {
      setCurrentQuestion(currentQuestion + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      onNext();
    }
  };

  const back = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      onBack();
    }
  };

  const isQ8 = q.id === 8;

  return (
    <div className="container-prose py-16 md:py-24">
      {/* Progress */}
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between text-xs text-muted-foreground tracking-widest">
          <span>경력 가치 진단 · {currentQuestion + 1} / {TOTAL}</span>
          <span className="font-mono">{progress}%</span>
        </div>
        <div className="mt-3 h-1 bg-border rounded-full relative overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-accent rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="max-w-3xl mx-auto mt-14 fade-in" key={currentQuestion}>
        {/* Badge */}
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-accent text-white text-sm font-bold">
          Q{currentQuestion + 1}
        </div>

        <h1 className="font-serif mt-5 text-2xl md:text-4xl text-primary leading-[1.35] break-keep">
          {q.question}
        </h1>

        <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{q.hint}</p>

        {isQ8 ? (
          <div className="mt-8 space-y-4 bg-surface p-6 rounded-2xl border border-border/80">
            {Q8_OPTIONS.map((opt) => {
              const isChecked = outputAssets.includes(opt.key);
              return (
                <label
                  key={opt.key}
                  className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                    isChecked
                      ? "bg-accent/5 border-accent text-primary font-semibold"
                      : "bg-background border-border/60 hover:bg-secondary/20 text-foreground"
                  }`}
                >
                  <Checkbox
                    checked={isChecked}
                    onCheckedChange={() => handleToggleAsset(opt.key)}
                    id={`q8-${opt.key}`}
                  />
                  <span className="text-base select-none leading-none">{opt.label}</span>
                </label>
              );
            })}
          </div>
        ) : (
          <>
            <Textarea
              value={currentValue}
              onChange={(e) => setAnswer(q.id, e.target.value)}
              placeholder={q.placeholder}
              rows={8}
              className="mt-8 text-base resize-none bg-surface"
              maxLength={1500}
            />
            <p className="mt-2 text-right text-xs text-muted-foreground">
              {currentValue.length} / 1500
            </p>

            {/* Tip */}
            <p className="mt-4 text-sm text-muted-foreground/80">
              💡 길게 쓸수록 더 정확한 진단이 나옵니다
            </p>
          </>
        )}

        {/* Buttons */}
        <div className="mt-12 flex items-center justify-between">
          <button
            onClick={back}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={16} /> 이전
          </button>
          <button
            onClick={next}
            disabled={isQ8 && outputAssets.length === 0}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-7 py-3.5 rounded-full text-sm font-bold hover:bg-primary/90 transition-colors disabled:opacity-55 disabled:cursor-not-allowed"
          >
            {currentQuestion === TOTAL - 1 ? "진단 완료" : "다음"} <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
