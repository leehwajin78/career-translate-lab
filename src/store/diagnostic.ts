import { create } from "zustand";
import { persist } from "zustand/middleware";
import { safeStorage } from "@/lib/safeStorage";
import { analyze, ContactInfo, DiagnosticAnswers, DiagnosticResult } from "@/lib/diagnostic";

interface DiagnosticState {
  answers: DiagnosticAnswers;
  contact: ContactInfo | null;
  result: DiagnosticResult | null;
  setAnswer: (id: number, value: string) => void;
  setContact: (c: ContactInfo) => void;
  finalize: () => DiagnosticResult;
  reset: () => void;
}

export const useDiagnosticStore = create<DiagnosticState>()(
  persist(
    (set, get) => ({
      answers: {},
      contact: null,
      result: null,
      setAnswer: (id, value) => set((s) => ({ answers: { ...s.answers, [id]: value } })),
      setContact: (c) => set({ contact: c }),
      finalize: () => {
        const result = analyze(get().answers);
        set({ result });
        return result;
      },
      reset: () => set({ answers: {}, contact: null, result: null }),
    }),
    { name: "kkummolda-diagnostic", storage: safeStorage }
  )
);
