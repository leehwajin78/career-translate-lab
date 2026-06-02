import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DiagnosisType, PackageKey } from "@/data/content";
import { notifyLead } from "@/lib/notifyLead";

export type LeadStatus =
  | "신규 리드"
  | "상담 예정"
  | "상담 완료"
  | "제안서 발송"
  | "계약 완료"
  | "보류";

export const LEAD_STATUSES: LeadStatus[] = [
  "신규 리드",
  "상담 예정",
  "상담 완료",
  "제안서 발송",
  "계약 완료",
  "보류",
];

export interface Lead {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  email: string;
  field: string;
  career: string;
  purposes: string[];
  challenge: string;
  outcomes: string[];
  channel: string;
  diagnosticScore?: number;
  diagnosticType?: string;
  recommendedPackage?: string;
  answers?: Record<string, string>;
  outputAssets?: string[];
  scores?: {
    identity: number;
    strengths: number;
    target: number;
    differentiation: number;
  };
  status: LeadStatus;
  memo: string;
}

interface LeadsState {
  leads: Lead[];
  addLead: (lead: Omit<Lead, "id" | "createdAt" | "status" | "memo"> & { status?: LeadStatus; memo?: string }) => Lead;
  updateStatus: (id: string, status: LeadStatus) => void;
  updateMemo: (id: string, memo: string) => void;
}

export const useLeadsStore = create<LeadsState>()(
  persist(
    (set) => ({
      leads: [],
      addLead: (data) => {
        const lead: Lead = {
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          status: data.status ?? "신규 리드",
          memo: data.memo ?? "",
          ...data,
        };
        set((s) => ({ leads: [lead, ...s.leads] }));
        
        // Asynchronously trigger Web3Forms operator email notification.
        // It runs in the background and gracefully degrades on failure.
        notifyLead(lead).catch((err) => {
          console.error("Graceful degradation: operator notification failed.", err);
        });

        return lead;
      },
      updateStatus: (id, status) =>
        set((s) => ({ leads: s.leads.map((l) => (l.id === id ? { ...l, status } : l)) })),
      updateMemo: (id, memo) =>
        set((s) => ({ leads: s.leads.map((l) => (l.id === id ? { ...l, memo } : l)) })),
    }),
    { name: "kkummolda-leads" }
  )
);
