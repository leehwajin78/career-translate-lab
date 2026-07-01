import 'server-only'
import Anthropic from '@anthropic-ai/sdk'
import { COACHING_QUESTIONS } from '@/data/coachingQuestions'

/* =============================================================
 * WI-10 — 코칭 AI 자동 초안 (서버 전용)
 *
 * 서버에서만 실행된다('server-only'). 브라우저에서 API 키가 노출되던
 * 구버전(NEXT_PUBLIC_ANTHROPIC_API_KEY, 클라이언트 fetch)을 대체.
 *
 *  - ANTHROPIC_API_KEY(서버 전용)가 있으면 claude-opus-4-8 로 8대 브랜드
 *    프로필을 강제 tool_use(구조화 JSON)로 생성.
 *  - 키가 없거나 호출 실패 시 로컬 규칙기반 Mock 분석기로 폴백(무료·결정적).
 *  - 42문항별 인사이트(questionInsights)는 규칙기반 휴리스틱으로 즉시 생성
 *    (LLM 비용·지연을 브랜드 프로필 합성에만 집중).
 * ============================================================= */

export interface BrandProfileDraft {
  oneLiner: string
  coreValues: string[]
  strengthStatement: string
  targetPersona: string
  brandStory: string
  coreMessage: string
  channelStrategy: string
  brandWhy: string
}
export interface QuestionInsight {
  questionId: number
  matchedPattern: string
  brandingSignal: string
  coachingMessage: string
  profileConnection: string
}
export interface AIDraft {
  brandProfile: BrandProfileDraft
  questionInsights: QuestionInsight[]
}
type Answers = Record<number, { text: string }>

export const AI_MODEL = 'claude-opus-4-8'

/** 42문항 답변 → AI 초안(brandProfile) + 규칙기반 questionInsights */
export async function analyzeCoachingAnswers(
  memberName: string,
  answers: Answers,
): Promise<AIDraft> {
  const fallback = localMockAnalyze(memberName, answers)

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey || apiKey.trim() === '') return fallback

  try {
    const brandProfile = await generateBrandProfile(memberName, answers, apiKey)
    return { brandProfile, questionInsights: fallback.questionInsights }
  } catch (err) {
    console.error('[coachingAI] Claude 호출 실패 → 로컬 Mock 폴백', err)
    return fallback
  }
}

/* ── Claude(claude-opus-4-8) — 강제 tool_use 로 구조화 JSON 확보 ────── */
const SYSTEM_PROMPT = `당신은 5060 중장년 전문가를 위한 '나다운 브랜딩' 전문 코치입니다.
회원의 42문항 답변을 바탕으로 강점·가치관·경험을 심층 분석해 8대 브랜드 프로필을 도출하고,
반드시 save_brand_profile 도구를 호출해 결과를 저장하세요.
- 회원은 5060 경력자입니다. 훈계조를 지양하고 격조 있는 전문 어휘를 사용하세요.
- oneLiner는 "나는 [대상]이 [문제]를 [방식]으로 돕는 사람이다" 형식의 한 문장.
- coreValues는 핵심 가치 3개(짧은 단어/구).
- 'AI', '결제하기', '즉시 시작' 등 금지 어휘를 결과에 노출하지 마세요.`

async function generateBrandProfile(
  memberName: string,
  answers: Answers,
  apiKey: string,
): Promise<BrandProfileDraft> {
  const client = new Anthropic({ apiKey })

  const promptAnswers = Object.entries(answers)
    .map(([id, a]) => {
      const q = COACHING_QUESTIONS.find((qi) => qi.id === Number(id))
      return `[Q${id}] ${q?.question ?? ''}\n답변: ${a.text?.trim() || '(무응답)'}`
    })
    .join('\n\n')

  const message = await client.messages.create({
    model: AI_MODEL,
    max_tokens: 2000,
    system: SYSTEM_PROMPT,
    tools: [
      {
        name: 'save_brand_profile',
        description: '분석 결과를 8대 브랜드 프로필로 저장한다.',
        input_schema: {
          type: 'object',
          properties: {
            oneLiner: { type: 'string' },
            coreValues: { type: 'array', items: { type: 'string' } },
            strengthStatement: { type: 'string' },
            targetPersona: { type: 'string' },
            brandStory: { type: 'string' },
            coreMessage: { type: 'string' },
            channelStrategy: { type: 'string' },
            brandWhy: { type: 'string' },
          },
          required: [
            'oneLiner', 'coreValues', 'strengthStatement', 'targetPersona',
            'brandStory', 'coreMessage', 'channelStrategy', 'brandWhy',
          ],
          additionalProperties: false,
        },
      },
    ],
    tool_choice: { type: 'tool', name: 'save_brand_profile' },
    messages: [{ role: 'user', content: `분석 대상 회원: ${memberName}\n\n[회원 답변]\n${promptAnswers}` }],
  })

  const block = message.content.find((b) => b.type === 'tool_use')
  if (!block || block.type !== 'tool_use') {
    throw new Error('brand profile tool_use block 누락')
  }
  const bp = block.input as Partial<BrandProfileDraft>
  return {
    oneLiner: String(bp.oneLiner ?? ''),
    coreValues: Array.isArray(bp.coreValues) ? bp.coreValues.map(String).filter(Boolean) : [],
    strengthStatement: String(bp.strengthStatement ?? ''),
    targetPersona: String(bp.targetPersona ?? ''),
    brandStory: String(bp.brandStory ?? ''),
    coreMessage: String(bp.coreMessage ?? ''),
    channelStrategy: String(bp.channelStrategy ?? ''),
    brandWhy: String(bp.brandWhy ?? ''),
  }
}

