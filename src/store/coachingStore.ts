import { create } from "zustand";
import { persist } from "zustand/middleware";
import { safeStorage } from "@/lib/safeStorage";
import { TOTAL_QUESTIONS } from "@/data/coachingQuestions";

/* ─── 42문항 코칭 응답 스토어 ─── */

export interface VoiceRecording {
  /** base64-encoded audio data */
  data: string;
  /** MIME type (audio/webm, audio/mp4 등) */
  mimeType: string;
  /** 녹음 길이 (초) */
  duration: number;
  /** 녹음 시각 */
  recordedAt: string;
}

export interface QuestionAnswer {
  /** 텍스트 답변 */
  text: string;
  /** 음성 녹음 (선택) */
  voice?: VoiceRecording;
  /** 마지막 수정 시각 */
  updatedAt: string;
}

export type SubmissionStatus = "in-progress" | "submitted" | "analyzing" | "analyzed" | "finalized";

export interface AIDraft {
  brandProfile: {
    oneLiner: string;
    coreValues: string[];
    strengthStatement: string;
    targetPersona: string;
    brandStory: string;
    coreMessage: string;
    channelStrategy: string;
    brandWhy: string;
  };
  questionInsights: {
    questionId: number;
    matchedPattern: string;
    brandingSignal: string;
    coachingMessage: string;
    profileConnection: string;
  }[];
}

export interface FinalProfile {
  oneLiner: string;
  coreValues: string[];
  strengthStatement: string;
  targetPersona: string;
  brandStory: string;
  coreMessage: string;
  channelStrategy: string;
  brandWhy: string;
  coachComment?: string;
}

interface CoachingSession {
  answers: Record<number, QuestionAnswer>;
  currentQuestion: number;
  status: SubmissionStatus;
  lastSavedAt: string;
  submittedAt?: string;
  aiDraft?: AIDraft;
  finalProfile?: FinalProfile;
  coachNotes?: Record<number, string>;
  finalizedAt?: string;
}

interface CoachingState {
  /** 멤버 ID → 응답 데이터 매핑 */
  responses: Record<string, CoachingSession>;

  /** 특정 멤버의 응답 데이터 가져오기 (없으면 초기화) */
  getSession: (memberId: string) => CoachingSession;

  /** 텍스트 답변 저장 */
  saveText: (memberId: string, questionId: number, text: string) => void;

  /** 음성 녹음 저장 */
  saveVoice: (
    memberId: string,
    questionId: number,
    voice: VoiceRecording,
  ) => void;

  /** 음성 녹음 삭제 */
  removeVoice: (memberId: string, questionId: number) => void;

  /** 현재 문항 위치 저장 */
  setCurrentQuestion: (memberId: string, questionId: number) => void;

  /** 최종 제출 */
  submit: (memberId: string) => void;

  /** 진행 상태 변경 */
  setStatus: (memberId: string, status: SubmissionStatus) => void;

  /** AI 진단 분석 결과(초안) 저장 */
  saveAiDraft: (memberId: string, aiDraft: AIDraft) => void;

  /** 코치 문항별 필기 메모 저장 */
  saveCoachNote: (memberId: string, questionId: number, note: string) => void;

  /** 최종 코칭 완료 및 리포트 승인 */
  finalizeCoaching: (memberId: string, finalProfile: FinalProfile) => void;

  /** 응답한 문항 수 */
  getCompletedCount: (memberId: string) => number;

  /** 진행률 퍼센트 */
  getProgress: (memberId: string) => number;
}

const EMPTY_SESSION: CoachingSession = {
  answers: {} as Record<number, QuestionAnswer>,
  currentQuestion: 1,
  status: "in-progress",
  lastSavedAt: new Date().toISOString(),
};

