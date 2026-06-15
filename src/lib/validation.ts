import { z } from 'zod'

export const CAREER_YEARS = [
  '10년 미만', '10~15년', '15~20년',
  '20~25년', '25~30년', '30년 이상',
] as const

// 무료 진단 제출 스키마
export const FreeDiagnosisSchema = z.object({
  email: z.string().email('올바른 이메일 형식을 입력해주세요'),
  name: z.string().min(1, '이름을 입력해주세요').max(50, '이름은 50자 이내로 입력해주세요'),
  careerYears: z.enum(CAREER_YEARS, { errorMap: () => ({ message: '경력 연수를 선택해주세요' }) }),
  answers: z.record(
    z.string().regex(/^q\d+$/, '유효하지 않은 문항 키'),
    z.string().min(5, '5자 이상 입력해주세요').max(2000, '2000자 이내로 입력해주세요')
  ),
  bonusChecks: z.array(z.string()).default([]),
  consentAt: z.string().datetime('유효하지 않은 시간 형식'),
})

export type FreeDiagnosisInput = z.infer<typeof FreeDiagnosisSchema>

// 상담 신청 스키마
export const ConsultationSchema = z.object({
  name: z.string().min(1, '이름을 입력해주세요').max(50),
  email: z.string().email('올바른 이메일 형식을 입력해주세요'),
  phone: z
    .string()
    .regex(/^(010|011|016|017|018|019)-?\d{3,4}-?\d{4}$/, '올바른 전화번호를 입력해주세요'),
  careerField: z.string().min(1, '전문 분야를 입력해주세요').max(100),
  careerYears: z.enum(CAREER_YEARS, { errorMap: () => ({ message: '경력 연수를 선택해주세요' }) }),
  message: z.string().max(1000, '1000자 이내로 입력해주세요').optional(),
  preferredTime: z.string().optional(),
  consentAt: z.string().datetime(),
})

export type ConsultationInput = z.infer<typeof ConsultationSchema>

// 로그인 스키마
export const LoginSchema = z.object({
  email: z.string().email('올바른 이메일 형식을 입력해주세요'),
  password: z.string().min(8, '비밀번호는 8자 이상이어야 합니다'),
})

export type LoginInput = z.infer<typeof LoginSchema>

// 코칭 답변 스키마 (단건)
export const CoachingAnswerSchema = z.object({
  sessionId: z.string().uuid(),
  questionId: z.number().int().min(1).max(42),
  textAnswer: z.string().max(5000).optional(),
  voiceUrl: z.string().url().optional(),
  voiceMime: z.string().optional(),
  voiceDuration: z.number().int().min(0).max(600).optional(),
})

export type CoachingAnswerInput = z.infer<typeof CoachingAnswerSchema>

// 공통 에러 메시지 변환
export function getErrorMessage(error: unknown): string {
  const MESSAGES: Record<string, string> = {
    UNAUTHORIZED: '로그인이 필요합니다.',
    FORBIDDEN: '접근 권한이 없습니다.',
    RATE_LIMITED: '잠시 후 다시 시도해주세요.',
    ALREADY_SUBMITTED: '이미 제출된 답변입니다.',
    FILE_TOO_LARGE: '파일 크기가 10MB를 초과합니다.',
    SERVICE_UNAVAILABLE: '서비스가 일시적으로 불안정합니다. 잠시 후 다시 시도해주세요.',
    INTERNAL_ERROR: '오류가 발생했습니다. 문제가 지속되면 070-4090-2161로 연락해주세요.',
  }

  if (error && typeof error === 'object' && 'error' in error) {
    const code = (error as { error: string }).error
    return MESSAGES[code] ?? MESSAGES.INTERNAL_ERROR
  }

  if (error instanceof Error) return error.message

  return MESSAGES.INTERNAL_ERROR
}
