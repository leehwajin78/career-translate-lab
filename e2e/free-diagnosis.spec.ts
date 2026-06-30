import { test, expect } from '@playwright/test'

/* =============================================================
 * WI-08 — 무료 진단 퍼널 E2E (System 1 통일)
 *   /diagnosis → 기본정보 → 7문항 + Q8(보유 산출물) → 분석 → 리포트.
 *   리포트의 유형·점수는 클라이언트 analyzeFree 가 즉시 계산하므로
 *   DB 없이 `pnpm dev` 만으로 통과한다(서버 영속화는 별도 vitest 검증).
 * ============================================================= */

const ANSWER =
  '이 질문에 대해 충분히 길고 구체적으로 답변합니다. 오랜 경력의 맥락과 강점, 돕고 싶은 대상과 그 마음 상태, 나만의 관점과 방법론을 담아 설명합니다.'

test('무료 진단: 제출 → 분석 → 리포트에 유형·점수가 표시된다', async ({ page }) => {
  await page.goto('/diagnosis')

  // STEP 0 — 기본 정보 + 개인정보 동의
  await page.fill('#name', 'E2E 테스터')
  await page.fill('#email', `e2e+${Date.now()}@example.com`)
  await page.selectOption('#careerYears', { index: 1 })
  await page.locator('input[type="checkbox"]').first().check()
  await page.getByRole('button', { name: '무료 진단 시작하기' }).click()

  // Q1~Q7 — 주관식
  for (let i = 1; i <= 7; i++) {
    const ta = page.locator('textarea')
    await expect(ta).toBeVisible()
    await ta.fill(ANSWER)
    await page.getByRole('button', { name: '다음' }).click()
  }

  // Q8 — 보유 산출물(체크박스 1개 이상 선택해야 '진단 완료' 활성화)
  await page.getByRole('checkbox').first().click()
  await page.getByRole('button', { name: '진단 완료' }).click()

  // 분석 로딩(12초 고정) 후 리포트 — 유형 배지 + 총점
  await expect(page.getByText('님의 경력 가치 레포트')).toBeVisible({ timeout: 20_000 })
  await expect(page.getByText('경력 가치 점수')).toBeVisible()       // 4영역 점수 섹션
  await expect(page.getByText('/ 100점', { exact: true })).toBeVisible() // 총점(산출물 점수와 구분)
})

test('/result(구버전)는 /diagnosis 로 리다이렉트된다', async ({ page }) => {
  await page.goto('/result')
  await expect(page).toHaveURL(/\/diagnosis$/)
})
