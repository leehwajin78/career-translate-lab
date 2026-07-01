import { describe, it, expect, vi, beforeEach } from "vitest";

// WI-09 — 코칭 리포트 Finalize/공개 게이트. Prisma를 모킹해 DB 없이 로직 검증.
vi.mock("@/lib/db", () => ({
  prisma: {
    membership: { findFirst: vi.fn() },
    coachingSession: { findUnique: vi.fn(), create: vi.fn(), update: vi.fn() },
    coachingReport: { findUnique: vi.fn(), upsert: vi.fn() },
    $transaction: vi.fn((ops: unknown[]) => Promise.all(ops)),
  },
}));

import { finalizeReport, saveReportDraft, getReportForMember } from "@/lib/coaching";
import { prisma } from "@/lib/db";

const db = prisma as unknown as {
  membership: { findFirst: any };
  coachingSession: { findUnique: any; create: any; update: any };
  coachingReport: { findUnique: any; upsert: any };
  $transaction: any;
};

const BP = {
  oneLiner: "나는 돕는 사람이다",
  coreValues: ["성장", "신뢰"],
  strengthStatement: "구조화 역량",
  targetPersona: "전환기 전문가",
  brandStory: "스토리",
  coreMessage: "메시지",
  channelStrategy: "채널",
  brandWhy: "why",
  coachComment: "응원",
};

beforeEach(() => {
  vi.clearAllMocks();
  db.membership.findFirst.mockResolvedValue({ id: "mem-1" });
  db.coachingSession.findUnique.mockResolvedValue({ id: "sess-1", status: "submitted" });
  db.coachingReport.upsert.mockResolvedValue({});
  db.coachingSession.update.mockResolvedValue({});
  db.coachingReport.findUnique.mockResolvedValue(null);
});

describe("finalizeReport", () => {
  it("리포트를 저장하고 세션을 finalized로 전이한다(트랜잭션)", async () => {
    const ok = await finalizeReport("prof-1", BP);
    expect(ok).toBe(true);

    const up = db.coachingReport.upsert.mock.calls[0][0];
    expect(up.where).toEqual({ sessionId: "sess-1" });
    expect(up.update.finalizedAt).toBeInstanceOf(Date);
    expect(up.create.brandProfile).toBeDefined();

    const su = db.coachingSession.update.mock.calls[0][0];
    expect(su.where).toEqual({ id: "sess-1" });
    expect(su.data.status).toBe("finalized");
    expect(su.data.finalizedAt).toBeInstanceOf(Date);

    expect(db.$transaction).toHaveBeenCalledTimes(1);
  });

  it("멤버십이 없으면 false", async () => {
    db.membership.findFirst.mockResolvedValue(null);
    expect(await finalizeReport("prof-x", BP)).toBe(false);
    expect(db.coachingReport.upsert).not.toHaveBeenCalled();
  });
});

describe("saveReportDraft", () => {
  it("초안만 저장하고 세션 상태는 바꾸지 않는다", async () => {
    const ok = await saveReportDraft("prof-1", BP);
    expect(ok).toBe(true);
    const up = db.coachingReport.upsert.mock.calls[0][0];
    expect(up.update.brandProfile).toBeDefined();
    expect(up.update.finalizedAt).toBeUndefined();
    expect(db.coachingSession.update).not.toHaveBeenCalled();
  });
});

describe("getReportForMember — 공개 게이트", () => {
  it("finalized 아니면 brandProfile을 숨긴다(null)", async () => {
    db.coachingSession.findUnique.mockResolvedValue({ id: "sess-1", status: "submitted" });
    const r = await getReportForMember("prof-1");
    expect(r.status).toBe("submitted");
    expect(r.brandProfile).toBeNull();
    expect(db.coachingReport.findUnique).not.toHaveBeenCalled();
  });

  it("finalized면 brandProfile을 노출한다", async () => {
    db.coachingSession.findUnique.mockResolvedValue({ id: "sess-1", status: "finalized" });
    db.coachingReport.findUnique.mockResolvedValue({ brandProfile: { oneLiner: "hi" }, finalizedAt: new Date() });
    const r = await getReportForMember("prof-1");
    expect(r.status).toBe("finalized");
    expect(r.brandProfile).toEqual({ oneLiner: "hi" });
  });
});
