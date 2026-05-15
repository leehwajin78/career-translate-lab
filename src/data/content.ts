export type CategoryKey =
  | "identity"
  | "values"
  | "strength"
  | "story"
  | "target"
  | "channel"
  | "why";

export const CATEGORY_LABEL: Record<CategoryKey, string> = {
  identity: "정체성 진단",
  values: "핵심 가치",
  strength: "강점과 전문성",
  story: "브랜드 스토리",
  target: "타깃과 메시지",
  channel: "채널과 비전",
  why: "원라이너와 WHY",
};

export interface DiagnosticQuestion {
  id: number;
  category: CategoryKey;
  question: string;
  helper: string;
}

export const DIAGNOSTIC_QUESTIONS: DiagnosticQuestion[] = [
  { id: 1, category: "identity", question: "직함 없이 나를 소개한다면 어떻게 말할 수 있나요?", helper: "회사명·직위를 제외하고 ‘나는 어떤 일을 하는 사람인가’를 한두 문장으로 적어보세요." },
  { id: 2, category: "identity", question: "지금까지의 경력 중 가장 자랑스러운 순간은 무엇인가요?", helper: "한 장면을 떠올리고, 그때 무엇을 해냈는지 구체적으로 적어주세요." },
  { id: 3, category: "strength", question: "가장 오래, 가장 깊이 해온 전문 영역은 무엇인가요?", helper: "산업·기능·주제 어떤 단위든 좋습니다. 햇수와 함께 적어보세요." },
  { id: 4, category: "values", question: "중요한 선택을 할 때 반복적으로 지켜온 기준은 무엇인가요?", helper: "결정의 순간 양보하지 않은 원칙을 떠올려보세요." },
  { id: 5, category: "values", question: "내 삶과 일에서 반복해서 드러나는 태도나 가치는 무엇인가요?", helper: "주변 사람들이 자주 언급하는 단어가 있다면 함께 적어주세요." },
  { id: 6, category: "story", question: "내 경력에서 중요한 전환점이 되었던 사건은 무엇인가요?", helper: "Before–Turning–After 구조로 짧게 적어도 좋습니다." },
  { id: 7, category: "target", question: "내가 돕고 싶은 사람은 누구인가요?", helper: "직군, 연차, 상황까지 구체적일수록 진단이 선명해집니다." },
  { id: 8, category: "strength", question: "사람들이 나에게 자주 도움을 요청하는 영역은 무엇인가요?", helper: "공식 업무가 아니어도 좋습니다. 반복되는 요청을 떠올려보세요." },
  { id: 9, category: "strength", question: "내가 자연스럽게 설명하거나 해결해주는 문제는 무엇인가요?", helper: "특별한 노력 없이도 잘 풀어내는 주제를 적어주세요." },
  { id: 10, category: "story", question: "실패나 어려움에서 배운 것이 있다면 무엇인가요?", helper: "결과가 아닌 ‘얻은 관점’을 중심으로 적어주세요." },
  { id: 11, category: "target", question: "내가 가장 에너지를 얻는 고객이나 대상은 누구인가요?", helper: "함께 일할 때 시간이 빨리 가는 대상을 떠올려보세요." },
  { id: 12, category: "channel", question: "내가 가장 편하게 표현할 수 있는 채널은 무엇인가요?", helper: "글, 강연, 영상, 1:1 대화 등 가장 자연스러운 형식을 적어주세요." },
  { id: 13, category: "target", question: "내가 가장 잘 도울 수 있는 사람의 구체적인 상황은 무엇인가요?", helper: "그 사람이 처한 문제·맥락·감정을 함께 묘사해보세요." },
  { id: 14, category: "channel", question: "앞으로 나를 알리고 싶은 대표 채널은 무엇인가요?", helper: "지금 활용하지 않더라도 가고 싶은 방향을 적어주세요." },
  { id: 15, category: "why", question: "나를 한 문장으로 표현한다면 어떻게 말하고 싶나요?", helper: "완성된 카피가 아니어도 좋습니다. 키워드만 적어도 충분합니다." },
  { id: 16, category: "why", question: "내가 이 일을 계속하려는 궁극적인 이유는 무엇인가요?", helper: "돈·지위 너머의 이유를 솔직하게 적어주세요." },
];

