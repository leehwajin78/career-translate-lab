import { describe, it, expect, vi, beforeEach } from "vitest";

// Prisma를 모킹 → DB 없이 라우트의 분류·영속화·반환 배선만 검증 (WI-08: 분류→영속화→반환).
vi.mock("@/lib/db", () => ({
  prisma: {
    freeDiagnostic: { findFirst: vi.fn(), create: vi.fn() },
    lead: { create: vi.fn() },
  },
}));

import { POST } from "@/app/api/diagnoses/route";
import { prisma } from "@/lib/db";

const fd = prisma.freeDiagnostic as unknown as { findFirst: any; create: any };
const lead = prisma.lead as unknown as { create: any };

function makeReq(body: unknown, headers: Record<string, string> = {}) {
  return {
    async json() { return body; },
    headers: { get: (k: string) => headers[k.toLowerCase()] ?? null },
  } as any;
}

const VALID = {
  email: "e2e@example.com",
  name: "테스터",
  careerYears: "15~20년",
  answers: {
    q1: "직함 없이도 나를 설명할 수 있는 사람입니다.",
    q2: "프로젝트를 되살린 경험이 가장 자랑스럽습니다.",
    q3: "정리와 분석, 설명이 오래된 강점입니다.",
    q4: "경력 전환을 앞둔 전문가를 돕고 싶습니다.",
    q5: "막막함과 불안을 느끼는 분들을 이해합니다.",
    q6: "경험을 연결하는 관점과 방법론이 다릅니다.",
    q7: "사람들의 성장과 신뢰가 일을 계속하는 이유입니다.",
  },
  bonusChecks: ["profile", "lecture"],
  consentAt: new Date().toISOString(),
};

beforeEach(() => {
  vi.clearAllMocks();
  fd.findFirst.mockResolvedValue(null);
  fd.create.mockResolvedValue({ id: "diag-1" });
  lead.create.mockResolvedValue({});
});

describe("POST /api/diagnoses — 분류 영속화", () => {
  it("유효 제출 시 분류 결과를 계산해 free_diagnostics.score 에 저장하고 status=completed", async () => {
    const res = await POST(makeReq(VALID));
    expect(res.status).toBe(200);

    const createArg = fd.create.mock.calls[0][0];
    expect(createArg.data.status).toBe("completed");
    expect(createArg.data.score).toMatchObject({
      type: expect.any(String),
      totalScore: expect.any(Number),
    });
    expect(createArg.data.score.scores).toBeTypeOf("object");
    expect(createArg.data.score.type).not.toBe("pending");
  });

  it("leads.score 에 총점을 함께 저장한다", async () => {
    await POST(makeReq(VALID));
    const createArg = fd.create.mock.calls[0][0];
    const leadArg = lead.create.mock.calls[0][0];
    expect(leadArg.data.source).toBe("free_diagnosis");
    expect(leadArg.data.score).toBe(createArg.data.score.totalScore);
  });

  it("응답으로 pending 이 아닌 실제 type/scores/totalScore 를 반환한다", async () => {
    const res = await POST(makeReq(VALID));
    const body = await res.json();
    expect(body.id).toBe("diag-1");
    expect(body.type).not.toBe("pending");
    expect(typeof body.totalScore).toBe("number");
    expect(body.scores).toBeTypeOf("object");
    expect(Object.keys(body.scores).length).toBeGreaterThan(0);
  });
});

describe("POST /api/diagnoses — 가드", () => {
  it("24시간 내 동일 이메일 재제출은 429(RATE_LIMITED)", async () => {
    fd.findFirst.mockResolvedValue({ id: "existing" });
    const res = await POST(makeReq(VALID));
    expect(res.status).toBe(429);
    const body = await res.json();
    expect(body.error).toBe("RATE_LIMITED");
    expect(fd.create).not.toHaveBeenCalled();
  });

  it("스키마 위반 본문은 422(VALIDATION_ERROR)", async () => {
    const res = await POST(makeReq({ ...VALID, email: "not-an-email" }));
    expect(res.status).toBe(422);
    const body = await res.json();
    expect(body.error).toBe("VALIDATION_ERROR");
    expect(fd.create).not.toHaveBeenCalled();
  });
});
