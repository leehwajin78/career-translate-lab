import {
  CATEGORY_LABEL,
  CategoryKey,
  DIAGNOSTIC_QUESTIONS,
  DiagnosisType,
  PACKAGES,
  PackageKey,
  TYPE_INFO,
} from "@/data/content";

export interface DiagnosticAnswers {
  [questionId: number]: string;
}

export interface ContactInfo {
  name: string;
  phone: string;
  email: string;
  field: string;
}

export type DimensionKey =
  | "identityLanguage"
  | "coreValues"
  | "expertisePositioning"
  | "targetClarity"
  | "marketAssets";

export interface DimensionResult {
  key: DimensionKey;
  label: string;
  score: number; // 0-100
  status: string;
  risk: string;
  nextStep: string;
}

export interface DiagnosticResult {
  totalScore: number;
  type: DiagnosisType;
  typeInfo: { name: string; description: string };
  dimensions: DimensionResult[];
  recommendedPackage: PackageKey;
  recommendationReason: string;
  oneLine: string;
}

const TITLE_KEYWORDS = ["대표", "이사", "임원", "교수", "박사", "센터장", "본부장", "팀장", "원장", "회장"];
const VALUE_KEYWORDS = ["원칙", "기준", "정직", "신뢰", "성장", "사람", "본질", "지속", "책임", "진정성"];
const TARGET_KEYWORDS = ["대표", "임원", "창업", "리더", "5060", "여성", "전문가", "팀", "조직", "스타트업"];
const STORY_KEYWORDS = ["전환", "실패", "배움", "계기", "변화", "위기", "결정", "선택"];

function answerQuality(text: string | undefined): number {
  if (!text) return 0;
  const len = text.trim().length;
  if (len === 0) return 0;
  if (len < 15) return 25;
  if (len < 40) return 50;
  if (len < 100) return 75;
  return 90;
}

function keywordBoost(text: string | undefined, keywords: string[]): number {
  if (!text) return 0;
  const hits = keywords.filter((k) => text.includes(k)).length;
  return Math.min(hits * 8, 20);
}

function titlePenalty(text: string | undefined): number {
  if (!text) return 0;
  const hits = TITLE_KEYWORDS.filter((k) => text.includes(k)).length;
  return Math.min(hits * 6, 18);
}

function avgByCategory(answers: DiagnosticAnswers, cat: CategoryKey): number {
  const qs = DIAGNOSTIC_QUESTIONS.filter((q) => q.category === cat);
  if (qs.length === 0) return 0;
  const sum = qs.reduce((acc, q) => acc + answerQuality(answers[q.id]), 0);
  return sum / qs.length;
}

function clamp(n: number) {
  return Math.max(0, Math.min(100, Math.round(n)));
}

