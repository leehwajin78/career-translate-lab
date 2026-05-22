import { FreeDiagnosisType, FREE_DIAGNOSIS_TYPES } from "@/data/content";

// ─── 결과 인터페이스 ────────────────────────────────

export interface FreeDiagnosticResult {
  totalScore: number;
  type: FreeDiagnosisType;
  typeInfo: { name: string; emoji: string; description: string; ctaMessage: string };

  scores: {
    identity: number;
    strengths: number;
    target: number;
    differentiation: number;
  };
  scoreComments: {
    identity: string;
    strengths: string;
    target: string;
    differentiation: string;
  };

  shiningMoment: {
    keywords: [string, string];
    description: string;
  };

  hiddenAssets: Array<{ name: string; rarity: string }>;

  naturalAuthority: {
    area: string;
    description: string;
  };

  gaps: {
    target: string;
    differentiation: string;
    message: string;
  };

  locked: {
    oneLiner: string;
    persona: string;
  };
}

// ─── 내부 헬퍼 ────────────────────────────────

const TITLE_KW = ["대표", "이사", "임원", "교수", "박사", "센터장", "본부장", "팀장", "원장", "회장", "부장", "차장", "과장"];
const VALUE_KW = ["성장", "동반", "진정성", "신뢰", "책임", "배움", "도전", "열정", "변화", "소통", "공감", "기여", "섬김"];
const STRENGTH_KW = ["정리", "설명", "분석", "해결", "연결", "설계", "코칭", "교육", "기획", "전략", "조율", "리더십"];
const TARGET_HEART_KW = ["막막", "불안", "두려", "고민", "혼란", "방향", "시작", "전환", "외로", "답답", "무기력"];
const DIFF_KW = ["다르", "독특", "유일", "관점", "경험", "방법론", "프레임", "시스템", "통합", "연결"];

function textQuality(text: string | undefined): number {
  if (!text) return 0;
  const len = text.trim().length;
  if (len === 0) return 0;
  if (len < 10) return 15;
  if (len < 30) return 35;
  if (len < 60) return 55;
  if (len < 120) return 70;
  if (len < 200) return 82;
  return 90;
}

function keywordHits(text: string | undefined, keywords: string[]): number {
  if (!text) return 0;
  return keywords.filter((k) => text.includes(k)).length;
}

function clamp(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}

function extractKeywords(text: string | undefined): string[] {
  if (!text) return [];
  const found = VALUE_KW.filter((k) => text.includes(k));
  if (found.length >= 2) return found.slice(0, 2);
  if (found.length === 1) return [found[0], "열정"];
  return ["성장", "동반"];
}

function extractStrengths(text: string | undefined): string[] {
  if (!text) return ["상황 정리 능력", "사람 연결 능력", "문제 해결 능력"];
  const found = STRENGTH_KW.filter((k) => text.includes(k));
  const base = found.length > 0 ? found.map((k) => `${k} 역량`) : [];
  const defaults = ["구조화 능력", "공감 커뮤니케이션", "문제 해결력"];
  return [...base, ...defaults].slice(0, 3);
}

// ─── 메인 분석 함수 ────────────────────────────────

