import { QuestionAnswer, AIDraft } from "@/store/coachingStore";
import { COACHING_QUESTIONS } from "@/data/coachingQuestions";

/**
 * 42문항 답변을 받아 분석을 실행합니다.
 * NEXT_PUBLIC_ANTHROPIC_API_KEY가 설정되어 있으면 Claude 3.5 Sonnet API를 호출하고,
 * 설정되어 있지 않거나 호출에 실패하면 로컬 하이브리드 Mock 분석기를 구동합니다.
 */
export async function analyzeCoachingAnswers(
  memberName: string,
  answers: Record<number, QuestionAnswer>
): Promise<AIDraft> {
  const apiKey = process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY;

  if (apiKey && apiKey.trim() !== "") {
    try {
      return await callClaudeAPI(memberName, answers, apiKey);
    } catch (error) {
      console.warn("Claude API 호출에 실패하여 로컬 Mock 분석기를 실행합니다.", error);
      return localMockAnalyze(memberName, answers);
    }
  }

  // API Key가 없으면 기본적으로 로컬 Mock 분석기 구동
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(localMockAnalyze(memberName, answers));
    }, 2500); // 사용자 대기 시각 효과를 위해 약간의 지연 부여
  });
}

/**
 * Claude 3.5 Sonnet API 직접 호출
 */
async function callClaudeAPI(
  memberName: string,
  answers: Record<number, QuestionAnswer>,
  apiKey: string
): Promise<AIDraft> {
  const promptAnswers = Object.entries(answers)
    .map(([qId, ans]) => {
      const q = COACHING_QUESTIONS.find((qi) => qi.id === Number(qId));
      return `[질문 ${qId}] ${q?.question ?? ""}\n[회원 답변] ${ans.text || "(음성 녹음 제출됨)"}`;
    })
    .join("\n\n");

  const systemPrompt = `당신은 5060 중장년 전문가를 위한 '나다운 브랜딩' 전문 코치입니다.
아래의 42문항 답변 목록을 바탕으로, 회원의 강점, 가치관, 경험을 심층 분석하여 8대 브랜드 프로필과 질문별 1차 인사이트를 도출해주세요.

분석 결과는반드시 다음의 JSON 형식을 정확하게 지켜 반환해야 합니다. 다른 서론이나 설명 없이 오직 JSON만 반환하세요:
{
  "brandProfile": {
    "oneLiner": "나는 [대상]이 [문제]를 해결하도록 [방식]으로 돕는 사람이다 형식의 브랜드 원라이너 초안 문장",
    "coreValues": ["핵심가치단어1", "핵심가치단어2", "핵심가치단어3"],
    "strengthStatement": "회원의 10~20년 내공이 담긴 차별화된 역량 및 강점 명제문 (한두 문장)",
    "targetPersona": "회원의 경험이 가장 가치 있게 쓰일 이상적인 핵심 타깃 고객층 정의",
    "brandStory": "회원의 경력 속 위기와 전환점을 극복한 이야기를 요약한 브랜드 스토리 에센스",
    "coreMessage": "회원이 세상과 타깃 고객에게 전하고 싶은 가장 울림 있는 한 문장",
    "channelStrategy": "1순위 및 2순위 추천 표현 채널 및 지식 상품 형태 전략",
    "brandWhy": "회원이 브랜딩을 통해 실현하고자 하는 궁극적 목적 및 레거시"
  },
  "questionInsights": [
    {
      "questionId": 1,
      "matchedPattern": "직함/역할만 말함 | 가치관/태도로 말함 | 침묵함 | 타인 시각으로 말함 중 매칭되는 패턴명",
      "brandingSignal": "답변에서 드러나는 내면적 브랜딩 신호와 상태 분석",
      "coachingMessage": "코치가 회원을 대면했을 때 사용할 수 있는 공감 어린 인사이트 및 추천 코칭 발언",
      "profileConnection": "이 질문이 어떤 브랜드 요소(예: 브랜드 정체성)로 반영 및 확장되는지 설명"
    },
    ... 42개 질문에 대한 배열 완성
  ]
}

주의사항:
1. 회원은 5060 중장년 경력자입니다. 어설픈 조언이나 훈계 톤을 지양하고, 깊은 격조와 전문적인 언어(SCDream 폰트에 맞는 격조 높은 어휘)를 사용하세요.
2. 답변 중 'AI', '결제하기', '즉시 시작' 등 금지 어휘가 응답 결과에 노출되지 않도록 주의하세요.
3. 42개 질문 전체(1~42)에 대한 questionInsights 항목이 JSON 배열에 하나씩 빠짐없이 포함되어야 합니다.`;

  const userPrompt = `분석 대상 회원 이름: ${memberName}\n\n[회원 답변 데이터]\n${promptAnswers}`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "dangerously-allow-html-user-aspect-ratio": "true", // 브라우저 direct 호출을 위한 헤더 (CORS 제약이 있을 수 있음)
    } as any,
    body: JSON.stringify({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 4000,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    }),
  });

  if (!response.ok) {
    throw new Error(`Claude API request failed with status ${response.status}`);
  }

  const result = await response.json();
  const text = result.content[0].text;

  // JSON 파싱 시도
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0]) as AIDraft;
  }
  
  return JSON.parse(text) as AIDraft;
}