export function analyze(answers: DiagnosticAnswers): DiagnosticResult {
  const identityBase = avgByCategory(answers, "identity");
  const valuesBase = avgByCategory(answers, "values");
  const strengthBase = avgByCategory(answers, "strength");
  const storyBase = avgByCategory(answers, "story");
  const targetBase = avgByCategory(answers, "target");
  const channelBase = avgByCategory(answers, "channel");
  const whyBase = avgByCategory(answers, "why");

  // Identity language: penalize over-reliance on titles in Q1, Q15
  const identity = clamp(
    identityBase + keywordBoost(answers[15], VALUE_KEYWORDS) - titlePenalty(answers[1])
  );
  const values = clamp(valuesBase + keywordBoost(answers[4], VALUE_KEYWORDS) + keywordBoost(answers[5], VALUE_KEYWORDS) / 2);
  const expertise = clamp(strengthBase + keywordBoost(answers[3], ["년", "10", "15", "20", "25"]));
  const target = clamp(targetBase + keywordBoost(answers[7], TARGET_KEYWORDS) + keywordBoost(answers[13], TARGET_KEYWORDS) / 2);
  const market = clamp((channelBase + storyBase + whyBase) / 3 + keywordBoost(answers[10], STORY_KEYWORDS));

  const total = clamp((identity + values + expertise + target + market) / 5);

  // Type
  let type: DiagnosisType = "market-ready";
  if (identity < 50) type = "title-dependent";
  else if (expertise > 70 && (values < 55 || identity < 60)) type = "experience-list";
  else if (target > 70 && identity < 70) type = "hidden-expert";
  else if (total >= 65) type = "market-ready";
  else type = "experience-list";

  const dimensions: DimensionResult[] = [
    {
      key: "identityLanguage",
      label: "정체성 언어",
      score: identity,
      status: identity >= 70 ? "직함 없이도 자기 정의가 비교적 또렷합니다." : "직함과 분리된 자기 언어가 아직 정리되지 않았습니다.",
      risk: "소개·프로필·미팅 첫 30초에서 신뢰 형성이 약해질 수 있습니다.",
      nextStep: "원라이너 초안을 만들고, 직함 없는 자기 정의 문장을 우선 정리합니다.",
    },
    {
      key: "coreValues",
      label: "핵심 가치",
      score: values,
      status: values >= 70 ? "선택 기준과 가치가 일관되게 드러납니다." : "가치가 단어 수준에서 머물러 의사결정 기준으로 보이지 않습니다.",
      risk: "왜 이 사람을 선택해야 하는가에 대한 차별점이 약해집니다.",
      nextStep: "실제 선택 사례를 기반으로 핵심 가치 3가지를 도출합니다.",
    },
    {
      key: "expertisePositioning",
      label: "전문성 포지셔닝",
      score: expertise,
      status: expertise >= 70 ? "전문 영역과 깊이가 분명합니다." : "전문성이 산업·기능 키워드 수준으로 흩어져 있습니다.",
      risk: "강의·자문·제안 자리에서 ‘무엇을 하는 사람인가’가 흐려집니다.",
      nextStep: "강점 명제문과 방법론 후보를 한 페이지로 정리합니다.",
    },
    {
      key: "targetClarity",
      label: "타깃 명확도",
      score: target,
      status: target >= 70 ? "돕고 싶은 대상의 상황과 문제가 구체적입니다." : "타깃이 ‘많은 사람’ 또는 ‘일반’ 수준에 머물러 있습니다.",
      risk: "메시지가 누구에게도 정확히 가닿지 않습니다.",
      nextStep: "가장 잘 도울 수 있는 한 명의 페르소나를 먼저 정의합니다.",
    },
    {
      key: "marketAssets",
      label: "시장 진입 자산",
      score: market,
      status: market >= 70 ? "채널·스토리·WHY가 어느 정도 정렬되어 있습니다." : "프로필·강의안·제안서가 분리되어 있어 자산화되지 않았습니다.",
      risk: "기회는 오는데 ‘보낼 자료’가 없는 상태가 반복됩니다.",
      nextStep: "프로필–강의안–제안서를 하나의 메시지 체계로 묶습니다.",
    },
  ];

  // Package recommendation
  const identityWeak = identity < 60 || values < 55;
  const recommendedPackage: PackageKey = identityWeak || total < 65 ? "positioning" : "vvip";
  const recommendationReason = recommendedPackage === "positioning"
    ? "정체성 언어와 가치 체계가 먼저 정리되어야 강의·제안 자산이 흔들리지 않습니다. 5주 포지셔닝 과정을 우선 권장합니다."
    : "브랜드 언어 토대가 마련되어 있어, 강의안·제안서·실행 자산까지 한 번에 완성하는 8주 시그니처 매니지먼트가 적합합니다.";

  const oneLine = (() => {
    if (total >= 80) return "지금 시장에 선보일 만한 자산이 가까이 와 있습니다.";
    if (total >= 65) return "방향은 보입니다. 자산화와 실행 구조가 다음 과제입니다.";
    if (total >= 50) return "재료는 충분합니다. 해석과 번역의 단계가 필요합니다.";
    return "경력 자체가 약한 것이 아니라, 아직 브랜드 언어로 번역되지 않았습니다.";
  })();

  return {
    totalScore: total,
    type,
    typeInfo: TYPE_INFO[type],
    dimensions,
    recommendedPackage,
    recommendationReason,
    oneLine,
  };
}

export function categoryLabel(cat: CategoryKey) {
  return CATEGORY_LABEL[cat];
}

export function packageInfo(key: PackageKey) {
  return PACKAGES[key];
}
