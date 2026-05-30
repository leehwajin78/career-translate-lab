import { create } from "zustand";
import { persist } from "zustand/middleware";
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

export type SubmissionStatus = "in-progress" | "submitted";

interface CoachingState {
  /** 멤버 ID → 응답 데이터 매핑 */
  responses: Record<
    string,
    {
      answers: Record<number, QuestionAnswer>;
      currentQuestion: number;
      status: SubmissionStatus;
      lastSavedAt: string;
      submittedAt?: string;
    }
  >;

  /** 특정 멤버의 응답 데이터 가져오기 (없으면 초기화) */
  getSession: (memberId: string) => {
    answers: Record<number, QuestionAnswer>;
    currentQuestion: number;
    status: SubmissionStatus;
    lastSavedAt: string;
    submittedAt?: string;
  };

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

  /** 응답한 문항 수 */
  getCompletedCount: (memberId: string) => number;

  /** 진행률 퍼센트 */
  getProgress: (memberId: string) => number;
}

const EMPTY_SESSION = {
  answers: {} as Record<number, QuestionAnswer>,
  currentQuestion: 1,
  status: "in-progress" as SubmissionStatus,
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
    { name: "kkummolda-coaching" },
  ),
);
