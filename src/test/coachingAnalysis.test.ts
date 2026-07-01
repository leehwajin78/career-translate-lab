import { describe, it, expect, vi, beforeEach } from "vitest";

/* =============================================================
 * WI-10 — AI 자동 초안: 저장(saveAnalysis) + 로컬 Mock 분석기 폴백.
 * Prisma 모킹으로 DB 없이 로직 검증. ANTHROPIC_API_KEY 미설정 → mock 폴백.
 * ============================================================= */

vi.mock("@/lib/db", () => ({
  prisma: {
    membership: { findFirst: vi.fn() },
    coachingSession: { findUnique: vi.fn(), create: vi.fn(), update: vi.fn() },
    coachingReport: { findUnique: vi.fn(), upsert: vi.fn() },
    $transaction: vi.fn((ops: unknown[]) => Promise.all(ops)),
  },
}));

import { saveAnalysis } from "@/lib/coaching";
import { analyzeCoachingAnswers } from "@/lib/coachingAI";
import { prisma } from "@/lib/db";

const db = prisma as unknown as {
  membership: { findFirst: any };
  coachingSession: { findUnique: any; create: any; update: any };
  coachingReport: { findUnique: any; upsert: any };
  $transaction: any;
};

beforeEach(() => {
  vi.clearAllMocks();
  delete process.env.ANTHROPIC_API_KEY;
  db.membership.findFirst.mockResolvedValue({ id: "mem-1" });
  db.coachingSession.findUnique.mockResolvedValue({ id: "sess-1", status: "submitted" });
  db.coachingReport.upsert.mockResolvedValue({});
  db.coachingSession.update.mockResolvedValue({});
});

describe("saveAnalysis (WI-10)", () => {
  const BP = { oneLiner: "나는 돕는 사람이다", coreValues: ["성장"], strengthStatement: "s" };
  const QI = [{ questionId: 1, matchedPattern: "p" }];

  it("brandProfile + questionInsights 저장 후 세션을 analyzed 로 전이한다(트랜잭션)", async () => {
    const ok = await saveAnalysis("prof-1", BP, QI);
    expect(ok).toBe(true);

    const up = db.coachingReport.upsert.mock.calls[0][0];
    expect(up.where).toEqual({ sessionId: "sess-1" });
    expect(up.update.brandProfile).toBeDefined();
    expect(up.update.questionInsights).toBeDefined();
    expect(up.update.modelUsed).toBe("claude-opus-4-8");

    const su = db.coachingSession.update.mock.calls[0][0];
    expect(su.data.status).toBe("analyzed");
    expect(su.data.analyzedAt).toBeInstanceOf(Date);
    expect(db.$transaction).toHaveBeenCalledTimes(1);
  });

  it("멤버십이 없으면 false (저장하지 않음)", async () => {
    db.membership.findFirst.mockResolvedValue(null);
    expect(await saveAnalysis("prof-x", BP, QI)).toBe(false);
    expect(db.coachingReport.upsert).not.toHaveBeenCalled();
  });
});

describe("analyzeCoachingAnswers — 로컬 Mock 폴백(키 없음)", () => {
  it("brandProfile 8필드 + 42문항 questionInsights 를 결정적으로 생성한다", async () => {
    const answers = {
      1: { text: "나는 사람들과의 연결과 성장을 중요하게 생각한다" },
      9: { text: "청년들이 진로를 찾도록 돕고 싶다" },
    };
    const draft = await analyzeCoachingAnswers("홍길동", answers);

    expect(draft.brandProfile.oneLiner).toContain("돕는 사람이다");
    expect(draft.brandProfile.coreValues).toHaveLength(3);
    expect(draft.brandProfile.strengthStatement).toContain("홍길동");
    // 8대 필드 모두 채워짐
    for (const k of ["oneLiner", "coreValues", "strengthStatement", "targetPersona", "brandStory", "coreMessage", "channelStrategy", "brandWhy"] as const) {
      expect((draft.brandProfile as any)[k]).toBeTruthy();
    }
    expect(draft.questionInsights).toHaveLength(42);

    // 결정적: 동일 입력 → 동일 출력
    const again = await analyzeCoachingAnswers("홍길동", answers);
    expect(again.brandProfile).toEqual(draft.brandProfile);

    // 타깃 페르소나: '청년' 키워드 반영
    expect(draft.brandProfile.targetPersona).toContain("청년");
  });
});