/**
 * 42문항 답변을 읽고 dynamically 격조 높은 브랜드 리포트를 완성해 주는
 * 룰 기반 + 스마트 템플릿 하이브리드 로컬 분석기
 */
function localMockAnalyze(
  memberName: string,
  answers: Record<number, QuestionAnswer>
): AIDraft {
  // 답변 텍스트 취합
  const getAnsText = (id: number) => answers[id]?.text?.trim() || "";

  // 1. 핵심 키워드 추출 (답변 분석을 통해 맞춤 키워드 조립)
  const allText = Object.values(answers)
    .map((a) => a.text)
    .join(" ");

  // 핵심 가치 후보 매칭
  const valuePool = [
    { key: "진정성(Authenticity)", words: ["진정", "진실", "솔직", "신뢰", "정직"] },
    { key: "성장(Growth)", words: ["성장", "배움", "공부", "학습", "발전", "나아"] },
    { key: "연결(Connection)", words: ["연결", "관계", "소통", "사람", "공감", "만남"] },
    { key: "전문성(Mastery)", words: ["전문", "경력", "일", "마스터", "직업", "내공", "노하우"] },
    { key: "공헌(Contribution)", words: ["기여", "공헌", "도움", "나눔", "베풂", "사회"] },
    { key: "자유(Freedom)", words: ["자유", "내 삶", "독립", "주도", "스스로"] },
  ];

  const detectedValues = valuePool
    .map((v) => {
      const count = v.words.reduce(
        (acc, w) => acc + (allText.split(w).length - 1),
        0
      );
      return { key: v.key, count };
    })
    .sort((a, b) => b.count - a.count);

  // 상위 3가지 가치 선별 (최소한 3개 기본 가치 보장)
  const coreValues = [
    detectedValues[0]?.key || "진정성(Authenticity)",
    detectedValues[1]?.key || "성장(Growth)",
    detectedValues[2]?.key || "연결(Connection)",
  ].map((v) => v.split("(")[0]); // 영문명 제외하고 한글만 정제

  // 2. 분야(마스터리) 추출 (Q4, Q11 기반)
  const fieldAns = getAnsText(4) || getAnsText(11) || "인생과 커리어";
  let detectedField = "경험과 지식";
  const fields = [
    { name: "비즈니스 및 경영", keywords: ["경영", "마케팅", "회사", "사업", "관리", "세일즈"] },
    { name: "교육 및 코칭", keywords: ["교육", "가르침", "코칭", "상담", "티칭", "학교", "강사"] },
    { name: "인사 및 조직관리", keywords: ["인사", "HR", "조직", "사람관리", "채용", "리더십"] },
    { name: "엔지니어링 및 기술", keywords: ["개발", "기술", "엔지니어", "IT", "설계", "생산"] },
    { name: "재무 및 금융", keywords: ["재무", "금융", "회계", "돈", "자산", "투자"] },
    { name: "예술 및 디자인", keywords: ["예술", "미술", "디자인", "기획", "글쓰기", "창작"] },
  ];
  for (const f of fields) {
    if (f.keywords.some((kw) => fieldAns.includes(kw))) {
      detectedField = f.name;
      break;
    }
  }

  // 3. 타깃 고객 추출 (Q9, Q26, Q33 기반)
  const targetAns = getAnsText(9) || getAnsText(26) || getAnsText(33) || "방황하는 후배들";
  let targetDesc = "새로운 커리어 전환기에서 어려움을 겪고 있는 3040 직장인 및 후배 전문가";
  if (targetAns.includes("청년") || targetAns.includes("대학생")) {
    targetDesc = "사회 초년생으로서 진로 설정과 자립에 고민이 깊은 2030 청년 세대";
  } else if (targetAns.includes("여성") || targetAns.includes("엄마")) {
    targetDesc = "경력 단절을 극복하고 다시 한 번 세상에 자신의 가치를 펼치고자 하는 여성 인재";
  } else if (targetAns.includes("은퇴") || targetAns.includes("50") || targetAns.includes("중장년")) {
    targetDesc = "퇴직 후 인생 2막을 준비하며 평생 현역으로 살아갈 무기를 찾는 5060 중장년 세대";
  }

  // 4. 브랜드 원라이너 완성 (나는 [대상]이 [문제]를 해결하도록 [방식]으로 돕는 사람이다)
  const customOneLiner = `나는 ${targetDesc.split("로서")[0].split("세대")[0].trim()}들이 자신만의 경험을 바탕으로 브랜딩 로드맵을 구축할 수 있도록 1:1 밀착 코칭과 실전 노하우 전수 방식으로 돕는 사람이다.`;

  // 5. 8대 브랜드 프로필 작성
  const brandProfile = {
    oneLiner: customOneLiner,
    coreValues: coreValues,
    strengthStatement: `${memberName}님은 수십 년간 쌓아온 ${detectedField} 분야의 현장 경험과 삶의 위기를 기회로 극복해 낸 회복 탄력성을 지니고 있습니다. 복잡한 이론에 그치지 않고 상대방의 내면 강점을 짚어 실천적 대안을 이끌어 내는 능력이 탁월합니다.`,
    targetPersona: targetDesc,
    brandStory: `오랜 세월 동안 조직과 일에 헌신하며 겪었던 영광과 크고 작은 위기(전환점)를 온몸으로 통과했습니다. 그 과정에서 얻은 가장 큰 배움은 '나의 성공 자체보다 타인의 성장을 돕고 함께 연결될 때 진짜 나다운 빛이 난다'는 깨달음이었습니다. 이 강력한 스토리가 브랜드의 단단한 시그니처 뼈대가 됩니다.`,
    coreMessage: `"당신이 살아내어 이뤄낸 수십 년의 시간은 절대 사라지지 않습니다. 그것은 누군가의 막막한 길을 비추는 가장 선명한 지도가 될 것입니다."`,
    channelStrategy: `1순위: 내면의 깊은 울림과 정돈을 돕는 '1:1 브랜딩 코칭 및 전문 컨설팅'\n2순위: 노하우를 체계적으로 전수하는 '소규모 그룹 워크숍' 및 가독성 높은 텍스트 채널(브런치/블로그) 필진 참여`,
    brandWhy: `단순한 명함 속 직함을 넘어, 내면의 참된 가치와 고유한 강점을 연결함으로써 나이와 환경에 구애받지 않고 평생 주체적인 삶을 살아가도록 돕기 위함입니다.`,
  };

  // 6. 42문항 질문별 1차 인사이트 자동 생성 (코칭 가이드 규칙 준수)
  const questionInsights = COACHING_QUESTIONS.map((q) => {
    const ansText = getAnsText(q.id);
    const hasAns = ansText.length > 0;

    // 대표 질문별 특화 룰 매핑
    let matchedPattern = "가치관·태도로 말함";
    let brandingSignal = "내면의 정체성 의식이 이미 상당 부분 정돈되어 있습니다.";
    let coachingMessage = `회원의 깊이 있는 성찰이 돋보입니다. "${ansText.substring(0, 15)}..."라는 말씀에서 오랫동안 삶을 진지하게 대면해 오신 깊이가 전달됩니다. 코칭 인터뷰 시 이 부분을 좀 더 조명해 주세요.`;
    let profileConnection = "브랜드 정체성 형성의 기반 자료로 활용됩니다.";

    if (!hasAns) {
      matchedPattern = "답변 없음";
      brandingSignal = "해당 질문에 대한 탐색이 진행되지 않았습니다.";
      coachingMessage = "인터뷰 중 가벼운 대화로 풀어가며 해당 영역의 키워드를 말로 이끌어내 보세요.";
      profileConnection = "프로필 보강 시 참고 자료가 됩니다.";
    } else {
      switch (q.id) {
        case 1:
          if (ansText.includes("팀장") || ansText.includes("대표") || ansText.includes("직장") || ansText.includes("매니저")) {
            matchedPattern = "직함·역할만 말함";
            brandingSignal = "외부 직함에 의존한 정체성. 브랜딩 공백이 존재할 수 있음.";
            coachingMessage = `"지금 하시는 일 말고, 그 일을 하는 당신은 어떤 사람인가요? 직함이 사라져도 끝까지 남는 당신다움의 핵심을 이번 기회에 함께 찾아봅시다."`;
          } else {
            matchedPattern = "가치관·태도로 말함";
            brandingSignal = "내면 정체성 의식이 이미 형성되어 브랜드 언어 구체화 단계로 즉시 진입 가능.";
            coachingMessage = `"방금 하신 소개 말씀 중 딱 하나, '이것만큼은 나다' 싶은 단어를 하나만 집어보시겠어요? 그것이 바로 브랜드의 진정한 씨앗 단어입니다."`;
          }
          profileConnection = "브랜드 원라이너 ① '나는 누구인가'의 핵심 토대입니다.";
          break;
        case 2:
          if (ansText.includes("도움") || ansText.includes("연결") || ansText.includes("사람") || ansText.includes("기여")) {
            matchedPattern = "타인을 도운 순간";
            brandingSignal = "기여·연결 가치관이 핵심. 서비스 및 코칭 브랜드 방향에 강력 부합.";
            coachingMessage = `"그 순간 그 사람이 어떻게 달라졌는지 보셨을 때, 김지영님 안에 올라온 벅찬 감정이 바로 당신 브랜드의 가장 강력한 엔진입니다."`;
          } else {
            matchedPattern = "외적 성과 중심";
            brandingSignal = "가치 인식이 결과에 집중됨. 과정 속에 담긴 가치관 발굴 필요.";
            coachingMessage = `"대단한 성과입니다! 그 찬란한 결과를 만드는 치열한 과정 속에서, 당신이 '가장 나답다'고 전율을 느꼈던 찰나의 순간은 언제였나요?"`;
          }
          profileConnection = "브랜드 핵심 가치 3가지 선정의 주재료가 됩니다.";
          break;
        case 3:
          matchedPattern = "위기 극복 자산 보유";
          brandingSignal = "중장년 전문가로서 2030 세대가 결코 모방할 수 없는 인생 신뢰 자산.";
          coachingMessage = `"그 모진 세월과 고비를 버틴 것은 당연한 일이 아닙니다. 포기 대신 그것을 버텨낸 당신 안의 힘, 그 노하우가 바로 타인에게 등불이 되는 강점입니다."`;
          profileConnection = "브랜드 스토리 '위기와 전환점' 카테고리에 반영됩니다.";
          break;
        case 4:
          matchedPattern = "시간과 내공의 마스터리";
          brandingSignal = "수만 시간에 달하는 묵직한 시간적 전문성을 입증하는 강력한 브랜딩 축.";
          coachingMessage = `"오랫동안 그 일을 해오며 몸에 밴 감각은 무엇인가요? 지루하게 느꼈던 매일의 반복이 사실은 당신만의 범접할 수 없는 고유한 노하우입니다."`;
          profileConnection = "전문가 포지셔닝 및 USP(독점 강점) 설계의 근거가 됩니다.";
          break;
        case 6:
          matchedPattern = "일관된 의사결정 원칙";
          brandingSignal = "의사결정 이면에 내재된 삶의 명확한 가치 우선순위 포착.";
          coachingMessage = `"중요한 길목마다 내렸던 선택의 공통분모가 있네요. 그것을 하나의 문장으로 명문화해 두면 고객들에게 더 큰 신뢰를 주는 약속이 됩니다."`;
          profileConnection = "브랜드 가치 선언문 작성의 기준이 됩니다.";
          break;
        case 9:
          matchedPattern = "타깃 페르소나의 단서";
          brandingSignal = "내가 돕고 싶은 대상이 뚜렷하게 관찰됨.";
          coachingMessage = `"내가 이미 지나쳐 온 어두운 터널 속을 지금 걷고 있는 사람, 즉 '과거의 나'를 타깃으로 할 때 가장 뜨거운 진정성이 발휘됩니다."`;
          profileConnection = "이상적 타깃 페르소나 및 메시지 방향 설정에 연결됩니다.";
          break;
        case 10:
          matchedPattern = "울림 있는 핵심 메시지";
          brandingSignal = "세상을 향해 던지고 싶은 나만의 철학이 함축됨.";
          coachingMessage = `"그 짧은 한 마디가 바로 당신 브랜드의 심장이자, 사람들의 마음을 움직일 강렬한 한 끗의 메시지입니다."`;
          profileConnection = "브랜드 슬로건 및 핵심 메시지 도출의 원천이 됩니다.";
          break;
        default:
          // 기타 질문들은 각 파트에 따른 공통 해석 부여
          if (q.id <= 10) {
            profileConnection = "PART 1. 삶의 궤적 및 과거 내면 자산 매핑";
          } else if (q.id <= 22) {
            profileConnection = "PART 2. 현재 보유한 강점과 차별화 자산 매핑";
          } else if (q.id <= 32) {
            profileConnection = "PART 3. 미래 가치 지향점 및 채널 적합성 매핑";
          } else {
            profileConnection = "PART 4. 최종 브랜드 프로필을 위한 언어 번역 매핑";
          }
          break;
      }
    }

    return {
      questionId: q.id,
      matchedPattern,
      brandingSignal,
      coachingMessage,
      profileConnection,
    };
  });

  return {
    brandProfile,
    questionInsights,
  };
}