/* ── 로컬 규칙기반 Mock 분석기 (키 없음/실패 시 폴백) ──────────────── */
const VALUE_POOL = [
  { key: '진정성', words: ['진정', '진실', '솔직', '신뢰', '정직'] },
  { key: '성장', words: ['성장', '배움', '공부', '학습', '발전', '나아'] },
  { key: '연결', words: ['연결', '관계', '소통', '사람', '공감', '만남'] },
  { key: '전문성', words: ['전문', '경력', '일', '마스터', '직업', '내공', '노하우'] },
  { key: '공헌', words: ['기여', '공헌', '도움', '나눔', '베풂', '사회'] },
  { key: '자유', words: ['자유', '내 삶', '독립', '주도', '스스로'] },
]

function localMockAnalyze(memberName: string, answers: Answers): AIDraft {
  const getAnsText = (id: number) => answers[id]?.text?.trim() || ''
  const allText = Object.values(answers).map((a) => a.text || '').join(' ')

  const coreValues = VALUE_POOL
    .map((v) => ({ key: v.key, count: v.words.reduce((acc, w) => acc + (allText.split(w).length - 1), 0) }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3)
    .map((v, i) => v.count > 0 ? v.key : ['진정성', '성장', '연결'][i])

  const targetAns = getAnsText(9) || getAnsText(26) || getAnsText(33)
  let targetPersona = '새로운 커리어 전환기에서 어려움을 겪는 3040 후배 전문가'
  if (targetAns.includes('청년') || targetAns.includes('대학생')) targetPersona = '진로와 자립을 고민하는 2030 청년 세대'
  else if (targetAns.includes('여성') || targetAns.includes('엄마')) targetPersona = '경력 단절을 극복하고 다시 가치를 펼치려는 여성 인재'
  else if (targetAns.includes('은퇴') || targetAns.includes('50') || targetAns.includes('중장년')) targetPersona = '인생 2막을 준비하며 평생 현역의 무기를 찾는 5060 세대'

  const brandProfile: BrandProfileDraft = {
    oneLiner: `나는 ${targetPersona}이 자신의 경험을 브랜드로 세울 수 있도록 1:1 밀착 코칭으로 돕는 사람이다.`,
    coreValues,
    strengthStatement: `${memberName}님은 수십 년간 축적한 현장 경험과 위기를 기회로 바꾼 회복 탄력성을 지니며, 상대의 내면 강점을 짚어 실천적 대안을 이끄는 능력이 탁월합니다.`,
    targetPersona,
    brandStory: '오랜 세월 조직과 일에 헌신하며 겪은 영광과 위기를 통과했고, 그 과정에서 얻은 가장 큰 배움은 타인의 성장을 돕고 연결될 때 진짜 나다운 빛이 난다는 깨달음이었습니다.',
    coreMessage: '당신이 살아내어 이뤄낸 수십 년의 시간은 누군가의 막막한 길을 비추는 가장 선명한 지도가 됩니다.',
    channelStrategy: '1순위: 1:1 브랜딩 코칭 및 전문 컨설팅. 2순위: 소규모 그룹 워크숍과 가독성 높은 텍스트 채널 필진 참여.',
    brandWhy: '직함 너머의 참된 가치와 고유한 강점을 연결해, 나이와 환경에 구애받지 않고 평생 주체적인 삶을 살아가도록 돕기 위함입니다.',
  }

  const questionInsights: QuestionInsight[] = COACHING_QUESTIONS.map((q) => {
    const has = getAnsText(q.id).length > 0
    const part = q.id <= 10 ? 'PART 1. 삶의 궤적·과거 내면 자산'
      : q.id <= 22 ? 'PART 2. 현재 강점·차별화 자산'
      : q.id <= 32 ? 'PART 3. 미래 가치 지향·채널 적합성'
      : 'PART 4. 최종 브랜드 언어 번역'
    return has
      ? {
          questionId: q.id,
          matchedPattern: '가치관·태도로 말함',
          brandingSignal: '내면 정체성 의식이 상당 부분 정돈되어 있습니다.',
          coachingMessage: `"${getAnsText(q.id).slice(0, 18)}..." 답변에서 오래 삶을 진지하게 대면해 온 깊이가 전달됩니다. 이 부분을 인터뷰에서 조명해 주세요.`,
          profileConnection: part,
        }
      : {
          questionId: q.id,
          matchedPattern: '답변 없음',
          brandingSignal: '해당 영역 탐색이 진행되지 않았습니다.',
          coachingMessage: '인터뷰 중 가벼운 대화로 풀어 해당 영역 키워드를 이끌어내 보세요.',
          profileConnection: part,
        }
  })

  return { brandProfile, questionInsights }
}