export const useCoachingStore = create<CoachingState>()(
  persist(
    (set, get) => ({
      responses: {},

      getSession: (memberId) => {
        const session = get().responses[memberId];
        if (session) return session;
        // 초기화
        const newSession = { ...EMPTY_SESSION, lastSavedAt: new Date().toISOString() };
        set((s) => ({
          responses: { ...s.responses, [memberId]: newSession },
        }));
        return newSession;
      },

      saveText: (memberId, questionId, text) => {
        const now = new Date().toISOString();
        set((s) => {
          const session = s.responses[memberId] ?? { ...EMPTY_SESSION };
          const existing = session.answers[questionId];
          return {
            responses: {
              ...s.responses,
              [memberId]: {
                ...session,
                answers: {
                  ...session.answers,
                  [questionId]: {
                    text,
                    voice: existing?.voice,
                    updatedAt: now,
                  },
                },
                lastSavedAt: now,
              },
            },
          };
        });
      },

      saveVoice: (memberId, questionId, voice) => {
        const now = new Date().toISOString();
        set((s) => {
          const session = s.responses[memberId] ?? { ...EMPTY_SESSION };
          const existing = session.answers[questionId];
          return {
            responses: {
              ...s.responses,
              [memberId]: {
                ...session,
                answers: {
                  ...session.answers,
                  [questionId]: {
                    text: existing?.text ?? "",
                    voice,
                    updatedAt: now,
                  },
                },
                lastSavedAt: now,
              },
            },
          };
        });
      },

      removeVoice: (memberId, questionId) => {
        const now = new Date().toISOString();
        set((s) => {
          const session = s.responses[memberId] ?? { ...EMPTY_SESSION };
          const existing = session.answers[questionId];
          if (!existing) return s;
          return {
            responses: {
              ...s.responses,
              [memberId]: {
                ...session,
                answers: {
                  ...session.answers,
                  [questionId]: {
                    text: existing.text,
                    voice: undefined,
                    updatedAt: now,
                  },
                },
                lastSavedAt: now,
              },
            },
          };
        });
      },

      setCurrentQuestion: (memberId, questionId) => {
        set((s) => {
          const session = s.responses[memberId] ?? { ...EMPTY_SESSION };
          return {
            responses: {
              ...s.responses,
              [memberId]: { ...session, currentQuestion: questionId },
            },
          };
        });
      },

      submit: (memberId) => {
        const now = new Date().toISOString();
        set((s) => {
          const session = s.responses[memberId] ?? { ...EMPTY_SESSION };
          return {
            responses: {
              ...s.responses,
              [memberId]: {
                ...session,
                status: "submitted",
                submittedAt: now,
                lastSavedAt: now,
              },
            },
          };
        });
      },

      setStatus: (memberId, status) => {
        const now = new Date().toISOString();
        set((s) => {
          const session = s.responses[memberId] ?? { ...EMPTY_SESSION };
          return {
            responses: {
              ...s.responses,
              [memberId]: {
                ...session,
                status,
                lastSavedAt: now,
              },
            },
          };
        });
      },

      saveAiDraft: (memberId, aiDraft) => {
        const now = new Date().toISOString();
        set((s) => {
          const session = s.responses[memberId] ?? { ...EMPTY_SESSION };
          return {
            responses: {
              ...s.responses,
              [memberId]: {
                ...session,
                aiDraft,
                // AI 분석이 끝났으므로 status를 analyzed로 변경 (만약 현재 상태가 submitted/analyzing 인 경우)
                status: session.status === "finalized" ? "finalized" : "analyzed",
                lastSavedAt: now,
              },
            },
          };
        });
      },

      saveCoachNote: (memberId, questionId, note) => {
        const now = new Date().toISOString();
        set((s) => {
          const session = s.responses[memberId] ?? { ...EMPTY_SESSION };
          const notes = session.coachNotes ?? {};
          return {
            responses: {
              ...s.responses,
              [memberId]: {
                ...session,
                coachNotes: {
                  ...notes,
                  [questionId]: note,
                },
                lastSavedAt: now,
              },
            },
          };
        });
      },

      finalizeCoaching: (memberId, finalProfile) => {
        const now = new Date().toISOString();
        set((s) => {
          const session = s.responses[memberId] ?? { ...EMPTY_SESSION };
          return {
            responses: {
              ...s.responses,
              [memberId]: {
                ...session,
                finalProfile,
                status: "finalized",
                finalizedAt: now,
                lastSavedAt: now,
              },
            },
          };
        });
      },

      getCompletedCount: (memberId) => {
        const session = get().responses[memberId];
        if (!session) return 0;
        return Object.values(session.answers).filter(
          (a) => (a.text && a.text.trim().length > 0) || a.voice,
        ).length;
      },

      getProgress: (memberId) => {
        const count = get().getCompletedCount(memberId);
        return Math.round((count / TOTAL_QUESTIONS) * 100);
      },
    }),
    { name: "kkummolda-coaching", storage: safeStorage },
  ),
);