export const PROBLEMS = [
  { title: "직함은 있지만, 직함을 벗긴 언어가 없습니다", body: "대표, 임원, 전문가, 교수, 컨설턴트라는 이름은 있지만 ‘나는 어떤 가치를 주는 사람인가’를 한 문장으로 설명하기 어렵습니다." },
  { title: "경험은 많지만, 시장이 이해할 메시지가 없습니다", body: "오랜 경력과 암묵지는 있지만 그것이 제안서, 강의안, 프로필, 콘텐츠로 변환되지 않았습니다." },
  { title: "자산은 흩어져 있고, 신뢰는 약해집니다", body: "프로필, 소개문, 제안서, 강의안, SNS가 각각 따로 만들어져 일관된 브랜드 신뢰를 만들지 못합니다." },
  { title: "혼자 하려면 멈추고, 외주를 맡기면 비어 있습니다", body: "단순 디자인 외주나 일반 코칭으로는 깊은 경력의 맥락과 시장성을 함께 구조화하기 어렵습니다." },
];

export const STAGES = [
  { stage: "Stage 1", title: "지금의 나", description: "정체성, 가치, 버팀목, 현재 인식 상태를 확인합니다.", outputs: ["정체성 baseline", "가치 후보", "브랜드 WHY 단서"] },
  { stage: "Stage 2", title: "나의 경험", description: "오랜 경험 속에 숨어 있는 전문성, 강점, 방법론, 스토리를 발굴합니다.", outputs: ["전문성 포지셔닝", "강점 포트폴리오", "방법론 후보"] },
  { stage: "Stage 3", title: "나의 방향", description: "앞으로 돕고 싶은 대상, 메시지, 비전, 원라이너 후보를 정리합니다.", outputs: ["타깃 페르소나", "핵심 메시지", "원라이너 초안"] },
  { stage: "Stage 4", title: "나의 언어", description: "세상에 나를 어떻게 말할지 브랜드 어휘, 톤, 채널 전략으로 정리합니다.", outputs: ["브랜드 어휘", "톤앤매너", "채널 전략"] },
];

export const COACHING_NOTES = [
  { after: 1, label: "1차 코칭 세션", desc: "자산 발굴과 해석" },
  { after: 3, label: "2차 코칭 세션", desc: "원라이너 확정과 브리프 방향 설계" },
];

export const DELIVERABLES = [
  { title: "브랜드 원라이너", desc: "나는 [대상]이 [문제]를 해결하도록 [방식]으로 돕는 사람이다." },
  { title: "핵심 가치 3가지", desc: "선택 기준과 실제 사례를 기반으로 도출한 가치 체계" },
  { title: "강점 명제문", desc: "타인이 인정하는 강점과 본인의 전문성을 통합한 차별화 문장" },
  { title: "타깃 페르소나", desc: "가장 잘 도울 수 있는 고객의 상황, 문제, 욕구 정의" },
  { title: "브랜드 스토리", desc: "Before–Turning–After 구조로 정리한 핵심 서사" },
  { title: "핵심 메시지", desc: "시장에 전달할 관점 전환형 메시지" },
  { title: "채널 전략", desc: "1순위 채널과 실행 빈도, 콘텐츠 방향" },
  { title: "브랜드 WHY", desc: "이 일을 계속하려는 궁극적 목적 선언문" },
];

export type PackageKey = "positioning" | "vvip";

export const PACKAGES: Record<PackageKey, {
  key: PackageKey;
  title: string;
  subtitle: string;
  bestFor: string[];
  includes: string[];
  cta: string;
  highlighted?: boolean;
}> = {
  positioning: {
    key: "positioning",
    title: "브랜드 포지셔닝 패키지",
    subtitle: "내가 누구인지 먼저 정리하는 5주 과정",
    bestFor: [
      "직함 없이 나를 설명하기 어려운 분",
      "브랜드 뼈대와 메시지를 먼저 정리하고 싶은 분",
      "프로필, 소개문, 브랜드 언어가 필요한 분",
    ],
    includes: ["마스터 브리프", "브랜드 언어 자산", "브랜드 에셋 12종", "채널 기본 세팅 가이드"],
    cta: "포지셔닝 상담 신청",
  },
  vvip: {
    key: "vvip",
    title: "VVIP 시그니처 매니지먼트",
    subtitle: "브랜드부터 강의·제안·실행까지 완성하는 8주 과정",
    bestFor: [
      "강의, 자문, 컨설팅, B2B 제안까지 연결하고 싶은 분",
      "시그니처 강의안과 제안서가 필요한 분",
      "시장 진입을 위한 첫 세트를 한 번에 완성하고 싶은 분",
    ],
    includes: [
      "Package A 전체 포함",
      "시그니처 강의안 PPT 원본",
      "B2B 강의 제안서 PDF",
      "1개월 실행 밀착 매니지먼트",
    ],
    cta: "VVIP 상담 신청",
    highlighted: true,
  },
};

