import { create } from "zustand";
import { persist } from "zustand/middleware";
import { analyzeFree, FreeDiagnosticResult } from "@/lib/freeDiagnostic";

export type FreeDiagnosticStep = "email" | "form" | "loading" | "report" | "complete";

interface FreeDiagnosticState {
  step: FreeDiagnosticStep;

  lead: { name: string; email: string; careerYears: string } | null;
  agreedPrivacy: boolean;

  answers: Record<number, string>;
  currentQuestion: number;

  result: FreeDiagnosticResult | null;

  setStep: (step: FreeDiagnosticStep) => void;
  setLead: (lead: FreeDiagnosticState["lead"]) => void;
  setAgreedPrivacy: (agreed: boolean) => void;
  setAnswer: (questionId: number, value: string) => void;
  setCurrentQuestion: (index: number) => void;
  analyze: () => FreeDiagnosticResult;
  reset: () => void;
}

export const useFreeDiagnosticStore = create<FreeDiagnosticState>()(
  persist(
    (set, get) => ({
      step: "email",
      lead: null,
      agreedPrivacy: false,
      answers: {},
      currentQuestion: 0,
      result: null,

      setStep: (step) => set({ step }),
      setLead: (lead) => set({ lead }),
      setAgreedPrivacy: (agreed) => set({ agreedPrivacy: agreed }),
      setAnswer: (questionId, value) =>
        set((s) => ({ answers: { ...s.answers, [questionId]: value } })),
      setCurrentQuestion: (index) => set({ currentQuestion: index }),
      analyze: () => {
        const result = analyzeFree(get().answers);
        set({ result });
        return result;
      },
      reset: () =>
        set({
          step: "email",
          lead: null,
          agreedPrivacy: false,
          answers: {},
          currentQuestion: 0,
          result: null,
        }),
    }),
    { name: "kkummolda-free-diagnostic" }
  )
);