export function analyzeFree(answers: Record<number, string>): FreeDiagnosticResult {
  const q1 = answers[1] ?? "";
  const q2 = answers[2] ?? "";
  const q3 = answers[3] ?? "";
  const q4 = answers[4] ?? "";
  const q5 = answers[5] ?? "";
  const q6 = answers[6] ?? "";
  const q7 = answers[7] ?? "";

  // ── 정체성 명확도 (Q1 + Q7)
  let identity = (textQuality(q1) + textQuality(q7)) / 2;
  const titleHits = keywordHits(q1, TITLE_KW);
  identity = identity - titleHits * 8;
  const valueBoost = keywordHits(q7, VALUE_KW);
  identity = identity + valueBoost * 5;
  identity = clamp(identity);

  // ── 강점 자산 인식도 (Q2 + Q3)
  let strengths = (textQuality(q2) + textQuality(q3)) / 2;
  const strengthBoost = keywordHits(q3, STRENGTH_KW);
  strengths = strengths + strengthBoost * 6;
  strengths = clamp(strengths);

  // ── 타깃 설계도 (Q4 + Q5)
  let target = (textQuality(q4) + textQuality(q5)) / 2;
  const heartHits = keywordHits(q5, TARGET_HEART_KW);
  target = target + heartHits * 8;
  if (q5.includes("모든 사람") || q5.includes("누구든") || q5.includes("다양한")) {
    target = Math.min(target, 30);
  }
  target = clamp(target);

  // ── 차별화 인식도 (Q6)
  let differentiation = textQuality(q6);
  const diffHits = keywordHits(q6, DIFF_KW);
  differentiation = differentiation + diffHits * 8;
  if (q6.includes("모르겠") || q6.includes("없") || q6.trim().length < 5) {
    differentiation = Math.min(differentiation, 20);
  }
  differentiation = clamp(differentiation);

  // ── 총점
  const totalScore = clamp(Math.round((identity + strengths + target + differentiation) / 4));

  // ── 유형 분류
  let type: FreeDiagnosisType = "preparer";
  if (totalScore < 40) type = "explorer";
  else if (totalScore < 60) type = "preparer";
  else if (totalScore < 80) type = "transitioner";
  else type = "executor";

  // ── 점수 코멘트
  const scoreComments = {
    identity: identity >= 70
      ? "직함 없이도 자기 정의가 비교적 또렷합니다"
      : identity >= 40
        ? "가치 기반 표현이 보이지만 아직 한 문장으로 정리되지 않았습니다"
        : "직함과 분리된 자기 언어가 아직 정리되지 않았습니다",
    strengths: strengths >= 70
      ? "자신의 강점을 구체적으로 인식하고 있습니다"
      : strengths >= 40
        ? "강점이 있지만 아직 구체적 자산으로 정리되지 않았습니다"
        : "강점이 막연한 수준에 머물러 있습니다",
    target: target >= 70
      ? "돕고 싶은 대상의 상황과 마음이 구체적입니다"
      : target >= 40
        ? "대상이 있지만 마음 상태까지 구체적이지 않습니다"
        : "타깃이 아직 '모든 사람' 수준에 머물러 있습니다",
    differentiation: differentiation >= 70
      ? "자신만의 차별점을 명확히 인식하고 있습니다"
      : differentiation >= 40
        ? "차별점의 단서는 있지만 언어로 정리되지 않았습니다"
        : "차별점이 아직 인식되지 않은 상태입니다",
  };

  // ── Section 2: 빛나는 순간
  const keywords = extractKeywords(q2) as [string, string];
  const shiningMoment = {
    keywords,
    description: `당신의 자랑스러운 순간들을 분석한 결과, '${keywords[0]}'과(와) '${keywords[1]}'이(가) 공통적으로 나타났습니다. 이것은 당신이 가장 에너지를 느끼는 순간의 핵심 가치이며, 브랜드의 근간이 됩니다.`,
  };

  // ── Section 3: 숨겨진 자산
  const strengthNames = extractStrengths(q3);
  const hiddenAssets = strengthNames.map((name) => ({
    name,
    rarity: `이 역량은 경력자에게도 흔하지 않은 희귀 자산입니다`,
  }));

  // ── Section 4: 자연 권위
  const authorityArea = q4.trim().length > 0 ? q4.trim().slice(0, 50) : "경력 기반 전문 영역";
  const naturalAuthority = {
    area: authorityArea,
    description: `사람들이 이미 당신에게 '${authorityArea.slice(0, 20)}' 관련 도움을 구하고 있습니다. 이것은 시장이 인정하는 자연 권위 영역이며, 브랜드 포지셔닝의 출발점입니다.`,
  };

  // ── Section 5: 갭
  const gaps = {
    target: target < 60
      ? "당신이 도우려는 사람이 아직 흐릿합니다. 구체적인 마음 상태와 상황을 정의해야 메시지가 정확하게 닿습니다."
      : "타깃의 윤곽은 보이지만, 시장에서 통하는 언어로 번역되지 않았습니다.",
    differentiation: differentiation < 60
      ? "차별점이 있지만 언어가 없습니다. '더 잘한다'가 아닌 '다르다'를 표현할 문장이 필요합니다."
      : "차별점의 단서는 있으나, 고객이 즉시 이해할 한 줄 표현이 아직 없습니다.",
    message: q7.trim().length < 20
      ? "전하고 싶은 것은 있지만 한 문장이 아닙니다. 핵심 메시지가 정리되면 모든 자산이 하나로 연결됩니다."
      : "메시지의 방향은 있으나, 시장이 기억하는 한 문장으로 압축되지 않았습니다.",
  };

  // ── Section 6~7: 잠금 (블러용 더미)
  const locked = {
    oneLiner: `나는 [${authorityArea.slice(0, 15)}]에서 [마음 상태형 타깃]이 [핵심 문제]를 해결하도록 [${strengthNames[0]}](으)로 돕는 사람이다. 이 문장은 당신의 7가지 답변에서 추출한 브랜드 원라이너 초안입니다. 한끗 코칭에서 시장이 기억하는 최종 문장으로 완성됩니다.`,
    persona: `이상적 고객 페르소나: ${q5.trim().length > 10 ? q5.trim().slice(0, 80) : "능력은 있지만 방향이 보이지 않는 전문가"}. 이 고객은 당신의 경험에서 가장 큰 가치를 느끼는 사람이며, 한끗 코칭에서 구체적인 접근 전략과 함께 완성됩니다.`,
  };

  return {
    totalScore,
    type,
    typeInfo: FREE_DIAGNOSIS_TYPES[type],
    scores: { identity, strengths, target, differentiation },
    scoreComments,
    shiningMoment,
    hiddenAssets,
    naturalAuthority,
    gaps,
    locked,
  };
}