export const TRUST = [
  { title: "42문항 코칭 IP", body: "단순 질문지가 아니라, 경력의 패턴을 읽고 브랜드 자산으로 변환하는 구조화된 코칭 프레임워크" },
  { title: "질문–해석–변환 프레임워크", body: "답변을 그대로 옮기는 것이 아니라, 그 안에 숨은 정체성·강점·가치·방법론을 해석합니다." },
  { title: "28년 프레젠테이션·브랜딩·교육 설계 경험", body: "강의, 제안, 메시지, 무대 경험을 실제 결과물로 연결하는 실전 디렉팅" },
  { title: "Done-for-you 코칭", body: "고객이 혼자 만들게 하지 않고, 기획·제작·실행 구조를 함께 완성합니다." },
];

export const NAV_LINKS = [
  { href: "/service", label: "서비스 소개" },
  { href: "/diagnosis", label: "진단받기" },
  { href: "#process", label: "진행 과정" },
  { href: "#deliverables", label: "결과물" },
  { href: "#packages", label: "단계별 상품" },
  { href: "/consultation", label: "상담 신청" },
];

export const PURPOSE_OPTIONS = ["강의", "자문", "컨설팅", "코칭", "콘텐츠", "출판", "창업", "기타"];
export const OUTCOME_OPTIONS = ["브랜드 프로필", "강의안", "B2B 제안서", "SNS/채널 전략", "전체 패키지"];
export const CHANNEL_OPTIONS = ["전화", "Zoom", "대면"];

export type DiagnosisType =
  | "title-dependent"
  | "experience-list"
  | "hidden-expert"
  | "market-ready";

export const TYPE_INFO: Record<DiagnosisType, { name: string; description: string }> = {
  "title-dependent": {
    name: "직함 의존형",
    description: "경력은 충분하지만, 직함을 벗긴 자기 언어가 아직 약한 상태입니다.",
  },
  "experience-list": {
    name: "경험 나열형",
    description: "많은 경험을 가지고 있지만, 하나의 메시지와 방법론으로 압축되지 않은 상태입니다.",
  },
  "hidden-expert": {
    name: "숨은 전문성형",
    description: "타인은 이미 가치를 느끼지만, 본인은 그것을 브랜드 자산으로 인식하지 못하는 상태입니다.",
  },
  "market-ready": {
    name: "시장 진입 준비형",
    description: "브랜드 언어와 방향은 어느 정도 있으나, 제안서·강의안·채널 실행 자산이 필요한 상태입니다.",
  },
};

export const FAQS = [
  {
    question: "Q1. 아직 명확한 목표가 없어도 신청할 수 있나요?",
    answer: "가능합니다. 오히려 그런 분들을 위해 50만 원의 한끗 진단을 먼저 제공합니다. 60분 인터뷰와 진단 리포트로 방향부터 함께 잡아드립니다. 실행 여부는 진단 후 결정하셔도 됩니다."
  },
  {
    question: "Q2. 이 서비스는 강사 양성 과정인가요?",
    answer: "아닙니다. 한끗프로젝트는 이미 오랜 실무 경력을 보유한 전문가가 그 경력을 시장에서 통하는 자산, 즉 프로필·강의안·제안서로 만드는 서비스입니다. 강의 스킬을 가르치는 것이 아니라, 당신만의 콘텐츠를 함께 설계합니다."
  },
  {
    question: "Q3. 퇴직 전에도 받을 수 있나요?",
    answer: "받을 수 있습니다. 오히려 퇴직 6개월~1년 전에 시작하시면 퇴직 직후부터 활동을 시작할 수 있어 가장 효과적입니다. 재직 중에는 주말·저녁 일정으로 조율 가능합니다."
  },
  {
    question: "Q4. 결과물은 어디에 활용할 수 있나요?",
    answer: "강의 제안, 자문 계약, 컨설팅 수주, 정부지원사업 강사풀 등록, 저서 출간 제안, SNS·블로그 콘텐츠 등 다양한 시장 활동에 즉시 활용 가능합니다. 산출물은 모두 편집 가능한 원본 파일로 제공됩니다."
  },
  {
    question: "Q5. 결과가 보장되나요?",
    answer: "산출물, 즉 프로필·강의안·제안서는 6주 과정 안에 완성됩니다. 다만 시장 반응과 수익은 개인 경력과 실행에 따라 차이가 있습니다. 실제 무대 연결을 원하시면 한끗 론칭 패키지에서 강의·자문 기회 탐색과 소개 연결을 별도로 지원합니다."
  }
];
