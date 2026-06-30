import { describe, it, expect } from "vitest";
import { analyzeFree } from "@/lib/freeDiagnostic";

// 규칙 기반 분류(analyzeFree)의 핵심 동작 검증 — WI-08 (제출→분류).
// 길이·키워드 휴리스틱으로 4영역 점수와 4유형(explorer/preparer/transitioner/executor)을 산출한다.

// 키워드를 포함한 긴 답변(>=200자) — 모든 영역 고득점 → executor 유도
const RICH: Record<number, string> = {
  1: "나는 복잡한 상황을 차분히 정리하고 핵심을 짚어 다음 행동을 제시하는 사람이다. 어려운 개념을 쉬운 언어로 풀어 설명하고 서로 다른 의견을 연결해 합의를 만든다. 오랜 현장 경험에서 길어 올린 직관으로 사람들이 길을 잃지 않도록 돕는 일을 오래 해왔고 그 과정에서 가장 큰 보람을 느낀다. 맥락과 숫자를 함께 읽어 의사결정을 돕는 것이 내가 하는 일이다.",
  2: "가장 자랑스러웠던 순간은 무너지던 프로젝트를 다시 일으켜 끝내 성과로 연결했을 때였다. 동료들과 신뢰를 쌓아가며 함께 성장했고 끝까지 책임지는 태도로 결과를 만들어 냈다. 작은 성공들이 모여 팀 전체의 자신감이 되었던 그 장면을 지금도 또렷이 기억한다. 그때의 몰입과 보람이 지금의 나를 움직이는 원동력이다.",
  3: "가장 오래 깊이 해온 일은 흩어진 정보를 정리하고 구조를 설계해 사람들에게 쉽게 설명하는 분석과 연결의 작업이다. 십오 년 넘게 다양한 현장에서 문제를 해결하고 전략을 기획하며 이해관계를 조율해 왔다. 복잡함을 단순함으로 번역하는 일에 강점이 있다고 자부한다.",
  4: "내가 돕고 싶은 사람은 오랜 경력을 가졌지만 그 가치를 한 문장으로 정리하지 못해 답답함을 느끼는 전문가들이다. 충분한 실력과 경험이 있음에도 시장의 언어로 번역되지 않아 기회를 놓치는 분들에게 방향을 제시하고 싶다.",
  5: "그들은 종종 막막함과 불안을 느끼며 무엇부터 시작해야 할지 몰라 길을 잃는다. 경력은 쌓였는데 정작 자신을 어떻게 설명해야 할지 혼란스러워하고 전환의 문턱에서 망설인다. 나는 그 마음의 상태를 누구보다 깊이 이해한다.",
  6: "내가 다르다고 느끼는 지점은 단순히 더 잘하는 것이 아니라 경험을 구조화하는 나만의 관점과 방법론을 가지고 있다는 데 있다. 서로 동떨어져 보이는 분야를 연결해 통합된 시야를 제시하고 복잡한 맥락을 한눈에 보이도록 설계한다.",
  7: "내가 이 일을 계속하려는 이유는 사람들의 성장과 변화를 곁에서 돕는 일에서 깊은 신뢰와 보람을 느끼기 때문이다. 누군가 자신의 언어를 찾아 다시 세상 앞에 설 때의 표정이 나를 계속 움직이게 한다. 진정성 있게 동반하는 그 과정 자체가 나의 소명이다.",
};

describe("analyzeFree — 구조 계약", () => {
  it("4영역 점수·4유형·부가 섹션을 항상 반환한다", () => {
    const r = analyzeFree(RICH);
    expect(Object.keys(r.scores).sort()).toEqual(
      ["differentiation", "identity", "strengths", "target"]
    );
    expect(r.scores.identity).toBeGreaterThanOrEqual(0);
    expect(r.scores.identity).toBeLessThanOrEqual(100);
    expect(["explorer", "preparer", "transitioner", "executor"]).toContain(r.type);
    expect(r.typeInfo?.name).toBeTruthy();
    expect(r.shiningMoment.keywords).toHaveLength(2);
    expect(r.hiddenAssets).toHaveLength(3);
    expect(Object.keys(r.scoreComments)).toHaveLength(4);
  });
});

describe("analyzeFree — 유형 분류", () => {
  it("빈 답변 → 최저 구간(explorer)", () => {
    const r = analyzeFree({});
    expect(r.totalScore).toBeLessThan(40);
    expect(r.type).toBe("explorer");
  });

  it("키워드·길이가 풍부한 답변 → 최고 구간(executor)", () => {
    const r = analyzeFree(RICH);
    expect(r.totalScore).toBeGreaterThanOrEqual(80);
    expect(r.type).toBe("executor");
  });

  it("총점은 0~100 범위로 클램프된다", () => {
    const r = analyzeFree(RICH);
    expect(r.totalScore).toBeGreaterThanOrEqual(0);
    expect(r.totalScore).toBeLessThanOrEqual(100);
  });
});

describe("analyzeFree — 휴리스틱 캡(cap) 규칙", () => {
  it("타깃이 '모든 사람'이면 target 점수를 30 이하로 제한", () => {
    const r = analyzeFree({ ...RICH, 5: "나는 모든 사람을 돕고 싶다. 누구에게나 도움이 되는 사람이 되고 싶다." });
    expect(r.scores.target).toBeLessThanOrEqual(30);
  });

  it("차별점을 '모르겠'다고 하면 differentiation 점수를 20 이하로 제한", () => {
    const r = analyzeFree({ ...RICH, 6: "내 차별점이 무엇인지 잘 모르겠다. 솔직히 떠오르지 않는다." });
    expect(r.scores.differentiation).toBeLessThanOrEqual(20);
  });
});

describe("analyzeFree — 산출물 보유 점수", () => {
  it("'none' 선택은 0점", () => {
    expect(analyzeFree({}, ["none"]).outputAssetScore).toBe(0);
    expect(analyzeFree({}, []).outputAssetScore).toBe(0);
  });

  it("5종 전부 보유는 100점", () => {
    const r = analyzeFree({}, ["oneliner", "profile", "lecture", "proposal", "online"]);
    expect(r.outputAssetScore).toBe(100);
  });
});
